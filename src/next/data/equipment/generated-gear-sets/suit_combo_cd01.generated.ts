/** Projected from 1.4.4 SkillPatch, SkillData and BuffData by the game-data compiler. */
import type { GearSetDefinition } from '../../../core/game-data/equipmentDefinition';

const definition = {
  slug: 'suit_combo_cd01',
  modifiers: [
    {
      kind: 'skillCooldownMultiplier',
      skillTypes: 'comboSkill',
      value: [0.85],
    },
  ],
  buffDefinitions: {
    buff_equipsuit_combo_cd01: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: { blackboardKey: 'max_stack' },
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTagIds: [],
      extendTagIds: [],
      blackboard: { duration: 30, max_stack: 2, spell_up: 0.1 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: { kind: 'eventSkillTypeIn', skillTypes: ['comboSkill'] },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'applyBuff',
                      parameters: {
                        buffId: 'buff_equipsuit_combo_cd01_spellup',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          spell_up: { kind: 'blackboard', key: 'spell_up' },
                          duration: { kind: 'blackboard', key: 'duration' },
                          max_stack: { kind: 'blackboard', key: 'max_stack' },
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
    buff_equipsuit_combo_cd01_spellup: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: { blackboardKey: 'max_stack' },
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      presentation: {
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
      },
      applyTagIds: [],
      extendTagIds: [],
      blackboard: { duration: 30, max_stack: 2, spell_up: 0.1 },
      attributeModifiers: [
        {
          attribute: 'ComboSkillDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'spell_up' },
        },
        {
          attribute: 'NormalSkillDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'spell_up' },
        },
        {
          attribute: 'UltimateSkillDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'spell_up' },
        },
      ],
    },
  },
  initializationSequence: {
    steps: [
      {
        kind: 'applyBuff',
        parameters: {
          buffId: 'buff_equipsuit_combo_cd01',
          target: 'caster',
          blackboardAssignments: {
            spell_up: { kind: 'constant', value: 0.2 },
            max_stack: { kind: 'constant', value: 2 },
            duration: { kind: 'constant', value: 15 },
          },
        },
      },
    ],
  },
} as const satisfies GearSetDefinition;

export default definition;
