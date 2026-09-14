/**
 * 保存当前分支普通干员技能的程序绑定。
 * 保存和恢复复制登记表，已绑定的编译程序和伤害快照槽位映射继续共享，不重新编号。
 */
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import { DamageCalculationSnapshotProgram } from './damageCalculationSnapshots';

export interface CombatSkillProgramBinding {
  /** 即时施放复用的固定定义；program 仅额外携带本次寻址身份，动作树不复制。 */
  readonly definition?: CompiledSkillProgram;
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

  /** 复制登记关系，固定程序和步骤槽位继续共享；新登记只属于返回的分支。 */
  fork(): CombatSkillPrograms {
    const branch = new CombatSkillPrograms();
    for (const [key, binding] of this.#entries) branch.#entries.set(key, binding);
    return branch;
  }

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

  registerCast(definition: CompiledSkillProgram, castId: string): CombatSkillProgramBinding {
    if (definition.castId !== undefined || castId.length === 0) {
      throw new Error('dynamic cast requires an unbound definition and a non-empty cast id');
    }
    const key = `${definition.operatorId}\u0000${definition.skillId}\u0000${castId}`;
    const existing = this.#entries.get(key);
    if (existing !== undefined) {
      if (existing.definition !== definition)
        throw new Error(`combat cast '${key}' uses another definition`);
      return existing;
    }
    const binding = {
      key,
      definition,
      program: { ...definition, castId },
      damageSnapshots: this.register(definition).damageSnapshots,
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
