/**
 * 被动、装备和潜能 Ability 事件宿主的可保存数据。
 *
 * 这里只记录宿主是否允许响应事件、已安装订阅的稳定引用，以及宿主持有的子 Buff 身份。
 * 事件处理函数、结束动作和 Buff 对象由恢复后的来源运行时重新绑定，不能放进切面。
 */
import type { BuffReference } from '../buffs/buffReference';
import type { AbilityEventSubscriptionReference } from '../events/abilityEventState';

export interface AbilityEventHostState {
  /** 初始化动作完成后为 true；只有此时事件响应和后续动作才可执行。 */
  enabled: boolean;
  /** 宿主已经永久结束时为 true；结束后的宿主不能再次启用或接收新关系。 */
  disposed: boolean;
  /** 按来源程序的注册顺序保存；一项注册可能同时对应多个事件目录。 */
  readonly registrations: AbilityEventSubscriptionReference[][];
  /** 宿主持有的子 Buff。结束宿主时按加入顺序结束，期间新增的子 Buff 也必须继续遍历。 */
  readonly childBuffs: BuffReference[];
}

export function createAbilityEventHostState(): AbilityEventHostState {
  return {
    enabled: false,
    disposed: false,
    registrations: [],
    childBuffs: [],
  };
}
