/**
 * 临时公开轴预览入口。
 *
 * 项目文件仍保存在被 Git 忽略的 tmp 目录。本表只把已经完成对照的分享 ID 指向
 * 对应的最新转换结果，并通过 Vite 的懒加载一次读取一份项目。完成对照后应删除本文件
 * 以及 /timeline/preview/:legacyShareId 路由。
 */

const projectLoaders = import.meta.glob('/tmp/public-*/project.json', {
  query: '?raw',
  import: 'default',
}) as Readonly<Record<string, () => Promise<string>>>;

const projectPathsByShareId: Readonly<Record<string, string>> = {
  '6a7099e6fadd074c1dd672f0': '/tmp/public-6a7099e6-control-inferred-final-20260913/project.json',
  '6a7401f9fadd074c1dd678d2':
    '/tmp/public-6a7401f9-control-inferred-final-v2-20260913/project.json',
  '6a7bdbb4545eaf8ea78bcf3b': '/tmp/public-6a7bdbb4-control-inferred-final-20260913/project.json',
  '6a81d0189c9520f3082c7b2c': '/tmp/public-6a81d018-control-inferred-final-20260913/project.json',
  '6a868af89c9520f3082c83a3': '/tmp/public-6a868af8-control-inferred-final-20260913/project.json',
  '6a86e37f942c37e770f93e71': '/tmp/public-6a86e37f-control-inferred-final-20260913/project.json',
  '6a89385c52262b2502bebcf9': '/tmp/public-6a89385c-control-inferred-final-20260913/project.json',
  '6a89943d20d851dfb24cfa86': '/tmp/public-6a89943d-control-inferred-final-20260913/project.json',
  '6a89cdbf20d851dfb24cfb7f': '/tmp/public-6a89cdbf-control-inferred-final-20260913/project.json',
  '6a8a76c020d851dfb24cfccc': '/tmp/public-6a8a76c0-control-inferred-final-20260913/project.json',
  '6a8bdb491ffdf1c2f7670091': '/tmp/public-6a8bdb49-control-inferred-final-20260913/project.json',
  '6a8bfd281ffdf1c2f76700d0': '/tmp/public-6a8bfd28-control-inferred-final-20260913/project.json',
  '6a8c57d595147370855b4327': '/tmp/public-6a8c57d5-control-inferred-final-20260913/project.json',
  '6a8d3b0495147370855b447b': '/tmp/public-6a8d3b04-control-inferred-final-20260913/project.json',
  '6a8db78895147370855b45ed': '/tmp/public-6a8db788-control-inferred-final-20260913/project.json',
  '6a8db84395147370855b45f0':
    '/tmp/public-6a8db843-control-inferred-final-v2-20260913/project.json',
  '6a8ede6013c199570c8acd93': '/tmp/public-6a8ede60-control-inferred-final-20260913/project.json',
  '6a8fed711854aefb13171ece': '/tmp/public-6a8fed71-control-inferred-final-20260913/project.json',
  '6a9016691854aefb13171f3e': '/tmp/public-6a901669-control-inferred-final-20260913/project.json',
  '6a94f34b1854aefb131727a3': '/tmp/public-6a94f34b-control-inferred-final-20260913/project.json',
  '6a9fc54fc45f70b4bc313dee': '/tmp/public-6a9fc54f-control-inferred-final-20260913/project.json',
  '6aa007f284e6053016fcb57c': '/tmp/public-6aa007f2-control-inferred-final-20260913/project.json',
  '6aa22b1b0185263def704fb3': '/tmp/public-6aa22b1b-control-inferred-final-20260913/project.json',
  '6aa244e70185263def704ffa': '/tmp/public-6aa244e7-control-inferred-final-20260913/project.json',
  '6aa2e4c10185263def70513b': '/tmp/public-6aa2e4c1-control-inferred-final-20260913/project.json',
  '6aa388840185263def7051d5': '/tmp/public-6aa38884-control-inferred-final-20260913/project.json',
};

export async function loadTemporaryLegacyPreviewProject(shareId: string): Promise<unknown> {
  const path = projectPathsByShareId[shareId];
  const load = path === undefined ? undefined : projectLoaders[path];
  if (load === undefined) throw new Error(`没有找到公开轴 ${shareId} 的临时预览项目`);
  return JSON.parse(await load()) as unknown;
}
