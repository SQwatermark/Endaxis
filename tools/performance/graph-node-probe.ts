/** Offline-only counters. Imported solely by the diagnostic runner; never application code. */
type Program = { revision: string; nodes: Map<string, { action: { kind: string } }> };
const sources = new Map<Program, any>();
let current: ReturnType<typeof state>;
function state() {
  return {
    counts: {} as Record<string, number>,
    programs: new Set<Program>(),
    instances: new Map<
      object,
      {
        program: Program;
        visits: number;
        executions: number;
        bound: number;
        modes: Record<string, number>;
        nodeVisits: Map<string, number>;
      }
    >(),
    nodes: new Map<Program, Map<string, Record<string, number>>>(),
    conditions: [] as object[],
    bindings: new WeakMap<object, { program: Program; id: string; executed?: boolean }>(),
    timeline: new Set<object>(),
  };
}
function count(key: string, n = 1) {
  current.counts[key] = (current.counts[key] ?? 0) + n;
}
function node(program: Program, id: string, key: string) {
  current.programs.add(program);
  let nodes = current.nodes.get(program);
  if (!nodes) current.nodes.set(program, (nodes = new Map()));
  let row = nodes.get(id);
  if (!row) nodes.set(id, (row = {}));
  row[key] = (row[key] ?? 0) + 1;
  count(key);
  count(`${key}.kind.${program.nodes.get(id)?.action.kind}`);
}
function inst(instance: any) {
  let row = current.instances.get(instance);
  if (!row) {
    row = {
      program: instance.program,
      visits: 0,
      executions: 0,
      bound: 0,
      modes: {},
      nodeVisits: new Map(),
    };
    current.instances.set(instance, row);
    current.programs.add(instance.program);
  }
  return row;
}
export const probe = {
  reset() {
    current = state();
  },
  source(program: Program, graph: any) {
    sources.set(program, graph);
    current.programs.add(program);
    count('compilation.created');
  },
  compiled(program: Program) {
    current.programs.add(program);
    count('compilation.nodesAdded');
  },
  construct(instance: any) {
    inst(instance);
    count('instances.created');
  },
  visit(instance: any, id: string, mode: string) {
    const r = inst(instance);
    r.visits++;
    r.nodeVisits.set(id, (r.nodeVisits.get(id) ?? 0) + 1);
    node(instance.program, id, `visit.${mode}`);
  },
  lookup(instance: any, id: string, hit: boolean, create: boolean, mode: string) {
    if (!hit && create) count(`binding.createdBy.${mode}`);
    node(
      instance.program,
      id,
      hit ? 'binding.lookupHit' : create ? 'binding.lookupMissCreate' : 'binding.lookupMissSkip',
    );
  },
  binding(instance: any, id: string, binding: object) {
    inst(instance).bound++;
    node(instance.program, id, 'binding.created');
    current.bindings.set(binding, { program: instance.program, id });
  },
  bindCall(hit: boolean) {
    count(hit ? 'binding.methodHit' : 'binding.methodMiss');
  },
  lifecycle(instance: any, mode: string) {
    const row = inst(instance);
    row.modes[mode] = (row.modes[mode] ?? 0) + 1;
    count(`graph.${mode}`);
  },
  operation(binding: object, mode: string) {
    const row = current.bindings.get(binding);
    if (row) {
      if (mode === 'execute' && !row.executed) {
        row.executed = true;
        count('binding.everExecuted');
      }
      node(row.program, row.id, `operation.${mode}`);
    } else count(`operation.${mode}.unregistered`);
  },
  inspect(program: Program, id: string) {
    node(program, id, 'inspection.visits');
  },
  conditionEnter(condition: any, site: string) {
    count('condition.dispatch');
    count(`condition.dispatchSite.${site}`);
    if (current.conditions.at(-1) !== condition) {
      count('condition.logical');
      count(`condition.kind.${condition.kind}`);
      count(
        ['not', 'all', 'any'].includes(condition.kind) ? 'condition.composite' : 'condition.leaf',
      );
      if (!current.conditions.length) count('condition.root');
    }
    current.conditions.push(condition);
  },
  conditionExit() {
    current.conditions.pop();
  },
  timeline(state: any, program: any[]) {
    current.timeline.add(state);
    count('timeline.tickCalls');
    count('timeline.programSlotsAtTick', program.length);
    count('timeline.activeSlotsAtTick', state.active.length);
    current.counts['timeline.maxActiveSlotsPerScheduler'] = Math.max(
      current.counts['timeline.maxActiveSlotsPerScheduler'] ?? 0,
      state.active.length,
    );
  },
  count,
  snapshot() {
    if (current.conditions.length) throw Error('Unbalanced condition instrumentation');
    const histogram = (values: number[]) =>
      Object.fromEntries(
        [...values.reduce((m, v) => m.set(v, (m.get(v) ?? 0) + 1), new Map<number, number>())].sort(
          (a, b) => a[0] - b[0],
        ),
      );
    const programs = [...current.programs].map((p, index) => {
      const source = sources.get(p);
      const kinds = (nodes: any[]) =>
        nodes.reduce((r: any, n: any) => {
          r[n.action.kind] = (r[n.action.kind] ?? 0) + 1;
          return r;
        }, {});
      return {
        index,
        revision: p.revision,
        preparedSourceNodes: source ? Object.keys(source.nodes).length : null,
        sourceKinds: source ? kinds(Object.values(source.nodes)) : null,
        compiledNodes: p.nodes.size,
        compiledKinds: kinds([...p.nodes.values()]),
        nodeCounters: [...(current.nodes.get(p) ?? new Map())].map(([id, counts]) => ({
          id,
          kind: p.nodes.get(id)?.action.kind,
          counts,
        })),
      };
    });
    const instanceRows = [...current.instances.values()];
    return {
      counts: current.counts,
      programs,
      instances: instanceRows.length,
      instancesByLifecycle: Object.fromEntries(
        ['execute', 'reset', 'tick', 'end'].map(mode => [
          mode,
          instanceRows.filter(i => i.modes[mode]).length,
        ]),
      ),
      instanceNodeVisitsHistogram: histogram(instanceRows.flatMap(i => [...i.nodeVisits.values()])),
      instanceVisitsHistogram: histogram(instanceRows.map(i => i.visits)),
      instanceBindingsHistogram: histogram(instanceRows.map(i => i.bound)),
      timelineSchedulers: current.timeline.size,
      uniquePreparedGraphs: new Set([...current.programs].map(p => sources.get(p)).filter(Boolean))
        .size,
    };
  },
};
probe.reset();
(globalThis as any).__nodeProbe = probe;
