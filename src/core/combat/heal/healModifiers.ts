import type { GameplayTag } from '../../../../packages/game-data-contract/src/gameplayTags';
// 纯数据契约由独立包唯一声明；此路径保留兼容导出。
export {
  type HealModifierSide,
  type HealProcessTiming,
  type HealModifierNumber,
  type HealModifierCondition,
  type ModifyHealCalculationResultProcessorDefinition,
  type ModifyHealingIncreaseProcessorDefinition,
  type HealModifierDefinition,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
import {
  type HealModifierDefinition,
  type HealModifierSide,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
import type { BuffModifierNumberSource } from '../buffs/buffModifierNumberSource';
import type { CombatVitals } from '../runtime/combatVitals';

export class HealCalculationContext {
  constructor(
    readonly healerId: string,
    readonly receiverId: string,
    readonly receiverVitals: CombatVitals,
    public value: number,
    readonly tags: readonly GameplayTag[] = [],
    public healerOutputIncrease = 0,
    public receiverTakenIncrease = 0,
  ) {}

  getEntityId(side: HealModifierSide): string {
    return side === 'healer' ? this.healerId : this.receiverId;
  }
}

export interface HealModifier {
  readonly ownerId: string;
  readonly definition: HealModifierDefinition;
  readonly numberSource: BuffModifierNumberSource;
}

export function createHealModifier(
  ownerId: string,
  definition: HealModifierDefinition,
  numberSource: BuffModifierNumberSource,
): HealModifier {
  return { ownerId, definition, numberSource };
}
