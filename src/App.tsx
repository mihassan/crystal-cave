import { useEffect, useRef, useState } from 'react';
import './index.css';
import { GameEngine } from './game/GameEngine';
import { formatTime } from './game/utils/helpers';

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<GameEngine | null>(null);

    const [gameState, setGameState] = useState('HOME');
    const [hudData, setHudData] = useState({ lives: 3, score: 0, level: 1, time: 0 });
    const [levelStats, setLevelStats] = useState({ time: 0, best: 0, isRecord: false, kills: 0, points: 0 });
    const [careerStats, setCareerStats] = useState({ maxLevel: 1, totalShards: 0, bestTimes: {} as any });
    const [gameOverStats, setGameOverStats] = useState({ level: 1, score: 0 });
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        // Guard against re-initialization (React StrictMode double-mount)
        if (!canvasRef.current) return;

        // Clean up any existing engine first (handles StrictMode remount)
        if (engineRef.current) {
            engineRef.current.cleanup();
            engineRef.current = null;
        }

        engineRef.current = new GameEngine(canvasRef.current);

        // Event handlers with proper cleanup
        const handleHudUpdate = (e: any) => {
            setHudData(e.detail);
        };

        const handleLevelComplete = (e: any) => {
            setGameState('TRANSITION');
            const engine = engineRef.current;
            if (engine) {
                const best = engine.data.getBestTime(e.detail.level) || 0;
                const isRecord = engine.data.saveTime(e.detail.level, e.detail.time);
                setLevelStats({
                    time: e.detail.time,
                    best: best,
                    isRecord: isRecord,
                    kills: e.detail.kills || 0,
                    points: e.detail.points || 0
                });
            }
        };

        const handlePaused = () => setGameState('PAUSED');
        const handleResumed = () => setGameState('PLAYING');

        // Listen for game events
        window.addEventListener('hud-update', handleHudUpdate);
        window.addEventListener('level-complete', handleLevelComplete);
        window.addEventListener('game-paused', handlePaused);
        window.addEventListener('game-resumed', handleResumed);

        return () => {
            // Proper cleanup for React StrictMode
            window.removeEventListener('hud-update', handleHudUpdate);
            window.removeEventListener('level-complete', handleLevelComplete);
            window.removeEventListener('game-paused', handlePaused);
            window.removeEventListener('game-resumed', handleResumed);

            if (engineRef.current) {
                engineRef.current.cleanup();
                engineRef.current = null;
            }
        };
    }, []);

    // Poll for game state changes that might not be event-driven (or just use the engine's state)
    useEffect(() => {
        const interval = setInterval(() => {
            if (engineRef.current) {
                const engineState = engineRef.current.state.value;
                // Only sync certain states from engine to React
                // UI-only states (ABOUT, STATS) should NOT be overwritten by engine state
                const uiOnlyStates = ['ABOUT', 'STATS'];
                if (uiOnlyStates.includes(gameState)) {
                    // Don't sync - we're in a UI-only screen
                    return;
                }

                if (engineState !== gameState) {
                    // Sync state if it changed internally (e.g. game over)
                    if (engineState === 'GAMEOVER') {
                        setGameOverStats({
                            level: engineRef.current.level,
                            score: engineRef.current.score
                        });
                    }
                    setGameState(engineState);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [gameState]);

    const startGame = () => {
        if (engineRef.current) {
            // Initialize audio on Play button click
            if (!engineRef.current.audio.initialized) {
                engineRef.current.audio.init();
            }
            engineRef.current.startLevel(1);
            setGameState('PLAYING');
        }
    };

    const resumeGame = () => {
        if (engineRef.current) engineRef.current.togglePause();
    };

    const goToMainMenu = () => {
        if (engineRef.current) {
            // Reset the engine state to HOME
            engineRef.current.state.value = 'HOME';
        }
        setGameState('HOME');
    };

    const showStats = () => {
        if (engineRef.current) {
            setCareerStats({
                maxLevel: engineRef.current.data.data.maxLevel,
                totalShards: engineRef.current.data.data.totalShards,
                bestTimes: engineRef.current.data.data.bestTimes
            });
            setGameState('STATS');
        }
    };

    const nextLevel = () => {
        if (engineRef.current) {
            engineRef.current.startLevel(engineRef.current.level + 1);
            setGameState('PLAYING');
        }
    };

    const replayLevel = () => {
        if (engineRef.current) {
            engineRef.current.startLevel(engineRef.current.level);
            setGameState('PLAYING');
        }
    };

    const toggleAudio = () => {
        if (engineRef.current) {
            const muted = engineRef.current.audio.toggleMute();
            setIsMuted(muted);
        }
    };

    return (
        <div id="game-container">
            <canvas ref={canvasRef} id="gameCanvas"></canvas>

            {/* Quirky Message Toast */}
            <div id="quirky-msg"></div>

            {/* HUD */}
            <div id="hud" className={`glass-panel ${gameState !== 'PLAYING' ? 'hidden' : ''}`}>
                <div className="hud-item">
                    <span className="hud-label">Time</span>
                    <span className="hud-value" id="time-display">{formatTime(hudData.time)}</span>
                </div>
                <div className="hud-item">
                    <span className="hud-label">Level</span>
                    <span className="hud-value" id="level-display">{hudData.level}</span>
                </div>
                <div className="hud-item">
                    <span className="hud-label">Integrity</span>
                    <span className="hud-value" id="lives-display">{hudData.lives}</span>
                </div>
                <div className="hud-item">
                    <span className="hud-label">Shards</span>
                    <span className="hud-value" id="crystal-display">{hudData.score}</span>
                </div>
                <div style={{ flexGrow: 1 }}></div>
                <div id="pause-btn" className="hud-btn" onClick={() => engineRef.current?.togglePause()}>||</div>
                <div
                    id="audio-btn"
                    className="hud-btn"
                    onClick={toggleAudio}
                    style={{
                        opacity: isMuted ? 0.4 : 1,
                        textDecoration: isMuted ? 'line-through' : 'none'
                    }}
                >
                    {isMuted ? '🔇' : '🔊'}
                </div>
            </div>

            <div id="hint" className={gameState !== 'PLAYING' ? 'hidden' : ''}>Follow the Arrow to the Portal</div>

            {/* HOME SCREEN */}
            {gameState === 'HOME' && (
                <div id="home-screen" className="overlay">
                    <h1>Crystal Cave</h1>
                    <p style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '1rem', color: '#4cc9f0' }}>
                        Dragon's Lair
                    </p>
                    <div className="btn-group">
                        <button onClick={startGame}>Play</button>
                        <button className="secondary" onClick={showStats}>Career Stats</button>
                        <button className="secondary" onClick={() => setGameState('ABOUT')}>About</button>
                    </div>
                </div>
            )}

            {/* ABOUT SCREEN */}
            {gameState === 'ABOUT' && (
                <div id="about-screen" className="overlay">
                    <h2>Mission Briefing</h2>
                    <div style={{ textAlign: 'left', maxWidth: '500px', padding: '0 20px', fontSize: '1.1rem', color: '#ccc' }}>
                        <p><strong>OBJECTIVE:</strong> Pilot the Frost Sentinel drone deep into the Dragon's Lair. Locate the
                            <strong> Warp Portal</strong> to advance.
                        </p>
                        <p><strong>THREATS:</strong> Fire Dragons phase in and out. If you see a <span
                            style={{ color: '#ffaa00' }}>Orange Circle</span>, they are charging. Move out of the zone
                            immediately!</p>
                        <p><strong>CONTROLS:</strong> Touch and drag anywhere to drift. Use inertia to glide past enemies.</p>
                        <p><strong>DEFENSE:</strong> Taking a hit activates a temporary shield. Use it to escape.</p>
                    </div>
                    <div className="btn-group" style={{ marginTop: '20px' }}>
                        <button className="secondary" onClick={() => setGameState('HOME')}>Back</button>
                    </div>
                </div>
            )}

            {/* STATS SCREEN */}
            {gameState === 'STATS' && (
                <div id="stats-screen" className="overlay">
                    <h2>Career Record</h2>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">Max Level</span>
                            <span className="stat-val">{careerStats.maxLevel}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Total Shards</span>
                            <span className="stat-val">{careerStats.totalShards}</span>
                        </div>
                    </div>
                    <h3>Speedrun Records</h3>
                    <div id="stats-list" className="scroll-list">
                        {Object.keys(careerStats.bestTimes).length === 0 ? (
                            <div style={{ padding: '10px', color: '#888' }}>No records yet.</div>
                        ) : (
                            Object.keys(careerStats.bestTimes).sort((a: any, b: any) => a - b).map((lvl: any) => (
                                <div className="list-row" key={lvl}>
                                    <span>Sector {lvl}</span>
                                    <span style={{ color: '#ffd700' }}>{formatTime(careerStats.bestTimes[lvl])}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="btn-group">
                        <button className="secondary" onClick={() => setGameState('HOME')}>Back</button>
                    </div>
                </div>
            )}

            {/* PAUSE SCREEN */}
            {gameState === 'PAUSED' && (
                <div id="pause-screen" className="overlay">
                    <h2>System Paused</h2>
                    <div className="btn-group">
                        <button onClick={resumeGame}>Resume</button>
                        <button className="secondary" onClick={replayLevel}>Retry Level</button>
                        <button className="secondary" onClick={goToMainMenu}>Quit to Menu</button>
                    </div>
                </div>
            )}

            {/* LEVEL CLEAR SCREEN */}
            {gameState === 'TRANSITION' && (
                <div id="level-screen" className="overlay">
                    <h2>Level Cleared</h2>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">Time Taken</span>
                            <span className="stat-val">{formatTime(levelStats.time)}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Best Record</span>
                            <span className="stat-val">{formatTime(levelStats.best)}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Dragons Slain</span>
                            <span className="stat-val">{levelStats.kills}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Level Points</span>
                            <span className="stat-val">{levelStats.points}</span>
                        </div>
                    </div>
                    {levelStats.isRecord && <div className="new-record">NEW RECORD!</div>}
                    <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>Hull Integrity Restored (+1 Life)</p>
                    <div className="btn-group">
                        <button onClick={nextLevel}>Next Sector</button>
                        <button className="secondary" onClick={replayLevel}>Replay for Time</button>
                        <button className="secondary" onClick={goToMainMenu}>Quit</button>
                    </div>
                </div>
            )}

            {/* GAME OVER SCREEN */}
            {gameState === 'GAMEOVER' && (
                <div id="game-over-screen" className="overlay">
                    <h1 style={{ color: '#ff4d4d', filter: 'drop-shadow(0 0 20px #ff0000)' }}>Incinerated</h1>
                    <p>Signal Lost.</p>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <span className="stat-label">Sector</span>
                            <span className="stat-val" style={{ color: '#4cc9f0' }}>{gameOverStats.level}</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-label">Shards</span>
                            <span className="stat-val">{gameOverStats.score}</span>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button onClick={startGame}>Reboot System</button>
                        <button className="secondary" onClick={goToMainMenu}>Main Menu</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
