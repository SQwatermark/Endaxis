import type { GameplayTagRegistry } from '../source/nativeGameplayTags.ts';
import { requireRecord } from '../source/primitives.ts';
import type { BuffRuntimeSource } from '../source/buffRuntime.ts';
import {
  collectBuffRuntimeClosure,
  collectBuffRuntimePresentationActionPaths,
  collectBuffRuntimeLevelEventActionPaths,
  compileBuffRuntimeDefinitionSource,
  isAfterEnemyDefeatedOnlyBuffRuntime,
  isPresentationOnlyBuffStackEffect,
} from './buffRuntimeProjection.ts';
import type { CompiledBuffDefinitionSource } from './buffProjectionTypes.ts';
import { standardStumpBuffAbilityEventOmissionReason } from './standardStumpScenarioPolicy.ts';
import {
  parseGlobalBuffTemplateCatalogSource,
  type GlobalBuffTemplateCatalogSource,
} from '../source/globalBuffTemplate.ts';
import { createGlobalBuffProjectionExtensions } from './globalBuffProjection.ts';
import { parseSkillSettingCatalogSource } from '../source/skillSettingCatalog.ts';
import { createSkillSettingProjectionExtensions } from './skillSettingProjection.ts';
import type { CombatActionProjectionContextSource } from './combatProjectionCommon.ts';
import { isStaticSingleEnemyTargetGroup } from './combatProjectionCommon.ts';
import { collectNativeActionNodes } from '../source/controlFlow.ts';
import { collectCombatInvisibleBuffClosureIds } from './combatInvisibleBuffClosure.ts';

export interface StandardStumpBuffClosureDiagnostic {
  readonly status: 'blocked' | 'scenario-omitted';
  readonly sourcePath: string;
  readonly reason: string;
}

export interface CompiledStandardStumpBuffClosure {
  readonly sources: ReadonlyMap<string, BuffRuntimeSource>;
  readonly definitions: Readonly<Record<string, CompiledBuffDefinitionSource>>;
  readonly omittedBuffIds: ReadonlySet<string>;
  readonly diagnostics: readonly StandardStumpBuffClosureDiagnostic[];
}

