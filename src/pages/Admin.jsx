import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { SPORTS } from '../data/mockData';

const Admin = () => {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { matches, updateScore, resetTournament, generateFinals } = useTournament();
    const [filterSport, setFilterSport] = useState('all');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'Oliebol') {
            setIsAuthenticated(true);
        } else {
            alert('Fout wachtwoord!');
        }
    };

    const handleScoreChange = (matchId, team, value) => {
        const match = matches.find(m => m.id === matchId);
        if (!match) return;

        let s1 = match.score1;
        let s2 = match.score2;

        if (team === 1) s1 = value;
        else s2 = value;

        updateScore(matchId, s1, s2);
    };

    const filteredMatches = filterSport === 'all'
        ? matches
        : matches.filter(m => m.sport === filterSport);

    if (!isAuthenticated) {
        return (
            <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
                <h1>Admin Login</h1>
                <form onSubmit={handleLogin} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Wachtwoord"
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Wedstrijdbeheer</h1>
                <button
                    onClick={() => generateFinals()}
                    style={{ backgroundColor: 'var(--color-sport-basketbal)', color: 'white' }}
                >
                    🏆 Genereer Finales
                </button>
                <button
                    onClick={() => { if (window.confirm('Weet je zeker dat je ALLES wilt resetten?')) resetTournament(); }}
                    style={{ backgroundColor: 'red', color: 'white' }}
                >
                    ⚠️ Reset Toernooi
                </button>
            </header>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setFilterSport('all')} style={{ opacity: filterSport === 'all' ? 1 : 0.5 }}>Alles</button>
                {SPORTS.map(sport => (
                    <button
                        key={sport.id}
                        onClick={() => setFilterSport(sport.id)}
                        style={{ opacity: filterSport === sport.id ? 1 : 0.5, borderBottom: `2px solid ${sport.color}` }}
                    >
                        {sport.name}
                    </button>
                ))}
            </div>

            <div className="match-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredMatches.map(match => {
                    const sportConfig = SPORTS.find(s => s.id === match.sport);
                    const sportColor = sportConfig?.color || 'white';
                    const sportLetter = sportConfig?.name?.[0] || '?';

                    // Calculate global match number (1-based)
                    const matchNumber = matches.findIndex(m => m.id === match.id) + 1;

                    return (
                        <div key={match.id} style={{
                            display: 'grid',
                            gridTemplateColumns: '50px 1fr 2fr 1fr 2fr 50px 1fr', // Added col for number
                            alignItems: 'center',
                            background: 'var(--bg-card)',
                            padding: '1rem',
                            borderRadius: '8px',
                            gap: '1rem'
                        }}>
                            {/* Sport Indicator */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: sportColor,
                                color: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                fontSize: '1.2rem'
                            }}>
                                {sportLetter}
                            </div>

                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{match.time}</span>
                            <span style={{ fontWeight: 'bold' }}>{match.team1}</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input
                                    type="number"
                                    value={match.score1 === null ? '' : match.score1}
                                    onChange={(e) => handleScoreChange(match.id, 1, e.target.value)}
                                    style={{ width: '50px', padding: '5px', textAlign: 'center' }}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    value={match.score2 === null ? '' : match.score2}
                                    onChange={(e) => handleScoreChange(match.id, 2, e.target.value)}
                                    style={{ width: '50px', padding: '5px', textAlign: 'center' }}
                                />
                            </div>
                            <span style={{ fontWeight: 'bold', textAlign: 'right' }}>{match.team2}</span>

                            {/* Match Number */}
                            <span style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: '#666',
                                textAlign: 'right'
                            }}>
                                #{matchNumber}
                            </span>

                            <span style={{ fontSize: '0.8rem', opacity: 0.5, textAlign: 'right' }}>{match.status === 'finished' ? '✅' : '⏳'}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Admin;
