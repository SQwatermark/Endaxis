/**
 * 应用层的一次性场景模拟入口。
 * 这里只编排已有编译器与战斗装配，不解释敌人，也不为运行环境依赖提供默认值。
 */
import type { CombatReceiptEntry } from '../core/combat/receipt/combatReceipt';
import { CombatRuntimeAssembly } from '../core/combat/runtime/combatRuntimeAssembly';
import {
  compileScenarioRuntimeAssembly,
  type CompileScenarioRuntimeAssemblyOptions,
} from '../core/compiler/compileScenarioRuntimeAssembly';
import type { ScenarioDocument } from '../core/project/schema';

export interface RunScenarioSimulationInput {
  readonly scenario: ScenarioDocument;
  readonly options: CompileScenarioRuntimeAssemblyOptions;
  /** 从运行时初始第 0 帧推进后应到达的绝对帧。 */
  readonly endFrame: number;
}

export interface ScenarioSimulationResult {
  readonly frame: number;
  readonly receiptEntries: readonly CombatReceiptEntry[];
}

function freezeReceiptEntries(
  entries: readonly CombatReceiptEntry[],
): readonly CombatReceiptEntry[] {
  return Object.freeze(
    entries.map(entry =>
      Object.freeze({
        ...entry,
        ...(entry.data === undefined ? {} : { data: Object.freeze({ ...entry.data }) }),
      }),
    ),
  );
}

/**
 * 编译并执行一个全新的场景直到指定整数帧。
 *
 * 当前 `CombatResources` 没有完整快照读取端口，因此结果只暴露可由公共 API
 * 证明的最终帧和回执；这里不会通过私有状态或零散 getter 拼装伪快照。
 */
export function runScenarioSimulation(input: RunScenarioSimulationInput): ScenarioSimulationResult {
  if (!Number.isInteger(input.endFrame) || input.endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  if (input.endFrame > input.scenario.battle.durationFrames) {
    throw new RangeError('endFrame must not exceed scenario battle duration');
  }

  const assembly = new CombatRuntimeAssembly(
    compileScenarioRuntimeAssembly(input.scenario, input.options),
  );
  assembly.advanceFrames(input.endFrame);

  return Object.freeze({
    frame: assembly.clock.frame,
    // 脱离收集器并冻结，避免调用方改写本次模拟已经发生的事实。
    receiptEntries: freezeReceiptEntries(assembly.receipt.entries),
  });
}
