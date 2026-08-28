import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import { parseScalarSource, type BlackboardLevelValues } from './scalar.ts';
import { parseTimeDilationCurveKeys } from './timeDilationActions.ts';

export interface PlaySoundActionSource {
  readonly kind: 'playSound';
  readonly soundEvent: string;
  readonly stopOnEnd: boolean;
  readonly stopFadeDurationMilliseconds: number;
  readonly canInterruptTimeMilliseconds: number;
  readonly interruptFadeDurationMilliseconds: number;
  readonly jumpToWhenPlayMilliseconds: number;
  readonly useTemporaryEmitter: boolean;
  readonly target: TargetReferenceSource;
  readonly mountPoint: string;
  readonly followMountPoint: boolean;
  readonly useWeaponMountPoint: boolean;
  readonly weaponIndex: number;
  readonly weaponMountPoint: string;
  readonly useTimeDilationPauseAndSeek: boolean;
  readonly timeDilationPauseThreshold: number;
  readonly timeDilationSeekThreshold: number;
  readonly timeDilationFadeOutDurationMilliseconds: number;
  readonly timeDilationFadeInDurationMilliseconds: number;
}

export interface DebugPrintActionSource {
  readonly kind: 'debugPrint';
  readonly logType: string | number;
  readonly target: TargetReferenceSource;
  readonly color: {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number;
  };
  readonly blackboardKey: string;
  readonly identifier: string;
}

export interface EffectActionSource {
  readonly kind: 'effect';
  readonly target: TargetReferenceSource;
  readonly effectSource: TargetReferenceSource;
  readonly effectName: string;
}

export interface CameraPresentationActionSource {
  readonly kind:
    | 'cameraImpulse'
    | 'cameraControlState'
    | 'dynamicCameraControlState'
    | 'cameraRotate'
    | 'animatedCamera'
    | 'hideUi'
    | 'ultimateShow'
    | 'weaponVisibility'
    | 'weaponAnimation'
    | 'animatorParameter'
    | 'igniteBuffText'
    | 'immuneText'
    | 'weaponMountPoint'
    | 'voiceTrigger'
    | 'overrideCameraFollow'
    | 'temporaryUnlock'
    | 'lockCameraAim'
    | 'actorVisibility';
  readonly readBlackboardKeys?: readonly string[];
}

export function parseIgniteBuffTextActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'mountPoint',
      'offset',
      'energyShardType',
      'textId',
      'showOnSquadIcon',
      'forceMainBody',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  requireString(action.mountPoint, `${path}.mountPoint`);
  const offset = requireRecord(action.offset, `${path}.offset`);
  requireExactFields(offset, new Set(['x', 'y']), `${path}.offset`);
  requireNumber(offset.x, `${path}.offset.x`);
  requireNumber(offset.y, `${path}.offset.y`);
  requireString(action.energyShardType, `${path}.energyShardType`);
  requireString(action.textId, `${path}.textId`);
  requireBoolean(action.showOnSquadIcon, `${path}.showOnSquadIcon`);
  requireBoolean(action.forceMainBody, `${path}.forceMainBody`);
  return { kind: 'igniteBuffText' };
}

/** 伤害免疫提示只携带文字、挂点和屏幕偏移；严格解析后进入无渲染后端的表现叶。 */
export function parseImmuneTextActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'mountPoint',
      'offset',
      'textId',
      'forceMainBody',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  requireString(action.mountPoint, `${path}.mountPoint`);
  const offset = requireRecord(action.offset, `${path}.offset`);
  requireExactFields(offset, new Set(['x', 'y']), `${path}.offset`);
  requireNumber(offset.x, `${path}.offset.x`);
  requireNumber(offset.y, `${path}.offset.y`);
  requireString(action.textId, `${path}.textId`);
  requireBoolean(action.forceMainBody, `${path}.forceMainBody`);
  return { kind: 'immuneText' };
}

export function parseSetAnimatorParameterActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'paramName', 'paramAction', 'actionOnEnd', 'endAction']),
    path,
  );
  requireString(action.paramName, `${path}.paramName`);
  parseAnimatorParameterAction(action.paramAction, `${path}.paramAction`);
  requireBoolean(action.actionOnEnd, `${path}.actionOnEnd`);
  parseAnimatorParameterAction(action.endAction, `${path}.endAction`);
  return { kind: 'animatorParameter' };
}

export function parseShowHideActorActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'showHideType',
      'modelPartEnum',
      'isShow',
      'affectInit',
      'revertOnRelease',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  requireString(action.showHideType, `${path}.showHideType`);
  requireString(action.modelPartEnum, `${path}.modelPartEnum`);
  requireBoolean(action.isShow, `${path}.isShow`);
  requireBoolean(action.affectInit, `${path}.affectInit`);
  requireBoolean(action.revertOnRelease, `${path}.revertOnRelease`);
  return { kind: 'actorVisibility' };
}

export function parseModifyWeaponMountPointActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'weaponIndex',
      'overrideIdleMountPoint',
      'idleMountPoint',
      'overrideFightMountPoint',
      'fightMountPoint',
    ]),
    path,
  );
  requireInteger(action.weaponIndex, `${path}.weaponIndex`);
  requireBoolean(action.overrideIdleMountPoint, `${path}.overrideIdleMountPoint`);
  requireString(action.idleMountPoint, `${path}.idleMountPoint`);
  requireBoolean(action.overrideFightMountPoint, `${path}.overrideFightMountPoint`);
  requireString(action.fightMountPoint, `${path}.fightMountPoint`);
  return { kind: 'weaponMountPoint' };
}

export function parseWeaponAnimationActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'weaponId',
      'paramAction',
      'actionOnEnd',
      'endAction',
      'actionOnInterrupt',
      'interruptionAction',
      'overrideInterruptionTime',
      'interruptionBefore',
    ]),
    path,
  );
  requireInteger(action.weaponId, `${path}.weaponId`);
  parseAnimatorParameterAction(action.paramAction, `${path}.paramAction`);
  requireBoolean(action.actionOnEnd, `${path}.actionOnEnd`);
  parseAnimatorParameterAction(action.endAction, `${path}.endAction`);
  requireBoolean(action.actionOnInterrupt, `${path}.actionOnInterrupt`);
  parseAnimatorParameterAction(action.interruptionAction, `${path}.interruptionAction`);
  requireBoolean(action.overrideInterruptionTime, `${path}.overrideInterruptionTime`);
  requireNumber(action.interruptionBefore, `${path}.interruptionBefore`);
  return { kind: 'weaponAnimation' };
}

function parseAnimatorParameterAction(value: unknown, path: string): void {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set(['animatorParam', 'paramType', 'boolValue', 'intValue', 'floatValue']),
    path,
  );
  requireInteger(action.animatorParam, `${path}.animatorParam`);
  requireString(action.paramType, `${path}.paramType`);
  requireBoolean(action.boolValue, `${path}.boolValue`);
  requireInteger(action.intValue, `${path}.intValue`);
  requireNumber(action.floatValue, `${path}.floatValue`);
}

export function parseHideUiActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, new Set([...ACTION_META_FIELDS, 'onlyBlockInput']), path);
  requireBoolean(action.onlyBlockInput, `${path}.onlyBlockInput`);
  return { kind: 'hideUi' };
}

export function parseUltimateShowActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, new Set(ACTION_META_FIELDS), path);
  return { kind: 'ultimateShow' };
}

