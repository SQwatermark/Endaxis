/**
 * 在整场 Buff 实例已经存在后，恢复全部干员的核心运行时和来源宿主。
 *
 * 先为全队建立黑板、状态、冷却、技能和能力系统，再按队伍顺序建立装备、潜能、初始化与被动。
 * 来源持有的子 Buff 在所有宿主创建成功后跨全队检查唯一所有者，再统一绑定到当前分支实例。
 */
import { buffReferenceKey, type BuffReference } from '../buffs/buffReference';
import type { BuffApplicationHandle } from '../buffs/combatBuffs';
import {
  bindRestoredCombatOperatorCore,
  type RestoreCombatOperatorCoreOptions,
  type RestoredCombatOperatorCore,
} from './combatOperatorCoreRestoration';
import {
  bindRestoredCombatOperatorSources,
  type RestoreCombatOperatorSourcesOptions,
  type RestoredCombatOperatorSources,
} from './combatOperatorSourceRestoration';
import type { CombatOperatorProgram } from './combatRuntimeAssembly';
import type { RestoredCombatAbilityEntityDirectory } from './combatRuntimeAbilityEntityRestoration';
import type { CombatRuntimeRestorePreparation } from './combatRuntimeRestorePreparation';
import type { RestoredCombatRuntimeFoundation } from './combatRuntimeRestoreFoundation';
import { failAfterAbilityHostCleanup, runAbilityHostCleanup } from './abilityEventHostLifecycle';

type OperatorCoreBindings = Pick<
  RestoreCombatOperatorCoreOptions,
  'createSkillDependencies' | 'abilityRuntime' | 'onCooldownReady' | 'timedMarkerHooks'
>;

type OperatorSourceBindings = Omit<
  RestoreCombatOperatorSourcesOptions,
  'operator' | 'state' | 'operatorBlackboard' | 'semanticEvents'
>;

export interface RestoreCombatRuntimeOperatorsOptions {
  readonly preparation: CombatRuntimeRestorePreparation;
  readonly foundation: RestoredCombatRuntimeFoundation;
  readonly entities: RestoredCombatAbilityEntityDirectory;
  readonly createCoreBindings: (operator: CombatOperatorProgram) => OperatorCoreBindings;
  readonly createSourceBindings: (operator: CombatOperatorProgram) => OperatorSourceBindings;
}

export interface RestoredCombatRuntimeOperators {
  readonly programs: ReadonlyMap<string, CombatOperatorProgram>;
  readonly cores: ReadonlyMap<string, RestoredCombatOperatorCore>;
  readonly sources: ReadonlyMap<string, RestoredCombatOperatorSources>;
  bindRestoredChildren(): void;
  disposeSources(): void;
}

export function bindRestoredCombatRuntimeOperators(
  options: RestoreCombatRuntimeOperatorsOptions,
): RestoredCombatRuntimeOperators {
  const programs = new Map<string, CombatOperatorProgram>();
  const cores = new Map<string, RestoredCombatOperatorCore>();
  const sources = new Map<string, RestoredCombatOperatorSources>();
  const resolveBuff = (reference: BuffReference) =>
    options.entities.targets.get(reference.ownerId)?.resolveHandle?.(reference);
  for (const [operatorId, program] of options.preparation.programs) {
    const buffRuntime = options.foundation.operatorBuffTargets.get(operatorId);
    if (buffRuntime === undefined) {
      throw new Error(`restored operator '${operatorId}' has no Buff target`);
    }
    const restoredProgram = { ...program, buffRuntime };
    programs.set(operatorId, restoredProgram);
    cores.set(
      operatorId,
      bindRestoredCombatOperatorCore({
        operator: restoredProgram,
        state: options.preparation.operators.get(operatorId)!,
        skills: options.preparation.skills.get(operatorId)!,
        clock: options.foundation.shared.clock,
        receipt: options.foundation.shared.receipt,
        resolveAttachedBuff: resolveBuff,
        ...options.createCoreBindings(restoredProgram),
      }),
    );
  }
  try {
    for (const [operatorId, program] of programs) {
      sources.set(
        operatorId,
        bindRestoredCombatOperatorSources({
          operator: program,
          state: options.preparation.operators.get(operatorId)!,
          operatorBlackboard: cores.get(operatorId)!.blackboard,
          semanticEvents: options.foundation.semanticEvents,
          ...options.createSourceBindings(program),
        }),
      );
    }
  } catch (error) {
    failAfterAbilityHostCleanup(
      error,
      [...sources.values()].map(source => () => source.dispose()),
    );
  }
  return {
    programs,
    cores,
    sources,
    bindRestoredChildren() {
      const children = resolveOperatorSourceChildren(options.preparation, resolveBuff);
      for (const source of sources.values()) {
        source.bindRestoredChildren(reference => children.get(buffReferenceKey(reference)));
      }
    },
    disposeSources() {
      runAbilityHostCleanup([...sources.values()].map(source => () => source.dispose()));
    },
  };
}

function resolveOperatorSourceChildren(
  preparation: CombatRuntimeRestorePreparation,
  resolve: (reference: BuffReference) => BuffApplicationHandle | undefined,
): ReadonlyMap<string, BuffApplicationHandle> {
  const references = [...preparation.operators.values()].flatMap(state => [
    ...[...state.passives.values()].flatMap(passive => passive.host.childBuffs),
    ...(state.equipment === null
      ? []
      : [...state.equipment.contributions.values()].flatMap(
          contribution => contribution.host.childBuffs,
        )),
  ]);
  const unique = new Map<string, BuffReference>();
  for (const reference of references) {
    const key = buffReferenceKey(reference);
    if (unique.has(key)) throw new Error(`restored source child Buff '${key}' has multiple owners`);
    unique.set(key, reference);
  }
  const children = new Map<string, BuffApplicationHandle>();
  for (const [key, reference] of unique) {
    const child = resolve(reference);
    if (child === undefined) throw new Error(`restored source child Buff '${key}' is missing`);
    children.set(key, child);
  }
  return children;
}
