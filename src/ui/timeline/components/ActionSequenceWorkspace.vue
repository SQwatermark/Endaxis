<script setup lang="ts">
import { markRaw, ref } from 'vue';
import type {
  ActionSequenceDefinition,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import type { EditableCombatStepKind } from '../skillDefinitionEditorViewModel';
import { useDefinitionDraftHistory } from '../useDefinitionDraftHistory';
import ActionSequenceGraphEditor from './ActionSequenceGraphEditor.vue';
import ActionSequenceEditor from './ActionSequenceEditor.vue';

const props = defineProps<{
  sequence: ActionSequenceDefinition;
  skillLevel: number;
  createStep: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep: (step: CombatStepDefinition) => CombatStepDefinition;
}>();
const emit = defineEmits<{ update: [sequence: ActionSequenceDefinition] }>();
// The host keys this workspace by editing context, not by mutable labels or view mode.
const history = markRaw(
  useDefinitionDraftHistory(
    () => props.sequence,
    value => emit('update', value),
  ),
);
const view = ref<'graph' | 'form'>('graph');
const formPath = ref('');
function showDetails(path: string): void {
  formPath.value = path;
  view.value = 'form';
}
</script>

<template>
  <section class="sequence-workspace">
    <nav class="sequence-view-tabs" aria-label="序列编辑视图">
      <button type="button" :class="{ active: view === 'graph' }" @click="view = 'graph'">
        结构导图
      </button>
      <button type="button" :class="{ active: view === 'form' }" @click="view = 'form'">
        完整表单
      </button>
    </nav>
    <ActionSequenceGraphEditor
      v-if="view === 'graph'"
      :sequence="sequence"
      :skill-level="skillLevel"
      :create-step="createStep"
      :duplicate-step="duplicateStep"
      :shared-history="history"
      @details="showDetails"
    />
    <div v-else class="sequence-form-scroll">
      <ActionSequenceEditor
        :sequence="sequence"
        :skill-level="skillLevel"
        :create-step="createStep"
        :duplicate-step="duplicateStep"
        :selected-path="formPath"
        standalone-history
        :shared-history="history"
      />
    </div>
  </section>
</template>

<style scoped>
.sequence-workspace {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.sequence-view-tabs {
  display: flex;
  flex: none;
  gap: 6px;
  padding: 6px 0;
}
.sequence-view-tabs button {
  border: 1px solid var(--ea-border);
  color: var(--ea-fg);
  background: var(--ea-fill-input);
  padding: 4px 8px;
}
.sequence-view-tabs .active {
  color: var(--ea-gold);
  border-color: var(--ea-gold);
}
.sequence-workspace > :deep(.sequence-graph) {
  flex: 1;
  height: auto;
  min-height: 0;
}
.sequence-form-scroll {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
}
</style>
