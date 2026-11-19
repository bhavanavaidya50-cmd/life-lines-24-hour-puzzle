import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { ScenarioSelectScene } from './scenes/ScenarioSelectScene.js';
import { StoryIntroScene } from './scenes/StoryIntroScene.js';
import { InvestigationScene } from './scenes/InvestigationScene.js';
import { PlanningBoardScene } from './scenes/PlanningBoardScene.js';
import { DecisionScene } from './scenes/DecisionScene.js';
import { ConsequenceScene } from './scenes/ConsequenceScene.js';
import { ProfileScene } from './scenes/ProfileScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1200,
  height: 675, // 16:9 widescreen presentation
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#070a12',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    MainMenuScene,
    ScenarioSelectScene,
    StoryIntroScene,
    InvestigationScene,
    PlanningBoardScene,
    DecisionScene,
    ConsequenceScene,
    ProfileScene,
    SettingsScene
  ]
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
  window.game = game;

  // URL Hash Navigation / Automation Support
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const params = new URLSearchParams(hash);
    const sceneTarget = params.get('scene');
    const scenarioId = Number(params.get('scenario') || 1);
    if (sceneTarget) {
      game.events.once('ready', () => {
        // Stop BootScene or whatever is active and switch immediately
        setTimeout(() => {
          game.scene.getScenes(true).forEach(s => s.scene.stop());
          game.scene.start(sceneTarget, { scenarioId });
        }, 150);
      });
    }
  }
});
