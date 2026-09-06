import { computed, shallowRef, watch, type ComputedRef } from 'vue';
import { editorDefinitionsEqual } from '../editorDefinitionsEqual';
import { cloneStructureValue } from './skillStructureEditorCommands';

export interface DefinitionDraftHistory<T> {
  commit(value: T): void;
  restore(action: 'undo' | 'redo'): void;
  readonly canUndo: ComputedRef<boolean>;
  readonly canRedo: ComputedRef<boolean>;
}

/** History belongs to one mounted editing context. Hosts key instances by object identity.
 * An unrelated parent replacement also resets history instead of replaying old snapshots into it. */
export function useDefinitionDraftHistory<T>(
  read: () => T,
  publish: (value: T) => void,
): DefinitionDraftHistory<T> {
  const past = shallowRef<T[]>([]);
  const future = shallowRef<T[]>([]);
  let expected = cloneStructureValue(read());
  watch(
    read,
    value => {
      if (!editorDefinitionsEqual(value, expected)) {
        past.value = [];
        future.value = [];
      }
      expected = cloneStructureValue(value);
    },
    { flush: 'sync' },
  );

  function send(value: T): void {
    expected = cloneStructureValue(value);
    publish(cloneStructureValue(value));
  }
  function commit(value: T): void {
    if (editorDefinitionsEqual(value, read())) return;
    past.value = [...past.value, cloneStructureValue(read())];
    future.value = [];
    send(value);
  }
  function restore(action: 'undo' | 'redo'): void {
    const source = action === 'undo' ? past : future;
    const target = action === 'undo' ? future : past;
    const value = source.value.at(-1);
    if (value === undefined) return;
    source.value = source.value.slice(0, -1);
    target.value = [...target.value, cloneStructureValue(read())];
    send(value);
  }
  return {
    commit,
    restore,
    canUndo: computed(() => past.value.length > 0),
    canRedo: computed(() => future.value.length > 0),
  };
}
