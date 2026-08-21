import type { CombatCondition } from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import { compareCombatNumbers } from './numericComparison';
import type { CombatOperationExecutor } from './skillRuntime';

/** 求值本次释放显式提供的镜头→目标有符号夹角；空间简化模型不会自行补造该值。 */
export class CameraTargetAngleConditionExecutor implements CombatOperationExecutor {
  constructor(
    private readonly signedAngleDegrees: number | undefined,
    private readonly delegate: CombatOperationExecutor,
  ) {}

  execute: CombatOperationExecutor['execute'] = (step, context) =>
    this.delegate.execute(step, context);

  end: NonNullable<CombatOperationExecutor['end']> = (step, context) =>
    this.delegate.end?.(step, context);

  evaluate(
    condition: CombatCondition,
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    if (condition.kind !== 'cameraToTargetAngleCompare') {
      return this.delegate.evaluate(condition, context);
    }
    if (context === undefined) {
      throw new Error('cameraToTargetAngleCompare requires a combat operation context');
    }
    if (this.signedAngleDegrees === undefined) {
      throw new Error('skill cast requires cameraToTargetSignedAngleDegrees simulation input');
    }
    return compareCombatNumbers(
      this.signedAngleDegrees,
      resolveActionValueOperand(condition.value, context.blackboard),
      condition.operator,
    );
  }
}
