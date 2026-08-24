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
});
