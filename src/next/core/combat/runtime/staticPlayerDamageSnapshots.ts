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
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeKey,
  type DamageScaleAttributeSnapshot,
} from '../damage/damageScaleAttributes';
import type { PlayerDamageAttributeSnapshots } from '../damage/playerDamageContext';
import type { CombatOperationExecutorContext } from './combatRuntimeAssembly';
import type { CombatAttributeSet } from '../attributes/combatAttributes';
import { resolveOperatorAttack } from '../attributes/operatorAttackAttributes';

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;

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
): PlayerDamageAttributeSnapshots {
  const panel = context.panel;
  if (panel === undefined) {
    throw new Error(`operator '${context.program.operatorId}' has no resolved panel`);
  }
  return {
    attacker: {
      ...resolveStaticDamageScales(context, step),
      attack: resolveOperatorAttack(panel, operatorAttributes),
      criticalRate: panel.criticalRate,
      criticalDamageIncrease: panel.criticalDamage,
      weaknessDamageMultiplier: 1,
      igniteDamageMultiplier: 1,
      physicalInflictionDamageMultiplier: 1,
    },
    defender: {
      ...emptyDamageScaleSnapshot(),
      ...context.enemy.defenderAttributes,
    },
  };
}
