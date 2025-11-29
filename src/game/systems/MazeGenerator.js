/**
 * MazeGenerator - Procedural maze generation using recursive backtracking
 */
import { Cell } from '../entities/Cell.js';
import { Dragon } from '../entities/Dragon.js';
import { GAME_CONFIG, CRYSTAL_COLORS } from '../core/constants.js';
import { randomInt } from '../utils/helpers.js';

export function calculateMazeSize(level) {
    let size = GAME_CONFIG.MAZE_BASE_SIZE + ((level - 1) * GAME_CONFIG.MAZE_GROWTH_RATE);
    if (size > GAME_CONFIG.MAZE_MAX_SIZE) size = GAME_CONFIG.MAZE_MAX_SIZE;
    return { cols: size, rows: size };
}

export function generateMaze(cols, rows) {
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

export function spawnCrystalShards(maze, cols, rows, cellSize) {
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

export function spawnDragon(cols, rows, playerCol, playerRow, level) {
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
