import type {
  ComboSkillPriority,
  NativeSkillType,
  PlayerSkillInput,
} from '../../../../packages/game-data-contract/src/index.ts';
import {
  requireArray,
  requireBoolean,
  requireInteger,
  requireNonEmptyString,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseAbilitySystemBlackboardsSource } from './abilitySystemBlackboards.ts';
import { parseUnityComboSkillConditionsSource } from './unityComboSkillConditions.ts';

const COMBO_SKILL_PRIORITIES: Readonly<Record<number, ComboSkillPriority>> = {
  // GetBestCastInfo 0x06D8FE23：0→默认，1→首黑板值，2→敌人品阶分支。
  0: 'default',
  1: 'firstBlackboard',
  2: 'enemyRank',
};

/** 只读取已解码的角色/AbilitySystem 前缀与完整条件叶子；未消费后缀保持 partial。 */
export function parseOperatorRuntimeTemplateSource(
  value: unknown,
  path: string,
  options: { readonly parseComboConditions?: boolean } = {},
) {
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
    comboSkillPriority: parseComboSkillPriority(
      bundle.comboSkillPriorityType,
      `${path}.abilitySystem.skillDataBundle.comboSkillPriorityType`,
    ),
    playerActionSource: parsePlayerActionSource(ability, bundle, path),
    blackboards: parseAbilitySystemBlackboardsSource(ability, `${path}.abilitySystem`),
    ...(options.parseComboConditions === false
      ? {}
      : {
          conditions: parseUnityComboSkillConditionsSource(
            bundle.comboSkillConditions,
            root.conditionReferences,
            `${path}.abilitySystem.skillDataBundle.comboSkillConditions`,
          ),
        }),
  };
}

function parseComboSkillPriority(value: unknown, path: string): ComboSkillPriority {
  const numeric = requireInteger(value, path);
  const priority = COMBO_SKILL_PRIORITIES[numeric];
  if (priority === undefined) throw new Error(`${path}: unsupported native priority ${numeric}`);
  return priority;
}

const nativeSkillTypes = new Map<number, NativeSkillType>([
  [-1, 'passiveSkill'],
  [0, 'attack'],
  [1, 'breakingAttack'],
  [2, 'normalSkill'],
  [3, 'attachSkill'],
  [5, 'dodge'],
  [6, 'comboSkill'],
  [7, 'ultimateSkill'],
  [8, 'extraActiveSkill'],
]);
const nativeSkillTypeNames = {
  PassiveSkill: 'passiveSkill',
  Attack: 'attack',
  BreakingAttack: 'breakingAttack',
  NormalSkill: 'normalSkill',
  AttachSkill: 'attachSkill',
  Dodge: 'dodge',
  ComboSkill: 'comboSkill',
  UltimateSkill: 'ultimateSkill',
  ExtraActiveSkill: 'extraActiveSkill',
} as const satisfies Readonly<Record<string, NativeSkillType>>;

const playerInputByBattleCommand = new Map<number, PlayerSkillInput>([
  [0, 'basicAttack'],
  [3, 'battleSkill'],
  [4, 'comboSkill'],
  [5, 'ultimate'],
]);

function parseStringArray(value: unknown, path: string): string[] {
  return requireArray(value, path).map((item, index) =>
    requireNonEmptyString(item, `${path}[${index}]`),
  );
}

function parseParallelDictionary(
  value: unknown,
  path: string,
): readonly { readonly key: unknown; readonly value: unknown }[] {
  const dictionary = requireRecord(value, path);
  const keys = requireArray(dictionary.keys, `${path}.keys`);
  const values = requireArray(dictionary.values, `${path}.values`);
  if (keys.length !== values.length) throw new Error(`${path}: keys and values length differ`);
  return keys.map((key, index) => ({ key, value: values[index] }));
}

function parseCommandMapping(value: unknown, path: string) {
  const result: Partial<Record<PlayerSkillInput, string>> = {};
  for (const [index, item] of parseParallelDictionary(value, path).entries()) {
    const command = requireInteger(item.key, `${path}.keys[${index}]`);
    // Dash/Jump 属于原生输入系统，但不属于 Endaxis 可排轴的四类语义操作。
    if (command === 1 || command === 2) continue;
    const input = playerInputByBattleCommand.get(command);
    if (input === undefined)
      throw new Error(`${path}.keys[${index}]: unsupported command ${command}`);
    if (result[input] !== undefined) throw new Error(`${path}: duplicate command ${command}`);
    result[input] = requireNonEmptyString(item.value, `${path}.values[${index}]`);
  }
  return result;
}

export function parseNativeSkillType(value: unknown, path: string): NativeSkillType {
  const result =
    typeof value === 'string'
      ? nativeSkillTypeNames[value as keyof typeof nativeSkillTypeNames]
      : nativeSkillTypes.get(requireInteger(value, path));
  if (result === undefined)
    throw new Error(`${path}: unsupported native SkillType ${JSON.stringify(value)}`);
  return result;
}

