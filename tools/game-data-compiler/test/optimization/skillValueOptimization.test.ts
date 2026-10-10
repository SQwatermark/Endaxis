import { CombatSemanticEventRuntime } from '../../../../src/core/combat/events/combatSemanticEventRuntime';
import { skillFixture } from '../../../../src/test/skillFixture';
import { extractResourceDataNodes } from '../../src/compiler/extractGraphDataNodes.ts';
/** 验证黑板裁剪的真实读取、缺键错误、跨入口保留和序列生命周期。 */
import { describe, expect, it } from 'vitest';
import type { CombatStepForKind } from '../../src/compiler/intermediateDefinitions.ts';
import type { SkillDefinition } from '../../src/compiler/intermediateDefinitions.ts';
import { pruneUnusedGraphSkillValues } from '../../src/compiler/optimization/graphValueOptimization.ts';
import { compileGraphSequence } from '../support/graphSequence.ts';
import { CombatActionSequenceRuntime } from '../../../../src/core/combat/actions/combatActionSequenceRuntime.ts';
import {
  ActionBlackboard,
  resolveActionValueOperand,
} from '../../../../src/core/combat/actions/actionBlackboard.ts';
import { ActionBlackboardOperationExecutor } from '../../../../src/core/combat/actions/actionBlackboardOperationExecutor.ts';
import type {
  ActionGraphNode,
  ActionGraphReference,
  ActionGraphStep,
} from '../../src/compiler/intermediateDefinitions.ts';

const literal = (value: number) => ({ kind: 'constant' as const, value });
const board = (key: string) => ({ kind: 'blackboard' as const, key });
const assign = (key: string, value: number): CombatStepForKind<'modifyActionValue'> => ({
  kind: 'modifyActionValue',
  parameters: { key, operation: 'assign', value: literal(value) },
});
const spend = (key: string): ActionGraphStep => ({
  kind: 'changeResource',
  parameters: {
    resource: 'sp',
    source: { kind: 'owner' },
    targets: { kind: 'owner' },
    amount: board(key),
  },
});
const signal: ActionGraphStep = {
  kind: 'triggerCustomAbilityEvent',
  parameters: {
    eventName: 'fixture',
    eventParam: 0,
    target: 'caster',
  },
};

/** 定义内平铺动作串链；控制动作体先链入同一节点表再引用。 */
function chain(
  nodes: Record<string, ActionGraphNode>,
  prefix: string,
  actions: readonly ActionGraphStep[],
): ActionGraphReference {
  actions.forEach((action, index) => {
    nodes[`${prefix}-${index}`] = {
      action,
      next: index + 1 < actions.length ? `${prefix}-${index + 1}` : null,
    };
  });
  return { $sequence: `${prefix}-0` };
}

function scope(
  nodes: Record<string, ActionGraphNode>,
  prefix: string,
  parameters: CombatStepForKind<'withActionBlackboardScope'>['parameters'],
  ...steps: ActionGraphStep[]
): ActionGraphStep {
  return {
    kind: 'withActionBlackboardScope',
    parameters,
    body: chain(nodes, `${prefix}-body`, steps),
  };
}

function skill(
  build: (nodes: Record<string, ActionGraphNode>) => {
    startFrame: number;
    sequence: ActionGraphReference;
  }[],
  blackboard: SkillDefinition['blackboard'] = {},
): SkillDefinition {
  const nodes: Record<string, ActionGraphNode> = {};
  const scheduledSequences = build(nodes);
  return {
    ...skillFixture({
      key: 'fixture',
      timelineBlockFrames: 30,
      scheduledSequences: [],
      actionGraph: { main: { nodes: {} }, macros: {} },
    }),
    key: 'skill',
    timelineBlockFrames: 30,
    blackboard,
    scheduledSequences,
    actionGraph: { main: { nodes }, macros: {} },
  };
}
const single = (actions: readonly ActionGraphStep[]) =>
  skill(nodes => [{ startFrame: 0, sequence: chain(nodes, 'main', actions) }], undefined);

