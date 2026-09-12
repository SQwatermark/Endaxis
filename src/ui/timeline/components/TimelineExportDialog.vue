<script setup lang="ts">
/**
 * 时间轴的统一导出入口。
 *
 * 复刻旧版导出设置弹窗的字段、默认值和按钮顺序。组件只收集用户选择，项目序列化、
 * 剪贴板和图片渲染由时间轴页面执行，避免弹窗直接读取编辑会话。
 */
import { ref, watch } from 'vue';
import {
  EaButton,
  EaDialog,
  EaDialogActions,
  EaFormField,
  EaInput,
  EaNumberInput,
} from '@/design-system';

const props = defineProps<{
  visible: boolean;
  maxDuration: number;
  labels: {
    title: string;
    filename: string;
    filenamePlaceholder: string;
    duration: string;
    durationHint: string;
    cancel: string;
    exportJson: string;
    copyCode: string;
    exportSmallImage: string;
    exportImage: string;
  };
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
  exportJson: [filename: string];
  copyCode: [];
  exportSmallImage: [options: { filename: string; duration: number }];
  exportImage: [options: { filename: string; duration: number }];
}>();

const filename = ref('');
const duration = ref(60);

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    filename.value = `Endaxis_Timeline_${new Date().toISOString().slice(0, 10)}`;
    duration.value = Math.min(60, props.maxDuration);
  },
);

function options() {
  return {
    filename: filename.value.trim() || 'Endaxis_Export',
    duration: Math.max(10, Math.min(props.maxDuration, Math.round(duration.value || 60))),
  };
}
</script>

<template>
  <EaDialog
    :model-value="visible"
    :title="labels.title"
    width="640px"
    align-center
    class="custom-dialog export-settings-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <div class="export-form">
      <EaFormField control-id="export-filename" :label="labels.filename">
        <EaInput
          id="export-filename"
          v-model="filename"
          :placeholder="labels.filenamePlaceholder"
          size="lg"
        />
      </EaFormField>
      <EaFormField
        control-id="export-duration"
        :label="labels.duration"
        :hint="labels.durationHint"
      >
        <EaNumberInput
          id="export-duration"
          v-model="duration"
          :min="10"
          :max="maxDuration"
          :step="10"
          :precision="0"
          size="lg"
          style="width: 100%"
        />
      </EaFormField>
    </div>
    <template #footer>
      <EaDialogActions>
        <EaButton size="sm" type="button" @click="emit('update:visible', false)">
          {{ labels.cancel }}
        </EaButton>
        <EaButton
          variant="primary"
          size="sm"
          type="button"
          @click="emit('exportJson', options().filename)"
        >
          {{ labels.exportJson }}
        </EaButton>
        <EaButton variant="primary" size="sm" type="button" @click="emit('copyCode')">
          {{ labels.copyCode }}
        </EaButton>
        <EaButton
          variant="primary"
          size="sm"
          type="button"
          @click="emit('exportSmallImage', options())"
        >
          {{ labels.exportSmallImage }}
        </EaButton>
        <EaButton variant="primary" size="sm" type="button" @click="emit('exportImage', options())">
          {{ labels.exportImage }}
        </EaButton>
      </EaDialogActions>
    </template>
  </EaDialog>
</template>

<style scoped>
.export-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 0;
}
</style>
