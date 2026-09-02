<script setup lang="ts">
/** Reusable free-roaming structure map used by the formal skill editor and its demo. */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface MapReference {
  readonly kind: 'buff' | 'entity';
  readonly id: string;
}

interface MapNodeSource {
  readonly id: string;
  readonly label: string;
  readonly kind: string;
  readonly summary: string;
  readonly sourcePath: string;
  readonly details: Readonly<Record<string, unknown>>;
  readonly children: readonly MapNodeSource[];
  readonly editorSection?: 'overview' | 'blackboard' | 'availability' | number;
  readonly reference?: MapReference;
  readonly canAddChild?:
    | 'sequence'
    | 'step'
    | 'lifecycle'
    | 'childSkill'
    | 'equipmentModifier'
    | 'equipmentHandler'
    | 'combatCondition'
    | 'eventResponse'
    | 'skillEventHandler'
    | 'buffAbilityResponse'
    | 'buffIgniteResponse'
    | 'globalBuffChild';
  readonly payloadKind?:
    | 'scheduledSequence'
    | 'combatStep'
    | 'childSkill'
    | 'equipmentModifier'
    | 'equipmentHandler'
    | 'combatCondition'
    | 'eventResponse'
    | 'skillEventHandler'
    | 'buffAbilityResponse'
    | 'buffIgniteResponse'
    | 'globalBuffDefinition'
    | 'globalBuffChild';
  readonly acceptsChildKind?:
    | 'scheduledSequence'
    | 'combatStep'
    | 'childSkill'
    | 'equipmentModifier'
    | 'equipmentHandler'
    | 'combatCondition'
    | 'eventResponse'
    | 'skillEventHandler'
    | 'buffAbilityResponse'
    | 'buffIgniteResponse'
    | 'globalBuffChild';
  readonly canDelete?: boolean;
  readonly canMove?: boolean;
  readonly canCopy?: boolean;
  readonly relationToParent?: 'port' | 'member';
}

interface PositionedNode {
  readonly source: MapNodeSource;
  readonly x: number;
  readonly y: number;
  readonly depth: number;
}

interface MapEdge {
  readonly id: string;
  readonly from: PositionedNode;
  readonly to: PositionedNode;
  readonly tone: 'normal' | 'true' | 'false' | 'body' | 'port';
}

const props = withDefaults(
  defineProps<{
    root: MapNodeSource;
    selectedId?: string;
    showReferencePins?: boolean;
    clipboardKind?: MapNodeSource['payloadKind'];
    canUndo?: boolean;
    canRedo?: boolean;
  }>(),
  { selectedId: '', showReferencePins: true },
);

const emit = defineEmits<{
  select: [node: MapNodeSource];
  reference: [reference: MapReference];
  addChild: [node: MapNodeSource, anchor: { readonly x: number; readonly y: number }];
  moveNode: [
    operation: {
      readonly source: MapNodeSource;
      readonly target: MapNodeSource;
      readonly placement: 'inside' | 'before' | 'after';
    },
  ];
  nodeAction: [action: 'delete' | 'copy' | 'paste', node: MapNodeSource];
  historyAction: [action: 'undo' | 'redo'];
}>();

const zoom = ref(0.9);
const viewport = ref<HTMLElement | null>(null);
const collapsedIds = ref<ReadonlySet<string>>(new Set());
const dragging = ref(false);
const shell = ref<HTMLElement | null>(null);
const active = ref(false);
const draggedNode = ref<MapNodeSource | null>(null);
const dropHint = ref<{ readonly id: string; readonly placement: 'inside' | 'before' | 'after' }>();
const contextMenu = ref<{ readonly node: MapNodeSource; readonly x: number; readonly y: number }>();
const dragOrigin = ref({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0, pointerId: -1 });
const NODE_WIDTH = 220;
const NODE_HEIGHT = 52;
const X_STEP = 270;
const Y_STEP = 68;
const CANVAS_MARGIN = 320;

