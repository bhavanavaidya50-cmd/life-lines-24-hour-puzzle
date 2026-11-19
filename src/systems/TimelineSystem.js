/**
 * Timeline System
 * Manages the 24-hour day schedule (6:00 to 24:00, or flexible 24h cycle).
 * Features:
 * - Arranges task cards with durations and deadlines
 * - Dependency validation (e.g. Must pick up prescription before administering medicine)
 * - Conflict detection (overlaps)
 * - Clear diagnostics and suggestions for scheduling errors
 */

export class TimelineSystem {
  constructor(startHour = 6, endHour = 24) {
    this.startHour = startHour; // 6 AM
    this.endHour = endHour;     // 12 Midnight (18 hours visible workspace)
    this.scheduledTasks = [];   // Array of { task, startHour, endHour }
  }

  setScheduled(list) {
    this.scheduledTasks = list;
  }

  getScheduled() {
    return [...this.scheduledTasks];
  }

  scheduleTask(task, startHour) {
    const duration = task.durationHours || 1;
    const endHour = startHour + duration;

    // Check boundary
    if (startHour < this.startHour || endHour > this.endHour) {
      return { success: false, reason: `Task extends outside the active 24-hour window (${this.startHour}:00 - ${this.endHour}:00).` };
    }

    // Check deadline
    if (task.deadlineHour && endHour > task.deadlineHour) {
      return { 
        success: false, 
        reason: `Missed Deadline! "${task.title}" must be completed by ${task.deadlineHour}:00, but finishes at ${endHour}:00.` 
      };
    }

    // Check earliest start
    if (task.earliestStartHour && startHour < task.earliestStartHour) {
      return {
        success: false,
        reason: `Cannot start "${task.title}" before ${task.earliestStartHour}:00.`
      };
    }

    // Check dependencies
    if (task.dependencies && task.dependencies.length > 0) {
      for (const depId of task.dependencies) {
        const depTask = this.scheduledTasks.find(st => st.task.id === depId);
        if (!depTask) {
          return {
            success: false,
            reason: `Prerequisite Missing: Must schedule required prior step before "${task.title}".`
          };
        }
        if (depTask.endHour > startHour) {
          return {
            success: false,
            reason: `Dependency Conflict: "${task.title}" requires "${depTask.task.title}" to be completed first (ends at ${depTask.endHour}:00).`
          };
        }
      }
    }

    // Remove if already scheduled elsewhere
    this.unscheduleTask(task.id);

    // Check overlaps
    const overlaps = this.scheduledTasks.filter(st => {
      return (startHour < st.endHour && endHour > st.startHour);
    });

    if (overlaps.length > 0) {
      const conflictNames = overlaps.map(o => `"${o.task.title}" (${o.startHour}:00-${o.endHour}:00)`).join(', ');
      return {
        success: false,
        hasOverlap: true,
        conflicts: overlaps,
        reason: `Schedule Collision: Overlaps with ${conflictNames}.`
      };
    }

    this.scheduledTasks.push({ task, startHour, endHour });
    this.sortSchedule();
    return { success: true };
  }

  unscheduleTask(taskId) {
    const idx = this.scheduledTasks.findIndex(st => st.task.id === taskId);
    if (idx !== -1) {
      const removed = this.scheduledTasks.splice(idx, 1)[0];
      return removed;
    }
    return null;
  }

  sortSchedule() {
    this.scheduledTasks.sort((a, b) => a.startHour - b.startHour);
  }

  validateFullSchedule(allMandatoryTasks = []) {
    const issues = [];
    const scheduledIds = this.scheduledTasks.map(st => st.task.id);

    // 1. Mandatory task checks
    for (const mTask of allMandatoryTasks) {
      if (!scheduledIds.includes(mTask.id)) {
        issues.push({
          type: 'missing_mandatory',
          taskId: mTask.id,
          message: `Mandatory commitment omitted: "${mTask.title}".`
        });
      }
    }

    // 2. Overlap checks
    for (let i = 0; i < this.scheduledTasks.length; i++) {
      for (let j = i + 1; j < this.scheduledTasks.length; j++) {
        const a = this.scheduledTasks[i];
        const b = this.scheduledTasks[j];
        if (a.startHour < b.endHour && a.endHour > b.startHour) {
          issues.push({
            type: 'overlap',
            tasks: [a.task.id, b.task.id],
            message: `Time conflict between "${a.task.title}" and "${b.task.title}".`
          });
        }
      }
    }

    // 3. Deadline compliance
    for (const st of this.scheduledTasks) {
      if (st.task.deadlineHour && st.endHour > st.task.deadlineHour) {
        issues.push({
          type: 'deadline_missed',
          taskId: st.task.id,
          message: `"${st.task.title}" ends at ${st.endHour}:00, missing deadline of ${st.task.deadlineHour}:00.`
        });
      }
    }

    // 4. Dependencies
    for (const st of this.scheduledTasks) {
      if (st.task.dependencies) {
        for (const depId of st.task.dependencies) {
          const dep = this.scheduledTasks.find(other => other.task.id === depId);
          if (!dep) {
            issues.push({
              type: 'dependency_unmet',
              taskId: st.task.id,
              message: `"${st.task.title}" requires prerequisite task #${depId} to be scheduled.`
            });
          } else if (dep.endHour > st.startHour) {
            issues.push({
              type: 'dependency_order',
              taskId: st.task.id,
              message: `"${st.task.title}" starts before prerequisite "${dep.task.title}" finishes.`
            });
          }
        }
      }
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  calculateTotalResourceCosts() {
    let energyCost = 0;
    let moneyCost = 0;
    let stressCost = 0;
    for (const st of this.scheduledTasks) {
      energyCost += st.task.energyCost || 0;
      moneyCost += st.task.moneyCost || 0;
      stressCost += st.task.stressCost || 0;
    }
    return { energyCost, moneyCost, stressCost };
  }
}
