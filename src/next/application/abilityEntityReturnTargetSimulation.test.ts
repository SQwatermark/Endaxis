import { describe, expect, it } from 'vitest';
import {
  makeReturnTargetProjection,
  returnTargetFixture,
} from '../../../tools/game-data-compiler/test/support/avywennaReturnTargets.ts';
import { compileActionSequence } from '../core/compiler/compileSkill';
import type {
  ActionSequenceDefinition,
  CombatStepDefinition,
  OperatorDefinition,
} from '../core/game-data/operatorDefinition';
import { validateActionSequenceDefinition } from '../core/game-data/validateSkillDefinition';
import { LogicalAbilityEntityRuntime } from '../core/combat/runtime/logicalAbilityEntityRuntime';
import { AbilityEntityOperationExecutor } from '../core/combat/runtime/abilityEntityOperationExecutor';
import {
  BuffOperationExecutor,
  type BuffAppliedEvent,
} from '../core/combat/runtime/buffOperationExecutor';
import { BuffDefinitionOperationTarget } from '../core/combat/runtime/buffDefinitionOperationTarget';
import { ActionBlackboardOperationExecutor } from '../core/combat/runtime/actionBlackboardOperationExecutor';
import { CombatActionSequenceRuntime } from '../core/combat/runtime/combatActionSequenceRuntime';
import { ActionBlackboard } from '../core/combat/runtime/actionBlackboard';
import { RuntimeTargetContext } from '../core/combat/runtime/runtimeTargetContext';
import { CombatBuffContainer } from '../core/combat/buffs/combatBuffs';
import { CombatAttributeSet } from '../core/combat/attributes/combatAttributes';
import { createEmptyScenario } from '../core/project/createProject';
import type { TrackDocument } from '../core/project/schema';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';

const marker = 'buff_chr_0012_avywen_lance_becalled';
const combo = 'abilityentity_chr_0012_avywen_combo_skill_lance';
const ultimate = 'abilityentity_chr_0012_avywen_ultimate_skill';

// 真实目录/动作/黑板/Buff 容器联合测试；不把测试生成的实体与无副作用标记定义当成完整干员转换。
function fixture() {
  const entities = new LogicalAbilityEntityRuntime({});
  const targets = new Map<number, BuffDefinitionOperationTarget<string>>();
  const events: BuffAppliedEvent[] = [];
  const spawn = (id: string, ownerId = 'owner', sourceSkillCastId = 1) => {
    const ref = entities.spawn({
      abilityEntityId: id,
      ownerId,
      sourceSkillCastId,
      source: { kind: 'operator', operatorId: ownerId },
      definition: { lifetime: { kind: 'infinite' } },
    });
    if (ref.kind !== 'abilityEntity') throw new Error();
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer(`abilityEntity:${ref.instanceId}`, new CombatAttributeSet<string>()),
      {
        get: id => (id === marker ? { id, stackingType: 'unique', durationSeconds: 2 } : undefined),
      },
      ref,
      undefined,
      event => events.push(event),
    );
    targets.set(ref.instanceId, target);
    return { ref, target };
  };
  const targetContext = new RuntimeTargetContext();
  const blackboard = new ActionBlackboard({ lance_count: 0 });
  const context = {
    blackboard,
    targetContext,
    skillCastInfo: {
      skillCastId: 99,
      originSkillId: 'return',
      originSkillType: 'battleSkill' as const,
      nonReturnedSpCost: 0,
    },
  };
  const operations = new ActionBlackboardOperationExecutor(
    new AbilityEntityOperationExecutor(
      'owner',
      entities,
      new BuffOperationExecutor({
        sourceId: 'owner',
        resolveTarget: () => {
          throw new Error('must not apply return marker to enemy/caster');
        },
        resolveCurrentAbilityEntityTarget: ref => {
          if (ref.kind !== 'abilityEntity' || !entities.isActive(ref))
            throw new Error('missing entity');
          return targets.get(ref.instanceId)!;
        },
        delegate: {
          execute: step => {
            throw new Error(`unhandled ${step.kind}`);
          },
          evaluate: condition => {
            throw new Error(`unhandled ${condition.kind}`);
          },
        },
      }),
    ),
  );
  const run = (index: number, raw?: unknown) => {
    const projected: unknown = makeReturnTargetProjection(index, raw);
    expect(validateActionSequenceDefinition(projected)).toEqual([]);
    return new CombatActionSequenceRuntime(operations, context)
      .createSequence(compileActionSequence(projected as ActionSequenceDefinition, 1))
      .executeInstant({});
  };
  return { spawn, entities, events, run, targetContext, blackboard };
}

