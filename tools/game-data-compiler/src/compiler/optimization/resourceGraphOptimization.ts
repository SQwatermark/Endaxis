/** 优化各资源自己的完整图。遍历目录只寻找资源，绝不把目录中的节点合到一起。 */
import { isDeepStrictEqual } from 'node:util';
import type {
  ActionGraphReference,
  ActionGraphResourceDefinition,
} from '../intermediateDefinitions.ts';
import { optimizeActionGraphEntries } from './graphSequenceOptimization.ts';
import { deduplicateActionGraph } from './actionGraphDeduplication.ts';
import { extractActionGraphMiddleSegments } from './actionGraphMiddleSegments.ts';
import type {
  DefinitionOptimizationMode,
  DefinitionOptimizationReport,
} from './definitionOptimization.ts';

function isReference(value: object): value is ActionGraphReference {
  return (
    Object.keys(value).length === 1 &&
    '$sequence' in value &&
    (typeof value.$sequence === 'string' || value.$sequence === null)
  );
}

/** 枚举或替换当前资源的入口；独立子资源有自己的图，不跨进去解析引用。未改动子树保留引用身份。 */
function mapEntries(
  value: unknown,
  map: (entry: ActionGraphReference) => ActionGraphReference,
): unknown {
  if (Array.isArray(value)) {
    let changed = false;
    const items = value.map(item => {
      const next = mapEntries(item, map);
      if (next !== item) changed = true;
      return next;
    });
    return changed ? items : value;
  }
  if (!value || typeof value !== 'object') return value;
  if (isReference(value)) return map(value);
  if ('actionGraph' in value) return value;
  let changed = false;
  const record: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    const next = mapEntries(item, map);
    if (next !== item) changed = true;
    record[key] = next;
  }
  return changed ? record : value;
}

