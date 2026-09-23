<script setup lang="ts">
/** 按时间入口浏览技能，并逐层查看原定义中的动作、分支与作用域。 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { EaButton } from '../../../../design-system';
import type { SkillDefinition } from '../../../../core/game-data/operatorDefinition';
import type { SkillStructureNode } from '../skillStructureMindMapModel';

const props = defineProps<{
  skill: SkillDefinition;
  root: SkillStructureNode;
  selectedId: string;
}>();
const emit = defineEmits<{ select: [node: SkillStructureNode] }>();
const { t, te } = useI18n();
const location = ref('skill');
const query = ref('');
// 一次遍历建立导航与摘要，避免巨大的内联步骤树在每行渲染时反复扫描。
const outline = computed(() => {
  const nodes = new Map<string, SkillStructureNode>();
  const parents = new Map<string, string>();
  const counts = new Map<string, number>();
  const previews = new Map<string, string[]>();
  const searchTexts = new Map<string, string>();
  function visit(node: SkillStructureNode, parent?: SkillStructureNode): void {
    nodes.set(node.id, node);
    if (parent) parents.set(node.id, parent.id);
    searchTexts.set(
      node.id,
      [
        label(node),
        node.summary,
        node.sourcePath,
        node.reference?.id,
        ...Object.values(node.details).filter(
          value => typeof value === 'string' || typeof value === 'number',
        ),
      ]
        .join(' ')
        .toLowerCase(),
    );
    for (const child of node.children) visit(child, node);
    counts.set(
      node.id,
      (node.payloadKind === 'combatStep' ? 1 : 0) +
        node.children.reduce((sum, child) => sum + (counts.get(child.id) ?? 0), 0),
    );
    const preview: string[] = [];
    if (node.payloadKind === 'combatStep') preview.push(label(node));
    else {
      for (const child of node.children) {
        for (const name of previews.get(child.id) ?? []) {
          preview.push(name);
          if (preview.length === 3) break;
        }
        if (preview.length === 3) break;
      }
    }
    previews.set(node.id, preview);
  }
  visit(props.root);
  return { nodes, parents, counts, previews, searchTexts };
});
const current = computed(() => outline.value.nodes.get(location.value) ?? props.root);
const visibleChildren = computed(() =>
  current.value.id === props.root.id
    ? current.value.children.filter(node => node.payloadKind !== 'scheduledSequence')
    : current.value.children,
);
const crumbs = computed(() => {
  const path: SkillStructureNode[] = [];
  let id: string | undefined = current.value.id;
  while (id) {
    const node = outline.value.nodes.get(id);
    if (node) path.unshift(node);
    id = outline.value.parents.get(id);
  }
  return path;
});
const entries = computed(() =>
  props.root.children
    .filter(node => node.payloadKind === 'scheduledSequence')
    .map((node, index) => ({ node, sequence: props.skill.scheduledSequences[index]!, index }))
    .sort((a, b) => a.sequence.startFrame - b.sequence.startFrame || a.index - b.index),
);
const extent = computed(() =>
  Math.max(1, ...props.skill.scheduledSequences.map(s => s.endFrame ?? s.startFrame)),
);
const matches = computed(() => {
  const needle = query.value.trim().toLowerCase();
  if (!needle) return [];
  return [...outline.value.nodes.values()]
    .filter(node => outline.value.searchTexts.get(node.id)?.includes(needle))
    .slice(0, 60);
});
function label(node: SkillStructureNode): string {
  if (node.id === 'skill') return '技能总览';
  const kind = node.details.步骤类型;
  if (typeof kind === 'string') {
    const key = `timeline.skillEditing.stepKinds.${kind}`;
    return te(key) ? t(key) : kind;
  }
  if (node.label === 'TRUE / Then') return '条件成立';
  if (node.label === 'FALSE / Else') return '条件不成立';
  if (node.label === 'Body') return '内部流程';
  return node.label;
}
function summary(node: SkillStructureNode): string {
  if (node.payloadKind === 'scheduledSequence') {
    const preview = outline.value.previews.get(node.id) ?? [];
    return preview.length ? preview.join(' → ') : '空序列';
  }
  return node.summary;
}
function enter(node: SkillStructureNode) {
  location.value = node.id;
  emit('select', node);
}
function reveal(node: SkillStructureNode) {
  query.value = '';
  location.value = outline.value.parents.get(node.id) ?? node.id;
  emit('select', node);
}
watch(
  () => props.skill.key,
  () => {
    location.value = 'skill';
    query.value = '';
  },
);
</script>

<template>
  <section class="flow-overview">
    <header class="flow-toolbar">
      <strong>时间与流程</strong>
      <span>{{ entries.length }} 个时间入口 · {{ outline.counts.get(root.id) }} 个动作</span>
      <input v-model="query" aria-label="搜索动作或变量" placeholder="搜索动作、变量或 ID" />
    </header>
    <div v-if="query.trim()" class="flow-search">
      <p v-if="matches.length === 0">没有找到匹配项</p>
      <button v-for="node in matches" :key="node.id" @click="reveal(node)">
        {{ label(node) }} <small>{{ node.sourcePath }}</small>
      </button>
    </div>
    <div class="flow-time">
      <div class="flow-ruler">
        <span>技能本地帧 · 同帧保持定义顺序</span><span>0 — {{ extent }} f</span>
      </div>
      <button
        v-for="entry in entries"
        :key="entry.node.id"
        class="flow-time-row"
        :class="{ active: crumbs.some(c => c.id === entry.node.id) }"
        @click="enter(entry.node)"
      >
        <span class="flow-time-name"
          ><b>{{ entry.sequence.startFrame }}f</b> <em>入口 {{ entry.index + 1 }}</em>
          {{ summary(entry.node) }}</span
        >
        <span class="flow-time-track"
          ><span
            class="flow-time-bar"
            :style="{
              left: `${(entry.sequence.startFrame / extent) * 100}%`,
              width: `${Math.max(0.7, (((entry.sequence.endFrame ?? entry.sequence.startFrame) - entry.sequence.startFrame) / extent) * 100)}%`,
            }"
        /></span>
        <small>{{ outline.counts.get(entry.node.id) }} 动作</small>
      </button>
    </div>
    <nav class="flow-breadcrumb" aria-label="当前流程路径">
      <template v-for="(node, i) in crumbs" :key="node.id">
        <span v-if="i">›</span><button @click="enter(node)">{{ label(node) }}</button>
      </template>
    </nav>
    <div class="flow-body">
      <p class="flow-hint">
        {{
          current.kind === '动作序列' || current.payloadKind === 'scheduledSequence'
            ? '按顺序执行；进入节点查看内部流程，单击节点编辑属性。'
            : '选择入口或分支；折叠分组不改变变量作用域和执行规则。'
        }}
      </p>
      <div class="flow-cards">
        <template v-for="(node, i) in visibleChildren" :key="node.id">
          <span
            v-if="i && (current.kind === '动作序列' || current.payloadKind === 'scheduledSequence')"
            class="flow-arrow"
            >↓</span
          >
          <article
            :class="[
              'flow-card',
              {
                selected: selectedId === node.id,
                scope: node.details.步骤类型 === 'withActionBlackboardScope',
              },
            ]"
          >
            <button class="flow-card-select" @click="emit('select', node)">
              <span class="flow-card-heading"
                ><strong>{{ label(node) }}</strong
                ><small>{{ node.kind }}</small></span
              >
              <span class="flow-card-summary">{{ summary(node) }}</span>
            </button>
            <footer v-if="node.children.length">
              <span
                >{{ outline.counts.get(node.id) }} 个动作 ·
                {{ node.children.length }} 个直接子项</span
              >
              <EaButton size="sm" @click="enter(node)">进入 →</EaButton>
            </footer>
          </article>
        </template>
        <p v-if="!visibleChildren.length" class="flow-hint">
          当前节点没有子流程，可在右侧编辑属性。
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.flow-overview {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--ea-workbench-panel, #202124);
  color: var(--ea-fg);
}
.flow-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ea-border);
}
.flow-toolbar span,
small,
.flow-hint {
  color: var(--ea-fg-muted);
  font-size: 12px;
}
.flow-toolbar input {
  margin-left: auto;
  min-width: 160px;
  padding: 6px 8px;
  background: var(--ea-fill-input);
  border: 1px solid var(--ea-border);
  color: inherit;
}
.flow-time {
  flex: 0 1 38%;
  min-height: 120px;
  overflow: auto;
  padding: 8px 16px;
  border-bottom: 1px solid var(--ea-border);
}
.flow-ruler {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--ea-fg-muted);
  margin-bottom: 10px;
}
.flow-time-row {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(160px, 45%) 1fr 65px;
  align-items: center;
  gap: 14px;
  border: 0;
  padding: 6px;
  text-align: left;
  color: inherit;
  background: transparent;
  cursor: pointer;
}
.flow-time-row:hover,
.flow-time-row.active {
  background: var(--ea-active-fill);
}
.flow-time-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
}
.flow-time-name b {
  color: var(--ea-gold);
  display: inline-block;
  min-width: 34px;
}
.flow-time-track {
  height: 14px;
  position: relative;
  background: var(--ea-fill-soft, #303238);
}
.flow-time-bar {
  position: absolute;
  height: 100%;
  min-width: 3px;
  max-width: 100%;
  background: #738daa;
  border-radius: 2px;
}
.flow-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--ea-border);
}
.flow-breadcrumb button {
  border: 0;
  background: transparent;
  color: var(--ea-gold);
  cursor: pointer;
  font-size: 12px;
}
.flow-body {
  overflow: auto;
  flex: 1;
  min-height: 0;
  padding: 4px 20px 24px;
}
.flow-cards {
  max-width: 760px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.flow-card {
  border: 1px solid var(--ea-border);
  border-left: 3px solid #738daa;
  background: var(--ea-fill-soft, #292b30);
  border-radius: 4px;
}
.flow-card.scope {
  border-left-color: #bb94d8;
}
.flow-card.selected {
  outline: 1px solid var(--ea-gold);
}
.flow-card-select {
  display: block;
  width: 100%;
  padding: 12px;
  border: 0;
  background: transparent;
  text-align: left;
  color: inherit;
  cursor: pointer;
}
.flow-card-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.flow-card-summary {
  display: block;
  font-size: 12px;
  color: var(--ea-fg-muted);
  margin-top: 8px;
  overflow-wrap: anywhere;
}
.flow-card footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  border-top: 1px solid var(--ea-border);
  font-size: 11px;
  color: var(--ea-fg-muted);
}
.flow-arrow {
  text-align: center;
  color: #738daa;
}
.flow-search {
  max-height: 180px;
  overflow: auto;
  padding: 8px;
}
.flow-search button {
  display: block;
  text-align: left;
  width: 100%;
  padding: 6px;
  background: transparent;
  color: inherit;
  border: 0;
  cursor: pointer;
}
.flow-search small {
  display: block;
  overflow-wrap: anywhere;
}
</style>
