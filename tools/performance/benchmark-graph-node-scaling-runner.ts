/** Synthetic lower-bound graph experiment. Built as production SSR by the sibling launcher. */
import assert from 'node:assert/strict';
import { cpus, platform, release } from 'node:os';
import { readFileSync } from 'node:fs';
import type { ActionGraphDefinition } from '../../packages/game-data-contract/src/actionGraph';
import {
  createActionGraphCompilation,
  type CompiledActionGraph,
  type CompiledActionGraphNode,
} from '../../src/core/compiler/compileActionGraph';
import {
  ActionGraphExecution,
  type ActionGraphExecutionHost,
} from '../../src/core/combat/actions/actionGraphExecution';
import { CombatStep } from '../../src/core/combat/actions/combatStep';

interface Case {
  id: string;
  family: string;
  sourceNodes: number;
  reachableNodes: number;
  compileAll: boolean;
  instances: number;
  ticks: number;
  lifecycle: 'started' | 'never-started' | 'ended' | 'reset-pending';
}
interface Options {
  mode: 'counts' | 'timing';
  cases: Case[];
  repetitions: number;
  warmups: number;
}
const options: Options = JSON.parse(process.argv[2]!);
if (process.env.NODE_ENV !== 'production' || import.meta.env.DEV)
  throw new Error('Requires production SSR build');
