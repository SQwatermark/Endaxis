import { describe, expect, it } from 'vitest';
import type {
  CombatStepDefinition,
  SkillDefinition,
} from '../../core/game-data/operatorDefinition';
import type { SkillCastDocument } from '../../core/project/schema';
import { deriveHitId } from '../../core/combat/timeline/deriveHitId';
import {
  findCastHitMarker,
  projectCastHitMarkers,
  projectTimelineHitMarkerLeftPx,
} from './timelineHitProjection';

function fixtureDef(cast: SkillCastDocument): SkillDefinition {
  return cast.customDefinition!;
}

function createCast(steps: CombatStepDefinition[]): SkillCastDocument {
  return {
    id: 'cast:1',
    source: { kind: 'operatorSkill', skillGroupKey: 'battleSkill', skillKey: 'battleSkill' },
    placement: { startFrame: 30 },
    presentation: {
      locked: false,
      disabled: false,
      customBars: [],
    },
    customDefinition: {
      key: 'battleSkill',
      timelineBlockFrames: 30,
      scheduledSequences: [
        {
          startFrame: 10,
          sequence: { steps },
        },
      ],
    },
  };
}

function damageStep(stepKey: string | undefined, hitKey: string): CombatStepDefinition {
  return {
    kind: 'dealDamage',
    key: stepKey ?? hitKey,
    parameters: { damageType: 'electric', attackScale: 1, tags: [] },
  };
}

describe('projectCastHitMarkers', () => {
  it('keeps delayed hits beyond the skill block at their actual horizontal position', () => {
    expect(projectTimelineHitMarkerLeftPx(-3)).toBe(0);
    expect(projectTimelineHitMarkerLeftPx(120)).toBe(120);
  });

  it('把调度帧与放置帧合并为绝对偏移，并保留定义步骤键', () => {
    const cast = createCast([damageStep('step:damage', 'hit:1'), damageStep(undefined, 'hit:2')]);
    const markers = projectCastHitMarkers(cast, fixtureDef(cast));
    expect(markers).toEqual([
      {
        hitId: deriveHitId('cast:1', 'step:damage'),
        frameOffset: 10,
        stepKey: 'step:damage',
        conditional: false,
      },
      {
        hitId: deriveHitId('cast:1', 'hit:2'),
        frameOffset: 10,
        stepKey: 'hit:2',
        conditional: false,
      },
    ]);
  });

  it('递归收集条件分支与 once 体内的命中标记并标记条件性', () => {
    const cast = createCast([
      {
        kind: 'conditional',
        parameters: { condition: { kind: 'combatActive' } },
        whenTrue: {
          steps: [
            damageStep(undefined, 'hit:true'),
            {
              kind: 'once',
              parameters: { scopeKey: 'nested' },
              body: { steps: [damageStep(undefined, 'hit:once')] },
            },
          ],
        },
        whenFalse: {
          steps: [damageStep(undefined, 'hit:false')],
        },
      },
    ] as CombatStepDefinition[]);
    const markers = projectCastHitMarkers(cast, fixtureDef(cast));
    expect(markers.map(marker => [marker.hitId, marker.conditional])).toEqual([
      [deriveHitId('cast:1', 'hit:true'), true],
      [deriveHitId('cast:1', 'hit:once'), true],
      [deriveHitId('cast:1', 'hit:false'), true],
    ]);
  });

  it('按稳定身份查询命中标记', () => {
    const cast = createCast([damageStep(undefined, 'hit:1')]);
    expect(findCastHitMarker(cast, 'hit:1', fixtureDef(cast))?.frameOffset).toBe(10);
    expect(findCastHitMarker(cast, 'hit:missing', fixtureDef(cast))).toBeNull();
  });

  it('collects ability-entity child hits with a local fallback offset', () => {
    const cast = createCast([
      {
        kind: 'spawnAbilityEntity',
        parameters: {
          abilityEntityId: 'ability:test',
          dieWhenSourceDies: false,
          inheritActionBlackboard: true,
          definition: {
            lifetime: { kind: 'limited', durationSeconds: 1 },
            childSkill: {
              skillId: 'child',
              scheduledSequences: [
                {
                  startFrame: 7,
                  sequence: { steps: [damageStep('child-hit', 'child-hit')] },
                },
              ],
            },
          },
        },
      },
    ]);

    expect(projectCastHitMarkers(cast, fixtureDef(cast))).toContainEqual({
      hitId: deriveHitId('cast:1', 'child-hit'),
      frameOffset: 17,
      stepKey: 'child-hit',
      conditional: false,
    });
  });

  it('空技能释放不产生命中标记', () => {
    const emptyCast = createCast([]);
    expect(projectCastHitMarkers(emptyCast, fixtureDef(emptyCast))).toEqual([]);
  });
});
