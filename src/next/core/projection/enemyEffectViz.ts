/**
 * 把敌人身上的元素效果回执整理成曲线面板可画的效果可视化：
 * 附着段（从施加到到期）和标记点（附着施加、爆发、反应）。
 * 这里只按回执整理起止帧，不计算任何战斗数值。
 */
import type { CombatReceiptEntry, CombatReceiptValue } from '../combat/receipt/combatReceipt';

/** 一段持续的元素附着或元素反应状态。 */
export type EnemyEffectSegment =
  | {
      readonly kind: 'attachment';
      readonly element: string;
      /** 该段结束时的附着层数。 */
      readonly layers: number;
      readonly startFrame: number;
      readonly endFrame: number;
    }
  | {
      readonly kind: 'reaction';
      readonly reaction: string;
      readonly level: number;
      readonly startFrame: number;
      readonly endFrame: number;
    };

interface OpenReactionSegment {
  readonly segment: Extract<EnemyEffectSegment, { kind: 'reaction' }>;
  /** 回执给出的自然到期帧；消费或刷新可以令它更早关闭。 */
  readonly expiresAtFrame: number;
}

/*
 * 反应持续时间来自固定 30 FPS 战斗帧。这个投影只把回执中的秒数换算为同一时间轴帧，
 * 不参与反应状态或战斗规则计算。
 */
const COMBAT_FPS = 30;

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

function requireBoolean(
  entry: CombatReceiptEntry,
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): boolean {
  const value = data[key];
  if (typeof value !== 'boolean') {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no boolean ${key}`);
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
  // 同元素当前仍生效的段（层数或时长变化时关闭旧段再开新段，保留完整历史）。
  const openSegments = new Map<string, EnemyEffectSegment>();
  const openReactions = new Map<string, OpenReactionSegment>();
  const closedSegments: EnemyEffectSegment[] = [];
  const markers: EnemyEffectMarker[] = [];

  function closeOpenSegment(element: string, closeFrame: number): void {
    const open = openSegments.get(element);
    if (open === undefined) return;
    openSegments.delete(element);
    closedSegments.push({ ...open, endFrame: closeFrame });
  }

  function closeOpenReaction(reaction: string, closeFrame: number): void {
    const open = openReactions.get(reaction);
    if (open === undefined) return;
    openReactions.delete(reaction);
    closedSegments.push({
      ...open.segment,
      endFrame: Math.min(closeFrame, open.expiresAtFrame),
    });
  }

  for (const entry of entries) {
    if (entry.event === 'ElementalInflictionApplied') {
      const data = requireData(entry);
      const element = requireString(entry, data, 'requestedElement');
      const layers = requireNumber(entry, data, 'currentLayers');
      // 同元素再次施加（可能是层数增强）：关闭旧段保留历史，再开新段。
      closeOpenSegment(element, entry.frame);
      openSegments.set(element, {
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
      closeOpenSegment(element, entry.frame);
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
      const reaction = requireString(entry, data, 'reaction');
      const level = requireNumber(entry, data, 'level');
      const durationSeconds = requireNumber(entry, data, 'durationSeconds');
      const expiresAtFrame = entry.frame + Math.round(durationSeconds * COMBAT_FPS);
      closeOpenReaction(reaction, entry.frame);
      openReactions.set(reaction, {
        segment: {
          kind: 'reaction',
          reaction,
          level,
          startFrame: entry.frame,
          endFrame: Math.min(endFrame, expiresAtFrame),
        },
        expiresAtFrame,
      });
      markers.push({
        frame: entry.frame,
        kind: 'reactionApplied',
        reaction,
        level,
      });
      continue;
    }
    if (entry.event === 'ElementalReactionConsumed') {
      const data = requireData(entry);
      // 未消费成功（敌人身上没有该反应）时不生成消费标记。
      if (!requireBoolean(entry, data, 'consumed')) continue;
      const reaction = requireString(entry, data, 'reaction');
      closeOpenReaction(reaction, entry.frame);
      markers.push({
        frame: entry.frame,
        kind: 'reactionConsumed',
        reaction,
        level: requireNumber(entry, data, 'level'),
      });
    }
  }

  return {
    segments: [
      ...closedSegments,
      ...openSegments.values(),
      ...[...openReactions.values()].map(open => ({
        ...open.segment,
        endFrame: Math.min(endFrame, open.expiresAtFrame),
      })),
    ],
    markers,
  };
}
