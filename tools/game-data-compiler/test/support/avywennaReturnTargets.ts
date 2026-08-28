import fixture from '../fixtures/avywenna-return-targets.json';
import { GameplayTagRegistry } from '../../src/source/nativeGameplayTags.ts';
import { compileAbilityEntityTemplateCatalogSource } from '../../src/compiler/abilityEntityCatalog.ts';
import { compileCombatActionSequenceSource } from '../../src/compiler/buffRuntimeProjection.ts';
import { parseReturnSequence } from './avywennaReturnProjection.ts';

export const returnTargetFixture = fixture;
export const returnTargetContext = {
  actionOwnerTarget: 'caster',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'enemy',
  abilityEntityQueries: {
    catalog: compileAbilityEntityTemplateCatalogSource(
      Object.fromEntries(
        fixture.templates.map(template => [template.id, JSON.parse(template.json)]),
      ),
    ),
    // 本切片均为模板 born tag 的精确命中，无需猜测未知 ID 的祖先路径。
    gameplayTagRegistry: new GameplayTagRegistry([]),
  },
} as const;

/** 有界源切片：真实查找/数量/黑板/逐枪距离/回收 Buff；不包含后续位置与投射物发射。 */
export function makeReturnTargetProjection(
  index: number,
  raw: unknown = fixture.timelines[index]!.sequence,
) {
  return compileCombatActionSequenceSource(
    parseReturnSequence(raw, fixture.timelines[index]!.sourcePath),
    returnTargetContext,
  );
}
