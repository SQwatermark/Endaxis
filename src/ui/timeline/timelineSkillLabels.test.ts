import { describe, expect, it } from 'vitest';
import type { TimelineSkillLibraryEntryViewModel } from './timelineEditorViewModel';
import {
  skillLibrarySegmentLabel,
  timelineSkillBlockLabel,
  timelineSkillSegmentLabel,
  type TimelineSkillSegmentLabels,
} from './timelineSkillLabels';

const labels: TimelineSkillSegmentLabels = {
  heavyAttack: '重击',
  battleSkill: '战技',
  comboSkill: '连携',
};

function skillLibraryEntry(
  skillType: TimelineSkillLibraryEntryViewModel['skillType'],
  skillKeys: readonly string[],
  enhanced = false,
): TimelineSkillLibraryEntryViewModel {
  return {
    entryKey: 'test:fixture',
    skillGroupKey: 'test',
    skillType,
    level: 1,
    enhanced,
    groupPlacementSkillKeys: skillKeys,
    skills: skillKeys.map(skillKey => ({
      skillKey,
      timelineBlockFrames: 30,
      source: { kind: 'operatorSkill', skillGroupKey: 'test', skillKey },
    })),
  };
}

describe('skill sequence labels', () => {
  it('uses operation notation in the skill library', () => {
    const entry = skillLibraryEntry('basicAttack', ['attack-1', 'attack-2', 'attack-3']);

    expect(skillLibrarySegmentLabel(entry, 'attack-1', labels)).toBe('A1');
    expect(skillLibrarySegmentLabel(entry, 'attack-2', labels)).toBe('A2');
    expect(skillLibrarySegmentLabel(entry, 'attack-3', labels)).toBe('重击');
    expect(
      skillLibrarySegmentLabel(
        skillLibraryEntry('battleSkill', ['skill-1', 'skill-2']),
        'skill-2',
        labels,
      ),
    ).toBe('C2');
    expect(
      skillLibrarySegmentLabel(
        skillLibraryEntry('comboSkill', ['combo-1', 'combo-2']),
        'combo-1',
        labels,
      ),
    ).toBe('E1');
  });

  it('uses semantic numbered names on timeline blocks', () => {
    expect(
      timelineSkillSegmentLabel(
        skillLibraryEntry('battleSkill', ['skill-1', 'skill-2']),
        'skill-1',
        labels,
      ),
    ).toBe('战技 1');
    expect(
      timelineSkillSegmentLabel(
        skillLibraryEntry('comboSkill', ['combo-1', 'combo-2']),
        'combo-2',
        labels,
      ),
    ).toBe('连携 2');
  });

  it('does not invent sequence labels for single or unknown skills', () => {
    expect(
      skillLibrarySegmentLabel(skillLibraryEntry('battleSkill', ['skill']), 'skill', labels),
    ).toBe(null);
    expect(
      timelineSkillSegmentLabel(
        skillLibraryEntry('basicAttack', ['attack-1', 'attack-2']),
        'missing',
        labels,
      ),
    ).toBe(null);
  });

  it('marks enhanced timeline blocks with an asterisk', () => {
    expect(
      timelineSkillBlockLabel(
        skillLibraryEntry('battleSkill', ['enhanced-skill'], true),
        'enhanced-skill',
        labels,
        '战技',
      ),
    ).toBe('战技*');
    expect(
      timelineSkillBlockLabel(
        skillLibraryEntry('comboSkill', ['enhanced-combo'], true),
        'enhanced-combo',
        labels,
        '连携',
      ),
    ).toBe('连携*');
    expect(
      timelineSkillBlockLabel(
        skillLibraryEntry('basicAttack', ['attack-1', 'heavy-attack'], true),
        'attack-1',
        labels,
        '普攻',
      ),
    ).toBe('A1*');
    expect(
      timelineSkillBlockLabel(
        skillLibraryEntry('basicAttack', ['attack-1', 'heavy-attack'], true),
        'heavy-attack',
        labels,
        '普攻',
      ),
    ).toBe('重击*');
  });
});
