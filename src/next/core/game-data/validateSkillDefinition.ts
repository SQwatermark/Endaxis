/**
 * SkillDefinition 的严格结构验证。
 *
 * 干员 TS、技能库和项目存档中的 customDefinition 共用同一套 SkillDefinition 结构，
 * 技能数据、编译器和项目存档共用这里的校验规则，避免各层各写一套。
 *
 * 本模块只做结构与取值合法性检查，不做语义解析；
 * 传入不可信 unknown，先结构判断再缩窄 Record<string, unknown>，不得用类型断言跳过字段。
 */
import {
  ACTION_VALUE_CALCULATION_OPERATIONS,
  ACTION_VALUE_OPERATIONS,
  BUFF_APPLICATION_TARGETS,
  BUFF_APPLICATION_SOURCES,
  BUFF_SINGLE_TARGETS,
  COMBAT_CONDITION_KINDS,
  COMBAT_RESOURCES,
  COMBAT_STEP_KINDS,
  COMBAT_TARGETS,
  TIMED_MARKER_TARGETS,
  COMPARISON_OPERATORS,
  DAMAGE_CALCULATIONS,
  DAMAGE_ELEMENTS,
  DAMAGE_FEATURES,
  DAMAGE_TAGS,
  DAMAGE_TYPES,
  ELEMENTAL_REACTIONS,
  HEAL_TARGETS,
  INFLICTION_ELEMENTS,
  OPERATOR_ATTRIBUTES,
  RESOURCE_RECIPIENTS,
  SP_GAIN_KINDS,
  SP_GAIN_SOURCES,
  SKILL_TYPES,
  STATUS_MODIFIER_KINDS,
  TIME_DILATION_IGNORE_TARGETS,
} from './operatorDefinition';
import { ENEMY_RANKS } from './enemyRank';
import { collectDamageStepKeys } from './collectDamageStepKeys';
import { parseCombatBuffDefinitionEntry } from '../combat/buffs/combatBuffDefinitions';

export interface SkillDefinitionValidationIssue {
  path: string;
  message: string;
}

const STEP_KINDS = new Set<string>(COMBAT_STEP_KINDS);
const CONDITION_KINDS = new Set<string>(COMBAT_CONDITION_KINDS);
const ENEMY_RANKS_SET = new Set<string>(ENEMY_RANKS);
const DAMAGE_TYPES_SET = new Set<string>(DAMAGE_TYPES);
const DAMAGE_TAGS_SET = new Set<string>(DAMAGE_TAGS);
const DAMAGE_FEATURES_SET = new Set<string>(DAMAGE_FEATURES);
const DAMAGE_ELEMENTS_SET = new Set<string>(DAMAGE_ELEMENTS);
const INFLICTION_ELEMENTS_SET = new Set<string>(INFLICTION_ELEMENTS);
const ELEMENTAL_REACTIONS_SET = new Set<string>(ELEMENTAL_REACTIONS);
const HEAL_TARGETS_SET = new Set<string>(HEAL_TARGETS);
const COMBAT_RESOURCES_SET = new Set<string>(COMBAT_RESOURCES);
const COMBAT_TARGETS_SET = new Set<string>(COMBAT_TARGETS);
const TIMED_MARKER_TARGETS_SET = new Set<string>(TIMED_MARKER_TARGETS);
const HEALTH_TARGETS_SET = new Set<string>([...COMBAT_TARGETS, ...HEAL_TARGETS]);
const TIME_DILATION_IGNORE_TARGETS_SET = new Set<string>(TIME_DILATION_IGNORE_TARGETS);
const BUFF_APPLICATION_TARGETS_SET = new Set<string>(BUFF_APPLICATION_TARGETS);
const BUFF_SINGLE_TARGETS_SET = new Set<string>(BUFF_SINGLE_TARGETS);
const BUFF_APPLICATION_SOURCES_SET = new Set<string>(BUFF_APPLICATION_SOURCES);
const RESOURCE_RECIPIENTS_SET = new Set<string>(RESOURCE_RECIPIENTS);
const COMPARISON_OPERATORS_SET = new Set<string>(COMPARISON_OPERATORS);
const OPERATOR_ATTRIBUTES_SET = new Set<string>(OPERATOR_ATTRIBUTES);
const HEAL_CALCULATION_ATTRIBUTES_SET = new Set<string>([...OPERATOR_ATTRIBUTES, 'maxHealth']);
const DAMAGE_CALCULATIONS_SET = new Set<string>(DAMAGE_CALCULATIONS);
const SP_GAIN_KINDS_SET = new Set<string>(SP_GAIN_KINDS);
const SP_GAIN_SOURCES_SET = new Set<string>(SP_GAIN_SOURCES);
const STATUS_MODIFIER_KINDS_SET = new Set<string>(STATUS_MODIFIER_KINDS);
const SKILL_TYPES_SET = new Set<string>(SKILL_TYPES);
const ACTION_VALUE_OPERATIONS_SET = new Set<string>(ACTION_VALUE_OPERATIONS);
const ACTION_VALUE_CALCULATION_OPERATIONS_SET = new Set<string>(
  ACTION_VALUE_CALCULATION_OPERATIONS,
);
const HEALTH_VALUE_TYPES_SET = new Set<string>(['current', 'ratio']);
const TAG_QUERY_TYPES_SET = new Set<string>(['hasAny', 'hasAll', 'exceptAny', 'exceptAll']);
const TAG_QUERY_TYPES_WITH_EXACT_SET = new Set<string>(['exact', ...TAG_QUERY_TYPES_SET]);
const BUFF_FINISH_REASONS_SET = new Set<string>(['early', 'absorbed', 'other']);
const TRIGGER_SCOPES_SET = new Set<string>(['operator', 'team']);

function issue(path: string, message: string): SkillDefinitionValidationIssue {
  return { path, message };
}

function push(out: SkillDefinitionValidationIssue[], path: string, message: string): void {
  out.push(issue(path, message));
}

/** 结构判断：仅当是普通对象时返回 Record，否则记录 issue 并返回 null。 */
function asRecord(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): Record<string, unknown> | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    push(out, path, 'expected an object');
    return null;
  }
  return value as Record<string, unknown>;
}

function requireString(
  value: Record<string, unknown>,
  key: string,
  path: string,
  out: SkillDefinitionValidationIssue[],
): string | null {
  const v = value[key];
  if (typeof v !== 'string' || v.length === 0) {
    push(out, `${path}.${key}`, 'expected a non-empty string');
    return null;
  }
  return v;
}

function requireFiniteNumber(
  value: Record<string, unknown>,
  key: string,
  path: string,
  out: SkillDefinitionValidationIssue[],
): number | null {
  const v = value[key];
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    push(out, `${path}.${key}`, 'expected a finite number');
    return null;
  }
  return v;
}

function requireNonNegativeInteger(
  value: Record<string, unknown>,
  key: string,
  path: string,
  out: SkillDefinitionValidationIssue[],
): number | null {
  const v = value[key];
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 0) {
    push(out, `${path}.${key}`, 'expected a non-negative integer');
    return null;
  }
  return v;
}

function requireInteger(
  value: Record<string, unknown>,
  key: string,
  path: string,
  out: SkillDefinitionValidationIssue[],
): number | null {
  const v = value[key];
  if (typeof v !== 'number' || !Number.isInteger(v)) {
    push(out, `${path}.${key}`, 'expected an integer');
    return null;
  }
  return v;
}

function requireBoolean(
  value: Record<string, unknown>,
  key: string,
  path: string,
  out: SkillDefinitionValidationIssue[],
): boolean | null {
  const v = value[key];
  if (typeof v !== 'boolean') {
    push(out, `${path}.${key}`, 'expected a boolean');
    return null;
  }
  return v;
}

function requireEnum(
  value: Record<string, unknown>,
  key: string,
  allowed: ReadonlySet<string>,
  path: string,
  out: SkillDefinitionValidationIssue[],
): string | null {
  const v = value[key];
  if (typeof v !== 'string' || !allowed.has(v)) {
    push(out, `${path}.${key}`, `expected one of ${[...allowed].join(', ')}`);
    return null;
  }
  return v;
}

/**
 * LevelValues：接受 finite number 或非空 finite number 数组。
 * 数组元素逐项校验；空数组、非数值、无穷均报错。
 */
function validateLevelValues(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) push(out, path, 'expected a finite number');
    return;
  }
  if (!Array.isArray(value) || value.length === 0) {
    push(out, path, 'expected a finite number or a non-empty number array');
    return;
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'number' || !Number.isFinite(entry)) {
      push(out, `${path}[${index}]`, 'expected a finite number');
    }
  });
}

/** ActionValueOperand：blackboard（key）或 constant（value）。 */
function validateActionValueOperand(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  const kind = requireString(record, 'kind', path, out);
  if (kind === 'blackboard') {
    requireString(record, 'key', path, out);
  } else if (kind === 'constant') {
    requireFiniteNumber(record, 'value', path, out);
  } else if (kind !== null) {
    push(out, `${path}.kind`, "expected 'blackboard' or 'constant'");
  }
}

function validateTimeScaleCurve(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  const kind = requireString(record, 'kind', path, out);
  if (kind === 'named') {
    const key = requireString(record, 'key', path, out);
    if (key !== null && key.length === 0) push(out, `${path}.key`, 'expected a non-empty string');
    return;
  }
  if (kind !== 'inline') {
    if (kind !== null) push(out, `${path}.kind`, "expected 'named' or 'inline'");
    return;
  }
  if (!Array.isArray(record.keys) || record.keys.length === 0) {
    push(out, `${path}.keys`, 'expected a non-empty array');
    return;
  }
  let previousTime = Number.NEGATIVE_INFINITY;
  record.keys.forEach((value, index) => {
    const keyPath = `${path}.keys[${index}]`;
    const key = asRecord(value, keyPath, out);
    if (key === null) return;
    for (const field of ['time', 'value', 'inTangent', 'outTangent', 'inWeight', 'outWeight']) {
      requireFiniteNumber(key, field, keyPath, out);
    }
    const time = key.time;
    if (typeof time === 'number' && Number.isFinite(time)) {
      if (time <= previousTime) push(out, `${keyPath}.time`, 'expected strictly increasing times');
      previousTime = time;
    }
    const weightedMode = key.weightedMode;
    if (
      typeof weightedMode !== 'number' ||
      !Number.isInteger(weightedMode) ||
      weightedMode < 0 ||
      weightedMode > 3
    ) {
      push(out, `${keyPath}.weightedMode`, 'expected an integer from 0 to 3');
    }
  });
}

