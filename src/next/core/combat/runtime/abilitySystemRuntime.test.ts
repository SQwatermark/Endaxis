import { describe, expect, it } from 'vitest';
import { AbilitySystemRuntime, type AbilitySkillRuntime } from './abilitySystemRuntime';
import type { RuntimeSkillInterruptReason, RuntimeSkillState } from './skillRuntime';

class FixtureRuntime implements AbilitySkillRuntime {
  state: RuntimeSkillState = 'ready';

  constructor(
    readonly skillId: string,
    readonly events: string[],
  ) {}

  tryStart(): boolean {
    this.events.push(`start:${this.skillId}`);
    this.state = 'casting';
    return true;
  }

  interrupt(reason: RuntimeSkillInterruptReason): void {
    this.events.push(`interrupt:${this.skillId}:${reason}`);
    this.state = 'ended';
  }

  advanceFrame(): void {
    this.events.push(`tick:${this.skillId}`);
  }
}

describe('AbilitySystemRuntime', () => {
  it('preserves the native buff, skill-list, deferred-cast, action order', () => {
    const events: string[] = [];
    const first = new FixtureRuntime('first', events);
    const second = new FixtureRuntime('second', events);
    const ability = new AbilitySystemRuntime({
      buffRuntime: { advanceFrame: () => events.push('buff') },
      skills: [first, second],
      actionRuntime: { advanceFrame: () => events.push('action') },
    });
    expect(ability.tryStartSkill('first')).toBe(true);
    events.length = 0;
    ability.requestPostSkillCast({ skillId: 'second' });

    ability.advanceFrame();

    expect(events).toEqual([
      'buff',
      'tick:first',
      'tick:second',
      'interrupt:first:castNextSkill',
      'start:second',
      'action',
    ]);
    expect(ability.currentSkillId).toBe('second');
  });

  it('uses a last-write-wins slot instead of queuing deferred casts', () => {
    const events: string[] = [];
    const first = new FixtureRuntime('first', events);
    const second = new FixtureRuntime('second', events);
    const third = new FixtureRuntime('third', events);
    const ability = new AbilitySystemRuntime({ skills: [first, second, third] });
    expect(ability.tryStartSkill('first')).toBe(true);
    events.length = 0;

    ability.requestPostSkillCast({ skillId: 'second' });
    ability.requestPostSkillCast({ skillId: 'third' });
    ability.advanceFrame();

    expect(events).toContain('start:third');
    expect(events).not.toContain('start:second');
    expect(ability.currentSkillId).toBe('third');
  });
});
