import { describe, expect, it } from 'vitest';
import editor from '../timeline/TimelineEditor.vue?raw';
import shell from '../timeline/components/TimelineWorkbenchShell.vue?raw';
import context from './interactionSessionContext.ts?raw';

describe('first workbench gesture ownership integration', () => {
  it('provides one boundary to the editor and its shell', () => {
    expect(editor).toContain('const interactionSession = provideInteractionSession()');
    expect(shell).toContain('const interactionSession = useInteractionSession()');
    for (const owner of ['library-drag', 'library-placement', 'cast-move', 'track-order']) {
      expect(editor).toMatch(new RegExp(`interactionSession\\.tryStart\\(\\s*'${owner}'`));
    }
    expect(shell).toContain("interactionSession.tryStart('workbench-resize'");
    expect(shell).toContain('moveEvent.pointerId !== event.pointerId');
  });

  it('routes the active gesture Escape through the keyboard dispatcher', () => {
    expect(context).toContain('useKeyboardShortcutScope({');
    expect(context).toContain('blockLowerScopes: true');
    expect(context).toContain("event.key === 'Escape' && session.cancel()");
    const castMove = editor.slice(
      editor.indexOf('function beginCastMove('),
      editor.indexOf('function castMoveFrame('),
    );
    expect(castMove).not.toContain("addEventListener('keydown'");
    expect(castMove).toContain('lease.release()');
  });
});
