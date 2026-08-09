/**
 * 时间轴配装编辑器对既有武器、装备 Build 执行的不可变更新命令。
 * 本层只校验项目文档自身能够确定的数值形状；依赖具体目录的词条上限继续由目录校验负责。
 */
import type {
  GearBuildDocument,
  ScenarioDocument,
  TrackIndex,
  WeaponBuildDocument,
} from '../../core/project/schema';

export type WeaponBuildChanges = Partial<
  Pick<WeaponBuildDocument, 'level' | 'tuned' | 'potential' | 'traitLevels'>
>;

function requireIntegerAtLeast(value: number, minimum: number, field: string): void {
  if (!Number.isInteger(value) || value < minimum) {
    throw new RangeError(`${field} must be an integer greater than or equal to ${minimum}`);
  }
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
