import { TimelineSystem } from '../src/systems/TimelineSystem.js';
import { ClueSystem } from '../src/systems/ClueSystem.js';
import { ResourceSystem } from '../src/systems/ResourceSystem.js';
import { DecisionSystem } from '../src/systems/DecisionSystem.js';
import { ScoringSystem } from '../src/systems/ScoringSystem.js';
import { SCENARIOS } from '../src/data/scenarios.js';

console.log('--- RUNNING LIFE LINES HEADLESS ENGINE VERIFICATION ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
}

// 1. Verify all 5 scenarios exist
assert(SCENARIOS.length === 5, '5 playable scenarios are loaded');

SCENARIOS.forEach((scenario, idx) => {
  const num = idx + 1;
  assert(scenario.id === num, `Scenario ${num} has correct id`);
  assert(scenario.title && scenario.title.length > 0, `Scenario ${num} has title "${scenario.title}"`);
  assert(scenario.clues && scenario.clues.length >= 3, `Scenario ${num} has at least 3 clues`);
  assert(scenario.tasks && scenario.tasks.length >= 4, `Scenario ${num} has at least 4 tasks`);
  assert(scenario.storyBeats && scenario.storyBeats.length >= 2, `Scenario ${num} has story beats`);
  assert(scenario.endings && scenario.endings.length >= 3, `Scenario ${num} has at least 3 endings`);

  // Test Resource System
  const resources = new ResourceSystem(scenario.initialResources);
  const snap1 = resources.getSnapshot();
  assert(snap1.energy > 0, `Scenario ${num} initial energy is positive`);
  resources.modify({ energy: -10, stress: 5 });
  const snap2 = resources.getSnapshot();
  assert(snap2.energy === snap1.energy - 10, `Scenario ${num} resource deductions compute correctly`);

  // Test Timeline System
  const timeline = new TimelineSystem(6, 24);
  const task1 = scenario.tasks[0];
  const schedRes = timeline.scheduleTask(task1, 8);
  assert(schedRes.success, `Scenario ${num} can schedule task 1 at 8am`);

  // Test Overlap prevention
  const task2 = scenario.tasks[1];
  const overlapRes = timeline.scheduleTask(task2, 8); // same time
  assert(!overlapRes.success, `Scenario ${num} successfully detects and prevents scheduling overlap`);

  // Test Decision System & Ending resolution
  const decisionSys = new DecisionSystem(scenario.storyBeats);
  const clueSys = new ClueSystem(scenario.clues);
  
  while (decisionSys.getCurrentBeat()) {
    decisionSys.chooseOption(0, clueSys, resources);
  }
  const ending = decisionSys.determineEnding(scenario.endings, resources);
  assert(ending && ending.title, `Scenario ${num} successfully resolves to ending: "${ending.title}"`);

  // Test Scoring System
  const scoreResult = ScoringSystem.evaluateScenario({
    scenarioConfig: scenario,
    timelineSystem: timeline,
    clueSystem: clueSys,
    resourceSystem: resources,
    decisionSystem: decisionSys,
    ending
  });
  assert(scoreResult.totalScore > 0 && scoreResult.totalScore <= 1000, `Scenario ${num} scoring evaluates to ${scoreResult.totalScore} pts`);
  assert(scoreResult.stars >= 1 && scoreResult.stars <= 3, `Scenario ${num} awarded ${scoreResult.stars} stars`);
});

console.log(`\nALL TESTS PASSED: ${passedTests}/${totalTests} checks verified!`);
