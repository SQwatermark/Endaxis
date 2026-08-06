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
export type ElementalInflictionEvent = (typeof ELEMENTAL_INFLICTION_EVENTS)[number];

export interface ElementalInflictionEventPayload {
  readonly sourceId: string;
  readonly targetId: string;
  readonly skillId: string;
  readonly element: InflictionStep['parameters']['element'];
  readonly isExtra: boolean;
}

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

/** Executes one infliction after target resolution and before the following hit step. */
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
