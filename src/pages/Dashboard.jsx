import React from 'react';
import { useTournament } from '../context/TournamentContext';
import ClassLeaderboard from '../components/ClassLeaderboard';
import SportLeaderboard from '../components/SportLeaderboard';

const Dashboard = () => {
    const { standings } = useTournament();

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">
                    OLIEBOLLENTOERNOOI 2026
                </h1>
            </header>

            <div className="dashboard-grid">
                {/* Left Column: Main Class Standings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                    <ClassLeaderboard classStats={standings.classStats} />
                </div>

                {/* Right Column: Sport Standings */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 0 // Flexbox fix
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
