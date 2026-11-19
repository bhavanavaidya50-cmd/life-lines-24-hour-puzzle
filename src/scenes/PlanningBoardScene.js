import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { getScenarioById } from '../data/scenarios.js';
import { TimelineSystem } from '../systems/TimelineSystem.js';
import { audioManager } from '../audio/AudioManager.js';

export class PlanningBoardScene extends Phaser.Scene {
  constructor() {
    super('PlanningBoardScene');
  }

  init(data) {
    this.scenarioId = data.scenarioId || 1;
    this.scenario = getScenarioById(this.scenarioId);
    this.clueSystem = data.clueSystem;
    this.resourceSystem = data.resourceSystem;
    this.timelineSystem = new TimelineSystem(6, 24); // 6:00 to 24:00 (18 hours)
    this.availableTasks = [...this.scenario.tasks];
    this.selectedTask = null;
  }

  create() {
    audioManager.playAmbient('investigation');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x060911, 0x060911, 0x0c1322, 0x0c1322, 1);
    bg.fillRect(0, 0, width, height);

    // Top HUD
    UIComponents.createResourceHUD(this, this.resourceSystem);

    // Section Title
    this.add.text(50, 75, `24-HOUR STRATEGIC TIMELINE // CHRONOLOGICAL SCHEDULER`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      letterSpacing: 2,
      color: '#c9a84c'
    });

    this.statusFeedback = this.add.text(50, 95, 'Click an unscheduled task below, then click an open time slot on the 24-hour timeline.', {
      fontFamily: THEME.fonts.sans,
      fontSize: '13px',
      color: '#94a3b8'
    });

    // 1. Timeline Grid Setup (18 slots: 6 AM to 23 PM)
    this.gridStartX = 60;
    this.gridY = 160;
    this.slotWidth = 60;
    this.gridHeight = 90;
    this.renderTimelineGrid();

    // 2. Unscheduled Task Deck Panel (Bottom Tray)
    this.trayY = 320;
    UIComponents.createPanel(this, width / 2, 440, width - 100, 240, {
      fillColor: 0x0f172a,
      strokeColor: THEME.colors.border
    });

    this.add.text(70, 335, 'AVAILABLE COMMITMENTS & RESPONSIBILITIES', {
      fontFamily: THEME.fonts.mono,
      fontSize: '11px',
      fontWeight: '700',
      color: '#38bdf8'
    });

    this.renderTaskTray();

    // Action Controls
    UIComponents.createButton(this, 120, height - 35, 140, 36, '← EVIDENCE', {
      onClick: () => {
        this.scene.start('InvestigationScene', {
          scenarioId: this.scenario.id,
          clueSystem: this.clueSystem,
          resourceSystem: this.resourceSystem
        });
      }
    });

    UIComponents.createButton(this, 300, height - 35, 160, 36, 'AUTO-OPTIMIZE', {
      onClick: () => {
        this.autoOptimizeSchedule();
      }
    });

    UIComponents.createButton(this, 480, height - 35, 140, 36, 'CLEAR ALL', {
      danger: true,
      onClick: () => {
        this.timelineSystem.setScheduled([]);
        this.availableTasks = [...this.scenario.tasks];
        this.selectedTask = null;
        this.renderTimelineGrid();
        this.renderTaskTray();
        audioManager.playClick();
      }
    });

    // VALIDATE & COMMIT SCHEDULE BUTTON
    UIComponents.createButton(this, width - 180, height - 35, 260, 42, 'CONFIRM SCHEDULE & PROCEED →', {
      gold: true,
      onClick: () => {
        this.validateAndProceed();
      }
    });

    this.cameras.main.fadeIn(300);
  }

  renderTimelineGrid() {
    if (this.gridGraphics) this.gridGraphics.destroy();
    if (this.gridElements) this.gridElements.forEach(e => e.destroy());
    this.gridElements = [];

    this.gridGraphics = this.add.graphics();
    const g = this.gridGraphics;

    // Draw hour columns from 6:00 to 23:00 (18 hours)
    for (let h = 6; h < 24; h++) {
      const x = this.gridStartX + (h - 6) * this.slotWidth;

      // Column background
      g.fillStyle(0x131d2e, 0.7);
      g.fillRect(x, this.gridY, this.slotWidth - 2, this.gridHeight);
      g.lineStyle(1, 0x1e293b, 1);
      g.strokeRect(x, this.gridY, this.slotWidth - 2, this.gridHeight);

      // Hour Header
      const hourLabel = this.add.text(x + this.slotWidth / 2 - 1, this.gridY - 18, `${h}:00`, {
        fontFamily: THEME.fonts.mono,
        fontSize: '10px',
        color: '#64748b'
      }).setOrigin(0.5);
      this.gridElements.push(hourLabel);

      // Interactive Click Target on Time Slot
      const slotZone = this.add.zone(x + this.slotWidth / 2, this.gridY + this.gridHeight / 2, this.slotWidth, this.gridHeight);
      slotZone.setInteractive({ useHandCursor: true });
      slotZone.on('pointerdown', () => {
        if (this.selectedTask) {
          const res = this.timelineSystem.scheduleTask(this.selectedTask, h);
          if (res.success) {
            audioManager.playCardSnap();
            // remove from available
            this.availableTasks = this.availableTasks.filter(t => t.id !== this.selectedTask.id);
            this.selectedTask = null;
            this.statusFeedback.setText('Task scheduled successfully. Continue arranging remaining cards.');
            this.renderTimelineGrid();
            this.renderTaskTray();
          } else {
            audioManager.playError();
            this.statusFeedback.setText(`⚠️ ${res.reason}`);
          }
        }
      });
      this.gridElements.push(slotZone);
    }

    // Render Scheduled Task Blocks
    const scheduled = this.timelineSystem.getScheduled();
    scheduled.forEach(st => {
      const taskStartX = this.gridStartX + (st.startHour - 6) * this.slotWidth;
      const taskW = (st.endHour - st.startHour) * this.slotWidth - 3;

      const taskContainer = this.add.container(taskStartX + taskW / 2, this.gridY + this.gridHeight / 2);
      const bg = this.add.graphics();
      bg.fillStyle(0x0284c7, 0.95);
      bg.fillRoundedRect(-taskW / 2, -this.gridHeight / 2 + 4, taskW, this.gridHeight - 8, 6);
      bg.lineStyle(1.5, THEME.colors.goldLight, 1);
      bg.strokeRoundedRect(-taskW / 2, -this.gridHeight / 2 + 4, taskW, this.gridHeight - 8, 6);
      taskContainer.add(bg);

      const title = this.add.text(0, -10, st.task.title, {
        fontFamily: THEME.fonts.sans,
        fontSize: '11px',
        fontWeight: '700',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: taskW - 8 }
      }).setOrigin(0.5);
      taskContainer.add(title);

      const timeText = this.add.text(0, 15, `${st.startHour}:00 - ${st.endHour}:00 (Click to Remove)`, {
        fontFamily: THEME.fonts.mono,
        fontSize: '9px',
        color: '#e0f2fe'
      }).setOrigin(0.5);
      taskContainer.add(timeText);

      taskContainer.setSize(taskW, this.gridHeight - 8);
      taskContainer.setInteractive({ useHandCursor: true });
      taskContainer.on('pointerdown', () => {
        // Unschedule
        this.timelineSystem.unscheduleTask(st.task.id);
        this.availableTasks.push(st.task);
        audioManager.playCardSnap();
        this.renderTimelineGrid();
        this.renderTaskTray();
      });

      this.gridElements.push(taskContainer);
    });
  }

  renderTaskTray() {
    if (this.trayElements) this.trayElements.forEach(e => e.destroy());
    this.trayElements = [];

    const startX = 75;
    const startY = 365;
    const cardW = 215;
    const cardH = 95;
    const cols = 5;

    this.availableTasks.forEach((task, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardX = startX + col * (cardW + 15) + cardW / 2;
      const cardY = startY + row * (cardH + 15);

      const isSelected = this.selectedTask && this.selectedTask.id === task.id;

      const container = this.add.container(cardX, cardY);
      const bg = this.add.graphics();

      const drawCard = (hover = false) => {
        bg.clear();
        let fill = isSelected ? 0x1e3a5f : (hover ? 0x1e293b : 0x111827);
        let stroke = isSelected ? THEME.colors.gold : (hover ? THEME.colors.steel : THEME.colors.borderLight);
        bg.fillStyle(fill, 0.95);
        bg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 6);
        bg.lineStyle(1.5, stroke, 1);
        bg.strokeRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 6);
      };
      drawCard(false);
      container.add(bg);

      // Title
      const title = this.add.text(-cardW / 2 + 10, -cardH / 2 + 10, task.title, {
        fontFamily: THEME.fonts.sans,
        fontSize: '11px',
        fontWeight: '700',
        color: '#f8fafc',
        wordWrap: { width: cardW - 20 }
      });
      container.add(title);

      // Meta
      const meta = this.add.text(-cardW / 2 + 10, cardH / 2 - 25, `Duration: ${task.durationHours}h | Deadline: ${task.deadlineHour}:00`, {
        fontFamily: THEME.fonts.mono,
        fontSize: '9px',
        color: '#c9a84c'
      });
      container.add(meta);

      container.setSize(cardW, cardH);
      container.setInteractive({ useHandCursor: true });

      container.on('pointerover', () => drawCard(true));
      container.on('pointerout', () => drawCard(false));
      container.on('pointerdown', () => {
        audioManager.playClick();
        this.selectedTask = task;
        this.statusFeedback.setText(`Selected "${task.title}". Click a timeline hour from ${task.earliestStartHour || 6}:00 onwards.`);
        this.renderTaskTray();
      });

      this.trayElements.push(container);
    });
  }

  autoOptimizeSchedule() {
    this.timelineSystem.setScheduled([]);
    this.availableTasks = [...this.scenario.tasks];

    // Simple greedy scheduler respecting deadlines and dependencies
    const toSchedule = [...this.scenario.tasks].sort((a, b) => (a.deadlineHour || 24) - (b.deadlineHour || 24));
    
    for (const task of toSchedule) {
      let earliest = task.earliestStartHour || 6;
      for (let h = earliest; h < 24; h++) {
        const res = this.timelineSystem.scheduleTask(task, h);
        if (res.success) {
          this.availableTasks = this.availableTasks.filter(t => t.id !== task.id);
          break;
        }
      }
    }

    audioManager.playSuccess();
    this.statusFeedback.setText('Applied optimal algorithmic schedule. You may fine-tune slots or proceed.');
    this.renderTimelineGrid();
    this.renderTaskTray();
  }

  validateAndProceed() {
    const val = this.timelineSystem.validateFullSchedule(this.scenario.mandatoryTasks || []);
    if (!val.isValid) {
      audioManager.playError();
      const firstErr = val.issues[0].message;
      this.statusFeedback.setText(`⚠️ Schedule Conflict: ${firstErr}`);
      return;
    }

    // Deduct resource costs
    const costs = this.timelineSystem.calculateTotalResourceCosts();
    this.resourceSystem.modify({
      energy: -costs.energyCost,
      money: -costs.moneyCost,
      stress: costs.stressCost
    });

    audioManager.playDecisionImpact();
    this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('DecisionScene', {
        scenarioId: this.scenario.id,
        clueSystem: this.clueSystem,
        resourceSystem: this.resourceSystem,
        timelineSystem: this.timelineSystem
      });
    });
  }
}
