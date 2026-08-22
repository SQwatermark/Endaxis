import { describe, expect, it, vi } from 'vitest';
import { CombatAttributeSet } from '../../core/combat/attributes/combatAttributes';
import { CombatBuffContainer } from '../../core/combat/buffs/combatBuffs';
import { compileCombatBuffDefinitions } from '../../core/combat/buffs/combatBuffDefinitions';
import { INFLICTION_ELEMENTS } from '../../core/game-data/operatorDefinition';
import { ElementalInflictionBuffAdapter } from '../../core/combat/infliction/elementalInflictionBuffAdapter';
import { resolveElementalInfliction } from '../../core/combat/infliction/elementalInfliction';
import { executeCompoundStatusFactory } from '../../core/combat/infliction/compoundStatusFactory';
import { createSkillSettingSource } from '../../core/combat/infliction/skillSettings';
import { skillSettings } from '../combat/skillSettings';
import { compoundStatusFactories } from './compoundStatusFactories';
import { elementalAttachments } from './elementalAttachments';

type Attribute = 'attack';

describe('elementalAttachments', () => {
  it('loads all four generated attachment roles through the strict schema boundary', () => {
    const emitStarted = vi.fn();
    const onSpellBurstTriggered = vi.fn();
    const index = compileCombatBuffDefinitions<Attribute>(elementalAttachments, {
      emitElementalInflictionStarted: emitStarted,
      onSpellBurstTriggered,
      readAttribute: () => 0,
    });
    const container = new CombatBuffContainer('enemy', new CombatAttributeSet<Attribute>());

    for (const element of INFLICTION_ELEMENTS) {
      const definition = index.getAttachment(element);
      expect(index.getAttachmentElement(definition)).toBe(element);
      expect(definition.stackingType).toBe('enhanceAndRefresh');
      expect(definition.maxStackCount).toBe(4);
      const buff = container.add(definition, 'operator');
      expect(buff?.remainingDuration).toBe(20);
      container.add(definition, 'operator');
    }

    expect(emitStarted.mock.calls.map(([payload]) => payload)).toEqual(
      INFLICTION_ELEMENTS.map(element => ({ element, layers: 2 })),
    );

    expect(index.getCompoundStatus('nature', 'electric').id).toBe(
      'buff_common_pulse_natural_triggered',
    );
  });

  it('resolves real nature layers through the factory into an active conduct status', () => {
    const index = compileCombatBuffDefinitions<Attribute>(elementalAttachments, {
      emitElementalInflictionStarted: () => undefined,
      onSpellBurstTriggered: () => undefined,
      readAttribute: () => 0,
    });
    const container = new CombatBuffContainer('enemy', new CombatAttributeSet<Attribute>());
    const settings = createSkillSettingSource(skillSettings);
    const adapter = new ElementalInflictionBuffAdapter(
      container,
      'operator',
      index,
      undefined,
      undefined,
      (consumedElement, incomingElement, input) => {
        const factory = compoundStatusFactories.factories.find(
          entry =>
            entry.consumedElement === consumedElement && entry.incomingElement === incomingElement,
        )!;
        return executeCompoundStatusFactory(factory, input, 0, settings)
          .blackboardValues as Readonly<Record<string, number>>;
      },
    );

    for (const operation of resolveElementalInfliction('nature', null)) adapter.apply(operation);
    const existing = adapter.getExistingAttachment();
    for (const operation of resolveElementalInfliction('electric', existing)) {
      adapter.apply(operation);
    }

    const conduct = container.findFirst(
      buff => buff.definition.id === 'buff_common_pulse_natural_triggered',
    );
    expect(conduct?.blackboard.getNumber('spell_resistance_decrease')).toBeCloseTo(0.12);
    expect(conduct?.blackboard.getNumber('final_spell_resistance_decrease')).toBeCloseTo(0.12);
    expect(conduct?.remainingDuration).toBe(12);
  });
});
