import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { NativeSequenceSource } from '../source/controlFlow.ts';

type TargetGroupAction = Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>['action'];

export interface GuaranteedSingletonZeroSpaceAnalysisOptions {
  readonly atMostOneZeroSpaceKeys: ReadonlySet<string>;
  readonly compareKnownNumbers: (
    left: number,
    comparison: string,
    right: number,
  ) => boolean | undefined;
  readonly writeProducesSingleton: (
    write: TargetGroupAction,
    state: ReadonlySet<string>,
  ) => boolean;
}

function intersectFacts(states: readonly ReadonlySet<string>[]): Set<string> {
  const [first, ...rest] = states;
  if (first === undefined) return new Set();
  return new Set([...first].filter(key => rest.every(state => state.has(key))));
}

/** 条件为真时，证明“至多一个成员”的 Context 此刻恰有一个成员。 */
function guaranteedSingletonKey(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
  options: GuaranteedSingletonZeroSpaceAnalysisOptions,
): string | null {
  const nodes = sequence.actions.filter(node => node.metadata.enabled);
  const node = nodes[0];
  if (nodes.length !== 1 || node?.body.kind !== 'leaf' || node.body.value.family !== 'condition') {
    return null;
  }
  const condition = node.body.value.action;
  if (
    condition.kind !== 'entityCount' ||
    condition.targetSource !== 'Context' ||
    !options.atMostOneZeroSpaceKeys.has(condition.targetGroupKey) ||
    condition.containsHittableTarget ||
    condition.excludeDeadEntity ||
    condition.storeKey !== '' ||
    options.compareKnownNumbers(1, condition.comparison, condition.minimumCount) !== true ||
    options.compareKnownNumbers(0, condition.comparison, condition.minimumCount) !== false
  ) {
    return null;
  }
  return condition.targetGroupKey;
}

/**
 * 顺着原生控制流传播“当前必有一个零空间目标”的事实。分支从入口事实分别执行，
 * 汇合时只保留两侧共同成立的键；可能零次执行的容器也与入口取交集。
 */
export function propagateGuaranteedSingletonZeroSpaceFacts(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
  initial: ReadonlySet<string>,
  options: GuaranteedSingletonZeroSpaceAnalysisOptions,
): Set<string> {
  let state = new Set(initial);
  for (const node of sequence.actions.filter(node => node.metadata.enabled)) {
    const body = node.body;
    if (body.kind === 'leaf') {
      if (body.value.family !== 'targetGroup') continue;
      const write = body.value.action;
      if (options.writeProducesSingleton(write, state)) state.add(write.targetGroupKey);
      else state.delete(write.targetGroupKey);
      continue;
    }
    if (body.kind === 'ifElse') {
      const conditionState = propagateGuaranteedSingletonZeroSpaceFacts(
        body.condition,
        state,
        options,
      );
      const trueEntry = new Set(conditionState);
      const guardedKey = guaranteedSingletonKey(body.condition, options);
      if (guardedKey !== null) trueEntry.add(guardedKey);
      const whenTrue = propagateGuaranteedSingletonZeroSpaceFacts(
        body.whenTrue,
        trueEntry,
        options,
      );
      const whenFalse = propagateGuaranteedSingletonZeroSpaceFacts(
        body.whenFalse,
        conditionState,
        options,
      );
      state = intersectFacts([whenTrue, whenFalse]);
      continue;
    }
    if (body.kind === 'physicsCast') {
      state = intersectFacts([
        propagateGuaranteedSingletonZeroSpaceFacts(body.whenHit, state, options),
        propagateGuaranteedSingletonZeroSpaceFacts(body.whenMiss, state, options),
      ]);
      continue;
    }
    const maybeExecuted: NativeSequenceSource<KnownNativeActionLeafSource>[] = [];
    if (body.kind === 'once' || body.kind === 'forEach') maybeExecuted.push(body.action);
    else if (body.kind === 'channeling') maybeExecuted.push(body.actionOnTick);
    else if (body.kind === 'tickInterval' || body.kind === 'tickIntervalV2')
      maybeExecuted.push(body.actionOnTick);
    else if (body.kind === 'togglable') maybeExecuted.push(body.condition, body.action);
    else if (body.kind === 'switch')
      maybeExecuted.push(...body.options.map(option => option.action));
    // callback 与 timelineJump 不会在当前顺序位置同步建立供后续兄弟读取的事实。
    if (maybeExecuted.length > 0) {
      state = intersectFacts([
        state,
        ...maybeExecuted.map(child =>
          propagateGuaranteedSingletonZeroSpaceFacts(child, state, options),
        ),
      ]);
    }
  }
  return state;
}
