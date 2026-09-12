/**
 * 为持久连续组索引已经发生的块边界。
 * 每条回执只读取一次；自然结束不会被误当成显示块结束，也不扫描整份战斗日志寻找下一段。
 * SkillSwitchedToBuff 表示同步旁路已经执行完毕，没有候选技能生命周期，从下一输入帧接续。
 */
import type { CombatReceiptEntry } from '../receipt/combatReceipt';
import type { ScheduledSkillInput } from './combatInputRuntime';

export class SkillInputGroupTiming {
  readonly #boundaryFrames = new Map<string, number>();
  #nextReceipt = 0;

  constructor(
    readonly entries: readonly CombatReceiptEntry[],
    readonly resolveBlockFrames: (input: ScheduledSkillInput) => number,
  ) {}

  canContinue(previous: ScheduledSkillInput, currentFrame: number): boolean {
    this.#collect();
    if (currentFrame <= previous.frame) return false;
    // 零宽没有边界回执，仍至少经过一次实际输入帧。
    if (this.resolveBlockFrames(previous) === 0) return true;
    const boundary = this.#boundaryFrames.get(previous.castId!);
    return boundary !== undefined && boundary < currentFrame;
  }

  #collect(): void {
    while (this.#nextReceipt < this.entries.length) {
      const entry = this.entries[this.#nextReceipt++]!;
      const castId = entry.data?.castId;
      if (typeof castId !== 'string') continue;
      if (entry.event === 'SkillOperableBoundaryReached' || entry.event === 'SkillSwitchedToBuff')
        this.#boundaryFrames.set(castId, entry.frame);
    }
  }
}
