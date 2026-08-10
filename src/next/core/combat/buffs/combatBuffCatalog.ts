/**
 * 外部 Buff 数据进入通用 Buff 运行时前的语义化目录边界。
 * 数据源必须先转换为这里支持的原语；未知原生行为不能以回调或静默缺省方式穿透。
 */
import {
  INFLICTION_ELEMENTS,
  type DamageType,
  type InflictionElement,
} from '../../game-data/operatorDefinition';
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

/** 目录动作可从常量或当前 Buff 黑板读取的数值。 */
export type CombatBuffCatalogNumberOperand = number | { readonly blackboardKey: string };

/** StoreAttributeValue 在来源实体上选择属性的方式。 */
export type CombatBuffCatalogAttributeSelector =
  | { readonly kind: 'specific'; readonly key: string }
  | { readonly kind: 'main' | 'secondary' | 'all' };

/** StoreAttributeValue 读取的原生属性聚合阶段，二者都必须排除 Converted 来源。 */
export type CombatBuffCatalogAttributeStage = 'armedNonConverted' | 'finalNonConverted';

/** catalog 核心向战斗装配层提出的属性读取请求。 */
export interface CombatBuffCatalogAttributeReadRequest {
  readonly target: 'source';
  readonly attribute: CombatBuffCatalogAttributeSelector;
  readonly stage: CombatBuffCatalogAttributeStage;
}

/** 外部 Buff 目录当前允许表达的生命周期动作。 */
export type CombatBuffCatalogAction =
  | { readonly kind: 'emitElementalInflictionStarted' }
  | { readonly kind: 'refreshAttributeModifierValues' }
  | {
      readonly kind: 'storeAttributeValue';
      readonly target: 'source';
      readonly attribute: CombatBuffCatalogAttributeSelector;
      readonly stage: CombatBuffCatalogAttributeStage;
      readonly useFloor: boolean;
      readonly divisor: CombatBuffCatalogNumberOperand;
      readonly multiplier: CombatBuffCatalogNumberOperand;
      readonly base: CombatBuffCatalogNumberOperand;
      readonly targetKey: string;
    }
  | {
      readonly kind: 'modifyBlackboard';
      readonly operation: 'assign' | 'add';
      readonly targetKey: string;
      readonly value: number | { readonly blackboardKey: string };
    }
  | {
      /** 触发法术爆发；伤害由运行时按目录 `spellBurst` 参数执行。 */
      readonly kind: 'triggerSpellBurst';
      readonly burstType: string;
    }
  | {
      /** 已确认对数值无影响的纯表现动作（动画/特效/声音/镜头等），`actionType` 记录原生类型名。 */
      readonly kind: 'visualOnly';
      readonly actionType: string;
    };

/** 法术爆发的伤害参数；从原生 `DamageAction` 与 `ReadSkillSettingData` 提取。 */
export interface CombatBuffSpellBurstDefinition {
  readonly burstType: string;
  /** 爆发伤害的元素类型（原生 damageType 归一化后的语义枚举）。 */
  readonly damageType: DamageType;
  /** 爆发倍率在 SkillSetting 中的 dataKey。 */
  readonly skillSettingDataKey: string;
  /** SkillSetting 列号（原生 1 基；运行时按列号减一取数组下标）。 */
  readonly skillSettingColumn: number;
  /** 原生 DamageAction 的基础倍率；被 SkillSetting 倍率覆盖，仅作证据保留。 */
  readonly atkScaleBase: number;
}

