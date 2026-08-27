import type { SkillPatchSource } from '../source/skillPatch.ts';
import { parseKnownSkillActionGraphSource } from '../source/skillActionGraph.ts';
import { collectNativeActionNodes } from '../source/controlFlow.ts';
import {
  compileCombatActionSequenceSource,
  type CombatActionProjectionContextSource,
  type CombatActionProjectionExtensionsSource,
  type CompiledBuffSequenceSource,
} from './buffRuntimeProjection.ts';
import {
  prepareSkillDefinitionInputSource,
  assertNoUnprojectedSkillRootEffects,
} from './skillDefinitionInput.ts';
import type { ResolvedSkillBlackboardSource } from './skillBlackboard.ts';
import { collectPresentationOnlyTargetGroups } from './skillPresentationTargets.ts';

export interface CompiledActiveSkillTimelineSequenceSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly sequence: CompiledBuffSequenceSource;
}

/** 可由正式 SkillDefinition 渲染器消费的主动技能时间轴战斗投影。 */
export interface CompiledActiveSkillRuntimeProjectionSource {
  readonly skillId: string;
  readonly durationFrame: number;
  readonly timelineBlockFrames: number;
  readonly blackboard: ResolvedSkillBlackboardSource;
  readonly scheduledSequences: readonly CompiledActiveSkillTimelineSequenceSource[];
}

/**
 * 主动 SkillData 的严格执行阶段。引用闭包阶段允许保留未跟踪动作；进入正式时间轴时必须让
 * 每个叶子通过公共 parser/projection，且不得把被动事件静默混入施法时间轴。
 */
export function compileActiveSkillRuntimeProjectionSource(input: {
  readonly value: unknown;
  readonly sourcePath: string;
  readonly patch: SkillPatchSource | null;
  readonly context: CombatActionProjectionContextSource;
  readonly visualOnlyIds?: ReadonlySet<string>;
  readonly extensions?: CombatActionProjectionExtensionsSource;
}): CompiledActiveSkillRuntimeProjectionSource {
  const prepared = prepareSkillDefinitionInputSource(input.value, input.sourcePath, input.patch);
  assertNoUnprojectedSkillRootEffects(input.value, input.sourcePath);
  const graph = parseKnownSkillActionGraphSource(
    input.value,
    input.sourcePath,
    prepared.blackboard.values,
  );
  if (graph.actionGroup.passiveEvents.length > 0)
    throw new Error(
      `${input.sourcePath}.actionGroupData.passiveEventActions: active skill passive events are unsupported`,
    );
  const visualOnlyIds = input.visualOnlyIds ?? new Set<string>();
  const extensions = input.extensions ?? {};
  const staticEnemyTargetGroupKeys = new Set(
    graph.actionGroup.timelineActions.flatMap(timeline =>
      collectNativeActionNodes(timeline.sequence)
        .filter(
          node =>
            node.body.kind === 'leaf' &&
            node.body.value.family === 'targetGroup' &&
            (node.body.value.action.producerType === 'FindTargetAction' ||
              node.body.value.action.producerType === 'ContinuousFindTargetAction') &&
            node.body.value.action.validatorTypes.length === 0 &&
            node.body.value.action.postProcessorTypes.length === 0 &&
            (node.body.value.action.finderType === 'MainTargetFinder' ||
              (node.body.value.action.finderType === 'HitBoxFinder' &&
                node.body.value.action.finderFactionTarget === 'Anti' &&
                node.body.value.action.finderTargetObjectType === 'Normal' &&
                node.body.value.action.finderCheckAlive === true)),
        )
        .map(node =>
          node.body.kind === 'leaf' && node.body.value.family === 'targetGroup'
            ? node.body.value.action.targetGroupKey
            : '',
        ),
    ),
  );
  const exclusiveFrame = Number(prepared.root.exclusiveFrame);
  if (!Number.isInteger(exclusiveFrame) || exclusiveFrame < 0)
    throw new Error(`${input.sourcePath}.exclusiveFrame: expected non-negative integer`);
  const allowNextFrames = graph.actionGroup.timelineActions
    .filter(timeline =>
      collectNativeActionNodes(timeline.sequence).some(
        node =>
          node.body.kind === 'leaf' &&
          node.body.value.family === 'inputControl' &&
          node.body.value.action.kind === 'allowNextSkill',
      ),
    )
    .map(timeline => timeline.startFrame);
  const context = {
    ...input.context,
    staticEnemyTargetGroupKeys,
    presentationOnlyTargetGroupKeys: collectPresentationOnlyTargetGroups(graph),
  };
  return {
    skillId: graph.skillId,
    durationFrame: graph.durationFrame,
    timelineBlockFrames: Math.min(exclusiveFrame + 1, ...allowNextFrames),
    blackboard: prepared.blackboard,
    scheduledSequences: graph.actionGroup.timelineActions
      .map(timeline => ({
        startFrame: timeline.startFrame,
        endFrame: timeline.endFrame,
        sequence: compileCombatActionSequenceSource(
          timeline.sequence,
          {
            ...context,
            timelineRange: { startFrame: timeline.startFrame, endFrame: timeline.endFrame },
          },
          visualOnlyIds,
          extensions,
        ),
      }))
      .filter(timeline => timeline.sequence.steps.length > 0),
  };
}
