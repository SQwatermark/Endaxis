import { describe, expect, it } from 'vitest';
import { compileOperatorDefinitionSkills } from '../../core/compiler/compileScenarioTimeline';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import type { OperatorInstanceDocument } from '../../core/project/schema';
import { gilbertaBattleSkill } from './generated/gilberta.operator.generated';
import { fluoriteBattleSkill } from './generated/fluorite.operator.generated';
import { lifengUltimate } from './generated/lifeng.operator.generated';
import {
  rossiBattleSkill,
  rossiComboSkill2,
  rossiUltimate,
} from './generated/rossi.operator.generated';
import {
  alesh,
  antal,
  akekuri,
  ardelia,
  avywenna,
  catcher,
  camille,
  chenQianyu,
  daPan,
  ember,
  endministrator,
  estella,
  fluorite,
  gilberta,
  lastRite,
  laevatain,
  lifeng,
  mifu,
  pogranichnik,
  rossi,
  snowshine,
  tangtang,
  wulfgard,
  xaihi,
  yvonne,
  zhuangFangyi,
} from './index';

const generatedOperators: readonly [OperatorDefinition, number][] = [
  [gilberta, 9],
  [lifeng, 9],
  [estella, 9],
  [daPan, 9],
  [ember, 9],
  [akekuri, 9],
  [fluorite, 10],
  [endministrator, 10],
  [lastRite, 9],
  [chenQianyu, 10],
  [rossi, 11],
  [camille, 11],
  [tangtang, 10],
  [laevatain, 14],
  [mifu, 9],
  [yvonne, 16],
  [zhuangFangyi, 13],
  [pogranichnik, 10],
  [snowshine, 8],
  [wulfgard, 9],
  [antal, 9],
  [alesh, 10],
  [xaihi, 10],
  [avywenna, 10],
  [catcher, 9],
  [ardelia, 9],
];

function hasUpgradeBehavior(
  upgrade: OperatorDefinition['talents'][number] | OperatorDefinition['potentials'][number],
): boolean {
  return (
    (upgrade.modifiers?.length ?? 0) > 0 ||
    (upgrade.eventHandlers?.length ?? 0) > 0 ||
    (upgrade.passiveSkills?.length ?? 0) > 0 ||
    upgrade.initializationSequence !== undefined ||
    upgrade.simulationNoEffect !== undefined
  );
}

