<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import type {
  EquipmentAttribute,
  EquipmentContributionDefinition,
  EquipmentEventHandlerDefinition,
  EquipmentModifierDefinition,
  EquipmentPanelStat,
  EquipmentAbilityEvent,
} from '../../../core/game-data/equipmentDefinition';
import {
  EQUIPMENT_ABILITY_EVENTS,
  EQUIPMENT_PANEL_STATS,
} from '../../../core/game-data/equipmentDefinition';
import {
  DAMAGE_TYPES,
  OPERATOR_ATTRIBUTES,
  SKILL_TYPES,
  type CombatCondition,
  type CombatStepDefinition,
  type DamageType,
  type LevelValues,
  type SkillType,
} from '../../../core/game-data/operatorDefinition';
import {
  buildEquipmentContributionMindMap,
  findSkillStructureNodeForPath,
} from '../skillStructureMindMapModel';
import {
  appendCombatStepInStructure,
  cloneStructureValue,
  deleteStructureValueAtPath,
  insertStructureArrayItem,
  moveStructureArrayItem,
  removeStructureArrayItem,
  replaceStructureValueAtPath,
  resolveStructureValue,
} from '../skillStructureEditorCommands';
import {
  createSkillEditorStep,
  duplicateSkillEditorDetachedStep,
  type EditableCombatStepKind,
} from '../skillDefinitionEditorViewModel';
import SkillStructureMindMap from './SkillStructureMindMap.vue';
import CombatEventTriggerEditor from './CombatEventTriggerEditor.vue';
import CombatStepEditor from './CombatStepEditor.vue';
import StepTypePicker from './StepTypePicker.vue';
import EquipmentContributionTypePicker from './EquipmentContributionTypePicker.vue';
import CombatConditionEditor from './CombatConditionEditor.vue';
import CombatConditionTypePicker from './CombatConditionTypePicker.vue';
import EquipmentBuffDefinitionsDialog from './EquipmentBuffDefinitionsDialog.vue';

type ContributionPayloadKind =
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
interface ContributionOperationNode {
  readonly id: string;
  readonly sourcePath: string;
  readonly payloadKind?: ContributionPayloadKind;
  readonly acceptsChildKind?: ContributionPayloadKind;
}

const props = defineProps<{
  contribution: EquipmentContributionDefinition;
  label: string;
  level: number;
}>();
const emit = defineEmits<{ update: [contribution: EquipmentContributionDefinition] }>();
const selectedPath = ref('');
const selectedId = ref('equipment:contribution');
const selectedPayloadKind = ref<ContributionPayloadKind>();
const pendingAdd = ref<{
  readonly kind: 'step' | 'modifier' | 'handler' | 'condition';
  readonly targetPath: string;
  readonly anchor: { readonly x: number; readonly y: number };
} | null>(null);
const pickerKey = ref(0);
const modifierAttributes = [
  ...OPERATOR_ATTRIBUTES,
  'main',
  'secondary',
] as const satisfies readonly EquipmentAttribute[];
const undoStack = shallowRef<EquipmentContributionDefinition[]>([]);
const redoStack = shallowRef<EquipmentContributionDefinition[]>([]);
const showBuffDefinitions = ref(false);
const clipboard = shallowRef<
  | { readonly kind: 'equipmentModifier'; readonly value: EquipmentModifierDefinition }
  | { readonly kind: 'equipmentHandler'; readonly value: EquipmentEventHandlerDefinition }
  | { readonly kind: 'combatStep'; readonly value: CombatStepDefinition }
  | { readonly kind: 'combatCondition'; readonly value: CombatCondition }
>();
const structure = computed(() =>
  buildEquipmentContributionMindMap(props.contribution, props.label),
);
const selectedValue = computed(() => resolveStructureValue(props.contribution, selectedPath.value));
const selectedModifier = computed(() =>
  /^modifiers\[\d+\]$/.test(selectedPath.value)
    ? (selectedValue.value as EquipmentModifierDefinition)
    : null,
);
const selectedHandler = computed(() =>
  /^eventHandlers\[\d+\]$/.test(selectedPath.value)
    ? (selectedValue.value as EquipmentEventHandlerDefinition)
    : null,
);
const selectedStep = computed(() =>
  /\.steps\[\d+\]$/.test(selectedPath.value) ? (selectedValue.value as CombatStepDefinition) : null,
);
const selectedCondition = computed(() =>
  selectedPayloadKind.value === 'combatCondition' ? (selectedValue.value as CombatCondition) : null,
);
const initializationBlackboardEntries = computed(() =>
  Object.entries(props.contribution.initializationBlackboard ?? {}),
);

