import { describe, expect, it } from 'vitest';
import { compileOperatorDefinitionSkills } from '../../core/compiler/compileScenarioTimeline';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import type { OperatorInstanceDocument } from '../../core/project/schema';
import { gilbertaBattleSkill } from './generated/gilberta.operator.generated';
import { fluoriteBattleSkill } from './generated/fluorite.operator.generated';
import { lifengUltimate } from './generated/lifeng.operator.generated';
import {
  akekuri,
  daPan,
  endministrator,
  estella,
  fluorite,
  gilberta,
  lastRite,
  lifeng,
} from './index';

const generatedOperators: readonly [OperatorDefinition, number][] = [
  [gilberta, 9],
  [lifeng, 9],
  [estella, 9],
  [daPan, 9],
  [akekuri, 9],
  [fluorite, 10],
  [endministrator, 20],
  [lastRite, 9],
];

function hasUpgradeBehavior(
  upgrade: OperatorDefinition['talents'][number] | OperatorDefinition['potentials'][number],
): boolean {
  return (upgrade.modifiers?.length ?? 0) > 0 || (upgrade.eventHandlers?.length ?? 0) > 0;
}

describe('新增的完整技能转换干员', () => {
  it('Gilberta 战技把来源死亡监视 Buff 留在能力实体局部时间轴', () => {
    const serialized = JSON.stringify(gilbertaBattleSkill);

    expect(serialized).toContain('buff_chr_0013_aglina_normal_skill_monitor');
    expect(serialized).toContain('currentAbilityEntity');
    expect(serialized).toContain('finishCurrentAbilityEntityWhenSourceDies');
  });

  it('Fluorite 战技把已证明的根级跳转迁入能力实体局部时间轴', () => {
    const serialized = JSON.stringify(fluoriteBattleSkill);
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
    const serialized = JSON.stringify(lifengUltimate);
    const frames = lifengUltimate.scheduledSequences.map(sequence => sequence.startFrame);

    expect(serialized).toContain('"childSkill":');
    expect(serialized).toContain('"destinationFrame":150');
    expect(serialized).toContain('"key":"EntityBB_isCombo"');
    const jumpIndex = serialized.indexOf('"destinationFrame":150');
    expect(jumpIndex).toBeLessThan(serialized.indexOf('"key":"EntityBB_isCombo"', jumpIndex));
    expect(frames).not.toEqual(expect.arrayContaining([64, 124, 179]));
  });

  it.each(generatedOperators)('每个技能都被分配到技能组', (operator, count) => {
    const skills = operator.skillGroups.flatMap(group =>
      Array.isArray(group.skills) ? group.skills : [group.skills],
    );

    expect(skills).toHaveLength(count);
    expect(new Set(skills.map(skill => skill.key)).size).toBe(count);
    expect(skills.every(skill => skill.scheduledSequences.length > 0)).toBe(true);
  });

  it.each(generatedOperators)('养成缺口与尚无可执行行为的定义保持一致', operator => {
    expect(operator.conversionSupport?.completeness).toBe('partial');
    const capabilities = new Set(
      operator.conversionSupport?.missingCapabilities.map(item => item.capability),
    );

    expect(capabilities.has('talentEffects')).toBe(
      operator.talents.some(talent => !hasUpgradeBehavior(talent)),
    );
    expect(capabilities.has('potentialEffects')).toBe(
      operator.potentials.some(potential => !hasUpgradeBehavior(potential)),
    );
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
