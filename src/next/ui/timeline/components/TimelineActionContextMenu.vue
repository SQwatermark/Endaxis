<script setup lang="ts">
/**
 * 时间轴动作的基础右键菜单，只负责定位、展示和派发命令意图。
 * 项目文档修改由编辑器应用层完成；Teleport 用于避免轨道裁剪和指针事件穿透。
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  visible: boolean;
  x: number;
  y: number;
  label: string;
  locked: boolean;
  disabled: boolean;
}>();

const emit = defineEmits<{
  close: [];
  delete: [];
  toggleLock: [];
  toggleDisabled: [];
}>();

const { t } = useI18n({ useScope: 'global' });
const menu = ref<HTMLElement | null>(null);
const left = ref(0);
const top = ref(0);

async function positionMenu(): Promise<void> {
  if (!props.visible) return;
  await nextTick();
  const rect = menu.value?.getBoundingClientRect();
  if (rect === undefined) return;
  const margin = 6;
  left.value = Math.max(margin, Math.min(props.x, window.innerWidth - rect.width - margin));
  top.value = Math.max(margin, Math.min(props.y, window.innerHeight - rect.height - margin));
}

function closeFromOutside(event: PointerEvent): void {
  if (!props.visible || menu.value?.contains(event.target as Node)) return;
  emit('close');
}

function closeFromKeyboard(event: KeyboardEvent): void {
  if (props.visible && event.key === 'Escape') emit('close');
}

watch(() => [props.visible, props.x, props.y], positionMenu, { immediate: true });

onMounted(() => {
  window.addEventListener('pointerdown', closeFromOutside, true);
  window.addEventListener('keydown', closeFromKeyboard);
  window.addEventListener('resize', positionMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', closeFromOutside, true);
  window.removeEventListener('keydown', closeFromKeyboard);
  window.removeEventListener('resize', positionMenu);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="menu"
      class="timeline-action-context-menu"
      :style="{ left: `${left}px`, top: `${top}px` }"
      role="menu"
      @contextmenu.prevent.stop
      @pointerdown.stop
      @pointermove.stop
      @wheel.stop
    >
      <div class="menu-header" :title="label">{{ label }}</div>
      <button class="menu-item delete-item" type="button" role="menuitem" @click="$emit('delete')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
        </svg>
        <span>{{ t('common.delete') }}</span>
        <kbd>Delete</kbd>
      </button>
      <div class="divider"></div>
      <button class="menu-item" type="button" role="menuitem" @click="$emit('toggleLock')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path v-if="locked" d="M7 11V7a5 5 0 0 1 9.9-1"></path>
          <path v-else d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>{{ t(locked ? 'contextMenu.unlockPosition' : 'contextMenu.lockPosition') }}</span>
      </button>
      <button class="menu-item" type="button" role="menuitem" @click="$emit('toggleDisabled')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <path v-if="disabled" d="M9 12l2 2 4-4"></path>
          <line v-else x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        </svg>
        <span>{{ t(disabled ? 'contextMenu.enableCalc' : 'contextMenu.disableCalc') }}</span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.timeline-action-context-menu {
  position: fixed;
  z-index: 10000;
  min-width: 180px;
  padding: 6px 0;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2b2b2b;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
  color: #e0e0e0;
  font:
    13px/1 'Segoe UI',
    Roboto,
    sans-serif;
  user-select: none;
}

.menu-header {
  max-width: 220px;
  margin-bottom: 4px;
  padding: 6px 12px 10px;
  overflow: hidden;
  border-bottom: 1px solid #3a3a3a;
  color: #888;
  font-size: 12px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-item {
  width: 100%;
  height: 32px;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 0;
  background: transparent;
  color: #ccc;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.menu-item:hover {
  background: #007fd4;
  color: #fff;
}

.menu-item.delete-item:hover {
  background: #ff7875;
}

.menu-item svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.menu-item kbd {
  color: #888;
  font:
    11px/1 Consolas,
    monospace;
}

.menu-item:hover kbd {
  color: rgba(255, 255, 255, 0.75);
}

.divider {
  height: 1px;
  margin: 4px 0;
  background: #444;
}
</style>
