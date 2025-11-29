/**
 * SoundEngine - Web Audio API sound system
 */
export class SoundEngine {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.masterGain = null;
        this.delayNode = null;
        this.notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        this.initialized = false;
        this.droneOsc = null;
        this.droneLfo = null;
    }

    /**
     * Initialize AudioContext and audio graph
     * Must be called after a user gesture due to browser autoplay policies
     */
    init() {
        if (!this.ctx) {
            try {
                // Create AudioContext
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) {
                    console.warn('Web Audio API not supported in this browser');
                    return false;
                }

                this.ctx = new AudioContextClass();

                // Create audio graph
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.value = 0.4;

                // Create delay effect for echo
                this.delayNode = this.ctx.createDelay();
                this.delayNode.delayTime.value = 0.3;
                const feedback = this.ctx.createGain();
                feedback.gain.value = 0.4;
                this.delayNode.connect(feedback);
                feedback.connect(this.delayNode);
                this.delayNode.connect(this.masterGain);
                this.masterGain.connect(this.ctx.destination);

                this.startDrone();
                this.initialized = true;
                return true;
            } catch (e) {
                console.error('Failed to initialize audio:', e);
                return false;
            }
        } else if (this.ctx.state === 'suspended') {
            // Resume if suspended (e.g., user gesture required)
            this.ctx.resume().then(() => {
                console.log('Audio context resumed');
            }).catch(err => {
                console.error('Failed to resume audio context:', err);
            });
        }
        return true;
    }

    /**
     * Check if audio is ready to play
     * @returns {boolean}
     */
    _isAudioReady() {
        return this.ctx && this.ctx.state === 'running' && this.initialized && !this.muted;
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.4, this.ctx.currentTime, 0.1);
        }
        return this.muted;
    }

    playTone(freq, type, duration, vol = 0.5, useEcho = true) {
        if (!this._isAudioReady()) return;

        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(vol, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

            osc.connect(gain);
            gain.connect(this.masterGain);
            if (useEcho) gain.connect(this.delayNode);

            osc.start(t);
            osc.stop(t + duration);
        } catch (e) {
            console.error('Error playing tone:', e);
        }
    }

    playCollect(index) {
        this.playTone(this.notes[index % this.notes.length] * (1 + Math.floor(index / 6)), 'sine', 0.5, 0.3, true);
        this.playTone(this.notes[index % this.notes.length] * 2, 'triangle', 0.2, 0.1, true);
    }

    playHit() {
        this.playTone(100, 'sawtooth', 0.5, 0.8, false);
    }

    playCharge() {
        this.playTone(50, 'square', 0.5, 0.05, false);
    }

    playRoar() {
        this.playTone(80, 'sawtooth', 0.8, 0.2, true);
    }

    playWin() {
        if (!this._isAudioReady()) return;
        this.notes.forEach((f, i) => setTimeout(() => this.playTone(f * 2, 'sine', 0.8, 0.4), i * 100));
    }

    startDrone() {
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(50, this.ctx.currentTime);

            const lfo = this.ctx.createOscillator();
            lfo.frequency.value = 0.1;
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 10;

            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            gain.gain.value = 0.15;
            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start();
            lfo.start();

            // Keep references for cleanup if needed
            this.droneOsc = osc;
            this.droneLfo = lfo;
        } catch (e) {
            console.error('Error starting drone:', e);
        }
    }
}
