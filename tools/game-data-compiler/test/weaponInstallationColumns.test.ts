import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { compileWeaponContributions } from '../../../src/next/core/compiler/compileEquipment.ts';
import {
  compileWeaponRuntimeDefinitionBatchSource,
  type CompiledWeaponStaticDefinitionSource,
  type CompiledWeaponTraitRuntimeDependencySource,
  type CompiledWeaponToggleBuffGroupSource,
} from '../src/index.ts';
import { validateWeaponDefinition } from '../../../src/next/core/game-data/equipmentDefinitionValidation.ts';
import type {
  WeaponDefinition,
  LevelValues,
} from '../../../packages/game-data-contract/src/index.ts';

// 复用已提交的真实 Buff 夹具；以下变体只测试参数选择，不作为新增游戏规则证据。
const rawBuffs = JSON.parse(
  readFileSync(new URL('./fixtures/avywenna-vulnerable-buffs.json', import.meta.url), 'utf8'),
) as Record<string, Record<string, unknown>>;
const buffId = 'buff_chr_0012_avywen_ultimate_skill_debuff';
// 本组只验证寿命黑板参数，去掉不相关的易伤子 Buff 回调，避免把另一条闭包混入夹具。
const buffs = { [buffId]: { ...rawBuffs[buffId], buffEventAction: [] } } as Record<
  string,
  Record<string, unknown>
>;
const parameter = 'pulse_vul_duration';
const definition: CompiledWeaponStaticDefinitionSource = {
  slug: 'wpn_columns',
  rarity: 5,
  weaponType: 'sword',
  baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
  traits: [{ key: 'skill1', levelCount: 2, modifiers: [] }],
};

function dependency(
  overrides: Partial<CompiledWeaponTraitRuntimeDependencySource> = {},
): CompiledWeaponTraitRuntimeDependencySource {
  return {
    weaponId: definition.slug,
    traitKey: 'skill1',
    slotIndex: 0,
    skillId: 'sk_columns',
    actionGraph: {
      skillId: 'sk_columns',
      level: 1,
      durationFrame: 0,
      declaredBlackboard: [],
      actionGroup: { timelineActions: [], passiveEvents: [] },
    },
    request: {
      originKind: 'weapon',
      originId: definition.slug,
      skillId: 'sk_columns',
      sourcePath: 'WeaponBasicTable.wpn_columns',
      inputBlackboard: {},
      levelSource: {
        kind: 'weaponProgression',
        slotIndex: 0,
        breakthroughTemplateId: 'fixture',
        talentTemplateId: 'fixture',
      },
    },
    levels: [1, 2],
    blackboard: {},
    startupBuffs: [],
    toggleBuffs: [],
    referencedBuffIds: [],
    ...overrides,
  };
}

function installation(value: LevelValues | string, id = buffId) {
  return { buffId: id, blackboardAssignments: { [parameter]: value } };
}

function alternatingGroups(): CompiledWeaponToggleBuffGroupSource[] {
  return [
    {
      conditions: [{ kind: 'currentHpRatio' as const, comparison: 'GE', value: [0.5, 1.5] }],
      buffs: [installation([10, 20])],
    },
    {
      conditions: [{ kind: 'currentHpRatio' as const, comparison: 'LT', value: [0.5, 1.5] }],
      buffs: [installation([30, 40])],
    },
  ];
}

