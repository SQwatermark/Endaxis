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
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { CombatAbilityDamageEvent, CombatAbilitySkillEvent } from './skillRuntime';
import type { CombatSemanticEvent } from './combatSemanticEventRuntime';

/** 由 Buff 所有者环境提供的事件注册端口，避免生命周期层依赖具体伤害环境。 */
export type RegisterBuffAbilityEventAction = (
  event: ResolvedSkillBuffAbilityEventResponse['event'],
  priority: number,
  handle: (payload: unknown) => void,
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

/** 为一份已编译 Buff 定义安装同步生命周期序列。 */
export function attachBuffLifecycleSequences<Key extends string>(
  definition: CombatBuffDefinition<Key>,
  sequences: ResolvedSkillBuffLifecycleSequences,
  resolveOperations: (buff: CombatBuff<Key>) => CombatOperationExecutor,
  currentTarget?: RuntimeTargetRef,
  abilityEventResponses: readonly ResolvedSkillBuffAbilityEventResponse[] = [],
  registerAbilityEventAction?: RegisterBuffAbilityEventAction,
  scheduledSequences: readonly CompiledTimelineAction[] = [],
  igniteEventResponses: readonly ResolvedSkillBuffIgniteEventResponse[] = [],
): CombatBuffDefinition<Key> {
  if (definition.actions !== undefined) {
    throw new Error(
      `buff '${definition.id}' cannot mix legacy lifecycle actions with ordered lifecycle sequences`,
    );
  }

  const runtimes = new WeakMap<CombatBuff<Key>, CombatActionSequenceRuntime>();
  const eventRegistrations = new WeakMap<CombatBuff<Key>, AbilityEventRegistration[]>();
  const activeEnableSequences = new WeakMap<CombatBuff<Key>, ActionSequence>();
  const runtimeFor = (buff: CombatBuff<Key>): CombatActionSequenceRuntime => {
    let runtime = runtimes.get(buff);
    if (runtime !== undefined) return runtime;
    const context: CombatOperationContext = {
      blackboard: buff.blackboard,
      targetContext: new RuntimeTargetContext(),
      ...(currentTarget === undefined ? {} : { currentTarget }),
      ...(buff.skillCastInfo === null ? {} : { skillCastInfo: buff.skillCastInfo }),
      buffSourceId: buff.sourceId,
      finishCurrentBuff: reason => buff.finish(reason),
    };
    runtime = new CombatActionSequenceRuntime(resolveOperations(buff), context);
    runtimes.set(buff, runtime);
    return runtime;
  };
  const execute = (sequence: ResolvedActionSequence | undefined, buff: CombatBuff<Key>): void => {
    if (sequence === undefined) return;
    runtimeFor(buff).createSequence(sequence).executeInstant({});
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
    if (registerAbilityEventAction === undefined) {
      throw new Error(`buff '${definition.id}' has ability event responses, but no event runtime`);
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
            responses: [response],
          });
        } else {
          group.responses.push(response);
        }
      }
      for (const group of responseGroups.values()) {
        registrations.push(
          registerAbilityEventAction(group.event, group.priority, payload => {
            const runtime = runtimeFor(buff);
            for (const response of group.responses) {
              runtime
                .createSequence(response.sequence, {
                  ...runtime.context,
                  event: normalizeBuffAbilityEvent(response.event, payload),
                })
                .executeInstant({});
            }
          }),
        );
      }
    } catch (error) {
      for (const registration of registrations) registration.dispose();
      throw error;
    }
    eventRegistrations.set(buff, registrations);
  };
  const actions: BuffLifecycleActions<Key> = {
    ...(scheduledSequences.length === 0
      ? {}
      : {
          duringEnable: new BuffScheduledSequenceAction(scheduledSequences, runtimeFor),
        }),
    ...(sequences.start === undefined ? {} : { start: buff => execute(sequences.start, buff) }),
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
      : { beforeEnhance: buff => execute(sequences.beforeEnhance, buff) }),
    ...(sequences.enhanceChanged === undefined
      ? {}
      : { enhanceChanged: buff => execute(sequences.enhanceChanged, buff) }),
    ...(sequences.afterEnhance === undefined
      ? {}
      : { afterEnhance: buff => execute(sequences.afterEnhance, buff) }),
    ...(sequences.trigger === undefined
      ? {}
      : { trigger: buff => execute(sequences.trigger, buff) }),
    ...(igniteEventResponses.length === 0
      ? {}
      : {
          ignite: (buff, igniteType, sourceId) => {
            const responses = igniteEventResponses.filter(
              response => response.igniteType === igniteType,
            );
            if (responses.length === 0) return false;
            const runtime = runtimeFor(buff);
            for (const response of responses) {
              runtime
                .createSequence(response.sequence, {
                  ...runtime.context,
                  buffSourceId: sourceId,
                })
                .executeInstant({});
            }
            if (responses.some(response => response.finishAfterIgnited)) buff.finish('other');
            return true;
          },
        }),
    ...(sequences.enable === undefined &&
    sequences.finish === undefined &&
    abilityEventResponses.length === 0
      ? {}
      : {
          finish: buff => {
            disposeEventResponses(buff);
            endEnableSequence(buff);
            execute(sequences.finish, buff);
          },
        }),
  };
  return { ...definition, actions };
}

function normalizeBuffAbilityEvent(
  event: ResolvedSkillBuffAbilityEventResponse['event'],
  payload: unknown,
): CombatSemanticEvent | CombatAbilityDamageEvent | CombatAbilitySkillEvent {
  if (typeof payload !== 'object' || payload === null) {
    throw new TypeError(`Buff ability event '${event}' payload must be an object`);
  }
  const source = payload as Record<string, unknown>;
  if (typeof source.sourceId !== 'string' || typeof source.targetId !== 'string') {
    throw new TypeError(`Buff ability event '${event}' payload has invalid entity identities`);
  }
  if (event === 'addedBuff') {
    if (
      typeof source.buffId !== 'string' ||
      !Array.isArray(source.buffTagIds) ||
      !source.buffTagIds.every(value => typeof value === 'number')
    ) {
      throw new TypeError(`Buff ability event '${event}' payload has invalid Buff identity`);
    }
    return {
      kind: 'buffApplied',
      sourceId: source.sourceId,
      targetId: source.targetId,
      buffId: source.buffId,
      buffTagIds: source.buffTagIds as number[],
    };
  }
  if (event === 'beforeCastSkill') {
    if (
      source.skillType !== 'basicAttack' &&
      source.skillType !== 'battleSkill' &&
      source.skillType !== 'comboSkill' &&
      source.skillType !== 'ultimate' &&
      source.skillType !== 'finisher' &&
      source.skillType !== 'plungingAttack'
    ) {
      throw new TypeError(`Buff ability event '${event}' payload has invalid skill type`);
    }
    return {
      kind: 'abilitySkill',
      event,
      sourceId: source.sourceId,
      targetId: source.targetId,
      skillType: source.skillType,
    };
  }
  if (
    !Array.isArray(source.tags) ||
    !source.tags.every(value => typeof value === 'string') ||
    !Array.isArray(source.features) ||
    !source.features.every(value => typeof value === 'string')
  ) {
    throw new TypeError(`Buff ability event '${event}' payload has invalid damage properties`);
  }
  return {
    kind: 'abilityDamage',
    event,
    sourceId: source.sourceId,
    targetId: source.targetId,
    tags: source.tags as CombatAbilityDamageEvent['tags'],
    features: source.features as CombatAbilityDamageEvent['features'],
  };
}
