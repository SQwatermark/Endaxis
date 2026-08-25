import { describe, expect, it } from 'vitest';

import {
  materializePassiveSkillInstallation,
  type CompiledPassiveSkillDefinitionSource,
  type PassiveSkillCompileRequestSource,
} from '../src/index.ts';

describe('被动技能安装实例化', () => {
  it('套装选择表内等级，再由请求黑板覆盖补丁值', () => {
    const request = fixtureRequest({ kind: 'equipmentSuitThreshold', level: 2, requiredCount: 3 });
    expect(materializePassiveSkillInstallation(request, fixtureDefinition())).toMatchObject({
      level: 2,
      patchApplied: true,
      blackboard: { damage_up: 0.8, patch_only: 4 },
    });
  });

  it('原生默认等级不套补丁，武器则必须显式传入已解析等级', () => {
    const native = fixtureRequest({ kind: 'nativeDefault' });
    expect(materializePassiveSkillInstallation(native, fixtureDefinition())).toMatchObject({
      level: 1,
      patchApplied: false,
      blackboard: { damage_up: 0.8 },
    });

    const weapon = fixtureRequest({
      kind: 'weaponProgression',
      slotIndex: 0,
      breakthroughTemplateId: 'breakthrough_fixture',
      talentTemplateId: 'talent_fixture',
    });
    expect(() => materializePassiveSkillInstallation(weapon, fixtureDefinition())).toThrow(
      'Fixture.passive_fixture: resolved weapon skill level is required',
    );
    expect(materializePassiveSkillInstallation(weapon, fixtureDefinition(), 2)).toMatchObject({
      level: 2,
      patchApplied: true,
    });
  });

  it('条件养成被动在实例化后继续保留原生条件 ID', () => {
    const request = {
      ...fixtureRequest({ kind: 'nativeDefault' }),
      activeConditionIds: ['condition_left', 'condition_right'],
    };
    expect(materializePassiveSkillInstallation(request, fixtureDefinition())).toMatchObject({
      activeConditionIds: ['condition_left', 'condition_right'],
    });
  });
});

function fixtureRequest(
  levelSource: PassiveSkillCompileRequestSource['levelSource'],
): PassiveSkillCompileRequestSource {
  return {
    originKind:
      levelSource.kind === 'weaponProgression'
        ? 'weapon'
        : levelSource.kind === 'equipmentSuitThreshold'
          ? 'equipmentSuit'
          : 'operatorProgression',
    originId: 'origin_fixture',
    sourcePath: 'Fixture.passive_fixture',
    skillId: 'passive_fixture',
    levelSource,
    inputBlackboard: { damage_up: 0.8 },
  };
}

function fixtureDefinition(): CompiledPassiveSkillDefinitionSource {
  return {
    skillId: 'passive_fixture',
    sourcePath: 'SkillData.passive_fixture',
    definition: {
      blackboard: {
        definitionLevel: 1,
        declaredDefaults: { damage_up: 0.1 },
        levels: [2],
        values: { damage_up: [0.3], patch_only: [4] },
      },
      skill: {} as CompiledPassiveSkillDefinitionSource['definition']['skill'],
    },
  };
}
