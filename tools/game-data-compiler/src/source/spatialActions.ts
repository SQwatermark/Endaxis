import {
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import { parseScalarSource, type ScalarSource } from './scalar.ts';
import { parseTimeDilationCurveKeys } from './timeDilationActions.ts';
import type { BlackboardLevelValues } from './scalar.ts';

export interface SelfRotateActionSource {
  readonly kind: 'selfRotate';
  readonly rotateType: string;
  readonly target: TargetReferenceSource;
  readonly rootMotion: boolean;
  readonly immediateRotate: boolean;
}

export interface TeleportActionSource {
  readonly kind: 'teleport';
  readonly target: TargetReferenceSource;
  readonly radius: ScalarSource;
}

export interface ReceiveMoveInputActionSource {
  readonly kind: 'receiveMoveInput';
  readonly duration: ScalarSource;
  readonly inputDirection: string;
}

export interface MoveToActionSource {
  readonly kind: 'moveTo';
  readonly moveType: string;
  readonly totalTime: ScalarSource;
  readonly target: TargetReferenceSource;
  readonly updateMoveTarget: boolean;
  readonly directionType: string;
  readonly speedType: string;
}

export interface CustomRootMotionActionSource {
  readonly kind: 'customRootMotion';
  readonly target: TargetReferenceSource;
  readonly animationKey: string;
  readonly rootMotionCurveMask: string;
  readonly updateDirection: boolean;
  readonly startOffsetFrame: number;
}

export interface SnapToTargetWithRangeActionSource {
  readonly kind: 'snapToTargetWithRange';
  readonly target: TargetReferenceSource;
  readonly radius: ScalarSource;
  readonly moveType: string;
  readonly needRotate: boolean;
  readonly totalTime: number;
}

export interface SaveTargetDistanceActionSource {
  readonly kind: 'saveTargetDistance';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly outputKey: string;
}

/**
 * 方向在 Endaxis 的零距离、全实例、唯一木桩模型中不改变目标集合或伤害数值，但仍严格读取
 * 原生载荷；若未来接入方向条件，必须在投影层重新评估这项省略，不能从来源层删除证据。
 */
export function parseSelfRotateActionSource(value: unknown, path: string): SelfRotateActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'rotateType',
      'useAdvancedDirectionSetting',
      'targetSettings',
      'advancedDirectionSettings',
      'rootMotion',
      'rootMotionAnimKey',
      'rootMotionStartFrame',
      'isRootMotionScale',
      'rootMotionDirectionType',
      'immediateRotate',
      'overrideRotateRate',
      'rotateRate',
      'rotateDirType',
      'ignoreImmobilized',
    ]),
    path,
  );
  requireRecord(action.advancedDirectionSettings, `${path}.advancedDirectionSettings`);
  requireBoolean(action.useAdvancedDirectionSetting, `${path}.useAdvancedDirectionSetting`);
  requireString(action.rootMotionAnimKey, `${path}.rootMotionAnimKey`);
  requireNumber(action.rootMotionStartFrame, `${path}.rootMotionStartFrame`);
  requireBoolean(action.isRootMotionScale, `${path}.isRootMotionScale`);
  requireNonEmptyString(action.rootMotionDirectionType, `${path}.rootMotionDirectionType`);
  requireBoolean(action.overrideRotateRate, `${path}.overrideRotateRate`);
  requireNumber(action.rotateRate, `${path}.rotateRate`);
  requireNonEmptyString(action.rotateDirType, `${path}.rotateDirType`);
  requireBoolean(action.ignoreImmobilized, `${path}.ignoreImmobilized`);
  return {
    kind: 'selfRotate',
    rotateType: requireNonEmptyString(action.rotateType, `${path}.rotateType`),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    rootMotion: requireBoolean(action.rootMotion, `${path}.rootMotion`),
    immediateRotate: requireBoolean(action.immediateRotate, `${path}.immediateRotate`),
  };
}

export function parseTeleportActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): TeleportActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'teleportTo',
      'radius',
      'allowCheckMainCharPosToDestPathAvailable',
      'throughWall',
      'clampDirToXZ',
      'checkMaxDistance',
      'maxDistance',
      'ignoreNavmeshLink',
      'snapToFloor',
    ]),
    path,
  );
  requireBoolean(
    action.allowCheckMainCharPosToDestPathAvailable,
    `${path}.allowCheckMainCharPosToDestPathAvailable`,
  );
  requireBoolean(action.throughWall, `${path}.throughWall`);
  requireBoolean(action.clampDirToXZ, `${path}.clampDirToXZ`);
  requireBoolean(action.checkMaxDistance, `${path}.checkMaxDistance`);
  requireNumber(action.maxDistance, `${path}.maxDistance`);
  requireBoolean(action.ignoreNavmeshLink, `${path}.ignoreNavmeshLink`);
  requireBoolean(action.snapToFloor, `${path}.snapToFloor`);
  return {
    kind: 'teleport',
    target: parseTargetReferenceSource(action.teleportTo, `${path}.teleportTo`),
    radius: parseScalarSource(action.radius, `${path}.radius`, inheritedBlackboard),
  };
}

