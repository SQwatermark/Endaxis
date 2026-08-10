import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import type { ScenarioDocument } from '../../core/project/schema';
import { projectHitEffectsByCast } from './timelineHitEffects';

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
        operator: {
          id: 'perlica',
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
            editable: {
              durationFrames: 30,
              locked: false,
              disabled: false,
              scheduledSequences: [
                {
                  id: 'sequence:1',
                  startFrame: 10,
                  sequence: {
                    steps: [
                      {
                        kind: 'dealDamage',
                        parameters: { damageType: 'electric', attackScale: 1, tags: [] },
                        sourceStepKey: 'step:damage',
                        hitId: 'hit:keyed',
                        edited: [],
                      },
                      {
                        kind: 'dealDamage',
                        parameters: { damageType: 'physical', attackScale: 1, tags: [] },
                        hitId: 'hit:plain',
                        edited: [],
                      },
                    ],
                  },
                  edited: [],
                },
              ],
              customBars: [],
            },
            edited: [],
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
          nodeCount: 1,
          nodeDurationFrames: 60,
          brokenDurationFrames: 300,
          finisherRecovery: 100,
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

function damageEntry(sequence: number, frame: number, stepKey?: string): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: 'DamageApplied',
    sourceId: 'perlica',
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
    sourceId: 'perlica',
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
    );

    // 带步骤键的标记只匹配同键事实；无步骤键的标记按（帧、来源）匹配全部事实。
    expect(effects.get('hit:keyed')).toEqual({
      damage: [{ value: 100, damageType: 'physical', isCritical: false }],
      infliction: [],
      reactions: [],
    });
    expect(effects.get('hit:plain')).toEqual({
      damage: [
        { value: 100, damageType: 'physical', isCritical: false },
        { value: 100, damageType: 'physical', isCritical: false },
      ],
      infliction: [],
      reactions: [],
    });
  });

  it('把同帧附着归因到命中标记', () => {
    const scenario = scenarioWithCast();
    const effects = projectHitEffectsByCast(
      scenario,
      [damageEntry(1, 40), inflictionEntry(2, 40)],
      'cast:1',
    );

    expect(effects.get('hit:keyed')?.infliction).toEqual([
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
          sourceId: 'perlica',
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
    );

    expect(effects.get('hit:keyed')?.reactions).toEqual([
      { reaction: 'electrification', applied: true, level: 1, previousLevel: 0 },
    ]);
  });

  it('无匹配事实的命中标记不出现，未知释放返回空映射', () => {
    const scenario = scenarioWithCast();
    const effects = projectHitEffectsByCast(scenario, [damageEntry(1, 999)], 'cast:1');
    expect(effects.size).toBe(0);
    expect(projectHitEffectsByCast(scenario, [damageEntry(1, 40)], 'cast:missing').size).toBe(0);
  });
});
