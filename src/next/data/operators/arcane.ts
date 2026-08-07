import type {
  CombatCondition,
  OperatorDefinition,
  OperatorEventHandlerDefinition,
  ScheduledSequenceDefinition,
  SkillDefinition,
  SkillPresentationVariantDefinition,
} from '../../core/game-data/operatorDefinition';
import {
  basicAttackOfType,
  branch,
  damageOfType,
  percentages,
  scheduled,
  sequence,
  statusActive,
  step,
} from './definitionHelpers';

const natureDamage = damageOfType('nature');
const natureBasicAttack = basicAttackOfType('nature');

const ARCANE_FORM_FLAG = 'arcaneForm';
const ARCANE_FORM = {
  intellect: 'intellect',
  will: 'will',
} as const;
type ArcaneForm = (typeof ARCANE_FORM)[keyof typeof ARCANE_FORM];

const intellectFormCondition = {
  kind: 'deckAttributeCompare',
  left: 'intellect',
  operator: 'greaterOrEqual',
  right: 'will',
} as const satisfies CombatCondition;

const willFormCondition = {
  kind: 'deckAttributeCompare',
  left: 'intellect',
  operator: 'less',
  right: 'will',
} as const satisfies CombatCondition;

const arcanePresentationVariants = [
  { key: ARCANE_FORM.intellect, condition: intellectFormCondition },
  { key: ARCANE_FORM.will, condition: willFormCondition },
] as const satisfies readonly SkillPresentationVariantDefinition[];

function arcaneFormEquals(form: ArcaneForm): CombatCondition {
  return { kind: 'contextFlagEquals', flag: ARCANE_FORM_FLAG, value: form };
}

const arcaneFormEventHandler = {
  key: 'refreshArcaneForm',
  event: 'deckAttributesChanged',
  sequence: sequence(
    branch(
      intellectFormCondition,
      sequence(
        step('setContextFlag', {
          flag: ARCANE_FORM_FLAG,
          value: ARCANE_FORM.intellect,
          target: 'caster',
        }),
      ),
      sequence(
        step('setContextFlag', {
          flag: ARCANE_FORM_FLAG,
          value: ARCANE_FORM.will,
          target: 'caster',
        }),
      ),
    ),
  ),
} as const satisfies OperatorEventHandlerDefinition;

const formIsIntellect = arcaneFormEquals(ARCANE_FORM.intellect);
const formIsWill = arcaneFormEquals(ARCANE_FORM.will);
const arrayActive = statusActive('gloompurgerArray');
const clusterStrikeAvailable = statusActive('clusterStrikeCounter');
const arcanaReady = statusActive('gloompurgeArcanaReady');
const imprisonmentActive = statusActive('imprisonment', 'enemy');

const basicAttack1 = natureBasicAttack(
  'basicAttack1',
  30,
  [10, 10, 10],
  percentages([6.2, 6.9, 7.5, 8.1, 8.7, 9.4, 10, 10.6, 11.2, 12, 12.9, 14]),
);

const basicAttack2 = natureBasicAttack(
  'basicAttack2',
  30,
  [11, 12, 13],
  percentages([7.1, 7.8, 8.5, 9.2, 9.9, 10.7, 11.4, 12.1, 12.8, 13.7, 14.7, 16]),
);

const basicAttack3 = natureBasicAttack(
  'basicAttack3',
  30,
  [5, 13],
  percentages([17, 18, 20, 22, 23, 25, 27, 28, 30, 32, 35, 38]),
);

const basicAttack4 = natureBasicAttack(
  'basicAttack4',
  26,
  [2, 2, 5, 5, 8, 8, 11, 11],
  percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
);

const basicAttack5 = natureBasicAttack(
  'basicAttack5',
  41,
  22,
  percentages([47, 52, 56, 61, 66, 71, 75, 80, 85, 90, 98, 106]),
  { final: true, stagger: 17, spRecovery: 17, lastHitEndFrame: 25 },
);

