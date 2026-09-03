import {
  collectNativeActionNodes,
  type NativeActionNodeSource,
  type NativeSequenceSource,
} from '../source/controlFlow.ts';
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

const PRESENTATION_ONLY_CONDITION_KINDS = new Set([
  'mainOperator',
  'floatCompare',
  'distance',
  'objectTypeMatch',
  'superArmor',
  'skillCameraMotionFree',
  'targetInScreen',
]);

function isPresentationConditionNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
): boolean {
  if (!node.metadata.enabled) return true;
  if (node.body.kind !== 'leaf') return false;
  const leaf = node.body.value;
  return (
    leaf.family === 'presentationCalculation' ||
    (leaf.family === 'condition' && PRESENTATION_ONLY_CONDITION_KINDS.has(leaf.action.kind))
  );
}

function isPresentationActionNode(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  presentationOnlyBlackboardKeys: ReadonlySet<string>,
  allowBlackboardMutation: boolean,
): boolean {
  if (!node.metadata.enabled) return true;
  const body = node.body;
  if (body.kind === 'leaf') {
    if (
      (body.value.family === 'blackboardMutation' ||
        body.value.family === 'blackboardCalculation') &&
      allowBlackboardMutation &&
      presentationOnlyBlackboardKeys.has(body.value.action.key)
    )
      return true;
    if (
      body.value.family === 'spatialMeasurement' &&
      presentationOnlyBlackboardKeys.has(body.value.action.outputKey)
    )
      return true;
    if (body.value.family === 'animationEventListener') {
      return body.value.action.actionOnEvent.actions.every(child =>
        isPresentationActionNode(child, presentationOnlyBlackboardKeys, true),
      );
    }
    return (
      body.value.family === 'presentation' ||
      body.value.family === 'presentationCalculation' ||
      body.value.family === 'spatial'
    );
  }
  if (body.kind === 'forEach') {
    return body.action.actions.every(child =>
      isPresentationActionNode(child, presentationOnlyBlackboardKeys, true),
    );
  }
  if (body.kind !== 'ifElse') return false;
  return (
    body.condition.actions.every(isPresentationConditionNode) &&
    body.whenTrue.actions.every(child =>
      isPresentationActionNode(child, presentationOnlyBlackboardKeys, true),
    ) &&
    body.whenFalse.actions.every(child =>
      isPresentationActionNode(child, presentationOnlyBlackboardKeys, true),
    )
  );
}

/**
 * 只识别“条件和中间黑板值最终仅选择表现动作”的窄控制树。当前白名单故意只覆盖实际镜头样本的
 * mainOperator/floatCompare/distance/objectTypeMatch/superArmor；它们在此只选择纯表现子树，
 * 不会被求值或写入模拟状态。带写回副作用的战斗条件、循环和时间动作一律不能省略。
 */
export function isPresentationOnlyActionSequence(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
  presentationOnlyBlackboardKeys: ReadonlySet<string> = new Set(),
): boolean {
  return sequence.actions.every(node =>
    isPresentationActionNode(node, presentationOnlyBlackboardKeys, false),
  );
}

/**
 * Typhoeus 浮游攻击用候选敌人位置决定自动转向镜头。子图虽然包含 Find/Pick、计数、
 * ForEach 与临时黑板运算，但最终只到 CameraRotate/DebugPrint；没有伤害、Buff、资源、
 * 实体或时间步骤。严格限制其专用 Context/黑板键，避免把普通目标选择误删。
 */
