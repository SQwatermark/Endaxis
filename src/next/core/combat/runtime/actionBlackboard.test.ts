import { describe, expect, it } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';

describe('ActionBlackboard', () => {
  it('applies runtime values over definition defaults with typed reads', () => {
    const blackboard = new ActionBlackboard({ count: 1, label: 'default', empty: null });
    blackboard.assign({ count: 3, label: 5 });

    expect(blackboard.getNumber('count')).toBe(3);
    expect(blackboard.getString('label')).toBeUndefined();
    expect(blackboard.getNumber('missing')).toBeUndefined();
    expect(blackboard.snapshot()).toEqual({ count: 3, label: 5, empty: null });
  });

  it('supports dynamic assignment and exact snapshot restoration', () => {
    const blackboard = new ActionBlackboard({ count: 1 });
    const snapshot = blackboard.snapshot();
    expect(blackboard.assignDynamic('count', 4)).toBe(true);
    blackboard.restore(snapshot);

    expect(blackboard.snapshot()).toEqual({ count: 1 });
  });
});
