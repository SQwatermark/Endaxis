<script setup lang="ts">
import { computed, onScopeDispose, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { RefreshLeft, RefreshRight } from '@element-plus/icons-vue';
import {
  getEnemyGameName,
  getOperatorCombatSkillName,
  getOperatorGameName,
} from '../legacy/legacyGameText';
import SkillLibraryCard from './components/SkillLibraryCard.vue';
import GearSelectionDialog from './components/GearSelectionDialog.vue';
import NextGearLoadoutBuildDialog from './components/NextGearLoadoutBuildDialog.vue';
import NextOperatorBuildDialog from './components/NextOperatorBuildDialog.vue';
import NextWeaponBuildDialog from './components/NextWeaponBuildDialog.vue';
import OperatorSelectionDialog from './components/OperatorSelectionDialog.vue';
import WeaponSelectionDialog from './components/WeaponSelectionDialog.vue';
import TimelineActionBlock from './components/TimelineActionBlock.vue';
import TimelineActionContextMenu from './components/TimelineActionContextMenu.vue';
import TimelineActionInspector from './components/TimelineActionInspector.vue';
import TimelineRuler from './components/TimelineRuler.vue';
import TimelineTrackHeader from './components/TimelineTrackHeader.vue';
import TimelineWorkbenchShell from './components/TimelineWorkbenchShell.vue';
import NextEnemySettingsPanel from './components/NextEnemySettingsPanel.vue';
import { createEmptyScenario } from '../../core/project/createProject';
import { ScenarioEditorSession } from '../../application/editor/scenarioEditorSession';
import {
  PROJECT_FPS,
  type EditableActionValues,
  type ScenarioDocument,
  type TrackIndex,
} from '../../core/project/schema';
import { nextGameDataRepository } from '../../data/gameDataCatalog';
import { perlica } from '../../data/operators';
import { placeSkillGroup, type TimelineDocumentIdAllocator } from './placeSkillGroup';
import {
  projectTimelineEditor,
  type TimelineSkillLibraryEntryViewModel,
} from './timelineEditorViewModel';
import { frameToTimelinePx, timelinePxToFrame, timelineTotalWidth } from './timelineGeometry';
import { useTimelineLoadoutEditor } from './useTimelineLoadoutEditor';
import { useTimelineEnemyEditor } from './useTimelineEnemyEditor';
import {
  moveSkillCast,
  removeSkillCast,
  updateSkillCastBasicField,
  updateSkillCastBooleanField,
  updateSkillCastColor,
  type BasicEditableSkillCastField,
} from './timelineDocumentCommands';

const { t, locale } = useI18n({ useScope: 'global' });
const pxPerFrame = 2;
const selectedTrack = ref<TrackIndex>(0);
const selectedCastId = ref<string | null>(null);
const cursorFrame = ref(30);
type TimelineDragPayload =
  | { kind: 'librarySkill'; skillGroupKey: string; skillKey?: string }
  | { kind: 'skillCast'; trackIndex: TrackIndex; skillCastId: string; pointerOffsetFrames: number };

const dragPayload = ref<TimelineDragPayload | null>(null);
const contextMenuTarget = ref<{
  x: number;
  y: number;
  trackIndex: TrackIndex;
  skillCastId: string;
} | null>(null);

function createSampleScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('next-sample:scenario:1', 'Next');
  scenario.battle.durationFrames = 900;
  scenario.builds.operators.perlica = {
    id: 'perlica',
    operatorSlug: perlica.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: {},
  };
  scenario.tracks[0] = {
    operatorBuildId: 'perlica',
    weaponBuildId: null,
    gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}

const scenarioSession = new ScenarioEditorSession(createSampleScenario());
const scenario = shallowRef(scenarioSession.snapshot.scenario);
const canUndo = ref(scenarioSession.canUndo);
const canRedo = ref(scenarioSession.canRedo);
const unsubscribeScenarioSession = scenarioSession.subscribe(snapshot => {
  scenario.value = snapshot.scenario;
  canUndo.value = scenarioSession.canUndo;
  canRedo.value = scenarioSession.canRedo;
});
onScopeDispose(unsubscribeScenarioSession);

function commitScenario(
  commandName: string,
  command: (current: ScenarioDocument) => ScenarioDocument,
) {
  scenarioSession.commit(commandName, command);
}

const {
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
} = useTimelineLoadoutEditor({
  scenario,
  session: scenarioSession,
  selectedTrack,
  selectedCastId,
  gameData: nextGameDataRepository,
});
const {
  enemies,
  selectedDefinition: selectedEnemyDefinition,
  selectCatalogEnemy,
  selectCustomEnemy,
  saveEnemyValues,
} = useTimelineEnemyEditor({
  scenario,
  session: scenarioSession,
  gameData: nextGameDataRepository,
  fps: PROJECT_FPS,
});
let nextDocumentId = 0;
const ids: TimelineDocumentIdAllocator = {
  allocate: kind => `${kind}:next-sample:${++nextDocumentId}`,
};
const viewModel = computed(() => projectTimelineEditor(scenario.value, nextGameDataRepository));
const selectedTrackModel = computed(() => viewModel.value.tracks[selectedTrack.value]!);
const selectedCastModel = computed(() => {
  if (selectedCastId.value === null) return null;
  for (const trackModel of viewModel.value.tracks) {
    const castModel = trackModel.skillCasts.find(cast => cast.id === selectedCastId.value);
    const cast = scenario.value.tracks[trackModel.trackIndex]?.skillCasts.find(
      candidate => candidate.id === selectedCastId.value,
    );
    if (castModel !== undefined && cast !== undefined) {
      return {
        trackIndex: trackModel.trackIndex,
        cast,
        skillType: castModel.skillType,
        label:
          cast.source.kind === 'operatorSkill'
            ? skillName(cast.source.skillGroupKey, trackModel.operatorSlug)
            : cast.source.kind === 'custom'
              ? cast.source.name
              : cast.source.skillKey,
      };
    }
  }
  return null;
});
const timelineWidth = computed(() =>
  timelineTotalWidth(
    scenario.value.battle.prepFrames,
    scenario.value.battle.durationFrames,
    pxPerFrame,
  ),
);
const cursorLeft = computed(() =>
  frameToTimelinePx(cursorFrame.value, scenario.value.battle.prepFrames, pxPerFrame),
);

function operatorName(slug: string | null): string {
  return slug === null ? t('nextTimeline.emptyTrack') : getOperatorGameName(slug, locale.value);
}

function enemyName(enemyId: string): string {
  return getEnemyGameName(enemyId, locale.value);
}

function skillName(groupKey: string, slug: string | null): string {
  return slug === null ? groupKey : getOperatorCombatSkillName(slug, groupKey, locale.value);
}

function skillTypeLabel(skillType: string): string {
  const displayType =
    skillType === 'basicAttack'
      ? 'attack'
      : skillType === 'battleSkill'
        ? 'skill'
        : skillType === 'comboSkill'
          ? 'link'
          : skillType === 'finisher'
            ? 'execution'
            : skillType === 'plungingAttack'
              ? 'dive'
              : skillType;
  return t(`skillType.${displayType}`);
}

function skillAccentColor(skillType: string): string {
  return (
    {
      basicAttack: '#aaaaaa',
      battleSkill: '#ffffff',
      comboSkill: '#fdd900',
      ultimate: '#00e5ff',
      finisher: '#a61d24',
      plungingAttack: '#69c0ff',
    }[skillType] ?? '#8c8c8c'
  );
}

function skillDisplayIcon(skillType: string): string {
  return ['basicAttack', 'finisher', 'plungingAttack'].includes(skillType)
    ? '/icons/icon_attack_pistol.webp'
    : '';
}

function skillDurationSeconds(entry: TimelineSkillLibraryEntryViewModel): number {
  const frames = entry.skills.reduce((total, skill) => total + skill.timelineBlockFrames, 0);
  return Math.round((frames / 30) * 1000) / 1000;
}

function skillSegments(entry: TimelineSkillLibraryEntryViewModel) {
  return entry.skills.map((skill, index) => ({
    id: skill.skillKey,
    label: `${index + 1}A`,
    selected: false,
    disabled: false,
  }));
}

function selectTimelinePosition(event: MouseEvent, trackIndex: TrackIndex): void {
  const lane = event.currentTarget as HTMLElement;
  cursorFrame.value = Math.max(
    0,
    Math.min(
      scenario.value.battle.durationFrames,
      timelinePxToFrame(
        event.clientX - lane.getBoundingClientRect().left,
        scenario.value.battle.prepFrames,
        pxPerFrame,
      ),
    ),
  );
  selectedTrack.value = trackIndex;
  selectedCastId.value = null;
}

function placeGroup(
  skillGroupKey: string,
  skillKey?: string,
  startFrame = cursorFrame.value,
  trackIndex = selectedTrack.value,
): void {
  const operatorSlug = viewModel.value.tracks[trackIndex]?.operatorSlug ?? null;
  const operator = operatorSlug === null ? null : nextGameDataRepository.getOperator(operatorSlug);
  if (operator === null) return;
  const result = placeSkillGroup({
    scenario: scenario.value,
    trackIndex,
    operator,
    skillGroupKey,
    ...(skillKey === undefined ? {} : { skillKey }),
    startFrame,
    ids,
  });
  commitScenario('placeSkillGroup', () => result.scenario);
  selectedTrack.value = trackIndex;
  selectedCastId.value = result.skillCastIds.at(-1) ?? null;
  const placed = result.scenario.tracks[trackIndex]?.skillCasts ?? [];
  const last = placed.at(-1);
  if (last !== undefined) {
    cursorFrame.value = last.placement.startFrame + last.editable.durationFrames;
  }
}

function beginSkillDrag(event: DragEvent, skillGroupKey: string, skillKey?: string): void {
  dragPayload.value = {
    kind: 'librarySkill',
    skillGroupKey,
    ...(skillKey === undefined ? {} : { skillKey }),
  };
  if (event.dataTransfer !== null) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', skillKey ?? skillGroupKey);
  }
}

