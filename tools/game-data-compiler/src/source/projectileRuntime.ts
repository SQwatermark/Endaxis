import {
  requireArray,
  requireBoolean,
  requireInteger,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
} from './primitives.ts';

export interface ProjectileRuntimeSource {
  readonly projectileId: string;
  readonly decodeStatus: 'partial' | 'complete';
  readonly finishOnReach: boolean;
  readonly hitOnReach: boolean;
  readonly allowHitSameTarget: boolean;
  readonly maxHitCount: number;
  readonly collisionDetectTiming: number;
  readonly hitAndBlockDetectDelayTime: number;
  readonly hitAndBlockDetectDelayDistance: number;
  readonly keepMoveOnReach: boolean;
  readonly canTraceTargetAfterReach: boolean;
  readonly colliderShape: {
    readonly shapeType: number;
    readonly radius: number;
  } | null;
  readonly blockLayerDef: {
    readonly value: number;
    readonly name: string;
  } | null;
  readonly targetFilter: {
    readonly checkAlive: boolean;
    readonly autoSetTargetFaction: boolean;
    readonly factionTarget: number;
    readonly filterObjectType: boolean;
    readonly filterSlot: boolean;
    readonly filterGameplayTag: boolean;
  };
  readonly presetPointKeys: readonly string[];
  readonly useSegmentMove: boolean;
  readonly moveSegments: readonly {
    readonly startPointKey: string;
    readonly moveModeId: string;
    readonly endPointKey: string;
    readonly earlyNextByDuration: boolean;
    readonly segmentDuration: number;
    readonly skipHitAndBlockDetection: boolean;
  }[];
}

