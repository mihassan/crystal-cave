export const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Crystal Cave: Infinite</title>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap" rel="stylesheet">
    <style>
        :root {
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
        <p style="letter-spacing: 2px; text-transform: uppercase; font-size: 1rem; color: #4cc9f0;">Dragon's Lair</p>
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
            <p><strong>OBJECTIVE:</strong> Pilot the Frost Sentinel drone deep into the Dragon's Lair. Locate the <strong>Warp Portal</strong> to advance.</p>
            <p><strong>THREATS:</strong> Fire Dragons phase in and out. If you see a <span style="color: #ffaa00">Orange Circle</span>, they are charging. Move out of the zone immediately!</p>
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
/**
 * DATA & UTILS
 */
const QUIRKY_MSGS = {
    COLLECT: ["Ooh, shiny!", "Mine!", "Sparkly!", "Bling!", "Treasure!", "Fancy rock!", "Cha-ching!", "Glow up!"],
    NEAR_DRAGON: ["Don't wake him!", "Big lizard alert!", "Sizzling nearby!", "Shhh...", "Do not pet!", "Spicy breath!", "Too hot to handle!"],
    HIT: ["Ouchie!", "Too hot!", "Need ice!", "That stings!", "Singed!", "Hull breach!", "Medic!"],
    IDLE: ["Hello?", "Taking a nap?", "Dragons don't wait!", "Move it!", "Echo... echo...", "Engine cooling?"]
};

let msgTimer = null;
let lastMsgTime = 0;

function showQuirky(category) {
    const now = Date.now();
    // Anti-spam cooldown (except for hits which are urgent)
    if (category !== 'HIT' && now - lastMsgTime < 2000) return;
    
    const msgs = QUIRKY_MSGS[category];
    const text = msgs[Math.floor(Math.random() * msgs.length)];
    
    const el = document.getElementById('quirky-msg');
    el.innerText = text;
    el.classList.add('visible');
    
    // Color coding
    if (category === 'HIT' || category === 'NEAR_DRAGON') el.style.color = '#ff6b6b'; // Red
    else if (category === 'COLLECT') el.style.color = '#ffd700'; // Gold
    else el.style.color = '#4cc9f0'; // Blue
    
    lastMsgTime = now;
    
    if (msgTimer) clearTimeout(msgTimer);
    msgTimer = setTimeout(() => {
        el.classList.remove('visible');
    }, 2000);
}

class DataManager {
    constructor() {
        this.data = { maxLevel: 1, totalShards: 0, bestTimes: {} };
        this.load();
    }
    load() {
        try {
            const saved = localStorage.getItem('crystal_cave_data');
            if (saved) this.data = JSON.parse(saved);
        } catch (e) {}
    }
    save() {
        try { localStorage.setItem('crystal_cave_data', JSON.stringify(this.data)); } catch (e) {}
    }
    updateLevel(lvl) { if (lvl > this.data.maxLevel) { this.data.maxLevel = lvl; this.save(); } }
    addShards(count) { this.data.totalShards += count; this.save(); }
    saveTime(lvl, timeMs) {
        if (!this.data.bestTimes[lvl] || timeMs < this.data.bestTimes[lvl]) {
            this.data.bestTimes[lvl] = timeMs; this.save(); return true;
        } return false;
    }
    getBestTime(lvl) { return this.data.bestTimes[lvl] || null; }
}
const gameData = new DataManager();

class SoundEngine {
    constructor() { this.ctx = null; this.muted = false; this.masterGain = null; this.delayNode = null; this.notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; }
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain(); this.masterGain.gain.value = 0.4;
            this.delayNode = this.ctx.createDelay(); this.delayNode.delayTime.value = 0.3;
            const feedback = this.ctx.createGain(); feedback.gain.value = 0.4;
            this.delayNode.connect(feedback); feedback.connect(this.delayNode);
            this.delayNode.connect(this.masterGain); this.masterGain.connect(this.ctx.destination);
            this.startDrone();
        } else if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.4, this.ctx.currentTime, 0.1);
        return this.muted;
    }
    playTone(freq, type, duration, vol=0.5, useEcho=true) {
        if (!this.ctx || this.muted) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(vol, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.01, t + duration);
        osc.connect(gain); gain.connect(this.masterGain); if (useEcho) gain.connect(this.delayNode);
        osc.start(t); osc.stop(t + duration);
    }
    playCollect(index) { this.playTone(this.notes[index%this.notes.length]*(1+Math.floor(index/6)), 'sine', 0.5, 0.3, true); this.playTone(this.notes[index%this.notes.length]*2, 'triangle', 0.2, 0.1, true); }
    playHit() { this.playTone(100, 'sawtooth', 0.5, 0.8, false); }
    playCharge() { this.playTone(50, 'square', 0.5, 0.05, false); }
    playRoar() { this.playTone(80, 'sawtooth', 0.8, 0.2, true); }
    playWin() { if(!this.ctx||this.muted)return; this.notes.forEach((f,i) => setTimeout(() => this.playTone(f*2, 'sine', 0.8, 0.4), i*100)); }
    startDrone() {
        const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
        osc.type = 'triangle'; osc.frequency.setValueAtTime(50, this.ctx.currentTime);
        const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.1;
        const lfoGain = this.ctx.createGain(); lfoGain.gain.value = 10;
        lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
        gain.gain.value = 0.15; osc.connect(gain); gain.connect(this.masterGain);
        osc.start(); lfo.start();
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
const audio = new SoundEngine();
const camera = { x: 0, y: 0 };

const COLORS = { bg: '#050810', wallGlow: '#4cc9f0', dragonBody: '#1a0505', dragonGlow: '#ff4d4d', fire: '#ffaa00', player: '#ffffff', playerCore: '#00ffff', shard: '#ffffff', portalInner: '#ffffff', portalOuter: '#00ffff' };
const CRYSTAL_COLORS = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];
const FRICTION = 0.92, ACCEL = 0.35, MAX_SPEED = 4.5, JOYSTICK_MAX_RADIUS = 70;

