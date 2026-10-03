import { isConditionListField } from '../../src/ui/field-editor/conditionListSchema.ts';
import { resolveBlackboardMapping } from '../../src/ui/field-editor/blackboardMappingSchema.ts';
import type { FieldSemantics } from '../../src/ui/field-editor/fieldSemantics.ts';
import { isProtectedDefinitionIdentity } from '../../src/ui/definition-editor/definitionFieldRuntime.ts';
import type {
  DefinitionFieldSchema,
  DefinitionSchemaCatalog,
} from '../../src/ui/definition-editor/fieldSchema.ts';
import type { DataNodeSchema, NodeFieldSchema } from '../../src/ui/action-graph/nodeSchema.ts';

export interface FieldCapability {
  readonly key: string;
  readonly surface: 'definition' | 'action' | 'data';
  readonly root: string;
  readonly path: string;
  readonly control: string;
  readonly source: readonly string[];
  readonly aliases: readonly string[];
  readonly semantics?: FieldSemantics;
  readonly view: 'value' | 'structure' | 'navigation' | 'readonly' | 'context-dependent';
  readonly edit: 'field' | 'recursive' | 'none' | 'json' | 'context-dependent';
  /** 描述契约入口资格，不表示当前值已有连接，也不绕过图上下文校验。 */
  readonly connection: 'none' | 'execution' | 'number-context' | 'condition-context';
  readonly fallback?: string;
  readonly restriction?: 'identity-readonly';
  readonly contextualChoice?: 'number-blackboard-read' | 'macro-parameter-read';
}

export interface FieldCapabilityException {
  readonly reason: string;
  readonly phase: 'P1' | 'P2' | 'P3' | 'P4' | 'boundary';
  readonly category: string;
  /** 历史审计中实际有值并走 JSON 的位置；不是当前运行实例计数。 */
  readonly observedJsonAtAudit?: true;
  readonly keys: readonly string[];
}

/** 只合并当前值的联合选择，不把容器的叶子误当容器本身的引脚资格。 */
function valueAliases(semantics: FieldSemantics | undefined): string[] {
  return [
    ...new Set([
      ...(semantics?.aliases ?? []),
      ...(semantics?.unionVariants ?? []).flatMap(valueAliases),
    ]),
  ];
}

