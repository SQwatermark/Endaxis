/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { electricBasicAttack, percentages, scheduled, sequence, step } from '../definitionHelpers';

// prettier-ignore
export const perlicaGeneratedSkills = [
  electricBasicAttack(
    'basicAttack1',
    16,
    8,
    percentages([25, 28, 31, 33, 36, 38, 41, 43, 46, 49, 53, 57]),
  ),
  electricBasicAttack(
    'basicAttack2',
    18,
    [9, 12],
    percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
  ),
  electricBasicAttack(
    'basicAttack3',
    26,
    [16, 19, 22],
    percentages([12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 26, 28]),
  ),
  electricBasicAttack(
    'basicAttack4',
    44,
    27,
    percentages([57, 62, 68, 73, 79, 85, 90, 96, 102, 109, 117, 127]),
    { final: true, spRecovery: 15, stagger: 15 },
  ),
  {
    key: 'finisher',
    timelineBlockFrames: 35,
    availability: { kind: 'targetStaggered', target: 'enemy' },
    scheduledSequences: [
      scheduled(
        35,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['normalAttack', 'powerAttack'],
            calculation: 'breakingAttack',
          }),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
      ),
    ],
  },
  {
    key: 'plungingAttack',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }),
        ),
      ),
    ],
  },
  {
    key: 'battleSkill',
    timelineBlockFrames: 28,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('applyElementalInfliction', { element: 'electric', isExtra: false }),
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([178, 196, 213, 231, 249, 267, 285, 302, 320, 342, 369, 400]),
            tags: ['normalSkill'],
            stagger: 10,
          }),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    key: 'ultimate',
    timelineBlockFrames: 63,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        58,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([445, 489, 534, 578, 622, 667, 711, 756, 800, 856, 923, 1000]),
            tags: ['ultimateSkill'],
            stagger: 20,
          }),
        ),
      ),
    ],
  },
] as const satisfies readonly SkillDefinition[];
