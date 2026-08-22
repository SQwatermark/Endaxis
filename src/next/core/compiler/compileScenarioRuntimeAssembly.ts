/**
 * 将场景的时间轴、初始资源和应用层提供的运行环境组合成运行时装配参数。
 *
 * 本模块是纯编译边界：场景拥有的数据只交给对应编译器解释，敌人、实体容器和操作执行器
 * 由调用方显式注入。调用方可以把返回值直接交给 `CombatRuntimeAssembly`，但不得把这里当作
 * 缺失规则的默认值来源。
 */
import type {
  CombatOperatorProgram,
  CombatRuntimeAssemblyOptions,
} from '../combat/runtime/combatRuntimeAssembly';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import type { ScenarioDocument } from '../project/schema';
import {
  compileScenarioResources,
  type CompileScenarioResourcesOptions,
} from './compileScenarioResources';
import {
  compileResolvedScenarioTimeline,
  compileOperatorDefinitionSkills,
} from './compileScenarioTimeline';
import { compileResolvedScenarioEquipment } from './compileScenarioEquipment';
import { resolveScenarioBuilds } from './resolveScenarioBuilds';
import { resolveScenarioOperatorPanels } from './resolveOperatorPanel';
import { compileScenarioEnemy } from './compileScenarioEnemy';
import { resolveScenarioOperatorResourceRules } from './resolveScenarioResourceRules';
import { resolveControlTimeline } from '../project/resolveControlTimeline';
import { isOperatorControlledAt } from '../combat/runtime/operatorControlTimeline';
import { compareCombatNumbers } from '../combat/runtime/numericComparison';
import type { OperatorDefinition } from '../game-data/operatorDefinition';
import type { ResolvedOperatorPanel } from './resolveOperatorPanel';
import type { ScheduledExternalCombatEventInput } from '../combat/runtime/externalCombatEventRuntime';

type BuildIndex = Pick<GameDataRepository, 'getOperator' | 'getWeapon' | 'getGear' | 'getGearSet'> &
  Partial<
    Pick<GameDataRepository, 'getCommonBuffDefinitions' | 'getCommonAbilityEntityDefinitions'>
  >;

/**
 * 已编译技能之外、单个干员进入战斗所需的可变运行时依赖。
 * 只需列出确实存在额外实体运行时的干员；未提供的可选端口仍由运行时在实际使用处严格检查。
 */
export type CombatOperatorRuntimeBindings = Pick<
  CombatOperatorProgram,
  'buffRuntime' | 'statusContainer' | 'actionRuntime'
>;

type EnvironmentOptionKey = Exclude<
  keyof CombatRuntimeAssemblyOptions,
  'resources' | 'enemy' | 'operators' | 'inputs' | 'externalEvents' | 'isOperatorControlled'
>;

/** 场景无法持久化、必须由应用装配层提供的战斗环境。 */
export type CombatRuntimeEnvironmentOptions = Pick<
  CombatRuntimeAssemblyOptions,
  EnvironmentOptionKey
>;

/** 编译完整运行时装配参数所需的显式依赖。 */
export interface CompileScenarioRuntimeAssemblyOptions {
  readonly index: BuildIndex;
  readonly resources: Omit<CompileScenarioResourcesOptions, 'operators'>;
  readonly environment: CombatRuntimeEnvironmentOptions;
  /** 以 `OperatorInstanceDocument.id` 为键，不接受未上场干员。 */
  readonly operatorRuntimeBindings?: ReadonlyMap<string, CombatOperatorRuntimeBindings>;
}

export function compileOperatorEntityBlackboardInitialValues(
  operator: OperatorDefinition,
  panel: ResolvedOperatorPanel,
): Readonly<Record<string, number>> {
  const initializers = operator.entityBlackboardInitializers ?? [];
  const values: Record<string, number> = {
    level: panel.level,
    // StoreAttributeValue(MaxHp/FinalNonConverted) 与四维使用同一静态面板投影；
    // 动作执行时从实体黑板读取，不能在生成期烘焙具体构筑数值。
    maxHealth: Math.fround(panel.health),
    strength: Math.fround(panel.attributes.strength),
    agility: Math.fround(panel.attributes.agility),
    intellect: Math.fround(panel.attributes.intellect),
    will: Math.fround(panel.attributes.will),
  };
  for (const [index, initializer] of initializers.entries()) {
    if (!initializer.key.startsWith('EntityBB_') || initializer.key.length === 9) {
      throw new Error(
        `operator '${operator.slug}'.entityBlackboardInitializers[${index}].key must be a non-empty EntityBB_ key`,
      );
    }
    if (initializer.key in values) {
      throw new Error(
        `operator '${operator.slug}' duplicates entity blackboard initializer '${initializer.key}'`,
      );
    }
    const condition = initializer.condition;
    const matched = compareCombatNumbers(
      panel.attributes[condition.left],
      panel.attributes[condition.right],
      condition.operator,
    );
    const value = matched ? initializer.trueValue : initializer.falseValue;
    if (!Number.isFinite(value)) {
      throw new TypeError(
        `operator '${operator.slug}'.entityBlackboardInitializers[${index}] resolved a non-finite value`,
      );
    }
    values[initializer.key] = Math.fround(value);
  }
  return values;
}

