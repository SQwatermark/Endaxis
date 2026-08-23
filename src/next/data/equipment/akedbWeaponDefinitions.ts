/**
 * 已由版本化 AKEDB TableCfg、SkillData 与 BuffData 闭环的正式武器定义。
 *
 * 当前先收录旧迁移目录缺失的曜夜；后续生成器会逐批替代 shared adapter 候选。
 */
import type { WeaponDefinition } from '../../core/game-data/equipmentDefinition';

const traitValues = {
  will: [20, 36, 52, 68, 84, 100, 116, 132, 156],
  healing: [
    0.05952381, 0.10714286, 0.15476191, 0.20238096, 0.25, 0.29761904, 0.3452381, 0.39285713,
    0.4642857,
  ],
  mainAttribute: [0.16, 0.192, 0.224, 0.256, 0.288, 0.32, 0.352, 0.384, 0.448],
  attack: [0.035, 0.042, 0.049, 0.056, 0.063, 0.07, 0.077, 0.084, 0.098],
} as const;

export const bedazzlingNightDebut: WeaponDefinition = {
  slug: 'bedazzling-night-debut',
  displayName: '曜夜的首演',
  assetSlug: 'bedazzling-night-debut',
  iconPath: '/weapons/polearm/wpn_polearm_0014.webp',
  rarity: 6,
  weaponType: 'polearm',
  baseAttackAtLevelNodes: [51, 146, 247, 348, 449, 500],
  traits: [
    {
      key: 'skill1',
      levelCount: 9,
      modifiers: [
        { kind: 'attribute', attribute: 'will', operation: 'flat', value: traitValues.will },
      ],
    },
    {
      key: 'skill2',
      levelCount: 9,
      modifiers: [{ kind: 'staticHealingIncrease', target: 'output', value: traitValues.healing }],
    },
    {
      key: 'skill3',
      levelCount: 9,
      modifiers: [
        {
          kind: 'attribute',
          attribute: 'main',
          operation: 'percent',
          value: traitValues.mainAttribute,
        },
      ],
      eventHandlers: [
        {
          key: 'heal-teammate-attack-up',
          event: { kind: 'operatorHealed', role: 'source' },
          condition: {
            kind: 'all',
            conditions: [
              {
                kind: 'eventHealTagsMatch',
                match: 'hasAny',
                tagIds: [-320297214, -1517158118, -1499119779],
              },
              { kind: 'eventSourceTargetMatch', operator: 'notEqual' },
              {
                kind: 'not',
                condition: {
                  kind: 'timedMarkerPresent',
                  target: 'eventTarget',
                  markerId: 'sk_wpn_lance_0014',
                },
              },
            ],
          },
          blackboard: {
            atk_up: traitValues.attack,
            duration2: 20,
            max_stack: 4,
          },
          sequence: {
            steps: [
              {
                kind: 'applyBuff',
                parameters: {
                  buffId: 'buff_wpn_lance_0014_damageup',
                  target: 'eventTarget',
                  definition: {
                    stackingType: 'highPriorityWithMaxStack',
                    priority: { blackboardKey: 'atk_up' },
                    maxStackCount: { blackboardKey: 'max_stack' },
                    durationSeconds: { blackboardKey: 'duration2' },
                    blackboard: { atk_up: 0, duration2: 20, max_stack: 4 },
                    attributeModifiers: [
                      {
                        attribute: 'Atk',
                        slot: 'baseMultiplier',
                        value: { blackboardKey: 'atk_up' },
                      },
                    ],
                    presentation: {
                      visible: true,
                      iconId: 'icon_battle_buff_atk_up',
                      iconPath: '/icons/icon_battle_buff_atk_up.webp',
                      showInHeadBarCommon: false,
                      showInHeadBarAttached: false,
                      showInSquadIcon: true,
                      onlyShowForMainCharacter: false,
                      iconStyleInSquad: 'LifeTime',
                      abnormalColorType: 'Physical',
                      orderPriority: {
                        useDirectoryValue: false,
                        value: 0,
                        category: 'CommonCharBuff',
                      },
                    },
                  },
                  blackboardAssignments: {
                    atk_up: { kind: 'blackboard', key: 'atk_up' },
                    duration2: { kind: 'blackboard', key: 'duration2' },
                    max_stack: { kind: 'blackboard', key: 'max_stack' },
                  },
                },
              },
              {
                kind: 'createTimedMarker',
                parameters: {
                  target: 'eventTarget',
                  markerId: 'sk_wpn_lance_0014',
                  durationSeconds: { kind: 'constant', value: 0.1 },
                  autoFinishByAction: false,
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

export const akedbWeaponDefinitions: readonly WeaponDefinition[] = [bedazzlingNightDebut];
