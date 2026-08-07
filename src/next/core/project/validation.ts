/**
 * 不可信 JSON 进入新版项目模型的顶层校验边界。
 * 加载、导入和迁移结果都必须先通过这里，业务代码不能直接断言外部对象是项目文档。
 */
import {
  EDITABLE_SKILL_CAST_FIELDS,
  PROJECT_FPS,
  PROJECT_KIND,
  PROJECT_SCHEMA_VERSION,
  type EndaxisProjectDocument,
  type JsonObject,
} from './schema';
import {
  ACTION_VALUE_OPERATIONS,
  COMBAT_RESOURCES,
  COMBAT_CONDITION_KINDS,
  COMBAT_STEP_KINDS,
  COMBAT_TARGETS,
  COMPARISON_OPERATORS,
  DAMAGE_CALCULATIONS,
  DAMAGE_TAGS,
  DAMAGE_ELEMENTS,
  DAMAGE_TYPES,
  ELEMENTAL_REACTIONS,
  INFLICTION_ELEMENTS,
  OPERATOR_ATTRIBUTES,
  RESOURCE_RECIPIENTS,
  SP_GAIN_KINDS,
  STATUS_MODIFIER_KINDS,
} from '../game-data/operatorDefinition';
import {
  validateBattle,
  validateEditor,
  validateEnemy,
  validateGearBuild,
  validateGlobalConfig,
  validateMechanics,
  validateOperatorBuild,
  validateWeaponBuild,
} from './scenarioValidation';
import {
  isObject,
  requireBoolean,
  requireEnum,
  requireFiniteNumber,
  requireInteger,
  requireNonNegativeInteger,
  requirePositiveInteger,
  requireString,
  validateEditedFields,
  type ValidationIssue,
} from './validationHelpers';

export type { ValidationIssue } from './validationHelpers';

const combatStepKinds = new Set<string>(COMBAT_STEP_KINDS);
const combatResources = new Set<string>(COMBAT_RESOURCES);
const combatConditionKinds = new Set<string>(COMBAT_CONDITION_KINDS);
const combatTargets = new Set<string>(COMBAT_TARGETS);
const comparisonOperators = new Set<string>(COMPARISON_OPERATORS);
const damageCalculations = new Set<string>(DAMAGE_CALCULATIONS);
const damageElements = new Set<string>(DAMAGE_ELEMENTS);
const inflictionElements = new Set<string>(INFLICTION_ELEMENTS);
const damageTypes = new Set<string>(DAMAGE_TYPES);
const damageTags = new Set<string>(DAMAGE_TAGS);
const elementalReactions = new Set<string>(ELEMENTAL_REACTIONS);
const operatorAttributes = new Set<string>(OPERATOR_ATTRIBUTES);
const resourceRecipients = new Set<string>(RESOURCE_RECIPIENTS);
const spGainKinds = new Set<string>(SP_GAIN_KINDS);
const statusModifierKinds = new Set<string>(STATUS_MODIFIER_KINDS);
const gameplayTagQueryTypes = new Set<string>(['hasAny', 'hasAll', 'exceptAny', 'exceptAll']);
const actionBuffFinishReasons = new Set<string>(['early', 'absorbed', 'other']);
const actionValueOperations = new Set<string>(ACTION_VALUE_OPERATIONS);
const editableSkillCastFields = new Set<string>(EDITABLE_SKILL_CAST_FIELDS);

/** 严格校验后的项目或完整问题列表；失败值不得进入领域层。 */
export type ValidationResult =
  { ok: true; value: EndaxisProjectDocument } | { ok: false; issues: ValidationIssue[] };

function validateLevelValues(value: unknown, path: string, issues: ValidationIssue[]): void {
  if (typeof value === 'number') {
    requireFiniteNumber(value, path, issues);
    return;
  }
  if (!Array.isArray(value) || value.length === 0) {
    issues.push({ path, message: 'expected a finite number or non-empty level-value array' });
    return;
  }
  value.forEach((entry, index) => requireFiniteNumber(entry, `${path}[${index}]`, issues));
}

function validateNonEmptyStringArray(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!Array.isArray(value) || value.length === 0) {
    issues.push({ path, message: 'expected a non-empty array' });
    return;
  }
  value.forEach((entry, index) => {
    if (typeof entry !== 'string' || entry.length === 0) {
      issues.push({ path: `${path}[${index}]`, message: 'expected a non-empty string' });
    }
  });
}