function beginCastDrag(event: DragEvent, trackIndex: TrackIndex, skillCastId: string): void {
  const block = event.currentTarget as HTMLElement;
  const pointerOffsetFrames = Math.max(
    0,
    Math.round((event.clientX - block.getBoundingClientRect().left) / pxPerFrame),
  );
  dragPayload.value = { kind: 'skillCast', trackIndex, skillCastId, pointerOffsetFrames };
  if (event.dataTransfer !== null) event.dataTransfer.effectAllowed = 'move';
}

function dropTimelinePayload(event: DragEvent, trackIndex: TrackIndex): void {
  const payload = dragPayload.value;
  dragPayload.value = null;
  if (payload === null) return;
  const lane = event.currentTarget as HTMLElement;
  const pointerFrame = Math.max(
    0,
    Math.min(
      scenario.value.battle.durationFrames,
      timelinePxToFrame(
        event.clientX - lane.getBoundingClientRect().left,
        scenario.value.battle.prepFrames,
        pxPerFrame,
      ),
    ),
  );
  const frame =
    payload.kind === 'skillCast'
      ? Math.max(0, pointerFrame - payload.pointerOffsetFrames)
      : pointerFrame;
  cursorFrame.value = frame;
  if (payload.kind === 'librarySkill') {
    placeGroup(payload.skillGroupKey, payload.skillKey, frame, trackIndex);
    return;
  }
  if (payload.trackIndex !== trackIndex) return;
  commitScenario('moveSkillCast', current =>
    moveSkillCast(current, trackIndex, payload.skillCastId, frame),
  );
  selectedTrack.value = trackIndex;
  selectedCastId.value = payload.skillCastId;
}

