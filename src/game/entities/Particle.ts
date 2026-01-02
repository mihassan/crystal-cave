import { COLORS } from '../core/constants';

/**
 * Particle entity - visual effects system
 */
export class Particle {
    x: number;
    y: number;
    type: string;
    vx: number;
    vy: number;
    size: number;
    life: number;
    decay: number;
    color: string;

    constructor(x: number, y: number, type: string, vx = 0, vy = 0, color: string | null = null, cellSize = 60, dragonType?: string, customDecay?: number) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0;
        this.vx = 0;
        this.vy = 0;
        this.size = 0;
        this.decay = 0;
        this.color = '#fff';

        if (type === 'trail') {
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 4 + 2;
            this.decay = 0.05;
            this.color = color || COLORS.playerCore;
        }
        else if (type === 'fire') {
            this.vx = vx + (Math.random() - 0.5);
            this.vy = vy + (Math.random() - 0.5);
            this.size = Math.random() * 6 + 4;
            this.decay = customDecay || 0.08;

            // Color based on dragon type
            if (dragonType === 'ICE') {
                this.color = '#00d9ff';
            } else if (dragonType === 'LIGHTNING') {
                this.color = '#ffff00';
            } else {
                this.color = COLORS.fire;
            }
        }
        else if (type === 'spark') {
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.size = Math.random() * 3 + 1;
            this.decay = 0.03;
            this.color = color || '#fff';
        }
        else if (type === 'dust') {
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.size = Math.random() * 2;
            this.life = Math.random();
            this.decay = 0.00;
            this.color = 'rgba(100, 200, 255, 0.2)';
        }
        else if (type === 'portal') {
            this.x = x + (Math.random() - 0.5) * cellSize;
            this.y = y + (Math.random() - 0.5) * cellSize;
            this.vx = 0;
            this.vy = -1 - Math.random();
            this.size = Math.random() * 3 + 1;
            this.decay = 0.02;
            this.color = '#fff';
        }
        else if (type === 'player_bullet') {
            // Player bullet - set by caller
            this.vx = vx;
            this.vy = vy;
            this.size = 2;
            this.decay = 0; // Life is managed externally for bullets
            this.color = color || COLORS.playerBullet;
        }
    }

    update(dt: number = 1.0) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= this.decay * dt;
    }

    draw(ctx: CanvasRenderingContext2D) {
        const prevAlpha = ctx.globalAlpha;
        ctx.globalAlpha = this.type === 'dust' ? 0.3 : this.life;
        ctx.fillStyle = this.color;

        if (this.type === 'fire' && this.life < 0.5) {
            ctx.fillStyle = '#ff3300';
        }

        // Player bullets glow effect
        if (this.type === 'player_bullet') {
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            
            // Draw as elongated streak in direction of movement
            const angle = Math.atan2(this.vy, this.vx);
            const length = 8;
            
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(angle);
            
            ctx.beginPath();
            ctx.ellipse(0, 0, length, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            ctx.shadowBlur = 0;
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * (this.type === 'fire' ? 1 : this.life), 0, Math.PI * 2);
            ctx.fill();
        }

        // Restore previous alpha to prevent affecting subsequent renders
        ctx.globalAlpha = prevAlpha;
    }
}
