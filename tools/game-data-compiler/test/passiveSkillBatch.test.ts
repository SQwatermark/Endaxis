import { describe, expect, it } from 'vitest';

import {
  compilePassiveSkillRequestBatch,
  type PassiveSkillCompileRequestSource,
} from '../src/index.ts';

describe('公共被动技能批量编译', () => {
  it('保留全部领域请求，但相同 SkillData 只编译一次', () => {
    const requests: PassiveSkillCompileRequestSource[] = [
      request('weapon', 'weapon_a', 'passive_fixture'),
      request('equipmentSuit', 'suit_a', 'passive_fixture'),
    ];
    const batch = compilePassiveSkillRequestBatch(
      requests,
      { passive_fixture: passiveFixture('passive_fixture') },
      { passive_fixture: patchFixture() },
    );

    expect(batch.requests).toEqual(requests);
    expect(batch.definitions).toHaveLength(1);
    expect(batch.definitions[0]).toMatchObject({
      skillId: 'passive_fixture',
      sourcePath: 'SkillData.passive_fixture',
      definition: {
        skill: { skillId: 'passive_fixture' },
        blackboard: {
          definitionLevel: 1,
          declaredDefaults: {},
          levels: [1, 2],
          values: { damage_up: [0.1, 0.2] },
        },
      },
    });
  });

  it('缺失定义时报告提出请求的原始字段路径', () => {
    expect(() =>
      compilePassiveSkillRequestBatch([request('weapon', 'weapon_a', 'missing_skill')], {}, {}),
    ).toThrow(
      'SkillData.missing_skill: missing definition requested by Fixture.weapon_a.skills[0]',
    );
  });
});

function request(
  originKind: 'weapon' | 'equipmentSuit',
  originId: string,
  skillId: string,
): PassiveSkillCompileRequestSource {
  return {
    originKind,
    originId,
    sourcePath: `Fixture.${originId}.skills[0]`,
    skillId,
    levelSource:
      originKind === 'weapon'
        ? {
            kind: 'weaponProgression',
            slotIndex: 0,
            breakthroughTemplateId: 'breakthrough_fixture',
            talentTemplateId: 'talent_fixture',
          }
        : { kind: 'equipmentSuitThreshold', level: 1, requiredCount: 3 },
    inputBlackboard: {},
  };
}

function patchFixture(): Record<string, unknown> {
  return {
    SkillPatchDataBundle: [
      { level: 1, blackboard: [{ key: 'damage_up', value: 0.1 }] },
      { level: 2, blackboard: [{ key: 'damage_up', value: 0.2 }] },
    ],
  };
}

function passiveFixture(skillId: string): Record<string, unknown> {
  return {
    actionGroupData: { timelineActions: [], passiveEventActions: [] },
    aiExclusiveFrame: 0,
    attackRangeType: 'Default',
    blackboard: [],
    buffs: [],
    buffInputBase: null,
    canCastInAir: false,
    canCastInWater: false,
    canDummyCast: false,
    canMove: false,
    cardAttributeModifier: { attributeModifiers: [], isConvertedAttribute: false },
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
    skillId,
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