export function parseAnimatedCameraActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'cameraAnimKey',
      'duration',
      'horizontalInheritType',
      'outRelativeHorizontalAngle',
      'verticalInheritType',
      'outVerticalValue',
      'zoomScaleInheritType',
      'outZoomScale',
      'fitByCameraPos',
      'followPosition',
      'followRotation',
      'easeIn',
      'easeInTime',
      'easeOut',
      'easeOutTime',
      'hideAllRendererEffect',
      'affectedByTimeScale',
      'checkCollisionOnEnd',
      'checkCollisionTime',
      'endByInput',
    ]),
    path,
  );
  requireString(action.cameraAnimKey, `${path}.cameraAnimKey`);
  for (const key of [
    'duration',
    'outRelativeHorizontalAngle',
    'outVerticalValue',
    'outZoomScale',
    'easeInTime',
    'easeOutTime',
    'checkCollisionTime',
  ] as const)
    requireNumber(action[key], `${path}.${key}`);
  for (const key of [
    'horizontalInheritType',
    'verticalInheritType',
    'zoomScaleInheritType',
  ] as const)
    requireString(action[key], `${path}.${key}`);
  for (const key of [
    'fitByCameraPos',
    'followPosition',
    'followRotation',
    'easeIn',
    'easeOut',
    'hideAllRendererEffect',
    'affectedByTimeScale',
    'checkCollisionOnEnd',
    'endByInput',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  return { kind: 'animatedCamera' };
}

export function parseWeaponVisibilityActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'includeAllWeapons',
      'weaponIndex',
      'visible',
      'showVFX',
      'overrideVFX',
      'vfxOverrideConfig',
    ]),
    path,
  );
  requireBoolean(action.includeAllWeapons, `${path}.includeAllWeapons`);
  requireInteger(action.weaponIndex, `${path}.weaponIndex`);
  requireBoolean(action.visible, `${path}.visible`);
  requireBoolean(action.showVFX, `${path}.showVFX`);
  requireBoolean(action.overrideVFX, `${path}.overrideVFX`);
  const vfx = requireRecord(action.vfxOverrideConfig, `${path}.vfxOverrideConfig`);
  const fields = [
    'toIdleAppearParticleFx',
    'toIdleAppearRendererFx',
    'toIdleAppearRendererFx2',
    'toIdleAppearRendererFx3',
    'toIdleAppearRendererFx4',
    'toIdleDisappearParticleFx',
    'toIdleDisappearRendererFx',
    'toFightAppearParticleFx',
    'toFightAppearRendererFx',
  ];
  requireExactFields(
    vfx,
    new Set(fields.flatMap(field => [`enable${field[0]!.toUpperCase()}${field.slice(1)}`, field])),
    `${path}.vfxOverrideConfig`,
  );
  for (const field of fields) {
    requireBoolean(
      vfx[`enable${field[0]!.toUpperCase()}${field.slice(1)}`],
      `${path}.vfxOverrideConfig.enable${field[0]!.toUpperCase()}${field.slice(1)}`,
    );
    requireString(vfx[field], `${path}.vfxOverrideConfig.${field}`);
  }
  return { kind: 'weaponVisibility' };
}

export function parseVoiceTriggerActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      '_triggerKey',
      '_speakerType',
      '_canInterruptTimeMs',
      'targetSettings',
    ]),
    path,
  );
  requireString(action._triggerKey, `${path}._triggerKey`);
  requireString(action._speakerType, `${path}._speakerType`);
  requireInteger(action._canInterruptTimeMs, `${path}._canInterruptTimeMs`);
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  return { kind: 'voiceTrigger' };
}

export function parseCameraRotateActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'ccsPriority',
      'totalAngle',
      'duration',
      'blendStyle',
      'customCurve',
      'inputConflictStrategy',
    ]),
    path,
  );
  requireNumber(action.ccsPriority, `${path}.ccsPriority`);
  const totalAngle = parseScalarSource(
    action.totalAngle,
    `${path}.totalAngle`,
    inheritedBlackboard,
  );
  const duration = parseScalarSource(action.duration, `${path}.duration`, inheritedBlackboard);
  requireString(action.blendStyle, `${path}.blendStyle`);
  parseTimeDilationCurveKeys(action.customCurve, `${path}.customCurve`);
  requireString(action.inputConflictStrategy, `${path}.inputConflictStrategy`);
  return {
    kind: 'cameraRotate',
    readBlackboardKeys: [totalAngle.blackboardKey, duration.blackboardKey].filter(
      (key): key is string => key !== null,
    ),
  };
}

