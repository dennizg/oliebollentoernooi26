import React from 'react';
import { SPORTS, CLASSES } from '../data/mockData';

const SportLeaderboard = ({ teamStandings }) => {
    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {SPORTS.map(sport => {
                const teams = teamStandings.filter(t => t.sport === sport.id)
                    .sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff); // Basic sort

                return (
                    <div key={sport.id} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        borderTop: `4px solid ${sport.color}`
                    }}>
                        <h3 style={{
                            color: sport.color,
                            marginBottom: '1rem',
                            fontSize: '1.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>{sport.name}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {teams.map((team, idx) => {
                                // Find color for team based on Class ID
                                const teamColor = CLASSES.find(c => c.id === team.classId)?.color || '#fff';

                                return (
                                    <div key={team.teamId} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.8rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: '8px',
                                        borderLeft: idx === 0 ? `4px solid ${teamColor}` : '4px solid transparent'
                                    }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <span style={{ opacity: 0.5, width: '20px' }}>{idx + 1}.</span>
                                            <span style={{ fontWeight: 'bold' }}>{team.teamName}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', opacity: 0.8 }}>
                                            <span title="Gespeeld">G: {team.played}</span>
                                            <span title="Doelsaldo">DS: {team.goalDiff}</span>
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