const context = {};
const delta = 1 / 30;
const unsupported = (): never => {
  throw new Error('Synthetic leaf-only graph reached an unexpected host method');
};
class NoopLeaf extends CombatStep {
  override get executionData() {
    return { kind: 'stateless' as const };
  }
  execute(): void {}
}
function timedHost(): ActionGraphExecutionHost {
  return {
    listener: unsupported,
    targets: unsupported,
    withTarget: unsupported,
    canExecute: () => true,
    evaluate: unsupported,
    value: unsupported,
    once: unsupported,
    scope: unsupported,
    bindOperation: () => new NoopLeaf(),
  };
}
function definitionFor(spec: Case): ActionGraphDefinition {
  const nodes: Record<string, ActionGraphDefinition['nodes'][string]> = {};
  for (let index = 0; index < spec.sourceNodes; index++) {
    nodes[`n${index}`] = {
      action: {
        kind: 'setContextFlag',
        parameters: { flag: 'synthetic', value: true, target: 'caster' },
      },
      next: index + 1 < spec.reachableNodes ? `n${index + 1}` : null,
    };
  }
  return { nodes };
}
function compile(definition: ActionGraphDefinition, spec: Case) {
  const compilation = createActionGraphCompilation(definition, 1, 'synthetic-node-scaling');
  const entry = spec.reachableNodes === 0 ? null : 'n0';
  if (spec.compileAll) compilation.compileAll();
  else compilation.compileEntry({ $sequence: entry }, 'synthetic');
  return { program: compilation.program, entry };
}
function createExecutions(
  program: CompiledActionGraph,
  entry: string | null,
  spec: Case,
  host: ActionGraphExecutionHost,
) {
  return Array.from(
    { length: spec.instances },
    (_, index) => new ActionGraphExecution(program, entry, `instance:${index}`, host),
  );
}
function begin(executions: ActionGraphExecution[], spec: Case) {
  if (spec.lifecycle === 'never-started') return;
  if (spec.lifecycle === 'reset-pending') {
    for (const execution of executions) execution.reset(context);
    return;
  }
  for (const execution of executions) execution.tryExecute(context);
  if (spec.lifecycle === 'ended') for (const execution of executions) execution.end(context);
}
function tick(executions: ActionGraphExecution[], spec: Case) {
  for (let frame = 0; frame < spec.ticks; frame++)
    for (const execution of executions) execution.tick(delta, context);
}
function validateState(executions: ActionGraphExecution[], spec: Case) {
  for (const execution of executions) {
    assert.equal(
      execution.runtimeState.nodes.size,
      spec.lifecycle === 'never-started' ? 0 : spec.reachableNodes,
    );
    for (const node of execution.runtimeState.nodes.values()) {
      assert.equal(
        node.lifecycle.state,
        spec.lifecycle === 'ended'
          ? 'ended'
          : spec.lifecycle === 'reset-pending'
            ? 'pending'
            : spec.ticks > 0
              ? 'ticking'
              : 'started',
      );
      assert.equal(node.lifecycle.executeResult, spec.lifecycle !== 'reset-pending');
      assert.equal(node.lifecycle.executionPermitted, spec.lifecycle !== 'reset-pending');
    }
  }
}
function count(spec: Case) {
  const { program, entry } = compile(definitionFor(spec), spec);
  const counters = {
    mapGet: 0,
    mapHas: 0,
    bind: 0,
    execute: 0,
    tick: 0,
    end: 0,
    reset: 0,
    canExecute: 0,
  };
  class CountedMap extends Map<string, CompiledActionGraphNode> {
    override get(key: string) {
      counters.mapGet++;
      return super.get(key);
    }
    override has(key: string) {
      counters.mapHas++;
      return super.has(key);
    }
  }
  class CountedLeaf extends NoopLeaf {
    override execute() {
      counters.execute++;
    }
    override tick() {
      counters.tick++;
    }
    override end() {
      counters.end++;
    }
    override reset() {
      counters.reset++;
    }
  }
  const countedProgram = { ...program, nodes: new CountedMap(program.nodes) };
  const host: ActionGraphExecutionHost = {
    ...timedHost(),
    canExecute: () => {
      counters.canExecute++;
      return true;
    },
    bindOperation: () => {
      counters.bind++;
      return new CountedLeaf();
    },
  };
  const phases: Record<string, typeof counters> = {};
  let previous = { ...counters };
  function capture(phase: string) {
    phases[phase] = Object.fromEntries(
      Object.entries(counters).map(([key, value]) => [
        key,
        value - previous[key as keyof typeof counters],
      ]),
    ) as typeof counters;
    previous = { ...counters };
  }
  const executions = createExecutions(countedProgram, entry, spec, host);
  capture('construction');
  begin(executions, spec);
  capture('startAndOptionalEnd');
  tick(executions, spec);
  capture('ticks');
  validateState(executions, spec);
  const reachableBindings = spec.reachableNodes * spec.instances;
  const expectedTicks = spec.lifecycle === 'started' ? reachableBindings * spec.ticks : 0;
  assert.equal(counters.bind, spec.lifecycle === 'never-started' ? 0 : reachableBindings);
  assert.equal(
    counters.execute,
    ['never-started', 'reset-pending'].includes(spec.lifecycle) ? 0 : reachableBindings,
  );
  assert.equal(counters.reset, spec.lifecycle === 'reset-pending' ? reachableBindings : 0);
  assert.equal(counters.end, spec.lifecycle === 'ended' ? reachableBindings : 0);
  assert.equal(counters.tick, expectedTicks);
  assert.equal(phases.ticks!.mapGet, reachableBindings * spec.ticks);
  assert.equal(phases.ticks!.canExecute, expectedTicks);
  assert.equal(program.nodes.size, spec.compileAll ? spec.sourceNodes : spec.reachableNodes);
  return {
    ...spec,
    compiledNodes: program.nodes.size,
    runtimeNodes: executions.reduce((sum, execution) => sum + execution.runtimeState.nodes.size, 0),
    operationBindingSites: program.operationBindings.size,
    operationBindings: [...program.operationBindings.values()].reduce(
      (sum, bindings) => sum + bindings.size,
      0,
    ),
    phases,
    counters,
    verified: true,
  };
}
function summarize(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return {
    median: sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2,
    p95: sorted[Math.ceil(sorted.length * 0.95) - 1]!,
    min: sorted[0]!,
    max: sorted.at(-1)!,
  };
}
function timing(spec: Case) {
  const definition = definitionFor(spec);
  const host = timedHost();
  function sample() {
    const t0 = performance.now();
    const compilation = createActionGraphCompilation(definition, 1, 'synthetic-node-scaling');
    const t1 = performance.now();
    const entry = spec.reachableNodes === 0 ? null : 'n0';
    if (spec.compileAll) compilation.compileAll();
    else compilation.compileEntry({ $sequence: entry }, 'synthetic');
    const t2 = performance.now();
    const executions = createExecutions(compilation.program, entry, spec, host);
    const t3 = performance.now();
    begin(executions, spec);
    const t4 = performance.now();
    tick(executions, spec);
    const t5 = performance.now();
    // Assertions and state inspection are outside every timing region.
    validateState(executions, spec);
    assert.equal(
      compilation.program.nodes.size,
      spec.compileAll ? spec.sourceNodes : spec.reachableNodes,
    );
    return {
      preparationMs: t1 - t0,
      entryCompilationMs: t2 - t1,
      constructionMs: t3 - t2,
      startAndOptionalEndMs: t4 - t3,
      ticksMs: t5 - t4,
    };
  }
  const first = sample();
  for (let index = 0; index < options.warmups; index++) sample();
  const samples = Array.from({ length: options.repetitions }, sample);
  return {
    ...spec,
    first,
    warmups: options.warmups,
    repetitions: options.repetitions,
    summariesMs: Object.fromEntries(
      Object.keys(first).map(key => [
        key,
        summarize(samples.map(sample => sample[key as keyof typeof first])),
      ]),
    ),
    samples,
    stateVerifiedAfterEverySample: true,
  };
}
function limit(name: string) {
  try {
    return readFileSync(`/sys/fs/cgroup/${name}`, 'utf8').trim();
  } catch {
    return null;
  }
}
const result = {
  label: 'Synthetic graph traversal and dispatch experiment; not full-service speedup',
  mode: options.mode,
  environment: {
    node: process.version,
    v8: process.versions.v8,
    platform: platform(),
    release: release(),
    cpu: cpus()[0]?.model,
    cpuMax: limit('cpu.max'),
    memoryMax: limit('memory.max'),
    nodeEnv: process.env.NODE_ENV,
    viteDev: import.meta.env.DEV,
    startedAt: new Date().toISOString(),
  },
  cases: options.cases.map(spec => (options.mode === 'counts' ? count(spec) : timing(spec))),
};
console.log(JSON.stringify(result));
