import type { CombatStepParameters } from '../../../../packages/game-data-contract/src/actions.ts';
import type { BuffIgniteActionSource } from '../source/buffActions.ts';
import type { TargetReferenceSource } from '../source/target.ts';
import {
  requireActionOwnerProjection,
  type CombatActionProjectionContextSource,
} from './combatProjectionCommon.ts';

/** 复用公共点燃步骤。成功目标组尚无运行时回写端口，必须阻断，不能丢掉后续查询依赖。 */
export function projectBuffIgniteAction(
  action: BuffIgniteActionSource,
  path: string,
  context: CombatActionProjectionContextSource,
): { readonly kind: 'igniteBuffs'; readonly parameters: CombatStepParameters['igniteBuffs'] } {
  if (action.successTargetContextKey !== '') {
    throw new Error(`${path}: Ignite success target context is not yet supported`);
  }
  const projectTarget = (
    target: TargetReferenceSource,
  ): CombatStepParameters['igniteBuffs']['target'] => {
    if (
      target.targetSource === 'Context' &&
      context.staticEnemyTargetGroupKeys?.has(target.targetGroupKey)
    ) {
      return 'enemy';
    }
    if (target.targetGroupKey === '') {
      if (target.targetSource === 'Owner') return requireActionOwnerProjection(context, path);
      if (target.targetSource === 'Source') return context.actionSourceTarget;
      if (target.targetSource === 'Target') {
        const projected = context.actionTargetTarget;
        if (
          projected !== 'partyExceptCaster' &&
          projected !== 'partyExceptCasterAndSameCharacterType'
        )
          return projected;
      }
    }
    throw new Error(`${path}: unsupported Ignite source/target ${target.targetSource}`);
  };
  return {
    kind: 'igniteBuffs',
    parameters: {
      target: projectTarget(action.target),
      source: projectTarget(action.source),
      igniteType: action.igniteType,
    },
  };
}
