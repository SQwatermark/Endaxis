import {
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
  requireStringOrInteger,
} from './primitives.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import {
  parseTimeDilationCurveKeys,
  type TimeDilationCurveKeySource,
} from './timeDilationActions.ts';

export type PresentationCalculationActionSource =
  | {
      readonly kind: 'saveTwoDirectionAngle';
      readonly sources: readonly TargetReferenceSource[];
      readonly outputKey: string;
    }
  | {
      readonly kind: 'evaluateCurve';
      readonly input: ScalarSource;
      readonly outputKey: string;
      readonly curve: readonly TimeDilationCurveKeySource[];
    }
  | {
      readonly kind: 'saveCameraAngle';
      readonly target: TargetReferenceSource;
      readonly mountPoint: string | number;
      readonly outputKeys: readonly string[];
    };

/**
 * 严格保留 SaveCameraAngle 的目标与实际写入键。角度值本身不在导入阶段求值；
 * 只有完整技能数据流证明这些键仅被表现动作消费时，调用方才会省略该动作。
 */
export function parseSaveCameraAngleActionSource(
  value: unknown,
  path: string,
): PresentationCalculationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'target',
      'mountPoint',
      'yawKey',
      'pitchKey',
      'eulerPitchKey',
      'distanceKey',
    ]),
    path,
  );
  const outputKeys = ['yawKey', 'pitchKey', 'eulerPitchKey', 'distanceKey']
    .map(key => {
      const output = action[key];
      if (typeof output !== 'string') throw new Error(`${path}.${key}: expected string`);
      return output;
    })
    .filter(key => key.length > 0);
  if (outputKeys.length === 0) throw new Error(`${path}: expected at least one output key`);
  return {
    kind: 'saveCameraAngle',
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    mountPoint: requireStringOrInteger(action.mountPoint, `${path}.mountPoint`),
    outputKeys,
  };
}

export function parseSaveTwoDirectionAngleActionSource(
  value: unknown,
  path: string,
): PresentationCalculationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'dir1Source',
      'dir1Target',
      'dir1DirectionType',
      'dir2Source',
      'dir2Target',
      'dir2DirectionType',
      'key',
    ]),
    path,
  );
  requireStringOrInteger(action.dir1DirectionType, `${path}.dir1DirectionType`);
  requireStringOrInteger(action.dir2DirectionType, `${path}.dir2DirectionType`);
  return {
    kind: 'saveTwoDirectionAngle',
    sources: [
      parseTargetReferenceSource(action.dir1Source, `${path}.dir1Source`),
      parseTargetReferenceSource(action.dir1Target, `${path}.dir1Target`),
      parseTargetReferenceSource(action.dir2Source, `${path}.dir2Source`),
      parseTargetReferenceSource(action.dir2Target, `${path}.dir2Target`),
    ],
    outputKey: requireNonEmptyString(action.key, `${path}.key`),
  };
}

export function parseCurveEvaluateFloatActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): PresentationCalculationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'inputValue',
      'useCustomCurve',
      'customCurve',
      'curveTemplate',
      'key',
    ]),
    path,
  );
  if (!requireBoolean(action.useCustomCurve, `${path}.useCustomCurve`))
    throw new Error(`${path}.useCustomCurve: named curve evaluation is unsupported`);
  requireNonEmptyString(action.curveTemplate, `${path}.curveTemplate`);
  return {
    kind: 'evaluateCurve',
    input: parseScalarSource(action.inputValue, `${path}.inputValue`, inheritedBlackboard),
    outputKey: requireNonEmptyString(action.key, `${path}.key`),
    curve: parseTimeDilationCurveKeys(action.customCurve, `${path}.customCurve`, true),
  };
}
