/**
 * 战斗原语与有序序列执行器之间的最小执行协议。
 * 新步骤应通过明确实现接入；不能把未知步骤当作成功空操作，也不能在这里引入 UI 语义。
 */
export const STEP_RESULT_MODE = {
  normal: 'normal',
  invertNextResult: 'invertNextResult',
} as const;

/** 步骤执行后对当前序列流程的控制结果。 */
export type StepResultMode = (typeof STEP_RESULT_MODE)[keyof typeof STEP_RESULT_MODE];

/** 同一序列执行期间由步骤共享的流程状态。 */
export interface SequenceExecutionState {
  resultMode: StepResultMode;
}

/** 单个步骤执行时可访问的序列上下文；后续运行时端口应显式扩展。 */
export interface CombatExecutionContext {
  sequence?: SequenceExecutionState;
}

/** 战斗序列中的一个可执行操作。 */
export abstract class CombatStep {
  createRuntimeInstance(): CombatStep {
    return this;
  }

  reset(_context: CombatExecutionContext): void {}

  abstract execute(context: CombatExecutionContext): void;

  tryExecute(context: CombatExecutionContext): boolean {
    this.execute(context);
    return true;
  }

  tick(_deltaTime: number, _context: CombatExecutionContext): void {}

  end(_context: CombatExecutionContext): void {}
}