watch(
  () => props.label,
  () => {
    selectedPath.value = '';
    selectedId.value = 'equipment:contribution';
    selectedPayloadKind.value = undefined;
    undoStack.value = [];
    redoStack.value = [];
  },
);

function selectNode(node: {
  id: string;
  sourcePath: string;
  payloadKind?: ContributionPayloadKind;
}): void {
  selectedId.value = node.id;
  selectedPath.value = node.sourcePath;
  selectedPayloadKind.value = node.payloadKind;
}

function beginAdd(
  node: ContributionOperationNode & {
    readonly canAddChild?:
      | 'step'
      | 'equipmentModifier'
      | 'equipmentHandler'
      | 'combatCondition'
      | 'eventResponse'
      | 'skillEventHandler'
      | 'buffAbilityResponse'
      | 'buffIgniteResponse'
      | 'sequence'
      | 'lifecycle'
      | 'childSkill'
      | 'globalBuffChild';
  },
  anchor: { readonly x: number; readonly y: number },
): void {
  const kind =
    node.canAddChild === 'step'
      ? 'step'
      : node.canAddChild === 'equipmentModifier'
        ? 'modifier'
        : node.canAddChild === 'equipmentHandler'
          ? 'handler'
          : node.canAddChild === 'combatCondition'
            ? 'condition'
            : null;
  if (kind === null) return;
  selectNode(node);
  pendingAdd.value = { kind, targetPath: node.sourcePath, anchor };
  pickerKey.value += 1;
}

function commit(next: EquipmentContributionDefinition): void {
  undoStack.value = [...undoStack.value, cloneStructureValue(props.contribution)];
  redoStack.value = [];
  emit('update', next);
}

function replaceSelected(value: unknown): void {
  if (selectedPath.value === '') return;
  commit(replaceStructureValueAtPath(props.contribution, selectedPath.value, value));
}

async function restoreHistory(action: 'undo' | 'redo'): Promise<void> {
  const source = action === 'undo' ? undoStack : redoStack;
  const target = action === 'undo' ? redoStack : undoStack;
  const snapshot = source.value.at(-1);
  if (snapshot === undefined) return;
  source.value = source.value.slice(0, -1);
  target.value = [...target.value, cloneStructureValue(props.contribution)];
  emit('update', cloneStructureValue(snapshot));
  selectedPath.value = '';
  selectedId.value = 'equipment:contribution';
  selectedPayloadKind.value = undefined;
}

function childArrayPath(
  node: ContributionOperationNode,
  kind: ContributionPayloadKind,
): string | undefined {
  if (node.acceptsChildKind !== kind) return undefined;
  if (kind === 'combatStep') return `${node.sourcePath}.steps`;
  if (kind === 'combatCondition') return `${node.sourcePath}.conditions`;
  return node.sourcePath;
}

function insertionTarget(
  node: ContributionOperationNode,
  kind: ContributionPayloadKind,
  placement: 'inside' | 'before' | 'after',
): { readonly arrayPath: string; readonly index?: number } | undefined {
  if (placement === 'inside') {
    const arrayPath = childArrayPath(node, kind);
    return arrayPath === undefined ? undefined : { arrayPath };
  }
  const match = /^(.*)\[(\d+)\]$/.exec(node.sourcePath);
  if (match === null || node.payloadKind !== kind) return undefined;
  return { arrayPath: match[1]!, index: Number(match[2]) + (placement === 'after' ? 1 : 0) };
}

async function selectPath(path: string): Promise<void> {
  await nextTick();
  const node = findSkillStructureNodeForPath(structure.value, path);
  selectedPath.value = node.sourcePath;
  selectedId.value = node.id;
  selectedPayloadKind.value = node.payloadKind;
}