describe('武器安装结构与等级列', () => {
  it('不变的列保持原引用，直接赋值保持单值，安装动作只生成一份', () => {
    const values = Object.freeze([10, 20]);
    const source = dependency({ startupBuffs: [installation(values), installation(7)] });
    const result = compileWeaponRuntimeDefinitionBatchSource(
      [definition],
      [source],
      buffs,
      fixtureGameplayTagRegistry,
    );
    expect(result.diagnostics).toEqual([]);
    const trait = result.definitions[0]!.traits[0]!;
    expect(trait.initializationBlackboard?.[`install_0_${parameter}`]).toBe(values);
    expect(trait.initializationBlackboard?.[`install_1_${parameter}`]).toBe(7);
    expect(trait.initializationSequence?.steps).toHaveLength(2);
    expect(source.startupBuffs[0]?.blackboardAssignments[parameter]).toBe(values);
  });

  it('不同 Toggle 组交替安装同一结构，只按当前等级选取对应来源参数', () => {
    const source = dependency({ toggleBuffs: alternatingGroups() });
    const result = compileWeaponRuntimeDefinitionBatchSource(
      [definition],
      [source],
      buffs,
      fixtureGameplayTagRegistry,
    );
    expect(result.diagnostics).toEqual([]);
    const generated: WeaponDefinition = result.definitions[0]!;
    expect(validateWeaponDefinition(generated)).toEqual([]);
    const validated = generated;
    expect(validated.traits[0]?.initializationBlackboard).toEqual({
      [`install_0_${parameter}`]: [10, 40],
    });
    expect(validated.traits[0]?.initializationSequence?.steps).toHaveLength(1);
    // 同一生成定义交给本体按构筑等级解析，不能把首档参数冻结到第二档。
    for (const [level, value] of [
      [1, 10],
      [2, 40],
    ] as const) {
      const contributions = compileWeaponContributions(validated, [level], {
        main: 'will',
        secondary: 'agility',
      });
      expect(contributions[0]?.initializationBlackboard).toEqual({
        [`install_0_${parameter}`]: value,
      });
    }
  });

  it('先省略纯表现 Buff，再判断最终安装计划是否一致', () => {
    const omittedId = 'buff_presentation_fixture';
    const source = dependency({
      startupBuffs: [installation([10, 20])],
      toggleBuffs: [
        {
          conditions: [{ kind: 'currentHpRatio', comparison: 'GE', value: [0.5, 1.5] }],
          buffs: [installation(9, omittedId)],
        },
      ],
    });
    const presentation = {
      ...buffs[buffId],
      id: omittedId,
      buffEventAction: [],
      stackingSettings: {
        ...(buffs[buffId]!.stackingSettings as Record<string, unknown>),
        isNeedStackEffect: true,
        stackEffects: [{ effectActions: [] }],
      },
    };
    const result = compileWeaponRuntimeDefinitionBatchSource(
      [definition],
      [source],
      {
        ...buffs,
        [omittedId]: presentation,
      },
      fixtureGameplayTagRegistry,
    );
    expect(result.diagnostics.map(item => item.status)).toEqual(['scenario-omitted']);
    expect(result.definitions[0]?.traits[0]?.initializationSequence?.steps).toHaveLength(1);
  });

  it.each(['missing', 'differentId', 'differentKey', 'differentOrder'] as const)(
    '最终安装结构真的不同则继续阻断：%s',
    difference => {
      const groups = alternatingGroups();
      const otherId = 'buff_other_fixture';
      if (difference === 'missing') groups[1] = { ...groups[1]!, buffs: [] };
      if (difference === 'differentId')
        groups[1] = { ...groups[1]!, buffs: [installation(3, otherId)] };
      if (difference === 'differentKey')
        groups[1] = { ...groups[1]!, buffs: [{ buffId, blackboardAssignments: { another: 3 } }] };
      if (difference === 'differentOrder') {
        groups[0] = { ...groups[0]!, buffs: [...groups[0]!.buffs, installation(3, otherId)] };
        groups[1] = { ...groups[1]!, buffs: [installation(3, otherId), ...groups[1]!.buffs] };
      }
      const result = compileWeaponRuntimeDefinitionBatchSource(
        [definition],
        [dependency({ toggleBuffs: groups })],
        {
          ...buffs,
          [otherId]: { ...buffs[buffId], id: otherId },
        },
        fixtureGameplayTagRegistry,
      );
      expect(result.definitions).toEqual([]);
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({
          status: 'blocked',
          reason: 'weapon trait Buff installation structure changes between levels',
        }),
      );
    },
  );

  it('跨档选择不能掩盖某一档的非数字必读参数', () => {
    const groups = alternatingGroups();
    groups[1] = { ...groups[1]!, buffs: [installation('server_value')] };
    const result = compileWeaponRuntimeDefinitionBatchSource(
      [definition],
      [dependency({ toggleBuffs: groups })],
      buffs,
      fixtureGameplayTagRegistry,
    );
    expect(result.definitions).toEqual([]);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        status: 'blocked',
        reason: 'non-numeric or unresolved Buff assignment is required by the installed Buff',
      }),
    );
  });

  it('未被 Buff 读取的服务端参数仍允许明确省略，不伪造零值', () => {
    const result = compileWeaponRuntimeDefinitionBatchSource(
      [definition],
      [
        dependency({
          startupBuffs: [
            {
              buffId,
              blackboardAssignments: {
                unused: { kind: 'unresolvedSkillBlackboard', key: 'server_value' },
              },
            },
          ],
        }),
      ],
      buffs,
      fixtureGameplayTagRegistry,
    );
    expect(result.definitions).toHaveLength(1);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ status: 'scenario-omitted' }),
    );
    expect(result.definitions[0]?.traits[0]?.initializationBlackboard).toBeUndefined();
  });

  it('缺失条件值按原生等级 ID 诊断，不能把非连续等级改为行号', () => {
    const result = compileWeaponRuntimeDefinitionBatchSource(
      [definition],
      [
        dependency({
          levels: [2, 4],
          toggleBuffs: [
            {
              conditions: [
                {
                  kind: 'currentHpRatio',
                  comparison: 'GE',
                  value: { kind: 'unresolvedSkillBlackboard', key: 'server_hp_ratio' },
                },
              ],
              buffs: [],
            },
          ],
        }),
      ],
      {},
      fixtureGameplayTagRegistry,
    );
    expect(result.definitions).toEqual([]);
    expect(result.diagnostics.map(item => item.sourcePath)).toEqual([
      'wpn_columns.skill1.level2',
      'wpn_columns.skill1.level4',
    ]);
  });
});
