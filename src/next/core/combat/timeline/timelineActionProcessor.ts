/**
 * 编译后时间轴行为与固定帧战斗时钟之间的调度层。
 * 输入必须预先按起始帧编译完成；同帧原生排序未知时仅使用有记录的确定性回退。
 */
import type { ActionSequence } from '../actions/actionSequence';
import type { CombatExecutionContext } from '../actions/combatStep';

/** 固定帧调度器消费的不可变行为区间。 */
export interface TimelineAction {
  readonly startFrame: number;
  readonly sequence: ActionSequence;
}

/** 调度行为开始和结束时调用的同步生命周期端口。 */
export interface TimelineActionLifecycleSink {
  started?(action: TimelineAction, sourceIndex: number, currentFrame: number): void;
  ended?(action: TimelineAction, sourceIndex: number, currentFrame: number): void;
}

interface IndexedTimelineAction {
  readonly action: TimelineAction;
  readonly sourceIndex: number;
}

/**
 * 按固定帧运行行为区间。待执行行为使用游标推进，使每个 Tick
 * 只访问刚开始和当前仍处于活动状态的行为。
 */
export class TimelineActionProcessor {
  readonly #actions: readonly IndexedTimelineAction[];
  readonly #lifecycle: TimelineActionLifecycleSink;
  #nextPendingIndex = 0;

  constructor(actions: readonly TimelineAction[], lifecycle: TimelineActionLifecycleSink = {}) {
    actions.forEach((action, index) => {
      if (!Number.isInteger(action.startFrame)) {
        throw new TypeError(`timeline action ${index} must use an integer frame`);
      }
    });
    // 游戏内同起始帧行为的排序仍未确认；暂时沿用 combat-spec 使用的来源顺序，
    // 作为显式且确定性的回退规则。
    this.#actions = actions
      .map((action, sourceIndex) => ({ action, sourceIndex }))
      .sort(
        (left, right) =>
          left.action.startFrame - right.action.startFrame || left.sourceIndex - right.sourceIndex,
      );
    this.#lifecycle = lifecycle;
  }

  get isComplete(): boolean {
    return this.#nextPendingIndex === this.#actions.length;
  }

  reset(context: CombatExecutionContext): void {
    this.#nextPendingIndex = 0;
    for (const { action } of this.#actions) action.sequence.reset(context);
  }

  tick(currentFrame: number, deltaTime: number, context: CombatExecutionContext): void {
    while (
      this.#nextPendingIndex < this.#actions.length &&
      this.#actions[this.#nextPendingIndex]!.action.startFrame <= currentFrame
    ) {
      const indexedAction = this.#actions[this.#nextPendingIndex]!;
      this.#nextPendingIndex += 1;
      this.#lifecycle.started?.(indexedAction.action, indexedAction.sourceIndex, currentFrame);
      indexedAction.action.sequence.execute(context);
      indexedAction.action.sequence.tick(deltaTime, context);
      this.#end(indexedAction, currentFrame, context);
    }
  }

  end(_currentFrame: number, _context: CombatExecutionContext): void {}

  #end(
    indexedAction: IndexedTimelineAction,
    currentFrame: number,
    context: CombatExecutionContext,
  ): void {
    indexedAction.action.sequence.end(context);
    this.#lifecycle.ended?.(indexedAction.action, indexedAction.sourceIndex, currentFrame);
  }
}
