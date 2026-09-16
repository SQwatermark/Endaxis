import type { ResolvedCombatStepForKind } from '../../compiler/combatProgram';
/**
 * 把场景编译得到的干员面板和敌人静态输入冻结为单次玩家伤害快照。
 *
 * 这里只安装当前构筑已经解析的静态数值；Buff、即时修正、目标状态和随机暴击仍由命中生命周期
 * 在对应阶段提供。调用方必须按具体伤害步骤重新解析，避免带筛选条件的配装加成污染其他命中。
 */
import type {
  DamageType,
  UpgradeStaticDamageIncreaseTarget,
} from '../../game-data/operatorDefinition';
import type { PlayerDamageDefenderSnapshot } from './playerActiveDamageInput';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeKey,
  type DamageScaleAttributeSnapshot,
} from './damageScaleAttributes';
import type { PlayerDamageAttributeSnapshots } from './playerDamageContext';
import type { CombatDamageExecutorContext } from '../runtime/combatRuntimeAssembly';
import { CombatAttributeSet, attributeModifierValues } from '../attributes/combatAttributes';
import {
  ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE,
  resolveOperatorAttack,
} from '../attributes/operatorAttackAttributes';
import type { DamageContributionSource } from './damageContribution';
import type { CombatAttributeModifier } from '../state/foundationState';

type DamageStep = ResolvedCombatStepForKind<'dealDamage' | 'dealFixedDamage'>;

const ENEMY_RESISTANCE_ATTRIBUTES = {
  physical: 'PhysicalResistance',
  heat: 'FireResistance',
  electric: 'PulseResistance',
  cryo: 'CrystResistance',
  nature: 'NaturalResistance',
  ether: 'EtherResistance',
} as const;

/** 安装敌人的抗性及伤害区间属性，Buff 修改与命中快照必须读取同一属性集。 */
export function initializeEnemyCombatAttributes(
  attributes: CombatAttributeSet<string>,
  defender: PlayerDamageDefenderSnapshot,
): void {
  for (const [damageType, attribute] of Object.entries(ENEMY_RESISTANCE_ATTRIBUTES) as readonly [
    keyof typeof ENEMY_RESISTANCE_ATTRIBUTES,
    (typeof ENEMY_RESISTANCE_ATTRIBUTES)[keyof typeof ENEMY_RESISTANCE_ATTRIBUTES],
  ][]) {
    // 当前 1.4.4 AttributeType 已确认这些属性走原生八槽；敌人项目值本身允许为负，
    // 因而不在 Endaxis 额外猜造上下限。
    attributes.define(attribute, defender.resistances[damageType].percent, {});
  }
  // 与干员共用既有区间属性键及零基数；不额外猜造易伤属性的上下限。
  for (const attribute of DAMAGE_SCALE_ATTRIBUTE_KEYS) attributes.define(attribute, 0, {});
  // 1.4.4 AttributeMetaTable[63] 无上下限；敌方庇护进入既有公式的独立区间。
  attributes.define('shelterDamageMultiplier', defender.shelterDamageMultiplier, {});
  // WeakAction 可以把同一关键词载体挂到任意实体；敌人虽不主动攻击，仍须承载并显示该 Buff。
  attributes.define('weaknessDamageMultiplier', 1, {});
  // combat-spec derived-attributes：Slow 载体只派生移动速度；零距离木桩仍需保存该原生属性。
  attributes.define('SlowActionSpeedScalar', 0, {});
}

const DAMAGE_INCREASE_ATTRIBUTE: Partial<Record<DamageType, DamageScaleAttributeKey>> = {
  physical: 'physicalDamageIncrease',
  heat: 'heatDamageIncrease',
  electric: 'electricDamageIncrease',
  cryo: 'cryoDamageIncrease',
  nature: 'natureDamageIncrease',
  ether: 'etherDamageIncrease',
};

const STATIC_DAMAGE_INCREASE_ATTRIBUTE: Readonly<
  Record<UpgradeStaticDamageIncreaseTarget, DamageScaleAttributeKey>
> = {
  normalAttack: 'normalAttackDamageIncrease',
  battleSkill: 'normalSkillDamageIncrease',
  physical: 'physicalDamageIncrease',
  electric: 'electricDamageIncrease',
  cryo: 'cryoDamageIncrease',
};

function emptyDamageScaleSnapshot(): Record<DamageScaleAttributeKey, number> {
  return Object.fromEntries(DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, 0])) as Record<
    DamageScaleAttributeKey,
    number
  >;
}

function includesValue<T>(filter: T | readonly T[], value: T): boolean {
  return Array.isArray(filter) ? filter.includes(value) : filter === value;
}

type DamageSnapshotContext =
  | CombatDamageExecutorContext
  | (Pick<CombatDamageExecutorContext, 'panel' | 'enemy'> & { readonly operatorId: string });

function resolveStaticDamageScales(
  context: DamageSnapshotContext,
  step: DamageStep,
): DamageScaleAttributeSnapshot {
  const result = emptyDamageScaleSnapshot();
  for (const modifier of context.panel?.combatModifiers ?? []) {
    if (modifier.kind === 'staticDamageIncrease') {
      result[STATIC_DAMAGE_INCREASE_ATTRIBUTE[modifier.target]] += modifier.value;
      continue;
    }
    // 原生 damageScale 保留 BaseAddition/Addition 槽，已在属性集构造时安装；这里不能再加一次。
    if (modifier.kind === 'damageScale') continue;
    if (modifier.kind !== 'damageBonus') continue;
    if (!includesValue(modifier.damageTypes, step.parameters.damageType)) continue;
    if (
      modifier.skillTypes !== undefined &&
      (!('program' in context) || !includesValue(modifier.skillTypes, context.program.skillType))
    ) {
      continue;
    }
    const attribute = DAMAGE_INCREASE_ATTRIBUTE[step.parameters.damageType];
    if (attribute === undefined) {
      throw new Error(
        `static damage bonus for '${step.parameters.damageType}' has no recovered damage-scale attribute`,
      );
    }
    result[attribute] += modifier.value;
  }
  return result;
}

