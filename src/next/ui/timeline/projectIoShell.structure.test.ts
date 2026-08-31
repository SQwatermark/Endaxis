import { describe, expect, it } from 'vitest';
import editorSource from './NextTimelineEditor.vue?raw';
import toolbarSource from './components/TimelineHeaderToolbar.vue?raw';

describe('Next project I/O shell', () => {
  it('opens against the only latest data library and marks a normalized project unsaved', () => {
    expect(editorSource).toContain('result.gameDataRevisionUpdated');
    expect(editorSource).toContain('projectDirty.value = gameDataRevisionUpdated');
    expect(editorSource).not.toContain('prepareDefaultWeaponMigration');
    expect(editorSource).not.toContain('WeaponMigrationDialog');
  });

  it('routes project files through the application open boundary', () => {
    expect(editorSource).toContain('import { openProject, type OpenProjectResult }');
    expect(editorSource).toContain('openProject(await file.text()');
    expect(editorSource).toContain('projectSession.replaceProject(project)');
    expect(editorSource).toContain('type="file"');
    expect(editorSource).toContain('@change="handleProjectFileChange"');
  });

  it('serializes the complete project instead of exporting a scenario projection', () => {
    expect(editorSource).toContain('serializeProjectDocument(project, true)');
    expect(editorSource).toContain('downloadProjectJson(content,');
    expect(editorSource).toContain('@export="exportProject"');
    expect(toolbarSource).toContain('export: [];');
    expect(toolbarSource).toContain('open: [];');
    expect(toolbarSource).toContain('@click="$emit(\'export\')"');
    expect(toolbarSource).toContain('@click="$emit(\'open\')"');
  });

  it('allocates future timeline identities against the opened document', () => {
    expect(editorSource).toContain('createProjectDocumentIdAllocator');
    expect(editorSource).not.toContain('nextDocumentId');
  });

  it('protects dirty projects before replacing or leaving the page', () => {
    expect(editorSource).toContain('snapshot.project !== savedProjectSnapshot.value');
    expect(editorSource).toContain('ElMessageBox.confirm');
    expect(editorSource).toContain(
      "window.addEventListener('beforeunload', protectUnsavedProject)",
    );
    expect(editorSource).toContain(':project-dirty="projectDirty"');
    expect(toolbarSource).toContain('class="dirty-indicator"');
  });
});
