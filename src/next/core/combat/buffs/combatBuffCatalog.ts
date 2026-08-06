import { INFLICTION_ELEMENTS, type InflictionElement } from '../../game-data/operatorDefinition';
import type { ActionBlackboardValue } from '../runtime/actionBlackboard';
import type {
  BuffDuration,
  BuffLifecycleActions,
  BuffStackingType,
  BuffTriggerCount,
  CombatBuff,
  CombatBuffDefinition,
} from './combatBuffs';
import { BUFF_STACKING_TYPES } from './combatBuffs';
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

/** Strict JSON boundary for generated or externally stored semantic catalogs. */
export function parseCombatBuffCatalogDocument(input: unknown): CombatBuffCatalogDocument {
  const root = requireObject(input, '$');
  requireOnlyKeys(root, '$', ['schemaVersion', 'revision', 'buffs']);
  if (root.schemaVersion !== COMBAT_BUFF_CATALOG_SCHEMA_VERSION) {
    throw new Error(`$.schemaVersion: expected ${COMBAT_BUFF_CATALOG_SCHEMA_VERSION}`);
  }
  const revision = requireNonEmptyString(root.revision, '$.revision');
  if (!Array.isArray(root.buffs)) throw new Error('$.buffs: expected array');
  return {
    schemaVersion: COMBAT_BUFF_CATALOG_SCHEMA_VERSION,
    revision,
    buffs: root.buffs.map((entry, index) => parseCatalogEntry(entry, `$.buffs[${index}]`)),
  };
}

function parseCatalogEntry(input: unknown, path: string): CombatBuffCatalogEntry {
  const entry = requireObject(input, path);
  requireOnlyKeys(entry, path, [
    'id',
    'stackingType',
    'stackingKey',
    'maxStackCount',
    'durationSeconds',
    'triggerIntervalSeconds',
    'waitFirstTriggerInterval',
    'maxTriggerCount',
    'blackboard',
    'role',
    'actions',
  ]);
  const stackingType = requireEnum(entry.stackingType, BUFF_STACKING_TYPES, `${path}.stackingType`);
  return {
    id: requireNonEmptyString(entry.id, `${path}.id`),
    stackingType,
    ...parseOptionalString(entry, 'stackingKey', path),
    ...parseOptionalNonNegativeInteger(entry, 'maxStackCount', path),
    ...parseOptionalScalar(entry, 'durationSeconds', path),
    ...parseOptionalScalar(entry, 'triggerIntervalSeconds', path),
    ...parseOptionalBoolean(entry, 'waitFirstTriggerInterval', path),
    ...parseOptionalTriggerCount(entry, path),
    ...parseOptionalBlackboard(entry, path),
    ...parseOptionalRole(entry, path),
    ...parseOptionalActions(entry, path),
  };
}

function parseOptionalRole(
  entry: Readonly<Record<string, unknown>>,
  path: string,
): { role?: CombatBuffSemanticRole } {
  if (entry.role === undefined) return {};
  const rolePath = `${path}.role`;
  const role = requireObject(entry.role, rolePath);
  const kind = requireNonEmptyString(role.kind, `${rolePath}.kind`);
  switch (kind) {
    case 'elementalAttachment':
    case 'elementalBurst':
      requireOnlyKeys(role, rolePath, ['kind', 'element']);
      return {
        role: {
          kind,
          element: requireEnum(role.element, INFLICTION_ELEMENTS, `${rolePath}.element`),
        },
      };
    case 'compoundStatus':
      requireOnlyKeys(role, rolePath, ['kind', 'consumedElement', 'incomingElement']);
      return {
        role: {
          kind,
          consumedElement: requireEnum(
            role.consumedElement,
            INFLICTION_ELEMENTS,
            `${rolePath}.consumedElement`,
          ),
          incomingElement: requireEnum(
            role.incomingElement,
            INFLICTION_ELEMENTS,
            `${rolePath}.incomingElement`,
          ),
        },
      };
    default:
      throw new Error(`${rolePath}.kind: unknown value '${kind}'`);
  }
}

function parseOptionalActions(
  entry: Readonly<Record<string, unknown>>,
  path: string,
): { actions?: CombatBuffCatalogLifecycleActions } {
  if (entry.actions === undefined) return {};
  const actionsPath = `${path}.actions`;
  const actions = requireObject(entry.actions, actionsPath);
  requireOnlyKeys(actions, actionsPath, ['afterEnhance']);
  if (!Array.isArray(actions.afterEnhance)) {
    throw new Error(`${actionsPath}.afterEnhance: expected array`);
  }
  return {
    actions: {
      afterEnhance: actions.afterEnhance.map((input, index) => {
        const actionPath = `${actionsPath}.afterEnhance[${index}]`;
        const action = requireObject(input, actionPath);
        requireOnlyKeys(action, actionPath, ['kind']);
        if (action.kind !== 'emitElementalInflictionStarted') {
          throw new Error(`${actionPath}.kind: unknown value '${String(action.kind)}'`);
        }
        return { kind: action.kind };
      }),
    },
  };
}

