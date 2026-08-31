import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../project/createProject';
import type { ScenarioDocument } from '../project/schema';
import { perlica } from '../../data/operators/perlica';
import { placeSkillGroup } from '../../ui/timeline/placeSkillGroup';
import { compileScenarioTimeline } from './compileScenarioTimeline';
import type { SkillDefinition } from '../game-data/operatorDefinition';
import { deriveHitId } from '../combat/timeline/deriveHitId';

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
  it('Switch 的全部候选伤害绑定放置实例 hitId，而不是遗漏未选分支', () => {
    const scenario = place(createScenario(), 'battleSkill', 0);
    const cast = scenario.tracks[0]!.skillCasts[0]!;
    cast.customDefinition = {
      key: 'battleSkill',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'switch',
                parameters: { choice: { kind: 'constant', value: 0 }, alwaysNext: true },
                options: [0, 1].map(value => ({
                  value: { kind: 'constant', value },
                  sequence: {
                    steps: [
                      {
                        kind: 'dealDamage',
                        key: `case${value}`,
                        parameters: { damageType: 'physical', attackScale: 1, tags: [] },
                      },
                    ],
                  },
                })),
              },
            ],
          },
        },
      ],
    };
    const program = compileScenarioTimeline(scenario, index()).operators[0]!.skills.find(
      skill => skill.castId === cast.id,
    )!;
    const step = program.timelineActions[0]!.sequence.steps[0]!;
    if (step.kind !== 'switch') throw new Error('expected switch');
    expect(step.options.map(option => option.sequence.steps[0]!.hitId)).toEqual([
      deriveHitId(cast.id, 'case0'),
      deriveHitId(cast.id, 'case1'),
    ]);
  });

  it('copies cast-specific simulation inputs into the placed combat program', () => {
    const scenario = place(createScenario(), 'battleSkill', 0);
    scenario.tracks[0]!.skillCasts[0]!.simulationInputs = {
      cameraToTargetSignedAngleDegrees: 22.5,
      forcedCriticalStepKeys: ['damage:1'],
    };

    const compiled = compileScenarioTimeline(scenario, index());

    expect(
      compiled.operators[0]?.skills.find(skill => skill.castId !== undefined)?.simulationInputs,
    ).toEqual({
      cameraToTargetSignedAngleDegrees: 22.5,
      forcedCriticalStepKeys: ['damage:1'],
    });
    expect(
      compiled.operators[0]?.skills.find(skill => skill.castId !== undefined)?.simulationInputs
        ?.forcedCriticalStepKeys,
    ).not.toBe(scenario.tracks[0]!.skillCasts[0]!.simulationInputs?.forcedCriticalStepKeys);
  });

  it('combines read-only common Buffs with operator-owned Buffs without a skill level', () => {
    const operator = {
      ...perlica,
      buffDefinitions: {
        buff_chr_fixture_owned: { stackingType: 'refresh' as const },
      },
    };
    const compiled = compileScenarioTimeline(createScenario(), {
      getOperator: slug => (slug === operator.slug ? operator : null),
      getCommonBuffDefinitions: () => ({
        buff_common_fixture: { stackingType: 'unlimited' },
      }),
    });

    expect(compiled.operators[0]?.buffDefinitions).toEqual({
      buff_common_fixture: { stackingType: 'unlimited' },
      buff_chr_fixture_owned: { stackingType: 'refresh' },
    });
  });

  it('compiles ability entity additions and overrides from a project operator template', () => {
    const scenario = place(createScenario(), 'battleSkill', 0);
    scenario.tracks[0]!.skillCasts[0]!.customDefinition = {
      key: 'battleSkill',
      timelineBlockFrames: 1,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'spawnAbilityEntity',
                parameters: { abilityEntityId: 'generated', dieWhenSourceDies: false },
              },
              {
                kind: 'spawnAbilityEntity',
                parameters: { abilityEntityId: 'custom', dieWhenSourceDies: false },
              },
            ],
          },
        },
      ],
    };
    const operator = {
      ...perlica,
      abilityEntityDefinitions: {
        generated: { lifetime: { kind: 'limited' as const, durationSeconds: 3 } },
        custom: { lifetime: { kind: 'infinite' as const } },
      },
    };

    const compiled = compileScenarioTimeline(scenario, {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });

    expect(compiled.operators[0]?.skills[0]?.abilityEntityDefinitions).toEqual({
      generated: { lifetime: { kind: 'limited', durationSeconds: 3 } },
      custom: { lifetime: { kind: 'infinite' } },
    });
  });

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

  it('does not compile a hidden replacement until that concrete skill is placed', () => {
    const baseScenario = place(createScenario(), 'battleSkill', 60);
    const base = requireSingleSkill('battleSkill');
    const operator = {
      ...perlica,
      skillGroups: perlica.skillGroups.map(group =>
        group.key === 'battleSkill'
          ? { ...group, replacementSkills: [{ ...base, key: 'battleSkillVariant' }] }
          : group,
      ),
    };

    const compiled = compileScenarioTimeline(baseScenario, {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });

    expect(compiled.inputs).toEqual([
      { frame: 60, operatorId: 'track:0', skillId: 'battleSkill', castId: 'skillCast:1' },
    ]);
    expect(compiled.operators[0]!.skills.map(skill => [skill.skillId, skill.castId])).toEqual([
      ['battleSkill', 'skillCast:1'],
    ]);
    expect(compiled.operators[0]!.skillSlotGroups).toContainEqual(
      expect.objectContaining({
        skillGroupKey: 'battleSkill',
        baseSkillKey: 'battleSkill',
        replacementSkillKeys: ['battleSkillVariant'],
      }),
    );

    const explicit = placeSkillGroup({
      scenario: baseScenario,
      trackIndex: 0,
      operator,
      skillGroupKey: 'battleSkill',
      skillKey: 'battleSkillVariant',
      startFrame: 90,
      ids: { allocate: kind => `${kind}:replacement` },
    }).scenario;
    const explicitCompiled = compileScenarioTimeline(explicit, {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });
    expect(explicitCompiled.inputs).toContainEqual({
      frame: 90,
      operatorId: 'track:0',
      skillId: 'battleSkillVariant',
      castId: 'skillCast:replacement',
    });
    expect(explicitCompiled.operators[0]!.skills).toContainEqual(
      expect.objectContaining({
        skillId: 'battleSkillVariant',
        castId: 'skillCast:replacement',
      }),
    );
  });

  it('keeps multiple placed inputs stable while sharing one runtime replacement slot', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    const base = requireSingleSkill('battleSkill');
    const comboInput = { ...base, key: 'battleSkillCombo' };
    const operator = {
      ...perlica,
      skillGroups: perlica.skillGroups.map(group =>
        group.key === 'battleSkill'
          ? {
              ...group,
              skills: [base, comboInput],
              replacementSkills: [{ ...base, key: 'battleSkillEnd' }],
            }
          : group,
      ),
    };

    const compiled = compileScenarioTimeline(scenario, {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });

    expect(compiled.operators[0]!.skillSlotGroups).toContainEqual(
      expect.objectContaining({
        skillGroupKey: 'battleSkill',
        baseSkillKey: 'battleSkill',
        stableInputSkillKeys: ['battleSkill', 'battleSkillCombo'],
        replacementSkillKeys: ['battleSkillEnd'],
      }),
    );
  });

  it('does not infer native default input slots from library presentation groups', () => {
    const scenario = createScenario();
    const basicGroup = perlica.skillGroups.find(group => group.skillType === 'basicAttack')!;
    const baseSkill = Array.isArray(basicGroup.skills) ? basicGroup.skills[0]! : basicGroup.skills;
    const operator = {
      ...perlica,
      skillGroups: [
        ...perlica.skillGroups,
        {
          key: 'enhancedBasicAttack',
          skillType: 'basicAttack' as const,
          levelSource: 'ultimate' as const,
          libraryPresentation: 'enhanced' as const,
          skills: [{ ...baseSkill, key: 'enhancedBasicAttack1' }],
        },
      ],
    };

    const compiled = compileScenarioTimeline(scenario, {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });

    expect(compiled.operators[0]!.skillSlotGroups!.filter(group => group.defaultForInput)).toEqual(
      [],
    );
    expect(compiled.operators[0]!.skillSlotGroups).toContainEqual(
      expect.objectContaining({
        skillGroupKey: 'enhancedBasicAttack',
        input: 'basicAttack',
      }),
    );
  });

  it('compiles a routed replacement with its execution type and level while keeping the slot identity', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    scenario.tracks[0]!.operator!.skillLevels.battleSkill = 3;
    scenario.tracks[0]!.operator!.skillLevels.comboSkill = 7;
    const routed: SkillDefinition = {
      key: 'battleSkillRoutedToCombo',
      sourceSkillId: 'native_combo',
      timelineBlockFrames: 1,
      costs: [{ resource: 'sp', value: [10, 20, 30, 40, 50, 60, 70] }],
      costFrame: 0,
      scheduledSequences: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'dealDamage',
                parameters: {
                  damageType: 'physical',
                  attackScale: [1, 2, 3, 4, 5, 6, 7],
                  tags: [],
                },
              },
            ],
          },
        },
      ],
    };
    const operator = {
      ...perlica,
      skillGroups: perlica.skillGroups.map(group =>
        group.key === 'battleSkill'
          ? {
              ...group,
              routedReplacementSkills: [
                {
                  skill: routed,
                  skillType: 'comboSkill' as const,
                  levelSource: 'comboSkill' as const,
                  executionSkillGroupKey: 'comboSkill',
                  executionSkillKey: 'comboSkill',
                },
              ],
            }
          : group,
      ),
    };

    const explicit = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator,
      skillGroupKey: 'battleSkill',
      skillKey: routed.key,
      startFrame: 90,
      ids: { allocate: kind => `${kind}:routed` },
    }).scenario;
    const compiled = compileScenarioTimeline(explicit, {
      getOperator: slug => (slug === operator.slug ? operator : null),
    });
    const variant = compiled.operators[0]!.skills.find(
      skill => skill.skillId === 'battleSkillRoutedToCombo',
    )!;

    expect(variant).toMatchObject({
      skillGroupKey: 'battleSkill',
      skillType: 'comboSkill',
      costs: [{ resource: 'sp', value: 70 }],
      executionSkillGroupKey: 'comboSkill',
      executionSkillId: 'comboSkill',
    });
    expect(variant.timelineActions[0]!.sequence.steps[0]).toMatchObject({
      kind: 'dealDamage',
      parameters: { attackScale: 7 },
    });
    expect(compiled.operators[0]!.skillSlotGroups).toContainEqual(
      expect.objectContaining({
        skillGroupKey: 'battleSkill',
        baseSkillKey: 'battleSkill',
        replacementSkillKeys: ['battleSkillRoutedToCombo'],
      }),
    );
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

  it('binds stable hit identities through root and ability-entity child sequences', () => {
    const scenario = place(createScenario(), 'battleSkill', 60);
    const cast = scenario.tracks[0]!.skillCasts[0]!;
    cast.customDefinition = {
      key: 'battleSkill',
      timelineBlockFrames: 30,
      scheduledSequences: [
        {
          startFrame: 5,
          sequence: {
            steps: [
              {
                key: 'root-hit',
                kind: 'dealDamage',
                parameters: { damageType: 'physical', attackScale: 1, tags: [] },
              },
              {
                kind: 'spawnAbilityEntity',
                parameters: {
                  abilityEntityId: 'ability:test',
                  dieWhenSourceDies: false,
                  inheritActionBlackboard: true,
                  definition: {
                    lifetime: { kind: 'limited', durationSeconds: 1 },
                    childSkill: {
                      skillId: 'child',
                      scheduledSequences: [
                        {
                          startFrame: 3,
                          sequence: {
                            steps: [
                              {
                                key: 'child-hit',
                                kind: 'dealFixedDamage',
                                parameters: { damageType: 'physical', value: 1, tags: [] },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    };

    const program = compileScenarioTimeline(scenario, index()).operators[0]!.skills[0]!;
    const root = program.timelineActions[0]!.sequence.steps[0]!;
    const spawn = program.timelineActions[0]!.sequence.steps[1]!;
    expect(root.hitId).toBe(deriveHitId(cast.id, 'root-hit'));
    expect(spawn.kind).toBe('spawnAbilityEntity');
    if (spawn.kind !== 'spawnAbilityEntity') throw new Error('expected spawn step');
    expect(
      spawn.parameters.definition!.childSkill?.timelineActions[0]?.sequence.steps[0]?.hitId,
    ).toBe(deriveHitId(cast.id, 'child-hit'));
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
