import type {
  CombatStepDefinition,
  CombatStepKind,
  CombatStepParameters,
} from '../../../../packages/game-data-contract/src/actions.ts';
import type {
  ActionValueOperand,
  CombatCondition,
  TimeScaleCurveDefinition,
} from '../../../../packages/game-data-contract/src/conditions.ts';

/**
 * 公共动作投影的输出子集，不是第二套游戏 schema。
 * 字段来自独立契约；这里只声明已接入的种类、窄枚举和递归子树。
 * 扩大支持仍须修改来源解析及投影规则，不能只放宽类型。
 */
export type CompiledActionValueOperandSource = Readonly<ActionValueOperand>;

type Condition<K extends CombatCondition['kind']> = Readonly<Extract<CombatCondition, { kind: K }>>;
type Parameters<K extends CombatStepKind> = Readonly<CombatStepParameters[K]>;
type Step<
  K extends CombatStepKind,
  P extends CombatStepParameters[K] = CombatStepParameters[K],
> = Readonly<Pick<Extract<CombatStepDefinition, { kind: K }>, 'kind'>> & {
  readonly parameters: Readonly<P>;
};

// 下列目标限制分别对应当前已审计的查询、标记和技能事件，不互相替代。
type BuffQueryTarget =
  'caster' | 'enemy' | 'currentAbilityEntity' | 'eventTarget' | 'buffOwner' | 'buffSource';
type MarkerTarget = 'caster' | 'eventTarget' | 'buffOwner' | 'buffSource' | 'currentAbilityEntity';

export type CompiledBuffConditionSource =
  | Condition<
      | 'casterControlled'
      | 'deckAttributeCompare'
      | 'eventInflictionElementIn'
      | 'contextTargetCountCompare'
      | 'contextTargetObjectTypeMatch'
      | 'contextTargetBuffStackCompare'
      | 'actionValueCompare'
      | 'eventOverheal'
      | 'eventSkillCastMatchesBuffSource'
      | 'eventSkillIdIn'
      | 'eventBuffIdMatch'
      | 'eventSourceTargetMatch'
      | 'eventSourceMatchesBuffSource'
      | 'buffSourceMatchesOwner'
      | 'eventActionOwnerTargetMatch'
      | 'eventPhysicalInflictionTypeIn'
      | 'eventDamageTypeIn'
      | 'eventHealTagsMatch'
      | 'eventConsumedBuffLayerCompare'
      | 'contextTargetContains'
      | 'eventBuffTagsMatch'
      | 'eventTargetBuffCountCompare'
      | 'enemySuperArmorCompare'
      | 'probability'
    >
  | (Condition<'healthCompare'> & {
      readonly target: 'caster' | 'controlledOperator' | 'enemy';
    })
  | (Condition<'eventDamageTagsMatch'> & {
      readonly match: 'hasAny' | 'hasAll';
      readonly tags: readonly (
        'normalSkill' | 'comboSkill' | 'ultimateSkill' | 'normalAttackLastCombo'
      )[];
    })
  | (Condition<'eventSpGainMatch'> & {
      readonly sources?: readonly ['skill'];
      readonly gainKinds?: readonly ['gain'];
    })
  | (Condition<'eventSkillTypeIn'> & {
      readonly skillTypes: readonly ('battleSkill' | 'comboSkill' | 'ultimate')[];
    })
  | (Condition<'originSkillTypeIn'> & {
      readonly skillTypes: readonly (
        'basicAttack' | 'plungingAttack' | 'battleSkill' | 'comboSkill' | 'ultimate'
      )[];
    })
  | (Condition<'timedMarkerPresent'> & { readonly target: MarkerTarget })
  | (Omit<Condition<'buffStackCompare'>, 'sameSourceSkillCast'> & {
      readonly target: BuffQueryTarget;
    })
  | (Omit<Condition<'buffIdStackCompare'>, 'sameSourceSkillCast' | 'value'> & {
      readonly target: BuffQueryTarget;
      readonly value: CompiledActionValueOperandSource;
    })
  | (Condition<'entityTagMatch'> & { readonly target: BuffQueryTarget })
  | (Condition<'poiseCompare'> & { readonly target: 'enemy' })
  | (Pick<Condition<'all' | 'any'>, 'kind'> & {
      readonly conditions: readonly CompiledBuffConditionSource[];
    })
  | (Pick<Condition<'not'>, 'kind'> & {
      readonly condition: CompiledBuffConditionSource;
    });

