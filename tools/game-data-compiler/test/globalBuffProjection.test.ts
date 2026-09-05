import { describe, expect, it } from 'vitest';
import type { GlobalBuffTemplateSource } from '../src/source/globalBuffTemplate.ts';
import type { GlobalBuffActionSource } from '../src/source/globalBuffActions.ts';
import {
  compileGlobalBuffTemplate,
  createGlobalBuffProjectionExtensions,
} from '../src/compiler/globalBuffProjection.ts';

const scalar = (value: number, blackboardKey: string | null = null) => ({
  value,
  blackboardKey,
  levelValues: null,
});

function template(): GlobalBuffTemplateSource {
  return {
    id: 'global_buff_test',
    lifeType: 'Infinity',
    duration: scalar(0, 'duration'),
    triggerInterval: scalar(0),
    waitFirstTriggerInterval: true,
    maxTriggerCount: scalar(1),
    stackingIdentifierType: 'Id',
    stackingType: 'Unlimited',
    stackingKey: '',
    usePriorityKey: false,
    priorityKey: '',
    negatePriority: false,
    priority: 0,
    maxStackCount: 0,
    applyIconDurationToBuffs: false,
    children: [{ buffId: 'buff_icon', assignBlackboard: false, assignments: [] }],
    globalModifierCount: 1,
    globalModifiers: [
      {
        attribute: 'spRecovery',
        operation: 'multiplier',
        value: scalar(0, 'ratio'),
        applyToReturnSpGain: true,
      },
    ],
    globalEventCount: 0,
    blackboard: [
      { key: 'ratio', value: -0.1, isDynamic: false },
      { key: 'duration', value: 12, isDynamic: false },
    ],
  };
}

describe('GlobalBuff projection', () => {
  it('projects native shared-SP modifiers without flattening their blackboard reads', () => {
    expect(compileGlobalBuffTemplate(template(), 'global.fixture')).toMatchObject({
      sharedSpModifiers: [
        {
          attribute: 'spRecovery',
          operation: 'multiplier',
          value: { kind: 'blackboard', key: 'ratio' },
          applyToReturnSpGain: true,
        },
      ],
    });
  });

  it('fails closed when the declared native modifier count and parsed list diverge', () => {
    expect(() =>
      compileGlobalBuffTemplate({ ...template(), globalModifierCount: 2 }, 'global.fixture'),
    ).toThrow('unsupported GlobalBuff template behavior');
  });

  it('projects the confirmed finish-all-by-ID native action without treating it as parent finish', () => {
    const action: GlobalBuffActionSource = {
      kind: 'finishGlobalBuff',
      finishParent: false,
      globalBuffIds: ['global_buff_cc_chr_atb_recoverspeed_down'],
      finishAll: true,
      finishCount: scalar(1),
      isFinishedEarly: false,
    };
    const compile = createGlobalBuffProjectionExtensions({
      version: 'fixture',
      byId: new Map(),
    }).compileGlobalBuffAction!;

    expect(compile(action, 'action.fixture', {} as never)).toEqual([
      {
        kind: 'finishGlobalBuffsById',
        parameters: {
          globalBuffIds: ['global_buff_cc_chr_atb_recoverspeed_down'],
          reason: 'other',
        },
      },
    ]);
  });
});
