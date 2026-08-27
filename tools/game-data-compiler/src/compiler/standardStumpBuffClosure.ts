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
  const buffOwnerTargets = propagateBuffOwnerTargets(sources, rootBuffOwnerTargets);
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
      const reason = standardStumpBuffAbilityEventOmissionReason(event.event);
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
        buffOwnerTargets.has(buffId) ? { fixedBuffOwnerTarget: buffOwnerTargets.get(buffId)! } : {},
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

function propagateBuffOwnerTargets(
  sources: ReadonlyMap<string, BuffRuntimeSource>,
  seeds: ReadonlyMap<string, 'caster' | 'enemy' | 'currentAbilityEntity'>,
) {
  const targets = new Map(seeds);
  const conflicts = new Set<string>();
  let changed = true;
  while (changed) {
    changed = false;
    for (const [id, source] of sources) {
      const owner = targets.get(id);
      if (owner === undefined) continue;
      const sequences = [
        ...source.graph.timelineActions.map(item => item.sequence),
        ...source.graph.buffEvents.flatMap(item => item.actions),
        ...source.graph.abilityEvents.flatMap(item => item.actions),
        ...source.graph.igniteEvents.flatMap(item => item.actions),
      ];
      const nodes = sequences.flatMap(sequence => collectNativeActionNodes(sequence));
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
      for (const node of nodes) {
        if (
          node.metadata.enabled &&
          node.body.kind === 'leaf' &&
          node.body.value.family === 'forcedElementalStatus'
        ) {
          const childId = {
            Fire: 'buff_common_fire_fire_burning_triggered',
            Pulse: 'buff_common_pulse_pulse_conduct_triggered',
            Cryst: 'buff_common_cryst_cryst_frozen_triggered',
            Natural: 'buff_common_natural_natural_corrupt_triggered',
          }[node.body.value.action.statusElement];
          if (!conflicts.has(childId) && targets.get(childId) === undefined) {
            targets.set(childId, 'enemy');
            changed = true;
          } else if (targets.get(childId) !== undefined && targets.get(childId) !== 'enemy') {
            targets.delete(childId);
            conflicts.add(childId);
          }
          continue;
        }
        if (
          !node.metadata.enabled ||
          node.body.kind !== 'leaf' ||
          node.body.value.family !== 'buffApplication'
        )
          continue;
        const action = node.body.value.action;
        const childOwner =
          action.target.targetSource === 'Owner' && action.target.targetGroupKey === ''
            ? owner
            : action.target.targetSource === 'Source' && action.target.targetGroupKey === ''
              ? 'caster'
              : (action.target.targetSource === 'Context' ||
                    action.target.targetSource === 'Target') &&
                  staticEnemyTargetGroupKeys.has(action.target.targetGroupKey)
                ? 'enemy'
                : undefined;
        if (childOwner === undefined) continue;
        for (const entry of action.buffs) {
          if (entry.readIdFromBlackboard || entry.buffId === '') continue;
          const previous = targets.get(entry.buffId);
          if (previous !== undefined && previous !== childOwner) {
            targets.delete(entry.buffId);
            conflicts.add(entry.buffId);
            continue;
          }
          if (previous === undefined && !conflicts.has(entry.buffId)) {
            targets.set(entry.buffId, childOwner);
            changed = true;
          }
        }
      }
    }
  }
  return targets;
}
