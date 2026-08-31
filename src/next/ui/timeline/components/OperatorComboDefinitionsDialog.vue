<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  COMBO_SKILL_CONDITION_EVENTS,
  COMBO_SKILL_PRIORITIES,
  DAMAGE_ELEMENTS,
  DAMAGE_TAGS,
  type ActionSequenceDefinition,
  type CombatCondition,
  type CombatStepDefinition,
  type ComboSkillConditionDefinition,
  type ComboSkillRegistrationDefinition,
  type ComboSkillTriggerRule,
} from '../../../core/game-data/operatorDefinition';
import {
  createSkillEditorStep,
  duplicateSkillEditorDetachedStep,
  type EditableCombatStepKind,
} from '../skillDefinitionEditorViewModel';
import ActionSequenceEditor from './ActionSequenceEditor.vue';
import CombatConditionEditor from './CombatConditionEditor.vue';
import SkillBlackboardEditor from './SkillBlackboardEditor.vue';

type Category = 'registrations' | 'conditions';
const props = defineProps<{
  visible: boolean;
  registrations?: readonly ComboSkillRegistrationDefinition[];
  conditions?: readonly ComboSkillConditionDefinition[];
  skillKeys: readonly string[];
  skillGroupKeys: readonly string[];
  skillLevel: number;
}>();
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  save: [
    value: {
      registrations?: readonly ComboSkillRegistrationDefinition[];
      conditions?: readonly ComboSkillConditionDefinition[];
    },
  ];
}>();
const category = ref<Category>('registrations');
const selectedIndex = ref(0);
const selectedRuleIndex = ref(0);
const registrations = ref<ComboSkillRegistrationDefinition[]>([]);
const conditions = ref<ComboSkillConditionDefinition[]>([]);
const selectedRegistration = computed(() =>
  category.value === 'registrations' ? registrations.value[selectedIndex.value] : undefined,
);
const selectedCondition = computed(() =>
  category.value === 'conditions' ? conditions.value[selectedIndex.value] : undefined,
);
const selectedRule = computed(() => selectedRegistration.value?.rules[selectedRuleIndex.value]);

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    registrations.value = [...structuredClone(props.registrations ?? [])];
    conditions.value = [...structuredClone(props.conditions ?? [])];
    category.value = 'registrations';
    selectedIndex.value = 0;
    selectedRuleIndex.value = 0;
  },
  { immediate: true },
);
function syntheticSkill() {
  return {
    key: 'operator-combo-condition',
    timelineBlockFrames: 0,
    scheduledSequences: [
      { startFrame: 0, sequence: selectedCondition.value?.sequence ?? { steps: [] } },
    ],
  };
}
function createStep(kind: EditableCombatStepKind): CombatStepDefinition {
  return createSkillEditorStep(syntheticSkill(), kind);
}
function duplicateStep(step: CombatStepDefinition): CombatStepDefinition {
  return duplicateSkillEditorDetachedStep(syntheticSkill(), step);
}
function defaultRule(
  kind: ComboSkillTriggerRule['trigger']['kind'] = 'damageTagHit',
): ComboSkillTriggerRule {
  if (kind === 'elementalInflictionApplied')
    return { trigger: { kind, elements: DAMAGE_ELEMENTS[0], scope: 'team' } };
  if (kind === 'physicalInflictionApplied')
    return { trigger: { kind, types: 'airborne', scope: 'team' } };
  return { trigger: { kind: 'damageTagHit', tag: DAMAGE_TAGS[0], scope: 'team' } };
}
function addItem(): void {
  if (category.value === 'registrations') {
    const next = [
      ...registrations.value,
      { skillKey: props.skillKeys[0] ?? '', priority: 'default' as const, rules: [defaultRule()] },
    ];
    registrations.value = next;
    selectedIndex.value = next.length - 1;
    selectedRuleIndex.value = 0;
    return;
  }
  const keys = new Set(conditions.value.map(value => value.key));
  let index = 1;
  while (keys.has(`custom-combo-condition-${index}`)) index += 1;
  const next = [
    ...conditions.value,
    {
      key: `custom-combo-condition-${index}`,
      skillGroupKey: props.skillGroupKeys[0] ?? '',
      event: COMBO_SKILL_CONDITION_EVENTS[0],
      initialValues: {},
      sequence: { steps: [] },
    },
  ];
  conditions.value = next;
  selectedIndex.value = next.length - 1;
}
function updateRegistration(value: ComboSkillRegistrationDefinition): void {
  const next = [...registrations.value];
  next[selectedIndex.value] = value;
  registrations.value = next;
}
function updateCondition(value: ComboSkillConditionDefinition): void {
  const next = [...conditions.value];
  next[selectedIndex.value] = value;
  conditions.value = next;
}
function updateRule(value: ComboSkillTriggerRule): void {
  if (!selectedRegistration.value) return;
  const rules = [...selectedRegistration.value.rules];
  rules[selectedRuleIndex.value] = value;
  updateRegistration({ ...selectedRegistration.value, rules });
}
function updateRuleKind(event: Event): void {
  updateRule(
    defaultRule(
      (event.target as HTMLSelectElement).value as ComboSkillTriggerRule['trigger']['kind'],
    ),
  );
}
function patchTrigger(values: Record<string, unknown>): void {
  if (selectedRule.value)
    updateRule({
      ...selectedRule.value,
      trigger: { ...selectedRule.value.trigger, ...values } as ComboSkillTriggerRule['trigger'],
    });
}
function updateRuleCondition(condition: CombatCondition): void {
  if (selectedRule.value) updateRule({ ...selectedRule.value, condition });
}
function removeRuleCondition(): void {
  if (!selectedRule.value) return;
  const { condition: _removed, ...next } = selectedRule.value;
  updateRule(next);
}
function addRule(): void {
  if (!selectedRegistration.value) return;
  const rules = [...selectedRegistration.value.rules, defaultRule()];
  updateRegistration({ ...selectedRegistration.value, rules });
  selectedRuleIndex.value = rules.length - 1;
}
function removeRule(): void {
  if (!selectedRegistration.value) return;
  const rules = selectedRegistration.value.rules.filter(
    (_, index) => index !== selectedRuleIndex.value,
  );
  updateRegistration({ ...selectedRegistration.value, rules });
  selectedRuleIndex.value = Math.max(0, Math.min(selectedRuleIndex.value, rules.length - 1));
}
function moveRule(offset: -1 | 1): void {
  if (!selectedRegistration.value) return;
  const rules = [...selectedRegistration.value.rules];
  const target = selectedRuleIndex.value + offset;
  if (target < 0 || target >= rules.length) return;
  [rules[selectedRuleIndex.value], rules[target]] = [
    rules[target]!,
    rules[selectedRuleIndex.value]!,
  ];
  updateRegistration({ ...selectedRegistration.value, rules });
  selectedRuleIndex.value = target;
}
function updateRegistrationBlackboard(
  field: 'blackboard' | 'invalidCastBlackboard',
  value: Readonly<Record<string, number | readonly number[]>>,
): void {
  if (!selectedRegistration.value) return;
  updateRegistration({
    ...selectedRegistration.value,
    [field]: Object.keys(value).length ? value : undefined,
  });
}
function updateRuleBlackboard(value: Readonly<Record<string, number | readonly number[]>>): void {
  if (selectedRule.value)
    updateRule({
      ...selectedRule.value,
      blackboard: Object.keys(value).length ? value : undefined,
    });
}
function updateConditionSequence(sequence: ActionSequenceDefinition): void {
  if (selectedCondition.value) updateCondition({ ...selectedCondition.value, sequence });
}
function addInitialValue(): void {
  if (!selectedCondition.value) return;
  const values = { ...(selectedCondition.value.initialValues ?? {}) };
  let index = 1;
  while (`value${index}` in values) index += 1;
  values[`value${index}`] = 0;
  updateCondition({ ...selectedCondition.value, initialValues: values });
}
function renameInitialValue(oldKey: string, event: Event): void {
  if (!selectedCondition.value?.initialValues) return;
  const key = (event.target as HTMLInputElement).value.trim();
  if (!key || (key !== oldKey && key in selectedCondition.value.initialValues)) return;
  updateCondition({
    ...selectedCondition.value,
    initialValues: Object.fromEntries(
      Object.entries(selectedCondition.value.initialValues).map(([entryKey, value]) => [
        entryKey === oldKey ? key : entryKey,
        value,
      ]),
    ),
  });
}
function updateInitialValue(key: string, event: Event): void {
  if (!selectedCondition.value?.initialValues) return;
  const raw = (event.target as HTMLInputElement).value;
  const current = selectedCondition.value.initialValues[key];
  const value =
    current === null
      ? null
      : typeof current === 'number' && Number.isFinite(Number(raw))
        ? Number(raw)
        : raw;
  updateCondition({
    ...selectedCondition.value,
    initialValues: { ...selectedCondition.value.initialValues, [key]: value },
  });
}
function cycleInitialValueType(key: string): void {
  if (!selectedCondition.value?.initialValues) return;
  const current = selectedCondition.value.initialValues[key];
  const value = current === null ? 0 : typeof current === 'number' ? String(current) : null;
  updateCondition({
    ...selectedCondition.value,
    initialValues: { ...selectedCondition.value.initialValues, [key]: value },
  });
}
function removeInitialValue(key: string): void {
  if (!selectedCondition.value?.initialValues) return;
  const values = { ...selectedCondition.value.initialValues };
  delete values[key];
  updateCondition({ ...selectedCondition.value, initialValues: values });
}
function moveItem(offset: -1 | 1): void {
  const source =
    category.value === 'registrations' ? [...registrations.value] : [...conditions.value];
  const target = selectedIndex.value + offset;
  if (target < 0 || target >= source.length) return;
  [source[selectedIndex.value], source[target]] = [source[target]!, source[selectedIndex.value]!];
  if (category.value === 'registrations')
    registrations.value = source as ComboSkillRegistrationDefinition[];
  else conditions.value = source as ComboSkillConditionDefinition[];
  selectedIndex.value = target;
}
function removeItem(): void {
  if (category.value === 'registrations')
    registrations.value = registrations.value.filter((_, index) => index !== selectedIndex.value);
  else conditions.value = conditions.value.filter((_, index) => index !== selectedIndex.value);
  selectedIndex.value = Math.max(0, selectedIndex.value - 1);
  selectedRuleIndex.value = 0;
}
function save(): void {
  emit('save', {
    registrations: registrations.value.length ? structuredClone(registrations.value) : undefined,
    conditions: conditions.value.length ? structuredClone(conditions.value) : undefined,
  });
  emit('update:visible', false);
}
</script>

