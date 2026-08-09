<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  getGearPieceGameName,
  getOperatorCombatSkillName,
  getOperatorGameName,
} from '@/data/gameText';
import type { GearDefinition, WeaponDefinition } from '../../core/game-data/equipmentDefinition';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import SkillLibraryCard from './components/SkillLibraryCard.vue';
import GearSelectionDialog from './components/GearSelectionDialog.vue';
import OperatorSelectionDialog from './components/OperatorSelectionDialog.vue';
import WeaponSelectionDialog from './components/WeaponSelectionDialog.vue';
import TimelineActionBlock from './components/TimelineActionBlock.vue';
import TimelineActionContextMenu from './components/TimelineActionContextMenu.vue';
import TimelineActionInspector from './components/TimelineActionInspector.vue';
import TimelineRuler from './components/TimelineRuler.vue';
import TimelineTrackHeader from './components/TimelineTrackHeader.vue';
import TimelineWorkbenchShell from './components/TimelineWorkbenchShell.vue';
import { createEmptyScenario } from '../../core/project/createProject';
import type {
  EditableActionValues,
  GearBuildDocument,
  OperatorBuildDocument,
  ScenarioDocument,
  TrackIndex,
  WeaponBuildDocument,
} from '../../core/project/schema';
import { nextGameDataRepository } from '../../data/gameDataCatalog';
import { perlica } from '../../data/operators';
import { placeSkillGroup, type TimelineDocumentIdAllocator } from './placeSkillGroup';
import {
  projectTimelineEditor,
  type TimelineSkillLibraryEntryViewModel,
} from './timelineEditorViewModel';
import { frameToTimelinePx, timelinePxToFrame, timelineTotalWidth } from './timelineGeometry';
import {
  moveSkillCast,
  removeSkillCast,
  setTrackOperator,
  setTrackGear,
  setTrackWeapon,
  updateSkillCastBasicField,
  updateSkillCastBooleanField,
  updateSkillCastColor,
  type BasicEditableSkillCastField,
  type TrackGearSlot,
} from './timelineDocumentCommands';

const { t, locale } = useI18n({ useScope: 'global' });
const pxPerFrame = 2;
const selectedTrack = ref<TrackIndex>(0);
const selectedCastId = ref<string | null>(null);
const cursorFrame = ref(30);
const operatorDialogTrack = ref<TrackIndex | null>(null);
const weaponDialogTrack = ref<TrackIndex | null>(null);
const gearDialogTarget = ref<{ trackIndex: TrackIndex; slot: TrackGearSlot } | null>(null);
const TRACK_GEAR_SLOTS = ['armor', 'gloves', 'accessory1', 'accessory2'] as const;
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

function createInitialOperatorBuild(
  operator: OperatorDefinition,
  trackIndex: TrackIndex,
): OperatorBuildDocument {
  const skillLevels = Object.fromEntries(
    [...new Set(operator.skillGroups.map(group => group.levelSource))].map(source => [source, 12]),
  );
  return {
    id: `operator:${trackIndex}:${operator.slug}`,
    operatorSlug: operator.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels,
    talentStates: {},
  };
}

function createInitialWeaponBuild(
  weapon: WeaponDefinition,
  trackIndex: TrackIndex,
): WeaponBuildDocument {
  return {
    id: `weapon:${trackIndex}:${weapon.slug}`,
    weaponSlug: weapon.slug,
    level: 90,
    tuned: true,
    potential: 0,
    traitLevels: weapon.traits.map(() => 1),
  };
}

function createInitialGearBuild(
  gear: GearDefinition,
  trackIndex: TrackIndex,
  slot: TrackGearSlot,
): GearBuildDocument {
  return {
    id: `gear:${trackIndex}:${slot}:${gear.slug}`,
    gearSlug: gear.slug,
    artificingLevels: gear.traits.map(() => 0),
  };
}

