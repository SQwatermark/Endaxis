import type { AbilityEntityChildSkillDefinition } from '../../../../packages/game-data-contract/src/index.ts';
import { requireArray, requireRecord } from '../source/primitives.ts';
import { compileActiveSkillRuntimeProjectionSource } from './activeSkillRuntimeProjection.ts';

/**
 * 实体子技能与主动技能共用 SkillData 时间轴编译，只改变宿主身份及最终装配协议。
 * 子技能默认板独立于父技能等级；来源快照在实体生成时由既有运行时覆盖，不在转换时固定。
 */
export function compileAbilityEntityChildSkillSource(
  value: unknown,
  sourcePath: string,
): AbilityEntityChildSkillDefinition {
  const root = requireRecord(value, sourcePath);
  const cast = requireRecord(root.castData, `${sourcePath}.castData`);
  const cost = requireRecord(cast.costData, `${sourcePath}.castData.costData`);
  // 当前实体局部程序没有费用/冷却端口，只接入已证明不需要这些端口的无消耗子技能。
  if (
    cast.cooldownTime !== 0 ||
    cast.startCdFrame !== 0 ||
    cast.maxChargeTime !== 1 ||
    cost.costValue !== 0 ||
    cost.atbValueThreshold !== 0
  )
    throw new Error(`${sourcePath}: child skill costs, cooldown or charges are not projected`);
  if (
    requireArray(root.buffs, `${sourcePath}.buffs`).length ||
    requireArray(root.toggleBuffs, `${sourcePath}.toggleBuffs`).length
  )
    throw new Error(`${sourcePath}: child skill Buff installation is not projected`);
  const runtime = compileActiveSkillRuntimeProjectionSource({
    value,
    sourcePath,
    patch: null,
    context: {
      actionOwnerTarget: 'currentAbilityEntity',
      actionSourceTarget: 'caster',
      actionTargetTarget: 'enemy',
    },
  });
  const definition = {
    skillId: runtime.skillId,
    blackboard: runtime.blackboard,
    scheduledSequences: runtime.scheduledSequences,
  };
  // 此处只输出候选。产品侧结构/运行验证在整名门禁中完成；不能把浏览器运行引擎加载进 Node 来源编译器。
  return definition;
}