async function moveNode(operation: {
  readonly source: ContributionOperationNode;
  readonly target: ContributionOperationNode;
  readonly placement: 'inside' | 'before' | 'after';
}): Promise<void> {
  const kind = operation.source.payloadKind;
  if (kind === undefined || kind === 'scheduledSequence' || kind === 'childSkill') return;
  if (kind === 'combatCondition') {
    const source = /^(.*\.conditions)\[(\d+)\]$/.exec(operation.source.sourcePath);
    if (source === null) return;
    const siblings = resolveStructureValue(props.contribution, source[1]!) as readonly unknown[];
    if (siblings.length <= 1) return;
  }
  const target = insertionTarget(operation.target, kind, operation.placement);
  if (target === undefined) return;
  const result = moveStructureArrayItem(
    props.contribution,
    operation.source.sourcePath,
    target.arrayPath,
    target.index,
  );
  commit(result.root);
  await selectPath(result.itemPath);
}

function duplicateStep(step: CombatStepDefinition): CombatStepDefinition {
  return duplicateSkillEditorDetachedStep(editorSkillDraft(), step);
}

function editorSkillDraft() {
  return {
    key: 'equipment-contribution',
    timelineBlockFrames: 0,
    scheduledSequences: (props.contribution.eventHandlers ?? []).map(handler => ({
      startFrame: 0,
      sequence: handler.sequence,
    })),
  };
}

async function appendModifier(modifier: EquipmentModifierDefinition): Promise<void> {
  const pending = pendingAdd.value;
  if (pending?.kind !== 'modifier') return;
  const result = insertStructureArrayItem(props.contribution, pending.targetPath, modifier);
  pendingAdd.value = null;
  commit(result.root);
  await selectPath(result.itemPath);
}

async function appendHandler(handler: EquipmentEventHandlerDefinition): Promise<void> {
  const pending = pendingAdd.value;
  if (pending?.kind !== 'handler') return;
  const result = insertStructureArrayItem(props.contribution, pending.targetPath, handler);
  pendingAdd.value = null;
  commit(result.root);
  await selectPath(result.itemPath);
}

async function appendStep(kind: EditableCombatStepKind): Promise<void> {
  const pending = pendingAdd.value;
  if (pending?.kind !== 'step') return;
  const result = appendCombatStepInStructure(
    props.contribution,
    pending.targetPath,
    createSkillEditorStep(editorSkillDraft(), kind),
  );
  pendingAdd.value = null;
  commit(result.root);
  await selectPath(result.stepPath);
}

async function appendCondition(condition: CombatCondition): Promise<void> {
  const pending = pendingAdd.value;
  if (pending?.kind !== 'condition') return;
  const target = resolveStructureValue(props.contribution, pending.targetPath) as
    EquipmentEventHandlerDefinition | CombatCondition;
  if ('kind' in target && (target.kind === 'all' || target.kind === 'any')) {
    const result = insertStructureArrayItem(
      props.contribution,
      `${pending.targetPath}.conditions`,
      condition,
    );
    pendingAdd.value = null;
    commit(result.root);
    await selectPath(result.itemPath);
    return;
  }
  const conditionPath = `${pending.targetPath}.condition`;
  pendingAdd.value = null;
  commit(replaceStructureValueAtPath(props.contribution, conditionPath, condition));
  await selectPath(conditionPath);
}

