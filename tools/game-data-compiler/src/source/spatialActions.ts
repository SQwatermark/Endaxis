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
