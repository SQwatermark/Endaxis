import { parseCompoundStatusFactoryCatalog } from '../../core/combat/infliction/compoundStatusFactoryCatalog';
import rawCatalog from './compound-status-factories.combat-1.4.4.json';

/** 由 combat-spec 生成；此处校验用于防止结构漂移进入运行时。 */
export const compoundStatusFactoryCatalog = parseCompoundStatusFactoryCatalog(rawCatalog);
