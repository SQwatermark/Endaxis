import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createServer } from 'vite';

import { createCandidateRuntimeOverlayPlugin } from '../src/compiler/candidateRuntimeOverlay.ts';

const PROJECT_ROOT = path.resolve(import.meta.dirname, '../../..');
const REPLACEMENT_PATHS = [
  'src/next/data/operators/generated-definitions',
  'src/next/data/buffs/generated',
  'src/next/data/combat/gameplayTagCatalog.generated.ts',
  'src/next/data/combat/gameplayTagPredefine.generated.ts',
  'src/next/data/combat/hitStopCurveCatalog.generated.ts',
  'src/next/data/combat/timeDilationCatalog.generated.ts',
  'src/next/data/combat/skill-setting.generated.json',
  'src/next/data/global-buffs/global-buff-templates.generated.json',
] as const;

interface AuditArguments {
  readonly candidateRoot: string;
  readonly potential: number;
  readonly endFrame: number;
}

interface RuntimeOperator {
  readonly slug: string;
  readonly talents: readonly unknown[];
  readonly skillGroups: readonly unknown[];
}

interface RuntimeSkillBinding {
  readonly group: {
    readonly key: string;
    readonly replacementSkillPlacements?: Readonly<Record<string, string>>;
  };
  readonly skill: { readonly key: string };
  readonly variant?: { readonly key: string };
}

interface RuntimeSkillCase {
  readonly operator: RuntimeOperator;
  readonly groupKey: string;
  readonly variantKey?: string;
  readonly skill: { readonly key: string };
}

type RuntimeScenario = Record<string, any>;
type RuntimePlaceSkillGroup = (input: Record<string, any>) => {
  readonly scenario: RuntimeScenario;
};

/**
 * 在候选覆盖视图里加载整批干员并逐个放置技能。候选仍位于 tmp，正式生成目录不发生写入；
 * 运行对象也保持 TypeScript 模块语义，不经 JSON 序列化破坏 Infinity 等数值。
 */
