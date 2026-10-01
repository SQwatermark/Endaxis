import { createHash } from 'node:crypto';

export interface BaselineOptions {
  readonly inputPath: string;
  readonly scenarioIndex: number;
  readonly repetitions: number;
  readonly warmups: number;
  readonly decompose: boolean;
  readonly provenance: {
    readonly gitHead: string | null;
    readonly engineGitRevision: string | null;
    readonly dataGitRevision: string | null;
    readonly engineWorkingTreeDirty: boolean | null;
    readonly engineDiffSha256: string | null;
    readonly productionBuildMs: number;
  };
}

export function sha256(source: string | Buffer): string {
  return createHash('sha256').update(source).digest('hex');
}

/** 只省略 JSON 本来就省略的可选字段；保留无限生命等非有限数，避免与 null 混淆。 */
export function valueSha256(value: unknown): string {
  return sha256(
    JSON.stringify(value, (_key, item: unknown) =>
      typeof item === 'number' && !Number.isFinite(item) ? { $number: String(item) } : item,
    ),
  );
}

export function summarize(samples: readonly number[]) {
  if (samples.length === 0 || samples.some(value => !Number.isFinite(value) || value < 0))
    throw new Error('耗时样本必须是非空的非负有限数列表');
  const sorted = [...samples].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return {
    count: sorted.length,
    medianMs:
      sorted.length % 2 === 0 ? (sorted[middle - 1]! + sorted[middle]!) / 2 : sorted[middle]!,
    p95Ms: sorted[Math.ceil(sorted.length * 0.95) - 1]!,
    minMs: sorted[0]!,
    maxMs: sorted[sorted.length - 1]!,
  };
}

export function boundedInteger(value: string, name: string, min: number, max: number): number {
  const parsed = Number(value);
  if (value.trim() === '' || !Number.isSafeInteger(parsed) || parsed < min || parsed > max)
    throw new Error(`${name} 必须是 ${min}–${max} 的整数`);
  return parsed;
}
