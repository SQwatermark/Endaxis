import {
  requireBoolean,
  requireExactFields,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

export interface SetSuperArmorActionSource {
  readonly kind: 'setSuperArmor';
  readonly target: TargetReferenceSource;
  readonly superArmorValue: number;
  readonly impactResistance: number;
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
