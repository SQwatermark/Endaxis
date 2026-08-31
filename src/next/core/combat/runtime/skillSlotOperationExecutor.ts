/** 切换稳定技能组后续释放形态；当前释放已经持有的 SkillRuntime 引用不会改变。 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatOperationExecutor } from './skillRuntime';
import type { NativeSkillType } from '../../game-data/operatorDefinition';

export interface SkillSlotOperationExecutorOptions {
  readonly changeSkillSlot: (
    skillGroupKey: string,
    targetSkillKey: string,
    inheritOriginSkillCooldownProgress: boolean,
  ) => void;
  readonly replaceSkillSlot?: (parameters: {
    readonly skillGroupKey: string;
    readonly targetSkillKey: string;
    readonly revertedSkillKey?: string;
    readonly inheritOriginSkillCooldownProgress: boolean;
  }) => { finish(): void };
  readonly activatePlayerActionMode?: (modeId: string) => { finish(): void };
  readonly changeNativeSkillType?: (skillKey: string, nativeSkillType: NativeSkillType) => void;
  readonly delegate: CombatOperationExecutor;
}

export class SkillSlotOperationExecutor implements CombatOperationExecutor {
  readonly #replacementHandles = new WeakMap<ResolvedCombatOperationStep, { finish(): void }>();
  readonly #modeHandles = new WeakMap<ResolvedCombatOperationStep, { finish(): void }>();

  constructor(readonly options: SkillSlotOperationExecutorOptions) {}

  execute(
    step: ResolvedCombatOperationStep,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'changePlayerActionMode') {
      const activate = this.options.activatePlayerActionMode;
      if (activate === undefined) throw new Error('native player-action mode requires a handle');
      this.#modeHandles.get(step)?.finish();
      this.#modeHandles.set(step, activate(step.parameters.modeId));
      return true;
    }
    if (step.kind === 'changeNativeSkillType') {
      const change = this.options.changeNativeSkillType;
      if (change === undefined) throw new Error('native SkillType mutation is unavailable');
      change(step.parameters.targetSkillKey, step.parameters.nativeSkillType);
      return true;
    }
    if (step.kind !== 'changeSkillSlot') {
      return context === undefined
        ? this.options.delegate.execute(step)
        : this.options.delegate.execute(step, context);
    }
    if (step.parameters.lifetime !== undefined) {
      const replace = this.options.replaceSkillSlot;
      if (replace === undefined) throw new Error('native skill-slot replacement requires a handle');
      const previous = this.#replacementHandles.get(step);
      previous?.finish();
      this.#replacementHandles.set(
        step,
        replace({
          skillGroupKey: step.parameters.skillGroupKey,
          targetSkillKey: step.parameters.targetSkillKey,
          ...(step.parameters.revertedSkillKey === undefined
            ? {}
            : { revertedSkillKey: step.parameters.revertedSkillKey }),
          inheritOriginSkillCooldownProgress:
            step.parameters.inheritOriginSkillCooldownProgress ?? false,
        }),
      );
    } else {
      this.options.changeSkillSlot(
        step.parameters.skillGroupKey,
        step.parameters.targetSkillKey,
        step.parameters.inheritOriginSkillCooldownProgress ?? false,
      );
    }
    return true;
  }

  end(
    step: ResolvedCombatOperationStep,
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    if (step.kind === 'changeSkillSlot') {
      if (step.parameters.lifetime === 'finishByAction') {
        this.#replacementHandles.get(step)?.finish();
        this.#replacementHandles.delete(step);
      }
      return;
    }
    if (step.kind === 'changePlayerActionMode') {
      this.#modeHandles.get(step)?.finish();
      this.#modeHandles.delete(step);
      return;
    }
    this.options.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.options.delegate.evaluate(condition)
      : this.options.delegate.evaluate(condition, context);
  }
}
