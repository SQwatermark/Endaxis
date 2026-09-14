/**
 * SkillAffix 等待技能及其衍生对象结束的计数数据。
 * 待施放请求只占一份引用，真正开始时转交给技能；不同技能开始则释放这份引用。
 * 此处保存事件、预施放请求及对象回收回调的稳定登记编号；函数由恢复后的绑定层提供。
 * 因此复制此数据不会复制旧分支闭包，但完整恢复仍必须提供当前分支的对象解析端口。
 */
import type { AbilityEntityTargetRef } from '../../game-data/logicalAbilityEntity';
import type { BuffReference } from '../buffs/buffReference';
import type { AbilityResponseEventName } from '../events/combatAbilityEvent';
import type { AbilityEventSubscriptionReference } from '../events/abilityEventState';

export type SkillAffixObjectReference =
  | {
      readonly kind: 'entity';
      readonly target: AbilityEntityTargetRef;
      readonly resetRegistrationId: number;
    }
  | {
      readonly kind: 'buff';
      readonly reference: BuffReference;
      readonly recycleRegistrationId: number;
    };

export interface SkillAffixState {
  readonly instanceId: number;
  readonly objectReferences: Map<number, SkillAffixObjectReference>;
  /** 五类原生回调按事件保存实际订阅；恢复时不得重新登记。 */
  readonly eventSubscriptions: Map<AbilityResponseEventName, AbilityEventSubscriptionReference[]>;
  /** 非 AbilityEvent 的预施法请求登记；null 表示宿主没有提供该端口。 */
  postSkillRequestRegistrationId: number | null;
  nextObjectReferenceId: number;
  readonly skillCastId: number;
  references: number;
  pendingRequest: boolean;
  disposed: boolean;
}

export function createSkillAffixState(instanceId: number, skillCastId: number): SkillAffixState {
  return {
    instanceId,
    objectReferences: new Map(),
    eventSubscriptions: new Map(),
    postSkillRequestRegistrationId: null,
    nextObjectReferenceId: 1,
    skillCastId,
    references: 1,
    pendingRequest: false,
    disposed: false,
  };
}

export function releaseSkillAffixReference(state: SkillAffixState): boolean {
  if (state.disposed) return false;
  return --state.references <= 0;
}

export function prepareSkillAffixRequest(
  state: SkillAffixState,
  skillCastId: number | undefined,
): void {
  if (state.disposed || state.pendingRequest || skillCastId !== state.skillCastId) return;
  state.references++;
  state.pendingRequest = true;
}

/** 返回是否需要由执行端释放那份等待请求的引用。 */
export function startSkillAffixCast(state: SkillAffixState, skillCastId: number): boolean {
  if (state.disposed) return false;
  if (skillCastId === state.skillCastId) {
    if (state.pendingRequest) state.pendingRequest = false;
    else state.references++;
    return false;
  }
  if (!state.pendingRequest) return false;
  state.pendingRequest = false;
  return true;
}
