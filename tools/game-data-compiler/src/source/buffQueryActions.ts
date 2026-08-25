import { parseBuffFindSettings } from './condition.ts';
import { parseBuffFindSettingsSource } from './buffActions.ts';
import {
  nativeActionName,
  requireExactFields,
  requireBoolean,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import type { TagQueryType } from './tagQuery.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';

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

export interface BuffBlackboardReadActionSource {
  readonly kind: 'buffBlackboardRead';
  readonly target: TargetReferenceSource;
  readonly settings: ReturnType<typeof parseBuffFindSettingsSource>;
  readonly desiredKey: string;
  readonly outputKey: string;
}

/** SaveBuffLifeTime 的已恢复 Environment 查询；结果是当前有限时长 Buff 的剩余秒数。 */
export interface BuffLifeTimeReadActionSource {
  readonly kind: 'buffLifeTimeRead';
  readonly owner: TargetReferenceSource;
  readonly settings: ReturnType<typeof parseBuffFindSettingsSource>;
  readonly outputKey: string;
}

export interface BuffDurationMutationActionSource {
  readonly kind: 'buffDurationMutation';
  readonly target: TargetReferenceSource;
  readonly settings: ReturnType<typeof parseBuffFindSettingsSource>;
  readonly operation: string;
  readonly value: ScalarSource;
  readonly isFinishedEarly: boolean;
}

export function parseBuffDurationMutationActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BuffDurationMutationActionSource {
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
      'buffSettings',
      'operationType',
      'value',
      'isFinishedEarly',
    ]),
    path,
  );
  return {
    kind: 'buffDurationMutation',
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    settings: parseBuffFindSettingsSource(action.buffSettings, `${path}.buffSettings`),
    operation: requireNonEmptyString(action.operationType, `${path}.operationType`),
    value: parseScalarSource(action.value, `${path}.value`, inheritedBlackboard),
    isFinishedEarly: requireBoolean(action.isFinishedEarly, `${path}.isFinishedEarly`),
  };
}

export function parseBuffLifeTimeReadActionSource(
  value: unknown,
  path: string,
): BuffLifeTimeReadActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'buffOwner',
      'buffSettings',
      'key',
    ]),
    path,
  );
  return {
    kind: 'buffLifeTimeRead',
    owner: parseTargetReferenceSource(action.buffOwner, `${path}.buffOwner`),
    settings: parseBuffFindSettingsSource(action.buffSettings, `${path}.buffSettings`),
    outputKey: requireNonEmptyString(action.key, `${path}.key`),
  };
}

export function parseBuffBlackboardReadActionSource(
  value: unknown,
  path: string,
): BuffBlackboardReadActionSource {
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
      'buffSettings',
      'desiredKey',
      'blackboardKey',
    ]),
    path,
  );
  return {
    kind: 'buffBlackboardRead',
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    settings: parseBuffFindSettingsSource(action.buffSettings, `${path}.buffSettings`),
    desiredKey: requireNonEmptyString(action.desiredKey, `${path}.desiredKey`),
    outputKey: requireNonEmptyString(action.blackboardKey, `${path}.blackboardKey`),
  };
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
