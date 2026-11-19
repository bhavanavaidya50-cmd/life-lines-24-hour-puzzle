import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { SCENARIOS } from '../data/scenarios.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { audioManager } from '../audio/AudioManager.js';

export class ScenarioSelectScene extends Phaser.Scene {
  constructor() {
    super('ScenarioSelectScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const saveData = SaveSystem.load();

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x070b14, 0x070b14, 0x0e1726, 0x0e1726, 1);
    bg.fillRect(0, 0, width, height);

    // Top Navigation Header
    this.add.text(width / 2, 50, 'SELECT SCENARIO', {
      fontFamily: THEME.fonts.serif,
      fontSize: '32px',
      letterSpacing: 3,
      color: '#f8fafc'
    }).setOrigin(0.5);

    this.add.text(width / 2, 85, 'Five lives. Five critical 24-hour windows. Every choice echoes.', {
      fontFamily: THEME.fonts.sans,
      fontSize: '14px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Back to Menu Button
    UIComponents.createButton(this, 100, 50, 120, 36, '← BACK', {
      onClick: () => {
        this.scene.start('MainMenuScene');
      }
    });

    // Scenario Cards Grid (5 cards)
    const cardWidth = 210;
    const cardHeight = 380;
    const totalW = 5 * cardWidth + 4 * 18;
    const startX = (width - totalW) / 2 + cardWidth / 2;
    const cardY = 320;

    SCENARIOS.forEach((scenario, idx) => {
      const cardX = startX + idx * (cardWidth + 18);
      const isUnlocked = saveData.progress.unlockedScenarios.includes(scenario.id);
      const stars = saveData.progress.scenarioStars[scenario.id] || 0;
      const highScore = saveData.progress.scenarioHighScores[scenario.id] || null;

      const cardContainer = this.add.container(cardX, cardY);
      const cardBg = this.add.graphics();

      // Card Background Drawing
      const drawCard = (hover = false) => {
        cardBg.clear();
        const fill = isUnlocked ? (hover ? 0x18243b : 0x101827) : 0x0b101c;
        const stroke = isUnlocked ? (hover ? THEME.colors.gold : THEME.colors.borderLight) : 0x1f293d;
        cardBg.fillStyle(fill, 0.95);
        cardBg.fillRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 10);
        cardBg.lineStyle(1.5, stroke, 1);
        cardBg.strokeRoundedRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 10);

        // Top accent stripe
        if (isUnlocked) {
          cardBg.fillStyle(THEME.colors.goldDim, 1);
          cardBg.fillRect(-cardWidth / 2 + 10, -cardHeight / 2 + 8, cardWidth - 20, 3);
        }
      };
      drawCard(false);
      cardContainer.add(cardBg);

      // Scenario Roman Numeral Tag
      const numText = this.add.text(0, -cardHeight / 2 + 35, `CASEFILE 0${scenario.id}`, {
        fontFamily: THEME.fonts.mono,
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: 2,
        color: isUnlocked ? '#c9a84c' : '#475569'
      }).setOrigin(0.5);
      cardContainer.add(numText);

      // Scenario Title
      const titleText = this.add.text(0, -cardHeight / 2 + 75, scenario.title, {
        fontFamily: THEME.fonts.serif,
        fontSize: '17px',
        fontWeight: '600',
        color: isUnlocked ? '#f8fafc' : '#475569',
        align: 'center',
        wordWrap: { width: cardWidth - 30 }
      }).setOrigin(0.5);
      cardContainer.add(titleText);

      // Protagonist details
      const protoText = this.add.text(0, -cardHeight / 2 + 130, `${scenario.protagonist.name}\n${scenario.protagonist.role}`, {
        fontFamily: THEME.fonts.sans,
        fontSize: '11px',
        color: isUnlocked ? '#94a3b8' : '#334155',
        align: 'center',
        wordWrap: { width: cardWidth - 30 }
      }).setOrigin(0.5);
      cardContainer.add(protoText);

      // Divider line
      const divLine = this.add.graphics();
      divLine.lineStyle(1, 0x1f293d, 1);
      divLine.lineBetween(-cardWidth / 2 + 20, -10, cardWidth / 2 - 20, -10);
      cardContainer.add(divLine);

      // Tagline synopsis
      const tagText = this.add.text(0, 45, scenario.tagline, {
        fontFamily: THEME.fonts.sans,
        fontSize: '11px',
        color: isUnlocked ? '#cbd5e1' : '#334155',
        align: 'center',
        wordWrap: { width: cardWidth - 30 }
      }).setOrigin(0.5);
      cardContainer.add(tagText);

      if (isUnlocked) {
        // Star ratings
        const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        const starText = this.add.text(0, 110, starStr, {
          fontFamily: THEME.fonts.sans,
          fontSize: '18px',
          color: stars > 0 ? '#eab308' : '#334155'
        }).setOrigin(0.5);
        cardContainer.add(starText);

        if (highScore) {
          const scoreText = this.add.text(0, 130, `Best: ${highScore} pts`, {
            fontFamily: THEME.fonts.mono,
            fontSize: '11px',
            color: '#94a3b8'
          }).setOrigin(0.5);
          cardContainer.add(scoreText);
        }

        // Action button
        const btnLabel = stars > 0 ? 'REPLAY' : 'ENTER CASE';
        const startBtn = UIComponents.createButton(this, 0, cardHeight / 2 - 35, cardWidth - 40, 36, btnLabel, {
          gold: stars === 0,
          primary: stars > 0,
          fontSize: '12px',
          onClick: () => {
            this.scene.start('StoryIntroScene', { scenarioId: scenario.id });
          }
        });
        cardContainer.add(startBtn);

        // Hover effect for entire card
        cardContainer.setSize(cardWidth, cardHeight);
        cardContainer.setInteractive({ useHandCursor: true });
        cardContainer.on('pointerover', () => {
          drawCard(true);
          this.tweens.add({ targets: cardContainer, y: cardY - 6, duration: 150 });
        });
        cardContainer.on('pointerout', () => {
          drawCard(false);
          this.tweens.add({ targets: cardContainer, y: cardY, duration: 150 });
        });
      } else {
        // Locked card graphic
        const lockIcon = this.add.text(0, 110, '🔒 LOCKED', {
          fontFamily: THEME.fonts.mono,
          fontSize: '12px',
          color: '#64748b'
        }).setOrigin(0.5);
        cardContainer.add(lockIcon);

        const lockReason = this.add.text(0, 135, `Complete Casefile 0${scenario.id - 1} to Unlock`, {
          fontFamily: THEME.fonts.sans,
          fontSize: '10px',
          color: '#475569',
          align: 'center',
          wordWrap: { width: cardWidth - 30 }
        }).setOrigin(0.5);
        cardContainer.add(lockReason);
      }
    });

    this.cameras.main.fadeIn(300);
  }
}
