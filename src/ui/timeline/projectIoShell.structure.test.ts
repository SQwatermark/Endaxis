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
    expect(editorSource).toContain('openProject(projectInput,');
    expect(fileSessionSource).toContain('projectSession.snapshot.revision');
    expect(fileSessionSource).toContain('projectFileReader.dispose()');
    expect(editorSource).toContain('projectSession.replaceProject(project)');
    expect(editorSource).toContain('type="file"');
    expect(editorSource).toContain('@change="handleProjectFileChange"');
  });

  it('recognizes legacy files and converts them only after explicit confirmation', () => {
    expect(editorSource).toContain("legacy = inspectProjectInput(parsedInput).kind === 'legacy'");
    expect(editorSource).toContain("'转换旧版本轴'");
    expect(editorSource).toContain("confirmButtonText: '确定并转换'");
    expect(editorSource).toContain("'../../../tools/legacy-timeline/convert'");
    expect(editorSource).toContain("'../../../tools/legacy-timeline/mappings.2026-08-31.json'");
    expect(editorSource).toContain('legacyMappings as Parameters<typeof convertLegacyTimeline>[2]');
    expect(editorSource).toContain('showLegacyConversionReport(conversion.report, true)');
    expect(editorSource).toContain("'旧版本轴转换报告'");
    expect(editorSource).toContain(
      'markOpenedProject(project, gameDataRevisionUpdated || convertedLegacyProject)',
    );
    expect(editorSource.indexOf("'转换旧版本轴'")).toBeLessThan(
      editorSource.indexOf("'../../../tools/legacy-timeline/convert'"),
    );
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
