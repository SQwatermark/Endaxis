import { describe, expect, it } from 'vitest';
import { createEmptyProject, createEmptyScenario } from '../../core/project/createProject';
import type { EndaxisProjectDocument } from '../../core/project/schema';
import { validateProjectDocument } from '../../core/project/validation';
import {
  addProjectScenario,
  deleteActiveScenario,
  duplicateActiveScenario,
  renameActiveScenario,
  switchProjectScenario,
} from './scenarioProjectCommands';

function project(): EndaxisProjectDocument {
  return createEmptyProject({
    projectId: 'test',
    createdWith: 'test',
    gameDataRevision: 'test',
  });
}

describe('scenario project commands', () => {
  it('renames, adds and switches scenarios without mutating the input', () => {
    const original = project();
    const renamed = renameActiveScenario(original, '  主方案  ');
    const added = addProjectScenario(renamed, '副方案');
    const switched = switchProjectScenario(added, renamed.activeScenarioId);

    expect(original.scenarios[0]?.name).toBe('Scenario 1');
    expect(renamed.scenarios[0]?.name).toBe('主方案');
    expect(added.scenarios).toHaveLength(2);
    expect(added.scenarios[1]?.name).toBe('副方案');
    expect(switched.activeScenarioId).toBe(renamed.activeScenarioId);
  });

  it('duplicates instance identities while preserving skill rule keys', () => {
    const original = project();
    const source = original.scenarios[0]!;
    source.tracks[0] = {
      id: 'track:old',
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [
        {
          id: 'cast:old',
          source: { kind: 'operatorSkill', skillGroupKey: 'group-key', skillKey: 'skill-key' },
          placement: { startFrame: 10 },
          presentation: {
            customBars: [{ id: 'bar:old', text: 'bar', offsetFrames: 0, durationFrames: 3 }],
          },
        },
      ],
    };
    source.connections.push({
      id: 'connection:old',
      consumption: false,
      from: { kind: 'skillCast', skillCastId: 'cast:old' },
      to: { kind: 'damageHit', skillCastId: 'cast:old', stepKey: 'damage:key' },
    });

    const result = duplicateActiveScenario(original, '副本');
    const copy = result.scenarios[1]!;
    const copiedCast = copy.tracks[0]!.skillCasts[0]!;
    expect(copy.id).not.toBe(source.id);
    expect(copy.tracks[0]!.id).not.toBe('track:old');
    expect(copiedCast.id).not.toBe('cast:old');
    expect(copiedCast.source).toEqual(source.tracks[0]!.skillCasts[0]!.source);
    expect(copiedCast.presentation?.customBars?.[0]?.id).not.toBe('bar:old');
    expect(copy.connections[0]?.from).toEqual({
      kind: 'skillCast',
      skillCastId: copiedCast.id,
    });
    expect(copy.connections[0]?.to).toEqual({
      kind: 'damageHit',
      skillCastId: copiedCast.id,
      stepKey: 'damage:key',
    });
    expect(validateProjectDocument(result)).toEqual({ ok: true, value: result });
  });

  it('refuses to delete a scenario referenced by inheritance', () => {
    const original = project();
    const source = original.scenarios[0]!;
    source.battle.cycleBoundaries.push({ id: 'cycle:1', frame: 30 });
    const child = createEmptyScenario('test:scenario:2', '继承方案');
    child.inheritance = { sourceScenarioId: source.id, boundaryId: 'cycle:1' };
    const withChild = { ...original, scenarios: [source, child] };

    expect(deleteActiveScenario(withChild)).toBe(withChild);
    const childActive = { ...withChild, activeScenarioId: child.id };
    const deleted = deleteActiveScenario(childActive);
    expect(deleted.scenarios).toEqual([source]);
    expect(deleted.activeScenarioId).toBe(source.id);
  });
});
