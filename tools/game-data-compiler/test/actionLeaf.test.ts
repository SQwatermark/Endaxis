import { describe, expect, it } from 'vitest';

import {
  parseKnownNativeActionLeafSource,
  parseKnownNativeActionSequenceSource,
} from '../src/index.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

const META = {
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
} as const;

describe('公共 Action 叶子分派', () => {
  it('ConvertToTargetContext 完整保留 None 复制与未启用的空间字段', () => {
    const convertFrom = targetFixture(
      'InstantSearch',
      {
        finderData: { $type: 'Example.Selector+MainTargetFinder+Data, Example' },
        validatorData: [],
        postProcessorData: [],
      },
      'trigger',
    );
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Beyond.Gameplay.Core.ConvertToTargetContext+Data, Gameplay.Beyond',
          convertFrom,
          targetGroupKey: 'trigger',
          operationType: 'None',
          translateOperation: 'Rotate180DegAroundRef',
          translationRef: 'ActionSource',
          translationDeg: 0,
          excludeTarget: 'ActionSource',
          blackboardVector3: {
            x: scalarFixture(0),
            y: scalarFixture(0),
            z: scalarFixture(0),
          },
        },
        'fixture.convert',
        {},
      ),
    ).toMatchObject({
      family: 'targetGroup',
      action: {
        producerType: 'ConvertToTargetContext',
        targetGroupKey: 'trigger',
        finderType: 'MainTargetFinder',
        conversionOperation: 'None',
        conversionTransform: {
          translateOperation: 'Rotate180DegAroundRef',
          translationRef: 'ActionSource',
          translationDegrees: 0,
          excludeTarget: 'ActionSource',
          vector: {
            x: { useBlackboardKey: false, value: 0, blackboardKey: '' },
          },
        },
      },
    });
  });

  it('ConvertToTargetContext 接受已闭环的实体转位置分支并拒绝未知空间操作', () => {
    const action = {
      ...META,
      $type: 'Beyond.Gameplay.Core.ConvertToTargetContext+Data, Gameplay.Beyond',
      convertFrom: targetFixture('Target'),
      targetGroupKey: 'center',
      operationType: 'ConvertEntityToPosition',
      translateOperation: 'Rotate180DegAroundRef',
      translationRef: 'ActionSource',
      translationDeg: 0,
      excludeTarget: 'ActionSource',
      blackboardVector3: {
        x: scalarFixture(0),
        y: scalarFixture(0),
        z: scalarFixture(0),
      },
    };
    expect(parseKnownNativeActionLeafSource(action, 'fixture.convert', {})).toMatchObject({
      family: 'targetGroup',
      action: {
        producerType: 'ConvertToTargetContext',
        conversionOperation: 'ConvertEntityToPosition',
        inputTargets: [{ targetSource: 'Target' }],
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...action, operationType: 'TranslatePosition' },
        'fixture.convert',
        {},
      ),
    ).toThrow('unsupported operation "TranslatePosition"');
  });

  it('CreateBuffAttachingSkill 复用公共 Buff 载荷并保留当前施放技能生命周期', () => {
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Example.CreateBuffAttachingSkill+Data, Example',
          buffs: [
            {
              buffId: 'buff.weapon.during-skill',
              assignBlackboard: false,
              assignItems: [],
              readIdFromBlackboard: false,
              buffIdKey: '',
            },
          ],
          count: scalarFixture(1),
          targetSettings: targetFixture('Owner'),
          buffSource: 'ActionSource',
          contextKey: '',
          autoFinishByAction: false,
          inheritSkillIdList: [],
          finishWithNextSkillIfNotInherited: true,
          asChildBuff: false,
          inheritSourceSkillCastId: false,
          inheritSourceSkillCastInfo: true,
          isExtra: false,
          passTargetGroupsToBuff: false,
          overrideBuffIconDuration: false,
          buffIconDurationSource: {
            m_abilityEntityTypeInfo: 'editor hint',
            m_timedMarkerInfo: 'editor hint',
            durationSourceType: 'AbilityEntity',
            timedMarkerId: '',
          },
        },
        'fixture.createBuffAttachingSkill',
        {},
      ),
    ).toMatchObject({
      family: 'buffApplication',
      action: {
        kind: 'buffApplication',
        lifetimeOwner: 'currentCastSkill',
        buffs: [{ buffId: 'buff.weapon.during-skill' }],
      },
    });
  });

  it('SaveCharTypeId 进入公共角色表身份读取 IR', () => {
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Example.SaveCharTypeId+Data, Example',
          target: targetFixture('Owner'),
          storeKey: 'owner_char_type',
        },
        'fixture.characterTypeId',
        {},
      ),
    ).toMatchObject({
      family: 'characterIdentity',
      action: {
        kind: 'characterTypeIdRead',
        target: { targetSource: 'Owner', targetGroupKey: '' },
        outputKey: 'owner_char_type',
      },
    });
  });

  it('控制流和叶子使用同一入口，不由领域适配器再次解释类型', () => {
    const parsed = parseKnownNativeActionSequenceSource(
      sequence([
        {
          ...META,
          $type: 'Example.IfElseAction+IfElseActionData, Example',
          conditionAction: sequence([
            {
              ...META,
              $type: 'Example.CompareFloat+Data, Example',
              compare: 'Greater',
              valueA: scalarFixture(0, 'talent'),
              valueB: scalarFixture(0.5),
            },
          ]),
          succeedActions: sequence([
            {
              ...META,
              serverActionIndex: 2,
              $type: 'Example.CastSkill+Data, Example',
              caster: targetFixture('Owner'),
              target: targetFixture('Target'),
              skillId: { value: 'fixture_child', useBlackboardKey: false, blackboardKey: '' },
              skipApplyCost: true,
              inheritSourceSkillCastId: true,
            },
          ]),
          failActions: sequence([]),
          alwaysNext: true,
        },
      ]),
      'fixture.sequence',
      { talent: [0, 1] },
    );
    expect(parsed.actions[0]?.body).toMatchObject({
      kind: 'ifElse',
      condition: {
        actions: [
          {
            body: {
              kind: 'leaf',
              value: {
                family: 'condition',
                action: { kind: 'floatCompare', left: { levelValues: [0, 1] } },
              },
            },
          },
        ],
      },
      whenTrue: {
        actions: [
          {
            body: {
              value: { family: 'skillCast', action: { skillId: { value: 'fixture_child' } } },
            },
          },
        ],
      },
    });
  });

  it('未迁移动作携带路径明确阻塞', () => {
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...META, $type: 'Example.UnknownCombatAction+Data, Example' },
        'fixture.unknown',
        {},
      ),
    ).toThrow('fixture.unknown.$type: unsupported native action "UnknownCombatAction"');
  });

  it('TriggerComboSkillAction 严格保留 Pending 目标并拒绝会传给连携施法的黑板', () => {
    const action = {
      ...META,
      $type: 'Beyond.Gameplay.Core.TriggerComboSkillAction+Data, Gameplay.Beyond',
      owner: targetFixture('Context', undefined, 'seraph'),
      target: targetFixture('InstantSearch', {
        finderData: { $type: 'Example.Selector+MainTargetFinder+Data, Example' },
        validatorData: [],
        postProcessorData: [],
      }),
      needTrigger: false,
      trigger: targetFixture('Target'),
      assignItems: [],
    };
    expect(parseKnownNativeActionLeafSource(action, 'fixture.comboPending', {})).toMatchObject({
      family: 'comboPending',
      action: {
        kind: 'comboPending',
        needTrigger: false,
        assignmentCount: 0,
        owner: { targetSource: 'Context', targetGroupKey: 'seraph' },
        target: { targetSource: 'InstantSearch', finderType: 'MainTargetFinder' },
        trigger: { targetSource: 'Target' },
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...action, assignItems: [{}] },
        'fixture.comboPending',
        {},
      ),
    ).toThrow('combo Pending blackboard assignments are unsupported');
  });

  it('CustomRootMotionAction 严格保留目标、动画与移动区间载荷', () => {
    const source = {
      ...META,
      $type: 'Beyond.Gameplay.Core.CustomRootMotionAction+Data, Gameplay.Beyond',
      moveTo: targetFixture('Target', undefined, 'MainTar'),
      animKey: 'ComboSkill',
      rootMotionCurveMask: 'PosZ',
      scaleX: scalarFixture(1),
      scaleY: scalarFixture(1),
      enableScaleZWithDistanceCurve: false,
      distance2ScaleZ: [
        {
          time: 0,
          value: 1,
          inTangent: 0,
          outTangent: 0,
          inWeight: 0,
          outWeight: 0,
          weightedMode: 0,
        },
      ],
      scaleZ: scalarFixture(1.5),
      blockRadius: scalarFixture(1),
      useExtraBlockRadiusForInt: false,
      extraRadiusForInt: scalarFixture(1.5),
      enableMaxDistanceCheckWhenMoveBack: false,
      maxDistanceWhenMoveBack: scalarFixture(5),
      updateDir: true,
      startOffsetFrame: 6,
      playbackSpeed: scalarFixture(1),
      stopByCliff: true,
      ignoreAllCollision: false,
      ignoreCollisionLayer: {},
    };
    expect(parseKnownNativeActionLeafSource(source, 'fixture.rootMotion', {})).toMatchObject({
      family: 'spatial',
      action: {
        kind: 'customRootMotion',
        target: { targetSource: 'Target', targetGroupKey: 'MainTar' },
        animationKey: 'ComboSkill',
        rootMotionCurveMask: 'PosZ',
        updateDirection: true,
        startOffsetFrame: 6,
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...source, unknownCombatField: true },
        'fixture.rootMotion',
        {},
      ),
    ).toThrow('fixture.rootMotion: unexpected fields');
  });

  it('DisableRootMotionAction 只接受无额外载荷的原生形状', () => {
    const source = {
      ...META,
      $type: 'Beyond.Gameplay.Core.DisableRootMotionAction+Data, Gameplay.Beyond',
    };
    expect(parseKnownNativeActionLeafSource(source, 'fixture.disableRootMotion', {})).toEqual({
      family: 'spatial',
      action: { kind: 'disableRootMotion' },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...source, guessedDuration: 1 },
        'fixture.disableRootMotion',
        {},
      ),
    ).toThrow('fixture.disableRootMotion: unexpected fields');
  });

  it('SpellInfliction 严格保留来源、目标、元素与额外附着标记', () => {
    const source = {
      ...META,
      $type: 'Beyond.Gameplay.Core.SpellInfliction+Data, Gameplay.Beyond',
      source: targetFixture('Source'),
      target: targetFixture('Context', undefined, 'tar'),
      inflictionType: 'Fire',
      isExtra: false,
    };
    expect(parseKnownNativeActionLeafSource(source, 'fixture.infliction', {})).toMatchObject({
      family: 'elementalInfliction',
      action: {
        kind: 'elementalInfliction',
        source: { targetSource: 'Source', targetGroupKey: '' },
        target: { targetSource: 'Context', targetGroupKey: 'tar' },
        element: 'Fire',
        isExtra: false,
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...source, inflictionType: 'Imaginary' },
        'fixture.infliction',
        {},
      ),
    ).toThrow('fixture.infliction.inflictionType: unsupported elemental infliction');
  });

  it('TeleportPosSelectAction 完整保留选点策略和上下文写入', () => {
    const source = {
      ...META,
      $type: 'Beyond.Gameplay.Core.TeleportPosSelectAction+Data, Gameplay.Beyond',
      targetSettings: targetFixture('Target'),
      teleportType: 'FixedDistance',
      fixDistanceData: {
        excludeCurrentPos: false,
        distance: scalarFixture(3),
        useAddScoreToPrevSide: false,
      },
      rangedData: { forwardDistance: scalarFixture(0) },
      contextKey: 'smartpos',
    };
    expect(parseKnownNativeActionLeafSource(source, 'fixture.teleportPosition', {})).toMatchObject({
      family: 'spatial',
      action: {
        kind: 'teleportPositionSelection',
        target: { targetSource: 'Target' },
        teleportType: 'FixedDistance',
        excludeCurrentPosition: false,
        distance: { value: 3, blackboardKey: null },
        useAddScoreToPreviousSide: false,
        forwardDistance: { value: 0, blackboardKey: null },
        outputContextKey: 'smartpos',
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...source, teleportType: 'UnknownMode' },
        'fixture.teleportPosition',
        {},
      ),
    ).toThrow('fixture.teleportPosition.teleportType: unsupported teleport position selection');
  });

  it('SaveTargetDistanceAction 保留真实端点和黑板输出键', () => {
    const source = {
      ...META,
      $type: 'Beyond.Gameplay.Core.SaveTargetDistanceAction+Data, Gameplay.Beyond',
      source: targetFixture('Context', undefined, 'mainchar'),
      target: targetFixture('Owner'),
      bbKey: 'owner_mainchar_distance',
    };
    expect(parseKnownNativeActionLeafSource(source, 'fixture.distance', {})).toMatchObject({
      family: 'spatialMeasurement',
      action: {
        kind: 'saveTargetDistance',
        source: { targetSource: 'Context', targetGroupKey: 'mainchar' },
        target: { targetSource: 'Owner', targetGroupKey: '' },
        outputKey: 'owner_mainchar_distance',
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...source, unknownDistanceField: true },
        'fixture.distance',
        {},
      ),
    ).toThrow('fixture.distance: unexpected fields');
  });

  it('PlayAnimationWithStep 保留动画身份并严格读取步进载荷', () => {
    const source = {
      ...META,
      $type:
        'Beyond.Gameplay.Core.PlayAnimationWithStep+PlayAnimationWithStepData, Gameplay.Beyond',
      animName: 'Attack02',
      blendDuration: 0.1,
      blendOut: 1,
      duration: 7.4666667,
      playbackSpeed: 1,
      useStartTimeBlackboardKey: false,
      startTime: 0,
      startTimeBlackboardKey: '',
      exitToIdle: false,
      blendOutNextStateHash: 0,
      onEndAction: {
        actionData: [],
        onlyExecuteWhenSourceIsMainChar: false,
        onlyExecuteWhenSourceIsGuard: false,
      },
      executeOnNormalEndOnly: false,
      stepTarget: targetFixture('Target'),
      montageName: 'BattleStepR',
      stepDistance: 2.5,
      frameToOriginAnim: 3,
      stepBlendIn: 0.067,
      animBlendInAfterStep: 0.1,
      snapFrame: 6,
      snapDistance: 1.5,
      useFixSpeed: false,
      speed: scalarFixture(15),
      speedCurveKey: '默认近战普攻',
      hideWeapon: false,
      hideWeaponFrame: 6,
      battlePoseWhenStep: false,
    };
    expect(parseKnownNativeActionLeafSource(source, 'fixture.stepAnimation', {})).toMatchObject({
      family: 'presentation',
      action: { kind: 'playAnimation', animationName: 'Attack02', durationSeconds: 7.4666667 },
    });
  });

  it('PushBackAction 与 BreakInteractiveAction 分别保留木桩控制和场景旁路身份', () => {
    const curve = [
      {
        time: 0,
        value: 1,
        inTangent: 0,
        outTangent: 0,
        inWeight: 0,
        outWeight: 0,
        weightedMode: 0,
      },
    ];
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Beyond.Gameplay.Core.PushBackAction+Data, Gameplay.Beyond',
          attackerTargetSettings: targetFixture('Source'),
          sourcePointSettings: targetFixture('Source'),
          targetSettings: targetFixture('Target'),
          pushBackDirection: 'SourceToTarget',
          pushBackDistance: scalarFixture(0),
          distanceCurveEnabled: false,
          curveOriginUseSourcePoint: false,
          distanceCurve: curve,
          distanceUseScale: true,
          timeUseScale: true,
          unmovableUseScale: true,
          pushBackTime: scalarFixture(0.2),
          unmovableTime: scalarFixture(1.5),
          useCustomCurve: false,
          customCurve: curve,
          curveTemplate: 'EaseInOut',
        },
        'fixture.pushBack',
        {},
      ),
    ).toMatchObject({
      family: 'stumpControl',
      action: { kind: 'pushBack' },
    });
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Beyond.Gameplay.Core.AbilityActions.BreakInteractiveAction+Data, Gameplay.Beyond',
          attacker: 'ActionSource',
          damageType: 'Physical',
          atkCalculation: {
            $type: 'Beyond.Gameplay.Core.DefiniteValueCalculation, Gameplay.Beyond',
            value: scalarFixture(15),
            applyScale: false,
            valueScale: scalarFixture(0),
          },
          damageProcessors: [],
          targetInteractives: targetFixture('Target'),
        },
        'fixture.breakInteractive',
        {},
      ),
    ).toMatchObject({
      family: 'environment',
      action: { kind: 'breakInteractive', damageType: 'Physical' },
    });
  });

  it('BlowOffEnemyAction 严格保留死亡过滤，ChannelingCastingAction 保留输入限制区间', () => {
    const blowOff = {
      ...META,
      $type: 'Beyond.Gameplay.Core.BlowOffEnemyAction+Data, Gameplay.Beyond',
      attackerTargetSettings: targetFixture('Owner'),
      targetSettings: targetFixture('Context', undefined, 'tar'),
      blowOffDistance: scalarFixture(3.2),
      distanceRandomRange: scalarFixture(0.2),
      overwriteHeight: false,
      blowOffHeight: scalarFixture(0),
      directionSettings: {
        directionType: 'SourceToTarget',
        sourceMountPoint: 'None',
        targetMountPoint: 'None',
        customSourceAndTarget: false,
        clampToXZ: true,
        invertDirection: false,
      },
      totalTime: scalarFixture(0),
      isExtra: false,
      deadOption: 'OnlyDead',
    };
    expect(parseKnownNativeActionLeafSource(blowOff, 'fixture.blowOff', {})).toMatchObject({
      family: 'stumpControl',
      action: { kind: 'blowOffEnemy', deadOption: 'OnlyDead' },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...blowOff, undocumentedFlag: true },
        'fixture.blowOff',
        {},
      ),
    ).toThrow('undocumentedFlag');

    const channeling = {
      ...META,
      $type: 'Beyond.Gameplay.Core.ChannelingCastingAction+Data, Gameplay.Beyond',
      cantSwitchPosition: true,
      cantSwitchToCenter: false,
      duration: scalarFixture(3.7),
      cantCastSkill: true,
    };
    expect(parseKnownNativeActionLeafSource(channeling, 'fixture.channeling', {})).toMatchObject({
      family: 'castingControl',
      action: {
        kind: 'channelingCasting',
        cantSwitchPosition: true,
        cantSwitchToCenter: false,
        cantCastSkill: true,
        duration: { value: 3.7, blackboardKey: null },
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...channeling, undocumentedFlag: true },
        'fixture.channeling',
        {},
      ),
    ).toThrow('undocumentedFlag');
  });

  it('SnapToTargetWithRangeAction 严格保留贴近目标的空间载荷', () => {
    const curve = [
      {
        time: 0,
        value: 1,
        inTangent: 0,
        outTangent: 0,
        inWeight: 0,
        outWeight: 0,
        weightedMode: 0,
      },
    ];
    const source = {
      ...META,
      $type: 'Beyond.Gameplay.Core.SnapToTargetWithRangeAction+Data, Gameplay.Beyond',
      moveTo: targetFixture('Target'),
      fixPositionWhenStart: false,
      radius: scalarFixture(1),
      moveType: 'FixedSpeed',
      needRotate: true,
      useFixSpeed: true,
      speed: scalarFixture(20),
      fixedSpeedCurveKey: '默认近战普攻',
      speedCurve: curve,
      positionCurve: curve,
      totalTime: 0.1,
      rootMotionAnimKey: '',
      rootMotionMaxDistance: 0,
      chargePriority: 'Normal',
    };
    expect(parseKnownNativeActionLeafSource(source, 'fixture.snap', {})).toMatchObject({
      family: 'spatial',
      action: {
        kind: 'snapToTargetWithRange',
        target: { targetSource: 'Target' },
        radius: { value: 1, blackboardKey: null },
        moveType: 'FixedSpeed',
        needRotate: true,
        totalTime: 0.1,
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...source, unknownMovementField: true },
        'fixture.snap',
        {},
      ),
    ).toThrow('fixture.snap: unexpected fields');
  });

  it('SaveBuffStackNumAdvanced 进入公共 Buff 查询 IR', () => {
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Example.SaveBuffStackNumAdvanced+Data, Example',
          checkTarget: targetFixture('Target'),
          buffSettings: {
            checkType: 'Tag',
            buffIdList: [],
            tagQuery: { queryType: 'HasAny', tags: [{ tagId: 1075718177 }] },
          },
          buffStackNumType: 'BuffCount',
          limitSkillCastId: false,
          key: 'physical_layers',
        },
        'fixture.buffStackRead',
        {},
      ),
    ).toMatchObject({
      family: 'buffQuery',
      action: {
        target: { targetSource: 'Target' },
        checkType: 'Tag',
        buffTagIds: [1075718177],
        countType: 'BuffCount',
        outputKey: 'physical_layers',
      },
    });
  });

  it('SaveBuffLifeTime 严格保留当前 Buff 剩余时长查询', () => {
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Beyond.Gameplay.Core.SaveBuffLifeTime+Data, Gameplay.Beyond',
          buffOwner: targetFixture('Owner'),
          buffSettings: {
            checkType: 'Environment',
            buffIdList: [],
            tagQuery: { queryType: 'HasAny', tags: [] },
          },
          key: 'duration_dynamic',
        },
        'fixture.buffLifeTimeRead',
        {},
      ),
    ).toMatchObject({
      family: 'buffLifeTimeRead',
      action: {
        owner: { targetSource: 'Owner' },
        settings: { checkType: 'Environment', buffIds: [], tagQuery: { tagIds: [] } },
        outputKey: 'duration_dynamic',
      },
    });
  });

  it('SetBuffDurationAction 严格保留当前 Buff 时长运算', () => {
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Beyond.Gameplay.Core.SetBuffDurationAction+Data, Gameplay.Beyond',
          targetSettings: targetFixture('Owner'),
          buffSettings: {
            checkType: 'Environment',
            buffIdList: [],
            tagQuery: { queryType: 'HasAny', tags: [] },
          },
          operationType: 'Assign',
          value: scalarFixture(0, 'duration_dynamic'),
          isFinishedEarly: false,
        },
        'fixture.buffDurationMutation',
        { duration_dynamic: [0, 0] },
      ),
    ).toMatchObject({
      family: 'buffDurationMutation',
      action: {
        target: { targetSource: 'Owner' },
        operation: 'Assign',
        value: { blackboardKey: 'duration_dynamic' },
        isFinishedEarly: false,
      },
    });
  });

  it('严格保留 PlaySoundAction 的表现身份和音频时序字段', () => {
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Beyond.Gameplay.Core.PlaySoundAction+PlaySoundActionData, Gameplay.Beyond',
          _soundEvent: 'au_int_cure_one',
          _stopOnEnd: false,
          _stopFadeDurationMs: 100,
          _canInterruptTimeMs: 0,
          _intrptFadeDurationMs: 100,
          _jumpToWhenPlayMs: 0,
          _useTempEmitter: false,
          targetSettings: targetFixture('Owner'),
          mountPoint: 'None',
          followMountPoint: false,
          useWeaponMountPoint: false,
          weaponIndex: 0,
          weaponMountPoint: 'Root',
          useTimeDilationPauseAndSeek: false,
          timeDilationPauseThreshold: 0.7,
          timeDilationSeekThreshold: 0.4,
          timeDilationFadeOutDurationMs: 500,
          timeDilationFadeInDurationMs: 100,
        },
        'fixture.playSound',
        {},
      ),
    ).toMatchObject({
      family: 'presentation',
      action: {
        kind: 'playSound',
        soundEvent: 'au_int_cure_one',
        target: { targetSource: 'Owner' },
        timeDilationPauseThreshold: 0.7,
      },
    });
  });

  it('严格保留处决目标技力基值的来源、目标和倍率', () => {
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Beyond.Gameplay.Core.GainBreakingAttackAtb+Data, Gameplay.Beyond',
          source: targetFixture('Source'),
          target: targetFixture('Target'),
          factor: scalarFixture(1),
        },
        'fixture.gainBreakingAttackAtb',
        {},
      ),
    ).toMatchObject({
      family: 'finisherSpGain',
      action: {
        kind: 'finisherSpGain',
        source: { targetSource: 'Source' },
        target: { targetSource: 'Target' },
        factor: { value: 1, blackboardKey: null },
      },
    });
  });

  it('LockCameraAimAction 完整解析镜头读取键后仍只进入表现 IR', () => {
    expect(
      parseKnownNativeActionLeafSource(lockCameraAimFixture(), 'fixture.lockCameraAim', {
        camera_min: [-40, -40],
      }),
    ).toMatchObject({
      family: 'presentation',
      action: { kind: 'lockCameraAim', readBlackboardKeys: ['camera_min'] },
    });
  });

  it('ImmuneTextAction 严格解析文字挂点后只进入表现 IR', () => {
    expect(
      parseKnownNativeActionLeafSource(
        {
          ...META,
          $type: 'Beyond.Gameplay.Core.ImmuneTextAction+Data, Gameplay.Beyond',
          targetSettings: targetFixture('Owner'),
          mountPoint: 'VBHit',
          offset: { x: 0, y: 0 },
          textId: 'ui_bat_immune_damage',
          forceMainBody: false,
        },
        'fixture.immuneText',
        {},
      ),
    ).toEqual({ family: 'presentation', action: { kind: 'immuneText' } });
  });
});

