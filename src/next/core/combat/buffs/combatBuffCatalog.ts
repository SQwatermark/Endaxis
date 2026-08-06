import type { InflictionElement } from '../../game-data/operatorDefinition';
import type { ActionBlackboardValue } from '../runtime/actionBlackboard';
import type {
  BuffDuration,
  BuffLifecycleActions,
  BuffStackingType,
  BuffTriggerCount,
  CombatBuff,
  CombatBuffDefinition,
} from './combatBuffs';
import type {
  ElementalInflictionBuffCatalog,
  ElementalInflictionStartedPayload,
} from '../infliction/elementalInflictionBuffAdapter';
import { createElementalAttachmentLifecycleActions } from '../infliction/elementalInflictionBuffAdapter';

export const COMBAT_BUFF_CATALOG_SCHEMA_VERSION = 1 as const;

export type CombatBuffSemanticRole =
  | { readonly kind: 'elementalAttachment'; readonly element: InflictionElement }
  | { readonly kind: 'elementalBurst'; readonly element: InflictionElement }
  | {
      readonly kind: 'compoundStatus';
      readonly consumedElement: InflictionElement;
      readonly incomingElement: InflictionElement;
    };

export type CombatBuffCatalogAction = { readonly kind: 'emitElementalInflictionStarted' };

export interface CombatBuffCatalogLifecycleActions {
  readonly afterEnhance?: readonly CombatBuffCatalogAction[];
}

/**
 * Stable, data-only representation emitted by the game-data extraction boundary.
 * Native table shapes and executable callbacks must not cross this boundary.
 */
export interface CombatBuffCatalogEntry {
  readonly id: string;
  readonly stackingType: BuffStackingType;
  readonly stackingKey?: string;
  readonly maxStackCount?: number;
  readonly durationSeconds?: BuffDuration;
  readonly triggerIntervalSeconds?: BuffDuration;
  readonly waitFirstTriggerInterval?: boolean;
  readonly maxTriggerCount?: BuffTriggerCount;
  readonly blackboard?: Readonly<Record<string, ActionBlackboardValue>>;
  readonly role?: CombatBuffSemanticRole;
  readonly actions?: CombatBuffCatalogLifecycleActions;
}

export interface CombatBuffCatalogDocument {
  readonly schemaVersion: typeof COMBAT_BUFF_CATALOG_SCHEMA_VERSION;
  readonly revision: string;
  readonly buffs: readonly CombatBuffCatalogEntry[];
}

export interface CombatBuffCatalogCompilerPorts<Key extends string> {
  readonly emitElementalInflictionStarted: (
    payload: ElementalInflictionStartedPayload,
    buff: CombatBuff<Key>,
  ) => void;
}

/** Compiled lookup used by the elemental-infliction runtime adapter. */
export class CompiledCombatBuffCatalog<
  Key extends string,
