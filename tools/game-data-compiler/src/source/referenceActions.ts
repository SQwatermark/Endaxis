import {
  parseBlackboardAssignmentsSource,
  type BlackboardAssignmentSource,
} from './assignments.ts';
import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNativeEnum,
  requireNonEmptyString,
  requireRecord,
  requireString,
  requireStringOrInteger,
} from './primitives.ts';
import {
  parseScalarSource,
  parseStringScalarSource,
  type BlackboardLevelValues,
  type ScalarSource,
  type StringScalarSource,
} from './scalar.ts';
import {
  parseAdvancedDirectionSource,
  parseQuaternionSource,
  parseVector3Source,
  type AdvancedDirectionSource,
  type QuaternionSource,
  type Vector3Source,
} from './spatial.ts';
import {
  parseNativeActionTargetType,
  parseTargetReferenceSource,
  type TargetReferenceSource,
} from './target.ts';

const ABILITY_ENTITY_BORN_ROTATIONS = [
  'Default',
  'SelfToActionOwner',
  'SelfToActionSource',
  'SourceForward',
  'CameraForward',
  'SelfToContextTarget',
  'SourceForwardXYZ',
] as const;

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

export interface ProjectileSkillCallbackSource {
  readonly event: 'block' | 'finish' | 'hit' | 'reach';
  readonly enabled: boolean;
  /** 关闭的槽位也可能残留非空 ID；引用闭包不得因此跟随它。 */
  readonly skillId: string;
}

export interface ProjectilePresetPointSource {
  readonly key: string;
  readonly point: TargetReferenceSource;
}

export interface ProjectileLaunchActionSource {
  readonly kind: 'projectileLaunch';
  readonly projectileId: string;
  readonly projectileSkillId: string;
  readonly projectileSource: TargetReferenceSource;
  readonly syncTimeScale: boolean;
  readonly assignBlackboard: boolean;
  readonly assignEntityBlackboard: boolean;
  readonly assignments: readonly BlackboardAssignmentSource[];
  readonly emitPosition: TargetReferenceSource;
  readonly emitMountPoint: string | number;
  readonly useWeaponMountPoint: boolean;
  readonly weaponIndex: number;
  readonly weaponMountPoint: string | number;
  readonly overrideEmitBone: boolean;
  readonly emitPositionFixedOffset: Vector3Source;
  readonly emitPositionForwardMode: string | number;
  readonly emitPositionRandomOffset: Vector3Source;
  readonly target: TargetReferenceSource;
  readonly targetFilterMode: string | number;
  readonly targetFilter: TargetReferenceSource;
  readonly alsoLaunchToHittableTarget: boolean;
  readonly overrideHitBone: boolean;
  readonly hitMountPoint: string | number;
  readonly hitBoneFixedOffset: Vector3Source;
  readonly hitBoneForwardMode: string | number;
  readonly hitBoneRandomOffset: Vector3Source;
  readonly presetPoints: readonly ProjectilePresetPointSource[];
  readonly callbacks: readonly ProjectileSkillCallbackSource[];
}

export interface AbilityEntitySpawnActionSource {
  readonly kind: 'abilityEntitySpawn';
  readonly abilityEntityId: string;
  readonly setSource: boolean;
  readonly sourceType: string;
  readonly sourceContextKey: string;
  readonly setTarget: boolean;
  readonly allowMultipleInputTargets: boolean;
  /** 即使 setTarget=false，也保留序列化目标，不能伪装成字段不存在。 */
  readonly target: TargetReferenceSource;
  readonly bornAt: TargetReferenceSource;
  readonly bornMountPoint: string | number;
  readonly bornPositionOffset: Vector3Source;
  readonly checkNavmeshAreaName: boolean;
  readonly forbiddenAreaNames: readonly string[];
  readonly attachToClosestMeshPoint: boolean;
  readonly rotateYFromBoneToCurrentPosition: boolean;
  readonly bornRotation: string;
  readonly bornRotationContextTarget: string;
  readonly useAdvancedDirection: boolean;
  readonly advancedDirection: AdvancedDirectionSource;
  readonly clampToXZPlane: boolean;
  readonly applyBornRotationOffset: boolean;
  readonly bornRotationOffset: QuaternionSource;
  readonly assignEntityBlackboard: boolean;
  readonly assignments: readonly BlackboardAssignmentSource[];
  readonly assignBlackboard: boolean;
  readonly skillId: string;
  readonly overrideDuration: boolean;
  readonly duration: ScalarSource;
  readonly saveToContext: boolean;
  readonly contextKey: string;
  readonly pauseEffectOnEnd: boolean;
  readonly inheritSourceSkillCastId: boolean;
  readonly dieWhenSourceDies: boolean;
  readonly forceSyncInit: boolean;
  readonly dieOnEnd: boolean;
}

