import { describe, expect, it, vi } from 'vitest';
import type { CompiledEquipmentContribution } from '../../compiler/compileEquipment';
import type { CombatOperationExecutor } from './skillRuntime';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { EquipmentEventRuntime } from './equipmentEventRuntime';

const contribution: CompiledEquipmentContribution = {
  source: { kind: 'weaponTrait', slug: 'fixture-weapon', traitKey: 'skill' },
  selectedLevel: 3,
  modifiers: [],
  eventHandlers: [
    {
      key: 'gain-sp',
      event: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
      condition: { kind: 'combatActive' },
      sequence: {
        steps: [
          {
            kind: 'changeResource',
            parameters: { resource: 'sp', amount: 10, recipient: 'team' },
          },
        ],
      },
    },
  ],
};

describe('EquipmentEventRuntime', () => {
  it('executes a matching handler once with explicit equipment source identity', () => {
    const events = new CombatSemanticEventRuntime();
    const executed: string[] = [];
    const createExecutor = vi.fn(context => {
      const executor: CombatOperationExecutor = {
        execute: step => {
          executed.push(step.kind);
          return true;
        },
        evaluate: condition => condition.kind === 'combatActive',
      };
      expect(context).toMatchObject({
        operatorId: 'operator:a',
        source: { kind: 'weaponTrait', slug: 'fixture-weapon', traitKey: 'skill' },
        handlerKey: 'gain-sp',
        event: { kind: 'damageTagHit', sourceOperatorId: 'operator:a' },
      });
      return executor;
    });
    new EquipmentEventRuntime(events, 'operator:a', [contribution], createExecutor);

    events.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });

    expect(createExecutor).toHaveBeenCalledOnce();
    expect(executed).toEqual(['changeResource']);
  });

  it('does not execute steps when the condition fails', () => {
    const events = new CombatSemanticEventRuntime();
    const execute = vi.fn(() => true);
    new EquipmentEventRuntime(events, 'operator:a', [contribution], () => ({
      execute,
      evaluate: () => false,
    }));

    events.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it('stops receiving events after disposal', () => {
    const events = new CombatSemanticEventRuntime();
    const createExecutor = vi.fn<() => CombatOperationExecutor>(() => ({
      execute: () => true,
      evaluate: () => true,
    }));
    const runtime = new EquipmentEventRuntime(events, 'operator:a', [contribution], createExecutor);
    runtime.dispose();

    events.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(createExecutor).not.toHaveBeenCalled();
  });
});
