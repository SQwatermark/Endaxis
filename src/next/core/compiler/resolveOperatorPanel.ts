/**
 * 根据已解析构筑计算战斗开始前的干员面板与来源回执。
 *
 * 本模块只消费 Build Resolver 和已编译静态配装贡献，不读取目录或 UI。动态 Buff、按技能筛选的
 * 伤害加成和运行时状态不进入可见面板；调用方应把返回快照同时用于属性详情与战斗初始属性。
 */
import type { EquipmentPanelStat } from '../game-data/equipmentDefinition';
import type {
  OperatorAttribute,
  OperatorUpgradeDefinition,
  TrustAttributeBonusDefinition,
  UpgradeBasePanelStat,
  UpgradeModifierDefinition,
  UpgradeStaticDamageIncreaseTarget,
} from '../game-data/operatorDefinition';
import type { OperatorBuildDocument } from '../project/schema';
import type {
  CompiledEquipmentContribution,
  EquipmentContributionSource,
  ResolvedEquipmentModifier,
} from './compileEquipment';
import { compileResolvedScenarioEquipment } from './compileScenarioEquipment';
import type { ResolvedScenarioBuild } from './resolveScenarioBuilds';

const LEVEL_NODES = [1, 20, 40, 60, 80, 90] as const;
const ATTRIBUTES = ['strength', 'agility', 'intellect', 'will'] as const;
const DEFAULT_TRUST_BONUS: TrustAttributeBonusDefinition = {
  values: [10, 15, 15, 20],
  attributes: ['main'],
};
const PANEL_STAT_TARGETS: Readonly<Record<EquipmentPanelStat, OperatorPanelStat>> = {
  attackFlat: 'attack',
  attackPercent: 'attack',
  healthFlat: 'health',
  healthPercent: 'health',
  defenseFlat: 'defense',
  defensePercent: 'defense',
  criticalRate: 'criticalRate',
  criticalDamage: 'criticalDamage',
  artsIntensity: 'artsIntensity',
  ultimateEnergyGainEfficiency: 'ultimateEnergyGainEfficiency',
  skillCooldownReduction: 'skillCooldownReduction',
  staggerDamagePercent: 'staggerDamagePercent',
};

export interface OperatorPanelAttributes {
  readonly strength: number;
  readonly agility: number;
  readonly intellect: number;
  readonly will: number;
}

export type OperatorPanelStat =
  | OperatorAttribute
  | 'attack'
  | 'health'
  | 'defense'
  | 'criticalRate'
  | 'criticalDamage'
  | 'artsIntensity'
  | 'ultimateEnergyGainEfficiency'
  | 'skillCooldownReduction'
  | 'staggerDamagePercent';

export type OperatorPanelContributionSource =
  | { readonly kind: 'operatorBase'; readonly operatorSlug: string }
  | { readonly kind: 'trust'; readonly operatorSlug: string; readonly node: number }
  | { readonly kind: 'operatorUpgrade'; readonly upgradeKey: string }
  | { readonly kind: 'weaponBase'; readonly weaponSlug: string }
  | { readonly kind: 'gearBase'; readonly gearSlug: string }
  | { readonly kind: 'equipment'; readonly contribution: EquipmentContributionSource };

/** 一项进入面板聚合的原始贡献；百分比使用小数。 */
export interface OperatorPanelContributionReceipt {
  readonly source: OperatorPanelContributionSource;
  readonly stat: OperatorPanelStat;
  readonly operation: 'base' | 'flat' | 'percent';
  readonly value: number;
}

/** 可见面板及战斗初始化需要的静态修正。比率字段统一使用小数。 */
export interface ResolvedOperatorPanel {
  readonly operatorId: string;
  readonly attributes: OperatorPanelAttributes;
  readonly attack: number;
  readonly health: number;
  readonly defense: number;
  readonly criticalRate: number;
  readonly criticalDamage: number;
  readonly artsIntensity: number;
  readonly ultimateEnergyGainEfficiency: number;
  readonly skillCooldownReduction: number;
  readonly staggerDamagePercent: number;
  /** 不显示为普通面板数值、但由同一构筑静态决定的战斗修正。 */
  readonly combatModifiers: readonly ResolvedOperatorCombatModifier[];
  readonly receipt: readonly OperatorPanelContributionReceipt[];
}

/** 构筑期静态战斗修正；升级增伤保留原生属性身份，配装修正继续保留筛选条件。 */
export type ResolvedOperatorCombatModifier =
  | ResolvedEquipmentModifier
  | {
      readonly kind: 'staticDamageIncrease';
      readonly target: UpgradeStaticDamageIncreaseTarget;
      readonly value: number;
    };

