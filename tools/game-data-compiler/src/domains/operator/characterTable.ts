import {
  projectPrimaryAttributeKey,
  type AttributeTypeSource,
  type ProjectedPrimaryAttributeSource,
} from '../../compiler/attributeModifier.ts';
import { projectWeaponType, type ProjectedWeaponTypeSource } from '../../compiler/weaponType.ts';
import {
  projectNativeDamageElement,
  type ProjectedDamageElementSource,
} from '../../source/damageElement.ts';
import {
  parseNativeOperatorCharacterTableSource,
  type CharacterAttributeKeyFrameSource,
  type NativeOperatorCharacterTableSource,
  type ProfessionCategorySource,
} from '../../source/operatorCharacterTable.ts';

export type OperatorPrimaryAttributeSource = ProjectedPrimaryAttributeSource;
export type { CharacterAttributeKeyFrameSource } from '../../source/operatorCharacterTable.ts';

export type ProjectedOperatorRoleSource =
  | 'guard'
  | 'caster'
  | 'defender'
  | 'vanguard'
  | 'supporter'
  | 'striker';

export type ProjectedOperatorRaritySource = 4 | 5 | 6;

export interface OperatorCharacterTableSource extends NativeOperatorCharacterTableSource {
  readonly mainAttribute: OperatorPrimaryAttributeSource;
  readonly secondaryAttribute: OperatorPrimaryAttributeSource;
  readonly weaponType: ProjectedWeaponTypeSource;
  readonly element: ProjectedDamageElementSource;
  readonly role: ProjectedOperatorRoleSource;
  readonly projectedRarity: ProjectedOperatorRaritySource;
}

export interface OperatorPanelMilestoneSource {
  readonly level: number;
  readonly breakStage: number;
}

export interface CompiledOperatorAttributeGrowthSource {
  readonly strength: readonly number[];
  readonly agility: readonly number[];
  readonly intellect: readonly number[];
  readonly will: readonly number[];
  readonly baseAttack: readonly number[];
  readonly baseHealth: readonly number[];
}

export const STANDARD_OPERATOR_PANEL_MILESTONES: readonly OperatorPanelMilestoneSource[] = [
  { level: 1, breakStage: 0 },
  { level: 20, breakStage: 0 },
  { level: 40, breakStage: 1 },
  { level: 60, breakStage: 2 },
  { level: 80, breakStage: 3 },
  { level: 90, breakStage: 4 },
];

/** 来源层读取原生身份；领域层只调用公共投影，不再解释 AttributeType 数值。 */
export function parseOperatorCharacterTableSource(
  characterTableValue: unknown,
  characterId: string,
  attributeDefaults: Readonly<Partial<Record<AttributeTypeSource, number>>> = {},
  sourceName = 'CharacterTable',
): OperatorCharacterTableSource {
  const source = parseNativeOperatorCharacterTableSource(
    characterTableValue,
    characterId,
    attributeDefaults,
    sourceName,
  );
  return {
    ...source,
    mainAttribute: requirePrimaryAttribute(
      source.mainAttributeType,
      `${source.sourcePath}.mainAttrType`,
    ),
    secondaryAttribute: requirePrimaryAttribute(
      source.secondaryAttributeType,
      `${source.sourcePath}.subAttrType`,
    ),
    weaponType: projectWeaponType(source.nativeWeaponType, `${source.sourcePath}.weaponType`),
    element: projectNativeDamageElement(
      source.characterTypeId,
      `${source.sourcePath}.charTypeId`,
    ),
    role: projectOperatorRole(source.profession, `${source.sourcePath}.profession`),
    projectedRarity: projectOperatorRarity(source.rarity, `${source.sourcePath}.rarity`),
  };
}

function projectOperatorRole(
  profession: ProfessionCategorySource,
  path: string,
): ProjectedOperatorRoleSource {
  const result = PROJECTED_OPERATOR_ROLES[profession];
  if (result === undefined) {
    throw new Error(`${path}: ProfessionCategory ${profession} has no supported Next projection`);
  }
  return result;
}

function projectOperatorRarity(rarity: number, path: string): ProjectedOperatorRaritySource {
  if (rarity !== 4 && rarity !== 5 && rarity !== 6) {
    throw new Error(`${path}: rarity ${rarity} has no supported Next projection`);
  }
  return rarity;
}

const PROJECTED_OPERATOR_ROLES: Readonly<
  Partial<Record<ProfessionCategorySource, ProjectedOperatorRoleSource>>
> = {
  GUARD: 'guard',
  DEFENDER: 'defender',
  SUPPORTER: 'supporter',
  CASTER: 'caster',
  VANGUARD: 'vanguard',
  ASSAULT: 'striker',
};

/** 按原生列表顺序寻找精确关键帧；缺失时不插值、不寻找相邻等级。 */
export function findExactCharacterAttributeKeyFrame(
  character: OperatorCharacterTableSource,
  level: number,
  breakStage: number,
): CharacterAttributeKeyFrameSource | null {
  return (
    character.attributeKeyFrames.find(
      frame => frame.level === level && frame.breakStage === breakStage,
    ) ?? null
  );
}

/** 将显式选择的原生关键帧投影为 Next OperatorDefinition.attributes。 */
export function compileOperatorAttributeGrowthSource(
  character: OperatorCharacterTableSource,
  milestones: readonly OperatorPanelMilestoneSource[],
): CompiledOperatorAttributeGrowthSource {
  const frames = milestones.map(({ level, breakStage }) => {
    const frame = findExactCharacterAttributeKeyFrame(character, level, breakStage);
    if (frame === null) {
      throw new Error(
        `${character.sourcePath}.attributes: missing exact panel key frame (${level}, ${breakStage})`,
      );
    }
    return frame;
  });
  return {
    strength: projectPanelAttribute(frames, 'Str'),
    agility: projectPanelAttribute(frames, 'Agi'),
    intellect: projectPanelAttribute(frames, 'Wisd'),
    will: projectPanelAttribute(frames, 'Will'),
    baseAttack: projectPanelAttribute(frames, 'Atk'),
    baseHealth: projectPanelAttribute(frames, 'MaxHp'),
  };
}

function requirePrimaryAttribute(
  attribute: AttributeTypeSource,
  path: string,
): OperatorPrimaryAttributeSource {
  const result = projectPrimaryAttributeKey(attribute);
  if (result === null) throw new Error(`${path}: ${attribute} is not a primary attribute`);
  return result;
}

function projectPanelAttribute(
  frames: readonly CharacterAttributeKeyFrameSource[],
  attributeType: AttributeTypeSource,
): number[] {
  return frames.map(frame => {
    const value = frame.attributes[attributeType];
    if (value === undefined) {
      throw new Error(`${frame.sourcePath}: missing panel attribute ${attributeType}`);
    }
    return Math.trunc(value);
  });
}
