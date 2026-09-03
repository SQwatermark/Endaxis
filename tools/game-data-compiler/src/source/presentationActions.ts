import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNativeEnum,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
  requireString,
  requireStringOrInteger,
  nativeActionName,
} from './primitives.ts';

const CAMERA_BLEND_STYLES = [
  'Cut',
  'EaseInOut',
  'EaseIn',
  'EaseOut',
  'HardIn',
  'HardOut',
  'Linear',
  'Custom',
] as const;
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import {
  parseIntegerScalarSource,
  parseScalarSource,
  type BlackboardLevelValues,
  type ScalarSource,
} from './scalar.ts';
import { parseTagQuerySource } from './tagQuery.ts';
import { parseTimeDilationCurveKeys } from './timeDilationActions.ts';
import { parseNativeSkillType } from './operatorRuntimeTemplate.ts';
import {
  parseBuffApplicationActionSource,
  parseAdvancedBuffFinishActionSource,
  type BuffApplicationActionSource,
} from './buffActions.ts';
import { parseConditionLeafSource, type NativeConditionSource } from './condition.ts';
import { parseTargetGroupActionSource } from './targetGroup.ts';
import { parseFinishOwnerActionSource } from './lifecycleActions.ts';

export interface PlaySoundActionSource {
  readonly kind: 'playSound';
  readonly soundEvent: string;
  readonly stopOnEnd: boolean;
  readonly stopFadeDurationMilliseconds: number;
  readonly canInterruptTimeMilliseconds: number;
  readonly interruptFadeDurationMilliseconds: number;
  readonly jumpToWhenPlayMilliseconds: number;
  readonly useTemporaryEmitter: boolean;
  readonly target: TargetReferenceSource;
  readonly mountPoint: string | number;
  readonly followMountPoint: boolean;
  readonly useWeaponMountPoint: boolean;
  readonly weaponIndex: number;
  readonly weaponMountPoint: string | number;
  readonly useTimeDilationPauseAndSeek: boolean;
  readonly timeDilationPauseThreshold: number;
  readonly timeDilationSeekThreshold: number;
  readonly timeDilationFadeOutDurationMilliseconds: number;
  readonly timeDilationFadeInDurationMilliseconds: number;
}

export interface SkillTypeMutationActionSource {
  readonly kind: 'skillTypeMutation';
  readonly target: TargetReferenceSource;
  readonly sourceSkillId: string;
  readonly nativeSkillType: import('../../../../packages/game-data-contract/src/index.ts').NativeSkillType;
}

export interface DebugPrintActionSource {
  readonly kind: 'debugPrint';
  readonly logType: string | number;
  readonly target: TargetReferenceSource;
  readonly color: {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly a: number;
  };
  readonly blackboardKey: string;
  readonly identifier: string;
}

export interface EffectActionSource {
  readonly kind: 'effect';
  readonly target: TargetReferenceSource;
  readonly effectSource: TargetReferenceSource;
  readonly effectName: string;
}

function isPlainTargetReference(reference: TargetReferenceSource, targetSource: string): boolean {
  return (
    reference.targetSource === targetSource &&
    reference.targetGroupKey === '' &&
    reference.selectorOwner === 'ActionOwner' &&
    reference.ownerContextKey === '' &&
    reference.centerType === 'ActionSource' &&
    reference.centerContextKey === '' &&
    !reference.centerToGround &&
    reference.target === 'ActionSource' &&
    reference.targetContextKey === '' &&
    !reference.enableAdvancedDirection &&
    reference.selectorDirection === 'SourceForward' &&
    reference.finderType === null &&
    reference.validatorTypes.length === 0 &&
    reference.postProcessorTypes.length === 0
  );
}

export interface CameraPresentationActionSource {
  readonly kind:
    | 'cameraImpulse'
    | 'cameraControlState'
    | 'inheritedCameraControlState'
    | 'dynamicCameraControlState'
    | 'cameraRotate'
    | 'animatedCamera'
    | 'hideUi'
    | 'ultimateShow'
    | 'weaponVisibility'
    | 'weaponAnimation'
    | 'animatorParameter'
    | 'igniteBuffText'
    | 'immuneText'
    | 'weaponMountPoint'
    | 'voiceTrigger'
    | 'voiceInterrupt'
    | 'overrideCameraFollow'
    | 'temporaryUnlock'
    | 'lockCameraAim'
    | 'actorVisibility'
    | 'modelIntervalCheck'
    | 'operatorUiEvent'
    | 'comboCounter'
    | 'specificLayerChangeNoop'
    | 'forceTargetInFightOmitted'
    | 'interruptHenshinListenerOmitted'
    | 'incomingControlTagListenerOmitted'
    | 'cutsceneCleanupListenerOmitted'
    | 'strafeMode'
    | 'dashLimit'
    | 'bombClear'
    | 'skillTypeMutation'
    | 'passiveUiValue'
    | 'animatorAimOffset'
    | 'squadTeleportOmitted'
    | 'dashWindowOmitted'
    | 'typhoeaTargetSelectionOmitted'
    | 'typhoeaHudHint';
  readonly readBlackboardKeys?: readonly string[];
  readonly target?: TargetReferenceSource;
  readonly sourceSkillId?: string;
  readonly nativeSkillType?: import('../../../../packages/game-data-contract/src/index.ts').NativeSkillType;
  readonly value?: ScalarSource;
}

/** Typhoeus 专属 HUD 只读取两个 Buff 来刷新箭矢/能量提示，不改变战斗状态。 */
export function parseShowTyphoeaHudHintActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'arrowBuffId',
      'energyBuffId',
    ]),
    path,
  );
  requireNonEmptyString(action.arrowBuffId, `${path}.arrowBuffId`);
  requireNonEmptyString(action.energyBuffId, `${path}.energyBuffId`);
  return { kind: 'typhoeaHudHint' };
}

/** 只驱动 Animator 的瞄准偏移层；完整校验字段后在无表现模拟中省略。 */
export function parseAnimatorAimOffsetActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'aimOffsetType',
      'aimXParam',
      'aimYParam',
      'layerName',
      'maxHorizontalAngle',
      'maxVerticalAngle',
      'smoothSpeed',
      'inheritAimParameters',
      'resetOnEnd',
      'blendIn',
      'blendOut',
      'duration',
    ]),
    path,
  );
  requireNativeEnum(
    action.aimOffsetType,
    ['None', 'HeadToTarget', 'StrafeMovement'] as const,
    `${path}.aimOffsetType`,
  );
  requireInteger(action.aimXParam, `${path}.aimXParam`);
  requireInteger(action.aimYParam, `${path}.aimYParam`);
  requireNonEmptyString(action.layerName, `${path}.layerName`);
  for (const key of [
    'maxHorizontalAngle',
    'maxVerticalAngle',
    'smoothSpeed',
    'blendIn',
    'blendOut',
    'duration',
  ] as const) {
    requireNumber(action[key], `${path}.${key}`);
  }
  requireBoolean(action.inheritAimParameters, `${path}.inheritAimParameters`);
  requireBoolean(action.resetOnEnd, `${path}.resetOnEnd`);
  return { kind: 'animatorAimOffset' };
}

/** 队伍传送只修正空间位置；零距离模型中不改变伤害、资源、冷却或 Buff。 */
export function parseTryToTeleportSquadActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  requireExactFields(
    requireRecord(value, path),
    new Set(['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex']),
    path,
  );
  return { kind: 'squadTeleportOmitted' };
}

/** 只开放玩家位移输入窗口；固定木桩伤害模型不模拟玩家移动。 */
export function parseMarkCanDashActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  requireExactFields(
    requireRecord(value, path),
    new Set(['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex']),
    path,
  );
  return { kind: 'dashWindowOmitted' };
}

