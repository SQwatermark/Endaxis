import { describe, expect, it } from 'vitest';

import { compileWeaponStaticDefinitionBatchSource } from '../src/index.ts';

describe('武器静态定义', () => {
  it('使用精确基础攻击节点和 SkillPatch 真实档位生成候选，并保留逐档 Buff 输入', () => {
    const result = compileWeaponStaticDefinitionBatchSource(
      { wpn_lance_fixture: weaponFixture() },
      upgradeFixture(),
      { sk_wpn_fixture: passiveFixture() },
      { sk_wpn_fixture: patchFixture() },
    );

    expect(result.diagnostics).toEqual([]);
    expect(result.definitions).toEqual([
      {
        slug: 'wpn_lance_fixture',
        rarity: 6,
        weaponType: 'polearm',
        baseAttackAtLevelNodes: [51, 146, 247, 348, 449, 500],
        traits: [
          {
            key: 'skill1',
            levelCount: 2,
            modifiers: [
              {
                kind: 'attribute',
                attribute: 'will',
                operation: 'flat',
                value: [20, 36],
              },
            ],
          },
        ],
      },
    ]);
    expect(result.runtimeDependencies).toHaveLength(1);
    expect(result.runtimeDependencies[0]).toMatchObject({
      weaponId: 'wpn_lance_fixture',
      traitKey: 'skill1',
      slotIndex: 0,
      skillId: 'sk_wpn_fixture',
      referencedBuffIds: ['buff_wpn_fixture'],
      levels: [
        {
          level: 1,
          installation: { patchApplied: true, blackboard: { will: 20, duration: 10 } },
          startupBuffs: [{ buffId: 'buff_wpn_fixture', blackboardAssignments: { duration: 10 } }],
        },
        {
          level: 2,
          installation: { patchApplied: true, blackboard: { will: 36, duration: 20 } },
          startupBuffs: [{ buffId: 'buff_wpn_fixture', blackboardAssignments: { duration: 20 } }],
        },
      ],
    });
  });

  it('缺少任一正式基础攻击节点时保留运行依赖，但阻止整把武器进入正式候选', () => {
    const upgrade = upgradeFixture();
    upgrade.weapon_upgrade_fixture.list = upgrade.weapon_upgrade_fixture.list.filter(
      row => row.weaponLv !== 60,
    );

    const result = compileWeaponStaticDefinitionBatchSource(
      { wpn_lance_fixture: weaponFixture() },
      upgrade,
      { sk_wpn_fixture: passiveFixture() },
      { sk_wpn_fixture: patchFixture() },
    );

    expect(result.definitions).toEqual([]);
    expect(result.runtimeDependencies).toHaveLength(1);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        status: 'blocked',
        reason: 'WeaponDefinition requires an exact base-attack row at level 60',
      }),
    );
  });

  it('固定按原生 ID 排序，且拒绝重复选择身份', () => {
    const table = {
      wpn_lance_z: weaponFixture('wpn_lance_z'),
      wpn_lance_a: weaponFixture('wpn_lance_a'),
    };
    const skillData = { sk_wpn_fixture: passiveFixture() };
    const patch = { sk_wpn_fixture: patchFixture() };
    expect(
      compileWeaponStaticDefinitionBatchSource(
        table,
        upgradeFixture(),
        skillData,
        patch,
      ).definitions.map(definition => definition.slug),
    ).toEqual(['wpn_lance_a', 'wpn_lance_z']);
    expect(() =>
      compileWeaponStaticDefinitionBatchSource(table, upgradeFixture(), skillData, patch, [
        'wpn_lance_a',
        'wpn_lance_a',
      ]),
    ).toThrow('duplicate weapon ID');
  });
});

