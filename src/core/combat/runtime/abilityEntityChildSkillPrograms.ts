/**
 * 一场战斗内能力实体子技能的固定程序目录。
 * 子技能实例生成时登记已克隆的动作程序，切面只保存编号；同一切面树共享此目录。
 */
import type { CompiledAbilityEntityChildSkillProgram } from '../../compiler/combatProgram';
import { DamageCalculationSnapshotProgram } from './damageCalculationSnapshots';

export interface AbilityEntityChildSkillProgramBinding {
  readonly id: number;
  readonly program: CompiledAbilityEntityChildSkillProgram;
  readonly damageSnapshots: DamageCalculationSnapshotProgram;
}

export class AbilityEntityChildSkillPrograms {
  readonly #byProgram = new WeakMap<CompiledAbilityEntityChildSkillProgram, number>();
  readonly #entries: AbilityEntityChildSkillProgramBinding[] = [];

  register(program: CompiledAbilityEntityChildSkillProgram): AbilityEntityChildSkillProgramBinding {
    const existing = this.#byProgram.get(program);
    if (existing !== undefined) return this.#entries[existing]!;
    const binding = {
      id: this.#entries.length,
      program,
      damageSnapshots: new DamageCalculationSnapshotProgram(),
    };
    this.#entries.push(binding);
    this.#byProgram.set(program, binding.id);
    return binding;
  }

  resolve(id: number): AbilityEntityChildSkillProgramBinding {
    const binding = this.#entries[id];
    if (binding === undefined) {
      throw new Error(`AbilityEntity child skill program '${id}' does not exist`);
    }
    return binding;
  }
}
