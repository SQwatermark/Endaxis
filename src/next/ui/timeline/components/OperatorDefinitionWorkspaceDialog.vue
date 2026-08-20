<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  OPERATOR_ATTRIBUTES,
  SKILL_LEVEL_SOURCES,
  SKILL_TYPES,
  type CombatStepDefinition,
  type OperatorAbilityEntityDefinitions,
  type OperatorDefinition,
  type SkillDefinition,
  type SkillGroupDefinition,
} from '../../../core/game-data/operatorDefinition';
import {
  createSkillEditorStep,
  duplicateSkillEditorDetachedStep,
  type EditableCombatStepKind,
} from '../skillDefinitionEditorViewModel';
import AbilityEntityDefinitionsDialog from './AbilityEntityDefinitionsDialog.vue';
import BuffStepEditor from './BuffStepEditor.vue';
import SkillDefinitionEditorDialog from './SkillDefinitionEditorDialog.vue';

type Section = 'panel' | 'skills' | 'buffs' | 'entities';
type BuffStep = Extract<CombatStepDefinition, { kind: 'applyBuff' }>;

const props = defineProps<{
  visible: boolean;
  baseDefinition: OperatorDefinition;
  customDefinition?: OperatorDefinition;
  commonAbilityEntityDefinitions?: OperatorAbilityEntityDefinitions;
  skillLevel: number;
}>();
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  save: [definition: OperatorDefinition];
  reset: [];
}>();

const section = ref<Section>('panel');
const draft = ref<OperatorDefinition>(clone(props.baseDefinition));
const panelLevel = ref(90);
const selectedGroupIndex = ref(0);
const selectedSkillIndex = ref(0);
const selectedBuffId = ref('');
const showSkillEditor = ref(false);
const showEntityEditor = ref(false);

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    draft.value = clone(props.customDefinition ?? props.baseDefinition);
    section.value = 'panel';
    selectedGroupIndex.value = 0;
    selectedSkillIndex.value = 0;
    selectedBuffId.value = Object.keys(draft.value.buffDefinitions ?? {}).sort()[0] ?? '';
  },
  { immediate: true },
);

const groups = computed(() => draft.value.skillGroups);
const selectedGroup = computed(() => groups.value[selectedGroupIndex.value]);
const selectedGroupSkills = computed(() => normalizeSkills(selectedGroup.value?.skills));
const selectedSkill = computed(() => selectedGroupSkills.value[selectedSkillIndex.value] ?? null);
const buffIds = computed(() => Object.keys(draft.value.buffDefinitions ?? {}).sort());
const selectedBuff = computed(() => draft.value.buffDefinitions?.[selectedBuffId.value]);
const selectedBuffStep = computed<BuffStep | null>(() =>
  selectedBuff.value === undefined
    ? null
    : {
        kind: 'applyBuff',
        parameters: {
          target: 'caster',
          buffId: selectedBuffId.value,
          definition: selectedBuff.value,
        },
      },
);
const abilityEntityIds = computed(() =>
  Object.keys({
    ...(props.commonAbilityEntityDefinitions ?? {}),
    ...(draft.value.abilityEntityDefinitions ?? {}),
  }).sort(),
);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizeSkills(
  skills: SkillGroupDefinition['skills'] | undefined,
): readonly SkillDefinition[] {
  if (skills === undefined) return [];
  return Array.isArray(skills) ? skills : [skills as SkillDefinition];
}

function updatePanelStat(key: keyof OperatorDefinition['attributes'], event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;
  const index = panelLevel.value - 1;
  const values = [...draft.value.attributes[key]];
  values[index] = value;
  draft.value = {
    ...draft.value,
    attributes: { ...draft.value.attributes, [key]: values },
  };
}

function replaceGroup(index: number, group: SkillGroupDefinition): void {
  const next = [...draft.value.skillGroups];
  next[index] = group;
  draft.value = { ...draft.value, skillGroups: next };
}

function updateGroup(field: 'key' | 'skillType' | 'levelSource', event: Event): void {
  const group = selectedGroup.value;
  if (group === undefined) return;
  replaceGroup(selectedGroupIndex.value, {
    ...group,
    [field]: (event.target as HTMLInputElement | HTMLSelectElement).value,
  } as SkillGroupDefinition);
}

