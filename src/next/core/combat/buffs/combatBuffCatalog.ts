/**
 * 外部 Buff 数据进入通用 Buff 运行时前的语义化目录边界。
 * 数据源必须先转换为这里支持的原语；未知原生行为不能以回调或静默缺省方式穿透。
 */
import { INFLICTION_ELEMENTS, type InflictionElement } from '../../game-data/operatorDefinition';
import type { ActionBlackboardValue } from '../runtime/actionBlackboard';
import type {
  BuffDuration,
  BuffLifecycleActions,
  BuffPriority,
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
import { gameplayTagId } from '../tags/gameplayTags';
import {
  ATTRIBUTE_MODIFIER_SLOTS,
  attributeModifierValues,
  type AttributeModifierSlot,
} from '../attributes/combatAttributes';

export const COMBAT_BUFF_CATALOG_SCHEMA_VERSION = 1 as const;

/** 核心能够理解并交给专用适配器处理的 Buff 语义角色。 */
export type CombatBuffSemanticRole =
  | { readonly kind: 'elementalAttachment'; readonly element: InflictionElement }
  | { readonly kind: 'elementalBurst'; readonly element: InflictionElement }
  | {
      readonly kind: 'compoundStatus';
      readonly consumedElement: InflictionElement;
      readonly incomingElement: InflictionElement;
    };

/** 外部 Buff 目录当前允许表达的生命周期动作。 */
export type CombatBuffCatalogAction = { readonly kind: 'emitElementalInflictionStarted' };

/** 目录 Buff 在各生命周期边界执行的动作集合。 */
export interface CombatBuffCatalogLifecycleActions {
  readonly afterEnhance?: readonly CombatBuffCatalogAction[];
}

/** 外部目录中一项可序列化的原生八槽属性修正。 */
export interface CombatBuffCatalogAttributeModifier {
  readonly attribute: string;
  readonly slot: AttributeModifierSlot;
  readonly value: number | { readonly blackboardKey: string };
}

/**
 * 游戏数据提取边界输出的稳定纯数据表示。
 * 原生表结构和可执行回调不得跨越此边界。
 */
/** 外部目录中的一项稳定 Buff 定义。 */
export interface CombatBuffCatalogEntry {
  readonly id: string;
  /** 解包数据中的原始有符号 int32 applyTags。 */
  readonly applyTagIds?: readonly number[];
  /** Buff 被延长动作阻止结束后，临时注册到所属实体的原始标签。 */
  readonly extendTagIds?: readonly number[];
  readonly stackingType: BuffStackingType;
  readonly stackingKey?: string;
  readonly priority?: BuffPriority;
  readonly maxStackCount?: number;
  readonly durationSeconds?: BuffDuration;
  readonly triggerIntervalSeconds?: BuffDuration;
  readonly waitFirstTriggerInterval?: boolean;
  readonly maxTriggerCount?: BuffTriggerCount;
  readonly blackboard?: Readonly<Record<string, ActionBlackboardValue>>;
  readonly attributeModifiers?: readonly CombatBuffCatalogAttributeModifier[];
  readonly role?: CombatBuffSemanticRole;
  readonly actions?: CombatBuffCatalogLifecycleActions;
}

/** 带 schema 版本的外部 Buff 目录文档。 */
export interface CombatBuffCatalogDocument {
  readonly schemaVersion: typeof COMBAT_BUFF_CATALOG_SCHEMA_VERSION;
  readonly revision: string;
  readonly buffs: readonly CombatBuffCatalogEntry[];
}

/** 把目录语义角色和动作编译为核心定义时使用的受控端口。 */
export interface CombatBuffCatalogCompilerPorts<Key extends string> {
  readonly emitElementalInflictionStarted: (
    payload: ElementalInflictionStartedPayload,
    buff: CombatBuff<Key>,
  ) => void;
}

/** 元素附着运行时适配器使用的已编译索引。 */
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
      applyTags: entry.applyTagIds?.map(gameplayTagId),
      extendTags: entry.extendTagIds?.map(gameplayTagId),
      stackingType: entry.stackingType,
      stackingKey: entry.stackingKey,
      priority: entry.priority,
      maxStackCount: entry.maxStackCount,
      durationSeconds: entry.durationSeconds,
      triggerIntervalSeconds: entry.triggerIntervalSeconds,
      waitFirstTriggerInterval: entry.waitFirstTriggerInterval,
      maxTriggerCount: entry.maxTriggerCount,
      blackboard: entry.blackboard,
      attributeModifiers: entry.attributeModifiers?.map(modifier => ({
        attribute: modifier.attribute as Key,
        values:
          typeof modifier.value === 'number'
            ? attributeModifierValues(modifier.slot, modifier.value)
            : { slot: modifier.slot, blackboardKey: modifier.value.blackboardKey },
        timing: 'runtime',
      })),
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

/** 生成或外部存储的语义目录进入核心前的严格 JSON 边界。 */
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
    'applyTagIds',
    'extendTagIds',
    'stackingType',
    'stackingKey',
    'priority',
    'maxStackCount',
    'durationSeconds',
    'triggerIntervalSeconds',
    'waitFirstTriggerInterval',
    'maxTriggerCount',
    'blackboard',
    'attributeModifiers',
    'role',
    'actions',
  ]);
  const stackingType = requireEnum(entry.stackingType, BUFF_STACKING_TYPES, `${path}.stackingType`);
  return {
    id: requireNonEmptyString(entry.id, `${path}.id`),
    ...parseOptionalGameplayTagIds(entry, 'applyTagIds', path),
    ...parseOptionalGameplayTagIds(entry, 'extendTagIds', path),
    stackingType,
    ...parseOptionalString(entry, 'stackingKey', path),
    ...parseOptionalPriority(entry, path),
    ...parseOptionalNonNegativeInteger(entry, 'maxStackCount', path),
    ...parseOptionalScalar(entry, 'durationSeconds', path),
    ...parseOptionalScalar(entry, 'triggerIntervalSeconds', path),
    ...parseOptionalBoolean(entry, 'waitFirstTriggerInterval', path),
    ...parseOptionalTriggerCount(entry, path),
    ...parseOptionalBlackboard(entry, path),
    ...parseOptionalAttributeModifiers(entry, path),
    ...parseOptionalRole(entry, path),
    ...parseOptionalActions(entry, path),
  };
}

