import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import type { ScenarioDocument } from '../../core/project/schema';
import type { TimelineOperatorIndex } from './timelineEditorViewModel';

/** 结果来源显示所需的最小事实，不复制技能树或模拟状态。 */
export interface PublishedOperatorMetadata {
  readonly slug: string;
  readonly assetSlug: string;
  readonly displayName: string | undefined;
  readonly talents: readonly PublishedUpgradeMetadata[];
  readonly potentials: readonly PublishedUpgradeMetadata[];
  readonly skillKeys: readonly string[];
}

type PublishedUpgradeMetadata = Pick<OperatorDefinition['talents'][number], 'key' | 'levels'> & {
  readonly passiveKeys: readonly string[];
};

export function capturePublishedOperatorMetadata(
  scenario: ScenarioDocument,
  index: TimelineOperatorIndex,
): ReadonlyMap<string, PublishedOperatorMetadata> {
  const result = new Map<string, PublishedOperatorMetadata>();
  for (const track of scenario.tracks) {
    const slug = track?.operator?.operatorSlug;
    if (slug === undefined || result.has(slug)) continue;
    const definition = index.getOperator(slug);
    if (definition === null) continue;
    result.set(slug, {
      slug: definition.slug,
      assetSlug: definition.assetSlug ?? slug,
      displayName: definition.displayName,
      talents: definition.talents.map(({ key, levels, passiveSkills }) => ({
        key,
        levels,
        passiveKeys: (passiveSkills ?? []).map(skill => skill.key),
      })),
      potentials: definition.potentials.map(({ key, levels, passiveSkills }) => ({
        key,
        levels,
        passiveKeys: (passiveSkills ?? []).map(skill => skill.key),
      })),
      skillKeys: definition.skillGroups.flatMap(group =>
        (Array.isArray(group.skills) ? group.skills : [group.skills]).map(skill => skill.key),
      ),
    });
  }
  return result;
}
