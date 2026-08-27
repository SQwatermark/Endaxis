import { describe, expect, it } from 'vitest';
import type { SkillGlobalBuffDefinition } from '../../game-data/operatorDefinition';
import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import type { BuffApplicationRequest, BuffOperationTarget } from './buffOperationExecutor';
import { GlobalBuffRuntime } from './globalBuffRuntime';

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
        finish(reason: 'early' | 'absorbed' | 'other') {
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
    expect(first.finished).toEqual(['early']);
    expect(second.finished).toEqual(['early']);
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
});
