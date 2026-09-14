/** 动作持续期内创建的全局 Buff。键是动作程序绑定槽，值与全局目录共享实例数据。 */
import type { GlobalBuffInstanceState } from './globalBuffState';

export interface GlobalBuffActionState {
  readonly active: Map<number, readonly GlobalBuffInstanceState[]>;
}

export function createGlobalBuffActionState(): GlobalBuffActionState {
  return { active: new Map() };
}