function validateCombatTargetArray(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
  allowEmpty: boolean,
  allowedTargets: ReadonlySet<string> = COMBAT_TARGETS_SET,
): void {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    push(out, path, allowEmpty ? 'expected an array' : 'expected a non-empty array');
    return;
  }
  value.forEach((target, index) => {
    if (typeof target !== 'string' || !allowedTargets.has(target)) {
      push(out, `${path}[${index}]`, 'unknown combat target');
    }
  });
}

/** 值可以是 LevelValues 或 ActionValueOperand 的字段。 */
function validateLevelValuesOrActionValueOperand(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    validateActionValueOperand(value, path, out);
  } else {
    validateLevelValues(value, path, out);
  }
}

/** 非空整数数组（buff 标签、tag id 等）。 */
function validateNonEmptyIntegerArray(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0) {
    push(out, path, 'expected a non-empty array');
    return;
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'number' || !Number.isInteger(entry)) {
      push(out, `${path}[${index}]`, 'expected an integer');
    }
  });
}

function validateAbilityEntityTargetQueries(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): boolean {
  if (!Array.isArray(value) || value.length === 0) {
    push(out, path, 'expected a non-empty array');
    return false;
  }
  value.forEach((entry, index) => {
    const queryPath = `${path}[${index}]`;
    const query = asRecord(entry, queryPath, out);
    if (query === null) return;
    const kind = requireEnum(query, 'kind', new Set(['ownerSpawned', 'context']), queryPath, out);
    if (kind === 'context') {
      requireString(query, 'contextKey', queryPath, out);
      return;
    }
    if (query.abilityEntityIds !== undefined) {
      validateNonEmptyStringArray(query.abilityEntityIds, `${queryPath}.abilityEntityIds`, out);
    }
  });
  return true;
}

/** 非空字符串数组。 */
function validateNonEmptyStringArray(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0) {
    push(out, path, 'expected a non-empty array');
    return;
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || entry.length === 0) {
      push(out, `${path}[${index}]`, 'expected a non-empty string');
    }
  });
}

/** 非空且只包含已定义伤害标签的数组。 */
function validateDamageTags(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
  requireNonEmpty = true,
): void {
  if (!Array.isArray(value) || (requireNonEmpty && value.length === 0)) {
    push(out, path, requireNonEmpty ? 'expected a non-empty array' : 'expected an array');
    return;
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || !DAMAGE_TAGS_SET.has(entry)) {
      push(out, `${path}[${index}]`, 'unknown damage tag');
    }
  });
}

function validateDamageFeatures(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0) {
    push(out, path, 'expected a non-empty array');
    return;
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || !DAMAGE_FEATURES_SET.has(entry)) {
      push(out, `${path}[${index}]`, 'unknown damage feature');
    }
  });
}

/** 布尔/数字/字符串三选一。 */
function validateScalar(value: unknown, path: string, out: SkillDefinitionValidationIssue[]): void {
  if (typeof value !== 'boolean' && typeof value !== 'number' && typeof value !== 'string') {
    push(out, path, 'expected a boolean, number, or string');
  }
}

/** 元素或元素数组。 */
function validateElements(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  if (Array.isArray(value)) {
    value.forEach((element, index) => {
      if (typeof element !== 'string' || !DAMAGE_ELEMENTS_SET.has(element)) {
        push(out, `${path}[${index}]`, 'unknown damage element');
      }
    });
    return;
  }
  if (typeof value !== 'string' || !DAMAGE_ELEMENTS_SET.has(value)) {
    push(out, path, 'unknown damage element');
  }
}

/**
 * CombatCondition 的严格验证。覆盖全部条件 kind 及其必填/可选字段。
 */
function validateCombatCondition(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
  currentTargetAvailable = false,
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  const kind = requireString(record, 'kind', path, out);
  if (kind === null || !CONDITION_KINDS.has(kind)) {
    if (kind !== null) push(out, `${path}.kind`, 'unknown condition kind');
    return;
  }

  switch (kind) {
    case 'combatActive':
    case 'singleEnemyPresent':
    case 'casterControlled':
    case 'eventSourceMatchesBuffSource':
    case 'eventSourceMatchesBuffSourceEntitySource':
    case 'eventSourceControlled':
    case 'buffSourceMatchesOwner':
      break;
    case 'enemyRankIn':
      if (!Array.isArray(record.ranks)) {
        push(out, `${path}.ranks`, 'expected an array');
      } else {
        record.ranks.forEach((rank, index) => {
          if (typeof rank === 'string' && !ENEMY_RANKS_SET.has(rank)) {
            push(out, `${path}.ranks[${index}]`, 'unknown enemy rank');
          } else if (typeof rank !== 'string') {
            push(out, `${path}.ranks[${index}]`, 'unknown enemy rank');
          }
        });
      }
      break;
    case 'enemySuperArmorCompare':
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      validateActionValueOperand(record.value, `${path}.value`, out);
      break;
    case 'cameraToTargetAngleCompare':
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      validateActionValueOperand(record.value, `${path}.value`, out);
      break;
    case 'skillBranchEnabled':
      requireString(record, 'branchKey', path, out);
      break;
    case 'targetStaggered':
      requireEnum(record, 'target', COMBAT_TARGETS_SET, path, out);
      break;
    case 'healthCompare':
      requireEnum(record, 'target', HEALTH_TARGETS_SET, path, out);
      requireEnum(record, 'valueType', HEALTH_VALUE_TYPES_SET, path, out);
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      validateActionValueOperand(record.value, `${path}.value`, out);
      break;
    case 'poiseCompare':
      requireEnum(record, 'target', COMBAT_TARGETS_SET, path, out);
      requireBoolean(record, 'returnValueIfMissing', path, out);
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      validateActionValueOperand(record.value, `${path}.value`, out);
      break;
    case 'contextFlagEquals':
      requireString(record, 'flag', path, out);
      validateScalar(record.value, `${path}.value`, out);
      break;
    case 'probability':
      validateActionValueOperand(record.probability, `${path}.probability`, out);
      break;
    case 'actionValueCompare':
      validateActionValueOperand(record.left, `${path}.left`, out);
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      validateActionValueOperand(record.right, `${path}.right`, out);
      break;
    case 'contextTargetCountCompare':
      requireString(record, 'contextKey', path, out);
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      requireNonNegativeInteger(record, 'value', path, out);
      break;
    case 'abilityEntityRemainingDurationCompare':
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      validateActionValueOperand(record.value, `${path}.value`, out);
      if (!currentTargetAvailable) {
        push(out, path, 'requires a forEachContextTarget body');
      }
      break;
    case 'statusActive':
      requireString(record, 'statusKey', path, out);
      requireEnum(record, 'target', COMBAT_TARGETS_SET, path, out);
      if (record.minimumStacks !== undefined) {
        requireNonNegativeInteger(record, 'minimumStacks', path, out);
      }
      break;
    case 'buffStackCompare':
      requireEnum(record, 'target', BUFF_SINGLE_TARGETS_SET, path, out);
      requireEnum(record, 'tagQueryType', TAG_QUERY_TYPES_SET, path, out);
      validateNonEmptyIntegerArray(record.buffTagIds, `${path}.buffTagIds`, out);
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      validateActionValueOperand(record.value, `${path}.value`, out);
      if (record.sameSourceSkillCast !== undefined) {
        requireBoolean(record, 'sameSourceSkillCast', path, out);
      }
      break;
    case 'entityTagMatch':
      requireEnum(record, 'target', COMBAT_TARGETS_SET, path, out);
      requireEnum(record, 'tagQueryType', TAG_QUERY_TYPES_SET, path, out);
      validateNonEmptyIntegerArray(record.tagIds, `${path}.tagIds`, out);
      break;
    case 'buffIdStackCompare':
      requireEnum(record, 'target', BUFF_SINGLE_TARGETS_SET, path, out);
      validateNonEmptyStringArray(record.buffIds, `${path}.buffIds`, out);
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      validateLevelValuesOrActionValueOperand(record.value, `${path}.value`, out);
      if (record.sameSourceSkillCast !== undefined) {
        requireBoolean(record, 'sameSourceSkillCast', path, out);
      }
      break;
    case 'timedMarkerPresent':
      requireEnum(record, 'target', TIMED_MARKER_TARGETS_SET, path, out);
      requireString(record, 'markerId', path, out);
      break;
    case 'abilityEntityTimedMarkerPresent':
      requireString(record, 'markerId', path, out);
      if (record.contextKey !== undefined) requireString(record, 'contextKey', path, out);
      break;
    case 'eventDamageTagsMatch':
      requireEnum(record, 'match', TAG_QUERY_TYPES_WITH_EXACT_SET, path, out);
      validateDamageTags(record.tags, `${path}.tags`, out);
      break;
    case 'eventDamageFeaturesMatch':
      requireEnum(record, 'match', TAG_QUERY_TYPES_WITH_EXACT_SET, path, out);
      validateDamageFeatures(record.features, `${path}.features`, out);
      break;
    case 'eventDamageTypeIn':
      if (!Array.isArray(record.damageTypes) || record.damageTypes.length === 0) {
        push(out, `${path}.damageTypes`, 'expected a non-empty array');
      } else {
        record.damageTypes.forEach((damageType, index) => {
          if (typeof damageType !== 'string' || !DAMAGE_TYPES_SET.has(damageType)) {
            push(out, `${path}.damageTypes[${index}]`, 'unknown damage type');
          }
        });
      }
      break;
    case 'eventInflictionElementIn':
      if (!Array.isArray(record.elements) || record.elements.length === 0) {
        push(out, `${path}.elements`, 'expected a non-empty array');
      } else {
        record.elements.forEach((element, index) => {
          if (typeof element !== 'string' || !INFLICTION_ELEMENTS_SET.has(element)) {
            push(out, `${path}.elements[${index}]`, 'unknown infliction element');
          }
        });
      }
      break;
    case 'eventSkillTypeIn':
      if (!Array.isArray(record.skillTypes) || record.skillTypes.length === 0) {
        push(out, `${path}.skillTypes`, 'expected a non-empty array');
      } else {
        record.skillTypes.forEach((value, index) => {
          if (!SKILL_TYPES_SET.has(value as never)) {
            push(out, `${path}.skillTypes[${index}]`, 'expected a known skill type');
          }
        });
      }
      break;
    case 'eventSkillIdIn':
      validateNonEmptyStringArray(record.skillIds, `${path}.skillIds`, out);
      break;
    case 'eventBuffIdMatch':
      validateNonEmptyStringArray(record.buffIds, `${path}.buffIds`, out);
      break;
    case 'eventBuffEndedEarly':
      break;
    case 'eventBuffTagsMatch':
      requireEnum(record, 'match', TAG_QUERY_TYPES_SET, path, out);
      validateNonEmptyIntegerArray(record.buffTagIds, `${path}.buffTagIds`, out);
      break;
    case 'eventHealTagsMatch':
      requireEnum(record, 'match', TAG_QUERY_TYPES_SET, path, out);
      validateNonEmptyIntegerArray(record.tagIds, `${path}.tagIds`, out);
      break;
    case 'eventOverheal':
      for (const key of ['overHealKey', 'finalHealKey', 'realHealKey'] as const) {
        if (record[key] !== undefined) requireString(record, key, path, out);
      }
      break;
    case 'eventSourceTargetMatch':
      requireEnum(record, 'operator', new Set(['equal', 'notEqual']), path, out);
      break;
    case 'elementalInflictionPresent':
      validateElements(record.elements, `${path}.elements`, out);
      if (record.minimumStacks !== undefined) {
        requireNonNegativeInteger(record, 'minimumStacks', path, out);
      }
      break;
    case 'elementalReactionActive':
      requireEnum(record, 'reaction', ELEMENTAL_REACTIONS_SET, path, out);
      if (record.minimumLevel !== undefined) {
        requireNonNegativeInteger(record, 'minimumLevel', path, out);
      }
      break;
    case 'not':
      validateCombatCondition(record.condition, `${path}.condition`, out, currentTargetAvailable);
      break;
    case 'all':
    case 'any':
      if (!Array.isArray(record.conditions) || record.conditions.length === 0) {
        push(out, `${path}.conditions`, 'expected a non-empty array');
      } else {
        record.conditions.forEach((condition, index) => {
          validateCombatCondition(
            condition,
            `${path}.conditions[${index}]`,
            out,
            currentTargetAvailable,
          );
        });
      }
      break;
    case 'deckAttributeCompare':
      requireEnum(record, 'left', OPERATOR_ATTRIBUTES_SET, path, out);
      requireEnum(record, 'operator', COMPARISON_OPERATORS_SET, path, out);
      requireEnum(record, 'right', OPERATOR_ATTRIBUTES_SET, path, out);
      break;
  }
}

