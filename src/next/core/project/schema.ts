import type {
  CombatStepKind,
  CombatStepParameters,
  DamageElement,
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
  /** User-defined identity; intentionally open rather than an enum. */
  actionType: string;
  name: string;
  element?: DamageElement;
  iconKey?: string;
}

export type SkillCastSource = CatalogActionSource | CustomActionDefinition;

export type EditableSkillCastField =
  | 'durationFrames'
  | 'cooldownFrames'
  | 'comboFollowupDelayFrames'
  | 'triggerWindowFrames'
  | 'enhancement'
  | 'spCost'
  | 'ultimateEnergyCost'
  | 'linked'
  | 'locked'
  | 'disabled'
  | 'color'
  | 'scheduledSequences'
  | 'customBars';

type CombatStepDocumentForKind<K extends CombatStepKind> = {
  kind: K;
  parameters: CombatStepParameters[K];
  /** Catalog key retained only for a definition step that supports targeted overrides. */
  sourceStepKey?: string;
  /** Parameter keys explicitly changed by the user. */
  edited: Extract<keyof CombatStepParameters[K], string>[];
} & (K extends 'dealDamage' ? { hitId: string } : {}) &
  (K extends 'conditional'
    ? { whenTrue: ActionSequenceDocument; whenFalse?: ActionSequenceDocument }
    : {});

/** A normalized combat operation whose kind determines its payload shape. */
export type CombatStepDocument = {
  [K in CombatStepKind]: CombatStepDocumentForKind<K>;
}[CombatStepKind];

/** Children execute synchronously in this exact order. */
export interface ActionSequenceDocument {
  steps: CombatStepDocument[];
}

/**
 * One scheduled sequence relative to its enclosing skill cast. A point entry
 * has equal start/end frames; a running entry receives updates until endFrame.
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
 * Complete values exposed by the editor. Values are persisted even when they
 * still equal their catalog defaults, while `edited` records user ownership.
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

/** One user-authored skill cast placed on an operator track. */
export interface SkillCastDocument {
  id: string;
  source: SkillCastSource;
  placement: {
    /** User-authored logical position. Runtime shifts are derived. */
    startFrame: number;
  };
  /** Present when one library operation placed multiple casts as a sequence. */
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

export interface EnemyDocument {
  source: { kind: 'catalog'; enemyId: string; level: number } | { kind: 'custom'; level: number };
  editable: EnemyEditableValues;
  /** Keys in `editable` that the user changed from the captured defaults. */
  edited: (keyof EnemyEditableValues)[];
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
  cycleBoundaries: JsonObject[];
  switchEvents: JsonObject[];
  initialEffects: JsonObject[];
  initialEnemyState?: JsonObject;
}

export interface ScenarioEditorDocument {
  trackHeightWeights: [number, number, number, number];
  prepExpanded: boolean;
}

export interface ScenarioDocument {
  id: string;
  name: string;
  builds: ScenarioBuildsDocument;
  tracks: TrackListDocument;
  connections: ConnectionDocument[];
  enemy: EnemyDocument;
  battle: BattleDocument;
  globalConfig: JsonObject;
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
