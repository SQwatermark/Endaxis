<script setup lang="ts">
import type { GameplayTag } from '../../../../../packages/game-data-contract/src/gameplayTags';
import type {
  HealModifierDefinition,
  PoiseModifierDefinition,
} from '../../../../../packages/game-data-contract/src/modifiers';
import type {
  BuffDuration,
  BuffPriority,
  BuffTimeClock,
  CombatBuffDefinitionAttributeModifier,
  CombatBuffDefinitionDamageModifier,
  CombatBuffPresentation,
  CombatBuffChildPresentation,
  SkillBuffSlotReplacement,
  BuffShieldDefinition,
  BuffKeywordEnhancementDefinition,
  BuffSustainedProtectionDefinition,
  CombatBuffSemanticRole,
  CombatBuffSpellBurstDefinition,
} from '../../../../../packages/game-data-contract/src/buffs';

/**
 * Buff 施加步骤的参数编辑器。
 *
 * 接收目标、来源和可选覆盖项在这里明确分开。初始黑板赋值按具名条目编辑，
 * 保存时仍写回 SkillDefinition 使用的 Record 结构，不引入仅供界面使用的数据格式。
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  BUFF_APPLICATION_TARGETS,
  COMBAT_TARGETS,
  type ActionSequenceDefinition,
  type ActionBlackboardValue,
  type ActionValueOperand,
  type BuffApplicationTarget,
  type CombatStepDefinition,
  type CombatTarget,
  type LevelValues,
  type SkillBuffDefinition,
  type SkillBuffLifecycleSequences,
} from '../../../core/game-data/operatorDefinition';
import { BUFF_STACKING_TYPES, type BuffStackingType } from '../../../core/combat/buffs/combatBuffs';
import type { EditableCombatStepKind } from '../skillDefinitionEditorViewModel';
import {
  setBuffDefinitionPresentation as replaceBuffDefinitionPresentation,
  setBuffDefinitionChildPresentations as replaceBuffDefinitionChildPresentations,
  setBuffDefinitionPriority,
  setBuffDefinitionScalar as replaceBuffDefinitionScalar,
  setBuffDefinitionBlackboard as replaceBuffDefinitionBlackboard,
  setBuffDefinitionAttributeModifiers as replaceBuffDefinitionAttributeModifiers,
  setBuffDefinitionDamageModifiers as replaceBuffDefinitionDamageModifiers,
  setBuffDefinitionSkillSlotReplacements as replaceBuffDefinitionSkillSlotReplacements,
  setBuffDefinitionHealModifiers as replaceBuffDefinitionHealModifiers,
  setBuffDefinitionPoiseModifiers as replaceBuffDefinitionPoiseModifiers,
  setBuffDefinitionShields as replaceBuffDefinitionShields,
  setBuffDefinitionKeywordEnhancements as replaceBuffDefinitionKeywordEnhancements,
  setBuffDefinitionAdvancedProperties as replaceBuffDefinitionAdvancedProperties,
} from '../buffDefinitionEditorCommands';
import ActionSequenceEditor from './ActionSequenceEditor.vue';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';
import BuffDefinitionScalarEditor from './BuffDefinitionScalarEditor.vue';
import BuffBlackboardEditor from './BuffBlackboardEditor.vue';
import BuffAttributeModifierEditor from './BuffAttributeModifierEditor.vue';
import BuffDamageModifierEditor from './BuffDamageModifierEditor.vue';
import CombatBuffPresentationEditor from './CombatBuffPresentationEditor.vue';
import CombatBuffChildPresentationsEditor from './CombatBuffChildPresentationsEditor.vue';
import BuffSkillSlotReplacementEditor from './BuffSkillSlotReplacementEditor.vue';
import BuffHealModifierEditor from './BuffHealModifierEditor.vue';
import BuffPoiseModifierEditor from './BuffPoiseModifierEditor.vue';
import BuffShieldEditor from './BuffShieldEditor.vue';
import BuffKeywordEnhancementEditor from './BuffKeywordEnhancementEditor.vue';
import BuffAdvancedPropertiesEditor from './BuffAdvancedPropertiesEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';
import GameplayTagsEditor from './GameplayTagsEditor.vue';

type BuffStep = Extract<CombatStepDefinition, { kind: 'applyBuff' }>;
type OptionalField =
  'count' | 'source' | 'durationSeconds' | 'effectiveness' | 'inheritSourceSkillCastInfo';
const BUFF_LIFECYCLE_KEYS = [
  'start',
  'enable',
  'disable',
  'beforeEnhance',
  'enhanceChanged',
  'afterEnhance',
  'trigger',
  'finish',
] as const satisfies readonly (keyof SkillBuffLifecycleSequences)[];
type BuffLifecycleKey = (typeof BUFF_LIFECYCLE_KEYS)[number];

const props = defineProps<{
  step: BuffStep;
  skillLevel: number;
  /** 作为干员级 Buff 蓝图编辑器使用时，隐藏施加目标、实例覆盖和内联开关。 */
  definitionOnly?: boolean;
  createStep?: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep?: (step: CombatStepDefinition) => CombatStepDefinition;
  selectedStructurePath?: string;
  inspectorOnly?: boolean;
}>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });
const activeLifecycle = ref<BuffLifecycleKey>('start');
const selectedLifecycleStepPath = computed(() => {
  const prefix = `lifecycleSequences.${activeLifecycle.value}`;
  if (!props.selectedStructurePath?.startsWith(prefix)) return '';
  return props.selectedStructurePath.slice(prefix.length).replace(/^\./, '');
});

