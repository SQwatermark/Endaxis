import type { SkillDefinition } from '../intermediateDefinitions.ts';
import { visitActionGraphReferences } from './actionGraphReferences.ts';
/**
 * 汇总资源图及其外部接收者的变量用途，删除无人读取的初值和可省略的写入。
 * 共享节点只分析一次；重接所有入口与后继后清除不可达节点。
 * 同步控制流做反向活性分析；跨调度用途与未建模控制保守保留。
 * 动态写入保留旧值依赖，不将容差写入当作必然覆盖。
 */
import type {
  ActionGraphDefinition,
  ActionGraphNode,
  ActionGraphReference,
  ActionGraphStep,
} from '../intermediateDefinitions.ts';
import type { CombatStepDefinition } from '../intermediateDefinitions.ts';
import type { OperatorBuffDefinitions } from '../intermediateDefinitions.ts';
import { NATIVE_SKILL_HAS_HIT_BLACKBOARD_KEY } from '../../../../../packages/game-data-contract/src/conditions.ts';
import type {
  EquipmentContributionDefinition,
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../intermediateDefinitions.ts';
import type {
  OperatorDefinition,
  OperatorPassiveSkillDefinition,
  OperatorUpgradeDefinition,
} from '../intermediateDefinitions.ts';
import type {
  AbilityEntityDefinition,
  OperatorAbilityEntityDefinitions,
} from '../intermediateDefinitions.ts';

import {
  isReadOnlyTargetQuery,
  actionValueUsage,
  analyzeConditionUsage,
  analyzeStepUsage,
  mergeDefinitionValueUsage,
  type DefinitionUsageContext,
  type DefinitionValueUsage,
} from './definitionUsageAnalysis.ts';
import type { DefinitionOptimizationMode } from './definitionOptimization.ts';
import type { SkillValueOptimizationReport } from './skillValueOptimization.ts';
import type { EquipmentValueOptimizationReport } from './equipmentValueOptimization.ts';
import { analyzeGraphSequenceUsage } from './graphSequenceOptimization.ts';
import {
  analyzeGraphBuffDefinitionUsage,
  graphBuffPrograms,
} from '../buffs/graphBuffValueUsage.ts';

const EMPTY_USAGE: DefinitionValueUsage = {
  reads: new Set(),
  writes: new Set(),
  externalReads: [],
  unknownAccess: false,
  mayThrow: false,
  observable: false,
};

function isGraphReference(value: unknown): value is ActionGraphReference {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  if (keys.length !== 1 || keys[0] !== '$sequence') return false;
  const target = (value as ActionGraphReference).$sequence;
  return typeof target === 'string' || target === null;
}

/** 从入口沿 next 与动作内 $sequence 引用走访每个可达节点一次；供收集器发现内联实体定义。 */
function walkGraphActions(
  graph: ActionGraphDefinition,
  entry: ActionGraphReference,
  visit: (action: ActionGraphStep, nodeId: string) => void,
): boolean {
  const visited = new Set<string>();
  const active = new Set<string>();
  let complete = true;
  const walk = (reference: ActionGraphReference): void => {
    const chain: string[] = [];
    let cursor = reference.$sequence;
    while (cursor !== null) {
      if (active.has(cursor)) {
        complete = false;
        break;
      }
      if (visited.has(cursor)) break;
      const node = graph.nodes[cursor];
      if (!node) {
        complete = false;
        break;
      }
      visited.add(cursor);
      active.add(cursor);
      chain.push(cursor);
      visit(node.action, cursor);
      visitActionGraphReferences(node.action, walk);
      cursor = node.next;
    }
    chain.forEach(id => active.delete(id));
  };
  walk(entry);
  return complete;
}

// ---------------------------------------------------------------------------
// 技能黑板与算术写入裁剪（图版）
// ---------------------------------------------------------------------------

interface GraphWriteCandidate {
  readonly nodeId: string;
  readonly path: string;
  readonly key: string;
  readonly usage: DefinitionValueUsage;
}

/** 返回值无用途的条件计算，只在其写入也没有外部消费者时整体删除。 */
function pruneUnobservedConditionComputations(
  skill: SkillDefinition,
  protectedKeys: ReadonlySet<string>,
  context: DefinitionUsageContext | undefined,
): {
  readonly skill: SkillDefinition;
  readonly removedWrites: SkillValueOptimizationReport['removedWrites'];
} {
  const removedWrites: { path: string; key: string }[] = [];
  let graph = skill.actionGraph.main;
  const entries = [
    ...skill.scheduledSequences.map(item => item.sequence),
    ...(skill.eventHandlers?.flatMap(handler =>
      handler.scheduledSequences.map(item => item.sequence),
    ) ?? []),
    ...(skill.switchToBuffCast ? [skill.switchToBuffCast.sequence] : []),
  ];
  const outsideConditions = [
    skill.availability,
    skill.switchToBuffCast?.condition,
    ...(skill.eventHandlers?.map(handler => handler.condition) ?? []),
  ].filter(value => value !== undefined);
  for (const [id, node] of Object.entries(graph.nodes)) {
    const action = node.action;
    if (
      action.kind !== 'ifElse' ||
      action.key !== undefined ||
      !action.parameters.alwaysNext ||
      action.whenTrue.$sequence !== action.whenFalse.$sequence ||
      action.condition.$sequence === null
    )
      continue;
    const writes = new Set<string>();
    let safe = true;
    const regionWrites: { path: string; key: string }[] = [];
    const complete = walkGraphActions(graph, action.condition, (step, nodeId) => {
      if (!safe || step.key !== undefined) {
        safe = false;
        return;
      }
      if (step.kind === 'ifElse') return;
      if (step.kind === 'checkCondition') {
        const condition = step.parameters.condition;
        if (
          ![
            'constant',
            'actionValueCompare',
            'casterControlled',
            'comboCameraAlphaSetting',
            'entityCountCompare',
          ].includes(condition.kind)
        ) {
          safe = false;
          return;
        }
        const usage = analyzeConditionUsage(condition);
        safe =
          !usage.observable &&
          !usage.unknownAccess &&
          usage.writes.size === 0 &&
          usage.externalReads.length === 0 &&
          [...usage.reads].every(key => Object.hasOwn(skill.blackboard ?? {}, key));
        return;
      }
      if (
        !['modifyActionValue', 'calculateActionValue', 'saveTwoDirectionAngle'].includes(step.kind)
      ) {
        safe = false;
        return;
      }
      if (
        step.kind === 'saveTwoDirectionAngle' &&
        [
          step.parameters.direction1Source,
          step.parameters.direction1Target,
          step.parameters.direction2Source,
          step.parameters.direction2Target,
        ].some(query => !isReadOnlyTargetQuery(query))
      ) {
        safe = false;
        return;
      }
      const usage = analyzeStepUsage(step as CombatStepDefinition, context);
      safe =
        !usage.unknownAccess &&
        usage.externalReads.length === 0 &&
        [...usage.reads].every(key => Object.hasOwn(skill.blackboard ?? {}, key));
      for (const key of usage.writes) {
        if (
          protectedKeys.has(key) ||
          key === NATIVE_SKILL_HAS_HIT_BLACKBOARD_KEY ||
          key.startsWith('EntityBB_')
        )
          safe = false;
        writes.add(key);
        regionWrites.push({ path: `condition:${id}→${nodeId}`, key });
      }
    });
    if (!complete || !safe || writes.size === 0) continue;
    const candidate = {
      ...graph,
      nodes: {
        ...graph.nodes,
        [id]: { ...node, action: { ...action, condition: { $sequence: null } } },
      },
    };
    // 从全部真实入口分析。共享调用、事件和继承接收方仍会看到这些写入，不能一起剪掉。
    const outside = mergeDefinitionValueUsage([
      ...entries.map(entry => analyzeGraphSequenceUsage(candidate, entry, context)),
      ...outsideConditions.map(analyzeConditionUsage),
    ]);
    if (
      outside.unknownAccess ||
      [...writes].some(
        key =>
          outside.reads.has(key) ||
          outside.writes.has(key) ||
          outside.externalReads.some(read => read.key === key),
      )
    )
      continue;
    graph = candidate;
    removedWrites.push(...regionWrites);
  }
  return {
    skill:
      graph === skill.actionGraph.main
        ? skill
        : { ...skill, actionGraph: { ...skill.actionGraph, main: graph } },
    removedWrites,
  };
}

/**
 * 删除图形态技能程序中无人使用的算术写入节点和黑板初值。
 * 覆盖 scheduledSequences、eventHandlers、switchToBuffCast，
 * 以及 availability/switchToBuffCast/eventHandlers 条件。
 */
export function pruneUnusedGraphSkillValues(
  skill: SkillDefinition,
  protectedKeys: ReadonlySet<string> = new Set(),
  usageContext?: DefinitionUsageContext,
): {
  readonly skill: SkillDefinition;
  readonly report: SkillValueOptimizationReport;
} {
  const conditionPruning = pruneUnobservedConditionComputations(skill, protectedKeys, usageContext);
  skill = conditionPruning.skill;
  const graph = skill.actionGraph.main;
  const live = new Set([...protectedKeys, NATIVE_SKILL_HAS_HIT_BLACKBOARD_KEY]);
  const candidates: GraphWriteCandidate[] = [];
  const candidateByNode = new Map<string, GraphWriteCandidate>();
  const requiredWrites = new Set<string>();
  const initial = skill.blackboard ?? {};
  let unresolvedAccess = false;
  const observe = (usage: DefinitionValueUsage) => {
    usage.reads.forEach(key => live.add(key));
    // 非算术动作的写入可能参与其返回值或与事件一起被观察，首批不删除其初始化。
    usage.writes.forEach(key => live.add(key));
    unresolvedAccess ||= usage.unknownAccess;
  };
  const visited = new Set<string>();
  /** 记录入口返回值是否可能被消费，避免仅为内部执行状态保留无用写入。 */
  const positions: {
    readonly reference: ActionGraphReference;
    readonly path: string;
    readonly resultIsConsumed: boolean;
  }[] = [];
  const collectReference = (
    reference: ActionGraphReference,
    path: string,
    resultIsConsumed = true,
  ): void => {
    positions.push({ reference, path, resultIsConsumed });
    let cursor = reference.$sequence;
    while (cursor !== null) {
      if (visited.has(cursor)) break;
      visited.add(cursor);
      const node = graph.nodes[cursor];
      if (!node) break;
      collectAction(node.action, `${path}→${cursor}`, cursor);
      cursor = node.next;
    }
  };
  const collectAction = (action: ActionGraphStep, path: string, nodeId: string): void => {
    switch (action.kind) {
      case 'modifyActionValue':
      case 'calculateActionValue':
      case 'saveTwoDirectionAngle': {
        // 图节点的叶动作形态与树相同，直接复用逐步用途分析。
        const usage = analyzeStepUsage(action as unknown as CombatStepDefinition, usageContext);
        const outputKey =
          action.kind === 'saveTwoDirectionAngle'
            ? action.parameters.outputKey
            : action.parameters.key;
        const candidate: GraphWriteCandidate = {
          nodeId,
          path,
          key: outputKey,
          usage,
        };
        candidates.push(candidate);
        candidateByNode.set(nodeId, candidate);
        const operands =
          action.kind === 'modifyActionValue'
            ? [action.parameters.value]
            : action.kind === 'calculateActionValue'
              ? [action.parameters.left, action.parameters.right]
              : [];
        const canResolveInputs = operands.every(
          operand =>
            operand.kind === 'constant' ||
            (operand.kind === 'blackboard' &&
              (operand.fallback !== undefined || Object.hasOwn(initial, operand.key))),
        );
        const queryMayHaveEffects =
          action.kind === 'saveTwoDirectionAngle' &&
          [
            action.parameters.direction1Source,
            action.parameters.direction1Target,
            action.parameters.direction2Source,
            action.parameters.direction2Target,
          ].some(query => !isReadOnlyTargetQuery(query));
        // EntityBB_ 是原生动态写入路由，不是对象特例；它可能被同一实体的其他技能读取。
        if (
          action.key !== undefined ||
          outputKey.startsWith('EntityBB_') ||
          protectedKeys.has(outputKey) ||
          queryMayHaveEffects ||
          !canResolveInputs
        ) {
          live.add(outputKey);
          requiredWrites.add(nodeId);
        }
        return;
      }
      case 'anyCondition':
        action.conditions.forEach((condition, index) =>
          collectReference(condition, `${path}.conditions[${index}]`),
        );
        return;
      case 'jumpTimeline':
        collectReference(action.condition, `${path}.condition`);
        return;
      case 'ifElse':
        collectReference(action.condition, `${path}.condition`);
        collectReference(
          action.whenTrue,
          `${path}.whenTrue`,
          action.parameters.alwaysNext !== true,
        );
        collectReference(
          action.whenFalse,
          `${path}.whenFalse`,
          action.parameters.alwaysNext !== true,
        );
        return;
      case 'conditional':
        observe(analyzeConditionUsage(action.parameters.condition));
        collectReference(
          action.whenTrue,
          `${path}.whenTrue`,
          action.parameters.alwaysNext !== true,
        );
        if (action.whenFalse !== undefined)
          collectReference(
            action.whenFalse,
            `${path}.whenFalse`,
            action.parameters.alwaysNext !== true,
          );
        return;
      case 'switch':
        observe(
          mergeDefinitionValueUsage([
            actionValueUsage(action.parameters.choice),
            ...action.options.map(option => actionValueUsage(option.value)),
          ]),
        );
        action.options.forEach((option, optionIndex) =>
          collectReference(
            option.sequence,
            `${path}.options[${optionIndex}].sequence`,
            action.parameters.alwaysNext !== true,
          ),
        );
        return;
      case 'aura':
        observe(analyzeStepUsage(action as unknown as CombatStepDefinition, usageContext));
        collectReference(action.onEnter, `${path}.onEnter`);
        collectReference(action.onExit, `${path}.onExit`);
        return;
      case 'once':
      case 'repeatEachTick':
      case 'forEachContextTarget':
        collectReference(action.body, `${path}.body`);
        return;
      case 'repeatByActionValue':
        observe(actionValueUsage(action.parameters.count));
        collectReference(action.body, `${path}.body`);
        return;
      case 'withActionBlackboardScope':
        // 与树版一致：整个子作用域按 analyzeStepUsage 汇总（body 内写入不是候选，不能删），
        // 父快照会覆盖子 initialValues，同一 scopeKey 还可能复用其他入口先创建的板。
        // entityAssignments 的值操作数在父板上求值，必须与 body 一样计入父板读取；
        // initialValues/entityInitialValues 是子板初值，不是父板读取。
        observe(
          mergeDefinitionValueUsage([
            analyzeGraphSequenceUsage(graph, action.body, usageContext),
            ...Object.values(action.parameters.entityAssignments ?? {}).map(actionValueUsage),
          ]),
        );
        return;
      case 'listenForCombatEvents':
        action.parameters.responses.forEach((response, responseIndex) => {
          if (response.condition !== undefined) observe(analyzeConditionUsage(response.condition));
          collectReference(
            response.sequence,
            `${path}.parameters.responses[${responseIndex}].sequence`,
          );
        });
        return;
      case 'launchProjectile':
        // 回调沿自己的图分析；回调 direct 板继承创建时父快照，回调体读取上传为父板读取。
        observe(
          mergeDefinitionValueUsage([
            ...(action.parameters.targets?.kind === 'count'
              ? [actionValueUsage(action.parameters.targets.count)]
              : []),
            ...Object.values(action.parameters.entityAssignments ?? {}).map(actionValueUsage),
            ...action.callbacks.flatMap(callback =>
              callback.skill.scheduledSequences.map(item =>
                analyzeGraphSequenceUsage(
                  callback.skill.actionGraph.main,
                  item.sequence,
                  usageContext,
                ),
              ),
            ),
          ]),
        );
        return;
      case 'callResource':
      case 'callMacro':
        // 裁剪早于宏提取，正常不会出现；防御性保守标成未知访问。
        observe({ ...EMPTY_USAGE, unknownAccess: true, mayThrow: true, observable: true });
        return;
      default:
        observe(analyzeStepUsage(action as unknown as CombatStepDefinition, usageContext));
    }
  };
  if (skill.availability !== undefined) observe(analyzeConditionUsage(skill.availability));
  if (skill.switchToBuffCast?.condition !== undefined)
    observe(analyzeConditionUsage(skill.switchToBuffCast.condition));
  skill.eventHandlers?.forEach(handler => {
    if (handler.condition !== undefined) observe(analyzeConditionUsage(handler.condition));
  });
  skill.scheduledSequences.forEach((item, index) =>
    collectReference(item.sequence, `scheduledSequences[${index}].sequence`, false),
  );
  skill.eventHandlers?.forEach((handler, handlerIndex) =>
    handler.scheduledSequences.forEach((item, index) =>
      collectReference(
        item.sequence,
        `eventHandlers[${handlerIndex}].scheduledSequences[${index}].sequence`,
        false,
      ),
    ),
  );
  if (skill.switchToBuffCast !== undefined)
    collectReference(skill.switchToBuffCast.sequence, 'switchToBuffCast.sequence', false);
  const skillId = skill.key;
  if (unresolvedAccess)
    return {
      skill,
      report: {
        skillId,
        removedWrites: [],
        removedInitialKeys: [],
        retainedLifetimePaths: [],
        retainedReason: 'unresolved-blackboard-access',
      },
    };
  const retainInputs = () => {
    let changed: boolean;
    do {
      changed = false;
      for (const candidate of candidates) {
        if (!live.has(candidate.key)) continue;
        for (const key of candidate.usage.reads) {
          if (!live.has(key)) {
            live.add(key);
            changed = true;
          }
        }
      }
    } while (changed);
  };
  retainInputs();
  /** 沿 next 收集链节点；成环或节点缺失时停止（成环节点保守不再全删，由留一命兜底）。 */
  const chainFrom = (start: string): string[] => {
    const ids: string[] = [];
    const seen = new Set<string>();
    let cursor: string | null = start;
    while (cursor !== null && !seen.has(cursor)) {
      seen.add(cursor);
      const node: ActionGraphNode | undefined = graph.nodes[cursor];
      if (!node) break;
      ids.push(cursor);
      cursor = node.next;
    }
    return ids;
  };
  /** 分支调用的所有返回位置参与汇合；未知控制流不参与逐写入删除。 */
  const findDeadWrites = (): Set<string> => {
    if (!skill.scheduledSequences.length) return new Set();
    type Successor = string | symbol;
    const successors = new Map<string, Set<Successor>>();
    const boundaries = new Map<symbol, ReadonlySet<string>>();
    const reads = new Map<string, ReadonlySet<string>>();
    const calls = new Set<string>();
    const active = new Set<string>();
    let supported = true;
    const deferredUses = new Set<string>();
    const retainDeferred = (reference: ActionGraphReference): void => {
      const usage = analyzeGraphSequenceUsage(graph, reference, usageContext);
      if (usage.unknownAccess) supported = false;
      [...usage.reads, ...usage.writes].forEach(key => deferredUses.add(key));
    };
    const connect = (reference: ActionGraphReference, returns: readonly Successor[]): void => {
      if (reference.$sequence === null) return;
      const identity = JSON.stringify([reference.$sequence, returns.map(String)]);
      if (active.has(reference.$sequence)) {
        supported = false;
        return;
      }
      if (calls.has(identity)) return;
      calls.add(identity);
      active.add(reference.$sequence);
      const chain = chainFrom(reference.$sequence);
      if (chain.length === 0 || graph.nodes[chain.at(-1)!]?.next !== null) supported = false;
      for (const id of chain) {
        const node = graph.nodes[id]!;
        const after = node.next === null ? returns : [node.next];
        const edges = successors.get(id) ?? new Set<Successor>();
        after.forEach(next => edges.add(next));
        successors.set(id, edges);
        const action = node.action;
        if (action.kind === 'ifElse' || action.kind === 'conditional') {
          const branches = [action.whenTrue, action.whenFalse].filter(
            (ref): ref is ActionGraphReference => ref !== undefined,
          );
          for (const branch of branches) {
            if (branch.$sequence !== null) edges.add(branch.$sequence);
            connect(branch, after);
          }
          if (action.kind === 'ifElse') {
            if (action.condition.$sequence !== null) edges.add(action.condition.$sequence);
            connect(action.condition, [
              ...after,
              ...branches.flatMap(branch => (branch.$sequence === null ? [] : [branch.$sequence])),
            ]);
            reads.set(id, new Set());
          } else {
            const usage = analyzeConditionUsage(action.parameters.condition);
            reads.set(id, new Set([...usage.reads, ...usage.writes]));
          }
        } else if (action.kind === 'switch') {
          for (const option of action.options) {
            if (option.sequence.$sequence !== null) edges.add(option.sequence.$sequence);
            connect(option.sequence, after);
          }
          reads.set(
            id,
            mergeDefinitionValueUsage([
              actionValueUsage(action.parameters.choice),
              ...action.options.map(option => actionValueUsage(option.value)),
            ]).reads,
          );
        } else if (action.kind === 'anyCondition') {
          action.conditions.forEach((condition, index) => {
            if (condition.$sequence !== null) edges.add(condition.$sequence);
            // 条件成功直接返回，失败才继续后续条件；两种去向都必须保留。
            connect(condition, [
              ...after,
              ...action.conditions
                .slice(index + 1)
                .flatMap(next => (next.$sequence === null ? [] : [next.$sequence])),
            ]);
          });
          reads.set(id, new Set());
        } else if (
          action.kind === 'once' ||
          action.kind === 'repeatByActionValue' ||
          action.kind === 'forEachContextTarget'
        ) {
          if (action.body.$sequence !== null) edges.add(action.body.$sequence);
          const repeats =
            action.kind !== 'once' && action.body.$sequence !== null
              ? [action.body.$sequence!]
              : [];
          connect(action.body, [...after, ...repeats]);
          reads.set(
            id,
            action.kind === 'repeatByActionValue'
              ? actionValueUsage(action.parameters.count).reads
              : new Set(),
          );
        } else if (!candidateByNode.has(id)) {
          // 子序列的时机未纳入同步控制流；保留其用途，不阻断其他区域分析。
          visitActionGraphReferences(action, retainDeferred);
          if (action.kind === 'jumpTimeline') live.forEach(key => deferredUses.add(key));
          // 非控制动作可能同步发布事件或保存变量快照，保守保留整图用途。
          reads.set(id, live);
        }
      }
      active.delete(reference.$sequence);
    };
    const exit = new Set([...protectedKeys, NATIVE_SKILL_HAS_HIT_BLACKBOARD_KEY]);
    if (skill.availability) {
      const usage = analyzeConditionUsage(skill.availability);
      [...usage.reads, ...usage.writes].forEach(key => exit.add(key));
    }
    const entryUsages = skill.scheduledSequences.map(entry =>
      analyzeGraphSequenceUsage(graph, entry.sequence, usageContext),
    );
    skill.scheduledSequences.forEach((entry, index) => {
      const boundary = Symbol(`schedule-${index}`);
      const needed = new Set(exit);
      // 调度可能跨帧交错；其他入口的读写都作为可观察用途保留。
      entryUsages.forEach((usage, other) => {
        if (other !== index) [...usage.reads, ...usage.writes].forEach(key => needed.add(key));
      });
      boundaries.set(boundary, needed);
      connect(entry.sequence, [boundary]);
    });
    for (const handler of skill.eventHandlers ?? []) {
      if (handler.condition) {
        const usage = analyzeConditionUsage(handler.condition);
        [...usage.reads, ...usage.writes].forEach(key => deferredUses.add(key));
      }
      handler.scheduledSequences.forEach(entry => retainDeferred(entry.sequence));
    }
    if (skill.switchToBuffCast) {
      retainDeferred(skill.switchToBuffCast.sequence);
      if (skill.switchToBuffCast.condition) {
        const usage = analyzeConditionUsage(skill.switchToBuffCast.condition);
        [...usage.reads, ...usage.writes].forEach(key => deferredUses.add(key));
      }
    }
    for (const [boundary, needed] of boundaries)
      boundaries.set(boundary, new Set([...needed, ...deferredUses]));
    if (!supported) return new Set();
    const inputs = new Map([...successors.keys()].map(id => [id, new Set<string>()]));
    const outputs = new Map<string, Set<string>>();
    let changed: boolean;
    do {
      changed = false;
      for (const [id, edges] of successors) {
        const output = new Set<string>();
        for (const next of edges)
          for (const key of typeof next === 'symbol'
            ? boundaries.get(next)!
            : (inputs.get(next) ?? []))
            output.add(key);
        outputs.set(id, output);
        const candidate = candidateByNode.get(id);
        const input = inputs.get(id)!;
        const neededReads = candidate
          ? requiredWrites.has(id) || output.has(candidate.key)
            ? candidate.usage.reads
            : []
          : (reads.get(id) ?? []);
        // 容差赋值不能 kill 目的键：后继读取仍依赖进入该写入时的旧值。
        for (const key of [...output, ...neededReads]) {
          if (!input.has(key)) {
            input.add(key);
            changed = true;
          }
        }
      }
    } while (changed);
    return new Set(
      candidates
        .filter(
          candidate =>
            outputs.has(candidate.nodeId) &&
            !requiredWrites.has(candidate.nodeId) &&
            !outputs.get(candidate.nodeId)!.has(candidate.key),
        )
        .map(candidate => candidate.nodeId),
    );
  };
  // 嵌套控制仍可能观察重复执行的返回值；根调度及施放旁路忽略返回值，可删空。
  // 需要保留时连同输入一起恢复，避免留下缺键读取。
  const retainedLifetimePaths = new Set<string>();
  let deletable = new Set<string>();
  let retained: boolean;
  do {
    retained = false;
    const deadWrites = findDeadWrites();
    deletable = new Set(
      candidates
        .filter(candidate => !live.has(candidate.key) || deadWrites.has(candidate.nodeId))
        .map(candidate => candidate.nodeId),
    );
    for (const { reference, path, resultIsConsumed } of positions) {
      if (!resultIsConsumed || reference.$sequence === null) continue;
      const chain = chainFrom(reference.$sequence);
      if (chain.length === 0 || !chain.every(id => deletable.has(id))) continue;
      const first = candidateByNode.get(chain[0]!);
      if (first === undefined || requiredWrites.has(first.nodeId)) continue;
      requiredWrites.add(first.nodeId);
      live.add(first.key);
      retainedLifetimePaths.add(`${path}→${chain[0]}`);
      retained = true;
    }
    if (retained) retainInputs();
  } while (retained);
  /** 跳过连续的被删节点，返回下一个幸存节点；允许无有效结果的根入口重接为空。 */
  const skip = (start: string): string | null => {
    const seen = new Set<string>();
    let cursor: string | null = start;
    while (cursor !== null && deletable.has(cursor)) {
      if (seen.has(cursor)) return null;
      seen.add(cursor);
      cursor = graph.nodes[cursor]?.next ?? null;
    }
    return cursor;
  };
  const remapReference = (reference: ActionGraphReference): ActionGraphReference =>
    reference.$sequence !== null && deletable.has(reference.$sequence)
      ? { $sequence: skip(reference.$sequence) }
      : reference;
  const remapValue = (value: unknown): unknown => {
    if (value && typeof value === 'object' && 'actionGraph' in value) return value;
    if (Array.isArray(value)) {
      const mapped = value.map(remapValue);
      return mapped.every((item, index) => item === value[index]) ? value : mapped;
    }
    if (isGraphReference(value)) return remapReference(value);
    if (!value || typeof value !== 'object') return value;
    const entries = Object.entries(value).map(([key, item]) => [key, remapValue(item)] as const);
    return entries.every(([key, item]) => item === (value as Record<string, unknown>)[key])
      ? value
      : Object.fromEntries(entries);
  };
  const removedWrites = [
    ...conditionPruning.removedWrites,
    ...candidates
      .filter(candidate => deletable.has(candidate.nodeId))
      .map(candidate => ({ path: candidate.path, key: candidate.key })),
  ];
  const nextNodes: Record<string, ActionGraphNode> = {};
  for (const [id, node] of Object.entries(graph.nodes)) {
    if (deletable.has(id)) continue;
    const next = node.next !== null && deletable.has(node.next) ? skip(node.next) : node.next;
    const action = remapValue(node.action) as ActionGraphStep;
    nextNodes[id] = next === node.next && action === node.action ? node : { action, next };
  }
  const mapScheduled = <T extends { readonly sequence: ActionGraphReference }>(
    items: readonly T[],
  ): T[] =>
    items.map(item => {
      const sequence = remapReference(item.sequence);
      return sequence === item.sequence ? item : { ...item, sequence };
    });
  const roots: ActionGraphReference[] = [];
  const result: SkillDefinition = {
    ...skill,
    scheduledSequences: mapScheduled(skill.scheduledSequences).map((item, index) => {
      roots.push(item.sequence);
      void index;
      return item;
    }),
    ...(skill.eventHandlers === undefined
      ? {}
      : {
          eventHandlers: skill.eventHandlers.map(handler => ({
            ...handler,
            scheduledSequences: mapScheduled(handler.scheduledSequences).map(item => {
              roots.push(item.sequence);
              return item;
            }),
          })),
        }),
    ...(skill.switchToBuffCast === undefined
      ? {}
      : {
          switchToBuffCast: (() => {
            const sequence = remapReference(skill.switchToBuffCast.sequence);
            roots.push(sequence);
            return sequence === skill.switchToBuffCast.sequence
              ? skill.switchToBuffCast
              : { ...skill.switchToBuffCast, sequence };
          })(),
        }),
    actionGraph: { ...skill.actionGraph, main: { nodes: nextNodes } },
  };
  // 删除节点后，从全部入口做可达性收集，未被任何入口或引用到达的节点从新 nodes 表剔除。
  const reachable = new Set<string>();
  const visitReference = (reference: ActionGraphReference): void => {
    let cursor = reference.$sequence;
    while (cursor !== null) {
      if (reachable.has(cursor)) return;
      reachable.add(cursor);
      const node = nextNodes[cursor];
      if (!node) return;
      visitActionGraphReferences(node.action, visitReference);
      cursor = node.next;
    }
  };
  roots.forEach(visitReference);
  for (const id of Object.keys(nextNodes)) if (!reachable.has(id)) delete nextNodes[id];
  const removedInitialKeys = Object.keys(initial).filter(
    key => !live.has(key) && !key.startsWith('EntityBB_'),
  );
  let output = result;
  if (removedInitialKeys.length > 0) {
    const removed = new Set(removedInitialKeys);
    output = {
      ...result,
      blackboard: Object.fromEntries(Object.entries(initial).filter(([key]) => !removed.has(key))),
    };
  }
  return {
    skill: removedWrites.length === 0 && removedInitialKeys.length === 0 ? skill : output,
    report: {
      skillId,
      removedWrites,
      removedInitialKeys,
      retainedLifetimePaths: [...retainedLifetimePaths],
    },
  };
}

// ---------------------------------------------------------------------------
// 装备黑板初值裁剪（图版）
// ---------------------------------------------------------------------------

/** 只删除初值，不移除写入或入口；空程序仍保留原有装备宿主和注册行为。 */
export function pruneUnusedGraphEquipmentContributionBlackboard(
  value: EquipmentContributionDefinition,
  options: {
    readonly mode: DefinitionOptimizationMode;
    readonly definitionId: string;
    readonly path: string;
  },
): {
  readonly contribution: EquipmentContributionDefinition;
  readonly report: EquipmentValueOptimizationReport;
} {
  const report = { definitionId: options.definitionId, path: options.path };
  if (options.mode === 'off') {
    return {
      contribution: value,
      report: { ...report, removedInitialKeys: [], retainedReason: 'optimization-disabled' },
    };
  }
  const graph = value.actionGraph?.main;
  // 程序引用存在却找不到图时是残缺输入；保守标成未知访问，不按空程序裁剪。
  const program = (reference: ActionGraphReference): DefinitionValueUsage =>
    graph === undefined
      ? { ...EMPTY_USAGE, unknownAccess: true, mayThrow: true }
      : analyzeGraphSequenceUsage(graph, reference);
  const usage = mergeDefinitionValueUsage([
    ...(value.enableSequence === undefined ? [] : [program(value.enableSequence)]),
    ...(value.initializationSequence === undefined ? [] : [program(value.initializationSequence)]),
    ...(value.eventHandlers?.flatMap(handler => [
      ...(handler.condition === undefined ? [] : [analyzeConditionUsage(handler.condition)]),
      program(handler.sequence),
    ]) ?? []),
  ]);
  if (usage.unknownAccess) {
    return {
      contribution: value,
      report: { ...report, removedInitialKeys: [], retainedReason: 'unresolved-blackboard-access' },
    };
  }
  const { blackboard, ...contribution } = value;
  // 数值写入会用旧值进行 epsilon 比较；即使没有后续显式读取，也不能删除目的键初值。
  const isUsed = (key: string) => usage.reads.has(key) || usage.writes.has(key);
  const remaining = Object.entries(blackboard ?? {}).filter(([key]) => isUsed(key));
  const removedInitialKeys = Object.keys(blackboard ?? {}).filter(key => !isUsed(key));
  return {
    contribution:
      blackboard === undefined
        ? value
        : remaining.length === 0
          ? contribution
          : removedInitialKeys.length === 0
            ? value
            : { ...contribution, blackboard: Object.fromEntries(remaining) },
    report: {
      ...report,
      removedInitialKeys,
      ...(remaining.length === 0 ? {} : { retainedReason: 'runtime-value-access' }),
    },
  };
}

// ---------------------------------------------------------------------------
// 跨实体用途上下文（图版）
// ---------------------------------------------------------------------------

/** 一段不隶属于任何定义的独立图程序入口（机制序列等）；图与入口必须成对提供。 */
export interface GraphSequenceSource {
  readonly graph: ActionGraphDefinition;
  readonly entry: ActionGraphReference;
}

/** 所有实体都必须保留的外部用途。与树版一致，首版不缩小 Buff 目标，允许多保留键。 */
export interface GraphSharedEntityValueUsage {
  readonly reads: ReadonlySet<string>;
  readonly unknownAccess: boolean;
  readonly commonAbilityEntityDefinitions: OperatorAbilityEntityDefinitions;
}

/** 与 SharedEntityValueUsageInput 相同的域划分；序列改为图入口，装备/Buff/干员为图形态。 */
export interface GraphSharedEntityValueUsageInput {
  readonly operators: readonly OperatorDefinition[];
  readonly commonBuffDefinitions: OperatorBuffDefinitions;
  readonly commonAbilityEntityDefinitions: OperatorAbilityEntityDefinitions;
  readonly weapons: readonly WeaponDefinition[];
  readonly gears: readonly GearDefinition[];
  readonly gearSets: readonly GearSetDefinition[];
  readonly mechanicBuffDefinitions: OperatorBuffDefinitions;
  readonly mechanicSequences: readonly GraphSequenceSource[];
}

/** 与 SharedEntityValueUsageCollector 相同的分阶段契约；finish 后拒绝新增用途。 */
export interface GraphSharedEntityValueUsageCollector {
  addOperator(operator: OperatorDefinition): void;
  /** 公共、私有和机制 Buff 均按相同规则处理。 */
  addBuffDefinitions(definitions: OperatorBuffDefinitions): void;
  addWeapon(weapon: WeaponDefinition): void;
  addGear(gear: GearDefinition): void;
  addGearSet(gearSet: GearSetDefinition): void;
  addSequence(source: GraphSequenceSource): void;
  /** 合并其他阶段的摘要，必须引用创建本收集器时的同一个公共实体目录对象。 */
  addUsage(usage: GraphSharedEntityValueUsage): void;
  /** 返回最终摘要，之后拒绝新增用途，避免优化上下文漏掉迟来的读取或未知访问。 */
  finish(): GraphSharedEntityValueUsage;
}

const empty = () => mergeDefinitionValueUsage([]);

/**
 * snapshot 只复制 direct 层，不枚举后备实体板。收集后备板读取时，不把这种传出误报为
 * "读取全部宿主键"；显式赋值操作数和回调的实际读取仍由公共用途分析器汇总。
 */
const fallbackContext: DefinitionUsageContext = { inheritedAbilityEntityUsage: empty };

export function collectGraphSharedEntityValueUsage(
  input: GraphSharedEntityValueUsageInput,
): GraphSharedEntityValueUsage {
  const collector = createGraphSharedEntityValueUsageCollector(
    input.commonAbilityEntityDefinitions,
  );
  input.operators.forEach(collector.addOperator);
  collector.addBuffDefinitions(input.commonBuffDefinitions);
  input.weapons.forEach(collector.addWeapon);
  input.gears.forEach(collector.addGear);
  input.gearSets.forEach(collector.addGearSet);
  collector.addBuffDefinitions(input.mechanicBuffDefinitions);
  input.mechanicSequences.forEach(collector.addSequence);
  return collector.finish();
}

/** 只强引用读键和公共实体目录；用于去重的 WeakSet/WeakMap 不阻止调用方释放已分析的定义。 */
export function createGraphSharedEntityValueUsageCollector(
  commonAbilityEntityDefinitions: OperatorAbilityEntityDefinitions,
): GraphSharedEntityValueUsageCollector {
  const reads = new Set<string>();
  let unknownAccess = false;
  let result: GraphSharedEntityValueUsage | undefined;
  const requireOpen = () => {
    if (result !== undefined) throw new Error('entity value usage collection is already finished');
  };
  const observedSequences = new WeakMap<ActionGraphDefinition, WeakSet<ActionGraphReference>>();
  const observedBuffs = new WeakSet<object>();
  const observedEntities = new WeakSet<object>();
  const observe = (usage: DefinitionValueUsage, includeCurrent = false) => {
    if (includeCurrent) {
      usage.reads.forEach(key => reads.add(key));
      usage.writes.forEach(key => reads.add(key));
    }
    // Buff 查询当前返回 direct 快照。仍保守纳入这些键，避免缩小其宿主/来源关系。
    usage.externalReads.forEach(read => reads.add(read.key));
    unknownAccess ||= usage.unknownAccess;
  };
  const condition = (value: Parameters<typeof analyzeConditionUsage>[0] | undefined) => {
    if (value !== undefined) observe(analyzeConditionUsage(value));
  };
  const sequence = (source: GraphSequenceSource) => {
    let seen = observedSequences.get(source.graph);
    if (seen === undefined) {
      seen = new WeakSet();
      observedSequences.set(source.graph, seen);
    }
    if (seen.has(source.entry)) return;
    seen.add(source.entry);
    observe(analyzeGraphSequenceUsage(source.graph, source.entry, fallbackContext));
    walkGraphActions(source.graph, source.entry, action => {
      if (action.kind === 'spawnAbilityEntity' && action.parameters.definition !== undefined)
        entity(action.parameters.definition as AbilityEntityDefinition);
    });
  };
  /** 程序引用存在却找不到所属图时是残缺输入；保守标成未知访问。 */
  const program = (
    graph: ActionGraphDefinition | undefined,
    reference: ActionGraphReference | undefined,
  ) => {
    if (reference === undefined) return;
    if (graph === undefined) {
      unknownAccess = true;
      return;
    }
    sequence({ graph, entry: reference });
  };
  const buff = (value: OperatorBuffDefinitions[string]) => {
    if (observedBuffs.has(value)) return;
    observedBuffs.add(value);
    observe(analyzeGraphBuffDefinitionUsage(value, fallbackContext), true);
    const { graph, entries } = graphBuffPrograms(value);
    entries.forEach(entry => program(graph, entry));
  };
  const entity = (value: AbilityEntityDefinition) => {
    if (observedEntities.has(value)) return;
    observedEntities.add(value);
    value.childSkill?.scheduledSequences.forEach(item =>
      program(value.childSkill!.actionGraph.main, item.sequence),
    );
    Object.values(value.childSkills ?? {}).forEach(child =>
      child.scheduledSequences.forEach(item => program(child.actionGraph.main, item.sequence)),
    );
    value.passiveSkills?.forEach(passive => {
      program(passive.actionGraph.main, passive.enableSequence);
      passive.abilityEventResponses?.forEach(response =>
        program(passive.actionGraph.main, response.sequence),
      );
    });
  };
  const passive = (value: OperatorPassiveSkillDefinition) => {
    const graph = value.actionGraph?.main;
    program(graph, value.enableSequence);
    value.abilityEventResponses?.forEach(response => program(graph, response.sequence));
  };
  const skill = (value: SkillDefinition) => {
    const graph = value.actionGraph.main;
    condition(value.availability);
    value.scheduledSequences.forEach(item => sequence({ graph, entry: item.sequence }));
    if (value.switchToBuffCast !== undefined) {
      condition(value.switchToBuffCast.condition);
      sequence({ graph, entry: value.switchToBuffCast.sequence });
    }
    value.eventHandlers?.forEach(handler => {
      condition(handler.condition);
      handler.scheduledSequences.forEach(item => sequence({ graph, entry: item.sequence }));
    });
  };
  const skills = (values: SkillDefinition | readonly SkillDefinition[]) => {
    if ('key' in values) skill(values);
    else values.forEach(skill);
  };
  const upgrade = (value: OperatorUpgradeDefinition) => {
    const graph = value.actionGraph?.main;
    program(graph, value.initializationSequence);
    value.eventHandlers?.forEach(handler => program(graph, handler.sequence));
    value.passiveSkills?.forEach(item => passive(item));
  };
  const contribution = (value: EquipmentContributionDefinition) => {
    const graph = value.actionGraph?.main;
    program(graph, value.enableSequence);
    program(graph, value.initializationSequence);
    value.eventHandlers?.forEach(handler => {
      condition(handler.condition);
      program(graph, handler.sequence);
    });
  };
  const operator = (value: OperatorDefinition) => {
    value.skillGroups.forEach(group => {
      skills(group.skills);
      group.variants?.forEach(variant => skills(variant.skills));
      group.replacementSkills?.forEach(skill);
      group.routedReplacementSkills?.forEach(route => skill(route.skill));
    });
    value.talents.forEach(upgrade);
    value.potentials.forEach(upgrade);
    value.passiveSkills?.forEach(item => passive(item));
    // 图形态干员的顶级 eventHandlers 没有独立图宿主（渲染期禁止残留）；残缺输入保守处理。
    value.eventHandlers?.forEach(() => {
      unknownAccess = true;
    });
    value.comboSkillConditions?.forEach(item => {
      program(item.actionGraph?.main, item.sequence);
    });
    Object.values(value.buffDefinitions ?? {}).forEach(buff);
    Object.values(value.abilityEntityDefinitions ?? {}).forEach(item => entity(item));
  };
  Object.values(commonAbilityEntityDefinitions).forEach(item => entity(item));
  return {
    addOperator(value) {
      requireOpen();
      operator(value);
    },
    addBuffDefinitions(definitions) {
      requireOpen();
      Object.values(definitions).forEach(buff);
    },
    addWeapon(weapon) {
      requireOpen();
      weapon.traits.forEach(contribution);
      Object.values(weapon.buffDefinitions ?? {}).forEach(buff);
    },
    addGear(_gear) {
      requireOpen();
      // EquipTable 装备只有静态词条，没有动作程序或实体值读取。
    },
    addGearSet(gearSet) {
      requireOpen();
      contribution(gearSet);
      Object.values(gearSet.buffDefinitions ?? {}).forEach(buff);
    },
    addSequence(value) {
      requireOpen();
      sequence(value);
    },
    addUsage(usage) {
      requireOpen();
      if (usage.commonAbilityEntityDefinitions !== commonAbilityEntityDefinitions)
        throw new Error('entity value usage summaries must share the same common entity catalog');
      usage.reads.forEach(key => reads.add(key));
      unknownAccess ||= usage.unknownAccess;
    },
    finish() {
      result ??= { reads, unknownAccess, commonAbilityEntityDefinitions };
      return result;
    },
  };
}

/**
 * 未提供整批共享用途时不开启实体精确传值；循环或缺失接收方同样返回未知。
 * 每个子技能与被动技能只分析自己的图，禁止回退到生成实体的技能图。
 */
export function createGraphEntityUsageContext(
  definitions: OperatorAbilityEntityDefinitions | undefined,
  shared: GraphSharedEntityValueUsage | undefined,
): DefinitionUsageContext | undefined {
  if (shared === undefined) return undefined;
  const cache = new WeakMap<AbilityEntityDefinition, DefinitionValueUsage>();
  const visiting = new WeakSet<AbilityEntityDefinition>();
  const sharedUsage: DefinitionValueUsage = {
    ...empty(),
    reads: shared.reads,
    unknownAccess: shared.unknownAccess,
  };
  const unresolved = (): DefinitionValueUsage => ({ ...empty(), unknownAccess: true });
  const context: DefinitionUsageContext = {
    inheritedAbilityEntityUsage(step) {
      const id = step.parameters.abilityEntityId;
      const inline = step.parameters.definition as AbilityEntityDefinition | undefined;
      const definition = inline ?? definitions?.[id] ?? shared.commonAbilityEntityDefinitions[id];
      if (definition === undefined || visiting.has(definition)) return unresolved();
      const previous = cache.get(definition);
      if (previous !== undefined) return previous;
      visiting.add(definition);
      try {
        const usages = [sharedUsage];
        const number = (value: AbilityEntityDefinition['maxStackingCount']) => {
          if (typeof value === 'object')
            usages.push(
              actionValueUsage({
                kind: 'blackboard',
                key: value.blackboardKey,
                fallback: value.fallback,
              }),
            );
        };
        if (definition.lifetime.kind === 'limited') number(definition.lifetime.durationSeconds);
        number(definition.maxStackingCount);
        const program = (
          graph: ActionGraphDefinition,
          reference: ActionGraphReference,
        ): DefinitionValueUsage => analyzeGraphSequenceUsage(graph, reference, context);
        definition.childSkill?.scheduledSequences.forEach(item =>
          usages.push(program(definition.childSkill!.actionGraph.main, item.sequence)),
        );
        Object.values(definition.childSkills ?? {}).forEach(child =>
          child.scheduledSequences.forEach(item =>
            usages.push(program(child.actionGraph.main, item.sequence)),
          ),
        );
        for (const passive of definition.passiveSkills ?? []) {
          usages.push(program(passive.actionGraph.main, passive.enableSequence));
          for (const response of passive.abilityEventResponses ?? []) {
            usages.push(program(passive.actionGraph.main, response.sequence));
          }
        }
        const usage = mergeDefinitionValueUsage(usages);
        cache.set(definition, usage);
        return usage;
      } finally {
        visiting.delete(definition);
      }
    },
  };
  return context;
}
