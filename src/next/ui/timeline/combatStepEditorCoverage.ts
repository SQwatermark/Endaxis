import { COMBAT_STEP_KINDS, type CombatStepKind } from '../../core/game-data/operatorDefinition';
import { EDITABLE_COMBAT_STEP_KINDS } from './skillDefinitionEditorViewModel';

export type PendingCombatStepEditorPriority = 'visible-result' | 'runtime-structure' | 'stump-low';

/**
 * 尚未提供专用 Inspector 的公共步骤。
 *
 * 这不是另一份协议全集，也不决定运行时支持度；它只让 UI 缺口显式、可穷尽检查。
 * 优先级按 Endaxis 木桩模型中的可见结果排列。
 */
export const PENDING_COMBAT_STEP_EDITOR_KINDS = {
  'visible-result': [],
  'runtime-structure': [],
  'stump-low': [],
} as const satisfies Readonly<Record<PendingCombatStepEditorPriority, readonly CombatStepKind[]>>;

export const PENDING_COMBAT_STEP_EDITOR_KIND_SET: ReadonlySet<CombatStepKind> = new Set(
  Object.values(PENDING_COMBAT_STEP_EDITOR_KINDS).flat(),
);

/** 编辑目录与待办账本必须恰好覆盖公共协议，调用方可据此直接显示覆盖统计。 */
export function getCombatStepEditorCoverage(): {
  readonly total: number;
  readonly editable: number;
  readonly pending: Readonly<Record<PendingCombatStepEditorPriority, number>>;
} {
  return {
    total: COMBAT_STEP_KINDS.length,
    editable: EDITABLE_COMBAT_STEP_KINDS.length,
    pending: {
      'visible-result': PENDING_COMBAT_STEP_EDITOR_KINDS['visible-result'].length,
      'runtime-structure': PENDING_COMBAT_STEP_EDITOR_KINDS['runtime-structure'].length,
      'stump-low': PENDING_COMBAT_STEP_EDITOR_KINDS['stump-low'].length,
    },
  };
}
