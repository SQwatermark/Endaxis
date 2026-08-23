/**
 * 不可信 JSON 进入新版项目模型的顶层校验边界。
 * 加载、导入和迁移结果都必须先通过这里，业务代码不能直接断言外部对象是存档。
 */
import {
  PROJECT_FPS,
  PROJECT_KIND,
  PROJECT_SCHEMA_VERSION,
  type EndaxisProjectDocument,
} from './schema';
import { DAMAGE_ELEMENTS } from '../game-data/operatorDefinition';
import {
  validateGearDefinition,
  validateGearSetDefinition,
  validateWeaponDefinition,
} from '../game-data/equipmentDefinitionValidation';
import {
  validateBattle,
  validateEditor,
  validateEnemy,
  validateGearInstance,
  validateGlobalConfig,
  validateMechanics,
  validateOperatorInstance,
  validateWeaponInstance,
} from './scenarioValidation';
import { validateSkillDefinition } from '../game-data/validateSkillDefinition';
import { collectDamageStepKeys } from '../game-data/collectDamageStepKeys';
import {
  isObject,
  requireBoolean,
  requireEnum,
  requireFiniteNumber,
  requireNonNegativeInteger,
  requireString,
  type ValidationIssue,
} from './validationHelpers';

export type { ValidationIssue } from './validationHelpers';

const damageElements = new Set<string>(DAMAGE_ELEMENTS);

function validateProjectTemplateRecord(
  value: unknown,
  path: string,
  kind: 'operator' | 'weapon' | 'gear' | 'gearSet',
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    issues.push({ path, message: 'expected an object' });
    return;
  }
  for (const [id, template] of Object.entries(value)) {
    const templatePath = `${path}.${JSON.stringify(id)}`;
    if (!id.startsWith(`project:${kind}:`) || id.length === `project:${kind}:`.length) {
      issues.push({ path: templatePath, message: `expected project:${kind}: template id` });
    }
    if (!isObject(template)) {
      issues.push({ path: templatePath, message: 'expected an object' });
      continue;
    }
    const declaredId = requireString(template, 'id', templatePath, issues);
    if (declaredId !== null && declaredId !== id) {
      issues.push({ path: `${templatePath}.id`, message: 'template id must match record key' });
    }
    requireString(template, 'name', templatePath, issues);
    if (template.origin !== undefined) {
      if (!isObject(template.origin)) {
        issues.push({ path: `${templatePath}.origin`, message: 'expected an object' });
      } else {
        requireString(template.origin, 'templateId', `${templatePath}.origin`, issues);
        requireString(template.origin, 'gameDataRevision', `${templatePath}.origin`, issues);
      }
    }
    if (!isObject(template.definition)) {
      issues.push({ path: `${templatePath}.definition`, message: 'expected an object' });
      continue;
    }
    if (template.definition.slug !== id) {
      issues.push({
        path: `${templatePath}.definition.slug`,
        message: 'definition identity mismatch',
      });
    }
    const definitionPath = `${templatePath}.definition`;
    if (kind === 'operator') {
      requireString(template.definition, 'gameId', definitionPath, issues);
      if (!Array.isArray(template.definition.skillGroups)) {
        issues.push({ path: `${definitionPath}.skillGroups`, message: 'expected an array' });
      } else {
        template.definition.skillGroups.forEach((group, groupIndex) => {
          const groupPath = `${definitionPath}.skillGroups[${groupIndex}]`;
          if (!isObject(group)) {
            issues.push({ path: groupPath, message: 'expected an object' });
            return;
          }
          requireString(group, 'key', groupPath, issues);
          const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
          skills.forEach((skill, skillIndex) => {
            issues.push(...validateSkillDefinition(skill, `${groupPath}.skills[${skillIndex}]`));
          });
          if (Array.isArray(group.variants)) {
            group.variants.forEach((variant, variantIndex) => {
              if (!isObject(variant)) {
                issues.push({
                  path: `${groupPath}.variants[${variantIndex}]`,
                  message: 'expected an object',
                });
                return;
              }
              const variantPath = `${groupPath}.variants[${variantIndex}]`;
              requireString(variant, 'key', variantPath, issues);
              requireString(variant, 'levelSource', variantPath, issues);
              const variantSkills = Array.isArray(variant.skills)
                ? variant.skills
                : [variant.skills];
              variantSkills.forEach((skill, skillIndex) => {
                issues.push(
                  ...validateSkillDefinition(skill, `${variantPath}.skills[${skillIndex}]`),
                );
              });
            });
          }
        });
      }
    } else {
      const definitionIssues =
        kind === 'weapon'
          ? validateWeaponDefinition(template.definition, definitionPath)
          : kind === 'gear'
            ? validateGearDefinition(template.definition, definitionPath)
            : validateGearSetDefinition(template.definition, definitionPath);
      issues.push(...definitionIssues);
    }
  }
}

