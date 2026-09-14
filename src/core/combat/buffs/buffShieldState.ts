/** 护盾创建时求出的参数与当前余额；参数不随来源属性之后的变化重新计算。 */
import type { DamageType } from '../../game-data/operatorDefinition';

export interface BuffShieldState {
  readonly maxValue: number;
  readonly maxAbsorbCount: number;
  readonly absorptions: Map<DamageType, readonly [number, number]>;
  remainingValue: number;
  remainingAbsorbCount: number;
  consumed: boolean;
}
