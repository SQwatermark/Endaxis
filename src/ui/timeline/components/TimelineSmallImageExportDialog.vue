<script setup lang="ts">
/** 旧版小图预览与微调弹窗；预览节点也是最终 WebP 的唯一渲染源。 */
import { computed, nextTick, ref, watch } from 'vue';
import { snapdom } from '@zumer/snapdom';
import { ElLoading, ElMessage } from 'element-plus';
import {
  EaButton,
  EaDialog,
  EaDialogActions,
  EaInput,
  EaNumberInput,
  EaSwitch,
} from '@/design-system';
import TimelineShareCard, { type TimelineShareTrack } from './TimelineShareCard.vue';
import { downloadBlob, imageFilename } from '../timelineExport';

const props = defineProps<{
  visible: boolean;
  initialFilename: string;
  initialDuration: number;
  maxDuration: number;
  scenarioName: string;
  tracks: readonly TimelineShareTrack[];
  prepFrames: number;
  editorAppearance: 'light' | 'dark';
  labels: {
    title: string;
    filename: string;
    filenamePlaceholder: string;
    duration: string;
    durationHint: string;
    cardAppearance: string;
    light: string;
    dark: string;
    cardWidth: string;
    blockHeight: string;
    timeScale: string;
    showCombatIcons: string;
    showDurationBars: string;
    showKeycaps: string;
    showPrep: string;
    showTimeTicks: string;
    cancel: string;
    save: string;
    rendering: string;
    exported: (filename: string) => string;
    failed: (message: string) => string;
  };
}>();
const emit = defineEmits<{ 'update:visible': [visible: boolean] }>();
const shareCard = ref<{ rootEl: HTMLElement | null } | null>(null);
const form = ref({
  filename: '',
  duration: 60,
  cardWidth: 420,
  blockHeight: 22,
  pxPerSecond: 24,
  showCombatIcons: true,
  showDurationBars: true,
  showKeycaps: true,
  showPrep: true,
  showTimeTicks: true,
  appearance: 'dark' as 'light' | 'dark',
});

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    form.value = {
      filename: props.initialFilename.replace(/^Endaxis_Timeline_/i, 'Endaxis_Card_'),
      duration: props.initialDuration,
      cardWidth: 420,
      blockHeight: 22,
      pxPerSecond: 24,
      showCombatIcons: true,
      showDurationBars: true,
      showKeycaps: true,
      showPrep: true,
      showTimeTicks: true,
      appearance: props.editorAppearance,
    };
  },
);
const watermark = computed(() => form.value.filename.replace(/\.webp$/i, '').trim() || 'Endaxis');

async function save(): Promise<void> {
  const filename = imageFilename(form.value.filename, 'Endaxis_Card');
  const loading = ElLoading.service({
    lock: true,
    text: props.labels.rendering,
    background: 'rgba(0, 0, 0, 0.9)',
  });
  try {
    await nextTick();
    const root = shareCard.value?.rootEl;
    if (root === null || root === undefined) throw new Error('preview missing');
    const capture = await snapdom(root, {
      scale: 2,
      width: root.scrollWidth,
      height: root.scrollHeight,
      backgroundColor: form.value.appearance === 'light' ? '#f4f5f7' : '#191a1d',
    });
    downloadBlob(await capture.toBlob({ type: 'webp', quality: 0.94, dpr: 1 }), filename);
    ElMessage.success(props.labels.exported(filename));
    emit('update:visible', false);
  } catch (error) {
    ElMessage.error(props.labels.failed(error instanceof Error ? error.message : String(error)));
  } finally {
    loading.close();
  }
}
</script>

