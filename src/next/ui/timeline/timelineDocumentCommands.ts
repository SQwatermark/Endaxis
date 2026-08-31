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
  ExternalCombatEventDocument,
  ExternalEventMarkerDocument,
  ExternalEventTargetDocument,
  EditableBarDocument,
  GlobalOperatorStatModifierDocument,
} from '../../core/project/schema';
import type { SkillDefinition } from '../../core/game-data/operatorDefinition';
import { validateSkillDefinition } from '../../core/game-data/validateSkillDefinition';

export type EditableBattleResourceRule = keyof Pick<
  BattleDocument['resourceRules'],
  'maxSp' | 'initialSp' | 'spRecoveryPerSecond'
>;

/** 战前准备只改变现实时间轴的负向可视区，不平移以战斗帧保存的技能或标记。 */
export function setBattlePrepFrames(
  scenario: ScenarioDocument,
  prepFrames: number,
): ScenarioDocument {
  if (!Number.isInteger(prepFrames) || prepFrames < 0) {
    throw new RangeError('prepFrames must be a non-negative integer');
  }
  if (scenario.battle.prepFrames === prepFrames) return scenario;
  return { ...scenario, battle: { ...scenario.battle, prepFrames } };
}

function battleDurationContentFloor(scenario: ScenarioDocument): number {
  const timedFrames = [
    ...scenario.tracks.flatMap(track =>
      track === null ? [] : track.skillCasts.map(cast => cast.placement.startFrame),
    ),
    ...scenario.battle.cycleBoundaries.map(marker => marker.frame),
    ...scenario.battle.controlSwitches.map(marker => marker.frame),
    ...(scenario.battle.externalEventMarkers ?? []).map(marker => marker.frame),
    scenario.battle.simulationRange?.startFrame ?? 0,
    scenario.battle.simulationRange?.endFrame ?? 0,
  ];
  return Math.max(1, ...timedFrames);
}

/**
 * 修改实际战斗轴长度。缩短时沿用旧版的内容下限：不删除、不裁剪、也不移动任何已放置对象。
 * 技能的运行时结束点不是项目字段，因此这里只保护稳定的技能起点和标记帧。
 */
export function setBattleDurationFrames(
  scenario: ScenarioDocument,
  requestedDurationFrames: number,
): ScenarioDocument {
  if (!Number.isInteger(requestedDurationFrames) || requestedDurationFrames <= 0) {
    throw new RangeError('durationFrames must be a positive integer');
  }
  const durationFrames = Math.max(battleDurationContentFloor(scenario), requestedDurationFrames);
  if (scenario.battle.durationFrames === durationFrames) return scenario;
  return { ...scenario, battle: { ...scenario.battle, durationFrames } };
}

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
 * 替换场景级全局属性修正。比率字段使用核心统一的小数；技能类型范围目前只允许用于冷却缩减。
 * 完整列表形成一个撤销命令，UI 不得直接修改场景数组。
 */
export function setGlobalOperatorStatModifiers(
  scenario: ScenarioDocument,
  modifiers: readonly GlobalOperatorStatModifierDocument[],
): ScenarioDocument {
  const ids = new Set<string>();
  for (const modifier of modifiers) {
    if (modifier.id.length === 0 || ids.has(modifier.id)) {
      throw new TypeError('global modifier ids must be non-empty and unique');
    }
    ids.add(modifier.id);
    if (!Number.isFinite(modifier.value)) {
      throw new TypeError(`global modifier '${modifier.id}' value must be finite`);
    }
    if (modifier.modifier === 'skillCooldownReduction') {
      if (modifier.skillType === undefined || modifier.value >= 1) {
        throw new RangeError(
          `global cooldown reduction '${modifier.id}' requires a skill type and a value less than 1`,
        );
      }
    } else if (modifier.skillType !== undefined) {
      throw new Error(`global modifier '${modifier.id}' does not support a skill-type scope`);
    }
  }
  if (JSON.stringify(scenario.globalConfig.modifiers) === JSON.stringify(modifiers))
    return scenario;
  return {
    ...scenario,
    globalConfig: { modifiers: modifiers.map(modifier => ({ ...modifier })) },
  };
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
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = {
    ...track,
    initialState: { ...track.initialState, ultimateEnergy: normalized },
  };
  const customByTrackId = Object.fromEntries(
    tracks.flatMap(current =>
      current === null ? [] : [[current.id, current.initialState.ultimateEnergy]],
    ),
  );
  const currentPreset = scenario.editor.initialUltimateEnergyPreset;
  if (
    track.initialState.ultimateEnergy === normalized &&
    currentPreset?.mode === 'custom' &&
    JSON.stringify(currentPreset.customByTrackId) === JSON.stringify(customByTrackId)
  ) {
    return scenario;
  }
  return {
    ...scenario,
    tracks,
    editor: {
      ...scenario.editor,
      initialUltimateEnergyPreset: { mode: 'custom', customByTrackId },
    },
  };
}

