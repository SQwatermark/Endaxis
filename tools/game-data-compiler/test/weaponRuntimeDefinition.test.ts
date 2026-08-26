import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';
import {
  attachWeaponProductIdentities,
  compileWeaponRuntimeDefinitionBatchSource,
  renderWeaponDefinitionFiles,
  type CompiledWeaponStaticDefinitionSource,
  type CompiledWeaponTraitRuntimeDependencySource,
} from '../src/index.ts';

const itemFixture = JSON.parse(
  readFileSync(
    new URL('./fixtures/equipment-item-equip-t0-parts-tundra01-body-01.json', import.meta.url),
    'utf8',
  ),
) as { readonly itemTableEntry: Record<string, unknown> };

const definition: CompiledWeaponStaticDefinitionSource = {
  slug: 'wpn_test_0001',
  rarity: 5,
  weaponType: 'sword',
  baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
  traits: [{ key: 'skill1', levelCount: 2, modifiers: [] }],
};

const dependency: CompiledWeaponTraitRuntimeDependencySource = {
  weaponId: definition.slug,
  traitKey: 'skill1',
  slotIndex: 0,
  skillId: 'sk_wpn_test_0001',
  actionGraph: {
    skillId: 'sk_wpn_test_0001',
    level: 1,
    durationFrame: 0,
    declaredBlackboard: [],
    actionGroup: { timelineActions: [], passiveEvents: [] },
  },
  levels: [1, 2].map(level => ({
    level,
    installation: {
      originKind: 'weapon',
      originId: definition.slug,
      sourcePath: `WeaponBasicTable.${definition.slug}`,
      skillId: 'sk_wpn_test_0001',
      level,
      patchApplied: true,
      blackboard: {},
    },
    startupBuffs: [],
    toggleBuffs: [],
  })),
  referencedBuffIds: [],
};

