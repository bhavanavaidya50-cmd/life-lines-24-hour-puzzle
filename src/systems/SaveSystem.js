/**
 * Save System - LocalStorage abstraction with persistence, schema migration and validation
 */

const STORAGE_KEY = 'LIFELINES_24H_SAVE_DATA_V1';

export class SaveSystem {
  static getDefaultData() {
    return {
      version: 1,
      player: {
        name: 'Analyst',
        title: 'Observer',
        createdAt: Date.now(),
        lastActive: Date.now()
      },
      settings: {
        volume: 0.7,
        soundEnabled: true,
        textSpeed: 'medium', // fast, medium, slow
        highContrast: false
      },
      progress: {
        currentScenarioId: 1,
        unlockedScenarios: [1], // Scenario 1 always unlocked
        completedScenarios: [],
        scenarioStars: {},      // { 1: 3, 2: 2 }
        scenarioHighScores: {}, // { 1: 940 }
        scenarioEndings: {}     // { 1: ['ending_balanced', 'ending_family_first'] }
      },
      achievements: [] // Array of achievement IDs earned
    };
  }

  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const defaultData = this.getDefaultData();
        this.save(defaultData);
        return defaultData;
      }
      const data = JSON.parse(raw);
      // Ensure any newly added fields exist
      const defaultData = this.getDefaultData();
      return {
        ...defaultData,
        ...data,
        settings: { ...defaultData.settings, ...(data.settings || {}) },
        progress: { ...defaultData.progress, ...(data.progress || {}) }
      };
    } catch (e) {
      console.error('Error loading save data from LocalStorage:', e);
      return this.getDefaultData();
    }
  }

  static save(data) {
    try {
      data.player.lastActive = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Error saving data to LocalStorage:', e);
      return false;
    }
  }

  static isScenarioUnlocked(scenarioId) {
    const data = this.load();
    return data.progress.unlockedScenarios.includes(Number(scenarioId));
  }

  static unlockScenario(scenarioId) {
    const data = this.load();
    const id = Number(scenarioId);
    if (!data.progress.unlockedScenarios.includes(id)) {
      data.progress.unlockedScenarios.push(id);
      this.save(data);
    }
  }

  static recordScenarioCompletion(scenarioId, endingId, score, stars) {
    const data = this.load();
    const id = Number(scenarioId);
    if (!data.progress.completedScenarios.includes(id)) {
      data.progress.completedScenarios.push(id);
    }
    // High score
    if (!data.progress.scenarioHighScores[id] || score > data.progress.scenarioHighScores[id]) {
      data.progress.scenarioHighScores[id] = score;
    }
    // Stars
    if (!data.progress.scenarioStars[id] || stars > data.progress.scenarioStars[id]) {
      data.progress.scenarioStars[id] = stars;
    }
    // Discovered endings
    if (!data.progress.scenarioEndings[id]) {
      data.progress.scenarioEndings[id] = [];
    }
    if (!data.progress.scenarioEndings[id].includes(endingId)) {
      data.progress.scenarioEndings[id].push(endingId);
    }

    // Auto unlock next scenario
    const nextScenario = id + 1;
    if (nextScenario <= 5 && !data.progress.unlockedScenarios.includes(nextScenario)) {
      data.progress.unlockedScenarios.push(nextScenario);
    }

    this.save(data);
    return data;
  }

  static unlockAchievement(achievementId) {
    const data = this.load();
    if (!data.achievements.includes(achievementId)) {
      data.achievements.push(achievementId);
      this.save(data);
      return true; // Newly unlocked
    }
    return false;
  }

  static resetProgress() {
    const fresh = this.getDefaultData();
    this.save(fresh);
    return fresh;
  }
}