/** 为一次标准玩家主动伤害冻结当前已闭环的静态攻防属性。 */
export function resolveStaticPlayerDamageSnapshots(
  context: DamageSnapshotContext,
  step: DamageStep,
  operatorAttributes: CombatAttributeSet<string>,
  enemyAttributes?: CombatAttributeSet<string>,
  includeModifier?: (modifier: CombatAttributeModifier<string>) => boolean,
): PlayerDamageAttributeSnapshots {
  const panel = context.panel;
  if (panel === undefined) {
    throw new Error(
      `operator '${'program' in context ? context.program.operatorId : context.operatorId}' has no resolved panel`,
    );
  }
  const staticDamageScales = resolveStaticDamageScales(context, step);
  const operatorAttribute = (key: string) =>
    includeModifier === undefined
      ? operatorAttributes.get(key)
      : operatorAttributes.getFiltered(key, includeModifier);
  const enemyAttribute = (key: string) =>
    enemyAttributes === undefined
      ? 0
      : includeModifier === undefined
        ? enemyAttributes.get(key)
        : enemyAttributes.getFiltered(key, includeModifier);
  const attackerDamageScales = Object.fromEntries(
    DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, staticDamageScales[key] + operatorAttribute(key)]),
  ) as Record<DamageScaleAttributeKey, number>;
  attackerDamageScales.damageToStaggeredEnemyIncrease +=
    ('program' in context
      ? context.program.statModifiers?.damageToStaggeredEnemyIncrease
      : undefined) ?? 0;
  const result: PlayerDamageAttributeSnapshots = {
    attacker: {
      ...attackerDamageScales,
      attack: resolveOperatorAttack(panel, operatorAttributes, includeModifier),
      ...(step.kind === 'dealDamage' && step.parameters.calculation === 'attribute'
        ? (() => {
            const attribute = step.parameters.calculationAttribute;
            if (attribute === undefined || !operatorAttributes.has(attribute)) {
              throw new Error(
                `damage calculation attribute '${attribute ?? ''}' is not available on the attacker`,
              );
            }
            return { calculationAttributeValue: operatorAttribute(attribute) };
          })()
        : {}),
      // 技能专属加成也在最终乘法之前求值；只读叠加，不污染其他技能或 Buff 命中。
      criticalRate: operatorAttributes.getWithAdditionalModifiers(
        'criticalRate',
        'program' in context && context.program.statModifiers?.criticalRate !== undefined
          ? [attributeModifierValues('baseAddition', context.program.statModifiers.criticalRate)]
          : [],
        includeModifier,
      ),
      criticalDamageIncrease: operatorAttribute('criticalDamageIncrease'),
      weaknessDamageMultiplier: operatorAttribute('weaknessDamageMultiplier'),
      igniteDamageMultiplier: 1,
      physicalInflictionDamageMultiplier: 1,
    },
    defender: {
      ...emptyDamageScaleSnapshot(),
      ...context.enemy.defenderAttributes,
      ...(enemyAttributes === undefined
        ? {}
        : {
            ...Object.fromEntries(
              DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, enemyAttribute(key)]),
            ),
            shelterDamageMultiplier: enemyAttribute('shelterDamageMultiplier'),
            resistances: Object.fromEntries(
              Object.entries(ENEMY_RESISTANCE_ATTRIBUTES).map(([damageType, attribute]) => [
                damageType,
                {
                  ...context.enemy.defenderAttributes.resistances[
                    damageType as keyof typeof ENEMY_RESISTANCE_ATTRIBUTES
                  ],
                  percent: enemyAttribute(attribute),
                },
              ]),
            ) as PlayerDamageAttributeSnapshots['defender']['resistances'],
          }),
    },
  };
  return result;
}

/** 收集本次命中实际会读取的属性修正来源，避免无关属性稀释贡献分配。 */
export function resolveDamageAttributeContributionSourceWeights(
  step: DamageStep,
  attackerId: string,
  operatorAttributes: CombatAttributeSet<string>,
  enemyAttributes: CombatAttributeSet<string>,
): readonly { readonly source: DamageContributionSource; readonly weight: number }[] {
  const attackerAttributes = new Set<string>([
    ...DAMAGE_SCALE_ATTRIBUTE_KEYS,
    ...Object.keys(ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE),
    ...Object.values(ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE),
    'Atk',
    'criticalRate',
    'criticalDamageIncrease',
    'weaknessDamageMultiplier',
  ]);
  if (step.kind === 'dealDamage' && step.parameters.calculation === 'attribute') {
    const attribute = step.parameters.calculationAttribute;
    if (attribute !== undefined) attackerAttributes.add(attribute);
  }
  const defenderAttributes = new Set<string>([
    ...DAMAGE_SCALE_ATTRIBUTE_KEYS,
    ...Object.values(ENEMY_RESISTANCE_ATTRIBUTES),
    'shelterDamageMultiplier',
  ]);
  return [
    ...operatorAttributes.getExternalContributionSourceWeights(attackerId, attackerAttributes),
    ...enemyAttributes.getExternalContributionSourceWeights(attackerId, defenderAttributes),
  ];
}
