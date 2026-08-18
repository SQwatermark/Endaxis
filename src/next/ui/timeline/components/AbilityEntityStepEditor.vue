<script setup lang="ts">
/**
 * 编辑 spawnAbilityEntity 的自包含定义与生成参数。
 *
 * VFS 模板只属于生成证据；这里直接修改当前技能组件树中的 definition。
 * 子技能复用统一调度序列和战斗步骤编辑器，并通过异步组件打断递归导入环。
 */
import { computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown, ArrowUp, CopyDocument, Delete, Plus } from '@element-plus/icons-vue';
import {
  COMBAT_TARGETS,
  type AbilityEntityChildSkillDefinition,
  type ActionValueOperand,
  type CombatStepDefinition,
  type CombatTarget,
  type LevelValues,
  type ScheduledSequenceDefinition,
} from '../../../core/game-data/operatorDefinition';
import type { EditableCombatStepKind } from '../skillDefinitionEditorViewModel';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';
import SkillBlackboardEditor from './SkillBlackboardEditor.vue';

const RecursiveScheduledSequenceEditor = defineAsyncComponent(
  () => import('./ScheduledSequenceEditor.vue'),
);

type AbilityEntityStep = Extract<CombatStepDefinition, { kind: 'spawnAbilityEntity' }>;

const props = defineProps<{
  step: AbilityEntityStep;
  skillLevel: number;
  createStep?: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep?: (step: CombatStepDefinition) => CombatStepDefinition;
}>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });

const assignments = computed(() =>
  Object.entries(props.step.parameters.blackboardAssignments ?? {}),
);
const operandLabels = () => ({
  constant: t('nextTimeline.skillEditing.operandConstant'),
  blackboard: t('nextTimeline.skillEditing.operandBlackboard'),
  blackboardKey: t('nextTimeline.skillEditing.operandBlackboardKey'),
  constantValue: t('nextTimeline.skillEditing.operandConstantValue'),
});

function update(parameters: AbilityEntityStep['parameters']): void {
  emit('update', { ...props.step, parameters });
}

function setText(field: 'abilityEntityId' | 'saveToContextKey', event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  const parameters = { ...props.step.parameters };
  if (field === 'saveToContextKey' && value === '') delete parameters.saveToContextKey;
  else parameters[field] = value;
  update(parameters);
}

function setTarget(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
  const parameters = { ...props.step.parameters };
  if (value === '') delete parameters.target;
  else if (COMBAT_TARGETS.includes(value as CombatTarget))
    parameters.target = value as CombatTarget;
  update(parameters);
}

function setBoolean(field: 'dieWhenSourceDies' | 'inheritActionBlackboard', event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;
  const parameters = { ...props.step.parameters };
  if (field === 'inheritActionBlackboard' && !checked) delete parameters[field];
  else parameters[field] = checked;
  update(parameters);
}

function setLifetimeKind(event: Event): void {
  const kind = (event.target as HTMLSelectElement).value as 'limited' | 'infinite';
  update({
    ...props.step.parameters,
    definition: {
      ...props.step.parameters.definition,
      lifetime:
        kind === 'infinite'
          ? { kind }
          : {
              kind,
              durationSeconds:
                props.step.parameters.definition.lifetime.kind === 'limited'
                  ? props.step.parameters.definition.lifetime.durationSeconds
                  : 10,
            },
    },
  });
}

function setLifetimeDuration(event: Event): void {
  if (props.step.parameters.definition.lifetime.kind !== 'limited') return;
  const durationSeconds = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) return;
  update({
    ...props.step.parameters,
    definition: {
      ...props.step.parameters.definition,
      lifetime: { kind: 'limited', durationSeconds },
    },
  });
}

function toggleOverrideDuration(event: Event): void {
  const parameters = { ...props.step.parameters };
  if ((event.target as HTMLInputElement).checked) {
    parameters.overrideDurationSeconds = { kind: 'constant', value: 0 };
  } else delete parameters.overrideDurationSeconds;
  update(parameters);
}

