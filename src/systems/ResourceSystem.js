/**
 * Resource Management System
 * Tracks: Time (minutes), Energy (0-100), Money ($), Stress (0-100), Relationships (map of person -> 0-100)
 */

export class ResourceSystem {
  constructor(initialConfig = {}) {
    this.timeMinutes = initialConfig.timeMinutes ?? 1440; // 24 hours = 1440 min
    this.energy = initialConfig.energy ?? 100;
    this.money = initialConfig.money ?? 500;
    this.stress = initialConfig.stress ?? 15;
    this.relationships = initialConfig.relationships ? { ...initialConfig.relationships } : {};
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach(cb => {
      try { cb(snapshot); } catch (e) { console.error('Resource listener error:', e); }
    });
  }

  getSnapshot() {
    return {
      timeMinutes: this.timeMinutes,
      energy: Math.round(this.energy),
      money: Math.round(this.money),
      stress: Math.round(this.stress),
      relationships: { ...this.relationships }
    };
  }

  modify(changes = {}) {
    if (changes.timeMinutes !== undefined) {
      this.timeMinutes = Math.max(0, this.timeMinutes + changes.timeMinutes);
    }
    if (changes.energy !== undefined) {
      this.energy = Math.max(0, Math.min(100, this.energy + changes.energy));
    }
    if (changes.money !== undefined) {
      this.money = this.money + changes.money; // can be negative for debt situations
    }
    if (changes.stress !== undefined) {
      this.stress = Math.max(0, Math.min(100, this.stress + changes.stress));
    }
    if (changes.relationships) {
      for (const [person, delta] of Object.entries(changes.relationships)) {
        const cur = this.relationships[person] ?? 50;
        this.relationships[person] = Math.max(0, Math.min(100, cur + delta));
      }
    }
    this.notify();
    return this.getSnapshot();
  }

  canAfford(costs = {}) {
    if (costs.energy && this.energy < costs.energy) return { can: false, reason: 'Insufficient energy' };
    if (costs.money && this.money < costs.money) return { can: false, reason: 'Insufficient funds' };
    if (costs.stress && (this.stress + costs.stress > 100)) return { can: false, reason: 'Stress would cause breakdown' };
    return { can: true };
  }

  getAverageRelationship() {
    const vals = Object.values(this.relationships);
    if (vals.length === 0) return 50;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
}
