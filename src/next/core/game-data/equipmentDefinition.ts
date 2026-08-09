/**
 * 武器、装备与套装的版本化目录契约。
 * 定义只描述可生成的游戏事实；用户选择的等级由 build 提供，编译后才成为面板和战斗贡献。
 */
import type {
  ActionSequenceDefinition,
  CombatCondition,
  CombatEventTrigger,
  DamageType,
  LevelValues,
  OperatorAttribute,
  OperatorWeaponType,
  SkillType,
} from './operatorDefinition';

export const WEAPON_RARITIES = [3, 4, 5, 6] as const;
/** 武器目录中已经存在的星级范围。 */
export type WeaponRarity = (typeof WEAPON_RARITIES)[number];

export const EQUIPMENT_PANEL_STATS = [
  'attackFlat',
  'attackPercent',
  'healthFlat',
  'healthPercent',
  'defenseFlat',
  'defensePercent',
  'criticalRate',
  'criticalDamage',
  'artsIntensity',
  'ultimateEnergyGainEfficiency',
  'skillCooldownReduction',
  'staggerDamagePercent',
] as const;
/** 不需要按伤害类型或技能类型筛选的配装面板属性。 */
export type EquipmentPanelStat = (typeof EQUIPMENT_PANEL_STATS)[number];
/** 固定四维或相对当前装备者的主、副属性。相对身份由 Build Resolver 解析。 */
export type EquipmentAttribute = OperatorAttribute | 'main' | 'secondary';

/**
 * 一项常驻配装修正。百分比统一使用小数，例如 5% 写作 0.05。
 * `damageBonus` 独立建模，是为了禁止把筛选条件挂到不支持筛选的普通面板属性上。
 */
export type EquipmentModifierDefinition =
  | {
      readonly kind: 'attribute';
      readonly attribute: EquipmentAttribute;
      readonly operation: 'flat' | 'percent';
      readonly value: LevelValues;
    }
  | {
      readonly kind: 'panelStat';
      readonly stat: EquipmentPanelStat;
      readonly value: LevelValues;
    }
  | {
      readonly kind: 'damageBonus';
      readonly damageTypes: DamageType | readonly DamageType[];
      readonly skillTypes?: SkillType | readonly SkillType[];
      readonly value: LevelValues;
    };

/** 配装能力监听战斗事件后执行的纯数据序列。 */
export interface EquipmentEventHandlerDefinition {
  readonly key: string;
  readonly event: CombatEventTrigger;
  readonly condition?: CombatCondition;
  readonly sequence: ActionSequenceDefinition;
}

/** 武器词条、装备词条与套装共用的声明式贡献集合。 */
export interface EquipmentContributionDefinition {
  readonly modifiers?: readonly EquipmentModifierDefinition[];
  readonly eventHandlers?: readonly EquipmentEventHandlerDefinition[];
}

/** 一条按武器词条等级解析的能力。三星武器可只有两条，四星及以上通常为三条。 */
export interface WeaponTraitDefinition extends EquipmentContributionDefinition {
  readonly key: string;
  readonly levelCount: number;
}

/** 一把武器在只读目录中的稳定身份、成长数据与词条能力。 */
export interface WeaponDefinition {
  readonly slug: string;
  readonly rarity: WeaponRarity;
  readonly weaponType: OperatorWeaponType;
  /** 依次对应 1、20、40、60、80、90 级节点；其他等级必须由有证据的成长规则解析，不能擅自插值。 */
  readonly baseAttackAtLevelNodes: readonly number[];
  readonly traits: readonly WeaponTraitDefinition[];
}

export const GEAR_SLOT_TYPES = ['armor', 'gloves', 'accessory'] as const;
/** 装备自身的槽位类型；两个配件槽共享同一种目录类型。 */
export type GearSlotType = (typeof GEAR_SLOT_TYPES)[number];

/** 一条按精锻等级解析的装备能力；build 中的 0 表示初始档。 */
export interface GearTraitDefinition extends EquipmentContributionDefinition {
  readonly key: string;
  readonly levelCount: number;
}

/** 一件装备在只读目录中的稳定身份、基础防御、词条与套装归属。 */
export interface GearDefinition {
  readonly slug: string;
  readonly slotType: GearSlotType;
  readonly levelRequirement: number;
  readonly baseDefense: number;
  readonly traits: readonly GearTraitDefinition[];
  readonly gearSetSlug?: string;
}

/**
 * 套装的独立目录身份与三件套贡献。
 * 三件触发属于全局装备规则，因此不在每项定义中重复保存 requiredCount。
 */
export interface GearSetDefinition extends EquipmentContributionDefinition {
  readonly slug: string;
}
