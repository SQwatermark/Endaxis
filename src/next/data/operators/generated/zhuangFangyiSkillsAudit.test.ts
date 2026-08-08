/**
 * 用真实庄方宜生成结果固定跨步骤动作黑板链路；这里验证生成器闭环，不替代正式干员行为测试。
 */
import { describe, expect, it } from 'vitest';
import { zhuangFangyiComboSkill } from './zhuang-fangyi.skills.audit.generated';

describe('zhuangFangyi generated skill audit', () => {
  it('preserves combo-skill Buff counting and same-frame native order', () => {
    expect(zhuangFangyiComboSkill.scheduledSequences.map(item => item.startFrame)).toEqual([
      24, 24, 24, 24,
    ]);
    expect(
      zhuangFangyiComboSkill.scheduledSequences.map(item => item.sequence.steps[0]?.kind),
    ).toEqual(['conditional', 'dealDamage', 'finishBuffsByTag', 'conditional']);

    const setup = zhuangFangyiComboSkill.scheduledSequences[0]!.sequence.steps[0]!;
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
});