<template>
  <section v-if="visible" class="embedded-editor">
    <div class="embedded-header">
      <div class="title">
        <strong>角色级连携定义</strong><small>首段连携注册与附着事件常驻条件是两套不同协议。</small>
      </div>
    </div>
    <div class="workspace">
      <aside>
        <div class="tabs">
          <button
            :class="{ active: category === 'registrations' }"
            @click="
              category = 'registrations';
              selectedIndex = 0;
            "
          >
            连携注册</button
          ><button
            :class="{ active: category === 'conditions' }"
            @click="
              category = 'conditions';
              selectedIndex = 0;
            "
          >
            附着事件条件
          </button>
        </div>
        <button class="add" @click="addItem">＋ 新增</button
        ><button
          v-for="(item, index) in category === 'registrations' ? registrations : conditions"
          :key="index"
          :class="{ active: selectedIndex === index }"
          @click="
            selectedIndex = index;
            selectedRuleIndex = 0;
          "
        >
          {{ 'skillKey' in item ? item.skillKey : item.key }}
        </button>
      </aside>
      <main v-if="selectedRegistration || selectedCondition">
        <header>
          <div>
            <strong>{{ selectedRegistration ? '连携入口注册' : '附着事件常驻条件' }}</strong
            ><small>{{
              selectedRegistration
                ? '条件命中后创建待释放候选或立即释放'
                : '独立于技能块和普通语义连携'
            }}</small>
          </div>
          <div class="actions">
            <button :disabled="selectedIndex === 0" @click="moveItem(-1)">上移</button
            ><button
              :disabled="
                selectedIndex ===
                (category === 'registrations' ? registrations.length : conditions.length) - 1
              "
              @click="moveItem(1)"
            >
              下移</button
            ><button class="danger" @click="removeItem">删除</button>
          </div>
        </header>
        <template v-if="selectedRegistration">
          <div class="fields">
            <label
              >待释放技能<select
                :value="selectedRegistration.skillKey"
                @change="
                  updateRegistration({
                    ...selectedRegistration,
                    skillKey: ($event.target as HTMLSelectElement).value,
                  })
                "
              >
                <option v-for="key in skillKeys" :key="key" :value="key">{{ key }}</option>
              </select></label
            ><label
              >候选目标优先级<select
                :value="selectedRegistration.priority"
                @change="
                  updateRegistration({
                    ...selectedRegistration,
                    priority: ($event.target as HTMLSelectElement)
                      .value as ComboSkillRegistrationDefinition['priority'],
                  })
                "
              >
                <option v-for="value in COMBO_SKILL_PRIORITIES" :key="value" :value="value">
                  {{ value }}
                </option>
              </select></label
            >
          </div>
          <div class="blackboards">
            <SkillBlackboardEditor
              :blackboard="selectedRegistration.blackboard ?? {}"
              :skill-level="skillLevel"
              @update="updateRegistrationBlackboard('blackboard', $event)"
            /><SkillBlackboardEditor
              :blackboard="selectedRegistration.invalidCastBlackboard ?? {}"
              :skill-level="skillLevel"
              @update="updateRegistrationBlackboard('invalidCastBlackboard', $event)"
            />
          </div>
          <section class="rules">
            <header><strong>触发规则</strong><button @click="addRule">＋ 添加规则</button></header>
            <div class="rule-tabs">
              <button
                v-for="(rule, index) in selectedRegistration.rules"
                :key="index"
                :class="{ active: selectedRuleIndex === index }"
                @click="selectedRuleIndex = index"
              >
                {{ index + 1 }} · {{ rule.trigger.kind }}
              </button>
            </div>
            <template v-if="selectedRule"
              ><div class="actions">
                <button :disabled="selectedRuleIndex === 0" @click="moveRule(-1)">上移</button
                ><button
                  :disabled="selectedRuleIndex === selectedRegistration.rules.length - 1"
                  @click="moveRule(1)"
                >
                  下移</button
                ><button class="danger" @click="removeRule">删除规则</button>
              </div>
              <div class="fields">
                <label
                  >事件类型<select :value="selectedRule.trigger.kind" @change="updateRuleKind">
                    <option value="damageTagHit">伤害标签命中</option>
                    <option value="elementalInflictionApplied">元素附着生效</option>
                    <option value="physicalInflictionApplied">物理异常生效</option>
                  </select></label
                ><label
                  >来源范围<select
                    :value="selectedRule.trigger.scope"
                    @change="patchTrigger({ scope: ($event.target as HTMLSelectElement).value })"
                  >
                    <option value="operator">当前干员</option>
                    <option value="team">全队</option>
                  </select></label
                ><label v-if="selectedRule.trigger.kind === 'damageTagHit'"
                  >伤害标签<select
                    :value="selectedRule.trigger.tag"
                    @change="patchTrigger({ tag: ($event.target as HTMLSelectElement).value })"
                  >
                    <option v-for="value in DAMAGE_TAGS" :key="value" :value="value">
                      {{ value }}
                    </option>
                  </select></label
                ><label v-if="selectedRule.trigger.kind === 'elementalInflictionApplied'"
                  >元素<select
                    :value="
                      Array.isArray(selectedRule.trigger.elements)
                        ? selectedRule.trigger.elements[0]
                        : selectedRule.trigger.elements
                    "
                    @change="patchTrigger({ elements: ($event.target as HTMLSelectElement).value })"
                  >
                    <option v-for="value in DAMAGE_ELEMENTS" :key="value" :value="value">
                      {{ value }}
                    </option>
                  </select></label
                ><label v-if="selectedRule.trigger.kind === 'physicalInflictionApplied'"
                  >异常<select
                    :value="
                      Array.isArray(selectedRule.trigger.types)
                        ? selectedRule.trigger.types[0]
                        : selectedRule.trigger.types
                    "
                    @change="patchTrigger({ types: ($event.target as HTMLSelectElement).value })"
                  >
                    <option value="airborne">浮空</option>
                    <option value="knockDown">倒地</option>
                    <option value="fracture">破防</option>
                    <option value="crush">击碎</option>
                  </select></label
                ><label
                  ><input
                    type="checkbox"
                    :checked="selectedRule.castImmediately === true"
                    @change="
                      updateRule({
                        ...selectedRule,
                        castImmediately: ($event.target as HTMLInputElement).checked || undefined,
                      })
                    "
                  />
                  条件命中后立即尝试释放</label
                >
              </div>
              <SkillBlackboardEditor
                :blackboard="selectedRule.blackboard ?? {}"
                :skill-level="skillLevel"
                @update="updateRuleBlackboard" />
              <section class="condition">
                <header>
                  <strong>额外战斗条件</strong
                  ><button v-if="selectedRule.condition" @click="removeRuleCondition">移除</button
                  ><button v-else @click="updateRuleCondition({ kind: 'combatActive' })">
                    ＋ 添加条件
                  </button>
                </header>
                <CombatConditionEditor
                  v-if="selectedRule.condition"
                  :condition="selectedRule.condition"
                  @update="updateRuleCondition"
                /></section
            ></template>
          </section>
        </template>
        <template v-else-if="selectedCondition"
          ><div class="fields">
            <label
              >稳定 key<input
                :value="selectedCondition.key"
                @change="
                  updateCondition({
                    ...selectedCondition,
                    key: ($event.target as HTMLInputElement).value,
                  })
                " /></label
            ><label
              >绑定技能组<select
                :value="selectedCondition.skillGroupKey"
                @change="
                  updateCondition({
                    ...selectedCondition,
                    skillGroupKey: ($event.target as HTMLSelectElement).value,
                  })
                "
              >
                <option v-for="key in skillGroupKeys" :key="key" :value="key">{{ key }}</option>
              </select></label
            ><label
              >监听附着边沿<select
                :value="selectedCondition.event"
                @change="
                  updateCondition({
                    ...selectedCondition,
                    event: ($event.target as HTMLSelectElement)
                      .value as ComboSkillConditionDefinition['event'],
                  })
                "
              >
                <option v-for="value in COMBO_SKILL_CONDITION_EVENTS" :key="value" :value="value">
                  {{ value }}
                </option>
              </select></label
            ><label
              ><input
                type="checkbox"
                :checked="selectedCondition.initialValues !== null"
                @change="
                  updateCondition({
                    ...selectedCondition,
                    initialValues: ($event.target as HTMLInputElement).checked ? {} : null,
                  })
                "
              />
              启用此常驻条件</label
            >
          </div>
          <section v-if="selectedCondition.initialValues !== null" class="literal-board">
            <header>
              <strong>每次注册复制的字面黑板</strong
              ><button @click="addInitialValue">＋ 添加</button>
            </header>
            <div
              v-for="([key, value], index) in Object.entries(selectedCondition.initialValues)"
              :key="`${key}:${index}`"
              class="literal-row"
            >
              <input :value="key" @change="renameInitialValue(key, $event)" /><input
                :value="value ?? ''"
                :disabled="value === null"
                @change="updateInitialValue(key, $event)"
              /><button @click="cycleInitialValueType(key)">
                {{ value === null ? '空值' : typeof value === 'number' ? '数值' : '文本' }}</button
              ><button class="danger" @click="removeInitialValue(key)">×</button>
            </div>
          </section>
          <ActionSequenceEditor
            :sequence="selectedCondition.sequence"
            :skill-level="skillLevel"
            :create-step="createStep"
            :duplicate-step="duplicateStep"
            @update="updateConditionSequence"
        /></template>
      </main>
      <main v-else class="empty">当前分类还没有定义。</main>
    </div>
    <div class="embedded-footer">
      <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('update:visible', false)">
        取消</button
      ><button class="ea-btn ea-btn--sm ea-btn--glass-rect ea-btn--hover-gold-fill" @click="save">
        保存连携定义
      </button>
    </div>
  </section>
