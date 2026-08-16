import { describe, expect, it } from 'vitest';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import { akekuri, endministrator, estella, fluorite, gilberta, lastRite, lifeng } from './index';

const generatedOperators: readonly [OperatorDefinition, number][] = [
  [gilberta, 9],
  [lifeng, 9],
  [estella, 9],
  [akekuri, 9],
  [fluorite, 10],
  [endministrator, 20],
  [lastRite, 9],
];

describe('新增的完整技能转换干员', () => {
  it.each(generatedOperators)('每个技能都被分配到技能组', (operator, count) => {
    const skills = operator.skillGroups.flatMap(group =>
      Array.isArray(group.skills) ? group.skills : [group.skills],
    );

    expect(skills).toHaveLength(count);
    expect(new Set(skills.map(skill => skill.key)).size).toBe(count);
    expect(skills.every(skill => skill.scheduledSequences.length > 0)).toBe(true);
  });

  it.each(generatedOperators)('会显式报告尚未转换的非技能能力', operator => {
    expect(operator.conversionSupport?.completeness).toBe('partial');
    expect(operator.conversionSupport?.missingCapabilities).toEqual(
      expect.arrayContaining([{ capability: 'talentEffects' }, { capability: 'potentialEffects' }]),
    );
  });
});
