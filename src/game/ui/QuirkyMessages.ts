import { QUIRKY_MSGS, QUIRKY_CONFIG } from '../core/constants';
import { VoiceManager } from '../systems/VoiceManager';

/**
 * Quirky Messages - Toast notification system
 */

let _qmMsgTimer: any = null;
let _qmLastMsgTime = 0;
let _qmCategoryTimes: Map<string, number> = new Map();

export function showQuirky(category: keyof typeof QUIRKY_MSGS) {
    const now = Date.now();
    
    // Per-category cooldown to prevent spam of specific message types
    const lastCategoryTime = _qmCategoryTimes.get(category) || 0;
    const categoryCooldown = category === 'NEAR_DRAGON' ? 8000 : QUIRKY_CONFIG.COOLDOWN;
    
    if (category !== 'HIT' && now - lastCategoryTime < categoryCooldown) return;
    
    // Also check global cooldown (except for hits which are urgent)
    if (category !== 'HIT' && now - _qmLastMsgTime < QUIRKY_CONFIG.COOLDOWN) return;

    const msgs = QUIRKY_MSGS[category];
    const text = msgs[Math.floor(Math.random() * msgs.length)];

    const el = document.getElementById('quirky-msg');
    if (!el) return;

    // SECURITY: Using .innerText instead of .innerHTML to prevent XSS
    // If extending this system to accept user input, add sanitization!
    el.innerText = text;
    el.classList.add('visible');

    // Color coding
    if (category === 'HIT' || category === 'NEAR_DRAGON') {
        el.style.color = QUIRKY_CONFIG.COLORS.HIT;
    } else if (category === 'COLLECT') {
        el.style.color = QUIRKY_CONFIG.COLORS.COLLECT;
    } else {
        el.style.color = QUIRKY_CONFIG.COLORS.DEFAULT;
    }

    _qmCategoryTimes.set(category, now);
    // Voice support with cooldown
    try {
        VoiceManager.getInstance().speak(text, QUIRKY_CONFIG.VOICE_COOLDOWN);
    } catch (e) {
        console.warn('Voice synthesis failed:', e);
    }

    _qmLastMsgTime = now;

    if (_qmMsgTimer) clearTimeout(_qmMsgTimer);
    _qmMsgTimer = setTimeout(() => {
        el.classList.remove('visible');
    }, QUIRKY_CONFIG.DISPLAY_DURATION);
}
