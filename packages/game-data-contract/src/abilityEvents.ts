/**
 * AbilitySystem 同步事件的公共语义身份。
 *
 * Buff、装备、技能监听与连携条件只是在不同生命周期中注册监听者；它们不得各自
 * 发明一套事件名称。具体事件是否会在简化战斗模型中产生、以及 Input/Trigger 的
 * 目标绑定是否已有证据，由运行时能力门禁负责。
 */
export const ABILITY_EVENTS = [
  'enterFight',
  'ownerHpZero',
  'abilityEntitySpawned',
  'abilityEntityFinished',
  'beforeTakeDamage',
  'beforeCalculateDamage',
  'beforeDamageAction',
  'beforeOutputDamage',
  'beforeTakePhysicalInfliction',
  'afterTakePhysicalInfliction',
  'beforeOutputPhysicalInfliction',
  'afterOutputPhysicalInfliction',
  'beforeOutputKnockDown',
  'afterOutputKnockDown',
  'beforeOutputInfliction',
  'afterOutputInfliction',
  'beforeOutputSpellBurst',
  'beforeTakeSpellInfliction',
  'beforeTakeInfliction',
  'afterTakeInfliction',
  'takeDamage',
  'takeCriticalDamage',
  'outputDamage',
  'outputCriticalDamage',
  'outputKnockDown',
  'outputHeal',
  'receiveHeal',
  'poiseZero',
  'poiseKnotBreak',
  'beforeCastSkill',
  'afterSkillApplyCost',
  'skillEnd',
  'beforeOutputBuff',
  'beforeAddedBuff',
  'outputBuff',
  'addedBuff',
  'finishedBuff',
  'buffEndsEarly',
  'afterOutputWeaknessTriggered',
  'weaknessSet',
  'customAbilityEvent',
  'afterKillEntity',
  'buffConsumed',
  'buffAbsorbed',
  'skillSpGained',
] as const;

export type AbilityEvent = (typeof ABILITY_EVENTS)[number];

export type AbilityEventActionContextEndpoint = 'eventSource' | 'eventTarget';
export type AbilityEventTriggerEndpoint = AbilityEventActionContextEndpoint | null;

/**
 * 已由原生事件发布链证明的动作环境双方身份。
 * InputTarget 是事件动作读取 TargetSource.Target 时得到的对端；Trigger 是实际发布者。
 * 未列出的事件不能用于需要完整动作环境的监听器或连携条件。
 */
export const ABILITY_EVENT_ACTION_CONTEXT_BINDINGS = {
  abilityEntitySpawned: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  abilityEntityFinished: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  beforeAddedBuff: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  addedBuff: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  beforeOutputBuff: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  outputBuff: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  beforeTakeDamage: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  beforeOutputDamage: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  takeDamage: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  outputDamage: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  buffEndsEarly: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  beforeOutputInfliction: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  beforeOutputPhysicalInfliction: {
    inputTarget: 'eventTarget',
    triggerTarget: 'eventSource',
  },
  beforeTakeInfliction: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  afterOutputInfliction: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  afterTakeInfliction: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  afterTakePhysicalInfliction: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  poiseZero: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  poiseKnotBreak: { inputTarget: 'eventSource', triggerTarget: 'eventTarget' },
  outputHeal: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  buffConsumed: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  buffAbsorbed: { inputTarget: 'eventTarget', triggerTarget: 'eventSource' },
  weaknessSet: {
    inputTarget: 'eventSource',
    triggerTarget: null,
    /** SetWeaknessAction 的发布者就是弱点所属敌人；固定木桩可保留该身份。 */
    fixedStumpInputTarget: 'enemy',
  },
} as const satisfies Partial<
  Record<
    AbilityEvent,
    {
      readonly inputTarget: AbilityEventActionContextEndpoint;
      /** null 对应 DoesEventHaveTarget=false；不得把 InputTarget 偷填为 trigger。 */
      readonly triggerTarget: AbilityEventTriggerEndpoint;
      readonly fixedStumpInputTarget?: 'enemy';
    }
  >
>;

export type ActionContextBoundAbilityEvent = keyof typeof ABILITY_EVENT_ACTION_CONTEXT_BINDINGS;

export const ACTION_CONTEXT_BOUND_ABILITY_EVENTS = Object.freeze(
  Object.keys(ABILITY_EVENT_ACTION_CONTEXT_BINDINGS) as ActionContextBoundAbilityEvent[],
);
