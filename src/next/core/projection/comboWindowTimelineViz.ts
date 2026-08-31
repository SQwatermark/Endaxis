/** 把连携窗口生命周期回执投影成轨道持续段；不从技能位置反推窗口。 */
import type { CombatReceiptEntry, CombatReceiptValue } from '../combat/receipt/combatReceipt';

export type ComboWindowTimelineOutcome = 'consumed' | 'expired' | 'cleared' | 'pending';

export interface ComboWindowTimelineSegment {
  readonly sequence: number;
  readonly operatorId: string;
  readonly nextSkillKey: string;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly outcome: ComboWindowTimelineOutcome;
}

function requireData(entry: CombatReceiptEntry): Readonly<Record<string, CombatReceiptValue>> {
  if (entry.data === undefined) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no data`);
  }
  return entry.data;
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

function requireInteger(
  entry: CombatReceiptEntry,
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): number {
  const value = data[key];
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no non-negative ${key}`);
  }
  return value;
}

/**
 * 消费一个候选时运行时会清空该干员整条候选记录，因此同一干员尚未闭合的其他窗口也在该帧结束。
 * 这是对 `ComboWindowRuntime.consume` 的事实投影，不是 UI 猜测释放顺序。
 */
export function projectComboWindowTimelineViz(
  entries: readonly CombatReceiptEntry[],
  endFrame: number,
): readonly ComboWindowTimelineSegment[] {
  if (!Number.isInteger(endFrame) || endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  const open = new Map<number, Omit<ComboWindowTimelineSegment, 'endFrame' | 'outcome'>>();
  const closed: ComboWindowTimelineSegment[] = [];

  for (const entry of entries) {
    if (
      entry.event !== 'ComboWindowOpened' &&
      entry.event !== 'ComboWindowConsumed' &&
      entry.event !== 'ComboWindowExpired'
    ) {
      continue;
    }
    if (entry.sourceId === undefined || entry.sourceId.length === 0) {
      throw new Error(`receipt ${entry.sequence} '${entry.event}' has no sourceId`);
    }
    const data = requireData(entry);
    const sequence = requireInteger(entry, data, 'windowSequence');

    if (entry.event === 'ComboWindowOpened') {
      open.set(sequence, {
        sequence,
        operatorId: entry.sourceId,
        nextSkillKey: requireString(entry, data, 'nextSkillKey'),
        startFrame: entry.frame,
      });
      continue;
    }

    if (entry.event === 'ComboWindowConsumed') {
      for (const [openSequence, segment] of [...open]) {
        if (segment.operatorId !== entry.sourceId) continue;
        open.delete(openSequence);
        closed.push({
          ...segment,
          endFrame: entry.frame,
          outcome: openSequence === sequence ? 'consumed' : 'cleared',
        });
      }
      continue;
    }

    const segment = open.get(sequence);
    if (segment !== undefined) {
      open.delete(sequence);
      closed.push({ ...segment, endFrame: entry.frame, outcome: 'expired' });
    }
  }

  return [
    ...closed,
    ...[...open.values()].map(segment => ({ ...segment, endFrame, outcome: 'pending' as const })),
  ].sort((left, right) => left.startFrame - right.startFrame || left.sequence - right.sequence);
}
