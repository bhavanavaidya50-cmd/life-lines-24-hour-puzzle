import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { SCENARIOS } from '../data/scenarios.js';

export class ProfileScene extends Phaser.Scene {
  constructor() {
    super('ProfileScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const saveData = SaveSystem.load();

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x060910, 0x060910, 0x0d1525, 0x0d1525, 1);
    bg.fillRect(0, 0, width, height);

    // Frame
    const frame = this.add.graphics();
    frame.lineStyle(1, THEME.colors.goldDim, 0.4);
    frame.strokeRect(50, 40, width - 100, height - 80);

    // Header
    this.add.text(width / 2, 70, 'STRATEGIC DOSSIER & PROGRESSION', {
      fontFamily: THEME.fonts.serif,
      fontSize: '28px',
      letterSpacing: 2,
      color: '#f8fafc'
    }).setOrigin(0.5);

    // Back Button
    UIComponents.createButton(this, 120, 70, 110, 36, '← BACK', {
      onClick: () => {
        this.scene.start('MainMenuScene');
      }
    });

    // Profile Card (Left)
    const leftW = 340;
    const leftH = 380;
    const leftX = 70 + leftW / 2;
    const leftY = 320;
    UIComponents.createPanel(this, leftX, leftY, leftW, leftH, {
      fillColor: 0x0f172a,
      strokeColor: THEME.colors.border
    });

    // Avatar
    const avatarG = this.add.graphics();
    avatarG.fillStyle(THEME.colors.goldDim, 0.5);
    avatarG.fillCircle(leftX, leftY - 110, 40);
    avatarG.lineStyle(2, THEME.colors.gold, 1);
    avatarG.strokeCircle(leftX, leftY - 110, 40);

    this.add.text(leftX, leftY - 110, 'A', {
      fontFamily: THEME.fonts.serif,
      fontSize: '28px',
      color: '#f8fafc'
    }).setOrigin(0.5);

    this.add.text(leftX, leftY - 45, saveData.player.name, {
      fontFamily: THEME.fonts.serif,
      fontSize: '22px',
      color: '#f8fafc'
    }).setOrigin(0.5);

    this.add.text(leftX, leftY - 20, 'Senior Systems Strategist', {
      fontFamily: THEME.fonts.sans,
      fontSize: '12px',
      color: '#c9a84c'
    }).setOrigin(0.5);

    const completed = saveData.progress.completedScenarios.length;
    this.add.text(leftX, leftY + 25, `Solved Scenarios: ${completed} / 5`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '13px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    const totalStars = Object.values(saveData.progress.scenarioStars).reduce((a, b) => a + b, 0);
    this.add.text(leftX, leftY + 55, `Mastery Stars: ${totalStars} / 15 ★`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '13px',
      color: '#eab308'
    }).setOrigin(0.5);

    // Reset Progress button
    UIComponents.createButton(this, leftX, leftY + 130, 200, 36, 'RESET PROGRESS', {
      danger: true,
      onClick: () => {
        SaveSystem.resetProgress();
        this.scene.restart();
      }
    });

    // Scenarios Progress Log (Right)
    const rightW = 660;
    const rightH = 380;
    const rightX = leftX + leftW / 2 + 25 + rightW / 2;
    const rightY = leftY;
    UIComponents.createPanel(this, rightX, rightY, rightW, rightH, {
      fillColor: 0x111c30,
      strokeColor: THEME.colors.border
    });

    this.add.text(rightX - rightW / 2 + 30, rightY - rightH / 2 + 25, 'CASEFILE RECORDS & ACHIEVEMENTS', {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      fontWeight: '700',
      color: '#38bdf8'
    });

    SCENARIOS.forEach((s, idx) => {
      const itemY = rightY - rightH / 2 + 65 + idx * 58;
      const isDone = saveData.progress.completedScenarios.includes(s.id);
      const stars = saveData.progress.scenarioStars[s.id] || 0;
      const high = saveData.progress.scenarioHighScores[s.id] || 0;

      const itemG = this.add.graphics();
      itemG.fillStyle(isDone ? 0x162238 : 0x0c1424, 0.8);
      itemG.fillRoundedRect(rightX - rightW / 2 + 25, itemY, rightW - 50, 48, 6);
      itemG.lineStyle(1, isDone ? THEME.colors.borderLight : 0x1e293b, 1);
      itemG.strokeRoundedRect(rightX - rightW / 2 + 25, itemY, rightW - 50, 48, 6);

      this.add.text(rightX - rightW / 2 + 40, itemY + 15, `CASEFILE 0${s.id}: ${s.title}`, {
        fontFamily: THEME.fonts.sans,
        fontSize: '13px',
        fontWeight: '600',
        color: isDone ? '#f8fafc' : '#64748b'
      });

      const starLabel = isDone ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : 'LOCKED';
      this.add.text(rightX + rightW / 2 - 120, itemY + 15, `${starLabel}  (${high} pts)`, {
        fontFamily: THEME.fonts.mono,
        fontSize: '12px',
        color: isDone ? '#eab308' : '#475569'
      });
    });

    this.cameras.main.fadeIn(300);
  }
}
