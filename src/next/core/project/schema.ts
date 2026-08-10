/**
 * 项目存档的唯一数据定义。这里只放用户自己决定的内容（等级、放置、覆盖值）；
 * 编译出来的面板、模拟状态、诊断结果一律不允许写进来。
 */
import type {
  CombatStepKind,
  CombatStepParameters,
  DamageElement,
  SkillType,
} from '../game-data/operatorDefinition';

export const PROJECT_KIND = 'EndaxisProject' as const;
export const PROJECT_SCHEMA_VERSION = 3 as const;
export const PROJECT_FPS = 30 as const;

/** 项目 JSON 允许直接保存的原始值。 */
export type JsonPrimitive = boolean | number | string | null;
/** 项目 JSON 中递归允许的全部值。 */
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
/** 使用字符串键组织的项目 JSON 对象。 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/** 一个干员养成方案中由用户决定的稳定输入。 */
export interface OperatorBuildDocument {
  id: string;
  operatorSlug: string;
  level: number;
  promoted: boolean;
  potential: number;
  trustLevel: number;
  skillLevels: Record<string, number>;
  talentStates: Record<string, number>;
  baseStatOverrides?: Record<string, number>;
}

/** 一把武器的等级、突破、潜能与词条等级配置。词条数量由武器定义决定。 */
export interface WeaponBuildDocument {
  id: string;
  /** 引用当前游戏数据版本中的 `WeaponDefinition.slug`。 */
  weaponSlug: string;
  level: number;
  tuned: boolean;
  potential: number;
  traitLevels: number[];
}

/** 一件装备的定义身份与精锻等级配置。 */
export interface GearBuildDocument {
  id: string;
  /** 引用当前游戏数据版本中的 `GearDefinition.slug`。 */
  gearSlug: string;
  artificingLevels: number[];
}

/** 场景引用的全部干员、武器与装备方案。 */
export interface ScenarioBuildsDocument {
  operators: Record<string, OperatorBuildDocument>;
  weapons: Record<string, WeaponBuildDocument>;
  gears: Record<string, GearBuildDocument>;
}

/** 可从版本化游戏数据恢复身份和默认行为的技能来源。 */
export type DefinitionActionSource =
  | {
      kind: 'operatorSkill';
      skillGroupKey: string;
      skillKey: string;
    }
  | {
      kind: 'weaponSkill';
      skillKey: string;
    };

/** 完全由用户定义、无法从游戏数据恢复的时间轴行为。 */
export interface CustomActionDefinition {
  kind: 'custom';
  /** 用户定义的身份标识，刻意保持开放而不限制为枚举。 */
  actionType: string;
  name: string;
  element?: DamageElement;
  iconKey?: string;
}

/** 时间轴技能释放所引用的定义或自定义行为来源。 */
export type SkillCastSource = DefinitionActionSource | CustomActionDefinition;

export const EDITABLE_SKILL_CAST_FIELDS = [
  'durationFrames',
  'cooldownFrames',
  'comboFollowupDelayFrames',
  'triggerWindowFrames',
  'enhancement',
  'spCost',
  'ultimateEnergyCost',
  'linked',
  'locked',
  'disabled',
  'color',
  'scheduledSequences',
  'customBars',
] as const;
/** 技能释放中允许用户覆盖默认值的字段。 */
export type EditableSkillCastField = (typeof EDITABLE_SKILL_CAST_FIELDS)[number];

type CombatStepDocumentForKind<K extends CombatStepKind> = {
  kind: K;
  parameters: CombatStepParameters[K];
  /** 仅对支持定点覆盖的定义步骤保留定义键。 */
  sourceStepKey?: string;
  /** 用户显式修改过的参数键。 */
  edited: Extract<keyof CombatStepParameters[K], string>[];
} & (K extends 'dealDamage' | 'dealFixedDamage' ? { hitId: string } : {}) &
  (K extends 'conditional'
    ? { whenTrue: ActionSequenceDocument; whenFalse?: ActionSequenceDocument }
    : K extends 'once'
      ? { body: ActionSequenceDocument }
      : {});

/** 规范化战斗操作，其 `kind` 决定负载结构。 */
export type CombatStepDocument = {
  [K in CombatStepKind]: CombatStepDocumentForKind<K>;
}[CombatStepKind];

