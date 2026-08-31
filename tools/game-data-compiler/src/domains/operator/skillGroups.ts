import {
  SKILL_TYPES,
  SKILL_LEVEL_SOURCES,
} from '../../../../../packages/game-data-contract/src/primitives.ts';
import type {
  SkillGroupDefinition,
  SkillGroupVariantDefinition,
} from '../../../../../packages/game-data-contract/src/skills.ts';
import {
  requireArray,
  requireExactFields,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireRecord,
  requireString,
} from '../../source/primitives.ts';

const NATIVE_FIELDS = new Set([
  'conditionDesc1',
  'conditionDesc2',
  'conditionDescInactive1',
  'conditionDescInactive2',
  'conditionIcon1',
  'conditionIcon2',
  'conditionId1',
  'conditionId2',
  'conditionName1',
  'conditionName2',
  'conditionPostDesc1',
  'conditionPostDesc2',
  'desc',
  'icon',
  'name',
  'skillGroupId',
  'skillGroupType',
  'skillIdList',
]);
const GROUP_REQUIRED_FIELDS = new Set([
  'key',
  'levelSource',
  'nativeGroupType',
  'skillKeys',
  'skillType',
]);
const VARIANT_FIELDS = new Set(['key', 'levelSource', 'nativeGroupType', 'skillKeys']);

export interface NativeOperatorSkillGroupSource {
  readonly sourcePath: string;
  readonly skillGroupId: string;
  /** 当前 metadata 未保存枚举成员名，因此保留原生整数身份。 */
  readonly nativeGroupType: number;
  readonly skillIds: readonly string[];
}

/** 正式技能分类与原生技能 ID 的绑定；原生 ID 不是编辑器 key。 */
export type OperatorSkillIdentitySource = Readonly<
  Pick<SkillGroupDefinition, 'key' | 'skillType'>
> & {
  readonly skillId: string;
};

/** 配置中的链接计划，装配前保留原生等级组和有序技能键，不提前内联技能定义。 */
export type OperatorSkillGroupVariantSource = Readonly<
  Pick<SkillGroupVariantDefinition, 'key' | 'levelSource'>
> & {
  readonly nativeGroupType: number;
  readonly skillKeys: readonly string[];
};

export type OperatorSkillGroupSource = Readonly<
  Pick<SkillGroupDefinition, 'key' | 'skillType' | 'levelSource'>
> & {
  readonly nativeGroupType: number;
  readonly skillKeys: readonly string[];
  readonly replacementPlacement?: 'sequence';
  readonly variants: readonly OperatorSkillGroupVariantSource[];
};

export interface OperatorSkillGroupValidationOptions {
  readonly routingOnlyNativeSkillIds?: readonly string[];
  readonly simulationEquivalentNativeSkillIds?: readonly string[];
  readonly basePassiveSkillIds?: readonly string[];
  readonly routedSkillKeys?: readonly string[];
  /** 需注册到技能系统、但不作为稳定时间轴入口的原生替换/内部技能。 */
  readonly runtimeReplacementSkillKeys?: readonly string[];
}

/** 按 combat-spec 的相同字段边界严格读取原生技能等级组。 */
export function parseNativeOperatorSkillGroupSources(
  tableValue: unknown,
  characterId: string,
  sourceName = 'CharGrowthTable',
): NativeOperatorSkillGroupSource[] {
  const table = requireRecord(tableValue, sourceName);
  const rowPath = `${sourceName}.${characterId}`;
  const row = requireRecord(table[characterId], rowPath);
  const mapPath = `${rowPath}.skillGroupMap`;
  return Object.entries(requireRecord(row.skillGroupMap, mapPath)).map(([id, raw]) => {
    const path = `${mapPath}.${id}`;
    const group = requireRecord(raw, path);
    requireExactFields(group, NATIVE_FIELDS, path);
    const embeddedId = requireNonEmptyString(group.skillGroupId, `${path}.skillGroupId`);
    if (embeddedId !== id) {
      throw new Error(`${path}: skillGroupId '${embeddedId}' does not match map key '${id}'`);
    }
    for (const field of [
      'conditionDesc1',
      'conditionDesc2',
      'conditionDescInactive1',
      'conditionDescInactive2',
      'conditionName1',
      'conditionName2',
      'conditionPostDesc1',
      'conditionPostDesc2',
      'desc',
      'name',
    ] as const)
      requireRecord(group[field], `${path}.${field}`);
    for (const field of [
      'conditionIcon1',
      'conditionIcon2',
      'conditionId1',
      'conditionId2',
      'icon',
    ] as const)
      requireString(group[field], `${path}.${field}`);
    const skillIds = distinctStrings(group.skillIdList, `${path}.skillIdList`);
    if (skillIds.length === 0) throw new Error(`${path}.skillIdList: expected entries`);
    return {
      sourcePath: path,
      skillGroupId: id,
      nativeGroupType: requireNonNegativeInteger(group.skillGroupType, `${path}.skillGroupType`),
      skillIds,
    };
  });
}

