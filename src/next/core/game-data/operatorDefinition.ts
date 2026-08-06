export const OPERATOR_ATTRIBUTES = ['strength', 'agility', 'intellect', 'will'] as const;
export type OperatorAttribute = (typeof OPERATOR_ATTRIBUTES)[number];

export const OPERATOR_RARITIES = [4, 5, 6] as const;
export type OperatorRarity = (typeof OPERATOR_RARITIES)[number];

export const OPERATOR_WEAPON_TYPES = [
  'sword',
  'greatsword',
  'polearm',
  'handcannon',
  'arts-unit',
] as const;
export type OperatorWeaponType = (typeof OPERATOR_WEAPON_TYPES)[number];

export const OPERATOR_ROLES = [
  'guard',
  'caster',
  'defender',
  'vanguard',
  'supporter',
  'striker',
] as const;
export type OperatorRole = (typeof OPERATOR_ROLES)[number];

export const DAMAGE_ELEMENTS = ['physical', 'heat', 'cryo', 'electric', 'nature'] as const;
export type DamageElement = (typeof DAMAGE_ELEMENTS)[number];
export const INFLICTION_ELEMENTS = ['heat', 'electric', 'cryo', 'nature'] as const;
export type InflictionElement = (typeof INFLICTION_ELEMENTS)[number];

/** Damage channels used by health-damage calculation. */
export const DAMAGE_TYPES = [
  'physical',
  'true',
  'heat',
  'electric',
  'cryo',
  'lifeDrain',
  'nature',
  'ether',
] as const;
export type DamageType = (typeof DAMAGE_TYPES)[number];

export const ELEMENTAL_REACTIONS = ['electrification', 'corrosion'] as const;
export type ElementalReaction = (typeof ELEMENTAL_REACTIONS)[number];

/** Additive classifications carried by a resolved damage hit. */
export const DAMAGE_TAGS = [
  'normalAttack',
  'normalAttackLastCombo',
  'powerAttack',
  'normalSkill',
  'comboSkill',
  'ultimateSkill',
  'plungingAttack',
  'dashAttack',
] as const;
export type DamageTag = (typeof DAMAGE_TAGS)[number];

export const SKILL_TYPES = [
  'basicAttack',
  'battleSkill',
  'comboSkill',
  'ultimate',
  'finisher',
  'plungingAttack',
] as const;
export type SkillType = (typeof SKILL_TYPES)[number];

export const SKILL_LEVEL_SOURCES = [
  'basicAttack',
  'battleSkill',
  'comboSkill',
  'ultimate',
] as const;
export type SkillLevelSource = (typeof SKILL_LEVEL_SOURCES)[number];

export const COMBAT_RESOURCES = ['sp', 'ultimateEnergy'] as const;
export type CombatResource = (typeof COMBAT_RESOURCES)[number];

export const COMBAT_TARGETS = ['caster', 'enemy'] as const;
export type CombatTarget = (typeof COMBAT_TARGETS)[number];

export const COMPARISON_OPERATORS = [
  'equal',
  'notEqual',
  'greater',
  'greaterOrEqual',
  'less',
  'lessOrEqual',
] as const;
export type ComparisonOperator = (typeof COMPARISON_OPERATORS)[number];

/** A shared value for every level, or one value per level. */
export type LevelValues = number | readonly number[];

export const DAMAGE_CALCULATIONS = ['standard', 'breakingAttack'] as const;
export type DamageCalculation = (typeof DAMAGE_CALCULATIONS)[number];

export interface DealDamageParameters {
  damageType: DamageType;
  /** Formula used to produce base damage. Omitted for standard attack scaling. */
  calculation?: DamageCalculation;
  /** Per-hit attack scale as a decimal. */
  attackScale: LevelValues;
  tags: readonly DamageTag[];
  /** Stagger damage resolved after health damage by the same hit. */
  stagger?: LevelValues;
  /** Additive attack scale contributed by each stack of a semantic combat status. */
  attackScalePerStatusStack?: {
    statusKey: string;
    target: CombatTarget;
    coefficient: LevelValues;
  };
}