const finisher = {
  key: 'finisher',
  timelineBlockFrames: 51,
  availability: { kind: 'targetStaggered', target: 'enemy' },
  scheduledSequences: [
    scheduled(
      36,
      sequence(
        step('dealDamage', {
          ...natureDamage(
            [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
            ['normalAttack', 'powerAttack'],
            { calculation: 'breakingAttack' },
          ),
        }),
        step('gainFinisherSp', { factor: 1, recipient: 'team' }),
      ),
      39,
    ),
  ],
} satisfies SkillDefinition;

const plungingAttack = {
  key: 'plungingAttack',
  timelineBlockFrames: 12,
  scheduledSequences: [
    scheduled(
      1,
      sequence(
        step(
          'dealDamage',
          natureDamage(
            [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
            ['normalAttack', 'plungingAttack'],
          ),
        ),
      ),
      6,
    ),
  ],
} satisfies SkillDefinition;

const battleSkill = {
  key: 'battleSkill',
  timelineBlockFrames: 32,
  costs: [{ resource: 'sp', value: 100 }],
  scheduledSequences: [
    scheduled(
      19,
      sequence(
        step('applyElementalInfliction', { element: 'nature', isExtra: false }),
        branch(
          formIsIntellect,
          sequence(
            step(
              'dealDamage',
              natureDamage(
                [2.22, 2.45, 2.67, 2.89, 3.11, 3.33, 3.56, 3.78, 4, 4.28, 4.61, 5],
                ['normalSkill'],
                { stagger: 10 },
              ),
            ),
          ),
          sequence(
            step(
              'dealDamage',
              natureDamage(
                [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
                ['normalSkill'],
                { stagger: 10 },
              ),
            ),
          ),
        ),
        step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
      ),
    ),
  ],
} satisfies SkillDefinition;

const comboTouchScale = [0.35, 0.39, 0.42, 0.46, 0.5, 0.53, 0.57, 0.6, 0.64, 0.68, 0.73, 0.8];
const comboExplosionScale = [0.53, 0.59, 0.64, 0.69, 0.75, 0.8, 0.85, 0.91, 0.96, 1.03, 1.11, 1.2];
const comboIntellectDetonationScale = [
  2.22, 2.44, 2.66, 2.89, 3.11, 3.33, 3.55, 3.77, 4, 4.27, 4.61, 5,
];
const comboSpReturn = [28, 28, 28, 28, 28, 28, 28, 28, 28, 30, 30, 30];

const comboSkill = {
  key: 'comboSkill',
  timelineBlockFrames: 23,
  cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
  activationWindow: {
    durationFrames: 150,
    rules: [
      {
        trigger: { kind: 'elementalInflictionApplied', elements: 'nature', scope: 'team' },
        condition: formIsIntellect,
      },
      {
        trigger: {
          kind: 'elementalInflictionApplied',
          elements: ['heat', 'cryo', 'electric'],
          scope: 'team',
        },
        condition: {
          kind: 'all',
          conditions: [
            formIsIntellect,
            {
              kind: 'elementalInflictionPresent',
              elements: ['heat', 'cryo', 'electric'],
              minimumStacks: 2,
            },
          ],
        },
      },
      {
        trigger: {
          kind: 'elementalInflictionApplied',
          elements: ['heat', 'cryo', 'electric', 'nature'],
          scope: 'team',
        },
        condition: formIsWill,
      },
    ],
  },
  scheduledSequences: [
    scheduled(
      15,
      sequence(
        branch(
          formIsIntellect,
          sequence(
            step('applyStatus', {
              statusKey: 'imprisonment',
              target: 'enemy',
              durationFrames: 120,
              modifiers: [{ kind: 'slowed' }],
            }),
            step('applyStatus', {
              statusKey: 'comboSusceptibility',
              target: 'enemy',
              durationFrames: 120,
              modifiers: [{ kind: 'susceptibility', damageTypes: ['nature', 'cryo'], value: 0.04 }],
            }),
          ),
          sequence(
            step('applyStatus', {
              statusKey: 'imprisonment',
              target: 'enemy',
              durationFrames: 180,
              modifiers: [{ kind: 'slowed' }],
            }),
            step('applyStatus', {
              statusKey: 'comboSusceptibility',
              target: 'enemy',
              durationFrames: 180,
              modifiers: [
                {
                  kind: 'susceptibility',
                  damageTypes: ['nature', 'cryo'],
                  value: 0.04,
                  attributeScaling: { attribute: 'will', coefficient: 0.000125 },
                  cap: [0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.075, 0.075, 0.075, 0.08],
                },
              ],
            }),
          ),
        ),
        step('dealDamage', natureDamage(comboTouchScale, ['comboSkill'], { stagger: 5 })),
        step('changeResource', { resource: 'ultimateEnergy', amount: 10, recipient: 'caster' }),
      ),
    ),
  ],
  eventHandlers: [
    {
      key: 'detonateImprisonmentWithBattleSkill',
      event: { kind: 'skillHit', skillGroupKey: 'battleSkill', scope: 'operator' },
      condition: { kind: 'all', conditions: [formIsIntellect, imprisonmentActive] },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('consumeStatus', { statusKey: 'imprisonment', target: 'enemy' }),
            step('consumeStatus', { statusKey: 'comboSusceptibility', target: 'enemy' }),
            step(
              'changeResource',
              {
                resource: 'sp',
                amount: comboSpReturn,
                recipient: 'team',
                spGainKind: 'refund',
              },
              'comboSkill.intellectSpReturn',
            ),
            step('applyStatus', {
              statusKey: 'comboDetonationSusceptibility',
              target: 'enemy',
              durationFrames: 60,
              modifiers: [{ kind: 'susceptibility', damageTypes: ['nature', 'cryo'], value: 0.04 }],
            }),
          ),
        ),
        ...[44, 47, 50, 53, 57].map((frame, index) =>
          scheduled(
            frame,
            sequence(
              step(
                'dealDamage',
                natureDamage(
                  comboIntellectDetonationScale.map(
                    value => (value / 5) * (index === 4 ? 2.6 : 0.6),
                  ),
                  ['comboSkill'],
                  index === 4 ? { stagger: 5 } : undefined,
                ),
              ),
            ),
          ),
        ),
      ],
    },
    {
      key: 'explodeImprisonmentOnExpiry',
      event: { kind: 'statusExpired', statusKey: 'imprisonment', target: 'enemy' },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('dealDamage', natureDamage(comboExplosionScale, ['comboSkill'], { stagger: 5 })),
          ),
        ),
      ],
    },
    {
      key: 'explodeImprisonmentWhenConsumed',
      event: { kind: 'statusConsumed', statusKey: 'imprisonment', target: 'enemy' },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('dealDamage', natureDamage(comboExplosionScale, ['comboSkill'], { stagger: 5 })),
          ),
        ),
      ],
    },
  ],
} satisfies SkillDefinition;

