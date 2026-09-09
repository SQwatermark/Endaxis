import { createNativeEventFixture } from '../events/nativeEventTestFixture';
import { describe, expect, it, vi } from 'vitest';
import type { CompiledEquipmentContribution } from '../../compiler/compileEquipment';
import type { CombatOperationExecutor } from './skillRuntime';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { EquipmentEventRuntime } from './equipmentEventRuntime';

// 非生命周期用例显式建立已启用实例；门禁用例直接调用构造器验证未启用状态。
function createEnabledEquipmentRuntime(
  ...args: ConstructorParameters<typeof EquipmentEventRuntime>
) {
  const runtime = new EquipmentEventRuntime(...args);
  args[2].forEach((item, index) => {
    if (item.eventHandlers.length || item.enableSequence || item.initializationSequence)
      runtime.enable(index);
  });
  return runtime;
}

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
  it.each(['native', 'compatibility'] as const)(
    '注册不启用，%s 条件与动作只在本能力启用后执行',
    mode => {
      const native = createNativeEventFixture();
      const evaluate = vi.fn(() => true);
      const execute = vi.fn(() => true);
      const createExecutor = vi.fn(() => ({ evaluate, execute }));
      const item = {
        ...contribution,
        eventHandlers:
          mode === 'native'
            ? [
                {
                  ...contribution.eventHandlers[0]!,
                  event: undefined,
                  abilityEvent: 'skillSpGained' as const,
                },
              ]
            : contribution.eventHandlers,
      };
      const runtime = new EquipmentEventRuntime(
        native.semanticEvents,
        'operator:a',
        [item, item],
        createExecutor,
        (_owner, event, priority, handle) =>
          native.dispatcher.registerAction(event, priority, handle),
      );
      const publish = () => {
        if (mode === 'native')
          native.dispatcher.dispatch(
            {
              event: 'skillSpGained',
              payload: {
                sourceOperatorId: 'operator:a',
                source: 'skill',
                gainKind: 'gain',
                requestedAmount: 1,
                amount: 1,
              },
            },
            [],
          );
        else native.emitOutputDamage({ sourceId: 'operator:a', tags: ['normalSkill'] });
      };
      publish();
      expect(createExecutor).not.toHaveBeenCalled();
      expect(evaluate).not.toHaveBeenCalled();
      expect(() => runtime.assertAllEnabled()).toThrow('no completed initialization program');
      runtime.enable(0);
      publish();
      expect(execute).toHaveBeenCalledTimes(1);
      runtime.enable(1);
      expect(() => runtime.assertAllEnabled()).not.toThrow();
      publish();
      expect(execute).toHaveBeenCalledTimes(3);
      runtime.dispose();
      publish();
      expect(execute).toHaveBeenCalledTimes(3);
      expect(() => runtime.enable(0)).toThrow('is not active');
    },
  );

  it('注册中途失败会注销已安装的监听，残留回调不能再执行', () => {
    const disposed = vi.fn();
    const execute = vi.fn(() => true);
    let callback:
      | Parameters<import('./equipmentEventRuntime').RegisterEquipmentAbilityEventAction>[3]
      | undefined;
    expect(() =>
      createEnabledEquipmentRuntime(
        new CombatSemanticEventRuntime(),
        'operator:a',
        [
          {
            ...contribution,
            eventHandlers: ['first', 'second'].map(key => ({
              key,
              abilityEvent: 'skillSpGained',
              sequence: contribution.eventHandlers[0]!.sequence,
            })),
          },
        ],
        () => ({ execute, evaluate: () => true }),
        (_id, _event, _priority, handle) => {
          if (callback !== undefined) throw new Error('registration failed');
          callback = handle;
          return { dispose: disposed };
        },
      ),
    ).toThrow('registration failed');
    expect(disposed).toHaveBeenCalledOnce();
    callback?.({
      event: 'skillSpGained',
      payload: {
        sourceOperatorId: 'operator:a',
        source: 'skill',
        gainKind: 'gain',
        requestedAmount: 1,
        amount: 1,
      },
    });
    expect(execute).not.toHaveBeenCalled();
  });

  it('初始化写入和不同事件响应共用能力黑板，重复事件累计且不同能力隔离', () => {
    const handles: Parameters<
      import('./equipmentEventRuntime').RegisterEquipmentAbilityEventAction
    >[3][] = [];
    const shared = {
      ...contribution,
      blackboard: { counter: 1 },
      eventHandlers: [
        {
          key: 'sp',
          abilityEvent: 'skillSpGained' as const,
          sequence: contribution.eventHandlers[0]!.sequence,
        },
        {
          key: 'enter',
          abilityEvent: 'enterFight' as const,
          sequence: contribution.eventHandlers[0]!.sequence,
        },
      ],
    };
    const runtime = createEnabledEquipmentRuntime(
      new CombatSemanticEventRuntime(),
      'operator:a',
      [shared, shared],
      () => ({
        evaluate: () => true,
        execute: (_step, context) => {
          context!.blackboard.assign({ counter: context!.blackboard.getNumber('counter')! + 1 });
          return true;
        },
      }),
      (_owner, _event, _priority, handle) => {
        handles.push(handle);
        return { dispose: vi.fn() };
      },
    );
    const first = runtime.blackboardFor(0);
    first.assign({ counter: 10 }); // 装配初始化使用的同一对象。
    const gain = {
      event: 'skillSpGained' as const,
      payload: {
        sourceOperatorId: 'operator:a',
        source: 'skill' as const,
        gainKind: 'gain' as const,
        requestedAmount: 1,
        amount: 1,
      },
    };
    handles[0]!(gain);
    handles[0]!(gain);
    handles[1]!({
      event: 'enterFight',
      payload: { sourceId: 'operator:a', targetId: 'operator:a' },
    });
    expect(first.getNumber('counter')).toBe(13);
    expect(runtime.blackboardFor(0)).toBe(first);
    expect(runtime.blackboardFor(1).getNumber('counter')).toBe(1);
    runtime.dispose();
    expect(() => runtime.blackboardFor(0)).toThrow('not active');
  });

  it.each([true, false])('配装复用序列状态但不加全局重入锁：已执行前缀=%s', prefix => {
    let registered:
      | Parameters<import('./equipmentEventRuntime').RegisterEquipmentAbilityEventAction>[3]
      | undefined;
    const calls: string[] = [];
    const emit = (amount: number) =>
      registered?.({
        event: 'skillSpGained',
        payload: {
          sourceOperatorId: 'operator:a',
          source: 'skill',
          gainKind: 'gain',
          requestedAmount: amount,
          amount,
        },
      });
    const runtime = createEnabledEquipmentRuntime(
      new CombatSemanticEventRuntime(),
      'operator:a',
      [
        {
          ...contribution,
          eventHandlers: [
            {
              key: 'reentry',
              abilityEvent: 'skillSpGained',
              sequence: {
                steps: (prefix ? ['prefix', 'emit', 'tail'] : ['emit', 'tail']).map(flag => ({
                  kind: 'setContextFlag',
                  parameters: { flag, value: true, target: 'caster' },
                })),
              },
            },
          ],
        },
      ],
      ({ event }) => ({
        evaluate: () => true,
        execute: (step, context) => {
          if (step.kind !== 'setContextFlag') throw new Error('unexpected step');
          if (!('event' in event) || event.event !== 'skillSpGained')
            throw new Error('unexpected event');
          calls.push(`${step.parameters.flag}:${event.payload.amount}`);
          if (calls.length > 12) throw new Error('equipment response recursively restarted');
          expect(context?.event).toBe(event);
          if (step.parameters.flag === 'emit' && event.payload.amount !== 99) emit(99);
          return true;
        },
      }),
      (_operator, _event, _priority, handle) => {
        registered = handle;
        return { dispose: vi.fn() };
      },
    );
    emit(1);
    emit(2);
    expect(calls).toEqual(
      prefix
        ? ['prefix:1', 'emit:1', 'tail:1', 'prefix:2', 'emit:2', 'tail:2']
        : ['emit:1', 'emit:99', 'tail:99', 'tail:1', 'emit:2', 'emit:99', 'tail:99', 'tail:2'],
    );
    runtime.dispose();
  });

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
    const runtime = createEnabledEquipmentRuntime(
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
    const runtime = createEnabledEquipmentRuntime(
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
    const runtime = createEnabledEquipmentRuntime(events, 'operator:a', [contribution], () => ({
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
    createEnabledEquipmentRuntime(events, 'operator:a', [contribution], createExecutor);

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
    createEnabledEquipmentRuntime(events, 'operator:a', [contribution], () => ({
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
    const runtime = createEnabledEquipmentRuntime(
      events,
      'operator:a',
      [contribution],
      createExecutor,
    );
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
    createEnabledEquipmentRuntime(
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

  it('配装技力响应保留原始载荷，不要求战技来源或正的实增量', () => {
    let registered:
      | Parameters<import('./equipmentEventRuntime').RegisterEquipmentAbilityEventAction>[3]
      | undefined;
    const execute = vi.fn<CombatOperationExecutor['execute']>(() => true);
    const createExecutor = vi.fn<ConstructorParameters<typeof EquipmentEventRuntime>[3]>(() => ({
      execute,
      evaluate: () => true,
    }));
    const runtime = createEnabledEquipmentRuntime(
      new CombatSemanticEventRuntime(),
      'operator:a',
      [
        {
          ...contribution,
          eventHandlers: [
            { ...contribution.eventHandlers[0]!, event: undefined, abilityEvent: 'skillSpGained' },
          ],
        },
      ],
      createExecutor,
      (operatorId, event, _priority, handle) => {
        expect(operatorId).toBe('operator:a');
        expect(event).toBe('skillSpGained');
        registered = handle;
        return { dispose: vi.fn() };
      },
    );
    const payload = {
      sourceOperatorId: 'operator:a',
      source: 'powerAttack' as const,
      gainKind: 'refund' as const,
      requestedAmount: 30,
      amount: 0,
    };
    registered?.({ event: 'skillSpGained', payload });
    expect(execute).toHaveBeenCalledOnce();
    const observed = createExecutor.mock.calls[0]?.[0]?.event;
    expect(observed).toBeDefined();
    if (observed === undefined || !('event' in observed)) throw new Error('expected native event');
    expect(observed.payload).toBe(payload);
    runtime.dispose();
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
    createEnabledEquipmentRuntime(
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
    createEnabledEquipmentRuntime(
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
