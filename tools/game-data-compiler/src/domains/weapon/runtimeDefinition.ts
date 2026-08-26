import { buffRuntimeReadsBlackboardKey } from '../../compiler/buffRuntimeProjection.ts';
import type {
  CompiledBuffDefinitionSource,
  CompiledBuffSequenceSource,
  CompiledBuffStepSource,
} from '../../compiler/buffRuntimeProjection.ts';
import {
  compileCombatActionSequenceSource,
  compileSkillSpGainActionSequenceSource,
} from '../../compiler/buffRuntimeProjection.ts';
import { compileAbilityEventPrograms } from '../../compiler/abilityEventProgram.ts';
import { compileStandardStumpBuffClosure } from '../../compiler/standardStumpBuffClosure.ts';
import { evaluateStandardStumpFullHealthComparison } from '../../compiler/standardStumpScenarioPolicy.ts';
import type { BuildDefinitionDiagnosticSource } from '../../compiler/formalBuildDefinition.ts';
import type { UnresolvedPassiveSkillBlackboardValueSource } from '../../compiler/passiveSkillInstallation.ts';
import type {
  CompiledWeaponStaticDefinitionSource,
  CompiledWeaponTraitRuntimeDependencySource,
} from './staticDefinition.ts';

export interface CompiledWeaponRuntimeDefinitionBatchSource {
  readonly definitions: readonly CompiledWeaponRuntimeDefinitionSource[];
  readonly diagnostics: readonly BuildDefinitionDiagnosticSource[];
}

export type CompiledWeaponRuntimeDefinitionSource = Omit<
  CompiledWeaponStaticDefinitionSource,
  'traits'
> & {
  readonly assetSlug?: string;
  readonly iconPath?: string;
  readonly traits: readonly (CompiledWeaponStaticDefinitionSource['traits'][number] & {
    readonly buffDefinitions?: Readonly<Record<string, CompiledBuffDefinitionSource>>;
    readonly initializationBlackboard?: Readonly<Record<string, readonly number[]>>;
    readonly initializationSequence?: CompiledBuffSequenceSource;
    readonly eventHandlers?: readonly CompiledWeaponEventHandlerSource[];
  })[];
};

type CompiledWeaponSemanticEventSource =
  | { readonly kind: 'buffConsumed' }
  | { readonly kind: 'spGained' }
  | {
      readonly kind: 'physicalInflictionApplied';
      readonly types: readonly ['airborne', 'knockDown', 'fracture', 'crush'];
      readonly scope: 'operator';
    };

type CompiledWeaponAbilityEventSource =
  | 'enterFight'
  | 'beforeOutputDamage'
  | 'outputCriticalDamage'
  | 'outputHeal'
  | 'beforeCastSkill'
  | 'afterSkillApplyCost'
  | 'beforeOutputPhysicalInfliction'
  | 'beforeOutputInfliction'
  | 'beforeOutputSpellBurst'
  | 'beforeOutputBuff'
  | 'outputBuff'
  | 'addedBuff';

export type CompiledWeaponEventHandlerSource = {
  readonly key: string;
  readonly priority: number;
  readonly blackboard: Readonly<Record<string, readonly number[]>>;
  readonly sequence: CompiledBuffSequenceSource;
} & (
  | { readonly event: CompiledWeaponSemanticEventSource }
  | { readonly abilityEvent: CompiledWeaponAbilityEventSource }
);

/**
 * 把武器各词条的逐等级被动安装合并为正式等级化贡献。
 * Buff 只编译一次；每级变化只进入初始化黑板，动作结构必须在所有等级保持一致。
 */
