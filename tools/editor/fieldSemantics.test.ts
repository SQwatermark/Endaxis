import assert from 'node:assert/strict';
import test from 'node:test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describeDefinitionType } from './generateDefinitionSchemas.ts';
import { describeNodeFields } from './generateActionNodeSchema.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const fixturePath = resolve(root, 'tools/editor/fieldSemantics.fixture.ts');
const source = `
import type { GameplayTag as ImportedTag } from '../../packages/game-data-contract/src/gameplayTags.ts';
import type { ActionStringOperand, LevelValues } from '../../packages/game-data-contract/src/primitives.ts';
import type { ActionValueOperand } from '../../packages/game-data-contract/src/conditions.ts';
import type { ActionGraphReference } from '../../packages/game-data-contract/src/actionGraph.ts';
type TagAlias = ImportedTag;
type TagMap<T> = Readonly<Record<string, T>>;
type Tags = readonly TagAlias[];
type Spread<T> = readonly [head: number, ...tail: T[]];
namespace Unrelated { export type GameplayTag = string; }
interface IndexedTags { readonly [key: string]: TagAlias; }
export interface Fixture {
  tag?: TagAlias;
  tags: readonly TagAlias[];
  mapped: Readonly<Record<string, TagAlias>>;
  generic: TagMap<ImportedTag>;
  indexed: IndexedTags;
  choice: TagAlias | number;
  mixed: LevelValues | ActionValueOperand;
  tuple: readonly [tag: TagAlias, count: number, label?: ActionStringOperand];
  rest: readonly [tag: TagAlias, ...levels: number[]];
  namedRest: readonly [head: number, ...tail: TagAlias[]];
  unnamedRest: readonly [number, ...TagAlias[]];
  aliasRest: readonly [head: number, ...tail: Tags];
  genericRest: Spread<ImportedTag>;
  operand?: ActionValueOperand;
  operands: readonly ActionValueOperand[];
  textOperand: ActionStringOperand;
  levels: LevelValues;
  graph?: ActionGraphReference;
  condition?: import('../../packages/game-data-contract/src/conditions.ts').CombatCondition;
  ordinaryBuffId: string;
  misleading: Unrelated.GameplayTag;
  impossible?: never;
  unknownValue: unknown;
  callback: () => number;
  integer: bigint;
  identifier: symbol;
}
export type RecursiveList = readonly RecursiveList[];
export interface RecursiveMap { readonly [key: string]: RecursiveMap; }
export type Aggregated = { value?: ImportedTag } | { value: number } | { value?: never };
export interface DepthFixture { a: { b: { c: { value: ImportedTag } } } }
`;
const options: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2023,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  allowImportingTsExtensions: true,
  noEmit: true,
  skipLibCheck: true,
  types: [],
};
const host = ts.createCompilerHost(options);
const originalSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (path, version, onError, shouldCreateNewSourceFile) =>
  resolve(path) === fixturePath
    ? ts.createSourceFile(fixturePath, source, options.target!, true)
    : originalSourceFile(path, version, onError, shouldCreateNewSourceFile);
const program = ts.createProgram([fixturePath], options, host);
const checker = program.getTypeChecker();
const diagnostics = ts.getPreEmitDiagnostics(program);
assert.equal(
  diagnostics.length,
  0,
  diagnostics
    .map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    .join('\n'),
);
const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(fixturePath)!)!;
function typeOf(name: string) {
  const symbol = checker.getExportsOfModule(moduleSymbol).find(item => item.name === name)!;
  return checker.getDeclaredTypeOfSymbol(symbol);
}
const fixture = typeOf('Fixture');
const definition = describeDefinitionType(fixture, checker);
assert.equal(definition.kind, 'object');
if (definition.kind !== 'object') throw new Error('fixture must describe an object');
const fields = definition.fields;
const nodes = Object.fromEntries(
  describeNodeFields(fixture, checker).map(field => [field.label, field]),
);

test('both generators retain erased, imported and indirect aliases in optional and container slots', () => {
  const tagType = checker.getTypeOfSymbol(checker.getPropertyOfType(fixture, 'tag')!);
  assert.equal(
    checker.getNonNullableType(tagType).aliasSymbol,
    undefined,
    'fixture must exercise checker-erased string aliases',
  );
  for (const name of [
    'tag',
    'tags',
    'mapped',
    'generic',
    'indexed',
    'choice',
    'mixed',
    'tuple',
    'operand',
    'operands',
    'textOperand',
    'levels',
    'graph',
    'condition',
  ]) {
    assert.deepEqual(fields[name]!.semantics, nodes[name]!.semantics, name);
    assert.deepEqual(fields[name]!.source, nodes[name]!.source, name);
    assert.ok(
      fields[name]!.source?.every(source =>
        source.startsWith('tools/editor/fieldSemantics.fixture.ts:'),
      ),
      name,
    );
  }
  assert.deepEqual(fields.tag!.semantics?.aliases, ['GameplayTag']);
  assert.equal(fields.tag!.optional, true);
  assert.equal(fields.tag!.semantics?.optional, true);
  assert.deepEqual(fields.tags!.semantics?.arrayElement?.aliases, ['GameplayTag']);
  for (const name of ['mapped', 'generic', 'indexed']) {
    const field = fields[name]!;
    assert.equal(field.kind, 'record');
    if (field.kind !== 'record') throw new Error(`${name} must be a record`);
    assert.deepEqual(
      field.value.semantics?.aliases,
      ['GameplayTag'],
      `${name} must retain its value alias`,
    );
    assert.deepEqual(field.semantics?.recordValue?.aliases, ['GameplayTag']);
    assert.deepEqual(field.source, field.value.source);
  }
  for (const [name, alias] of [
    ['operand', 'ActionValueOperand'],
    ['textOperand', 'ActionStringOperand'],
    ['levels', 'LevelValues'],
    ['graph', 'ActionGraphReference'],
    ['condition', 'CombatCondition'],
  ] as const)
    assert.deepEqual(fields[name]!.semantics?.aliases, [alias], name);
  assert.equal(
    fields.operand!.semantics?.unionVariants,
    undefined,
    'formal operands stay atomic instead of duplicating the contract',
  );
  assert.equal(
    nodes.operands!.semantics?.aliases,
    undefined,
    'a container cannot become an operand input',
  );
  assert.deepEqual(nodes.operands!.semantics?.arrayElement?.aliases, ['ActionValueOperand']);
});

