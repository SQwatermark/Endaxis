import { describe, expect, it, vi } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { CameraTargetAngleConditionExecutor } from './cameraTargetAngleConditionExecutor';

const delegate = {
  execute: vi.fn(() => false),
  evaluate: vi.fn(() => false),
};

describe('CameraTargetAngleConditionExecutor', () => {
  it('compares the explicit signed angle with a dynamic operand', () => {
    const executor = new CameraTargetAngleConditionExecutor(-45, delegate);

    expect(
      executor.evaluate(
        {
          kind: 'cameraToTargetAngleCompare',
          operator: 'less',
          value: { kind: 'blackboard', key: 'angleLimit' },
        },
        { blackboard: new ActionBlackboard({ angleLimit: 0 }) },
      ),
    ).toBe(true);
  });

  it('fails at the condition site when the cast omitted its spatial input', () => {
    const executor = new CameraTargetAngleConditionExecutor(undefined, delegate);

    expect(() =>
      executor.evaluate(
        {
          kind: 'cameraToTargetAngleCompare',
          operator: 'less',
          value: { kind: 'constant', value: 0 },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toThrow('skill cast requires cameraToTargetSignedAngleDegrees simulation input');
  });
});
