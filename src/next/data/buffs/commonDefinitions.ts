import { generatedCommonBuffDefinitions } from '../operators/generated/commonBuffDefinitions.generated';
import type { OperatorBuffDefinitions } from '../../core/game-data/operatorDefinition';
import { commonBuffDefinitions as avywennaCommonBuffDefinitions } from '../operators/generated-definitions/avywenna/avywenna.operator.generated';
import { commonBuffDefinitions as akekuriCommonBuffDefinitions } from '../operators/generated-definitions/akekuri/akekuri.operator.generated';

/**
 * 已迁移的公共 Buff 使用统一编译器产物；其余定义暂保留旧生成基线。
 * 这是全局只读目录的版本迁移，不是将公共 Buff 放进某个干员的可编辑定义。
 */
export const commonBuffDefinitions: OperatorBuffDefinitions = Object.freeze({
  ...generatedCommonBuffDefinitions,
  ...avywennaCommonBuffDefinitions,
  ...akekuriCommonBuffDefinitions,
});
