/**
 * 本机下载轴的临时预览入口。项目由一次性批量重算生成，存放在忽略目录中。
 * 没有新结果时明确报错，不回退历史结果。完成对照后删除本文件及临时预览路由。
 */
const projectLoaders = import.meta.glob('/tmp/axis-refresh-20260918/*/project.json', {
  query: '?raw',
  import: 'default',
}) as Readonly<Record<string, () => Promise<string>>>;
const publicBatchLoaders = import.meta.glob(
  '/tmp/public-share-batch-20260918/results/*/project.json',
  {
    query: '?raw',
    import: 'default',
  },
) as Readonly<Record<string, () => Promise<string>>>;

export async function loadTemporaryLegacyPreviewProject(shareId: string): Promise<unknown> {
  const load =
    publicBatchLoaders[`/tmp/public-share-batch-20260918/results/${shareId}/project.json`] ??
    projectLoaders[`/tmp/axis-refresh-20260918/${shareId}/project.json`];
  if (load === undefined) throw new Error(`没有找到轴 ${shareId} 的本次重算预览项目`);
  return JSON.parse(await load()) as unknown;
}
