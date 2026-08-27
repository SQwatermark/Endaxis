import { collectNativeActionNodes } from '../source/controlFlow.ts';
import type { SkillActionGraphSource } from '../source/skillActionGraph.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { TargetGroupActionSource } from '../source/targetGroup.ts';

function isPresentationQuery(action: TargetGroupActionSource): boolean {
  return (
    action.producerType === 'FindTargetAction' &&
    (action.finderType === 'SourceFinder' || action.finderType === 'FixedPointFinder') &&
    action.validatorTypes.length === 0 &&
    action.postProcessorTypes.length === 0
  );
}

/**
 * 在完整 SkillData 范围验证目标查询仅服务于表现，不局限于单个调度序列。
 * 只允许无过滤的来源/固定点查询；任一战斗消费者都会保留查询并交给严格投影报错。
 */
export function collectPresentationOnlyTargetGroups(
  graph: SkillActionGraphSource<KnownNativeActionLeafSource>,
): ReadonlySet<string> {
  const nodes = graph.actionGroup.timelineActions.flatMap(timeline =>
    collectNativeActionNodes(timeline.sequence),
  );
  const candidates = new Set(
    nodes.flatMap(node => {
      if (node.body.kind !== 'leaf' || node.body.value.family !== 'targetGroup') return [];
      const action = node.body.value.action;
      return isPresentationQuery(action) ? [action.targetGroupKey] : [];
    }),
  );
  // 被拒绝查询本身也会成为其上游的消费者，因此反复收缩到稳定集合。
  let changed: boolean;
  do {
    changed = false;
    for (const key of candidates) {
      const mixedSequence = graph.actionGroup.timelineActions.some(timeline => {
        const actions = collectNativeActionNodes(timeline.sequence);
        return (
          actions.some(
            node =>
              node.body.kind === 'leaf' &&
              node.body.value.family === 'targetGroup' &&
              node.body.value.action.targetGroupKey === key,
          ) &&
          actions.some(
            node =>
              node.body.kind !== 'leaf' ||
              (node.body.value.family !== 'presentation' &&
                !(
                  node.body.value.family === 'targetGroup' &&
                  candidates.has(node.body.value.action.targetGroupKey)
                )),
          )
        );
      });
      const unsafe =
        mixedSequence ||
        nodes.some(node => {
          // 控制流自身也可能读目标（例如 ForEach.target），不能只扫描叶子。
          if (node.body.kind !== 'leaf')
            return JSON.stringify(node.body).includes(JSON.stringify(key));
          const leaf = node.body.value;
          if (!JSON.stringify(leaf).includes(JSON.stringify(key))) return false;
          return (
            leaf.family !== 'presentation' &&
            !(
              leaf.family === 'targetGroup' &&
              isPresentationQuery(leaf.action) &&
              candidates.has(leaf.action.targetGroupKey)
            )
          );
        });
      if (unsafe) {
        candidates.delete(key);
        changed = true;
      }
    }
  } while (changed);
  return candidates;
}
