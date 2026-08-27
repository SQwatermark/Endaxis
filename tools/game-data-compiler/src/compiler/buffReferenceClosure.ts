import { collectBuffActionReferences } from '../source/buffActionGraph.ts';
import { parseBuffRuntimeSource, type BuffRuntimeSource } from '../source/buffRuntime.ts';
import { collectNativeActionNodes } from '../source/controlFlow.ts';
import type { DefinitionReferenceSource } from '../source/referenceGraph.ts';
import type { GlobalBuffTemplateCatalogSource } from '../source/globalBuffTemplate.ts';

/**
 * 定义依赖收集，不改写动作和运行时黑板。
 * 只开放原生关键词的无覆盖默认 child 契约；一般动态字符串的数据流仍保持显式阻塞。
 */
export function collectBuffRuntimeClosure(
  rootIds: readonly string[],
  buffData: Record<string, unknown> | ((id: string) => unknown),
  globalBuffCatalog?: GlobalBuffTemplateCatalogSource,
): Map<string, BuffRuntimeSource> {
  const result = new Map<string, BuffRuntimeSource>();
  const references = new Map<string, readonly DefinitionReferenceSource[]>();
  const queue = [...rootIds];
  do {
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (result.has(id)) continue;
      const value = typeof buffData === 'function' ? buffData(id) : buffData[id];
      if (value === undefined)
        throw new Error(`BuffData: missing Buff definition ${JSON.stringify(id)}`);
      const source = parseBuffRuntimeSource(value, `BuffData.${id}`);
      if (source.graph.buffId !== id) throw new Error(`BuffData.${id}.id: identity mismatch`);
      result.set(id, source);
      const allRefs = collectBuffActionReferences(source.graph).filter(
        ref => ref.state !== 'inactive',
      );
      for (const ref of allRefs.filter(ref => ref.kind === 'globalBuff')) {
        if (ref.state === 'dynamic' || ref.id === null) {
          throw new Error(`${ref.sourcePath}: dynamic GlobalBuff references are unsupported`);
        }
        const template = globalBuffCatalog?.byId.get(ref.id);
        if (template === undefined) {
          throw new Error(
            `${ref.sourcePath}: missing GlobalBuff template ${JSON.stringify(ref.id)}`,
          );
        }
        for (const child of template.children) queue.push(child.buffId);
      }
      const refs = allRefs.filter(ref => ref.kind === 'buff');
      references.set(id, refs);
      for (const ref of refs) {
        if (ref.state !== 'dynamic' && ref.id !== null) queue.push(ref.id);
      }
    }
    // 每次新子图加入后都重验来路：后发现的普通创建/未知覆盖不能绕过原先的证明。
    for (const [id, refs] of references) {
      for (const ref of refs) {
        if (ref.state !== 'dynamic' && ref.id !== null) continue;
        const candidate = resolveKeywordDefaultChild(id, ref, rootIds, result, references);
        if (!result.has(candidate)) queue.push(candidate);
      }
    }
  } while (queue.length > 0);
  return result;
}

function nodes(source: BuffRuntimeSource) {
  return [
    ...source.graph.buffEvents.flatMap(event => event.actions),
    ...source.graph.abilityEvents.flatMap(event => event.actions),
    ...source.graph.igniteEvents.flatMap(event => event.actions),
    ...source.graph.timelineActions.map(timeline => timeline.sequence),
  ].flatMap(sequence => collectNativeActionNodes(sequence));
}

function resolveKeywordDefaultChild(
  id: string,
  ref: DefinitionReferenceSource,
  roots: readonly string[],
  sources: ReadonlyMap<string, BuffRuntimeSource>,
  references: ReadonlyMap<string, readonly DefinitionReferenceSource[]>,
): string {
  const fail = (): never => {
    throw new Error(
      `${ref.sourcePath}: dynamic Buff references cannot form a static Buff closure without a proven keyword default-child contract`,
    );
  };
  // _DoApplyKeywordBuff 只有显式覆盖才修改此键；外部根的施加参数无法在本闭包中证明。
  if (roots.includes(id) || ref.usage !== 'apply' || ref.blackboardKey !== 'child_buff_id')
    return fail();
  const source = sources.get(id)!;
  const declared = source.graph.declaredBlackboard.find(item => item.key === ref.blackboardKey);
  if (!declared || declared.isDynamic || typeof declared.value !== 'string' || !declared.value)
    return fail();
  // 当前允许的载体只含创建子 Buff/表现动作，排除本地写入、条件副作用和共享板路径。
  if (
    source.graph.timelineActions.length ||
    source.graph.abilityEvents.length ||
    source.graph.igniteEvents.length
  )
    return fail();
  if (source.graph.buffEvents.some(event => event.event !== 'DuringBuffEnable')) return fail();
  if (
    nodes(source).some(
      node =>
        node.metadata.enabled &&
        (node.body.kind !== 'leaf' ||
          !['buffApplication', 'presentation'].includes(node.body.value.family)),
    )
  )
    return fail();
  const incoming = [...references.values()]
    .flat()
    .filter(item => item.id === id && ['apply', 'aura', 'keywordCarrier'].includes(item.usage));
  if (!incoming.length || incoming.some(item => item.usage !== 'keywordCarrier')) return fail();
  const creators = [...sources.values()]
    .flatMap(nodes)
    .filter(
      node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'keywordBuff' &&
        node.body.value.action.carrierBuffId === id,
    );
  if (
    !creators.length ||
    creators.some(
      node =>
        node.body.kind !== 'leaf' ||
        node.body.value.family !== 'keywordBuff' ||
        node.body.value.action.overrideChildBuffId,
    )
  )
    return fail();
  return declared.value;
}
