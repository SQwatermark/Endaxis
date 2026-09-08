<script setup lang="ts">
import { computed } from 'vue';
import type {
  CombatBuffPresentation,
  CombatBuffChildPresentation,
} from '../../../../packages/game-data-contract/src/buffs';
import type { DefinitionProperty } from '../definitionEditContext';
import type { SkillStructureNode } from '../skillStructureMindMapModel';
import CombatBuffPresentationEditor from './CombatBuffPresentationEditor.vue';
const props = defineProps<{ node: SkillStructureNode; property: DefinitionProperty }>();
const presentation = computed(() => props.property.read() as CombatBuffPresentation);
const child = computed(() => props.property.read() as CombatBuffChildPresentation);
const order = computed(
  () => props.property.read() as NonNullable<CombatBuffPresentation['orderPriority']>,
);
</script>
<template>
  <CombatBuffPresentationEditor
    v-if="node.payloadKind === 'buffPresentation'"
    :presentation="presentation"
    layer-only
    @update="property.update(() => $event ?? {})"
  />
  <div v-else-if="node.payloadKind === 'buffChildPresentation'" class="fields">
    <p>仅覆盖指定子 Buff 的表现，不改变它的战斗定义。表现字段从图中进入。</p>
    <label
      ><span>子 Buff ID</span
      ><input
        :value="child.buffId"
        @change="property.child('buffId').update(() => ($event.target as HTMLInputElement).value)"
    /></label>
  </div>
  <div v-else class="fields">
    <label class="check"
      ><input
        type="checkbox"
        :checked="order.useDirectoryValue"
        @change="
          property
            .child('useDirectoryValue')
            .update(() => ($event.target as HTMLInputElement).checked)
        "
      /><span>使用目录值</span></label
    >
    <label
      ><span>排序值</span
      ><input
        type="number"
        :value="order.value"
        @change="
          property.child('value').update(() => Number(($event.target as HTMLInputElement).value))
        "
    /></label>
    <label
      ><span>分类</span
      ><input
        :value="order.category"
        @change="
          property.child('category').update(() => ($event.target as HTMLInputElement).value)
        "
    /></label>
  </div>
</template>
<style scoped>
.fields,
label {
  display: grid;
  min-width: 0;
  gap: 5px;
}
.fields {
  gap: 12px;
}
p,
label span {
  color: var(--ea-fg-muted);
}
input {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: 30px;
  color: var(--ea-fg);
  background: var(--ea-fill-input);
  border: 1px solid var(--ea-border);
}
.check {
  display: flex;
  align-items: center;
}
.check input {
  width: 15px;
  height: 15px;
}
</style>
