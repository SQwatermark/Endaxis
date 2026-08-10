/**
 * 将指定轨道的养成 Build 引用与版本化游戏数据解析为配装 UI 可直接读取的稳定模型。
 * 本模块只负责身份解析和用户输入快照，不翻译、不计算面板，也不修复损坏引用；调用方应在渲染前处理抛出的数据错误。
 */
import type { GameDataRepository } from '../../core/game-data/gameDataRepository';
import type { GearDefinition, WeaponDefinition } from '../../core/game-data/equipmentDefinition';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import type {
  GearBuildDocument,
  OperatorBuildDocument,
  ScenarioDocument,
  TrackDocument,
  TrackIndex,
  WeaponBuildDocument,
} from '../../core/project/schema';

/** 时间轴固定装备槽的稳定身份；两个配件槽必须分别保留。 */
export type LoadoutGearSlot = keyof TrackDocument['gearBuildIds'];

/** 干员 Build 的用户输入及其定义，不包含名称等本地化文本。 */
export interface OperatorBuildViewModel {
  readonly buildId: string;
  readonly operatorSlug: string;
  readonly level: number;
  readonly promoted: boolean;
  readonly potential: number;
  readonly trustLevel: number;
  readonly skillLevels: Readonly<Record<string, number>>;
  readonly talentStates: Readonly<Record<string, number>>;
  readonly baseStatOverrides?: Readonly<Record<string, number>>;
  readonly definition: Readonly<OperatorDefinition>;
}

/** 武器 Build 的用户输入及其定义；词条等级顺序与定义中的词条顺序一致。 */
export interface WeaponBuildViewModel {
  readonly buildId: string;
  readonly weaponSlug: string;
  readonly level: number;
  readonly tuned: boolean;
  readonly potential: number;
  readonly traitLevels: readonly number[];
  readonly definition: Readonly<WeaponDefinition>;
}

/** 单个装备槽中的 Build；精锻等级顺序与定义中的词条顺序一致。 */
export interface GearBuildViewModel {
  readonly slot: LoadoutGearSlot;
  readonly buildId: string;
  readonly gearSlug: string;
  readonly artificingLevels: readonly number[];
  readonly definition: Readonly<GearDefinition>;
}

/** 四个装备槽的固定形状；未装备的槽位明确表示为 `null`。 */
export interface GearSlotsViewModel {
  readonly armor: GearBuildViewModel | null;
  readonly gloves: GearBuildViewModel | null;
  readonly accessory1: GearBuildViewModel | null;
  readonly accessory2: GearBuildViewModel | null;
}

/** 一条轨道的完整只读配装投影；空轨道同样返回固定形状。 */
export interface TrackLoadoutBuildViewModel {
  readonly trackIndex: TrackIndex;
  readonly operator: OperatorBuildViewModel | null;
  readonly weapon: WeaponBuildViewModel | null;
  readonly gears: GearSlotsViewModel;
}

function requireBuild<T>(build: T | undefined, path: string, buildId: string): T {
  if (build === undefined) throw new Error(`${path} references missing build '${buildId}'`);
  return build;
}

function requireDefinition<T>(
  definition: T | null,
  expectedSlug: string,
  kind: string,
  identity: (value: T) => string,
): T {
  if (definition === null) throw new Error(`${kind} definition '${expectedSlug}' does not exist`);
  const actualSlug = identity(definition);
  if (actualSlug !== expectedSlug) {
    throw new Error(
      `${kind} definition '${expectedSlug}' resolved definition identity '${actualSlug}'`,
    );
  }
  return definition;
}

function projectOperator(
  build: OperatorBuildDocument,
  repository: GameDataRepository,
): OperatorBuildViewModel {
  const definition = requireDefinition(
    repository.getOperator(build.operatorSlug),
    build.operatorSlug,
    'operator',
    value => value.slug,
  );
  return {
    buildId: build.id,
    operatorSlug: build.operatorSlug,
    level: build.level,
    promoted: build.promoted,
    potential: build.potential,
    trustLevel: build.trustLevel,
    skillLevels: { ...build.skillLevels },
    talentStates: { ...build.talentStates },
    ...(build.baseStatOverrides === undefined
      ? {}
      : { baseStatOverrides: { ...build.baseStatOverrides } }),
    definition,
  };
}

function projectWeapon(
  build: WeaponBuildDocument,
  repository: GameDataRepository,
): WeaponBuildViewModel {
  return {
    buildId: build.id,
    weaponSlug: build.weaponSlug,
    level: build.level,
    tuned: build.tuned,
    potential: build.potential,
    traitLevels: [...build.traitLevels],
    definition: requireDefinition(
      repository.getWeapon(build.weaponSlug),
      build.weaponSlug,
      'weapon',
      value => value.slug,
    ),
  };
}

function projectGear(
  slot: LoadoutGearSlot,
  build: GearBuildDocument,
  repository: GameDataRepository,
): GearBuildViewModel {
  return {
    slot,
    buildId: build.id,
    gearSlug: build.gearSlug,
    artificingLevels: [...build.artificingLevels],
    definition: requireDefinition(
      repository.getGear(build.gearSlug),
      build.gearSlug,
      'gear',
      value => value.slug,
    ),
  };
}

/**
 * 解析指定轨道当前引用的全部 Build。任何非空引用都必须同时存在 Build 和定义；
 * 本函数不会用定义默认值掩盖损坏项目，也不会校验装备兼容性或计算面板。
 */
export function projectTrackLoadoutBuilds(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  repository: GameDataRepository,
): TrackLoadoutBuildViewModel {
  const track = scenario.tracks[trackIndex];
  if (track === null) {
    return {
      trackIndex,
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    };
  }

  const trackPath = `scenario.tracks[${trackIndex}]`;
  const operator =
    track.operatorBuildId === null
      ? null
      : projectOperator(
          requireBuild(
            scenario.builds.operators[track.operatorBuildId],
            `${trackPath}.operatorBuildId`,
            track.operatorBuildId,
          ),
          repository,
        );
  const weapon =
    track.weaponBuildId === null
      ? null
      : projectWeapon(
          requireBuild(
            scenario.builds.weapons[track.weaponBuildId],
            `${trackPath}.weaponBuildId`,
            track.weaponBuildId,
          ),
          repository,
        );

  const projectSlot = (slot: LoadoutGearSlot): GearBuildViewModel | null => {
    const buildId = track.gearBuildIds[slot];
    if (buildId === null) return null;
    return projectGear(
      slot,
      requireBuild(scenario.builds.gears[buildId], `${trackPath}.gearBuildIds.${slot}`, buildId),
      repository,
    );
  };

  return {
    trackIndex,
    operator,
    weapon,
    gears: {
      armor: projectSlot('armor'),
      gloves: projectSlot('gloves'),
      accessory1: projectSlot('accessory1'),
      accessory2: projectSlot('accessory2'),
    },
  };
}
