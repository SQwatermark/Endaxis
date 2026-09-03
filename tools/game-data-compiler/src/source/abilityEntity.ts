import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireNumber,
  requireRecord,
} from './primitives.ts';
import {
  parseIntegerScalarSource,
  parseScalarSource,
  type IntegerScalarSource,
  type ScalarSource,
} from './scalar.ts';
export type { IntegerScalarSource } from './scalar.ts';
import { gameplayTagId } from './nativeGameplayTags.ts';

const ABILITY_ENTITY_TEMPLATE_FIELDS = new Set([
  'gameId',
  'factionNativeValue',
  'bornTagIds',
  'lifeTypeNativeValue',
  'durationSeconds',
  'durationBlackboard',
  'maxDurationForServerSeconds',
  'maxStackingCount',
  'maxStackingCountBlackboard',
  'delayToRecycleSeconds',
  'delayRecyclePerformSeconds',
  'sendDieEvent',
  'enableBornFadeIn',
  'fadeInSeconds',
  'componentCount',
  'managedReferenceCount',
  'rootRid',
]);

/**
 * VFS 从 AbilityEntityTemplateData 解出的严格逻辑前缀。
 * 组件数量和 RID 只证明当前资产身份及解码边界，不代表组件行为已经完成转换。
 */
export interface NativeAbilityEntityTemplateSource {
  readonly gameId: string;
  readonly factionNativeValue: number;
  readonly bornTagIds: readonly number[];
  readonly lifeTypeNativeValue: number;
  readonly durationSeconds: number;
  readonly durationBlackboard: ScalarSource;
  readonly maxDurationForServerSeconds: number;
  readonly maxStackingCount: number;
  readonly maxStackingCountBlackboard: IntegerScalarSource;
  readonly delayToRecycleSeconds: number;
  readonly delayRecyclePerformSeconds: number;
  readonly sendDieEvent: boolean;
  readonly enableBornFadeIn: boolean;
  readonly fadeInSeconds: number;
  readonly componentCount: number;
  readonly managedReferenceCount: number;
  readonly rootRid: number;
}
/** 旧模板证据容器还带资产索引和引用审计；在进入严格原生模板解析前剥离这些容器字段。 */
export function selectNativeAbilityEntityTemplateFields(value: unknown): Record<string, unknown> {
  const record = requireRecord(value, 'AbilityEntityTemplateEvidence');
  return Object.fromEntries(
    [...ABILITY_ENTITY_TEMPLATE_FIELDS].map(field => [field, record[field]]),
  );
}

export function parseNativeAbilityEntityTemplateSource(
  value: unknown,
  sourcePath: string,
): NativeAbilityEntityTemplateSource {
  const root = requireRecord(value, sourcePath);
  requireExactFields(root, ABILITY_ENTITY_TEMPLATE_FIELDS, sourcePath);
  return {
    gameId: requireNonEmptyString(root.gameId, `${sourcePath}.gameId`),
    factionNativeValue: requireInteger(root.factionNativeValue, `${sourcePath}.factionNativeValue`),
    bornTagIds: requireArray(root.bornTagIds, `${sourcePath}.bornTagIds`).map((tag, index) => {
      const tagPath = `${sourcePath}.bornTagIds[${index}]`;
      const rawTagId = requireInteger(tag, tagPath);
      try {
        return gameplayTagId(rawTagId);
      } catch {
        throw new Error(`${tagPath}: expected signed 32-bit GameplayTag ID`);
      }
    }),
    lifeTypeNativeValue: requireInteger(
      root.lifeTypeNativeValue,
      `${sourcePath}.lifeTypeNativeValue`,
    ),
    durationSeconds: requireNonNegativeNumber(
      root.durationSeconds,
      `${sourcePath}.durationSeconds`,
    ),
    durationBlackboard: parseScalarSource(
      root.durationBlackboard,
      `${sourcePath}.durationBlackboard`,
      {},
    ),
    maxDurationForServerSeconds: requireNonNegativeNumber(
      root.maxDurationForServerSeconds,
      `${sourcePath}.maxDurationForServerSeconds`,
    ),
    maxStackingCount: requireInteger(root.maxStackingCount, `${sourcePath}.maxStackingCount`),
    maxStackingCountBlackboard: parseIntegerScalarSource(
      root.maxStackingCountBlackboard,
      `${sourcePath}.maxStackingCountBlackboard`,
    ),
    delayToRecycleSeconds: requireNonNegativeNumber(
      root.delayToRecycleSeconds,
      `${sourcePath}.delayToRecycleSeconds`,
    ),
    delayRecyclePerformSeconds: requireNonNegativeNumber(
      root.delayRecyclePerformSeconds,
      `${sourcePath}.delayRecyclePerformSeconds`,
    ),
    sendDieEvent: requireBoolean(root.sendDieEvent, `${sourcePath}.sendDieEvent`),
    enableBornFadeIn: requireBoolean(root.enableBornFadeIn, `${sourcePath}.enableBornFadeIn`),
    fadeInSeconds: requireNonNegativeNumber(root.fadeInSeconds, `${sourcePath}.fadeInSeconds`),
    componentCount: requireNonNegativeInteger(root.componentCount, `${sourcePath}.componentCount`),
    managedReferenceCount: requireNonNegativeInteger(
      root.managedReferenceCount,
      `${sourcePath}.managedReferenceCount`,
    ),
    // Unity RID 超过 JS 安全整数范围；这里只保留 JSON 解码器给出的不透明数值，不参与身份计算。
    rootRid: requireNumber(root.rootRid, `${sourcePath}.rootRid`),
  };
}

function requireNonNegativeNumber(value: unknown, sourcePath: string): number {
  const result = requireNumber(value, sourcePath);
  if (!Number.isFinite(result) || result < 0) {
    throw new Error(`${sourcePath}: expected finite non-negative number`);
  }
  return result;
}
