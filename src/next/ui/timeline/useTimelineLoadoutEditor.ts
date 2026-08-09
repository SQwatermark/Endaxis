/**
 * 协调时间轴页面中的干员、武器和装备选择与编辑。
 * 它只持有弹窗等临时 UI 状态，所有持久化修改都通过场景会话提交，目录筛选也集中在这里完成。
 */
import { computed, ref, type Ref } from 'vue';
import {
  createDefaultGearBuild,
  createDefaultOperatorBuild,
  createDefaultWeaponBuild,
} from '../../application/editor/loadoutBuildFactory';
import type {
  ScenarioCommand,
  ScenarioEditorSession,
} from '../../application/editor/scenarioEditorSession';
import type { GameDataBrowser, GameDataRepository } from '../../core/game-data/gameDataRepository';
import type { ScenarioDocument, TrackIndex } from '../../core/project/schema';
import {
  updateTrackGearBuild,
  updateTrackOperatorBuild,
  updateTrackWeaponBuild,
  type OperatorBuildChanges,
  type WeaponBuildChanges,
} from './loadoutBuildCommands';
import { projectTrackLoadoutBuilds } from './loadoutBuildViewModel';
import {
  setTrackGear,
  setTrackOperator,
  setTrackWeapon,
  type TrackGearSlot,
} from './timelineDocumentCommands';

type TimelineGameData = GameDataRepository & GameDataBrowser;

export interface TimelineLoadoutEditorOptions {
  readonly scenario: Readonly<Ref<ScenarioDocument>>;
  readonly session: ScenarioEditorSession;
  readonly selectedTrack: Ref<TrackIndex>;
  readonly clearTimelineSelection: () => void;
  readonly gameData: TimelineGameData;
}

