/**
 * 时间轴编辑器对项目文档执行的最小不可变命令。
 *
 * 组件不得直接改写持久化对象；后续撤销历史应记录这些命令的输入与输出，而不是 DOM 状态。
 */
import type {
  EditableActionValues,
  GearBuildDocument,
  OperatorBuildDocument,
  ScenarioDocument,
  TrackDocument,
  TrackIndex,
  WeaponBuildDocument,
} from '../../core/project/schema';

export type BasicEditableSkillCastField =
  | 'durationFrames'
  | 'cooldownFrames'
  | 'comboFollowupDelayFrames'
  | 'triggerWindowFrames'
  | 'spCost'
  | 'ultimateEnergyCost'
  | 'enhancement';

export type BooleanEditableSkillCastField = 'locked' | 'disabled';
export type TrackGearSlot = keyof TrackDocument['gearBuildIds'];

/**
 * 更换轨道使用的干员养成方案。已有技能块依赖旧干员目录身份，因此切换或移除干员时一并清理。
 * 调用方负责提供初始养成值；命令层只维护项目引用、孤立方案和连线的一致性。
 */
export function setTrackOperator(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  operatorBuild: OperatorBuildDocument | null,
): ScenarioDocument {
  const previousTrack = scenario.tracks[trackIndex];
  const previousBuildId = previousTrack?.operatorBuildId ?? null;
  const previousSlug =
    previousBuildId === null
      ? null
      : (scenario.builds.operators[previousBuildId]?.operatorSlug ?? null);
  const nextSlug = operatorBuild?.operatorSlug ?? null;
  if (previousSlug === nextSlug) return scenario;

  const removedCastIds = new Set(previousTrack?.skillCasts.map(cast => cast.id) ?? []);
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] =
    operatorBuild === null
      ? null
      : {
          operatorBuildId: operatorBuild.id,
          weaponBuildId: null,
          gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
          initialState: { ultimateEnergy: 0 },
          skillCasts: [],
        };

  const operators = { ...scenario.builds.operators };
  const weapons = { ...scenario.builds.weapons };
  const gears = { ...scenario.builds.gears };
  if (operatorBuild !== null) operators[operatorBuild.id] = operatorBuild;
  if (
    previousBuildId !== null &&
    previousBuildId !== operatorBuild?.id &&
    !tracks.some(track => track?.operatorBuildId === previousBuildId)
  ) {
    delete operators[previousBuildId];
  }
  const previousWeaponBuildId = previousTrack?.weaponBuildId ?? null;
  if (
    previousWeaponBuildId !== null &&
    !tracks.some(track => track?.weaponBuildId === previousWeaponBuildId)
  ) {
    delete weapons[previousWeaponBuildId];
  }
  const previousGearBuildIds = Object.values(previousTrack?.gearBuildIds ?? {}).filter(
    (id): id is string => id !== null,
  );
  for (const gearBuildId of previousGearBuildIds) {
    const stillReferenced = tracks.some(track =>
      track === null ? false : Object.values(track.gearBuildIds).includes(gearBuildId),
    );
    if (!stillReferenced) delete gears[gearBuildId];
  }

  return {
    ...scenario,
    builds: { operators, weapons, gears },
    tracks,
    connections: scenario.connections.filter(
      connection =>
        !removedCastIds.has(connection.from.skillCastId) &&
        !removedCastIds.has(connection.to.skillCastId),
    ),
  };
}

/**
 * 更换轨道武器方案，并清理已经没有轨道引用的旧方案。武器兼容性由目录校验和选择器负责，
 * 命令层只维护项目引用一致性；空轨道不能单独装备武器。
 */
export function setTrackWeapon(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  weaponBuild: WeaponBuildDocument | null,
): ScenarioDocument {
  const previousTrack = scenario.tracks[trackIndex];
  if (previousTrack === null) throw new Error(`track ${trackIndex} is empty`);
  const previousBuildId = previousTrack.weaponBuildId;
  const previousSlug =
    previousBuildId === null
      ? null
      : (scenario.builds.weapons[previousBuildId]?.weaponSlug ?? null);
  const nextSlug = weaponBuild?.weaponSlug ?? null;
  if (previousSlug === nextSlug) return scenario;

  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...previousTrack, weaponBuildId: weaponBuild?.id ?? null };

  const weapons = { ...scenario.builds.weapons };
  if (weaponBuild !== null) weapons[weaponBuild.id] = weaponBuild;
  if (
    previousBuildId !== null &&
    previousBuildId !== weaponBuild?.id &&
    !tracks.some(track => track?.weaponBuildId === previousBuildId)
  ) {
    delete weapons[previousBuildId];
  }

  return { ...scenario, builds: { ...scenario.builds, weapons }, tracks };
}

