import { describe, expect, it } from 'vitest';
import { createEmptyProject, createEmptyScenario } from '../../core/project/createProject';
import { ProjectEditorSession } from '../../application/editor/projectEditorSession';
import { resetProjectScenarios } from './scenarioProjectCommands';

describe('scenario reset', () => {
  it('clears battle state without changing inherited copies and supports undo', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' });
    const current = project.scenarios[0]!;
    current.battle.cycleBoundaries = [{ id: 'boundary', frame: 30 }];
    current.tracks[0] = {
      id: 'track',
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 50 },
      skillCasts: [],
    };
    const dependent = createEmptyScenario('dependent', 'Dependent');
    dependent.inheritance = { sourceScenarioId: current.id, frame: 30 };
    project.scenarios.push(dependent);
    const session = new ProjectEditorSession(project);
    session.commit('reset', value => resetProjectScenarios(value, 'currentKeepLoadout'));
    const reset = session.snapshot.project;
    expect(reset.scenarios[0]!.tracks[0]!.id).toBe('track');
    expect(reset.scenarios[0]!.tracks[0]!.initialState.ultimateEnergy).toBe(0);
    expect(reset.scenarios[0]!.battle.cycleBoundaries).toEqual([]);
    expect(reset.scenarios[1]).toBe(dependent);
    expect(current.battle.cycleBoundaries).toHaveLength(1);
    session.undo();
    expect(session.snapshot.project).toBe(project);
    session.redo();
    expect(session.snapshot.project).toBe(reset);
  });

  it('resets all scenarios without deleting the project template library', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' });
    project.scenarios.push(createEmptyScenario('second', 'Second'));
    const reset = resetProjectScenarios(project, 'all');
    expect(reset.scenarios).toHaveLength(1);
    expect(reset.scenarios[0]!.tracks).toEqual([null, null, null, null]);
    expect(reset.definitionLibrary).toBe(project.definitionLibrary);
    expect(reset.activeScenarioId).toBe(project.activeScenarioId);
    expect(project.scenarios).toHaveLength(2);
  });
});
