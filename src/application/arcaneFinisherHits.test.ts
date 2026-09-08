import { expect, it } from 'vitest';
import { createEmptyScenario } from '../core/project/createProject';
import { arcane } from '../data/operators/arcane';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { createEditorSimulationService } from './editorSimulationService';

it('诀处决按原生分段执行五次十分之一与一次二分之一，不合并成旧版单次伤害', async () => {
  let scenario = createEmptyScenario('arcane-finisher', '诀处决');
  scenario.tracks[0] = {
    id: 'arcane',
    operator: {
      operatorSlug: arcane.slug,
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
  scenario = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: arcane,
    skillGroupKey: 'finisher',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:${++id}` },
  }).scenario;
  const run = await createEditorSimulationService().simulate(scenario, 200);
  const damage = run.receiptEntries.filter(e => e.event === 'DamageApplied');
  expect(damage).toHaveLength(6);
  expect(damage.every(e => e.data?.skillType === 'finisher')).toBe(true);
  const base = damage.map(e => e.data?.baseDamage as number);
  for (const value of base.slice(0, 5)) expect(value).toBeCloseTo(base[0]!, 4);
  expect(base[5]! / base[0]!).toBeCloseTo(5, 5);
  expect(new Set(damage.map(e => e.data?.castId)).size).toBe(1);
  // 32~35 帧的持续检测最多命中两次，其余四个动作各命中一次。
  const repeated = damage.filter(e => String(e.data?.stepKey).includes('/scheduledSequences/4/'));
  expect(repeated).toHaveLength(2);
  expect(repeated[1]!.frame).toBeGreaterThan(repeated[0]!.frame);
  expect(damage[5]!.frame).toBeGreaterThan(repeated[1]!.frame);
});