interface MutablePanelValues {
  attributes: Record<OperatorAttribute, number>;
  attributePercent: Record<OperatorAttribute, number>;
  operatorBaseAttack: number;
  weaponBaseAttack: number;
  operatorBaseHealth: number;
  gearBaseDefense: number;
  upgradeBasePanelStats: Record<UpgradeBasePanelStat, { flat: number; percent: number }>;
  panelStats: Record<EquipmentPanelStat, number>;
}

function createUpgradeBasePanelStatRecord(): MutablePanelValues['upgradeBasePanelStats'] {
  return {
    health: { flat: 0, percent: 0 },
    defense: { flat: 0, percent: 0 },
    criticalRate: { flat: 0, percent: 0 },
    artsIntensity: { flat: 0, percent: 0 },
  };
}

function createPanelStatRecord(): Record<EquipmentPanelStat, number> {
  return {
    attackFlat: 0,
    attackPercent: 0,
    healthFlat: 0,
    healthPercent: 0,
    defenseFlat: 0,
    defensePercent: 0,
    criticalRate: 0,
    criticalDamage: 0,
    artsIntensity: 0,
    ultimateEnergyGainEfficiency: 0,
    skillCooldownReduction: 0,
    staggerDamagePercent: 0,
  };
}

function requireLevelIndex(level: number, path: string): number {
  const index = LEVEL_NODES.indexOf(level as (typeof LEVEL_NODES)[number]);
  if (index < 0) throw new RangeError(`${path} must be one of ${LEVEL_NODES.join(', ')}`);
  return index;
}

function requireFinite(value: number | undefined, path: string): number {
  if (value === undefined || !Number.isFinite(value)) {
    throw new TypeError(`${path} must resolve to a finite number`);
  }
  return value;
}

function resolveTrustAttribute(
  attribute: TrustAttributeBonusDefinition['attributes'][number],
  build: ResolvedScenarioBuild,
): OperatorAttribute {
  return attribute === 'main'
    ? build.operator.mainAttribute
    : attribute === 'secondary'
      ? build.operator.secondaryAttribute
      : attribute;
}

function maxTrustLevel(build: OperatorBuildDocument): number {
  if (build.level >= 90) return 4;
  if (build.level >= 80) return build.promoted ? 4 : 3;
  if (build.level >= 60) return build.promoted ? 3 : 2;
  if (build.level >= 40) return build.promoted ? 2 : 1;
  if (build.level >= 20) return build.promoted ? 1 : 0;
  return 0;
}

function selectedPotentialUpgrades(
  potential: number,
  definitions: readonly OperatorUpgradeDefinition[],
): readonly OperatorUpgradeDefinition[] {
  const totalLevels = definitions.reduce((sum, definition) => sum + definition.levels, 0);
  if (!Number.isInteger(potential) || potential < 0 || potential > totalLevels) {
    throw new RangeError(`operator potential must be an integer between 0 and ${totalLevels}`);
  }
  const selected: OperatorUpgradeDefinition[] = [];
  let remaining = potential;
  for (const definition of definitions) {
    if (remaining <= 0) break;
    selected.push(definition);
    remaining -= definition.levels;
  }
  return selected;
}

function selectedTalentUpgrades(
  build: OperatorBuildDocument,
  definitions: readonly OperatorUpgradeDefinition[],
): readonly OperatorUpgradeDefinition[] {
  return definitions.filter((definition, index) => {
    const level = build.talentStates[String(index)] ?? 0;
    if (!Number.isInteger(level) || level < 0 || level > definition.levels) {
      throw new RangeError(
        `operator talent '${definition.key}' must be an integer between 0 and ${definition.levels}`,
      );
    }
    return level > 0;
  });
}

function applyUpgradeModifier(
  modifier: UpgradeModifierDefinition,
  source: OperatorPanelContributionSource,
  values: MutablePanelValues,
  receipt: OperatorPanelContributionReceipt[],
  combatModifiers: ResolvedOperatorCombatModifier[],
): void {
  if (modifier.kind === 'addBuildAttribute') {
    for (const attribute of modifier.attributes) {
      values.attributes[attribute] += modifier.value;
      receipt.push({ source, stat: attribute, operation: 'flat', value: modifier.value });
    }
  } else if (modifier.kind === 'modifyBasePanelStat') {
    values.upgradeBasePanelStats[modifier.stat][modifier.operation] += modifier.value;
    receipt.push({
      source,
      stat: modifier.stat,
      operation: modifier.operation,
      value: modifier.value,
    });
  } else if (modifier.kind === 'addStaticDamageIncrease') {
    combatModifiers.push({
      kind: 'staticDamageIncrease',
      target: modifier.target,
      value: modifier.value,
    });
  }
}

