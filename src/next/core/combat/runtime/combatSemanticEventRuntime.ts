/**
 * 战斗语义事件的同步分发中心。
 *
 * 伤害、附着和状态运行时只负责报告已经发生的事实；连携、配装和养成能力在这里按
 * `CombatEventTrigger` 订阅。它不执行条件和动作，也不依赖 UI 或项目存档。
 */
import type {
  CombatCondition,
  CombatEventTrigger,
  DamageFeature,
  DamageElement,
  DamageTag,
} from '../../game-data/operatorDefinition';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import { ActionBlackboard } from './actionBlackboard';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

export type CombatSemanticEvent =
  | {
      readonly kind: 'operatorHit';
      readonly targetOperatorId: string;
      readonly tags: readonly DamageTag[];
      readonly features: readonly DamageFeature[];
    }
  | {
      readonly kind: 'damageTagHit';
      readonly sourceOperatorId: string;
      readonly tags: readonly DamageTag[];
      readonly features?: readonly DamageFeature[];
    }
  | {
      readonly kind: 'elementalInflictionApplied';
      readonly sourceOperatorId: string;
      readonly elements: readonly DamageElement[];
    }
  | {
      readonly kind: 'skillHit';
      readonly sourceOperatorId: string;
      readonly skillGroupKey: string;
    }
  | {
      readonly kind: 'enemyDefeated';
      readonly sourceOperatorId: string;
      readonly tags: readonly DamageTag[];
      readonly features?: readonly DamageFeature[];
    }
  | {
      readonly kind: 'statusExpired' | 'statusConsumed';
      readonly targetId: string;
      readonly statusKey: string;
    };

export interface CombatSemanticEventContext {
  readonly event: CombatSemanticEvent;
}

export type CombatSemanticEventHandler = (context: CombatSemanticEventContext) => void;

/**
 * 与原生 AbilitySystem.TriggerEvent 已确认的派发阶段一致。
 * 阶段顺序属于战斗规则，不能由各功能模块自行决定。
 */
export const COMBAT_EVENT_PHASES = ['callback', 'dataAction', 'skill', 'combo'] as const;
export type CombatEventPhase = (typeof COMBAT_EVENT_PHASES)[number];

interface CombatEventHandlerRegistrationBase {
  readonly ownerOperatorId: string;
  readonly trigger: CombatEventTrigger;
  readonly condition?: CombatCondition;
  /** 带条件的监听器必须提供与普通动作相同的条件执行链。 */
  readonly createOperations?: (context: CombatSemanticEventContext) => CombatOperationExecutor;
  /** 技能临时监听器复用本次释放黑板；常驻监听器省略时使用事件私有黑板。 */
  readonly createOperationContext?: (context: CombatSemanticEventContext) => CombatOperationContext;
  readonly handle: (
    context: CombatSemanticEventContext,
    getOperations: () => CombatOperationExecutor,
  ) => void;
}

export type CombatEventHandlerRegistration = CombatEventHandlerRegistrationBase &
  (
    | {
        readonly phase: 'dataAction';
        /** 原生数据动作按高优先级先执行；未配置时使用 0。 */
        readonly priority?: number;
      }
    | {
        readonly phase: Exclude<CombatEventPhase, 'dataAction'>;
        readonly priority?: never;
      }
  );

interface Registration extends CombatEventHandlerRegistrationBase {
  readonly phase: CombatEventPhase;
  readonly priority: number;
  readonly order: number;
}

function includesValue<T>(filter: T | readonly T[], value: T): boolean {
  return Array.isArray(filter) ? filter.includes(value) : filter === value;
}

function matchesScope(
  scope: 'operator' | 'team',
  ownerOperatorId: string,
  sourceOperatorId: string,
): boolean {
  return scope === 'team' || ownerOperatorId === sourceOperatorId;
}

