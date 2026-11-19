import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { getScenarioById } from '../data/scenarios.js';
import { audioManager } from '../audio/AudioManager.js';

export class StoryIntroScene extends Phaser.Scene {
  constructor() {
    super('StoryIntroScene');
  }

  init(data) {
    this.scenarioId = data.scenarioId || 1;
    this.scenario = getScenarioById(this.scenarioId);
  }

  create() {
    audioManager.playAmbient('investigation');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Atmospheric dark background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x060910, 0x060910, 0x0c121e, 0x0c121e, 1);
    bg.fillRect(0, 0, width, height);

    // Frame
    const frame = this.add.graphics();
    frame.lineStyle(1, THEME.colors.goldDim, 0.4);
    frame.strokeRect(50, 40, width - 100, height - 80);

    // Header Metadata
    this.add.text(80, 70, `CASEFILE 0${this.scenario.id} // STRATEGIC BRIEFING`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      letterSpacing: 3,
      color: '#c9a84c'
    });

    this.add.text(80, 105, this.scenario.title, {
      fontFamily: THEME.fonts.serif,
      fontSize: '38px',
      color: '#f8fafc'
    });

    this.add.text(80, 155, this.scenario.tagline, {
      fontFamily: THEME.fonts.serif,
      fontSize: '17px',
      fontStyle: 'italic',
      color: '#94a3b8'
    });

    // Protagonist Profile Card (Left Panel)
    const cardW = 320;
    const cardH = 340;
    const cardX = 80 + cardW / 2;
    const cardY = 360;

    const profilePanel = UIComponents.createPanel(this, cardX, cardY, cardW, cardH, {
      fillColor: 0x101827,
      strokeColor: THEME.colors.border
    });

    // Abstract geometric avatar icon
    const avatarG = this.add.graphics();
    avatarG.fillStyle(THEME.colors.goldDim, 0.4);
    avatarG.fillCircle(cardX, cardY - 95, 40);
    avatarG.lineStyle(2, THEME.colors.gold, 0.8);
    avatarG.strokeCircle(cardX, cardY - 95, 40);

    // Avatar initials
    const initials = this.scenario.protagonist.name.split(' ').map(n => n[0]).join('');
    this.add.text(cardX, cardY - 95, initials, {
      fontFamily: THEME.fonts.serif,
      fontSize: '24px',
      color: '#f8fafc'
    }).setOrigin(0.5);

    this.add.text(cardX, cardY - 30, this.scenario.protagonist.name, {
      fontFamily: THEME.fonts.serif,
      fontSize: '20px',
      fontWeight: '600',
      color: '#f8fafc'
    }).setOrigin(0.5);

    this.add.text(cardX, cardY - 5, `Age: ${this.scenario.protagonist.age} | ${this.scenario.protagonist.role}`, {
      fontFamily: THEME.fonts.sans,
      fontSize: '12px',
      color: '#c9a84c',
      align: 'center',
      wordWrap: { width: cardW - 30 }
    }).setOrigin(0.5);

    this.add.text(cardX, cardY + 70, this.scenario.protagonist.bio, {
      fontFamily: THEME.fonts.sans,
      fontSize: '12px',
      color: '#94a3b8',
      align: 'center',
      lineSpacing: 4,
      wordWrap: { width: cardW - 40 }
    }).setOrigin(0.5);

    // Objectives and Constraints Panel (Right Side)
    const rightW = 680;
    const rightH = 340;
    const rightX = cardX + cardW / 2 + 30 + rightW / 2;
    const rightY = cardY;

    UIComponents.createPanel(this, rightX, rightY, rightW, rightH, {
      fillColor: 0x101827,
      strokeColor: THEME.colors.border
    });

    const objTitle = this.add.text(rightX - rightW / 2 + 30, rightY - rightH / 2 + 30, 'MISSION DIRECTIVES & TIMELINE CONSTRAINTS', {
      fontFamily: THEME.fonts.mono,
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: 1.5,
      color: '#38bdf8'
    });

    const directives = [
      '• 24-HOUR HORIZON: Complete and validate critical tasks before strict deadlines.',
      '• INVESTIGATIVE SCRUTINY: Inspect case documents to uncover hidden options before making irreversible calls.',
      '• EQUILIBRIUM MANAGEMENT: Balance Energy, Financial Capital, Stress, and Relationship Trust.',
      '• CONSEQUENCE CASCADE: Every major decision shapes subsequent events and narrative endings.'
    ];

    directives.forEach((text, i) => {
      this.add.text(rightX - rightW / 2 + 30, rightY - rightH / 2 + 70 + i * 40, text, {
        fontFamily: THEME.fonts.sans,
        fontSize: '13px',
        color: '#cbd5e1',
        wordWrap: { width: rightW - 60 }
      });
    });

    // Navigation Buttons at Bottom
    UIComponents.createButton(this, rightX - 140, rightY + rightH / 2 - 45, 200, 44, '← BACK TO SELECTION', {
      onClick: () => {
        this.scene.start('ScenarioSelectScene');
      }
    });

    UIComponents.createButton(this, rightX + 140, rightY + rightH / 2 - 45, 240, 44, 'COMMENCE CASE →', {
      gold: true,
      onClick: () => {
        audioManager.playDecisionImpact();
        this.cameras.main.fadeOut(300);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('InvestigationScene', { scenarioId: this.scenario.id });
        });
      }
    });

    this.cameras.main.fadeIn(300);
  }
}
