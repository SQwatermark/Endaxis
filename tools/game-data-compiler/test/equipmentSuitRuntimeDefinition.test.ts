import { describe, expect, it } from 'vitest';
import buffs from './fixtures/avywenna-vulnerable-buffs.json';
import { compileEquipmentSuitRuntimeBatchSource } from '../src/domains/equipment/suitRuntimeDefinition.ts';
import type { GearSetDefinition } from '../../../packages/game-data-contract/src/index.ts';

// 仅用真实 Buff 的寿命字段验证安装操作数边界，不将该组合当作真实套装证据。
const buffId = 'buff_chr_0012_avywen_ultimate_skill_debuff';
const buffData = { [buffId]: { ...buffs[buffId], buffEventAction: [] } };

describe('套装安装的契约边界', () => {
  it.each([7, 'label'])('直接值 %s 不生成契约无法执行的赋值', value => {
    const result = compileEquipmentSuitRuntimeBatchSource(
      [{ slug: 'suit_fixture', modifiers: [] }],
      [
        {
          suitId: 'suit_fixture',
          skillId: 'skill_fixture',
          startupBuffIds: [buffId],
          startupBuffs: [{ buffId, blackboardAssignments: { pulse_vul_duration: value } }],
          toggleBuffIds: [],
          toggleBuffs: [],
        },
      ],
      buffData,
    );
    if (typeof value === 'string') {
      expect(result.definitions).toEqual([]);
      expect(result.diagnostics).toContainEqual({
        status: 'blocked',
        sourcePath: `SkillData.skill_fixture.buffs.${buffId}.pulse_vul_duration`,
        reason: 'direct string Buff assignment is not supported by the generated action contract',
      });
      return;
    }
    expect(result.diagnostics).toEqual([]);
    const definition: GearSetDefinition = result.definitions[0]!;
    expect(definition.initializationSequence?.steps[0]).toMatchObject({
      kind: 'applyBuff',
      parameters: {
        blackboardAssignments: {
          pulse_vul_duration: { kind: 'constant', value: 7 },
        },
      },
    });
  });
});