function resolveUpgradeBasePanelStat(
  rawValue: number,
  stat: UpgradeBasePanelStat,
  values: MutablePanelValues,
): number {
  const modifier = values.upgradeBasePanelStats[stat];
  return (rawValue + modifier.flat) * Math.max(0, 1 + modifier.percent);
}

function applyEquipmentContribution(
  contribution: CompiledEquipmentContribution,
  values: MutablePanelValues,
  receipt: OperatorPanelContributionReceipt[],
  combatModifiers: ResolvedOperatorCombatModifier[],
): void {
  const source = { kind: 'equipment', contribution: contribution.source } as const;
  for (const modifier of contribution.modifiers) {
    if (modifier.kind === 'attribute') {
      if (modifier.operation === 'flat') values.attributes[modifier.attribute] += modifier.value;
      else values.attributePercent[modifier.attribute] += modifier.value;
      receipt.push({
        source,
        stat: modifier.attribute,
        operation: modifier.operation,
        value: modifier.value,
      });
    } else if (modifier.kind === 'panelStat') {
      values.panelStats[modifier.stat] += modifier.value;
      receipt.push({
        source,
        stat: PANEL_STAT_TARGETS[modifier.stat],
        operation: modifier.stat.endsWith('Percent') ? 'percent' : 'flat',
        value: modifier.value,
      });
    } else {
      combatModifiers.push(modifier);
    }
  }
}

