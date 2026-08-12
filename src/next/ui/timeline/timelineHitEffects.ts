/**
 * 把模拟日志里的伤害、附着、反应，对应到具体技能块的命中点上。
 *
 * 伤害步骤带步骤键时按键精确对应；没有键就按"第几帧、谁打的"对应；
 * 附着按"第几帧、谁打的、哪个技能"对应。本模块只做对应，不做任何计算。
 */
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import {
  projectHitDamageReceipts,
  projectHitInflictionReceipts,
  projectHitReactionReceipts,
} from '../../core/projection/hitEffectProjection';
import type { ScenarioDocument } from '../../core/project/schema';
import type { TimelineHitMarker } from './timelineHitProjection';

/** 一个命中点上发生的伤害（保持日志顺序）。 */
export interface TimelineHitDamageEffect {
  readonly value: number;
  readonly damageType: string;
  readonly isCritical: boolean;
}

/** 一个命中点上发生的元素附着。 */
export interface TimelineHitInflictionEffect {
  readonly element: string;
  readonly outcomeKind: string;
  readonly currentLayers: number;
}

/** 一个命中点上发生的反应施加或消费。 */
export interface TimelineHitReactionEffect {
  readonly reaction: string;
  readonly applied: boolean;
  readonly level: number;
  readonly previousLevel: number;
}

/** 一个命中点上的全部效果，键是命中点的 id。 */
export interface TimelineHitEffectLabel {
  readonly damage: readonly TimelineHitDamageEffect[];
  readonly infliction: readonly TimelineHitInflictionEffect[];
  readonly reactions: readonly TimelineHitReactionEffect[];
}

/** 把一次释放的命中标记与回执事实归因；键为 `hitId`。 */
export function projectHitEffectsByCast(
  scenario: ScenarioDocument,
  entries: readonly CombatReceiptEntry[],
  castId: string,
  markers: readonly TimelineHitMarker[],
): ReadonlyMap<string, TimelineHitEffectLabel> {
  let targetTrack = null;
  let targetCast = null;
  for (const track of scenario.tracks) {
    const skillCast = track?.skillCasts.find(candidate => candidate.id === castId);
    if (track !== null && skillCast !== undefined) {
      targetTrack = track;
      targetCast = skillCast;
      break;
    }
  }
  if (targetTrack === null || targetCast === null || targetTrack.operator === null) {
    return new Map<string, TimelineHitEffectLabel>();
  }
  const operatorId = targetTrack.id;
  const damages = projectHitDamageReceipts(entries).filter(
    receipt => receipt.sourceId === operatorId,
  );
  const inflictions = projectHitInflictionReceipts(entries).filter(
    receipt =>
      receipt.sourceId === operatorId &&
      targetCast.source.kind === 'operatorSkill' &&
      receipt.skillId === targetCast.source.skillKey,
  );
  const reactions = projectHitReactionReceipts(entries).filter(
    receipt => receipt.sourceId === operatorId,
  );

  const byHitId = new Map<string, TimelineHitEffectLabel>();
  for (const marker of markers) {
    const absoluteFrame = targetCast.placement.startFrame + marker.frameOffset;
    const damage = damages
      .filter(
        receipt =>
          receipt.frame === absoluteFrame &&
          (marker.stepKey === undefined || receipt.stepKey === marker.stepKey),
      )
      .map(receipt => ({
        value: receipt.value,
        damageType: receipt.damageType,
        isCritical: receipt.isCritical,
      }));
    const infliction = inflictions
      .filter(receipt => receipt.frame === absoluteFrame)
      .map(receipt => ({
        element: receipt.element,
        outcomeKind: receipt.outcomeKind,
        currentLayers: receipt.currentLayers,
      }));
    const reactionEffects = reactions
      .filter(receipt => receipt.frame === absoluteFrame)
      .map(receipt => ({
        reaction: receipt.reaction,
        applied: receipt.applied,
        level: receipt.level,
        previousLevel: receipt.previousLevel,
      }));
    if (damage.length === 0 && infliction.length === 0 && reactionEffects.length === 0) continue;
    byHitId.set(marker.hitId, {
      damage,
      infliction,
      reactions: reactionEffects,
    });
  }
  return byHitId;
}
