/**
 * 把当前版本的严格元素 Buff 定义装配成单敌人运行时。
 * 本模块是版本化游戏数据与通用战斗核心的组合边界；定义缺少的爆发或复合状态仍会明确失败。
 */
import type { CombatAttributeSet } from '../../core/combat/attributes/combatAttributes';
import {
  createCombatBuffDefinitionAttributeReader,
  type CombatAttributeEntityRegistry,
} from '../../core/combat/attributes/combatAttributeEntities';
import { compileCombatBuffDefinitions } from '../../core/combat/buffs/combatBuffDefinitions';
import type { ElementalInflictionStartedPayload } from '../../core/combat/infliction/elementalInflictionBuffAdapter';
import { ElementalBuffRuntime } from '../../core/combat/runtime/elementalBuffRuntime';
import type { GameplayTagRegistry } from '../../core/combat/tags/gameplayTags';
import { elementalAttachments } from './elementalAttachments';

export interface CreateEnemyElementalBuffRuntimeOptions<Key extends string> {
  readonly attributes: CombatAttributeSet<Key>;
  /**
   * 敌方 Buff 读取施加者属性时使用的单场战斗实体索引。
   * 当前定义未包含 StoreAttributeValue 时可以省略；定义开始使用后，缺失会在编译阶段报错。
   */
  readonly attributeEntities?: CombatAttributeEntityRegistry<Key>;
  readonly tagRegistry?: GameplayTagRegistry;
  readonly emitElementalInflictionStarted: (payload: ElementalInflictionStartedPayload) => void;
  /** 法术爆发触发端口；定义包含爆发 Buff 时必须提供。 */
  readonly onSpellBurstTriggered?: (payload: {
    readonly burstType: string;
    readonly sourceId: string;
  }) => void;
}

/** 为一次模拟创建独立容器；返回值不得跨场景或重跑复用。 */
export function createEnemyElementalBuffRuntime<Key extends string>(
  options: CreateEnemyElementalBuffRuntimeOptions<Key>,
): ElementalBuffRuntime<Key> {
  const index = compileCombatBuffDefinitions<Key>(elementalAttachments, {
    emitElementalInflictionStarted: payload => options.emitElementalInflictionStarted(payload),
    ...(options.onSpellBurstTriggered === undefined
      ? {}
      : { onSpellBurstTriggered: options.onSpellBurstTriggered }),
    readAttribute:
      options.attributeEntities === undefined
        ? (_request, buff) => {
            throw new Error(
              `enemy elemental Buff '${buff.definition.id}' reads source attributes without an attribute entity registry`,
            );
          }
        : createCombatBuffDefinitionAttributeReader(options.attributeEntities),
  });
  return new ElementalBuffRuntime({
    ownerId: 'enemy',
    attributes: options.attributes,
    index,
    tagRegistry: options.tagRegistry,
  });
}
