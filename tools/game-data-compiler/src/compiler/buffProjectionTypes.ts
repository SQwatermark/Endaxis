import type {
  BuffPriority,
  BuffShieldDefinition,
  CombatBuffDefinitionNumberOperand,
  CombatBuffPresentation,
  CombatBuffDefinitionAttributeModifier,
  CombatBuffDefinitionDamageModifier,
  CombatBuffDefinitionDamageProcessor,
  SkillBuffAbilityEventResponse,
  SkillBuffIgniteEventResponse,
  SkillBuffDefinition,
  SkillBuffLifecycleSequences,
} from '../../../../packages/game-data-contract/src/buffs.ts';
import type {
  DamageModifierCondition,
  HealModifierCondition,
  HealModifierDefinition,
  PoiseModifierCondition,
  PoiseModifierDefinition,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
import type { CompiledBuffSequenceSource } from './combatActionProjectionTypes.ts';

/** Buff 蓝图的公共输出子集。安装参数、来源身份和运行状态不进入本模块。 */
export type CompiledBuffNumberSource = CombatBuffDefinitionNumberOperand;

/** 输出字段来自独立契约；此处只声明当前投影保证写出的字段与支持子集。 */
export type CompiledBuffPresentationSource = Required<
  Omit<CombatBuffPresentation, 'nameKey' | 'iconId' | 'iconPath'>
> &
  Pick<CombatBuffPresentation, 'nameKey' | 'iconId' | 'iconPath'>;

export type CompiledBuffAttributeModifierSource = Pick<
  CombatBuffDefinitionAttributeModifier,
  'attribute' | 'slot' | 'value'
>;

type CompiledBuffDamageConditionLeaf =
  | Extract<
      DamageModifierCondition,
      {
        readonly kind:
          | 'sourceSkillCastMatch'
          | 'casterControlled'
          | 'buffBlackboardCompare'
          | 'eventDamageTypesMatch'
          | 'targetHealthCompare'
          | 'targetPoiseCompare';
      }
    >
  | (Extract<DamageModifierCondition, { readonly kind: 'eventDamageTagsMatch' }> & {
      readonly match: 'hasAny' | 'hasAll';
      readonly tags: readonly (
        'normalSkill' | 'comboSkill' | 'ultimateSkill' | 'normalAttackLastCombo'
      )[];
    })
  | (Extract<
      DamageModifierCondition,
      { readonly kind: 'entityTagMatch' | 'buffIdCountCompare' }
    > & {
      readonly target: 'caster' | 'enemy';
    });

export interface CompiledBuffDamageModifierSource extends Pick<
  CombatBuffDefinitionDamageModifier,
  'enabledSide'
> {
  readonly condition?:
    | CompiledBuffDamageConditionLeaf
    | (Extract<DamageModifierCondition, { readonly kind: 'all' }> & {
        readonly conditions: readonly CompiledBuffDamageConditionLeaf[];
      });
  readonly processors: readonly Extract<
    CombatBuffDefinitionDamageProcessor,
    { readonly kind: 'damageScale' | 'instantAttribute' }
  >[];
}

export interface CompiledBuffHealModifierSource extends Pick<
  HealModifierDefinition,
  'enabledSide'
> {
  readonly condition?: HealModifierCondition;
  readonly processors: readonly Extract<
    HealModifierDefinition['processors'][number],
    { readonly kind: 'modifyHealingIncrease' | 'modifyCalculationResult' }
  >[];
}

type CompiledBuffPoiseConditionLeaf =
  | Extract<PoiseModifierCondition, { readonly kind: 'casterControlled' }>
  | (Extract<PoiseModifierCondition, { readonly kind: 'eventDamageTagsMatch' }> & {
      readonly tags: readonly ['normalAttackLastCombo'];
    });

export interface CompiledBuffPoiseModifierSource extends Pick<
  PoiseModifierDefinition,
  'enabledSide' | 'processors'
> {
  readonly condition?:
    | CompiledBuffPoiseConditionLeaf
    | (Extract<PoiseModifierCondition, { readonly kind: 'all' }> & {
        readonly conditions: readonly CompiledBuffPoiseConditionLeaf[];
      });
}

/** 根字段和生命周期字段均来自契约，只保留当前公共投影能够产生的部分。 */
export type CompiledBuffDefinitionSource = Pick<
  SkillBuffDefinition,
  | 'stackingType'
  | 'stackingKey'
  | 'durationSeconds'
  | 'triggerIntervalSeconds'
  | 'waitFirstTriggerInterval'
  | 'maxTriggerCount'
> &
  Required<Pick<SkillBuffDefinition, 'maxStackCount' | 'applyTags' | 'extendTags'>> & {
    readonly priority:
      | CompiledBuffNumberSource
      | (Extract<BuffPriority, { readonly blackboardKey: string }> & { readonly negate: true });
    readonly timeClock?: Extract<SkillBuffDefinition['timeClock'], 'global' | 'self'>;
    readonly presentation?: CompiledBuffPresentationSource;
    readonly blackboard: Readonly<Record<string, number | string>>;
    readonly attributeModifiers: readonly CompiledBuffAttributeModifierSource[];
    readonly damageModifiers?: readonly CompiledBuffDamageModifierSource[];
    readonly healModifiers?: readonly CompiledBuffHealModifierSource[];
    readonly poiseModifiers?: readonly CompiledBuffPoiseModifierSource[];
    readonly scheduledSequences?: readonly {
      readonly startFrame: number;
      readonly endFrame: number;
      readonly sequence: CompiledBuffSequenceSource;
    }[];
    readonly shields?: readonly (Omit<BuffShieldDefinition, 'value'> & {
      readonly value:
        | CompiledBuffNumberSource
        | {
            readonly attributeSource?: 'buffOwner' | 'buffSource';
            readonly attribute: string;
            readonly multiplier: CompiledBuffNumberSource;
            readonly addition: CompiledBuffNumberSource;
          };
    })[];
    readonly lifecycleSequences?: Readonly<
      Partial<
        Record<
          Extract<
            keyof SkillBuffLifecycleSequences,
            'start' | 'enable' | 'trigger' | 'enhanceChanged' | 'afterEnhance' | 'finish'
          >,
          CompiledBuffSequenceSource
        >
      >
    >;
    readonly abilityEventResponses?: readonly (Pick<SkillBuffAbilityEventResponse, 'priority'> & {
      readonly event: Extract<
        SkillBuffAbilityEventResponse['event'],
        | 'beforeCastSkill'
        | 'afterSkillApplyCost'
        | 'skillEnd'
        | 'beforeCalculateDamage'
        | 'beforeDamageAction'
        | 'beforeTakeDamage'
        | 'beforeTakePhysicalInfliction'
        | 'takeDamage'
        | 'takeCriticalDamage'
        | 'beforeTakeInfliction'
        | 'outputBuff'
        | 'beforeOutputBuff'
        | 'beforeAddedBuff'
        | 'addedBuff'
        | 'beforeOutputPhysicalInfliction'
        | 'beforeOutputKnockDown'
        | 'afterOutputKnockDown'
        | 'afterOutputPhysicalInfliction'
        | 'afterOutputWeaknessTriggered'
        | 'customAbilityEvent'
        | 'outputDamage'
        | 'beforeOutputInfliction'
        | 'beforeOutputSpellBurst'
        | 'outputCriticalDamage'
        | 'outputHeal'
        | 'receiveHeal'
        | 'poiseZero'
        | 'skillEnd'
        | 'finishedBuff'
        | 'buffEndsEarly'
        | 'afterKillEntity'
        | 'buffConsumed'
        | 'enterFight'
        | 'skillSpGained'
      >;
      readonly sequence: CompiledBuffSequenceSource;
    })[];
    readonly igniteEventResponses?: readonly (Pick<
      SkillBuffIgniteEventResponse,
      'igniteType' | 'finishAfterIgnited'
    > & {
      readonly sequence: CompiledBuffSequenceSource;
    })[];
  };