function replaceSelectedSkill(skill: SkillDefinition): void {
  const group = selectedGroup.value;
  if (group === undefined) return;
  const skills = [...selectedGroupSkills.value];
  skills[selectedSkillIndex.value] = skill;
  replaceGroup(selectedGroupIndex.value, {
    ...group,
    skills: Array.isArray(group.skills) ? skills : skills[0]!,
  });
  showSkillEditor.value = false;
}

function updateBuffStep(step: CombatStepDefinition): void {
  if (step.kind !== 'applyBuff' || step.parameters.definition === undefined) return;
  draft.value = {
    ...draft.value,
    buffDefinitions: {
      ...(draft.value.buffDefinitions ?? {}),
      [selectedBuffId.value]: clone(step.parameters.definition),
    },
  };
}

function addBuff(): void {
  const existing = new Set(buffIds.value);
  let index = 1;
  while (existing.has(`custom-buff-${index}`)) index += 1;
  const id = `custom-buff-${index}`;
  draft.value = {
    ...draft.value,
    buffDefinitions: {
      ...(draft.value.buffDefinitions ?? {}),
      [id]: { stackingType: 'refresh', durationSeconds: 10 },
    },
  };
  selectedBuffId.value = id;
}

function removeBuff(): void {
  if (selectedBuffId.value === '') return;
  const next = { ...(draft.value.buffDefinitions ?? {}) };
  delete next[selectedBuffId.value];
  draft.value = {
    ...draft.value,
    buffDefinitions: Object.keys(next).length === 0 ? undefined : next,
  };
  selectedBuffId.value = Object.keys(next).sort()[0] ?? '';
}

function buffContext(): SkillDefinition {
  return { key: `buff:${selectedBuffId.value}`, timelineBlockFrames: 0, scheduledSequences: [] };
}

function createBuffStep(kind: EditableCombatStepKind): CombatStepDefinition {
  return createSkillEditorStep(buffContext(), kind);
}

function duplicateBuffStep(step: CombatStepDefinition): CombatStepDefinition {
  return duplicateSkillEditorDetachedStep(buffContext(), step);
}

function saveEntities(definitions: OperatorAbilityEntityDefinitions): void {
  draft.value = {
    ...draft.value,
    abilityEntityDefinitions: Object.keys(definitions).length === 0 ? undefined : definitions,
  };
  showEntityEditor.value = false;
}