/**
 * StatusModifierDefinition 的严格验证，覆盖全部修正 kind。
 */
function validateStatusModifier(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  const kind = requireString(record, 'kind', path, out);
  if (kind === null || !STATUS_MODIFIER_KINDS_SET.has(kind)) {
    if (kind !== null) push(out, `${path}.kind`, 'unknown status modifier kind');
    return;
  }

  switch (kind) {
    case 'attackPercent':
      validateLevelValues(record.value, `${path}.value`, out);
      break;
    case 'susceptibility':
      if (!Array.isArray(record.damageTypes) || record.damageTypes.length === 0) {
        push(out, `${path}.damageTypes`, 'expected a non-empty array');
      } else {
        record.damageTypes.forEach((damageType, index) => {
          if (typeof damageType !== 'string' || !DAMAGE_TYPES_SET.has(damageType)) {
            push(out, `${path}.damageTypes[${index}]`, 'unknown damage type');
          }
        });
      }
      validateLevelValues(record.value, `${path}.value`, out);
      if (record.attributeScaling !== undefined) {
        const scaling = asRecord(record.attributeScaling, `${path}.attributeScaling`, out);
        if (scaling !== null) {
          requireEnum(
            scaling,
            'attribute',
            OPERATOR_ATTRIBUTES_SET,
            `${path}.attributeScaling`,
            out,
          );
          validateLevelValues(scaling.coefficient, `${path}.attributeScaling.coefficient`, out);
        }
      }
      if (record.cap !== undefined) validateLevelValues(record.cap, `${path}.cap`, out);
      break;
    case 'blockResourceGain':
      requireEnum(record, 'resource', COMBAT_RESOURCES_SET, path, out);
      break;
    case 'resourceCostMultiplier':
      requireEnum(record, 'resource', COMBAT_RESOURCES_SET, path, out);
      requireFiniteNumber(record, 'value', path, out);
      break;
    case 'skillCooldownMultiplier':
      requireString(record, 'skillGroupKey', path, out);
      requireFiniteNumber(record, 'value', path, out);
      break;
    case 'slowed':
      break;
  }
}

/**
 * changeResource / changeResourceByActionValue 的资源变化元数据：
 * 校验 recipient 与资源互斥字段（sp 专属、ultimateEnergy 专属）。
 */
function validateResourceChangeMetadata(
  record: Record<string, unknown>,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  const resource = requireEnum(record, 'resource', COMBAT_RESOURCES_SET, path, out);
  requireEnum(record, 'recipient', RESOURCE_RECIPIENTS_SET, path, out);

  if (record.spGainKind !== undefined) {
    const kind = requireEnum(record, 'spGainKind', SP_GAIN_KINDS_SET, path, out);
    if (kind !== null && resource !== 'sp') {
      push(out, `${path}.spGainKind`, "is only valid when resource is 'sp'");
    }
  }
  if (record.spGainSource !== undefined) {
    const source = requireEnum(record, 'spGainSource', SP_GAIN_SOURCES_SET, path, out);
    if (source !== null && resource !== 'sp') {
      push(out, `${path}.spGainSource`, "is only valid when resource is 'sp'");
    }
  }
  for (const field of ['isPercentValue', 'ignoreUltimateEnergyGainMultiplier'] as const) {
    if (record[field] !== undefined) {
      requireBoolean(record, field, path, out);
      if (resource !== 'ultimateEnergy') {
        push(out, `${path}.${field}`, "is only valid when resource is 'ultimateEnergy'");
      }
    }
  }
  if (record.ultimateRecoveryTagId !== undefined) {
    requireFiniteNumber(record, 'ultimateRecoveryTagId', path, out);
    if (resource !== 'ultimateEnergy') {
      push(out, `${path}.ultimateRecoveryTagId`, "is only valid when resource is 'ultimateEnergy'");
    }
  }
}

/**
 * CombatStep 的严格验证，覆盖全部 kind 及其参数、互斥/条件字段。
 * dealDamage / dealFixedDamage 的非空 key 由调用方通过 collectDamageStepKeys 统一报告。
 */
function validateAbilityEntityChildSkill(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  const child = asRecord(value, path, out);
  if (child === null) return;
  requireString(child, 'skillId', path, out);
  if (child.blackboard !== undefined) {
    const blackboard = asRecord(child.blackboard, `${path}.blackboard`, out);
    if (blackboard !== null) {
      for (const [key, item] of Object.entries(blackboard)) {
        if (key.length === 0) push(out, `${path}.blackboard`, 'contains an empty key');
        validateLevelValues(item, `${path}.blackboard.${key}`, out);
      }
    }
  }
  if (!Array.isArray(child.scheduledSequences)) {
    push(out, `${path}.scheduledSequences`, 'expected an array');
  } else {
    child.scheduledSequences.forEach((sequence, index) =>
      validateScheduledSequence(sequence, `${path}.scheduledSequences[${index}]`, out, true),
    );
  }
}

/** 严格验证可独立保存在干员层级的能力实体蓝图。 */
export function validateAbilityEntityDefinition(
  value: unknown,
  path = '$',
): SkillDefinitionValidationIssue[] {
  const out: SkillDefinitionValidationIssue[] = [];
  const definition = asRecord(value, path, out);
  if (definition === null) return out;
  const lifetimePath = `${path}.lifetime`;
  const lifetime = asRecord(definition.lifetime, lifetimePath, out);
  if (lifetime !== null) {
    if (lifetime.kind !== 'limited' && lifetime.kind !== 'infinite') {
      push(out, `${lifetimePath}.kind`, "expected 'limited' or 'infinite'");
    } else if (lifetime.kind === 'limited') {
      const duration = requireFiniteNumber(lifetime, 'durationSeconds', lifetimePath, out);
      if (duration !== null && duration < 0) {
        push(out, `${lifetimePath}.durationSeconds`, 'expected a non-negative number');
      }
    }
  }
  if (definition.childSkill !== undefined) {
    validateAbilityEntityChildSkill(definition.childSkill, `${path}.childSkill`, out);
  }
  return out;
}