export type CombatCondition =
  | { kind: 'skillBranchEnabled'; branchKey: string }
  | { kind: 'targetStaggered'; target: CombatTarget }
  | { kind: 'contextFlagEquals'; flag: string; value: boolean | number | string }
  | { kind: 'statusActive'; statusKey: string; target: CombatTarget; minimumStacks?: number }
  | {
      kind: 'elementalInflictionPresent';
      elements: DamageElement | readonly DamageElement[];
      minimumStacks?: number;
    }
  | {
      kind: 'elementalReactionActive';
      reaction: ElementalReaction;
      minimumLevel?: number;
    }
  | { kind: 'not'; condition: CombatCondition }
  | { kind: 'all'; conditions: readonly CombatCondition[] }
  | { kind: 'any'; conditions: readonly CombatCondition[] }
  | {
      kind: 'deckAttributeCompare';
      left: OperatorAttribute;
      operator: ComparisonOperator;
      right: OperatorAttribute;
    };
export const COMBAT_CONDITION_KINDS = [
  'skillBranchEnabled',
  'targetStaggered',
  'contextFlagEquals',
  'statusActive',
  'elementalInflictionPresent',
  'elementalReactionActive',
  'not',
  'all',
  'any',
  'deckAttributeCompare',
] as const satisfies readonly CombatCondition['kind'][];
export type CombatConditionKind = (typeof COMBAT_CONDITION_KINDS)[number];

export type BuildCondition = Extract<CombatCondition, { kind: 'deckAttributeCompare' }>;

export const RESOURCE_RECIPIENTS = ['caster', 'team'] as const;
export type ResourceRecipient = (typeof RESOURCE_RECIPIENTS)[number];

export type StatusModifierDefinition =
  | { kind: 'attackPercent'; value: LevelValues }
  | {
      kind: 'susceptibility';
      damageTypes: readonly DamageType[];
      value: LevelValues;
      attributeScaling?: { attribute: OperatorAttribute; coefficient: LevelValues };
      cap?: LevelValues;
    }
  | { kind: 'slowed' }
  | { kind: 'blockResourceGain'; resource: CombatResource }
  | { kind: 'resourceCostMultiplier'; resource: CombatResource; value: number }
  | { kind: 'skillCooldownMultiplier'; skillGroupKey: string; value: number };
export const STATUS_MODIFIER_KINDS = [
  'attackPercent',
  'susceptibility',
  'slowed',
  'blockResourceGain',
  'resourceCostMultiplier',
  'skillCooldownMultiplier',
] as const satisfies readonly StatusModifierDefinition['kind'][];

export interface CombatStepParameters {
  applyElementalInfliction: { element: InflictionElement; isExtra: boolean };
  applyElementalReaction: {
    reaction: ElementalReaction;
    target: CombatTarget;
    durationSeconds: number;
    effectiveness: number;
  };
  consumeElementalReaction: {
    reaction: ElementalReaction;
    target: 'enemy';
  };
  dealDamage: DealDamageParameters;
  applyBuff: {
    buffId: string;
    target: CombatTarget;
    durationSeconds?: number;
    effectiveness?: number;
  };
  changeResource: {
    resource: CombatResource;
    amount: LevelValues;
    recipient: ResourceRecipient;
  };
  gainSquadUltimateEnergyFromSkillCost: { coefficient: LevelValues };
  gainFinisherSp: { factor: number; recipient: 'team' };
  applyStatus: {
    statusKey: string;
    target: CombatTarget;
    durationFrames?: LevelValues;
    stacks?: number;
    maxStacks?: number;
    modifiers?: readonly StatusModifierDefinition[];
  };
  consumeStatus: {
    statusKey: string;
    target: CombatTarget;
    stacks?: number;
  };
  conditional: { condition: CombatCondition };
  setContextFlag: {
    flag: string;
    value: boolean | number | string;
    target: 'caster';
  };
}