describe('weapon runtime definitions', () => {
  it('事件引用的 Buff 缺失时必须阻断，即使没有启动或 Toggle 安装', () => {
    expect(() =>
      compileWeaponRuntimeDefinitionBatchSource(
        [definition],
        [
          {
            ...dependency,
            referencedBuffIds: ['buff_only_created_by_event'],
          },
        ],
        {},
      ),
    ).toThrow('BuffData: missing Buff definition "buff_only_created_by_event"');
  });
  it('attaches language-neutral ItemTable identity without generating a display name', () => {
    const item = {
      ...itemFixture.itemTableEntry,
      id: definition.slug,
      iconId: 'wpn_sword_test',
      rarity: definition.rarity,
    };

    expect(attachWeaponProductIdentities([definition], { [definition.slug]: item })).toEqual([
      {
        ...definition,
        assetSlug: 'wpn_sword_test',
        iconPath: '/weapons/sword/wpn_sword_test.webp',
      },
    ]);
  });

  it('projects native weapon icon prefixes through the shared product asset convention', () => {
    const native = { ...definition, slug: 'wpn_claym_0003', weaponType: 'greatsword' as const };
    const item = {
      ...itemFixture.itemTableEntry,
      id: native.slug,
      iconId: native.slug,
      rarity: native.rarity,
    };

    expect(attachWeaponProductIdentities([native], { [native.slug]: item })[0]).toMatchObject({
      assetSlug: 'wpn_greatsword_0003',
      iconPath: '/weapons/greatsword/wpn_greatsword_0003.webp',
    });
  });

  it('preserves a complete trait batch without inventing runtime behavior', () => {
    const result = compileWeaponRuntimeDefinitionBatchSource([definition], [dependency], {});

    expect(result.diagnostics).toEqual([]);
    expect(result.definitions).toEqual([definition]);
  });

  it('fails closed when a trait runtime dependency is missing', () => {
    const result = compileWeaponRuntimeDefinitionBatchSource([definition], [], {});

    expect(result.definitions).toEqual([]);
    expect(result.diagnostics).toContainEqual({
      status: 'blocked',
      sourcePath: `WeaponBasicTable.${definition.slug}`,
      reason: 'missing compiled weapon trait runtime dependency',
    });
  });

  it('fails closed instead of guessing an unsupported passive AbilityEvent', () => {
    const withPassiveEvent: CompiledWeaponTraitRuntimeDependencySource = {
      ...dependency,
      actionGraph: {
        ...dependency.actionGraph,
        actionGroup: {
          timelineActions: [],
          passiveEvents: [{ abilityEvent: 'OnProjectileLaunched', actions: [] }],
        },
      },
    };

    const result = compileWeaponRuntimeDefinitionBatchSource([definition], [withPassiveEvent], {});

    expect(result.definitions).toEqual([]);
    expect(result.diagnostics).toContainEqual({
      status: 'blocked',
      sourcePath: `${definition.slug}.skill1.actionGraph`,
      reason:
        `${definition.slug}.skill1.actionGraph.passiveEventActions[0].abilityEvent: ` +
        'unsupported weapon AbilityEvent "OnProjectileLaunched"',
    });
  });

  it('把费用成功事件投影到公共技能 AbilityEvent，而不改写触发时机', () => {
    const withPassiveEvent: CompiledWeaponTraitRuntimeDependencySource = {
      ...dependency,
      actionGraph: {
        ...dependency.actionGraph,
        actionGroup: {
          timelineActions: [],
          passiveEvents: [
            {
              abilityEvent: 'OnAfterSkillApplyCost',
              actions: [
                {
                  onlyExecuteWhenSourceIsMainCharacter: false,
                  onlyExecuteWhenSourceIsGuard: false,
                  actions: [
                    {
                      sourcePath: 'SkillData.sk_wpn_test_0001.mutation',
                      metadata: {
                        nativeType: 'Game.ModifyActionValue',
                        nativeName: 'ModifyActionValue',
                        enabled: true,
                        priorityLevel: 'Default',
                        priorityOffset: 0,
                        serverActionIndex: 0,
                      },
                      body: {
                        kind: 'leaf',
                        value: {
                          family: 'blackboardMutation',
                          action: {
                            kind: 'blackboardMutation',
                            key: 'counter',
                            operation: 'Assign',
                            value: { value: 1, blackboardKey: null, levelValues: null },
                            directValue: true,
                            calculationTarget: { targetSource: 'Owner' } as never,
                            calculationType: 'HpRatio',
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    const result = compileWeaponRuntimeDefinitionBatchSource([definition], [withPassiveEvent], {});

    expect(result.diagnostics).toEqual([]);
    expect(result.definitions[0]?.traits[0]?.eventHandlers).toMatchObject([
      {
        key: 'skill1:event:0:sequence:0',
        abilityEvent: 'afterSkillApplyCost',
        priority: 0,
        sequence: {
          steps: [{ kind: 'modifyActionValue', parameters: { key: 'counter' } }],
        },
      },
    ]);
  });

  it('把构筑期 Deck 属性变化响应折叠为单次配装初始化程序', () => {
    const withDeckEvent: CompiledWeaponTraitRuntimeDependencySource = {
      ...dependency,
      actionGraph: {
        ...dependency.actionGraph,
        actionGroup: {
          timelineActions: [],
          passiveEvents: [
            {
              abilityEvent: 'OnCharDeckAttrChanged',
              actions: [
                {
                  onlyExecuteWhenSourceIsMainCharacter: false,
                  onlyExecuteWhenSourceIsGuard: false,
                  actions: [
                    {
                      sourcePath: 'SkillData.sk_wpn_test_0001.deck-mutation',
                      metadata: {
                        nativeType: 'Game.ModifyActionValue',
                        nativeName: 'ModifyActionValue',
                        enabled: true,
                        priorityLevel: 'Default',
                        priorityOffset: 0,
                        serverActionIndex: 0,
                      },
                      body: {
                        kind: 'leaf',
                        value: {
                          family: 'blackboardMutation',
                          action: {
                            kind: 'blackboardMutation',
                            key: 'form',
                            operation: 'Assign',
                            value: { value: 1, blackboardKey: null, levelValues: null },
                            directValue: true,
                            calculationTarget: { targetSource: 'Owner' } as never,
                            calculationType: 'HpRatio',
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    const result = compileWeaponRuntimeDefinitionBatchSource([definition], [withDeckEvent], {});

    expect(result.diagnostics).toEqual([]);
    expect(result.definitions[0]?.traits[0]).toMatchObject({
      initializationSequence: {
        steps: [{ kind: 'modifyActionValue', parameters: { key: 'form' } }],
      },
    });
    expect(result.definitions[0]?.traits[0]?.eventHandlers).toBeUndefined();
  });

  it('projects native weapon event guards without flattening their sequence boundary', () => {
    const guarded: CompiledWeaponTraitRuntimeDependencySource = {
      ...dependency,
      actionGraph: {
        ...dependency.actionGraph,
        actionGroup: {
          timelineActions: [],
          passiveEvents: [
            {
              abilityEvent: 'OnBeforeOutputDamage',
              actions: [
                {
                  onlyExecuteWhenSourceIsMainCharacter: false,
                  onlyExecuteWhenSourceIsGuard: false,
                  actions: [
                    {
                      sourcePath: 'SkillData.sk_wpn_test_0001.damageTag',
                      metadata: {
                        nativeType: 'Game.CheckDamageDecorateMask',
                        nativeName: 'CheckDamageDecorateMask',
                        enabled: true,
                        priorityLevel: 'Default',
                        priorityOffset: 0,
                        serverActionIndex: 0,
                      },
                      body: {
                        kind: 'leaf',
                        value: {
                          family: 'condition',
                          action: {
                            kind: 'damageDecorateMask',
                            sourceType: 'CheckDamageDecorateMask',
                            checkType: 'HasAll',
                            mask: 2097152,
                          },
                        },
                      },
                    },
                    {
                      sourcePath: 'SkillData.sk_wpn_test_0001.mutation',
                      metadata: {
                        nativeType: 'Game.ModifyActionValue',
                        nativeName: 'ModifyActionValue',
                        enabled: true,
                        priorityLevel: 'Default',
                        priorityOffset: 0,
                        serverActionIndex: 1,
                      },
                      body: {
                        kind: 'leaf',
                        value: {
                          family: 'blackboardMutation',
                          action: {
                            kind: 'blackboardMutation',
                            key: 'counter',
                            operation: 'Assign',
                            value: { value: 1, blackboardKey: null, levelValues: null },
                            directValue: true,
                            calculationTarget: { targetSource: 'Owner' },
                            calculationType: 'HpRatio',
                          },
                        },
                      },
                    },
                  ] as never,
                },
              ],
            },
          ],
        },
      },
    };

    const result = compileWeaponRuntimeDefinitionBatchSource([definition], [guarded], {});

    expect(result.diagnostics).toEqual([]);
    expect(result.definitions[0]?.traits[0]?.eventHandlers?.[0]).toMatchObject({
      abilityEvent: 'beforeOutputDamage',
      sequence: {
        steps: [
          {
            kind: 'conditional',
            parameters: {
              condition: {
                kind: 'eventDamageTagsMatch',
                match: 'hasAll',
                tags: ['normalAttackLastCombo'],
              },
            },
          },
        ],
      },
    });
  });

  it('renders one file per weapon type and a stable index', () => {
    const batch = compileWeaponRuntimeDefinitionBatchSource([definition], [dependency], {});
    const files = renderWeaponDefinitionFiles(batch);

    expect(files.map(item => item.relativePath)).toEqual([
      'index.generated.ts',
      'sword/wpn_test_0001.generated.ts',
      'weapon-definitions.audit.json',
    ]);
    expect(files[1]!.content).toContain('satisfies WeaponDefinition');
  });
});
