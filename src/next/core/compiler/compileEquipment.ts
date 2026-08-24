/**
 * 武器词条、装备词条与套装贡献进入面板/战斗装配层前的编译边界。
 * 这里只解析等级值并保留来源，不负责计算面板，也不把贡献装进可变战斗状态。
 */
import type {
  EquipmentContributionDefinition,
  EquipmentDamageScaleTarget,
  EquipmentEventHandlerDefinition,
  EquipmentModifierDefinition,
  EquipmentPanelStat,
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../game-data/equipmentDefinition';
import type {
  CombatCondition,
  CombatEventTrigger,
  DamageType,
  OperatorAttribute,
  SkillType,
} from '../game-data/operatorDefinition';
import type { ResolvedActionSequence } from './combatProgram';
import { compileActionSequence } from './compileSkill';

/** 一项编译结果来自哪件定义对象及其中哪条能力。 */
export type EquipmentContributionSource =
  | { readonly kind: 'weaponTrait'; readonly slug: string; readonly traitKey: string }
  | { readonly kind: 'gearTrait'; readonly slug: string; readonly traitKey: string }
  | { readonly kind: 'gearSet'; readonly slug: string };

/** 等级值已展开、可交给 Build Resolver 聚合的常驻修正。 */
export type ResolvedEquipmentModifier =
  | {
      readonly kind: 'attribute';
      readonly attribute: OperatorAttribute;
      readonly operation: 'flat' | 'percent';
      readonly value: number;
    }
  | {
      readonly kind: 'panelStat';
      readonly stat: EquipmentPanelStat;
      readonly value: number;
    }
  | {
      readonly kind: 'damageBonus';
      readonly damageTypes: DamageType | readonly DamageType[];
      readonly skillTypes?: SkillType | readonly SkillType[];
      readonly value: number;
    }
  | {
      readonly kind: 'damageScale';
      readonly target: EquipmentDamageScaleTarget;
      readonly value: number;
    }
  | {
      readonly kind: 'staticHealingIncrease';
      readonly target: 'output' | 'taken';
      readonly value: number;
    };

/** 动作序列已解析，但尚未注册到事件总线的一项配装监听器。 */
export interface CompiledEquipmentEventHandler {
  readonly key: string;
  readonly event: CombatEventTrigger;
  readonly condition?: CombatCondition;
  /** 编译器始终写入；可选只为兼容外部测试/装配端口的空黑板记录。 */
  readonly blackboard?: Readonly<Record<string, number>>;
  readonly sequence: ResolvedActionSequence;
}

/** 单个定义能力的解析结果；来源身份供面板明细、诊断和卸载使用。 */
export interface CompiledEquipmentContribution {
  readonly source: EquipmentContributionSource;
  readonly selectedLevel: number;
  readonly modifiers: readonly ResolvedEquipmentModifier[];
  readonly eventHandlers: readonly CompiledEquipmentEventHandler[];
}

/** 解析装备中 `main`、`secondary` 相对属性所需的干员构筑上下文。 */
export interface EquipmentAttributeContext {
  readonly main: OperatorAttribute;
  readonly secondary: OperatorAttribute;
}

function resolveLevelValue(value: number | readonly number[], level: number, path: string): number {
  const resolved = typeof value === 'number' ? value : value[level - 1];
  if (resolved === undefined) throw new RangeError(`${path} has no value for level ${level}`);
  if (!Number.isFinite(resolved)) throw new TypeError(`${path} must resolve to a finite number`);
  return resolved;
}

function compileModifier(
  modifier: EquipmentModifierDefinition,
  level: number,
  path: string,
  attributes: EquipmentAttributeContext,
): ResolvedEquipmentModifier {
  const value = resolveLevelValue(modifier.value, level, `${path}.value`);
  switch (modifier.kind) {
    case 'attribute':
      return {
        kind: modifier.kind,
        attribute:
          modifier.attribute === 'main'
            ? attributes.main
            : modifier.attribute === 'secondary'
              ? attributes.secondary
              : modifier.attribute,
        operation: modifier.operation,
        value,
      };
    case 'panelStat':
      return { kind: modifier.kind, stat: modifier.stat, value };
    case 'damageBonus':
      return {
        kind: modifier.kind,
        damageTypes: modifier.damageTypes,
        ...(modifier.skillTypes === undefined ? {} : { skillTypes: modifier.skillTypes }),
        value,
      };
    case 'damageScale':
      return { kind: modifier.kind, target: modifier.target, value };
    case 'staticHealingIncrease':
      return { kind: modifier.kind, target: modifier.target, value };
  }
}

function compileEventHandler(
  handler: EquipmentEventHandlerDefinition,
  level: number,
  path: string,
): CompiledEquipmentEventHandler {
  return {
    key: handler.key,
    event: handler.event,
    ...(handler.condition === undefined ? {} : { condition: handler.condition }),
    blackboard: Object.fromEntries(
      Object.entries(handler.blackboard ?? {}).map(([key, value]) => [
        key,
        resolveLevelValue(value, level, `${path}.blackboard.${key}`),
      ]),
    ),
    sequence: compileActionSequence(handler.sequence, level, `${path}.sequence`),
  };
}

function compileContribution(
  definition: EquipmentContributionDefinition,
  selectedLevel: number,
  levelCount: number,
  source: EquipmentContributionSource,
  path: string,
  attributes: EquipmentAttributeContext,
): CompiledEquipmentContribution {
  if (!Number.isInteger(selectedLevel) || selectedLevel <= 0 || selectedLevel > levelCount) {
    throw new RangeError(`${path} level must be an integer between 1 and ${levelCount}`);
  }
  return {
    source,
    selectedLevel,
    modifiers: (definition.modifiers ?? []).map((modifier, index) =>
      compileModifier(modifier, selectedLevel, `${path}.modifiers[${index}]`, attributes),
    ),
    eventHandlers: (definition.eventHandlers ?? []).map((handler, index) =>
      compileEventHandler(handler, selectedLevel, `${path}.eventHandlers[${index}]`),
    ),
  };
}

/** 按 build 中一一对应的词条等级编译整把武器。 */
export function compileWeaponContributions(
  definition: WeaponDefinition,
  traitLevels: readonly number[],
  attributes: EquipmentAttributeContext,
): readonly CompiledEquipmentContribution[] {
  if (traitLevels.length !== definition.traits.length) {
    throw new RangeError(
      `weapon '${definition.slug}' expects ${definition.traits.length} trait levels, got ${traitLevels.length}`,
    );
  }
  return definition.traits.map((trait, index) =>
    compileContribution(
      trait,
      traitLevels[index]!,
      trait.levelCount,
      { kind: 'weaponTrait', slug: definition.slug, traitKey: trait.key },
      `weapon '${definition.slug}'.traits[${index}]`,
      attributes,
    ),
  );
}

/** 精锻等级以 0 为初始档，编译时转换为从 1 开始的等级索引。 */
export function compileGearContributions(
  definition: GearDefinition,
  artificingLevels: readonly number[],
  attributes: EquipmentAttributeContext,
): readonly CompiledEquipmentContribution[] {
  if (artificingLevels.length !== definition.traits.length) {
    throw new RangeError(
      `gear '${definition.slug}' expects ${definition.traits.length} artificing levels, got ${artificingLevels.length}`,
    );
  }
  return definition.traits.map((trait, index) =>
    compileContribution(
      trait,
      artificingLevels[index]! + 1,
      trait.levelCount,
      { kind: 'gearTrait', slug: definition.slug, traitKey: trait.key },
      `gear '${definition.slug}'.traits[${index}]`,
      attributes,
    ),
  );
}

/** 套装没有用户可选等级，满足三件规则后始终按唯一等级编译。 */
export function compileGearSetContribution(
  definition: GearSetDefinition,
  attributes: EquipmentAttributeContext,
): CompiledEquipmentContribution {
  return compileContribution(
    definition,
    1,
    1,
    { kind: 'gearSet', slug: definition.slug },
    `gear set '${definition.slug}'`,
    attributes,
  );
}
