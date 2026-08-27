/**
 * 算出一个技能块上的命中点画在哪、对应哪个命中。
 *
 * 本模块只从定义收集稳定身份与无运行结果时的局部回退偏移；实际位置由页面消费
 * `DamageApplied(castId, hitId)` 回执。条件分支里的命中点会标记出来，由页面决定怎么显示。
 * 命中点来自调用方提供的 SkillDefinition（目录或自定义），投影层不再从存档快照读取。
 */
import type {
  OperatorAbilityEntityDefinitions,
  OperatorBuffDefinitions,
  SkillBuffDefinition,
  SkillDefinition,
  CombatStepDefinition,
} from '../../core/game-data/operatorDefinition';
import type { SkillCastDocument } from '../../core/project/schema';
import { deriveHitId } from '../../core/combat/timeline/deriveHitId';

/** 一个可渲染的命中点。 */
export interface TimelineHitMarker {
  readonly stepKey: string;
  readonly hitId: string;
  /** 相对技能块左边缘的帧偏移。 */
  readonly frameOffset: number;
  /** 在条件分支里，跑不跑取决于当时的条件。 */
  readonly conditional: boolean;
}

/** 页面算好像素位置后交给组件画出来的命中点。 */
export interface TimelineHitMarkerView {
  readonly stepKey: string;
  readonly hitId: string;
  /** 相对技能块左边缘的像素偏移。 */
  readonly leftPx: number;
  readonly title?: string;
  /** 该命中是否被编辑器强制设为暴击；仅用于复刻旧版命中点反馈。 */
  readonly forcedCritical?: boolean;
}

/**
 * 尚无模拟结果时只展示定义中无条件的命中预览；一旦有模拟快照，命中事实必须来自
 * `DamageApplied(castId, hitId)`。这样时间轴跳转或提前结束后不可达的根调度命中不会
 * 再退回原生定义帧，伪装成一次延迟命中。
 */
export function shouldDisplayTimelineHitMarker(
  marker: TimelineHitMarker,
  hasSimulationRun: boolean,
  actualFrames: ReadonlyMap<string, number>,
): boolean {
  return hasSimulationRun ? actualFrames.has(marker.hitId) : !marker.conditional;
}

/**
 * 命中可以由能力实体等延迟到主技能块结束之后，不能被技能块宽度截断。
 * 负偏移没有可展示的实际意义，仍收敛到技能起点。
 */
export function projectTimelineHitMarkerLeftPx(leftPx: number): number {
  return Math.max(0, leftPx);
}

function collectDamageSteps(
  step: CombatStepDefinition,
  conditional: boolean,
  markers: TimelineHitMarker[],
  cast: SkillCastDocument,
  frameOffset: number,
  abilityEntityDefinitions?: OperatorAbilityEntityDefinitions,
  buffDefinitions?: OperatorBuffDefinitions,
  visitedBuffIds: Set<string> = new Set(),
): void {
  if (step.kind === 'dealDamage' || step.kind === 'dealFixedDamage') {
    if (step.key === undefined || step.key.length === 0) {
      throw new Error(
        `damage step '${step.kind}' in cast '${cast.id}' is missing a stable key for projection`,
      );
    }
    markers.push({
      stepKey: step.key,
      hitId: deriveHitId(cast.id, step.key),
      frameOffset,
      conditional,
    });
    return;
  }
  if (step.kind === 'conditional') {
    // 条件分支里的步骤跑不跑取决于当时条件，一律标记为 conditional。
    for (const nested of step.whenTrue.steps)
      collectDamageSteps(
        nested,
        true,
        markers,
        cast,
        frameOffset,
        abilityEntityDefinitions,
        buffDefinitions,
        visitedBuffIds,
      );
    for (const nested of step.whenFalse?.steps ?? []) {
      collectDamageSteps(
        nested,
        true,
        markers,
        cast,
        frameOffset,
        abilityEntityDefinitions,
        buffDefinitions,
        visitedBuffIds,
      );
    }
    return;
  }
  if (step.kind === 'once' || step.kind === 'withActionBlackboardScope') {
    for (const nested of step.body.steps)
      collectDamageSteps(
        nested,
        conditional,
        markers,
        cast,
        frameOffset,
        abilityEntityDefinitions,
        buffDefinitions,
        visitedBuffIds,
      );
    return;
  }
  if (step.kind === 'repeatEachTick' || step.kind === 'forEachContextTarget') {
    for (const nested of step.body.steps)
      collectDamageSteps(
        nested,
        conditional,
        markers,
        cast,
        frameOffset,
        abilityEntityDefinitions,
        buffDefinitions,
        visitedBuffIds,
      );
    return;
  }
  if (step.kind === 'listenForCombatEvents') {
    for (const response of step.parameters.responses) {
      for (const nested of response.sequence.steps) {
        collectDamageSteps(
          nested,
          true,
          markers,
          cast,
          frameOffset,
          abilityEntityDefinitions,
          buffDefinitions,
          visitedBuffIds,
        );
      }
    }
    return;
  }
  if (step.kind === 'applyBuff') {
    const buffId = step.parameters.buffId;
    // 静态命中预览没有运行时黑板，不能猜测动态 ID 对应的伤害；实际命中由模拟结果提供。
    if (typeof buffId !== 'string') return;
    const definition = step.parameters.definition ?? buffDefinitions?.[buffId];
    if (definition !== undefined && !visitedBuffIds.has(buffId)) {
      visitedBuffIds.add(buffId);
      collectBuffDamageSteps(
        definition,
        markers,
        cast,
        frameOffset,
        abilityEntityDefinitions,
        buffDefinitions,
        visitedBuffIds,
      );
    }
    return;
  }
  const childSkill =
    step.kind === 'spawnAbilityEntity'
      ? (step.parameters.definition ?? abilityEntityDefinitions?.[step.parameters.abilityEntityId])
          ?.childSkill
      : step.kind === 'startCurrentAbilityEntityChildSkill'
        ? step.parameters.childSkill
        : undefined;
  if (childSkill !== undefined) {
    for (const scheduled of childSkill.scheduledSequences) {
      for (const nested of scheduled.sequence.steps) {
        collectDamageSteps(
          nested,
          conditional,
          markers,
          cast,
          frameOffset + scheduled.startFrame,
          abilityEntityDefinitions,
          buffDefinitions,
          visitedBuffIds,
        );
      }
    }
  }
}

