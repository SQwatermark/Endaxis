import type { FieldSemantics } from './fieldSemantics.ts';
import type { DefinitionFieldSchema } from '../definition-editor/fieldSchema.ts';
import type { NodeFieldSchema } from '../action-graph/nodeSchema.ts';
import { referenceKindForDeclaration } from '../definition-editor/fieldInputConfig.ts';

function arrayElement(semantics: FieldSemantics | undefined): FieldSemantics | undefined {
  if (semantics?.arrayElement) return semantics.arrayElement;
  const variants = semantics?.unionVariants?.map(arrayElement);
  if (
    variants?.length &&
    variants.every(value => value && JSON.stringify(value) === JSON.stringify(variants[0]))
  )
    return variants[0];
  return undefined;
}
/** Only formal homogeneous string containers qualify; tuples/unions are not guessed. */
export function stringCollectionDescriptor(
  schema: DefinitionFieldSchema | NodeFieldSchema,
  name?: string,
  inheritedReferenceKind?: string,
): { readonly kind: 'reference' | 'gameplayTag'; readonly referenceKind?: string } | undefined {
  const node = 'control' in schema;
  const element = node
    ? arrayElement(schema.semantics)
    : schema.kind === 'array' && schema.element.kind === 'string'
      ? (schema.element.semantics ?? { type: 'string' })
      : undefined;
  if (!element || schema.semantics?.tuple) return undefined;
  if (element.aliases?.includes('GameplayTag')) return { kind: 'gameplayTag' };
  const referenceKind =
    inheritedReferenceKind ??
    referenceKindForDeclaration(
      name ?? (node ? schema.path.at(-1) : undefined) ?? '',
      schema.source,
    );
  if (referenceKind && referenceKind !== 'globalBuff' && element.type === 'string')
    return { kind: 'reference', referenceKind };
  return undefined;
}
