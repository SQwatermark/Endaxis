import type { WeaponDefinition } from '../../core/game-data/equipmentDefinition';

export type GeneratedWeaponRegistrationIssue =
  | {
      readonly code: 'legacyTraitLayoutMismatch';
      readonly canonicalSlug: string;
      readonly legacySlug: string;
      readonly legacyLevelCounts: readonly number[];
      readonly generatedLevelCounts: readonly number[];
    }
  | {
      readonly code: 'missingLegacyPresentation';
      readonly canonicalSlug: string;
    }
  | {
      readonly code: 'ambiguousGeneratedAssetIdentity';
      readonly assetSlug: string;
      readonly canonicalSlugs: readonly string[];
      readonly legacySlug: string;
    }
  | {
      readonly code: 'ambiguousLegacyAliases';
      readonly canonicalSlug: string;
      readonly legacySlugs: readonly string[];
    };

export interface GeneratedWeaponRegistration {
  readonly definitions: readonly WeaponDefinition[];
  readonly aliases: Readonly<Record<string, string>>;
  readonly issues: readonly GeneratedWeaponRegistrationIssue[];
}

/**
 * 将原生 ID 的生成武器接入仍保存旧友好 slug 的项目与 i18n 目录。
 * 行为始终来自生成定义；旧文件只提供 icon basename 可证明的 alias 和展示文本身份。
 */
export function registerGeneratedWeaponDefinitions(
  generated: readonly WeaponDefinition[],
  legacy: readonly WeaponDefinition[],
): GeneratedWeaponRegistration {
  const generatedByAsset = new Map<string, WeaponDefinition[]>();
  for (const definition of generated) {
    const asset = requireIdentity(definition.assetSlug, `generated weapon '${definition.slug}'`);
    const candidates = generatedByAsset.get(asset) ?? [];
    candidates.push(definition);
    generatedByAsset.set(asset, candidates);
  }

  const legacyByGeneratedSlug = new Map<string, WeaponDefinition[]>();
  const unmatchedLegacy: WeaponDefinition[] = [];
  const issues: GeneratedWeaponRegistrationIssue[] = [];
  for (const definition of legacy) {
    const asset = iconIdentity(definition);
    const candidates = generatedByAsset.get(asset) ?? [];
    if (candidates.length !== 1) {
      unmatchedLegacy.push(definition);
      if (candidates.length > 1) {
        issues.push({
          code: 'ambiguousGeneratedAssetIdentity',
          assetSlug: asset,
          canonicalSlugs: candidates.map(item => item.slug).sort(),
          legacySlug: definition.slug,
        });
      }
      continue;
    }
    const canonical = candidates[0]!;
    if (
      canonical.traits.length !== definition.traits.length ||
      canonical.traits.some(
        (trait, index) => trait.levelCount < (definition.traits[index]?.levelCount ?? 0),
      )
    ) {
      // 图标身份能证明别名，不能证明按数组槽位保存的词条等级可以直接迁移。
      issues.push({
        code: 'legacyTraitLayoutMismatch',
        canonicalSlug: canonical.slug,
        legacySlug: definition.slug,
        legacyLevelCounts: definition.traits.map(trait => trait.levelCount),
        generatedLevelCounts: canonical.traits.map(trait => trait.levelCount),
      });
    }
    const aliases = legacyByGeneratedSlug.get(candidates[0]!.slug) ?? [];
    aliases.push(definition);
    legacyByGeneratedSlug.set(candidates[0]!.slug, aliases);
  }

  const aliases: Record<string, string> = {};
  const canonicalDefinitions = generated.map(definition => {
    const presentationAliases = [...(legacyByGeneratedSlug.get(definition.slug) ?? [])].sort(
      (left, right) => left.slug.localeCompare(right.slug),
    );
    for (const alias of presentationAliases) {
      if (alias.slug !== definition.slug) aliases[alias.slug] = definition.slug;
    }
    if (presentationAliases.length === 0) {
      issues.push({ code: 'missingLegacyPresentation', canonicalSlug: definition.slug });
      return definition;
    }
    if (presentationAliases.length > 1) {
      issues.push({
        code: 'ambiguousLegacyAliases',
        canonicalSlug: definition.slug,
        legacySlugs: presentationAliases.map(item => item.slug),
      });
      return definition;
    }
    // 游戏文本目录当前仍以旧友好 slug 为 key；这只影响 i18n 查询，不改变原生定义身份。
    return { ...definition, assetSlug: presentationAliases[0]!.slug };
  });

  const definitions = [...canonicalDefinitions, ...unmatchedLegacy].sort((left, right) =>
    left.slug.localeCompare(right.slug),
  );
  const seen = new Set<string>();
  for (const definition of definitions) {
    if (seen.has(definition.slug)) {
      throw new Error(`generated and retained weapon definitions collide at '${definition.slug}'`);
    }
    seen.add(definition.slug);
  }
  return {
    definitions: Object.freeze(definitions),
    aliases: Object.freeze(
      Object.fromEntries(
        Object.entries(aliases).sort(([left], [right]) => left.localeCompare(right)),
      ),
    ),
    issues: Object.freeze(issues),
  };
}

function iconIdentity(definition: WeaponDefinition): string {
  const iconPath = requireIdentity(definition.iconPath, `legacy weapon '${definition.slug}'`);
  const fileName = iconPath.replaceAll('\\', '/').split('/').at(-1)!;
  const extension = fileName.lastIndexOf('.');
  if (extension <= 0) throw new Error(`legacy weapon '${definition.slug}' has no icon extension`);
  return fileName.slice(0, extension);
}

function requireIdentity(value: string | undefined, path: string): string {
  if (value === undefined || value.length === 0) throw new Error(`${path} has no asset identity`);
  return value;
}
