/** 单敌人属性及本次输入提供的目标条件。 */
import type { CombatOperationContext } from '../skills/skillRuntime';
import type { CombatCondition } from '../../game-data/operatorDefinition';
import type { EnemyRank } from '../../game-data/enemyRank';
import type { CombatOperationExecutor } from '../skills/skillRuntime';
import { resolveActionValueOperand } from '../actions/actionBlackboard';
import { compareCombatNumbers } from '../../../../packages/game-data-contract/src/primitives';

/** 读取场景敌人实例捕获的原生 rank；展示 tier 不参与条件求值。 */
export class EnemyRankConditionExecutor implements CombatOperationExecutor {
  constructor(
    private readonly rank: EnemyRank,
    private readonly delegate: CombatOperationExecutor,
  ) {}

  execute: CombatOperationExecutor['execute'] = (step, context) =>
    this.delegate.execute(step, context);

  end: NonNullable<CombatOperationExecutor['end']> = (step, context) =>
    this.delegate.end?.(step, context);

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (condition.kind === 'enemyRankIn') return condition.ranks.includes(this.rank);
    return this.delegate.evaluate(condition, context);
  }
}

/** 对运行时捕获的单敌人超级护甲值执行原生浮点容差比较。 */
export class EnemySuperArmorConditionExecutor implements CombatOperationExecutor {
  constructor(
    private readonly superArmor: number,
    private readonly delegate: CombatOperationExecutor,
  ) {}

  execute: CombatOperationExecutor['execute'] = (step, context) =>
    this.delegate.execute(step, context);

  end: NonNullable<CombatOperationExecutor['end']> = (step, context) =>
    this.delegate.end?.(step, context);

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (condition.kind !== 'enemySuperArmorCompare') {
      return this.delegate.evaluate(condition, context);
    }
    if (context === undefined) {
      throw new Error('enemySuperArmorCompare requires a combat operation context');
    }
    return compareCombatNumbers(
      this.superArmor,
      resolveActionValueOperand(condition.value, context.blackboard),
      condition.operator,
    );
  }
}

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
