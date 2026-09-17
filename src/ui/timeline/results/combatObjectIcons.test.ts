import { expect, it } from 'vitest';
import { CombatReceiptCollector } from '../../../core/combat/receipt/combatReceipt';
import { CombatObjectOrigins } from '../../../core/projection/combatObjectOrigins';
import { createEmptyScenario } from '../../../core/project/createProject';
import { createCombatObjectIconResolver } from './combatObjectIcons';
import { capturePublishedOperatorMetadata } from './publishedOperatorMetadata';
import { capturePublishedWeaponSources } from './publishedBuffSource';
import { arcane } from '../../../data/operators/arcane.generated';

it('uses exact Buff instance icons at the hit boundary and reuses them for consumption', () => {
  const c = new CombatReceiptCollector();
  c.record({
    frame: 0,
    time: 0,
    event: 'BuffApplied',
    targetId: 'a',
    data: { instanceId: 1, buffId: 'same', iconPath: '/old.webp' },
  });
  c.record({
    frame: 0,
    time: 0,
    event: 'BuffApplied',
    targetId: 'b',
    data: { instanceId: 1, buffId: 'same', iconPath: '/other.webp' },
  });
  c.record({ frame: 0, time: 0, event: 'BuffConsumed', targetId: 'a', data: { instanceId: 1 } });
  c.record({
    frame: 0,
    time: 0,
    event: 'BuffApplied',
    targetId: 'a',
    data: { instanceId: 1, iconPath: '/future.webp' },
  });
  const q = new CombatObjectOrigins(c.entries);
  const icon = createCombatObjectIconResolver(c.entries, undefined, new Map(), new Map());
  expect(icon(q.get({ kind: 'buff', ownerId: 'a', instanceId: 1 }), 2)).toBe('/old.webp');
  expect(icon(q.get({ kind: 'buff', ownerId: 'b', instanceId: 1 }), 2)).toBe('/other.webp');
  expect(icon(q.get({ kind: 'receipt', sequence: 2 }), 2)).toBe('/old.webp');
  expect(icon(q.get({ kind: 'abilityEntity', instanceId: 1 }), 2)).toBeUndefined();
});

it('uses published operator, skill and weapon identities, including the timeline weapon Buff precedence', () => {
  const scenario = createEmptyScenario('test', 'test');
  scenario.tracks[0] = {
    id: 'track',
    operator: {
      operatorSlug: 'arcane',
      level: 1,
      promoted: false,
      potential: 0,
      trustLevel: 0,
      skillLevels: { basicAttack: 1, battleSkill: 1, comboSkill: 1, ultimate: 1 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [
      {
        id: 'cast',
        source: { kind: 'operatorSkill', skillGroupKey: 'ultimate', skillKey: 'ultimate' },
        placement: { startFrame: 0 },
      },
    ],
  };
  const operators = capturePublishedOperatorMetadata(scenario, { getOperator: () => arcane });
  const c = new CombatReceiptCollector();
  c.record({
    event: 'BuffApplied',
    frame: 0,
    time: 0,
    sourceId: 'track',
    targetId: 'track',
    data: {
      instanceId: 1,
      sourceActionId: 'upgrade-initialization:weapon-trait:item:skill3',
      iconPath: '/buff.webp',
    },
  });
  const q = new CombatObjectOrigins(c.entries);
  const icon = createCombatObjectIconResolver(
    c.entries,
    scenario,
    operators,
    capturePublishedWeaponSources([{ slug: 'item', iconPath: '/weapon.webp' }]),
  );
  expect(icon(q.get({ kind: 'operator', operatorId: 'track' }), 0)).toBe(
    '/operators/arcane/avatar.webp',
  );
  expect(icon(q.get({ kind: 'action', ownerId: 'track', actionId: 'cast' }), 0)).toBe(
    '/operators/arcane/ultimate.webp',
  );
  expect(icon(q.get({ kind: 'buff', ownerId: 'track', instanceId: 1 }), 0)).toBe('/weapon.webp');
  expect(
    icon(
      q.get({ kind: 'action', ownerId: 'track', actionId: 'upgrade-initialization:talent:1' }),
      0,
    ),
  ).toBe('/operators/arcane/talent 2.webp');
});