const initialUltimateScale = [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8];
const arcanaIntellectScale = [
  6.4, 7.04, 7.68, 8.32, 8.96, 9.6, 10.24, 10.88, 11.52, 12.32, 13.28, 14.4,
];
const arcanaWillScale = [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6];
const clusterLaserScale = arcanaWillScale.map(value => value / 8);
const clusterStrikeSequences = [
  ...[12, 16, 20, 24].map(frame =>
    scheduled(
      frame,
      sequence(step('dealDamage', natureDamage(clusterLaserScale, ['ultimateSkill']))),
    ),
  ),
  scheduled(
    24,
    sequence(
      step('consumeStatus', {
        statusKey: 'clusterStrikeCounter',
        target: 'caster',
        stacks: 1,
      }),
      branch(
        { kind: 'not', condition: clusterStrikeAvailable },
        sequence(
          step('applyStatus', {
            statusKey: 'gloompurgeArcanaReady',
            target: 'caster',
            durationFrames: 600,
            modifiers: [
              { kind: 'resourceCostMultiplier', resource: 'ultimateEnergy', value: 0 },
              { kind: 'skillCooldownMultiplier', skillGroupKey: 'ultimate', value: 0 },
            ],
          }),
        ),
      ),
    ),
  ),
] satisfies readonly ScheduledSequenceDefinition[];

