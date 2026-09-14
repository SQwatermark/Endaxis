/** 容器的成员编号、标签计数与添加冷却。成员对象和动作注册表仍在绑定层。 */
import type { GameplayTag } from '../tags/gameplayTags';
import type { BuffInstanceState } from './buffInstanceState';
import type { BuffStackingState } from './buffStackingState';
import type { BuffShieldState } from './buffShieldState';
import type { HealModifier } from '../heal/healModifiers';
import type { PoiseModifier } from '../damage/poiseModifiers';
import type { DamageModifierState } from '../damage/damageModifierState';
import type { SharedSpGainModifierState } from '../resources/sharedSpGainModifiers';
import {
  createCombatAttributeState,
  type CombatAttributeState,
} from '../attributes/combatAttributeState';
import {
  createActionBlackboardState,
  type ActionBlackboardState,
} from '../runtime/actionBlackboardState';

export interface BuffContainerState<Key extends string = string> {
  readonly sharedSpGainModifiers: SharedSpGainModifierState | null;
  readonly damageModifiers: DamageModifierState[];
  readonly healModifiers: HealModifier[];
  readonly poiseModifiers: PoiseModifier[];
  readonly activeShields: BuffShieldState[];
  readonly sustainedProtections: Map<BuffInstanceState<Key>, readonly [number, number]>;
  readonly attributes: CombatAttributeState<Key>;
  readonly entityBlackboard: ActionBlackboardState;
  /** 已完成创建的实例数据；尚在 Start 中的实例可能还未进入发布列表。 */
  readonly instances: Map<number, BuffInstanceState<Key>>;
  readonly stackingGroups: Map<string, BuffStackingState>;
  /** 发布顺序，区别于分配顺序；Start 中新建的子实例可能先发布。 */
  readonly memberIds: number[];
  nextInstanceId: number;
  releasing: boolean;
  readonly entityTagCounts: Map<GameplayTag, number>;
  readonly addingCooldowns: Map<string, number[]>;
}

export function createBuffContainerState<Key extends string = string>(
  attributes: CombatAttributeState<Key> = createCombatAttributeState<Key>(),
  entityBlackboard: ActionBlackboardState = createActionBlackboardState(),
  sharedSpGainModifiers: SharedSpGainModifierState | null = null,
): BuffContainerState<Key> {
  return {
    sharedSpGainModifiers,
    damageModifiers: [],
    healModifiers: [],
    poiseModifiers: [],
    activeShields: [],
    sustainedProtections: new Map(),
    attributes,
    entityBlackboard,
    instances: new Map(),
    stackingGroups: new Map(),
    memberIds: [],
    nextInstanceId: 1,
    releasing: false,
    entityTagCounts: new Map(),
    addingCooldowns: new Map(),
  };
}
