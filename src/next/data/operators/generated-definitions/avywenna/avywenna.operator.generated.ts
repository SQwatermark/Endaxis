/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachContextTarget,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const avywennaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0012_avywen_attack1',
    timelineBlockFrames: 8,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0012_avywen_attack1:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.06 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        8,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.17, 0.18, 0.2, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.37] },
);

export const avywennaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0012_avywen_attack2',
    timelineBlockFrames: 14,
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0012_avywen_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.07 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        8,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.37, 0.39, 0.41, 0.45, 0.48] },
);

export const avywennaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0012_avywen_attack3',
    timelineBlockFrames: 10,
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0012_avywen_attack3:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        8,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.21, 0.23, 0.25, 0.27, 0.29, 0.31, 0.33, 0.35, 0.37, 0.39, 0.43, 0.46] },
);

export const avywennaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0012_avywen_attack4',
    timelineBlockFrames: 22,
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0012_avywen_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.05 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 0.5 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
              tags: ['normalAttack'],
            },
            'chr_0012_avywen_attack4:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.22 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 0.5 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        19,
      ),
    ],
  },
  {
    atb: 0,
    atk_scale: [0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.23],
    atk_scale_2: [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
    display_atk_scale: [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const avywennaBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0012_avywen_attack5',
    timelineBlockFrames: 45,
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        24,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'normalAttackLastCombo'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0012_avywen_attack5:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.3 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        25,
      ),
    ],
  },
  {
    atb: 19,
    atk_scale: [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.13],
    poise: 17,
  },
);

export const avywennaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0012_avywen_power_attack',
    timelineBlockFrames: 29,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        27,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.3,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0012_avywen_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        28,
      ),
      scheduled(
        28,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.2,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0012_avywen_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.1 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'constant', value: 0 },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'default',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        29,
      ),
      scheduled(
        29,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.5,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0012_avywen_power_attack:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.5 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'constant', value: 0 },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'default',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        30,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_full_immune_medium',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        44,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_power_attack_disable_cast_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        29,
      ),
    ],
  },
  { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
);

export const avywennaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0012_avywen_plunging_attack_end',
    timelineBlockFrames: 11,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0012_avywen_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8] },
);

