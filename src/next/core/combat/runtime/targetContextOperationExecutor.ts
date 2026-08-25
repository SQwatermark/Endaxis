import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

/** 执行不依赖空间的通用 Context 目标组集合操作。 */
export class TargetContextOperationExecutor implements CombatOperationExecutor {
  constructor(
    readonly operatorId: string,
    readonly delegate: CombatOperationExecutor,
  ) {}

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind !== 'mergeContextTargets') {
      return context === undefined
        ? this.delegate.execute(step)
        : this.delegate.execute(step, context);
    }
    if (context?.targetContext === undefined) {
      throw new Error('mergeContextTargets requires a combat target context');
    }
    const targets: RuntimeTargetRef[] = [];
    for (const source of step.parameters.sources) {
      const additions =
        source.kind === 'context'
          ? context.targetContext.get(source.contextKey)
          : [this.#resolveTarget(source.target, context)];
      for (const target of additions) {
        if (!targets.some(existing => sameTarget(existing, target))) targets.push(target);
      }
    }
    context.targetContext.set(step.parameters.saveToContextKey, targets);
    return true;
  }

  end(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void {
    this.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: CombatOperationContext,
  ): boolean {
    if (condition.kind !== 'contextTargetContains') {
      return context === undefined
        ? this.delegate.evaluate(condition)
        : this.delegate.evaluate(condition, context);
    }
    if (context?.targetContext === undefined) {
      throw new Error('contextTargetContains requires a combat target context');
    }
    const child = this.#resolveTarget(condition.child, context);
    return context.targetContext
      .get(condition.parentContextKey)
      .some(target => sameTarget(target, child));
  }

  #resolveTarget(
    target: 'caster' | 'enemy' | 'eventTarget',
    context: CombatOperationContext,
  ): RuntimeTargetRef {
    if (target === 'caster') return { kind: 'operator', operatorId: this.operatorId };
    if (target === 'enemy') return { kind: 'enemy' };
    const targetId = eventTargetId(context);
    return targetId === 'enemy' ? { kind: 'enemy' } : { kind: 'operator', operatorId: targetId };
  }
}

function eventTargetId(context: CombatOperationContext): string {
  const event = context.event;
  if (event === undefined || !('targetId' in event)) {
    throw new Error('eventTarget requires a combat event with target identity');
  }
  return event.targetId;
}

function sameTarget(left: RuntimeTargetRef, right: RuntimeTargetRef): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind === 'enemy') return true;
  if (left.kind === 'operator' && right.kind === 'operator') {
    return left.operatorId === right.operatorId;
  }
  return (
    left.kind === 'abilityEntity' &&
    right.kind === 'abilityEntity' &&
    left.instanceId === right.instanceId
  );
}
