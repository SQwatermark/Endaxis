/**
 * 把敌人元素效果的瞬时回执整理成时间轴标记。
 *
 * 元素附着和法术异常在原生 HUD 中由其可见 Buff 与 GPUIBuffNode 展示；
 * `ElementalInflictionApplied` / `ElementalReactionApplied` 是战斗语义事实，不是第二份 UI 状态。
 */
import type { CombatReceiptEntry, CombatReceiptValue } from '../combat/receipt/combatReceipt';

/** 一个不由持续 Buff 段表达的瞬时效果标记。 */
export interface EnemyEffectMarker {
  readonly frame: number;
  readonly kind: 'burst' | 'reactionConsumed' | 'attachmentTrigger';
  /** 只参与转换的输入元素，不代表创建了持续附着。 */
  readonly element?: string;
  readonly burstType?: string;
  readonly reaction?: string;
  readonly level?: number;
}

export interface EnemyEffectViz {
  readonly markers: readonly EnemyEffectMarker[];
  readonly attachmentConversions?: readonly AttachmentConversion[];
}

export interface AttachmentConversion {
  readonly frame: number;
  readonly targetId: string;
  readonly consumedBuffId: string;
  readonly consumedInstanceId: number;
  readonly outputBuffId: string;
  readonly outputInstanceId: number;
}

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

/**
 * 持续状态不在这里生成 segment：原生可见 Buff 生命周期是唯一展示身份。
 * `ElementalReactionApplied` 也不生成瞬时标记：它的持续状态由原生可见 Buff 唯一表达。
 */
export function projectEnemyEffectViz(
  entries: readonly CombatReceiptEntry[],
  endFrame: number,
): EnemyEffectViz {
  if (!Number.isInteger(endFrame) || endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  const markers: EnemyEffectMarker[] = [];
  const attachmentConversions: AttachmentConversion[] = [];
  for (const entry of entries) {
    if (entry.event === 'ElementalInflictionApplied') {
      const data = requireData(entry);
      if (data.outcomeKind === 'compoundStatus') {
        markers.push({
          frame: entry.frame,
          kind: 'attachmentTrigger',
          element: requireString(entry, data, 'requestedElement'),
        });
      }
      continue;
    }
    if (entry.event === 'ElementalAttachmentConverted') {
      const data = requireData(entry);
      if (!entry.targetId) throw new Error(`receipt ${entry.sequence} has no conversion target`);
      attachmentConversions.push({
        frame: entry.frame,
        targetId: entry.targetId,
        consumedBuffId: requireString(entry, data, 'consumedBuffId'),
        consumedInstanceId: requireNumber(entry, data, 'consumedInstanceId'),
        outputBuffId: requireString(entry, data, 'outputBuffId'),
        outputInstanceId: requireNumber(entry, data, 'outputInstanceId'),
      });
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
    if (entry.event === 'ElementalReactionConsumed') {
      const data = requireData(entry);
      if (!requireBoolean(entry, data, 'consumed')) continue;
      markers.push({
        frame: entry.frame,
        kind: 'reactionConsumed',
        reaction: requireString(entry, data, 'reaction'),
        level: requireNumber(entry, data, 'level'),
      });
    }
  }
  return { markers, ...(attachmentConversions.length ? { attachmentConversions } : {}) };
}
