import type { SkillGlobalBuffDefinition } from '../../game-data/operatorDefinition';
import type {
  ResolvedCombatOperationStep,
  ResolvedSkillBuffDefinition,
} from '../../compiler/combatProgram';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import { ActionBlackboard, resolveActionValueOperand } from './actionBlackboard';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { BuffApplicationHandle, BuffOperationTarget } from './buffOperationExecutor';
import type { BuffApplicationSource } from '../../game-data/operatorDefinition';

type CreateStep = Extract<ResolvedCombatOperationStep, { kind: 'createGlobalBuff' }>;

interface GlobalBuffInstance {
  readonly id: string;
  readonly definition: SkillGlobalBuffDefinition;
  readonly children: BuffApplicationHandle[];
  remainingDuration: number | null;
  finished: boolean;
  finish(reason: 'early' | 'other'): boolean;
}

/**
 * 单场战斗唯一的 GlobalBuff 实例目录。父实例保留精确身份，子 Buff 只负责把行为
 * 投影到队员 AbilitySystem；任何一个子节点消费父层时都清理同一父实例的全部镜像。
 */
export class GlobalBuffRuntime {
  readonly #groups = new Map<string, GlobalBuffInstance[]>();

  constructor(
    readonly resolvePartyTargets: () => readonly BuffOperationTarget[],
    readonly resolveBuffDefinition: (
      sourceOperatorId: string,
      buffId: string,
    ) => ResolvedSkillBuffDefinition | undefined,
  ) {}

  add(input: {
    readonly id: string;
    readonly definition: SkillGlobalBuffDefinition;
    readonly sourceId: string;
    readonly sourceActionId?: string;
    readonly blackboardValues: Readonly<Record<string, number>>;
  }): GlobalBuffInstance {
    const { id, definition, sourceId, sourceActionId, blackboardValues } = input;
    if (definition.children.length === 0) {
      throw new Error(`global buff '${id}' requires at least one child Buff`);
    }
    const group = this.#groups.get(id) ?? [];
    const active = group.filter(instance => !instance.finished);
    if (definition.stackingType === 'stack') {
      const maximum = definition.maxStackCount;
      if (maximum === undefined || !Number.isInteger(maximum) || maximum <= 0) {
        throw new Error(`global buff '${id}' stack requires a positive integer maximum`);
      }
      if (active.length >= maximum) active[0]!.finish('other');
    } else if (definition.stackingType !== 'unlimited') {
      throw new Error(`global buff '${id}' stacking '${definition.stackingType}' is unsupported`);
    }
    const blackboard = new ActionBlackboard(definition.blackboard);
    blackboard.assign(blackboardValues);
    const duration = resolveGlobalDuration(id, definition, blackboard);
    const instance: GlobalBuffInstance = {
      id,
      definition,
      children: [],
      remainingDuration: duration,
      finished: false,
      finish(reason) {
        if (this.finished) return false;
        this.finished = true;
        for (const child of [...this.children]) child.finish(reason);
        this.children.length = 0;
        return true;
      },
    };
    group.push(instance);
    this.#groups.set(id, group);
    try {
      for (const target of this.resolvePartyTargets()) {
        if (target.applyScoped === undefined) {
          throw new Error(`global buff child target '${target.ownerId}' is not scoped`);
        }
        for (const child of definition.children) {
          const childDefinition = this.resolveBuffDefinition(sourceId, child.buffId);
          if (childDefinition === undefined) {
            throw new Error(`global buff '${id}' child definition '${child.buffId}' is missing`);
          }
          const handle = target.applyScoped({
            buffId: child.buffId,
            definition: childDefinition,
            sourceId,
            ...(sourceActionId === undefined ? {} : { sourceActionId }),
            blackboardValues: Object.fromEntries(
              Object.entries(child.blackboardAssignments).map(([key, value]) => [
                key,
                resolveActionValueOperand(value, blackboard),
              ]),
            ),
            finishParentGlobalBuff: reason => instance.finish(reason),
          });
          if (handle !== null) instance.children.push(handle);
        }
      }
    } catch (error) {
      instance.finish('other');
      throw error;
    }
    return instance;
  }

  advanceFrame(): void {
    for (const group of this.#groups.values()) {
      for (const instance of group) {
        if (instance.finished || instance.remainingDuration === null) continue;
        instance.remainingDuration -= COMBAT_FRAME_INTERVAL;
        if (instance.remainingDuration <= 1e-8) instance.finish('other');
      }
    }
  }
}

function resolveGlobalDuration(
  id: string,
  definition: SkillGlobalBuffDefinition,
  blackboard: ActionBlackboard,
): number | null {
  const duration = definition.durationSeconds;
  if (duration === undefined) return null;
  const value =
    typeof duration === 'number' ? duration : blackboard.getNumber(duration.blackboardKey);
  if (value === undefined || !Number.isFinite(value) || value < 0) {
    throw new Error(`global buff '${id}' duration is missing or invalid`);
  }
  return value;
}

export interface GlobalBuffOperationDependencies {
  readonly sourceId: string;
  readonly sourceActionId?: string;
  readonly runtime: GlobalBuffRuntime;
  readonly resolveSource: (
    source: BuffApplicationSource,
    context?: CombatOperationContext,
  ) => string;
  readonly delegate: CombatOperationExecutor;
}

export class GlobalBuffOperationExecutor implements CombatOperationExecutor {
  readonly #actionDurationInstances = new WeakMap<CreateStep, readonly GlobalBuffInstance[]>();

  constructor(readonly dependencies: GlobalBuffOperationDependencies) {}

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind === 'finishParentGlobalBuff') {
      if (context?.finishParentGlobalBuff === undefined) {
        throw new Error('finishParentGlobalBuff requires a GlobalBuff child lifecycle context');
      }
      return context.finishParentGlobalBuff(step.parameters.reason);
    }
    if (step.kind !== 'createGlobalBuff') return this.dependencies.delegate.execute(step, context);
    if (context === undefined) throw new Error('createGlobalBuff requires an action blackboard');
    if (step.parameters.finishByAction && this.#actionDurationInstances.has(step)) {
      throw new Error('action-duration createGlobalBuff step is already active');
    }
    const count =
      step.parameters.count === undefined
        ? 1
        : resolveActionValueOperand(step.parameters.count, context.blackboard);
    if (!Number.isFinite(count)) throw new RangeError('createGlobalBuff count must be finite');
    const sourceId =
      step.parameters.source === undefined
        ? this.dependencies.sourceId
        : this.dependencies.resolveSource(step.parameters.source, context);
    const created: GlobalBuffInstance[] = [];
    for (let index = 0; index < count; index += 1) {
      created.push(
        this.dependencies.runtime.add({
          id: step.parameters.globalBuffId,
          definition: step.parameters.definition,
          sourceId,
          sourceActionId: this.dependencies.sourceActionId,
          blackboardValues: Object.fromEntries(
            Object.entries(step.parameters.blackboardAssignments ?? {}).map(([key, value]) => [
              key,
              resolveActionValueOperand(value, context.blackboard),
            ]),
          ),
        }),
      );
    }
    if (step.parameters.finishByAction) this.#actionDurationInstances.set(step, created);
    return true;
  }

  end(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void {
    if (step.kind === 'createGlobalBuff' && step.parameters.finishByAction) {
      for (const instance of this.#actionDurationInstances.get(step) ?? [])
        instance.finish('other');
      this.#actionDurationInstances.delete(step);
      return;
    }
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: CombatOperationContext,
  ): boolean {
    return this.dependencies.delegate.evaluate(condition, context);
  }
}