<template>
  <EaDialog
    :model-value="visible"
    :title="labels.title"
    width="880px"
    align-center
    class="custom-dialog small-image-export-dialog"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
  >
    <div class="small-export">
      <div class="small-export__preview">
        <div class="small-export__preview-scroll">
          <div class="small-export__preview-inner">
            <TimelineShareCard
              ref="shareCard"
              :scenario-name="scenarioName"
              :tracks="tracks"
              :prep-frames="prepFrames"
              :duration="form.duration"
              :card-width="form.cardWidth"
              :block-height="form.blockHeight"
              :px-per-second="form.pxPerSecond"
              :show-combat-icons="form.showCombatIcons"
              :show-duration-bars="form.showDurationBars"
              :show-keycaps="form.showKeycaps"
              :show-prep="form.showPrep"
              :show-time-ticks="form.showTimeTicks"
              :watermark="watermark"
              :appearance="form.appearance"
            />
          </div>
        </div>
      </div>
      <div class="small-export__controls">
        <div class="form-item form-item--row">
          <span>{{ labels.cardAppearance }}</span>
          <div class="appearance-buttons">
            <EaButton
              size="sm"
              :class="{ active: form.appearance === 'light' }"
              :title="labels.light"
              @click="form.appearance = 'light'"
              >☀</EaButton
            ><EaButton
              size="sm"
              :class="{ active: form.appearance === 'dark' }"
              :title="labels.dark"
              @click="form.appearance = 'dark'"
              >☾</EaButton
            >
          </div>
        </div>
        <div class="form-item">
          <label>{{ labels.filename }}</label
          ><EaInput v-model="form.filename" :placeholder="labels.filenamePlaceholder" />
        </div>
        <div class="form-item">
          <label>{{ labels.duration }}</label
          ><EaNumberInput
            v-model="form.duration"
            :min="10"
            :max="maxDuration"
            :step="10"
            :precision="0"
            style="width: 100%"
          /><small>{{ labels.durationHint }}</small>
        </div>
        <div class="form-item">
          <label>{{ labels.cardWidth }}</label>
          <div class="range-row">
            <input
              v-model.number="form.cardWidth"
              type="range"
              min="320"
              max="540"
              step="10"
            /><span>{{ form.cardWidth }}</span>
          </div>
        </div>
        <div class="form-item">
          <label>{{ labels.blockHeight }}</label>
          <div class="range-row">
            <input
              v-model.number="form.blockHeight"
              type="range"
              min="14"
              max="40"
              step="1"
            /><span>{{ form.blockHeight }}</span>
          </div>
        </div>
        <div class="form-item">
          <label>{{ labels.timeScale }}</label>
          <div class="range-row">
            <input
              v-model.number="form.pxPerSecond"
              type="range"
              min="6"
              max="40"
              step="1"
            /><span>{{ form.pxPerSecond }}</span>
          </div>
        </div>
        <div class="form-item form-item--row">
          <span>{{ labels.showCombatIcons }}</span
          ><EaSwitch v-model="form.showCombatIcons" :aria-label="labels.showCombatIcons" />
        </div>
        <div class="form-item form-item--row">
          <span>{{ labels.showDurationBars }}</span
          ><EaSwitch v-model="form.showDurationBars" :aria-label="labels.showDurationBars" />
        </div>
        <div class="form-item form-item--row">
          <span>{{ labels.showKeycaps }}</span
          ><EaSwitch v-model="form.showKeycaps" :aria-label="labels.showKeycaps" />
        </div>
        <div class="form-item form-item--row">
          <span>{{ labels.showPrep }}</span
          ><EaSwitch v-model="form.showPrep" :aria-label="labels.showPrep" />
        </div>
        <div class="form-item form-item--row">
          <span>{{ labels.showTimeTicks }}</span
          ><EaSwitch v-model="form.showTimeTicks" :aria-label="labels.showTimeTicks" />
        </div>
      </div>
    </div>
    <template #footer
      ><EaDialogActions
        ><EaButton size="sm" @click="emit('update:visible', false)">{{ labels.cancel }}</EaButton
        ><EaButton variant="primary" size="sm" @click="save">{{
          labels.save
        }}</EaButton></EaDialogActions
      ></template
    >
  </EaDialog>
</template>

<style scoped>
.small-export {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 16px;
  height: min(680px, 72vh);
}
.small-export__preview {
  min-width: 0;
  overflow: hidden;
  padding: 12px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-muted);
}
.small-export__preview-scroll {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.small-export__preview-inner {
  width: max-content;
  max-width: 100%;
  margin: 0 auto;
  padding-bottom: 12px;
}
.small-export__controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-item label,
.form-item--row span,
small {
  color: var(--ea-fg-secondary);
  font-size: 12px;
}
.form-item--row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.appearance-buttons,
.range-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.appearance-buttons .active {
  color: var(--ea-gold);
  border-color: var(--ea-gold);
}
.range-row input {
  flex: 1;
}
.range-row span {
  width: 32px;
  color: var(--ea-fg-secondary);
  font-size: 11px;
  text-align: right;
}
@media (max-width: 800px) {
  .small-export {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(240px, 55vh) auto;
    height: auto;
  }
  .small-export__controls {
    max-height: 40vh;
  }
}
</style>

<style>
.small-image-export-dialog.el-dialog {
  display: flex;
  max-height: 90vh;
  flex-direction: column;
  overflow: hidden;
}

.small-image-export-dialog .el-dialog__header,
.small-image-export-dialog .el-dialog__footer {
  flex: 0 0 auto;
}

.small-image-export-dialog .el-dialog__body {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}
</style>
