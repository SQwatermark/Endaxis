/**
 * 已审计 Ability 事件的连携条件阶段。每条注册保留自己的 direct 板，共享 owner 的实体板。
 * 只产出 Pending 数据，不选择候选、不施法，也不把它降格为附着后的语义事件。
 * 原生依据：combat-spec/docs/combo-condition-environment.md、combo-event-gates-and-pending.md。
 */
import type { ResolvedActionSequence } from '../../compiler/combatProgram';
import type { AbilityEvent } from '../../../../../packages/game-data-contract/src/abilityEvents';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type {
  AbilityEventContext,
  AbilityEventRegistration,
} from '../events/abilityEventDispatcher';
import { ActionBlackboard, type ActionBlackboardValue } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import { COMBAT_FRAMES_PER_SECOND } from './combatClock';
import {
  type ElementalInflictionEvent,
  type ElementalInflictionEventPayload,
} from './elementalInflictionOperationExecutor';
import type { KnockDownEventPayload } from './knockDownOperationExecutor';
import type { BuffAppliedEvent } from './buffOperationExecutor';
import type { HealthDamageEventPayload } from '../damage/healthDamage';
import type { PoiseDamageModifier } from '../damage/poiseDamage';
import {
  hasAbilityEventActionContextBinding,
  resolveAbilityEventActionContextBinding,
} from '../events/abilityEventActionContext';
import {
  normalizeAbilityEventPayload,
  readEventSkillCastInfo,
} from './buffLifecycleSequenceRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { CombatOperationExecutor } from './skillRuntime';

type InflictionContext = AbilityEventContext<
  ElementalInflictionEvent,
  ElementalInflictionEventPayload
>;
type PhysicalInflictionContext = AbilityEventContext<
  'afterTakePhysicalInfliction',
  KnockDownEventPayload
>;
type AddedBuffContext = AbilityEventContext<'addedBuff', BuffAppliedEvent>;
type BeforeAddedBuffContext = AbilityEventContext<'beforeAddedBuff', BuffAppliedEvent>;
type OutputBuffContext = AbilityEventContext<'outputBuff', BuffAppliedEvent>;
type BeforeTakeDamageContext = AbilityEventContext<'beforeTakeDamage', HealthDamageEventPayload>;
type TakeDamageContext = AbilityEventContext<'takeDamage', HealthDamageEventPayload>;
type OutputDamageContext = AbilityEventContext<
  'beforeOutputDamage' | 'outputDamage',
  HealthDamageEventPayload
>;
type BuffEndsEarlyContext = AbilityEventContext<
  'buffEndsEarly',
  {
    readonly sourceId: string;
    readonly targetId: string;
    readonly buffId: string;
    readonly buffTags: readonly string[];
    readonly reason: 'ignite' | 'early';
  }
>;
type PoiseContext = AbilityEventContext<'poiseZero' | 'poiseKnotBreak', PoiseDamageModifier>;
type BuffRemovalContext = AbilityEventContext<
  'buffConsumed' | 'buffAbsorbed',
  BuffConsumedEventPayload
>;
type WeaknessSetContext = AbilityEventContext<
  'weaknessSet',
  { readonly sourceId: string; readonly targetId: string }
>;
type BuffConsumedEventPayload = import('./buffOperationExecutor').BuffConsumedEvent & {
  readonly sourceId: string;
};
type ComboConditionEventContext =
  | InflictionContext
  | PhysicalInflictionContext
  | BeforeAddedBuffContext
  | AddedBuffContext
  | OutputBuffContext
  | BeforeTakeDamageContext
  | TakeDamageContext
  | OutputDamageContext
  | BuffEndsEarlyContext
  | PoiseContext
  | BuffRemovalContext
  | WeaknessSetContext;
type BlackboardSnapshot = Readonly<Record<string, ActionBlackboardValue>>;

export interface PendingComboCondition {
  readonly event: ComboConditionEventContext;
  readonly inputTarget: RuntimeTargetRef;
  readonly triggerTarget: RuntimeTargetRef | null;
  /** null 表示未启用条件板；启用空板则为 {}。不包含共享 entity 板。 */
  readonly assignPairs: BlackboardSnapshot | null;
}

