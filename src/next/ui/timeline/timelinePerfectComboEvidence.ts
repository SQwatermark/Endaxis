/**
 * Buff identities whose successful application is direct source evidence for
 * the old editor's “perfect combo” highlight.
 *
 * Rossi's generated comboSkill3 only applies this tutorial-success Buff from
 * the audited `timing_success == 1` branch. `BuffApplied.sourceActionId` is the
 * timeline cast id for this direct skill program, so no timing proximity or
 * action ordering inference is required here.
 */
export const PERFECT_COMBO_EVIDENCE_BUFF_IDS = Object.freeze(
  new Set(['buff_chr_0028_wulfa_tut_comboskill_success']),
);

interface PerfectComboReceiptEntry {
  readonly sequence: number;
  readonly event: string;
  readonly data?: Readonly<Record<string, boolean | number | string | null>>;
}

/** Project timeline cast ids with explicit native-branch success evidence. */
export function projectPerfectComboCastIds(
  entries: readonly PerfectComboReceiptEntry[],
): ReadonlySet<string> {
  const result = new Set<string>();
  for (const entry of entries) {
    if (entry.event !== 'BuffApplied') continue;
    const buffId = entry.data?.buffId;
    if (typeof buffId !== 'string') {
      throw new Error(`receipt ${entry.sequence} has invalid BuffApplied buffId`);
    }
    if (!PERFECT_COMBO_EVIDENCE_BUFF_IDS.has(buffId)) continue;
    const castId = entry.data?.sourceActionId;
    if (typeof castId !== 'string' || castId.length === 0) {
      throw new Error(`receipt ${entry.sequence} has invalid perfect-combo sourceActionId`);
    }
    result.add(castId);
  }
  return result;
}
