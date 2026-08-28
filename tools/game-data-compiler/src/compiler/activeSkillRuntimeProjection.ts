import type { ScheduledSequenceDefinition } from '../../../../packages/game-data-contract/src/actions.ts';
import type { SkillDefinition } from '../../../../packages/game-data-contract/src/skills.ts';
import { numericDeclaredBlackboard } from '../source/blackboard.ts';
import type { SkillPatchSource } from '../source/skillPatch.ts';
import { parseKnownSkillActionGraphSource } from '../source/skillActionGraph.ts';
import { collectNativeActionNodes } from '../source/controlFlow.ts';
import { compileCombatActionSequenceSource } from './buffRuntimeProjection.ts';
import type {
  CombatActionProjectionContextSource,
  CombatActionProjectionExtensionsSource,
} from './combatProjectionCommon.ts';
import { isStaticSingleEnemyTargetGroup } from './combatProjectionCommon.ts';
import type { CompiledBuffSequenceSource } from './combatActionProjectionTypes.ts';
import {
  prepareSkillDefinitionInputSource,
  assertNoUnprojectedSkillRootEffects,
} from './skillDefinitionInput.ts';
import {
  collectPresentationOnlyTargetGroups,
  isPresentationOnlyActionSequence,
} from './skillPresentationTargets.ts';
import { parseSkillTargetSelectionHeaderSource } from '../source/skillTargetSelection.ts';
import { compileSkillSmartTargetSource } from './comboSmartTarget.ts';
import { assertPresentationCalculationIsolation } from './presentationCalculationIsolation.ts';

/** 正式调度输出子集；原生时间轴结束帧必填，动作仍限于已支持的公共投影。 */
export type CompiledActiveSkillTimelineSequenceSource = Readonly<
  Required<Pick<ScheduledSequenceDefinition, 'startFrame' | 'endFrame'>>
> & {
  readonly sequence: CompiledBuffSequenceSource;
};

/**
 * 主动技能与实体子技能共用的装配结果：黑板是实例初值，不再充当静态求值环境。
 * 原生时长与技能块宽度仍分别保留；技能等级的具体取值由最终消费者选择。
 */
export interface CompiledActiveSkillRuntimeProjectionSource {
  readonly skillId: string;
  readonly durationFrame: number;
  readonly timelineBlockFrames: number;
  readonly blackboard: NonNullable<SkillDefinition['blackboard']>;
  readonly scheduledSequences: readonly CompiledActiveSkillTimelineSequenceSource[];
  readonly smartTarget?: 'enemy' | 'input' | 'trigger';
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
  const targeting = compileSkillSmartTargetSource(
    parseSkillTargetSelectionHeaderSource(input.value, input.sourcePath),
  );
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
            isStaticSingleEnemyTargetGroup(node.body.value.action),
        )
        .map(node =>
          node.body.kind === 'leaf' && node.body.value.family === 'targetGroup'
            ? node.body.value.action.targetGroupKey
            : '',
        ),
    ),
  );
  // StoreSmartTarget writes the selected candidate to this implicit native context group. 对 input/trigger
  // 路径，prepareComboCast 会在施法前严格拒绝非敌方候选；无候选手工排轴则回退唯一木桩。
  // 因而所有已支持的 smartTarget 模式在技能运行入口之后都具有同一 enemy 不变量。
  if (targeting.definition.smartTarget !== undefined)
    staticEnemyTargetGroupKeys.add('smart_target');
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
  const scheduledSequences = graph.actionGroup.timelineActions
    .filter(timeline => !isPresentationOnlyActionSequence(timeline.sequence))
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
    .filter(timeline => timeline.sequence.steps.length > 0);
  assertPresentationCalculationIsolation(
    graph.actionGroup.timelineActions.map(item => item.sequence),
    scheduledSequences.map(item => item.sequence),
  );
  return {
    skillId: graph.skillId,
    durationFrame: graph.durationFrame,
    timelineBlockFrames: Math.min(exclusiveFrame + 1, ...allowNextFrames),
    // combat-spec skill-blackboard：动态声明也进入实例初值；补丁同名键后覆盖。
    // 此处位于动作投影输出边界，不能回灌到上面的静态解析环境消除动态引用。
    blackboard: {
      ...numericDeclaredBlackboard(graph.declaredBlackboard, true),
      ...prepared.blackboard.values,
    },
    ...targeting.definition,
    scheduledSequences,
  };
}
