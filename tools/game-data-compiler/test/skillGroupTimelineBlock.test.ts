import { describe, expect, it } from 'vitest';
import {
  selectBasicAttackTimelineBlockFrames,
  selectSingleSkillTimelineBlockFrames,
} from '../src/domains/operator/definition.ts';
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
    naturalDurationFrames: 40,
    exclusiveFrame: 40,
    offsetRecordFrame: 0,
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
          { startFrame: 16, endFrame: 30, skillIds: ['native_attack2'], direct: true },
          { startFrame: 0, endFrame: 10, skillIds: ['native_attack5'], direct: true },
        ]),
      ],
      [
        'attack2',
        skill('attack2', 'native_attack2', [
          { startFrame: 24, endFrame: 36, skillIds: ['native_attack1'], direct: true },
          { startFrame: 0, endFrame: 8, skillIds: ['native_attack1'], direct: false },
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
    expect(definitions.get('attack1')?.timelineContinuationSourceSkillId).toBe('native_attack2');
    expect(definitions.get('attack2')?.timelineContinuationSourceSkillId).toBe('native_attack1');
    expect(definitions.get('attack2')?.inputWindows?.allowedNextSkills).toEqual([
      { startFrame: 24, endFrame: 36, sourceSkillIds: ['native_attack1'] },
    ]);
  });

  it('同一顶层目标存在立即退出和稍后续段时采用最早的正数连段窗口', () => {
    const definitions = new Map([
      [
        'attack1',
        skill('attack1', 'native_attack1', [
          { startFrame: 0, endFrame: 8, skillIds: ['native_attack2'], direct: true },
          {
            startFrame: 16,
            endFrame: 30,
            skillIds: ['native_attack1', 'native_attack2'],
            direct: true,
          },
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
    expect(definitions.get('attack1')?.timelineContinuationSourceSkillId).toBe('native_attack2');
  });

  it('同一下一段存在多轮输入窗口时采用第一次可输入的窗口', () => {
    const definitions = new Map([
      [
        'attack1',
        skill('attack1', 'native_attack1', [
          { startFrame: 18, endFrame: 25, skillIds: ['native_attack2'], direct: false },
          { startFrame: 63, endFrame: 70, skillIds: ['native_attack2'], direct: false },
          { startFrame: 93, endFrame: 100, skillIds: ['native_attack2'], direct: false },
          { startFrame: 123, endFrame: 130, skillIds: ['native_attack2'], direct: false },
          { startFrame: 153, endFrame: 160, skillIds: ['native_attack2'], direct: false },
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

    expect(definitions.get('attack1')?.timelineBlockFrames).toBe(18);
    expect(definitions.get('attack1')?.timelineContinuationSourceSkillId).toBe('native_attack2');
    expect(definitions.get('attack1')?.inputWindows?.allowedNextSkills).toEqual([
      { startFrame: 18, endFrame: 25, sourceSkillIds: ['native_attack2'] },
      { startFrame: 63, endFrame: 70, sourceSkillIds: ['native_attack2'] },
      { startFrame: 93, endFrame: 100, sourceSkillIds: ['native_attack2'] },
      { startFrame: 123, endFrame: 130, sourceSkillIds: ['native_attack2'] },
      { startFrame: 153, endFrame: 160, sourceSkillIds: ['native_attack2'] },
    ]);
  });
});

describe('单技能入口的预览宽度', () => {
  it('序列后续段也使用自己的直接输入窗口，不沿用整个动作的独占时长', () => {
    const definitions = new Map([
      [
        'first',
        {
          ...skill('first', 'native.first', [
            { startFrame: 37, endFrame: 65, skillIds: ['native.second'], direct: true },
          ]),
          timelineBlockFrames: 66,
        },
      ],
      [
        'second',
        {
          ...skill('second', 'native.second', [
            { startFrame: 52, endFrame: 72, skillIds: ['native.battle'], direct: true },
            { startFrame: 249, endFrame: 269, skillIds: ['native.battle'], direct: true },
          ]),
          timelineBlockFrames: 260,
        },
      ],
      ['battle', skill('battle', 'native.battle', [])],
    ]);

    selectSingleSkillTimelineBlockFrames(
      definitions,
      [
        {
          skillType: 'comboSkill',
          skillKeys: ['first', 'second'],
          replacementPlacements: { second: 'sequence' },
        },
        { skillType: 'battleSkill', skillKeys: ['battle'], replacementPlacements: {} },
      ],
      new Set(['second']),
    );

    expect(definitions.get('first')?.timelineBlockFrames).toBe(37);
    expect(definitions.get('second')?.timelineBlockFrames).toBe(52);
  });

  it('使用可操作的直接接续，不把内部回调或条件分支当成玩家输入', () => {
    const definitions = new Map([
      [
        'stance',
        {
          ...skill('stance', 'native.stance', [
            { startFrame: 5, endFrame: 20, skillIds: ['native.internal'], direct: true },
            { startFrame: 10, endFrame: 20, skillIds: ['native.stop'], direct: false },
            { startFrame: 50, endFrame: 100, skillIds: ['native.stop'], direct: true },
          ]),
          timelineBlockFrames: 1800,
          naturalDurationFrames: 2100,
          exclusiveFrame: 1799,
        },
      ],
      ['internal', skill('internal', 'native.internal', [])],
      ['stop', skill('stop', 'native.stop', [])],
    ]);

    selectSingleSkillTimelineBlockFrames(
      definitions,
      [
        {
          skillType: 'battleSkill',
          skillKeys: ['stance', 'internal', 'stop'],
          replacementPlacements: { internal: 'internal', stop: 'standard' },
        },
      ],
      new Set(['internal', 'stop']),
    );

    expect(definitions.get('stance')?.timelineBlockFrames).toBe(50);
    expect(definitions.get('stance')?.exclusiveFrame).toBe(1799);
    expect(definitions.get('internal')?.timelineBlockFrames).toBe(0);
  });

  it('没有可路由窗口时，独立可放置技能使用原生无条件结束点', () => {
    const definitions = new Map([
      ['base', skill('base', 'native.base', [])],
      [
        'floating',
        {
          ...skill('floating', 'native.floating', []),
          timelineBlockFrames: 1000,
          scheduledSequences: [
            {
              startFrame: 180,
              endFrame: 181,
              sequence: { steps: [{ kind: 'finishTimeline' as const, parameters: {} }] },
            },
          ],
        },
      ],
    ]);

    selectSingleSkillTimelineBlockFrames(
      definitions,
      [
        {
          skillType: 'comboSkill',
          skillKeys: ['base', 'floating'],
          replacementPlacements: { floating: 'enhanced' },
        },
      ],
      new Set(['floating']),
    );

    expect(definitions.get('floating')?.timelineBlockFrames).toBe(180);
  });
});
