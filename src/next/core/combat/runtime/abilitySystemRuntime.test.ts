import { describe, expect, it } from 'vitest';
import { AbilitySystemRuntime, type AbilitySkillRuntime } from './abilitySystemRuntime';
import type {
  RuntimeSkillInterruptReason,
  RuntimeSkillState,
  RuntimeSkillTransition,
} from './skillRuntime';

class FixtureRuntime implements AbilitySkillRuntime {
  state: RuntimeSkillState = 'ready';
  lastTransition: RuntimeSkillTransition | undefined;
  readonly inheritedBuffs: unknown[] = [];

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

  interrupt(reason: RuntimeSkillInterruptReason, transition?: RuntimeSkillTransition): void {
    this.lastTransition = transition;
    this.events.push(`interrupt:${this.skillId}:${reason}`);
    this.state = 'ended';
  }

  attachInheritedBuff(buff: never): void {
    this.inheritedBuffs.push(buff);
  }

  advanceFrame(): void {
    this.events.push(`tick:${this.skillId}`);
  }
}

describe('AbilitySystemRuntime', () => {
  it('目录按每个身份先冷却再动作，空槽只推进冷却，重复放置不重复推进', () => {
    const events: string[] = [];
    const ability = new AbilitySystemRuntime({
      skills: [
        new FixtureRuntime('second', events),
        new FixtureRuntime('first', events, 'battleSkill', 'a'),
        new FixtureRuntime('first', events, 'battleSkill', 'b'),
      ],
      buffRuntime: { advanceFrame: () => events.push('buff') },
      actionRuntime: { advanceFrame: () => events.push('action') },
      skillTickPlan: ['first', 'unplaced', 'second'].map(skillId => ({
        skillId,
        advanceCooldown: delta => {
          expect(delta).toBe(1 / 30);
          events.push(`cooldown:${skillId}`);
        },
      })),
    });
    ability.advanceFrame();
    expect(events).toEqual([
      'buff',
      'cooldown:first',
      'tick:first',
      'tick:first',
      'cooldown:unplaced',
      'cooldown:second',
      'tick:second',
      'action',
    ]);
  });

  it('目录冷却消费原始冷却增量，放置实例只消费时间线增量', () => {
    const skill = new FixtureRuntime('first', []);
    let received: number[] = [];
    const ability = new AbilitySystemRuntime({
      skills: [
        Object.assign(skill, {
          advance: (timeline: number, cooldown: number) => {
            received = [timeline, cooldown];
          },
        }),
      ],
      skillTickPlan: [{ skillId: 'first', advanceCooldown: delta => expect(delta).toBe(0.2) }],
      resolveTickDeltas: () => ({
        defaultDeltaSeconds: 1,
        globalScaledDeltaSeconds: 0.5,
        selfScaledDeltaSeconds: 0.1,
        skillCooldownDeltaSeconds: 0.2,
      }),
    });
    ability.advanceFrame();
    expect(received).toEqual([0.1, 0]);
  });

  it('显式推进目录不能重复或漏掉可执行技能', () => {
    const entry = { skillId: 'first', advanceCooldown: () => {} };
    expect(() => new AbilitySystemRuntime({ skills: [], skillTickPlan: [entry, entry] })).toThrow(
      'duplicate skill tick identity',
    );
    expect(
      () =>
        new AbilitySystemRuntime({ skills: [new FixtureRuntime('first', [])], skillTickPlan: [] }),
    ).toThrow('missing from tick plan');
  });
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

  it('exposes the next native skill identity and exact Buff transfer port during interruption', () => {
    const events: string[] = [];
    const first = new FixtureRuntime('first', events);
    const second = Object.assign(new FixtureRuntime('second', events), {
      transitionSkillId: 'native.second',
    });
    const ability = new AbilitySystemRuntime({ skills: [first, second] });
    const buff = { finish: () => true };

    ability.tryStartSkill('first');
    ability.tryStartSkill('second');
    first.lastTransition?.attachBuffToNextSkill(buff);

    expect(first.lastTransition?.nextSkillId).toBe('native.second');
    expect(second.inheritedBuffs).toEqual([buff]);
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

  it('preserves each stable input until a shared slot replacement becomes active', () => {
    const events: string[] = [];
    const base = new FixtureRuntime('battleSkill', events, 'battleSkill');
    const comboInput = new FixtureRuntime('battleSkillCombo', events, 'battleSkill');
    const end = new FixtureRuntime('battleSkillEnd', events, 'battleSkill');
    const ability = new AbilitySystemRuntime({
      skills: [base, comboInput, end],
      skillSlotGroups: [
        {
          skillGroupKey: 'battleSkill',
          baseSkillKey: 'battleSkill',
          stableInputSkillKeys: ['battleSkill', 'battleSkillCombo'],
          replacementSkillKeys: ['battleSkillEnd'],
        },
      ],
    });

    expect(ability.tryStartSkill('battleSkillCombo')).toBe(true);
    expect(ability.currentSkillId).toBe('battleSkillCombo');
    comboInput.state = 'ended';

    expect(ability.changeSkillSlot('battleSkill', 'battleSkillEnd')).toBe('battleSkill');
    expect(ability.tryStartSkill('battleSkillCombo')).toBe(true);
    expect(ability.currentSkillId).toBe('battleSkillEnd');
    end.state = 'ended';

    expect(ability.changeSkillSlot('battleSkill', 'battleSkill')).toBe('battleSkillEnd');
    expect(ability.tryStartSkill('battleSkillCombo')).toBe(true);
    expect(ability.currentSkillId).toBe('battleSkillCombo');
  });

  it('compares an explicitly placed player skill with the current slot result', () => {
    const events: string[] = [];
    const ability = new AbilitySystemRuntime({
      skills: [
        new FixtureRuntime('battleSkill', events, 'battleSkill'),
        new FixtureRuntime('battleSkillCombo', events, 'battleSkill'),
        new FixtureRuntime('battleSkillEnd', events, 'battleSkill'),
      ],
      skillSlotGroups: [
        {
          skillGroupKey: 'battleSkill',
          baseSkillKey: 'battleSkill',
          stableInputSkillKeys: ['battleSkill', 'battleSkillCombo'],
          replacementSkillKeys: ['battleSkillEnd'],
        },
      ],
    });

    expect(ability.resolvePlayerInputSkill('battleSkillCombo')).toEqual({
      accepted: true,
      actualSkillKey: 'battleSkillCombo',
    });
    expect(ability.resolvePlayerInputSkill('battleSkillEnd')).toEqual({
      accepted: false,
      actualSkillKey: 'battleSkill',
    });

    ability.changeSkillSlot('battleSkill', 'battleSkillEnd');

    expect(ability.resolvePlayerInputSkill('battleSkillCombo')).toEqual({
      accepted: false,
      actualSkillKey: 'battleSkillEnd',
    });
    expect(ability.resolvePlayerInputSkill('battleSkillEnd')).toEqual({
      accepted: true,
      actualSkillKey: 'battleSkillEnd',
    });
  });

  it('does not redirect an explicit native CastSkill id through the active input slot', () => {
    const events: string[] = [];
    const base = new FixtureRuntime('battleSkill', events, 'battleSkill');
    const combo = new FixtureRuntime('battleSkillCombo', events, 'battleSkill');
    const end = new FixtureRuntime('battleSkillEnd', events, 'battleSkill');
    const ability = new AbilitySystemRuntime({
      skills: [base, combo, end],
      skillSlotGroups: [
        {
          skillGroupKey: 'battleSkill',
          baseSkillKey: 'battleSkill',
          stableInputSkillKeys: ['battleSkill', 'battleSkillCombo'],
          replacementSkillKeys: ['battleSkillEnd'],
        },
      ],
    });

    ability.changeSkillSlot('battleSkill', 'battleSkillEnd');
    ability.requestPostSkillCast({ skillId: 'battleSkillCombo', resolveSkillSlot: false });
    ability.advanceFrame();

    expect(ability.currentSkillId).toBe('battleSkillCombo');
  });
});