</template>

<style scoped>
.title {
  display: grid;
  gap: 4px;
}
.embedded-editor {
  min-width: 0;
}
.embedded-header,
.embedded-footer {
  padding: 10px 0;
}
.embedded-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.title small,
header small,
label small {
  color: var(--ea-fg-muted);
}
.workspace {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  min-height: min(720px, calc(100vh - 190px));
  border: 1px solid var(--ea-border-soft);
}
aside {
  padding: 12px;
  overflow: auto;
  border-right: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
aside button {
  width: 100%;
  padding: 9px;
  border: 0;
  border-left: 3px solid transparent;
  background: transparent;
  color: var(--ea-fg-secondary);
  text-align: left;
  cursor: pointer;
}
aside button.active {
  border-left-color: var(--ea-gold);
  background: var(--ea-active-fill);
  color: var(--ea-gold);
}
.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}
.tabs button {
  border: 1px solid var(--ea-border);
  text-align: center;
}
aside .add {
  margin: 9px 0;
  border: 1px dashed var(--ea-border);
}
main {
  min-width: 0;
  padding: 16px;
  overflow: auto;
}
main > header,
.rules > header,
.condition > header,
.literal-board > header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}
main > header > div:first-child {
  display: grid;
  gap: 3px;
}
.actions,
.rule-tabs {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.actions button,
.rule-tabs button,
.rules header button,
.condition header button,
.literal-board button {
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg-secondary);
}
.actions .danger,
.literal-row .danger {
  color: #e69a7a;
}
.actions button:disabled {
  opacity: 0.4;
}
.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}
label {
  display: grid;
  gap: 6px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
input,
select {
  min-width: 0;
  height: 32px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
.blackboards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.rules,
.condition,
.literal-board {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--ea-border-soft);
}
.rule-tabs button {
  padding: 6px;
}
.rule-tabs button.active {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}
.literal-row {
  display: grid;
  grid-template-columns: 1fr 1fr 60px 30px;
  gap: 5px;
  margin: 6px 0;
}
.empty {
  display: grid;
  place-items: center;
  color: var(--ea-fg-muted);
}
@media (max-width: 800px) {
  .workspace {
    grid-template-columns: 1fr;
  }
  aside {
    max-height: 180px;
    border-right: 0;
    border-bottom: 1px solid var(--ea-border-soft);
  }
  .blackboards,
  .fields {
    grid-template-columns: 1fr;
  }
}
</style>