function resetScenario(): void {
  commitScenario('resetScenario', () => createSampleScenario());
  selectedTrack.value = 0;
  selectedCastId.value = null;
  cursorFrame.value = 30;
  contextMenuTarget.value = null;
}

function restoreEditorHistory(direction: 'undo' | 'redo'): void {
  const restored = direction === 'undo' ? scenarioSession.undo() : scenarioSession.redo();
  if (!restored) return;
  selectedCastId.value = null;
  contextMenuTarget.value = null;
}

function openCastContextMenu(event: MouseEvent, trackIndex: TrackIndex, skillCastId: string): void {
  selectedTrack.value = trackIndex;
  selectedCastId.value = skillCastId;
  contextMenuTarget.value = { x: event.clientX, y: event.clientY, trackIndex, skillCastId };
}

function toggleContextCastField(field: 'locked' | 'disabled'): void {
  const target = contextMenuTarget.value;
  if (target === null) return;
  const cast = scenario.value.tracks[target.trackIndex]?.skillCasts.find(
    candidate => candidate.id === target.skillCastId,
  );
  if (cast === undefined) return;
  commitScenario('toggleSkillCastField', current =>
    updateSkillCastBooleanField(
      current,
      target.trackIndex,
      target.skillCastId,
      field,
      !cast.editable[field],
    ),
  );
  contextMenuTarget.value = null;
}