export const avywennaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0012_avywen_normal_skill',
    timelineBlockFrames: 34,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'lances',
            abilityEntityIds: [
              'abilityentity_chr_0012_avywen_combo_skill_lance',
              'abilityentity_chr_0012_avywen_ultimate_skill',
            ],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'lances',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              step('modifyActionValue', {
                key: 'lance_count',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
        3,
      ),
      scheduled(
        18,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })),
          ),
        ),
        21,
      ),
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0012_avywen_normal_skill:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.15 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        21,
      ),
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'lances',
            abilityEntityIds: [
              'abilityentity_chr_0012_avywen_combo_skill_lance',
              'abilityentity_chr_0012_avywen_ultimate_skill',
            ],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'lances',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              step('modifyActionValue', {
                key: 'lance_count',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              forEachContextTarget(
                'lances',
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 0 },
                      operator: 'lessOrEqual',
                      right: { kind: 'constant', value: 50 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0012_avywen_lance_becalled_ready',
                        target: 'currentAbilityEntity',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        6,
      ),
      scheduled(
        7,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'ComboLances',
            abilityEntityIds: ['abilityentity_chr_0012_avywen_combo_skill_lance'],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'ComboLances',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              step('modifyActionValue', {
                key: 'lance_count',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              forEachContextTarget(
                'ComboLances',
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 0 },
                      operator: 'lessOrEqual',
                      right: { kind: 'constant', value: 50 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0012_avywen_lance_becalled',
                        target: 'currentAbilityEntity',
                        inheritSourceSkillCastInfo: true,
                      }),
                      withActionBlackboardScope(
                        'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:projectile_chr_0012_avywen_combo_skill_lance_back',
                        {},
                        true,
                        sequence(
                          withActionBlackboardScope(
                            'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back',
                            {
                              atk_scale_lance: 3,
                              poise_lance: 0,
                              potential_5_rate: 0,
                              radius: 4,
                              talent0_usp: 0,
                            },
                            true,
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'constant', value: 1 },
                                  operator: 'greaterOrEqual',
                                  right: { kind: 'constant', value: 1 },
                                },
                                sequence(
                                  step('modifyActionValue', {
                                    key: 'EntityBB_talent0',
                                    operation: 'assign',
                                    value: { kind: 'blackboard', key: 'talent0_usp' },
                                  }),
                                  branch(
                                    {
                                      kind: 'all',
                                      conditions: [
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'potential_5_rate' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        {
                                          kind: 'buffStackCompare',
                                          target: 'enemy',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/Affixes/Vulnerable/VulnerablePulse',
                                          ],
                                          operator: 'greaterOrEqual',
                                          value: { kind: 'constant', value: 1 },
                                        },
                                      ],
                                    },
                                    sequence(
                                      step('modifyActionValue', {
                                        key: 'atk_scale_lance',
                                        operation: 'multiply',
                                        value: { kind: 'blackboard', key: 'potential_5_rate' },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'electric',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_lance',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_lance' },
                                        },
                                        'chr_0012_avywen_normal_skill:/scheduledSequences/4/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/1/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'electric',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_lance',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_lance' },
                                        },
                                        'chr_0012_avywen_normal_skill:/scheduledSequences/4/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/1/whenFalse/steps/0',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                              ),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                          withActionBlackboardScope(
                            'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back_reach',
                            { atk_scale: 3, radius: 4 },
                            true,
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'constant', value: 0 },
                                  operator: 'equal',
                                  right: { kind: 'constant', value: 1 },
                                },
                                sequence(
                                  step('startTimeDilation', {
                                    scope: 'global',
                                    durationSeconds: { kind: 'constant', value: 0.2 },
                                    slot: 'TimeDilation/Layer/Entity/HitStop',
                                    priority: 10,
                                    curve: {
                                      kind: 'inline',
                                      keys: [
                                        {
                                          time: 0,
                                          value: 0.2,
                                          inTangent: 0.04379496,
                                          outTangent: 0.04379496,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                        {
                                          time: 0.8847446,
                                          value: 0.2387474,
                                          inTangent: 0.04379496,
                                          outTangent: 6.604918,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                        {
                                          time: 1,
                                          value: 1,
                                          inTangent: 6.604918,
                                          outTangent: 6.604918,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                      ],
                                    },
                                    finishByAction: false,
                                    ignoredTargets: ['controlled'],
                                  }),
                                ),
                                sequence(
                                  step('startTimeDilation', {
                                    scope: 'global',
                                    durationSeconds: { kind: 'constant', value: 0.2 },
                                    slot: 'TimeDilation/Layer/Entity/HitStop',
                                    priority: 10,
                                    curve: {
                                      kind: 'inline',
                                      keys: [
                                        {
                                          time: 0,
                                          value: 0.2,
                                          inTangent: 0.04379496,
                                          outTangent: 0.04379496,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                        {
                                          time: 0.8847446,
                                          value: 0.2387474,
                                          inTangent: 0.04379496,
                                          outTangent: 6.604918,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                        {
                                          time: 1,
                                          value: 1,
                                          inTangent: 6.604918,
                                          outTangent: 6.604918,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                      ],
                                    },
                                    finishByAction: false,
                                    ignoredTargets: ['controlled'],
                                  }),
                                ),
                                { alwaysNext: true },
                              ),
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'EntityBB_talent0' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'buffIdStackCompare',
                                      target: 'caster',
                                      buffIds: ['buff_chr_0012_avywen_talent_0'],
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 1 },
                                    },
                                    sequence(
                                      step('changeResourceByActionValue', {
                                        resource: 'ultimateEnergy',
                                        amount: { kind: 'blackboard', key: 'EntityBB_talent0' },
                                        coefficient: { kind: 'constant', value: 1 },
                                        recipient: 'caster',
                                      }),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                        ),
                        { EntityBB_talent0: 0 },
                        { lifetime: 'execution' },
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        10,
      ),
      scheduled(
        7,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'UltiLances',
            abilityEntityIds: ['abilityentity_chr_0012_avywen_ultimate_skill'],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'UltiLances',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              step('modifyActionValue', {
                key: 'lance_count',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              forEachContextTarget(
                'UltiLances',
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 0 },
                      operator: 'lessOrEqual',
                      right: { kind: 'constant', value: 50 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0012_avywen_lance_becalled',
                        target: 'currentAbilityEntity',
                        inheritSourceSkillCastInfo: true,
                      }),
                      withActionBlackboardScope(
                        'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:projectile_chr_0012_avywen_ultimate_skill_lance_back',
                        {},
                        true,
                        sequence(
                          withActionBlackboardScope(
                            'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_ultimate_skill_lance_back',
                            {
                              atk_scale_lance_ult: 3,
                              poise_lance: 0,
                              poise_lance_ult: 0,
                              potential_5_rate: 0,
                              radius: 4,
                              talent0_usp: 0,
                            },
                            true,
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'constant', value: 1 },
                                  operator: 'greaterOrEqual',
                                  right: { kind: 'constant', value: 1 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0012_avywen_lance_pulse_check',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                  step('modifyActionValue', {
                                    key: 'EntityBB_talent0',
                                    operation: 'assign',
                                    value: { kind: 'blackboard', key: 'talent0_usp' },
                                  }),
                                  branch(
                                    {
                                      kind: 'all',
                                      conditions: [
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'potential_5_rate' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        {
                                          kind: 'buffStackCompare',
                                          target: 'enemy',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/Affixes/Vulnerable/VulnerablePulse',
                                          ],
                                          operator: 'greaterOrEqual',
                                          value: { kind: 'constant', value: 1 },
                                        },
                                      ],
                                    },
                                    sequence(
                                      step('modifyActionValue', {
                                        key: 'atk_scale_lance_ult',
                                        operation: 'multiply',
                                        value: { kind: 'blackboard', key: 'potential_5_rate' },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'electric',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_lance_ult',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_lance_ult' },
                                        },
                                        'chr_0012_avywen_normal_skill:/scheduledSequences/5/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/2/whenTrue/steps/1',
                                      ),
                                      step('startTimeDilation', {
                                        scope: 'entity',
                                        durationSeconds: { kind: 'constant', value: 0.4 },
                                        slot: 'TimeDilation/Layer/Entity/HitStop',
                                        priority: 10,
                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                        finishByAction: false,
                                        targets: ['enemy', 'caster'],
                                      }),
                                    ),
                                    sequence(
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'electric',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_lance_ult',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_lance_ult' },
                                        },
                                        'chr_0012_avywen_normal_skill:/scheduledSequences/5/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/2/whenFalse/steps/0',
                                      ),
                                      step('startTimeDilation', {
                                        scope: 'entity',
                                        durationSeconds: { kind: 'constant', value: 0.4 },
                                        slot: 'TimeDilation/Layer/Entity/HitStop',
                                        priority: 10,
                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                        finishByAction: false,
                                        targets: ['enemy', 'caster'],
                                      }),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                              ),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                          withActionBlackboardScope(
                            'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back_reach',
                            { atk_scale: 3, radius: 4 },
                            true,
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'constant', value: 0 },
                                  operator: 'equal',
                                  right: { kind: 'constant', value: 1 },
                                },
                                sequence(
                                  step('startTimeDilation', {
                                    scope: 'global',
                                    durationSeconds: { kind: 'constant', value: 0.2 },
                                    slot: 'TimeDilation/Layer/Entity/HitStop',
                                    priority: 10,
                                    curve: {
                                      kind: 'inline',
                                      keys: [
                                        {
                                          time: 0,
                                          value: 0.2,
                                          inTangent: 0.04379496,
                                          outTangent: 0.04379496,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                        {
                                          time: 0.8847446,
                                          value: 0.2387474,
                                          inTangent: 0.04379496,
                                          outTangent: 6.604918,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                        {
                                          time: 1,
                                          value: 1,
                                          inTangent: 6.604918,
                                          outTangent: 6.604918,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                      ],
                                    },
                                    finishByAction: false,
                                    ignoredTargets: ['controlled'],
                                  }),
                                ),
                                sequence(
                                  step('startTimeDilation', {
                                    scope: 'global',
                                    durationSeconds: { kind: 'constant', value: 0.2 },
                                    slot: 'TimeDilation/Layer/Entity/HitStop',
                                    priority: 10,
                                    curve: {
                                      kind: 'inline',
                                      keys: [
                                        {
                                          time: 0,
                                          value: 0.2,
                                          inTangent: 0.04379496,
                                          outTangent: 0.04379496,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                        {
                                          time: 0.8847446,
                                          value: 0.2387474,
                                          inTangent: 0.04379496,
                                          outTangent: 6.604918,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                        {
                                          time: 1,
                                          value: 1,
                                          inTangent: 6.604918,
                                          outTangent: 6.604918,
                                          weightedMode: 0,
                                          inWeight: 0,
                                          outWeight: 0,
                                        },
                                      ],
                                    },
                                    finishByAction: false,
                                    ignoredTargets: ['controlled'],
                                  }),
                                ),
                                { alwaysNext: true },
                              ),
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'EntityBB_talent0' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'buffIdStackCompare',
                                      target: 'caster',
                                      buffIds: ['buff_chr_0012_avywen_talent_0'],
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 1 },
                                    },
                                    sequence(
                                      step('changeResourceByActionValue', {
                                        resource: 'ultimateEnergy',
                                        amount: { kind: 'blackboard', key: 'EntityBB_talent0' },
                                        coefficient: { kind: 'constant', value: 1 },
                                        recipient: 'caster',
                                      }),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                        ),
                        { EntityBB_talent0: 0 },
                        { lifetime: 'execution' },
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        10,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
  },
  {
    atk_scale: [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    atk_scale_lance: [0.75, 0.82, 0.9, 0.97, 1.04, 1.12, 1.19, 1.27, 1.34, 1.44, 1.55, 1.68],
    atk_scale_lance_ult: [1.92, 2.11, 2.3, 2.5, 2.69, 2.88, 3.07, 3.26, 3.46, 3.7, 3.98, 4.32],
    cam_angle: 0,
    cam_duration: 0.3,
    input_angle: 0,
    lance_count: 0,
    poise: 5,
    poise_lance: 5,
    poise_lance_ult: 10,
    potential_5_rate: 0,
    talent0_usp: 0,
  },
);

export const avywennaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0012_avywen_combo_skill',
    timelineBlockFrames: 21,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        14,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0012_avywen_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[4]:projectile_chr_0012_avywen_combo_skill_lance_out',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0012_avywen_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[4]:chr_0012_avywen_combo_skill_lance_gene',
                { atk_scale_lance_back: 1, potential_2: 0, radius: 4, talent_atb_gain: 0 },
                true,
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0012_avywen_combo_skill_lance',
                    inheritActionBlackboard: true,
                    dieWhenSourceDies: false,
                  }),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        15,
      ),
      scheduled(
        14,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0012_avywen_combo_skill:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0012_avywen_talent_0'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'talent0_usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
          ),
        ),
        15,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        12,
      ),
    ],
    cooldownFrames: [390, 390, 390, 390, 390, 390, 390, 390, 390, 390, 390, 360],
  },
  {
    atk_scale: [1.69, 1.86, 2.03, 2.19, 2.36, 2.53, 2.7, 2.87, 3.04, 3.25, 3.5, 3.8],
    atk_scale_lance_back: 1,
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    poise_lance: 0,
    potential_2: 0,
    radius: 4,
    talent0_usp: 0,
    usp: 10,
    lance_duration: 30,
  },
);