/** 把任意领域给出的根 Buff 编译成同一份固定木桩运行闭包。 */
export function compileStandardStumpBuffClosure(
  rootBuffIds: readonly string[],
  buffDataValue: unknown,
  globalBuffCatalogValue?: unknown,
  skillSettingCatalogValue?: unknown,
  abilityEntityQueries?: CombatActionProjectionContextSource['abilityEntityQueries'],
  createAdditionalExtensions?: (
    sources: ReadonlyMap<string, BuffRuntimeSource>,
    visualOnlyIds: ReadonlySet<string>,
  ) => import('./combatProjectionCommon.ts').CombatActionProjectionExtensionsSource,
  rootBuffOwnerTargets: ReadonlyMap<
    string,
    'caster' | 'enemy' | 'currentAbilityEntity'
  > = new Map(),
  preserveBuffIds: ReadonlySet<string> = new Set(),
  gameplayTagRegistry?: GameplayTagRegistry,
  rootBuffSourceTargets: ReadonlyMap<
    string,
    'caster' | 'enemy' | 'currentAbilityEntity'
  > = new Map(),
): CompiledStandardStumpBuffClosure {
  const buffData =
    typeof buffDataValue === 'function'
      ? (buffDataValue as (id: string) => unknown)
      : requireRecord(buffDataValue, 'BuffData');
  const globalBuffCatalog: GlobalBuffTemplateCatalogSource | undefined =
    globalBuffCatalogValue === undefined
      ? undefined
      : parseGlobalBuffTemplateCatalogSource(globalBuffCatalogValue);
  const sources = collectBuffRuntimeClosure(rootBuffIds, buffData, globalBuffCatalog);
  const rootBuffIdSet = new Set(rootBuffIds);
  const { owners: buffOwnerTargets, sources: buffSourceTargets } = propagateBuffTargets(
    sources,
    rootBuffOwnerTargets,
    rootBuffSourceTargets,
  );
  const keywordOverrideChildIds = new Set(
    [...sources.values()].flatMap(source =>
      buffActionNodes(source).flatMap(node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'keywordBuff' &&
        node.body.value.action.overrideChildBuffId &&
        node.body.value.action.childBuffId.blackboardKey === null &&
        node.body.value.action.childBuffId.value.length > 0
          ? [node.body.value.action.childBuffId.value]
          : [],
      ),
    ),
  );
  const keywordEnhancementTriggerIds = new Set(
    [...sources.values()].flatMap(source =>
      buffActionNodes(source).flatMap(node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'keywordBuff'
          ? node.body.value.action.enhancements.flatMap(enhancement => enhancement.buffIds)
          : [],
      ),
    ),
  );
  const skillSettingCatalog =
    skillSettingCatalogValue === undefined
      ? undefined
      : parseSkillSettingCatalogSource(skillSettingCatalogValue);
  const omittedBuffIds = new Set(
    [
      ...collectCombatInvisibleBuffClosureIds([...sources.keys()], id => {
        const value = typeof buffData === 'function' ? buffData(id) : buffData[id];
        if (value === undefined) throw new Error(`BuffData.${id}: missing definition`);
        return value;
      }),
    ].filter(
      id =>
        !preserveBuffIds.has(id) &&
        !keywordOverrideChildIds.has(id) &&
        !keywordEnhancementTriggerIds.has(id) &&
        (!rootBuffIdSet.has(id) || isPresentationOnlyBuffStackEffect(sources.get(id)!)),
    ),
  );
  const diagnostics: StandardStumpBuffClosureDiagnostic[] = [];
  for (const id of omittedBuffIds) {
    diagnostics.push({
      status: 'scenario-omitted',
      sourcePath: `BuffData.${id}`,
      reason:
        'iconless presentation-only Buff closure has no combat identity consumer in this compiled program',
    });
  }
  for (const [buffId, source] of sources) {
    if (!omittedBuffIds.has(buffId) && isPresentationOnlyBuffStackEffect(source)) {
      diagnostics.push({
        status: 'scenario-omitted',
        sourcePath: `BuffData.${buffId}.stackingSettings.stackEffects`,
        reason:
          'particle-only stack effect does not affect the fixed-target damage simulation; Buff identity and stacking remain active',
      });
    } else if (isAfterEnemyDefeatedOnlyBuffRuntime(source)) {
      omittedBuffIds.add(buffId);
      diagnostics.push({
        status: 'scenario-omitted',
        sourcePath: `BuffData.${buffId}.abilityEventAction`,
        reason: 'enemy-defeated response occurs after the fixed single target simulation has ended',
      });
    }
  }
  const extensions = {
    ...(globalBuffCatalog === undefined
      ? {}
      : createGlobalBuffProjectionExtensions(globalBuffCatalog)),
    ...(skillSettingCatalog === undefined
      ? {}
      : createSkillSettingProjectionExtensions(skillSettingCatalog)),
    ...(createAdditionalExtensions?.(sources, omittedBuffIds) ?? {}),
  };
  const definitions: Record<string, CompiledBuffDefinitionSource> = {};
  for (const [buffId, source] of sources) {
    if (omittedBuffIds.has(buffId)) continue;
    for (const sourcePath of collectBuffRuntimePresentationActionPaths(source)) {
      diagnostics.push({
        status: 'scenario-omitted',
        sourcePath,
        reason:
          'strictly validated presentation action has no effect in the non-rendering combat backend',
      });
    }
    for (const sourcePath of collectBuffRuntimeLevelEventActionPaths(source)) {
      diagnostics.push({
        status: 'scenario-omitted',
        sourcePath,
        reason:
          'strictly validated GameLevelEvent/BattleRecorder publication has no registered production consumer in the fixed-target combat runtime',
      });
    }
    const omittedEvents = new Set<string | number>();
    for (const event of source.graph.abilityEvents) {
      const reason = standardStumpBuffAbilityEventOmissionReason(
        event.event,
        buffOwnerTargets.get(buffId),
      );
      if (reason === null) continue;
      omittedEvents.add(event.event);
      diagnostics.push({
        status: 'scenario-omitted',
        sourcePath: `BuffData.${buffId}.abilityEventAction`,
        reason,
      });
    }
    try {
      definitions[buffId] = compileBuffRuntimeDefinitionSource(
        source,
        omittedBuffIds,
        omittedEvents,
        extensions,
        abilityEntityQueries,
        {
          gameplayTagRegistry: gameplayTagRegistry ?? abilityEntityQueries?.gameplayTagRegistry,
          ...(buffOwnerTargets.has(buffId)
            ? { fixedBuffOwnerTarget: buffOwnerTargets.get(buffId)! }
            : {}),
          ...(buffSourceTargets.has(buffId)
            ? { fixedBuffSourceTarget: buffSourceTargets.get(buffId)! }
            : {}),
        },
      );
    } catch (error) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: `BuffData.${buffId}`,
        reason:
          `${error instanceof Error ? error.message : String(error)}` +
          ` [fixedBuffOwner=${buffOwnerTargets.get(buffId) ?? 'unknown'}]`,
      });
    }
  }
  return {
    sources,
    definitions: Object.fromEntries(
      Object.entries(definitions).sort(([left], [right]) => left.localeCompare(right)),
    ),
    omittedBuffIds,
    diagnostics,
  };
}

function buffActionNodes(source: BuffRuntimeSource) {
  return [
    ...source.graph.timelineActions.map(item => item.sequence),
    ...source.graph.buffEvents.flatMap(item => item.actions),
    ...source.graph.abilityEvents.flatMap(item => item.actions),
    ...source.graph.igniteEvents.flatMap(item => item.actions),
  ].flatMap(sequence => collectNativeActionNodes(sequence));
}

