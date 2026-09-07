<script setup lang="ts">
import type { DefinitionDraftHistory } from '../useDefinitionDraftHistory';

defineProps<{
  history: Pick<DefinitionDraftHistory<unknown>, 'restore' | 'canUndo' | 'canRedo'>;
}>();
</script>

<template>
  <div class="definition-history-controls" aria-label="当前保存范围的历史记录">
    <button
      type="button"
      class="ea-btn ea-btn--sm"
      :disabled="!history.canUndo.value"
      @click="history.restore('undo')"
    >
      撤销
    </button>
    <button
      type="button"
      class="ea-btn ea-btn--sm"
      :disabled="!history.canRedo.value"
      @click="history.restore('redo')"
    >
      重做
    </button>
  </div>
</template>

<style scoped>
.definition-history-controls {
  display: flex;
  flex: none;
  gap: 8px;
}
</style>
