/**
 * 固化庄方宜生成事实中跨 Buff 传参的关键边，防止事件解析重构后只剩子 Buff 身份。
 * 这里验证解包中间层，不承担正式技能行为测试。
 */
import { describe, expect, it } from 'vitest';
import { zhuangFangyiGeneratedSource } from './zhuang-fangyi.generated';
import type {
  GeneratedConditionalActionSource,
  GeneratedProjectileLaunchPayload,
} from './generatedOperatorSource';

function requireBuff(id: string) {
  const buff = zhuangFangyiGeneratedSource.buffDefinitions.find(item => item.buffId === id);
  if (buff === undefined) throw new Error(`missing generated fixture '${id}'`);
  return buff;
}

function collectConditionalProjectileLaunches(
  conditions: readonly GeneratedConditionalActionSource[],
): GeneratedProjectileLaunchPayload[] {
  const launches: GeneratedProjectileLaunchPayload[] = [];
  for (const condition of conditions) {
    for (const action of [...condition.succeedActions, ...condition.failActions]) {
      if (action.projectileLaunch !== undefined) launches.push(action.projectileLaunch);
      if (action.nestedCondition !== undefined) {
        launches.push(...collectConditionalProjectileLaunches([action.nestedCondition]));
      }
    }
  }
  return launches;
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

  it('preserves sword generation as a conditional projectile reach event', () => {
    const skill = zhuangFangyiGeneratedSource.skills.find(item => item.key === 'battleSkill');
    if (skill === undefined) throw new Error('missing generated battleSkill fixture');

    const launches = collectConditionalProjectileLaunches(skill.conditionalActions).filter(
      launch => launch.projectileId === 'projectile_chr_0030_zhuangfy_normal_skill_gene_sword',
    );

    expect(launches.length).toBeGreaterThan(0);
    expect(launches.every(launch => launch.skillTriggers.length === 1)).toBe(true);
    expect(launches.every(launch => launch.skillTriggers[0]?.event === 'reach')).toBe(true);
    expect(launches.every(launch =>
      launch.skillTriggers[0]?.skillId ===
      'chr_0030_zhuangfy_normal_skill_gene_sword_projhit',
    )).toBe(true);
  });
});
