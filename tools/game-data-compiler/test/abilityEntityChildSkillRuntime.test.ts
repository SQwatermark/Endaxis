import { describe, expect, it } from 'vitest';
import fixture from './fixtures/avywenna-entity-child-skills.json';
import { compileAbilityEntityChildSkillSource } from '../src/compiler/abilityEntityChildSkill.ts';
import { makeReturnTargetProjection } from './support/avywennaReturnTargets.ts';
import { avywenna } from '../../../src/next/data/operators/avywenna';
import type {
  ActionSequenceDefinition,
  OperatorDefinition,
} from '../../../src/next/core/game-data/operatorDefinition';
import { ScenarioSimulationService } from '../../../src/next/application/scenarioSimulationService';
import { createEmptyScenario } from '../../../src/next/core/project/createProject';
import { placeSkillGroup } from '../../../src/next/ui/timeline/placeSkillGroup';

const ids = [
  'abilityentity_chr_0012_avywen_combo_skill_lance',
  'abilityentity_chr_0012_avywen_ultimate_skill',
];
const marker = 'buff_chr_0012_avywen_lance_becalled';

describe('原始实体子技能 → 公共编译 → 正式场景模拟', () => {
  it.each([0, 1].flatMap(index => [0, 1].map(potential => ({ index, potential }))))(
    '实体 $index 按来源快照 potential_2=$potential 选择寿命',
    async ({ index, potential }) => {
      const result = await simulate(index, potential, false);
      const spawned = result.receiptEntries.filter(entry => entry.event === 'AbilityEntitySpawned');
      const finished = result.receiptEntries.filter(
        entry => entry.event === 'AbilityEntityFinished',
      );
      expect(spawned).toHaveLength(1);
      expect(finished).toHaveLength(1);
      expect(finished[0]!.targetId).toBe(spawned[0]!.targetId);
      // FinishOwner 先死亡，再由下一次实体 advance 释放，而非同步清除。
      expect(finished[0]!.frame - spawned[0]!.frame).toBe((potential === 0 ? 900 : 1500) + 1);
    },
  );

  it.each([0, 1])('实体 %i 在第 30 帧获得召回标记后跳转并结束', async index => {
    const result = await simulate(index, 1, true);
    const spawned = result.receiptEntries.find(entry => entry.event === 'AbilityEntitySpawned')!;
    const finished = result.receiptEntries.filter(entry => entry.event === 'AbilityEntityFinished');
    expect(finished).toHaveLength(1);
    expect(finished[0]!.frame).toBeGreaterThan(spawned.frame + 30);
    expect(finished[0]!.frame).toBeLessThanOrEqual(spawned.frame + 33);
    expect(finished[0]!.targetId).toBe(spawned.targetId);
  });
});

async function simulate(index: number, potential: number, recall: boolean) {
  const sample = fixture.sources[index]!;
  const id = ids[index]!;
  // 探针只控制生成和召回时点；被测子技能、召回查询均由原始数据编译。
  const operator: OperatorDefinition = {
    ...avywenna,
    talents: [],
    potentials: [],
    abilityEntityDefinitions: {
      [id]: {
        ...avywenna.abilityEntityDefinitions![id]!,
        childSkill: compileAbilityEntityChildSkillSource(sample.value, sample.file),
      },
    },
    buffDefinitions: { [marker]: avywenna.buffDefinitions![marker]! },
    skillGroups: [
      {
        key: 'battleSkill',
        skillType: 'battleSkill',
        levelSource: 'battleSkill',
        skills: {
          key: 'entityLifecycleProbe',
          skillType: 'battleSkill',
          levelSource: 'battleSkill',
          timelineBlockFrames: 1,
          blackboard: { potential_2: potential },
          scheduledSequences: [
            {
              startFrame: 0,
              sequence: {
                steps: [
                  {
                    kind: 'spawnAbilityEntity',
                    parameters: {
                      abilityEntityId: id,
                      dieWhenSourceDies: false,
                      inheritActionBlackboard: true,
                    },
                  },
                ],
              },
            },
            ...(recall
              ? [
                  {
                    startFrame: 30,
                    sequence: makeReturnTargetProjection(index) as ActionSequenceDefinition,
                  },
                ]
              : []),
          ],
        },
      },
    ],
  };
  const durationFrames = recall ? 90 : 1510;
  let scenario = createEmptyScenario('entity-child', '实体子技能生命周期回归');
  scenario.battle.durationFrames = durationFrames;
  scenario.tracks[0] = {
    id: 'track:entity',
    operator: {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { battleSkill: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0, maxUltimateEnergyOverride: 90 },
    skillCasts: [],
  };
  let serial = 0;
  scenario = placeSkillGroup({
    scenario,
    operator,
    trackIndex: 0,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:entity:${serial++}` },
  }).scenario;
  return new ScenarioSimulationService({
    index: {
      getOperator: slug => (slug === operator.slug ? operator : null),
      getWeapon: () => null,
      getGear: () => null,
      getGearSet: () => null,
    },
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
    },
  }).simulate(scenario, durationFrames);
}
