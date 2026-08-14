<script setup lang="ts">
/**
 * 编辑技能每次释放时初始化的动作黑板。
 * 键是技能内部稳定身份，值可按技能等级变化；本组件只修改当前等级对应值。
 */
import { useI18n } from 'vue-i18n';
import type { LevelValues } from '../../../core/game-data/operatorDefinition';
import {
  replaceLevelValueForEditor,
  resolveLevelValueForEditor,
} from '../skillDefinitionEditorViewModel';
import EditorFieldLabel from './EditorFieldLabel.vue';

const props = defineProps<{
  blackboard: Readonly<Record<string, LevelValues>>;
  skillLevel: number;
}>();
const emit = defineEmits<{ update: [blackboard: Readonly<Record<string, LevelValues>>] }>();
const { t } = useI18n({ useScope: 'global' });

function entries(): readonly [string, LevelValues][] {
  return Object.entries(props.blackboard);
}

function addEntry(): void {
  let index = 1;
  while (`value${index}` in props.blackboard) index += 1;
  emit('update', { ...props.blackboard, [`value${index}`]: 0 });
}

function removeEntry(key: string): void {
  const next = { ...props.blackboard };
  delete next[key];
  emit('update', next);
}

function renameEntry(oldKey: string, event: Event): void {
  const newKey = (event.target as HTMLInputElement).value.trim();
  if (newKey.length === 0 || (newKey !== oldKey && newKey in props.blackboard)) return;
  const next: Record<string, LevelValues> = {};
  for (const [key, value] of entries()) next[key === oldKey ? newKey : key] = value;
  emit('update', next);
}

function setValue(key: string, value: LevelValues, event: Event): void {
  const number = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(number)) return;
  emit('update', {
    ...props.blackboard,
    [key]: replaceLevelValueForEditor(value, props.skillLevel, number),
  });
}
</script>

<template>
  <section class="editor-section">
    <div class="section-heading">
      <h4>{{ t('nextTimeline.skillEditing.initialBlackboard') }}</h4>
      <button
        type="button"
        class="icon-button"
        :title="t('nextTimeline.skillEditing.addBlackboardEntry')"
        @click="addEntry"
      >
        +
      </button>
    </div>
    <p class="skill-subsection-help">{{ t('nextTimeline.skillEditing.blackboardDescription') }}</p>
    <div v-if="entries().length === 0" class="editor-empty">—</div>
    <div v-else class="blackboard-list">
      <div
        v-for="([key, value], index) in entries()"
        :key="`${key}:${index}`"
        class="blackboard-entry"
      >
        <label>
          <EditorFieldLabel
            :label="t('nextTimeline.skillEditing.blackboardKey')"
            :help="t('nextTimeline.skillEditing.fieldHelp.initialBlackboardKey')"
          />
          <input type="text" :value="key" @change="renameEntry(key, $event)" />
        </label>
        <label>
          <EditorFieldLabel
            :label="t('nextTimeline.skillEditing.value')"
            :help="t('nextTimeline.skillEditing.fieldHelp.initialBlackboardValue')"
          />
          <input
            type="number"
            step="0.01"
            :value="resolveLevelValueForEditor(value, skillLevel) ?? 0"
            @input="setValue(key, value, $event)"
          />
        </label>
        <button
          type="button"
          class="icon-button icon-button--danger"
          :title="t('nextTimeline.skillEditing.deleteBlackboardEntry')"
          @click="removeEntry(key)"
        >
          ×
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skill-subsection-help {
  margin: 0 0 14px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.blackboard-list {
  display: grid;
  gap: 10px;
}

.blackboard-entry {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 30px;
  align-items: end;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--ea-border-soft);
}

.blackboard-entry label {
  display: grid;
  gap: 6px;
}

.blackboard-entry input {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  padding: 0 6px;
}
</style>
