/**
 * 将新版已经审核的数据定义装配成核心可读取的只读定义。
 * 数据仓库只按稳定身份查找，不读取旧版 store，也不为尚未迁移的数据伪造默认定义。
 */
import type {
  GameDataBrowser,
  GameDataRepository,
  MechanicDefinitionRef,
} from '../core/game-data/gameDataRepository';
import type {
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../core/game-data/equipmentDefinition';
import type {
  OperatorBuffDefinitions,
  OperatorAbilityEntityDefinitions,
  OperatorDefinition,
} from '../core/game-data/operatorDefinition';
import type { EnemyDefinition } from '../core/game-data/enemyDefinition';
import {
  alesh,
  antal,
  akekuri,
  ardelia,
  avywenna,
  catcher,
  arcane,
  arclight,
  camille,
  chenQianyu,
  daPan,
  ember,
  endministrator,
  estella,
  fluorite,
  gilberta,
  lastRite,
  laevatain,
  lifeng,
  liino,
  mifu,
  perlica,
  pogranichnik,
  rossi,
  snowshine,
  tangtang,
  wulfgard,
  xaihi,
  yvonne,
  zhuangFangyi,
} from './operators';
import {
  nextGearDefinitionRegistration,
  nextGearSetDefinitionRegistration,
  nextGearDefinitions,
  sharedGearSetDefinitions,
} from './equipment';
import { legacyEnemyDefinitions } from './adapters/legacyEnemyDefinitionAdapter';
import { generatedCommonBuffDefinitions } from './operators/generated/commonBuffDefinitions.generated';
import { generatedCommonAbilityEntityDefinitions } from './operators/generated/commonAbilityEntityDefinitions.generated';
import { nextWeaponDefinitions } from './equipment/nextWeaponDefinitions';
import { legacyWeaponDefinitions, LEGACY_WEAPON_REVISION } from './revisions/weapons-v1';
import { restoreWeaponV2R1Definitions, WEAPON_V2_R1_REVISION } from './revisions/weapons-v2-r1';

/** 游戏数据内容发生任何会影响项目解析的变化时必须显式更新。 */
export const NEXT_GAME_DATA_REVISION = 'endaxis-next-definitions-v2-weapons-1.4.4-r2';

export interface GameDataRepositoryInput {
  readonly revision: string;
  readonly commonBuffDefinitions?: OperatorBuffDefinitions;
  readonly commonAbilityEntityDefinitions?: OperatorAbilityEntityDefinitions;
  readonly operators?: readonly OperatorDefinition[];
  readonly weapons?: readonly WeaponDefinition[];
  readonly gears?: readonly GearDefinition[];
  /** 只用于解析旧项目身份；浏览器仍只枚举规范定义。 */
  readonly gearAliases?: Readonly<Record<string, string>>;
  readonly gearSets?: readonly GearSetDefinition[];
  /** 原生套装 ID 与旧项目 slug 并存期间的身份兼容映射。 */
  readonly gearSetAliases?: Readonly<Record<string, string>>;
  readonly enemies?: readonly EnemyDefinition[];
  readonly mechanics?: readonly MechanicDefinitionRef[];
}

function indexDefinitions<T>(
  definitions: readonly T[],
  identity: (definition: T) => string,
  kind: string,
): ReadonlyMap<string, T> {
  const indexed = new Map<string, T>();
  for (const definition of definitions) {
    const id = identity(definition);
    if (id.length === 0) throw new Error(`${kind} identity must not be empty`);
    if (indexed.has(id)) throw new Error(`duplicate ${kind} definition '${id}'`);
    indexed.set(id, definition);
  }
  return indexed;
}

function indexSlugAliases<T extends { readonly slug: string }>(
  aliases: Readonly<Record<string, string>> | undefined,
  definitions: ReadonlyMap<string, T>,
  kind: string,
): ReadonlyMap<string, T> {
  const indexed = new Map<string, T>();
  for (const [alias, target] of Object.entries(aliases ?? {}).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    if (alias.length === 0 || target.length === 0) {
      throw new Error(`${kind} alias identity and target must not be empty`);
    }
    if (alias === target) throw new Error(`redundant ${kind} alias '${alias}'`);
    if (definitions.has(alias)) throw new Error(`${kind} alias '${alias}' shadows a definition`);
    const definition = definitions.get(target);
    if (definition === undefined) {
      throw new Error(`${kind} alias '${alias}' targets unknown definition '${target}'`);
    }
    indexed.set(alias, Object.freeze({ ...definition, slug: alias }));
  }
  return indexed;
}

/** 创建查询结果封闭的数据仓库；后续修改输入数组不会改变已经创建的查询结果。 */
export function createGameDataRepository(
  input: GameDataRepositoryInput,
): GameDataRepository & GameDataBrowser {
  if (input.revision.length === 0) throw new Error('game data revision must not be empty');
  const operatorList = Object.freeze([...(input.operators ?? [])]);
  const commonBuffDefinitions = Object.freeze({ ...(input.commonBuffDefinitions ?? {}) });
  const commonAbilityEntityDefinitions = Object.freeze({
    ...(input.commonAbilityEntityDefinitions ?? {}),
  });
  const weaponList = Object.freeze([...(input.weapons ?? [])]);
  const gearList = Object.freeze([...(input.gears ?? [])]);
  const gearSetList = Object.freeze([...(input.gearSets ?? [])]);
  const enemyList = Object.freeze([...(input.enemies ?? [])]);
  const operators = indexDefinitions(operatorList, value => value.slug, 'operator');
  const weapons = indexDefinitions(weaponList, value => value.slug, 'weapon');
  const gears = indexDefinitions(gearList, value => value.slug, 'gear');
  const gearSets = indexDefinitions(gearSetList, value => value.slug, 'gear set');
  const gearAliases = indexSlugAliases(input.gearAliases, gears, 'gear');
  const gearSetAliases = indexSlugAliases(input.gearSetAliases, gearSets, 'gear set');
  const enemies = indexDefinitions(enemyList, value => value.id, 'enemy');
  const mechanics = indexDefinitions(input.mechanics ?? [], value => value.id, 'mechanic');

  return Object.freeze({
    revision: input.revision,
    getCommonBuffDefinitions: () => commonBuffDefinitions,
    getCommonAbilityEntityDefinitions: () => commonAbilityEntityDefinitions,
    getOperators: () => operatorList,
    getWeapons: () => weaponList,
    getGears: () => gearList,
    getGearSets: () => gearSetList,
    getEnemies: () => enemyList,
    getOperator: (slug: string) => operators.get(slug) ?? null,
    getWeapon: (slug: string) => weapons.get(slug) ?? null,
    getGear: (slug: string) => gears.get(slug) ?? gearAliases.get(slug) ?? null,
    getGearSet: (slug: string) => gearSets.get(slug) ?? gearSetAliases.get(slug) ?? null,
    getEnemy: (id: string) => enemies.get(id) ?? null,
    getMechanic: (id: string) => mechanics.get(id) ?? null,
  });
}

/** 当前正式进入 Next 的默认数据仓库；其他数据迁移完成后必须在这里显式注册。 */
export const nextGameDataRepository = createGameDataRepository({
  revision: NEXT_GAME_DATA_REVISION,
  commonBuffDefinitions: generatedCommonBuffDefinitions,
  commonAbilityEntityDefinitions: generatedCommonAbilityEntityDefinitions,
  operators: [
    perlica,
    arcane,
    zhuangFangyi,
    arclight,
    gilberta,
    lifeng,
    estella,
    daPan,
    ember,
    akekuri,
    fluorite,
    endministrator,
    lastRite,
    chenQianyu,
    rossi,
    camille,
    pogranichnik,
    tangtang,
    laevatain,
    liino,
    mifu,
    yvonne,
    snowshine,
    wulfgard,
    antal,
    alesh,
    xaihi,
    avywenna,
    catcher,
    ardelia,
  ],
  weapons: nextWeaponDefinitions,
  gears: nextGearDefinitions,
  gearAliases: nextGearDefinitionRegistration.gearAliases,
  gearSets: sharedGearSetDefinitions,
  gearSetAliases: nextGearSetDefinitionRegistration.aliases,
  enemies: legacyEnemyDefinitions,
});

const legacyWeaponsBySlug = new Map(
  legacyWeaponDefinitions.map(definition => [definition.slug, definition]),
);
/** 仅供 v1 武器引用/词条兼容检查；其他定义沿用当前库，不承诺复现历史模拟结果。 */
export const weaponV1MigrationSource: GameDataRepository & GameDataBrowser = Object.freeze({
  ...nextGameDataRepository,
  revision: LEGACY_WEAPON_REVISION,
  getWeapons: () => legacyWeaponDefinitions,
  getWeapon: (slug: string) => legacyWeaponsBySlug.get(slug) ?? null,
});

const weaponV2R1Definitions = restoreWeaponV2R1Definitions(nextWeaponDefinitions);
const weaponV2R1BySlug = new Map(
  weaponV2R1Definitions.map(definition => [definition.slug, definition]),
);
export const weaponV2R1MigrationSource: GameDataRepository & GameDataBrowser = Object.freeze({
  ...nextGameDataRepository,
  revision: WEAPON_V2_R1_REVISION,
  getWeapons: () => weaponV2R1Definitions,
  getWeapon: (slug: string) => weaponV2R1BySlug.get(slug) ?? null,
});