/** 把轨道引用解析为本场稳定干员实例；不为缺席轨道制造虚拟受击者。 */
export function compileScenarioExternalEventInputs(
  scenario: ScenarioDocument,
): readonly ScheduledExternalCombatEventInput[] {
  const activeOperatorIds = scenario.tracks.flatMap(track => (track === null ? [] : [track.id]));
  return (scenario.battle.externalEventMarkers ?? [])
    .map((marker, order) => {
      let targetOperatorIds: readonly string[];
      if (marker.target.scope === 'team') {
        targetOperatorIds = activeOperatorIds;
      } else {
        const track = scenario.tracks[marker.target.trackIndex];
        if (track == null) {
          throw new Error(
            `external event marker '${marker.id}' references empty track ${marker.target.trackIndex}`,
          );
        }
        targetOperatorIds = [track.id];
      }
      if (targetOperatorIds.length === 0) {
        throw new Error(`external event marker '${marker.id}' has no active operator target`);
      }
      return {
        frame: marker.frame,
        targetOperatorIds,
        event: {
          kind: marker.event.kind,
          tags: [...marker.event.tags],
          features: [...marker.event.features],
        },
        order,
      };
    })
    .sort((left, right) => left.frame - right.frame || left.order - right.order)
    .map(({ order: _order, ...input }) => input);
}

function bindOperatorRuntimes(
  operators: readonly CombatOperatorProgram[],
  bindings: ReadonlyMap<string, CombatOperatorRuntimeBindings> | undefined,
): readonly CombatOperatorProgram[] {
  if (bindings === undefined) return operators;
  const activeOperatorIds = new Set(operators.map(operator => operator.operatorId));
  for (const operatorId of bindings.keys()) {
    if (!activeOperatorIds.has(operatorId)) {
      throw new Error(`runtime bindings reference inactive operator build '${operatorId}'`);
    }
  }

  return operators.map(operator => {
    const runtime = bindings.get(operator.operatorId);
    if (runtime === undefined) return operator;
    // 身份与技能程序始终以编译结果为准，运行环境只能补充实体级运行时对象。
    return { ...runtime, ...operator };
  });
}

/**
 * 编译可直接传给 `CombatRuntimeAssembly` 的完整参数对象。
 * 子编译器的限制会原样向上传播：场景继承、养成效果或逐次技能编辑还没做通时必定失败。
 */
export function compileScenarioRuntimeAssembly(
  scenario: ScenarioDocument,
  options: CompileScenarioRuntimeAssemblyOptions,
): CombatRuntimeAssemblyOptions {
  const builds = resolveScenarioBuilds(scenario, options.index);
  const timeline = compileResolvedScenarioTimeline(
    builds,
    options.index.getCommonBuffDefinitions?.(),
    options.index.getCommonAbilityEntityDefinitions?.(),
  );
  const panels = new Map(
    resolveScenarioOperatorPanels(builds).map(panel => [panel.operatorId, panel]),
  );
  const equipment = new Map(
    compileResolvedScenarioEquipment(builds).map(entry => [entry.operatorId, entry.contributions]),
  );
  const resources = compileScenarioResources(scenario, {
    ...options.resources,
    // 资源规则与放置无关：maxUltimateEnergy 来自定义全部技能（已应用养成补丁）的费用。
    operators: resolveScenarioOperatorResourceRules(
      timeline.operators.map(operator => {
        const build = builds.find(candidate => candidate.track.id === operator.operatorId);
        if (build === undefined) {
          throw new Error(
            `timeline operator '${operator.operatorId}' has no resolved operator build`,
          );
        }
        const panel = panels.get(operator.operatorId);
        if (panel === undefined) {
          throw new Error(
            `timeline operator '${operator.operatorId}' has no resolved operator panel`,
          );
        }
        return {
          operatorId: operator.operatorId,
          skills: compileOperatorDefinitionSkills(
            operator.operatorId,
            build.operatorInstance,
            build.operator,
            options.index.getCommonAbilityEntityDefinitions?.(),
            panel.attributes,
          ),
        };
      }),
      [...panels.values()],
    ),
  });
  const operators = bindOperatorRuntimes(
    timeline.operators.map(operator => {
      const build = builds.find(candidate => candidate.track.id === operator.operatorId);
      const panel = panels.get(operator.operatorId);
      if (build === undefined || panel === undefined) {
        throw new Error(`timeline operator '${operator.operatorId}' has no resolved build panel`);
      }
      return {
        ...operator,
        panel,
        initialEntityBlackboard: compileOperatorEntityBlackboardInitialValues(
          build.operator,
          panel,
        ),
        equipmentContributions: equipment.get(operator.operatorId) ?? [],
      };
    }),
    options.operatorRuntimeBindings,
  );
  const controlTimeline = resolveControlTimeline(scenario.tracks, scenario.battle.controlSwitches);

  return {
    ...options.environment,
    resources,
    enemy: compileScenarioEnemy(scenario.enemy),
    operators,
    inputs: timeline.inputs,
    externalEvents: compileScenarioExternalEventInputs(scenario),
    isOperatorControlled: (operatorId, frame) =>
      isOperatorControlledAt(controlTimeline, operatorId, frame),
  };
}