/** ChangeSpecificLayerAction 只修改表现对象的 Unity Layer，不进入战斗模拟。 */
export function parseNoopSpecificLayerChangeActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
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
      'originLayerMask',
      'targetLayerMask',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  const originLayerMask = requireRecord(action.originLayerMask, `${path}.originLayerMask`);
  const targetLayerMask = requireRecord(action.targetLayerMask, `${path}.targetLayerMask`);
  for (const [mask, maskPath] of [
    [originLayerMask, `${path}.originLayerMask`],
    [targetLayerMask, `${path}.targetLayerMask`],
  ] as const) {
    // 历史 JSON 导出丢失了 Unity LayerMask 的内部字段；VFS 保留真实 m_Mask。
    const expectedFields = new Set<string>();
    if ('m_Mask' in mask) expectedFields.add('m_Mask');
    requireExactFields(mask, expectedFields, maskPath);
    if ('m_Mask' in mask) requireInteger(mask.m_Mask, `${maskPath}.m_Mask`);
  }
  return { kind: 'specificLayerChangeNoop' };
}

/**
 * ForceTargetInFightAction 只改变敌方 AI/交战状态。Endaxis 的场景在技能执行前已经绑定战斗，
 * 且唯一木桩没有主动 AI；这里只接纳庄方宜已审计的施法者 Source -> Buff Owner 目标形状。
 */
export function parseForceTargetInFightActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'attacker',
      'target',
    ]),
    path,
  );
  const attacker = parseTargetReferenceSource(action.attacker, `${path}.attacker`);
  const target = parseTargetReferenceSource(action.target, `${path}.target`);
  if (!isPlainTargetReference(attacker, 'Source') || !isPlainTargetReference(target, 'Owner')) {
    throw new Error(`${path}: unsupported ForceTargetInFight attacker/target projection`);
  }
  return { kind: 'forceTargetInFightOmitted' };
}

/** 当前模拟没有产生 InterruptHenshin 预定义标签；严格保留其唯一“结束自身形态 Buff”形状。 */
export function parseInterruptHenshinTagListenerActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'listenerType',
      'predefinedQuery',
      'customQuery',
      'executeOnMatch',
      'executeAction',
    ]),
    path,
  );
  const listenerType = requireNativeEnum(
    action.listenerType,
    ['PredefinedQuery', 'CustomQuery'] as const,
    `${path}.listenerType`,
  );
  const predefinedQuery =
    action.predefinedQuery === 1200
      ? 'InterruptHenshin'
      : requireNativeEnum(
          action.predefinedQuery,
          [
            'None',
            'InPull',
            'CantSwitchToCenter',
            'CantMainCharSwitched',
            'CantCastAnySkill',
            'InSilence',
            'InDisarmed',
            'InImmobilized',
          ] as const,
          `${path}.predefinedQuery`,
        );
  if (
    listenerType === 'CustomQuery' &&
    predefinedQuery === 'None' &&
    requireBoolean(action.executeOnMatch, `${path}.executeOnMatch`)
  ) {
    return parseCutsceneCleanupTagListener(action, path, inheritedBlackboard);
  }
  const isSupportedIncomingControlQuery = predefinedQuery === 'InImmobilized';
  if (
    listenerType !== 'PredefinedQuery' ||
    (predefinedQuery !== 'InterruptHenshin' && !isSupportedIncomingControlQuery) ||
    !requireBoolean(action.executeOnMatch, `${path}.executeOnMatch`)
  ) {
    throw new Error(`${path}: unsupported TagQueryListener projection`);
  }
  const customQuery = requireRecord(action.customQuery, `${path}.customQuery`);
  requireExactFields(customQuery, new Set(['queryType', 'tags']), `${path}.customQuery`);
  if (
    requireNativeEnum(
      customQuery.queryType,
      ['HasAny', 'HasAll', 'HasNone'] as const,
      `${path}.customQuery.queryType`,
    ) !== 'HasAny' ||
    requireArray(customQuery.tags, `${path}.customQuery.tags`).length !== 0
  ) {
    throw new Error(`${path}: predefined tag listener must have an empty custom query`);
  }
  const sequence = requireRecord(action.executeAction, `${path}.executeAction`);
  requireExactFields(
    sequence,
    new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
    `${path}.executeAction`,
  );
  if (
    requireBoolean(
      sequence.onlyExecuteWhenSourceIsMainChar,
      `${path}.executeAction.onlyExecuteWhenSourceIsMainChar`,
    ) ||
    requireBoolean(
      sequence.onlyExecuteWhenSourceIsGuard,
      `${path}.executeAction.onlyExecuteWhenSourceIsGuard`,
    )
  ) {
    throw new Error(`${path}: guarded InterruptHenshin listener is unsupported`);
  }
  const children = requireArray(sequence.actionData, `${path}.executeAction.actionData`);
  if (children.length !== 1) throw new Error(`${path}: expected one tag-listener action`);
  const finish = parseAdvancedBuffFinishActionSource(
    children[0],
    `${path}.executeAction.actionData[0]`,
    inheritedBlackboard,
  );
  if (
    finish.kind !== 'buffFinishByQuery' ||
    finish.settings.checkType !== 'Id' ||
    finish.settings.buffIds.length !== 1 ||
    finish.settings.buffIds[0] === '' ||
    finish.settings.tagQuery.tagIds.length !== 0 ||
    !finish.finishAll ||
    finish.finishLayerCount.blackboardKey !== null ||
    finish.finishLayerCount.value !== 1 ||
    finish.limitSource ||
    finish.isFinishedEarly ||
    finish.isAbsorbed ||
    !isPlainTargetReference(finish.owner, 'Owner') ||
    !isPlainTargetReference(finish.buffSource, 'Source') ||
    !isPlainTargetReference(finish.finishSource, 'Source')
  ) {
    throw new Error(`${path}: unsupported tag-listener finish action`);
  }
  return {
    kind: isSupportedIncomingControlQuery
      ? 'incomingControlTagListenerOmitted'
      : 'interruptHenshinListenerOmitted',
  };
}

/**
 * Arcane 的常驻被动在过场/过场切换标签出现时清理连携封印与分身。固定木桩模拟不产生
 * GlobalState/Performance/Cutscene 标签；完整验证清理目标后省略该不可达外部表现生命周期。
 */
function parseCutsceneCleanupTagListener(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const query = requireRecord(action.customQuery, `${path}.customQuery`);
  requireExactFields(query, new Set(['queryType', 'tags']), `${path}.customQuery`);
  const tags = requireArray(query.tags, `${path}.customQuery.tags`).map((item, index) => {
    const tag = requireRecord(item, `${path}.customQuery.tags[${index}]`);
    requireExactFields(tag, new Set(['tagId']), `${path}.customQuery.tags[${index}]`);
    return requireInteger(tag.tagId, `${path}.customQuery.tags[${index}].tagId`);
  });
  if (
    requireNativeEnum(
      query.queryType,
      ['HasAny', 'HasAll', 'HasNone'] as const,
      `${path}.customQuery.queryType`,
    ) !== 'HasAny' ||
    tags.length !== 2 ||
    !tags.includes(1105446346) ||
    !tags.includes(507365453)
  )
    throw new Error(`${path}: unsupported custom TagQueryListener query`);
  const sequence = requireRecord(action.executeAction, `${path}.executeAction`);
  requireExactFields(
    sequence,
    new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
    `${path}.executeAction`,
  );
  if (
    requireBoolean(
      sequence.onlyExecuteWhenSourceIsMainChar,
      `${path}.executeAction.onlyExecuteWhenSourceIsMainChar`,
    ) ||
    requireBoolean(
      sequence.onlyExecuteWhenSourceIsGuard,
      `${path}.executeAction.onlyExecuteWhenSourceIsGuard`,
    )
  )
    throw new Error(`${path}: guarded cutscene cleanup listener is unsupported`);
  const children = requireArray(sequence.actionData, `${path}.executeAction.actionData`);
  if (children.length !== 3) throw new Error(`${path}: expected three cutscene cleanup actions`);
  const find = parseTargetGroupActionSource(
    children[0],
    `${path}.executeAction.actionData[0]`,
    inheritedBlackboard,
  );
  if (
    find?.producerType !== 'FindTargetAction' ||
    find.targetGroupKey !== 'tar' ||
    find.finderType !== 'InFightEnemyFinder' ||
    find.validatorTypes.length !== 0 ||
    find.postProcessorTypes.length !== 0
  )
    throw new Error(`${path}: unsupported cutscene cleanup target search`);
  const finish = parseAdvancedBuffFinishActionSource(
    children[1],
    `${path}.executeAction.actionData[1]`,
    inheritedBlackboard,
  );
  if (
    finish.kind !== 'buffFinishByQuery' ||
    finish.settings.checkType !== 'Id' ||
    finish.settings.buffIds.length === 0 ||
    finish.settings.buffIds.some(id => !id.startsWith('buff_chr_0032_lizhiyan_combo_skill_seal')) ||
    !finish.finishAll ||
    finish.owner.targetSource !== 'Context' ||
    finish.owner.targetGroupKey !== 'tar' ||
    finish.limitSource ||
    finish.isFinishedEarly ||
    finish.isAbsorbed
  )
    throw new Error(`${path}: unsupported cutscene Buff cleanup`);
  const owner = parseFinishOwnerActionSource(children[2], `${path}.executeAction.actionData[2]`);
  if (
    owner.skipDieDisplay ||
    owner.owner.targetSource !== 'InstantSearch' ||
    owner.owner.finderType !== 'OwnerSpawnedEntityFinder' ||
    owner.owner.finderSpawnedObjectType !== 'AbilityEntity' ||
    owner.owner.validatorTagQueries.length !== 1 ||
    owner.owner.validatorTagQueries[0]![0] !== 'HasAny' ||
    owner.owner.validatorTagQueries[0]![1].length !== 1 ||
    owner.owner.validatorTagQueries[0]![1][0] !== -1480463572
  )
    throw new Error(`${path}: unsupported cutscene spawned-entity cleanup`);
  return { kind: 'cutsceneCleanupListenerOmitted' };
}

