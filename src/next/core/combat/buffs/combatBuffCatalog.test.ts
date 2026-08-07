import { describe, expect, it, vi } from 'vitest';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from './combatBuffs';
import {
  COMBAT_BUFF_CATALOG_SCHEMA_VERSION,
  compileCombatBuffCatalog,
  parseCombatBuffCatalogDocument,
  type CombatBuffCatalogDocument,
} from './combatBuffCatalog';

type Attribute = 'attack';

function requireAddedBuff<T>(buff: T | null): T {
  if (buff === null) throw new Error('test fixture buff was unexpectedly rejected');
  return buff;
}

function createDocument(): CombatBuffCatalogDocument {
  return {
    schemaVersion: COMBAT_BUFF_CATALOG_SCHEMA_VERSION,
    revision: 'test-1',
    buffs: [
      {
        id: 'attachment.heat',
        stackingType: 'enhanceAndRefresh',
        maxStackCount: 4,
        durationSeconds: { blackboardKey: 'duration' },
        blackboard: { duration: 20 },
        role: { kind: 'elementalAttachment', element: 'heat' },
        actions: { afterEnhance: [{ kind: 'emitElementalInflictionStarted' }] },
      },
      {
        id: 'burst.heat',
        stackingType: 'unlimited',
        role: { kind: 'elementalBurst', element: 'heat' },
      },
      {
        id: 'status.heat.cryo',
        stackingType: 'unlimited',
        role: {
          kind: 'compoundStatus',
          consumedElement: 'heat',
          incomingElement: 'cryo',
        },
      },
    ],
  };
}

describe('compileCombatBuffCatalog', () => {
  it('compiles data-only attachment roles and lifecycle actions', () => {
    const emitStarted = vi.fn();
    const catalog = compileCombatBuffCatalog<Attribute>(createDocument(), {
      emitElementalInflictionStarted: emitStarted,
    });
    const definition = catalog.getAttachment('heat');
    const container = new CombatBuffContainer('enemy', new CombatAttributeSet<Attribute>());

    const first = requireAddedBuff(
      container.add(definition, 'operator', {
        blackboardValues: { duration: 12 },
      }),
    );
    expect(first.remainingDuration).toBe(12);
    expect(catalog.getAttachmentElement(definition)).toBe('heat');
    expect(catalog.getBurst('heat').id).toBe('burst.heat');
    expect(catalog.getCompoundStatus('heat', 'cryo').id).toBe('status.heat.cryo');
    expect(emitStarted).not.toHaveBeenCalled();

    container.add(definition, 'operator');
    expect(emitStarted).toHaveBeenCalledWith(
      { element: 'heat', layers: 2 },
      expect.objectContaining({ definition }),
    );
  });

  it('rejects duplicate semantic roles instead of choosing by insertion order', () => {
    const document = createDocument();
    expect(() =>
      compileCombatBuffCatalog<Attribute>(
        {
          ...document,
          buffs: [
            ...document.buffs,
            {
              id: 'attachment.heat.duplicate',
              stackingType: 'unlimited',
              role: { kind: 'elementalAttachment', element: 'heat' },
            },
          ],
        },
        { emitElementalInflictionStarted: vi.fn() },
      ),
    ).toThrow("role 'elementalAttachment'");
  });

  it('rejects executable semantics whose required role is missing', () => {
    expect(() =>
      compileCombatBuffCatalog<Attribute>(
        {
          schemaVersion: COMBAT_BUFF_CATALOG_SCHEMA_VERSION,
          revision: 'test-1',
          buffs: [
            {
              id: 'invalid.event-source',
              stackingType: 'unlimited',
              actions: { afterEnhance: [{ kind: 'emitElementalInflictionStarted' }] },
            },
          ],
        },
        { emitElementalInflictionStarted: vi.fn() },
      ),
    ).toThrow('without an elemental-attachment role');
  });

  it('fails explicitly when a required runtime role is absent', () => {
    const catalog = compileCombatBuffCatalog<Attribute>(createDocument(), {
      emitElementalInflictionStarted: vi.fn(),
    });
    expect(() => catalog.getBurst('nature')).toThrow("missing elemental burst 'nature'");
  });

  it('rejects unknown fields at the stored JSON boundary', () => {
    expect(() =>
      parseCombatBuffCatalogDocument({
        schemaVersion: COMBAT_BUFF_CATALOG_SCHEMA_VERSION,
        revision: 'test-1',
        buffs: [
          {
            id: 'attachment.heat',
            stackingType: 'enhanceAndRefresh',
            unexpectedNativeField: true,
          },
        ],
      }),
    ).toThrow("unknown property 'unexpectedNativeField'");
  });

  it('parses and compiles dynamic priority without leaking native flag fields', () => {
    const document = parseCombatBuffCatalogDocument({
      schemaVersion: COMBAT_BUFF_CATALOG_SCHEMA_VERSION,
      revision: 'test-priority',
      buffs: [
        {
          id: 'buff.dynamic-priority',
          stackingType: 'stack',
          priority: { blackboardKey: 'priority', negate: true },
          blackboard: { priority: -3 },
        },
      ],
    });
    const catalog = compileCombatBuffCatalog<Attribute>(document, {
      emitElementalInflictionStarted: vi.fn(),
    });
    const definition = catalog.get('buff.dynamic-priority');
    if (definition === undefined) throw new Error('compiled test buff is missing');

    expect(definition.priority).toEqual({ blackboardKey: 'priority', negate: true });
    const container = new CombatBuffContainer('operator', new CombatAttributeSet<Attribute>());
    expect(requireAddedBuff(container.add(definition, 'operator')).priority).toBe(3);
  });
});
