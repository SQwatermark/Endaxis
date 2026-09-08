import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import type { CombatBuff } from '../buffs/combatBuffs';
import type { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';

/** 原生固定身份；行为和倍率只能来自导出的定义。依据 combat-spec/docs/poise-break-buff.md。 */
export const POISE_BREAK_BUFF_ID = 'buff_common_poise_break_damage_taken_scale';

export class PoiseBreakBuffRuntime {
  readonly #instances = new Set<CombatBuff<string>>();
  constructor(readonly target: BuffDefinitionOperationTarget<string>) {}

  begin(sourceId: string, definition: ResolvedSkillBuffDefinition | undefined): void {
    if (definition === undefined)
      throw new Error(`poise break requires Buff definition '${POISE_BREAK_BUFF_ID}'`);
    const buff = this.target.applyScoped({
      buffId: POISE_BREAK_BUFF_ID,
      definition,
      sourceId,
      sourceActionId: 'poise-break',
      blackboardValues: {},
    });
    if (buff !== null) this.#instances.add(buff);
  }

  recover(): void {
    // 先移交本轮句柄，避免结束副作用重入时清除下一轮登记的实例。
    const instances = [...this.#instances];
    this.#instances.clear();
    for (const buff of instances) if (!buff.isFinished) buff.finish();
  }
}
