<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  x: number;
  y: number;
  frame: number;
  canTargetTrack: boolean;
  hasSimulationStart: boolean;
  hasSimulationEnd: boolean;
  existingLabel?: string;
  labels: {
    title: string;
    deleteMarker: string;
    addCycle: string;
    addSimulationStart: string;
    removeSimulationStart: string;
    addSimulationEnd: string;
    removeSimulationEnd: string;
    switchOperator: string;
    restrictedHint: string;
    operatorHit: string;
    operatorWeakness: string;
    teamHit: string;
  };
}>();
const emit = defineEmits<{
  close: [];
  addCycle: [];
  toggleSimulationStart: [];
  toggleSimulationEnd: [];
  addSwitch: [];
  addOperatorHit: [];
  addOperatorWeakness: [];
  addTeamHit: [];
  delete: [];
}>();
const menu = ref<HTMLElement | null>(null);
const left = ref(0);
const top = ref(0);

async function position(): Promise<void> {
  if (!props.visible) return;
  await nextTick();
  const rect = menu.value?.getBoundingClientRect();
  if (rect === undefined) return;
  left.value = Math.max(6, Math.min(props.x, window.innerWidth - rect.width - 6));
  top.value = Math.max(6, Math.min(props.y, window.innerHeight - rect.height - 6));
  menu.value?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
}
function outside(event: PointerEvent): void {
  if (props.visible && !menu.value?.contains(event.target as Node)) emit('close');
}
function keyboard(event: KeyboardEvent): void {
  if (props.visible && event.key === 'Escape') emit('close');
}
watch(() => [props.visible, props.x, props.y], position, { immediate: true });
onMounted(() => {
  window.addEventListener('pointerdown', outside, true);
  window.addEventListener('keydown', keyboard);
});
onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', outside, true);
  window.removeEventListener('keydown', keyboard);
});
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="menu"
      class="marker-context-menu"
      role="menu"
      :aria-label="labels.title"
      :style="{ left: `${left}px`, top: `${top}px` }"
      @pointerdown.stop
      @contextmenu.prevent
    >
      <header>{{ labels.title }} · {{ frame }}f</header>
      <template v-if="existingLabel">
        <small>{{ existingLabel }}</small>
        <button role="menuitem" class="danger" @click="$emit('delete')">
          {{ labels.deleteMarker }}
        </button>
      </template>
      <template v-else>
        <button role="menuitem" @click="$emit('addCycle')">{{ labels.addCycle }}</button>
        <button role="menuitem" @click="$emit('toggleSimulationStart')">
          {{ hasSimulationStart ? labels.removeSimulationStart : labels.addSimulationStart }}
        </button>
        <button role="menuitem" @click="$emit('toggleSimulationEnd')">
          {{ hasSimulationEnd ? labels.removeSimulationEnd : labels.addSimulationEnd }}
        </button>
        <button role="menuitem" :disabled="!canTargetTrack" @click="$emit('addSwitch')">
          {{ labels.switchOperator }}
        </button>
        <div></div>
        <small>{{ labels.restrictedHint }}</small>
        <button role="menuitem" :disabled="!canTargetTrack" @click="$emit('addOperatorHit')">
          {{ labels.operatorHit }}
        </button>
        <button role="menuitem" :disabled="!canTargetTrack" @click="$emit('addOperatorWeakness')">
          {{ labels.operatorWeakness }}
        </button>
        <button role="menuitem" @click="$emit('addTeamHit')">{{ labels.teamHit }}</button>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.marker-context-menu {
  position: fixed;
  z-index: 10000;
  min-width: 220px;
  padding: 6px 0;
  border: 1px solid #444;
  border-radius: 6px;
  background: #2b2b2b;
  box-shadow: 0 6px 16px rgb(0 0 0 / 60%);
  color: #ddd;
  font:
    13px/1.2 'Segoe UI',
    sans-serif;
}
.marker-context-menu header,
.marker-context-menu small {
  display: block;
  padding: 7px 12px;
  color: #888;
}
.marker-context-menu > div {
  height: 1px;
  margin: 4px 0;
  background: #444;
}
.marker-context-menu button {
  width: 100%;
  height: 31px;
  padding: 0 12px;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.marker-context-menu button:hover:not(:disabled) {
  background: #007fd4;
  color: #fff;
}
.marker-context-menu button.danger:hover:not(:disabled) {
  background: #ff7875;
}
.marker-context-menu button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