test('union alternatives retain their own identity without promoting plain strings or mixed inputs', () => {
  assert.equal(fields.choice!.kind, 'union');
  assert.equal(fields.choice!.semantics?.aliases, undefined);
  assert.deepEqual(
    fields.choice!.semantics?.unionVariants?.find(variant => variant.type === 'string')?.aliases,
    ['GameplayTag'],
  );
  assert.equal(fields.mixed!.semantics?.aliases, undefined);
  assert.deepEqual(
    fields.mixed!.semantics?.unionVariants?.map(variant => variant.aliases),
    [['LevelValues'], ['ActionValueOperand']],
  );
  if (fields.choice!.kind === 'union')
    assert.deepEqual(
      fields.choice!.variants.find(variant => variant.kind === 'string')?.semantics?.aliases,
      ['GameplayTag'],
    );
  assert.equal(fields.ordinaryBuffId!.semantics?.aliases, undefined);
  assert.equal(
    fields.misleading!.semantics?.aliases,
    undefined,
    'same-name aliases outside the formal contract are not domain evidence',
  );
  const aggregate = describeNodeFields(typeOf('Aggregated'), checker)[0]!;
  assert.equal(aggregate.required, false);
  assert.equal(
    aggregate.source?.length,
    3,
    'union fields keep prohibited as well as editable declaration identities',
  );
  assert.ok(
    aggregate.semantics?.unionVariants?.some(variant => variant.aliases?.includes('GameplayTag')),
  );
});

test('tuples preserve heterogeneous slots and length while legacy forms explicitly remain unsupported', () => {
  assert.equal(fields.tuple!.kind, 'opaque');
  assert.equal(fields.tuple!.fallback?.reason, 'tuple-editor-pending');
  assert.equal(nodes.tuple!.control, 'json');
  assert.equal(nodes.tuple!.fallback?.reason, 'tuple-editor-pending');
  const tuple = fields.tuple!.semantics?.tuple!;
  assert.equal(tuple.minLength, 2);
  assert.equal(tuple.maxLength, 3);
  assert.deepEqual(
    tuple.elements.map(element => element.label),
    ['tag', 'count', 'label'],
  );
  assert.deepEqual(tuple.elements[0]!.semantics.aliases, ['GameplayTag']);
  assert.equal(tuple.elements[1]!.semantics.type, 'number');
  assert.equal(tuple.elements[2]!.optional, true);
  assert.deepEqual(tuple.elements[2]!.semantics.aliases, ['ActionStringOperand']);
  assert.equal(fields.rest!.semantics?.tuple?.minLength, 1);
  assert.equal(fields.rest!.semantics?.tuple?.maxLength, undefined);
  assert.equal(fields.rest!.semantics?.tuple?.elements[1]!.rest, true);
  for (const name of ['namedRest', 'unnamedRest', 'aliasRest', 'genericRest']) {
    assert.deepEqual(fields[name]!.semantics, nodes[name]!.semantics, name);
    const tail = fields[name]!.semantics?.tuple?.elements[1]!;
    assert.equal(tail.rest, true, name);
    assert.deepEqual(tail.semantics.aliases, ['GameplayTag'], name);
  }
});

test('recursive containers, exhausted depth and non-editable types have explicit fallback reasons', () => {
  const list = describeDefinitionType(typeOf('RecursiveList'), checker);
  assert.equal(list.kind, 'array');
  if (list.kind === 'array') assert.equal(list.element.fallback?.reason, 'recursive-type');
  const map = describeDefinitionType(typeOf('RecursiveMap'), checker);
  assert.equal(map.kind, 'record');
  if (map.kind === 'record') assert.equal(map.value.fallback?.reason, 'recursive-type');
  const depth = describeDefinitionType(typeOf('DepthFixture'), checker);
  if (
    depth.kind !== 'object' ||
    depth.fields.a?.kind !== 'object' ||
    depth.fields.a.fields.b?.kind !== 'object'
  )
    throw new Error('expected the supported object depth');
  assert.equal(depth.fields.a.fields.b.fields.c?.fallback?.reason, 'depth-limit');
  assert.equal(fields.impossible!.fallback?.reason, 'no-present-type');
  for (const name of ['unknownValue', 'callback', 'integer', 'identifier']) {
    assert.equal(fields[name]!.kind, 'opaque', name);
    assert.equal(fields[name]!.fallback?.reason, 'unsupported-type', name);
  }
});
