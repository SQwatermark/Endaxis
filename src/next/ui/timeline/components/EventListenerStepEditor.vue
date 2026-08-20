<script setup lang="ts">
/**
 * 编辑技能时间线中的临时事件监听步骤。
 * 监听起止时间由外层调度项决定；这里仅维护事件匹配、条件和同步响应顺序。
 */
import { useI18n } from 'vue-i18n';
import type {
  CombatCondition,
  CombatEventResponseDefinition,
  CombatEventTrigger,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import { createCombatCondition } from '../combatConditionEditorViewModel';
import type { EditableCombatStepKind } from '../skillDefinitionEditorViewModel';
import { createCombatEventResponseDraft } from '../skillDefinitionEditorViewModel';
import ActionSequenceEditor from './ActionSequenceEditor.vue';
import CombatConditionEditor from './CombatConditionEditor.vue';
import CombatEventTriggerEditor from './CombatEventTriggerEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';

type ListenerStep = Extract<CombatStepDefinition, { kind: 'listenForCombatEvents' }>;

const props = defineProps<{
  step: ListenerStep;
  skillLevel: number;
  createStep?: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep?: (step: CombatStepDefinition) => CombatStepDefinition;
}>();
const emit = defineEmits<{ update: [step: ListenerStep] }>();
const { t } = useI18n({ useScope: 'global' });

function replaceResponses(responses: readonly CombatEventResponseDefinition[]): void {
  emit('update', { ...props.step, parameters: { responses } });
}

function replaceResponse(index: number, response: CombatEventResponseDefinition): void {
  replaceResponses(
    props.step.parameters.responses.map((item, itemIndex) =>
      itemIndex === index ? response : item,
    ),
  );
}

function addResponse(): void {
  replaceResponses([
    ...props.step.parameters.responses,
    createCombatEventResponseDraft(props.step.parameters.responses.map(response => response.key)),
  ]);
}

function removeResponse(index: number): void {
  if (props.step.parameters.responses.length <= 1) return;
  replaceResponses(props.step.parameters.responses.filter((_, itemIndex) => itemIndex !== index));
}

function setEvent(index: number, event: CombatEventTrigger): void {
  const response = props.step.parameters.responses[index];
  if (response !== undefined) replaceResponse(index, { ...response, event });
}

function toggleCondition(index: number, enabled: boolean): void {
  const response = props.step.parameters.responses[index];
  if (response === undefined) return;
  const next = { ...response };
  if (enabled) next.condition = createCombatCondition('combatActive');
  else delete next.condition;
  replaceResponse(index, next);
}

function setCondition(index: number, condition: CombatCondition): void {
  const response = props.step.parameters.responses[index];
  if (response !== undefined) replaceResponse(index, { ...response, condition });
}
</script>

<template>
  <div class="event-listener-editor">
    <p>{{ t('nextTimeline.skillEditing.eventListenerWindowHint') }}</p>
    <article
      v-for="(response, index) in step.parameters.responses"
      :key="`${response.key}:${index}`"
    >
      <header>
        <strong>{{ t('nextTimeline.skillEditing.eventResponse', { index: index + 1 }) }}</strong>
        <button
          type="button"
          :disabled="step.parameters.responses.length <= 1"
          @click="removeResponse(index)"
        >
          ×
        </button>
      </header>
      <label class="event-listener-editor__key">
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.handlerKey')"
          :help="t('nextTimeline.skillEditing.fieldHelp.handlerKey')"
        />
        <input
          type="text"
          :value="response.key"
          @input="
            replaceResponse(index, { ...response, key: ($event.target as HTMLInputElement).value })
          "
        />
      </label>
      <CombatEventTriggerEditor :event="response.event" @update="setEvent(index, $event)" />
      <label class="event-listener-editor__condition">
        <input
          type="checkbox"
          :checked="response.condition !== undefined"
          @change="toggleCondition(index, ($event.target as HTMLInputElement).checked)"
        />
        <span>{{ t('nextTimeline.skillEditing.additionalCondition') }}</span>
      </label>
      <CombatConditionEditor
        v-if="response.condition"
        :condition="response.condition"
        @update="setCondition(index, $event)"
      />
      <ActionSequenceEditor
        :sequence="response.sequence"
        :skill-level="skillLevel"
        :create-step="createStep!"
        :duplicate-step="duplicateStep!"
        @update="replaceResponse(index, { ...response, sequence: $event })"
      />
    </article>
    <button type="button" class="event-listener-editor__add" @click="addResponse">
      + {{ t('nextTimeline.skillEditing.addEventResponse') }}
    </button>
  </div>
</template>

<style scoped>
.event-listener-editor {
  display: grid;
  gap: 12px;
  padding: 14px;
}
.event-listener-editor > p {
  margin: 0;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.event-listener-editor article {
  display: grid;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--ea-border-soft);
}
.event-listener-editor header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.event-listener-editor button {
  min-height: 30px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  cursor: pointer;
}
.event-listener-editor button:disabled {
  opacity: 0.35;
  cursor: default;
}
.event-listener-editor__key {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.event-listener-editor__condition {
  display: flex;
  align-items: center;
  gap: 8px;
}
.event-listener-editor__add {
  justify-self: start;
  padding: 0 12px;
}
</style>
