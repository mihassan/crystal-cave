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
export function startGame() {
    audio.init();
    setLives(3);
    setScore(0);
    setLevel(1);
    startLevel();
}

export function startLevel() {
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

export function togglePause() {
    if (state.value === 'PLAYING') {
        state.levelPausedTime = Date.now();
        showPause();
    } else if (state.value === 'PAUSED') {
        state.levelStartTime += (Date.now() - state.levelPausedTime);
        hidePause();
    }
}

export function nextLevel() {
    if (lives < 5) setLives(lives + 1);
    setLevel(level + 1);
    startLevel();
}

export function replayLevel() {
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
export function update() {
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
export function loop() {
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
