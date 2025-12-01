/**
 * Dragon entity with AI state machine
 */

export type DragonType = 'FIRE' | 'ICE' | 'LIGHTNING';

export class Dragon {
    c: number;
    r: number;
    state: 'SPAWNING' | 'IDLE' | 'CHARGING' | 'ATTACKING' | 'DESPAWNING';
    timer: number;
    life: number;
    angle: number;
    chargeMax: number;
    type: DragonType;
    color: string;
    glowColor: string;
    fireSpeed: number;
    fireRate: number;
    fireDecay: number;

    constructor(c: number, r: number, level: number, type?: DragonType) {
        this.c = c;  // Column position
        this.r = r;  // Row position
        this.state = 'SPAWNING';
        this.timer = 0;
        this.life = 1200;
        this.angle = 0;

        // Calculate base charge time based on level
        const baseCharge = 90;
        const reductionPerLevel = Math.min(level * 5, 40);
        this.chargeMax = Math.max(baseCharge - reductionPerLevel, 30);

        // Determine type based on level if not specified
        if (!type) {
            if (level >= 7) {
                const rand = Math.random();
                type = rand < 0.4 ? 'LIGHTNING' : (rand < 0.7 ? 'ICE' : 'FIRE');
            } else if (level >= 4) {
                type = Math.random() < 0.5 ? 'ICE' : 'FIRE';
            } else {
                type = 'FIRE';
            }
        }

        this.type = type;

        // Initialize with defaults
        this.color = '#ff4d4d';
        this.glowColor = '#ff4d4d';
        this.fireSpeed = 4;
        this.fireRate = 3;
        this.fireDecay = 0.08;

        // Apply type-specific stats
        this.applyTypeStats();
    }

    private applyTypeStats() {
        switch (this.type) {
            case 'FIRE':
                this.color = '#ff4d4d';
                this.glowColor = '#ff4d4d';
                this.fireSpeed = 4;
                this.fireRate = 3;
                this.fireDecay = 0.08;
                break;
            case 'ICE':
                this.color = '#00d9ff';
                this.glowColor = '#00d9ff';
                this.fireSpeed = 2.4;
                this.fireRate = 5;
                this.fireDecay = 0.04; // Lasts 2x longer
                this.chargeMax *= 1.5; // Slower
                break;
            case 'LIGHTNING':
                this.color = '#ffff00';
                this.glowColor = '#ff00ff';
                this.fireSpeed = 6;
                this.fireRate = 1;
                this.fireDecay = 0.12;
                this.chargeMax *= 0.5; // Much faster
                break;
        }
    }
}
