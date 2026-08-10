/**
 * combat-spec 生成物进入元素附着运行时的唯一数据边界。
 * 导入时必须严格校验，不能用默认值掩盖生成器与核心契约的结构漂移。
 */
import { parseCombatBuffDefinitionsDocument } from '../../core/combat/buffs/combatBuffDefinitions';
import rawDefinitions from './elemental-attachments.combat-1.4.4.json';

/** 由 combat-spec 生成；此处校验用于防止结构漂移进入运行时。 */
export const elementalAttachments = parseCombatBuffDefinitionsDocument(rawDefinitions);
