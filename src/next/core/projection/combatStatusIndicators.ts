/**
 * 把已发生的 Buff 显示生命周期投影为 HUD 状态指示器。
 * 本层只保留原生显示去向，不决定页面布局，也不反向影响模拟。
 */
import type { BuffTimelineSegment } from './buffTimelineViz';

export const COMBAT_STATUS_DISPLAY_SLOTS = [
  'headBarCommon',
  'headBarAttached',
  'squadIcon',
  'mainCharacterHpProgress',
  'normalSkillProgress',
  'ultimateSkillProgress',
] as const;

export type CombatStatusDisplaySlot = (typeof COMBAT_STATUS_DISPLAY_SLOTS)[number];

export interface CombatStatusIndicator {
  readonly targetId: string;
  readonly buffId: string;
  readonly instanceId: number;
  readonly layers: number;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly slots: readonly CombatStatusDisplaySlot[];
  readonly onlyForControlledOperator: boolean;
  readonly nameKey?: string;
  readonly iconId?: string;
  readonly iconPath?: string;
  readonly iconStyle?: string;
  readonly abnormalColorType?: string;
  readonly showWarningBackground: boolean;
  readonly useWeakNormalSkillProgress: boolean;
  readonly order?: {
    readonly useDirectoryValue: boolean;
    readonly value: number;
    readonly category: string;
  };
}

function displaySlots(segment: BuffTimelineSegment): CombatStatusDisplaySlot[] {
  const slots: CombatStatusDisplaySlot[] = [];
  if (segment.showInHeadBarCommon === true) slots.push('headBarCommon');
  if (segment.showInHeadBarAttached === true) slots.push('headBarAttached');
  if (segment.showInSquadIcon === true) slots.push('squadIcon');
  if (segment.showProgressInHpBar === true) slots.push('mainCharacterHpProgress');
  if (segment.showProgressInNormalSkillButton === true) slots.push('normalSkillProgress');
  if (segment.showProgressInUltimateSkillButton === true) slots.push('ultimateSkillProgress');
  return slots;
}

/**
 * Buff 生命周期段按 `[startFrame, endFrame)` 取样。当前模拟终点上尚未结束的段
 * 与正好在该帧结束的段暂无 outcome 位可区分；状态栏因此不在模拟右边界外推测存活。
 */
export function projectCombatStatusIndicators(
  segments: readonly BuffTimelineSegment[],
  frame: number,
): readonly CombatStatusIndicator[] {
  if (!Number.isFinite(frame)) throw new RangeError('status indicator frame must be finite');
  return segments.flatMap(segment => {
    if (segment.startFrame > frame || frame >= segment.endFrame) return [];
    const slots = displaySlots(segment);
    if (slots.length === 0) return [];
    const hasOrder =
      segment.orderUseDirectoryValue !== undefined &&
      segment.orderPriorityValue !== undefined &&
      segment.orderPriorityCategory !== undefined;
    return [
      {
        targetId: segment.targetId,
        buffId: segment.buffId,
        instanceId: segment.instanceId,
        layers: segment.layers,
        startFrame: segment.startFrame,
        endFrame: segment.endFrame,
        slots,
        onlyForControlledOperator: segment.onlyShowForMainCharacter === true,
        ...(segment.nameKey === undefined ? {} : { nameKey: segment.nameKey }),
        ...(segment.iconId === undefined ? {} : { iconId: segment.iconId }),
        ...(segment.iconPath === undefined ? {} : { iconPath: segment.iconPath }),
        ...(segment.iconStyleInSquad === undefined ? {} : { iconStyle: segment.iconStyleInSquad }),
        ...(segment.abnormalColorType === undefined
          ? {}
          : { abnormalColorType: segment.abnormalColorType }),
        showWarningBackground: segment.showWarningBackground === true,
        useWeakNormalSkillProgress: segment.useWeakProgressInNormalSkillButton === true,
        ...(hasOrder
          ? {
              order: {
                useDirectoryValue: segment.orderUseDirectoryValue!,
                value: segment.orderPriorityValue!,
                category: segment.orderPriorityCategory!,
              },
            }
          : {}),
      },
    ];
  });
}
