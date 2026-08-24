import { describe, expect, it } from 'vitest';
import { compileGearSetContribution } from '../../core/compiler/compileEquipment';
import { validateGearSetDefinition } from '../../core/game-data/equipmentDefinitionValidation';
import { perlica } from '../operators/perlica';
import { generatedGearSetDefinitions } from './generated-gear-sets/index.generated';

describe('生成套装正式定义', () => {
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
});
