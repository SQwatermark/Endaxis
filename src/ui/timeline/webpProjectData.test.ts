import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { embedProjectCodeInWebp, readProjectCodeFromWebp } from './webpProjectData';

describe('WebP project data', () => {
  it('adds a standards-based VP8X/XMP payload without changing the original image chunk', async () => {
    const bytes = await readFile(
      new URL('../../../public/next/passive-ui/typhoea-bg.webp', import.meta.url),
    );
    const original = new Blob([Uint8Array.from(bytes)], { type: 'image/webp' });
    const saved = await embedProjectCodeInWebp(original, 'abc_123-XYZ');
    const header = new Uint8Array(await saved.slice(0, 30).arrayBuffer());

    expect(String.fromCharCode(...header.slice(12, 16))).toBe('VP8X');
    expect(header[20]! & 0x04).toBe(0x04);
    expect(header[20]! & 0x10).toBe(0x10);
    expect([...header.slice(24, 27)]).toEqual([75, 0, 0]);
    expect([...header.slice(27, 30)]).toEqual([55, 0, 0]);
    expect(await readProjectCodeFromWebp(original)).toBeNull();
    expect(await readProjectCodeFromWebp(saved)).toBe('abc_123-XYZ');
    expect(new DataView(await saved.slice(4, 8).arrayBuffer()).getUint32(0, true)).toBe(
      saved.size - 8,
    );
    expect(new Uint8Array(await saved.slice(30, 30 + original.size - 12).arrayBuffer())).toEqual(
      new Uint8Array(await original.slice(12).arrayBuffer()),
    );
  });

  it('rejects malformed images and invalid project codes', async () => {
    const invalid = new Blob(['not a WebP'], { type: 'image/webp' });
    await expect(readProjectCodeFromWebp(invalid)).rejects.toThrow('无效的 WebP');
    await expect(embedProjectCodeInWebp(invalid, 'valid')).rejects.toThrow('无效的 WebP');
    await expect(embedProjectCodeInWebp(invalid, '<unsafe>')).rejects.toThrow('无效的项目数据码');
  });
});
