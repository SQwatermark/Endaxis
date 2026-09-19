import { effectScope } from 'vue';
import { afterEach, expect, it, vi } from 'vitest';
import { createEmptyProject } from '../../core/project/createProject';
import { ProjectEditorSession } from '../../application/editor/projectEditorSession';
import { useProjectFileSession } from './projectFileSession';

const { saveBrowserProjectMock } = vi.hoisted(() => ({ saveBrowserProjectMock: vi.fn() }));
vi.mock('../../data/browserProjectStorage', () => ({ saveBrowserProject: saveBrowserProjectMock }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it('allows refresh after browser autosave completes, but protects edits while it is pending', async () => {
  const target = new EventTarget();
  vi.stubGlobal('window', target);
  let completeSave!: () => void;
  saveBrowserProjectMock.mockImplementation(
    () =>
      new Promise<void>(resolve => {
        completeSave = resolve;
      }),
  );
  const project = new ProjectEditorSession(
    createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' }),
  );
  const scope = effectScope();
  scope.run(() => useProjectFileSession(project, { persistToBrowser: true }));
  try {
    project.commit('edit', value => ({ ...value, createdWith: 'edited' }));
    const pending = new Event('beforeunload', { cancelable: true });
    target.dispatchEvent(pending);
    expect(pending.defaultPrevented).toBe(true);
    completeSave();
    await Promise.resolve();
    const saved = new Event('beforeunload', { cancelable: true });
    target.dispatchEvent(saved);
    expect(saved.defaultPrevented).toBe(false);
    expect(saveBrowserProjectMock).toHaveBeenCalledWith(project.snapshot.project);
  } finally {
    scope.stop();
  }
});

it('keeps refresh protection and exposes the error when browser autosave fails', async () => {
  const target = new EventTarget();
  vi.stubGlobal('window', target);
  saveBrowserProjectMock.mockRejectedValue(new Error('storage unavailable'));
  const project = new ProjectEditorSession(
    createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' }),
  );
  const scope = effectScope();
  const files = scope.run(() => useProjectFileSession(project, { persistToBrowser: true }))!;
  try {
    project.commit('edit', value => ({ ...value, createdWith: 'edited' }));
    await Promise.resolve();
    expect(files.browserSaveError.value).toBe('storage unavailable');
    const event = new Event('beforeunload', { cancelable: true });
    target.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  } finally {
    scope.stop();
  }
});

it('does not warn about unexported edits when browser persistence is disabled', () => {
  vi.stubGlobal('window', new EventTarget());
  const project = new ProjectEditorSession(
    createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' }),
  );
  const scope = effectScope();
  scope.run(() => useProjectFileSession(project));
  try {
    project.commit('edit', value => ({ ...value, createdWith: 'edited' }));
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
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
  saveBrowserProjectMock.mockImplementation(() => new Promise<void>(() => {}));
  const scope = effectScope();
  const files = scope.run(() => useProjectFileSession(project, { persistToBrowser: true }))!;
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
