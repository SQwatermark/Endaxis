import type { CombatOperationContext } from './skillRuntime';
import type { CombatCondition } from '../../game-data/operatorDefinition';
import { resolveActionValueOperand } from './actionBlackboard';
import { compareCombatNumbers } from '../../../shared/combatNumericComparison';
import type { CombatOperationExecutor } from './skillRuntime';

/** 求值本次释放显式提供的镜头→目标有符号夹角；空间简化模型不会自行补造该值。 */
export class CameraTargetAngleConditionExecutor implements CombatOperationExecutor {
  constructor(
    private readonly signedAngleDegrees:
      number | undefined | ((context: CombatOperationContext) => number | undefined),
    private readonly delegate: CombatOperationExecutor,
  ) {}

  execute: CombatOperationExecutor['execute'] = (step, context) =>
    this.delegate.execute(step, context);

  end: NonNullable<CombatOperationExecutor['end']> = (step, context) =>
    this.delegate.end?.(step, context);

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (condition.kind !== 'cameraToTargetAngleCompare') {
      return this.delegate.evaluate(condition, context);
    }
    if (context === undefined) {
      throw new Error('cameraToTargetAngleCompare requires a combat operation context');
    }
    const angle =
      typeof this.signedAngleDegrees === 'function'
        ? this.signedAngleDegrees(context)
        : this.signedAngleDegrees;
    if (angle === undefined) {
      throw new Error('skill cast requires cameraToTargetSignedAngleDegrees simulation input');
    }
    return compareCombatNumbers(
      angle,
      resolveActionValueOperand(condition.value, context.blackboard),
      condition.operator,
    );
  }
}
