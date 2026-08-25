/** Projected from 1.4.4 SkillPatch, SkillData and BuffData by the game-data compiler. */
import type { GearSetDefinition } from '../../../core/game-data/equipmentDefinition';

const damageBuff = (
  attribute: 'heatDamageIncrease' | 'natureDamageIncrease',
  iconId: string,
  valueKey: 'fire_dmg_up' | 'nature_dmg_up',
) =>
  ({
    stackingType: 'stack',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    presentation: {
      visible: true,
      iconId,
      iconPath: `/icons/${iconId}.webp`,
      showInHeadBarCommon: false,
      showInHeadBarAttached: false,
      showInSquadIcon: true,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
    },
    applyTagIds: [],
    extendTagIds: [],
    blackboard: { duration: 8, [valueKey]: 0.2 },
    attributeModifiers: [{ attribute, slot: 'baseAddition', value: { blackboardKey: valueKey } }],
  }) as const;

const definition = {
  slug: 'suit_fire_natr01',
  modifiers: [{ kind: 'panelStat', stat: 'artsIntensity', value: [30] }],
  buffDefinitions: {
    buff_equipsuit_fninflict_01: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 0,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTagIds: [],
      extendTagIds: [],
      blackboard: {
        duration: 8,
        duration2: 8,
        fire_dmg_up: 0.5,
        nature_dmg_up: 0.5,
        phy_spell_up: 0.2,
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
                    buffTagIds: [-1110095722],
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'applyBuff',
                      parameters: {
                        buffId: 'buff_equipsuit_fninflict_01_firedamageadd',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          duration: { kind: 'blackboard', key: 'duration' },
                          fire_dmg_up: { kind: 'blackboard', key: 'fire_dmg_up' },
                        },
                      },
                    },
                  ],
                },
              },
              {
                kind: 'conditional',
                parameters: {
                  condition: {
                    kind: 'eventBuffTagsMatch',
                    match: 'hasAny',
                    buffTagIds: [-421286163],
                  },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'applyBuff',
                      parameters: {
                        buffId: 'buff_equipsuit_fninflict_01_poisedamageadd',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          duration: { kind: 'blackboard', key: 'duration2' },
                          nature_dmg_up: { kind: 'blackboard', key: 'nature_dmg_up' },
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
    buff_equipsuit_fninflict_01_firedamageadd: damageBuff(
      'heatDamageIncrease',
      'icon_battle_fire_dmp_up',
      'fire_dmg_up',
    ),
    buff_equipsuit_fninflict_01_poisedamageadd: damageBuff(
      'natureDamageIncrease',
      'icon_battle_natural_up',
      'nature_dmg_up',
    ),
  },
  initializationSequence: {
    steps: [
      {
        kind: 'applyBuff',
        parameters: {
          buffId: 'buff_equipsuit_fninflict_01',
          target: 'caster',
          blackboardAssignments: {
            phy_spell_up: { kind: 'constant', value: 30 },
            fire_dmg_up: { kind: 'constant', value: 0.5 },
            nature_dmg_up: { kind: 'constant', value: 0.5 },
            duration: { kind: 'constant', value: 10 },
            duration2: { kind: 'constant', value: 10 },
          },
        },
      },
    ],
  },
} as const satisfies GearSetDefinition;

export default definition;
