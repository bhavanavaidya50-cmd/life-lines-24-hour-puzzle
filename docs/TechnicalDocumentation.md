# TECHNICAL ARCHITECTURE & DOCUMENTATION
## LIFE LINES – THE 24-HOUR PUZZLE

---

### 1. Technology Stack
- **Game Engine**: Phaser.js 3.88.2
- **Language**: Modern JavaScript (ES6+ Modules)
- **Bundler / Dev Server**: Vite 6.2.0
- **Audio Synthesis**: Web Audio API (Native browser synthesis)
- **Persistence**: Browser `window.localStorage`
- **Markup / Presentation**: HTML5, CSS3 with responsive canvas scaling

---

### 2. Architecture Overview & Modularity

The application is structured into decoupled, single-responsibility modules:

```
src/
├── audio/
│   └── AudioManager.js       # Web Audio API engine, procedural ambient drones & SFX
├── data/
│   ├── scenario1.js          # Casefile 01: The Unexpected Monday
│   ├── scenario2.js          # Casefile 02: The Missing Transaction
│   ├── scenario3.js          # Casefile 03: The Family Secret
│   ├── scenario4.js          # Casefile 04: The Business Crisis
│   ├── scenario5.js          # Casefile 05: The Final Decision
│   └── scenarios.js          # Scenario registry and aggregator
├── scenes/
│   ├── BootScene.js          # Asset and procedural texture initialization
│   ├── MainMenuScene.js      # Title screen and main menu navigation
│   ├── ScenarioSelectScene.js# Casefile grid, lock/unlock states, star badges
│   ├── StoryIntroScene.js    # Casefile briefing and protagonist dossier
│   ├── InvestigationScene.js # Document reader and clue inspection panel
│   ├── PlanningBoardScene.js # 24-hour interactive scheduling canvas
│   ├── DecisionScene.js      # Interactive story beats and moral branches
│   ├── ConsequenceScene.js   # Resolution analysis, star scoring, epilogue
│   ├── ProfileScene.js       # Player career stats and achievement record
│   └── SettingsScene.js      # Sound levels and system configuration
├── systems/
│   ├── ClueSystem.js         # Clue discovery, inspection, and prerequisite checks
│   ├── DecisionSystem.js     # Story beat state machine and flag manager
│   ├── ResourceSystem.js     # Multi-resource balancer and listener observer
│   ├── SaveSystem.js         # LocalStorage persistence schema and auto-saving
│   ├── ScoringSystem.js      # 4-dimensional performance evaluation
│   └── TimelineSystem.js     # 24-hour scheduler and collision detection
├── ui/
│   ├── UIComponents.js       # Reusable buttons, glass panels, HUD bars
│   └── UITheme.js            # Visual design tokens, colors, fonts
└── main.js                   # Phaser 3 instantiation and lifecycle configuration
```

---

### 3. Scene Lifecycle & Transitions
1. `BootScene` loads procedural textures, displays the animated brand shimmers, and fades into `MainMenuScene`.
2. From `MainMenuScene`, the player can navigate to `ScenarioSelectScene`, `ProfileScene`, or `SettingsScene`.
3. Selecting an unlocked scenario initiates the gameplay loop:
   $$\text{StoryIntroScene} \longrightarrow \text{InvestigationScene} \longrightarrow \text{PlanningBoardScene} \longrightarrow \text{DecisionScene} \longrightarrow \text{ConsequenceScene}$$
4. Completing a scenario automatically writes progress, unlocks the next casefile in sequence, and persists high scores.

---

### 4. Persistence Schema (`SaveSystem`)
Save state is stored under key `LIFELINES_24H_SAVE_DATA_V1`:
```json
{
  "version": 1,
  "player": {
    "name": "Analyst",
    "title": "Senior Systems Strategist",
    "createdAt": 1732025000000,
    "lastActive": 1732025500000
  },
  "settings": {
    "volume": 0.7,
    "soundEnabled": true
  },
  "progress": {
    "unlockedScenarios": [1, 2],
    "completedScenarios": [1],
    "scenarioStars": { "1": 3 },
    "scenarioHighScores": { "1": 890 },
    "scenarioEndings": { "1": ["ending_triumph_balance"] }
  },
  "achievements": []
}
```

---

### 5. Automated Verification Test Suite
A headless test script (`tests/engine_test.js`) verifies all 5 scenarios without requiring a browser or canvas context:
- Validates scenario counts, IDs, titles, and task counts.
- Verifies resource initialization and deduction math.
- Checks collision detection on overlapping timeline tasks.
- Simulates story beat transitions and flag accumulation.
- Computes final scoring breakdowns and star allocations.

To run:
```bash
node tests/engine_test.js
```
66/66 test assertions pass automatically.
