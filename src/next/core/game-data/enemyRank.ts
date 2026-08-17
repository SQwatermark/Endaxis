/** 原生 EnemyTemplateData.rank；与用于筛选和展示的五档 EnemyTier 无关。 */
export const ENEMY_RANKS = ['mob', 'elite', 'boss'] as const;
export type EnemyRank = (typeof ENEMY_RANKS)[number];

export function isEnemyRank(value: unknown): value is EnemyRank {
  return typeof value === 'string' && (ENEMY_RANKS as readonly string[]).includes(value);
}
