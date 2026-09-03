<script setup lang="ts">
import type { GameplayTag } from '../../../../../packages/game-data-contract/src/gameplayTags';
import { GAMEPLAY_TAG_QUERY_TYPES } from '../../../../../packages/game-data-contract/src/gameplayTags';

/**
 * 战斗条件树的递归参数编辑器。
 *
 * 每次更新都回传完整 CombatCondition。逻辑组合递归复用本组件；类型切换统一调用
 * 条件工厂，保证编辑过程中的每个节点都满足严格结构约束。
 */
import { computed, defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  COMBAT_CONDITION_KINDS,
  COMBAT_TARGETS,
  GLOBAL_COOLDOWN_TARGETS,
  BUFF_SINGLE_TARGETS,
  COMPARISON_OPERATORS,
  DAMAGE_ELEMENTS,
  DAMAGE_FEATURES,
  DAMAGE_TAGS,
  DAMAGE_TYPES,
  ELEMENTAL_REACTIONS,
  INFLICTION_ELEMENTS,
  OPERATOR_ATTRIBUTES,
  SKILL_TYPES,
  type ActionValueOperand,
  type CombatCondition,
  type CombatConditionKind,
  type ComparisonOperator,
  type DamageElement,
  type DamageFeature,
  type DamageTag,
  type DamageType,
  type ElementalReaction,
  type InflictionElement,
  type OperatorAttribute,
  type SkillType,
} from '../../../core/game-data/operatorDefinition';
import { ENEMY_RANKS, type EnemyRank } from '../../../core/game-data/enemyRank';
import { createCombatCondition, parseConditionStringList } from '../combatConditionEditorViewModel';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';
import GameplayTagsEditor from './GameplayTagsEditor.vue';

const RecursiveConditionEditor = defineAsyncComponent(() => import('./CombatConditionEditor.vue'));
const TAG_QUERY_TYPES = GAMEPLAY_TAG_QUERY_TYPES;
const EVENT_TAG_MATCH_TYPES = ['exact', ...TAG_QUERY_TYPES] as const;
const CONDITION_QUERY_TARGETS = [...BUFF_SINGLE_TARGETS, 'actionInputTarget'] as const;

const props = defineProps<{ condition: CombatCondition; layerOnly?: boolean }>();
const emit = defineEmits<{ update: [condition: CombatCondition] }>();
const { t } = useI18n({ useScope: 'global' });
const newChildKind = ref<CombatConditionKind>('combatActive');

const operandLabels = () => ({
  constant: t('nextTimeline.skillEditing.operandConstant'),
  blackboard: t('nextTimeline.skillEditing.operandBlackboard'),
  blackboardKey: t('nextTimeline.skillEditing.operandBlackboardKey'),
  constantValue: t('nextTimeline.skillEditing.operandConstantValue'),
});
const conditionKindLabel = (kind: CombatConditionKind): string =>
  kind === 'enemyRankIn' ? 'Enemy rank' : t(`nextTimeline.skillEditing.conditionKinds.${kind}`);
const isLeafWithoutParameters = computed(() =>
  ['combatActive', 'singleEnemyPresent', 'casterControlled', 'casterComboPending'].includes(
    props.condition.kind,
  ),
);

function setKind(event: Event): void {
  const kind = (event.target as HTMLSelectElement).value as CombatConditionKind;
  if (COMBAT_CONDITION_KINDS.includes(kind)) emit('update', createCombatCondition(kind));
}

function setTarget(event: Event): void {
  const rawTarget = (event.target as HTMLSelectElement).value;
  const condition = props.condition;
  if (condition.kind === 'globalCooldownPresent') {
    const target = GLOBAL_COOLDOWN_TARGETS.find(value => value === rawTarget);
    if (target) emit('update', { ...condition, target });
    return;
  }
  if (
    condition.kind === 'buffStackCompare' ||
    condition.kind === 'buffTagIdCountCompare' ||
    condition.kind === 'entityTagMatch' ||
    condition.kind === 'buffIdStackCompare'
  ) {
    const target = CONDITION_QUERY_TARGETS.find(value => value === rawTarget);
    if (target !== undefined) emit('update', { ...condition, target });
    return;
  }
  const target = COMBAT_TARGETS.find(value => value === rawTarget);
  if (target === undefined) return;
  switch (condition.kind) {
    case 'targetStaggered':
      emit('update', { ...condition, target });
      break;
    case 'healthCompare':
      emit('update', { ...condition, target });
      break;
    case 'poiseCompare':
      emit('update', { ...condition, target });
      break;
    case 'statusActive':
      emit('update', { ...condition, target });
      break;
    case 'timedMarkerPresent':
      emit('update', { ...condition, target });
      break;
  }
}

function setCurrentSkillTarget(event: Event): void {
  if (props.condition.kind !== 'currentSkillTypeIn') return;
  const target = (event.target as HTMLSelectElement).value;
  if (target === 'caster' || target === 'buffOwner') {
    emit('update', { ...props.condition, target });
  }
}

function toggleCurrentSkillType(skillType: SkillType, event: Event): void {
  if (props.condition.kind !== 'currentSkillTypeIn') return;
  const checked = (event.target as HTMLInputElement).checked;
  const skillTypes = checked
    ? [...new Set([...props.condition.skillTypes, skillType])]
    : props.condition.skillTypes.filter(value => value !== skillType);
  // 严格定义不接受空集合；至少保留用户最后一个已选类型。
  if (skillTypes.length > 0) emit('update', { ...props.condition, skillTypes });
}

