import type { DamageType, LevelValues, OperatorAttribute, SkillType } from './primitives.ts';

export const BUILD_PANEL_STATS = [
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

/** 不需要按伤害类型或技能类型筛选的构筑面板属性。 */
export type BuildPanelStat = (typeof BUILD_PANEL_STATS)[number];

/** 固定四维或相对当前装备者的主、副属性。相对身份由 Build Resolver 解析。 */
export type BuildAttribute = OperatorAttribute | 'main' | 'secondary';

export const BUILD_DAMAGE_SCALE_TARGETS = [
  'normalAttack',
  'battleSkill',
  'comboSkill',
  'ultimate',
  'physical',
  'heat',
  'electric',
  'cryo',
  'nature',
  'ether',
  'staggeredEnemy',
] as const;

/** 原生常驻伤害倍率属性；运行时按命中分类、元素或目标失衡状态选择。 */
export type BuildDamageScaleTarget = (typeof BUILD_DAMAGE_SCALE_TARGETS)[number];

/**
 * 常驻构筑修正的权威成员表。百分比统一使用小数，例如 5% 写作 0.05。
 * `damageBonus` 独立建模，是为了禁止把筛选条件挂到不支持筛选的普通面板属性上。
 */
export interface BuildModifierDefinitionMap {
  attribute: {
    readonly kind: 'attribute';
    readonly attribute: BuildAttribute;
    readonly operation: 'flat' | 'percent';
    readonly value: LevelValues;
  };
  panelStat: {
    readonly kind: 'panelStat';
    readonly stat: BuildPanelStat;
    readonly value: LevelValues;
  };
  damageBonus: {
    readonly kind: 'damageBonus';
    readonly damageTypes: DamageType | readonly DamageType[];
    readonly skillTypes?: SkillType | readonly SkillType[];
    readonly value: LevelValues;
  };
  damageScale: {
    /** 直接保留原生 AttributeType 的伤害倍率身份，避免转写成不等价的筛选条件。 */
    readonly kind: 'damageScale';
    readonly target: BuildDamageScaleTarget;
    /** 原生属性公式槽；旧定义省略时按既有 BaseAddition 解释。 */
    readonly slot?: 'baseAddition' | 'addition';
    readonly value: LevelValues;
  };
  staticHealingIncrease: {
    /** 原生 HealOutputIncrease / HealTakenIncrease 的构筑期基础加算。 */
    readonly kind: 'staticHealingIncrease';
    readonly target: 'output' | 'taken';
    readonly value: LevelValues;
  };
  skillCooldownMultiplier: {
    /** 原生技能冷却时长倍率；保留乘区，禁止改写成不等价的“缩减百分比”。 */
    readonly kind: 'skillCooldownMultiplier';
    readonly skillTypes: SkillType | readonly SkillType[];
    readonly value: LevelValues;
  };
}

/** 公共构筑修正的完整联合；具体来源的可转换范围由转换器验证。 */
export type BuildModifierDefinition = BuildModifierDefinitionMap[keyof BuildModifierDefinitionMap];
