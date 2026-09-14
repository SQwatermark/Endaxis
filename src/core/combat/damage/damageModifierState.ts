/** 伤害修正的归属、定义和取值来源；条件程序只记录存在标记，执行绑定另行提供。 */
import type { DamageModifierDefinition } from '../../../../packages/game-data-contract/src/modifiers.ts';
import type { BuffModifierNumberSource } from '../buffs/buffModifierNumberSource';

export interface DamageModifierState {
  readonly ownerId: string;
  readonly definition: DamageModifierDefinition;
  readonly numberSource: BuffModifierNumberSource | undefined;
  readonly sourceSkillCastId: number | null;
  readonly hasConditionProgram: boolean;
}
