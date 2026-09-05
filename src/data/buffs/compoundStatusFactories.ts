/**
 * combat-spec 生成物进入复合状态工厂的唯一数据边界。
 * 定义中的未知字段或缺失引用必须在装配期失败，不能推迟到模拟中猜测。
 */
import { parseCompoundStatusFactories } from '../../core/combat/infliction/compoundStatusFactories';
import rawDefinitions from './compound-status-factories.combat-1.4.4.json';

/** 由 combat-spec 生成；此处校验用于防止结构漂移进入运行时。 */
export const compoundStatusFactories = parseCompoundStatusFactories(rawDefinitions);
