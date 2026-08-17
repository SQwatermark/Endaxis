/**
 * 用真实庄方宜生成结果固定跨步骤动作黑板链路；这里验证生成器闭环，不替代正式干员行为测试。
 */
import { describe, expect, it } from 'vitest';
import {
  zhuangFangyiBasicAttack2,
  zhuangFangyiComboSkill,
  zhuangFangyiEnhancedComboSkill,
} from './zhuang-fangyi.skills.audit.generated';

describe('zhuangFangyi generated skill audit', () => {
  it('moves projected interval hits into the AbilityEntity local timeline', () => {
    const spawn = zhuangFangyiBasicAttack2.scheduledSequences
      .flatMap(sequence => sequence.sequence.steps)
      .find(step => step.kind === 'spawnAbilityEntity');
    if (spawn?.kind !== 'spawnAbilityEntity') throw new Error('expected AbilityEntity spawn');

    expect(spawn.parameters.childSkill?.scheduledSequences.map(item => item.startFrame)).toEqual([
      0, 9, 11, 14,
    ]);
    expect(zhuangFangyiBasicAttack2.scheduledSequences.map(item => item.startFrame)).not.toEqual(
      expect.arrayContaining([24, 26, 29]),
    );
  });

  it('preserves combo-skill Buff counting and same-frame native order', () => {
    expect(zhuangFangyiComboSkill.scheduledSequences.map(item => item.startFrame)).toEqual([
      0, 24, 24,
    ]);
    expect(
      zhuangFangyiComboSkill.scheduledSequences.map(item => item.sequence.steps[0]?.kind),
    ).toEqual([
      'startTimeDilation',
      'conditional',
      'dealDamage',
    ]);
    expect(zhuangFangyiComboSkill.scheduledSequences[2]!.sequence.steps.map(step => step.kind)).toEqual([
      'dealDamage',
      'finishBuffsByTag',
      'conditional',
    ]);

    const setup = zhuangFangyiComboSkill.scheduledSequences[1]!.sequence.steps[0]!;
    if (setup.kind !== 'conditional') throw new Error('expected combo setup condition');
    expect(setup.whenTrue.steps.map(step => step.kind)).toEqual([
      'readBuffStackCount',
      'modifyActionValue',
      'conditional',
      'conditional',
      'applyBuff',
    ]);
    expect(setup.whenTrue.steps[0]).toMatchObject({
      kind: 'readBuffStackCount',
      parameters: {
        target: 'enemy',
        outputKey: 'inflictCnt',
        query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [2123008650] },
      },
    });
  });

  it('keeps enhanced combo primary-target actions without the extra-target ring hit', () => {
    expect(
      zhuangFangyiEnhancedComboSkill.scheduledSequences.map(item => item.startFrame),
    ).toEqual([0, 0, 24, 24]);
    expect(
      zhuangFangyiEnhancedComboSkill.scheduledSequences.map(
        item => item.sequence.steps[0]?.kind,
      ),
    ).toEqual([
      'startTimeDilation',
      'holdBuffsById',
      'conditional',
      'dealDamage',
    ]);
    expect(
      zhuangFangyiEnhancedComboSkill.scheduledSequences[3]!.sequence.steps.map(
        step => step.kind,
      ),
    ).toEqual(['dealDamage', 'finishBuffsByTag']);

    const damage = zhuangFangyiEnhancedComboSkill.scheduledSequences[3]!.sequence.steps[0]!;
    expect(damage).toMatchObject({
      kind: 'dealDamage',
      parameters: {
        damageType: 'electric',
        attackScale: [2.4, 2.64, 2.88, 3.12, 3.36, 3.6, 3.84, 4.08, 4.32, 4.62, 4.98, 5.4],
        stagger: 10,
      },
    });
  });
});
