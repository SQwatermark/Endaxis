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
import type {
  CombatAbilityDamageEvent,
  CombatAbilityPhysicalInflictionEvent,
  CombatAbilityKnockDownEvent,
  CombatAbilitySpellInflictionEvent,
  CombatAbilityHealEvent,
  CombatAbilityPoiseEvent,
  CombatAbilityLifecycleEvent,
  CombatAbilitySkillEvent,
  CombatAbilityWeaknessTriggeredEvent,
  CombatAbilityCustomEvent,
  CombatAbilitySpellBurstEvent,
} from './skillRuntime';
import type { CombatSemanticEvent } from './combatSemanticEventRuntime';
import { DAMAGE_TYPES, type SkillBuffSlotReplacement } from '../../game-data/operatorDefinition';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { EquipmentAbilityEvent } from '../../game-data/equipmentDefinition';

/**
 * 条件执行器可接收的 AbilitySystem 事件名。Buff 定义目前只订阅其中一部分；
 * 连携条件仍必须复用同一负载规范化入口，不能因此另建事件投影。
 */
export type NormalizedAbilityEventName =
  | Exclude<
      ResolvedSkillBuffAbilityEventResponse['event'],
      | 'afterKillEntity'
      | 'outputKnockDown'
      | 'afterOutputPhysicalInfliction'
      | 'skillSpGained'
      | 'buffConsumed'
    >
  | EquipmentAbilityEvent
  | 'afterOutputInfliction'
  | 'afterTakeInfliction'
  | 'afterTakePhysicalInfliction'
  | 'poiseKnotBreak'
  | 'buffConsumed'
  | 'buffAbsorbed'
  | 'weaknessSet';

/** 由 Buff 所有者环境提供的事件注册端口，避免生命周期层依赖具体伤害环境。 */
export type RegisterBuffAbilityEventAction = (
  event: Exclude<
    ResolvedSkillBuffAbilityEventResponse['event'],
    | 'afterKillEntity'
    | 'outputKnockDown'
    | 'afterOutputPhysicalInfliction'
    | 'skillSpGained'
    | 'buffConsumed'
  >,
  priority: number,
  handle: (payload: unknown, actionContext?: AbilityEventRuntimeActionContext) => void,
  samePriorityKey?: string,
) => AbilityEventRegistration;