export const COMBAT_STEP_KINDS = [
  'applyElementalInfliction',
  'applyElementalReaction',
  'consumeElementalReaction',
  'dealDamage',
  'applyBuff',
  'changeResource',
  'gainSquadUltimateEnergyFromSkillCost',
  'gainFinisherSp',
  'applyStatus',
  'consumeStatus',
  'conditional',
  'setContextFlag',
] as const satisfies readonly (keyof CombatStepParameters)[];
export type CombatStepKind = (typeof COMBAT_STEP_KINDS)[number];

type CombatStepForKind<K extends CombatStepKind> = {
  /** Present only when another catalog definition must address this step. */
  key?: string;
  kind: K;
  parameters: Readonly<CombatStepParameters[K]>;
} & (K extends 'conditional'
  ? { whenTrue: ActionSequenceDefinition; whenFalse?: ActionSequenceDefinition }
  : {});

export type CombatStepDefinition = {
  [K in CombatStepKind]: CombatStepForKind<K>;
}[CombatStepKind];

export interface ActionSequenceDefinition {
  steps: readonly CombatStepDefinition[];
}

export interface ScheduledSequenceDefinition {
  startFrame: number;
  endFrame: number;
  sequence: ActionSequenceDefinition;
}

export interface SkillCostDefinition {
  resource: CombatResource;
  value: LevelValues;
}

export type SkillTriggerScope = 'operator' | 'team';
export type CombatEventTrigger =
  | { kind: 'damageTagHit'; tag: DamageTag; scope: SkillTriggerScope }
  | {
      kind: 'elementalInflictionApplied';
      elements: DamageElement | readonly DamageElement[];
      scope: SkillTriggerScope;
    }
  | { kind: 'skillHit'; skillGroupKey: string; scope: SkillTriggerScope }
  | { kind: 'statusExpired'; statusKey: string; target: CombatTarget }
  | { kind: 'statusConsumed'; statusKey: string; target: CombatTarget };

export interface SkillActivationRule {
  trigger: Extract<CombatEventTrigger, { kind: 'damageTagHit' | 'elementalInflictionApplied' }>;
  condition?: CombatCondition;
}

export interface CombatEventHandlerDefinition {
  key: string;
  event: CombatEventTrigger;
  condition?: CombatCondition;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
}

export interface SkillDefinition {
  key: string;
  durationFrames: number;
  /** Condition checked when the user attempts to cast this skill. */
  availability?: CombatCondition;
  cooldownFrames?: LevelValues;
  costs?: readonly SkillCostDefinition[];
  /** Native CastData.startCdFrame; required by the compiler when costs are present. */
  costFrame?: number;
  scheduledSequences: readonly ScheduledSequenceDefinition[];
  activationWindow?: {
    durationFrames: number;
    rules: SkillActivationRule | readonly SkillActivationRule[];
  };
  eventHandlers?: readonly CombatEventHandlerDefinition[];
}

export interface SkillGroupDefinition {
  key: string;
  /** Combat classification shared by the library entry's skills. */
  skillType: SkillType;
  /** One of the four build fields that supplies the selected skill level. */
  levelSource: SkillLevelSource;
  /** A single placed skill, or an ordered chain placed as one library entry. */
  skills: SkillDefinition | readonly SkillDefinition[];
  /** UI variants of one stable skill group; they do not create separate cast identities. */
  presentationVariants?: readonly SkillPresentationVariantDefinition[];
}

export interface SkillPresentationVariantDefinition {
  key: string;
  condition: BuildCondition;
}

export type AttributeGrowthDefinition = Record<OperatorAttribute, readonly number[]> & {
  baseAttack: readonly number[];
  baseHealth: readonly number[];
};

