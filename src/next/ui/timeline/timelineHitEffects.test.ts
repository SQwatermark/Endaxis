import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import type { ScenarioDocument } from '../../core/project/schema';
import { deriveHitId } from '../../core/combat/timeline/deriveHitId';
import { projectHitEffectsByCast } from './timelineHitEffects';
import { projectCastHitMarkers } from './timelineHitProjection';

function baseDamage(): Record<string, number | boolean | string | null> {
  return {
    damageType: 'physical',
    value: 100,
    actualDamage: 95,
    remainingHealth: 9905,
    isCritical: false,
    criticalMultiplier: 1,
    defenseMultiplier: 1,
    resistanceMultiplier: 1,
    weaknessShelterMultiplier: 1,
    runtimeExtensionMultiplier: 1,
    igniteMultiplier: 1,
    physicalInflictionMultiplier: 1,
  };
}

function scenarioWithCast(): ScenarioDocument {
  return {
    id: 'scenario:hit-effects',
    name: '命中效果',
    tracks: [
      {
        id: 'track:0',
        operator: {
          operatorSlug: 'perlica',
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: {},
          talentStates: {},
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [
          {
            id: 'cast:1',
            source: {
              kind: 'operatorSkill',
              skillGroupKey: 'battleSkill',
              skillKey: 'battleSkill',
            },
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
                  sequence: {
                    steps: [
                      {
                        kind: 'dealDamage',
                        parameters: { damageType: 'electric', attackScale: 1, tags: [] },
                        key: 'step:damage',
                      },
                      {
                        kind: 'dealDamage',
                        parameters: { damageType: 'physical', attackScale: 1, tags: [] },
                        key: 'step:secondary',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      null,
      null,
      null,
    ],
    connections: [],
    enemy: {
      source: { kind: 'custom', level: 90 },
      editable: {
        hp: 10000,
        defense: 100,
        superArmor: 0,
        finisherMultiplier: 1,
        resistances: {},
        stagger: {
          maximum: 300,
          knotThresholds: [0.5],
          knotBreakDurationFrames: 60,
          brokenDurationFrames: 300,
          finisherSpRecovery: 100,
        },
      },
      edited: [],
    },
    battle: {
      prepFrames: 150,
      durationFrames: 3600,
      resourceRules: {
        maxSp: 300,
        initialSp: 300,
        spRecoveryPerSecond: 10,
        defaultSkillSpCost: 100,
      },
      cycleBoundaries: [],
      controlSwitches: [],
    },
    mechanics: { selections: [] },
    globalConfig: { modifiers: [] },
    editor: { trackHeightWeights: [1, 1, 1, 1], prepExpanded: true },
  };
}

function markersForCast(scenario: ScenarioDocument, castId: string) {
  const cast = scenario.tracks.flatMap(track => track?.skillCasts ?? []).find(c => c.id === castId);
  if (cast === undefined || cast.customDefinition === undefined) return [];
  return projectCastHitMarkers(cast, cast.customDefinition);
}

function damageEntry(sequence: number, frame: number, stepKey?: string): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: 'DamageApplied',
    sourceId: 'track:0',
    targetId: 'enemy',
    data: { ...baseDamage(), ...(stepKey === undefined ? {} : { stepKey }) },
  };
}

function inflictionEntry(sequence: number, frame: number): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: 'ElementalInflictionApplied',
    sourceId: 'track:0',
    targetId: 'enemy',
    data: {
      skillId: 'battleSkill',
      requestedElement: 'electric',
      isExtra: false,
      previousElement: null,
      previousLayers: 0,
      currentElement: 'electric',
      currentLayers: 1,
      outcomeKind: 'attachmentOnly',
      operationKinds: 'addAttachment',
    },
  };
}

describe('projectHitEffectsByCast', () => {
  it('按帧与来源把伤害归因到命中标记，带步骤键时精确匹配', () => {
    const scenario = scenarioWithCast();
    const effects = projectHitEffectsByCast(
      scenario,
      [damageEntry(1, 40, 'step:damage'), damageEntry(2, 40), damageEntry(3, 90)],
      'cast:1',
      markersForCast(scenario, 'cast:1'),
    );

    const hitId = deriveHitId('cast:1', 'step:damage');
    expect(effects.get(hitId)).toEqual({
      damage: [{ value: 100, damageType: 'physical', isCritical: false }],
      infliction: [],
      reactions: [],
    });
    expect(effects.size).toBe(1);
  });

  it('把同帧附着归因到命中标记', () => {
    const scenario = scenarioWithCast();
    const effects = projectHitEffectsByCast(
      scenario,
      [damageEntry(1, 40), inflictionEntry(2, 40)],
      'cast:1',
      markersForCast(scenario, 'cast:1'),
    );

    expect(effects.get(deriveHitId('cast:1', 'step:damage'))?.infliction).toEqual([
      { element: 'electric', outcomeKind: 'attachmentOnly', currentLayers: 1 },
    ]);
  });

  it('把同帧反应事实归因到命中标记', () => {
    const scenario = scenarioWithCast();
    const effects = projectHitEffectsByCast(
      scenario,
      [
        damageEntry(1, 40),
        {
          sequence: 2,
          frame: 40,
          time: 40 / 30,
          event: 'ElementalReactionApplied',
          sourceId: 'track:0',
          targetId: 'enemy',
          data: {
            reaction: 'electrification',
            previousLevel: 0,
            level: 1,
            durationSeconds: 5,
            effectiveness: 1,
          },
        },
      ],
      'cast:1',
      markersForCast(scenario, 'cast:1'),
    );

    expect(effects.get(deriveHitId('cast:1', 'step:damage'))?.reactions).toEqual([
      { reaction: 'electrification', applied: true, level: 1, previousLevel: 0 },
    ]);
  });

  it('无匹配事实的命中标记不出现，未知释放返回空映射', () => {
    const scenario = scenarioWithCast();
    const effects = projectHitEffectsByCast(
      scenario,
      [damageEntry(1, 999)],
      'cast:1',
      markersForCast(scenario, 'cast:1'),
    );
    expect(effects.size).toBe(0);
    expect(
      projectHitEffectsByCast(
        scenario,
        [damageEntry(1, 40)],
        'cast:missing',
        markersForCast(scenario, 'cast:1'),
      ).size,
    ).toBe(0);
  });
});
