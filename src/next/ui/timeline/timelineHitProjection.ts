/**
 * 算出一个技能块上的命中点画在哪、对应哪个命中。
 *
 * 本模块只从定义收集稳定身份与无运行结果时的局部回退偏移；实际位置由页面消费
 * `DamageApplied(castId, hitId)` 回执。条件分支里的命中点会标记出来，由页面决定怎么显示。
 * 命中点来自调用方提供的 SkillDefinition（目录或自定义），投影层不再从存档快照读取。
 */
import type {
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
}

function collectDamageSteps(
  step: CombatStepDefinition,
  conditional: boolean,
  markers: TimelineHitMarker[],
  cast: SkillCastDocument,
  frameOffset: number,
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
      collectDamageSteps(nested, true, markers, cast, frameOffset);
    for (const nested of step.whenFalse?.steps ?? []) {
      collectDamageSteps(nested, true, markers, cast, frameOffset);
    }
    return;
  }
  if (step.kind === 'once') {
    for (const nested of step.body.steps)
      collectDamageSteps(nested, conditional, markers, cast, frameOffset);
    return;
  }
  if (step.kind === 'repeatEachTick' || step.kind === 'forEachContextTarget') {
    for (const nested of step.body.steps)
      collectDamageSteps(nested, conditional, markers, cast, frameOffset);
    return;
  }
  if (step.kind === 'listenForCombatEvents') {
    for (const response of step.parameters.responses) {
      for (const nested of response.sequence.steps) {
        collectDamageSteps(nested, true, markers, cast, frameOffset);
      }
    }
    return;
  }
  const childSkill =
    step.kind === 'spawnAbilityEntity'
      ? step.parameters.definition.childSkill
      : step.kind === 'startCurrentAbilityEntityChildSkill'
        ? step.parameters.childSkill
        : undefined;
  if (childSkill !== undefined) {
    for (const scheduled of childSkill.scheduledSequences) {
      for (const nested of scheduled.sequence.steps) {
        collectDamageSteps(nested, conditional, markers, cast, frameOffset + scheduled.startFrame);
      }
    }
  }
}

/**
 * 收集一次技能释放的全部命中点，按序列声明顺序返回。
 * 调用方传入本次使用的技能定义；伤害步骤缺少 key 时直接报错。
 */
export function projectCastHitMarkers(
  cast: SkillCastDocument,
  definition: SkillDefinition,
): readonly TimelineHitMarker[] {
  const markers: TimelineHitMarker[] = [];
  for (const scheduled of definition.scheduledSequences) {
    for (const step of scheduled.sequence.steps) {
      collectDamageSteps(step, false, markers, cast, scheduled.startFrame);
    }
  }
  return markers;
}

/** 按稳定 step key 查询一次释放中的命中标记；找不到时返回 null。 */
export function findCastHitMarker(
  cast: SkillCastDocument,
  stepKey: string,
  definition: SkillDefinition,
): TimelineHitMarker | null {
  return projectCastHitMarkers(cast, definition).find(marker => marker.stepKey === stepKey) ?? null;
}