export interface AbilityEntityDurationMutationActionSource {
  readonly kind: 'abilityEntityDurationMutation';
  readonly setMultipleTargets: boolean;
  readonly target: TargetReferenceSource;
  readonly actionTargetType: string;
  readonly targetContextKey: string;
  readonly operation: string;
  readonly value: ScalarSource;
}

export interface AbilityEntityTargetMutationActionSource {
  readonly kind: 'abilityEntityTargetMutation';
  readonly target: TargetReferenceSource;
}

export function parseAbilityEntityTargetMutationActionSource(
  value: unknown,
  path: string,
): AbilityEntityTargetMutationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, new Set([...ACTION_META_FIELDS, 'targetSettings']), path);
  return {
    kind: 'abilityEntityTargetMutation',
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
  };
}

function parseAbilityEntityDurationTargetSource(
  value: unknown,
  path: string,
): TargetReferenceSource {
  const target = requireRecord(value, path);
  const compactFields = new Set([
    'advancedDirection',
    'centerToGround',
    'centerType',
    'enableAdvancedDirection',
    'selectorDirection',
    'selectorOwner',
    'target',
    'targetSource',
  ]);
  if (
    Object.keys(target).length === compactFields.size &&
    Object.keys(target).every(field => compactFields.has(field))
  ) {
    // setMultipleTarget=false 的 InputTarget 样本只序列化 TargetSettings 的固定外壳；补回
    // TargetReference 的空选择器默认值后仍交给同一个严格解析器校验全部实存字段。
    return parseTargetReferenceSource(
      {
        ...target,
        targetGroupKey: '',
        ownerContextKey: '',
        centerContextKey: '',
        selectorData: { validatorData: [], postProcessorData: [] },
        targetContextKey: '',
      },
      path,
    );
  }
  return parseTargetReferenceSource(target, path);
}

export function parseAbilityEntityDurationMutationActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): AbilityEntityDurationMutationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'setMultipleTarget',
      'targetSettings',
      'actionTargetType',
      'targetContextKey',
      'operation',
      'value',
    ]),
    path,
  );
  return {
    kind: 'abilityEntityDurationMutation',
    setMultipleTargets: requireBoolean(action.setMultipleTarget, `${path}.setMultipleTarget`),
    target: parseAbilityEntityDurationTargetSource(action.targetSettings, `${path}.targetSettings`),
    actionTargetType: parseNativeActionTargetType(
      action.actionTargetType,
      `${path}.actionTargetType`,
    ),
    targetContextKey: requireString(action.targetContextKey, `${path}.targetContextKey`),
    operation: requireNativeEnum(action.operation, ['Assign'] as const, `${path}.operation`),
    value: parseScalarSource(action.value, `${path}.value`, inheritedBlackboard),
  };
}

export interface SkillCastActionSource {
  readonly kind: 'skillCast';
  readonly caster: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly skillId: StringScalarSource;
  readonly skipApplyCost: boolean;
  readonly inheritSourceSkillCastId: boolean;
}

