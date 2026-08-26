import { describe, expect, it } from 'vitest';
import {
  compileOperatorRuntimeDefinitionSource,
  renderOperatorRuntimeDefinitionSource,
} from '../src/domains/operator/runtimeDefinition.ts';
import { readFileSync } from 'node:fs';
import { operatorRuntimeFixture } from './operatorRuntimeDefinitionFixture.ts';

const binding = { operatorSlug: 'arcane', skillGroupKey: 'comboSkill' };
const compile = (fixture = operatorRuntimeFixture()) =>
  compileOperatorRuntimeDefinitionSource(fixture.template, fixture.comboSkill, binding);

describe('角色常驻运行定义生成', () => {
  it('真实五条件/两层黑板与正式生成文件一致，未解码后缀仍为 partial', () => {
    const result = compile();
    expect(renderOperatorRuntimeDefinitionSource(result.definition).content).toBe(
      readFileSync(
        new URL(
          '../../../src/next/data/operators/generated-runtime/arcane/arcane.runtime.generated.ts',
          import.meta.url,
        ),
        'utf8',
      ).replaceAll('\r\n', '\n'),
    );
    expect(result.audit.source.decodeStatus).toBe('partial');
    expect(result.audit.scope).toBe('template-blackboards-combo-conditions-cast-metadata');
    expect(renderOperatorRuntimeDefinitionSource(result.definition)).toEqual(
      renderOperatorRuntimeDefinitionSource(compile().definition),
    );
    expect(renderOperatorRuntimeDefinitionSource(result.definition).content).not.toContain(
      'sourceSha256',
    );
  });
  it('禁用局部板仍生成五条条件，实体初值不丢失', () => {
    const f = operatorRuntimeFixture();
    f.template.abilitySystem.skillDataBundle.enableComboSkillBlackboard = false;
    const definition = compile(f).definition;
    expect(definition.comboSkillConditions).toHaveLength(5);
    expect(
      definition.comboSkillConditions.every(condition => condition.initialValues === null),
    ).toBe(true);
    expect(Object.keys(definition.entityBlackboard)).toHaveLength(4);
  });
  it.each([
    'format',
    'native-type',
    'skill-id',
    'partial-leaf',
    'empty-group',
    'negative-frame',
    'immediate',
    'unsafe-slug',
    'unknown-event',
  ])('严格拒绝 %s 而非生成占位定义', failure => {
    const f = operatorRuntimeFixture();
    if (failure === 'format') f.template.format = 'other';
    if (failure === 'native-type') f.template.abilitySystemEntry.class = 'OtherData';
    if (failure === 'skill-id') f.comboSkill.skillId = 'other';
    if (failure === 'partial-leaf')
      Object.values(f.template.conditionReferences)[0]!.decodeStatus = 'partial';
    if (failure === 'negative-frame') f.comboSkill.castData.startCdFrame = -1;
    if (failure === 'immediate')
      f.template.abilitySystem.skillDataBundle.comboSkillConditions[0]!.comboSkillConditionImmediately = true;
    if (failure === 'unknown-event')
      f.template.abilitySystem.skillDataBundle.comboSkillConditions[0]!.comboSkillEvent = 999;
    expect(() =>
      renderOperatorRuntimeDefinitionSource(
        compileOperatorRuntimeDefinitionSource(f.template, f.comboSkill, {
          operatorSlug: failure === 'unsafe-slug' ? '../arcane' : 'arcane',
          skillGroupKey: failure === 'empty-group' ? '' : 'comboSkill',
        }).definition,
      ),
    ).toThrow();
  });
});
