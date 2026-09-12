import type { ScenarioDocument } from '../../core/project/schema';
import type { PublishedOperatorMetadata } from './publishedOperatorMetadata';

/** 冻结本次发布的武器显示身份；后续模板编辑不能改变旧结果的来源。 */
export function capturePublishedWeaponSources(
  weapons: readonly {
    slug: string;
    assetSlug?: string;
    displayName?: string;
    iconPath?: string;
  }[],
): ReadonlyMap<string, PublishedBuffSource> {
  return new Map(
    weapons.map(weapon => [
      weapon.slug,
      {
        kind: 'weapon' as const,
        slug: weapon.assetSlug ?? weapon.slug,
        ...(weapon.displayName === undefined ? {} : { name: weapon.displayName }),
        ...(weapon.iconPath === undefined ? {} : { iconPath: weapon.iconPath }),
      },
    ]),
  );
}

export type PublishedBuffSource =
  | { kind: 'custom'; name: string }
  | { kind: 'skill'; slug: string | null; key: string; fallbackKey?: string }
  | { kind: 'weapon'; slug: string; name?: string; iconPath?: string }
  | { kind: 'gear' | 'gearSet'; slug: string }
  | { kind: 'talent' | 'potential'; slug: string; index: number };

/** 仅解释已发布身份，返回可本地化的描述，不读取当前模板。合约另用发布的 selections。 */
export function resolvePublishedBuffSource(
  source: { sourceActionId?: string; sourceId?: string },
  scenario: ScenarioDocument | undefined,
  operators: ReadonlyMap<string, PublishedOperatorMetadata>,
  weapons: ReadonlyMap<string, PublishedBuffSource> = new Map(),
): PublishedBuffSource | undefined {
  const id = source.sourceActionId;
  if (id === undefined || scenario === undefined) return undefined;
  for (const track of scenario.tracks) {
    const cast = track?.skillCasts.find(cast => cast.id === id);
    if (cast === undefined) continue;
    if (cast.source.kind === 'custom') return { kind: 'custom', name: cast.source.name };
    const slug = track?.operator?.operatorSlug;
    return {
      kind: 'skill',
      slug: slug === undefined ? null : (operators.get(slug)?.assetSlug ?? slug),
      key: cast.source.skillKey,
      ...(slug !== undefined &&
      operators.get(slug)?.skillLevelSources?.[cast.source.skillKey] !== undefined
        ? { fallbackKey: operators.get(slug)!.skillLevelSources![cast.source.skillKey]! }
        : {}),
    };
  }
  const equipment =
    /^(?:equipment:|upgrade-initialization:)(weaponTrait|gearTrait|gearSet|weapon-trait|gear-trait|gear-set):([^:]+)/.exec(
      id,
    );
  if (equipment?.[1]?.startsWith('weapon') && weapons.has(equipment[2]!))
    return weapons.get(equipment[2]!);
  if (equipment)
    return {
      kind: equipment[1]!.startsWith('weapon')
        ? 'weapon'
        : equipment[1]!.startsWith('gearT') || equipment[1]!.startsWith('gear-t')
          ? 'gear'
          : 'gearSet',
      slug: equipment[2]!,
    };
  const slug = scenario.tracks.find(track => track?.id === source.sourceId)?.operator?.operatorSlug;
  const metadata = slug === undefined ? undefined : operators.get(slug);
  if (!metadata) return undefined;
  const initialization = /^upgrade-initialization:(talent|potential):(\d+)$/.exec(id);
  const passive = id.startsWith('passive:') ? id.slice('passive:'.length) : undefined;
  for (const kind of ['talent', 'potential'] as const) {
    const values = kind === 'talent' ? metadata.talents : metadata.potentials;
    const index = values.findIndex(
      (value, slot) =>
        (initialization?.[1] === kind && slot === Number(initialization[2])) ||
        (passive !== undefined && value.passiveKeys.includes(passive)),
    );
    if (index >= 0)
      return {
        kind,
        slug: metadata.assetSlug,
        index:
          kind === 'talent'
            ? values.slice(0, index).reduce((sum, value) => sum + value.levels, 0)
            : index,
      };
  }
  return metadata.skillKeys.includes(id)
    ? {
        kind: 'skill',
        slug: metadata.assetSlug,
        key: id,
        ...(metadata.skillLevelSources?.[id] === undefined
          ? {}
          : { fallbackKey: metadata.skillLevelSources[id] }),
      }
    : undefined;
}