export function parseReceiveMoveInputActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): ReceiveMoveInputActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'duration',
      'inputDirection',
      'speedType',
      'speed',
      'speedCurve',
      'speedScale',
      'faceToMoveDir',
      'overrideRotateSpeed',
      'disableCliffCheck',
      'rotateSpeed',
      'recoverWhenLanding',
      'useTeammateParam',
      'teammateParam',
    ]),
    path,
  );
  parseScalarSource(action.speed, `${path}.speed`, inheritedBlackboard);
  parseScalarSource(action.speedScale, `${path}.speedScale`, inheritedBlackboard);
  parseScalarSource(action.rotateSpeed, `${path}.rotateSpeed`, inheritedBlackboard);
  parseTimeDilationCurveKeys(action.speedCurve, `${path}.speedCurve`);
  requireNonEmptyString(action.speedType, `${path}.speedType`);
  requireBoolean(action.faceToMoveDir, `${path}.faceToMoveDir`);
  requireBoolean(action.overrideRotateSpeed, `${path}.overrideRotateSpeed`);
  requireBoolean(action.disableCliffCheck, `${path}.disableCliffCheck`);
  requireBoolean(action.recoverWhenLanding, `${path}.recoverWhenLanding`);
  requireBoolean(action.useTeammateParam, `${path}.useTeammateParam`);
  const teammate = requireRecord(action.teammateParam, `${path}.teammateParam`);
  requireExactFields(
    teammate,
    new Set([
      'inputDirection',
      'speedType',
      'speed',
      'speedCurve',
      'speedScale',
      'faceToMoveDir',
      'overrideRotateSpeed',
      'rotateSpeed',
      'disableDynamicPush',
    ]),
    `${path}.teammateParam`,
  );
  requireNonEmptyString(teammate.inputDirection, `${path}.teammateParam.inputDirection`);
  requireNonEmptyString(teammate.speedType, `${path}.teammateParam.speedType`);
  parseScalarSource(teammate.speed, `${path}.teammateParam.speed`, inheritedBlackboard);
  parseTimeDilationCurveKeys(teammate.speedCurve, `${path}.teammateParam.speedCurve`);
  parseScalarSource(teammate.speedScale, `${path}.teammateParam.speedScale`, inheritedBlackboard);
  requireBoolean(teammate.faceToMoveDir, `${path}.teammateParam.faceToMoveDir`);
  requireBoolean(teammate.overrideRotateSpeed, `${path}.teammateParam.overrideRotateSpeed`);
  parseScalarSource(teammate.rotateSpeed, `${path}.teammateParam.rotateSpeed`, inheritedBlackboard);
  requireBoolean(teammate.disableDynamicPush, `${path}.teammateParam.disableDynamicPush`);
  return {
    kind: 'receiveMoveInput',
    duration: parseScalarSource(action.duration, `${path}.duration`, inheritedBlackboard),
    inputDirection: requireNonEmptyString(action.inputDirection, `${path}.inputDirection`),
  };
}

/**
 * MoveToAction 的原生完成时机仍受 IFix 保护；这里只严格保存完整空间载荷，并交由固定零距离
 * 投影判断是否可省略。不能据此把动作解释为同步瞬移。
 */
