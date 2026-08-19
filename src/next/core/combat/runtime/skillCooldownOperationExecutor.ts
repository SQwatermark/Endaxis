import type { CombatStepParameters } from '../../game-data/operatorDefinition';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import { resolveActionValueOperand } from './actionBlackboard';
import { COMBAT_FRAMES_PER_SECOND } from './combatClock';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

export interface SkillCooldownOperationExecutorOptions {
  readonly reduceByBaseDurationRatio: (
    skill: CombatStepParameters['adjustSkillCooldown']['skill'],
    ratio: number,
  ) => number;
  readonly reduceByAbsoluteFrames: (
    skill: CombatStepParameters['adjustSkillCooldown']['skill'],
    frames: number,
  ) => number;
  readonly setByBaseDurationRatio: (
    skill: CombatStepParameters['adjustSkillCooldown']['skill'],
    ratio: number,
  ) => number;
  readonly setByAbsoluteFrames: (
    skill: CombatStepParameters['adjustSkillCooldown']['skill'],
    frames: number,
  ) => number;
  readonly delegate: CombatOperationExecutor;
}

/** 执行以施法者技能类型为范围的原生立即冷却修改。 */
export class SkillCooldownOperationExecutor implements CombatOperationExecutor {
  constructor(readonly options: SkillCooldownOperationExecutorOptions) {}

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind !== 'adjustSkillCooldown') {
      return context === undefined
        ? this.options.delegate.execute(step)
        : this.options.delegate.execute(step, context);
    }
    if (context === undefined) {
      throw new Error('adjustSkillCooldown requires a combat operation context');
    }
    const value = resolveActionValueOperand(step.parameters.value, context.blackboard);
    const { operation, basis, skill } = step.parameters;
    if (operation === 'reduce' && basis === 'baseDurationRatio') {
      this.options.reduceByBaseDurationRatio(skill, value);
    } else if (operation === 'reduce' && basis === 'absoluteSeconds') {
      this.options.reduceByAbsoluteFrames(skill, value * COMBAT_FRAMES_PER_SECOND);
    } else if (operation === 'set' && basis === 'baseDurationRatio') {
      this.options.setByBaseDurationRatio(skill, value);
    } else if (operation === 'set' && basis === 'absoluteSeconds') {
      this.options.setByAbsoluteFrames(skill, value * COMBAT_FRAMES_PER_SECOND);
    } else {
      throw new Error(`unsupported skill cooldown adjustment '${operation}/${basis}'`);
    }
    return true;
  }

  end(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void {
    if (step.kind === 'adjustSkillCooldown') return;
    this.options.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: CombatOperationContext,
  ): boolean {
    return context === undefined
      ? this.options.delegate.evaluate(condition)
      : this.options.delegate.evaluate(condition, context);
  }
}