export interface PlayAnimationActionSource {
  readonly kind: 'playAnimation';
  readonly animationName: string;
  readonly durationSeconds: number;
  readonly playbackSpeed: number;
}

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

export function parseOverrideCameraFollowActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'targetSettings2',
      'targetAlpha',
      'blendInStyle',
      'blendInTime',
      'blendOutStyle',
      'blendOutTime',
      'ccsPriority',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  parseTargetReferenceSource(action.targetSettings2, `${path}.targetSettings2`);
  const values = [
    parseScalarSource(action.targetAlpha, `${path}.targetAlpha`, inheritedBlackboard),
    parseScalarSource(action.blendInTime, `${path}.blendInTime`, inheritedBlackboard),
    parseScalarSource(action.blendOutTime, `${path}.blendOutTime`, inheritedBlackboard),
    parseScalarSource(action.ccsPriority, `${path}.ccsPriority`, inheritedBlackboard),
  ];
  requireString(action.blendInStyle, `${path}.blendInStyle`);
  requireString(action.blendOutStyle, `${path}.blendOutStyle`);
  return {
    kind: 'overrideCameraFollow',
    readBlackboardKeys: values
      .map(value => value.blackboardKey)
      .filter((key): key is string => key !== null),
  };
}

export function parseTemporaryUnlockActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'compareTarget', 'targetSettings', 'disableLockAimPriority']),
    path,
  );
  requireBoolean(action.compareTarget, `${path}.compareTarget`);
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  requireNumber(action.disableLockAimPriority, `${path}.disableLockAimPriority`);
  return { kind: 'temporaryUnlock' };
}

