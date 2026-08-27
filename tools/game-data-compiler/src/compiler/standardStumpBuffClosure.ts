import { requireRecord } from '../source/primitives.ts';
import type { BuffRuntimeSource } from '../source/buffRuntime.ts';
import {
  collectBuffRuntimeClosure,
  collectBuffRuntimePresentationActionPaths,
  compileBuffRuntimeDefinitionSource,
  isAfterEnemyDefeatedOnlyBuffRuntime,
  isPresentationOnlyBuffStackEffect,
  type CompiledBuffDefinitionSource,
} from './buffRuntimeProjection.ts';
import { standardStumpBuffAbilityEventOmissionReason } from './standardStumpScenarioPolicy.ts';

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
): CompiledStandardStumpBuffClosure {
  const buffData =
    typeof buffDataValue === 'function'
      ? (buffDataValue as (id: string) => unknown)
      : requireRecord(buffDataValue, 'BuffData');
  const sources = collectBuffRuntimeClosure(rootBuffIds, buffData);
  const omittedBuffIds = new Set<string>();
  const diagnostics: StandardStumpBuffClosureDiagnostic[] = [];
  for (const [buffId, source] of sources) {
    if (isPresentationOnlyBuffStackEffect(source)) {
      omittedBuffIds.add(buffId);
      diagnostics.push({
        status: 'scenario-omitted',
        sourcePath: `BuffData.${buffId}.stackingSettings.stackEffects`,
        reason: 'particle-only stack effect does not affect the fixed-target damage simulation',
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
      );
    } catch (error) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: `BuffData.${buffId}`,
        reason: error instanceof Error ? error.message : String(error),
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