const layout = computed(() => {
  const nodes: PositionedNode[] = [];
  const edges: MapEdge[] = [];
  let leafCursor = 0;
  let maxDepth = 0;

  function visit(source: MapNodeSource, depth: number): PositionedNode {
    maxDepth = Math.max(maxDepth, depth);
    const positioned = {
      source,
      x: CANVAS_MARGIN + depth * X_STEP,
      y: CANVAS_MARGIN + leafCursor++ * Y_STEP,
      depth,
    };
    nodes.push(positioned);
    const visibleChildren = collapsedIds.value.has(source.id) ? [] : source.children;
    for (const childSource of visibleChildren) {
      const child = visit(childSource, depth + 1);
      edges.push({
        id: `${source.id}->${child.source.id}`,
        from: positioned,
        to: child,
        tone: edgeTone(child.source),
      });
    }
    return positioned;
  }

  visit(props.root, 0);
  nodes.sort((left, right) => left.y - right.y);
  return {
    nodes,
    edges,
    width: CANVAS_MARGIN * 2 + (maxDepth + 1) * X_STEP,
    height: Math.max(640, CANVAS_MARGIN * 2 + Math.max(1, leafCursor) * Y_STEP),
  };
});

const totalNodeCount = computed(() => {
  let count = 0;
  function visit(node: MapNodeSource): void {
    count += 1;
    node.children.forEach(visit);
  }
  visit(props.root);
  return count;
});
const selectedNode = computed(() =>
  props.selectedId === undefined ? undefined : findNode(props.root, props.selectedId),
);
const clipboardLabel = computed(() => {
  if (props.clipboardKind === 'combatStep') return '战斗步骤';
  if (props.clipboardKind === 'scheduledSequence') return '调度序列';
  if (props.clipboardKind === 'childSkill') return '实体子技能';
  if (props.clipboardKind === 'equipmentModifier') return '属性修正';
  if (props.clipboardKind === 'equipmentHandler') return '事件响应';
  if (props.clipboardKind === 'combatCondition') return '战斗条件';
  if (props.clipboardKind === 'eventResponse') return '事件响应';
  if (props.clipboardKind === 'skillEventHandler') return '技能事件响应';
  if (props.clipboardKind === 'buffAbilityResponse') return 'Buff Ability 事件响应';
  if (props.clipboardKind === 'buffIgniteResponse') return 'Buff 点燃响应';
  if (props.clipboardKind === 'globalBuffChild') return 'GlobalBuff 子 Buff';
  return '';
});

function edgeTone(node: MapNodeSource): MapEdge['tone'] {
  if (node.label.startsWith('TRUE')) return 'true';
  if (node.label.startsWith('FALSE')) return 'false';
  if (node.label === 'Body') return 'body';
  if (node.relationToParent === 'port') return 'port';
  return 'normal';
}

function edgePath(edge: MapEdge): string {
  const startX = edge.from.x + NODE_WIDTH;
  const startY = edge.from.y + NODE_HEIGHT / 2;
  const endX = edge.to.x;
  const endY = edge.to.y + NODE_HEIGHT / 2;
  const middle = (startX + endX) / 2;
  return `M ${startX} ${startY} C ${middle} ${startY}, ${middle} ${endY}, ${endX} ${endY}`;
}

function nodeClass(node: MapNodeSource): Readonly<Record<string, boolean>> {
  return {
    root: node.id === props.root.id,
    sequence: node.kind === '动作序列',
    conditional: node.details['步骤类型'] === 'conditional',
    branch: node.label.startsWith('TRUE') || node.label.startsWith('FALSE'),
    true: node.label.startsWith('TRUE'),
    false: node.label.startsWith('FALSE'),
    container:
      node.children.length > 0 &&
      node.details['步骤类型'] !== 'conditional' &&
      node.kind !== '动作序列',
    reference: node.reference !== undefined,
    port: node.relationToParent === 'port',
    collapsed: collapsedIds.value.has(node.id),
    selected: node.id === props.selectedId,
    'drop-inside': dropHint.value?.id === node.id && dropHint.value.placement === 'inside',
    'drop-before': dropHint.value?.id === node.id && dropHint.value.placement === 'before',
    'drop-after': dropHint.value?.id === node.id && dropHint.value.placement === 'after',
  };
}