export function compileWeaponRuntimeDefinitionBatchSource(
  definitions: readonly CompiledWeaponStaticDefinitionSource[],
  dependencies: readonly CompiledWeaponTraitRuntimeDependencySource[],
  buffDataValue: unknown,
): CompiledWeaponRuntimeDefinitionBatchSource {
  const diagnostics: BuildDefinitionDiagnosticSource[] = [];
  const dependencyByTrait = new Map(
    dependencies.map(item => [`${item.weaponId}\0${item.traitKey}`, item]),
  );
  const output: CompiledWeaponRuntimeDefinitionSource[] = [];

  for (const definition of definitions) {
    const traitDependencies = definition.traits.map(trait =>
      dependencyByTrait.get(`${definition.slug}\0${trait.key}`),
    );
    if (traitDependencies.some(item => item === undefined)) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: `WeaponBasicTable.${definition.slug}`,
        reason: 'missing compiled weapon trait runtime dependency',
      });
      continue;
    }
    const typedDependencies = traitDependencies as CompiledWeaponTraitRuntimeDependencySource[];
    const eventHandlers = typedDependencies.map(dependency => {
      const actionGroup = dependency.actionGraph.actionGroup;
      if (actionGroup.timelineActions.length > 0) {
        diagnostics.push({
          status: 'blocked',
          sourcePath: `${dependency.weaponId}.${dependency.traitKey}.actionGraph`,
          reason: 'weapon passive SkillData timeline program is unsupported',
        });
        return [];
      }
      try {
        return compileWeaponEventHandlers(dependency, diagnostics);
      } catch (error) {
        diagnostics.push({
          status: 'blocked',
          sourcePath: `${dependency.weaponId}.${dependency.traitKey}.actionGraph`,
          reason: error instanceof Error ? error.message : String(error),
        });
        return [];
      }
    });
    const deckInitializations = typedDependencies.map(dependency => {
      try {
        return compileWeaponDeckInitialization(dependency);
      } catch (error) {
        diagnostics.push({
          status: 'blocked',
          sourcePath: `${dependency.weaponId}.${dependency.traitKey}.actionGraph`,
          reason: error instanceof Error ? error.message : String(error),
        });
        return { blackboard: {}, steps: [] };
      }
    });
    const plans = typedDependencies.map(dependency => compileTraitPlans(dependency, diagnostics));
    if (
      diagnostics.some(
        item => item.status === 'blocked' && item.sourcePath.includes(definition.slug),
      )
    ) {
      continue;
    }
    // 初始化安装不是完整来源图：被动事件创建的 Buff 同样必须进入递归定义闭包。
    const rootIds = [
      ...typedDependencies.flatMap(dependency => dependency.referencedBuffIds),
      ...plans.flatMap(levels => levels.flatMap(level => level.map(item => item.buffId))),
    ];
    const closure = compileStandardStumpBuffClosure([...new Set(rootIds)], buffDataValue);
    diagnostics.push(...closure.diagnostics);
    if (closure.diagnostics.some(item => item.status === 'blocked')) continue;

    const traits = definition.traits.map((trait, traitIndex) => {
      const levelPlans = plans[traitIndex]!;
      const activePlans = levelPlans.map(level =>
        level.filter(item => !closure.omittedBuffIds.has(item.buffId)),
      );
      const identity = planIdentity(activePlans[0] ?? []);
      if (activePlans.some(plan => planIdentity(plan) !== identity)) {
        diagnostics.push({
          status: 'blocked',
          sourcePath: `WeaponBasicTable.${definition.slug}.${trait.key}`,
          reason: 'weapon trait Buff installation structure changes between levels',
        });
        return trait;
      }
      const initializationBlackboard: Record<string, number[]> = {};
      const steps: CompiledBuffStepSource[] = (activePlans[0] ?? []).map(
        (installation, installationIndex) => {
          const assignments: Record<string, { kind: 'blackboard'; key: string }> = {};
          for (const targetKey of Object.keys(installation.assignments).sort()) {
            const key = `install_${installationIndex}_${targetKey}`;
            const values = activePlans.map(plan => plan[installationIndex]!.assignments[targetKey]);
            if (values.some(value => typeof value !== 'number')) {
              const source = closure.sources.get(installation.buffId)!;
              const sourcePath = `WeaponBasicTable.${definition.slug}.${trait.key}.${installation.buffId}.${targetKey}`;
              if (buffRuntimeReadsBlackboardKey(source, targetKey)) {
                diagnostics.push({
                  status: 'blocked',
                  sourcePath,
                  reason:
                    'non-numeric or unresolved Buff assignment is required by the installed Buff',
                });
              } else {
                diagnostics.push({
                  status: 'scenario-omitted',
                  sourcePath,
                  reason:
                    'non-numeric or unresolved Buff assignment is never read by the installed Buff',
                });
              }
              continue;
            }
            initializationBlackboard[key] = values as number[];
            assignments[targetKey] = { kind: 'blackboard', key };
          }
          return {
            kind: 'applyBuff' as const,
            parameters: {
              buffId: installation.buffId,
              target: 'caster' as const,
              ...(Object.keys(assignments).length === 0
                ? {}
                : { blackboardAssignments: assignments }),
            },
          };
        },
      );
      Object.assign(initializationBlackboard, deckInitializations[traitIndex]!.blackboard);
      steps.push(...deckInitializations[traitIndex]!.steps);
      return {
        ...trait,
        ...(eventHandlers[traitIndex]!.length === 0
          ? {}
          : { eventHandlers: eventHandlers[traitIndex] }),
        ...(traitIndex === 0 && Object.keys(closure.definitions).length > 0
          ? { buffDefinitions: closure.definitions }
          : {}),
        ...(Object.keys(initializationBlackboard).length === 0 ? {} : { initializationBlackboard }),
        ...(steps.length === 0 ? {} : { initializationSequence: { steps } }),
      };
    });
    if (
      diagnostics.some(
        item => item.status === 'blocked' && item.sourcePath.includes(definition.slug),
      )
    ) {
      continue;
    }
    output.push({ ...definition, traits });
  }
  return { definitions: output, diagnostics };
}

