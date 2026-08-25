import {
  parseBlackboardAssignmentsSource,
  type BlackboardAssignmentSource,
} from './assignments.ts';
import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseTagQuerySource } from './tagQuery.ts';
import { parseTargetReferenceSource } from './target.ts';

export interface GlobalPartyAuraBuffInputSource {
  readonly buffId: string;
  readonly assignBlackboard: boolean;
  readonly assignments: readonly BlackboardAssignmentSource[];
}

/** combat-spec 已取证的 GlobalAura + 存活友方 Character 窄分支。 */
export interface GlobalPartyAuraActionSource {
  readonly kind: 'globalPartyAura';
  readonly debugName: string;
  readonly target: 'party' | 'enemy';
  readonly buffSource: 'ActionOwner' | 'ActionSource';
  readonly inheritSourceSkillCastInfo: boolean;
  readonly buffs: readonly GlobalPartyAuraBuffInputSource[];
}

const ACTION_FIELDS = new Set([
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
  'auraDebugName',
  'm_auraTypeWarning',
  'auraType',
  'auraRoot',
  'fixedWhenStart',
  'shapeData',
  'excludeColliderOptions',
  'targetObjectType',
  'targetFilter',
  'excludeOwner',
  'includeUnmarkable',
  'limitInfluenceCountPerTarget',
  'maxInfluenceCountPerTarget',
  'buffSource',
  'buffInput',
  'overrideBuffIconDuration',
  'buffIconDurationSource',
  'inheritSourceSkillCastId',
  'actionInAura',
  'actionWhenExitAura',
]);

export function parseGlobalPartyAuraActionSource(
  value: unknown,
  path: string,
): GlobalPartyAuraActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, ACTION_FIELDS, path);
  requireExpected(action.auraType, 'GlobalAura', `${path}.auraType`);
  const root = parseTargetReferenceSource(action.auraRoot, `${path}.auraRoot`);
  if (root.targetSource !== 'Owner' || root.targetGroupKey !== '') {
    throw new Error(`${path}.auraRoot: expected plain Owner`);
  }
  requireExpected(action.fixedWhenStart, false, `${path}.fixedWhenStart`);
  const targetObjectType = requireNonEmptyString(
    action.targetObjectType,
    `${path}.targetObjectType`,
  );
  const target =
    targetObjectType === 'Character' ? 'party' : targetObjectType === 'EnemyAll' ? 'enemy' : null;
  if (target === null)
    throw new Error(
      `${path}.targetObjectType: unsupported value ${JSON.stringify(targetObjectType)}`,
    );
  parseGlobalShape(action.shapeData, `${path}.shapeData`, target);
  requireExpected(action.excludeColliderOptions, 0, `${path}.excludeColliderOptions`);
  parseGlobalFilter(
    action.targetFilter,
    `${path}.targetFilter`,
    target === 'party' ? 'Ally' : 'Anti',
  );
  requireExpected(action.excludeOwner, false, `${path}.excludeOwner`);
  requireExpected(action.includeUnmarkable, false, `${path}.includeUnmarkable`);
  requireExpected(
    action.limitInfluenceCountPerTarget,
    false,
    `${path}.limitInfluenceCountPerTarget`,
  );
  requireExpected(action.maxInfluenceCountPerTarget, 1, `${path}.maxInfluenceCountPerTarget`);
  const buffSource = requireNonEmptyString(action.buffSource, `${path}.buffSource`);
  if (buffSource !== 'ActionOwner' && buffSource !== 'ActionSource') {
    throw new Error(`${path}.buffSource: unsupported value ${JSON.stringify(buffSource)}`);
  }
  requireExpected(action.overrideBuffIconDuration, false, `${path}.overrideBuffIconDuration`);
  parseIconDurationSource(action.buffIconDurationSource, `${path}.buffIconDurationSource`);
  const inheritSourceSkillCastInfo = requireBoolean(
    action.inheritSourceSkillCastId,
    `${path}.inheritSourceSkillCastId`,
  );
  parseEmptySequence(action.actionInAura, `${path}.actionInAura`);
  parseEmptySequence(action.actionWhenExitAura, `${path}.actionWhenExitAura`);

  const buffs = requireArray(action.buffInput, `${path}.buffInput`).map((raw, index) => {
    const inputPath = `${path}.buffInput[${index}]`;
    const input = requireRecord(raw, inputPath);
    requireExactFields(input, new Set(['buffId', 'assignBlackboard', 'assignItems']), inputPath);
    const assignBlackboard = requireBoolean(
      input.assignBlackboard,
      `${inputPath}.assignBlackboard`,
    );
    const assignments = parseBlackboardAssignmentsSource(
      input.assignItems,
      `${inputPath}.assignItems`,
      {
        enabled: assignBlackboard,
      },
    );
    if (!assignBlackboard && assignments.length > 0) {
      throw new Error(`${inputPath}.assignItems: expected empty array when assignment is disabled`);
    }
    return {
      buffId: requireNonEmptyString(input.buffId, `${inputPath}.buffId`),
      assignBlackboard,
      assignments,
    };
  });
  if (buffs.length === 0) throw new Error(`${path}.buffInput: expected at least one Buff`);
  return {
    kind: 'globalPartyAura',
    debugName: requireNonEmptyString(action.auraDebugName, `${path}.auraDebugName`),
    target,
    buffSource,
    inheritSourceSkillCastInfo,
    buffs,
  };
}

