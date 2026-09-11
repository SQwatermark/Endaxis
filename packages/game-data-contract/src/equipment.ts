import { type LevelValues, type OperatorWeaponType } from './primitives.ts';
import { type CombatCondition } from './conditions.ts';
import { type ActionSequenceDefinition, type CombatEventTrigger } from './actions.ts';
import { type OperatorBuffDefinitions } from './buffs.ts';
import type { AbilityEvent } from './abilityEvents.ts';

export const WEAPON_RARITIES = [3, 4, 5, 6] as const;

/** 武器定义中已经存在的星级范围。 */
export type WeaponRarity = (typeof WEAPON_RARITIES)[number];

/** 兼容既有配装入口；公共构筑结构只在 buildModifiers 中定义。 */
export {
  BUILD_PANEL_STATS as EQUIPMENT_PANEL_STATS,
  BUILD_DAMAGE_SCALE_TARGETS as EQUIPMENT_DAMAGE_SCALE_TARGETS,
  type BuildPanelStat as EquipmentPanelStat,
  type BuildAttribute as EquipmentAttribute,
  type BuildDamageScaleTarget as EquipmentDamageScaleTarget,
} from './buildModifiers.ts';
import type { BuildModifierDefinition } from './buildModifiers.ts';

export type EquipmentModifierDefinition = BuildModifierDefinition;

export const EQUIPMENT_TRAIT_DISPLAY_COMPOSITES = [
  'cryoAndElectricDamageIncrease',
  'heatAndNatureDamageIncrease',
  'allSkillDamageIncrease',
  'allDamageReduction',
  'spellDamageIncrease',
] as const;

export type EquipmentTraitDisplayComposite = (typeof EQUIPMENT_TRAIT_DISPLAY_COMPOSITES)[number];

/**
 * 游戏 EquipTable.displayAttrModifiers 的规范化结果。它只决定一条词条如何显示；
 * `modifiers` 仍是实际战斗效果，二者不得互相反推。
 */
export type EquipmentTraitDisplayDefinition =
  | {
      readonly kind: 'modifier';
      readonly modifier: EquipmentModifierDefinition;
    }
  | {
      readonly kind: 'composite';
      readonly composite: EquipmentTraitDisplayComposite;
      readonly value: LevelValues;
    };

/** 配装被动直接监听的原生 AbilitySystem 事件。 */
export const EQUIPMENT_ABILITY_EVENTS = [
  'enterFight',
  'beforeOutputDamage',
  'outputCriticalDamage',
  'outputHeal',
  'beforeCastSkill',
  'afterSkillApplyCost',
  'beforeOutputPhysicalInfliction',
  'afterOutputPhysicalInfliction',
  'beforeOutputInfliction',
  'beforeOutputSpellBurst',
  'beforeOutputBuff',
  'outputBuff',
  'addedBuff',
  'buffEnhanceChanged',
  'buffConsumed',
  'skillSpGained',
] as const satisfies readonly AbilityEvent[];

export type EquipmentAbilityEvent = (typeof EQUIPMENT_ABILITY_EVENTS)[number];

interface EquipmentEventHandlerDefinitionBase {
  readonly key: string;
  /** 原生数据动作优先级；同级按定义中的注册顺序执行。 */
  readonly priority?: number;
  readonly condition?: CombatCondition;
  readonly sequence: ActionSequenceDefinition;
}

/** 配装能力监听战斗事件后执行的纯数据序列。 */
export type EquipmentEventHandlerDefinition = EquipmentEventHandlerDefinitionBase &
  (
    | { readonly event: CombatEventTrigger; readonly abilityEvent?: never }
    | { readonly event?: never; readonly abilityEvent: EquipmentAbilityEvent }
  );

/** 武器词条、装备词条与套装共用的声明式贡献集合。 */
export interface EquipmentContributionDefinition {
  readonly modifiers?: readonly EquipmentModifierDefinition[];
  readonly eventHandlers?: readonly EquipmentEventHandlerDefinition[];
  /** 该贡献安装行为所引用的 Buff 蓝图；与干员 Buff 共用同一运行时。 */
  readonly buffDefinitions?: OperatorBuffDefinitions;
  /** 配装能力的初始黑板，按词条等级解析；初始化与全部事件响应共享同一实例。 */
  readonly blackboard?: Readonly<Record<string, LevelValues>>;
  /** 能力启用前执行一次；期间自身事件响应关闭，典型用途为原生普通启动 Buff。 */
  readonly enableSequence?: ActionSequenceDefinition;
  /** 能力启用后在帧 0 执行一次；Toggle 初次安装及固定构筑刷新程序使用此入口。 */
  readonly initializationSequence?: ActionSequenceDefinition;
}

/** 一条按武器词条等级解析的能力。三星武器可只有两条，四星及以上通常为三条。 */
export interface WeaponTraitDefinition extends EquipmentContributionDefinition {
  readonly key: string;
  readonly levelCount: number;
}

/** 一把武器在只读定义中的稳定身份、成长数据与词条能力。 */
export interface WeaponDefinition {
  /** 游戏原生武器对象 ID（`wpn_*`）；项目引用、实例关联与校验均以它为准。 */
  readonly slug: string;
  readonly displayName?: string;
  /** 仅用于定位图标/本地化等展示资源；资源复用不得改变 slug 身份。 */
  readonly assetSlug?: string;
  /** 与语言无关的展示资源；名称和描述仍由 locale family 按需解析。 */
  readonly iconPath?: string;
  readonly rarity: WeaponRarity;
  readonly weaponType: OperatorWeaponType;
  /** 依次对应 1、20、40、60、80、90 级节点；其他等级必须由有证据的成长规则解析，不能擅自插值。 */
  readonly baseAttackAtLevelNodes: readonly number[];
  readonly traits: readonly WeaponTraitDefinition[];
}

export const GEAR_SLOT_TYPES = ['armor', 'gloves', 'accessory'] as const;

/** 装备自身的槽位类型；两个配件槽共享同一种定义类型。 */
export type GearSlotType = (typeof GEAR_SLOT_TYPES)[number];

/** 一条按精锻等级解析的装备能力；build 中的 0 表示初始档。 */
export interface GearTraitDefinition extends EquipmentContributionDefinition {
  readonly key: string;
  readonly levelCount: number;
  /** 每条原生装备词条都有且只有一份 displayAttrModifiers 展示定义。 */
  readonly display: EquipmentTraitDisplayDefinition;
}

/** 一件装备在只读定义中的稳定身份、基础防御、词条与套装归属。 */
export interface GearDefinition {
  /** 游戏原生装备对象 ID（`item_equip_*`）；项目引用、实例关联与校验均以它为准。 */
  readonly slug: string;
  readonly displayName?: string;
  /** 仅用于定位图标/本地化等展示资源；共用 iconId 不得改变 slug 身份。 */
  readonly assetSlug?: string;
  /** 与语言无关的展示资源；名称和描述仍由 locale family 按需解析。 */
  readonly iconPath?: string;
  readonly slotType: GearSlotType;
  readonly levelRequirement: number;
  readonly baseDefense: number;
  readonly traits: readonly GearTraitDefinition[];
  readonly gearSetSlug?: string;
}

/**
 * 套装的独立定义身份与三件套贡献。
 * 三件触发属于全局装备规则，因此不在每项定义中重复保存 requiredCount。
 */
export interface GearSetDefinition extends EquipmentContributionDefinition {
  readonly slug: string;
  readonly displayName?: string;
}