function setOverrideDuration(overrideDurationSeconds: ActionValueOperand): void {
  update({ ...props.step.parameters, overrideDurationSeconds });
}

function appendAssignment(): void {
  const current = props.step.parameters.blackboardAssignments ?? {};
  let index = 1;
  while (`value${index}` in current) index += 1;
  update({
    ...props.step.parameters,
    blackboardAssignments: {
      ...current,
      [`value${index}`]: { kind: 'constant', value: 0 },
    },
  });
}

function removeAssignment(key: string): void {
  const blackboardAssignments = { ...props.step.parameters.blackboardAssignments };
  delete blackboardAssignments[key];
  const parameters = { ...props.step.parameters };
  if (Object.keys(blackboardAssignments).length === 0) delete parameters.blackboardAssignments;
  else parameters.blackboardAssignments = blackboardAssignments;
  update(parameters);
}

function renameAssignment(oldKey: string, event: Event): void {
  const newKey = (event.target as HTMLInputElement).value.trim();
  const current = props.step.parameters.blackboardAssignments ?? {};
  if (newKey.length === 0 || (newKey !== oldKey && newKey in current)) return;
  const blackboardAssignments: Record<string, ActionValueOperand> = {};
  for (const [key, value] of Object.entries(current)) {
    blackboardAssignments[key === oldKey ? newKey : key] = value;
  }
  update({ ...props.step.parameters, blackboardAssignments });
}

function setAssignment(key: string, value: ActionValueOperand): void {
  update({
    ...props.step.parameters,
    blackboardAssignments: {
      ...props.step.parameters.blackboardAssignments,
      [key]: value,
    },
  });
}

function setChildSkill(childSkill: AbilityEntityChildSkillDefinition | undefined): void {
  const definition = { ...props.step.parameters.definition };
  if (childSkill === undefined) delete definition.childSkill;
  else definition.childSkill = childSkill;
  update({ ...props.step.parameters, definition });
}

function toggleChildSkill(event: Event): void {
  setChildSkill(
    (event.target as HTMLInputElement).checked
      ? { skillId: 'custom-ability-entity-child', scheduledSequences: [] }
      : undefined,
  );
}

function setChildSkillId(event: Event): void {
  const childSkill = props.step.parameters.definition.childSkill;
  if (childSkill === undefined) return;
  setChildSkill({ ...childSkill, skillId: (event.target as HTMLInputElement).value });
}

function setChildBlackboard(blackboard: Readonly<Record<string, LevelValues>>): void {
  const childSkill = props.step.parameters.definition.childSkill;
  if (childSkill === undefined) return;
  const next = { ...childSkill };
  if (Object.keys(blackboard).length === 0) delete next.blackboard;
  else next.blackboard = blackboard;
  setChildSkill(next);
}

function replaceChildSequence(index: number, sequence: ScheduledSequenceDefinition): void {
  const childSkill = props.step.parameters.definition.childSkill;
  if (childSkill === undefined || childSkill.scheduledSequences[index] === undefined) return;
  const scheduledSequences = [...childSkill.scheduledSequences];
  scheduledSequences[index] = sequence;
  setChildSkill({ ...childSkill, scheduledSequences });
}

function appendChildSequence(): void {
  const childSkill = props.step.parameters.definition.childSkill;
  if (childSkill === undefined) return;
  setChildSkill({
    ...childSkill,
    scheduledSequences: [
      ...childSkill.scheduledSequences,
      { startFrame: 0, sequence: { steps: [] } },
    ],
  });
}

function moveChildSequence(index: number, offset: -1 | 1): void {
  const childSkill = props.step.parameters.definition.childSkill;
  if (childSkill === undefined) return;
  const target = index + offset;
  if (target < 0 || target >= childSkill.scheduledSequences.length) return;
  const scheduledSequences = [...childSkill.scheduledSequences];
  [scheduledSequences[index], scheduledSequences[target]] = [
    scheduledSequences[target]!,
    scheduledSequences[index]!,
  ];
  setChildSkill({ ...childSkill, scheduledSequences });
}

