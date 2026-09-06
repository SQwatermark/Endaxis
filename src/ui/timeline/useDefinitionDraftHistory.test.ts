import { effectScope, shallowRef } from 'vue';
import { expect, it } from 'vitest';
import { useDefinitionDraftHistory } from './useDefinitionDraftHistory';

it('isolates history snapshots, invalidates redo after a new edit and resets on external replacement', () => {
  const scope = effectScope();
  const value = shallowRef({ steps: [1] });
  const history = scope.run(() =>
    useDefinitionDraftHistory(
      () => value.value,
      next => {
        value.value = next;
      },
    ),
  )!;
  try {
    const input = { steps: [1, 2] };
    history.commit(input);
    input.steps.push(3);
    expect(value.value.steps).toEqual([1, 2]);
    history.restore('undo');
    expect(value.value.steps).toEqual([1]);
    expect(history.canRedo.value).toBe(true);
    history.commit({ steps: [4] });
    expect(history.canRedo.value).toBe(false);
    history.restore('undo');
    expect(value.value.steps).toEqual([1]);
    history.restore('redo');
    expect(value.value.steps).toEqual([4]);
    value.value = { steps: [9] };
    expect(history.canUndo.value).toBe(false);
    history.restore('undo');
    expect(value.value.steps).toEqual([9]);
    history.commit({ steps: [9] });
    expect(history.canUndo.value).toBe(false);
  } finally {
    scope.stop();
  }
});
