/**
 * 将场景中的 Build 引用和只读定义解析为编译阶段共享的构筑视图。
 *
 * 本模块只确认身份、兼容性、装备槽位和三件套，不计算面板，也不补齐缺失配置。
 * 时间轴、资源、面板和战斗装配应复用这里的结果，避免各自解释同一份项目数据。
 */
import type { GameDataRepository } from '../game-data/gameDataRepository';
import type {
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../game-data/equipmentDefinition';
import type { OperatorDefinition } from '../game-data/operatorDefinition';
import type {
  GearBuildDocument,
  OperatorBuildDocument,
  ScenarioDocument,
  TrackDocument,
  TrackIndex,
  WeaponBuildDocument,
} from '../project/schema';

export type ScenarioBuildIndex = Pick<
  GameDataRepository,
  'getOperator' | 'getWeapon' | 'getGear' | 'getGearSet'
>;

export type ResolvedGearSlot = keyof TrackDocument['gearBuildIds'];

/** 一件已经确认槽位兼容的装备实例及其定义。 */
export interface ResolvedGearBuild {
  readonly slot: ResolvedGearSlot;
  readonly build: GearBuildDocument;
  readonly definition: GearDefinition;
}

/** 一条有干员轨道的完整构筑输入；后续阶段不得再次按 slug 查询这些定义对象。 */
export interface ResolvedScenarioBuild {
  readonly trackIndex: TrackIndex;
  readonly track: TrackDocument;
  readonly operatorBuild: OperatorBuildDocument;
  readonly operator: OperatorDefinition;
  readonly weapon: {
    readonly build: WeaponBuildDocument;
    readonly definition: WeaponDefinition;
  } | null;
  readonly gears: readonly ResolvedGearBuild[];
  readonly activeGearSets: readonly GearSetDefinition[];
}

const GEAR_SLOTS = [
  ['armor', 'armor'],
  ['gloves', 'gloves'],
  ['accessory1', 'accessory'],
  ['accessory2', 'accessory'],
] as const satisfies readonly (readonly [ResolvedGearSlot, GearDefinition['slotType']])[];

function requireDefinitionEntry<T>(value: T | null, kind: string, slug: string): T {
  if (value === null) throw new Error(`${kind} definition '${slug}' does not exist`);
  return value;
}

function requireDefinitionIdentity(actual: string, expected: string, path: string): void {
  if (actual !== expected) {
    throw new Error(`${path} resolved definition identity '${actual}', expected '${expected}'`);
  }
}

function resolveWeapon(
  scenario: ScenarioDocument,
  track: TrackDocument,
  operator: OperatorDefinition,
  trackPath: string,
  index: ScenarioBuildIndex,
): ResolvedScenarioBuild['weapon'] {
  if (track.weaponBuildId === null) return null;
  const build = scenario.builds.weapons[track.weaponBuildId];
  if (build === undefined) {
    throw new Error(`${trackPath}.weaponBuildId references missing build '${track.weaponBuildId}'`);
  }
  const definition = requireDefinitionEntry(
    index.getWeapon(build.weaponSlug),
    'weapon',
    build.weaponSlug,
  );
  requireDefinitionIdentity(definition.slug, build.weaponSlug, `${trackPath}.weaponBuildId`);
  if (definition.weaponType !== operator.weaponType) {
    throw new Error(
      `${trackPath}.weaponBuildId weapon type '${definition.weaponType}' is incompatible with operator weapon type '${operator.weaponType}'`,
    );
  }
  return { build, definition };
}

function resolveGears(
  scenario: ScenarioDocument,
  track: TrackDocument,
  trackPath: string,
  index: ScenarioBuildIndex,
): readonly ResolvedGearBuild[] {
  const resolved: ResolvedGearBuild[] = [];
  for (const [slot, expectedSlotType] of GEAR_SLOTS) {
    const buildId = track.gearBuildIds[slot];
    if (buildId === null) continue;
    const build = scenario.builds.gears[buildId];
    if (build === undefined) {
      throw new Error(`${trackPath}.gearBuildIds.${slot} references missing build '${buildId}'`);
    }
    const definition = requireDefinitionEntry(
      index.getGear(build.gearSlug),
      'gear',
      build.gearSlug,
    );
    requireDefinitionIdentity(definition.slug, build.gearSlug, `${trackPath}.gearBuildIds.${slot}`);
    if (definition.slotType !== expectedSlotType) {
      throw new Error(
        `${trackPath}.gearBuildIds.${slot} gear slot '${definition.slotType}' is incompatible with track slot '${slot}'`,
      );
    }
    resolved.push({ slot, build, definition });
  }
  return resolved;
}

function resolveActiveGearSets(
  gears: readonly ResolvedGearBuild[],
  trackPath: string,
  index: ScenarioBuildIndex,
): readonly GearSetDefinition[] {
  const counts = new Map<string, number>();
  for (const { definition } of gears) {
    if (definition.gearSetSlug !== undefined) {
      counts.set(definition.gearSetSlug, (counts.get(definition.gearSetSlug) ?? 0) + 1);
    }
  }
  return [...counts]
    .filter(([, count]) => count >= 3)
    .map(([slug]) => {
      const definition = requireDefinitionEntry(index.getGearSet(slug), 'gear set', slug);
      requireDefinitionIdentity(definition.slug, slug, `${trackPath}.gearBuildIds`);
      return definition;
    });
}

/** 按轨道顺序严格解析全部上场干员构筑。 */
export function resolveScenarioBuilds(
  scenario: ScenarioDocument,
  index: ScenarioBuildIndex,
): readonly ResolvedScenarioBuild[] {
  const resolved: ResolvedScenarioBuild[] = [];
  const seenOperatorBuildIds = new Set<string>();

  scenario.tracks.forEach((track, rawTrackIndex) => {
    if (track === null) return;
    const trackIndex = rawTrackIndex as TrackIndex;
    const trackPath = `scenario.tracks[${trackIndex}]`;
    if (track.operatorBuildId === null) {
      const hasEquipment =
        track.weaponBuildId !== null || Object.values(track.gearBuildIds).some(id => id !== null);
      if (hasEquipment) {
        throw new Error(`${trackPath} configures equipment without an operator build`);
      }
      if (track.skillCasts.length > 0) {
        throw new Error(`track ${trackIndex} has skill casts but no operator build`);
      }
      return;
    }
    const operatorBuild = scenario.builds.operators[track.operatorBuildId];
    if (operatorBuild === undefined) {
      throw new Error(
        `${trackPath}.operatorBuildId references missing build '${track.operatorBuildId}'`,
      );
    }
    if (seenOperatorBuildIds.has(operatorBuild.id)) {
      throw new Error(`operator build '${operatorBuild.id}' is assigned to multiple tracks`);
    }
    seenOperatorBuildIds.add(operatorBuild.id);

    const operator = requireDefinitionEntry(
      index.getOperator(operatorBuild.operatorSlug),
      'operator',
      operatorBuild.operatorSlug,
    );
    requireDefinitionIdentity(
      operator.slug,
      operatorBuild.operatorSlug,
      `${trackPath}.operatorBuildId`,
    );
    const weapon = resolveWeapon(scenario, track, operator, trackPath, index);
    const gears = resolveGears(scenario, track, trackPath, index);
    resolved.push({
      trackIndex,
      track,
      operatorBuild,
      operator,
      weapon,
      gears,
      activeGearSets: resolveActiveGearSets(gears, trackPath, index),
    });
  });

  return resolved;
}
