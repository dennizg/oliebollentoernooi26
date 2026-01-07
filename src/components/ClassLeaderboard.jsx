import React from 'react';

const ClassLeaderboard = ({ classStats }) => {
    // Find max points for relative bar width
    const maxPoints = Math.max(...classStats.map(c => c.points), 1);

    return (
        <div className="leaderboard-container">
            <h2 style={{
                fontSize: '2.5rem',
                marginBottom: '1.5rem',
                background: 'linear-gradient(90deg, #fff, #aaa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Klassement
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {classStats.map((cls, index) => (
                    <div key={cls.id} style={{ position: 'relative' }}>
                        {/* Bar Container */}
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative'
                        }}>
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
                                padding: '0 2rem',
                                color: '#fff',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 'bold', width: '40px' }}>#{index + 1}</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '800', textTransform: 'uppercase' }}>{cls.name}</span>
                                </div>
                                <span style={{ fontSize: '3rem', fontWeight: '900' }}>{cls.points}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassLeaderboard;
