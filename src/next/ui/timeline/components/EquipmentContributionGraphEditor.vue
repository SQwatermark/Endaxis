<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type {
  EquipmentContributionDefinition,
  EquipmentEventHandlerDefinition,
  EquipmentModifierDefinition,
} from '../../../core/game-data/equipmentDefinition';
import type { CombatStepDefinition, LevelValues } from '../../../core/game-data/operatorDefinition';
import { buildEquipmentContributionMindMap } from '../skillStructureMindMapModel';
import {
  replaceStructureValueAtPath,
  resolveStructureValue,
} from '../skillStructureEditorCommands';
import SkillStructureMindMap from './SkillStructureMindMap.vue';
import CombatEventTriggerEditor from './CombatEventTriggerEditor.vue';
import CombatStepEditor from './CombatStepEditor.vue';

const props = defineProps<{
  contribution: EquipmentContributionDefinition;
  label: string;
  level: number;
}>();
const emit = defineEmits<{ update: [contribution: EquipmentContributionDefinition] }>();
const selectedPath = ref('');
const selectedId = ref('equipment:contribution');
const structure = computed(() =>
  buildEquipmentContributionMindMap(props.contribution, props.label),
);
const selectedValue = computed(() => resolveStructureValue(props.contribution, selectedPath.value));
const selectedModifier = computed(() =>
  /^modifiers\[\d+\]$/.test(selectedPath.value)
    ? (selectedValue.value as EquipmentModifierDefinition)
    : null,
);
const selectedHandler = computed(() =>
  /^eventHandlers\[\d+\]$/.test(selectedPath.value)
    ? (selectedValue.value as EquipmentEventHandlerDefinition)
    : null,
);
const selectedStep = computed(() =>
  /\.steps\[\d+\]$/.test(selectedPath.value) ? (selectedValue.value as CombatStepDefinition) : null,
);

watch(
  () => props.contribution,
  () => {
    if (resolveStructureValue(props.contribution, selectedPath.value) !== undefined) return;
    selectedPath.value = '';
    selectedId.value = 'equipment:contribution';
  },
);

function selectNode(node: { id: string; sourcePath: string }): void {
  selectedId.value = node.id;
  selectedPath.value = node.sourcePath;
}

function replaceSelected(value: unknown): void {
  if (selectedPath.value === '') return;
  emit('update', replaceStructureValueAtPath(props.contribution, selectedPath.value, value));
}

function parseLevelValues(event: Event): void {
  const modifier = selectedModifier.value;
  if (modifier === null) return;
  const tokens = (event.target as HTMLInputElement).value.split(',').map(value => value.trim());
  const values = tokens.map(Number);
  if (
    tokens.some(value => value === '') ||
    values.length === 0 ||
    values.some(value => !Number.isFinite(value))
  )
    return;
  const levelValues: LevelValues = values.length === 1 ? values[0]! : values;
  replaceSelected({ ...modifier, value: levelValues });
}

function levelValuesText(value: LevelValues): string {
  return Array.isArray(value) ? value.join(', ') : String(value);
}
</script>

<template>
  <div class="contribution-editor">
    <SkillStructureMindMap
      class="contribution-map"
      :root="structure"
      :selected-id="selectedId"
      :show-reference-pins="false"
      @select="selectNode"
    />
    <aside class="contribution-inspector">
      <template v-if="selectedModifier">
        <header>
          <strong>属性修正</strong><span>{{ selectedModifier.kind }}</span>
        </header>
        <label>
          <span>等级值</span>
          <input :value="levelValuesText(selectedModifier.value)" @change="parseLevelValues" />
          <small>单值或逗号分隔的逐级数值；当前预览等级 {{ level }}。</small>
        </label>
        <div class="readout" v-for="(value, key) in selectedModifier" :key="key">
          <span>{{ key }}</span
          ><code>{{ value }}</code>
        </div>
      </template>
      <template v-else-if="selectedHandler">
        <header>
          <strong>事件响应</strong><span>{{ selectedHandler.key }}</span>
        </header>
        <label>
          <span>稳定 key</span>
          <input
            :value="selectedHandler.key"
            @change="
              replaceSelected({
                ...selectedHandler,
                key: ($event.target as HTMLInputElement).value,
              })
            "
          />
        </label>
        <CombatEventTriggerEditor
          :event="selectedHandler.event"
          @update="replaceSelected({ ...selectedHandler, event: $event })"
        />
        <p class="hint">条件保持原定义；在条件节点接入导图前不会被扁平化或丢弃。</p>
      </template>
      <CombatStepEditor
        v-else-if="selectedStep"
        :step="selectedStep"
        :skill-level="level"
        :show-header="false"
        inspector-only
        @update="replaceSelected"
      />
      <template v-else>
        <header>
          <strong>{{ label }}</strong
          ><span>当前层</span>
        </header>
        <p class="hint">在画布中选择属性修正、事件响应或响应序列里的步骤进行编辑。</p>
      </template>
    </aside>
  </div>
</template>

<style scoped>
.contribution-editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 34%);
  min-height: 520px;
  border: 1px solid var(--ea-border-soft);
}
.contribution-map {
  min-width: 0;
  min-height: 520px;
}
.contribution-inspector {
  min-width: 0;
  padding: 14px;
  overflow: auto;
  border-left: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
  container-type: inline-size;
}
header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}
header span,
.hint,
label span,
label small {
  color: var(--ea-fg-muted);
}
label {
  display: grid;
  gap: 6px;
  margin-top: 14px;
  font-size: 11px;
}
input {
  width: 100%;
  min-width: 0;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
.readout {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 8px;
  margin-top: 10px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.readout code {
  min-width: 0;
  color: var(--ea-fg-secondary);
  overflow-wrap: anywhere;
}
.hint {
  line-height: 1.55;
}
@media (max-width: 820px) {
  .contribution-editor {
    grid-template-columns: 1fr;
  }
  .contribution-inspector {
    min-height: 260px;
    border-left: 0;
    border-top: 1px solid var(--ea-border-soft);
  }
}
</style>
