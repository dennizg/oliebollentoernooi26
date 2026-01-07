import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_MATCHES, TEAMS, CLASSES, SPORTS } from '../data/mockData';

const TournamentContext = createContext();

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider = ({ children }) => {
    // State
    const [matches, setMatches] = useState(() => {
        const saved = localStorage.getItem('oliebol_matches');
        return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    });

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('oliebol_matches', JSON.stringify(matches));
    }, [matches]);

    // Sync across tabs (e.g. Admin on laptop screen, Dashboard on beamer)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'oliebol_matches' && e.newValue) {
                setMatches(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Actions
    const updateScore = (matchId, score1, score2) => {
        setMatches(prev => prev.map(match => {
            if (match.id === matchId) {
                const isFinished = score1 !== '' && score2 !== '' && score1 !== null && score2 !== null;
                return { ...match, score1, score2, status: isFinished ? 'finished' : 'scheduled' };
            }
            return match;
        }));
    };

    const resetTournament = () => {
        setMatches(INITIAL_MATCHES);
        localStorage.removeItem('oliebol_matches');
    };

    // Calculations
    const standings = useMemo(() => {
        // --- PASS 1: Calculate Sport/Team Standings (EXCLUDING FINALS) ---
        const teamStats = {};
        const getKey = (teamId, sport) => `${sport}-${teamId}`;

        // Initialize entries
        Object.entries(TEAMS).forEach(([sport, teamList]) => {
            teamList.forEach(team => {
                teamStats[getKey(team.id, sport)] = {
                    teamId: team.id,
                    teamName: team.name,
                    classId: team.classId,
                    sport: sport,
                    played: 0,
                    won: 0,
                    drawn: 0,
                    lost: 0,
                    points: 0,
                    goalsFor: 0,
                    goalsAgainst: 0,
                    goalDiff: 0
                };
            });
        });

        // Loop matches for TEAM stats (SKIP FINALS)
        matches.forEach(match => {
            if (match.status !== 'finished') return;
            if (match.type === 'final') return; // IMPORTANT: Do not count finals for team rankings

            const entry1 = teamStats[getKey(match.team1, match.sport)];
            const entry2 = teamStats[getKey(match.team2, match.sport)];

            if (!entry1 || !entry2) return;

            const s1 = parseInt(match.score1 || 0);
            const s2 = parseInt(match.score2 || 0);

            entry1.played += 1;
            entry2.played += 1;
            entry1.goalsFor += s1;
            entry1.goalsAgainst += s2;
            entry2.goalsFor += s2;
            entry2.goalsAgainst += s1;
            entry1.goalDiff = entry1.goalsFor - entry1.goalsAgainst;
            entry2.goalDiff = entry2.goalsFor - entry2.goalsAgainst;

            if (s1 > s2) {
                entry1.won += 1;
                entry1.points += 3;
                entry2.lost += 1;
            } else if (s2 > s1) {
                entry2.won += 1;
                entry2.points += 3;
                entry1.lost += 1;
            } else {
                entry1.drawn += 1;
                entry1.points += 1;
                entry2.drawn += 1;
                entry2.points += 1;
            }
        });

        const teamStandings = Object.values(teamStats);


        // --- PASS 2: Calculate Class Standings (INCLUDING FINALS) ---
        // Implementation Note: We can iterate matches again, calculate points, and aggregate directly to class.

        const classStatsMap = CLASSES.reduce((acc, cls) => {
            acc[cls.id] = { ...cls, points: 0 };
            return acc;
        }, {});

        matches.forEach(match => {
            if (match.status !== 'finished') return;
            // No check for 'final' here - we count everything for the class!

            const s1 = parseInt(match.score1 || 0);
            const s2 = parseInt(match.score2 || 0);

            // Determine points for this specific match
            let p1 = 0;
            let p2 = 0;

            if (s1 > s2) { p1 = 3; }
            else if (s2 > s1) { p2 = 3; }
            else { p1 = 1; p2 = 1; }

            // Find valid teams to attribute points to class
            // BUT: Finals might use names like "1A" directly, or might need lookup if we used complex objects.
            // In our system, match.team1 IS the ID (e.g., "1A", "1B1").
            // We need to find the ClassID from the TeamID.

            // Helper to find class ID
            const getClassId = (teamStr) => {
                // Try to look up in TEAMS
                for (const sport in TEAMS) {
                    const t = TEAMS[sport].find(team => team.id === teamStr || team.name === teamStr);
                    if (t) return t.classId;
                }
                // Fallback: If name starts with 1A, 1B etc.
                if (teamStr.startsWith('1A')) return '1A';
                if (teamStr.startsWith('1B')) return '1B';
                if (teamStr.startsWith('1C')) return '1C';
                if (teamStr.startsWith('1D')) return '1D';
                return null;
            };

            const class1 = getClassId(match.team1);
            const class2 = getClassId(match.team2);

            if (class1 && classStatsMap[class1]) classStatsMap[class1].points += p1;
            if (class2 && classStatsMap[class2]) classStatsMap[class2].points += p2;
        });

        const classStats = Object.values(classStatsMap);
        classStats.sort((a, b) => b.points - a.points);

        return { teamStandings, classStats };
    }, [matches]);

    const generateFinals = () => {
        // Check if finals already exist to prevent duplicates?
        // Simple check: if any match has 'type' === 'final'
        if (matches.some(m => m.type === 'final')) {
            if (!confirm('Finales lijken al gegenereerd. Wil je ze opnieuw genereren? (Bestaande scores in finales gaan verloren)')) return;
            // Remove old finals
            setMatches(prev => prev.filter(m => m.type !== 'final'));
        }

        const newMatches = [];
        const { teamStandings } = standings; // Accessing the memoized standings

        SPORTS.forEach(sport => {
            // Get teams for this sport
            const sportTeams = teamStandings.filter(t => t.sport === sport.id);
            // Sort by points, then goalDiff, then goalsFor
            sportTeams.sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
                return b.goalsFor - a.goalsFor;
            });

            // We need at least 2 teams for a final.
            // Description says: 1vs2 (Gold), 3vs4 (Bronze), 5vs6 (Iron/IJzeren)

            // Gold Final
            if (sportTeams.length >= 2) {
                newMatches.push({
                    id: `final-${sport.id}-gold`,
                    sport: sport.id,
                    team1: sportTeams[0].teamName, // Using names for simplicity in display
                    team2: sportTeams[1].teamName,
                    score1: null,
                    score2: null,
                    status: 'scheduled',
                    type: 'final',
                    round: 'Grote Finale',
                    time: '12:00' // Placeholder
                });
            }

            // Bronze Final
            if (sportTeams.length >= 4) {
                newMatches.push({
                    id: `final-${sport.id}-bronze`,
                    sport: sport.id,
                    team1: sportTeams[2].teamName,
                    team2: sportTeams[3].teamName,
                    score1: null,
                    score2: null,
                    status: 'scheduled',
                    type: 'final',
                    round: 'Bronzen Finale',
                    time: '11:45'
                });
            }

            // Iron Final
            if (sportTeams.length >= 6) {
                newMatches.push({
                    id: `final-${sport.id}-iron`,
                    sport: sport.id,
                    team1: sportTeams[4].teamName,
                    team2: sportTeams[5].teamName,
                    score1: null,
                    score2: null,
                    status: 'scheduled',
                    type: 'final',
                    round: 'IJzeren Finale',
                    time: '11:30'
                });
            }
        });

        if (newMatches.length > 0) {
            setMatches(prev => [...prev.filter(m => m.type !== 'final'), ...newMatches]);
        } else {
            alert('Niet genoeg data om finales te genereren.');
        }
    };

    return (
        <TournamentContext.Provider value={{
            matches,
            updateScore,
            resetTournament,
            generateFinals,
            standings
        }}>
            {children}
        </TournamentContext.Provider>
    );
};
