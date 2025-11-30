import { Cell } from '../entities/Cell';
import { Dragon } from '../entities/Dragon';
import { Particle } from '../entities/Particle';

export interface Player {
    col: number;
    row: number;
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
    rotation: number;
    invulnerableTimer: number;
}

export interface Shard {
    c: number;
    r: number;
    active: boolean;
    phase: number;
    mx: number;
    my: number;
    color: string;
    sizeScalar: number;
}

export interface Goal {
    col: number;
    row: number;
}

export interface JoystickState {
    active: boolean;
    start: { x: number; y: number };
    current: { x: number; y: number };
    vec: { x: number; y: number };
}

export interface GameState {
    value: 'START' | 'HOME' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'TRANSITION' | 'ABOUT' | 'STATS';
    levelStartTime: number;
    levelPausedTime: number;
}

export interface RenderState {
    gameState: string;
    cellSize: number;
    maze: Cell[];
    player: Player;
    goal: Goal;
    dragons: Dragon[];
    shards: Shard[];
    particles: Particle[];
    dust: Particle[];
}
