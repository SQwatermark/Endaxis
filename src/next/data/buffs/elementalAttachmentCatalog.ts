import { parseCombatBuffCatalogDocument } from '../../core/combat/buffs/combatBuffCatalog';
import rawCatalog from './elemental-attachments.combat-1.4.4.json';

/** 由 combat-spec 生成；此处校验用于防止结构漂移进入运行时。 */
export const elementalAttachmentCatalog = parseCombatBuffCatalogDocument(rawCatalog);
