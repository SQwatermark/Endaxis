<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  SKILL_TYPES,
  type ActionValueOperand,
  type CombatStepDefinition,
  type SkillType,
} from '../../../core/game-data/operatorDefinition';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';

type CooldownStep = Extract<CombatStepDefinition, { kind: 'adjustSkillCooldown' }>;
type SkillSelectorKind = CooldownStep['parameters']['skill']['kind'];

const props = defineProps<{ step: CooldownStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });

const operandLabels = () => ({
  constant: t('nextTimeline.skillEditing.operandConstant'),
  blackboard: t('nextTimeline.skillEditing.operandBlackboard'),
  blackboardKey: t('nextTimeline.skillEditing.operandBlackboardKey'),
  constantValue: t('nextTimeline.skillEditing.operandConstantValue'),
});

function updateParameters(parameters: CooldownStep['parameters']): void {
  emit('update', { ...props.step, parameters });
}

function setSelectorKind(event: Event): void {
  const kind = (event.target as HTMLSelectElement).value as SkillSelectorKind;
  updateParameters({
    ...props.step.parameters,
    skill:
      kind === 'type'
        ? { kind: 'type', skillType: 'comboSkill' }
        : { kind: 'id', skillId: 'custom-skill' },
  });
}

function setSkillType(event: Event): void {
  if (props.step.parameters.skill.kind !== 'type') return;
  const skillType = (event.target as HTMLSelectElement).value as SkillType;
  if (!SKILL_TYPES.includes(skillType)) return;
  updateParameters({ ...props.step.parameters, skill: { kind: 'type', skillType } });
}

function setSkillId(event: Event): void {
  if (props.step.parameters.skill.kind !== 'id') return;
  updateParameters({
    ...props.step.parameters,
    skill: { kind: 'id', skillId: (event.target as HTMLInputElement).value },
  });
}

function setOperation(event: Event): void {
  const operation = (event.target as HTMLSelectElement).value as 'reduce' | 'set';
  updateParameters({
    ...props.step.parameters,
    operation,
    basis: operation === 'reduce' ? 'baseDurationRatio' : props.step.parameters.basis,
  });
}

function setBasis(event: Event): void {
  if (props.step.parameters.operation !== 'set') return;
  const basis = (event.target as HTMLSelectElement).value as
    'baseDurationRatio' | 'absoluteSeconds';
  updateParameters({ ...props.step.parameters, basis });
}

function setValue(value: ActionValueOperand): void {
  updateParameters({ ...props.step.parameters, value });
}
</script>

<template>
  <div class="step-editor__grid">
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.cooldownSkillSelector')"
        :help="t('nextTimeline.skillEditing.fieldHelp.cooldownSkillSelector')"
      />
      <select :value="step.parameters.skill.kind" @change="setSelectorKind">
        <option value="type">
          {{ t('nextTimeline.skillEditing.cooldownSkillSelectorKinds.type') }}
        </option>
        <option value="id">
          {{ t('nextTimeline.skillEditing.cooldownSkillSelectorKinds.id') }}
        </option>
      </select>
    </label>
    <label v-if="step.parameters.skill.kind === 'type'">
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.cooldownSkillType')"
        :help="t('nextTimeline.skillEditing.fieldHelp.cooldownSkillType')"
      />
      <select :value="step.parameters.skill.skillType" @change="setSkillType">
        <option v-for="skillType in SKILL_TYPES" :key="skillType" :value="skillType">
          {{ t(`hitEditor.skillTypes.${skillType}`) }}
        </option>
      </select>
    </label>
    <label v-else>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.cooldownSkillId')"
        :help="t('nextTimeline.skillEditing.fieldHelp.cooldownSkillId')"
      />
      <input type="text" :value="step.parameters.skill.skillId" @input="setSkillId" />
    </label>
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.operation')"
        :help="t('nextTimeline.skillEditing.fieldHelp.cooldownOperation')"
      />
      <select :value="step.parameters.operation" @change="setOperation">
        <option value="reduce">
          {{ t('nextTimeline.skillEditing.cooldownOperations.reduce') }}
        </option>
        <option value="set">{{ t('nextTimeline.skillEditing.cooldownOperations.set') }}</option>
      </select>
    </label>
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.cooldownBasis')"
        :help="t('nextTimeline.skillEditing.fieldHelp.cooldownBasis')"
      />
      <select
        :value="step.parameters.basis"
        :disabled="step.parameters.operation === 'reduce'"
        @change="setBasis"
      >
        <option value="baseDurationRatio">
          {{ t('nextTimeline.skillEditing.cooldownBases.baseDurationRatio') }}
        </option>
        <option value="absoluteSeconds">
          {{ t('nextTimeline.skillEditing.cooldownBases.absoluteSeconds') }}
        </option>
      </select>
    </label>
    <label class="step-editor__operand">
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.value')"
        :help="t('nextTimeline.skillEditing.fieldHelp.cooldownValue')"
      />
      <ActionValueOperandEditor
        :value="step.parameters.value"
        :labels="operandLabels()"
        @update="setValue"
      />
    </label>
  </div>
</template>
