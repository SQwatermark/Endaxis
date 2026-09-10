import { expect, it, vi } from 'vitest';
import { AbilityEventHostLifecycle } from './abilityEventHostLifecycle';

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
