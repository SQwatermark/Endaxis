import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNonEmptyString,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseTagQuerySource, type TagQuerySource } from './tagQuery.ts';
import {
  parseIntegerScalarSource,
  parseScalarSource,
  type IntegerScalarSource,
  type ScalarSource,
  type BlackboardLevelValues,
} from './scalar.ts';

export interface PriorityBuffFilterSource {
  readonly checkType: string;
  readonly buffIds: readonly string[];
  readonly tagQuery: TagQuerySource;
  readonly stackCountType: string;
}

/** PriorityFilter 的完整序列化载荷；来源层只保存事实，不声称每种排序已能执行。 */
export interface PriorityFilterSource {
  readonly filterType: string;
  readonly onlyReserveMaxPriorityTargets: boolean;
  readonly limitMaxNum: boolean;
  readonly maxNum: number;
  readonly buffFilter: PriorityBuffFilterSource;
}

export interface ShuffleTargetSource {
  readonly targetNumLimit: IntegerScalarSource;
}

export interface DistanceValidatorSource {
  readonly threshold: ScalarSource;
  readonly compareType: string;
  readonly clampToXZ: boolean;
}

/** 读取 Selector 嵌套类型名，例如 `...Selector+HitBoxFinder+Data`。 */
export function selectorComponentName(value: unknown, path: string): string {
  const item = requireRecord(value, path);
  const typeName = requireString(item.$type, `${path}.$type`);
  const parts = (typeName.split(',', 1)[0] ?? '').split('+');
  const componentName = parts.at(-2) ?? '';
  const dataTypeName = parts.at(-1) ?? '';
  if (
    parts.length < 3 ||
    !componentName ||
    (dataTypeName !== 'Data' && dataTypeName !== `${componentName}Data`)
  ) {
    throw new Error(`${path}.$type: unsupported selector type ${JSON.stringify(typeName)}`);
  }
  return componentName;
}

/**
 * 严格读取所有 PriorityFilter。排序枚举、数量限制和 Buff 筛选必须一起保存；
 * 只读取 maxNum 会让不同原生过滤器在公共 IR 中错误地“看起来一样”。
 */
export function parsePriorityFilterSources(value: unknown, path: string): PriorityFilterSource[] {
  return matchingComponents(value, path, 'PriorityFilter').map(
    ({ component: processor, path: filterPath }) => {
      requireExactFields(
        processor,
        new Set([
          '$type',
          'filterType',
          'onlyReserveMaxPriorityTargets',
          'limitMaxNum',
          'maxNum',
          'buffFilterSettings',
        ]),
        filterPath,
      );
      const rawBuffFilter = requireRecord(
        processor.buffFilterSettings,
        `${filterPath}.buffFilterSettings`,
      );
      requireExactFields(
        rawBuffFilter,
        new Set(['buffSettings', 'buffStackNumType']),
        `${filterPath}.buffFilterSettings`,
      );
      const rawBuffSettings = requireRecord(
        rawBuffFilter.buffSettings,
        `${filterPath}.buffFilterSettings.buffSettings`,
      );
      requireExactFields(
        rawBuffSettings,
        new Set(['checkType', 'buffIdList', 'tagQuery']),
        `${filterPath}.buffFilterSettings.buffSettings`,
      );
      return {
        filterType: requireNonEmptyString(processor.filterType, `${filterPath}.filterType`),
        onlyReserveMaxPriorityTargets: requireBoolean(
          processor.onlyReserveMaxPriorityTargets,
          `${filterPath}.onlyReserveMaxPriorityTargets`,
        ),
        limitMaxNum: requireBoolean(processor.limitMaxNum, `${filterPath}.limitMaxNum`),
        maxNum: requireInteger(processor.maxNum, `${filterPath}.maxNum`),
        buffFilter: {
          checkType: requireNonEmptyString(
            rawBuffSettings.checkType,
            `${filterPath}.buffFilterSettings.buffSettings.checkType`,
          ),
          buffIds: requireArray(
            rawBuffSettings.buffIdList,
            `${filterPath}.buffFilterSettings.buffSettings.buffIdList`,
          ).map((id, index) =>
            requireNonEmptyString(
              id,
              `${filterPath}.buffFilterSettings.buffSettings.buffIdList[${index}]`,
            ),
          ),
          tagQuery: parseTagQuerySource(
            rawBuffSettings.tagQuery,
            `${filterPath}.buffFilterSettings.buffSettings.tagQuery`,
          ),
          stackCountType: requireNonEmptyString(
            rawBuffFilter.buffStackNumType,
            `${filterPath}.buffFilterSettings.buffStackNumType`,
          ),
        },
      };
    },
  );
}

/** 严格读取 ShuffleTarget；随机算法属于执行层，这里只保存原生 BlackboardInt 限量值。 */
export function parseShuffleTargetSources(value: unknown, path: string): ShuffleTargetSource[] {
  return matchingComponents(value, path, 'ShuffleTarget').map(
    ({ component: processor, path: shufflePath }) => {
      requireExactFields(processor, new Set(['$type', 'targetNumLimit']), shufflePath);
      return {
        targetNumLimit: parseIntegerScalarSource(
          processor.targetNumLimit,
          `${shufflePath}.targetNumLimit`,
        ),
      };
    },
  );
}

/** 完整保存 DistanceValidator，零距离投影只能在 compiler 层依据比较式决定。 */
export function parseDistanceValidatorSources(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues = {},
): DistanceValidatorSource[] {
  const selector = requireRecord(value, path);
  return requireArray(selector.validatorData, `${path}.validatorData`).flatMap(
    (rawValidator, index) => {
      const validatorPath = `${path}.validatorData[${index}]`;
      const validator = requireRecord(rawValidator, validatorPath);
      if (selectorComponentName(validator, validatorPath) !== 'DistanceValidator') return [];
      requireExactFields(
        validator,
        new Set(['$type', 'value', 'compareType', 'clampToXZ']),
        validatorPath,
      );
      return [
        {
          threshold: parseScalarSource(
            validator.value,
            `${validatorPath}.value`,
            inheritedBlackboard,
          ),
          compareType: requireNonEmptyString(validator.compareType, `${validatorPath}.compareType`),
          clampToXZ: requireBoolean(validator.clampToXZ, `${validatorPath}.clampToXZ`),
        },
      ];
    },
  );
}

function matchingComponents(
  value: unknown,
  path: string,
  componentName: string,
): Array<{ readonly component: Record<string, unknown>; readonly path: string }> {
  const selector = requireRecord(value, path);
  return requireArray(selector.postProcessorData, `${path}.postProcessorData`).flatMap(
    (rawComponent, index) => {
      const componentPath = `${path}.postProcessorData[${index}]`;
      const component = requireRecord(rawComponent, componentPath);
      return selectorComponentName(component, componentPath) === componentName
        ? [{ component, path: componentPath }]
        : [];
    },
  );
}
