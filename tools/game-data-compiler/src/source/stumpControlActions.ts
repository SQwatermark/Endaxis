import { requireExactFields, requireNumber, requireRecord, requireString } from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

export interface StumpControlActionSource {
  readonly kind: 'enemyHurtAnimation' | 'pull' | 'targetHitStop';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
}

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
  if (requireString(action.affectType, `${path}.affectType`) !== 'OnlyTarget')
    throw new Error(`${path}.affectType: only static-target hit stop can be omitted`);
  const duration = requireNumber(action.duration, `${path}.duration`);
  if (!Number.isFinite(duration) || duration < 0)
    throw new Error(`${path}.duration: expected finite non-negative number`);
  return {
    kind: 'targetHitStop',
    source: parseTargetReferenceSource(action.attacker, `${path}.attacker`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
  };
}
