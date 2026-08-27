import {
  parseBlackboardAssignmentsSource,
  type BlackboardAssignmentSource,
} from './assignments.ts';
import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

const META = ['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex'];

export interface GlobalBuffApplicationEntrySource {
  readonly globalBuffId: string;
  readonly assignBlackboard: boolean;
  readonly assignments: readonly BlackboardAssignmentSource[];
}

export type GlobalBuffActionSource =
  | {
      readonly kind: 'createGlobalBuff';
      readonly globalBuffs: readonly GlobalBuffApplicationEntrySource[];
      readonly count: ScalarSource;
      readonly source: TargetReferenceSource;
      readonly autoFinishByAction: boolean;
    }
  | {
      readonly kind: 'finishGlobalBuff';
      readonly finishParent: boolean;
      readonly globalBuffIds: readonly string[];
      readonly finishAll: boolean;
      readonly finishCount: ScalarSource;
      readonly isFinishedEarly: boolean;
    };

export function parseCreateGlobalBuffActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): GlobalBuffActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...META, 'globalBuffs', 'count', 'globalBuffSource', 'autoFinishByAction']),
    path,
  );
  return {
    kind: 'createGlobalBuff',
    globalBuffs: requireArray(action.globalBuffs, `${path}.globalBuffs`).map((value, index) => {
      const entryPath = `${path}.globalBuffs[${index}]`;
      const entry = requireRecord(value, entryPath);
      requireExactFields(
        entry,
        new Set(['globalBuffId', 'assignBlackboard', 'assignItems']),
        entryPath,
      );
      const id = requireRecord(entry.globalBuffId, `${entryPath}.globalBuffId`);
      requireExactFields(id, new Set(['id']), `${entryPath}.globalBuffId`);
      const assignBlackboard = requireBoolean(
        entry.assignBlackboard,
        `${entryPath}.assignBlackboard`,
      );
      return {
        globalBuffId: requireNonEmptyString(id.id, `${entryPath}.globalBuffId.id`),
        assignBlackboard,
        assignments: parseBlackboardAssignmentsSource(
          entry.assignItems,
          `${entryPath}.assignItems`,
          { enabled: assignBlackboard },
        ),
      };
    }),
    count: parseScalarSource(action.count, `${path}.count`, inheritedBlackboard),
    source: parseTargetReferenceSource(action.globalBuffSource, `${path}.globalBuffSource`),
    autoFinishByAction: requireBoolean(action.autoFinishByAction, `${path}.autoFinishByAction`),
  };
}

export function parseFinishGlobalBuffActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): GlobalBuffActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...META,
      'finishParent',
      'globalBuffIds',
      'finishAll',
      'finishCount',
      'isFinishedEarly',
    ]),
    path,
  );
  return {
    kind: 'finishGlobalBuff',
    finishParent: requireBoolean(action.finishParent, `${path}.finishParent`),
    globalBuffIds: requireArray(action.globalBuffIds, `${path}.globalBuffIds`).map((value, index) =>
      requireNonEmptyString(value, `${path}.globalBuffIds[${index}]`),
    ),
    finishAll: requireBoolean(action.finishAll, `${path}.finishAll`),
    finishCount: parseScalarSource(action.finishCount, `${path}.finishCount`, inheritedBlackboard),
    isFinishedEarly: requireBoolean(action.isFinishedEarly, `${path}.isFinishedEarly`),
  };
}
