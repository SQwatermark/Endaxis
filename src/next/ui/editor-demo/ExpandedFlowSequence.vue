<script setup lang="ts">
interface FlowReference {
  readonly kind: 'buff' | 'entity';
  readonly id: string;
}

interface FlowNode {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
  readonly summary: string;
  readonly sourcePath: string;
  readonly details: Readonly<Record<string, unknown>>;
  readonly children: readonly FlowNode[];
  readonly reference?: FlowReference;
}

withDefaults(
  defineProps<{
    sequence: FlowNode;
    selectedId?: string;
    depth?: number;
  }>(),
  { selectedId: '', depth: 0 },
);

const emit = defineEmits<{
  select: [node: FlowNode];
  reference: [reference: FlowReference];
}>();

function isConditional(node: FlowNode): boolean {
  return node.details['步骤类型'] === 'conditional';
}

function isContainer(node: FlowNode): boolean {
  return node.children.length > 0 && !isConditional(node);
}

function actionLabel(node: FlowNode): string {
  return node.label.replace(/^\d+\.\s*/, '');
}
</script>

<template>
  <div class="expanded-sequence" :style="{ '--flow-depth': depth }">
    <template v-for="(node, index) in sequence.children" :key="node.id">
      <div v-if="index > 0" class="connector"><span></span></div>

      <article
        v-if="isConditional(node)"
        class="control condition"
        :class="{ selected: selectedId === node.id }"
      >
        <button class="condition-head" @click="emit('select', node)">
          <span class="condition-symbol">IF</span>
          <span>
            <strong>{{ node.details['条件表达式'] }}</strong>
            <small>条件判定</small>
          </span>
        </button>
        <div class="fork" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="branches">
          <section
            v-for="(branch, branchIndex) in node.children"
            :key="branch.id"
            class="branch"
            :class="branchIndex === 0 ? 'true-branch' : 'false-branch'"
          >
            <button class="branch-head" @click="emit('select', branch)">
              <b>{{ branch.label }}</b
              ><span>{{ branch.children.length }} 个步骤</span>
            </button>
            <ExpandedFlowSequence
              :sequence="branch"
              :selected-id="selectedId"
              :depth="depth + 1"
              @select="emit('select', $event)"
              @reference="emit('reference', $event)"
            />
          </section>
          <section v-if="node.children.length === 1" class="branch false-branch passthrough">
            <div class="branch-head"><b>FALSE / Else</b><span>无额外动作</span></div>
            <div class="pass"><span></span><b>继续主流程</b><span></span></div>
          </section>
        </div>
      </article>

      <article
        v-else-if="isContainer(node)"
        class="control container"
        :class="{ selected: selectedId === node.id }"
      >
        <button class="container-head" @click="emit('select', node)">
          <span class="container-symbol">↻</span>
          <span
            ><strong>{{ node.details['步骤类型'] }}</strong
            ><small>{{ node.summary }}</small></span
          >
        </button>
        <section v-for="body in node.children" :key="body.id" class="body-frame">
          <button class="body-head" @click="emit('select', body)">
            <b>{{ body.label }}</b
            ><span>{{ body.children.length }} 个步骤</span>
          </button>
          <ExpandedFlowSequence
            :sequence="body"
            :selected-id="selectedId"
            :depth="depth + 1"
            @select="emit('select', $event)"
            @reference="emit('reference', $event)"
          />
        </section>
      </article>

      <button
        v-else
        class="action"
        :class="{ selected: selectedId === node.id, reference: node.reference }"
        @click="emit('select', node)"
      >
        <span class="index">{{ index + 1 }}</span>
        <span class="copy"
          ><strong>{{ actionLabel(node) }}</strong
          ><small>{{ node.summary }}</small></span
        >
        <span
          v-if="node.reference"
          class="reference-port"
          @click.stop="emit('reference', node.reference)"
          >引用 ↗</span
        >
      </button>
    </template>
    <div v-if="sequence.children.length === 0" class="empty">空序列</div>
  </div>
</template>

