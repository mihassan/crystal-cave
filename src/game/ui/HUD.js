/**
 * HUD - Heads-up display updates
 */
import { formatTime } from '../utils/helpers.js';

export function updateHUD(lives, score, level, elapsedTime) {
    document.getElementById('lives-display').innerText = lives;
    document.getElementById('crystal-display').innerText = score;
    document.getElementById('level-display').innerText = level;
    document.getElementById('time-display').innerText = formatTime(elapsedTime);
}

export function showHUD() {
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('hint').classList.remove('hidden');
}

export function hideHUD() {
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('hint').classList.add('hidden');
}

export function hideHint() {
    document.getElementById('hint').classList.add('hidden');
}