/** 角色横移/步态/镜头锁定只改变移动表现；字段仍需完整读取。 */
/**
 * 提丰瞄准期间把候选敌人交给 BattleManager 持续筛选并挂标记 Buff；OnEnd 清除标记。
 * 固定木桩模型只有一个始终可选的敌人，空间/屏幕优先级不会改变伤害目标，因此严格读取
 * 完整配置后把这项选择器作为表现与选敌基础设施省略。
 */
export function parseTyphoeaTargetSelectionActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'markBuff',
      'targetNum',
      'fullScreen',
      'lockRegionHalfHeight',
      'lockRegionRatio',
      'maxLockDistanceFromCamera',
      'smartPrioritySelect',
    ]),
    path,
  );
  const markPath = `${path}.markBuff`;
  const mark = requireRecord(action.markBuff, markPath);
  requireExactFields(
    mark,
    new Set(['buffId', 'readIdFromBlackboard', 'buffIdKey', 'assignBlackboard', 'assignItems']),
    markPath,
  );
  requireNonEmptyString(mark.buffId, `${markPath}.buffId`);
  if (requireBoolean(mark.readIdFromBlackboard, `${markPath}.readIdFromBlackboard`))
    throw new Error(`${markPath}.readIdFromBlackboard: dynamic target mark is unsupported`);
  if (requireString(mark.buffIdKey, `${markPath}.buffIdKey`) !== '')
    throw new Error(`${markPath}.buffIdKey: expected empty string`);
  if (requireBoolean(mark.assignBlackboard, `${markPath}.assignBlackboard`))
    throw new Error(`${markPath}.assignBlackboard: target mark assignments are unsupported`);
  if (requireArray(mark.assignItems, `${markPath}.assignItems`).length !== 0)
    throw new Error(`${markPath}.assignItems: expected empty array`);

  parseIntegerScalarSource(action.targetNum, `${path}.targetNum`);
  requireBoolean(action.fullScreen, `${path}.fullScreen`);
  parseScalarSource(
    action.lockRegionHalfHeight,
    `${path}.lockRegionHalfHeight`,
    inheritedBlackboard,
  );
  parseScalarSource(action.lockRegionRatio, `${path}.lockRegionRatio`, inheritedBlackboard);
  parseScalarSource(
    action.maxLockDistanceFromCamera,
    `${path}.maxLockDistanceFromCamera`,
    inheritedBlackboard,
  );

  const selectPath = `${path}.smartPrioritySelect`;
  const select = requireRecord(action.smartPrioritySelect, selectPath);
  requireExactFields(
    select,
    new Set([
      'smartTargetSelectStrategy',
      'smartTargetBuffIds',
      'smartTargetTagQuery',
      'smartTargetBuffFindSettings',
    ]),
    selectPath,
  );
  requireNativeEnum(
    select.smartTargetSelectStrategy,
    [
      'SelectComboSkillTarget',
      'SelectComboSkillTrigger',
      'SelectByBuff',
      'SelectByTag',
      'SelectByBuffStackNum',
    ] as const,
    `${selectPath}.smartTargetSelectStrategy`,
  );
  requireArray(select.smartTargetBuffIds, `${selectPath}.smartTargetBuffIds`).forEach(
    (item, index) => {
      const itemPath = `${selectPath}.smartTargetBuffIds[${index}]`;
      const entry = requireRecord(item, itemPath);
      requireExactFields(entry, new Set(['buffId']), itemPath);
      requireNonEmptyString(entry.buffId, `${itemPath}.buffId`);
    },
  );
  parseTagQuerySource(select.smartTargetTagQuery, `${selectPath}.smartTargetTagQuery`);
  const findPath = `${selectPath}.smartTargetBuffFindSettings`;
  const find = requireRecord(select.smartTargetBuffFindSettings, findPath);
  requireExactFields(find, new Set(['checkType', 'buffIdList', 'tagQuery']), findPath);
  requireNativeEnum(find.checkType, ['Id', 'Tag'] as const, `${findPath}.checkType`);
  requireArray(find.buffIdList, `${findPath}.buffIdList`).forEach((id, index) =>
    requireNonEmptyString(id, `${findPath}.buffIdList[${index}]`),
  );
  parseTagQuerySource(find.tagQuery, `${findPath}.tagQuery`);
  return { kind: 'typhoeaTargetSelectionOmitted' };
}

export function parseSetStrafeModeActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  const expectedFields = new Set([
    '$type',
    'isEnable',
    'priorityLevel',
    'priorityOffset',
    'serverActionIndex',
    'strafeTarget',
    'limitGait',
    'minGait',
    'maxGait',
    'lockToCamera',
  ]);
  if ('yawOffset' in action) expectedFields.add('yawOffset');
  requireExactFields(action, expectedFields, path);
  parseTargetReferenceSource(action.strafeTarget, `${path}.strafeTarget`);
  requireBoolean(action.limitGait, `${path}.limitGait`);
  requireNativeEnum(action.minGait, ['Walk', 'Run', 'Sprint'] as const, `${path}.minGait`);
  requireNativeEnum(action.maxGait, ['Walk', 'Run', 'Sprint'] as const, `${path}.maxGait`);
  requireBoolean(action.lockToCamera, `${path}.lockToCamera`);
  if ('yawOffset' in action) requireNumber(action.yawOffset, `${path}.yawOffset`);
  return { kind: 'strafeMode' };
}

/** 多段闪避输入上限不参与时间轴技能伤害结算；当前只接纳形态 Buff 的 Owner/-1 载荷。 */
export function parseOverrideMultiDashLimitActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'targetSetting',
      'dashCount',
    ]),
    path,
  );
  const target = parseTargetReferenceSource(action.targetSetting, `${path}.targetSetting`);
  const dashCount = requireRecord(action.dashCount, `${path}.dashCount`);
  requireExactFields(
    dashCount,
    new Set(['useBlackboardKey', 'value', 'blackboardKey']),
    `${path}.dashCount`,
  );
  if (
    !isPlainTargetReference(target, 'Owner') ||
    requireBoolean(dashCount.useBlackboardKey, `${path}.dashCount.useBlackboardKey`) ||
    requireNumber(dashCount.value, `${path}.dashCount.value`) !== -1 ||
    requireString(dashCount.blackboardKey, `${path}.dashCount.blackboardKey`) !== ''
  ) {
    throw new Error(`${path}: unsupported multi-dash limit projection`);
  }
  return { kind: 'dashLimit' };
}

