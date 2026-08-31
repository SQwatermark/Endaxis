import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import helpSource from './TimelineShortcutHelpDialog.vue?raw';

describe('Next timeline placement and alignment parity', () => {
  it('keeps mouse drag native and reserves sticky placement mode for keyboard shortcuts', () => {
    expect(editorSource).not.toContain('@select="beginLibraryPlacement(entry)"');
    expect(editorSource).not.toContain('@select-segment="beginLibraryPlacement(entry, $event)"');
    expect(editorSource).toContain("kind: 'librarySkill'");
    expect(editorSource).toContain("event.dataTransfer.effectAllowed = 'copy'");
    expect(editorSource).toContain('dropTimelinePayload(event: DragEvent');
    expect(editorSource).toContain('beginLibraryPlacement(entry);');
    expect(editorSource).toContain('placePendingLibrarySkill(event, trackIndex)');
    expect(editorSource).toContain("'is-library-placing': libraryPlacement !== null");
    expect(editorSource).toContain('library-placement-ghost');
  });

  it('cancels placement through Escape or a captured right click', () => {
    expect(editorSource).toContain('cancelPlacement: cancelLibraryPlacement');
    expect(editorSource).toContain('@contextmenu.capture="cancelPlacementFromContextMenu"');
    expect(helpSource).toContain('timeline.shortcuts.keys.cancelPlace');
  });

  it('routes Alt click and Alt+Shift click through real-time edge alignment', () => {
    expect(editorSource).toContain('alignSelectedCastToTarget(event, skillCastId)');
    expect(editorSource).toContain('resolveTimelineCastAlignmentFrame');
    expect(editorSource).toContain('@pointermove="updateAlignmentGuide($event, cast.id)"');
    expect(editorSource).toContain('class="alignment-guide"');
    expect(helpSource).toContain('timeline.shortcuts.keys.snapToAction');
    expect(helpSource).toContain('timeline.shortcuts.keys.alignToAction');
  });
});
