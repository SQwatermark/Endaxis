import { describe, expect, it, vi } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { RuntimeTargetContext } from './runtimeTargetContext';
import { TargetContextOperationExecutor } from './targetContextOperationExecutor';
import { BuffOperationExecutor } from './buffOperationExecutor';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import { GameplayTagRegistry, gameplayTagIdFromPath } from '../tags/gameplayTags';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import { validateSkillDefinition } from '../../game-data/validateSkillDefinition';

const terminal = {
  execute: () => false,
  evaluate: () => {
    throw new Error('unsupported');
  },
};
describe('Context 条件查询', () => {
  it.each([
    [16, { kind: 'enemy' }, true],
    [16, { kind: 'operator', operatorId: 'ally' }, false],
    [8, { kind: 'operator', operatorId: 'ally' }, true],
    [512, { kind: 'abilityEntity', instanceId: 1 }, true],
    [0, { kind: 'enemy' }, false],
    [-1, { kind: 'enemy' }, true],
  ] as const)('mask=%s 查询 %j → %s', (mask, target, expected) => {
    const context = {
      blackboard: new ActionBlackboard(),
      targetContext: new RuntimeTargetContext(),
    };
    context.targetContext.setSingle('trigger', target as RuntimeTargetRef);
    expect(
      new TargetContextOperationExecutor('owner', terminal).evaluate(
        { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: mask },
        context,
      ),
    ).toBe(expected);
  });
  it('对象类型检查是任一对象匹配；缺失/空组不凭木桩假设补敌人', () => {
    const executor = new TargetContextOperationExecutor('owner', terminal);
    const context = {
      blackboard: new ActionBlackboard(),
      targetContext: new RuntimeTargetContext(),
    };
    const condition = {
      kind: 'contextTargetObjectTypeMatch' as const,
      contextKey: 'trigger',
      objectTypeMask: 16,
    };
    expect(executor.evaluate(condition, context)).toBe(false);
    context.targetContext.set('trigger', []);
    expect(executor.evaluate(condition, context)).toBe(false);
    context.targetContext.set('trigger', [
      { kind: 'operator', operatorId: 'ally' },
      { kind: 'enemy' },
    ]);
    expect(executor.evaluate(condition, context)).toBe(true);
  });
  it('ByTag 只读取首目标增强层数；空组不求值缺失阈值，非空组严格读取黑板', () => {
    const path = 'test/tag';
    const tag = gameplayTagIdFromPath(path);
    const buffs = new CombatBuffContainer(
      'ally',
      new CombatAttributeSet(),
      new GameplayTagRegistry([path]),
    );
    for (let i = 0; i < 3; i++)
      buffs.add({ id: 'buff', stackingType: 'enhance', applyTags: [tag] }, 'owner');
    const resolve = vi.fn((id: string) => {
      expect(id).toBe('ally');
      return buffs;
    });
    const executor = new BuffOperationExecutor({
      sourceId: 'owner',
      resolveTarget: () => buffs,
      resolveEventTarget: resolve,
      delegate: terminal,
    });
    const context = {
      blackboard: new ActionBlackboard(),
      targetContext: new RuntimeTargetContext(),
    };
    const condition = {
      kind: 'contextTargetBuffStackCompare' as const,
      contextKey: 'trigger',
      tagQueryType: 'hasAny' as const,
      buffTagIds: [tag],
      operator: 'equal' as const,
      value: { kind: 'blackboard' as const, key: 'threshold' },
    };
    expect(executor.evaluate(condition, context)).toBe(false);
    expect(resolve).not.toHaveBeenCalled();
    context.targetContext.set('trigger', [
      { kind: 'operator', operatorId: 'ally' },
      { kind: 'enemy' },
    ]);
    expect(() => executor.evaluate(condition, context)).toThrow('threshold');
    context.blackboard.assign({ threshold: 3 });
    expect(executor.evaluate(condition, context)).toBe(true);
    context.blackboard.assign({ threshold: 1 });
    expect(executor.evaluate(condition, context)).toBe(false);
    buffs.finishByIds(['buff'], 'other');
    context.blackboard.assign({ threshold: 0 });
    expect(executor.evaluate(condition, context)).toBe(true);
  });
  it.each([-2147483649, 2147483648, 0.5, '16'])('正式定义拒绝非法 mask %j', objectTypeMask => {
    expect(
      validateSkillDefinition({
        key: 'test',
        timelineBlockFrames: 1,
        scheduledSequences: [
          {
            startFrame: 0,
            sequence: {
              steps: [
                {
                  kind: 'conditional',
                  parameters: {
                    condition: {
                      kind: 'contextTargetObjectTypeMatch',
                      contextKey: 'trigger',
                      objectTypeMask,
                    },
                  },
                  whenTrue: { steps: [] },
                },
              ],
            },
          },
        ],
      }),
    ).not.toEqual([]);
  });
});