const ultimate = {
  key: 'ultimate',
  timelineBlockFrames: 75,
  availability: { kind: 'any', conditions: [{ kind: 'not', condition: arrayActive }, arcanaReady] },
  cooldownFrames: 600,
  costs: [{ resource: 'ultimateEnergy', value: 100 }],
  scheduledSequences: [
    scheduled(
      47,
      sequence(
        branch(
          { kind: 'not', condition: arcanaReady },
          sequence(
            step('applyStatus', {
              statusKey: 'gloompurgerArray',
              target: 'caster',
              durationFrames: 600,
              modifiers: [{ kind: 'blockResourceGain', resource: 'ultimateEnergy' }],
            }),
            step('applyStatus', {
              statusKey: 'clusterStrikeCounter',
              target: 'caster',
              durationFrames: 600,
              stacks: 2,
              maxStacks: 2,
            }),
            branch(
              formIsIntellect,
              sequence(
                step('applyElementalReaction', {
                  reaction: 'corrosion',
                  target: 'enemy',
                  durationSeconds: 15,
                  effectiveness: 1,
                }),
              ),
              sequence(
                ...(['heat', 'cryo', 'electric', 'nature'] as const).map(element =>
                  branch(
                    { kind: 'elementalInflictionPresent', elements: element },
                    sequence(step('applyElementalInfliction', { element, isExtra: false })),
                  ),
                ),
              ),
            ),
            step(
              'dealDamage',
              natureDamage(initialUltimateScale, ['ultimateSkill'], { stagger: 10 }),
            ),
          ),
        ),
      ),
    ),
    scheduled(
      58,
      sequence(
        branch(
          arcanaReady,
          sequence(
            branch(
              formIsIntellect,
              sequence(
                step(
                  'dealDamage',
                  natureDamage(arcanaIntellectScale, ['ultimateSkill'], { stagger: 10 }),
                  'ultimate.arcanaDamage',
                ),
              ),
              sequence(
                step(
                  'dealDamage',
                  natureDamage(arcanaWillScale, ['ultimateSkill'], { stagger: 10 }),
                  'ultimate.arcanaDamage',
                ),
              ),
            ),
            step('consumeStatus', { statusKey: 'gloompurgeArcanaReady', target: 'caster' }),
            step('consumeStatus', { statusKey: 'gloompurgerArray', target: 'caster' }),
          ),
        ),
      ),
    ),
  ],
  eventHandlers: [
    {
      key: 'clusterStrikeAfterFinalNormalAttack',
      event: { kind: 'damageTagHit', tag: 'normalAttackLastCombo', scope: 'team' },
      condition: clusterStrikeAvailable,
      scheduledSequences: clusterStrikeSequences,
    },
    {
      key: 'clusterStrikeAfterFinisher',
      event: { kind: 'damageTagHit', tag: 'powerAttack', scope: 'team' },
      condition: clusterStrikeAvailable,
      scheduledSequences: clusterStrikeSequences,
    },
    {
      key: 'clearArcanaStateWhenArrayExpires',
      event: { kind: 'statusExpired', statusKey: 'gloompurgerArray', target: 'caster' },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('consumeStatus', { statusKey: 'gloompurgeArcanaReady', target: 'caster' }),
            step('consumeStatus', { statusKey: 'clusterStrikeCounter', target: 'caster' }),
          ),
        ),
      ],
    },
  ],
} satisfies SkillDefinition;

