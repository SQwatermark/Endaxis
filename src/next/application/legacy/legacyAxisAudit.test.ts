import { describe, expect, it } from 'vitest';
import { createEmptyProject } from '../../core/project/createProject';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import { auditLegacyAxisProject } from './legacyAxisAudit';

describe('auditLegacyAxisProject', () => {
  it('separates deterministic execution findings from reference hit differences', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' });
    const scenario = project.scenarios[0]!;
    scenario.tracks[0] = {
      id: 'legacy:scenario:track:0:operator',
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [
        {
          id: `legacy:${scenario.id}:track:0:cast:0`,
          source: {
            kind: 'operatorSkill',
            skillGroupKey: 'battleSkill',
            skillKey: 'battleSkill',
          },
          placement: { startFrame: 30 },
        },
      ],
    };
    const receipts: CombatReceiptEntry[] = [
      {
        sequence: 0,
        frame: 30,
        time: 1,
        event: 'SkillStarted',
        data: { castId: `legacy:${scenario.id}:track:0:cast:0`, skillId: 'battleSkill2' },
      },
      {
        sequence: 1,
        frame: 30,
        time: 1,
        event: 'SkillInputProcessed',
        data: {
          castId: `legacy:${scenario.id}:track:0:cast:0`,
          skillId: 'battleSkill2',
          accepted: true,
        },
      },
      ...[0, 1, 2].map(
        (index): CombatReceiptEntry => ({
          sequence: index + 2,
          frame: 31 + index,
          time: (31 + index) / 30,
          event: 'DamageApplied',
          data: { castId: `legacy:${scenario.id}:track:0:cast:0` },
        }),
      ),
    ];
    const report = auditLegacyAxisProject({
      legacyProject: {
        scenarioList: [
          {
            id: scenario.id,
            data: {
              tracks: [
                { actions: [{ name: '战技 1', type: 'battleSkill', startTime: 30, hits: [{}] }] },
              ],
            },
          },
        ],
      },
      project,
      runs: new Map([[scenario.id, { frame: 120, receiptEntries: receipts }]]),
    });

    expect(report.scenarios[0]).toMatchObject({
      inputCount: 1,
      startedCount: 1,
      deterministicFindingCount: 0,
      casts: [
        {
          legacy: { declaredHitCount: 1 },
          next: {
            executionStatus: 'started',
            actualSkillId: 'battleSkill2',
            causallyAttributedDamageCount: 3,
          },
          findings: [],
        },
      ],
    });
  });

  it('reports a processed but non-started input without treating resource diagnostics as the cause', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' });
    const scenario = project.scenarios[0]!;
    scenario.tracks[0] = {
      id: 'track',
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [
        {
          id: `legacy:${scenario.id}:track:0:cast:0`,
          source: { kind: 'operatorSkill', skillGroupKey: 'ultimate', skillKey: 'ultimate' },
          placement: { startFrame: 60 },
        },
      ],
    };
    const castId = scenario.tracks[0]!.skillCasts[0]!.id;
    const receiptEntries: CombatReceiptEntry[] = [
      {
        sequence: 0,
        frame: 60,
        time: 2,
        event: 'SkillInputProcessed',
        data: { castId, accepted: true },
      },
      {
        sequence: 1,
        frame: 60,
        time: 2,
        event: 'SkillCostUnavailableAtStart',
        data: { castId },
      },
    ];
    const report = auditLegacyAxisProject({
      legacyProject: { scenarioList: [{ id: scenario.id, data: { tracks: [{ actions: [{}] }] } }] },
      project,
      runs: new Map([
        [
          scenario.id,
          {
            frame: 120,
            receiptEntries,
          },
        ],
      ]),
    });

    expect(report.scenarios[0]!.casts[0]).toMatchObject({
      next: { executionStatus: 'notStarted', costUnavailable: true },
      findings: ['skillNotStarted'],
    });
  });
});
