import { effectScope, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import {
  useInputRegionEligibility,
  useKeyboardInputRegion,
} from '../keyboard/keyboardShortcutRouter';
import { useInteractionBarrier } from './interactionSessionContext';
import { createInteractionSession } from './interactionSession';

describe('region-owned gesture isolation', () => {
  it('cancels and blocks background gestures until the last modal descendant closes', () => {
    const scope = effectScope();
    const dialog = ref(false);
    const child = ref(false);
    const session = createInteractionSession();
    const cancelled = vi.fn();
    scope.run(() => {
      const root = useKeyboardInputRegion({ label: 'root', parent: null, active: () => true });
      const eligible = useInputRegionEligibility(root);
      useInteractionBarrier(session, () => !eligible.value);
      const modal = useKeyboardInputRegion({
        label: 'dialog',
        parent: root,
        modal: true,
        active: () => dialog.value,
      });
      useKeyboardInputRegion({
        label: 'child',
        parent: modal,
        modal: true,
        active: () => child.value,
      });
    });
    expect(session.tryStart('cast', cancelled)).not.toBeNull();
    dialog.value = true;
    expect(cancelled).toHaveBeenCalledOnce();
    expect(session.tryStart('resize', vi.fn())).toBeNull();
    child.value = true;
    dialog.value = false;
    expect(session.tryStart('cast', vi.fn())).toBeNull();
    child.value = false;
    expect(session.tryStart('cast', vi.fn())).not.toBeNull();
    scope.stop();
  });
});
