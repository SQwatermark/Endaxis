import { canSelectReference, type ReferenceChoices } from '@/application/editor/referenceResolver';
import { fieldSchemaForValue } from '../definition-editor/definitionFieldRuntime';
import type { DefinitionFieldSchema } from '../definition-editor/fieldSchema';
import { validStringOperandDraft } from './stringOperandDraft';
import { resolveFieldEditor } from './fieldEditorDispatch';

/** Submit-time validation for new values; catalogs can change while a draft is open. */
export function validReferenceDraft(
  schema: DefinitionFieldSchema,
  value: unknown,
  choices: ReferenceChoices | undefined,
  referenceKind?: string,
  name?: string,
): boolean {
  if (value === undefined && schema.optional) return true;
  const editor = resolveFieldEditor(schema, { referenceKind, name });
  const family = editor.referenceKind;
  const shape = fieldSchemaForValue(schema, value, name);
  if (editor.control === 'stringOperand') return validStringOperandDraft(value, family, choices);
  if (schema.kind === 'union') return validReferenceDraft(shape, value, choices, family, name);
  if (shape.kind === 'graph') return true;
  if (editor.control === 'reference')
    return (
      typeof value === 'string' && canSelectReference(family ?? '', value, choices?.[family ?? ''])
    );
  if (schema.kind === 'array' && Array.isArray(value))
    return value.every(item => validReferenceDraft(schema.element, item, choices, family));
  if (schema.kind === 'record' && value && typeof value === 'object')
    return Object.values(value).every(item =>
      validReferenceDraft(schema.value, item, choices, family),
    );
  if (schema.kind === 'object' && value && typeof value === 'object')
    return Object.entries(schema.fields).every(([key, child]) =>
      validReferenceDraft(child, (value as Record<string, unknown>)[key], choices, undefined, key),
    );
  return true;
}
