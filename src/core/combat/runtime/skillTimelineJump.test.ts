import { describe, expect, it } from 'vitest';
import { isSkillTimelineJumpBeforeCurrent } from './skillTimelineJump';

describe('native Skill.JumpTo lower bound', () => {
  it('ignores backwards targets but accepts equal and forward positions', () => {
    expect(isSkillTimelineJumpBeforeCurrent(4, 5)).toBe(true);
    expect(isSkillTimelineJumpBeforeCurrent(5, 5)).toBe(false);
    expect(isSkillTimelineJumpBeforeCurrent(6, 5)).toBe(false);
  });
  it('uses the native seconds epsilon rather than rounding the current frame', () => {
    expect(isSkillTimelineJumpBeforeCurrent(5, 5.0001)).toBe(false);
    expect(isSkillTimelineJumpBeforeCurrent(5, 5.001)).toBe(true);
  });
  it('does not silently accept invalid frame inputs', () => {
    expect(() => isSkillTimelineJumpBeforeCurrent(0.5, 0)).toThrow('integer');
    expect(() => isSkillTimelineJumpBeforeCurrent(1, NaN)).toThrow('finite');
  });
});
