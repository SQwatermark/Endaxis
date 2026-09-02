/**
 * 聚合一次战斗共享 SP 的获取效率修正。
 *
 * 这里对应原生 BattleManager 的全局属性，而不是任一干员的个人属性。调用方应把
 * SkillSetting.atbGainEfficiency 作为稳定战斗配置传入，并让 Buff 按启停生命周期注册、注销
 * 同一个修正对象。最终写入共享 SP 账本及上限裁剪不属于本模块职责。
 */
import {
  SP_GAIN_SOURCES,
  type SpGainSource,
} from '../../../../../packages/game-data-contract/src/primitives';

export const SHARED_SP_GAIN_SOURCES = SP_GAIN_SOURCES;
/** 共享 SP 的获取来源；来源决定是否应用普攻或重击专属效率。 */
export type SharedSpGainSource = SpGainSource;

export const SHARED_SP_GAIN_METHODS = ['gain', 'return'] as const;
/** 普通获取不会进入返还池；返还获取还会受到修正项的过滤标记约束。 */
export type SharedSpGainMethod = (typeof SHARED_SP_GAIN_METHODS)[number];

export const SHARED_SP_GAIN_ATTRIBUTES = [
  'gainEfficiency',
  'normalAttackEfficiency',
  'powerAttackEfficiency',
] as const;
/** 原生共享 ATB 获取链中已经确认的三项全局属性。 */
export type SharedSpGainAttribute = (typeof SHARED_SP_GAIN_ATTRIBUTES)[number];

export const SHARED_SP_GAIN_MODIFIER_OPERATIONS = ['addition', 'multiplier'] as const;
/** 单段效率中先汇总 addition，再以 max(0, 1 + sum(multiplier)) 相乘。 */
export type SharedSpGainModifierOperation = (typeof SHARED_SP_GAIN_MODIFIER_OPERATIONS)[number];

/** SkillSetting 中与共享 SP 获取有关的稳定战斗配置。 */
export interface SharedSpGainSettings {
  readonly baseGainEfficiency: number;
}

/**
 * 一项可由 Buff 生命周期独立注册和注销的共享 SP 效率修正。
 * applyToReturnSpGain 只过滤 gainEfficiency；来源专属效率不受该字段影响。
 */
export class SharedSpGainModifier {
  constructor(
    readonly attribute: SharedSpGainAttribute,
    readonly operation: SharedSpGainModifierOperation,
    readonly value: number,
    readonly applyToReturnSpGain: boolean,
  ) {
    requireFinite(value, 'shared SP gain modifier value');
  }
}

/** 两段效率以及最终乘积，供资源回执保留可诊断的中间结果。 */
export interface SharedSpGainEfficiency {
  readonly gainEfficiency: number;
  readonly sourceEfficiency: number;
  readonly totalEfficiency: number;
}

/**
 * 一次战斗唯一的共享 SP 效率修正注册表。
 * 注册表按对象身份移除修正，避免同值 Buff 相互覆盖或错误注销。
 */
export class SharedSpGainModifierSet {
  readonly #modifiers: SharedSpGainModifier[] = [];

  constructor(readonly settings: SharedSpGainSettings) {
    requireFinite(settings.baseGainEfficiency, 'base shared SP gain efficiency');
  }

  get modifierCount(): number {
    return this.#modifiers.length;
  }

  add(modifier: SharedSpGainModifier): void {
    if (!this.#modifiers.includes(modifier)) this.#modifiers.push(modifier);
  }

  remove(modifier: SharedSpGainModifier): boolean {
    const index = this.#modifiers.indexOf(modifier);
    if (index < 0) return false;
    this.#modifiers.splice(index, 1);
    return true;
  }

  resolve(source: SharedSpGainSource, method: SharedSpGainMethod): SharedSpGainEfficiency {
    const gainEfficiency = this.#resolveAttribute(
      'gainEfficiency',
      this.settings.baseGainEfficiency,
      method === 'return',
    );
    const sourceAttribute = sourceAttributeOf(source);
    const sourceEfficiency =
      sourceAttribute === null ? 1 : this.#resolveAttribute(sourceAttribute, 1, false);
    return {
      gainEfficiency,
      sourceEfficiency,
      totalEfficiency: gainEfficiency * sourceEfficiency,
    };
  }

  #resolveAttribute(
    attribute: SharedSpGainAttribute,
    baseValue: number,
    filterReturnSpGain: boolean,
  ): number {
    const modifiers = this.#modifiers.filter(
      modifier =>
        modifier.attribute === attribute && (!filterReturnSpGain || modifier.applyToReturnSpGain),
    );
    const addition = sum(modifiers, 'addition');
    const multiplier = sum(modifiers, 'multiplier');
    return (baseValue + addition) * Math.max(0, 1 + multiplier);
  }
}

function sourceAttributeOf(source: SharedSpGainSource): SharedSpGainAttribute | null {
  if (source === 'normalAttack') return 'normalAttackEfficiency';
  if (source === 'powerAttack') return 'powerAttackEfficiency';
  return null;
}

function sum(
  modifiers: readonly SharedSpGainModifier[],
  operation: SharedSpGainModifierOperation,
): number {
  return modifiers.reduce(
    (total, modifier) => total + (modifier.operation === operation ? modifier.value : 0),
    0,
  );
}

function requireFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}
