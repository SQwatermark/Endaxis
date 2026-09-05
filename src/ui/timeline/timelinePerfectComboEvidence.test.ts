import { describe, expect, it } from 'vitest';
import { projectPerfectComboCastIds } from './timelinePerfectComboEvidence';

function buffApplied(sequence: number, buffId: string, sourceActionId: string) {
  return { sequence, event: 'BuffApplied', data: { buffId, sourceActionId } };
}

describe('projectPerfectComboCastIds', () => {
  it('projects Rossi timing-success Buff evidence to its exact timeline cast', () => {
    expect(
      projectPerfectComboCastIds([
        buffApplied(0, 'buff_chr_0028_wulfa_tut_comboskill_success', 'cast:rossi'),
      ]),
    ).toEqual(new Set(['cast:rossi']));
  });

  it('does not treat ordinary combo consumption or unrelated Buffs as perfect timing', () => {
    expect(
      projectPerfectComboCastIds([
        { sequence: 0, event: 'ComboWindowConsumed', data: {} },
        buffApplied(1, 'buff_chr_0028_wulfa_tut_comboskill_failure', 'cast:rossi'),
      ]),
    ).toEqual(new Set());
  });

  it('deduplicates repeated success facts for one cast', () => {
    expect(
      projectPerfectComboCastIds([
        buffApplied(0, 'buff_chr_0028_wulfa_tut_comboskill_success', 'cast:rossi'),
        buffApplied(1, 'buff_chr_0028_wulfa_tut_comboskill_success', 'cast:rossi'),
      ]),
    ).toEqual(new Set(['cast:rossi']));
  });

  it('rejects malformed Buff and cast identities instead of guessing', () => {
    expect(() =>
      projectPerfectComboCastIds([{ sequence: 7, event: 'BuffApplied', data: {} }]),
    ).toThrow('BuffApplied buffId');
    expect(() =>
      projectPerfectComboCastIds([
        {
          sequence: 8,
          event: 'BuffApplied',
          data: { buffId: 'buff_chr_0028_wulfa_tut_comboskill_success' },
        },
      ]),
    ).toThrow('perfect-combo sourceActionId');
  });
});
