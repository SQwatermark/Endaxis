import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { describe, expect, it } from 'vitest';

import { compileBuffLeafNode } from '../src/compiler/combatEntityAndTimeProjection.ts';
import { compileEventCondition } from '../src/compiler/combatConditionProjection.ts';
import type { CombatActionProjectionContextSource } from '../src/compiler/combatProjectionCommon.ts';
import { parseKnownNativeActionLeafSource } from '../src/source/actionLeaf.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

const META = {
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
} as const;

const ACTIVE_SKILL_CONTEXT: CombatActionProjectionContextSource = {
  gameplayTagRegistry: fixtureGameplayTagRegistry,
  actionOwnerTarget: 'caster',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'enemy',
  staticEnemyTargetGroupKeys: new Set(['tar']),
};

function node(value: ReturnType<typeof parseKnownNativeActionLeafSource>) {
  return {
    sourcePath: 'fixture.action',
    metadata: {
      nativeType: 'Example.fixture+Data, Example',
      nativeName: 'fixture',
      enabled: true,
      priorityLevel: 'Default',
      priorityOffset: 0,
      serverActionIndex: 1,
    },
    body: { kind: 'leaf' as const, value },
  };
}

function blowOff(deadOption: string) {
  return parseKnownNativeActionLeafSource(
    {
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
      deadOption,
    },
    'fixture.action',
    {},
  );
}

