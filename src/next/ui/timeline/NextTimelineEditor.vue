<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getOperatorCombatSkillName, getOperatorGameName } from '@/data/gameText';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument, TrackIndex } from '../../core/project/schema';
import { perlica } from '../../data/operators';
import { placeSkillGroup, type TimelineDocumentIdAllocator } from './placeSkillGroup';
import { projectTimelineEditor } from './timelineEditorViewModel';

const { t, locale } = useI18n({ useScope: 'global' });
const pxPerFrame = 2;
const selectedTrack = ref<TrackIndex>(0);
const cursorFrame = ref(30);

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
const timelineWidth = computed(() => scenario.value.battle.durationFrames * pxPerFrame);
const rulerMarks = computed(() =>
  Array.from(
    { length: Math.floor(scenario.value.battle.durationFrames / 150) + 1 },
    (_, index) => ({
      frame: index * 150,
      seconds: index * 5,
    }),
  ),
);

function operatorName(slug: string | null): string {
  return slug === null ? t('nextTimeline.emptyTrack') : getOperatorGameName(slug, locale.value);
}

function skillName(groupKey: string, slug = perlica.slug): string {
  return getOperatorCombatSkillName(slug, groupKey, locale.value);
}

function selectTimelinePosition(event: MouseEvent, trackIndex: TrackIndex): void {
  const lane = event.currentTarget as HTMLElement;
  cursorFrame.value = Math.max(
    0,
    Math.min(
      scenario.value.battle.durationFrames,
      Math.round((event.clientX - lane.getBoundingClientRect().left) / pxPerFrame),
    ),
  );
  selectedTrack.value = trackIndex;
}

function placeGroup(skillGroupKey: string): void {
  const result = placeSkillGroup({
    scenario: scenario.value,
    trackIndex: selectedTrack.value,
    operator: perlica,
    skillGroupKey,
    startFrame: cursorFrame.value,
    ids,
  });
  scenario.value = result.scenario;
  const placed = result.scenario.tracks[selectedTrack.value]?.skillCasts ?? [];
  const last = placed.at(-1);
  if (last !== undefined) {
    cursorFrame.value = last.placement.startFrame + last.editable.durationFrames;
  }
}

function resetScenario(): void {
  scenario.value = createSampleScenario();
  selectedTrack.value = 0;
  cursorFrame.value = 30;
  nextDocumentId = 0;
}
</script>

