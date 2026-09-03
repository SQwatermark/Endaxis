export function targetFixture(
  targetSource: string,
  selectorData: Record<string, unknown> = {
    validatorData: [],
    postProcessorData: [],
  },
  targetGroupKey = '',
): Record<string, unknown> {
  return {
    targetSource,
    targetGroupKey,
    selectorOwner: 'ActionOwner',
    ownerContextKey: '',
    centerType: 'ActionSource',
    centerContextKey: '',
    centerToGround: false,
    selectorData,
    enableAdvancedDirection: false,
    advancedDirection: {},
    selectorDirection: 'SourceForward',
    target: 'ActionSource',
    targetContextKey: '',
  };
}

export function scalarFixture(value: number, blackboardKey = ''): Record<string, unknown> {
  return {
    value,
    useBlackboardKey: blackboardKey.length > 0,
    blackboardKey,
  };
}

export function abilityEntityFixture(): Record<string, unknown> {
  return {
    gameId: 'abilityentity_fixture',
    factionNativeValue: 2,
    bornTagIds: [-1, 2],
    lifeTypeNativeValue: 0,
    durationSeconds: 45,
    durationBlackboard: {
      useBlackboardKey: true,
      value: 0,
      blackboardKey: 'EntityBB_duration',
    },
    maxDurationForServerSeconds: 60,
    maxStackingCount: 5,
    maxStackingCountBlackboard: {
      useBlackboardKey: true,
      value: 18,
      blackboardKey: 'EntityBB_limit',
    },
    delayToRecycleSeconds: 0,
    delayRecyclePerformSeconds: 0,
    sendDieEvent: false,
    enableBornFadeIn: false,
    fadeInSeconds: 1,
    componentCount: 4,
    managedReferenceCount: 6,
    rootRid: 8194869126427837000,
  };
}

export function activeSkillFixture(
  skillId = 'active_fixture',
  castType = 'Active',
): Record<string, unknown> {
  return {
    actionGroupData: { timelineActions: [], passiveEventActions: [] },
    aiExclusiveFrame: 0,
    attackRangeType: 'Default',
    blackboard: [{ key: 'attack_scale', valueDouble: 1, valueStr: '', isDynamic: false }],
    buffs: [],
    buffInputBase: null,
    canCastInAir: false,
    canCastInWater: false,
    canDummyCast: false,
    canMove: false,
    cardAttributeModifier: { attributeModifiers: [], isConvertedAttribute: false },
    castData: {},
    castType,
    characterReturnToIdle: false,
    comboSkillUIBigSpriteName: '',
    comboSkillUISpriteName: '',
    dontInterruptCombo: false,
    dummyPositionOffset: { x: 0, y: 0, z: 0 },
    durationFrame: 30,
    exclusiveFrame: 30,
    hittableAttackRange: 0,
    iconBgType: 'Default',
    iconId: '',
    level: 1,
    needEnemyOutOfScreenWarning: false,
    needEnemyOutOfScreenWarningOverrideValue: false,
    offsetRecordFrame: 0,
    overrideHittableObjAttackRange: false,
    overrideNeedEnemyOutOfScreenWarning: false,
    passiveSkillType: 'AddBuff',
    rootMotionCliffCheck: false,
    selectStrategy: 'SelectObject',
    showNotRecommendState: false,
    skillHighlightCondition: {},
    skillId,
    skillName: '',
    skillSpecification: 'Default',
    skillTags: { predefinedTag: [] },
    smartTargetBuffFindSettings: {},
    smartTargetBuffIds: [],
    smartTargetSelectStrategy: 'SelectComboSkillTarget',
    smartTargetTagQuery: {},
    switchToBuffConfig: {
      condition: {},
      buffs: [],
      buffSource: {},
      targets: {},
      asSkillCast: false,
    },
    switchToCenterBeforeCast: false,
    tagDuringAttach: {},
    toggleBuffs: [],
    uiRangeHints: [],
    useAIExclusiveFrame: false,
  };
}

/** 为公共 SkillData/领域连接测试提供同一份严格目标组动作，避免各测试复制原生字段形状。 */
export function activeSkillWithOwnerSpawnedAbilityEntityQueryFixture(
  skillId = 'active_fixture',
): Record<string, unknown> {
  const skill = activeSkillFixture(skillId);
  skill.actionGroupData = {
    timelineActions: [
      {
        _startFrame: 10,
        _endFrame: 20,
        _sequenceActionData: {
          actionData: [ownerSpawnedAbilityEntityFindTargetActionFixture()],
          onlyExecuteWhenSourceIsMainChar: false,
          onlyExecuteWhenSourceIsGuard: false,
        },
        forceSyncAnimData: {
          forceSync: false,
          montageName: '',
          targetFrame: 0,
          playbackSpeed: 0,
        },
      },
    ],
    passiveEventActions: [],
  };
  return skill;
}

export function ownerSpawnedAbilityEntityFindTargetActionFixture(): Record<string, unknown> {
  return {
    $type: 'Example.FindTargetAction+Data, Example',
    isEnable: true,
    priorityLevel: 'Default',
    priorityOffset: 0,
    serverActionIndex: 7,
    targetGroupKey: 'entities',
    center: 'ActionSource',
    centerContextKey: '',
    useCenterEntityMountPoint: false,
    centerMountPoint: 'None',
    centerToGround: false,
    selectorOwner: 'ActionOwner',
    selectorOwnerContextKey: '',
    selectorData: {
      finderData: {
        $type: 'Example.Selector+OwnerSpawnedEntityFinder+Data, Example',
        spawnedObjectType: 'AbilityEntity',
      },
      validatorData: [
        {
          $type: 'Example.Selector+TagValidator+Data, Example',
          query: { queryType: 'HasAny', tags: [{ tagId: 321 }] },
        },
      ],
      postProcessorData: [],
    },
    selectorDirection: 'SourceForward',
    target: 'ActionSource',
    contextKey: '',
    useAdvancedDirectionSetting: false,
    advancedSelectorDirection: {},
  };
}
