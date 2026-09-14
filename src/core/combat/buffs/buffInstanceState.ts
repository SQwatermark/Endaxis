/**
 * 一个 Buff 已迁移的运行数据，由实例统一持有，避免各模块自行保存后破坏共享引用。
 * 容器先按该数据重建实例和动作，再在关系阶段解析父子 Buff 与跨对象引用。
 * 单独复制此结构不等于完成环境恢复；定义程序和当前分支对象目录仍由装配层提供。
 */
import { createBuffLifecycleState, type BuffLifecycleState } from './buffLifecycleState';
import { createBuffTriggerState, type BuffTriggerState } from './buffTriggerState';
import { createBuffAttributeState, type BuffAttributeState } from './buffAttributeState';
import { createBuffChildrenState, type BuffChildrenState } from './buffChildrenState';
import type { BuffShieldState } from './buffShieldState';
import type { HealModifier } from '../heal/healModifiers';
import type { PoiseModifier } from '../damage/poiseModifiers';
import type { DamageModifierState } from '../damage/damageModifierState';
import type { CombatSkillCastInfo } from '../runtime/skillCastInfo';
import type { SharedSpGainModifier } from '../resources/sharedSpGainModifiers';
import type { BuffActionHostState } from '../state/instanceState';

export interface BuffInstanceIdentity {
  readonly ownerId: string;
  readonly instanceId: number;
  readonly definitionId: string;
  readonly sourceId: string;
}
import { createActionBlackboardState, type ActionBlackboardState } from '../state/actionState';

export interface BuffInstanceState<Key extends string> {
  actionHost: BuffActionHostState | null;
  /** onRecycled 回调的稳定登记顺序；函数由恢复后的宿主按编号重绑。 */
  readonly recycleCallbackIds: number[];
  nextRecycleCallbackId: number;
  sharedSpGainModifiers: readonly SharedSpGainModifier[];
  readonly identity: BuffInstanceIdentity;
  sourceActionId: string;
  definitionOwnerId: string;
  /** null 表示创建时没有显式的来源属性读取目标；否则恢复时必须按实体身份接回读取端口。 */
  sourceAttributeOwnerId: string | null;
  skillCastInfo: CombatSkillCastInfo | null;
  priority: number;
  damageModifiers: readonly DamageModifierState[];
  healModifiers: readonly HealModifier[];
  poiseModifiers: readonly PoiseModifier[];
  readonly shields: BuffShieldState[];
  readonly blackboard: ActionBlackboardState;
  readonly lifecycle: BuffLifecycleState;
  readonly trigger: BuffTriggerState;
  readonly attributes: BuffAttributeState<Key>;
  readonly children: BuffChildrenState;
}

export function createBuffInstanceState<Key extends string>(
  identity: BuffInstanceIdentity,
  blackboard: ActionBlackboardState = createActionBlackboardState(),
): BuffInstanceState<Key> {
  return {
    actionHost: null,
    recycleCallbackIds: [],
    nextRecycleCallbackId: 0,
    sharedSpGainModifiers: [],
    identity,
    sourceActionId: identity.definitionId,
    definitionOwnerId: identity.sourceId,
    sourceAttributeOwnerId: null,
    skillCastInfo: null,
    priority: 0,
    damageModifiers: [],
    healModifiers: [],
    poiseModifiers: [],
    shields: [],
    blackboard,
    lifecycle: createBuffLifecycleState(),
    trigger: createBuffTriggerState(),
    attributes: createBuffAttributeState<Key>(),
    children: createBuffChildrenState(),
  };
}
