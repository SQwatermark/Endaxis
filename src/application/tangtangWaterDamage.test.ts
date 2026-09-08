import { expect, it } from 'vitest';
import { createEmptyScenario } from '../core/project/createProject';
import { tangtang } from '../data/operators/tangtang';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { createEditorSimulationService } from './editorSimulationService';

it('汤汤单水体战技按原生周期产生十二次快照伤害，不照旧版均分为十一次', async () => {
  let scenario = createEmptyScenario('tangtang-water', '单水体');
  scenario.tracks[0] = {
    id: 'tangtang',
    operator: {
      operatorSlug: tangtang.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: { 0: 2, 1: 2 },
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  let id = 0;
  scenario = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: tangtang,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:${++id}` },
  }).scenario;
  const run = await createEditorSimulationService().simulate(scenario, 250);
  const hits = run.receiptEntries.filter(e => e.event === 'DamageApplied');
  const water = hits.filter(e => e.data?.usesAttackSnapshot === true);
  const direct = hits.filter(e => e.data?.usesAttackSnapshot !== true);
  expect(water).toHaveLength(12);
  expect(direct).toHaveLength(5);
  expect(water.every(e => e.data?.skillMultiplierPercent === 25)).toBe(true);
  expect(direct.every(e => e.data?.skillMultiplierPercent === 36)).toBe(true);
  expect(hits.every(e => e.data?.damageType === 'cryo')).toBe(true);
  expect(hits.reduce((sum, e) => sum + Number(e.data?.skillMultiplierPercent), 0)).toBe(480);
});
