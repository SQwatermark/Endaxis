import { createNativeEventFixture } from '../events/nativeEventTestFixture';
import { describe, expect, it, vi } from 'vitest';
import type { CompiledEquipmentContribution } from '../../compiler/compileEquipment';
import type { CombatOperationExecutor } from './skillRuntime';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { EquipmentEventRuntime } from './equipmentEventRuntime';

const contribution: CompiledEquipmentContribution = {
  source: { kind: 'weaponTrait', slug: 'fixture-weapon', traitKey: 'skill' },
  selectedLevel: 3,
  modifiers: [],
  eventHandlers: [
    {
      key: 'gain-sp',
      event: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
      condition: { kind: 'combatActive' },
      sequence: {
        steps: [
          {
            kind: 'changeResource',
            parameters: { resource: 'sp', amount: 10, recipient: 'team' },
          },
        ],
      },
    },
  ],
};

describe('EquipmentEventRuntime', () => {
  it.each(['present', 'null', 'missing'] as const)('击倒装备响应保留事件来源：%s', state => {
    const { semanticEvents, dispatcher } = createNativeEventFixture();
    const cast = {
      skillCastId: 7,
      originSkillId: 'original',
      originSkillType: 'battleSkill' as const,
      nonReturnedSpCost: 0,
    };
    const skillCastInfo = state === 'present' ? cast : state === 'null' ? null : undefined;
    const published = {
      event: 'afterOutputKnockDown' as const,
      payload: {
        sourceId: 'operator:a',
        targetId: 'enemy',
        fromAirborne: true,
        skillCastInfo,
      },
    };
    const received: unknown[] = [];
    const runtime = new EquipmentEventRuntime(
      semanticEvents,
      'operator:a',
      [
        {
          ...contribution,
          eventHandlers: [
            {
              key: 'knockdown',
              event: { kind: 'knockDownOutput' },
              sequence: contribution.eventHandlers[0]!.sequence,
            },
          ],
        },
      ],
      () => ({
        execute: (_step, context) => {
          expect(context?.event).toBe(published);
          received.push(context?.eventSkillCastInfo);
          return true;
        },
        evaluate: () => true,
      }),
    );
    dispatcher.dispatch(published, []);
    expect(received).toHaveLength(1);
    expect(received[0]).toBe(skillCastInfo);
    runtime.dispose();
    dispatcher.dispatch(published, []);
    expect(received).toHaveLength(1);
  });
  it('shares initialization and event children with the exact contribution and accepts initialization-only Abilities', () => {
    const { semanticEvents: events, emitOutputDamage } = createNativeEventFixture();
    const finished: string[] = [];
    const child = (id: string) => ({
      finish: () => {
        finished.push(id);
        return true;
      },
    });
    const initializationOnly: CompiledEquipmentContribution = {
      ...contribution,
      source: { kind: 'gearSet', slug: 'initial-only' },
      eventHandlers: [],
      initializationSequence: { steps: [] },
    };
    const staticOnly = { ...contribution, eventHandlers: [] };
    const runtime = new EquipmentEventRuntime(
      events,
      'operator:a',
      [contribution, initializationOnly, staticOnly, staticOnly, initializationOnly],
      () => ({
        execute: (_step, context) => {
          context!.addAbilityChildBuff!(child('event'));
          return true;
        },
        evaluate: () => true,
      }),
    );
    runtime.addChildBuff(0, child('init'));
    // 同定义的两个装备实例保持独立所有权，不能按 slug 合并。
    runtime.addChildBuff(4, child('duplicate-definition'));
    runtime.addChildBuff(1, child('other'));
    emitOutputDamage({ sourceId: 'operator:a', tags: ['normalSkill'] });
    expect(finished).toEqual([]);
    expect(() => runtime.addChildBuff(99, child('invalid'))).toThrow('not active');
    runtime.dispose();
    expect(finished).toEqual(['init', 'event', 'other', 'duplicate-definition']);
    expect(() => runtime.addChildBuff(1, child('late'))).toThrow('not active');
    runtime.dispose();
    expect(finished).toHaveLength(4);
  });

  it('keeps passive Ability children until disposal and cleans them in creation order', () => {
    const { semanticEvents: events, emitOutputDamage } = createNativeEventFixture();
    const finished: number[] = [];
    let nextChild = 0;
    const runtime = new EquipmentEventRuntime(events, 'operator:a', [contribution], () => ({
      execute: (_step, context) => {
        const id = ++nextChild;
        context!.addAbilityChildBuff!({
          finish: () => {
            finished.push(id);
            return true;
          },
        });
        return true;
      },
      evaluate: () => true,
    }));
    for (let count = 0; count < 2; count += 1) {
      emitOutputDamage({ sourceId: 'operator:a', tags: ['normalSkill'] });
    }
    expect(finished).toEqual([]);
    runtime.dispose();
    expect(finished).toEqual([1, 2]);
    runtime.dispose();
    expect(finished).toEqual([1, 2]);
  });
  it('executes a matching handler once with explicit equipment source identity', () => {
    const { semanticEvents: events, emitOutputDamage } = createNativeEventFixture();
    const executed: string[] = [];
    const createExecutor = vi.fn(context => {
      const executor: CombatOperationExecutor = {
        execute: step => {
          executed.push(step.kind);
          return true;
        },
        evaluate: condition => condition.kind === 'combatActive',
      };
      expect(context).toMatchObject({
        operatorId: 'operator:a',
        source: { kind: 'weaponTrait', slug: 'fixture-weapon', traitKey: 'skill' },
        handlerKey: 'gain-sp',
        event: { event: 'outputDamage', payload: { sourceId: 'operator:a' } },
      });
      return executor;
    });
    new EquipmentEventRuntime(events, 'operator:a', [contribution], createExecutor);

    emitOutputDamage({
      sourceId: 'operator:a',
      tags: ['normalSkill'],
    });

    expect(createExecutor).toHaveBeenCalledOnce();
    expect(executed).toEqual(['changeResource']);
  });

  it('does not execute steps when the condition fails', () => {
    const { semanticEvents: events, emitOutputDamage } = createNativeEventFixture();
    const execute = vi.fn(() => true);
    new EquipmentEventRuntime(events, 'operator:a', [contribution], () => ({
      execute,
      evaluate: () => false,
    }));

    emitOutputDamage({
      sourceId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it('stops receiving events after disposal', () => {
    const { semanticEvents: events, emitOutputDamage } = createNativeEventFixture();
    const createExecutor = vi.fn<() => CombatOperationExecutor>(() => ({
      execute: () => true,
      evaluate: () => true,
    }));
    const runtime = new EquipmentEventRuntime(events, 'operator:a', [contribution], createExecutor);
    runtime.dispose();

    emitOutputDamage({
      sourceId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(createExecutor).not.toHaveBeenCalled();
  });

  it('按原生数据动作优先级降序、同级注册顺序执行', () => {
    const { semanticEvents: events, emitOutputDamage } = createNativeEventFixture();
    const executed: string[] = [];
    const handlers = [
      { ...contribution.eventHandlers[0]!, key: 'same-first', priority: 2 },
      { ...contribution.eventHandlers[0]!, key: 'high', priority: 5 },
      { ...contribution.eventHandlers[0]!, key: 'same-second', priority: 2 },
    ];
    new EquipmentEventRuntime(
      events,
      'operator:a',
      [{ ...contribution, eventHandlers: handlers }],
      context => ({
        execute: () => {
          executed.push(context.handlerKey);
          return true;
        },
        evaluate: () => true,
      }),
    );

    emitOutputDamage({
      sourceId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(executed).toEqual(['high', 'same-first', 'same-second']);
  });

  it('配装原样消费技能事件，不从当前技能字段补造遗漏的来源', () => {
    const events = new CombatSemanticEventRuntime();
    let registered:
      | Parameters<import('./equipmentEventRuntime').RegisterEquipmentAbilityEventAction>[3]
      | undefined;
    let observed: unknown;
    const execute = vi.fn<CombatOperationExecutor['execute']>((_step, context) => {
      observed = context?.eventSkillCastInfo;
      return true;
    });
    const createExecutor = vi.fn(
      () =>
        ({
          execute,
          evaluate: () => true,
        }) satisfies CombatOperationExecutor,
    );
    new EquipmentEventRuntime(
      events,
      'operator:a',
      [
        {
          ...contribution,
          eventHandlers: [
            {
              ...contribution.eventHandlers[0]!,
              event: undefined,
              abilityEvent: 'beforeCastSkill',
              priority: 3,
            },
          ],
        },
      ],
      createExecutor,
      (operatorId, event, priority, handle) => {
        expect({ operatorId, event, priority }).toEqual({
          operatorId: 'operator:a',
          event: 'beforeCastSkill',
          priority: 3,
        });
        registered = handle;
        return { dispose: vi.fn() };
      },
    );

    registered?.({
      event: 'beforeCastSkill',
      payload: {
        sourceId: 'operator:a',
        targetId: 'enemy',
        skillType: 'battleSkill',
        skillId: 'skill:a',
        skillCastId: 7,
      },
    });
    expect(createExecutor).toHaveBeenCalledWith(
      expect.objectContaining({
        event: expect.objectContaining({
          event: 'beforeCastSkill',
          payload: expect.objectContaining({ skillCastId: 7 }),
        }),
      }),
    );
    expect(execute).toHaveBeenCalledOnce();
    expect(observed).toBeUndefined();
    expect(execute.mock.calls[0]?.[1]?.eventSkillCastInfo).toBeUndefined();
  });

  it('把公共 AbilityEvent 的 InputTarget 传入配装动作上下文', () => {
    const events = new CombatSemanticEventRuntime();
    let registered:
      | ((
          published: import('../events/abilityEventDispatcher').AbilityEventContext<'outputBuff'>,
          actionContext?: {
            readonly inputTarget: { readonly kind: 'enemy' };
            readonly triggerTarget: { readonly kind: 'operator'; readonly operatorId: string };
          },
        ) => void)
      | undefined;
    let observed: unknown;
    let trigger: unknown;
    const execute = vi.fn<CombatOperationExecutor['execute']>((_step, context) => {
      observed = { ...context };
      trigger = context?.targetContext?.get('trigger');
      return true;
    });
    new EquipmentEventRuntime(
      events,
      'operator:a',
      [
        {
          ...contribution,
          eventHandlers: [
            {
              ...contribution.eventHandlers[0]!,
              event: undefined,
              abilityEvent: 'outputBuff',
            },
          ],
        },
      ],
      () => ({ execute, evaluate: () => true }),
      (_operatorId, _event, _priority, handle) => {
        registered = handle as typeof registered;
        return { dispose: vi.fn() };
      },
    );

    registered?.(
      {
        event: 'outputBuff',
        payload: {
          sourceId: 'operator:a',
          targetId: 'enemy',
          buffId: 'fixture',
          buffTags: [],
        },
      },
      {
        inputTarget: { kind: 'enemy' },
        triggerTarget: { kind: 'operator', operatorId: 'operator:a' },
      },
    );

    expect(execute).toHaveBeenCalledOnce();
    expect(observed).toMatchObject({
      actionOwnerId: 'operator:a',
      actionSourceId: 'operator:a',
      actionInputTarget: { kind: 'enemy' },
    });
    expect(execute.mock.calls[0]?.[1]?.actionInputTarget).toBeUndefined();
    expect(execute.mock.calls[0]?.[1]?.targetContext).toBeUndefined();
    expect(trigger).toEqual([
      {
        kind: 'operator',
        operatorId: 'operator:a',
      },
    ]);
  });
});