/** 子操作严格按照此顺序同步执行。 */
export interface ActionSequenceDocument {
  steps: CombatStepDocument[];
}

/**
 * 相对于所属技能释放时刻的一段调度序列。点事件的起止帧相同；
 * 每个调度项只在 `startFrame` 到达时执行一次。
 */
export interface ScheduledSequenceDocument {
  id: string;
  sourceSequenceKey?: string;
  startFrame: number;
  sequence: ActionSequenceDocument;
  edited: ('startFrame' | 'sequence')[];
}

/** 用户添加在技能块上的辅助展示条。 */
export interface EditableBarDocument {
  id: string;
  text: string;
  offsetFrames: number;
  durationFrames: number;
  color?: string;
}

/** 技能强化状态的持续时间或语义状态来源。 */
export type EnhancementDocument =
  { kind: 'duration'; frames: number } | { kind: 'status'; statusId: string };

/**
 * 编辑器暴露的完整取值。即使数值仍等于定义默认值也会持久化，
 * `edited` 只标记哪些值被用户手动改过。
 */
export interface EditableActionValues {
  durationFrames: number;
  cooldownFrames?: number;
  comboFollowupDelayFrames?: number;
  triggerWindowFrames?: number;
  enhancement?: EnhancementDocument;
  spCost?: number;
  ultimateEnergyCost?: number;
  linked?: boolean;
  locked: boolean;
  disabled: boolean;
  color?: string | null;
  scheduledSequences: ScheduledSequenceDocument[];
  customBars: EditableBarDocument[];
}

/** 用户放置在干员轨道上的一次技能释放。 */
export interface SkillCastDocument {
  id: string;
  source: SkillCastSource;
  placement: {
    /** 用户编辑的逻辑位置；运行时位移属于派生结果。 */
    startFrame: number;
  };
  /** 当一次技能库操作以序列形式放置多次释放时存在。 */
  placementGroup?: {
    id: string;
    skillGroupKey: string;
    index: number;
    total: number;
  };
  editable: EditableActionValues;
  edited: EditableSkillCastField[];
}

/** 一条干员轨道的养成引用、初始资源和技能释放。 */
export interface TrackDocument {
  operatorBuildId: string | null;
  weaponBuildId: string | null;
  gearBuildIds: {
    armor: string | null;
    gloves: string | null;
    accessory1: string | null;
    accessory2: string | null;
  };
  initialState: {
    ultimateEnergy: number;
    maxUltimateEnergyOverride?: number;
  };
  skillCasts: SkillCastDocument[];
}

/** 四人队伍中一个允许为空的轨道槽位。 */
export type TrackSlotDocument = TrackDocument | null;
/** 四条时间轴轨道使用的稳定零基序号。 */
export type TrackIndex = 0 | 1 | 2 | 3;
/** 固定包含四个槽位的队伍轨道列表。 */
export type TrackListDocument = [
  TrackSlotDocument,
  TrackSlotDocument,
  TrackSlotDocument,
  TrackSlotDocument,
];

/** 用户连线可以指向的技能块或具体伤害命中端点。 */
export type ConnectionEndpoint =
  | { kind: 'skillCast'; skillCastId: string; port?: string }
  | {
      kind: 'damageHit';
      skillCastId: string;
      hitId: string;
      port?: string;
    };

/** 用户在两个时间轴端点之间建立的一条逻辑连接。 */
export interface ConnectionDocument {
  id: string;
  consumption: boolean;
  from: ConnectionEndpoint;
  to: ConnectionEndpoint;
}

/** 敌人失衡规则的项目值；定义中的秒数在创建实例时已经转换为项目帧。 */
export interface EnemyStaggerEditableValues {
  maximum: number;
  nodeCount: number;
  nodeDurationFrames: number;
  brokenDurationFrames: number;
  finisherRecovery: number;
}

/** 编辑器完整暴露、并允许用户覆盖的敌人数值。 */
export interface EnemyEditableValues {
  hp: number;
  defense: number;
  superArmor: number;
  finisherMultiplier: number;
  resistances: Record<string, number>;
  stagger: EnemyStaggerEditableValues;
}

