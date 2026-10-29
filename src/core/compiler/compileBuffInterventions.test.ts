import { expect, it } from 'vitest';
import { gameDataRepository } from '../../data/gameDataRepository';
import { createEmptyScenario } from '../project/createProject';
import { compileScenarioBuffInterventions } from './compileBuffInterventions';

it('rejects a real contract GlobalBuff child suppression before it can widen the chosen target to the whole party', () => {
  const scenario = createEmptyScenario('global-local-scope', 'Global local scope');
  scenario.buffInterventions = [
    {
      id: 'local-only',
      kind: 'suppress',
      startFrame: 0,
      endFrame: 30,
      buff: {
        kind: 'common',
        sourceId: 'contingency-contracts',
        buffId: 'buff_cc_chr_combo_special_cc0',
      },
      target: { kind: 'enemy' },
    },
  ];
  expect(() => compileScenarioBuffInterventions(scenario, gameDataRepository, [])).toThrow(/局部/);
});
