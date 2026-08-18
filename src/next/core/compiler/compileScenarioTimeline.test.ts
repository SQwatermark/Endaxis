import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../project/createProject';
import type { ScenarioDocument } from '../project/schema';
import { perlica } from '../../data/operators/perlica';
import { placeSkillGroup } from '../../ui/timeline/placeSkillGroup';
import { compileScenarioTimeline } from './compileScenarioTimeline';
import type { SkillDefinition } from '../game-data/operatorDefinition';

function createScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:1', '佩丽卡编译样本');

  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
      operatorSlug: perlica.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}

function index() {
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

function requireSingleSkill(skillGroupKey: string): SkillDefinition {
  const group = perlica.skillGroups.find(candidate => candidate.key === skillGroupKey);
  if (group === undefined || Array.isArray(group.skills)) {
    throw new Error(`expected single-skill group '${skillGroupKey}'`);
  }
  return group.skills as SkillDefinition;
}

describe('compileScenarioTimeline', () => {
  it('compiles the complete operator skill index and placed input', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);

    const compiled = compileScenarioTimeline(scenario, index());

    expect(compiled.operators).toHaveLength(1);
    expect(compiled.operators[0]!.operatorId).toBe('track:0');
    expect(compiled.operators[0]!.skills.map(skill => skill.skillId)).toContain('battleSkill');
    expect(compiled.operators[0]!.comboSkillRegistrations).toEqual([
      {
        skillKey: 'comboSkill',
        priority: 'default',
        blackboard: {},
        rules: [
          {
            trigger: {
              kind: 'damageTagHit',
              tag: 'normalAttackLastCombo',
              scope: 'team',
            },
          },
        ],
      },
    ]);
    expect(compiled.inputs).toEqual([
      { frame: 60, operatorId: 'track:0', skillId: 'battleSkill', castId: 'skillCast:1' },
    ]);
  });

  it('compiles replacement variants for the same stable cast identity without extra inputs', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    const base = requireSingleSkill('battleSkill');
    const operator = {
      ...perlica,
      skillGroups: perlica.skillGroups.map(group =>
        group.key === 'battleSkill'
          ? { ...group, replacementSkills: [{ ...base, key: 'battleSkillVariant' }] }
          : group,
      ),
    };

    const compiled = compileScenarioTimeline(scenario, {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });

    expect(compiled.inputs).toEqual([
      { frame: 60, operatorId: 'track:0', skillId: 'battleSkill', castId: 'skillCast:1' },
    ]);
    expect(compiled.operators[0]!.skills.map(skill => [skill.skillId, skill.castId])).toEqual([
      ['battleSkill', 'skillCast:1'],
      ['battleSkillVariant', 'skillCast:1'],
    ]);
    expect(compiled.operators[0]!.skillSlotGroups).toEqual([
      {
        skillGroupKey: 'battleSkill',
        baseSkillKey: 'battleSkill',
        replacementSkillKeys: ['battleSkillVariant'],
      },
    ]);
  });

  it('preserves the declaration order of same-frame inputs', () => {
    let scenario = place(createScenario(), 'battleSkill', 60);
    scenario = place(scenario, 'ultimate', 60);

    expect(compileScenarioTimeline(scenario, index()).inputs).toEqual([
      { frame: 60, operatorId: 'track:0', skillId: 'battleSkill', castId: 'skillCast:1' },
      { frame: 60, operatorId: 'track:0', skillId: 'ultimate', castId: 'skillCast:1' },
    ]);
  });

  it('compiles a basic-attack placement as four ordered inputs', () => {
    const scenario = place(createScenario(), 'basicAttack', 30);
    const casts = scenario.tracks[0]!.skillCasts;

    expect(compileScenarioTimeline(scenario, index()).inputs).toEqual(
      casts.map(cast => ({
        frame: cast.placement.startFrame,
        operatorId: 'track:0',
        skillId: cast.source.kind === 'operatorSkill' ? cast.source.skillKey : '',
        castId: cast.id,
      })),
    );
  });

  it('omits explicitly disabled casts', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    scenario.tracks[0]!.skillCasts[0]!.presentation = { disabled: true };

    expect(compileScenarioTimeline(scenario, index()).inputs).toEqual([]);
  });

  it('compiles an active ultimate-cost potential into the runtime program', () => {
    const scenario = createScenario();
    scenario.tracks[0]!.operator!.potential = 1;
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

    const compiled = compileScenarioTimeline(place(scenario, 'ultimate', 60), {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });
    const ultimate = compiled.operators[0]!.skills.find(skill => skill.skillId === 'ultimate');

    expect(ultimate?.costs).toEqual([{ resource: 'ultimateEnergy', value: 68 }]);
  });

  it('compiles a complete custom definition with the current skill level', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    const cast = scenario.tracks[0]!.skillCasts[0]!;
    const template = requireSingleSkill('battleSkill');
    cast.customDefinition = {
      ...structuredClone(template),
      timelineBlockFrames: 99,
      costs: [
        {
          resource: 'sp',
          value: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 123],
        },
      ],
    };

    const compiled = compileScenarioTimeline(scenario, index());
    const program = compiled.operators[0]!.skills[0]!;

    expect(program.castId).toBe(cast.id);
    expect(program.skillId).toBe('battleSkill');
    expect(program.timelineBlockFrames).toBe(99);
    expect(program.costs).toEqual([{ resource: 'sp', value: 123 }]);
  });

  it('applies active operator upgrades after compiling a custom definition', () => {
    const scenario = place(createScenario(), 'ultimate', 60);
    scenario.tracks[0]!.operator!.potential = 1;
    const cast = scenario.tracks[0]!.skillCasts[0]!;
    const template = requireSingleSkill('ultimate');
    cast.customDefinition = {
      ...structuredClone(template),
      costs: [{ resource: 'ultimateEnergy', value: 100 }],
    };
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

    expect(compiled.operators[0]!.skills[0]!.costs).toEqual([
      { resource: 'ultimateEnergy', value: 85 },
    ]);
  });

  it('rejects a dangling skill identity', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    const cast = scenario.tracks[0]!.skillCasts[0]!;
    if (cast.source.kind !== 'operatorSkill') throw new Error('unexpected fixture source');
    cast.source.skillKey = 'missing';

    expect(() => compileScenarioTimeline(scenario, index())).toThrow("has no skill 'missing'");
  });
});
