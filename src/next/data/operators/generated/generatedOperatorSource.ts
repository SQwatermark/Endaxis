/**
 * 解包数据到正式干员 DSL 之间的可审计中间层。
 * 这里保存原始时间窗口和行为类型；未完成语义转换的行为不得直接进入战斗模拟。
 */
import type { SkillType } from '../../../core/game-data/operatorDefinition';

export interface GeneratedTimelineActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionTypes: readonly string[];
}

export interface GeneratedScalarSource {
  readonly value: number;
  readonly blackboardKey: string | null;
  /** 按技能等级排列的解析值；null 表示该标量不是等级黑板引用或仍未闭环。 */
  readonly levelValues: readonly number[] | null;
}

export interface GeneratedSkillPatchSource {
  readonly levels: readonly number[];
  readonly blackboard: Readonly<Record<string, readonly number[]>>;
  readonly cooldownSeconds: readonly number[];
  readonly costTypes: readonly number[];
  readonly costValues: readonly number[];
}

export interface GeneratedDamageUnitSource {
  readonly damageType: string;
  readonly attributeType: string;
  readonly attackScale: GeneratedScalarSource;
  readonly poiseValue: GeneratedScalarSource | null;
}

export interface GeneratedProjectileHitSource {
  readonly launchFrame: number;
  /** 暂定为0；后续接入 ProjectileData 飞行时间后替换。 */
  readonly assumedTravelFrames: 0;
  readonly projectileId: string;
  readonly hitSkillId: string;
  readonly sourceFile: string;
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
  /** 命中 SkillData 再次引用调用链中的同一技能时为真，避免静态生成无限递归。 */
  readonly cycleTruncated: boolean;
  readonly nestedProjectileHits: readonly GeneratedProjectileHitSource[];
}

export interface GeneratedSkillSource {
  readonly key: string;
  readonly skillType: SkillType;
  readonly sourceFile: string;
  readonly timelineBlockFrames: number;
  readonly blockBoundarySource: 'exclusiveFrame+1' | 'AllowNextSkillAction.startFrame';
  readonly cooldownSeconds: number;
  readonly costFrame: number;
  readonly costType: string;
  readonly costValue: number;
  readonly offsetRecordFrame: number;
  readonly allowNextWindows: readonly {
    readonly startFrame: number;
    readonly endFrame: number;
    readonly skillIds: readonly string[];
  }[];
  readonly inputCacheWindows: readonly {
    readonly startFrame: number;
    readonly endFrame: number;
    readonly mappings: readonly Readonly<Record<string, unknown>>[];
  }[];
  readonly timelineActions: readonly GeneratedTimelineActionSource[];
  readonly projectileHits: readonly GeneratedProjectileHitSource[];
  /** 与本技能 SkillData 对应的逐等级补丁数据。 */
  readonly patch: GeneratedSkillPatchSource;
  /** 需要由 SkillPatch、Buff 或运行时上下文赋值后才能闭环的原生黑板键。 */
  readonly blackboardKeys: readonly string[];
  /** 尚未转换成 Next 语义步骤的战斗行为；非空时不能把该技能视为生成完成。 */
  readonly unresolvedCombatActions: readonly string[];
}

export interface GeneratedOperatorSource {
  readonly slug: string;
  readonly skills: readonly GeneratedSkillSource[];
}
