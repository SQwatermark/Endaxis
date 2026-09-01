import { describe, expect, it } from 'vitest';
import { compileAbilityEntityDefinitionSource } from '../src/compiler/abilityEntityDefinition.ts';
import { parseNativeAbilityEntityTemplateSource } from '../src/source/abilityEntity.ts';
import { abilityEntityFixture } from './sourceFixtures.ts';

describe('能力实体模板定义投影', () => {
  it('保留已由控制器死亡计时器证明的非零回收延迟', () => {
    const template = parseNativeAbilityEntityTemplateSource(
      {
        ...abilityEntityFixture(),
        bornTagIds: [],
        durationBlackboard: { useBlackboardKey: false, value: 0, blackboardKey: '' },
        maxDurationForServerSeconds: 0,
        maxStackingCount: -1,
        maxStackingCountBlackboard: { useBlackboardKey: false, value: 0, blackboardKey: '' },
        delayToRecycleSeconds: 0.1,
      },
      'fixture',
    );

    expect(compileAbilityEntityDefinitionSource(template, '', () => ({}))).toEqual({
      lifetime: { kind: 'limited', durationSeconds: 45 },
      deathReleaseDelaySeconds: 0.1,
    });
  });

  it('拒绝原生特殊的 300 秒以上回收分支', () => {
    const template = parseNativeAbilityEntityTemplateSource(
      {
        ...abilityEntityFixture(),
        bornTagIds: [],
        durationBlackboard: { useBlackboardKey: false, value: 0, blackboardKey: '' },
        maxDurationForServerSeconds: 0,
        maxStackingCount: -1,
        maxStackingCountBlackboard: { useBlackboardKey: false, value: 0, blackboardKey: '' },
        delayToRecycleSeconds: 300,
      },
      'fixture',
    );

    expect(() => compileAbilityEntityDefinitionSource(template, '', () => ({}))).toThrow(
      'unsupported AbilityEntity lifetime/stacking projection',
    );
  });

  it('保留生成时从实体黑板覆盖的寿命与堆叠上限，并忽略服务端寿命上限', () => {
    const template = parseNativeAbilityEntityTemplateSource(
      {
        ...abilityEntityFixture(),
        bornTagIds: [],
        durationBlackboard: {
          useBlackboardKey: true,
          value: 45,
          blackboardKey: 'EntityBB_duration',
        },
        maxDurationForServerSeconds: 60,
        maxStackingCount: 5,
        maxStackingCountBlackboard: {
          useBlackboardKey: true,
          value: 18,
          blackboardKey: 'EntityBB_limit',
        },
      },
      'fixture',
    );

    expect(compileAbilityEntityDefinitionSource(template, '', () => ({}))).toEqual({
      lifetime: {
        kind: 'limited',
        durationSeconds: { blackboardKey: 'EntityBB_duration', fallback: 45 },
      },
      maxStackingCount: { blackboardKey: 'EntityBB_limit', fallback: 5 },
    });
  });
});