function validateCombatStep(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
  currentTargetAvailable = false,
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  const kind = requireString(record, 'kind', path, out);
  if (kind === null || !STEP_KINDS.has(kind)) {
    if (kind !== null) push(out, `${path}.kind`, 'unknown combat step kind');
    return;
  }
  if (record.key !== undefined && typeof record.key !== 'string') {
    push(out, `${path}.key`, 'expected a string');
  }

  const parameters = asRecord(record.parameters, `${path}.parameters`, out);
  if (parameters === null) return;

  const requireTarget = (): void => {
    requireEnum(parameters, 'target', COMBAT_TARGETS_SET, `${path}.parameters`, out);
  };

  switch (kind) {
    case 'findOwnerSpawnedAbilityEntities': {
      requireString(parameters, 'saveToContextKey', `${path}.parameters`, out);
      if (parameters.saveCountToBlackboardKey !== undefined) {
        requireString(parameters, 'saveCountToBlackboardKey', `${path}.parameters`, out);
      }
      if (parameters.abilityEntityIds !== undefined) {
        validateNonEmptyStringArray(
          parameters.abilityEntityIds,
          `${path}.parameters.abilityEntityIds`,
          out,
        );
      }
      if (parameters.sameSourceSkillCast !== undefined) {
        requireBoolean(parameters, 'sameSourceSkillCast', `${path}.parameters`, out);
      }
      if (parameters.circularOrder !== undefined) {
        const orderPath = `${path}.parameters.circularOrder`;
        const order = asRecord(parameters.circularOrder, orderPath, out);
        if (order !== null) {
          requireString(order, 'indexBlackboardKey', orderPath, out);
          const desiredCount = requireNonNegativeInteger(order, 'desiredCount', orderPath, out);
          if (desiredCount === 0)
            push(out, `${orderPath}.desiredCount`, 'expected a positive integer');
          requireFiniteNumber(order, 'reverseFlag', orderPath, out);
        }
      }
      break;
    }
    case 'pickContextTarget':
      requireString(parameters, 'sourceContextKey', `${path}.parameters`, out);
      requireString(parameters, 'saveToContextKey', `${path}.parameters`, out);
      validateActionValueOperand(parameters.index, `${path}.parameters.index`, out);
      break;
    case 'forEachContextTarget':
      requireString(parameters, 'contextKey', `${path}.parameters`, out);
      break;
    case 'readAbilityEntityRemainingDuration':
      requireString(parameters, 'outputKey', `${path}.parameters`, out);
      if (!currentTargetAvailable) push(out, path, 'requires a forEachContextTarget body');
      break;
    case 'setAbilityEntityRemainingDuration':
      validateActionValueOperand(parameters.value, `${path}.parameters.value`, out);
      if (!currentTargetAvailable) push(out, path, 'requires a forEachContextTarget body');
      break;
    case 'finishCurrentAbilityEntity':
    case 'finishCurrentAbilityEntityWhenSourceDies':
      if (!currentTargetAvailable) push(out, path, 'requires a forEachContextTarget body');
      break;
    case 'startCurrentAbilityEntityChildSkill':
      validateAbilityEntityChildSkill(parameters.childSkill, `${path}.parameters.childSkill`, out);
      if (!currentTargetAvailable) push(out, path, 'requires a forEachContextTarget body');
      break;
    case 'spawnAbilityEntity': {
      requireString(parameters, 'abilityEntityId', `${path}.parameters`, out);
      const definitionPath = `${path}.parameters.definition`;
      const definition =
        parameters.definition === undefined
          ? null
          : asRecord(parameters.definition, definitionPath, out);
      if (definition !== null)
        out.push(...validateAbilityEntityDefinition(definition, definitionPath));
      if (parameters.inheritActionBlackboard !== undefined) {
        requireBoolean(parameters, 'inheritActionBlackboard', `${path}.parameters`, out);
      }
      if (parameters.target !== undefined) {
        if (parameters.target === 'currentAbilityEntity') {
          if (!currentTargetAvailable) push(out, path, 'requires a forEachContextTarget body');
        } else {
          requireTarget();
        }
      }
      if (parameters.overrideDurationSeconds !== undefined) {
        validateActionValueOperand(
          parameters.overrideDurationSeconds,
          `${path}.parameters.overrideDurationSeconds`,
          out,
        );
      }
      if (parameters.saveToContextKey !== undefined) {
        requireString(parameters, 'saveToContextKey', `${path}.parameters`, out);
      }
      requireBoolean(parameters, 'dieWhenSourceDies', `${path}.parameters`, out);
      if (parameters.blackboardAssignments !== undefined) {
        const assignments = asRecord(
          parameters.blackboardAssignments,
          `${path}.parameters.blackboardAssignments`,
          out,
        );
        if (assignments !== null) {
          for (const [key, operand] of Object.entries(assignments)) {
            if (key.length === 0) {
              push(out, `${path}.parameters.blackboardAssignments`, 'contains an empty key');
            }
            validateActionValueOperand(
              operand,
              `${path}.parameters.blackboardAssignments.${key}`,
              out,
            );
          }
        }
      }
      break;
    }
    case 'applyElementalInfliction':
      requireEnum(parameters, 'element', INFLICTION_ELEMENTS_SET, `${path}.parameters`, out);
      requireBoolean(parameters, 'isExtra', `${path}.parameters`, out);
      break;
    case 'applyElementalReaction':
      requireEnum(parameters, 'reaction', ELEMENTAL_REACTIONS_SET, `${path}.parameters`, out);
      requireTarget();
      requireFiniteNumber(parameters, 'durationSeconds', `${path}.parameters`, out);
      requireFiniteNumber(parameters, 'effectiveness', `${path}.parameters`, out);
      break;
    case 'consumeElementalReaction':
      requireEnum(parameters, 'reaction', ELEMENTAL_REACTIONS_SET, `${path}.parameters`, out);
      if (parameters.target !== 'enemy') {
        push(out, `${path}.parameters.target`, "expected 'enemy'");
      }
      break;
    case 'dealDamage': {
      requireEnum(parameters, 'damageType', DAMAGE_TYPES_SET, `${path}.parameters`, out);
      if (parameters.calculation !== undefined) {
        requireEnum(parameters, 'calculation', DAMAGE_CALCULATIONS_SET, `${path}.parameters`, out);
      }
      validateLevelValuesOrActionValueOperand(
        parameters.attackScale,
        `${path}.parameters.attackScale`,
        out,
      );
      if (parameters.calculationMultiplier !== undefined) {
        validateLevelValues(
          parameters.calculationMultiplier,
          `${path}.parameters.calculationMultiplier`,
          out,
        );
        if (parameters.calculation !== 'breakingAttack') {
          push(
            out,
            `${path}.parameters.calculationMultiplier`,
            "requires calculation 'breakingAttack'",
          );
        }
      }
      validateDamageTags(parameters.tags, `${path}.parameters.tags`, out, false);
      if (parameters.features !== undefined) {
        validateDamageFeatures(parameters.features, `${path}.parameters.features`, out);
      }
      if (parameters.stagger !== undefined) {
        validateLevelValuesOrActionValueOperand(
          parameters.stagger,
          `${path}.parameters.stagger`,
          out,
        );
      }
      if (parameters.attackScalePerStatusStack !== undefined) {
        const stack = asRecord(
          parameters.attackScalePerStatusStack,
          `${path}.parameters.attackScalePerStatusStack`,
          out,
        );
        if (stack !== null) {
          requireString(stack, 'statusKey', `${path}.parameters.attackScalePerStatusStack`, out);
          requireEnum(
            stack,
            'target',
            COMBAT_TARGETS_SET,
            `${path}.parameters.attackScalePerStatusStack`,
            out,
          );
          validateLevelValues(
            stack.coefficient,
            `${path}.parameters.attackScalePerStatusStack.coefficient`,
            out,
          );
        }
      }
      break;
    }
    case 'dealFixedDamage': {
      requireEnum(parameters, 'damageType', DAMAGE_TYPES_SET, `${path}.parameters`, out);
      validateLevelValuesOrActionValueOperand(parameters.value, `${path}.parameters.value`, out);
      validateDamageTags(parameters.tags, `${path}.parameters.tags`, out, false);
      if (parameters.features !== undefined) {
        validateDamageFeatures(parameters.features, `${path}.parameters.features`, out);
      }
      if (parameters.stagger !== undefined) {
        validateLevelValuesOrActionValueOperand(
          parameters.stagger,
          `${path}.parameters.stagger`,
          out,
        );
      }
      break;
    }
    case 'dealStagger':
      validateLevelValuesOrActionValueOperand(parameters.value, `${path}.parameters.value`, out);
      break;
    case 'heal':
      requireEnum(parameters, 'target', HEAL_TARGETS_SET, `${path}.parameters`, out);
      if (parameters.alwaysNext !== undefined) {
        requireBoolean(parameters, 'alwaysNext', `${path}.parameters`, out);
      }
      if (parameters.amount === undefined) {
        requireEnum(
          parameters,
          'attribute',
          HEAL_CALCULATION_ATTRIBUTES_SET,
          `${path}.parameters`,
          out,
        );
        validateLevelValuesOrActionValueOperand(
          parameters.multiplier,
          `${path}.parameters.multiplier`,
          out,
        );
        validateLevelValuesOrActionValueOperand(
          parameters.addition,
          `${path}.parameters.addition`,
          out,
        );
      } else {
        validateLevelValuesOrActionValueOperand(
          parameters.amount,
          `${path}.parameters.amount`,
          out,
        );
        for (const key of ['attribute', 'multiplier', 'addition'] as const) {
          if (parameters[key] !== undefined) {
            push(out, `${path}.parameters.${key}`, 'cannot be combined with definite amount');
          }
        }
      }
      if (!Array.isArray(parameters.tagIds)) {
        push(out, `${path}.parameters.tagIds`, 'expected an array');
      } else {
        parameters.tagIds.forEach((value, index) => {
          if (typeof value !== 'number' || !Number.isInteger(value)) {
            push(out, `${path}.parameters.tagIds[${index}]`, 'expected an integer');
          }
        });
      }
      break;
    case 'applyBuff': {
      const buffId = requireString(parameters, 'buffId', `${path}.parameters`, out);
      if (parameters.definition !== undefined && buffId !== null) {
        const definition = asRecord(parameters.definition, `${path}.parameters.definition`, out);
        if (definition !== null) {
          try {
            const {
              presentation,
              scheduledSequences,
              lifecycleSequences,
              abilityEventResponses,
              igniteEventResponses,
              skillSlotReplacements,
              actions,
              maxStackCount,
              ...runtimeDefinition
            } = definition;
            parseCombatBuffDefinitionEntry(
              {
                id: buffId,
                ...runtimeDefinition,
                ...(typeof maxStackCount === 'number' ? { maxStackCount } : {}),
              },
              `${path}.parameters.definition`,
            );
            if (maxStackCount !== undefined && typeof maxStackCount !== 'number') {
              const maxStackPath = `${path}.parameters.definition.maxStackCount`;
              const operand = asRecord(maxStackCount, maxStackPath, out);
              if (operand !== null) {
                requireString(operand, 'blackboardKey', maxStackPath, out);
                for (const key of Object.keys(operand)) {
                  if (key !== 'blackboardKey') {
                    push(out, `${maxStackPath}.${key}`, 'unexpected field');
                  }
                }
              }
            }
            if (actions !== undefined) {
              push(
                out,
                `${path}.parameters.definition.actions`,
                'inline Buff definitions must use lifecycleSequences',
              );
            }
            if (scheduledSequences !== undefined) {
              const scheduledPath = `${path}.parameters.definition.scheduledSequences`;
              if (!Array.isArray(scheduledSequences)) {
                push(out, scheduledPath, 'expected an array');
              } else {
                scheduledSequences.forEach((sequence, index) =>
                  validateScheduledSequence(sequence, `${scheduledPath}[${index}]`, out),
                );
              }
            }
            if (lifecycleSequences !== undefined) {
              const lifecyclePath = `${path}.parameters.definition.lifecycleSequences`;
              const lifecycle = asRecord(lifecycleSequences, lifecyclePath, out);
              if (lifecycle !== null) {
                const supported = new Set([
                  'start',
                  'enable',
                  'disable',
                  'beforeEnhance',
                  'trigger',
                  'enhanceChanged',
                  'afterEnhance',
                  'finish',
                ]);
                for (const [key, sequence] of Object.entries(lifecycle)) {
                  if (!supported.has(key)) {
                    push(out, `${lifecyclePath}.${key}`, 'unknown Buff lifecycle sequence');
                    continue;
                  }
                  validateActionSequence(sequence, `${lifecyclePath}.${key}`, out);
                }
              }
            }
            if (abilityEventResponses !== undefined) {
              const responsesPath = `${path}.parameters.definition.abilityEventResponses`;
              if (!Array.isArray(abilityEventResponses)) {
                push(out, responsesPath, 'expected an array');
              } else {
                for (const [index, value] of abilityEventResponses.entries()) {
                  const responsePath = `${responsesPath}[${index}]`;
                  const response = asRecord(value, responsePath, out);
                  if (response === null) continue;
                  for (const key of Object.keys(response)) {
                    if (!['event', 'priority', 'samePriorityKey', 'sequence'].includes(key)) {
                      push(out, `${responsePath}.${key}`, 'unknown Buff ability event field');
                    }
                  }
                  if (
                    response.event !== 'enterFight' &&
                    response.event !== 'ownerHpZero' &&
                    response.event !== 'beforeTakeDamage' &&
                    response.event !== 'beforeCalculateDamage' &&
                    response.event !== 'beforeTakePhysicalInfliction' &&
                    response.event !== 'beforeTakeSpellInfliction' &&
                    response.event !== 'beforeTakeInfliction' &&
                    response.event !== 'takeDamage' &&
                    response.event !== 'takeCriticalDamage' &&
                    response.event !== 'outputDamage' &&
                    response.event !== 'outputKnockDown' &&
                    response.event !== 'outputHeal' &&
                    response.event !== 'receiveHeal' &&
                    response.event !== 'poiseZero' &&
                    response.event !== 'beforeCastSkill' &&
                    response.event !== 'skillEnd' &&
                    response.event !== 'beforeOutputBuff' &&
                    response.event !== 'outputBuff' &&
                    response.event !== 'addedBuff' &&
                    response.event !== 'finishedBuff' &&
                    response.event !== 'afterOutputWeaknessTriggered' &&
                    response.event !== 'afterKillEntity'
                  ) {
                    push(out, `${responsePath}.event`, 'unsupported Buff ability event');
                  }
                  requireInteger(response, 'priority', responsePath, out);
                  if (
                    response.samePriorityKey !== undefined &&
                    (typeof response.samePriorityKey !== 'string' || !response.samePriorityKey)
                  ) {
                    push(out, `${responsePath}.samePriorityKey`, 'expected a non-empty string');
                  }
                  validateActionSequence(response.sequence, `${responsePath}.sequence`, out);
                }
              }
            }
            if (igniteEventResponses !== undefined) {
              const responsesPath = `${path}.parameters.definition.igniteEventResponses`;
              if (!Array.isArray(igniteEventResponses)) {
                push(out, responsesPath, 'expected an array');
              } else {
                for (const [index, value] of igniteEventResponses.entries()) {
                  const responsePath = `${responsesPath}[${index}]`;
                  const response = asRecord(value, responsePath, out);
                  if (response === null) continue;
                  for (const key of Object.keys(response)) {
                    if (!['igniteType', 'finishAfterIgnited', 'sequence'].includes(key)) {
                      push(out, `${responsePath}.${key}`, 'unknown Buff ignite event field');
                    }
                  }
                  requireString(response, 'igniteType', responsePath, out);
                  if (typeof response.finishAfterIgnited !== 'boolean') {
                    push(out, `${responsePath}.finishAfterIgnited`, 'expected boolean');
                  }
                  validateActionSequence(response.sequence, `${responsePath}.sequence`, out);
                }
              }
            }
            if (skillSlotReplacements !== undefined) {
              const replacementsPath = `${path}.parameters.definition.skillSlotReplacements`;
              if (!Array.isArray(skillSlotReplacements)) {
                push(out, replacementsPath, 'expected an array');
              } else {
                for (const [index, value] of skillSlotReplacements.entries()) {
                  const replacementPath = `${replacementsPath}[${index}]`;
                  const replacement = asRecord(value, replacementPath, out);
                  if (replacement === null) continue;
                  for (const key of Object.keys(replacement)) {
                    if (
                      ![
                        'skillGroupKey',
                        'targetSkillKey',
                        'revertedSkillKey',
                        'inheritOriginSkillCooldownProgress',
                      ].includes(key)
                    ) {
                      push(
                        out,
                        `${replacementPath}.${key}`,
                        'unknown skill slot replacement field',
                      );
                    }
                  }
                  requireString(replacement, 'skillGroupKey', replacementPath, out);
                  requireString(replacement, 'targetSkillKey', replacementPath, out);
                  requireString(replacement, 'revertedSkillKey', replacementPath, out);
                  if (typeof replacement.inheritOriginSkillCooldownProgress !== 'boolean') {
                    push(
                      out,
                      `${replacementPath}.inheritOriginSkillCooldownProgress`,
                      'expected a boolean',
                    );
                  }
                }
              }
            }
            if (
              ((Array.isArray(scheduledSequences) && scheduledSequences.length > 0) ||
                (lifecycleSequences !== undefined &&
                  typeof lifecycleSequences === 'object' &&
                  lifecycleSequences !== null &&
                  Object.keys(lifecycleSequences).length > 0) ||
                (Array.isArray(abilityEventResponses) && abilityEventResponses.length > 0) ||
                (Array.isArray(igniteEventResponses) && igniteEventResponses.length > 0) ||
                (Array.isArray(skillSlotReplacements) && skillSlotReplacements.length > 0)) &&
              parameters.inheritSourceSkillCastInfo !== true
            ) {
              push(
                out,
                `${path}.parameters.inheritSourceSkillCastInfo`,
                'Buff runtime sequences require inherited skill-cast info',
              );
            }
            if (presentation !== undefined) {
              const presentationRecord = asRecord(
                presentation,
                `${path}.parameters.definition.presentation`,
                out,
              );
              if (presentationRecord !== null) {
                for (const key of Object.keys(presentationRecord)) {
                  if (
                    ![
                      'iconId',
                      'iconPath',
                      'visible',
                      'showInHeadBarCommon',
                      'showInHeadBarAttached',
                      'showInSquadIcon',
                      'onlyShowForMainCharacter',
                      'iconStyleInSquad',
                      'abnormalColorType',
                      'orderPriority',
                    ].includes(key)
                  ) {
                    push(
                      out,
                      `${path}.parameters.definition.presentation.${key}`,
                      'unknown Buff presentation field',
                    );
                  }
                }
                if (presentationRecord.iconPath !== undefined) {
                  requireString(
                    presentationRecord,
                    'iconPath',
                    `${path}.parameters.definition.presentation`,
                    out,
                  );
                }
                for (const key of ['iconId', 'iconStyleInSquad', 'abnormalColorType']) {
                  if (presentationRecord[key] !== undefined) {
                    requireString(
                      presentationRecord,
                      key,
                      `${path}.parameters.definition.presentation`,
                      out,
                    );
                  }
                }
                for (const key of [
                  'visible',
                  'showInHeadBarCommon',
                  'showInHeadBarAttached',
                  'showInSquadIcon',
                  'onlyShowForMainCharacter',
                ]) {
                  if (presentationRecord[key] !== undefined) {
                    requireBoolean(
                      presentationRecord,
                      key,
                      `${path}.parameters.definition.presentation`,
                      out,
                    );
                  }
                }
                if (presentationRecord.orderPriority !== undefined) {
                  const order = asRecord(
                    presentationRecord.orderPriority,
                    `${path}.parameters.definition.presentation.orderPriority`,
                    out,
                  );
                  if (order !== null) {
                    for (const key of Object.keys(order)) {
                      if (!['useDirectoryValue', 'value', 'category'].includes(key)) {
                        push(
                          out,
                          `${path}.parameters.definition.presentation.orderPriority.${key}`,
                          'unknown Buff icon order field',
                        );
                      }
                    }
                    requireBoolean(
                      order,
                      'useDirectoryValue',
                      `${path}.parameters.definition.presentation.orderPriority`,
                      out,
                    );
                    requireFiniteNumber(
                      order,
                      'value',
                      `${path}.parameters.definition.presentation.orderPriority`,
                      out,
                    );
                    requireString(
                      order,
                      'category',
                      `${path}.parameters.definition.presentation.orderPriority`,
                      out,
                    );
                  }
                }
              }
            }
          } catch (error) {
            push(
              out,
              `${path}.parameters.definition`,
              error instanceof Error ? error.message : 'invalid Buff definition',
            );
          }
        }
      }
      requireEnum(parameters, 'target', BUFF_APPLICATION_TARGETS_SET, `${path}.parameters`, out);
      if (parameters.target === 'currentAbilityEntity' && !currentTargetAvailable) {
        push(out, path, 'currentAbilityEntity target requires a forEachContextTarget body');
      }
      if (parameters.count !== undefined) {
        validateActionValueOperand(parameters.count, `${path}.parameters.count`, out);
      }
      if (parameters.source !== undefined) {
        requireEnum(parameters, 'source', BUFF_APPLICATION_SOURCES_SET, `${path}.parameters`, out);
        if (parameters.source === 'currentAbilityEntity' && !currentTargetAvailable) {
          push(out, path, 'currentAbilityEntity source requires a forEachContextTarget body');
        }
      }
      if (parameters.blackboardAssignments !== undefined) {
        const assignments = asRecord(
          parameters.blackboardAssignments,
          `${path}.parameters.blackboardAssignments`,
          out,
        );
        if (assignments !== null) {
          for (const [key, operand] of Object.entries(assignments)) {
            validateActionValueOperand(
              operand,
              `${path}.parameters.blackboardAssignments.${key}`,
              out,
            );
          }
        }
      }
      if (parameters.inheritSourceSkillCastInfo !== undefined) {
        requireBoolean(parameters, 'inheritSourceSkillCastInfo', `${path}.parameters`, out);
      }
      if (parameters.finishByAction !== undefined) {
        requireBoolean(parameters, 'finishByAction', `${path}.parameters`, out);
      }
      if (parameters.durationSeconds !== undefined) {
        requireFiniteNumber(parameters, 'durationSeconds', `${path}.parameters`, out);
      }
      if (parameters.effectiveness !== undefined) {
        requireFiniteNumber(parameters, 'effectiveness', `${path}.parameters`, out);
      }
      break;
    }
    case 'applyPhysicalInfliction': {
      if (parameters.type !== 'fracture' && parameters.type !== 'crush') {
        push(out, `${path}.parameters.type`, "expected 'fracture' or 'crush'");
      }
      if (parameters.target !== 'enemy') {
        push(out, `${path}.parameters.target`, "expected 'enemy'");
      }
      requireBoolean(parameters, 'isExtra', `${path}.parameters`, out);
      const noGuardBuffId = requireString(parameters, 'noGuardBuffId', `${path}.parameters`, out);
      const statusBuffId =
        parameters.type === 'crush'
          ? requireString(parameters, 'crushedBuffId', `${path}.parameters`, out)
          : requireString(parameters, 'fractureBuffId', `${path}.parameters`, out);
      const statusDefinitionKey =
        parameters.type === 'crush' ? 'crushedDefinition' : 'fractureDefinition';
      if (parameters.type === 'crush') {
        validateActionValueOperand(
          parameters.damageMultiplier,
          `${path}.parameters.damageMultiplier`,
          out,
        );
        requireBoolean(parameters, 'ignoreHitEffect', `${path}.parameters`, out);
      }
      for (const [definitionKey, buffId] of [
        ['noGuardDefinition', noGuardBuffId],
        [statusDefinitionKey, statusBuffId],
      ] as const) {
        if (buffId === null) continue;
        validateCombatStep(
          {
            kind: 'applyBuff',
            parameters: {
              buffId,
              definition: parameters[definitionKey],
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
            },
          },
          `${path}.parameters.${definitionKey}`,
          out,
          currentTargetAvailable,
        );
      }
      break;
    }
    case 'readBuffBlackboard':
    case 'readBuffStackCount': {
      requireTarget();
      requireString(parameters, 'outputKey', `${path}.parameters`, out);
      if (kind === 'readBuffBlackboard') {
        requireString(parameters, 'desiredKey', `${path}.parameters`, out);
      }
      if (parameters.sameSourceSkillCast !== undefined) {
        requireBoolean(parameters, 'sameSourceSkillCast', `${path}.parameters`, out);
      }
      const query = asRecord(parameters.query, `${path}.parameters.query`, out);
      if (query === null) break;
      const queryKind = requireString(query, 'kind', `${path}.parameters.query`, out);
      if (queryKind === 'id') {
        validateNonEmptyStringArray(query.buffIds, `${path}.parameters.query.buffIds`, out);
      } else if (queryKind === 'tag') {
        requireEnum(query, 'tagQueryType', TAG_QUERY_TYPES_SET, `${path}.parameters.query`, out);
        validateNonEmptyIntegerArray(query.buffTagIds, `${path}.parameters.query.buffTagIds`, out);
      } else if (queryKind === 'environment' && kind !== 'readBuffStackCount') {
        push(out, `${path}.parameters.query.kind`, 'environment is only valid for stack count');
      } else if (queryKind !== 'environment' && queryKind !== null) {
        push(out, `${path}.parameters.query.kind`, "expected 'id', 'tag', or 'environment'");
      }
      break;
    }
    case 'finishBuffsByTag':
      requireEnum(
        parameters,
        'target',
        new Set(['caster', 'enemy', 'currentAbilityEntity']),
        `${path}.parameters`,
        out,
      );
      requireEnum(parameters, 'tagQueryType', TAG_QUERY_TYPES_SET, `${path}.parameters`, out);
      validateNonEmptyIntegerArray(parameters.buffTagIds, `${path}.parameters.buffTagIds`, out);
      requireEnum(parameters, 'reason', BUFF_FINISH_REASONS_SET, `${path}.parameters`, out);
      if (parameters.count !== undefined) {
        validateActionValueOperand(parameters.count, `${path}.parameters.count`, out);
      }
      break;
    case 'finishBuffsById':
      requireEnum(
        parameters,
        'target',
        new Set(BUFF_APPLICATION_TARGETS),
        `${path}.parameters`,
        out,
      );
      validateNonEmptyStringArray(parameters.buffIds, `${path}.parameters.buffIds`, out);
      requireEnum(parameters, 'reason', BUFF_FINISH_REASONS_SET, `${path}.parameters`, out);
      if (parameters.count !== undefined) {
        validateActionValueOperand(parameters.count, `${path}.parameters.count`, out);
      }
      break;
    case 'finishCurrentBuff':
      requireEnum(parameters, 'reason', BUFF_FINISH_REASONS_SET, `${path}.parameters`, out);
      break;
    case 'setCurrentBuffTimePaused':
      requireBoolean(parameters, 'paused', `${path}.parameters`, out);
      break;
    case 'igniteBuffs':
      requireEnum(parameters, 'target', BUFF_SINGLE_TARGETS_SET, `${path}.parameters`, out);
      requireEnum(
        parameters,
        'source',
        new Set([...COMBAT_TARGETS, 'currentBuffSource']),
        `${path}.parameters`,
        out,
      );
      requireString(parameters, 'igniteType', `${path}.parameters`, out);
      break;
    case 'adjustSkillCooldown':
      if (parameters.target !== 'caster') {
        push(out, `${path}.parameters.target`, "expected 'caster'");
      }
      {
        const skill = asRecord(parameters.skill, `${path}.parameters.skill`, out);
        if (skill !== null) {
          if (skill.kind === 'type') {
            requireEnum(skill, 'skillType', SKILL_TYPES_SET, `${path}.parameters.skill`, out);
          } else if (skill.kind === 'id') {
            requireString(skill, 'skillId', `${path}.parameters.skill`, out);
          } else {
            push(out, `${path}.parameters.skill.kind`, "expected 'type' or 'id'");
          }
        }
      }
      if (parameters.operation !== 'reduce' && parameters.operation !== 'set') {
        push(out, `${path}.parameters.operation`, "expected 'reduce' or 'set'");
      }
      if (parameters.basis !== 'baseDurationRatio' && parameters.basis !== 'absoluteSeconds') {
        push(out, `${path}.parameters.basis`, "expected 'baseDurationRatio' or 'absoluteSeconds'");
      }
      if (parameters.operation === 'reduce' && parameters.basis === 'absoluteSeconds') {
        push(out, `${path}.parameters.basis`, "absoluteSeconds is unsupported for 'reduce'");
      }
      validateActionValueOperand(parameters.value, `${path}.parameters.value`, out);
      break;
    case 'outputAirborne':
    case 'outputKnockDown':
      requireTarget();
      break;
    case 'holdBuffsById':
      if (parameters.target !== 'caster') {
        push(out, `${path}.parameters.target`, "expected 'caster'");
      }
      validateNonEmptyStringArray(parameters.buffIds, `${path}.parameters.buffIds`, out);
      break;
    case 'createTimedMarker':
      requireEnum(parameters, 'target', TIMED_MARKER_TARGETS_SET, `${path}.parameters`, out);
      requireString(parameters, 'markerId', `${path}.parameters`, out);
      validateActionValueOperand(
        parameters.durationSeconds,
        `${path}.parameters.durationSeconds`,
        out,
      );
      requireBoolean(parameters, 'autoFinishByAction', `${path}.parameters`, out);
      break;
    case 'createAbilityEntityTimedMarker':
      requireString(parameters, 'markerId', `${path}.parameters`, out);
      validateActionValueOperand(
        parameters.durationSeconds,
        `${path}.parameters.durationSeconds`,
        out,
      );
      requireBoolean(parameters, 'autoFinishByAction', `${path}.parameters`, out);
      requireEnum(parameters, 'timeDomain', new Set(['global', 'self']), `${path}.parameters`, out);
      break;
    case 'startTimeDilation': {
      const parameterPath = `${path}.parameters`;
      const scope = requireEnum(
        parameters,
        'scope',
        new Set(['global', 'entity']),
        parameterPath,
        out,
      );
      validateActionValueOperand(
        parameters.durationSeconds,
        `${parameterPath}.durationSeconds`,
        out,
      );
      requireInteger(parameters, 'slot', parameterPath, out);
      requireInteger(parameters, 'priority', parameterPath, out);
      validateTimeScaleCurve(parameters.curve, `${parameterPath}.curve`, out);
      requireBoolean(parameters, 'finishByAction', parameterPath, out);
      if (scope === 'global') {
        validateCombatTargetArray(
          parameters.ignoredTargets,
          `${parameterPath}.ignoredTargets`,
          out,
          true,
          TIME_DILATION_IGNORE_TARGETS_SET,
        );
        if (parameters.ignoredAbilityEntityTargets !== undefined) {
          validateAbilityEntityTargetQueries(
            parameters.ignoredAbilityEntityTargets,
            `${parameterPath}.ignoredAbilityEntityTargets`,
            out,
          );
        }
        if (parameters.influenceSkillCooldownSeconds !== undefined) {
          validateActionValueOperand(
            parameters.influenceSkillCooldownSeconds,
            `${parameterPath}.influenceSkillCooldownSeconds`,
            out,
          );
        }
      } else if (scope === 'entity') {
        const hasAbilityEntityTargets =
          parameters.abilityEntityTargets === undefined
            ? false
            : validateAbilityEntityTargetQueries(
                parameters.abilityEntityTargets,
                `${parameterPath}.abilityEntityTargets`,
                out,
              );
        validateCombatTargetArray(
          parameters.targets,
          `${parameterPath}.targets`,
          out,
          hasAbilityEntityTargets,
        );
        if (parameters.ignoreSlotCheck !== undefined) {
          requireBoolean(parameters, 'ignoreSlotCheck', parameterPath, out);
        }
      }
      break;
    }
    case 'startUltimateTimeDilation': {
      const parameterPath = `${path}.parameters`;
      requireInteger(parameters, 'priority', parameterPath, out);
      validateActionValueOperand(parameters.targetScale, `${parameterPath}.targetScale`, out);
      validateCombatTargetArray(
        parameters.ignoredTargets,
        `${parameterPath}.ignoredTargets`,
        out,
        true,
        TIME_DILATION_IGNORE_TARGETS_SET,
      );
      if (parameters.ignoredAbilityEntityTargets !== undefined) {
        validateAbilityEntityTargetQueries(
          parameters.ignoredAbilityEntityTargets,
          `${parameterPath}.ignoredAbilityEntityTargets`,
          out,
        );
      }
      break;
    }
    case 'storeCurrentTimelineFrame':
    case 'storeEventSpGainAmount':
      requireString(parameters, 'outputKey', `${path}.parameters`, out);
      break;
    case 'modifyActionValue':
      requireString(parameters, 'key', `${path}.parameters`, out);
      requireEnum(parameters, 'operation', ACTION_VALUE_OPERATIONS_SET, `${path}.parameters`, out);
      validateActionValueOperand(parameters.value, `${path}.parameters.value`, out);
      break;
    case 'calculateActionValue':
      requireString(parameters, 'key', `${path}.parameters`, out);
      requireEnum(
        parameters,
        'operation',
        ACTION_VALUE_CALCULATION_OPERATIONS_SET,
        `${path}.parameters`,
        out,
      );
      validateActionValueOperand(parameters.left, `${path}.parameters.left`, out);
      validateActionValueOperand(parameters.right, `${path}.parameters.right`, out);
      break;
    case 'storeSourceAttributeValue': {
      const parameterPath = `${path}.parameters`;
      const attribute = asRecord(parameters.attribute, `${parameterPath}.attribute`, out);
      if (attribute !== null) {
        const attributeKind = requireString(attribute, 'kind', `${parameterPath}.attribute`, out);
        if (attributeKind === 'specific') {
          requireString(attribute, 'key', `${parameterPath}.attribute`, out);
        } else if (!['main', 'secondary', 'all'].includes(attributeKind ?? '')) {
          push(out, `${parameterPath}.attribute.kind`, 'unknown attribute selection kind');
        }
      }
      requireEnum(
        parameters,
        'stage',
        new Set(['armedNonConverted', 'finalNonConverted']),
        parameterPath,
        out,
      );
      requireBoolean(parameters, 'useFloor', parameterPath, out);
      validateActionValueOperand(parameters.divisor, `${parameterPath}.divisor`, out);
      validateActionValueOperand(parameters.multiplier, `${parameterPath}.multiplier`, out);
      validateActionValueOperand(parameters.base, `${parameterPath}.base`, out);
      requireString(parameters, 'targetKey', parameterPath, out);
      break;
    }
    case 'changeResource':
      validateLevelValues(parameters.amount, `${path}.parameters.amount`, out);
      if (parameters.coefficient !== undefined) {
        validateLevelValues(parameters.coefficient, `${path}.parameters.coefficient`, out);
      }
      validateResourceChangeMetadata(parameters, `${path}.parameters`, out);
      break;
    case 'changeResourceByActionValue':
      validateActionValueOperand(parameters.amount, `${path}.parameters.amount`, out);
      if (parameters.coefficient !== undefined) {
        validateLevelValuesOrActionValueOperand(
          parameters.coefficient,
          `${path}.parameters.coefficient`,
          out,
        );
      }
      validateResourceChangeMetadata(parameters, `${path}.parameters`, out);
      break;
    case 'gainSquadUltimateEnergyFromSkillCost':
      validateLevelValues(parameters.coefficient, `${path}.parameters.coefficient`, out);
      break;
    case 'gainFinisherSp':
      requireFiniteNumber(parameters, 'factor', `${path}.parameters`, out);
      if (parameters.recipient !== 'team') {
        push(out, `${path}.parameters.recipient`, "expected 'team'");
      }
      break;
    case 'applyStatus':
      requireString(parameters, 'statusKey', `${path}.parameters`, out);
      requireTarget();
      if (parameters.durationFrames !== undefined) {
        validateLevelValues(parameters.durationFrames, `${path}.parameters.durationFrames`, out);
      }
      if (parameters.stacks !== undefined) {
        requireNonNegativeInteger(parameters, 'stacks', `${path}.parameters`, out);
      }
      if (parameters.maxStacks !== undefined) {
        requireNonNegativeInteger(parameters, 'maxStacks', `${path}.parameters`, out);
      }
      if (parameters.modifiers !== undefined) {
        if (!Array.isArray(parameters.modifiers)) {
          push(out, `${path}.parameters.modifiers`, 'expected an array');
        } else {
          parameters.modifiers.forEach((modifier, index) => {
            validateStatusModifier(modifier, `${path}.parameters.modifiers[${index}]`, out);
          });
        }
      }
      break;
    case 'consumeStatus':
      requireString(parameters, 'statusKey', `${path}.parameters`, out);
      requireTarget();
      if (parameters.stacks !== undefined) {
        requireNonNegativeInteger(parameters, 'stacks', `${path}.parameters`, out);
      }
      break;
    case 'jumpTimeline':
      requireNonNegativeInteger(parameters, 'destinationFrame', `${path}.parameters`, out);
      if (parameters.condition !== undefined) {
        validateCombatCondition(
          parameters.condition,
          `${path}.parameters.condition`,
          out,
          currentTargetAvailable,
        );
      }
      break;
    case 'finishTimeline':
      break;
    case 'conditional':
      validateCombatCondition(
        parameters.condition,
        `${path}.parameters.condition`,
        out,
        currentTargetAvailable,
      );
      if (parameters.alwaysNext !== undefined && typeof parameters.alwaysNext !== 'boolean') {
        push(out, `${path}.parameters.alwaysNext`, 'expected a boolean');
      }
      break;
    case 'once':
      requireString(parameters, 'scopeKey', `${path}.parameters`, out);
      break;
    case 'repeatEachTick':
      break;
    case 'setContextFlag':
      requireString(parameters, 'flag', `${path}.parameters`, out);
      validateScalar(parameters.value, `${path}.parameters.value`, out);
      if (parameters.target !== 'caster') {
        push(out, `${path}.parameters.target`, "expected 'caster'");
      }
      break;
    case 'openComboWindow':
      requireString(parameters, 'nextSkillKey', `${path}.parameters`, out);
      break;
    case 'changeSkillSlot':
      requireString(parameters, 'skillGroupKey', `${path}.parameters`, out);
      requireString(parameters, 'targetSkillKey', `${path}.parameters`, out);
      if (
        parameters.inheritOriginSkillCooldownProgress !== undefined &&
        typeof parameters.inheritOriginSkillCooldownProgress !== 'boolean'
      ) {
        push(out, `${path}.parameters.inheritOriginSkillCooldownProgress`, 'expected a boolean');
      }
      break;
    case 'listenForCombatEvents':
      if (!Array.isArray(parameters.responses) || parameters.responses.length === 0) {
        push(out, `${path}.parameters.responses`, 'expected a non-empty array');
      } else {
        const keys = new Set<string>();
        parameters.responses.forEach((response, index) => {
          const responsePath = `${path}.parameters.responses[${index}]`;
          const record = asRecord(response, responsePath, out);
          if (record === null) return;
          const key = requireString(record, 'key', responsePath, out);
          if (key !== null) {
            if (keys.has(key)) push(out, `${responsePath}.key`, `duplicate response key '${key}'`);
            keys.add(key);
          }
          validateEventTrigger(record.event, `${responsePath}.event`, out);
          if (
            record.phase !== undefined &&
            record.phase !== 'dataAction' &&
            record.phase !== 'skill'
          ) {
            push(out, `${responsePath}.phase`, "expected 'dataAction' or 'skill'");
          }
          if (record.priority !== undefined) {
            if (typeof record.priority !== 'number' || !Number.isInteger(record.priority)) {
              push(out, `${responsePath}.priority`, 'expected an integer');
            } else if (record.phase !== 'dataAction') {
              push(out, `${responsePath}.priority`, 'requires dataAction phase');
            }
          }
          if (record.condition !== undefined) {
            validateCombatCondition(
              record.condition,
              `${responsePath}.condition`,
              out,
              currentTargetAvailable,
            );
          }
          validateActionSequence(
            record.sequence,
            `${responsePath}.sequence`,
            out,
            currentTargetAvailable,
          );
        });
      }
      break;
  }
}