function compatiblePlacement(event: DragEvent, target: MapNodeSource) {
  const source = draggedNode.value;
  if (
    source?.payloadKind === undefined ||
    source.id === target.id ||
    target.sourcePath.startsWith(`${source.sourcePath}.`)
  ) {
    return undefined;
  }
  if (target.acceptsChildKind === source.payloadKind) return 'inside' as const;
  if (target.payloadKind !== source.payloadKind) return undefined;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  return event.clientY < rect.top + rect.height / 2 ? ('before' as const) : ('after' as const);
}

function startNodeDrag(event: DragEvent, node: MapNodeSource): void {
  if (node.payloadKind === undefined || node.canMove === false) return;
  draggedNode.value = node;
  event.dataTransfer?.setData('text/plain', node.id);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}

function dragOverNode(event: DragEvent, node: MapNodeSource): void {
  const placement = compatiblePlacement(event, node);
  if (placement === undefined) return;
  event.preventDefault();
  dropHint.value = { id: node.id, placement };
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
}

function dropOnNode(event: DragEvent, target: MapNodeSource): void {
  const source = draggedNode.value;
  const placement = compatiblePlacement(event, target);
  dropHint.value = undefined;
  draggedNode.value = null;
  if (source === null || placement === undefined) return;
  event.preventDefault();
  emit('moveNode', { source, target, placement });
}

function openContextMenu(event: MouseEvent, node: MapNodeSource): void {
  event.preventDefault();
  active.value = true;
  emit('select', node);
  contextMenu.value = { node, x: event.clientX, y: event.clientY };
}

function runNodeAction(action: 'delete' | 'copy' | 'paste', node: MapNodeSource): void {
  contextMenu.value = undefined;
  emit('nodeAction', action, node);
}

function handleKeyboard(event: KeyboardEvent): void {
  if (
    !active.value ||
    event.target instanceof HTMLInputElement ||
    event.target instanceof HTMLTextAreaElement
  ) {
    return;
  }
  const node = props.selectedId === undefined ? undefined : findNode(props.root, props.selectedId);
  if (node === undefined) return;
  const command = event.ctrlKey || event.metaKey;
  const key = event.key.toLocaleLowerCase();
  if (command && !event.altKey && key === 'z') {
    event.preventDefault();
    event.stopImmediatePropagation();
    emit('historyAction', event.shiftKey ? 'redo' : 'undo');
  } else if (command && !event.altKey && key === 'y') {
    event.preventDefault();
    event.stopImmediatePropagation();
    emit('historyAction', 'redo');
  } else if (
    (event.key === 'Delete' || event.key === 'Backspace') &&
    node.payloadKind !== undefined &&
    node.canDelete !== false
  ) {
    event.preventDefault();
    event.stopImmediatePropagation();
    emit('nodeAction', 'delete', node);
  } else if (command && key === 'c' && node.payloadKind !== undefined && node.canCopy !== false) {
    event.preventDefault();
    event.stopImmediatePropagation();
    emit('nodeAction', 'copy', node);
  } else if (
    command &&
    key === 'v' &&
    props.clipboardKind !== undefined &&
    node.acceptsChildKind === props.clipboardKind
  ) {
    event.preventDefault();
    event.stopImmediatePropagation();
    emit('nodeAction', 'paste', node);
  }
}

function findNode(node: MapNodeSource, id: string): MapNodeSource | undefined {
  if (node.id === id) return node;
  for (const child of node.children) {
    const match = findNode(child, id);
    if (match !== undefined) return match;
  }
  return undefined;
}

function trackActive(event: PointerEvent): void {
  active.value = shell.value?.contains(event.target as Node) ?? false;
  if (!contextMenu.value || !(event.target as HTMLElement).closest('.map-context-menu')) {
    contextMenu.value = undefined;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboard);
  document.addEventListener('pointerdown', trackActive);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboard);
  document.removeEventListener('pointerdown', trackActive);
});

function title(node: MapNodeSource): string {
  if (node.details['步骤类型'] === 'conditional') return 'IF';
  if (node.kind === '动作序列' && node.details['开始帧'] !== undefined) {
    return `${node.label} · ${node.details['开始帧']}f`;
  }
  return node.label.replace(/^\d+\.\s*/, '');
}

function subtitle(node: MapNodeSource): string {
  if (node.details['步骤类型'] === 'conditional') {
    return String(node.details['条件表达式'] ?? node.summary);
  }
  return node.summary;
}

