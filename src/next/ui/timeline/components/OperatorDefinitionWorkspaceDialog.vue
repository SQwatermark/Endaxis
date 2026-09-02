<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  COMPARISON_OPERATORS,
  COMBAT_RESOURCES,
  DAMAGE_ELEMENTS,
  DEFAULT_TRUST_ATTRIBUTE_BONUS,
  OPERATOR_ATTRIBUTES,
  OPERATOR_RARITIES,
  OPERATOR_ROLES,
  OPERATOR_WEAPON_TYPES,
  UPGRADE_MODIFIER_KINDS,
  SKILL_LEVEL_SOURCES,
  SKILL_TYPES,
  type CombatStepDefinition,
  type OperatorAbilityEntityDefinitions,
  type OperatorDefinition,
  type OperatorUpgradeDefinition,
  type UpgradeModifierDefinition,
  type SkillDefinition,
  type SkillGroupDefinition,
} from '../../../core/game-data/operatorDefinition';
import { listOperatorSkillDefinitionBindings } from '../../../core/game-data/operatorSkillDefinitions';
import { validateSkillDefinition } from '../../../core/game-data/validateSkillDefinition';
import type { ValidationIssue } from '../../../core/project/validation';
import {
  collectOperatorDefinitionReferences,
  referencesToDefinition,
  type OperatorDefinitionReference,
} from '../operatorDefinitionReferences';
import AbilityEntityDefinitionsDialog from './AbilityEntityDefinitionsDialog.vue';
import BuffDefinitionGraphEditor from './BuffDefinitionGraphEditor.vue';
import SkillDefinitionEditorDialog from './SkillDefinitionEditorDialog.vue';
import OperatorRuntimeBehaviorDialog from './OperatorRuntimeBehaviorDialog.vue';
import OperatorUpgradeModifierEditor from './OperatorUpgradeModifierEditor.vue';
import OperatorUpgradeBehaviorDialog from './OperatorUpgradeBehaviorDialog.vue';
import OperatorComboDefinitionsDialog from './OperatorComboDefinitionsDialog.vue';