/** 目录 Buff 在各生命周期边界执行的动作集合。 */
export interface CombatBuffCatalogLifecycleActions {
  readonly start?: readonly CombatBuffCatalogAction[];
  readonly trigger?: readonly CombatBuffCatalogAction[];
  readonly enhanceChanged?: readonly CombatBuffCatalogAction[];
  readonly afterEnhance?: readonly CombatBuffCatalogAction[];
  readonly finish?: readonly CombatBuffCatalogAction[];
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
  /** 元素爆发 Buff 的伤害参数；非爆发条目省略。 */
  readonly spellBurst?: CombatBuffSpellBurstDefinition;
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
  /**
   * 读取动作来源实体的属性阶段值。实体定位、主副属性映射和排除 Converted 修正均由装配层负责；
   * catalog 编译器只负责 StoreAttributeValue 已确认的算式和当前 Buff 黑板生命周期。
   */
  readonly readAttribute?: (
    request: CombatBuffCatalogAttributeReadRequest,
    buff: CombatBuff<Key>,
  ) => number;
  /** 法术爆发触发端口；爆发 Buff 存在该动作时必须提供。 */
  readonly onSpellBurstTriggered?: (payload: {
    readonly burstType: string;
    readonly sourceId: string;
  }) => void;
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
  readonly #spellBursts = new Map<string, CombatBuffSpellBurstDefinition>();
  readonly #spellBurstBuffIds = new Map<string, string>();

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
    this.registerSpellBurst(entry.spellBurst, entry.id);
  }

  /** 按原生爆发类型查找爆发伤害参数；目录没有该爆发时返回 null。 */
  getSpellBurst(burstType: string): CombatBuffSpellBurstDefinition | null {
    return this.#spellBursts.get(burstType) ?? null;
  }

  private registerSpellBurst(
    definition: CombatBuffSpellBurstDefinition | undefined,
    buffId: string,
  ): void {
    if (definition === undefined) return;
    const existingBuff = this.#spellBurstBuffIds.get(definition.burstType);
    if (existingBuff !== undefined) {
      throw new Error(
        `spell burst '${definition.burstType}' is declared by both buffs '${existingBuff}' and '${buffId}'`,
      );
    }
    this.#spellBurstBuffIds.set(definition.burstType, buffId);
    this.#spellBursts.set(definition.burstType, definition);
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
    'spellBurst',
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
    ...parseOptionalSpellBurst(entry, path),
  };
}

function parseOptionalSpellBurst(
  entry: Readonly<Record<string, unknown>>,
  path: string,
): { spellBurst?: CombatBuffSpellBurstDefinition } {
  if (entry.spellBurst === undefined) return {};
  const burstPath = `${path}.spellBurst`;
  const burst = requireObject(entry.spellBurst, burstPath);
  requireOnlyKeys(burst, burstPath, [
    'burstType',
    'damageType',
    'skillSettingDataKey',
    'skillSettingColumn',
    'atkScaleBase',
  ]);
  const skillSettingColumn = requireFiniteNumber(
    burst.skillSettingColumn,
    `${burstPath}.skillSettingColumn`,
  );
  if (!Number.isInteger(skillSettingColumn) || skillSettingColumn < 1) {
    throw new Error(`${burstPath}.skillSettingColumn: expected positive integer`);
  }
  const atkScaleBase = requireFiniteNumber(burst.atkScaleBase, `${burstPath}.atkScaleBase`);
  if (atkScaleBase < 0) throw new Error(`${burstPath}.atkScaleBase: expected non-negative`);
  return {
    spellBurst: {
      burstType: requireNonEmptyString(burst.burstType, `${burstPath}.burstType`),
      damageType: requireNonEmptyString(burst.damageType, `${burstPath}.damageType`) as DamageType,
      skillSettingDataKey: requireNonEmptyString(
        burst.skillSettingDataKey,
        `${burstPath}.skillSettingDataKey`,
      ),
      skillSettingColumn,
      atkScaleBase,
    },
  };
}

function requireFiniteNumber(input: unknown, path: string): number {
  if (typeof input !== 'number' || !Number.isFinite(input)) {
    throw new Error(`${path}: expected finite number`);
  }
  return input;
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
  requireOnlyKeys(actions, actionsPath, [
    'start',
    'trigger',
    'enhanceChanged',
    'afterEnhance',
    'finish',
  ]);
  return {
    actions: {
      ...parseOptionalCatalogActionList(actions, 'start', actionsPath),
      ...parseOptionalCatalogActionList(actions, 'trigger', actionsPath),
      ...parseOptionalCatalogActionList(actions, 'enhanceChanged', actionsPath),
      ...parseOptionalCatalogActionList(actions, 'afterEnhance', actionsPath),
      ...parseOptionalCatalogActionList(actions, 'finish', actionsPath),
    },
  };
}