/** 读取 operators.json 中显式的编辑器技能库投影。 */
export function parseOperatorSkillGroupSources(
  value: unknown,
  path: string,
): OperatorSkillGroupSource[] {
  return requireArray(value, path).map((raw, index) => {
    const groupPath = `${path}[${index}]`;
    const group = requireRecord(raw, groupPath);
    const expectedFields = new Set(GROUP_REQUIRED_FIELDS);
    if (group.variants !== undefined) expectedFields.add('variants');
    if (group.replacementPlacement !== undefined) expectedFields.add('replacementPlacement');
    requireExactFields(group, expectedFields, groupPath);
    const variants =
      group.variants === undefined
        ? []
        : requireArray(group.variants, `${groupPath}.variants`).map((item, variantIndex) => {
            const variantPath = `${groupPath}.variants[${variantIndex}]`;
            const variant = requireRecord(item, variantPath);
            requireExactFields(variant, VARIANT_FIELDS, variantPath);
            return {
              key: requireNonEmptyString(variant.key, `${variantPath}.key`),
              levelSource: requireGroupIdentity(
                variant.levelSource,
                SKILL_LEVEL_SOURCES,
                `${variantPath}.levelSource`,
              ),
              nativeGroupType: requireNonNegativeInteger(
                variant.nativeGroupType,
                `${variantPath}.nativeGroupType`,
              ),
              skillKeys: distinctStrings(variant.skillKeys, `${variantPath}.skillKeys`),
            };
          });
    if (group.variants !== undefined && variants.length === 0) {
      throw new Error(`${groupPath}.variants: expected entries`);
    }
    const replacementPlacement =
      group.replacementPlacement === undefined
        ? undefined
        : requireGroupIdentity(
            group.replacementPlacement,
            ['sequence'] as const,
            `${groupPath}.replacementPlacement`,
          );
    return {
      key: requireNonEmptyString(group.key, `${groupPath}.key`),
      skillType: requireGroupIdentity(group.skillType, SKILL_TYPES, `${groupPath}.skillType`),
      levelSource: requireGroupIdentity(
        group.levelSource,
        SKILL_LEVEL_SOURCES,
        `${groupPath}.levelSource`,
      ),
      nativeGroupType: requireNonNegativeInteger(
        group.nativeGroupType,
        `${groupPath}.nativeGroupType`,
      ),
      skillKeys: distinctStrings(group.skillKeys, `${groupPath}.skillKeys`),
      ...(replacementPlacement === undefined ? {} : { replacementPlacement }),
      variants,
    };
  });
}

/**
 * 原生组只证明养成等级来源；编辑器释放链和强化形态位置由显式配置决定。
 * 校验时仍要求两侧技能 ID 集合与原生顺序完全闭合。
 */
