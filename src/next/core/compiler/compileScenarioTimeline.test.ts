import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../project/createProject';
import type { ScenarioDocument } from '../project/schema';
import { perlica } from '../../data/operators/perlica';
import { placeSkillGroup } from '../../ui/timeline/placeSkillGroup';
import { compileScenarioTimeline } from './compileScenarioTimeline';

function createScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:1', '佩丽卡编译样本');
  scenario.builds.operators.perlica = {
    id: 'perlica',
    operatorSlug: perlica.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: {},
  };
  scenario.tracks[0] = {
    operatorBuildId: 'perlica',
    weaponBuildId: null,
    gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}

function catalog() {
  return { getOperator: (slug: string) => (slug === perlica.slug ? perlica : null) };
}

function place(scenario: ScenarioDocument, skillGroupKey: string, startFrame: number) {
  let nextId = 0;
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: perlica,
    skillGroupKey,
    startFrame,
    ids: { allocate: kind => `${kind}:${++nextId}` },
  }).scenario;
}

describe('compileScenarioTimeline', () => {
  it('compiles the complete operator skill catalog and placed input', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);

    const compiled = compileScenarioTimeline(scenario, catalog());

    expect(compiled.operators).toHaveLength(1);
    expect(compiled.operators[0]!.operatorId).toBe('perlica');
    expect(compiled.operators[0]!.skills.map(skill => skill.skillId)).toContain('battleSkill');
    expect(compiled.inputs).toEqual([{ frame: 60, operatorId: 'perlica', skillId: 'battleSkill' }]);
  });

  it('preserves the declaration order of same-frame inputs', () => {
    let scenario = place(createScenario(), 'battleSkill', 60);
    scenario = place(scenario, 'ultimate', 60);

    expect(compileScenarioTimeline(scenario, catalog()).inputs).toEqual([
      { frame: 60, operatorId: 'perlica', skillId: 'battleSkill' },
      { frame: 60, operatorId: 'perlica', skillId: 'ultimate' },
    ]);
  });

  it('compiles a basic-attack placement as four ordered inputs', () => {
    const scenario = place(createScenario(), 'basicAttack', 30);
    const casts = scenario.tracks[0]!.skillCasts;

    expect(compileScenarioTimeline(scenario, catalog()).inputs).toEqual(
      casts.map(cast => ({
        frame: cast.placement.startFrame,
        operatorId: 'perlica',
        skillId: cast.source.kind === 'operatorSkill' ? cast.source.skillKey : '',
      })),
    );
  });

  it('omits explicitly disabled casts', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    scenario.tracks[0]!.skillCasts[0]!.editable.disabled = true;

    expect(compileScenarioTimeline(scenario, catalog()).inputs).toEqual([]);
  });

  it('compiles an active ultimate-cost potential into the runtime program', () => {
    const scenario = createScenario();
    scenario.builds.operators.perlica!.potential = 1;
    const operator = {
      ...perlica,
      potentials: [
        {
          key: 'reducedUltimateCost',
          levels: 1,
          modifiers: [
            {
              kind: 'multiplySkillCost' as const,
              skillGroupKey: 'ultimate',
              resource: 'ultimateEnergy' as const,
              multiplier: 0.85,
            },
          ],
        },
      ],
    };

    const compiled = compileScenarioTimeline(scenario, {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });
    const ultimate = compiled.operators[0]!.skills.find(skill => skill.skillId === 'ultimate');

    expect(ultimate?.costs).toEqual([{ resource: 'ultimateEnergy', value: 68 }]);
  });

  it('fails closed when one cast contains user overrides', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    scenario.tracks[0]!.skillCasts[0]!.edited.push('durationFrames');

    expect(() => compileScenarioTimeline(scenario, catalog())).toThrow(
      'per-cast program compilation is not connected',
    );
  });

  it('rejects a dangling skill identity', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    const cast = scenario.tracks[0]!.skillCasts[0]!;
    if (cast.source.kind !== 'operatorSkill') throw new Error('unexpected fixture source');
    cast.source.skillKey = 'missing';

    expect(() => compileScenarioTimeline(scenario, catalog())).toThrow("has no skill 'missing'");
  });
});