/** ActionSequenceDefinition：严格按数组顺序同步执行的步骤集合。 */
function validateActionSequence(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
  currentTargetAvailable = false,
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  if (!Array.isArray(record.steps)) {
    push(out, `${path}.steps`, 'expected an array');
    return;
  }
  record.steps.forEach((step, index) => {
    validateCombatStep(step, `${path}.steps[${index}]`, out, currentTargetAvailable);
  });
  // 嵌套结构校验：条件、once 与 Context 迭代必须有对应分支。
  record.steps.forEach((step, index) => {
    const recordStep = asRecord(step, `${path}.steps[${index}]`, out);
    if (recordStep === null) return;
    const stepKind = recordStep.kind;
    if (stepKind === 'conditional') {
      validateActionSequence(
        recordStep.whenTrue,
        `${path}.steps[${index}].whenTrue`,
        out,
        currentTargetAvailable,
      );
      if (recordStep.whenFalse !== undefined) {
        validateActionSequence(
          recordStep.whenFalse,
          `${path}.steps[${index}].whenFalse`,
          out,
          currentTargetAvailable,
        );
      }
    } else if (stepKind === 'once' || stepKind === 'repeatEachTick') {
      validateActionSequence(
        recordStep.body,
        `${path}.steps[${index}].body`,
        out,
        currentTargetAvailable,
      );
    } else if (stepKind === 'forEachContextTarget') {
      validateActionSequence(recordStep.body, `${path}.steps[${index}].body`, out, true);
    }
  });
}

