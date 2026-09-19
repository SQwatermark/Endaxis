/**
 * 在 WebP 的 XMP 元数据中保存项目数据码。V2 的小图使用 PNG 元数据；V3 只导出 WebP，
 * 因此沿用同一份数据码，但按 WebP RIFF 容器的扩展格式写入和读取。
 */
const encoder = new TextEncoder();
const XMP_FLAG = 0x04;
const ALPHA_FLAG = 0x10;

function fourCC(bytes: Uint8Array, offset: number): string {
  return String.fromCharCode(...bytes.subarray(offset, offset + 4));
}

function uint32(bytes: Uint8Array, offset: number): number {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}

function writeUint32(bytes: Uint8Array, offset: number, value: number): void {
  new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).setUint32(offset, value, true);
}

function chunk(name: string, content: Uint8Array): Uint8Array {
  const result = new Uint8Array(8 + content.length + (content.length % 2));
  result.set(encoder.encode(name), 0);
  writeUint32(result, 4, content.length);
  result.set(content, 8);
  return result;
}

function assertWebpHeader(bytes: Uint8Array, fileSize: number): void {
  if (
    bytes.length < 20 ||
    fourCC(bytes, 0) !== 'RIFF' ||
    fourCC(bytes, 8) !== 'WEBP' ||
    uint32(bytes, 4) + 8 !== fileSize
  ) {
    throw new Error('无效的 WebP 文件');
  }
}

function simpleImageSize(
  bytes: Uint8Array,
  kind: string,
): {
  width: number;
  height: number;
  hasAlpha: boolean;
} {
  if (kind === 'VP8 ' && bytes.length >= 30 && fourCC(bytes, 23) === '\u009d\u0001*') {
    return {
      width: (bytes[26]! | (bytes[27]! << 8)) & 0x3fff,
      height: (bytes[28]! | (bytes[29]! << 8)) & 0x3fff,
      hasAlpha: false,
    };
  }
  if (kind === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
    return {
      width: 1 + bytes[21]! + ((bytes[22]! & 0x3f) << 8),
      height: 1 + (bytes[22]! >> 6) + (bytes[23]! << 2) + ((bytes[24]! & 0x0f) << 10),
      hasAlpha: (bytes[24]! & 0x10) !== 0,
    };
  }
  throw new Error('无法读取 WebP 图片尺寸');
}

/** 保留原始图像块，只添加标准 VP8X/XMP 块；大图不展开为整份 JS 字节数组。 */
export async function embedProjectCodeInWebp(image: Blob, code: string): Promise<Blob> {
  if (!/^[A-Za-z0-9_-]+$/.test(code)) throw new Error('无效的项目数据码');
  const first = new Uint8Array(await image.slice(0, 30).arrayBuffer());
  assertWebpHeader(first, image.size);
  const firstKind = fourCC(first, 12);
  const firstSize = uint32(first, 16);
  if (20 + firstSize + (firstSize % 2) > image.size) throw new Error('WebP 图片块不完整');

  let extended: Uint8Array;
  if (firstKind === 'VP8X') {
    if (firstSize !== 10 || first.length < 30) throw new Error('无效的 WebP 扩展头');
    extended = first.slice(12, 30);
    if ((extended[8]! & XMP_FLAG) !== 0) throw new Error('WebP 已包含 XMP 元数据');
    extended[8] = extended[8]! | XMP_FLAG;
  } else {
    const { width, height, hasAlpha } = simpleImageSize(first, firstKind);
    if (width < 1 || height < 1) throw new Error('无效的 WebP 图片尺寸');
    const body = new Uint8Array(10);
    body[0] = XMP_FLAG | (hasAlpha ? ALPHA_FLAG : 0);
    const canvasWidth = width - 1;
    const canvasHeight = height - 1;
    body.set([canvasWidth & 255, (canvasWidth >> 8) & 255, canvasWidth >> 16], 4);
    body.set([canvasHeight & 255, (canvasHeight >> 8) & 255, canvasHeight >> 16], 7);
    extended = chunk('VP8X', body);
  }

  const xmp = chunk(
    'XMP ',
    encoder.encode(
      `<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:endaxis="https://www.end-axis.com/ns/1.0/" endaxis:Data="${code}"/></rdf:RDF></x:xmpmeta>`,
    ),
  );
  const added = (firstKind === 'VP8X' ? 0 : extended.length) + xmp.length;
  const newRiffSize = image.size - 8 + added;
  if (newRiffSize > 0xffffffff) throw new Error('WebP 文件过大');
  const header = first.slice(0, 12);
  writeUint32(header, 4, newRiffSize);
  return new Blob(
    [
      Uint8Array.from(header),
      Uint8Array.from(extended),
      image.slice(firstKind === 'VP8X' ? 30 : 12),
      Uint8Array.from(xmp),
    ],
    { type: 'image/webp' },
  );
}

/** 只读取 XMP 块，不解码图片像素；无项目数据时返回 null。 */
export async function readProjectCodeFromWebp(image: Blob): Promise<string | null> {
  const header = new Uint8Array(await image.slice(0, 20).arrayBuffer());
  assertWebpHeader(header, image.size);
  let offset = 12;
  while (offset + 8 <= image.size) {
    const chunkHeader = new Uint8Array(await image.slice(offset, offset + 8).arrayBuffer());
    const size = uint32(chunkHeader, 4);
    const end = offset + 8 + size + (size % 2);
    if (end > image.size) throw new Error('WebP 元数据块不完整');
    if (fourCC(chunkHeader, 0) === 'XMP ') {
      const xml = await image.slice(offset + 8, offset + 8 + size).text();
      return /endaxis:Data="([A-Za-z0-9_-]+)"/.exec(xml)?.[1] ?? null;
    }
    offset = end;
  }
  if (offset !== image.size) throw new Error('WebP 文件包含不完整的尾部块');
  return null;
}
