<script setup lang="ts">
import { EaButton, EaDialog, EaNumberInput } from '@/design-system';
import { computed, onMounted, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CombatStateGraph } from '../../../core/combat/state/combatState';
import InputRegionBoundary from '../../keyboard/InputRegionBoundary.vue';
import { formatCombatStateInspection } from './combatStateInspection';

const props = defineProps<{
  initialFrame: number;
  minFrame: number;
  maxFrame: number;
  capture: (frame: number) => CombatStateGraph;
}>();
const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const frame = ref(props.initialFrame);
const capturedFrame = ref<number | null>(null);
const state = shallowRef<CombatStateGraph | null>(null);
const section = ref<keyof CombatStateGraph | 'all'>('shared');
const busy = ref(false);
const error = ref('');
// 仅保留当前只读切面内的导航位置，不创建另一套战斗对象索引。
const trail = shallowRef<{ label: string; value: unknown }[]>([]);
const query = ref('');
const notFound = ref(false);
const output = ref<HTMLTextAreaElement | null>(null);
watch([state, section], () => {
  trail.value = [];
});
let disposed = false;
onScopeDispose(() => {
  disposed = true;
});
const sections = computed(() =>
  state.value ? (Object.keys(state.value) as (keyof CombatStateGraph)[]) : [],
);
const inspected = computed(() =>
  trail.value.length > 0
    ? trail.value.at(-1)!.value
    : section.value === 'all'
      ? state.value
      : state.value?.[section.value],
);
const children = computed(() => {
  const value = inspected.value;
  if (value instanceof Map)
    return [...value].map(([key, entry], index) => ({
      label: typeof key === 'object' && key !== null ? `[${index}]` : String(key),
      value: entry,
    }));
  if (value instanceof Set)
    return [...value].map((entry, index) => ({ label: `[${index}]`, value: entry }));
  if (value !== null && typeof value === 'object')
    return Object.entries(value).map(([label, entry]) => ({ label, value: entry }));
  return [];
});
const text = computed(() =>
  state.value === null ? '' : formatCombatStateInspection(inspected.value),
);
watch([query, text], () => {
  notFound.value = false;
});
function enter(event: Event) {
  const select = event.target as HTMLSelectElement;
  const child = children.value[Number(select.value)];
  if (child) trail.value = [...trail.value, child];
  select.value = '';
}
function findNext() {
  const element = output.value;
  if (!element || !query.value) return;
  const index = text.value.indexOf(query.value, element.selectionEnd);
  const match = index < 0 ? text.value.indexOf(query.value) : index;
  notFound.value = match < 0;
  if (match < 0) return;
  element.focus();
  element.setSelectionRange(match, match + query.value.length);
  // textarea 不会随 setSelectionRange 自动滚动到远处的匹配行。
  const line = text.value.slice(0, match).split('\n').length - 1;
  const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
  element.scrollTop = Math.max(0, line * lineHeight - element.clientHeight / 2);
}
async function capture() {
  if (busy.value) return;
  const requestedFrame = frame.value;
  if (
    !Number.isSafeInteger(requestedFrame) ||
    requestedFrame < props.minFrame ||
    requestedFrame > props.maxFrame
  ) {
    error.value = t('stateInspection.invalidFrame', { min: props.minFrame, max: props.maxFrame });
    return;
  }
  busy.value = true;
  error.value = '';
  // 先显示等待状态；诊断重跑不使用、替换或发布普通预览结果。
  await new Promise(resolve => setTimeout(resolve, 30));
  if (disposed) return;
  try {
    state.value = props.capture(requestedFrame);
    capturedFrame.value = requestedFrame;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause);
  } finally {
    busy.value = false;
  }
}
onMounted(capture);
</script>

<template>
  <InputRegionBoundary label="CombatStateInspectionDialog" :active="true" modal>
    <EaDialog
      :model-value="true"
      :title="t('stateInspection.title')"
      width="min(1000px, 94vw)"
      @update:model-value="emit('close')"
    >
      <div class="state-inspection">
        <div class="state-inspection__toolbar">
          <label
            >{{ t('stateInspection.frame') }}
            <EaNumberInput v-model="frame" :min="minFrame" :max="maxFrame" :step="1"
          /></label>
          <EaButton :disabled="busy" @click="capture">{{
            t(busy ? 'stateInspection.loading' : 'stateInspection.capture')
          }}</EaButton>
          <select v-model="section" :aria-label="t('stateInspection.section')">
            <option value="all">{{ t('stateInspection.all') }}</option>
            <option v-for="key in sections" :key="key" :value="key">{{ key }}</option>
          </select>
          <span v-if="capturedFrame !== null"
            >{{ capturedFrame }}f · {{ (capturedFrame / 30).toFixed(3) }}s</span
          >
        </div>
        <div class="state-inspection__toolbar" v-if="state">
          <EaButton :disabled="trail.length === 0" @click="trail = []">{{
            section === 'all' ? t('stateInspection.all') : section
          }}</EaButton>
          <EaButton
            v-for="(entry, index) in trail"
            :key="index"
            @click="trail = trail.slice(0, index + 1)"
            >{{ entry.label }}</EaButton
          >
          <select
            v-if="children.length"
            value=""
            :aria-label="t('stateInspection.enter')"
            @change="enter"
          >
            <option value="" disabled>
              {{ t('stateInspection.enter') }} ({{ children.length }})
            </option>
            <option v-for="(child, index) in children" :key="index" :value="index">
              {{ child.label }}
            </option>
          </select>
        </div>
        <p>{{ t('stateInspection.hint') }}</p>
        <p v-if="error" role="alert">{{ error }}</p>
        <form class="state-inspection__toolbar" @submit.prevent="findNext">
          <input
            v-model="query"
            type="search"
            :placeholder="t('stateInspection.search')"
            :aria-label="t('stateInspection.search')"
          />
          <EaButton type="submit" :disabled="!query || !text">{{
            t('stateInspection.next')
          }}</EaButton>
          <span v-if="notFound">{{ t('stateInspection.notFound') }}</span>
        </form>
        <textarea
          ref="output"
          :value="text"
          readonly
          spellcheck="false"
          :aria-label="t('stateInspection.title')"
        />
      </div>
    </EaDialog>
  </InputRegionBoundary>
</template>

<style scoped>
.state-inspection {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.state-inspection__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.state-inspection__toolbar label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.state-inspection__toolbar :deep(.ea-number-input) {
  width: 110px;
}
p {
  margin: 0;
  color: var(--ea-fg-muted);
}
select,
input,
textarea {
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
  border: 1px solid var(--ea-border);
}
select {
  max-width: 100%;
}
.state-inspection__toolbar :deep(button) {
  max-width: 100%;
  overflow-wrap: anywhere;
}
input {
  padding: 6px 8px;
}
textarea {
  width: 100%;
  height: 60vh;
  box-sizing: border-box;
  resize: vertical;
  padding: 12px;
  font:
    12px/1.5 Consolas,
    monospace;
  white-space: pre;
}
</style>
