import { rename } from 'node:fs/promises';

/**
 * Windows 索引器可能短暂持有新目录句柄，仅对占用错误重试同一次原子 rename。
 * 调用方负责路径与覆盖策略；这里不删目标、不复制目录，也不更换发布位置。
 */
export async function renameWithRetry(source: string, destination: string): Promise<void> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      await rename(source, destination);
      return;
    } catch (error) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : undefined;
      if ((code !== 'EPERM' && code !== 'EBUSY') || attempt >= 5) throw error;
      await new Promise(resolve => setTimeout(resolve, 25 * 2 ** attempt));
    }
  }
}
