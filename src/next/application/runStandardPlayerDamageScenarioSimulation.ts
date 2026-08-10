/**
 * 一条现成的模拟入口：编译场景 → 跑标准战斗环境 → 返回结果。
 * 随机样本等输入由调用方给；环境不支持的东西在跑之前就报错。
 */
import type { ResolvedCombatStep } from '../core/compiler/combatProgram';
import type { CompileScenarioRuntimeAssemblyOptions } from '../core/compiler/compileScenarioRuntimeAssembly';
import type { CombatBuffDefinitionsDocument } from '../core/combat/buffs/combatBuffDefinitions';
import type { SkillSettingsDocument } from '../core/combat/infliction/skillSettings';
import type { PlayerDamageNonRandomRuntimeSnapshot } from '../core/combat/damage/playerActiveDamageInput';
import type { CriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import {
  StandardPlayerDamageEnvironment,
  type StandardPlayerDamageEnvironmentOptions,
} from '../core/combat/runtime/standardPlayerDamageEnvironment';
import type { CombatOperationExecutorContext } from '../core/combat/runtime/combatRuntimeAssembly';
import {
  executeCompiledScenarioSimulation,
  type ScenarioSimulationResult,
} from './runScenarioSimulation';
import type { ScenarioDocument } from '../core/project/schema';
import { compileScenarioRuntimeAssembly } from '../core/compiler/compileScenarioRuntimeAssembly';
import { assertStandardPlayerDamageCompatibility } from '../core/combat/runtime/standardPlayerDamageCompatibility';

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
  /** 提供后 `applyElementalInfliction` 步骤按定义附着状态机执行。 */
  readonly elementalInflictionDocument?: CombatBuffDefinitionsDocument;
  /** 法术爆发倍率（SkillSetting）；缺失时爆发触发会明确报错。 */
  readonly spellInflictionSettings?: SkillSettingsDocument;
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
    ...(input.elementalInflictionDocument === undefined
      ? {}
      : { elementalInflictionDocument: input.elementalInflictionDocument }),
    ...(input.spellInflictionSettings === undefined
      ? {}
      : { spellInflictionSettings: input.spellInflictionSettings }),
  };
  const environment = new StandardPlayerDamageEnvironment(environmentOptions);
  if (!Number.isInteger(input.endFrame) || input.endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  if (input.endFrame > input.scenario.battle.durationFrames) {
    throw new RangeError('endFrame must not exceed scenario battle duration');
  }
  const compiled = compileScenarioRuntimeAssembly(input.scenario, {
    ...input.options,
    environment: environment.runtimeOptions,
  });
  assertStandardPlayerDamageCompatibility({
    operators: compiled.operators,
    inputs: compiled.inputs,
    endFrame: input.endFrame,
    supportsElementalInfliction: input.elementalInflictionDocument !== undefined,
  });
  const result = executeCompiledScenarioSimulation({ compiled, endFrame: input.endFrame });
  return Object.freeze({
    ...result,
    finalEnemyHealth: environment.currentEnemyHealth ?? result.enemy.health,
  });
}
