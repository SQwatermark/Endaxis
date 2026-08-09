/**
 * 时间轴编辑器对项目文档执行的最小不可变命令。
 *
 * 组件不得直接改写持久化对象；后续撤销历史应记录这些命令的输入与输出，而不是 DOM 状态。
 */
import type { EditableActionValues, ScenarioDocument, TrackIndex } from '../../core/project/schema';

export type BasicEditableSkillCastField =
  | 'durationFrames'
  | 'cooldownFrames'
  | 'comboFollowupDelayFrames'
  | 'triggerWindowFrames'
  | 'spCost'
  | 'ultimateEnergyCost'
  | 'enhancement';

function locateSkillCast(scenario: ScenarioDocument, trackIndex: TrackIndex, skillCastId: string) {
  const track = scenario.tracks[trackIndex];
  if (track === null) throw new Error(`track ${trackIndex} is empty`);
  const castIndex = track.skillCasts.findIndex(cast => cast.id === skillCastId);
  if (castIndex < 0) {
    throw new Error(`track ${trackIndex} has no skill cast '${skillCastId}'`);
  }
  return { track, castIndex, cast: track.skillCasts[castIndex]! };
}

/** 移动一项已放置技能，并保持其他轨道与技能对象引用不变。 */
export function moveSkillCast(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  startFrame: number,
): ScenarioDocument {
  if (!Number.isInteger(startFrame) || startFrame < 0) {
    throw new RangeError('startFrame must be a non-negative integer');
  }
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if (cast.editable.locked) return scenario;
  if (cast.placement.startFrame === startFrame) return scenario;

  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = { ...cast, placement: { startFrame } };
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

function requireNonNegativeNumber(value: unknown, field: string, integer: boolean): void {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    (integer && !Number.isInteger(value))
  ) {
    throw new RangeError(`${field} must be a non-negative ${integer ? 'integer' : 'number'}`);
  }
}

/** 更新旧版属性面板“基础属性”区对应的用户接管值。 */
export function updateSkillCastBasicField<K extends BasicEditableSkillCastField>(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  field: K,
  value: EditableActionValues[K],
): ScenarioDocument {
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if (field === 'enhancement') {
    if (value === undefined || typeof value !== 'object') {
      throw new TypeError('enhancement must be a duration or status value');
    }
    if (value.kind === 'duration') {
      requireNonNegativeNumber(value.frames, 'enhancement.frames', true);
    } else if (value.kind !== 'status' || value.statusId.length === 0) {
      throw new TypeError('enhancement status must have an identity');
    }
  } else {
    requireNonNegativeNumber(value, field, field.endsWith('Frames'));
  }

  const editable = { ...cast.editable, [field]: value };
  const edited = cast.edited.includes(field) ? cast.edited : [...cast.edited, field];
  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = { ...cast, editable, edited };
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}