async function nodeAction(
  action: 'delete' | 'copy' | 'paste',
  node: ContributionOperationNode,
): Promise<void> {
  const kind = node.payloadKind;
  if (action === 'copy') {
    if (
      kind !== 'equipmentModifier' &&
      kind !== 'equipmentHandler' &&
      kind !== 'combatStep' &&
      kind !== 'combatCondition'
    )
      return;
    clipboard.value = {
      kind,
      value: cloneStructureValue(resolveStructureValue(props.contribution, node.sourcePath)),
    } as typeof clipboard.value;
    return;
  }
  if (action === 'delete' && kind !== undefined) {
    if (kind === 'combatCondition') {
      const child = /^(.*\.conditions)\[\d+\]$/.exec(node.sourcePath);
      if (child !== null) {
        const siblings = resolveStructureValue(props.contribution, child[1]!) as readonly unknown[];
        if (siblings.length <= 1) return;
        commit(removeStructureArrayItem(props.contribution, node.sourcePath));
        await selectPath(child[1]!.replace(/\.conditions$/, ''));
        return;
      }
      if (!/^eventHandlers\[\d+\]\.condition$/.test(node.sourcePath)) return;
      commit(deleteStructureValueAtPath(props.contribution, node.sourcePath));
      await selectPath(node.sourcePath.replace(/\.condition$/, ''));
      return;
    }
    commit(removeStructureArrayItem(props.contribution, node.sourcePath));
    await selectPath(node.sourcePath.replace(/\[[0-9]+\]$/, ''));
    return;
  }
  const copied = clipboard.value;
  if (action !== 'paste' || copied === undefined) return;
  const arrayPath = childArrayPath(node, copied.kind);
  if (arrayPath === undefined) return;
  const value =
    copied.kind === 'combatStep' ? duplicateStep(copied.value) : cloneStructureValue(copied.value);
  const result = insertStructureArrayItem(props.contribution, arrayPath, value);
  commit(result.root);
  await selectPath(result.itemPath);
}

function parseLevelValues(event: Event): void {
  const modifier = selectedModifier.value;
  if (modifier === null) return;
  const tokens = (event.target as HTMLInputElement).value.split(',').map(value => value.trim());
  const values = tokens.map(Number);
  if (
    tokens.some(value => value === '') ||
    values.length === 0 ||
    values.some(value => !Number.isFinite(value))
  )
    return;
  const levelValues: LevelValues = values.length === 1 ? values[0]! : values;
  replaceSelected({ ...modifier, value: levelValues });
}

function levelValuesText(value: LevelValues): string {
  return Array.isArray(value) ? value.join(', ') : String(value);
}

function createInitializationSequence(): void {
  if (props.contribution.initializationSequence !== undefined) return;
  commit({ ...props.contribution, initializationSequence: { steps: [] } });
}

async function removeInitializationSequence(): Promise<void> {
  if (props.contribution.initializationSequence === undefined) return;
  commit(deleteStructureValueAtPath(props.contribution, 'initializationSequence'));
  await selectPath('');
}

function addInitializationBlackboardEntry(): void {
  const values = { ...(props.contribution.initializationBlackboard ?? {}) };
  let index = 1;
  while (`custom_${index}` in values) index += 1;
  values[`custom_${index}`] = 0;
  commit({ ...props.contribution, initializationBlackboard: values });
}

function renameInitializationBlackboardEntry(oldKey: string, event: Event): void {
  const key = (event.target as HTMLInputElement).value.trim();
  if (key === '' || key === oldKey || key in (props.contribution.initializationBlackboard ?? {}))
    return;
  const values = Object.fromEntries(
    initializationBlackboardEntries.value.map(([entryKey, value]) => [
      entryKey === oldKey ? key : entryKey,
      value,
    ]),
  );
  commit({ ...props.contribution, initializationBlackboard: values });
}

function updateInitializationBlackboardValue(key: string, event: Event): void {
  const tokens = (event.target as HTMLInputElement).value.split(',').map(value => value.trim());
  const values = tokens.map(Number);
  if (tokens.some(value => value === '') || values.some(value => !Number.isFinite(value))) return;
  commit({
    ...props.contribution,
    initializationBlackboard: {
      ...(props.contribution.initializationBlackboard ?? {}),
      [key]: values.length === 1 ? values[0]! : values,
    },
  });
}

function removeInitializationBlackboardEntry(key: string): void {
  const values = { ...(props.contribution.initializationBlackboard ?? {}) };
  delete values[key];
  const next =
    Object.keys(values).length === 0
      ? (({ initializationBlackboard: _removed, ...rest }) => rest)(props.contribution)
      : { ...props.contribution, initializationBlackboard: values };
  commit(next);
}

function saveBuffDefinitions(
  definitions: EquipmentContributionDefinition['buffDefinitions'],
): void {
  const next =
    definitions === undefined
      ? (({ buffDefinitions: _removed, ...rest }) => rest)(props.contribution)
      : { ...props.contribution, buffDefinitions: definitions };
  commit(next);
  showBuffDefinitions.value = false;
}

