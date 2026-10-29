import { expect, it } from 'vitest';
import type { ScenarioDocument } from '../../core/project/schema';
import { createEmptyScenario } from '../../core/project/createProject';
import { gameDataRepository } from '../../data/gameDataRepository';
import { perlica } from '../../data/operators/perlica.generated';
import { createScenarioSimulationService } from './createScenarioSimulationService';
import {
  captureScenarioSimulationGameData,
  restoreScenarioSimulationGameData,
} from './scenarioSimulationGameData';
import { placeSkillGroup } from '../../ui/timeline/interaction/placeSkillGroup';
import type { CombatStateGraph } from '../../core/combat/state/combatState';

const trackId = 'track:perlica';
const hpBuff = {
  kind: 'common',
  sourceId: 'contingency-contracts',
  buffId: 'buff_cc_enemy_common_hp_up',
} as const;
const attackPotionBuff = {
  kind: 'common',
  sourceId: 'consumables',
  buffId: 'buff_common_atk_buff_potion_1',
} as const;

function scenario(): ScenarioDocument {
  const value = createEmptyScenario('scenario:buff-interventions', 'Buff interventions');
  value.battle.durationFrames = 90;
  value.tracks[0] = {
    id: trackId,
    operator: {
      operatorSlug: perlica.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return value;
}

function activeEnemyBuffs(state: CombatStateGraph) {
  return [...(state.enemy.buffs?.instances.values() ?? [])].filter(
    buff => buff.identity.definitionId === hpBuff.buffId && !buff.lifecycle.finished,
  );
}

it('uses generated unlimited Buff instances at frame zero and later frames, ends only the referenced instance, and restores without replay', () => {
  const value = scenario();
  value.buffInterventions = [
    {
      id: 'first',
      kind: 'apply',
      frame: 0,
      buff: hpBuff,
      target: { kind: 'enemy' },
      sourceOperatorId: trackId,
      parameters: { hp_up: 1.1 },
    },
    {
      id: 'second',
      kind: 'apply',
      frame: 10,
      buff: hpBuff,
      target: { kind: 'enemy' },
      sourceOperatorId: trackId,
      parameters: { hp_up: 1.2 },
    },
    {
      id: 'active-at-checkpoint',
      kind: 'suppress',
      startFrame: 12,
      endFrame: 18,
      buff: hpBuff,
      target: { kind: 'enemy' },
    },
    { id: 'finish-first', kind: 'finish', frame: 20, applicationId: 'first' },
  ];
  const service = createScenarioSimulationService(gameDataRepository);
  const session = service.createCombatSession(value);
  expect(activeEnemyBuffs(session.runtime.readState())).toHaveLength(1);
  expect(session.collectResult().enemyVitals.maxHealth).toBeGreaterThan(value.enemy.editable.hp);
  session.advanceToFrame(9);
  expect(activeEnemyBuffs(session.runtime.readState())).toHaveLength(1);
  session.advanceToFrame(15);
  expect(activeEnemyBuffs(session.runtime.readState())).toHaveLength(2);
  expect(
    session.runtime
      .readState()
      .inputs.buffInterventions?.activeSuppressionIds.has('active-at-checkpoint'),
  ).toBe(true);
  const checkpoint = session.runtime.save();
  const restored = session.fork(checkpoint);
  session.advanceToFrame(30);
  restored.advanceToFrame(30);
  const state = restored.runtime.readState();
  const applications = state.inputs.buffInterventions!.applications;
  expect(activeEnemyBuffs(state).map(buff => buff.identity.instanceId)).toEqual([
    applications.get('second')!.instanceId,
  ]);
  expect(applications.get('first')!.instanceId).not.toBe(applications.get('second')!.instanceId);
  expect(state.inputs.buffInterventions!.activeSuppressionIds.size).toBe(0);
  expect(state).toEqual(session.runtime.readState());
  const full = service.createCombatSession(value);
  full.advanceToFrame(30);
  expect(restored.collectResult().receiptEntries).toEqual(full.collectResult().receiptEntries);
  expect(state).toEqual(full.runtime.readState());
  expect(
    restored
      .collectResult()
      .receiptEntries.filter(
        entry => entry.event === 'BuffInterventionResult' && entry.data?.interventionId === 'first',
      ),
  ).toHaveLength(1);
});

it('preserves normal consumable template bindings and suppresses them on [start,end)', () => {
  const value = scenario();
  const potion = gameDataRepository
    .getConsumables()
    .find(
      item =>
        item.applications.length === 1 && item.applications[0]!.buffId === attackPotionBuff.buffId,
    )!;
  value.tracks[0]!.consumableUses = [
    { id: 'natural-existing', frame: 0, consumableId: potion.id },
    { id: 'natural-blocked', frame: 10, consumableId: potion.id },
    { id: 'natural-end-boundary', frame: 20, consumableId: potion.id },
  ];
  value.buffInterventions = [
    {
      id: 'blocked-interval',
      kind: 'suppress',
      startFrame: 10,
      endFrame: 20,
      buff: attackPotionBuff,
      target: { kind: 'operator', operatorId: trackId },
    },
  ];
  const session = createScenarioSimulationService(gameDataRepository).createCombatSession(value);
  const original = [
    ...session.runtime.readState().operators.get(trackId)!.buffs!.instances.values(),
  ].find(buff => buff.identity.definitionId === attackPotionBuff.buffId)!;
  expect(original).toBeDefined();
  session.advanceToFrame(19);
  const existing = session.runtime
    .readState()
    .operators.get(trackId)!
    .buffs!.instances.get(original.identity.instanceId)!;
  expect(existing.lifecycle.finished).toBe(false);
  expect(existing.blackboard.values.get('value')).toBe(
    potion.applications[0]!.blackboardValues.value,
  );
  expect(
    session
      .collectResult()
      .receiptEntries.filter(
        entry => entry.event === 'BuffApplied' && entry.data?.buffId === attackPotionBuff.buffId,
      )
      .map(entry => entry.frame),
  ).toEqual([0]);
  expect(
    session
      .collectResult()
      .receiptEntries.some(
        entry =>
          entry.event === 'BuffInterventionResult' &&
          entry.frame === 10 &&
          entry.data?.result === 'suppressed',
      ),
  ).toBe(true);
  session.advanceToFrame(20);
  expect(
    session
      .collectResult()
      .receiptEntries.filter(
        entry => entry.event === 'BuffApplied' && entry.data?.buffId === attackPotionBuff.buffId,
      )
      .map(entry => entry.frame),
  ).toEqual([0, 20]);
});

it('compiles an off-field generated Buff through the Worker packet and changes real Perlica skill damage', () => {
  let value = scenario();
  value = placeSkillGroup({
    scenario: value,
    trackIndex: 0,
    operator: perlica,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:buff-real-skill` },
  }).scenario;
  const plain = structuredClone(value);
  value.buffInterventions = [
    {
      id: 'off-field-arclight',
      kind: 'apply',
      frame: 0,
      buff: {
        kind: 'operator',
        sourceId: 'arclight',
        buffId: 'buff_chr_0007_ikut_atk_buff_talent',
      },
      target: { kind: 'operator', operatorId: trackId },
      sourceOperatorId: trackId,
      parameters: { duration: 100, pulse_up: 0.25 },
    },
  ];
  const packet = captureScenarioSimulationGameData(value, gameDataRepository);
  expect(packet.operators.some(operator => operator.slug === 'arclight')).toBe(true);
  const workerRepository = restoreScenarioSimulationGameData(structuredClone(packet));
  const baseline = createScenarioSimulationService(gameDataRepository).createCombatSession(plain);
  const modified = createScenarioSimulationService(workerRepository).createCombatSession(value);
  const offFieldCheckpoint = modified.runtime.save();
  const restored = modified.fork(offFieldCheckpoint);
  baseline.advanceToFrame(60);
  modified.advanceToFrame(60);
  restored.advanceToFrame(60);
  expect(restored.runtime.readState()).toEqual(modified.runtime.readState());
  expect(restored.collectResult().receiptEntries).toEqual(modified.collectResult().receiptEntries);
  const hits = (session: typeof baseline) =>
    session
      .collectResult()
      .receiptEntries.filter(
        entry => entry.event === 'DamageApplied' && entry.data?.damageType === 'electric',
      );
  expect(hits(baseline).length).toBeGreaterThan(0);
  expect(hits(modified)).toHaveLength(hits(baseline).length);
  expect(Number(hits(modified)[0]!.data!.value)).toBeCloseTo(
    Number(hits(baseline)[0]!.data!.value) * 1.25,
    4,
  );
});
