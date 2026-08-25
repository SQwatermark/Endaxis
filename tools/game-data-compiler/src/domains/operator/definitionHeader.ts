import type { ProjectedDamageElementSource } from '../../source/damageElement.ts';
import type { ProjectedWeaponTypeSource } from '../../compiler/weaponType.ts';
import type {
  CompiledOperatorAttributeGrowthSource,
  OperatorPrimaryAttributeSource,
  ProjectedOperatorRaritySource,
  ProjectedOperatorRoleSource,
} from './characterTable.ts';
import type { OperatorSourceClosure } from './sourceClosure.ts';
import type { CompiledTrustAttributeBonusSource } from './talentNodes.ts';

/**
 * 已能无损写入 OperatorDefinition 的静态头部。
 * slug/gameId 是 Endaxis 产品身份，不从 CharacterTable 的显示字段猜测；技能与养成行为也由后续
 * 专用编译阶段装配。因此该结构不能单独注册为完整干员定义。
 */
export interface CompiledOperatorDefinitionHeaderSource {
  readonly sourceCharacterId: string;
  readonly rarity: ProjectedOperatorRaritySource;
  readonly weaponType: ProjectedWeaponTypeSource;
  readonly element: ProjectedDamageElementSource;
  readonly role: ProjectedOperatorRoleSource;
  readonly mainAttribute: OperatorPrimaryAttributeSource;
  readonly secondaryAttribute: OperatorPrimaryAttributeSource;
  readonly attributes: CompiledOperatorAttributeGrowthSource;
  readonly trustAttributeBonus?: CompiledTrustAttributeBonusSource;
}

/** 从同一个严格 Operator 来源闭包组装正式定义头部，不重新读取原始表。 */
export function compileOperatorDefinitionHeaderSource(
  closure: OperatorSourceClosure,
): CompiledOperatorDefinitionHeaderSource {
  const { character } = closure;
  return {
    sourceCharacterId: character.characterId,
    rarity: character.projectedRarity,
    weaponType: character.weaponType,
    element: character.element,
    role: character.role,
    mainAttribute: character.mainAttribute,
    secondaryAttribute: character.secondaryAttribute,
    attributes: closure.attributeGrowth,
    ...(closure.progression.trustAttributeBonus === null
      ? {}
      : { trustAttributeBonus: closure.progression.trustAttributeBonus }),
  };
}
