import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { audioManager } from '../audio/AudioManager.js';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const saveData = SaveSystem.load();

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x060910, 0x060910, 0x0d1525, 0x0d1525, 1);
    bg.fillRect(0, 0, width, height);

    // Header
    this.add.text(width / 2, 70, 'SYSTEM SETTINGS & AUDIO CONTROLS', {
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

    // Settings Panel
    const panelW = 700;
    const panelH = 380;
    const panelX = width / 2;
    const panelY = 320;
    UIComponents.createPanel(this, panelX, panelY, panelW, panelH, {
      fillColor: 0x0f172a,
      strokeColor: THEME.colors.border
    });

    // 1. Audio Mute Toggle
    this.add.text(panelX - panelW / 2 + 40, panelY - panelH / 2 + 50, 'AUDIO SYNTHESIS & SOUND EFFECTS', {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      fontWeight: '700',
      color: '#38bdf8'
    });

    this.soundStatusText = this.add.text(panelX - panelW / 2 + 40, panelY - panelH / 2 + 85, `Sound Status: ${saveData.settings.soundEnabled ? 'ENABLED' : 'MUTED'}`, {
      fontFamily: THEME.fonts.sans,
      fontSize: '14px',
      color: '#cbd5e1'
    });

    UIComponents.createButton(this, panelX + panelW / 2 - 120, panelY - panelH / 2 + 85, 160, 36, 'TOGGLE MUTE', {
      onClick: () => {
        saveData.settings.soundEnabled = !saveData.settings.soundEnabled;
        audioManager.setMuted(!saveData.settings.soundEnabled);
        SaveSystem.save(saveData);
        this.soundStatusText.setText(`Sound Status: ${saveData.settings.soundEnabled ? 'ENABLED' : 'MUTED'}`);
      }
    });

    // 2. Volume Controls
    this.add.text(panelX - panelW / 2 + 40, panelY - panelH / 2 + 140, 'VOLUME LEVEL', {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      fontWeight: '700',
      color: '#38bdf8'
    });

    this.volumeText = this.add.text(panelX - panelW / 2 + 40, panelY - panelH / 2 + 175, `Master Gain: ${Math.round(saveData.settings.volume * 100)}%`, {
      fontFamily: THEME.fonts.sans,
      fontSize: '14px',
      color: '#cbd5e1'
    });

    UIComponents.createButton(this, panelX + panelW / 2 - 180, panelY - panelH / 2 + 175, 70, 36, '- 10%', {
      onClick: () => {
        saveData.settings.volume = Math.max(0, saveData.settings.volume - 0.1);
        audioManager.setVolume(saveData.settings.volume);
        SaveSystem.save(saveData);
        this.volumeText.setText(`Master Gain: ${Math.round(saveData.settings.volume * 100)}%`);
      }
    });

    UIComponents.createButton(this, panelX + panelW / 2 - 90, panelY - panelH / 2 + 175, 70, 36, '+ 10%', {
      onClick: () => {
        saveData.settings.volume = Math.min(1, saveData.settings.volume + 0.1);
        audioManager.setVolume(saveData.settings.volume);
        SaveSystem.save(saveData);
        this.volumeText.setText(`Master Gain: ${Math.round(saveData.settings.volume * 100)}%`);
      }
    });

    // 3. Technical Platform Info
    this.add.text(panelX - panelW / 2 + 40, panelY - panelH / 2 + 240, 'SYSTEM ARCHITECTURE', {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      fontWeight: '700',
      color: '#c9a84c'
    });

    const info = [
      '• Framework: Phaser 3.88 + Modern ES6 Modules + Vite 6',
      '• Sound Engine: Procedural Harmonic Web Audio API (Zero External Assets)',
      '• Data Persistence: LocalStorage Schema v1 with Auto-Save',
      '• Target Audience: Adult Strategy (30+) – High Cognitive Depth'
    ];

    info.forEach((t, i) => {
      this.add.text(panelX - panelW / 2 + 40, panelY - panelH / 2 + 270 + i * 22, t, {
        fontFamily: THEME.fonts.sans,
        fontSize: '12px',
        color: '#94a3b8'
      });
    });

    this.cameras.main.fadeIn(300);
  }
}
