/**
 * 把场景轨道上的装备 Build 引用解析为按干员归属的目录贡献。
 * 本层只连接已有装备 DSL，不计算面板，也不安装运行时事件监听器。
 */
import type { CompiledEquipmentContribution } from './compileEquipment';
import {
  compileGearContributions,
  compileGearSetContribution,
  compileWeaponContributions,
} from './compileEquipment';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import type { GearDefinition } from '../game-data/equipmentDefinition';
import type { ScenarioDocument, TrackDocument } from '../project/schema';

type EquipmentCatalog = Pick<
  GameDataRepository,
  'getOperator' | 'getWeapon' | 'getGear' | 'getGearSet'
>;

const TRACK_GEAR_SLOTS = [
  ['armor', 'armor'],
  ['gloves', 'gloves'],
  ['accessory1', 'accessory'],
  ['accessory2', 'accessory'],
] as const satisfies readonly (readonly [
  keyof TrackDocument['gearBuildIds'],
  GearDefinition['slotType'],
])[];

export interface CompiledScenarioOperatorEquipment {
  readonly operatorId: string;
  readonly contributions: readonly CompiledEquipmentContribution[];
}

function requireCatalogIdentity(actual: string, expected: string, path: string): void {
  if (actual !== expected) {
    throw new Error(`${path} resolved catalog identity '${actual}', expected '${expected}'`);
  }
}

/** 按轨道顺序编译上场干员的武器、装备词条与三件套贡献。 */
export function compileScenarioEquipment(
  scenario: ScenarioDocument,
  catalog: EquipmentCatalog,
): readonly CompiledScenarioOperatorEquipment[] {
  const compiled: CompiledScenarioOperatorEquipment[] = [];

  scenario.tracks.forEach((track, trackIndex) => {
    if (track === null) return;
    const trackPath = `scenario.tracks[${trackIndex}]`;
    if (track.operatorBuildId === null) {
      const hasEquipment =
        track.weaponBuildId !== null || Object.values(track.gearBuildIds).some(id => id !== null);
      if (hasEquipment)
        throw new Error(`${trackPath} configures equipment without an operator build`);
      return;
    }
    const operatorBuild = scenario.builds.operators[track.operatorBuildId];
    if (operatorBuild === undefined) {
      throw new Error(
        `${trackPath}.operatorBuildId references missing build '${track.operatorBuildId}'`,
      );
    }
    const operator = catalog.getOperator(operatorBuild.operatorSlug);
    if (operator === null) {
      throw new Error(`operator definition '${operatorBuild.operatorSlug}' does not exist`);
    }
    requireCatalogIdentity(
      operator.slug,
      operatorBuild.operatorSlug,
      `${trackPath}.operatorBuildId`,
    );
    const attributes = { main: operator.mainAttribute, secondary: operator.secondaryAttribute };
    const contributions: CompiledEquipmentContribution[] = [];

    if (track.weaponBuildId !== null) {
      const weaponBuild = scenario.builds.weapons[track.weaponBuildId];
      if (weaponBuild === undefined) {
        throw new Error(
          `${trackPath}.weaponBuildId references missing build '${track.weaponBuildId}'`,
        );
      }
      const weapon = catalog.getWeapon(weaponBuild.weaponSlug);
      if (weapon === null)
        throw new Error(`weapon definition '${weaponBuild.weaponSlug}' does not exist`);
      requireCatalogIdentity(weapon.slug, weaponBuild.weaponSlug, `${trackPath}.weaponBuildId`);
      if (weapon.weaponType !== operator.weaponType) {
        throw new Error(
          `${trackPath}.weaponBuildId weapon type '${weapon.weaponType}' is incompatible with operator weapon type '${operator.weaponType}'`,
        );
      }
      contributions.push(
        ...compileWeaponContributions(weapon, weaponBuild.traitLevels, attributes),
      );
    }

    const equippedGears: GearDefinition[] = [];
    for (const [slot, expectedSlotType] of TRACK_GEAR_SLOTS) {
      const gearBuildId = track.gearBuildIds[slot];
      if (gearBuildId === null) continue;
      const gearBuild = scenario.builds.gears[gearBuildId];
      if (gearBuild === undefined) {
        throw new Error(
          `${trackPath}.gearBuildIds.${slot} references missing build '${gearBuildId}'`,
        );
      }
      const gear = catalog.getGear(gearBuild.gearSlug);
      if (gear === null) throw new Error(`gear definition '${gearBuild.gearSlug}' does not exist`);
      requireCatalogIdentity(gear.slug, gearBuild.gearSlug, `${trackPath}.gearBuildIds.${slot}`);
      if (gear.slotType !== expectedSlotType) {
        throw new Error(
          `${trackPath}.gearBuildIds.${slot} gear slot '${gear.slotType}' is incompatible with track slot '${slot}'`,
        );
      }
      equippedGears.push(gear);
      contributions.push(...compileGearContributions(gear, gearBuild.artificingLevels, attributes));
    }

    const setCounts = new Map<string, number>();
    for (const gear of equippedGears) {
      if (gear.gearSetSlug !== undefined) {
        setCounts.set(gear.gearSetSlug, (setCounts.get(gear.gearSetSlug) ?? 0) + 1);
      }
    }
    for (const [gearSetSlug, count] of setCounts) {
      if (count < 3) continue;
      const gearSet = catalog.getGearSet(gearSetSlug);
      if (gearSet === null) throw new Error(`gear set definition '${gearSetSlug}' does not exist`);
      requireCatalogIdentity(gearSet.slug, gearSetSlug, `${trackPath}.gearBuildIds`);
      contributions.push(compileGearSetContribution(gearSet, attributes));
    }

    compiled.push({ operatorId: operatorBuild.id, contributions });
  });

  return compiled;
}
