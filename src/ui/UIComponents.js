import { THEME } from './UITheme.js';
import { audioManager } from '../audio/AudioManager.js';

export class UIComponents {
  /**
   * Creates an elegant, interactive button with hover animations and audio triggers.
   */
  static createButton(scene, x, y, width, height, text, options = {}) {
    const isPrimary = options.primary ?? false;
    const isDanger = options.danger ?? false;
    const isGold = options.gold ?? false;
    const onClick = options.onClick || (() => {});
    const enabled = options.enabled ?? true;

    const container = scene.add.container(x, y);

    // Color definitions
    let baseFill = isGold ? THEME.colors.goldDim : (isPrimary ? THEME.colors.steel : (isDanger ? THEME.colors.danger : THEME.colors.bgElevated));
    let hoverFill = isGold ? THEME.colors.gold : (isPrimary ? 0x0284c7 : (isDanger ? 0xdc2626 : THEME.colors.bgCardHover));
    let borderStroke = isGold ? THEME.colors.goldLight : THEME.colors.borderLight;
    let textColor = isGold ? '#070a12' : '#f8fafc';
    if (!enabled) {
      baseFill = 0x1a2233;
      textColor = '#475569';
      borderStroke = 0x334155;
    }

    const bg = scene.add.graphics();
    const radius = options.radius || 8;

    const drawBg = (fill, stroke) => {
      bg.clear();
      bg.fillStyle(fill, 1);
      bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
      bg.lineStyle(1.5, stroke, 0.8);
      bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);
    };

    drawBg(baseFill, borderStroke);
    container.add(bg);

    const label = scene.add.text(0, 0, text, {
      fontFamily: options.font || THEME.fonts.sans,
      fontSize: options.fontSize || '15px',
      fontWeight: options.fontWeight || '600',
      color: textColor,
      align: 'center'
    }).setOrigin(0.5);
    container.add(label);

    if (enabled) {
      container.setSize(width, height);
      container.setInteractive({ useHandCursor: true });

      container.on('pointerover', () => {
        drawBg(hoverFill, THEME.colors.goldLight);
        scene.tweens.add({
          targets: container,
          scaleX: 1.03,
          scaleY: 1.03,
          duration: 120,
          ease: 'Sine.easeOut'
        });
      });

      container.on('pointerout', () => {
        drawBg(baseFill, borderStroke);
        scene.tweens.add({
          targets: container,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 120,
          ease: 'Sine.easeOut'
        });
      });

      container.on('pointerdown', () => {
        audioManager.playClick();
        scene.tweens.add({
          targets: container,
          scaleX: 0.96,
          scaleY: 0.96,
          duration: 60,
          yoyo: true,
          onComplete: () => {
            onClick();
          }
        });
      });
    }

    return container;
  }

  /**
   * Creates a card panel with glassmorphism aesthetic
   */
  static createPanel(scene, x, y, width, height, options = {}) {
    const container = scene.add.container(x, y);
    const bg = scene.add.graphics();
    const fill = options.fillColor || THEME.colors.bgCard;
    const stroke = options.strokeColor || THEME.colors.border;
    const alpha = options.alpha !== undefined ? options.alpha : 0.92;
    const radius = options.radius || 12;

    bg.fillStyle(fill, alpha);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    bg.lineStyle(1.5, stroke, 0.7);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);

    container.add(bg);
    return container;
  }

  /**
   * Top HUD Resource Bar displaying Time, Energy, Money, Stress, Relationships
   */
  static createResourceHUD(scene, resourceSystem) {
    const w = 1160;
    const h = 50;
    const x = 600;
    const y = 35;

    const hudContainer = scene.add.container(x, y);
    const bg = scene.add.graphics();
    bg.fillStyle(0x090e1a, 0.95);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 8);
    bg.lineStyle(1, THEME.colors.border, 0.8);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 8);
    hudContainer.add(bg);

    const items = [
      { key: 'time', icon: '⏱ TIME', color: '#38bdf8', getVal: (s) => `${Math.floor(s.timeMinutes / 60)}h ${s.timeMinutes % 60}m` },
      { key: 'energy', icon: '⚡ ENERGY', color: '#10b981', getVal: (s) => `${s.energy}%` },
      { key: 'money', icon: '💳 FUNDS', color: '#eab308', getVal: (s) => `$${s.money.toLocaleString()}` },
      { key: 'stress', icon: '🔥 STRESS', color: '#ef4444', getVal: (s) => `${s.stress}%` },
      { key: 'relations', icon: '🤝 RAPPORT', color: '#ec4899', getVal: () => `${resourceSystem.getAverageRelationship()}%` }
    ];

    const spacing = w / (items.length + 0.5);
    const startX = -w / 2 + spacing * 0.75;
    const labels = {};

    items.forEach((item, idx) => {
      const itemX = startX + idx * spacing;
      
      const tagText = scene.add.text(itemX, -8, item.icon, {
        fontFamily: THEME.fonts.sans,
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748b'
      }).setOrigin(0.5);

      const valText = scene.add.text(itemX, 10, item.getVal(resourceSystem.getSnapshot()), {
        fontFamily: THEME.fonts.mono,
        fontSize: '15px',
        fontWeight: '600',
        color: item.color
      }).setOrigin(0.5);

      hudContainer.add(tagText);
      hudContainer.add(valText);
      labels[item.key] = valText;
    });

    // Subscribe to updates
    resourceSystem.onChange((snapshot) => {
      items.forEach(item => {
        if (labels[item.key]) {
          labels[item.key].setText(item.getVal(snapshot));
        }
      });
    });

    return hudContainer;
  }
}