function validateCombatCondition(value: unknown, path: string, issues: ValidationIssue[]): void {
  if (!isObject(value)) {
    issues.push({ path, message: 'expected an object' });
    return;
  }

  const kind = requireString(value, 'kind', path, issues);
  if (kind === null || !combatConditionKinds.has(kind)) {
    if (kind !== null) issues.push({ path: `${path}.kind`, message: 'unknown condition kind' });
    return;
  }

  switch (kind) {
    case 'skillBranchEnabled':
      requireString(value, 'branchKey', path, issues);
      break;
    case 'targetStaggered':
      requireEnum(value.target, combatTargets, `${path}.target`, issues);
      break;
    case 'contextFlagEquals':
      requireString(value, 'flag', path, issues);
      if (
        typeof value.value !== 'boolean' &&
        typeof value.value !== 'number' &&
        typeof value.value !== 'string'
      ) {
        issues.push({ path: `${path}.value`, message: 'expected a boolean, number, or string' });
      }
      break;
    case 'actionValueCompare':
      validateActionValueOperand(value.left, `${path}.left`, issues);
      requireEnum(value.operator, comparisonOperators, `${path}.operator`, issues);
      validateActionValueOperand(value.right, `${path}.right`, issues);
      break;
    case 'statusActive':
      requireString(value, 'statusKey', path, issues);
      requireEnum(value.target, combatTargets, `${path}.target`, issues);
      if (value.minimumStacks !== undefined) {
        requireNonNegativeInteger(value.minimumStacks, `${path}.minimumStacks`, issues);
      }
      break;
    case 'buffStackCompare':
      requireEnum(value.target, combatTargets, `${path}.target`, issues);
      requireEnum(value.tagQueryType, gameplayTagQueryTypes, `${path}.tagQueryType`, issues);
      if (!Array.isArray(value.buffTagIds) || value.buffTagIds.length === 0) {
        issues.push({ path: `${path}.buffTagIds`, message: 'expected a non-empty array' });
      } else {
        value.buffTagIds.forEach((tagId, index) =>
          requireInteger(tagId, `${path}.buffTagIds[${index}]`, issues),
        );
      }
      requireEnum(value.operator, comparisonOperators, `${path}.operator`, issues);
      requireFiniteNumber(value.value, `${path}.value`, issues);
      break;
    case 'buffIdStackCompare':
      requireEnum(value.target, combatTargets, `${path}.target`, issues);
      validateNonEmptyStringArray(value.buffIds, `${path}.buffIds`, issues);
      requireEnum(value.operator, comparisonOperators, `${path}.operator`, issues);
      requireFiniteNumber(value.value, `${path}.value`, issues);
      break;
    case 'elementalInflictionPresent': {
      const elements = Array.isArray(value.elements) ? value.elements : [value.elements];
      elements.forEach((element, index) =>
        requireEnum(element, damageElements, `${path}.elements[${index}]`, issues),
      );
      if (value.minimumStacks !== undefined) {
        requireNonNegativeInteger(value.minimumStacks, `${path}.minimumStacks`, issues);
      }
      break;
    }
    case 'elementalReactionActive':
      requireEnum(value.reaction, elementalReactions, `${path}.reaction`, issues);
      if (value.minimumLevel !== undefined) {
        requireNonNegativeInteger(value.minimumLevel, `${path}.minimumLevel`, issues);
      }
      break;
    case 'not':
      validateCombatCondition(value.condition, `${path}.condition`, issues);
      break;
    case 'all':
    case 'any':
      if (!Array.isArray(value.conditions) || value.conditions.length === 0) {
        issues.push({ path: `${path}.conditions`, message: 'expected a non-empty array' });
      } else {
        value.conditions.forEach((condition, index) =>
          validateCombatCondition(condition, `${path}.conditions[${index}]`, issues),
        );
      }
      break;
    case 'deckAttributeCompare':
      requireEnum(value.left, operatorAttributes, `${path}.left`, issues);
      requireEnum(value.operator, comparisonOperators, `${path}.operator`, issues);
      requireEnum(value.right, operatorAttributes, `${path}.right`, issues);
      break;
  }
}

function validateActionValueOperand(value: unknown, path: string, issues: ValidationIssue[]): void {
  if (!isObject(value)) {
    issues.push({ path, message: 'expected an object' });
    return;
  }
  const kind = requireString(value, 'kind', path, issues);
  if (kind === 'blackboard') {
    requireString(value, 'key', path, issues);
  } else if (kind === 'constant') {
    requireFiniteNumber(value.value, `${path}.value`, issues);
  } else if (kind !== null) {
    issues.push({ path: `${path}.kind`, message: 'unknown action value operand kind' });
  }
}

function validateStatusModifier(value: unknown, path: string, issues: ValidationIssue[]): void {
  if (!isObject(value)) {
    issues.push({ path, message: 'expected an object' });
    return;
  }
  const kind = requireString(value, 'kind', path, issues);
  if (kind === null || !statusModifierKinds.has(kind)) {
    if (kind !== null)
      issues.push({ path: `${path}.kind`, message: 'unknown status modifier kind' });
    return;
  }

  switch (kind) {
    case 'attackPercent':
      validateLevelValues(value.value, `${path}.value`, issues);
      break;
    case 'susceptibility':
      if (!Array.isArray(value.damageTypes) || value.damageTypes.length === 0) {
        issues.push({ path: `${path}.damageTypes`, message: 'expected a non-empty array' });
      } else {
        value.damageTypes.forEach((damageType, index) =>
          requireEnum(damageType, damageTypes, `${path}.damageTypes[${index}]`, issues),
        );
      }
      validateLevelValues(value.value, `${path}.value`, issues);
      if (value.attributeScaling !== undefined) {
        if (!isObject(value.attributeScaling)) {
          issues.push({ path: `${path}.attributeScaling`, message: 'expected an object' });
        } else {
          requireEnum(
            value.attributeScaling.attribute,
            operatorAttributes,
            `${path}.attributeScaling.attribute`,
            issues,
          );
          validateLevelValues(
            value.attributeScaling.coefficient,
            `${path}.attributeScaling.coefficient`,
            issues,
          );
        }
      }
      if (value.cap !== undefined) validateLevelValues(value.cap, `${path}.cap`, issues);
      break;
    case 'blockResourceGain':
    case 'resourceCostMultiplier':
      requireEnum(value.resource, combatResources, `${path}.resource`, issues);
      if (kind === 'resourceCostMultiplier') {
        requireFiniteNumber(value.value, `${path}.value`, issues);
      }
      break;
    case 'skillCooldownMultiplier':
      requireString(value, 'skillGroupKey', path, issues);
      requireFiniteNumber(value.value, `${path}.value`, issues);
      break;
  }
}

