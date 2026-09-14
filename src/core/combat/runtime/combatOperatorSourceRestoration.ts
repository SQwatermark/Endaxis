/**
 * 按正式装配顺序恢复一名干员的装备、潜能事件、初始化和常驻被动来源。
 *
 * 四类来源共享事件目录、装备黑板和 Buff 所有权关系，不能由完整装配随意穿插创建。本协调器先
 * 建立所有来源宿主，再一次性解析其子 Buff；恢复失败时清理已经建立的当前分支宿主。
 */
import type { BuffApplicationHandle } from '../buffs/combatBuffs';
import { buffReferenceKey, type BuffReference } from '../buffs/buffReference';
import type { CombatOperatorProgram } from './combatRuntimeAssembly';
import type { CombatOperatorState } from '../state/combatState';
import type { ActionBlackboard } from './actionBlackboard';
import { failAfterAbilityHostCleanup, runAbilityHostCleanup } from './abilityEventHostLifecycle';
import type { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import {
  bindRestoredCombatOperatorEquipment,
  type RestoreCombatOperatorEquipmentOptions,
  type RestoredCombatOperatorEquipment,
} from './combatOperatorEquipmentRestoration';
import {
  bindRestoredCombatOperatorInitializations,
  type RestoreCombatOperatorInitializationsOptions,
  type RestoredCombatOperatorInitialization,
} from './combatOperatorInitializationRestoration';
import {
  bindRestoredCombatOperatorPassives,
  type RestoreCombatOperatorPassivesOptions,
  type RestoredCombatOperatorPassives,
} from './combatOperatorPassiveRestoration';
import { bindRestoredCombatOperatorUpgradeEvents } from './combatOperatorUpgradeRestoration';
import type { CreateOperatorUpgradeEventExecutor } from './operatorUpgradeEventRuntime';
import type { OperatorUpgradeEventRuntime } from './operatorUpgradeEventRuntime';

export interface RestoreCombatOperatorSourcesOptions {
  readonly operator: CombatOperatorProgram;
  readonly state: CombatOperatorState;
  readonly operatorBlackboard: ActionBlackboard;
  readonly semanticEvents: CombatSemanticEventRuntime;
  readonly createEquipmentExecutor: RestoreCombatOperatorEquipmentOptions['createExecutor'];
  readonly registerEquipmentAbilityEventAction?: RestoreCombatOperatorEquipmentOptions['registerAbilityEventAction'];
  readonly createInitializationOperations: RestoreCombatOperatorInitializationsOptions['createOperations'];
  readonly createPassiveOperations: RestoreCombatOperatorPassivesOptions['createOperations'];
  readonly registerPassive: RestoreCombatOperatorPassivesOptions['register'];
  readonly createUpgradeExecutor: CreateOperatorUpgradeEventExecutor;
}

export interface RestoredCombatOperatorSources {
  readonly equipment: RestoredCombatOperatorEquipment | null;
  readonly upgradeEvents: OperatorUpgradeEventRuntime | null;
  readonly initializations: ReadonlyMap<string, RestoredCombatOperatorInitialization>;
  readonly passives: RestoredCombatOperatorPassives;
  bindRestoredChildren(
    resolve: (reference: BuffReference) => BuffApplicationHandle | undefined,
  ): void;
  dispose(): void;
}

export function bindRestoredCombatOperatorSources(
  options: RestoreCombatOperatorSourcesOptions,
): RestoredCombatOperatorSources {
  const operatorId = options.operator.operatorId;
  let equipment: RestoredCombatOperatorEquipment | null = null;
  let upgradeEvents: OperatorUpgradeEventRuntime | null = null;
  let passives: RestoredCombatOperatorPassives | null = null;
  try {
    if (options.state.equipment !== null) {
      equipment = bindRestoredCombatOperatorEquipment({
        operatorId,
        contributions: options.operator.equipmentContributions ?? [],
        state: options.state.equipment,
        semanticEvents: options.semanticEvents,
        createExecutor: options.createEquipmentExecutor,
        registerAbilityEventAction: options.registerEquipmentAbilityEventAction,
      });
    }
    if (options.state.upgradeEvents !== null) {
      upgradeEvents = bindRestoredCombatOperatorUpgradeEvents({
        operatorId,
        programs: options.operator.upgradeEventPrograms ?? [],
        state: options.state.upgradeEvents,
        semanticEvents: options.semanticEvents,
        createExecutor: options.createUpgradeExecutor,
      });
    }
    const initializations = bindRestoredCombatOperatorInitializations({
      operatorId,
      programs: options.operator.initializationPrograms ?? [],
      states: options.state.initializations,
      semanticEvents: options.semanticEvents,
      equipment: equipment?.runtime,
      createOperations: options.createInitializationOperations,
    });
    passives = bindRestoredCombatOperatorPassives({
      operatorId,
      programs: options.operator.passivePrograms ?? [],
      states: options.state.passives,
      operatorBlackboard: options.operatorBlackboard,
      semanticEvents: options.semanticEvents,
      createOperations: options.createPassiveOperations,
      register: options.registerPassive,
    });
    const restoredPassives = passives;
    return {
      equipment,
      upgradeEvents,
      initializations,
      passives: restoredPassives,
      bindRestoredChildren(resolve) {
        const children = resolveSourceChildren(options.state, resolve);
        const cached = (reference: BuffReference) => children.get(buffReferenceKey(reference));
        restoredPassives.bindRestoredChildren(cached);
        equipment?.bindRestoredChildren(cached);
      },
      dispose() {
        runAbilityHostCleanup([
          () => restoredPassives.dispose(),
          ...(upgradeEvents === null ? [] : [() => upgradeEvents.dispose()]),
          ...(equipment === null ? [] : [() => equipment.runtime.dispose()]),
        ]);
      },
    };
  } catch (error) {
    failAfterAbilityHostCleanup(error, [
      ...(passives === null ? [] : [() => passives.dispose()]),
      ...(upgradeEvents === null ? [] : [() => upgradeEvents.dispose()]),
      ...(equipment === null ? [] : [() => equipment.runtime.dispose()]),
    ]);
  }
}

function resolveSourceChildren(
  state: CombatOperatorState,
  resolve: (reference: BuffReference) => BuffApplicationHandle | undefined,
): ReadonlyMap<string, BuffApplicationHandle> {
  const references = [
    ...[...state.passives.values()].flatMap(passive => passive.host.childBuffs),
    ...(state.equipment === null
      ? []
      : [...state.equipment.contributions.values()].flatMap(
          contribution => contribution.host.childBuffs,
        )),
  ];
  const uniqueReferences = new Map<string, BuffReference>();
  for (const reference of references) {
    const key = buffReferenceKey(reference);
    if (uniqueReferences.has(key)) {
      throw new Error(`restored source child Buff '${key}' has more than one owner`);
    }
    uniqueReferences.set(key, reference);
  }
  const children = new Map<string, BuffApplicationHandle>();
  for (const [key, reference] of uniqueReferences) {
    const child = resolve(reference);
    if (child === undefined) throw new Error(`restored source child Buff '${key}' is missing`);
    children.set(key, child);
  }
  return children;
}
