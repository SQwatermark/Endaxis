/**
 * 应用层的一次性场景模拟入口。
 * 这里只编排已有编译器与战斗装配，不解释敌人，也不为运行环境依赖提供默认值。
 */
import type { CombatReceiptEntry } from '../core/combat/receipt/combatReceipt';
import type { CombatResourceSnapshot } from '../core/combat/runtime/combatResources';
import {
  CombatRuntimeAssembly,
  type CombatEnemyProgram,
} from '../core/combat/runtime/combatRuntimeAssembly';
import {
  compileScenarioRuntimeAssembly,
  type CompileScenarioRuntimeAssemblyOptions,
} from '../core/compiler/compileScenarioRuntimeAssembly';
import {
  projectResourceCurvesFromReceipt,
  type CombatResourceCurves,
} from '../core/projection/resourceCurves';
import type { ScenarioDocument } from '../core/project/schema';
import type { ResolvedOperatorPanel } from '../core/compiler/resolveOperatorPanel';
import type { CombatRuntimeAssemblyOptions } from '../core/combat/runtime/combatRuntimeAssembly';

export interface RunScenarioSimulationInput {
  readonly scenario: ScenarioDocument;
  readonly options: CompileScenarioRuntimeAssemblyOptions;
  /** 从运行时初始第 0 帧推进后应到达的绝对帧。 */
  readonly endFrame: number;
}

export interface ScenarioSimulationResult {
  readonly frame: number;
  /** 本次模拟实际交给操作执行器的敌人静态输入。 */
  readonly enemy: CombatEnemyProgram;
  /** 与本次战斗输入完全一致的静态面板，不写回存档。 */
  readonly operatorPanels: readonly ResolvedOperatorPanel[];
  /** 模拟推进前的资源基线，供曲线、诊断和 UI 使用同一初始状态。 */
  readonly initialResources: CombatResourceSnapshot;
  readonly receiptEntries: readonly CombatReceiptEntry[];
  /** 由正式回执投影端口生成的稀疏资源曲线，应用层不重复解释事件。 */
  readonly resourceCurves: CombatResourceCurves;
  readonly finalResources: CombatResourceSnapshot;
}

/** 已完成场景编译、可以直接交给运行时装配根的一次执行输入。 */
export interface ExecuteCompiledScenarioSimulationInput {
  readonly compiled: CombatRuntimeAssemblyOptions;
  readonly endFrame: number;
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

  return executeCompiledScenarioSimulation({
    compiled: compileScenarioRuntimeAssembly(input.scenario, input.options),
    endFrame: input.endFrame,
  });
}

/**
 * 执行已经编译的场景；若运行环境只支持能力子集，调用方必须先完成对应预检。
 * 本函数不再解释存档；专用运行环境应复用此阶段，而不是复制模拟与投影流程。
 */
export function executeCompiledScenarioSimulation(
  input: ExecuteCompiledScenarioSimulationInput,
): ScenarioSimulationResult {
  if (!Number.isInteger(input.endFrame) || input.endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }

  const compiled = input.compiled;
  const operatorPanels = compiled.operators.flatMap(operator =>
    operator.panel === undefined ? [] : [operator.panel],
  );
  const assembly = new CombatRuntimeAssembly(compiled);
  const initialResources = assembly.resources.snapshot();
  assembly.advanceFrames(input.endFrame);
  const receiptEntries = freezeReceiptEntries(assembly.receipt.entries);

  return Object.freeze({
    frame: assembly.clock.frame,
    enemy: compiled.enemy,
    operatorPanels,
    initialResources,
    finalResources: assembly.resources.snapshot(),
    // 脱离收集器并冻结，避免调用方改写本次模拟已经发生的事实。
    receiptEntries,
    resourceCurves: freezeResourceCurves(
      projectResourceCurvesFromReceipt(initialResources, receiptEntries),
    ),
  });
}
