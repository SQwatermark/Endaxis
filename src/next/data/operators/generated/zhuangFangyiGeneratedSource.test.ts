/**
 * 固化庄方宜生成事实中跨 Buff 传参的关键边，防止事件解析重构后只剩子 Buff 身份。
 * 这里验证解包中间层，不承担正式技能行为测试。
 */
import { describe, expect, it } from 'vitest';
import { zhuangFangyiGeneratedSource } from './zhuang-fangyi.generated';

function requireBuff(id: string) {
  const buff = zhuangFangyiGeneratedSource.buffDefinitions.find(item => item.buffId === id);
  if (buff === undefined) throw new Error(`missing generated fixture '${id}'`);
  return buff;
}

describe('zhuangFangyiGeneratedSource', () => {
  it('preserves the ordered sword trigger event and all child Buff assignments', () => {
    const trigger = requireBuff('buff_chr_0030_zhuangfy_normal_skill_trigger_sword');
    const event = trigger.eventActions.find(item => item.event === 'OnBuffTrigger');
    if (event === undefined) throw new Error('missing OnBuffTrigger event');

    expect(event.eventSource).toBe('buff');
    expect(event.orderedActionTypes).toEqual([
      'CompareFloat',
      'PickTargetAction',
      'CreateBuffAction',
      'ModifyDynamicBlackboard',
    ]);
    expect(event.buffApplications).toHaveLength(1);

    const application = event.buffApplications[0]!;
    expect(application.actionIndex).toBe(9);
    expect(application.payload.targetSource).toBe('Context');
    expect(application.payload.targetGroupKey).toBe('swordInst');
    expect(application.payload.inheritSourceSkillCastInfo).toBe(true);
    expect(application.payload.buffs[0]?.buffId).toBe(
      'buff_chr_0030_zhuangfy_sword_triggerd',
    );
    expect(Object.keys(application.payload.buffs[0]!.blackboardAssignments)).toEqual([
      'swordIndex',
      'swordCnt',
      'atk_scale',
      'poise',
      'usp_extra',
      'remain_sword_limit',
      'final_rate',
    ]);
  });
});
