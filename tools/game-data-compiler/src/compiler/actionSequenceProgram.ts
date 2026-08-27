import type { NativeActionNodeSource, NativeSequenceSource } from '../source/controlFlow.ts';

export interface CompiledActionSequenceProgram<TStep> {
  readonly steps: readonly TStep[];
}

export interface CompiledActionNodeProgram<TStep, TState> {
  readonly steps: readonly TStep[];
  /** 叶子可更新后续兄弟节点使用的编译期上下文，例如已保存的目标组。 */
  readonly state: TState;
}

export interface CompileActionSequenceProgramOptions<TLeaf, TCondition, TStep, TState> {
  readonly initialState: () => TState;
  readonly compileCondition: (
    node: NativeActionNodeSource<TLeaf>,
    state: TState,
  ) => TCondition | null;
  /** 只有已证明无副作用且结果不被消费的尾条件才可删；缺省保留求值。 */
  readonly canOmitTerminalCondition?: (condition: TCondition) => boolean;
  readonly combineConditions: (conditions: readonly TCondition[]) => TCondition;
  readonly negateCondition: (condition: TCondition) => TCondition;
  readonly compileLeaf: (
    node: NativeActionNodeSource<TLeaf>,
    state: TState,
  ) => CompiledActionNodeProgram<TStep, TState>;
  /**
   * 领域可把由多个相邻原生节点共同表达的语义整体降级；返回值必须明确消费至少一个节点。
   * 这用于保存临时值后立刻消费的循环等结构，避免把中间黑板写入伪装成独立运行行为。
   */
  readonly compileNodePrefix?: (
    nodes: readonly NativeActionNodeSource<TLeaf>[],
    state: TState,
  ) => (CompiledActionNodeProgram<TStep, TState> & { readonly consumedNodeCount: number }) | null;
  /** 领域可在语义等价时把原生逐目标循环折叠为集合操作；未提供或拒绝时严格失败。 */
  readonly compileForEach?: (
    node: NativeActionNodeSource<TLeaf> & {
      readonly body: Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'forEach' }>;
    },
    state: TState,
  ) => CompiledActionNodeProgram<TStep, TState> | null;
  /** 领域可在固定目标模型下把有界 Channeling 精确折叠为等价次数的子序列。 */
  readonly compileChanneling?: (
    node: NativeActionNodeSource<TLeaf> & {
      readonly body: Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'channeling' }>;
    },
    state: TState,
  ) => CompiledActionNodeProgram<TStep, TState> | null;
  /** 领域已证明整个条件节点及两分支都不可见时，可整体省略，避免为纯表现控制流伪造输入。 */
  readonly canOmitIfElse?: (
    node: NativeActionNodeSource<TLeaf> & {
      readonly body: Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'ifElse' }>;
    },
  ) => boolean;
  /** 领域证明条件与子动作均不进入其可见模型时，允许省略整个原生动态开关。 */
  readonly canOmitTogglable?: (
    node: NativeActionNodeSource<TLeaf> & {
      readonly body: Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'togglable' }>;
    },
  ) => boolean;
  readonly createConditionalStep: (input: {
    readonly condition: TCondition;
    readonly whenTrue: CompiledActionSequenceProgram<TStep>;
    readonly whenFalse?: CompiledActionSequenceProgram<TStep>;
    readonly alwaysNext: boolean;
  }) => TStep;
  readonly rootFilterError: string;
  readonly unsupportedNodeError: (node: NativeActionNodeSource<TLeaf>) => string;
}

/**
 * 原生 SequenceAction 的公共控制流投影。
 *
 * 条件叶子守卫其后的全部兄弟节点；NotNextCheckAction 只反转紧随其后的条件；IfElse 的两个分支
 * 各自从新的局部编译上下文开始。领域适配器只负责条件和动作叶子的语义。
 */
export function compileActionSequenceProgram<TLeaf, TCondition, TStep, TState>(
  source: NativeSequenceSource<TLeaf>,
  options: CompileActionSequenceProgramOptions<TLeaf, TCondition, TStep, TState>,
): CompiledActionSequenceProgram<TStep> {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error(options.rootFilterError);
  }
  return {
    steps: compileActionNodePrograms(
      source.actions.filter(node => node.metadata.enabled),
      options,
      options.initialState(),
    ),
  };
}

