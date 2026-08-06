import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type {
  ElementalInflictionOperation,
  ExistingElementalAttachment,
} from '../infliction/elementalInfliction';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { ElementalInflictionOperationExecutor } from './elementalInflictionOperationExecutor';

const STEP: Extract<ResolvedCombatStep, { kind: 'applyElementalInfliction' }> = {
  kind: 'applyElementalInfliction',
  parameters: { element: 'electric', isExtra: false },
};

describe('ElementalInflictionOperationExecutor', () => {
  it('queries attachment after before-events and applies operations before after-events', () => {
    const order: string[] = [];
    let attachment: ExistingElementalAttachment | null = null;
    const applied: ElementalInflictionOperation[] = [];
    const receipt: CombatReceiptSink = {
      record: entry => order.push(`receipt:${entry.event}`),
    };
    const executor = new ElementalInflictionOperationExecutor({
      sourceOperatorId: 'operator',
      targetId: 'enemy',
      skillId: 'skill',
      clock: new CombatClock(),
      receipt,
      getExistingAttachment: () => {
        order.push('query');
        return attachment;
      },
      applyOperation: operation => {
        order.push(`apply:${operation.kind}`);
        applied.push(operation);
      },
      emitSourceEvent: event => order.push(`source:${event}`),
      emitTargetEvent: event => {
        order.push(`target:${event}`);
        if (event === 'beforeTakeInfliction') attachment = { element: 'heat', layers: 2 };
      },
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    expect(executor.execute(STEP)).toBe(true);
    expect(applied.map(operation => operation.kind)).toEqual([
      'consumeAttachment',
      'createCompoundStatus',
    ]);
    expect(order).toEqual([
      'source:beforeOutputInfliction',
      'target:beforeTakeInfliction',
      'query',
      'apply:consumeAttachment',
      'apply:createCompoundStatus',
      'source:afterOutputInfliction',
      'target:afterTakeInfliction',
      'receipt:ElementalInflictionApplied',
    ]);
  });
});
