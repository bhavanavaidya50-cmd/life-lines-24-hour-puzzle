/**
 * Clue and Investigation System
 * Handles inspecting documents, financial ledgers, encrypted notes, and text messages.
 * Allows unlocking deduction insights and cross-referencing clues to open new pathways.
 */

export class ClueSystem {
  constructor(cluesList = []) {
    this.allClues = cluesList.map(c => ({
      ...c,
      isDiscovered: c.isDiscovered || false,
      isInspected: false
    }));
    this.selectedClueId = null;
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (e) { console.error('Clue listener err:', e); }
    });
  }

  discoverClue(clueId) {
    const clue = this.allClues.find(c => c.id === clueId);
    if (clue && !clue.isDiscovered) {
      clue.isDiscovered = true;
      this.notify();
      return { success: true, clue };
    }
    return { success: false };
  }

  inspectClue(clueId) {
    const clue = this.allClues.find(c => c.id === clueId);
    if (clue && clue.isDiscovered) {
      clue.isInspected = true;
      this.selectedClueId = clueId;
      this.notify();
      return clue;
    }
    return null;
  }

  getDiscoveredClues() {
    return this.allClues.filter(c => c.isDiscovered);
  }

  getAllClues() {
    return this.allClues;
  }

  getDiscoveryProgress() {
    const discovered = this.getDiscoveredClues().length;
    const total = this.allClues.length;
    return {
      discovered,
      total,
      percentage: total > 0 ? Math.round((discovered / total) * 100) : 100
    };
  }

  // Check if player has found all clues needed to reveal a hidden option
  hasFoundRequirements(requiredClueIds = []) {
    if (!requiredClueIds || requiredClueIds.length === 0) return true;
    const discoveredIds = this.getDiscoveredClues().map(c => c.id);
    return requiredClueIds.every(reqId => discoveredIds.includes(reqId));
  }
}
