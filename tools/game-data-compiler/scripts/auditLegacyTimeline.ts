import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

let inputPath: string | undefined;
let outputPath: string | undefined;
const args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 2) {
  const name = args[index];
  const value = args[index + 1];
  if (value === undefined || value.startsWith('--')) throw new Error(`missing value for ${name}`);
  if (name === '--input') inputPath = value;
  else if (name === '--output') outputPath = value;
  else throw new Error(`unknown argument ${name}`);
}
if (inputPath === undefined) {
  throw new Error('required: --input <legacy-project.json> [--output <audit.json>]');
}
outputPath ??= path.join(
  'tmp',
  'legacy-axis-audit',
  `${path.basename(inputPath, path.extname(inputPath))}.audit.json`,
);

// Next 产品模块使用 Vite 的无扩展名解析约定。CLI 通过同一解析器加载产品代码，避免维护第二套
// Node 专用入口或为了一个审计工具改写整棵产品依赖。
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const [legacyImporter, legacyAudit, simulation, settings, repository] = await Promise.all([
    vite.ssrLoadModule('/src/next/application/legacy/legacyProjectImporter.ts'),
    vite.ssrLoadModule('/src/next/application/legacy/legacyAxisAudit.ts'),
    vite.ssrLoadModule('/src/next/application/scenarioSimulationService.ts'),
    vite.ssrLoadModule('/src/next/data/combat/skillSettings.ts'),
    vite.ssrLoadModule('/src/next/data/gameDataRepository.ts'),
  ]);
  const legacyProject: unknown = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const migration = legacyImporter
    .createLegacyProjectImporter(repository.nextGameDataRepository)
    .migrate(legacyProject);
  if (!migration.ok) throw new Error(migration.errors.join('\n'));
  const simulationService = new simulation.ScenarioSimulationService({
    index: repository.nextGameDataRepository,
    repositoryRevision: repository.nextGameDataRepository.revision,
    spellInflictionSettings: settings.skillSettings,
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
    },
  });
  const runs = new Map();
  for (const scenario of migration.value.scenarios) {
    const endFrame = scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames;
    runs.set(scenario.id, await simulationService.simulate(scenario, endFrame));
  }
  const report = legacyAudit.auditLegacyAxisProject({
    legacyProject,
    project: migration.value,
    runs,
    migrationWarnings: migration.warnings,
  });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(
    JSON.stringify({
      output: outputPath,
      scenarios: report.scenarios.map((scenario: {
        scenarioId: string;
        name: string;
        inputCount: number;
        startedCount: number;
        deterministicFindingCount: number;
      }) => ({
        id: scenario.scenarioId,
        name: scenario.name,
        inputs: scenario.inputCount,
        started: scenario.startedCount,
        findings: scenario.deterministicFindingCount,
      })),
      migrationWarnings: report.migrationWarnings.length,
    }),
  );
} finally {
  await vite.close();
}
