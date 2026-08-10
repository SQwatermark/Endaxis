/**
 * 算出一个技能块上的命中点画在哪、对应哪个命中。
 *
 * 位置只由存档决定（技能放在第几帧 + 序列从第几帧开始），和模拟结果无关；
 * 条件分支里的命中点会标记出来，由页面决定怎么显示。
 */
import type { CombatStepDocument, SkillCastDocument } from '../../core/project/schema';

/** 一个可渲染的命中点。 */
export interface TimelineHitMarker {
  readonly hitId: string;
  /** 相对技能块左边缘的帧偏移。 */
  readonly frameOffset: number;
  /** 这个步骤在定义里的名字（如果有）；没有时和日志只能按帧对应。 */
  readonly stepKey?: string;
  /** 在条件分支里，跑不跑取决于当时的条件。 */
  readonly conditional: boolean;
}

/** 页面算好像素位置后交给组件画出来的命中点。 */
export interface TimelineHitMarkerView {
  readonly hitId: string;
  /** 相对技能块左边缘的像素偏移。 */
  readonly leftPx: number;
  readonly title?: string;
}

function collectDamageSteps(
  step: CombatStepDocument,
  conditional: boolean,
  markers: TimelineHitMarker[],
  frameOffset: number,
): void {
  if (step.kind === 'dealDamage' || step.kind === 'dealFixedDamage') {
    markers.push({
      hitId: step.hitId,
      frameOffset,
      ...(step.sourceStepKey === undefined ? {} : { stepKey: step.sourceStepKey }),
      conditional,
    });
    return;
  }
  if (step.kind === 'conditional') {
    // 条件分支里的步骤跑不跑取决于当时条件，一律标记为 conditional。
    for (const nested of step.whenTrue.steps)
      collectDamageSteps(nested, true, markers, frameOffset);
    for (const nested of step.whenFalse?.steps ?? []) {
      collectDamageSteps(nested, true, markers, frameOffset);
    }
    return;
  }
  if (step.kind === 'once') {
    for (const nested of step.body.steps)
      collectDamageSteps(nested, conditional, markers, frameOffset);
  }
}

/**
 * 收集一次技能释放的全部命中点，按序列声明顺序返回。
 * 条件分支里的命中点始终标记为 conditional。
 */
export function projectCastHitMarkers(cast: SkillCastDocument): readonly TimelineHitMarker[] {
  const markers: TimelineHitMarker[] = [];
  for (const scheduled of cast.editable.scheduledSequences) {
    for (const step of scheduled.sequence.steps) {
      collectDamageSteps(step, false, markers, scheduled.startFrame);
    }
  }
  return markers;
}

/** 按稳定身份查询一次释放中的命中标记；找不到时返回 null。 */
export function findCastHitMarker(
  cast: SkillCastDocument,
  hitId: string,
): TimelineHitMarker | null {
  return projectCastHitMarkers(cast).find(marker => marker.hitId === hitId) ?? null;
}
