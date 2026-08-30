import { describe, expect, it } from 'vitest';
import fixtures from '../../../tools/game-data-compiler/test/fixtures/avywenna-return-blackboard.json';
import { compileCombatActionSequenceSource } from '../../../tools/game-data-compiler/src/compiler/buffRuntimeProjection.ts';
import { compileSynchronousProjectileCallbackScopesSource } from '../../../tools/game-data-compiler/src/compiler/projectileCallbackScopes.ts';
import {
  parseDeclaredBlackboard,
  parseBlackboardDataPairs,
} from '../../../tools/game-data-compiler/src/source/blackboard.ts';
import { parseKnownNativeActionLeafSource } from '../../../tools/game-data-compiler/src/source/actionLeaf.ts';
import { parseNativeSequenceSource } from '../../../tools/game-data-compiler/src/source/controlFlow.ts';
import { parseProjectileLaunchActionSource } from '../../../tools/game-data-compiler/src/source/referenceActions.ts';
import type { ActionSequenceDefinition } from '../core/game-data/operatorDefinition';
import { compileActionSequence } from '../core/compiler/compileSkill';
import { validateActionSequenceDefinition } from '../core/game-data/validateSkillDefinition';
import {
  ActionBlackboard,
  resolveActionValueOperand,
} from '../core/combat/runtime/actionBlackboard';
import { ActionBlackboardOperationExecutor } from '../core/combat/runtime/actionBlackboardOperationExecutor';
import { CombatActionSequenceRuntime } from '../core/combat/runtime/combatActionSequenceRuntime';

const projectionContext = {
  actionOwnerTarget: 'caster',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'eventTarget',
} as const;

function makeInput(index = 0) {
  const raw = fixtures[index]!;
  const sourcePath = `${raw.kind}.LaunchProjectile`;
  const launch = parseProjectileLaunchActionSource(raw.launch, sourcePath);
  const parse = (value: unknown, path: string) =>
    parseNativeSequenceSource(value, path, {}, (value, path) =>
      parseKnownNativeActionLeafSource(value, path, {}),
    );
  const write = parse(
    {
      actionData: [raw.hit.write],
      onlyExecuteWhenSourceIsMainChar: false,
      onlyExecuteWhenSourceIsGuard: false,
    },
    `${raw.hit.skillId}.writeSlice`,
  );
  const reach = parse(raw.reach.sequence, `${raw.reach.skillId}.timelineActions[2]`);
  return {
    sourcePath,
    launch,
    // 回归只验证黑板/资源切片，不声称投射物完整轨迹或整个干员已转换。
    template: {
      projectileId: raw.template.projectileId,
      entityBlackboard: parseBlackboardDataPairs(
        raw.template.entityBlackboard,
        `${raw.template.projectileId}.entityBlackboard`,
      ),
    },
    invocations: [
      {
        event: 'hit' as const,
        skillId: raw.hit.skillId,
        declaredBlackboard: parseDeclaredBlackboard(raw.hit, raw.hit.skillId),
        sequence: compileCombatActionSequenceSource(write, projectionContext),
      },
      {
        event: 'reach' as const,
        skillId: raw.reach.skillId,
        declaredBlackboard: parseDeclaredBlackboard(raw.reach, raw.reach.skillId),
        sequence: compileCombatActionSequenceSource(reach, projectionContext),
      },
    ],
  };
}

function run(input: ReturnType<typeof makeInput>, value: number | undefined, hasTalent = true) {
  const step = compileSynchronousProjectileCallbackScopesSource(input);
  const definition: unknown = { steps: [step] };
  expect(validateActionSequenceDefinition(definition)).toEqual([]);
  const parent = new ActionBlackboard(value === undefined ? {} : { talent0_usp: value });
  const gains: number[] = [];
  const operations = new ActionBlackboardOperationExecutor({
    execute: (operation, context) => {
      if (operation.kind !== 'changeResourceByActionValue') throw new Error('unexpected operation');
      expect(operation.parameters.recipient).toBe('caster');
      gains.push(resolveActionValueOperand(operation.parameters.amount, context!.blackboard));
      return true;
    },
    evaluate: condition => {
      if (condition.kind !== 'buffIdStackCompare') throw new Error('unexpected condition');
      expect(condition.target).toBe('caster');
      expect(condition.buffIds).toEqual(['buff_chr_0012_avywen_talent_0']);
      return hasTalent;
    },
  });
  const runtime = new CombatActionSequenceRuntime(operations, { blackboard: parent });
  const sequence = runtime.createSequence(
    compileActionSequence(definition as ActionSequenceDefinition, 1),
  );
  return { parent, gains, execute: () => sequence.executeInstant({}) };
}

