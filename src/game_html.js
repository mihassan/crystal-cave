export const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Crystal Cave: Dragon's Lair</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='c' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2300ffff'/%3E%3Cstop offset='100%25' style='stop-color:%230077b6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpolygon points='16,2 28,12 24,30 8,30 4,12' fill='url(%23c)'/%3E%3Cpolygon points='16,2 16,30 8,30 4,12' fill='rgba(0,0,0,0.2)'/%3E%3Cpolygon points='16,2 20,8 16,10 12,8' fill='rgba(255,255,255,0.5)'/%3E%3C/svg%3E">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
    <style>:root {
    --bg-color: #050810;
    --ui-bg: rgba(15, 23, 42, 0.85);
    --ui-border: rgba(100, 200, 255, 0.3);
    --gold: #ffd700;
    --accent: #4cc9f0;
}

body {
    margin: 0;
    overflow: hidden;
    background-color: var(--bg-color);
    font-family: 'Rajdhani', sans-serif;
    touch-action: none;
    user-select: none;
    color: #fff;
}

#game-container {
    position: absolute;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

canvas { 
    display: block;
    width: 100%;
    height: 100%;
}

/* UI Styles */
.glass-panel {
    background: var(--ui-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--ui-border);
    border-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
}

.overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    transition: opacity 0.3s ease;
    background: rgba(5, 8, 16, 0.85);
}

.hidden { opacity: 0; pointer-events: none; z-index: -1; }

h1 {
    font-size: 4rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 6px;
    background: linear-gradient(to bottom, #fff, var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 20px rgba(76, 201, 240, 0.6));
    text-align: center;
    line-height: 1;
}

h2 {
    font-size: 2.5rem;
    color: var(--accent);
    margin: 0 0 1.5rem 0;
    text-shadow: 0 0 10px var(--accent);
    text-transform: uppercase;
}

p {
    font-size: 1.2rem;
    max-width: 600px;
    text-align: center;
    color: #cbd5e1;
    margin-bottom: 2rem;
    line-height: 1.6;
}

/* Buttons */
.btn-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 300px;
}

button {
    padding: 15px 40px;
    font-size: 1.4rem;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
    transition: all 0.2s;
    width: 100%;
}

button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5); filter: brightness(1.2); }
button:active { transform: scale(0.98); }

button.secondary {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: none;
}
button.secondary:hover { background: rgba(255, 255, 255, 0.2); }

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
    text-align: center;
    background: rgba(0,0,0,0.4);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    width: 80%;
    max-width: 500px;
}
.stat-box { display: flex; flex-direction: column; }
.stat-label { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
.stat-val { font-size: 1.8rem; font-weight: bold; color: #fff; }
.new-record { color: var(--gold); text-shadow: 0 0 10px var(--gold); animation: pulseRecord 1s infinite; }

.scroll-list {
    max-height: 300px;
    overflow-y: auto;
    width: 100%;
    max-width: 500px;
    margin-bottom: 20px;
    background: rgba(0,0,0,0.3);
    border-radius: 8px;
    padding: 10px;
}
.list-row {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}
.list-row:last-child { border-bottom: none; }

/* HUD */
#hud {
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 10px 20px;
    display: flex;
    gap: 20px;
    align-items: center;
    z-index: 5;
    pointer-events: none;
}
.hud-item { display: flex; flex-direction: column; align-items: center; }
.hud-label { font-size: 0.75rem; color: var(--accent); opacity: 0.9; text-transform: uppercase; }
.hud-value { font-size: 1.4rem; font-weight: 700; }
#time-display { font-family: 'Courier New', monospace; letter-spacing: -1px; }

.hud-btn {
    pointer-events: auto;
    cursor: pointer;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.2);
    font-size: 1.2rem;
    transition: 0.2s;
}
.hud-btn:hover { background: rgba(255,255,255,0.2); }

#hint {
    position: absolute;
    bottom: 30px;
    width: 100%;
    text-align: center;
    font-size: 1.2rem;
    color: rgba(255,255,255,0.5);
    pointer-events: none;
    text-transform: uppercase;
    letter-spacing: 2px;
    animation: pulse 3s infinite;
}

/* Quirky Messages */
#quirky-msg {
    position: absolute;
    top: 18%; 
    width: 100%;
    text-align: center;
    font-size: 1.8rem;
    color: #ffd700;
    text-shadow: 0 2px 10px rgba(0,0,0,0.9), 0 0 20px #ffd700;
    pointer-events: none;
    transition: opacity 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
    z-index: 8;
    font-weight: 800;
    letter-spacing: 1px;
}
#quirky-msg.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}

@keyframes pulse { 0% { opacity: 0.3; } 50% { opacity: 0.7; } 100% { opacity: 0.3; } }
@keyframes pulseRecord { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
</style>
</head>

<body>

    <div id="game-container">
        <canvas id="gameCanvas"></canvas>

        <!-- Quirky Message Toast -->
        <div id="quirky-msg"></div>

        <!-- HUD -->
        <div id="hud" class="glass-panel hidden">
            <div class="hud-item">
                <span class="hud-label">Time</span>
                <span class="hud-value" id="time-display">00:00</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Level</span>
                <span class="hud-value" id="level-display">1</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Integrity</span>
                <span class="hud-value" id="lives-display">3</span>
            </div>
            <div class="hud-item">
                <span class="hud-label">Shards</span>
                <span class="hud-value" id="crystal-display">0</span>
            </div>
            <div style="flex-grow:1"></div>
            <div id="pause-btn" class="hud-btn">||</div>
            <div id="audio-btn" class="hud-btn">🔊</div>
        </div>

        <div id="hint" class="hidden">Follow the Arrow to the Portal</div>

        <!-- HOME SCREEN -->
        <div id="home-screen" class="overlay">
            <h1>Crystal Cave</h1>
            <p style="letter-spacing: 2px; text-transform: uppercase; font-size: 1rem; color: #4cc9f0;">Dragon's Lair
            </p>
            <div class="btn-group">
                <button id="home-play-btn">Play</button>
                <button id="home-stats-btn" class="secondary">Career Stats</button>
                <button id="home-about-btn" class="secondary">About</button>
            </div>
        </div>

        <!-- ABOUT SCREEN -->
        <div id="about-screen" class="overlay hidden">
            <h2>Mission Briefing</h2>
            <div style="text-align: left; max-width: 500px; padding: 0 20px; font-size: 1.1rem; color: #ccc;">
                <p><strong>OBJECTIVE:</strong> Pilot the Frost Sentinel drone deep into the Dragon's Lair. Locate the
                    <strong>Warp Portal</strong> to advance.
                </p>
                <p><strong>THREATS:</strong> Fire Dragons phase in and out. If you see a <span
                        style="color: #ffaa00">Orange Circle</span>, they are charging. Move out of the zone
                    immediately!</p>
                <p><strong>CONTROLS:</strong> Touch and drag anywhere to drift. Use inertia to glide past enemies.</p>
                <p><strong>DEFENSE:</strong> Taking a hit activates a temporary shield. Use it to escape.</p>
            </div>
            <div class="btn-group" style="margin-top: 20px;">
                <button id="about-back-btn" class="secondary">Back</button>
            </div>
        </div>

        <!-- STATS SCREEN -->
        <div id="stats-screen" class="overlay hidden">
            <h2>Career Record</h2>
            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-label">Max Level</span>
                    <span class="stat-val" id="stat-max-level">1</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Total Shards</span>
                    <span class="stat-val" id="stat-total-shards">0</span>
                </div>
            </div>
            <h3>Speedrun Records</h3>
            <div id="stats-list" class="scroll-list"></div>
            <div class="btn-group">
                <button id="stats-back-btn" class="secondary">Back</button>
            </div>
        </div>

        <!-- PAUSE SCREEN -->
        <div id="pause-screen" class="overlay hidden">
            <h2>System Paused</h2>
            <div class="btn-group">
                <button id="pause-resume-btn">Resume</button>
                <button id="pause-retry-btn" class="secondary">Retry Level</button>
                <button id="pause-quit-btn" class="secondary">Quit to Menu</button>
            </div>
        </div>

        <!-- LEVEL CLEAR SCREEN -->
        <div id="level-screen" class="overlay hidden">
            <h2>Sector Cleared</h2>
            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-label">Time Taken</span>
                    <span class="stat-val" id="level-time-val">00:00</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Best Record</span>
                    <span class="stat-val" id="level-best-val">--:--</span>
                </div>
            </div>
            <div id="new-record-msg" class="new-record hidden">NEW RECORD!</div>
            <p style="font-size: 0.9rem; margin-top: 10px;">Hull Integrity Restored (+1 Life)</p>
            <div class="btn-group">
                <button id="next-level-btn">Next Sector</button>
                <button id="replay-level-btn" class="secondary">Replay for Time</button>
                <button id="level-quit-btn" class="secondary">Quit</button>
            </div>
        </div>

        <!-- GAME OVER SCREEN -->
        <div id="game-over-screen" class="overlay hidden">
            <h1 style="color: #ff4d4d; filter: drop-shadow(0 0 20px #ff0000);">Incinerated</h1>
            <p>Signal Lost.</p>
            <div class="stats-grid">
                <div class="stat-box">
                    <span class="stat-label">Sector</span>
                    <span class="stat-val" id="final-level" style="color:#4cc9f0">1</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Shards</span>
                    <span class="stat-val" id="final-score">0</span>
                </div>
            </div>
            <div class="btn-group">
                <button id="restart-btn">Reboot System</button>
                <button id="go-home-btn" class="secondary">Main Menu</button>
            </div>
        </div>
    </div>

    <script>
// ===== game/core/constants.js =====
/**
 * Game Constants and Configuration
 * All magic numbers, colors, and configuration values
 */

// Color palette
const COLORS = {
    bg: '#050810',
    wallGlow: '#4cc9f0',
    dragonBody: '#1a0505',
    dragonGlow: '#ff4d4d',
    fire: '#ffaa00',
    player: '#ffffff',
    playerCore: '#00ffff',
    shard: '#ffffff',
    portalInner: '#ffffff',
    portalOuter: '#00ffff'
};

const CRYSTAL_COLORS = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];