export function validateOperatorSkillGroups(
  groups: readonly OperatorSkillGroupSource[],
  skills: readonly OperatorSkillIdentitySource[],
  nativeGroups: readonly NativeOperatorSkillGroupSource[],
  options: OperatorSkillGroupValidationOptions = {},
): void {
  const skillByKey = uniqueMap(skills, item => item.key, 'skills');
  uniqueMap(groups, item => item.key, 'skillGroups');
  const expected = new Map<number, string[]>();
  const assigned: string[] = [];
  for (const group of groups) {
    appendSkills(group.skillKeys, group.skillType, group.nativeGroupType, group.key);
    uniqueMap(group.variants, item => item.key, `skillGroups.${group.key}.variants`);
    for (const variant of group.variants) {
      appendSkills(
        variant.skillKeys,
        group.skillType,
        variant.nativeGroupType,
        `${group.key}.${variant.key}`,
      );
    }
  }
  if (new Set(assigned).size !== assigned.length) {
    throw new Error('skillGroups: a skill is assigned more than once');
  }
  const missing = [...skillByKey.keys()].filter(key => !assigned.includes(key)).sort();
  if (missing.length) throw new Error(`skillGroups: unassigned skills ${JSON.stringify(missing)}`);

  const actual = new Map<number, string[]>();
  for (const group of nativeGroups) {
    if (actual.has(group.nativeGroupType)) {
      throw new Error(`skillGroupMap: duplicate group type ${group.nativeGroupType}`);
    }
    actual.set(group.nativeGroupType, [...group.skillIds]);
  }
  const actualIds = new Set([...actual.values()].flat());
  const routingOnly = optionIds(options.routingOnlyNativeSkillIds, 'routingOnlyNativeSkillIds');
  const equivalent = optionIds(
    options.simulationEquivalentNativeSkillIds,
    'simulationEquivalentNativeSkillIds',
  );
  const passive = optionIds(options.basePassiveSkillIds, 'basePassiveSkillIds');
  const routedKeys = optionIds(options.routedSkillKeys, 'routedSkillKeys');
  const runtimeReplacementKeys = optionIds(
    options.runtimeReplacementSkillKeys,
    'runtimeReplacementSkillKeys',
  );
  requireKnown(routingOnly, actualIds, 'routingOnlyNativeSkillIds');
  requireKnown(equivalent, actualIds, 'simulationEquivalentNativeSkillIds');
  // 基础被动来自独立 Passive SkillData；它可能同时列在 skillGroupMap，也可能完全不在
  // 可操作技能组中。其文件身份与 castType 由被动编译入口校验，本层只负责在出现时排除。
  requireKnown(routedKeys, new Set(skillByKey.keys()), 'routedSkillKeys');
  requireKnown(runtimeReplacementKeys, new Set(skillByKey.keys()), 'runtimeReplacementSkillKeys');
  const generatedIds = new Set(skills.map(skill => skill.skillId));
  const runtimeReplacementIds = new Set(
    runtimeReplacementKeys.map(key => skillByKey.get(key)!.skillId),
  );
  const missingNativeSkillIds = [...generatedIds]
    .filter(id => !actualIds.has(id) && !runtimeReplacementIds.has(id))
    .sort();
  if (missingNativeSkillIds.length > 0) {
    throw new Error(
      `skillGroupMap does not match generated skill sources: missing native skills ${JSON.stringify(missingNativeSkillIds)}`,
    );
  }
  requireDisjoint(generatedIds, equivalent, 'simulationEquivalentNativeSkillIds');
  requireDisjoint(generatedIds, passive, 'basePassiveSkillIds');
  const routedIds = new Set(routedKeys.map(key => skillByKey.get(key)!.skillId));
  const omitted = new Set([...routingOnly, ...equivalent, ...passive]);
  const normalizedActual = new Map(
    [...actual].map(([type, ids]) => [type, ids.filter(id => !omitted.has(id))]),
  );
  const normalizedExpected = new Map<number, string[]>();
  for (const [type, ids] of expected) {
    const expectedSet = new Set(
      ids.filter(id => !routedIds.has(id) && (actualIds.has(id) || !runtimeReplacementIds.has(id))),
    );
    normalizedExpected.set(
      type,
      (normalizedActual.get(type) ?? []).filter(id => expectedSet.has(id)),
    );
  }
  if (!sameMaps(normalizedExpected, normalizedActual)) {
    throw new Error(
      `skillGroupMap does not match generated skill sources: expected ${JSON.stringify(Object.fromEntries(normalizedExpected))}, got ${JSON.stringify(Object.fromEntries(normalizedActual))}`,
    );
  }

  function appendSkills(
    keys: readonly string[],
    type: string,
    nativeType: number,
    path: string,
  ): void {
    if (!keys.length) throw new Error(`skillGroups.${path}: expected skills`);
    for (const key of keys) {
      const skill = skillByKey.get(key);
      if (!skill) throw new Error(`skillGroups.${path}: unknown skill key '${key}'`);
      if (skill.skillType !== type) {
        throw new Error(`skillGroups.${path}: skill type does not match '${key}'`);
      }
      const ids = expected.get(nativeType) ?? [];
      ids.push(skill.skillId);
      expected.set(nativeType, ids);
      assigned.push(key);
    }
  }
}

/** 配置中的正式身份在读取边界校验；不为未知字符串伪造类型，也不解释原生组整数。 */
function requireGroupIdentity<T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
): T {
  const name = requireNonEmptyString(value, path);
  const result = allowed.find(item => item === name);
  if (result === undefined)
    throw new Error(`${path}: unsupported identity ${JSON.stringify(name)}`);
  return result;
}

function distinctStrings(value: unknown, path: string): string[] {
  const result = requireArray(value, path).map((item, index) =>
    requireNonEmptyString(item, `${path}[${index}]`),
  );
  if (new Set(result).size !== result.length) {
    throw new Error(`${path}: expected distinct values`);
  }
  return result;
}

function uniqueMap<T>(
  values: readonly T[],
  keyOf: (value: T) => string,
  path: string,
): Map<string, T> {
  const result = new Map<string, T>();
  for (const value of values) {
    const key = keyOf(value);
    if (result.has(key)) throw new Error(`${path}: duplicate key '${key}'`);
    result.set(key, value);
  }
  return result;
}

function optionIds(values: readonly string[] | undefined, path: string): string[] {
  if (!values) return [];
  if (values.some(value => !value) || new Set(values).size !== values.length) {
    throw new Error(`${path}: expected distinct non-empty IDs`);
  }
  return [...values];
}

function requireKnown(values: readonly string[], known: ReadonlySet<string>, path: string): void {
  const unknown = values.filter(value => !known.has(value)).sort();
  if (unknown.length) throw new Error(`${path}: unknown IDs ${JSON.stringify(unknown)}`);
}

function requireDisjoint(left: ReadonlySet<string>, right: readonly string[], path: string): void {
  const overlap = right.filter(value => left.has(value)).sort();
  if (overlap.length) {
    throw new Error(`${path}: generated skills cannot be omitted ${JSON.stringify(overlap)}`);
  }
}

function sameMaps(
  expected: ReadonlyMap<number, readonly string[]>,
  actual: ReadonlyMap<number, readonly string[]>,
): boolean {
  if (expected.size !== actual.size) return false;
  return [...expected].every(([type, ids]) => {
    const other = actual.get(type);
    return (
      other !== undefined &&
      ids.length === other.length &&
      ids.every((id, index) => id === other[index])
    );
  });
}