export const avywennaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0012_avywen_ultimate_skill',
    timelineBlockFrames: 57,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        30,
      ),
      scheduled(
        0,
        sequence(
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        45,
      ),
      scheduled(
        45,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0012_avywen_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:projectile_chr_0012_avywen_ultimate_skill_lance_out',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0012_avywen_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:chr_0012_avywen_ultimate_skill_lance_gene',
                {
                  atk_scale_ulti_lance_back: 0,
                  potential_2: 0,
                  radius: 4,
                  talent_atb_gain_ulti: 0,
                },
                true,
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0012_avywen_ultimate_skill',
                    inheritActionBlackboard: true,
                    dieWhenSourceDies: false,
                  }),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        48,
      ),
      scheduled(
        51,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'pulse_vul_duration' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0012_avywen_ultimate_skill_debuff',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  pulse_vul_rate: { kind: 'blackboard', key: 'pulse_vul_rate' },
                  pulse_vul_duration: { kind: 'blackboard', key: 'pulse_vul_duration' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0012_avywen_ultimate_skill:/scheduledSequences/3/sequence/steps/1',
          ),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0012_avywen_talent_0'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'talent0_usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
          ),
        ),
        54,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_ult_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        65,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
  },
  {
    atk_scale: [4.22, 4.64, 5.07, 5.49, 5.91, 6.33, 6.75, 7.18, 7.6, 8.13, 8.76, 9.5],
    atk_scale_ulti_lance_back: 1,
    poise: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
    poise_lance: 0,
    potential_2: 0,
    pulse_vul_duration: 0,
    pulse_vul_rate: 0,
    radius: 5,
    talent0_usp: 0,
    lance_duration_ult: 30,
    pulse_resist_down_duration: [5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8],
    pulse_resist_down_rate: [0.3, 0.32, 0.32, 0.32, 0.32, 0.34, 0.34, 0.34, 0.34, 0.36, 0.38, 0.4],
  },
);

