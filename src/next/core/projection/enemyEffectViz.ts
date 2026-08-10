/**
 * 把敌人身上的元素效果回执整理成曲线面板可画的效果可视化：
 * 附着段（从施加到到期）和标记点（附着施加、爆发、反应）。
 * 本层只按回执整理起止帧，不计算任何战斗数值。
 */
import type { CombatReceiptEntry, CombatReceiptValue } from '../combat/receipt/combatReceipt';

/** 一段持续的元素附着状态。 */
export interface EnemyEffectSegment {
  readonly kind: 'attachment';
  readonly element: string;
  /** 附着开始帧。 */
  readonly startFrame: number;
  /** 附着结束帧；未到期则等于模拟终点。 */
  readonly endFrame: number;
  /** 该段结束时的附着层数。 */
  readonly layers: number;
}

/** 一个瞬时效果标记。 */
export interface EnemyEffectMarker {
  readonly frame: number;
  readonly kind: 'burst' | 'reactionApplied' | 'reactionConsumed';
  /** 爆发类型（Fire/Pulse/Cryst/Natural）。 */
  readonly burstType?: string;
  /** 反应类型。 */
  readonly reaction?: string;
  /** 反应施加后的等级或消费的等级。 */
  readonly level?: number;
}

export interface EnemyEffectViz {
  readonly segments: readonly EnemyEffectSegment[];
  readonly markers: readonly EnemyEffectMarker[];
}

const ATTACHMENT_BUFF_ELEMENTS: Readonly<Record<string, string>> = {
  buff_common_energy_shard_attached_fire: 'heat',
  buff_common_energy_shard_attached_pulse: 'electric',
  buff_common_energy_shard_attached_cryst: 'cryo',
  buff_common_energy_shard_attached_natural: 'nature',
};

function requireData(entry: CombatReceiptEntry): Readonly<Record<string, CombatReceiptValue>> {
  if (entry.data === undefined) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no data`);
  }
  return entry.data;
}

function requireNumber(
  entry: CombatReceiptEntry,
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): number {
  const value = data[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no finite ${key}`);
  }
  return value;
}

function requireString(
  entry: CombatReceiptEntry,
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): string {
  const value = data[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no ${key}`);
  }
  return value;
}

/** 把回执整理成效果段和标记；`endFrame` 是模拟终点，用于给未到期附着收尾。 */
export function projectEnemyEffectViz(
  entries: readonly CombatReceiptEntry[],
  endFrame: number,
): EnemyEffectViz {
  if (!Number.isInteger(endFrame) || endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  const segments = new Map<string, EnemyEffectSegment>();
  const segmentOrder: string[] = [];
  const markers: EnemyEffectMarker[] = [];

  for (const entry of entries) {
    if (entry.event === 'ElementalInflictionApplied') {
      const data = requireData(entry);
      const element = requireString(entry, data, 'requestedElement');
      const layers = requireNumber(entry, data, 'currentLayers');
      // 同元素附着段从头开始（元素变化时旧段由 BuffFinished 收尾）。
      segments.delete(element);
      segmentOrder.push(element);
      segments.set(element, {
        kind: 'attachment',
        element,
        startFrame: entry.frame,
        endFrame: endFrame,
        layers,
      });
      continue;
    }
    if (entry.event === 'BuffFinished') {
      const data = requireData(entry);
      const buffId = requireString(entry, data, 'buffId');
      const element = ATTACHMENT_BUFF_ELEMENTS[buffId];
      if (element === undefined) continue;
      const segment = segments.get(element);
      if (segment === undefined) continue;
      segmentOrder.splice(segmentOrder.indexOf(element), 1);
      segments.set(element, { ...segment, endFrame: entry.frame });
      continue;
    }
    if (entry.event === 'SpellBurstApplied') {
      const data = requireData(entry);
      markers.push({
        frame: entry.frame,
        kind: 'burst',
        burstType: requireString(entry, data, 'burstType'),
      });
      continue;
    }
    if (entry.event === 'ElementalReactionApplied') {
      const data = requireData(entry);
      markers.push({
        frame: entry.frame,
        kind: 'reactionApplied',
        reaction: requireString(entry, data, 'reaction'),
        level: requireNumber(entry, data, 'level'),
      });
      continue;
    }
    if (entry.event === 'ElementalReactionConsumed') {
      const data = requireData(entry);
      markers.push({
        frame: entry.frame,
        kind: 'reactionConsumed',
        reaction: requireString(entry, data, 'reaction'),
        level: requireNumber(entry, data, 'level'),
      });
    }
  }

  return {
    segments: segmentOrder.map(element => segments.get(element)!),
    markers,
  };
}
