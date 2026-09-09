import { describe, expect, it } from 'vitest';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from './combatBuffs';
import { BuffProgressRecorder } from '../runtime/buffProgressRecorder';

describe('Buff instance recycling', () => {
  it('退出容器不删除已经完成的进度历史', () => {
    const recorder = new BuffProgressRecorder();
    const owner = new CombatBuffContainer<string>(
      'owner',
      new CombatAttributeSet<string>(),
      undefined,
      null,
      undefined,
      buff => recorder.finish('owner', buff, 1),
    );
    const buff = owner.add({ id: 'history', stackingType: 'unique', durationSeconds: 2 }, 'owner')!;
    recorder.register('owner', buff, 'history', undefined, 0, true);
    buff.finish('other');
    const history = recorder.snapshot();
    owner.recycleFinishedBuffs();
    recorder.sample('owner', owner.buffs, 2);
    expect(owner.buffs).toHaveLength(0);
    expect(recorder.snapshot()).toEqual(history);
    expect(history).toHaveLength(1);
  });

  it('同一个函数的多次订阅可按句柄独立注销', () => {
    const owner = new CombatBuffContainer<never>('owner', new CombatAttributeSet<never>());
    const buff = owner.add({ id: 'callbacks', stackingType: 'unique' }, 'owner')!;
    const order: string[] = [];
    const repeated = () => order.push('repeated');
    buff.onRecycled(repeated);
    buff.onRecycled(() => order.push('middle'));
    buff.onRecycled(repeated).dispose();
    buff.finish('other');
    owner.recycleFinishedBuffs();
    expect(order).toEqual(['repeated', 'middle']);
  });
  it('结束和tick不回收；独立回收幂等且不重复结束', () => {
    let finishes = 0;
    const owner = new CombatBuffContainer<never>(
      'owner',
      new CombatAttributeSet<never>(),
      undefined,
      null,
      undefined,
      () => finishes++,
    );
    const definition = { id: 'buff', stackingType: 'unique' as const };
    const buff = owner.add(definition, 'owner')!;
    let calls = 0;
    buff.onRecycled(instance => {
      expect(instance).toBe(buff);
      expect(owner.buffs).not.toContain(buff);
      calls++;
    });
    const removed = buff.onRecycled(() => {
      throw new Error('disposed callback');
    });
    removed.dispose();
    removed.dispose();
    buff.finish('early');
    owner.tick(1);
    expect(buff.isRecycled).toBe(false);
    expect(calls).toBe(0);
    owner.recycleFinishedBuffs();
    owner.recycleFinishedBuffs();
    expect(calls).toBe(1);
    expect(finishes).toBe(1);
    expect(buff.finishReason).toBe('early');
    expect(owner.add(definition, 'owner')).not.toBe(buff);
  });

  it.each([true, false])('回调改变未访问实例的本轮资格 earlier=%s', earlier => {
    const owner = new CombatBuffContainer<never>('owner', new CombatAttributeSet<never>());
    const first = owner.add({ id: 'first', stackingType: 'unique' }, 'owner')!;
    const second = owner.add({ id: 'second', stackingType: 'unique' }, 'owner')!;
    const trigger = earlier ? second : first;
    const target = earlier ? first : second;
    trigger.onRecycled(() => target.finish('other'));
    trigger.finish('other');
    owner.recycleFinishedBuffs();
    expect(trigger.isRecycled).toBe(true);
    expect(target.isFinished).toBe(true);
    expect(target.isRecycled).toBe(earlier);
    owner.recycleFinishedBuffs();
    expect(target.isRecycled).toBe(true);
  });
});
