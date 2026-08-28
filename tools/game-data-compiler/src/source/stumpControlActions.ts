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
import {
  parseTimeDilationCurveKeys,
  type TimeDilationCurveKeySource,
} from './timeDilationActions.ts';
import { parseAdvancedDirectionSource } from './spatial.ts';

export interface StaticEnemyControlActionSource {
  readonly kind: 'enemyHurtAnimation' | 'pull' | 'pushBack';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
}

export interface TargetHitStopActionSource {
  readonly kind: 'targetHitStop';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly affectType: string;
  readonly curveKey: string;
  readonly directCurveKeys: readonly TimeDilationCurveKeySource[];
  readonly durationSeconds: number;
  readonly priorityTagId: number;
}

export interface BlowOffEnemyActionSource {
  readonly kind: 'blowOffEnemy';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly deadOption: string;
}

export type StumpControlActionSource =
  StaticEnemyControlActionSource | TargetHitStopActionSource | BlowOffEnemyActionSource;

const META = ['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex'];

export function parseEnemyHurtAnimationActionSource(
  value: unknown,
  path: string,
): StumpControlActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...META,
      'attacker',
      'defender',
      'hurtAnim',
      'additiveShaking',
      'shakeIntensity',
      'randFrameWhenZeroTimeScale',
      'faceToAttacker',
      'faceDirectionSettings',
      'teammateUseWeakenEffect',
      'overrideTransitionTime',
      'transitionTime',
      'weakImmobilizedTime',
      'weakUnmovableTime',
      'customPushBackDistance',
      'pushBackDistance',
      'distanceCurveEnabled',
      'distanceCurve',
      'distanceUseScale',
      'immobilizedTimeUseScale',
      'unmovableTimeUseScale',
      'deadAlsoPlayAnim',
      'deadTargetFactor',
      'impactValue',
      'overrideSuperArmorLimit',
    ]),
    path,
  );
  return {
    kind: 'enemyHurtAnimation',
    source: parseTargetReferenceSource(action.attacker, `${path}.attacker`),
    target: parseTargetReferenceSource(action.defender, `${path}.defender`),
  };
}

export function parsePullActionSource(value: unknown, path: string): StumpControlActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...META,
      'targetSettings',
      'pullSpeedUseBb',
      'pullSpeed',
      'pullSpeedBb',
      'isInfinity',
      'pullDuration',
      'stopTolerance',
      'unmovable',
      'finishPullByAction',
      'destination',
      'pullTargetType',
      'fixedDistanceMode',
      'attenuationBySuperArmor',
      'attenuationValues',
    ]),
    path,
  );
  return {
    kind: 'pull',
    source: parseTargetReferenceSource(action.destination, `${path}.destination`),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
  };
}

export function parsePushBackActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): StumpControlActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...META,
      'attackerTargetSettings',
      'sourcePointSettings',
      'targetSettings',
      'pushBackDirection',
      'pushBackDistance',
      'distanceCurveEnabled',
      'curveOriginUseSourcePoint',
      'distanceCurve',
      'distanceUseScale',
      'timeUseScale',
      'unmovableUseScale',
      'pushBackTime',
      'unmovableTime',
      'useCustomCurve',
      'customCurve',
      'curveTemplate',
    ]),
    path,
  );
  parseTargetReferenceSource(action.sourcePointSettings, `${path}.sourcePointSettings`);
  for (const key of ['pushBackDistance', 'pushBackTime', 'unmovableTime'] as const)
    parseScalarSource(action[key], `${path}.${key}`, inheritedBlackboard);
  for (const key of [
    'distanceCurveEnabled',
    'curveOriginUseSourcePoint',
    'distanceUseScale',
    'timeUseScale',
    'unmovableUseScale',
    'useCustomCurve',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  parseTimeDilationCurveKeys(action.distanceCurve, `${path}.distanceCurve`, true);
  parseTimeDilationCurveKeys(action.customCurve, `${path}.customCurve`, true);
  requireString(action.pushBackDirection, `${path}.pushBackDirection`);
  requireString(action.curveTemplate, `${path}.curveTemplate`);
  return {
    kind: 'pushBack',
    source: parseTargetReferenceSource(
      action.attackerTargetSettings,
      `${path}.attackerTargetSettings`,
    ),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
  };
}

/**
 * 严格保存 BlowOffEnemyAction 的目标、空间参数与死亡过滤。具体物理异常链只有在目标仍可参与
 * 木桩数值模拟时才能投影；OnlyDead 切片可在目标死亡终止模型下审计省略。
 */
export function parseBlowOffEnemyActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BlowOffEnemyActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...META,
      'attackerTargetSettings',
      'targetSettings',
      'blowOffDistance',
      'distanceRandomRange',
      'overwriteHeight',
      'blowOffHeight',
      'directionSettings',
      'totalTime',
      'isExtra',
      'deadOption',
    ]),
    path,
  );
  for (const key of [
    'blowOffDistance',
    'distanceRandomRange',
    'blowOffHeight',
    'totalTime',
  ] as const)
    parseScalarSource(action[key], `${path}.${key}`, inheritedBlackboard);
  requireBoolean(action.overwriteHeight, `${path}.overwriteHeight`);
  parseAdvancedDirectionSource(action.directionSettings, `${path}.directionSettings`);
  requireBoolean(action.isExtra, `${path}.isExtra`);
  return {
    kind: 'blowOffEnemy',
    source: parseTargetReferenceSource(
      action.attackerTargetSettings,
      `${path}.attackerTargetSettings`,
    ),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    deadOption: requireString(action.deadOption, `${path}.deadOption`),
  };
}

export function parseTargetHitStopActionSource(
  value: unknown,
  path: string,
): StumpControlActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...META,
      'affectType',
      'curveKey',
      'useDirectCurve',
      'directCurve',
      'duration',
      'timeDilationPriority',
      'attacker',
      'target',
    ]),
    path,
  );
  const affectType = requireString(action.affectType, `${path}.affectType`);
  if (!['OnlyAttacker', 'OnlyTarget', 'Both'].includes(affectType))
    throw new Error(`${path}.affectType: unsupported hit-stop target set ${affectType}`);
  const useDirectCurve = requireBoolean(action.useDirectCurve, `${path}.useDirectCurve`);
  const directCurve = requireArray(action.directCurve, `${path}.directCurve`);
  const curveKey = requireString(action.curveKey, `${path}.curveKey`);
  if (
    (useDirectCurve && directCurve.length === 0) ||
    (!useDirectCurve && (directCurve.length > 0 || curveKey.length === 0))
  )
    throw new Error(`${path}: inconsistent hit-stop curve source`);
  const duration = requireNumber(action.duration, `${path}.duration`);
  if (!Number.isFinite(duration) || duration < 0)
    throw new Error(`${path}.duration: expected finite non-negative number`);
  const priority = requireRecord(action.timeDilationPriority, `${path}.timeDilationPriority`);
  requireExactFields(priority, new Set(['tagId']), `${path}.timeDilationPriority`);
  return {
    kind: 'targetHitStop',
    source: parseTargetReferenceSource(action.attacker, `${path}.attacker`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    affectType,
    curveKey,
    directCurveKeys: useDirectCurve
      ? parseTimeDilationCurveKeys(directCurve, `${path}.directCurve`)
      : [],
    durationSeconds: duration,
    priorityTagId: requireInteger(priority.tagId, `${path}.timeDilationPriority.tagId`),
  };
}
