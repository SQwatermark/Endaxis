import type {
  ActionSequenceDefinition,
  LevelValues,
  OperatorDefinition,
  ScheduledSequenceDefinition,
  SkillDefinition,
} from '../../core/game-data/operatorDefinition';
import {
  basicAttackOfType,
  branch,
  damageHits,
  damageOfType,
  firstMatching,
  multiplyLevelValues,
  not,
  percentages,
  reactionActive,
  scaleDamageByStatusStacks,
  scheduled,
  secondsToFrames,
  sequence,
  statusActive,
  statusStacksExactly,
  step,
} from './definitionHelpers';

const electricDamage = damageOfType('electric');
const electricBasicAttack = basicAttackOfType('electric');

const ENHANCEMENT_STATUS = 'ultimateEnhancement';
const FREE_BATTLE_STATUS = 'freeEnhancedBattle';
const SUNDERBLADE_STATUS = 'sunderblade';
const CONSUMED_ELECTRIFICATION_STATUS = 'consumedElectrificationLevel';

const enhancementActive = statusActive(ENHANCEMENT_STATUS);
const enhancementInactive = not(enhancementActive);

function applySunderblades(stacks: number): ActionSequenceDefinition {
  return sequence(
    step('applyStatus', {
      statusKey: SUNDERBLADE_STATUS,
      target: 'caster',
      durationFrames: secondsToFrames(36),
      stacks,
      maxStacks: 9,
    }),
  );
}

function consumeElectrification(level: number): ActionSequenceDefinition {
  return sequence(
    step('applyStatus', {
      statusKey: CONSUMED_ELECTRIFICATION_STATUS,
      target: 'caster',
      durationFrames: secondsToFrames(10),
      stacks: level,
      maxStacks: 4,
    }),
    step('applyStatus', {
      statusKey: SUNDERBLADE_STATUS,
      target: 'caster',
      durationFrames: secondsToFrames(36),
      stacks: Math.min(level + 1, 3),
      maxStacks: 9,
    }),
    step('consumeElementalReaction', { reaction: 'electrification', target: 'enemy' }),
  );
}

function reactionConsumptionBranch(): ActionSequenceDefinition {
  return sequence(
    firstMatching(
      [4, 3, 2, 1].map(level => ({
        condition: reactionActive('electrification', level),
        sequence: consumeElectrification(level),
      })),
      sequence(branch(not(statusActive(SUNDERBLADE_STATUS, 'caster', 3)), applySunderblades(1))),
    ),
  );
}

function battleSetup(enhanced: boolean): ActionSequenceDefinition {
  const consumeReaction = reactionConsumptionBranch();
  const setup = enhanced
    ? sequence(
        branch(
          statusActive(FREE_BATTLE_STATUS),
          sequence(
            ...applySunderblades(3).steps,
            step('consumeStatus', { statusKey: FREE_BATTLE_STATUS, target: 'caster' }),
          ),
          consumeReaction,
        ),
      )
    : consumeReaction;

  return sequence(
    step('consumeStatus', {
      statusKey: CONSUMED_ELECTRIFICATION_STATUS,
      target: 'caster',
    }),
    ...setup.steps,
  );
}

const normalBattleScale = percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]);
const normalBattleBonus = percentages([3, 4, 4, 4, 5, 5, 5, 6, 6, 7, 8, 9]);
const enhancedBattleScale = percentages([36, 40, 43, 47, 50, 54, 58, 61, 65, 69, 75, 81]);
const enhancedBattleBonus = percentages([8, 9, 10, 11, 11, 12, 13, 14, 15, 16, 17, 18]);

function thunderDamage(scale: LevelValues, bonus: LevelValues, multiplier = 1) {
  return scaleDamageByStatusStacks(
    electricDamage(multiplyLevelValues(scale, multiplier), ['normalSkill']),
    CONSUMED_ELECTRIFICATION_STATUS,
    multiplyLevelValues(bonus, multiplier),
  );
}

