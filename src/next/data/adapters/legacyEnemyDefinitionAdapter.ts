/**
 * 把旧版静态敌人 sheet 单向转换为 Next 的只读敌人定义。
 * 本适配器只读取数据文件，不经过旧版 store、聚合入口或本地化函数。
 */
import type { EnemySheet } from '../../../data/types';
import type { EnemyDefinition, EnemyLevelHpDefinition } from '../../core/game-data/enemyDefinition';
import { DAMAGE_ELEMENTS } from '../../core/game-data/operatorDefinition';

const legacyEnemyModules = import.meta.glob('../../../data/enemies/*.ts', {
  eager: true,
  import: 'default',
}) as Record<string, EnemySheet>;

function requireFiniteNumber(value: unknown, field: string, enemyId: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`legacy enemy '${enemyId}' has invalid ${field}`);
  }
  return value;
}

function adaptLevelHp(sheet: EnemySheet, enemyId: string): readonly EnemyLevelHpDefinition[] {
  const result = Object.entries(sheet.levelHp)
    .map(([rawLevel, rawHp]) => ({
      level: Number(rawLevel),
      hp: requireFiniteNumber(rawHp, `levelHp.${rawLevel}`, enemyId),
    }))
    .sort((left, right) => left.level - right.level);

  if (result.length === 0) throw new Error(`legacy enemy '${enemyId}' has no level HP nodes`);
  for (const node of result) {
    if (!Number.isInteger(node.level) || node.level <= 0 || node.hp <= 0) {
      throw new Error(`legacy enemy '${enemyId}' has invalid level HP node`);
    }
  }
  return Object.freeze(result);
}

function adaptEnemy(enemyId: string, sheet: EnemySheet): EnemyDefinition {
  const resistances = Object.fromEntries(
    DAMAGE_ELEMENTS.map(element => [
      element,
      requireFiniteNumber(sheet.resistance[element], `resistance.${element}`, enemyId),
    ]),
  ) as Record<(typeof DAMAGE_ELEMENTS)[number], number>;

  return Object.freeze({
    id: enemyId,
    gameId: sheet.gameId,
    iconPath: sheet.avatar,
    tier: sheet.tier,
    levelHp: adaptLevelHp(sheet, enemyId),
    defense: requireFiniteNumber(sheet.def, 'defense', enemyId),
    resistances: Object.freeze(resistances),
    superArmor: requireFiniteNumber(sheet.superArmor, 'superArmor', enemyId),
    stagger: Object.freeze({
      maximum: requireFiniteNumber(sheet.maxStagger, 'maxStagger', enemyId),
      nodeCount: requireFiniteNumber(sheet.staggerNodeCount, 'staggerNodeCount', enemyId),
      nodeDurationSeconds: requireFiniteNumber(
        sheet.staggerNodeDuration,
        'staggerNodeDuration',
        enemyId,
      ),
      brokenDurationSeconds: requireFiniteNumber(
        sheet.staggerBreakDuration,
        'staggerBreakDuration',
        enemyId,
      ),
      finisherRecovery: requireFiniteNumber(sheet.finisherRecovery, 'finisherRecovery', enemyId),
    }),
    finisherMultiplier: requireFiniteNumber(
      sheet.finisherMultiplier,
      'finisherMultiplier',
      enemyId,
    ),
  });
}

/** 旧版文件名是现有项目存档使用的敌人身份，因此适配时保留该 slug。 */
export const legacyEnemyDefinitions: readonly EnemyDefinition[] = Object.freeze(
  Object.entries(legacyEnemyModules)
    .map(([path, sheet]) => {
      const enemyId = path.split('/').pop()?.replace(/\.ts$/, '') ?? '';
      if (enemyId.length === 0) throw new Error(`cannot derive enemy identity from '${path}'`);
      return adaptEnemy(enemyId, sheet);
    })
    .sort((left, right) => left.id.localeCompare(right.id)),
);
