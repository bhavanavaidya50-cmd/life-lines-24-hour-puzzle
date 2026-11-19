# LIFE LINES – THE 24-HOUR PUZZLE
> *"Every decision changes the story."*

An original interactive strategy, mystery, and life-simulation puzzle game created with Phaser.js 3, modern JavaScript (ES6), and Vite. Designed primarily for adults aged 30 and above, presenting complex, intelligent everyday human decisions.

---

## 🌟 Key Highlights
- **Zero Generic Arcade / Platformer Elements**: Purely driven by tactical scheduling, document forensics, ethical dilemma arbitration, and systemic resource equilibrium.
- **Dynamic 24-Hour Timeline Scheduler**: Interactive chronological grid with hourly slots, strict deadlines, prerequisite dependencies, collision detection, and automated optimization.
- **Deep Investigation & Document Forensics**: Inspect financial wire advice slips, pediatric logs, IT server logs, and confidential memos to unlock hidden choices.
- **Adaptive Consequence Engine**: Decisions alter narrative flags, triggering distinct branching endings per scenario.
- **Holistic Resource Management**: Live HUD tracking Time, Physical Energy, Financial Capital, Psychological Stress, and Social Relationship Rapport.
- **Procedural Ambient Sound Synthesis**: Built with the Web Audio API without relying on third-party copyrighted audio files.
- **Responsive & Touch-Friendly**: Scaled for desktop displays, tablets, and mobile devices in landscape mode.

---

## 🎮 Playable Scenarios

1. **CASEFILE 01: THE UNEXPECTED MONDAY**  
   *Protagonist: Alex Chen (Senior Operations Director & Single Parent)*  
   Balance executive corporate compliance audits with a critically ill child and sudden family hospital emergency.

2. **CASEFILE 02: THE MISSING TRANSACTION**  
   *Protagonist: Maya Rodriguez (Boutique Architecture Firm Founder)*  
   Conduct forensic financial investigation into an unauthorized $12,500 wire before the 15:00 PM bank cutoff.

3. **CASEFILE 03: THE FAMILY SECRET**  
   *Protagonist: Sam Patel (Civil Engineer & Eldest Sibling)*  
   Navigate an aging parent's hidden Alzheimer's diagnosis, disinheritance conflicts, and sibling reconciliation.

4. **CASEFILE 04: THE BUSINESS CRISIS**  
   *Protagonist: Jordan Kim (HealthTech Startup CEO)*  
   Navigate predatory venture capital ultimatums, sensor calibration bugs, and commercial launch in 24 hours.

5. **CASEFILE 05: THE FINAL DECISION**  
   *Protagonist: Robin Okafor (Civic Ombudsman & Mediator)*  
   Synthesize zoning laws, community protests, and developer interests to save an essential neighborhood health pavilion.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd Game

# Install dependencies
npm install

# Start Vite local development server
npm run dev
```
Open your browser to `http://localhost:3000` (or the port specified by Vite).

### Production Build
```bash
npm run build
npm run preview
```

### Running Automated Test Suite
```bash
node tests/engine_test.js
```

---

## 📁 Project Structure

```
├── docs/                      # Architectural & game design documentation
│   ├── GameConcept.md         # Full game concept and target demographic analysis
│   ├── GameMechanics.md       # Mechanics breakdown (timeline, resources, clues)
│   ├── ArtDirection.md        # Typography, color theory, audio design
│   ├── TechnicalDocumentation.md # Architecture, scenes, and systems
│   ├── GameplayGuide.md       # Complete playthrough and strategy guide
│   ├── TestingReport.md       # Quality Assurance and engine test results
│   └── AI_Tools_Used.md       # Acknowledgment of AI tools used
├── public/                    # Static public assets
├── src/
│   ├── audio/                 # Web Audio API procedural sound engine
│   ├── data/                  # Scenario definitions, story beats, and clues
│   ├── scenes/                # Phaser.js scene controllers
│   ├── systems/               # Decoupled core mechanics (Timeline, Clue, Resource, etc.)
│   ├── ui/                    # UI theme and reusable components
│   └── main.js                # Game bootstrapper
├── tests/                     # Headless verification scripts
├── index.html                 # Widescreen HTML5 container
└── package.json               # Dependencies and build scripts
```

---

## 📄 License
MIT License. Created for the game development assignment.
