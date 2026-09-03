import {
  requireBoolean,
  requireExactFields,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import { parseTagQuerySource, type TagQuerySource } from './tagQuery.ts';

export interface SetSuperArmorActionSource {
  readonly kind: 'setSuperArmor';
  readonly target: TargetReferenceSource;
  readonly superArmorValue: number;
  readonly impactResistance: number;
}

export interface SetDamageTagImmuneRuleActionSource {
  readonly kind: 'setDamageTagImmuneRule';
  readonly target: TargetReferenceSource;
  readonly immuneQuery: TagQuerySource;
}

/** 原生在目标 AbilitySystem 上登记一条伤害标签免疫规则，并在动作 End 时撤销。 */
export function parseSetDamageTagImmuneRuleActionSource(
  value: unknown,
  path: string,
): SetDamageTagImmuneRuleActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'immuneQuery',
      'target',
    ]),
    path,
  );
  return {
    kind: 'setDamageTagImmuneRule',
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    immuneQuery: parseTagQuerySource(action.immuneQuery, `${path}.immuneQuery`),
  };
}

/** 防受击控制数据先保留证据；木桩无主动攻击，当前后端没有玩家受击事件。 */
export function parseSetSuperArmorActionSource(
  value: unknown,
  path: string,
): SetSuperArmorActionSource {
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
      'superArmorValue',
      'impactResistance',
    ]),
    path,
  );
  const staticValue = (raw: unknown, field: string) => {
    const scalar = requireRecord(raw, `${path}.${field}`);
    requireExactFields(
      scalar,
      new Set(['useBlackboardKey', 'value', 'blackboardKey', 'useCustomValue']),
      `${path}.${field}`,
    );
    if (
      requireBoolean(scalar.useBlackboardKey, `${path}.${field}.useBlackboardKey`) ||
      requireString(scalar.blackboardKey, `${path}.${field}.blackboardKey`) !== '' ||
      requireBoolean(scalar.useCustomValue, `${path}.${field}.useCustomValue`)
    )
      throw new Error(`${path}.${field}: dynamic/custom super armor is unsupported`);
    return requireNumber(scalar.value, `${path}.${field}.value`);
  };
  return {
    kind: 'setSuperArmor',
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    superArmorValue: staticValue(action.superArmorValue, 'superArmorValue'),
    impactResistance: staticValue(action.impactResistance, 'impactResistance'),
  };
}