const scenario = ref(createSampleScenario());
let nextDocumentId = 0;
const ids: TimelineDocumentIdAllocator = {
  allocate: kind => `${kind}:next-sample:${++nextDocumentId}`,
};
const viewModel = computed(() => projectTimelineEditor(scenario.value, nextGameDataRepository));
const selectedTrackModel = computed(() => viewModel.value.tracks[selectedTrack.value]!);
const selectedWeaponSlug = computed(() => {
  const track = scenario.value.tracks[selectedTrack.value];
  if (track?.weaponBuildId == null) return null;
  return scenario.value.builds.weapons[track.weaponBuildId]?.weaponSlug ?? null;
});
const selectableWeapons = computed(() => {
  const operatorSlug = selectedTrackModel.value.operatorSlug;
  const operator = operatorSlug === null ? null : nextGameDataRepository.getOperator(operatorSlug);
  if (operator === null) return [];
  return nextGameDataRepository
    .getWeapons()
    .filter(weapon => weapon.weaponType === operator.weaponType);
});
const selectedGearSlug = computed(() => {
  const target = gearDialogTarget.value;
  if (target === null) return null;
  const buildId = scenario.value.tracks[target.trackIndex]?.gearBuildIds[target.slot] ?? null;
  return buildId === null ? null : (scenario.value.builds.gears[buildId]?.gearSlug ?? null);
});
const selectableGears = computed(() => {
  const target = gearDialogTarget.value;
  if (target === null) return [];
  const slotType = target.slot === 'armor' || target.slot === 'gloves' ? target.slot : 'accessory';
  return nextGameDataRepository.getGears().filter(gear => gear.slotType === slotType);
});
const gearSlotTabs = computed(() => {
  const trackIndex = gearDialogTarget.value?.trackIndex ?? selectedTrack.value;
  const track = scenario.value.tracks[trackIndex];
  return TRACK_GEAR_SLOTS.map(slot => {
    const buildId = track?.gearBuildIds[slot] ?? null;
    const slug = buildId === null ? null : (scenario.value.builds.gears[buildId]?.gearSlug ?? null);
    return {
      key: slot,
      label: t(`nextTimeline.gearDialog.slots.${slot}`),
      selectedSlug: slug,
      selectedName: slug === null ? null : getGearPieceGameName(slug, locale.value),
    };
  });
});
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
  scenario.value = result.scenario;
  selectedTrack.value = trackIndex;
  selectedCastId.value = result.skillCastIds.at(-1) ?? null;
  const placed = result.scenario.tracks[trackIndex]?.skillCasts ?? [];
  const last = placed.at(-1);
  if (last !== undefined) {
    cursorFrame.value = last.placement.startFrame + last.editable.durationFrames;
  }
}

function openOperatorDialog(trackIndex = selectedTrack.value): void {
  selectedTrack.value = trackIndex;
  selectedCastId.value = null;
  operatorDialogTrack.value = trackIndex;
}

function selectTrack(trackIndex: TrackIndex): void {
  selectedTrack.value = trackIndex;
  if (viewModel.value.tracks[trackIndex]?.operatorSlug === null) openOperatorDialog(trackIndex);
}

function selectOperator(slug: string): void {
  const trackIndex = operatorDialogTrack.value;
  if (trackIndex === null) return;
  const operator = nextGameDataRepository.getOperator(slug);
  if (operator === null) throw new Error(`missing operator definition '${slug}'`);
  scenario.value = setTrackOperator(
    scenario.value,
    trackIndex,
    createInitialOperatorBuild(operator, trackIndex),
  );
  operatorDialogTrack.value = null;
}

function clearOperator(): void {
  const trackIndex = operatorDialogTrack.value;
  if (trackIndex === null) return;
  scenario.value = setTrackOperator(scenario.value, trackIndex, null);
  operatorDialogTrack.value = null;
}

function openWeaponDialog(): void {
  if (selectedTrackModel.value.operatorSlug === null) return;
  selectedCastId.value = null;
  weaponDialogTrack.value = selectedTrack.value;
}

function selectWeapon(slug: string): void {
  const trackIndex = weaponDialogTrack.value;
  if (trackIndex === null) return;
  const weapon = nextGameDataRepository.getWeapon(slug);
  if (weapon === null) throw new Error(`missing weapon definition '${slug}'`);
  scenario.value = setTrackWeapon(
    scenario.value,
    trackIndex,
    createInitialWeaponBuild(weapon, trackIndex),
  );
  weaponDialogTrack.value = null;
}

function clearWeapon(): void {
  const trackIndex = weaponDialogTrack.value;
  if (trackIndex === null) return;
  scenario.value = setTrackWeapon(scenario.value, trackIndex, null);
  weaponDialogTrack.value = null;
}

