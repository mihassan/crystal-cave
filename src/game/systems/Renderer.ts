import { COLORS } from '../core/constants';
import { RenderState } from '../core/state';

/**
 * Renderer - Main game rendering system
 */

// State will be injected - using _r prefix to avoid conflicts when bundled
let _rCanvas: HTMLCanvasElement;
let _rCtx: CanvasRenderingContext2D;
let _rCamera: { x: number; y: number };
let _rendererGameState: string;
let _rCellSize: number;
let _rMaze: any[];
let _rPlayer: any;
let _rGoal: any;
let _rDragons: any[];
let _rShards: any[];
let _rParticles: any[];
let _rDust: any[];

export function setRenderDependencies(deps: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; camera: { x: number; y: number } }) {
    _rCanvas = deps.canvas;
    _rCtx = deps.ctx;
    _rCamera = deps.camera;
}

export function setRenderState(state: RenderState) {
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

export function draw() {
    if (!_rCtx || !_rCanvas) return;

    // Debug: Log render state every 60 frames (~1 second)
    const frameCount = Math.floor(Date.now() / 16.67); // Approximate frame count
    if (frameCount % 60 === 0) {
        console.log('[Renderer.draw] State check:', {
            gameState: _rendererGameState,
            hasPlayer: !!_rPlayer,
            hasDragons: !!_rDragons,
            dragonsCount: _rDragons?.length || 0,
            hasShards: !!_rShards,
            shardsCount: _rShards?.length || 0,
            hasMaze: !!_rMaze,
            mazeCount: _rMaze?.length || 0,
            player: _rPlayer ? { x: _rPlayer.x, y: _rPlayer.y } : null
        });
    }

    // Force reset transform (critical for HMR in dev mode)
    _rCtx.setTransform(1, 0, 0, 1, 0, 0);

    // Clear screen
    _rCtx.fillStyle = COLORS.bg;
    _rCtx.fillRect(0, 0, _rCanvas.width, _rCanvas.height);

    // Apply camera translation
    _rCtx.save();
    const cx = _rCanvas.width / 2 - _rCamera.x;
    const cy = _rCanvas.height / 2 - _rCamera.y;
    _rCtx.translate(cx, cy);

    // Menu screens: minimal rendering
    if (_rendererGameState === 'HOME' || _rendererGameState === 'ABOUT' || _rendererGameState === 'STATS') {
        drawMazeWalls(0.2);
        _rDust.forEach(p => p.draw(_rCtx));
        // Ensure globalAlpha is reset after particle drawing
        _rCtx.globalAlpha = 1.0;
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
    
    // Ensure globalAlpha is reset after all particle drawing
    _rCtx.globalAlpha = 1.0;

    _rCtx.restore();

    // Draw joystick (if active) - after restore, no transforms
    drawJoystick();
}

function drawMazeWalls(opacity: number) {
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

function drawShards(time: number) {
    if (!_rShards || _rShards.length === 0) {
        console.warn('[drawShards] No shards to draw!');
        return;
    }
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

function drawPortal(time: number) {
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

function drawDragons(time: number) {
    if (!_rDragons || _rDragons.length === 0) {
        // Don't warn - it's normal to have 0 dragons sometimes
        return;
    }
    for (let d of _rDragons) {
        const dx = (d.c * _rCellSize) + _rCellSize * 1.5;
        const dy = (d.r * _rCellSize) + _rCellSize * 1.5;

        // Spawning animation
        if (d.state === 'SPAWNING') {
            const alpha = (Math.sin(time * 10) + 1) / 2;
            _rCtx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.3})`;
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
                _rCtx.fillStyle = `rgba(255, 100, 0, ${0.2 + progress * 0.3})`;
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

function drawPlayer(_time: number) {
    if (!_rPlayer) {
        console.error('[drawPlayer] No player data!');
        return;
    }
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
    const joystickState = (window as any).__joystickState;
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

// HMR detection for debugging
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        console.warn('🔥 Renderer.ts reloaded by HMR! Module state reset.');
    });
}
