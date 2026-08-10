import { describe, expect, it } from 'vitest';
import { createEmptyProject, createEmptyScenario } from './createProject';
import {
  inspectProjectInput,
  parseProjectDocument,
  serializeProjectDocument,
} from './serialization';
import type { TrackDocument } from './schema';
import { validateProjectDocument } from './validation';

function createTrack(): TrackDocument {
  return {
    operator: {
      id: 'operator:1',
      operatorSlug: 'perlica',
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: {},
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
}

describe('V2 project document', () => {
  it('round-trips an empty project without adding runtime state', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });

    const json = serializeProjectDocument(project);
    const parsed = parseProjectDocument(json);

    expect(parsed).toEqual({ ok: true, value: project });
    expect(json).not.toContain('operatorStatus');
    expect(json).not.toContain('triggerEffects');
    expect(json).not.toContain('_expectedDamage');
    expect(json).not.toContain('initialEffects');
    expect(json).not.toContain('initialEnemyState');
  });

  it('round-trips frame-based cycle boundaries and control switches', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    const battle = project.scenarios[0]!.battle;
    battle.cycleBoundaries.push({ id: 'boundary:1', frame: 900 });
    battle.controlSwitches.push({ id: 'switch:1', frame: 180, trackIndex: 2 });

    const parsed = parseProjectDocument(serializeProjectDocument(project));

    expect(parsed).toEqual({ ok: true, value: project });
  });

  it('persists mechanic selections separately from global stat overrides', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    project.scenarios[0]!.mechanics.selections.push({
      id: 'mechanic-selection:1',
      mechanicId: 'season-tower:dungeon:indie_battletower001',
      enabled: true,
      parameters: { dmg_cnt: 20, damage_up: 0.5 },
    });

    const parsed = parseProjectDocument(serializeProjectDocument(project));

    expect(parsed).toEqual({ ok: true, value: project });
    expect(project.scenarios[0]!.globalConfig).toEqual({ modifiers: [] });
  });

  it('rejects malformed and duplicate mechanic selections', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    const scenario = project.scenarios[0]!;
    scenario.mechanics.selections.push(
      { id: 'selection:1', mechanicId: 'mechanic:1', enabled: true, parameters: {} },
      { id: 'selection:1', mechanicId: 'mechanic:2', enabled: true, parameters: {} },
    );
    const malformed = structuredClone(project) as unknown as {
      scenarios: Array<{
        mechanics: {
          selections: Array<{ parameters: Record<string, unknown> }>;
        };
      }>;
    };
    malformed.scenarios[0]!.mechanics.selections[0]!.parameters.invalid = null;

    const result = validateProjectDocument(malformed);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toEqual(
        expect.arrayContaining([
          {
            path: '$.scenarios[0].mechanics.selections[1].id',
            message: 'duplicate mechanic selection id',
          },
          {
            path: '$.scenarios[0].mechanics.selections[0].parameters.invalid',
            message: 'expected a boolean, finite number, or string',
          },
        ]),
      );
    }
  });

  it('persists scenario inheritance as a boundary reference instead of a runtime snapshot', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    const source = project.scenarios[0]!;
    source.battle.cycleBoundaries.push({ id: 'boundary:1', frame: 900 });
    const inherited = createEmptyScenario('scenario:2', 'Inherited');
    inherited.inheritance = {
      sourceScenarioId: source.id,
      boundaryId: 'boundary:1',
    };
    project.scenarios.push(inherited);

    const parsed = parseProjectDocument(serializeProjectDocument(project));

    expect(parsed).toEqual({ ok: true, value: project });
  });

  it('rejects dangling and cyclic scenario inheritance', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    const first = project.scenarios[0]!;
    first.battle.cycleBoundaries.push({ id: 'boundary:1', frame: 300 });
    const second = createEmptyScenario('scenario:2', 'Second');
    second.battle.cycleBoundaries.push({ id: 'boundary:2', frame: 600 });
    first.inheritance = { sourceScenarioId: second.id, boundaryId: 'boundary:2' };
    second.inheritance = { sourceScenarioId: first.id, boundaryId: 'boundary:missing' };
    project.scenarios.push(second);

    const result = validateProjectDocument(project);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toEqual(
        expect.arrayContaining([
          {
            path: '$.scenarios[1].inheritance.boundaryId',
            message: 'unknown cycle boundary',
          },
          {
            path: '$.scenarios[0].inheritance',
            message: 'scenario inheritance must be acyclic',
          },
        ]),
      );
    }
  });

  it('rejects malformed values across loadout instances, battle, enemy, and editor state', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    const scenario = project.scenarios[0]!;
    scenario.tracks[0] = createTrack();

    const malformed = JSON.parse(serializeProjectDocument(project));
    malformed.scenarios[0].tracks[0].operator.promoted = 'yes';
    malformed.scenarios[0].enemy.editable.finisherMultiplier = 'one';
    malformed.scenarios[0].battle.controlSwitches.push({
      id: 'switch:invalid',
      frame: 30,
      trackIndex: 4,
    });
    malformed.scenarios[0].editor.trackHeightWeights = [1, 1, 1];
    malformed.scenarios[0].globalConfig.modifiers.push({
      id: 'modifier:1',
      kind: 'operatorStat',
      modifier: 'skillCooldownReduction',
      value: 50,
    });

    const result = validateProjectDocument(malformed);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toEqual(
        expect.arrayContaining([
          {
            path: '$.scenarios[0].tracks[0].operator.promoted',
            message: 'expected a boolean',
          },
          {
            path: '$.scenarios[0].enemy.editable.finisherMultiplier',
            message: 'expected a finite number',
          },
          {
            path: '$.scenarios[0].battle.controlSwitches[0].trackIndex',
            message: 'expected a track index from 0 to 3',
          },
          {
            path: '$.scenarios[0].editor.trackHeightWeights',
            message: 'expected exactly four weights',
          },
          {
            path: '$.scenarios[0].globalConfig.modifiers[0].skillType',
            message: 'skill cooldown reduction requires a skill type',
          },
        ]),
      );
    }
  });

  it('rejects duplicate operator instance ids across tracks', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    project.scenarios[0]!.tracks[0] = createTrack();
    project.scenarios[0]!.tracks[1] = createTrack();

    const result = validateProjectDocument(project);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual({
        path: '$.scenarios[0].tracks[1].operator.id',
        message: 'duplicate operator instance id',
      });
    }
  });

  it('rejects dangling connection endpoints', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    project.scenarios[0]!.connections.push({
      id: 'connection:1',
      consumption: false,
      from: { kind: 'skillCast', skillCastId: 'missing:1' },
      to: { kind: 'skillCast', skillCastId: 'missing:2' },
    });

    const result = validateProjectDocument(project);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.filter(issue => issue.message === 'unknown skill cast reference'),
      ).toHaveLength(2);
    }
  });

  it('preserves native sequence order instead of using before/after damage flags', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    const scenario = project.scenarios[0]!;
    const track = createTrack();
    track.skillCasts.push({
      id: 'cast:1',
      source: {
        kind: 'operatorSkill',
        skillGroupKey: 'battleSkill',
        skillKey: 'battleSkill',
      },
      placement: { startFrame: 30 },
      editable: {
        durationFrames: 30,
        locked: false,
        disabled: false,
        scheduledSequences: [
          {
            id: 'timeline:1',
            startFrame: 8,
            edited: [],
            sequence: {
              steps: [
                {
                  kind: 'applyBuff',
                  parameters: {
                    buffId: 'electric-infliction',
                    target: 'party',
                  },
                  edited: [],
                },
                {
                  kind: 'calculateActionValue',
                  parameters: {
                    key: 'result',
                    operation: 'multiply',
                    left: { kind: 'blackboard', key: 'base' },
                    right: { kind: 'constant', value: 1.5 },
                  },
                  edited: [],
                },
                {
                  kind: 'dealDamage',
                  hitId: 'hit:1',
                  parameters: {
                    damageType: 'electric',
                    attackScale: 1.78,
                    tags: ['normalSkill'],
                    stagger: 10,
                  },
                  edited: [],
                },
                {
                  kind: 'conditional',
                  parameters: {
                    condition: {
                      kind: 'deckAttributeCompare',
                      left: 'intellect',
                      operator: 'greaterOrEqual',
                      right: 'will',
                    },
                  },
                  edited: [],
                  whenTrue: {
                    steps: [
                      {
                        kind: 'setContextFlag',
                        parameters: { flag: 'operatorForm', value: 'intellect', target: 'caster' },
                        edited: [],
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        customBars: [],
      },
      edited: [],
    });
    scenario.tracks[0] = track;
    scenario.connections.push({
      id: 'connection:hit',
      consumption: false,
      from: { kind: 'damageHit', skillCastId: 'cast:1', hitId: 'hit:1' },
      to: { kind: 'skillCast', skillCastId: 'cast:1' },
    });

    const parsed = parseProjectDocument(serializeProjectDocument(project));

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const sequence =
        parsed.value.scenarios[0]!.tracks[0]!.skillCasts[0]!.editable.scheduledSequences[0]!
          .sequence.steps;
      expect(sequence.map(step => step.kind)).toEqual([
        'applyBuff',
        'calculateActionValue',
        'dealDamage',
        'conditional',
      ]);
      const branch = sequence[3];
      expect(branch?.kind).toBe('conditional');
      if (branch?.kind === 'conditional') {
        expect(branch.whenTrue.steps[0]?.kind).toBe('setContextFlag');
      }
      expect(parsed.value.scenarios[0]?.connections[0]?.from).toEqual({
        kind: 'damageHit',
        skillCastId: 'cast:1',
        hitId: 'hit:1',
      });
      expect(JSON.stringify(sequence)).not.toContain('beforeDamage');
      expect(JSON.stringify(sequence)).not.toContain('afterDamage');
    }

    const fixedDamage = JSON.parse(serializeProjectDocument(project));
    const fixedDamageStep =
      fixedDamage.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence
        .steps[2];
    fixedDamageStep.kind = 'dealFixedDamage';
    fixedDamageStep.parameters = {
      damageType: 'physical',
      value: 0.01,
      tags: ['ultimateSkill'],
    };
    expect(validateProjectDocument(fixedDamage).ok).toBe(true);

    const invalidKind = JSON.parse(serializeProjectDocument(project));
    invalidKind.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[0].kind =
      'unknownStep';
    const invalidKindResult = parseProjectDocument(invalidKind);
    expect(invalidKindResult.ok).toBe(false);
    if (!invalidKindResult.ok && invalidKindResult.kind === 'invalid-document') {
      expect(invalidKindResult.issues).toContainEqual(
        expect.objectContaining({ message: 'unknown combat step kind' }),
      );
    }

    const mismatchedParameters = JSON.parse(serializeProjectDocument(project));
    mismatchedParameters.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[2].parameters =
      { buffId: 'not-damage-parameters', target: 'enemy' };
    const mismatchedResult = parseProjectDocument(mismatchedParameters);
    expect(mismatchedResult.ok).toBe(false);
    if (!mismatchedResult.ok && mismatchedResult.kind === 'invalid-document') {
      expect(mismatchedResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.parameters.damageType') }),
      );
    }

    const invalidStagger = JSON.parse(serializeProjectDocument(project));
    invalidStagger.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps.push(
      { kind: 'dealStagger', parameters: { value: 'invalid' }, edited: [] },
    );
    const invalidStaggerResult = parseProjectDocument(invalidStagger);
    expect(invalidStaggerResult.ok).toBe(false);
    if (!invalidStaggerResult.ok && invalidStaggerResult.kind === 'invalid-document') {
      expect(invalidStaggerResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.parameters.value') }),
      );
    }

    const invalidDamageTag = JSON.parse(serializeProjectDocument(project));
    invalidDamageTag.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[2].parameters.tags =
      ['unknownDamageTag'];
    const invalidDamageTagResult = validateProjectDocument(invalidDamageTag);
    expect(invalidDamageTagResult.ok).toBe(false);
    if (!invalidDamageTagResult.ok) {
      expect(invalidDamageTagResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.parameters.tags[0]') }),
      );
    }

    const invalidCondition = JSON.parse(serializeProjectDocument(project));
    invalidCondition.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[3].parameters.condition.operator =
      'approximately';
    const invalidConditionResult = validateProjectDocument(invalidCondition);
    expect(invalidConditionResult.ok).toBe(false);
    if (!invalidConditionResult.ok) {
      expect(invalidConditionResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.condition.operator') }),
      );
    }

    const invalidHealthCondition = JSON.parse(serializeProjectDocument(project));
    invalidHealthCondition.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[3].parameters.condition =
      {
        kind: 'healthCompare',
        target: 'enemy',
        valueType: 'percentage',
        operator: 'greater',
        value: { kind: 'constant', value: 0 },
      };
    const invalidHealthConditionResult = validateProjectDocument(invalidHealthCondition);
    expect(invalidHealthConditionResult.ok).toBe(false);
    if (!invalidHealthConditionResult.ok) {
      expect(invalidHealthConditionResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.condition.valueType') }),
      );
    }

    const invalidCalculation = JSON.parse(serializeProjectDocument(project));
    invalidCalculation.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[1].parameters.operation =
      'floor';
    const invalidCalculationResult = validateProjectDocument(invalidCalculation);
    expect(invalidCalculationResult.ok).toBe(false);
    if (!invalidCalculationResult.ok) {
      expect(invalidCalculationResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.parameters.operation') }),
      );
    }

    const invalidResourceSource = JSON.parse(serializeProjectDocument(project));
    invalidResourceSource.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps.push(
      {
        kind: 'changeResource',
        parameters: {
          resource: 'ultimateEnergy',
          amount: 10,
          recipient: 'caster',
          spGainSource: 'normalAttack',
        },
        edited: [],
      },
    );
    const invalidResourceSourceResult = validateProjectDocument(invalidResourceSource);
    expect(invalidResourceSourceResult.ok).toBe(false);
    if (!invalidResourceSourceResult.ok) {
      expect(invalidResourceSourceResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.parameters.spGainSource') }),
      );
    }

    const invalidUltimateOption = JSON.parse(serializeProjectDocument(project));
    invalidUltimateOption.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps.push(
      {
        kind: 'changeResource',
        parameters: {
          resource: 'sp',
          amount: 10,
          recipient: 'team',
          ultimateRecoveryTagId: 264623624,
        },
        edited: [],
      },
    );
    const invalidUltimateOptionResult = validateProjectDocument(invalidUltimateOption);
    expect(invalidUltimateOptionResult.ok).toBe(false);
    if (!invalidUltimateOptionResult.ok) {
      expect(invalidUltimateOptionResult.issues).toContainEqual(
        expect.objectContaining({
          path: expect.stringContaining('.parameters.ultimateRecoveryTagId'),
        }),
      );
    }

    const invalidHitReference = JSON.parse(serializeProjectDocument(project));
    invalidHitReference.scenarios[0].connections[0].from.hitId = 'missing:hit';
    const invalidHitReferenceResult = validateProjectDocument(invalidHitReference);
    expect(invalidHitReferenceResult.ok).toBe(false);
    if (!invalidHitReferenceResult.ok) {
      expect(invalidHitReferenceResult.issues).toContainEqual({
        path: '$.scenarios[0].connections[0].from.hitId',
        message: 'unknown damage hit reference',
      });
    }
  });

  it('recognizes the existing project envelope as legacy input', () => {
    const legacy = {
      version: '1.0.0',
      scenarioList: [{ id: 'default_sc', name: 'Scenario 1', data: null }],
    };

    expect(inspectProjectInput(legacy)).toEqual({ kind: 'legacy' });
    expect(parseProjectDocument(legacy)).toMatchObject({ ok: false, kind: 'legacy' });
  });

  it('loads migrated legacy input through the same validation boundary', () => {
    const legacy = { version: '1.0.0', scenarioList: [] };
    const migrated = createEmptyProject({
      createdWith: 'migration-test',
      gameDataRevision: 'fixture',
    });

    const result = parseProjectDocument(legacy, {
      legacyImporter: {
        migrate: () => ({ ok: true, value: migrated, warnings: [] }),
      },
    });

    expect(result).toEqual({ ok: true, value: migrated });
  });
});
