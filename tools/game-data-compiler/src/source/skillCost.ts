import {
  requireExactFields,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
} from './primitives.ts';

/** Native CastData.CostData, also referenced by DamageUnit.costDataList. */
export interface SkillCostSource {
  readonly costType: string;
  readonly costValue: number;
  readonly atbValueThreshold: number;
}

export function parseSkillCostSource(value: unknown, path: string): SkillCostSource {
  const cost = requireRecord(value, path);
  requireExactFields(cost, new Set(['costType', 'costValue', 'atbValueThreshold']), path);
  return {
    costType: requireNonEmptyString(cost.costType, `${path}.costType`),
    costValue: requireNumber(cost.costValue, `${path}.costValue`),
    atbValueThreshold: requireNumber(cost.atbValueThreshold, `${path}.atbValueThreshold`),
  };
}
