import { skillAbilityEvent } from '../events/combatAbilityEvent';
/**
 * 把编译后的有序步骤绑定到 Buff 的同步生命周期边界。
 * 每个 Buff 实例独占动作黑板和 once 状态；调用方仍需提供完整战斗操作链。
 */
import type {
  CompiledTimelineAction,
  ResolvedActionSequence,
  ResolvedSkillBuffAbilityEventResponse,
  ResolvedSkillBuffIgniteEventResponse,
  ResolvedSkillBuffLifecycleSequences,
} from '../../compiler/combatProgram';
import type {
  BuffDuringEnableAction,
  BuffLifecycleActions,
  CombatBuff,
  CombatBuffDefinition,
} from '../buffs/combatBuffs';
import type { CombatExecutionContext } from '../actions/combatStep';
import { TimelineActionProcessor } from '../timeline/timelineActionProcessor';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { ActionSequence } from '../actions/actionSequence';
import { COMBAT_FRAMES_PER_SECOND } from './combatClock';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { AbilityEventRuntimeActionContext } from '../events/abilityEventActionContext';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import { createDamageModifierConditionProgram } from './damageModifierSequenceRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { KnockDownOutputEvent } from './combatSemanticEventRuntime';
import type { SkillBuffSlotReplacement } from '../../game-data/operatorDefinition';
import { type AbilityResponseEventName } from '../events/combatAbilityEvent';
import {
  withAbilityEventResponseContext,
  withCombatEventResponseContext,
} from './abilityEventResponseContext';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { CombatAbilityEvent } from '../events/combatAbilityEvent';

/** 由 Buff 所有者环境提供的事件注册端口，避免生命周期层依赖具体伤害环境。 */
export type RegisterBuffAbilityEventAction = (
  event: AbilityResponseEventName,
  priority: number,
  handle: (
    published: CombatAbilityEvent<AbilityResponseEventName>,
    actionContext?: AbilityEventRuntimeActionContext,
  ) => void,
) => AbilityEventRegistration;

export type RegisterBuffSemanticEventAction = (
  event: 'outputKnockDown',
  priority: number,
  handle: (event: KnockDownOutputEvent, actionContext?: AbilityEventRuntimeActionContext) => void,
) => AbilityEventRegistration;

/** 原生 RegisterEvent 回调阶段；不进入 SequenceAction 优先级队列。 */
export type RegisterBuffAbilityEventCallback = (
  event: AbilityResponseEventName,
  handle: (published: CombatAbilityEvent<AbilityResponseEventName>) => void,
) => AbilityEventRegistration;

class BuffScheduledSequenceAction<Key extends string> implements BuffDuringEnableAction<Key> {
  readonly #context: CombatExecutionContext = {};
  readonly #actions: readonly CompiledTimelineAction[];
  readonly #runtimeFor: (buff: CombatBuff<Key>) => CombatActionSequenceRuntime;
  #timeline: TimelineActionProcessor | null = null;
  #passedFrames = 0;

  constructor(
    actions: readonly CompiledTimelineAction[],
    runtimeFor: (buff: CombatBuff<Key>) => CombatActionSequenceRuntime,
  ) {
    this.#actions = actions;
    this.#runtimeFor = runtimeFor;
  }

  createRuntimeInstance(): BuffDuringEnableAction<Key> {
    return new BuffScheduledSequenceAction(this.#actions, this.#runtimeFor);
  }

  tryExecute(buff: CombatBuff<Key>): boolean {
    if (this.#timeline !== null) throw new Error(`Buff '${buff.definition.id}' timeline is active`);
    const runtime = this.#runtimeFor(buff);
    this.#timeline = new TimelineActionProcessor(
      this.#actions.map(action => ({
        startFrame: action.startFrame,
        ...(action.endFrame === undefined ? {} : { endFrame: action.endFrame }),
        sequence: runtime.createSequence(action.sequence),
      })),
    );
    this.#passedFrames = 0;
    this.#timeline.reset(this.#context);
    this.#timeline.tick(0, 0, this.#context);
    return true;
  }

  tick(deltaTime: number): void {
    if (this.#timeline === null || this.#timeline.isComplete) return;
    this.#passedFrames += deltaTime * COMBAT_FRAMES_PER_SECOND;
    this.#timeline.tick(this.#passedFrames, deltaTime, this.#context);
  }

  end(): void {
    this.#timeline?.end(this.#passedFrames, this.#context);
  }

  reset(): void {
    this.#timeline = null;
    this.#passedFrames = 0;
  }
}

