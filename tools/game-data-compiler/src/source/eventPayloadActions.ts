import { requireExactFields, requireRecord, requireString } from './primitives.ts';

export interface SaveAtbObtainValueActionSource {
  readonly kind: 'saveAtbObtainValue';
  /** OnObtainAtb.Value：效率结算后、共享技力上限截断前的值。 */
  readonly valueKey: string;
  /** OnObtainAtb.RealDelta：共享技力实际变化量。 */
  readonly realDeltaKey: string;
}

/** 严格读取原生 SaveAtbObtainValue；空键表示不写入相应字段。 */
export function parseSaveAtbObtainValueActionSource(
  value: unknown,
  path: string,
): SaveAtbObtainValueActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'valueKey',
      'realDeltaKey',
    ]),
    path,
  );
  return {
    kind: 'saveAtbObtainValue',
    valueKey: requireString(action.valueKey, `${path}.valueKey`),
    realDeltaKey: requireString(action.realDeltaKey, `${path}.realDeltaKey`),
  };
}
