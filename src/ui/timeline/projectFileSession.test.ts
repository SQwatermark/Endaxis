import { readFile } from 'node:fs/promises';
import { effectScope } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEmptyProject, createEmptyScenario } from '../../core/project/createProject';
import { parseProjectDocument, serializeProjectDocument } from '../../core/project/serialization';
import { ProjectEditorSession } from '../../application/editor/projectEditorSession';
import { compressProjectCode } from './timelineExport';
import { embedProjectCodeInWebp } from './webpProjectData';
import {
  createProjectFileReader,
  selectProjectExportScope,
  useProjectFileSession,
} from './projectFileSession';

const { saveBrowserProjectMock } = vi.hoisted(() => ({ saveBrowserProjectMock: vi.fn() }));
vi.mock('../../data/browserProjectStorage', () => ({ saveBrowserProject: saveBrowserProjectMock }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('project export scope', () => {
  it('keeps every scenario when exporting the whole project', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' });
    project.scenarios.push(createEmptyScenario('scenario:2', 'Second'));

    expect(selectProjectExportScope(project, 'all')).toBe(project);
  });

  it('exports an inherited current scenario as a standalone, importable project', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'test' });
    const child = createEmptyScenario('scenario:2', 'Second');
    child.inheritance = { frame: 30, sourceScenarioId: project.activeScenarioId };
    project.scenarios.push(child);
    project.activeScenarioId = child.id;

    const exported = selectProjectExportScope(project, 'current');
    expect(exported.scenarios.map(scenario => scenario.id)).toEqual([child.id]);
    expect(exported.scenarios[0]?.inheritance).toBeUndefined();
    expect(child.inheritance).toBeDefined();
    expect(parseProjectDocument(serializeProjectDocument(exported)).ok).toBe(true);
  });
});

it('reads an exported WebP through the project file reader', async () => {
  const bytes = await readFile(
    new URL('../../../public/next/passive-ui/typhoea-bg.webp', import.meta.url),
  );
  const content = '{"kind":"test"}';
  const image = await embedProjectCodeInWebp(
    new Blob([Uint8Array.from(bytes)], { type: 'image/webp' }),
    await compressProjectCode(content),
  );
  let revision = 0;
  const reader = createProjectFileReader(() => revision);
  await expect(reader.readWebp(image)).resolves.toBe(content);
  revision += 1;
  await expect(reader.readWebp(image)).resolves.toBe(content);
  reader.dispose();
  await expect(reader.readWebp(image)).resolves.toBeNull();
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
