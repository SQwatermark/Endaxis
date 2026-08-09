import { ref, shallowRef } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { ScenarioEditorSession } from '../../application/editor/scenarioEditorSession';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument, TrackIndex } from '../../core/project/schema';
import { nextGameDataRepository } from '../../data/gameDataCatalog';
import { perlica } from '../../data/operators';
import { useTimelineLoadoutEditor } from './useTimelineLoadoutEditor';

function createEditor() {
  const initial = createEmptyScenario('scenario:loadout', '配装场景');
  const session = new ScenarioEditorSession(initial);
  const scenario = shallowRef<ScenarioDocument>(initial);
  session.subscribe(snapshot => {
    scenario.value = snapshot.scenario;
  });
  const selectedTrack = ref<TrackIndex>(0);
  const clearTimelineSelection = vi.fn();
  return {
    scenario,
    session,
    selectedTrack,
    clearTimelineSelection,
    editor: useTimelineLoadoutEditor({
      scenario,
      session,
      selectedTrack,
      clearTimelineSelection,
      gameData: nextGameDataRepository,
    }),
  };
}

describe('useTimelineLoadoutEditor', () => {
  it('空轨道切换会打开干员选择并清除技能选择', () => {
    const { editor, clearTimelineSelection } = createEditor();

    editor.selectTrack(0);

    expect(editor.operatorDialogTrack.value).toBe(0);
    expect(clearTimelineSelection).toHaveBeenCalledOnce();
  });

  it('选择干员只提交一次完整实例修改', () => {
    const { editor, scenario, session } = createEditor();
    editor.openOperatorDialog(0);

    editor.selectOperator(perlica.slug);

    expect(session.snapshot.revision).toBe(1);
    expect(session.snapshot.lastCommand).toBe('setTrackOperator');
    const buildId = scenario.value.tracks[0]?.operatorBuildId;
    expect(buildId).toBe(`operator:0:${perlica.slug}`);
    expect(scenario.value.builds.operators[buildId!]?.operatorSlug).toBe(perlica.slug);
    expect(editor.operatorDialogTrack.value).toBeNull();
  });

  it('没有干员的轨道不能打开武器或装备选择', () => {
    const { editor } = createEditor();

    editor.openWeaponDialog(0);
    editor.openGearDialog(0, 'armor');

    expect(editor.weaponDialogTrack.value).toBeNull();
    expect(editor.gearDialogTarget.value).toBeNull();
  });
});
