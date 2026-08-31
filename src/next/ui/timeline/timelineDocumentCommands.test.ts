import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument, SkillCastDocument } from '../../core/project/schema';
import type { SkillDefinition } from '../../core/game-data/operatorDefinition';
import {
  addControlSwitch,
  addCycleBoundary,
  addExternalEventMarker,
  applyInitialUltimateEnergyPreset,
  moveControlSwitch,
  moveCycleBoundary,
  moveExternalEventMarker,
  removeControlSwitch,
  removeCycleBoundary,
  removeExternalEventMarker,
  clearSimulationRangeBoundary,
  createSkillDefinitionDraft,
  moveSkillCast,
  moveSkillCasts,
  removeSkillCast,
  removeSkillCasts,
  resetSkillCastToTemplate,
  setSkillCastColor,
  setSkillCastCustomBars,
  setSkillCastCameraTargetAngle,
  setSkillCastDisabled,
  setSkillCastForcedCritical,
  setSkillCastLocked,
  setSkillCastCustomDefinition,
  setUnifiedInitialUltimateEnergy,
  setGlobalOperatorStatModifiers,
  setSimulationRangeBoundary,
  setControlSwitchTrack,
  setBattleDurationFrames,
  setBattlePrepFrames,
  setTrackGear,
  setTrackOperator,
  setTrackWeapon,
  swapTimelineTracks,
  updateBattleResourceRule,
  updateExternalEventMarker,
  updateTrackInitialUltimateEnergy,
} from './timelineDocumentCommands';