function containsCombatEventListener(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  if (record.kind === 'listenForCombatEvents') return true;
  if (record.kind === 'conditional') {
    return (
      containsCombatEventListener(record.whenTrue) || containsCombatEventListener(record.whenFalse)
    );
  }
  if (
    record.kind === 'once' ||
    record.kind === 'repeatEachTick' ||
    record.kind === 'forEachContextTarget'
  ) {
    return containsCombatEventListener(record.body);
  }
  if (Array.isArray(record.steps)) return record.steps.some(containsCombatEventListener);
  return false;
}

/** ScheduledSequenceDefinition：相对释放帧的调度项。 */
function validateScheduledSequence(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
  currentTargetAvailable = false,
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  const startFrame = requireNonNegativeInteger(record, 'startFrame', path, out);
  if (record.endFrame !== undefined) {
    const endFrame = requireNonNegativeInteger(record, 'endFrame', path, out);
    if (endFrame !== null && startFrame !== null && endFrame < startFrame) {
      push(out, `${path}.endFrame`, 'must not be less than startFrame');
    }
  }
  if (containsCombatEventListener(record.sequence) && record.endFrame === undefined) {
    push(out, `${path}.endFrame`, 'combat event listeners require an end frame');
  }
  validateActionSequence(record.sequence, `${path}.sequence`, out, currentTargetAvailable);
}

