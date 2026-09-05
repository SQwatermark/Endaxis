/** 弭弗的统一 TS 整名产物；此文件提供不依赖生成文件名的稳定入口。 */
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import definition from './generated-definitions/mifu/mifu.operator.generated';

export const mifu: OperatorDefinition = definition;
