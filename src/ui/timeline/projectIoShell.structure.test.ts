import { describe, expect, it } from 'vitest';
import editorSource from './TimelineEditor.vue?raw';
import fileSessionSource from './projectFileSession.ts?raw';
import toolbarSource from './components/TimelineHeaderToolbar.vue?raw';

describe('Next project I/O shell', () => {
  it('opens against the latest data library without tracking an export baseline', () => {
    expect(editorSource).toContain('result.gameDataRevisionUpdated');
    expect(fileSessionSource).not.toContain('savedProjectSnapshot');
    expect(fileSessionSource).not.toContain('projectDirty');
    expect(editorSource).not.toContain('prepareDefaultWeaponMigration');
    expect(editorSource).not.toContain('WeaponMigrationDialog');
  });

  it('routes project files through the application open boundary', () => {
    expect(editorSource).toContain('import { openProject }');
    expect(editorSource).toContain('await projectFileReader.read(file)');
    expect(editorSource).toContain('if (content !== null) await openProjectContent(content)');
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
    expect(editorSource).toContain("'../../application/legacyTimeline/convert'");
    expect(editorSource).toContain("'../../application/legacyTimeline/mappings.json'");
    expect(editorSource).toContain('legacyMappings as Parameters<typeof convertLegacyTimeline>[2]');
    expect(editorSource).toContain('showLegacyConversionReport(conversion.report, true)');
    expect(editorSource).toContain("'旧版本轴转换报告'");
    expect(editorSource.indexOf("'转换旧版本轴'")).toBeLessThan(
      editorSource.indexOf("'../../application/legacyTimeline/convert'"),
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
    expect(toolbarSource).toContain('@click="runProjectAction(\'open\')"');
  });

  it('allocates future timeline identities against the opened document', () => {
    expect(editorSource).toContain('createProjectDocumentIdAllocator');
    expect(editorSource).not.toContain('nextDocumentId');
  });

  it('only protects pending or failed browser autosaves before leaving the page', () => {
    expect(fileSessionSource).toContain(
      "window.addEventListener('beforeunload', protectPendingBrowserSave)",
    );
    expect(fileSessionSource).toContain(
      'pendingBrowserSaves === 0 && browserSaveError.value === null',
    );
    expect(editorSource).not.toContain('confirmProjectReplacement');
    expect(toolbarSource).not.toContain('dirty-indicator');
  });
});
