import type {
  ActionGraphDefinition,
  ActionGraphNode,
  ActionGraphResourceDefinition,
  ActionGraphStep,
} from '../../packages/game-data-contract/src/actionGraph';
import type { ResolvedActionSequence } from '../core/compiler/combatProgram';
import { createActionGraphCompilation } from '../core/compiler/compileActionGraph';

/** 无动作入口的定义使用的最小空图；每次调用返回新对象，避免跨资源共享图身份。 */
export const emptyActionGraph = (): ActionGraphResourceDefinition => ({
  main: { nodes: {} },
  macros: {},
});

/** 为已编译的共享图指定入口与静态调用位置，不分配运行调用身份。 */
export const graphEntry = (
  graph: ResolvedActionSequence['graph'],
  entry: string | null,
  callSite: string,
): ResolvedActionSequence => ({ graph, entry, callSite });

/** 编译独立图并包装成图入口；callSite 沿用修订身份，便于恢复类用例共享字面量。 */
export const compileGraphEntry = (
  revision: string,
  entry: string | null,
  nodes: ActionGraphDefinition['nodes'],
  dataNodes: ActionGraphDefinition['dataNodes'] = {},
): ResolvedActionSequence =>
  graphEntry(
    createActionGraphCompilation({ nodes, dataNodes }, 1, revision).compileAll(),
    entry,
    revision,
  );

/** 把线性动作列表编译成链式图入口；空列表得到显式空序列（entry 为 null）。 */
export const chainEntry = (
  revision: string,
  actions: readonly ActionGraphStep[],
  dataNodes: ActionGraphDefinition['dataNodes'] = {},
): ResolvedActionSequence => {
  const nodes: Record<string, ActionGraphNode> = {};
  actions.forEach((action, index) => {
    nodes[`step-${index}`] = {
      action,
      next: index + 1 < actions.length ? `step-${index + 1}` : null,
    };
  });
  return compileGraphEntry(revision, actions.length === 0 ? null : 'step-0', nodes, dataNodes);
};
