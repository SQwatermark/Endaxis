import {
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

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
  readonly kind: 'cameraImpulse' | 'cameraControlState' | 'dynamicCameraControlState';
}

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

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
