import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  downloadGameDataSources,
  loadSourceCatalog,
  writeAtomicJson,
} from './downloadGameDataSources.ts';
import { DEFAULT_CDN, DEFAULT_VFS_BASE } from './gameDataProviders.ts';
import { generateGearDefinitions } from './generateGearDefinitions.ts';
import { verifyGameDataSnapshot } from './verifyGameDataSnapshot.ts';
import { requireArray, requireNonEmptyString, requireRecord } from '../src/source/primitives.ts';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../../..');

export interface RebuildArguments {
  readonly sourceRoot?: string;
  readonly version?: string;
  readonly cdn: string;
  readonly vfsBase: string;
  readonly workers: number;
  readonly tablesOnly: boolean;
}

/** 游戏派生产物不等于整个 src/next/data 或 public；混合文件不能直接登记为可删除目录。 */
export const GAME_DATA_REBUILD_BOUNDARIES = [
  {
    id: 'operators',
    outputs: ['src/next/data/operators/generated-definitions'],
    blocker:
      '需要同批能力实体、投射物黑板、GameplayTag、TimeDilation、GlobalBuff、SkillSetting 和角色模板；不得复用正式派生目录或自动改写模板 pin。',
  },
  {
    id: 'common-buffs',
    outputs: ['src/next/data/buffs/generated'],
    blocker: '需要全部干员的同批完整闭包，不能从旧生成定义抽取。',
  },
  {
    id: 'weapons',
    outputs: ['src/next/data/equipment/generated-weapons'],
    blocker: '需要同批完整 GameplayTag 目录，以及 SkillData/BuffData；不能隐式读取正式标签目录。',
  },
  {
    id: 'gear-sets',
    outputs: ['src/next/data/equipment/generated-gear-sets'],
    blocker:
      '需要同批 GameplayTag 和被动闭包；套装生成已遍历来源全部身份，任一身份未闭合须阻止整批发布。',
  },
  {
    id: 'global-catalogs',
    outputs: [
      'src/next/data/combat/gameplayTagCatalog.generated.ts',
      'src/next/data/combat/gameplayTagPredefine.generated.ts',
      'src/next/data/combat/hitStopCurveCatalog.generated.ts',
    ],
    blocker:
      '全局配置/完整标签配置集/HUD prefab 等仍有离线精确导出依赖，须接入本批资源清单；TimeDilation 等混合文件先分离代码与游戏数据。',
  },
  {
    id: 'template-evidence',
    outputs: [],
    blocker:
      '能力实体聚合目录、投射物 EntityBB、GlobalBuff、SkillSetting 的旧 JSON 仍是生成输入；须由同批来源重建或直接读取原始集合，不能复制旧证据充数。',
  },
  {
    id: 'legacy-presentation-and-enemies',
    outputs: [],
    blocker:
      '新版装备展示/注册和敌人预设仍有旧版数据适配器；需要区分可生成的游戏字段与自有别名配置，并移除生成时对旧版游戏数据的依赖，不修改旧版行为。',
  },
  {
    id: 'locales',
    outputs: ['src/i18n/game-locales'],
    blocker: '本地化脚本仍自行下载并读取旧语言文件，需改为消费同批表和显式自有文案配置。',
  },
  {
    id: 'icons',
    outputs: [],
    blocker:
      '需要扫描候选定义和候选富文本；public 目录混有自有 UI/占位图，必须按引用及所有权逐文件处理，不能整目录删除。',
  },
  {
    id: 'simulation-and-publication',
    outputs: [],
    blocker:
      '全部候选闭合后执行严格契约/技能上轴/配装模拟/图片引用检查，成功才允许发布；当前入口没有发布能力。',
  },
] as const;

export interface RebuildStage {
  readonly id: string;
  readonly status: 'passed' | 'blocked' | 'failed';
  readonly detail: unknown;
}

/**
 * 当前第一阶段只产出隔离候选与完整性报告，绝不替换正式数据。
 * sourceRoot 是显式的离线重试输入，仍须逐文件复验，不寻找其他历史缓存。
 */
