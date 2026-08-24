import type { GearSetDefinition } from '../../core/game-data/equipmentDefinition';

export interface GeneratedGearSetRegistration {
  readonly definitions: readonly GearSetDefinition[];
  /** 旧项目套装 slug → 当前原生套装身份；未转换原生身份仍沿用原生 → 旧定义。 */
  readonly aliases: Readonly<Record<string, string>>;
}

/** 用已闭合的原生套装替换对应旧定义，同时保持新旧项目两种身份都可解析。 */
export function registerGeneratedGearSetDefinitions(
  generated: readonly GearSetDefinition[],
  legacy: readonly GearSetDefinition[],
  nativeToLegacy: Readonly<Record<string, string>>,
): GeneratedGearSetRegistration {
  const generatedIds = new Set<string>();
  const replacedLegacyIds = new Set<string>();
  const aliases: Record<string, string> = {};
  for (const definition of generated) {
    if (generatedIds.has(definition.slug))
      throw new Error(`duplicate generated gear set '${definition.slug}'`);
    generatedIds.add(definition.slug);
    const legacySlug = nativeToLegacy[definition.slug];
    if (legacySlug !== undefined) {
      if (replacedLegacyIds.has(legacySlug))
        throw new Error(`multiple generated gear sets replace '${legacySlug}'`);
      replacedLegacyIds.add(legacySlug);
      aliases[legacySlug] = definition.slug;
    }
  }
  for (const [nativeSlug, legacySlug] of Object.entries(nativeToLegacy)) {
    if (!generatedIds.has(nativeSlug)) aliases[nativeSlug] = legacySlug;
  }
  const definitions = [
    ...generated,
    ...legacy.filter(definition => !replacedLegacyIds.has(definition.slug)),
  ].sort((left, right) => left.slug.localeCompare(right.slug));
  const identities = new Set<string>();
  for (const definition of definitions) {
    if (identities.has(definition.slug))
      throw new Error(`duplicate registered gear set '${definition.slug}'`);
    identities.add(definition.slug);
  }
  return {
    definitions,
    aliases: Object.fromEntries(
      Object.entries(aliases).sort(([left], [right]) => left.localeCompare(right)),
    ),
  };
}
