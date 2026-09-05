/** 管理员的统一 TS 整名产物；产品默认潜能与旧版时间轴选择行为保持一致。 */
import definition from './generated-definitions/endministrator/endministrator.operator.generated';

export const endministrator = {
  ...definition,
  defaultPotential: 2,
} as const;
