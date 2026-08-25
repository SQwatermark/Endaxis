import { describe, expect, it } from 'vitest';
import { compileGearSetContribution } from '../../core/compiler/compileEquipment';
import { validateGearSetDefinition } from '../../core/game-data/equipmentDefinitionValidation';
import { perlica } from '../operators/perlica';
import { generatedGearSetDefinitions } from './generated-gear-sets/index.generated';

describe('生成套装正式定义', () => {
  it('让技力套在战技实际回能后给全队施加限时普通乘区增伤', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_atb01')!;
    expect(validateGearSetDefinition(definition, '$.suit_atb01')).toEqual([]);
    const compiled = compileGearSetContribution(definition, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });

    expect(compiled.modifiers).toEqual([
      { kind: 'skillCooldownMultiplier', skillTypes: 'comboSkill', value: 0.85 },
    ]);
    expect(compiled.buffDefinitions?.buff_equipsuit_combosuit_01).toMatchObject({
      abilityEventResponses: [
        {
          event: 'skillSpGained',
          sequence: {
            steps: [
              {
                kind: 'applyBuff',
                parameters: {
                  buffId: 'buff_equipsuit_combosuit_01_adddamage',
                  target: 'party',
                  blackboardAssignments: {
                    dmg_up: { kind: 'blackboard', key: 'dmg_up' },
                    duration: { kind: 'blackboard', key: 'duration' },
                  },
                },
              },
            ],
          },
        },
      ],
    });
    expect(compiled.buffDefinitions?.buff_equipsuit_combosuit_01_adddamage).toMatchObject({
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
      },
      damageModifiers: [
        {
          enabledSide: 'attacker',
          processors: [
            {
              kind: 'damageScale',
              side: 'attacker',
              zone: 'normal',
              addition: { blackboardKey: 'dmg_up' },
            },
          ],
        },
      ],
    });
  });

  it('让 suit_atk01 的静态增伤、根安装和技能前攻击 Buff 进入正式编译', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_atk01');
    expect(definition).toBeDefined();
    expect(validateGearSetDefinition(definition!, '$.suit_atk01')).toEqual([]);

    const compiled = compileGearSetContribution(definition!, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    expect(compiled.modifiers).toEqual([
      { kind: 'damageScale', target: 'battleSkill', value: 0.24 },
      { kind: 'damageScale', target: 'comboSkill', value: 0.24 },
      { kind: 'damageScale', target: 'ultimate', value: 0.24 },
    ]);
    expect(compiled.initializationSequence).toMatchObject({
      steps: [
        {
          kind: 'applyBuff',
          parameters: {
            buffId: 'buff_equipsuit_atk_01',
            blackboardAssignments: {
              dmg_up: { kind: 'constant', value: 0.24 },
              atk_up: { kind: 'constant', value: 0.05 },
              duration: { kind: 'constant', value: 15 },
            },
          },
        },
      ],
    });
    const rootBuff = compiled.buffDefinitions?.buff_equipsuit_atk_01;
    expect(rootBuff).toMatchObject({ stackingType: 'unique' });
    expect(rootBuff?.abilityEventResponses?.[0]).toMatchObject({ event: 'beforeCastSkill' });
    expect(rootBuff?.abilityEventResponses?.[0]?.sequence.steps[0]).toMatchObject({
      kind: 'conditional',
      parameters: {
        condition: { kind: 'eventSkillTypeIn', skillTypes: ['battleSkill'] },
      },
    });
    expect(compiled.buffDefinitions?.buff_equipsuit_atk_01_normalskill).toMatchObject({
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
      },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
      ],
    });
  });

  it('让 suit_combo_cd01 的连携冷却和施放前叠层增伤进入正式编译', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_combo_cd01');
    expect(definition).toBeDefined();
    expect(validateGearSetDefinition(definition!, '$.suit_combo_cd01')).toEqual([]);
    const compiled = compileGearSetContribution(definition!, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    expect(compiled.modifiers).toEqual([
      { kind: 'skillCooldownMultiplier', skillTypes: 'comboSkill', value: 0.85 },
    ]);
    expect(compiled.initializationSequence?.steps[0]).toMatchObject({
      kind: 'applyBuff',
      parameters: {
        buffId: 'buff_equipsuit_combo_cd01',
        blackboardAssignments: {
          spell_up: { kind: 'constant', value: 0.2 },
          max_stack: { kind: 'constant', value: 2 },
          duration: { kind: 'constant', value: 15 },
        },
      },
    });
    expect(compiled.buffDefinitions?.buff_equipsuit_combo_cd01_spellup).toMatchObject({
      stackingType: 'stack',
      maxStackCount: { blackboardKey: 'max_stack' },
      durationSeconds: { blackboardKey: 'duration' },
      presentation: { iconId: 'icon_battle_buff_atk_up' },
      attributeModifiers: [
        {
          attribute: 'comboSkillDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'spell_up' },
        },
        {
          attribute: 'normalSkillDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'spell_up' },
        },
        {
          attribute: 'ultimateSkillDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'spell_up' },
        },
      ],
    });
  });

  it('完整注册两套只剩木桩场景静态生命收益的原生套装', () => {
    for (const slug of ['suit_stragi01', 'suit_wisdwill01'] as const) {
      const definition = generatedGearSetDefinitions.find(item => item.slug === slug);
      expect(definition).toBeDefined();
      expect(validateGearSetDefinition(definition!, `$.${slug}`)).toEqual([]);

      const compiled = compileGearSetContribution(definition!, {
        main: perlica.mainAttribute,
        secondary: perlica.secondaryAttribute,
      });
      expect(compiled.modifiers).toEqual([{ kind: 'panelStat', stat: 'healthFlat', value: 500 }]);
      expect(compiled.initializationSequence?.steps).toEqual([
        {
          kind: 'applyBuff',
          parameters: { buffId: 'buff_equipsuit_will_01', target: 'caster' },
        },
      ]);
    }
  });

  it('在固定满血场景安装敏捷与智识套装的常驻增伤 Buff', () => {
    const agility = generatedGearSetDefinitions.find(item => item.slug === 'suit_agi01')!;
    const intellect = generatedGearSetDefinitions.find(item => item.slug === 'suit_wisd01')!;

    expect(validateGearSetDefinition(agility, '$.suit_agi01')).toEqual([]);
    expect(validateGearSetDefinition(intellect, '$.suit_wisd01')).toEqual([]);
    const compiledAgility = compileGearSetContribution(agility, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    const compiledIntellect = compileGearSetContribution(intellect, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    expect(compiledAgility.modifiers).toEqual([
      { kind: 'attribute', attribute: 'agility', operation: 'flat', value: 50 },
    ]);
    expect(compiledAgility.initializationSequence?.steps[1]).toMatchObject({
      parameters: {
        buffId: 'buff_equipsuit_agi_phydmg_01',
        blackboardAssignments: { phy_dmg_up: { kind: 'constant', value: 0.2 } },
      },
    });
    expect(compiledIntellect.initializationSequence?.steps[1]).toMatchObject({
      parameters: {
        buffId: 'buff_equipsuit_wisd_spdmg_01',
        blackboardAssignments: { spell_dmg_up: { kind: 'constant', value: 0.2 } },
      },
    });
  });

  it('在固定满血场景只保留意志套装的静态意志收益', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_will01')!;
    expect(validateGearSetDefinition(definition, '$.suit_will01')).toEqual([]);
    expect(
      compileGearSetContribution(definition, {
        main: perlica.mainAttribute,
        secondary: perlica.secondaryAttribute,
      }).modifiers,
    ).toEqual([{ kind: 'attribute', attribute: 'will', operation: 'flat', value: 50 }]);
  });

  it('在无敌方主动伤害场景只保留力量套装的静态力量收益', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_str01')!;
    expect(validateGearSetDefinition(definition, '$.suit_str01')).toEqual([]);
    const compiled = compileGearSetContribution(definition, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    expect(compiled.modifiers).toEqual([
      { kind: 'attribute', attribute: 'strength', operation: 'flat', value: 50 },
    ]);
    expect(compiled.initializationSequence?.steps).toEqual([
      {
        kind: 'applyBuff',
        parameters: { buffId: 'buff_equipsuit_str_01', target: 'caster' },
      },
    ]);
    expect(compiled.buffDefinitions?.buff_equipsuit_str_reducedmg_01?.presentation).toMatchObject({
      iconId: 'icon_battle_buff_def_up',
      iconPath: '/icons/icon_battle_buff_def_up.webp',
    });
  });

  it('让两组元素附着输出事件安装对应的限时元素增伤 Buff', () => {
    const cases = [
      {
        slug: 'suit_fire_natr01',
        rootBuffId: 'buff_equipsuit_fninflict_01',
        tagId: -1110095722,
        childBuffId: 'buff_equipsuit_fninflict_01_firedamageadd',
      },
      {
        slug: 'suit_pulse_cryst01',
        rootBuffId: 'buff_equipsuit_cpinflict_01',
        tagId: 1466867135,
        childBuffId: 'buff_equipsuit_cpinflict_01_elecdamageadd',
      },
    ] as const;

    for (const fixture of cases) {
      const definition = generatedGearSetDefinitions.find(item => item.slug === fixture.slug)!;
      expect(validateGearSetDefinition(definition, `$.${fixture.slug}`)).toEqual([]);
      const compiled = compileGearSetContribution(definition, {
        main: perlica.mainAttribute,
        secondary: perlica.secondaryAttribute,
      });
      expect(compiled.modifiers).toEqual([{ kind: 'panelStat', stat: 'artsIntensity', value: 30 }]);
      const response = compiled.buffDefinitions?.[fixture.rootBuffId]?.abilityEventResponses?.[0];
      expect(response?.event).toBe('outputBuff');
      expect(response?.sequence.steps[0]).toMatchObject({
        kind: 'conditional',
        parameters: {
          condition: {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTagIds: [fixture.tagId],
          },
        },
        whenTrue: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: { buffId: fixture.childBuffId, target: 'buffOwner' },
            },
          ],
        },
      });
    }
  });

  it('让失衡套按事件目标上的失衡 Buff 实例数追加两段物理增伤', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_poise01')!;
    expect(validateGearSetDefinition(definition, '$.suit_poise01')).toEqual([]);
    const compiled = compileGearSetContribution(definition, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    expect(compiled.modifiers).toEqual([{ kind: 'panelStat', stat: 'attackPercent', value: 0.08 }]);
    const response =
      compiled.buffDefinitions?.buff_equipsuit_poisedmg_01?.abilityEventResponses?.[0];
    expect(response?.event).toBe('outputBuff');
    expect(response?.sequence.steps[0]).toMatchObject({
      parameters: {
        condition: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTagIds: [1075718177],
        },
      },
      whenTrue: {
        steps: [
          { parameters: { buffId: 'buff_equipsuit_poisedmg_01_damagebuff' } },
          {
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
              steps: [{ parameters: { buffId: 'buff_equipsuit_poisedmg_01_attackbuff' } }],
            },
          },
        ],
      },
    });
  });

  it('让物理套在指定 Buff 输出后按十五秒冷却造成物理与失衡伤害', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_phy01')!;
    expect(validateGearSetDefinition(definition, '$.suit_phy01')).toEqual([]);
    const compiled = compileGearSetContribution(definition, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    expect(compiled.modifiers).toEqual([
      { kind: 'panelStat', stat: 'staggerDamagePercent', value: 0.2 },
    ]);
    expect(
      compiled.buffDefinitions?.buff_equipsuit_physuit_01?.abilityEventResponses?.[0]?.sequence
        .steps[0],
    ).toMatchObject({
      parameters: {
        condition: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTagIds: [-6380412],
        },
      },
      whenTrue: {
        steps: [
          {
            parameters: {
              condition: {
                kind: 'not',
                condition: {
                  kind: 'timedMarkerPresent',
                  target: 'caster',
                  markerId: 'buff_equipsuit_physuit_01',
                },
              },
            },
            whenTrue: {
              steps: [
                {
                  kind: 'dealDamage',
                  parameters: {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    stagger: { kind: 'blackboard', key: 'poise' },
                    tags: [],
                  },
                },
                {
                  kind: 'createTimedMarker',
                  parameters: {
                    target: 'caster',
                    markerId: 'buff_equipsuit_physuit_01',
                    durationSeconds: { kind: 'blackboard', key: 'duration' },
                  },
                },
              ],
            },
          },
        ],
      },
    });
  });

  it('把碎甲猛击套的破防层数与特殊状态倍率投影为动态物理增伤', () => {
    const definition = generatedGearSetDefinitions.find(
      item => item.slug === 'suit_crush_fracture',
    )!;
    expect(validateGearSetDefinition(definition, '$.suit_crush_fracture')).toEqual([]);
    const compiled = compileGearSetContribution(definition, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    expect(compiled.modifiers).toEqual([{ kind: 'panelStat', stat: 'attackPercent', value: 0.08 }]);
    expect(
      compiled.buffDefinitions?.buff_equipsuit_crush_fracture?.abilityEventResponses?.[0],
    ).toMatchObject({
      event: 'beforeOutputPhysicalInfliction',
      sequence: {
        steps: [
          {
            parameters: {
              condition: {
                kind: 'eventPhysicalInflictionTypeIn',
                types: ['fracture', 'crush'],
              },
            },
            whenTrue: {
              steps: [
                {
                  parameters: {
                    condition: {
                      kind: 'eventTargetBuffCountCompare',
                      buffTagIds: [1075718177],
                    },
                  },
                  whenTrue: {
                    steps: expect.arrayContaining([
                      expect.objectContaining({ kind: 'readBuffStackCount' }),
                      expect.objectContaining({
                        kind: 'conditional',
                        parameters: expect.objectContaining({
                          condition: expect.objectContaining({ kind: 'any' }),
                        }),
                      }),
                      expect.objectContaining({
                        kind: 'applyBuff',
                        parameters: expect.objectContaining({
                          buffId: 'buff_equipsuit_crush_fracture_physicdamage',
                        }),
                      }),
                    ]),
                  },
                },
              ],
            },
          },
        ],
      },
    });
  });

  it('让治疗套在满血治疗时按过量治疗分支给事件目标施加可视防御 Buff', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_heal01')!;
    expect(validateGearSetDefinition(definition, '$.suit_heal01')).toEqual([]);
    const compiled = compileGearSetContribution(definition, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });
    expect(compiled.modifiers).toEqual([
      { kind: 'staticHealingIncrease', target: 'output', value: 0.2 },
    ]);
    expect(compiled.buffDefinitions?.buff_common_dmgtk_down_equip_1).toMatchObject({
      stackingType: 'highPriority',
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_up',
        iconStyleInSquad: 'LifeTime',
      },
    });
    expect(
      compiled.buffDefinitions?.buff_equipsuit_healup_01?.abilityEventResponses?.[0],
    ).toMatchObject({
      event: 'outputHeal',
      sequence: {
        steps: [
          {
            parameters: { condition: { kind: 'eventOverheal' } },
            whenTrue: {
              steps: [
                {
                  parameters: {
                    buffId: 'buff_common_dmgtk_down_equip_1',
                    target: 'eventTarget',
                    blackboardAssignments: {
                      value: { kind: 'blackboard', key: 'dmg_taken_down2' },
                      duration: { kind: 'blackboard', key: 'duration' },
                      priority: { kind: 'constant', value: 1 },
                    },
                  },
                },
              ],
            },
          },
          {
            parameters: {
              condition: { kind: 'not', condition: { kind: 'eventOverheal' } },
            },
          },
        ],
      },
    });
  });

  it('让暴击套由输出暴击事件叠攻击，满层加暴击并在攻击 Buff 结束时清理', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_criti01')!;
    expect(validateGearSetDefinition(definition, '$.suit_criti01')).toEqual([]);
    const compiled = compileGearSetContribution(definition, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });

    expect(compiled.modifiers).toEqual([{ kind: 'panelStat', stat: 'criticalRate', value: 0.05 }]);
    expect(compiled.buffDefinitions?.buff_equipsuit_critsuit_01).toMatchObject({
      abilityEventResponses: [
        {
          event: 'outputCriticalDamage',
          sequence: {
            steps: [
              {
                kind: 'applyBuff',
                parameters: {
                  buffId: 'buff_equipsuit_critsuitatk_01',
                  target: 'buffOwner',
                },
              },
            ],
          },
        },
      ],
    });
    expect(compiled.buffDefinitions?.buff_equipsuit_critsuitatk_01).toMatchObject({
      stackingType: 'enhanceAndRefresh',
      maxStackCount: { blackboardKey: 'max_stack' },
      durationSeconds: { blackboardKey: 'duration' },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
      ],
      lifecycleSequences: {
        enhanceChanged: {
          steps: [
            {
              parameters: {
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'buffOwner',
                  buffIds: ['buff_equipsuit_critsuitatk_01'],
                  operator: 'greaterOrEqual',
                },
              },
              whenTrue: {
                steps: [
                  {
                    parameters: {
                      buffId: 'buff_equipsuit_critsuitdmg_01',
                      target: 'buffOwner',
                    },
                  },
                ],
              },
            },
          ],
        },
        finish: {
          steps: [
            {
              kind: 'finishBuffsById',
              parameters: {
                target: 'buffOwner',
                buffIds: ['buff_equipsuit_critsuitdmg_01'],
                reason: 'other',
              },
            },
          ],
        },
      },
    });
    expect(compiled.buffDefinitions?.buff_equipsuit_critsuitdmg_01).toMatchObject({
      presentation: {
        visible: true,
        iconId: 'icon_battle_crit_rate_up',
        iconPath: '/icons/icon_battle_crit_rate_up.webp',
      },
      attributeModifiers: [
        {
          attribute: 'criticalRate',
          slot: 'baseAddition',
          value: { blackboardKey: 'crit_up2' },
        },
      ],
    });
  });

  it('让爆发套在对应元素 Buff 达到两实例后获得四系术法增伤', () => {
    const definition = generatedGearSetDefinitions.find(item => item.slug === 'suit_burst01')!;
    expect(validateGearSetDefinition(definition, '$.suit_burst01')).toEqual([]);
    const compiled = compileGearSetContribution(definition, {
      main: perlica.mainAttribute,
      secondary: perlica.secondaryAttribute,
    });

    expect(compiled.modifiers).toEqual([
      { kind: 'damageScale', target: 'comboSkill', value: 0.2 },
      { kind: 'damageScale', target: 'battleSkill', value: 0.2 },
      { kind: 'damageScale', target: 'ultimate', value: 0.2 },
    ]);
    const response = compiled.buffDefinitions?.buff_equipsuit_burst_01?.abilityEventResponses?.[0];
    expect(response?.event).toBe('outputBuff');
    expect(response?.sequence.steps).toHaveLength(4);
    expect(response?.sequence.steps[0]).toMatchObject({
      parameters: {
        condition: {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTagIds: [-1558844517],
        },
      },
      whenTrue: {
        steps: [
          {
            parameters: {
              condition: {
                kind: 'eventTargetBuffCountCompare',
                tagQueryType: 'hasAny',
                buffTagIds: [-1558844517],
                operator: 'greaterOrEqual',
                value: { kind: 'blackboard', key: 'stack_cond' },
              },
            },
            whenTrue: {
              steps: [
                {
                  parameters: {
                    buffId: 'buff_equipsuit_burst_01_spelldmgup',
                    target: 'buffOwner',
                  },
                },
              ],
            },
          },
        ],
      },
    });
    expect(compiled.buffDefinitions?.buff_equipsuit_burst_01_spelldmgup).toMatchObject({
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_spell_up',
        iconPath: '/icons/icon_battle_spell_up.webp',
      },
      attributeModifiers: [
        { attribute: 'heatDamageIncrease', value: { blackboardKey: 'spell_dmg_up' } },
        { attribute: 'electricDamageIncrease', value: { blackboardKey: 'spell_dmg_up' } },
        { attribute: 'cryoDamageIncrease', value: { blackboardKey: 'spell_dmg_up' } },
        { attribute: 'natureDamageIncrease', value: { blackboardKey: 'spell_dmg_up' } },
      ],
    });
    expect(compiled.initializationSequence?.steps[1]).toMatchObject({
      parameters: {
        buffId: 'buff_equipsuit_burst_01',
        blackboardAssignments: {
          stack_cond: { kind: 'constant', value: 2 },
          spell_dmg_up: { kind: 'constant', value: 0.35 },
          duration: { kind: 'constant', value: 15 },
        },
      },
    });
  });
});
