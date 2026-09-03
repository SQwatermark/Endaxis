/**
 * 管理一场战斗中所有待释放连携候选。
 *
 * 原生运行时按干员保存候选，并用可暂停的剩余时间计时；这里保留该生命周期。
 * Endaxis 当前只有一个敌人，因此只记录候选顺序，不实现多目标挑选策略的数值差异。
 */
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { COMBAT_FRAMES_PER_SECOND, type CombatClock } from './combatClock';
import type { FrameRuntime } from './combatSimulation';
import type { PendingComboCondition } from './comboSkillConditionRuntime';

export const COMBO_WINDOW_DURATION_FRAMES = 5 * COMBAT_FRAMES_PER_SECOND;

/** 一个干员记录中的待释放候选；同一干员可以因多个目标重复满足条件而积累多项。 */
export interface PendingComboWindow {
  readonly sequence: number;
  readonly operatorId: string;
  readonly nextSkillKey: string;
  readonly openedFrame: number;
  /** 从角色级连携注册复制的本次候选参数；不能回写干员定义。 */
  readonly blackboard: Readonly<Record<string, number>>;
  /** 原生条件候选；与旧语义窗口的数值板分开，在 Start 恢复后才应用。 */
  readonly nativeCondition?: PendingComboCondition & { readonly skillGroupKey: string };
  remainingFrames: number;
}

interface PendingComboRecord {
  readonly operatorId: string;
  readonly activationSequence: number;
  readonly openedFrame: number;
  readonly candidates: PendingComboWindow[];
}

export type ComboWindowConsumeFailure =
  'windowMissing' | 'releaseOrderMismatch' | 'skillStageMismatch';

export type ComboWindowConsumeResult =
  | { readonly consumed: true; readonly window: PendingComboWindow }
  | {
      readonly consumed: false;
      readonly reason: ComboWindowConsumeFailure;
      readonly expected?: PendingComboWindow;
    };

export class ComboWindowRuntime implements FrameRuntime {
  readonly #records = new Map<string, PendingComboRecord>();
  readonly #operatorOrder = new Map<string, number>();
  readonly #pausedOperators = new Set<string>();
  #globallyPaused = false;
  #nextSequence = 0;

  constructor(
    readonly clock: CombatClock,
    readonly receipt: CombatReceiptSink,
    operatorOrder: readonly string[] = [],
    readonly onAllPendingRemoved?: (operatorId: string) => void,
  ) {
    operatorOrder.forEach((operatorId, index) => this.#operatorOrder.set(operatorId, index));
  }

  /** 只读扁平快照，主要供诊断与投影使用；消费逻辑仍按干员记录执行。 */
  get pending(): readonly PendingComboWindow[] {
    return this.#orderedRecords().flatMap(record => record.candidates);
  }

  /** 当前应最先处理的干员记录中的候选。 */
  get first(): PendingComboWindow | undefined {
    return this.#orderedRecords()[0]?.candidates.at(-1);
  }

  /** 对应原生 HasPendingComboSkill：只检查候选存在，不执行当前连携技能的施放门禁。 */
  hasPendingFor(operatorId: string): boolean {
    return (this.#records.get(operatorId)?.candidates.length ?? 0) > 0;
  }

  open(
    operatorId: string,
    nextSkillKey: string,
    blackboard: Readonly<Record<string, number>> = {},
    nativeCondition?: PendingComboCondition & { readonly skillGroupKey: string },
  ): PendingComboWindow {
    if (operatorId.length === 0) throw new Error('combo window operatorId must not be empty');
    if (nextSkillKey.length === 0) throw new Error('combo window nextSkillKey must not be empty');
    const window: PendingComboWindow = {
      sequence: this.#nextSequence,
      operatorId,
      nextSkillKey,
      openedFrame: this.clock.frame,
      blackboard: Object.freeze({ ...blackboard }),
      ...(nativeCondition === undefined
        ? {}
        : {
            nativeCondition: Object.freeze({
              ...nativeCondition,
              inputTarget: Object.freeze({ ...nativeCondition.inputTarget }),
              triggerTarget:
                nativeCondition.triggerTarget === null
                  ? null
                  : Object.freeze({ ...nativeCondition.triggerTarget }),
              assignPairs:
                nativeCondition.assignPairs === null
                  ? null
                  : Object.freeze({ ...nativeCondition.assignPairs }),
            }),
          }),
      remainingFrames: COMBO_WINDOW_DURATION_FRAMES,
    };
    this.#nextSequence += 1;

    const existing = this.#records.get(operatorId);
    if (existing === undefined) {
      this.#records.set(operatorId, {
        operatorId,
        activationSequence: window.sequence,
        openedFrame: window.openedFrame,
        candidates: [window],
      });
    } else {
      existing.candidates.push(window);
    }

    this.receipt.record({
      frame: this.clock.frame,
      time: this.clock.time,
      event: 'ComboWindowOpened',
      sourceId: operatorId,
      data: {
        windowSequence: window.sequence,
        nextSkillKey,
        blackboardValueCount: Object.keys(window.blackboard).length,
        remainingFrames: window.remainingFrames,
      },
    });
    return window;
  }

