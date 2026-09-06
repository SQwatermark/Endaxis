import type { ScenarioDocument } from '../../core/project/schema';
import type { PublishedOperatorMetadata } from './publishedOperatorMetadata';

export type PublishedBuffSource =
  | { kind: 'custom'; name: string }
  | { kind: 'skill'; slug: string | null; key: string }
  | { kind: 'weapon' | 'gear' | 'gearSet'; slug: string }
  | { kind: 'talent' | 'potential'; slug: string; index: number };

/** 仅解释已发布身份，返回可本地化的描述，不读取当前模板。合约另用发布的 selections。 */
export function resolvePublishedBuffSource(
  source: { sourceActionId?: string; sourceId?: string },
  scenario: ScenarioDocument | undefined,
  operators: ReadonlyMap<string, PublishedOperatorMetadata>,
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
    };
  }
  const equipment =
    /^(?:equipment:|upgrade-initialization:)(weaponTrait|gearTrait|gearSet|weapon-trait|gear-trait|gear-set):([^:]+)/.exec(
      id,
    );
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
  const initialization = /^upgrade-initialization:(talent|potential):([^:]+)$/.exec(id);
  const passive = id.startsWith('passive:') ? id.slice('passive:'.length) : undefined;
  for (const kind of ['talent', 'potential'] as const) {
    const values = kind === 'talent' ? metadata.talents : metadata.potentials;
    const index = values.findIndex(
      value =>
        (initialization?.[1] === kind && value.key === initialization[2]) ||
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
    ? { kind: 'skill', slug: metadata.assetSlug, key: id }
    : undefined;
}
