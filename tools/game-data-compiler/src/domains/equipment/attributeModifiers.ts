import {
  parseAttributeTypeValue,
  parseModifierTypeValue,
  parseModifyAttributeTypeValue,
  type AttributeModifierIdentitySource,
  type ResolvedAttributeModifierSource,
} from '../../source/attributeModifiers.ts';
import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonNegativeInteger,
  requireNumber,
  requireRecord,
  requireString,
} from '../../source/primitives.ts';

const EQUIPMENT_FIELDS = new Set([
  'displayAttrModifiers',
  'displayBaseAttrModifier',
  'domainId',
  'equipAttrModifiers',
  'itemId',
  'minWearLv',
  'partType',
  'suitID',
]);
const EQUIPMENT_MODIFIER_FIELDS = new Set([
  'attrIndex',
  'attrType',
  'attrValues',
  'modifierType',
  'modifyAttributeType',
]);
const DISPLAY_MODIFIER_FIELDS = new Set([
  'attrIndex',
  'attrType',
  'attrValue',
  'compositeAttr',
  'enhanceGuaranteeTimesRuleId',
  'enhancedAttrIndex',
  'enhancedAttrValues',
  'modifierType',
]);
const ITEM_FIELDS = new Set([
  'backpackCanDiscard',
  'decoDesc',
  'desc',
  'iconCompositeId',
  'iconId',
  'id',
  'maxBackpackStackCount',
  'maxStackCount',
  'modelKey',
  'name',
  'noObtainWayConditionId',
  'noObtainWayHint',
  'noObtainWayId',
  'notObtainShow',
  'notObtainShowTimeId',
  'obtainWayIds',
  'outcomeItemIds',
  'rarity',
  'showAllDepotCount',
  'showingType',
  'sortId1',
  'sortId2',
  'type',
  'valuableDepotRedDot',
  'valuableTabType',
]);

export interface EquipmentItemIdentitySource {
  readonly sourcePath: string;
  readonly itemId: string;
  readonly iconId: string;
  readonly iconCompositeId: string;
  readonly rarity: number;
  readonly itemType: number;
}

/**
 * EquipAttributeModifierData 的公共源 IR。
 * 名称身份供公共属性修正编译器消费，native* 字段保留 TableCfg 的原始数值证据。
 */
export interface EquipmentAttributeModifierSource extends AttributeModifierIdentitySource {
  readonly sourcePath: string;
  readonly attributeIndex: number;
  readonly attributeValues: readonly number[];
  readonly nativeModifyAttributeType: number;
  readonly nativeAttributeType: number;
  readonly nativeModifierType: number;
}

export interface EquipmentItemSource {
  readonly sourcePath: string;
  readonly equipmentId: string;
  readonly identity: EquipmentItemIdentitySource;
  readonly domainId: string;
  readonly suitId: string;
  readonly minimumWearLevel: number;
  readonly partType: number;
  readonly attributeModifiers: readonly EquipmentAttributeModifierSource[];
}

export interface ResolvedEquipmentAttributeModifierSource extends ResolvedAttributeModifierSource {
  readonly attributeIndex: number;
  readonly enhancementLevel: number;
}

/**
 * 联合读取 ItemTable 身份与 EquipTable 战斗事实。
 * 属性修正只来自 EquipTable；ItemTable 不被误当作战斗规则来源。
 */
