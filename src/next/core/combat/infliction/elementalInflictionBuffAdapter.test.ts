import { describe, expect, it } from 'vitest';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer, type CombatBuffDefinition } from '../buffs/combatBuffs';
import type { InflictionElement } from '../../game-data/operatorDefinition';
import { resolveElementalInfliction } from './elementalInfliction';
import {
  ElementalInflictionBuffAdapter,
  type ElementalInflictionBuffCatalog,
} from './elementalInflictionBuffAdapter';

type Attribute = 'attack';

function attachment(element: InflictionElement): CombatBuffDefinition<Attribute> {
  return {
    id: `attachment.${element}`,
    stackingType: 'enhanceAndRefresh',
    stackingKey: `attachment.${element}`,
    maxStackCount: 4,
    durationSeconds: 10,
  };
}

const catalog: ElementalInflictionBuffCatalog<Attribute> = {
  getAttachmentElement: definition =>
    definition.id.startsWith('attachment.')
      ? (definition.id.slice('attachment.'.length) as InflictionElement)
      : null,
  getAttachment: attachment,
  getBurst: element => ({ id: `burst.${element}`, stackingType: 'unlimited' }),
  getCompoundStatus: (consumed, incoming) => ({
    id: `status.${consumed}.${incoming}`,
    stackingType: 'unlimited',
    blackboard: { consumed_type: -1, consumed_layer: 0, count: 0 },
  }),
};

function createAdapter() {
  const attributes = new CombatAttributeSet<Attribute>();
  const target = new CombatBuffContainer('enemy', attributes);
  return {
    target,
    adapter: new ElementalInflictionBuffAdapter(target, 'operator', catalog),
  };
}

describe('ElementalInflictionBuffAdapter', () => {
  it('adds and enhances same-type attachments after creating the burst', () => {
    const { target, adapter } = createAdapter();
    for (const operation of resolveElementalInfliction('heat', null)) adapter.apply(operation);
    const existing = adapter.getExistingAttachment();
    expect(existing).toEqual({ element: 'heat', layers: 1 });

    for (const operation of resolveElementalInfliction('heat', existing)) {
      adapter.apply(operation);
    }
    expect(adapter.getExistingAttachment()).toEqual({ element: 'heat', layers: 2 });
    expect(target.getCountById('burst.heat')).toBe(1);
  });

  it('consumes a different attachment and assigns native compound-status values', () => {
    const { target, adapter } = createAdapter();
    target.add(attachment('cryo'), 'operator');
    target.add(attachment('cryo'), 'operator');
    target.add(attachment('cryo'), 'operator');
    const existing = adapter.getExistingAttachment();

    for (const operation of resolveElementalInfliction('nature', existing)) {
      adapter.apply(operation);
    }

    expect(adapter.getExistingAttachment()).toBeNull();
    const status = target.findFirst(buff => buff.definition.id === 'status.cryo.nature');
    expect(status?.blackboard.snapshot()).toEqual({
      consumed_type: 2,
      consumed_layer: 3,
      count: 3,
    });
  });
});
