import type {
  CombatBuff,
  CombatBuffAddOptions,
  CombatBuffContainer,
  CombatBuffDefinition,
  BuffLifecycleActions,
} from '../buffs/combatBuffs';
import type {
  ElementalInflictionOperation,
  ExistingElementalAttachment,
} from './elementalInfliction';
import type { InflictionElement } from '../../game-data/operatorDefinition';

export interface ElementalInflictionBuffCatalog<Key extends string> {
  getAttachmentElement(definition: CombatBuffDefinition<Key>): InflictionElement | null;
  getAttachment(element: InflictionElement): CombatBuffDefinition<Key>;
  getBurst(element: InflictionElement): CombatBuffDefinition<Key>;
  getCompoundStatus(
    consumedElement: InflictionElement,
    incomingElement: InflictionElement,
  ): CombatBuffDefinition<Key>;
}

const NATIVE_ELEMENT_VALUES: Readonly<Record<InflictionElement, number>> = {
  heat: 0,
  electric: 1,
  cryo: 2,
  nature: 3,
};

export interface ElementalInflictionStartedPayload {
  readonly element: InflictionElement;
  readonly layers: number;
}

export function createElementalAttachmentLifecycleActions<Key extends string>(
  element: InflictionElement,
  emitStarted: (payload: ElementalInflictionStartedPayload, buff: CombatBuff<Key>) => void,
): BuffLifecycleActions<Key> {
  return {
    afterEnhance: buff => {
      emitStarted({ element, layers: buff.enhanceCount }, buff);
    },
  };
}

/** Applies resolved elemental operations to the target's native-style Buff container. */
export class ElementalInflictionBuffAdapter<Key extends string> {
  #projectedAttachment: CombatBuff<Key> | null = null;

  constructor(
    readonly target: CombatBuffContainer<Key>,
    readonly sourceId: string,
    readonly catalog: ElementalInflictionBuffCatalog<Key>,
    readonly addOptions?: CombatBuffAddOptions,
  ) {}

  getExistingAttachment(): ExistingElementalAttachment | null {
    const match = this.findAttachment();
    this.#projectedAttachment = match?.buff ?? null;
    return match === undefined ? null : { element: match.element, layers: match.buff.enhanceCount };
  }

  apply(operation: ElementalInflictionOperation): void {
    switch (operation.kind) {
      case 'addAttachment':
        this.target.add(
          this.catalog.getAttachment(operation.element),
          this.sourceId,
          this.addOptions,
        );
        return;
      case 'triggerBurst':
        this.target.add(this.catalog.getBurst(operation.element), this.sourceId, this.addOptions);
        return;
      case 'consumeAttachment': {
        const projected = this.#projectedAttachment;
        if (
          projected === null ||
          this.catalog.getAttachmentElement(projected.definition) !== operation.attachment.element
        ) {
          throw new Error('projected elemental attachment no longer matches the target');
        }
        if (!projected.finish('ignite')) {
          throw new Error('projected elemental attachment could not be consumed');
        }
        this.#projectedAttachment = null;
        return;
      }
      case 'createCompoundStatus':
        this.target.add(
          this.catalog.getCompoundStatus(operation.consumedElement, operation.incomingElement),
          this.sourceId,
          {
            ...this.addOptions,
            blackboardValues: {
              ...this.addOptions?.blackboardValues,
              consumed_type: NATIVE_ELEMENT_VALUES[operation.consumedElement],
              consumed_layer: operation.consumedLayers,
              count: operation.consumedLayers,
            },
          },
        );
        return;
    }
  }

  private findAttachment():
    { readonly buff: CombatBuff<Key>; readonly element: InflictionElement } | undefined {
    const buff = this.target.findFirst(
      candidate => this.catalog.getAttachmentElement(candidate.definition) !== null,
    );
    if (buff === undefined) return undefined;
    const element = this.catalog.getAttachmentElement(buff.definition);
    if (element === null) {
      throw new Error('elemental attachment catalog changed during lookup');
    }
    return { buff, element };
  }
}
