/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition } from '../../../core/game-data/operatorDefinition';
import { sequence, step } from '../definitionHelpers';
import { perlicaGeneratedSkills } from './perlica.skills.generated';

export const perlicaGeneratedOperator = {
  slug: 'perlica',
  gameId: 'PERLICA',
  rarity: 5,
  weaponType: 'arts-unit',
  element: 'electric',
  role: 'caster',
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
  attributes: {
    strength: [9, 26, 45, 64, 82, 91],
    agility: [9, 27, 46, 65, 84, 93],
    intellect: [21, 51, 83, 114, 145, 161],
    will: [13, 34, 57, 79, 102, 113],
    baseAttack: [30, 88, 150, 211, 272, 303],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [perlicaGeneratedSkills[0]!, perlicaGeneratedSkills[1]!, perlicaGeneratedSkills[2]!, perlicaGeneratedSkills[3]!] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: perlicaGeneratedSkills[4]! },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: perlicaGeneratedSkills[5]! },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: perlicaGeneratedSkills[6]! },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: perlicaGeneratedSkills[7]! },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: perlicaGeneratedSkills[8]! },
  ],
  talents: [
    { key: 'staggerDamageBonus', levels: 2, modifiers: [{ kind: 'addConditionalDamage', condition: { kind: 'targetStaggered', target: 'enemy' }, values: [0.2, 0.3] }] },
    { key: 'comboRicochetAgainstBrokenEnemy', levels: 1, modifiers: [] },
  ],
  potentials: [
    { key: 'extendedElectrification', levels: 1, modifiers: [{ kind: 'multiplyEffectDuration', skillGroupKey: 'comboSkill', stepKey: 'comboSkill.electrification', multiplier: 1.75 }] },
    { key: 'reducedUltimateCost', levels: 1, modifiers: [{ kind: 'multiplySkillCost', skillGroupKey: 'ultimate', resource: 'ultimateEnergy', multiplier: 0.85 }] },
    { key: 'attackAfterElectrification', levels: 1, eventHandlers: [{ event: { kind: 'reactionApplied', reaction: 'electrification' }, sequence: sequence(step('applyStatus', { statusKey: 'attackAfterElectrification', target: 'caster', durationFrames: 150, maxStacks: 2, modifiers: [{ kind: 'attackPercent', value: 0.2 }] })) }] },
    { key: 'strongerElectrification', levels: 1, modifiers: [{ kind: 'setEffectiveness', skillGroupKey: 'comboSkill', stepKey: 'comboSkill.electrification', value: 1.33 }] },
    { key: 'ultimateCriticalRate', levels: 1, modifiers: [{ kind: 'addSkillStat', skillGroupKey: 'ultimate', stat: 'criticalRate', value: 0.3 }] },
  ],
} as const satisfies OperatorDefinition;
