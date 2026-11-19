/**
 * Decision & Consequence Engine
 * Evaluates branch points, checks prerequisites (clues, resource thresholds),
 * records decision flags, and shapes subsequent story beats and narrative conclusions.
 */

export class DecisionSystem {
  constructor(storyBeats = []) {
    this.storyBeats = storyBeats;
    this.currentBeatIndex = 0;
    this.decisionHistory = [];
    this.activeFlags = new Set();
  }

  getCurrentBeat() {
    if (this.currentBeatIndex < this.storyBeats.length) {
      return this.storyBeats[this.currentBeatIndex];
    }
    return null;
  }

  hasFlag(flag) {
    return this.activeFlags.has(flag);
  }

  setFlag(flag) {
    this.activeFlags.add(flag);
  }

  isOptionAvailable(option, clueSystem, resourceSystem) {
    // 1. Clue check
    if (option.requiredClues && option.requiredClues.length > 0) {
      if (!clueSystem.hasFoundRequirements(option.requiredClues)) {
        return { available: false, reason: 'Missing crucial investigative evidence' };
      }
    }

    // 2. Resource check
    if (option.resourceRequirements) {
      const snap = resourceSystem.getSnapshot();
      for (const [resKey, minVal] of Object.entries(option.resourceRequirements)) {
        if (snap[resKey] !== undefined && snap[resKey] < minVal) {
          return { available: false, reason: `Requires at least ${minVal} ${resKey}` };
        }
      }
    }

    // 3. Narrative flag check
    if (option.requiredFlags) {
      for (const reqFlag of option.requiredFlags) {
        if (!this.hasFlag(reqFlag)) {
          return { available: false, reason: 'Previous decision pathway locked' };
        }
      }
    }

    return { available: true };
  }

  chooseOption(optionIndex, clueSystem, resourceSystem) {
    const currentBeat = this.getCurrentBeat();
    if (!currentBeat) return null;

    const option = currentBeat.options[optionIndex];
    if (!option) return null;

    // Apply immediate resource effects
    if (option.resourceEffects) {
      resourceSystem.modify(option.resourceEffects);
    }

    // Set narrative flags
    if (option.flags) {
      option.flags.forEach(f => this.activeFlags.add(f));
    }

    // Record in history
    const record = {
      beatId: currentBeat.id,
      beatTitle: currentBeat.title,
      selectedOptionIndex: optionIndex,
      optionText: option.text,
      consequenceSummary: option.consequenceSummary || '',
      resourceEffects: option.resourceEffects || {}
    };
    this.decisionHistory.push(record);

    // Advance to next beat
    this.currentBeatIndex++;

    return {
      record,
      nextBeat: this.getCurrentBeat(),
      isComplete: this.currentBeatIndex >= this.storyBeats.length
    };
  }

  determineEnding(endingsList, resourceSystem) {
    const snap = resourceSystem.getSnapshot();
    const flags = Array.from(this.activeFlags);

    // Evaluate endings in priority order
    for (const ending of endingsList) {
      let matches = true;

      // Required flags
      if (ending.requiredFlags && ending.requiredFlags.length > 0) {
        if (!ending.requiredFlags.every(f => flags.includes(f))) {
          matches = false;
        }
      }

      // Min/Max resource boundaries
      if (matches && ending.minResources) {
        for (const [k, val] of Object.entries(ending.minResources)) {
          if (snap[k] < val) matches = false;
        }
      }
      if (matches && ending.maxResources) {
        for (const [k, val] of Object.entries(ending.maxResources)) {
          if (snap[k] > val) matches = false;
        }
      }

      if (matches) {
        return ending;
      }
    }

    // Default fallback ending (usually the middle or balanced outcome)
    return endingsList[endingsList.length - 1];
  }
}
