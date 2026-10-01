/** 从公开来源清单转换指定方案；原始分享文件保持只读且不进入仓库。 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { createServer } from 'vite';
import { format, resolveConfig } from 'prettier';
import type { convertLegacyTimeline as Convert } from '../../src/application/legacyTimeline/convert.ts';
import type { GameDataRepository } from '../../src/core/game-data/gameDataRepository.ts';

interface SourceSample {
  id: string;
  title: string;
  author: string;
  sourceUrl: string;
  acquiredDateUtc: string;
  version: string;
  fps: number;
  files: { name: string; sha256: string }[];
  scenarios: unknown[];
}
const [sourceDirectory, outputDirectory, selection] = process.argv.slice(2);
if (!sourceDirectory || !outputDirectory || process.argv.length > 5)
  throw new Error(
    '用法：node --experimental-strip-types tools/performance/convert-public-timelines.ts <来源目录（含 manifest.json）> <新输出目录> [各样本方案序号，逗号分隔]',
  );
const root = process.cwd();
const formatOptions = await resolveConfig(root + '/package.json');
const json = (value: unknown) =>
  format(JSON.stringify(value), { ...formatOptions, parser: 'json' });
const sourceRoot = resolve(sourceDirectory);
const outputRoot = resolve(outputDirectory);
const manifest: { samples: SourceSample[] } = JSON.parse(
  await readFile(resolve(sourceRoot, 'manifest.json'), 'utf8'),
);
if (
  !Array.isArray(manifest.samples) ||
  manifest.samples.length === 0 ||
  manifest.samples.length > 20
)
  throw new Error('来源清单必须包含 1–20 个样本');
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
const mappingsText = await readFile('src/application/legacyTimeline/mappings.json', 'utf8');
const engineCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
await mkdir(outputRoot); // 独占新目录，拒绝覆盖已有结果。
const server = await createServer({
  configFile: false,
  root,
  logLevel: 'error',
  server: { middlewareMode: true, watch: null, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
try {
  const gameDataRepository: GameDataRepository = (
    await server.ssrLoadModule('/src/data/gameDataRepository.ts')
  ).gameDataRepository;
  const convertLegacyTimeline: typeof Convert = (
    await server.ssrLoadModule('/src/application/legacyTimeline/convert.ts')
  ).convertLegacyTimeline;
  const selectedIndices = selection?.split(',').map(Number) ?? manifest.samples.map(() => 0);
  if (
    selectedIndices.length !== manifest.samples.length ||
    selectedIndices.some(index => !Number.isSafeInteger(index) || index < 0)
  )
    throw new Error('必须为每个样本提供非负方案序号');
  const converted = [];
  for (const [sampleIndex, source] of manifest.samples.entries()) {
    if (!/^[a-zA-Z0-9-]+$/.test(source.id)) throw new Error('不支持的样本 ID');
    const file = source.files.find(file => file.name.endsWith('.json'));
    if (!file || basename(file.name) !== file.name) throw new Error('缺少来源 JSON 文件名');
    const text = await readFile(resolve(sourceRoot, file.name), 'utf8');
    if (sha256(text) !== file.sha256) throw new Error(`${source.id} 来源 SHA-256 不符`);
    const input: unknown = JSON.parse(text);
    if (
      input === null ||
      typeof input !== 'object' ||
      !('scenarioList' in input) ||
      !Array.isArray(input.scenarioList) ||
      !input.scenarioList[0]
    )
      throw new Error('来源缺少方案');
    const sourceScenarioIndex = selectedIndices[sampleIndex]!;
    const first: unknown = input.scenarioList[sourceScenarioIndex];
    if (first === null || typeof first !== 'object' || !('id' in first))
      throw new Error('来源方案缺少 ID');
    const result = convertLegacyTimeline(
      { ...input, scenarioList: [first], activeScenarioId: first.id },
      gameDataRepository,
      JSON.parse(mappingsText),
      { timingMode: 'preserve' },
    );
    if (!result.project)
      throw new Error(`${source.id} 转换被阻止：${JSON.stringify(result.report.fatalIssues)}`);
    // 固定非战斗元数据，使同一来源和转换版本可逐字节重建。
    result.project.createdAt = `${source.acquiredDateUtc}T00:00:00.000Z`;
    const projectText = await json(result.project);
    const reportText = await json(result.report);
    await writeFile(resolve(outputRoot, `${source.id}.project.json`), projectText, { flag: 'wx' });
    await writeFile(resolve(outputRoot, `${source.id}.conversion.json`), reportText, {
      flag: 'wx',
    });
    converted.push({
      id: source.id,
      title: source.title,
      publicAuthor: source.author,
      sourceUrl: source.sourceUrl,
      acquiredDateUtc: source.acquiredDateUtc,
      sourceFilename: file.name,
      sourceSha256: file.sha256,
      sourceVersion: source.version,
      sourceFps: source.fps,
      sourceScenarioIndex,
      sourceScenario: source.scenarios[sourceScenarioIndex],
      omittedSourceScenarioCount: input.scenarioList.length - 1,
      projectFile: `${source.id}.project.json`,
      projectSha256: sha256(projectText),
      conversionReportFile: `${source.id}.conversion.json`,
      conversionReportSha256: sha256(reportText),
      conversionStatus: result.status,
    });
    console.log(
      JSON.stringify({ id: source.id, status: result.status, issues: result.report.issues }),
    );
  }
  await writeFile(
    resolve(outputRoot, 'manifest.json'),
    await json({
      formatVersion: 1,
      engineCommit,
      gameDataRevision: gameDataRepository.revision,
      converter: 'src/application/legacyTimeline/convert.ts',
      options: { timingMode: 'preserve' },
      mappingsSha256: sha256(mappingsText),
      selection:
        '每份公开项目选择一个方案，索引见样本；同队其余配装变体不重复计样本。createdAt 固定为采集日零点，仅规范非战斗元数据。',
      samples: converted,
    }),
    { flag: 'wx' },
  );
} finally {
  await server.close();
}
