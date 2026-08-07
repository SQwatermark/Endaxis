/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { basicAttackOfType, percentages } from '../definitionHelpers';

const electricBasicAttack = basicAttackOfType('electric');

// prettier-ignore
export const perlicaGeneratedSkills = [
  electricBasicAttack(
    'basicAttack1',
    16,
    8,
    percentages([25, 28, 31, 33, 36, 38, 41, 43, 46, 49, 53, 57]),
  ),
  electricBasicAttack(
    'basicAttack2',
    18,
    [9, 12],
    percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
  ),
  electricBasicAttack(
    'basicAttack3',
    26,
    [16, 19, 22],
    percentages([12, 14, 15, 16, 17, 19, 20, 21, 22, 24, 26, 28]),
  ),
  electricBasicAttack(
    'basicAttack4',
    44,
    27,
    percentages([57, 62, 68, 73, 79, 85, 90, 96, 102, 109, 117, 127]),
    { final: true, spRecovery: 15, stagger: 15 },
  ),
] as const satisfies readonly SkillDefinition[];