/** LockCameraAimAction 只建立相机控制状态；严格读取所有 1.4.4 镜头参数后由无渲染后端省略。 */
export function parseLockCameraAimActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'ccsPriority',
      'overrideLowerParamsToDefault',
      'angleThreshold',
      'forceFollowMainChar',
      'blendInStyle',
      'blendInCustomCurve',
      'blendInTime',
      'blendOutStyle',
      'blendOutCustomCurve',
      'blendOutTime',
      'horizontalBaseAngleMin',
      'horizontalBaseAngleMinBB',
      'horizontalBaseAngleMax',
      'horizontalBaseAngleMaxBB',
      'verticalRelativeToTarget',
      'verticalBaseValue',
      'verticalBaseValueBB',
      'verticalBaseValueMin',
      'verticalBaseValueMinBB',
      'verticalBaseValueMax',
      'verticalBaseValueMaxBB',
      'dampingTime',
      'horizontalSpeedFactor',
      'verticalSpeedFactor',
      'horizontalTweenSpeed',
      'verticalTweenSpeed',
      'allowAimZones',
      'useExitParam',
      'exitParamOnlyOnComplete',
      'exitParam',
      'disablePlayerInputOnBlendIn',
      'disablePlayerInputOnBlendOut',
      'disablePlayerInputInState',
      'cancelOnDrag',
      'cancelOnBeHit',
      'cancelOnMove',
      'overrideTarget1',
      'useMainCharYForTarget1',
      'targetSettings',
      'mountPoint1',
      'overrideLookAtOffset',
      'lookAtOffset',
      'overrideTarget2',
      'useMainCharYForTarget2',
      'targetSettings2',
      'mountPoint2',
      'overrideLookAt2Offset',
      'lookAt2Offset',
      'lookAt2OffsetWhenNoOverride',
      'targetAlpha',
    ]),
    path,
  );
  for (const key of [
    'ccsPriority',
    'angleThreshold',
    'blendInTime',
    'blendOutTime',
    'horizontalBaseAngleMin',
    'horizontalBaseAngleMax',
    'verticalBaseValue',
    'verticalBaseValueMin',
    'verticalBaseValueMax',
    'dampingTime',
    'horizontalSpeedFactor',
    'verticalSpeedFactor',
    'horizontalTweenSpeed',
    'verticalTweenSpeed',
    'targetAlpha',
  ] as const)
    requireNumber(action[key], `${path}.${key}`);
  for (const key of [
    'overrideLowerParamsToDefault',
    'forceFollowMainChar',
    'verticalRelativeToTarget',
    'allowAimZones',
    'useExitParam',
    'exitParamOnlyOnComplete',
    'disablePlayerInputOnBlendIn',
    'disablePlayerInputOnBlendOut',
    'disablePlayerInputInState',
    'cancelOnDrag',
    'cancelOnBeHit',
    'cancelOnMove',
    'overrideTarget1',
    'useMainCharYForTarget1',
    'overrideLookAtOffset',
    'overrideTarget2',
    'useMainCharYForTarget2',
    'overrideLookAt2Offset',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  requireString(action.blendInStyle, `${path}.blendInStyle`);
  requireString(action.blendOutStyle, `${path}.blendOutStyle`);
  requireString(action.mountPoint1, `${path}.mountPoint1`);
  requireString(action.mountPoint2, `${path}.mountPoint2`);
  parseTimeDilationCurveKeys(action.blendInCustomCurve, `${path}.blendInCustomCurve`);
  parseTimeDilationCurveKeys(action.blendOutCustomCurve, `${path}.blendOutCustomCurve`);
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  parseTargetReferenceSource(action.targetSettings2, `${path}.targetSettings2`);
  const readBlackboardKeys = [
    'horizontalBaseAngleMinBB',
    'horizontalBaseAngleMaxBB',
    'verticalBaseValueBB',
    'verticalBaseValueMinBB',
    'verticalBaseValueMaxBB',
  ]
    .map(key => parseScalarSource(action[key], `${path}.${key}`, inheritedBlackboard).blackboardKey)
    .filter((key): key is string => key !== null);
  const exitParam = requireRecord(action.exitParam, `${path}.exitParam`);
  requireExactFields(
    exitParam,
    new Set([
      'applyHorizontalAngle',
      'horizontalAngleRelativeToCharacter',
      'horizontalAngle',
      'applyVerticalValue',
      'verticalValue',
      'applyZoomScale',
      'zoomScale',
    ]),
    `${path}.exitParam`,
  );
  for (const key of [
    'applyHorizontalAngle',
    'horizontalAngleRelativeToCharacter',
    'applyVerticalValue',
    'applyZoomScale',
  ] as const)
    requireBoolean(exitParam[key], `${path}.exitParam.${key}`);
  for (const key of ['horizontalAngle', 'verticalValue', 'zoomScale'] as const)
    requireNumber(exitParam[key], `${path}.exitParam.${key}`);
  for (const key of ['lookAtOffset', 'lookAt2Offset', 'lookAt2OffsetWhenNoOverride'] as const) {
    const vector = requireRecord(action[key], `${path}.${key}`);
    requireExactFields(vector, new Set(['x', 'y', 'z']), `${path}.${key}`);
    for (const axis of ['x', 'y', 'z'] as const)
      requireNumber(vector[axis], `${path}.${key}.${axis}`);
  }
  return { kind: 'lockCameraAim', ...(readBlackboardKeys.length ? { readBlackboardKeys } : {}) };
}

/**
 * 无渲染后端只可省略没有 onEnd 子动作的动画。onEnd 可能承载战斗逻辑，因此非空时严格拒绝，
 * 不能因为根动作是表现动作就连带删除子图。
 */
export function parsePlayAnimationActionSource(
  value: unknown,
  path: string,
): PlayAnimationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'animName',
      'blendDuration',
      'blendOut',
      'duration',
      'playbackSpeed',
      'useStartTimeBlackboardKey',
      'startTime',
      'startTimeBlackboardKey',
      'exitToIdle',
      'blendOutNextStateHash',
      'onEndAction',
      'executeOnNormalEndOnly',
    ]),
    path,
  );
  const onEnd = requireRecord(action.onEndAction, `${path}.onEndAction`);
  requireExactFields(
    onEnd,
    new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
    `${path}.onEndAction`,
  );
  if (
    requireArray(onEnd.actionData, `${path}.onEndAction.actionData`).length > 0 ||
    requireBoolean(
      onEnd.onlyExecuteWhenSourceIsMainChar,
      `${path}.onEndAction.onlyExecuteWhenSourceIsMainChar`,
    ) ||
    requireBoolean(
      onEnd.onlyExecuteWhenSourceIsGuard,
      `${path}.onEndAction.onlyExecuteWhenSourceIsGuard`,
    )
  ) {
    throw new Error(`${path}.onEndAction: animation end combat actions are unsupported`);
  }
  return {
    kind: 'playAnimation',
    animationName: requireString(action.animName, `${path}.animName`),
    durationSeconds: requireNumber(action.duration, `${path}.duration`),
    playbackSpeed: requireNumber(action.playbackSpeed, `${path}.playbackSpeed`),
  };
}