function validateProjectDefinitionLibrary(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
): void {
  if (!isObject(value)) {
    issues.push({ path, message: 'expected an object' });
    return;
  }
  validateProjectTemplateRecord(value.operators, `${path}.operators`, 'operator', issues);
  validateProjectTemplateRecord(value.weapons, `${path}.weapons`, 'weapon', issues);
  validateProjectTemplateRecord(value.gears, `${path}.gears`, 'gear', issues);
  validateProjectTemplateRecord(value.gearSets, `${path}.gearSets`, 'gearSet', issues);
}

/** 严格校验后的项目或完整问题列表；失败值不得进入领域层。 */
export type ValidationResult =
  { ok: true; value: EndaxisProjectDocument } | { ok: false; issues: ValidationIssue[] };

function validateSkillCast(
  value: unknown,
  path: string,
  skillCastIds: Set<string>,
  customDamageStepKeys: Map<string, ReadonlySet<string>>,
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

  if (value.presentation !== undefined) {
    if (!isObject(value.presentation)) {
      issues.push({ path: `${path}.presentation`, message: 'expected an object' });
    } else {
      if (value.presentation.locked !== undefined) {
        requireBoolean(value.presentation.locked, `${path}.presentation.locked`, issues);
      }
      if (value.presentation.disabled !== undefined) {
        requireBoolean(value.presentation.disabled, `${path}.presentation.disabled`, issues);
      }
      if (value.presentation.linked !== undefined) {
        requireBoolean(value.presentation.linked, `${path}.presentation.linked`, issues);
      }
      if (
        value.presentation.color !== undefined &&
        value.presentation.color !== null &&
        typeof value.presentation.color !== 'string'
      ) {
        issues.push({ path: `${path}.presentation.color`, message: 'expected a string or null' });
      }
      if (value.presentation.customBars !== undefined) {
        const barsPath = `${path}.presentation.customBars`;
        if (!Array.isArray(value.presentation.customBars)) {
          issues.push({ path: barsPath, message: 'expected an array' });
        } else {
          const barIds = new Set<string>();
          value.presentation.customBars.forEach((bar, index) => {
            const barPath = `${barsPath}[${index}]`;
            if (!isObject(bar)) {
              issues.push({ path: barPath, message: 'expected an object' });
              return;
            }
            const barId = requireString(bar, 'id', barPath, issues);
            if (barId !== null) {
              if (barIds.has(barId)) {
                issues.push({ path: `${barPath}.id`, message: 'duplicate custom bar id' });
              }
              barIds.add(barId);
            }
            requireString(bar, 'text', barPath, issues);
            requireNonNegativeInteger(bar.offsetFrames, `${barPath}.offsetFrames`, issues);
            requireNonNegativeInteger(bar.durationFrames, `${barPath}.durationFrames`, issues);
            if (bar.color !== undefined && typeof bar.color !== 'string') {
              issues.push({ path: `${barPath}.color`, message: 'expected a string' });
            }
          });
        }
      }
    }
  }

  if (value.simulationInputs !== undefined) {
    const inputPath = `${path}.simulationInputs`;
    if (!isObject(value.simulationInputs)) {
      issues.push({ path: inputPath, message: 'expected an object' });
    } else {
      if (value.simulationInputs.cameraToTargetSignedAngleDegrees !== undefined) {
        const angle = value.simulationInputs.cameraToTargetSignedAngleDegrees;
        if (typeof angle !== 'number' || !Number.isFinite(angle) || angle < -180 || angle > 180) {
          issues.push({
            path: `${inputPath}.cameraToTargetSignedAngleDegrees`,
            message: 'expected a finite angle in [-180, 180]',
          });
        }
      }
      if (value.simulationInputs.forcedCriticalStepKeys !== undefined) {
        const keys = value.simulationInputs.forcedCriticalStepKeys;
        if (
          !Array.isArray(keys) ||
          keys.some(key => typeof key !== 'string' || key.length === 0) ||
          new Set(keys).size !== keys.length
        ) {
          issues.push({
            path: `${inputPath}.forcedCriticalStepKeys`,
            message: 'expected unique non-empty step keys',
          });
        }
      }
    }
  }

  if (value.customDefinition !== undefined) {
    const defPath = `${path}.customDefinition`;
    if (!isObject(value.customDefinition)) {
      issues.push({ path: defPath, message: 'expected an object' });
    } else {
      const def = value.customDefinition as Record<string, unknown>;
      if (isObject(value.source) && value.source.kind === 'operatorSkill') {
        const sourceSkillKey = (value.source as Record<string, unknown>).skillKey;
        if (typeof sourceSkillKey === 'string' && def.key !== sourceSkillKey) {
          issues.push({
            path: `${defPath}.key`,
            message: `custom definition key must match source skill key '${sourceSkillKey}'`,
          });
        }
      }
      const sdIssues = validateSkillDefinition(value.customDefinition, defPath);
      for (const sd of sdIssues) issues.push(sd);
      if (id !== null) {
        customDamageStepKeys.set(
          id,
          new Set(
            collectDamageStepKeys(value.customDefinition)
              .map(entry => entry.key)
              .filter(key => key.length > 0),
          ),
        );
      }
    }
  }
}