function setModifierAttribute(attribute: EquipmentAttribute): void {
  const modifier = selectedModifier.value;
  if (modifier?.kind === 'attribute') replaceSelected({ ...modifier, attribute });
}

function setModifierOperation(operation: 'flat' | 'percent'): void {
  const modifier = selectedModifier.value;
  if (modifier?.kind === 'attribute') replaceSelected({ ...modifier, operation });
}

function setModifierPanelStat(stat: EquipmentPanelStat): void {
  const modifier = selectedModifier.value;
  if (modifier?.kind === 'panelStat') replaceSelected({ ...modifier, stat });
}

function selectedDamageTypes(modifier: EquipmentModifierDefinition): readonly DamageType[] {
  if (modifier.kind !== 'damageBonus') return [];
  return typeof modifier.damageTypes === 'string' ? [modifier.damageTypes] : modifier.damageTypes;
}

function selectedSkillTypes(
  modifier: EquipmentModifierDefinition,
): readonly SkillType[] | undefined {
  if (modifier.kind !== 'damageBonus' || modifier.skillTypes === undefined) return undefined;
  return typeof modifier.skillTypes === 'string' ? [modifier.skillTypes] : modifier.skillTypes;
}

function toggleDamageType(damageType: DamageType): void {
  const modifier = selectedModifier.value;
  if (modifier?.kind !== 'damageBonus') return;
  const current = selectedDamageTypes(modifier);
  const next = current.includes(damageType)
    ? current.filter(value => value !== damageType)
    : [...current, damageType];
  if (next.length === 0) return;
  replaceSelected({ ...modifier, damageTypes: next.length === 1 ? next[0]! : next });
}

function clearSkillTypeFilter(): void {
  const modifier = selectedModifier.value;
  if (modifier?.kind !== 'damageBonus') return;
  const { skillTypes: _skillTypes, ...next } = modifier;
  replaceSelected(next);
}

function toggleSkillType(skillType: SkillType): void {
  const modifier = selectedModifier.value;
  if (modifier?.kind !== 'damageBonus') return;
  const current = selectedSkillTypes(modifier);
  const next =
    current === undefined
      ? [skillType]
      : current.includes(skillType)
        ? current.filter(value => value !== skillType)
        : [...current, skillType];
  if (next.length === 0) {
    clearSkillTypeFilter();
    return;
  }
  replaceSelected({ ...modifier, skillTypes: next.length === 1 ? next[0]! : next });
}
</script>