/** 读取 ProjectileComponentData partial 解码中已经命名、且足以审计首帧投影的字段。 */
export function parseProjectileRuntimeSource(
  value: unknown,
  path: string,
): ProjectileRuntimeSource {
  const root = requireRecord(value, path);
  if (root.$decoded !== true || root.layout !== 'Beyond.Gameplay.Core.ProjectileComponentData')
    throw new Error(`${path}: expected decoded ProjectileComponentData`);
  if (root.decodeStatus !== 'partial' && root.decodeStatus !== 'complete')
    throw new Error(`${path}.decodeStatus: expected decoded component`);
  const targetFilter = requireRecord(root.targetFilter, `${path}.targetFilter`);
  const colliderShape =
    root.colliderShapeData === undefined
      ? null
      : requireRecord(root.colliderShapeData, `${path}.colliderShapeData`);
  const shapeType =
    colliderShape === null
      ? null
      : requireRecord(colliderShape.shapeType, `${path}.colliderShapeData.shapeType`);
  const blockLayerDef =
    root.blockLayerDef === undefined
      ? null
      : requireRecord(root.blockLayerDef, `${path}.blockLayerDef`);
  const factionTarget = requireRecord(
    targetFilter.factionTarget,
    `${path}.targetFilter.factionTarget`,
  );
  const segments = requireArray(root.moveSegments, `${path}.moveSegments`).map((entry, index) => {
    const segmentPath = `${path}.moveSegments[${index}]`;
    const segment = requireRecord(entry, segmentPath);
    return {
      startPointKey: requireNonEmptyString(segment.startPointKey, `${segmentPath}.startPointKey`),
      moveModeId: requireNonEmptyString(segment.moveModeId, `${segmentPath}.moveModeId`),
      endPointKey: requireNonEmptyString(segment.endPointKey, `${segmentPath}.endPointKey`),
      earlyNextByDuration: requireBoolean(
        segment.earlyNextByDuration,
        `${segmentPath}.earlyNextByDuration`,
      ),
      segmentDuration: parseDirectBlackboardDouble(
        segment.segmentDuration,
        `${segmentPath}.segmentDuration`,
      ),
      skipHitAndBlockDetection: requireBoolean(
        segment.skipHitAndBlockDetection,
        `${segmentPath}.skipHitAndBlockDetection`,
      ),
    };
  });
  return {
    projectileId: requireNonEmptyString(root.id, `${path}.id`),
    decodeStatus: root.decodeStatus,
    finishOnReach: requireBoolean(root.finishOnReach, `${path}.finishOnReach`),
    hitOnReach: requireBoolean(root.hitOnReach, `${path}.hitOnReach`),
    allowHitSameTarget: requireBoolean(root.allowHitSameTarget, `${path}.allowHitSameTarget`),
    maxHitCount: requireInteger(
      requireRecord(root.maxHitCount, `${path}.maxHitCount`).valueIntCandidate,
      `${path}.maxHitCount.valueIntCandidate`,
    ),
    collisionDetectTiming: requireInteger(
      requireRecord(root.collisionDetectTiming, `${path}.collisionDetectTiming`).value,
      `${path}.collisionDetectTiming.value`,
    ),
    hitAndBlockDetectDelayTime: parseDirectBlackboardDouble(
      root.hitAndBlockDetectDelayTime,
      `${path}.hitAndBlockDetectDelayTime`,
    ),
    hitAndBlockDetectDelayDistance: parseDirectBlackboardDouble(
      root.hitAndBlockDetectDelayDistance,
      `${path}.hitAndBlockDetectDelayDistance`,
    ),
    keepMoveOnReach: requireBoolean(root.keepMoveOnReach, `${path}.keepMoveOnReach`),
    canTraceTargetAfterReach: requireBoolean(
      root.canTraceTargetAfterReach,
      `${path}.canTraceTargetAfterReach`,
    ),
    colliderShape:
      colliderShape === null || shapeType === null
        ? null
        : {
            shapeType: requireInteger(shapeType.value, `${path}.colliderShapeData.shapeType.value`),
            radius: parseDirectBlackboardDouble(
              colliderShape.radius,
              `${path}.colliderShapeData.radius`,
            ),
          },
    blockLayerDef:
      blockLayerDef === null
        ? null
        : {
            value: requireInteger(blockLayerDef.value, `${path}.blockLayerDef.value`),
            name: requireNonEmptyString(blockLayerDef.name, `${path}.blockLayerDef.name`),
          },
    targetFilter: {
      checkAlive: requireBoolean(targetFilter.checkAlive, `${path}.targetFilter.checkAlive`),
      autoSetTargetFaction: requireBoolean(
        targetFilter.autoSetTargetFaction,
        `${path}.targetFilter.autoSetTargetFaction`,
      ),
      factionTarget: requireInteger(
        factionTarget.value,
        `${path}.targetFilter.factionTarget.value`,
      ),
      filterObjectType: requireBoolean(
        targetFilter.filterObjectType,
        `${path}.targetFilter.filterObjectType`,
      ),
      filterSlot: requireBoolean(targetFilter.filterSlot, `${path}.targetFilter.filterSlot`),
      filterGameplayTag: requireBoolean(
        targetFilter.filterGameplayTag,
        `${path}.targetFilter.filterGameplayTag`,
      ),
    },
    presetPointKeys: requireArray(root.presetPointKeys, `${path}.presetPointKeys`).map(
      (entry, index) => requireNonEmptyString(entry, `${path}.presetPointKeys[${index}]`),
    ),
    useSegmentMove: requireBoolean(root.useSegmentMove, `${path}.useSegmentMove`),
    moveSegments: segments,
  };
}

function parseDirectBlackboardDouble(value: unknown, path: string): number {
  const wrapper = requireRecord(value, path);
  if (wrapper.useBlackboardKey !== false || wrapper.blackboardKey !== '')
    throw new Error(`${path}: blackboard-driven scalar is unsupported`);
  const result = requireNumber(wrapper.value, `${path}.value`);
  if (!Number.isFinite(result)) throw new Error(`${path}.value: expected finite number`);
  return result;
}
