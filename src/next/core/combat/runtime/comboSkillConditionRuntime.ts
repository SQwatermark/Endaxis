/**
 * 四类已审计附着事件的连携条件阶段。每条注册保留自己的 direct 板，共享 owner 的实体板。
 * 只产出 Pending 数据，不选择候选、不施法，也不把它降格为附着后的语义事件。
 * 原生依据：combat-spec/docs/combo-condition-environment.md、combo-event-gates-and-pending.md。
 */
import type { ResolvedActionSequence } from '../../compiler/combatProgram';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type {
  AbilityEventContext,
  AbilityEventRegistration,
} from '../events/abilityEventDispatcher';
import { ActionBlackboard, type ActionBlackboardValue } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import { COMBAT_FRAMES_PER_SECOND } from './combatClock';
import {
  ELEMENTAL_INFLICTION_EVENTS,
  type ElementalInflictionEvent,
  type ElementalInflictionEventPayload,
} from './elementalInflictionOperationExecutor';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { CombatOperationExecutor } from './skillRuntime';

type InflictionContext = AbilityEventContext<
  ElementalInflictionEvent,
  ElementalInflictionEventPayload
>;
type BlackboardSnapshot = Readonly<Record<string, ActionBlackboardValue>>;

export interface PendingComboCondition {
  readonly event: InflictionContext;
  readonly inputTarget: RuntimeTargetRef;
  readonly triggerTarget: RuntimeTargetRef;
  /** null 表示未启用条件板；启用空板则为 {}。不包含共享 entity 板。 */
  readonly assignPairs: BlackboardSnapshot | null;
}

export interface ComboConditionRegistration {
  readonly event: ElementalInflictionEvent;
  readonly ownerId: string;
  readonly sourceId: string;
  readonly sequence: ResolvedActionSequence;
  readonly entityBlackboard: ActionBlackboard;
  readonly initialValues: BlackboardSnapshot | null;
  readonly operations: CombatOperationExecutor;
  /** 必须接 entity.markDie 的 alive 语义，不能用血量替代。 */
  readonly isOwnerAlive: () => boolean;
  /** 必须由实际 InSilence 查询提供，不在此猜 Tag ID。 */
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
  readonly #registrations = new Map<ElementalInflictionEvent, Registration[]>();
  disableTriggerComboSkill = false;

  registerPendingCondition(options: ComboConditionRegistration): AbilityEventRegistration {
    if (!ELEMENTAL_INFLICTION_EVENTS.includes(options.event)) {
      throw new Error(`unaudited combo condition event '${options.event}'`);
    }
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

  onAbilityEvent(event: InflictionContext): void {
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

      const output =
        event.event === 'beforeOutputInfliction' || event.event === 'afterOutputInfliction';
      const inputTarget = Object.freeze({
        ...options.resolveTarget(output ? event.payload.targetId : event.payload.sourceId),
      });
      const triggerTarget = Object.freeze({
        ...options.resolveTarget(output ? event.payload.sourceId : event.payload.targetId),
      });
      targets.setSingle('trigger', triggerTarget);
      // 每次检查重新建立动作状态，但绝不重置该注册的 direct/entity 黑板。
      const runtime = new CombatActionSequenceRuntime(options.operations, {
        blackboard,
        targetContext: targets,
        actionInputTarget: inputTarget,
        actionOwnerId: options.ownerId,
        actionSourceId: options.sourceId,
        event: { kind: 'abilitySpellInfliction', event: event.event, ...event.payload },
        eventSkillCastInfo: event.payload.skillCastInfo ?? null,
      });
      let passed: boolean;
      try {
        passed = runtime.createSequence(options.sequence).executeInstant({});
      } finally {
        targets.remove('trigger');
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