export const commonBuffDefinitions = {
  buff_common_affixes_vulnerable_pulse: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Skill/Character/Common/Affixes/Vulnerable',
      'Skill/Character/Common/Affixes/Vulnerable/VulnerableSpell',
      'Skill/Character/Common/Affixes/Vulnerable/VulnerablePulse',
    ],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_vulnerable_pulse_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'electricVulnerabilityIncrease',
        slot: 'baseAddition',
        value: { blackboardKey: 'rate' },
      },
    ],
    lifecycleSequences: {
      enable: sequence(
        step('applyBuff', {
          buffId: { blackboardKey: 'child_buff_id' },
          target: 'buffOwner',
          source: 'buffOwner',
          inheritSourceSkillCastInfo: true,
          finishByAction: true,
          asChildBuff: true,
          blackboardAssignments: {
            rate: { kind: 'blackboard', key: 'rate' },
            duration: { kind: 'blackboard', key: 'duration' },
          },
        }),
      ),
    },
  },
  buff_common_affixes_vulnerable_pulse_default_child: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    presentation: {
      visible: true,
      iconId: 'icon_battle_affix_pulse_vulnerable',
      iconPath: '/icons/icon_battle_affix_pulse_vulnerable.webp',
      showInHeadBarCommon: true,
      showInHeadBarAttached: false,
      showInSquadIcon: true,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'LifeTime',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
    },
    applyTags: [],
    extendTags: [],
    blackboard: { duration: 0, rate: 0.2 },
    attributeModifiers: [],
  },
  buff_common_damage_immune_ult_skill: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Status/DodgeDamageImmune',
      'Status/SkillDamageImmune',
      'Immune/SpellInflictOnChar/All',
    ],
    extendTags: [],
    blackboard: { duration: 9999 },
    attributeModifiers: [],
  },
  buff_common_full_immune_medium: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Immune/Stunned',
      'Immune/Frozen',
      'Immune/Airborne',
      'Immune/KnockDown',
      'Immune/KnockBack',
      'Immune/Pull',
      'Immune/Poise',
      'Status/DodgeDamageImmune',
      'Status/SkillDamageImmune',
      'Immune/SpellInflictOnChar/All',
    ],
    extendTags: [],
    blackboard: { duration: 9999 },
    attributeModifiers: [],
  },
  buff_common_power_attack_disable_cast_skill: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    applyTags: [
      'Status/DisableDash',
      'Status/CantSwitchOutCenter',
      'Status/DisableNormalSkill',
      'Status/DisableCastComboSkill',
      'Status/Unjumpable',
    ],
    extendTags: [],
    blackboard: {},
    attributeModifiers: [],
  },
} as const satisfies OperatorBuffDefinitions;