/** BombClearAction 清理角色手持炸弹状态；Next 时间轴没有炸弹交互对象。 */
export function parseBombClearActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  requireExactFields(
    requireRecord(value, path),
    new Set(['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex']),
    path,
  );
  return { kind: 'bombClear' };
}

/**
 * ChangeSkillType 只修改既有技能实例的分类。Next 的内部 CastSkill 按 ID 直接解析技能定义，
 * 不依赖原生 AbilitySystem 的技能分类注册；当前仅省略庄方宜退场技能的 AttachSkill 改写。
 */
export function parseSkillTypeMutationSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'target',
      'skillId',
      'skillType',
    ]),
    path,
  );
  const target = parseTargetReferenceSource(action.target, `${path}.target`);
  const skillId = requireRecord(action.skillId, `${path}.skillId`);
  requireExactFields(
    skillId,
    new Set(['useBlackboardKey', 'value', 'blackboardKey']),
    `${path}.skillId`,
  );
  if (
    !isPlainTargetReference(target, 'Owner') ||
    requireBoolean(skillId.useBlackboardKey, `${path}.skillId.useBlackboardKey`) ||
    requireString(skillId.blackboardKey, `${path}.skillId.blackboardKey`) !== ''
  ) {
    throw new Error(`${path}: unsupported ChangeSkillType projection`);
  }
  const nativeSkillType = parseNativeSkillType(action.skillType, `${path}.skillType`);
  return {
    kind: 'skillTypeMutation' as const,
    target,
    sourceSkillId: requireNonEmptyString(skillId.value, `${path}.skillId.value`),
    nativeSkillType,
  };
}

/** NotifyCharPassiveUIAction 把求值后的数值送入动作 Owner 的角色被动 UI。 */
export function parseNotifyCharacterPassiveUiActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'target',
      'value',
    ]),
    path,
  );
  const target = parseTargetReferenceSource(action.target, `${path}.target`);
  const scalar = parseScalarSource(action.value, `${path}.value`, inheritedBlackboard);
  return {
    kind: 'passiveUiValue',
    target,
    value: scalar,
    ...(scalar.blackboardKey === null ? {} : { readBlackboardKeys: [scalar.blackboardKey] }),
  };
}

/**
 * 1.4.4 ComboAction.ExecuteInternal（RVA 0x06CE89B8）只按 count 添加
 * COMMON_COMBO_GLOBAL_BUFF_ID，并把 duration 写入该 GlobalBuff。正式目录中的
 * global_buff_combo_trigger 只投射无图标、无数值修正的 VFX child Buff；在 Endaxis
 * 木桩伤害模型中属于连击计数 UI/表现，但仍严格保留其黑板读取依赖。
 */
export function parseComboCounterActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, new Set([...ACTION_META_FIELDS, 'source', 'duration', 'count']), path);
  parseTargetReferenceSource(action.source, `${path}.source`);
  const duration = parseScalarSource(action.duration, `${path}.duration`, inheritedBlackboard);
  const count = parseScalarSource(action.count, `${path}.count`, inheritedBlackboard);
  return {
    kind: 'comboCounter',
    readBlackboardKeys: [duration.blackboardKey, count.blackboardKey].filter(
      (key): key is string => key !== null,
    ),
  };
}

/** 梨诺专属 UI 动画事件；两个标量只控制界面动画速度和缩放。 */
export function parseLiinoUiEventActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'liinoEvent', 'speed', 'scale']),
    path,
  );
  const liinoEventPath = `${path}.liinoEvent`;
  if (!(
    (typeof action.liinoEvent === 'number' &&
      Number.isInteger(action.liinoEvent) &&
      [0, 1, 2, 4, 5, 6].includes(action.liinoEvent)) ||
    (typeof action.liinoEvent === 'string' &&
      ['Show', 'BigLike', 'Like', 'Call', 'RandomLike', 'Close'].includes(action.liinoEvent))
  ))
    throw new Error(`${liinoEventPath}: unsupported Liino UI event`);
  const speed = parseScalarSource(action.speed, `${path}.speed`, inheritedBlackboard);
  const scale = parseScalarSource(action.scale, `${path}.scale`, inheritedBlackboard);
  return {
    kind: 'operatorUiEvent',
    readBlackboardKeys: [speed.blackboardKey, scale.blackboardKey].filter(
      (key): key is string => key !== null,
    ),
  };
}

/**
 * 1.4.4 InheritCCSAction.ExecuteInternal (RVA 0x06D00E0C) 只创建并保存
 * CameraControlState，overrideBlendOut 只写该相机状态；OnEnd (0x06D00FC0)
 * 释放它。无渲染模拟严格校验载荷后省略，不据名称推断战斗行为。
 */
export function parseInheritedCameraControlStateActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'ccsOwner', 'ccsKey', 'overrideBlendOut', 'blendOutTime']),
    path,
  );
  const owner = parseTargetReferenceSource(action.ccsOwner, `${path}.ccsOwner`);
  if (owner.targetSource !== 'Owner' || owner.targetGroupKey !== '') {
    throw new Error(`${path}.ccsOwner: expected plain Owner`);
  }
  requireNonEmptyString(action.ccsKey, `${path}.ccsKey`);
  requireBoolean(action.overrideBlendOut, `${path}.overrideBlendOut`);
  const blendOutTime = requireNumber(action.blendOutTime, `${path}.blendOutTime`);
  if (blendOutTime < 0) throw new Error(`${path}.blendOutTime: expected non-negative number`);
  return { kind: 'inheritedCameraControlState' };
}

export function parseIgniteBuffTextActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'mountPoint',
      'offset',
      'energyShardType',
      'textId',
      'showOnSquadIcon',
      'forceMainBody',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  parseMountPoint(action.mountPoint, `${path}.mountPoint`);
  const offset = requireRecord(action.offset, `${path}.offset`);
  requireExactFields(offset, new Set(['x', 'y']), `${path}.offset`);
  requireNumber(offset.x, `${path}.offset.x`);
  requireNumber(offset.y, `${path}.offset.y`);
  parseMountPoint(action.energyShardType, `${path}.energyShardType`);
  requireString(action.textId, `${path}.textId`);
  requireBoolean(action.showOnSquadIcon, `${path}.showOnSquadIcon`);
  requireBoolean(action.forceMainBody, `${path}.forceMainBody`);
  return { kind: 'igniteBuffText' };
}

/** 伤害免疫提示只携带文字、挂点和屏幕偏移；严格解析后进入无渲染后端的表现叶。 */
export function parseImmuneTextActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'mountPoint',
      'offset',
      'textId',
      'forceMainBody',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  parseMountPoint(action.mountPoint, `${path}.mountPoint`);
  const offset = requireRecord(action.offset, `${path}.offset`);
  requireExactFields(offset, new Set(['x', 'y']), `${path}.offset`);
  requireNumber(offset.x, `${path}.offset.x`);
  requireNumber(offset.y, `${path}.offset.y`);
  requireString(action.textId, `${path}.textId`);
  requireBoolean(action.forceMainBody, `${path}.forceMainBody`);
  return { kind: 'immuneText' };
}

export function parseSetAnimatorParameterActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'paramName', 'paramAction', 'actionOnEnd', 'endAction']),
    path,
  );
  requireString(action.paramName, `${path}.paramName`);
  parseAnimatorParameterAction(action.paramAction, `${path}.paramAction`);
  requireBoolean(action.actionOnEnd, `${path}.actionOnEnd`);
  parseAnimatorParameterAction(action.endAction, `${path}.endAction`);
  return { kind: 'animatorParameter' };
}

export function parseShowHideActorActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'showHideType',
      'modelPartEnum',
      'isShow',
      'affectInit',
      'revertOnRelease',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  requireNativeEnum(
    action.showHideType,
    ['All', 'OnlyModel', 'OnlyEffect', 'ModelPart', 'AllBattle'] as const,
    `${path}.showHideType`,
  );
  requireNativeEnum(
    action.modelPartEnum,
    [
      'None',
      'MeshGroup1',
      'MeshGroup2',
      'MeshGroup3',
      'MeshGroup4',
      'MeshGroup5',
      'MeshGroup6',
      'MeshGroup7',
      'MeshGroup8',
      'MeshGroup9',
      'MeshGroup10',
    ] as const,
    `${path}.modelPartEnum`,
  );
  requireBoolean(action.isShow, `${path}.isShow`);
  requireBoolean(action.affectInit, `${path}.affectInit`);
  requireBoolean(action.revertOnRelease, `${path}.revertOnRelease`);
  return { kind: 'actorVisibility' };
}

export function parseModifyWeaponMountPointActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'weaponIndex',
      'overrideIdleMountPoint',
      'idleMountPoint',
      'overrideFightMountPoint',
      'fightMountPoint',
    ]),
    path,
  );
  requireInteger(action.weaponIndex, `${path}.weaponIndex`);
  requireBoolean(action.overrideIdleMountPoint, `${path}.overrideIdleMountPoint`);
  requireStringOrInteger(action.idleMountPoint, `${path}.idleMountPoint`);
  requireBoolean(action.overrideFightMountPoint, `${path}.overrideFightMountPoint`);
  requireStringOrInteger(action.fightMountPoint, `${path}.fightMountPoint`);
  return { kind: 'weaponMountPoint' };
}

export function parseWeaponAnimationActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'weaponId',
      'paramAction',
      'actionOnEnd',
      'endAction',
      'actionOnInterrupt',
      'interruptionAction',
      'overrideInterruptionTime',
      'interruptionBefore',
    ]),
    path,
  );
  requireInteger(action.weaponId, `${path}.weaponId`);
  parseAnimatorParameterAction(action.paramAction, `${path}.paramAction`);
  requireBoolean(action.actionOnEnd, `${path}.actionOnEnd`);
  parseAnimatorParameterAction(action.endAction, `${path}.endAction`);
  requireBoolean(action.actionOnInterrupt, `${path}.actionOnInterrupt`);
  parseAnimatorParameterAction(action.interruptionAction, `${path}.interruptionAction`);
  requireBoolean(action.overrideInterruptionTime, `${path}.overrideInterruptionTime`);
  requireNumber(action.interruptionBefore, `${path}.interruptionBefore`);
  return { kind: 'weaponAnimation' };
}

function parseAnimatorParameterAction(value: unknown, path: string): void {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set(['animatorParam', 'paramType', 'boolValue', 'intValue', 'floatValue']),
    path,
  );
  requireInteger(action.animatorParam, `${path}.animatorParam`);
  requireStringOrInteger(action.paramType, `${path}.paramType`);
  requireBoolean(action.boolValue, `${path}.boolValue`);
  requireInteger(action.intValue, `${path}.intValue`);
  requireNumber(action.floatValue, `${path}.floatValue`);
}

export function parseHideUiActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, new Set([...ACTION_META_FIELDS, 'onlyBlockInput']), path);
  requireBoolean(action.onlyBlockInput, `${path}.onlyBlockInput`);
  return { kind: 'hideUi' };
}

export function parseUltimateShowActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, new Set(ACTION_META_FIELDS), path);
  return { kind: 'ultimateShow' };
}

/**
 * 1.4.4 IgnoreModelIntervalCheck.ExecuteInternal (RVA 0x06CFFC80) calls
 * Beyond.Gameplay.View.ModelManager.SetIgnoreIntervalCheck(true), while OnEnd
 * (0x06CFFD20) restores it with false. The action has no payload beyond the
 * common metadata and only changes the model loader's per-frame work budget;
 * a headless combat projection may therefore omit it after strict validation.
 */
export function parseIgnoreModelIntervalCheckActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, new Set(ACTION_META_FIELDS), path);
  return { kind: 'modelIntervalCheck' };
}

export function parseAnimatedCameraActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'cameraAnimKey',
      'duration',
      'horizontalInheritType',
      'outRelativeHorizontalAngle',
      'verticalInheritType',
      'outVerticalValue',
      'zoomScaleInheritType',
      'outZoomScale',
      'fitByCameraPos',
      'followPosition',
      'followRotation',
      'easeIn',
      'easeInTime',
      'easeOut',
      'easeOutTime',
      'hideAllRendererEffect',
      'affectedByTimeScale',
      'checkCollisionOnEnd',
      'checkCollisionTime',
      'endByInput',
    ]),
    path,
  );
  requireString(action.cameraAnimKey, `${path}.cameraAnimKey`);
  for (const key of [
    'duration',
    'outRelativeHorizontalAngle',
    'outVerticalValue',
    'outZoomScale',
    'easeInTime',
    'easeOutTime',
    'checkCollisionTime',
  ] as const)
    requireNumber(action[key], `${path}.${key}`);
  for (const key of [
    'horizontalInheritType',
    'verticalInheritType',
    'zoomScaleInheritType',
  ] as const)
    requireNativeEnum(
      action[key],
      ['PreviousLevelCamera', 'CurrentAnimatedCamera', 'Custom'] as const,
      `${path}.${key}`,
    );
  for (const key of [
    'fitByCameraPos',
    'followPosition',
    'followRotation',
    'easeIn',
    'easeOut',
    'hideAllRendererEffect',
    'affectedByTimeScale',
    'checkCollisionOnEnd',
    'endByInput',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  return { kind: 'animatedCamera' };
}

export function parseWeaponVisibilityActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'includeAllWeapons',
      'weaponIndex',
      'visible',
      'showVFX',
      'overrideVFX',
      'vfxOverrideConfig',
    ]),
    path,
  );
  requireBoolean(action.includeAllWeapons, `${path}.includeAllWeapons`);
  requireInteger(action.weaponIndex, `${path}.weaponIndex`);
  requireBoolean(action.visible, `${path}.visible`);
  requireBoolean(action.showVFX, `${path}.showVFX`);
  requireBoolean(action.overrideVFX, `${path}.overrideVFX`);
  const vfx = requireRecord(action.vfxOverrideConfig, `${path}.vfxOverrideConfig`);
  const fields = [
    'toIdleAppearParticleFx',
    'toIdleAppearRendererFx',
    'toIdleAppearRendererFx2',
    'toIdleAppearRendererFx3',
    'toIdleAppearRendererFx4',
    'toIdleDisappearParticleFx',
    'toIdleDisappearRendererFx',
    'toFightAppearParticleFx',
    'toFightAppearRendererFx',
  ];
  requireExactFields(
    vfx,
    new Set(fields.flatMap(field => [`enable${field[0]!.toUpperCase()}${field.slice(1)}`, field])),
    `${path}.vfxOverrideConfig`,
  );
  for (const field of fields) {
    requireBoolean(
      vfx[`enable${field[0]!.toUpperCase()}${field.slice(1)}`],
      `${path}.vfxOverrideConfig.enable${field[0]!.toUpperCase()}${field.slice(1)}`,
    );
    requireString(vfx[field], `${path}.vfxOverrideConfig.${field}`);
  }
  return { kind: 'weaponVisibility' };
}

export function parseVoiceTriggerActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      '_triggerKey',
      '_speakerType',
      '_canInterruptTimeMs',
      ...('_jumpToWhenPlayMs' in action
        ? ['_jumpToWhenPlayMs', '_seekFadeInMs', '_responseQuestIdKey']
        : []),
      'targetSettings',
    ]),
    path,
  );
  requireString(action._triggerKey, `${path}._triggerKey`);
  requireStringOrInteger(action._speakerType, `${path}._speakerType`);
  requireInteger(action._canInterruptTimeMs, `${path}._canInterruptTimeMs`);
  if ('_jumpToWhenPlayMs' in action) {
    requireInteger(action._jumpToWhenPlayMs, `${path}._jumpToWhenPlayMs`);
    requireInteger(action._seekFadeInMs, `${path}._seekFadeInMs`);
    requireString(action._responseQuestIdKey, `${path}._responseQuestIdKey`);
  }
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  return { kind: 'voiceTrigger' };
}

export function parseVoiceInterruptActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, '_interruptImmediately', '_canInterruptTimeMs']),
    path,
  );
  requireBoolean(action._interruptImmediately, `${path}._interruptImmediately`);
  requireInteger(action._canInterruptTimeMs, `${path}._canInterruptTimeMs`);
  return { kind: 'voiceInterrupt' };
}