function sequence(actionData: unknown[]): Record<string, unknown> {
  return {
    actionData,
    onlyExecuteWhenSourceIsMainChar: false,
    onlyExecuteWhenSourceIsGuard: false,
  };
}

function lockCameraAimFixture(): Record<string, unknown> {
  const vector = { x: 0, y: 1, z: 0 };
  return {
    ...META,
    $type: 'Beyond.Gameplay.Core.LockCameraAimAction+LockCameraAimActionData, Gameplay.Beyond',
    ccsPriority: 20,
    overrideLowerParamsToDefault: false,
    angleThreshold: 180,
    forceFollowMainChar: true,
    blendInStyle: 'Linear',
    blendInCustomCurve: [],
    blendInTime: 0.2,
    blendOutStyle: 'EaseInOut',
    blendOutCustomCurve: [],
    blendOutTime: 1,
    horizontalBaseAngleMin: -40,
    horizontalBaseAngleMinBB: scalarFixture(-1000, 'camera_min'),
    horizontalBaseAngleMax: -40,
    horizontalBaseAngleMaxBB: scalarFixture(-1000),
    verticalRelativeToTarget: false,
    verticalBaseValue: 0.35,
    verticalBaseValueBB: scalarFixture(-1000),
    verticalBaseValueMin: 0.3,
    verticalBaseValueMinBB: scalarFixture(-1000),
    verticalBaseValueMax: 0.5,
    verticalBaseValueMaxBB: scalarFixture(-1000),
    dampingTime: 1,
    horizontalSpeedFactor: 0.05,
    verticalSpeedFactor: 0.05,
    horizontalTweenSpeed: 4,
    verticalTweenSpeed: 1,
    allowAimZones: false,
    useExitParam: true,
    exitParamOnlyOnComplete: false,
    exitParam: {
      applyHorizontalAngle: false,
      horizontalAngleRelativeToCharacter: false,
      horizontalAngle: 0,
      applyVerticalValue: true,
      verticalValue: 0.6,
      applyZoomScale: true,
      zoomScale: 0.7,
    },
    disablePlayerInputOnBlendIn: false,
    disablePlayerInputOnBlendOut: false,
    disablePlayerInputInState: false,
    cancelOnDrag: false,
    cancelOnBeHit: false,
    cancelOnMove: false,
    overrideTarget1: true,
    useMainCharYForTarget1: false,
    targetSettings: targetFixture('Source'),
    mountPoint1: 'None',
    overrideLookAtOffset: true,
    lookAtOffset: vector,
    overrideTarget2: true,
    useMainCharYForTarget2: false,
    targetSettings2: targetFixture('Target'),
    mountPoint2: 'None',
    overrideLookAt2Offset: true,
    lookAt2Offset: vector,
    lookAt2OffsetWhenNoOverride: vector,
    targetAlpha: 0.618,
  };
}
