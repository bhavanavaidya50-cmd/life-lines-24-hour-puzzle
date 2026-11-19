import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { getScenarioById } from '../data/scenarios.js';
import { ScoringSystem } from '../systems/ScoringSystem.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { audioManager } from '../audio/AudioManager.js';

export class ConsequenceScene extends Phaser.Scene {
  constructor() {
    super('ConsequenceScene');
  }

  init(data) {
    this.scenarioId = data.scenarioId || 1;
    this.scenario = getScenarioById(this.scenarioId);
    this.clueSystem = data.clueSystem;
    this.resourceSystem = data.resourceSystem;
    this.timelineSystem = data.timelineSystem;
    this.decisionSystem = data.decisionSystem;
    this.ending = data.ending;

    // Calculate score
    this.scoreResult = ScoringSystem.evaluateScenario({
      scenarioConfig: this.scenario,
      timelineSystem: this.timelineSystem,
      clueSystem: this.clueSystem,
      resourceSystem: this.resourceSystem,
      decisionSystem: this.decisionSystem,
      ending: this.ending
    });

    // Save progress to LocalStorage
    SaveSystem.recordScenarioCompletion(
      this.scenario.id,
      this.ending.id,
      this.scoreResult.totalScore,
      this.scoreResult.stars
    );
  }

  create() {
    audioManager.playSuccess();

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x060910, 0x060910, 0x0f182a, 0x0f182a, 1);
    bg.fillRect(0, 0, width, height);

    // Frame
    const frame = this.add.graphics();
    frame.lineStyle(1, THEME.colors.goldDim, 0.4);
    frame.strokeRect(50, 40, width - 100, height - 80);

    // Header
    this.add.text(width / 2, 75, `CASEFILE 0${this.scenario.id} RESOLUTION // CONSEQUENCE ANALYSIS`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      letterSpacing: 2,
      color: '#c9a84c'
    }).setOrigin(0.5);

    this.add.text(width / 2, 110, this.ending.title, {
      fontFamily: THEME.fonts.serif,
      fontSize: '32px',
      color: '#f8fafc'
    }).setOrigin(0.5);

    // Star rating animation
    const starStr = '★ '.repeat(this.scoreResult.stars) + '☆ '.repeat(3 - this.scoreResult.stars);
    this.add.text(width / 2, 145, starStr, {
      fontFamily: THEME.fonts.sans,
      fontSize: '24px',
      color: '#eab308'
    }).setOrigin(0.5);

    // Ending Epilogue Narrative Card
    const epiloguePanel = UIComponents.createPanel(this, width / 2, 230, 960, 110, {
      fillColor: 0x111c30,
      strokeColor: THEME.colors.goldDim
    });

    this.add.text(width / 2, 230, this.ending.text, {
      fontFamily: THEME.fonts.serif,
      fontSize: '14px',
      fontStyle: 'italic',
      color: '#e2e8f0',
      lineSpacing: 5,
      align: 'center',
      wordWrap: { width: 900 }
    }).setOrigin(0.5);

    // Performance Scoring Breakdown (4 Columns)
    const breakdownY = 360;
    const itemW = 225;
    const startX = width / 2 - (4 * itemW + 3 * 15) / 2 + itemW / 2;

    this.scoreResult.breakdown.forEach((b, idx) => {
      const itemX = startX + idx * (itemW + 15);
      const card = UIComponents.createPanel(this, itemX, breakdownY + 40, itemW, 130, {
        fillColor: 0x0f172a,
        strokeColor: THEME.colors.border
      });

      this.add.text(itemX, breakdownY - 5, b.category, {
        fontFamily: THEME.fonts.mono,
        fontSize: '10px',
        fontWeight: '700',
        color: '#38bdf8',
        align: 'center',
        wordWrap: { width: itemW - 15 }
      }).setOrigin(0.5);

      this.add.text(itemX, breakdownY + 25, `${b.points} / ${b.max}`, {
        fontFamily: THEME.fonts.mono,
        fontSize: '18px',
        fontWeight: '700',
        color: '#f8fafc'
      }).setOrigin(0.5);

      this.add.text(itemX, breakdownY + 65, b.description, {
        fontFamily: THEME.fonts.sans,
        fontSize: '10px',
        color: '#94a3b8',
        align: 'center',
        wordWrap: { width: itemW - 20 }
      }).setOrigin(0.5);
    });

    // Total Score
    this.add.text(width / 2, breakdownY + 130, `TOTAL EVALUATION SCORE: ${this.scoreResult.totalScore} / 1000 PTS  [${this.scoreResult.ratingLabel.toUpperCase()}]`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '13px',
      fontWeight: '700',
      color: '#c9a84c'
    }).setOrigin(0.5);

    // Bottom Navigation Buttons
    UIComponents.createButton(this, width / 2 - 140, height - 55, 200, 44, 'REPLAY CASEFILE', {
      onClick: () => {
        this.scene.start('StoryIntroScene', { scenarioId: this.scenario.id });
      }
    });

    const nextId = this.scenario.id + 1;
    const hasNext = nextId <= 5;
    const nextBtnLabel = hasNext ? `PROCEED TO CASEFILE 0${nextId} →` : 'RETURN TO MAIN MENU';

    UIComponents.createButton(this, width / 2 + 140, height - 55, 240, 44, nextBtnLabel, {
      gold: true,
      onClick: () => {
        if (hasNext) {
          this.scene.start('StoryIntroScene', { scenarioId: nextId });
        } else {
          this.scene.start('MainMenuScene');
        }
      }
    });

    this.cameras.main.fadeIn(300);
  }
}