/** 计算单个已解析干员构筑的静态面板。 */
export function resolveOperatorPanel(build: ResolvedScenarioBuild): ResolvedOperatorPanel {
  if (build.operatorBuild.baseStatOverrides !== undefined) {
    throw new Error(
      `operator build '${build.operatorBuild.id}' has base stat overrides, but Next panel override semantics are not normalized`,
    );
  }
  const operatorLevelIndex = requireLevelIndex(
    build.operatorBuild.level,
    `operator build '${build.operatorBuild.id}'.level`,
  );
  const receipt: OperatorPanelContributionReceipt[] = [];
  const operatorSource = { kind: 'operatorBase', operatorSlug: build.operator.slug } as const;
  const attributes = Object.fromEntries(
    ATTRIBUTES.map(attribute => {
      const value = requireFinite(
        build.operator.attributes[attribute][operatorLevelIndex],
        `operator '${build.operator.slug}'.attributes.${attribute}[${operatorLevelIndex}]`,
      );
      receipt.push({ source: operatorSource, stat: attribute, operation: 'base', value });
      return [attribute, value];
    }),
  ) as Record<OperatorAttribute, number>;
  const values: MutablePanelValues = {
    attributes,
    attributePercent: { strength: 0, agility: 0, intellect: 0, will: 0 },
    operatorBaseAttack: requireFinite(
      build.operator.attributes.baseAttack[operatorLevelIndex],
      `operator '${build.operator.slug}'.attributes.baseAttack[${operatorLevelIndex}]`,
    ),
    weaponBaseAttack: 0,
    operatorBaseHealth: requireFinite(
      build.operator.attributes.baseHealth[operatorLevelIndex],
      `operator '${build.operator.slug}'.attributes.baseHealth[${operatorLevelIndex}]`,
    ),
    gearBaseDefense: 0,
    upgradeBasePanelStats: createUpgradeBasePanelStatRecord(),
    panelStats: createPanelStatRecord(),
  };
  const combatModifiers: ResolvedOperatorCombatModifier[] = [];
  receipt.push(
    {
      source: operatorSource,
      stat: 'attack',
      operation: 'base',
      value: values.operatorBaseAttack,
    },
    {
      source: operatorSource,
      stat: 'health',
      operation: 'base',
      value: values.operatorBaseHealth,
    },
    {
      source: operatorSource,
      stat: 'criticalRate',
      operation: 'base',
      value: 0.05,
    },
    {
      source: operatorSource,
      stat: 'criticalDamage',
      operation: 'base',
      value: 0.5,
    },
    {
      source: operatorSource,
      stat: 'ultimateEnergyGainEfficiency',
      operation: 'base',
      value: 1,
    },
  );

  const trust = build.operator.trustAttributeBonus ?? DEFAULT_TRUST_BONUS;
  const unlockedTrustLevel = maxTrustLevel(build.operatorBuild);
  if (
    !Number.isInteger(build.operatorBuild.trustLevel) ||
    build.operatorBuild.trustLevel < 0 ||
    build.operatorBuild.trustLevel > unlockedTrustLevel
  ) {
    throw new RangeError(
      `operator build '${build.operatorBuild.id}'.trustLevel must be an integer between 0 and ${unlockedTrustLevel}`,
    );
  }
  for (let index = 0; index < build.operatorBuild.trustLevel; index += 1) {
    const bonus = requireFinite(
      trust.values[index],
      `operator '${build.operator.slug}'.trustAttributeBonus.values[${index}]`,
    );
    for (const rawAttribute of trust.attributes) {
      const attribute = resolveTrustAttribute(rawAttribute, build);
      values.attributes[attribute] += bonus;
      receipt.push({
        source: { kind: 'trust', operatorSlug: build.operator.slug, node: index + 1 },
        stat: attribute,
        operation: 'flat',
        value: bonus,
      });
    }
  }

  for (const upgrade of [
    ...selectedTalentUpgrades(build.operatorBuild, build.operator.talents),
    ...selectedPotentialUpgrades(build.operatorBuild.potential, build.operator.potentials),
  ]) {
    const source = { kind: 'operatorUpgrade', upgradeKey: upgrade.key } as const;
    for (const modifier of upgrade.modifiers ?? []) {
      applyUpgradeModifier(modifier, source, values, receipt, combatModifiers);
    }
  }

  if (build.weapon !== null) {
    const weaponLevelIndex = requireLevelIndex(
      build.weapon.build.level,
      `weapon build '${build.weapon.build.id}'.level`,
    );
    values.weaponBaseAttack = requireFinite(
      build.weapon.definition.baseAttackAtLevelNodes[weaponLevelIndex],
      `weapon '${build.weapon.definition.slug}'.baseAttackAtLevelNodes[${weaponLevelIndex}]`,
    );
    receipt.push({
      source: { kind: 'weaponBase', weaponSlug: build.weapon.definition.slug },
      stat: 'attack',
      operation: 'base',
      value: values.weaponBaseAttack,
    });
  }
  for (const gear of build.gears) {
    values.gearBaseDefense += gear.definition.baseDefense;
    receipt.push({
      source: { kind: 'gearBase', gearSlug: gear.definition.slug },
      stat: 'defense',
      operation: 'base',
      value: gear.definition.baseDefense,
    });
  }

  const equipment = compileResolvedScenarioEquipment([build])[0]!;
  for (const contribution of equipment.contributions) {
    applyEquipmentContribution(contribution, values, receipt, combatModifiers);
  }
  for (const attribute of ATTRIBUTES) {
    values.attributes[attribute] = Math.floor(
      values.attributes[attribute] * (1 + values.attributePercent[attribute]),
    );
  }

  const mainAttribute = values.attributes[build.operator.mainAttribute];
  const secondaryAttribute = values.attributes[build.operator.secondaryAttribute];
  const attributeAttackMultiplier = 1 + mainAttribute * 0.005 + secondaryAttribute * 0.002;
  const attack = Math.floor(
    ((values.operatorBaseAttack + values.weaponBaseAttack) * (1 + values.panelStats.attackPercent) +
      values.panelStats.attackFlat) *
      attributeAttackMultiplier,
  );
  const health = Math.floor(
    resolveUpgradeBasePanelStat(
      values.operatorBaseHealth + values.attributes.strength * 5,
      'health',
      values,
    ) *
      (1 + values.panelStats.healthPercent) +
      values.panelStats.healthFlat,
  );
  const defense = Math.floor(
    resolveUpgradeBasePanelStat(values.gearBaseDefense, 'defense', values) *
      (1 + values.panelStats.defensePercent) +
      values.panelStats.defenseFlat,
  );

  return {
    operatorId: build.operatorBuild.id,
    attributes: { ...values.attributes },
    attack,
    health,
    defense,
    criticalRate:
      resolveUpgradeBasePanelStat(0.05, 'criticalRate', values) + values.panelStats.criticalRate,
    criticalDamage: 0.5 + values.panelStats.criticalDamage,
    artsIntensity:
      resolveUpgradeBasePanelStat(0, 'artsIntensity', values) + values.panelStats.artsIntensity,
    ultimateEnergyGainEfficiency: 1 + values.panelStats.ultimateEnergyGainEfficiency,
    skillCooldownReduction: values.panelStats.skillCooldownReduction,
    staggerDamagePercent: values.panelStats.staggerDamagePercent,
    combatModifiers,
    receipt,
  };
}

/** 按 Build Resolver 的轨道顺序计算队伍静态面板。 */
export function resolveScenarioOperatorPanels(
  builds: readonly ResolvedScenarioBuild[],
): readonly ResolvedOperatorPanel[] {
  return builds.map(resolveOperatorPanel);
}