<template>
  <div v-if="!showBuffDefinitions" class="contribution-editor">
    <SkillStructureMindMap
      class="contribution-map"
      :root="structure"
      :selected-id="selectedId"
      :show-reference-pins="false"
      :clipboard-kind="clipboard?.kind"
      :can-undo="undoStack.length > 0"
      :can-redo="redoStack.length > 0"
      @select="selectNode"
      @add-child="beginAdd"
      @move-node="moveNode"
      @node-action="nodeAction"
      @history-action="restoreHistory"
    />
    <StepTypePicker
      v-if="pendingAdd?.kind === 'step'"
      :key="`step:${pickerKey}`"
      hide-trigger
      open-on-mount
      :anchor="pendingAdd.anchor"
      @select="appendStep"
      @close="pendingAdd = null"
    />
    <EquipmentContributionTypePicker
      v-if="pendingAdd?.kind === 'modifier' || pendingAdd?.kind === 'handler'"
      :key="`equipment:${pickerKey}`"
      :mode="pendingAdd.kind"
      :anchor="pendingAdd.anchor"
      :level-count="level"
      :handler-keys="(contribution.eventHandlers ?? []).map(handler => handler.key)"
      @modifier="appendModifier"
      @handler="appendHandler"
      @close="pendingAdd = null"
    />
    <CombatConditionTypePicker
      v-if="pendingAdd?.kind === 'condition'"
      :key="`condition:${pickerKey}`"
      :anchor="pendingAdd.anchor"
      @select="appendCondition"
      @close="pendingAdd = null"
    />
    <aside class="contribution-inspector">
      <template v-if="selectedModifier">
        <header>
          <strong>属性修正</strong><span>{{ selectedModifier.kind }}</span>
        </header>
        <div v-if="selectedModifier.kind === 'attribute'" class="field-grid">
          <label>
            <span>属性</span>
            <select
              :value="selectedModifier.attribute"
              @change="
                setModifierAttribute(
                  ($event.target as HTMLSelectElement).value as EquipmentAttribute,
                )
              "
            >
              <option v-for="attribute in modifierAttributes" :key="attribute" :value="attribute">
                {{ attribute }}
              </option>
            </select>
          </label>
          <label>
            <span>运算方式</span>
            <select
              :value="selectedModifier.operation"
              @change="
                setModifierOperation(
                  ($event.target as HTMLSelectElement).value as 'flat' | 'percent',
                )
              "
            >
              <option value="flat">固定值</option>
              <option value="percent">百分比</option>
            </select>
          </label>
        </div>
        <label v-else-if="selectedModifier.kind === 'panelStat'">
          <span>面板属性</span>
          <select
            :value="selectedModifier.stat"
            @change="
              setModifierPanelStat(($event.target as HTMLSelectElement).value as EquipmentPanelStat)
            "
          >
            <option v-for="stat in EQUIPMENT_PANEL_STATS" :key="stat" :value="stat">
              {{ stat }}
            </option>
          </select>
        </label>
        <template v-else>
          <fieldset>
            <legend>伤害类型（至少一项）</legend>
            <button
              v-for="damageType in DAMAGE_TYPES"
              :key="damageType"
              class="filter-chip"
              :class="{ active: selectedDamageTypes(selectedModifier).includes(damageType) }"
              @click="toggleDamageType(damageType)"
            >
              {{ damageType }}
            </button>
          </fieldset>
          <fieldset>
            <legend>技能类型筛选</legend>
            <button
              class="filter-chip"
              :class="{ active: selectedSkillTypes(selectedModifier) === undefined }"
              @click="clearSkillTypeFilter"
            >
              全部
            </button>
            <button
              v-for="skillType in SKILL_TYPES"
              :key="skillType"
              class="filter-chip"
              :class="{ active: selectedSkillTypes(selectedModifier)?.includes(skillType) }"
              @click="toggleSkillType(skillType)"
            >
              {{ skillType }}
            </button>
          </fieldset>
        </template>
        <label>
          <span>等级值</span>
          <input :value="levelValuesText(selectedModifier.value)" @change="parseLevelValues" />
          <small>单值或逗号分隔的逐级数值；当前预览等级 {{ level }}。</small>
        </label>
      </template>
      <CombatConditionEditor
        v-else-if="selectedCondition"
        :condition="selectedCondition"
        layer-only
        @update="replaceSelected"
      />
      <template v-else-if="selectedHandler">
        <header>
          <strong>事件响应</strong><span>{{ selectedHandler.key }}</span>
        </header>
        <label>
          <span>稳定 key</span>
          <input
            :value="selectedHandler.key"
            @change="
              replaceSelected({
                ...selectedHandler,
                key: ($event.target as HTMLInputElement).value,
              })
            "
          />
        </label>
        <label v-if="selectedHandler.abilityEvent !== undefined">
          <span>AbilitySystem 事件</span>
          <select
            :value="selectedHandler.abilityEvent"
            @change="
              replaceSelected({
                ...selectedHandler,
                abilityEvent: ($event.target as HTMLSelectElement).value as EquipmentAbilityEvent,
              })
            "
          >
            <option v-for="event in EQUIPMENT_ABILITY_EVENTS" :key="event" :value="event">
              {{ event }}
            </option>
          </select>
        </label>
        <CombatEventTriggerEditor
          v-else
          :event="selectedHandler.event"
          @update="replaceSelected({ ...selectedHandler, event: $event })"
        />
        <p class="hint">响应条件与动作序列作为子节点显示在画布中；右侧只编辑当前层。</p>
      </template>
      <CombatStepEditor
        v-else-if="selectedStep"
        :step="selectedStep"
        :skill-level="level"
        :show-header="false"
        inspector-only
        @update="replaceSelected"
      />
      <template v-else>
        <header>
          <strong>{{ label }}</strong
          ><span>当前层</span>
        </header>
        <p class="hint">在画布中选择属性修正、事件响应或响应序列里的步骤进行编辑。</p>
        <section class="root-section">
          <header>
            <strong>附属 Buff 定义</strong
            ><span>{{ Object.keys(contribution.buffDefinitions ?? {}).length }} 项</span>
          </header>
          <p class="hint">属于当前武器词条、装备词条或套装贡献；事件和初始化步骤按 ID 引用。</p>
          <button class="section-action" @click="showBuffDefinitions = true">
            打开 Buff 工作区
          </button>
        </section>
        <section class="root-section">
          <header><strong>帧 0 初始化黑板</strong><span>按词条等级解析</span></header>
          <p class="hint">这些值在构筑编译完成后写入初始化动作黑板，不属于技能的初始黑板。</p>
          <div
            v-for="([key, value], index) in initializationBlackboardEntries"
            :key="`${key}:${index}`"
            class="blackboard-row"
          >
            <input
              :value="key"
              aria-label="黑板键"
              @change="renameInitializationBlackboardEntry(key, $event)"
            />
            <input
              :value="levelValuesText(value)"
              aria-label="黑板逐级值"
              @change="updateInitializationBlackboardValue(key, $event)"
            />
            <button aria-label="删除黑板值" @click="removeInitializationBlackboardEntry(key)">
              ×
            </button>
          </div>
          <button class="section-action" @click="addInitializationBlackboardEntry">
            ＋ 添加黑板值
          </button>
        </section>
        <section class="root-section">
          <header><strong>帧 0 初始化序列</strong><span>每场战斗一次</span></header>
          <p class="hint">构筑满足后在战斗第 0 帧执行，典型用途是安装装备或套装的根 Buff。</p>
          <button
            v-if="contribution.initializationSequence === undefined"
            class="section-action"
            @click="createInitializationSequence"
          >
            ＋ 创建初始化序列
          </button>
          <button v-else class="section-action danger" @click="removeInitializationSequence">
            删除初始化序列
          </button>
        </section>
      </template>
    </aside>
  </div>
  <EquipmentBuffDefinitionsDialog
    v-else
    :visible="true"
    :definitions="contribution.buffDefinitions"
    :reference-root="contribution"
    :level="level"
    @update:visible="showBuffDefinitions = $event"
    @save="saveBuffDefinitions"
  />
