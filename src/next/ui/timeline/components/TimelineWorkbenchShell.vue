<script setup lang="ts">
/**
 * Next 时间轴的七列工作台外壳，复刻旧版面板几何和活动栏交互。
 * 内容区只通过插槽接入；本组件不读取项目、时间轴或战斗状态。
 */
import { computed, onBeforeUnmount, ref } from 'vue';

const props = defineProps<{
  labels: {
    library: string;
    globalConfig: string;
    contract: string;
    resourceMonitor: string;
    inspector: string;
    battleLog: string;
  };
}>();

const leftCollapsed = ref(false);
const rightCollapsed = ref(false);
const bottomCollapsed = ref(false);
const leftWidth = ref(200);
const rightWidth = ref(260);
const bottomHeight = ref(240);
const bottomTool = ref<'global' | 'contract' | 'enemy'>('enemy');
const rightTool = ref<'inspector' | 'battleLog'>('inspector');
const resizing = ref<'left' | 'right' | 'bottom' | null>(null);

const layoutStyle = computed(() => ({
  gridTemplateColumns: `48px ${leftCollapsed.value ? 0 : leftWidth.value}px ${leftCollapsed.value ? 0 : 1}px minmax(540px, 1fr) ${rightCollapsed.value ? 0 : 1}px ${rightCollapsed.value ? 0 : rightWidth.value}px 48px`,
  gridTemplateRows: `50px minmax(360px, 1fr) ${bottomCollapsed.value ? 0 : 1}px ${bottomCollapsed.value ? 0 : bottomHeight.value}px`,
}));
const leftStackStyle = computed(() => ({
  gridTemplateRows: `minmax(0, 1fr) ${bottomCollapsed.value ? 0 : bottomHeight.value}px`,
}));

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function toggleLeft(): void {
  leftCollapsed.value = !leftCollapsed.value;
}

function selectBottom(tool: typeof bottomTool.value): void {
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
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', finish);
}

onBeforeUnmount(() => {
  resizing.value = null;
});
</script>

<template>
  <div class="workbench-layout" :class="{ 'is-resizing': resizing !== null }" :style="layoutStyle">
    <aside class="activity-bar">
      <div class="activity-group">
        <button
          type="button"
          class="activity-button"
          :class="{ 'is-active': !leftCollapsed }"
          :aria-label="props.labels.library"
          :data-tooltip="props.labels.library"
          @click="toggleLeft"
        >
          <img src="/icons/btn_character.webp" alt="" />
        </button>
      </div>
      <div class="activity-group activity-group--bottom">
        <button
          type="button"
          class="activity-button"
          :class="{ 'is-active': !bottomCollapsed && bottomTool === 'global' }"
          :aria-label="props.labels.globalConfig"
          :data-tooltip="props.labels.globalConfig"
          @click="selectBottom('global')"
        >
          <img src="/icons/setting_tab_setting.webp" alt="" />
        </button>
        <button
          type="button"
          class="activity-button"
          :class="{ 'is-active': !bottomCollapsed && bottomTool === 'contract' }"
          :aria-label="props.labels.contract"
          :data-tooltip="props.labels.contract"
          @click="selectBottom('contract')"
        >
          <img src="/contingency_contract/deco_contract_028.webp" alt="" />
        </button>
        <button
          type="button"
          class="activity-button activity-button--text"
          :class="{ 'is-active': !bottomCollapsed && bottomTool === 'enemy' }"
          :aria-label="props.labels.resourceMonitor"
          :data-tooltip="props.labels.resourceMonitor"
          @click="selectBottom('enemy')"
        >
          <span>敌</span>
        </button>
      </div>
    </aside>

    <aside v-show="!leftCollapsed" class="workbench-panel left-panel" :style="leftStackStyle">
      <div class="left-main"><slot name="left" /></div>
      <div v-show="!bottomCollapsed" class="left-bottom">
        <slot name="left-bottom" :tool="bottomTool" />
      </div>
    </aside>
    <div
      v-show="!leftCollapsed"
      class="resizer resizer--left"
      @pointerdown="beginResize('left', $event)"
      @dblclick="leftWidth = 200"
    ></div>

    <main class="timeline-main">
      <header class="timeline-header"><slot name="header" /></header>
      <div class="timeline-center"><slot /></div>
      <div
        v-show="!bottomCollapsed"
        class="bottom-resizer"
        @pointerdown="beginResize('bottom', $event)"
      ></div>
      <section v-show="!bottomCollapsed" class="bottom-panel">
        <slot name="bottom" :tool="bottomTool" />
      </section>
    </main>

    <div
      v-show="!rightCollapsed"
      class="resizer resizer--right"
      @pointerdown="beginResize('right', $event)"
      @dblclick="rightWidth = 260"
    ></div>
    <aside v-show="!rightCollapsed" class="workbench-panel right-panel">
      <slot name="right" :tool="rightTool" />
    </aside>

    <aside class="activity-bar activity-bar--right">
      <div class="activity-group">
        <button
          type="button"
          class="activity-button"
          :class="{ 'is-active': !rightCollapsed && rightTool === 'inspector' }"
          :aria-label="props.labels.inspector"
          :data-tooltip="props.labels.inspector"
          @click="selectRight('inspector')"
        >
          <img src="/icons/btn_week_raid.webp" alt="" />
        </button>
        <button
          type="button"
          class="activity-button"
          :class="{ 'is-active': !rightCollapsed && rightTool === 'battleLog' }"
          :aria-label="props.labels.battleLog"
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
.activity-button span {
  position: relative;
  z-index: 1;
  width: 24px;
  height: 24px;
  object-fit: contain;
  opacity: 0.78;
  transition:
    transform 0.14s ease,
    opacity 0.14s ease,
    filter 0.14s ease;
}

.activity-button span {
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 800;
}

.activity-button:hover img,
.activity-button:hover span,
.activity-button.is-active img,
.activity-button.is-active span {
  opacity: 1;
  transform: translateY(-2px) scale(1.06);
  filter: drop-shadow(0 2px 8px rgb(255 255 255 / 20%));
}

.workbench-panel {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--ea-workbench-panel);
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

.left-bottom {
  border-top: 1px solid var(--ea-border);
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
