/**
 * Quirky Messages - Toast notification system
 */
import { QUIRKY_MSGS, QUIRKY_CONFIG } from '../core/constants.js';

// Using _qm prefix to avoid conflicts when bundled
let _qmMsgTimer = null;
let _qmLastMsgTime = 0;

export function showQuirky(category) {
    const now = Date.now();
    // Anti-spam cooldown (except for hits which are urgent)
    if (category !== 'HIT' && now - _qmLastMsgTime < QUIRKY_CONFIG.COOLDOWN) return;

    const msgs = QUIRKY_MSGS[category];
    const text = msgs[Math.floor(Math.random() * msgs.length)];

    const el = document.getElementById('quirky-msg');
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

    _qmLastMsgTime = now;

    if (_qmMsgTimer) clearTimeout(_qmMsgTimer);
    _qmMsgTimer = setTimeout(() => {
        el.classList.remove('visible');
    }, QUIRKY_CONFIG.DISPLAY_DURATION);
}
