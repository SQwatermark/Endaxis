<script setup lang="ts">
/**
 * Next 时间轴的顶部方案工具栏，保持旧版的操作分区与视觉层级。
 * 当前尚未贯通的项目能力以禁用按钮占位，避免 UI 提前承诺不存在的行为。
 */
defineProps<{
  scenarioName: string;
  cursorText: string;
  canUndo: boolean;
  canRedo: boolean;
  canPaste: boolean;
  labels: {
    undo: string;
    redo: string;
    paste: string;
    rename: string;
    duplicate: string;
    add: string;
    analysis: string;
    export: string;
    more: string;
    reset: string;
  };
}>();

defineEmits<{
  undo: [];
  redo: [];
  paste: [];
  reset: [];
}>();
</script>

<template>
  <div class="scenario-toolbar">
    <div class="scenario-toolbar__project">
      <div class="history-actions">
        <button
          type="button"
          class="icon-button"
          :disabled="!canUndo"
          :title="labels.undo"
          @click="$emit('undo')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 7 4 12l5 5" />
            <path d="M5 12h8a6 6 0 0 1 6 6" />
          </svg>
        </button>
        <button
          type="button"
          class="icon-button"
          :disabled="!canRedo"
          :title="labels.redo"
          @click="$emit('redo')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 7 5 5-5 5" />
            <path d="M19 12h-8a6 6 0 0 0-6 6" />
          </svg>
        </button>
        <button
          type="button"
          class="icon-button"
          :disabled="!canPaste"
          :title="labels.paste"
          @click="$emit('paste')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="8" y="8" width="11" height="12" rx="1" />
            <path d="M16 8V4H5v12h3" />
          </svg>
        </button>
      </div>

      <span class="toolbar-separator"></span>

      <button type="button" class="icon-button" disabled :title="labels.rename">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m4 16-1 5 5-1L19 9l-4-4L4 16Z" />
          <path d="m13 7 4 4" />
        </svg>
      </button>
      <button type="button" class="icon-button" disabled :title="labels.duplicate">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V4H4v12h4" />
        </svg>
      </button>

      <div class="scenario-title" :title="scenarioName">
        <span>[</span><strong>{{ scenarioName }}</strong
        ><span>]</span>
      </div>
      <button type="button" class="scenario-tab is-active">01</button>
      <button type="button" class="icon-button add-button" disabled :title="labels.add">+</button>
    </div>

    <div class="scenario-toolbar__actions">
      <span class="cursor-position">{{ cursorText }}</span>
      <button type="button" class="command-button command-button--analysis" disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12a9 9 0 1 1-9-9v9Z" />
          <path d="M12 3a9 9 0 0 1 9 9h-9Z" />
        </svg>
        {{ labels.analysis }}
      </button>
      <button type="button" class="command-button command-button--export" disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 3h7v7" />
          <path d="m10 14 11-11" />
          <path d="M21 14v7H3V5h9" />
        </svg>
        {{ labels.export }}
      </button>
      <button type="button" class="command-button" disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
        {{ labels.more }}
      </button>
      <span class="toolbar-separator"></span>
      <button type="button" class="command-button command-button--reset" @click="$emit('reset')">
        {{ labels.reset }}
      </button>
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
  padding: 0 10px 0 8px;
  box-sizing: border-box;
  color: var(--ea-fg);
  user-select: none;
}

.scenario-toolbar__project,
.scenario-toolbar__actions,
.history-actions {
  min-width: 0;
  display: flex;
  align-items: center;
}

.scenario-toolbar__project {
  flex: 1 1 auto;
  gap: 5px;
}

.scenario-toolbar__actions {
  flex: 0 0 auto;
  gap: 8px;
}

.history-actions {
  gap: 2px;
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

.toolbar-separator {
  flex: 0 0 1px;
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background: var(--ea-border-soft);
}

.scenario-title {
  max-width: 180px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 6px;
  overflow: hidden;
  white-space: nowrap;
}

.scenario-title strong {
  overflow: hidden;
  text-overflow: ellipsis;
}

.scenario-tab {
  min-width: 42px;
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-tab-active-bg);
  color: var(--ea-tab-active-fg);
  font:
    700 12px/1 'Roboto Mono',
    Consolas,
    monospace;
}

.cursor-position {
  color: var(--ea-fg-muted);
  font-size: 11px;
  white-space: nowrap;
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

.command-button--reset:hover:not(:disabled) {
  border-color: #ff4d4f;
  color: #ff7875;
}

@media (max-width: 1080px) {
  .cursor-position,
  .command-button--analysis,
  .command-button--export {
    display: none;
  }
}
</style>
