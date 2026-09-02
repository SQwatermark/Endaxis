<script setup lang="ts">
import { ref } from 'vue';
import type {
  CombatBuffChildPresentation,
  CombatBuffPresentation,
} from '../../../../../packages/game-data-contract/src/buffs';
import CombatBuffPresentationEditor from './CombatBuffPresentationEditor.vue';

const props = defineProps<{ children: readonly CombatBuffChildPresentation[] }>();
const emit = defineEmits<{ update: [children: readonly CombatBuffChildPresentation[]] }>();
const collapsed = ref(true);

function replace(index: number, child: CombatBuffChildPresentation): void {
  emit(
    'update',
    props.children.map((item, itemIndex) => (itemIndex === index ? child : item)),
  );
}

function add(): void {
  let index = 1;
  const ids = new Set(props.children.map(child => child.buffId));
  while (ids.has(`child-buff-${index}`)) index += 1;
  emit('update', [
    ...props.children,
    { buffId: `child-buff-${index}`, presentation: { visible: true } },
  ]);
}

function remove(index: number): void {
  emit(
    'update',
    props.children.filter((_, itemIndex) => itemIndex !== index),
  );
}

function move(index: number, offset: -1 | 1): void {
  const target = index + offset;
  if (target < 0 || target >= props.children.length) return;
  const next = [...props.children];
  [next[index], next[target]] = [next[target]!, next[index]!];
  emit('update', next);
}

function setBuffId(index: number, child: CombatBuffChildPresentation, event: Event): void {
  const buffId = (event.target as HTMLInputElement).value.trim();
  if (
    buffId === '' ||
    props.children.some((item, itemIndex) => itemIndex !== index && item.buffId === buffId)
  )
    return;
  replace(index, { ...child, buffId });
}

function setPresentation(
  index: number,
  child: CombatBuffChildPresentation,
  presentation: CombatBuffPresentation | undefined,
): void {
  replace(index, { ...child, presentation: presentation ?? {} });
}
</script>

<template>
  <section class="child-presentations">
    <header>
      <button type="button" @click="collapsed = !collapsed">
        {{ collapsed ? '▸' : '▾' }} 子 Buff 展示身份 <span>{{ children.length }}</span>
      </button>
      <button type="button" title="添加子 Buff 展示身份" @click="add">＋</button>
    </header>
    <p v-if="!collapsed">每一项只覆盖指定子 Buff 的原生展示身份，不改变其战斗定义。</p>
    <article
      v-for="(child, index) in children"
      v-show="!collapsed"
      :key="`${child.buffId}:${index}`"
    >
      <header>
        <label
          ><span>子 Buff ID</span
          ><input type="text" :value="child.buffId" @change="setBuffId(index, child, $event)"
        /></label>
        <button type="button" :disabled="index === 0" @click="move(index, -1)">↑</button>
        <button type="button" :disabled="index === children.length - 1" @click="move(index, 1)">
          ↓
        </button>
        <button type="button" @click="remove(index)">×</button>
      </header>
      <CombatBuffPresentationEditor
        :title="`子展示：${child.buffId}`"
        :presentation="child.presentation"
        :initially-collapsed="false"
        @update="setPresentation(index, child, $event)"
      />
    </article>
  </section>
</template>

<style scoped>
.child-presentations {
  margin-top: 12px;
  border-top: 1px solid var(--ea-border-soft);
  padding-top: 10px;
}
.child-presentations > header,
.child-presentations article > header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) repeat(3, 30px);
  gap: 5px;
}
.child-presentations > header {
  grid-template-columns: minmax(0, 1fr) 30px;
}
.child-presentations > header button:first-child {
  text-align: left;
}
.child-presentations button,
.child-presentations input {
  min-width: 0;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
.child-presentations > p {
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.child-presentations article {
  margin-top: 8px;
  padding: 10px;
  border: 1px solid var(--ea-border-soft);
}
.child-presentations article > header label {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}
</style>
