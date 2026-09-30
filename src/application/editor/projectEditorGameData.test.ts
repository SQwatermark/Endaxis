import { expect, it } from 'vitest';
import { createEmptyProject } from '../../core/project/createProject';
import { getProjectDefinitionLibrary } from '../../core/project/projectDefinitionLibrary';
import { CombatAttributeSet } from '../../core/combat/attributes/combatAttributes';
import { createProjectGameDataRepository } from '../../data/projectGameDataRepository';
import { GLOBAL_EFFECT_PRESETS } from '../../data/globalEffectPresets';
import { perlica } from '../../data/operators/perlica.generated';
import { createDefaultOperatorInstance } from './loadoutBuildFactory';
import { ProjectEditorSession, ActiveScenarioEditorSession } from './projectEditorSession';
import { saveProjectTemplateDefinition } from './projectTemplateCommands';
import { bindProjectEditorGameData } from './projectEditorGameData';
import { createEditorSimulationService } from '../simulation/editorSimulationService';
import {
  captureScenarioSimulationGameData,
  restoreScenarioSimulationGameData,
} from '../simulation/scenarioSimulationGameData';

it('页面持有的同一端口在保存、撤销、重做和换项目时先于场景观察更新，主线程与传输使用同一效果', async () => {
  const project = createEmptyProject({ createdWith: 'test' });
  project.scenarios[0]!.tracks[0] = {
    id: 'track:0',
    operator: createDefaultOperatorInstance(perlica),
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  const session = new ProjectEditorSession(project);
  const bound = bindProjectEditorGameData(await createProjectGameDataRepository(project), session);
  const scenarioSession = new ActiveScenarioEditorSession(session);
  const repository = bound.repository;
  const effectId = 'project:globalEffect:edited';
  const seen: unknown[] = [];
  scenarioSession.subscribe(() =>
    seen.push(repository.getGlobalEffect(effectId)?.buff.attributeModifiers?.[0]?.value),
  );
  const save = (value: number, replace: boolean) =>
    session.commit('saveEffect', current => {
      const next = saveProjectTemplateDefinition(
        current,
        {
          kind: 'globalEffect',
          definition: {
            ...GLOBAL_EFFECT_PRESETS[0],
            buff: {
              ...GLOBAL_EFFECT_PRESETS[0].buff,
              attributeModifiers: [
                { attribute: 'ComboSkillCooldownScalar', slot: 'finalMultiplier', value },
              ],
            },
          },
        },
        GLOBAL_EFFECT_PRESETS[0].id,
        effectId,
        '项目效果',
        replace,
        {},
      );
      return {
        ...next,
        scenarios: next.scenarios.map(scenario => ({
          ...scenario,
          globalConfig: { ...scenario.globalConfig, effects: [{ effectId, enabled: true }] },
        })),
      };
    });
  const check = (value: number) => {
    expect(bound.repository).toBe(repository);
    const scenario = session.snapshot.project.scenarios[0]!;
    const packet = captureScenarioSimulationGameData(scenario, repository);
    expect(packet.globalEffects.map(effect => effect.id)).toEqual([effectId]);
    for (const source of [repository, restoreScenarioSimulationGameData(structuredClone(packet))]) {
      const service = createEditorSimulationService(source);
      try {
        const combat = service.createInputCombatSession(scenario, -30);
        const operator = combat.runtime.readState().operators.get('track:0')!;
        expect(
          new CombatAttributeSet(operator.buffs!.attributes).get('ComboSkillCooldownScalar'),
        ).toBe(value);
      } finally {
        service.clearCache();
      }
    }
  };
  try {
    save(0.5, false);
    check(0.5);
    const oldPacket = captureScenarioSimulationGameData(
      session.snapshot.project.scenarios[0]!,
      repository,
    );
    save(0.25, true);
    check(0.25);
    expect(oldPacket.globalEffects[0]!.buff.attributeModifiers![0]!.value).toBe(0.5);
    session.undo();
    check(0.5);
    session.redo();
    check(0.25);
    session.replaceProject(project);
    expect(repository.getGlobalEffect(effectId)).toBeNull();
    expect(repository.getGlobalEffects().map(effect => effect.id)).toEqual([
      GLOBAL_EFFECT_PRESETS[0].id,
    ]);
    expect(seen).toEqual([0.5, 0.25, 0.5, 0.25, undefined]);
    bound.dispose();
    save(0.75, false);
    expect(
      getProjectDefinitionLibrary(session.snapshot.project).globalEffects![effectId],
    ).toBeDefined();
    expect(repository.getGlobalEffect(effectId)).toBeNull();
  } finally {
    scenarioSession.dispose();
    bound.dispose();
  }
});
