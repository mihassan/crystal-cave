/**
 * DataManager - localStorage persistence system
 */
export class DataManager {
    data: { maxLevel: number; totalShards: number; totalKills: number; bestTimes: { [key: number]: number } };
    persistenceAvailable: boolean;
    storageKey: string;
    _quotaWarningShown: boolean;

    constructor() {
        this.data = { maxLevel: 1, totalShards: 0, totalKills: 0, bestTimes: {} };
        this.persistenceAvailable = true;
        this.storageKey = 'crystal_cave_data';
        this._quotaWarningShown = false;
        this.load();
    }

    /**
     * Check if localStorage is available and working
     * @returns {boolean} True if localStorage is available
     */
    _isStorageAvailable(): boolean {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e: any) {
            console.warn('localStorage is not available:', e.message);
            return false;
        }
    }

    /**
     * Load saved game data from localStorage
     */
    load() {
        if (!this._isStorageAvailable()) {
            this.persistenceAvailable = false;
            console.warn('Game progress will not be saved (localStorage unavailable)');
            return;
        }

        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Validate data structure
                if (parsed && typeof parsed === 'object') {
                    this.data = {
                        maxLevel: parsed.maxLevel || 1,
                        totalShards: parsed.totalShards || 0,
                        totalKills: parsed.totalKills || 0,
                        bestTimes: parsed.bestTimes || {}
                    };
                }
            }
        } catch (e: any) {
            console.error('Failed to load game data:', e.message);
            // Data is corrupted, reset to defaults
            this.data = { maxLevel: 1, totalShards: 0, totalKills: 0, bestTimes: {} };
        }
    }

    /**
     * Save game data to localStorage
     * @returns {boolean} True if save was successful
     */
    save(): boolean {
        if (!this.persistenceAvailable) {
            return false;
        }

        try {
            const serialized = JSON.stringify(this.data);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (e: any) {
            // Handle quota exceeded error
            if (e.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded. Cannot save game progress.');
                this.persistenceAvailable = false;
                // Notify user (shown once)
                if (!this._quotaWarningShown) {
                    this._quotaWarningShown = true;
                    setTimeout(() => {
                        alert('⚠️ Storage quota exceeded. Your progress cannot be saved.');
                    }, 100);
                }
            } else {
                console.error('Failed to save game data:', e.message);
            }
            return false;
        }
    }

    updateLevel(lvl: number): boolean {
        if (lvl > this.data.maxLevel) {
            this.data.maxLevel = lvl;
            return this.save();
        }
        return true;
    }

    addShards(count: number): boolean {
        this.data.totalShards += count;
        return this.save();
    }

    addKills(count: number): boolean {
        this.data.totalKills += count;
        return this.save();
    }

    saveTime(lvl: number, timeMs: number): boolean {
        if (!this.data.bestTimes[lvl] || timeMs < this.data.bestTimes[lvl]) {
            this.data.bestTimes[lvl] = timeMs;
            this.save();
            return true;
        }
        return false;
    }

    getBestTime(lvl: number): number | null {
        return this.data.bestTimes[lvl] || null;
    }
}