</template>

<style scoped>
.contribution-editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 34%);
  min-height: 520px;
  border: 1px solid var(--ea-border-soft);
}
.contribution-map {
  min-width: 0;
  min-height: 520px;
}
.contribution-inspector {
  min-width: 0;
  padding: 14px;
  overflow: auto;
  border-left: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
  container-type: inline-size;
}
header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}
header span,
.hint,
label span,
label small {
  color: var(--ea-fg-muted);
}
label {
  display: grid;
  gap: 6px;
  margin-top: 14px;
  font-size: 11px;
}
input,
select {
  width: 100%;
  min-width: 0;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
fieldset {
  margin: 14px 0 0;
  padding: 10px;
  border: 1px solid var(--ea-border-soft);
}
legend {
  padding: 0 5px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.filter-chip {
  margin: 3px;
  padding: 5px 7px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-soft);
  color: var(--ea-fg-secondary);
  cursor: pointer;
}
.filter-chip.active {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 12%, var(--ea-fill-soft));
}
.readout {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 8px;
  margin-top: 10px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.readout code {
  min-width: 0;
  color: var(--ea-fg-secondary);
  overflow-wrap: anywhere;
}
.hint {
  line-height: 1.55;
}
.root-section {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--ea-border-soft);
}
.root-section header {
  border-bottom: 0;
  padding-bottom: 5px;
}
.blackboard-row {
  display: grid;
  grid-template-columns: minmax(90px, 1fr) minmax(80px, 0.8fr) 28px;
  gap: 5px;
  margin-top: 7px;
}
.blackboard-row button,
.section-action {
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg-secondary);
  cursor: pointer;
}
.section-action {
  min-height: 30px;
  margin-top: 8px;
}
.section-action.danger,
.blackboard-row button {
  color: #e69a7a;
}
@media (max-width: 820px) {
  .contribution-editor {
    grid-template-columns: 1fr;
  }
  .contribution-inspector {
    min-height: 260px;
    border-left: 0;
    border-top: 1px solid var(--ea-border-soft);
  }
}
</style>
