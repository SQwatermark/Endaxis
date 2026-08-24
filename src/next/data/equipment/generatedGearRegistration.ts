/**
 * 将原生 ID 的生成装备接入仍保存旧 slug 的项目与展示目录。
 * 身份关联只接受生成定义的 ItemTable iconId 与旧定义 iconPath basename 精确相等。
 */
import type { GearDefinition } from '../../core/game-data/equipmentDefinition';

export interface GeneratedGearRegistrationIssue {
  readonly code: 'missingLegacyPresentation' | 'ambiguousLegacyAliases';
  readonly canonicalSlug: string;
  readonly legacySlugs: readonly string[];
}

export interface GeneratedGearRegistration {
  readonly definitions: readonly GearDefinition[];
  readonly gearAliases: Readonly<Record<string, string>>;
  /** 当前套装仍由旧定义承载，故原生 suitID 暂作为 alias 指向已注册旧套装 slug。 */
  readonly gearSetAliasesToLegacyDefinitions: Readonly<Record<string, string>>;
  readonly issues: readonly GeneratedGearRegistrationIssue[];
}

export function registerGeneratedGearDefinitions(
  generated: readonly GearDefinition[],
  legacy: readonly GearDefinition[],
): GeneratedGearRegistration {
  const generatedByAsset = new Map<string, GearDefinition>();
  for (const definition of generated) {
    const identity = requireIdentity(definition.assetSlug, `generated gear '${definition.slug}'`);
    if (generatedByAsset.has(identity)) {
      throw new Error(`duplicate generated gear asset identity '${identity}'`);
    }
    generatedByAsset.set(identity, definition);
  }

  const legacyByGeneratedSlug = new Map<string, GearDefinition[]>();
  const unmatchedLegacy: GearDefinition[] = [];
  for (const definition of legacy) {
    const identity = iconIdentity(definition);
    const canonical = generatedByAsset.get(identity);
    if (canonical === undefined) {
      unmatchedLegacy.push(definition);
      continue;
    }
    const aliases = legacyByGeneratedSlug.get(canonical.slug) ?? [];
    aliases.push(definition);
    legacyByGeneratedSlug.set(canonical.slug, aliases);
  }

  const gearAliases: Record<string, string> = {};
  const gearSetAliases: Record<string, string> = {};
  const issues: GeneratedGearRegistrationIssue[] = [];
  const canonicalDefinitions = generated.map(definition => {
    const aliases = [...(legacyByGeneratedSlug.get(definition.slug) ?? [])].sort((left, right) =>
      left.slug.localeCompare(right.slug),
    );
    for (const alias of aliases) {
      if (alias.slug !== definition.slug) gearAliases[alias.slug] = definition.slug;
      collectGearSetAlias(definition, alias, gearSetAliases);
    }
    if (aliases.length === 0) {
      issues.push({
        code: 'missingLegacyPresentation',
        canonicalSlug: definition.slug,
        legacySlugs: [],
      });
      return definition;
    }

    const iconPaths = new Set(aliases.map(alias => alias.iconPath).filter(isNonEmptyString));
    if (iconPaths.size > 1) {
      throw new Error(`legacy aliases for '${definition.slug}' disagree on iconPath`);
    }
    if (aliases.length > 1) {
      issues.push({
        code: 'ambiguousLegacyAliases',
        canonicalSlug: definition.slug,
        legacySlugs: aliases.map(alias => alias.slug),
      });
    }
    const uniqueAlias = aliases.length === 1 ? aliases[0] : undefined;
    return {
      ...definition,
      ...(iconPaths.size === 1 ? { iconPath: [...iconPaths][0]! } : {}),
      ...(uniqueAlias === undefined ? {} : { assetSlug: uniqueAlias.slug }),
    };
  });

  const definitions = [...canonicalDefinitions, ...unmatchedLegacy].sort((left, right) =>
    left.slug.localeCompare(right.slug),
  );
  const slugs = new Set<string>();
  for (const definition of definitions) {
    if (slugs.has(definition.slug)) {
      throw new Error(`generated and retained gear definitions collide at '${definition.slug}'`);
    }
    slugs.add(definition.slug);
  }

  return {
    definitions,
    gearAliases: sortRecord(gearAliases),
    gearSetAliasesToLegacyDefinitions: sortRecord(gearSetAliases),
    issues,
  };
}

function collectGearSetAlias(
  canonical: GearDefinition,
  legacy: GearDefinition,
  aliases: Record<string, string>,
): void {
  const source = canonical.gearSetSlug;
  const target = legacy.gearSetSlug;
  if (source === undefined && target === undefined) return;
  if (source === undefined || target === undefined) {
    throw new Error(
      `gear '${canonical.slug}' and legacy alias '${legacy.slug}' disagree on set membership`,
    );
  }
  if (source === target) return;
  const previous = aliases[source];
  if (previous !== undefined && previous !== target) {
    throw new Error(`native gear set '${source}' maps to both '${previous}' and '${target}'`);
  }
  aliases[source] = target;
}

function iconIdentity(definition: GearDefinition): string {
  const iconPath = requireIdentity(definition.iconPath, `legacy gear '${definition.slug}'`);
  const fileName = iconPath.replaceAll('\\', '/').split('/').at(-1)!;
  const extension = fileName.lastIndexOf('.');
  if (extension <= 0) throw new Error(`legacy gear '${definition.slug}' has no icon extension`);
  return fileName.slice(0, extension);
}

function requireIdentity(value: string | undefined, path: string): string {
  if (value === undefined || value.length === 0) throw new Error(`${path} has no asset identity`);
  return value;
}

function isNonEmptyString(value: string | undefined): value is string {
  return value !== undefined && value.length > 0;
}

function sortRecord(value: Record<string, string>): Readonly<Record<string, string>> {
  return Object.freeze(
    Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right))),
  );
}
