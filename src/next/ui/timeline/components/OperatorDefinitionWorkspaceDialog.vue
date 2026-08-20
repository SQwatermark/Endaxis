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
import { validateSkillDefinition } from '../../../core/game-data/validateSkillDefinition';
import type { ValidationIssue } from '../../../core/project/validation';
import AbilityEntityDefinitionsDialog from './AbilityEntityDefinitionsDialog.vue';
import BuffDefinitionGraphEditor from './BuffDefinitionGraphEditor.vue';
import SkillDefinitionEditorDialog from './SkillDefinitionEditorDialog.vue';

type Section = 'panel' | 'skills' | 'buffs' | 'entities';
type BuffStep = Extract<CombatStepDefinition, { kind: 'applyBuff' }>;
const PANEL_ATTRIBUTE_KEYS: readonly (keyof OperatorDefinition['attributes'])[] = [
  ...OPERATOR_ATTRIBUTES,
  'baseAttack',
  'baseHealth',
];

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
const referencedEntityId = ref('');
const objectSearch = ref('');
const showProblems = ref(false);

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    draft.value = clone(props.customDefinition ?? props.baseDefinition);
    section.value = 'panel';
    selectedGroupIndex.value = 0;
    selectedSkillIndex.value = 0;
    selectedBuffId.value = Object.keys(draft.value.buffDefinitions ?? {}).sort()[0] ?? '';
    objectSearch.value = '';
    showProblems.value = false;
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
const normalizedObjectSearch = computed(() => objectSearch.value.trim().toLocaleLowerCase());
const filteredGroups = computed(() =>
  groups.value
    .map((group, index) => ({ group, index }))
    .filter(({ group }) => group.key.toLocaleLowerCase().includes(normalizedObjectSearch.value)),
);
const filteredBuffIds = computed(() =>
  buffIds.value.filter(id => id.toLocaleLowerCase().includes(normalizedObjectSearch.value)),
);
const draftIssues = computed<readonly ValidationIssue[]>(() =>
  draft.value.skillGroups.flatMap((group, groupIndex) =>
    normalizeSkills(group.skills).flatMap((skill, skillIndex) =>
      validateSkillDefinition(skill, `skillGroups[${groupIndex}].skills[${skillIndex}]`),
    ),
  ),
);
const isDirty = computed(
  () =>
    JSON.stringify(draft.value) !== JSON.stringify(props.customDefinition ?? props.baseDefinition),
);
const sectionLabel = computed(() => {
  if (section.value === 'panel') return '基础面板';
  if (section.value === 'skills') return '技能与技能组';
  if (section.value === 'buffs') return 'Buff';
  return '能力实体';
});
const objectLabel = computed(() => {
  if (section.value === 'skills') return selectedGroup.value?.key ?? '';
  if (section.value === 'buffs') return selectedBuffId.value;
  return '';
});

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

function selectSection(value: Section): void {
  section.value = value;
  objectSearch.value = '';
}

function revealIssue(issue: ValidationIssue): void {
  const match = /^skillGroups\[(\d+)\]\.skills\[(\d+)\]/.exec(issue.path);
  if (match === null) return;
  section.value = 'skills';
  selectedGroupIndex.value = Number(match[1]);
  selectedSkillIndex.value = Number(match[2]);
  showProblems.value = false;
}