function deleteContextCast(): void {
  const target = contextMenuTarget.value;
  if (target === null) return;
  commitScenario('removeSkillCast', current =>
    removeSkillCast(current, target.trackIndex, target.skillCastId),
  );
  if (selectedCastId.value === target.skillCastId) selectedCastId.value = null;
  contextMenuTarget.value = null;
}

function setContextCastColor(color: string | null): void {
  const target = contextMenuTarget.value;
  if (target === null) return;
  commitScenario('updateSkillCastColor', current =>
    updateSkillCastColor(current, target.trackIndex, target.skillCastId, color),
  );
  contextMenuTarget.value = null;
}

function updateSelectedCast(
  field: BasicEditableSkillCastField,
  value: EditableActionValues[BasicEditableSkillCastField],
): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  commitScenario('updateSkillCastField', current =>
    updateSkillCastBasicField(current, selected.trackIndex, selected.cast.id, field, value),
  );
}
</script>

<template>
  <TimelineWorkbenchShell
    :labels="{
      library: t('timeline.activityBar.library'),
      globalConfig: t('timeline.activityBar.globalConfig'),
      contract: t('timeline.activityBar.contract'),
      resourceMonitor: t('timeline.activityBar.resourceMonitor'),
      inspector: t('timeline.activityBar.inspector'),
      battleLog: t('timeline.activityBar.battleLog'),
    }"
  >
    <template #left>
      <section class="skill-sidebar">
        <button class="operator-heading" type="button" @click="openOperatorDialog()">
          <span class="operator-heading__mark"></span>
          <strong>{{ operatorName(selectedTrackModel.operatorSlug) }}</strong>
        </button>
        <div class="sidebar-tabs">
          <button
            class="active"
            type="button"
            :disabled="selectedLoadoutModel.operator === null"
            @click="showOperatorBuildDialog = true"
          >
            {{ t('nextTimeline.operatorTab') }}
          </button>
          <button
            type="button"
            :disabled="selectedLoadoutModel.weapon === null"
            @click="showWeaponBuildDialog = true"
          >
            {{ t('nextTimeline.weaponTab') }}
          </button>
          <button
            type="button"
            :disabled="!Object.values(selectedLoadoutModel.gears).some(Boolean)"
            @click="showGearBuildDialog = true"
          >
            {{ t('nextTimeline.gearTab') }}
          </button>
        </div>
        <div class="library-heading">
          <strong>{{ t('nextTimeline.skillLibrary') }}</strong>
          <span>Lv.{{ selectedTrackModel.skillLibrary[0]?.level ?? 0 }}</span>
        </div>
        <div class="skill-list">
          <SkillLibraryCard
            v-for="entry in selectedTrackModel.skillLibrary"
            :key="entry.skillGroupKey"
            :name="skillName(entry.skillGroupKey, selectedTrackModel.operatorSlug)"
            :type-label="skillTypeLabel(entry.skillType)"
            :duration="skillDurationSeconds(entry)"
            :icon="skillDisplayIcon(entry.skillType)"
            :accent-color="skillAccentColor(entry.skillType)"
            :segments="skillSegments(entry)"
            @select="placeGroup(entry.skillGroupKey)"
            @select-segment="placeGroup(entry.skillGroupKey, $event)"
            @dragstart="beginSkillDrag($event, entry.skillGroupKey)"
            @dragstart-segment="beginSkillDrag($event.event, entry.skillGroupKey, $event.skillKey)"
          />
        </div>
      </section>
    </template>

    <template #left-bottom="{ tool }">
      <NextEnemySettingsPanel
        v-if="tool === 'enemy'"
        :enemy="scenario.enemy"
        :definition="selectedEnemyDefinition"
        :enemies="enemies"
        :fps="PROJECT_FPS"
        :name-of="enemyName"
        :labels="{
          all: t('common.all'),
          close: t('common.close'),
          confirm: t('common.confirm'),
          custom: t('resourceMonitor.enemy.custom'),
          customDescription: t('resourceMonitor.enemy.customDesc'),
          unknown: t('resourceMonitor.enemy.unknown'),
          clickToChange: t('resourceMonitor.enemy.clickToChange'),
          selectTitle: t('resourceMonitor.enemy.dialogTitle'),
          searchPlaceholder: t('resourceMonitor.enemy.searchPlaceholder'),
          level: t('resourceMonitor.enemy.level'),
          empty: t('resourceMonitor.enemy.empty'),
          editStats: t('resourceMonitor.enemy.editStats'),
          editStatsTitle: t('resourceMonitor.enemy.editStatsTitle'),
          enemyHp: t('resourceMonitor.labels.enemyHp'),
          defense: t('statDetail.defense'),
          finisherMultiplier: `${t('skillType.execution')}${t('hitDetail.multipliers')}`,
          maximumStagger: t('resourceMonitor.labels.maxStagger'),
          staggerNodes: t('resourceMonitor.labels.staggerNodes'),
          nodeDuration: t('resourceMonitor.labels.nodeDuration'),
          brokenDuration: t('resourceMonitor.labels.breakDuration'),
          finisherRecovery: t('resourceMonitor.labels.executionRecovery'),
          superArmor: t('resourceMonitor.labels.superArmor'),
          resistances: t('resourceMonitor.labels.resistanceTitle'),
          resistance: {
            physical: t('resourceMonitor.resistance.physical'),
            heat: t('resourceMonitor.resistance.heat'),
            cryo: t('resourceMonitor.resistance.cryo'),
            electric: t('resourceMonitor.resistance.electric'),
            nature: t('resourceMonitor.resistance.nature'),
          },
          tier: {
            normal: t('enemyTier.normal'),
            advanced: t('enemyTier.advanced'),
            elite: t('enemyTier.elite'),
            boss: t('enemyTier.boss'),
            leader: t('enemyTier.leader'),
          },
        }"
        @select-catalog="selectCatalogEnemy"
        @select-custom="selectCustomEnemy"
        @save="saveEnemyValues"
      />
      <div v-else class="empty-panel">{{ tool }}</div>
    </template>

    <template #header>
      <div class="scenario-tools">
        <button
          type="button"
          class="icon-button"
          :disabled="!canUndo"
          :title="t('timeline.shortcuts.items.undo')"
          @click="restoreEditorHistory('undo')"
        >
          <el-icon><RefreshLeft /></el-icon>
        </button>
        <button
          type="button"
          class="icon-button"
          :disabled="!canRedo"
          :title="t('timeline.shortcuts.items.redo')"
          @click="restoreEditorHistory('redo')"
        >
          <el-icon><RefreshRight /></el-icon>
        </button>
        <button type="button" class="icon-button" disabled title="重命名">✎</button>
        <button type="button" class="icon-button" disabled title="复制">▣</button>
        <div class="scenario-title">
          <span>[</span><strong>{{ scenario.name }}</strong
          ><span>]</span>
        </div>
        <button type="button" class="scenario-tab is-active">01</button>
        <button type="button" class="icon-button" disabled title="新增">+</button>
      </div>
      <div class="header-actions">
        <span>{{ t('nextTimeline.cursorFrame', { frame: cursorFrame }) }}</span>
        <button type="button" disabled :title="t('nextTimeline.simulationPending')">
          {{ t('nextTimeline.simulate') }}
        </button>
        <button type="button" @click="resetScenario">{{ t('nextTimeline.reset') }}</button>
      </div>
    </template>

    <div class="timeline-workspace">
      <div class="timeline-scroll">
        <div class="timeline-surface" :style="{ width: `${180 + timelineWidth}px` }">
          <div class="corner-placeholder">
            <span class="corner-tools">⚡　⊕　⌗</span>
            <span class="zoom-label">SCALE　100%</span>
          </div>
          <TimelineRuler
            class="timeline-ruler"
            :style="{ width: `${timelineWidth}px` }"
            :prep-frames="scenario.battle.prepFrames"
            :duration-frames="scenario.battle.durationFrames"
            :cursor-frame="cursorFrame"
            :px-per-frame="pxPerFrame"
            @seek="cursorFrame = $event"
          />

          <div
            v-for="track in viewModel.tracks"
            :key="track.trackIndex"
            class="track-row"
            :class="{ selected: selectedTrack === track.trackIndex }"
          >
            <TimelineTrackHeader
              class="track-identity"
              :track="track"
              :name="operatorName(track.operatorSlug)"
              :selected="selectedTrack === track.trackIndex"
              :weapon-icon="loadoutModels[track.trackIndex]?.weapon?.definition.iconPath ?? null"
              :gear-icons="{
                armor: loadoutModels[track.trackIndex]?.gears.armor?.definition.iconPath ?? null,
                gloves: loadoutModels[track.trackIndex]?.gears.gloves?.definition.iconPath ?? null,
                accessory1:
                  loadoutModels[track.trackIndex]?.gears.accessory1?.definition.iconPath ?? null,
                accessory2:
                  loadoutModels[track.trackIndex]?.gears.accessory2?.definition.iconPath ?? null,
              }"
              :labels="{
                weapon: t('timelineGrid.track.selectWeaponTooltip'),
                armor: t('timelineGrid.equipmentSlot.armor'),
                gloves: t('timelineGrid.equipmentSlot.gloves'),
                accessory1: t('timelineGrid.equipmentSlot.accessory1'),
                accessory2: t('timelineGrid.equipmentSlot.accessory2'),
              }"
              @select="selectTrack(track.trackIndex)"
              @weapon="openWeaponDialog(track.trackIndex)"
              @gear="openGearDialog(track.trackIndex, $event)"
            />
            <div
              class="track-lane"
              :style="{ width: `${timelineWidth}px` }"
              @click="selectTimelinePosition($event, track.trackIndex)"
              @dragover.prevent
              @drop.prevent="dropTimelinePayload($event, track.trackIndex)"
            >
              <div
                class="prep-zone"
                :style="{ width: `${scenario.battle.prepFrames * pxPerFrame}px` }"
              ></div>
              <div
                class="battle-start-line"
                :style="{ left: `${scenario.battle.prepFrames * pxPerFrame}px` }"
              ></div>
              <div class="cursor-line" :style="{ left: `${cursorLeft}px` }"></div>
              <TimelineActionBlock
                v-for="cast in track.skillCasts"
                :key="cast.id"
                :label="
                  cast.source.kind === 'operatorSkill'
                    ? skillName(cast.source.skillGroupKey, track.operatorSlug)
                    : cast.source.kind
                "
                :skill-type="cast.skillType"
                :left="frameToTimelinePx(cast.startFrame, scenario.battle.prepFrames, pxPerFrame)"
                :width="cast.durationFrames * pxPerFrame"
                :selected="selectedCastId === cast.id"
                :disabled="cast.disabled"
                :locked="cast.locked"
                :color="cast.color"
                @select="
                  selectedTrack = track.trackIndex;
                  selectedCastId = cast.id;
                "
                @dragstart="beginCastDrag($event, track.trackIndex, cast.id)"
                @contextmenu="openCastContextMenu($event, track.trackIndex, cast.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #bottom="{ tool }"
      ><div class="empty-panel">{{ tool }}</div></template
    >
    <template #right="{ tool }">
      <TimelineActionInspector
        v-if="tool === 'inspector'"
        :cast="selectedCastModel?.cast ?? null"
        :label="selectedCastModel?.label ?? ''"
        :skill-type="selectedCastModel?.skillType ?? null"
        @update="updateSelectedCast"
      />
      <div v-else class="empty-panel">{{ tool }}</div>
    </template>
  </TimelineWorkbenchShell>
  <TimelineActionContextMenu
    :visible="contextMenuTarget !== null"
    :x="contextMenuTarget?.x ?? 0"
    :y="contextMenuTarget?.y ?? 0"
    :label="selectedCastModel?.label ?? ''"
    :locked="selectedCastModel?.cast.editable.locked ?? false"
    :disabled="selectedCastModel?.cast.editable.disabled ?? false"
    :color="selectedCastModel?.cast.editable.color ?? null"
    @close="contextMenuTarget = null"
    @delete="deleteContextCast"
    @toggle-lock="toggleContextCastField('locked')"
    @toggle-disabled="toggleContextCastField('disabled')"
    @set-color="setContextCastColor"
  />
  <OperatorSelectionDialog
    :visible="operatorDialogTrack !== null"
    :operators="nextGameDataRepository.getOperators()"
    :selected-slugs="
      viewModel.tracks.flatMap(track => (track.operatorSlug === null ? [] : [track.operatorSlug]))
    "
    @close="operatorDialogTrack = null"
    @select="selectOperator"
    @clear="clearOperator"
  />
  <WeaponSelectionDialog
    :visible="weaponDialogTrack !== null"
    :weapons="selectableWeapons"
    :selected-slug="selectedWeaponSlug"
    :labels="{
      title: t('nextTimeline.weaponDialog.title'),
      searchPlaceholder: t('nextTimeline.weaponDialog.searchPlaceholder'),
      unequip: t('common.unequip'),
      close: t('common.close'),
      empty: t('nextTimeline.weaponDialog.empty'),
      partialSupport: t('nextTimeline.weaponDialog.partialSupport'),
    }"
    @close="weaponDialogTrack = null"
    @select="selectWeapon"
    @clear="clearWeapon"
  />
  <GearSelectionDialog
    :visible="gearDialogTarget !== null"
    :gears="selectableGears"
    :selected-slug="selectedGearSlug"
    :selected-artificing-levels="selectedGearBuild?.artificingLevels ?? []"
    :active-slot-key="gearDialogTarget?.slot ?? 'armor'"
    :labels="{
      title: t('timelineGrid.equipmentDialog.title', {
        slot: t(`timelineGrid.equipmentSlot.${gearDialogTarget?.slot ?? 'armor'}`),
      }),
      searchPlaceholder: t('timelineGrid.equipmentDialog.searchPlaceholder'),
      unequip: t('common.unequip'),
      close: t('common.close'),
      empty: t('timelineGrid.equipmentDialog.empty'),
      partialSupport: t('nextTimeline.gearDialog.partialSupport'),
      defense: t('nextTimeline.gearDialog.defense'),
      noSet: t('nextTimeline.gearDialog.noSet'),
    }"
    @close="gearDialogTarget = null"
    @select="selectGear"
    @clear="clearGear"
    @change-refine-tier="changeGearRefineTier"
  />
  <NextWeaponBuildDialog
    :visible="showWeaponBuildDialog"
    :weapon="selectedLoadoutModel.weapon"
    @update:visible="showWeaponBuildDialog = $event"
    @change="updateWeaponBuild"
  />
  <NextOperatorBuildDialog
    :visible="showOperatorBuildDialog"
    :operator="selectedLoadoutModel.operator"
    @update:visible="showOperatorBuildDialog = $event"
    @change="updateOperatorBuild"
  />
  <NextGearLoadoutBuildDialog
    :visible="showGearBuildDialog"
    :gears="selectedLoadoutModel.gears"
    @update:visible="showGearBuildDialog = $event"
    @update="updateGearBuild"
  />
