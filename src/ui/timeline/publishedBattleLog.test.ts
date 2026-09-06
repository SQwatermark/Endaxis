import { expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { perlica } from '../../data/operators';
import type { PublishedScenarioSimulation } from './useScenarioSimulation';
import { capturePublishedBattleLog } from './publishedBattleLog';

it('captures definition metadata once, while localization uses the captured identity', () => {
  const scenario = createEmptyScenario('test', 'test');
  scenario.tracks[0] = {
    id: 'track',
    operator: {
      operatorSlug: perlica.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 1, battleSkill: 1, comboSkill: 1, ultimate: 1 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [
      {
        id: 'cast',
        source: { kind: 'operatorSkill', skillGroupKey: 'battleSkill', skillKey: 'battleSkill' },
        placement: { startFrame: 0 },
      },
    ],
  };
  const definition = { ...perlica, displayName: 'captured custom name' };
  const index = { getOperator: vi.fn(() => definition) };
  const entries: PublishedScenarioSimulation['run']['receiptEntries'] = [];
  let language = 'zh';
  const snapshot = capturePublishedBattleLog(
    { scenario, run: { receiptEntries: entries } as unknown as PublishedScenarioSimulation['run'] },
    index,
    {
      skill: () => (language === 'zh' ? '战技' : 'Battle skill'),
      operator: name => `${name.displayName}:${language}`,
    },
  );
  const reads = index.getOperator.mock.calls.length;
  definition.displayName = 'edited name';
  expect(snapshot.resolveCastOwners()[0]?.operatorLabel).toBe('captured custom name:zh');
  language = 'en';
  expect(snapshot.resolveCastOwners()[0]).toMatchObject({
    label: 'Battle skill',
    operatorLabel: 'captured custom name:en',
  });
  expect(index.getOperator).toHaveBeenCalledTimes(reads);
  expect(snapshot.entries).toBe(entries);
});