/** 用同一正式序列运行时执行全部入口，让 scopeKey 复用和父/实体板查找按实际规则发生。 */
function executeSkillPrograms(input: SkillDefinition): readonly number[] {
  const blackboard = new ActionBlackboard(
    Object.fromEntries(
      Object.entries(input.blackboard ?? {}).map(([key, value]) => [
        key,
        typeof value === 'number' ? value : value[0]!,
      ]),
    ),
    new ActionBlackboard(),
  );
  const observed: number[] = [];
  const operations = new ActionBlackboardOperationExecutor({
    execute(step, context) {
      if (step.kind === 'changeResource') {
        observed.push(
          typeof step.parameters.amount === 'number'
            ? step.parameters.amount
            : resolveActionValueOperand(step.parameters.amount, context!.blackboard),
        );
      }
      return true;
    },
    evaluate: () => true,
  });
  const runtime = new CombatActionSequenceRuntime(
    operations,
    { blackboard },
    {},
    new CombatSemanticEventRuntime(),
    'fixture',
  );
  for (const entry of input.scheduledSequences) {
    const program = runtime.createSequence(compileGraphSequence(entry.sequence, input.actionGraph));
    program.reset({});
    program.executeInstant({});
  }
  return observed;
}

describe('技能黑板和算术写入裁剪', () => {
  it.each([false, true])('条件内部写入只有无外部消费者时才能删除：外部读取=%s', externalRead => {
    const input = skill(
      nodes => {
        const condition = chain(nodes, 'condition', [
          assign('local', 5),
          {
            kind: 'checkCondition',
            parameters: {
              condition: {
                kind: 'actionValueCompare',
                left: board('local'),
                operator: 'greater',
                right: literal(0),
              },
            },
          },
        ]);
        return [
          {
            startFrame: 0,
            sequence: chain(nodes, 'entry', [
              {
                kind: 'ifElse',
                parameters: { alwaysNext: true },
                condition,
                whenTrue: { $sequence: null },
                whenFalse: { $sequence: null },
              },
              ...(externalRead ? [spend('local')] : []),
            ]),
          },
        ];
      },
      { local: 0 },
    );
    const result = pruneUnusedGraphSkillValues(input).skill;
    expect(executeSkillPrograms(result)).toEqual(executeSkillPrograms(input));
    expect(
      Object.values(result.actionGraph.main.nodes).some(
        node => node.action.kind === 'modifyActionValue',
      ),
    ).toBe(externalRead);
  });

  it.each([false, true])('分支返回值仅在父节点使用时保留：alwaysNext=%s', alwaysNext => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            {
              kind: 'ifElse',
              parameters: { alwaysNext },
              condition: chain(nodes, 'condition', [signal]),
              whenTrue: chain(nodes, 'body', [assign('unused', 7)]),
              whenFalse: { $sequence: null },
            },
          ]),
        },
      ],
      { unused: 0 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.report.removedWrites).toHaveLength(alwaysNext ? 1 : 0);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
  });

  it('异步读取保护共享值，但不阻止同步区域的独立死写入删除', () => {
    let response: ActionGraphReference;
    const input = skill(
      nodes => {
        response = chain(nodes, 'response', [spend('shared')]);
        return [
          {
            startFrame: 0,
            sequence: chain(nodes, 'main', [
              spend('local'),
              {
                kind: 'listenForCombatEvents',
                parameters: {
                  responses: [
                    {
                      key: 'listener',
                      event: { kind: 'airborneOutput' },
                      sequence: response,
                    },
                  ],
                },
              },
              assign('shared', 7),
              assign('local', 9),
            ]),
          },
        ];
      },
      { local: 3, shared: 1 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.report.removedWrites.map(item => item.key)).toEqual(['local']);
    // 延后执行同一变量板上的事件入口，验证注册之后的写入仍能被观察。
    const executeWithResponse = (value: SkillDefinition) =>
      executeSkillPrograms({
        ...value,
        scheduledSequences: [...value.scheduledSequences, { startFrame: 1, sequence: response! }],
      });
    expect(executeWithResponse(result.skill)).toEqual([3, 7]);
    expect(executeWithResponse(result.skill)).toEqual(executeWithResponse(input));
  });

  it.each(['switch', 'anyCondition'] as const)('%s 的子序列出口连接外层后继', kind => {
    const input = skill(
      nodes => {
        const body = chain(nodes, 'body', [spend('value'), assign('value', 7)]);
        const action: ActionGraphStep =
          kind === 'switch'
            ? {
                kind,
                parameters: { choice: literal(1), alwaysNext: true },
                options: [{ value: literal(1), sequence: body }],
              }
            : { kind, parameters: {}, conditions: [body] };
        return [
          {
            startFrame: 0,
            sequence: chain(nodes, 'main', [action, spend('value'), assign('value', 9)]),
          },
        ];
      },
      { value: 3 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(executeSkillPrograms(result.skill)).toEqual([3, 7]);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
    expect(result.report.removedWrites.map(item => item.path)).toEqual([
      'scheduledSequences[0].sequence→main-2',
    ]);
  });

  it('同步循环保留下一轮读取的写入，但可删除循环结束后的死写入', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            {
              kind: 'repeatByActionValue',
              parameters: { count: literal(2) },
              body: chain(nodes, 'body', [spend('value'), assign('value', 7)]),
            },
            assign('value', 9),
          ]),
        },
      ],
      { value: 3 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(executeSkillPrograms(result.skill)).toEqual([3, 7]);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
    expect(result.report.removedWrites.map(item => item.path)).toEqual([
      'scheduledSequences[0].sequence→main-1',
    ]);
  });

  it('多个调度分别保留跨入口用途，删除不被其他入口观察的末尾写入', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'first', [
            spend('local'),
            assign('local', 9),
            assign('shared', 7),
          ]),
        },
        { startFrame: 1, sequence: chain(nodes, 'second', [spend('shared')]) },
      ],
      { local: 3, shared: 1 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(executeSkillPrograms(result.skill)).toEqual([3, 7]);
    expect(result.report.removedWrites.map(item => item.key)).toEqual(['local']);
  });

  it.each([false, true])('分支末尾写入依据外层后继读取保留：%s', readAfter => {
    const input = skill(
      nodes => {
        const branch = chain(nodes, 'branch', [spend('value'), assign('value', 7)]);
        const condition = chain(nodes, 'condition', [signal]);
        return [
          {
            startFrame: 0,
            sequence: chain(nodes, 'main', [
              {
                kind: 'ifElse',
                parameters: { alwaysNext: true },
                condition,
                whenTrue: branch,
                whenFalse: { $sequence: null },
              },
              ...(readAfter ? [spend('value')] : []),
            ]),
          },
        ];
      },
      { value: 3 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(executeSkillPrograms(result.skill)).toEqual(readAfter ? [3, 7] : [3]);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
    expect(result.report.removedWrites).toHaveLength(readAfter ? 0 : 1);
  });

  it('共享分支合并所有调用点的后继读取', () => {
    const input = skill(
      nodes => {
        const branch = chain(nodes, 'shared', [spend('value'), assign('value', 7)]);
        const condition = chain(nodes, 'condition', [signal]);
        const call: ActionGraphStep = {
          kind: 'ifElse',
          parameters: { alwaysNext: true },
          condition,
          whenTrue: branch,
          whenFalse: { $sequence: null },
        };
        return [{ startFrame: 0, sequence: chain(nodes, 'main', [call, spend('value'), call]) }];
      },
      { value: 3 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.report.removedWrites).toEqual([]);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
  });

  it('保留读取之前的写入，删除同一入口最后一次读取之后的写入', () => {
    const input = {
      ...single([assign('value', 3), spend('value'), assign('value', 7)]),
      blackboard: { value: 0 },
    };
    const result = pruneUnusedGraphSkillValues(input);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
    expect(result.report.removedWrites).toEqual([
      { path: 'scheduledSequences[0].sequence→main-2', key: 'value' },
    ]);
    expect(pruneUnusedGraphSkillValues(result.skill).report.removedWrites).toEqual([]);
  });

  it('后续调度读取和受保护变量不能当作直链末尾的死写入', () => {
    const input = skill(
      nodes => [
        { startFrame: 0, sequence: chain(nodes, 'first', [spend('value'), assign('value', 7)]) },
        { startFrame: 1, sequence: chain(nodes, 'second', [spend('value')]) },
      ],
      { value: 3 },
    );
    expect(executeSkillPrograms(pruneUnusedGraphSkillValues(input).skill)).toEqual([3, 7]);
    const protectedInput = {
      ...single([spend('value'), assign('value', 7)]),
      blackboard: { value: 3 },
    };
    expect(
      pruneUnusedGraphSkillValues(protectedInput, new Set(['value'])).report.removedWrites,
    ).toEqual([]);
  });

  it('后续 Assign 在容差内保留旧值，不能据此删除先前写入', () => {
    const input = {
      ...single([assign('value', 1), assign('value', 1.000005), spend('value')]),
      blackboard: { value: 0 },
    };
    const result = pruneUnusedGraphSkillValues(input);
    expect(executeSkillPrograms(result.skill)).toEqual([1]);
    expect(result.report.removedWrites).toEqual([]);
    const withoutFirst = {
      ...single([assign('value', 1.000005), spend('value')]),
      blackboard: { value: 0 },
    };
    expect(executeSkillPrograms(withoutFirst)[0]).not.toBe(1);
  });

  it('投射物实体赋值是发射动作的输入，不依赖额外作用域节点保留来源', () => {
    const input = single([
      assign('payload', 7),
      {
        kind: 'launchProjectile',
        parameters: {
          inheritActionBlackboard: false,
          entityAssignments: { EntityBB_payload: board('payload') },
          finish: 1,
          recycleDelaySeconds: 0,
        },
        callbacks: [],
      },
    ]);
    const result = pruneUnusedGraphSkillValues({
      ...input,
      blackboard: { payload: 0, unused: 3 },
    });
    expect(result.skill.blackboard).toEqual({ payload: 0 });
    expect(result.report.removedWrites).toEqual([]);
    expect(readKinds(result.skill, result.skill.scheduledSequences[0]!.sequence)).toEqual([
      'modifyActionValue',
      'launchProjectile',
    ]);
  });

  it('删除不影响行为的写入与初值，保留事件且不改变输入', () => {
    const input = single([assign('unused', 3), signal]);
    const withBlackboard: SkillDefinition = {
      ...input,
      blackboard: { unused: [1, 2], neverRead: 8 },
    };
    const before = structuredClone(withBlackboard);
    const result = pruneUnusedGraphSkillValues(withBlackboard);
    expect(result.skill.blackboard).toEqual({});
    expect(readKinds(result.skill, result.skill.scheduledSequences[0]!.sequence)).toEqual([
      'triggerCustomAbilityEvent',
    ]);
    expect(result.report.removedWrites).toHaveLength(1);
    expect(result.report.removedWrites[0]?.key).toBe('unused');
    expect(result.report.removedInitialKeys).toEqual(['unused', 'neverRead']);
    expect(withBlackboard).toEqual(before);
    expect(pruneUnusedGraphSkillValues(result.skill).skill).toBe(result.skill);
  });

  it('沿有用结果反查完整计算链，并保留各等级的初值', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            assign('first', 3),
            {
              kind: 'calculateActionValue',
              parameters: {
                key: 'second',
                operation: 'multiply',
                left: board('first'),
                right: board('scale'),
              },
            },
            {
              kind: 'changeResource',
              parameters: {
                resource: 'sp',
                source: { kind: 'owner' },
                targets: { kind: 'owner' },
                amount: board('second'),
              },
            },
          ]),
        },
      ],
      { first: 1, second: 2, scale: [1, 2, 3], unused: 5 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.report.removedWrites).toEqual([]);
    expect(result.skill.blackboard).toEqual({ first: 1, second: 2, scale: [1, 2, 3] });
  });

  it('无人使用的计算链一起删除，不因目的键 epsilon 自读取把整条链留住', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            assign('first', 3),
            {
              kind: 'calculateActionValue',
              parameters: {
                key: 'second',
                operation: 'multiply',
                left: board('first'),
                right: literal(2),
              },
            },
            signal,
          ]),
        },
      ],
      { first: 1, second: 2 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.report.removedWrites).toHaveLength(2);
    expect(result.skill.blackboard).toEqual({});
  });

  it('未初始化的严格读取仍保留，不能把原来的缺键错误裁掉', () => {
    const input = skill(nodes => [
      {
        startFrame: 0,
        sequence: chain(nodes, 'main', [
          {
            kind: 'calculateActionValue',
            parameters: {
              key: 'unused',
              operation: 'add',
              left: board('missing'),
              right: literal(1),
            },
          },
          signal,
        ]),
      },
    ]);
    expect(pruneUnusedGraphSkillValues(input).skill).toBe(input);
  });

  it('后续时间线和已安装事件监听都使值保持有效', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [assign('later', 3), assign('eventValue', 4), signal]),
        },
        {
          startFrame: 10,
          sequence: chain(nodes, 'later', [
            {
              kind: 'changeResource',
              parameters: {
                resource: 'sp',
                source: { kind: 'owner' },
                targets: { kind: 'owner' },
                amount: board('later'),
              },
            },
          ]),
        },
        {
          startFrame: 0,
          sequence: chain(nodes, 'listener', [
            {
              kind: 'listenForCombatEvents',
              parameters: {
                responses: [
                  {
                    key: 'listener',
                    event: { kind: 'skillHit', skillKey: 'battleSkill', scope: 'operator' },
                    sequence: chain(nodes, 'listener-body', [
                      {
                        kind: 'changeResource',
                        parameters: {
                          resource: 'sp',
                          source: { kind: 'owner' },
                          targets: { kind: 'owner' },
                          amount: board('eventValue'),
                        },
                      },
                    ]),
                  },
                ],
              },
            },
          ]),
        },
      ],
      { later: 0, eventValue: 0 },
    );
    expect(pruneUnusedGraphSkillValues(input).skill).toBe(input);
  });

  it('实体板、养成补丁、带引用身份的写入都保留', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            assign('EntityBB_shared', 1),
            assign('patched', 2),
            { ...assign('named', 3), key: 'saved-reference' },
            signal,
          ]),
        },
      ],
      { EntityBB_shared: 0, patched: 0, named: 0 },
    );
    expect(pruneUnusedGraphSkillValues(input, new Set(['patched'])).skill).toBe(input);
  });

  it('时间线不读取根序列返回值，允许删空无用写入及其输入初值', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            {
              kind: 'calculateActionValue',
              parameters: {
                key: 'unused',
                operation: 'add',
                left: board('input'),
                right: literal(1),
              },
            },
          ]),
        },
      ],
      { input: 1, unused: 0, unrelated: 5 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.report.retainedLifetimePaths).toEqual([]);
    expect(result.skill.scheduledSequences[0]!.sequence.$sequence).toBeNull();
    expect(result.skill.blackboard).toEqual({});
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
  });

  it('父快照覆盖子初值，保留子程序读写涉及的父键，但不裁剪子写入', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            assign('unused', 3),
            scope(
              nodes,
              'child',
              {
                scopeKey: 'child',
                initialValues: { inherited: 1, localUnused: 0 },
                inheritParent: true,
              },
              assign('localUnused', 7),
              spend('inherited'),
            ),
          ]),
        },
      ],
      { inherited: 9, unused: 2 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.report.retainedReason).toBeUndefined();
    expect(result.report.removedInitialKeys).toEqual(['unused']);
    expect(result.report.removedWrites.map(item => item.key)).toEqual(['unused']);
    const remaining = readKinds(result.skill, result.skill.scheduledSequences[0]!.sequence);
    expect(remaining).toEqual(['withActionBlackboardScope']);
    expect(executeSkillPrograms(input)).toEqual([9]);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
  });

  it('同 scopeKey 的后续入口沿用首次创建的父快照，不能按后续 inheritParent=false 删值', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'first', [
            scope(
              nodes,
              'first',
              { scopeKey: 'shared', initialValues: {}, inheritParent: true },
              signal,
            ),
          ]),
        },
        {
          startFrame: 10,
          sequence: chain(nodes, 'second', [
            scope(
              nodes,
              'second',
              { scopeKey: 'shared', initialValues: { inherited: 1 }, inheritParent: false },
              spend('inherited'),
            ),
          ]),
        },
      ],
      { inherited: 9, unused: 2 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.skill.blackboard).toEqual({ inherited: 9 });
    expect(executeSkillPrograms(input)).toEqual([9]);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
  });

  it('shareParentBlackboard 的子写入能被其他入口读取，保留同一父板及近似初值', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            scope(
              nodes,
              'shared',
              {
                scopeKey: 'shared',
                initialValues: {},
                inheritParent: true,
                shareParentBlackboard: true,
              },
              assign('value', 3),
            ),
            spend('value'),
          ]),
        },
      ],
      { value: 3.000001, unused: 9 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.skill.blackboard).toEqual({ value: 3.000001 });
    expect(executeSkillPrograms(input)).toEqual([3.000001]);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
  });

  it('独立子板的 entityAssignments 仍严格读取父板，实体初值被赋值覆盖', () => {
    const input = skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'main', [
            scope(
              nodes,
              'isolated',
              {
                scopeKey: 'isolated',
                initialValues: {},
                inheritParent: false,
                entityInitialValues: { assigned: 1 },
                entityAssignments: { assigned: board('source') },
              },
              spend('assigned'),
            ),
          ]),
        },
      ],
      { source: 6, unused: 9 },
    );
    const result = pruneUnusedGraphSkillValues(input);
    expect(result.skill.blackboard).toEqual({ source: 6 });
    expect(executeSkillPrograms(input)).toEqual([6]);
    expect(executeSkillPrograms(result.skill)).toEqual(executeSkillPrograms(input));
  });

  it('实体整板继承及其外层子作用域继续阻止技能裁剪', () => {
    const escaped: ActionGraphStep = {
      kind: 'spawnAbilityEntity',
      parameters: {
        bornAt: { kind: 'owner' as const },
        abilityEntityId: 'entity',
        dieWhenSourceDies: true,
        inheritActionBlackboard: true,
      },
    };
    for (const build of [
      (nodes: Record<string, ActionGraphNode>) =>
        chain(nodes, 'main', [assign('copied', 1), escaped]),
      (nodes: Record<string, ActionGraphNode>) =>
        chain(nodes, 'main', [
          assign('copied', 1),
          scope(
            nodes,
            'child',
            { scopeKey: 'child', initialValues: {}, inheritParent: true },
            escaped,
          ),
        ]),
      (nodes: Record<string, ActionGraphNode>) =>
        chain(nodes, 'main', [
          assign('copied', 1),
          scope(
            nodes,
            'isolated',
            { scopeKey: 'isolated', initialValues: {}, inheritParent: false },
            escaped,
          ),
        ]),
    ]) {
      const input = skill(nodes => [{ startFrame: 0, sequence: build(nodes) }], {
        copied: 0,
        mayBeReadByChild: 5,
      });
      const result = pruneUnusedGraphSkillValues(input);
      expect(result.skill).toBe(input);
      expect(result.report.retainedReason).toBe('unresolved-blackboard-access');
    }
  });
});

