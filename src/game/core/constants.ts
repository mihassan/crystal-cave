/**
 * Game Constants and Configuration
 * All magic numbers, colors, and configuration values
 */

// Color palette
export const COLORS = {
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

export const CRYSTAL_COLORS = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];

// Physics constants
export const PHYSICS = {
    FRICTION: 0.92,
    ACCEL: 0.35,
    MAX_SPEED: 4.5,
    JOYSTICK_MAX_RADIUS: 70
};

// Game configuration
export const GAME_CONFIG = {
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
export const QUIRKY_MSGS = {
    COLLECT: ["Ooh, shiny!", "Mine!", "Sparkly!", "Bling!", "Treasure!", "Fancy rock!", "Cha-ching!", "Glow up!"],
    NEAR_DRAGON: ["Don't wake him!", "Big lizard alert!", "Sizzling nearby!", "Shhh...", "Do not pet!", "Spicy breath!", "Too hot to handle!"],
    HIT: ["Ouchie!", "Too hot!", "Need ice!", "That stings!", "Singed!", "Hull breach!", "Medic!"],
    IDLE: ["Hello?", "Taking a nap?", "Dragons don't wait!", "Move it!", "Echo... echo...", "Engine cooling?"]
};

// Quirky message configuration
export const QUIRKY_CONFIG = {
    COOLDOWN: 2000,  // ms between non-urgent messages
    DISPLAY_DURATION: 2000,  // ms to show message
    COLORS: {
        HIT: '#ff6b6b',
        NEAR_DRAGON: '#ff6b6b',
        COLLECT: '#ffd700',
        DEFAULT: '#4cc9f0'
    }
};