class BuffSkillSlotReplacementAction<Key extends string> implements BuffDuringEnableAction<Key> {
  #active = false;

  constructor(
    readonly replacements: readonly SkillBuffSlotReplacement[],
    readonly resolveOperations: (buff: CombatBuff<Key>) => CombatOperationExecutor,
  ) {}

  createRuntimeInstance(): BuffDuringEnableAction<Key> {
    return new BuffSkillSlotReplacementAction(this.replacements, this.resolveOperations);
  }

  tryExecute(buff: CombatBuff<Key>): boolean {
    if (this.#active)
      throw new Error(`buff '${buff.definition.id}' skill slots are already replaced`);
    const operations = this.resolveOperations(buff);
    let applied = 0;
    try {
      for (const replacement of this.replacements) {
        operations.execute({
          kind: 'changeSkillSlot',
          parameters: {
            skillGroupKey: replacement.skillGroupKey,
            targetSkillKey: replacement.targetSkillKey,
            inheritOriginSkillCooldownProgress: replacement.inheritOriginSkillCooldownProgress,
          },
        });
        applied += 1;
      }
      this.#active = true;
      return true;
    } catch (error) {
      for (const replacement of this.replacements.slice(0, applied).reverse()) {
        operations.execute({
          kind: 'changeSkillSlot',
          parameters: {
            skillGroupKey: replacement.skillGroupKey,
            targetSkillKey: replacement.revertedSkillKey,
            inheritOriginSkillCooldownProgress: replacement.inheritOriginSkillCooldownProgress,
          },
        });
      }
      throw error;
    }
  }

  tick(): void {}

  end(buff: CombatBuff<Key>): void {
    if (!this.#active) return;
    const operations = this.resolveOperations(buff);
    for (const replacement of [...this.replacements].reverse()) {
      operations.execute({
        kind: 'changeSkillSlot',
        parameters: {
          skillGroupKey: replacement.skillGroupKey,
          targetSkillKey: replacement.revertedSkillKey,
          inheritOriginSkillCooldownProgress: replacement.inheritOriginSkillCooldownProgress,
        },
      });
    }
    this.#active = false;
  }

  reset(): void {
    this.#active = false;
  }
}

class CompositeBuffDuringEnableAction<Key extends string> implements BuffDuringEnableAction<Key> {
  constructor(readonly actions: readonly BuffDuringEnableAction<Key>[]) {}

  createRuntimeInstance(): BuffDuringEnableAction<Key> {
    return new CompositeBuffDuringEnableAction(
      this.actions.map(action => action.createRuntimeInstance()),
    );
  }

  tryExecute(buff: CombatBuff<Key>): boolean {
    for (const action of this.actions) {
      if (!action.tryExecute(buff)) return false;
    }
    return true;
  }

  tick(deltaTime: number, buff: CombatBuff<Key>): void {
    for (const action of this.actions) action.tick(deltaTime, buff);
  }

  end(buff: CombatBuff<Key>): void {
    for (const action of [...this.actions].reverse()) action.end(buff);
  }

  reset(buff: CombatBuff<Key>): void {
    for (const action of this.actions) action.reset(buff);
  }
}

export type RegisterPostSkillCastRequest = (handle: (info: CombatSkillCastInfo | null) => void) => {
  dispose(): void;
};

/** 为一份已编译 Buff 定义安装同步生命周期序列。 */
export function attachBuffLifecycleSequences<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  sequences: ResolvedSkillBuffLifecycleSequences,
  resolveOperations: (
    buff: CombatBuff<Key>,
    actionSourceId?: string,
    skillCastInfo?: CombatSkillCastInfo | null,
  ) => CombatOperationExecutor,
  currentTarget?: RuntimeTargetRef,
  abilityEventResponses: readonly ResolvedSkillBuffAbilityEventResponse[] = [],
  registerAbilityEventAction?: RegisterBuffAbilityEventAction,
  scheduledSequences: readonly CompiledTimelineAction[] = [],
  igniteEventResponses: readonly ResolvedSkillBuffIgniteEventResponse[] = [],
  skillSlotReplacements: readonly SkillBuffSlotReplacement[] = [],
  registerSemanticEventAction?: RegisterBuffSemanticEventAction,
  damageModifierConditionPrograms: readonly (ResolvedActionSequence | undefined)[] = [],
  registerAbilityEventCallback?: RegisterBuffAbilityEventCallback,
  registerPostSkillCastRequest?: RegisterPostSkillCastRequest,
): CombatBuffDefinition<Key> {
  if (definition.actions !== undefined) {
    throw new Error(
      `buff '${definition.id}' cannot mix legacy lifecycle actions with ordered lifecycle sequences`,
    );
  }

  const runtimes = new WeakMap<CombatBuff<Key>, CombatActionSequenceRuntime>();
  const eventRegistrations = new WeakMap<CombatBuff<Key>, AbilityEventRegistration[]>();
  const activeEnableSequences = new WeakMap<CombatBuff<Key>, ActionSequence>();
  const triggerSequences = new WeakMap<CombatBuff<Key>, ActionSequence>();
  const runtimeFor = (buff: CombatBuff<Key>): CombatActionSequenceRuntime => {
    let runtime = runtimes.get(buff);
    if (runtime !== undefined) return runtime;
    const context: CombatOperationContext = {
      blackboard: buff.blackboard,
      canExecuteAction: () => buff.isEnabled && !buff.isFinished,
      damageCalculationSnapshots: new Map(),
      targetContext: new RuntimeTargetContext(),
      ...(currentTarget === undefined ? {} : { currentTarget }),
      ...(buff.skillCastInfo === null ? {} : { skillCastInfo: buff.skillCastInfo }),
      buffSourceId: buff.sourceId,
      buffOwnerId: buff.owner.ownerId,
      executingBuff: {
        buffId: buff.definition.id,
        buffOwnerId: buff.owner.ownerId,
        buffInstanceId: buff.instanceId,
      },
      finishCurrentBuff: (reason, sourceId, skillCastInfo) =>
        buff.owner.finishInstance(buff, reason, sourceId, skillCastInfo),
      bindCurrentBuffSkillAffix: skillCastId => {
        if (registerAbilityEventCallback === undefined)
          throw new Error('SkillAffix requires Buff ability-event registration');
        buff.recordBuffAffixSkillCastId(skillCastId);
        let references = 1;
        let pendingRequest = false;
        let disposed = false;
        const registrations: AbilityEventRegistration[] = [];
        const objectReferences = new Set<{ dispose(): void }>();
        const registration = {
          dispose: () => {
            if (disposed) return;
            disposed = true;
            pendingRequest = false;
            for (const handle of registrations) handle.dispose();
            for (const handle of objectReferences) handle.dispose();
            objectReferences.clear();
          },
        };
        const decreaseReference = () => {
          if (disposed || --references > 0) return;
          // Native SkillAffix._DecreaseRefCount ends with Other and an empty cast context.
          if (buff.finish('other', null)) registration.dispose();
        };
        const handle = (published: CombatAbilityEvent<AbilityResponseEventName>) => {
          if (disposed) return;
          if (
            published.event === 'abilityEntitySpawned' ||
            published.event === 'projectileLaunched'
          ) {
            if (
              published.payload.sourceId !== buff.owner.ownerId ||
              published.payload.skillCastInfo?.skillCastId !== skillCastId
            )
              return;
            const reference = published.payload.entity.onReset(() => {
              objectReferences.delete(reference);
              decreaseReference();
            });
            objectReferences.add(reference);
            references++;
            return;
          }
          if (published.event === 'outputBuff') {
            const output = published.payload.buff;
            if (
              published.payload.sourceId !== buff.owner.ownerId ||
              output.affixSkillCastId !== 0 ||
              output.skillCastInfo?.skillCastId !== skillCastId
            )
              return;
            const reference = output.onRecycled(() => {
              objectReferences.delete(reference);
              decreaseReference();
            });
            objectReferences.add(reference);
            references++;
            return;
          }
          const event = skillAbilityEvent(published);
          if (event === undefined || event.payload.sourceId !== buff.owner.ownerId) return;
          if (event.event === 'beforeCastSkill') {
            if (event.payload.skillCastId === skillCastId) {
              if (pendingRequest) pendingRequest = false;
              else references++;
            } else if (pendingRequest) {
              pendingRequest = false;
              decreaseReference();
            }
            return;
          }
          if (event.event === 'skillEnd' && event.payload.skillCastId === skillCastId)
            decreaseReference();
        };
        try {
          if (registerPostSkillCastRequest !== undefined)
            registrations.push(
              registerPostSkillCastRequest(info => {
                if (disposed || pendingRequest || info?.skillCastId !== skillCastId) return;
                references++;
                pendingRequest = true;
              }),
            );
          registrations.push(registerAbilityEventCallback('beforeCastSkill', handle));
          registrations.push(registerAbilityEventCallback('skillEnd', handle));
          registrations.push(registerAbilityEventCallback('outputBuff', handle));
          registrations.push(registerAbilityEventCallback('abilityEntitySpawned', handle));
          registrations.push(registerAbilityEventCallback('projectileLaunched', handle));
        } catch (error) {
          registration.dispose();
          throw error;
        }
        return registration;
      },
      ...(buff.finishParentGlobalBuff === null
        ? {}
        : { finishParentGlobalBuff: buff.finishParentGlobalBuff }),
      getCurrentBuffEnhanceCount: () => buff.enhanceCount,
      getCurrentBuffRemainingDuration: () => buff.remainingDuration,
      setCurrentBuffRemainingDuration: duration => buff.rawSetRemainingDuration(duration),
      refreshCurrentBuffAttributeModifiers: () => buff.refreshAttributeModifierValues(),
      addCurrentBuffChild: child => buff.attachChildBuff(child),
      setCurrentBuffTimePaused: paused => buff.setTimePaused(paused),
    };
    const defaultOperations = resolveOperations(buff);
    const callbackOperations = new WeakMap<CombatOperationContext, CombatOperationExecutor>();
    const operationsFor = (callback?: CombatOperationContext): CombatOperationExecutor => {
      if (callback?.actionSourceId === undefined) return defaultOperations;
      let operations = callbackOperations.get(callback);
      if (operations === undefined) {
        operations = resolveOperations(
          buff,
          callback.actionSourceId,
          callback.skillCastInfo ?? null,
        );
        callbackOperations.set(callback, operations);
      }
      return operations;
    };
    // 回调更换操作来源，但仍使用同一个实例运行时，不能重置 once 和动作黑板作用域。
    runtime = new CombatActionSequenceRuntime(
      {
        execute: (step, callback) => operationsFor(callback).execute(step, callback),
        evaluate: (condition, callback) => operationsFor(callback).evaluate(condition, callback),
        prepare: (step, callback) => operationsFor(callback).prepare?.(step, callback),
        end: (step, callback) => operationsFor(callback).end?.(step, callback),
      },
      context,
    );
    runtimes.set(buff, runtime);
    return runtime;
  };
  const execute = (sequence: ResolvedActionSequence | undefined, buff: CombatBuff<Key>): void => {
    if (sequence === undefined) return;
    runtimeFor(buff).createSequence(sequence).executeInstant({});
  };
  // 叠层者可能不是最初创建者；每次回调只替换本次执行环境，不修改 Buff 的归属和来源施法。
  const executeEnhance = (
    sequence: ResolvedActionSequence | undefined,
    buff: CombatBuff<Key>,
    sourceId: string,
  ): void => {
    if (sequence === undefined) return;
    runtimeFor(buff)
      .createSequence(sequence, {
        ...runtimeFor(buff).context,
        actionSourceId: sourceId,
      })
      .executeInstant({});
  };
  const startEnableSequence = (buff: CombatBuff<Key>): void => {
    if (sequences.enable === undefined) return;
    if (activeEnableSequences.has(buff)) {
      throw new Error(`buff '${definition.id}' enable sequence is already active`);
    }
    const sequence = runtimeFor(buff).createSequence(sequences.enable);
    activeEnableSequences.set(buff, sequence);
    try {
      sequence.tryExecute({});
    } catch (error) {
      sequence.end({});
      sequence.reset({});
      activeEnableSequences.delete(buff);
      throw error;
    }
  };
  const endEnableSequence = (buff: CombatBuff<Key>): void => {
    const sequence = activeEnableSequences.get(buff);
    if (sequence === undefined) return;
    sequence.end({});
    sequence.reset({});
    activeEnableSequences.delete(buff);
  };
  const disposeEventResponses = (buff: CombatBuff<Key>): void => {
    for (const registration of eventRegistrations.get(buff) ?? []) registration.dispose();
    eventRegistrations.delete(buff);
  };
  const registerEventResponses = (buff: CombatBuff<Key>): void => {
    if (abilityEventResponses.length === 0) return;
    if (
      abilityEventResponses.some(response => response.event !== 'outputKnockDown') &&
      registerAbilityEventAction === undefined
    ) {
      throw new Error(`buff '${definition.id}' has ability event responses, but no event runtime`);
    }
    if (
      abilityEventResponses.some(response => response.event === 'outputKnockDown') &&
      registerSemanticEventAction === undefined
    ) {
      throw new Error(`buff '${definition.id}' has semantic event responses, but no event runtime`);
    }
    if (eventRegistrations.has(buff)) {
      throw new Error(`buff '${definition.id}' ability event responses are already active`);
    }
    const registrations: AbilityEventRegistration[] = [];
    try {
      // Each native SequenceAction owns its registration; equal priority does not merge programs.
      for (const response of abilityEventResponses) {
        const runtime = runtimeFor(buff);
        const context = {
          ...runtime.context,
          actionOwnerId: buff.owner.ownerId,
          actionSourceId: buff.sourceId,
        };
        const sequence = runtime.createSequence(response.sequence, context);
        sequence.reset({});
        if (response.event === 'outputKnockDown') {
          registrations.push(
            registerSemanticEventAction!(
              response.event,
              response.priority,
              (event, actionContext) => {
                if (buff.isFinished) return;
                withCombatEventResponseContext(context, { event, actionContext }, () =>
                  sequence.executeInstant({}),
                );
              },
            ),
          );
          continue;
        }
        registrations.push(
          registerAbilityEventAction!(
            response.event,
            response.priority,
            (published, actionContext) => {
              // SequenceAction.isValid delegates to Buff.isActionValid (!isFinished).
              if (buff.isFinished) return;
              withAbilityEventResponseContext(context, published, actionContext, () =>
                sequence.executeInstant({}),
              );
            },
          ),
        );
      }
    } catch (error) {
      for (const registration of registrations) registration.dispose();
      throw error;
    }
    eventRegistrations.set(buff, registrations);
  };
  const actions: BuffLifecycleActions<Key> = {
    ...(scheduledSequences.length === 0 && skillSlotReplacements.length === 0
      ? {}
      : {
          duringEnable: new CompositeBuffDuringEnableAction([
            ...(scheduledSequences.length === 0
              ? []
              : [new BuffScheduledSequenceAction(scheduledSequences, runtimeFor)]),
            ...(skillSlotReplacements.length === 0
              ? []
              : [new BuffSkillSlotReplacementAction(skillSlotReplacements, resolveOperations)]),
          ]),
        }),
    ...(sequences.start === undefined && sequences.trigger === undefined
      ? {}
      : {
          start: buff => {
            if (sequences.trigger !== undefined) {
              const sequence = runtimeFor(buff).createSequence(sequences.trigger);
              sequence.reset({});
              triggerSequences.set(buff, sequence);
            }
            execute(sequences.start, buff);
          },
        }),
    ...(sequences.enable === undefined && abilityEventResponses.length === 0
      ? {}
      : {
          enable: buff => {
            startEnableSequence(buff);
            try {
              registerEventResponses(buff);
            } catch (error) {
              endEnableSequence(buff);
              throw error;
            }
          },
        }),
    ...(sequences.enable === undefined &&
    sequences.disable === undefined &&
    abilityEventResponses.length === 0
      ? {}
      : {
          disable: buff => {
            disposeEventResponses(buff);
            endEnableSequence(buff);
            execute(sequences.disable, buff);
          },
        }),
    ...(sequences.beforeEnhance === undefined
      ? {}
      : {
          beforeEnhance: (buff, sourceId) =>
            executeEnhance(sequences.beforeEnhance, buff, sourceId),
        }),
    ...(sequences.enhanceChanged === undefined
      ? {}
      : {
          enhanceChanged: (buff, sourceId) =>
            executeEnhance(sequences.enhanceChanged, buff, sourceId),
        }),
    ...(sequences.afterEnhance === undefined
      ? {}
      : {
          afterEnhance: (buff, sourceId) => executeEnhance(sequences.afterEnhance, buff, sourceId),
        }),
    ...(sequences.trigger === undefined
      ? {}
      : {
          trigger: buff => {
            const sequence = triggerSequences.get(buff);
            if (sequence === undefined)
              throw new Error(`buff '${definition.id}' trigger sequence was not prepared`);
            sequence.executeInstant({});
          },
        }),
    ...(igniteEventResponses.length === 0
      ? {}
      : {
          ignite: (buff, igniteType, sourceId, skillCastInfo) => {
            const responses = igniteEventResponses.filter(
              response => response.igniteType === igniteType,
            );
            if (responses.length === 0) return false;
            const runtime = runtimeFor(buff);
            let finishAfterIgnited = false;
            for (const response of responses) {
              if (buff.isFinished) break;
              runtime
                .createSequence(response.sequence, {
                  ...runtime.context,
                  actionSourceId: sourceId,
                  skillCastInfo,
                  buffSourceId: sourceId,
                })
                .executeInstant({});
              finishAfterIgnited ||= response.finishAfterIgnited;
            }
            // 原生 OnIgnite 遍历映射后统一 ConsumeBuff；普通动作提前结束不会补造消费。
            if (finishAfterIgnited)
              buff.owner.finishInstance(buff, 'ignite', sourceId, skillCastInfo ?? null);
            return true;
          },
        }),
    ...(sequences.start === undefined &&
    sequences.enable === undefined &&
    sequences.finish === undefined &&
    abilityEventResponses.length === 0
      ? {}
      : {
          finish: buff => {
            execute(sequences.finish, buff);
            endEnableSequence(buff);
            disposeEventResponses(buff);
          },
          release: buff => {
            endEnableSequence(buff);
            disposeEventResponses(buff);
          },
        }),
  };
  if (
    damageModifierConditionPrograms.length !== 0 &&
    damageModifierConditionPrograms.length !== (definition.damageModifiers?.length ?? 0)
  ) {
    throw new Error(`buff '${definition.id}' damage modifier condition programs are misaligned`);
  }
  const damageModifiers = definition.damageModifiers?.map((modifier, index) => {
    const program = damageModifierConditionPrograms[index];
    if (program === undefined) return modifier;
    if (modifier.condition !== undefined) {
      throw new Error(`buff '${definition.id}' damage modifier cannot mix condition forms`);
    }
    return {
      ...modifier,
      createConditionProgram: (buff: CombatBuff<Key>) =>
        createDamageModifierConditionProgram(program, runtimeFor(buff), {
          getBuffAffixSkillCastId: () => buff.affixSkillCastId,
        }),
    };
  });
  return { ...definition, ...(damageModifiers === undefined ? {} : { damageModifiers }), actions };
}
