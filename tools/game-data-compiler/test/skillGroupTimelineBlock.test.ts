import { describe, expect, it } from 'vitest';
import { selectBasicAttackTimelineBlockFrames } from '../src/domains/operator/definition.ts';
import type { CompiledOperatorActiveSkillRuntimeDefinitionSource } from '../src/domains/operator/activeSkillRuntimeDefinition.ts';

function skill(
  key: string,
  sourceSkillId: string,
  transitions: CompiledOperatorActiveSkillRuntimeDefinitionSource['allowNextSkillTransitions'],
): CompiledOperatorActiveSkillRuntimeDefinitionSource {
  return {
    key,
    sourceSkillId,
    blackboard: {},
    timelineBlockFrames: 0,
    exclusiveFrame: 40,
    costFrame: 0,
    scheduledSequences: [],
    allowNextSkillTransitions: transitions,
  };
}

describe('基础攻击技能块窗口', () => {
  it('按有序下一段筛选窗口，不被跳段和条件快捷退出压成 0 帧', () => {
    const definitions = new Map([
      [
        'attack1',
        skill('attack1', 'native_attack1', [
          { startFrame: 16, skillIds: ['native_attack2'], direct: true },
          { startFrame: 0, skillIds: ['native_attack5'], direct: true },
        ]),
      ],
      [
        'attack2',
        skill('attack2', 'native_attack2', [
          { startFrame: 24, skillIds: ['native_attack1'], direct: true },
          { startFrame: 0, skillIds: ['native_attack1'], direct: false },
        ]),
      ],
    ]);

    selectBasicAttackTimelineBlockFrames(definitions, [
      {
        skillType: 'basicAttack',
        skillKeys: ['attack1', 'attack2'],
        variants: [],
      },
    ]);

    expect(definitions.get('attack1')?.timelineBlockFrames).toBe(16);
    expect(definitions.get('attack2')?.timelineBlockFrames).toBe(24);
  });

  it('同一顶层目标存在立即退出和稍后续段时采用较晚的连段窗口', () => {
    const definitions = new Map([
      [
        'attack1',
        skill('attack1', 'native_attack1', [
          { startFrame: 0, skillIds: ['native_attack2'], direct: true },
          { startFrame: 16, skillIds: ['native_attack1', 'native_attack2'], direct: true },
        ]),
      ],
      ['attack2', skill('attack2', 'native_attack2', [])],
    ]);

    selectBasicAttackTimelineBlockFrames(definitions, [
      {
        skillType: 'basicAttack',
        skillKeys: ['attack1', 'attack2'],
        variants: [],
      },
    ]);

    expect(definitions.get('attack1')?.timelineBlockFrames).toBe(16);
  });
});