function save(): void {
  emit('save', clone(draft.value));
  emit('update:visible', false);
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    width="min(1180px, calc(100vw - 48px))"
    append-to-body
    destroy-on-close
    class="operator-definition-workspace"
    @update:model-value="emit('update:visible', $event)"
  >
    <template #header>
      <div class="workspace-title">
        <div>
          <strong>自定义干员</strong><span>{{ draft.slug }}</span>
        </div>
        <small>编辑干员定义；这里的修改由所有引用该定义的干员实例共享。</small>
      </div>
    </template>

    <div class="workspace">
      <nav class="workspace-nav">
        <button :class="{ active: section === 'panel' }" @click="section = 'panel'">
          <span>基础面板</span><b>90 级</b>
        </button>
        <button :class="{ active: section === 'skills' }" @click="section = 'skills'">
          <span>技能与技能组</span><b>{{ draft.skillGroups.length }}</b>
        </button>
        <button :class="{ active: section === 'buffs' }" @click="section = 'buffs'">
          <span>Buff</span><b>{{ buffIds.length }}</b>
        </button>
        <button :class="{ active: section === 'entities' }" @click="section = 'entities'">
          <span>能力实体</span><b>{{ Object.keys(draft.abilityEntityDefinitions ?? {}).length }}</b>
        </button>
      </nav>

      <main class="workspace-main">
        <section v-if="section === 'panel'" class="definition-section">
          <header>
            <div>
              <h3>基础面板</h3>
              <p>编辑原始成长表中的单级数值，不改变实例等级。</p>
            </div>
          </header>
          <div class="identity-grid">
            <label>定义 ID<input :value="draft.slug" disabled /></label>
            <label>游戏 ID<input :value="draft.gameId" disabled /></label>
            <label>星级<input :value="draft.rarity" disabled /></label>
            <label>元素<input :value="draft.element" disabled /></label>
          </div>
          <div class="level-toolbar">
            <span>正在编辑等级</span>
            <input v-model.number="panelLevel" type="range" min="1" max="90" />
            <strong>Lv.{{ panelLevel }}</strong>
          </div>
          <div class="stat-grid">
            <label v-for="key in [...OPERATOR_ATTRIBUTES, 'baseAttack', 'baseHealth']" :key="key">
              <span>{{ key }}</span>
              <input
                type="number"
                step="0.01"
                :value="draft.attributes[key][panelLevel - 1] ?? 0"
                @input="updatePanelStat(key, $event)"
              />
            </label>
          </div>
        </section>

        <section v-else-if="section === 'skills'" class="definition-section split-section">
          <aside class="object-list">
            <button
              v-for="(group, index) in groups"
              :key="`${group.key}:${index}`"
              :class="{ active: selectedGroupIndex === index }"
              @click="
                selectedGroupIndex = index;
                selectedSkillIndex = 0;
              "
            >
              <span>{{ group.key }}</span
              ><small>{{ normalizeSkills(group.skills).length }} 个技能</small>
            </button>
          </aside>
          <div v-if="selectedGroup" class="object-editor">
            <header>
              <div>
                <h3>技能组</h3>
                <p>技能组决定技能库放置单元与养成等级来源。</p>
              </div>
            </header>
            <div class="identity-grid three">
              <label
                >组 ID<input :value="selectedGroup.key" @change="updateGroup('key', $event)"
              /></label>
              <label
                >技能类型<select
                  :value="selectedGroup.skillType"
                  @change="updateGroup('skillType', $event)"
                >
                  <option v-for="value in SKILL_TYPES" :key="value">{{ value }}</option>
                </select></label
              >
              <label
                >等级来源<select
                  :value="selectedGroup.levelSource"
                  @change="updateGroup('levelSource', $event)"
                >
                  <option v-for="value in SKILL_LEVEL_SOURCES" :key="value">{{ value }}</option>
                </select></label
              >
            </div>
            <div class="skill-tabs">
              <button
                v-for="(skill, index) in selectedGroupSkills"
                :key="`${skill.key}:${index}`"
                :class="{ active: selectedSkillIndex === index }"
                @click="selectedSkillIndex = index"
              >
                {{ skill.key }}
              </button>
            </div>
            <div v-if="selectedSkill" class="skill-summary">
              <div>
                <strong>{{ selectedSkill.key }}</strong
                ><span
                  >{{ selectedSkill.scheduledSequences.length }} 条时间线 ·
                  {{ selectedSkill.timelineBlockFrames }} 帧</span
                >
              </div>
              <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="showSkillEditor = true">
                编辑完整技能
              </button>
            </div>
          </div>
        </section>

        <section v-else-if="section === 'buffs'" class="definition-section split-section">
          <aside class="object-list">
            <button class="add-object" @click="addBuff">＋ 新增 Buff</button>
            <button
              v-for="id in buffIds"
              :key="id"
              :class="{ active: selectedBuffId === id }"
              @click="selectedBuffId = id"
            >
              {{ id }}
            </button>
          </aside>
          <div v-if="selectedBuffStep" class="object-editor">
            <header>
              <div>
                <h3>{{ selectedBuffId }}</h3>
                <p>干员级 Buff 蓝图；技能只通过 ID 引用。</p>
              </div>
              <button class="danger-button" @click="removeBuff">删除</button>
            </header>
            <BuffStepEditor
              :step="selectedBuffStep"
              :skill-level="skillLevel"
              definition-only
              :create-step="createBuffStep"
              :duplicate-step="duplicateBuffStep"
              @update="updateBuffStep"
            />
          </div>
          <div v-else class="empty-state">这个干员还没有 Buff 定义。</div>
        </section>

        <section v-else class="definition-section">
          <header>
            <div>
              <h3>能力实体</h3>
              <p>能力实体是干员定义的附属对象，子技能按引用它的技能等级解析。</p>
            </div>
          </header>
          <div class="entity-summary">
            <strong>{{ Object.keys(draft.abilityEntityDefinitions ?? {}).length }}</strong>
            <span>个干员级能力实体</span>
            <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="showEntityEditor = true">
              打开能力实体工作区
            </button>
          </div>
        </section>
      </main>
    </div>

    <template #footer>
      <div class="workspace-footer">
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('reset')">
          恢复游戏定义
        </button>
        <span />
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('update:visible', false)">
          取消
        </button>
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect ea-btn--hover-gold-fill" @click="save">
          保存干员定义
        </button>
      </div>
    </template>
  </el-dialog>

  <SkillDefinitionEditorDialog
    v-if="selectedSkill"
    :visible="showSkillEditor"
    :title="selectedSkill.key"
    :template-definition="selectedSkill"
    :custom-definition="undefined"
    :skill-level="skillLevel"
    :ability-entity-ids="abilityEntityIds"
    @update:visible="showSkillEditor = $event"
    @save="replaceSelectedSkill"
  />
  <AbilityEntityDefinitionsDialog
    :visible="showEntityEditor"
    :base-definitions="{}"
    :custom-definitions="draft.abilityEntityDefinitions"
    :common-definitions="commonAbilityEntityDefinitions"
    :skill-level="skillLevel"
    @update:visible="showEntityEditor = $event"
    @save="saveEntities"
  />
</template>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  height: min(720px, calc(100vh - 190px));
  min-height: 520px;
  border: 1px solid #3b3b3f;
  background: #171719;
}
.workspace-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.workspace-title div {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.workspace-title strong {
  font-size: 20px;
}
.workspace-title span,
.workspace-title small {
  color: #999;
}
.workspace-nav {
  padding: 12px;
  border-right: 1px solid #343438;
  background: #121214;
}
.workspace-nav button,
.object-list button {
  width: 100%;
  border: 0;
  color: #bbb;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.workspace-nav button {
  display: flex;
  justify-content: space-between;
  padding: 13px 12px;
  border-left: 3px solid transparent;
}
.workspace-nav button.active,
.object-list button.active {
  color: #f3df54;
  background: #2b2a22;
  border-left-color: #e5cf32;
}
.workspace-nav b {
  color: #777;
  font-weight: 500;
}
.workspace-main {
  min-width: 0;
  overflow: auto;
}
.definition-section {
  padding: 24px;
}
.definition-section header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
}
h3 {
  margin: 0 0 5px;
  font-size: 18px;
}
p {
  margin: 0;
  color: #8f8f94;
}
.identity-grid,
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.identity-grid.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  color: #aaa;
}
input,
select {
  min-width: 0;
  height: 36px;
  padding: 0 10px;
  color: #eee;
  border: 1px solid #444;
  background: #1d1d20;
}
input:disabled {
  color: #777;
}
.level-toolbar {
  display: grid;
  grid-template-columns: auto minmax(180px, 1fr) 64px;
  align-items: center;
  gap: 16px;
  margin: 28px 0 16px;
  padding: 14px;
  background: #202023;
}
.stat-grid label {
  display: grid;
  grid-template-columns: minmax(110px, 1fr) 160px;
  align-items: center;
}
.split-section {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 20px;
  padding: 0;
  min-height: 100%;
}
.object-list {
  padding: 14px;
  border-right: 1px solid #343438;
  background: #151517;
  overflow: auto;
}
.object-list button {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 11px 12px;
  overflow-wrap: anywhere;
}
.object-list small {
  color: #777;
}
.object-list .add-object {
  margin-bottom: 10px;
  color: #ddd;
  border: 1px dashed #555;
}
.object-editor {
  min-width: 0;
  padding: 24px 24px 40px 0;
}
.skill-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 22px 0 12px;
}
.skill-tabs button {
  padding: 8px 12px;
  color: #aaa;
  border: 1px solid #444;
  background: #1b1b1e;
  cursor: pointer;
}
.skill-tabs button.active {
  color: #f1dd4e;
  border-color: #b5a62e;
}
.skill-summary,
.entity-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border: 1px solid #3c3c40;
  background: #202023;
}
.skill-summary div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.skill-summary span {
  color: #888;
}
.entity-summary {
  justify-content: flex-start;
}
.entity-summary strong {
  font-size: 30px;
  color: #f1dd4e;
}
.entity-summary button {
  margin-left: auto;
}
.danger-button {
  color: #e18d8d;
  border: 1px solid #684040;
  background: transparent;
  padding: 7px 12px;
  cursor: pointer;
}
.empty-state {
  display: grid;
  place-items: center;
  color: #777;
  min-height: 300px;
}
.workspace-footer {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 10px;
}
@media (max-width: 850px) {
  .workspace {
    grid-template-columns: 150px minmax(0, 1fr);
  }
  .split-section {
    grid-template-columns: 190px minmax(0, 1fr);
  }
  .identity-grid,
  .identity-grid.three,
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
