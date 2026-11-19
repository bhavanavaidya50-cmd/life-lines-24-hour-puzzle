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
  new Phaser.Game(config);
});