export function useTimelineLoadoutEditor(options: TimelineLoadoutEditorOptions) {
  const operatorDialogTrack = ref<TrackIndex | null>(null);
  const weaponDialogTrack = ref<TrackIndex | null>(null);
  const gearDialogTarget = ref<{ trackIndex: TrackIndex; slot: TrackGearSlot } | null>(null);
  const showOperatorBuildDialog = ref(false);
  const showWeaponBuildDialog = ref(false);
  const showGearBuildDialog = ref(false);

  function commit(commandName: string, command: ScenarioCommand): void {
    options.session.commit(commandName, command);
  }

  const loadoutModels = computed(() =>
    options.scenario.value.tracks.map((_, trackIndex) =>
      projectTrackLoadoutBuilds(options.scenario.value, trackIndex as TrackIndex, options.gameData),
    ),
  );
  const selectedLoadoutModel = computed(() => loadoutModels.value[options.selectedTrack.value]!);
  const selectedWeaponSlug = computed(() => {
    const track = options.scenario.value.tracks[options.selectedTrack.value];
    if (track?.weaponBuildId == null) return null;
    return options.scenario.value.builds.weapons[track.weaponBuildId]?.weaponSlug ?? null;
  });
  const selectableWeapons = computed(() => {
    const operatorSlug = selectedLoadoutModel.value.operator?.definition.slug ?? null;
    const operator = operatorSlug === null ? null : options.gameData.getOperator(operatorSlug);
    if (operator === null) return [];
    return options.gameData
      .getWeapons()
      .filter(weapon => weapon.weaponType === operator.weaponType);
  });
  const selectedGearSlug = computed(() => {
    const target = gearDialogTarget.value;
    if (target === null) return null;
    const buildId =
      options.scenario.value.tracks[target.trackIndex]?.gearBuildIds[target.slot] ?? null;
    return buildId === null
      ? null
      : (options.scenario.value.builds.gears[buildId]?.gearSlug ?? null);
  });
  const selectableGears = computed(() => {
    const target = gearDialogTarget.value;
    if (target === null) return [];
    const slotType =
      target.slot === 'armor' || target.slot === 'gloves' ? target.slot : 'accessory';
    return options.gameData.getGears().filter(gear => gear.slotType === slotType);
  });
  const selectedGearBuild = computed(() => {
    const target = gearDialogTarget.value;
    return target === null
      ? null
      : (loadoutModels.value[target.trackIndex]?.gears[target.slot] ?? null);
  });

  function openOperatorDialog(trackIndex = options.selectedTrack.value): void {
    options.selectedTrack.value = trackIndex;
    options.clearTimelineSelection();
    operatorDialogTrack.value = trackIndex;
  }

  function selectTrack(trackIndex: TrackIndex): void {
    options.selectedTrack.value = trackIndex;
    const track = options.scenario.value.tracks[trackIndex];
    if (track?.operatorBuildId == null) openOperatorDialog(trackIndex);
  }

  function selectOperator(slug: string): void {
    const trackIndex = operatorDialogTrack.value;
    if (trackIndex === null) return;
    const operator = options.gameData.getOperator(slug);
    if (operator === null) throw new Error(`missing operator definition '${slug}'`);
    commit('setTrackOperator', current =>
      setTrackOperator(
        current,
        trackIndex,
        createDefaultOperatorBuild(`operator:${trackIndex}:${operator.slug}`, operator),
      ),
    );
    operatorDialogTrack.value = null;
  }

  function clearOperator(): void {
    const trackIndex = operatorDialogTrack.value;
    if (trackIndex === null) return;
    commit('clearTrackOperator', current => setTrackOperator(current, trackIndex, null));
    operatorDialogTrack.value = null;
  }

  function openWeaponDialog(trackIndex = options.selectedTrack.value): void {
    if (options.scenario.value.tracks[trackIndex]?.operatorBuildId == null) return;
    options.selectedTrack.value = trackIndex;
    options.clearTimelineSelection();
    weaponDialogTrack.value = trackIndex;
  }

  function selectWeapon(slug: string): void {
    const trackIndex = weaponDialogTrack.value;
    if (trackIndex === null) return;
    const weapon = options.gameData.getWeapon(slug);
    if (weapon === null) throw new Error(`missing weapon definition '${slug}'`);
    commit('setTrackWeapon', current =>
      setTrackWeapon(
        current,
        trackIndex,
        createDefaultWeaponBuild(`weapon:${trackIndex}:${weapon.slug}`, weapon),
      ),
    );
    weaponDialogTrack.value = null;
  }

  function clearWeapon(): void {
    const trackIndex = weaponDialogTrack.value;
    if (trackIndex === null) return;
    commit('clearTrackWeapon', current => setTrackWeapon(current, trackIndex, null));
    weaponDialogTrack.value = null;
  }

  function openGearDialog(
    trackIndex = options.selectedTrack.value,
    slot: TrackGearSlot = 'armor',
  ): void {
    if (options.scenario.value.tracks[trackIndex]?.operatorBuildId == null) return;
    options.selectedTrack.value = trackIndex;
    options.clearTimelineSelection();
    gearDialogTarget.value = { trackIndex, slot };
  }

  function selectGear(slug: string, artificingTier: number): void {
    const target = gearDialogTarget.value;
    if (target === null) return;
    const gear = options.gameData.getGear(slug);
    if (gear === null) throw new Error(`missing gear definition '${slug}'`);
    commit('setTrackGear', current =>
      setTrackGear(
        current,
        target.trackIndex,
        target.slot,
        createDefaultGearBuild(
          `gear:${target.trackIndex}:${target.slot}:${gear.slug}`,
          gear,
          artificingTier,
        ),
      ),
    );
  }

  function clearGear(): void {
    const target = gearDialogTarget.value;
    if (target === null) return;
    commit('clearTrackGear', current =>
      setTrackGear(current, target.trackIndex, target.slot, null),
    );
  }

  function changeGearRefineTier(artificingTier: number): void {
    const target = gearDialogTarget.value;
    const build = selectedGearBuild.value;
    if (target === null || build === null) return;
    commit('changeGearRefineTier', current =>
      updateTrackGearBuild(
        current,
        target.trackIndex,
        build.buildId,
        build.definition.traits.map(() => artificingTier),
      ),
    );
  }

  function updateWeaponBuild(changes: WeaponBuildChanges): void {
    commit('updateTrackWeaponBuild', current =>
      updateTrackWeaponBuild(current, options.selectedTrack.value, changes),
    );
  }

  function updateOperatorBuild(changes: OperatorBuildChanges): void {
    commit('updateTrackOperatorBuild', current =>
      updateTrackOperatorBuild(current, options.selectedTrack.value, changes),
    );
  }

  function updateGearBuild(
    _slot: TrackGearSlot,
    buildId: string,
    artificingLevels: readonly number[],
  ): void {
    commit('updateTrackGearBuild', current =>
      updateTrackGearBuild(current, options.selectedTrack.value, buildId, artificingLevels),
    );
  }

  return {
    operatorDialogTrack,
    weaponDialogTrack,
    gearDialogTarget,
    showOperatorBuildDialog,
    showWeaponBuildDialog,
    showGearBuildDialog,
    loadoutModels,
    selectedLoadoutModel,
    selectedWeaponSlug,
    selectableWeapons,
    selectedGearSlug,
    selectableGears,
    selectedGearBuild,
    openOperatorDialog,
    selectTrack,
    selectOperator,
    clearOperator,
    openWeaponDialog,
    selectWeapon,
    clearWeapon,
    openGearDialog,
    selectGear,
    clearGear,
    changeGearRefineTier,
    updateWeaponBuild,
    updateOperatorBuild,
    updateGearBuild,
  };
}
