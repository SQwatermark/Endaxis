/**
 * 把当前版本的严格元素 Buff 目录装配成单敌人运行时。
 * 本模块是版本化游戏数据与通用战斗核心的组合边界；目录缺少的爆发或复合状态仍会明确失败。
 */
import type { CombatAttributeSet } from '../../core/combat/attributes/combatAttributes';
import { compileCombatBuffCatalog } from '../../core/combat/buffs/combatBuffCatalog';
import type { ElementalInflictionStartedPayload } from '../../core/combat/infliction/elementalInflictionBuffAdapter';
import { ElementalBuffRuntime } from '../../core/combat/runtime/elementalBuffRuntime';
import type { GameplayTagRegistry } from '../../core/combat/tags/gameplayTags';
import { elementalAttachmentCatalog } from './elementalAttachmentCatalog';

export interface CreateEnemyElementalBuffRuntimeOptions<Key extends string> {
  readonly attributes: CombatAttributeSet<Key>;
  readonly tagRegistry?: GameplayTagRegistry;
  readonly emitElementalInflictionStarted: (payload: ElementalInflictionStartedPayload) => void;
}

/** 为一次模拟创建独立容器；返回值不得跨场景或重跑复用。 */
export function createEnemyElementalBuffRuntime<Key extends string>(
  options: CreateEnemyElementalBuffRuntimeOptions<Key>,
): ElementalBuffRuntime<Key> {
  const catalog = compileCombatBuffCatalog<Key>(elementalAttachmentCatalog, {
    emitElementalInflictionStarted: payload => options.emitElementalInflictionStarted(payload),
  });
  return new ElementalBuffRuntime({
    ownerId: 'enemy',
    attributes: options.attributes,
    catalog,
    tagRegistry: options.tagRegistry,
  });
}
