import type {
  CombatStepKind,
  CombatStepParameters,
  DamageElement,
  SkillType,
} from '../game-data/operatorDefinition';

export const PROJECT_KIND = 'EndaxisProject' as const;
export const PROJECT_SCHEMA_VERSION = 2 as const;
export const PROJECT_FPS = 30 as const;

export type JsonPrimitive = boolean | number | string | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

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

export interface WeaponBuildDocument {
  id: string;
  weaponSlug: string;
  level: number;
  tuned: boolean;
  potential: number;
  skillLevels: [number, number, number];
}

export interface GearBuildDocument {
  id: string;
  gearSlug: string;
  artificingLevels: number[];
}

export interface ScenarioBuildsDocument {
  operators: Record<string, OperatorBuildDocument>;
  weapons: Record<string, WeaponBuildDocument>;
  gears: Record<string, GearBuildDocument>;
}

export type CatalogActionSource =
  | {
      kind: 'operatorSkill';
      skillGroupKey: string;
      skillKey: string;
    }
  | {
      kind: 'weaponSkill';
      skillKey: string;
    };

export interface CustomActionDefinition {
  kind: 'custom';
  /** 用户定义的身份标识，刻意保持开放而不限制为枚举。 */
  actionType: string;
  name: string;
  element?: DamageElement;
  iconKey?: string;
}

export type SkillCastSource = CatalogActionSource | CustomActionDefinition;

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
export type EditableSkillCastField = (typeof EDITABLE_SKILL_CAST_FIELDS)[number];

type CombatStepDocumentForKind<K extends CombatStepKind> = {
  kind: K;
  parameters: CombatStepParameters[K];
  /** 仅对支持定点覆盖的定义步骤保留目录键。 */
  sourceStepKey?: string;
  /** 用户显式修改过的参数键。 */
  edited: Extract<keyof CombatStepParameters[K], string>[];
} & (K extends 'dealDamage' ? { hitId: string } : {}) &
  (K extends 'conditional'
    ? { whenTrue: ActionSequenceDocument; whenFalse?: ActionSequenceDocument }
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
 * 持续事件会在到达 `endFrame` 前不断接收更新。
 */
export interface ScheduledSequenceDocument {
  id: string;
  sourceSequenceKey?: string;
  startFrame: number;
  endFrame: number;
  sequence: ActionSequenceDocument;
  edited: ('startFrame' | 'endFrame' | 'sequence')[];
}

export interface EditableBarDocument {
  id: string;
  text: string;
  offsetFrames: number;
  durationFrames: number;
  color?: string;
}

export type EnhancementDocument =
  { kind: 'duration'; frames: number } | { kind: 'status'; statusId: string };

/**
 * 编辑器暴露的完整取值。即使数值仍等于目录默认值也会持久化，
 * `edited` 则记录该值是否已由用户接管。
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

export type TrackSlotDocument = TrackDocument | null;
export type TrackIndex = 0 | 1 | 2 | 3;
export type TrackListDocument = [
  TrackSlotDocument,
  TrackSlotDocument,
  TrackSlotDocument,
  TrackSlotDocument,
];

export type ConnectionEndpoint =
  | { kind: 'skillCast'; skillCastId: string; port?: string }
  | {
      kind: 'damageHit';
      skillCastId: string;
      hitId: string;
      port?: string;
    };

export interface ConnectionDocument {
  id: string;
  consumption: boolean;
  from: ConnectionEndpoint;
  to: ConnectionEndpoint;
}

export interface EnemyEditableValues {
  hp: number;
  defense: number;
  superArmor: number;
  finisherMultiplier: number;
  resistances: Record<string, number>;
}

export const ENEMY_EDITABLE_FIELDS = [
  'hp',
  'defense',
  'superArmor',
  'finisherMultiplier',
  'resistances',
] as const satisfies readonly (keyof EnemyEditableValues)[];

export interface EnemyDocument {
  source: { kind: 'catalog'; enemyId: string; level: number } | { kind: 'custom'; level: number };
  editable: EnemyEditableValues;
  /** `editable` 中被用户改离已捕获默认值的键。 */
  edited: (keyof EnemyEditableValues)[];
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
  staggerRules: {
    maximum: number;
    nodeCount: number;
    nodeDurationFrames: number;
    brokenDurationFrames: number;
    finisherRecovery: number;
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
export type GlobalOperatorStatModifier = (typeof GLOBAL_OPERATOR_STAT_MODIFIERS)[number];

export interface GlobalOperatorStatModifierDocument {
  id: string;
  kind: 'operatorStat';
  modifier: GlobalOperatorStatModifier;
  value: number;
  /** 仅当修正限定于某一种技能类型时需要。 */
  skillType?: SkillType;
}

export interface GlobalConfigDocument {
  modifiers: GlobalOperatorStatModifierDocument[];
}

export type MechanicParameterValue = boolean | number | string;

/** 用户选择的一项目录机制及其显式参数。 */
export interface MechanicSelectionDocument {
  id: string;
  mechanicId: string;
  enabled: boolean;
  parameters: Record<string, MechanicParameterValue>;
}

export interface ScenarioMechanicsDocument {
  selections: MechanicSelectionDocument[];
}

export interface ScenarioEditorDocument {
  trackHeightWeights: [number, number, number, number];
  prepExpanded: boolean;
}

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
