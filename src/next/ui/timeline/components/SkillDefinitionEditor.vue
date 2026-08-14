<script setup lang="ts">
/**
 * 技能逻辑编辑工作区，编辑单个技能块的完整 SkillDefinition 草稿。
 *
 * 本组件只负责草稿渲染与用户输入收集：它把模板和（可选的）自定义定义投影为
 * 可编辑字段与只读结构摘要，所有修改都作用在隔离草稿上；保存时把完整草稿交给
 * 统一命令入口严格校验，取消或恢复模板则直接丢弃草稿 / 删除整个 customDefinition。
 * 组件不解析编译产物，也不把天赋潜能等构筑效果写进自定义技能。
 */
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowDown, ArrowUp, CopyDocument, Delete, Plus } from '@element-plus/icons-vue';
import {
  COMBAT_RESOURCES,
  type CombatResource,
  type SkillDefinition,
} from '../../../core/game-data/operatorDefinition';
import { validateSkillDefinition } from '../../../core/game-data/validateSkillDefinition';
import {
  applySkillEditorCost,
  applySkillEditorField,
  appendSkillEditorCost,
  appendSkillEditorSequence,
  createSkillEditorDraft,
  createSkillEditorStep,
  duplicateSkillEditorDetachedStep,
  duplicateSkillEditorSequence,
  moveSkillEditorSequence,
  projectSkillEditor,
  removeSkillEditorSequence,
  removeSkillEditorCost,
  type EditableCombatStepKind,
  type SkillEditorViewModel,
} from '../skillDefinitionEditorViewModel';
import EditorFieldLabel from './EditorFieldLabel.vue';
import SkillAvailabilityEditor from './SkillAvailabilityEditor.vue';
import SkillBlackboardEditor from './SkillBlackboardEditor.vue';
import ScheduledSequenceEditor from './ScheduledSequenceEditor.vue';

type EditorSection = 'overview' | 'blackboard' | 'availability' | number;

const props = defineProps<{
  template: SkillDefinition;
  customDefinition: SkillDefinition | undefined;
  skillLevel: number;
  labels: {
    section: string;
    customized: string;
    timelineBlockFrames: string;
    cooldownFrames: string;
    levelArrayValue: string;
    costFrame: string;
    costs: string;
    costResource: string;
    costValue: string;
    scheduledSequences: string;
    startFrame: string;
    endFrame: string;
    stepKinds: string;
    save: string;
    cancel: string;
    reset: string;
    overview: string;
    structure: string;
    sequence: string;
  };
}>();

const emit = defineEmits<{
  save: [draft: SkillDefinition];
  cancel: [];
  reset: [];
}>();
const { t } = useI18n({ useScope: 'global' });

const draft = reactive<{ value: SkillDefinition }>({
  value: createSkillEditorDraft(props.template, props.customDefinition),
});
const selectedSection = ref<EditorSection>('overview');

const customized = computed(() => props.customDefinition !== undefined);

const view = computed<SkillEditorViewModel>(() =>
  projectSkillEditor(props.template, draft.value, customized.value),
);
const validationIssues = computed(() => validateSkillDefinition(draft.value));
const selectedSequence = computed(() =>
  typeof selectedSection.value === 'number'
    ? view.value.sequences[selectedSection.value]
    : undefined,
);

function createNestedStep(kind: EditableCombatStepKind) {
  return createSkillEditorStep(draft.value, kind);
}

function duplicateNestedStep(step: Parameters<typeof duplicateSkillEditorDetachedStep>[1]) {
  return duplicateSkillEditorDetachedStep(draft.value, step);
}

function setBlackboard(blackboard: NonNullable<SkillDefinition['blackboard']>): void {
  const next = { ...draft.value };
  if (Object.keys(blackboard).length === 0) delete next.blackboard;
  else next.blackboard = blackboard;
  draft.value = next;
}

function setAvailability(availability: SkillDefinition['availability']): void {
  const next = { ...draft.value };
  if (availability === undefined) delete next.availability;
  else next.availability = availability;
  draft.value = next;
}

watch(
  () => [props.template, props.customDefinition],
  () => {
    draft.value = createSkillEditorDraft(props.template, props.customDefinition);
    selectedSection.value = 'overview';
  },
);

