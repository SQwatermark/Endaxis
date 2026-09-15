import { effectScope } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { createEmptyProject } from '../../core/project/createProject';
import { ProjectEditorSession } from '../../application/editor/projectEditorSession';
import { useProjectFileSession } from './projectFileSession';

afterEach(() => vi.unstubAllGlobals());

it('tracks the saved identity through edits, undo and normalized project loading', () => {
  vi.stubGlobal('window', new EventTarget());
  const initial = createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' });
  const project = new ProjectEditorSession(initial);
  const scope = effectScope();
  const files = scope.run(() => useProjectFileSession(project))!;
  try {
    project.commit('edit', value => ({ ...value, createdWith: 'edited' }));
    expect(files.projectDirty.value).toBe(true);
    project.undo();
    expect(files.projectDirty.value).toBe(false);
    const normalized = { ...initial, gameDataRevision: 'updated' };
    project.replaceProject(normalized);
    files.markOpenedProject(normalized, true);
    expect(files.projectDirty.value).toBe(true);
    files.markOpenedProject(normalized, false);
    expect(files.projectDirty.value).toBe(false);
  } finally {
    scope.stop();
  }
});

it('cancels pending file reads and removes leave protection when its scope ends', async () => {
  const target = new EventTarget();
  vi.stubGlobal('window', target);
  const project = new ProjectEditorSession(
    createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' }),
  );
  const scope = effectScope();
  const files = scope.run(() => useProjectFileSession(project))!;
  project.commit('edit', value => ({ ...value, createdWith: 'edited' }));
  const before = new Event('beforeunload', { cancelable: true });
  target.dispatchEvent(before);
  expect(before.defaultPrevented).toBe(true);
  let finish!: (text: string) => void;
  const pending = files.projectFileReader.read({
    text: () =>
      new Promise<string>(resolve => {
        finish = resolve;
      }),
  });
  scope.stop();
  finish('stale');
  await expect(pending).resolves.toBeNull();
  const after = new Event('beforeunload', { cancelable: true });
  target.dispatchEvent(after);
  expect(after.defaultPrevented).toBe(false);
});
