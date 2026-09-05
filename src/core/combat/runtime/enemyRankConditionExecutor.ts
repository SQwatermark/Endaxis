import type { CombatCondition } from '../../game-data/operatorDefinition';
import type { EnemyRank } from '../../game-data/enemyRank';
import type { CombatOperationExecutor } from './skillRuntime';

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

  evaluate(
    condition: CombatCondition,
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    if (condition.kind === 'enemyRankIn') return condition.ranks.includes(this.rank);
    return this.delegate.evaluate(condition, context);
  }
}