export function parseProjectileLaunchActionSource(
  value: unknown,
  path: string,
): ProjectileLaunchActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'projectileId',
      'projectileSkillId',
      'projectileSource',
      'syncTimeScale',
      'assignEntityBlackboard',
      'assignPairs',
      'assignBlackboard',
      'emitPos',
      'emitMountPoint',
      'useWeaponMp',
      'weaponIndex',
      'weaponMp',
      'overrideEmitBone',
      'emitPosFixedOffset',
      'emitPosOffsetForward',
      'emitPosRandomOffset',
      'targetSettings',
      ...('targetFilterMode' in action
        ? ['targetFilterMode', 'targetFilterSettings', 'alsoLaunchToHittableTarget']
        : []),
      'overrideHitBone',
      'hitMountPoint',
      'hitBoneFixedOffset',
      'hitBoneOffsetForward',
      'hitBoneRandomOffset',
      'presetPoints',
      'castSkillOnBlock',
      'skillIdOnBlock',
      'castSkillOnFinish',
      'skillIdOnFinish',
      'castSkillOnHit',
      'castSkillOnReach',
      'skillIdOnReach',
    ]),
    path,
  );
  const assignEntityBlackboard = requireBoolean(
    action.assignEntityBlackboard,
    `${path}.assignEntityBlackboard`,
  );
  const projectileSkillId = requireString(action.projectileSkillId, `${path}.projectileSkillId`);
  const callbackFields = [
    ['block', 'castSkillOnBlock', 'skillIdOnBlock'],
    ['finish', 'castSkillOnFinish', 'skillIdOnFinish'],
    ['hit', 'castSkillOnHit', 'projectileSkillId'],
    ['reach', 'castSkillOnReach', 'skillIdOnReach'],
  ] as const;
  const callbacks = callbackFields.map(([event, enabledField, skillField]) => {
    const enabled = requireBoolean(action[enabledField], `${path}.${enabledField}`);
    const skillId =
      skillField === 'projectileSkillId'
        ? projectileSkillId
        : requireString(action[skillField], `${path}.${skillField}`);
    return { event, enabled, skillId };
  });
  return {
    kind: 'projectileLaunch',
    projectileId: requireNonEmptyString(action.projectileId, `${path}.projectileId`),
    projectileSkillId,
    projectileSource: parseTargetReferenceSource(
      action.projectileSource,
      `${path}.projectileSource`,
    ),
    syncTimeScale: requireBoolean(action.syncTimeScale, `${path}.syncTimeScale`),
    assignBlackboard: requireBoolean(action.assignBlackboard, `${path}.assignBlackboard`),
    assignEntityBlackboard,
    assignments: parseBlackboardAssignmentsSource(action.assignPairs, `${path}.assignPairs`, {
      enabled: assignEntityBlackboard,
    }),
    emitPosition: parseTargetReferenceSource(action.emitPos, `${path}.emitPos`),
    emitMountPoint: requireStringOrInteger(action.emitMountPoint, `${path}.emitMountPoint`),
    useWeaponMountPoint: requireBoolean(action.useWeaponMp, `${path}.useWeaponMp`),
    weaponIndex: requireInteger(action.weaponIndex, `${path}.weaponIndex`),
    weaponMountPoint: requireStringOrInteger(action.weaponMp, `${path}.weaponMp`),
    overrideEmitBone: requireBoolean(action.overrideEmitBone, `${path}.overrideEmitBone`),
    emitPositionFixedOffset: parseVector3Source(
      action.emitPosFixedOffset,
      `${path}.emitPosFixedOffset`,
    ),
    emitPositionForwardMode: requireStringOrInteger(
      action.emitPosOffsetForward,
      `${path}.emitPosOffsetForward`,
    ),
    emitPositionRandomOffset: parseVector3Source(
      action.emitPosRandomOffset,
      `${path}.emitPosRandomOffset`,
    ),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    targetFilterMode:
      'targetFilterMode' in action
        ? requireStringOrInteger(action.targetFilterMode, `${path}.targetFilterMode`)
        : 0,
    targetFilter:
      'targetFilterSettings' in action
        ? parseTargetReferenceSource(action.targetFilterSettings, `${path}.targetFilterSettings`)
        : parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    alsoLaunchToHittableTarget:
      'alsoLaunchToHittableTarget' in action
        ? requireBoolean(action.alsoLaunchToHittableTarget, `${path}.alsoLaunchToHittableTarget`)
        : false,
    overrideHitBone: requireBoolean(action.overrideHitBone, `${path}.overrideHitBone`),
    hitMountPoint: requireStringOrInteger(action.hitMountPoint, `${path}.hitMountPoint`),
    hitBoneFixedOffset: parseVector3Source(action.hitBoneFixedOffset, `${path}.hitBoneFixedOffset`),
    hitBoneForwardMode: requireStringOrInteger(
      action.hitBoneOffsetForward,
      `${path}.hitBoneOffsetForward`,
    ),
    hitBoneRandomOffset: parseVector3Source(
      action.hitBoneRandomOffset,
      `${path}.hitBoneRandomOffset`,
    ),
    presetPoints: requireArray(action.presetPoints, `${path}.presetPoints`).map(
      (rawPreset, index) => parseProjectilePresetPoint(rawPreset, `${path}.presetPoints[${index}]`),
    ),
    callbacks,
  };
}

export function parseAbilityEntitySpawnActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): AbilityEntitySpawnActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'abilityEntityId',
      'setAbilityEntitySource',
      'abilityEntitySource',
      'abilityEntitySourceContextKey',
      'setAbilityEntityTarget',
      'abilityEntityTarget',
      ...('allowMultiInputTarget' in action ? ['allowMultiInputTarget'] : []),
      'bornAt',
      'bornMountPoint',
      'bornPosOffset',
      'checkNavmeshAreaName',
      'forbiddenAreaNames',
      'attachToClosestMeshPoint',
      'yRotateFromBoneToCurPos',
      'bornRotation',
      'bornRotationContextTarget',
      'useAdvancedDirectionSetting',
      'advancedDirectionSetting',
      'clampToXZPlane',
      'applyBornRotationOffset',
      'bornRotationOffset',
      'assignEntityBlackboard',
      'assignPairs',
      'assignBlackboard',
      'abilityEntitySkillId',
      'overrideDuration',
      'duration',
      'saveToContext',
      'contextKey',
      'pauseEffectOnEnd',
      'inheritSourceSkillCastId',
      'dieWhenSourceDie',
      'forceSyncInit',
      'dieOnEnd',
    ]),
    path,
  );
  const assignEntityBlackboard = requireBoolean(
    action.assignEntityBlackboard,
    `${path}.assignEntityBlackboard`,
  );
  return {
    kind: 'abilityEntitySpawn',
    abilityEntityId: requireNonEmptyString(action.abilityEntityId, `${path}.abilityEntityId`),
    setSource: requireBoolean(action.setAbilityEntitySource, `${path}.setAbilityEntitySource`),
    sourceType: parseNativeActionTargetType(
      action.abilityEntitySource,
      `${path}.abilityEntitySource`,
    ),
    sourceContextKey: requireString(
      action.abilityEntitySourceContextKey,
      `${path}.abilityEntitySourceContextKey`,
    ),
    setTarget: requireBoolean(action.setAbilityEntityTarget, `${path}.setAbilityEntityTarget`),
    allowMultipleInputTargets:
      'allowMultiInputTarget' in action
        ? requireBoolean(action.allowMultiInputTarget, `${path}.allowMultiInputTarget`)
        : false,
    target: parseTargetReferenceSource(action.abilityEntityTarget, `${path}.abilityEntityTarget`),
    bornAt: parseTargetReferenceSource(action.bornAt, `${path}.bornAt`),
    bornMountPoint: requireStringOrInteger(action.bornMountPoint, `${path}.bornMountPoint`),
    bornPositionOffset: parseVector3Source(action.bornPosOffset, `${path}.bornPosOffset`),
    checkNavmeshAreaName: requireBoolean(
      action.checkNavmeshAreaName,
      `${path}.checkNavmeshAreaName`,
    ),
    forbiddenAreaNames: requireArray(action.forbiddenAreaNames, `${path}.forbiddenAreaNames`).map(
      (item, index) => requireString(item, `${path}.forbiddenAreaNames[${index}]`),
    ),
    attachToClosestMeshPoint: requireBoolean(
      action.attachToClosestMeshPoint,
      `${path}.attachToClosestMeshPoint`,
    ),
    rotateYFromBoneToCurrentPosition: requireBoolean(
      action.yRotateFromBoneToCurPos,
      `${path}.yRotateFromBoneToCurPos`,
    ),
    bornRotation: requireNativeEnum(
      action.bornRotation,
      ABILITY_ENTITY_BORN_ROTATIONS,
      `${path}.bornRotation`,
    ),
    bornRotationContextTarget: requireString(
      action.bornRotationContextTarget,
      `${path}.bornRotationContextTarget`,
    ),
    useAdvancedDirection: requireBoolean(
      action.useAdvancedDirectionSetting,
      `${path}.useAdvancedDirectionSetting`,
    ),
    advancedDirection: parseAdvancedDirectionSource(
      action.advancedDirectionSetting,
      `${path}.advancedDirectionSetting`,
    ),
    clampToXZPlane: requireBoolean(action.clampToXZPlane, `${path}.clampToXZPlane`),
    applyBornRotationOffset: requireBoolean(
      action.applyBornRotationOffset,
      `${path}.applyBornRotationOffset`,
    ),
    bornRotationOffset: parseQuaternionSource(
      action.bornRotationOffset,
      `${path}.bornRotationOffset`,
    ),
    assignEntityBlackboard,
    assignments: parseBlackboardAssignmentsSource(action.assignPairs, `${path}.assignPairs`, {
      enabled: assignEntityBlackboard,
    }),
    assignBlackboard: requireBoolean(action.assignBlackboard, `${path}.assignBlackboard`),
    skillId: requireString(action.abilityEntitySkillId, `${path}.abilityEntitySkillId`),
    overrideDuration: requireBoolean(action.overrideDuration, `${path}.overrideDuration`),
    duration: parseScalarSource(action.duration, `${path}.duration`, inheritedBlackboard),
    saveToContext: requireBoolean(action.saveToContext, `${path}.saveToContext`),
    contextKey: requireString(action.contextKey, `${path}.contextKey`),
    pauseEffectOnEnd: requireBoolean(action.pauseEffectOnEnd, `${path}.pauseEffectOnEnd`),
    inheritSourceSkillCastId: requireBoolean(
      action.inheritSourceSkillCastId,
      `${path}.inheritSourceSkillCastId`,
    ),
    dieWhenSourceDies: requireBoolean(action.dieWhenSourceDie, `${path}.dieWhenSourceDie`),
    forceSyncInit: requireBoolean(action.forceSyncInit, `${path}.forceSyncInit`),
    dieOnEnd: requireBoolean(action.dieOnEnd, `${path}.dieOnEnd`),
  };
}

