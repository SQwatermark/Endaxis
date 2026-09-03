import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { exportReference, parseArguments } from '../scripts/exportReferencedGameIcons.ts';

const temporaryRoots: string[] = [];
afterEach(async () => {
  vi.unstubAllGlobals();
  await Promise.all(
    temporaryRoots.splice(0).map(root => fs.rm(root, { recursive: true, force: true })),
  );
});

async function isolatedArguments(flags: string[] = []) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'endaxis-icons-'));
  temporaryRoots.push(root);
  return parseArguments(['--output-root', root, '--source-mode', 'vfs-only', ...flags]);
}

const reference = {
  publicPath: '/icons/airborne.webp',
  sourceNames: ['fixture.png'],
  preferredPathSegments: [],
  referencedBy: ['test'],
};

describe('全量图片隔离导出', () => {
  it('图片并发有界且只接受正整数', () => {
    expect(parseArguments([]).workers).toBe(6);
    expect(parseArguments(['--workers', '12']).workers).toBe(12);
    for (const value of ['0', '-1', '1.5', 'NaN', 'Infinity']) {
      expect(() => parseArguments(['--workers', value])).toThrow('positive integer');
    }
    expect(() => parseArguments(['--workers'])).toThrow('requires a value');
  });
  it('默认兼容 public，可显式指定独立输出目录', () => {
    expect(parseArguments([]).outputRoot).toBe(path.resolve('public'));
    expect(parseArguments(['--output-root', 'tmp/icons']).outputRoot).toBe(
      path.resolve('tmp/icons'),
    );
    expect(() => parseArguments(['--output-root'])).toThrow('requires a value');
  });

  it('强制重导只覆盖隔离产物，不修改正式图片', async () => {
    const args = await isolatedArguments(['--overwrite']);
    const original = await fs.readFile('public/icons/airborne.webp');
    const destination = path.join(args.outputRoot, 'icons/airborne.webp');
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, 'old isolated output');
    const png = await sharp({ create: { width: 1, height: 1, channels: 4, background: '#ff0000' } })
      .png()
      .toBuffer();
    const request = vi.fn(async (url: URL) =>
      url.pathname.includes('/by-name')
        ? Response.json({
            candidates: [{ assetIndex: 1, path: 'assets/fixture.png', rawUrl: '/fixture.png' }],
          })
        : new Response(new Uint8Array(png)),
    );
    vi.stubGlobal('fetch', request);
    await expect(exportReference(reference, args)).resolves.toMatchObject({
      status: 'overwritten',
      sourceSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
      outputSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect((await sharp(await fs.readFile(destination)).metadata()).format).toBe('webp');
    expect(await fs.readFile('public/icons/airborne.webp')).toEqual(original);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('项目占位图复制到隔离目录，不调用 VFS；dry-run 不落盘', async () => {
    const args = await isolatedArguments();
    const local = { ...reference, publicPath: '/icons/default_icon.webp', localOnly: true };
    const request = vi.fn();
    vi.stubGlobal('fetch', request);
    await expect(exportReference(local, { ...args, dryRun: true })).resolves.toMatchObject({
      status: 'kept-local',
    });
    await expect(
      fs.stat(path.join(args.outputRoot, 'icons/default_icon.webp')),
    ).rejects.toMatchObject({ code: 'ENOENT' });
    await exportReference(local, args);
    expect(await fs.readFile(path.join(args.outputRoot, 'icons/default_icon.webp'))).toEqual(
      await fs.readFile('public/icons/default_icon.webp'),
    );
    expect(request).not.toHaveBeenCalled();
  });

  it('拒绝越过输出目录的资源路径', async () => {
    await expect(
      exportReference({ ...reference, publicPath: '/../outside.webp' }, await isolatedArguments()),
    ).rejects.toThrow('unsafe game icon output path');
  });
});
