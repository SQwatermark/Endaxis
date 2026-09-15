import { expect, it } from 'vitest';
import mappings from './mappings.2026-08-31.json';
import { gameDataRepository } from '../../src/data/gameDataRepository';
import { legacySkillIdentity } from './sourcePreparation';

it('contains the complete one-time mapping catalog for the legacy data snapshot', () => {
  expect(Object.keys(mappings.operators)).toHaveLength(30);
  expect(Object.keys(mappings.weapons)).toHaveLength(77);
  expect(Object.keys(mappings.gears)).toHaveLength(243);
  expect(Object.keys(mappings.enemies)).toHaveLength(82);
  expect(Object.values(mappings.skills).reduce((sum, rules) => sum + rules.length, 0)).toBe(300);

  // 旧版把伊冯整套强化普攻保存成一个技能块；新版是可递归分叉的技能序列，不能映射到某一段。
  expect(
    mappings.skills.yvonne.some(rule => rule.source.sourceSkillKey === 'enhancedBasicAttack'),
  ).toBe(true);
  expect(
    Object.values(mappings.skills).every(rules =>
      rules
        .filter(rule => rule.source.sourceSkillKey === 'dive')
        .every(
          rule =>
            rule.target.skillGroupKey === 'plungingAttack' &&
            rule.target.skillKey === 'plungingAttack',
        ),
    ),
  ).toBe(true);
});

it('keeps reviewed entity identities resolvable in the current repository', () => {
  for (const id of Object.values(mappings.enemies))
    expect(gameDataRepository.getEnemy(id)?.id, id).toBe(id);
  for (const id of Object.values(mappings.operators))
    expect(gameDataRepository.getOperator(id), id).not.toBeNull();
  for (const id of Object.values(mappings.weapons))
    expect(gameDataRepository.getWeapon(id), id).not.toBeNull();
  for (const id of Object.values(mappings.gears))
    expect(gameDataRepository.getGear(id), id).not.toBeNull();
  // 共享图标不等于同一装备；T1 手套不能落到基础款。
  expect(mappings.gears['eternal-xiranite-gloves-t1']).toBe('item_equip_t4_suit_usp02_hand_02');
});
it('public sample weapon asset identities do not assume matching native ID suffixes', () => {
  for (const [slug, assetSlug] of [
    ['detonation-unit', 'wpn_artsunit_0010'],
    ['dreams-of-the-starry-beach', 'wpn_artsunit_0013'],
    ['khravengger', 'wpn_greatsword_0013'],
  ] as const) {
    expect(gameDataRepository.getWeapon(mappings.weapons[slug])?.assetSlug).toBe(assetSlug);
  }
  expect(gameDataRepository.getWeapon(mappings.weapons['delivery-guaranteed'])?.assetSlug).toBe(
    'wpn_artsunit_0011',
  );
  expect(gameDataRepository.getWeapon(mappings.weapons['rapid-ascent'])?.assetSlug).toBe(
    'wpn_sword_0011',
  );
  expect(mappings.gears['mi-security-gloves-t1']).toBe('item_equip_t4_suit_criti01_hand_04');
  expect(mappings.gears['frontiers-comm']).toBe('item_equip_t4_suit_atb01_edc_01');
  expect(mappings.gears['lynx-slab']).toBe('item_equip_t4_suit_heal01_edc_03');
});
it('keeps each reviewed skill mapping unique and points to an existing group member', () => {
  for (const [slug, rules] of Object.entries(mappings.skills)) {
    const definition = gameDataRepository.getOperator(slug)!;
    const keys = rules.map(rule => JSON.stringify(legacySkillIdentity(rule.source)));
    expect(new Set(keys).size).toBe(keys.length);
    for (const { target } of rules) {
      const group = definition.skillGroups.find(group => group.key === target.skillGroupKey)!;
      expect(group, slug + '/' + target.skillGroupKey).toBeDefined();
      if (!('skillKey' in target)) {
        const variantKey = 'variantKey' in target ? target.variantKey : undefined;
        const variant = group.variants?.find(candidate => candidate.key === variantKey);
        expect(variant, slug + '/' + variantKey).toBeDefined();
        expect(variant?.placementPolicy?.kind, slug + '/' + variantKey).toBe('recursiveInput');
        continue;
      }
      const skills = [
        ...(Array.isArray(group.skills) ? group.skills : [group.skills]),
        ...(group.replacementSkills ?? []),
        ...(group.variants ?? []).flatMap(variant =>
          Array.isArray(variant.skills) ? variant.skills : [variant.skills],
        ),
      ];
      expect(
        skills.some(skill => skill.key === target.skillKey),
        slug + '/' + target.skillKey,
      ).toBe(true);
    }
  }
  expect(
    mappings.skills.rossi
      .filter(r => r.source.sourceSkillKey === 'comboSkill')
      .map(r => r.target.skillKey),
  ).toEqual(['comboSkill2', 'comboSkill3']);
  expect(
    mappings.skills.mifu
      .filter(r => r.source.sourceSkillKey === 'battleSkill')
      .map(r => r.target.skillKey),
  ).toEqual(['battleSkill1', 'battleSkill2', 'battleSkill3']);
  expect(
    mappings.skills['last-rite']
      .filter(r => r.source.sourceSkillKey === 'basicAttack')
      .map(r => r.target.skillKey),
  ).toEqual(['basicAttack1', 'basicAttack2', 'basicAttack3', 'basicAttack4']);
  expect(mappings.skills.camille.find(r => r.source.sourceSkillKey === 'ultimate')?.target).toEqual(
    { kind: 'operatorSkill', skillGroupKey: 'ultimate', skillKey: 'ultimate' },
  );
});