function parsePlayerActionSource(
  ability: Record<string, unknown>,
  bundle: Record<string, unknown>,
  rootPath: string,
) {
  const path = `${rootPath}.abilitySystem.skillDataBundle`;
  const allNormalAttackIds = parseStringArray(
    bundle.allNormalAttackId,
    `${path}.allNormalAttackId`,
  );
  const allActiveSkillIds = parseStringArray(bundle.allActiveSkillId, `${path}.allActiveSkillId`);
  const allPassiveSkillIds = parseStringArray(
    bundle.allPassiveSkillId,
    `${path}.allPassiveSkillId`,
  );
  const enabledBreakingNormalAttacks = new Set(
    parseStringArray(bundle.enabledBreakingNormalAttacks, `${path}.enabledBreakingNormalAttacks`),
  );
  const normalSkillId = requireNonEmptyString(bundle.normalSkillId, `${path}.normalSkillId`);
  const comboSkillId = requireNonEmptyString(bundle.comboSkillId, `${path}.comboSkillId`);
  const ultimateSkillId = requireNonEmptyString(bundle.ultimateSkillId, `${path}.ultimateSkillId`);
  const dodgeSkillId = requireNonEmptyString(bundle.dodgeSkillId, `${path}.dodgeSkillId`);
  const initialNativeSkillTypeById: Record<string, NativeSkillType> = {};
  const register = (skillId: string, type: NativeSkillType) => {
    const previous = initialNativeSkillTypeById[skillId];
    if (previous !== undefined && previous !== type) {
      throw new Error(`${path}: skill ${JSON.stringify(skillId)} has conflicting initial types`);
    }
    initialNativeSkillTypeById[skillId] = type;
  };
  for (const skillId of allNormalAttackIds) {
    register(skillId, enabledBreakingNormalAttacks.has(skillId) ? 'breakingAttack' : 'attack');
  }
  const overrides = new Map<string, NativeSkillType>();
  for (const [index, item] of parseParallelDictionary(
    bundle.activeSkillTypeOverrides,
    `${path}.activeSkillTypeOverrides`,
  ).entries()) {
    const skillId = requireNonEmptyString(
      item.key,
      `${path}.activeSkillTypeOverrides.keys[${index}]`,
    );
    if (overrides.has(skillId))
      throw new Error(`${path}.activeSkillTypeOverrides: duplicate skill`);
    overrides.set(
      skillId,
      parseNativeSkillType(item.value, `${path}.activeSkillTypeOverrides.values[${index}]`),
    );
  }
  for (const skillId of allActiveSkillIds) {
    register(
      skillId,
      overrides.get(skillId) ??
        (skillId === ultimateSkillId
          ? 'ultimateSkill'
          : skillId === comboSkillId
            ? 'comboSkill'
            : skillId === dodgeSkillId
              ? 'dodge'
              : 'normalSkill'),
    );
  }
  for (const skillId of allPassiveSkillIds) register(skillId, 'passiveSkill');

  const modeConfig = requireRecord(ability.modeConfig, `${rootPath}.abilitySystem.modeConfig`);
  const modes = requireArray(modeConfig.modes, `${rootPath}.abilitySystem.modeConfig.modes`).map(
    (value, index) => {
      const modePath = `${rootPath}.abilitySystem.modeConfig.modes[${index}]`;
      const mode = requireRecord(value, modePath);
      const overrideNormalAttackList = requireBoolean(
        mode.overrideNormalAttackList,
        `${modePath}.overrideNormalAttackList`,
      );
      const overrideCmdMapping = requireBoolean(
        mode.overrideCmdMapping,
        `${modePath}.overrideCmdMapping`,
      );
      return {
        modeId: requireNonEmptyString(mode.modeId, `${modePath}.modeId`),
        modeLayer: requireNonEmptyString(mode.modeLayer, `${modePath}.modeLayer`),
        defaultEnabled: requireBoolean(mode.defaultEnable, `${modePath}.defaultEnable`),
        ...(overrideNormalAttackList
          ? {
              normalAttackSkillIds: parseStringArray(
                mode.normalAttackList,
                `${modePath}.normalAttackList`,
              ),
            }
          : {}),
        ...(overrideCmdMapping
          ? { commandSkillIds: parseCommandMapping(mode.cmdMapping, `${modePath}.cmdMapping`) }
          : {}),
      };
    },
  );

  return {
    allNormalAttackIds,
    allActiveSkillIds,
    allPassiveSkillIds,
    normalAttackSkillIds: parseStringArray(bundle.normalAttackList, `${path}.normalAttackList`),
    breakingAttackSkillIds: [...enabledBreakingNormalAttacks],
    plungingAttackStartId: requireString(
      bundle.plungingAttackStartId,
      `${path}.plungingAttackStartId`,
    ),
    plungingAttackEndId: requireString(bundle.plungingAttackEndId, `${path}.plungingAttackEndId`),
    slotSkillIds: {
      battleSkill: normalSkillId,
      comboSkill: comboSkillId,
      ultimate: ultimateSkillId,
    },
    defaultCommandSkillIds: parseCommandMapping(
      bundle.defaultCmdMapping,
      `${path}.defaultCmdMapping`,
    ),
    initialNativeSkillTypeById,
    modes,
  };
}
