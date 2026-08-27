import { describe, expect, it } from 'vitest';
import fixture from './fixtures/avywenna-entity-child-skills.json';
import { compileAbilityEntityChildSkillSource } from '../src/compiler/abilityEntityChildSkill.ts';
import { validateAbilityEntityChildSkillDefinition } from '../../../src/next/core/game-data/validateSkillDefinition';
import { compileActiveSkillRuntimeProjectionSource } from '../src/compiler/activeSkillRuntimeProjection.ts';

describe('原始能力实体子技能共用时间轴编译', () => {
  it('实体子技能也保留独立动态初值，不借用父技能黑板', () => {
    const sample = fixture.sources[0]!;
    const value = { ...sample.value, blackboard: [
      ...sample.value.blackboard,
      { key: 'test_dynamic_initial', valueDouble: 7, valueStr: '', isDynamic: true },
    ] };
    expect(compileAbilityEntityChildSkillSource(value, sample.file).blackboard)
      .toMatchObject({ test_dynamic_initial: 7 });
  });

  it.each(fixture.sources)('$file 保留枪自身守卫、Tick 跳转与潜能寿命条件', sample => {
    const result = compileAbilityEntityChildSkillSource(sample.value, sample.file);
    expect(validateAbilityEntityChildSkillDefinition(result)).toEqual([]);
    expect(result.skillId).toBe(sample.value.skillId);
    expect(result.scheduledSequences).toHaveLength(4);
    expect(result.scheduledSequences[0]).toMatchObject({
      startFrame: 0,
      endFrame: 1500,
      sequence: {
        steps: [
          {
            kind: 'jumpTimeline',
            parameters: {
              destinationFrame: 1500,
              condition: {
                kind: 'buffIdStackCompare',
                target: 'currentAbilityEntity',
                buffIds: ['buff_chr_0012_avywen_lance_becalled'],
              },
            },
          },
        ],
      },
    });
    expect(result.scheduledSequences.find(item => item.startFrame === 900)).toMatchObject({
      sequence: {
        steps: [
          {
            kind: 'conditional',
            parameters: {
              condition: {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'potential_2' },
                operator: 'less',
                right: { kind: 'constant', value: 1 },
              },
            },
            whenTrue: { steps: [{ kind: 'finishCurrentAbilityEntity' }] },
          },
        ],
      },
    });
    // 原始两个独立结束项仍保留，不以文本相同擅自合并时间轴。
    expect(result.scheduledSequences.filter(item => item.startFrame === 1500)).toHaveLength(2);
  });

  it('普通干员 Owner 不能投影成结束能力实体', () => {
    const sample = fixture.sources[0]!;
    expect(() =>
      compileActiveSkillRuntimeProjectionSource({
        value: sample.value,
        sourcePath: sample.file,
        patch: null,
        context: {
          actionOwnerTarget: 'caster',
          actionSourceTarget: 'caster',
          actionTargetTarget: 'enemy',
        },
      }),
    ).toThrow(/FinishOwner target/);
  });

  it('不默默忽略子技能自带 Buff 安装', () => {
    const sample = fixture.sources[0]!;
    expect(() =>
      compileAbilityEntityChildSkillSource({ ...sample.value, buffs: [{}] }, sample.file),
    ).toThrow(/Buff installation/);
  });

  it('有费用的子技能仍阻塞，不能丢掉消耗', () => {
    const sample = fixture.sources[0]!;
    const value = {
      ...sample.value,
      castData: {
        ...sample.value.castData,
        costData: { ...sample.value.castData.costData, costValue: 1 },
      },
    };
    expect(() => compileAbilityEntityChildSkillSource(value, sample.file)).toThrow(
      /costs, cooldown/,
    );
  });

  it.each([0, 1000])('跳转目标 %i 不在允许的向前区间，明确阻塞', destFrame => {
    expect(() =>
      compileAbilityEntityChildSkillSource(replaceJump({ destFrame }), 'fixture'),
    ).toThrow(/forward timeline range/);
  });

  it('跳转条件不能夹带实际执行动作', () => {
    const actions = fixture.sources[0]!.value.actionGroupData.timelineActions.flatMap<{ $type: string }>(
      item => item._sequenceActionData.actionData,
    );
    const finish = actions.find(action => action.$type.includes('FinishOwnerAction'))!;
    expect(() =>
      compileAbilityEntityChildSkillSource(
        replaceJump({
          conditionAction: {
            onlyExecuteWhenSourceIsMainChar: false,
            onlyExecuteWhenSourceIsGuard: false,
            actionData: [finish],
          },
        }),
        'fixture',
      ),
    ).toThrow(/pure conditions/);
  });

  it('跳转条件的根守卫不能静默丢掉', () => {
    expect(() =>
      compileAbilityEntityChildSkillSource(
        replaceJump({
          conditionAction: {
            onlyExecuteWhenSourceIsMainChar: true,
            onlyExecuteWhenSourceIsGuard: false,
            actionData: [],
          },
        }),
        'fixture',
      ),
    ).toThrow(/root filters/);
  });
});

function replaceJump(patch: Record<string, unknown>) {
  const raw = fixture.sources[0]!.value;
  return {
    ...raw,
    actionGroupData: {
      ...raw.actionGroupData,
      timelineActions: raw.actionGroupData.timelineActions.map(timeline => ({
        ...timeline,
        _sequenceActionData: {
          ...timeline._sequenceActionData,
          actionData: timeline._sequenceActionData.actionData.map(action =>
            action.$type.includes('JumpToAction') ? { ...action, ...patch } : action,
          ),
        },
      })),
    },
  };
}
