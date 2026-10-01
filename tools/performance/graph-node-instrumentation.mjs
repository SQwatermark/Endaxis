import ts from 'typescript';
/** Exact anchors fail closed on source drift. No instrumented source is written to disk. */
export function graphNodeInstrumentation() {
  return {
    name: 'offline-graph-node-counters',
    enforce: 'pre',
    transform(source, id) {
      if (!id.includes('/src/core/')) return;
      let code = source;
      const replace = (a, b) => {
        if (!code.includes(a)) throw Error(`Missing diagnostic anchor in ${id}: ${a}`);
        code = code.replace(a, b);
      };
      const p = 'globalThis.__nodeProbe';
      if (id.endsWith('/compiler/compileActionGraph.ts')) {
        replace('  const bindNode =', `  ${p}.source(program, graph);\n  const bindNode =`);
        replace(
          '      nodes.set(id, { action, next: node.next });',
          `      nodes.set(id, { action, next: node.next });\n      ${p}.compiled(program);`,
        );
      }
      if (id.endsWith('/actions/actionGraphExecution.ts')) {
        replace('    if (state) {', `    ${p}.construct(this);\n    if (state) {`);
        replace(
          '    if (existing) return existing;',
          `    ${p}.bindCall(!!existing);\n    if (existing) return existing;`,
        );
        replace(
          '    this.#bindings.set(id, slot);',
          `    this.#bindings.set(id, slot);\n    ${p}.binding(this,id,binding);`,
        );
        replace(
          '    stopWhenClosed: boolean,',
          '    stopWhenClosed: boolean,\n    diagnosticMode: string,',
        );
        replace(
          '      // 恢复时已重建所有保存的绑定',
          `      ${p}.visit(this,id,diagnosticMode);\n      ${p}.lookup(this,id,this.#bindings.has(id),create,diagnosticMode);\n      // 恢复时已重建所有保存的绑定`,
        );
        replace(
          'body.#entries(create, stopWhenClosed)',
          'body.#entries(create, stopWhenClosed, diagnosticMode)',
        );
        for (const [mode, args] of [
          ['execute', 'true, true'],
          ['reset', 'true, false'],
          ['tick', 'false, false'],
          ['end', 'false, false'],
        ])
          replace(`this.#entries(${args})`, `this.#entries(${args}, '${mode}')`);
        for (const mode of ['execute', 'reset', 'end'])
          replace(
            `${mode}: binding => binding.${mode}(context),`,
            `${mode}: binding => { ${p}.operation(binding,'${mode}'); return binding.${mode}(context); },`,
          );
        replace(
          'tick: (delta, context) => operation.tick(delta, context),',
          `tick: (delta, context) => { ${p}.count(operation.tick === CombatStep.prototype.tick ? 'leaf.tickBaseNoop' : 'leaf.tickOverride'); return operation.tick(delta, context); },`,
        );
        replace(
          'tick: (binding, dt) => binding.tick(dt, context),',
          `tick: (binding, dt) => { ${p}.operation(binding,'tick'); return binding.tick(dt, context); },`,
        );
        for (const [needle, mode] of [
          ['  tryExecute(context: CombatExecutionContext): boolean {', 'execute'],
          ['  reset(context: CombatExecutionContext): void {', 'reset'],
          ['  tick(deltaTime: number, context: CombatExecutionContext): void {', 'tick'],
          ['  end(context: CombatExecutionContext): void {', 'end'],
        ])
          replace(needle, `${needle}\n    ${p}.lifecycle(this,'${mode}');`);
      }
      if (id.endsWith('/compiler/actionProgramInspection.ts'))
        replace(
          '    const action = sequence.graph.nodes.get(id)!.action;',
          `    ${p}.inspect(sequence.graph,id);\n    const action = sequence.graph.nodes.get(id)!.action;`,
        );
      if (id.endsWith('/timeline/timelineActionExecution.ts')) {
        replace(
          '  const pendingStart = state.nextPendingIndex;',
          `  ${p}.timeline(state,program);\n  const pendingStart = state.nextPendingIndex;`,
        );
        replace(
          '    if (program[index]!.startFrame > currentFrame) break;',
          `    ${p}.count('timeline.pendingChecks');\n    if (program[index]!.startFrame > currentFrame) break;`,
        );
        replace(
          '  for (const indexedAction of due) {',
          `  ${p}.count('timeline.dueSlots',due.length);\n  for (const indexedAction of due) {`,
        );
      }
      // Count logical condition evaluations separately from decorator forwarding. Try/finally preserves throws.
      if (id.includes('/combat/')) {
        const ast = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true);
        const edits = [];
        const walk = n => {
          if (
            ts.isMethodDeclaration(n) &&
            n.name.getText(ast) === 'evaluate' &&
            n.body &&
            n.parameters[0]?.name.getText(ast) === 'condition'
          ) {
            const start = n.body.getStart(ast) + 1,
              end = n.body.end - 1;
            edits.push(
              [
                start,
                `${p}.conditionEnter(condition,${JSON.stringify(id.split('/src/')[1])});try {`,
              ],
              [end, `} finally {${p}.conditionExit();}`],
            );
          }
          ts.forEachChild(n, walk);
        };
        walk(ast);
        for (const [at, insert] of edits.sort((a, b) => b[0] - a[0]))
          code = code.slice(0, at) + insert + code.slice(at);
      }
      return code === source ? undefined : { code, map: null };
    },
  };
}