export function parseCameraRotateActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'ccsPriority',
      'totalAngle',
      'duration',
      'blendStyle',
      'customCurve',
      'inputConflictStrategy',
    ]),
    path,
  );
  requireNumber(action.ccsPriority, `${path}.ccsPriority`);
  const totalAngle = parseScalarSource(
    action.totalAngle,
    `${path}.totalAngle`,
    inheritedBlackboard,
  );
  const duration = parseScalarSource(action.duration, `${path}.duration`, inheritedBlackboard);
  requireNativeEnum(action.blendStyle, CAMERA_BLEND_STYLES, `${path}.blendStyle`);
  parseTimeDilationCurveKeys(action.customCurve, `${path}.customCurve`);
  requireNativeEnum(
    action.inputConflictStrategy,
    ['Additive'] as const,
    `${path}.inputConflictStrategy`,
  );
  return {
    kind: 'cameraRotate',
    readBlackboardKeys: [totalAngle.blackboardKey, duration.blackboardKey].filter(
      (key): key is string => key !== null,
    ),
  };
}

export interface PlayAnimationActionSource {
  readonly kind: 'playAnimation';
  readonly animationName: string;
  readonly durationSeconds: number;
  readonly blendOutSeconds: number;
  readonly playbackSpeed: number;
  readonly executeOnNormalEndOnly: boolean;
  /** 只保留当前已严格解析的“条件守卫后创建 Buff”结束子图；是否可省略由投影层判定。 */
  readonly onEnd?: {
    readonly conditions: readonly NativeConditionSource[];
    readonly buffApplications: readonly BuffApplicationActionSource[];
  };
}

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

export function parseOverrideCameraFollowActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'targetSettings2',
      'targetAlpha',
      'blendInStyle',
      'blendInTime',
      'blendOutStyle',
      'blendOutTime',
      'ccsPriority',
    ]),
    path,
  );
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  parseTargetReferenceSource(action.targetSettings2, `${path}.targetSettings2`);
  const values = [
    parseScalarSource(action.targetAlpha, `${path}.targetAlpha`, inheritedBlackboard),
    parseScalarSource(action.blendInTime, `${path}.blendInTime`, inheritedBlackboard),
    parseScalarSource(action.blendOutTime, `${path}.blendOutTime`, inheritedBlackboard),
    parseScalarSource(action.ccsPriority, `${path}.ccsPriority`, inheritedBlackboard),
  ];
  requireNativeEnum(action.blendInStyle, CAMERA_BLEND_STYLES, `${path}.blendInStyle`);
  requireNativeEnum(action.blendOutStyle, CAMERA_BLEND_STYLES, `${path}.blendOutStyle`);
  return {
    kind: 'overrideCameraFollow',
    readBlackboardKeys: values
      .map(value => value.blackboardKey)
      .filter((key): key is string => key !== null),
  };
}

export function parseTemporaryUnlockActionSource(
  value: unknown,
  path: string,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'compareTarget',
      'targetSettings',
      'disableLockAimPriority',
      ...('blockManualLock' in action ? ['blockManualLock'] : []),
    ]),
    path,
  );
  requireBoolean(action.compareTarget, `${path}.compareTarget`);
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  requireNumber(action.disableLockAimPriority, `${path}.disableLockAimPriority`);
  if ('blockManualLock' in action) {
    requireBoolean(action.blockManualLock, `${path}.blockManualLock`);
  }
  return { kind: 'temporaryUnlock' };
}

/** LockCameraAimAction 只建立相机控制状态；严格读取所有 1.4.4 镜头参数后由无渲染后端省略。 */
export function parseLockCameraAimActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'ccsPriority',
      'overrideLowerParamsToDefault',
      'angleThreshold',
      'forceFollowMainChar',
      'blendInStyle',
      'blendInCustomCurve',
      'blendInTime',
      'blendOutStyle',
      'blendOutCustomCurve',
      'blendOutTime',
      'horizontalBaseAngleMin',
      'horizontalBaseAngleMinBB',
      'horizontalBaseAngleMax',
      'horizontalBaseAngleMaxBB',
      'verticalRelativeToTarget',
      'verticalBaseValue',
      'verticalBaseValueBB',
      'verticalBaseValueMin',
      'verticalBaseValueMinBB',
      'verticalBaseValueMax',
      'verticalBaseValueMaxBB',
      'dampingTime',
      'horizontalSpeedFactor',
      'verticalSpeedFactor',
      'horizontalTweenSpeed',
      'verticalTweenSpeed',
      'allowAimZones',
      'useExitParam',
      'exitParamOnlyOnComplete',
      'exitParam',
      'disablePlayerInputOnBlendIn',
      'disablePlayerInputOnBlendOut',
      'disablePlayerInputInState',
      'cancelOnDrag',
      'cancelOnBeHit',
      'cancelOnMove',
      'overrideTarget1',
      'useMainCharYForTarget1',
      'targetSettings',
      'mountPoint1',
      'overrideLookAtOffset',
      'lookAtOffset',
      'overrideTarget2',
      'useMainCharYForTarget2',
      'targetSettings2',
      'mountPoint2',
      'overrideLookAt2Offset',
      'lookAt2Offset',
      'lookAt2OffsetWhenNoOverride',
      'targetAlpha',
    ]),
    path,
  );
  for (const key of [
    'ccsPriority',
    'angleThreshold',
    'blendInTime',
    'blendOutTime',
    'horizontalBaseAngleMin',
    'horizontalBaseAngleMax',
    'verticalBaseValue',
    'verticalBaseValueMin',
    'verticalBaseValueMax',
    'dampingTime',
    'horizontalSpeedFactor',
    'verticalSpeedFactor',
    'horizontalTweenSpeed',
    'verticalTweenSpeed',
    'targetAlpha',
  ] as const)
    requireNumber(action[key], `${path}.${key}`);
  for (const key of [
    'overrideLowerParamsToDefault',
    'forceFollowMainChar',
    'verticalRelativeToTarget',
    'allowAimZones',
    'useExitParam',
    'exitParamOnlyOnComplete',
    'disablePlayerInputOnBlendIn',
    'disablePlayerInputOnBlendOut',
    'disablePlayerInputInState',
    'cancelOnDrag',
    'cancelOnBeHit',
    'cancelOnMove',
    'overrideTarget1',
    'useMainCharYForTarget1',
    'overrideLookAtOffset',
    'overrideTarget2',
    'useMainCharYForTarget2',
    'overrideLookAt2Offset',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  requireNativeEnum(action.blendInStyle, CAMERA_BLEND_STYLES, `${path}.blendInStyle`);
  requireNativeEnum(action.blendOutStyle, CAMERA_BLEND_STYLES, `${path}.blendOutStyle`);
  parseMountPoint(action.mountPoint1, `${path}.mountPoint1`);
  parseMountPoint(action.mountPoint2, `${path}.mountPoint2`);
  parseTimeDilationCurveKeys(action.blendInCustomCurve, `${path}.blendInCustomCurve`);
  parseTimeDilationCurveKeys(action.blendOutCustomCurve, `${path}.blendOutCustomCurve`);
  parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  parseTargetReferenceSource(action.targetSettings2, `${path}.targetSettings2`);
  const readBlackboardKeys = [
    'horizontalBaseAngleMinBB',
    'horizontalBaseAngleMaxBB',
    'verticalBaseValueBB',
    'verticalBaseValueMinBB',
    'verticalBaseValueMaxBB',
  ]
    .map(key => parseScalarSource(action[key], `${path}.${key}`, inheritedBlackboard).blackboardKey)
    .filter((key): key is string => key !== null);
  const exitParam = requireRecord(action.exitParam, `${path}.exitParam`);
  requireExactFields(
    exitParam,
    new Set([
      'applyHorizontalAngle',
      'horizontalAngleRelativeToCharacter',
      'horizontalAngle',
      'applyVerticalValue',
      'verticalValue',
      'applyZoomScale',
      'zoomScale',
    ]),
    `${path}.exitParam`,
  );
  for (const key of [
    'applyHorizontalAngle',
    'horizontalAngleRelativeToCharacter',
    'applyVerticalValue',
    'applyZoomScale',
  ] as const)
    requireBoolean(exitParam[key], `${path}.exitParam.${key}`);
  for (const key of ['horizontalAngle', 'verticalValue', 'zoomScale'] as const)
    requireNumber(exitParam[key], `${path}.exitParam.${key}`);
  for (const key of ['lookAtOffset', 'lookAt2Offset', 'lookAt2OffsetWhenNoOverride'] as const) {
    const vector = requireRecord(action[key], `${path}.${key}`);
    requireExactFields(vector, new Set(['x', 'y', 'z']), `${path}.${key}`);
    for (const axis of ['x', 'y', 'z'] as const)
      requireNumber(vector[axis], `${path}.${key}.${axis}`);
  }
  return { kind: 'lockCameraAim', ...(readBlackboardKeys.length ? { readBlackboardKeys } : {}) };
}

/**
 * 无渲染后端只可省略没有 onEnd 子动作的动画。onEnd 可能承载战斗逻辑，因此非空时严格拒绝，
 * 不能因为根动作是表现动作就连带删除子图。
 */
export function parsePlayAnimationActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues = {},
): PlayAnimationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'animName',
      'blendDuration',
      'blendOut',
      'duration',
      'playbackSpeed',
      'useStartTimeBlackboardKey',
      'startTime',
      'startTimeBlackboardKey',
      'exitToIdle',
      'blendOutNextStateHash',
      'onEndAction',
      'executeOnNormalEndOnly',
    ]),
    path,
  );
  const onEnd = requireRecord(action.onEndAction, `${path}.onEndAction`);
  requireExactFields(
    onEnd,
    new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
    `${path}.onEndAction`,
  );
  const onEndActions = requireArray(onEnd.actionData, `${path}.onEndAction.actionData`);
  if (
    requireBoolean(
      onEnd.onlyExecuteWhenSourceIsMainChar,
      `${path}.onEndAction.onlyExecuteWhenSourceIsMainChar`,
    ) ||
    requireBoolean(
      onEnd.onlyExecuteWhenSourceIsGuard,
      `${path}.onEndAction.onlyExecuteWhenSourceIsGuard`,
    )
  ) {
    throw new Error(`${path}.onEndAction: animation end combat actions are unsupported`);
  }
  const conditions: NativeConditionSource[] = [];
  const buffApplications: BuffApplicationActionSource[] = [];
  const enabledOnEndActions = onEndActions.filter((raw, index) =>
    requireBoolean(
      requireRecord(raw, `${path}.onEndAction.actionData[${index}]`).isEnable,
      `${path}.onEndAction.actionData[${index}].isEnable`,
    ),
  );
  enabledOnEndActions.forEach((raw, index) => {
    const actionPath = `${path}.onEndAction.actionData[${index}]`;
    const child = requireRecord(raw, actionPath);
    const name = nativeActionName(requireNonEmptyString(child.$type, `${actionPath}.$type`));
    if (name === 'CreateBuffAction' || name === 'CreateBuffAttachingSkill') {
      buffApplications.push(
        parseBuffApplicationActionSource(child, actionPath, inheritedBlackboard),
      );
      return;
    }
    if (name.startsWith('Check')) {
      conditions.push(parseConditionLeafSource(child, actionPath, inheritedBlackboard));
      return;
    }
    throw new Error(
      `${path}.onEndAction: animation end combat actions are unsupported (${actionPath}: ${JSON.stringify(name)})`,
    );
  });
  return {
    kind: 'playAnimation',
    animationName: requireString(action.animName, `${path}.animName`),
    durationSeconds: requireNumber(action.duration, `${path}.duration`),
    blendOutSeconds: requireNumber(action.blendOut, `${path}.blendOut`),
    playbackSpeed: requireNumber(action.playbackSpeed, `${path}.playbackSpeed`),
    executeOnNormalEndOnly: requireBoolean(
      action.executeOnNormalEndOnly,
      `${path}.executeOnNormalEndOnly`,
    ),
    ...(enabledOnEndActions.length === 0 ? {} : { onEnd: { conditions, buffApplications } }),
  };
}