export default {
  slug: 'avywenna',
  gameId: 'AVYWENNA',
  rarity: 5,
  weaponType: 'polearm',
  element: 'electric',
  role: 'striker',
  mainAttribute: 'will',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [12, 33, 54, 75, 96, 107],
    agility: [10, 31, 52, 74, 95, 106],
    intellect: [14, 34, 56, 78, 99, 110],
    will: [15, 43, 73, 103, 133, 148],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        avywennaBasicAttack1,
        avywennaBasicAttack2,
        avywennaBasicAttack3,
        avywennaBasicAttack4,
        avywennaBasicAttack5,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: avywennaFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: avywennaPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: avywennaBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: avywennaComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: avywennaUltimate },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent0_usp',
          operation: 'assign',
          value: [3, 4],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent0_usp',
          operation: 'assign',
          value: [3, 4],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent0_usp',
          operation: 'assign',
          value: [3, 4],
        },
      ],
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0012_avywen_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
        }),
      ),
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'pulse_vul_rate',
          operation: 'assign',
          value: [0.06, 0.1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'pulse_vul_duration',
          operation: 'assign',
          value: [10, 10],
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent0_usp',
          operation: 'add',
          value: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent0_usp',
          operation: 'add',
          value: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent0_usp',
          operation: 'add',
          value: 2,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_2',
          operation: 'assign',
          value: 20,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_2',
          operation: 'assign',
          value: 20,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['will'], value: 15 },
        { kind: 'addStaticDamageIncrease', target: 'electric', value: 0.08 },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5_rate',
          operation: 'assign',
          value: 1.15,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0012_avywen_lance_becalled: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0012_avywen_lance_becalled_ready: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0012_avywen_lance_pulse_check: {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: 0.3,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'buffOwner',
              buffIds: ['buff_chr_0012_avywen_lance_pulse_check'],
              operator: 'lessOrEqual',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              step('applyElementalInfliction', {
                element: 'electric',
                isExtra: false,
                target: 'buffOwner',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0012_avywen_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0012_avywen_ultimate_skill_debuff: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'pulse_vul_duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { pulse_vul_duration: 10, pulse_vul_rate: 0.3 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_pulse',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'pulse_vul_duration' },
              rate: { kind: 'blackboard', key: 'pulse_vul_rate' },
            },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0012_avywen_combo_skill_lance: {
      lifetime: { kind: 'limited', durationSeconds: 62 },
      childSkill: {
        skillId: 'chr_0012_avywen_combo_skill_lance',
        blackboard: { atk_scale_lance: 1, poise_lance: 0, potential_2: 0, talent_atb_gain: 0 },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 1500,
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0012_avywen_lance_becalled'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              }),
            ),
            1500,
          ),
          scheduled(1500, sequence(step('finishCurrentAbilityEntity', {})), 1501),
          scheduled(
            900,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_2' },
                  operator: 'less',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(step('finishCurrentAbilityEntity', {})),
              ),
            ),
            901,
          ),
          scheduled(1500, sequence(step('finishCurrentAbilityEntity', {})), 1501),
        ],
      },
    },
    abilityentity_chr_0012_avywen_ultimate_skill: {
      lifetime: { kind: 'limited', durationSeconds: 62 },
      childSkill: {
        skillId: 'chr_0012_avywen_ultimate_skill_lance',
        blackboard: {
          atk_scale_lance_ult: 1,
          poise_lance_ult: 0,
          potential_2: 0,
          talent_atb_gain_ulti: 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 1500,
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0012_avywen_lance_becalled'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              }),
            ),
            1500,
          ),
          scheduled(1500, sequence(step('finishCurrentAbilityEntity', {})), 1501),
          scheduled(
            900,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_2' },
                  operator: 'less',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(step('finishCurrentAbilityEntity', {})),
              ),
            ),
            901,
          ),
          scheduled(1500, sequence(step('finishCurrentAbilityEntity', {})), 1501),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