watch(
  () => props.selectedStructurePath,
  path => {
    const match = path?.match(/^lifecycleSequences\.([^.]+)/);
    const key = match?.[1] as BuffLifecycleKey | undefined;
    if (key !== undefined && BUFF_LIFECYCLE_KEYS.includes(key)) activeLifecycle.value = key;
  },
  { immediate: true },
);

const assignments = computed(() =>
  Object.entries(props.step.parameters.blackboardAssignments ?? {}).map(
    ([key, value]) => [key, toEditableOperand(value)] as const,
  ),
);
const operandLabels = () => ({
  constant: t('nextTimeline.skillEditing.operandConstant'),
  blackboard: t('nextTimeline.skillEditing.operandBlackboard'),
  blackboardKey: t('nextTimeline.skillEditing.operandBlackboardKey'),
  constantValue: t('nextTimeline.skillEditing.operandConstantValue'),
});

function update(parameters: BuffStep['parameters']): void {
  emit('update', { ...props.step, parameters });
}

function setBuffId(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  update({
    ...props.step.parameters,
    buffId: typeof props.step.parameters.buffId === 'string' ? value : { blackboardKey: value },
  });
}

function setBuffIdKind(event: Event): void {
  const parameters = { ...props.step.parameters };
  if ((event.target as HTMLSelectElement).value === 'blackboard') {
    parameters.buffId = { blackboardKey: '' };
    delete parameters.definition;
    delete parameters.durationSeconds;
    delete parameters.effectiveness;
  } else parameters.buffId = '';
  update(parameters);
}

function setDefinition(definition: SkillBuffDefinition | undefined): void {
  const parameters = { ...props.step.parameters };
  if (definition === undefined) delete parameters.definition;
  else parameters.definition = definition;
  update(parameters);
}

function toggleDefinition(event: Event): void {
  setDefinition(
    (event.target as HTMLInputElement).checked
      ? { stackingType: 'refresh', durationSeconds: 10 }
      : undefined,
  );
}

function setDefinitionText(field: 'stackingKey', event: Event): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  const value = (event.target as HTMLInputElement).value;
  const next = { ...definition };
  if (value === '') delete next[field];
  else next[field] = value;
  setDefinition(next);
}

function setDefinitionPresentation(presentation: CombatBuffPresentation | undefined): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionPresentation(definition, presentation));
}

function setDefinitionChildPresentations(children: readonly CombatBuffChildPresentation[]): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionChildPresentations(definition, children));
}

function setStackingType(event: Event): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  const stackingType = (event.target as HTMLSelectElement).value as BuffStackingType;
  if (!BUFF_STACKING_TYPES.includes(stackingType)) return;
  setDefinition({ ...definition, stackingType });
}

function setDefinitionScalar(
  field: 'durationSeconds' | 'triggerIntervalSeconds' | 'maxStackCount' | 'maxTriggerCount',
  value: BuffDuration | undefined,
): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionScalar(definition, field, value));
}

function setPriority(value: BuffDuration | undefined): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(setBuffDefinitionPriority(definition, value));
}

