import { onScopeDispose } from 'vue';
import { useKeyboardShortcutScope } from '../keyboard/keyboardShortcutRouter';
import type { InteractionSession } from './interactionSession';
import { createAsyncModalBoundary } from './asyncModalBoundary';
import type { InputRegion } from '../keyboard/inputRegions';

export function useAsyncModalBoundary(session: InteractionSession, region?: InputRegion) {
  const boundary = createAsyncModalBoundary(session);
  useKeyboardShortcutScope({
    id: 'service-modal',
    region,
    priority: 2000,
    active: () => boundary.active,
    blockLowerScopes: true,
    // Leave Escape, Enter and text editing to the modal's own native handlers.
    handle: () => false,
  });
  onScopeDispose(() => boundary.dispose());
  return boundary;
}
