/**
 * 一个技能、Buff、被动或装备动作宿主在步骤开始与结束之间必须保留的数据。
 *
 * 键均为 `CombatOperationPrograms` 分配的固定程序槽。值只保存实例编号、目标引用和账本句柄；
 * 不保存执行器、回调或运行时对象。完整切面复制时，本状态必须和它引用的实体、资源、标记及
 * 连携目录一起复制，才能保留对象间关系。
 */
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type { ActionBlackboardState } from './actionBlackboardState';
import type { SkillCastInheritanceRegistration } from './skillCastInheritanceOperationExecutor';
import { createGlobalBuffActionState, type GlobalBuffActionState } from './globalBuffActionState';
import {
  createTimeDilationActionState,
  type TimeDilationActionState,
} from './timeDilationActionState';

export interface AbilityEntityActionState {
  readonly actionDurationEntities: Map<number, readonly RuntimeTargetRef[]>;
}

export interface SkillResourceActionState {
  readonly ultimateRecoveryRestrictionHandles: Map<number, number>;
}

export interface TimedMarkerActionReference {
  readonly ownerId: string;
  readonly sourceTargetId: string;
}

export interface TimedMarkerActionState {
  readonly markers: Map<number, readonly TimedMarkerActionReference[]>;
}

export interface ComboWindowActionState {
  readonly ringQteRegistrations: Map<number, Map<ActionBlackboardState, number>>;
}

export interface HealthFloorActionReference {
  readonly entityId: string;
  readonly handle: number;
}

export interface ActionBlackboardActionState {
  readonly healthFloors: Map<number, HealthFloorActionReference>;
}

export interface SkillCastInheritanceActionState {
  readonly registrations: Map<number, SkillCastInheritanceRegistration>;
}

export interface CombatOperationHostState {
  readonly abilityEntities: AbilityEntityActionState;
  readonly resources: SkillResourceActionState;
  readonly timedMarkers: TimedMarkerActionState;
  readonly comboWindows: ComboWindowActionState;
  readonly actionBlackboard: ActionBlackboardActionState;
  readonly skillCastInheritance: SkillCastInheritanceActionState;
  readonly timeDilation: TimeDilationActionState;
  readonly globalBuffs: GlobalBuffActionState;
}

export function createCombatOperationHostState(): CombatOperationHostState {
  return {
    abilityEntities: { actionDurationEntities: new Map() },
    resources: { ultimateRecoveryRestrictionHandles: new Map() },
    timedMarkers: { markers: new Map() },
    comboWindows: { ringQteRegistrations: new Map() },
    actionBlackboard: { healthFloors: new Map() },
    skillCastInheritance: { registrations: new Map() },
    timeDilation: createTimeDilationActionState(),
    globalBuffs: createGlobalBuffActionState(),
  };
}

/** 恢复时判断一个未声明宿主绑定的执行链是否仍可安全使用。 */
export function hasActiveCombatOperationState(state: CombatOperationHostState): boolean {
  return (
    state.abilityEntities.actionDurationEntities.size > 0 ||
    state.resources.ultimateRecoveryRestrictionHandles.size > 0 ||
    state.timedMarkers.markers.size > 0 ||
    state.comboWindows.ringQteRegistrations.size > 0 ||
    state.actionBlackboard.healthFloors.size > 0 ||
    state.skillCastInheritance.registrations.size > 0 ||
    state.timeDilation.instanceIds.size > 0 ||
    state.timeDilation.ignoredEntityIds.size > 0 ||
    state.globalBuffs.active.size > 0
  );
}