function setPriorityNegate(event: Event): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined || typeof definition.priority !== 'object') return;
  const priority: BuffPriority = {
    blackboardKey: definition.priority.blackboardKey,
    ...((event.target as HTMLInputElement).checked ? { negate: true } : {}),
  };
  setDefinition({ ...definition, priority });
}

function setTimeClock(event: Event): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  const value = (event.target as HTMLSelectElement).value as BuffTimeClock | '';
  const next = { ...definition };
  if (value === '') delete next.timeClock;
  else next.timeClock = value;
  setDefinition(next);
}

function setWaitFirstTriggerInterval(event: Event): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  const value = (event.target as HTMLSelectElement).value;
  const next = { ...definition };
  if (value === '') delete next.waitFirstTriggerInterval;
  else next.waitFirstTriggerInterval = value === 'true';
  setDefinition(next);
}

function setDefinitionBlackboard(
  blackboard: Readonly<Record<string, ActionBlackboardValue>>,
): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionBlackboard(definition, blackboard));
}

function setDefinitionAttributeModifiers(
  modifiers: readonly CombatBuffDefinitionAttributeModifier[],
): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionAttributeModifiers(definition, modifiers));
}

function setDefinitionDamageModifiers(
  modifiers: readonly CombatBuffDefinitionDamageModifier[],
): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionDamageModifiers(definition, modifiers));
}

function setDefinitionSkillSlotReplacements(
  replacements: readonly SkillBuffSlotReplacement[],
): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionSkillSlotReplacements(definition, replacements));
}

function setDefinitionHealModifiers(modifiers: readonly HealModifierDefinition[]): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionHealModifiers(definition, modifiers));
}

function setDefinitionPoiseModifiers(modifiers: readonly PoiseModifierDefinition[]): void {
  const definition = props.step.parameters.definition;
  if (!definition) return;
  setDefinition(replaceBuffDefinitionPoiseModifiers(definition, modifiers));
}

function setDefinitionShields(shields: readonly BuffShieldDefinition[]): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionShields(definition, shields));
}

function setDefinitionKeywordEnhancements(
  enhancements: readonly BuffKeywordEnhancementDefinition[],
): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionKeywordEnhancements(definition, enhancements));
}

function setDefinitionAdvancedProperty(
  field: 'sustainedProtection' | 'role' | 'spellBurst',
  value:
    | BuffSustainedProtectionDefinition
    | CombatBuffSemanticRole
    | CombatBuffSpellBurstDefinition
    | undefined,
): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  setDefinition(replaceBuffDefinitionAdvancedProperties(definition, { [field]: value ?? null }));
}

function setDefinitionTags(field: 'applyTags' | 'extendTags', tags: readonly GameplayTag[]): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  const next = { ...definition };
  if (tags.length === 0) delete next[field];
  else next[field] = tags;
  setDefinition(next);
}

function setLifecycleSequence(
  key: BuffLifecycleKey,
  sequence: ActionSequenceDefinition | undefined,
): void {
  const definition = props.step.parameters.definition;
  if (definition === undefined) return;
  const lifecycleSequences: Partial<Record<BuffLifecycleKey, ActionSequenceDefinition>> = {
    ...definition.lifecycleSequences,
  };
  if (sequence === undefined) delete lifecycleSequences[key];
  else lifecycleSequences[key] = sequence;

  const nextDefinition = { ...definition };
  if (Object.keys(lifecycleSequences).length === 0) delete nextDefinition.lifecycleSequences;
  else nextDefinition.lifecycleSequences = lifecycleSequences;

  update({
    ...props.step.parameters,
    definition: nextDefinition,
    // 生命周期步骤需要知道它由哪一次技能释放创建，编辑器在启用时一并保证该前提。
    ...(sequence === undefined ? {} : { inheritSourceSkillCastInfo: true }),
  });
}

function toggleLifecycle(key: BuffLifecycleKey, event: Event): void {
  const enabled = (event.target as HTMLInputElement).checked;
  setLifecycleSequence(key, enabled ? { steps: [] } : undefined);
}

function setTarget(event: Event): void {
  const target = (event.target as HTMLSelectElement).value as BuffApplicationTarget;
  if (!BUFF_APPLICATION_TARGETS.includes(target)) return;
  update({ ...props.step.parameters, target });
}

