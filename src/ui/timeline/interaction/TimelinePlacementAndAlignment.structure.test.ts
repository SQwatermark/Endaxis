import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import castMoveSource from './useTimelineCastMove.ts?raw';
import helpSource from './TimelineShortcutHelpDialog.vue?raw';

describe('Next timeline placement and alignment parity', () => {
  it('routes page selection and project replacement through the gesture owner', () => {
    expect(editorSource).toContain('if (consumeCastClick(skillCastId)) return;');
    expect(editorSource).toContain('discardCastMove();');
    expect(editorSource).not.toContain('stopCastMoveGesture');
    expect(editorSource).not.toContain('suppressedCastClickId');
  });

  it('keeps mouse drag native and reserves sticky placement mode for keyboard shortcuts', () => {
    expect(editorSource).not.toContain('@select="beginLibraryPlacement(entry)"');
    expect(editorSource).not.toContain('@select-segment="beginLibraryPlacement(entry, $event)"');
    expect(editorSource).toContain("kind: 'librarySkill'");
    expect(editorSource).toContain("event.dataTransfer.effectAllowed = 'copy'");
    expect(editorSource).toMatch(/dropTimelinePayload\(\s*event: DragEvent/);
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
    expect(editorSource).toContain('useTimelineCastMove({');
    expect(castMoveSource).toContain('alignSelectedCastToTarget(event, skillCastId)');
    expect(editorSource).toContain('resolveTimelineCastAlignmentFrame');
    expect(editorSource).toContain('@pointermove="updateAlignmentGuide($event, cast.id)"');
    expect(editorSource).toContain('class="alignment-guide"');
    expect(helpSource).toContain('timeline.shortcuts.keys.snapToAction');
    expect(helpSource).toContain('timeline.shortcuts.keys.alignToAction');
  });

  it('keeps cast movement as one preview transaction and one history command', () => {
    const update = castMoveSource.slice(
      castMoveSource.indexOf('function updateCastMoveAt('),
      castMoveSource.indexOf('function updateCastMove(event:'),
    );
    const finish = castMoveSource.slice(
      castMoveSource.indexOf('async function finishCastMove('),
      castMoveSource.indexOf('function cancelCastMove('),
    );

    expect(update).toContain('gesture.baseScenario');
    expect(update).toContain('const movedScenario = moveSkillCasts(');
    expect(update).toContain('scenario.value = movedScenario;');
    expect(update).toContain('previewFrame: placedFrame');
    expect(update).toContain('frame.actualFrame + placedFrame - frame.placementFrame');
    expect(update).not.toContain('commitScenario(');
    expect(finish.match(/commitScenario\('moveSkillCasts'/g)).toHaveLength(1);
    expect(finish).toContain('const finalScenario = scenario.value;');
    expect(finish).toContain("commitScenario('moveSkillCasts', () => finalScenario)");
  });

  it('restores the pre-gesture scenario on Escape and pointer cancellation', () => {
    const begin = castMoveSource.slice(
      castMoveSource.indexOf('function beginCastMove('),
      castMoveSource.indexOf('function castMoveFrame('),
    );
    const cancel = castMoveSource.slice(
      castMoveSource.indexOf('function cancelCastMove('),
      castMoveSource.indexOf('function discardCastMove('),
    );

    expect(begin).toContain("window.addEventListener('pointercancel', onCancel)");
    expect(begin).toContain("interactionSession.tryStart('cast-move', cancelCastMove)");
    expect(begin).not.toContain("window.addEventListener('keydown'");
    expect(cancel).toContain('scenario.value = gesture.baseScenario');
    expect(cancel).not.toContain('commitScenario(');
  });

  it('owns the pointer on a stable container until finish or cancellation', () => {
    const begin = castMoveSource.slice(
      castMoveSource.indexOf('function beginCastMove('),
      castMoveSource.indexOf('function castMoveFrame('),
    );
    expect(begin).toContain('const captureTarget = timelineScroll.value;');
    expect(begin).toContain('captureTarget?.setPointerCapture(event.pointerId)');
    expect(begin).toContain("window.addEventListener('pointermove', onMove, true)");
    expect(begin).toContain("window.removeEventListener('pointermove', onMove, true)");
    expect(begin).toContain("window.addEventListener('pointerup', onFinish, true)");
    expect(begin).toContain("window.removeEventListener('pointerup', onFinish, true)");
    expect(begin).toContain("captureTarget?.removeEventListener('lostpointercapture', onCancel)");
    expect(begin).toContain('captureTarget.releasePointerCapture(event.pointerId)');
    expect(begin).toContain("window.addEventListener('blur', onCancel)");
    expect(begin).toContain("window.removeEventListener('blur', onCancel)");
  });
});
