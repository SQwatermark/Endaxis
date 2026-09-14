// 纯数据契约由独立包唯一声明；此路径保留兼容导出。
export {
  type PoiseModifierSide,
  type PoiseProcessTiming,
  type PoiseModifierNumber,
  type PoiseModifierCondition,
  type ModifyPoiseScalarProcessorDefinition,
  type PoiseModifierDefinition,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
import {
  type PoiseModifierDefinition,
  type PoiseModifierSide,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
/**
 * Buff 对单次失衡包的声明式修正。
 * 该模型属于通用 Buff 运行时；武器、装备和干员只负责生成相同的定义。
 */
import type { BuffModifierNumberSource } from '../buffs/buffModifierNumberSource';
import type { DamageTag } from '../../game-data/operatorDefinition';

/** 同一次失衡计算持有的可变倍率快照。 */
export class PoiseCalculationContext {
  constructor(
    readonly attackerId: string,
    readonly defenderId: string,
    readonly tags: readonly DamageTag[],
    readonly isAttackerControlled: boolean,
    public outputMultiplier: number,
    public takenMultiplier: number,
  ) {}

  getEntityId(side: PoiseModifierSide): string {
    return side === 'attacker' ? this.attackerId : this.defenderId;
  }
}

/** 由一个已启用 Buff 实例持有的失衡修正器。 */
export interface PoiseModifier {
  readonly ownerId: string;
  readonly definition: PoiseModifierDefinition;
  readonly numberSource: BuffModifierNumberSource;
}

export function createPoiseModifier(
  ownerId: string,
  definition: PoiseModifierDefinition,
  numberSource: BuffModifierNumberSource,
): PoiseModifier {
  return { ownerId, definition, numberSource };
}
