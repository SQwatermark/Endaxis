/**
 * 标准战斗环境的可变数据，直接引用实际账本。
 * 环境对象可以绑定此数据；Buff 容器、来源处理函数和跨对象关系仍由整场装配恢复。
 */
import type { CombatVitalsState } from './combatVitalsState';
import type { SimulationRandomState } from '../random/simulationRandomState';
import type { OrdinaryKnockDownState } from './ordinaryKnockDownState';
import type { BuffProgressRecorderState } from './buffProgressRecorder';
import type { ElementalReaction } from '../../game-data/operatorDefinition';
import type { ElementalReactionState } from '../infliction/elementalReactionState';
import type { PostSkillRequestListenerState } from './postSkillRequestListenerState';

export interface StandardCombatEnvironmentState {
  /** 暴击与概率取样共用的数据；外部样本源未提供完整状态时为 null。 */
  readonly random: SimulationRandomState | null;
  readonly enemyVitals: CombatVitalsState;
  readonly operatorVitals: Map<string, CombatVitalsState>;
  readonly reactions: Map<ElementalReaction, ElementalReactionState>;
  readonly knockDown: OrdinaryKnockDownState | null;
  readonly buffProgress: BuffProgressRecorderState;
  /** 失衡恢复时清理的敌人 Buff 实例编号，保留登记顺序。 */
  readonly poiseBreakBuffs: Set<number>;
  /** SkillAffix 使用的预施法请求监听顺序；处理函数由当前分支重绑。 */
  readonly postSkillRequestListeners: PostSkillRequestListenerState;
}