type GlobalTimeDilation = Omit<
  Extract<Parameters<'startTimeDilation'>, { scope: 'global' }>,
  'influenceSkillCooldownSeconds' | 'curve' | 'ignoredTargets' | 'ignoredAbilityEntityTargets'
> & {
  readonly curve: Extract<TimeScaleCurveDefinition, { kind: 'inline' | 'named' }>;
  readonly ignoredTargets: readonly ('controlled' | 'caster')[];
  readonly ignoredAbilityEntityTargets?: readonly [{ readonly kind: 'ownerSpawned' }];
};
type EntityTimeDilation = Omit<
  Extract<Parameters<'startTimeDilation'>, { scope: 'entity' }>,
  'abilityEntityTargets' | 'ignoreSlotCheck' | 'curve' | 'targets'
> & {
  readonly curve: Extract<TimeScaleCurveDefinition, { kind: 'inline' | 'named' }>;
  readonly targets: readonly ('enemy' | 'caster')[];
  readonly abilityEntityTargets?: readonly [{ readonly kind: 'ownerSpawned' }];
};

type ContextTargetSource = Parameters<'mergeContextTargets'>['sources'][number];
type BuffApplicationParameters = Omit<
  Parameters<'applyBuff'>,
  'definition' | 'durationSeconds' | 'effectiveness' | 'target' | 'source'
> & {
  readonly target:
    | 'caster'
    | 'enemy'
    | 'currentAbilityEntity'
    | 'eventTarget'
    | 'eventSource'
    | 'buffOwner'
    | 'buffSource'
    | 'controlledOperator'
    | 'party'
    | 'partyExceptCaster'
    | 'partyExceptCasterAndSameCharacterType';
  readonly source?: 'enemy' | 'eventSource' | 'buffSource' | 'buffOwner' | 'currentAbilityEntity';
};

type DamageParameters = Pick<
  Parameters<'dealDamage'>,
  | 'damageType'
  | 'attackScale'
  | 'takeAttackSnapshot'
  | 'calculation'
  | 'calculationMultiplier'
  | 'tags'
  | 'features'
  | 'stagger'
  | 'staggerOnlyWhenCasterControlled'
  | 'instantAttributeModifiers'
> & {
  // 这是伤害协议的已支持子集，不是角色元素身份；值集合恰好一致也不能混用概念。
  readonly damageType: Extract<
    Parameters<'dealDamage'>['damageType'],
    'physical' | 'heat' | 'electric' | 'cryo' | 'nature'
  >;
  readonly attackScale: CompiledActionValueOperandSource;
  readonly calculation?: 'breakingAttack';
  readonly calculationMultiplier?: number;
  readonly tags: readonly (
    | 'normalAttack'
    | 'normalAttackLastCombo'
    | 'powerAttack'
    | 'plungingAttack'
    | 'dashAttack'
    | 'normalSkill'
    | 'ultimateSkill'
    | 'comboSkill'
    | 'fireAbnormal'
  )[];
  readonly features?: readonly ('canBreakWeakness' | 'dot')[];
  readonly stagger?: CompiledActionValueOperandSource;
};
export type CompiledSimpleDamageOperationSource = Step<'dealDamage', DamageParameters>;
export type CompiledSimplePoiseOperationSource = Step<'dealStagger'>;

type HealParameters = Parameters<'heal'> & {
  readonly target: 'caster' | 'controlledOperator';
  readonly amount?: CompiledActionValueOperandSource;
  readonly attribute?: 'strength' | 'agility' | 'intellect' | 'will' | 'maxHealth';
  readonly multiplier?: CompiledActionValueOperandSource;
  readonly addition?: CompiledActionValueOperandSource;
};

