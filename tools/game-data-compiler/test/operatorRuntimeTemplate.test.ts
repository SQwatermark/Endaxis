import { describe, expect, it } from 'vitest';

import { parseOperatorRuntimeTemplateSource } from '../src/source/operatorRuntimeTemplate.ts';
import { unityComboConditionFixture } from './unityComboConditionFixture.ts';

const sourceSha256 = '33934515ea8b90efdf35f3fae4901124ed54fc16c087a9755574d8db58dca0bc';
const pair = (key: string, valueDouble = 0) => ({
  key,
  valueDouble,
  valueStr: '',
  isDynamic: true,
});

function runtimeTemplate() {
  const combo = unityComboConditionFixture();
  return {
    format: 'character-template-prefix-v1',
    decodeStatus: 'partial',
    sourceSha256,
    root: {
      class: 'CharacterTemplateData',
      namespace: 'Beyond.Gameplay',
      assembly: 'Gameplay.Beyond',
    },
    abilitySystemEntry: {
      class: 'AbilitySystemData',
      namespace: 'Beyond.Gameplay.Core',
      assembly: 'Gameplay.Beyond',
    },
    data: { id: 'chr_0032_lizhiyan' },
    abilitySystem: {
      entityBlackboard: [
        pair('EntityBB_consumed_type'),
        pair('EntityBB_consumed_layer'),
        pair('EntityBB_ult_hit'),
        pair('EntityBB_wisd_greater_will', 1),
      ],
      skillDataBundle: {
        comboSkillId: 'chr_0032_lizhiyan_combo_skill',
        enableComboSkillBlackboard: true,
        comboSkillBlackboard: [pair('consumed_layer'), pair('consumed_type')],
        comboSkillConditions: combo.conditions,
      },
    },
    conditionReferences: combo.references,
  };
}

describe('角色运行模板来源', () => {
  it('从同一固定来源组合角色身份、两层黑板与五条 RID 连携条件', () => {
    const parsed = parseOperatorRuntimeTemplateSource(runtimeTemplate(), 'CharacterData.arcane');

    expect(parsed).toMatchObject({
      sourceSha256,
      decodeStatus: 'partial',
      characterId: 'chr_0032_lizhiyan',
      comboSkillId: 'chr_0032_lizhiyan_combo_skill',
    });
    expect(parsed.blackboards.entity.initialValues).toHaveLength(4);
    expect(parsed.blackboards.comboCondition.initialValues).toHaveLength(2);
    expect(parsed.conditions.conditions).toHaveLength(5);
    expect(parsed.conditions.referenceSources).toHaveLength(14);
  });

  it('来源哈希和原生类型不完整时失败，不把别的角色模板当作 Arcane', () => {
    const missingHash = runtimeTemplate() as Record<string, unknown>;
    missingHash.sourceSha256 = 'not-a-sha';
    expect(() => parseOperatorRuntimeTemplateSource(missingHash, 'CharacterData.arcane')).toThrow(
      'expected SHA256',
    );

    const wrongType = runtimeTemplate();
    wrongType.abilitySystemEntry.class = 'OtherData';
    expect(() => parseOperatorRuntimeTemplateSource(wrongType, 'CharacterData.arcane')).toThrow(
      'unexpected native type',
    );
  });
});
