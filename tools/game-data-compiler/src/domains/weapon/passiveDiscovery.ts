import type { PassiveSkillCompileRequestSource } from '../passiveDiscovery.ts';
import {
  requireArray,
  requireExactFields,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireRecord,
  requireString,
} from '../../source/primitives.ts';

const WEAPON_FIELDS = new Set([
  'breakthroughTemplateId',
  'engName',
  'levelTemplateId',
  'maxLv',
  'modelPath',
  'potentialUpItemList',
  'rarity',
  'talentTemplateId',
  'weaponDesc',
  'weaponId',
  'weaponPotentialSkill',
  'weaponSkillList',
  'weaponType',
]);

/** 武器只负责发现 CardSkill 及其等级来源；SkillData 行为仍进入公共被动编译器。 */
export function discoverWeaponPassiveSkillRequests(
  value: unknown,
  weaponIds: readonly string[],
  sourceName = 'WeaponBasicTable',
): PassiveSkillCompileRequestSource[] {
  const table = requireRecord(value, sourceName);
  const output: PassiveSkillCompileRequestSource[] = [];
  for (const weaponId of weaponIds) {
    const rowPath = `${sourceName}.${weaponId}`;
    const row = requireRecord(table[weaponId], rowPath);
    requireExactFields(row, WEAPON_FIELDS, rowPath);
    const embeddedId = requireNonEmptyString(row.weaponId, `${rowPath}.weaponId`);
    if (embeddedId !== weaponId) {
      throw new Error(`${rowPath}.weaponId: expected ${JSON.stringify(weaponId)}`);
    }
    const breakthroughTemplateId = requireNonEmptyString(
      row.breakthroughTemplateId,
      `${rowPath}.breakthroughTemplateId`,
    );
    const talentTemplateId = requireNonEmptyString(
      row.talentTemplateId,
      `${rowPath}.talentTemplateId`,
    );
    requireNonEmptyString(row.levelTemplateId, `${rowPath}.levelTemplateId`);
    requireNonNegativeInteger(row.maxLv, `${rowPath}.maxLv`);
    requireNonNegativeInteger(row.rarity, `${rowPath}.rarity`);
    requireNonNegativeInteger(row.weaponType, `${rowPath}.weaponType`);
    requireString(row.weaponPotentialSkill, `${rowPath}.weaponPotentialSkill`);
    requireString(row.modelPath, `${rowPath}.modelPath`);
    requireArray(row.potentialUpItemList, `${rowPath}.potentialUpItemList`);
    requireRecord(row.engName, `${rowPath}.engName`);
    requireRecord(row.weaponDesc, `${rowPath}.weaponDesc`);

    requireArray(row.weaponSkillList, `${rowPath}.weaponSkillList`).forEach(
      (rawSkillId, slotIndex) => {
        const skillPath = `${rowPath}.weaponSkillList[${slotIndex}]`;
        output.push({
          originKind: 'weapon',
          originId: weaponId,
          sourcePath: skillPath,
          skillId: requireNonEmptyString(rawSkillId, skillPath),
          levelSource: {
            kind: 'weaponProgression',
            slotIndex,
            breakthroughTemplateId,
            talentTemplateId,
          },
          inputBlackboard: {},
        });
      },
    );
  }
  return output;
}