function setField(
  field: 'timelineBlockFrames' | 'cooldownFrames' | 'costFrame',
  event: Event,
): void {
  const raw = (event.target as HTMLInputElement).value;
  const value = raw === '' ? undefined : Number(raw);
  if (value !== undefined && !Number.isFinite(value)) return;
  draft.value = applySkillEditorField(draft.value, {
    field,
    value: value === undefined ? undefined : Math.round(value),
  });
}

function setCostValue(index: number, event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;
  draft.value = applySkillEditorCost(draft.value, index, { value: Math.round(value) });
}

function setCostResource(index: number, event: Event): void {
  const resource = (event.target as HTMLSelectElement).value as CombatResource;
  if (!COMBAT_RESOURCES.includes(resource)) return;
  draft.value = applySkillEditorCost(draft.value, index, { resource });
}

function appendCost(): void {
  draft.value = appendSkillEditorCost(draft.value);
}

function removeCost(index: number): void {
  draft.value = removeSkillEditorCost(draft.value, index);
}

function selectSequence(index: number): void {
  selectedSection.value = index;
}

function replaceSelectedSequence(
  sequence: NonNullable<SkillDefinition['scheduledSequences'][number]>,
): void {
  if (typeof selectedSection.value !== 'number') return;
  const scheduledSequences = [...draft.value.scheduledSequences];
  scheduledSequences[selectedSection.value] = sequence;
  draft.value = { ...draft.value, scheduledSequences };
}

function appendSequence(): void {
  draft.value = appendSkillEditorSequence(draft.value);
  selectedSection.value = draft.value.scheduledSequences.length - 1;
}

function moveSequence(offset: -1 | 1): void {
  if (typeof selectedSection.value !== 'number') return;
  const target = selectedSection.value + offset;
  if (target < 0 || target >= draft.value.scheduledSequences.length) return;
  draft.value = moveSkillEditorSequence(draft.value, selectedSection.value, offset);
  selectedSection.value = target;
}

function duplicateSequence(): void {
  if (typeof selectedSection.value !== 'number') return;
  draft.value = duplicateSkillEditorSequence(draft.value, selectedSection.value);
  selectedSection.value += 1;
}

function removeSequence(): void {
  if (typeof selectedSection.value !== 'number') return;
  const current = selectedSection.value;
  draft.value = removeSkillEditorSequence(draft.value, current);
  selectedSection.value = Math.max(0, Math.min(current, draft.value.scheduledSequences.length - 1));
}

function save(): void {
  emit('save', structuredClone(draft.value));
}

function cancel(): void {
  draft.value = createSkillEditorDraft(props.template, props.customDefinition);
  emit('cancel');
}

function reset(): void {
  emit('reset');
}
</script>