export function isTyphoeaCameraSteeringSequence(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
): boolean {
  const targetKeys = new Set(['all_tar', 'tar_front', 'tar_surrund', 'tar_turn']);
  const valueKeys = new Set([
    'enemy_forward_num',
    'enemy_turn_distance',
    'camera_rotate_angle',
    'is_enemy_rightside',
    'turn_angle_ratio',
  ]);
  const nodes = collectNativeActionNodes(sequence).filter(node => node.metadata.enabled);
  const hasCameraOutput = nodes.some(
    node =>
      node.body.kind === 'leaf' &&
      node.body.value.family === 'presentation' &&
      node.body.value.action.kind === 'cameraRotate',
  );
  const hasSteeringAngle = nodes.some(
    node =>
      node.body.kind === 'leaf' &&
      node.body.value.family === 'presentationCalculation' &&
      node.body.value.action.kind === 'saveTwoDirectionAngle' &&
      node.body.value.action.outputKey === 'enemy_turn_distance',
  );
  const hasCameraValueAdjustment = nodes.some(
    node =>
      node.body.kind === 'leaf' &&
      node.body.value.family === 'blackboardCalculation' &&
      node.body.value.action.key === 'camera_rotate_angle',
  );
  if (!hasCameraOutput || (!hasSteeringAngle && !hasCameraValueAdjustment)) return false;
  return nodes.every(node => {
    const body = node.body;
    if (body.kind === 'ifElse' || body.kind === 'forEach') return true;
    if (body.kind !== 'leaf') return false;
    const leaf = body.value;
    if (
      leaf.family === 'presentation' ||
      leaf.family === 'presentationCalculation' ||
      leaf.family === 'spatialMeasurement'
    )
      return true;
    if (leaf.family === 'condition')
      return ['mainOperator', 'entityCount', 'floatCompare'].includes(leaf.action.kind);
    if (leaf.family === 'targetGroup') {
      return (
        targetKeys.has(leaf.action.targetGroupKey) &&
        (leaf.action.producerType === 'FindTargetAction' ||
          leaf.action.producerType === 'PickTargetAction')
      );
    }
    if (leaf.family === 'blackboardMutation' || leaf.family === 'blackboardCalculation')
      return valueKeys.has(leaf.action.key);
    return false;
  });
}

/**
 * 只把“写入和所有跨时间线消费者均属于纯表现控制树”的动作黑板键判为可删除。
 * 从全部写入键开始反复收缩；一个候选依赖后来被判为战斗键时，依赖它的整棵树也会在下一轮退出。
 */
export function collectPresentationOnlyBlackboardKeys(
  graph: SkillActionGraphSource<KnownNativeActionLeafSource>,
): ReadonlySet<string> {
  const timelines = graph.actionGroup.timelineActions.map(item => item.sequence);
  const candidates = new Set(
    timelines.flatMap(sequence =>
      collectNativeActionNodes(sequence).flatMap(node => {
        if (node.body.kind !== 'leaf') return [];
        const leaf = node.body.value;
        if (leaf.family === 'blackboardMutation' || leaf.family === 'blackboardCalculation')
          return [leaf.action.key];
        if (leaf.family === 'spatialMeasurement') return [leaf.action.outputKey];
        if (leaf.family !== 'presentationCalculation') return [];
        return leaf.action.kind === 'saveCameraAngle'
          ? [...leaf.action.outputKeys]
          : [leaf.action.outputKey];
      }),
    ),
  );
  let changed: boolean;
  do {
    changed = false;
    for (const key of candidates) {
      const encodedKey = JSON.stringify(key);
      const consumers = timelines.filter(sequence => JSON.stringify(sequence).includes(encodedKey));
      if (
        consumers.length === 0 ||
        consumers.some(sequence => !isPresentationOnlyActionSequence(sequence, candidates))
      ) {
        candidates.delete(key);
        changed = true;
      }
    }
  } while (changed);
  return candidates;
}

/**
 * 只接受 RandomAction 写入、且所有已投影读取都来自 PointFinder 坐标槽位的键。
 * 没有已投影读取的随机值同样不可影响战斗：严格来源 parser 已把所有数值/条件/Buff 输入保留，
 * 剩余引用只可能位于被明确裁掉的表现字段或本来就未使用。Next 的概率样本流只承载战斗概率条件，
 * 不复刻表现随机数对 Unity 随机流的推进。任一战斗或未知消费者都会使候选退出。
 */
