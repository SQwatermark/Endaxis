import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { perlica } from '../../data/operators';
import { projectTimelineEditor } from './timelineEditorViewModel';

describe('projectTimelineEditor', () => {
  it('projects a catalog-backed operator track without leaking mutable definitions', () => {
    const scenario = createEmptyScenario('scenario:1', '佩丽卡样板');
    scenario.builds.operators.perlica = {
      id: 'perlica',
      operatorSlug: 'perlica',
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: {
        basicAttack: 12,
        battleSkill: 11,
        comboSkill: 10,
        ultimate: 9,
      },
      talentStates: {},
    };
    scenario.tracks[0] = {
      operatorBuildId: 'perlica',
      weaponBuildId: null,
      gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };

    const viewModel = projectTimelineEditor(scenario, {
      getOperator: slug => (slug === perlica.slug ? perlica : null),
    });

    expect(viewModel.tracks).toHaveLength(4);
    expect(viewModel.tracks[0]?.operatorSlug).toBe('perlica');
    expect(viewModel.tracks[0]?.skillLibrary.map(entry => entry.skillGroupKey)).toEqual([
      'basicAttack',
      'finisher',
      'plungingAttack',
      'battleSkill',
      'comboSkill',
      'ultimate',
    ]);
    expect(viewModel.tracks[0]?.skillLibrary[0]?.level).toBe(12);
    expect(viewModel.tracks[0]?.skillLibrary[0]?.skills).toHaveLength(4);
    expect(viewModel.tracks[1]).toMatchObject({ operatorSlug: null, skillLibrary: [] });
  });

  it('reports broken build references instead of inventing catalog defaults', () => {
    const scenario = createEmptyScenario('scenario:1', '损坏引用');
    scenario.tracks[0] = {
      operatorBuildId: 'missing',
      weaponBuildId: null,
      gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };

    const viewModel = projectTimelineEditor(scenario, { getOperator: () => null });

    expect(viewModel.tracks[0]?.issues).toEqual(["missing operator build 'missing'"]);
    expect(viewModel.tracks[0]?.skillLibrary).toEqual([]);
  });
});
