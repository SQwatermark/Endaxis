import { expect, it } from 'vitest';
import { createEmptyScenario } from '../core/project/createProject';
import { createEditorSimulationService } from './editorSimulationService';

it('艾尔黛拉终结技概率生成治疗羊失败，不得阻止独立节点的敌方伤害', async () => {
  const scenario = createEmptyScenario('ardelia-callbacks', '独立弹体回调');
  scenario.tracks[0] = {
    id: 'ardelia',
    operator: {
      operatorSlug: 'ardelia',
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 90 },
    skillCasts: [
      {
        id: 'ultimate',
        source: { kind: 'operatorSkill', skillGroupKey: 'ultimate', skillKey: 'ultimate' },
        placement: { startFrame: 1 },
      },
    ],
  };
  // 正式编辑器随机样本为1，10%留羊分支不触发，不篡改随机结果来补命中。
  const run = await createEditorSimulationService().simulate(scenario, 400);
  expect(run.executionDiagnostics).toEqual([]);
  expect(
    run.receiptEntries.some(
      e =>
        e.event === 'CombatConditionEvaluated' &&
        e.data?.kind === 'probability' &&
        e.data?.passed === false,
    ),
  ).toBe(true);
  const hits = run.receiptEntries.filter(
    e => e.event === 'DamageApplied' && e.data?.castId === 'ultimate',
  );
  expect(hits.length).toBeGreaterThan(0);
  expect(
    hits.every(e => e.data?.skillMultiplierPercent === 165 && Number(e.data?.expectedDamage) > 0),
  ).toBe(true);
});
