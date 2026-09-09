import { describe, expect, it } from 'vitest';
import type { SkillGlobalBuffDefinition } from '../../game-data/operatorDefinition';
import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import type { BuffApplicationRequest, BuffOperationTarget } from './buffOperationExecutor';
import { GlobalBuffOperationExecutor, GlobalBuffRuntime } from './globalBuffRuntime';
import { ActionBlackboard } from './actionBlackboard';
import {
  SharedSpGainModifierSet,
  SharedSpRecoveryModifierSet,
} from '../resources/sharedSpGainModifiers';

const childDefinition: ResolvedSkillBuffDefinition = { stackingType: 'unlimited' };
const definition: SkillGlobalBuffDefinition = {
  stackingType: 'stack',
  maxStackCount: 2,
  durationSeconds: { blackboardKey: 'duration' },
  blackboard: { duration: 10, scale: 0 },
  children: [
    {
      buffId: 'child',
      blackboardAssignments: { imbue: { kind: 'blackboard', key: 'scale' } },
    },
  ],
};

function target(ownerId: string) {
  const requests: BuffApplicationRequest[] = [];
  const finished: string[] = [];
  const value = {
    ownerId,
    applyScoped(request: BuffApplicationRequest) {
      requests.push(request);
      return {
        finish(reason: 'early' | 'absorbed' | 'other', source: unknown) {
          expect(source).toBeNull();
          finished.push(reason);
          return true;
        },
      };
    },
  } as unknown as BuffOperationTarget;
  return { value, requests, finished };
}

describe('GlobalBuffRuntime', () => {
  it('keeps an exact parent layer and removes every squad mirror through one child', () => {
    const first = target('first');
    const second = target('second');
    const runtime = new GlobalBuffRuntime(
      () => [first.value, second.value],
      (_source, id) => (id === 'child' ? childDefinition : undefined),
    );
    runtime.add({
      id: 'global',
      definition,
      sourceId: 'akekuri',
      blackboardValues: { duration: 15, scale: 0.3 },
    });
    expect(first.requests[0]).toMatchObject({
      sourceId: 'akekuri',
      blackboardValues: { imbue: 0.3 },
    });
    expect(second.requests[0]).toMatchObject({ blackboardValues: { imbue: 0.3 } });
    expect(first.requests[0]!.finishParentGlobalBuff?.('early')).toBe(true);
    expect(first.finished).toEqual(['other']);
    expect(second.finished).toEqual(['other']);
    expect(second.requests[0]!.finishParentGlobalBuff?.('early')).toBe(false);
  });

  it('evicts the first unfinished parent instance at the confirmed stack maximum', () => {
    const member = target('member');
    const runtime = new GlobalBuffRuntime(
      () => [member.value],
      () => childDefinition,
    );
    for (const scale of [0.1, 0.2, 0.3]) {
      runtime.add({
        id: 'global',
        definition,
        sourceId: 'akekuri',
        blackboardValues: { scale },
      });
    }
    expect(member.finished).toEqual(['other']);
    expect(member.requests.map(request => request.blackboardValues.imbue)).toEqual([0.1, 0.2, 0.3]);
  });

  it('registers native shared-SP modifiers for the exact parent lifetime', () => {
    const member = target('member');
    const gainModifiers = new SharedSpGainModifierSet({ baseGainEfficiency: 1 });
    const recoveryModifiers = new SharedSpRecoveryModifierSet();
    const runtime = new GlobalBuffRuntime(
      () => [member.value],
      () => childDefinition,
      gainModifiers,
      recoveryModifiers,
    );
    runtime.add({
      id: 'global',
      definition: {
        ...definition,
        durationSeconds: 1 / 30,
        sharedSpModifiers: [
          {
            attribute: 'spRecovery',
            operation: 'multiplier',
            value: { kind: 'blackboard', key: 'scale' },
            applyToReturnSpGain: true,
          },
          {
            attribute: 'gainEfficiency',
            operation: 'addition',
            value: { kind: 'constant', value: 0.2 },
            applyToReturnSpGain: false,
          },
        ],
      },
      sourceId: 'akekuri',
      blackboardValues: { scale: -0.5 },
    });

    expect(recoveryModifiers.resolve(10)).toBe(5);
    expect(gainModifiers.resolve('skill', 'gain').totalEfficiency).toBe(1.2);
    runtime.advanceFrame();
    expect(recoveryModifiers.resolve(10)).toBe(10);
    expect(gainModifiers.resolve('skill', 'gain').totalEfficiency).toBe(1);
    expect(member.finished).toEqual(['other']);
  });

  it('finishes every active parent instance for each explicitly named GlobalBuff ID', () => {
    const member = target('member');
    const runtime = new GlobalBuffRuntime(
      () => [member.value],
      () => childDefinition,
    );
    for (const id of ['first', 'first', 'second']) {
      runtime.add({ id, definition, sourceId: 'akekuri', blackboardValues: {} });
    }

    expect(runtime.finishAllByIds(['first'], 'other')).toBe(true);
    expect(member.finished).toEqual(['other', 'other']);
    expect(runtime.finishAllByIds(['first'], 'other')).toBe(false);
    expect(runtime.finishAllByIds(['second'], 'early')).toBe(true);
    expect(member.finished).toEqual(['other', 'other', 'other']);
  });

  it('routes battle-owned create and named finish steps through the same runtime directory', () => {
    const member = target('member');
    const recoveryModifiers = new SharedSpRecoveryModifierSet();
    const definitionSources: string[] = [];
    const runtime = new GlobalBuffRuntime(
      () => [member.value],
      (sourceId, buffId) => {
        definitionSources.push(`${sourceId}:${buffId}`);
        return childDefinition;
      },
      null,
      recoveryModifiers,
    );
    const executor = new GlobalBuffOperationExecutor({
      sourceId: 'akekuri',
      runtime,
      resolveSource: () => {
        throw new Error('battle source must not use an operator source resolver');
      },
      delegate: { execute: () => false, evaluate: () => false },
    });
    const context = { blackboard: new ActionBlackboard({ ratio: -1 }) };

    expect(
      executor.execute(
        {
          kind: 'createGlobalBuff',
          parameters: {
            globalBuffId: 'recovery-stop',
            source: 'battle',
            blackboardAssignments: {
              ratio: { kind: 'blackboard', key: 'ratio' },
            },
            definition: {
              stackingType: 'unlimited',
              blackboard: { ratio: -0.1 },
              sharedSpModifiers: [
                {
                  attribute: 'spRecovery',
                  operation: 'multiplier',
                  value: { kind: 'blackboard', key: 'ratio' },
                  applyToReturnSpGain: true,
                },
              ],
              children: [{ buffId: 'icon', blackboardAssignments: {} }],
            },
          },
        },
        context,
      ),
    ).toBe(true);
    expect(definitionSources).toEqual(['battle:icon']);
    expect(member.requests[0]!.sourceId).toBe('battle');
    expect(member.requests[0]!.definitionOwnerId).toBe('akekuri');
    expect(recoveryModifiers.resolve(10)).toBe(0);

    expect(
      executor.execute({
        kind: 'finishGlobalBuffsById',
        parameters: { globalBuffIds: ['recovery-stop'], reason: 'other' },
      }),
    ).toBe(true);
    expect(recoveryModifiers.resolve(10)).toBe(10);
  });
});
