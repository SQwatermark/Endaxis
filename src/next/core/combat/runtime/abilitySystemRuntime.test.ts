import { describe, expect, it } from 'vitest';
import { AbilitySystemRuntime, type AbilitySkillRuntime } from './abilitySystemRuntime';
import type { RuntimeSkillInterruptReason, RuntimeSkillState } from './skillRuntime';

class FixtureRuntime implements AbilitySkillRuntime {
  state: RuntimeSkillState = 'ready';

  constructor(
    readonly skillId: string,
    readonly events: string[],
    readonly skillType: AbilitySkillRuntime['skillType'] = 'battleSkill',
    readonly castId?: string,
    readonly timelineBlockFrames?: number,
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

  it('runs deferred cast preparation after interrupt and before the next skill starts', () => {
    const events: string[] = [];
    const first = new FixtureRuntime('first', events);
    const second = new FixtureRuntime('second', events);
    const ability = new AbilitySystemRuntime({
      skills: [first, second],
      beforePostSkillCastStart: request => events.push(`before:${request.skillId}`),
    });
    expect(ability.tryStartSkill('first')).toBe(true);
    events.length = 0;
    ability.requestPostSkillCast({ skillId: 'second' });

    ability.advanceFrame();

    expect(events).toEqual([
      'tick:first',
      'tick:second',
      'interrupt:first:castNextSkill',
      'before:second',
      'start:second',
    ]);
  });

  it('treats each placed skill as an instruction to replace the previous skill', () => {
    const events: string[] = [];
    const basicAttack = new FixtureRuntime('basic', events, 'basicAttack');
    const equalPriority = new FixtureRuntime('equal', events, 'basicAttack');
    const ultimate = new FixtureRuntime('ultimate', events, 'ultimate');
    const ability = new AbilitySystemRuntime({ skills: [basicAttack, equalPriority, ultimate] });

    expect(ability.tryStartSkill('basic')).toBe(true);
    expect(ability.tryStartSkill('equal')).toBe(true);
    expect(ability.tryStartSkill('ultimate')).toBe(true);
    expect(events).toEqual([
      'start:basic',
      'interrupt:basic:castNextSkill',
      'start:equal',
      'interrupt:equal:castNextSkill',
      'start:ultimate',
    ]);
  });

  it('does not register a positive-duration boundary for a zero-width presentation skill', () => {
    const events: string[] = [];
    const reached: unknown[] = [];
    let actualFrame = 0;
    const skill = new FixtureRuntime('zero', events, 'battleSkill', 'cast:zero', 0);
    const ability = new AbilitySystemRuntime({
      skills: [skill],
      resolveActualFrame: () => actualFrame,
      onSkillOperableBoundaryReached: fact => reached.push(fact),
    });

    expect(ability.tryStartSkill('zero', 'cast:zero')).toBe(true);
    actualFrame = 1;
    ability.advanceFrame();
    expect(reached).toEqual([]);
  });

  it('snapshots the active slot variant at release start and applies changes to later releases', () => {
    const events: string[] = [];
    const base = new FixtureRuntime('ultimate', events, 'ultimate');
    const replacement = new FixtureRuntime('arcana', events, 'ultimate');
    const ability = new AbilitySystemRuntime({
      skills: [base, replacement],
      skillSlotGroups: [
        {
          skillGroupKey: 'ultimate',
          baseSkillKey: 'ultimate',
          replacementSkillKeys: ['arcana'],
        },
      ],
    });

    expect(ability.tryStartSkill('ultimate')).toBe(true);
    expect(ability.changeSkillSlot('ultimate', 'arcana')).toBe('ultimate');
    expect(ability.currentSkillId).toBe('ultimate');

    base.state = 'ended';
    expect(ability.tryStartSkill('ultimate')).toBe(true);
    expect(ability.currentSkillId).toBe('arcana');

    expect(ability.changeSkillSlot('ultimate', 'ultimate')).toBe('arcana');
    expect(ability.currentSkillId).toBe('arcana');
    replacement.state = 'ended';
    expect(ability.tryStartSkill('ultimate')).toBe(true);
    expect(events.filter(event => event.startsWith('start:'))).toEqual([
      'start:ultimate',
      'start:arcana',
      'start:ultimate',
    ]);
  });
});
