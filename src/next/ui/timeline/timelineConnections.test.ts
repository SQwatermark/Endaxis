import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument, SkillCastDocument } from '../../core/project/schema';
import {
  createDamageHitConnection,
  createSkillCastConnection,
  removeTimelineConnection,
} from './timelineConnections';

function cast(id: string, scheduledHitId?: string): SkillCastDocument {
  return {
    id,
    source: { kind: 'custom', actionType: 'test', name: id },
    placement: { startFrame: 0 },
    editable: {
      durationFrames: 30,
      cooldownFrames: 0,
      comboFollowupDelayFrames: 0,
      triggerWindowFrames: 0,
      spCost: 0,
      ultimateEnergyCost: 0,
      locked: false,
      disabled: false,
      color: null,
      scheduledSequences:
        scheduledHitId === undefined
          ? []
          : [
              {
                id: `${id}:sequence`,
                startFrame: 5,
                sequence: {
                  steps: [
                    {
                      kind: 'dealDamage',
                      parameters: { damageType: 'physical', attackScale: 1, tags: [] },
                      hitId: scheduledHitId,
                      edited: [],
                    },
                  ],
                },
                edited: [],
              },
            ],
      customBars: [],
    },
    edited: [],
  };
}

function scenarioWithCasts(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:1', 'test');
  scenario.tracks[0] = {
    operatorBuildId: 'operator:1',
    weaponBuildId: null,
    gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
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
    const connected = createDamageHitConnection(original, {
      id: 'connection:hit',
      fromSkillCastId: 'cast:1',
      fromPort: 'right',
      toSkillCastId: 'cast:2',
      toHitId: 'hit:2',
    });

    expect(connected.connections).toEqual([
      {
        id: 'connection:hit',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1', port: 'right' },
        to: { kind: 'damageHit', skillCastId: 'cast:2', hitId: 'hit:2' },
      },
    ]);
    expect(
      createDamageHitConnection(original, {
        id: 'connection:missing-hit',
        fromSkillCastId: 'cast:1',
        fromPort: 'right',
        toSkillCastId: 'cast:2',
        toHitId: 'hit:missing',
      }),
    ).toBe(original);
    expect(
      createDamageHitConnection(original, {
        id: 'connection:no-hits',
        fromSkillCastId: 'cast:1',
        fromPort: 'right',
        toSkillCastId: 'cast:1',
        toHitId: 'hit:2',
      }),
    ).toBe(original);
    expect(
      createDamageHitConnection(connected, {
        id: 'connection:duplicate',
        fromSkillCastId: 'cast:1',
        fromPort: 'left',
        toSkillCastId: 'cast:2',
        toHitId: 'hit:2',
      }),
    ).toBe(connected);
  });
});
