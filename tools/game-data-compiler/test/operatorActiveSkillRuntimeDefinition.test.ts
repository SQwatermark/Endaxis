import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { describe, expect, it } from 'vitest';
import {
  compileOperatorActiveSkillRuntimeDefinitionSource,
  renderOperatorActiveSkillRuntimeDefinitionSource,
} from '../src/domains/operator/activeSkillRuntimeDefinition.ts';
import { activeSkillFixture } from './sourceFixtures.ts';

const context = {
  gameplayTagRegistry: fixtureGameplayTagRegistry,
  actionOwnerTarget: 'caster',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'enemy',
} as const;

describe('Operator 主动技能正式运行定义', () => {
  it('动态声明进入实例初值，同名等级补丁覆盖初值而不改变来源', () => {
    const source = activeSkillFixture('dynamic');
    source.castData = { startCdFrame: 0 };
    source.blackboard = [
      { key: 'count', valueDouble: 0, valueStr: '', isDynamic: true },
      { key: 'atb', valueDouble: 3, valueStr: '', isDynamic: true },
    ];
    const definition = compileOperatorActiveSkillRuntimeDefinitionSource({
      key: 'comboSkill',
      skillType: 'comboSkill',
      value: source,
      sourcePath: 'dynamic',
      context,
      patch: {
        levels: [1, 2],
        blackboard: { atb: [7.5, 8] },
        cooldownSeconds: [0, 0],
        costTypes: [0, 0],
        costValues: [0, 0],
      },
    });
    expect(definition.blackboard).toEqual({ count: 0, atb: [7.5, 8] });
    expect(source.blackboard).toEqual([
      { key: 'count', valueDouble: 0, valueStr: '', isDynamic: true },
      { key: 'atb', valueDouble: 3, valueStr: '', isDynamic: true },
    ]);
  });

  it('从 SkillPatch 恢复等级黑板、战技费用与帧精确冷却', () => {
    const source = activeSkillFixture('battle');
    (source.castData as Record<string, unknown>).startCdFrame = 3;
    source.exclusiveFrame = 20;
    const definition = compileOperatorActiveSkillRuntimeDefinitionSource({
      key: 'battleSkill',
      skillType: 'battleSkill',
      value: source,
      sourcePath: 'battle.json',
      patch: {
        levels: [1, 2],
        blackboard: { attack_scale: [1, 1.2] },
        cooldownSeconds: [1, 1.5],
        costTypes: [1, 1],
        costValues: [100, 100],
      },
      context,
    });
    expect(definition).toMatchObject({
      key: 'battleSkill',
      sourceSkillId: 'battle',
      blackboard: { attack_scale: [1, 1.2] },
      timelineBlockFrames: 21,
      cooldownFrames: [30, 45],
      costs: [{ resource: 'sp', value: 100 }],
      costFrame: 3,
      scheduledSequences: [],
    });
    const rendered = renderOperatorActiveSkillRuntimeDefinitionSource({
      operatorSlug: 'fixture',
      definition,
      supplementalBuffDefinitions: {
        ready: {
          stackingType: 'unique',
          priority: 0,
          maxStackCount: 1,
          durationSeconds: 2,
          applyTags: [],
          extendTags: [],
          blackboard: {},
          attributeModifiers: [],
        },
      },
    });
    expect(rendered.relativePath).toBe('fixture.battleSkill.runtime.generated.ts');
    expect(rendered.content).toContain('satisfies SkillDefinition');
    expect(rendered.content).toContain('export const supplementalBuffDefinitions');
    expect(rendered.content).toContain('"durationSeconds": 2');
    expect(rendered.content).not.toMatch(/[A-Z]:[\\/]|tmp[\\/]/i);
  });

  it('不按技能 key 猜不匹配的费用类型', () => {
    const source = activeSkillFixture('battle');
    (source.castData as Record<string, unknown>).startCdFrame = 0;
    expect(() =>
      compileOperatorActiveSkillRuntimeDefinitionSource({
        key: 'battleSkill',
        skillType: 'battleSkill',
        value: source,
        sourcePath: 'battle.json',
        patch: {
          levels: [1],
          blackboard: {},
          cooldownSeconds: [0],
          costTypes: [0],
          costValues: [100],
        },
        context,
      }),
    ).toThrow('non-zero cost does not match stable skill type');
  });
});