describe('回收标记作用于真实枪实例，而非木桩', () => {
  it.each([0, 1].flatMap(index => [0, 3].map(count => ({ index, count }))))(
    '正式排轴/场景装配：类型 $index，己方 $count 把；队友同类枪不获得标记',
    async ({ index, count }) => {
      const base = nextGameDataRepository.getOperator('avywenna')!;
      const id = index === 0 ? combo : ultimate;
      const other = index === 0 ? ultimate : combo;
      const group = index === 0 ? 'ComboLances' : 'UltiLances';
      const spawn: CombatStepDefinition[] = [...Array<string>(count).fill(id), other].map(
        abilityEntityId => ({
          kind: 'spawnAbilityEntity',
          parameters: { abilityEntityId, dieWhenSourceDies: false },
        }),
      );
      const projected: unknown = makeReturnTargetProjection(index);
      expect(validateActionSequenceDefinition(projected)).toEqual([]);
      // 额外 100 固定伤害是测试探针：仅在实际枪 Buff 容器中读到标记时执行；不是原技能伤害。
      const probe: CombatStepDefinition = {
        kind: 'forEachContextTarget',
        parameters: { contextKey: group },
        body: {
          steps: [
            {
              kind: 'conditional',
              parameters: {
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'currentAbilityEntity',
                  buffIds: [marker],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              },
              whenTrue: {
                steps: [
                  {
                    kind: 'dealFixedDamage',
                    parameters: { damageType: 'true', value: 100, tags: [] },
                  },
                ],
              },
            },
          ],
        },
      };
      const operator: OperatorDefinition = {
        ...base,
        talents: [],
        potentials: [],
        abilityEntityDefinitions: Object.fromEntries(
          [combo, ultimate].map(key => [
            key,
            {
              lifetime: { kind: 'limited', durationSeconds: 10 },
            },
          ]),
        ),
        buffDefinitions: { [marker]: base.buffDefinitions![marker]! },
        comboSkillConditions: [],
        skillGroups: [
          {
            key: 'comboSkill',
            skillType: 'comboSkill',
            levelSource: 'comboSkill',
            skills: {
              key: 'spawnTest',
              skillType: 'comboSkill',
              levelSource: 'comboSkill',
              timelineBlockFrames: 1,
              scheduledSequences: [{ startFrame: 0, sequence: { steps: spawn } }],
            },
          },
          {
            key: 'battleSkill',
            skillType: 'battleSkill',
            levelSource: 'battleSkill',
            skills: {
              key: 'returnTest',
              skillType: 'battleSkill',
              levelSource: 'battleSkill',
              timelineBlockFrames: 1,
              blackboard: { lance_count: 0 },
              scheduledSequences: [
                {
                  startFrame: 0,
                  sequence: {
                    steps: [...(projected as ActionSequenceDefinition).steps, probe],
                  },
                },
              ],
            },
          },
        ],
      };
      let scenario = createEmptyScenario('return-targets', '回收目标联合测试');
      scenario.battle.durationFrames = 90;
      scenario.enemy.editable.hp = 1e9;
      const track: TrackDocument = {
        id: 'track:return-owner',
        operator: {
          operatorSlug: operator.slug,
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: { battleSkill: 12, comboSkill: 12 },
          talentStates: {},
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0, maxUltimateEnergyOverride: 1000 },
        skillCasts: [],
      };
      scenario.tracks[0] = track;
      scenario.tracks[1] = { ...structuredClone(track), id: 'track:return-teammate' };
      let serial = 0;
      for (const trackIndex of [0, 1] as const)
        scenario = placeSkillGroup({
          scenario,
          operator,
          trackIndex,
          skillGroupKey: 'comboSkill',
          startFrame: 1,
          ids: { allocate: kind => `${kind}:spawn:${serial++}` },
        }).scenario;
      scenario = placeSkillGroup({
        scenario,
        operator,
        trackIndex: 0,
        skillGroupKey: 'battleSkill',
        startFrame: 31,
        ids: { allocate: kind => `${kind}:return:${serial++}` },
      }).scenario;
      const result = await new ScenarioSimulationService({
        index: {
          ...nextGameDataRepository,
          getOperator: slug =>
            slug === operator.slug ? operator : nextGameDataRepository.getOperator(slug),
        },
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      }).simulate(scenario, 90);
      expect(
        result.receiptEntries.filter(entry => entry.event === 'AbilityEntitySpawned'),
      ).toHaveLength((count + 1) * 2);
      const hits = result.receiptEntries.filter(entry => entry.event === 'DamageApplied');
      expect(hits).toHaveLength(count);
      expect(hits.every(hit => hit.sourceId === track.id)).toBe(true);
      expect(
        result.receiptEntries.filter(
          entry =>
            entry.event === 'BuffApplied' &&
            entry.data?.buffId === marker &&
            ['enemy', track.id, 'track:return-teammate'].includes(entry.targetId ?? ''),
        ),
      ).toEqual([]);
    },
  );

  it.each([0, 1, 3])('查询 %i 把自己的连携枪，保持生成顺序；排除队友和另一模板', count => {
    const f = fixture();
    const excluded = f.spawn(combo, 'teammate');
    const ownUltimate = f.spawn(ultimate);
    const own = Array.from({ length: count }, () => f.spawn(combo));
    expect(f.run(0)).toBe(count > 0);
    expect(f.targetContext.get('ComboLances')).toEqual(own.map(item => item.ref));
    expect(f.events.map(event => event.targetId)).toEqual(own.map(item => item.target.ownerId));
    expect(excluded.target.getCountByIds([marker])).toBe(0);
    expect(ownUltimate.target.getCountByIds([marker])).toBe(0);
    expect(f.blackboard.getNumber('lance_count')).toBe(count > 0 ? 1 : 0);
    for (const event of f.events) {
      expect(event.sourceId).toBe('owner');
      expect(event.skillCastInfo?.skillCastId).toBe(99); // return cast, not old spawn cast
    }
    expect(f.run(1)).toBe(true);
    expect(ownUltimate.target.getCountByIds([marker])).toBe(1);
  });

  it('重复查询不制造实体，重复施加按 Buff 唯一性合并', () => {
    const f = fixture();
    const gun = f.spawn(combo);
    f.run(0);
    f.run(0);
    expect(f.entities.activeCount).toBe(1);
    expect(gun.target.getCountByIds([marker])).toBe(1);
    expect(f.events).toHaveLength(1); // Unique rejects the second application; not a one-shot launch filter
  });

  it('真实子技能收到 called Buff 后跳到 1500，死亡同帧可见并在下一帧释放', async () => {
    const base = nextGameDataRepository.getOperator('avywenna')!;
    const projected = makeReturnTargetProjection(0) as ActionSequenceDefinition;
    const definition = base.abilityEntityDefinitions?.[combo];
    if (definition?.childSkill === undefined)
      throw new Error('missing generated combo lance child');
    const operator: OperatorDefinition = {
      ...base,
      talents: [],
      potentials: [],
      abilityEntityDefinitions: { [combo]: definition },
      buffDefinitions: { [marker]: base.buffDefinitions![marker]! },
      comboSkillConditions: [],
      skillGroups: [
        {
          key: 'comboSkill',
          skillType: 'comboSkill',
          levelSource: 'comboSkill',
          skills: {
            key: 'spawnRealChild',
            skillType: 'comboSkill',
            levelSource: 'comboSkill',
            timelineBlockFrames: 1,
            scheduledSequences: [
              {
                startFrame: 0,
                sequence: {
                  steps: [
                    {
                      kind: 'spawnAbilityEntity',
                      parameters: { abilityEntityId: combo, dieWhenSourceDies: false },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          key: 'battleSkill',
          skillType: 'battleSkill',
          levelSource: 'battleSkill',
          skills: {
            key: 'returnRealChild',
            skillType: 'battleSkill',
            levelSource: 'battleSkill',
            timelineBlockFrames: 1,
            blackboard: { lance_count: 0 },
            scheduledSequences: [{ startFrame: 0, sequence: projected }],
          },
        },
      ],
    };
    let scenario = createEmptyScenario('return-child-lifecycle', '真实回收枪子技能生命周期');
    scenario.battle.durationFrames = 50;
    const track: TrackDocument = {
      id: 'track:return-child',
      operator: {
        operatorSlug: operator.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { battleSkill: 12, comboSkill: 12 },
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0, maxUltimateEnergyOverride: 1000 },
      skillCasts: [],
    };
    scenario.tracks[0] = track;
    let serial = 0;
    for (const [skillGroupKey, startFrame] of [
      ['comboSkill', 1],
      ['battleSkill', 31],
    ] as const) {
      scenario = placeSkillGroup({
        scenario,
        operator,
        trackIndex: 0,
        skillGroupKey,
        startFrame,
        ids: { allocate: kind => `${kind}:return-child:${serial++}` },
      }).scenario;
    }
    const result = await new ScenarioSimulationService({
      index: {
        ...nextGameDataRepository,
        getOperator: slug =>
          slug === operator.slug ? operator : nextGameDataRepository.getOperator(slug),
      },
      resources: {
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecoveryPauseDuration: 1.5,
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
      },
    }).simulate(scenario, 50);

    expect(
      result.receiptEntries.filter(entry => entry.event === 'AbilityEntitySpawned'),
    ).toHaveLength(1);
    expect(result.receiptEntries.filter(entry => entry.event === 'AbilityEntityFinished')).toEqual([
      expect.objectContaining({
        sourceId: track.id,
        data: expect.objectContaining({ abilityEntityId: combo, reason: 'explicit' }),
      }),
    ]);
  });

  it('明确同施法验证器只保留对应实例，不能把静态候选当作查询结果', () => {
    const f = fixture();
    const old = f.spawn(combo, 'owner', 1);
    const current = f.spawn(combo, 'owner', 99);
    const raw = structuredClone(returnTargetFixture.timelines[0]!.sequence);
    const find = raw.actionData[0] as { selectorData: { validatorData: unknown[] } };
    find.selectorData.validatorData.push({
      $type: 'Beyond.Gameplay.Core.Selector+SkillCastIdValidator+Data, Gameplay.Beyond',
    });
    expect(f.run(0, raw)).toBe(true);
    expect(f.targetContext.get('ComboLances')).toEqual([current.ref]);
    expect(old.target.getCountByIds([marker])).toBe(0);
    expect(current.target.getCountByIds([marker])).toBe(1);
  });

  it.each([
    { distance: 0, lessThan: true, expected: 1 },
    { distance: 0, lessThan: false, expected: 0 },
    { distance: -1, lessThan: true, expected: 0 },
    { distance: -1, lessThan: false, expected: 1 },
  ])('零距离保留原生比较边界 $distance/$lessThan', input => {
    const f = fixture();
    const gun = f.spawn(combo);
    // 测试变体只改变已解析原始条件的数值/方向，不作为新游戏规则。
    const raw = structuredClone(returnTargetFixture.timelines[0]!.sequence);
    const loop = raw.actionData[3] as { action: { actionData: Record<string, unknown>[] } };
    Object.assign(loop.action.actionData[0]!, {
      distance: input.distance,
      lessThan: input.lessThan,
    });
    expect(f.run(0, raw)).toBe(true); // failed per-item guard must not fail the loop
    expect(gun.target.getCountByIds([marker])).toBe(input.expected);
  });
});