function parseGlobalFilter(value: unknown, path: string, expectedFaction: string): void {
  const filter = requireRecord(value, path);
  requireExactFields(
    filter,
    new Set([
      'checkAlive',
      'autoSetTargetFaction',
      'factionTarget',
      'targetFactionType',
      'filterObjectType',
      'objectType',
      'filterSlot',
      'slotIndex',
      'filterGameplayTag',
      'tagQuery',
    ]),
    path,
  );
  requireExpected(filter.checkAlive, true, `${path}.checkAlive`);
  requireExpected(filter.autoSetTargetFaction, true, `${path}.autoSetTargetFaction`);
  requireExpected(filter.factionTarget, expectedFaction, `${path}.factionTarget`);
  requireExpected(filter.targetFactionType, 0, `${path}.targetFactionType`);
  requireExpected(filter.filterObjectType, false, `${path}.filterObjectType`);
  requireExpected(filter.objectType, 'All', `${path}.objectType`);
  requireExpected(filter.filterSlot, false, `${path}.filterSlot`);
  requireExpected(filter.slotIndex, 0, `${path}.slotIndex`);
  requireExpected(filter.filterGameplayTag, false, `${path}.filterGameplayTag`);
  const query = parseTagQuerySource(filter.tagQuery, `${path}.tagQuery`);
  if (query.tagIds.length > 0) throw new Error(`${path}.tagQuery: expected an empty query`);
}

function parseGlobalShape(value: unknown, path: string, target: 'party' | 'enemy'): void {
  const shape = requireRecord(value, path);
  requireExactFields(
    shape,
    new Set([
      '_shape',
      '_rotationOffset',
      '_useExtentKey',
      '_extent',
      '_extentXKey',
      '_extentYKey',
      '_extentZKey',
      '_useCenterKey',
      '_center',
      '_centerXKey',
      '_centerYKey',
      '_centerZKey',
      '_heightKey',
      '_height',
      '_radiusKey',
      '_radius',
    ]),
    path,
  );
  requireExpected(shape._shape, target === 'party' ? 'Box' : 'Sphere', `${path}._shape`);
  parseZeroVector(shape._rotationOffset, `${path}._rotationOffset`);
  requireExpected(shape._useExtentKey, false, `${path}._useExtentKey`);
  parseZeroVector(shape._extent, `${path}._extent`);
  for (const key of ['_extentXKey', '_extentYKey', '_extentZKey'])
    requireExpected(shape[key], '', `${path}.${key}`);
  requireExpected(shape._useCenterKey, false, `${path}._useCenterKey`);
  parseZeroVector(shape._center, `${path}._center`);
  for (const key of ['_centerXKey', '_centerYKey', '_centerZKey', '_heightKey', '_radiusKey'])
    requireExpected(shape[key], '', `${path}.${key}`);
  requireExpected(shape._height, 0, `${path}._height`);
  requireExpected(shape._radius, target === 'party' ? 0 : 40, `${path}._radius`);
}

function parseZeroVector(value: unknown, path: string): void {
  const vector = requireRecord(value, path);
  requireExactFields(vector, new Set(['x', 'y', 'z']), path);
  for (const key of ['x', 'y', 'z']) requireExpected(vector[key], 0, `${path}.${key}`);
}

function parseIconDurationSource(value: unknown, path: string): void {
  const source = requireRecord(value, path);
  requireExactFields(
    source,
    new Set([
      'm_abilityEntityTypeInfo',
      'm_timedMarkerInfo',
      'durationSourceType',
      'timedMarkerId',
    ]),
    path,
  );
  requireString(source.m_abilityEntityTypeInfo, `${path}.m_abilityEntityTypeInfo`);
  requireString(source.m_timedMarkerInfo, `${path}.m_timedMarkerInfo`);
  requireExpected(source.durationSourceType, 'AbilityEntity', `${path}.durationSourceType`);
  requireExpected(source.timedMarkerId, '', `${path}.timedMarkerId`);
}

function parseEmptySequence(value: unknown, path: string): void {
  const sequence = requireRecord(value, path);
  requireExactFields(
    sequence,
    new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
    path,
  );
  if (requireArray(sequence.actionData, `${path}.actionData`).length > 0)
    throw new Error(`${path}.actionData: expected empty array`);
  requireExpected(
    sequence.onlyExecuteWhenSourceIsMainChar,
    false,
    `${path}.onlyExecuteWhenSourceIsMainChar`,
  );
  requireExpected(
    sequence.onlyExecuteWhenSourceIsGuard,
    false,
    `${path}.onlyExecuteWhenSourceIsGuard`,
  );
}

function requireExpected(value: unknown, expected: string | number | boolean, path: string): void {
  const actual =
    typeof expected === 'string'
      ? requireString(value, path)
      : typeof expected === 'boolean'
        ? requireBoolean(value, path)
        : Number.isInteger(expected)
          ? requireInteger(value, path)
          : requireNumber(value, path);
  if (actual !== expected) throw new Error(`${path}: expected ${JSON.stringify(expected)}`);
}
