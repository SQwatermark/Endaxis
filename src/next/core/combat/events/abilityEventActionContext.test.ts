import { describe, expect, it } from 'vitest';
import {
  hasAbilityEventActionContextBinding,
  resolveAbilityEventActionContextBinding,
} from './abilityEventActionContext';

describe('AbilityEvent action context binding', () => {
  it('binds output Buff receiver as InputTarget and publisher as trigger', () => {
    for (const event of [
      'beforeOutputBuff',
      'outputBuff',
      'beforeOutputPhysicalInfliction',
      'outputHeal',
    ] as const) {
      expect(hasAbilityEventActionContextBinding(event)).toBe(true);
      expect(
        resolveAbilityEventActionContextBinding(event, {
          sourceId: 'operator',
          targetId: 'enemy',
        }),
      ).toEqual({ inputTargetId: 'enemy', triggerTargetId: 'operator' });
    }
  });

  it('binds receiving-side event source as InputTarget and publisher as trigger', () => {
    for (const event of ['beforeAddedBuff', 'addedBuff', 'poiseZero', 'poiseKnotBreak'] as const) {
      expect(
        resolveAbilityEventActionContextBinding(event, {
          sourceId: 'operator',
          targetId: 'enemy',
        }),
      ).toEqual({ inputTargetId: 'operator', triggerTargetId: 'enemy' });
    }
  });

  it('binds Buff consumer as publisher and removed Buff owner as InputTarget', () => {
    for (const event of ['buffConsumed', 'buffAbsorbed'] as const) {
      expect(
        resolveAbilityEventActionContextBinding(event, {
          sourceId: 'camille',
          targetId: 'enemy',
        }),
      ).toEqual({ inputTargetId: 'enemy', triggerTargetId: 'camille' });
    }
  });

  it('preserves native no-target weakness-set context without inventing trigger', () => {
    expect(
      resolveAbilityEventActionContextBinding('weaknessSet', {
        sourceId: 'enemy',
        targetId: 'enemy',
      }),
    ).toEqual({ inputTargetId: 'enemy', triggerTargetId: null });
  });
});
