/** 末端宿主的类型边界：非时间轴程序、响应式事件和配装不得隐式获得编辑身份或施放输入。 */
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import type { CombatDamageOrigin } from '../damage/combatDamageOrigin';
import type { AbilityEventResponseScope } from '../events/abilityEventResponseContext';
import type { CombatOperationContext } from '../skills/skillRuntime';
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

// 末端投影继续保留宿主种类，不能把事件或 Buff 的来源施法拼成执行技能。

declare const origin: CombatDamageOrigin;
if (origin.kind === 'skill') {
  const executingSkillId: string = origin.executingSkillId;
  void executingSkillId;
} else {
  const sourceActionId: string = origin.sourceActionId;
  const noSkill: undefined = origin.skillId;
  void sourceActionId;
  void noSkill;
  // @ts-expect-error 响应式/配装来源不能携带技能专属属性，即使来自已有对象而非字面量。
  const borrowedModifiers: CombatDamageOrigin = { ...origin, statModifiers: { criticalRate: 1 } };
  // @ts-expect-error 触发事件的技能不能成为当前执行技能。
  const borrowedSkill: CombatDamageOrigin = { ...origin, executingSkillId: 'trigger-skill' };
  // @ts-expect-error Buff 来源施放不是当前时间轴放置块。
  const borrowedCast: CombatDamageOrigin = { ...origin, castId: 'buff-source-cast' };
  void borrowedModifiers;
  void borrowedSkill;
  void borrowedCast;
}

// 无技能的合法常驻动作无需伪造技能模板或事件来源。
const reactiveOrigin: CombatDamageOrigin = {
  kind: 'reactive',
  operatorId: 'owner',
  sourceOperatorId: 'source',
  sourceActionId: 'passive',
};
// 子技能有执行身份，但不强求时间轴施放或玩家技能分类。
const childSkillOrigin: CombatDamageOrigin = {
  kind: 'skill',
  operatorId: 'owner',
  sourceOperatorId: 'source',
  skillId: 'child',
  executingSkillId: 'child',
};
void reactiveOrigin;
void childSkillOrigin;

declare const operation: CombatOperationContext;
const responseScope: AbilityEventResponseScope = operation;
responseScope.event = undefined;
responseScope.eventSkillCastInfo = null;
// @ts-expect-error 临时事件绑定不能改写技能/Buff 自身保存的来源施法。
responseScope.skillCastInfo = operation.skillCastInfo;
// @ts-expect-error 事件发布者不能改写 Buff 来源。
responseScope.buffSourceId = 'event-source';
// @ts-expect-error 事件目标不能改写动作宿主。
responseScope.actionOwnerId = 'event-target';
// @ts-expect-error 当前执行 Buff 不属于事件作用域可写字段。
responseScope.executingBuff = operation.executingBuff;
