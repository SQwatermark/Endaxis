/** 从正式契约生成对象字段类型，不读取干员样本或现有项目。 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as prettier from 'prettier';
import ts from 'typescript';
import type { DefinitionFieldSchema } from '../../src/ui/definition-editor/fieldSchema.ts';
import { renderSharedSchemaObjects } from './renderSharedSchemaObjects.ts';
import { createFieldSemanticExtractor, type FieldTypeContext } from './fieldSemantics.ts';
import type {
  FieldFallbackReason,
  FieldSemanticMetadata,
} from '../../src/ui/field-editor/fieldSemantics.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const contract = resolve(root, 'packages/game-data-contract/src');
const output = resolve(root, 'src/ui/definition-editor/definitionSchemas.generated.ts');
const sources = {
  operator: ['operators.ts', 'OperatorDefinition'],
  weapon: ['equipment.ts', 'WeaponDefinition'],
  gear: ['equipment.ts', 'GearDefinition'],
  gearSet: ['equipment.ts', 'GearSetDefinition'],
  consumable: ['consumables.ts', 'ConsumableDefinition'],
  enemy: ['../../../src/core/game-data/enemyDefinition.ts', 'EnemyDefinition'],
  globalEffect: ['../../../src/core/game-data/globalEffectDefinition.ts', 'GlobalEffectDefinition'],
  contract: ['mechanics.ts', 'ContingencyContractTagDefinition'],
  skill: ['skills.ts', 'SkillDefinition'],
  skillGroup: ['skills.ts', 'SkillGroupDefinition'],
  skillGroupVariant: ['skills.ts', 'SkillGroupVariantDefinition'],
  buff: ['buffs.ts', 'SkillBuffDefinition'],
  abilityEntity: ['skills.ts', 'AbilityEntityDefinition'],
  abilityEntityChildSkill: ['skills.ts', 'AbilityEntityChildSkillDefinition'],
  abilityEntityPassiveSkill: ['skills.ts', 'AbilityEntityPassiveSkillDefinition'],
  operatorPassiveSkill: ['operators.ts', 'OperatorPassiveSkillDefinition'],
  operatorUpgrade: ['operators.ts', 'OperatorUpgradeDefinition'],
  weaponTrait: ['equipment.ts', 'WeaponTraitDefinition'],
  gearTrait: ['equipment.ts', 'GearTraitDefinition'],
} as const;

const program = ts.createProgram(
  [...new Set(Object.values(sources).map(([file]) => resolve(contract, file)))],
  {
    target: ts.ScriptTarget.ES2023,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    allowImportingTsExtensions: true,
    noEmit: true,
    strict: true,
    skipLibCheck: true,
    types: [],
    lib: ['lib.es2023.d.ts'],
  },
);
const checker = program.getTypeChecker();

function typeOf(file: string, name: string): ts.Type {
  const source = program.getSourceFile(resolve(contract, file));
  const module = source && checker.getSymbolAtLocation(source);
  const symbol = module && checker.getExportsOfModule(module).find(entry => entry.name === name);
  if (!symbol) throw new Error(`missing contract type ${name}`);
  return checker.getDeclaredTypeOfSymbol(symbol);
}

function branches(type: ts.Type): readonly ts.Type[] {
  return type.isUnion() ? type.types.flatMap(branches) : [type];
}

function literalValue(type: ts.Type): string | number {
  if (!type.isStringLiteral() && !type.isNumberLiteral())
    throw new Error('expected a string or number literal');
  if (typeof type.value !== 'string' && typeof type.value !== 'number')
    throw new Error('BigInt literal cannot be edited as a schema enum');
  return type.value;
}

/** 两个生成器在同一声明上下文中提取语义；本函数亦供自包含契约夹具使用。 */
export function describeDefinitionType(
  type: ts.Type,
  typeChecker: ts.TypeChecker = checker,
  symbol?: ts.Symbol,
  sourceRoot = root,
): DefinitionFieldSchema {
  const extractor = createFieldSemanticExtractor(typeChecker, sourceRoot);
  const fallback = (reason: FieldFallbackReason): FieldSemanticMetadata['fallback'] => ({ reason });

  function describe(
    input: FieldTypeContext,
    seen: ReadonlySet<ts.Type>,
    depth: number,
  ): DefinitionFieldSchema {
    const { type } = input;
    const metadata = extractor.metadata(input);
    const nullable = branches(type).filter(
      part => (part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Never)) === 0,
    );
    const optional = branches(type).some(part => (part.flags & ts.TypeFlags.Undefined) !== 0);
    const field = (shape: DefinitionFieldSchema): DefinitionFieldSchema => ({
      ...shape,
      ...metadata,
      ...(optional ? { optional: true } : {}),
    });
    // 条件是独立表达式，不把分支当作普通下拉框；从声明追踪可选 alias。
    if (
      /^(CombatCondition|BuildCondition)(?: \| (?:undefined|null))*$/.test(
        typeChecker.typeToString(type),
      )
    )
      return field({ kind: 'condition', fallback: fallback('condition-editor-pending') });
    if (!nullable.length) return field({ kind: 'opaque', fallback: fallback('no-present-type') });
    if (nullable.length > 1) {
      const literals: ts.Type[] = nullable.filter(
        part => part.isStringLiteral() || part.isNumberLiteral(),
      );
      if (literals.length === nullable.length)
        return field({ kind: 'enum', options: literals.map(literalValue) });
      if (nullable.every(part => (part.flags & ts.TypeFlags.BooleanLike) !== 0))
        return field({ kind: 'boolean' });
      const others = nullable.filter(part => !literals.includes(part));
      return field({
        kind: 'union',
        variants: [
          ...(literals.length
            ? [
                {
                  kind: 'enum' as const,
                  options: literals.map(literalValue),
                  source: input.source,
                  semantics: {
                    type: literals.map(part => typeChecker.typeToString(part)).join(' | '),
                    unionVariants: literals.map(part =>
                      extractor.semantics(extractor.branch(input, part)),
                    ),
                  },
                },
              ]
            : []),
          ...others.map(part => describe(extractor.branch(input, part), seen, depth)),
        ],
      });
    }
    const current = nullable[0]!;
    if ((current.flags & ts.TypeFlags.Null) !== 0) return field({ kind: 'null' });
    if (current.isStringLiteral() || current.isNumberLiteral())
      return field({ kind: 'enum', options: [literalValue(current)] });
    if ((current.flags & ts.TypeFlags.NumberLike) !== 0) return field({ kind: 'number' });
    if ((current.flags & ts.TypeFlags.StringLike) !== 0) return field({ kind: 'string' });
    if ((current.flags & ts.TypeFlags.BooleanLike) !== 0) return field({ kind: 'boolean' });
    if (
      current.flags &
        (ts.TypeFlags.Any |
          ts.TypeFlags.Unknown |
          ts.TypeFlags.BigIntLike |
          ts.TypeFlags.ESSymbolLike |
          ts.TypeFlags.TypeParameter) ||
      typeChecker.getSignaturesOfType(current, ts.SignatureKind.Call).length ||
      typeChecker.getSignaturesOfType(current, ts.SignatureKind.Construct).length
    )
      return field({ kind: 'opaque', fallback: fallback('unsupported-type') });
    const name = current.aliasSymbol?.name ?? current.getSymbol()?.name;
    if (name === 'ActionGraphResourceDefinition' || name === 'ActionGraphDefinition')
      return field({ kind: 'graph' });
    if (name === 'ActionGraphReference')
      return field({ kind: 'opaque', fallback: fallback('graph-reference-boundary') });
    if (depth > 0 && typeChecker.getPropertyOfType(current, 'actionGraph'))
      return field({ kind: 'opaque', fallback: fallback('owned-resource-boundary') });
    if (seen.has(current)) return field({ kind: 'opaque', fallback: fallback('recursive-type') });
    if (seen.size >= 16) return field({ kind: 'opaque', fallback: fallback('depth-limit') });
    const nested = new Set(seen).add(current);
    // tuple 的逐槽类型与长度留在共享语义中；旧表单尚未支持，不能伪装成同质数组。
    if (typeChecker.isTupleType(current))
      return field({ kind: 'opaque', fallback: fallback('tuple-editor-pending') });
    if (typeChecker.isArrayType(current)) {
      const element = typeChecker.getTypeArguments(current as ts.TypeReference)[0];
      return field({
        kind: 'array',
        element: element
          ? describe(extractor.element(input, element), nested, depth)
          : {
              kind: 'opaque',
              ...metadata,
              fallback: fallback('no-present-type'),
            },
      });
    }
    const index = typeChecker.getIndexTypeOfType(current, ts.IndexKind.String);
    if (index)
      return field({
        kind: 'record',
        value: describe(extractor.recordValue(input, index), nested, depth + 1),
      });
    if (depth >= 3) return field({ kind: 'opaque', fallback: fallback('depth-limit') });
    const fields: Record<string, DefinitionFieldSchema> = {};
    for (const property of typeChecker.getPropertiesOfType(current)) {
      // 映射属性可能无独立声明，继承最近可定位声明；不能跳过其类型。
      const propertyType = typeChecker.getTypeOfSymbol(property);
      const childContext = extractor.context(propertyType, property, input.source);
      const child =
        property.name === 'actionGraph'
          ? { kind: 'graph' as const, ...extractor.metadata(childContext) }
          : describe(childContext, nested, depth + 1);
      const description = ts
        .displayPartsToString(property.getDocumentationComment(typeChecker))
        .replaceAll('\r\n', '\n')
        .trim();
      fields[property.name] = {
        ...child,
        ...(property.flags & ts.SymbolFlags.Optional ? { optional: true } : {}),
        ...(description ? { description } : {}),
      };
    }
    return field({ kind: 'object', fields });
  }
  return describe(
    extractor.context(type, symbol ?? type.aliasSymbol ?? type.getSymbol()),
    new Set(),
    0,
  );
}

