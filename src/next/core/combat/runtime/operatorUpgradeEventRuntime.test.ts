import { describe, expect, it } from 'vitest';
import type { CompiledOperatorUpgradeEventProgram } from '../../compiler/combatProgram';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { OperatorUpgradeEventRuntime } from './operatorUpgradeEventRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

const PROGRAM: CompiledOperatorUpgradeEventProgram = {
  key: 'potential:attackAfterElectrification:0',
  event: { kind: 'reactionApplied', reaction: 'electrification' },
  initialBlackboard: {},
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

  it('seeds the native consumed-layer store key for attachment-consumption handlers', () => {
    const events = new CombatSemanticEventRuntime();
    let consumedLayers: number | undefined;
    const program: CompiledOperatorUpgradeEventProgram = {
      key: 'talent:consumed-infliction:0',
      event: { kind: 'elementalAttachmentConsumed' },
      initialBlackboard: { crystal_up: 0.04 },
      sequence: {
        steps: [
          {
            kind: 'calculateActionValue',
            parameters: {
              key: 'result',
              operation: 'multiply',
              left: { kind: 'blackboard', key: 'infliction_num' },
              right: { kind: 'constant', value: 0.04 },
            },
          },
        ],
      },
    };
    new OperatorUpgradeEventRuntime(events, 'operator:last-rite', [program], () => ({
      execute: (_step, context) => {
        consumedLayers = context?.blackboard.getNumber('infliction_num');
        return true;
      },
      evaluate: () => false,
    }));

    events.emit({
      kind: 'elementalAttachmentConsumed',
      sourceOperatorId: 'operator:last-rite',
      targetId: 'enemy',
      element: 'heat',
      layers: 3,
    });

    expect(consumedLayers).toBe(3);
  });
});
