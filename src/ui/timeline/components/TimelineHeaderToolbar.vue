<script setup lang="ts">
/**
 * Next 时间轴的顶部方案工具栏，保持旧版的操作分区与视觉层级。
 * 当前尚未贯通的项目能力以禁用按钮占位，避免 UI 提前承诺不存在的行为。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import TimelineDurationBarColorControls from './TimelineDurationBarColorControls.vue';
import { resolveScenarioTabsScrollMask } from '../scenarioTabsScrollMask';
import type { TimelineViewLayerId, TimelineViewLayers } from '../timelineViewLayers';

const props = defineProps<{
  scenarioName: string;
  scenarios: readonly { readonly id: string; readonly name: string }[];
  activeScenarioId: string;
  maxScenarios: number;
  projectDirty: boolean;
  cursorGuideEnabled: boolean;
  boxSelectEnabled: boolean;
  connectionToolEnabled: boolean;
  buffLayoutMode: 'compact' | 'loose';
  viewLayers: TimelineViewLayers;
  viewLayerIds: readonly TimelineViewLayerId[];
  operatorEffects: readonly {
    readonly trackIndex: number;
    readonly name: string;
    readonly color: string;
    readonly visible: boolean;
  }[];
  locale: string;
  appearance: 'light' | 'dark';
  labels: {
    rename: string;
    duplicate: string;
    delete: string;
    add: string;
    analysis: string;
    open: string;
    export: string;
    more: string;
    reset: string;
    view: string;
    viewLayers: Record<TimelineViewLayerId, string>;
    viewOperators: string;
    viewOperatorsEmpty: string;
    shortcuts: string;
    preferences: string;
    appearance: string;
    appearanceLight: string;
    appearanceDark: string;
    projectDirty: string;
    locales: { zhCN: string; en: string; ru: string };
  };
}>();

const emit = defineEmits<{
  toggleCursorGuide: [];
  toggleBoxSelect: [];
  toggleConnectionTool: [];
  setBuffLayout: [mode: 'compact' | 'loose'];
  reset: [];
  open: [];
  export: [];
  rename: [name: string];
  duplicate: [];
  delete: [];
  add: [];
  select: [scenarioId: string];
  analysis: [];
  shortcuts: [];
  toggleViewLayer: [layerId: TimelineViewLayerId];
  toggleOperatorEffects: [trackIndex: number];
  setLocale: [locale: 'zh-CN' | 'en' | 'ru'];
  setAppearance: [appearance: 'light' | 'dark'];
  clearSelection: [];
}>();

const renaming = ref(false);
const { t } = useI18n({ useScope: 'global' });
const renameDraft = ref('');
const renameInput = ref<HTMLInputElement | null>(null);
const moreMenuOpen = ref(false);
const displayMenuOpen = ref(false);
watch(displayMenuOpen, open => {
  if (open) moreMenuOpen.value = false;
});
watch(moreMenuOpen, open => {
  if (open) displayMenuOpen.value = false;
});
const scenarioTabs = ref<HTMLElement | null>(null);
const scenarioTabsMaskStyle = ref({ maskImage: 'none', WebkitMaskImage: 'none' });
let scenarioTabsResizeObserver: ResizeObserver | null = null;

function updateScenarioTabsScrollMask(): void {
  const element = scenarioTabs.value;
  if (element === null) return;
  scenarioTabsMaskStyle.value = resolveScenarioTabsScrollMask(element);
}

function beginRename(): void {
  renameDraft.value = props.scenarioName;
  renaming.value = true;
  void nextTick(() => {
    renameInput.value?.focus();
    renameInput.value?.select();
  });
}

function finishRename(): void {
  if (!renaming.value) return;
  renaming.value = false;
  const name = renameDraft.value.trim();
  if (name.length > 0 && name !== props.scenarioName) emit('rename', name);
}

function cancelRename(): void {
  renaming.value = false;
  renameDraft.value = props.scenarioName;
}

const localeIds = ['zh-CN', 'en', 'ru'] as const;
function localeLabel(id: (typeof localeIds)[number]): string {
  if (id === 'zh-CN') return props.labels.locales.zhCN;
  return props.labels.locales[id];
}

watch(
  () => props.scenarios.length,
  async () => {
    await nextTick();
    updateScenarioTabsScrollMask();
  },
);

onMounted(() => {
  void nextTick(updateScenarioTabsScrollMask);
  if (typeof ResizeObserver === 'undefined' || scenarioTabs.value === null) return;
  scenarioTabsResizeObserver = new ResizeObserver(updateScenarioTabsScrollMask);
  scenarioTabsResizeObserver.observe(scenarioTabs.value);
});

onBeforeUnmount(() => {
  scenarioTabsResizeObserver?.disconnect();
  scenarioTabsResizeObserver = null;
});
</script>

<template>
  <div class="scenario-toolbar" @click.self="$emit('clearSelection')">
    <div class="scenario-toolbar__project" @click.self="$emit('clearSelection')">
      <div class="scenario-heading-group" @click.self="$emit('clearSelection')">
        <button
          type="button"
          class="icon-button"
          :title="labels.rename"
          :aria-label="labels.rename"
          @click="beginRename"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m4 16-1 5 5-1L19 9l-4-4L4 16Z" />
            <path d="m13 7 4 4" />
          </svg>
        </button>
        <button
          type="button"
          class="icon-button"
          :title="labels.duplicate"
          :aria-label="labels.duplicate"
          @click="$emit('duplicate')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V4H4v12h4" />
          </svg>
        </button>

        <button
          v-if="scenarios.length > 1"
          type="button"
          class="icon-button icon-button--danger"
          :title="labels.delete"
          :aria-label="labels.delete"
          @click="$emit('delete')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6" />
          </svg>
        </button>

        <div class="scenario-title" :title="scenarioName">
          <span>[</span>
          <input
            v-if="renaming"
            ref="renameInput"
            v-model="renameDraft"
            class="scenario-title__input"
            @blur="finishRename"
            @keydown.enter.prevent="finishRename"
            @keydown.esc.prevent="cancelRename"
          />
          <strong v-else @dblclick="beginRename">{{ scenarioName }}</strong>
          <span>]</span
          ><i v-if="projectDirty" class="dirty-indicator" :title="labels.projectDirty">●</i>
        </div>
      </div>
      <div
        ref="scenarioTabs"
        class="scenario-tabs"
        :style="scenarioTabsMaskStyle"
        @scroll="updateScenarioTabsScrollMask"
      >
        <button
          v-for="(scenario, index) in scenarios"
          :key="scenario.id"
          type="button"
          class="scenario-tab"
          :class="{ 'is-active': scenario.id === activeScenarioId }"
          :title="scenario.name"
          :aria-label="scenario.name"
          :aria-current="scenario.id === activeScenarioId ? 'page' : undefined"
          @click="$emit('select', scenario.id)"
        >
          {{ String(index + 1).padStart(2, '0') }}
        </button>
        <button
          v-if="scenarios.length < maxScenarios"
          type="button"
          class="icon-button add-button"
          :title="labels.add"
          :aria-label="labels.add"
          @click="$emit('add')"
        >
          +
        </button>
      </div>
    </div>

    <div class="scenario-toolbar__actions" @click.self="$emit('clearSelection')">
      <button
        type="button"
        class="command-button command-button--analysis"
        @click="$emit('analysis')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-9-9v9Z" />
          <path d="M12 3a9 9 0 0 1 9 9h-9Z" />
        </svg>
        {{ labels.analysis }}
      </button>
      <button type="button" class="command-button command-button--export" @click="$emit('export')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 3h7v7" />
          <path d="m10 14 11-11" />
          <path d="M21 14v7H3V5h9" />
        </svg>
        {{ labels.export }}
      </button>
      <el-popover
        v-model:visible="displayMenuOpen"
        placement="bottom-end"
        trigger="click"
        :width="280"
        popper-class="next-header-display"
      >
        <template #reference>
          <button
            type="button"
            class="command-button"
            :class="{ 'is-active': displayMenuOpen }"
            :title="t('display.title')"
            :aria-label="t('display.title')"
            :aria-expanded="displayMenuOpen"
            :data-keyboard-shortcut-scope="displayMenuOpen ? 'overlay' : undefined"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
            {{ t('display.title') }}
          </button>
        </template>
        <div class="more-menu timeline-display-menu" data-keyboard-shortcut-scope="overlay">
          <button
            type="button"
            class="timeline-display-guide"
            :class="{ 'is-active': cursorGuideEnabled }"
            :aria-pressed="cursorGuideEnabled"
            @click="$emit('toggleCursorGuide')"
          >
            <svg
              class="timeline-display-guide__icon"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v18M3 12h18" />
              <path d="M7 6H5v2M17 6h2v2M7 18H5v-2M17 18h2v-2" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
            <span class="timeline-display-guide__content"
              ><strong>{{ t('display.cursorGuide') }}</strong
              ><small>Ctrl + G</small></span
            >
            <svg
              class="timeline-display-guide__check"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <rect x="1" y="1" width="14" height="14" rx="2" />
              <polyline v-if="cursorGuideEnabled" points="3,8 6.5,11.5 13,4.5" />
            </svg>
          </button>
          <div class="timeline-display-scroll">
            <section class="more-menu__section">
              <div class="display-layout-row">
                <span>{{ t('display.buffLayout') }}</span>
                <div
                  class="display-layout-modes"
                  role="group"
                  :aria-label="t('display.buffLayout')"
                >
                  <button
                    v-for="mode in ['compact', 'loose'] as const"
                    :key="mode"
                    type="button"
                    :aria-pressed="buffLayoutMode === mode"
                    @click="$emit('setBuffLayout', mode)"
                  >
                    {{
                      t(
                        mode === 'compact'
                          ? 'timelineGrid.toolbar.buffLayoutCompact'
                          : 'timelineGrid.toolbar.buffLayoutLoose',
                      )
                    }}
                  </button>
                </div>
              </div>
            </section>
            <section class="more-menu__section">
              <h4>{{ labels.view }}</h4>
              <div class="view-layer-grid">
                <button
                  v-for="layerId in viewLayerIds"
                  :key="layerId"
                  type="button"
                  class="view-layer-toggle"
                  :aria-pressed="viewLayers[layerId]"
                  @click="$emit('toggleViewLayer', layerId)"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <rect x="1" y="1" width="14" height="14" rx="2" />
                    <polyline v-if="viewLayers[layerId]" points="3,8 6.5,11.5 13,4.5" />
                  </svg>
                  <span>{{ labels.viewLayers[layerId] }}</span>
                </button>
              </div>
              <h4 class="view-operators-title">{{ labels.viewOperators }}</h4>
              <div v-if="operatorEffects.length > 0" class="view-layer-grid">
                <button
                  v-for="operator in operatorEffects"
                  :key="operator.trackIndex"
                  type="button"
                  class="view-layer-toggle"
                  :aria-pressed="operator.visible"
                  @click="$emit('toggleOperatorEffects', operator.trackIndex)"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true" :style="{ color: operator.color }">
                    <rect x="1" y="1" width="14" height="14" rx="2" />
                    <polyline v-if="operator.visible" points="3,8 6.5,11.5 13,4.5" />
                  </svg>
                  <span>{{ operator.name }}</span>
                </button>
              </div>
              <p v-else class="view-operators-empty">{{ labels.viewOperatorsEmpty }}</p>
            </section>
            <TimelineDurationBarColorControls />
          </div>
        </div>
      </el-popover>
      <el-popover
        v-model:visible="moreMenuOpen"
        placement="bottom-end"
        trigger="click"
        :width="280"
        popper-class="next-header-more"
      >
        <template #reference>
          <button
            type="button"
            class="command-button"
            :class="{ 'is-active': moreMenuOpen }"
            :title="labels.more"
            :aria-label="labels.more"
            :aria-expanded="moreMenuOpen"
            :data-keyboard-shortcut-scope="moreMenuOpen ? 'overlay' : undefined"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
            {{ labels.more }}
          </button>
        </template>
        <div class="more-menu" data-keyboard-shortcut-scope="overlay">
          <section class="more-menu__section">
            <h4>{{ t('timeline.header.sectionEditTools') }}</h4>
            <div class="more-tools">
              <button
                type="button"
                :aria-pressed="boxSelectEnabled"
                @click="$emit('toggleBoxSelect')"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
                  <rect x="7.5" y="7.5" width="9" height="9" stroke-dasharray="2 2" />
                </svg>
                {{ t('timelineGrid.toolbar.boxSelect') }}
                <svg class="tool-check" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="1" y="1" width="14" height="14" rx="2" />
                  <polyline v-if="boxSelectEnabled" points="3,8 6.5,11.5 13,4.5" />
                </svg>
              </button>
              <button
                type="button"
                :aria-pressed="connectionToolEnabled"
                @click="$emit('toggleConnectionTool')"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="5" cy="7" r="2.5" />
                  <circle cx="19" cy="17" r="2.5" />
                  <path d="M7.5 7c5.5 0 3.5 10 9 10" />
                </svg>
                {{ t('timelineGrid.toolbar.connectionTool') }}
                <svg class="tool-check" viewBox="0 0 16 16" aria-hidden="true">
                  <rect x="1" y="1" width="14" height="14" rx="2" />
                  <polyline v-if="connectionToolEnabled" points="3,8 6.5,11.5 13,4.5" />
                </svg>
              </button>
            </div>
          </section>
          <section class="more-menu__section">
            <h4>{{ t('timeline.header.sectionProject') }}</h4>
            <div class="more-menu__actions">
              <button type="button" @click="$emit('open')">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>{{ labels.open }}</span>
              </button>
              <button type="button" @click="$emit('export')">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{{ labels.export }}</span>
              </button>
              <button type="button" class="danger" @click="$emit('reset')">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
                <span>{{ labels.reset }}</span>
              </button>
            </div>
          </section>
          <section class="more-menu__section preferences-section">
            <h4>{{ labels.preferences }}</h4>
            <div class="preference-row">
              <div class="segmented-control">
                <button
                  v-for="localeId in localeIds"
                  :key="localeId"
                  type="button"
                  :class="{ active: locale === localeId }"
                  @click="$emit('setLocale', localeId)"
                >
                  {{ localeLabel(localeId) }}
                </button>
              </div>
              <button
                class="shortcuts-button"
                type="button"
                :title="labels.shortcuts"
                :aria-label="labels.shortcuts"
                @click="$emit('shortcuts')"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M6 8h2m2 0h2m2 0h2m2 0h1M6 12h2m2 0h2m2 0h2M7 16h10" />
                </svg>
              </button>
            </div>
            <div class="preference-row preference-row--appearance">
              <span>{{ labels.appearance }}</span>
              <div class="segmented-control segmented-control--appearance">
                <button
                  type="button"
                  :class="{ active: appearance === 'light' }"
                  :title="labels.appearanceLight"
                  :aria-label="labels.appearanceLight"
                  :aria-pressed="appearance === 'light'"
                  @click="$emit('setAppearance', 'light')"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path
                      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  :class="{ active: appearance === 'dark' }"
                  :title="labels.appearanceDark"
                  :aria-label="labels.appearanceDark"
                  :aria-pressed="appearance === 'dark'"
                  @click="$emit('setAppearance', 'dark')"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<style scoped>
.more-tools {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}
.more-tools button {
  display: flex;
  align-items: center;
  gap: 6px;
}
.more-tools button[aria-pressed='true'] {
  color: var(--ea-gold);
}
.more-tools svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}
.scenario-toolbar {
  min-width: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 10px 0 0;
  box-sizing: border-box;
  color: var(--ea-fg);
  user-select: none;
}

.scenario-toolbar__project,
.scenario-toolbar__actions,
.scenario-heading-group {
  min-width: 0;
  display: flex;
  align-items: center;
}

.scenario-toolbar__project {
  flex: 1 1 auto;
  height: 36px;
  gap: 0;
  margin-right: 20px;
  padding: 0 10px;
  background: linear-gradient(90deg, rgb(255 255 255 / 3%) 0%, transparent 100%);
}

.scenario-heading-group {
  position: relative;
  width: 260px;
  flex: 0 0 260px;
  gap: 4px;
  padding-right: 10px;
  overflow: hidden;
}

.scenario-toolbar__actions {
  flex: 0 0 auto;
  gap: 8px;
}

button {
  color: inherit;
  font: inherit;
}

.icon-button {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 2px;
  background: transparent;
  color: var(--ea-icon-muted);
  cursor: pointer;
}

.icon-button:hover:not(:disabled) {
  background: var(--ea-hover-fill);
  color: var(--ea-icon-strong);
}

.icon-button:disabled,
.command-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.icon-button svg,
.command-button svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.add-button {
  border: 1px solid var(--ea-border);
  font-size: 16px;
}

.scenario-title {
  min-width: 0;
  max-width: 172px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 6px;
  overflow: hidden;
  white-space: nowrap;
}

.scenario-title__input {
  width: 120px;
  height: 24px;
  box-sizing: border-box;
  border: 1px solid var(--ea-gold);
  border-radius: 2px;
  outline: 0;
  background: var(--ea-fill-input, #111);
  color: var(--ea-fg);
  font: inherit;
}

.scenario-title strong {
  overflow: hidden;
  text-overflow: ellipsis;
}

.dirty-indicator {
  flex: none;
  color: var(--ea-gold);
  font-size: 8px;
  font-style: normal;
}

.scenario-tab {
  min-width: 40px;
  height: 24px;
  flex: 0 0 auto;
  padding: 0 8px;
  border: 0;
  border-radius: 4px;
  background: var(--ea-tab-active-bg);
  color: var(--ea-tab-active-fg);
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  cursor: pointer;
  font:
    700 12px/1 'Roboto Mono',
    Consolas,
    monospace;
}

.scenario-tabs {
  min-width: 0;
  max-width: min(440px, 34vw);
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
}

.scenario-tabs::-webkit-scrollbar {
  display: none;
}

.scenario-tab:not(.is-active) {
  background: var(--ea-tab-idle-bg);
  color: var(--ea-tab-idle-fg);
  box-shadow: none;
}

.scenario-tab:hover {
  background: var(--ea-hover-fill);
  color: var(--ea-fg);
}

.icon-button--danger:hover {
  background: rgb(255 77 79 / 12%);
  color: #ff7875;
}

.command-button {
  height: 28px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  border: 1px solid var(--ea-border);
  border-radius: 4px;
  background: var(--ea-fill-soft);
  color: var(--ea-fg-secondary);
  font-size: 12px;
  cursor: pointer;
}

.command-button:hover:not(:disabled) {
  border-color: var(--ea-gold);
  color: var(--ea-fg);
}

.command-button.is-active {
  background: var(--ea-active-fill);
  color: var(--ea-fg);
}

.more-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.display-layout-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  font-size: 12px;
}

.display-layout-modes {
  display: flex;
  border: 1px solid var(--ea-border);
  border-radius: 4px;
  overflow: hidden;
}

.display-layout-modes button[aria-pressed='true'] {
  color: var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 15%, transparent);
}

.more-menu__section h4 {
  margin: 0 0 6px;
  color: var(--ea-fg-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.more-menu__section .view-operators-title {
  margin-top: 10px;
}

.view-operators-empty {
  margin: 0;
  color: var(--ea-fg-muted);
  font-size: 10px;
}

.view-layer-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  border: 1px solid var(--ea-border-soft);
  border-radius: 4px;
  background: var(--ea-fill-soft);
  overflow: hidden;
}

.more-menu button {
  width: 100%;
  padding: 7px 9px;
  border: 0;
  background: transparent;
  color: var(--ea-fg-secondary);
  text-align: left;
  cursor: pointer;
}

.more-menu .view-layer-toggle {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
  font-size: 11px;
  font-weight: 600;
  border-bottom: 1px solid var(--ea-border-soft);
}

.more-menu .view-layer-toggle:nth-child(odd) {
  border-right: 1px solid var(--ea-border-soft);
}

.view-layer-toggle svg {
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
  fill: none;
  stroke: var(--ea-gold);
  stroke-width: 1.5;
}

.view-layer-toggle polyline {
  stroke-width: 2;
}

.view-layer-toggle span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more-menu__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.more-menu__actions button {
  width: auto;
  border: 1px solid var(--ea-border);
  border-radius: 4px;
  background: var(--ea-fill-soft);
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.more-menu__actions svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.more-menu__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.more-menu__section + .more-menu__section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--ea-border);
}
.more-menu__section h4 {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: color-mix(in srgb, var(--ea-gold) 90%, transparent);
}
.more-tools {
  gap: 0;
  border: 1px solid var(--ea-border-soft);
  border-radius: 4px;
  overflow: hidden;
  background: var(--ea-fill-soft);
}
.more-tools button {
  font-size: 11px;
  padding: 8px;
}
.more-tools button + button {
  border-left: 1px solid var(--ea-border-soft);
}
.more-tools svg {
  flex-shrink: 0;
}
.more-tools .tool-check {
  width: 13px;
  height: 13px;
  margin-left: auto;
}

.timeline-display-menu {
  max-height: min(760px, calc(100vh - 96px));
  gap: 0;
}

.more-menu .timeline-display-guide {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  width: calc(100% - 4px);
  margin: 0 4px 10px 0;
  padding: 8px 10px;
  border: 1px solid var(--ea-border);
  border-radius: 4px;
  background: var(--ea-fill-soft);
}

.more-menu .timeline-display-guide:hover {
  border-color: var(--ea-border-strong);
  background: var(--ea-hover-fill);
  color: var(--ea-fg);
}

.timeline-display-guide__icon {
  flex-shrink: 0;
  color: var(--ea-fg-muted);
}

.timeline-display-guide:hover .timeline-display-guide__icon,
.timeline-display-guide.is-active .timeline-display-guide__icon {
  color: var(--ea-gold);
}

.timeline-display-guide__content {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.timeline-display-guide__content strong {
  font-size: 12px;
  font-weight: 700;
}

.timeline-display-guide__content small {
  color: var(--ea-fg-faint);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.timeline-display-guide__check {
  flex-shrink: 0;
  color: color-mix(in srgb, var(--ea-gold) 85%, transparent);
}

.timeline-display-scroll {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-gutter: stable;
}

.preferences-section {
  padding-top: 7px;
  border-top: 1px solid var(--ea-border-soft);
}

.preference-row {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ea-fg-muted);
  font-size: 10px;
}

.segmented-control {
  min-width: 0;
  display: inline-grid;
  grid-template-columns: repeat(3, 1.75rem);
  gap: 4px;
  flex: 0 0 auto;
}

.segmented-control button {
  min-width: 0;
  flex: 1;
  padding: 5px 4px;
  text-align: center;
  border: 1px solid var(--ea-border);
  border-radius: 4px;
  background: var(--ea-fill-soft);
  font-size: 11px;
}

.segmented-control button.active {
  background: var(--ea-active-fill);
  color: var(--ea-gold);
}

.segmented-control--appearance {
  grid-template-columns: repeat(2, 28px);
}
.segmented-control--appearance button {
  height: 28px;
}
.preference-row--appearance {
  justify-content: space-between;
  margin-top: 2px;
  font-size: 11px;
  font-weight: 600;
}
.more-menu .shortcuts-button {
  margin-left: auto;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--ea-border);
  border-radius: 4px;
  display: grid;
  place-items: center;
  background: var(--ea-fill-soft);
}

.more-menu button:hover {
  background: var(--ea-hover-fill);
  color: var(--ea-fg);
}

.more-menu button.danger:hover {
  color: #ff7875;
}

@media (max-width: 1080px) {
  .command-button--analysis,
  .scenario-heading-group {
    display: none;
  }
}
</style>

<style>
.next-header-more.el-popover.el-popper {
  padding: 12px;
  background: var(--ea-popover-bg);
  border: 1px solid var(--ea-border);
  box-shadow: 0 10px 28px var(--ea-shadow-strong);
}

.next-header-more.el-popper.is-light,
.next-header-more.el-popper {
  color: var(--ea-fg-secondary);
}

.next-header-more.el-popper .el-popper__arrow::before {
  background: var(--ea-popover-bg);
  border-color: var(--ea-border);
}
</style>
