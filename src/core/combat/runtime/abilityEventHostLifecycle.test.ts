import { expect, it, vi } from 'vitest';
import { AbilityEventHostLifecycle } from './abilityEventHostLifecycle';

it('reports failures only after attempting all remaining unregister and child cleanup', () => {
  const host = new AbilityEventHostLifecycle();
  const first = new Error('unregister');
  const second = new Error('child');
  const order: string[] = [];
  host.register({
    dispose: () => {
      throw first;
    },
  });
  host.register({
    dispose: () => {
      order.push('unregister');
    },
  });
  host.onDisable(() => {
    order.push('cleanup');
  });
  host.addChildBuff({
    finish: () => {
      host.addChildBuff({
        finish: () => {
          order.push('late');
          return true;
        },
      });
      throw second;
    },
  });
  host.enable();
  let caught: unknown;
  try {
    host.dispose();
  } catch (error) {
    caught = error;
  }
  expect(caught).toBeInstanceOf(AggregateError);
  expect((caught as AggregateError).errors).toEqual([first, second]);
  expect(order).toEqual(['unregister', 'cleanup', 'late']);
  expect(host.canExecuteAction).toBe(false);
  expect(() => host.dispose()).not.toThrow();
});

it('unregisters then cleans the enabled host, including children created by cleanup', () => {
  const host = new AbilityEventHostLifecycle();
  const order: string[] = [];
  host.register({ dispose: () => order.push('unregister') });
  const late = {
    finish: vi.fn(() => {
      order.push('late');
      return true;
    }),
  };
  host.addChildBuff({
    finish: () => {
      order.push('child');
      expect(host.canExecuteAction).toBe(true);
      expect(host.acceptsEvents).toBe(false);
      host.dispose();
      host.addChildBuff(late);
      return true;
    },
  });
  host.onDisable(() => order.push('cleanup'));
  host.enable();
  host.dispose();
  host.dispose();
  expect(order).toEqual(['unregister', 'cleanup', 'child', 'late']);
  expect(late.finish).toHaveBeenCalledWith('other', null);
  expect(host.canExecuteAction).toBe(false);
  expect(() => host.enable()).toThrow('disposed');
  expect(() => host.addChildBuff(late)).toThrow('disposed');
});

it('can release a failed initialization before enable without enabling its actions', () => {
  const host = new AbilityEventHostLifecycle();
  const finish = vi.fn(() => {
    expect(host.canExecuteAction).toBe(false);
    return true;
  });
  host.addChildBuff({ finish });
  host.dispose();
  expect(finish).toHaveBeenCalledOnce();
});
