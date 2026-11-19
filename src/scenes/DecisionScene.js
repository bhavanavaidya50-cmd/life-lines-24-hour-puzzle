import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { getScenarioById } from '../data/scenarios.js';
import { DecisionSystem } from '../systems/DecisionSystem.js';
import { audioManager } from '../audio/AudioManager.js';

export class DecisionScene extends Phaser.Scene {
  constructor() {
    super('DecisionScene');
  }

  init(data) {
    this.scenarioId = data.scenarioId || 1;
    this.scenario = getScenarioById(this.scenarioId);
    this.clueSystem = data.clueSystem || new ClueSystem(this.scenario.clues);
    this.resourceSystem = data.resourceSystem || new ResourceSystem(this.scenario.initialResources);
    this.timelineSystem = data.timelineSystem || new TimelineSystem(6, 24);
    this.decisionSystem = data.decisionSystem || new DecisionSystem(this.scenario.storyBeats);
  }

  create() {
    audioManager.playAmbient('tension');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Atmospheric dark background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x060910, 0x060910, 0x111625, 0x111625, 1);
    bg.fillRect(0, 0, width, height);

    // Top HUD
    UIComponents.createResourceHUD(this, this.resourceSystem);

    this.renderCurrentBeat();
    this.cameras.main.fadeIn(300);
  }

  renderCurrentBeat() {
    if (this.beatElements) this.beatElements.forEach(e => e.destroy());
    this.beatElements = [];

    const beat = this.decisionSystem.getCurrentBeat();
    const width = this.cameras.main.width;

    if (!beat) {
      // Completed all story beats -> Determine ending & go to Consequence scene
      const ending = this.decisionSystem.determineEnding(this.scenario.endings, this.resourceSystem);
      this.scene.start('ConsequenceScene', {
        scenarioId: this.scenario.id,
        clueSystem: this.clueSystem,
        resourceSystem: this.resourceSystem,
        timelineSystem: this.timelineSystem,
        decisionSystem: this.decisionSystem,
        ending
      });
      return;
    }

    // Story Beat Container
    const cardW = 1000;
    const cardH = 460;
    const cardX = width / 2;
    const cardY = 350;

    const panel = UIComponents.createPanel(this, cardX, cardY, cardW, cardH, {
      fillColor: 0x0d1524,
      strokeColor: THEME.colors.border
    });
    this.beatElements.push(panel);

    // Beat Step Progress Tracker
    const stepText = this.add.text(cardX - cardW / 2 + 40, cardY - cardH / 2 + 30, `DECISION NODE 0${this.decisionSystem.currentBeatIndex + 1} OF 0${this.scenario.storyBeats.length}`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      letterSpacing: 2,
      color: '#c9a84c'
    });
    this.beatElements.push(stepText);

    // Beat Title
    const titleText = this.add.text(cardX - cardW / 2 + 40, cardY - cardH / 2 + 55, beat.title, {
      fontFamily: THEME.fonts.serif,
      fontSize: '26px',
      color: '#f8fafc'
    });
    this.beatElements.push(titleText);

    // Narrative Description
    const narrativeText = this.add.text(cardX - cardW / 2 + 40, cardY - cardH / 2 + 95, beat.narrative, {
      fontFamily: THEME.fonts.sans,
      fontSize: '14px',
      color: '#cbd5e1',
      lineSpacing: 6,
      wordWrap: { width: cardW - 80 }
    });
    this.beatElements.push(narrativeText);

    // Render Options
    const startY = cardY - cardH / 2 + 185;
    beat.options.forEach((opt, idx) => {
      const optY = startY + idx * 80;
      const optW = cardW - 80;
      const optH = 68;

      const optContainer = this.add.container(cardX, optY);
      const optBg = this.add.graphics();

      const drawOpt = (hover = false) => {
        optBg.clear();
        const fill = hover ? 0x1c2842 : 0x111c30;
        const stroke = hover ? THEME.colors.gold : THEME.colors.borderLight;
        optBg.fillStyle(fill, 0.95);
        optBg.fillRoundedRect(-optW / 2, -optH / 2, optW, optH, 8);
        optBg.lineStyle(1.5, stroke, 1);
        optBg.strokeRoundedRect(-optW / 2, -optH / 2, optW, optH, 8);
      };
      drawOpt(false);
      optContainer.add(optBg);

      // Option Letter Tag
      const letter = ['A', 'B', 'C'][idx];
      const tag = this.add.text(-optW / 2 + 20, -10, `[ OPTION ${letter} ]`, {
        fontFamily: THEME.fonts.mono,
        fontSize: '11px',
        fontWeight: '700',
        color: '#38bdf8'
      });
      optContainer.add(tag);

      // Option Text
      const text = this.add.text(-optW / 2 + 120, -18, opt.text, {
        fontFamily: THEME.fonts.sans,
        fontSize: '12px',
        fontWeight: '500',
        color: '#f1f5f9',
        wordWrap: { width: optW - 140 }
      });
      optContainer.add(text);

      // Consequence Hint on Hover
      optContainer.setSize(optW, optH);
      optContainer.setInteractive({ useHandCursor: true });

      optContainer.on('pointerover', () => {
        drawOpt(true);
      });
      optContainer.on('pointerout', () => {
        drawOpt(false);
      });
      optContainer.on('pointerdown', () => {
        audioManager.playDecisionImpact();
        this.decisionSystem.chooseOption(idx, this.clueSystem, this.resourceSystem);
        this.renderCurrentBeat();
      });

      this.beatElements.push(optContainer);
    });
  }
}
