/** Xaihi 的统一 TS 整名产物；此文件提供不依赖生成文件名的稳定入口。 */
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import definition from './generated-definitions/xaihi/xaihi.operator.generated';

export const xaihi: OperatorDefinition = definition;
