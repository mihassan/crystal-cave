/**
 * ScreenManager - UI screen transitions and game flow
 */
import { hideAllScreens, formatTime } from '../utils/helpers.js';
import { showQuirky } from './QuirkyMessages.js';

// These will be set via setDependencies - using _sm prefix to avoid conflicts when bundled
let _smGameData, _smAudio;
let _screenGameState;

export function setDependencies(deps) {
    _smGameData = deps.gameData;
    _smAudio = deps.audio;
}

export function setGameState(state) {
    _screenGameState = state;
}

export function showHome() {
    if (_screenGameState) _screenGameState.value = 'HOME';
    hideAllScreens();
    document.getElementById('home-screen').classList.remove('hidden');
}

export function showAbout() {
    if (_screenGameState) _screenGameState.value = 'ABOUT';
    hideAllScreens();
    document.getElementById('about-screen').classList.remove('hidden');
}

export function showStats() {
    if (_screenGameState) _screenGameState.value = 'STATS';
    hideAllScreens();

    document.getElementById('stat-max-level').innerText = _smGameData.data.maxLevel;
    document.getElementById('stat-total-shards').innerText = _smGameData.data.totalShards;

    const list = document.getElementById('stats-list');
    list.innerHTML = '';

    const sortedLevels = Object.keys(_smGameData.data.bestTimes).sort((a, b) => a - b);

    if (sortedLevels.length === 0) {
        list.innerHTML = '<div style="padding:10px; color:#888;">No records yet.</div>';
    } else {
        sortedLevels.forEach(lvl => {
            const row = document.createElement('div');
            row.className = 'list-row';
            row.innerHTML = `<span>Sector ${lvl}</span><span style="color:#ffd700">${formatTime(_smGameData.data.bestTimes[lvl])}</span>`;
            list.appendChild(row);
        });
    }

    document.getElementById('stats-screen').classList.remove('hidden');
}

export function showPause() {
    if (_screenGameState) _screenGameState.value = 'PAUSED';
    document.getElementById('pause-screen').classList.remove('hidden');
}

export function hidePause() {
    if (_screenGameState) _screenGameState.value = 'PLAYING';
    document.getElementById('pause-screen').classList.add('hidden');
}

export function showLevelComplete(duration, level) {
    if (_screenGameState) _screenGameState.value = 'TRANSITION';
    _smAudio.playWin();

    const isRecord = _smGameData.saveTime(level, duration);
    _smGameData.updateLevel(level);

    document.getElementById('level-time-val').innerText = formatTime(duration);
    document.getElementById('level-best-val').innerText = formatTime(_smGameData.getBestTime(level));

    const recordMsg = document.getElementById('new-record-msg');
    if (isRecord) {
        recordMsg.classList.remove('hidden');
    } else {
        recordMsg.classList.add('hidden');
    }

    hideAllScreens();
    document.getElementById('level-screen').classList.remove('hidden');
}

export function showGameOver(level, score) {
    if (_screenGameState) _screenGameState.value = 'GAMEOVER';
    _smGameData.updateLevel(level);

    hideAllScreens();
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-level').innerText = level;
    document.getElementById('final-score').innerText = score;
}
