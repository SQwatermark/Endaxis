/** 投射物回调技能已经运行到的位置；技能与能力系统合在一起复制，保留共享引用。 */
import type { SkillRuntimeState } from './skillRuntimeState';
import type { AbilitySystemState } from './abilitySystemState';

export interface CallbackSkillHostState {
  readonly skill: SkillRuntimeState;
  readonly ability: AbilitySystemState;
}