</template>

<style scoped>
.scenario-tools,
.header-actions {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.scenario-tools {
  flex: 1;
  padding-left: 8px;
}

.header-actions {
  padding-right: 10px;
  color: var(--ea-fg-muted);
  font-size: 12px;
}

.scenario-title {
  width: 150px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--ea-fg);
  white-space: nowrap;
  overflow: hidden;
}

button {
  height: 28px;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-soft);
  color: inherit;
  padding: 0 9px;
  font: inherit;
  cursor: pointer;
}

button:hover:not(:disabled) {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}

button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

.icon-button {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
}

.scenario-tab {
  min-width: 40px;
  height: 24px;
  padding: 0 8px;
}

.scenario-tab.is-active {
  background: var(--ea-tab-active-bg);
  color: var(--ea-tab-active-fg);
}

.skill-sidebar {
  height: 100%;
  min-height: 0;
  padding: 15px;
  box-sizing: border-box;
  overflow-y: auto;
}

.operator-heading {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 18px;
  text-align: left;
}

.operator-heading__mark {
  width: 4px;
  height: 18px;
  background: var(--ea-gold);
}

.sidebar-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.sidebar-tabs button.active {
  color: var(--ea-gold);
  border-color: var(--ea-gold);
}

.library-heading {
  display: flex;
  justify-content: space-between;
  margin: 22px 4px 10px;
  color: var(--ea-fg-muted);
  font-size: 12px;
}