export function parseEquipmentItemSources(
  equipTableValue: unknown,
  itemTableValue: unknown,
  equipmentIds: readonly string[],
  equipSourceName = 'EquipTable',
  itemSourceName = 'ItemTable',
): EquipmentItemSource[] {
  const equipTable = requireRecord(equipTableValue, equipSourceName);
  const itemTable = requireRecord(itemTableValue, itemSourceName);
  if (new Set(equipmentIds).size !== equipmentIds.length) {
    throw new Error('equipmentIds: duplicate equipment ID');
  }

  return equipmentIds.map(equipmentId => {
    const sourcePath = `${equipSourceName}.${equipmentId}`;
    const row = requireRecord(equipTable[equipmentId], sourcePath);
    requireExactFields(row, EQUIPMENT_FIELDS, sourcePath);
    const embeddedId = requireString(row.itemId, `${sourcePath}.itemId`);
    if (embeddedId !== equipmentId) {
      throw new Error(`${sourcePath}.itemId: expected ${JSON.stringify(equipmentId)}`);
    }

    parseDisplayModifier(
      row.displayBaseAttrModifier,
      `${sourcePath}.displayBaseAttrModifier`,
      true,
    );
    requireArray(row.displayAttrModifiers, `${sourcePath}.displayAttrModifiers`).forEach(
      (modifier, index) =>
        parseDisplayModifier(modifier, `${sourcePath}.displayAttrModifiers[${index}]`, false),
    );

    const modifiers = requireArray(row.equipAttrModifiers, `${sourcePath}.equipAttrModifiers`).map(
      (rawModifier, index) =>
        parseEquipmentAttributeModifier(rawModifier, `${sourcePath}.equipAttrModifiers[${index}]`),
    );
    if (modifiers.length === 0) {
      throw new Error(`${sourcePath}.equipAttrModifiers: expected at least one modifier`);
    }

    return {
      sourcePath,
      equipmentId,
      identity: parseItemIdentity(itemTable[equipmentId], equipmentId, itemSourceName),
      domainId: requireString(row.domainId, `${sourcePath}.domainId`),
      suitId: requireString(row.suitID, `${sourcePath}.suitID`),
      minimumWearLevel: requireNonNegativeInteger(row.minWearLv, `${sourcePath}.minWearLv`),
      partType: requireNonNegativeInteger(row.partType, `${sourcePath}.partType`),
      attributeModifiers: modifiers,
    };
  });
}

/**
 * 原生以 attrIndex 查询实例精锻档；缺少该索引时使用 0，越界不夹取也不回退。
 */
export function resolveEquipmentAttributeModifiers(
  equipment: EquipmentItemSource,
  enhancementLevels: ReadonlyMap<number, number>,
): ResolvedEquipmentAttributeModifierSource[] {
  return equipment.attributeModifiers.map(modifier => {
    const enhancementLevel = enhancementLevels.get(modifier.attributeIndex) ?? 0;
    if (!Number.isInteger(enhancementLevel) || enhancementLevel < 0) {
      throw new Error(
        `${modifier.sourcePath}: enhancement level for attrIndex ${modifier.attributeIndex} must be a non-negative integer`,
      );
    }
    const value = modifier.attributeValues[enhancementLevel];
    if (value === undefined) {
      throw new Error(
        `${modifier.sourcePath}.attrValues: no value for enhancement level ${enhancementLevel}`,
      );
    }
    return {
      sourcePath: modifier.sourcePath,
      attributeIndex: modifier.attributeIndex,
      enhancementLevel,
      modifyAttributeType: modifier.modifyAttributeType,
      attributeType: modifier.attributeType,
      formulaItem: modifier.formulaItem,
      value,
    };
  });
}

function parseEquipmentAttributeModifier(
  value: unknown,
  path: string,
): EquipmentAttributeModifierSource {
  const modifier = requireRecord(value, path);
  requireExactFields(modifier, EQUIPMENT_MODIFIER_FIELDS, path);
  const nativeModifyAttributeType = requireNonNegativeInteger(
    modifier.modifyAttributeType,
    `${path}.modifyAttributeType`,
  );
  const nativeAttributeType = requireNonNegativeInteger(modifier.attrType, `${path}.attrType`);
  const nativeModifierType = requireNonNegativeInteger(
    modifier.modifierType,
    `${path}.modifierType`,
  );
  const attributeValues = requireArray(modifier.attrValues, `${path}.attrValues`).map(
    (item, index) => requireNumber(item, `${path}.attrValues[${index}]`),
  );
  if (attributeValues.length === 0) {
    throw new Error(`${path}.attrValues: expected at least one value`);
  }
  return {
    sourcePath: path,
    attributeIndex: requireNonNegativeInteger(modifier.attrIndex, `${path}.attrIndex`),
    modifyAttributeType: parseModifyAttributeTypeValue(
      nativeModifyAttributeType,
      `${path}.modifyAttributeType`,
    ),
    attributeType: parseAttributeTypeValue(nativeAttributeType, `${path}.attrType`),
    formulaItem: parseModifierTypeValue(nativeModifierType, `${path}.modifierType`),
    attributeValues,
    nativeModifyAttributeType,
    nativeAttributeType,
    nativeModifierType,
  };
}

