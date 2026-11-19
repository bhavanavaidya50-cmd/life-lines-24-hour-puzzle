import Phaser from 'phaser';
import { THEME } from '../ui/UITheme.js';
import { UIComponents } from '../ui/UIComponents.js';
import { getScenarioById } from '../data/scenarios.js';
import { ClueSystem } from '../systems/ClueSystem.js';
import { ResourceSystem } from '../systems/ResourceSystem.js';
import { audioManager } from '../audio/AudioManager.js';

export class InvestigationScene extends Phaser.Scene {
  constructor() {
    super('InvestigationScene');
  }

  init(data) {
    this.scenarioId = data.scenarioId || 1;
    this.scenario = getScenarioById(this.scenarioId);
    this.clueSystem = data.clueSystem || new ClueSystem(this.scenario.clues);
    this.resourceSystem = data.resourceSystem || new ResourceSystem(this.scenario.initialResources);
  }

  create() {
    audioManager.playAmbient('investigation');

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x060911, 0x060911, 0x0b1322, 0x0b1322, 1);
    bg.fillRect(0, 0, width, height);

    // Top Resource HUD Bar
    UIComponents.createResourceHUD(this, this.resourceSystem);

    // Subheader Banner
    this.add.text(60, 75, `CASEFILE 0${this.scenario.id} // EVIDENCE & CLUE INVESTIGATION`, {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      letterSpacing: 2,
      color: '#c9a84c'
    });

    this.add.text(60, 95, 'Inspect critical evidence and communications to unlock informed strategies.', {
      fontFamily: THEME.fonts.sans,
      fontSize: '13px',
      color: '#94a3b8'
    });

    // Left Panel: Clue Dossier List
    const leftW = 420;
    const leftH = 430;
    const leftX = 60 + leftW / 2;
    const leftY = 345;
    UIComponents.createPanel(this, leftX, leftY, leftW, leftH, {
      fillColor: 0x0f172a,
      strokeColor: THEME.colors.border
    });

    this.add.text(80, 145, 'DISCOVERED EVIDENCE', {
      fontFamily: THEME.fonts.mono,
      fontSize: '12px',
      fontWeight: '700',
      color: '#38bdf8'
    });

    // Right Panel: Evidence Detail Viewer
    const rightW = 640;
    const rightH = 430;
    const rightX = leftX + leftW / 2 + 20 + rightW / 2;
    const rightY = leftY;
    UIComponents.createPanel(this, rightX, rightY, rightW, rightH, {
      fillColor: 0x111827,
      strokeColor: THEME.colors.border
    });

    this.detailTitle = this.add.text(rightX - rightW / 2 + 30, rightY - rightH / 2 + 25, 'SELECT A DOCUMENT TO INSPECT', {
      fontFamily: THEME.fonts.serif,
      fontSize: '22px',
      color: '#f8fafc'
    });

    this.detailMeta = this.add.text(rightX - rightW / 2 + 30, rightY - rightH / 2 + 60, '', {
      fontFamily: THEME.fonts.mono,
      fontSize: '11px',
      color: '#c9a84c'
    });

    this.detailBody = this.add.text(rightX - rightW / 2 + 30, rightY - rightH / 2 + 95, 'Reviewing facts before scheduling tasks minimizes unforeseen crises and opens powerful diplomatic solutions.', {
      fontFamily: THEME.fonts.sans,
      fontSize: '13px',
      color: '#cbd5e1',
      lineSpacing: 6,
      wordWrap: { width: rightW - 60 }
    });

    // Render Clues List
    this.renderClueList(leftX - leftW / 2 + 20, 175, leftW - 40);

    // Auto-select first discovered clue
    const discovered = this.clueSystem.getDiscoveredClues();
    if (discovered.length > 0) {
      this.selectClue(discovered[0]);
    }

    // Action Bottom Bar
    UIComponents.createButton(this, 120, height - 40, 150, 40, '← SCENARIOS', {
      onClick: () => {
        this.scene.start('ScenarioSelectScene');
      }
    });

    // "PROCEED TO 24H PLANNING BOARD" Button
    UIComponents.createButton(this, width - 180, height - 40, 260, 44, 'PROCEED TO 24H TIMELINE →', {
      gold: true,
      onClick: () => {
        audioManager.playClick();
        this.cameras.main.fadeOut(300);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('PlanningBoardScene', {
            scenarioId: this.scenario.id,
            clueSystem: this.clueSystem,
            resourceSystem: this.resourceSystem
          });
        });
      }
    });

    this.cameras.main.fadeIn(300);
  }

  renderClueList(startX, startY, itemWidth) {
    const allClues = this.clueSystem.getAllClues();

    allClues.forEach((clue, idx) => {
      const itemY = startY + idx * 65;
      const itemContainer = this.add.container(startX + itemWidth / 2, itemY);
      const bg = this.add.graphics();

      const drawItem = (hover = false, active = false) => {
        bg.clear();
        let fill = active ? 0x1e293b : (hover ? 0x162032 : 0x0e1626);
        let stroke = active ? THEME.colors.gold : (hover ? THEME.colors.steel : THEME.colors.border);
        bg.fillStyle(fill, 1);
        bg.fillRoundedRect(-itemWidth / 2, -26, itemWidth, 54, 6);
        bg.lineStyle(1.5, stroke, 0.9);
        bg.strokeRoundedRect(-itemWidth / 2, -26, itemWidth, 54, 6);
      };

      drawItem(false, this.clueSystem.selectedClueId === clue.id);
      itemContainer.add(bg);

      // Icon / Tag
      const typeTag = this.add.text(-itemWidth / 2 + 15, -15, clue.isDiscovered ? `[${clue.type.toUpperCase()}]` : '[CLASSIFIED]', {
        fontFamily: THEME.fonts.mono,
        fontSize: '10px',
        fontWeight: '700',
        color: clue.isDiscovered ? '#38bdf8' : '#64748b'
      });
      itemContainer.add(typeTag);

      const titleText = this.add.text(-itemWidth / 2 + 15, 2, clue.isDiscovered ? clue.title : 'Undiscovered Information', {
        fontFamily: THEME.fonts.sans,
        fontSize: '12px',
        fontWeight: '600',
        color: clue.isDiscovered ? '#f8fafc' : '#475569'
      });
      itemContainer.add(titleText);

      if (clue.isDiscovered) {
        itemContainer.setSize(itemWidth, 54);
        itemContainer.setInteractive({ useHandCursor: true });

        itemContainer.on('pointerover', () => drawItem(true, this.clueSystem.selectedClueId === clue.id));
        itemContainer.on('pointerout', () => drawItem(false, this.clueSystem.selectedClueId === clue.id));
        itemContainer.on('pointerdown', () => {
          audioManager.playCardSnap();
          this.selectClue(clue);
          this.renderClueList(startX, startY, itemWidth);
        });
      }
    });
  }

  selectClue(clue) {
    this.clueSystem.inspectClue(clue.id);
    this.detailTitle.setText(clue.title);
    this.detailMeta.setText(`SOURCE: ${clue.source}  |  STATUS: VERIFIED DOCUMENT`);
    this.detailBody.setText(clue.fullText);
  }
}
