/**
 * 时间轴编辑器对存档执行的最小不可变命令。
 *
 * 组件不得直接改写持久化对象；后续撤销历史应记录这些命令的输入与输出，而不是 DOM 状态。
 */
import type {
  BattleDocument,
  EditableActionValues,
  GearBuildDocument,
  OperatorBuildDocument,
  ScenarioDocument,
  TrackDocument,
  TrackIndex,
  WeaponBuildDocument,
} from '../../core/project/schema';

export type EditableBattleResourceRule = keyof Pick<
  BattleDocument['resourceRules'],
  'maxSp' | 'initialSp' | 'spRecoveryPerSecond'
>;

/**
 * 更新项目持久化的共享技力规则。命令同时维护初始值不超过上限的不变量，避免 UI、校验器和模拟器
 * 分别修正同一输入；未开放编辑的原生运行时规则仍由后续应用装配层提供。
 */
export function updateBattleResourceRule(
  scenario: ScenarioDocument,
  field: EditableBattleResourceRule,
  value: number,
): ScenarioDocument {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${field} must be a non-negative finite number`);
  }

  const current = scenario.battle.resourceRules;
  const normalizedValue = field === 'initialSp' ? Math.min(value, current.maxSp) : value;
  const next = {
    ...current,
    [field]: normalizedValue,
    ...(field === 'maxSp' && current.initialSp > normalizedValue
      ? { initialSp: normalizedValue }
      : {}),
  };
  if (next[field] === current[field] && next.initialSp === current.initialSp) return scenario;
  return { ...scenario, battle: { ...scenario.battle, resourceRules: next } };
}

/**
 * 交换两条轨道及其视觉顺序，并让主控切换事件继续指向原来的干员轨道。
 * 技能块和配装随轨道对象一起移动，不需要逐项改写引用。
 */
export function swapTimelineTracks(
  scenario: ScenarioDocument,
  leftIndex: TrackIndex,
  rightIndex: TrackIndex,
): ScenarioDocument {
  if (leftIndex === rightIndex) return scenario;
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  [tracks[leftIndex], tracks[rightIndex]] = [tracks[rightIndex], tracks[leftIndex]];
  const controlSwitches = scenario.battle.controlSwitches.map(controlSwitch => ({
    ...controlSwitch,
    trackIndex:
      controlSwitch.trackIndex === leftIndex
        ? rightIndex
        : controlSwitch.trackIndex === rightIndex
          ? leftIndex
          : controlSwitch.trackIndex,
  }));
  return {
    ...scenario,
    tracks,
    battle: { ...scenario.battle, controlSwitches },
  };
}

/**
 * 修改单条轨道的初始终结技能量。上限来自目录投影或显式项目覆盖，命令只负责维护用户输入；
 * 空轨道和非有限上限表示调用边界错误，不能静默创建不完整轨道。
 */
export function updateTrackInitialUltimateEnergy(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  value: number,
  maximum: number,
): ScenarioDocument {
  const track = scenario.tracks[trackIndex];
  if (track === null) throw new Error(`track ${trackIndex} is empty`);
  if (!Number.isFinite(value) || !Number.isFinite(maximum) || maximum < 0) {
    throw new RangeError('initial ultimate energy and maximum must be finite non-negative values');
  }
  const normalized = Math.min(maximum, Math.max(0, value));
  if (track.initialState.ultimateEnergy === normalized) return scenario;
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = {
    ...track,
    initialState: { ...track.initialState, ultimateEnergy: normalized },
  };
  return { ...scenario, tracks };
}

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

interface LocatedSkillCast {
  readonly trackIndex: TrackIndex;
  readonly castIndex: number;
  readonly cast: TrackDocument['skillCasts'][number];
}

function locateSkillCasts(
  scenario: ScenarioDocument,
  skillCastIds: ReadonlySet<string>,
): LocatedSkillCast[] {
  const located: LocatedSkillCast[] = [];
  for (const [trackIndex, track] of scenario.tracks.entries()) {
    if (track === null) continue;
    for (const [castIndex, cast] of track.skillCasts.entries()) {
      if (!skillCastIds.has(cast.id)) continue;
      located.push({ trackIndex: trackIndex as TrackIndex, castIndex, cast });
    }
  }
  return located;
}

/**
 * 让当前选择集按同一帧差整体移动，保持跨轨道动作之间的相对位置。
 * 选择中包含锁定动作时整组不移动；边界按动作起始帧统一收缩位移量，避免逐项截断后挤乱布局。
 */
export function moveSkillCasts(
  scenario: ScenarioDocument,
  skillCastIds: ReadonlySet<string>,
  anchorTrackIndex: TrackIndex,
  anchorSkillCastId: string,
  requestedAnchorStartFrame: number,
): ScenarioDocument {
  if (!Number.isInteger(requestedAnchorStartFrame) || requestedAnchorStartFrame < 0) {
    throw new RangeError('requestedAnchorStartFrame must be a non-negative integer');
  }
  if (!skillCastIds.has(anchorSkillCastId)) {
    throw new Error(`selection does not contain anchor skill cast '${anchorSkillCastId}'`);
  }

  const anchor = locateSkillCast(scenario, anchorTrackIndex, anchorSkillCastId).cast;
  const located = locateSkillCasts(scenario, skillCastIds);
  if (located.length !== skillCastIds.size) {
    throw new Error('selection contains a missing or duplicate skill cast identity');
  }
  if (located.some(value => value.cast.editable.locked)) return scenario;

  const requestedDelta = requestedAnchorStartFrame - anchor.placement.startFrame;
  const minimumStartFrame = Math.min(...located.map(value => value.cast.placement.startFrame));
  const maximumStartFrame = Math.max(...located.map(value => value.cast.placement.startFrame));
  const delta = Math.max(
    -minimumStartFrame,
    Math.min(scenario.battle.durationFrames - maximumStartFrame, requestedDelta),
  );
  if (delta === 0) return scenario;

  const castIndexesByTrack = new Map<TrackIndex, Set<number>>();
  for (const value of located) {
    const castIndexes = castIndexesByTrack.get(value.trackIndex) ?? new Set();
    castIndexes.add(value.castIndex);
    castIndexesByTrack.set(value.trackIndex, castIndexes);
  }
  const tracks = scenario.tracks.map((track, trackIndex) => {
    if (track === null) return null;
    const castIndexes = castIndexesByTrack.get(trackIndex as TrackIndex);
    if (castIndexes === undefined) return track;
    return {
      ...track,
      skillCasts: track.skillCasts.map((cast, castIndex) =>
        castIndexes.has(castIndex)
          ? {
              ...cast,
              placement: { startFrame: cast.placement.startFrame + delta },
            }
          : cast,
      ),
    };
  }) as ScenarioDocument['tracks'];
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
  locateSkillCast(scenario, trackIndex, skillCastId);
  return removeSkillCasts(scenario, new Set([skillCastId]));
}

function normalizePlacementGroups(skillCasts: TrackDocument['skillCasts']) {
  const groups = new Map<string, string[]>();
  for (const cast of skillCasts) {
    const groupId = cast.placementGroup?.id;
    if (groupId === undefined) continue;
    const members = groups.get(groupId) ?? [];
    members.push(cast.id);
    groups.set(groupId, members);
  }

  return skillCasts.map(cast => {
    const groupId = cast.placementGroup?.id;
    if (groupId === undefined) return cast;
    const members = groups.get(groupId)!;
    if (members.length === 1) {
      const { placementGroup: _placementGroup, ...ungrouped } = cast;
      return ungrouped;
    }
    return {
      ...cast,
      placementGroup: {
        ...cast.placementGroup!,
        index: members.indexOf(cast.id),
        total: members.length,
      },
    };
  });
}

/**
 * 一次删除任意轨道上的多个动作，并统一清理连线和重排放置组。
 * 不存在的 ID 会被忽略，便于临时选择集合在撤销、重做或切换干员后安全收敛。
 */
export function removeSkillCasts(
  scenario: ScenarioDocument,
  skillCastIds: ReadonlySet<string>,
): ScenarioDocument {
  if (skillCastIds.size === 0) return scenario;

  let changed = false;
  const tracks = scenario.tracks.map(track => {
    if (track === null) return null;
    const remaining = track.skillCasts.filter(cast => !skillCastIds.has(cast.id));
    if (remaining.length === track.skillCasts.length) return track;
    changed = true;
    return { ...track, skillCasts: normalizePlacementGroups(remaining) };
  }) as ScenarioDocument['tracks'];

  if (!changed) return scenario;

  const connections = scenario.connections.filter(
    connection =>
      !skillCastIds.has(connection.from.skillCastId) &&
      !skillCastIds.has(connection.to.skillCastId),
  );
  return { ...scenario, tracks, connections };
}