/** PlayAnimationWithStep 在基础动画外建立短距离步进移动；战斗 IR 只省略表现/空间结果。 */
export function parsePlayAnimationWithStepActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): PlayAnimationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'animName',
      'blendDuration',
      'blendOut',
      'duration',
      'playbackSpeed',
      'useStartTimeBlackboardKey',
      'startTime',
      'startTimeBlackboardKey',
      'exitToIdle',
      'blendOutNextStateHash',
      'onEndAction',
      'executeOnNormalEndOnly',
      'stepTarget',
      'montageName',
      'stepDistance',
      'frameToOriginAnim',
      'stepBlendIn',
      'animBlendInAfterStep',
      'snapFrame',
      'snapDistance',
      'useFixSpeed',
      'speed',
      'speedCurveKey',
      'hideWeapon',
      'hideWeaponFrame',
      'battlePoseWhenStep',
    ]),
    path,
  );
  const onEnd = requireRecord(action.onEndAction, `${path}.onEndAction`);
  requireExactFields(
    onEnd,
    new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
    `${path}.onEndAction`,
  );
  if (
    requireArray(onEnd.actionData, `${path}.onEndAction.actionData`).length > 0 ||
    requireBoolean(
      onEnd.onlyExecuteWhenSourceIsMainChar,
      `${path}.onEndAction.onlyExecuteWhenSourceIsMainChar`,
    ) ||
    requireBoolean(
      onEnd.onlyExecuteWhenSourceIsGuard,
      `${path}.onEndAction.onlyExecuteWhenSourceIsGuard`,
    )
  )
    throw new Error(`${path}.onEndAction: animation end combat actions are unsupported`);
  parseTargetReferenceSource(action.stepTarget, `${path}.stepTarget`);
  for (const key of [
    'blendDuration',
    'blendOut',
    'startTime',
    'stepDistance',
    'stepBlendIn',
    'animBlendInAfterStep',
    'snapDistance',
  ] as const)
    requireNumber(action[key], `${path}.${key}`);
  for (const key of [
    'frameToOriginAnim',
    'snapFrame',
    'blendOutNextStateHash',
    'hideWeaponFrame',
  ] as const)
    requireInteger(action[key], `${path}.${key}`);
  for (const key of [
    'useStartTimeBlackboardKey',
    'exitToIdle',
    'executeOnNormalEndOnly',
    'useFixSpeed',
    'hideWeapon',
    'battlePoseWhenStep',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  requireString(action.startTimeBlackboardKey, `${path}.startTimeBlackboardKey`);
  requireString(action.montageName, `${path}.montageName`);
  parseScalarSource(action.speed, `${path}.speed`, inheritedBlackboard);
  requireString(action.speedCurveKey, `${path}.speedCurveKey`);
  return {
    kind: 'playAnimation',
    animationName: requireString(action.animName, `${path}.animName`),
    durationSeconds: requireNumber(action.duration, `${path}.duration`),
    playbackSpeed: requireNumber(action.playbackSpeed, `${path}.playbackSpeed`),
  };
}

export function parseCameraPresentationActionSource(
  value: unknown,
  path: string,
  kind: CameraPresentationActionSource['kind'],
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  const fields =
    kind === 'cameraImpulse'
      ? [
          ...ACTION_META_FIELDS,
          'realCameraShake2D',
          'targetSettings',
          'releaseWhenActionEnds',
          '_mountPoint',
          '_boneNode',
          '_positionOffset',
          '_followTarget',
          '_impulseDefinitionData',
        ]
      : kind === 'cameraControlState'
        ? [
            ...ACTION_META_FIELDS,
            'configKey',
            'customPriority',
            'ccsPriority',
            'useCcsCondition',
            'overrideBlendIn',
            'blendInStyle',
            'blendInCustomCurve',
            'blendInTime',
            'overrideBlendOut',
            'blendOutStyle',
            'blendOutCustomCurve',
            'blendOutTime',
            'removeByDuration',
            'ccsDuration',
            'removeByActionEnd',
            'inheritByNextSkill',
            'inheritKey',
            'inheritSkillIds',
            'keepAdditiveParamOnLeave',
          ]
        : [
            ...ACTION_META_FIELDS,
            'debugName',
            'customPriority',
            'ccsPriority',
            'overrideLowerParamsToDefault',
            'useCondition',
            'enterConditionsOr',
            'leaveConditionsOr',
            'blendInStyle',
            'blendInCustomCurve',
            'blendInTime',
            'blendOutStyle',
            'blendOutCustomCurve',
            'blendOutTime',
            'removeByDuration',
            'ccsDuration',
            'removeByActionEnd',
            'useAdditiveParam',
            'additiveHorizontalAngle',
            'additiveVerticalValue',
            'additiveZoomScale',
            'keepAdditiveParamOnLeave',
            'useMinZoom',
            'minZoom',
            'useMaxZoom',
            'maxZoom',
            'useMinVerticalValue',
            'minVerticalValue',
            'useMaxVerticalValue',
            'maxVerticalValue',
            'enableHorizontalAngleLimit',
            'minHorizontalAngle',
            'maxHorizontalAngle',
            'useFovCurve',
            'fovCurve',
            'useScreenYCurve',
            'screenYCurve',
            'useShoulderOffset',
            'shoulderOffset',
            'useAdditionalShoulderOffset',
            'additionalShoulderOffset',
            'useLookAtOffset',
            'lookAtOffset',
            'useAdditionalLookAtOffset',
            'additionalLookAtOffset',
            'useAdditiveFOV',
            'additiveFOV',
          ];
  requireExactFields(action, new Set(fields), path);
  if (kind === 'cameraImpulse')
    parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  return { kind };
}

/** EffectAction 的根路由严格读取；渲染专属配置保留在来源 JSON，不进入无渲染战斗 IR。 */
export function parseEffectActionSource(value: unknown, path: string): EffectActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'targetSettings',
      'effectSource',
      'useGuardLodSourceOverride',
      'guardLodSource',
      'isMainCharacterActive',
      'isTargetMainCharacterActive',
      'isShowBigEffect',
      'bigEffectName',
      'playOnHittableObjects',
      'effectActionCfg',
      'saveEffectIdToBlackboard',
      'forceMainBody',
      'isCreateWithSourceModelActive',
    ]),
    path,
  );
  const config = requireRecord(action.effectActionCfg, `${path}.effectActionCfg`);
  return {
    kind: 'effect',
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    effectSource: parseTargetReferenceSource(action.effectSource, `${path}.effectSource`),
    effectName: requireString(config.effectName, `${path}.effectActionCfg.effectName`),
  };
}

