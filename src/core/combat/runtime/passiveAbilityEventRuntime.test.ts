import { expect, it, vi } from 'vitest';
import type { AbilityEvent } from '../../../../packages/game-data-contract/src/abilityEvents';
import { AbilityEventDispatcher } from '../events/abilityEventDispatcher';
import { ActionBlackboard } from './actionBlackboard';
import { PassiveAbilityEventRuntime } from './passiveAbilityEventRuntime';
import type { CombatOperationContext } from './skillRuntime';

const responses = [
  {
    event: 'abilityEntityFinished' as const,
    priority: 0,
    sequence: {
      steps: [
        {
          kind: 'changeResource' as const,
          parameters: { resource: 'sp' as const, amount: 1, recipient: 'team' as const },
        },
      ],
    },
  },
];

it('复用被动黑板与所有权，事件目标独立，并在注销后停止响应', () => {
  const dispatcher = new AbilityEventDispatcher<AbilityEvent>();
  const blackboard = new ActionBlackboard({ count: 0 });
  const owner = { blackboard, actionOwnerId: 'owner', actionSourceId: 'owner' };
  const seen: CombatOperationContext[] = [];
  const runtime = new PassiveAbilityEventRuntime(
    {
      evaluate: () => true,
      execute: (_step, context) => {
        seen.push({ ...context! });
        context!.blackboard.assignDynamic('count', context!.blackboard.getNumber('count')! + 1);
        return true;
      },
    },
    owner,
    responses,
    (event, priority, handle) =>
      dispatcher.registerAction(event, priority, ({ payload }) =>
        handle(payload, {
          inputTarget: { kind: 'abilityEntity', instanceId: 7 },
          triggerTarget: null,
        }),
      ),
  );
  const fire = () =>
    dispatcher.dispatch(
      {
        event: 'abilityEntityFinished',
        payload: { sourceId: 'owner', targetId: 'ability-entity:7' },
      },
      [],
    );
  fire();
  fire();
  expect(blackboard.getNumber('count')).toBe(2);
  expect(seen[0]).toMatchObject({
    actionOwnerId: 'owner',
    actionSourceId: 'owner',
    actionInputTarget: { kind: 'abilityEntity', instanceId: 7 },
    event: { kind: 'abilityLifecycle', targetId: 'ability-entity:7' },
  });
  expect(seen[0]!.blackboard).toBe(blackboard);
  expect(seen[0]!.targetContext).not.toBe(seen[1]!.targetContext);
  expect(owner).not.toHaveProperty('event');
  runtime.dispose();
  runtime.dispose();
  fire();
  expect(seen).toHaveLength(2);
});

it('注册中途失败会注销之前已安装的监听', () => {
  const dispose = vi.fn();
  let count = 0;
  expect(
    () =>
      new PassiveAbilityEventRuntime(
        { execute: () => true, evaluate: () => true },
        { blackboard: new ActionBlackboard({}) },
        [...responses, ...responses],
        () => {
          if (++count === 2) throw new Error('registration failed');
          return { dispose };
        },
      ),
  ).toThrow('registration failed');
  expect(dispose).toHaveBeenCalledOnce();
});

it('同步重入后恢复外层事件目标，不污染下一次事件', () => {
  const callbacks: ((payload: unknown) => void)[] = [];
  const seen: string[] = [];
  let nested = false;
  const runtime = new PassiveAbilityEventRuntime(
    {
      evaluate: () => true,
      execute: (_step, context) => {
        const target =
          context!.event && 'targetId' in context!.event ? context!.event.targetId : '';
        seen.push(target);
        if (!nested) {
          nested = true;
          callbacks[0]!({ sourceId: 'owner', targetId: 'inner' });
          expect(context!.event).toMatchObject({ targetId: 'outer' });
        }
        return true;
      },
    },
    { blackboard: new ActionBlackboard({}) },
    responses,
    (_event, _priority, handle) => {
      callbacks.push(handle);
      return { dispose() {} };
    },
  );
  callbacks[0]!({ sourceId: 'owner', targetId: 'outer' });
  callbacks[0]!({ sourceId: 'owner', targetId: 'next' });
  expect(seen).toEqual(['outer', 'inner', 'next']);
  runtime.dispose();
});
