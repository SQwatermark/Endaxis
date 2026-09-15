import { describe, expect, it } from 'vitest';
import editorSource from './TimelineEditor.vue?raw';
import fileSessionSource from './projectFileSession.ts?raw';
import toolbarSource from './components/TimelineHeaderToolbar.vue?raw';

describe('Next project I/O shell', () => {
  it('opens against the only latest data library and marks a normalized project unsaved', () => {
    expect(editorSource).toContain('result.gameDataRevisionUpdated');
    expect(fileSessionSource).toContain('projectDirty.value = gameDataRevisionUpdated');
    expect(editorSource).not.toContain('prepareDefaultWeaponMigration');
    expect(editorSource).not.toContain('WeaponMigrationDialog');
  });

  it('routes project files through the application open boundary', () => {
    expect(editorSource).toContain('import { openProject }');
    expect(editorSource).toContain('await projectFileReader.read(file)');
    expect(editorSource).toContain('if (content === null) return');
    expect(editorSource).toContain('openProject(content,');
    expect(fileSessionSource).toContain('projectSession.snapshot.revision');
    expect(fileSessionSource).toContain('projectFileReader.dispose()');
    expect(editorSource).toContain('projectSession.replaceProject(project)');
    expect(editorSource).toContain('type="file"');
    expect(editorSource).toContain('@change="handleProjectFileChange"');
  });

  it('serializes the complete project instead of exporting a scenario projection', () => {
    expect(fileSessionSource).toContain('serializeProjectDocument(project, true)');
    expect(fileSessionSource).toContain('downloadProjectJson(');
    expect(editorSource).toContain('@export="showExportDialog = true"');
    expect(editorSource).toContain('@export-json="exportProject"');
    expect(editorSource).toContain('@copy-code="copyProjectCode"');
    expect(editorSource).toContain('@export-small-image="openSmallImageExport"');
    expect(editorSource).toContain('@export-image="exportTimelineLongImage"');
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
    expect(fileSessionSource).toContain('snapshot.project !== savedProjectSnapshot');
    expect(editorSource).toContain('ElMessageBox.confirm');
    expect(fileSessionSource).toContain(
      "window.addEventListener('beforeunload', protectUnsavedProject)",
    );
    expect(editorSource).toContain(':project-dirty="projectDirty"');
    expect(toolbarSource).toContain('class="dirty-indicator"');
  });
});