export const arcane: OperatorDefinition = {
  slug: 'arcane',
  gameId: 'ARCANE',
  rarity: 6,
  weaponType: 'arts-unit',
  element: 'nature',
  role: 'caster',
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
  attributes: {
    strength: [9, 26, 45, 64, 82, 91],
    agility: [9, 27, 46, 65, 84, 93],
    intellect: [21, 54, 89, 124, 159, 176],
    will: [14, 37, 61, 85, 109, 121],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [basicAttack1, basicAttack2, basicAttack3, basicAttack4, basicAttack5],
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
      skills: battleSkill,
      presentationVariants: arcanePresentationVariants,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: comboSkill,
      presentationVariants: arcanePresentationVariants,
    },
    {
      key: 'ultimate',
      skillType: 'ultimate',
      levelSource: 'ultimate',
      skills: ultimate,
      presentationVariants: arcanePresentationVariants,
    },
  ],
  eventHandlers: [arcaneFormEventHandler],
  talents: [
    {
      key: 'formDependentUltimateSupport',
      levels: 2,
      modifiers: [
        {
          kind: 'addConditionalDamage',
          condition: { kind: 'all', conditions: [formIsIntellect, arrayActive] },
          values: [0, 0.24],
        },
        {
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -180,
          condition: formIsIntellect,
        },
      ],
      eventHandlers: [
        {
          event: { kind: 'skillHit', skillGroupKey: 'ultimate', scope: 'operator' },
          sequence: sequence(
            branch(
              formIsWill,
              sequence(
                step('applyStatus', {
                  statusKey: 'ultimateTalentSusceptibility',
                  target: 'enemy',
                  durationFrames: 300,
                  modifiers: [
                    {
                      kind: 'susceptibility',
                      damageTypes: ['nature', 'cryo'],
                      value: 0,
                      attributeScaling: { attribute: 'will', coefficient: [0, 0.0002] },
                      cap: [0, 0.128],
                    },
                  ],
                }),
              ),
            ),
          ),
        },
      ],
    },
    {
      key: 'corrosionMastery',
      levels: 2,
      modifiers: [
        { kind: 'addReactionDuration', reaction: 'corrosion', seconds: [5, 10] },
        { kind: 'addReactionEffectiveness', reaction: 'corrosion', value: [0.05, 0.1] },
      ],
    },
  ],
  potentials: [
    {
      key: 'strengthenedComboSkill',
      levels: 1,
      modifiers: [{ kind: 'multiplySkillDamage', skillGroupKey: 'comboSkill', multiplier: 1.3 }],
    },
    {
      key: 'attributeAndArtsIntensity',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['intellect', 'will'], value: 15 },
        { kind: 'addPanelStat', stat: 'artsIntensity', value: 16 },
      ],
    },
    {
      key: 'strongerCorrosionMastery',
      levels: 1,
      modifiers: [
        { kind: 'addReactionDuration', reaction: 'corrosion', seconds: 5 },
        { kind: 'addReactionEffectiveness', reaction: 'corrosion', value: 0.2 },
      ],
    },
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
    {
      key: 'strengthenedFormTalentAndArcana',
      levels: 1,
      modifiers: [
        {
          kind: 'addConditionalDamage',
          condition: { kind: 'all', conditions: [formIsIntellect, arrayActive] },
          values: 0.16,
        },
        {
          kind: 'multiplyStepDamage',
          skillGroupKey: 'ultimate',
          stepKey: 'ultimate.arcanaDamage',
          multiplier: 1.3,
        },
        {
          kind: 'multiplySkillCooldown',
          skillGroupKey: 'ultimate',
          branchKey: 'arcana',
          multiplier: 0.7,
        },
      ],
      eventHandlers: [
        {
          event: { kind: 'skillHit', skillGroupKey: 'ultimate', scope: 'operator' },
          sequence: sequence(
            branch(
              formIsWill,
              sequence(
                step('applyStatus', {
                  statusKey: 'ultimatePotentialSusceptibility',
                  target: 'enemy',
                  durationFrames: 300,
                  modifiers: [
                    {
                      kind: 'susceptibility',
                      damageTypes: ['nature', 'cryo'],
                      value: 0.07,
                    },
                  ],
                }),
              ),
            ),
          ),
        },
      ],
    },
  ],
};
