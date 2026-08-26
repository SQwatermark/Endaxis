import { describe, expect, it } from 'vitest';
import scopeFixtures from './fixtures/avywenna-return-blackboard.json';
import { compileActiveSkillRuntimeProjectionSource } from '../src/compiler/activeSkillRuntimeProjection.ts';
import { activeSkillFixture, scalarFixture, targetFixture } from './sourceFixtures.ts';
import { makeReturnProjection } from './support/avywennaReturnProjection.ts';

const ACTIVE_CONTEXT = {
  actionOwnerTarget: 'caster',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'enemy',
} as const;

function activeWithLaunch() {
  const skill = activeSkillFixture('chr_0012_avywen_normal_skill');
  skill.actionGroupData = {
    timelineActions: [
      {
        _startFrame: 7,
        _endFrame: 10,
        _sequenceActionData: {
          actionData: [structuredClone(scopeFixtures[0]!.launch)],
          onlyExecuteWhenSourceIsMainChar: false,
          onlyExecuteWhenSourceIsGuard: false,
        },
        forceSyncAnimData: {
          forceSync: false,
          montageName: '',
          targetFrame: 0,
          playbackSpeed: 1,
        },
      },
    ],
    passiveEventActions: [],
  };
  return skill;
}

function activeWithActions(actions: unknown[]) {
  const skill = activeSkillFixture('active_runtime');
  skill.actionGroupData = {
    timelineActions: [
      {
        _startFrame: 5,
        _endFrame: 8,
        _sequenceActionData: {
          actionData: actions,
          onlyExecuteWhenSourceIsMainChar: false,
          onlyExecuteWhenSourceIsGuard: false,
        },
        forceSyncAnimData: {
          forceSync: false,
          montageName: '',
          targetFrame: 0,
          playbackSpeed: 1,
        },
      },
    ],
    passiveEventActions: [],
  };
  return skill;
}

const meta = (type: string, rest: Record<string, unknown>): Record<string, unknown> => ({
  $type: `Beyond.Gameplay.Core.${type}+Data, Gameplay.Beyond`,
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
  ...rest,
});

describe('主动技能正式时间轴投影', () => {
  it('由 SkillData 帧位置消费公共投射物扩展，并保留独立实体/回调黑板作用域', () => {
    const result = compileActiveSkillRuntimeProjectionSource({
      value: activeWithLaunch(),
      sourcePath: 'SkillData.chr_0012_avywen_normal_skill',
      patch: null,
      context: ACTIVE_CONTEXT,
      extensions: { compileProjectileLaunch: () => [makeReturnProjection(0)] },
    });
    expect(result).toMatchObject({
      skillId: 'chr_0012_avywen_normal_skill',
      durationFrame: 30,
      timelineBlockFrames: 31,
      scheduledSequences: [
        {
          startFrame: 7,
          endFrame: 10,
          sequence: {
            steps: [
              {
                kind: 'withActionBlackboardScope',
                parameters: { entityInitialValues: { EntityBB_talent0: 0 } },
                body: {
                  steps: [
                    { kind: 'withActionBlackboardScope' },
                    { kind: 'withActionBlackboardScope' },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it('不把主动 SkillData 的被动事件静默塞入施法时间轴', () => {
    const skill = activeWithLaunch();
    (skill.actionGroupData as { passiveEventActions: unknown[] }).passiveEventActions = [
      { abilityEvent: 'OnHit', actions: [] },
    ];
    expect(() =>
      compileActiveSkillRuntimeProjectionSource({
        value: skill,
        sourcePath: 'active',
        patch: null,
        context: ACTIVE_CONTEXT,
      }),
    ).toThrow('active skill passive events are unsupported');
  });

  it('拒绝在未提供宿主投射物目录时把 LaunchProjectile 当作无效果动作', () => {
    expect(() =>
      compileActiveSkillRuntimeProjectionSource({
        value: activeWithLaunch(),
        sourcePath: 'active',
        patch: null,
        context: ACTIVE_CONTEXT,
      }),
    ).toThrow('projectile launch projection is unavailable');
  });

  it('Both hit-stop 保留为施法者与木桩的实体时间膨胀', () => {
    const result = compileActiveSkillRuntimeProjectionSource({
      value: activeWithActions([
        meta('HitStopAction', {
          affectType: 'Both',
          curveKey: 'char_hard_stop',
          useDirectCurve: false,
          directCurve: [],
          duration: 0.15,
          timeDilationPriority: { tagId: -2059842104 },
          attacker: targetFixture('Source'),
          target: targetFixture('Target'),
        }),
      ]),
      sourcePath: 'active',
      patch: null,
      context: ACTIVE_CONTEXT,
      extensions: { resolveTimeDilationPriority: tagId => (tagId === -2059842104 ? 10 : NaN) },
    });
    expect(result.scheduledSequences[0]!.sequence.steps).toEqual([
      {
        kind: 'startTimeDilation',
        parameters: {
          scope: 'entity',
          durationSeconds: { kind: 'constant', value: 0.15 },
          slot: 1464849466,
          priority: 10,
          curve: { kind: 'named', key: 'char_hard_stop' },
          finishByAction: false,
          targets: ['enemy', 'caster'],
        },
      },
    ]);
  });

  it('版本化公共回能 Buff 投影为按技能消耗获得全队终结技能量', () => {
    const result = compileActiveSkillRuntimeProjectionSource({
      value: activeWithActions([
        meta('CreateBuffAction', {
          buffs: [
            {
              buffId: 'buff_common_obtain_ultimate_sp',
              assignBlackboard: false,
              assignItems: [],
              readIdFromBlackboard: false,
              buffIdKey: '',
            },
          ],
          count: scalarFixture(1),
          targetSettings: targetFixture('Source'),
          buffSource: 'ActionSource',
          contextKey: '',
          autoFinishByAction: false,
          inheritSkillIdList: [],
          finishWithNextSkillIfNotInherited: true,
          asChildBuff: false,
          inheritSourceSkillCastId: true,
          inheritSourceSkillCastInfo: true,
          isExtra: false,
          passTargetGroupsToBuff: false,
          overrideBuffIconDuration: false,
          buffIconDurationSource: {
            m_abilityEntityTypeInfo: '',
            m_timedMarkerInfo: '',
            durationSourceType: 'AbilityEntity',
            timedMarkerId: '',
          },
        }),
      ]),
      sourcePath: 'active',
      patch: null,
      context: ACTIVE_CONTEXT,
    });
    expect(result.scheduledSequences[0]!.sequence.steps).toEqual([
      { kind: 'gainSquadUltimateEnergyFromSkillCost', parameters: { coefficient: 1 } },
    ]);
  });

  it('只省略空 onEnd 的动画；动画结束战斗子图继续严格拒绝', () => {
    const animation = meta('PlayAnimationAction', {
      animName: 'Skill',
      blendDuration: 0,
      blendOut: 0.2,
      duration: 1,
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
    });
    expect(
      compileActiveSkillRuntimeProjectionSource({
        value: activeWithActions([animation]),
        sourcePath: 'active',
        patch: null,
        context: ACTIVE_CONTEXT,
      }).scheduledSequences,
    ).toEqual([]);
    animation.onEndAction = {
      ...(animation.onEndAction as object),
      actionData: [meta('FinishOwnerAction', { target: targetFixture('Owner') })],
    };
    expect(() =>
      compileActiveSkillRuntimeProjectionSource({
        value: activeWithActions([animation]),
        sourcePath: 'active',
        patch: null,
        context: ACTIVE_CONTEXT,
      }),
    ).toThrow('animation end combat actions are unsupported');
  });
});
