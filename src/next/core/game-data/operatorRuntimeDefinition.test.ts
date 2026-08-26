import { describe, expect, it } from 'vitest';
import { applyOperatorRuntimeDefinition } from './operatorRuntimeDefinition';
import runtime from '../../data/operators/generated-runtime/arcane/arcane.runtime.generated';
import { arcaneGeneratedOperator as base } from '../../data/operators/generated/arcane.operator.generated';
import { arcane } from '../../data/operators/arcane';
import type { SkillDefinition } from './operatorDefinition';

describe('正式角色常驻运行定义安装', () => {
  it('稳定入口使用生成产物，保留旧动作和养成，不修改旧 oracle', () => {
    const before = structuredClone(base);
    const result = applyOperatorRuntimeDefinition(base, runtime);
    expect(result).toEqual(arcane);
    expect(base).toEqual(before);
    expect(result.entityBlackboard).toEqual(runtime.entityBlackboard);
    expect(result.entityBlackboardInitializers).toBe(base.entityBlackboardInitializers);
    expect(result.talents).toBe(base.talents);
    expect(result.buffDefinitions).toBe(base.buffDefinitions);
    const combo = result.skillGroups.find(group => group.key === 'comboSkill')!
      .skills as SkillDefinition;
    const original = base.skillGroups.find(group => group.key === 'comboSkill')!
      .skills as SkillDefinition;
    expect(combo.scheduledSequences).toBe(original.scheduledSequences);
    expect(combo.costFrame).toBe(0);
    expect(combo.comboSmartTarget).toBe('trigger');
    expect(original.costFrame).toBeUndefined();
    expect(base.entityBlackboard).toBeUndefined();
  });
  it.each([
    'slug',
    'duplicate-install',
    'entity-conflict',
    'source-id',
    'group-key',
    'duplicate-metadata',
    'cast-conflict',
  ])('拒绝 %s，不静默覆盖或按名字绑定', failure => {
    let target = structuredClone(base);
    let data: import('./operatorRuntimeDefinition').OperatorRuntimeDefinition =
      structuredClone(runtime);
    if (failure === 'slug') data = { ...data, operatorSlug: 'other' };
    if (failure === 'duplicate-install') target = arcane;
    if (failure === 'entity-conflict') target.entityBlackboard = { EntityBB_consumed_type: 99 };
    if (failure === 'source-id')
      data = { ...data, skillMetadata: [{ ...data.skillMetadata[0]!, sourceSkillId: 'other' }] };
    if (failure === 'group-key')
      data = { ...data, skillMetadata: [{ ...data.skillMetadata[0]!, skillGroupKey: 'ultimate' }] };
    if (failure === 'duplicate-metadata')
      data = { ...data, skillMetadata: [...data.skillMetadata, ...data.skillMetadata] };
    if (failure === 'cast-conflict')
      (
        target.skillGroups.find(group => group.key === 'comboSkill')!.skills as SkillDefinition
      ).costFrame = 5;
    expect(() => applyOperatorRuntimeDefinition(target, data)).toThrow();
  });
});
