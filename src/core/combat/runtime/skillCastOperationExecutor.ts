import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

type CastStep = Extract<ResolvedCombatOperationStep, { kind: 'castSkillDuringAction' }>;

export interface SkillCastOperationExecutorDependencies {
  readonly request: (request: {
    readonly nativeSkillId: string;
    readonly skipApplyCost: boolean;
    readonly inheritedSkillCastInfo?: CombatSkillCastInfo;
    readonly interruptCurrentSkillOnlyWhenTargetCastable?: boolean;
  }) => void;
  readonly delegate: CombatOperationExecutor;
}

/** 对应 AbilitySystem.m_postSkillTryCastRequest：同步动作只覆盖写单槽请求。 */
export class SkillCastOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: SkillCastOperationExecutorDependencies) {}

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind !== 'castSkillDuringAction') {
      return this.dependencies.delegate.execute(step, context);
    }
    this.#request(step, context);
    return true;
  }

  end(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void {
    if (step.kind === 'castSkillDuringAction') return;
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: CombatOperationContext,
  ): boolean {
    return this.dependencies.delegate.evaluate(condition, context);
  }

  #request(step: CastStep, context: CombatOperationContext | undefined): void {
    if (step.parameters.target !== 'enemy' && step.parameters.target !== 'caster') {
      throw new Error(`unsupported deferred skill cast target '${step.parameters.target}'`);
    }
    const inherited = step.parameters.inheritSourceSkillCastInfo
      ? context?.skillCastInfo
      : undefined;
    if (step.parameters.inheritSourceSkillCastInfo && inherited === undefined) {
      throw new Error('deferred skill cast requires source SkillCastInfo');
    }
    this.dependencies.request({
      nativeSkillId: step.parameters.skillId,
      skipApplyCost: step.parameters.skipApplyCost,
      ...(step.parameters.interruptCurrentSkillOnlyWhenTargetCastable
        ? { interruptCurrentSkillOnlyWhenTargetCastable: true }
        : {}),
      ...(inherited === undefined ? {} : { inheritedSkillCastInfo: inherited }),
    });
  }
}
