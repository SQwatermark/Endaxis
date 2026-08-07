import type {
  CombatCondition,
  CombatResource,
  CombatStepKind,
  CombatStepParameters,
  DamageTag,
  DamageType,
  ElementalReaction,
  OperatorAttribute,
  ResourceRecipient,
  SkillType,
  StatusModifierDefinition,
} from '../game-data/operatorDefinition';

export type ResolvedStatusModifier =
  | { kind: 'attackPercent'; value: number }
  | {
      kind: 'susceptibility';
      damageTypes: readonly DamageType[];
      value: number;
      attributeScaling?: { attribute: OperatorAttribute; coefficient: number };
      cap?: number;
    }
  | { kind: 'slowed' }
  | { kind: 'blockResourceGain'; resource: CombatResource }
  | { kind: 'resourceCostMultiplier'; resource: CombatResource; value: number }
  | { kind: 'skillCooldownMultiplier'; skillGroupKey: string; value: number };

export interface ResolvedCombatStepParameters {
  applyElementalInfliction: CombatStepParameters['applyElementalInfliction'];
  applyElementalReaction: CombatStepParameters['applyElementalReaction'];
  consumeElementalReaction: CombatStepParameters['consumeElementalReaction'];
  dealDamage: {
    damageType: DamageType;
    calculation?: 'standard' | 'breakingAttack';
    attackScale: number;
    tags: readonly DamageTag[];
    stagger?: number;
    attackScalePerStatusStack?: {
      statusKey: string;
      target: 'caster' | 'enemy';
      coefficient: number;
    };
  };
  applyBuff: CombatStepParameters['applyBuff'];
  changeResource: {
    resource: CombatResource;
    amount: number;
    recipient: ResourceRecipient;
  };
  gainSquadUltimateEnergyFromSkillCost: { coefficient: number };
  gainFinisherSp: CombatStepParameters['gainFinisherSp'];
  applyStatus: {
    statusKey: string;
    target: 'caster' | 'enemy';
    durationFrames?: number;
    stacks?: number;
    maxStacks?: number;
    modifiers?: readonly ResolvedStatusModifier[];
  };
  consumeStatus: CombatStepParameters['consumeStatus'];
  conditional: { condition: CombatCondition };
  setContextFlag: CombatStepParameters['setContextFlag'];
}

type ResolvedCombatStepForKind<K extends CombatStepKind> = {
  readonly key?: string;
  readonly kind: K;
  readonly parameters: Readonly<ResolvedCombatStepParameters[K]>;
} & (K extends 'conditional'
  ? {
      readonly whenTrue: ResolvedActionSequence;
      readonly whenFalse?: ResolvedActionSequence;
    }
  : {});

export type ResolvedCombatStep = {
  [K in CombatStepKind]: ResolvedCombatStepForKind<K>;
}[CombatStepKind];

export interface ResolvedActionSequence {
  readonly steps: readonly ResolvedCombatStep[];
}

export interface CompiledTimelineAction {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly sequence: ResolvedActionSequence;
}

export interface CompiledSkillCost {
  readonly resource: CombatResource;
  readonly value: number;
}

/** 供运行时技能实例使用的完整单等级程序。 */
export interface CompiledSkillProgram {
  readonly operatorId: string;
  readonly skillGroupKey: string;
  readonly skillId: string;
  readonly skillType: SkillType;
  readonly skillLevel: number;
  readonly durationFrames: number;
  readonly cooldownFrames?: number;
  readonly costFrame?: number;
  readonly costs: readonly CompiledSkillCost[];
  readonly timelineActions: readonly CompiledTimelineAction[];
}

export type { ElementalReaction, StatusModifierDefinition };
