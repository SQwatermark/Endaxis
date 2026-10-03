import type { NodeFieldSchema } from '../action-graph/nodeSchema';
import type { DefinitionFieldSchema } from '../definition-editor/fieldSchema';
import { referenceKindForDeclaration } from '../definition-editor/fieldInputConfig';
import type { FieldFallbackReason, FieldSemanticAlias, FieldSemantics } from './fieldSemantics';

export interface FieldEditorContext {
  readonly name?: string;
  /** An explicit family inherited by an array/record value or selected union branch. */
  readonly referenceKind?: string;
  readonly editable?: boolean;
  /** The host knows whether this is an existing protected identity or a new declaration. */
  readonly protectedIdentity?: boolean;
}

export interface FieldEditorResolution {
  readonly control: DefinitionFieldSchema['kind'] | NodeFieldSchema['control'] | 'reference';
  readonly semantic:
    | 'plain'
    | 'reference'
    | 'identity'
    | 'levelValues'
    | 'stringOperand'
    | 'valueOperand'
    | 'combatCondition'
    | 'buildCondition'
    | 'graph'
    | 'tuple'
    | 'gameplayTag';
  readonly view: 'value' | 'reference' | 'structure' | 'navigation' | 'readonly';
  readonly edit: 'field' | 'recursive' | 'json' | 'none';
  readonly referenceKind?: string;
  readonly fallback?: FieldFallbackReason;
  readonly readonly: boolean;
}

/** Union alternatives describe this value; container elements describe other values. */
function aliasesOf(semantics: FieldSemantics | undefined): readonly FieldSemanticAlias[] {
  return [...(semantics?.aliases ?? []), ...(semantics?.unionVariants ?? []).flatMap(aliasesOf)];
}

/** Shared type dispatch only: no catalog reads, current-value guesses, or write side effects.
 * P1 preserves each surface's existing controls while exposing semantic intent and gaps.
 * Candidates and reference validity belong to the application's resolver, never this function.
 */
export function resolveFieldEditor(
  schema: DefinitionFieldSchema | NodeFieldSchema,
  context: FieldEditorContext = {},
): FieldEditorResolution {
  const node = 'control' in schema;
  const baseControl = node ? schema.control : schema.kind;
  const name = context.name ?? (node ? schema.path.at(-1) : undefined) ?? '';
  const referenceKind = context.referenceKind ?? referenceKindForDeclaration(name, schema.source);
  const aliases = aliasesOf(schema.semantics);
  const has = (alias: FieldSemanticAlias) => aliases.includes(alias);
  const tuple = Boolean(schema.semantics?.tuple);
  const boundary =
    ['graph', 'sequence', 'resource'].includes(baseControl) ||
    ['graph-reference-boundary', 'owned-resource-boundary'].includes(schema.fallback?.reason ?? '');
  const semantic: FieldEditorResolution['semantic'] = context.protectedIdentity
    ? 'identity'
    : tuple
      ? 'tuple'
      : has('ActionGraphReference') || baseControl === 'graph' || baseControl === 'sequence'
        ? 'graph'
        : has('ActionStringOperand')
          ? 'stringOperand'
          : has('ActionValueOperand') || baseControl === 'operand'
            ? 'valueOperand'
            : has('CombatCondition')
              ? 'combatCondition'
              : has('BuildCondition')
                ? 'buildCondition'
                : has('LevelValues') || baseControl === 'levelValues'
                  ? 'levelValues'
                  : has('GameplayTag')
                    ? 'gameplayTag'
                    : referenceKind
                      ? 'reference'
                      : 'plain';
  const control =
    baseControl === 'string' && referenceKind && !context.protectedIdentity
      ? 'reference'
      : baseControl;
  const container = ['array', 'record', 'object', 'union'].includes(baseControl);
  const intrinsicallyReadonly = boundary || ['opaque', 'condition', 'null'].includes(baseControl);
  const readonly =
    context.editable === false || Boolean(context.protectedIdentity) || intrinsicallyReadonly;
  const fallback =
    schema.fallback?.reason ??
    (baseControl === 'opaque'
      ? tuple
        ? 'tuple-editor-pending'
        : 'unsupported-type'
      : baseControl === 'condition'
        ? 'condition-editor-pending'
        : baseControl === 'json'
          ? 'structured-editor-pending'
          : boundary
            ? baseControl === 'resource'
              ? 'owned-resource-boundary'
              : 'graph-reference-boundary'
            : undefined);
  return {
    control,
    semantic,
    view: boundary
      ? 'navigation'
      : control === 'reference'
        ? 'reference'
        : container
          ? 'structure'
          : intrinsicallyReadonly
            ? 'readonly'
            : 'value',
    edit: readonly
      ? 'none'
      : container
        ? 'recursive'
        : ['json', 'operand'].includes(baseControl)
          ? 'json'
          : 'field',
    ...(referenceKind === undefined ? {} : { referenceKind }),
    ...(fallback === undefined ? {} : { fallback }),
    readonly,
  };
}
