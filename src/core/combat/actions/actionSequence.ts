/**
 * 复现同一行为序列内同步顺序的通用执行器。
 * 调用方应按真实先后提供步骤；此层不会替调用方重排伤害、附着或 Buff。
 */
import { CombatStep, STEP_RESULT_MODE, type CombatExecutionContext } from './combatStep';

export const COMBAT_STEP_STATE = {
  pending: 'pending',
  started: 'started',
  ticking: 'ticking',
  ended: 'ended',
} as const;

/** 序列内部用于区分尚未开始、持续执行和已经结束的步骤状态。 */
export type CombatStepState = (typeof COMBAT_STEP_STATE)[keyof typeof COMBAT_STEP_STATE];

interface StepEntry {
  step: CombatStep;
  state: CombatStepState;
  executeResult: boolean;
}

/** 按配置数组的顺序同步执行战斗步骤。 */
export class ActionSequence extends CombatStep {
  readonly #entries: StepEntry[];

  constructor(steps: readonly CombatStep[]) {
    super();
    this.#entries = steps.map(step => ({
      step,
      state: COMBAT_STEP_STATE.pending,
      executeResult: false,
    }));
  }

  get isEmpty(): boolean {
    return this.#entries.length === 0;
  }

  override createRuntimeInstance(): ActionSequence {
    return new ActionSequence(this.#entries.map(entry => entry.step.createRuntimeInstance()));
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    for (const entry of this.#entries) {
      if (entry.state === COMBAT_STEP_STATE.ended) continue;
      if (entry.state !== COMBAT_STEP_STATE.pending) return false;

      const resultMode = context.sequence?.resultMode ?? STEP_RESULT_MODE.normal;
      let result = entry.step.tryExecute(context);
      if (resultMode === STEP_RESULT_MODE.invertNextResult) {
        context.sequence!.resultMode = STEP_RESULT_MODE.normal;
        result = !result;
      }

      entry.executeResult = result;
      entry.state = COMBAT_STEP_STATE.started;
      if (!result) return false;
    }
    return true;
  }

  executeInstant(context: CombatExecutionContext): boolean {
    const result = this.tryExecute(context);
    this.end(context);
    this.reset(context);
    return result;
  }

  override reset(context: CombatExecutionContext): void {
    for (const entry of this.#entries) {
      entry.step.reset(context);
      entry.state = COMBAT_STEP_STATE.pending;
      entry.executeResult = false;
    }
  }

  override tick(deltaTime: number, context: CombatExecutionContext): void {
    for (const entry of this.#entries) {
      if (entry.state !== COMBAT_STEP_STATE.started && entry.state !== COMBAT_STEP_STATE.ticking) {
        continue;
      }
      if (!entry.executeResult) continue;

      entry.step.tick(deltaTime, context);
      entry.state = COMBAT_STEP_STATE.ticking;
    }
  }

  override end(context: CombatExecutionContext): void {
    for (const entry of this.#entries) {
      if (entry.state !== COMBAT_STEP_STATE.started && entry.state !== COMBAT_STEP_STATE.ticking) {
        continue;
      }

      entry.step.end(context);
      entry.state = COMBAT_STEP_STATE.ended;
    }
  }
}
