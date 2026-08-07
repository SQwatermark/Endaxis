export const STEP_RESULT_MODE = {
  normal: 'normal',
  invertNextResult: 'invertNextResult',
} as const;

export type StepResultMode = (typeof STEP_RESULT_MODE)[keyof typeof STEP_RESULT_MODE];

export interface SequenceExecutionState {
  resultMode: StepResultMode;
}

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