function validateCombatStepParameters(
  kind: string,
  parameters: JsonObject,
  path: string,
  issues: ValidationIssue[],
): void {
  const requireTarget = () =>
    requireEnum(parameters.target, combatTargets, `${path}.target`, issues);

  switch (kind) {
    case 'applyElementalInfliction':
      requireEnum(parameters.element, inflictionElements, `${path}.element`, issues);
      requireBoolean(parameters.isExtra, `${path}.isExtra`, issues);
      break;
    case 'applyElementalReaction':
      requireEnum(parameters.reaction, elementalReactions, `${path}.reaction`, issues);
      requireTarget();
      requireFiniteNumber(parameters.durationSeconds, `${path}.durationSeconds`, issues);
      requireFiniteNumber(parameters.effectiveness, `${path}.effectiveness`, issues);
      break;
    case 'consumeElementalReaction':
      requireEnum(parameters.reaction, elementalReactions, `${path}.reaction`, issues);
      if (parameters.target !== 'enemy') {
        issues.push({ path: `${path}.target`, message: "expected 'enemy'" });
      }
      break;
    case 'dealDamage':
      requireEnum(parameters.damageType, damageTypes, `${path}.damageType`, issues);
      if (parameters.calculation !== undefined) {
        requireEnum(parameters.calculation, damageCalculations, `${path}.calculation`, issues);
      }
      validateLevelValues(parameters.attackScale, `${path}.attackScale`, issues);
      if (parameters.calculationMultiplier !== undefined) {
        validateLevelValues(
          parameters.calculationMultiplier,
          `${path}.calculationMultiplier`,
          issues,
        );
        if (parameters.calculation !== 'breakingAttack') {
          issues.push({
            path: `${path}.calculationMultiplier`,
            message: "requires calculation 'breakingAttack'",
          });
        }
      }
      if (!Array.isArray(parameters.tags)) {
        issues.push({ path: `${path}.tags`, message: 'expected an array' });
      } else {
        parameters.tags.forEach((tag, index) =>
          requireEnum(tag, damageTags, `${path}.tags[${index}]`, issues),
        );
      }
      if (parameters.stagger !== undefined) {
        validateLevelValues(parameters.stagger, `${path}.stagger`, issues);
      }
      if (parameters.attackScalePerStatusStack !== undefined) {
        if (!isObject(parameters.attackScalePerStatusStack)) {
          issues.push({
            path: `${path}.attackScalePerStatusStack`,
            message: 'expected an object',
          });
        } else {
          requireString(
            parameters.attackScalePerStatusStack,
            'statusKey',
            `${path}.attackScalePerStatusStack`,
            issues,
          );
          requireEnum(
            parameters.attackScalePerStatusStack.target,
            combatTargets,
            `${path}.attackScalePerStatusStack.target`,
            issues,
          );
          validateLevelValues(
            parameters.attackScalePerStatusStack.coefficient,
            `${path}.attackScalePerStatusStack.coefficient`,
            issues,
          );
        }
      }
      break;
    case 'applyBuff':
      requireString(parameters, 'buffId', path, issues);
      requireTarget();
      if (parameters.durationSeconds !== undefined)
        requireFiniteNumber(parameters.durationSeconds, `${path}.durationSeconds`, issues);
      if (parameters.effectiveness !== undefined)
        requireFiniteNumber(parameters.effectiveness, `${path}.effectiveness`, issues);
      break;
    case 'readBuffBlackboard':
      requireTarget();
      requireEnum(parameters.tagQueryType, gameplayTagQueryTypes, `${path}.tagQueryType`, issues);
      if (!Array.isArray(parameters.buffTagIds) || parameters.buffTagIds.length === 0) {
        issues.push({ path: `${path}.buffTagIds`, message: 'expected a non-empty array' });
      } else {
        parameters.buffTagIds.forEach((tagId, index) =>
          requireInteger(tagId, `${path}.buffTagIds[${index}]`, issues),
        );
      }
      requireString(parameters, 'desiredKey', path, issues);
      requireString(parameters, 'outputKey', path, issues);
      break;
    case 'finishBuffsByTag':
      requireTarget();
      requireEnum(parameters.tagQueryType, gameplayTagQueryTypes, `${path}.tagQueryType`, issues);
      if (!Array.isArray(parameters.buffTagIds) || parameters.buffTagIds.length === 0) {
        issues.push({ path: `${path}.buffTagIds`, message: 'expected a non-empty array' });
      } else {
        parameters.buffTagIds.forEach((tagId, index) =>
          requireInteger(tagId, `${path}.buffTagIds[${index}]`, issues),
        );
      }
      requireEnum(parameters.reason, actionBuffFinishReasons, `${path}.reason`, issues);
      break;
    case 'finishBuffsById':
      requireTarget();
      validateNonEmptyStringArray(parameters.buffIds, `${path}.buffIds`, issues);
      requireEnum(parameters.reason, actionBuffFinishReasons, `${path}.reason`, issues);
      break;
    case 'modifyActionValue':
      requireString(parameters, 'key', path, issues);
      requireEnum(parameters.operation, actionValueOperations, `${path}.operation`, issues);
      validateActionValueOperand(parameters.value, `${path}.value`, issues);
      break;
    case 'changeResource':
      requireEnum(parameters.resource, combatResources, `${path}.resource`, issues);
      validateLevelValues(parameters.amount, `${path}.amount`, issues);
      requireEnum(parameters.recipient, resourceRecipients, `${path}.recipient`, issues);
      if (parameters.spGainKind !== undefined) {
        requireEnum(parameters.spGainKind, spGainKinds, `${path}.spGainKind`, issues);
        if (parameters.resource !== 'sp') {
          issues.push({
            path: `${path}.spGainKind`,
            message: "is only valid when resource is 'sp'",
          });
        }
      }
      break;
    case 'gainSquadUltimateEnergyFromSkillCost':
      validateLevelValues(parameters.coefficient, `${path}.coefficient`, issues);
      break;
    case 'gainFinisherSp':
      requireFiniteNumber(parameters.factor, `${path}.factor`, issues);
      if (parameters.recipient !== 'team') {
        issues.push({ path: `${path}.recipient`, message: "expected 'team'" });
      }
      break;
    case 'applyStatus':
      requireString(parameters, 'statusKey', path, issues);
      requireTarget();
      if (parameters.durationFrames !== undefined) {
        validateLevelValues(parameters.durationFrames, `${path}.durationFrames`, issues);
      }
      if (parameters.stacks !== undefined) {
        requireNonNegativeInteger(parameters.stacks, `${path}.stacks`, issues);
      }
      if (parameters.maxStacks !== undefined) {
        requireNonNegativeInteger(parameters.maxStacks, `${path}.maxStacks`, issues);
      }
      if (parameters.modifiers !== undefined) {
        if (!Array.isArray(parameters.modifiers)) {
          issues.push({ path: `${path}.modifiers`, message: 'expected an array' });
        } else {
          parameters.modifiers.forEach((modifier, index) =>
            validateStatusModifier(modifier, `${path}.modifiers[${index}]`, issues),
          );
        }
      }
      break;
    case 'consumeStatus':
      requireString(parameters, 'statusKey', path, issues);
      requireTarget();
      if (parameters.stacks !== undefined) {
        requireNonNegativeInteger(parameters.stacks, `${path}.stacks`, issues);
      }
      break;
    case 'conditional':
      validateCombatCondition(parameters.condition, `${path}.condition`, issues);
      break;
    case 'setContextFlag':
      requireString(parameters, 'flag', path, issues);
      if (
        typeof parameters.value !== 'boolean' &&
        typeof parameters.value !== 'number' &&
        typeof parameters.value !== 'string'
      ) {
        issues.push({ path: `${path}.value`, message: 'expected a boolean, number, or string' });
      }
      if (parameters.target !== 'caster') {
        issues.push({ path: `${path}.target`, message: "expected 'caster'" });
      }
      break;
  }
}