describe('投射物同步回调黑板投影（有界切片）', () => {
  it.each(
    [
      [{ key: 'EntityBB_x', value: 'text', isDynamic: false }],
      [{ key: 'EntityBB_x', value: Number.NaN, isDynamic: false }],
      [{ key: 'not_entity', value: 0, isDynamic: false }],
      [
        { key: 'EntityBB_x', value: 0, isDynamic: false },
        { key: 'EntityBB_x', value: 1, isDynamic: true },
      ],
    ].map(entityBlackboard => ({ entityBlackboard })),
  )('拒绝不能安全执行的模板初值 %j', ({ entityBlackboard }) => {
    const input = makeInput();
    expect(() =>
      compileSynchronousProjectileCallbackScopesSource({
        ...input,
        template: { ...input.template, entityBlackboard },
      }),
    ).toThrow('unsupported or duplicate blackboard initial value');
  });
  it('模板缺键且没有命中写入时保持显式报错，不借用角色板或补零', () => {
    const input = makeInput();
    const fixture = run(
      {
        ...input,
        template: { ...input.template, entityBlackboard: [] },
        invocations: [input.invocations[1]!],
      },
      6,
    );
    expect(fixture.execute).toThrow("action blackboard value 'EntityBB_talent0' is missing");
  });
  it.each([0, 1])('回收枪样本 %i 保留写入和两个资源守卫', index => {
    const input = makeInput(index);
    expect(input.invocations[0]!.sequence.steps[0]).toMatchObject({
      kind: 'modifyActionValue',
      parameters: { key: 'EntityBB_talent0', value: { kind: 'blackboard', key: 'talent0_usp' } },
    });
    expect(input.invocations[1]!.sequence.steps[0]).toMatchObject({
      kind: 'conditional',
      parameters: { condition: { kind: 'actionValueCompare', operator: 'greater' } },
      whenTrue: {
        steps: [
          {
            kind: 'conditional',
            parameters: { condition: { kind: 'buffIdStackCompare', target: 'caster' } },
          },
        ],
      },
    });
  });
  it.each(
    [0, 1].flatMap(index =>
      [0, 2, 3, 4, 5, 6].flatMap(value =>
        [false, true].map(hasTalent => ({ index, value, hasTalent })),
      ),
    ),
  )('$index: 原始值 $value / 天赋 Buff $hasTalent 的回能正反例', ({ index, value, hasTalent }) => {
    const fixture = run(makeInput(index), value, hasTalent);
    expect(fixture.execute()).toBe(true);
    expect(fixture.gains).toEqual(value > 0 && hasTalent ? [value] : []);
    expect(fixture.parent.getNumber('EntityBB_talent0')).toBeUndefined();
  });
  it('相同静态发射点多次执行重新取源快照，不沿用旧实体值', () => {
    const fixture = run(makeInput(), 4);
    fixture.execute();
    fixture.parent.assign({ talent0_usp: 6 });
    fixture.execute();
    fixture.parent.assign({ talent0_usp: 0 });
    fixture.execute();
    expect(fixture.gains).toEqual([4, 6]);
  });
  it('assignBlackboard=false 使用子技能原始初值，不偷读发射者', () => {
    const input = makeInput();
    const fixture = run({ ...input, launch: { ...input.launch, assignBlackboard: false } }, 6);
    fixture.execute();
    expect(fixture.gains).toEqual([]);
  });
  it('没有源覆盖时使用子技能已声明的零，而不是在角色实体板补零', () => {
    const fixture = run(makeInput(), undefined);
    fixture.execute();
    expect(fixture.gains).toEqual([]);
    expect(fixture.parent.snapshot()).toEqual({});
  });
  it('关闭的命中不臆造写入；单独到达读取模板的实体初值', () => {
    const input = makeInput();
    const fixture = run({ ...input, invocations: [input.invocations[1]!] }, 6);
    expect(fixture.execute()).toBe(true);
    expect(fixture.gains).toEqual([]);
  });
  it('缺模板证据不能退化为空板，错模板也拒绝', () => {
    const input = makeInput();
    expect(() =>
      compileSynchronousProjectileCallbackScopesSource({ ...input, template: null }),
    ).toThrow('evidence is missing');
    expect(() =>
      compileSynchronousProjectileCallbackScopesSource({
        ...input,
        template: { ...input.template, projectileId: 'other' },
      }),
    ).toThrow('identity mismatch');
  });
  it('实体赋值从父 direct 板求值，重复技能与关闭回调仍不能伪装为支持', () => {
    const input = makeInput();
    const assigned = compileSynchronousProjectileCallbackScopesSource({
      ...input,
      launch: {
        ...input.launch,
        assignEntityBlackboard: true,
        assignments: [
          {
            targetKey: 'EntityBB_talent0',
            valueType: 'Numeric',
            numericValue: 0,
            stringValue: '',
            useDirectValue: false,
            inputValueKey: 'talent0_usp',
          },
        ],
      },
    });
    expect(assigned.parameters.entityAssignments).toEqual({
      EntityBB_talent0: { kind: 'blackboard', key: 'talent0_usp' },
    });
    const fixture = run(
      {
        ...input,
        launch: {
          ...input.launch,
          assignEntityBlackboard: true,
          assignments: [
            {
              targetKey: 'EntityBB_talent0',
              valueType: 'Numeric',
              numericValue: 0,
              stringValue: '',
              useDirectValue: false,
              inputValueKey: 'talent0_usp',
            },
          ],
        },
        invocations: [input.invocations[1]!],
      },
      6,
    );
    expect(fixture.execute()).toBe(true);
    expect(fixture.gains).toEqual([6]);
    expect(() =>
      compileSynchronousProjectileCallbackScopesSource({
        ...input,
        invocations: [input.invocations[0]!, input.invocations[0]!],
      }),
    ).toThrow('dynamic restoration');
    expect(() =>
      compileSynchronousProjectileCallbackScopesSource({
        ...input,
        launch: { ...input.launch, callbacks: [] },
      }),
    ).toThrow('enabled native route');
  });
  it('接收侧 Source 不是 caster，资源动作必须明确拒绝', () => {
    const raw = fixtures[0]!;
    const source = parseNativeSequenceSource(raw.reach.sequence, 'reach', {}, (value, path) =>
      parseKnownNativeActionLeafSource(value, path, {}),
    );
    expect(() =>
      compileCombatActionSequenceSource(source, {
        ...projectionContext,
        actionSourceTarget: 'buffSource',
      }),
    ).toThrow('resource gain source/target');
  });
});