export type InitialUltimateEnergyPresetMode = 'empty' | 'full' | 'custom';

export function resolveInitialUltimateEnergyPresetMode(
  scenario: ScenarioDocument,
): InitialUltimateEnergyPresetMode {
  const saved = scenario.editor.initialUltimateEnergyPreset?.mode;
  if (saved !== undefined) return saved;
  return scenario.tracks.every(track => track === null || track.initialState.ultimateEnergy === 0)
    ? 'empty'
    : 'custom';
}

function initialUltimateEnergyCustomProfile(scenario: ScenarioDocument): Record<string, number> {
  return (
    scenario.editor.initialUltimateEnergyPreset?.customByTrackId ??
    Object.fromEntries(
      scenario.tracks.flatMap(track =>
        track === null ? [] : [[track.id, track.initialState.ultimateEnergy]],
      ),
    )
  );
}

export function applyInitialUltimateEnergyPreset(
  scenario: ScenarioDocument,
  mode: InitialUltimateEnergyPresetMode,
  maximumByTrack: readonly (number | null)[],
): ScenarioDocument {
  const customByTrackId = initialUltimateEnergyCustomProfile(scenario);
  const tracks = scenario.tracks.map((track, trackIndex) => {
    if (track === null) return null;
    const maximum = maximumByTrack[trackIndex];
    if (maximum === null || maximum === undefined || !Number.isFinite(maximum) || maximum < 0) {
      throw new RangeError(`track ${trackIndex} has no valid maximum ultimate energy`);
    }
    const requested =
      mode === 'empty' ? 0 : mode === 'full' ? maximum : (customByTrackId[track.id] ?? 0);
    return {
      ...track,
      initialState: {
        ...track.initialState,
        ultimateEnergy: Math.min(maximum, Math.max(0, requested)),
      },
    };
  }) as ScenarioDocument['tracks'];
  return {
    ...scenario,
    tracks,
    editor: { ...scenario.editor, initialUltimateEnergyPreset: { mode, customByTrackId } },
  };
}

export function setUnifiedInitialUltimateEnergy(
  scenario: ScenarioDocument,
  value: number,
  maximumByTrack: readonly (number | null)[],
): ScenarioDocument {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('unified initial ultimate energy must be a non-negative finite number');
  }
  const tracks = scenario.tracks.map((track, trackIndex) => {
    if (track === null) return null;
    const maximum = maximumByTrack[trackIndex];
    if (maximum === null || maximum === undefined || !Number.isFinite(maximum) || maximum < 0) {
      throw new RangeError(`track ${trackIndex} has no valid maximum ultimate energy`);
    }
    return {
      ...track,
      initialState: {
        ...track.initialState,
        ultimateEnergy: Math.min(maximum, value),
      },
    };
  }) as ScenarioDocument['tracks'];
  const customByTrackId = Object.fromEntries(
    tracks.flatMap(track =>
      track === null ? [] : [[track.id, track.initialState.ultimateEnergy]],
    ),
  );
  return {
    ...scenario,
    tracks,
    editor: {
      ...scenario.editor,
      initialUltimateEnergyPreset: { mode: 'custom', customByTrackId },
    },
  };
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
 * 替换技能块的辅助展示条。展示条使用实际战斗帧，不参与技能编译；完整列表作为一次命令提交，
 * 使 Inspector 中的增删改与时间轴撤销/重做保持同一粒度。
 */
