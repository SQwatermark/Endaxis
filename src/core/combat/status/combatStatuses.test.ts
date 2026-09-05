import { describe, expect, it } from 'vitest';
import { CombatStatusContainer, type CombatStatusDefinition } from './combatStatuses';

const MARK: CombatStatusDefinition = {
  statusKey: 'mark',
  applyStacks: 1,
  maxStacks: 3,
  durationFrames: 3,
  durationStacking: 'refresh',
  consumeStacks: 1,
};

describe('CombatStatusContainer', () => {
  it('uses explicit definitions, adds layers and caps them', () => {
    const statuses = new CombatStatusContainer('operator', [MARK]);
    statuses.apply({ statusKey: 'mark', sourceId: 'first', skillId: 'skill1' });
    const reapplied = statuses.apply({
      statusKey: 'mark',
      sourceId: 'second',
      skillId: 'skill2',
      stacks: 5,
      durationFrames: 5,
    });

    expect(reapplied).toMatchObject({
      sourceId: 'second',
      skillId: 'skill2',
      previous: { stacks: 1, remainingFrames: 3 },
      current: { stacks: 3, remainingFrames: 5 },
    });
    statuses.advanceFrame();
    statuses.advanceFrame();
    statuses.advanceFrame();
    statuses.advanceFrame();
    expect(statuses.advanceFrame()[0]).toMatchObject({ sourceId: 'first', skillId: 'skill1' });
  });

  it('implements the three evidence-backed duration stacking rules', () => {
    const remainingAfterReapply = (
      durationStacking: CombatStatusDefinition['durationStacking'],
    ) => {
      const statuses = new CombatStatusContainer('operator', [{ ...MARK, durationStacking }]);
      statuses.apply({ statusKey: 'mark', sourceId: 'operator', skillId: 'skill' });
      statuses.advanceFrame();
      statuses.apply({
        statusKey: 'mark',
        sourceId: 'operator',
        skillId: 'skill',
        durationFrames: 2,
      });
      return statuses.getSnapshot('mark').remainingFrames;
    };

    expect(remainingAfterReapply('refresh')).toBe(2);
    expect(remainingAfterReapply('extend')).toBe(4);
    expect(remainingAfterReapply('overwrite')).toBe(2);
  });

  it('consumes explicit layers or the definition-owned all-layers policy', () => {
    const statuses = new CombatStatusContainer('operator', [
      MARK,
      { ...MARK, statusKey: 'all', consumeStacks: 'all' },
    ]);
    statuses.apply({ statusKey: 'mark', sourceId: 'operator', skillId: 'skill', stacks: 3 });
    statuses.apply({ statusKey: 'all', sourceId: 'operator', skillId: 'skill', stacks: 3 });

    const consume = (statusKey: string, stacks?: number) =>
      statuses.consume({
        statusKey,
        sourceId: 'operator',
        skillId: 'consumer',
        ...(stacks === undefined ? {} : { stacks }),
      });
    expect(consume('mark').current.stacks).toBe(2);
    expect(consume('mark', 2).current.stacks).toBe(0);
    expect(consume('all').current.stacks).toBe(0);
  });

  it('expires finite statuses in insertion order while infinite statuses remain', () => {
    const statuses = new CombatStatusContainer('operator', [
      { ...MARK, statusKey: 'first', durationFrames: 1 },
      { ...MARK, statusKey: 'infinite', durationFrames: null },
      { ...MARK, statusKey: 'second', durationFrames: 1 },
    ]);
    statuses.apply({ statusKey: 'first', sourceId: 'one', skillId: 'skill1' });
    statuses.apply({ statusKey: 'infinite', sourceId: 'two', skillId: 'skill2' });
    statuses.apply({ statusKey: 'second', sourceId: 'three', skillId: 'skill3' });

    expect(statuses.advanceFrame().map(change => change.statusKey)).toEqual(['first', 'second']);
    expect(statuses.getStacks('infinite')).toBe(1);
  });

  it('rejects unknown identities and invalid explicit definitions', () => {
    const statuses = new CombatStatusContainer('operator', [MARK]);
    expect(() =>
      statuses.apply({ statusKey: 'unknown', sourceId: 'operator', skillId: 'skill' }),
    ).toThrow("unknown combat status 'unknown'");
    expect(() => new CombatStatusContainer('operator', [{ ...MARK, applyStacks: 0 }])).toThrow(
      "status 'mark' default apply stacks must be a positive safe integer",
    );
    expect(
      () =>
        new CombatStatusContainer('operator', [
          { ...MARK, durationStacking: 'unknown' as CombatStatusDefinition['durationStacking'] },
        ]),
    ).toThrow("status 'mark' has unknown duration stacking 'unknown'");
  });
});
