import { describe, expect, it, vi } from 'vitest';
import { CombatAttributeSet } from '../../core/combat/attributes/combatAttributes';
import { CombatBuffContainer } from '../../core/combat/buffs/combatBuffs';
import { compileCombatBuffCatalog } from '../../core/combat/buffs/combatBuffCatalog';
import { INFLICTION_ELEMENTS } from '../../core/game-data/operatorDefinition';
import { elementalAttachmentCatalog } from './elementalAttachmentCatalog';

type Attribute = 'attack';

describe('elementalAttachmentCatalog', () => {
  it('loads all four generated attachment roles through the strict schema boundary', () => {
    const emitStarted = vi.fn();
    const onSpellBurstTriggered = vi.fn();
    const catalog = compileCombatBuffCatalog<Attribute>(elementalAttachmentCatalog, {
      emitElementalInflictionStarted: emitStarted,
      onSpellBurstTriggered,
    });
    const container = new CombatBuffContainer('enemy', new CombatAttributeSet<Attribute>());

    for (const element of INFLICTION_ELEMENTS) {
      const definition = catalog.getAttachment(element);
      expect(catalog.getAttachmentElement(definition)).toBe(element);
      expect(definition.stackingType).toBe('enhanceAndRefresh');
      expect(definition.maxStackCount).toBe(4);
      const buff = container.add(definition, 'operator');
      expect(buff?.remainingDuration).toBe(20);
      container.add(definition, 'operator');
    }

    expect(emitStarted.mock.calls.map(([payload]) => payload)).toEqual(
      INFLICTION_ELEMENTS.map(element => ({ element, layers: 2 })),
    );
  });
});