function setSource(event: Event): void {
  const source = (event.target as HTMLSelectElement).value as CombatTarget;
  if (!COMBAT_TARGETS.includes(source)) return;
  update({ ...props.step.parameters, source });
}

function setOperand(field: 'count', value: ActionValueOperand): void {
  update({ ...props.step.parameters, [field]: value });
}

function setNumber(field: 'durationSeconds' | 'effectiveness', event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;
  update({ ...props.step.parameters, [field]: value });
}

function setInherit(event: Event): void {
  update({
    ...props.step.parameters,
    inheritSourceSkillCastInfo: (event.target as HTMLInputElement).checked,
  });
}

function toggleOptional(field: OptionalField, event: Event): void {
  const enabled = (event.target as HTMLInputElement).checked;
  const parameters = { ...props.step.parameters };
  if (!enabled) {
    delete parameters[field];
    update(parameters);
    return;
  }
  if (field === 'count') parameters.count = { kind: 'constant', value: 1 };
  else if (field === 'source') parameters.source = 'caster';
  else if (field === 'durationSeconds') parameters.durationSeconds = 0;
  else if (field === 'effectiveness') parameters.effectiveness = 1;
  else parameters.inheritSourceSkillCastInfo = false;
  update(parameters);
}

function appendAssignment(): void {
  const current = { ...(props.step.parameters.blackboardAssignments ?? {}) };
  let index = 1;
  while (`custom-${index}` in current) index += 1;
  current[`custom-${index}`] = { kind: 'constant', value: 0 };
  update({ ...props.step.parameters, blackboardAssignments: current });
}

function renameAssignment(oldKey: string, event: Event): void {
  const newKey = (event.target as HTMLInputElement).value;
  if (newKey === oldKey || newKey.length === 0) return;
  const current = props.step.parameters.blackboardAssignments ?? {};
  if (newKey in current) return;
  const renamed: Record<string, LevelValues | ActionValueOperand> = {};
  for (const [key, value] of Object.entries(current))
    renamed[key === oldKey ? newKey : key] = value;
  update({ ...props.step.parameters, blackboardAssignments: renamed });
}

function setAssignment(key: string, value: ActionValueOperand): void {
  const previous = props.step.parameters.blackboardAssignments?.[key];
  let next: LevelValues | ActionValueOperand = value;
  if (value.kind === 'constant' && typeof previous === 'number') next = value.value;
  else if (value.kind === 'constant' && Array.isArray(previous)) {
    const values = [...previous];
    values[Math.max(0, props.skillLevel - 1)] = value.value;
    next = values;
  }
  update({
    ...props.step.parameters,
    blackboardAssignments: { ...props.step.parameters.blackboardAssignments, [key]: next },
  });
}

function toEditableOperand(value: LevelValues | ActionValueOperand): ActionValueOperand {
  if (typeof value === 'object' && 'kind' in value) return value;
  const resolved = Array.isArray(value)
    ? (value[Math.max(0, props.skillLevel - 1)] ?? value[0] ?? 0)
    : value;
  return { kind: 'constant', value: resolved };
}

function removeAssignment(key: string): void {
  const current = { ...(props.step.parameters.blackboardAssignments ?? {}) };
  delete current[key];
  const parameters = { ...props.step.parameters };
  if (Object.keys(current).length === 0) delete parameters.blackboardAssignments;
  else parameters.blackboardAssignments = current;
  update(parameters);
}
</script>