function setText(field: 'branchKey' | 'flag' | 'statusKey' | 'markerId', event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  const condition = props.condition;
  if (field === 'branchKey' && condition.kind === 'skillBranchEnabled')
    emit('update', { ...condition, branchKey: value });
  else if (field === 'flag' && condition.kind === 'contextFlagEquals')
    emit('update', { ...condition, flag: value });
  else if (field === 'statusKey' && condition.kind === 'statusActive')
    emit('update', { ...condition, statusKey: value });
  else if (
    field === 'markerId' &&
    (condition.kind === 'timedMarkerPresent' || condition.kind === 'globalCooldownPresent')
  )
    emit('update', { ...condition, markerId: value });
}

function setComparison(event: Event): void {
  const operator = (event.target as HTMLSelectElement).value as ComparisonOperator;
  if (!COMPARISON_OPERATORS.includes(operator)) return;
  const condition = props.condition;
  switch (condition.kind) {
    case 'healthCompare':
      emit('update', { ...condition, operator });
      break;
    case 'poiseCompare':
      emit('update', { ...condition, operator });
      break;
    case 'enemySuperArmorCompare':
    case 'currentBuffStackCompare':
      emit('update', { ...condition, operator });
      break;
    case 'cameraToTargetAngleCompare':
      emit('update', { ...condition, operator });
      break;
    case 'actionValueCompare':
      emit('update', { ...condition, operator });
      break;
    case 'abilityEntityRemainingDurationCompare':
      emit('update', { ...condition, operator });
      break;
    case 'buffStackCompare':
    case 'buffTagIdCountCompare':
      emit('update', { ...condition, operator });
      break;
    case 'eventTargetBuffCountCompare':
    case 'contextTargetBuffStackCompare':
      emit('update', { ...condition, operator });
      break;
    case 'buffIdStackCompare':
      emit('update', { ...condition, operator });
      break;
    case 'deckAttributeCompare':
      emit('update', { ...condition, operator });
      break;
  }
}

