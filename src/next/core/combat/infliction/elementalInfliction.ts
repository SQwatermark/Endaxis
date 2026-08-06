import type { InflictionElement } from '../../game-data/operatorDefinition';

export interface ExistingElementalAttachment {
  readonly element: InflictionElement;
  readonly layers: number;
}

export type ElementalInflictionOperation =
  | { readonly kind: 'addAttachment'; readonly element: InflictionElement }
  | { readonly kind: 'triggerBurst'; readonly element: InflictionElement }
  | { readonly kind: 'consumeAttachment'; readonly attachment: ExistingElementalAttachment }
  | {
      readonly kind: 'createCompoundStatus';
      readonly consumedElement: InflictionElement;
      readonly incomingElement: InflictionElement;
      readonly consumedLayers: number;
    };

/** Resolves the recovered empty, same-type, and different-type attachment branches. */
export function resolveElementalInfliction(
  incomingElement: InflictionElement,
  existingAttachment: ExistingElementalAttachment | null,
): readonly ElementalInflictionOperation[] {
  if (existingAttachment === null) {
    return [{ kind: 'addAttachment', element: incomingElement }];
  }
  if (existingAttachment.element === incomingElement) {
    return [
      { kind: 'triggerBurst', element: incomingElement },
      { kind: 'addAttachment', element: incomingElement },
    ];
  }
  return [
    { kind: 'consumeAttachment', attachment: existingAttachment },
    {
      kind: 'createCompoundStatus',
      consumedElement: existingAttachment.element,
      incomingElement,
      consumedLayers: existingAttachment.layers,
    },
  ];
}