// Physics constants
const PHYSICS = {
    FRICTION: 0.92,
    ACCEL: 0.35,
    MAX_SPEED: 4.5,
    JOYSTICK_MAX_RADIUS: 70
};

// Game configuration
const GAME_CONFIG = {
    CELL_SIZE_SMALL: 50,
    CELL_SIZE_LARGE: 70,
    CELL_SIZE_BREAKPOINT: 600,
    MAZE_BASE_SIZE: 9,
    MAZE_MAX_SIZE: 51,
    MAZE_GROWTH_RATE: 2,  // cells per level
    CRYSTAL_SPAWN_CHANCE: 0.08,
    PARTICLE_SPAWN_CHANCE: 0.4,
    PARTICLE_SAFETY_LIMIT: 1000,
    INVULNERABILITY_FRAMES: 120,
    DRAGON_SPAWN_ATTEMPTS: 10,
    DRAGON_MIN_DISTANCE: 5,  // cells from player
    DRAGON_LIFE: 1200,
    DRAGON_DETECT_RANGE: 3,  // cells
    DRAGON_CHASE_RANGE: 3.5,  // cells
    DRAGON_COLLISION_RANGE: 0.5,  // cells
    DRAGON_CLOSE_RANGE: 2.5,  // cells for quirky message
    DRAGON_BASE_CHARGE_TIME: 90,
    DRAGON_MIN_CHARGE_TIME: 30,
    DRAGON_CHARGE_REDUCTION: 5,  // per level
    DRAGON_ATTACK_DURATION: 60,
    DRAGON_FIRE_RATE: 3,  // frames between fireballs
    DRAGON_FIRE_SPEED: 4,
    DRAGON_DESPAWN_TIME: 60,
    DRAGON_SPAWN_TIME: 120,
    SHARD_ATTRACT_RANGE: 2.5,  // cells
    SHARD_COLLECT_RANGE: 0.6,  // cells
    PORTAL_PARTICLE_CHANCE: 0.3,
    INITIAL_DRAGONS: 2,
    MAX_DRAGONS_BASE: 3,
    DRAGONS_PER_LEVEL: 0.5,
    MAX_DRAGONS_CAP: 6,
    DRAGON_SPAWN_RATE_BASE: 300,
    DRAGON_SPAWN_RATE_REDUCTION: 20,  // per level
    DRAGON_SPAWN_RATE_MIN: 150,
    IDLE_TRIGGER_CHANCE: 0.005,
    DUST_PARTICLES: 50
};

// Quirky messages for different events
const QUIRKY_MSGS = {
    COLLECT: ["Ooh, shiny!", "Mine!", "Sparkly!", "Bling!", "Treasure!", "Fancy rock!", "Cha-ching!", "Glow up!"],
    NEAR_DRAGON: ["Don't wake him!", "Big lizard alert!", "Sizzling nearby!", "Shhh...", "Do not pet!", "Spicy breath!", "Too hot to handle!"],
    HIT: ["Ouchie!", "Too hot!", "Need ice!", "That stings!", "Singed!", "Hull breach!", "Medic!"],
    IDLE: ["Hello?", "Taking a nap?", "Dragons don't wait!", "Move it!", "Echo... echo...", "Engine cooling?"]
};

// Quirky message configuration
const QUIRKY_CONFIG = {
    COOLDOWN: 2000,  // ms between non-urgent messages
    DISPLAY_DURATION: 2000,  // ms to show message
    COLORS: {
        HIT: '#ff6b6b',
        NEAR_DRAGON: '#ff6b6b',
        COLLECT: '#ffd700',
        DEFAULT: '#4cc9f0'
    }
};

// ===== game/utils/helpers.js =====
/**
 * Utility helper functions
 */

/**
 * Format milliseconds as MM:SS time string
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time string
 */
