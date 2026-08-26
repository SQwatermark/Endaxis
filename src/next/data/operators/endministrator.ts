/** 管理员由解包数据生成；产品默认潜能与旧版时间轴选择行为保持一致。 */
import { endministratorGeneratedOperator } from './generated/endministrator.operator.generated';

export const endministrator = {
  ...endministratorGeneratedOperator,
  defaultPotential: 2,
} as const;