function propagateBuffTargets(
  sources: ReadonlyMap<string, BuffRuntimeSource>,
  ownerSeeds: ReadonlyMap<string, 'caster' | 'enemy' | 'currentAbilityEntity'>,
  sourceSeeds: ReadonlyMap<string, 'caster' | 'enemy' | 'currentAbilityEntity'>,
) {
  type Target = 'caster' | 'enemy' | 'currentAbilityEntity';
  const owners = new Map(ownerSeeds);
  const sourceTargets = new Map(sourceSeeds);
  const ownerConflicts = new Set<string>();
  const sourceConflicts = new Set<string>();
  const register = (
    map: Map<string, Target>,
    conflicts: Set<string>,
    id: string,
    value?: Target,
  ) => {
    if (value === undefined) return false;
    const previous = map.get(id);
    if (previous !== undefined && previous !== value) {
      map.delete(id);
      conflicts.add(id);
      return false;
    }
    if (previous === undefined && !conflicts.has(id)) {
      map.set(id, value);
      return true;
    }
    return false;
  };
  let changed = true;
  while (changed) {
    changed = false;
    for (const [id, source] of sources) {
      const owner = owners.get(id);
      const sourceTarget = sourceTargets.get(id);
      if (owner === undefined && sourceTarget === undefined) continue;
      const nodes = buffActionNodes(source);
      const staticEnemyTargetGroupKeys = new Set(
        nodes.flatMap(node =>
          node.metadata.enabled &&
          node.body.kind === 'leaf' &&
          node.body.value.family === 'targetGroup' &&
          isStaticSingleEnemyTargetGroup(node.body.value.action) &&
          (owner === 'caster' || owner === 'currentAbilityEntity')
            ? [node.body.value.action.targetGroupKey]
            : [],
        ),
      );
      const abilityEntityTargetGroupKeys = new Set(
        nodes.flatMap(node =>
          node.metadata.enabled &&
          node.body.kind === 'leaf' &&
          node.body.value.family === 'targetGroup' &&
          node.body.value.action.producerType === 'FindTargetAction' &&
          node.body.value.action.finderType === 'OwnerSpawnedEntityFinder' &&
          node.body.value.action.finderSpawnedObjectType === 'AbilityEntity'
            ? [node.body.value.action.targetGroupKey]
            : [],
        ),
      );
      for (const node of nodes) {
        if (!node.metadata.enabled || node.body.kind !== 'leaf') continue;
        if (
          node.body.value.family === 'aura' &&
          node.body.value.action.kind === 'globalPartyAura'
        ) {
          const action = node.body.value.action;
          const childOwner: Target = action.target === 'party' ? 'caster' : 'enemy';
          const childSource = action.buffSource === 'ActionOwner' ? owner : sourceTarget;
          for (const entry of action.buffs) {
            changed = register(owners, ownerConflicts, entry.buffId, childOwner) || changed;
            changed =
              register(sourceTargets, sourceConflicts, entry.buffId, childSource) || changed;
          }
          continue;
        }
        if (node.body.value.family === 'keywordBuff') {
          const action = node.body.value.action;
          const childOwner = action.target.targetSource === 'Owner' ? owner : sourceTarget;
          const childSource = action.source.targetSource === 'Owner' ? owner : sourceTarget;
          changed = register(owners, ownerConflicts, action.carrierBuffId, childOwner) || changed;
          changed =
            register(sourceTargets, sourceConflicts, action.carrierBuffId, childSource) || changed;
          continue;
        }
        if (node.body.value.family === 'forcedElementalStatus') {
          const childId = {
            Fire: 'buff_common_fire_fire_burning_triggered',
            Pulse: 'buff_common_pulse_pulse_conduct_triggered',
            Cryst: 'buff_common_cryst_cryst_frozen_triggered',
            Natural: 'buff_common_natural_natural_corrupt_triggered',
          }[node.body.value.action.statusElement];
          changed = register(owners, ownerConflicts, childId, 'enemy') || changed;
          changed = register(sourceTargets, sourceConflicts, childId, sourceTarget) || changed;
          continue;
        }
        if (node.body.value.family !== 'buffApplication') continue;
        const action = node.body.value.action;
        const childOwner =
          action.target.targetSource === 'Owner' && action.target.targetGroupKey === ''
            ? owner
            : action.target.targetSource === 'Source' && action.target.targetGroupKey === ''
              ? sourceTarget
              : (action.target.targetSource === 'Context' ||
                    action.target.targetSource === 'Target') &&
                  staticEnemyTargetGroupKeys.has(action.target.targetGroupKey)
                ? ('enemy' as const)
                : action.target.targetSource === 'Context' &&
                    abilityEntityTargetGroupKeys.has(action.target.targetGroupKey)
                  ? ('currentAbilityEntity' as const)
                  : undefined;
        if (childOwner === undefined) continue;
        const childSource =
          action.buffSource === 'ActionOwner'
            ? owner
            : action.buffSource === 'ActionSource'
              ? sourceTarget
              : action.buffSource === 'InputTarget' || action.buffSource === 'ContextTarget'
                ? childOwner
                : undefined;
        for (const entry of action.buffs) {
          if (entry.readIdFromBlackboard || entry.buffId === '') continue;
          changed = register(owners, ownerConflicts, entry.buffId, childOwner) || changed;
          changed = register(sourceTargets, sourceConflicts, entry.buffId, childSource) || changed;
        }
      }
    }
  }
  return { owners, sources: sourceTargets };
}
