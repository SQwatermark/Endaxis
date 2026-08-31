import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { layoutBuffTimelineSegments, projectBuffTimelineViz } from './buffTimelineViz';

function applied(
  sequence: number,
  frame: number,
  targetId: string,
  instanceId: number,
  layers: number,
  visible = true,
  sourceActionId = 'skill:test',
): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: 'BuffApplied',
    sourceId: 'source',
    targetId,
    data: {
      buffId: 'buff:test',
      instanceId,
      layers,
      visible,
      sourceActionId,
      iconPath: '/icons/icon_battle_buff_atk_up.webp',
    },
  };
}

function finished(
  sequence: number,
  frame: number,
  targetId: string,
  instanceId: number,
): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: 'BuffFinished',
    targetId,
    data: { buffId: 'buff:test', instanceId, layers: 1, reason: 'lifetime' },
  };
}

describe('projectBuffTimelineViz', () => {
  it('projects apply, enhance, and finish boundaries by instance identity', () => {
    expect(
      projectBuffTimelineViz(
        [
          applied(0, 10, 'operator:1', 4, 1),
          applied(1, 20, 'operator:1', 4, 2),
          finished(2, 50, 'operator:1', 4),
        ],
        90,
      ),
    ).toEqual([
      {
        targetId: 'operator:1',
        buffId: 'buff:test',
        instanceId: 4,
        startFrame: 10,
        endFrame: 20,
        layers: 1,
        placement: 'upper',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
      },
      {
        targetId: 'operator:1',
        buffId: 'buff:test',
        instanceId: 4,
        startFrame: 20,
        endFrame: 50,
        layers: 2,
        placement: 'upper',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
      },
    ]);
  });

  it('hides definitions explicitly excluded from presentation', () => {
    expect(projectBuffTimelineViz([applied(0, 10, 'enemy', 1, 1, false)], 90)).toEqual([]);
  });

  it('保留 HUD 分流、进度和排序证据', () => {
    const entry = applied(0, 10, 'operator:1', 1, 2);
    expect(
      projectBuffTimelineViz(
        [
          {
            ...entry,
            data: {
              ...entry.data,
              showInSquadIcon: true,
              onlyShowForMainCharacter: true,
              showProgressInNormalSkillButton: true,
              useWeakProgressInNormalSkillButton: true,
              showWarningBackground: true,
              iconStyleInSquad: 'LifeTime',
              abnormalColorType: 'Fire',
              orderUseDirectoryValue: false,
              orderPriorityValue: 12,
              orderPriorityCategory: 'CommonCharBuff',
            },
          },
        ],
        90,
      )[0],
    ).toMatchObject({
      showInSquadIcon: true,
      onlyShowForMainCharacter: true,
      showProgressInNormalSkillButton: true,
      useWeakProgressInNormalSkillButton: true,
      showWarningBackground: true,
      iconStyleInSquad: 'LifeTime',
      abnormalColorType: 'Fire',
      orderUseDirectoryValue: false,
      orderPriorityValue: 12,
      orderPriorityCategory: 'CommonCharBuff',
    });
  });

  it('projects child presentation lifetimes without inventing runtime Buff instances', () => {
    const entries: CombatReceiptEntry[] = [
      {
        ...applied(0, 5, 'operator:1', 2, 1),
        event: 'BuffPresentationStarted',
        data: {
          buffId: 'buff:child-icon',
          parentBuffId: 'buff:test',
          instanceId: 2,
          layers: 1,
          iconPath: '/icons/child.webp',
        },
      },
      {
        ...finished(1, 35, 'operator:1', 2),
        event: 'BuffPresentationFinished',
        data: {
          buffId: 'buff:child-icon',
          parentBuffId: 'buff:test',
          instanceId: 2,
          layers: 1,
          reason: 'lifetime',
        },
      },
    ];
    expect(projectBuffTimelineViz(entries, 60)).toEqual([
      {
        targetId: 'operator:1',
        buffId: 'buff:child-icon',
        instanceId: 2,
        startFrame: 5,
        endFrame: 35,
        layers: 1,
        placement: 'upper',
        iconPath: '/icons/child.webp',
      },
    ]);
  });

  it('uses compact non-overlapping lanes', () => {
    const segments = projectBuffTimelineViz(
      [
        applied(0, 0, 'operator:1', 1, 1),
        applied(1, 10, 'operator:1', 2, 1),
        finished(2, 20, 'operator:1', 1),
        applied(3, 20, 'operator:1', 3, 1),
      ],
      40,
    );
    expect(layoutBuffTimelineSegments(segments).map(segment => segment.lane)).toEqual([0, 1, 0]);
  });

  it('uses frozen equipment provenance for the legacy lower band', () => {
    const [operatorBuff, eventBuff, weaponInitialization, gearInitialization] =
      projectBuffTimelineViz(
        [
          applied(0, 0, 'operator:1', 1, 1),
          applied(1, 0, 'operator:1', 2, 1, true, 'equipment:gearSet:suit_atk01:onDamage'),
          applied(
            2,
            0,
            'operator:1',
            3,
            1,
            true,
            'upgrade-initialization:weapon-trait:wpn_pistol_0005:skill3',
          ),
          applied(3, 0, 'operator:1', 4, 1, true, 'upgrade-initialization:gear-set:suit_atk01'),
        ],
        30,
      );
    expect(operatorBuff?.placement).toBe('upper');
    expect(eventBuff?.placement).toBe('lower');
    expect(weaponInitialization?.placement).toBe('lower');
    expect(gearInitialization?.placement).toBe('lower');
  });
});