function validateEndpoint(
  value: unknown,
  path: string,
  skillCastIds: Set<string>,
  customDamageStepKeys: ReadonlyMap<string, ReadonlySet<string>>,
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
    const stepKey = requireString(value, 'stepKey', path, issues);
    const knownKeys = skillCastId === null ? undefined : customDamageStepKeys.get(skillCastId);
    if (stepKey !== null && knownKeys !== undefined && !knownKeys.has(stepKey)) {
      issues.push({ path: `${path}.stepKey`, message: 'unknown damage step key reference' });
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
  if (value.fps !== PROJECT_FPS) issues.push({ path: '$.fps', message: `expected ${PROJECT_FPS}` });

  const activeScenarioId = requireString(value, 'activeScenarioId', '$', issues);
  requireString(value, 'createdWith', '$', issues);
  requireString(value, 'gameDataRevision', '$', issues);
  if (value.definitionLibrary !== undefined) {
    validateProjectDefinitionLibrary(value.definitionLibrary, '$.definitionLibrary', issues);
  }

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

      if (!Array.isArray(scenario.tracks) || scenario.tracks.length !== 4) {
        issues.push({ path: `${path}.tracks`, message: 'expected exactly four track slots' });
        return;
      }

      const skillCastIds = new Set<string>();
      const customDamageStepKeys = new Map<string, ReadonlySet<string>>();
      const trackIds = new Set<string>();
      scenario.tracks.forEach((track, trackIndex) => {
        if (track === null) return;
        const trackPath = `${path}.tracks[${trackIndex}]`;
        if (!isObject(track)) {
          issues.push({ path: trackPath, message: 'expected an object or null' });
          return;
        }
        const trackId = requireString(track, 'id', trackPath, issues);
        if (trackId !== null) {
          if (trackIds.has(trackId)) {
            issues.push({ path: `${trackPath}.id`, message: 'duplicate track identity' });
          }
          trackIds.add(trackId);
        }
        if (track.operator !== null && track.operator !== undefined) {
          const instancePath = `${trackPath}.operator`;
          if (!isObject(track.operator)) {
            issues.push({ path: instancePath, message: 'expected an object or null' });
          } else {
            validateOperatorInstance(track.operator, instancePath, issues);
          }
        } else if (!('operator' in track)) {
          issues.push({ path: `${trackPath}.operator`, message: 'missing operator instance' });
        }
        if (track.weapon !== null && track.weapon !== undefined) {
          if (!isObject(track.weapon)) {
            issues.push({ path: `${trackPath}.weapon`, message: 'expected an object or null' });
          } else {
            validateWeaponInstance(track.weapon, `${trackPath}.weapon`, issues);
          }
        } else if (!('weapon' in track)) {
          issues.push({ path: `${trackPath}.weapon`, message: 'missing weapon instance' });
        }
        if (track.gears !== null && track.gears !== undefined && isObject(track.gears)) {
          for (const slot of ['armor', 'gloves', 'accessory1', 'accessory2']) {
            if (!(slot in track.gears)) {
              issues.push({ path: `${trackPath}.gears.${slot}`, message: 'missing gear slot' });
              continue;
            }
            const gearInstance = track.gears[slot as keyof typeof track.gears];
            if (gearInstance !== null && gearInstance !== undefined) {
              if (!isObject(gearInstance)) {
                issues.push({
                  path: `${trackPath}.gears.${slot}`,
                  message: 'expected an object or null',
                });
              } else {
                validateGearInstance(gearInstance, `${trackPath}.gears.${slot}`, issues);
              }
            }
          }
        } else {
          issues.push({ path: `${trackPath}.gears`, message: 'expected an object' });
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
            customDamageStepKeys,
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
            customDamageStepKeys,
            issues,
          );
          validateEndpoint(
            connection.to,
            `${connectionPath}.to`,
            skillCastIds,
            customDamageStepKeys,
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
