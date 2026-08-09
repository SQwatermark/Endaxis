/**
 * 应用层的一次性场景模拟入口。
 * 这里只编排已有编译器与战斗装配，不解释敌人，也不为运行环境依赖提供默认值。
 */
import type { CombatReceiptEntry } from '../core/combat/receipt/combatReceipt';
import type { CombatResourceSnapshot } from '../core/combat/runtime/combatResources';
import { CombatRuntimeAssembly } from '../core/combat/runtime/combatRuntimeAssembly';
import {
  compileScenarioRuntimeAssembly,
  type CompileScenarioRuntimeAssemblyOptions,
} from '../core/compiler/compileScenarioRuntimeAssembly';
import {
  projectResourceCurvesFromReceipt,
  type CombatResourceCurves,
} from '../core/projection/resourceCurves';
import type { ScenarioDocument } from '../core/project/schema';

export interface RunScenarioSimulationInput {
  readonly scenario: ScenarioDocument;
  readonly options: CompileScenarioRuntimeAssemblyOptions;
  /** 从运行时初始第 0 帧推进后应到达的绝对帧。 */
  readonly endFrame: number;
}

export interface ScenarioSimulationResult {
  readonly frame: number;
  /** 模拟推进前的资源基线，供曲线、诊断和 UI 使用同一初始状态。 */
  readonly initialResources: CombatResourceSnapshot;
  readonly receiptEntries: readonly CombatReceiptEntry[];
  /** 由正式回执投影端口生成的稀疏资源曲线，应用层不重复解释事件。 */
  readonly resourceCurves: CombatResourceCurves;
  readonly finalResources: CombatResourceSnapshot;
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

function freezeResourceCurves(curves: CombatResourceCurves): CombatResourceCurves {
  return Object.freeze({
    sp: Object.freeze({
      ...curves.sp,
      points: Object.freeze(curves.sp.points.map(point => Object.freeze({ ...point }))),
    }),
    ultimateEnergy: Object.freeze(
      curves.ultimateEnergy.map(curve =>
        Object.freeze({
          ...curve,
          points: Object.freeze(curve.points.map(point => Object.freeze({ ...point }))),
        }),
      ),
    ),
  });
}

/**
 * 编译并执行一个全新的场景直到指定整数帧。
 *
 * 结果中的最终资源由账本快照端口读取，不在应用层重复推导。
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
  const initialResources = assembly.resources.snapshot();
  assembly.advanceFrames(input.endFrame);
  const receiptEntries = freezeReceiptEntries(assembly.receipt.entries);

  return Object.freeze({
    frame: assembly.clock.frame,
    initialResources,
    finalResources: assembly.resources.snapshot(),
    // 脱离收集器并冻结，避免调用方改写本次模拟已经发生的事实。
    receiptEntries,
    resourceCurves: freezeResourceCurves(
      projectResourceCurvesFromReceipt(initialResources, receiptEntries),
    ),
  });
}
