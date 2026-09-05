import { rename } from 'node:fs/promises';

/**
 * Windows 索引器、杀毒软件或资源管理器可能短暂持有大型新目录句柄；仅对占用错误
 * 在约 117 秒窗口内重试同一次原子 rename。大型批次曾被本机实时扫描器占用超过半分钟；
 * 不能改成复制发布，否则失败时会暴露半份目录。
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
      if ((code !== 'EPERM' && code !== 'EBUSY') || attempt >= 120) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.min(25 * 2 ** attempt, 1_000)));
    }
  }
}
