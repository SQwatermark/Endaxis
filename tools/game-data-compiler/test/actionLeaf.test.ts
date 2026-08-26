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
});

function sequence(actionData: unknown[]): Record<string, unknown> {
  return {
    actionData,
    onlyExecuteWhenSourceIsMainChar: false,
    onlyExecuteWhenSourceIsGuard: false,
  };
}
