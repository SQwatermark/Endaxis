/**
 * 将场景编译、严格标准生命伤害环境和模拟结果组合成应用层便捷入口。
 * 调用方仍须提供显式随机样本源与非随机命中输入；超出已闭环子集的技能会由运行时拒绝。
 */
import type { ResolvedCombatStep } from '../core/compiler/combatProgram';
import type { CompileScenarioRuntimeAssemblyOptions } from '../core/compiler/compileScenarioRuntimeAssembly';
import type { PlayerDamageNonRandomRuntimeSnapshot } from '../core/combat/damage/playerActiveDamageInput';
import type { CriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import {
  StandardPlayerDamageEnvironment,
  type StandardPlayerDamageEnvironmentOptions,
} from '../core/combat/runtime/standardPlayerDamageEnvironment';
import type { CombatOperationExecutorContext } from '../core/combat/runtime/combatRuntimeAssembly';
import { runScenarioSimulation, type ScenarioSimulationResult } from './runScenarioSimulation';
import type { ScenarioDocument } from '../core/project/schema';

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;

export interface RunStandardPlayerDamageScenarioInput {
  readonly scenario: ScenarioDocument;
  readonly options: Omit<CompileScenarioRuntimeAssemblyOptions, 'environment'>;
  readonly endFrame: number;
  readonly criticalSamples: CriticalSampleSource;
  readonly resolveNonRandomRuntimeSnapshot: (
    context: CombatOperationExecutorContext,
    step: DamageStep,
  ) => PlayerDamageNonRandomRuntimeSnapshot;
}

export interface StandardPlayerDamageScenarioResult extends ScenarioSimulationResult {
  readonly finalEnemyHealth: number;
}

/** 执行一次不会跨场景复用状态的标准玩家生命伤害模拟。 */
export function runStandardPlayerDamageScenarioSimulation(
  input: RunStandardPlayerDamageScenarioInput,
): StandardPlayerDamageScenarioResult {
  const environmentOptions: StandardPlayerDamageEnvironmentOptions = {
    criticalSamples: input.criticalSamples,
    resolveNonRandomRuntimeSnapshot: input.resolveNonRandomRuntimeSnapshot,
  };
  const environment = new StandardPlayerDamageEnvironment(environmentOptions);
  const result = runScenarioSimulation({
    scenario: input.scenario,
    endFrame: input.endFrame,
    options: {
      ...input.options,
      environment: environment.runtimeOptions,
    },
  });
  return Object.freeze({
    ...result,
    finalEnemyHealth: environment.currentEnemyHealth ?? result.enemy.health,
  });
}