export function optimizeResourceGraphs<T>(
  value: T,
  mode: DefinitionOptimizationMode,
  pruneValues?: (simplified: T) => T,
): {
  readonly value: T;
  readonly reports: readonly DefinitionOptimizationReport[];
} {
  const reports: DefinitionOptimizationReport[] = [];
  const reportLocations = new Map<string, number>();
  function recordReport(path: string, report: DefinitionOptimizationReport) {
    const index = reportLocations.get(path);
    if (index === undefined) {
      reportLocations.set(path, reports.length);
      reports.push({ ...report, mode });
      return;
    }
    const previous = reports[index]!;
    reports[index] = {
      ...report,
      mode,
      before: previous.before,
      changes: [...previous.changes, ...report.changes],
    };
  }
  function visit(value: unknown, path: string, phase: 'simplify' | 'extract'): unknown {
    if (Array.isArray(value)) {
      let changed = false;
      const items = value.map((item, index) => {
        const next = visit(item, `${path}[${index}]`, phase);
        if (next !== item) changed = true;
        return next;
      });
      return changed ? items : value;
    }
    if (!value || typeof value !== 'object') return value;
    const record = value as Record<string, unknown>;
    if (Object.keys(record).length === 1 && Array.isArray(record.steps))
      throw new Error(`${path}: action trees are no longer supported`);
    let changed = false;
    const fields: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(record)) {
      if (key === 'actionGraph') continue;
      const next = visit(item, `${path}.${key}`, phase);
      if (next !== item) changed = true;
      fields[key] = next;
    }
    if (record.actionGraph === undefined) return changed ? fields : value;
    // 主图中的外部资源调用也要分别优化；visit 不会把它们的节点并入父图。
    const resource = visit(
      record.actionGraph,
      `${path}.actionGraph`,
      phase,
    ) as ActionGraphResourceDefinition;
    if (resource !== record.actionGraph) changed = true;
    const entries: ActionGraphReference[] = [];
    mapEntries(fields, entry => {
      entries.push(entry);
      return entry;
    });
    if (phase === 'extract') {
      // 裁掉写入后，原来不同的后续可能变得相同；先重新共享这些分支。
      const shared = deduplicateActionGraph(resource.main, entries);
      let entryIndex = 0;
      const metadata = mapEntries(fields, () => shared.entries[entryIndex++]!);
      if (metadata !== fields) changed = true;
      // 只在没有宏的资源内提取一层。黑板裁剪已完成，此后不再改宏内节点 ID。
      const extracted =
        Object.keys(resource.macros).length === 0
          ? extractActionGraphMiddleSegments(shared.graph, shared.entries)
          : { graph: shared.graph, macros: resource.macros, candidates: [] };
      const reportIndex = reportLocations.get(path);
      if (extracted.candidates.length > 0 && reportIndex !== undefined) {
        reports[reportIndex] = {
          ...reports[reportIndex]!,
          macroCandidates: extracted.candidates.map(candidate => ({
            ...candidate,
            resourcePath: path,
          })),
        };
      }
      const finalResource =
        extracted.graph === resource.main
          ? resource
          : { main: extracted.graph, macros: extracted.macros };
      if (finalResource !== record.actionGraph) changed = true;
      return changed ? { ...(metadata as object), actionGraph: finalResource } : value;
    }
    // 等价分支可能只是节点 ID 不同；先共享定义，控制流才能识别同一后继。
    // 共享不合并调用次数或状态，优化后的新等价尾段仍由下方再次收拢。
    const input =
      mode === 'off'
        ? { graph: resource.main, entries }
        : deduplicateActionGraph(resource.main, entries);
    const optimized = optimizeActionGraphEntries(input.graph, input.entries, {
      mode: mode === 'off' ? 'off' : 'apply',
      definitionId: path,
    });
    const deduplicated =
      mode === 'off' ? optimized : deduplicateActionGraph(optimized.graph, optimized.entries);
    recordReport(path, optimized.report);
    let index = 0;
    let entriesChanged = false;
    const metadata = mapEntries(fields, entry => {
      const next = deduplicated.entries[index++]!;
      if (next !== entry) entriesChanged = true;
      return next;
    });
    if (entriesChanged) changed = true;
    if (deduplicated.graph !== resource.main) changed = true;
    // 这些宏的局部 ID 是调用位置映射的键。再次优化不能单独改宏体而留下失效映射。
    const boundMacros = new Set<string>();
    for (const graph of [
      resource.main,
      ...Object.values(resource.macros).map(macro => macro.graph),
    ]) {
      for (const { action } of Object.values(graph.nodes)) {
        if (action.kind === 'callMacro' && action.nodeBindings) boundMacros.add(action.macroId);
      }
    }
    let macrosChanged = false;
    const macros = Object.fromEntries(
      Object.entries(resource.macros).map(([id, macro]) => {
        if (boundMacros.has(id)) return [id, macro];
        const result = optimizeActionGraphEntries(macro.graph, [macro.entry], {
          mode: mode === 'off' ? 'off' : 'apply',
          definitionId: `${path}.macro.${id}`,
        });
        recordReport(`${path}.macro.${id}`, result.report);
        const shared =
          mode === 'off' ? result : deduplicateActionGraph(result.graph, result.entries);
        const next =
          shared.entries[0] === macro.entry && shared.graph === macro.graph
            ? macro
            : { ...macro, entry: shared.entries[0]!, graph: shared.graph };
        if (next !== macro) macrosChanged = true;
        return [id, next];
      }),
    );
    if (macrosChanged) changed = true;
    const finalResource: ActionGraphResourceDefinition =
      deduplicated.graph === resource.main && !macrosChanged
        ? resource
        : { main: deduplicated.graph, macros };
    if (!changed) return value;
    return { ...(metadata as object), actionGraph: finalResource };
  }
  let simplified = visit(value, 'definition', 'simplify') as T;
  // 无用写入消失后，条件可能失去用途；条件消失后，其输入也可能成为死值。
  // 宏提取放在收敛之后，避免宏调用隐藏读写关系。
  if (mode !== 'off' && pruneValues) {
    for (;;) {
      const pruned = pruneValues(simplified);
      if (isDeepStrictEqual(pruned, simplified)) break;
      simplified = visit(pruned, 'definition', 'simplify') as T;
    }
  }
  const candidate = mode === 'off' ? simplified : (visit(simplified, 'definition', 'extract') as T);
  return { value: mode === 'apply' ? candidate : value, reports };
}