function collectBuildIds(
  builds: JsonObject,
  key: 'operators' | 'weapons' | 'gears',
  path: string,
  issues: ValidationIssue[],
): Set<string> {
  const collection = builds[key];
  if (!isObject(collection)) {
    issues.push({ path: `${path}.${key}`, message: 'expected an object' });
    return new Set();
  }

  const ids = new Set<string>();
  for (const [recordKey, value] of Object.entries(collection)) {
    if (!isObject(value)) {
      issues.push({ path: `${path}.${key}.${recordKey}`, message: 'expected an object' });
      continue;
    }
    const id = requireString(value, 'id', `${path}.${key}.${recordKey}`, issues);
    if (id !== null && id !== recordKey) {
      issues.push({
        path: `${path}.${key}.${recordKey}.id`,
        message: 'build id must match its record key',
      });
    }
    if (id !== null) ids.add(id);

    if (key === 'operators') validateOperatorBuild(value, `${path}.${key}.${recordKey}`, issues);
    if (key === 'weapons') validateWeaponBuild(value, `${path}.${key}.${recordKey}`, issues);
    if (key === 'gears') validateGearBuild(value, `${path}.${key}.${recordKey}`, issues);
  }
  return ids;
}

function collectDamageHitIds(
  sequence: JsonObject,
  path: string,
  damageHitIds: Set<string>,
  issues: ValidationIssue[],
): void {
  if (!Array.isArray(sequence.steps)) {
    issues.push({ path: `${path}.steps`, message: 'expected an array' });
    return;
  }

  sequence.steps.forEach((step, stepIndex) => {
    const stepPath = `${path}.steps[${stepIndex}]`;
    if (!isObject(step)) {
      issues.push({ path: stepPath, message: 'expected an object' });
      return;
    }
    const stepKind = requireString(step, 'kind', stepPath, issues);
    if (stepKind !== null && !combatStepKinds.has(stepKind)) {
      issues.push({ path: `${stepPath}.kind`, message: 'unknown combat step kind' });
    }
    if (step.sourceStepKey !== undefined) {
      requireString(step, 'sourceStepKey', stepPath, issues);
    }
    if (stepKind === 'dealDamage') {
      const hitId = requireString(step, 'hitId', stepPath, issues);
      if (hitId !== null && damageHitIds.has(hitId)) {
        issues.push({
          path: `${stepPath}.hitId`,
          message: 'duplicate damage hit id in skill cast',
        });
      }
      if (hitId !== null) damageHitIds.add(hitId);
    } else if (step.hitId !== undefined) {
      issues.push({
        path: `${stepPath}.hitId`,
        message: 'only damage steps may define a hit id',
      });
    }
    if (!isObject(step.parameters)) {
      issues.push({ path: `${stepPath}.parameters`, message: 'expected an object' });
    } else if (stepKind !== null && combatStepKinds.has(stepKind)) {
      validateCombatStepParameters(stepKind, step.parameters, `${stepPath}.parameters`, issues);
    }
    if (!Array.isArray(step.edited)) {
      issues.push({ path: `${stepPath}.edited`, message: 'expected an array' });
    }
    if (stepKind === 'conditional') {
      if (!isObject(step.whenTrue)) {
        issues.push({ path: `${stepPath}.whenTrue`, message: 'expected an object' });
      } else {
        collectDamageHitIds(step.whenTrue, `${stepPath}.whenTrue`, damageHitIds, issues);
      }
      if (step.whenFalse !== undefined) {
        if (!isObject(step.whenFalse)) {
          issues.push({ path: `${stepPath}.whenFalse`, message: 'expected an object' });
        } else {
          collectDamageHitIds(step.whenFalse, `${stepPath}.whenFalse`, damageHitIds, issues);
        }
      }
    } else {
      if (step.onImpact !== undefined) {
        issues.push({
          path: `${stepPath}.onImpact`,
          message: 'combat steps may not use onImpact',
        });
      }
      if (step.whenTrue !== undefined || step.whenFalse !== undefined) {
        issues.push({
          path: step.whenTrue !== undefined ? `${stepPath}.whenTrue` : `${stepPath}.whenFalse`,
          message: 'only conditional steps may use branches',
        });
      }
    }
  });
}

