/** 末端宿主的类型边界：非时间轴程序、响应式事件和配装不得隐式获得编辑身份或施放输入。 */
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import type { CombatDamageExecutorContext } from './combatRuntimeAssembly';

declare const context: CombatDamageExecutorContext;
if (context.kind === 'skill') {
  context.program.skillId;
  context.readSimulationInputs?.();
  // @ts-expect-error 子技能执行程序没有必须存在的时间轴分组、等级和块宽。
  const timeline: CompiledSkillProgram = context.program;
  void timeline;
} else if (context.kind === 'reactive') {
  context.sourceActionId;
  // @ts-expect-error 常驻动作没有首技能属性模板。
  context.statModifiers;
  // @ts-expect-error 响应式来源不是技能程序。
  context.program;
  // @ts-expect-error 响应式来源不是时间轴施放。
  context.castId;
  // @ts-expect-error 响应式来源没有逐施放随机覆盖入口。
  context.readSimulationInputs;
} else {
  context.source;
  // @ts-expect-error 配装不继承事件触发技能程序。
  context.program;
}