  /**
   * 正常输入只允许消费当前激活干员的匹配阶段。
   * 原生释放入口会清空该干员的整条候选记录，而不是只移除选中的目标候选。
   */
  tryConsume(operatorId: string, skillKey: string): boolean {
    return this.consume(operatorId, skillKey).consumed;
  }

  /**
   * 消费当前可交互候选，并为合法性诊断保留失败原因。
   * 本方法不阻止技能执行；调用方决定是否把失败写入回执。
   */
  consume(
    operatorId: string,
    skillKey: string,
    nativeSkillGroupKey?: string,
  ): ComboWindowConsumeResult {
    const active = this.#orderedRecords()[0];
    const candidate = active?.candidates.at(-1);
    if (active === undefined || candidate === undefined) {
      return { consumed: false, reason: 'windowMissing' };
    }
    if (active.operatorId !== operatorId) {
      return { consumed: false, reason: 'releaseOrderMismatch', expected: candidate };
    }
    // 原生候选绑定连携槽，施法时才取当前技能；旧语义窗口仍按多段技能身份严格匹配。
    if (
      candidate.nativeCondition === undefined
        ? candidate.nextSkillKey !== skillKey
        : candidate.nativeCondition.skillGroupKey !== nativeSkillGroupKey
    ) {
      return { consumed: false, reason: 'skillStageMismatch', expected: candidate };
    }
    this.#records.delete(operatorId);
    this.onAllPendingRemoved?.(operatorId);
    this.receipt.record({
      frame: this.clock.frame,
      time: this.clock.time,
      event: 'ComboWindowConsumed',
      sourceId: operatorId,
      data: { windowSequence: candidate.sequence, nextSkillKey: skillKey },
    });
    return { consumed: true, window: candidate };
  }

  setGloballyPaused(paused: boolean): void {
    this.#globallyPaused = paused;
  }

  setOperatorPaused(operatorId: string, paused: boolean): void {
    if (paused) this.#pausedOperators.add(operatorId);
    else this.#pausedOperators.delete(operatorId);
  }

  advanceFrame(): void {
    if (this.#globallyPaused) return;
    for (const record of [...this.#records.values()]) {
      if (this.#pausedOperators.has(record.operatorId)) continue;
      for (const candidate of record.candidates) candidate.remainingFrames -= 1;
      // 原生只在 remainTime < 0 时移除；恰好归零的候选在本帧仍然存在。
      const expired = record.candidates.filter(candidate => candidate.remainingFrames < 0);
      if (expired.length === 0) continue;
      const expiredSequences = new Set(expired.map(candidate => candidate.sequence));
      record.candidates.splice(
        0,
        record.candidates.length,
        ...record.candidates.filter(candidate => !expiredSequences.has(candidate.sequence)),
      );
      for (const window of expired) {
        this.receipt.record({
          frame: this.clock.frame,
          time: this.clock.time,
          event: 'ComboWindowExpired',
          sourceId: window.operatorId,
          data: { windowSequence: window.sequence, nextSkillKey: window.nextSkillKey },
        });
      }
      if (record.candidates.length === 0) {
        this.#records.delete(record.operatorId);
        this.onAllPendingRemoved?.(record.operatorId);
      }
    }
  }

  #orderedRecords(): readonly PendingComboRecord[] {
    return [...this.#records.values()].sort((left, right) => {
      if (left.openedFrame !== right.openedFrame) return left.openedFrame - right.openedFrame;
      const leftOrder = this.#operatorOrder.get(left.operatorId) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = this.#operatorOrder.get(right.operatorId) ?? Number.MAX_SAFE_INTEGER;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.activationSequence - right.activationSequence;
    });
  }
}
