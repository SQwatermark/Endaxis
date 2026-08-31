import type { WeaponDefinition } from '../../core/game-data/equipmentDefinition';

export interface GeneratedWeaponRegistration {
  readonly definitions: readonly WeaponDefinition[];
  readonly aliases: Readonly<Record<string, string>>;
  readonly missingPresentationAssets: readonly string[];
}

/**
 * 给当前生成武器接入稳定的 UI/i18n 身份。
 * 两个输入都属于唯一最新目录；这里不读取、比较或恢复任何历史武器定义。
 */
export function registerGeneratedWeaponDefinitions(
  generated: readonly WeaponDefinition[],
  presentationSlugByAsset: Readonly<Record<string, string>>,
): GeneratedWeaponRegistration {
  const aliases: Record<string, string> = {};
  const seenPresentation = new Map<string, string>();
  const missingPresentationAssets: string[] = [];
  const definitions = generated.map(definition => {
    const asset = requireIdentity(definition.assetSlug, `generated weapon '${definition.slug}'`);
    const presentationSlug = presentationSlugByAsset[asset];
    if (presentationSlug === undefined) {
      missingPresentationAssets.push(asset);
      return definition;
    }
    const owner = seenPresentation.get(presentationSlug);
    if (owner !== undefined && owner !== definition.slug) {
      throw new Error(
        `weapon presentation slug '${presentationSlug}' is shared by '${owner}' and '${definition.slug}'`,
      );
    }
    seenPresentation.set(presentationSlug, definition.slug);
    if (presentationSlug !== definition.slug) aliases[presentationSlug] = definition.slug;
    return { ...definition, assetSlug: presentationSlug };
  });

  return Object.freeze({
    definitions: Object.freeze(
      [...definitions].sort((left, right) => left.slug.localeCompare(right.slug)),
    ),
    aliases: Object.freeze(
      Object.fromEntries(
        Object.entries(aliases).sort(([left], [right]) => left.localeCompare(right)),
      ),
    ),
    missingPresentationAssets: Object.freeze([...missingPresentationAssets].sort()),
  });
}

function requireIdentity(value: string | undefined, path: string): string {
  if (value === undefined || value.length === 0) throw new Error(`${path} has no asset identity`);
  return value;
}
