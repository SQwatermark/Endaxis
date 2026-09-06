import { describe, expect, it } from 'vitest';
import type { OperatorDefinition } from '../core/game-data/operatorDefinition';
import { createEmptyScenario } from '../core/project/createProject';
import { lifeng, perlica } from '../data/operators';
import * as operators from '../data/operators';
import { gameDataRepository } from '../data/gameDataRepository';
import { skillSettings } from '../data/combat/skillSettings';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';
import { resolveCompactSkillSelection } from '../ui/timeline/compactSkillSelection';
import { SkillPlacementTransaction } from '../ui/timeline/skillPlacementTransaction';
import { ScenarioEditorSession } from './editor/scenarioEditorSession';

const service = new ScenarioSimulationService({
  index: gameDataRepository,
  spellInflictionSettings: skillSettings,
  resources: {
    sharedSpGain: { baseGainEfficiency: 1 },
    spRecoveryPauseDuration: 1.5,
    ultimateEnergySystemUnlocked: true,
    normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
  },
});

function createChain(operator: OperatorDefinition) {
  const scenario = createEmptyScenario(`chain:${operator.slug}`, '正式模拟普攻接续边界');
  scenario.battle.durationFrames = 240;
  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
      operatorSlug: operator.slug,
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
  let id = 0;
  // 仅复用技能库的顺序及稳定身份；所有候选时刻均在下方重新指定。
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator,
    skillGroupKey: 'basicAttack',
    startFrame: 1,
    ids: { allocate: () => `cast:${id++}` },
  }).scenario;
}

