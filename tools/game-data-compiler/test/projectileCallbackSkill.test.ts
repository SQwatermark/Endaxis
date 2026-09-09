import { describe, expect, it } from 'vitest';
import { compileProjectileCallbackSkillSource } from '../src/compiler/projectileRuntimeProjection.ts';
import type { SkillActionGraphSource } from '../src/source/skillActionGraph.ts';
import type { KnownNativeActionLeafSource } from '../src/source/actionLeaf.ts';
import { returnProjectionContext } from './support/avywennaReturnProjection.ts';

function graph(durationFrame: number): SkillActionGraphSource<KnownNativeActionLeafSource> {
  return {
    skillId: 'callback',
    level: 1,
    durationFrame,
    declaredBlackboard: [],
    actionGroup: {
      passiveEvents: [],
      timelineActions: [
        [0, 0],
        [0, 3],
        [0, 10],
        [12, 20],
      ].map(([startFrame, endFrame]) => ({
        startFrame: startFrame!,
        endFrame: endFrame!,
        forceSyncAnimation: { forceSync: false, montageName: '', targetFrame: 0, playbackSpeed: 1 },
        sequence: {
          onlyExecuteWhenSourceIsMainCharacter: false,
          onlyExecuteWhenSourceIsGuard: false,
          actions: [],
        },
      })),
    },
  };
}

describe('complete projectile callback skill source', () => {
  it('keeps all native action intervals and their order, even when empty after projection', () => {
    const source = graph(900);
    const compiled = compileProjectileCallbackSkillSource({
      graph: source,
      context: returnProjectionContext,
    });
    expect(compiled.naturalDurationFrames).toBe(900);
    expect(compiled.declaredBlackboard).toBe(source.declaredBlackboard);
    expect(compiled.timelineActions.map(t => [t.startFrame, t.endFrame])).toEqual([
      [0, 0],
      [0, 3],
      [0, 10],
      [12, 20],
    ]);
    expect(compiled.timelineActions.every(t => t.sequence.steps.length === 0)).toBe(true);
  });

  it('uses the native minimum one-frame duration, not the last action end', () => {
    const compiled = compileProjectileCallbackSkillSource({
      graph: graph(0),
      context: returnProjectionContext,
    });
    expect(compiled.naturalDurationFrames).toBe(1);
    expect(compiled.timelineActions.at(-1)?.endFrame).toBe(20);
  });

  it.each([-1, 0.5, NaN, Infinity])('rejects invalid native duration %s', duration => {
    expect(() =>
      compileProjectileCallbackSkillSource({
        graph: graph(duration),
        context: returnProjectionContext,
      }),
    ).toThrow('invalid callback durationFrame');
  });
});