let gameState = 'START', cellSize = 60, cols, rows, maze = [];
let player = { col: 0, row: 0, x: 0, y: 0, radius: 0, vx: 0, vy: 0, rotation: 0, invulnerableTimer: 0 };
let goal = { col: 0, row: 0 };
let dragons = [], shards = [], particles = [], dust = [];
let lives = 3, score = 0, level = 1, dragonSpawnTimer = 0;
let levelStartTime = 0, levelPausedTime = 0;
let joystick = { active: false, start: {x:0,y:0}, current: {x:0,y:0}, vec: {x:0,y:0} };
let keys = { up:false, down:false, left:false, right:false };

function formatTime(ms) {
    let s = Math.floor(ms/1000), m = Math.floor(s/60); s%=60;
    return \`\${m<10?'0'+m:m}:\${s<10?'0'+s:s}\`;
}
function randomInt(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }
function hideAllScreens() {
    document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('hint').classList.add('hidden');
    // Hide quirky msg if switching screens
    document.getElementById('quirky-msg').classList.remove('visible');
}

class Particle {
    constructor(x, y, type, vx=0, vy=0, color=null) {
        this.x = x; this.y = y; this.type = type; this.life = 1.0;
        if (type === 'trail') { this.vx=(Math.random()-0.5)*0.5; this.vy=(Math.random()-0.5)*0.5; this.size=Math.random()*4+2; this.decay=0.05; this.color=color||COLORS.playerCore; }
        else if (type === 'fire') { this.vx=vx+(Math.random()-0.5); this.vy=vy+(Math.random()-0.5); this.size=Math.random()*6+4; this.decay=0.08; this.color=COLORS.fire; }
        else if (type === 'spark') { this.vx=(Math.random()-0.5)*10; this.vy=(Math.random()-0.5)*10; this.size=Math.random()*3+1; this.decay=0.03; this.color=color||'#fff'; }
        else if (type === 'dust') { this.vx=(Math.random()-0.5)*0.2; this.vy=(Math.random()-0.5)*0.2; this.size=Math.random()*2; this.life=Math.random(); this.decay=0.00; this.color='rgba(100, 200, 255, 0.2)'; }
        else if (type === 'portal') { this.x=x+(Math.random()-0.5)*cellSize; this.y=y+(Math.random()-0.5)*cellSize; this.vx=0; this.vy=-1-Math.random(); this.size=Math.random()*3+1; this.decay=0.02; this.color='#fff'; }
    }
    update() { this.x+=this.vx; this.y+=this.vy; this.life-=this.decay; }
    draw(ctx) { ctx.globalAlpha=this.type==='dust'?0.3:this.life; ctx.fillStyle=this.color; if(this.type==='fire' && this.life<0.5) ctx.fillStyle='#ff3300'; ctx.beginPath(); ctx.arc(this.x,this.y,this.size*(this.type==='fire'?1:this.life),0,Math.PI*2); ctx.fill(); }
}

class Dragon {
    constructor(c, r) {
        this.c = c; this.r = r; this.state = 'SPAWNING'; this.timer = 0; this.life = 1200; this.angle = 0;
        this.chargeMax = Math.max(90 - Math.min(level * 5, 40), 30);
    }
}

class Cell { constructor(c, r) { this.c = c; this.r = r; this.walls = { top: true, right: true, bottom: true, left: true }; this.visited = false; } }

// --- CORE SYSTEM ---
function resize() {
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    cellSize = Math.min(canvas.width, canvas.height) < 600 ? 50 : 70;
}

function calculateMazeSize() {
    let base = 9;
    let size = base + ((level - 1) * 2);
    if (size > 51) size = 51;
    cols = size;
    rows = size;
}

function generateMaze() {
    calculateMazeSize();
    maze = []; dragons = []; shards = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) maze.push(new Cell(c, r));
    
    let stack = []; let current = maze[0]; current.visited = true;
    while (true) {
        let neighbors = [];
        let idx = (c,r) => (c<0||r<0||c>=cols||r>=rows) ? -1 : c + r*cols;
        let dirs = [{n:'top', dr:-1, dc:0, opp:'bottom'}, {n:'right', dr:0, dc:1, opp:'left'}, {n:'bottom', dr:1, dc:0, opp:'top'}, {n:'left', dr:0, dc:-1, opp:'right'}];
        for(let d of dirs) {
            let i = idx(current.c + d.dc, current.r + d.dr);
            if(i !== -1 && !maze[i].visited) neighbors.push({cell: maze[i], dir: d});
        }
        if (neighbors.length > 0) {
            let nextInfo = neighbors[randomInt(0, neighbors.length-1)];
            let next = nextInfo.cell;
            current.walls[nextInfo.dir.n] = false; next.walls[nextInfo.dir.opp] = false;
            stack.push(current); current = next; current.visited = true;
        } else if (stack.length > 0) current = stack.pop(); else break;
    }

    player.col = 0; player.row = 0; player.radius = cellSize * 0.2;
    player.x = cellSize * 1.5; player.y = cellSize * 1.5;
    player.vx = 0; player.vy = 0; player.invulnerableTimer = 0;
    goal.col = cols - 1; goal.row = rows - 1;

    for (let i = 0; i < maze.length; i++) {
        if(i === 0 || i === (cols*rows)-1) continue;
        if (Math.random() < 0.08) {
            const color = CRYSTAL_COLORS[randomInt(0, CRYSTAL_COLORS.length - 1)];
            shards.push({ c: maze[i].c, r: maze[i].r, active: true, phase: Math.random()*10, mx: 0, my: 0, color: color, sizeScalar: Math.random()*0.5+0.75 });
        }
    }
}

function spawnDragon() {
    let attempts = 0;
    while(attempts < 10) {
        let r = randomInt(1, rows-2); let c = randomInt(1, cols-2);
        let pc = Math.floor(player.x / cellSize); let pr = Math.floor(player.y / cellSize);
        if (Math.abs(pc - c) + Math.abs(pr - r) > 5) { dragons.push(new Dragon(c, r)); break; }
        attempts++;
    }
}

function showHome() {
    gameState = 'HOME';
    hideAllScreens();
    document.getElementById('home-screen').classList.remove('hidden');
    resize();
    let savedLevel = level; level = 10; generateMaze(); level = savedLevel;
    dust = [];
    for(let i=0; i<50; i++) dust.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height, 'dust'));
    camera.x = player.x; camera.y = player.y;
    if (!window.loopRunning) { window.loopRunning = true; loop(); }
}

function showAbout() { gameState = 'ABOUT'; hideAllScreens(); document.getElementById('about-screen').classList.remove('hidden'); }
function showStats() {
    gameState = 'STATS'; hideAllScreens();
    document.getElementById('stat-max-level').innerText = gameData.data.maxLevel;
    document.getElementById('stat-total-shards').innerText = gameData.data.totalShards;
    const list = document.getElementById('stats-list');
    list.innerHTML = '';
    const sortedLevels = Object.keys(gameData.data.bestTimes).sort((a,b) => a-b);
    if (sortedLevels.length === 0) list.innerHTML = '<div style="padding:10px; color:#888;">No records yet.</div>';
    else sortedLevels.forEach(lvl => {
        const row = document.createElement('div'); row.className = 'list-row';
        row.innerHTML = \`<span>Sector \${lvl}</span><span style="color:#ffd700">\${formatTime(gameData.data.bestTimes[lvl])}</span>\`;
        list.appendChild(row);
    });
    document.getElementById('stats-screen').classList.remove('hidden');
}

function startGame() {
    audio.init(); lives = 3; score = 0; level = 1;
    startLevel();
}

function startLevel() {
    gameState = 'PLAYING';
    hideAllScreens();
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('hint').classList.remove('hidden');
    document.getElementById('lives-display').innerText = lives;
    document.getElementById('crystal-display').innerText = score;
    document.getElementById('level-display').innerText = level;
    resize(); generateMaze();
    levelStartTime = Date.now();
    dust = []; for(let i=0; i<50; i++) dust.push(new Particle(Math.random()*canvas.width, Math.random()*canvas.height, 'dust'));
    camera.x = player.x; camera.y = player.y;
    let initDragons = Math.min(2 + Math.floor(level/2), 6);
    dragons = []; for(let k=0; k<initDragons; k++) spawnDragon();
    showQuirky('IDLE'); // Intro message
}

function togglePause() {
    if (gameState === 'PLAYING') { gameState = 'PAUSED'; levelPausedTime = Date.now(); document.getElementById('pause-screen').classList.remove('hidden'); }
    else if (gameState === 'PAUSED') { gameState = 'PLAYING'; levelStartTime += (Date.now() - levelPausedTime); document.getElementById('pause-screen').classList.add('hidden'); }
}

function finishLevel() {
    gameState = 'TRANSITION'; audio.playWin();
    const duration = Date.now() - levelStartTime;
    const isRecord = gameData.saveTime(level, duration);
    gameData.updateLevel(level); gameData.addShards(score);
    document.getElementById('level-time-val').innerText = formatTime(duration);
    document.getElementById('level-best-val').innerText = formatTime(gameData.getBestTime(level));
    const recordMsg = document.getElementById('new-record-msg');
    if (isRecord) recordMsg.classList.remove('hidden'); else recordMsg.classList.add('hidden');
    hideAllScreens(); document.getElementById('level-screen').classList.remove('hidden');
}

function nextLevel() { if(lives < 5) lives++; level++; startLevel(); }
function replayLevel() { startLevel(); }
function gameOver() {
    gameState = 'GAMEOVER'; gameData.updateLevel(level);
    hideAllScreens(); document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-level').innerText = level; document.getElementById('final-score').innerText = score;
}

function update() {
    if (gameState === 'HOME' || gameState === 'ABOUT' || gameState === 'STATS') {
        camera.x += 1; camera.y += 0.5;
        dust.forEach(d => d.update());
        return;
    }
    if (gameState !== 'PLAYING') return;

    const elapsedTime = Date.now() - levelStartTime;
    document.getElementById('time-display').innerText = formatTime(elapsedTime);
    if (player.invulnerableTimer > 0) player.invulnerableTimer--;

    let accX = 0, accY = 0;
    if (keys.up) accY = -1; if (keys.down) accY = 1;
    if (keys.left) accX = -1; if (keys.right) accX = 1;
    if (joystick.active) {
        const dist = Math.hypot(joystick.vec.x, joystick.vec.y);
        if(dist > 5) { 
            const strength = Math.min(dist, JOYSTICK_MAX_RADIUS) / JOYSTICK_MAX_RADIUS;
            accX = (joystick.vec.x / dist) * strength; accY = (joystick.vec.y / dist) * strength;
        }
    }
    if (accX !== 0 || accY !== 0) {
        player.vx += accX * ACCEL; player.vy += accY * ACCEL;
        player.rotation = Math.atan2(player.vy, player.vx);
        document.getElementById('hint').classList.add('hidden');
    } else if (Math.random() < 0.005) {
        // Idle Trigger
        showQuirky('IDLE');
    }

    player.vx *= FRICTION; player.vy *= FRICTION;
    const vel = Math.hypot(player.vx, player.vy);
    if (vel > MAX_SPEED) { player.vx = (player.vx/vel)*MAX_SPEED; player.vy = (player.vy/vel)*MAX_SPEED; }
    if (vel < 0.01) { player.vx = 0; player.vy = 0; }
    if (vel > 2 && Math.random() < 0.4) particles.push(new Particle(player.x, player.y, 'trail'));

    let nextX = player.x + player.vx; let nextY = player.y + player.vy;
    let pc = Math.floor((player.x - cellSize)/cellSize); let pr = Math.floor((player.y - cellSize)/cellSize);
    pc = Math.max(0, Math.min(cols-1, pc)); pr = Math.max(0, Math.min(rows-1, pr));
    let cell = maze[pc + pr*cols];
    let cx = (pc * cellSize) + cellSize; let cy = (pr * cellSize) + cellSize; let r = player.radius;

    if (cell.walls.right && nextX + r > cx + cellSize) { nextX = cx + cellSize - r; player.vx = 0; }
    if (cell.walls.left && nextX - r < cx) { nextX = cx + r; player.vx = 0; }
    if (cell.walls.bottom && nextY + r > cy + cellSize) { nextY = cy + cellSize - r; player.vy = 0; }
    if (cell.walls.top && nextY - r < cy) { nextY = cy + r; player.vy = 0; }

    player.x = nextX; player.y = nextY;
    camera.x += (player.x - camera.x) * 0.1; camera.y += (player.y - camera.y) * 0.1;

    dragonSpawnTimer++;
    let spawnRate = Math.max(150, 300 - (level * 20)); let maxDragons = 3 + Math.floor(level / 2);
    if (dragonSpawnTimer > spawnRate) { if(dragons.length < maxDragons) spawnDragon(); dragonSpawnTimer = 0; }

    for (let i = dragons.length - 1; i >= 0; i--) {
        let d = dragons[i];
        let dx = (d.c * cellSize) + cellSize * 1.5; let dy = (d.r * cellSize) + cellSize * 1.5;
        let distToPlayer = Math.hypot(player.x - dx, player.y - dy);
        if (d.state !== 'ATTACKING') d.angle = Math.atan2(player.y - dy, player.x - dx);
        if (d.state === 'SPAWNING') { if (++d.timer > 120) { d.state = 'IDLE'; d.timer = 0; } }
        else if (d.state === 'IDLE') {
            d.life--;
            if (distToPlayer < cellSize * 3) { d.state = 'CHARGING'; d.timer = 0; audio.playCharge(); }
            if (d.life <= 0) d.state = 'DESPAWNING';
        } else if (d.state === 'CHARGING') {
            d.timer++;
            if (distToPlayer > cellSize * 3.5) { d.state = 'IDLE'; d.timer = 0; }
            if (d.timer >= d.chargeMax) { d.state = 'ATTACKING'; d.timer = 0; audio.playRoar(); }
        } else if (d.state === 'ATTACKING') {
            d.timer++;
            if (d.timer % 3 === 0) {
                let speed = 4;
                particles.push(new Particle(dx, dy, 'fire', Math.cos(d.angle)*speed, Math.sin(d.angle)*speed));
            }
            if (d.timer > 60) { d.state = 'IDLE'; d.timer = 0; }
        } else if (d.state === 'DESPAWNING') { if(++d.timer > 60) dragons.splice(i, 1); }
        if (d.state !== 'SPAWNING' && d.state !== 'DESPAWNING' && distToPlayer < cellSize * 0.5) handleDeath();
        
        // Quirky Trigger: Near Dragon
        if (d.state !== 'SPAWNING' && distToPlayer < cellSize * 2.5 && distToPlayer > cellSize * 0.6) {
            showQuirky('NEAR_DRAGON');
        }
    }

    for (let i = particles.length-1; i >= 0; i--) {
        let p = particles[i]; p.update();
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        if (p.type === 'fire' && Math.hypot(p.x - player.x, p.y - player.y) < player.radius + p.size) handleDeath();
    }

    for (let s of shards) {
        if (!s.active) continue;
        let sx = (s.c * cellSize) + cellSize * 1.5; let sy = (s.r * cellSize) + cellSize * 1.5;
        let finalX = sx + s.mx; let finalY = sy + s.my;
        let dist = Math.hypot(player.x - finalX, player.y - finalY);
        if (dist < cellSize * 2.5) { s.mx += (player.x - finalX) * 0.05; s.my += (player.y - finalY) * 0.05; if(Math.random()<0.1) particles.push(new Particle(finalX, finalY, 'trail',0,0,s.color)); }
        if (dist < cellSize * 0.6) {
            s.active = false; score++; gameData.addShards(1);
            document.getElementById('crystal-display').innerText = score;
            audio.playCollect(score);
            showQuirky('COLLECT');
            for(let k=0; k<12; k++) particles.push(new Particle(finalX, finalY, 'spark', 0, 0, s.color));
        }
    }

    if (Math.random() < 0.3) {
        let gx = (goal.col * cellSize) + cellSize * 1.5; let gy = (goal.row * cellSize) + cellSize * 1.5;
        particles.push(new Particle(gx, gy, 'portal'));
    }
    dust.forEach(d => d.update());

    if (pc === goal.col && pr === goal.row) finishLevel();
}

function handleDeath() {
    if (player.invulnerableTimer > 0) return;
    lives--;
    audio.playHit();
    showQuirky('HIT');
    document.getElementById('lives-display').innerText = lives;
    player.invulnerableTimer = 120;
    camera.x += (Math.random()-0.5)*30; camera.y += (Math.random()-0.5)*30;
    if (lives <= 0) gameOver();
}

// --- RENDER ---
function draw() {
    ctx.fillStyle = COLORS.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    const cx = canvas.width/2 - camera.x; const cy = canvas.height/2 - camera.y;
    ctx.translate(cx, cy);

    if (gameState === 'HOME' || gameState === 'ABOUT' || gameState === 'STATS') {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.shadowBlur = 5; ctx.shadowColor = 'rgba(76, 201, 240, 0.2)'; ctx.strokeStyle = 'rgba(76, 201, 240, 0.2)'; ctx.lineWidth = 4;
        ctx.beginPath();
        for(let cell of maze) {
            let x = (cell.c * cellSize) + cellSize; let y = (cell.r * cellSize) + cellSize;
            if (cell.walls.top) { ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); }
            if (cell.walls.left) { ctx.moveTo(x, y); ctx.lineTo(x, y + cellSize); }
            if (cell.walls.right) { ctx.moveTo(x+cellSize, y); ctx.lineTo(x+cellSize, y+cellSize); }
            if (cell.walls.bottom) { ctx.moveTo(x, y+cellSize); ctx.lineTo(x+cellSize, y+cellSize); }
        }
        ctx.stroke(); ctx.shadowBlur = 0;
        dust.forEach(p => p.draw(ctx));
        ctx.restore();
        return;
    }

    const time = Date.now() / 1000;

    // Walls
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.shadowBlur = 10; ctx.shadowColor = COLORS.wallGlow; ctx.strokeStyle = COLORS.wallGlow; ctx.lineWidth = 4;
    ctx.beginPath();
    for(let cell of maze) {
        let x = (cell.c * cellSize) + cellSize; let y = (cell.r * cellSize) + cellSize;
        if (cell.walls.top) { ctx.moveTo(x, y); ctx.lineTo(x + cellSize, y); }
        if (cell.walls.left) { ctx.moveTo(x, y); ctx.lineTo(x, y + cellSize); }
        if (cell.walls.right) { ctx.moveTo(x+cellSize, y); ctx.lineTo(x+cellSize, y+cellSize); }
        if (cell.walls.bottom) { ctx.moveTo(x, y+cellSize); ctx.lineTo(x+cellSize, y+cellSize); }
    }
    ctx.stroke(); ctx.shadowBlur = 0;

    // Shards
    for(let s of shards) {
        if(!s.active) continue;
        let sx = (s.c * cellSize) + cellSize*1.5 + s.mx; let sy = (s.r * cellSize) + cellSize*1.5 + s.my;
        let float = Math.sin(time*3 + s.phase) * 5;
        ctx.shadowBlur = 20; ctx.shadowColor = s.color; ctx.fillStyle = s.color;
        const size = 8 * s.sizeScalar; const w = size * 0.75; const h = size;
        ctx.beginPath(); ctx.moveTo(sx, sy - h + float); ctx.lineTo(sx + w, sy + float); ctx.lineTo(sx, sy + h + float); ctx.lineTo(sx - w, sy + float); ctx.fill(); ctx.shadowBlur = 0;
    }

    // Portal
    let gx = (goal.col * cellSize) + cellSize * 1.5; let gy = (goal.row * cellSize) + cellSize * 1.5;
    ctx.save(); ctx.translate(gx, gy); ctx.rotate(time);
    ctx.shadowBlur = 30; ctx.shadowColor = COLORS.portalOuter; ctx.strokeStyle = COLORS.portalOuter; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, cellSize * 0.4 + Math.sin(time*2)*2, 0, Math.PI*2); ctx.stroke();
    ctx.rotate(-time * 2); ctx.strokeStyle = COLORS.portalInner;
    ctx.beginPath(); ctx.arc(0, 0, cellSize * 0.25, 0, Math.PI*1.5); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, cellSize * 0.1, 0, Math.PI*2); ctx.fill();
    ctx.restore(); ctx.shadowBlur = 0;

    // Dragons
    for (let d of dragons) {
        let dx = (d.c * cellSize) + cellSize * 1.5; let dy = (d.r * cellSize) + cellSize * 1.5;
        if (d.state === 'SPAWNING') {
            let alpha = (Math.sin(time * 10) + 1) / 2;
            ctx.fillStyle = \`rgba(255, 0, 0, \${alpha * 0.3})\`;
            ctx.beginPath(); ctx.arc(dx, dy, cellSize * 0.4, 0, Math.PI*2); ctx.fill();
        } else if (d.state === 'DESPAWNING') ctx.globalAlpha = 0.5;

        if (d.state === 'IDLE' || d.state === 'CHARGING' || d.state === 'ATTACKING' || d.state === 'DESPAWNING') {
            ctx.save(); ctx.translate(dx, dy); ctx.rotate(d.angle);
            if (d.state === 'CHARGING') {
                let progress = d.timer / d.chargeMax;
                ctx.fillStyle = \`rgba(255, 100, 0, \${0.2 + progress * 0.3})\`;
                ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0, 0, 120, -0.4, 0.4); ctx.closePath(); ctx.fill();
            }
            ctx.fillStyle = COLORS.dragonBody; ctx.strokeStyle = COLORS.dragonGlow; ctx.lineWidth = 2;
            ctx.shadowBlur = 15; ctx.shadowColor = COLORS.dragonGlow;
            ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(-10, 10); ctx.lineTo(-5, 0); ctx.lineTo(-10, -10); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.fillStyle = d.state === 'CHARGING' ? '#fff' : '#ffff00';
            ctx.beginPath(); ctx.arc(5, 4, 2, 0, Math.PI*2); ctx.arc(5, -4, 2, 0, Math.PI*2); ctx.fill();
            ctx.restore(); ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1.0;
    }

    // Player
    if (player.invulnerableTimer > 0) ctx.globalAlpha = (Math.floor(Date.now() / 50) % 2 === 0) ? 0.3 : 0.8;
    ctx.save(); ctx.translate(player.x, player.y);
    
    let angleToGoal = Math.atan2(gy - player.y, gx - player.x);
    ctx.save(); ctx.rotate(angleToGoal); ctx.translate(cellSize * 0.7, 0); 
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'; ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
    ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-5, 8); ctx.lineTo(0, 0); ctx.lineTo(-5, -8); ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.rotate(player.rotation);
    ctx.shadowBlur = 20; ctx.shadowColor = COLORS.playerCore; ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(-10, 10); ctx.lineTo(-6, 0); ctx.lineTo(-10, -10); ctx.fill();
    ctx.fillStyle = COLORS.playerCore; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI*2); ctx.fill();
    ctx.restore(); ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;

    particles.forEach(p => p.draw(ctx));
    dust.forEach(p => p.draw(ctx));
    ctx.restore();

    if(joystick.active && gameState === 'PLAYING') {
        ctx.beginPath(); ctx.arc(joystick.start.x, joystick.start.y, JOYSTICK_MAX_RADIUS, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath(); ctx.arc(joystick.current.x, joystick.current.y, 35, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
    }
}

function loop() { requestAnimationFrame(loop); update(); draw(); }

window.addEventListener('resize', resize);
canvas.addEventListener('touchstart', e => { e.preventDefault(); let t = e.changedTouches[0]; joystick.active = true; joystick.start = { x: t.clientX, y: t.clientY }; joystick.current = { x: t.clientX, y: t.clientY }; joystick.vec = { x: 0, y: 0 }; }, {passive: false});
canvas.addEventListener('touchmove', e => { e.preventDefault(); if(!joystick.active) return; let t = e.changedTouches[0]; joystick.current = { x: t.clientX, y: t.clientY }; let dx = joystick.current.x - joystick.start.x; let dy = joystick.current.y - joystick.start.y; const dist = Math.hypot(dx, dy); if (dist > JOYSTICK_MAX_RADIUS) { const ratio = JOYSTICK_MAX_RADIUS / dist; joystick.current.x = joystick.start.x + dx * ratio; joystick.current.y = joystick.start.y + dy * ratio; } joystick.vec.x = dx; joystick.vec.y = dy; }, {passive: false});
const endTouch = e => { e.preventDefault(); joystick.active = false; joystick.vec = {x:0, y:0}; };
canvas.addEventListener('touchend', endTouch); canvas.addEventListener('touchcancel', endTouch);
window.addEventListener('keydown', e => { if(e.key==='ArrowUp'||e.key==='w') keys.up=true; if(e.key==='ArrowDown'||e.key==='s') keys.down=true; if(e.key==='ArrowLeft'||e.key==='a') keys.left=true; if(e.key==='ArrowRight'||e.key==='d') keys.right=true; });
window.addEventListener('keyup', e => { if(e.key==='ArrowUp'||e.key==='w') keys.up=false; if(e.key==='ArrowDown'||e.key==='s') keys.down=false; if(e.key==='ArrowLeft'||e.key==='a') keys.left=false; if(e.key==='ArrowRight'||e.key==='d') keys.right=false; });

function bind(id, action) { const el = document.getElementById(id); if(el) el.addEventListener('click', action); else console.warn('Element not found:', id); }
bind('home-play-btn', startGame);
bind('home-about-btn', showAbout);
bind('home-stats-btn', showStats);
bind('about-back-btn', showHome);
bind('stats-back-btn', showHome);
bind('start-btn', startGame); 
bind('next-level-btn', nextLevel);
bind('replay-level-btn', replayLevel);
bind('level-quit-btn', showHome);
bind('pause-btn', togglePause);
bind('pause-resume-btn', togglePause);
bind('pause-retry-btn', () => { togglePause(); replayLevel(); });
bind('pause-quit-btn', () => { togglePause(); showHome(); });
bind('restart-btn', startGame);
bind('go-home-btn', showHome);
bind('audio-btn', () => { let m = audio.toggleMute(); document.getElementById('audio-btn').innerText = m ? '🔇' : '🔊'; });

showHome();
</script>
</body>
</html>`;
