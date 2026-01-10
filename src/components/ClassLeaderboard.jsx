import React from 'react';

const ClassLeaderboard = ({ classStats }) => {
    // Find max points for relative bar width
    const maxPoints = Math.max(...classStats.map(c => c.points), 1);

    return (
        <div className="leaderboard-container">
            <h2 className="class-board-title">
                Klassement
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {classStats.map((cls, index) => (
                    <div key={cls.id} style={{ position: 'relative' }}>
                        {/* Bar Container */}
                        <div className="class-bar">
                            {/* Filling Bar */}
                            <div style={{
                                width: `${(cls.points / maxPoints) * 100}%`,
                                background: cls.color,
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                opacity: 0.8,
                                boxShadow: `0 0 20px ${cls.color}`
                            }} />

                            {/* Text Content */}
                            <div style={{
                                position: 'relative',
                                zIndex: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                padding: '0 1.5rem',
                                color: '#fff',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span className="class-bar-rank">#{index + 1}</span>
                                    <span className="class-bar-name">{cls.name}</span>
                                </div>
                                <span className="class-bar-points">{cls.points}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassLeaderboard;
