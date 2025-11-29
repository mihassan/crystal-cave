/**
 * Utility helper functions
 */

/**
 * Format milliseconds as MM:SS time string
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(ms) {
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    s %= 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Hide all overlays and HUD elements
 */
export function hideAllScreens() {
    document.querySelectorAll('.overlay').forEach(el => el.classList.add('hidden'));
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('hint').classList.add('hidden');
    // Hide quirky msg if switching screens
    document.getElementById('quirky-msg').classList.remove('visible');
}
