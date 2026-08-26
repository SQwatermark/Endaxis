import { unityComboConditionFixture } from './unityComboConditionFixture.ts';

/** 已核对来源的最小切片；不是供生产读取的资源副本。 */
export function operatorRuntimeFixture() {
  const fixture = unityComboConditionFixture();
  const pair = (key: string, valueDouble = 0) => ({
    key,
    valueDouble,
    valueStr: '',
    isDynamic: true,
  });
  return {
    template: {
      format: 'character-template-prefix-v1',
      decodeStatus: 'partial',
      sourceSha256: '33934515ea8b90efdf35f3fae4901124ed54fc16c087a9755574d8db58dca0bc',
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
          pair('EntityBB_consumed_layer'),
          pair('EntityBB_consumed_type'),
          pair('EntityBB_ult_hit'),
          pair('EntityBB_wisd_greater_will', 1),
        ],
        skillDataBundle: {
          comboSkillId: 'chr_0032_lizhiyan_combo_skill',
          enableComboSkillBlackboard: true,
          comboSkillBlackboard: [pair('consumed_layer'), pair('consumed_type')],
          comboSkillConditions: fixture.conditions,
        },
      },
      conditionReferences: fixture.references,
    },
    comboSkill: {
      skillId: 'chr_0032_lizhiyan_combo_skill',
      castData: { startCdFrame: 0 },
      selectStrategy: 4,
      smartTargetSelectStrategy: 1,
      canDummyCast: true,
      dummyPositionOffset: { x: 0, y: 0, z: 6 },
    },
  };
}