function parseOptionalBlackboard(
  entry: Readonly<Record<string, unknown>>,
  path: string,
): { blackboard?: Readonly<Record<string, ActionBlackboardValue>> } {
  if (entry.blackboard === undefined) return {};
  const blackboard = requireObject(entry.blackboard, `${path}.blackboard`);
  for (const [key, value] of Object.entries(blackboard)) {
    if (value === null || typeof value === 'string') continue;
    if (typeof value === 'number' && Number.isFinite(value)) continue;
    throw new Error(`${path}.blackboard.${key}: expected finite number, string, or null`);
  }
  return { blackboard: blackboard as Readonly<Record<string, ActionBlackboardValue>> };
}

function parseOptionalTriggerCount(
  entry: Readonly<Record<string, unknown>>,
  path: string,
): { maxTriggerCount?: BuffTriggerCount } {
  if (entry.maxTriggerCount === undefined) return {};
  if (typeof entry.maxTriggerCount === 'number') {
    if (!Number.isSafeInteger(entry.maxTriggerCount)) {
      throw new Error(`${path}.maxTriggerCount: expected safe integer`);
    }
    return { maxTriggerCount: entry.maxTriggerCount };
  }
  return {
    maxTriggerCount: parseBlackboardReference(entry.maxTriggerCount, `${path}.maxTriggerCount`),
  };
}

function parseOptionalScalar(
  entry: Readonly<Record<string, unknown>>,
  key: 'durationSeconds' | 'triggerIntervalSeconds',
  path: string,
): Partial<Pick<CombatBuffCatalogEntry, typeof key>> {
  const value = entry[key];
  if (value === undefined) return {};
  if (typeof value === 'number' && Number.isFinite(value)) return { [key]: value };
  return { [key]: parseBlackboardReference(value, `${path}.${key}`) };
}

function parseBlackboardReference(input: unknown, path: string): { blackboardKey: string } {
  const reference = requireObject(input, path);
  requireOnlyKeys(reference, path, ['blackboardKey']);
  return { blackboardKey: requireNonEmptyString(reference.blackboardKey, `${path}.blackboardKey`) };
}

function parseOptionalString(
  entry: Readonly<Record<string, unknown>>,
  key: 'stackingKey',
  path: string,
): Partial<Pick<CombatBuffCatalogEntry, typeof key>> {
  if (entry[key] === undefined) return {};
  return { [key]: requireNonEmptyString(entry[key], `${path}.${key}`) };
}

function parseOptionalBoolean(
  entry: Readonly<Record<string, unknown>>,
  key: 'waitFirstTriggerInterval',
  path: string,
): Partial<Pick<CombatBuffCatalogEntry, typeof key>> {
  if (entry[key] === undefined) return {};
  if (typeof entry[key] !== 'boolean') throw new Error(`${path}.${key}: expected boolean`);
  return { [key]: entry[key] };
}

function parseOptionalNonNegativeInteger(
  entry: Readonly<Record<string, unknown>>,
  key: 'maxStackCount',
  path: string,
): Partial<Pick<CombatBuffCatalogEntry, typeof key>> {
  if (entry[key] === undefined) return {};
  if (!Number.isSafeInteger(entry[key]) || (entry[key] as number) < 0) {
    throw new Error(`${path}.${key}: expected non-negative safe integer`);
  }
  return { [key]: entry[key] as number };
}

function requireObject(input: unknown, path: string): Readonly<Record<string, unknown>> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error(`${path}: expected object`);
  }
  return input as Readonly<Record<string, unknown>>;
}

function requireOnlyKeys(
  input: Readonly<Record<string, unknown>>,
  path: string,
  allowedKeys: readonly string[],
): void {
  const allowed = new Set(allowedKeys);
  for (const key of Object.keys(input)) {
    if (!allowed.has(key)) throw new Error(`${path}: unknown property '${key}'`);
  }
}

function requireNonEmptyString(input: unknown, path: string): string {
  if (typeof input !== 'string' || input.length === 0) {
    throw new Error(`${path}: expected non-empty string`);
  }
  return input;
}

function requireEnum<const Values extends readonly string[]>(
  input: unknown,
  values: Values,
  path: string,
): Values[number] {
  if (typeof input !== 'string' || !values.includes(input)) {
    throw new Error(`${path}: unknown value '${String(input)}'`);
  }
  return input;
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