function openReferencedDefinition(reference: {
  readonly kind: 'buff' | 'entity';
  readonly id: string;
}): void {
  showSkillEditor.value = false;
  if (reference.kind === 'buff') {
    section.value = 'buffs';
    selectedBuffId.value = reference.id;
    objectSearch.value = reference.id;
    return;
  }
  section.value = 'entities';
  referencedEntityId.value = reference.id;
  showEntityEditor.value = true;
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
          <strong>自定义干员</strong><span>{{ draft.displayName ?? draft.slug }}</span>
          <em v-if="isDirty">已修改</em>
        </div>
        <small>编辑干员定义；这里的修改由所有引用该定义的干员实例共享。</small>
      </div>
    </template>

    <div class="workspace">
      <nav class="workspace-nav">
        <div class="nav-caption">定义结构</div>
        <button :class="{ active: section === 'panel' }" @click="selectSection('panel')">
          <span>基础面板</span><b>90 级</b>
        </button>
        <button :class="{ active: section === 'skills' }" @click="selectSection('skills')">
          <span>技能与技能组</span><b>{{ draft.skillGroups.length }}</b>
        </button>
        <button :class="{ active: section === 'buffs' }" @click="selectSection('buffs')">
          <span>Buff</span><b>{{ buffIds.length }}</b>
        </button>
        <button :class="{ active: section === 'entities' }" @click="selectSection('entities')">
          <span>能力实体</span><b>{{ Object.keys(draft.abilityEntityDefinitions ?? {}).length }}</b>
        </button>
      </nav>

      <main class="workspace-main">
        <nav class="workspace-breadcrumbs" aria-label="当前位置">
          <button @click="selectSection('panel')">{{ draft.displayName ?? draft.slug }}</button>
          <span>›</span>
          <button @click="selectSection(section)">{{ sectionLabel }}</button>
          <template v-if="objectLabel">
            <span>›</span><strong>{{ objectLabel }}</strong>
          </template>
          <template v-if="section === 'skills' && selectedSkill">
            <span>›</span><strong>{{ selectedSkill.key }}</strong>
          </template>
        </nav>
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
            <label v-for="key in PANEL_ATTRIBUTE_KEYS" :key="key">
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
            <input v-model="objectSearch" class="object-search" placeholder="搜索技能组…" />
            <button
              v-for="entry in filteredGroups"
              :key="`${entry.group.key}:${entry.index}`"
              :class="{ active: selectedGroupIndex === entry.index }"
              @click="
                selectedGroupIndex = entry.index;
                selectedSkillIndex = 0;
              "
            >
              <span>{{ entry.group.key }}</span
              ><small>{{ normalizeSkills(entry.group.skills).length }} 个技能</small>
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
            <input v-model="objectSearch" class="object-search" placeholder="搜索 Buff…" />
            <button class="add-object" @click="addBuff">＋ 新增 Buff</button>
            <button
              v-for="id in filteredBuffIds"
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
            <BuffDefinitionGraphEditor
              :buff-id="selectedBuffId"
              :definition="selectedBuff!"
              :skill-level="skillLevel"
              @update="
                updateBuffStep({
                  kind: 'applyBuff',
                  parameters: {
                    buffId: selectedBuffId,
                    target: 'caster',
                    definition: $event,
                  },
                })
              "
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
      <div v-if="showProblems && draftIssues.length" class="workspace-problems">
        <button
          v-for="issue in draftIssues"
          :key="`${issue.path}:${issue.message}`"
          @click="revealIssue(issue)"
        >
          <code>{{ issue.path }}</code
          ><span>{{ issue.message }}</span>
        </button>
      </div>
      <div class="workspace-footer">
        <button
          class="problem-summary"
          :class="{ invalid: draftIssues.length > 0 }"
          @click="showProblems = !showProblems"
        >
          {{ draftIssues.length > 0 ? `● ${draftIssues.length} 个问题` : '✓ 定义结构有效' }}
        </button>
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('reset')">
          恢复游戏定义
        </button>
        <span />
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('update:visible', false)">
          取消
        </button>
        <button
          class="ea-btn ea-btn--sm ea-btn--glass-rect ea-btn--hover-gold-fill"
          :disabled="!isDirty"
          @click="save"
        >
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
    show-reference-pins
    allow-invalid-save
    @update:visible="showSkillEditor = $event"
    @save="replaceSelectedSkill"
    @reference="openReferencedDefinition"
  />
  <AbilityEntityDefinitionsDialog
    :visible="showEntityEditor"
    :base-definitions="{}"
    :custom-definitions="draft.abilityEntityDefinitions"
    :common-definitions="commonAbilityEntityDefinitions"
    :skill-level="skillLevel"
    :initial-selected-id="referencedEntityId"
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
.workspace-title em {
  padding: 2px 7px;
  color: #e7d64f;
  border: 1px solid #776f2c;
  border-radius: 10px;
  font-size: 11px;
  font-style: normal;
}
.workspace-nav {
  padding: 12px;
  border-right: 1px solid #343438;
  background: #121214;
}
.nav-caption {
  padding: 3px 12px 10px;
  color: #68686e;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
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
.workspace-breadcrumbs {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 0 18px;
  border-bottom: 1px solid #343438;
  background: rgba(23, 23, 25, 0.96);
  color: #777;
}
.workspace-breadcrumbs button {
  padding: 3px 0;
  border: 0;
  background: transparent;
  color: #aaa;
  cursor: pointer;
}
.workspace-breadcrumbs strong {
  color: #ddd;
  font-weight: 500;
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
.object-search {
  width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
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
  grid-template-columns: auto auto 1fr auto auto;
  gap: 10px;
}
.problem-summary {
  padding: 0 10px;
  border: 0;
  background: transparent;
  color: #80bf93;
  cursor: pointer;
}
.problem-summary.invalid {
  color: #e69a7a;
}
.workspace-problems {
  max-height: 150px;
  margin-bottom: 10px;
  overflow: auto;
  border: 1px solid #4b3430;
  background: #191313;
}
.workspace-problems button {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1fr);
  gap: 14px;
  padding: 8px 10px;
  border: 0;
  border-bottom: 1px solid #332625;
  background: transparent;
  color: #d7b2a4;
  text-align: left;
  cursor: pointer;
}
.workspace-problems code {
  color: #e3876e;
  overflow-wrap: anywhere;
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