export async function rebuildGameData(args: RebuildArguments, projectRoot = PROJECT_ROOT) {
  const root = await fs.realpath(projectRoot);
  const runParent = path.join(root, 'tmp', 'game-data-rebuild');
  // 不允许 tmp 或其子目录是指向正式资源/外部工作树的 junction。
  for (const directory of [path.join(root, 'tmp'), runParent]) {
    await fs.mkdir(directory, { recursive: true });
    if ((await fs.lstat(directory)).isSymbolicLink())
      throw new Error(`rebuild directory is a link: ${directory}`);
    if (path.resolve(await fs.realpath(directory)) !== path.resolve(directory)) {
      throw new Error(`rebuild directory escapes project: ${directory}`);
    }
  }
  const runRoot = await fs.mkdtemp(path.join(runParent, 'run-'));
  const candidateRoot = path.join(runRoot, 'candidate');
  const sourceRoot = args.sourceRoot
    ? path.resolve(args.sourceRoot)
    : path.join(runRoot, 'sources');
  const sourceCatalogPath = path.join(root, 'tools/game-data-compiler/game-data-sources.json');
  const stages: RebuildStage[] = [];
  let snapshot: Awaited<ReturnType<typeof verifyGameDataSnapshot>> | undefined;
  const stage = async (id: string, action: () => Promise<unknown>) => {
    try {
      const detail = await action();
      stages.push({ id, status: 'passed', detail });
      return true;
    } catch (error) {
      stages.push({
        id,
        status: 'failed',
        detail: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  };
  const sourceOkay = await stage('sources', async () => {
    if (!args.sourceRoot) {
      await downloadGameDataSources({
        cdn: args.cdn,
        vfsBase: args.vfsBase,
        sourceMode: 'hybrid',
        version: args.version ?? 'latest',
        sourceCatalog: sourceCatalogPath,
        output: sourceRoot,
        workers: args.workers,
        tablesOnly: args.tablesOnly,
      });
    }
    snapshot = await verifyGameDataSnapshot(sourceRoot, await loadSourceCatalog(sourceCatalogPath));
    if (args.version && args.version !== 'latest' && snapshot.version !== args.version) {
      throw new Error(
        `snapshot version ${snapshot.version} does not match requested ${args.version}`,
      );
    }
    return snapshot;
  });
  if (sourceOkay) {
    const missingRequestedInputs = snapshot!.missingInputs.filter(
      input => !args.tablesOnly || input.startsWith('TableCfg-current/'),
    );
    stages.push({
      id: 'source-coverage',
      status: missingRequestedInputs.length ? 'blocked' : 'passed',
      detail: { missingInputs: missingRequestedInputs },
    });
    await stage('content-inventory', () => inspectSourceIdentities(sourceRoot, root));
    await stage('gears', async () => {
      const relativeOutput = 'src/next/data/equipment/generated';
      const generationArgs = {
        tablesDirectory: path.join(sourceRoot, 'TableCfg-current'),
        outputDirectory: path.join(candidateRoot, relativeOutput),
        check: false,
      };
      const generated = await generateGearDefinitions(generationArgs);
      // 重跑真实领域生成器做确定性检查，不把写文件成功当成重建成功。
      await generateGearDefinitions({ ...generationArgs, check: true });
      return {
        ...generated,
        deterministicCheck: 'passed',
        comparison: await compareCandidateFiles(
          path.join(root, relativeOutput),
          generationArgs.outputDirectory,
        ),
      };
    });
    await stage('sources-after-generation', async () => {
      const after = await verifyGameDataSnapshot(
        sourceRoot,
        await loadSourceCatalog(sourceCatalogPath),
      );
      if (after.snapshotSha256 !== snapshot!.snapshotSha256)
        throw new Error('source snapshot changed during generation');
      return { snapshotSha256: after.snapshotSha256 };
    });
  } else {
    for (const id of ['content-inventory', 'gears']) {
      stages.push({
        id,
        status: 'blocked',
        detail: '来源完整性校验未通过，不读取旧输入或正式产物补齐。',
      });
    }
  }
  const report = {
    sourcePolicy: 'akedb-primary-vfs-fallback',
    fullRebuild: false,
    published: false,
    requestedScope: args.tablesOnly ? 'tables-and-gear-candidate' : 'full-candidate',
    runRoot,
    sourceRoot,
    candidateRoot,
    stages,
    remaining: GAME_DATA_REBUILD_BOUNDARIES,
  };
  await writeAtomicJson(path.join(runRoot, 'report.json'), report);
  // 完整重建在剩余边界闭合前不能返回成功；显式表格切片仅对该切片返回成功。
  const exitCode = stages.some(item => item.status === 'failed')
    ? 1
    : args.tablesOnly && stages.every(item => item.status === 'passed')
      ? 0
      : 2;
  return { report, exitCode };
}

async function inspectSourceIdentities(sourceRoot: string, projectRoot: string) {
  const table = async (name: string) =>
    requireRecord(await readJson(path.join(sourceRoot, 'TableCfg-current', `${name}.json`)), name);
  const manifest = requireRecord(
    await readJson(path.join(projectRoot, 'tools/game-data-compiler/config/operators.json')),
    'operators',
  );
  const configuredCharacters = requireArray(manifest.operators, 'operators.operators').map(
    (value, index) =>
      requireNonEmptyString(
        requireRecord(value, `operator[${index}]`).charId,
        `operator[${index}].charId`,
      ),
  );
  const configuredSuits = requireArray(
    await readJson(
      path.join(projectRoot, 'tools/game-data-compiler/config/gearSetIdentities.json'),
    ),
    'gearSetIdentities',
  ).map(value => requireNonEmptyString(value, 'gearSetIdentity'));
  const compare = (source: readonly string[], configured: readonly string[]) => ({
    sourceCount: source.length,
    configuredCount: configured.length,
    unconfiguredSourceIds: source.filter(id => !configured.includes(id)).sort(),
    configuredIdsMissingFromSource: configured.filter(id => !source.includes(id)).sort(),
  });
  return {
    characters: compare(Object.keys(await table('CharacterTable')), configuredCharacters),
    weapons: { sourceCount: Object.keys(await table('WeaponBasicTable')).length },
    gears: { sourceCount: Object.keys(await table('EquipTable')).length },
    gearSets: compare(Object.keys(await table('EquipSuitTable')), configuredSuits),
    note: '未配置身份不等于新增可玩内容；别名、管理员表现变体和非玩家记录须分别审计。',
  };
}

/** 正式目录只在生成之后作为可选比较对象；删除正式目录不影响候选生成。 */
export async function compareCandidateFiles(baseline: string, candidate: string) {
  async function files(root: string): Promise<Map<string, string>> {
    const result = new Map<string, string>();
    async function walk(directory: string) {
      for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isSymbolicLink()) throw new Error(`generated directory contains a link: ${file}`);
        if (entry.isDirectory()) await walk(file);
        else
          result.set(
            path.relative(root, file).split(path.sep).join('/'),
            (await fs.readFile(file, 'utf8')).replaceAll('\r\n', '\n'),
          );
      }
    }
    await walk(root);
    return result;
  }
  const current = await files(candidate);
  const baselineExists = await fs.stat(baseline).then(
    () => true,
    (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return false;
      throw error;
    },
  );
  if (!baselineExists)
    return { baselinePresent: false, added: [...current.keys()].sort(), changed: [], removed: [] };
  const previous = await files(baseline);
  return {
    baselinePresent: true,
    added: [...current.keys()].filter(file => !previous.has(file)).sort(),
    changed: [...current.keys()]
      .filter(file => previous.has(file) && current.get(file) !== previous.get(file))
      .sort(),
    removed: [...previous.keys()].filter(file => !current.has(file)).sort(),
  };
}

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

export function parseRebuildArguments(values: readonly string[]): RebuildArguments {
  const entries = new Map<string, string>();
  let tablesOnly = false;
  const allowed = new Set(['--source-root', '--version', '--cdn', '--vfs-base', '--workers']);
  for (let i = 0; i < values.length; i++) {
    const flag = values[i]!;
    if (flag === '--tables-only' && !tablesOnly) {
      tablesOnly = true;
      continue;
    }
    if (!allowed.has(flag) || entries.has(flag))
      throw new Error(`unknown or duplicate argument: ${flag}`);
    const value = values[++i];
    if (!value || value.startsWith('--')) throw new Error(`missing value for ${flag}`);
    entries.set(flag, value);
  }
  const workers = Number(entries.get('--workers') ?? 6);
  if (!Number.isInteger(workers) || workers <= 0)
    throw new Error('--workers: expected positive integer');
  return {
    ...(entries.has('--source-root')
      ? { sourceRoot: path.resolve(entries.get('--source-root')!) }
      : {}),
    ...(entries.has('--version') ? { version: entries.get('--version')! } : {}),
    cdn: entries.get('--cdn') ?? DEFAULT_CDN,
    vfsBase: entries.get('--vfs-base') ?? DEFAULT_VFS_BASE,
    workers,
    tablesOnly,
  };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const { report, exitCode } = await rebuildGameData(parseRebuildArguments(process.argv.slice(2)));
  for (const stage of report.stages) console.log(`${stage.id}: ${stage.status}`);
  console.log(
    `fullRebuild=false; published=false; report: ${path.join(report.runRoot, 'report.json')}`,
  );
  process.exitCode = exitCode;
}
