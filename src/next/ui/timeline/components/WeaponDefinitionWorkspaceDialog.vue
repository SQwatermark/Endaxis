<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  WEAPON_RARITIES,
  type EquipmentContributionDefinition,
  type WeaponDefinition,
} from '../../../core/game-data/equipmentDefinition';
import { OPERATOR_WEAPON_TYPES } from '../../../core/game-data/operatorDefinition';
import { validateWeaponDefinition } from '../../../core/game-data/equipmentDefinitionValidation';
import EquipmentContributionGraphEditor from './EquipmentContributionGraphEditor.vue';

const LEVEL_NODES = [1, 20, 40, 60, 80, 90] as const;
const props = defineProps<{
  visible: boolean;
  baseDefinition: WeaponDefinition;
  customDefinition: WeaponDefinition;
}>();
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  save: [definition: WeaponDefinition];
  reset: [];
}>();

const draft = ref<WeaponDefinition>(clone(props.customDefinition));
const selectedSection = ref<'base' | number>('base');
const issues = computed(() => validateWeaponDefinition(draft.value, '$.weapon'));
const isDirty = computed(
  () => JSON.stringify(draft.value) !== JSON.stringify(props.customDefinition),
);
const selectedTraitIndex = computed(() =>
  typeof selectedSection.value === 'number' ? selectedSection.value : null,
);
const selectedTrait = computed(() =>
  selectedTraitIndex.value === null ? undefined : draft.value.traits[selectedTraitIndex.value],
);

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    draft.value = clone(props.customDefinition);
    selectedSection.value = 'base';
  },
  { immediate: true },
);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function updateIdentity(
  field: 'displayName' | 'assetSlug' | 'iconPath' | 'rarity' | 'weaponType',
  event: Event,
): void {
  const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
  draft.value = {
    ...draft.value,
    [field]: field === 'rarity' ? Number(value) : value === '' ? undefined : value,
  } as WeaponDefinition;
}

function addTrait(): void {
  const keys = new Set(draft.value.traits.map(trait => trait.key));
  let index = 1;
  while (keys.has(`custom-trait-${index}`)) index += 1;
  draft.value = {
    ...draft.value,
    traits: [...draft.value.traits, { key: `custom-trait-${index}`, levelCount: 1 }],
  };
  selectedSection.value = draft.value.traits.length - 1;
}

function removeTrait(): void {
  const index = selectedTraitIndex.value;
  if (index === null) return;
  draft.value = { ...draft.value, traits: draft.value.traits.filter((_, i) => i !== index) };
  selectedSection.value =
    draft.value.traits.length === 0 ? 'base' : Math.min(index, draft.value.traits.length - 1);
}

function moveTrait(offset: -1 | 1): void {
  const index = selectedTraitIndex.value;
  if (index === null) return;
  const target = index + offset;
  if (target < 0 || target >= draft.value.traits.length) return;
  const traits = [...draft.value.traits];
  [traits[index], traits[target]] = [traits[target]!, traits[index]!];
  draft.value = { ...draft.value, traits };
  selectedSection.value = target;
}

function updateBaseAttack(index: number, event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;
  const values = [...draft.value.baseAttackAtLevelNodes];
  values[index] = value;
  draft.value = { ...draft.value, baseAttackAtLevelNodes: values };
}

function updateTrait(field: 'key' | 'levelCount', event: Event): void {
  const trait = selectedTrait.value;
  if (trait === undefined) return;
  const raw = (event.target as HTMLInputElement).value;
  const index = selectedTraitIndex.value;
  if (index === null) return;
  const traits = [...draft.value.traits];
  traits[index] = {
    ...trait,
    [field]: field === 'levelCount' ? Number(raw) : raw,
  };
  draft.value = { ...draft.value, traits };
}

function updateTraitContribution(contribution: EquipmentContributionDefinition): void {
  const index = selectedTraitIndex.value;
  const trait = selectedTrait.value;
  if (index === null || trait === undefined) return;
  const traits = [...draft.value.traits];
  traits[index] = { ...trait, ...contribution };
  draft.value = { ...draft.value, traits };
}

