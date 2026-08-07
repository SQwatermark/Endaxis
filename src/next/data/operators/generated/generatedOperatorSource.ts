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

export type GeneratedAuxiliaryClassification =
  | 'incomingDamageProtection'
  | 'inputLock'
  | 'skillCostUltimateEnergyGain'
  | 'tutorialMarker'
  | 'electrificationReaction'
  | 'nonCombatAbilityEntity'
  | null;

export interface GeneratedAuxiliaryActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly actionType: 'CreateBuffAction' | 'SpawnAbilityEntity';
  readonly sourceId: string;
  /** 原生辅助行为的已确认语义；是否输出为步骤由具体分类决定，null 会阻止正式生成。 */
  readonly classification: GeneratedAuxiliaryClassification;
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

export interface GeneratedTimedResourceGainSource extends GeneratedResourceGainPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

export interface GeneratedProjectileHitSource {
  readonly launchFrame: number;
  /** 从根技能到当前投射物的分层原生动作顺序。 */
  readonly actionOrder: readonly number[];
  /** 暂定为0；后续接入 ProjectileData 飞行时间后替换。 */
  /** 单敌人必命中模型暂不计算距离、轨迹和范围，命中子技能与发射处于同一帧。 */
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

export interface GeneratedProjectileLaunchSource extends GeneratedProjectileLaunchPayload {
  readonly launchFrame: number;
}

/** SpawnAbilityEntity 引用的子 SkillData；其内部时间均相对 spawnFrame 记录。 */
export interface GeneratedAbilityEntityHitSource {
  readonly spawnFrame: number;
  /** 从根技能到当前能力实体的分层原生动作顺序。 */
  readonly actionOrder: readonly number[];
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
  readonly blackboardMutations: readonly GeneratedBlackboardMutationSource[];
  readonly buffBlackboardReads: readonly GeneratedBuffBlackboardReadSource[];
  readonly buffFinishes: readonly GeneratedBuffFinishSource[];
  readonly eventActions: readonly GeneratedBuffEventActionSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  readonly nestedBuffBehaviors: readonly GeneratedBuffBehaviorSource[];
  readonly combatActions: readonly string[];
  readonly cycleTruncated: boolean;
}

/** 原始目标集合数量检查；在单敌人模型中仍需判断是否可以安全消去。 */
export interface GeneratedEntityCountConditionSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly minimumCount: number;
  readonly comparison: string;
  readonly containsHittableTarget: boolean;
  readonly excludeDeadEntity: boolean;
  readonly storeKey: string;
}

/** 原始 Buff 层数检查；`BuffCount` 表示匹配 Buff 的强化层数总和。 */
export interface GeneratedBuffStackConditionSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: string;
  readonly buffTagIds: readonly number[];
  readonly countType: string;
  readonly comparison: string;
  readonly value: GeneratedScalarSource;
  readonly limitSkillCastId: boolean;
}

export interface GeneratedConditionSource {
  readonly sourceType: string;
  readonly supported: boolean;
  readonly comparison: string | null;
  readonly left: GeneratedScalarSource | null;
  readonly right: GeneratedScalarSource | null;
  readonly skillTypes: readonly string[];
  readonly entityCount?: GeneratedEntityCountConditionSource;
  readonly buffStack?: GeneratedBuffStackConditionSource;
}

export interface GeneratedConditionalActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  /** 条件根在所属原生时间轴中的动作顺序。 */
  readonly actionIndex: number;
  /** 从 timeline 下标开始的原始对象路径，用于回查嵌套分支。 */
  readonly actionPath: readonly string[];
  readonly conditions: readonly GeneratedConditionSource[];
  readonly succeedActions: readonly GeneratedConditionalBranchActionSource[];
  readonly failActions: readonly GeneratedConditionalBranchActionSource[];
}

export interface GeneratedBlackboardCalculationPayload {
  readonly key: string;
  readonly operation: string;
  readonly left: GeneratedScalarSource;
  readonly right: GeneratedScalarSource;
}

export interface GeneratedBlackboardMutationPayload {
  readonly key: string;
  readonly operation: string;
  readonly value: GeneratedScalarSource;
}

export interface GeneratedBuffBlackboardReadPayload {
  readonly outputKey: string;
  readonly desiredKey: string;
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
  /** 原始有符号 int32 标签；进入运行时前须转为 GameplayTagId，不得与 DamageTag 混用。 */
  readonly buffTagIds: readonly number[];
}

export interface GeneratedBuffFinishPayload {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
  readonly buffTagIds: readonly number[];
  readonly finishAll: boolean;
  readonly limitSource: boolean;
  readonly isFinishedEarly: boolean;
  readonly isAbsorbed: boolean;
}

export interface GeneratedBuffStackReadPayload {
  readonly outputKey: string;
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll';
  readonly buffTagIds: readonly number[];
  readonly countType: string;
  readonly limitSkillCastId: boolean;
}