function validateSkillCast(
  value: unknown,
  path: string,
  skillCastIds: Set<string>,
  damageHitIdsByCast: Map<string, Set<string>>,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    issues.push({ path, message: 'expected an object' });
    return;
  }

  const id = requireString(value, 'id', path, issues);
  if (id !== null) {
    if (skillCastIds.has(id)) {
      issues.push({ path: `${path}.id`, message: 'duplicate skill cast id' });
    }
    skillCastIds.add(id);
  }

  if (!isObject(value.source)) {
    issues.push({ path: `${path}.source`, message: 'expected an object' });
  } else {
    const sourcePath = `${path}.source`;
    const sourceKind = requireString(value.source, 'kind', sourcePath, issues);
    if (sourceKind === 'operatorSkill') {
      requireString(value.source, 'skillGroupKey', sourcePath, issues);
      requireString(value.source, 'skillKey', sourcePath, issues);
    } else if (sourceKind === 'weaponSkill') {
      requireString(value.source, 'skillKey', sourcePath, issues);
    } else if (sourceKind === 'custom') {
      requireString(value.source, 'actionType', sourcePath, issues);
      requireString(value.source, 'name', sourcePath, issues);
      if (value.source.element !== undefined) {
        requireEnum(value.source.element, damageElements, `${sourcePath}.element`, issues);
      }
      if (value.source.iconKey !== undefined) {
        requireString(value.source, 'iconKey', sourcePath, issues);
      }
    } else if (sourceKind !== null) {
      issues.push({ path: `${sourcePath}.kind`, message: 'unknown skill cast source kind' });
    }
  }

  if (!isObject(value.placement)) {
    issues.push({ path: `${path}.placement`, message: 'expected an object' });
  } else {
    requireNonNegativeInteger(value.placement.startFrame, `${path}.placement.startFrame`, issues);
  }

  if (value.placementGroup !== undefined) {
    const groupPath = `${path}.placementGroup`;
    if (!isObject(value.placementGroup)) {
      issues.push({ path: groupPath, message: 'expected an object' });
    } else {
      requireString(value.placementGroup, 'id', groupPath, issues);
      requireString(value.placementGroup, 'skillGroupKey', groupPath, issues);
      requireNonNegativeInteger(value.placementGroup.index, `${groupPath}.index`, issues);
      requirePositiveInteger(value.placementGroup.total, `${groupPath}.total`, issues);
      if (
        typeof value.placementGroup.index === 'number' &&
        typeof value.placementGroup.total === 'number' &&
        value.placementGroup.index >= value.placementGroup.total
      ) {
        issues.push({ path: `${groupPath}.index`, message: 'must be less than total' });
      }
    }
  }

  if (!isObject(value.editable)) {
    issues.push({ path: `${path}.editable`, message: 'expected an object' });
    return;
  }

  requireNonNegativeInteger(
    value.editable.durationFrames,
    `${path}.editable.durationFrames`,
    issues,
  );
  for (const field of [
    'cooldownFrames',
    'comboFollowupDelayFrames',
    'triggerWindowFrames',
    'spCost',
    'ultimateEnergyCost',
  ]) {
    if (value.editable[field] !== undefined) {
      requireNonNegativeInteger(value.editable[field], `${path}.editable.${field}`, issues);
    }
  }
  requireBoolean(value.editable.locked, `${path}.editable.locked`, issues);
  requireBoolean(value.editable.disabled, `${path}.editable.disabled`, issues);
  if (value.editable.linked !== undefined) {
    requireBoolean(value.editable.linked, `${path}.editable.linked`, issues);
  }
  if (
    value.editable.color !== undefined &&
    value.editable.color !== null &&
    typeof value.editable.color !== 'string'
  ) {
    issues.push({ path: `${path}.editable.color`, message: 'expected a string or null' });
  }
  if (value.editable.enhancement !== undefined) {
    const enhancementPath = `${path}.editable.enhancement`;
    if (!isObject(value.editable.enhancement)) {
      issues.push({ path: enhancementPath, message: 'expected an object' });
    } else if (value.editable.enhancement.kind === 'duration') {
      requireNonNegativeInteger(
        value.editable.enhancement.frames,
        `${enhancementPath}.frames`,
        issues,
      );
    } else if (value.editable.enhancement.kind === 'status') {
      requireString(value.editable.enhancement, 'statusId', enhancementPath, issues);
    } else {
      issues.push({ path: `${enhancementPath}.kind`, message: 'unknown enhancement kind' });
    }
  }
  if (!Array.isArray(value.editable.scheduledSequences)) {
    issues.push({ path: `${path}.editable.scheduledSequences`, message: 'expected an array' });
    return;
  }

  const damageHitIds = new Set<string>();
  if (id !== null) damageHitIdsByCast.set(id, damageHitIds);
  const scheduledSequenceIds = new Set<string>();
  value.editable.scheduledSequences.forEach((scheduledSequence, sequenceIndex) => {
    const sequencePath = `${path}.editable.scheduledSequences[${sequenceIndex}]`;
    if (!isObject(scheduledSequence)) {
      issues.push({ path: sequencePath, message: 'expected an object' });
      return;
    }
    const sequenceId = requireString(scheduledSequence, 'id', sequencePath, issues);
    if (sequenceId !== null) {
      if (scheduledSequenceIds.has(sequenceId)) {
        issues.push({ path: `${sequencePath}.id`, message: 'duplicate scheduled sequence id' });
      }
      scheduledSequenceIds.add(sequenceId);
    }
    requireNonNegativeInteger(scheduledSequence.startFrame, `${sequencePath}.startFrame`, issues);
    if (!isObject(scheduledSequence.sequence)) {
      issues.push({ path: `${sequencePath}.sequence`, message: 'expected an object' });
      return;
    }
    collectDamageHitIds(
      scheduledSequence.sequence,
      `${sequencePath}.sequence`,
      damageHitIds,
      issues,
    );
    const allowedSequenceEdits = new Set(['startFrame', 'sequence']);
    validateEditedFields(
      scheduledSequence.edited,
      allowedSequenceEdits,
      `${sequencePath}.edited`,
      issues,
    );
  });

  if (!Array.isArray(value.editable.customBars)) {
    issues.push({ path: `${path}.editable.customBars`, message: 'expected an array' });
  } else {
    const customBarIds = new Set<string>();
    value.editable.customBars.forEach((bar, index) => {
      const barPath = `${path}.editable.customBars[${index}]`;
      if (!isObject(bar)) {
        issues.push({ path: barPath, message: 'expected an object' });
        return;
      }
      const barId = requireString(bar, 'id', barPath, issues);
      if (barId !== null && customBarIds.has(barId)) {
        issues.push({ path: `${barPath}.id`, message: 'duplicate custom bar id' });
      }
      if (barId !== null) customBarIds.add(barId);
      if (typeof bar.text !== 'string') {
        issues.push({ path: `${barPath}.text`, message: 'expected a string' });
      }
      requireInteger(bar.offsetFrames, `${barPath}.offsetFrames`, issues);
      requireNonNegativeInteger(bar.durationFrames, `${barPath}.durationFrames`, issues);
      if (bar.color !== undefined && typeof bar.color !== 'string') {
        issues.push({ path: `${barPath}.color`, message: 'expected a string' });
      }
    });
  }

  validateEditedFields(value.edited, editableSkillCastFields, `${path}.edited`, issues);
}