<template>
  <div v-if="!definitionOnly" class="step-editor__grid">
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.buffId')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffId')"
      />
      <select
        :value="typeof step.parameters.buffId === 'string' ? 'constant' : 'blackboard'"
        @change="setBuffIdKind"
      >
        <option value="constant">{{ operandLabels().constant }}</option>
        <option value="blackboard">{{ operandLabels().blackboard }}</option>
      </select>
      <input
        type="text"
        :aria-label="
          typeof step.parameters.buffId === 'string'
            ? t('nextTimeline.skillEditing.buffId')
            : operandLabels().blackboardKey
        "
        :value="
          typeof step.parameters.buffId === 'string'
            ? step.parameters.buffId
            : step.parameters.buffId.blackboardKey
        "
        @input="setBuffId"
      />
    </label>
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.target')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffTarget')"
      />
      <select :value="step.parameters.target" @change="setTarget">
        <option v-for="target in BUFF_APPLICATION_TARGETS" :key="target" :value="target">
          {{ t(`nextTimeline.skillEditing.buffTargets.${target}`) }}
        </option>
      </select>
    </label>

    <label class="step-editor__optional">
      <span
        ><input
          type="checkbox"
          :checked="step.parameters.count !== undefined"
          @change="toggleOptional('count', $event)"
      /></span>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.buffCount')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffCount')"
      />
      <ActionValueOperandEditor
        v-if="step.parameters.count"
        :value="step.parameters.count"
        :labels="operandLabels()"
        @update="setOperand('count', $event)"
      />
    </label>
    <label class="step-editor__optional">
      <span
        ><input
          type="checkbox"
          :checked="step.parameters.source !== undefined"
          @change="toggleOptional('source', $event)"
      /></span>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.buffSource')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffSource')"
      />
      <select v-if="step.parameters.source" :value="step.parameters.source" @change="setSource">
        <option v-for="source in COMBAT_TARGETS" :key="source" :value="source">
          {{ t(`nextTimeline.skillEditing.targets.${source}`) }}
        </option>
      </select>
    </label>
    <label class="step-editor__optional">
      <span
        ><input
          type="checkbox"
          :checked="step.parameters.durationSeconds !== undefined"
          :disabled="typeof step.parameters.buffId !== 'string'"
          @change="toggleOptional('durationSeconds', $event)"
      /></span>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.durationSeconds')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffDuration')"
      />
      <input
        v-if="step.parameters.durationSeconds !== undefined"
        type="number"
        step="0.01"
        :value="step.parameters.durationSeconds"
        @input="setNumber('durationSeconds', $event)"
      />
    </label>
    <label class="step-editor__optional">
      <span
        ><input
          type="checkbox"
          :checked="step.parameters.effectiveness !== undefined"
          :disabled="typeof step.parameters.buffId !== 'string'"
          @change="toggleOptional('effectiveness', $event)"
      /></span>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.effectiveness')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffEffectiveness')"
      />
      <input
        v-if="step.parameters.effectiveness !== undefined"
        type="number"
        step="0.01"
        :value="step.parameters.effectiveness"
        @input="setNumber('effectiveness', $event)"
      />
    </label>
    <label class="step-editor__optional">
      <span
        ><input
          type="checkbox"
          :checked="step.parameters.inheritSourceSkillCastInfo !== undefined"
          @change="toggleOptional('inheritSourceSkillCastInfo', $event)"
      /></span>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.inheritSkillCast')"
        :help="t('nextTimeline.skillEditing.fieldHelp.inheritSkillCast')"
      />
      <input
        v-if="step.parameters.inheritSourceSkillCastInfo !== undefined"
        type="checkbox"
        :checked="step.parameters.inheritSourceSkillCastInfo"
        @change="setInherit"
      />
    </label>
  </div>

  <fieldset class="buff-definition">
    <legend v-if="!definitionOnly">
      <label class="step-editor__check">
        <input
          type="checkbox"
          :checked="step.parameters.definition !== undefined"
          :disabled="typeof step.parameters.buffId !== 'string'"
          @change="toggleDefinition"
        />
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.inlineBuffDefinition')"
          :help="t('nextTimeline.skillEditing.fieldHelp.inlineBuffDefinition')"
        />
      </label>
    </legend>
    <div v-if="step.parameters.definition" class="buff-definition__grid">
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.buffStackingType')" />
        <select :value="step.parameters.definition.stackingType" @change="setStackingType">
          <option v-for="type in BUFF_STACKING_TYPES" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.buffStackingKey')" />
        <input
          type="text"
          :value="step.parameters.definition.stackingKey ?? ''"
          @input="setDefinitionText('stackingKey', $event)"
        />
      </label>
      <label>
        <EditorFieldLabel label="时间域" />
        <select :value="step.parameters.definition.timeClock ?? ''" @change="setTimeClock">
          <option value="">默认（省略）</option>
          <option value="default">default</option>
          <option value="global">global</option>
          <option value="self">self</option>
        </select>
      </label>
      <label>
        <EditorFieldLabel label="首次触发前等待间隔" />
        <select
          :value="
            step.parameters.definition.waitFirstTriggerInterval === undefined
              ? ''
              : String(step.parameters.definition.waitFirstTriggerInterval)
          "
          @change="setWaitFirstTriggerInterval"
        >
          <option value="">未设置</option>
          <option value="true">是</option>
          <option value="false">否</option>
        </select>
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.buffApplyTags')"
          :help="t('nextTimeline.skillEditing.fieldHelp.buffApplyTags')"
        />
        <GameplayTagsEditor
          :tags="step.parameters.definition.applyTags ?? []"
          :minimum="0"
          @update="setDefinitionTags('applyTags', $event)"
        />
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.buffExtendTags')"
          :help="t('nextTimeline.skillEditing.fieldHelp.buffExtendTags')"
        />
        <GameplayTagsEditor
          :tags="step.parameters.definition.extendTags ?? []"
          :minimum="0"
          @update="setDefinitionTags('extendTags', $event)"
        />
      </label>
      <label>
        <EditorFieldLabel label="优先级" />
        <span class="buff-priority-editor">
          <BuffDefinitionScalarEditor
            :value="step.parameters.definition.priority"
            @update="setPriority"
          />
          <label v-if="typeof step.parameters.definition.priority === 'object'">
            <input
              type="checkbox"
              :checked="step.parameters.definition.priority.negate === true"
              @change="setPriorityNegate"
            />
            取反
          </label>
        </span>
      </label>
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.durationSeconds')" />
        <BuffDefinitionScalarEditor
          :value="step.parameters.definition.durationSeconds"
          :minimum="0"
          @update="setDefinitionScalar('durationSeconds', $event)"
        />
      </label>
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.maxStacks')" />
        <BuffDefinitionScalarEditor
          :value="step.parameters.definition.maxStackCount"
          integer
          :minimum="0"
          @update="setDefinitionScalar('maxStackCount', $event)"
        />
      </label>
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.buffTriggerInterval')" />
        <BuffDefinitionScalarEditor
          :value="step.parameters.definition.triggerIntervalSeconds"
          :minimum="0"
          @update="setDefinitionScalar('triggerIntervalSeconds', $event)"
        />
      </label>
      <label>
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.buffMaxTriggerCount')" />
        <BuffDefinitionScalarEditor
          :value="step.parameters.definition.maxTriggerCount"
          integer
          :minimum="-1"
          @update="setDefinitionScalar('maxTriggerCount', $event)"
        />
      </label>
    </div>
    <CombatBuffPresentationEditor
      v-if="step.parameters.definition"
      :presentation="step.parameters.definition.presentation"
      @update="setDefinitionPresentation"
    />
    <CombatBuffChildPresentationsEditor
      v-if="step.parameters.definition"
      :children="step.parameters.definition.childPresentations ?? []"
      @update="setDefinitionChildPresentations"
    />
    <BuffBlackboardEditor
      v-if="step.parameters.definition"
      :blackboard="step.parameters.definition.blackboard ?? {}"
      @update="setDefinitionBlackboard"
    />
    <BuffAttributeModifierEditor
      v-if="step.parameters.definition"
      :modifiers="step.parameters.definition.attributeModifiers ?? []"
      @update="setDefinitionAttributeModifiers"
    />
    <BuffDamageModifierEditor
      v-if="step.parameters.definition"
      :modifiers="step.parameters.definition.damageModifiers ?? []"
      @update="setDefinitionDamageModifiers"
    />
    <BuffSkillSlotReplacementEditor
      v-if="step.parameters.definition"
      :replacements="step.parameters.definition.skillSlotReplacements ?? []"
      @update="setDefinitionSkillSlotReplacements"
    />
    <BuffHealModifierEditor
      v-if="step.parameters.definition"
      :modifiers="step.parameters.definition.healModifiers ?? []"
      @update="setDefinitionHealModifiers"
    />
    <BuffPoiseModifierEditor
      v-if="step.parameters.definition"
      :modifiers="step.parameters.definition.poiseModifiers ?? []"
      @update="setDefinitionPoiseModifiers"
    />
    <BuffShieldEditor
      v-if="step.parameters.definition"
      :shields="step.parameters.definition.shields ?? []"
      @update="setDefinitionShields"
    />
    <BuffKeywordEnhancementEditor
      v-if="step.parameters.definition"
      :enhancements="step.parameters.definition.keywordEnhancements ?? []"
      @update="setDefinitionKeywordEnhancements"
    />
    <BuffAdvancedPropertiesEditor
      v-if="step.parameters.definition"
      :sustained-protection="step.parameters.definition.sustainedProtection"
      :role="step.parameters.definition.role"
      :spell-burst="step.parameters.definition.spellBurst"
      @update-sustained-protection="setDefinitionAdvancedProperty('sustainedProtection', $event)"
      @update-role="setDefinitionAdvancedProperty('role', $event)"
      @update-spell-burst="setDefinitionAdvancedProperty('spellBurst', $event)"
    />
  </fieldset>

  <fieldset v-if="step.parameters.definition && !inspectorOnly" class="buff-lifecycle">
    <legend>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.buffLifecycle')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffLifecycle')"
      />
    </legend>
    <div class="buff-lifecycle__tabs">
      <button
        v-for="key in BUFF_LIFECYCLE_KEYS"
        :key="key"
        type="button"
        :class="{
          'is-active': activeLifecycle === key,
          'is-enabled': step.parameters.definition.lifecycleSequences?.[key] !== undefined,
        }"
        @click="activeLifecycle = key"
      >
        {{ t(`nextTimeline.skillEditing.buffLifecycleKinds.${key}`) }}
      </button>
    </div>
    <label class="buff-lifecycle__toggle">
      <input
        type="checkbox"
        :checked="step.parameters.definition.lifecycleSequences?.[activeLifecycle] !== undefined"
        @change="toggleLifecycle(activeLifecycle, $event)"
      />
      {{ t('nextTimeline.skillEditing.enableBuffLifecycle') }}
    </label>
    <ActionSequenceEditor
      v-if="
        step.parameters.definition.lifecycleSequences?.[activeLifecycle] &&
        createStep &&
        duplicateStep
      "
      :sequence="step.parameters.definition.lifecycleSequences[activeLifecycle]!"
      :skill-level="skillLevel"
      :create-step="createStep"
      :duplicate-step="duplicateStep"
      :selected-path="selectedLifecycleStepPath"
      @update="setLifecycleSequence(activeLifecycle, $event)"
    />
  </fieldset>

  <fieldset v-if="!definitionOnly" class="buff-assignments">
    <legend>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.buffAssignments')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffAssignments')"
      />
    </legend>
    <div v-for="[key, value] in assignments" :key="key" class="buff-assignment">
      <input type="text" :value="key" @change="renameAssignment(key, $event)" />
      <ActionValueOperandEditor
        :value="value"
        :labels="operandLabels()"
        @update="setAssignment(key, $event)"
      />
      <button
        type="button"
        class="buff-assignment__remove"
        :title="t('nextTimeline.skillEditing.deleteAssignment')"
        @click="removeAssignment(key)"
      >
        ×
      </button>
    </div>
    <button type="button" class="buff-assignment__add" @click="appendAssignment">
      {{ t('nextTimeline.skillEditing.addAssignment') }}
    </button>
  </fieldset>
</template>

<style scoped>
.step-editor__optional {
  grid-column: 1 / -1;
  display: grid !important;
  grid-template-columns: 18px minmax(130px, 180px) minmax(0, 1fr) !important;
}

.buff-assignment {
  display: grid;
  grid-template-columns: minmax(120px, 180px) minmax(0, 1fr) 30px;
  gap: 8px;
  margin-bottom: 8px;
}

.buff-definition__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
}

.buff-definition__grid label {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(110px, 150px) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}

.buff-lifecycle__tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
  margin-bottom: 10px;
}

.buff-lifecycle__tabs button {
  position: relative;
  min-width: 0;
  min-height: 30px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg-muted);
  cursor: pointer;
}

.buff-lifecycle__tabs button.is-active {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}

.buff-lifecycle__tabs button.is-enabled::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 4px;
  width: 5px;
  height: 5px;
  background: var(--ea-gold);
}

.buff-lifecycle__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}

@container (max-width: 760px) {
  .buff-lifecycle__tabs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.buff-assignment input,
.buff-assignment button,
.buff-assignment__add {
  min-width: 0;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}

.buff-assignment__remove {
  color: var(--ea-danger, #ff5c5c);
}
.buff-assignment__add {
  padding: 0 12px;
}
</style>