<template>
  <section class="skill-editor">
    <header class="skill-editor__header">
      <div>
        <strong>{{ labels.section }}</strong>
        <span>{{ labels.structure }}</span>
      </div>
      <div class="skill-editor__status">
        <span v-if="customized">{{ labels.customized }}</span>
        <span>{{ t('nextTimeline.skillEditing.diffCount', { count: view.diffCount }) }}</span>
      </div>
    </header>

    <div class="skill-editor__workspace">
      <nav class="skill-editor__tree" :aria-label="labels.structure">
        <button
          type="button"
          :class="{ 'is-active': selectedSection === 'overview' }"
          @click="selectedSection = 'overview'"
        >
          <span class="tree-icon">◆</span>
          <span>{{ labels.overview }}</span>
        </button>
        <button
          type="button"
          :class="{ 'is-active': selectedSection === 'blackboard' }"
          @click="selectedSection = 'blackboard'"
        >
          <span class="tree-icon">▦</span>
          <span>{{ t('nextTimeline.skillEditing.initialBlackboard') }}</span>
          <small>{{ Object.keys(draft.value.blackboard ?? {}).length }}</small>
        </button>
        <button
          type="button"
          :class="{ 'is-active': selectedSection === 'availability' }"
          @click="selectedSection = 'availability'"
        >
          <span class="tree-icon">?</span>
          <span>{{ t('nextTimeline.skillEditing.availability') }}</span>
          <small>{{ draft.value.availability === undefined ? '—' : '1' }}</small>
        </button>
        <div class="tree-group-label">{{ labels.scheduledSequences }}</div>
        <button
          v-for="sequence in view.sequences"
          :key="sequence.index"
          type="button"
          :class="{ 'is-active': selectedSection === sequence.index }"
          @click="selectSequence(sequence.index)"
        >
          <span class="tree-index">{{ sequence.index + 1 }}</span>
          <span>{{ labels.sequence }} {{ sequence.index + 1 }}</span>
          <small>{{ sequence.startFrame }}f</small>
        </button>
        <button type="button" class="tree-add" @click="appendSequence">
          <el-icon><Plus /></el-icon>
          <span>{{ t('nextTimeline.skillEditing.addSequence') }}</span>
        </button>
      </nav>

      <main class="skill-editor__detail">
        <template v-if="selectedSection === 'overview'">
          <section class="editor-section">
            <h4>{{ labels.overview }}</h4>
            <div class="editor-grid">
              <label class="skill-editor__row">
                <span class="skill-editor__label">
                  <EditorFieldLabel
                    :label="labels.timelineBlockFrames"
                    :help="t('nextTimeline.skillEditing.fieldHelp.timelineBlockFrames')"
                  />
                  <b v-if="view.timelineBlockFramesChanged">*</b>
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  class="skill-editor__input"
                  :value="view.timelineBlockFrames"
                  @input="setField('timelineBlockFrames', $event)"
                />
              </label>

              <label class="skill-editor__row">
                <span class="skill-editor__label">
                  <EditorFieldLabel
                    :label="labels.cooldownFrames"
                    :help="t('nextTimeline.skillEditing.fieldHelp.cooldownFrames')"
                  />
                  <b v-if="view.cooldownFrames.changed">*</b>
                </span>
                <template v-if="!view.cooldownFrames.isLevelArray">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    class="skill-editor__input"
                    :value="view.cooldownFrames.value ?? ''"
                    @input="setField('cooldownFrames', $event)"
                  />
                </template>
                <span v-else class="skill-editor__readonly">{{ labels.levelArrayValue }}</span>
              </label>

              <label class="skill-editor__row">
                <span class="skill-editor__label">
                  <EditorFieldLabel
                    :label="labels.costFrame"
                    :help="t('nextTimeline.skillEditing.fieldHelp.costFrame')"
                  />
                  <b v-if="view.costFrameChanged">*</b>
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  class="skill-editor__input"
                  :value="view.costFrame ?? ''"
                  @input="setField('costFrame', $event)"
                />
              </label>
            </div>
          </section>

          <section class="editor-section">
            <div class="section-heading">
              <h4>{{ labels.costs }}</h4>
              <button
                type="button"
                class="icon-button"
                :title="t('nextTimeline.skillEditing.addCost')"
                @click="appendCost"
              >
                <el-icon><Plus /></el-icon>
              </button>
            </div>
            <div v-if="view.costs.length === 0" class="editor-empty">—</div>
            <div v-else class="cost-grid">
              <div v-for="(cost, index) in view.costs" :key="index" class="skill-editor__cost">
                <div class="cost-heading">
                  <strong>{{
                    t('nextTimeline.skillEditing.costItem', { index: index + 1 })
                  }}</strong>
                  <button
                    type="button"
                    class="icon-button icon-button--danger"
                    :title="t('nextTimeline.skillEditing.deleteCost')"
                    @click="removeCost(index)"
                  >
                    <el-icon><Delete /></el-icon>
                  </button>
                </div>
                <label class="skill-editor__row">
                  <span class="skill-editor__label">
                    <EditorFieldLabel
                      :label="labels.costResource"
                      :help="t('nextTimeline.skillEditing.fieldHelp.costResource')"
                    />
                    <b v-if="cost.resourceChanged">*</b>
                  </span>
                  <select
                    class="skill-editor__input"
                    :value="cost.resource"
                    @change="setCostResource(index, $event)"
                  >
                    <option v-for="resource in COMBAT_RESOURCES" :key="resource" :value="resource">
                      {{ resource }}
                    </option>
                  </select>
                </label>
                <label class="skill-editor__row">
                  <span class="skill-editor__label">
                    <EditorFieldLabel
                      :label="labels.costValue"
                      :help="t('nextTimeline.skillEditing.fieldHelp.costValue')"
                    />
                    <b v-if="cost.value.changed">*</b>
                  </span>
                  <template v-if="!cost.value.isLevelArray">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      class="skill-editor__input"
                      :value="cost.value.value ?? ''"
                      @input="setCostValue(index, $event)"
                    />
                  </template>
                  <span v-else class="skill-editor__readonly">{{ labels.levelArrayValue }}</span>
                </label>
              </div>
            </div>
          </section>
        </template>

        <SkillBlackboardEditor
          v-else-if="selectedSection === 'blackboard'"
          :blackboard="draft.value.blackboard ?? {}"
          :skill-level="skillLevel"
          @update="setBlackboard"
        />

        <SkillAvailabilityEditor
          v-else-if="selectedSection === 'availability'"
          :availability="draft.value.availability"
          @update="setAvailability"
        />

        <ScheduledSequenceEditor
          v-else-if="selectedSequence && typeof selectedSection === 'number'"
          :sequence="draft.value.scheduledSequences[selectedSection]!"
          :skill-level="skillLevel"
          :title="`${labels.sequence} ${selectedSection + 1}`"
          :start-frame-changed="selectedSequence.startFrameChanged"
          :end-frame-changed="selectedSequence.endFrameChanged"
          :create-step="createNestedStep"
          :duplicate-step="duplicateNestedStep"
          @update="replaceSelectedSequence"
        >
          <template #actions>
            <div>
              <button
                type="button"
                class="icon-button"
                :disabled="selectedSection === 0"
                :title="t('nextTimeline.skillEditing.moveSequenceUp')"
                @click="moveSequence(-1)"
              >
                <el-icon><ArrowUp /></el-icon>
              </button>
              <button
                type="button"
                class="icon-button"
                :disabled="selectedSection === view.sequences.length - 1"
                :title="t('nextTimeline.skillEditing.moveSequenceDown')"
                @click="moveSequence(1)"
              >
                <el-icon><ArrowDown /></el-icon>
              </button>
              <button
                type="button"
                class="icon-button"
                :title="t('nextTimeline.skillEditing.duplicateSequence')"
                @click="duplicateSequence"
              >
                <el-icon><CopyDocument /></el-icon>
              </button>
              <button
                type="button"
                class="icon-button icon-button--danger"
                :disabled="view.sequences.length <= 1"
                :title="t('nextTimeline.skillEditing.deleteSequence')"
                @click="removeSequence"
              >
                <el-icon><Delete /></el-icon>
              </button>
            </div>
          </template>
        </ScheduledSequenceEditor>
      </main>
    </div>

    <footer class="skill-editor__footer">
      <div class="skill-editor__footer-status">
        <span v-if="customized">{{
          t('nextTimeline.skillEditing.diffCount', { count: view.diffCount })
        }}</span>
        <details v-if="validationIssues.length > 0" class="validation-issues">
          <summary>
            {{
              t('nextTimeline.skillEditing.validationIssueCount', {
                count: validationIssues.length,
              })
            }}
          </summary>
          <ul>
            <li v-for="issue in validationIssues" :key="`${issue.path}:${issue.message}`">
              <code>{{ issue.path }}</code>
              <span>{{ issue.message }}</span>
            </li>
          </ul>
        </details>
      </div>
      <div class="skill-editor__actions">
        <button
          v-if="customized"
          type="button"
          class="skill-editor__button skill-editor__button--danger"
          @click="reset"
        >
          {{ labels.reset }}
        </button>
        <button type="button" class="skill-editor__button" @click="cancel">
          {{ labels.cancel }}
        </button>
        <button
          type="button"
          class="skill-editor__button skill-editor__button--primary"
          :disabled="validationIssues.length > 0"
          @click="save"
        >
          {{ labels.save }}
        </button>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.skill-editor {
  min-height: 600px;
  display: flex;
  flex-direction: column;
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
  font-size: 12px;
}

