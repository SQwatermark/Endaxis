import {
  gameplayTagId,
  GameplayTagRegistry,
  type GameplayTagId,
} from '../../core/combat/tags/gameplayTags';
import { GAMEPLAY_TAG_DEFINITIONS, GAMEPLAY_TAG_PATHS } from './gameplayTagCatalog.generated';

export { GAMEPLAY_TAG_DEFINITIONS, GAMEPLAY_TAG_PATHS };

/** Immutable version registry shared by all containers within and across simulation runs. */
export const gameplayTagRegistry = new GameplayTagRegistry(GAMEPLAY_TAG_PATHS);

const byId = new Map<number, (typeof GAMEPLAY_TAG_DEFINITIONS)[number]>(
  GAMEPLAY_TAG_DEFINITIONS.map(definition => [definition.id, definition]),
);
const byPath = new Map<string, (typeof GAMEPLAY_TAG_DEFINITIONS)[number]>(
  GAMEPLAY_TAG_DEFINITIONS.map(definition => [definition.path, definition]),
);

export function gameplayTagDefinitionById(
  id: number,
): (typeof GAMEPLAY_TAG_DEFINITIONS)[number] | undefined {
  return byId.get(id);
}

export function gameplayTagDefinitionByPath(
  path: string,
): (typeof GAMEPLAY_TAG_DEFINITIONS)[number] | undefined {
  return byPath.get(path);
}

export function gameplayTagPath(id: number): string | undefined {
  return gameplayTagDefinitionById(id)?.path;
}

export function requireGameplayTagId(path: string): GameplayTagId {
  const definition = gameplayTagDefinitionByPath(path);
  if (definition === undefined) throw new Error(`GameplayTagConfig does not contain '${path}'`);
  return definition.id;
}

/** Accept an exact registered path or a preserved signed int32 source value. */
export function parseGameplayTagReference(value: string): GameplayTagId | undefined {
  const trimmed = value.trim();
  const definition = gameplayTagDefinitionByPath(trimmed);
  if (definition !== undefined) return definition.id;
  if (!/^-?\d+$/.test(trimmed)) return undefined;
  const numeric = Number(trimmed);
  try {
    return gameplayTagId(numeric);
  } catch {
    return undefined;
  }
}
