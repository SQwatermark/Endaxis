import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

export interface TimeDilationCurveKeySource {
  readonly time: number;
  readonly value: number;
  readonly inTangent: number;
  readonly outTangent: number;
  readonly weightedMode: number;
  readonly inWeight: number;
  readonly outWeight: number;
}

export interface TimeDilationActionSource {
  readonly kind: 'timeDilation';
  readonly layer: 'Global' | 'Entity';
  readonly slotTagId: number;
  readonly priorityTagId: number;
  readonly duration: ScalarSource;
  readonly useCurveKey: boolean;
  readonly curveKey: string;
  /** 当前 1.4.4 导出直接序列化关键帧数组，不带 FAnimationCurve 包装与 wrap mode。 */
  readonly inlineCurveKeys: readonly TimeDilationCurveKeySource[];
  readonly finishByAction: boolean;
  readonly ignoreTargets: readonly TargetReferenceSource[];
  readonly effectTargets: readonly TargetReferenceSource[];
  readonly useTimeScaleForSkillCooldownTick: boolean;
  readonly influenceSkillCooldownTime: ScalarSource;
}

export interface UltimateTimeActionSource {
  readonly kind: 'ultimateTimeDilation';
  readonly timeScale: number;
  readonly priorityTagId: number;
  readonly ignoreTargets: readonly TargetReferenceSource[];
}

export function parseTimeDilationActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): TimeDilationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'layer',
      'slot',
      'timeDilationPriority',
      'duration',
      'useCurveKey',
      'curveKey',
      'timeScaleCurve',
      'finishByAction',
      'ignoreTargets',
      'effectTargets',
      'useTimeScaleForSkillCdTick',
      'influenceSkillCdTime',
    ]),
    path,
  );
  const layer = requireString(action.layer, `${path}.layer`);
  if (layer !== 'Global' && layer !== 'Entity')
    throw new Error(`${path}.layer: unsupported value ${JSON.stringify(layer)}`);
  return {
    kind: 'timeDilation',
    layer,
    slotTagId: parseTagId(action.slot, `${path}.slot`),
    priorityTagId: parseTagId(action.timeDilationPriority, `${path}.timeDilationPriority`),
    duration: parseScalarSource(action.duration, `${path}.duration`, inheritedBlackboard),
    useCurveKey: requireBoolean(action.useCurveKey, `${path}.useCurveKey`),
    curveKey: requireString(action.curveKey, `${path}.curveKey`),
    inlineCurveKeys: parseTimeDilationCurveKeys(action.timeScaleCurve, `${path}.timeScaleCurve`),
    finishByAction: requireBoolean(action.finishByAction, `${path}.finishByAction`),
    ignoreTargets: parseTargets(action.ignoreTargets, `${path}.ignoreTargets`),
    effectTargets: parseTargets(action.effectTargets, `${path}.effectTargets`),
    useTimeScaleForSkillCooldownTick: requireBoolean(
      action.useTimeScaleForSkillCdTick,
      `${path}.useTimeScaleForSkillCdTick`,
    ),
    influenceSkillCooldownTime: parseScalarSource(
      action.influenceSkillCdTime,
      `${path}.influenceSkillCdTime`,
      inheritedBlackboard,
    ),
  };
}

export function parseUltimateTimeActionSource(
  value: unknown,
  path: string,
): UltimateTimeActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'timeScale', 'timeDilationPriority', 'ignoreTargets']),
    path,
  );
  return {
    kind: 'ultimateTimeDilation',
    timeScale: requireNumber(action.timeScale, `${path}.timeScale`),
    priorityTagId: parseTagId(action.timeDilationPriority, `${path}.timeDilationPriority`),
    ignoreTargets: parseTargets(action.ignoreTargets, `${path}.ignoreTargets`),
  };
}

export function parseTimeDilationCurveKeys(
  value: unknown,
  path: string,
): TimeDilationCurveKeySource[] {
  return requireArray(value, path).map((raw, index) => {
    const keyPath = `${path}[${index}]`;
    const key = requireRecord(raw, keyPath);
    requireExactFields(
      key,
      new Set([
        'time',
        'value',
        'inTangent',
        'outTangent',
        'weightedMode',
        'inWeight',
        'outWeight',
      ]),
      keyPath,
    );
    return {
      time: requireNumber(key.time, `${keyPath}.time`),
      value: requireNumber(key.value, `${keyPath}.value`),
      inTangent: requireNumber(key.inTangent, `${keyPath}.inTangent`),
      outTangent: requireNumber(key.outTangent, `${keyPath}.outTangent`),
      weightedMode: requireInteger(key.weightedMode, `${keyPath}.weightedMode`),
      inWeight: requireNumber(key.inWeight, `${keyPath}.inWeight`),
      outWeight: requireNumber(key.outWeight, `${keyPath}.outWeight`),
    };
  });
}

function parseTagId(value: unknown, path: string): number {
  const tag = requireRecord(value, path);
  requireExactFields(tag, new Set(['tagId']), path);
  return requireInteger(tag.tagId, `${path}.tagId`);
}

function parseTargets(value: unknown, path: string): TargetReferenceSource[] {
  return requireArray(value, path).map((target, index) =>
    parseTargetReferenceSource(target, `${path}[${index}]`),
  );
}
