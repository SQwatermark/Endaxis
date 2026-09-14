/**
 * 正式装配中已经接通的数据图。共享层与动态实例目录引用实际运行数据，不另存镜像。
 * 干员/敌人的全部状态、具体动作树和监听绑定尚未全部接入，不能据此恢复整场战斗。
 */
import type { CombatSharedState } from './combatSharedState';
import type { StandardCombatEnvironmentState } from './standardCombatEnvironmentState';
import type { AbilityEventState } from '../events/abilityEventState';
import type { LogicalAbilityEntityDirectoryState } from './logicalAbilityEntityState';
import type { ProjectileLifecycleState } from './projectileLifecycleState';
import type { GlobalBuffState } from './globalBuffState';
import type { SkillRuntimeState } from './skillRuntimeState';
import type { SkillCooldownState } from './skillCooldownState';
import type { AbilitySystemState } from './abilitySystemState';
import type { ActionBlackboardState } from './actionBlackboardState';
import type { CombatStatusState } from '../status/combatStatuses';
import type { TimedMarkerState } from './timedMarkers';
import type { BuffContainerState } from '../buffs/buffContainerState';
import type { PassiveAbilityEventState } from './passiveAbilityEventState';
import type { EquipmentEventState } from './equipmentEventState';
import type { OperatorInitializationState } from './operatorInitializationState';
import type { OperatorUpgradeEventState } from './operatorUpgradeEventState';

/** 单个干员已接入的可变数据；技能黑板回退读取这里的同一实体黑板。 */
export interface CombatOperatorState {
  readonly blackboard: ActionBlackboardState;
  readonly ability: AbilitySystemState;
  readonly skills: Map<string, SkillRuntimeState>;
  /** 按编译被动 key 保存的常驻 Ability 来源。 */
  readonly passives: Map<string, PassiveAbilityEventState>;
  /** null 表示该干员没有需要运行时宿主的装备 Ability。 */
  readonly equipment: EquipmentEventState | null;
  /** 构筑启用的养成与装备初始化程序，按编译 key 保存。 */
  readonly initializations: Map<string, OperatorInitializationState>;
  /** null 表示该干员没有构筑启用的养成事件监听。 */
  readonly upgradeEvents: OperatorUpgradeEventState | null;
  /** 按技能身份共享的冷却；尚未创建施放实例的技能也在这里保存账本。 */
  readonly cooldowns: Map<string, SkillCooldownState>;
  /** null 表示该实体未配置通用语义状态系统。 */
  readonly statuses: CombatStatusState | null;
  readonly timedMarkers: TimedMarkerState;
  /** null 表示目标端口尚未提供容器数据，不能解释成“没有 Buff”。 */
  readonly buffs: BuffContainerState | null;
}

export interface CombatStateGraph {
  readonly shared: CombatSharedState;
  /** null 表示装配没有提供标准环境的数据端口。 */
  readonly environment: StandardCombatEnvironmentState | null;
  readonly events: {
    /** null 表示环境未提供原生订阅目录，不能当作没有监听。 */
    readonly native: Map<string, AbilityEventState<string>> | null;
    readonly semantic: AbilityEventState<string>;
  };
  readonly operators: Map<string, CombatOperatorState>;
  readonly enemy: {
    readonly statuses: CombatStatusState | null;
    readonly timedMarkers: TimedMarkerState;
    readonly buffs: BuffContainerState | null;
  };
  readonly instances: {
    readonly abilityEntities: LogicalAbilityEntityDirectoryState;
    readonly projectiles: ProjectileLifecycleState;
    readonly globalBuffs: GlobalBuffState;
  };
}
