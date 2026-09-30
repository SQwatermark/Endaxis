import { expect, it, vi } from 'vitest';
import { createEmptyProject, createEmptyScenario } from '../../core/project/createProject';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import { validateLegacyFinalSimulation } from './finalSimulationValidation';

it('最终整轴验收独立记录失败、未验证技能和闪避，不丢弃项目或阻止后续方案', () => {
  const project = createEmptyProject({ createdWith: 'test' });
  project.scenarios.push(
    createEmptyScenario('unknown', 'unknown'),
    createEmptyScenario('ok', 'ok'),
  );
  project.scenarios[0]!.battle.simulationRange = { startFrame: 0, endFrame: 1 };
  const original = structuredClone(project);
  const receiptEntries: CombatReceiptEntry[] = [
    {
      sequence: 0,
      frame: 2,
      time: 2 / 30,
      event: 'SkillInputResolutionUnknown',
      sourceId: 'track:0',
      data: { skillId: 'skill', castId: 'cast', reason: 'unsupported route' },
    },
    {
      sequence: 1,
      frame: 2,
      time: 2 / 30,
      event: 'SkillInputProcessed',
      sourceId: 'track:0',
      data: { skillId: 'skill', castId: 'cast', accepted: false },
    },
    {
      sequence: 2,
      frame: 3,
      time: 0.1,
      event: 'DodgeInputPartiallySimulated',
      sourceId: 'track:0',
      data: { dodgeId: 'dodge', missingDodgeProgram: true },
    },
  ];
  const run = vi.fn((scenario, endFrame) => {
    expect(endFrame).toBe(scenario.battle.durationFrames);
    if (scenario.id === project.scenarios[0]!.id) throw new Error('final execution failed');
    return { receiptEntries: scenario.id === 'unknown' ? receiptEntries : [] };
  });
  const results = validateLegacyFinalSimulation(project, run);
  expect(results).toMatchObject([
    { status: 'failed', path: '$.scenarios[0]', message: 'final execution failed' },
    {
      status: 'issues',
      availability: [
        { reasons: ['skillInputUnknown'], inputResolutionDetail: 'unsupported route' },
      ],
      rejectedInputs: [{ data: { castId: 'cast', accepted: false } }],
      dodges: [{ id: 'dodge', status: 'unverified', messages: [{ code: 'missingDodgeProgram' }] }],
    },
    { status: 'passed', availability: [], rejectedInputs: [], dodges: [] },
  ]);
  expect(run).toHaveBeenCalledTimes(3);
  expect(project).toEqual(original);
});
