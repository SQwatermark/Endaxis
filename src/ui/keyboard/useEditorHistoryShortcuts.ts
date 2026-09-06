import { onMounted, onScopeDispose, ref, type Ref } from 'vue';
import { isTextEditingTarget, useKeyboardShortcutScope } from './keyboardShortcutRouter';

/** History belongs to the whole editor, not just its map. Text fields keep native undo. */
export function useEditorHistoryShortcuts(
  root: Ref<HTMLElement | null>,
  restore: (action: 'undo' | 'redo') => unknown,
) {
  const active = ref(false);
  const track = (event: Event) => {
    active.value = event.target instanceof Node && (root.value?.contains(event.target) ?? false);
  };
  onMounted(() => {
    document.addEventListener('pointerdown', track, true);
    document.addEventListener('focusin', track, true);
  });
  onScopeDispose(() => {
    if (typeof document === 'undefined') return;
    document.removeEventListener('pointerdown', track, true);
    document.removeEventListener('focusin', track, true);
  });
  useKeyboardShortcutScope({
    id: 'editor-history',
    priority: 150,
    active: () => active.value,
    handle: event => {
      if (isTextEditingTarget(event.target) || !(event.ctrlKey || event.metaKey) || event.altKey)
        return false;
      const key = event.key.toLowerCase();
      if (key !== 'z' && key !== 'y') return false;
      restore(key === 'y' || event.shiftKey ? 'redo' : 'undo');
      return true;
    },
  });
}
