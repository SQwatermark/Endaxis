import { describe, expect, it } from 'vitest';
import {
  compileActionSequenceProgram,
  type CompileActionSequenceProgramOptions,
} from '../src/compiler/actionSequenceProgram.ts';
import type { NativeActionNodeSource, NativeSequenceSource } from '../src/source/controlFlow.ts';

type Condition = { readonly kind: 'condition' | 'not' | 'all'; readonly value: string };
type Step =
  | { readonly kind: 'leaf'; readonly value: string }
  | {
      readonly kind: 'conditional';
      readonly condition: Condition;
      readonly whenTrue: readonly Step[];
      readonly whenFalse?: readonly Step[];
      readonly alwaysNext: boolean;
    };

const metadata = {
  nativeType: 'Game.TestAction',
  nativeName: 'TestAction',
  enabled: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 0,
} as const;

function leaf(value: string): NativeActionNodeSource<string> {
  return { metadata, sourcePath: value, body: { kind: 'leaf', value } };
}

function sequence(
  actions: readonly NativeActionNodeSource<string>[],
): NativeSequenceSource<string> {
  return {
    onlyExecuteWhenSourceIsMainCharacter: false,
    onlyExecuteWhenSourceIsGuard: false,
    actions,
  };
}

function options(): CompileActionSequenceProgramOptions<
  string,
  Condition,
  Step,
  readonly string[]
> {
  return {
    initialState: () => [],
    canOmitTerminalCondition: () => true,
    compileCondition: node =>
      node.body.kind === 'leaf' && node.body.value.startsWith('?')
        ? { kind: 'condition', value: node.body.value }
        : null,
    combineConditions: conditions =>
      conditions.length === 1
        ? conditions[0]!
        : { kind: 'all', value: conditions.map(item => item.value).join('&') },
    negateCondition: condition => ({ kind: 'not', value: condition.value }),
    compileLeaf: (node, state) => {
      if (node.body.kind !== 'leaf') throw new Error('expected leaf');
      if (node.body.value.startsWith('save:')) {
        return { steps: [], state: [...state, node.body.value.slice(5)] };
      }
      return {
        steps: [{ kind: 'leaf', value: `${node.body.value}[${state.join(',')}]` }],
        state,
      };
    },
    createConditionalStep: input => ({
      kind: 'conditional',
      condition: input.condition,
      whenTrue: input.whenTrue.steps,
      ...(input.whenFalse === undefined ? {} : { whenFalse: input.whenFalse.steps }),
      alwaysNext: input.alwaysNext,
    }),
    rootFilterError: 'root filter unsupported',
    unsupportedNodeError: node => `${node.sourcePath}: unsupported node`,
  };
}

describe('公共 Action 序列控制流投影', () => {
  it('没有纯条件证明时保留尾部求值；显式允许才可省略', () => {
    const configured = options();
    const source = sequence([leaf('?last')]);
    expect(compileActionSequenceProgram(source, configured).steps).toEqual([]);
    const { canOmitTerminalCondition: _, ...unproven } = configured;
    expect(compileActionSequenceProgram(source, unproven).steps).toHaveLength(1);
  });

  it('条件叶子守卫全部剩余兄弟步骤', () => {
    expect(
      compileActionSequenceProgram(sequence([leaf('?ready'), leaf('a'), leaf('b')]), options()),
    ).toEqual({
      steps: [
        {
          kind: 'conditional',
          condition: { kind: 'condition', value: '?ready' },
          whenTrue: [
            { kind: 'leaf', value: 'a[]' },
            { kind: 'leaf', value: 'b[]' },
          ],
          alwaysNext: false,
        },
      ],
    });
  });

  it('NotNextCheckAction 只反转下一条件并保持后续短路体', () => {
    const negate: NativeActionNodeSource<string> = {
      metadata,
      sourcePath: 'not',
      body: { kind: 'negateNextResult' },
    };
    const result = compileActionSequenceProgram(
      sequence([negate, leaf('?ready'), leaf('a')]),
      options(),
    );
    expect(result.steps[0]).toMatchObject({
      kind: 'conditional',
      condition: { kind: 'not', value: '?ready' },
      whenTrue: [{ kind: 'leaf', value: 'a[]' }],
    });
  });

  it('兄弟叶子共享编译期状态，IfElse 分支使用独立局部状态并继续执行后续兄弟', () => {
    const branch: NativeActionNodeSource<string> = {
      metadata,
      sourcePath: 'branch',
      body: {
        kind: 'ifElse',
        condition: sequence([leaf('?branch')]),
        whenTrue: sequence([leaf('save:true'), leaf('inside')]),
        whenFalse: sequence([leaf('outside')]),
        alwaysNext: true,
      },
    };
    const result = compileActionSequenceProgram(
      sequence([leaf('save:outer'), branch, leaf('after')]),
      options(),
    );
    expect(result.steps).toEqual([
      {
        kind: 'conditional',
        condition: { kind: 'condition', value: '?branch' },
        whenTrue: [{ kind: 'leaf', value: 'inside[true]' }],
        whenFalse: [{ kind: 'leaf', value: 'outside[]' }],
        alwaysNext: true,
      },
      { kind: 'leaf', value: 'after[outer]' },
    ]);
  });

  it('IfElse 条件序列中的 NotNextCheckAction 只反转紧随条件', () => {
    const negate: NativeActionNodeSource<string> = {
      metadata,
      sourcePath: 'not',
      body: { kind: 'negateNextResult' },
    };
    const branch: NativeActionNodeSource<string> = {
      metadata,
      sourcePath: 'branch',
      body: {
        kind: 'ifElse',
        condition: sequence([leaf('?has-target'), negate, leaf('?already-added')]),
        whenTrue: sequence([leaf('gain')]),
        whenFalse: sequence([]),
        alwaysNext: true,
      },
    };

    const projection = options();
    const result = compileActionSequenceProgram(sequence([branch]), {
      ...projection,
      negateCondition: condition => ({ kind: 'not' as const, value: `!${condition.value}` }),
    });
    expect(result.steps[0]).toMatchObject({
      kind: 'conditional',
      condition: { kind: 'all', value: '?has-target&!?already-added' },
      whenTrue: [{ kind: 'leaf', value: 'gain[]' }],
    });
  });

  it('允许领域把已证明等价的 ForEach 折叠为集合步骤并继续编译兄弟节点', () => {
    const loop: NativeActionNodeSource<string> = {
      metadata,
      sourcePath: 'loop',
      body: {
        kind: 'forEach',
        target: {} as never,
        action: sequence([leaf('inside')]),
      },
    };
    const projection = options();
    const result = compileActionSequenceProgram(sequence([loop, leaf('after')]), {
      ...projection,
      compileForEach: (node, state) => ({
        steps: [{ kind: 'leaf' as const, value: `folded:${node.body.action.actions.length}` }],
        state: [...state, 'loop'],
      }),
    });

    expect(result.steps).toEqual([
      { kind: 'leaf', value: 'folded:1' },
      { kind: 'leaf', value: 'after[loop]' },
    ]);
  });
});
