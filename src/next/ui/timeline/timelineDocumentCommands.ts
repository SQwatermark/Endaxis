/**
 * 时间轴编辑器对存档执行的最小不可变命令。
 *
 * 组件不得直接改写持久化对象；后续撤销历史应记录这些命令的输入与输出，而不是 DOM 状态。
 */
import type {
  BattleDocument,
  OperatorInstanceDocument,
  ScenarioDocument,
  TrackDocument,
  TrackIndex,
  WeaponInstanceDocument,
  GearInstanceDocument,
} from '../../core/project/schema';
import type { SkillDefinition } from '../../core/game-data/operatorDefinition';
import { validateSkillDefinition } from '../../core/game-data/validateSkillDefinition';

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
 * 修改单条轨道的初始终结技能量。上限来自定义推导或显式项目覆盖，命令只负责维护用户输入；
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

export type TrackGearSlot = keyof TrackDocument['gears'];

/**
 * 更换轨道的干员实例。已有技能块依赖旧干员定义身份，因此切换或移除干员时一并清理。
 * 调用方负责提供初始养成值和轨道身份；命令层只维护轨道实例、连线的一致性与空轨道语义。
 */
export function setTrackOperator(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  operatorInstance: OperatorInstanceDocument | null,
  trackId: string,
): ScenarioDocument {
  const previousTrack = scenario.tracks[trackIndex];
  const previousSlug = previousTrack?.operator?.operatorSlug ?? null;
  const nextSlug = operatorInstance?.operatorSlug ?? null;
  if (previousSlug === nextSlug) return scenario;

  const removedCastIds = new Set(previousTrack?.skillCasts.map(cast => cast.id) ?? []);
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] =
    operatorInstance === null
      ? null
      : {
          id: trackId,
          operator: operatorInstance,
          weapon: null,
          gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
          initialState: { ultimateEnergy: 0 },
          skillCasts: [],
        };

  return {
    ...scenario,
    tracks,
    connections: scenario.connections.filter(
      connection =>
        !removedCastIds.has(connection.from.skillCastId) &&
        !removedCastIds.has(connection.to.skillCastId),
    ),
  };
}

/**
 * 更换轨道武器实例。武器兼容性由定义校验和选择器负责，
 * 命令层只维护轨道实例；空轨道不能单独装备武器。
 */
export function setTrackWeapon(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  weaponInstance: WeaponInstanceDocument | null,
): ScenarioDocument {
  const previousTrack = scenario.tracks[trackIndex];
  if (previousTrack === null) throw new Error(`track ${trackIndex} is empty`);
  const previousSlug = previousTrack.weapon?.weaponSlug ?? null;
  const nextSlug = weaponInstance?.weaponSlug ?? null;
  if (previousSlug === nextSlug) return scenario;

  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...previousTrack, weapon: weaponInstance };
  return { ...scenario, tracks };
}

/**
 * 更换轨道单个装备槽的实例。槽位与装备类型的匹配
 * 由定义校验和选择器负责；命令层只维护轨道实例。
 */
