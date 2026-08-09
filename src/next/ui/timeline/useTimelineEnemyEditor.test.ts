import { shallowRef } from 'vue';
import { describe, expect, it } from 'vitest';
import { ScenarioEditorSession } from '../../application/editor/scenarioEditorSession';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument } from '../../core/project/schema';
import { nextGameDataRepository } from '../../data/gameDataCatalog';
import { useTimelineEnemyEditor } from './useTimelineEnemyEditor';

function createEditor() {
  const initial = createEmptyScenario('scenario:enemy', '敌人场景');
  const session = new ScenarioEditorSession(initial);
  const scenario = shallowRef<ScenarioDocument>(initial);
  session.subscribe(snapshot => {
    scenario.value = snapshot.scenario;
  });
  return {
    scenario,
    session,
    editor: useTimelineEnemyEditor({
      scenario,
      session,
      gameData: nextGameDataRepository,
      fps: 30,
    }),
  };
}

describe('useTimelineEnemyEditor', () => {
  it('选择目录敌人会提交一次完整实例', () => {
    const { editor, scenario, session } = createEditor();

    editor.selectCatalogEnemy('eny-0125-fdcentur', 90);

    expect(session.snapshot.revision).toBe(1);
    expect(session.snapshot.lastCommand).toBe('setScenarioEnemy');
    expect(scenario.value.enemy.source).toEqual({
      kind: 'catalog',
      enemyId: 'eny-0125-fdcentur',
      level: 90,
    });
    expect(editor.selectedDefinition.value?.id).toBe('eny-0125-fdcentur');
  });

  it('确认一组属性修改只产生一次会话修订', () => {
    const { editor, scenario, session } = createEditor();
    const values = structuredClone(scenario.value.enemy.editable);
    values.hp = 200000;
    values.stagger.maximum = 500;

    editor.saveEnemyValues(values);

    expect(session.snapshot.revision).toBe(1);
    expect(scenario.value.enemy.edited).toEqual(['hp', 'stagger.maximum']);
  });

  it('切换自定义敌人不会伪造目录身份', () => {
    const { editor, scenario } = createEditor();

    editor.selectCustomEnemy(80);

    expect(scenario.value.enemy.source).toEqual({ kind: 'custom', level: 80 });
    expect(editor.selectedDefinition.value).toBeNull();
  });
});