export function parseMoveToActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): MoveToActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'moveType',
      'totalTime',
      'updateMoveTarget',
      'directionType',
      'target',
      'fixAngle',
      'fixDirectionType',
      'fixPosAngle',
      'fixPosLength',
      'blockRadius',
      'enableMaxDistanceCheckWhenMoveBack',
      'maxDistanceWhenMoveBack',
      'useExtraBlockRadiusForInt',
      'extraRadiusForInt',
      'counterClockwise',
      'faceToMoveDir',
      'overrideRotateRate',
      'rotateRate',
      'speedType',
      'speed',
      'speedCurve',
      'rootMotionAnimKey',
      'startOffsetFrame',
      'autoScaled',
      'rootMotionScale',
      'dontClampDirToXZ',
      'enableXAxisMove',
      'xAxisSpeed',
      'enableYAxisMove',
      'yAxisSpeed',
      'limitMoveDirRotateSpeed',
      'moveDirYRotateSpeed',
      'disableReachAutoEnd',
      'ignoreNavmesh',
      'ignoreAllCollision',
      'ignoreCollisionLayer',
      'stopByCliff',
      'overrideStepOffset',
      'stepOffset',
    ]),
    path,
  );
  parseNumberVector3(action.fixAngle, `${path}.fixAngle`);
  parseScalarVector3(action.fixPosAngle, `${path}.fixPosAngle`, inheritedBlackboard);
  for (const key of [
    'fixPosLength',
    'blockRadius',
    'maxDistanceWhenMoveBack',
    'extraRadiusForInt',
    'rotateRate',
    'speed',
    'rootMotionScale',
  ] as const)
    parseScalarSource(action[key], `${path}.${key}`, inheritedBlackboard);
  parseTimeDilationCurveKeys(action.speedCurve, `${path}.speedCurve`);
  parseMoveSubSpeed(action.xAxisSpeed, `${path}.xAxisSpeed`, inheritedBlackboard);
  parseMoveSubSpeed(action.yAxisSpeed, `${path}.yAxisSpeed`, inheritedBlackboard);
  for (const key of [
    'updateMoveTarget',
    'enableMaxDistanceCheckWhenMoveBack',
    'useExtraBlockRadiusForInt',
    'counterClockwise',
    'faceToMoveDir',
    'overrideRotateRate',
    'autoScaled',
    'dontClampDirToXZ',
    'enableXAxisMove',
    'enableYAxisMove',
    'limitMoveDirRotateSpeed',
    'disableReachAutoEnd',
    'ignoreNavmesh',
    'ignoreAllCollision',
    'stopByCliff',
    'overrideStepOffset',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  requireNonEmptyString(action.fixDirectionType, `${path}.fixDirectionType`);
  requireString(action.rootMotionAnimKey, `${path}.rootMotionAnimKey`);
  requireInteger(action.startOffsetFrame, `${path}.startOffsetFrame`);
  requireNumber(action.moveDirYRotateSpeed, `${path}.moveDirYRotateSpeed`);
  requireNumber(action.stepOffset, `${path}.stepOffset`);
  const ignoredLayers = requireRecord(action.ignoreCollisionLayer, `${path}.ignoreCollisionLayer`);
  requireExactFields(ignoredLayers, new Set(), `${path}.ignoreCollisionLayer`);
  return {
    kind: 'moveTo',
    moveType: requireNonEmptyString(action.moveType, `${path}.moveType`),
    totalTime: parseScalarSource(action.totalTime, `${path}.totalTime`, inheritedBlackboard),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    updateMoveTarget: requireBoolean(action.updateMoveTarget, `${path}.updateMoveTarget`),
    directionType: requireNonEmptyString(action.directionType, `${path}.directionType`),
    speedType: requireNonEmptyString(action.speedType, `${path}.speedType`),
  };
}

/**
 * CustomRootMotionAction 的原生 executeReturnType 为 CustomReturnType；动作在自己的时间线区间内
 * 创建、更新并在 OnEnd 释放 MoveRequestHandle。来源层保存完整移动载荷，固定零距离投影只能在
 * 后续战斗动作不读取空间结果时省略，不能把它解释为同步瞬移或无条件成功。
 */
export function parseCustomRootMotionActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CustomRootMotionActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'moveTo',
      'animKey',
      'rootMotionCurveMask',
      'scaleX',
      'scaleY',
      'enableScaleZWithDistanceCurve',
      'distance2ScaleZ',
      'scaleZ',
      'blockRadius',
      'useExtraBlockRadiusForInt',
      'extraRadiusForInt',
      'enableMaxDistanceCheckWhenMoveBack',
      'maxDistanceWhenMoveBack',
      'updateDir',
      'startOffsetFrame',
      'playbackSpeed',
      'stopByCliff',
      'ignoreAllCollision',
      'ignoreCollisionLayer',
    ]),
    path,
  );
  for (const key of [
    'scaleX',
    'scaleY',
    'scaleZ',
    'blockRadius',
    'extraRadiusForInt',
    'maxDistanceWhenMoveBack',
    'playbackSpeed',
  ] as const)
    parseScalarSource(action[key], `${path}.${key}`, inheritedBlackboard);
  parseTimeDilationCurveKeys(action.distance2ScaleZ, `${path}.distance2ScaleZ`);
  for (const key of [
    'enableScaleZWithDistanceCurve',
    'useExtraBlockRadiusForInt',
    'enableMaxDistanceCheckWhenMoveBack',
    'updateDir',
    'stopByCliff',
    'ignoreAllCollision',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  const ignoredLayers = requireRecord(action.ignoreCollisionLayer, `${path}.ignoreCollisionLayer`);
  requireExactFields(ignoredLayers, new Set(), `${path}.ignoreCollisionLayer`);
  return {
    kind: 'customRootMotion',
    target: parseTargetReferenceSource(action.moveTo, `${path}.moveTo`),
    animationKey: requireString(action.animKey, `${path}.animKey`),
    rootMotionCurveMask: requireNonEmptyString(
      action.rootMotionCurveMask,
      `${path}.rootMotionCurveMask`,
    ),
    updateDirection: requireBoolean(action.updateDir, `${path}.updateDir`),
    startOffsetFrame: requireInteger(action.startOffsetFrame, `${path}.startOffsetFrame`),
  };
}

/**
 * 原生动作建立一段贴近目标的移动请求；它不携带战斗载荷。固定零距离投影可以在后继链不读取
 * 空间结果时省略它，但来源层仍校验完整曲线、根运动和移动优先级字段，避免把未知变体静默吞掉。
 */
export function parseSnapToTargetWithRangeActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): SnapToTargetWithRangeActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'moveTo',
      'fixPositionWhenStart',
      'radius',
      'moveType',
      'needRotate',
      'useFixSpeed',
      'speed',
      'fixedSpeedCurveKey',
      'speedCurve',
      'positionCurve',
      'totalTime',
      'rootMotionAnimKey',
      'rootMotionMaxDistance',
      'chargePriority',
    ]),
    path,
  );
  requireBoolean(action.fixPositionWhenStart, `${path}.fixPositionWhenStart`);
  requireBoolean(action.useFixSpeed, `${path}.useFixSpeed`);
  parseScalarSource(action.speed, `${path}.speed`, inheritedBlackboard);
  requireString(action.fixedSpeedCurveKey, `${path}.fixedSpeedCurveKey`);
  parseTimeDilationCurveKeys(action.speedCurve, `${path}.speedCurve`);
  parseTimeDilationCurveKeys(action.positionCurve, `${path}.positionCurve`);
  requireString(action.rootMotionAnimKey, `${path}.rootMotionAnimKey`);
  requireNumber(action.rootMotionMaxDistance, `${path}.rootMotionMaxDistance`);
  requireNonEmptyString(action.chargePriority, `${path}.chargePriority`);
  return {
    kind: 'snapToTargetWithRange',
    target: parseTargetReferenceSource(action.moveTo, `${path}.moveTo`),
    radius: parseScalarSource(action.radius, `${path}.radius`, inheritedBlackboard),
    moveType: requireNonEmptyString(action.moveType, `${path}.moveType`),
    needRotate: requireBoolean(action.needRotate, `${path}.needRotate`),
    totalTime: requireNumber(action.totalTime, `${path}.totalTime`),
  };
}