describe('generated basic attack chain input timing', () => {
  it.each(
    Object.values(operators).flatMap(operator =>
      [-60, 0, 1].map(startFrame => ({ operator, startFrame })),
    ),
  )(
    '$operator.slug compact layout at $startFrame is stable when applied twice',
    async ({ operator, startFrame }) => {
      const scenario = createChain(operator);
      scenario.battle.durationFrames = 600;
      scenario.tracks[0]!.skillCasts.forEach((cast, i) => {
        cast.placement.startFrame = startFrame + i * 80;
      });
      const ids = scenario.tracks[0]!.skillCasts.map(cast => cast.id);
      const before = structuredClone(scenario);
      const first = await service.planSkillChain(scenario, ids, 600, undefined, 'compact');
      expect(first.status).toBe('planned');
      if (first.status !== 'planned') return;
      const second = await service.planSkillChain(first.scenario, ids, 600, undefined, 'compact');
      expect(second.status).toBe('planned');
      if (second.status !== 'planned') return;
      expect(second.scenario).toEqual(first.scenario);
      expect(scenario).toEqual(before);
      expect(first.scenario.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(startFrame);
    },
  );
  it.each([false, true])(
    'preserves same-frame document order when selected cast is first: %s',
    async selectedFirst => {
      const scenario = createChain(perlica);
      scenario.tracks[0]!.skillCasts = scenario.tracks[0]!.skillCasts.slice(-1);
      scenario.tracks[0]!.skillCasts[0]!.placement.startFrame = 1;
      const battle = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: perlica,
        skillGroupKey: 'battleSkill',
        startFrame: 10,
        ids: { allocate: () => 'unselected:battle' },
      });
      const placed = placeSkillGroup({
        scenario: battle.scenario,
        trackIndex: 0,
        operator: perlica,
        skillGroupKey: 'basicAttack',
        skillKey: 'basicAttack1',
        startFrame: 100,
        ids: { allocate: () => 'selected:basic' },
      });
      if (selectedFirst) {
        const casts = placed.scenario.tracks[0]!.skillCasts;
        placed.scenario.tracks[0]!.skillCasts = [casts[0]!, casts[2]!, casts[1]!];
      }
      const before = structuredClone(placed.scenario);
      const result = await service.planSkillChain(
        placed.scenario,
        ['cast:3', 'selected:basic'],
        240,
        undefined,
        'compact',
      );
      expect(result.status).toBe('planned');
      if (result.status !== 'planned') return;
      const interruption = result.run.receiptEntries.find(
        entry => entry.event === 'SkillInterrupted' && entry.data?.castId === 'cast:3',
      );
      expect(interruption?.frame).toBe(10);
      expect(
        result.scenario.tracks[0]!.skillCasts.find(c => c.id === 'selected:basic')!.placement
          .startFrame,
      ).toBe(10);
      expect(result.scenario.tracks[0]!.skillCasts.find(c => c.id === 'unselected:battle')).toEqual(
        before.tracks[0]!.skillCasts.find(c => c.id === 'unselected:battle'),
      );
      expect(placed.scenario).toEqual(before);
      expect(
        result.run.receiptEntries
          .filter(entry => entry.event === 'SkillInputProcessed' && entry.frame === 10)
          .map(entry => entry.data?.castId),
      ).toEqual(
        selectedFirst
          ? ['selected:basic', 'unselected:battle']
          : ['unselected:battle', 'selected:basic'],
      );
      const repeated = await service.planSkillChain(
        result.scenario,
        ['cast:3', 'selected:basic'],
        240,
        undefined,
        'compact',
      );
      expect(repeated.status).toBe('planned');
      if (repeated.status === 'planned') expect(repeated.scenario).toEqual(result.scenario);
    },
  );
  it('keeps the complete authored chain undoable when the planning service throws', async () => {
    const authored = createChain(perlica);
    const original = structuredClone(authored);
    original.tracks[0]!.skillCasts = [];
    const session = new ScenarioEditorSession(original);
    const error = new Error('unsupported simulation data');
    const transaction = new SkillPlacementTransaction(
      {
        planSkillChain: () => {
          throw error;
        },
      },
      () => session.snapshot.revision,
    );
    const result = await transaction.resolve({
      scenario: authored,
      skillCastIds: authored.tracks[0]!.skillCasts.map(cast => cast.id),
    });
    expect(result).toEqual({ scenario: authored, incomplete: true, error });
    if (!result) return;
    session.commit('placeSkillGroup', () => result.scenario);
    expect(session.snapshot.scenario).toEqual(authored);
    expect(session.undo()).toBe(true);
    expect(session.snapshot.scenario).toEqual(original);
    expect(session.canUndo).toBe(false);
    expect(session.redo()).toBe(true);
    expect(session.snapshot.scenario).toEqual(authored);
  });
  it('compacts Perlica heavy attack then battle skill despite the anchor input warning', async () => {
    const scenario = createChain(perlica);
    scenario.tracks[0]!.skillCasts = scenario.tracks[0]!.skillCasts.slice(-1);
    scenario.tracks[0]!.skillCasts[0]!.placement.startFrame = 1;
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 100,
      ids: { allocate: () => 'battle:probe' },
    });
    const result = await service.planSkillChain(
      placed.scenario,
      ['cast:3', 'battle:probe'],
      240,
      undefined,
      'compact',
    );
    expect(result.status).toBe('planned');
    if (result.status !== 'planned') return;
    expect(result.scenario.tracks[0]!.skillCasts.map(c => c.placement.startFrame)).toEqual([1, 46]);
    expect(
      result.run.availabilityDiagnostics.some(
        d => d.skillId === 'basicAttack4' && d.reasons.includes('skillInputMismatch'),
      ),
    ).toBe(true);
    expect(
      result.run.receiptEntries.filter(e => e.event === 'DamageApplied').map(e => e.frame),
    ).toContain(28);
  });
  it('compacts selected existing casts in time order as one undoable operation', async () => {
    const scenario = createChain(lifeng);
    const casts = scenario.tracks[0]!.skillCasts;
    casts.forEach((cast, i) => {
      cast.placement.startFrame = 1 + i * 50;
    });
    const untouched = structuredClone(casts[0]!);
    untouched.id = 'unselected';
    untouched.placement.startFrame = 220;
    casts.push(untouched);
    // Document order need not equal time order.
    scenario.tracks[0]!.skillCasts = [casts[2]!, casts[0]!, casts[3]!, casts[1]!, untouched];
    const selection = resolveCompactSkillSelection(
      scenario,
      new Set(['cast:3', 'cast:1', 'cast:0', 'cast:2']),
    );
    expect(selection.ok).toBe(true);
    if (!selection.ok) return;
    const session = new ScenarioEditorSession(scenario);
    const transaction = new SkillPlacementTransaction(service, () => session.snapshot.revision);
    const result = await transaction.resolve(
      { scenario, skillCastIds: selection.castIds },
      'compact',
    );
    expect(result?.incomplete).toBe(false);
    if (!result || result.incomplete) return;
    const byId = new Map(result.scenario.tracks[0]!.skillCasts.map(cast => [cast.id, cast]));
    expect(selection.castIds.map(id => byId.get(id)!.placement.startFrame)).toEqual([
      1, 28, 49, 69,
    ]);
    expect(byId.get('unselected')).toEqual(untouched);
    const run = await service.simulate(result.scenario, 240);
    for (let i = 1; i < selection.castIds.length; i++) {
      const boundary = run.receiptEntries.find(
        entry =>
          entry.event === 'SkillOperableBoundaryReached' &&
          entry.data?.castId === selection.castIds[i - 1],
      );
      expect(boundary).toBeDefined();
      expect(byId.get(selection.castIds[i]!)!.placement.startFrame).toBe(boundary!.frame + 1);
    }
    session.commit('compactSelectedSkills', () => result.scenario);
    expect(session.undo()).toBe(true);
    expect(session.snapshot.scenario).toEqual(scenario);
    expect(session.canUndo).toBe(false);
    expect(session.redo()).toBe(true);
    expect(session.snapshot.scenario).toEqual(result.scenario);
  });

  it.each([-60, 0, 1])(
    'plans a hit-stop-aware chain at %s without rewriting existing placements',
    async startFrame => {
      const scenario = createChain(lifeng);
      const casts = scenario.tracks[0]!.skillCasts;
      casts.forEach(cast => {
        cast.placement.startFrame += startFrame - 1;
      });
      const ids = casts.map(cast => cast.id);
      const before = structuredClone(scenario);
      const result = await service.planSkillChain(scenario, ids, 240);
      expect(scenario).toEqual(before);
      expect(result.status).toBe('planned');
      if (result.status !== 'planned') return;
      expect(result.scenario.tracks[0]!.skillCasts.map(cast => cast.placement.startFrame)).toEqual(
        [1, 28, 48, 68].map(frame => frame + startFrame - 1),
      );
      expect(result.run.availabilityDiagnostics).toEqual([]);
      expect(result.scenario.tracks[0]!.skillCasts.map(cast => cast.id)).toEqual(ids);
    },
  );

  it('returns incomplete at the requested horizon without moving the source chain', async () => {
    const scenario = createChain(lifeng);
    const before = structuredClone(scenario);
    const ids = scenario.tracks[0]!.skillCasts.map(cast => cast.id);
    const result = await service.planSkillChain(scenario, ids, 20);
    expect(result).toEqual({ status: 'incomplete', unresolvedCastIds: ids.slice(1) });
    expect(scenario).toEqual(before);
  });

  it('retains the simulated compact prefix when the horizon ends before the last cast', async () => {
    const scenario = createChain(lifeng);
    const before = structuredClone(scenario);
    const ids = scenario.tracks[0]!.skillCasts.map(cast => cast.id);
    const result = await service.planSkillChain(scenario, ids, 55, undefined, 'compact');
    expect(result).toEqual({
      status: 'incomplete',
      unresolvedCastIds: [ids[3]],
      plannedStartFrames: new Map([
        [ids[0], 1],
        [ids[1], 28],
        [ids[2], 49],
      ]),
    });
    expect(scenario).toEqual(before);
  });

  it.each([-60, 0, 1])(
    'compacts at %s without clamping the author anchor to combat start',
    async startFrame => {
      const scenario = createChain(lifeng);
      scenario.tracks[0]!.skillCasts.forEach((cast, index) => {
        cast.placement.startFrame = startFrame + index * 50;
      });
      const before = structuredClone(scenario);
      const ids = scenario.tracks[0]!.skillCasts.map(cast => cast.id);
      const result = await service.planSkillChain(scenario, ids, 240, undefined, 'compact');
      expect(result.status).toBe('planned');
      if (result.status !== 'planned') return;
      expect(result.scenario.tracks[0]!.skillCasts.map(cast => cast.placement.startFrame)).toEqual(
        [0, 27, 48, 68].map(offset => startFrame + offset),
      );
      expect(scenario).toEqual(before);
    },
  );

  it('does not start planning an aborted request', async () => {
    const scenario = createChain(lifeng);
    const controller = new AbortController();
    controller.abort();
    await expect(
      service.planSkillChain(
        scenario,
        scenario.tracks[0]!.skillCasts.map(cast => cast.id),
        240,
        controller.signal,
      ),
    ).rejects.toThrow();
  });

  it.each([
    { operator: perlica, expected: [1, 18, 37, 64] },
    { operator: lifeng, expected: [1, 28, 48, 68] },
  ])(
    '$operator.slug finds the earliest legal input from actual simulation',
    async ({ operator, expected }) => {
      const scenario = createChain(operator);
      const originalCasts = structuredClone(scenario.tracks[0]!.skillCasts);
      const starts = [1];
      for (let index = 1; index < originalCasts.length; index++) {
        let found = false;
        // 不读 timelineBlockFrames 或展示边界，也不借助无限推迟规避失败。
        // 每一帧重放完整前缀，确保前段实际命中产生的停帧仍参与判断。
        for (let frame = starts[index - 1]! + 1; frame < 200; frame++) {
          scenario.tracks[0]!.skillCasts = structuredClone(originalCasts.slice(0, index + 1));
          scenario.tracks[0]!.skillCasts.forEach((cast, castIndex) => {
            cast.placement.startFrame = castIndex === index ? frame : starts[castIndex]!;
          });
          const run = await service.simulate(scenario, 240);
          const candidateDiagnostics = run.availabilityDiagnostics.filter(d => d.frame === frame);
          if (candidateDiagnostics.some(d => d.reasons.includes('skillInterruptUnavailable')))
            continue;
          // 不能把身份不匹配或未知条件当成已找到合法接续。
          expect(run.availabilityDiagnostics).toEqual([]);
          starts.push(frame);
          found = true;
          break;
        }
        expect(found, `${operator.slug} stage ${index + 1} had no legal candidate`).toBe(true);
      }
      expect(starts).toEqual(expected);

      // 每个已确认边界提前一帧仍必须报错，不能通过取消校验达成连段。
      for (let index = 1; index < originalCasts.length; index++) {
        scenario.tracks[0]!.skillCasts = structuredClone(originalCasts.slice(0, index + 1));
        scenario.tracks[0]!.skillCasts.forEach((cast, castIndex) => {
          cast.placement.startFrame = starts[castIndex]! - (castIndex === index ? 1 : 0);
        });
        const run = await service.simulate(scenario, 240);
        expect(run.availabilityDiagnostics).toContainEqual(
          expect.objectContaining({
            frame: starts[index]! - 1,
            skillId: `basicAttack${index + 1}`,
            reasons: expect.arrayContaining(['skillInterruptUnavailable']),
          }),
        );
      }

      scenario.tracks[0]!.skillCasts = structuredClone(originalCasts);
      scenario.tracks[0]!.skillCasts.forEach((cast, index) => {
        cast.placement.startFrame = starts[index]!;
      });
      const run = await service.simulate(scenario, 240);
      expect(run.availabilityDiagnostics).toEqual([]);
      if (operator.slug === lifeng.slug) {
        const ownerStops = run.receiptEntries
          .filter(
            entry =>
              entry.event === 'TimeDilationStarted' &&
              entry.targetId === 'track:0' &&
              entry.data?.slot === 'TimeDilation/Layer/Entity/HitStop',
          )
          .map(entry => ({
            frame: entry.frame,
            skill: entry.data?.sourceActionId,
            duration: entry.data?.durationSeconds,
          }));
        expect(ownerStops).toEqual([
          { frame: 10, skill: 'basicAttack1', duration: 0.067 },
          { frame: 19, skill: 'basicAttack1', duration: 0.067 },
          { frame: 32, skill: 'basicAttack2', duration: 0.1 },
          { frame: 59, skill: 'basicAttack3', duration: 0.167 },
          { frame: 92, skill: 'basicAttack4', duration: 0.3 },
        ]);
      }
    },
  );
});
