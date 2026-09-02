<script setup lang="ts">
/**
 * 定时标记、特殊回能、连携窗口和上下文标记的参数编辑器。
 *
 * 这些步骤不属于常规伤害或资源变化，但会影响后续机制；联合类型在表单中显式切换，
 * 避免把不同类型的值隐式转换后写入技能定义。
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  COMBAT_TARGETS,
  type ActionValueOperand,
  type CombatStepDefinition,
  type CombatTarget,
} from '../../../core/game-data/operatorDefinition';
import {
  replaceLevelValueForEditor,
  resolveLevelValueForEditor,
} from '../skillDefinitionEditorViewModel';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';

type MechanicStep = Extract<
  CombatStepDefinition,
  {
    kind:
      | 'createTimedMarker'
      | 'outputAirborne'
      | 'outputKnockDown'
      | 'gainSquadUltimateEnergyFromSkillCost'
      | 'gainFinisherSp'
      | 'setContextFlag'
      | 'setCharacterPassiveUiValue'
      | 'openComboWindow';
  }
>;
type ContextValueKind = 'boolean' | 'number' | 'string';

const props = defineProps<{ step: MechanicStep; skillLevel: number }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });

const coefficient = computed(() =>
  props.step.kind === 'gainSquadUltimateEnergyFromSkillCost'
    ? resolveLevelValueForEditor(props.step.parameters.coefficient, props.skillLevel)
    : undefined,
);
const contextValueKind = computed<ContextValueKind>(() => {
  if (props.step.kind !== 'setContextFlag') return 'boolean';
  const value = props.step.parameters.value;
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') return 'string';
  return 'boolean';
});
const operandLabels = () => ({
  constant: t('nextTimeline.skillEditing.operandConstant'),
  blackboard: t('nextTimeline.skillEditing.operandBlackboard'),
  blackboardKey: t('nextTimeline.skillEditing.operandBlackboardKey'),
  constantValue: t('nextTimeline.skillEditing.operandConstantValue'),
});

function setMarkerText(event: Event): void {
  if (props.step.kind !== 'createTimedMarker') return;
  const markerId = (event.target as HTMLInputElement).value;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, markerId } });
}

function setMarkerTarget(event: Event): void {
  if (props.step.kind !== 'createTimedMarker') return;
  const target = (event.target as HTMLSelectElement).value as CombatTarget;
  if (!COMBAT_TARGETS.includes(target)) return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, target } });
}

function setControlOutputTarget(event: Event): void {
  if (props.step.kind !== 'outputAirborne' && props.step.kind !== 'outputKnockDown') return;
  const target = (event.target as HTMLSelectElement).value as CombatTarget;
  if (!COMBAT_TARGETS.includes(target)) return;
  emit('update', { ...props.step, parameters: { target } });
}

function setMarkerDuration(durationSeconds: ActionValueOperand): void {
  if (props.step.kind !== 'createTimedMarker') return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, durationSeconds } });
}

function setAutoFinish(event: Event): void {
  if (props.step.kind !== 'createTimedMarker') return;
  emit('update', {
    ...props.step,
    parameters: {
      ...props.step.parameters,
      autoFinishByAction: (event.target as HTMLInputElement).checked,
    },
  });
}

function setCoefficient(event: Event): void {
  if (props.step.kind !== 'gainSquadUltimateEnergyFromSkillCost') return;
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;
  emit('update', {
    ...props.step,
    parameters: {
      ...props.step.parameters,
      coefficient: replaceLevelValueForEditor(
        props.step.parameters.coefficient,
        props.skillLevel,
        value,
      ),
    },
  });
}

function setFactor(event: Event): void {
  if (props.step.kind !== 'gainFinisherSp') return;
  const factor = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(factor)) return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, factor } });
}

function setNextSkillKey(event: Event): void {
  if (props.step.kind !== 'openComboWindow') return;
  const nextSkillKey = (event.target as HTMLInputElement).value;
  emit('update', { ...props.step, parameters: { nextSkillKey } });
}

function setFlag(event: Event): void {
  if (props.step.kind !== 'setContextFlag') return;
  emit('update', {
    ...props.step,
    parameters: { ...props.step.parameters, flag: (event.target as HTMLInputElement).value },
  });
}

function setContextValueKind(event: Event): void {
  if (props.step.kind !== 'setContextFlag') return;
  const kind = (event.target as HTMLSelectElement).value as ContextValueKind;
  const value = kind === 'boolean' ? false : kind === 'number' ? 0 : '';
  emit('update', { ...props.step, parameters: { ...props.step.parameters, value } });
}

function setContextValue(event: Event): void {
  if (props.step.kind !== 'setContextFlag') return;
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const value =
    contextValueKind.value === 'boolean'
      ? target.value === 'true'
      : contextValueKind.value === 'number'
        ? Number(target.value)
        : target.value;
  if (typeof value === 'number' && !Number.isFinite(value)) return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, value } });
}

function setPassiveUiValue(value: ActionValueOperand): void {
  if (props.step.kind !== 'setCharacterPassiveUiValue') return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, value } });
}
</script>

<template>
  <div class="step-editor__grid">
    <template v-if="step.kind === 'outputAirborne' || step.kind === 'outputKnockDown'">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.target')"
          :help="t('nextTimeline.skillEditing.fieldHelp.airborneTarget')"
        />
        <select :value="step.parameters.target" @change="setControlOutputTarget">
          <option v-for="target in COMBAT_TARGETS" :key="target" :value="target">
            {{ t(`nextTimeline.skillEditing.targets.${target}`) }}
          </option>
        </select>
      </label>
    </template>

    <template v-else-if="step.kind === 'createTimedMarker'">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.markerId')"
          :help="t('nextTimeline.skillEditing.fieldHelp.markerId')"
        />
        <input type="text" :value="step.parameters.markerId" @input="setMarkerText" />
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.target')"
          :help="t('nextTimeline.skillEditing.fieldHelp.markerTarget')"
        />
        <select :value="step.parameters.target" @change="setMarkerTarget">
          <option v-for="target in COMBAT_TARGETS" :key="target" :value="target">
            {{ t(`nextTimeline.skillEditing.targets.${target}`) }}
          </option>
        </select>
      </label>
      <label class="step-editor__operand">
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.durationSeconds')"
          :help="t('nextTimeline.skillEditing.fieldHelp.markerDuration')"
        />
        <ActionValueOperandEditor
          :value="step.parameters.durationSeconds"
          :labels="operandLabels()"
          @update="setMarkerDuration"
        />
      </label>
      <label class="step-editor__check step-editor__check--field">
        <input
          type="checkbox"
          :checked="step.parameters.autoFinishByAction"
          @change="setAutoFinish"
        />
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.autoFinishByAction')"
          :help="t('nextTimeline.skillEditing.fieldHelp.autoFinishByAction')"
        />
      </label>
    </template>

    <template v-else-if="step.kind === 'gainSquadUltimateEnergyFromSkillCost'">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.coefficient')"
          :help="t('nextTimeline.skillEditing.fieldHelp.skillCostCoefficient')"
        />
        <input type="number" step="0.01" :value="coefficient" @input="setCoefficient" />
      </label>
    </template>

    <template v-else-if="step.kind === 'gainFinisherSp'">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.factor')"
          :help="t('nextTimeline.skillEditing.fieldHelp.finisherFactor')"
        />
        <input type="number" step="0.01" :value="step.parameters.factor" @input="setFactor" />
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.recipient')"
          :help="t('nextTimeline.skillEditing.fieldHelp.finisherRecipient')"
        />
        <em>{{ t('nextTimeline.skillEditing.recipients.team') }}</em>
      </label>
    </template>

    <template v-else-if="step.kind === 'setCharacterPassiveUiValue'">
      <label>
        <EditorFieldLabel
          label="角色专属 HUD 目标"
          help="当前公共协议只支持把数值写到施法者自己的专属 HUD 状态。"
        />
        <em>{{ t('nextTimeline.skillEditing.targets.caster') }}</em>
      </label>
      <label class="step-editor__operand">
        <EditorFieldLabel
          label="HUD 数值"
          help="只更新角色专属战斗界面的可视状态，不直接改变伤害属性。"
        />
        <ActionValueOperandEditor
          :value="step.parameters.value"
          :labels="operandLabels()"
          @update="setPassiveUiValue"
        />
      </label>
    </template>

    <template v-else-if="step.kind === 'openComboWindow'">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.nextComboSkillKey')"
          :help="t('nextTimeline.skillEditing.fieldHelp.nextComboSkillKey')"
        />
        <input
          type="text"
          :value="'nextSkillKey' in step.parameters ? step.parameters.nextSkillKey : ''"
          @input="setNextSkillKey"
        />
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comboWindowDuration')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comboWindowDuration')"
        />
        <em>{{ t('nextTimeline.skillEditing.fixedFiveSeconds') }}</em>
      </label>
    </template>

    <template v-else-if="step.kind === 'setContextFlag'">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.contextFlag')"
          :help="t('nextTimeline.skillEditing.fieldHelp.contextFlag')"
        />
        <input type="text" :value="step.parameters.flag" @input="setFlag" />
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.contextValueType')"
          :help="t('nextTimeline.skillEditing.fieldHelp.contextValueType')"
        />
        <select :value="contextValueKind" @change="setContextValueKind">
          <option value="boolean">{{ t('nextTimeline.skillEditing.valueTypes.boolean') }}</option>
          <option value="number">{{ t('nextTimeline.skillEditing.valueTypes.number') }}</option>
          <option value="string">{{ t('nextTimeline.skillEditing.valueTypes.string') }}</option>
        </select>
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.value')"
          :help="t('nextTimeline.skillEditing.fieldHelp.contextValue')"
        />
        <select
          v-if="contextValueKind === 'boolean'"
          :value="String(step.parameters.value)"
          @change="setContextValue"
        >
          <option value="true">{{ t('nextTimeline.skillEditing.booleanValues.true') }}</option>
          <option value="false">{{ t('nextTimeline.skillEditing.booleanValues.false') }}</option>
        </select>
        <input
          v-else-if="contextValueKind === 'number'"
          type="number"
          step="0.01"
          :value="step.parameters.value"
          @input="setContextValue"
        />
        <input v-else type="text" :value="step.parameters.value" @input="setContextValue" />
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.target')"
          :help="t('nextTimeline.skillEditing.fieldHelp.contextTarget')"
        />
        <em>{{ t('nextTimeline.skillEditing.targets.caster') }}</em>
      </label>
    </template>
  </div>
</template>
