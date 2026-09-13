import { describe, expect, it } from 'vitest';
import {
  RuntimeCheckpointController,
  type RuntimeCheckpointParticipant,
} from './runtimeCheckpoint';
import { CombatClock } from './combatClock';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatInputRuntime } from './combatInputRuntime';
import { CombatResources } from './combatResources';
import { SharedSpGainModifier, SharedSpRecoveryModifier } from '../resources/sharedSpGainModifiers';
import { ActionBlackboard } from './actionBlackboard';
import { SkillCooldown } from './skillCooldown';

class Counter implements RuntimeCheckpointParticipant<number> {
  value = 0;

  captureCheckpointState(): number {
    return this.value;
  }

  restoreCheckpointState(state: number): void {
    this.value = state;
  }
}

describe('RuntimeCheckpointController', () => {
  it('可以从同一切面反复试探并恢复', () => {
    const controller = new RuntimeCheckpointController(() => 30);
    const counter = new Counter();
    controller.register('counter', counter);
    counter.value = 12;
    const checkpoint = controller.capture();

    counter.value = 40;
    controller.restore(checkpoint);
    expect(counter.value).toBe(12);

    counter.value = 90;
    controller.restore(checkpoint);
    expect(counter.value).toBe(12);
    expect(checkpoint.frame).toBe(30);
  });

  it('拒绝跨运行时恢复', () => {
    const left = new RuntimeCheckpointController(() => 0);
    const right = new RuntimeCheckpointController(() => 0);
    left.register('counter', new Counter());
    right.register('counter', new Counter());

    expect(() => right.restore(left.capture())).toThrow('another runtime');
  });

  it('先校验全部状态，再逆序恢复', () => {
    const calls: string[] = [];
    const controller = new RuntimeCheckpointController(() => 0);
    for (const key of ['foundation', 'dependent']) {
      controller.register(key, {
        captureCheckpointState: () => key,
        validateCheckpointState: () => calls.push(`validate:${key}`),
        restoreCheckpointState: () => calls.push(`restore:${key}`),
      });
    }
    const checkpoint = controller.capture();
    controller.restore(checkpoint);

    expect(calls).toEqual([
      'validate:foundation',
      'validate:dependent',
      'restore:dependent',
      'restore:foundation',
    ]);
  });

  it('第一次保存后冻结参与者拓扑', () => {
    const controller = new RuntimeCheckpointController(() => 0);
    controller.register('counter', new Counter());
    controller.capture();

    expect(() => controller.register('later', new Counter())).toThrow('after the first capture');
  });

  it('恢复时同时回退时钟和回执，且不复制回执前缀', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const controller = new RuntimeCheckpointController(() => clock.frame);
    controller.register('clock', clock);
    controller.register('receipt', receipt);
    clock.advanceFrame();
    receipt.record({ frame: 1, time: 1 / 30, event: 'before' });
    const checkpoint = controller.capture();
    const boundary = receipt.entries[0];

    clock.advanceFrame();
    receipt.record({ frame: 2, time: 2 / 30, event: 'trial' });
    controller.restore(checkpoint);

    expect(clock.frame).toBe(1);
    expect(receipt.entries).toEqual([boundary]);
    expect(receipt.entries[0]).toBe(boundary);
  });

  it('拒绝恢复已经被另一分支覆盖的后代回执切面', () => {
    const receipt = new CombatReceiptCollector();
    const controller = new RuntimeCheckpointController(() => 0);
    controller.register('receipt', receipt);
    const root = controller.capture();
    receipt.record({ frame: 1, time: 1 / 30, event: 'left' });
    const left = controller.capture();

    controller.restore(root);
    receipt.record({ frame: 1, time: 1 / 30, event: 'right' });

    expect(() => controller.restore(left)).toThrow('discarded branch');
  });

  it('恢复输入游标后可以从同一帧重新消费另一条试探分支', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const attempts: string[] = [];
    const inputs = new CombatInputRuntime({
      clock,
      receipt,
      inputs: [
        { frame: 1, operatorId: 'operator', skillId: 'first' },
        { frame: 2, operatorId: 'operator', skillId: 'second' },
      ],
      tryStartSkill: (_operatorId, skillId) => {
        attempts.push(skillId);
        return true;
      },
    });
    const controller = new RuntimeCheckpointController(() => clock.frame);
    controller.register('clock', clock);
    controller.register('receipt', receipt);
    controller.register('inputs', inputs);

    clock.advanceFrame();
    inputs.advanceFrame();
    const checkpoint = controller.capture();
    clock.advanceFrame();
    inputs.advanceFrame();
    controller.restore(checkpoint);
    clock.advanceFrame();
    inputs.advanceFrame();

    expect(attempts).toEqual(['first', 'second', 'second']);
    expect(receipt.entries.map(entry => entry.data?.skillId)).toEqual(['first', 'second']);
  });

  it('完整恢复资源余额、限制句柄和共享修正', () => {
    const resources = new CombatResources({
      sp: 20,
      maxSp: 100,
      returnedSp: 5,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 1, pauseDuration: 2, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      squad: [
        {
          operatorId: 'operator',
          ultimateEnergy: 10,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          allowedUltimateEnergyRecoveryTags: null,
        },
      ],
      normalSkillUltimateEnergy: { selfGainPerSp: 1, otherGainPerSp: 1 },
    });
    const gainModifier = new SharedSpGainModifier('gainEfficiency', 'addition', 0.5, true);
    const recoveryModifier = new SharedSpRecoveryModifier('multiplier', 0.25);
    resources.sharedSpGainModifiers.add(gainModifier);
    resources.sharedSpRecoveryModifiers.add(recoveryModifier);
    const controller = new RuntimeCheckpointController(() => 0);
    controller.register('resources', resources);
    const checkpoint = controller.capture();

    resources.pay('operator', [{ resource: 'sp', value: 10 }]);
    resources.changeUltimateEnergy('operator', 30);
    resources.requestUltimateEnergyRecoveryRestriction('operator', new Set());
    resources.sharedSpGainModifiers.remove(gainModifier);
    resources.sharedSpRecoveryModifiers.remove(recoveryModifier);
    controller.restore(checkpoint);

    expect(resources.sp).toBe(20);
    expect(resources.returnedSp).toBe(5);
    expect(resources.getUltimateEnergy('operator')).toBe(10);
    expect(resources.sharedSpGainModifiers.modifierCount).toBe(1);
    expect(resources.sharedSpRecoveryModifiers.resolve(4)).toBe(5);
    expect(resources.changeUltimateEnergy('operator', 1).applied).toBe(true);
  });

  it('恢复黑板和冷却等技能局部状态', () => {
    const blackboard = new ActionBlackboard({ value: 1 });
    const cooldown = new SkillCooldown(100, 20);
    const controller = new RuntimeCheckpointController(() => 0);
    controller.register('blackboard', blackboard);
    controller.register('cooldown', cooldown);
    const checkpoint = controller.capture();

    blackboard.assignDynamic('value', 5);
    cooldown.tryReserve();
    cooldown.advance(30);
    controller.restore(checkpoint);

    expect(blackboard.getNumber('value')).toBe(1);
    expect(cooldown.snapshot).toMatchObject({ ready: true, remainingFrames: 0 });
  });
});
