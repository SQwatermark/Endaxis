import type { BuffApplicationActionSource } from '../source/buffActions.ts';
import type { ProjectileLaunchActionSource } from '../source/referenceActions.ts';
import type { ScalarSource } from '../source/scalar.ts';
import type { CompiledBuffNumberSource } from './buffProjectionTypes.ts';
import type { CompiledBuffStepSource } from './combatActionProjectionTypes.ts';
import type { GameplayTagRegistry } from '../../../../src/shared/gameplayTags.ts';
import type { CompiledAbilityEntityTemplateCatalogSource } from './abilityEntityCatalog.ts';
import type { GlobalBuffActionSource } from '../source/globalBuffActions.ts';
import type { SkillSettingReadActionSource } from '../source/skillSettingActions.ts';
import type { TargetGroupActionSource } from '../source/targetGroup.ts';

/** 公共投影的底层约定：宿主/目标身份、已证明的即时搜索、数值引用和共享枚举映射。
 * 条件、动作及 Buff 装配共用同一份实现；不得反向调用序列编排或具体动作投影。 */

export type ProjectedTargetGroup =
  | 'party'
  | 'partyExceptCaster'
  | 'abilityEntity'
  | 'controlledOperator'
  | 'enemy'
  | 'empty'
  | 'spatialPoint';

/** 原生动作身份由宿主及事件方向共同投影，不能把物理事件来源一律当作 ActionSource。 */
export interface CombatActionProjectionContextSource {
  /** 回调宿主未投影时显式 unavailable；读取 Owner 必须失败，不能借用发射者。 */
  readonly actionOwnerTarget: 'buffOwner' | 'caster' | 'currentAbilityEntity' | 'unavailable';
  /** 接收侧 Buff 事件保留监听器创建者；其他路径沿用已审计的宿主投影。 */
  readonly actionSourceTarget: 'caster' | 'buffSource';
  /** 主动命中可显式绑定 enemy；不伪造 Buff 事件。接收侧 Target 是事件施加者。 */
  readonly actionTargetTarget:
    | 'enemy'
    | 'buffOwner'
    | 'currentAbilityEntity'
    | 'eventTarget'
    | 'eventSource'
    | 'partyExceptCaster'
    | 'partyExceptCasterAndSameCharacterType';
  /**
   * 同版本模板与标签目录；仅适用于已核实查询标签不会被运行时增删的 born-tag 筛选。
   * 动态实体标签需另接运行时验证，不能以目录候选替代；目录本身也不是已生成实例集合。
   */
  readonly abilityEntityQueries?: {
    readonly catalog: CompiledAbilityEntityTemplateCatalogSource;
    readonly gameplayTagRegistry: GameplayTagRegistry;
  };
  /** 由整名 Buff 依赖数据流证明，用于归约相对 buffOwner 的选敌/条件；缺失时仍严格失败。 */
  readonly fixedBuffOwnerTarget?: 'caster' | 'enemy' | 'currentAbilityEntity';
  /** 已由同一主动技能动作图证明会命中唯一木桩的命名目标组。 */
  readonly staticEnemyTargetGroupKeys?: ReadonlySet<string>;
  /** 完整技能内所有读取均为表现的查询；不能在单个序列内自行推断。 */
  readonly presentationOnlyTargetGroupKeys?: ReadonlySet<string>;
  /** 仅技能时间轴宿主提供；Buff 生命周期和即时回调不具有可跳转时间轴。 */
  readonly timelineRange?: { readonly startFrame: number; readonly endFrame: number };
  /** 当前场景额外提供的 IHittableObject 数量；未声明时不得假定为零。 */
  readonly fixedHittableTargetCount?: number;
}

/** 领域宿主可显式补入公共动作叶子的已审计投影；未提供时仍严格失败。 */
export interface CombatActionProjectionExtensionsSource {
  readonly compileProjectileLaunch?: (
    action: ProjectileLaunchActionSource,
    sourcePath: string,
    context: CombatActionProjectionContextSource,
  ) => readonly CompiledBuffStepSource[];
  readonly resolveTimeDilationPriority?: (tagId: number, sourcePath: string) => number;
  readonly compileGlobalBuffAction?: (
    action: GlobalBuffActionSource,
    sourcePath: string,
    context: CombatActionProjectionContextSource,
  ) => readonly CompiledBuffStepSource[];
  readonly compileSkillSettingRead?: (
    action: SkillSettingReadActionSource,
    sourcePath: string,
    context: CombatActionProjectionContextSource,
  ) => readonly CompiledBuffStepSource[];
}

