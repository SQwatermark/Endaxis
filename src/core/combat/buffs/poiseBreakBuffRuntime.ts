import type { ResolvedSkillBuffDefinition } from '../../compiler/combatProgram';
import type { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';

/** 原生固定身份；行为和倍率只能来自导出的定义。依据 combat-spec/docs/poise-break-buff.md。 */
export const POISE_BREAK_BUFF_ID = 'buff_common_poise_break_damage_taken_scale';

export class PoiseBreakBuffRuntime {
  /** 只保存当前目标容器内的实例编号，不跨分支保留 Buff 对象。 */
  constructor(
    readonly target: BuffDefinitionOperationTarget<string>,
    readonly runtimeState = new Set<number>(),
  ) {}

  begin(
    sourceId: string,
    definition: ResolvedSkillBuffDefinition | undefined,
    sourceShares?: readonly { readonly sourceId: string; readonly weight: number }[],
  ): void {
    if (definition === undefined)
      throw new Error(`poise break requires Buff definition '${POISE_BREAK_BUFF_ID}'`);
    const buff = this.target.applyScoped({
      buffId: POISE_BREAK_BUFF_ID,
      definition,
      sourceId,
      sourceActionId: 'poise-break',
      contributionSourceKind: 'stagger',
      contributionSourceShares: sourceShares?.map(share => ({
        providerOperatorId: share.sourceId,
        sourceKind: 'stagger',
        sourceId: POISE_BREAK_BUFF_ID,
        weight: share.weight,
      })),
      blackboardValues: {},
    });
    if (buff !== null) this.runtimeState.add(buff.instanceId);
  }

  recover(): void {
    // 先移交本轮句柄，避免结束副作用重入时清除下一轮登记的实例。
    const instances = [...this.runtimeState];
    this.runtimeState.clear();
    for (const instanceId of instances) {
      const buff = this.target.container.getInstance(instanceId);
      if (buff !== undefined && !buff.isFinished) buff.finish();
    }
  }
}
