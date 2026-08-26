import { requireNonEmptyString, requireRecord } from './primitives.ts';
import { parseAbilitySystemBlackboardsSource } from './abilitySystemBlackboards.ts';
import { parseUnityComboSkillConditionsSource } from './unityComboSkillConditions.ts';

/** 只读取已解码的角色/AbilitySystem 前缀与完整条件叶子；未消费后缀保持 partial。 */
export function parseOperatorRuntimeTemplateSource(value: unknown, path: string) {
  const root = requireRecord(value, path);
  if (root.format !== 'character-template-prefix-v1')
    throw new Error(`${path}.format: unsupported template export`);
  if (root.decodeStatus !== 'partial' && root.decodeStatus !== 'complete')
    throw new Error(`${path}.decodeStatus: expected decoded prefix`);
  const descriptor = requireRecord(root.root, `${path}.root`);
  if (
    descriptor.class !== 'CharacterTemplateData' ||
    descriptor.namespace !== 'Beyond.Gameplay' ||
    descriptor.assembly !== 'Gameplay.Beyond'
  )
    throw new Error(`${path}.root: unexpected native type`);
  const entry = requireRecord(root.abilitySystemEntry, `${path}.abilitySystemEntry`);
  if (
    entry.class !== 'AbilitySystemData' ||
    entry.namespace !== 'Beyond.Gameplay.Core' ||
    entry.assembly !== 'Gameplay.Beyond'
  )
    throw new Error(`${path}.abilitySystemEntry: unexpected native type`);
  const data = requireRecord(root.data, `${path}.data`);
  const ability = requireRecord(root.abilitySystem, `${path}.abilitySystem`);
  const bundle = requireRecord(ability.skillDataBundle, `${path}.abilitySystem.skillDataBundle`);
  const sourceSha256 = requireNonEmptyString(root.sourceSha256, `${path}.sourceSha256`);
  if (!/^[0-9a-f]{64}$/i.test(sourceSha256))
    throw new Error(`${path}.sourceSha256: expected SHA256`);
  return {
    sourcePath: path,
    sourceSha256,
    decodeStatus: root.decodeStatus,
    characterId: requireNonEmptyString(data.id, `${path}.data.id`),
    comboSkillId: requireNonEmptyString(
      bundle.comboSkillId,
      `${path}.abilitySystem.skillDataBundle.comboSkillId`,
    ),
    blackboards: parseAbilitySystemBlackboardsSource(ability, `${path}.abilitySystem`),
    conditions: parseUnityComboSkillConditionsSource(
      bundle.comboSkillConditions,
      root.conditionReferences,
      `${path}.abilitySystem.skillDataBundle.comboSkillConditions`,
    ),
  };
}
