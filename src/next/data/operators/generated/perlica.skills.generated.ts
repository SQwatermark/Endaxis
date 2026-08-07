/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { basicAttackOfType } from '../definitionHelpers';

// prettier-ignore
export const perlicaGeneratedSkills = [
  basicAttackOfType("electric")("basicAttack1", 16, 8, [
  0.25,
  0.28,
  0.31,
  0.33,
  0.36,
  0.38,
  0.41,
  0.43,
  0.46,
  0.49,
  0.53,
  0.57
], {}),
  basicAttackOfType("electric")("basicAttack2", 18, [
  9,
  12
], [
  0.15,
  0.17,
  0.18,
  0.2,
  0.21,
  0.23,
  0.24,
  0.26,
  0.27,
  0.29,
  0.31,
  0.34
], {}),
  basicAttackOfType("electric")("basicAttack3", 26, [
  16,
  19,
  22
], [
  0.12,
  0.14,
  0.15,
  0.16,
  0.17,
  0.19,
  0.2,
  0.21,
  0.22,
  0.24,
  0.26,
  0.28
], {}),
  basicAttackOfType("electric")("basicAttack4", 44, 27, [
  0.57,
  0.62,
  0.68,
  0.73,
  0.79,
  0.85,
  0.9,
  0.96,
  1.02,
  1.09,
  1.17,
  1.27
], {
  "final": true,
  "spRecovery": 15.0,
  "stagger": 15.0
}),
] as const satisfies readonly SkillDefinition[];