function swordStrikeSequences(enhanced: boolean): ScheduledSequenceDefinition[] {
  const scale = enhanced ? enhancedBattleScale : normalBattleScale;
  const bonus = enhanced ? enhancedBattleBonus : normalBattleBonus;
  const sequences: ScheduledSequenceDefinition[] = [];

  for (let index = 0; index < 9; index += 1) {
    sequences.push(
      scheduled(
        30 + 7 * index,
        sequence(
          branch(
            statusActive(SUNDERBLADE_STATUS, 'caster', index + 1),
            sequence(
              step('dealDamage', thunderDamage(scale, bonus)),
              step('changeResource', {
                resource: 'ultimateEnergy',
                amount: 6,
                recipient: 'caster',
              }),
            ),
          ),
        ),
      ),
    );
  }

  for (let count = 1; count <= 9; count += 1) {
    const finalSteps = [];
    if (enhanced) {
      finalSteps.push(step('applyElementalInfliction', { element: 'electric', isExtra: false }));
    }
    finalSteps.push(
      step('dealDamage', {
        ...thunderDamage(scale, bonus, 6),
        stagger: 15,
      }),
    );
    if (count < 9) {
      finalSteps.push(
        step('changeResource', {
          resource: 'ultimateEnergy',
          amount: 6,
          recipient: 'caster',
        }),
      );
    }
    finalSteps.push(
      step('consumeStatus', {
        statusKey: CONSUMED_ELECTRIFICATION_STATUS,
        target: 'caster',
      }),
    );

    sequences.push(
      scheduled(
        41 + 7 * count,
        sequence(branch(statusStacksExactly(SUNDERBLADE_STATUS, count), sequence(...finalSteps))),
      ),
    );
  }

  return sequences;
}

function normalBasicAttack(
  key: string,
  timelineBlockFrames: number,
  hitFrames: number | readonly number[],
  attackScale: LevelValues,
  options: { final?: boolean; stagger?: number; spRecovery?: number } = {},
): SkillDefinition {
  return electricBasicAttack(key, timelineBlockFrames, hitFrames, attackScale, {
    availability: enhancementInactive,
    ...options,
  });
}

function enhancedBasicAttack(
  key: string,
  timelineBlockFrames: number,
  hitFrames: number | readonly number[],
  attackScale: LevelValues,
  options: { final?: boolean; stagger?: number; spRecovery?: number } = {},
): SkillDefinition {
  return electricBasicAttack(key, timelineBlockFrames, hitFrames, attackScale, {
    availability: enhancementActive,
    ...options,
  });
}

const normalBasicAttacks = [
  normalBasicAttack(
    'basicAttack1',
    15,
    [6, 8],
    percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
  ),
  normalBasicAttack(
    'basicAttack2',
    15,
    8,
    percentages([24, 26, 29, 31, 34, 36, 38, 41, 43, 46, 50, 54]),
  ),
  normalBasicAttack(
    'basicAttack3',
    26,
    [14, 14, 16, 16],
    percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
  ),
  normalBasicAttack(
    'basicAttack4',
    17,
    [11, 11, 11, 11],
    percentages([11, 12, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25]),
  ),
  normalBasicAttack(
    'basicAttack5',
    50,
    20,
    percentages([48, 53, 58, 62, 67, 72, 77, 82, 86, 92, 100, 108]),
    { final: true, stagger: 18, spRecovery: 18 },
  ),
] as const;

const enhancedBasicAttacks = [
  enhancedBasicAttack(
    'enhancedBasicAttack1',
    22,
    8,
    percentages([67, 73, 80, 86, 93, 100, 106, 113, 120, 128, 138, 150]),
  ),
  enhancedBasicAttack(
    'enhancedBasicAttack2',
    27,
    9,
    percentages([94, 103, 112, 122, 131, 140, 150, 159, 168, 180, 194, 210]),
  ),
  enhancedBasicAttack(
    'enhancedBasicAttack3',
    60,
    33,
    percentages([134, 147, 160, 174, 187, 200, 214, 227, 240, 257, 277, 300]),
    { final: true, stagger: 18, spRecovery: 20 },
  ),
] as const;

function battleSkill(key: string, enhanced: boolean): SkillDefinition {
  return {
    key,
    timelineBlockFrames: 21,
    availability: enhanced ? enhancementActive : enhancementInactive,
    costs: [{ resource: 'sp', value: 100 }],
    scheduledSequences: [scheduled(6, battleSetup(enhanced)), ...swordStrikeSequences(enhanced)],
  };
}

function comboSkill(key: string, enhanced: boolean): SkillDefinition {
  const hitFrame = enhanced ? 24 : 36;
  const scale = enhanced
    ? percentages([240, 264, 288, 312, 336, 360, 384, 408, 432, 462, 498, 540])
    : percentages([160, 176, 192, 208, 224, 240, 256, 272, 288, 308, 332, 360]);

  return {
    key,
    timelineBlockFrames: enhanced ? 36 : 42,
    availability: enhanced ? enhancementActive : enhancementInactive,
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    scheduledSequences: [
      scheduled(
        hitFrame,
        sequence(
          step('applyElementalReaction', {
            reaction: 'electrification',
            target: 'enemy',
            durationSeconds: 10,
            effectiveness: 1,
          }),
          step('dealDamage', electricDamage(scale, ['comboSkill'], { stagger: 10 })),
          step('changeResource', {
            resource: 'ultimateEnergy',
            amount: 10,
            recipient: 'caster',
          }),
        ),
      ),
    ],
  };
}

