import { onScopeDispose, ref } from 'vue';
import type { ProjectEditorSession } from '../../application/editor/projectEditorSession';
import type { EndaxisProjectDocument } from '../../core/project/schema';
import { serializeProjectDocument } from '../../core/project/serialization';
import { downloadBlob, projectFilename } from './timelineExport';

/** 文件会话拥有读取代次、导出基线和离页保护；项目解析及替换确认仍由应用入口负责。 */
export function useProjectFileSession(projectSession: ProjectEditorSession) {
  let savedProjectSnapshot = projectSession.snapshot.project;
  const projectDirty = ref(false);
  const projectFileReader = createProjectFileReader(() => projectSession.snapshot.revision);
  const unsubscribe = projectSession.subscribe(snapshot => {
    projectDirty.value = snapshot.project !== savedProjectSnapshot;
  });
  function markOpenedProject(project: EndaxisProjectDocument, gameDataRevisionUpdated: boolean) {
    if (!gameDataRevisionUpdated) savedProjectSnapshot = project;
    projectDirty.value = gameDataRevisionUpdated;
  }
  function exportProjectFile(filename?: string) {
    const project = projectSession.snapshot.project;
    const content = serializeProjectDocument(project, true);
    const activeScenario = project.scenarios.find(value => value.id === project.activeScenarioId);
    const fileBase = (activeScenario?.name ?? project.activeScenarioId)
      .replace(/[^A-Za-z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    downloadProjectJson(
      content,
      filename === undefined ? `${fileBase || 'endaxis-project'}.json` : projectFilename(filename),
    );
    savedProjectSnapshot = project;
    projectDirty.value = false;
  }
  function protectUnsavedProject(event: BeforeUnloadEvent) {
    if (!projectDirty.value) return;
    event.preventDefault();
    event.returnValue = '';
  }
  window.addEventListener('beforeunload', protectUnsavedProject);
  onScopeDispose(() => {
    unsubscribe();
    projectFileReader.dispose();
    window.removeEventListener('beforeunload', protectUnsavedProject);
  });
  return { projectDirty, projectFileReader, markOpenedProject, exportProjectFile };
}

/** File selection is replaceable work: only the newest read may reach project parsing.
 * A revision protects intervening edits, including an undo back to the same document object. */
export function createProjectFileReader(getProjectRevision: () => number) {
  let generation = 0;
  let disposed = false;
  return {
    async read(file: Pick<File, 'text'>): Promise<string | null> {
      if (disposed) return null;
      const request = ++generation;
      const revision = getProjectRevision();
      const current = () => !disposed && request === generation;
      let content: string;
      try {
        content = await file.text();
      } catch (error) {
        if (!current()) return null;
        throw error;
      }
      if (!current()) return null;
      if (revision !== getProjectRevision()) {
        throw new Error('读取文件期间当前项目已变化，请重新加载');
      }
      return content;
    },
    dispose(): void {
      disposed = true;
      generation += 1;
    },
  };
}

/** 触发浏览器下载，不把点击等同于持久化备份；对象 URL 保留到浏览器消费后再释放。 */
export function downloadProjectJson(content: string, filename: string): void {
  downloadBlob(new Blob([content], { type: 'application/json' }), filename);
}
