/**
 * 把场景编译得到的干员面板和敌人静态输入冻结为单次玩家伤害快照。
 *
 * 这里只安装当前构筑已经解析的静态数值；Buff、即时修正、目标状态和随机暴击仍由命中生命周期
 * 在对应阶段提供。调用方必须按具体伤害步骤重新解析，避免带筛选条件的配装加成污染其他命中。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type {
  DamageType,
  UpgradeStaticDamageIncreaseTarget,
} from '../../game-data/operatorDefinition';
import type { PlayerDamageDefenderSnapshot } from '../damage/playerActiveDamageInput';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeKey,
  type DamageScaleAttributeSnapshot,
} from '../damage/damageScaleAttributes';
import type { PlayerDamageAttributeSnapshots } from '../damage/playerDamageContext';
import type { CombatOperationExecutorContext } from './combatRuntimeAssembly';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { resolveOperatorAttack } from '../attributes/operatorAttackAttributes';

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;

const ENEMY_RESISTANCE_ATTRIBUTES = {
  physical: 'PhysicalResistance',
  heat: 'FireResistance',
  electric: 'PulseResistance',
  cryo: 'CrystResistance',
  nature: 'NaturalResistance',
  ether: 'EtherResistance',
} as const;

/** 把场景敌人的静态抗性安装为可被原生 Buff 八槽修改的运行时属性。 */
export function initializeEnemyResistanceAttributes(
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

function resolveStaticDamageScales(
  context: CombatOperationExecutorContext,
  step: DamageStep,
): DamageScaleAttributeSnapshot {
  const result = emptyDamageScaleSnapshot();
  for (const modifier of context.panel?.combatModifiers ?? []) {
    if (modifier.kind === 'staticDamageIncrease') {
      result[STATIC_DAMAGE_INCREASE_ATTRIBUTE[modifier.target]] += modifier.value;
      continue;
    }
    if (modifier.kind !== 'damageBonus') continue;
    if (!includesValue(modifier.damageTypes, step.parameters.damageType)) continue;
    if (
      modifier.skillTypes !== undefined &&
      !includesValue(modifier.skillTypes, context.program.skillType)
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
  context: CombatOperationExecutorContext,
  step: DamageStep,
  operatorAttributes: CombatAttributeSet<string>,
  enemyResistanceAttributes?: CombatAttributeSet<string>,
): PlayerDamageAttributeSnapshots {
  const panel = context.panel;
  if (panel === undefined) {
    throw new Error(`operator '${context.program.operatorId}' has no resolved panel`);
  }
  const staticDamageScales = resolveStaticDamageScales(context, step);
  const attackerDamageScales = Object.fromEntries(
    DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [
      key,
      staticDamageScales[key] + operatorAttributes.get(key),
    ]),
  ) as Record<DamageScaleAttributeKey, number>;
  attackerDamageScales.damageToStaggeredEnemyIncrease +=
    context.program.statModifiers?.damageToStaggeredEnemyIncrease ?? 0;
  const result: PlayerDamageAttributeSnapshots = {
    attacker: {
      ...attackerDamageScales,
      attack: resolveOperatorAttack(panel, operatorAttributes),
      criticalRate:
        panel.criticalRate +
        (context.program.statModifiers?.criticalRate ?? 0) +
        operatorAttributes.get('criticalRate'),
      criticalDamageIncrease:
        panel.criticalDamage + operatorAttributes.get('criticalDamageIncrease'),
      weaknessDamageMultiplier: 1,
      igniteDamageMultiplier: 1,
      physicalInflictionDamageMultiplier: 1,
    },
    defender: {
      ...emptyDamageScaleSnapshot(),
      ...context.enemy.defenderAttributes,
      ...(enemyResistanceAttributes === undefined
        ? {}
        : {
            resistances: Object.fromEntries(
              Object.entries(ENEMY_RESISTANCE_ATTRIBUTES).map(([damageType, attribute]) => [
                damageType,
                {
                  ...context.enemy.defenderAttributes.resistances[
                    damageType as keyof typeof ENEMY_RESISTANCE_ATTRIBUTES
                  ],
                  percent: enemyResistanceAttributes.get(attribute),
                },
              ]),
            ) as PlayerDamageAttributeSnapshots['defender']['resistances'],
          }),
    },
  };
  return result;
}
