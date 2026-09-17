import type {
  CombatObjectNode,
  CombatObjectOrigins,
  CombatObjectRelation,
} from '../../../core/projection/combatObjectOrigins';

export type OriginRelationFilter = CombatObjectRelation | 'all' | 'buffChanges';
const buffChangeRelations = new Set<CombatObjectRelation>([
  'producedBy',
  'modifiedBy',
  'providedBy',
  'ownedBy',
  'originCast',
  'appliedBuff',
  'changedStacks',
  'attemptedStacking',
  'consumedBuff',
  'absorbedBuff',
  'endedBuff',
  'eventSource',
]);
export interface OriginGraphNode {
  readonly object: CombatObjectNode;
  readonly x: number;
  readonly y: number;
}
export interface OriginGraphEdge {
  readonly from: number;
  readonly to: number;
  readonly relation: CombatObjectRelation;
}

/** 展示层布局；共用对象只放置一次，回边保留，不复制为树节点。 */
export function layoutCombatOriginGraph(
  origins: CombatObjectOrigins,
  sequence: number,
  filter: OriginRelationFilter,
  maximum = 128,
) {
  const objects = [origins.get({ kind: 'receipt', sequence })];
  const indices = new Map<CombatObjectNode, number>([[objects[0]!, 0]]);
  const edges: OriginGraphEdge[] = [];
  let limited = false;
  for (let from = 0; from < objects.length; from++) {
    const object = objects[from]!;
    for (const link of origins.relations(object, sequence)) {
      // 图只追溯上游；实例/施法的过程索引属于向后展开，全部关系模式也不遍历。
      if (link.relation === 'buffEvent' || link.relation === 'castEvent') continue;
      const accepted =
        filter === 'all' ||
        (filter === 'buffChanges' && buffChangeRelations.has(link.relation)) ||
        (object.ref.kind === 'action' && link.relation === 'ownedBy') ||
        (filter === 'modifiedBy'
          ? link.relation === 'modifiedBy' || link.relation === 'providedBy'
          : link.relation === filter);
      if (!accepted) continue;
      let to = indices.get(link.target);
      if (to === undefined) {
        if (objects.length >= maximum) {
          limited = true;
          continue;
        }
        to = objects.length;
        objects.push(link.target);
        indices.set(link.target, to);
      }
      edges.push({ from, to, relation: link.relation });
    }
  }
  // DFS 回边只影响布局，不删除真实关系。最长路径分层避免共享来源被短路径拉回左侧。
  const outgoing = objects.map((_, from) => edges.filter(edge => edge.from === from));
  const visited = new Set<number>();
  const active = new Set<number>();
  const backEdges = new Set<OriginGraphEdge>();
  const order: number[] = [];
  function visit(index: number) {
    visited.add(index);
    active.add(index);
    for (const edge of outgoing[index]!) {
      if (active.has(edge.to)) backEdges.add(edge);
      else if (!visited.has(edge.to)) visit(edge.to);
    }
    active.delete(index);
    order.push(index);
  }
  visit(0);
  const depths = objects.map(() => 0);
  for (const from of order.reverse()) {
    for (const edge of outgoing[from]!) {
      if (!backEdges.has(edge)) depths[edge.to] = Math.max(depths[edge.to]!, depths[from]! + 1);
    }
  }
  const layers = Array.from({ length: Math.max(...depths) + 1 }, () => [] as number[]);
  depths.forEach((depth, index) => layers[depth]!.push(index));
  const positions = objects.map(() => 0);
  const updatePositions = () =>
    layers.forEach(layer =>
      layer.forEach((node, row) => {
        positions[node] = row - (layer.length - 1) / 2;
      }),
    );
  updatePositions();
  // 双向重心扫描，把同一提供者/消费者的分支放在一起，降低交叉。
  for (let pass = 0; pass < 8; pass++) {
    const forward = pass % 2 === 0;
    for (const layer of forward ? layers : [...layers].reverse()) {
      const score = (node: number) => {
        const neighbors = edges
          .filter(edge => !backEdges.has(edge) && (forward ? edge.to === node : edge.from === node))
          .map(edge => positions[forward ? edge.from : edge.to]!);
        return neighbors.length
          ? neighbors.reduce((sum, value) => sum + value, 0) / neighbors.length
          : positions[node]!;
      };
      const scores = new Map(layer.map(node => [node, score(node)]));
      layer.sort((a, b) => scores.get(a)! - scores.get(b)! || positions[a]! - positions[b]!);
      updatePositions();
    }
  }
  const detours = edges.filter(edge => depths[edge.to] !== depths[edge.from]! + 1);
  const top = 48 + detours.length * 16;
  const height = Math.max(...layers.map(layer => layer.length)) * 132 + top + 32;
  const nodes: OriginGraphNode[] = objects.map((object, index) => ({
    object,
    x: depths[index]! * 420 + 32,
    y: top + (height - top - 32) / 2 + positions[index]! * 132 - 44,
  }));
  const routes = edges.map(edge => {
    const from = nodes[edge.from]!,
      to = nodes[edge.to]!;
    const siblings = [...outgoing[edge.from]!].sort((a, b) => nodes[a.to]!.y - nodes[b.to]!.y);
    const incoming = edges
      .filter(candidate => candidate.to === edge.to)
      .sort((a, b) => nodes[a.from]!.y - nodes[b.from]!.y);
    const x1 = from.x + 240,
      x2 = to.x;
    const y1 = from.y + 12 + (64 * (siblings.indexOf(edge) + 1)) / (siblings.length + 1);
    const y2 = to.y + 12 + (64 * (incoming.indexOf(edge) + 1)) / (incoming.length + 1);
    const detour = detours.indexOf(edge);
    if (detour >= 0) {
      const y = 24 + detour * 16;
      return {
        path: `M ${x1} ${y1} H ${x1 + 28} V ${y} H ${x2 - 28} V ${y2} H ${x2}`,
        x: x1 + 36,
        y: y - 4,
      };
    }
    return {
      path: `M ${x1} ${y1} C ${x1 + 90} ${y1}, ${x2 - 90} ${y2}, ${x2} ${y2}`,
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2 - 7,
    };
  });
  return { nodes, edges, routes, limited, width: Math.max(...depths) * 420 + 304, height };
}