/**
 * 原生动作测量两个 battle-root 的三维距离并写入动作黑板。来源层保留真实端点，只有投影层
 * 才能依据 Endaxis 固定零距离模型把结果改写为 0。
 */
export function parseSaveTargetDistanceActionSource(
  value: unknown,
  path: string,
): SaveTargetDistanceActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'source',
      'target',
      'bbKey',
    ]),
    path,
  );
  return {
    kind: 'saveTargetDistance',
    source: parseTargetReferenceSource(action.source, `${path}.source`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    outputKey: requireNonEmptyString(action.bbKey, `${path}.bbKey`),
  };
}

function parseNumberVector3(value: unknown, path: string) {
  const vector = requireRecord(value, path);
  requireExactFields(vector, new Set(['x', 'y', 'z']), path);
  for (const key of ['x', 'y', 'z'] as const) requireNumber(vector[key], `${path}.${key}`);
}

function parseScalarVector3(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
) {
  const vector = requireRecord(value, path);
  requireExactFields(vector, new Set(['x', 'y', 'z']), path);
  for (const key of ['x', 'y', 'z'] as const)
    parseScalarSource(vector[key], `${path}.${key}`, inheritedBlackboard);
}

function parseMoveSubSpeed(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
) {
  const speed = requireRecord(value, path);
  requireExactFields(
    speed,
    new Set(['speedType', 'fixedSpeed', 'speedCurve', 'rootMotionAnimKey', 'rootMotionScale']),
    path,
  );
  requireNonEmptyString(speed.speedType, `${path}.speedType`);
  parseScalarSource(speed.fixedSpeed, `${path}.fixedSpeed`, inheritedBlackboard);
  parseTimeDilationCurveKeys(speed.speedCurve, `${path}.speedCurve`);
  requireString(speed.rootMotionAnimKey, `${path}.rootMotionAnimKey`);
  parseScalarSource(speed.rootMotionScale, `${path}.rootMotionScale`, inheritedBlackboard);
}