export const ENEMY_EDITABLE_FIELDS = [
  'hp',
  'defense',
  'superArmor',
  'finisherMultiplier',
  'resistances',
  'stagger.maximum',
  'stagger.nodeCount',
  'stagger.nodeDurationFrames',
  'stagger.brokenDurationFrames',
  'stagger.finisherRecovery',
] as const;
/** 用户可以覆盖的敌人默认值路径。 */
export type EnemyEditableField = (typeof ENEMY_EDITABLE_FIELDS)[number];

/** 场景中的敌人：来自定义（prefab）的实例，或自定义敌人配置。 */
export interface EnemyDocument {
  source: { kind: 'prefab'; enemyId: string; level: number } | { kind: 'custom'; level: number };
  editable: EnemyEditableValues;
  /** `editable` 中被用户改离已捕获默认值的键。 */
  edited: EnemyEditableField[];
}

/** 用户创建的分支点，可从此派生后续场景。 */
export interface CycleBoundaryDocument {
  id: string;
  frame: number;
}

/** 从 `frame` 开始由玩家主控的轨道。 */
export interface ControlSwitchDocument {
  id: string;
  frame: number;
  trackIndex: TrackIndex;
}

/** 一次模拟的时间范围、共享资源规则与控制事件。敌人失衡规则归敌人实例所有。 */
export interface BattleDocument {
  prepFrames: number;
  durationFrames: number;
  simulationRange?: {
    startFrame?: number;
    endFrame?: number;
  };
  resourceRules: {
    maxSp: number;
    initialSp: number;
    spRecoveryPerSecond: number;
    defaultSkillSpCost: number;
  };
  cycleBoundaries: CycleBoundaryDocument[];
  controlSwitches: ControlSwitchDocument[];
}

/**
 * 场景从来源边界派生初始运行时状态。
 * 由此生成的资源与效果刻意不做持久化。
 */
export interface ScenarioInheritanceDocument {
  sourceScenarioId: string;
  boundaryId: string;
}

export const GLOBAL_OPERATOR_STAT_MODIFIERS = [
  'attackPercent',
  'criticalRate',
  'criticalDamage',
  'artsIntensity',
  'ultimateEnergyGainEfficiency',
  'skillCooldownReduction',
] as const;
/** 可以作用于全部干员或指定技能类型的全局属性修正。 */
export type GlobalOperatorStatModifier = (typeof GLOBAL_OPERATOR_STAT_MODIFIERS)[number];

/** 用户配置的一条全局干员属性修正。 */
export interface GlobalOperatorStatModifierDocument {
  id: string;
  kind: 'operatorStat';
  modifier: GlobalOperatorStatModifier;
  value: number;
  /** 仅当修正限定于某一种技能类型时需要。 */
  skillType?: SkillType;
}

/** 场景级全局修正配置。 */
export interface GlobalConfigDocument {
  modifiers: GlobalOperatorStatModifierDocument[];
}

/** 场景机制参数允许持久化的标量类型。 */
export type MechanicParameterValue = boolean | number | string;

/** 用户选择的一项定义机制及其显式参数。 */
export interface MechanicSelectionDocument {
  id: string;
  mechanicId: string;
  enabled: boolean;
  parameters: Record<string, MechanicParameterValue>;
}

/** 当前场景启用或禁用的全部机制选择。 */
export interface ScenarioMechanicsDocument {
  selections: MechanicSelectionDocument[];
}

/** 只影响场景编辑体验、不参与战斗计算的布局设置。 */
export interface ScenarioEditorDocument {
  trackHeightWeights: [number, number, number, number];
  prepExpanded: boolean;
}

/** 一个可独立编辑、模拟或从其他场景边界继承的完整场景。 */
export interface ScenarioDocument {
  id: string;
  name: string;
  inheritance?: ScenarioInheritanceDocument;
  builds: ScenarioBuildsDocument;
  tracks: TrackListDocument;
  connections: ConnectionDocument[];
  enemy: EnemyDocument;
  battle: BattleDocument;
  mechanics: ScenarioMechanicsDocument;
  globalConfig: GlobalConfigDocument;
  editor: ScenarioEditorDocument;
}

/** 新版项目文件的顶层、带版本持久化结构。 */
export interface EndaxisProjectDocument {
  kind: typeof PROJECT_KIND;
  schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  createdWith: string;
  gameDataRevision: string;
  timeUnit: 'frame';
  fps: typeof PROJECT_FPS;
  activeScenarioId: string;
  scenarios: ScenarioDocument[];
}
