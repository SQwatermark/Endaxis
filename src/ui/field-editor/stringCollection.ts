import { canSelectReference, type ReferenceChoices } from '@/application/editor/referenceResolver';
import { parseGameplayTagReference } from '@/data/combat/gameplayTagCatalog';

export function validCollectionEntry(
  value: unknown,
  kind: 'reference' | 'gameplayTag',
  family?: string,
  choices?: ReferenceChoices,
): value is string {
  return (
    typeof value === 'string' &&
    (kind === 'gameplayTag'
      ? parseGameplayTagReference(value) === value
      : canSelectReference(family ?? '', value, choices?.[family ?? '']))
  );
}
/** Imported stale entries may be retained/reordered/removed, never silently repaired or multiplied. */
export function validStringCollection(
  value: unknown,
  previous: unknown,
  kind: 'reference' | 'gameplayTag',
  family?: string,
  choices?: ReferenceChoices,
): value is readonly string[] {
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) return false;
  const retained = new Map<string, number>();
  if (Array.isArray(previous))
    for (const item of previous)
      if (typeof item === 'string') retained.set(item, (retained.get(item) ?? 0) + 1);
  return value.every(item => {
    const count = retained.get(item) ?? 0;
    if (count) {
      retained.set(item, count - 1);
      return true;
    }
    return validCollectionEntry(item, kind, family, choices);
  });
}