function weaponFixture(weaponId = 'wpn_lance_fixture'): Record<string, unknown> {
  return {
    breakthroughTemplateId: 'weapon_breakthrough_fixture',
    engName: { id: 1, text: '' },
    levelTemplateId: 'weapon_upgrade_fixture',
    maxLv: 90,
    modelPath: `Gameplay/Prefabs/Weapons/${weaponId}.prefab`,
    potentialUpItemList: [],
    rarity: 6,
    talentTemplateId: 'weapon_potential_fixture',
    weaponDesc: { id: 2, text: '' },
    weaponId,
    weaponPotentialSkill: 'sk_wpn_fixture',
    weaponSkillList: ['sk_wpn_fixture'],
    weaponType: 5,
  };
}

interface UpgradeFixture {
  weapon_upgrade_fixture: { list: Array<Record<string, number>> };
}

function upgradeFixture(): UpgradeFixture {
  return {
    weapon_upgrade_fixture: {
      list: [
        [1, 51],
        [20, 146],
        [40, 247],
        [60, 348],
        [80, 449],
        [90, 500],
      ].map(([weaponLv, baseAtk]) => ({ weaponLv, baseAtk, lvUpExp: 0, lvUpGold: 0 })),
    },
  };
}

function patchFixture() {
  return {
    SkillPatchDataBundle: [
      {
        level: 1,
        blackboard: [
          { key: 'will', value: 20 },
          { key: 'duration', value: 10 },
        ],
      },
      {
        level: 2,
        blackboard: [
          { key: 'will', value: 36 },
          { key: 'duration', value: 20 },
        ],
      },
    ],
  };
}

function passiveFixture(): Record<string, unknown> {
  return {
    actionGroupData: { timelineActions: [], passiveEventActions: [] },
    aiExclusiveFrame: 0,
    attackRangeType: 'Default',
    blackboard: [
      { key: 'will', valueDouble: 0, valueStr: '', isDynamic: false },
      { key: 'duration', valueDouble: 0, valueStr: '', isDynamic: false },
    ],
    buffs: [
      {
        buffId: 'buff_wpn_fixture',
        assignBlackboard: true,
        assignItems: [
          {
            targetKey: 'duration',
            inputValueKey: 'duration',
            useDirectValue: false,
            directValueType: 'Numeric',
            numericValue: 0,
            stringValue: '',
          },
        ],
      },
    ],
    canCastInAir: false,
    canDummyCast: false,
    canMove: false,
    cardAttributeModifier: {
      attributeModifiers: [
        {
          modifyAttributeType: 'Specific',
          attributeType: 'Will',
          formulaItem: 'BaseAddition',
          param: { value: 0, useBlackboardKey: true, blackboardKey: 'will' },
        },
      ],
      isConvertedAttribute: false,
    },
    castData: {},
    castType: 'Passive',
    characterReturnToIdle: false,
    comboSkillUIBigSpriteName: '',
    comboSkillUISpriteName: '',
    dontInterruptCombo: false,
    dummyPositionOffset: {},
    durationFrame: 0,
    exclusiveFrame: 0,
    hittableAttackRange: 0,
    iconBgType: 'Default',
    iconId: '',
    level: 1,
    needEnemyOutOfScreenWarning: false,
    needEnemyOutOfScreenWarningOverrideValue: false,
    offsetRecordFrame: 0,
    overrideHittableObjAttackRange: false,
    overrideNeedEnemyOutOfScreenWarning: false,
    passiveSkillType: 'AddBuff',
    rootMotionCliffCheck: false,
    selectStrategy: {},
    showNotRecommendState: false,
    skillHighlightCondition: {},
    skillId: 'sk_wpn_fixture',
    skillName: '',
    skillSpecification: 'Default',
    skillTags: { predefinedTag: [] },
    smartTargetBuffFindSettings: {},
    smartTargetBuffIds: [],
    smartTargetSelectStrategy: {},
    smartTargetTagQuery: {},
    switchToBuffConfig: {
      condition: {},
      buffs: [],
      buffSource: {},
      targets: {},
      asSkillCast: false,
    },
    switchToCenterBeforeCast: false,
    tagDuringAttach: {},
    toggleBuffs: [],
    uiRangeHints: [],
    useAIExclusiveFrame: false,
  };
}