export const BUFF_ACTION_CONTEXT: CombatActionProjectionContextSource = {
  actionOwnerTarget: 'buffOwner',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'eventTarget',
};

export function requireActionOwnerProjection(
  context: CombatActionProjectionContextSource,
  sourcePath: string,
): 'buffOwner' | 'caster' | 'currentAbilityEntity' {
  if (context.actionOwnerTarget === 'unavailable') {
    throw new Error(`${sourcePath}: action Owner projection is unavailable`);
  }
  return context.actionOwnerTarget;
}

/**
 * 固定唯一敌人模型中，已证明只会返回存活敌人的目标组搜索。
 * HitBox 的形状、中心和方向在零空间下不改变集合；过滤、后处理仍须为空。
 */
export function isStaticSingleEnemyTargetGroup(write: TargetGroupActionSource): boolean {
  return (
    (write.producerType === 'FindTargetAction' ||
      write.producerType === 'ContinuousFindTargetAction' ||
      write.producerType === 'ConvertToTargetContext') &&
    write.validatorTypes.length === 0 &&
    write.postProcessorTypes.length === 0 &&
    (write.finderType === 'MainTargetFinder' ||
      (write.finderType === 'HitBoxFinder' &&
        write.finderFactionTarget === 'Anti' &&
        write.finderTargetObjectType === 'Normal' &&
        write.finderCheckAlive === true))
  );
}

/**
 * 唯一敌人已作为当前 Target 进入动作时，命中盒“搜索敌人 → 排除当前 Target”必定为空。
 * 只接受萤石反弹分支观测到的完整后处理形状；未知排序或 Buff 过滤不在这里被吞掉。
 */
export function isEmptyStaticEnemyExclusionTargetGroup(write: TargetGroupActionSource): boolean {
  const priority = write.priorityFilters[0];
  return (
    write.producerType === 'FindTargetAction' &&
    write.finderType === 'HitBoxFinder' &&
    write.finderFactionTarget === 'Anti' &&
    write.finderTargetObjectType === 'Normal' &&
    write.finderCheckAlive === true &&
    write.finderOwnerPartsQuery === null &&
    write.finderSpawnedObjectType === null &&
    write.validatorTypes.length === 0 &&
    write.validatorTagQueries.length === 0 &&
    write.distanceValidators.length === 0 &&
    write.shuffleTargets.length === 0 &&
    write.selectorOwner === 'ActionOwner' &&
    write.selectorOwnerContextKey === '' &&
    write.center === 'ActionSource' &&
    write.centerContextKey === '' &&
    !write.excludesOwner &&
    write.excludesCurrentTarget &&
    write.postProcessorTypes.length === 2 &&
    write.postProcessorTypes[0] === 'ExcludeTarget' &&
    write.postProcessorTypes[1] === 'PriorityFilter' &&
    write.priorityFilters.length === 1 &&
    priority?.filterType === 'DistanceFromCenterAsc' &&
    priority.onlyReserveMaxPriorityTargets === false &&
    priority.limitMaxNum === true &&
    priority.maxNum === 1 &&
    priority.buffFilter.checkType === 'Id' &&
    priority.buffFilter.buffIds.length === 0 &&
    priority.buffFilter.tagQuery.queryType === 'hasAny' &&
    priority.buffFilter.tagQuery.tagIds.length === 0 &&
    priority.buffFilter.stackCountType === 'BuffCount'
  );
}

/** 固定小队模型中严格折叠已证明的“全队成员排除动作 owner”即时搜索。 */
export function isPartyExceptOwnerInstantSearch(
  target: BuffApplicationActionSource['target'],
): boolean {
  return (
    target.targetSource === 'InstantSearch' &&
    target.selectorOwner === 'ActionOwner' &&
    target.ownerContextKey === '' &&
    target.centerType === 'ActionSource' &&
    target.centerContextKey === '' &&
    !target.centerToGround &&
    target.target === 'ActionSource' &&
    target.targetContextKey === '' &&
    !target.enableAdvancedDirection &&
    target.selectorDirection === 'SourceForward' &&
    target.finderType === 'CharacterTeamFinder' &&
    target.finderShape === null &&
    target.finderOwnerPartsQuery === null &&
    target.validatorTypes.length === 1 &&
    target.validatorTypes[0] === 'ExcludeOwnerValidator' &&
    target.postProcessorTypes.length === 0 &&
    target.priorityFilters.length === 0 &&
    target.shuffleTargets.length === 0 &&
    target.distanceValidators.length === 0 &&
    target.finderSpawnedObjectType === null &&
    target.validatorTagQueries.length === 0
  );
}