describe('新增的完整技能转换干员', () => {
  it('Ardelia 保留战技易伤、潜能一黑板增幅与潜能五连携改写', () => {
    expect(ardelia.conversionSupport).toEqual({
      completeness: 'complete',
      missingCapabilities: [],
    });
    expect(ardelia.buffDefinitions?.buff_chr_0025_ardelia_normal_skill_vulnerable).toBeDefined();
    expect(ardelia.potentials[0]?.modifiers).toContainEqual(
      expect.objectContaining({
        kind: 'patchSkillBlackboard',
        skillGroupKey: 'battleSkill',
        blackboardKey: 'rate_vul_base',
        operation: 'add',
        value: 0.08,
      }),
    );
    expect(ardelia.potentials[4]?.modifiers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'addSkillCooldownFrames', frames: -60 }),
        expect.objectContaining({ blackboardKey: 'potential5_dmg_rate', value: 1.2 }),
      ]),
    );
  });

  it('Catcher 保留意志换防御、属性护盾与防御倍率追加伤害', () => {
    expect(catcher.conversionSupport).toEqual({
      completeness: 'complete',
      missingCapabilities: [],
    });
    expect(catcher.buffDefinitions?.buff_chr_0020_meurs_talent_0).toBeDefined();
    expect(
      catcher.buffDefinitions?.buff_chr_0020_meurs_combo_skill_shield?.shields?.[0]?.value,
    ).toEqual({
      attribute: 'Def',
      multiplier: { blackboardKey: 'shield_def_rate' },
      addition: { blackboardKey: 'shield_base' },
    });
    expect(JSON.stringify(catcher.buffDefinitions?.buff_chr_0020_meurs_potential_1)).toContain(
      'calculationAttribute',
    );
  });

  it('Avywenna 长枪回收保留脉冲附着检查，天赋一同时保留技能补丁与常驻 Buff', () => {
    expect(avywenna.conversionSupport).toEqual({
      completeness: 'complete',
      missingCapabilities: [],
    });
    expect(avywenna.buffDefinitions?.buff_chr_0012_avywen_lance_pulse_check).toBeDefined();
    expect(JSON.stringify(avywenna)).toContain('buff_chr_0012_avywen_lance_pulse_check');
    expect(avywenna.talents[0]?.modifiers).toHaveLength(3);
    expect(avywenna.talents[0]?.passiveSkills?.[0]?.key).toBe('buff_chr_0012_avywen_talent_0');
  });

  it('管理员只暴露一套以女管理员数据生成的规范技能入口', () => {
    expect(endministrator.skillGroups.map(group => group.key)).toEqual([
      'basicAttack',
      'finisher',
      'plungingAttack',
      'battleSkill',
      'ultimate',
      'comboSkill',
    ]);
    expect(
      endministrator.skillGroups.flatMap(group =>
        (Array.isArray(group.skills) ? group.skills : [group.skills]).map(skill => skill.key),
      ),
    ).toEqual([
      'basicAttack1',
      'basicAttack2',
      'basicAttack3',
      'basicAttack4',
      'basicAttack5',
      'finisher',
      'plungingAttack',
      'battleSkill',
      'ultimate',
      'comboSkill',
    ]);
  });

  it('三个新样本只把真实转换缺口计入 skillBehavior', () => {
    const skillBehaviorGaps = (operator: OperatorDefinition) =>
      operator.conversionSupport?.missingCapabilities.find(
        item => item.capability === 'skillBehavior',
      )?.skillGroupKeys ?? [];

    expect(skillBehaviorGaps(chenQianyu)).toEqual([]);
    expect(skillBehaviorGaps(rossi)).toEqual([]);
    expect(skillBehaviorGaps(camille)).toEqual(['battleSkill']);
  });

  it('Gilberta 战技把来源死亡监视 Buff 留在能力实体局部时间轴', () => {
    const serialized = JSON.stringify([
      gilbertaBattleSkill,
      gilberta.buffDefinitions?.buff_chr_0013_aglina_normal_skill_monitor,
      gilberta.abilityEntityDefinitions,
    ]);

    expect(serialized).toContain('buff_chr_0013_aglina_normal_skill_monitor');
    expect(serialized).toContain('currentAbilityEntity');
    expect(serialized).toContain('finishCurrentAbilityEntityWhenSourceDies');
  });

  it('Fluorite 战技把已证明的根级跳转迁入能力实体局部时间轴', () => {
    const serialized = JSON.stringify([fluoriteBattleSkill, fluorite.abilityEntityDefinitions]);
    const frames = fluoriteBattleSkill.scheduledSequences.map(sequence => sequence.startFrame);
    const behaviorGaps = fluorite.conversionSupport?.missingCapabilities.find(
      item => item.capability === 'skillBehavior',
    )?.skillGroupKeys;

    expect(serialized).toContain('abilityentity_chr_0022_bounda_normal_skill');
    expect(serialized).toContain('jumpTimeline');
    expect(serialized).toContain('"destinationFrame":89');
    expect(serialized).toContain('"destinationFrame":149');
    expect(frames).not.toEqual(expect.arrayContaining([99, 159]));
    expect(behaviorGaps ?? []).not.toContain('battleSkill');
  });

  it('Lifeng 终结技把外层 IfElse 跳转保留为一次性局部条件分支', () => {
    const serialized = JSON.stringify([lifengUltimate, lifeng.abilityEntityDefinitions]);
    const frames = lifengUltimate.scheduledSequences.map(sequence => sequence.startFrame);

    expect(serialized).toContain('"childSkill":');
    expect(serialized).toContain('"destinationFrame":150');
    expect(serialized).toContain('"key":"EntityBB_isCombo"');
    const jumpIndex = serialized.indexOf('"destinationFrame":150');
    expect(jumpIndex).toBeLessThan(serialized.indexOf('"key":"EntityBB_isCombo"', jumpIndex));
    expect(frames).not.toEqual(expect.arrayContaining([64, 124, 179]));
  });

  it('Rossi 爪印 Buff 同时保留固定周期伤害与无条件防守侧减伤', () => {
    const serialized = JSON.stringify([
      rossiBattleSkill,
      rossi.buffDefinitions?.buff_chr_0028_wulfa_normal_defup,
    ]);

    expect(serialized).toContain('buff_chr_0028_wulfa_normal_defup');
    expect(serialized).toContain('buffInterval');
    expect(serialized).toContain('"enabledSide":"defender"');
    expect(serialized).toContain('"zone":"product"');
    expect(serialized).toContain('"blackboardKey":"defup"');
    expect(serialized.split('32:buff_chr_0028_wulfa_normal_defup12:buffInterval').length - 1).toBe(
      4,
    );
  });

  it('Rossi ultimate preserves its ultimate-only critical-damage modifier', () => {
    const serialized = JSON.stringify([
      rossiUltimate,
      rossi.buffDefinitions?.buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed,
    ]);

    expect(serialized).toContain('buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed');
    expect(serialized).toContain('"tags":["ultimateSkill"]');
    expect(serialized).toContain('"kind":"instantAttribute"');
    expect(serialized).toContain('"attribute":"criticalDamageIncrease"');
    expect(serialized).toContain('"blackboardKey":"critical_damage_up_to_bleed"');
  });

  it('Rossi 二段连携在等待 Buff 到期后把动态触发次数传给伤害 Buff', () => {
    const serialized = JSON.stringify([
      rossiComboSkill2,
      rossi.buffDefinitions?.buff_chr_0028_wulfa_combo_2_damagewait,
      rossi.buffDefinitions?.buff_chr_0028_wulfa_combo_2_damage,
    ]);

    expect(serialized).toContain('buff_chr_0028_wulfa_combo_2_damagewait');
    expect(serialized).toContain('buff_chr_0028_wulfa_combo_2_damage');
    expect(serialized).toContain('"maxTriggerCount":{"blackboardKey":"trigger_times"}');
    expect(serialized).toContain('"target":"enemy"');
    expect(serialized).toContain('combo_2_damage:trigger');
    expect(
      serialized.split('34:buff_chr_0028_wulfa_combo_2_damage12:buffInterval').length - 1,
    ).toBe(4);
  });

  it('Rossi 二段连携只在 QTE 有效计时 Buff 内写入精准衔接状态', () => {
    const serialized = JSON.stringify([
      rossiComboSkill2,
      rossi.buffDefinitions?.buff_chr_0028_wulfa_combo_2_qte_timerlistening,
      rossi.buffDefinitions?.buff_chr_0028_wulfa_combo_2_qte_timer,
    ]);

    expect(serialized).toContain('buff_chr_0028_wulfa_combo_2_qte_timerlistening');
    expect(serialized).toContain('buff_chr_0028_wulfa_combo_2_qte_timer');
    expect(serialized).toContain('"event":"beforeCastSkill"');
    expect(serialized).toContain('"kind":"eventSkillTypeIn","skillTypes":["comboSkill"]');
    expect(serialized).toContain('"key":"EntityBB_Combo_QTE_Trigger"');
  });

  it.each(generatedOperators)('每个技能都被分配到技能组', (operator, count) => {
    const skills = operator.skillGroups.flatMap(group => [
      ...(Array.isArray(group.skills) ? group.skills : [group.skills]),
      ...(group.variants ?? []).flatMap(variant =>
        Array.isArray(variant.skills) ? variant.skills : [variant.skills],
      ),
    ]);

    expect(skills).toHaveLength(count);
    expect(new Set(skills.map(skill => skill.key)).size).toBe(count);
    expect(
      skills.filter(skill => skill.scheduledSequences.length === 0).map(skill => skill.key),
    ).toEqual([]);
  });

  it.each([
    [laevatain, 4],
    [yvonne, 6],
  ] as const)('%s 的终结技开场与强化普攻形态链严格分层', (operator, variantLength) => {
    const ultimate = operator.skillGroups.find(group => group.key === 'ultimate');
    const basicAttack = operator.skillGroups.find(group => group.key === 'basicAttack');
    expect(ultimate).toBeDefined();
    expect(Array.isArray(ultimate!.skills) ? ultimate!.skills : [ultimate!.skills]).toHaveLength(1);
    expect(basicAttack?.variants).toHaveLength(1);
    expect(basicAttack?.variants?.[0]?.key).toBe('enhancedBasicAttack');
    expect(basicAttack?.variants?.[0]?.levelSource).toBe('ultimate');
    expect(
      Array.isArray(basicAttack!.variants![0]!.skills)
        ? basicAttack!.variants![0]!.skills
        : [basicAttack!.variants![0]!.skills],
    ).toHaveLength(variantLength);
  });

  it.each(generatedOperators)('尚无可执行行为的养成定义必须保留对应缺口', operator => {
    const capabilities = new Set(
      operator.conversionSupport?.missingCapabilities.map(item => item.capability),
    );

    expect(operator.conversionSupport?.completeness).toBe(
      capabilities.size === 0 ? 'complete' : 'partial',
    );

    if (operator.talents.some(talent => !hasUpgradeBehavior(talent))) {
      expect(capabilities.has('talentEffects')).toBe(true);
    }
    if (operator.potentials.some(potential => !hasUpgradeBehavior(potential))) {
      expect(capabilities.has('potentialEffects')).toBe(true);
    }
  });

  it.each(generatedOperators)('所有技能等级都能编译为运行时程序', operator => {
    for (let level = 1; level <= 12; level += 1) {
      const build: OperatorInstanceDocument = {
        operatorSlug: operator.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: {
          basicAttack: level,
          battleSkill: level,
          comboSkill: level,
          ultimate: level,
        },
        talentStates: {},
      };

      expect(() => compileOperatorDefinitionSkills('operator', build, operator)).not.toThrow();
    }
  });
});
