import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseNativeCalculationSource, type NativeCalculationSource } from './calculation.ts';
import type { BlackboardLevelValues } from './scalar.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

export type HealCalculationSource = NativeCalculationSource;

export interface HealActionSource {
  readonly kind: 'heal';
  readonly alwaysNext: boolean;
  readonly healType: string;
  readonly healer: string;
  readonly contextKey: string;
  readonly target: TargetReferenceSource;
  readonly calculation: HealCalculationSource;
  readonly showHealText: boolean;
  readonly playHealEffect: boolean;
  readonly onlyPlayEffectOnActualHeal: boolean;
  readonly useHealTags: boolean;
  readonly healTagIds: readonly number[];
}

/**
 * 读取 HealAction 的战斗来源事实。特效对象只属于表现层，不复制进公共战斗 IR；
 * 但顶层播放开关仍保留，便于后续审计原生动作是否依赖实际治疗结果。
 */
export function parseHealActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): HealActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'alwaysNext',
      'healType',
      'healer',
      'contextKey',
      'target',
      'healCalculation',
      'showHealText',
      'playHealEffect',
      'effectData',
      'onlyPlayEffectOnActualHeal',
      'useHealTags',
      'healTags',
    ]),
    path,
  );
  // effectData 是庞大的表现配置；确认其对象形状存在，但不让它污染战斗 IR。
  requireRecord(action.effectData, `${path}.effectData`);
  const useHealTags = requireBoolean(action.useHealTags, `${path}.useHealTags`);
  return {
    kind: 'heal',
    alwaysNext: requireBoolean(action.alwaysNext, `${path}.alwaysNext`),
    healType: requireNonEmptyString(action.healType, `${path}.healType`),
    healer: requireNonEmptyString(action.healer, `${path}.healer`),
    contextKey: requireString(action.contextKey, `${path}.contextKey`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    calculation: parseNativeCalculationSource(
      action.healCalculation,
      `${path}.healCalculation`,
      inheritedBlackboard,
    ),
    showHealText: requireBoolean(action.showHealText, `${path}.showHealText`),
    playHealEffect: requireBoolean(action.playHealEffect, `${path}.playHealEffect`),
    onlyPlayEffectOnActualHeal: requireBoolean(
      action.onlyPlayEffectOnActualHeal,
      `${path}.onlyPlayEffectOnActualHeal`,
    ),
    useHealTags,
    healTagIds: parseHealTags(action.healTags, `${path}.healTags`),
  };
}

function parseHealTags(value: unknown, path: string): number[] {
  const tags = requireRecord(value, path);
  requireExactFields(tags, new Set(['predefinedTag']), path);
  return requireArray(tags.predefinedTag, `${path}.predefinedTag`).map((rawTag, index) => {
    const tagPath = `${path}.predefinedTag[${index}]`;
    const tag = requireRecord(rawTag, tagPath);
    requireExactFields(tag, new Set(['tagId']), tagPath);
    if (typeof tag.tagId !== 'number' || !Number.isInteger(tag.tagId)) {
      throw new Error(`${tagPath}.tagId: expected integer`);
    }
    return tag.tagId;
  });
}
