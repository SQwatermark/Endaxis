import { describe, expect, it } from 'vitest';
import { createEmptyProject } from './createProject';
import {
  inspectProjectInput,
  parseProjectDocument,
  serializeProjectDocument,
} from './serialization';
import type { TrackDocument } from './schema';
import { validateProjectDocument } from './validation';

function createTrack(): TrackDocument {
  return {
    operatorBuildId: 'operator:1',
    weaponBuildId: null,
    gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
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
  });

  it('rejects dangling build references', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'fixture',
    });
    project.scenarios[0]!.tracks[0] = createTrack();

    const result = validateProjectDocument(project);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toContainEqual({
        path: '$.scenarios[0].tracks[0].operatorBuildId',
        message: 'unknown operator build',
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
    scenario.builds.operators['operator:1'] = {
      id: 'operator:1',
      operatorSlug: 'perlica',
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: {},
      talentStates: {},
    };
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
            endFrame: 8,
            edited: [],
            sequence: {
              steps: [
                {
                  kind: 'applyBuff',
                  parameters: {
                    buffId: 'electric-infliction',
                    target: 'enemy',
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
      expect(sequence.map(step => step.kind)).toEqual(['applyBuff', 'dealDamage', 'conditional']);
      const branch = sequence[2];
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
    mismatchedParameters.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[1].parameters =
      { buffId: 'not-damage-parameters', target: 'enemy' };
    const mismatchedResult = parseProjectDocument(mismatchedParameters);
    expect(mismatchedResult.ok).toBe(false);
    if (!mismatchedResult.ok && mismatchedResult.kind === 'invalid-document') {
      expect(mismatchedResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.parameters.damageType') }),
      );
    }

    const invalidDamageTag = JSON.parse(serializeProjectDocument(project));
    invalidDamageTag.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[1].parameters.tags =
      ['unknownDamageTag'];
    const invalidDamageTagResult = validateProjectDocument(invalidDamageTag);
    expect(invalidDamageTagResult.ok).toBe(false);
    if (!invalidDamageTagResult.ok) {
      expect(invalidDamageTagResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.parameters.tags[0]') }),
      );
    }

    const invalidCondition = JSON.parse(serializeProjectDocument(project));
    invalidCondition.scenarios[0].tracks[0].skillCasts[0].editable.scheduledSequences[0].sequence.steps[2].parameters.condition.operator =
      'approximately';
    const invalidConditionResult = validateProjectDocument(invalidCondition);
    expect(invalidConditionResult.ok).toBe(false);
    if (!invalidConditionResult.ok) {
      expect(invalidConditionResult.issues).toContainEqual(
        expect.objectContaining({ path: expect.stringContaining('.condition.operator') }),
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
