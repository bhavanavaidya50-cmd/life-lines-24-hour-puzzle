import { SCENARIO_1 } from './scenario1.js';
import { SCENARIO_2 } from './scenario2.js';
import { SCENARIO_3 } from './scenario3.js';
import { SCENARIO_4 } from './scenario4.js';
import { SCENARIO_5 } from './scenario5.js';

export const SCENARIOS = [
  SCENARIO_1,
  SCENARIO_2,
  SCENARIO_3,
  SCENARIO_4,
  SCENARIO_5
];

export function getScenarioById(id) {
  const numericId = Number(id);
  return SCENARIOS.find(s => s.id === numericId) || SCENARIO_1;
}