function setOperand(
  field: 'value' | 'left' | 'right' | 'probability',
  value: ActionValueOperand,
): void {
  const condition = props.condition;
  if (condition.kind === 'healthCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'poiseCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'enemySuperArmorCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'currentBuffStackCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'cameraToTargetAngleCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'buffStackCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'buffTagIdCountCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'contextTargetBuffStackCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'eventTargetBuffCountCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'actionValueCompare' && field === 'left')
    emit('update', { ...condition, left: value });
  else if (condition.kind === 'actionValueCompare' && field === 'right')
    emit('update', { ...condition, right: value });
  else if (condition.kind === 'abilityEntityRemainingDurationCompare' && field === 'value')
    emit('update', { ...condition, value });
  else if (condition.kind === 'probability' && field === 'probability')
    emit('update', { ...condition, probability: value });
}

function setContextValue(event: Event): void {
  if (props.condition.kind !== 'contextFlagEquals') return;
  const current = props.condition.value;
  const input = event.target as HTMLInputElement | HTMLSelectElement;
  const value =
    typeof current === 'boolean'
      ? input.value === 'true'
      : typeof current === 'number'
        ? Number(input.value)
        : input.value;
  if (typeof value === 'number' && !Number.isFinite(value)) return;
  emit('update', { ...props.condition, value });
}

function setContextValueKind(event: Event): void {
  if (props.condition.kind !== 'contextFlagEquals') return;
  const kind = (event.target as HTMLSelectElement).value;
  emit('update', {
    ...props.condition,
    value: kind === 'boolean' ? false : kind === 'number' ? 0 : '',
  });
}

function setGameplayTags(values: readonly GameplayTag[]): void {
  if (
    props.condition.kind === 'buffStackCompare' ||
    props.condition.kind === 'buffTagIdCountCompare' ||
    props.condition.kind === 'contextTargetBuffStackCompare'
  )
    emit('update', { ...props.condition, buffTags: values });
  else if (props.condition.kind === 'entityTagMatch')
    emit('update', { ...props.condition, tags: values });
  else if (props.condition.kind === 'contextTargetEntityTagMatch')
    emit('update', { ...props.condition, tags: values });
  else if (props.condition.kind === 'eventBuffTagsMatch')
    emit('update', { ...props.condition, buffTags: values });
  else if (props.condition.kind === 'eventTargetBuffCountCompare')
    emit('update', { ...props.condition, buffTags: values });
}

function setBuffIds(event: Event): void {
  if (props.condition.kind !== 'buffIdStackCompare' && props.condition.kind !== 'eventBuffIdMatch')
    return;
  const buffIds = parseConditionStringList((event.target as HTMLTextAreaElement).value);
  if (buffIds) emit('update', { ...props.condition, buffIds });
}

function setBuffStackValueKind(event: Event): void {
  if (props.condition.kind !== 'buffIdStackCompare') return;
  const kind = (event.target as HTMLSelectElement).value;
  emit('update', {
    ...props.condition,
    value: kind === 'operand' ? { kind: 'constant', value: 1 } : 1,
  });
}

function setBuffStackScalar(event: Event): void {
  if (props.condition.kind !== 'buffIdStackCompare') return;
  const value = Number((event.target as HTMLInputElement).value);
  if (Number.isFinite(value)) emit('update', { ...props.condition, value });
}

function setBuffStackOperand(value: ActionValueOperand): void {
  if (props.condition.kind !== 'buffIdStackCompare' || typeof props.condition.value === 'number')
    return;
  emit('update', { ...props.condition, value });
}

function setTagQueryType(event: Event): void {
  const tagQueryType = (event.target as HTMLSelectElement)
    .value as (typeof TAG_QUERY_TYPES)[number];
  if (!TAG_QUERY_TYPES.includes(tagQueryType)) return;
  if (
    props.condition.kind === 'buffStackCompare' ||
    props.condition.kind === 'buffTagIdCountCompare' ||
    props.condition.kind === 'contextTargetBuffStackCompare'
  )
    emit('update', { ...props.condition, tagQueryType });
  else if (props.condition.kind === 'eventTargetBuffCountCompare')
    emit('update', { ...props.condition, tagQueryType });
  else if (props.condition.kind === 'entityTagMatch')
    emit('update', { ...props.condition, tagQueryType });
  else if (props.condition.kind === 'contextTargetEntityTagMatch')
    emit('update', { ...props.condition, tagQueryType });
}

function setContextKey(event: Event): void {
  const condition = props.condition;
  if (
    condition.kind === 'contextTargetObjectTypeMatch' ||
    condition.kind === 'contextTargetBuffStackCompare' ||
    condition.kind === 'contextTargetIdentityMatch' ||
    condition.kind === 'contextTargetEntityTagMatch'
  )
    emit('update', { ...condition, contextKey: (event.target as HTMLInputElement).value });
}

function setActionContextIdentityOther(event: Event): void {
  const condition = props.condition;
  if (
    condition.kind !== 'actionInputTargetIdentityMatch' &&
    condition.kind !== 'contextTargetIdentityMatch'
  )
    return;
  const other = (event.target as HTMLSelectElement).value;
  if (other === 'actionSource' || other === 'actionOwner' || other === 'controlledOperator') {
    emit('update', { ...condition, other });
  }
}

function setIdentityComparison(event: Event): void {
  const condition = props.condition;
  if (
    condition.kind !== 'actionInputTargetIdentityMatch' &&
    condition.kind !== 'contextTargetIdentityMatch'
  )
    return;
  const operator = (event.target as HTMLSelectElement).value;
  if (operator === 'equal' || operator === 'notEqual') emit('update', { ...condition, operator });
}

function setObjectTypeMask(event: Event): void {
  if (
    props.condition.kind !== 'contextTargetObjectTypeMatch' &&
    props.condition.kind !== 'actionInputTargetObjectTypeMatch'
  )
    return;
  const raw = (event.target as HTMLInputElement).value;
  const value = Number(raw);
  if (raw.trim() !== '' && Number.isInteger(value) && value >= -2147483648 && value <= 2147483647)
    emit('update', { ...props.condition, objectTypeMask: value });
}

function setEventTagMatch(event: Event): void {
  if (
    props.condition.kind !== 'eventDamageTagsMatch' &&
    props.condition.kind !== 'eventDamageFeaturesMatch'
  )
    return;
  const match = (event.target as HTMLSelectElement).value as (typeof EVENT_TAG_MATCH_TYPES)[number];
  if (EVENT_TAG_MATCH_TYPES.includes(match)) emit('update', { ...props.condition, match });
}

function setEventBuffTagMatch(event: Event): void {
  if (props.condition.kind !== 'eventBuffTagsMatch') return;
  const match = (event.target as HTMLSelectElement).value as (typeof TAG_QUERY_TYPES)[number];
  if (TAG_QUERY_TYPES.includes(match)) emit('update', { ...props.condition, match });
}

function toggleEventDamageTag(tag: DamageTag, event: Event): void {
  if (props.condition.kind !== 'eventDamageTagsMatch') return;
  const enabled = (event.target as HTMLInputElement).checked;
  const tags = enabled
    ? [...new Set([...props.condition.tags, tag])]
    : props.condition.tags.filter(item => item !== tag);
  if (tags.length > 0) emit('update', { ...props.condition, tags });
}

function toggleEventDamageFeature(feature: DamageFeature, event: Event): void {
  if (props.condition.kind !== 'eventDamageFeaturesMatch') return;
  const enabled = (event.target as HTMLInputElement).checked;
  const features = enabled
    ? [...new Set([...props.condition.features, feature])]
    : props.condition.features.filter(item => item !== feature);
  if (features.length > 0) emit('update', { ...props.condition, features });
}

function toggleEventDamageType(damageType: DamageType, event: Event): void {
  if (props.condition.kind !== 'eventDamageTypeIn') return;
  const enabled = (event.target as HTMLInputElement).checked;
  const damageTypes = enabled
    ? [...new Set([...props.condition.damageTypes, damageType])]
    : props.condition.damageTypes.filter(item => item !== damageType);
  if (damageTypes.length > 0) emit('update', { ...props.condition, damageTypes });
}

function toggleEventInflictionElement(element: InflictionElement, event: Event): void {
  if (props.condition.kind !== 'eventInflictionElementIn') return;
  const enabled = (event.target as HTMLInputElement).checked;
  const elements = enabled
    ? [...new Set([...props.condition.elements, element])]
    : props.condition.elements.filter(item => item !== element);
  if (elements.length > 0) emit('update', { ...props.condition, elements });
}

function setOptionalInteger(field: 'minimumStacks' | 'minimumLevel', event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isInteger(value) || value < 0) return;
  if (field === 'minimumStacks' && props.condition.kind === 'statusActive')
    emit('update', { ...props.condition, minimumStacks: value });
  else if (field === 'minimumStacks' && props.condition.kind === 'elementalInflictionPresent')
    emit('update', { ...props.condition, minimumStacks: value });
  else if (field === 'minimumLevel' && props.condition.kind === 'elementalReactionActive')
    emit('update', { ...props.condition, minimumLevel: value });
}

function toggleOptionalInteger(field: 'minimumStacks' | 'minimumLevel', event: Event): void {
  const enabled = (event.target as HTMLInputElement).checked;
  const condition = props.condition;
  if (field === 'minimumStacks' && condition.kind === 'statusActive') {
    if (enabled) emit('update', { ...condition, minimumStacks: 1 });
    else {
      const { minimumStacks: _, ...rest } = condition;
      emit('update', rest);
    }
  } else if (field === 'minimumStacks' && condition.kind === 'elementalInflictionPresent') {
    if (enabled) emit('update', { ...condition, minimumStacks: 1 });
    else {
      const { minimumStacks: _, ...rest } = condition;
      emit('update', rest);
    }
  } else if (field === 'minimumLevel' && condition.kind === 'elementalReactionActive') {
    if (enabled) emit('update', { ...condition, minimumLevel: 1 });
    else {
      const { minimumLevel: _, ...rest } = condition;
      emit('update', rest);
    }
  }
}

