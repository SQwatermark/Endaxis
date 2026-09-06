import { inject, onScopeDispose, provide, type InjectionKey } from 'vue';
import { useKeyboardShortcutScope } from '../keyboard/keyboardShortcutRouter';
import { createInteractionSession, type InteractionSession } from './interactionSession';

const interactionSessionKey: InjectionKey<InteractionSession> = Symbol('workbench-interaction');

export function provideInteractionSession(): InteractionSession {
  const session = createInteractionSession();
  provide(interactionSessionKey, session);
  useKeyboardShortcutScope({
    id: 'workbench-gesture',
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