/**
 * CombatEventTrigger 的严格验证，覆盖全部事件 kind。
 */
function validateEventTrigger(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  const kind = requireString(record, 'kind', path, out);
  if (kind === null) return;
  switch (kind) {
    case 'operatorHit':
      break;
    case 'operatorHealed':
      if (record.role !== undefined) {
        requireEnum(record, 'role', new Set(['source', 'target']), path, out);
      }
      break;
    case 'buffApplied':
    case 'airborneOutput':
    case 'knockDownOutput':
      break;
    case 'spGained':
      requireEnum(record, 'source', SP_GAIN_SOURCES_SET, path, out);
      requireEnum(record, 'gainKind', SP_GAIN_KINDS_SET, path, out);
      break;
    case 'damageTagHit':
      requireEnum(record, 'tag', DAMAGE_TAGS_SET, path, out);
      requireEnum(record, 'scope', TRIGGER_SCOPES_SET, path, out);
      break;
    case 'elementalInflictionApplied':
      validateElements(record.elements, `${path}.elements`, out);
      requireEnum(record, 'scope', TRIGGER_SCOPES_SET, path, out);
      break;
    case 'skillHit':
      requireString(record, 'skillGroupKey', path, out);
      requireEnum(record, 'scope', TRIGGER_SCOPES_SET, path, out);
      break;
    case 'enemyDefeated':
      requireEnum(record, 'scope', TRIGGER_SCOPES_SET, path, out);
      break;
    case 'statusExpired':
    case 'statusConsumed':
      requireString(record, 'statusKey', path, out);
      requireEnum(record, 'target', COMBAT_TARGETS_SET, path, out);
      break;
    default:
      push(out, `${path}.kind`, 'unknown event trigger kind');
      break;
  }
}

