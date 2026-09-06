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
