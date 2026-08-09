/**
 * 将玩家主动技能当前已闭环的元素附着与伤害执行器接入同一后继责任链。
 * 本模块只完成运行时接线；一个 Hit 内的真实先后仍完全由已编译 sequence 的 step 顺序决定。
 */
import type { CombatVitals } from './combatVitals';
import {
  ElementalInflictionOperationExecutor,
  type ElementalInflictionOperationDependencies,
} from './elementalInflictionOperationExecutor';
import {
  PlayerDamageOperationExecutor,
  type PlayerDamageOperationDependencies,
} from './playerDamageOperationExecutor';
import type { CombatOperationExecutorContext } from './combatRuntimeAssembly';
import type { CombatOperationExecutor } from './skillRuntime';

type DamagePorts = Omit<
  PlayerDamageOperationDependencies,
  'sourceOperatorId' | 'targetId' | 'targetVitals' | 'clock' | 'receipt' | 'delegate'
>;

type InflictionPorts = Omit<
  ElementalInflictionOperationDependencies,
  'sourceOperatorId' | 'targetId' | 'skillId' | 'clock' | 'receipt' | 'delegate'
>;

/** 标准玩家主动操作链仍需由战斗环境提供的实体状态与事件端口。 */
export interface PlayerActiveOperationExecutorOptions {
  readonly context: CombatOperationExecutorContext;
  readonly targetId: string;
  readonly targetVitals: CombatVitals;
  readonly damage: DamagePorts;
  readonly infliction: InflictionPorts;
  /** 尚未由本组合闭环的操作必须继续交给显式后继，不能静默吞掉。 */
  readonly delegate: CombatOperationExecutor;
}

/** 创建可直接用作 `CombatRuntimeAssembly.createOperationExecutor` 返回值的标准责任链。 */
export function createPlayerActiveOperationExecutor(
  options: PlayerActiveOperationExecutorOptions,
): CombatOperationExecutor {
  const shared = {
    sourceOperatorId: options.context.program.operatorId,
    targetId: options.targetId,
    clock: options.context.clock,
    receipt: options.context.receipt,
  };
  const damage = new PlayerDamageOperationExecutor({
    ...options.damage,
    ...shared,
    targetVitals: options.targetVitals,
    delegate: options.delegate,
  });
  return new ElementalInflictionOperationExecutor({
    ...options.infliction,
    ...shared,
    skillId: options.context.program.skillId,
    delegate: damage,
  });
}
