import { describe, expect, it } from 'vitest';

import {
  parseGlobalCooldownApplicationSource,
  parseResourceGainActionSource,
  parseTimedMarkerApplicationSource,
} from '../src/index.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

const META = {
  $type: 'Example.Action+Data, Example',
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
} as const;

describe('资源与计时动作公共载荷', () => {
  it('完整保留资源获得动作的目标与表现开关', () => {
    const source = parseResourceGainActionSource(
      {
        ...META,
        costType: 'Atb',
        isPercentValue: false,
        useUspRecoverTag: false,
        uspRecoverTag: { tagId: 0 },
        ignoreUspGainScalar: false,
        atbSourceType: 'NormalAttack',
        atbGainMethod: 'Gain',
        playObtainAtbEffect: true,
        playObtainAtbAudio: false,
        costValue: scalarFixture(0, 'atb'),
        coefficient: scalarFixture(1),
        atbOnlyMainChar: false,
        source: targetFixture('Source'),
        target: targetFixture('Owner'),
      },
      'fixture.resource',
      { atb: [3, 4] },
    );
    expect(source).toMatchObject({
      kind: 'resourceGain',
      resource: 'sp',
      spGainKind: 'gain',
      spGainSource: 'normalAttack',
      playEffect: true,
      playAudio: false,
      amount: { blackboardKey: 'atb', levelValues: [3, 4] },
      source: { targetSource: 'Source' },
      target: { targetSource: 'Owner' },
    });
  });

  it('来源 IR 保留动态 TimedMarker ID 和局部时间选择', () => {
    const source = parseTimedMarkerApplicationSource(
      {
        ...META,
        targetSettings: targetFixture('Owner'),
        markerId: { useBlackboardKey: true, value: 'fallback', blackboardKey: 'marker_id' },
        duration: scalarFixture(2, 'marker_duration'),
        autoFinishByAction: true,
        useTimeDilationDt: true,
      },
      'fixture.marker',
      { marker_duration: [2, 3] },
    );
    expect(source).toMatchObject({
      marker: { value: 'fallback', blackboardKey: 'marker_id' },
      duration: { blackboardKey: 'marker_duration', levelValues: [2, 3] },
      autoFinishByAction: true,
      useTimeDilationDeltaTime: true,
    });
  });

  it('全局冷却以 Buff ID 保留稳定身份', () => {
    expect(
      parseGlobalCooldownApplicationSource(
        {
          ...META,
          target: targetFixture('Owner'),
          buffId: 'buff_chr_fixture_cooldown',
          cdTime: scalarFixture(0, 'cooldown'),
        },
        'fixture.cooldown',
        { cooldown: [8] },
      ),
    ).toMatchObject({
      kind: 'globalCooldownApplication',
      buffId: 'buff_chr_fixture_cooldown',
      duration: { blackboardKey: 'cooldown', levelValues: [8] },
    });
  });
});