export async function generateDefinitionSchemas(check = false): Promise<void> {
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length)
    throw new Error(
      ts.formatDiagnostics(diagnostics, {
        getCurrentDirectory: () => root,
        getCanonicalFileName: name => name,
        getNewLine: () => '\n',
      }),
    );
  const catalog = Object.fromEntries(
    Object.entries(sources).map(([kind, [file, name]]) => [
      kind,
      describeDefinitionType(typeOf(file, name)),
    ]),
  );
  const rendered = renderSharedSchemaObjects(catalog, 'definitionSchemaPart');
  const prettierConfig = await prettier.resolveConfig(output);
  const source = await prettier.format(
    `/** 由 tools/editor/generateDefinitionSchemas.ts 从正式契约生成，请勿手改。 */\nimport type { DefinitionSchemaCatalog } from './fieldSchema';\n${rendered.declarations}\nexport const definitionSchemas = ${rendered.expression} as const satisfies DefinitionSchemaCatalog;\n`,
    { ...prettierConfig, filepath: output },
  );
  if (check) {
    if ((await readFile(output, 'utf8')) !== source)
      throw new Error('definition field schemas are stale; run generate:definition-fields');
  } else await writeFile(output, source);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await generateDefinitionSchemas(process.argv.includes('--check'));
}
