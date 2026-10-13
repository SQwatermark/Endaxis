import type { CombatReceiptEntry } from '../../../core/combat/receipt/combatReceipt';
import {
  projectBuffIconTimelineMetadata,
  type BuffTimelineSegment,
} from '../../../core/projection/buffTimelineViz';
import {
  isBuffDamageReceipt,
  isSkillFollowupBuffDamageReceipt,
} from '../../../core/projection/enemyEffectViz';

export function groupEnemyBuffDamageHits(
  entries: readonly CombatReceiptEntry[],
  visibleBuffSegments: readonly BuffTimelineSegment[] = projectBuffIconTimelineMetadata(
    entries,
    entries.reduce((maximum, entry) => Math.max(maximum, entry.frame), 0),
  ),
  displayOwners: Readonly<Record<number, BuffTimelineSegment>> = {},
) {
  const groups = new Map<string, CombatReceiptEntry[]>();
  for (const entry of entries) {
    if (
      ((!isBuffDamageReceipt(entry) || entry.targetId !== entry.data!.buffOwnerId) &&
        displayOwners[entry.sequence] === undefined) ||
      isSkillFollowupBuffDamageReceipt(entry, visibleBuffSegments, displayOwners) ||
      typeof entry.data?.spellBurstType === 'string'
    )
      continue;
    const key = JSON.stringify([
      entry.targetId,
      entry.frame,
      displayOwners[entry.sequence]?.targetId ?? entry.data?.buffOwnerId,
      displayOwners[entry.sequence]?.buffId ?? entry.data?.buffId,
      displayOwners[entry.sequence]?.instanceId ?? entry.data?.buffInstanceId,
    ]);
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  }
  return [...groups.values()];
}