export type RegisterBuffSemanticEventAction = (
  event: Extract<
    ResolvedSkillBuffAbilityEventResponse['event'],
    | 'afterKillEntity'
    | 'outputKnockDown'
    | 'afterOutputPhysicalInfliction'
    | 'skillSpGained'
    | 'buffConsumed'
  >,
  priority: number,
  handle: (
    event: Extract<
      CombatSemanticEvent,
      {
        readonly kind:
          | 'enemyDefeated'
          | 'knockDownOutput'
          | 'physicalInflictionApplied'
          | 'spGained'
          | 'buffConsumed';
      }
    >,
  ) => void,
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
): CombatBuffDefinition<Key> {
  if (definition.actions !== undefined) {
    throw new Error(
      `buff '${definition.id}' cannot mix legacy lifecycle actions with ordered lifecycle sequences`,
    );
  }

  const runtimes = new WeakMap<CombatBuff<Key>, CombatActionSequenceRuntime>();
  const eventRegistrations = new WeakMap<CombatBuff<Key>, AbilityEventRegistration[]>();
  const childBuffs = new WeakMap<CombatBuff<Key>, { finish(reason: 'other'): boolean }[]>();
  const activeEnableSequences = new WeakMap<CombatBuff<Key>, ActionSequence>();
  const triggerSequences = new WeakMap<CombatBuff<Key>, ActionSequence>();
  const runtimeFor = (buff: CombatBuff<Key>): CombatActionSequenceRuntime => {
    let runtime = runtimes.get(buff);
    if (runtime !== undefined) return runtime;
    const context: CombatOperationContext = {
      blackboard: buff.blackboard,
      damageCalculationSnapshots: new Map(),
      targetContext: new RuntimeTargetContext(),
      ...(currentTarget === undefined ? {} : { currentTarget }),
      ...(buff.skillCastInfo === null ? {} : { skillCastInfo: buff.skillCastInfo }),
      buffSourceId: buff.sourceId,
      buffOwnerId: buff.owner.ownerId,
      finishCurrentBuff: reason => buff.finish(reason),
      ...(buff.finishParentGlobalBuff === null
        ? {}
        : { finishParentGlobalBuff: buff.finishParentGlobalBuff }),
      getCurrentBuffEnhanceCount: () => buff.enhanceCount,
      getCurrentBuffRemainingDuration: () => buff.remainingDuration,
      setCurrentBuffRemainingDuration: duration => buff.rawSetRemainingDuration(duration),
      refreshCurrentBuffAttributeModifiers: () => buff.refreshAttributeModifierValues(),
      addCurrentBuffChild: child => {
        const children = childBuffs.get(buff);
        if (children === undefined) childBuffs.set(buff, [child]);
        else children.push(child);
      },
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
      abilityEventResponses.some(
        response =>
          response.event !== 'afterKillEntity' &&
          response.event !== 'outputKnockDown' &&
          response.event !== 'afterOutputPhysicalInfliction' &&
          response.event !== 'skillSpGained' &&
          response.event !== 'buffConsumed',
      ) &&
      registerAbilityEventAction === undefined
    ) {
      throw new Error(`buff '${definition.id}' has ability event responses, but no event runtime`);
    }
    if (
      abilityEventResponses.some(
        response =>
          response.event === 'afterKillEntity' ||
          response.event === 'outputKnockDown' ||
          response.event === 'afterOutputPhysicalInfliction' ||
          response.event === 'skillSpGained' ||
          response.event === 'buffConsumed',
      ) &&
      registerSemanticEventAction === undefined
    ) {
      throw new Error(`buff '${definition.id}' has semantic event responses, but no event runtime`);
    }
    if (eventRegistrations.has(buff)) {
      throw new Error(`buff '${definition.id}' ability event responses are already active`);
    }
    const registrations: AbilityEventRegistration[] = [];
    try {
      const responseGroups = new Map<
        string,
        {
          readonly event: ResolvedSkillBuffAbilityEventResponse['event'];
          readonly priority: number;
          readonly samePriorityKey?: string;
          readonly responses: ResolvedSkillBuffAbilityEventResponse[];
        }
      >();
      for (const response of abilityEventResponses) {
        const key = `${response.event}\u0000${response.priority}`;
        const group = responseGroups.get(key);
        if (group === undefined) {
          responseGroups.set(key, {
            event: response.event,
            priority: response.priority,
            ...(response.samePriorityKey === undefined
              ? {}
              : { samePriorityKey: response.samePriorityKey }),
            responses: [response],
          });
        } else {
          group.responses.push(response);
        }
      }
      for (const group of responseGroups.values()) {
        if (
          group.event === 'afterKillEntity' ||
          group.event === 'outputKnockDown' ||
          group.event === 'afterOutputPhysicalInfliction' ||
          group.event === 'skillSpGained' ||
          group.event === 'buffConsumed'
        ) {
          registrations.push(
            registerSemanticEventAction!(group.event, group.priority, event => {
              const runtime = runtimeFor(buff);
              for (const response of group.responses) {
                runtime
                  .createSequence(response.sequence, {
                    ...runtime.context,
                    event,
                    ...(event.kind === 'physicalInflictionApplied'
                      ? event.skillCastInfo === undefined
                        ? {}
                        : { eventSkillCastInfo: event.skillCastInfo }
                      : {}),
                  })
                  .executeInstant({});
              }
            }),
          );
          continue;
        }
        registrations.push(
          registerAbilityEventAction!(
            group.event,
            group.priority,
            (payload, actionContext) => {
              const runtime = runtimeFor(buff);
              const callbackTargets = runtime.context.targetContext;
              if (callbackTargets === undefined)
                throw new Error('Buff ability response requires a combat target context');
              if (actionContext?.triggerTarget != null)
                callbackTargets.setSingle('trigger', actionContext.triggerTarget);
              for (const response of group.responses) {
                const event = normalizeAbilityEventPayload(
                  response.event as Exclude<
                    ResolvedSkillBuffAbilityEventResponse['event'],
                    | 'afterKillEntity'
                    | 'outputKnockDown'
                    | 'afterOutputPhysicalInfliction'
                    | 'skillSpGained'
                    | 'buffConsumed'
                  >,
                  payload,
                );
                const eventSkillCastInfo = readEventSkillCastInfo(payload);
                runtime
                  .createSequence(response.sequence, {
                    ...runtime.context,
                    targetContext: callbackTargets,
                    ...(actionContext === undefined
                      ? {}
                      : { actionInputTarget: actionContext.inputTarget }),
                    actionOwnerId: buff.owner.ownerId,
                    actionSourceId: buff.sourceId,
                    event,
                    ...(eventSkillCastInfo === undefined ? {} : { eventSkillCastInfo }),
                  })
                  .executeInstant({});
              }
            },
            group.responses.every(response => isCommutativeCurrentBuffTimeResponse(response))
              ? 'current-buff-time-pause'
              : group.responses.every(
                    response => response.samePriorityKey === group.samePriorityKey,
                  )
                ? group.samePriorityKey
                : undefined,
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
              if (response.finishAfterIgnited) buff.finish('ignite');
            }
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
            disposeEventResponses(buff);
            endEnableSequence(buff);
            for (const child of childBuffs.get(buff) ?? []) child.finish('other');
            childBuffs.delete(buff);
            execute(sequences.finish, buff);
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

function isCommutativeCurrentBuffTimeResponse(
  response: ResolvedSkillBuffAbilityEventResponse,
): boolean {
  let found = false;
  const conditionKinds = (
    condition: import('../../game-data/operatorDefinition').CombatCondition,
  ): Set<string> => {
    if (condition.kind === 'all' || condition.kind === 'any') {
      return new Set(condition.conditions.flatMap(item => [...conditionKinds(item)]));
    }
    if (condition.kind === 'not') return conditionKinds(condition.condition);
    return new Set([condition.kind]);
  };
  const visit = (current: ResolvedActionSequence, guards: ReadonlySet<string>): boolean =>
    current.steps.every(step => {
      if (step.kind === 'setCurrentBuffTimePaused') {
        found = true;
        return response.event === 'beforeCastSkill'
          ? guards.has('eventSkillIdIn')
          : response.event === 'finishedBuff' && guards.has('eventBuffIdMatch');
      }
      if (step.kind === 'modifyActionValue') {
        found = true;
        return response.event === 'beforeCastSkill' && guards.has('eventSkillTypeIn');
      }
      if (step.kind !== 'conditional') return false;
      const nestedGuards = new Set([...guards, ...conditionKinds(step.parameters.condition)]);
      return (
        visit(step.whenTrue, nestedGuards) &&
        (step.whenFalse === undefined || visit(step.whenFalse, nestedGuards))
      );
    });
  return visit(response.sequence, new Set()) && found;
}

export function readEventSkillCastInfo(payload: unknown): CombatSkillCastInfo | null | undefined {
  if (typeof payload !== 'object' || payload === null) return undefined;
  const value = (payload as Record<string, unknown>).skillCastInfo;
  if (value === null) return null;
  const payloadRecord = payload as Record<string, unknown>;
  const nested = typeof value === 'object' && value !== null;
  const source = nested
    ? (value as Record<string, unknown>)
    : typeof payloadRecord.skillCastId === 'number'
      ? {
          skillCastId: payloadRecord.skillCastId,
          originSkillId: payloadRecord.skillId,
          originSkillType: payloadRecord.skillType,
          nonReturnedSpCost: 0,
        }
      : null;
  if (source === null) return undefined;
  if (
    typeof source.skillCastId !== 'number' ||
    typeof source.originSkillId !== 'string' ||
    (source.originSkillType !== 'basicAttack' &&
      source.originSkillType !== 'plungingAttack' &&
      source.originSkillType !== 'finisher' &&
      source.originSkillType !== 'battleSkill' &&
      source.originSkillType !== 'comboSkill' &&
      source.originSkillType !== 'ultimate') ||
    typeof source.nonReturnedSpCost !== 'number'
  ) {
    if (!nested) return undefined;
    throw new TypeError('Ability event payload has invalid skill cast identity');
  }
  return source as unknown as CombatSkillCastInfo;
}

/** 把 AbilitySystem 原始负载转换成 Action/Condition 执行器共享的事件上下文。 */
export function normalizeAbilityEventPayload(
  event: NormalizedAbilityEventName,
  payload: unknown,
):
  | CombatSemanticEvent
  | CombatAbilityDamageEvent
  | CombatAbilityPhysicalInflictionEvent
  | CombatAbilityKnockDownEvent
  | CombatAbilitySpellInflictionEvent
  | CombatAbilitySpellBurstEvent
  | CombatAbilityPoiseEvent
  | CombatAbilityHealEvent
  | CombatAbilitySkillEvent
  | CombatAbilityLifecycleEvent
  | CombatAbilityWeaknessTriggeredEvent
  | import('./skillRuntime').CombatAbilityWeaknessSetEvent
  | CombatAbilityCustomEvent {
  if (typeof payload !== 'object' || payload === null) {
    throw new TypeError(`Ability event '${event}' payload must be an object`);
  }
  const source = payload as Record<string, unknown>;
  if (typeof source.sourceId !== 'string' || typeof source.targetId !== 'string') {
    throw new TypeError(`Ability event '${event}' payload has invalid entity identities`);
  }
  if (
    event === 'enterFight' ||
    event === 'ownerHpZero' ||
    event === 'abilityEntitySpawned' ||
    event === 'abilityEntityFinished'
  ) {
    return {
      kind: 'abilityLifecycle',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
    };
  }
  if (event === 'customAbilityEvent') {
    if (typeof source.eventName !== 'string' || typeof source.eventParam !== 'number') {
      throw new TypeError(`Ability event '${event}' payload has invalid custom event values`);
    }
    return {
      kind: 'abilityCustom',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      eventName: source.eventName,
      eventParam: source.eventParam,
    };
  }
  if (event === 'afterOutputWeaknessTriggered') {
    return {
      kind: 'abilityWeaknessTriggered',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
    };
  }
  if (event === 'weaknessSet') {
    return {
      kind: 'abilityWeaknessSet',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
    };
  }
  if (event === 'beforeOutputKnockDown' || event === 'afterOutputKnockDown') {
    if (typeof source.fromAirborne !== 'boolean') {
      throw new TypeError(`Ability event '${event}' payload has invalid fromAirborne`);
    }
    return {
      kind: 'abilityKnockDown',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      fromAirborne: source.fromAirborne,
    };
  }
  if (
    event === 'beforeTakePhysicalInfliction' ||
    event === 'beforeOutputPhysicalInfliction' ||
    event === 'afterTakePhysicalInfliction'
  ) {
    return {
      kind: 'abilityPhysicalInfliction',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      ...(source.type === undefined
        ? {}
        : { type: source.type as CombatAbilityPhysicalInflictionEvent['type'] }),
      ...(typeof source.attachBuffToCurrentSkill === 'function'
        ? {
            attachBuffToCurrentSkill: source.attachBuffToCurrentSkill as NonNullable<
              CombatAbilityPhysicalInflictionEvent['attachBuffToCurrentSkill']
            >,
          }
        : {}),
    };
  }
  if (event === 'beforeDamageAction' || event === 'beforeCalculateDamage') {
    if (
      !Array.isArray(source.tags) ||
      !source.tags.every(value => typeof value === 'string') ||
      !Array.isArray(source.features) ||
      !source.features.every(value => typeof value === 'string')
    ) {
      throw new TypeError(`Ability event '${event}' payload has invalid damage properties`);
    }
    return {
      kind: 'abilityDamage',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      ...(source.damageType === undefined
        ? {}
        : { damageType: source.damageType as CombatAbilityDamageEvent['damageType'] }),
      tags: source.tags as CombatAbilityDamageEvent['tags'],
      features: source.features as CombatAbilityDamageEvent['features'],
    };
  }
  if (
    event === 'beforeTakeSpellInfliction' ||
    event === 'beforeTakeInfliction' ||
    event === 'beforeOutputInfliction' ||
    event === 'afterTakeInfliction' ||
    event === 'afterOutputInfliction'
  ) {
    if (
      source.element !== undefined &&
      source.element !== 'heat' &&
      source.element !== 'electric' &&
      source.element !== 'cryo' &&
      source.element !== 'nature'
    ) {
      throw new TypeError(`Ability event '${event}' payload has invalid element`);
    }
    return {
      kind: 'abilitySpellInfliction',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      ...(source.element === undefined ? {} : { element: source.element }),
    };
  }
  if (event === 'beforeOutputSpellBurst') {
    if (typeof source.burstType !== 'string') {
      throw new TypeError(`Ability event '${event}' payload has invalid burst type`);
    }
    return {
      kind: 'abilitySpellBurst',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      burstType: source.burstType,
    };
  }
  if (
    event === 'beforeOutputBuff' ||
    event === 'beforeAddedBuff' ||
    event === 'outputBuff' ||
    event === 'addedBuff'
  ) {
    if (
      typeof source.buffId !== 'string' ||
      !Array.isArray(source.buffTags) ||
      !source.buffTags.every(value => typeof value === 'string')
    ) {
      throw new TypeError(`Ability event '${event}' payload has invalid Buff identity`);
    }
    return {
      kind: 'buffApplied',
      sourceId: source.sourceId,
      targetId: source.targetId,
      buffId: source.buffId,
      buffTags: source.buffTags as string[],
    };
  }
  if (event === 'finishedBuff' || event === 'buffEndsEarly') {
    if (
      typeof source.buffId !== 'string' ||
      !Array.isArray(source.buffTags) ||
      !source.buffTags.every(value => typeof value === 'string') ||
      (source.reason !== 'lifetime' &&
        source.reason !== 'ignite' &&
        source.reason !== 'early' &&
        source.reason !== 'dispelled' &&
        source.reason !== 'absorbed' &&
        source.reason !== 'other')
    ) {
      throw new TypeError(`Ability event '${event}' payload has invalid Buff identity`);
    }
    return {
      kind: 'buffFinished',
      sourceId: source.sourceId,
      targetId: source.targetId,
      buffId: source.buffId,
      buffTags: source.buffTags as string[],
      reason: source.reason,
    };
  }
  if (event === 'buffConsumed' || event === 'buffAbsorbed') {
    if (
      typeof source.buffId !== 'string' ||
      typeof source.layers !== 'number' ||
      !Array.isArray(source.buffTags) ||
      !source.buffTags.every(value => typeof value === 'string')
    ) {
      throw new TypeError(`Ability event '${event}' payload has invalid Buff identity`);
    }
    return {
      kind: 'buffConsumed',
      sourceOperatorId: source.sourceId,
      targetId: source.targetId,
      buffId: source.buffId,
      layers: source.layers,
      buffTags: source.buffTags as string[],
      ...(typeof source.blackboardValues === 'object' && source.blackboardValues !== null
        ? {
            blackboardValues: source.blackboardValues as Readonly<
              Record<string, string | number | null>
            >,
          }
        : {}),
    };
  }
  if (event === 'beforeCastSkill' || event === 'afterSkillApplyCost' || event === 'skillEnd') {
    if (
      source.skillType !== 'basicAttack' &&
      source.skillType !== 'battleSkill' &&
      source.skillType !== 'comboSkill' &&
      source.skillType !== 'ultimate' &&
      source.skillType !== 'finisher' &&
      source.skillType !== 'plungingAttack'
    ) {
      throw new TypeError(`Ability event '${event}' payload has invalid skill type`);
    }
    if (!Number.isSafeInteger(source.skillCastId) || (source.skillCastId as number) <= 0) {
      throw new TypeError(`Ability event '${event}' payload has invalid skill cast id`);
    }
    return {
      kind: 'abilitySkill',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      skillType: source.skillType,
      skillId:
        typeof source.skillId === 'string'
          ? source.skillId
          : (() => {
              throw new TypeError(`Ability event '${event}' payload has invalid skill identity`);
            })(),
      skillCastId: source.skillCastId as number,
      ...(typeof source.attachBuffToCurrentSkill === 'function'
        ? {
            attachBuffToCurrentSkill: source.attachBuffToCurrentSkill as NonNullable<
              CombatAbilitySkillEvent['attachBuffToCurrentSkill']
            >,
          }
        : {}),
    };
  }
  if (event === 'poiseZero' || event === 'poiseKnotBreak') {
    return {
      kind: 'abilityPoise',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
    };
  }
  if (event === 'outputHeal' || event === 'receiveHeal') {
    if (
      typeof source.requestedHealing !== 'number' ||
      typeof source.actualHealing !== 'number' ||
      typeof source.overhealing !== 'number' ||
      !Array.isArray(source.tags) ||
      !source.tags.every(value => typeof value === 'string')
    ) {
      throw new TypeError(`Ability event '${event}' payload has invalid healing values`);
    }
    return {
      kind: 'abilityHeal',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      requestedHealing: source.requestedHealing,
      actualHealing: source.actualHealing,
      overhealing: source.overhealing,
      tags: source.tags,
    };
  }
  if (
    !Array.isArray(source.tags) ||
    !source.tags.every(value => typeof value === 'string') ||
    !Array.isArray(source.features) ||
    !source.features.every(value => typeof value === 'string')
  ) {
    throw new TypeError(`Ability event '${event}' payload has invalid damage properties`);
  }
  if (
    source.damageType !== undefined &&
    !DAMAGE_TYPES.includes(source.damageType as (typeof DAMAGE_TYPES)[number])
  ) {
    throw new TypeError(`Ability event '${event}' payload has invalid damage type`);
  }
  return {
    kind: 'abilityDamage',
    event,
    sourceId: source.sourceId,
    targetId: source.targetId,
    ...(source.damageType === undefined
      ? {}
      : { damageType: source.damageType as CombatAbilityDamageEvent['damageType'] }),
    tags: source.tags as CombatAbilityDamageEvent['tags'],
    features: source.features as CombatAbilityDamageEvent['features'],
  };
}