<template>
  <main class="next-timeline-editor">
    <header class="editor-toolbar">
      <div class="project-title">
        <span class="title-mark"></span>
        <strong>{{ operatorName('perlica') }}</strong>
        <span class="engine-badge">NEXT</span>
      </div>
      <div class="toolbar-actions">
        <span>{{ t('nextTimeline.cursorFrame', { frame: cursorFrame }) }}</span>
        <button type="button" disabled :title="t('nextTimeline.simulationPending')">
          {{ t('nextTimeline.simulate') }}
        </button>
        <button type="button" @click="resetScenario">{{ t('nextTimeline.reset') }}</button>
        <router-link to="/timeline">{{ t('nextTimeline.backToCurrent') }}</router-link>
      </div>
    </header>

    <section class="editor-body">
      <aside class="skill-sidebar">
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
          <button
            v-for="entry in selectedTrackModel.skillLibrary"
            :key="entry.skillGroupKey"
            type="button"
            class="skill-entry"
            :data-skill-type="entry.skillType"
            @click="placeGroup(entry.skillGroupKey)"
          >
            <span>{{ skillName(entry.skillGroupKey) }}</span>
            <small>{{
              entry.skills.length > 1 ? `${entry.skills.length}A` : entry.skillType
            }}</small>
          </button>
        </div>
      </aside>

      <div class="timeline-workspace">
        <div class="timeline-scroll">
          <div class="timeline-content" :style="{ width: `${timelineWidth}px` }">
            <div class="ruler">
              <span
                v-for="mark in rulerMarks"
                :key="mark.frame"
                class="ruler-mark"
                :style="{ left: `${mark.frame * pxPerFrame}px` }"
              >
                {{ mark.seconds }}s
              </span>
            </div>
            <div class="cursor-line" :style="{ left: `${cursorFrame * pxPerFrame}px` }"></div>

            <div
              v-for="track in viewModel.tracks"
              :key="track.trackIndex"
              class="track-row"
              :class="{ selected: selectedTrack === track.trackIndex }"
            >
              <button
                class="track-identity"
                type="button"
                @click="selectedTrack = track.trackIndex"
              >
                <img v-if="track.operatorSlug" src="/operators/perlica/avatar.webp" alt="" />
                <span>{{ operatorName(track.operatorSlug) }}</span>
              </button>
              <div class="track-lane" @click="selectTimelinePosition($event, track.trackIndex)">
                <button
                  v-for="cast in track.skillCasts"
                  :key="cast.id"
                  type="button"
                  class="skill-block"
                  :data-skill-type="cast.skillType"
                  :style="{
                    left: `${cast.startFrame * pxPerFrame}px`,
                    width: `${Math.max(48, cast.durationFrames * pxPerFrame)}px`,
                  }"
                  @click.stop="selectedTrack = track.trackIndex"
                >
                  {{
                    cast.source.kind === 'operatorSkill'
                      ? skillName(cast.source.skillGroupKey, track.operatorSlug ?? perlica.slug)
                      : cast.source.kind
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.next-timeline-editor {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 50px minmax(0, 1fr);
  background: var(--ea-bg, #18181c);
  color: var(--ea-fg, #f0f0f0);
  letter-spacing: 0;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 18px;
  border-bottom: 1px solid var(--ea-border, #34343a);
  background: var(--ea-surface, #242428);
}

.project-title,
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-mark {
  width: 4px;
  height: 22px;
  background: var(--ea-gold, #ffd700);
}

.engine-badge {
  padding: 2px 5px;
  border: 1px solid var(--ea-gold, #ffd700);
  color: var(--ea-gold, #ffd700);
  font:
    10px/1.2 Consolas,
    monospace;
}

.toolbar-actions {
  color: var(--ea-muted, #999);
  font-size: 12px;
}

button,
a {
  min-height: 30px;
  border: 1px solid var(--ea-border, #444);
  border-radius: 2px;
  background: var(--ea-surface-soft, #29292e);
  color: inherit;
  padding: 0 10px;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

button:hover:not(:disabled),
a:hover {
  border-color: var(--ea-gold, #ffd700);
  color: var(--ea-gold, #ffd700);
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.editor-body {
  min-height: 0;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
}

.skill-sidebar {
  min-height: 0;
  padding: 16px 12px;
  border-right: 1px solid var(--ea-border, #34343a);
  background: var(--ea-sidebar-bg, #1d1d21);
  overflow-y: auto;
}

.sidebar-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.sidebar-tabs button.active {
  color: var(--ea-gold, #ffd700);
  border-color: var(--ea-gold, #ffd700);
}

.library-heading {
  display: flex;
  justify-content: space-between;
  margin: 22px 4px 10px;
  color: var(--ea-muted, #aaa);
  font-size: 12px;
}

.skill-list {
  display: grid;
  gap: 8px;
}

.skill-entry {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 4px solid #999;
  background: #2b2b30;
  text-align: left;
}

.skill-entry[data-skill-type='battleSkill'] {
  border-left-color: #ef4444;
}
.skill-entry[data-skill-type='comboSkill'] {
  border-left-color: #eab308;
}
.skill-entry[data-skill-type='ultimate'] {
  border-left-color: #22c55e;
}
.skill-entry[data-skill-type='finisher'],
.skill-entry[data-skill-type='plungingAttack'] {
  border-left-color: #38bdf8;
}

.skill-entry small {
  color: #888;
  font:
    10px/1 Consolas,
    monospace;
}

.timeline-workspace,
.timeline-scroll {
  min-width: 0;
  min-height: 0;
}

.timeline-scroll {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.timeline-content {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  padding-top: 38px;
  background-image: linear-gradient(to right, #2c2c32 1px, transparent 1px);
  background-size: 60px 100%;
}

.ruler {
  position: absolute;
  inset: 0 0 auto;
  height: 38px;
  border-bottom: 1px solid #444;
  background: #29292d;
}

.ruler-mark {
  position: absolute;
  bottom: 6px;
  padding-left: 4px;
  border-left: 1px solid #777;
  color: #bbb;
  font:
    11px/18px Consolas,
    monospace;
}

.cursor-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #f5f5f5;
  z-index: 4;
  pointer-events: none;
}

.track-row {
  position: relative;
  height: 132px;
  border-bottom: 1px solid #303036;
}

.track-row.selected {
  background: color-mix(in srgb, var(--ea-gold, #ffd700) 4%, transparent);
}

.track-identity {
  position: sticky;
  left: 0;
  z-index: 3;
  width: 170px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-right: 3px solid transparent;
  background: #29292e;
}

.track-row.selected .track-identity {
  border-right-color: var(--ea-gold, #ffd700);
}

.track-identity img {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.track-lane {
  position: absolute;
  inset: 0;
}

.skill-block {
  position: absolute;
  top: 36px;
  height: 58px;
  min-width: 48px;
  overflow: hidden;
  padding: 0 8px;
  border: 1px dashed #aaa;
  background: #34343a;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.skill-block[data-skill-type='battleSkill'] {
  border-color: #ff5a5f;
  color: #ff6b70;
  background: #402427;
}
.skill-block[data-skill-type='comboSkill'] {
  border-color: #facc15;
  color: #fde047;
  background: #3b351b;
}
.skill-block[data-skill-type='ultimate'] {
  border-color: #22c55e;
  color: #4ade80;
  background: #1e3827;
}

@media (max-width: 800px) {
  .editor-body {
    grid-template-columns: 220px minmax(0, 1fr);
  }
  .toolbar-actions > span,
  .toolbar-actions > button:disabled {
    display: none;
  }
}
</style>
