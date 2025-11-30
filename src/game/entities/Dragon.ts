/**
 * Dragon entity with AI state machine
 */
export class Dragon {
    c: number;
    r: number;
    state: 'SPAWNING' | 'IDLE' | 'CHARGING' | 'ATTACKING' | 'DESPAWNING';
    timer: number;
    life: number;
    angle: number;
    chargeMax: number;

    constructor(c: number, r: number, level: number) {
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