export interface ComboConditionRegistration {
  readonly event: AbilityEvent;
  readonly ownerId: string;
  readonly sourceId: string;
  readonly sequence: ResolvedActionSequence;
  readonly entityBlackboard: ActionBlackboard;
  readonly initialValues: BlackboardSnapshot | null;
  readonly operations: CombatOperationExecutor;
  /** entity.markDie 的 alive 语义或显式木桩投影；不能用血量替代。 */
  readonly isOwnerAlive: () => boolean;
  /** InSilence 查询或显式无沉默场景投影，不在此猜 Tag ID。 */
  readonly isOwnerSilenced: () => boolean;
  /** 每次读取当前 ComboSkill 槽位及其计时器，不能缓存替换前的技能。缺失返回 null。 */
  readonly currentComboCooldown: () => {
    readonly oneReady: boolean;
    readonly maxPassedTime: number;
    readonly startCdFrame: number;
  } | null;
  /** ID 到实体身份的显式解析；不能把未知 ID 默认当成角色或敌人。 */
  readonly resolveTarget: (entityId: string) => RuntimeTargetRef;
  readonly onPending: (pending: PendingComboCondition) => void;
}

interface Registration {
  readonly options: ComboConditionRegistration;
  readonly blackboard: ActionBlackboard;
  readonly targets: RuntimeTargetContext;
  readonly captureBlackboard: boolean;
}

export class ComboSkillConditionRuntime {
  readonly #registrations = new Map<ComboConditionRegistration['event'], Registration[]>();
  disableTriggerComboSkill = false;

  registerPendingCondition(options: ComboConditionRegistration): AbilityEventRegistration {
    if (!hasAbilityEventActionContextBinding(options.event))
      throw new Error(`unaudited AbilityEvent action-context binding '${options.event}'`);
    const registration: Registration = {
      options,
      blackboard: new ActionBlackboard(options.initialValues ?? {}, options.entityBlackboard),
      targets: new RuntimeTargetContext(),
      captureBlackboard: options.initialValues !== null,
    };
    const entries = this.#registrations.get(options.event) ?? [];
    entries.push(registration);
    this.#registrations.set(options.event, entries);
    let disposed = false;
    return {
      dispose: () => {
        if (disposed) return;
        disposed = true;
        const index = entries.indexOf(registration);
        if (index >= 0) entries.splice(index, 1);
        if (entries.length === 0) this.#registrations.delete(options.event);
      },
    };
  }

  onAbilityEvent(event: ComboConditionEventContext): void {
    if (this.disableTriggerComboSkill) return;
    // 原生注册容器是 set；此处遍历快照不承诺跨注册的原生优先级。
    for (const { options, blackboard, targets, captureBlackboard } of this.#registrations
      .get(event.event)
      ?.slice() ?? []) {
      if (!options.isOwnerAlive() || options.isOwnerSilenced()) continue;
      const cooldown = options.currentComboCooldown();
      if (cooldown === null)
        throw new Error('combo condition requires current ComboSkill cooldown');
      if (!Number.isFinite(cooldown.maxPassedTime) || !Number.isFinite(cooldown.startCdFrame)) {
        throw new Error('combo condition cooldown values must be finite');
      }
      if (
        !cooldown.oneReady &&
        !(
          Math.fround(cooldown.maxPassedTime) <
          Math.fround(Math.fround(cooldown.startCdFrame) / COMBAT_FRAMES_PER_SECOND)
        )
      )
        continue;

      const binding = resolveAbilityEventActionContextBinding(event.event, event.payload);
      const inputTarget = Object.freeze({
        ...options.resolveTarget(binding.inputTargetId),
      });
      const triggerTarget =
        binding.triggerTargetId === null
          ? null
          : Object.freeze({ ...options.resolveTarget(binding.triggerTargetId) });
      if (triggerTarget !== null) targets.setSingle('trigger', triggerTarget);
      const eventSkillCastInfo = readEventSkillCastInfo(event.payload);
      // 每次检查重新建立动作状态，但绝不重置该注册的 direct/entity 黑板。
      const runtime = new CombatActionSequenceRuntime(options.operations, {
        blackboard,
        targetContext: targets,
        actionInputTarget: inputTarget,
        actionOwnerId: options.ownerId,
        actionSourceId: options.sourceId,
        event: normalizeAbilityEventPayload(event.event, event.payload),
        ...(eventSkillCastInfo === undefined ? {} : { eventSkillCastInfo }),
      });
      let passed: boolean;
      try {
        passed = runtime.createSequence(options.sequence).executeInstant({});
      } finally {
        if (triggerTarget !== null) targets.remove('trigger');
        runtime.reset();
      }
      if (passed) {
        options.onPending({
          event,
          inputTarget,
          triggerTarget,
          assignPairs: captureBlackboard ? Object.freeze(blackboard.snapshot()) : null,
        });
      }
    }
  }
}