.skill-editor__header {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 16px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.skill-editor__header > div:first-child {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.skill-editor__header strong {
  font-size: 16px;
}

.skill-editor__header span,
.skill-editor__status {
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.skill-editor__status {
  display: flex;
  gap: 12px;
}

.skill-editor__status span:first-child {
  color: var(--ea-gold);
}

.skill-editor__workspace {
  min-height: 0;
  flex: 1;
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
}

.skill-editor__tree {
  min-height: 0;
  padding: 12px 8px;
  border-right: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
  overflow-y: auto;
}

.skill-editor__tree button {
  width: 100%;
  min-height: 38px;
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: center;
  gap: 7px;
  margin-bottom: 3px;
  padding: 0 9px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ea-fg-muted);
  text-align: left;
  cursor: pointer;
}

.skill-editor__tree button:hover,
.skill-editor__tree button.is-active {
  border-color: var(--ea-border);
  background: var(--ea-active-fill);
  color: var(--ea-fg);
}

.skill-editor__tree .tree-add {
  display: flex;
  justify-content: center;
  border-style: dashed;
}

.skill-editor__tree button.is-active {
  border-left: 3px solid var(--ea-gold);
}

.tree-index,
.tree-icon {
  color: var(--ea-gold);
  text-align: center;
}

.skill-editor__tree small {
  color: var(--ea-fg-muted);
}

.tree-group-label {
  margin: 16px 9px 6px;
  color: var(--ea-fg-muted);
  font-size: 10px;
  font-weight: 700;
}

.skill-editor__detail {
  min-width: 0;
  padding: 18px 20px;
  overflow-y: auto;
}

.editor-section {
  margin-bottom: 16px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}

.editor-section h4 {
  margin: 0;
  padding: 9px 12px;
  border-bottom: 1px solid var(--ea-border-soft);
  color: var(--ea-fg);
  font-size: 12px;
}

.sequence-heading {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.section-heading {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.section-heading h4 {
  flex: 1;
  border-bottom: none;
}

.sequence-heading h4 {
  flex: 1;
  border-bottom: none;
}

.sequence-heading > div {
  display: flex;
  gap: 4px;
}

.editor-grid,
.sequence-frame-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 16px;
  padding: 14px;
}

.cost-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 14px;
}

.skill-editor__label b {
  margin-left: 2px;
  color: var(--ea-gold);
}

.skill-editor__row {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(110px, 1fr) 140px;
  align-items: center;
  gap: 12px;
}

.skill-editor__label {
  flex: 0 0 auto;
  color: var(--ea-fg-muted);
  font-size: 10px;
}

.skill-editor__input {
  width: 100%;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  padding: 0 6px;
  font:
    12px/24px Consolas,
    monospace;
  text-align: center;
}

.skill-editor__readonly {
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.skill-editor__cost {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 12px;
  border: 1px solid var(--ea-border-soft);
}

.cost-heading {
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.cost-heading strong {
  color: var(--ea-fg);
  font-size: 11px;
}

.icon-button {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  cursor: pointer;
}

.icon-button:hover:not(:disabled) {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}

.icon-button--danger:hover:not(:disabled) {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.icon-button:disabled {
  opacity: 0.35;
  cursor: default;
}

.skill-editor__footer {
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-top: 1px solid var(--ea-border-soft);
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.skill-editor__footer-status {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.validation-issues {
  position: relative;
  color: #ff6b6b;
}

.validation-issues summary {
  cursor: pointer;
}

.validation-issues ul {
  position: absolute;
  bottom: 24px;
  left: 0;
  z-index: 8;
  width: min(560px, 60vw);
  max-height: 240px;
  margin: 0;
  padding: 10px 14px;
  overflow: auto;
  border: 1px solid #7d3034;
  background: var(--ea-workbench-panel);
  box-shadow: 0 5px 18px rgb(0 0 0 / 45%);
  list-style: none;
}

.validation-issues li {
  display: grid;
  grid-template-columns: minmax(180px, 1fr) minmax(160px, 1fr);
  gap: 10px;
  padding: 3px 0;
}

.validation-issues code {
  color: var(--ea-fg-muted);
  overflow-wrap: anywhere;
}

.skill-editor__actions {
  display: flex;
  gap: 6px;
}

.skill-editor__button {
  min-width: 88px;
  height: 30px;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  cursor: pointer;
  font-size: 11px;
}

.skill-editor__button:hover {
  border-color: var(--ea-gold);
}

.skill-editor__button--danger:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.skill-editor__button--primary {
  border-color: var(--ea-gold);
  background: var(--ea-active-fill);
}

.skill-editor__button:disabled {
  opacity: 0.4;
  cursor: default;
}

.editor-empty {
  padding: 20px;
  color: var(--ea-fg-muted);
  text-align: center;
}
</style>
