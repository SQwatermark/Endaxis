import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import type { PendingComboCondition } from './comboSkillConditionRuntime';
import type { AfterSkillCastStart } from './skillRuntime';

/**
 * 固定木桩投影：普通选敌设置、唯一有效敌人、距离为零；不模拟镜头、锁定菜单或 dummy 坐标。
 * 只归约已经指向木桩的智能候选。友方/能力实体的可选中语义不能由“只有一个敌人”推出。
 * 原生顺序见 combat-spec/docs/combo-cast-preparation.md、skill-smart-target-outer.md。
 */
export function prepareComboCast(
  program: Pick<CompiledSkillProgram, 'smartTarget'>,
  pending?: PendingComboCondition,
): AfterSkillCastStart {
  const trigger = pending === undefined ? undefined : { ...pending.triggerTarget };
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
            : pending.triggerTarget;
  if (selected !== undefined && selected.kind !== 'enemy')
    throw new Error('combo smart target requires an audited non-enemy target selection projection');
  const smartTarget = selected === undefined ? undefined : { ...selected };
  return context => {
    if (context.targetContext === undefined) throw new Error('combo cast requires target context');
    if (trigger !== undefined) context.targetContext.setSingle('trigger', trigger);
    if (smartTarget !== undefined) context.targetContext.setSingle('smart_target', smartTarget);
    // 普通 Assign 只写 direct；没有 trigger 的普通施法不能借用过期候选板。
    if (trigger !== undefined && assignPairs !== null) context.blackboard.assign(assignPairs);
  };
}
