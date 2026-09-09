import { COMBAT_FRAMES_PER_SECOND } from './combatClock';

/**
 * Skill.JumpTo 的下界门禁，不是 TimelineActionProcessor 的调度规则。
 * 当前镜像 03E5C92F..37：目标秒数小于 passedTime - 1e-5f 时忽略。
 * 这里只复现下界；自然时长上界与 CastEnd 顺序由技能宿主管理。
 */
export function isSkillTimelineJumpBeforeCurrent(
  destinationFrame: number,
  passedFrames: number,
): boolean {
  if (!Number.isInteger(destinationFrame)) {
    throw new TypeError('timeline jump destination must use an integer frame');
  }
  if (!Number.isFinite(passedFrames)) {
    throw new TypeError('skill timeline position must be finite');
  }
  const destinationSeconds = Math.fround(Math.fround(destinationFrame) / COMBAT_FRAMES_PER_SECOND);
  const passedSeconds = Math.fround(passedFrames / COMBAT_FRAMES_PER_SECOND);
  return destinationSeconds < Math.fround(passedSeconds - Math.fround(1e-5));
}