export interface GeneratedBuffApplicationEntryPayload {
  readonly buffId: string;
  readonly classification: GeneratedAuxiliaryClassification;
  readonly blackboardAssignments: Readonly<Record<string, GeneratedScalarSource>>;
}

export interface GeneratedBuffApplicationPayload {
  readonly buffs: readonly GeneratedBuffApplicationEntryPayload[];
}

export interface GeneratedResourceGainPayload {
  readonly resource: 'sp' | 'ultimateEnergy';
  readonly amount: GeneratedScalarSource;
  readonly coefficient: GeneratedScalarSource;
}

export interface GeneratedProjectileLaunchPayload {
  readonly projectileId: string;
  readonly castSkillOnHit: boolean;
  readonly hitSkillId: string | null;
}

export interface GeneratedAbilityEntitySpawnPayload {
  readonly abilityEntityId: string;
  readonly skillId: string | null;
}

/** 条件分支中的一个直接子动作；嵌套条件保持在原始动作位置。 */
export interface GeneratedConditionalBranchActionSource {
  readonly actionType: string;
  /** 在所属 succeedActions/failActions 原始 actionData 中的下标。 */
  readonly actionIndex: number;
  readonly nestedCondition?: GeneratedConditionalActionSource;
  readonly blackboardCalculation?: GeneratedBlackboardCalculationPayload;
  readonly blackboardMutation?: GeneratedBlackboardMutationPayload;
  readonly buffBlackboardRead?: GeneratedBuffBlackboardReadPayload;
  readonly buffFinish?: GeneratedBuffFinishPayload;
  readonly buffStackRead?: GeneratedBuffStackReadPayload;
  readonly buffApplication?: GeneratedBuffApplicationPayload;
  readonly resourceGain?: GeneratedResourceGainPayload;
  readonly projectileLaunch?: GeneratedProjectileLaunchPayload;
  readonly abilityEntitySpawn?: GeneratedAbilityEntitySpawnPayload;
}

export interface GeneratedBlackboardCalculationSource
  extends GeneratedBlackboardCalculationPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

/** 直接修改当前动作黑板的原生运行时操作。 */
export interface GeneratedBlackboardMutationSource extends GeneratedBlackboardMutationPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

/** 从目标 Buff 实例黑板读取数值并写入当前动作黑板。 */
export interface GeneratedBuffBlackboardReadSource extends GeneratedBuffBlackboardReadPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

/** 原生 FinishBuffAdvanced 的可审计配置；正式 DSL 只接收已闭环的查询子集。 */
export interface GeneratedBuffFinishSource extends GeneratedBuffFinishPayload {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
}

/** 黑板键在当前技能中的可追溯来源；外部输入不得由生成器猜值。 */
export interface GeneratedBlackboardKeyProvenanceSource {
  readonly key: string;
  readonly declaredInSkill: boolean;
  readonly suppliedByPatch: boolean;
  readonly calculatedLocally: boolean;
  readonly mutatedLocally: boolean;
  readonly readFromBuff: boolean;
  readonly externalRuntimeInput: boolean;
}

export interface GeneratedDeclaredBlackboardValueSource {
  readonly key: string;
  readonly value: number;
  readonly isDynamic: boolean;
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
  readonly conditionalActions: readonly GeneratedConditionalActionSource[];
  readonly inflictions: readonly GeneratedTimedInflictionSource[];
  readonly auxiliaryActions: readonly GeneratedAuxiliaryActionSource[];
  readonly blackboardCalculations: readonly GeneratedBlackboardCalculationSource[];
  readonly blackboardMutations: readonly GeneratedBlackboardMutationSource[];
  readonly buffBlackboardReads: readonly GeneratedBuffBlackboardReadSource[];
  readonly buffFinishes: readonly GeneratedBuffFinishSource[];
  readonly resourceGains: readonly GeneratedTimedResourceGainSource[];
  readonly projectileLaunches: readonly GeneratedProjectileLaunchSource[];
  readonly projectileHits: readonly GeneratedProjectileHitSource[];
  readonly abilityEntityHits: readonly GeneratedAbilityEntityHitSource[];
  readonly buffBehaviors: readonly GeneratedBuffBehaviorSource[];
  /** 与本技能 SkillData 对应的逐等级补丁数据。 */
  readonly patch: GeneratedSkillPatchSource;
  /** SkillData 声明的黑板默认值；同名 SkillPatch 值在编译时覆盖它。 */
  readonly declaredBlackboard: readonly GeneratedDeclaredBlackboardValueSource[];
  /** 需要由 SkillPatch、Buff 或运行时上下文赋值后才能闭环的原生黑板键。 */
  readonly blackboardKeys: readonly string[];
  readonly blackboardProvenance: readonly GeneratedBlackboardKeyProvenanceSource[];
  /** 尚未转换成 Next 语义步骤的战斗行为；非空时不能把该技能视为生成完成。 */
  readonly unresolvedCombatActions: readonly string[];
}

export interface GeneratedOperatorSource {
  readonly slug: string;
  readonly skills: readonly GeneratedSkillSource[];
}
