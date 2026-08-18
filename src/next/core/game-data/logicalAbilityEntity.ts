/** 零空间模型中仍需保持身份的三类运行时目标。 */
export type RuntimeTargetRef =
  | { readonly kind: 'operator'; readonly operatorId: string }
  | { readonly kind: 'enemy' }
  | { readonly kind: 'abilityEntity'; readonly instanceId: number };

/** Context 目标组只保存稳定句柄；距离与形状不会进入组身份。 */
export type RuntimeTargetGroup = readonly RuntimeTargetRef[];

/** 逻辑能力实体参与通用实体运行时时使用的稳定身份。 */
export function logicalAbilityEntityRuntimeId(instanceId: number): string {
  if (!Number.isInteger(instanceId) || instanceId <= 0) {
    throw new RangeError('AbilityEntity instance id must be a positive integer');
  }
  return `ability-entity:${instanceId}`;
}

/** OwnerSpawnedEntityFinder 经生成期解析后仍需保留的非空间筛选。 */
export interface OwnerSpawnedAbilityEntityQuery {
  readonly ownerId: string;
  readonly abilityEntityIds?: readonly string[];
  /** 原生 SkillCastIdValidator：只保留同一来源施法生成的实例。 */
  readonly sourceSkillCastId?: number;
}
