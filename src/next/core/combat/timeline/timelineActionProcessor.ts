/**
 * 编译后时间轴行为与固定帧战斗时钟之间的调度层。
 * 输入必须预先按起始帧编译完成；同帧原生排序未知时仅使用有记录的确定性回退。
 */
import type { ActionSequence } from '../actions/actionSequence';
import type { CombatExecutionContext } from '../actions/combatStep';

/** 固定帧调度器消费的不可变行为区间。 */
export interface TimelineAction {
  readonly startFrame: number;
  readonly endFrame?: number;
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
  readonly #active: IndexedTimelineAction[] = [];
  #nextPendingIndex = 0;

  constructor(actions: readonly TimelineAction[], lifecycle: TimelineActionLifecycleSink = {}) {
    actions.forEach((action, index) => {
      if (!Number.isInteger(action.startFrame)) {
        throw new TypeError(`timeline action ${index} must use an integer frame`);
      }
      if (
        action.endFrame !== undefined &&
        (!Number.isInteger(action.endFrame) || action.endFrame < action.startFrame)
      ) {
        throw new TypeError(`timeline action ${index} must use endFrame >= startFrame`);
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
    return this.#nextPendingIndex === this.#actions.length && this.#active.length === 0;
  }

  reset(context: CombatExecutionContext): void {
    this.#nextPendingIndex = 0;
    this.#active.length = 0;
    for (const { action } of this.#actions) action.sequence.reset(context);
  }

  tick(currentFrame: number, deltaTime: number, context: CombatExecutionContext): void {
    // 已开始的区间行为在后续帧继续推进；本帧新开始的行为由下方分支推进一次。
    for (const indexedAction of this.#active) {
      indexedAction.action.sequence.tick(deltaTime, context);
    }

    while (
      this.#nextPendingIndex < this.#actions.length &&
      this.#actions[this.#nextPendingIndex]!.action.startFrame <= currentFrame
    ) {
      const indexedAction = this.#actions[this.#nextPendingIndex]!;
      this.#nextPendingIndex += 1;
      this.#lifecycle.started?.(indexedAction.action, indexedAction.sourceIndex, currentFrame);
      indexedAction.action.sequence.execute(context);
      indexedAction.action.sequence.tick(deltaTime, context);
      if (indexedAction.action.endFrame === undefined) {
        this.#end(indexedAction, currentFrame, context);
      } else {
        this.#active.push(indexedAction);
      }
    }

    for (let index = this.#active.length - 1; index >= 0; index -= 1) {
      const indexedAction = this.#active[index]!;
      if (indexedAction.action.endFrame! > currentFrame) continue;
      this.#active.splice(index, 1);
      this.#end(indexedAction, currentFrame, context);
    }
  }

  /**
   * 将调度游标向前移动到目标帧。
   *
   * 原生 TimelineActionProcessor.JumpTo 的已确认行为是：起始帧严格早于目标帧、
   * 且尚未执行的序列直接标记结束；已经开始并在目标帧前结束的序列正常 End；
   * 跨越目标帧的活动序列继续存活。目标帧上的待执行序列留给下一次 tick 启动。
   * 当前证据只覆盖向前跳转，因此反向跳转在这里显式拒绝。
   */
  jumpTo(destinationFrame: number, currentFrame: number, context: CombatExecutionContext): void {
    if (!Number.isInteger(destinationFrame)) {
      throw new TypeError('timeline jump destination must use an integer frame');
    }
    if (destinationFrame < currentFrame) {
      throw new RangeError('backward timeline jumps are not supported');
    }

    for (let index = this.#active.length - 1; index >= 0; index -= 1) {
      const indexedAction = this.#active[index]!;
      if (indexedAction.action.endFrame! > destinationFrame) continue;
      this.#active.splice(index, 1);
      this.#end(indexedAction, destinationFrame, context);
    }

    while (
      this.#nextPendingIndex < this.#actions.length &&
      this.#actions[this.#nextPendingIndex]!.action.startFrame < destinationFrame
    ) {
      this.#nextPendingIndex += 1;
    }
  }

  end(currentFrame: number, context: CombatExecutionContext): void {
    for (const indexedAction of this.#active) this.#end(indexedAction, currentFrame, context);
    this.#active.length = 0;
  }

  #end(
    indexedAction: IndexedTimelineAction,
    currentFrame: number,
    context: CombatExecutionContext,
  ): void {
    indexedAction.action.sequence.end(context);
    this.#lifecycle.ended?.(indexedAction.action, indexedAction.sourceIndex, currentFrame);
  }
}