> implements ElementalInflictionBuffCatalog<Key> {
  readonly #definitions = new Map<string, CombatBuffDefinition<Key>>();
  readonly #attachmentElements = new Map<CombatBuffDefinition<Key>, InflictionElement>();
  readonly #attachments = new Map<InflictionElement, CombatBuffDefinition<Key>>();
  readonly #bursts = new Map<InflictionElement, CombatBuffDefinition<Key>>();
  readonly #compoundStatuses = new Map<string, CombatBuffDefinition<Key>>();

  constructor(
    readonly revision: string,
    entries: readonly CombatBuffCatalogEntry[],
    ports: CombatBuffCatalogCompilerPorts<Key>,
  ) {
    for (const entry of entries) this.register(entry, ports);
  }

  get(id: string): CombatBuffDefinition<Key> | undefined {
    return this.#definitions.get(id);
  }

  getAttachmentElement(definition: CombatBuffDefinition<Key>): InflictionElement | null {
    return this.#attachmentElements.get(definition) ?? null;
  }

  getAttachment(element: InflictionElement): CombatBuffDefinition<Key> {
    return requireRole(this.#attachments, element, `elemental attachment '${element}'`);
  }

  getBurst(element: InflictionElement): CombatBuffDefinition<Key> {
    return requireRole(this.#bursts, element, `elemental burst '${element}'`);
  }

  getCompoundStatus(
    consumedElement: InflictionElement,
    incomingElement: InflictionElement,
  ): CombatBuffDefinition<Key> {
    const key = compoundStatusKey(consumedElement, incomingElement);
    return requireRole(
      this.#compoundStatuses,
      key,
      `compound status '${consumedElement}->${incomingElement}'`,
    );
  }

  private register(
    entry: CombatBuffCatalogEntry,
    ports: CombatBuffCatalogCompilerPorts<Key>,
  ): void {
    if (entry.id.length === 0) throw new Error('buff catalog entry id must not be empty');
    if (this.#definitions.has(entry.id)) {
      throw new Error(`duplicate buff catalog entry '${entry.id}'`);
    }
    const definition: CombatBuffDefinition<Key> = {
      id: entry.id,
      stackingType: entry.stackingType,
      stackingKey: entry.stackingKey,
      maxStackCount: entry.maxStackCount,
      durationSeconds: entry.durationSeconds,
      triggerIntervalSeconds: entry.triggerIntervalSeconds,
      waitFirstTriggerInterval: entry.waitFirstTriggerInterval,
      maxTriggerCount: entry.maxTriggerCount,
      blackboard: entry.blackboard,
      actions: compileLifecycleActions(entry, ports),
    };
    this.#definitions.set(entry.id, definition);
    this.registerRole(entry.role, definition);
  }

  private registerRole(
    role: CombatBuffSemanticRole | undefined,
    definition: CombatBuffDefinition<Key>,
  ): void {
    if (role === undefined) return;
    switch (role.kind) {
      case 'elementalAttachment':
        registerUniqueRole(this.#attachments, role.element, definition, role.kind);
        this.#attachmentElements.set(definition, role.element);
        return;
      case 'elementalBurst':
        registerUniqueRole(this.#bursts, role.element, definition, role.kind);
        return;
      case 'compoundStatus': {
        const key = compoundStatusKey(role.consumedElement, role.incomingElement);
        registerUniqueRole(this.#compoundStatuses, key, definition, role.kind);
        return;
      }
    }
  }
}

export function compileCombatBuffCatalog<Key extends string>(
  document: CombatBuffCatalogDocument,
  ports: CombatBuffCatalogCompilerPorts<Key>,
): CompiledCombatBuffCatalog<Key> {
  if (document.schemaVersion !== COMBAT_BUFF_CATALOG_SCHEMA_VERSION) {
    throw new Error(`unsupported combat buff catalog schema version '${document.schemaVersion}'`);
  }
  if (document.revision.length === 0) throw new Error('buff catalog revision must not be empty');
  return new CompiledCombatBuffCatalog(document.revision, document.buffs, ports);
}

function compileLifecycleActions<Key extends string>(
  entry: CombatBuffCatalogEntry,
  ports: CombatBuffCatalogCompilerPorts<Key>,
): BuffLifecycleActions<Key> | undefined {
  const actions = entry.actions?.afterEnhance;
  if (actions === undefined || actions.length === 0) return undefined;
  const role = entry.role;
  if (role?.kind !== 'elementalAttachment') {
    throw new Error(
      `buff '${entry.id}' emits elemental-infliction events without an elemental-attachment role`,
    );
  }
  const handlers = actions.map(action => {
    switch (action.kind) {
      case 'emitElementalInflictionStarted':
        return createElementalAttachmentLifecycleActions(
          role.element,
          ports.emitElementalInflictionStarted,
        ).afterEnhance!;
    }
  });
  return {
    afterEnhance: (buff, sourceId) => {
      for (const handler of handlers) handler(buff, sourceId);
    },
  };
}

function compoundStatusKey(
  consumedElement: InflictionElement,
  incomingElement: InflictionElement,
): string {
  return `${consumedElement}->${incomingElement}`;
}

function registerUniqueRole<Key, Attribute extends string>(
  entries: Map<Key, CombatBuffDefinition<Attribute>>,
  key: Key,
  definition: CombatBuffDefinition<Attribute>,
  role: CombatBuffSemanticRole['kind'],
): void {
  const existing = entries.get(key);
  if (existing !== undefined) {
    throw new Error(
      `buff catalog role '${role}' is assigned to both '${existing.id}' and '${definition.id}'`,
    );
  }
  entries.set(key, definition);
}

function requireRole<Key, Attribute extends string>(
  entries: ReadonlyMap<Key, CombatBuffDefinition<Attribute>>,
  key: Key,
  label: string,
): CombatBuffDefinition<Attribute> {
  const definition = entries.get(key);
  if (definition === undefined) throw new Error(`buff catalog is missing ${label}`);
  return definition;
}
