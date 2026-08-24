import {
  requireArray,
  requireExactFields,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireNumber,
  requireRecord,
  requireString,
} from '../../source/primitives.ts';
import type { PassiveSkillCompileRequestSource } from '../passiveDiscovery.ts';

/**
 * 从指定天赋/潜能效果包发现 AddPassiveSkill。这里只确定创建请求，不编译 SkillData 行为。
 */
export function discoverOperatorPassiveSkillRequests(
  value: unknown,
  effectIds: readonly string[],
  sourceName = 'PotentialTalentEffectTable',
): PassiveSkillCompileRequestSource[] {
  const table = requireRecord(value, sourceName);
  const output: PassiveSkillCompileRequestSource[] = [];
  for (const effectId of effectIds) {
    const rowPath = `${sourceName}.${effectId}`;
    const row = requireRecord(table[effectId], rowPath);
    requireExactFields(row, new Set(['dataList', 'desc', 'id']), rowPath);
    const embeddedId = requireNonEmptyString(row.id, `${rowPath}.id`);
    if (embeddedId !== effectId) {
      throw new Error(`${rowPath}.id: expected ${JSON.stringify(effectId)}`);
    }
    parseDescription(row.desc, `${rowPath}.desc`);
    requireArray(row.dataList, `${rowPath}.dataList`).forEach((rawEntry, entryIndex) => {
      const entryPath = `${rowPath}.dataList[${entryIndex}]`;
      const entry = requireRecord(rawEntry, entryPath);
      requireExactFields(
        entry,
        new Set([
          'activeCondition',
          'attachBuff',
          'attachSkill',
          'attrModifier',
          'modifyType',
          'skillBbModifier',
          'skillParamModifier',
        ]),
        entryPath,
      );
      const modifyType = requireNonNegativeInteger(entry.modifyType, `${entryPath}.modifyType`);
      if (![1, 2, 3, 4, 5].includes(modifyType)) {
        throw new Error(`${entryPath}.modifyType: unsupported value ${modifyType}`);
      }
      const activeConditions = requireArray(entry.activeCondition, `${entryPath}.activeCondition`);
      const attachSkill = parseSkillPayload(entry.attachSkill, `${entryPath}.attachSkill`);
      validateOtherPayloadShapes(entry, entryPath);
      if (modifyType !== 1) {
        if (!isEmptySkillPayload(attachSkill)) {
          throw new Error(`${entryPath}.attachSkill: inactive payload is not empty`);
        }
        return;
      }
      if (activeConditions.length > 0) {
        throw new Error(`${entryPath}.activeCondition: condition parser is not connected`);
      }
      if (!attachSkill.skillId) {
        throw new Error(`${entryPath}.attachSkill.skillId: expected non-empty string`);
      }
      if (attachSkill.skillPath) {
        throw new Error(`${entryPath}.attachSkill.skillPath: expected empty string`);
      }
      output.push({
        originKind: 'operatorProgression',
        originId: effectId,
        sourcePath: entryPath,
        skillId: attachSkill.skillId,
        // 原生路径未设置 CreateSkillOptions.level，使用 SkillData 默认等级。
        levelSource: { kind: 'nativeDefault' },
        inputBlackboard: attachSkill.blackboard,
      });
    });
  }
  return output;
}

interface SkillPayload {
  readonly skillId: string;
  readonly skillPath: string;
  readonly blackboard: Readonly<Record<string, number>>;
}

function parseSkillPayload(value: unknown, path: string): SkillPayload {
  const payload = requireRecord(value, path);
  requireExactFields(payload, new Set(['blackboard', 'skillId', 'skillPath']), path);
  const blackboard: Record<string, number> = {};
  requireArray(payload.blackboard, `${path}.blackboard`).forEach((rawEntry, index) => {
    const entryPath = `${path}.blackboard[${index}]`;
    const entry = requireRecord(rawEntry, entryPath);
    requireExactFields(entry, new Set(['key', 'value', 'valueStr']), entryPath);
    const key = requireNonEmptyString(entry.key, `${entryPath}.key`);
    const stringValue = requireString(entry.valueStr, `${entryPath}.valueStr`);
    if (stringValue) throw new Error(`${entryPath}.valueStr: expected empty string`);
    if (key in blackboard) throw new Error(`${path}.blackboard: duplicate key ${key}`);
    blackboard[key] = requireNumber(entry.value, `${entryPath}.value`);
  });
  return {
    skillId: requireString(payload.skillId, `${path}.skillId`),
    skillPath: requireString(payload.skillPath, `${path}.skillPath`),
    blackboard,
  };
}

function validateOtherPayloadShapes(entry: Record<string, unknown>, path: string): void {
  const buff = requireRecord(entry.attachBuff, `${path}.attachBuff`);
  requireExactFields(buff, new Set(['blackboard', 'buffId']), `${path}.attachBuff`);
  requireArray(buff.blackboard, `${path}.attachBuff.blackboard`);
  requireString(buff.buffId, `${path}.attachBuff.buffId`);

  const attr = requireRecord(entry.attrModifier, `${path}.attrModifier`);
  requireExactFields(
    attr,
    new Set(['attrType', 'attrValue', 'modifierType', 'modifyAttributeType']),
    `${path}.attrModifier`,
  );
  requireNonNegativeInteger(attr.attrType, `${path}.attrModifier.attrType`);
  requireNumber(attr.attrValue, `${path}.attrModifier.attrValue`);
  requireNonNegativeInteger(attr.modifierType, `${path}.attrModifier.modifierType`);
  requireNonNegativeInteger(attr.modifyAttributeType, `${path}.attrModifier.modifyAttributeType`);

  const skillBb = requireRecord(entry.skillBbModifier, `${path}.skillBbModifier`);
  requireExactFields(
    skillBb,
    new Set(['bbKey', 'floatValue', 'modifyType', 'skillId', 'stringValue']),
    `${path}.skillBbModifier`,
  );
  requireString(skillBb.bbKey, `${path}.skillBbModifier.bbKey`);
  requireNumber(skillBb.floatValue, `${path}.skillBbModifier.floatValue`);
  requireNonNegativeInteger(skillBb.modifyType, `${path}.skillBbModifier.modifyType`);
  requireString(skillBb.skillId, `${path}.skillBbModifier.skillId`);
  requireString(skillBb.stringValue, `${path}.skillBbModifier.stringValue`);

  const skillParam = requireRecord(entry.skillParamModifier, `${path}.skillParamModifier`);
  requireExactFields(
    skillParam,
    new Set(['modifyType', 'paramType', 'paramValue', 'skillId']),
    `${path}.skillParamModifier`,
  );
  requireNonNegativeInteger(skillParam.modifyType, `${path}.skillParamModifier.modifyType`);
  requireNonNegativeInteger(skillParam.paramType, `${path}.skillParamModifier.paramType`);
  requireNumber(skillParam.paramValue, `${path}.skillParamModifier.paramValue`);
  requireString(skillParam.skillId, `${path}.skillParamModifier.skillId`);
}

function parseDescription(value: unknown, path: string): void {
  const description = requireRecord(value, path);
  requireExactFields(description, new Set(['id', 'text']), path);
  requireNumber(description.id, `${path}.id`);
  requireString(description.text, `${path}.text`);
}

function isEmptySkillPayload(payload: SkillPayload): boolean {
  return !payload.skillId && !payload.skillPath && Object.keys(payload.blackboard).length === 0;
}