export function setSkillCastCustomBars(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  customBars: readonly EditableBarDocument[],
): ScenarioDocument {
  const ids = new Set<string>();
  for (const bar of customBars) {
    if (bar.id.length === 0 || ids.has(bar.id)) {
      throw new TypeError('custom bar ids must be non-empty and unique');
    }
    ids.add(bar.id);
    if (!Number.isInteger(bar.offsetFrames) || bar.offsetFrames < 0) {
      throw new RangeError('custom bar offsetFrames must be a non-negative integer');
    }
    if (!Number.isInteger(bar.durationFrames) || bar.durationFrames < 0) {
      throw new RangeError('custom bar durationFrames must be a non-negative integer');
    }
    if (bar.color !== undefined && bar.color.length === 0) {
      throw new TypeError('custom bar color must not be empty');
    }
  }

  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  const current = cast.presentation?.customBars ?? [];
  if (JSON.stringify(current) === JSON.stringify(customBars)) return scenario;

  const skillCasts = [...track.skillCasts];
  skillCasts[castIndex] = {
    ...cast,
    presentation: {
      ...cast.presentation,
      customBars: customBars.map(bar => ({ ...bar })),
    },
  };
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

/** 切换一次释放中某个稳定伤害步骤的强制暴击输入。 */
export function setSkillCastForcedCritical(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  skillCastId: string,
  stepKey: string,
  forced: boolean,
): ScenarioDocument {
  if (stepKey.length === 0) throw new TypeError('forced-critical step key must not be empty');
  const { track, castIndex, cast } = locateSkillCast(scenario, trackIndex, skillCastId);
  const current = cast.simulationInputs?.forcedCriticalStepKeys ?? [];
  const hasStep = current.includes(stepKey);
  if (hasStep === forced) return scenario;

  const forcedCriticalStepKeys = forced
    ? [...current, stepKey]
    : current.filter(value => value !== stepKey);
  const remainingInputs = {
    ...cast.simulationInputs,
    ...(forcedCriticalStepKeys.length === 0 ? {} : { forcedCriticalStepKeys }),
  };
  if (forcedCriticalStepKeys.length === 0) delete remainingInputs.forcedCriticalStepKeys;
  const skillCasts = [...track.skillCasts];
  const { simulationInputs: _oldInputs, ...castWithoutInputs } = cast;
  skillCasts[castIndex] =
    Object.keys(remainingInputs).length === 0
      ? castWithoutInputs
      : { ...castWithoutInputs, simulationInputs: remainingInputs };
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

function requireTimelineMarkerFrame(scenario: ScenarioDocument, frame: number): void {
  if (!Number.isInteger(frame) || frame < 0 || frame > scenario.battle.durationFrames) {
    throw new RangeError('timeline marker frame must be an integer inside the battle duration');
  }
}

export function setSimulationRangeBoundary(
  scenario: ScenarioDocument,
  boundary: 'start' | 'end',
  frame: number,
): ScenarioDocument {
  requireTimelineMarkerFrame(scenario, frame);
  const current = scenario.battle.simulationRange ?? {};
  const simulationRange =
    boundary === 'start'
      ? {
          ...current,
          startFrame: frame,
          ...(current.endFrame !== undefined && current.endFrame < frame
            ? { endFrame: frame }
            : {}),
        }
      : {
          ...current,
          endFrame: frame,
          ...(current.startFrame !== undefined && current.startFrame > frame
            ? { startFrame: frame }
            : {}),
        };
  if (
    simulationRange.startFrame === current.startFrame &&
    simulationRange.endFrame === current.endFrame
  ) {
    return scenario;
  }
  return { ...scenario, battle: { ...scenario.battle, simulationRange } };
}

export function clearSimulationRangeBoundary(
  scenario: ScenarioDocument,
  boundary: 'start' | 'end',
): ScenarioDocument {
  const current = scenario.battle.simulationRange;
  if (current === undefined || current[`${boundary}Frame`] === undefined) return scenario;
  const simulationRange = { ...current };
  delete simulationRange[`${boundary}Frame`];
  if (simulationRange.startFrame === undefined && simulationRange.endFrame === undefined) {
    const { simulationRange: _removed, ...battle } = scenario.battle;
    return { ...scenario, battle };
  }
  return { ...scenario, battle: { ...scenario.battle, simulationRange } };
}

export function addCycleBoundary(
  scenario: ScenarioDocument,
  id: string,
  frame: number,
): ScenarioDocument {
  requireTimelineMarkerFrame(scenario, frame);
  if (id.length === 0 || scenario.battle.cycleBoundaries.some(item => item.id === id)) {
    throw new Error(`invalid or duplicate cycle boundary id '${id}'`);
  }
  return {
    ...scenario,
    battle: {
      ...scenario.battle,
      cycleBoundaries: [...scenario.battle.cycleBoundaries, { id, frame }],
    },
  };
}

export function moveCycleBoundary(
  scenario: ScenarioDocument,
  id: string,
  frame: number,
): ScenarioDocument {
  requireTimelineMarkerFrame(scenario, frame);
  const index = scenario.battle.cycleBoundaries.findIndex(item => item.id === id);
  if (index < 0 || scenario.battle.cycleBoundaries[index]!.frame === frame) return scenario;
  const cycleBoundaries = [...scenario.battle.cycleBoundaries];
  cycleBoundaries[index] = { ...cycleBoundaries[index]!, frame };
  return { ...scenario, battle: { ...scenario.battle, cycleBoundaries } };
}

export function removeCycleBoundary(scenario: ScenarioDocument, id: string): ScenarioDocument {
  const cycleBoundaries = scenario.battle.cycleBoundaries.filter(item => item.id !== id);
  if (cycleBoundaries.length === scenario.battle.cycleBoundaries.length) return scenario;
  return { ...scenario, battle: { ...scenario.battle, cycleBoundaries } };
}

export function addControlSwitch(
  scenario: ScenarioDocument,
  id: string,
  frame: number,
  trackIndex: TrackIndex,
): ScenarioDocument {
  requireTimelineMarkerFrame(scenario, frame);
  if (scenario.tracks[trackIndex] === null) throw new Error(`track ${trackIndex} is empty`);
  if (id.length === 0 || scenario.battle.controlSwitches.some(item => item.id === id)) {
    throw new Error(`invalid or duplicate control switch id '${id}'`);
  }
  return {
    ...scenario,
    battle: {
      ...scenario.battle,
      controlSwitches: [...scenario.battle.controlSwitches, { id, frame, trackIndex }],
    },
  };
}

export function moveControlSwitch(
  scenario: ScenarioDocument,
  id: string,
  frame: number,
): ScenarioDocument {
  requireTimelineMarkerFrame(scenario, frame);
  const index = scenario.battle.controlSwitches.findIndex(item => item.id === id);
  if (index < 0 || scenario.battle.controlSwitches[index]!.frame === frame) return scenario;
  const controlSwitches = [...scenario.battle.controlSwitches];
  controlSwitches[index] = { ...controlSwitches[index]!, frame };
  return { ...scenario, battle: { ...scenario.battle, controlSwitches } };
}

export function setControlSwitchTrack(
  scenario: ScenarioDocument,
  id: string,
  trackIndex: TrackIndex,
): ScenarioDocument {
  if (scenario.tracks[trackIndex] === null) throw new Error(`track ${trackIndex} is empty`);
  const index = scenario.battle.controlSwitches.findIndex(item => item.id === id);
  if (index < 0 || scenario.battle.controlSwitches[index]!.trackIndex === trackIndex)
    return scenario;
  const controlSwitches = [...scenario.battle.controlSwitches];
  controlSwitches[index] = { ...controlSwitches[index]!, trackIndex };
  return { ...scenario, battle: { ...scenario.battle, controlSwitches } };
}

export function removeControlSwitch(scenario: ScenarioDocument, id: string): ScenarioDocument {
  const controlSwitches = scenario.battle.controlSwitches.filter(item => item.id !== id);
  if (controlSwitches.length === scenario.battle.controlSwitches.length) return scenario;
  return { ...scenario, battle: { ...scenario.battle, controlSwitches } };
}

export function addExternalEventMarker(
  scenario: ScenarioDocument,
  id: string,
  frame: number,
  target: ExternalEventTargetDocument,
  event: ExternalCombatEventDocument,
): ScenarioDocument {
  requireTimelineMarkerFrame(scenario, frame);
  if (target.scope === 'operator' && scenario.tracks[target.trackIndex] === null) {
    throw new Error(`track ${target.trackIndex} is empty`);
  }
  const current = scenario.battle.externalEventMarkers ?? [];
  if (id.length === 0 || current.some(item => item.id === id)) {
    throw new Error(`invalid or duplicate external event id '${id}'`);
  }
  return {
    ...scenario,
    battle: {
      ...scenario.battle,
      externalEventMarkers: [...current, { id, frame, target, event }],
    },
  };
}

export function moveExternalEventMarker(
  scenario: ScenarioDocument,
  id: string,
  frame: number,
): ScenarioDocument {
  requireTimelineMarkerFrame(scenario, frame);
  const current = scenario.battle.externalEventMarkers ?? [];
  const index = current.findIndex(item => item.id === id);
  if (index < 0 || current[index]!.frame === frame) return scenario;
  const externalEventMarkers = [...current];
  externalEventMarkers[index] = { ...externalEventMarkers[index]!, frame };
  return { ...scenario, battle: { ...scenario.battle, externalEventMarkers } };
}

/** 更新外部事实本身；时间轴位置继续由专用移动命令维护。 */
export function updateExternalEventMarker(
  scenario: ScenarioDocument,
  id: string,
  patch: Partial<Pick<ExternalEventMarkerDocument, 'target' | 'event'>>,
): ScenarioDocument {
  const current = scenario.battle.externalEventMarkers ?? [];
  const index = current.findIndex(item => item.id === id);
  if (index < 0) return scenario;
  const marker = current[index]!;
  const target = patch.target ?? marker.target;
  if (target.scope === 'operator' && scenario.tracks[target.trackIndex] === null) {
    throw new Error(`track ${target.trackIndex} is empty`);
  }
  const updated = { ...marker, ...patch };
  if (updated.target === marker.target && updated.event === marker.event) return scenario;
  const externalEventMarkers = [...current];
  externalEventMarkers[index] = updated;
  return { ...scenario, battle: { ...scenario.battle, externalEventMarkers } };
}

export function removeExternalEventMarker(
  scenario: ScenarioDocument,
  id: string,
): ScenarioDocument {
  const current = scenario.battle.externalEventMarkers ?? [];
  const externalEventMarkers = current.filter(item => item.id !== id);
  if (externalEventMarkers.length === current.length) return scenario;
  return { ...scenario, battle: { ...scenario.battle, externalEventMarkers } };
}
