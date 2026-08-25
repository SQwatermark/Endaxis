/** Projected from 1.4.4 SkillPatch, SkillData and BuffData by the game-data compiler. */
import type { GearSetDefinition } from '../../../core/game-data/equipmentDefinition';

const presentation = {
  visible: true,
  iconId: 'icon_battle_buff_atk_up',
  iconPath: '/icons/icon_battle_buff_atk_up.webp',
  showInHeadBarCommon: false,
  showInHeadBarAttached: false,
  showInSquadIcon: true,
  onlyShowForMainCharacter: false,
  iconStyleInSquad: 'Default',
  abnormalColorType: 'Physical',
  orderPriority: {
    useDirectoryValue: false,
    value: 0,
    category: 'CommonCharBuff',
  },
} as const;

const definition = {
  slug: 'suit_poise01',
  modifiers: [{ kind: 'panelStat', stat: 'attackPercent', value: [0.08] }],
  buffDefinitions: {
    buff_equipsuit_poisedmg_01: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      applyTagIds: [],
      extendTagIds: [],
      blackboard: {
        atk_up: 0.1,
        duration: 6,
        duration2: 6,
        max_stack: 0,
        phy_dmg_up: 0.2,
        phy_dmg_up2: 0.2,
        stack_cond: 3,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'eventBuffTagsMatch',
                    match: 'hasAny',
                    buffTagIds: [1075718177],
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'applyBuff',
                      parameters: {
                        buffId: 'buff_equipsuit_poisedmg_01_damagebuff',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          phy_dmg_up: { kind: 'blackboard', key: 'phy_dmg_up' },
                          duration: { kind: 'blackboard', key: 'duration' },
                        },
                      },
                    },
                    {
                      kind: 'conditional',
                      parameters: {
                        condition: {
                          kind: 'eventTargetBuffCountCompare',
                          tagQueryType: 'hasAny',
                          buffTagIds: [1075718177],
                          operator: 'greaterOrEqual',
                          value: { kind: 'blackboard', key: 'stack_cond' },
                        },
                      },
                      whenTrue: {
                        steps: [
                          {
                            kind: 'applyBuff',
                            parameters: {
                              buffId: 'buff_equipsuit_poisedmg_01_attackbuff',
                              target: 'caster',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                phy_dmg_up2: { kind: 'blackboard', key: 'phy_dmg_up2' },
                                duration: { kind: 'blackboard', key: 'duration2' },
                              },
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
    buff_equipsuit_poisedmg_01_attackbuff: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation,
      applyTagIds: [],
      extendTagIds: [],
      blackboard: { duration: 6, phy_dmg_up2: 0.2 },
      attributeModifiers: [
        {
          attribute: 'physicalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'phy_dmg_up2' },
        },
      ],
    },
    buff_equipsuit_poisedmg_01_damagebuff: {
      stackingType: 'enhanceAndRefresh',
      priority: 0,
      maxStackCount: { blackboardKey: 'max_stack' },
      durationSeconds: { blackboardKey: 'duration' },
      presentation,
      applyTagIds: [],
      extendTagIds: [],
      blackboard: { duration: 6, max_stack: 4, phy_dmg_up: 0.2 },
      attributeModifiers: [
        {
          attribute: 'physicalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'phy_dmg_up' },
        },
      ],
    },
  },
  initializationSequence: {
    steps: [
      {
        kind: 'applyBuff',
        parameters: {
          buffId: 'buff_equipsuit_poisedmg_01',
          target: 'caster',
          blackboardAssignments: {
            atk_up: { kind: 'constant', value: 0.08 },
            phy_dmg_up: { kind: 'constant', value: 0.08 },
            duration: { kind: 'constant', value: 15 },
            max_stack: { kind: 'constant', value: 4 },
            phy_dmg_up2: { kind: 'constant', value: 0.16 },
            duration2: { kind: 'constant', value: 10 },
            stack_cond: { kind: 'constant', value: 4 },
          },
        },
      },
    ],
  },
} as const satisfies GearSetDefinition;

export default definition;
