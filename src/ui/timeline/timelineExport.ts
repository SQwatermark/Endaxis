/** 时间轴导出的文件名、压缩数据码、下载和长图渲染工具。 */
import { snapdom } from '@zumer/snapdom';

export function projectFilename(value: string, fallback = 'Endaxis_Export'): string {
  const base = value.trim().replace(/\.(?:json|webp|png)$/i, '') || fallback;
  return `${base}.json`;
}

export function imageFilename(value: string, fallback = 'Endaxis_Export'): string {
  const base = value.trim().replace(/\.(?:json|webp|png)$/i, '') || fallback;
  return `${base}.webp`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  try {
    anchor.click();
  } finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }
}

/** 使用与旧版相同的 gzip + URL-safe Base64 数据码格式。 */
export async function compressProjectCode(json: string): Promise<string> {
  const bytes = new TextEncoder().encode(json);
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer());
  let binary = '';
  // 分段转换，避免大型项目展开为函数参数导致栈溢出。
  for (let offset = 0; offset < compressed.length; offset += 0x8000) {
    binary += String.fromCharCode(...compressed.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export interface TimelineLongImageOptions {
  readonly durationSeconds: number;
  readonly pxPerFrame: number;
  readonly prepWidth: number;
  readonly trackHeaderWidth: number;
}

/**
 * 截取当前时间轴主区域。渲染期间只临时展开横向裁剪和滚动位置，完成后完整恢复内联样式与滚动。
 */
export async function captureTimelineLongImage(
  timelineMain: HTMLElement,
  options: TimelineLongImageOptions,
): Promise<Blob> {
  const width = Math.ceil(
    options.trackHeaderWidth +
      options.prepWidth +
      options.durationSeconds * 30 * options.pxPerFrame +
      50,
  );
  const elements = [
    timelineMain,
    timelineMain.querySelector<HTMLElement>('.timeline-center'),
    timelineMain.querySelector<HTMLElement>('.timeline-workspace'),
    timelineMain.querySelector<HTMLElement>('.timeline-scroll'),
    timelineMain.querySelector<HTMLElement>('.timeline-surface'),
    timelineMain.querySelector<HTMLElement>('.track-stack'),
  ].filter((element): element is HTMLElement => element !== null);
  const styles = new Map(elements.map(element => [element, element.style.cssText]));
  const scrollers = Array.from(
    timelineMain.querySelectorAll<HTMLElement>('.timeline-scroll, .timeline-horizontal-scrollbar'),
  );
  const scroll = new Map(
    scrollers.map(element => [element, { left: element.scrollLeft, top: element.scrollTop }]),
  );
  try {
    timelineMain.style.width = `${width}px`;
    timelineMain.style.minWidth = `${width}px`;
    timelineMain.style.overflow = 'visible';
    for (const element of elements.slice(1)) {
      element.style.width = `${width}px`;
      element.style.maxWidth = 'none';
      element.style.overflow = 'visible';
    }
    for (const element of scrollers) {
      element.scrollLeft = 0;
      element.scrollTop = 0;
    }
    await new Promise<void>(resolve =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
    const height = Math.max(
      1,
      Math.ceil(timelineMain.scrollHeight || timelineMain.getBoundingClientRect().height),
    );
    const capture = await snapdom(timelineMain, {
      scale: 1.5,
      width,
      height,
      backgroundColor: getComputedStyle(timelineMain).backgroundColor || '#191a1d',
      exclude: ['.timeline-horizontal-scrollbar', '.panel-chrome', '.bottom-panel-collapse'],
    });
    return await capture.toBlob({ type: 'webp', quality: 0.94, dpr: 1 });
  } finally {
    for (const [element, cssText] of styles) element.style.cssText = cssText;
    for (const [element, position] of scroll) {
      element.scrollLeft = position.left;
      element.scrollTop = position.top;
    }
  }
}