/** PlayAnimationWithStep 在基础动画外建立短距离步进移动；战斗 IR 只省略表现/空间结果。 */
export function parsePlayAnimationWithStepActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): PlayAnimationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'animName',
      'blendDuration',
      'blendOut',
      'duration',
      'playbackSpeed',
      'useStartTimeBlackboardKey',
      'startTime',
      'startTimeBlackboardKey',
      'exitToIdle',
      'blendOutNextStateHash',
      'onEndAction',
      'executeOnNormalEndOnly',
      'stepTarget',
      'montageName',
      'stepDistance',
      'frameToOriginAnim',
      'stepBlendIn',
      'animBlendInAfterStep',
      'snapFrame',
      'snapDistance',
      'useFixSpeed',
      'speed',
      'speedCurveKey',
      'hideWeapon',
      'hideWeaponFrame',
      'battlePoseWhenStep',
    ]),
    path,
  );
  const onEnd = requireRecord(action.onEndAction, `${path}.onEndAction`);
  requireExactFields(
    onEnd,
    new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
    `${path}.onEndAction`,
  );
  if (
    requireArray(onEnd.actionData, `${path}.onEndAction.actionData`).length > 0 ||
    requireBoolean(
      onEnd.onlyExecuteWhenSourceIsMainChar,
      `${path}.onEndAction.onlyExecuteWhenSourceIsMainChar`,
    ) ||
    requireBoolean(
      onEnd.onlyExecuteWhenSourceIsGuard,
      `${path}.onEndAction.onlyExecuteWhenSourceIsGuard`,
    )
  )
    throw new Error(`${path}.onEndAction: animation end combat actions are unsupported`);
  parseTargetReferenceSource(action.stepTarget, `${path}.stepTarget`);
  for (const key of [
    'blendDuration',
    'blendOut',
    'startTime',
    'stepDistance',
    'stepBlendIn',
    'animBlendInAfterStep',
    'snapDistance',
  ] as const)
    requireNumber(action[key], `${path}.${key}`);
  for (const key of [
    'frameToOriginAnim',
    'snapFrame',
    'blendOutNextStateHash',
    'hideWeaponFrame',
  ] as const)
    requireInteger(action[key], `${path}.${key}`);
  for (const key of [
    'useStartTimeBlackboardKey',
    'exitToIdle',
    'executeOnNormalEndOnly',
    'useFixSpeed',
    'hideWeapon',
    'battlePoseWhenStep',
  ] as const)
    requireBoolean(action[key], `${path}.${key}`);
  requireString(action.startTimeBlackboardKey, `${path}.startTimeBlackboardKey`);
  requireString(action.montageName, `${path}.montageName`);
  parseScalarSource(action.speed, `${path}.speed`, inheritedBlackboard);
  requireString(action.speedCurveKey, `${path}.speedCurveKey`);
  return {
    kind: 'playAnimation',
    animationName: requireString(action.animName, `${path}.animName`),
    durationSeconds: requireNumber(action.duration, `${path}.duration`),
    blendOutSeconds: requireNumber(action.blendOut, `${path}.blendOut`),
    playbackSpeed: requireNumber(action.playbackSpeed, `${path}.playbackSpeed`),
    executeOnNormalEndOnly: requireBoolean(
      action.executeOnNormalEndOnly,
      `${path}.executeOnNormalEndOnly`,
    ),
  };
}