function formatTime(ms) {
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    s %= 60;
    return \`\${m < 10 ? '0' + m : m}:\${s < 10 ? '0' + s : s}\`;
}

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Hide all overlays and HUD elements
 */
function hideAllScreens() {
    document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('hint').classList.add('hidden');
    // Hide quirky msg if switching screens
    document.getElementById('quirky-msg').classList.remove('visible');
}

// ===== game/entities/Cell.js =====
/**
 * Cell class for maze generation
 */
class Cell {
    constructor(c, r) {
        this.c = c;  // Column
        this.r = r;  // Row
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        this.visited = false;
    }
}

// ===== game/entities/Particle.js =====
/**
 * Particle entity - visual effects system
 */
// import removed

class Particle {
    constructor(x, y, type, vx = 0, vy = 0, color = null, cellSize = 60) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0;

        if (type === 'trail') {
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 4 + 2;
            this.decay = 0.05;
            this.color = color || COLORS.playerCore;
        }
        else if (type === 'fire') {
            this.vx = vx + (Math.random() - 0.5);
            this.vy = vy + (Math.random() - 0.5);
            this.size = Math.random() * 6 + 4;
            this.decay = 0.08;
            this.color = COLORS.fire;
        }
        else if (type === 'spark') {
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.size = Math.random() * 3 + 1;
            this.decay = 0.03;
            this.color = color || '#fff';
        }
        else if (type === 'dust') {
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.size = Math.random() * 2;
            this.life = Math.random();
            this.decay = 0.00;
            this.color = 'rgba(100, 200, 255, 0.2)';
        }
        else if (type === 'portal') {
            this.x = x + (Math.random() - 0.5) * cellSize;
            this.y = y + (Math.random() - 0.5) * cellSize;
            this.vx = 0;
            this.vy = -1 - Math.random();
            this.size = Math.random() * 3 + 1;
            this.decay = 0.02;
            this.color = '#fff';
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.globalAlpha = this.type === 'dust' ? 0.3 : this.life;
        ctx.fillStyle = this.color;

        if (this.type === 'fire' && this.life < 0.5) {
            ctx.fillStyle = '#ff3300';
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (this.type === 'fire' ? 1 : this.life), 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===== game/entities/Dragon.js =====
/**
 * Dragon entity with AI state machine
 */
class Dragon {
    constructor(c, r, level) {
        this.c = c;  // Column position
        this.r = r;  // Row position
        this.state = 'SPAWNING';
        this.timer = 0;
        this.life = 1200;
        this.angle = 0;

        // Calculate charge time based on level
        const baseCharge = 90;
        const reductionPerLevel = Math.min(level * 5, 40);
        this.chargeMax = Math.max(baseCharge - reductionPerLevel, 30);
    }
}

// ===== game/systems/DataManager.js =====
/**
 * DataManager - localStorage persistence system
 */
class DataManager {
    constructor() {
        this.data = { maxLevel: 1, totalShards: 0, bestTimes: {} };
        this.persistenceAvailable = true;
        this.storageKey = 'crystal_cave_data';
        this.load();
    }

    /**
     * Check if localStorage is available and working
     * @returns {boolean} True if localStorage is available
     */
    _isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e.message);
            return false;
        }
    }

    /**
     * Load saved game data from localStorage
     */
    load() {
        if (!this._isStorageAvailable()) {
            this.persistenceAvailable = false;
            console.warn('Game progress will not be saved (localStorage unavailable)');
            return;
        }

        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate data structure
                if (parsed && typeof parsed === 'object') {
                    this.data = {
                        maxLevel: parsed.maxLevel || 1,
                        totalShards: parsed.totalShards || 0,
                        bestTimes: parsed.bestTimes || {}
                    };
                }
            }
        } catch (e) {
            console.error('Failed to load game data:', e.message);
            // Data is corrupted, reset to defaults
            this.data = { maxLevel: 1, totalShards: 0, bestTimes: {} };
        }
    }

    /**
     * Save game data to localStorage
     * @returns {boolean} True if save was successful
     */
    save() {
        if (!this.persistenceAvailable) {
            return false;
        }

        try {
            const serialized = JSON.stringify(this.data);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (e) {
            // Handle quota exceeded error
            if (e.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded. Cannot save game progress.');
                this.persistenceAvailable = false;
                // Notify user (shown once)
                if (!this._quotaWarningShown) {
                    this._quotaWarningShown = true;
                    setTimeout(() => {
                        alert('⚠️ Storage quota exceeded. Your progress cannot be saved.');
                    }, 100);
                }
            } else {
                console.error('Failed to save game data:', e.message);
            }
            return false;
        }
    }

    updateLevel(lvl) {
        if (lvl > this.data.maxLevel) {
            this.data.maxLevel = lvl;
            return this.save();
        }
        return true;
    }

    addShards(count) {
        this.data.totalShards += count;
        return this.save();
    }

    saveTime(lvl, timeMs) {
        if (!this.data.bestTimes[lvl] || timeMs < this.data.bestTimes[lvl]) {
            this.data.bestTimes[lvl] = timeMs;
            this.save();
            return true;
        }
        return false;
    }

    getBestTime(lvl) {
        return this.data.bestTimes[lvl] || null;
    }
}

// ===== game/systems/SoundEngine.js =====
/**
 * SoundEngine - Web Audio API sound system
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.masterGain = null;
        this.delayNode = null;
        this.notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        this.initialized = false;
        this.droneOsc = null;
        this.droneLfo = null;
    }

    /**
     * Initialize AudioContext and audio graph
     * Must be called after a user gesture due to browser autoplay policies
     */
    init() {
        if (!this.ctx) {
            try {
                // Create AudioContext
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) {
                    console.warn('Web Audio API not supported in this browser');
                    return false;
                }

                this.ctx = new AudioContextClass();

                // Create audio graph
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.4;

                // Create delay effect for echo
                this.delayNode = this.ctx.createDelay();
                this.delayNode.delayTime.value = 0.3;
                const feedback = this.ctx.createGain();
                feedback.gain.value = 0.4;
                this.delayNode.connect(feedback);
                feedback.connect(this.delayNode);
                this.delayNode.connect(this.masterGain);
                this.masterGain.connect(this.ctx.destination);

                this.startDrone();
                this.initialized = true;
                return true;
            } catch (e) {
                console.error('Failed to initialize audio:', e);
                return false;
            }
        } else if (this.ctx.state === 'suspended') {
            // Resume if suspended (e.g., user gesture required)
            this.ctx.resume().then(() => {
                console.log('Audio context resumed');
            }).catch(err => {
                console.error('Failed to resume audio context:', err);
            });
        }
        return true;
    }

    /**
     * Check if audio is ready to play
     * @returns {boolean}
     */
    _isAudioReady() {
        return this.ctx && this.ctx.state === 'running' && this.initialized && !this.muted;
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.4, this.ctx.currentTime, 0.1);
        }
        return this.muted;
    }

    playTone(freq, type, duration, vol = 0.5, useEcho = true) {
        if (!this._isAudioReady()) return;

        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

            osc.connect(gain);
            gain.connect(this.masterGain);
            if (useEcho) gain.connect(this.delayNode);

            osc.start(t);
            osc.stop(t + duration);
        } catch (e) {
            console.error('Error playing tone:', e);
        }
    }

    playCollect(index) {
        this.playTone(this.notes[index % this.notes.length] * (1 + Math.floor(index / 6)), 'sine', 0.5, 0.3, true);
        this.playTone(this.notes[index % this.notes.length] * 2, 'triangle', 0.2, 0.1, true);
    }

    playHit() {
        this.playTone(100, 'sawtooth', 0.5, 0.8, false);
    }

    playCharge() {
        this.playTone(50, 'square', 0.5, 0.05, false);
    }

    playRoar() {
        this.playTone(80, 'sawtooth', 0.8, 0.2, true);
    }

    playWin() {
        if (!this._isAudioReady()) return;
        this.notes.forEach((f, i) => setTimeout(() => this.playTone(f * 2, 'sine', 0.8, 0.4), i * 100));
    }

    startDrone() {
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(50, this.ctx.currentTime);

            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.1;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 10;

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            gain.gain.value = 0.15;
            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start();
            lfo.start();

            // Keep references for cleanup if needed
            this.droneOsc = osc;
            this.droneLfo = lfo;
        } catch (e) {
            console.error('Error starting drone:', e);
        }
    }
}

// ===== game/ui/QuirkyMessages.js =====
/**
 * Quirky Messages - Toast notification system
 */
// import removed

// Using _qm prefix to avoid conflicts when bundled
let _qmMsgTimer = null;
let _qmLastMsgTime = 0;

function showQuirky(category) {
    const now = Date.now();
    // Anti-spam cooldown (except for hits which are urgent)
    if (category !== 'HIT' && now - _qmLastMsgTime < QUIRKY_CONFIG.COOLDOWN) return;

    const msgs = QUIRKY_MSGS[category];
    const text = msgs[Math.floor(Math.random() * msgs.length)];

    const el = document.getElementById('quirky-msg');
    // SECURITY: Using .innerText instead of .innerHTML to prevent XSS
    // If extending this system to accept user input, add sanitization!
    el.innerText = text;
    el.classList.add('visible');

    // Color coding
    if (category === 'HIT' || category === 'NEAR_DRAGON') {
        el.style.color = QUIRKY_CONFIG.COLORS.HIT;
    } else if (category === 'COLLECT') {
        el.style.color = QUIRKY_CONFIG.COLORS.COLLECT;
    } else {
        el.style.color = QUIRKY_CONFIG.COLORS.DEFAULT;
    }

    _qmLastMsgTime = now;

    if (_qmMsgTimer) clearTimeout(_qmMsgTimer);
    _qmMsgTimer = setTimeout(() => {
        el.classList.remove('visible');
    }, QUIRKY_CONFIG.DISPLAY_DURATION);
}

// ===== game/systems/MazeGenerator.js =====
/**
 * MazeGenerator - Procedural maze generation using recursive backtracking
 */
// import removed
// import removed
// import removed
// import removed

function calculateMazeSize(level) {
    let size = GAME_CONFIG.MAZE_BASE_SIZE + ((level - 1) * GAME_CONFIG.MAZE_GROWTH_RATE);
    if (size > GAME_CONFIG.MAZE_MAX_SIZE) size = GAME_CONFIG.MAZE_MAX_SIZE;
    return { cols: size, rows: size };
}

function generateMaze(cols, rows) {
    const maze = [];

    // Create grid
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            maze.push(new Cell(c, r));
        }
    }

    // Recursive backtracking maze generation
    const stack = [];
    let current = maze[0];
    current.visited = true;

    const idx = (c, r) => (c < 0 || r < 0 || c >= cols || r >= rows) ? -1 : c + r * cols;
    const dirs = [
        { n: 'top', dr: -1, dc: 0, opp: 'bottom' },
        { n: 'right', dr: 0, dc: 1, opp: 'left' },
        { n: 'bottom', dr: 1, dc: 0, opp: 'top' },
        { n: 'left', dr: 0, dc: -1, opp: 'right' }
    ];

    while (true) {
        const neighbors = [];

        for (let d of dirs) {
            const i = idx(current.c + d.dc, current.r + d.dr);
            if (i !== -1 && !maze[i].visited) {
                neighbors.push({ cell: maze[i], dir: d });
            }
        }

        if (neighbors.length > 0) {
            const nextInfo = neighbors[randomInt(0, neighbors.length - 1)];
            const next = nextInfo.cell;

            // Carve passage
            current.walls[nextInfo.dir.n] = false;
            next.walls[nextInfo.dir.opp] = false;

            stack.push(current);
            current = next;
            current.visited = true;
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            break; // Maze complete
        }
    }

    return maze;
}

function spawnCrystalShards(maze, cols, rows, cellSize) {
    const shards = [];

    for (let i = 0; i < maze.length; i++) {
        // Skip start and goal cells
        if (i === 0 || i === (cols * rows) - 1) continue;

        if (Math.random() < GAME_CONFIG.CRYSTAL_SPAWN_CHANCE) {
            const color = CRYSTAL_COLORS[randomInt(0, CRYSTAL_COLORS.length - 1)];
            shards.push({
                c: maze[i].c,
                r: maze[i].r,
                active: true,
                phase: Math.random() * 10,
                mx: 0,
                my: 0,
                color: color,
                sizeScalar: Math.random() * 0.5 + 0.75
            });
        }
    }

    return shards;
}

function spawnDragon(cols, rows, playerCol, playerRow, level) {
    let attempts = 0;

    while (attempts < GAME_CONFIG.DRAGON_SPAWN_ATTEMPTS) {
        const r = randomInt(1, rows - 2);
        const c = randomInt(1, cols - 2);

        // Ensure minimum distance from player
        const dist = Math.abs(playerCol - c) + Math.abs(playerRow - r);
        if (dist > GAME_CONFIG.DRAGON_MIN_DISTANCE) {
            return new Dragon(c, r, level);
        }

        attempts++;
    }

    // Fallback: spawn at far corner
    return new Dragon(cols - 2, rows - 2, level);
}

// ===== game/systems/Renderer.js =====
/**
 * Renderer - Main game rendering system
 */
// import removed

// State will be injected - using _r prefix to avoid conflicts when bundled
let _rCanvas, _rCtx, _rCamera, _rCellSize;
let _rendererGameState, _rMaze, _rPlayer, _rGoal, _rDragons, _rShards, _rParticles, _rDust;

function setRenderDependencies(deps) {
    _rCanvas = deps.canvas;
    _rCtx = deps.ctx;
    _rCamera = deps.camera;
}

function setRenderState(state) {
    _rendererGameState = state.gameState;
    _rCellSize = state.cellSize;
    _rMaze = state.maze;
    _rPlayer = state.player;
    _rGoal = state.goal;
    _rDragons = state.dragons;
    _rShards = state.shards;
    _rParticles = state.particles;
    _rDust = state.dust;
}

function draw() {
    // Clear screen
    _rCtx.fillStyle = COLORS.bg;
    _rCtx.fillRect(0, 0, _rCanvas.width, _rCanvas.height);

    _rCtx.save();
    const cx = _rCanvas.width / 2 - _rCamera.x;
    const cy = _rCanvas.height / 2 - _rCamera.y;
    _rCtx.translate(cx, cy);

    // Menu screens: minimal rendering
    if (_rendererGameState === 'HOME' || _rendererGameState === 'ABOUT' || _rendererGameState === 'STATS') {
        drawMazeWalls(0.2);
        _rDust.forEach(p => p.draw(_rCtx));
        _rCtx.restore();
        return;
    }

    const time = Date.now() / 1000;

    // Draw maze walls
    drawMazeWalls(1.0);

    // Draw crystal shards
    drawShards(time);

    // Draw portal
    drawPortal(time);

    // Draw dragons
    drawDragons(time);

    // Draw player
    drawPlayer(time);

    // Draw particles
    _rParticles.forEach(p => p.draw(_rCtx));
    _rDust.forEach(p => p.draw(_rCtx));

    _rCtx.restore();

    // Draw joystick (if active)
    drawJoystick();
}

function drawMazeWalls(opacity) {
    _rCtx.lineCap = 'round';
    _rCtx.lineJoin = 'round';
    _rCtx.shadowBlur = opacity > 0.5 ? 10 : 5;
    _rCtx.shadowColor = opacity > 0.5 ? COLORS.wallGlow : 'rgba(76, 201, 240, 0.2)';
    _rCtx.strokeStyle = opacity > 0.5 ? COLORS.wallGlow : 'rgba(76, 201, 240, 0.2)';
    _rCtx.lineWidth = 4;

    _rCtx.beginPath();
    for (let cell of _rMaze) {
        const x = (cell.c * _rCellSize) + _rCellSize;
        const y = (cell.r * _rCellSize) + _rCellSize;

        if (cell.walls.top) {
            _rCtx.moveTo(x, y);
            _rCtx.lineTo(x + _rCellSize, y);
        }
        if (cell.walls.left) {
            _rCtx.moveTo(x, y);
            _rCtx.lineTo(x, y + _rCellSize);
        }
        if (cell.walls.right) {
            _rCtx.moveTo(x + _rCellSize, y);
            _rCtx.lineTo(x + _rCellSize, y + _rCellSize);
        }
        if (cell.walls.bottom) {
            _rCtx.moveTo(x, y + _rCellSize);
            _rCtx.lineTo(x + _rCellSize, y + _rCellSize);
        }
    }
    _rCtx.stroke();
    _rCtx.shadowBlur = 0;
}

function drawShards(time) {
    for (let s of _rShards) {
        if (!s.active) continue;

        const sx = (s.c * _rCellSize) + _rCellSize * 1.5 + s.mx;
        const sy = (s.r * _rCellSize) + _rCellSize * 1.5 + s.my;
        const float = Math.sin(time * 3 + s.phase) * 5;

        _rCtx.shadowBlur = 20;
        _rCtx.shadowColor = s.color;
        _rCtx.fillStyle = s.color;

        const size = 8 * s.sizeScalar;
        const w = size * 0.75;
        const h = size;

        _rCtx.beginPath();
        _rCtx.moveTo(sx, sy - h + float);
        _rCtx.lineTo(sx + w, sy + float);
        _rCtx.lineTo(sx, sy + h + float);
        _rCtx.lineTo(sx - w, sy + float);
        _rCtx.fill();
        _rCtx.shadowBlur = 0;
    }
}

function drawPortal(time) {
    const gx = (_rGoal.col * _rCellSize) + _rCellSize * 1.5;
    const gy = (_rGoal.row * _rCellSize) + _rCellSize * 1.5;

    _rCtx.save();
    _rCtx.translate(gx, gy);
    _rCtx.rotate(time);

    // Outer ring
    _rCtx.shadowBlur = 30;
    _rCtx.shadowColor = COLORS.portalOuter;
    _rCtx.strokeStyle = COLORS.portalOuter;
    _rCtx.lineWidth = 3;
    _rCtx.beginPath();
    _rCtx.arc(0, 0, _rCellSize * 0.4 + Math.sin(time * 2) * 2, 0, Math.PI * 2);
    _rCtx.stroke();

    // Inner ring
    _rCtx.rotate(-time * 2);
    _rCtx.strokeStyle = COLORS.portalInner;
    _rCtx.beginPath();
    _rCtx.arc(0, 0, _rCellSize * 0.25, 0, Math.PI * 1.5);
    _rCtx.stroke();

    // Core
    _rCtx.fillStyle = '#fff';
    _rCtx.beginPath();
    _rCtx.arc(0, 0, _rCellSize * 0.1, 0, Math.PI * 2);
    _rCtx.fill();

    _rCtx.restore();
    _rCtx.shadowBlur = 0;
}

function drawDragons(time) {
    for (let d of _rDragons) {
        const dx = (d.c * _rCellSize) + _rCellSize * 1.5;
        const dy = (d.r * _rCellSize) + _rCellSize * 1.5;

        // Spawning animation
        if (d.state === 'SPAWNING') {
            const alpha = (Math.sin(time * 10) + 1) / 2;
            _rCtx.fillStyle = \`rgba(255, 0, 0, \${alpha * 0.3})\`;
            _rCtx.beginPath();
            _rCtx.arc(dx, dy, _rCellSize * 0.4, 0, Math.PI * 2);
            _rCtx.fill();
        } else if (d.state === 'DESPAWNING') {
            _rCtx.globalAlpha = 0.5;
        }

        // Dragon body
        if (d.state === 'IDLE' || d.state === 'CHARGING' || d.state === 'ATTACKING' || d.state === 'DESPAWNING') {
            _rCtx.save();
            _rCtx.translate(dx, dy);
            _rCtx.rotate(d.angle);

            // Charge indicator
            if (d.state === 'CHARGING') {
                const progress = d.timer / d.chargeMax;
                _rCtx.fillStyle = \`rgba(255, 100, 0, \${0.2 + progress * 0.3})\`;
                _rCtx.beginPath();
                _rCtx.moveTo(0, 0);
                _rCtx.arc(0, 0, 120, -0.4, 0.4);
                _rCtx.closePath();
                _rCtx.fill();
            }

            // Body
            _rCtx.fillStyle = COLORS.dragonBody;
            _rCtx.strokeStyle = COLORS.dragonGlow;
            _rCtx.lineWidth = 2;
            _rCtx.shadowBlur = 15;
            _rCtx.shadowColor = COLORS.dragonGlow;

            _rCtx.beginPath();
            _rCtx.moveTo(15, 0);
            _rCtx.lineTo(-10, 10);
            _rCtx.lineTo(-5, 0);
            _rCtx.lineTo(-10, -10);
            _rCtx.closePath();
            _rCtx.fill();
            _rCtx.stroke();

            // Eyes
            _rCtx.fillStyle = d.state === 'CHARGING' ? '#fff' : '#ffff00';
            _rCtx.beginPath();
            _rCtx.arc(5, 4, 2, 0, Math.PI * 2);
            _rCtx.arc(5, -4, 2, 0, Math.PI * 2);
            _rCtx.fill();

            _rCtx.restore();
            _rCtx.shadowBlur = 0;
        }

        _rCtx.globalAlpha = 1.0;
    }
}

function drawPlayer(time) {
    // Invulnerability flicker
    if (_rPlayer.invulnerableTimer > 0) {
        _rCtx.globalAlpha = (Math.floor(Date.now() / 50) % 2 === 0) ? 0.3 : 0.8;
    }

    _rCtx.save();
    _rCtx.translate(_rPlayer.x, _rPlayer.y);

    // Arrow pointing to goal
    const gx = (_rGoal.col * _rCellSize) + _rCellSize * 1.5;
    const gy = (_rGoal.row * _rCellSize) + _rCellSize * 1.5;
    const angleToGoal = Math.atan2(gy - _rPlayer.y, gx - _rPlayer.x);

    _rCtx.save();
    _rCtx.rotate(angleToGoal);
    _rCtx.translate(_rCellSize * 0.7, 0);
    _rCtx.fillStyle = 'rgba(0, 255, 255, 0.8)';
    _rCtx.shadowBlur = 10;
    _rCtx.shadowColor = 'rgba(0, 255, 255, 0.8)';
    _rCtx.beginPath();
    _rCtx.moveTo(10, 0);
    _rCtx.lineTo(-5, 8);
    _rCtx.lineTo(0, 0);
    _rCtx.lineTo(-5, -8);
    _rCtx.closePath();
    _rCtx.fill();
    _rCtx.restore();

    // Player ship
    _rCtx.rotate(_rPlayer.rotation);
    _rCtx.shadowBlur = 20;
    _rCtx.shadowColor = COLORS.playerCore;
    _rCtx.fillStyle = '#fff';
    _rCtx.beginPath();
    _rCtx.moveTo(14, 0);
    _rCtx.lineTo(-10, 10);
    _rCtx.lineTo(-6, 0);
    _rCtx.lineTo(-10, -10);
    _rCtx.fill();

    // Core
    _rCtx.fillStyle = COLORS.playerCore;
    _rCtx.beginPath();
    _rCtx.arc(0, 0, 4, 0, Math.PI * 2);
    _rCtx.fill();

    _rCtx.restore();
    _rCtx.shadowBlur = 0;
    _rCtx.globalAlpha = 1.0;
}

function drawJoystick() {
    // This will be set from state
    const joystickState = window.__joystickState;
    if (!joystickState || !joystickState.active || _rendererGameState !== 'PLAYING') return;

    const JOYSTICK_MAX_RADIUS = 70;

    _rCtx.beginPath();
    _rCtx.arc(joystickState.start.x, joystickState.start.y, JOYSTICK_MAX_RADIUS, 0, Math.PI * 2);
    _rCtx.strokeStyle = 'rgba(255,255,255,0.2)';
    _rCtx.lineWidth = 2;
    _rCtx.stroke();

    _rCtx.beginPath();
    _rCtx.arc(joystickState.current.x, joystickState.current.y, 35, 0, Math.PI * 2);
    _rCtx.fillStyle = 'rgba(255,255,255,0.5)';
    _rCtx.fill();
}

// ===== game/ui/ScreenManager.js =====
/**
 * ScreenManager - UI screen transitions and game flow
 */
// import removed
// import removed

// These will be set via setDependencies - using _sm prefix to avoid conflicts when bundled
let _smGameData, _smAudio;
let _screenGameState;

function setDependencies(deps) {
    _smGameData = deps.gameData;
    _smAudio = deps.audio;
}

function setGameState(state) {
    _screenGameState = state;
}

function showHome() {
    if (_screenGameState) _screenGameState.value = 'HOME';
    hideAllScreens();
    document.getElementById('home-screen').classList.remove('hidden');
}

function showAbout() {
    if (_screenGameState) _screenGameState.value = 'ABOUT';
    hideAllScreens();
    document.getElementById('about-screen').classList.remove('hidden');
}

function showStats() {
    if (_screenGameState) _screenGameState.value = 'STATS';
    hideAllScreens();

    document.getElementById('stat-max-level').innerText = _smGameData.data.maxLevel;
    document.getElementById('stat-total-shards').innerText = _smGameData.data.totalShards;

    const list = document.getElementById('stats-list');
    list.innerHTML = '';

    const sortedLevels = Object.keys(_smGameData.data.bestTimes).sort((a, b) => a - b);

    if (sortedLevels.length === 0) {
        list.innerHTML = '<div style="padding:10px; color:#888;">No records yet.</div>';
    } else {
        sortedLevels.forEach(lvl => {
            const row = document.createElement('div');
            row.className = 'list-row';
            row.innerHTML = \`<span>Sector \${lvl}</span><span style="color:#ffd700">\${formatTime(_smGameData.data.bestTimes[lvl])}</span>\`;
            list.appendChild(row);
        });
    }

    document.getElementById('stats-screen').classList.remove('hidden');
}

function showPause() {
    if (_screenGameState) _screenGameState.value = 'PAUSED';
    document.getElementById('pause-screen').classList.remove('hidden');
}

function hidePause() {
    if (_screenGameState) _screenGameState.value = 'PLAYING';
    document.getElementById('pause-screen').classList.add('hidden');
}

function showLevelComplete(duration, level) {
    if (_screenGameState) _screenGameState.value = 'TRANSITION';
    _smAudio.playWin();

    const isRecord = _smGameData.saveTime(level, duration);
    _smGameData.updateLevel(level);

    document.getElementById('level-time-val').innerText = formatTime(duration);
    document.getElementById('level-best-val').innerText = formatTime(_smGameData.getBestTime(level));

    const recordMsg = document.getElementById('new-record-msg');
    if (isRecord) {
        recordMsg.classList.remove('hidden');
    } else {
        recordMsg.classList.add('hidden');
    }

    hideAllScreens();
    document.getElementById('level-screen').classList.remove('hidden');
}

function showGameOver(level, score) {
    if (_screenGameState) _screenGameState.value = 'GAMEOVER';
    _smGameData.updateLevel(level);

    hideAllScreens();
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-level').innerText = level;
    document.getElementById('final-score').innerText = score;
}

// ===== game/ui/HUD.js =====
/**
 * HUD - Heads-up display updates
 */
// import removed

function updateHUD(lives, score, level, elapsedTime) {
    document.getElementById('lives-display').innerText = lives;
    document.getElementById('crystal-display').innerText = score;
    document.getElementById('level-display').innerText = level;
    document.getElementById('time-display').innerText = formatTime(elapsedTime);
}

function showHUD() {
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('hint').classList.remove('hidden');
}

function hideHUD() {
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('hint').classList.add('hidden');
}

function hideHint() {
    document.getElementById('hint').classList.add('hidden');
}

// ===== game/core/state.js =====
/**
 * Game State - All global game state and initialization
 */
// import removed
// import removed
// import removed
// import removed

// Canvas and rendering
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', {
    alpha: false,  // No transparency needed - better performance
    desynchronized: true,  // Better performance for animations
    willReadFrequently: false  // We're not reading pixels back
});

// Core systems
const audio = new SoundEngine();
const gameData = new DataManager();
const camera = { x: 0, y: 0 };

// Game state
const state = {
    value: 'START',  // Using object to allow pass-by-reference updates
    levelStartTime: 0,
    levelPausedTime: 0
};

// Maze and grid
let cellSize = 60;
let cols = 0;
let rows = 0;
let maze = [];

// Player state
const player = {
    col: 0,
    row: 0,
    x: 0,
    y: 0,
    radius: 0,
    vx: 0,
    vy: 0,
    rotation: 0,
    invulnerableTimer: 0
};

// Game entities
const goal = { col: 0, row: 0 };
let dragons = [];
let shards = [];
let particles = [];
let dust = [];

// Game stats
let lives = 3;
let score = 0;
let level = 1;
let dragonSpawnTimer = 0;

// Input state
const joystick = {
    active: false,
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    vec: { x: 0, y: 0 }
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// Expose joystick for renderer
if (typeof window !== 'undefined') {
    window.__joystickState = joystick;
}

// State update functions
function setCellSize(size) {
    cellSize = size;
}

function setMazeSize(newCols, newRows) {
    cols = newCols;
    rows = newRows;
}

function setMaze(newMaze) {
    maze = newMaze;
}

function setDragons(newDragons) {
    dragons = newDragons;
}

function setShards(newShards) {
    shards = newShards;
}

function setParticles(newParticles) {
    particles = newParticles;
}

function setDust(newDust) {
    dust = newDust;
}

function setLives(newLives) {
    lives = newLives;
}

function setScore(newScore) {
    score = newScore;
}

function setLevel(newLevel) {
    level = newLevel;
}

function resetDragonSpawnTimer() {
    dragonSpawnTimer = 0;
}

function incrementDragonSpawnTimer() {
    dragonSpawnTimer++;
}

// Initialize dust particles
function initializeDust() {
    const dustParticles = [];
    for (let i = 0; i < GAME_CONFIG.DUST_PARTICLES; i++) {
        dustParticles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            'dust'
        ));
    }
    return dustParticles;
}

// Window resize handler
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const minDim = Math.min(canvas.width, canvas.height);
    cellSize = minDim < GAME_CONFIG.CELL_SIZE_BREAKPOINT
        ? GAME_CONFIG.CELL_SIZE_SMALL
        : GAME_CONFIG.CELL_SIZE_LARGE;
}

// ===== game/core/game-loop.js =====
/**
 * Game Loop - Main update loop and game logic
 */
// Imports removed by build script
// State and other modules are available in global scope

// Initialize dependencies
setRenderDependencies({
    canvas: canvas,
    ctx: ctx,
    camera: camera
});

setDependencies({
    gameData: gameData,
    audio: audio
});

setGameState(state);

// Game flow functions
function startGame() {
    audio.init();
    setLives(3);
    setScore(0);
    setLevel(1);
    startLevel();
}

function startLevel() {
    state.value = 'PLAYING';
    hideAllOverlays();
    showHUD();

    updateHUD(lives, score, level, 0);

    resize();
    initLevel();

    state.levelStartTime = Date.now();
    setDust(initializeDust());

    camera.x = player.x;
    camera.y = player.y;

    // Initial dragons
    const initDragons = Math.min(
        GAME_CONFIG.INITIAL_DRAGONS + Math.floor(level / 2),
        GAME_CONFIG.MAX_DRAGONS_CAP
    );
    const newDragons = [];
    for (let k = 0; k < initDragons; k++) {
        const playerCol = Math.floor(player.x / cellSize);
        const playerRow = Math.floor(player.y / cellSize);
        newDragons.push(spawnDragon(cols, rows, playerCol, playerRow, level));
    }
    setDragons(newDragons);

    showQuirky('IDLE');
}

function initLevel() {
    const size = calculateMazeSize(level);
    setMazeSize(size.cols, size.rows);

    const newMaze = generateMaze(cols, rows);
    setMaze(newMaze);

    // Initialize player
    player.col = 0;
    player.row = 0;
    player.radius = cellSize * 0.2;
    player.x = cellSize * 1.5;
    player.y = cellSize * 1.5;
    player.vx = 0;
    player.vy = 0;
    player.invulnerableTimer = 0;

    // Set goal
    goal.col = cols - 1;
    goal.row = rows - 1;

    // Spawn shards
    setShards(spawnCrystalShards(maze, cols, rows, cellSize));
    setParticles([]);
    resetDragonSpawnTimer();
}

function togglePause() {
    if (state.value === 'PLAYING') {
        state.levelPausedTime = Date.now();
        showPause();
    } else if (state.value === 'PAUSED') {
        state.levelStartTime += (Date.now() - state.levelPausedTime);
        hidePause();
    }
}

function nextLevel() {
    if (lives < 5) setLives(lives + 1);
    setLevel(level + 1);
    startLevel();
}

function replayLevel() {
    startLevel();
}

function hideAllOverlays() {
    document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
    hideHUD();
    document.querySelector('#quirky-msg').classList.remove('visible');
}

function handleDeath() {
    if (player.invulnerableTimer > 0) return;

    setLives(lives - 1);
    audio.playHit();
    showQuirky('HIT');
    updateHUD(lives, score, level, Date.now() - state.levelStartTime);

    player.invulnerableTimer = GAME_CONFIG.INVULNERABILITY_FRAMES;

    // Camera shake
    camera.x += (Math.random() - 0.5) * 30;
    camera.y += (Math.random() - 0.5) * 30;

    if (lives <= 0) {
        showGameOver(level, score);
    }
}

// Main update function
function update() {
    // Sync render state
    setRenderState({
        gameState: state.value,
        cellSize: cellSize,
        maze: maze,
        player: player,
        goal: goal,
        dragons: dragons,
        shards: shards,
        particles: particles,
        dust: dust
    });

    // Menu screens: minimal updates
    if (state.value === 'HOME' || state.value === 'ABOUT' || state.value === 'STATS') {
        camera.x += 1;
        camera.y += 0.5;
        dust.forEach(d => d.update());
        return;
    }

    if (state.value !== 'PLAYING') return;

    // Update HUD
    const elapsedTime = Date.now() - state.levelStartTime;
    updateHUD(lives, score, level, elapsedTime);

    if (player.invulnerableTimer > 0) player.invulnerableTimer--;

    // Input handling
    let accX = 0, accY = 0;
    if (keys.up) accY = -1;
    if (keys.down) accY = 1;
    if (keys.left) accX = -1;
    if (keys.right) accX = 1;

    if (joystick.active) {
        const dist = Math.hypot(joystick.vec.x, joystick.vec.y);
        if (dist > 5) {
            const strength = Math.min(dist, PHYSICS.JOYSTICK_MAX_RADIUS) / PHYSICS.JOYSTICK_MAX_RADIUS;
            accX = (joystick.vec.x / dist) * strength;
            accY = (joystick.vec.y / dist) * strength;
        }
    }

    if (accX !== 0 || accY !== 0) {
        player.vx += accX * PHYSICS.ACCEL;
        player.vy += accY * PHYSICS.ACCEL;
        player.rotation = Math.atan2(player.vy, player.vx);
        hideHint();
    } else if (Math.random() < GAME_CONFIG.IDLE_TRIGGER_CHANCE) {
        showQuirky('IDLE');
    }

    // Physics
    player.vx *= PHYSICS.FRICTION;
    player.vy *= PHYSICS.FRICTION;
    const vel = Math.hypot(player.vx, player.vy);
    if (vel > PHYSICS.MAX_SPEED) {
        player.vx = (player.vx / vel) * PHYSICS.MAX_SPEED;
        player.vy = (player.vy / vel) * PHYSICS.MAX_SPEED;
    }
    if (vel < 0.01) {
        player.vx = 0;
        player.vy = 0;
    }

    // Trail particles
    if (vel > 2 && Math.random() < GAME_CONFIG.PARTICLE_SPAWN_CHANCE) {
        particles.push(new Particle(player.x, player.y, 'trail', 0, 0, null, cellSize));
    }

    // Collision detection
    let nextX = player.x + player.vx;
    let nextY = player.y + player.vy;
    let pc = Math.floor((player.x - cellSize) / cellSize);
    let pr = Math.floor((player.y - cellSize) / cellSize);
    pc = Math.max(0, Math.min(cols - 1, pc));
    pr = Math.max(0, Math.min(rows - 1, pr));

    const cell = maze[pc + pr * cols];
    const cx = (pc * cellSize) + cellSize;
    const cy = (pr * cellSize) + cellSize;
    const r = player.radius;

    if (cell.walls.right && nextX + r > cx + cellSize) {
        nextX = cx + cellSize - r;
        player.vx = 0;
    }
    if (cell.walls.left && nextX - r < cx) {
        nextX = cx + r;
        player.vx = 0;
    }
    if (cell.walls.bottom && nextY + r > cy + cellSize) {
        nextY = cy + cellSize - r;
        player.vy = 0;
    }
    if (cell.walls.top && nextY - r < cy) {
        nextY = cy + r;
        player.vy = 0;
    }

    player.x = nextX;
    player.y = nextY;

    // Camera follow
    camera.x += (player.x - camera.x) * 0.1;
    camera.y += (player.y - camera.y) * 0.1;

    // Dragon spawning
    incrementDragonSpawnTimer();
    const spawnRate = Math.max(
        GAME_CONFIG.DRAGON_SPAWN_RATE_MIN,
        GAME_CONFIG.DRAGON_SPAWN_RATE_BASE - (level * GAME_CONFIG.DRAGON_SPAWN_RATE_REDUCTION)
    );
    const maxDragons = Math.min(
        GAME_CONFIG.MAX_DRAGONS_BASE + Math.floor(level * GAME_CONFIG.DRAGONS_PER_LEVEL),
        GAME_CONFIG.MAX_DRAGONS_CAP
    );

    if (dragonSpawnTimer > spawnRate && dragons.length < maxDragons) {
        dragons.push(spawnDragon(cols, rows, pc, pr, level));
        resetDragonSpawnTimer();
    }

    // Dragon AI
    for (let i = dragons.length - 1; i >= 0; i--) {
        const d = dragons[i];
        const dx = (d.c * cellSize) + cellSize * 1.5;
        const dy = (d.r * cellSize) + cellSize * 1.5;
        const distToPlayer = Math.hypot(player.x - dx, player.y - dy);

        if (d.state !== 'ATTACKING') {
            d.angle = Math.atan2(player.y - dy, player.x - dx);
        }

        if (d.state === 'SPAWNING') {
            if (++d.timer > GAME_CONFIG.DRAGON_SPAWN_TIME) {
                d.state = 'IDLE';
                d.timer = 0;
            }
        } else if (d.state === 'IDLE') {
            d.life--;
            if (distToPlayer < cellSize * GAME_CONFIG.DRAGON_DETECT_RANGE) {
                d.state = 'CHARGING';
                d.timer = 0;
                audio.playCharge();
            }
            if (d.life <= 0) d.state = 'DESPAWNING';
        } else if (d.state === 'CHARGING') {
            d.timer++;
            if (distToPlayer > cellSize * GAME_CONFIG.DRAGON_CHASE_RANGE) {
                d.state = 'IDLE';
                d.timer = 0;
            }
            if (d.timer >= d.chargeMax) {
                d.state = 'ATTACKING';
                d.timer = 0;
                audio.playRoar();
            }
        } else if (d.state === 'ATTACKING') {
            d.timer++;
            if (d.timer % GAME_CONFIG.DRAGON_FIRE_RATE === 0) {
                const speed = GAME_CONFIG.DRAGON_FIRE_SPEED;
                particles.push(new Particle(
                    dx, dy, 'fire',
                    Math.cos(d.angle) * speed,
                    Math.sin(d.angle) * speed,
                    null,
                    cellSize
                ));
            }
            if (d.timer > GAME_CONFIG.DRAGON_ATTACK_DURATION) {
                d.state = 'IDLE';
                d.timer = 0;
            }
        } else if (d.state === 'DESPAWNING') {
            if (++d.timer > GAME_CONFIG.DRAGON_DESPAWN_TIME) {
                dragons.splice(i, 1);
            }
        }

        // Collision with player
        if (d.state !== 'SPAWNING' && d.state !== 'DESPAWNING' &&
            distToPlayer < cellSize * GAME_CONFIG.DRAGON_COLLISION_RANGE) {
            handleDeath();
        }

        // Quirky trigger
        if (d.state !== 'SPAWNING' &&
            distToPlayer < cellSize * GAME_CONFIG.DRAGON_CLOSE_RANGE &&
            distToPlayer > cellSize * 0.6) {
            showQuirky('NEAR_DRAGON');
        }
    }

    // Particle updates
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        if (p.type === 'fire' && Math.hypot(p.x - player.x, p.y - player.y) < player.radius + p.size) {
            handleDeath();
        }
    }

    // Safety limit
    if (particles.length > GAME_CONFIG.PARTICLE_SAFETY_LIMIT) {
        console.warn('Particle limit reached, cleaning up');
        setParticles(particles.filter(p => p.life > 0.1));
    }

    // Shard collection
    for (let s of shards) {
        if (!s.active) continue;

        const sx = (s.c * cellSize) + cellSize * 1.5;
        const sy = (s.r * cellSize) + cellSize * 1.5;
        const finalX = sx + s.mx;
        const finalY = sy + s.my;
        const dist = Math.hypot(player.x - finalX, player.y - finalY);

        if (dist < cellSize * GAME_CONFIG.SHARD_ATTRACT_RANGE) {
            s.mx += (player.x - finalX) * 0.05;
            s.my += (player.y - finalY) * 0.05;
            if (Math.random() < 0.1) {
                particles.push(new Particle(finalX, finalY, 'trail', 0, 0, s.color, cellSize));
            }
        }

        if (dist < cellSize * GAME_CONFIG.SHARD_COLLECT_RANGE) {
            s.active = false;
            setScore(score + 1);
            gameData.addShards(1);
            updateHUD(lives, score, level, elapsedTime);
            audio.playCollect(score);
            showQuirky('COLLECT');

            for (let k = 0; k < 12; k++) {
                particles.push(new Particle(finalX, finalY, 'spark', 0, 0, s.color, cellSize));
            }
        }
    }

    // Portal particles
    if (Math.random() < GAME_CONFIG.PORTAL_PARTICLE_CHANCE) {
        const gx = (goal.col * cellSize) + cellSize * 1.5;
        const gy = (goal.row * cellSize) + cellSize * 1.5;
        particles.push(new Particle(gx, gy, 'portal', 0, 0, null, cellSize));
    }

    dust.forEach(d => d.update());

    // Level complete
    if (pc === goal.col && pr === goal.row) {
        showLevelComplete(elapsedTime, level);
    }
}

// Main game loop
function loop() {
    requestAnimationFrame(loop);

    try {
        update();
        draw();
    } catch (e) {
        console.error('Game loop error:', e);

        if (state.value === 'PLAYING') {
            state.value = 'PAUSED';
            document.getElementById('pause-screen').classList.remove('hidden');
            console.error('Stack trace:', e.stack);
        }
    }
}

// Event listeners
window.addEventListener('resize', resize);

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.changedTouches[0];
    joystick.active = true;
    joystick.start = { x: t.clientX, y: t.clientY };
    joystick.current = { x: t.clientX, y: t.clientY };
    joystick.vec = { x: 0, y: 0 };
}, { passive: false });

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!joystick.active) return;

    const t = e.changedTouches[0];
    joystick.current = { x: t.clientX, y: t.clientY };

    let dx = joystick.current.x - joystick.start.x;
    let dy = joystick.current.y - joystick.start.y;
    const dist = Math.hypot(dx, dy);

    if (dist > PHYSICS.JOYSTICK_MAX_RADIUS) {
        const ratio = PHYSICS.JOYSTICK_MAX_RADIUS / dist;
        joystick.current.x = joystick.start.x + dx * ratio;
        joystick.current.y = joystick.start.y + dy * ratio;
    }

    joystick.vec.x = dx;
    joystick.vec.y = dy;
}, { passive: false });

const endTouch = e => {
    e.preventDefault();
    joystick.active = false;
    joystick.vec = { x: 0, y: 0 };
};

canvas.addEventListener('touchend', endTouch);
canvas.addEventListener('touchcancel', endTouch);

window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = true;
    if (e.key === 'ArrowDown' || e.key === 's') keys.down = true;
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
});

window.addEventListener('keyup', e => {
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's') keys.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});

// Button bindings
function bind(id, action) {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', action);
    } else {
        console.warn('Element not found:', id);
    }
}

bind('home-play-btn', startGame);
bind('home-about-btn', showAbout);
bind('home-stats-btn', showStats);
bind('about-back-btn', showHome);
bind('stats-back-btn', showHome);
bind('next-level-btn', nextLevel);
bind('replay-level-btn', replayLevel);
bind('level-quit-btn', showHome);
bind('pause-btn', togglePause);
bind('pause-resume-btn', togglePause);
bind('pause-retry-btn', () => { togglePause(); replayLevel(); });
bind('pause-quit-btn', () => { togglePause(); showHome(); });
bind('restart-btn', startGame);
bind('go-home-btn', showHome);
bind('audio-btn', () => {
    const m = audio.toggleMute();
    document.getElementById('audio-btn').innerText = m ? '🔇' : '🔊';
});

// Initialize and start
resize();
showHome();

// For debugging
if (typeof window !== 'undefined') {
    window.loopRunning = true;
}

loop();
    </script>
</body>

</html>`;
