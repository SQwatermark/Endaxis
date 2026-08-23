import { describe, expect, it, vi } from 'vitest';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { ComboSkillRegistrationRuntime } from './comboSkillRegistrationRuntime';
import { ComboWindowRuntime } from './comboWindowRuntime';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';

describe('ComboSkillRegistrationRuntime', () => {
  it('opens one window when a registered team event matches', () => {
    const events = new CombatSemanticEventRuntime();
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    new ComboSkillRegistrationRuntime({
      operatorId: 'perlica',
      semanticEvents: events,
      comboWindows: windows,
      registrations: [
        {
          skillKey: 'comboSkill',
          priority: 'default',
          blackboard: { coefficient: 1.2 },
          rules: [
            {
              trigger: { kind: 'damageTagHit', tag: 'normalAttackLastCombo', scope: 'team' },
            },
          ],
        },
      ],
    });

    events.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'another-operator',
      tags: ['normalAttackLastCombo'],
    });

    expect(windows.first).toMatchObject({
      operatorId: 'perlica',
      nextSkillKey: 'comboSkill',
      blackboard: { coefficient: 1.2 },
    });
  });

  it('overrides registration blackboard with the matched event branch parameters', () => {
    const events = new CombatSemanticEventRuntime();
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    new ComboSkillRegistrationRuntime({
      operatorId: 'antal',
      semanticEvents: events,
      comboWindows: windows,
      registrations: [
        {
          skillKey: 'comboSkill',
          priority: 'default',
          blackboard: { shared: 7, EntityBB_combo_type: -1 },
          rules: [
            {
              trigger: { kind: 'physicalInflictionApplied', types: 'crush', scope: 'team' },
              blackboard: { EntityBB_combo_type: 1, EntityBB_combo_index: 3 },
            },
          ],
        },
      ],
    });

    events.emit({
      kind: 'physicalInflictionApplied',
      sourceOperatorId: 'ally',
      targetId: 'enemy',
      type: 'crush',
    });

    expect(windows.first?.blackboard).toEqual({
      shared: 7,
      EntityBB_combo_type: 1,
      EntityBB_combo_index: 3,
    });
  });

  it('checks a condition before opening the window', () => {
    const events = new CombatSemanticEventRuntime();
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    const evaluateCondition = vi.fn(() => false);
    new ComboSkillRegistrationRuntime({
      operatorId: 'operator',
      semanticEvents: events,
      comboWindows: windows,
      createOperations: () => ({ execute: () => true, evaluate: evaluateCondition }),
      registrations: [
        {
          skillKey: 'comboSkill',
          priority: 'default',
          blackboard: {},
          rules: [
            {
              trigger: { kind: 'damageTagHit', tag: 'powerAttack', scope: 'team' },
              condition: { kind: 'statusActive', statusKey: 'ready', target: 'caster' },
            },
          ],
        },
      ],
    });

    events.emit({ kind: 'damageTagHit', sourceOperatorId: 'operator', tags: ['powerAttack'] });

    expect(evaluateCondition).toHaveBeenCalledOnce();
    expect(windows.first).toBeUndefined();
  });

  it('routes immediate rules without creating a pending window', () => {
    const events = new CombatSemanticEventRuntime();
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    const castImmediately = vi.fn();
    new ComboSkillRegistrationRuntime({
      operatorId: 'operator',
      semanticEvents: events,
      comboWindows: windows,
      castImmediately,
      registrations: [
        {
          skillKey: 'comboSkill',
          priority: 'default',
          blackboard: {},
          rules: [
            {
              trigger: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
              castImmediately: true,
            },
          ],
        },
      ],
    });

    events.emit({ kind: 'damageTagHit', sourceOperatorId: 'operator', tags: ['normalSkill'] });

    expect(castImmediately).toHaveBeenCalledWith('operator', 'comboSkill');
    expect(windows.first).toBeUndefined();
  });

  it('observes state changed by an earlier data-action phase', () => {
    const events = new CombatSemanticEventRuntime();
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    let ready = false;
    events.register({
      ownerOperatorId: 'operator',
      trigger: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
      phase: 'dataAction',
      handle: () => {
        ready = true;
      },
    });
    new ComboSkillRegistrationRuntime({
      operatorId: 'operator',
      semanticEvents: events,
      comboWindows: windows,
      createOperations: () => ({
        execute: () => true,
        evaluate: () => ready,
      }),
      registrations: [
        {
          skillKey: 'comboSkill',
          priority: 'default',
          blackboard: {},
          rules: [
            {
              trigger: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
              condition: { kind: 'combatActive' },
            },
          ],
        },
      ],
    });

    events.emit({ kind: 'damageTagHit', sourceOperatorId: 'operator', tags: ['normalSkill'] });

    expect(windows.first?.nextSkillKey).toBe('comboSkill');
  });
});