function changeZoom(delta: number): void {
  zoom.value = Math.min(1.25, Math.max(0.45, Number((zoom.value + delta).toFixed(2))));
}

function toggleNode(id: string): void {
  const next = new Set(collapsedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  collapsedIds.value = next;
}

function expandAll(): void {
  collapsedIds.value = new Set();
}

function expandTwoLevels(): void {
  const ids = new Set<string>();
  function visit(node: MapNodeSource, depth: number): void {
    if (depth >= 2 && node.children.length > 0) ids.add(node.id);
    node.children.forEach(child => visit(child, depth + 1));
  }
  visit(props.root, 0);
  collapsedIds.value = ids;
}

function collapseAll(): void {
  const ids = new Set<string>();
  function visit(node: MapNodeSource): void {
    if (node.children.length > 0) ids.add(node.id);
    node.children.forEach(visit);
  }
  visit(props.root);
  collapsedIds.value = ids;
}

function startPan(event: PointerEvent): void {
  const element = viewport.value;
  if (element === null || (event.target as HTMLElement).closest('.map-node') !== null) return;
  dragging.value = true;
  dragOrigin.value = {
    x: event.clientX,
    y: event.clientY,
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop,
    pointerId: event.pointerId,
  };
  element.setPointerCapture(event.pointerId);
}

function movePan(event: PointerEvent): void {
  const element = viewport.value;
  if (!dragging.value || element === null || event.pointerId !== dragOrigin.value.pointerId) return;
  element.scrollLeft = dragOrigin.value.scrollLeft - (event.clientX - dragOrigin.value.x);
  element.scrollTop = dragOrigin.value.scrollTop - (event.clientY - dragOrigin.value.y);
}

function endPan(event: PointerEvent): void {
  const element = viewport.value;
  if (!dragging.value || event.pointerId !== dragOrigin.value.pointerId) return;
  dragging.value = false;
  if (element?.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
}

async function zoomAtPointer(event: WheelEvent): Promise<void> {
  if (!event.ctrlKey && !event.metaKey) return;
  event.preventDefault();
  const element = viewport.value;
  if (element === null) return;
  const oldZoom = zoom.value;
  const nextZoom = Math.min(
    1.25,
    Math.max(0.45, Number((oldZoom + (event.deltaY < 0 ? 0.1 : -0.1)).toFixed(2))),
  );
  if (nextZoom === oldZoom) return;
  const rect = element.getBoundingClientRect();
  const pointerX = event.clientX - rect.left;
  const pointerY = event.clientY - rect.top;
  const worldX = (element.scrollLeft + pointerX) / oldZoom;
  const worldY = (element.scrollTop + pointerY) / oldZoom;
  zoom.value = nextZoom;
  await nextTick();
  element.scrollLeft = worldX * nextZoom - pointerX;
  element.scrollTop = worldY * nextZoom - pointerY;
}

async function centerRoot(): Promise<void> {
  await nextTick();
  const element = viewport.value;
  const rootNode = layout.value.nodes.find(node => node.source.id === props.root.id);
  if (element === null || rootNode === undefined) return;
  element.scrollLeft = Math.max(0, rootNode.x * zoom.value - 36);
  element.scrollTop = Math.max(0, rootNode.y * zoom.value - 54);
}

async function revealNode(id: string): Promise<void> {
  const ancestors: string[] = [];
  function find(node: MapNodeSource, path: readonly string[]): boolean {
    if (node.id === id) {
      ancestors.push(...path);
      return true;
    }
    return node.children.some(child => find(child, [...path, node.id]));
  }
  if (!find(props.root, [])) return;
  const next = new Set(collapsedIds.value);
  ancestors.forEach(ancestorId => next.delete(ancestorId));
  collapsedIds.value = next;
  await nextTick();
  const element = viewport.value;
  const target = layout.value.nodes.find(node => node.source.id === id);
  if (element === null || target === undefined) return;
  const targetLeft = target.x * zoom.value;
  const targetTop = target.y * zoom.value;
  element.scrollLeft = Math.max(0, targetLeft - element.clientWidth * 0.28);
  element.scrollTop = Math.max(0, targetTop - element.clientHeight * 0.4);
}

function transferCollapsedState(fromId: string, toId: string): void {
  if (fromId === toId || !collapsedIds.value.has(fromId)) return;
  const next = new Set(collapsedIds.value);
  next.delete(fromId);
  next.add(toId);
  collapsedIds.value = next;
}

defineExpose({ revealNode, transferCollapsedState });

watch(
  () => props.root.id,
  () => {
    expandTwoLevels();
    void centerRoot();
  },
  { immediate: true, flush: 'post' },
);
</script>

<template>
  <div ref="shell" class="mind-map-shell">
    <div class="map-toolbar">
      <span>全局结构图</span>
      <small> {{ layout.nodes.length }} / {{ totalNodeCount }} · 空白处漫游，抓手拖放节点 </small>
      <div class="history-actions">
        <button
          :disabled="!canUndo"
          title="撤销结构编辑 (Ctrl+Z)"
          @click="emit('historyAction', 'undo')"
        >
          ↶
        </button>
        <button
          :disabled="!canRedo"
          title="重做结构编辑 (Ctrl+Y)"
          @click="emit('historyAction', 'redo')"
        >
          ↷
        </button>
      </div>
      <div v-if="selectedNode" class="selected-node-actions">
        <button
          v-if="selectedNode.payloadKind && selectedNode.canCopy !== false"
          title="复制选中节点 (Ctrl+C)"
          @click="runNodeAction('copy', selectedNode)"
        >
          复制
        </button>
        <button
          v-if="clipboardKind !== undefined && selectedNode.acceptsChildKind === clipboardKind"
          title="粘贴为选中节点的子节点 (Ctrl+V)"
          @click="runNodeAction('paste', selectedNode)"
        >
          粘贴到此处
        </button>
        <span v-if="clipboardKind" class="clipboard-state">剪贴板：{{ clipboardLabel }}</span>
      </div>
      <div class="structure-actions">
        <button title="全部展开" @click="expandAll">全部</button>
        <button title="恢复默认展开两级" @click="expandTwoLevels">两级</button>
        <button title="仅显示根节点" @click="collapseAll">仅根</button>
        <button title="定位根节点" @click="centerRoot">定位</button>
      </div>
      <div class="zoom-actions">
        <button @click="changeZoom(-0.1)">−</button>
        <button
          @click="
            zoom = 0.9;
            centerRoot();
          "
        >
          {{ Math.round(zoom * 100) }}%
        </button>
        <button @click="changeZoom(0.1)">+</button>
      </div>
    </div>
    <div
      ref="viewport"
      class="map-viewport"
      :class="{ dragging }"
      @pointerdown="startPan"
      @pointermove="movePan"
      @pointerup="endPan"
      @pointercancel="endPan"
      @wheel="zoomAtPointer"
    >
      <div class="map-legend"><i></i><span>固定字段端口</span></div>
      <div
        class="map-stage"
        :style="{ width: `${layout.width * zoom}px`, height: `${layout.height * zoom}px` }"
      >
        <div
          class="map-scaled-content"
          :style="{
            width: `${layout.width}px`,
            height: `${layout.height}px`,
            transform: `scale(${zoom})`,
          }"
        >
          <svg class="edge-layer" :viewBox="`0 0 ${layout.width} ${layout.height}`">
            <path
              v-for="edge in layout.edges"
              :key="edge.id"
              :class="edge.tone"
              :d="edgePath(edge)"
            />
          </svg>
          <div
            v-for="node in layout.nodes"
            :key="node.source.id"
            class="map-node"
            :class="nodeClass(node.source)"
            :style="{ left: `${node.x}px`, top: `${node.y}px` }"
            role="button"
            tabindex="0"
            @click="emit('select', node.source)"
            @keydown.enter="emit('select', node.source)"
            @dragover="dragOverNode($event, node.source)"
            @dragleave="dropHint?.id === node.source.id && (dropHint = undefined)"
            @drop="dropOnNode($event, node.source)"
            @contextmenu="openContextMenu($event, node.source)"
          >
            <span
              v-if="node.source.payloadKind && node.source.canMove !== false"
              class="node-drag-handle"
              draggable="true"
              title="拖放以移动节点"
              @click.stop
              @dragstart.stop="startNodeDrag($event, node.source)"
              @dragend.stop="
                draggedNode = null;
                dropHint = undefined;
              "
              >⠿</span
            >
            <span class="node-kind">{{ node.source.kind }}</span>
            <strong>{{ title(node.source) }}</strong>
            <small>{{ subtitle(node.source) }}</small>
            <button
              v-if="showReferencePins && node.source.reference"
              class="reference-pin"
              title="跳转到引用定义"
              @click.stop="emit('reference', node.source.reference)"
            >
              ↗
            </button>
            <button
              v-if="node.source.canAddChild"
              class="add-child"
              title="添加子节点"
              @click.stop="emit('addChild', node.source, { x: $event.clientX, y: $event.clientY })"
            >
              +
            </button>
            <button
              v-if="node.source.children.length"
              class="collapse-toggle"
              :title="collapsedIds.has(node.source.id) ? '展开子节点' : '收起子节点'"
              @click.stop="toggleNode(node.source.id)"
            >
              {{ collapsedIds.has(node.source.id) ? '+' : '−' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div
        v-if="contextMenu"
        class="map-context-menu"
        :style="{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }"
        @pointerdown.stop
      >
        <button
          v-if="contextMenu.node.payloadKind && contextMenu.node.canCopy !== false"
          @click="runNodeAction('copy', contextMenu.node)"
        >
          复制 <kbd>Ctrl+C</kbd>
        </button>
        <button
          v-if="clipboardKind !== undefined && contextMenu.node.acceptsChildKind === clipboardKind"
          @click="runNodeAction('paste', contextMenu.node)"
        >
          粘贴 <kbd>Ctrl+V</kbd>
        </button>
        <button
          v-if="contextMenu.node.payloadKind && contextMenu.node.canDelete !== false"
          class="danger"
          @click="runNodeAction('delete', contextMenu.node)"
        >
          删除 <kbd>Delete</kbd>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.mind-map-shell {
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: 38px minmax(0, 1fr);
  background: #121316;
}
.map-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border-bottom: 1px solid #30333a;
  background: #181a1e;
  white-space: nowrap;
}
.map-toolbar > span {
  font-weight: 700;
}
.map-toolbar small {
  color: #7f858e;
}
.map-toolbar > div {
  display: flex;
}
.map-toolbar .structure-actions {
  margin-left: 6px;
}
.map-toolbar .selected-node-actions {
  align-items: center;
  gap: 4px;
  margin-left: auto;
}
.map-toolbar .history-actions {
  gap: 3px;
  margin-left: auto;
}
.map-toolbar .history-actions + .selected-node-actions {
  margin-left: 4px;
}
.clipboard-state {
  max-width: 150px;
  overflow: hidden;
  color: #d6b955;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.map-toolbar .zoom-actions {
  margin-left: 6px;
}
.map-toolbar button {
  min-width: 30px;
  height: 25px;
  padding: 0 7px;
  border: 1px solid #41454c;
  background: #22252a;
  color: #c8cbd0;
}
.map-viewport {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  background:
    radial-gradient(circle at center, rgba(255, 255, 255, 0.035) 1px, transparent 1px), #111215;
  background-size: 18px 18px;
  cursor: grab;
  touch-action: none;
}
.map-legend {
  position: sticky;
  top: 10px;
  left: 10px;
  z-index: 4;
  width: max-content;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 7px;
  border: 1px solid #353941;
  border-radius: 12px;
  background: rgb(18 19 22 / 88%);
  color: #8f96a1;
  font-size: 9px;
  pointer-events: none;
}
.map-legend i {
  width: 20px;
  border-top: 2px dotted #8b94a3;
}
.map-viewport.dragging {
  cursor: grabbing;
  user-select: none;
}
.map-stage {
  position: relative;
}
.map-scaled-content {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
}
.edge-layer {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}
.edge-layer path {
  fill: none;
  stroke: #59616d;
  stroke-width: 2;
}
.edge-layer path.true {
  stroke: #62b87a;
}
.edge-layer path.false {
  stroke: #c46f66;
}
.edge-layer path.body {
  stroke: #7099c6;
  stroke-dasharray: 5 4;
}
.edge-layer path.port {
  stroke: #8b94a3;
  stroke-width: 1.5;
  stroke-dasharray: 2 5;
}
.map-node {
  width: 220px;
  height: 52px;
  position: absolute;
  display: grid;
  grid-template-rows: 11px 17px 13px;
  align-content: center;
  gap: 1px;
  padding: 6px 9px;
  border: 1px solid #454a53;
  border-left: 4px solid #747b86;
  border-radius: 3px;
  background: #1d1f24;
  box-sizing: border-box;
  cursor: pointer;
}
.map-node:hover,
.map-node.selected {
  z-index: 2;
  border-color: #e0cb3c;
  box-shadow: 0 0 0 2px rgba(224, 203, 60, 0.17);
}
.map-node.drop-inside {
  outline: 2px solid #e0cb3c;
  outline-offset: 3px;
}
.map-node.drop-before::before,
.map-node.drop-after::after {
  content: '';
  position: absolute;
  left: -8px;
  right: -8px;
  height: 3px;
  background: #e0cb3c;
  box-shadow: 0 0 8px rgb(224 203 60 / 70%);
}
.map-node.drop-before::before {
  top: -7px;
}
.map-node.drop-after::after {
  bottom: -7px;
}
.node-kind {
  color: #858b94;
  font-size: 8px;
  line-height: 1;
}
.map-node strong,
.map-node small {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.map-node strong {
  font-size: 12px;
}
.map-node small {
  color: #858a92;
  font-size: 9px;
}
.map-node.root {
  border-left-color: #e0cb3c;
  background: #2a281d;
}
.map-node.sequence {
  border-left-color: #6fa3d8;
  background: #1b2632;
}
.map-node.conditional {
  border-color: #8b813b;
  border-left-color: #e0cb3c;
  background: #29261a;
}
.map-node.branch.true {
  border-left-color: #62b87a;
  background: #19251e;
}
.map-node.branch.false {
  border-left-color: #c46f66;
  background: #281c1c;
}
.map-node.container {
  border-left-color: #7099c6;
  background: #19232e;
}
.map-node.port {
  border-left-width: 2px;
  border-left-style: dashed;
  border-radius: 14px 3px 3px 14px;
  background-image: linear-gradient(90deg, rgb(139 148 163 / 10%), transparent 36px);
}
.map-node.reference {
  border-right: 3px solid #6fa3d8;
}
.map-node.collapsed {
  border-style: dashed;
}
.node-drag-handle {
  width: 18px;
  height: 24px;
  position: absolute;
  top: 13px;
  left: -12px;
  z-index: 5;
  display: grid;
  place-items: center;
  border: 1px solid #59616d;
  border-radius: 3px;
  background: #25282e;
  color: #aeb3bc;
  cursor: grab;
  font-size: 13px;
}
.node-drag-handle:active {
  cursor: grabbing;
}
.reference-pin {
  width: 22px;
  height: 22px;
  position: absolute;
  top: 14px;
  right: -12px;
  display: grid;
  place-items: center;
  border: 1px solid #6fa3d8;
  border-radius: 50%;
  background: #1b2a38;
  color: #9bc8f2;
}
.add-child {
  width: 22px;
  height: 22px;
  position: absolute;
  right: -12px;
  bottom: -10px;
  z-index: 4;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid #b7a92e;
  border-radius: 50%;
  background: #302d1d;
  color: #f2de48;
  font: 700 14px monospace;
}
.collapse-toggle {
  width: 20px;
  height: 20px;
  position: absolute;
  top: -9px;
  right: -9px;
  z-index: 3;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid #676e79;
  border-radius: 50%;
  background: #292c32;
  color: #d8dadd;
  font: 700 12px monospace;
}
.map-context-menu {
  position: fixed;
  z-index: 4200;
  min-width: 190px;
  display: grid;
  padding: 5px;
  border: 1px solid #4b4f57;
  background: #1c1e22;
  box-shadow: 0 12px 30px rgb(0 0 0 / 50%);
}
.map-context-menu button {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 9px;
  border: 0;
  background: transparent;
  color: #d5d7da;
  text-align: left;
}
.map-context-menu button:hover {
  background: #30333a;
}
.map-context-menu button.danger {
  color: #ed9292;
}
.map-context-menu kbd {
  color: #777d86;
  font: 10px monospace;
}
</style>
