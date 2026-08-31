import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import source from './SkillLibraryCard.vue?raw';
import workbenchSource from './TimelineWorkbenchShell.vue?raw';

describe('SkillLibraryCard legacy structure parity', () => {
  it('renders the operation type as the primary label and the skill name as secondary context', () => {
    expect(source).toContain('<span class="skill-secondary">{{ name }}</span>');
    expect(source).toContain('<div class="skill-primary">{{ typeLabel || name }}</div>');
    expect(source).toMatch(/\.skill-primary \{[\s\S]*font-size: 15px/);
    expect(source).toMatch(/\.skill-secondary \{[\s\S]*font-size: 9px/);
  });

  it('keeps the old dimensions, decoration and segment strip', () => {
    expect(source).toContain('height: 60px');
    expect(source).toContain('width: 4px');
    expect(source).toContain('width: 50px');
    expect(source).toContain('width: 28px');
    expect(source).toContain('min-height: 22px');
    expect(source).toContain("content: '>'");
  });

  it('always leaves a native title fallback for the complete skill name', () => {
    expect(source).toContain(':title="tooltip || name"');
  });

  it('uses the operator basic-attack name as secondary context for finisher and plunging attack', () => {
    const nameProjection = editorSource.slice(
      editorSource.indexOf('function skillLibraryEntryName('),
      editorSource.indexOf('function skillDurationSeconds('),
    );
    expect(nameProjection).toContain("entry.skillType === 'finisher'");
    expect(nameProjection).toContain("entry.skillType === 'plungingAttack'");
    expect(nameProjection).toContain("candidate.skillType === 'basicAttack'");
    expect(nameProjection).toContain('nameEntry.skillGroupKey');
    expect(nameProjection).not.toContain('return skillTypeLabel(entry.skillType)');
  });

  it('does not add a rich-text tooltip that the old skill library did not expose', () => {
    expect(editorSource).not.toContain('<OperatorSkillTooltip');
    expect(editorSource).not.toContain('selectedTrackLegacyOperatorSheet');
    expect(editorSource).not.toContain('operator-edit-tooltip-popper');
    expect(editorSource).toContain(':tooltip="skillLibraryEntryName(entry)"');
  });

  it('uses the old native drag-and-drop gesture instead of turning drag into sticky placement', () => {
    const handler = editorSource.slice(
      editorSource.indexOf('function beginSkillDrag('),
      editorSource.indexOf('function beginCastMove('),
    );

    expect(source).toContain('draggable="true"');
    expect(source).toContain('@dragend="$emit(\'dragend\', $event)"');
    expect(handler).not.toContain('event.preventDefault();');
    expect(handler).not.toContain('beginLibraryPlacement(entry, skillKey);');
    expect(handler).toContain("kind: 'librarySkill'");
    expect(handler).toContain("event.dataTransfer.effectAllowed = 'copy'");
    expect(handler).toContain("event.dataTransfer.setData('text/plain'");
    expect(handler).toContain('event.dataTransfer.setDragImage(');
    expect(editorSource).toContain('@dragend="finishSkillDrag"');
    expect(editorSource).not.toContain('@select="beginLibraryPlacement(entry)"');
  });

  it('places on mouse release using the drag-image grab offset and only accepts the active track', () => {
    const handler = editorSource.slice(
      editorSource.indexOf('function dropTimelinePayload('),
      editorSource.indexOf('function resetScenario('),
    );

    expect(handler).toContain("if (payload.kind === 'trackOrder')");
    expect(handler).toContain('if (trackIndex !== selectedTrack.value) return;');
    expect(handler).toContain(
      'event.clientX - lane.getBoundingClientRect().left - payload.dragOffsetX',
    );
    expect(handler).toContain('placeGroup(payload.skillGroupKey');
  });

  it('uses the old library header and section hierarchy in the Next editor', () => {
    expect(workbenchSource).toContain('class="panel-chrome panel-chrome--left"');
    expect(workbenchSource).toContain('@click="resetPanelSize(\'left\')"');
    expect(editorSource).toContain("t('actionLibrary.section.operatorStatusAdjust')");
    expect(editorSource).toContain("t('actionLibrary.hints.clickOrDrag')");
    expect(editorSource).toContain('grid-template-columns: repeat(3, minmax(0, 1fr))');
    expect(editorSource).toContain('gap: 8px');
  });
});
