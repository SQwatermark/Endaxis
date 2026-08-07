import { describe, expect, it } from 'vitest';
import { AbilitySystemRuntime, type AbilitySkillRuntime } from './abilitySystemRuntime';
import type { RuntimeSkillInterruptReason, RuntimeSkillState } from './skillRuntime';

class FixtureRuntime implements AbilitySkillRuntime {
  state: RuntimeSkillState = 'ready';
  canInterrupt = false;

  constructor(
    readonly skillId: string,
    readonly events: string[],
    readonly skillType: AbilitySkillRuntime['skillType'] = 'battleSkill',
  ) {}

  canStart(): boolean {
    return this.state !== 'casting';
  }

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

  it('uses native priority and interruptible boundaries for direct player input', () => {
    const events: string[] = [];
    const basicAttack = new FixtureRuntime('basic', events, 'basicAttack');
    const equalPriority = new FixtureRuntime('equal', events, 'basicAttack');
    const ultimate = new FixtureRuntime('ultimate', events, 'ultimate');
    const ability = new AbilitySystemRuntime({ skills: [basicAttack, equalPriority, ultimate] });

    expect(ability.tryStartSkill('basic')).toBe(true);
    expect(ability.tryStartSkill('equal')).toBe(false);
    expect(ability.tryStartSkill('ultimate')).toBe(true);
    expect(events).toEqual(['start:basic', 'interrupt:basic:castNextSkill', 'start:ultimate']);
  });

  it('allows an equal-priority skill only after the current skill becomes interruptible', () => {
    const events: string[] = [];
    const current = new FixtureRuntime('current', events, 'battleSkill');
    const next = new FixtureRuntime('next', events, 'battleSkill');
    const ability = new AbilitySystemRuntime({ skills: [current, next] });

    expect(ability.tryStartSkill('current')).toBe(true);
    expect(ability.tryStartSkill('next')).toBe(false);

    current.canInterrupt = true;
    expect(ability.tryStartSkill('next')).toBe(true);
    expect(events).toEqual(['start:current', 'interrupt:current:castNextSkill', 'start:next']);
  });
});
