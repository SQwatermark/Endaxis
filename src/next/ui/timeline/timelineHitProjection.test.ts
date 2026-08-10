import { describe, expect, it } from 'vitest';
import type { CombatStepDocument, SkillCastDocument } from '../../core/project/schema';
import { projectCastHitMarkers, findCastHitMarker } from './timelineHitProjection';

function createCast(steps: CombatStepDocument[]): SkillCastDocument {
  return {
    id: 'cast:1',
    source: { kind: 'operatorSkill', skillGroupKey: 'battleSkill', skillKey: 'battleSkill' },
    placement: { startFrame: 30 },
    editable: {
      durationFrames: 30,
      locked: false,
      disabled: false,
      scheduledSequences: [
        {
          id: 'sequence:1',
          startFrame: 10,
          sequence: { steps },
          edited: [],
        },
      ],
      customBars: [],
    },
    edited: [],
  };
}

function damageStep(key: string | undefined, hitId: string): CombatStepDocument {
  return {
    kind: 'dealDamage',
    parameters: { damageType: 'electric', attackScale: 1, tags: [] },
    ...(key === undefined ? {} : { sourceStepKey: key }),
    hitId,
    edited: [],
  };
}

describe('projectCastHitMarkers', () => {
  it('把调度帧与放置帧合并为绝对偏移，并保留定义步骤键', () => {
    const markers = projectCastHitMarkers(
      createCast([damageStep('step:damage', 'hit:1'), damageStep(undefined, 'hit:2')]),
    );
    expect(markers).toEqual([
      { hitId: 'hit:1', frameOffset: 10, stepKey: 'step:damage', conditional: false },
      { hitId: 'hit:2', frameOffset: 10, conditional: false },
    ]);
  });

  it('递归收集条件分支与 once 体内的命中标记并标记条件性', () => {
    const markers = projectCastHitMarkers(
      createCast([
        {
          kind: 'conditional',
          parameters: {
            condition: { kind: 'combatActive' },
          },
          whenTrue: {
            steps: [
              damageStep(undefined, 'hit:true'),
              {
                kind: 'once',
                parameters: { scopeKey: 'nested' },
                body: { steps: [damageStep(undefined, 'hit:once')] },
                edited: [],
              },
            ],
          },
          whenFalse: {
            steps: [damageStep(undefined, 'hit:false')],
          },
          edited: [],
        },
      ]),
    );
    expect(markers.map(marker => [marker.hitId, marker.conditional])).toEqual([
      ['hit:true', true],
      ['hit:once', true],
      ['hit:false', true],
    ]);
  });

  it('按稳定身份查询命中标记', () => {
    const cast = createCast([damageStep(undefined, 'hit:1')]);
    expect(findCastHitMarker(cast, 'hit:1')?.frameOffset).toBe(10);
    expect(findCastHitMarker(cast, 'hit:missing')).toBeNull();
  });

  it('空技能释放不产生命中标记', () => {
    expect(projectCastHitMarkers(createCast([]))).toEqual([]);
  });
});