function validateEndpoint(
  value: unknown,
  path: string,
  skillCastIds: Set<string>,
  damageHitIdsByCast: Map<string, Set<string>>,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    issues.push({ path, message: 'expected an object' });
    return;
  }
  const skillCastId = requireString(value, 'skillCastId', path, issues);
  if (skillCastId !== null && !skillCastIds.has(skillCastId)) {
    issues.push({ path: `${path}.skillCastId`, message: 'unknown skill cast reference' });
  }
  if (value.kind === 'damageHit') {
    const hitId = requireString(value, 'hitId', path, issues);
    if (
      skillCastId !== null &&
      hitId !== null &&
      !damageHitIdsByCast.get(skillCastId)?.has(hitId)
    ) {
      issues.push({
        path: `${path}.hitId`,
        message: 'unknown damage hit reference',
      });
    }
  } else if (value.kind !== 'skillCast') {
    issues.push({ path: `${path}.kind`, message: "expected 'skillCast' or 'damageHit'" });
  }
}

export function validateProjectDocument(value: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  if (!isObject(value)) {
    return { ok: false, issues: [{ path: '$', message: 'expected an object' }] };
  }

  if (value.kind !== PROJECT_KIND) {
    issues.push({ path: '$.kind', message: `expected '${PROJECT_KIND}'` });
  }
  if (value.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    issues.push({
      path: '$.schemaVersion',
      message: `expected schema version ${PROJECT_SCHEMA_VERSION}`,
    });
  }
  if (value.timeUnit !== 'frame') issues.push({ path: '$.timeUnit', message: "expected 'frame'" });
  if (value.fps !== PROJECT_FPS) issues.push({ path: '$.fps', message: `expected ${PROJECT_FPS}` });

  const activeScenarioId = requireString(value, 'activeScenarioId', '$', issues);
  requireString(value, 'createdWith', '$', issues);
  requireString(value, 'gameDataRevision', '$', issues);

  if (!Array.isArray(value.scenarios) || value.scenarios.length === 0) {
    issues.push({ path: '$.scenarios', message: 'expected at least one scenario' });
  } else {
    const scenarioIds = new Set<string>();
    const boundaryIdsByScenario = new Map<string, Set<string>>();
    const inheritanceByScenario = new Map<
      string,
      { sourceScenarioId: string; boundaryId: string; path: string }
    >();
    value.scenarios.forEach((scenario, scenarioIndex) => {
      const path = `$.scenarios[${scenarioIndex}]`;
      if (!isObject(scenario)) {
        issues.push({ path, message: 'expected an object' });
        return;
      }
      const scenarioId = requireString(scenario, 'id', path, issues);
      requireString(scenario, 'name', path, issues);
      if (scenarioId !== null) {
        if (scenarioIds.has(scenarioId))
          issues.push({ path: `${path}.id`, message: 'duplicate scenario id' });
        scenarioIds.add(scenarioId);
      }
      if (scenario.inheritance !== undefined) {
        if (!isObject(scenario.inheritance)) {
          issues.push({ path: `${path}.inheritance`, message: 'expected an object' });
        } else {
          const sourceScenarioId = requireString(
            scenario.inheritance,
            'sourceScenarioId',
            `${path}.inheritance`,
            issues,
          );
          const boundaryId = requireString(
            scenario.inheritance,
            'boundaryId',
            `${path}.inheritance`,
            issues,
          );
          if (scenarioId !== null && sourceScenarioId !== null && boundaryId !== null) {
            inheritanceByScenario.set(scenarioId, {
              sourceScenarioId,
              boundaryId,
              path: `${path}.inheritance`,
            });
          }
        }
      }

      if (!isObject(scenario.builds)) {
        issues.push({ path: `${path}.builds`, message: 'expected an object' });
        return;
      }
      const operatorIds = collectBuildIds(scenario.builds, 'operators', `${path}.builds`, issues);
      const weaponIds = collectBuildIds(scenario.builds, 'weapons', `${path}.builds`, issues);
      const gearIds = collectBuildIds(scenario.builds, 'gears', `${path}.builds`, issues);

      if (!Array.isArray(scenario.tracks) || scenario.tracks.length !== 4) {
        issues.push({ path: `${path}.tracks`, message: 'expected exactly four track slots' });
        return;
      }

      const skillCastIds = new Set<string>();
      const damageHitIdsByCast = new Map<string, Set<string>>();
      scenario.tracks.forEach((track, trackIndex) => {
        if (track === null) return;
        const trackPath = `${path}.tracks[${trackIndex}]`;
        if (!isObject(track)) {
          issues.push({ path: trackPath, message: 'expected an object or null' });
          return;
        }
        if (
          track.operatorBuildId !== null &&
          (typeof track.operatorBuildId !== 'string' || !operatorIds.has(track.operatorBuildId))
        ) {
          issues.push({ path: `${trackPath}.operatorBuildId`, message: 'unknown operator build' });
        }
        if (
          track.weaponBuildId !== null &&
          (typeof track.weaponBuildId !== 'string' || !weaponIds.has(track.weaponBuildId))
        ) {
          issues.push({ path: `${trackPath}.weaponBuildId`, message: 'unknown weapon build' });
        }
        if (isObject(track.gearBuildIds)) {
          for (const [slot, gearId] of Object.entries(track.gearBuildIds)) {
            if (gearId !== null && (typeof gearId !== 'string' || !gearIds.has(gearId))) {
              issues.push({
                path: `${trackPath}.gearBuildIds.${slot}`,
                message: 'unknown gear build',
              });
            }
          }
        } else {
          issues.push({ path: `${trackPath}.gearBuildIds`, message: 'expected an object' });
        }
        if (isObject(track.gearBuildIds)) {
          for (const slot of ['armor', 'gloves', 'accessory1', 'accessory2']) {
            if (!(slot in track.gearBuildIds)) {
              issues.push({
                path: `${trackPath}.gearBuildIds.${slot}`,
                message: 'missing gear slot',
              });
            }
          }
        }
        if (!isObject(track.initialState)) {
          issues.push({ path: `${trackPath}.initialState`, message: 'expected an object' });
        } else {
          requireFiniteNumber(
            track.initialState.ultimateEnergy,
            `${trackPath}.initialState.ultimateEnergy`,
            issues,
          );
          if (track.initialState.maxUltimateEnergyOverride !== undefined) {
            requireFiniteNumber(
              track.initialState.maxUltimateEnergyOverride,
              `${trackPath}.initialState.maxUltimateEnergyOverride`,
              issues,
            );
          }
        }
        if (!Array.isArray(track.skillCasts)) {
          issues.push({ path: `${trackPath}.skillCasts`, message: 'expected an array' });
          return;
        }
        track.skillCasts.forEach((skillCast, skillCastIndex) =>
          validateSkillCast(
            skillCast,
            `${trackPath}.skillCasts[${skillCastIndex}]`,
            skillCastIds,
            damageHitIdsByCast,
            issues,
          ),
        );
      });

      if (!Array.isArray(scenario.connections)) {
        issues.push({ path: `${path}.connections`, message: 'expected an array' });
      } else {
        const connectionIds = new Set<string>();
        scenario.connections.forEach((connection, connectionIndex) => {
          const connectionPath = `${path}.connections[${connectionIndex}]`;
          if (!isObject(connection)) {
            issues.push({ path: connectionPath, message: 'expected an object' });
            return;
          }
          const connectionId = requireString(connection, 'id', connectionPath, issues);
          if (connectionId !== null && connectionIds.has(connectionId)) {
            issues.push({ path: `${connectionPath}.id`, message: 'duplicate connection id' });
          }
          if (connectionId !== null) connectionIds.add(connectionId);
          requireBoolean(connection.consumption, `${connectionPath}.consumption`, issues);
          validateEndpoint(
            connection.from,
            `${connectionPath}.from`,
            skillCastIds,
            damageHitIdsByCast,
            issues,
          );
          validateEndpoint(
            connection.to,
            `${connectionPath}.to`,
            skillCastIds,
            damageHitIdsByCast,
            issues,
          );
        });
      }

      validateEnemy(scenario.enemy, `${path}.enemy`, issues);
      validateBattle(scenario.battle, `${path}.battle`, issues);
      if (scenarioId !== null && isObject(scenario.battle)) {
        const boundaries = Array.isArray(scenario.battle.cycleBoundaries)
          ? scenario.battle.cycleBoundaries
              .filter(isObject)
              .map(boundary => boundary.id)
              .filter((id): id is string => typeof id === 'string')
          : [];
        boundaryIdsByScenario.set(scenarioId, new Set(boundaries));
      }
      validateMechanics(scenario.mechanics, `${path}.mechanics`, issues);
      validateGlobalConfig(scenario.globalConfig, `${path}.globalConfig`, issues);
      validateEditor(scenario.editor, `${path}.editor`, issues);
    });

    for (const [scenarioId, inheritance] of inheritanceByScenario) {
      if (!scenarioIds.has(inheritance.sourceScenarioId)) {
        issues.push({
          path: `${inheritance.path}.sourceScenarioId`,
          message: 'unknown source scenario',
        });
      } else if (
        !boundaryIdsByScenario.get(inheritance.sourceScenarioId)?.has(inheritance.boundaryId)
      ) {
        issues.push({ path: `${inheritance.path}.boundaryId`, message: 'unknown cycle boundary' });
      }

      const visited = new Set<string>([scenarioId]);
      let cursor: string | undefined = inheritance.sourceScenarioId;
      while (cursor !== undefined) {
        if (visited.has(cursor)) {
          issues.push({ path: inheritance.path, message: 'scenario inheritance must be acyclic' });
          break;
        }
        visited.add(cursor);
        cursor = inheritanceByScenario.get(cursor)?.sourceScenarioId;
      }
    }

    if (activeScenarioId !== null && !scenarioIds.has(activeScenarioId)) {
      issues.push({ path: '$.activeScenarioId', message: 'unknown active scenario' });
    }
  }

  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, value: value as unknown as EndaxisProjectDocument };
}
