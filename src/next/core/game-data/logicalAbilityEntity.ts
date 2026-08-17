import type { GameplayTagId, GameplayTagQueryType } from '../combat/tags/gameplayTags';

/** 零空间模型中仍需保持身份的三类运行时目标。 */
export type RuntimeTargetRef =
  | { readonly kind: 'operator'; readonly operatorId: string }
  | { readonly kind: 'enemy' }
  | { readonly kind: 'abilityEntity'; readonly instanceId: number };

/** Context 目标组只保存稳定句柄；距离与形状不会进入组身份。 */
export type RuntimeTargetGroup = readonly RuntimeTargetRef[];

/** 能力实体模板的生命周期；原生枚举值必须先在数据适配层得到明确映射。 */
export type LogicalAbilityEntityLifetime =
  { readonly kind: 'limited'; readonly durationSeconds: number } | { readonly kind: 'infinite' };

/** 从 VFS 模板证据投影出的最小运行时蓝图。 */
export interface LogicalAbilityEntityTemplate {
  readonly id: string;
  readonly bornTagIds: readonly GameplayTagId[];
  readonly lifetime: LogicalAbilityEntityLifetime;
  /** 仅保留来源事实；达到上限时如何替换旧实例尚未得到规则证据。 */
  readonly maxStackingCount: number;
}

/** OwnerSpawnedEntityFinder 在零空间模型下仍需保留的非空间筛选。 */
export interface OwnerSpawnedAbilityEntityQuery {
  readonly ownerId: string;
  readonly tagQuery?: {
    readonly type: GameplayTagQueryType;
    readonly tagIds: readonly GameplayTagId[];
    readonly exact?: boolean;
  };
}
