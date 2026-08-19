import { describe, expect, it } from 'vitest';
import type { CompiledOperatorUpgradeEventProgram } from '../../compiler/combatProgram';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { OperatorUpgradeEventRuntime } from './operatorUpgradeEventRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

const PROGRAM: CompiledOperatorUpgradeEventProgram = {
  key: 'potential:attackAfterElectrification:0',
  event: { kind: 'reactionApplied', reaction: 'electrification' },
  sequence: {
    steps: [
      {
        kind: 'applyBuff',
        parameters: {
          buffId: 'attack-up',
          target: 'caster',
          definition: {
            stackingType: 'enhanceAndRefresh',
            maxStackCount: 2,
            durationSeconds: 5,
            attributeModifiers: [{ attribute: 'Atk', slot: 'baseMultiplier', value: 0.2 }],
          },
        },
      },
    ],
  },
};

describe('OperatorUpgradeEventRuntime', () => {
  it('executes a matching upgrade event with event-local state and disposes symmetrically', () => {
    const events = new CombatSemanticEventRuntime();
    const executed: string[] = [];
    const operationContexts: unknown[] = [];
    const executor: CombatOperationExecutor = {
      execute: (step, context) => {
        executed.push(step.kind);
        operationContexts.push(context?.event);
        return true;
      },
      evaluate: () => false,
    };
    const runtime = new OperatorUpgradeEventRuntime(
      events,
      'operator:perlica',
      [PROGRAM],
      context => {
        expect(context.programKey).toBe(PROGRAM.key);
        return executor;
      },
    );

    const event = {
      kind: 'reactionApplied' as const,
      sourceOperatorId: 'operator:perlica',
      reaction: 'electrification' as const,
    };
    events.emit(event);
    expect(executed).toEqual(['applyBuff']);
    expect(operationContexts).toEqual([event]);

    runtime.dispose();
    events.emit(event);
    expect(executed).toEqual(['applyBuff']);
  });
});
