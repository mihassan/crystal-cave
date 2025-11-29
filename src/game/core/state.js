/**
 * Game State - All global game state and initialization
 */
import { DataManager } from '../systems/DataManager.js';
import { SoundEngine } from '../systems/SoundEngine.js';
import { Particle } from '../entities/Particle.js';
import { GAME_CONFIG, PHYSICS } from './constants.js';

// Canvas and rendering
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d', {
    alpha: false,  // No transparency needed - better performance
    desynchronized: true,  // Better performance for animations
    willReadFrequently: false  // We're not reading pixels back
});

// Core systems
export const audio = new SoundEngine();
export const gameData = new DataManager();
export const camera = { x: 0, y: 0 };

// Game state
export const state = {
    value: 'START',  // Using object to allow pass-by-reference updates
    levelStartTime: 0,
    levelPausedTime: 0
};

// Maze and grid
export let cellSize = 60;
export let cols = 0;
export let rows = 0;
export let maze = [];

// Player state
export const player = {
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
export const goal = { col: 0, row: 0 };
export let dragons = [];
export let shards = [];
export let particles = [];
export let dust = [];

// Game stats
export let lives = 3;
export let score = 0;
export let level = 1;
export let dragonSpawnTimer = 0;

// Input state
export const joystick = {
    active: false,
    start: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
    vec: { x: 0, y: 0 }
};

export const keys = {
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
export function setCellSize(size) {
    cellSize = size;
}

export function setMazeSize(newCols, newRows) {
    cols = newCols;
    rows = newRows;
}

export function setMaze(newMaze) {
    maze = newMaze;
}

export function setDragons(newDragons) {
    dragons = newDragons;
}

export function setShards(newShards) {
    shards = newShards;
}

export function setParticles(newParticles) {
    particles = newParticles;
}

export function setDust(newDust) {
    dust = newDust;
}

export function setLives(newLives) {
    lives = newLives;
}

export function setScore(newScore) {
    score = newScore;
}

export function setLevel(newLevel) {
    level = newLevel;
}

export function resetDragonSpawnTimer() {
    dragonSpawnTimer = 0;
}

export function incrementDragonSpawnTimer() {
    dragonSpawnTimer++;
}

// Initialize dust particles
export function initializeDust() {
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
export function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const minDim = Math.min(canvas.width, canvas.height);
    cellSize = minDim < GAME_CONFIG.CELL_SIZE_BREAKPOINT
        ? GAME_CONFIG.CELL_SIZE_SMALL
        : GAME_CONFIG.CELL_SIZE_LARGE;
}
