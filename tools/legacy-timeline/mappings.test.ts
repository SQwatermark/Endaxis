import { expect, it } from 'vitest';
import mappings from './mappings.2026-08-31.json';
import { gameDataRepository } from '../../src/data/gameDataRepository';
import { legacySkillIdentity } from './sourcePreparation';

it('keeps reviewed weapon and gear identities resolvable in the current repository', () => {
  for (const [gameId, id] of Object.entries(mappings.enemies))
    expect(gameDataRepository.getEnemy(id)?.gameId).toBe(gameId);
  for (const id of Object.values(mappings.operators))
    expect(gameDataRepository.getOperator(id), id).not.toBeNull();
  for (const id of Object.values(mappings.weapons))
    expect(gameDataRepository.getWeapon(id), id).not.toBeNull();
  for (const id of Object.values(mappings.gears))
    expect(gameDataRepository.getGear(id), id).not.toBeNull();
  // 共享图标不等于同一装备；T1 手套不能落到基础款。
  expect(mappings.gears['eternal-xiranite-gloves-t1']).toBe('item_equip_t4_suit_usp02_hand_02');
});
it('keeps each reviewed skill mapping unique and points to an existing group member', () => {
  for (const [slug, rules] of Object.entries(mappings.skills)) {
    const definition = gameDataRepository.getOperator(slug)!;
    const keys = rules.map(rule => JSON.stringify(legacySkillIdentity(rule.source)));
    expect(new Set(keys).size).toBe(keys.length);
    for (const { target } of rules) {
      const group = definition.skillGroups.find(group => group.key === target.skillGroupKey)!;
      expect(group, slug + '/' + target.skillGroupKey).toBeDefined();
      const skills = [
        ...(Array.isArray(group.skills) ? group.skills : [group.skills]),
        ...(group.replacementSkills ?? []),
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
});
