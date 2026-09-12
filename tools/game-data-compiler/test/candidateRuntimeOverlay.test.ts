/** 通过真实 Vite SSR 验证候选覆盖；仅测试 resolveId 返回值不能证明最终加载了哪套数据。 */
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { createServer, type ViteDevServer } from 'vite';
import { createCandidateRuntimeOverlayPlugin } from '../src/compiler/candidateRuntimeOverlay.ts';

const projectRoot = fileURLToPath(
  new URL('./fixtures/candidate-runtime-overlay/formal', import.meta.url),
);
const candidateRoot = fileURLToPath(
  new URL('./fixtures/candidate-runtime-overlay/candidate', import.meta.url),
);

async function withServer(
  replacementPaths: readonly string[],
  run: (server: ViteDevServer) => Promise<void>,
) {
  const server = await createServer({
    configFile: false,
    root: projectRoot,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null, hmr: false },
    optimizeDeps: { noDiscovery: true },
    plugins: [
      createCandidateRuntimeOverlayPlugin({ projectRoot, candidateRoot, replacementPaths }),
    ],
  });
  try {
    await run(server);
  } finally {
    await server.close();
  }
}

describe('候选运行视图的实际模块加载', () => {
  it('无扩展名的 re-export 使用单文件候选，同目录手写模块保留正式版本', async () => {
    await withServer(['src/mixed/item.js'], async server => {
      const module = await server.ssrLoadModule('/src/single.js');
      expect(module.value).toBe('candidate item');
      expect(module.helper).toBe('formal mixed helper');
      expect((await server.ssrLoadModule('/src/mixed/item.js')).value).toBe('candidate item');
    });
  });

  it('候选的无扩展名相对导入优先使用候选，未替换手写依赖才回退正式库', async () => {
    await withServer(['src/generated'], async server => {
      const module = await server.ssrLoadModule('/src/directory.js');
      expect(module.value).toBe('candidate sibling / formal shared helper');
    });
  });

  it('完整替换目录缺少旧文件时明确失败，不允许偷偷加载正式旧文件', async () => {
    await withServer(['src/generated'], async server => {
      await expect(server.ssrLoadModule('/src/missing.js')).rejects.toThrow(
        'candidate runtime replacement is missing module',
      );
    });
  });

  it('正式库尚无新增文件时，无扩展名导出仍能解析单文件候选', async () => {
    await withServer(['src/mixed/new-item.js'], async server => {
      expect((await server.ssrLoadModule('/src/new-file.js')).value).toBe('new candidate item');
    });
  });

  it('显式 JSON 导入不能错误匹配同名 JS 候选', async () => {
    await withServer(['src/mixed/new-item.js'], async server => {
      await expect(server.ssrLoadModule('/src/explicit-extension.js')).rejects.toThrow();
    });
  });
});
