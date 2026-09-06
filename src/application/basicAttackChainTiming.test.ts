import { describe, expect, it } from 'vitest';
import type { OperatorDefinition } from '../core/game-data/operatorDefinition';
import { createEmptyScenario } from '../core/project/createProject';
import { lifeng, perlica } from '../data/operators';
import { gameDataRepository } from '../data/gameDataRepository';
import { skillSettings } from '../data/combat/skillSettings';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';

const service = new ScenarioSimulationService({
  index: gameDataRepository,
  spellInflictionSettings: skillSettings,
  resources: {
    sharedSpGain: { baseGainEfficiency: 1 },
    spRecoveryPauseDuration: 1.5,
    ultimateEnergySystemUnlocked: true,
    normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
  },
});

function createChain(operator: OperatorDefinition) {
  const scenario = createEmptyScenario(`chain:${operator.slug}`, '正式模拟普攻接续边界');
  scenario.battle.durationFrames = 240;
  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  let id = 0;
  // 仅复用技能库的顺序及稳定身份；所有候选时刻均在下方重新指定。
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator,
    skillGroupKey: 'basicAttack',
    startFrame: 1,
    ids: { allocate: () => `cast:${id++}` },
  }).scenario;
}

describe('generated basic attack chain input timing', () => {
  it.each([
    { operator: perlica, expected: [1, 18, 37, 64] },
    { operator: lifeng, expected: [1, 28, 48, 68] },
  ])(
    '$operator.slug finds the earliest legal input from actual simulation',
    async ({ operator, expected }) => {
      const scenario = createChain(operator);
      const originalCasts = structuredClone(scenario.tracks[0]!.skillCasts);
      const starts = [1];
      for (let index = 1; index < originalCasts.length; index++) {
        let found = false;
        // 不读 timelineBlockFrames 或展示边界，也不借助无限推迟规避失败。
        // 每一帧重放完整前缀，确保前段实际命中产生的停帧仍参与判断。
        for (let frame = starts[index - 1]! + 1; frame < 200; frame++) {
          scenario.tracks[0]!.skillCasts = structuredClone(originalCasts.slice(0, index + 1));
          scenario.tracks[0]!.skillCasts.forEach((cast, castIndex) => {
            cast.placement.startFrame = castIndex === index ? frame : starts[castIndex]!;
          });
          const run = await service.simulate(scenario, 240);
          const candidateDiagnostics = run.availabilityDiagnostics.filter(d => d.frame === frame);
          if (candidateDiagnostics.some(d => d.reasons.includes('skillInterruptUnavailable')))
            continue;
          // 不能把身份不匹配或未知条件当成已找到合法接续。
          expect(run.availabilityDiagnostics).toEqual([]);
          starts.push(frame);
          found = true;
          break;
        }
        expect(found, `${operator.slug} stage ${index + 1} had no legal candidate`).toBe(true);
      }
      expect(starts).toEqual(expected);

      // 每个已确认边界提前一帧仍必须报错，不能通过取消校验达成连段。
      for (let index = 1; index < originalCasts.length; index++) {
        scenario.tracks[0]!.skillCasts = structuredClone(originalCasts.slice(0, index + 1));
        scenario.tracks[0]!.skillCasts.forEach((cast, castIndex) => {
          cast.placement.startFrame = starts[castIndex]! - (castIndex === index ? 1 : 0);
        });
        const run = await service.simulate(scenario, 240);
        expect(run.availabilityDiagnostics).toContainEqual(
          expect.objectContaining({
            frame: starts[index]! - 1,
            skillId: `basicAttack${index + 1}`,
            reasons: expect.arrayContaining(['skillInterruptUnavailable']),
          }),
        );
      }

      scenario.tracks[0]!.skillCasts = structuredClone(originalCasts);
      scenario.tracks[0]!.skillCasts.forEach((cast, index) => {
        cast.placement.startFrame = starts[index]!;
      });
      const run = await service.simulate(scenario, 240);
      expect(run.availabilityDiagnostics).toEqual([]);
      if (operator.slug === lifeng.slug) {
        const ownerStops = run.receiptEntries
          .filter(
            entry =>
              entry.event === 'TimeDilationStarted' &&
              entry.targetId === 'track:0' &&
              entry.data?.slot === 'TimeDilation/Layer/Entity/HitStop',
          )
          .map(entry => ({
            frame: entry.frame,
            skill: entry.data?.sourceActionId,
            duration: entry.data?.durationSeconds,
          }));
        expect(ownerStops).toEqual([
          { frame: 10, skill: 'basicAttack1', duration: 0.067 },
          { frame: 19, skill: 'basicAttack1', duration: 0.067 },
          { frame: 32, skill: 'basicAttack2', duration: 0.1 },
          { frame: 59, skill: 'basicAttack3', duration: 0.167 },
          { frame: 92, skill: 'basicAttack4', duration: 0.3 },
        ]);
      }
    },
  );
});
