/**
 * Scoring & Performance Evaluation System
 * Evaluates decisions thoroughly, prioritizing insight, integrity, foresight,
 * and balanced resource preservation over raw speed.
 */

export class ScoringSystem {
  static evaluateScenario({
    scenarioConfig,
    timelineSystem,
    clueSystem,
    resourceSystem,
    decisionSystem,
    ending
  }) {
    let score = 0;
    const breakdown = [];

    // 1. Investigation Thoroughness (Max 250 pts)
    const clueStats = clueSystem.getDiscoveryProgress();
    const clueScore = Math.round((clueStats.percentage / 100) * 250);
    score += clueScore;
    breakdown.push({
      category: 'Investigative Insight',
      points: clueScore,
      max: 250,
      description: `Discovered ${clueStats.discovered} of ${clueStats.total} key facts and documents (${clueStats.percentage}%)`
    });

    // 2. Timeline Planning Efficiency & Deadline Compliance (Max 300 pts)
    const validation = timelineSystem.validateFullSchedule(scenarioConfig.mandatoryTasks || []);
    let timelineScore = 300;
    if (!validation.isValid) {
      timelineScore = Math.max(50, 300 - (validation.issues.length * 60));
    }
    score += timelineScore;
    breakdown.push({
      category: 'Chronological Precision',
      points: timelineScore,
      max: 300,
      description: validation.isValid 
        ? 'Flawless 24-hour itinerary with zero deadline misses or schedule overlaps' 
        : `Experienced ${validation.issues.length} scheduling frictions or missed commitments`
    });

    // 3. Equilibrium & Resource Health (Max 250 pts)
    const res = resourceSystem.getSnapshot();
    const stressPenalty = Math.max(0, res.stress - 30) * 2; // stress above 30 penalizes
    const energyBonus = (res.energy / 100) * 80;
    const avgRel = resourceSystem.getAverageRelationship();
    const relBonus = (avgRel / 100) * 120;
    const financialSanity = res.money >= 0 ? 50 : 0;
    const healthScore = Math.max(40, Math.min(250, Math.round(energyBonus + relBonus + financialSanity - stressPenalty)));
    score += healthScore;
    breakdown.push({
      category: 'Psychological & Social Equilibrium',
      points: healthScore,
      max: 250,
      description: `Maintained ${res.energy}% Energy, ${res.stress}% Stress, and ${avgRel}% Relationship Rapport`
    });

    // 4. Narrative Outcome & Moral Integrity (Max 200 pts)
    const endingScore = ending.baseScore || 150;
    score += endingScore;
    breakdown.push({
      category: 'Narrative Resolution',
      points: endingScore,
      max: 200,
      description: `Concluded with: ${ending.title} (${ending.quality || 'Satisfactory'})`
    });

    // Determine Star Rating (1 to 3 stars)
    let stars = 1;
    if (score >= 820) {
      stars = 3;
    } else if (score >= 620) {
      stars = 2;
    }

    return {
      totalScore: score,
      maxScore: 1000,
      stars,
      breakdown,
      ratingLabel: stars === 3 ? 'Master Strategist' : (stars === 2 ? 'Astute Problem-Solver' : 'Hard-Fought Resolution')
    };
  }
}
