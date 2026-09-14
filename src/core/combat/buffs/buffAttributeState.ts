/** Buff 持有的属性修正。与目标属性集合一同复制，保留双方对同一修正的引用。 */
import type { CombatAttributeModifier } from '../attributes/combatAttributeState';

export interface BuffAttributeState<Key extends string> {
  modifiers: readonly CombatAttributeModifier<Key>[];
}

export function createBuffAttributeState<Key extends string>(): BuffAttributeState<Key> {
  return { modifiers: [] };
}
