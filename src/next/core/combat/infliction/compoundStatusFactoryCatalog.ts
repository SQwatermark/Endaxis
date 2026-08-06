import { INFLICTION_ELEMENTS, type InflictionElement } from '../../game-data/operatorDefinition';
import type { ActionBlackboardValue } from '../runtime/actionBlackboard';

export const COMPOUND_STATUS_FACTORY_CATALOG_SCHEMA_VERSION = 1;

export type CompoundStatusFactoryScalar = number | { readonly blackboardKey: string };

export interface CompoundStatusSkillSettingLookup {
  readonly dataKey: string;
  readonly column: CompoundStatusFactoryScalar;
  readonly enhanceAttributeSource: 'source';
  readonly storeKey: string;
}

export interface CompoundStatusBlackboardAssignment {
  readonly targetKey: string;
  readonly inputKey: string;
}

export interface CompoundStatusFactoryEntry {
  readonly id: string;
  readonly consumedElement: InflictionElement;
  readonly incomingElement: InflictionElement;
  readonly durationSeconds: CompoundStatusFactoryScalar;
  readonly blackboard: Readonly<Record<string, ActionBlackboardValue>>;
  readonly skillSettingLookups: readonly CompoundStatusSkillSettingLookup[];
  readonly createdBuff: {
    readonly buffId: string;
    readonly blackboardAssignments: readonly CompoundStatusBlackboardAssignment[];
  };
}

export interface CompoundStatusFactoryCatalogDocument {
  readonly schemaVersion: typeof COMPOUND_STATUS_FACTORY_CATALOG_SCHEMA_VERSION;
  readonly revision: string;
  readonly factories: readonly CompoundStatusFactoryEntry[];
}

/** Strict boundary for generated compound-status recipes. */
export function parseCompoundStatusFactoryCatalog(
  input: unknown,
): CompoundStatusFactoryCatalogDocument {
  const root = requireObject(input, '$');
  requireOnlyKeys(root, '$', ['schemaVersion', 'revision', 'factories']);
  if (root.schemaVersion !== COMPOUND_STATUS_FACTORY_CATALOG_SCHEMA_VERSION) {
    throw new Error(`$.schemaVersion: expected ${COMPOUND_STATUS_FACTORY_CATALOG_SCHEMA_VERSION}`);
  }
  if (!Array.isArray(root.factories)) throw new Error('$.factories: expected array');

  const factories = root.factories.map((factory, index) =>
    parseFactory(factory, `$.factories[${index}]`),
  );
  validateUniqueFactories(factories);
  return {
    schemaVersion: COMPOUND_STATUS_FACTORY_CATALOG_SCHEMA_VERSION,
    revision: requireNonEmptyString(root.revision, '$.revision'),
    factories,
  };
}

function parseFactory(input: unknown, path: string): CompoundStatusFactoryEntry {
  const factory = requireObject(input, path);
  requireOnlyKeys(factory, path, [
    'id',
    'consumedElement',
    'incomingElement',
    'durationSeconds',
    'blackboard',
    'skillSettingLookups',
    'createdBuff',
  ]);
  const consumedElement = requireElement(factory.consumedElement, `${path}.consumedElement`);
  const incomingElement = requireElement(factory.incomingElement, `${path}.incomingElement`);
  if (consumedElement === incomingElement) {
    throw new Error(`${path}: compound status requires two different elements`);
  }
  if (!Array.isArray(factory.skillSettingLookups)) {
    throw new Error(`${path}.skillSettingLookups: expected array`);
  }

  return {
    id: requireNonEmptyString(factory.id, `${path}.id`),
    consumedElement,
    incomingElement,
    durationSeconds: parseScalar(factory.durationSeconds, `${path}.durationSeconds`),
    blackboard: parseBlackboard(factory.blackboard, `${path}.blackboard`),
    skillSettingLookups: factory.skillSettingLookups.map((lookup, index) =>
      parseLookup(lookup, `${path}.skillSettingLookups[${index}]`),
    ),
    createdBuff: parseCreatedBuff(factory.createdBuff, `${path}.createdBuff`),
  };
}

function parseLookup(input: unknown, path: string): CompoundStatusSkillSettingLookup {
  const lookup = requireObject(input, path);
  requireOnlyKeys(lookup, path, ['dataKey', 'column', 'enhanceAttributeSource', 'storeKey']);
  if (lookup.enhanceAttributeSource !== 'source') {
    throw new Error(`${path}.enhanceAttributeSource: expected 'source'`);
  }
  return {
    dataKey: requireNonEmptyString(lookup.dataKey, `${path}.dataKey`),
    column: parseScalar(lookup.column, `${path}.column`),
    enhanceAttributeSource: 'source',
    storeKey: requireNonEmptyString(lookup.storeKey, `${path}.storeKey`),
  };
}

function parseCreatedBuff(input: unknown, path: string): CompoundStatusFactoryEntry['createdBuff'] {
  const createdBuff = requireObject(input, path);
  requireOnlyKeys(createdBuff, path, ['buffId', 'blackboardAssignments']);
  if (!Array.isArray(createdBuff.blackboardAssignments)) {
    throw new Error(`${path}.blackboardAssignments: expected array`);
  }
  return {
    buffId: requireNonEmptyString(createdBuff.buffId, `${path}.buffId`),
    blackboardAssignments: createdBuff.blackboardAssignments.map((assignment, index) => {
      const assignmentPath = `${path}.blackboardAssignments[${index}]`;
      const value = requireObject(assignment, assignmentPath);
      requireOnlyKeys(value, assignmentPath, ['targetKey', 'inputKey']);
      return {
        targetKey: requireNonEmptyString(value.targetKey, `${assignmentPath}.targetKey`),
        inputKey: requireNonEmptyString(value.inputKey, `${assignmentPath}.inputKey`),
      };
    }),
  };
}

function parseScalar(input: unknown, path: string): CompoundStatusFactoryScalar {
  if (typeof input === 'number' && Number.isFinite(input)) return input;
  const reference = requireObject(input, path);
  requireOnlyKeys(reference, path, ['blackboardKey']);
  return {
    blackboardKey: requireNonEmptyString(reference.blackboardKey, `${path}.blackboardKey`),
  };
}

function parseBlackboard(
  input: unknown,
  path: string,
): Readonly<Record<string, ActionBlackboardValue>> {
  const blackboard = requireObject(input, path);
  for (const [key, value] of Object.entries(blackboard)) {
    if (value === null || typeof value === 'string') continue;
    if (typeof value === 'number' && Number.isFinite(value)) continue;
    throw new Error(`${path}.${key}: expected finite number, string, or null`);
  }
  return blackboard as Readonly<Record<string, ActionBlackboardValue>>;
}

function validateUniqueFactories(factories: readonly CompoundStatusFactoryEntry[]): void {
  const ids = new Set<string>();
  const pairs = new Set<string>();
  for (const factory of factories) {
    if (ids.has(factory.id)) throw new Error(`duplicate compound-status factory '${factory.id}'`);
    ids.add(factory.id);
    const pair = `${factory.consumedElement}:${factory.incomingElement}`;
    if (pairs.has(pair)) throw new Error(`duplicate compound-status factory pair '${pair}'`);
    pairs.add(pair);
  }
}

function requireElement(input: unknown, path: string): InflictionElement {
  if (!isInflictionElement(input)) {
    throw new Error(`${path}: unknown element '${String(input)}'`);
  }
  return input;
}

function isInflictionElement(input: unknown): input is InflictionElement {
  return INFLICTION_ELEMENTS.some(element => element === input);
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
  keys: readonly string[],
): void {
  const allowed = new Set(keys);
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
