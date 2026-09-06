import { describe, expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { SkillPlacementTransaction } from './skillPlacementTransaction';
import type { ScenarioSimulationService } from '../../application/scenarioSimulationService';

type Result = Awaited<ReturnType<ScenarioSimulationService['planSkillChain']>>;
function setup() {
  let revision = 0;
  const pending: ((result: Result) => void)[] = [];
  const service = {
    planSkillChain: vi.fn(() => new Promise<Result>(resolve => pending.push(resolve))),
  };
  const transaction = new SkillPlacementTransaction(service, () => revision);
  const placed = { scenario: createEmptyScenario('scenario', 'test'), skillCastIds: ['a', 'b'] };
  return { transaction, service, pending, placed, edit: () => revision++ };
}

describe('SkillPlacementTransaction', () => {
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