describe('施法输入限制与木桩物理控制投影', () => {
  it('当前技能可中断标记只属于客户端施法互斥门禁', () => {
    const action = parseKnownNativeActionLeafSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.MarkCanInterrupt+Data, Gameplay.Beyond',
      },
      'fixture.action',
      {},
    );
    expect(action).toEqual({ family: 'inputControl', action: { kind: 'markCanInterrupt' } });
    expect(compileBuffLeafNode(node(action), new Set(), new Map(), ACTIVE_SKILL_CONTEXT)).toEqual({
      steps: [],
      state: new Map(),
    });
  });

  it('根技能敌人上下文不遮蔽动作自身的施术者冷却目标', () => {
    const action = parseKnownNativeActionLeafSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.SetSkillCdAtOnce+Data, Gameplay.Beyond',
        target: targetFixture('Owner'),
        useSkillType: true,
        skillTypeMask: 'ComboSkill',
        skillId: '',
        functionType: 'Set',
        isPercentage: false,
        value: scalarFixture(0),
      },
      'fixture.action',
      {},
    );
    expect(compileBuffLeafNode(node(action), new Set(), new Map(), ACTIVE_SKILL_CONTEXT)).toEqual({
      steps: [
        {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'type', skillType: 'comboSkill' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 0 },
          },
        },
      ],
      state: new Map(),
    });
  });

  it('已证明为施术者的 ActionSource 可作为全队选择器所有者', () => {
    const action = {
      family: 'targetGroup' as const,
      action: {
        producerType: 'FindTargetAction' as const,
        targetGroupKey: 'party',
        finderType: 'CharacterTeamFinder' as const,
        finderFactionTarget: null,
        finderTargetObjectType: null,
        finderCheckAlive: null,
        finderShape: null,
        finderOwnerPartsQuery: null,
        validatorTypes: [],
        postProcessorTypes: [],
        inputTargets: [],
        intervalSeconds: null,
        finderSpawnedObjectType: null,
        validatorTagQueries: [],
        finderFixedPointSnapToNavmesh: null,
        center: 'ActionSource',
        centerContextKey: '',
        selectorOwner: 'ActionSource',
        selectorOwnerContextKey: '',
        directionTarget: 'ActionSource',
        directionContextKey: '',
        characterTeamSelection: null,
        excludesCurrentTarget: false,
        excludesOwner: false,
        smartTargetFallsBackToMainTarget: false,
        distanceValidatorsPassAtZero: true,
        priorityFilterMaxTargets: null,
        priorityFilters: [],
        shuffleTargets: [],
        distanceValidators: [],
        circularOrderIndexKey: null,
        circularOrderDesiredCount: null,
        circularOrderReverseFlag: null,
        circularOrderHeightOffset: null,
        circularOrderRangeThreshold: null,
        circularOrderRangeCheckTarget: null,
        pickIndexValue: null,
        pickIndexBlackboardKey: null,
      },
    } as ReturnType<typeof parseKnownNativeActionLeafSource>;

    expect(compileBuffLeafNode(node(action), new Set(), new Map(), ACTIVE_SKILL_CONTEXT)).toEqual({
      steps: [],
      state: new Map([['party', 'party']]),
    });
  });

  it('实体标签条件识别已经证明为唯一敌人的上下文目标组', () => {
    const action = parseKnownNativeActionLeafSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.Conditions.CheckTagMatch+Data, Gameplay.Beyond',
        checkTarget: targetFixture('Context', undefined, 'smart_target'),
        query: { queryType: 'HasAny', tags: [{ tagId: -1369794537 }] },
      },
      'fixture.action',
      {},
    );

    expect(
      compileEventCondition(
        node(action),
        ACTIVE_SKILL_CONTEXT,
        new Map([['smart_target', 'enemy']]),
      ),
    ).toEqual({
      kind: 'entityTagMatch',
      target: 'enemy',
      tagQueryType: 'hasAny',
      tags: ['Test/Tag123'],
    });
  });

  it('能力实体子技能的 Owner 受击表现不产生木桩模拟步骤', () => {
    const action = {
      family: 'stumpControl' as const,
      action: {
        kind: 'enemyHurtAnimation' as const,
        source: { targetSource: 'Owner', targetGroupKey: '' },
        target: { targetSource: 'Context', targetGroupKey: 'tar' },
      },
    } as ReturnType<typeof parseKnownNativeActionLeafSource>;
    const context = {
      gameplayTagRegistry: fixtureGameplayTagRegistry,
      ...ACTIVE_SKILL_CONTEXT,
      actionOwnerTarget: 'currentAbilityEntity' as const,
    };

    expect(
      compileBuffLeafNode(node(action), new Set(), new Map([['tar', 'enemy']]), context),
    ).toEqual({ steps: [], state: new Map([['tar', 'enemy']]) });
  });

  it('普通战技公共 Buff 按已解析 ratio 恢复全队终结技回能', () => {
    const action = parseKnownNativeActionLeafSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.ObtainUspInNormalSkill+Data, Gameplay.Beyond',
        source: targetFixture('Source'),
        coefficient: { useBlackboardKey: true, value: 1, blackboardKey: 'ratio' },
      },
      'fixture.action',
      { ratio: 1 },
    );
    expect(compileBuffLeafNode(node(action), new Set(), new Map(), ACTIVE_SKILL_CONTEXT)).toEqual({
      steps: [{ kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } }],
      state: new Map(),
    });
    const unresolved = parseKnownNativeActionLeafSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.ObtainUspInNormalSkill+Data, Gameplay.Beyond',
        source: targetFixture('Source'),
        coefficient: { useBlackboardKey: true, value: 1, blackboardKey: 'runtime_ratio' },
      },
      'fixture.unresolved',
      {},
    );
    expect(() =>
      compileBuffLeafNode(node(unresolved), new Set(), new Map(), ACTIVE_SKILL_CONTEXT),
    ).toThrow('unsupported ObtainUspInNormalSkill projection');
  });

  it('全队寒冷附着/冻结驱散在无敌方主动行为模型中省略', () => {
    const raw = {
      ...META,
      $type: 'Beyond.Gameplay.Core.DispelAction+Data, Gameplay.Beyond',
      dispelSource: targetFixture('Source'),
      dispelTargets: targetFixture('Context', undefined, 'tar'),
      dispelLevel: 'Default',
      checkTag: true,
      tagQuery: {
        queryType: 'HasAny',
        tags: [{ tagId: 82629473 }, { tagId: 548732882 }],
      },
    };
    const action = parseKnownNativeActionLeafSource(raw, 'fixture.action', {});

    expect(
      compileBuffLeafNode(
        node(action),
        new Set(),
        new Map([['tar', 'party']]),
        ACTIVE_SKILL_CONTEXT,
      ),
    ).toEqual({ steps: [], state: new Map([['tar', 'party']]) });

    const unknown = parseKnownNativeActionLeafSource(
      { ...raw, tagQuery: { queryType: 'HasAny', tags: [{ tagId: 82629473 }] } },
      'fixture.unknown',
      {},
    );
    expect(() =>
      compileBuffLeafNode(
        node(unknown),
        new Set(),
        new Map([['tar', 'party']]),
        ACTIVE_SKILL_CONTEXT,
      ),
    ).toThrow('unsupported DispelAction projection');
  });

  it('InterruptAction 的 Target 来源不读取残留 targetGroupKey', () => {
    const action = parseKnownNativeActionLeafSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.InterruptAction+Data, Gameplay.Beyond',
        attacker: targetFixture('Source'),
        defender: targetFixture('Target', undefined, 'residual-enemy-key'),
        overrideSuperArmorLimit: -1,
        immobilizedTime: 1,
      },
      'fixture.action',
      {},
    );

    expect(compileBuffLeafNode(node(action), new Set(), new Map(), ACTIVE_SKILL_CONTEXT)).toEqual({
      steps: [],
      state: new Map(),
    });
  });

  it('能力实体出生于直接 Source 时不执行残留主控选择器', () => {
    const action = parseKnownNativeActionLeafSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.SpawnAbilityEntity+Data, Gameplay.Beyond',
        abilityEntityId: 'abilityentity_fixture',
        setAbilityEntitySource: true,
        abilityEntitySource: 'ActionOwner',
        abilityEntitySourceContextKey: '',
        setAbilityEntityTarget: false,
        abilityEntityTarget: targetFixture('Target'),
        bornAt: {
          ...targetFixture('Source'),
          selectorData: {
            finderData: {
              $type: 'Beyond.Gameplay.Core.Selector+CharacterTeamFinder+Data, Gameplay.Beyond',
            },
            validatorData: [
              {
                $type: 'Beyond.Gameplay.Core.Selector+MainCharacterValidator+Data, Gameplay.Beyond',
              },
            ],
            postProcessorData: [],
          },
        },
        bornMountPoint: 'None',
        bornPosOffset: { x: -1, y: 0.5, z: 0 },
        checkNavmeshAreaName: false,
        forbiddenAreaNames: [],
        attachToClosestMeshPoint: false,
        yRotateFromBoneToCurPos: false,
        bornRotation: 'SourceForward',
        bornRotationContextTarget: '',
        useAdvancedDirectionSetting: false,
        advancedDirectionSetting: {
          directionType: 'SourceForward',
          sourceMountPoint: 'None',
          targetMountPoint: 'None',
          customSourceAndTarget: false,
          clampToXZ: true,
          invertDirection: false,
        },
        clampToXZPlane: false,
        applyBornRotationOffset: false,
        bornRotationOffset: { x: 0, y: 0, z: 0, w: 1 },
        assignEntityBlackboard: false,
        assignPairs: [],
        assignBlackboard: true,
        abilityEntitySkillId: 'fixture_skill',
        overrideDuration: false,
        duration: scalarFixture(0),
        saveToContext: false,
        contextKey: '',
        pauseEffectOnEnd: false,
        inheritSourceSkillCastId: true,
        dieWhenSourceDie: false,
        forceSyncInit: false,
        dieOnEnd: false,
      },
      'fixture.action',
      {},
    );

    expect(compileBuffLeafNode(node(action), new Set(), new Map(), ACTIVE_SKILL_CONTEXT)).toEqual({
      steps: [
        {
          kind: 'spawnAbilityEntity',
          parameters: {
            abilityEntityId: 'abilityentity_fixture',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          },
        },
      ],
      state: new Map(),
    });
    expect(() =>
      compileBuffLeafNode(node(action), new Set(), new Map(), {
        ...ACTIVE_SKILL_CONTEXT,
        actionSourceTarget: 'buffSource',
      }),
    ).toThrow('unsupported AbilityEntity spawn projection');
  });

  it('OnlyDead 吹飞在死亡终止模型中省略，活目标吹飞仍阻断', () => {
    expect(
      compileBuffLeafNode(node(blowOff('OnlyDead')), new Set(), new Map(), ACTIVE_SKILL_CONTEXT),
    ).toEqual({ steps: [], state: new Map() });
    expect(() =>
      compileBuffLeafNode(node(blowOff('NotDead')), new Set(), new Map(), ACTIVE_SKILL_CONTEXT),
    ).toThrow('live-target BlowOffEnemy physical infliction');
  });

  it('自身 ChannelingCasting 只限制同一施法区间，不产生战斗步骤', () => {
    const action = parseKnownNativeActionLeafSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.ChannelingCastingAction+Data, Gameplay.Beyond',
        cantSwitchPosition: true,
        cantSwitchToCenter: false,
        duration: scalarFixture(3.7),
        cantCastSkill: true,
      },
      'fixture.action',
      {},
    );
    expect(compileBuffLeafNode(node(action), new Set(), new Map(), ACTIVE_SKILL_CONTEXT)).toEqual({
      steps: [],
      state: new Map(),
    });
    expect(() =>
      compileBuffLeafNode(node(action), new Set(), new Map(), {
        ...ACTIVE_SKILL_CONTEXT,
        actionSourceTarget: 'buffSource',
      }),
    ).toThrow('unsupported ChannelingCastingAction owner');
  });
});