function compileWeaponEventHandlers(
  dependency: CompiledWeaponTraitRuntimeDependencySource,
  diagnostics: BuildDefinitionDiagnosticSource[],
): CompiledWeaponEventHandlerSource[] {
  const blackboard = compileWeaponEventBlackboard(dependency);
  const events = dependency.actionGraph.actionGroup.passiveEvents;
  const omittedEvents = new Set<string | number>();
  if (events.some(event => event.abilityEvent === 'OnCharDeckAttrChanged')) {
    // Deck 快照只在构筑刷新时变化；固定战斗把该事件响应编译进开战前初始化程序。
    omittedEvents.add('OnCharDeckAttrChanged');
  }
  if (events.some(event => event.abilityEvent === 'OnSquadTakeDamage')) {
    omittedEvents.add('OnSquadTakeDamage');
    diagnostics.push({
      status: 'scenario-omitted',
      sourcePath: `${dependency.weaponId}.${dependency.traitKey}.actionGraph.passiveEventActions`,
      reason: 'fixed stump enemy has no active behavior and cannot produce squad damage events',
    });
  }
  const programs = compileAbilityEventPrograms(events, {
    sourcePath: `${dependency.weaponId}.${dependency.traitKey}.actionGraph.passiveEventActions`,
    omitEvent: event => omittedEvents.has(event),
    mapEvent: projectWeaponAbilityEvent,
    compileSequence: (sequence, _sourcePath, event) =>
      event === 'OnObtainAtb'
        ? compileSkillSpGainActionSequenceSource(sequence, {
            actionOwnerTarget: 'caster',
            actionSourceTarget: 'caster',
            actionTargetTarget: 'eventTarget',
          })
        : compileCombatActionSequenceSource(sequence, {
            actionOwnerTarget: 'caster',
            actionSourceTarget: 'caster',
            actionTargetTarget: 'eventTarget',
          }),
    isEmptySequence: sequence => sequence.steps.length === 0,
  });
  return programs.map(program => ({
    key: `${dependency.traitKey}:event:${program.sourceEventIndex}:sequence:${program.sourceSequenceIndex}`,
    ...program.event,
    priority: program.priority,
    blackboard,
    sequence: program.sequence,
  }));
}

/**
 * 原生 OnCharDeckAttrChanged 发生在非战斗构筑刷新链末尾。Next 的配装在模拟开始后不再变化，
 * 因此保持其动作顺序与 Deck 条件，只把触发边界折叠为面板完成后的单次初始化。
 */
function compileWeaponDeckInitialization(dependency: CompiledWeaponTraitRuntimeDependencySource): {
  readonly blackboard: Readonly<Record<string, readonly number[]>>;
  readonly steps: CompiledBuffStepSource[];
} {
  const events = dependency.actionGraph.actionGroup.passiveEvents;
  const programs = compileAbilityEventPrograms(events, {
    sourcePath: `${dependency.weaponId}.${dependency.traitKey}.actionGraph.passiveEventActions`,
    omitEvent: event => event !== 'OnCharDeckAttrChanged',
    mapEvent: (_event, _sourcePath) => 'deckAttributesChanged' as const,
    compileSequence: sequence =>
      compileCombatActionSequenceSource(sequence, {
        actionOwnerTarget: 'caster',
        actionSourceTarget: 'caster',
        actionTargetTarget: 'eventTarget',
      }),
    isEmptySequence: sequence => sequence.steps.length === 0,
  });
  if (programs.length === 0) return { blackboard: {}, steps: [] };
  return {
    blackboard: compileWeaponEventBlackboard(dependency),
    steps: programs.flatMap(program => program.sequence.steps),
  };
}

