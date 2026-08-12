import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument, SkillCastDocument } from '../../core/project/schema';
import {
  createDamageHitConnection,
  createSkillCastConnection,
  removeTimelineConnection,
} from './timelineConnections';
import { projectCastHitMarkers } from './timelineHitProjection';

function cast(id: string, scheduledHitId?: string): SkillCastDocument {
  return {
    id,
    source: { kind: 'custom', actionType: 'test', name: id },
    placement: { startFrame: 0 },
    ...(scheduledHitId === undefined
      ? {}
      : {
          customDefinition: {
            key: id,
            timelineBlockFrames: 30,
            costs: [],
            scheduledSequences: [
              {
                startFrame: 5,
                sequence: {
                  steps: [
                    {
                      kind: 'dealDamage',
                      parameters: { damageType: 'physical', attackScale: 1, tags: [] },
                      key: scheduledHitId,
                    },
                  ],
                },
              },
            ],
          },
        }),
  };
}

function scenarioWithCasts(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:1', 'test');
  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
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
    skillCasts: [cast('cast:1'), cast('cast:2', 'hit:2')],
  };
  return scenario;
}

describe('timeline connections', () => {
  it('creates and removes a directed skill-cast connection', () => {
    const original = scenarioWithCasts();
    const connected = createSkillCastConnection(original, {
      id: 'connection:1',
      fromSkillCastId: 'cast:1',
      fromPort: 'right',
      toSkillCastId: 'cast:2',
      toPort: 'left',
    });

    expect(connected.connections).toEqual([
      {
        id: 'connection:1',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1', port: 'right' },
        to: { kind: 'skillCast', skillCastId: 'cast:2', port: 'left' },
      },
    ]);
    expect(removeTimelineConnection(connected, 'connection:1').connections).toEqual([]);
  });

  it('does not create dangling, self or duplicate connections', () => {
    const original = scenarioWithCasts();
    const connected = createSkillCastConnection(original, {
      id: 'connection:1',
      fromSkillCastId: 'cast:1',
      fromPort: 'right',
      toSkillCastId: 'cast:2',
      toPort: 'left',
    });

    expect(
      createSkillCastConnection(connected, {
        id: 'connection:2',
        fromSkillCastId: 'cast:1',
        fromPort: 'bottom',
        toSkillCastId: 'cast:2',
        toPort: 'top',
      }),
    ).toBe(connected);
    expect(
      createSkillCastConnection(original, {
        id: 'connection:self',
        fromSkillCastId: 'cast:1',
        fromPort: 'right',
        toSkillCastId: 'cast:1',
        toPort: 'left',
      }),
    ).toBe(original);
    expect(
      createSkillCastConnection(original, {
        id: 'connection:missing',
        fromSkillCastId: 'missing',
        fromPort: 'right',
        toSkillCastId: 'cast:2',
        toPort: 'left',
      }),
    ).toBe(original);
  });

  it('creates a connection to a documented damage hit and rejects invalid targets', () => {
    const original = scenarioWithCasts();
    const targetCast = original.tracks[0]!.skillCasts.find(candidate => candidate.id === 'cast:2')!;
    const targetMarkers = projectCastHitMarkers(targetCast, targetCast.customDefinition!);
    const connected = createDamageHitConnection(original, {
      id: 'connection:hit',
      fromSkillCastId: 'cast:1',
      fromPort: 'right',
      toSkillCastId: 'cast:2',
      toStepKey: 'hit:2',
      targetMarkers,
    });

    expect(connected.connections).toEqual([
      {
        id: 'connection:hit',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1', port: 'right' },
        to: { kind: 'damageHit', skillCastId: 'cast:2', stepKey: 'hit:2' },
      },
    ]);
    expect(
      createDamageHitConnection(original, {
        id: 'connection:missing-hit',
        fromSkillCastId: 'cast:1',
        fromPort: 'right',
        toSkillCastId: 'cast:2',
        toStepKey: 'hit:missing',
        targetMarkers,
      }),
    ).toBe(original);
    expect(
      createDamageHitConnection(original, {
        id: 'connection:no-hits',
        fromSkillCastId: 'cast:1',
        fromPort: 'right',
        toSkillCastId: 'cast:1',
        toStepKey: 'hit:2',
        targetMarkers,
      }),
    ).toBe(original);
    expect(
      createDamageHitConnection(connected, {
        id: 'connection:duplicate',
        fromSkillCastId: 'cast:1',
        fromPort: 'left',
        toSkillCastId: 'cast:2',
        toStepKey: 'hit:2',
        targetMarkers,
      }),
    ).toBe(connected);
  });
});
