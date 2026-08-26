import { applyOperatorRuntimeDefinition } from '../../core/game-data/operatorRuntimeDefinition';
import { arcaneGeneratedOperator } from './generated/arcane.operator.generated';
import runtime from './generated-runtime/arcane/arcane.runtime.generated';

/** 迁移期动作保留旧产物，角色常驻运行定义由统一 TS 编译器接管。 */
export const arcane = applyOperatorRuntimeDefinition(arcaneGeneratedOperator, runtime);