function projectWeaponAbilityEvent(
  event: string | number,
  sourcePath: string,
):
  | { readonly event: CompiledWeaponSemanticEventSource }
  | { readonly abilityEvent: CompiledWeaponAbilityEventSource } {
  if (typeof event !== 'string') {
    throw new Error(`${sourcePath}: unnamed numeric weapon AbilityEvent is unsupported`);
  }
  const abilityEvents: Readonly<Record<string, CompiledWeaponAbilityEventSource>> = {
    OnEnterFight: 'enterFight',
    OnBeforeOutputDamage: 'beforeOutputDamage',
    OnOutputCriticalDamage: 'outputCriticalDamage',
    OnOutputHeal: 'outputHeal',
    OnBeforeCastSkill: 'beforeCastSkill',
    OnAfterSkillApplyCost: 'afterSkillApplyCost',
    OnBeforeOutputPhysicalInfliction: 'beforeOutputPhysicalInfliction',
    OnCharBeforeOutputSpellInfliction: 'beforeOutputInfliction',
    OnCharBeforeOutputSpellBurst: 'beforeOutputSpellBurst',
    OnBeforeOutputBuff: 'beforeOutputBuff',
    OnOutputBuff: 'outputBuff',
    OnAddedBuff: 'addedBuff',
  };
  const abilityEvent = abilityEvents[event];
  if (abilityEvent !== undefined) return { abilityEvent };
  if (event === 'OnConsumeBuff') return { event: { kind: 'buffConsumed' } };
  if (event === 'OnObtainAtb') {
    return { event: { kind: 'spGained' } };
  }
  if (event === 'OnAfterOutputPhysicalInfliction') {
    return {
      event: {
        kind: 'physicalInflictionApplied',
        types: ['airborne', 'knockDown', 'fracture', 'crush'],
        scope: 'operator',
      },
    };
  }
  throw new Error(`${sourcePath}: unsupported weapon AbilityEvent ${JSON.stringify(event)}`);
}

function compileWeaponEventBlackboard(
  dependency: CompiledWeaponTraitRuntimeDependencySource,
): Record<string, readonly number[]> {
  const keys = [
    ...new Set(dependency.levels.flatMap(level => Object.keys(level.installation.blackboard))),
  ].sort();
  return Object.fromEntries(
    keys.map(key => {
      const values = dependency.levels.map(level => level.installation.blackboard[key]);
      if (values.some(value => typeof value !== 'number')) {
        throw new Error(
          `weapon event blackboard ${JSON.stringify(key)} is not numeric at every level`,
        );
      }
      return [key, values as number[]];
    }),
  );
}

interface PlannedBuffInstallation {
  readonly buffId: string;
  readonly assignments: Readonly<
    Record<string, number | string | UnresolvedPassiveSkillBlackboardValueSource>
  >;
}

function compileTraitPlans(
  dependency: CompiledWeaponTraitRuntimeDependencySource,
  diagnostics: BuildDefinitionDiagnosticSource[],
): readonly PlannedBuffInstallation[][] {
  return dependency.levels.map(level => {
    const activeToggleBuffs = level.toggleBuffs.flatMap(group => {
      const results = group.conditions.map(condition => {
        if (typeof condition.value !== 'number') return null;
        return evaluateStandardStumpFullHealthComparison(condition.comparison, condition.value);
      });
      if (results.some(result => result === null)) {
        diagnostics.push({
          status: 'blocked',
          sourcePath: `${dependency.weaponId}.${dependency.traitKey}.level${level.level}`,
          reason: 'toggle Buff condition requires an unmaterialized server passive skill value',
        });
        return [];
      }
      return results.every(Boolean) ? group.buffs : [];
    });
    return [...level.startupBuffs, ...activeToggleBuffs].map(item => ({
      buffId: item.buffId,
      assignments: item.blackboardAssignments,
    }));
  });
}

function planIdentity(plan: readonly PlannedBuffInstallation[]): string {
  return JSON.stringify(plan.map(item => [item.buffId, Object.keys(item.assignments).sort()]));
}
