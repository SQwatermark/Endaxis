<script setup lang="ts">
/**
 * Next 时间轴的七列工作台外壳，复刻旧版面板几何和活动栏交互。
 * 内容区只通过插槽接入；本组件不读取项目、时间轴或战斗状态。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const WORKBENCH_LAYOUT_STORAGE_KEY = 'endaxis:next-timeline-workbench-layout:v1';
const DEFAULT_LEFT_WIDTH = 200;
const DEFAULT_RIGHT_WIDTH = 260;
const DEFAULT_BOTTOM_HEIGHT = 240;
const TIMELINE_MAIN_MIN_HEIGHT = 600;

const props = defineProps<{
  labels: {
    library: string;
    globalConfig: string;
    contract: string;
    contractUnavailable: string;
    resourceMonitor: string;
    inspector: string;
    battleLog: string;
    resetPanel: string;
    collapsePanel: string;
  };
}>();

const leftCollapsed = ref(false);
const rightCollapsed = ref(false);
const bottomCollapsed = ref(false);
const leftWidth = ref(DEFAULT_LEFT_WIDTH);
const rightWidth = ref(DEFAULT_RIGHT_WIDTH);
const bottomHeight = ref(DEFAULT_BOTTOM_HEIGHT);
const bottomTool = ref<'global' | 'contract' | 'enemy'>('enemy');
const rightTool = ref<'inspector' | 'battleLog'>('inspector');
const resizing = ref<'left' | 'right' | 'bottom' | null>(null);
let stopResize: (() => void) | null = null;

const layoutStyle = computed(() => ({
  gridTemplateColumns: `48px ${leftCollapsed.value ? 0 : leftWidth.value}px ${leftCollapsed.value ? 0 : 1}px minmax(540px, 1fr) ${rightCollapsed.value ? 0 : 1}px ${rightCollapsed.value ? 0 : rightWidth.value}px 48px`,
  gridTemplateRows: `50px minmax(${TIMELINE_MAIN_MIN_HEIGHT}px, 1fr) ${bottomCollapsed.value ? 0 : 1}px ${bottomCollapsed.value ? 0 : bottomHeight.value}px`,
}));
const leftStackStyle = computed(() => ({
  gridTemplateRows: `minmax(0, 1fr) ${bottomCollapsed.value ? 0 : 1}px ${bottomCollapsed.value ? 0 : bottomHeight.value}px`,
}));

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function restoreLayout(): void {
  let stored: unknown;
  try {
    const raw = window.localStorage.getItem(WORKBENCH_LAYOUT_STORAGE_KEY);
    if (raw === null) return;
    stored = JSON.parse(raw);
  } catch {
    return;
  }
  if (stored === null || typeof stored !== 'object') return;
  const value = stored as Record<string, unknown>;
  if (typeof value.leftCollapsed === 'boolean') leftCollapsed.value = value.leftCollapsed;
  if (typeof value.rightCollapsed === 'boolean') rightCollapsed.value = value.rightCollapsed;
  if (typeof value.bottomCollapsed === 'boolean') bottomCollapsed.value = value.bottomCollapsed;
  if (typeof value.leftWidth === 'number') leftWidth.value = clamp(value.leftWidth, 200, 480);
  if (typeof value.rightWidth === 'number') rightWidth.value = clamp(value.rightWidth, 260, 480);
  if (typeof value.bottomHeight === 'number')
    bottomHeight.value = clamp(value.bottomHeight, 240, 480);
  if (value.bottomTool === 'global' || value.bottomTool === 'enemy') {
    bottomTool.value = value.bottomTool;
  }
  if (value.rightTool === 'inspector' || value.rightTool === 'battleLog') {
    rightTool.value = value.rightTool;
  }
}

function persistLayout(): void {
  try {
    window.localStorage.setItem(
      WORKBENCH_LAYOUT_STORAGE_KEY,
      JSON.stringify({
        leftCollapsed: leftCollapsed.value,
        rightCollapsed: rightCollapsed.value,
        bottomCollapsed: bottomCollapsed.value,
        leftWidth: Math.round(leftWidth.value),
        rightWidth: Math.round(rightWidth.value),
        bottomHeight: Math.round(bottomHeight.value),
        bottomTool: bottomTool.value,
        rightTool: rightTool.value,
      }),
    );
  } catch {
    // Storage may be disabled; the workbench remains fully usable for this session.
  }
}

function resetPanelSize(panel: 'left' | 'right' | 'bottom'): void {
  if (panel === 'left') leftWidth.value = DEFAULT_LEFT_WIDTH;
  else if (panel === 'right') rightWidth.value = DEFAULT_RIGHT_WIDTH;
  else bottomHeight.value = DEFAULT_BOTTOM_HEIGHT;
}

function toggleLeft(): void {
  leftCollapsed.value = !leftCollapsed.value;
}

function selectBottom(tool: typeof bottomTool.value): void {
  if (tool === 'contract') return;
  if (!bottomCollapsed.value && bottomTool.value === tool) {
    bottomCollapsed.value = true;
    return;
  }
  bottomTool.value = tool;
  bottomCollapsed.value = false;
}

function selectRight(tool: typeof rightTool.value): void {
  if (!rightCollapsed.value && rightTool.value === tool) {
    rightCollapsed.value = true;
    return;
  }
  rightTool.value = tool;
  rightCollapsed.value = false;
}

function beginResize(target: NonNullable<typeof resizing.value>, event: PointerEvent): void {
  event.preventDefault();
  stopResize?.();
  resizing.value = target;
  const startX = event.clientX;
  const startY = event.clientY;
  const initialLeft = leftWidth.value;
  const initialRight = rightWidth.value;
  const initialBottom = bottomHeight.value;
  const onMove = (moveEvent: PointerEvent) => {
    if (target === 'left') {
      leftWidth.value = clamp(initialLeft + moveEvent.clientX - startX, 200, 480);
    } else if (target === 'right') {
      rightWidth.value = clamp(initialRight - moveEvent.clientX + startX, 260, 480);
    } else {
      bottomHeight.value = clamp(initialBottom - moveEvent.clientY + startY, 240, 480);
    }
  };
  const finish = () => {
    resizing.value = null;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', finish);
    window.removeEventListener('pointercancel', finish);
    stopResize = null;
  };
  stopResize = finish;
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', finish);
}

onBeforeUnmount(() => {
  stopResize?.();
});

onMounted(restoreLayout);
watch(
  [
    leftCollapsed,
    rightCollapsed,
    bottomCollapsed,
    leftWidth,
    rightWidth,
    bottomHeight,
    bottomTool,
    rightTool,
  ],
  persistLayout,
  { flush: 'post' },
);
</script>

<template>
  <div
    class="workbench-layout"
    :class="{
      'is-resizing': resizing !== null,
      'is-resizing-horizontal': resizing === 'left' || resizing === 'right',
      'is-resizing-vertical': resizing === 'bottom',
    }"
    :style="layoutStyle"
  >
    <aside class="activity-bar">
      <div class="activity-group">
        <button
          type="button"
          class="activity-button activity-button--library"
          :class="{ 'is-active': !leftCollapsed }"
          :aria-label="props.labels.library"
          :aria-pressed="!leftCollapsed"
          :data-tooltip="props.labels.library"
          @click="toggleLeft"
        >
          <img src="/icons/btn_character.webp" alt="" />
        </button>
      </div>
      <div class="activity-group activity-group--bottom">
        <button
          type="button"
          class="activity-button activity-button--global"
          :class="{ 'is-active': !bottomCollapsed && bottomTool === 'global' }"
          :aria-label="props.labels.globalConfig"
          :aria-pressed="!bottomCollapsed && bottomTool === 'global'"
          :data-tooltip="props.labels.globalConfig"
          @click="selectBottom('global')"
        >
          <img src="/icons/setting_tab_setting.webp" alt="" />
        </button>
        <button
          type="button"
          class="activity-button activity-button--contract"
          :class="{ 'is-disabled': true }"
          :aria-label="props.labels.contract"
          aria-disabled="true"
          :data-tooltip="props.labels.contractUnavailable"
          @click="selectBottom('contract')"
        >
          <img src="/contingency_contract/deco_contract_028.webp" alt="" />
        </button>
        <button
          type="button"
          class="activity-button activity-button--enemy"
          :class="{ 'is-active': !bottomCollapsed && bottomTool === 'enemy' }"
          :aria-label="props.labels.resourceMonitor"
          :aria-pressed="!bottomCollapsed && bottomTool === 'enemy'"
          :data-tooltip="props.labels.resourceMonitor"
          @click="selectBottom('enemy')"
        >
          <svg class="activity-icon" viewBox="0 0 288 288" aria-hidden="true">
            <defs>
              <mask id="next-enemy-panel-mask">
                <rect width="288" height="288" fill="black" />
                <g fill="white">
                  <rect x="74" y="38" width="140" height="38" />
                  <circle cx="80" cy="131" r="40" />
                  <path d="M40 89h208v105h-38l-18 20v42H96v-42l-18-20H40Z" />
                </g>
                <g fill="black">
                  <path d="m95 130 22 22-22 22-22-22Z" />
                  <path d="m193 130 22 22-22 22-22-22Z" />
                </g>
              </mask>
            </defs>
            <rect width="288" height="288" fill="currentColor" mask="url(#next-enemy-panel-mask)" />
          </svg>
        </button>
      </div>
    </aside>

    <aside v-show="!leftCollapsed" class="workbench-panel left-panel" :style="leftStackStyle">
      <div class="panel-chrome panel-chrome--left">
        <button
          type="button"
          class="panel-chrome__button"
          :title="props.labels.resetPanel"
          :aria-label="props.labels.resetPanel"
          @click="resetPanelSize('left')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        <button
          type="button"
          class="panel-chrome__button"
          :title="props.labels.collapsePanel"
          :aria-label="props.labels.collapsePanel"
          @click="toggleLeft"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
      </div>
      <div class="left-main">
        <slot name="left" :reset-panel="() => resetPanelSize('left')" />
      </div>
      <div v-show="!bottomCollapsed" class="left-bottom-separator"></div>
      <div v-show="!bottomCollapsed" class="left-bottom">
        <slot name="left-bottom" :tool="bottomTool" />
      </div>
    </aside>
    <div
      v-show="!leftCollapsed"
      class="resizer resizer--left"
      @pointerdown="beginResize('left', $event)"
      @dblclick="resetPanelSize('left')"
    ></div>

    <main class="timeline-main">
      <header class="timeline-header"><slot name="header" /></header>
      <div class="timeline-center"><slot /></div>
      <div
        v-show="!bottomCollapsed"
        class="bottom-resizer"
        @pointerdown="beginResize('bottom', $event)"
        @dblclick="resetPanelSize('bottom')"
      ></div>
      <section v-show="!bottomCollapsed" class="bottom-panel">
        <div class="panel-chrome panel-chrome--bottom">
          <button
            type="button"
            class="panel-chrome__button"
            :title="props.labels.resetPanel"
            :aria-label="props.labels.resetPanel"
            @click="resetPanelSize('bottom')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
          <button
            type="button"
            class="panel-chrome__button"
            :title="props.labels.collapsePanel"
            :aria-label="props.labels.collapsePanel"
            @click="bottomCollapsed = true"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
        </div>
        <slot name="bottom" :tool="bottomTool" />
      </section>
    </main>

    <div
      v-show="!rightCollapsed"
      class="resizer resizer--right"
      @pointerdown="beginResize('right', $event)"
      @dblclick="resetPanelSize('right')"
    ></div>
    <aside v-show="!rightCollapsed" class="workbench-panel right-panel">
      <div class="panel-chrome panel-chrome--right">
        <button
          type="button"
          class="panel-chrome__button"
          :title="props.labels.resetPanel"
          :aria-label="props.labels.resetPanel"
          @click="resetPanelSize('right')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        <button
          type="button"
          class="panel-chrome__button"
          :title="props.labels.collapsePanel"
          :aria-label="props.labels.collapsePanel"
          @click="rightCollapsed = true"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
      <slot name="right" :tool="rightTool" />
    </aside>

    <aside class="activity-bar activity-bar--right">
      <div class="activity-group">
        <button
          type="button"
          class="activity-button activity-button--inspector"
          :class="{ 'is-active': !rightCollapsed && rightTool === 'inspector' }"
          :aria-label="props.labels.inspector"
          :aria-pressed="!rightCollapsed && rightTool === 'inspector'"
          :data-tooltip="props.labels.inspector"
          @click="selectRight('inspector')"
        >
          <img src="/icons/btn_week_raid.webp" alt="" />
        </button>
        <button
          type="button"
          class="activity-button activity-button--battle-log"
          :class="{ 'is-active': !rightCollapsed && rightTool === 'battleLog' }"
          :aria-label="props.labels.battleLog"
          :aria-pressed="!rightCollapsed && rightTool === 'battleLog'"
          :data-tooltip="props.labels.battleLog"
          @click="selectRight('battleLog')"
        >
          <img src="/icons/btn_manual.webp" alt="" />
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.workbench-layout {
  width: 100vw;
  height: 100vh;
  display: grid;
  overflow: hidden;
  background: var(--ea-workbench);
  color: var(--ea-fg);
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  letter-spacing: 0;
}

.workbench-layout.is-resizing {
  user-select: none;
}

.workbench-layout.is-resizing-horizontal,
.workbench-layout.is-resizing-horizontal * {
  cursor: ew-resize !important;
}

.workbench-layout.is-resizing-vertical,
.workbench-layout.is-resizing-vertical * {
  cursor: ns-resize !important;
}

.activity-bar {
  position: relative;
  z-index: 50;
  grid-column: 1;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0 12px;
  border-right: 1px solid var(--ea-border-soft);
  background: var(--ea-activity-bg);
}

.activity-bar--right {
  grid-column: 7;
  border-right: 0;
  border-left: 1px solid var(--ea-border-soft);
}

.activity-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: 2px;
}

.activity-group--bottom {
  margin-top: auto;
  padding-top: 14px;
}

.activity-button {
  position: relative;
  width: 100%;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--ea-icon-muted);
  cursor: pointer;
  padding: 0;
}

.activity-button::before {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  z-index: 30;
  padding: 5px 8px;
  border: 1px solid var(--ea-border);
  background: var(--ea-tooltip-bg);
  color: var(--ea-icon-strong);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translate(6px, -50%);
  pointer-events: none;
  box-shadow: 0 6px 18px var(--ea-shadow);
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}

.activity-bar--right .activity-button::before {
  left: auto;
  right: calc(100% + 8px);
  transform: translate(-6px, -50%);
}

.activity-button::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 34px;
  height: 34px;
  border: 1px solid var(--ea-border-soft);
  border-radius: 8px;
  background: var(--ea-fill-soft);
  opacity: 0;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.activity-button:hover::before {
  opacity: 1;
  transform: translate(0, -50%);
}

.activity-button:hover::after,
.activity-button.is-active::after {
  opacity: 1;
}

.activity-button img,
.activity-icon {
  position: relative;
  z-index: 1;
  width: 28px;
  height: 28px;
  object-fit: contain;
  opacity: 0.78;
  transition:
    transform 0.14s ease,
    opacity 0.14s ease,
    filter 0.14s ease;
}

.activity-button--library img,
.activity-button--global img,
.activity-button--inspector img,
.activity-button--battle-log img,
.activity-icon {
  width: 24px;
  height: 24px;
}

.activity-button:hover img,
.activity-button:hover .activity-icon,
.activity-button.is-active img,
.activity-button.is-active .activity-icon {
  opacity: 1;
  transform: translateY(-2px) scale(1.06);
  filter: drop-shadow(0 2px 8px rgb(255 255 255 / 20%));
}

.activity-button.is-disabled {
  cursor: not-allowed;
}

.activity-button.is-disabled::after {
  opacity: 0;
}

.activity-button.is-disabled img,
.activity-button.is-disabled:hover img {
  opacity: 0.32;
  transform: none;
  filter: grayscale(1);
}

:global(html[data-theme='light']) .activity-button img {
  filter: brightness(0) opacity(0.72);
  opacity: 1;
}

:global(html[data-theme='light']) .activity-button.is-active img {
  filter: brightness(0) opacity(0.92);
}

:global(html[data-theme='light']) .activity-button:hover img,
:global(html[data-theme='light']) .activity-button.is-active:hover img {
  filter: brightness(0) opacity(1);
}

.workbench-panel {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--ea-workbench-panel);
}

.panel-chrome {
  position: absolute;
  top: 8px;
  right: 0;
  z-index: 35;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px 2px 6px;
  border: 1px solid var(--ea-border-soft);
  border-right: 0;
  border-radius: 8px 0 0 8px;
  background: var(--ea-panel-chrome-bg);
  backdrop-filter: blur(4px);
  opacity: 0.18;
  transform: translateX(2px);
  transition:
    opacity 0.14s ease,
    background-color 0.14s ease,
    transform 0.14s ease;
}

.workbench-panel:hover > .panel-chrome,
.panel-chrome:focus-within {
  opacity: 1;
  background: var(--ea-panel-chrome-bg-hover);
  transform: translateX(0);
}

.panel-chrome__button {
  width: 20px;
  height: 20px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--ea-icon-muted);
  cursor: pointer;
}

.panel-chrome__button:hover,
.panel-chrome__button:focus-visible {
  background: var(--ea-hover-fill);
  color: var(--ea-icon-strong);
}

.panel-chrome__button svg {
  width: 11px;
  height: 11px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.left-panel {
  grid-column: 2;
  grid-row: 1 / -1;
  display: grid;
}

.left-main,
.left-bottom {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.left-bottom-separator {
  min-width: 0;
  min-height: 0;
  background: var(--ea-border-soft);
}

.timeline-main {
  position: relative;
  grid-column: 4;
  grid-row: 1 / -1;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: subgrid;
  overflow: hidden;
  background: var(--ea-workbench-main);
}

.timeline-header {
  grid-row: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-header);
}

.timeline-center {
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.bottom-resizer {
  grid-row: 3;
  background: var(--ea-border-soft);
  cursor: ns-resize;
  touch-action: none;
}

.bottom-panel {
  grid-row: 4;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--ea-workbench-panel);
}

.right-panel {
  grid-column: 6;
  grid-row: 1 / -1;
}

.resizer {
  position: relative;
  grid-row: 1 / -1;
  z-index: 30;
  background: var(--ea-border-soft);
  cursor: ew-resize;
  touch-action: none;
}

.resizer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 9px;
  height: 100%;
  transform: translateX(-50%);
}

.resizer:hover {
  background: var(--ea-active-fill);
}

.resizer--left {
  grid-column: 3;
}

.resizer--right {
  grid-column: 5;
}
</style>