type Section = 'panel' | 'skills' | 'progression' | 'runtime' | 'buffs' | 'entities';
type BuffStep = Extract<CombatStepDefinition, { kind: 'applyBuff' }>;
const PANEL_ATTRIBUTE_KEYS: readonly (keyof OperatorDefinition['attributes'])[] = [
  ...OPERATOR_ATTRIBUTES,
  'baseAttack',
  'baseHealth',
];
const ATTRIBUTE_LABELS: Readonly<Record<keyof OperatorDefinition['attributes'], string>> = {
  strength: '力量',
  agility: '敏捷',
  intellect: '智识',
  will: '意志',
  baseAttack: '基础攻击',
  baseHealth: '基础生命',
};
const TRUST_ATTRIBUTE_OPTIONS = [...OPERATOR_ATTRIBUTES, 'main', 'secondary'] as const;

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
const showRuntimeBehaviorEditor = ref(false);
const showUpgradeBehaviorEditor = ref(false);
const showComboEditor = ref(false);
const referencedEntityId = ref('');
const objectSearch = ref('');
const showProblems = ref(false);
const progressionKind = ref<'talents' | 'potentials'>('talents');
const selectedUpgradeIndex = ref(0);
const selectedModifierIndex = ref(0);
const newModifierKind = ref<UpgradeModifierDefinition['kind']>('patchSkillBlackboard');

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
    progressionKind.value = 'talents';
    selectedUpgradeIndex.value = 0;
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
  listOperatorSkillDefinitionBindings(draft.value).flatMap(({ group, skill, origin, variant }) => {
    const groupIndex = draft.value.skillGroups.indexOf(group);
    const path =
      origin === 'base'
        ? `skillGroups[${groupIndex}].skills`
        : origin === 'variant'
          ? `skillGroups[${groupIndex}].variants[${group.variants?.indexOf(variant!) ?? -1}].skills`
          : origin === 'replacement'
            ? `skillGroups[${groupIndex}].replacementSkills`
            : `skillGroups[${groupIndex}].routedReplacementSkills`;
    return validateSkillDefinition(skill, `${path}['${skill.key}']`);
  }),
);
const selectedUpgrades = computed(() => draft.value[progressionKind.value]);
const selectedUpgrade = computed(() => selectedUpgrades.value[selectedUpgradeIndex.value]);
const entityBlackboardEntries = computed(() => Object.entries(draft.value.entityBlackboard ?? {}));
const selectedUpgradeModifier = computed(
  () => selectedUpgrade.value?.modifiers?.[selectedModifierIndex.value],
);
const skillGroupKeys = computed(() => draft.value.skillGroups.map(group => group.key));
const comboSkillKeys = computed(() =>
  listOperatorSkillDefinitionBindings(draft.value)
    .filter(({ skill }) => skill.skillType === 'comboSkill')
    .map(({ skill }) => skill.key)
    .filter((key, index, keys) => keys.indexOf(key) === index),
);
const passiveSkillKeys = computed(() => [
  ...(draft.value.passiveSkills ?? []).map(passive => passive.key),
  ...(selectedUpgrade.value?.passiveSkills ?? []).map(passive => passive.key),
]);
const definitionReferences = computed(() => collectOperatorDefinitionReferences(draft.value));
const selectedBuffReferences = computed(() =>
  referencesToDefinition(definitionReferences.value, 'buff', selectedBuffId.value),
);
const isDirty = computed(
  () =>
    JSON.stringify(draft.value) !== JSON.stringify(props.customDefinition ?? props.baseDefinition),
);
const sectionLabel = computed(() => {
  if (section.value === 'panel') return '基础面板';
  if (section.value === 'skills') return '技能与技能组';
  if (section.value === 'progression') return '天赋与潜能';
  if (section.value === 'runtime') return '角色级运行数据';
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

function setTrustMode(custom: boolean): void {
  draft.value = {
    ...draft.value,
    trustAttributeBonus: custom ? clone(DEFAULT_TRUST_ATTRIBUTE_BONUS) : undefined,
  };
}

function updateTrustValues(event: Event): void {
  const tokens = (event.target as HTMLInputElement).value.split(',').map(value => value.trim());
  const values = tokens.map(Number);
  if (tokens.some(value => value === '') || values.some(value => !Number.isFinite(value))) return;
  draft.value = {
    ...draft.value,
    trustAttributeBonus: {
      ...(draft.value.trustAttributeBonus ?? DEFAULT_TRUST_ATTRIBUTE_BONUS),
      values,
    },
  };
}

function toggleTrustAttribute(attribute: (typeof TRUST_ATTRIBUTE_OPTIONS)[number]): void {
  const current = draft.value.trustAttributeBonus ?? DEFAULT_TRUST_ATTRIBUTE_BONUS;
  const attributes = current.attributes.includes(attribute as never)
    ? current.attributes.filter(value => value !== attribute)
    : [...current.attributes, attribute];
  if (attributes.length === 0) return;
  draft.value = { ...draft.value, trustAttributeBonus: { ...current, attributes } };
}

function replaceUpgrades(
  kind: 'talents' | 'potentials',
  upgrades: readonly OperatorUpgradeDefinition[],
): void {
  draft.value = { ...draft.value, [kind]: upgrades };
}

function addUpgrade(): void {
  const upgrades = [...selectedUpgrades.value];
  const keys = new Set(upgrades.map(upgrade => upgrade.key));
  const base = progressionKind.value === 'talents' ? 'custom-talent' : 'custom-potential';
  let index = 1;
  while (keys.has(`${base}-${index}`)) index += 1;
  upgrades.push({ key: `${base}-${index}`, levels: 1 });
  replaceUpgrades(progressionKind.value, upgrades);
  selectedUpgradeIndex.value = upgrades.length - 1;
}

function updateUpgrade(field: 'key' | 'levels' | 'simulationNoEffect', event: Event): void {
  const upgrade = selectedUpgrade.value;
  if (upgrade === undefined) return;
  const raw = (event.target as HTMLInputElement | HTMLSelectElement).value;
  const next = { ...upgrade };
  if (field === 'simulationNoEffect') {
    if (raw === '') delete next.simulationNoEffect;
    else
      next.simulationNoEffect = raw as NonNullable<OperatorUpgradeDefinition['simulationNoEffect']>;
  } else if (field === 'levels') next.levels = Number(raw);
  else next.key = raw;
  const upgrades = [...selectedUpgrades.value];
  upgrades[selectedUpgradeIndex.value] = next;
  replaceUpgrades(progressionKind.value, upgrades);
}

function removeUpgrade(): void {
  if (selectedUpgrade.value === undefined) return;
  const upgrades = selectedUpgrades.value.filter(
    (_, index) => index !== selectedUpgradeIndex.value,
  );
  replaceUpgrades(progressionKind.value, upgrades);
  selectedUpgradeIndex.value = Math.max(
    0,
    Math.min(selectedUpgradeIndex.value, upgrades.length - 1),
  );
}

function moveUpgrade(offset: -1 | 1): void {
  const source = selectedUpgradeIndex.value;
  const target = source + offset;
  const upgrades = [...selectedUpgrades.value];
  if (target < 0 || target >= upgrades.length) return;
  [upgrades[source], upgrades[target]] = [upgrades[target]!, upgrades[source]!];
  replaceUpgrades(progressionKind.value, upgrades);
  selectedUpgradeIndex.value = target;
}

function createUpgradeModifier(kind: UpgradeModifierDefinition['kind']): UpgradeModifierDefinition {
  const skillGroupKey = skillGroupKeys.value[0] ?? '';
  switch (kind) {
    case 'addConditionalDamage':
      return { kind, condition: { kind: 'combatActive' }, values: 0 };
    case 'enableSkillBranch':
      return { kind, skillGroupKey, branchKey: 'branch' };
    case 'multiplyEffectDuration':
      return { kind, skillGroupKey, stepKey: 'step', multiplier: 1 };
    case 'multiplySkillCost':
      return { kind, skillGroupKey, resource: COMBAT_RESOURCES[0], multiplier: 1 };
    case 'setEffectiveness':
      return { kind, skillGroupKey, stepKey: 'step', value: 0 };
    case 'addStaticDamageIncrease':
      return { kind, target: 'normalAttack', value: 0 };
    case 'addStaticHealingIncrease':
      return { kind, target: 'output', value: 0 };
    case 'addSkillStat':
      return { kind, skillGroupKey, stat: 'criticalRate', value: 0 };
    case 'patchSkillBlackboard':
      return { kind, skillGroupKey, blackboardKey: 'value', operation: 'add', value: 0 };
    case 'patchPassiveBlackboard':
      return {
        kind,
        passiveSkillKey: passiveSkillKeys.value[0] ?? '',
        blackboardKey: 'value',
        operation: 'add',
        value: 0,
      };
    case 'multiplySkillDamage':
      return { kind, skillGroupKey, multiplier: 1 };
    case 'multiplyStepDamage':
      return { kind, skillGroupKey, stepKey: 'step', multiplier: 1 };
    case 'multiplySkillCooldown':
      return { kind, skillGroupKey, multiplier: 1 };
    case 'addSkillCooldownFrames':
      return { kind, skillGroupKey, frames: 0 };
    case 'addBuildAttribute':
      return { kind, attributes: ['strength'], value: 0 };
    case 'modifyBasePanelStat':
      return { kind, stat: 'health', operation: 'flat', value: 0 };
    case 'addReactionDuration':
      return { kind, reaction: 'electrification', seconds: 0 };
    case 'addReactionEffectiveness':
      return { kind, reaction: 'electrification', value: 0 };
  }
}

function addUpgradeModifier(): void {
  const upgrade = selectedUpgrade.value;
  if (upgrade === undefined) return;
  const modifiers = [...(upgrade.modifiers ?? []), createUpgradeModifier(newModifierKind.value)];
  updateSelectedUpgradeDefinition({ ...upgrade, modifiers });
  selectedModifierIndex.value = modifiers.length - 1;
}

function updateSelectedUpgradeDefinition(upgrade: OperatorUpgradeDefinition): void {
  const upgrades = [...selectedUpgrades.value];
  upgrades[selectedUpgradeIndex.value] = upgrade;
  replaceUpgrades(progressionKind.value, upgrades);
}

function saveUpgradeBehavior(upgrade: OperatorUpgradeDefinition): void {
  updateSelectedUpgradeDefinition(upgrade);
  showUpgradeBehaviorEditor.value = false;
}

function updateUpgradeModifier(modifier: UpgradeModifierDefinition): void {
  const upgrade = selectedUpgrade.value;
  if (upgrade === undefined) return;
  const modifiers = [...(upgrade.modifiers ?? [])];
  modifiers[selectedModifierIndex.value] = modifier;
  updateSelectedUpgradeDefinition({ ...upgrade, modifiers });
}

function moveUpgradeModifier(offset: -1 | 1): void {
  const upgrade = selectedUpgrade.value;
  if (upgrade === undefined) return;
  const modifiers = [...(upgrade.modifiers ?? [])];
  const target = selectedModifierIndex.value + offset;
  if (target < 0 || target >= modifiers.length) return;
  [modifiers[selectedModifierIndex.value], modifiers[target]] = [
    modifiers[target]!,
    modifiers[selectedModifierIndex.value]!,
  ];
  updateSelectedUpgradeDefinition({ ...upgrade, modifiers });
  selectedModifierIndex.value = target;
}

function removeUpgradeModifier(): void {
  const upgrade = selectedUpgrade.value;
  if (upgrade === undefined) return;
  const modifiers = (upgrade.modifiers ?? []).filter(
    (_, index) => index !== selectedModifierIndex.value,
  );
  const next = { ...upgrade, modifiers: modifiers.length === 0 ? undefined : modifiers };
  updateSelectedUpgradeDefinition(next);
  selectedModifierIndex.value = Math.max(
    0,
    Math.min(selectedModifierIndex.value, modifiers.length - 1),
  );
}

function addEntityBlackboardEntry(): void {
  const values = { ...(draft.value.entityBlackboard ?? {}) };
  let index = 1;
  while (`EntityBB_custom_${index}` in values) index += 1;
  values[`EntityBB_custom_${index}`] = 0;
  draft.value = { ...draft.value, entityBlackboard: values };
}

function renameEntityBlackboardEntry(oldKey: string, event: Event): void {
  const key = (event.target as HTMLInputElement).value.trim();
  if (key === '' || (key !== oldKey && key in (draft.value.entityBlackboard ?? {}))) return;
  const values = Object.fromEntries(
    entityBlackboardEntries.value.map(([entryKey, value]) => [
      entryKey === oldKey ? key : entryKey,
      value,
    ]),
  );
  draft.value = { ...draft.value, entityBlackboard: values };
}

function updateEntityBlackboardEntry(key: string, event: Event): void {
  const raw = (event.target as HTMLInputElement).value;
  const current = draft.value.entityBlackboard?.[key];
  const value =
    typeof current === 'number' && raw.trim() !== '' && Number.isFinite(Number(raw))
      ? Number(raw)
      : raw;
  draft.value = {
    ...draft.value,
    entityBlackboard: { ...(draft.value.entityBlackboard ?? {}), [key]: value },
  };
}

function toggleEntityBlackboardEntryType(key: string): void {
  const current = draft.value.entityBlackboard?.[key];
  if (current === undefined) return;
  const value =
    typeof current === 'number'
      ? String(current)
      : Number.isFinite(Number(current))
        ? Number(current)
        : 0;
  draft.value = {
    ...draft.value,
    entityBlackboard: { ...(draft.value.entityBlackboard ?? {}), [key]: value },
  };
}

function removeEntityBlackboardEntry(key: string): void {
  const values = { ...(draft.value.entityBlackboard ?? {}) };
  delete values[key];
  draft.value = {
    ...draft.value,
    entityBlackboard: Object.keys(values).length === 0 ? undefined : values,
  };
}

function addEntityBlackboardInitializer(): void {
  const entries = [...(draft.value.entityBlackboardInitializers ?? [])];
  const keys = new Set(entries.map(entry => entry.key));
  let index = 1;
  while (keys.has(`EntityBB_custom_${index}`)) index += 1;
  entries.push({
    key: `EntityBB_custom_${index}`,
    condition: {
      kind: 'deckAttributeCompare',
      left: 'strength',
      operator: 'equal',
      right: 'strength',
    },
    trueValue: 1,
    falseValue: 0,
  });
  draft.value = { ...draft.value, entityBlackboardInitializers: entries };
}

function updateEntityBlackboardInitializer(
  index: number,
  field: 'key' | 'left' | 'operator' | 'right' | 'trueValue' | 'falseValue',
  event: Event,
): void {
  const entries = [...(draft.value.entityBlackboardInitializers ?? [])];
  const entry = entries[index];
  if (entry === undefined) return;
  const raw = (event.target as HTMLInputElement | HTMLSelectElement).value;
  if (field === 'key') entries[index] = { ...entry, key: raw as `EntityBB_${string}` };
  else if (field === 'trueValue' || field === 'falseValue')
    entries[index] = { ...entry, [field]: Number(raw) };
  else entries[index] = { ...entry, condition: { ...entry.condition, [field]: raw } };
  draft.value = { ...draft.value, entityBlackboardInitializers: entries };
}

function removeEntityBlackboardInitializer(index: number): void {
  const entries = (draft.value.entityBlackboardInitializers ?? []).filter((_, i) => i !== index);
  draft.value = {
    ...draft.value,
    entityBlackboardInitializers: entries.length === 0 ? undefined : entries,
  };
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

function updateIdentity(
  field:
    | 'displayName'
    | 'assetSlug'
    | 'rarity'
    | 'defaultPotential'
    | 'weaponType'
    | 'element'
    | 'role'
    | 'mainAttribute'
    | 'secondaryAttribute',
  event: Event,
): void {
  const raw = (event.target as HTMLInputElement | HTMLSelectElement).value;
  const value = field === 'rarity' || field === 'defaultPotential' ? Number(raw) : raw;
  draft.value = { ...draft.value, [field]: value } as OperatorDefinition;
}

function replaceGroup(index: number, group: SkillGroupDefinition): void {
  const next = [...draft.value.skillGroups];
  next[index] = group;
  draft.value = { ...draft.value, skillGroups: next };
}

function uniqueKey(base: string, existing: readonly string[]): string {
  const keys = new Set(existing);
  let index = 1;
  while (keys.has(`${base}-copy-${index}`)) index += 1;
  return `${base}-copy-${index}`;
}

function duplicateGroup(): void {
  const group = selectedGroup.value;
  if (group === undefined) return;
  const copy = clone(group);
  copy.key = uniqueKey(
    group.key,
    draft.value.skillGroups.map(item => item.key),
  );
  const groups = [...draft.value.skillGroups];
  groups.splice(selectedGroupIndex.value + 1, 0, copy);
  draft.value = { ...draft.value, skillGroups: groups };
  selectedGroupIndex.value += 1;
  selectedSkillIndex.value = 0;
}

function removeGroup(): void {
  if (selectedGroup.value === undefined) return;
  const groups = draft.value.skillGroups.filter((_, index) => index !== selectedGroupIndex.value);
  draft.value = { ...draft.value, skillGroups: groups };
  selectedGroupIndex.value = Math.max(0, Math.min(selectedGroupIndex.value, groups.length - 1));
  selectedSkillIndex.value = 0;
}

function moveGroup(offset: -1 | 1): void {
  const source = selectedGroupIndex.value;
  const target = source + offset;
  if (target < 0 || target >= draft.value.skillGroups.length) return;
  const groups = [...draft.value.skillGroups];
  [groups[source], groups[target]] = [groups[target]!, groups[source]!];
  draft.value = { ...draft.value, skillGroups: groups };
  selectedGroupIndex.value = target;
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

function duplicateSkill(): void {
  const group = selectedGroup.value;
  const skill = selectedSkill.value;
  if (group === undefined || skill === null) return;
  const skills = [...selectedGroupSkills.value];
  const copy = clone(skill);
  copy.key = uniqueKey(
    skill.key,
    skills.map(item => item.key),
  );
  skills.splice(selectedSkillIndex.value + 1, 0, copy);
  replaceGroup(selectedGroupIndex.value, { ...group, skills });
  selectedSkillIndex.value += 1;
}

function removeSkill(): void {
  const group = selectedGroup.value;
  if (group === undefined || selectedSkill.value === null) return;
  const skills = selectedGroupSkills.value.filter((_, index) => index !== selectedSkillIndex.value);
  replaceGroup(selectedGroupIndex.value, { ...group, skills });
  selectedSkillIndex.value = Math.max(0, Math.min(selectedSkillIndex.value, skills.length - 1));
}

function moveSkill(offset: -1 | 1): void {
  const group = selectedGroup.value;
  if (group === undefined) return;
  const source = selectedSkillIndex.value;
  const target = source + offset;
  const skills = [...selectedGroupSkills.value];
  if (target < 0 || target >= skills.length) return;
  [skills[source], skills[target]] = [skills[target]!, skills[source]!];
  replaceGroup(selectedGroupIndex.value, { ...group, skills });
  selectedSkillIndex.value = target;
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
  if (selectedBuffId.value === '' || selectedBuffReferences.value.length > 0) return;
  const next = { ...(draft.value.buffDefinitions ?? {}) };
  delete next[selectedBuffId.value];
  draft.value = {
    ...draft.value,
    buffDefinitions: Object.keys(next).length === 0 ? undefined : next,
  };
  selectedBuffId.value = Object.keys(next).sort()[0] ?? '';
}

function revealDefinitionReference(reference: OperatorDefinitionReference): void {
  if (reference.ownerKind === 'skill') {
    const match = /^skillGroups\[(\d+)\]\.skills\[(\d+)\]/.exec(reference.path);
    if (match === null) return;
    section.value = 'skills';
    selectedGroupIndex.value = Number(match[1]);
    selectedSkillIndex.value = Number(match[2]);
    objectSearch.value = '';
    showSkillEditor.value = true;
    return;
  }
  if (reference.ownerKind === 'buff') {
    section.value = 'buffs';
    selectedBuffId.value = reference.ownerId;
    objectSearch.value = reference.ownerId;
    return;
  }
  section.value = 'entities';
  referencedEntityId.value = reference.ownerId;
  showEntityEditor.value = true;
}

function revealEntityDefinitionReference(reference: OperatorDefinitionReference): void {
  showEntityEditor.value = false;
  revealDefinitionReference(reference);
}

function saveEntities(definitions: OperatorAbilityEntityDefinitions): void {
  draft.value = {
    ...draft.value,
    abilityEntityDefinitions: Object.keys(definitions).length === 0 ? undefined : definitions,
  };
  showEntityEditor.value = false;
}

function saveRuntimeBehaviors(value: {
  passiveSkills?: OperatorDefinition['passiveSkills'];
  eventHandlers?: OperatorDefinition['eventHandlers'];
}): void {
  draft.value = { ...draft.value, ...value };
  showRuntimeBehaviorEditor.value = false;
}

function saveComboDefinitions(value: {
  conditions?: OperatorDefinition['comboSkillConditions'];
}): void {
  draft.value = {
    ...draft.value,
    comboSkillConditions: value.conditions,
  };
  showComboEditor.value = false;
}

function save(): void {
  emit('save', clone(draft.value));
  emit('update:visible', false);
}

function selectSection(value: Section): void {
  section.value = value;
  objectSearch.value = '';
  showRuntimeBehaviorEditor.value = false;
  showUpgradeBehaviorEditor.value = false;
  showComboEditor.value = false;
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
        <button
          :class="{ active: section === 'progression' }"
          @click="selectSection('progression')"
        >
          <span>天赋与潜能</span><b>{{ draft.talents.length + draft.potentials.length }}</b>
        </button>
        <button :class="{ active: section === 'runtime' }" @click="selectSection('runtime')">
          <span>角色级运行数据</span><b>{{ entityBlackboardEntries.length }}</b>
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
            <label title="项目内稳定引用身份。创建模板时确定，修改会使既有引用失效。"
              >模板 ID<input :value="draft.slug" disabled
            /></label>
            <label title="来源游戏数据身份，仅用于追溯和资源回退，不是项目内引用。"
              >游戏 ID<input :value="draft.gameId" disabled
            /></label>
            <label
              >展示名称<input
                :value="draft.displayName ?? ''"
                @change="updateIdentity('displayName', $event)"
            /></label>
            <label title="继承头像、技能图标和本地化文本时使用的内置干员身份。"
              >资源来源<input
                :value="draft.assetSlug ?? ''"
                @change="updateIdentity('assetSlug', $event)"
            /></label>
            <label
              >星级<select :value="draft.rarity" @change="updateIdentity('rarity', $event)">
                <option v-for="value in OPERATOR_RARITIES" :key="value" :value="value">
                  {{ value }} ★
                </option>
              </select></label
            >
            <label
              >默认潜能<input
                type="number"
                min="0"
                max="5"
                step="1"
                :value="draft.defaultPotential ?? 0"
                @change="updateIdentity('defaultPotential', $event)"
            /></label>
            <label
              >武器类型<select
                :value="draft.weaponType"
                @change="updateIdentity('weaponType', $event)"
              >
                <option v-for="value in OPERATOR_WEAPON_TYPES" :key="value" :value="value">
                  {{ value }}
                </option>
              </select></label
            >
            <label
              >元素<select :value="draft.element" @change="updateIdentity('element', $event)">
                <option v-for="value in DAMAGE_ELEMENTS" :key="value" :value="value">
                  {{ value }}
                </option>
              </select></label
            >
            <label
              >职业<select :value="draft.role" @change="updateIdentity('role', $event)">
                <option v-for="value in OPERATOR_ROLES" :key="value" :value="value">
                  {{ value }}
                </option>
              </select></label
            >
            <label
              >主属性<select
                :value="draft.mainAttribute"
                @change="updateIdentity('mainAttribute', $event)"
              >
                <option v-for="value in OPERATOR_ATTRIBUTES" :key="value" :value="value">
                  {{ ATTRIBUTE_LABELS[value] }}
                </option>
              </select></label
            >
            <label
              >副属性<select
                :value="draft.secondaryAttribute"
                @change="updateIdentity('secondaryAttribute', $event)"
              >
                <option v-for="value in OPERATOR_ATTRIBUTES" :key="value" :value="value">
                  {{ ATTRIBUTE_LABELS[value] }}
                </option>
              </select></label
            >
          </div>
          <div class="level-toolbar">
            <span>正在编辑等级</span>
            <input v-model.number="panelLevel" type="range" min="1" max="90" />
            <strong>Lv.{{ panelLevel }}</strong>
          </div>
          <div class="stat-grid">
            <label v-for="key in PANEL_ATTRIBUTE_KEYS" :key="key">
              <span>{{ ATTRIBUTE_LABELS[key] }}</span>
              <input
                type="number"
                step="0.01"
                :value="draft.attributes[key][panelLevel - 1] ?? 0"
                @input="updatePanelStat(key, $event)"
              />
            </label>
          </div>
          <div class="panel-subsection">
            <header>
              <div>
                <h3>信赖属性节点</h3>
                <p>四个信赖节点提供的属性值；未自定义时使用全局主属性规则 10、15、15、20。</p>
              </div>
              <button
                class="ea-btn ea-btn--sm ea-btn--glass-rect"
                @click="setTrustMode(draft.trustAttributeBonus === undefined)"
              >
                {{ draft.trustAttributeBonus === undefined ? '改为自定义规则' : '恢复全局规则' }}
              </button>
            </header>
            <template v-if="draft.trustAttributeBonus">
              <label>
                节点数值
                <input
                  :value="draft.trustAttributeBonus.values.join(', ')"
                  @change="updateTrustValues"
                />
                <small>按节点顺序填写，使用英文逗号分隔。</small>
              </label>
              <fieldset class="attribute-chips">
                <legend>每个节点增加的属性</legend>
                <button
                  v-for="attribute in TRUST_ATTRIBUTE_OPTIONS"
                  :key="attribute"
                  :class="{ active: draft.trustAttributeBonus.attributes.includes(attribute) }"
                  @click="toggleTrustAttribute(attribute)"
                >
                  {{
                    attribute === 'main'
                      ? '当前主属性'
                      : attribute === 'secondary'
                        ? '当前副属性'
                        : ATTRIBUTE_LABELS[attribute]
                  }}
                </button>
              </fieldset>
            </template>
          </div>
        </section>

        <section v-else-if="section === 'skills'" class="definition-section split-section">
          <aside class="object-list">
            <input v-model="objectSearch" class="object-search" placeholder="搜索技能组…" />
            <button
              class="add-object"
              :disabled="selectedGroup === undefined"
              @click="duplicateGroup"
            >
              ＋ 复制当前技能组
            </button>
            <button
              v-for="entry in filteredGroups"
              :key="`${entry.group.key}:${entry.index}`"
              :class="{ active: selectedGroupIndex === entry.index }"
              @click="
                selectedGroupIndex = entry.index;
                selectedSkillIndex = 0;
                showSkillEditor = false;
              "
            >
              <span>{{ entry.group.key }}</span
              ><small>{{ normalizeSkills(entry.group.skills).length }} 个技能</small>
            </button>
          </aside>
          <div v-if="selectedGroup" class="object-editor">
            <SkillDefinitionEditorDialog
              v-if="showSkillEditor && selectedSkill"
              embedded
              :visible="true"
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
            <template v-else>
              <header>
                <div>
                  <h3>技能组</h3>
                  <p>技能组决定技能库放置单元与养成等级来源。</p>
                </div>
                <div class="object-toolbar">
                  <button :disabled="selectedGroupIndex === 0" @click="moveGroup(-1)">上移</button>
                  <button
                    :disabled="selectedGroupIndex === draft.skillGroups.length - 1"
                    @click="moveGroup(1)"
                  >
                    下移
                  </button>
                  <button class="danger-button" @click="removeGroup">删除组</button>
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
                  @click="
                    selectedSkillIndex = index;
                    showSkillEditor = false;
                  "
                >
                  {{ skill.key }}
                </button>
                <button :disabled="selectedSkill === null" @click="duplicateSkill">
                  ＋ 复制技能
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
                <div class="skill-actions">
                  <button :disabled="selectedSkillIndex === 0" @click="moveSkill(-1)">上移</button>
                  <button
                    :disabled="selectedSkillIndex === selectedGroupSkills.length - 1"
                    @click="moveSkill(1)"
                  >
                    下移
                  </button>
                  <button class="danger-button" @click="removeSkill">删除</button>
                  <button
                    class="ea-btn ea-btn--sm ea-btn--glass-rect"
                    @click="showSkillEditor = true"
                  >
                    编辑完整技能
                  </button>
                </div>
              </div>
            </template>
          </div>
        </section>

        <section v-else-if="section === 'progression'" class="definition-section split-section">
          <aside class="object-list">
            <div class="kind-tabs">
              <button
                :class="{ active: progressionKind === 'talents' }"
                @click="
                  progressionKind = 'talents';
                  selectedUpgradeIndex = 0;
                "
              >
                天赋
              </button>
              <button
                :class="{ active: progressionKind === 'potentials' }"
                @click="
                  progressionKind = 'potentials';
                  selectedUpgradeIndex = 0;
                "
              >
                潜能
              </button>
            </div>
            <button class="add-object" @click="addUpgrade">
              ＋ 新增{{ progressionKind === 'talents' ? '天赋' : '潜能' }}
            </button>
            <button
              v-for="(upgrade, index) in selectedUpgrades"
              :key="`${upgrade.key}:${index}`"
              :class="{ active: selectedUpgradeIndex === index }"
              @click="
                selectedUpgradeIndex = index;
                showUpgradeBehaviorEditor = false;
              "
            >
              <span>{{ upgrade.key }}</span
              ><small>{{ upgrade.levels }} 级</small>
            </button>
          </aside>
          <div v-if="selectedUpgrade" class="object-editor">
            <OperatorUpgradeBehaviorDialog
              v-if="showUpgradeBehaviorEditor"
              :visible="true"
              :upgrade="selectedUpgrade"
              :skill-level="skillLevel"
              :skill-group-keys="skillGroupKeys"
              @update:visible="showUpgradeBehaviorEditor = $event"
              @save="saveUpgradeBehavior"
            />
            <template v-else>
              <header>
                <div>
                  <h3>{{ progressionKind === 'talents' ? '天赋' : '潜能' }}</h3>
                  <p>等级决定逐级值的解析位置；行为结构在下一阶段进入养成导图。</p>
                </div>
                <div class="object-toolbar">
                  <button :disabled="selectedUpgradeIndex === 0" @click="moveUpgrade(-1)">
                    上移
                  </button>
                  <button
                    :disabled="selectedUpgradeIndex === selectedUpgrades.length - 1"
                    @click="moveUpgrade(1)"
                  >
                    下移
                  </button>
                  <button class="danger-button" @click="removeUpgrade">删除</button>
                </div>
              </header>
              <div class="identity-grid">
                <label
                  >稳定 key<input
                    :value="selectedUpgrade.key"
                    @change="updateUpgrade('key', $event)"
                /></label>
                <label
                  >等级数量<input
                    type="number"
                    min="1"
                    step="1"
                    :value="selectedUpgrade.levels"
                    @change="updateUpgrade('levels', $event)"
                /></label>
                <label class="wide-field">
                  固定模型下无可观察效果
                  <select
                    :value="selectedUpgrade.simulationNoEffect ?? ''"
                    @change="updateUpgrade('simulationNoEffect', $event)"
                  >
                    <option value="">否，存在可模拟行为</option>
                    <option value="uniqueEnemyHasNoAlternateTarget">唯一敌人没有其他目标</option>
                    <option value="enemyDoesNotDealDamage">木桩敌人不造成伤害</option>
                    <option value="enemyDoesNotInflictSpellStatusOnOperators">
                      木桩敌人不对干员施加法术状态
                    </option>
                  </select>
                  <small>只有已取证且在 Endaxis 固定模型中确实无可见结果时才能选择。</small>
                </label>
              </div>
              <div class="structure-summary">
                <span>构筑修正 {{ selectedUpgrade.modifiers?.length ?? 0 }}</span>
                <span>事件响应 {{ selectedUpgrade.eventHandlers?.length ?? 0 }}</span>
                <span>被动技能 {{ selectedUpgrade.passiveSkills?.length ?? 0 }}</span>
                <span>初始化序列 {{ selectedUpgrade.initializationSequence ? 1 : 0 }}</span>
                <button
                  class="ea-btn ea-btn--sm ea-btn--glass-rect"
                  @click="showUpgradeBehaviorEditor = true"
                >
                  编辑行为结构
                </button>
              </div>
              <section class="modifier-workspace">
                <header>
                  <div>
                    <h3>构筑修正</h3>
                    <p>按列表顺序修改最终构筑或技能编译结果。</p>
                  </div>
                  <div class="modifier-add">
                    <select v-model="newModifierKind">
                      <option v-for="kind in UPGRADE_MODIFIER_KINDS" :key="kind" :value="kind">
                        {{ kind }}
                      </option></select
                    ><button @click="addUpgradeModifier">＋ 添加</button>
                  </div>
                </header>
                <div class="modifier-tabs">
                  <button
                    v-for="(modifier, index) in selectedUpgrade.modifiers ?? []"
                    :key="`${modifier.kind}:${index}`"
                    :class="{ active: selectedModifierIndex === index }"
                    @click="selectedModifierIndex = index"
                  >
                    {{ index + 1 }} · {{ modifier.kind }}
                  </button>
                </div>
                <div v-if="selectedUpgradeModifier" class="modifier-toolbar">
                  <button :disabled="selectedModifierIndex === 0" @click="moveUpgradeModifier(-1)">
                    上移</button
                  ><button
                    :disabled="
                      selectedModifierIndex === (selectedUpgrade.modifiers?.length ?? 0) - 1
                    "
                    @click="moveUpgradeModifier(1)"
                  >
                    下移</button
                  ><span /><button class="danger-button" @click="removeUpgradeModifier">
                    删除修正
                  </button>
                </div>
                <OperatorUpgradeModifierEditor
                  v-if="selectedUpgradeModifier"
                  :modifier="selectedUpgradeModifier"
                  :skill-group-keys="skillGroupKeys"
                  :passive-skill-keys="passiveSkillKeys"
                  @update="updateUpgradeModifier"
                />
                <div v-else class="empty-state compact">当前养成项没有构筑修正。</div>
              </section>
            </template>
          </div>
          <div v-else class="empty-state">当前分类还没有定义。</div>
        </section>

        <section v-else-if="section === 'runtime'" class="definition-section">
          <OperatorComboDefinitionsDialog
            v-if="showComboEditor"
            :visible="true"
            :conditions="draft.comboSkillConditions"
            :skill-keys="comboSkillKeys"
            :skill-level="skillLevel"
            @update:visible="showComboEditor = $event"
            @save="saveComboDefinitions"
          />
          <OperatorRuntimeBehaviorDialog
            v-else-if="showRuntimeBehaviorEditor"
            :visible="true"
            :passive-skills="draft.passiveSkills"
            :event-handlers="draft.eventHandlers"
            :skill-level="skillLevel"
            @update:visible="showRuntimeBehaviorEditor = $event"
            @save="saveRuntimeBehaviors"
          />
          <template v-else>
            <header>
              <div>
                <h3>角色实体黑板</h3>
                <p>角色实例跨技能共享的字面初值；与每次技能释放重置的技能黑板不同。</p>
              </div>
              <button
                class="ea-btn ea-btn--sm ea-btn--glass-rect"
                @click="addEntityBlackboardEntry"
              >
                ＋ 添加初值
              </button>
            </header>
            <div class="entity-blackboard">
              <div
                v-for="([key, value], index) in entityBlackboardEntries"
                :key="`${key}:${index}`"
                class="entity-blackboard-row"
              >
                <label
                  >键<input :value="key" @change="renameEntityBlackboardEntry(key, $event)"
                /></label>
                <label
                  >值<input :value="value" @change="updateEntityBlackboardEntry(key, $event)"
                /></label>
                <button
                  :title="
                    typeof value === 'number'
                      ? '当前为数值，点击改为文本'
                      : '当前为文本，点击改为数值'
                  "
                  @click="toggleEntityBlackboardEntryType(key)"
                >
                  {{ typeof value === 'number' ? '数值' : '文本' }}
                </button>
                <button class="danger-button" @click="removeEntityBlackboardEntry(key)">
                  删除
                </button>
              </div>
              <div v-if="entityBlackboardEntries.length === 0" class="empty-state">
                没有角色级字面初值。
              </div>
            </div>
            <div class="runtime-boundary">
              <strong>构筑条件初始化器</strong>
              <p>在创建技能实例前比较最终构筑四维，并把结果写入角色实体黑板。</p>
              <button
                class="ea-btn ea-btn--sm ea-btn--glass-rect"
                @click="addEntityBlackboardInitializer"
              >
                ＋ 添加初始化器
              </button>
              <div
                v-for="(initializer, index) in draft.entityBlackboardInitializers ?? []"
                :key="`${initializer.key}:${index}`"
                class="initializer-row"
              >
                <label
                  >写入键<input
                    :value="initializer.key"
                    @change="updateEntityBlackboardInitializer(index, 'key', $event)"
                /></label>
                <label
                  >左属性<select
                    :value="initializer.condition.left"
                    @change="updateEntityBlackboardInitializer(index, 'left', $event)"
                  >
                    <option
                      v-for="attribute in OPERATOR_ATTRIBUTES"
                      :key="attribute"
                      :value="attribute"
                    >
                      {{ ATTRIBUTE_LABELS[attribute] }}
                    </option>
                  </select></label
                >
                <label
                  >比较<select
                    :value="initializer.condition.operator"
                    @change="updateEntityBlackboardInitializer(index, 'operator', $event)"
                  >
                    <option
                      v-for="operator in COMPARISON_OPERATORS"
                      :key="operator"
                      :value="operator"
                    >
                      {{ operator }}
                    </option>
                  </select></label
                >
                <label
                  >右属性<select
                    :value="initializer.condition.right"
                    @change="updateEntityBlackboardInitializer(index, 'right', $event)"
                  >
                    <option
                      v-for="attribute in OPERATOR_ATTRIBUTES"
                      :key="attribute"
                      :value="attribute"
                    >
                      {{ ATTRIBUTE_LABELS[attribute] }}
                    </option>
                  </select></label
                >
                <label
                  >成立值<input
                    type="number"
                    step="0.01"
                    :value="initializer.trueValue"
                    @change="updateEntityBlackboardInitializer(index, 'trueValue', $event)"
                /></label>
                <label
                  >不成立值<input
                    type="number"
                    step="0.01"
                    :value="initializer.falseValue"
                    @change="updateEntityBlackboardInitializer(index, 'falseValue', $event)"
                /></label>
                <button class="danger-button" @click="removeEntityBlackboardInitializer(index)">
                  删除
                </button>
              </div>
            </div>
            <div class="runtime-boundary">
              <strong>角色级常驻行为</strong>
              <span>基础被动 {{ draft.passiveSkills?.length ?? 0 }}</span>
              <span>角色事件响应 {{ draft.eventHandlers?.length ?? 0 }}</span>
              <button
                class="ea-btn ea-btn--sm ea-btn--glass-rect"
                @click="showRuntimeBehaviorEditor = true"
              >
                编辑角色级行为
              </button>
            </div>
            <div class="runtime-boundary">
              <strong>角色级连携结构</strong>
              <span>连携条件 {{ draft.comboSkillConditions?.length ?? 0 }}</span>
              <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="showComboEditor = true">
                编辑连携定义
              </button>
            </div>
          </template>
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
              <button
                class="danger-button"
                :disabled="selectedBuffReferences.length > 0"
                :title="
                  selectedBuffReferences.length > 0
                    ? `仍有 ${selectedBuffReferences.length} 处引用，不能删除`
                    : '删除 Buff 定义'
                "
                @click="removeBuff"
              >
                删除
              </button>
            </header>
            <div v-if="selectedBuffReferences.length" class="reference-guard">
              <strong>仍有 {{ selectedBuffReferences.length }} 处引用</strong>
              <span>先修改这些使用点，定义才可以删除。</span>
              <button
                v-for="reference in selectedBuffReferences"
                :key="reference.path"
                type="button"
                @click="revealDefinitionReference(reference)"
              >
                <b>{{ reference.ownerKind }} · {{ reference.ownerId }}</b>
                <code>{{ reference.path }}</code>
              </button>
            </div>
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
          <AbilityEntityDefinitionsDialog
            v-if="showEntityEditor"
            :visible="true"
            :base-definitions="{}"
            :custom-definitions="draft.abilityEntityDefinitions"
            :common-definitions="commonAbilityEntityDefinitions"
            :skill-level="skillLevel"
            :initial-selected-id="referencedEntityId"
            :operator-definition="draft"
            @update:visible="showEntityEditor = $event"
            @save="saveEntities"
            @reveal-reference="revealEntityDefinitionReference"
          />
          <template v-else>
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
                编辑能力实体
              </button>
            </div>
          </template>
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
.object-toolbar,
.skill-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.object-toolbar button,
.skill-actions > button:not(.ea-btn) {
  min-height: 30px;
  border: 1px solid #444;
  background: #1d1d20;
  color: #bbb;
  cursor: pointer;
}
.object-toolbar button:disabled,
.skill-actions > button:disabled {
  opacity: 0.4;
  cursor: default;
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
.panel-subsection {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #343438;
}
.panel-subsection header {
  margin-bottom: 14px;
}
.panel-subsection label small,
.wide-field small {
  color: #777;
  line-height: 1.45;
}
.attribute-chips {
  margin: 14px 0 0;
  padding: 10px;
  border: 1px solid #3c3c40;
}
.attribute-chips legend {
  color: #888;
}
.attribute-chips button {
  margin: 3px;
  padding: 6px 8px;
  border: 1px solid #444;
  background: #1d1d20;
  color: #aaa;
  cursor: pointer;
}
.attribute-chips button.active {
  border-color: #b5a62e;
  color: #f1dd4e;
  background: #2b2a22;
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
.kind-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-bottom: 10px;
}
.kind-tabs button {
  display: block;
  padding: 8px;
  border: 1px solid #444;
  text-align: center;
}
.structure-summary,
.runtime-boundary {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 18px;
  padding: 14px;
  border: 1px solid #3c3c40;
  background: #202023;
}
.structure-summary span,
.runtime-boundary span {
  padding: 5px 8px;
  border: 1px solid #444;
  color: #aaa;
}
.wide-field {
  grid-column: 1 / -1;
}
.entity-blackboard {
  display: grid;
  gap: 8px;
}
.entity-blackboard-row {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) minmax(120px, 0.8fr) 58px 58px;
  align-items: end;
  gap: 8px;
  padding: 10px;
  border: 1px solid #3c3c40;
  background: #202023;
}
.entity-blackboard-row > button:not(.danger-button) {
  min-height: 36px;
  border: 1px solid #444;
  background: #1d1d20;
  color: #bbb;
}
.runtime-boundary strong {
  width: 100%;
}
.runtime-boundary > p {
  width: 100%;
}
.initializer-row {
  width: 100%;
  display: grid;
  grid-template-columns:
    minmax(150px, 1.2fr) repeat(3, minmax(90px, 0.8fr)) repeat(2, minmax(80px, 0.7fr))
    58px;
  align-items: end;
  gap: 7px;
  padding-top: 10px;
  border-top: 1px solid #3c3c40;
}
.initializer-row label {
  min-width: 0;
}
.modifier-workspace {
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #343438;
  container-type: inline-size;
}
.modifier-add,
.modifier-toolbar,
.modifier-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.modifier-add select,
.modifier-add button,
.modifier-toolbar button,
.modifier-tabs button {
  min-height: 30px;
  border: 1px solid #444;
  background: #1d1d20;
  color: #bbb;
}
.modifier-tabs button {
  padding: 5px 8px;
}
.modifier-tabs button.active {
  border-color: #b5a62e;
  color: #f1dd4e;
}
.modifier-toolbar {
  margin-top: 8px;
}
.modifier-toolbar span {
  flex: 1;
}
.modifier-toolbar button:disabled {
  opacity: 0.4;
}
.empty-state.compact {
  min-height: 100px;
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
.reference-guard {
  display: grid;
  gap: 6px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, #e5a43b 50%, var(--ea-border-soft));
  background: color-mix(in srgb, #e5a43b 8%, var(--ea-workbench-panel));
}
.reference-guard > strong {
  color: #e5b96d;
  font-size: 12px;
}
.reference-guard > span {
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.reference-guard > button {
  display: grid;
  grid-template-columns: minmax(120px, 0.35fr) minmax(0, 1fr);
  gap: 8px;
  min-width: 0;
  padding: 7px 8px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  text-align: left;
  cursor: pointer;
}
.reference-guard code {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--ea-fg-muted);
  font-size: 10px;
}
.danger-button:disabled {
  opacity: 0.42;
  cursor: not-allowed;
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