/**
 * combat-spec 1.4.4 的 PlaySoundAction.ExecuteInternal 只解析目标并进入音频播放路径。
 * 来源层仍完整校验已知字段；投影层可据此将它保留为有证据的表现 no-op。
 */
export function parsePlaySoundActionSource(value: unknown, path: string): PlaySoundActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      '_soundEvent',
      '_stopOnEnd',
      '_stopFadeDurationMs',
      '_canInterruptTimeMs',
      '_intrptFadeDurationMs',
      '_jumpToWhenPlayMs',
      '_useTempEmitter',
      'targetSettings',
      'mountPoint',
      'followMountPoint',
      'useWeaponMountPoint',
      'weaponIndex',
      'weaponMountPoint',
      'useTimeDilationPauseAndSeek',
      'timeDilationPauseThreshold',
      'timeDilationSeekThreshold',
      'timeDilationFadeOutDurationMs',
      'timeDilationFadeInDurationMs',
    ]),
    path,
  );
  return {
    kind: 'playSound',
    soundEvent: requireString(action._soundEvent, `${path}._soundEvent`),
    stopOnEnd: requireBoolean(action._stopOnEnd, `${path}._stopOnEnd`),
    stopFadeDurationMilliseconds: requireInteger(
      action._stopFadeDurationMs,
      `${path}._stopFadeDurationMs`,
    ),
    canInterruptTimeMilliseconds: requireInteger(
      action._canInterruptTimeMs,
      `${path}._canInterruptTimeMs`,
    ),
    interruptFadeDurationMilliseconds: requireInteger(
      action._intrptFadeDurationMs,
      `${path}._intrptFadeDurationMs`,
    ),
    jumpToWhenPlayMilliseconds: requireInteger(
      action._jumpToWhenPlayMs,
      `${path}._jumpToWhenPlayMs`,
    ),
    useTemporaryEmitter: requireBoolean(action._useTempEmitter, `${path}._useTempEmitter`),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    mountPoint: requireString(action.mountPoint, `${path}.mountPoint`),
    followMountPoint: requireBoolean(action.followMountPoint, `${path}.followMountPoint`),
    useWeaponMountPoint: requireBoolean(action.useWeaponMountPoint, `${path}.useWeaponMountPoint`),
    weaponIndex: requireInteger(action.weaponIndex, `${path}.weaponIndex`),
    weaponMountPoint: requireString(action.weaponMountPoint, `${path}.weaponMountPoint`),
    useTimeDilationPauseAndSeek: requireBoolean(
      action.useTimeDilationPauseAndSeek,
      `${path}.useTimeDilationPauseAndSeek`,
    ),
    timeDilationPauseThreshold: requireNumber(
      action.timeDilationPauseThreshold,
      `${path}.timeDilationPauseThreshold`,
    ),
    timeDilationSeekThreshold: requireNumber(
      action.timeDilationSeekThreshold,
      `${path}.timeDilationSeekThreshold`,
    ),
    timeDilationFadeOutDurationMilliseconds: requireInteger(
      action.timeDilationFadeOutDurationMs,
      `${path}.timeDilationFadeOutDurationMs`,
    ),
    timeDilationFadeInDurationMilliseconds: requireInteger(
      action.timeDilationFadeInDurationMs,
      `${path}.timeDilationFadeInDurationMs`,
    ),
  };
}

/** 1.4.4 原生 fallback 直接返回 true，不读取 bbKey；完整保存载荷，见 combat-spec/docs/combo-condition-leaves.md。 */
export function parseDebugPrintActionSource(value: unknown, path: string): DebugPrintActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'logType',
      'target',
      'color',
      'bbKey',
      'identifier',
    ]),
    path,
  );
  const color = requireRecord(action.color, `${path}.color`);
  requireExactFields(color, new Set(['r', 'g', 'b', 'a']), `${path}.color`);
  return {
    kind: 'debugPrint',
    logType:
      typeof action.logType === 'number'
        ? requireInteger(action.logType, `${path}.logType`)
        : requireString(action.logType, `${path}.logType`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    color: {
      r: requireNumber(color.r, `${path}.color.r`),
      g: requireNumber(color.g, `${path}.color.g`),
      b: requireNumber(color.b, `${path}.color.b`),
      a: requireNumber(color.a, `${path}.color.a`),
    },
    blackboardKey: requireString(action.bbKey, `${path}.bbKey`),
    identifier: requireString(action.identifier, `${path}.identifier`),
  };
}
