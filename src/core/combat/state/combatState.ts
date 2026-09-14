/**
 * 完整帧边界上的战斗数据根。
 *
 * CombatStateGraph 把共享账本、外部输入、环境、事件目录、干员、敌人和动态实例组织成一棵
 * 可复制的对象图。字段直接引用正式模拟使用的数据；程序、执行器和回调由恢复阶段重新绑定。
 */
import type { SkillSimulationInputs } from '../runtime/skillSimulationInputs';
import type { AbilityEventState } from '../events/abilityEventState';
import type { BuffContainerState } from '../buffs/buffContainerState';
import type { CombatStatusState } from '../status/combatStatuses';
import type { ActionBlackboardState } from './actionState';
import type {
  AbilitySystemState,
  ComboSkillConditionState,
  EquipmentEventState,
  OperatorInitializationState,
  OperatorUpgradeEventState,
  PassiveAbilityEventState,
  SkillCooldownState,
  SkillRuntimeState,
} from './abilityState';
import type {
  CombatInputRuntimeState,
  CombatSharedState,
  ExternalCombatEventRuntimeState,
  StandardCombatEnvironmentState,
  TimedMarkerState,
} from './environmentState';
import type {
  GlobalBuffState,
  LogicalAbilityEntityDirectoryState,
  ProjectileLifecycleState,
} from './instanceState';

/** 单个干员已接入的全部可变数据。 */
export interface CombatOperatorState {
  readonly blackboard: ActionBlackboardState;
  readonly ability: AbilitySystemState;
  readonly skills: Map<string, SkillRuntimeState>;
  readonly passives: Map<string, PassiveAbilityEventState>;
  readonly equipment: EquipmentEventState | null;
  readonly initializations: Map<string, OperatorInitializationState>;
  readonly upgradeEvents: OperatorUpgradeEventState | null;
  readonly comboConditions: Map<string, ComboSkillConditionState>;
  readonly cooldowns: Map<string, SkillCooldownState>;
  readonly statuses: CombatStatusState | null;
  readonly timedMarkers: TimedMarkerState;
  readonly buffs: BuffContainerState | null;
}

/** 一场战斗在完整帧边界可保存和恢复的全部可变数据。 */
export interface CombatStateGraph {
  readonly shared: CombatSharedState;
  readonly inputs: {
    initialInputPending: boolean;
    readonly castParameters: Map<string, SkillSimulationInputs>;
    readonly control: Map<string, boolean>;
    readonly skills: CombatInputRuntimeState;
    readonly externalEvents: ExternalCombatEventRuntimeState;
  };
  readonly environment: StandardCombatEnvironmentState | null;
  readonly events: {
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
