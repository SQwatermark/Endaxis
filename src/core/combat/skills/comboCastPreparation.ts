import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import type { ComboCastParameters } from '../state/environmentState';
import type { SkillCastStartPreparation } from '../state/foundationState';

/**
 * 固定木桩投影：普通选敌设置、唯一有效敌人、距离为零；不模拟镜头、锁定菜单或 dummy 坐标。
 * 普通智能选择先尝试候选，再回退到当前主目标。木桩环境明确提供唯一有效敌方主目标，
 * 因此友方 trigger/input 不能直接充当攻击目标，但会按原生 StoreSmartTarget 外层回退到木桩。
 * 原生顺序见 combat-spec/docs/combo-cast-preparation.md、skill-smart-target-outer.md。
 */
export function prepareComboCast(
  program: Pick<CompiledSkillProgram, 'smartTarget'>,
  pending?: ComboCastParameters,
): SkillCastStartPreparation {
  const trigger = pending?.triggerTarget == null ? undefined : { ...pending.triggerTarget };
  const assignPairs = pending?.assignPairs == null ? null : { ...pending.assignPairs };
  const selected =
    program.smartTarget === undefined
      ? undefined
      : program.smartTarget === 'enemy'
        ? { kind: 'enemy' as const }
        : pending === undefined
          ? { kind: 'enemy' as const } // 无候选的手工排轴：固定有效主目标。
          : program.smartTarget === 'input'
            ? pending.inputTarget
            : (pending.triggerTarget ?? undefined);
  const smartTarget =
    selected === undefined
      ? undefined
      : selected.kind === 'enemy'
        ? { ...selected }
        : { kind: 'enemy' as const };
  return {
    ...(trigger === undefined ? {} : { trigger }),
    ...(smartTarget === undefined ? {} : { smartTarget }),
    assignPairs,
  };
}
