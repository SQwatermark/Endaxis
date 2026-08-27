import { describe, expect, it } from 'vitest';
import fixture from './fixtures/avywenna-pulse-check-buff.json';
import vulnerableCarriers from './fixtures/avywenna-vulnerable-buffs.json';
import vulnerableChildren from './fixtures/avywenna-vulnerable-children.json';
import { compileStandardStumpBuffClosure } from '../src/compiler/standardStumpBuffClosure.ts';
import type {
  OperatorDefinition,
  SkillBuffDefinition,
} from '../../../src/next/core/game-data/operatorDefinition';
import { validateActionSequenceDefinition } from '../../../src/next/core/game-data/validateSkillDefinition';
import { ScenarioSimulationService } from '../../../src/next/application/scenarioSimulationService';
import { createEmptyScenario } from '../../../src/next/core/project/createProject';
import { placeSkillGroup } from '../../../src/next/ui/timeline/placeSkillGroup';
import { avywenna } from '../../../src/next/data/operators/avywenna';
import { skillSettings } from '../../../src/next/data/combat/skillSettings';
import { COMBAT_FRAMES_PER_SECOND } from '../../../src/next/core/combat/runtime/combatClock';

const id = 'buff_chr_0012_avywen_lance_pulse_check';

describe('艾维文娜原始 Buff → 公共编译 → 生产模拟', () => {
  it('保留自身层数守卫和 Owner，首次附着、Unique 防重与到期后重施均执行', async () => {
    const closure = compileStandardStumpBuffClosure([id], fixture);
    expect(closure.diagnostics).toEqual([]);
    const definition = closure.definitions[id]!;
    expect(definition.lifecycleSequences?.start?.steps).toEqual([
      {
        kind: 'conditional',
        parameters: {
          condition: {
            kind: 'buffIdStackCompare',
            target: 'buffOwner',
            buffIds: [id],
            operator: 'lessOrEqual',
            value: { kind: 'constant', value: 0 },
          },
        },
        whenTrue: {
          steps: [
            {
              kind: 'applyElementalInfliction',
              parameters: {
                element: 'electric',
                isExtra: false,
                target: 'buffOwner',
              },
            },
          ],
        },
      },
    ]);
    const apply = {
      kind: 'applyBuff' as const,
      parameters: { buffId: id, target: 'enemy' as const, inheritSourceSkillCastInfo: true },
    };
    expect(
      validateActionSequenceDefinition({
        steps: [{ ...apply, parameters: { ...apply.parameters, definition } }],
      }),
    ).toEqual([]);
    // 只用探针主动技能安排两次同帧施加、冷却内重施、到期后重施；Buff 行为完全来自原始 JSON。
    const operator: OperatorDefinition = {
      ...avywenna,
      buffDefinitions: { ...avywenna.buffDefinitions, [id]: definition as SkillBuffDefinition },
      talents: [],
      potentials: [],
      skillGroups: [
        {
          key: 'battleSkill',
          skillType: 'battleSkill',
          levelSource: 'battleSkill',
          skills: {
            key: 'buffProbe',
            costs: [],
            timelineBlockFrames: 40,
            scheduledSequences: [0, 0, 5, 30].map(startFrame => ({
              startFrame,
              sequence: { steps: [apply] },
            })),
          },
        },
      ],
    };
    const result = await simulateBuffProbe(operator);
    const inflictions = result.receiptEntries.filter(
      entry => entry.event === 'ElementalInflictionApplied',
    );
    expect(inflictions).toHaveLength(2);
    // 第 1 帧执行起始项并进入首 tick；相对第 30 帧的后续项在实际第 30 帧到达。
    expect(inflictions.map(entry => entry.frame)).toEqual([1, 30]);
    for (const entry of inflictions)
      expect(entry).toMatchObject({
        sourceId: 'track:buff',
        targetId: 'enemy',
        data: { requestedElement: 'electric' },
      });
    expect(inflictions.map(entry => entry.data?.outcomeKind)).toEqual(['attachmentOnly', 'burst']);
  });

  it('从终结技根 Buff 自动闭合易伤四链，生产伤害在生效时增加、到期后恢复', async () => {
    const root = 'buff_chr_0012_avywen_ultimate_skill_debuff';
    const carrier = 'buff_common_affixes_vulnerable_pulse';
    const child = 'buff_common_affixes_vulnerable_pulse_default_child';
    const expiryFrame = 10 + 10 * COMBAT_FRAMES_PER_SECOND;
    const closure = compileStandardStumpBuffClosure([root], {
      ...vulnerableCarriers,
      ...vulnerableChildren,
    });
    expect(closure.sources.size).toBe(4);
    expect(closure.diagnostics.every(item => item.status === 'scenario-omitted')).toBe(true);
    expect(Object.keys(closure.definitions).sort()).toEqual([root, carrier, child].sort());
    // 技能只是安排观测时点，Buff 动作、默认十秒寿命和 0.3 易伤均取原始数据，未用旧定义兜底。
    const operator: OperatorDefinition = {
      ...avywenna,
      buffDefinitions: closure.definitions as Record<string, SkillBuffDefinition>,
      talents: [],
      potentials: [],
      skillGroups: [
        {
          key: 'battleSkill',
          skillType: 'battleSkill',
          levelSource: 'battleSkill',
          skills: {
            key: 'buffProbe',
            costs: [],
            timelineBlockFrames: expiryFrame + 30,
            scheduledSequences: [
              ...[0, 20, expiryFrame + 20].map(startFrame => ({
                startFrame,
                sequence: {
                  steps: [
                    {
                      kind: 'dealDamage' as const,
                      parameters: {
                        damageType: 'electric' as const,
                        attackScale: 1,
                        tags: [],
                        features: [],
                      },
                    },
                  ],
                },
              })),
              {
                startFrame: 10,
                sequence: {
                  steps: [
                    {
                      kind: 'applyBuff',
                      parameters: {
                        buffId: root,
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
    const result = await simulateBuffProbe(operator, expiryFrame + 50);
    const hits = result.receiptEntries.filter(entry => entry.event === 'DamageApplied');
    expect(hits).toHaveLength(3);
    const damages = hits.map(hit => hit.data!.value as number);
    expect(damages[0]).toBeGreaterThan(0);
    expect(damages[1]! / damages[0]!).toBeCloseTo(1.3, 5);
    expect(damages[2]).toBeCloseTo(damages[0]!, 5);
    const added = result.receiptEntries.filter(entry => entry.event === 'BuffApplied');
    expect(added.map(entry => entry.data!.buffId)).toEqual([child, carrier, root]);
    expect(added.map(entry => entry.sourceId)).toEqual(['enemy', 'track:buff', 'track:buff']);
    expect(added.every(entry => entry.targetId === 'enemy' && entry.frame === 10)).toBe(true);
    const finished = result.receiptEntries.filter(entry => entry.event === 'BuffFinished');
    expect(finished.map(entry => entry.data!.buffId).sort()).toEqual([root, carrier, child].sort());
    expect(finished.map(entry => ({ id: entry.data!.buffId, frame: entry.frame }))).toEqual([
      { id: child, frame: expiryFrame },
      { id: carrier, frame: expiryFrame },
      { id: root, frame: expiryFrame },
    ]);
  });

  it.each(['Target', 'Source'])('未证明的 Buff 目标 %s 继续阻塞', targetSource => {
    const changed = structuredClone(fixture);
    const action = changed[id].buffEventAction[0]!.actions[0]!.actionData[1]!;
    action.target!.targetSource = targetSource;
    const closure = compileStandardStumpBuffClosure([id], changed);
    expect(closure.definitions[id]).toBeUndefined();
    expect(closure.diagnostics).toEqual([
      expect.objectContaining({
        status: 'blocked',
        reason: expect.stringContaining('unsupported elemental infliction source/target'),
      }),
    ]);
  });
});

async function simulateBuffProbe(operator: OperatorDefinition, durationFrames = 90) {
  let scenario = createEmptyScenario('buff-closure-test', '原始 Buff 回归');
  scenario.battle.durationFrames = durationFrames;
  scenario.tracks[0] = {
    id: 'track:buff',
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
    initialState: { ultimateEnergy: 0, maxUltimateEnergyOverride: 90 },
    skillCasts: [],
  };
  let nextId = 0;
  scenario = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:buff:${nextId++}` },
  }).scenario;
  return new ScenarioSimulationService({
    index: {
      getOperator: slug => (slug === operator.slug ? operator : null),
      getWeapon: () => null,
      getGear: () => null,
      getGearSet: () => null,
    },
    repositoryRevision: 'raw-avywenna-buff',
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
    },
    spellInflictionSettings: skillSettings,
  }).simulate(scenario, durationFrames);
}