function matches(registration: Registration, event: CombatSemanticEvent): boolean {
  const { ownerOperatorId, trigger } = registration;
  if (trigger.kind !== event.kind) return false;
  switch (trigger.kind) {
    case 'operatorHit':
      return event.kind === 'operatorHit' && event.targetOperatorId === ownerOperatorId;
    case 'damageTagHit':
      return (
        event.kind === 'damageTagHit' &&
        matchesScope(trigger.scope, ownerOperatorId, event.sourceOperatorId) &&
        event.tags.includes(trigger.tag)
      );
    case 'elementalInflictionApplied':
      return (
        event.kind === 'elementalInflictionApplied' &&
        matchesScope(trigger.scope, ownerOperatorId, event.sourceOperatorId) &&
        event.elements.some(element => includesValue(trigger.elements, element))
      );
    case 'skillHit':
      return (
        event.kind === 'skillHit' &&
        matchesScope(trigger.scope, ownerOperatorId, event.sourceOperatorId) &&
        event.skillGroupKey === trigger.skillGroupKey
      );
    case 'enemyDefeated':
      return (
        event.kind === 'enemyDefeated' &&
        matchesScope(trigger.scope, ownerOperatorId, event.sourceOperatorId)
      );
    case 'statusExpired':
    case 'statusConsumed': {
      if (event.kind !== trigger.kind || event.statusKey !== trigger.statusKey) return false;
      const targetId = trigger.target === 'enemy' ? 'enemy' : ownerOperatorId;
      return event.targetId === targetId;
    }
  }
}

/** 注册顺序就是执行顺序；一轮分发使用快照，回调中的增删不影响当前事件。 */
export class CombatSemanticEventRuntime {
  readonly #registrations: Registration[] = [];
  #nextRegistrationOrder = 0;

  register(registration: CombatEventHandlerRegistration): AbilityEventRegistration {
    if (registration.ownerOperatorId.length === 0) {
      throw new TypeError('semantic event owner must not be empty');
    }
    if (registration.condition !== undefined && registration.createOperations === undefined) {
      throw new TypeError('conditional semantic event handler requires an operation executor');
    }
    const stored: Registration = {
      ownerOperatorId: registration.ownerOperatorId,
      trigger: registration.trigger,
      phase: registration.phase,
      priority: registration.phase === 'dataAction' ? (registration.priority ?? 0) : 0,
      ...(registration.condition === undefined ? {} : { condition: registration.condition }),
      ...(registration.createOperations === undefined
        ? {}
        : { createOperations: registration.createOperations }),
      ...(registration.createOperationContext === undefined
        ? {}
        : { createOperationContext: registration.createOperationContext }),
      handle: registration.handle,
      order: this.#nextRegistrationOrder++,
    };
    this.#registrations.push(stored);
    let disposed = false;
    return {
      dispose: () => {
        if (disposed) return;
        disposed = true;
        const index = this.#registrations.indexOf(stored);
        if (index >= 0) this.#registrations.splice(index, 1);
      },
    };
  }

  emit(event: CombatSemanticEvent): void {
    const context = { event };
    // 每个阶段单独取快照：当前阶段内的增删不影响本阶段，前一阶段产生的监听器可参与后一阶段。
    for (const phase of COMBAT_EVENT_PHASES) {
      const registrations = this.#registrations
        .filter(registration => registration.phase === phase && matches(registration, event))
        .sort(
          (left, right) => (right.priority ?? 0) - (left.priority ?? 0) || left.order - right.order,
        );
      for (const registration of registrations) {
        let operations: CombatOperationExecutor | undefined;
        const getOperations = (): CombatOperationExecutor => {
          if (operations !== undefined) return operations;
          if (registration.createOperations === undefined) {
            throw new Error('semantic event handler has no operation executor');
          }
          operations = registration.createOperations(context);
          return operations;
        };
        if (registration.condition !== undefined) {
          const operationContext = registration.createOperationContext?.(context) ?? {
            blackboard: new ActionBlackboard(),
            event,
          };
          if (!getOperations().evaluate(registration.condition, operationContext)) continue;
        }
        registration.handle(context, getOperations);
      }
    }
  }
}
