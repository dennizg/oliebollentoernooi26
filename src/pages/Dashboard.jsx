import React from 'react';
import { useTournament } from '../context/TournamentContext';
import ClassLeaderboard from '../components/ClassLeaderboard';
import SportLeaderboard from '../components/SportLeaderboard';

const Dashboard = () => {
    const { standings } = useTournament();

    return (
        <div style={{
            height: '100vh',
            padding: '2rem',
            background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
            color: 'white',
            overflow: 'hidden', // Prevent scroll on main dashboard if possible
            display: 'flex',
            flexDirection: 'column'
        }}>
            <header style={{
                textAlign: 'center',
                marginBottom: '2rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '1rem'
            }}>
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 900,
                    backgroundImage: 'linear-gradient(45deg, #FF9900, #FF0000, #0055FF)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradient 5s linear infinite'
                }}>
                    OLIEBOLLENTOERNOOI 2026
                </h1>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '3rem',
                height: '100%',
                overflow: 'hidden'
            }}>
                {/* Left Column: Main Class Standings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <ClassLeaderboard classStats={standings.classStats} />

                    {/* Maybe put finals status here if any? */}
                </div>

                {/* Right Column: Sport Standings (Scrollable if needed, but better fit) */}
                <div style={{
                    overflowY: 'auto',
                    paddingRight: '1rem',
                    scrollbarWidth: 'thin',
                    height: 'calc(100vh - 150px)'
                }}>
                    <SportLeaderboard teamStandings={standings.teamStandings} />
                </div>
            </div>

            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