/** 固定队伍模型中的 CharacterTeamFinder + MainCharacterValidator。 */
export function isControlledOperatorInstantSearch(
  target: BuffApplicationActionSource['target'],
): boolean {
  return (
    target.targetSource === 'InstantSearch' &&
    target.finderType === 'CharacterTeamFinder' &&
    target.validatorTypes.length === 1 &&
    target.validatorTypes[0] === 'MainCharacterValidator' &&
    target.postProcessorTypes.length === 0
  );
}

export function isOwnerSpawnedAbilityEntityInstantSearch(
  target: BuffApplicationActionSource['target'],
): boolean {
  return (
    target.targetSource === 'InstantSearch' &&
    target.finderType === 'OwnerSpawnedEntityFinder' &&
    target.finderSpawnedObjectType === 'AbilityEntity' &&
    target.validatorTypes.length === 0 &&
    target.postProcessorTypes.length === 0 &&
    target.validatorTagQueries.length === 0
  );
}

/** 固定小队模型中严格折叠无筛选的即时全队搜索。 */
export function isPartyInstantSearch(target: BuffApplicationActionSource['target']): boolean {
  return (
    target.targetSource === 'InstantSearch' &&
    target.selectorOwner === 'ActionOwner' &&
    target.ownerContextKey === '' &&
    target.centerType === 'ActionSource' &&
    target.centerContextKey === '' &&
    !target.centerToGround &&
    target.target === 'ActionSource' &&
    target.targetContextKey === '' &&
    !target.enableAdvancedDirection &&
    target.selectorDirection === 'SourceForward' &&
    target.finderType === 'CharacterTeamFinder' &&
    target.finderShape === null &&
    target.finderOwnerPartsQuery === null &&
    target.validatorTypes.length === 0 &&
    target.postProcessorTypes.length === 0 &&
    target.priorityFilters.length === 0 &&
    target.shuffleTargets.length === 0 &&
    target.distanceValidators.length === 0 &&
    target.finderSpawnedObjectType === null &&
    target.validatorTagQueries.length === 0
  );
}

export function scalarOperand(source: ScalarSource): CompiledBuffNumberSource {
  return source.blackboardKey === null ? source.value : { blackboardKey: source.blackboardKey };
}

export function actionValueOperand(source: ScalarSource):
  | { readonly kind: 'constant'; readonly value: number }
  | {
      readonly kind: 'blackboard';
      readonly key: string;
    } {
  return source.blackboardKey === null
    ? { kind: 'constant', value: source.value }
    : { kind: 'blackboard', key: source.blackboardKey };
}

export const DAMAGE_TYPES: Readonly<
  Record<
    string,
    'physical' | 'true' | 'heat' | 'electric' | 'cryo' | 'lifeDrain' | 'nature' | 'ether'
  >
> = {
  Physical: 'physical',
  Real: 'true',
  Fire: 'heat',
  Pulse: 'electric',
  Cryst: 'cryo',
  LifeDrain: 'lifeDrain',
  Natural: 'nature',
  Ether: 'ether',
};

export const COMPARISON_OPERATORS: Readonly<
  Record<string, 'equal' | 'notEqual' | 'greater' | 'greaterOrEqual' | 'less' | 'lessOrEqual'>
> = {
  EQ: 'equal',
  NE: 'notEqual',
  GT: 'greater',
  GE: 'greaterOrEqual',
  LT: 'less',
  LE: 'lessOrEqual',
  Equals: 'equal',
  NotEquals: 'notEqual',
  GreaterThan: 'greater',
  GreaterThanOrEqual: 'greaterOrEqual',
  LessThan: 'less',
  LessThanOrEqual: 'lessOrEqual',
};