function toggleElement(element: DamageElement, event: Event): void {
  if (props.condition.kind !== 'elementalInflictionPresent') return;
  const enabled = (event.target as HTMLInputElement).checked;
  const current = Array.isArray(props.condition.elements)
    ? [...props.condition.elements]
    : [props.condition.elements];
  const elements = enabled
    ? [...new Set([...current, element])]
    : current.filter(item => item !== element);
  if (elements.length === 0) return;
  emit('update', { ...props.condition, elements: elements.length === 1 ? elements[0]! : elements });
}

function setReaction(event: Event): void {
  if (props.condition.kind !== 'elementalReactionActive') return;
  const reaction = (event.target as HTMLSelectElement).value as ElementalReaction;
  if (ELEMENTAL_REACTIONS.includes(reaction)) emit('update', { ...props.condition, reaction });
}

function toggleEnemyRank(rank: EnemyRank, event: Event): void {
  if (props.condition.kind !== 'enemyRankIn') return;
  const enabled = (event.target as HTMLInputElement).checked;
  const ranks = enabled
    ? [...new Set([...props.condition.ranks, rank])]
    : props.condition.ranks.filter(item => item !== rank);
  emit('update', { ...props.condition, ranks });
}

function setAttribute(side: 'left' | 'right', event: Event): void {
  if (props.condition.kind !== 'deckAttributeCompare') return;
  const attribute = (event.target as HTMLSelectElement).value as OperatorAttribute;
  if (!OPERATOR_ATTRIBUTES.includes(attribute)) return;
  emit('update', { ...props.condition, [side]: attribute });
}

function updateChild(index: number, condition: CombatCondition): void {
  if (props.condition.kind === 'not') emit('update', { ...props.condition, condition });
  else if (props.condition.kind === 'all' || props.condition.kind === 'any') {
    const conditions = [...props.condition.conditions];
    conditions[index] = condition;
    emit('update', { ...props.condition, conditions });
  }
}

function appendChild(): void {
  if (props.condition.kind !== 'all' && props.condition.kind !== 'any') return;
  emit('update', {
    ...props.condition,
    conditions: [...props.condition.conditions, createCombatCondition(newChildKind.value)],
  });
}

function removeChild(index: number): void {
  if (props.condition.kind !== 'all' && props.condition.kind !== 'any') return;
  if (props.condition.conditions.length <= 1) return;
  emit('update', {
    ...props.condition,
    conditions: props.condition.conditions.filter((_, itemIndex) => itemIndex !== index),
  });
}
</script>

