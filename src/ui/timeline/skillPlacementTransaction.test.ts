import { describe, expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { SkillPlacementTransaction } from './skillPlacementTransaction';
import type { ScenarioSimulationService } from '../../application/scenarioSimulationService';

type Result = Awaited<ReturnType<ScenarioSimulationService['planSkillChain']>>;
function setup() {
  let revision = 0;
  const pending: ((result: Result) => void)[] = [];
  const failures: ((error: unknown) => void)[] = [];
  const service = {
    planSkillChain: vi.fn(
      () =>
        new Promise<Result>((resolve, reject) => {
          pending.push(resolve);
          failures.push(reject);
        }),
    ),
  };
  const transaction = new SkillPlacementTransaction(service, () => revision);
  const placed = { scenario: createEmptyScenario('scenario', 'test'), skillCastIds: ['a', 'b'] };
  return { transaction, service, pending, failures, placed, edit: () => revision++ };
}

describe('SkillPlacementTransaction', () => {
  it('passes partial compact timing through without committing partial document changes', async () => {
    const { transaction, pending, placed } = setup();
    const result = transaction.resolve(placed, 'compact');
    const plannedStartFrames = new Map([['a', 0]]);
    pending[0]!({ status: 'incomplete', unresolvedCastIds: ['b'], plannedStartFrames });
    expect(await result).toEqual({
      scenario: placed.scenario,
      incomplete: true,
      plannedStartFrames,
    });
  });
  it.each(['continuation', 'compact'] as const)(
    'preserves editing and the error when %s planning fails',
    async mode => {
      const { transaction, failures, placed } = setup();
      const error = new Error('missing simulation input');
      const result = transaction.resolve(placed, mode);
      failures[0]!(error);
      expect(await result).toEqual({ scenario: placed.scenario, incomplete: true, error });
    },
  );
  it.each(['edit', 'cancel', 'newer'] as const)(
    'does not fall back over newer state after %s',
    async reason => {
      const { transaction, pending, failures, placed, edit } = setup();
      const first = transaction.resolve(placed);
      let second: ReturnType<typeof transaction.resolve> | undefined;
      if (reason === 'edit') edit();
      if (reason === 'cancel') transaction.cancel();
      if (reason === 'newer') second = transaction.resolve(placed);
      failures[0]!(new Error('late simulation failure'));
      expect(await first).toBeNull();
      if (second) {
        pending[1]!({ status: 'incomplete', unresolvedCastIds: ['b'] });
        expect(await second).not.toBeNull();
      }
    },
  );
  it('preserves default author placement when planning is unresolved', async () => {
    const { transaction, pending, placed } = setup();
    const result = transaction.resolve(placed);
    pending[0]!({ status: 'incomplete', unresolvedCastIds: ['b'] });
    expect(await result).toEqual({ scenario: placed.scenario, incomplete: true });
  });
  it.each(['edit', 'cancel', 'newer'] as const)('discards results after %s', async reason => {
    const { transaction, pending, placed, edit } = setup();
    const first = transaction.resolve(placed);
    let second: ReturnType<typeof transaction.resolve> | undefined;
    if (reason === 'edit') edit();
    if (reason === 'cancel') transaction.cancel();
    if (reason === 'newer') second = transaction.resolve(placed);
    pending[0]!({ status: 'incomplete', unresolvedCastIds: ['b'] });
    expect(await first).toBeNull();
    if (second) {
      pending[1]!({ status: 'incomplete', unresolvedCastIds: ['b'] });
      expect(await second).not.toBeNull();
    }
  });
  it('does not simulate individual skill placement', async () => {
    const { transaction, service, placed } = setup();
    expect(await transaction.resolve({ ...placed, skillCastIds: ['a'] })).toEqual({
      scenario: placed.scenario,
      incomplete: false,
    });
    expect(service.planSkillChain).not.toHaveBeenCalled();
  });
});
