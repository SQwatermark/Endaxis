/**
 * 项目 build 与版本化游戏目录之间的严格引用校验。
 * 调用方必须先完成项目结构校验；本层只负责目录身份、装备约束与跨目录引用。
 */
import type { EndaxisProjectDocument, TrackDocument } from '../project/schema';
import type { ValidationIssue } from '../project/validation';
import type { GearDefinition, GearSlotType, WeaponDefinition } from './equipmentDefinition';
import type { GameDataRepository } from './gameDataRepository';
import type { OperatorDefinition } from './operatorDefinition';

type BuildCatalogRepository = {
  getOperator(slug: string): Pick<OperatorDefinition, 'slug' | 'weaponType'> | null;
  getWeapon(slug: string): WeaponDefinition | null;
  getGear(slug: string): GearDefinition | null;
  getGearSet: GameDataRepository['getGearSet'];
};

const trackGearSlotTypes = {
  armor: 'armor',
  gloves: 'gloves',
  accessory1: 'accessory',
  accessory2: 'accessory',
} as const satisfies Record<keyof TrackDocument['gearBuildIds'], GearSlotType>;
const trackGearSlots = [
  'armor',
  'gloves',
  'accessory1',
  'accessory2',
] as const satisfies readonly (keyof TrackDocument['gearBuildIds'])[];

function validateCatalogIdentity(
  requestedSlug: string,
  resolvedSlug: string,
  path: string,
  kind: 'operator' | 'weapon' | 'gear' | 'gear set',
  issues: ValidationIssue[],
): boolean {
  if (resolvedSlug === requestedSlug) return true;
  issues.push({ path, message: `${kind} catalog identity mismatch` });
  return false;
}

/** 在目录装配完成后校验项目中全部养成引用及轨道装备约束。 */
export function validateProjectBuildCatalogReferences(
  project: EndaxisProjectDocument,
  repository: BuildCatalogRepository,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  project.scenarios.forEach((scenario, scenarioIndex) => {
    const scenarioPath = `$.scenarios[${scenarioIndex}]`;
    const operators = new Map<string, Pick<OperatorDefinition, 'slug' | 'weaponType'>>();
    const weapons = new Map<string, WeaponDefinition>();
    const gears = new Map<string, GearDefinition>();

    for (const [buildId, build] of Object.entries(scenario.builds.operators)) {
      const path = `${scenarioPath}.builds.operators.${buildId}.operatorSlug`;
      const definition = repository.getOperator(build.operatorSlug);
      if (definition === null) {
        issues.push({ path, message: 'unknown operator' });
      } else if (
        validateCatalogIdentity(build.operatorSlug, definition.slug, path, 'operator', issues)
      ) {
        operators.set(buildId, definition);
      }
    }

    for (const [buildId, build] of Object.entries(scenario.builds.weapons)) {
      const path = `${scenarioPath}.builds.weapons.${buildId}.weaponSlug`;
      const definition = repository.getWeapon(build.weaponSlug);
      if (definition === null) {
        issues.push({ path, message: 'unknown weapon' });
      } else if (
        validateCatalogIdentity(build.weaponSlug, definition.slug, path, 'weapon', issues)
      ) {
        weapons.set(buildId, definition);
        if (build.traitLevels.length !== definition.traits.length) {
          issues.push({
            path: `${scenarioPath}.builds.weapons.${buildId}.traitLevels`,
            message: `expected ${definition.traits.length} weapon trait levels`,
          });
        } else {
          build.traitLevels.forEach((level, index) => {
            const trait = definition.traits[index]!;
            if (level > trait.levelCount) {
              issues.push({
                path: `${scenarioPath}.builds.weapons.${buildId}.traitLevels[${index}]`,
                message: `weapon trait level exceeds maximum ${trait.levelCount}`,
              });
            }
          });
        }
      }
    }

    for (const [buildId, build] of Object.entries(scenario.builds.gears)) {
      const path = `${scenarioPath}.builds.gears.${buildId}.gearSlug`;
      const definition = repository.getGear(build.gearSlug);
      if (definition === null) {
        issues.push({ path, message: 'unknown gear' });
        continue;
      }
      if (!validateCatalogIdentity(build.gearSlug, definition.slug, path, 'gear', issues)) continue;

      gears.set(buildId, definition);
      if (build.artificingLevels.length !== definition.traits.length) {
        issues.push({
          path: `${scenarioPath}.builds.gears.${buildId}.artificingLevels`,
          message: `expected ${definition.traits.length} gear trait levels`,
        });
      } else {
        build.artificingLevels.forEach((level, index) => {
          const trait = definition.traits[index]!;
          if (level >= trait.levelCount) {
            issues.push({
              path: `${scenarioPath}.builds.gears.${buildId}.artificingLevels[${index}]`,
              message: `gear trait level exceeds maximum ${trait.levelCount - 1}`,
            });
          }
        });
      }
      if (definition.gearSetSlug !== undefined) {
        const gearSet = repository.getGearSet(definition.gearSetSlug);
        if (gearSet === null) {
          issues.push({ path, message: `unknown gear set '${definition.gearSetSlug}'` });
        } else {
          validateCatalogIdentity(definition.gearSetSlug, gearSet.slug, path, 'gear set', issues);
        }
      }
    }

    scenario.tracks.forEach((track, trackIndex) => {
      if (track === null) return;
      const trackPath = `${scenarioPath}.tracks[${trackIndex}]`;
      const operator =
        track.operatorBuildId === null ? undefined : operators.get(track.operatorBuildId);
      const weapon = track.weaponBuildId === null ? undefined : weapons.get(track.weaponBuildId);

      if (
        operator !== undefined &&
        weapon !== undefined &&
        operator.weaponType !== weapon.weaponType
      ) {
        issues.push({
          path: `${trackPath}.weaponBuildId`,
          message: `weapon type '${weapon.weaponType}' is incompatible with operator weapon type '${operator.weaponType}'`,
        });
      }

      for (const slot of trackGearSlots) {
        const gearBuildId = track.gearBuildIds[slot];
        if (gearBuildId === null) continue;
        const gear = gears.get(gearBuildId);
        const expectedSlotType = trackGearSlotTypes[slot];
        if (gear !== undefined && gear.slotType !== expectedSlotType) {
          issues.push({
            path: `${trackPath}.gearBuildIds.${slot}`,
            message: `gear slot '${gear.slotType}' is incompatible with track slot '${slot}'`,
          });
        }
      }
    });
  });

  return issues;
}
