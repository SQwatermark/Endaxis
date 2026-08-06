import {
  PROJECT_FPS,
  PROJECT_KIND,
  PROJECT_SCHEMA_VERSION,
  type EndaxisProjectDocument,
  type JsonObject,
} from './schema';
import {
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
  OPERATOR_ATTRIBUTES,
  RESOURCE_RECIPIENTS,
  STATUS_MODIFIER_KINDS,
} from '../game-data/operatorDefinition';

const combatStepKinds = new Set<string>(COMBAT_STEP_KINDS);
const combatResources = new Set<string>(COMBAT_RESOURCES);
const combatConditionKinds = new Set<string>(COMBAT_CONDITION_KINDS);
const combatTargets = new Set<string>(COMBAT_TARGETS);
const comparisonOperators = new Set<string>(COMPARISON_OPERATORS);
const damageCalculations = new Set<string>(DAMAGE_CALCULATIONS);
const damageElements = new Set<string>(DAMAGE_ELEMENTS);
const damageTypes = new Set<string>(DAMAGE_TYPES);
const damageTags = new Set<string>(DAMAGE_TAGS);
const elementalReactions = new Set<string>(ELEMENTAL_REACTIONS);
const operatorAttributes = new Set<string>(OPERATOR_ATTRIBUTES);
const resourceRecipients = new Set<string>(RESOURCE_RECIPIENTS);
const statusModifierKinds = new Set<string>(STATUS_MODIFIER_KINDS);

export interface ValidationIssue {
  path: string;
  message: string;
}

export type ValidationResult =
  { ok: true; value: EndaxisProjectDocument } | { ok: false; issues: ValidationIssue[] };

function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireString(
  object: JsonObject,
  key: string,
  path: string,
  issues: ValidationIssue[],
): string | null {
  const value = object[key];
  if (typeof value === 'string' && value.length > 0) return value;
  issues.push({ path: `${path}.${key}`, message: 'expected a non-empty string' });
  return null;
}

function requireNonNegativeInteger(value: unknown, path: string, issues: ValidationIssue[]): void {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return;
  issues.push({ path, message: 'expected a non-negative integer' });
}

function requireFiniteNumber(value: unknown, path: string, issues: ValidationIssue[]): void {
  if (typeof value === 'number' && Number.isFinite(value)) return;
  issues.push({ path, message: 'expected a finite number' });
}

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

function requireEnum(
  value: unknown,
  allowed: Set<string>,
  path: string,
  issues: ValidationIssue[],
): void {
  if (typeof value === 'string' && allowed.has(value)) return;
  issues.push({ path, message: 'unexpected enum value' });
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
    case 'statusActive':
      requireString(value, 'statusKey', path, issues);
      requireEnum(value.target, combatTargets, `${path}.target`, issues);
      if (value.minimumStacks !== undefined) {
        requireNonNegativeInteger(value.minimumStacks, `${path}.minimumStacks`, issues);
      }
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
      requireEnum(parameters.element, damageElements, `${path}.element`, issues);
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
    case 'changeResource':
      requireEnum(parameters.resource, combatResources, `${path}.resource`, issues);
      validateLevelValues(parameters.amount, `${path}.amount`, issues);
      requireEnum(parameters.recipient, resourceRecipients, `${path}.recipient`, issues);
      break;
    case 'gainUltimateEnergyFromSkillCost':
      if (parameters.recipient !== 'caster') {
        issues.push({ path: `${path}.recipient`, message: "expected 'caster'" });
      }
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
    requireString(value.source, 'kind', `${path}.source`, issues);
  }

  if (!isObject(value.placement)) {
    issues.push({ path: `${path}.placement`, message: 'expected an object' });
  } else {
    requireNonNegativeInteger(value.placement.startFrame, `${path}.placement.startFrame`, issues);
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
    requireNonNegativeInteger(scheduledSequence.endFrame, `${sequencePath}.endFrame`, issues);
    if (
      typeof scheduledSequence.startFrame === 'number' &&
      typeof scheduledSequence.endFrame === 'number' &&
      scheduledSequence.endFrame < scheduledSequence.startFrame
    ) {
      issues.push({
        path: `${sequencePath}.endFrame`,
        message: 'must not precede startFrame',
      });
    }
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
  });
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
        scenario.connections.forEach((connection, connectionIndex) => {
          const connectionPath = `${path}.connections[${connectionIndex}]`;
          if (!isObject(connection)) {
            issues.push({ path: connectionPath, message: 'expected an object' });
            return;
          }
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
    });

    if (activeScenarioId !== null && !scenarioIds.has(activeScenarioId)) {
      issues.push({ path: '$.activeScenarioId', message: 'unknown active scenario' });
    }
  }

  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, value: value as unknown as EndaxisProjectDocument };
}
