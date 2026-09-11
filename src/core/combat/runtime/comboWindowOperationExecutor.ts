import type { CombatCondition } from '../../game-data/operatorDefinition';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
/** 把技能调度中的开启连携窗口步骤接到场景级连携账本。 */
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { ComboWindowRuntime } from './comboWindowRuntime';
import { COMBAT_FRAMES_PER_SECOND } from './combatClock';
import { resolveActionValueOperand } from './actionBlackboard';

export class ComboWindowOperationExecutor implements CombatOperationExecutor {
  readonly #qteRegistrations = new WeakMap<
    ResolvedCombatOperationStep,
    WeakMap<CombatOperationContext, number>
  >();
  constructor(
    readonly operatorId: string,
    readonly windows: ComboWindowRuntime,
    readonly delegate: CombatOperationExecutor,
    readonly resolveCurrentSkillKey: (
      skillGroupKey: 'comboSkill',
      operatorId: string,
    ) => string = () => {
      throw new Error('current combo skill slot resolver is unavailable');
    },
  ) {}

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind === 'openComboWindow') {
      let ownerId = this.operatorId;
      if ('ownerContextKey' in step.parameters && step.parameters.ownerContextKey !== undefined) {
        if (context?.targetContext === undefined)
          throw new Error('combo window owner requires target context');
        const owner = context.targetContext.get(step.parameters.ownerContextKey)[0];
        // 原生只取首个 owner，并要求角色；不能回退到触发者或改找组内其他角色。
        if (owner?.kind !== 'operator') return true;
        ownerId = owner.operatorId;
      }
      this.windows.open(
        ownerId,
        'nextSkillKey' in step.parameters
          ? step.parameters.nextSkillKey
          : this.resolveCurrentSkillKey(step.parameters.nextSkillKeyFromSlot, ownerId),
      );
      return true;
    }
    if (step.kind === 'showComboRingQte') {
      if (context === undefined) throw new Error('combo ring QTE requires an operation context');
      const earlyDurationSeconds = resolveActionValueOperand(
        step.parameters.earlyDurationSeconds,
        context.blackboard,
      );
      const activeDurationSeconds = resolveActionValueOperand(
        step.parameters.activeDurationSeconds,
        context.blackboard,
      );
      const registrations =
        this.#qteRegistrations.get(step) ?? new WeakMap<CombatOperationContext, number>();
      registrations.set(
        context,
        this.windows.registerRingQte(
          this.operatorId,
          Math.fround(earlyDurationSeconds) * COMBAT_FRAMES_PER_SECOND,
          Math.fround(activeDurationSeconds) * COMBAT_FRAMES_PER_SECOND,
        ),
      );
      this.#qteRegistrations.set(step, registrations);
      return true;
    }
    return context === undefined
      ? this.delegate.execute(step)
      : this.delegate.execute(step, context);
  }

  end(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void {
    if (step.kind === 'openComboWindow') return;
    if (step.kind === 'showComboRingQte') {
      if (context === undefined) return;
      const registrations = this.#qteRegistrations.get(step);
      const registration = registrations?.get(context);
      if (registration !== undefined) this.windows.unregisterRingQte(registration);
      registrations?.delete(context);
      return;
    }
    if (context === undefined) this.delegate.end?.(step);
    else this.delegate.end?.(step, context);
  }

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (condition.kind === 'casterComboPending') return this.windows.hasPending(this.operatorId);
    if (condition.kind === 'eventComboRingQteSucceeded') {
      const skillCastId = context?.eventSkillCastInfo?.skillCastId;
      if (skillCastId === undefined)
        throw new Error('combo ring QTE success requires a skill cast event context');
      return this.windows.wasRingQteSuccessful(skillCastId);
    }
    return context === undefined
      ? this.delegate.evaluate(condition)
      : this.delegate.evaluate(condition, context);
  }
}