export async function auditCandidateOperatorSkills(args: AuditArguments) {
  const candidateRoot = await fs.realpath(path.resolve(args.candidateRoot));
  const operatorRoot = path.join(candidateRoot, 'src/next/data/operators/generated-definitions');
  const operatorFiles = (await walkFiles(operatorRoot)).filter(file =>
    file.endsWith('.operator.generated.ts'),
  );
  if (operatorFiles.length === 0) throw new Error('candidate contains no generated operators');

  const server = await createServer({
    configFile: false,
    root: PROJECT_ROOT,
    appType: 'custom',
    logLevel: 'error',
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true },
    plugins: [
      createCandidateRuntimeOverlayPlugin({
        projectRoot: PROJECT_ROOT,
        candidateRoot,
        replacementPaths: REPLACEMENT_PATHS,
      }),
    ],
  });
  try {
    const operators: RuntimeOperator[] = [];
    for (const file of operatorFiles.sort()) {
      const module = await server.ssrLoadModule(toViteFsId(file));
      const definitions = Object.values(module).filter(isOperatorDefinition);
      if (definitions.length !== 1) {
        throw new Error(
          `${path.relative(candidateRoot, file)} exports ${definitions.length} operator definitions`,
        );
      }
      operators.push(definitions[0]);
    }

    const repositoryModule = await server.ssrLoadModule('/src/next/data/gameDataRepository.ts');
    const formalRepository = repositoryModule.nextGameDataRepository;
    const commonBuffModule = await server.ssrLoadModule(
      toViteFsId(
        path.join(
          candidateRoot,
          'src/next/data/buffs/generated/commonBuffDefinitions.generated.ts',
        ),
      ),
    );
    const skillSettingModule = await server.ssrLoadModule(
      '/src/next/core/combat/infliction/skillSettings.ts',
    );
    const rawSkillSettings = JSON.parse(
      await fs.readFile(
        path.join(candidateRoot, 'src/next/data/combat/skill-setting.generated.json'),
        'utf8',
      ),
    );
    const repository = repositoryModule.createGameDataRepository({
      revision: 'candidate-operator-simulation-audit',
      commonBuffDefinitions: commonBuffModule.commonBuffDefinitions,
      operators,
      enemies: formalRepository.getEnemies(),
    });
    const perlica = operators.find(operator => operator.slug === 'perlica');
    if (perlica === undefined) throw new Error('candidate does not contain perlica');

    const bindingsModule = await server.ssrLoadModule(
      '/src/next/core/game-data/operatorSkillDefinitions.ts',
    );
    const projectModule = await server.ssrLoadModule('/src/next/core/project/createProject.ts');
    const placementModule = await server.ssrLoadModule('/src/next/ui/timeline/placeSkillGroup.ts');
    const serviceModule = await server.ssrLoadModule(
      '/src/next/application/scenarioSimulationService.ts',
    );
    const attachmentModule = await server.ssrLoadModule(
      '/src/next/data/buffs/elementalAttachments.ts',
    );
    const cases: RuntimeSkillCase[] = operators.flatMap(operator =>
      (bindingsModule.listOperatorSkillDefinitionBindings(operator) as RuntimeSkillBinding[])
        .filter(
          ({ group, skill }: RuntimeSkillBinding) =>
            group.replacementSkillPlacements?.[skill.key] !== 'internal',
        )
        .map(({ group, skill, variant }: RuntimeSkillBinding) => ({
          operator,
          groupKey: group.key,
          variantKey: variant?.key,
          skill,
        })),
    );
    const identities = new Set(cases.map(skillIdentity));
    if (identities.size !== cases.length) throw new Error('candidate skill identity is not unique');

    const service = new serviceModule.ScenarioSimulationService({
      index: repository,
      repositoryRevision: 'candidate-operator-simulation-audit',
      resources: {
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecoveryPauseDuration: 1.5,
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
      },
      elementalInflictionDocument: attachmentModule.elementalAttachments,
      spellInflictionSettings: skillSettingModule.parseSkillSettings(rawSkillSettings),
    });
    const failures = [];
    for (const entry of cases) {
      const identity = skillIdentity(entry);
      try {
        const scenario = projectModule.createEmptyScenario(`audit:${identity}`, '候选技能运行门禁');
        scenario.battle.durationFrames = args.endFrame;
        scenario.enemy.editable.hp = 1_000_000_000;
        scenario.battle.resourceRules = {
          maxSp: 1000,
          initialSp: 1000,
          spRecoveryPerSecond: 100,
          defaultSkillSpCost: 100,
        };
        scenario.tracks[0] = createTrack(entry.operator, args.potential, 1000);
        scenario.tracks[1] = createTrack(perlica, args.potential, 0, 'track:audit-teammate');
        const context = placeRequiredSkillContext(
          scenario,
          identity,
          entry.operator,
          placementModule.placeSkillGroup,
        );
        const placed = placementModule.placeSkillGroup({
          scenario: context.scenario,
          trackIndex: 0,
          operator: entry.operator,
          skillGroupKey: entry.groupKey,
          ...(entry.variantKey === undefined ? {} : { variantKey: entry.variantKey }),
          skillKey: entry.skill.key,
          startFrame: context.startFrame,
          ids: { allocate: (kind: string) => `${kind}:${identity}` },
        }).scenario;
        await service.simulate(placed, args.endFrame);
      } catch (error) {
        failures.push({
          identity,
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
      }
    }
    if (failures.length > 0) {
      throw new Error(
        `candidate simulation failed for ${failures.length}/${cases.length} skill(s):\n${failures
          .slice(0, 30)
          .map(
            failure =>
              `${failure.identity}: ${failure.message}${
                failure.stack === undefined ? '' : `\n${failure.stack}`
              }`,
          )
          .join('\n')}`,
      );
    }
    return {
      operatorCount: operators.length,
      placeableSkillCount: cases.length,
      potential: args.potential,
      endFrame: args.endFrame,
    };
  } finally {
    await server.close();
  }
}

function createTrack(
  operator: RuntimeOperator,
  potential: number,
  ultimateEnergy: number,
  id?: string,
) {
  return {
    id: id ?? `track:${operator.slug}`,
    operator: {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: Object.fromEntries(operator.talents.map((_, index: number) => [index, 0])),
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy, maxUltimateEnergyOverride: 1000 },
    skillCasts: [],
  };
}

function placeRequiredSkillContext(
  scenario: RuntimeScenario,
  identity: string,
  operator: RuntimeOperator,
  placeSkillGroup: RuntimePlaceSkillGroup,
) {
  if (identity === 'yvonne/basicAttack/enhancedBasicAttack/ultimateAttackEnd') {
    return {
      scenario: placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator,
        skillGroupKey: 'ultimate',
        skillKey: 'ultimate',
        startFrame: 1,
        ids: {
          allocate: (kind: string) => `${kind}:yvonne:ultimate:enhancement-prerequisite`,
        },
      }).scenario,
      startFrame: 66,
    };
  }
  return { scenario, startFrame: 1 };
}

function skillIdentity(entry: RuntimeSkillCase): string {
  return `${entry.operator.slug}/${entry.groupKey}/${entry.variantKey ?? 'base'}/${entry.skill.key}`;
}

function isOperatorDefinition(value: unknown): value is RuntimeOperator {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { slug?: unknown }).slug === 'string' &&
    Array.isArray((value as { skillGroups?: unknown }).skillGroups)
  );
}

function toViteFsId(file: string): string {
  return `/@fs/${file.replaceAll('\\', '/')}`;
}

async function walkFiles(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await fs.readdir(root, { withFileTypes: true })) {
    const child = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`candidate directory contains a link: ${child}`);
    if (entry.isDirectory()) result.push(...(await walkFiles(child)));
    else if (entry.isFile()) result.push(child);
  }
  return result;
}

function parseArguments(argv: readonly string[]): AuditArguments {
  let candidateRoot = '';
  let potential = 0;
  let endFrame = 3600;
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]!;
    const value = argv[index + 1];
    if (argument === '--candidate-root' && value !== undefined) {
      candidateRoot = value;
      index += 1;
    } else if (argument === '--potential' && value !== undefined) {
      potential = Number(value);
      index += 1;
    } else if (argument === '--end-frame' && value !== undefined) {
      endFrame = Number(value);
      index += 1;
    } else {
      throw new Error(`unknown or incomplete argument: ${argument}`);
    }
  }
  if (candidateRoot.length === 0) throw new Error('--candidate-root is required');
  if (!Number.isInteger(potential) || potential < 0 || potential > 5)
    throw new Error('--potential must be an integer from 0 to 5');
  if (!Number.isInteger(endFrame) || endFrame < 1)
    throw new Error('--end-frame must be a positive integer');
  return { candidateRoot, potential, endFrame };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await auditCandidateOperatorSkills(parseArguments(process.argv.slice(2)));
  console.log(JSON.stringify(result, null, 2));
}
