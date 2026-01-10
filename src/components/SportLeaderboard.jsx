import React from 'react';
import { SPORTS, CLASSES } from '../data/mockData';

const SportLeaderboard = ({ teamStandings }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
            {SPORTS.map(sport => {
                const teams = teamStandings.filter(t => t.sport === sport.id)
                    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff); // Basic sort

                return (
                    <div key={sport.id} className="sport-card" style={{ borderTop: `4px solid ${sport.color}` }}>
                        <h3 className="sport-title" style={{ color: sport.color }}>{sport.name}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto', scrollbarWidth: 'none' }}>
                            {teams.map((team, idx) => {
                                // Find color for team based on Class ID
                                const teamColor = CLASSES.find(c => c.id === team.classId)?.color || '#fff';

                                return (
                                    <div key={team.teamId} className="sport-row" style={{
                                        borderLeft: idx === 0 ? `4px solid ${teamColor}` : '4px solid transparent'
                                    }}>
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            <span style={{ opacity: 0.5, width: '15px' }}>{idx + 1}.</span>
                                            <span style={{ fontWeight: 'bold' }}>{team.teamName}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.8rem', opacity: 0.8 }}>
                                            <span title="Gespeeld">G: {team.played}</span>
                                            <span title="Punten" style={{ fontWeight: 'bold', color: 'white' }}>{team.points}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SportLeaderboard;
