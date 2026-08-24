import { describe, expect, it } from 'vitest';
import { SkillCooldown } from './skillCooldown';

describe('SkillCooldown', () => {
  it('reserves, advances and becomes ready at the configured frame', () => {
    const cooldown = new SkillCooldown(4, 0);

    expect(cooldown.snapshot).toEqual({
      configured: true,
      ready: true,
      remainingFrames: 0,
      progress: 1,
    });
    expect(cooldown.tryReserve()).toBe(true);
    expect(cooldown.snapshot.remainingFrames).toBe(4);

    expect(cooldown.advanceFrame()).toBe(false);
    expect(cooldown.advanceFrame()).toBe(false);
    expect(cooldown.advanceFrame()).toBe(false);
    expect(cooldown.advanceFrame()).toBe(true);
    expect(cooldown.snapshot.ready).toBe(true);
  });

  it('preserves fractional effective periods produced by native cooldown multipliers', () => {
    const cooldown = new SkillCooldown(8.5, 0);
    cooldown.tryReserve();

    cooldown.advance(8);
    expect(cooldown.snapshot.remainingFrames).toBeCloseTo(0.5);
    expect(cooldown.advance(0.5)).toBe(true);
    expect(cooldown.snapshot.ready).toBe(true);
  });

  it('refunds a reserved charge only before the recovered commit frame', () => {
    const early = new SkillCooldown(10, 3);
    early.tryReserve();
    early.advanceFrame();
    early.advanceFrame();
    expect(early.finishCast()).toBe(true);
    expect(early.snapshot.ready).toBe(true);

    const committed = new SkillCooldown(10, 3);
    committed.tryReserve();
    committed.advanceFrame();
    committed.advanceFrame();
    committed.advanceFrame();
    expect(committed.finishCast()).toBe(false);
    expect(committed.snapshot.ready).toBe(false);
  });

  it('does not restart an unavailable cooldown for an illegal timeline cast', () => {
    const cooldown = new SkillCooldown(10, 0);
    cooldown.tryReserve();
    cooldown.advanceFrame();
    cooldown.advanceFrame();

    expect(cooldown.tryReserve()).toBe(false);
    expect(cooldown.snapshot.remainingFrames).toBe(8);
  });

  it('treats a skill without cooldown configuration as always ready', () => {
    const cooldown = new SkillCooldown();

    expect(cooldown.tryReserve()).toBe(true);
    expect(cooldown.advanceFrame()).toBe(false);
    expect(cooldown.finishCast()).toBe(false);
    expect(cooldown.snapshot).toEqual({
      configured: false,
      ready: true,
      remainingFrames: 0,
      progress: 1,
    });
  });

  it('reduces the remaining cooldown by a ratio of the configured base duration', () => {
    const cooldown = new SkillCooldown(100, 0);
    cooldown.tryReserve();
    cooldown.advance(10);

    expect(cooldown.reduceByBaseDurationRatio(0.5)).toBe(true);
    expect(cooldown.snapshot.remainingFrames).toBe(40);
    expect(cooldown.reduceByBaseDurationRatio(0.5)).toBe(true);
    expect(cooldown.snapshot.ready).toBe(true);
  });

  it('reduces the remaining cooldown by an absolute frame count without going below ready', () => {
    const cooldown = new SkillCooldown(100, 0);
    cooldown.tryReserve();
    cooldown.advance(10);

    expect(cooldown.reduceByFrames(30)).toBe(true);
    expect(cooldown.snapshot.remainingFrames).toBe(60);
    expect(cooldown.reduceByFrames(90)).toBe(true);
    expect(cooldown.snapshot.remainingFrames).toBe(0);
    expect(cooldown.reduceByFrames(1)).toBe(false);
  });

  it('sets remaining cooldown from either the base ratio or absolute frames', () => {
    const cooldown = new SkillCooldown(100, 0);

    expect(cooldown.setByBaseDurationRatio(0.4)).toBe(true);
    expect(cooldown.snapshot.remainingFrames).toBe(40);
    expect(cooldown.setRemainingFrames(12)).toBe(true);
    expect(cooldown.snapshot.remainingFrames).toBe(12);
    expect(cooldown.setRemainingFrames(0)).toBe(true);
    expect(cooldown.snapshot.ready).toBe(true);
  });

  it('sets normalized native timer progress across different base durations', () => {
    const source = new SkillCooldown(100, 0);
    const target = new SkillCooldown(40, 0);
    source.tryReserve();
    source.advance(25);

    expect(target.setProgress(source.snapshot.progress)).toBe(true);
    expect(target.snapshot.progress).toBe(0.25);
    expect(target.snapshot.remainingFrames).toBe(30);
    expect(() => target.setProgress(1.1)).toThrow(
      'skill cooldown progress must be a finite number between 0 and 1',
    );
  });
});
