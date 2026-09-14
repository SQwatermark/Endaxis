import {
  CombatInputSchedule,
  type ScheduledCombatFrameInput,
} from '../../src/application/combatInputSchedule';
import type { StandardPlayerDamageCombatSession } from '../../src/application/standardPlayerDamageCombatSession';
import type { CombatRuntimeCheckpoint } from '../../src/core/combat/runtime/combatRuntimeSession';
import type { CombatReceiptEntry } from '../../src/core/combat/receipt/combatReceipt';
import type { LegacyRetimingCheckpointSession, LegacyRetimingTrial } from './heuristicRetiming';

const RETIMING_EVENTS = new Set([
  'SkillStarted',
  'SkillOperableBoundaryReached',
  'SkillSwitchedToBuff',
  'SkillInputCannotInterruptCurrentSkill',
  'SkillInputResolvedToDifferentSkill',
  'SkillInputProcessed',
  'SkillEnded',
  'SkillInterrupted',
  'TimeDilationStarted',
  'TimeDilationEnded',
]);

/** 主会话只推进已确认前缀；观察分支可以越过下一候选，但不会替换主会话。 */
export class CheckpointRetimingSession implements LegacyRetimingCheckpointSession {
  #checkpoint: CombatRuntimeCheckpoint;

  constructor(readonly main: StandardPlayerDamageCombatSession) {
    this.#checkpoint = main.runtime.save();
  }

  get inputBoundary(): number {
    return this.main.runtime.frame + (this.main.runtime.initialInputPending ? 0 : 1);
  }

  advanceBefore(frame: number, confirmedSuffix: readonly ScheduledCombatFrameInput[]): void {
    if (!Number.isSafeInteger(frame) || frame < this.inputBoundary) {
      throw new RangeError('retiming boundary precedes the saved input checkpoint');
    }
    if (frame === this.inputBoundary) return;
    new CombatInputSchedule(this.main, confirmedSuffix).advanceToFrame(frame - 1);
    const next = this.main.runtime.save();
    this.main.runtime.discardCheckpoint(this.#checkpoint);
    this.#checkpoint = next;
  }

  trial(candidateSuffix: readonly ScheduledCombatFrameInput[]): LegacyRetimingTrial {
    let branch: StandardPlayerDamageCombatSession | null = this.main.fork(this.#checkpoint);
    let driver: CombatInputSchedule | null = new CombatInputSchedule(branch, candidateSuffix);
    const entries: CombatReceiptEntry[] = [];
    let cursor:
      import('../../src/core/combat/receipt/combatReceiptHistory').CombatReceiptCursor | undefined;
    return {
      advanceToFrame(endFrame, stopWhen) {
        const activeBranch = branch;
        const activeDriver = driver;
        if (activeBranch === null || activeDriver === null) {
          throw new Error('retiming trial has been disposed');
        }
        const collect = () => {
          const next = activeBranch.runtime.readReceipts(cursor, RETIMING_EVENTS);
          entries.push(...next.entries);
          cursor = next.cursor;
          return next.entries.length > 0;
        };
        if (stopWhen === undefined) {
          activeDriver.advanceToFrame(endFrame);
          collect();
        } else {
          if (!Number.isSafeInteger(endFrame) || endFrame < activeBranch.runtime.frame) {
            throw new RangeError('observation end must be at or after the current frame');
          }
          // 判定在完整帧末进行；输入、技能和时间膨胀事实均已提交。只在新增相关事实时重算。
          collect();
          if (stopWhen({ receiptEntries: entries })) return { receiptEntries: entries };
          while (
            activeBranch.runtime.initialInputPending ||
            activeBranch.runtime.frame < endFrame
          ) {
            activeDriver.advanceToFrame(
              activeBranch.runtime.frame + (activeBranch.runtime.initialInputPending ? 0 : 1),
            );
            if (collect() && stopWhen({ receiptEntries: entries })) break;
          }
        }
        return { receiptEntries: entries };
      },
      dispose() {
        branch = null;
        driver = null;
        cursor = undefined;
      },
    };
  }
}
