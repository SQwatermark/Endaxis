import {
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
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
    };

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
  requireNonEmptyString(action.dir1DirectionType, `${path}.dir1DirectionType`);
  requireNonEmptyString(action.dir2DirectionType, `${path}.dir2DirectionType`);
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
