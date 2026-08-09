<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getOperatorCombatSkillName, getOperatorGameName } from '@/data/gameText';
import SkillLibraryCard from './components/SkillLibraryCard.vue';
import TimelineActionBlock from './components/TimelineActionBlock.vue';
import TimelineRuler from './components/TimelineRuler.vue';
import TimelineTrackHeader from './components/TimelineTrackHeader.vue';
import TimelineWorkbenchShell from './components/TimelineWorkbenchShell.vue';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument, TrackIndex } from '../../core/project/schema';
import { perlica } from '../../data/operators';
import { placeSkillGroup, type TimelineDocumentIdAllocator } from './placeSkillGroup';
import {
  projectTimelineEditor,
  type TimelineSkillLibraryEntryViewModel,
} from './timelineEditorViewModel';
import { frameToTimelinePx, timelinePxToFrame, timelineTotalWidth } from './timelineGeometry';

const { t, locale } = useI18n({ useScope: 'global' });
const pxPerFrame = 2;
const selectedTrack = ref<TrackIndex>(0);
const selectedCastId = ref<string | null>(null);
const cursorFrame = ref(30);
const draggedSkill = ref<{ skillGroupKey: string; skillKey?: string } | null>(null);

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

const scenario = ref(createSampleScenario());
let nextDocumentId = 0;
const ids: TimelineDocumentIdAllocator = {
  allocate: kind => `${kind}:next-sample:${++nextDocumentId}`,
};
const viewModel = computed(() =>
  projectTimelineEditor(scenario.value, {
    getOperator: slug => (slug === perlica.slug ? perlica : null),
  }),
);
const selectedTrackModel = computed(() => viewModel.value.tracks[selectedTrack.value]!);
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

function skillName(groupKey: string, slug = perlica.slug): string {
  return getOperatorCombatSkillName(slug, groupKey, locale.value);
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
  const result = placeSkillGroup({
    scenario: scenario.value,
    trackIndex,
    operator: perlica,
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

function beginSkillDrag(event: DragEvent, skillGroupKey: string, skillKey?: string): void {
  draggedSkill.value = { skillGroupKey, ...(skillKey === undefined ? {} : { skillKey }) };
  if (event.dataTransfer !== null) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', skillKey ?? skillGroupKey);
  }
}

function dropSkill(event: DragEvent, trackIndex: TrackIndex): void {
  const skill = draggedSkill.value;
  draggedSkill.value = null;
  if (skill === null) return;
  const lane = event.currentTarget as HTMLElement;
  const frame = Math.max(
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
  cursorFrame.value = frame;
  placeGroup(skill.skillGroupKey, skill.skillKey, frame, trackIndex);
}

function resetScenario(): void {
  scenario.value = createSampleScenario();
  selectedTrack.value = 0;
  selectedCastId.value = null;
  cursorFrame.value = 30;
  nextDocumentId = 0;
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
        <div class="operator-heading">
          <span class="operator-heading__mark"></span>
          <strong>{{ operatorName(selectedTrackModel.operatorSlug) }}</strong>
        </div>
        <div class="sidebar-tabs">
          <button class="active" type="button">{{ t('nextTimeline.operatorTab') }}</button>
          <button type="button" disabled>{{ t('nextTimeline.weaponTab') }}</button>
          <button type="button" disabled>{{ t('nextTimeline.gearTab') }}</button>
        </div>
        <div class="library-heading">
          <strong>{{ t('nextTimeline.skillLibrary') }}</strong>
          <span>Lv.{{ selectedTrackModel.skillLibrary[0]?.level ?? 0 }}</span>
        </div>
        <div class="skill-list">
          <SkillLibraryCard
            v-for="entry in selectedTrackModel.skillLibrary"
            :key="entry.skillGroupKey"
            :name="skillName(entry.skillGroupKey)"
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
              @select="selectedTrack = track.trackIndex"
            />
            <div
              class="track-lane"
              :style="{ width: `${timelineWidth}px` }"
              @click="selectTimelinePosition($event, track.trackIndex)"
              @dragover.prevent
              @drop.prevent="dropSkill($event, track.trackIndex)"
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
                    ? skillName(cast.source.skillGroupKey, track.operatorSlug ?? perlica.slug)
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #bottom="{ tool }"
      ><div class="empty-panel">{{ tool }}</div></template
    >
    <template #right="{ tool }"
      ><div class="empty-panel">{{ tool }}</div></template
    >
  </TimelineWorkbenchShell>
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
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 18px;
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