function openGearDialog(slot: TrackGearSlot = 'armor'): void {
  if (selectedTrackModel.value.operatorSlug === null) return;
  selectedCastId.value = null;
  gearDialogTarget.value = { trackIndex: selectedTrack.value, slot };
}

function changeGearSlot(key: string): void {
  const target = gearDialogTarget.value;
  if (target === null || !TRACK_GEAR_SLOTS.includes(key as TrackGearSlot)) return;
  gearDialogTarget.value = { ...target, slot: key as TrackGearSlot };
}

function selectGear(slug: string): void {
  const target = gearDialogTarget.value;
  if (target === null) return;
  const gear = nextGameDataRepository.getGear(slug);
  if (gear === null) throw new Error(`missing gear definition '${slug}'`);
  scenario.value = setTrackGear(
    scenario.value,
    target.trackIndex,
    target.slot,
    createInitialGearBuild(gear, target.trackIndex, target.slot),
  );
}

function clearGear(): void {
  const target = gearDialogTarget.value;
  if (target === null) return;
  scenario.value = setTrackGear(scenario.value, target.trackIndex, target.slot, null);
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
  scenario.value = moveSkillCast(scenario.value, trackIndex, payload.skillCastId, frame);
  selectedTrack.value = trackIndex;
  selectedCastId.value = payload.skillCastId;
}

function resetScenario(): void {
  scenario.value = createSampleScenario();
  selectedTrack.value = 0;
  selectedCastId.value = null;
  cursorFrame.value = 30;
  nextDocumentId = 0;
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
  scenario.value = updateSkillCastBooleanField(
    scenario.value,
    target.trackIndex,
    target.skillCastId,
    field,
    !cast.editable[field],
  );
  contextMenuTarget.value = null;
}

function deleteContextCast(): void {
  const target = contextMenuTarget.value;
  if (target === null) return;
  scenario.value = removeSkillCast(scenario.value, target.trackIndex, target.skillCastId);
  if (selectedCastId.value === target.skillCastId) selectedCastId.value = null;
  contextMenuTarget.value = null;
}

function setContextCastColor(color: string | null): void {
  const target = contextMenuTarget.value;
  if (target === null) return;
  scenario.value = updateSkillCastColor(
    scenario.value,
    target.trackIndex,
    target.skillCastId,
    color,
  );
  contextMenuTarget.value = null;
}

function updateSelectedCast(
  field: BasicEditableSkillCastField,
  value: EditableActionValues[BasicEditableSkillCastField],
): void {
  const selected = selectedCastModel.value;
  if (selected === null) return;
  scenario.value = updateSkillCastBasicField(
    scenario.value,
    selected.trackIndex,
    selected.cast.id,
    field,
    value,
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
          <button class="active" type="button">{{ t('nextTimeline.operatorTab') }}</button>
          <button
            type="button"
            :disabled="selectedTrackModel.operatorSlug === null"
            @click="openWeaponDialog"
          >
            {{ t('nextTimeline.weaponTab') }}
          </button>
          <button
            type="button"
            :disabled="selectedTrackModel.operatorSlug === null"
            @click="openGearDialog()"
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
      <div class="empty-panel">{{ tool }}</div>
    </template>

    <template #header>
      <div class="scenario-tools">
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
              @select="selectTrack(track.trackIndex)"
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
    :selected-slug="
      operatorDialogTrack === null
        ? null
        : (viewModel.tracks[operatorDialogTrack]?.operatorSlug ?? null)
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
    :slot-tabs="gearSlotTabs"
    :active-slot-key="gearDialogTarget?.slot ?? 'armor'"
    :labels="{
      title: t('nextTimeline.gearDialog.title'),
      searchPlaceholder: t('nextTimeline.gearDialog.searchPlaceholder'),
      unequip: t('common.unequip'),
      close: t('common.close'),
      empty: t('nextTimeline.gearDialog.empty'),
      partialSupport: t('nextTimeline.gearDialog.partialSupport'),
      defense: t('nextTimeline.gearDialog.defense'),
      noSet: t('nextTimeline.gearDialog.noSet'),
    }"
    @close="gearDialogTarget = null"
    @change-slot="changeGearSlot"
    @select="selectGear"
    @clear="clearGear"
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
