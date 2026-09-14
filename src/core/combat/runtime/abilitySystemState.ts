/** 单个实体的技能选择和延迟施放数据。技能对象及通知函数由当前战斗绑定，不存进切面。 */
import type { NativeSkillType, PlayerSkillInput } from '../../game-data/operatorDefinition';
import type { PostSkillCastRequest } from './abilitySystemRuntime';
import type { AbilitySkillPayload } from '../events/combatAbilityEvent';

/** 等待真正施放时发布的事件数据，以及 Buff 附着所用的原始技能寻址方式。 */
export interface BeforeSkillCastPreparation {
  readonly skillId: string;
  readonly castId: string | undefined;
  readonly resolveSkillSlot: boolean;
  readonly payload: Omit<AbilitySkillPayload, 'attachBuffToCurrentSkill'>;
}
import {
  createSkillOperableBoundaryState,
  type SkillOperableBoundaryState,
} from './skillOperableBoundaryRuntime';

export interface AbilitySkillSlotState {
  readonly baseSkillKey: string;
  readonly input: PlayerSkillInput;
  readonly defaultForInput: boolean;
  readonly stableInputSkillKeys: ReadonlySet<string>;
  readonly allowedSkillKeys: ReadonlySet<string>;
  currentSkillKey: string;
}

export interface AbilitySystemState {
  /** 每个槽最多保留一个有效替换；编号用于拒绝已经结束的动作再次撤销。 */
  readonly skillSlotReplacements: Map<
    string,
    {
      readonly registrationId: number;
      readonly revertedSkillKey: string;
      readonly inheritOriginSkillCooldownProgress: boolean;
    }
  >;
  nextSkillSlotReplacementId: number;
  /** 尚未结束的模式切换；删除登记即表示已经结束，不在闭包中另存 finished。 */
  readonly playerActionModeActivations: Map<
    number,
    {
      readonly layer: string;
      readonly modeId: string;
      readonly previousModeId: string | null;
    }
  >;
  nextPlayerActionModeActivationId: number;
  readonly beforeCastStarts: Map<string, BeforeSkillCastPreparation>;
  readonly operableBoundaries: SkillOperableBoundaryState;
  readonly nativeSkillTypeBySkillId: Map<string, NativeSkillType>;
  readonly skillSlotGroups: Map<string, AbilitySkillSlotState>;
  readonly activePlayerActionModeByLayer: Map<string, string>;
  readonly registeredOperableBoundaryCastIds: Set<string>;
  readonly buffBasicAttackMappings: Map<number, string>;
  nextBasicAttackMappingId: number;
  currentSkillKey: string | null;
  processingSkillKey: string | null;
  postSkillCastRequest: PostSkillCastRequest | null;
}

export function createAbilitySystemState(): AbilitySystemState {
  return {
    skillSlotReplacements: new Map(),
    nextSkillSlotReplacementId: 0,
    playerActionModeActivations: new Map(),
    nextPlayerActionModeActivationId: 0,
    beforeCastStarts: new Map(),
    operableBoundaries: createSkillOperableBoundaryState(),
    nativeSkillTypeBySkillId: new Map(),
    skillSlotGroups: new Map(),
    activePlayerActionModeByLayer: new Map(),
    registeredOperableBoundaryCastIds: new Set(),
    buffBasicAttackMappings: new Map(),
    nextBasicAttackMappingId: 0,
    currentSkillKey: null,
    processingSkillKey: null,
    postSkillCastRequest: null,
  };
}
