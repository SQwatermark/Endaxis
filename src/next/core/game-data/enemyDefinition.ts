/**
 * 敌人在版本化游戏目录中的只读定义。
 * 项目文档只保存目录身份、等级和用户接管的覆盖值；名称由本地化层按 `id` 解析。
 */
import type { DamageElement } from './operatorDefinition';

export const ENEMY_TIERS = ['normal', 'advanced', 'elite', 'boss', 'leader'] as const;
/** 目录筛选和展示使用的敌人强度分类。 */
export type EnemyTier = (typeof ENEMY_TIERS)[number];

/** 数据源明确提供的一组等级生命值，不允许在目录适配阶段自行插值。 */
export interface EnemyLevelHpDefinition {
  readonly level: number;
  readonly hp: number;
}

/** 敌人失衡规则的目录默认值；时长沿用数据源的秒单位，进入场景时再换算为项目帧。 */
export interface EnemyStaggerDefinition {
  readonly maximum: number;
  readonly nodeCount: number;
  readonly nodeDurationSeconds: number;
  readonly brokenDurationSeconds: number;
  readonly finisherRecovery: number;
}

/**
 * 一个敌人的稳定目录身份和默认战斗数值。
 * 这里不保存本地化名称，也不持有项目实例或运行时可变状态。
 */
export interface EnemyDefinition {
  readonly id: string;
  /** 解包数据中的原始敌人身份，仅用于数据追踪，项目引用始终使用 `id`。 */
  readonly gameId: string;
  readonly iconPath?: string;
  readonly tier: EnemyTier;
  readonly levelHp: readonly EnemyLevelHpDefinition[];
  readonly defense: number;
  readonly resistances: Readonly<Record<DamageElement, number>>;
  readonly superArmor: number;
  readonly stagger: EnemyStaggerDefinition;
  readonly finisherMultiplier: number;
}

/** 只接受目录中明确存在的等级节点，避免把推测插值伪装成游戏数据。 */
export function getEnemyHpAtLevel(definition: EnemyDefinition, level: number): number | null {
  return definition.levelHp.find(node => node.level === level)?.hp ?? null;
}