function duplicateChildSequence(index: number): void {
  const childSkill = props.step.parameters.definition.childSkill;
  const sequence = childSkill?.scheduledSequences[index];
  if (childSkill === undefined || sequence === undefined || props.duplicateStep === undefined)
    return;
  const copy: ScheduledSequenceDefinition = {
    ...sequence,
    sequence: { steps: sequence.sequence.steps.map(props.duplicateStep) },
  };
  const scheduledSequences = [...childSkill.scheduledSequences];
  scheduledSequences.splice(index + 1, 0, copy);
  setChildSkill({ ...childSkill, scheduledSequences });
}

function removeChildSequence(index: number): void {
  const childSkill = props.step.parameters.definition.childSkill;
  if (childSkill === undefined) return;
  setChildSkill({
    ...childSkill,
    scheduledSequences: childSkill.scheduledSequences.filter((_, i) => i !== index),
  });
}
</script>

<template>
  <div class="ability-entity-editor">
    <div class="step-editor__grid">
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.abilityEntityId')" />
        <input
          type="text"
          :value="step.parameters.abilityEntityId"
          @input="setText('abilityEntityId', $event)"
        />
      </label>
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.abilityEntityTarget')" />
        <select :value="step.parameters.target ?? ''" @change="setTarget">
          <option value="">—</option>
          <option v-for="target in COMBAT_TARGETS" :key="target" :value="target">
            {{ target }}
          </option>
        </select>
      </label>
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.abilityEntityContextKey')" />
        <input
          type="text"
          :value="step.parameters.saveToContextKey ?? ''"
          @input="setText('saveToContextKey', $event)"
        />
      </label>
      <label class="step-editor__check step-editor__check--field">
        <input
          type="checkbox"
          :checked="step.parameters.dieWhenSourceDies"
          @change="setBoolean('dieWhenSourceDies', $event)"
        />
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.abilityEntityDieWithSource')" />
      </label>
      <label class="step-editor__check step-editor__check--field">
        <input
          type="checkbox"
          :checked="step.parameters.inheritActionBlackboard ?? false"
          @change="setBoolean('inheritActionBlackboard', $event)"
        />
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.abilityEntityInheritBlackboard')" />
      </label>
    </div>

    <fieldset>
      <legend>{{ t('nextTimeline.skillEditing.abilityEntityDefinition') }}</legend>
      <div class="step-editor__grid ability-entity-editor__definition">
        <label>
          <EditorFieldLabel :label="t('nextTimeline.skillEditing.abilityEntityLifetime')" />
          <select :value="step.parameters.definition.lifetime.kind" @change="setLifetimeKind">
            <option value="limited">
              {{ t('nextTimeline.skillEditing.abilityEntityLifetimeLimited') }}
            </option>
            <option value="infinite">
              {{ t('nextTimeline.skillEditing.abilityEntityLifetimeInfinite') }}
            </option>
          </select>
        </label>
        <label v-if="step.parameters.definition.lifetime.kind === 'limited'">
          <EditorFieldLabel :label="t('nextTimeline.skillEditing.durationSeconds')" />
          <input
            type="number"
            min="0"
            step="0.01"
            :value="step.parameters.definition.lifetime.durationSeconds"
            @input="setLifetimeDuration"
          />
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend>
        <label class="step-editor__check">
          <input
            type="checkbox"
            :checked="step.parameters.overrideDurationSeconds !== undefined"
            @change="toggleOverrideDuration"
          />
          {{ t('nextTimeline.skillEditing.abilityEntityOverrideDuration') }}
        </label>
      </legend>
      <ActionValueOperandEditor
        v-if="step.parameters.overrideDurationSeconds"
        :value="step.parameters.overrideDurationSeconds"
        :labels="operandLabels()"
        @update="setOverrideDuration"
      />
    </fieldset>

    <fieldset>
      <legend>{{ t('nextTimeline.skillEditing.abilityEntityAssignments') }}</legend>
      <div v-for="[key, value] in assignments" :key="key" class="ability-entity-editor__assignment">
        <input type="text" :value="key" @change="renameAssignment(key, $event)" />
        <ActionValueOperandEditor
          :value="value"
          :labels="operandLabels()"
          @update="setAssignment(key, $event)"
        />
        <button type="button" @click="removeAssignment(key)">
          <el-icon><Delete /></el-icon>
        </button>
      </div>
      <button type="button" class="ability-entity-editor__add" @click="appendAssignment">
        <el-icon><Plus /></el-icon>{{ t('nextTimeline.skillEditing.addAssignment') }}
      </button>
    </fieldset>

    <fieldset>
      <legend>
        <label class="step-editor__check">
          <input
            type="checkbox"
            :checked="step.parameters.definition.childSkill !== undefined"
            @change="toggleChildSkill"
          />
          {{ t('nextTimeline.skillEditing.abilityEntityChildSkill') }}
        </label>
      </legend>
      <template v-if="step.parameters.definition.childSkill">
        <div class="step-editor__grid">
          <label>
            <EditorFieldLabel :label="t('nextTimeline.skillEditing.abilityEntityChildSkillId')" />
            <input
              type="text"
              :value="step.parameters.definition.childSkill.skillId"
              @input="setChildSkillId"
            />
          </label>
        </div>
        <SkillBlackboardEditor
          :blackboard="step.parameters.definition.childSkill.blackboard ?? {}"
          :skill-level="skillLevel"
          @update="setChildBlackboard"
        />
        <div class="ability-entity-editor__heading">
          <strong>{{ t('nextTimeline.skillEditing.abilityEntityChildTimeline') }}</strong>
          <button type="button" @click="appendChildSequence">
            <el-icon><Plus /></el-icon>
          </button>
        </div>
        <div v-if="createStep && duplicateStep" class="ability-entity-editor__sequences">
          <RecursiveScheduledSequenceEditor
            v-for="(sequence, index) in step.parameters.definition.childSkill.scheduledSequences"
            :key="index"
            :sequence="sequence"
            :skill-level="skillLevel"
            :title="t('nextTimeline.skillEditing.sequenceItem', { index: index + 1 })"
            :create-step="createStep"
            :duplicate-step="duplicateStep"
            @update="replaceChildSequence(index, $event)"
          >
            <template #actions>
              <button type="button" :disabled="index === 0" @click="moveChildSequence(index, -1)">
                <el-icon><ArrowUp /></el-icon>
              </button>
              <button
                type="button"
                :disabled="
                  index === step.parameters.definition.childSkill!.scheduledSequences.length - 1
                "
                @click="moveChildSequence(index, 1)"
              >
                <el-icon><ArrowDown /></el-icon>
              </button>
              <button type="button" @click="duplicateChildSequence(index)">
                <el-icon><CopyDocument /></el-icon>
              </button>
              <button type="button" @click="removeChildSequence(index)">
                <el-icon><Delete /></el-icon>
              </button>
            </template>
          </RecursiveScheduledSequenceEditor>
        </div>
      </template>
    </fieldset>
  </div>
</template>

<style scoped>
.ability-entity-editor {
  padding-bottom: 1px;
}
.ability-entity-editor__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 10px 0;
}
.ability-entity-editor button {
  min-width: 30px;
  min-height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
.ability-entity-editor__sequences {
  display: grid;
  gap: 10px;
}
.ability-entity-editor__assignment > input {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  padding: 0 6px;
}
.ability-entity-editor__assignment {
  display: grid;
  grid-template-columns: minmax(120px, 0.5fr) minmax(260px, 1fr) 30px;
  align-items: end;
  gap: 8px;
  margin-bottom: 8px;
}
.ability-entity-editor__add {
  margin-top: 4px;
  padding: 0 10px;
}
.ability-entity-editor :deep(.editor-section) {
  padding: 0 14px 14px;
}
.ability-entity-editor :deep(.section-heading) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ability-entity-editor :deep(.scheduled-sequence-editor) {
  margin-bottom: 10px;
}
</style>
