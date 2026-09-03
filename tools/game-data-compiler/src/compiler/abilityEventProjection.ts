import type { AbilityEvent } from '../../../../packages/game-data-contract/src/abilityEvents.ts';
import {
  parseNativeAbilityEventName,
  type NativeAbilityEventName,
} from '../source/abilityEvent.ts';

/**
 * 原生 AbilityEvent 到公共数据契约的唯一身份映射。
 *
 * 字符串来自运行时模板/SkillActionGraph，数字来自 CharacterTemplate 的
 * TriggerComboSkillEvent。两者指向同一个原生枚举，任何消费方都必须经过这里转换；
 * 监听目标绑定和木桩模型是否会产生该事件不是身份转换的一部分。
 */
const NATIVE_ABILITY_EVENT_NAMES = {
  OnOwnerHpZero: 'ownerHpZero',
  OnOwnerDead: 'ownerDead',
  OnOwnerSwitchToCenter: 'ownerSwitchedToCenter',
  OnOwnerSwitchToGuard: 'ownerSwitchedToGuard',
  OnCustomAbilityEvent: 'customAbilityEvent',
  OnEnterFight: 'enterFight',
  OnAddedBuff: 'addedBuff',
  OnTakeDamage: 'takeDamage',
  OnOutputDamage: 'outputDamage',
  OnPoiseZero: 'poiseZero',
  OnBeforeCastSkill: 'beforeCastSkill',
  OnSkillEnd: 'skillEnd',
  OnRemoveAllPendingComboSkill: 'pendingComboSkillsCleared',
  OnBeforeOutputKnockDown: 'beforeOutputKnockDown',
  OnAfterOutputKnockDown: 'afterOutputKnockDown',
  OnTakeCriticalDamage: 'takeCriticalDamage',
  OnOutputCriticalDamage: 'outputCriticalDamage',
  OnReceiveHeal: 'receiveHeal',
  OnOutputHeal: 'outputHeal',
  OnBeforeTakePhysicalInfliction: 'beforeTakePhysicalInfliction',
  OnAfterTakePhysicalInfliction: 'afterTakePhysicalInfliction',
  OnBeforeTakeDamage: 'beforeTakeDamage',
  OnOutputBuff: 'outputBuff',
  OnBeforeDamageAction: 'beforeDamageAction',
  OnEnemyBeforeTakeSpellInfliction: 'beforeTakeInfliction',
  OnCharBeforeTakeSpellInfliction: 'beforeTakeSpellInfliction',
  OnCharBeforeOutputSpellInfliction: 'beforeOutputInfliction',
  OnCharBeforeOutputSpellBurst: 'beforeOutputSpellBurst',
  OnCharAfterOutputSpellInfliction: 'afterOutputInfliction',
  OnEnemyAfterTakeSpellInfliction: 'afterTakeInfliction',
  OnAfterOutputWeaknessTriggered: 'afterOutputWeaknessTriggered',
  OnSetWeakness: 'weaknessSet',
  OnObtainAtb: 'skillSpGained',
  OnAfterSkillApplyCost: 'afterSkillApplyCost',
  OnFinishedBuff: 'finishedBuff',
  OnBuffEndsEarly: 'buffEndsEarly',
  OnBeforeAddedBuff: 'beforeAddedBuff',
  OnBeforeOutputBuff: 'beforeOutputBuff',
  OnConsumeBuff: 'buffConsumed',
  OnAbsorbBuff: 'buffAbsorbed',
  OnBuffEnhanceChanged: 'buffEnhanceChanged',
  OnSquadTakeDamage: 'squadTakeDamage',
  OnCharDeckAttrChanged: 'deckAttributesChanged',
  OnTrulyExitFight: 'trulyExitFight',
  OnAfterKillEntity: 'afterKillEntity',
  OnPoiseKnotBreak: 'poiseKnotBreak',
  OnAbilityEntitySpawned: 'abilityEntitySpawned',
  OnAbilityEntityFinished: 'abilityEntityFinished',
  OnBeforeCalculateDamage: 'beforeCalculateDamage',
  OnBeforeOutputDamage: 'beforeOutputDamage',
  OnBeforeOutputPhysicalInfliction: 'beforeOutputPhysicalInfliction',
  OnAfterOutputPhysicalInfliction: 'afterOutputPhysicalInfliction',
} as const satisfies Readonly<Partial<Record<NativeAbilityEventName, AbilityEvent>>>;

export function projectAbilityEvent(event: string | number, sourcePath: string): AbilityEvent {
  const nativeName = nativeAbilityEventName(event, sourcePath);
  const projected =
    NATIVE_ABILITY_EVENT_NAMES[nativeName as keyof typeof NATIVE_ABILITY_EVENT_NAMES];
  if (projected === undefined) {
    throw new Error(`${sourcePath}: unsupported ability event ${JSON.stringify(event)}`);
  }
  return projected;
}

export function nativeAbilityEventName(
  event: string | number,
  sourcePath: string,
): NativeAbilityEventName {
  return parseNativeAbilityEventName(event, sourcePath);
}
