/**
 * 游戏目录与战斗运行时之间的解析后协议。这里的值已经确定等级和引用，
 * 运行时可以直接消费，但不得修改或重新解释原始干员配置。
 */
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
  SpGainKind,
  SpGainSource,
  SkillType,
  StatusModifierDefinition,
} from '../game-data/operatorDefinition';

/** 等级数值已经展开、可供运行时直接应用的状态修正。 */
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

/** 每种步骤经编译后允许进入运行时的参数映射。 */
export interface ResolvedCombatStepParameters {
  applyElementalInfliction: CombatStepParameters['applyElementalInfliction'];
  applyElementalReaction: CombatStepParameters['applyElementalReaction'];
  consumeElementalReaction: CombatStepParameters['consumeElementalReaction'];
  dealDamage: {
    damageType: DamageType;
    calculation?: 'standard' | 'breakingAttack';
    attackScale: number;
    calculationMultiplier?: number;
    tags: readonly DamageTag[];
    stagger?: number;
    attackScalePerStatusStack?: {
      statusKey: string;
      target: 'caster' | 'enemy';
      coefficient: number;
    };
  };
  applyBuff: CombatStepParameters['applyBuff'];
  readBuffBlackboard: CombatStepParameters['readBuffBlackboard'];
  changeResource: {
    resource: CombatResource;
    amount: number;
    recipient: ResourceRecipient;
    spGainKind?: SpGainKind;
    spGainSource?: SpGainSource;
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

/** 运行时可直接执行的、按 kind 收窄的单个步骤。 */
export type ResolvedCombatStep = {
  [K in CombatStepKind]: ResolvedCombatStepForKind<K>;
}[CombatStepKind];

/** 已解析且严格保持声明顺序的同步操作序列。 */
export interface ResolvedActionSequence {
  readonly steps: readonly ResolvedCombatStep[];
}

/** 技能释放时刻相对帧上的一个已编译调度项。 */
export interface CompiledTimelineAction {
  readonly startFrame: number;
  readonly sequence: ResolvedActionSequence;
}

/** 等级已经展开的一项技能资源费用。 */
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
  /** 已按技能等级解析；每次释放复制到该运行实例的动作黑板。 */
  readonly initialBlackboard: Readonly<Record<string, number>>;
  /** 时间轴投影使用的技能块宽度，不参与技能生命周期和中断判断。 */
  readonly timelineBlockFrames: number;
  readonly cooldownFrames?: number;
  readonly costFrame?: number;
  readonly costs: readonly CompiledSkillCost[];
  readonly timelineActions: readonly CompiledTimelineAction[];
}

export type { ElementalReaction, StatusModifierDefinition };
