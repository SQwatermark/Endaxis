/**
 * 一条现成的模拟入口：编译场景 → 跑标准战斗环境 → 返回结果。
 * 随机样本等输入由调用方给；环境不支持的东西在跑之前就报错。
 */
import type { ResolvedCombatStep } from '../core/compiler/combatProgram';
import type { CompileScenarioRuntimeAssemblyOptions } from '../core/compiler/compileScenarioRuntimeAssembly';
import type { CombatBuffDefinitionsDocument } from '../core/combat/buffs/combatBuffDefinitions';
import type { SkillSettingsDocument } from '../core/combat/infliction/skillSettings';
import type { CompoundStatusFactoriesDocument } from '../core/combat/infliction/compoundStatusFactories';
import type { PlayerDamageNonRandomRuntimeSnapshot } from '../core/combat/damage/playerActiveDamageInput';
import type { CriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import type { ProbabilitySampleSource } from '../core/combat/random/probabilitySampleSource';
import {
  StandardPlayerDamageEnvironment,
  type StandardPlayerDamageEnvironmentOptions,
} from '../core/combat/runtime/standardPlayerDamageEnvironment';
import type { CombatDamageExecutorContext } from '../core/combat/runtime/combatRuntimeAssembly';
import {
  executeCompiledScenarioSimulation,
  type ScenarioSimulationResult,
} from './runScenarioSimulation';
import type { ScenarioDocument } from '../core/project/schema';
import { compileScenarioRuntimeAssembly } from '../core/compiler/compileScenarioRuntimeAssembly';
import { compileScenarioEnemy } from '../core/compiler/compileScenarioEnemy';
import { createEnemyCombatVitals } from '../core/combat/runtime/combatVitalsFactory';
import { assertStandardPlayerDamageCompatibility } from '../core/combat/runtime/standardPlayerDamageCompatibility';
import {
  STANDARD_TIME_MANAGER_DELTA_MODE,
  timeDilationRuntimeConfig,
} from '../data/combat/timeDilationConfig';
import { gameplayTagRegistry } from '../data/combat/gameplayTagCatalog';
import { GAMEPLAY_TAG_PREDEFINE } from '../data/combat/gameplayTagPredefine.generated';
import { GameplayTagPredefine } from '../core/combat/tags/gameplayTagPredefine';
import { resolveControlTimeline } from '../core/project/resolveControlTimeline';
import { isOperatorControlledAt } from '../core/combat/runtime/operatorControlTimeline';
import type { BuffProgressCurve } from '../core/combat/runtime/buffProgressRecorder';

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;

export interface RunStandardPlayerDamageScenarioInput {
  readonly scenario: ScenarioDocument;
  readonly options: Omit<CompileScenarioRuntimeAssemblyOptions, 'environment'>;
  readonly endFrame: number;
  readonly criticalSamples: CriticalSampleSource;
  readonly probabilitySamples?: ProbabilitySampleSource;
  readonly resolveNonRandomRuntimeSnapshot: (
    context: CombatDamageExecutorContext,
    step: DamageStep,
  ) => PlayerDamageNonRandomRuntimeSnapshot;
  /** 提供后 `applyElementalInfliction` 步骤按定义附着状态机执行。 */
  readonly elementalInflictionDocument?: CombatBuffDefinitionsDocument;
  /** 法术爆发倍率（SkillSetting）；缺失时爆发触发会明确报错。 */
  readonly spellInflictionSettings?: SkillSettingsDocument;
  readonly compoundStatusFactories?: CompoundStatusFactoriesDocument;
  /** 原生 TimeManager 模式原值；值 2 使用未缩放默认时钟，其他值使用全局缩放时钟。 */
  readonly timeManagerDeltaMode?: number;
}

/** 本次模拟唯一敌人生命账本的初始与最终快照；投影和结果收集读取同一实例。 */
export interface EnemyVitalsSimulationResult {
  readonly initialHealth: number;
  readonly maxHealth: number;
  readonly initialPoise: number;
  readonly maxPoise: number;
  readonly finalPoise: number;
}

export interface StandardPlayerDamageScenarioResult extends ScenarioSimulationResult {
  readonly finalEnemyHealth: number;
  readonly enemyVitals: EnemyVitalsSimulationResult;
  readonly buffProgressCurves: readonly BuffProgressCurve[];
}

/** 执行一次不会跨场景复用状态的标准玩家生命伤害模拟。 */
export function runStandardPlayerDamageScenarioSimulation(
  input: RunStandardPlayerDamageScenarioInput,
): StandardPlayerDamageScenarioResult {
  if (!Number.isInteger(input.endFrame) || input.endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  if (input.endFrame > input.scenario.battle.durationFrames) {
    throw new RangeError('endFrame must not exceed scenario battle duration');
  }

  // 场景装配层先编译敌人静态程序并创建本次模拟唯一的敌人生命账本，再注入标准伤害环境；
  // 后续伤害写入、生命条件求值、失衡推进与最终结果都引用这一实例，不再由环境延迟构造。
  const enemy = compileScenarioEnemy(input.scenario.enemy);
  const enemyVitals = createEnemyCombatVitals(enemy);
  const initialVitals = {
    health: enemyVitals.health,
    maxHealth: enemyVitals.maxHealth,
    poise: enemyVitals.poise,
    maxPoise: enemyVitals.maxPoise,
  };
  const controlTimeline = resolveControlTimeline(
    input.scenario.tracks,
    input.scenario.battle.controlSwitches,
  );

  const environmentOptions: StandardPlayerDamageEnvironmentOptions = {
    criticalSamples: input.criticalSamples,
    ...(input.probabilitySamples === undefined
      ? {}
      : { probabilitySamples: input.probabilitySamples }),
    resolveNonRandomRuntimeSnapshot: input.resolveNonRandomRuntimeSnapshot,
    enemyVitals,
    tagRegistry: gameplayTagRegistry,
    knockDown: {
      predefine: new GameplayTagPredefine(GAMEPLAY_TAG_PREDEFINE),
      // 下方整场消费者预检通过后才会执行；没有可观察起身阶段时只结束倒地，不模拟动画。
      onDurationElapsed: runtime => runtime.exit(),
    },
    isOperatorControlled: (operatorId, frame) =>
      isOperatorControlledAt(controlTimeline, operatorId, frame),
    ...(input.elementalInflictionDocument === undefined
      ? {}
      : { elementalInflictionDocument: input.elementalInflictionDocument }),
    ...(input.spellInflictionSettings === undefined
      ? {}
      : { spellInflictionSettings: input.spellInflictionSettings }),
    ...(input.compoundStatusFactories === undefined
      ? {}
      : { compoundStatusFactories: input.compoundStatusFactories }),
  };
  const environment = new StandardPlayerDamageEnvironment(environmentOptions);
  const compiled = compileScenarioRuntimeAssembly(input.scenario, {
    ...input.options,
    environment: {
      ...environment.runtimeOptions,
      timeDilation: {
        config: timeDilationRuntimeConfig,
        timeManagerDeltaMode: input.timeManagerDeltaMode ?? STANDARD_TIME_MANAGER_DELTA_MODE,
      },
    },
  });
  assertStandardPlayerDamageCompatibility({
    operators: compiled.operators,
    inputs: compiled.inputs,
    endFrame: input.endFrame,
    supportsElementalInfliction: input.elementalInflictionDocument !== undefined,
    supportsKnockDown: true,
  });
  const result = executeCompiledScenarioSimulation({ compiled, endFrame: input.endFrame });
  return Object.freeze({
    ...result,
    buffProgressCurves: environment.buffProgressCurves,
    finalEnemyHealth: enemyVitals.health,
    enemyVitals: Object.freeze({
      initialHealth: initialVitals.health,
      maxHealth: initialVitals.maxHealth,
      initialPoise: initialVitals.poise,
      maxPoise: initialVitals.maxPoise,
      finalPoise: enemyVitals.poise,
    }),
  });
}
