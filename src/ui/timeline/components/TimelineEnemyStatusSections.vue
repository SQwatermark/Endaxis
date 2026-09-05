<script setup lang="ts">
/**
 * 旧版资源监控器的三段纵向骨架。每段内部仍共享“左侧状态摘要 / 右侧时间轴”坐标，
 * 本组件只负责段落折叠与持久化，不解释任何战斗数据。
 */
import { onMounted, reactive, watch } from 'vue';

type SectionKey = 'affliction' | 'poise' | 'sp';

const STORAGE_KEY = 'endaxis:next-enemy-status-sections:v1';
const sectionKeys: readonly SectionKey[] = ['affliction', 'poise', 'sp'];

const props = defineProps<{
  labels: Record<SectionKey, string>;
  collapseLabel: string;
  expandLabel: string;
}>();

const emit = defineEmits<{
  collapsePanel: [];
}>();

const collapsed = reactive<Record<SectionKey, boolean>>({
  affliction: false,
  poise: false,
  sp: false,
});

function toggle(key: SectionKey): void {
  const next = {
    affliction: collapsed.affliction,
    poise: collapsed.poise,
    sp: collapsed.sp,
    [key]: !collapsed[key],
  };
  if (sectionKeys.every(sectionKey => next[sectionKey])) {
    for (const sectionKey of sectionKeys) collapsed[sectionKey] = false;
    emit('collapsePanel');
    return;
  }
  collapsed[key] = next[key];
}

onMounted(() => {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as unknown;
    if (value === null || typeof value !== 'object') return;
    for (const key of sectionKeys) {
      if (typeof (value as Record<string, unknown>)[key] === 'boolean') {
        collapsed[key] = (value as Record<string, boolean>)[key]!;
      }
    }
    if (sectionKeys.every(key => collapsed[key])) {
      for (const key of sectionKeys) collapsed[key] = false;
    }
  } catch {
    // Storage is optional; section controls remain available in memory.
  }
});

watch(
  collapsed,
  value => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Ignore disabled storage.
    }
  },
  { deep: true, flush: 'post' },
);
</script>

<template>
  <div class="enemy-status-sections">
    <section
      v-for="key in sectionKeys"
      :key="key"
      class="enemy-status-section"
      :class="[`enemy-status-section--${key}`, { 'is-collapsed': collapsed[key] }]"
    >
      <span v-if="collapsed[key]" class="section-summary">{{ props.labels[key] }}</span>
      <button
        type="button"
        class="section-toggle"
        :title="collapsed[key] ? props.expandLabel : props.collapseLabel"
        :aria-label="`${collapsed[key] ? props.expandLabel : props.collapseLabel}：${props.labels[key]}`"
        :aria-expanded="!collapsed[key]"
        @click="toggle(key)"
      >
        <span class="section-toggle__chevron" aria-hidden="true"></span>
        <strong>{{ props.labels[key] }}</strong>
      </button>
      <div v-show="!collapsed[key]" class="section-content">
        <slot :name="key" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.enemy-status-sections {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-width: 1px;
  overflow: hidden auto;
  background: var(--ea-workbench-main, #18181c);
}

.enemy-status-section {
  position: relative;
  /* Every expanded section first reserves the legacy 14px topbar; only the
     remaining body space is distributed by the old 2:1:3 weights. */
  flex: var(--section-weight) 1 14px;
  min-height: 0;
  min-width: 1px;
  border-bottom: 1px solid var(--ea-border, rgb(255 255 255 / 10%));
}

.enemy-status-section:first-child::before {
  content: '';
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  left: 180px;
  height: 1px;
  background: var(--ea-divider, rgb(255 255 255 / 16%));
  pointer-events: none;
}

.enemy-status-section--affliction {
  --section-weight: 2;
}
.enemy-status-section--poise {
  --section-weight: 1;
}
.enemy-status-section--sp {
  --section-weight: 3;
}

.section-toggle {
  position: absolute;
  z-index: 40;
  top: 7px;
  left: calc(180px + (100% - 180px) / 2);
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 16px;
  padding: 0;
  border: 0;
  color: var(--ea-text-muted, rgb(255 255 255 / 45%));
  background: transparent;
  cursor: pointer;
}

.section-toggle strong {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.section-toggle__chevron {
  display: block;
  width: 8px;
  height: 8px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
}

.section-toggle:hover {
  color: var(--ea-fg, #fff);
}

.enemy-status-section.is-collapsed {
  flex: 0 0 14px;
  box-sizing: border-box;
  height: 14px;
  background: var(--ea-workbench-panel, #252526);
}

/* Preserve semantic order. Expanded sections absorb available space; only
   when all three are collapsed does the entire stack align to the bottom. */

.enemy-status-section.is-collapsed .section-toggle {
  width: 24px;
  height: 14px;
}

.section-summary {
  display: block;
  box-sizing: border-box;
  width: 180px;
  padding: 0 8px;
  line-height: 14px;
  color: var(--ea-text-secondary, rgb(255 255 255 / 70%));
  font-size: 10px;
}

.enemy-status-section.is-collapsed .section-toggle__chevron {
  flex: 0 0 auto;
  transform: rotate(-135deg);
}

.section-content {
  box-sizing: border-box;
  height: 100%;
  min-width: 1px;
  overflow: hidden;
}

.section-content > :deep(*) {
  height: 100%;
}
</style>
