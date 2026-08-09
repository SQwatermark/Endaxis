import { describe, expect, it } from 'vitest';
import type { TimelineSkillLibraryEntryViewModel } from './timelineEditorViewModel';
import { basicAttackSegmentLabel } from './timelineSkillLabels';

function skillLibraryEntry(
  skillType: TimelineSkillLibraryEntryViewModel['skillType'],
  skillKeys: readonly string[],
): TimelineSkillLibraryEntryViewModel {
  return {
    skillGroupKey: 'test',
    skillType,
    level: 1,
    skills: skillKeys.map(skillKey => ({
      skillKey,
      timelineBlockFrames: 30,
      source: { kind: 'operatorSkill', skillGroupKey: 'test', skillKey },
    })),
  };
}

describe('basicAttackSegmentLabel', () => {
  it('labels normal segments from A1 and the final segment as heavy attack', () => {
    const entry = skillLibraryEntry('basicAttack', ['attack-1', 'attack-2', 'attack-3']);

    expect(basicAttackSegmentLabel(entry, 'attack-1', '重击')).toBe('A1');
    expect(basicAttackSegmentLabel(entry, 'attack-2', '重击')).toBe('A2');
    expect(basicAttackSegmentLabel(entry, 'attack-3', '重击')).toBe('重击');
  });

  it('does not invent segment labels for other skill types or unknown skills', () => {
    expect(
      basicAttackSegmentLabel(skillLibraryEntry('battleSkill', ['skill']), 'skill', '重击'),
    ).toBe(null);
    expect(
      basicAttackSegmentLabel(
        skillLibraryEntry('basicAttack', ['attack-1', 'attack-2']),
        'missing',
        '重击',
      ),
    ).toBe(null);
  });
});