export function parseCameraPresentationActionSource(
  value: unknown,
  path: string,
  kind: CameraPresentationActionSource['kind'],
): CameraPresentationActionSource {
  const action = requireRecord(value, path);
  const fields =
    kind === 'cameraImpulse'
      ? [
          ...ACTION_META_FIELDS,
          'realCameraShake2D',
          'targetSettings',
          'releaseWhenActionEnds',
          '_mountPoint',
          '_boneNode',
          '_positionOffset',
          '_followTarget',
          '_impulseDefinitionData',
        ]
      : kind === 'cameraControlState'
        ? [
            ...ACTION_META_FIELDS,
            'configKey',
            'customPriority',
            'ccsPriority',
            'useCcsCondition',
            'overrideBlendIn',
            'blendInStyle',
            'blendInCustomCurve',
            'blendInTime',
            'overrideBlendOut',
            'blendOutStyle',
            'blendOutCustomCurve',
            'blendOutTime',
            'removeByDuration',
            'ccsDuration',
            'removeByActionEnd',
            'inheritByNextSkill',
            'inheritKey',
            'inheritSkillIds',
            'keepAdditiveParamOnLeave',
          ]
        : [
            ...ACTION_META_FIELDS,
            'debugName',
            'customPriority',
            'ccsPriority',
            'overrideLowerParamsToDefault',
            'useCondition',
            'enterConditionsOr',
            'leaveConditionsOr',
            'blendInStyle',
            'blendInCustomCurve',
            'blendInTime',
            'blendOutStyle',
            'blendOutCustomCurve',
            'blendOutTime',
            'removeByDuration',
            'ccsDuration',
            'removeByActionEnd',
            'useAdditiveParam',
            'additiveHorizontalAngle',
            'additiveVerticalValue',
            'additiveZoomScale',
            'keepAdditiveParamOnLeave',
            'useMinZoom',
            'minZoom',
            'useMaxZoom',
            'maxZoom',
            'useMinVerticalValue',
            'minVerticalValue',
            'useMaxVerticalValue',
            'maxVerticalValue',
            'enableHorizontalAngleLimit',
            'minHorizontalAngle',
            'maxHorizontalAngle',
            'useFovCurve',
            'fovCurve',
            'useScreenYCurve',
            'screenYCurve',
            'useShoulderOffset',
            'shoulderOffset',
            'useAdditionalShoulderOffset',
            'additionalShoulderOffset',
            'useLookAtOffset',
            'lookAtOffset',
            'useAdditionalLookAtOffset',
            'additionalLookAtOffset',
            'useAdditiveFOV',
            'additiveFOV',
          ];
  requireExactFields(action, new Set(fields), path);
  if (kind === 'cameraImpulse')
    parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`);
  return { kind };
}

/** EffectAction 的根路由严格读取；渲染专属配置保留在来源 JSON，不进入无渲染战斗 IR。 */
export function parseEffectActionSource(value: unknown, path: string): EffectActionSource {
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
      'effectSource',
      'useGuardLodSourceOverride',
      'guardLodSource',
      'isMainCharacterActive',
      'isTargetMainCharacterActive',
      'isShowBigEffect',
      'bigEffectName',
      ...(Object.hasOwn(action, 'bigEffectTarget') ? ['bigEffectTarget'] : []),
      'playOnHittableObjects',
      'effectActionCfg',
      'saveEffectIdToBlackboard',
      'forceMainBody',
      'isCreateWithSourceModelActive',
    ]),
    path,
  );
  const config = requireRecord(action.effectActionCfg, `${path}.effectActionCfg`);
  return {
    kind: 'effect',
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    effectSource: parseTargetReferenceSource(action.effectSource, `${path}.effectSource`),
    effectName: requireString(config.effectName, `${path}.effectActionCfg.effectName`),
  };
}

/**
 * combat-spec 1.4.4 的 PlaySoundAction.ExecuteInternal 只解析目标并进入音频播放路径。
 * 来源层仍完整校验已知字段；投影层可据此将它保留为有证据的表现 no-op。
 */
export function parsePlaySoundActionSource(value: unknown, path: string): PlaySoundActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      '_soundEvent',
      '_stopOnEnd',
      '_stopFadeDurationMs',
      '_canInterruptTimeMs',
      '_intrptFadeDurationMs',
      '_jumpToWhenPlayMs',
      '_useTempEmitter',
      'targetSettings',
      'mountPoint',
      'followMountPoint',
      'useWeaponMountPoint',
      'weaponIndex',
      'weaponMountPoint',
      'useTimeDilationPauseAndSeek',
      'timeDilationPauseThreshold',
      'timeDilationSeekThreshold',
      'timeDilationFadeOutDurationMs',
      'timeDilationFadeInDurationMs',
    ]),
    path,
  );
  return {
    kind: 'playSound',
    soundEvent: requireString(action._soundEvent, `${path}._soundEvent`),
    stopOnEnd: requireBoolean(action._stopOnEnd, `${path}._stopOnEnd`),
    stopFadeDurationMilliseconds: requireInteger(
      action._stopFadeDurationMs,
      `${path}._stopFadeDurationMs`,
    ),
    canInterruptTimeMilliseconds: requireInteger(
      action._canInterruptTimeMs,
      `${path}._canInterruptTimeMs`,
    ),
    interruptFadeDurationMilliseconds: requireInteger(
      action._intrptFadeDurationMs,
      `${path}._intrptFadeDurationMs`,
    ),
    jumpToWhenPlayMilliseconds: requireInteger(
      action._jumpToWhenPlayMs,
      `${path}._jumpToWhenPlayMs`,
    ),
    useTemporaryEmitter: requireBoolean(action._useTempEmitter, `${path}._useTempEmitter`),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    mountPoint: parseMountPoint(action.mountPoint, `${path}.mountPoint`),
    followMountPoint: requireBoolean(action.followMountPoint, `${path}.followMountPoint`),
    useWeaponMountPoint: requireBoolean(action.useWeaponMountPoint, `${path}.useWeaponMountPoint`),
    weaponIndex: requireInteger(action.weaponIndex, `${path}.weaponIndex`),
    weaponMountPoint: parseMountPoint(action.weaponMountPoint, `${path}.weaponMountPoint`),
    useTimeDilationPauseAndSeek: requireBoolean(
      action.useTimeDilationPauseAndSeek,
      `${path}.useTimeDilationPauseAndSeek`,
    ),
    timeDilationPauseThreshold: requireNumber(
      action.timeDilationPauseThreshold,
      `${path}.timeDilationPauseThreshold`,
    ),
    timeDilationSeekThreshold: requireNumber(
      action.timeDilationSeekThreshold,
      `${path}.timeDilationSeekThreshold`,
    ),
    timeDilationFadeOutDurationMilliseconds: requireInteger(
      action.timeDilationFadeOutDurationMs,
      `${path}.timeDilationFadeOutDurationMs`,
    ),
    timeDilationFadeInDurationMilliseconds: requireInteger(
      action.timeDilationFadeInDurationMs,
      `${path}.timeDilationFadeInDurationMs`,
    ),
  };
}

function parseMountPoint(value: unknown, path: string): string | number {
  return typeof value === 'number' ? requireInteger(value, path) : requireString(value, path);
}

/** 1.4.4 原生 fallback 直接返回 true，不读取 bbKey；完整保存载荷，见 combat-spec/docs/combo-condition-leaves.md。 */
export function parseDebugPrintActionSource(value: unknown, path: string): DebugPrintActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'logType',
      'target',
      'color',
      'bbKey',
      'identifier',
    ]),
    path,
  );
  const color = requireRecord(action.color, `${path}.color`);
  const vectorLayout = Object.hasOwn(color, 'x');
  requireExactFields(
    color,
    vectorLayout ? new Set(['x', 'y', 'z', 'w']) : new Set(['r', 'g', 'b', 'a']),
    `${path}.color`,
  );
  const colorFields = vectorLayout
    ? { r: 'x', g: 'y', b: 'z', a: 'w' }
    : { r: 'r', g: 'g', b: 'b', a: 'a' };
  return {
    kind: 'debugPrint',
    logType:
      typeof action.logType === 'number'
        ? requireInteger(action.logType, `${path}.logType`)
        : requireString(action.logType, `${path}.logType`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    color: {
      r: requireNumber(color[colorFields.r], `${path}.color.${colorFields.r}`),
      g: requireNumber(color[colorFields.g], `${path}.color.${colorFields.g}`),
      b: requireNumber(color[colorFields.b], `${path}.color.${colorFields.b}`),
      a: requireNumber(color[colorFields.a], `${path}.color.${colorFields.a}`),
    },
    blackboardKey: requireString(action.bbKey, `${path}.bbKey`),
    identifier: requireString(action.identifier, `${path}.identifier`),
  };
}
