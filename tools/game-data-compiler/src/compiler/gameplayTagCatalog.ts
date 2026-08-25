import {
  gameplayTagIdFromPath,
  type GameplayTagId,
} from '../../../../src/shared/gameplayTags.ts';
import type { GameplayTagConfigDumpSource } from '../source/gameplayTagConfigDump.ts';

export interface CompiledGameplayTagDefinitionSource {
  readonly id: GameplayTagId;
  readonly path: string;
}

export interface CompiledGameplayTagCatalogSource {
  readonly paths: readonly string[];
  readonly definitions: readonly CompiledGameplayTagDefinitionSource[];
}

/** 计算原生 CRC-32 身份并拒绝路径目录内部的 ID 冲突。 */
export function compileGameplayTagCatalogSource(
  source: GameplayTagConfigDumpSource,
): CompiledGameplayTagCatalogSource {
  const definitions = source.paths.map(path => ({ id: gameplayTagIdFromPath(path), path }));
  const ids = new Set<number>();
  for (const definition of definitions) {
    if (ids.has(definition.id)) {
      throw new Error(`GameplayTagConfig CRC-32 collision at ${JSON.stringify(definition.path)}`);
    }
    ids.add(definition.id);
  }
  return { paths: [...source.paths], definitions };
}

export function renderGameplayTagCatalogModule(
  catalog: CompiledGameplayTagCatalogSource,
  sourceSha256: string,
): string {
  if (!/^[0-9a-f]{64}$/i.test(sourceSha256)) {
    throw new Error('GameplayTagConfig source SHA-256 is invalid');
  }
  const paths = catalog.paths.map(path => `  ${quoteTypeScriptString(path)},`).join('\n');
  return `/**
 * Generated from the 1.4.4 GameplayTagConfig TypeTree dump.
 * Source SHA-256: ${sourceSha256.toUpperCase()}
 * Do not edit by hand; rerun npm run generate:game-data:gameplay-tags.
 */
import { gameplayTagIdFromPath } from '../../core/combat/tags/gameplayTags';

export const GAMEPLAY_TAG_PATHS = Object.freeze([
${paths}
] as const);

export const GAMEPLAY_TAG_DEFINITIONS = Object.freeze(
  GAMEPLAY_TAG_PATHS.map(path => Object.freeze({ id: gameplayTagIdFromPath(path), path })),
);
`;
}

function quoteTypeScriptString(value: string): string {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}
