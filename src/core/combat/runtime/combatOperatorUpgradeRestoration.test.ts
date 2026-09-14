import { expect, it } from 'vitest';
import type { CompiledOperatorUpgradeEventProgram } from '../../compiler/combatProgram';
import { bindRestoredCombatOperatorUpgradeEvents } from './combatOperatorUpgradeRestoration';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { OperatorUpgradeEventRuntime } from './operatorUpgradeEventRuntime';

const program: CompiledOperatorUpgradeEventProgram = {
  key: 'potential:event',
  event: { kind: 'airborneOutput' },
  initialBlackboard: {},
  sequence: {
    steps: [
      {
        kind: 'changeResource',
        parameters: { resource: 'sp', amount: 1, recipient: 'team' },
      },
    ],
  },
};

it('恢复潜能事件时复用原订阅身份且只由当前分支处理函数响应', () => {
  const originalEvents = new CombatSemanticEventRuntime();
  let originalExecutions = 0;
  const original = new OperatorUpgradeEventRuntime(originalEvents, 'operator', [program], () => ({
    execute: () => {
      originalExecutions += 1;
      return true;
    },
    evaluate: () => true,
  }));
  const copied = structuredClone({
    upgrade: original.runtimeState,
    events: originalEvents.runtimeState,
  });
  const restoredEvents = new CombatSemanticEventRuntime(undefined, {
    state: copied.events,
    bindNative: () => {
      throw new Error('fixture has no native subscriptions');
    },
  });
  let restoredExecutions = 0;
  const restored = bindRestoredCombatOperatorUpgradeEvents({
    operatorId: 'operator',
    programs: [program],
    state: copied.upgrade,
    semanticEvents: restoredEvents,
    createExecutor: () => ({
      execute: () => {
        restoredExecutions += 1;
        return true;
      },
      evaluate: () => true,
    }),
  });
  restoredEvents.emit({
    kind: 'airborneOutput',
    sourceOperatorId: 'operator',
    targetId: 'enemy',
  });

  expect(restored.runtimeState).toBe(copied.upgrade);
  expect(copied.events.nextRegistrationId).toBe(originalEvents.runtimeState.nextRegistrationId);
  expect(restoredExecutions).toBe(1);
  expect(originalExecutions).toBe(0);
  restored.dispose();
  original.dispose();
});
