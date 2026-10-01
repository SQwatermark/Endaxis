import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { probe } from './graph-node-probe.ts';

test('counts shared static node separately from bindings, visits and executions', () => {
  probe.reset();
  const program = { revision: 'test', nodes: new Map([['a', { action: { kind: 'noop' } }]]) };
  probe.source(program, { nodes: { a: { action: { kind: 'noop' } } } });
  const one = { program },
    two = { program },
    b1 = {},
    b2 = {};
  probe.construct(one);
  probe.construct(two);
  probe.binding(one, 'a', b1);
  probe.binding(two, 'a', b2);
  probe.visit(one, 'a', 'tick');
  probe.visit(one, 'a', 'tick');
  probe.operation(b1, 'execute');
  probe.operation(b1, 'execute');
  const r = probe.snapshot();
  assert.equal(r.programs.length, 1);
  assert.equal(r.programs[0]!.compiledNodes, 1);
  assert.equal(r.instances, 2);
  assert.equal(r.counts['binding.created'], 2);
  assert.equal(r.counts['binding.everExecuted'], 1);
  assert.equal(r.counts['operation.execute'], 2);
  assert.deepEqual(r.instanceNodeVisitsHistogram, { '2': 1 });
});

test('decorator forwarding is dispatch, recursive conditions are logical evaluations', () => {
  probe.reset();
  const root = { kind: 'all' },
    leaf = { kind: 'constant' };
  probe.conditionEnter(root, 'outer');
  probe.conditionEnter(root, 'delegate');
  probe.conditionEnter(leaf, 'recursive');
  probe.conditionEnter(leaf, 'leaf-delegate');
  probe.conditionExit();
  probe.conditionExit();
  probe.conditionExit();
  probe.conditionExit();
  const r = probe.snapshot();
  assert.equal(r.counts['condition.dispatch'], 4);
  assert.equal(r.counts['condition.logical'], 2);
  assert.equal(r.counts['condition.root'], 1);
  assert.equal(r.counts['condition.leaf'], 1);
  assert.equal(r.counts['condition.composite'], 1);
});