export function collectCombatInvisibleRandomBlackboardKeys(
  graph: SkillActionGraphSource<KnownNativeActionLeafSource>,
): ReadonlySet<string> {
  // collectNativeActionNodes 同时返回控制流容器与其后代；容器的 body 会再次内嵌所有叶子。
  // 数据流消费者只存在于叶动作上，因此必须先去掉容器，避免同一黑板引用被重复计为未知读取。
  const nodes = graph.actionGroup.timelineActions
    .flatMap(timeline => collectNativeActionNodes(timeline.sequence))
    .filter(node => node.body.kind === 'leaf');
  const randomKeys = new Set(
    nodes.flatMap(node =>
      node.body.kind === 'leaf' && node.body.value.family === 'randomBlackboard'
        ? [node.body.value.action.targetKey]
        : [],
    ),
  );
  const candidates = new Set([
    ...randomKeys,
    ...nodes.flatMap(node =>
      node.body.kind === 'leaf' && node.body.value.family === 'blackboardCalculation'
        ? [node.body.value.action.key]
        : [],
    ),
  ]);
  let changed: boolean;
  do {
    changed = false;
    for (const key of candidates) {
      const safe = nodes.every(node => {
        const occurrences = countExactString(node.body, key);
        if (occurrences === 0) return true;
        if (
          node.body.kind === 'leaf' &&
          node.body.value.family === 'randomBlackboard' &&
          node.body.value.action.targetKey === key
        ) {
          return occurrences === 1;
        }
        if (
          node.body.kind === 'leaf' &&
          node.body.value.family === 'blackboardCalculation' &&
          candidates.has(node.body.value.action.key)
        ) {
          return true;
        }
        if (node.body.kind === 'leaf' && node.body.value.family === 'targetGroup') {
          const action = node.body.value.action;
          const pointOccurrences =
            action.finderType === 'PointFinder'
              ? (action.finderPointBlackboardKeys ?? []).filter(value => value === key).length
              : 0;
          if (pointOccurrences > 0 && pointOccurrences === occurrences) return true;
        }
        if (node.body.kind === 'leaf' && node.body.value.family === 'projectile') {
          const launchAssignmentOccurrences = node.body.value.action.assignments.filter(
            assignment => assignment.inputValueKey === key,
          ).length;
          // 标准模型把投射物移动压缩为共点目标上的同步首次命中；只流入实体初始化赋值的
          // 随机数因此不会改变命中、回调或伤害。其它任何同节点读取仍会让候选退出。
          if (launchAssignmentOccurrences > 0 && launchAssignmentOccurrences === occurrences) {
            return true;
          }
        }
        return false;
      });
      if (!safe) {
        candidates.delete(key);
        changed = true;
      }
    }
  } while (changed);
  return new Set([...randomKeys].filter(key => candidates.has(key)));
}

function countExactString(value: unknown, expected: string): number {
  if (value === expected) return 1;
  if (Array.isArray(value))
    return value.reduce((count, child) => count + countExactString(child, expected), 0);
  if (value === null || typeof value !== 'object') return 0;
  return Object.values(value).reduce(
    (count, child) => count + countExactString(child, expected),
    0,
  );
}

function collectNodesIncludingEventResponses(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
): readonly NativeActionNodeSource<KnownNativeActionLeafSource>[] {
  const nodes = collectNativeActionNodes(sequence);
  return [
    ...nodes,
    ...nodes.flatMap(node =>
      node.body.kind === 'leaf' && node.body.value.family === 'eventListener'
        ? node.body.value.action.events.flatMap(event =>
            event.actions.flatMap(collectNodesIncludingEventResponses),
          )
        : [],
    ),
  ];
}

/**
 * 在完整 SkillData 范围验证目标查询仅服务于表现，不局限于单个调度序列。
 * 只允许无过滤的来源/固定点查询；任一战斗消费者都会保留查询并交给严格投影报错。
 */