/**
 * 更换轨道单个装备槽的方案，并清理已经没有槽位引用的旧方案。槽位与装备类型的匹配
 * 由目录校验和选择器负责；命令层只维护文档引用与方案生命周期。
 */
export function setTrackGear(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  slot: TrackGearSlot,
  gearBuild: GearBuildDocument | null,
): ScenarioDocument {
  const previousTrack = scenario.tracks[trackIndex];
  if (previousTrack === null) throw new Error(`track ${trackIndex} is empty`);
  const previousBuildId = previousTrack.gearBuildIds[slot];
  const previousSlug =
    previousBuildId === null ? null : (scenario.builds.gears[previousBuildId]?.gearSlug ?? null);
  const nextSlug = gearBuild?.gearSlug ?? null;
  if (previousSlug === nextSlug) return scenario;

  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = {
    ...previousTrack,
    gearBuildIds: { ...previousTrack.gearBuildIds, [slot]: gearBuild?.id ?? null },
  };

  const gears = { ...scenario.builds.gears };
  if (gearBuild !== null) gears[gearBuild.id] = gearBuild;
  if (
    previousBuildId !== null &&
    previousBuildId !== gearBuild?.id &&
    !tracks.some(track =>
      track === null ? false : Object.values(track.gearBuildIds).includes(previousBuildId),
    )
  ) {
    delete gears[previousBuildId];
  }

  return { ...scenario, builds: { ...scenario.builds, gears }, tracks };
}

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

/** 更新动作块的编辑状态，并记录该字段已经由用户接管。 */
export function updateSkillCastBooleanField(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  field: BooleanEditableSkillCastField,
  value: boolean,
): ScenarioDocument {
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if (cast.editable[field] === value) return scenario;

  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = {
    ...cast,
    editable: { ...cast.editable, [field]: value },
    edited: cast.edited.includes(field) ? cast.edited : [...cast.edited, field],
  };
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

/** 设置动作块的用户配色；`null` 表示重新使用技能类型默认色。 */
export function updateSkillCastColor(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  color: string | null,
): ScenarioDocument {
  if (color !== null && color.length === 0) throw new TypeError('color must not be empty');
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if ((cast.editable.color ?? null) === color) return scenario;

  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = {
    ...cast,
    editable: { ...cast.editable, color },
    edited: cast.edited.includes('color') ? cast.edited : [...cast.edited, 'color'],
  };
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

/**
 * 删除动作块及其连线，并把同一放置组的剩余动作重新编号。
 * 单独剩下的动作不再属于序列组，避免持久化无意义的组身份。
 */
export function removeSkillCast(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
): ScenarioDocument {
  const { track, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  const remaining = track.skillCasts.filter(candidate => candidate.id !== skillCastId);
  const groupId = cast.placementGroup?.id;
  let skillCasts = remaining;

  if (groupId !== undefined) {
    const groupMembers = remaining.filter(candidate => candidate.placementGroup?.id === groupId);
    skillCasts = remaining.map(candidate => {
      const groupIndex = groupMembers.findIndex(member => member.id === candidate.id);
      if (groupIndex < 0) return candidate;
      if (groupMembers.length === 1) {
        const { placementGroup: _placementGroup, ...ungrouped } = candidate;
        return ungrouped;
      }
      return {
        ...candidate,
        placementGroup: {
          ...candidate.placementGroup!,
          index: groupIndex,
          total: groupMembers.length,
        },
      };
    });
  }

  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  const connections = scenario.connections.filter(
    connection =>
      connection.from.skillCastId !== skillCastId && connection.to.skillCastId !== skillCastId,
  );
  return { ...scenario, tracks, connections };
}