function save(): void {
  if (issues.value.length > 0) return;
  emit('save', clone(draft.value));
  emit('update:visible', false);
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    width="min(980px, calc(100vw - 48px))"
    append-to-body
    destroy-on-close
    class="weapon-definition-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <template #header>
      <div class="workspace-title">
        <div>
          <strong>自定义武器</strong><span>{{ draft.displayName ?? draft.slug }}</span>
        </div>
        <small>完整项目模板；所有引用此模板的武器实例共享定义。</small>
      </div>
    </template>

    <div class="weapon-workspace">
      <aside class="weapon-outliner">
        <button :class="{ active: selectedSection === 'base' }" @click="selectedSection = 'base'">
          <strong>基础与成长</strong><small>6 个等级节点</small>
        </button>
        <div class="outliner-caption">词条</div>
        <button class="add-entry" type="button" @click="addTrait">＋ 新增词条</button>
        <button
          v-for="(trait, index) in draft.traits"
          :key="`${trait.key}:${index}`"
          :class="{ active: selectedSection === index }"
          @click="selectedSection = index"
        >
          <strong>{{ trait.key }}</strong
          ><small>{{ trait.levelCount }} 级</small>
        </button>
      </aside>

      <main class="weapon-inspector">
        <section v-if="selectedSection === 'base'" class="definition-card">
          <header><strong>模板身份</strong><span>物化定义</span></header>
          <div class="field-grid">
            <label title="项目内稳定引用身份。创建模板时确定，修改会使既有实例失去引用。"
              >模板 ID<input :value="draft.slug" disabled
            /></label>
            <label
              >展示名称<input
                :value="draft.displayName ?? ''"
                @change="updateIdentity('displayName', $event)"
            /></label>
            <label title="继承内置武器图标和本地化文本时使用的资源身份。"
              >资源来源<input
                :value="draft.assetSlug ?? ''"
                @change="updateIdentity('assetSlug', $event)"
            /></label>
            <label title="由资源导出流程生成的 WebP 路径；留空时按资源来源回退。"
              >图标路径<input
                :value="draft.iconPath ?? ''"
                @change="updateIdentity('iconPath', $event)"
            /></label>
            <label
              >星级<select :value="draft.rarity" @change="updateIdentity('rarity', $event)">
                <option v-for="rarity in WEAPON_RARITIES" :key="rarity" :value="rarity">
                  {{ rarity }} ★
                </option>
              </select></label
            >
            <label
              >武器类型<select
                :value="draft.weaponType"
                @change="updateIdentity('weaponType', $event)"
              >
                <option v-for="type in OPERATOR_WEAPON_TYPES" :key="type" :value="type">
                  {{ type }}
                </option>
              </select></label
            >
          </div>
        </section>

        <section v-if="selectedSection === 'base'" class="definition-card">
          <header><strong>基础攻击成长</strong><span>严格六节点</span></header>
          <div class="attack-grid">
            <label v-for="(level, index) in LEVEL_NODES" :key="level">
              <span>Lv.{{ level }}</span>
              <input
                type="number"
                min="0"
                step="1"
                :value="draft.baseAttackAtLevelNodes[index]"
                @change="updateBaseAttack(index, $event)"
              />
            </label>
          </div>
        </section>

        <section v-if="selectedTrait" class="definition-card">
          <header>
            <strong>当前词条</strong><span>第 {{ (selectedTraitIndex ?? 0) + 1 }} 条</span>
          </header>
          <div class="object-actions">
            <button :disabled="selectedTraitIndex === 0" @click="moveTrait(-1)">上移</button>
            <button
              :disabled="selectedTraitIndex === draft.traits.length - 1"
              @click="moveTrait(1)"
            >
              下移
            </button>
            <span />
            <button class="danger" @click="removeTrait">删除词条</button>
          </div>
          <div class="field-grid">
            <label
              >稳定 key<input :value="selectedTrait.key" @change="updateTrait('key', $event)"
            /></label>
            <label
              >等级数量<input
                type="number"
                min="1"
                step="1"
                :value="selectedTrait.levelCount"
                @change="updateTrait('levelCount', $event)"
            /></label>
          </div>
          <div class="contribution-summary">
            <span>属性修正 {{ selectedTrait.modifiers?.length ?? 0 }}</span>
            <span>事件响应 {{ selectedTrait.eventHandlers?.length ?? 0 }}</span>
            <p>
              词条行为完整保留在模板中；下一层行为节点将在装备组件图中编辑，本页不会把它们展开成
              JSON 文本。
            </p>
          </div>
          <EquipmentContributionGraphEditor
            :contribution="selectedTrait"
            :label="selectedTrait.key"
            :level="selectedTrait.levelCount"
            @update="updateTraitContribution"
          />
        </section>
      </main>
    </div>

    <template #footer>
      <div class="workspace-footer">
        <details v-if="issues.length" class="issues">
          <summary>{{ issues.length }} 个结构问题</summary>
          <code v-for="issue in issues" :key="`${issue.path}:${issue.message}`"
            >{{ issue.path }} · {{ issue.message }}</code
          >
        </details>
        <span v-else class="valid">✓ 定义结构有效</span>
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('reset')">
          恢复游戏定义
        </button>
        <span class="spacer" />
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('update:visible', false)">
          取消
        </button>
        <button
          class="ea-btn ea-btn--sm ea-btn--glass-rect ea-btn--hover-gold-fill"
          :disabled="!isDirty || issues.length > 0"
          @click="save"
        >
          保存武器定义
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.workspace-title {
  display: grid;
  gap: 4px;
}
.workspace-title div {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.workspace-title strong {
  font-size: 19px;
}
.workspace-title span,
.workspace-title small {
  color: var(--ea-fg-muted);
}
.weapon-workspace {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  height: min(650px, calc(100vh - 210px));
  min-height: 480px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
}
.weapon-outliner {
  min-width: 0;
  padding: 12px;
  overflow: auto;
  border-right: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.weapon-outliner button {
  width: 100%;
  display: grid;
  gap: 3px;
  padding: 10px;
  border: 0;
  border-left: 3px solid transparent;
  background: transparent;
  color: var(--ea-fg-secondary);
  text-align: left;
  cursor: pointer;
}
.weapon-outliner button.active {
  border-left-color: var(--ea-gold);
  background: var(--ea-active-fill);
  color: var(--ea-fg);
}
.weapon-outliner small,
.outliner-caption {
  color: var(--ea-fg-muted);
  font-size: 10px;
}
.weapon-outliner .add-entry {
  color: var(--ea-gold);
  border: 1px dashed var(--ea-border);
  margin-bottom: 6px;
}
.outliner-caption {
  margin: 18px 10px 7px;
  font-weight: 700;
  text-transform: uppercase;
}
.weapon-inspector {
  min-width: 0;
  padding: 18px;
  overflow: auto;
  container-type: inline-size;
}
.definition-card {
  min-width: 0;
  margin-bottom: 16px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.definition-card header {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}
.definition-card header span {
  color: var(--ea-fg-muted);
  font-size: 10px;
}
.field-grid,
.attack-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  padding: 14px;
}
.attack-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
label {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(90px, 1fr) minmax(100px, 150px);
  align-items: center;
  gap: 10px;
  color: var(--ea-fg-muted);
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
.contribution-summary {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px;
}
.object-actions {
  display: flex;
  gap: 6px;
  padding: 10px 14px 0;
}
.object-actions span {
  flex: 1;
}
.object-actions button {
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg-secondary);
  cursor: pointer;
}
.object-actions button:disabled {
  opacity: 0.4;
  cursor: default;
}
.object-actions .danger {
  color: #e69a7a;
}
.contribution-summary > span {
  padding: 4px 7px;
  border: 1px solid var(--ea-border);
  color: var(--ea-fg-secondary);
}
.contribution-summary p {
  width: 100%;
  margin: 4px 0 0;
  color: var(--ea-fg-muted);
  line-height: 1.5;
}
.workspace-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.spacer {
  flex: 1;
}
.valid {
  color: #80bf93;
}
.issues {
  color: #e69a7a;
}
.issues code {
  display: block;
  max-width: 520px;
  padding: 4px;
  overflow-wrap: anywhere;
}
@container (max-width: 560px) {
  .field-grid,
  .attack-grid {
    grid-template-columns: 1fr;
  }
}
@container (max-width: 360px) {
  label {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}
@media (max-width: 720px) {
  .weapon-workspace {
    grid-template-columns: 1fr;
    height: auto;
  }
  .weapon-outliner {
    max-height: 180px;
    border-right: 0;
    border-bottom: 1px solid var(--ea-border-soft);
  }
  .weapon-inspector {
    max-height: 520px;
  }
}
</style>