/** 读取入口同层动作的 kind 列表。 */
function readKinds(skillValue: SkillDefinition, reference: ActionGraphReference): string[] {
  const kinds: string[] = [];
  let cursor = reference.$sequence;
  while (cursor !== null) {
    const node = skillValue.actionGraph.main.nodes[cursor];
    if (!node) throw new Error(`missing node ${cursor}`);
    kinds.push(node.action.kind);
    cursor = node.next;
  }
  return kinds;
}

it('无用途夹角计算可正式化，存在跨调度消费者时拒绝发布', () => {
  const angle: ActionGraphStep = {
    kind: 'saveTwoDirectionAngle',
    parameters: {
      outputKey: 'angle',
      direction1Source: { kind: 'source' },
      direction1Target: { kind: 'inputTarget' },
      direction1Type: 'CameraForward',
      direction2Source: { kind: 'source' },
      direction2Target: { kind: 'mainTarget', owner: { kind: 'owner' } },
      direction2Type: 'SourceToTarget',
    },
  };
  const create = (consumed: boolean) =>
    skill(
      nodes => [
        {
          startFrame: 0,
          sequence: chain(nodes, 'write', [
            angle,
            {
              kind: 'modifyActionValue',
              parameters: { key: 'copy', operation: 'assign', value: board('angle') },
            },
          ]),
        },
        ...(consumed ? [{ startFrame: 10, sequence: chain(nodes, 'read', [spend('copy')]) }] : []),
      ],
      { angle: 0, copy: 0 },
    );
  const unused = pruneUnusedGraphSkillValues(create(false));
  expect(unused.skill.actionGraph.main.nodes).toEqual({});
  expect(unused.skill.blackboard).toEqual({});
  expect(() => extractResourceDataNodes(unused.skill.actionGraph)).not.toThrow();
  const used = create(true);
  expect(pruneUnusedGraphSkillValues(used).skill).toBe(used);
  expect(() => extractResourceDataNodes(used.actionGraph)).toThrow(
    'direction angle still affects combat',
  );
});
