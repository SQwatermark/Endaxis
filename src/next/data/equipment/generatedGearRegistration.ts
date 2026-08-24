/**
 * 将原生 ID 的生成装备接入仍保存旧 slug 的项目与展示目录。
 * 身份关联先要求 ItemTable iconId 与旧 iconPath basename 精确相等；图标重复时再以正式字段唯一消解。
 */
import type { GearDefinition } from '../../core/game-data/equipmentDefinition';

export type GeneratedGearRegistrationIssue =
  | {
      readonly code: 'missingLegacyPresentation' | 'ambiguousLegacyAliases';
      readonly canonicalSlug: string;
      readonly legacySlugs: readonly string[];
    }
  | {
      readonly code: 'ambiguousGeneratedAssetIdentity';
      readonly assetSlug: string;
      readonly canonicalSlugs: readonly string[];
      readonly legacySlug: string;
    };

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
  const generatedByAsset = new Map<string, GearDefinition[]>();
  for (const definition of generated) {
    const identity = requireIdentity(definition.assetSlug, `generated gear '${definition.slug}'`);
    const candidates = generatedByAsset.get(identity) ?? [];
    candidates.push(definition);
    generatedByAsset.set(identity, candidates);
  }

  const legacyByGeneratedSlug = new Map<string, GearDefinition[]>();
  const unmatchedLegacy: GearDefinition[] = [];
  const issues: GeneratedGearRegistrationIssue[] = [];
  for (const definition of legacy) {
    const identity = iconIdentity(definition);
    const candidates = generatedByAsset.get(identity) ?? [];
    const compatible = candidates.filter(candidate => hasSameFormalShape(candidate, definition));
    const canonical =
      candidates.length === 1 ? candidates[0] : compatible.length === 1 ? compatible[0] : undefined;
    if (canonical === undefined) {
      unmatchedLegacy.push(definition);
      if (candidates.length > 1) {
        issues.push({
          code: 'ambiguousGeneratedAssetIdentity',
          assetSlug: identity,
          canonicalSlugs: candidates.map(candidate => candidate.slug).sort(),
          legacySlug: definition.slug,
        });
      }
      continue;
    }
    const aliases = legacyByGeneratedSlug.get(canonical.slug) ?? [];
    aliases.push(definition);
    legacyByGeneratedSlug.set(canonical.slug, aliases);
  }

  const gearAliases: Record<string, string> = {};
  const gearSetAliases: Record<string, string> = {};
  const canonicalDefinitions = generated.map(definition => {
    const aliases = [...(legacyByGeneratedSlug.get(definition.slug) ?? [])].sort((left, right) =>
      left.slug.localeCompare(right.slug),
    );
    for (const alias of aliases) {
      if (alias.slug !== definition.slug) gearAliases[alias.slug] = definition.slug;
      collectGearSetAlias(definition, alias, gearSetAliases);
    }
    const iconPaths = new Set(
      legacy
        .filter(alias => iconIdentity(alias) === definition.assetSlug)
        .map(alias => alias.iconPath)
        .filter(isNonEmptyString),
    );
    if (iconPaths.size > 1) {
      throw new Error(`legacy assets for '${definition.slug}' disagree on iconPath`);
    }
    if (aliases.length === 0) {
      issues.push({
        code: 'missingLegacyPresentation',
        canonicalSlug: definition.slug,
        legacySlugs: [],
      });
      return {
        ...definition,
        ...(iconPaths.size === 1 ? { iconPath: [...iconPaths][0]! } : {}),
      };
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

/**
 * 原生 iconId 重复时，只接受已进入 Next 的可观测定义字段完全等价的唯一候选。
 * 旧词条 key 是 skill1..3，原生 key 是 attrIndex，因此只比较有序贡献而不比较标签。
 */
function hasSameFormalShape(canonical: GearDefinition, legacy: GearDefinition): boolean {
  const canonicalTraits = canonical.traits.filter(trait => (trait.modifiers?.length ?? 0) > 0);
  const legacyTraits = legacy.traits.filter(trait => (trait.modifiers?.length ?? 0) > 0);
  if (
    canonical.slotType !== legacy.slotType ||
    canonical.levelRequirement !== legacy.levelRequirement ||
    canonical.baseDefense !== legacy.baseDefense ||
    canonicalTraits.length !== legacyTraits.length
  ) {
    return false;
  }
  return canonicalTraits.every((trait, traitIndex) => {
    const previous = legacyTraits[traitIndex]!;
    const currentModifiers = trait.modifiers ?? [];
    const previousModifiers = previous.modifiers ?? [];
    return (
      trait.levelCount === previous.levelCount &&
      currentModifiers.length === previousModifiers.length &&
      currentModifiers.every((modifier, modifierIndex) => {
        const current = modifierProjection(modifier, trait.levelCount);
        const old = modifierProjection(previousModifiers[modifierIndex]!, previous.levelCount);
        return (
          current.identity === old.identity &&
          current.values.every((value, index) => Math.abs(value - old.values[index]!) <= 0.00051)
        );
      })
    );
  });
}

function modifierProjection(
  modifier: NonNullable<GearDefinition['traits'][number]['modifiers']>[number],
  levelCount: number,
): { readonly identity: string; readonly values: readonly number[] } {
  let identity: string;
  switch (modifier.kind) {
    case 'attribute':
      identity = `attribute:${modifier.attribute}:${modifier.operation}`;
      break;
    case 'panelStat':
      identity = `panelStat:${modifier.stat}`;
      break;
    case 'damageScale':
      identity = `damageScale:${modifier.target}`;
      break;
    case 'staticHealingIncrease':
      identity = `staticHealingIncrease:${modifier.target}`;
      break;
    case 'skillCooldownMultiplier':
      identity = `skillCooldownMultiplier:${JSON.stringify(modifier.skillTypes)}`;
      break;
    case 'damageBonus': {
      const skillTypes = Array.isArray(modifier.skillTypes)
        ? modifier.skillTypes
        : modifier.skillTypes === undefined
          ? []
          : [modifier.skillTypes];
      identity =
        skillTypes.length === 1
          ? `damageScale:${skillTypes[0]}`
          : `damageBonus:${JSON.stringify(modifier.damageTypes)}:${JSON.stringify(skillTypes)}`;
      break;
    }
  }
  const values = Array.isArray(modifier.value)
    ? modifier.value
    : Array.from({ length: levelCount }, () => modifier.value as number);
  return { identity, values };
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