.skill-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.timeline-workspace,
.timeline-scroll {
  min-width: 0;
  min-height: 0;
}

.timeline-workspace {
  width: 100%;
  height: 100%;
}

.timeline-scroll {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.timeline-surface {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  background-image: linear-gradient(to right, var(--ea-grid-line) 1px, transparent 1px);
  background-size: 60px 100%;
}

.corner-placeholder {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 12;
  width: 180px;
  height: 76px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  box-sizing: border-box;
  padding: 8px;
  border-right: 1px solid var(--ea-border);
  border-bottom: 1px solid var(--ea-border);
  background: var(--ea-workbench-header);
}

.corner-tools {
  font-size: 11px;
  color: var(--ea-fg-muted);
}

.zoom-label {
  color: var(--ea-fg-subtle);
  font:
    8px/1 Consolas,
    monospace;
}

.timeline-ruler {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-top: -76px;
  margin-left: 180px;
}

.cursor-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--ea-fg);
  z-index: 4;
  pointer-events: none;
}

.track-row {
  position: relative;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  height: 160px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.track-row.selected {
  background: var(--ea-track-row-active);
}

.track-identity {
  position: sticky;
  left: 0;
  z-index: 6;
}

.track-lane {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.prep-zone {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--ea-prep-fill);
  pointer-events: none;
}

.battle-start-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--ea-mark-strong);
  pointer-events: none;
}

.empty-panel {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--ea-fg-muted);
  font-size: 12px;
}
</style>
