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
