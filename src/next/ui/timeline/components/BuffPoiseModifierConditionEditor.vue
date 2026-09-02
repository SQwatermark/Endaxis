<script setup lang="ts">
import type { PoiseModifierCondition } from '../../../../../packages/game-data-contract/src/modifiers';
import type { DamageTag } from '../../../../../packages/game-data-contract/src/primitives';
import GameplayTagsEditor from './GameplayTagsEditor.vue';

const props = defineProps<{ condition: PoiseModifierCondition }>();
const emit = defineEmits<{ update: [condition: PoiseModifierCondition] }>();
const CONDITION_KINDS = [
  'casterControlled',
  'eventDamageTagsMatch',
  'all',
] as const satisfies readonly PoiseModifierCondition['kind'][];

function createCondition(kind: PoiseModifierCondition['kind']): PoiseModifierCondition {
  if (kind === 'casterControlled') return { kind };
  if (kind === 'eventDamageTagsMatch') return { kind, match: 'hasAny', tags: [] };
  return { kind, conditions: [{ kind: 'casterControlled' }] };
}
function setKind(event: Event): void {
  const kind = (event.target as HTMLSelectElement).value as PoiseModifierCondition['kind'];
  if (CONDITION_KINDS.includes(kind)) emit('update', createCondition(kind));
}
function setChild(index: number, child: PoiseModifierCondition): void {
  if (props.condition.kind !== 'all') return;
  emit('update', {
    ...props.condition,
    conditions: props.condition.conditions.map((item, itemIndex) =>
      itemIndex === index ? child : item,
    ),
  });
}
function addChild(): void {
  if (props.condition.kind !== 'all') return;
  emit('update', {
    ...props.condition,
    conditions: [...props.condition.conditions, { kind: 'casterControlled' }],
  });
}
function removeChild(index: number): void {
  if (props.condition.kind !== 'all' || props.condition.conditions.length <= 1) return;
  emit('update', {
    ...props.condition,
    conditions: props.condition.conditions.filter((_, itemIndex) => itemIndex !== index),
  });
}
function setDamageTags(tags: readonly string[]): void {
  if (props.condition.kind !== 'eventDamageTagsMatch') return;
  emit('update', { ...props.condition, tags: tags as readonly DamageTag[] });
}
</script>

<template>
  <fieldset class="poise-condition">
    <label
      ><span>条件类型</span
      ><select :value="condition.kind" @change="setKind">
        <option v-for="kind in CONDITION_KINDS" :key="kind" :value="kind">{{ kind }}</option>
      </select></label
    >
    <template v-if="condition.kind === 'eventDamageTagsMatch'">
      <label
        ><span>匹配方式</span
        ><select
          :value="condition.match"
          @change="
            emit('update', {
              ...condition,
              match: ($event.target as HTMLSelectElement).value as 'hasAny' | 'hasAll',
            })
          "
        >
          <option value="hasAny">hasAny</option>
          <option value="hasAll">hasAll</option>
        </select></label
      >
      <GameplayTagsEditor :tags="condition.tags" :minimum="0" @update="setDamageTags" />
    </template>
    <template v-else-if="condition.kind === 'all'">
      <article v-for="(child, index) in condition.conditions" :key="index">
        <BuffPoiseModifierConditionEditor :condition="child" @update="setChild(index, $event)" />
        <button
          type="button"
          :disabled="condition.conditions.length <= 1"
          @click="removeChild(index)"
        >
          删除子条件
        </button>
      </article>
      <button type="button" @click="addChild">＋ 添加子条件</button>
    </template>
  </fieldset>
</template>

<style scoped>
.poise-condition {
  display: grid;
  gap: 8px;
}
.poise-condition > label {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}
.poise-condition article {
  display: grid;
  gap: 6px;
  padding-left: 10px;
  border-left: 2px solid var(--ea-border-soft);
}
.poise-condition button,
.poise-condition select {
  min-width: 0;
  min-height: 30px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
</style>
