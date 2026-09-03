import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import {
  layoutOperatorPassiveUiTimelineSegments,
  projectOperatorPassiveUiTimelineViz,
} from './operatorPassiveUiTimelineViz';

describe('projectOperatorPassiveUiTimelineViz', () => {
  it('把连续非零数值按每次变化切成持续段，归零时结束', () => {
    const entries: CombatReceiptEntry[] = [
      {
        sequence: 0,
        frame: 5,
        time: 5 / 30,
        event: 'CharacterPassiveUiValueChanged',
        targetId: 'operator:1',
        data: { value: 1 },
      },
      {
        sequence: 1,
        frame: 10,
        time: 10 / 30,
        event: 'CharacterPassiveUiValueChanged',
        targetId: 'operator:1',
        data: { value: 2 },
      },
      {
        sequence: 2,
        frame: 12,
        time: 12 / 30,
        event: 'CharacterPassiveUiValueChanged',
        targetId: 'operator:1',
        data: { value: 2 },
      },
      {
        sequence: 3,
        frame: 15,
        time: 15 / 30,
        event: 'CharacterPassiveUiValueChanged',
        targetId: 'operator:1',
        data: { value: 0 },
      },
      {
        sequence: 4,
        frame: 20,
        time: 20 / 30,
        event: 'CharacterPassiveUiValueChanged',
        targetId: 'operator:1',
        data: { value: 9 },
      },
    ];

    expect(
      projectOperatorPassiveUiTimelineViz(entries, 30, [
        {
          operatorId: 'operator:1',
          definition: {
            kind: 'numeric',
            appearance: 'laevatainCounter',
            maximum: 4,
            activeAt: 4,
          },
        },
      ]),
    ).toEqual([
      {
        kind: 'numeric',
        appearance: 'laevatainCounter',
        operatorId: 'operator:1',
        startFrame: 5,
        endFrame: 10,
        value: 1,
        maximum: 4,
        active: false,
      },
      {
        kind: 'numeric',
        appearance: 'laevatainCounter',
        operatorId: 'operator:1',
        startFrame: 10,
        endFrame: 15,
        value: 2,
        maximum: 4,
        active: false,
      },
      {
        kind: 'numeric',
        appearance: 'laevatainCounter',
        operatorId: 'operator:1',
        startFrame: 20,
        endFrame: 30,
        value: 4,
        maximum: 4,
        active: true,
      },
    ]);
  });

  it('把专属进度 Buff 的生效区间投影为专属 UI 段', () => {
    const entries: CombatReceiptEntry[] = [
      {
        sequence: 0,
        frame: 2,
        time: 2 / 30,
        event: 'BuffApplied',
        targetId: 'operator:1',
        data: { buffId: 'normal', instanceId: 1 },
      },
      {
        sequence: 1,
        frame: 8,
        time: 8 / 30,
        event: 'BuffFinished',
        targetId: 'operator:1',
        data: { buffId: 'normal', instanceId: 1 },
      },
      {
        sequence: 2,
        frame: 10,
        time: 10 / 30,
        event: 'BuffApplied',
        targetId: 'operator:1',
        data: { buffId: 'ultimate', instanceId: 2 },
      },
    ];

    expect(
      projectOperatorPassiveUiTimelineViz(entries, 20, [
        {
          operatorId: 'operator:1',
          definition: {
            kind: 'buffProgress',
            appearance: 'liinoMusic',
            normalBuffId: 'normal',
            ultimateBuffId: 'ultimate',
          },
        },
      ]),
    ).toEqual([
      {
        kind: 'buffProgress',
        appearance: 'liinoMusic',
        operatorId: 'operator:1',
        startFrame: 2,
        endFrame: 8,
        mode: 'normal',
        buffId: 'normal',
        instanceId: 1,
      },
      {
        kind: 'buffProgress',
        appearance: 'liinoMusic',
        operatorId: 'operator:1',
        startFrame: 10,
        endFrame: 20,
        mode: 'ultimate',
        buffId: 'ultimate',
        instanceId: 2,
      },
    ]);
  });

  it('按 Buff 层数变化切分 Typhoea 的箭与能量计数段', () => {
    const entries: CombatReceiptEntry[] = [
      {
        sequence: 0,
        frame: 2,
        time: 2 / 30,
        event: 'BuffApplied',
        targetId: 'operator:1',
        data: { buffId: 'arrow-battle', instanceId: 7, layers: 1 },
      },
      {
        sequence: 1,
        frame: 5,
        time: 5 / 30,
        event: 'BuffEnhanceChanged',
        targetId: 'operator:1',
        data: { buffId: 'arrow-battle', instanceId: 7, layers: 3 },
      },
      {
        sequence: 2,
        frame: 9,
        time: 9 / 30,
        event: 'BuffFinished',
        targetId: 'operator:1',
        data: { buffId: 'arrow-battle', instanceId: 7, layers: 3 },
      },
    ];
    expect(
      projectOperatorPassiveUiTimelineViz(entries, 12, [
        {
          operatorId: 'operator:1',
          definition: {
            kind: 'buffCounters',
            appearance: 'typhoeaQuiver',
            counters: [
              { key: 'arrows', buffIds: ['arrow-out', 'arrow-battle'], maximum: 4 },
              { key: 'points', buffIds: ['points'], maximum: 8 },
            ],
          },
        },
      ]),
    ).toEqual([
      {
        kind: 'buffCounter',
        appearance: 'typhoeaQuiver',
        operatorId: 'operator:1',
        startFrame: 2,
        endFrame: 5,
        counterKey: 'arrows',
        buffId: 'arrow-battle',
        instanceId: 7,
        value: 1,
        maximum: 4,
      },
      {
        kind: 'buffCounter',
        appearance: 'typhoeaQuiver',
        operatorId: 'operator:1',
        startFrame: 5,
        endFrame: 9,
        counterKey: 'arrows',
        buffId: 'arrow-battle',
        instanceId: 7,
        value: 3,
        maximum: 4,
      },
    ]);
  });

  it('可以在已有 Buff lane 后继续排布', () => {
    const segments = projectOperatorPassiveUiTimelineViz(
      [
        {
          sequence: 0,
          frame: 1,
          time: 1 / 30,
          event: 'CharacterPassiveUiValueChanged',
          targetId: 'operator:1',
          data: { value: 1 },
        },
      ],
      10,
      [
        {
          operatorId: 'operator:1',
          definition: { kind: 'numeric', appearance: 'tangtangDroplets', maximum: 2 },
        },
      ],
    );
    expect(layoutOperatorPassiveUiTimelineSegments(segments, 3)[0]?.lane).toBe(3);
  });
});
