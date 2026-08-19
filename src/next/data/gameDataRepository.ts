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
import type { OperatorDefinition } from '../core/game-data/operatorDefinition';
import type { EnemyDefinition } from '../core/game-data/enemyDefinition';
import {
  akekuri,
  arcane,
  arclight,
  camille,
  chenQianyu,
  daPan,
  endministrator,
  estella,
  fluorite,
  gilberta,
  lastRite,
  lifeng,
  perlica,
  rossi,
  zhuangFangyi,
} from './operators';
import {
  sharedGearDefinitions,
  sharedGearSetDefinitions,
  sharedWeaponDefinitions,
} from './equipment';
import { legacyEnemyDefinitions } from './adapters/legacyEnemyDefinitionAdapter';

/** 游戏数据内容发生任何会影响项目解析的变化时必须显式更新。 */
export const NEXT_GAME_DATA_REVISION = 'endaxis-next-definitions-v1';

export interface GameDataRepositoryInput {
  readonly revision: string;
  readonly operators?: readonly OperatorDefinition[];
  readonly weapons?: readonly WeaponDefinition[];
  readonly gears?: readonly GearDefinition[];
  readonly gearSets?: readonly GearSetDefinition[];
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

/** 创建查询结果封闭的数据仓库；后续修改输入数组不会改变已经创建的查询结果。 */
export function createGameDataRepository(
  input: GameDataRepositoryInput,
): GameDataRepository & GameDataBrowser {
  if (input.revision.length === 0) throw new Error('game data revision must not be empty');
  const operatorList = Object.freeze([...(input.operators ?? [])]);
  const weaponList = Object.freeze([...(input.weapons ?? [])]);
  const gearList = Object.freeze([...(input.gears ?? [])]);
  const gearSetList = Object.freeze([...(input.gearSets ?? [])]);
  const enemyList = Object.freeze([...(input.enemies ?? [])]);
  const operators = indexDefinitions(operatorList, value => value.slug, 'operator');
  const weapons = indexDefinitions(weaponList, value => value.slug, 'weapon');
  const gears = indexDefinitions(gearList, value => value.slug, 'gear');
  const gearSets = indexDefinitions(gearSetList, value => value.slug, 'gear set');
  const enemies = indexDefinitions(enemyList, value => value.id, 'enemy');
  const mechanics = indexDefinitions(input.mechanics ?? [], value => value.id, 'mechanic');

  return Object.freeze({
    revision: input.revision,
    getOperators: () => operatorList,
    getWeapons: () => weaponList,
    getGears: () => gearList,
    getGearSets: () => gearSetList,
    getEnemies: () => enemyList,
    getOperator: (slug: string) => operators.get(slug) ?? null,
    getWeapon: (slug: string) => weapons.get(slug) ?? null,
    getGear: (slug: string) => gears.get(slug) ?? null,
    getGearSet: (slug: string) => gearSets.get(slug) ?? null,
    getEnemy: (id: string) => enemies.get(id) ?? null,
    getMechanic: (id: string) => mechanics.get(id) ?? null,
  });
}

/** 当前正式进入 Next 的默认数据仓库；其他数据迁移完成后必须在这里显式注册。 */
export const nextGameDataRepository = createGameDataRepository({
  revision: NEXT_GAME_DATA_REVISION,
  operators: [
    perlica,
    arcane,
    zhuangFangyi,
    arclight,
    gilberta,
    lifeng,
    estella,
    daPan,
    akekuri,
    fluorite,
    endministrator,
    lastRite,
    chenQianyu,
    rossi,
    camille,
  ],
  weapons: sharedWeaponDefinitions,
  gears: sharedGearDefinitions,
  gearSets: sharedGearSetDefinitions,
  enemies: legacyEnemyDefinitions,
});
