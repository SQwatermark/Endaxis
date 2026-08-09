/**
 * 时间轴配装编辑器对既有武器、装备 Build 执行的不可变更新命令。
 * 本层只校验项目文档自身能够确定的数值形状；依赖具体目录的词条上限继续由目录校验负责。
 */
import type {
  GearBuildDocument,
  OperatorBuildDocument,
  ScenarioDocument,
  TrackIndex,
  WeaponBuildDocument,
} from '../../core/project/schema';

export type OperatorBuildChanges = Partial<
  Pick<
    OperatorBuildDocument,
    'level' | 'promoted' | 'potential' | 'trustLevel' | 'skillLevels' | 'talentStates'
  >
>;

export type WeaponBuildChanges = Partial<
  Pick<WeaponBuildDocument, 'level' | 'tuned' | 'potential' | 'traitLevels'>
>;

function requireIntegerAtLeast(value: number, minimum: number, field: string): void {
  if (!Number.isInteger(value) || value < minimum) {
    throw new RangeError(`${field} must be an integer greater than or equal to ${minimum}`);
  }
}

function getOperatorBuild(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
): OperatorBuildDocument {
  const buildId = scenario.tracks[trackIndex]?.operatorBuildId ?? null;
  const build = buildId === null ? undefined : scenario.builds.operators[buildId];
  if (build === undefined) throw new Error(`track ${trackIndex} has no operator build`);
  return build;
}

function getWeaponBuild(scenario: ScenarioDocument, trackIndex: TrackIndex): WeaponBuildDocument {
  const buildId = scenario.tracks[trackIndex]?.weaponBuildId ?? null;
  const build = buildId === null ? undefined : scenario.builds.weapons[buildId];
  if (build === undefined) throw new Error(`track ${trackIndex} has no weapon build`);
  return build;
}

function getGearBuild(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  buildId: string,
): GearBuildDocument {
  const track = scenario.tracks[trackIndex];
  if (track === null || !Object.values(track.gearBuildIds).includes(buildId)) {
    throw new Error(`track ${trackIndex} does not reference gear build '${buildId}'`);
  }
  const build = scenario.builds.gears[buildId];
  if (build === undefined) throw new Error(`gear build '${buildId}' does not exist`);
  return build;
}

/** 更新当前轨道干员的养成输入，不改变 Build 身份和干员目录身份。 */
export function updateTrackOperatorBuild(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  changes: OperatorBuildChanges,
): ScenarioDocument {
  const build = getOperatorBuild(scenario, trackIndex);
  if (changes.level !== undefined) requireIntegerAtLeast(changes.level, 1, 'operator level');
  if (changes.potential !== undefined) {
    requireIntegerAtLeast(changes.potential, 0, 'operator potential');
  }
  if (changes.trustLevel !== undefined) {
    requireIntegerAtLeast(changes.trustLevel, 0, 'operator trust level');
  }
  if (changes.skillLevels !== undefined) {
    Object.entries(changes.skillLevels).forEach(([key, level]) =>
      requireIntegerAtLeast(level, 1, `operator skill level '${key}'`),
    );
  }
  if (changes.talentStates !== undefined) {
    Object.entries(changes.talentStates).forEach(([key, state]) =>
      requireIntegerAtLeast(state, 0, `operator talent state '${key}'`),
    );
  }

  const updated = {
    ...build,
    ...changes,
    ...(changes.skillLevels === undefined ? {} : { skillLevels: { ...changes.skillLevels } }),
    ...(changes.talentStates === undefined ? {} : { talentStates: { ...changes.talentStates } }),
  };
  return {
    ...scenario,
    builds: {
      ...scenario.builds,
      operators: { ...scenario.builds.operators, [build.id]: updated },
    },
  };
}

/** 更新当前轨道已装备武器的用户输入，不改变 Build 身份和武器目录身份。 */
export function updateTrackWeaponBuild(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  changes: WeaponBuildChanges,
): ScenarioDocument {
  const build = getWeaponBuild(scenario, trackIndex);
  if (changes.level !== undefined) requireIntegerAtLeast(changes.level, 1, 'weapon level');
  if (changes.potential !== undefined) {
    requireIntegerAtLeast(changes.potential, 0, 'weapon potential');
  }
  if (changes.traitLevels !== undefined) {
    changes.traitLevels.forEach((level, index) =>
      requireIntegerAtLeast(level, 1, `weapon trait level ${index}`),
    );
  }

  const updated = { ...build, ...changes };
  return {
    ...scenario,
    builds: {
      ...scenario.builds,
      weapons: { ...scenario.builds.weapons, [build.id]: updated },
    },
  };
}

/** 更新当前轨道引用的一件装备的精锻档位，不改变 Build 和装备目录身份。 */
export function updateTrackGearBuild(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  buildId: string,
  artificingLevels: readonly number[],
): ScenarioDocument {
  const build = getGearBuild(scenario, trackIndex, buildId);
  artificingLevels.forEach((level, index) =>
    requireIntegerAtLeast(level, 0, `gear artificing level ${index}`),
  );
  return {
    ...scenario,
    builds: {
      ...scenario.builds,
      gears: {
        ...scenario.builds.gears,
        [build.id]: { ...build, artificingLevels: [...artificingLevels] },
      },
    },
  };
}
