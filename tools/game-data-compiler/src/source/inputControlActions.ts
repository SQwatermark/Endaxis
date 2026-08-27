import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';

export interface ComboCacheActionSource {
  readonly kind: 'comboCache';
  readonly mappings: readonly {
    readonly commandType: string;
    readonly skillId: string;
    readonly cacheTime: ScalarSource;
  }[];
}

export interface AllowNextSkillActionSource {
  readonly kind: 'allowNextSkill';
  readonly skillIds: readonly string[];
}

export interface MarkCanInterruptActionSource {
  readonly kind: 'markCanInterrupt';
}

/** 时间轴直接指定现实施法时刻，不模拟客户端输入缓存；仍保留原生技能路由和窗口证据。 */
export function parseComboCacheActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): ComboCacheActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'mappingDataList',
    ]),
    path,
  );
  return {
    kind: 'comboCache',
    mappings: requireArray(action.mappingDataList, `${path}.mappingDataList`).map((raw, index) => {
      const rowPath = `${path}.mappingDataList[${index}]`;
      const row = requireRecord(raw, rowPath);
      requireExactFields(
        row,
        new Set([
          'cmdType',
          'skillId',
          'cacheEndByAction',
          'clearOffsetTargetSkillIdOnEnd',
          'overrideCacheTime',
          'cacheTime',
        ]),
        rowPath,
      );
      requireBoolean(row.cacheEndByAction, `${rowPath}.cacheEndByAction`);
      requireBoolean(row.clearOffsetTargetSkillIdOnEnd, `${rowPath}.clearOffsetTargetSkillIdOnEnd`);
      requireBoolean(row.overrideCacheTime, `${rowPath}.overrideCacheTime`);
      return {
        commandType: requireNonEmptyString(row.cmdType, `${rowPath}.cmdType`),
        skillId: requireNonEmptyString(row.skillId, `${rowPath}.skillId`),
        cacheTime: parseScalarSource(row.cacheTime, `${rowPath}.cacheTime`, inheritedBlackboard),
      };
    }),
  };
}

export function parseAllowNextSkillActionSource(
  value: unknown,
  path: string,
): AllowNextSkillActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'allowedSkillIdList',
    ]),
    path,
  );
  return {
    kind: 'allowNextSkill',
    skillIds: requireArray(action.allowedSkillIdList, `${path}.allowedSkillIdList`).map(
      (id, index) => requireNonEmptyString(id, `${path}.allowedSkillIdList[${index}]`),
    ),
  };
}

/** 标记当前原生技能可被后续输入中断；Endaxis 时间轴不执行客户端施法互斥门禁。 */
export function parseMarkCanInterruptActionSource(
  value: unknown,
  path: string,
): MarkCanInterruptActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set(['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex']),
    path,
  );
  return { kind: 'markCanInterrupt' };
}