function parseOptionalAttributeModifiers(
  entry: Readonly<Record<string, unknown>>,
  path: string,
): { attributeModifiers?: readonly CombatBuffCatalogAttributeModifier[] } {
  if (entry.attributeModifiers === undefined) return {};
  if (!Array.isArray(entry.attributeModifiers)) {
    throw new Error(`${path}.attributeModifiers: expected array`);
  }
  return {
    attributeModifiers: entry.attributeModifiers.map((input, index) => {
      const modifierPath = `${path}.attributeModifiers[${index}]`;
      const modifier = requireObject(input, modifierPath);
      requireOnlyKeys(modifier, modifierPath, ['attribute', 'slot', 'value']);
      const rawValue = modifier.value;
      const value =
        typeof rawValue === 'number' && Number.isFinite(rawValue)
          ? rawValue
          : parseBlackboardReference(rawValue, `${modifierPath}.value`);
      return {
        attribute: requireNonEmptyString(modifier.attribute, `${modifierPath}.attribute`),
        slot: requireEnum(modifier.slot, ATTRIBUTE_MODIFIER_SLOTS, `${modifierPath}.slot`),
        value,
      };
    }),
  };
}

function parseOptionalGameplayTagIds(
  entry: Readonly<Record<string, unknown>>,
  key: 'applyTagIds' | 'extendTagIds',
  path: string,
): Partial<Pick<CombatBuffCatalogEntry, typeof key>> {
  if (entry[key] === undefined) return {};
  if (!Array.isArray(entry[key])) {
    throw new Error(`${path}.${key}: expected array`);
  }
  return {
    [key]: entry[key].map((value, index) => {
      try {
        return gameplayTagId(value as number);
      } catch {
        throw new Error(`${path}.${key}[${index}]: expected signed 32-bit integer`);
      }
    }),
  } as Partial<Pick<CombatBuffCatalogEntry, typeof key>>;
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

function parseOptionalPriority(
  entry: Readonly<Record<string, unknown>>,
  path: string,
): { priority?: BuffPriority } {
  if (entry.priority === undefined) return {};
  if (typeof entry.priority === 'number' && Number.isFinite(entry.priority)) {
    return { priority: entry.priority };
  }
  const priorityPath = `${path}.priority`;
  const priority = requireObject(entry.priority, priorityPath);
  requireOnlyKeys(priority, priorityPath, ['blackboardKey', 'negate']);
  if (priority.negate !== undefined && typeof priority.negate !== 'boolean') {
    throw new Error(`${priorityPath}.negate: expected boolean`);
  }
  return {
    priority: {
      blackboardKey: requireNonEmptyString(priority.blackboardKey, `${priorityPath}.blackboardKey`),
      ...(priority.negate === undefined ? {} : { negate: priority.negate }),
    },
  };
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