/** 已完成事件专用前缀解析时，从剩余节点继续使用同一公共控制流。 */
export function compileActionNodePrograms<TLeaf, TCondition, TStep, TState>(
  nodes: readonly NativeActionNodeSource<TLeaf>[],
  options: CompileActionSequenceProgramOptions<TLeaf, TCondition, TStep, TState>,
  state: TState,
): TStep[] {
  if (nodes.length === 0) return [];
  const prefix = options.compileNodePrefix?.(nodes, state) ?? null;
  if (prefix !== null) {
    if (prefix.consumedNodeCount <= 0 || prefix.consumedNodeCount > nodes.length) {
      throw new Error('compileNodePrefix returned an invalid consumedNodeCount');
    }
    return [
      ...prefix.steps,
      ...compileActionNodePrograms(nodes.slice(prefix.consumedNodeCount), options, prefix.state),
    ];
  }
  const [first, ...rest] = nodes;
  if (first!.body.kind === 'negateNextResult') {
    const [next, ...bodyNodes] = rest;
    if (next === undefined) throw new Error(`${first!.sourcePath}: dangling NotNextCheckAction`);
    const condition = options.compileCondition(next, state);
    if (condition === null) {
      throw new Error(`${first!.sourcePath}: NotNextCheckAction must precede a condition`);
    }
    const body = compileActionNodePrograms(bodyNodes, options, state);
    return body.length === 0 && options.canOmitTerminalCondition?.(condition) === true
      ? []
      : [
          options.createConditionalStep({
            condition: options.negateCondition(condition),
            whenTrue: { steps: body },
            alwaysNext: false,
          }),
        ];
  }
  const condition = options.compileCondition(first!, state);
  if (condition !== null) {
    const body = compileActionNodePrograms(rest, options, state);
    return body.length === 0 && options.canOmitTerminalCondition?.(condition) === true
      ? []
      : [
          options.createConditionalStep({
            condition,
            whenTrue: { steps: body },
            alwaysNext: false,
          }),
        ];
  }
  if (first!.body.kind === 'ifElse') {
    const branchNode = first as NativeActionNodeSource<TLeaf> & {
      readonly body: Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'ifElse' }>;
    };
    if (options.canOmitIfElse?.(branchNode) === true) {
      return compileActionNodePrograms(rest, options, state);
    }
    if (!first!.body.alwaysNext) {
      throw new Error(`${first!.sourcePath}: stopping IfElse is unsupported`);
    }
    const branchConditions = first!.body.condition.actions
      .filter(node => node.metadata.enabled)
      .map(node => {
        const child = options.compileCondition(node, state);
        if (child === null)
          throw new Error(`${node.sourcePath}: expected a condition-only sequence`);
        return child;
      });
    if (branchConditions.length === 0) {
      throw new Error(`${first!.sourcePath}: empty condition sequence`);
    }
    const whenTrue = compileActionSequenceProgram(first!.body.whenTrue, options);
    const whenFalse = compileActionSequenceProgram(first!.body.whenFalse, options);
    return [
      options.createConditionalStep({
        condition: options.combineConditions(branchConditions),
        whenTrue,
        ...(whenFalse.steps.length === 0 ? {} : { whenFalse }),
        alwaysNext: true,
      }),
      ...compileActionNodePrograms(rest, options, state),
    ];
  }
  if (first!.body.kind === 'forEach' && options.compileForEach !== undefined) {
    const compiled = options.compileForEach(
      first as NativeActionNodeSource<TLeaf> & {
        readonly body: Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'forEach' }>;
      },
      state,
    );
    if (compiled !== null) {
      return [...compiled.steps, ...compileActionNodePrograms(rest, options, compiled.state)];
    }
  }
  if (first!.body.kind === 'channeling' && options.compileChanneling !== undefined) {
    const compiled = options.compileChanneling(
      first as NativeActionNodeSource<TLeaf> & {
        readonly body: Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'channeling' }>;
      },
      state,
    );
    if (compiled !== null) {
      return [...compiled.steps, ...compileActionNodePrograms(rest, options, compiled.state)];
    }
  }
  if (first!.body.kind === 'togglable') {
    const togglable = first as NativeActionNodeSource<TLeaf> & {
      readonly body: Extract<NativeActionNodeSource<TLeaf>['body'], { kind: 'togglable' }>;
    };
    if (options.canOmitTogglable?.(togglable) === true) {
      return compileActionNodePrograms(rest, options, state);
    }
  }
  if (first!.body.kind !== 'leaf') {
    throw new Error(options.unsupportedNodeError(first!));
  }
  const compiled = options.compileLeaf(first!, state);
  return [...compiled.steps, ...compileActionNodePrograms(rest, options, compiled.state)];
}
