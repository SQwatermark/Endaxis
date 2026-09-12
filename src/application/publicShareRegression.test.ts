import { expect, it } from 'vitest';
import { createLowStarShareRegressionScenario } from './publicShareRegressionFixture';
import { ScenarioSimulationService } from './scenarioSimulationService';
import { gameDataRepository } from '../data/gameDataRepository';
import { skillSettings } from '../data/combat/skillSettings';
import { projectBuffTimelineViz } from '../core/projection/buffTimelineViz';
import { projectEnemyEffectViz } from '../core/projection/enemyEffectViz';
import { findBuffDamageSegment } from '../ui/timeline/enemyBuffDamageHits';

it('does not quantize through legacy millisecond-rounded display times', () => {
  const { quantization } = createLowStarShareRegressionScenario();
  // Actual output of upstream 4dadc55f compileTimeline for source 623 / 60 is 10.383s.
  // Rounding that display value again would incorrectly choose frame 311 instead of 312.
  expect(quantization.find(row => row.sourceFrame === 623)?.frame).toBe(312);
  expect(Math.round(10.383 * 30)).toBe(311);
  expect(quantization.find(row => row.sourceFrame === 943)?.frame).toBe(472);
  expect(quantization.find(row => row.sourceFrame === 965)?.frame).toBe(483);
});

it('runs the public low-star action sequence with native definitions without rewriting placements', async () => {
  const { scenario, quantization } = createLowStarShareRegressionScenario();
  expect(quantization).toHaveLength(35);
  expect(quantization.filter(row => row.errorSeconds !== 0)).toHaveLength(9);
  expect(quantization.every(row => Math.abs(row.errorSeconds) <= 1 / 60 + 1e-12)).toBe(true);
  const before = JSON.stringify(scenario);
  const run = await new ScenarioSimulationService({
    index: gameDataRepository,
    spellInflictionSettings: skillSettings,
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
    },
  }).simulate(scenario, scenario.battle.durationFrames);
  expect(JSON.stringify(scenario)).toBe(before);
  expect(run.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
  const segments = projectBuffTimelineViz(run.receiptEntries, run.frame);
  const hits = projectEnemyEffectViz(run.receiptEntries, run.frame).damageHits ?? [];
  expect(hits.length).toBeGreaterThan(0);
  for (const hit of hits)
    expect(findBuffDamageSegment(hit, segments), JSON.stringify(hit)).toBeDefined();
  expect(segments.some(segment => segment.buffId === 'buff_common_cryst_fire_triggered')).toBe(
    true,
  );
  // The test configuration deliberately differs from the author's loadout. Warnings are allowed;
  // they must not erase placements or force the editor to "repair" this imported action pattern.
  expect(scenario.tracks.flatMap(track => track?.skillCasts ?? [])).toHaveLength(35);
});
