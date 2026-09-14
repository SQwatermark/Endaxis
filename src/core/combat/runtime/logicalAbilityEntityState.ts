/**
 * 能力实体的身份、寿命、标记、子技能与黑板数据。
 * 目录可直接绑定这些数据；子技能、子 Buff 与 reset 回调在关系阶段按保存的身份接回。
 */
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type { ActionBlackboardState } from './actionBlackboardState';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { TimedMarkerState } from './timedMarkers';
import type { BuffReference } from '../buffs/buffReference';
import type { BuffContainerState } from '../buffs/buffContainerState';
import type {
  LogicalAbilityEntityDefinition,
  LogicalAbilityEntityFinishReason,
} from './logicalAbilityEntityRuntime';
import type { PassiveAbilityEventState } from './passiveAbilityEventState';

export interface LogicalAbilityEntityState {
  /** 容器按需创建；created 为真但数据为空表示外部目标尚未接入，不能恢复。 */
  buffContainerCreated: boolean;
  buffs: BuffContainerState | null;
  readonly childSkills: AbilityEntityChildSkillState[];
  /** 该实体定义安装的原生被动 Ability，按编译被动 key 保存。 */
  readonly passiveAbilities: Map<string, PassiveAbilityEventState>;
  readonly childBuffs: BuffReference[];
  readonly resetCallbackIds: number[];
  nextResetCallbackId: number;
  readonly timedMarkers: TimedMarkerState;
  readonly skillCastInfo?: CombatSkillCastInfo | null;
  readonly instanceId: number;
  readonly abilityEntityId: string;
  readonly definition: LogicalAbilityEntityDefinition;
  readonly ownerId: string;
  readonly source: RuntimeTargetRef;
  readonly sourceSkillCastId?: number;
  target?: RuntimeTargetRef;
  readonly dieWhenSourceDies: boolean;
  readonly blackboard: ActionBlackboardState;
  remainingDurationSeconds: number | null;
  elapsedDurationSeconds: number;
  isAlive: boolean;
  pendingRelease: boolean;
  pendingReleaseElapsedSeconds: number;
  pendingReleaseReason?: LogicalAbilityEntityFinishReason;
}

export interface LogicalAbilityEntityDirectoryState {
  readonly instances: Map<number, LogicalAbilityEntityState>;
  readonly deadSources: RuntimeTargetRef[];
}
import type { AbilityEntityChildSkillState } from './abilityEntityChildSkillState';