<style scoped>
.expanded-sequence {
  min-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.connector {
  height: 20px;
  display: grid;
  place-items: center;
}
.connector span {
  width: 2px;
  height: 100%;
  position: relative;
  background: #686d76;
}
.connector span::after {
  position: absolute;
  bottom: -1px;
  left: -4px;
  border-top: 6px solid #686d76;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  content: '';
}
.action {
  min-height: 48px;
  display: grid;
  grid-template-columns: 32px minmax(120px, 1fr) auto;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border: 1px solid #41454d;
  border-left: 4px solid #737984;
  background: #1c1e22;
  color: #e8e8e8;
  text-align: left;
}
.action:hover,
.action.selected,
.control.selected > .condition-head,
.control.selected > .container-head {
  border-color: #e2cb2e;
  box-shadow: 0 0 0 1px rgba(226, 203, 46, 0.18);
}
.index {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #30333a;
  font: 700 10px monospace;
}
.copy {
  min-width: 0;
  display: grid;
  gap: 3px;
}
.copy strong,
.copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.copy small,
.condition-head small,
.container-head small {
  color: #858a92;
  font-size: 10px;
}
.reference-port {
  padding: 5px 7px;
  border: 1px solid #536b87;
  color: #8ebce8;
  background: #1a2530;
  font-size: 9px;
}
.control {
  min-width: 0;
  padding: 10px;
  border: 1px solid #494d55;
  background: #17191d;
}
.control.condition {
  padding: 0;
  border: 0;
  background: transparent;
}
.condition-head,
.container-head {
  color: inherit;
  text-align: left;
}
.condition-head {
  width: min(88%, 620px);
  min-height: 52px;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  padding: 7px 13px;
  border: 1px solid #777038;
  background: #27251c;
  clip-path: polygon(4% 0, 96% 0, 100% 50%, 96% 100%, 4% 100%, 0 50%);
}
.condition-head > span:last-child,
.container-head > span:last-child {
  min-width: 0;
  display: grid;
  gap: 3px;
}
.condition-head strong,
.condition-head small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.condition-symbol {
  color: #f0dc4e;
  font: 800 18px monospace;
  text-align: center;
}
.fork {
  height: 26px;
  position: relative;
  margin: 0 18%;
}
.fork i {
  position: absolute;
  display: block;
  background: #646a74;
}
.fork i:first-child {
  width: 2px;
  height: 13px;
  left: calc(50% - 1px);
}
.fork i:nth-child(2) {
  height: 2px;
  top: 12px;
  right: 0;
  left: 0;
}
.fork i:last-child {
  height: 13px;
  top: 12px;
  right: 0;
  left: 0;
  border-right: 2px solid #646a74;
  border-left: 2px solid #646a74;
  background: transparent;
}
.branches {
  min-width: 580px;
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  gap: 10px;
}
.branch,
.body-frame {
  min-width: 0;
  padding: 0 8px 8px;
  border: 1px solid #3d4148;
  background: #141619;
}
.true-branch {
  border-top: 3px solid #62b87a;
}
.false-branch {
  border-top: 3px solid #c46f66;
}
.branch-head,
.body-head {
  width: calc(100% + 16px);
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 0 -8px 8px;
  padding: 7px 9px;
  border: 0;
  border-bottom: 1px solid #32353b;
  background: #202228;
  color: inherit;
  text-align: left;
}
.branch-head span,
.body-head span {
  color: #858a92;
  font-size: 9px;
}
.passthrough {
  opacity: 0.72;
}
.pass {
  min-height: 42px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 7px;
  color: #858a92;
  font-size: 9px;
}
.pass span {
  height: 1px;
  background: #565b64;
}
.container {
  border: 2px solid #62789a;
  border-radius: 4px;
}
.container-head {
  width: calc(100% + 20px);
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  margin: -10px -10px 10px;
  padding: 7px 10px;
  border: 0;
  border-bottom: 1px solid #62789a;
  background: #1d2836;
}
.container-symbol {
  color: #8bb7e8;
  font-size: 20px;
  text-align: center;
}
.body-frame {
  border-style: dashed;
  border-color: #607594;
  background: #18202a;
}
.empty {
  min-height: 42px;
  display: grid;
  place-items: center;
  color: #70757d;
  font-size: 10px;
}
</style>