function parseOptionalCatalogActionList(
  actions: Readonly<Record<string, unknown>>,
  key: keyof CombatBuffCatalogLifecycleActions,
  path: string,
): Partial<CombatBuffCatalogLifecycleActions> {
  const input = actions[key];
  if (input === undefined) return {};
  if (!Array.isArray(input)) throw new Error(`${path}.${key}: expected array`);
  return {
    [key]: input.map((item, index) => {
      const actionPath = `${path}.${key}[${index}]`;
      const action = requireObject(item, actionPath);
      if (action.kind === 'modifyBlackboard') {
        requireOnlyKeys(action, actionPath, ['kind', 'operation', 'targetKey', 'value']);
        return {
          kind: action.kind,
          operation: requireEnum(
            action.operation,
            ['assign', 'add'] as const,
            `${actionPath}.operation`,
          ),
          targetKey: requireNonEmptyString(action.targetKey, `${actionPath}.targetKey`),
          value:
            typeof action.value === 'number' && Number.isFinite(action.value)
              ? action.value
              : parseBlackboardReference(action.value, `${actionPath}.value`),
        };
      }
      if (action.kind === 'storeAttributeValue') {
        requireOnlyKeys(action, actionPath, [
          'kind',
          'target',
          'attribute',
          'stage',
          'useFloor',
          'divisor',
          'multiplier',
          'base',
          'targetKey',
        ]);
        if (action.useFloor !== true && action.useFloor !== false) {
          throw new Error(`${actionPath}.useFloor: expected boolean`);
        }
        return {
          kind: action.kind,
          target: requireEnum(action.target, ['source'] as const, `${actionPath}.target`),
          attribute: parseStoreAttributeSelector(action.attribute, `${actionPath}.attribute`),
          stage: requireEnum(
            action.stage,
            ['armedNonConverted', 'finalNonConverted'] as const,
            `${actionPath}.stage`,
          ),
          useFloor: action.useFloor,
          divisor: parseCatalogNumberOperand(action.divisor, `${actionPath}.divisor`),
          multiplier: parseCatalogNumberOperand(action.multiplier, `${actionPath}.multiplier`),
          base: parseCatalogNumberOperand(action.base, `${actionPath}.base`),
          targetKey: requireNonEmptyString(action.targetKey, `${actionPath}.targetKey`),
        };
      }
      if (action.kind === 'triggerSpellBurst') {
        requireOnlyKeys(action, actionPath, ['kind', 'burstType']);
        return {
          kind: action.kind,
          burstType: requireNonEmptyString(action.burstType, `${actionPath}.burstType`),
        };
      }
      if (action.kind === 'visualOnly') {
        requireOnlyKeys(action, actionPath, ['kind', 'actionType']);
        return {
          kind: action.kind,
          actionType: requireNonEmptyString(action.actionType, `${actionPath}.actionType`),
        };
      }
      requireOnlyKeys(action, actionPath, ['kind']);
      if (action.kind === 'emitElementalInflictionStarted') return { kind: action.kind };
      if (action.kind === 'refreshAttributeModifierValues') return { kind: action.kind };
      throw new Error(`${actionPath}.kind: unknown value '${String(action.kind)}'`);
    }),
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

function parseStoreAttributeSelector(
  input: unknown,
  path: string,
): CombatBuffCatalogAttributeSelector {
  const selector = requireObject(input, path);
  const kind = requireNonEmptyString(selector.kind, `${path}.kind`);
  if (kind === 'specific') {
    requireOnlyKeys(selector, path, ['kind', 'key']);
    return { kind, key: requireNonEmptyString(selector.key, `${path}.key`) };
  }
  if (kind === 'main' || kind === 'secondary' || kind === 'all') {
    requireOnlyKeys(selector, path, ['kind']);
    return { kind };
  }
  throw new Error(`${path}.kind: unknown value '${kind}'`);
}

function parseCatalogNumberOperand(input: unknown, path: string): CombatBuffCatalogNumberOperand {
  return typeof input === 'number' && Number.isFinite(input)
    ? input
    : parseBlackboardReference(input, path);
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
  const actions = entry.actions;
  if (actions === undefined) return undefined;
  const start = compileCatalogActionList(entry, 'start', actions.start, ports);
  const trigger = compileCatalogActionList(entry, 'trigger', actions.trigger, ports);
  const enhanceChanged = compileCatalogActionList(
    entry,
    'enhanceChanged',
    actions.enhanceChanged,
    ports,
  );
  const afterEnhance = compileCatalogActionList(entry, 'afterEnhance', actions.afterEnhance, ports);
  const finish = compileCatalogActionList(entry, 'finish', actions.finish, ports);
  if (
    start.length === 0 &&
    trigger.length === 0 &&
    enhanceChanged.length === 0 &&
    afterEnhance.length === 0 &&
    finish.length === 0
  ) {
    return undefined;
  }
  return {
    ...(start.length === 0 ? {} : { start: createLifecycleHandler(start) }),
    ...(trigger.length === 0 ? {} : { trigger: createLifecycleHandler(trigger) }),
    ...(enhanceChanged.length === 0
      ? {}
      : { enhanceChanged: createLifecycleHandler(enhanceChanged) }),
    ...(afterEnhance.length === 0 ? {} : { afterEnhance: createLifecycleHandler(afterEnhance) }),
    ...(finish.length === 0 ? {} : { finish: createLifecycleHandler(finish) }),
  };
}

type CatalogActionHandler<Key extends string> = (buff: CombatBuff<Key>) => void;

function compileCatalogActionList<Key extends string>(
  entry: CombatBuffCatalogEntry,
  lifecycle: keyof CombatBuffCatalogLifecycleActions,
  actions: readonly CombatBuffCatalogAction[] | undefined,
  ports: CombatBuffCatalogCompilerPorts<Key>,
): readonly CatalogActionHandler<Key>[] {
  return (actions ?? []).map(action => {
    switch (action.kind) {
      case 'modifyBlackboard':
        return buff => modifyBuffBlackboard(buff, action);
      case 'refreshAttributeModifierValues':
        return buff => buff.refreshAttributeModifierValues();
      case 'storeAttributeValue': {
        const readAttribute = ports.readAttribute;
        if (readAttribute === undefined) {
          throw new Error(
            `buff '${entry.id}' stores an attribute value without a readAttribute port`,
          );
        }
        return buff => storeBuffAttributeValue(buff, action, readAttribute);
      }
      case 'emitElementalInflictionStarted': {
        if (lifecycle !== 'afterEnhance') {
          throw new Error(
            `buff '${entry.id}' emits elemental-infliction events from unsupported lifecycle '${lifecycle}'`,
          );
        }
        const role = entry.role;
        if (role?.kind !== 'elementalAttachment') {
          throw new Error(
            `buff '${entry.id}' emits elemental-infliction events without an elemental-attachment role`,
          );
        }
        const handler = createElementalAttachmentLifecycleActions(
          role.element,
          ports.emitElementalInflictionStarted,
        ).afterEnhance!;
        return buff => handler(buff, buff.sourceId);
      }
      case 'triggerSpellBurst': {
        const onSpellBurstTriggered = ports.onSpellBurstTriggered;
        if (onSpellBurstTriggered === undefined) {
          throw new Error(
            `buff '${entry.id}' triggers spell burst '${action.burstType}' without an onSpellBurstTriggered port`,
          );
        }
        return buff =>
          onSpellBurstTriggered({ burstType: action.burstType, sourceId: buff.sourceId });
      }
      case 'visualOnly':
        // 已确认的纯表现动作（动画/特效/声音/镜头/顿帧等），后端无数值作用。
        return () => undefined;
    }
  });
}

function storeBuffAttributeValue<Key extends string>(
  buff: CombatBuff<Key>,
  action: Extract<CombatBuffCatalogAction, { kind: 'storeAttributeValue' }>,
  readAttribute: NonNullable<CombatBuffCatalogCompilerPorts<Key>['readAttribute']>,
): void {
  const attributeValue = readAttribute(
    { target: action.target, attribute: action.attribute, stage: action.stage },
    buff,
  );
  // 原生仅在 useFloor 分支读取除数；关闭取整时缺失的 divisor 黑板键不应影响执行。
  const scaledAttribute = action.useFloor
    ? Math.floor(attributeValue / resolveBuffBlackboardOperand(buff, action.divisor))
    : attributeValue;
  const result =
    resolveBuffBlackboardOperand(buff, action.base) +
    scaledAttribute * resolveBuffBlackboardOperand(buff, action.multiplier);
  buff.blackboard.assignDynamic(action.targetKey, result);
  // StoreAttributeValue 写入后会通知当前 Buff，使依赖该黑板键的属性修正立即重建。
  buff.refreshAttributeModifierValues();
}

function modifyBuffBlackboard<Key extends string>(
  buff: CombatBuff<Key>,
  action: Extract<CombatBuffCatalogAction, { kind: 'modifyBlackboard' }>,
): void {
  const operand = resolveBuffBlackboardOperand(buff, action.value);
  if (action.operation === 'assign') {
    buff.blackboard.assignDynamic(action.targetKey, operand);
    return;
  }
  const snapshot = buff.blackboard.snapshot();
  const current = buff.blackboard.getNumber(action.targetKey);
  if (action.targetKey in snapshot && current === undefined) {
    throw new Error(
      `buff '${buff.definition.id}' blackboard target '${action.targetKey}' is not numeric`,
    );
  }
  buff.blackboard.assignDynamic(action.targetKey, (current ?? 0) + operand);
}

function resolveBuffBlackboardOperand<Key extends string>(
  buff: CombatBuff<Key>,
  value: number | { readonly blackboardKey: string },
): number {
  if (typeof value === 'number') return value;
  const operand = buff.blackboard.getNumber(value.blackboardKey);
  if (operand !== undefined) return operand;
  throw new Error(
    `buff '${buff.definition.id}' blackboard value '${value.blackboardKey}' is missing or not numeric`,
  );
}

function createLifecycleHandler<Key extends string>(
  handlers: readonly CatalogActionHandler<Key>[],
): CatalogActionHandler<Key> {
  return buff => {
    for (const handler of handlers) handler(buff);
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
