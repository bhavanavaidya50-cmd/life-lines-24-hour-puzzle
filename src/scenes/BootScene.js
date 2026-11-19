import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Generate simple procedural graphics textures for icons/placeholders
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Document icon
    g.fillStyle(THEME.colors.gold, 1);
    g.fillRect(0, 0, 32, 40);
    g.fillStyle(THEME.colors.bgDark, 1);
    g.fillRect(4, 4, 24, 32);
    g.generateTexture('icon_doc', 32, 40);
    g.clear();

    // Padlock icon
    g.fillStyle(THEME.colors.textMuted, 1);
    g.fillRect(6, 12, 20, 16);
    g.lineStyle(2, THEME.colors.textMuted, 1);
    g.strokeCircle(16, 10, 6);
    g.generateTexture('icon_lock', 32, 32);
    g.clear();

    // Star icon
    g.fillStyle(THEME.colors.gold, 1);
    g.fillTriangle(16, 2, 24, 28, 4, 12);
    g.fillTriangle(16, 2, 8, 28, 28, 12);
    g.generateTexture('icon_star', 32, 32);
    g.clear();
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Deep cinematic background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x060910, 0x060910, 0x0f172a, 0x0f172a, 1);
    bg.fillRect(0, 0, width, height);

    // Subtle gold framing lines
    const frame = this.add.graphics();
    frame.lineStyle(1, THEME.colors.goldDim, 0.4);
    frame.strokeRect(30, 30, width - 60, height - 60);

    // Animated Logo Text
    const title = this.add.text(width / 2, height / 2 - 40, 'LIFE LINES', {
      fontFamily: THEME.fonts.serif,
      fontSize: '56px',
      fontStyle: 'normal',
      letterSpacing: 8,
      color: '#f8fafc'
    }).setOrigin(0.5).setAlpha(0);

    const subtitle = this.add.text(width / 2, height / 2 + 25, 'THE 24-HOUR PUZZLE', {
      fontFamily: THEME.fonts.sans,
      fontSize: '18px',
      fontWeight: '600',
      letterSpacing: 6,
      color: '#c9a84c'
    }).setOrigin(0.5).setAlpha(0);

    const tagline = this.add.text(width / 2, height / 2 + 65, 'Every decision changes the story.', {
      fontFamily: THEME.fonts.serif,
      fontSize: '16px',
      fontStyle: 'italic',
      color: '#94a3b8'
    }).setOrigin(0.5).setAlpha(0);

    const loadingText = this.add.text(width / 2, height - 70, 'INITIALIZING COGNITIVE ARCHITECTURE...', {
      fontFamily: THEME.fonts.mono,
      fontSize: '11px',
      color: '#64748b'
    }).setOrigin(0.5).setAlpha(0);

    // Elegant entrance tweens
    this.tweens.add({
      targets: title,
      alpha: 1,
      y: height / 2 - 30,
      duration: 1200,
      ease: 'Power2.easeOut'
    });

    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 1000,
      delay: 500,
      ease: 'Power2.easeOut'
    });

    this.tweens.add({
      targets: tagline,
      alpha: 1,
      duration: 1000,
      delay: 1000,
      ease: 'Power2.easeOut'
    });

    this.tweens.add({
      targets: loadingText,
      alpha: 0.8,
      duration: 600,
      delay: 1400
    });

    // Auto transition to Main Menu
    this.time.delayedCall(2400, () => {
      this.cameras.main.fadeOut(600, 7, 10, 18);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainMenuScene');
      });
    });
  }
}