const finisher = {
  key: 'finisher',
  timelineBlockFrames: 51,
  availability: { kind: 'targetStaggered', target: 'enemy' },
  scheduledSequences: [
    scheduled(
      40,
      sequence(
        step(
          'dealDamage',
          electricDamage(
            [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
            ['normalAttack', 'powerAttack'],
            {
              calculation: 'breakingAttack',
            },
          ),
        ),
        step('gainFinisherSp', { factor: 1, recipient: 'team' }),
      ),
    ),
  ],
} as const satisfies SkillDefinition;

const plungingAttack = {
  key: 'plungingAttack',
  timelineBlockFrames: 12,
  scheduledSequences: damageHits(
    [1],
    electricDamage(
      [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
      ['normalAttack', 'plungingAttack'],
    ),
  ),
} as const satisfies SkillDefinition;

const ultimate = {
  key: 'ultimate',
  timelineBlockFrames: 84,
  cooldownFrames: 450,
  costs: [{ resource: 'ultimateEnergy', value: 240 }],
  scheduledSequences: [
    scheduled(
      80,
      sequence(
        step('applyStatus', {
          statusKey: ENHANCEMENT_STATUS,
          target: 'caster',
          durationFrames: secondsToFrames(25),
          modifiers: [
            {
              kind: 'skillCooldownMultiplier',
              skillGroupKey: 'enhancedComboSkill',
              value: 0.25,
            },
          ],
        }),
        step('applyStatus', {
          statusKey: FREE_BATTLE_STATUS,
          target: 'caster',
          durationFrames: secondsToFrames(25),
          modifiers: [{ kind: 'resourceCostMultiplier', resource: 'sp', value: 0 }],
        }),
      ),
    ),
  ],
} as const satisfies SkillDefinition;

export const zhuangFangyi: OperatorDefinition = {
  slug: 'zhuang-fangyi',
  gameId: 'ZHUANGFANGYI',
  rarity: 6,
  weaponType: 'arts-unit',
  element: 'electric',
  role: 'striker',
  mainAttribute: 'will',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [10, 29, 49, 69, 89, 99],
    agility: [10, 29, 49, 69, 89, 99],
    intellect: [17, 39, 63, 87, 111, 123],
    will: [24, 58, 94, 130, 166, 184],
    baseAttack: [30, 93, 160, 227, 293, 326],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: normalBasicAttacks,
    },
    {
      key: 'enhancedBasicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: enhancedBasicAttacks,
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: finisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: plungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: battleSkill('battleSkill', false),
    },
    {
      key: 'enhancedBattleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: battleSkill('enhancedBattleSkill', true),
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: comboSkill('comboSkill', false),
    },
    {
      key: 'enhancedComboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: comboSkill('enhancedComboSkill', true),
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: ultimate },
  ],
  comboSkillRegistrations: [
    ...['comboSkill', 'enhancedComboSkill'].map(skillKey => ({
      skillKey,
      priority: 'default' as const,
      rules: [
        {
          trigger: {
            kind: 'damageTagHit' as const,
            tag: 'normalAttackLastCombo' as const,
            scope: 'team' as const,
          },
          condition: {
            kind: 'elementalInflictionPresent' as const,
            elements: 'electric' as const,
            minimumStacks: 1,
          },
        },
        {
          trigger: {
            kind: 'damageTagHit' as const,
            tag: 'powerAttack' as const,
            scope: 'team' as const,
          },
          condition: {
            kind: 'elementalInflictionPresent' as const,
            elements: 'electric' as const,
            minimumStacks: 1,
          },
        },
      ],
    })),
  ],
  talents: [
    { key: 'progressiveElectricAmplification', levels: 2, modifiers: [] },
    { key: 'fatalDamageProtection', levels: 2, modifiers: [] },
  ],
  potentials: [
    {
      key: 'strengthenedBattleSkill',
      levels: 1,
      modifiers: [
        { kind: 'multiplySkillDamage', skillGroupKey: 'battleSkill', multiplier: 1.15 },
        { kind: 'multiplySkillDamage', skillGroupKey: 'enhancedBattleSkill', multiplier: 1.15 },
      ],
    },
    {
      key: 'willAndBattleSkillDamage',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['will'], value: 20 },
        { kind: 'addStaticDamageIncrease', target: 'battleSkill', value: 0.15 },
      ],
    },
    { key: 'reactionConsumptionRecovery', levels: 1, modifiers: [] },
    {
      key: 'reducedUltimateCost',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
      ],
    },
    { key: 'enhancedElectricResistanceIgnore', levels: 1, modifiers: [] },
  ],
  conversionSupport: {
    completeness: 'partial',
    missingCapabilities: [{ capability: 'talentEffects' }, { capability: 'potentialEffects' }],
  },
};