/**
 * 校验独立的等级值。装备、机制等定义可复用此入口，避免复制 SkillDefinition 的基础规则。
 */
export function validateLevelValuesDefinition(
  value: unknown,
  path = '$',
): SkillDefinitionValidationIssue[] {
  const out: SkillDefinitionValidationIssue[] = [];
  validateLevelValues(value, path, out);
  return out;
}

/** 校验独立条件树；调用方负责决定该条件出现在哪种定义中。 */
export function validateCombatConditionDefinition(
  value: unknown,
  path = '$',
): SkillDefinitionValidationIssue[] {
  const out: SkillDefinitionValidationIssue[] = [];
  validateCombatCondition(value, path, out);
  return out;
}

/** 校验独立动作序列；技能、Buff 与配装事件共用同一种顺序语义。 */
export function validateActionSequenceDefinition(
  value: unknown,
  path = '$',
): SkillDefinitionValidationIssue[] {
  const out: SkillDefinitionValidationIssue[] = [];
  validateActionSequence(value, path, out);
  return out;
}

/** 校验独立战斗事件触发器。 */
export function validateCombatEventTriggerDefinition(
  value: unknown,
  path = '$',
): SkillDefinitionValidationIssue[] {
  const out: SkillDefinitionValidationIssue[] = [];
  validateEventTrigger(value, path, out);
  return out;
}

/** CombatEventHandlerDefinition：事件处理器的完整结构。 */
function validateEventHandler(
  value: unknown,
  path: string,
  out: SkillDefinitionValidationIssue[],
): void {
  const record = asRecord(value, path, out);
  if (record === null) return;
  requireString(record, 'key', path, out);
  validateEventTrigger(record.event, `${path}.event`, out);
  if (record.condition !== undefined) {
    validateCombatCondition(record.condition, `${path}.condition`, out);
  }
  if (!Array.isArray(record.scheduledSequences) || record.scheduledSequences.length === 0) {
    push(out, `${path}.scheduledSequences`, 'expected a non-empty array');
  } else {
    record.scheduledSequences.forEach((sequence, index) => {
      validateScheduledSequence(sequence, `${path}.scheduledSequences[${index}]`, out);
    });
  }
}

/**
 * 严格验证 SkillDefinition 的结构与取值，返回问题列表（空数组表示通过）。
 * 调用方传入不可信 unknown；本模块不修改输入，不产生运行时对象。
 */
export function validateSkillDefinition(
  value: unknown,
  path = '$',
): SkillDefinitionValidationIssue[] {
  const out: SkillDefinitionValidationIssue[] = [];
  const record = asRecord(value, path, out);
  if (record === null) return out;

  requireString(record, 'key', path, out);
  requireNonNegativeInteger(record, 'timelineBlockFrames', path, out);

  if (record.blackboard !== undefined) {
    const blackboard = asRecord(record.blackboard, `${path}.blackboard`, out);
    if (blackboard !== null) {
      for (const [key, levelValue] of Object.entries(blackboard)) {
        validateLevelValues(levelValue, `${path}.blackboard.${key}`, out);
      }
    }
  }

  if (record.availability !== undefined) {
    validateCombatCondition(record.availability, `${path}.availability`, out);
  }
  if (record.cooldownFrames !== undefined) {
    validateLevelValues(record.cooldownFrames, `${path}.cooldownFrames`, out);
  }
  if (record.costs !== undefined) {
    if (!Array.isArray(record.costs)) {
      push(out, `${path}.costs`, 'expected an array');
    } else {
      record.costs.forEach((cost, index) => {
        const costRecord = asRecord(cost, `${path}.costs[${index}]`, out);
        if (costRecord !== null) {
          requireEnum(costRecord, 'resource', COMBAT_RESOURCES_SET, `${path}.costs[${index}]`, out);
          validateLevelValues(costRecord.value, `${path}.costs[${index}].value`, out);
        }
      });
    }
  }
  if (record.costFrame !== undefined) {
    requireNonNegativeInteger(record, 'costFrame', path, out);
  }
  if (record.scheduledSequences !== undefined) {
    if (!Array.isArray(record.scheduledSequences)) {
      push(out, `${path}.scheduledSequences`, 'expected an array');
    } else {
      record.scheduledSequences.forEach((sequence, index) => {
        validateScheduledSequence(sequence, `${path}.scheduledSequences[${index}]`, out);
      });
    }
  } else {
    push(out, `${path}.scheduledSequences`, 'expected an array');
  }

  if (record.eventHandlers !== undefined) {
    if (!Array.isArray(record.eventHandlers)) {
      push(out, `${path}.eventHandlers`, 'expected an array');
    } else {
      record.eventHandlers.forEach((handler, index) => {
        validateEventHandler(handler, `${path}.eventHandlers[${index}]`, out);
      });
    }
  }

  // 伤害步骤 key：非空 + 同一 SkillDefinition 内全局唯一。
  // 遍历结果同时携带路径，缺失与重复都能精确定位。
  const seenKeys = new Map<string, string>();
  for (const entry of collectDamageStepKeys(record as never)) {
    if (entry.key.length === 0) {
      push(out, `${path}.${entry.path}`, 'damage step must have a non-empty key');
      continue;
    }
    const previousPath = seenKeys.get(entry.key);
    if (previousPath !== undefined) {
      push(out, `${path}.${entry.path}`, `duplicate damage step key '${entry.key}'`);
    } else {
      seenKeys.set(entry.key, `${path}.${entry.path}`);
    }
  }

  return out;
}