export type UpgradeModifierDefinition =
  | {
      kind: 'addConditionalDamage';
      condition: CombatCondition;
      values: LevelValues;
    }
  | {
      kind: 'enableSkillBranch';
      skillGroupKey: string;
      branchKey: string;
    }
  | {
      kind: 'multiplyEffectDuration';
      skillGroupKey: string;
      stepKey: string;
      multiplier: number;
    }
  | {
      kind: 'multiplySkillCost';
      skillGroupKey: string;
      resource: CombatResource;
      multiplier: number;
    }
  | {
      kind: 'setEffectiveness';
      skillGroupKey: string;
      stepKey: string;
      value: number;
    }
  | {
      kind: 'addSkillStat';
      skillGroupKey: string;
      stat: 'criticalRate';
      value: number;
    }
  | { kind: 'multiplySkillDamage'; skillGroupKey: string; multiplier: number }
  | {
      kind: 'multiplyStepDamage';
      skillGroupKey: string;
      stepKey: string;
      multiplier: number;
    }
  | {
      kind: 'multiplySkillCooldown';
      skillGroupKey: string;
      branchKey?: string;
      multiplier: number;
    }
  | {
      kind: 'addSkillCooldownFrames';
      skillGroupKey: string;
      frames: number;
      condition?: CombatCondition;
    }
  | {
      kind: 'addBuildAttribute';
      attributes: readonly OperatorAttribute[];
      value: number;
    }
  | { kind: 'addPanelStat'; stat: 'artsIntensity'; value: number }
  | { kind: 'addReactionDuration'; reaction: ElementalReaction; seconds: LevelValues }
  | {
      kind: 'addReactionEffectiveness';
      reaction: ElementalReaction;
      value: LevelValues;
    };
export const UPGRADE_MODIFIER_KINDS = [
  'addConditionalDamage',
  'enableSkillBranch',
  'multiplyEffectDuration',
  'multiplySkillCost',
  'setEffectiveness',
  'addSkillStat',
  'multiplySkillDamage',
  'multiplyStepDamage',
  'multiplySkillCooldown',
  'addSkillCooldownFrames',
  'addBuildAttribute',
  'addPanelStat',
  'addReactionDuration',
  'addReactionEffectiveness',
] as const satisfies readonly UpgradeModifierDefinition['kind'][];
export type UpgradeModifierKind = (typeof UPGRADE_MODIFIER_KINDS)[number];

export type UpgradeEvent =
  | { kind: 'reactionApplied'; reaction: ElementalReaction }
  | Extract<CombatEventTrigger, { kind: 'skillHit' }>;

export interface UpgradeEventHandlerDefinition {
  event: UpgradeEvent;
  sequence: ActionSequenceDefinition;
}

export interface OperatorUpgradeDefinition {
  key: string;
  levels: number;
  modifiers?: readonly UpgradeModifierDefinition[];
  eventHandlers?: readonly UpgradeEventHandlerDefinition[];
}

export const OPERATOR_EVENTS = ['deckAttributesChanged'] as const;
export type OperatorEvent = (typeof OPERATOR_EVENTS)[number];

export interface OperatorEventHandlerDefinition {
  key: string;
  event: OperatorEvent;
  sequence: ActionSequenceDefinition;
}

export interface OperatorDefinition {
  slug: string;
  gameId: string;
  rarity: OperatorRarity;
  weaponType: OperatorWeaponType;
  element: DamageElement;
  role: OperatorRole;
  mainAttribute: OperatorAttribute;
  secondaryAttribute: OperatorAttribute;
  attributes: AttributeGrowthDefinition;
  skillGroups: readonly SkillGroupDefinition[];
  eventHandlers?: readonly OperatorEventHandlerDefinition[];
  talents: readonly OperatorUpgradeDefinition[];
  potentials: readonly OperatorUpgradeDefinition[];
}
