import type { ActionSequence } from '../actions/actionSequence';
import type { CombatExecutionContext } from '../actions/combatStep';

export interface TimelineAction {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly sequence: ActionSequence;
}

export interface TimelineActionLifecycleSink {
  started?(action: TimelineAction, sourceIndex: number, currentFrame: number): void;
  ended?(action: TimelineAction, sourceIndex: number, currentFrame: number): void;
}

interface IndexedTimelineAction {
  readonly action: TimelineAction;
  readonly sourceIndex: number;
}

interface ActiveTimelineAction {
  readonly indexedAction: IndexedTimelineAction;
  pendingStart: boolean;
}

/**
 * Runs fixed-frame action intervals. Pending actions use a cursor so each tick
 * visits only newly started and currently active actions.
 */
export class TimelineActionProcessor {
  readonly #actions: readonly IndexedTimelineAction[];
  readonly #active: ActiveTimelineAction[] = [];
  readonly #lifecycle: TimelineActionLifecycleSink;
  #nextPendingIndex = 0;

  constructor(actions: readonly TimelineAction[], lifecycle: TimelineActionLifecycleSink = {}) {
    actions.forEach((action, index) => {
      if (!Number.isInteger(action.startFrame) || !Number.isInteger(action.endFrame)) {
        throw new TypeError(`timeline action ${index} must use integer frames`);
      }
      if (action.endFrame < action.startFrame) {
        throw new RangeError(`timeline action ${index} ends before it starts`);
      }
    });
    // The game's equal-start ordering is still unknown; source order is the
    // explicit deterministic fallback also used by combat-spec.
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
    while (
      this.#nextPendingIndex < this.#actions.length &&
      this.#actions[this.#nextPendingIndex]!.action.startFrame <= currentFrame
    ) {
      const indexedAction = this.#actions[this.#nextPendingIndex]!;
      this.#nextPendingIndex += 1;
      this.#active.push({ indexedAction, pendingStart: true });
    }

    let writeIndex = 0;
    for (const activeAction of this.#active) {
      const { indexedAction } = activeAction;
      if (activeAction.pendingStart) {
        activeAction.pendingStart = false;
        this.#lifecycle.started?.(indexedAction.action, indexedAction.sourceIndex, currentFrame);
        indexedAction.action.sequence.execute(context);
      }
      indexedAction.action.sequence.tick(deltaTime, context);
      if (indexedAction.action.endFrame <= currentFrame) {
        this.#end(indexedAction, currentFrame, context);
      } else {
        this.#active[writeIndex] = activeAction;
        writeIndex += 1;
      }
    }
    this.#active.length = writeIndex;
  }

  end(currentFrame: number, context: CombatExecutionContext): void {
    for (const { indexedAction, pendingStart } of this.#active) {
      if (!pendingStart) this.#end(indexedAction, currentFrame, context);
    }
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