export type CompiledBuffStepSource =
  | Step<'triggerSpellBurst'>
  | Step<'startTimeDilation', GlobalTimeDilation | EntityTimeDilation>
  | Step<
      'startUltimateTimeDilation',
      Pick<Parameters<'startUltimateTimeDilation'>, 'priority' | 'targetScale'> & {
        readonly ignoredTargets: readonly [];
      }
    >
  | (Step<
      'withActionBlackboardScope',
      Pick<Parameters<'withActionBlackboardScope'>, 'scopeKey' | 'alwaysNext' | 'inheritParent'> & {
        readonly lifetime: 'execution';
        readonly initialValues: Readonly<Record<string, number>>;
        readonly entityInitialValues?: Readonly<Record<string, number>>;
      }
    > & { readonly body: CompiledBuffSequenceSource })
  | Step<
      'findOwnerSpawnedAbilityEntities',
      Pick<
        Parameters<'findOwnerSpawnedAbilityEntities'>,
        'saveToContextKey' | 'sameSourceSkillCast' | 'maxTargets'
      > &
        Required<Pick<Parameters<'findOwnerSpawnedAbilityEntities'>, 'abilityEntityIds'>>
    >
  | Step<
      'spawnAbilityEntity',
      Required<
        Pick<
          Parameters<'spawnAbilityEntity'>,
          'abilityEntityId' | 'inheritActionBlackboard' | 'dieWhenSourceDies'
        >
      >
    >
  | Step<'finishCurrentAbilityEntity'>
  | Step<
      'jumpTimeline',
      Pick<Parameters<'jumpTimeline'>, 'destinationFrame'> & {
        readonly condition?: CompiledBuffConditionSource;
      }
    >
  | (Step<'forEachContextTarget'> & { readonly body: CompiledBuffSequenceSource })
  | (Step<'repeatEachTick'> & { readonly body: CompiledBuffSequenceSource })
  | Step<
      'mergeContextTargets',
      Pick<Parameters<'mergeContextTargets'>, 'saveToContextKey'> & {
        readonly sources: readonly (
          | Extract<ContextTargetSource, { kind: 'context' }>
          | (Extract<ContextTargetSource, { kind: 'target' }> & {
              readonly target: 'eventTarget' | 'buffSource';
            })
        )[];
      }
    >
  | Step<'applyBuff', BuffApplicationParameters>
  | Step<'createGlobalBuff'>
  | Step<'finishParentGlobalBuff'>
  | Step<'readSkillSettingData'>
  | Step<'applyElementalInfliction'>
  | (Step<
      'conditional',
      Pick<Parameters<'conditional'>, 'alwaysNext'> & {
        readonly condition: CompiledBuffConditionSource;
      }
    > & {
      readonly whenTrue: CompiledBuffSequenceSource;
      readonly whenFalse?: CompiledBuffSequenceSource;
    })
  | Step<
      'readBuffStackCount',
      Pick<Parameters<'readBuffStackCount'>, 'outputKey'> & {
        readonly target: MarkerTarget;
        readonly countType?: 'instance';
        readonly query: Parameters<'readBuffStackCount'>['query'];
      }
    >
  | Step<'readEventBuffBlackboard'>
  | Step<'readBuffBlackboard'>
  | Step<
      'modifyActionValue',
      Parameters<'modifyActionValue'> & {
        readonly operation: 'assign' | 'add' | 'multiply' | 'divide';
      }
    >
  | Step<
      'storeSourceAttributeValue',
      Parameters<'storeSourceAttributeValue'> & {
        readonly attribute:
          | Extract<Parameters<'storeSourceAttributeValue'>['attribute'], { kind: 'specific' }>
          | { readonly kind: 'secondary' };
      }
    >
  | Step<'calculateActionValue'>
  | Step<'readCurrentBuffRemainingDuration'>
  | Step<'setCurrentBuffRemainingDuration'>
  | Step<'refreshCurrentBuffAttributeModifiers'>
  | Step<
      'changeResourceByActionValue',
      Parameters<'changeResourceByActionValue'> & {
        readonly coefficient: CompiledActionValueOperandSource;
      }
    >
  | Step<
      'gainSquadUltimateEnergyFromSkillCost',
      Omit<Parameters<'gainSquadUltimateEnergyFromSkillCost'>, 'coefficient'> & {
        readonly coefficient: number;
      }
    >
  | Step<'gainFinisherSp'>
  | Step<'restrictUltimateEnergyRecovery'>
  | Step<'adjustSkillCooldown'>
  | CompiledSimpleDamageOperationSource
  | CompiledSimplePoiseOperationSource
  | Step<'heal', HealParameters>
  | Step<
      'finishBuffsById',
      Parameters<'finishBuffsById'> & {
        readonly target:
          'buffOwner' | 'buffSource' | 'caster' | 'enemy' | 'currentAbilityEntity' | 'party';
        readonly reason: 'early' | 'other';
      }
    >
  | Step<'finishBuffsByTag'>
  | Step<'createTimedMarker', Parameters<'createTimedMarker'> & { readonly target: MarkerTarget }>
  | Step<'finishCurrentBuff', Parameters<'finishCurrentBuff'> & { readonly reason: 'other' }>;

export interface CompiledBuffSequenceSource {
  readonly steps: readonly CompiledBuffStepSource[];
}