describe('battle axis commands', () => {
  it('changes the visual prep inset without shifting real battle frames', () => {
    const original = scenario();
    const updated = setBattlePrepFrames(original, 60);
    expect(updated.battle.prepFrames).toBe(60);
    expect(updated.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(
      original.tracks[0]!.skillCasts[0]!.placement.startFrame,
    );
    expect(setBattlePrepFrames(updated, 60)).toBe(updated);
    expect(() => setBattlePrepFrames(original, -1)).toThrow('non-negative integer');
  });

  it('shortens the battle axis only as far as its latest stable timeline object', () => {
    const original = scenario();
    original.tracks[0]!.skillCasts[0]!.placement.startFrame = 80;
    original.battle.cycleBoundaries.push({ id: 'cycle:latest', frame: 120 });
    original.battle.externalEventMarkers = [
      {
        id: 'external:latest',
        frame: 150,
        target: { scope: 'operator', trackIndex: 0 },
        event: { kind: 'operatorHit', tags: [], features: [] },
      },
    ];
    original.battle.simulationRange = { endFrame: 180 };

    expect(setBattleDurationFrames(original, 60).battle.durationFrames).toBe(180);
    expect(setBattleDurationFrames(original, 240).battle.durationFrames).toBe(240);
    expect(() => setBattleDurationFrames(original, 0)).toThrow('positive integer');
  });
});

describe('skill cast custom bars', () => {
  it('replaces an isolated real-frame presentation list without mutating the source', () => {
    const original = scenario();
    const bars = [{ id: 'bar:1', text: '强化', offsetFrames: 6, durationFrames: 90 }];

    const updated = setSkillCastCustomBars(original, 0, 'cast:1', bars);

    expect(updated.tracks[0]!.skillCasts[0]!.presentation?.customBars).toEqual(bars);
    expect(original.tracks[0]!.skillCasts[0]!.presentation?.customBars).toBeUndefined();
    expect(setSkillCastCustomBars(updated, 0, 'cast:1', bars)).toBe(updated);
  });

  it('rejects invalid identities and frame values', () => {
    const original = scenario();
    expect(() =>
      setSkillCastCustomBars(original, 0, 'cast:1', [
        { id: '', text: '', offsetFrames: 0, durationFrames: 1 },
      ]),
    ).toThrow('non-empty and unique');
    expect(() =>
      setSkillCastCustomBars(original, 0, 'cast:1', [
        { id: 'bar:1', text: '', offsetFrames: -1, durationFrames: 1 },
      ]),
    ).toThrow('offsetFrames');
  });
});

describe('updateBattleResourceRule', () => {
  it('updates shared SP rules without mutating the scenario', () => {
    const original = scenario();
    const updated = updateBattleResourceRule(original, 'spRecoveryPerSecond', 18.5);

    expect(updated).not.toBe(original);
    expect(updated.battle.resourceRules.spRecoveryPerSecond).toBe(18.5);
    expect(original.battle.resourceRules.spRecoveryPerSecond).not.toBe(18.5);
  });

  it('clamps initial SP when the maximum is reduced', () => {
    const original = scenario();
    original.battle.resourceRules.initialSp = 200;

    expect(updateBattleResourceRule(original, 'maxSp', 120).battle.resourceRules).toMatchObject({
      maxSp: 120,
      initialSp: 120,
    });
    expect(
      updateBattleResourceRule(original, 'initialSp', 400).battle.resourceRules.initialSp,
    ).toBe(original.battle.resourceRules.maxSp);
  });

  it('rejects invalid values and preserves no-op identity', () => {
    const original = scenario();
    expect(
      updateBattleResourceRule(original, 'initialSp', original.battle.resourceRules.initialSp),
    ).toBe(original);
    expect(() => updateBattleResourceRule(original, 'initialSp', -1)).toThrow(
      'initialSp must be a non-negative finite number',
    );
  });
});

describe('setGlobalOperatorStatModifiers', () => {
  it('stores a cloned semantic list and keeps the source scenario immutable', () => {
    const original = scenario();
    const modifiers = [
      {
        id: 'global:modifier:1',
        kind: 'operatorStat' as const,
        modifier: 'criticalRate' as const,
        value: 0.2,
      },
      {
        id: 'global:modifier:2',
        kind: 'operatorStat' as const,
        modifier: 'skillCooldownReduction' as const,
        value: 0.5,
        skillType: 'comboSkill' as const,
      },
    ];
    const updated = setGlobalOperatorStatModifiers(original, modifiers);

    expect(original.globalConfig.modifiers).toEqual([]);
    expect(updated.globalConfig.modifiers).toEqual(modifiers);
    expect(updated.globalConfig.modifiers).not.toBe(modifiers);
    expect(setGlobalOperatorStatModifiers(updated, modifiers)).toBe(updated);
  });

  it('rejects duplicate ids, unsupported scopes, and invalid cooldown ratios', () => {
    const original = scenario();
    expect(() =>
      setGlobalOperatorStatModifiers(original, [
        { id: 'same', kind: 'operatorStat', modifier: 'criticalRate', value: 0.1 },
        { id: 'same', kind: 'operatorStat', modifier: 'criticalDamage', value: 0.1 },
      ]),
    ).toThrow('unique');
    expect(() =>
      setGlobalOperatorStatModifiers(original, [
        {
          id: 'scoped',
          kind: 'operatorStat',
          modifier: 'criticalRate',
          value: 0.1,
          skillType: 'comboSkill',
        },
      ]),
    ).toThrow('does not support');
    expect(() =>
      setGlobalOperatorStatModifiers(original, [
        {
          id: 'cooldown',
          kind: 'operatorStat',
          modifier: 'skillCooldownReduction',
          value: 1,
          skillType: 'comboSkill',
        },
      ]),
    ).toThrow('less than 1');
  });
});

describe('initial ultimate energy presets', () => {
  it('cycles empty, full and the remembered per-track custom profile', () => {
    const original = scenario();
    original.tracks[0]!.initialState.ultimateEnergy = 40;
    const custom = updateTrackInitialUltimateEnergy(original, 0, 40, 100);
    const empty = applyInitialUltimateEnergyPreset(custom, 'empty', [100, null, null, null]);
    const full = applyInitialUltimateEnergyPreset(empty, 'full', [100, null, null, null]);
    const restored = applyInitialUltimateEnergyPreset(full, 'custom', [100, null, null, null]);

    expect(empty.tracks[0]!.initialState.ultimateEnergy).toBe(0);
    expect(full.tracks[0]!.initialState.ultimateEnergy).toBe(100);
    expect(restored.tracks[0]!.initialState.ultimateEnergy).toBe(40);
    expect(restored.editor.initialUltimateEnergyPreset?.mode).toBe('custom');
  });

  it('right-click unified values are clamped per track and become the custom profile', () => {
    const original = scenario();
    original.tracks[1] = {
      ...original.tracks[0]!,
      id: 'track:1',
      skillCasts: [],
    };
    const updated = setUnifiedInitialUltimateEnergy(original, 80, [100, 60, null, null]);
    expect(updated.tracks[0]!.initialState.ultimateEnergy).toBe(80);
    expect(updated.tracks[1]!.initialState.ultimateEnergy).toBe(60);
    expect(updated.editor.initialUltimateEnergyPreset).toEqual({
      mode: 'custom',
      customByTrackId: { 'track:0': 80, 'track:1': 60 },
    });
  });
});

describe('swapTimelineTracks', () => {
  it('swaps complete track slots and remaps control switches', () => {
    const original = createEmptyScenario('scenario:tracks', '轨道排序样本');
    original.tracks[0] = {
      ...scenario().tracks[0]!,
      id: 'operator:a',
      operator: perlicaBuild,
    };
    original.tracks[1] = {
      ...scenario().tracks[0]!,
      id: 'operator:b',
      operator: perlicaBuild,
    };
    original.battle.controlSwitches = [
      { id: 'switch:a', frame: 0, trackIndex: 0 },
      { id: 'switch:b', frame: 30, trackIndex: 1 },
      { id: 'switch:c', frame: 60, trackIndex: 2 },
    ];

    const swapped = swapTimelineTracks(original, 0, 1);

    expect(swapped.tracks[0]?.id).toBe('operator:b');
    expect(swapped.tracks[1]?.id).toBe('operator:a');
    expect(swapped.battle.controlSwitches.map(value => value.trackIndex)).toEqual([1, 0, 2]);
    expect(original.tracks[0]?.id).toBe('operator:a');
  });
});

describe('updateTrackInitialUltimateEnergy', () => {
  it('updates the persistent track value and clamps it to the resolved maximum', () => {
    const original = scenario();
    const updated = updateTrackInitialUltimateEnergy(original, 0, 120, 80);

    expect(updated.tracks[0]?.initialState.ultimateEnergy).toBe(80);
    expect(original.tracks[0]?.initialState.ultimateEnergy).toBe(0);
    expect(updateTrackInitialUltimateEnergy(updated, 0, 80, 80)).toBe(updated);
  });

  it('rejects empty tracks and invalid numeric boundaries', () => {
    const original = scenario();
    expect(() => updateTrackInitialUltimateEnergy(original, 1, 10, 80)).toThrow('empty');
    expect(() => updateTrackInitialUltimateEnergy(original, 0, Number.NaN, 80)).toThrow(
      'finite non-negative',
    );
  });
});

const perlicaBuild = {
  operatorSlug: 'perlica',
  level: 90,
  promoted: true,
  potential: 0,
  trustLevel: 4,
  skillLevels: { basicAttack: 12 },
  talentStates: {},
};

function cast(locked = false): SkillCastDocument {
  return {
    id: 'cast:1',
    source: { kind: 'operatorSkill', skillGroupKey: 'skill', skillKey: 'skill' },
    placement: { startFrame: 30 },
    ...(locked ? { presentation: { locked: true } } : {}),
  };
}

function scenario(locked = false) {
  const value = createEmptyScenario('scenario:move', '移动样本');
  value.tracks[0] = {
    id: 'track:0',
    operator: null,
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [cast(locked)],
  };
  return value;
}

describe('moveSkillCast', () => {
  it('assigns an operator to an empty track', () => {
    const original = createEmptyScenario('scenario:operator', '干员样本');
    const updated = setTrackOperator(original, 2, perlicaBuild, 'track:2');

    expect(updated.tracks[2]).toMatchObject({
      operator: perlicaBuild,
      weapon: null,
      skillCasts: [],
    });
    expect(original.tracks[2]).toBeNull();
  });

  it('clears stale casts, connections and track equipment when changing operator', () => {
    const original = scenario();
    original.tracks[0] = {
      ...original.tracks[0]!,
      operator: perlicaBuild,
      weapon: {
        weaponSlug: 'old',
        level: 90,
        tuned: true,
        potential: 0,
        traitLevels: [1],
      },
      gears: {
        armor: { gearSlug: 'old', artificingLevels: [0] },
        gloves: null,
        accessory1: null,
        accessory2: null,
      },
    };
    original.connections = [
      {
        id: 'connection:1',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1' },
        to: { kind: 'skillCast', skillCastId: 'cast:2' },
      },
    ];
    const arcaneBuild = { ...perlicaBuild, operatorSlug: 'arcane' };

    const updated = setTrackOperator(original, 0, arcaneBuild, 'track:0');

    expect(updated.tracks[0]!.operator).toEqual(arcaneBuild);
    expect(updated.tracks[0]!.skillCasts).toEqual([]);
    expect(updated.connections).toEqual([]);
    expect(updated.tracks[0]!.weapon).toBeNull();
    expect(updated.tracks[0]!.gears).toEqual({
      armor: null,
      gloves: null,
      accessory1: null,
      accessory2: null,
    });
  });

  it('leaves the document unchanged when selecting the current operator again', () => {
    const original = scenario();
    original.tracks[0] = { ...original.tracks[0]!, operator: perlicaBuild };

    expect(setTrackOperator(original, 0, { ...perlicaBuild }, 'track:0')).toBe(original);
  });

  it('assigns, replaces and removes a weapon on a track', () => {
    const original = scenario();
    original.tracks[0] = { ...original.tracks[0]!, operator: perlicaBuild };
    const first = {
      weaponSlug: 'first',
      level: 90,
      tuned: true,
      potential: 0,
      traitLevels: [1, 1, 1],
    };
    const second = { ...first, weaponSlug: 'second' };

    const equipped = setTrackWeapon(original, 0, first);
    const replaced = setTrackWeapon(equipped, 0, second);
    const cleared = setTrackWeapon(replaced, 0, null);

    expect(equipped.tracks[0]!.weapon).toEqual(first);
    expect(replaced.tracks[0]!.weapon).toEqual(second);
    expect(cleared.tracks[0]!.weapon).toBeNull();
    expect(original.tracks[0]!.weapon).toBeNull();
  });

  it('rejects equipping a weapon on an empty track', () => {
    const original = createEmptyScenario('scenario:empty-weapon', '空轨道');
    expect(() =>
      setTrackWeapon(original, 0, {
        weaponSlug: 'first',
        level: 90,
        tuned: true,
        potential: 0,
        traitLevels: [1],
      }),
    ).toThrow('track 0 is empty');
  });

  it('assigns independent gear slots and clears them separately', () => {
    const original = scenario();
    const armor = { gearSlug: 'armor', artificingLevels: [0, 0, 0] };
    const accessory = {
      gearSlug: 'accessory',
      artificingLevels: [0, 0],
    };

    const armored = setTrackGear(original, 0, 'armor', armor);
    const equipped = setTrackGear(armored, 0, 'accessory1', accessory);
    const cleared = setTrackGear(equipped, 0, 'armor', null);

    expect(equipped.tracks[0]!.gears).toEqual({
      armor: armor,
      gloves: null,
      accessory1: accessory,
      accessory2: null,
    });
    expect(cleared.tracks[0]!.gears.armor).toBeNull();
    expect(cleared.tracks[0]!.gears.accessory1).toEqual(accessory);
    expect(original.tracks[0]!.gears).toEqual({
      armor: null,
      gloves: null,
      accessory1: null,
      accessory2: null,
    });
  });

  it('rejects equipping gear on an empty track', () => {
    const original = createEmptyScenario('scenario:empty-gear', '空轨道');
    expect(() =>
      setTrackGear(original, 0, 'armor', {
        gearSlug: 'armor',
        artificingLevels: [0],
      }),
    ).toThrow('track 0 is empty');
  });

  it('moves only the requested cast without mutating the source scenario', () => {
    const original = scenario();
    const moved = moveSkillCast(original, 0, 'cast:1', 75);

    expect(original.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(30);
    expect(moved.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(75);
    expect(moved.tracks[1]).toBe(original.tracks[1]);
  });

  it('does not move a locked cast', () => {
    const original = scenario(true);
    expect(moveSkillCast(original, 0, 'cast:1', 75)).toBe(original);
  });

  it('rejects invalid frames and missing cast identities', () => {
    expect(() => moveSkillCast(scenario(), 0, 'cast:1', 1.5)).toThrow('non-negative integer');
    expect(() => moveSkillCast(scenario(), 0, 'missing', 30)).toThrow("no skill cast 'missing'");
  });

  it('updates lock and disabled states without mutating the source', () => {
    const original = scenario();
    const locked = setSkillCastLocked(original, 0, 'cast:1', true);
    const disabled = setSkillCastDisabled(locked, 0, 'cast:1', true);

    expect(original.tracks[0]!.skillCasts[0]!.presentation).toBeUndefined();
    expect(disabled.tracks[0]!.skillCasts[0]!.presentation).toMatchObject({
      locked: true,
      disabled: true,
    });
  });

  it('sets and clears an action color as a presentation field', () => {
    const original = scenario();
    const colored = setSkillCastColor(original, 0, 'cast:1', '#ff4d4f');
    const reset = setSkillCastColor(colored, 0, 'cast:1', null);

    expect(colored.tracks[0]!.skillCasts[0]!.presentation?.color).toBe('#ff4d4f');
    expect(reset.tracks[0]!.skillCasts[0]!.presentation?.color).toBeNull();
    expect(original.tracks[0]!.skillCasts[0]!.presentation).toBeUndefined();
  });

  it('sets and clears a cast-specific signed camera angle', () => {
    const original = scenario();
    const configured = setSkillCastCameraTargetAngle(original, 0, 'cast:1', -37.5);

    expect(
      configured.tracks[0]!.skillCasts[0]!.simulationInputs?.cameraToTargetSignedAngleDegrees,
    ).toBe(-37.5);
    expect(original.tracks[0]!.skillCasts[0]!.simulationInputs).toBeUndefined();
    expect(setSkillCastCameraTargetAngle(configured, 0, 'cast:1', -37.5)).toBe(configured);

    const cleared = setSkillCastCameraTargetAngle(configured, 0, 'cast:1', null);
    expect(cleared.tracks[0]!.skillCasts[0]!.simulationInputs).toBeUndefined();
  });

  it('rejects an invalid cast-specific signed camera angle', () => {
    const original = scenario();
    expect(() => setSkillCastCameraTargetAngle(original, 0, 'cast:1', 181)).toThrow(
      'between -180 and 180 degrees',
    );
    expect(() => setSkillCastCameraTargetAngle(original, 0, 'cast:1', Number.NaN)).toThrow(
      'between -180 and 180 degrees',
    );
  });

  it('stores forced critical hits by stable step key and removes empty simulation inputs', () => {
    const original = scenario();
    const forced = setSkillCastForcedCritical(original, 0, 'cast:1', 'damage:1', true);

    expect(forced.tracks[0]!.skillCasts[0]!.simulationInputs?.forcedCriticalStepKeys).toEqual([
      'damage:1',
    ]);
    expect(setSkillCastForcedCritical(forced, 0, 'cast:1', 'damage:1', true)).toBe(forced);

    const cleared = setSkillCastForcedCritical(forced, 0, 'cast:1', 'damage:1', false);
    expect(cleared.tracks[0]!.skillCasts[0]!.simulationInputs).toBeUndefined();
  });

  it('stores an independent complete custom definition and can return to the template', () => {
    const original = scenario();
    const definition: SkillDefinition = {
      key: 'skill',
      timelineBlockFrames: 45,
      scheduledSequences: [{ startFrame: 0, sequence: { steps: [] } }],
    };

    const customized = setSkillCastCustomDefinition(original, 0, 'cast:1', definition);
    const stored = customized.tracks[0]!.skillCasts[0]!.customDefinition!;
    expect(stored).toEqual(definition);
    expect(stored).not.toBe(definition);

    const mutableSequence = definition.scheduledSequences[0] as { startFrame: number };
    mutableSequence.startFrame = 9;
    expect(stored.scheduledSequences[0]!.startFrame).toBe(0);

    const reset = resetSkillCastToTemplate(customized, 0, 'cast:1');
    expect(reset.tracks[0]!.skillCasts[0]!.customDefinition).toBeUndefined();
    expect(resetSkillCastToTemplate(reset, 0, 'cast:1')).toBe(reset);
  });

  it('creates an isolated editor draft before the definition is committed', () => {
    const definition: SkillDefinition = {
      key: 'skill',
      timelineBlockFrames: 30,
      scheduledSequences: [{ startFrame: 0, sequence: { steps: [] } }],
    };

    const draft = createSkillDefinitionDraft(definition);
    (draft.scheduledSequences[0] as { startFrame: number }).startFrame = 12;

    expect(definition.scheduledSequences[0]!.startFrame).toBe(0);
    expect(draft.scheduledSequences[0]!.startFrame).toBe(12);
  });

  it('rejects a custom definition that cannot replace the referenced template', () => {
    const original = scenario();
    const wrongDefinition: SkillDefinition = {
      key: 'other',
      timelineBlockFrames: 30,
      scheduledSequences: [],
    };

    expect(() => setSkillCastCustomDefinition(original, 0, 'cast:1', wrongDefinition)).toThrow(
      'does not match source skill key',
    );
  });

  it('rejects an invalid custom definition before changing the scenario', () => {
    const original = scenario();
    const invalidDefinition = {
      key: 'skill',
      timelineBlockFrames: -1,
      scheduledSequences: [],
    } as unknown as SkillDefinition;

    expect(() => setSkillCastCustomDefinition(original, 0, 'cast:1', invalidDefinition)).toThrow(
      "invalid custom definition at 'customDefinition.timelineBlockFrames'",
    );
    expect(original.tracks[0]!.skillCasts[0]!.customDefinition).toBeUndefined();
  });

  it('removes the cast and every connection that points to it', () => {
    const original = scenario();
    original.connections = [
      {
        id: 'connection:1',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1' },
        to: { kind: 'damageHit', skillCastId: 'cast:2', stepKey: 'hit:1' },
      },
      {
        id: 'connection:2',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:2' },
        to: { kind: 'skillCast', skillCastId: 'cast:3' },
      },
    ];

    const removed = removeSkillCast(original, 0, 'cast:1');
    expect(removed.tracks[0]!.skillCasts).toEqual([]);
    expect(removed.connections.map(connection => connection.id)).toEqual(['connection:2']);
    expect(original.tracks[0]!.skillCasts).toHaveLength(1);
  });

  it('removes a member from a set of casts and preserves the remaining casts', () => {
    const original = scenario();
    const grouped = [0, 1, 2].map(index => ({
      ...cast(),
      id: `cast:${index + 1}`,
    }));
    original.tracks[0]!.skillCasts = grouped;

    const twoMembers = removeSkillCast(original, 0, 'cast:2');
    expect(twoMembers.tracks[0]!.skillCasts.map(value => value.id)).toEqual(['cast:1', 'cast:3']);

    const oneMember = removeSkillCast(twoMembers, 0, 'cast:1');
    expect(oneMember.tracks[0]!.skillCasts.map(value => value.id)).toEqual(['cast:3']);
  });

  it('removes selected casts across tracks as one immutable command', () => {
    const original = scenario();
    original.tracks[0]!.skillCasts.push({ ...cast(), id: 'cast:2' });
    original.tracks[1] = {
      id: 'track:1',
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [{ ...cast(), id: 'cast:3' }],
    };
    original.connections = [
      {
        id: 'connection:1',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1' },
        to: { kind: 'skillCast', skillCastId: 'cast:3' },
      },
    ];

    const removed = removeSkillCasts(original, new Set(['cast:1', 'cast:3']));

    expect(removed.tracks[0]!.skillCasts.map(value => value.id)).toEqual(['cast:2']);
    expect(removed.tracks[1]!.skillCasts).toEqual([]);
    expect(removed.connections).toEqual([]);
    expect(original.tracks[0]!.skillCasts).toHaveLength(2);
  });

  it('ignores stale batch selection identities without creating a document revision', () => {
    const original = scenario();
    expect(removeSkillCasts(original, new Set())).toBe(original);
    expect(removeSkillCasts(original, new Set(['missing']))).toBe(original);
  });
});

describe('moveSkillCasts', () => {
  function multiTrackScenario() {
    const value = scenario();
    value.tracks[0]!.skillCasts.push({
      ...cast(),
      id: 'cast:2',
      placement: { startFrame: 60 },
    });
    value.tracks[1] = {
      id: 'track:1',
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [{ ...cast(), id: 'cast:3', placement: { startFrame: 90 } }],
    };
    value.battle.durationFrames = 120;
    return value;
  }

  it('moves selected casts across tracks while preserving their relative positions', () => {
    const original = multiTrackScenario();
    const moved = moveSkillCasts(original, new Set(['cast:1', 'cast:3']), 0, 'cast:1', 45);

    expect(moved.tracks[0]!.skillCasts.map(value => value.placement.startFrame)).toEqual([45, 60]);
    expect(moved.tracks[1]!.skillCasts[0]!.placement.startFrame).toBe(105);
    expect(original.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(30);
  });

  it('clamps the shared delta at both timeline boundaries', () => {
    const original = multiTrackScenario();
    const selection = new Set(['cast:1', 'cast:3']);
    const movedLeft = moveSkillCasts(original, selection, 0, 'cast:1', 0);
    const movedRight = moveSkillCasts(original, selection, 0, 'cast:1', 100);

    expect(movedLeft.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(0);
    expect(movedLeft.tracks[1]!.skillCasts[0]!.placement.startFrame).toBe(60);
    expect(movedRight.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(60);
    expect(movedRight.tracks[1]!.skillCasts[0]!.placement.startFrame).toBe(120);
  });

  it('keeps the whole selection unchanged when any selected cast is locked', () => {
    const original = multiTrackScenario();
    original.tracks[1]!.skillCasts[0]!.presentation = { locked: true };

    expect(moveSkillCasts(original, new Set(['cast:1', 'cast:3']), 0, 'cast:1', 45)).toBe(original);
  });

  it('rejects stale selections and anchors outside the selection', () => {
    const original = multiTrackScenario();
    expect(() => moveSkillCasts(original, new Set(['cast:1', 'missing']), 0, 'cast:1', 45)).toThrow(
      'missing or duplicate',
    );
    expect(() => moveSkillCasts(original, new Set(['cast:3']), 0, 'cast:1', 45)).toThrow(
      'does not contain anchor',
    );
  });
});

describe('timeline marker commands', () => {
  it('sets, clamps and clears the optional simulation range immutably', () => {
    const original = scenario();
    const started = setSimulationRangeBoundary(original, 'start', 90);
    const endedBeforeStart = setSimulationRangeBoundary(started, 'end', 60);
    expect(started.battle.simulationRange).toEqual({ startFrame: 90 });
    expect(endedBeforeStart.battle.simulationRange).toEqual({ startFrame: 60, endFrame: 60 });

    const clearedStart = clearSimulationRangeBoundary(endedBeforeStart, 'start');
    expect(clearedStart.battle.simulationRange).toEqual({ endFrame: 60 });
    expect(
      clearSimulationRangeBoundary(clearedStart, 'end').battle.simulationRange,
    ).toBeUndefined();
    expect(clearSimulationRangeBoundary(original, 'start')).toBe(original);
  });

  it('adds, moves and removes cycle boundaries immutably', () => {
    const original = scenario();
    const added = addCycleBoundary(original, 'cycle:1', 45);
    const moved = moveCycleBoundary(added, 'cycle:1', 60);
    const removed = removeCycleBoundary(moved, 'cycle:1');
    expect(original.battle.cycleBoundaries).toEqual([]);
    expect(added.battle.cycleBoundaries[0]?.frame).toBe(45);
    expect(moved.battle.cycleBoundaries[0]?.frame).toBe(60);
    expect(removed.battle.cycleBoundaries).toEqual([]);
  });

  it('adds track-bound control switches only to occupied tracks', () => {
    const original = scenario();
    const added = addControlSwitch(original, 'switch:1', 30, 0);
    expect(moveControlSwitch(added, 'switch:1', 75).battle.controlSwitches[0]?.frame).toBe(75);
    const occupiedSecondTrack = {
      ...added,
      tracks: [added.tracks[0], { ...added.tracks[0]!, id: 'track:2' }, null, null],
    } as ScenarioDocument;
    expect(
      setControlSwitchTrack(occupiedSecondTrack, 'switch:1', 1).battle.controlSwitches[0]
        ?.trackIndex,
    ).toBe(1);
    expect(setControlSwitchTrack(added, 'missing', 0)).toBe(added);
    expect(() => setControlSwitchTrack(added, 'switch:1', 1)).toThrow('track 1 is empty');
    expect(removeControlSwitch(added, 'switch:1').battle.controlSwitches).toEqual([]);
    expect(() => addControlSwitch(original, 'switch:2', 30, 1)).toThrow('track 1 is empty');
  });

  it('persists only the explicitly supplied external fact and target', () => {
    const original = scenario();
    const added = addExternalEventMarker(
      original,
      'external:1',
      90,
      { scope: 'operator', trackIndex: 0 },
      { kind: 'operatorHit', tags: [], features: [] },
    );
    expect(added.battle.externalEventMarkers?.[0]).toEqual({
      id: 'external:1',
      frame: 90,
      target: { scope: 'operator', trackIndex: 0 },
      event: { kind: 'operatorHit', tags: [], features: [] },
    });
    expect(
      moveExternalEventMarker(added, 'external:1', 120).battle.externalEventMarkers?.[0]?.frame,
    ).toBe(120);
    const configured = updateExternalEventMarker(added, 'external:1', {
      event: {
        kind: 'operatorHit',
        damageType: 'physical',
        tags: ['normalAttack'],
        features: ['canBreakWeakness'],
      },
    });
    expect(configured.battle.externalEventMarkers?.[0]?.event).toEqual({
      kind: 'operatorHit',
      damageType: 'physical',
      tags: ['normalAttack'],
      features: ['canBreakWeakness'],
    });
    expect(updateExternalEventMarker(added, 'missing', {})).toBe(added);
    expect(removeExternalEventMarker(added, 'external:1').battle.externalEventMarkers).toEqual([]);
  });

  it('rejects marker frames outside the editable battle range', () => {
    const original = scenario();
    expect(() => addCycleBoundary(original, 'cycle:1', -1)).toThrow('marker frame');
    expect(() => addCycleBoundary(original, 'cycle:1', original.battle.durationFrames + 1)).toThrow(
      'marker frame',
    );
  });
});
