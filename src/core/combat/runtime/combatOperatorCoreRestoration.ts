/**
 * 重建单个干员不含被动、装备和初始化来源的核心运行时。
 * 依赖顺序固定为实体外壳、共享冷却、技能宿主、能力系统；整个过程不执行开局或施放动作。
 */
import type { BuffApplicationHandle } from './buffOperationExecutor';
import type { BuffReference } from '../buffs/buffReference';
import type { CombatOperatorProgram } from './combatRuntimeAssembly';
import type { CombatOperatorState } from '../state/combatState';
import type { PreparedCombatSkillRestoreBinding } from './combatRuntimeRestorePreparation';
import type { RestoreCombatOperatorSkillsOptions } from './combatOperatorSkillRestoration';
import { bindRestoredCombatOperatorSkills } from './combatOperatorSkillRestoration';
import type { RestoreCombatOperatorAbilitySystemOptions } from './combatOperatorAbilitySystemRestoration';
import { bindRestoredCombatOperatorAbilitySystem } from './combatOperatorAbilitySystemRestoration';
import { bindRestoredCombatSkillCooldowns } from './combatSkillCooldownRestoration';
import { ActionBlackboard } from './actionBlackboard';
import type { CombatClock } from './combatClock';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { CombatStatusRuntime } from './combatStatusRuntime';
import { TimedMarkerContainer, type TimedMarkerContainerHooks } from './timedMarkers';

export interface RestoreCombatOperatorCoreOptions {
  readonly operator: CombatOperatorProgram;
  readonly state: CombatOperatorState;
  readonly skills: readonly PreparedCombatSkillRestoreBinding[];
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  /** 完整装配在 Buff 生命周期操作链创建前建立的当前分支状态运行时。 */
  readonly preboundStatusRuntime?: CombatStatusRuntime;
  readonly timedMarkerHooks?: TimedMarkerContainerHooks;
  readonly createSkillDependencies: (
    binding: PreparedCombatSkillRestoreBinding,
    context: {
      readonly blackboard: ActionBlackboard;
      readonly statuses?: CombatStatusRuntime;
      readonly timedMarkers: TimedMarkerContainer;
    },
  ) => ReturnType<RestoreCombatOperatorSkillsOptions['createDependencies']>;
  readonly resolveAttachedBuff: (reference: BuffReference) => BuffApplicationHandle | undefined;
  readonly abilityRuntime: RestoreCombatOperatorAbilitySystemOptions['runtime'];
  readonly onCooldownReady?: (skillId: string) => void;
}

export interface RestoredCombatOperatorCore {
  readonly blackboard: ActionBlackboard;
  readonly statuses?: CombatStatusRuntime;
  readonly timedMarkers: TimedMarkerContainer;
  readonly cooldowns: ReturnType<typeof bindRestoredCombatSkillCooldowns>;
  readonly skills: ReturnType<typeof bindRestoredCombatOperatorSkills>;
  readonly ability: ReturnType<typeof bindRestoredCombatOperatorAbilitySystem>;
}

export function bindRestoredCombatOperatorCore(
  options: RestoreCombatOperatorCoreOptions,
): RestoredCombatOperatorCore {
  const ownerId = options.operator.operatorId;
  const buffState = options.operator.buffRuntime?.runtimeState ?? null;
  if (buffState !== options.state.buffs) {
    throw new Error(`restored operator '${ownerId}' Buff target does not bind its saved state`);
  }
  const blackboard = ActionBlackboard.bindRuntimeState(options.state.blackboard);
  if (
    options.operator.buffRuntime?.entityBlackboard !== undefined &&
    options.operator.buffRuntime.entityBlackboard.runtimeState !== options.state.blackboard
  ) {
    throw new Error(`restored operator '${ownerId}' Buff target uses another blackboard`);
  }
  let statuses: CombatStatusRuntime | undefined;
  if (options.operator.statusContainer === undefined) {
    if (options.preboundStatusRuntime !== undefined) {
      throw new Error(
        `restored operator '${ownerId}' has a prebound status runtime without definitions`,
      );
    }
    if (options.state.statuses !== null) {
      throw new Error(`restored operator '${ownerId}' has status data without definitions`);
    }
  } else {
    if (options.operator.statusContainer.ownerId !== ownerId) {
      throw new Error(
        `status owner '${options.operator.statusContainer.ownerId}' does not match operator '${ownerId}'`,
      );
    }
    if (options.state.statuses === null) {
      throw new Error(`restored operator '${ownerId}' has status definitions without data`);
    }
    statuses =
      options.preboundStatusRuntime ??
      new CombatStatusRuntime(
        options.operator.statusContainer.bindRuntimeState(options.state.statuses),
        options.clock,
        options.receipt,
      );
    if (statuses.container.runtimeState !== options.state.statuses) {
      throw new Error(`restored operator '${ownerId}' prebound status uses another state`);
    }
    if (
      statuses.targetId !== ownerId ||
      statuses.clock !== options.clock ||
      statuses.receipt !== options.receipt
    ) {
      throw new Error(`restored operator '${ownerId}' prebound status uses another runtime`);
    }
  }
  const timedMarkers = new TimedMarkerContainer(
    ownerId,
    options.clock,
    options.timedMarkerHooks,
    options.state.timedMarkers,
  );
  const cooldowns = bindRestoredCombatSkillCooldowns(options.operator, options.state.cooldowns);
  const context = { blackboard, statuses, timedMarkers };
  const skills = bindRestoredCombatOperatorSkills({
    operatorId: ownerId,
    skills: options.skills,
    cooldowns,
    createDependencies: binding => options.createSkillDependencies(binding, context),
    resolveAttachedBuff: options.resolveAttachedBuff,
  });
  const ability = bindRestoredCombatOperatorAbilitySystem({
    operator: options.operator,
    state: options.state.ability,
    skills,
    cooldowns,
    runtime: options.abilityRuntime,
    onCooldownReady: options.onCooldownReady,
  });
  return { blackboard, statuses, timedMarkers, cooldowns, skills, ability };
}