export function parseSkillCastActionSource(value: unknown, path: string): SkillCastActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'caster',
      'target',
      'skillId',
      'skipApplyCost',
      'inheritSourceSkillCastId',
      ...('interruptCurSkillOnlyWhenTargetCastable' in action
        ? ['interruptCurSkillOnlyWhenTargetCastable']
        : []),
    ]),
    path,
  );
  if ('interruptCurSkillOnlyWhenTargetCastable' in action)
    requireBoolean(
      action.interruptCurSkillOnlyWhenTargetCastable,
      `${path}.interruptCurSkillOnlyWhenTargetCastable`,
    );
  return {
    kind: 'skillCast',
    caster: parseTargetReferenceSource(action.caster, `${path}.caster`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    skillId: parseStringScalarSource(action.skillId, `${path}.skillId`),
    skipApplyCost: requireBoolean(action.skipApplyCost, `${path}.skipApplyCost`),
    inheritSourceSkillCastId: requireBoolean(
      action.inheritSourceSkillCastId,
      `${path}.inheritSourceSkillCastId`,
    ),
  };
}

function parseProjectilePresetPoint(value: unknown, path: string): ProjectilePresetPointSource {
  const preset = requireRecord(value, path);
  requireExactFields(preset, new Set(['presetPointKey', 'presetPoint']), path);
  return {
    key: requireNonEmptyString(preset.presetPointKey, `${path}.presetPointKey`),
    point: parseTargetReferenceSource(preset.presetPoint, `${path}.presetPoint`),
  };
}
