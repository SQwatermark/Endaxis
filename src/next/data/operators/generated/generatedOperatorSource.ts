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
  readonly calculation: 'standard' | 'breakingAttack';
  readonly attackScale: GeneratedScalarSource;
  readonly calculationMultiplier: GeneratedScalarSource | null;
  readonly poiseValue: GeneratedScalarSource | null;
}

export interface GeneratedTimedDamageSource {
  readonly startFrame: number;
  readonly endFrame: number;
  /** 同一原生 TimelineAction 展开后的动作顺序，用于维持同帧结算次序。 */
  readonly actionIndex: number;
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
}

export interface GeneratedAuxiliaryActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly actionType: 'CreateBuffAction' | 'SpawnAbilityEntity';
  readonly sourceId: string;
  /** 原生辅助行为的已确认语义；是否输出为步骤由具体分类决定，null 会阻止正式生成。 */
  readonly classification:
    | 'incomingDamageProtection'
    | 'inputLock'
    | 'skillCostUltimateEnergyGain'
    | 'tutorialMarker'
    | 'electrificationReaction'
    | 'nonCombatAbilityEntity'
    | null;
  readonly blackboardAssignments: Readonly<Record<string, GeneratedScalarSource>>;
  readonly nestedCombatActions: readonly string[];
}

export interface GeneratedTimedInflictionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly element: 'heat' | 'cryo' | 'electric' | 'nature';
  readonly isExtra: boolean;
}

export interface GeneratedTimedResourceGainSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly resource: 'sp' | 'ultimateEnergy';
  readonly amount: GeneratedScalarSource;
  readonly coefficient: GeneratedScalarSource;
}

export interface GeneratedProjectileHitSource {
  readonly launchFrame: number;
  /** 暂定为0；后续接入 ProjectileData 飞行时间后替换。 */
  readonly assumedTravelFrames: 0;
  readonly projectileId: string;
  readonly hitSkillId: string;
  readonly sourceFile: string;
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  /** 命中技能内仍可能影响战斗的原生行为；非空时不得作为纯表现投射物省略。 */
  readonly combatActions: readonly string[];
  /** 命中 SkillData 再次引用调用链中的同一技能时为真，避免静态生成无限递归。 */
  readonly cycleTruncated: boolean;
  readonly nestedProjectileHits: readonly GeneratedProjectileHitSource[];
}

export interface GeneratedProjectileLaunchSource {
  readonly launchFrame: number;
  readonly projectileId: string;
  readonly castSkillOnHit: boolean;
  readonly hitSkillId: string | null;
}

/** SpawnAbilityEntity 引用的子 SkillData；其内部时间均相对 spawnFrame 记录。 */
export interface GeneratedAbilityEntityHitSource {
  readonly spawnFrame: number;
  readonly abilityEntityId: string;
  readonly skillId: string;
  readonly sourceFile: string;
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  readonly inflictions: readonly GeneratedTimedInflictionSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  /** 原始发射动作；没有命中子技能时仍保留在这里，不能据此推断为无战斗效果。 */
  readonly projectileLaunches: readonly GeneratedProjectileLaunchSource[];
  readonly projectileHits: readonly GeneratedProjectileHitSource[];
  readonly nestedAbilityEntityHits: readonly GeneratedAbilityEntityHitSource[];
  readonly combatActions: readonly string[];
  readonly cycleTruncated: boolean;
}

/** CreateBuffAction 引用的 BuffData 时间轴；触发事件尚未解析前不得直接视为即时效果。 */
export interface GeneratedBuffBehaviorSource {
  readonly applicationFrame: number | null;
  /** 非 null 表示该 Buff 由父 Buff 的事件槽位施加，具体帧只能在运行时确定。 */
  readonly applicationEvent: string | null;
  readonly buffId: string;
  readonly sourceFile: string;
  /** false 表示当前 BuffData 导出缺少该引用，审计层不得把它视为已解析。 */
  readonly sourceAvailable: boolean;
  readonly lifeType: string;
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  /** 会影响战斗动作集合的原生条件分支；unsupported 条件不得直接编译。 */
  readonly conditionalActions: readonly GeneratedConditionalActionSource[];
  /** 按时间顺序写回 Buff 黑板、供后续动作读取的原生简单计算。 */
  readonly blackboardCalculations: readonly GeneratedBlackboardCalculationSource[];
  readonly eventActions: readonly GeneratedBuffEventActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  readonly nestedBuffBehaviors: readonly GeneratedBuffBehaviorSource[];
  readonly combatActions: readonly string[];
  readonly cycleTruncated: boolean;
}

export interface GeneratedConditionSource {
  readonly sourceType: string;
  readonly supported: boolean;
  readonly comparison: string | null;
  readonly left: GeneratedScalarSource | null;
  readonly right: GeneratedScalarSource | null;
  readonly skillTypes: readonly string[];
}

export interface GeneratedConditionalActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  /** 从 timeline 下标开始的原始对象路径，用于回查嵌套分支。 */
  readonly actionPath: readonly string[];
  readonly conditions: readonly GeneratedConditionSource[];
  readonly succeedCombatActions: readonly string[];
  readonly failCombatActions: readonly string[];
}

export interface GeneratedBlackboardCalculationSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly key: string;
  readonly operation: string;
  readonly left: GeneratedScalarSource;
  readonly right: GeneratedScalarSource;
}

export interface GeneratedBuffEventActionSource {
  readonly event: string;
  readonly combatActions: readonly string[];
  readonly damageUnits: readonly GeneratedDamageUnitSource[];
  readonly createdBuffIds: readonly string[];
  readonly createdBuffBehaviors: readonly GeneratedBuffBehaviorSource[];
}

export interface GeneratedSkillSource {
  readonly key: string;
  readonly skillId: string;
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
  readonly directDamageHits: readonly GeneratedTimedDamageSource[];
  readonly inflictions: readonly GeneratedTimedInflictionSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  readonly projectileLaunches: readonly GeneratedProjectileLaunchSource[];
  readonly projectileHits: readonly GeneratedProjectileHitSource[];
  readonly abilityEntityHits: readonly GeneratedAbilityEntityHitSource[];
  readonly buffBehaviors: readonly GeneratedBuffBehaviorSource[];
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