<template>
  <section class="condition-editor">
    <label class="condition-editor__field">
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.conditionKind')"
        :help="t('nextTimeline.skillEditing.fieldHelp.conditionKind')"
      />
      <select :value="condition.kind" @change="setKind">
        <option v-for="kind in COMBAT_CONDITION_KINDS" :key="kind" :value="kind">
          {{ conditionKindLabel(kind) }}
        </option>
      </select>
    </label>
    <p v-if="isLeafWithoutParameters" class="condition-editor__note">
      {{ t('nextTimeline.skillEditing.conditionNoParameters') }}
    </p>
    <template v-if="condition.kind === 'currentSkillTypeIn'">
      <label class="condition-editor__field">
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.target')" />
        <select :value="condition.target" @change="setCurrentSkillTarget">
          <option value="caster">
            {{ t('nextTimeline.skillEditing.currentSkillTargets.caster') }}
          </option>
          <option value="buffOwner">
            {{ t('nextTimeline.skillEditing.currentSkillTargets.buffOwner') }}
          </option>
        </select>
      </label>
      <fieldset class="condition-editor__checks">
        <legend>{{ t('nextTimeline.skillEditing.cooldownSkillType') }}</legend>
        <label v-for="skillType in SKILL_TYPES" :key="skillType">
          <input
            type="checkbox"
            :checked="condition.skillTypes.includes(skillType)"
            @change="toggleCurrentSkillType(skillType, $event)"
          />
          {{ t(`hitEditor.skillTypes.${skillType}`) }}
        </label>
      </fieldset>
    </template>
    <label
      v-if="
        condition.kind === 'contextTargetObjectTypeMatch' ||
        condition.kind === 'contextTargetBuffStackCompare' ||
        condition.kind === 'contextTargetIdentityMatch' ||
        condition.kind === 'contextTargetEntityTagMatch'
      "
      class="condition-editor__field"
    >
      <EditorFieldLabel :label="t('nextTimeline.skillEditing.conditionContextKey')" />
      <input type="text" :value="condition.contextKey" @input="setContextKey" />
    </label>

    <template
      v-if="
        condition.kind === 'actionInputTargetIdentityMatch' ||
        condition.kind === 'contextTargetIdentityMatch'
      "
    >
      <label class="condition-editor__field">
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.actionContextIdentityOther')" />
        <select :value="condition.other" @change="setActionContextIdentityOther">
          <option value="controlledOperator">
            {{ t('nextTimeline.skillEditing.actionContextIdentities.controlledOperator') }}
          </option>
          <option value="actionSource">
            {{ t('nextTimeline.skillEditing.actionContextIdentities.actionSource') }}
          </option>
          <option value="actionOwner">
            {{ t('nextTimeline.skillEditing.actionContextIdentities.actionOwner') }}
          </option>
        </select>
      </label>
      <label class="condition-editor__field">
        <EditorFieldLabel :label="t('nextTimeline.skillEditing.comparisonOperator')" />
        <select :value="condition.operator" @change="setIdentityComparison">
          <option value="equal">
            {{ t('nextTimeline.skillEditing.comparisonOperators.equal') }}
          </option>
          <option value="notEqual">
            {{ t('nextTimeline.skillEditing.comparisonOperators.notEqual') }}
          </option>
        </select>
      </label>
    </template>
    <label
      v-if="
        condition.kind === 'contextTargetObjectTypeMatch' ||
        condition.kind === 'actionInputTargetObjectTypeMatch'
      "
      class="condition-editor__field"
    >
      <EditorFieldLabel :label="t('nextTimeline.skillEditing.conditionObjectTypeMask')" />
      <input
        type="number"
        step="1"
        min="-2147483648"
        max="2147483647"
        :value="condition.objectTypeMask"
        @input="setObjectTypeMask"
      />
    </label>

    <label v-if="condition.kind === 'skillBranchEnabled'" class="condition-editor__field"
      ><EditorFieldLabel
        :label="t('nextTimeline.skillEditing.branchKey')"
        :help="t('nextTimeline.skillEditing.fieldHelp.branchKey')" /><input
        type="text"
        :value="condition.branchKey"
        @input="setText('branchKey', $event)"
    /></label>

    <label
      v-if="
        [
          'targetStaggered',
          'healthCompare',
          'poiseCompare',
          'statusActive',
          'buffStackCompare',
          'buffTagIdCountCompare',
          'entityTagMatch',
          'buffIdStackCompare',
          'timedMarkerPresent',
          'globalCooldownPresent',
        ].includes(condition.kind)
      "
      class="condition-editor__field"
      ><EditorFieldLabel
        :label="t('nextTimeline.skillEditing.target')"
        :help="t('nextTimeline.skillEditing.fieldHelp.conditionTarget')"
      /><select :value="'target' in condition ? condition.target : 'enemy'" @change="setTarget">
        <option
          v-for="target in [
            'buffStackCompare',
            'buffTagIdCountCompare',
            'entityTagMatch',
            'buffIdStackCompare',
          ].includes(condition.kind)
            ? CONDITION_QUERY_TARGETS
            : condition.kind === 'globalCooldownPresent'
              ? GLOBAL_COOLDOWN_TARGETS
              : COMBAT_TARGETS"
          :key="target"
          :value="target"
        >
          {{ t(`nextTimeline.skillEditing.targets.${target}`) }}
        </option>
      </select></label
    >

    <template v-if="condition.kind === 'healthCompare'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.healthValueType')"
          :help="t('nextTimeline.skillEditing.fieldHelp.healthValueType')"
        /><select
          :value="condition.valueType"
          @change="
            emit('update', {
              ...condition,
              valueType: ($event.target as HTMLSelectElement).value as 'current' | 'ratio',
            })
          "
        >
          <option value="current">
            {{ t('nextTimeline.skillEditing.healthValueTypes.current') }}
          </option>
          <option value="ratio">{{ t('nextTimeline.skillEditing.healthValueTypes.ratio') }}</option>
        </select></label
      >
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comparisonOperator')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
        /><select :value="condition.operator" @change="setComparison">
          <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
            {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__operand"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.compareValue')"
          :help="
            t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
          " /><ActionValueOperandEditor
          :value="condition.value"
          :labels="operandLabels()"
          @update="setOperand('value', $event)"
      /></label>
    </template>

    <template v-if="condition.kind === 'poiseCompare'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comparisonOperator')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
        /><select :value="condition.operator" @change="setComparison">
          <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
            {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__operand"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.compareValue')"
          :help="
            t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
          " /><ActionValueOperandEditor
          :value="condition.value"
          :labels="operandLabels()"
          @update="setOperand('value', $event)"
      /></label>
      <label class="condition-editor__check">
        <input
          type="checkbox"
          :checked="condition.returnValueIfMissing"
          @change="
            emit('update', {
              ...condition,
              returnValueIfMissing: ($event.target as HTMLInputElement).checked,
            })
          "
        />
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.returnValueIfPoiseMissing')"
          :help="t('nextTimeline.skillEditing.fieldHelp.returnValueIfPoiseMissing')"
        />
      </label>
    </template>

    <fieldset v-if="condition.kind === 'enemyRankIn'" class="condition-editor__elements">
      <legend>Enemy rank</legend>
      <label v-for="rank in ENEMY_RANKS" :key="rank"
        ><input
          type="checkbox"
          :checked="condition.ranks.includes(rank)"
          @change="toggleEnemyRank(rank, $event)"
        />{{ rank }}</label
      >
    </fieldset>

    <template
      v-if="
        condition.kind === 'enemySuperArmorCompare' || condition.kind === 'currentBuffStackCompare'
      "
    >
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comparisonOperator')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
        /><select :value="condition.operator" @change="setComparison">
          <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
            {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__operand"
        ><EditorFieldLabel
          :label="
            t(
              `nextTimeline.skillEditing.${condition.kind === 'currentBuffStackCompare' ? 'compareValue' : 'superArmor'}`,
            )
          "
          :help="
            t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
          " /><ActionValueOperandEditor
          :value="condition.value"
          :labels="operandLabels()"
          @update="setOperand('value', $event)"
      /></label>
    </template>

    <template v-if="condition.kind === 'cameraToTargetAngleCompare'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comparisonOperator')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
        /><select :value="condition.operator" @change="setComparison">
          <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
            {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__operand"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.cameraTargetAngle')"
          :help="
            t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
          " /><ActionValueOperandEditor
          :value="condition.value"
          :labels="operandLabels()"
          @update="setOperand('value', $event)"
      /></label>
    </template>

    <template v-if="condition.kind === 'contextFlagEquals'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.contextFlag')"
          :help="t('nextTimeline.skillEditing.fieldHelp.contextFlag')" /><input
          type="text"
          :value="condition.flag"
          @input="setText('flag', $event)"
      /></label>
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.contextValueType')"
          :help="t('nextTimeline.skillEditing.fieldHelp.contextValueType')"
        /><select :value="typeof condition.value" @change="setContextValueKind">
          <option value="boolean">{{ t('nextTimeline.skillEditing.valueTypes.boolean') }}</option>
          <option value="number">{{ t('nextTimeline.skillEditing.valueTypes.number') }}</option>
          <option value="string">{{ t('nextTimeline.skillEditing.valueTypes.string') }}</option>
        </select></label
      >
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.value')"
          :help="t('nextTimeline.skillEditing.fieldHelp.contextValue')" /><select
          v-if="typeof condition.value === 'boolean'"
          :value="String(condition.value)"
          @change="setContextValue"
        >
          <option value="true">{{ t('nextTimeline.skillEditing.booleanValues.true') }}</option>
          <option value="false">
            {{ t('nextTimeline.skillEditing.booleanValues.false') }}
          </option></select
        ><input
          v-else
          :type="typeof condition.value === 'number' ? 'number' : 'text'"
          :value="condition.value"
          @input="setContextValue"
      /></label>
    </template>

    <template v-if="condition.kind === 'actionValueCompare'">
      <label class="condition-editor__operand"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.operandLeft')"
          :help="
            t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
          " /><ActionValueOperandEditor
          :value="condition.left"
          :labels="operandLabels()"
          @update="setOperand('left', $event)"
      /></label>
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comparisonOperator')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
        /><select :value="condition.operator" @change="setComparison">
          <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
            {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__operand"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.operandRight')"
          :help="
            t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
          " /><ActionValueOperandEditor
          :value="condition.right"
          :labels="operandLabels()"
          @update="setOperand('right', $event)"
      /></label>
    </template>

    <label v-if="condition.kind === 'probability'" class="condition-editor__operand"
      ><EditorFieldLabel
        :label="t('nextTimeline.skillEditing.probability')"
        :help="
          t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
        " /><ActionValueOperandEditor
        :value="condition.probability"
        :labels="operandLabels()"
        @update="setOperand('probability', $event)"
    /></label>

    <template v-if="condition.kind === 'abilityEntityRemainingDurationCompare'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comparisonOperator')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
        /><select :value="condition.operator" @change="setComparison">
          <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
            {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__operand"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.value')"
          :help="
            t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
          " /><ActionValueOperandEditor
          :value="condition.value"
          :labels="operandLabels()"
          @update="setOperand('value', $event)"
      /></label>
    </template>

    <template v-if="condition.kind === 'statusActive'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.statusKey')"
          :help="t('nextTimeline.skillEditing.fieldHelp.statusKey')" /><input
          type="text"
          :value="condition.statusKey"
          @input="setText('statusKey', $event)"
      /></label>
      <label class="condition-editor__optional"
        ><input
          type="checkbox"
          :checked="condition.minimumStacks !== undefined"
          @change="toggleOptionalInteger('minimumStacks', $event)" /><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.minimumStacks')"
          :help="t('nextTimeline.skillEditing.fieldHelp.minimumStacks')" /><input
          v-if="condition.minimumStacks !== undefined"
          type="number"
          min="0"
          :value="condition.minimumStacks"
          @input="setOptionalInteger('minimumStacks', $event)"
      /></label>
    </template>

    <template
      v-if="
        condition.kind === 'buffStackCompare' ||
        condition.kind === 'buffTagIdCountCompare' ||
        condition.kind === 'contextTargetBuffStackCompare' ||
        condition.kind === 'eventTargetBuffCountCompare' ||
        condition.kind === 'entityTagMatch' ||
        condition.kind === 'contextTargetEntityTagMatch'
      "
    >
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.tagQueryType')"
          :help="t('nextTimeline.skillEditing.fieldHelp.tagQueryType')"
        /><select :value="condition.tagQueryType" @change="setTagQueryType">
          <option v-for="type in TAG_QUERY_TYPES" :key="type" :value="type">
            {{ t(`nextTimeline.skillEditing.tagQueryTypes.${type}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.buffTags')"
          :help="t('nextTimeline.skillEditing.fieldHelp.buffTags')"
        /><GameplayTagsEditor
          :tags="
            condition.kind === 'entityTagMatch' || condition.kind === 'contextTargetEntityTagMatch'
              ? condition.tags
              : condition.buffTags
          "
          @update="setGameplayTags"
        />
      </label>
      <template
        v-if="
          condition.kind === 'buffStackCompare' ||
          condition.kind === 'buffTagIdCountCompare' ||
          condition.kind === 'eventTargetBuffCountCompare' ||
          condition.kind === 'contextTargetBuffStackCompare'
        "
        ><label class="condition-editor__field"
          ><EditorFieldLabel
            :label="t('nextTimeline.skillEditing.comparisonOperator')"
            :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
          /><select :value="condition.operator" @change="setComparison">
            <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
              {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
            </option>
          </select></label
        ><label class="condition-editor__operand"
          ><EditorFieldLabel
            :label="t('nextTimeline.skillEditing.compareValue')"
            :help="
              t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
            " /><ActionValueOperandEditor
            :value="condition.value"
            :labels="operandLabels()"
            @update="setOperand('value', $event)" /></label
      ></template>
    </template>

    <template v-if="condition.kind === 'buffIdStackCompare'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.buffIds')"
          :help="t('nextTimeline.skillEditing.fieldHelp.buffIds')"
        /><textarea :value="condition.buffIds.join(', ')" @change="setBuffIds" />
      </label>
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comparisonOperator')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
        /><select :value="condition.operator" @change="setComparison">
          <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
            {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.valueTypes.number')"
          :help="t('nextTimeline.skillEditing.fieldHelp.buffStackValueKind')"
        /><select
          :value="typeof condition.value === 'number' ? 'scalar' : 'operand'"
          @change="setBuffStackValueKind"
        >
          <option value="scalar">{{ t('nextTimeline.skillEditing.scalarValue') }}</option>
          <option value="operand">{{ t('nextTimeline.skillEditing.actionOperandValue') }}</option>
        </select></label
      >
      <label v-if="typeof condition.value === 'number'" class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.compareValue')"
          :help="t('nextTimeline.skillEditing.fieldHelp.buffStackValue')" /><input
          type="number"
          :value="condition.value"
          @input="setBuffStackScalar"
      /></label>
      <label v-else class="condition-editor__operand"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.compareValue')"
          :help="
            t('nextTimeline.skillEditing.fieldHelp.conditionOperand')
          " /><ActionValueOperandEditor
          :value="condition.value"
          :labels="operandLabels()"
          @update="setBuffStackOperand"
      /></label>
    </template>

    <label
      v-if="condition.kind === 'timedMarkerPresent' || condition.kind === 'globalCooldownPresent'"
      class="condition-editor__field"
      ><EditorFieldLabel
        :label="t('nextTimeline.skillEditing.markerId')"
        :help="t('nextTimeline.skillEditing.fieldHelp.markerId')" /><input
        type="text"
        :value="condition.markerId"
        @input="setText('markerId', $event)"
    /></label>

    <template v-if="condition.kind === 'eventDamageTagsMatch'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.tagQueryType')"
          :help="t('nextTimeline.skillEditing.fieldHelp.eventDamageTags')"
        /><select :value="condition.match" @change="setEventTagMatch">
          <option v-for="type in EVENT_TAG_MATCH_TYPES" :key="type" :value="type">
            {{ t(`nextTimeline.skillEditing.tagQueryTypes.${type}`) }}
          </option>
        </select></label
      >
      <fieldset class="condition-editor__elements">
        <legend>{{ t('nextTimeline.skillEditing.damageTags') }}</legend>
        <label v-for="tag in DAMAGE_TAGS" :key="tag"
          ><input
            type="checkbox"
            :checked="condition.tags.includes(tag)"
            @change="toggleEventDamageTag(tag, $event)"
          />{{ t(`nextTimeline.skillEditing.damageTagNames.${tag}`) }}</label
        >
      </fieldset>
    </template>

    <label v-if="condition.kind === 'eventBuffIdMatch'" class="condition-editor__field">
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.buffIds')"
        :help="t('nextTimeline.skillEditing.fieldHelp.buffIds')"
      />
      <textarea :value="condition.buffIds.join('\n')" @input="setBuffIds" />
    </label>

    <template v-if="condition.kind === 'eventBuffTagsMatch'">
      <label class="condition-editor__field">
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.tagQueryType')"
          :help="t('nextTimeline.skillEditing.fieldHelp.buffTags')"
        />
        <select :value="condition.match" @change="setEventBuffTagMatch">
          <option v-for="type in TAG_QUERY_TYPES" :key="type" :value="type">
            {{ t(`nextTimeline.skillEditing.tagQueryTypes.${type}`) }}
          </option>
        </select>
      </label>
      <label class="condition-editor__field">
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.buffTags')"
          :help="t('nextTimeline.skillEditing.fieldHelp.buffTags')"
        />
        <GameplayTagsEditor :tags="condition.buffTags" @update="setGameplayTags" />
      </label>
    </template>

    <template v-if="condition.kind === 'eventDamageFeaturesMatch'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.tagQueryType')"
          :help="t('nextTimeline.skillEditing.fieldHelp.eventDamageFeatures')"
        /><select :value="condition.match" @change="setEventTagMatch">
          <option v-for="type in EVENT_TAG_MATCH_TYPES" :key="type" :value="type">
            {{ t(`nextTimeline.skillEditing.tagQueryTypes.${type}`) }}
          </option>
        </select></label
      >
      <fieldset class="condition-editor__elements">
        <legend>{{ t('nextTimeline.skillEditing.damageFeatures') }}</legend>
        <label v-for="feature in DAMAGE_FEATURES" :key="feature"
          ><input
            type="checkbox"
            :checked="condition.features.includes(feature)"
            @change="toggleEventDamageFeature(feature, $event)"
          />{{ t(`nextTimeline.skillEditing.damageFeatureNames.${feature}`) }}</label
        >
      </fieldset>
    </template>

    <template v-if="condition.kind === 'eventDamageTypeIn'">
      <fieldset class="condition-editor__elements">
        <legend>{{ t('nextTimeline.skillEditing.damageType') }}</legend>
        <label v-for="damageType in DAMAGE_TYPES" :key="damageType"
          ><input
            type="checkbox"
            :checked="condition.damageTypes.includes(damageType)"
            @change="toggleEventDamageType(damageType, $event)"
          />{{ t(`nextTimeline.skillEditing.damageTypes.${damageType}`) }}</label
        >
      </fieldset>
    </template>

    <template v-if="condition.kind === 'eventInflictionElementIn'">
      <fieldset class="condition-editor__elements">
        <legend>{{ t('nextTimeline.skillEditing.element') }}</legend>
        <label v-for="element in INFLICTION_ELEMENTS" :key="element"
          ><input
            type="checkbox"
            :checked="condition.elements.includes(element)"
            @change="toggleEventInflictionElement(element, $event)"
          />{{ t(`nextTimeline.skillEditing.damageTypes.${element}`) }}</label
        >
      </fieldset>
    </template>

    <template v-if="condition.kind === 'elementalInflictionPresent'">
      <fieldset class="condition-editor__elements">
        <legend>
          <EditorFieldLabel
            :label="t('nextTimeline.skillEditing.element')"
            :help="t('nextTimeline.skillEditing.fieldHelp.conditionElement')"
          />
        </legend>
        <label v-for="element in DAMAGE_ELEMENTS" :key="element"
          ><input
            type="checkbox"
            :checked="
              (Array.isArray(condition.elements)
                ? condition.elements
                : [condition.elements]
              ).includes(element)
            "
            @change="toggleElement(element, $event)"
          />{{ t(`nextTimeline.skillEditing.damageTypes.${element}`) }}</label
        >
      </fieldset>
      <label class="condition-editor__optional"
        ><input
          type="checkbox"
          :checked="condition.minimumStacks !== undefined"
          @change="toggleOptionalInteger('minimumStacks', $event)" /><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.minimumStacks')"
          :help="t('nextTimeline.skillEditing.fieldHelp.minimumStacks')" /><input
          v-if="condition.minimumStacks !== undefined"
          type="number"
          min="0"
          :value="condition.minimumStacks"
          @input="setOptionalInteger('minimumStacks', $event)"
      /></label>
    </template>

    <template v-if="condition.kind === 'elementalReactionActive'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.reaction')"
          :help="t('nextTimeline.skillEditing.fieldHelp.reaction')"
        /><select :value="condition.reaction" @change="setReaction">
          <option v-for="reaction in ELEMENTAL_REACTIONS" :key="reaction" :value="reaction">
            {{ t(`nextTimeline.skillEditing.reactions.${reaction}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__optional"
        ><input
          type="checkbox"
          :checked="condition.minimumLevel !== undefined"
          @change="toggleOptionalInteger('minimumLevel', $event)" /><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.minimumLevel')"
          :help="t('nextTimeline.skillEditing.fieldHelp.minimumLevel')" /><input
          v-if="condition.minimumLevel !== undefined"
          type="number"
          min="0"
          :value="condition.minimumLevel"
          @input="setOptionalInteger('minimumLevel', $event)"
      /></label>
    </template>

    <template v-if="condition.kind === 'deckAttributeCompare'">
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.operandLeft')"
          :help="t('nextTimeline.skillEditing.fieldHelp.operatorAttribute')"
        /><select :value="condition.left" @change="setAttribute('left', $event)">
          <option v-for="attribute in OPERATOR_ATTRIBUTES" :key="attribute" :value="attribute">
            {{ t(`nextTimeline.skillEditing.attributes.${attribute}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.comparisonOperator')"
          :help="t('nextTimeline.skillEditing.fieldHelp.comparisonOperator')"
        /><select :value="condition.operator" @change="setComparison">
          <option v-for="operator in COMPARISON_OPERATORS" :key="operator" :value="operator">
            {{ t(`nextTimeline.skillEditing.comparisonOperators.${operator}`) }}
          </option>
        </select></label
      >
      <label class="condition-editor__field"
        ><EditorFieldLabel
          :label="t('nextTimeline.skillEditing.operandRight')"
          :help="t('nextTimeline.skillEditing.fieldHelp.operatorAttribute')"
        /><select :value="condition.right" @change="setAttribute('right', $event)">
          <option v-for="attribute in OPERATOR_ATTRIBUTES" :key="attribute" :value="attribute">
            {{ t(`nextTimeline.skillEditing.attributes.${attribute}`) }}
          </option>
        </select></label
      >
    </template>

    <div v-if="!layerOnly && condition.kind === 'not'" class="condition-editor__children">
      <RecursiveConditionEditor :condition="condition.condition" @update="updateChild(0, $event)" />
    </div>
    <div
      v-else-if="!layerOnly && (condition.kind === 'all' || condition.kind === 'any')"
      class="condition-editor__children"
    >
      <div
        v-for="(child, index) in condition.conditions"
        :key="index"
        class="condition-editor__child"
      >
        <RecursiveConditionEditor :condition="child" @update="updateChild(index, $event)" /><button
          type="button"
          :disabled="condition.conditions.length <= 1"
          @click="removeChild(index)"
        >
          ×
        </button>
      </div>
      <div class="condition-editor__add">
        <select v-model="newChildKind">
          <option v-for="kind in COMBAT_CONDITION_KINDS" :key="kind" :value="kind">
            {{ conditionKindLabel(kind) }}
          </option></select
        ><button type="button" @click="appendChild">+</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.condition-editor {
  min-width: 0;
  display: grid;
  gap: 9px;
  padding: 10px;
  border: 1px solid var(--ea-border-soft);
}
.condition-editor__field,
.condition-editor__operand {
  display: grid;
  grid-template-columns: minmax(130px, 180px) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.condition-editor__optional {
  display: grid;
  grid-template-columns: 18px minmax(130px, 180px) minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}
.condition-editor input,
.condition-editor select,
.condition-editor textarea,
.condition-editor button {
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
.condition-editor input,
.condition-editor select,
.condition-editor button {
  height: 30px;
}
.condition-editor textarea {
  min-height: 48px;
  padding: 5px;
  resize: vertical;
}
.condition-editor__note {
  margin: 0;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.condition-editor__children {
  display: grid;
  gap: 8px;
  padding-left: 10px;
  border-left: 2px solid var(--ea-border-soft);
}
.condition-editor__child {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 30px;
  gap: 5px;
}
.condition-editor__add {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 30px;
  gap: 5px;
}
.condition-editor__elements {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin: 0;
  padding: 8px;
  border: 1px solid var(--ea-border-soft);
}
.condition-editor__elements label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