export function setTrackGear(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  slot: TrackGearSlot,
  gearInstance: GearInstanceDocument | null,
): ScenarioDocument {
  const previousTrack = scenario.tracks[trackIndex];
  if (previousTrack === null) throw new Error(`track ${trackIndex} is empty`);
  const previousSlug = previousTrack.gears[slot]?.gearSlug ?? null;
  const nextSlug = gearInstance?.gearSlug ?? null;
  if (previousSlug === nextSlug) return scenario;

  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = {
    ...previousTrack,
    gears: { ...previousTrack.gears, [slot]: gearInstance },
  };
  return { ...scenario, tracks };
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
  if (cast.presentation?.locked) return scenario;
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
  if (located.some(value => value.cast.presentation?.locked)) return scenario;

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

/** 设置技能块的锁定状态（纯展示，不包含技能逻辑）。 */
export function setSkillCastLocked(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  locked: boolean,
): ScenarioDocument {
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if ((cast.presentation?.locked ?? false) === locked) return scenario;
  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = { ...cast, presentation: { ...cast.presentation, locked } };
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

/** 设置技能块的禁用状态（纯展示，编译时跳过）。 */
export function setSkillCastDisabled(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  disabled: boolean,
): ScenarioDocument {
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if ((cast.presentation?.disabled ?? false) === disabled) return scenario;
  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = { ...cast, presentation: { ...cast.presentation, disabled } };
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

/** 设置技能块的用户配色；null 表示使用技能类型默认色。 */
export function setSkillCastColor(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  color: string | null,
): ScenarioDocument {
  if (color !== null && color.length === 0) throw new TypeError('color must not be empty');
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if ((cast.presentation?.color ?? null) === color) return scenario;
  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = { ...cast, presentation: { ...cast.presentation, color } };
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

/**
 * 设置一次技能释放所需的显式空间输入。
 * null 表示删除输入；运行时若技能确实读取该输入，会在对应条件处原地报错。
 */
export function setSkillCastCameraTargetAngle(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  angleDegrees: number | null,
): ScenarioDocument {
  if (
    angleDegrees !== null &&
    (!Number.isFinite(angleDegrees) || angleDegrees < -180 || angleDegrees > 180)
  ) {
    throw new RangeError('camera-to-target signed angle must be between -180 and 180 degrees');
  }

  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if ((cast.simulationInputs?.cameraToTargetSignedAngleDegrees ?? null) === angleDegrees) {
    return scenario;
  }

  const skillCasts = [...track.skillCasts];
  if (angleDegrees === null) {
    const { cameraToTargetSignedAngleDegrees: _removed, ...remainingInputs } =
      cast.simulationInputs ?? {};
    const { simulationInputs: _oldInputs, ...castWithoutInputs } = cast;
    skillCasts[castIndex] =
      Object.keys(remainingInputs).length === 0
        ? castWithoutInputs
        : { ...castWithoutInputs, simulationInputs: remainingInputs };
  } else {
    skillCasts[castIndex] = {
      ...cast,
      simulationInputs: {
        ...cast.simulationInputs,
        cameraToTargetSignedAngleDegrees: angleDegrees,
      },
    };
  }

  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

/**
 * 用完整定义替换一次干员技能释放的模板逻辑。
 * 命令负责最后一道结构校验并复制定义，避免面板绕过项目约束或继续修改已提交状态。
 */
export function setSkillCastCustomDefinition(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  definition: SkillDefinition,
): ScenarioDocument {
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if (cast.source.kind !== 'operatorSkill') {
    throw new Error(`skill cast '${skillCastId}' is not based on an operator skill template`);
  }
  if (definition.key !== cast.source.skillKey) {
    throw new Error(
      `custom definition key '${definition.key}' does not match source skill key '${cast.source.skillKey}'`,
    );
  }
  const issues = validateSkillDefinition(definition, 'customDefinition');
  if (issues.length > 0) {
    const first = issues[0]!;
    throw new TypeError(`invalid custom definition at '${first.path}': ${first.message}`);
  }

  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = { ...cast, customDefinition: structuredClone(definition) };
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

/**
 * 为技能编辑器创建独立草稿。草稿来源可以是当前模板或已有完整覆盖；调用方编辑草稿不会改写
 * 游戏数据和场景，只有交给 `setSkillCastCustomDefinition` 后才会形成一次项目变更。
 */
export function createSkillDefinitionDraft(definition: SkillDefinition): SkillDefinition {
  return structuredClone(definition);
}

/** 删除完整自定义定义，使技能块重新使用当前游戏数据中的技能模板。 */
export function resetSkillCastToTemplate(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
): ScenarioDocument {
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  if (cast.customDefinition === undefined) return scenario;

  const { customDefinition: _removed, ...templateCast } = cast;
  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = templateCast;
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = { ...track, skillCasts };
  return { ...scenario, tracks };
}

/** 删除动作块及其连线。 */
export function removeSkillCast(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
): ScenarioDocument {
  locateSkillCast(scenario, trackIndex, skillCastId);
  return removeSkillCasts(scenario, new Set([skillCastId]));
}

/**
 * 一次删除任意轨道上的多个动作，并统一清理连线。
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
    return { ...track, skillCasts: remaining };
  }) as ScenarioDocument['tracks'];

  if (!changed) return scenario;

  const connections = scenario.connections.filter(
    connection =>
      !skillCastIds.has(connection.from.skillCastId) &&
      !skillCastIds.has(connection.to.skillCastId),
  );
  return { ...scenario, tracks, connections };
}
