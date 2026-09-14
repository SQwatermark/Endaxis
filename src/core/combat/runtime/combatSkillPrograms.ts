/**
 * 保存普通干员技能在同一切面树中共享的固定程序绑定。
 * 战斗切面只复制技能数据；已编译技能和伤害快照槽位映射由本目录共享，恢复时不得重新编号。
 */
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import { DamageCalculationSnapshotProgram } from './damageCalculationSnapshots';

export interface CombatSkillProgramBinding {
  readonly key: string;
  readonly program: CompiledSkillProgram;
  readonly damageSnapshots: DamageCalculationSnapshotProgram;
}

export function combatSkillProgramKey(program: CompiledSkillProgram): string {
  return `${program.operatorId}\u0000${program.skillId}\u0000${program.castId ?? ''}`;
}

/** 同一技能身份只能绑定同一个已编译程序对象。 */
export class CombatSkillPrograms {
  readonly #entries = new Map<string, CombatSkillProgramBinding>();

  register(program: CompiledSkillProgram): CombatSkillProgramBinding {
    const key = combatSkillProgramKey(program);
    const existing = this.#entries.get(key);
    if (existing !== undefined) {
      if (existing.program !== program) {
        throw new Error(`combat skill program '${key}' is already bound to another definition`);
      }
      return existing;
    }
    const binding = {
      key,
      program,
      damageSnapshots: new DamageCalculationSnapshotProgram(),
    };
    this.#entries.set(key, binding);
    return binding;
  }

  resolve(key: string): CombatSkillProgramBinding {
    const binding = this.#entries.get(key);
    if (binding === undefined) throw new Error(`combat skill program '${key}' does not exist`);
    return binding;
  }
}
