import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { projectComboWindowTimelineViz } from './comboWindowTimelineViz';

function receipt(
  sequence: number,
  frame: number,
  event: string,
  sourceId: string,
  windowSequence: number,
  nextSkillKey = 'combo:1',
): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event,
    sourceId,
    data: { windowSequence, nextSkillKey },
  };
}

describe('combo window timeline projection', () => {
  it('closes a consumed candidate and every older candidate cleared with its operator record', () => {
    const segments = projectComboWindowTimelineViz(
      [
        receipt(0, 10, 'ComboWindowOpened', 'track:1', 0, 'combo:old'),
        receipt(1, 12, 'ComboWindowOpened', 'track:1', 1, 'combo:new'),
        receipt(2, 20, 'ComboWindowConsumed', 'track:1', 1, 'combo:new'),
      ],
      60,
    );

    expect(segments).toEqual([
      {
        sequence: 0,
        operatorId: 'track:1',
        nextSkillKey: 'combo:old',
        startFrame: 10,
        endFrame: 20,
        outcome: 'cleared',
      },
      {
        sequence: 1,
        operatorId: 'track:1',
        nextSkillKey: 'combo:new',
        startFrame: 12,
        endFrame: 20,
        outcome: 'consumed',
      },
    ]);
  });

  it('keeps expiration operator-local and extends pending windows to the published frame', () => {
    const segments = projectComboWindowTimelineViz(
      [
        receipt(0, 5, 'ComboWindowOpened', 'track:1', 0),
        receipt(1, 7, 'ComboWindowOpened', 'track:2', 1, 'combo:2'),
        receipt(2, 25, 'ComboWindowExpired', 'track:1', 0),
      ],
      40,
    );
    expect(segments[0]).toMatchObject({ operatorId: 'track:1', endFrame: 25, outcome: 'expired' });
    expect(segments[1]).toMatchObject({ operatorId: 'track:2', endFrame: 40, outcome: 'pending' });
  });

  it('rejects malformed lifecycle facts instead of inventing an identity', () => {
    expect(() =>
      projectComboWindowTimelineViz(
        [{ sequence: 0, frame: 0, time: 0, event: 'ComboWindowOpened', data: {} }],
        30,
      ),
    ).toThrow('sourceId');
    expect(() => projectComboWindowTimelineViz([], -1)).toThrow('endFrame');
  });
});
