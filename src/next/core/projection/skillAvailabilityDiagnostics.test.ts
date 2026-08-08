import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { projectSkillAvailabilityDiagnostics } from './skillAvailabilityDiagnostics';

function receipt(
  sequence: number,
  event: string,
  overrides: Partial<CombatReceiptEntry> = {},
): CombatReceiptEntry {
  return {
    sequence,
    frame: 12,
    time: 0.4,
    event,
    sourceId: 'perlica',
    data: { skillId: 'battleSkill' },
    ...overrides,
  };
}

describe('projectSkillAvailabilityDiagnostics', () => {
  it('归约同一技能开始位置上的资源与冷却事实', () => {
    const diagnostics = projectSkillAvailabilityDiagnostics([
      receipt(0, 'SkillCooldownUnavailableAtStart'),
      receipt(1, 'SkillCostUnavailableAtStart'),
      receipt(2, 'SkillStarted'),
    ]);

    expect(diagnostics).toEqual([
      {
        frame: 12,
        sourceId: 'perlica',
        skillId: 'battleSkill',
        reasons: ['cooldownUnavailable', 'resourceUnavailable'],
        receiptSequences: [0, 1],
      },
    ]);
  });

  it('按帧、来源与技能分别定位，并保持首个事实顺序', () => {
    const diagnostics = projectSkillAvailabilityDiagnostics([
      receipt(4, 'SkillCostUnavailableAtStart', {
        frame: 20,
        sourceId: 'arcane',
        data: { skillId: 'ultimate' },
      }),
      receipt(5, 'SkillCooldownUnavailableAtStart'),
      receipt(6, 'SkillCostUnavailableAtStart'),
    ]);

    expect(diagnostics).toEqual([
      {
        frame: 20,
        sourceId: 'arcane',
        skillId: 'ultimate',
        reasons: ['resourceUnavailable'],
        receiptSequences: [4],
      },
      {
        frame: 12,
        sourceId: 'perlica',
        skillId: 'battleSkill',
        reasons: ['cooldownUnavailable', 'resourceUnavailable'],
        receiptSequences: [5, 6],
      },
    ]);
  });

  it('重复事实只产生一个原因，同时保留全部回执序号', () => {
    const diagnostics = projectSkillAvailabilityDiagnostics([
      receipt(7, 'SkillCostUnavailableAtStart'),
      receipt(8, 'SkillCostUnavailableAtStart'),
    ]);

    expect(diagnostics[0]).toMatchObject({
      reasons: ['resourceUnavailable'],
      receiptSequences: [7, 8],
    });
  });

  it('拒绝无法定位到动作的可用性事实', () => {
    expect(() =>
      projectSkillAvailabilityDiagnostics([
        receipt(9, 'SkillCostUnavailableAtStart', { sourceId: undefined }),
      ]),
    ).toThrow("receipt 9 'SkillCostUnavailableAtStart' has no sourceId");

    expect(() =>
      projectSkillAvailabilityDiagnostics([
        receipt(10, 'SkillCooldownUnavailableAtStart', { data: undefined }),
      ]),
    ).toThrow("receipt 10 'SkillCooldownUnavailableAtStart' has no skillId");
  });

  it('忽略与技能开始可用性无关的回执', () => {
    expect(
      projectSkillAvailabilityDiagnostics([
        receipt(11, 'SkillStarted'),
        receipt(12, 'SkillCostRejected'),
        receipt(13, 'SkillCooldownReady'),
      ]),
    ).toEqual([]);
  });
});
