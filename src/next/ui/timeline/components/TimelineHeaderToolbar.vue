<script setup lang="ts">
/**
 * Next 时间轴的顶部方案工具栏，保持旧版的操作分区与视觉层级。
 * 当前尚未贯通的项目能力以禁用按钮占位，避免 UI 提前承诺不存在的行为。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { resolveScenarioTabsScrollMask } from '../scenarioTabsScrollMask';
import type { NextTimelineViewLayerId, NextTimelineViewLayers } from '../timelineViewLayers';

const props = defineProps<{
  scenarioName: string;
  scenarios: readonly { readonly id: string; readonly name: string }[];
  activeScenarioId: string;
  maxScenarios: number;
  projectDirty: boolean;
  viewLayers: NextTimelineViewLayers;
  viewLayerIds: readonly NextTimelineViewLayerId[];
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
    viewLayers: Record<NextTimelineViewLayerId, string>;
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
  toggleViewLayer: [layerId: NextTimelineViewLayerId];
  toggleOperatorEffects: [trackIndex: number];
  setLocale: [locale: 'zh-CN' | 'en' | 'ru'];
  setAppearance: [appearance: 'light' | 'dark'];
  clearSelection: [];
}>();

const renaming = ref(false);
const renameDraft = ref('');
const renameInput = ref<HTMLInputElement | null>(null);
const moreMenuOpen = ref(false);
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
        <div class="more-menu">
          <section class="more-menu__section">
            <h4>{{ labels.view }}</h4>
            <div class="view-layer-grid">
              <button
                v-for="layerId in viewLayerIds"
                :key="layerId"
                type="button"
                class="view-layer-toggle"
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
          <section class="more-menu__section more-menu__actions">
            <button type="button" @click="$emit('open')">{{ labels.open }}</button>
            <button type="button" @click="$emit('export')">{{ labels.export }}</button>
            <button type="button" @click="$emit('shortcuts')">{{ labels.shortcuts }}</button>
            <button type="button" class="danger" @click="$emit('reset')">
              {{ labels.reset }}
            </button>
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
              <span>{{ labels.appearance }}</span>
              <div class="segmented-control segmented-control--appearance">
                <button
                  type="button"
                  :class="{ active: appearance === 'light' }"
                  :title="labels.appearanceLight"
                  @click="$emit('setAppearance', 'light')"
                >
                  ☀
                </button>
                <button
                  type="button"
                  :class="{ active: appearance === 'dark' }"
                  :title="labels.appearanceDark"
                  @click="$emit('setAppearance', 'dark')"
                >
                  ◐
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
  gap: 3px;
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

.view-layer-toggle {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.view-layer-toggle svg {
  width: 13px;
  height: 13px;
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
  padding-top: 7px;
  border-top: 1px solid var(--ea-border-soft);
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
  display: flex;
  flex: 1;
  border: 1px solid var(--ea-border-soft);
}

.segmented-control button {
  min-width: 0;
  flex: 1;
  padding: 5px 4px;
  text-align: center;
}

.segmented-control button.active {
  background: var(--ea-active-fill);
  color: var(--ea-gold);
}

.segmented-control--appearance {
  flex: 0 0 58px;
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
