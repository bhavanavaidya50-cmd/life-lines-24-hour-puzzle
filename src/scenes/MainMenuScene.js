import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { audioManager } from '../audio/AudioManager.js';
import { SaveSystem } from '../systems/SaveSystem.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    audioManager.init();
    audioManager.playAmbient('investigation');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Atmospheric Gradient Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x070b14, 0x070b14, 0x111927, 0x111927, 1);
    bg.fillRect(0, 0, width, height);

    // Subtle ambient particle floating dots
    for (let i = 0; i < 40; i++) {
      const px = Phaser.Math.Between(40, width - 40);
      const py = Phaser.Math.Between(40, height - 40);
      const dot = this.add.circle(px, py, Phaser.Math.FloatBetween(1, 2.5), 0xc9a84c, Phaser.Math.FloatBetween(0.15, 0.45));
      this.tweens.add({
        targets: dot,
        y: py - Phaser.Math.Between(30, 80),
        alpha: { from: dot.alpha, to: 0.05 },
        duration: Phaser.Math.Between(4000, 9000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Border line accents
    const border = this.add.graphics();
    border.lineStyle(1, THEME.colors.goldDim, 0.3);
    border.strokeRect(40, 40, width - 80, height - 80);

    // Header Branding
    this.add.text(width / 2, 140, 'LIFE LINES', {
      fontFamily: THEME.fonts.serif,
      fontSize: '62px',
      letterSpacing: 6,
      color: '#f8fafc',
      shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 15, stroke: true, fill: true }
    }).setOrigin(0.5);

    this.add.text(width / 2, 210, 'THE 24-HOUR PUZZLE', {
      fontFamily: THEME.fonts.sans,
      fontSize: '18px',
      fontWeight: '600',
      letterSpacing: 8,
      color: '#c9a84c'
    }).setOrigin(0.5);

    this.add.text(width / 2, 245, 'Every decision changes the story.', {
      fontFamily: THEME.fonts.serif,
      fontSize: '16px',
      fontStyle: 'italic',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Menu Interactive Buttons
    const startY = 320;
    const spacing = 65;

    // 1. PLAY / SELECT SCENARIO
    UIComponents.createButton(this, width / 2, startY, 280, 50, 'SELECT SCENARIO', {
      gold: true,
      onClick: () => {
        this.cameras.main.fadeOut(300);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('ScenarioSelectScene');
        });
      }
    });

    // 2. PLAYER PROFILE & ACHIEVEMENTS
    UIComponents.createButton(this, width / 2, startY + spacing, 280, 50, 'PLAYER PROFILE', {
      primary: true,
      onClick: () => {
        this.scene.start('ProfileScene');
      }
    });

    // 3. SETTINGS & AUDIO CONTROLS
    UIComponents.createButton(this, width / 2, startY + spacing * 2, 280, 50, 'SETTINGS', {
      onClick: () => {
        this.scene.start('SettingsScene');
      }
    });

    // Save Data Status / Version Bottom Bar
    const saveData = SaveSystem.load();
    const completedCount = saveData.progress.completedScenarios.length;
    this.add.text(width / 2, height - 70, `STATUS: Active Casefile | Completed Scenarios: ${completedCount}/5 | v1.0.0`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      color: '#64748b'
    }).setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(400);
  }
}
