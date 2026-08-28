import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { describe, expect, it } from 'vitest';
import { parseNativeSequenceSource, collectNativeActionNodes } from '../src/source/controlFlow.ts';
import { parseKnownNativeActionLeafSource } from '../src/source/actionLeaf.ts';
import { compileCombatActionSequenceSource } from '../src/compiler/buffRuntimeProjection.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';
import { compileActionSequence } from '../../../src/next/core/compiler/compileSkill';
import { CombatActionSequenceRuntime } from '../../../src/next/core/combat/runtime/combatActionSequenceRuntime';
import { ActionBlackboard } from '../../../src/next/core/combat/runtime/actionBlackboard';

const meta = { isEnable: true, priorityLevel: 'Default', priorityOffset: 0, serverActionIndex: 0 };
const sequence = (actionData: unknown[]) => ({
  actionData,
  onlyExecuteWhenSourceIsMainChar: false,
  onlyExecuteWhenSourceIsGuard: false,
});
const gain = {
  ...meta,
  $type: 'Beyond.Gameplay.Core.ObtainCostAction+Data, Gameplay.Beyond',
  costType: 'Atb',
  isPercentValue: false,
  useUspRecoverTag: false,
  uspRecoverTag: { tagId: 0 },
  ignoreUspGainScalar: false,
  atbSourceType: 'NormalAttack',
  atbGainMethod: 'Gain',
  playObtainAtbEffect: false,
  playObtainAtbAudio: false,
  costValue: scalarFixture(0, 'atb'),
  coefficient: scalarFixture(1),
  atbOnlyMainChar: false,
  source: targetFixture('Source'),
  target: targetFixture('Source'),
};
const once = (child: unknown[] = [gain]) => ({
  ...meta,
  $type: 'Beyond.Gameplay.Core.DoOnceAction+Data, Gameplay.Beyond',
  sequenceActionData: sequence(child),
});
const context = {
  gameplayTagRegistry: fixtureGameplayTagRegistry,
  actionOwnerTarget: 'caster',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'enemy',
  timelineRange: { startFrame: 0, endFrame: 60 },
} as const;
function parse(raw: unknown) {
  return parseNativeSequenceSource(raw, 'skill.sequence', {}, (value, path) =>
    parseKnownNativeActionLeafSource(value, path, {}),
  );
}

describe('DoOnce 技能资源回复的窄投影', () => {
  it('转换结果经正式编译执行：重复命中不重复回复，新施法重新获得机会', () => {
    const compiled = compileActionSequence(
      compileCombatActionSequenceSource(parse(sequence([once(), once()])), context),
      1,
    );
    let calls = 0;
    const makeRuntime = () =>
      new CombatActionSequenceRuntime(
        {
          execute: () => {
            calls++;
            return false;
          },
          evaluate: () => true,
        },
        { blackboard: new ActionBlackboard({ atb: 5 }) },
      );
    const runtime = makeRuntime();
    expect(runtime.createSequence(compiled).executeInstant({})).toBe(true);
    expect(runtime.createSequence(compiled).executeInstant({})).toBe(true);
    expect(calls).toBe(2);
    makeRuntime().createSequence(compiled).executeInstant({});
    expect(calls).toBe(4);
    runtime.reset();
    runtime.createSequence(compiled).executeInstant({});
    expect(calls).toBe(6);
  });

  it('保留子树，两个原生动作使用不同的实例作用域', () => {
    const source = parse(sequence([once(), once()]));
    expect(collectNativeActionNodes(source).map(node => node.metadata.nativeName)).toEqual([
      'DoOnceAction',
      'ObtainCostAction',
      'DoOnceAction',
      'ObtainCostAction',
    ]);
    const compiled = compileCombatActionSequenceSource(source, context);
    expect(compiled.steps).toMatchObject(
      [0, 1].map(index => ({
        kind: 'once',
        parameters: { scopeKey: `skill.sequence.actionData[${index}]` },
        body: {
          steps: [
            {
              kind: 'changeResourceByActionValue',
              parameters: {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                spGainSource: 'normalAttack',
              },
            },
          ],
        },
      })),
    );
  });

  it('未知生命周期、子角色守卫及非资源子动作仍阻断', () => {
    expect(() =>
      compileCombatActionSequenceSource(parse(sequence([once()])), {
        ...context,
        timelineRange: undefined,
      }),
    ).toThrow();
    expect(() =>
      compileCombatActionSequenceSource(
        parse(
          sequence([
            {
              ...once(),
              sequenceActionData: { ...sequence([gain]), onlyExecuteWhenSourceIsMainChar: true },
            },
          ]),
        ),
        context,
      ),
    ).toThrow();
    expect(() =>
      compileCombatActionSequenceSource(parse(sequence([once([once()])])), context),
    ).toThrow();
  });

  it('未知字段不会被控制流读取器吞掉', () => {
    expect(() => parse(sequence([{ ...once(), extra: 1 }]))).toThrow('extra');
  });
});