/** 分母是生成 schema 的展开位置；联合和容器槽分别列出，不读取私有数据或当前值。 */
export function collectFieldCapabilities(
  definitions: DefinitionSchemaCatalog,
  actions: Readonly<Record<string, DataNodeSchema>>,
  data: Readonly<Record<string, DataNodeSchema>>,
): FieldCapability[] {
  const rows: FieldCapability[] = [];
  function definition(
    schema: DefinitionFieldSchema,
    root: string,
    path: readonly string[],
    source: readonly string[] = [],
  ) {
    const origin = schema.source ?? source;
    const aliases = valueAliases(schema.semantics);
    const boundary =
      schema.kind === 'graph' ||
      ['graph-reference-boundary', 'owned-resource-boundary', 'no-present-type'].includes(
        schema.fallback?.reason ?? '',
      );
    const valuePath = path.filter(part => !/^<\d+>$/.test(part));
    const protectedIdentity = isProtectedDefinitionIdentity(
      valuePath.at(-1) ?? '',
      valuePath.length === 1,
    );
    rows.push({
      key: ['definition', root, ...path].join('/'),
      surface: 'definition',
      root,
      path: path.join('.'),
      control: schema.kind,
      source: origin,
      aliases,
      semantics: schema.semantics,
      view:
        schema.kind === 'graph'
          ? 'navigation'
          : schema.kind === 'opaque' || schema.kind === 'condition'
            ? 'readonly'
            : ['object', 'array', 'record', 'union'].includes(schema.kind)
              ? 'structure'
              : 'value',
      edit:
        protectedIdentity || boundary || schema.kind === 'opaque' || schema.kind === 'condition'
          ? 'none'
          : ['object', 'array', 'record', 'union'].includes(schema.kind)
            ? 'recursive'
            : 'field',
      connection: 'none',
      ...(protectedIdentity ? { restriction: 'identity-readonly' as const } : {}),
      ...(schema.fallback ? { fallback: schema.fallback.reason } : {}),
      ...(schema.kind === 'string' && aliases.includes('GameplayTag')
        ? { fallback: 'semantic-text-pending' }
        : {}),
    });
    if (schema.kind === 'object')
      for (const [name, child] of Object.entries(schema.fields))
        definition(child, root, [...path, name], origin);
    if (schema.kind === 'array') definition(schema.element, root, [...path, '[]'], origin);
    if (schema.kind === 'record') definition(schema.value, root, [...path, '{}'], origin);
    if (schema.kind === 'union')
      schema.variants.forEach((child, index) =>
        definition(child, root, [...path, `<${index}>`], origin),
      );
  }
  for (const [root, schema] of Object.entries(definitions)) definition(schema, root, []);
  for (const [surface, catalog] of [
    ['action', actions],
    ['data', data],
  ] as const) {
    for (const [root, schema] of Object.entries(catalog))
      for (const field of schema.fields) {
        const aliases = valueAliases(field.semantics);
        // DataNodeInspector 已有的两个作用域选择入口，不计为普通文本分派。
        const contextualChoice =
          surface === 'data' && root === 'number:blackboard' && field.path.join('.') === 'key'
            ? ('number-blackboard-read' as const)
            : surface === 'data' &&
                root === 'number:parameter' &&
                field.path.join('.') === 'parameter'
              ? ('macro-parameter-read' as const)
              : undefined;
        const expressionInput =
          field.control === 'operand' ||
          aliases.includes('ActionValueOperand') ||
          aliases.includes('CombatCondition');
        const mapping = resolveBlackboardMapping(field);
        const stringOperand = aliases.includes('ActionStringOperand');
        const conditionList = isConditionListField(field);
        const availableControl = conditionList
          ? 'conditionList'
          : mapping
            ? 'blackboardMapping'
            : stringOperand
              ? 'stringOperand'
              : expressionInput
                ? 'typedInput'
                : undefined;
        const complex = !availableControl && (field.control === 'json' || expressionInput);
        const fallback = availableControl
          ? undefined
          : (field.fallback?.reason ??
            (expressionInput ? 'unassigned-input-editor-pending' : undefined));
        rows.push({
          key: [surface, root, ...field.path].join('/'),
          surface,
          root,
          path: field.path.join('.'),
          control: availableControl ?? field.control,
          source: field.source ?? [],
          aliases,
          semantics: field.semantics,
          ...(contextualChoice ? { contextualChoice } : {}),
          view: ['resource', 'sequence'].includes(field.control)
            ? 'navigation'
            : conditionList
              ? 'structure'
              : complex
                ? 'context-dependent'
                : 'value',
          edit: ['resource', 'sequence'].includes(field.control)
            ? 'none'
            : complex
              ? 'context-dependent'
              : 'field',
          connection: nodeConnection(field),
          ...(fallback ? { fallback } : {}),
          ...(field.control === 'string' && aliases.includes('GameplayTag')
            ? { fallback: 'semantic-text-pending' }
            : {}),
        });
      }
  }
  return rows.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

function nodeConnection(field: NodeFieldSchema): FieldCapability['connection'] {
  if (field.control === 'sequence') return 'execution';
  if (field.control === 'operand' || valueAliases(field.semantics).includes('ActionValueOperand'))
    return 'number-context';
  if (valueAliases(field.semantics).includes('CombatCondition')) return 'condition-context';
  return 'none';
}

/** 不能用总数不变掩盖新后备；每条新增、理由变化和已移除的旧豁免均须审查。 */
export function checkFieldCapabilityCoverage(
  rows: readonly FieldCapability[],
  exceptions: readonly FieldCapabilityException[],
): string[] {
  const failures: string[] = [];
  const expected = new Map<string, FieldCapabilityException>();
  for (const group of exceptions) {
    if (
      !group.reason ||
      !group.category ||
      !['P1', 'P2', 'P3', 'P4', 'boundary'].includes(group.phase)
    )
      failures.push('exception lacks a reason, category or responsible phase');
    for (const key of group.keys) {
      if (expected.has(key)) failures.push(`duplicate exception: ${key}`);
      expected.set(key, group);
    }
  }
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.key)) failures.push(`duplicate schema position: ${row.key}`);
    seen.add(row.key);
    if (row.path && !row.source.length) failures.push(`missing source declaration: ${row.key}`);
    if (['json', 'opaque', 'condition'].includes(row.control) && !row.fallback)
      failures.push(`unexplained fallback: ${row.key}`);
    const exception = expected.get(row.key);
    if (row.fallback && !exception)
      failures.push(`unreviewed fallback (${row.fallback}): ${row.key}`);
    if (exception && row.fallback !== exception.reason)
      failures.push(
        `stale fallback (${exception.reason} -> ${row.fallback ?? 'none'}): ${row.key}`,
      );
  }
  for (const key of expected.keys())
    if (!seen.has(key)) failures.push(`removed schema position still exempted: ${key}`);
  return failures;
}

export function summarizeFieldCapabilities(rows: readonly FieldCapability[]) {
  const count = (items: readonly FieldCapability[], property: 'control' | 'fallback') =>
    Object.fromEntries(
      [...new Set(items.map(row => row[property] ?? 'none'))]
        .sort()
        .map(key => [key, items.filter(row => (row[property] ?? 'none') === key).length]),
    );
  const strings = rows.filter(row => row.control === 'string');
  const textStrings = strings.filter(row => !row.contextualChoice);
  return {
    definitionRoots: rows.filter(row => row.surface === 'definition' && !row.path).length,
    definitionNonRootNodes: rows.filter(row => row.surface === 'definition' && row.path).length,
    definitionKinds: count(
      rows.filter(row => row.surface === 'definition' && row.path),
      'control',
    ),
    actionFields: rows.filter(row => row.surface === 'action').length,
    dataFields: rows.filter(row => row.surface === 'data').length,
    actionControls: count(
      rows.filter(row => row.surface === 'action'),
      'control',
    ),
    dataControls: count(
      rows.filter(row => row.surface === 'data'),
      'control',
    ),
    stringSchemaPositions: strings.length,
    stringSchemaSourceDeclarations: new Set(strings.flatMap(row => row.source)).size,
    stringTextOrLegacyReferencePositions: textStrings.length,
    stringTextOrLegacyReferenceSourceDeclarations: new Set(textStrings.flatMap(row => row.source))
      .size,
    fallbackReasons: count(
      rows.filter(row => row.fallback),
      'fallback',
    ),
  };
}
