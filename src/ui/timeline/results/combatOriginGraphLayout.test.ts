import { expect, it } from 'vitest';
import { CombatReceiptCollector } from '../../../core/combat/receipt/combatReceipt';
import { CombatObjectOrigins } from '../../../core/projection/combatObjectOrigins';
import { layoutCombatOriginGraph } from './combatOriginGraphLayout';

it('includes actual modifiers and their operator in the default graph without treating them as producers', () => {
  const c = new CombatReceiptCollector();
  c.record({
    event: 'DamageApplied',
    frame: 0,
    time: 0,
    producedBy: { kind: 'action', ownerId: 'attacker', actionId: 'attack' },
    appliedDamageModifiers: [
      {
        kind: 'damageScale',
        buffId: 'support-buff',
        sourceId: 'support',
        sourceActionId: 'support-skill',
        side: 'attacker',
        zone: 'normal',
        addition: 0.2,
      },
    ],
  });
  const origins = new CombatObjectOrigins(c.entries);
  const graph = layoutCombatOriginGraph(origins, 0, 'buffChanges');
  expect(graph.edges.map(edge => edge.relation)).toEqual(
    expect.arrayContaining(['producedBy', 'modifiedBy', 'providedBy', 'ownedBy']),
  );
  expect(graph.nodes.map(node => node.object.ref)).toContainEqual({
    kind: 'operator',
    operatorId: 'support',
  });
  const production = layoutCombatOriginGraph(origins, 0, 'producedBy');
  expect(production.nodes.some(node => node.object.ref.kind === 'modifier')).toBe(false);
  expect(production.nodes.map(node => node.object.ref)).not.toContainEqual({
    kind: 'operator',
    operatorId: 'support',
  });
});

it('does not expand downstream events from an upstream cast or Buff, even in all-relations mode', () => {
  const c = new CombatReceiptCollector();
  const action = { kind: 'action' as const, ownerId: 'operator-a', actionId: 'cast' };
  const buff = { kind: 'buff' as const, ownerId: 'enemy', instanceId: 1 };
  c.record({
    event: 'SkillStarted',
    frame: 0,
    time: 0,
    sourceId: 'operator-a',
    data: { castId: 'cast' },
  });
  c.record({ event: 'BuffCreated', frame: 0, time: 0, subject: buff, producedBy: action });
  c.record({
    event: 'BuffConsumed',
    frame: 0,
    time: 0,
    targetId: 'enemy',
    data: { instanceId: 1, layers: 3, castId: 'cast' },
  });
  c.record({ event: 'DamageApplied', frame: 0, time: 0, producedBy: buff });
  for (const filter of ['buffChanges', 'all'] as const) {
    const graph = layoutCombatOriginGraph(new CombatObjectOrigins(c.entries), 3, filter);
    expect(graph.nodes.filter(node => node.object.fact?.event === 'BuffConsumed')).toHaveLength(0);
    expect(graph.edges.some(edge => ['castEvent', 'buffEvent'].includes(edge.relation))).toBe(
      false,
    );
    expect(graph.nodes.map(node => node.object.ref)).toContainEqual(action);
    for (const edge of graph.edges) {
      expect(graph.nodes[edge.to]!.x).toBeGreaterThan(graph.nodes[edge.from]!.x);
    }
  }
});

it('shares one upstream node across multiple relations and retains cycle edges', () => {
  const c = new CombatReceiptCollector();
  const entity = { kind: 'abilityEntity' as const, instanceId: 1 };
  c.record({
    event: 'AbilityEntitySpawned',
    frame: 0,
    time: 0,
    subject: entity,
    producedBy: entity,
  });
  c.record({
    event: 'DamageApplied',
    frame: 1,
    time: 1,
    producedBy: entity,
    runtimeSource: entity,
  });
  const graph = layoutCombatOriginGraph(new CombatObjectOrigins(c.entries), 1, 'all');
  expect(graph.nodes).toHaveLength(2);
  expect(graph.edges).toEqual([
    { from: 0, to: 1, relation: 'producedBy' },
    { from: 0, to: 1, relation: 'runtimeSource' },
    { from: 1, to: 1, relation: 'producedBy' },
  ]);
  expect(graph.nodes[1]!.x).toBeGreaterThan(graph.nodes[0]!.x);
});

it('ends an action chain at its actual owner without mixing modifier provenance', () => {
  const c = new CombatReceiptCollector();
  c.record({
    event: 'DamageApplied',
    frame: 0,
    time: 0,
    producedBy: { kind: 'action', ownerId: 'operator-a', actionId: 'skill' },
    runtimeSource: { kind: 'operator', operatorId: 'operator-b' },
  });
  const origins = new CombatObjectOrigins(c.entries);
  const graph = layoutCombatOriginGraph(origins, 0, 'producedBy');
  expect(graph.nodes.map(n => n.object.ref)).toEqual([
    { kind: 'receipt', sequence: 0 },
    { kind: 'action', ownerId: 'operator-a', actionId: 'skill' },
    { kind: 'operator', operatorId: 'operator-a' },
  ]);
  expect(graph.edges.map(e => e.relation)).toEqual(['producedBy', 'ownedBy']);
  expect(layoutCombatOriginGraph(origins, 0, 'producedBy', 2).limited).toBe(true);
});

it('does not expand a future birth when inspecting an earlier hit', () => {
  const c = new CombatReceiptCollector();
  const entity = { kind: 'abilityEntity' as const, instanceId: 1 };
  c.record({ event: 'DamageApplied', frame: 0, time: 0, producedBy: entity });
  c.record({
    event: 'AbilityEntitySpawned',
    frame: 0,
    time: 0,
    subject: entity,
    producedBy: { kind: 'action', ownerId: 'later', actionId: 'later' },
  });
  const graph = layoutCombatOriginGraph(new CombatObjectOrigins(c.entries), 0, 'all');
  expect(graph.nodes).toHaveLength(2);
  expect(graph.edges).toHaveLength(1);
});

it('places shared sources after their longest dependency path and separates parallel routes', () => {
  const c = new CombatReceiptCollector();
  const entity = { kind: 'abilityEntity' as const, instanceId: 1 };
  const owner = { kind: 'operator' as const, operatorId: 'owner' };
  c.record({
    event: 'AbilityEntitySpawned',
    frame: 0,
    time: 0,
    subject: entity,
    producedBy: owner,
  });
  c.record({ event: 'DamageApplied', frame: 1, time: 1, producedBy: entity, runtimeSource: owner });
  const graph = layoutCombatOriginGraph(new CombatObjectOrigins(c.entries), 1, 'all');
  for (const edge of graph.edges) {
    expect(graph.nodes[edge.to]!.x).toBeGreaterThan(graph.nodes[edge.from]!.x);
  }
  expect(new Set(graph.routes.map(route => route.path)).size).toBe(graph.edges.length);
  for (const node of graph.nodes) {
    expect(node.y).toBeGreaterThanOrEqual(0);
    expect(node.y + 88).toBeLessThanOrEqual(graph.height);
  }
});