export function collectPresentationOnlyTargetGroups(
  graph: SkillActionGraphSource<KnownNativeActionLeafSource>,
): ReadonlySet<string> {
  const nodes = graph.actionGroup.timelineActions.flatMap(timeline =>
    collectNodesIncludingEventResponses(timeline.sequence),
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

  // SnapPointFinder 可能只为 MoveTo 等空间表现生成位置。按叶级引用证明，避免同一时间线
  // 还包含伤害/资源动作时被粗粒度 mixedSequence 误伤；任何非空间叶或 ForEach 读取都会拒绝。
  const leafNodesForSpatialPoints = nodes.filter(node => node.body.kind === 'leaf');
  const forEachTargetReads = new Set(
    nodes.flatMap(node =>
      node.body.kind === 'forEach' && node.body.target.targetSource === 'Context'
        ? [node.body.target.targetGroupKey]
        : [],
    ),
  );
  const spatialPointCandidates = new Set(
    leafNodesForSpatialPoints.flatMap(node => {
      if (node.body.kind !== 'leaf' || node.body.value.family !== 'targetGroup') return [];
      const action = node.body.value.action;
      return action.producerType === 'FindTargetAction' &&
        action.finderType === 'SnapPointFinder' &&
        action.validatorTypes.length === 0 &&
        action.postProcessorTypes.length === 0
        ? [action.targetGroupKey]
        : [];
    }),
  );
  for (const key of spatialPointCandidates) {
    if (forEachTargetReads.has(key)) continue;
    const safe = leafNodesForSpatialPoints.every(node => {
      if (node.body.kind !== 'leaf') return true;
      const occurrences = countExactString(node.body.value, key);
      if (occurrences === 0) return true;
      if (node.body.value.family === 'targetGroup' && node.body.value.action.targetGroupKey === key)
        return occurrences === 1;
      return node.body.value.family === 'spatial' || node.body.value.family === 'stumpControl';
    });
    if (safe) candidates.add(key);
  }

  // PickTarget 有时只为随后 EffectAction 选择一个挂点实体。先证明输出组的所有叶消费者均为表现，
  // 再反向证明输入组只被这些 PickTarget 消费；这样可整条裁掉带 Shuffle/距离筛选的表现身份链，
  // 而不会把随机顺序冒充成稳定的战斗顺序。
  // EventListener 叶的 action 内嵌响应树；响应节点已经在上方递归展开，容器本身不能再作为
  // 对其中 Context 键的一次独立消费者，否则所有事件内数据流都会被重复判为未知读取。
  const leafNodes = nodes.filter(
    node => node.body.kind === 'leaf' && node.body.value.family !== 'eventListener',
  );
  const controlTargetReads = new Set(
    nodes.flatMap(node =>
      node.body.kind === 'forEach' && node.body.target.targetSource === 'Context'
        ? [node.body.target.targetGroupKey]
        : [],
    ),
  );
  const presentationPickOutputs = new Set<string>();
  for (const node of leafNodes) {
    if (
      node.body.kind !== 'leaf' ||
      node.body.value.family !== 'targetGroup' ||
      node.body.value.action.producerType !== 'PickTargetAction'
    )
      continue;
    const outputKey = node.body.value.action.targetGroupKey;
    if (controlTargetReads.has(outputKey)) continue;
    const consumersArePresentation = leafNodes.every(candidate => {
      if (candidate === node || candidate.body.kind !== 'leaf') return true;
      if (!JSON.stringify(candidate.body.value).includes(JSON.stringify(outputKey))) return true;
      return (
        candidate.body.value.family === 'presentation' ||
        (candidate.body.value.family === 'targetGroup' &&
          candidate.body.value.action.producerType === 'PickTargetAction' &&
          candidate.body.value.action.targetGroupKey === outputKey)
      );
    });
    if (consumersArePresentation) presentationPickOutputs.add(outputKey);
  }
  const presentationPickInputs = new Set<string>();
  for (const node of leafNodes) {
    if (
      node.body.kind !== 'leaf' ||
      node.body.value.family !== 'targetGroup' ||
      node.body.value.action.producerType !== 'PickTargetAction' ||
      !presentationPickOutputs.has(node.body.value.action.targetGroupKey)
    )
      continue;
    for (const input of node.body.value.action.inputTargets) {
      if (input.targetSource === 'Context' && input.targetGroupKey !== '') {
        presentationPickInputs.add(input.targetGroupKey);
      }
    }
  }
  for (const inputKey of [...presentationPickInputs]) {
    if (controlTargetReads.has(inputKey)) {
      presentationPickInputs.delete(inputKey);
      continue;
    }
    const consumersStayInPresentationChain = leafNodes.every(node => {
      if (node.body.kind !== 'leaf') return true;
      if (!JSON.stringify(node.body.value).includes(JSON.stringify(inputKey))) return true;
      if (
        node.body.value.family === 'targetGroup' &&
        node.body.value.action.targetGroupKey === inputKey
      )
        return true;
      return (
        node.body.value.family === 'targetGroup' &&
        node.body.value.action.producerType === 'PickTargetAction' &&
        presentationPickOutputs.has(node.body.value.action.targetGroupKey)
      );
    });
    if (!consumersStayInPresentationChain) presentationPickInputs.delete(inputKey);
  }

  // ConvertToTargetContext(None) 也常只把受击来源转存给转向、移动和相机。它与查找器不同，
  // 不能按来源类型猜实体；从全部候选开始反复剔除任何进入战斗叶或控制迭代的键，只保留完整的
  // 纯表现 Context 链。这样外部受击仍能触发后续 jumpTimeline，而无需伪造攻击者空间。
  const presentationConvertedContexts = new Set(
    leafNodes.flatMap(node =>
      node.body.kind === 'leaf' &&
      node.body.value.family === 'targetGroup' &&
      node.body.value.action.producerType === 'ConvertToTargetContext' &&
      node.body.value.action.conversionOperation === 'None'
        ? [node.body.value.action.targetGroupKey]
        : [],
    ),
  );
  let convertedContextsChanged: boolean;
  do {
    convertedContextsChanged = false;
    for (const key of presentationConvertedContexts) {
      if (controlTargetReads.has(key)) {
        presentationConvertedContexts.delete(key);
        convertedContextsChanged = true;
        continue;
      }
      const safe = leafNodes.every(node => {
        if (node.body.kind !== 'leaf') return true;
        const leaf = node.body.value;
        const occurrences = countExactString(leaf, key);
        if (occurrences === 0) return true;
        if (leaf.family === 'targetGroup') {
          if (leaf.action.targetGroupKey === key && occurrences === 1) return true;
          return presentationConvertedContexts.has(leaf.action.targetGroupKey);
        }
        if (['presentation', 'spatial', 'stumpControl'].includes(leaf.family)) return true;
        return (
          leaf.family === 'condition' &&
          (leaf.action.kind === 'targetAngle' ||
            (leaf.action.kind === 'distance' &&
              !leaf.action.lessThan &&
              leaf.action.distance >= 0 &&
              !leaf.action.includeTargetRadius &&
              !leaf.action.containsHittableObject))
        );
      });
      if (!safe) {
        presentationConvertedContexts.delete(key);
        convertedContextsChanged = true;
      }
    }
  } while (convertedContextsChanged);

  return new Set([
    ...candidates,
    ...presentationPickOutputs,
    ...presentationPickInputs,
    ...presentationConvertedContexts,
  ]);
}

/**
 * 收集只被写入、从未被任何后续动作或控制流读取的 Context 组。
 * 这项事实本身不允许省略查询；调用方还必须证明 FindTargetAction 的 owner/center 可解析，
 * 从而保留原生“空结果也覆盖组并返回 true”的短路语义。
 */
export function collectUnconsumedTargetGroups(
  graph: SkillActionGraphSource<KnownNativeActionLeafSource>,
): ReadonlySet<string> {
  const nodes = graph.actionGroup.timelineActions.flatMap(timeline =>
    collectNativeActionNodes(timeline.sequence),
  );
  const keys = new Set(
    nodes.flatMap(node =>
      node.body.kind !== 'leaf'
        ? []
        : node.body.value.family === 'targetGroup'
          ? [node.body.value.action.targetGroupKey]
          : node.body.value.family === 'physicsCast'
            ? node.body.value.action.outputTargetGroupKeys
            : [],
    ),
  );
  for (const key of keys) {
    const onlyProducerWrites = nodes.every(node => {
      const occurrences = countExactString(node.body, key);
      if (occurrences === 0) return true;
      if (node.body.kind !== 'leaf') return false;
      if (
        node.body.value.family === 'physicsCast' &&
        node.body.value.action.outputTargetGroupKeys.includes(key)
      )
        return true;
      return (
        node.body.value.family === 'targetGroup' &&
        node.body.value.action.targetGroupKey === key &&
        occurrences === 1
      );
    });
    if (!onlyProducerWrites) keys.delete(key);
  }
  // PhysicsCast 的结果在动作执行时覆盖同名 Context；此前时间线对旧值的读取不属于消费者。
  // 这里补上严格的顺序判断，只要该次写入之后再无读取，就把其局部命中/回退点视为未消费。
  nodes.forEach((node, producerIndex) => {
    if (node.body.kind !== 'leaf' || node.body.value.family !== 'physicsCast') return;
    for (const key of node.body.value.action.outputTargetGroupKeys) {
      const hasLaterConsumer = nodes.slice(producerIndex + 1).some(candidate => {
        const occurrences = countExactString(candidate.body, key);
        if (occurrences === 0) return false;
        if (candidate.body.kind !== 'leaf') return true;
        if (
          candidate.body.value.family === 'targetGroup' &&
          candidate.body.value.action.targetGroupKey === key &&
          occurrences === 1
        )
          return false;
        if (
          candidate.body.value.family === 'physicsCast' &&
          candidate.body.value.action.outputTargetGroupKeys.includes(key)
        )
          return false;
        return true;
      });
      if (!hasLaterConsumer) keys.add(key);
    }
  });
  return keys;
}