function parseItemIdentity(
  value: unknown,
  equipmentId: string,
  sourceName: string,
): EquipmentItemIdentitySource {
  const sourcePath = `${sourceName}.${equipmentId}`;
  const row = requireRecord(value, sourcePath);
  requireExactFields(row, ITEM_FIELDS, sourcePath);
  const itemId = requireString(row.id, `${sourcePath}.id`);
  if (itemId !== equipmentId) {
    throw new Error(`${sourcePath}.id: expected ${JSON.stringify(equipmentId)}`);
  }

  requireBoolean(row.backpackCanDiscard, `${sourcePath}.backpackCanDiscard`);
  requireRecord(row.decoDesc, `${sourcePath}.decoDesc`);
  requireRecord(row.desc, `${sourcePath}.desc`);
  requireNonNegativeInteger(row.maxBackpackStackCount, `${sourcePath}.maxBackpackStackCount`);
  requireNonNegativeInteger(row.maxStackCount, `${sourcePath}.maxStackCount`);
  requireString(row.modelKey, `${sourcePath}.modelKey`);
  requireRecord(row.name, `${sourcePath}.name`);
  validateStringArray(row.noObtainWayConditionId, `${sourcePath}.noObtainWayConditionId`);
  requireRecord(row.noObtainWayHint, `${sourcePath}.noObtainWayHint`);
  validateStringArray(row.noObtainWayId, `${sourcePath}.noObtainWayId`);
  requireBoolean(row.notObtainShow, `${sourcePath}.notObtainShow`);
  requireString(row.notObtainShowTimeId, `${sourcePath}.notObtainShowTimeId`);
  validateStringArray(row.obtainWayIds, `${sourcePath}.obtainWayIds`);
  validateStringArray(row.outcomeItemIds, `${sourcePath}.outcomeItemIds`);
  requireBoolean(row.showAllDepotCount, `${sourcePath}.showAllDepotCount`);
  requireNonNegativeInteger(row.showingType, `${sourcePath}.showingType`);
  requireNumber(row.sortId1, `${sourcePath}.sortId1`);
  requireNumber(row.sortId2, `${sourcePath}.sortId2`);
  requireBoolean(row.valuableDepotRedDot, `${sourcePath}.valuableDepotRedDot`);
  requireNonNegativeInteger(row.valuableTabType, `${sourcePath}.valuableTabType`);

  return {
    sourcePath,
    itemId,
    iconId: requireString(row.iconId, `${sourcePath}.iconId`),
    iconCompositeId: requireString(row.iconCompositeId, `${sourcePath}.iconCompositeId`),
    rarity: requireNonNegativeInteger(row.rarity, `${sourcePath}.rarity`),
    itemType: requireNonNegativeInteger(row.type, `${sourcePath}.type`),
  };
}

function parseDisplayModifier(value: unknown, path: string, allowEmpty: boolean): void {
  const modifier = requireRecord(value, path);
  if (allowEmpty && Object.keys(modifier).length === 0) return;
  requireExactFields(modifier, DISPLAY_MODIFIER_FIELDS, path);
  requireNonNegativeInteger(modifier.attrIndex, `${path}.attrIndex`);
  requireNonNegativeInteger(modifier.attrType, `${path}.attrType`);
  requireNumber(modifier.attrValue, `${path}.attrValue`);
  requireString(modifier.compositeAttr, `${path}.compositeAttr`);
  requireString(modifier.enhanceGuaranteeTimesRuleId, `${path}.enhanceGuaranteeTimesRuleId`);
  requireNonNegativeInteger(modifier.enhancedAttrIndex, `${path}.enhancedAttrIndex`);
  requireArray(modifier.enhancedAttrValues, `${path}.enhancedAttrValues`).forEach((item, index) =>
    requireNumber(item, `${path}.enhancedAttrValues[${index}]`),
  );
  requireNonNegativeInteger(modifier.modifierType, `${path}.modifierType`);
}

function validateStringArray(value: unknown, path: string): void {
  requireArray(value, path).forEach((item, index) => requireString(item, `${path}[${index}]`));
}
