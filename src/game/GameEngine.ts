import { GAME_CONFIG, PHYSICS } from './core/constants';
import { GameState, Player, JoystickState, Goal, Shard } from './core/state';
import { Cell } from './entities/Cell';
import { Dragon } from './entities/Dragon';
import { Particle } from './entities/Particle';
import { generateMaze, calculateMazeSize, spawnCrystalShards, spawnDragon } from './systems/MazeGenerator';
import { DataManager } from './systems/DataManager';
import { SoundEngine } from './systems/SoundEngine';
import { setRenderDependencies, setRenderState, draw } from './systems/Renderer';
import { showQuirky } from './ui/QuirkyMessages';

export class GameEngine {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    audio: SoundEngine;
    data: DataManager;
    camera: { x: number; y: number };
    state: GameState;

    cellSize: number;
    cols: number;
    rows: number;
    maze: Cell[];

    player: Player;
    goal: Goal;
    dragons: Dragon[];
    shards: Shard[];
    particles: Particle[];
    dust: Particle[];

    lives: number;
    score: number;
    level: number;
    dragonSpawnTimer: number;

    joystick: JoystickState;
    keys: { up: boolean; down: boolean; left: boolean; right: boolean };

    lastTime: number;
    animationFrameId: number;
    
    // Store event handlers for cleanup
    private _boundHandlers: {
        resize: () => void;
        keydown: (e: KeyboardEvent) => void;
        keyup: (e: KeyboardEvent) => void;
        mousedown: (e: MouseEvent) => void;
        mousemove: (e: MouseEvent) => void;
        mouseup: () => void;
        touchstart: (e: TouchEvent) => void;
        touchmove: (e: TouchEvent) => void;
        touchend: () => void;
    } | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', {
            alpha: false,
            desynchronized: true,
            willReadFrequently: false
        }) as CanvasRenderingContext2D;

        this.audio = new SoundEngine();
        this.data = new DataManager();
        this.camera = { x: 0, y: 0 };

        this.state = {
            value: 'HOME',
            levelStartTime: 0,
            levelPausedTime: 0
        };

        this.cellSize = 60;
        this.cols = 0;
        this.rows = 0;

        // Generate initial maze for background
        const initialSize = calculateMazeSize(1);
        this.cols = initialSize.cols;
        this.rows = initialSize.rows;
        this.maze = generateMaze(this.cols, this.rows);

        this.player = {
            col: 0, row: 0, x: 0, y: 0, radius: 0, vx: 0, vy: 0, rotation: 0, invulnerableTimer: 0
        };

        this.goal = { col: 0, row: 0 };
        this.dragons = [];
        this.shards = [];
        this.particles = [];
        this.dust = [];

        this.lives = 3;
        this.score = 0;
        this.level = 1;
        this.dragonSpawnTimer = 0;

        this.joystick = {
            active: false,
            start: { x: 0, y: 0 },
            current: { x: 0, y: 0 },
            vec: { x: 0, y: 0 }
        };
        (window as any).__joystickState = this.joystick;

        this.keys = { up: false, down: false, left: false, right: false };
        this.lastTime = 0;
        this.animationFrameId = 0;

        this.init();
    }

    init() {
        console.log('🚀 [GameEngine.init] Starting initialization...');

        setRenderDependencies({
            canvas: this.canvas,
            ctx: this.ctx,
            camera: this.camera
        });

        console.log('🎮 [GameEngine.init] Render dependencies set');

        this.setupInputListeners();
        this.resize();

        console.log('📐 [GameEngine.init] Input and resize configured');

        // Start loop
        this.lastTime = performance.now();
        console.log('▶️ [GameEngine.init] Starting game loop...');
        this.loop(this.lastTime);
        console.log('✅ [GameEngine.init] Initialization complete');
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        if (window.innerWidth < GAME_CONFIG.CELL_SIZE_BREAKPOINT) {
            this.cellSize = GAME_CONFIG.CELL_SIZE_SMALL;
        } else {
            this.cellSize = GAME_CONFIG.CELL_SIZE_LARGE;
        }
    }

    setupInputListeners() {
        // Create bound handlers that can be removed later
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' || e.key === 'w') this.keys.up = true;
            if (e.key === 'ArrowDown' || e.key === 's') this.keys.down = true;
            if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.left = true;
            if (e.key === 'ArrowRight' || e.key === 'd') this.keys.right = true;
            if (e.key === 'Escape') this.togglePause();
        };

        const handleKeyup = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' || e.key === 'w') this.keys.up = false;
            if (e.key === 'ArrowDown' || e.key === 's') this.keys.down = false;
            if (e.key === 'ArrowLeft' || e.key === 'a') this.keys.left = false;
            if (e.key === 'ArrowRight' || e.key === 'd') this.keys.right = false;
        };

        // Touch / Mouse input helpers
        const startInput = (x: number, y: number) => {
            if (this.state.value !== 'PLAYING') return;
            this.joystick.active = true;
            this.joystick.start.x = x;
            this.joystick.start.y = y;
            this.joystick.current.x = x;
            this.joystick.current.y = y;
            this.joystick.vec.x = 0;
            this.joystick.vec.y = 0;

            // Audio init on first interaction
            if (!this.audio.initialized) this.audio.init();
        };

        const moveInput = (x: number, y: number) => {
            if (!this.joystick.active) return;

            this.joystick.current.x = x;
            this.joystick.current.y = y;

            let dx = x - this.joystick.start.x;
            let dy = y - this.joystick.start.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > PHYSICS.JOYSTICK_MAX_RADIUS) {
                const ratio = PHYSICS.JOYSTICK_MAX_RADIUS / dist;
                dx *= ratio;
                dy *= ratio;
                this.joystick.current.x = this.joystick.start.x + dx;
                this.joystick.current.y = this.joystick.start.y + dy;
            }

            this.joystick.vec.x = dx / PHYSICS.JOYSTICK_MAX_RADIUS;
            this.joystick.vec.y = dy / PHYSICS.JOYSTICK_MAX_RADIUS;
        };

        const endInput = () => {
            this.joystick.active = false;
            this.joystick.vec.x = 0;
            this.joystick.vec.y = 0;
        };

        // Create bound event handlers
        const handleResize = () => this.resize();
        const handleMousedown = (e: MouseEvent) => startInput(e.clientX, e.clientY);
        const handleMousemove = (e: MouseEvent) => moveInput(e.clientX, e.clientY);
        const handleMouseup = () => endInput();
        const handleTouchstart = (e: TouchEvent) => {
            e.preventDefault();
            startInput(e.touches[0].clientX, e.touches[0].clientY);
        };
        const handleTouchmove = (e: TouchEvent) => {
            e.preventDefault();
            moveInput(e.touches[0].clientX, e.touches[0].clientY);
        };
        const handleTouchend = () => endInput();

        // Store handlers for cleanup
        this._boundHandlers = {
            resize: handleResize,
            keydown: handleKeydown,
            keyup: handleKeyup,
            mousedown: handleMousedown,
            mousemove: handleMousemove,
            mouseup: handleMouseup,
            touchstart: handleTouchstart,
            touchmove: handleTouchmove,
            touchend: handleTouchend
        };

        // Add event listeners
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('keyup', handleKeyup);
        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
        window.addEventListener('touchmove', handleTouchmove, { passive: false });
        window.addEventListener('touchend', handleTouchend);
        
        this.canvas.addEventListener('mousedown', handleMousedown);
        this.canvas.addEventListener('touchstart', handleTouchstart, { passive: false });
    }

    startLevel(lvl: number) {
        console.log('🎮 [GameEngine.startLevel] Called with level:', lvl);
        this.level = lvl;
        const size = calculateMazeSize(lvl);
        this.cols = size.cols;
        this.rows = size.rows;

        this.maze = generateMaze(this.cols, this.rows);
        this.shards = spawnCrystalShards(this.maze, this.cols, this.rows, this.cellSize);

        console.log('✅ [GameEngine.startLevel] Maze and shards generated:', {
            mazeSize: this.maze.length,
            shardsCount: this.shards.length,
            cellSize: this.cellSize
        });

        // Reset player
        this.player.col = 1;
        this.player.row = 1;
        this.player.x = (this.player.col * this.cellSize) + this.cellSize * 1.5;
        this.player.y = (this.player.row * this.cellSize) + this.cellSize * 1.5;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.radius = this.cellSize * 0.25;
        this.player.invulnerableTimer = 0;

        console.log('👤 [GameEngine.startLevel] Player initialized:', {
            x: this.player.x,
            y: this.player.y,
            radius: this.player.radius
        });

        // Set goal
        this.goal.col = this.cols - 2;
        this.goal.row = this.rows - 2;

        // Reset entities
        this.dragons = [];
        this.particles = [];
        this.dust = [];

        // Spawn initial dragons
        const initialDragons = Math.min(
            GAME_CONFIG.INITIAL_DRAGONS + Math.floor((lvl - 1) * GAME_CONFIG.DRAGONS_PER_LEVEL),
            GAME_CONFIG.MAX_DRAGONS_CAP
        );

        for (let i = 0; i < initialDragons; i++) {
            this.dragons.push(spawnDragon(this.cols, this.rows, this.player.col, this.player.row, this.level));
        }

        console.log('🐉 [GameEngine.startLevel] Dragons spawned:', this.dragons.length);

        this.dragonSpawnTimer = 0;
        this.state.value = 'PLAYING';
        this.state.levelStartTime = Date.now();

        console.log('🎬 [GameEngine.startLevel] State set to PLAYING');

        // Snap camera to player
        this.camera.x = this.player.x;
        this.camera.y = this.player.y;

        // Generate dust
        for (let i = 0; i < GAME_CONFIG.DUST_PARTICLES; i++) {
            this.dust.push(new Particle(
                Math.random() * this.cols * this.cellSize,
                Math.random() * this.rows * this.cellSize,
                'dust'
            ));
        }

        // Update HUD
        this.updateUI();
        showQuirky('IDLE');
    }

    update() {
        if (this.state.value !== 'PLAYING') return;

        // Player movement
        let ax = 0;
        let ay = 0;

        if (this.joystick.active) {
            ax = this.joystick.vec.x * PHYSICS.ACCEL;
            ay = this.joystick.vec.y * PHYSICS.ACCEL;
        } else {
            if (this.keys.up) ay = -PHYSICS.ACCEL;
            if (this.keys.down) ay = PHYSICS.ACCEL;
            if (this.keys.left) ax = -PHYSICS.ACCEL;
            if (this.keys.right) ax = PHYSICS.ACCEL;
        }

        this.player.vx += ax;
        this.player.vy += ay;
        this.player.vx *= PHYSICS.FRICTION;
        this.player.vy *= PHYSICS.FRICTION;

        // Cap speed
        const speed = Math.sqrt(this.player.vx * this.player.vx + this.player.vy * this.player.vy);
        if (speed > PHYSICS.MAX_SPEED) {
            const ratio = PHYSICS.MAX_SPEED / speed;
            this.player.vx *= ratio;
            this.player.vy *= ratio;
        }

        // Rotation - atan2 gives angle from positive X axis, ship is drawn pointing right (positive X)
        if (speed > 0.1) {
            this.player.rotation = Math.atan2(this.player.vy, this.player.vx);
        }

        // Collision with walls
        let nextX = this.player.x + this.player.vx;
        let nextY = this.player.y + this.player.vy;
        let pc = Math.floor((this.player.x - this.cellSize) / this.cellSize);
        let pr = Math.floor((this.player.y - this.cellSize) / this.cellSize);
        pc = Math.max(0, Math.min(this.cols - 1, pc));
        pr = Math.max(0, Math.min(this.rows - 1, pr));

        const cell = this.maze[pc + pr * this.cols];
        const cx = (pc * this.cellSize) + this.cellSize;
        const cy = (pr * this.cellSize) + this.cellSize;
        const r = this.player.radius;

        // Check wall collisions
        if (cell.walls.right && nextX + r > cx + this.cellSize) {
            nextX = cx + this.cellSize - r;
            this.player.vx = 0;
        }
        if (cell.walls.left && nextX - r < cx) {
            nextX = cx + r;
            this.player.vx = 0;
        }
        if (cell.walls.bottom && nextY + r > cy + this.cellSize) {
            nextY = cy + this.cellSize - r;
            this.player.vy = 0;
        }
        if (cell.walls.top && nextY - r < cy) {
            nextY = cy + r;
            this.player.vy = 0;
        }

        this.player.x = nextX;
        this.player.y = nextY;
        this.player.col = pc;
        this.player.row = pr;

        // Camera follow
        this.camera.x += (this.player.x - this.camera.x) * 0.1;
        this.camera.y += (this.player.y - this.camera.y) * 0.1;

        // Dragon spawning
        this.dragonSpawnTimer++;
        const spawnRate = Math.max(
            GAME_CONFIG.DRAGON_SPAWN_RATE_MIN,
            GAME_CONFIG.DRAGON_SPAWN_RATE_BASE - (this.level * GAME_CONFIG.DRAGON_SPAWN_RATE_REDUCTION)
        );
        const maxDragons = Math.min(
            GAME_CONFIG.MAX_DRAGONS_BASE + Math.floor(this.level * GAME_CONFIG.DRAGONS_PER_LEVEL),
            GAME_CONFIG.MAX_DRAGONS_CAP
        );

        if (this.dragonSpawnTimer > spawnRate && this.dragons.length < maxDragons) {
            this.dragons.push(spawnDragon(this.cols, this.rows, pc, pr, this.level));
            this.dragonSpawnTimer = 0;
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update();
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            // Fire projectile collision
            if (p.type === 'fire' && Math.hypot(p.x - this.player.x, p.y - this.player.y) < this.player.radius + p.size) {
                this.handleDeath();
            }
        }

        // Safety limit
        if (this.particles.length > GAME_CONFIG.PARTICLE_SAFETY_LIMIT) {
            console.warn('Particle limit reached, cleaning up');
            this.particles = this.particles.filter(p => p.life > 0.1);
        }

        // Trail
        if (speed > 2 && Math.random() < GAME_CONFIG.PARTICLE_SPAWN_CHANCE) {
            this.particles.push(new Particle(this.player.x, this.player.y, 'trail'));
        }

        // Update dragons
        this.updateDragons();

        // Check shards
        this.checkShards();

        // Check goal
        const dx = this.player.x - ((this.goal.col * this.cellSize) + this.cellSize * 1.5);
        const dy = this.player.y - ((this.goal.row * this.cellSize) + this.cellSize * 1.5);
        if (Math.sqrt(dx * dx + dy * dy) < this.cellSize * 0.5) {
            this.levelComplete();
        }

        // Invulnerability
        if (this.player.invulnerableTimer > 0) {
            this.player.invulnerableTimer--;
        }
    }

    updateDragons() {
        for (let i = this.dragons.length - 1; i >= 0; i--) {
            const d = this.dragons[i];
            const dx = (d.c * this.cellSize) + this.cellSize * 1.5;
            const dy = (d.r * this.cellSize) + this.cellSize * 1.5;
            const distToPlayer = Math.hypot(this.player.x - dx, this.player.y - dy);

            // Update angle to face player (except when attacking)
            if (d.state !== 'ATTACKING') {
                d.angle = Math.atan2(this.player.y - dy, this.player.x - dx);
            }

            // State machine
            if (d.state === 'SPAWNING') {
                d.timer++;
                if (d.timer > GAME_CONFIG.DRAGON_SPAWN_TIME) {
                    d.state = 'IDLE';
                    d.timer = 0;
                }
            } else if (d.state === 'IDLE') {
                d.life--;
                // Detect player proximity
                if (distToPlayer < this.cellSize * GAME_CONFIG.DRAGON_DETECT_RANGE) {
                    d.state = 'CHARGING';
                    d.timer = 0;
                    this.audio.playCharge();
                }
                // Despawn if lifetime expired
                if (d.life <= 0) {
                    d.state = 'DESPAWNING';
                }
            } else if (d.state === 'CHARGING') {
                d.timer++;
                // Cancel charge if player moves away
                if (distToPlayer > this.cellSize * GAME_CONFIG.DRAGON_CHASE_RANGE) {
                    d.state = 'IDLE';
                    d.timer = 0;
                }
                // Begin attack
                if (d.timer >= d.chargeMax) {
                    d.state = 'ATTACKING';
                    d.timer = 0;
                    this.audio.playRoar();
                }
            } else if (d.state === 'ATTACKING') {
                d.timer++;
                // Fire projectiles periodically
                if (d.timer % GAME_CONFIG.DRAGON_FIRE_RATE === 0) {
                    const speed = GAME_CONFIG.DRAGON_FIRE_SPEED;
                    this.particles.push(new Particle(
                        dx, dy, 'fire',
                        Math.cos(d.angle) * speed,
                        Math.sin(d.angle) * speed,
                        null,
                        this.cellSize
                    ));
                }
                // End attack
                if (d.timer > GAME_CONFIG.DRAGON_ATTACK_DURATION) {
                    d.state = 'IDLE';
                    d.timer = 0;
                }
            } else if (d.state === 'DESPAWNING') {
                d.timer++;
                if (d.timer > GAME_CONFIG.DRAGON_DESPAWN_TIME) {
                    this.dragons.splice(i, 1);
                }
            }

            // Collision with player
            if (d.state !== 'SPAWNING' && d.state !== 'DESPAWNING' &&
                distToPlayer < this.cellSize * GAME_CONFIG.DRAGON_COLLISION_RANGE) {
                this.handleDeath();
            }

            // Quirky warning message
            if (d.state !== 'SPAWNING' &&
                distToPlayer < this.cellSize * GAME_CONFIG.DRAGON_CLOSE_RANGE &&
                distToPlayer > this.cellSize * 0.6) {
                showQuirky('NEAR_DRAGON');
            }
        }
    }

    checkShards() {
        this.shards.forEach(s => {
            if (!s.active) return;

            const sx = (s.c * this.cellSize) + this.cellSize * 1.5;
            const sy = (s.r * this.cellSize) + this.cellSize * 1.5;
            const finalX = sx + s.mx;
            const finalY = sy + s.my;
            const dx = this.player.x - finalX;
            const dy = this.player.y - finalY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Magnetic attraction
            if (dist < this.cellSize * GAME_CONFIG.SHARD_ATTRACT_RANGE) {
                s.mx += (this.player.x - finalX) * 0.05;
                s.my += (this.player.y - finalY) * 0.05;
                // Occasional shimmer particles
                if (Math.random() < 0.1) {
                    this.particles.push(new Particle(finalX, finalY, 'trail', 0, 0, s.color));
                }
            }

            // Collection
            if (dist < this.cellSize * GAME_CONFIG.SHARD_COLLECT_RANGE) {
                s.active = false;
                this.score++;
                this.data.addShards(1);
                this.audio.playCollect(this.score);
                showQuirky('COLLECT');

                // Sparkles
                for (let i = 0; i < 12; i++) {
                    this.particles.push(new Particle(sx, sy, 'spark', 0, 0, s.color));
                }

                this.updateUI();
            }
        });
    }

    handleDeath() {
        if (this.player.invulnerableTimer > 0) return;

        this.lives--;
        this.audio.playHit();
        showQuirky('HIT');
        this.updateUI();

        this.player.invulnerableTimer = GAME_CONFIG.INVULNERABILITY_FRAMES;

        // Camera shake
        this.camera.x += (Math.random() - 0.5) * 30;
        this.camera.y += (Math.random() - 0.5) * 30;

        if (this.lives <= 0) {
            this.state.value = 'GAMEOVER';
        }
    }

    levelComplete() {
        const duration = Date.now() - this.state.levelStartTime;
        this.state.value = 'TRANSITION';
        this.lives++;
        this.updateUI();

        // Emit event or callback for UI
        const event = new CustomEvent('level-complete', {
            detail: { level: this.level, time: duration }
        });
        window.dispatchEvent(event);
    }

    togglePause() {
        if (this.state.value === 'PLAYING') {
            this.state.value = 'PAUSED';
            this.state.levelPausedTime = Date.now();
            window.dispatchEvent(new CustomEvent('game-paused'));
        } else if (this.state.value === 'PAUSED') {
            this.state.value = 'PLAYING';
            // Adjust start time to account for pause
            const pauseDuration = Date.now() - this.state.levelPausedTime;
            this.state.levelStartTime += pauseDuration;
            window.dispatchEvent(new CustomEvent('game-resumed'));
        }
    }

    updateUI() {
        const event = new CustomEvent('hud-update', {
            detail: {
                lives: this.lives,
                score: this.score,
                level: this.level,
                time: this.state.value === 'PLAYING' ? Date.now() - this.state.levelStartTime : 0
            }
        });
        window.dispatchEvent(event);
    }

    loop(timestamp: number) {
        try {
            // Debug: Log at VERY start before anything can crash
            const frame = Math.floor(timestamp / 16.67);
            if (frame % 60 === 0) {
                console.log('🔄 [loop] ENTRY - Frame:', frame, 'State:', this.state.value);
            }

            // const _dt = timestamp - this.lastTime;
            this.lastTime = timestamp;

            this.update();

            if (frame % 60 === 0) {
                console.log('🎯 [loop] Update complete, about to setRenderState...');
            }

            setRenderState({
                gameState: this.state.value,
                cellSize: this.cellSize,
                maze: this.maze,
                player: this.player,
                goal: this.goal,
                dragons: this.dragons,
                shards: this.shards,
                particles: this.particles,
                dust: this.dust
            });

            if (frame % 60 === 0) {
                console.log('📞 [loop] Calling draw()...');
            }

            draw();

            if (frame % 60 === 0) {
                console.log('✅ [loop] Draw complete, scheduling next frame...');
            }

            this.animationFrameId = requestAnimationFrame((t) => this.loop(t));

            if (frame % 60 === 0) {
                console.log('🔜 [loop] Next frame scheduled');
            }
        } catch (error) {
            console.error('❌ [loop] CRASHED:', error);
            throw error; // Re-throw to see in console
        }
    }

    cleanup() {
        console.log('🧹 [GameEngine.cleanup] Starting cleanup...');
        
        // Cancel animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = 0;
        }
        
        // Remove all event listeners
        if (this._boundHandlers) {
            window.removeEventListener('resize', this._boundHandlers.resize);
            window.removeEventListener('keydown', this._boundHandlers.keydown);
            window.removeEventListener('keyup', this._boundHandlers.keyup);
            window.removeEventListener('mousemove', this._boundHandlers.mousemove);
            window.removeEventListener('mouseup', this._boundHandlers.mouseup);
            window.removeEventListener('touchmove', this._boundHandlers.touchmove);
            window.removeEventListener('touchend', this._boundHandlers.touchend);
            
            this.canvas.removeEventListener('mousedown', this._boundHandlers.mousedown);
            this.canvas.removeEventListener('touchstart', this._boundHandlers.touchstart);
            
            this._boundHandlers = null;
        }
        
        // Clean up global joystick state
        delete (window as any).__joystickState;
        
        console.log('✅ [GameEngine.cleanup] Cleanup complete');
    }
}
