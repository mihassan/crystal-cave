/**
 * Particle entity - visual effects system
 */
import { COLORS } from '../core/constants.js';

export class Particle {
    constructor(x, y, type, vx = 0, vy = 0, color = null, cellSize = 60) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0;

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
            this.decay = 0.08;
            this.color = COLORS.fire;
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
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.globalAlpha = this.type === 'dust' ? 0.3 : this.life;
        ctx.fillStyle = this.color;

        if (this.type === 'fire' && this.life < 0.5) {
            ctx.fillStyle = '#ff3300';
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (this.type === 'fire' ? 1 : this.life), 0, Math.PI * 2);
        ctx.fill();
    }
}
