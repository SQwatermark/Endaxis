import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import {
  downloadAkedbSources,
  loadAkedbSourceCatalog,
  parseArguments,
} from '../scripts/downloadAkedbSources.ts';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map(directory => fs.rm(directory, { recursive: true, force: true })),
  );
});

describe('AKEDB 资源下载器', () => {
  it.each([true, false])(
    '精确配置由 Endaxis 清单维护，CDN 可用=%s；不依赖远端集合索引',
    async available => {
      const root = await fs.mkdtemp(path.join(os.tmpdir(), 'endaxis-exact-json-'));
      temporaryDirectories.push(root);
      const catalog = path.join(root, 'sources.json');
      const output = path.join(root, 'output');
      const fallback = path.join(root, 'fallback');
      const logicalPath = 'GameplayConfig/GameplayTagPredefineTable.json';
      await writeJson(catalog, {
        defaultVersion: 'test@1',
        sharedJsonIndex: 'asset-sync-index.json',
        tableCfg: ['MustNotFetch'],
        jsonCollections: {},
        jsonFiles: [logicalPath],
      });
      await writeJson(path.join(fallback, logicalPath), { provider: 'vfs' });
      await writeJson(path.join(output, 'akedb-source-provenance.json'), { keep: true });
      const requests: string[] = [];
      const server = http.createServer((request, response) => {
        requests.push(request.url!);
        if (available && request.url === `/public/Json/${logicalPath}`)
          response.end(JSON.stringify({ provider: 'akedb' }));
        else response.writeHead(404).end();
      });
      await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
      try {
        const address = server.address();
        if (address === null || typeof address === 'string') throw new Error('missing test port');
        const args = {
          cdn: `http://127.0.0.1:${address.port}`,
          version: null,
          sourceCatalog: catalog,
          output,
          workers: 1,
          tablesOnly: false,
          vfsFallback: fallback,
          jsonFile: logicalPath,
        };
        await expect(
          downloadAkedbSources({ ...args, jsonFile: '../not-declared.json' }),
        ).rejects.toThrow('not declared');
        await expect(downloadAkedbSources({ ...args, tablesOnly: true })).rejects.toThrow(
          'cannot be combined',
        );
        await downloadAkedbSources(args);
      } finally {
        await new Promise<void>((resolve, reject) =>
          server.close(error => (error ? reject(error) : resolve())),
        );
      }
      expect(requests).toEqual([`/public/Json/${logicalPath}`]);
      expect(await readJson(path.join(output, logicalPath))).toEqual({
        provider: available ? 'akedb' : 'vfs',
      });
      expect(await readJson(path.join(output, `${logicalPath}.provenance.json`))).toMatchObject({
        logicalPath,
        provider: available ? 'akedb' : 'vfs-index-browser',
        sha256: expect.stringMatching(/^[0-9a-f]{64}$/),
      });
      expect(await readJson(path.join(output, 'akedb-source-provenance.json'))).toEqual({
        keep: true,
      });
    },
  );

  it('精确配置路径不允许穿越、重复或伪装为绝对 URL', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'endaxis-json-catalog-'));
    temporaryDirectories.push(root);
    const catalog = path.join(root, 'sources.json');
    for (const jsonFiles of [
      ['../escape.json'],
      ['https://example.com/data.json'],
      ['X/a.json', 'X/a.json'],
    ]) {
      await writeJson(catalog, {
        defaultVersion: 'test@1',
        sharedJsonIndex: 'asset-sync-index.json',
        tableCfg: [],
        jsonCollections: {},
        jsonFiles,
      });
      await expect(loadAkedbSourceCatalog(catalog)).rejects.toThrow();
    }
    expect(
      parseArguments(['--json-file', 'GameplayConfig/GameplayTagPredefineTable.json']).jsonFile,
    ).toBe('GameplayConfig/GameplayTagPredefineTable.json');
  });

  it('保留 HTTP VFS fallback 基址，不把 URL 误解析成本地路径', () => {
    expect(
      parseArguments(['--vfs-fallback', 'http://desktop:8765/api/akedb-compatible/']).vfsFallback,
    ).toBe('http://desktop:8765/api/akedb-compatible');
  });

  it('可以从 vfs-index-browser HTTP 兼容接口读取缺失表', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'endaxis-vfs-http-download-'));
    temporaryDirectories.push(root);
    const catalog = path.join(root, 'sources.json');
    const output = path.join(root, 'output');
    await writeJson(catalog, {
      defaultVersion: 'test@2',
      sharedJsonIndex: 'asset-sync-index.json',
      tableCfg: ['FallbackTable'],
      jsonCollections: {},
    });
    const server = http.createServer((request, response) => {
      const payloads: Record<string, unknown> = {
        '/manifest.json': {
          latest: 'older-version',
          sharedRevision: 'fixture',
          versions: [],
        },
        '/api/akedb-compatible/TableCfg-test-2/FallbackTable.json': {
          provider: 'vfs-http',
        },
      };
      const payload = payloads[request.url ?? ''];
      if (payload === undefined) {
        response.writeHead(404).end();
        return;
      }
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(payload));
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    try {
      const address = server.address();
      if (address === null || typeof address === 'string') throw new Error('missing test port');
      const base = `http://127.0.0.1:${address.port}`;
      await downloadAkedbSources({
        cdn: base,
        version: null,
        sourceCatalog: catalog,
        output,
        workers: 1,
        tablesOnly: true,
        vfsFallback: `${base}/api/akedb-compatible`,
      });
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve())),
      );
    }
    await expect(
      readJson(path.join(output, 'TableCfg-test-2/FallbackTable.json')),
    ).resolves.toEqual({ provider: 'vfs-http' });
  });

  it('优先使用 AKEDB，并只对其明确资源逐文件使用 VFS fallback', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'endaxis-akedb-download-'));
    temporaryDirectories.push(root);
    const fallback = path.join(root, 'fallback');
    const output = path.join(root, 'output');
    const catalog = path.join(root, 'sources.json');
    await writeJson(catalog, {
      defaultVersion: 'test@1',
      sharedJsonIndex: 'asset-sync-index.json',
      tableCfg: ['PrimaryTable', 'FallbackTable'],
      jsonCollections: { SkillData: 'SkillData' },
    });
    await writeJson(path.join(fallback, 'TableCfg-test-1/FallbackTable.json'), {
      provider: 'vfs-table',
    });
    await writeJson(path.join(fallback, 'SkillData/manifest.json'), [
      { contentFile: '/api/akedb-compatible/SkillData/shared.json' },
      { contentFile: '/api/akedb-compatible/SkillData/vfs-only.json' },
    ]);
    await writeJson(path.join(fallback, 'SkillData/vfs-only.json'), {
      provider: 'vfs-collection',
    });

    const server = http.createServer((request, response) => {
      const payloads: Record<string, unknown> = {
        '/manifest.json': {
          latest: 'test@1',
          sharedRevision: 'fixture',
          versions: [{ id: 'test@1', tableCfgPath: '/tables/test' }],
        },
        '/tables/test/PrimaryTable.json': { provider: 'akedb-table' },
        '/asset-sync-index.json': sharedJsonIndex(['SkillData/shared.json']),
        '/public/Json/SkillData/shared.json': { provider: 'akedb-collection' },
      };
      const payload = payloads[request.url ?? ''];
      if (payload === undefined) {
        response.writeHead(404).end();
        return;
      }
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(payload));
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    try {
      const address = server.address();
      if (address === null || typeof address === 'string') throw new Error('missing test port');
      await downloadAkedbSources({
        cdn: `http://127.0.0.1:${address.port}`,
        version: null,
        sourceCatalog: catalog,
        output,
        workers: 2,
        tablesOnly: false,
        vfsFallback: fallback,
      });
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve())),
      );
    }

    await expect(readJson(path.join(output, 'TableCfg-test-1/PrimaryTable.json'))).resolves.toEqual(
      {
        provider: 'akedb-table',
      },
    );
    await expect(
      readJson(path.join(output, 'TableCfg-test-1/FallbackTable.json')),
    ).resolves.toEqual({ provider: 'vfs-table' });
    await expect(readJson(path.join(output, 'SkillData/shared.json'))).resolves.toEqual({
      provider: 'akedb-collection',
    });
    await expect(fs.stat(path.join(output, 'SkillData/vfs-only.json'))).rejects.toMatchObject({
      code: 'ENOENT',
    });
    const provenance = (await readJson(path.join(output, 'akedb-source-provenance.json'))) as {
      entries: Array<{
        logicalPath: string;
        provider: string;
        byteLength: number;
        sha256: string;
      }>;
    };
    expect(
      Object.fromEntries(provenance.entries.map(entry => [entry.logicalPath, entry.provider])),
    ).toMatchObject({
      'TableCfg-test-1/PrimaryTable.json': 'akedb',
      'TableCfg-test-1/FallbackTable.json': 'vfs-index-browser',
      'SkillData/shared.json': 'akedb',
    });
    expect(provenance.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          logicalPath: 'SkillData/shared.json',
          byteLength: expect.any(Number),
          sha256: expect.stringMatching(/^[0-9a-f]{64}$/),
        }),
      ]),
    );
  });
});

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value));
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function sharedJsonIndex(files: readonly string[]) {
  return {
    schemaVersion: 2,
    revision: 'fixture',
    datasets: {
      json: {
        files: Object.fromEntries(
          files.map(file => [file, { size: 10, md5: '0123456789abcdef0123456789abcdef' }]),
        ),
      },
    },
  };
}