/** Buff 后代伤害仍归创建它的技能释放；无模拟时一律作为条件候选，不伪造必定命中。 */
function collectBuffDamageSteps(
  definition: SkillBuffDefinition,
  markers: TimelineHitMarker[],
  cast: SkillCastDocument,
  frameOffset: number,
  abilityEntityDefinitions: OperatorAbilityEntityDefinitions | undefined,
  buffDefinitions: OperatorBuffDefinitions | undefined,
  visitedBuffIds: Set<string>,
): void {
  const collectSequence = (
    sequence: { readonly steps: readonly CombatStepDefinition[] },
    offset = frameOffset,
  ): void => {
    for (const nested of sequence.steps) {
      collectDamageSteps(
        nested,
        true,
        markers,
        cast,
        offset,
        abilityEntityDefinitions,
        buffDefinitions,
        visitedBuffIds,
      );
    }
  };
  for (const scheduled of definition.scheduledSequences ?? []) {
    collectSequence(scheduled.sequence, frameOffset + scheduled.startFrame);
  }
  for (const sequence of Object.values(definition.lifecycleSequences ?? {})) {
    if (sequence !== undefined) collectSequence(sequence);
  }
  for (const response of definition.abilityEventResponses ?? []) collectSequence(response.sequence);
  for (const response of definition.igniteEventResponses ?? []) collectSequence(response.sequence);
}

/**
 * 收集一次技能释放的全部命中点，按序列声明顺序返回。
 * 调用方传入本次使用的技能定义；伤害步骤缺少 key 时直接报错。
 */
export function projectCastHitMarkers(
  cast: SkillCastDocument,
  definition: SkillDefinition,
  abilityEntityDefinitions?: OperatorAbilityEntityDefinitions,
  buffDefinitions?: OperatorBuffDefinitions,
): readonly TimelineHitMarker[] {
  const markers: TimelineHitMarker[] = [];
  const visitedBuffIds = new Set<string>();
  for (const scheduled of definition.scheduledSequences) {
    for (const step of scheduled.sequence.steps) {
      collectDamageSteps(
        step,
        false,
        markers,
        cast,
        scheduled.startFrame,
        abilityEntityDefinitions,
        buffDefinitions,
        visitedBuffIds,
      );
    }
  }
  return markers;
}

/**
 * 收集同一运行时技能槽可能执行的全部形态。
 *
 * 轨道存档只保存稳定技能组与基础模板身份；换槽 Buff 会让同一个块在运行时执行
 * replacement skill。基础定义仍提供无模拟时的预览，替换形态只能由实际回执确认，
 * 因此其命中统一标记为条件候选。相同 step key 在多个形态中表示同一稳定命中身份，
 * 只保留首次出现的标记，实际帧仍由 DamageApplied 覆盖。
 */
export function projectCastHitMarkersWithReplacements(
  cast: SkillCastDocument,
  definition: SkillDefinition,
  replacements: readonly SkillDefinition[],
  abilityEntityDefinitions?: OperatorAbilityEntityDefinitions,
  buffDefinitions?: OperatorBuffDefinitions,
): readonly TimelineHitMarker[] {
  const markers = [
    ...projectCastHitMarkers(cast, definition, abilityEntityDefinitions, buffDefinitions),
  ];
  const seen = new Set(markers.map(marker => marker.hitId));
  for (const replacement of replacements) {
    for (const marker of projectCastHitMarkers(
      cast,
      replacement,
      abilityEntityDefinitions,
      buffDefinitions,
    )) {
      if (seen.has(marker.hitId)) continue;
      seen.add(marker.hitId);
      markers.push({ ...marker, conditional: true });
    }
  }
  return markers;
}

/** 按稳定 step key 查询一次释放中的命中标记；找不到时返回 null。 */
export function findCastHitMarker(
  cast: SkillCastDocument,
  stepKey: string,
  definition: SkillDefinition,
  abilityEntityDefinitions?: OperatorAbilityEntityDefinitions,
): TimelineHitMarker | null {
  return (
    projectCastHitMarkers(cast, definition, abilityEntityDefinitions).find(
      marker => marker.stepKey === stepKey,
    ) ?? null
  );
}
