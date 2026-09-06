import { inject, onScopeDispose, provide, watch, type InjectionKey } from 'vue';
import { useKeyboardShortcutScope } from '../keyboard/keyboardShortcutRouter';
import { createInteractionSession, type InteractionSession } from './interactionSession';
import type { InputRegion } from '../keyboard/inputRegions';

const interactionSessionKey: InjectionKey<InteractionSession> = Symbol('workbench-interaction');

/** Register a background-gesture barrier for a panel's actual open lifecycle. */
export function useInteractionBarrier(session: InteractionSession, active: () => boolean): void {
  let release: (() => void) | undefined;
  watch(
    active,
    blocked => {
      if (blocked) release ??= session.block();
      else {
        release?.();
        release = undefined;
      }
    },
    { immediate: true, flush: 'sync' },
  );
  onScopeDispose(() => release?.());
}

export function provideInteractionSession(region?: InputRegion): InteractionSession {
  const session = createInteractionSession();
  provide(interactionSessionKey, session);
  useKeyboardShortcutScope({
    id: 'workbench-gesture',
    region,
    priority: 1000,
    active: () => session.current !== null,
    blockLowerScopes: true,
    handle: event => event.key === 'Escape' && session.cancel(),
  });
  const cancel = () => {
    session.cancel();
  };
  window.addEventListener('blur', cancel);
  onScopeDispose(() => {
    window.removeEventListener('blur', cancel);
    session.cancel();
  });
  return session;
}

/** Standalone shells still work; descendants of an editor share its ownership boundary. */
export function useInteractionSession(): InteractionSession {
  const inherited = inject(interactionSessionKey, null);
  return inherited ?? provideInteractionSession();
}
