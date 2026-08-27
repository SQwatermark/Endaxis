import fs from 'node:fs';
import path from 'node:path';
import { compileOperatorFoundationSource } from '../src/domains/operator/sourceClosure.ts';
import { parseOperatorProductIdentitySource } from '../src/domains/operator/productIdentity.ts';
import { parseOperatorActiveSkillEntries } from '../src/domains/operator/activeSkills.ts';
import { assembleOperatorDefinition } from '../src/domains/operator/definition.ts';
import { compileAbilityEntityTemplateCatalogSource } from '../src/compiler/abilityEntityCatalog.ts';
import {
  requireArray,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireRecord,
} from '../src/source/primitives.ts';
import {
  planOperatorActiveSkillRuntime,
  type OperatorActiveSkillRuntimeArguments,
} from './generateOperatorActiveSkillRuntime.ts';
import { writeGeneratedDefinitionFiles } from '../src/compiler/writeGeneratedDefinitionFiles.ts';

/**
 * 整名候选规划：只读原始资源，不写正式目录、不载入旧生成 Operator。
 * 沿用主动批量入口的资源参数；tableRoot 指包含五张角色/养成表的目录。
 * 此阶段用于对象差分和正式模拟门禁，不提供绕过门禁的零散写文件 CLI。
 */
export function planOperatorDefinition(
  args: Omit<
    OperatorActiveSkillRuntimeArguments,
    'key' | 'skillType' | 'sourceFile' | 'supplementalBuffIds' | 'check'
  > & {
    readonly manifest: string;
    readonly tableRoot: string;
    readonly globalBuffCatalog: string;
    readonly skillSettingCatalog: string;
  },
) {
  const manifest = requireRecord(read(args.manifest), args.manifest);
  const matches = requireArray(manifest.operators, 'manifest.operators')
    .map(value => requireRecord(value, 'operator'))
    .filter(value => value.slug === args.slug);
  if (matches.length !== 1) throw new Error(`expected one operator ${args.slug}`);
  const row = matches[0]!;
  const entries = parseOperatorActiveSkillEntries(row.skills, `${args.slug}.skills`);
  const skills = Object.fromEntries(
    entries.map(entry => [
      entry.sourceFile,
      read(path.join(args.sourceRoot, 'skill-data-cdn', entry.sourceFile)),
    ]),
  );
  const foundation = compileOperatorFoundationSource({
    identity: parseOperatorProductIdentitySource(row, args.slug),
    manifestSkills: row.skills,
    manifestSkillGroups: row.skillGroups,
    skillDataBySourceFile: skills,
    skillPatchTable: read(args.skillPatchTable),
    characterTable: read(path.join(args.tableRoot, 'CharacterTable.json')),
    charGrowthTable: read(path.join(args.tableRoot, 'CharGrowthTable.json')),
    characterPotentialTable: read(path.join(args.tableRoot, 'CharacterPotentialTable.json')),
    potentialTalentEffectTable: read(path.join(args.tableRoot, 'PotentialTalentEffectTable.json')),
    skillConditionTable: read(path.join(args.tableRoot, 'SkillConditionTable.json')),
  });
  const activeSkills = entries.map(entry =>
    planOperatorActiveSkillRuntime({
      ...args,
      key: entry.key,
      skillType: entry.skillType,
      sourceFile: entry.sourceFile,
      supplementalBuffIds: [],
    }),
  );
  const spawned = [
    ...new Set(
      activeSkills.flatMap(skill => skill.abilityEntitySpawns.map(spawn => spawn.abilityEntityId)),
    ),
  ];
  const entityCatalog = compileAbilityEntityTemplateCatalogSource(
    Object.fromEntries(
      spawned.map(id => [id, read(path.join(args.sourceRoot, 'AbilityEntityData', `${id}.json`))]),
    ),
  );
  const candidate = assembleOperatorDefinition({
    foundation,
    activeSkills,
    entityCatalog,
    talentBindings: requireArray(row.talents, 'talents').map(value => {
      const binding = requireRecord(value, 'talent');
      return {
        index: requireNonNegativeInteger(binding.index, 'talent.index'),
        key: requireNonEmptyString(binding.key, 'talent.key'),
      };
    }),
    // manifest 潜能 key 是产品展示顺序，原生 level 是否完整连续仍由装配层逐项验证。
    potentialBindings: requireArray(row.potentials, 'potentials').map((value, index) => ({
      level: index + 1,
      key: requireNonEmptyString(requireRecord(value, 'potential').key, 'potential.key'),
    })),
    loadSkill: id => read(path.join(args.sourceRoot, 'skill-data-cdn', `${id}.json`)),
    loadBuff: id => read(path.join(args.buffDataRoot, `${id}.json`)),
    globalBuffCatalog: read(args.globalBuffCatalog),
    skillSettingCatalog: read(args.skillSettingCatalog),
  });
  return { ...candidate, activeSkills };
}

function read(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** 完整模式只写一个自洽资源包；共享 Buff 独立导出，不进入可编辑的 Operator 私有目录。 */
export async function generateOperatorDefinition(
  args: Parameters<typeof planOperatorDefinition>[0] & { readonly check: boolean },
) {
  for (const [directory, parent] of [
    [args.output, 'src/next/data/operators/generated-definitions'],
    [args.auditOutput, 'tmp/game-data-audit/operator-definitions'],
  ]) {
    const target = path.resolve(directory!);
    if (path.dirname(target) !== path.resolve(parent!) || path.basename(target) !== args.slug)
      throw new Error(`complete operator output must be ${parent}/${args.slug}`);
  }
  const plan = planOperatorDefinition(args);
  const file = {
    relativePath: `${args.slug}.operator.generated.ts`,
    content: `/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */\nimport type { OperatorDefinition, OperatorBuffDefinitions } from '../../../../core/game-data/operatorDefinition';\n\n// prettier-ignore\nexport const commonBuffDefinitions = ${JSON.stringify(plan.commonBuffDefinitions, null, 2)} as const satisfies OperatorBuffDefinitions;\n\n// prettier-ignore\nexport default ${JSON.stringify({ ...plan.operator, conversionSupport: { completeness: 'complete', missingCapabilities: [] } }, null, 2)} as const satisfies OperatorDefinition;\n`,
  };
  if (
    fs.existsSync(args.output) &&
    JSON.stringify(fs.readdirSync(args.output)) !== JSON.stringify([file.relativePath])
  )
    throw new Error('complete operator directory contains unexpected files');
  if (args.check) {
    const target = path.join(args.output, file.relativePath);
    if (
      !fs.existsSync(target) ||
      fs.readFileSync(target, 'utf8').replaceAll('\r\n', '\n') !== file.content
    )
      throw new Error(`complete operator definition is stale: ${target}`);
  } else {
    await writeGeneratedDefinitionFiles(args.auditOutput, [
      { relativePath: 'operator.audit.json', content: JSON.stringify(plan.audit, null, 2) + '\n' },
    ]);
    await writeGeneratedDefinitionFiles(args.output, [file]);
  }
  return {
    slug: args.slug,
    skillCount: plan.activeSkills.length,
    talentCount: plan.operator.talents.length,
    potentialCount: plan.operator.potentials.length,
    entityCount: Object.keys(plan.operator.abilityEntityDefinitions!).length,
    privateBuffCount: Object.keys(plan.operator.buffDefinitions!).length,
    commonBuffCount: Object.keys(plan.commonBuffDefinitions).length,
  };
}
