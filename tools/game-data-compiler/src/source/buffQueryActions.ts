import { parseBuffFindSettings } from './condition.ts';
import {
  nativeActionName,
  requireBoolean,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import type { TagQueryType } from './tagQuery.ts';

/** SaveBuffStackNumAdvanced 的完整查询事实；运行投影只开放已证明的目标和计数类型。 */
export interface BuffStackReadActionSource {
  readonly kind: 'buffStackRead';
  readonly sourceType: 'SaveBuffStackNumAdvanced';
  readonly target: TargetReferenceSource;
  readonly checkType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: TagQueryType;
  readonly buffTagIds: readonly number[];
  readonly countType: string;
  readonly limitSkillCastId: boolean;
  readonly outputKey: string;
}

export function parseBuffStackReadActionSource(
  value: unknown,
  path: string,
): BuffStackReadActionSource {
  const action = requireRecord(value, path);
  const sourceType = nativeActionName(requireNonEmptyString(action.$type, `${path}.$type`));
  if (sourceType !== 'SaveBuffStackNumAdvanced') {
    throw new Error(`${path}.$type: expected SaveBuffStackNumAdvanced`);
  }
  const settings = parseBuffFindSettings(action.buffSettings, `${path}.buffSettings`);
  return {
    kind: 'buffStackRead',
    sourceType,
    target: parseTargetReferenceSource(action.checkTarget, `${path}.checkTarget`),
    checkType: settings.checkType,
    buffIds: settings.buffIds,
    tagQueryType: settings.tagQueryType,
    buffTagIds: settings.buffTagIds,
    countType: requireNonEmptyString(action.buffStackNumType, `${path}.buffStackNumType`),
    limitSkillCastId: requireBoolean(action.limitSkillCastId, `${path}.limitSkillCastId`),
    outputKey: requireNonEmptyString(action.key, `${path}.key`),
  };
}
