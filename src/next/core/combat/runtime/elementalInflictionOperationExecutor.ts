/**
 * 元素附着步骤与目标 Buff 容器、关卡事件之间的装配点。
 * 必须在操作序列给定的位置同步执行，不能由投影层根据伤害结果事后补算。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import {
  resolveElementalInfliction,
  type ElementalInflictionOperation,
  type ExistingElementalAttachment,
} from '../infliction/elementalInfliction';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { CombatOperationExecutor } from './skillRuntime';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' }>;
type InflictionStep = Extract<RuntimeOperation, { kind: 'applyElementalInfliction' }>;

export const ELEMENTAL_INFLICTION_EVENTS = [
  'beforeOutputInfliction',
  'beforeTakeInfliction',
  'afterOutputInfliction',
  'afterTakeInfliction',
] as const;
/** 元素附着执行阶段向来源方和目标方发布的事件。 */
export type ElementalInflictionEvent = (typeof ELEMENTAL_INFLICTION_EVENTS)[number];

/** 同一次元素附着事件中保持不变的来源、目标和技能信息。 */
export interface ElementalInflictionEventPayload {
  readonly sourceId: string;
  readonly targetId: string;
  readonly skillId: string;
  readonly element: InflictionStep['parameters']['element'];
  readonly isExtra: boolean;
}

/** 元素附着执行节点所需的状态读写、事件、回执和后继执行端口。 */
export interface ElementalInflictionOperationDependencies {
  readonly sourceOperatorId: string;
  readonly targetId: string;
  readonly skillId: string;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly getExistingAttachment: () => ExistingElementalAttachment | null;
  readonly applyOperation: (operation: ElementalInflictionOperation) => void;
  readonly emitSourceEvent: (
    event: ElementalInflictionEvent,
    payload: ElementalInflictionEventPayload,
  ) => void;
  readonly emitTargetEvent: (
    event: ElementalInflictionEvent,
    payload: ElementalInflictionEventPayload,
  ) => void;
  readonly delegate: CombatOperationExecutor;
}

/** 在目标解析后、后续命中步骤前执行一次附着。 */
export class ElementalInflictionOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: ElementalInflictionOperationDependencies) {}

  execute(step: RuntimeOperation): boolean {
    if (step.kind !== 'applyElementalInfliction') {
      return this.dependencies.delegate.execute(step);
    }

    const payload: ElementalInflictionEventPayload = {
      sourceId: this.dependencies.sourceOperatorId,
      targetId: this.dependencies.targetId,
      skillId: this.dependencies.skillId,
      element: step.parameters.element,
      isExtra: step.parameters.isExtra,
    };
    this.dependencies.emitSourceEvent('beforeOutputInfliction', payload);
    this.dependencies.emitTargetEvent('beforeTakeInfliction', payload);
    const existing = this.dependencies.getExistingAttachment();
    const operations = resolveElementalInfliction(step.parameters.element, existing);
    for (const operation of operations) this.dependencies.applyOperation(operation);
    this.dependencies.emitSourceEvent('afterOutputInfliction', payload);
    this.dependencies.emitTargetEvent('afterTakeInfliction', payload);
    this.dependencies.receipt.record({
      frame: this.dependencies.clock.frame,
      time: this.dependencies.clock.time,
      event: 'ElementalInflictionApplied',
      sourceId: this.dependencies.sourceOperatorId,
      targetId: this.dependencies.targetId,
      data: {
        skillId: this.dependencies.skillId,
        element: step.parameters.element,
        isExtra: payload.isExtra,
        existingElement: existing?.element ?? null,
        existingLayers: existing?.layers ?? 0,
        operationKinds: operations.map(operation => operation.kind).join(','),
      },
    });
    return true;
  }

  evaluate(condition: Parameters<CombatOperationExecutor['evaluate']>[0]): boolean {
    return this.dependencies.delegate.evaluate(condition);
  }
}
