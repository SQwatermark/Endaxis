/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const fluoriteBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0022_bounda_attack1',
    timelineBlockFrames: 22,
    exclusiveFrame: 25,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack1.actionGroupData.timelineActions[5]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack1.actionGroupData.timelineActions[5]._sequenceActionData.actionData[1]:chr_0022_bounda_attack1_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0022_bounda_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        14,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56] },
);

export const fluoriteBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0022_bounda_attack2',
    timelineBlockFrames: 15,
    exclusiveFrame: 20,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack2.actionGroupData.timelineActions[4]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack2.actionGroupData.timelineActions[4]._sequenceActionData.actionData[1]:chr_0022_bounda_attack2_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0022_bounda_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                ),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        12,
      ),
    ],
  },
  {
    atb: 0,
    atk_scale: [0.33, 0.36, 0.39, 0.42, 0.46, 0.49, 0.52, 0.55, 0.59, 0.63, 0.67, 0.73],
    display_atk_scale: [0.33, 0.36, 0.39, 0.42, 0.46, 0.49, 0.52, 0.55, 0.59, 0.63, 0.67, 0.73],
  },
);

export const fluoriteBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0022_bounda_attack3',
    timelineBlockFrames: 18,
    exclusiveFrame: 25,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0022_bounda_attack3_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0022_bounda_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
                    sequence(
                      branch(
                        { kind: 'casterControlled' },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'atb' },
                            coefficient: { kind: 'constant', value: 0.3333333 },
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
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        10,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.26, 0.28, 0.31, 0.33, 0.36, 0.38, 0.41, 0.43, 0.46, 0.49, 0.53, 0.57] },
);

export const fluoriteBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0022_bounda_attack4',
    timelineBlockFrames: 52,
    exclusiveFrame: 55,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        29,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0022_bounda_attack4_projhit',
                { atb: 0, atk_scale: 0, attack_poise: 20 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack', 'normalAttackLastCombo'],
                      stagger: { kind: 'blackboard', key: 'attack_poise' },
                      staggerOnlyWhenCasterControlled: true,
                    },
                    'chr_0022_bounda_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
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
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        30,
      ),
      scheduled(
        26,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.06 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'slow' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        29,
      ),
    ],
  },
  {
    atb: 15,
    atk_scale: [0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96, 1.02, 1.08, 1.16, 1.25, 1.35],
    attack_poise: 15,
    display_atk_scale: [1.8, 1.98, 2.16, 2.34, 2.52, 2.7, 2.88, 3.06, 3.24, 3.47, 3.74, 4.05],
  },
);

export const fluoriteBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0022_bounda_attack4_1',
    timelineBlockFrames: 49,
    exclusiveFrame: 52,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        26,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_attack4_1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0022_bounda_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_attack4_1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0022_bounda_attack4_projhit',
                { atb: 0, atk_scale: 0, attack_poise: 20 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack', 'normalAttackLastCombo'],
                      stagger: { kind: 'blackboard', key: 'attack_poise' },
                      staggerOnlyWhenCasterControlled: true,
                    },
                    'chr_0022_bounda_attack4_1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'all',
                      conditions: [
                        { kind: 'casterControlled' },
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'constant', value: 1 },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                      ],
                    },
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
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        27,
      ),
      scheduled(
        23,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.06 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'slow' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        26,
      ),
    ],
  },
  {
    atb: 15,
    atk_scale: [0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96, 1.02, 1.08, 1.16, 1.25, 1.35],
    attack_poise: 15,
    display_atk_scale: [1.8, 1.98, 2.16, 2.34, 2.52, 2.7, 2.88, 3.06, 3.24, 3.47, 3.74, 4.05],
  },
);

export const fluoriteFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0022_bounda_power_attack',
    timelineBlockFrames: 22,
    exclusiveFrame: 45,
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0022_bounda_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        21,
      ),
      scheduled(
        18,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.12 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        24,
      ),
      scheduled(
        21,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.25 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        25,
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
        45,
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
        22,
      ),
    ],
  },
  { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
);

export const fluoritePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0022_bounda_plunging_attack_end',
    timelineBlockFrames: 21,
    exclusiveFrame: 20,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0022_bounda_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'default',
              }),
            ),
          ),
        ),
        6,
      ),
    ],
  },
  {
    atb: 0,
    atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    cd: 15,
    dmg_scale: 2.5,
    poise: 5,
    prob: 0.5,
  },
);

export const fluoriteBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0022_bounda_normal_skill',
    timelineBlockFrames: 35,
    exclusiveFrame: 34,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        2,
      ),
      scheduled(
        10,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0022_bounda_normal_skill_onlymark',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_normal_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[2]:projectile_chr_0022_bounda_normal_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_normal_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[2]:chr_0022_bounda_normal_skill_projhit',
                {
                  atk_scale: 0,
                  boom_up: 0,
                  duration: 0,
                  duration_potential: 0,
                  move_speed_scalar: 0,
                  poise: 30,
                  potential_lv: 0,
                },
                true,
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0022_bounda_normal_skill',
                    childSkillId: 'chr_0022_bounda_normal_skill_abilityrange',
                    inheritActionBlackboard: true,
                    dieWhenSourceDies: false,
                    target: 'enemy',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_common_affixes_slow',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'constant', value: 3.1 },
                      rate: { kind: 'blackboard', key: 'move_speed_scalar' },
                    },
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
        11,
      ),
      scheduled(
        12,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'slow' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        14,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
  },
  {
    atk_scale: [1.87, 2.06, 2.24, 2.43, 2.62, 2.8, 2.99, 3.18, 3.36, 3.6, 3.88, 4.2],
    boom_up: 0.3,
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    duration: 3,
    duration_potential: 0,
    gained_atb: 0,
    input_angle: 0,
    move_speed_scalar: 0.3,
    poise: 10,
    potential_lv: 0,
  },
);

export const fluoriteUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0022_bounda_ultimate_skill',
    timelineBlockFrames: 77,
    exclusiveFrame: 90,
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
        3,
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
        90,
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
        56,
      ),
      scheduled(
        59,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:projectile_chr_0022_bounda_ultimate_skill_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:chr_0022_bounda_ultimate_skill_1_projhit',
                { atb: 0, atk_scale1: 0, poise: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0022_bounda_ultimate_skill:/scheduledSequences/3/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0022_bounda_ultimate_skill',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
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
        60,
      ),
      scheduled(
        63,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:projectile_chr_0022_bounda_ultimate_skill_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:chr_0022_bounda_ultimate_skill_2_projhit',
                { atb: 0, atk_scale2: 0, atk_scale3: 0, poise: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                      tags: ['ultimateSkill'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0022_bounda_ultimate_skill:/scheduledSequences/4/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0022_bounda_ultimate_skill',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
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
        64,
      ),
      scheduled(
        67,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:projectile_chr_0022_bounda_ultimate_skill_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:chr_0022_bounda_ultimate_skill_3_projhit',
                { atb: 0, atk_scale3: 0, poise: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale3' },
                      tags: ['ultimateSkill'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0022_bounda_ultimate_skill:/scheduledSequences/5/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0022_bounda_ultimate_skill',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
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
        68,
      ),
      scheduled(
        72,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0]:projectile_chr_0022_bounda_ultimate_skill_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0022_bounda_ultimate_skill.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0]:chr_0022_bounda_ultimate_skill_4_projhit',
                { atb: 0, atk_scale4: 0, poise: 0 },
                true,
                sequence(
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 2 },
                    },
                    sequence(
                      step('applyElementalInfliction', { element: 'nature', isExtra: false }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 2 },
                        },
                        sequence(
                          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                    { alwaysNext: true },
                  ),
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale4' },
                      tags: ['ultimateSkill'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0022_bounda_ultimate_skill:/scheduledSequences/6/sequence/steps/0/body/steps/0/body/steps/1',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0022_bounda_ultimate_skill',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
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
        73,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
  },
  {
    atk_scale1: [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    atk_scale2: [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    atk_scale3: [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    atk_scale4: [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    boom_up: 0.3,
    duration: 12,
    ex_usp_up: 0.3,
    has_potential4: 0,
    poise: 5,
  },
);

export const fluoriteComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0022_bounda_combo_skill',
    timelineBlockFrames: 17,
    exclusiveFrame: 24,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        1,
      ),
      scheduled(
        15,
        sequence(
          {
            kind: 'switch',
            parameters: {
              choice: { kind: 'blackboard', key: 'EntityBB_combo_index' },
              alwaysNext: true,
            },
            options: [
              {
                value: { kind: 'constant', value: 2 },
                sequence: sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                ),
              },
              {
                value: { kind: 'constant', value: 3 },
                sequence: sequence(
                  step('applyElementalInfliction', { element: 'nature', isExtra: false }),
                ),
              },
            ],
          },
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0022_bounda_combo_skill:/scheduledSequences/1/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
          ),
        ),
        18,
      ),
      scheduled(
        11,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.3 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'slow' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        20,
      ),
      scheduled(
        16,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.33 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'bounda_power_attack' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              ),
            ),
          ),
        ),
        19,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.533 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        13,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1140],
  },
  {
    atb: 10,
    atk_scale: [1.69, 1.86, 2.03, 2.2, 2.37, 2.54, 2.7, 2.87, 3.04, 3.25, 3.51, 3.8],
    atk_scale_add: 1.5,
    atk_scale_add_1: [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 1, 1.2, 1.2],
    atk_scale_add_2: [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2, 2.4, 2.4],
    atk_scale_add_3: [1.05, 1.2, 1.35, 1.5, 1.65, 1.8, 1.95, 2.1, 2.25, 2.6, 3.2, 3.2],
    atk_scale_add_4: [1.33, 1.5, 1.67, 1.83, 2, 2.18, 2.35, 2.52, 2.69, 3.33, 4.15, 4.15],
    atk_scale_potential5: 1.3,
    cam_angle: 0,
    cam_angle2: 0,
    cam_duration: 0,
    cam_duration2: 0,
    duration: 3,
    infliction_num: 0,
    input_angle: 0,
    input_angle2: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    potential_lv: 0,
    usp: 10,
  },
);

export const commonBuffDefinitions = {
  buff_common_affixes_slow: {
    stackingType: 'highPriority',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    applyTags: ['Skill/Character/Common/Affixes/Slow'],
    extendTags: [],
    blackboard: { child_buff_id: 'buff_common_affixes_slow_default_child', duration: 0, rate: 0 },
    attributeModifiers: [
      { attribute: 'SlowActionSpeedScalar', slot: 'addition', value: { blackboardKey: 'rate' } },
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
  buff_common_affixes_slow_default_child: {
    stackingType: 'highPriority',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    presentation: {
      visible: true,
      iconId: 'icon_battle_affix_slow',
      iconPath: '/icons/icon_battle_affix_slow.webp',
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
    blackboard: { duration: 0, rate: 0 },
    attributeModifiers: [],
  },
  buff_common_damage_immune_talent: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ['Status/DodgeDamageImmune', 'Status/SkillDamageImmune', 'Status/NoBehitVFX'],
    extendTags: [],
    blackboard: { duration: 9999 },
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
  slug: 'fluorite',
  gameId: 'FLUORITE',
  rarity: 4,
  weaponType: 'handcannon',
  element: 'nature',
  role: 'caster',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [14, 30, 47, 64, 81, 90],
    agility: [14, 47, 81, 116, 150, 168],
    intellect: [12, 34, 57, 80, 103, 114],
    will: [10, 27, 45, 64, 82, 91],
    baseAttack: [30, 88, 150, 211, 272, 303],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        fluoriteBasicAttack1,
        fluoriteBasicAttack2,
        fluoriteBasicAttack3,
        fluoriteBasicAttack4,
        fluoriteBasicAttack5,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: fluoriteFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: fluoritePlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: fluoriteBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: fluoriteUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: fluoriteComboSkill,
    },
  ],
  comboSkillRegistrations: [
    {
      skillKey: 'comboSkill',
      priority: 'default',
      invalidCastBlackboard: { EntityBB_combo_index: -1 },
      rules: [
        {
          trigger: { kind: 'elementalInflictionApplied', elements: 'cryo', scope: 'team' },
          condition: {
            kind: 'buffStackCompare',
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
            operator: 'greaterOrEqual',
            value: { kind: 'constant', value: 1 },
          },
          blackboard: { EntityBB_combo_index: 2 },
        },
        {
          trigger: { kind: 'elementalInflictionApplied', elements: 'nature', scope: 'team' },
          condition: {
            kind: 'buffStackCompare',
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
            operator: 'greaterOrEqual',
            value: { kind: 'constant', value: 1 },
          },
          blackboard: { EntityBB_combo_index: 3 },
        },
      ],
    },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0022_bounda_talent_1',
          blackboard: { dmg_up: [0.1, 0.2] },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0022_bounda_talent_1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: { dmg_up: { kind: 'blackboard', key: 'dmg_up' } },
            }),
          ),
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0022_bounda_talent_2',
          blackboard: { atk_up: [0.1, 0.2], duration: [10, 10], probability: [0.2, 0.2] },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0022_bounda_talent_2',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                atk_up: { kind: 'blackboard', key: 'atk_up' },
                duration: { kind: 'blackboard', key: 'duration' },
                probability: { kind: 'blackboard', key: 'probability' },
              },
            }),
          ),
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 10 },
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 10 },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0022_bounda_talent_2',
          blackboardKey: 'probability',
          operation: 'add',
          value: 0.1,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'duration_potential',
          operation: 'assign',
          value: 6,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_lv',
          operation: 'assign',
          value: 3,
        },
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
          multiplier: 0.9,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0022_bounda_potential_5_auro',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            CD: { kind: 'constant', value: 1 },
            reduce: { kind: 'constant', value: 1 },
          },
        }),
      ),
    },
  ],
  buffDefinitions: {
    buff_chr_0022_bounda_normal_skill_onlymark: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 5,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: ['Status/DisableNormalSkill'],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0022_bounda_potential_5_auro: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { CD: 1, dmg_up: 0, reduce: 1 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0022_bounda_potential_5_cd',
            target: 'enemy',
            source: 'buffOwner',
            finishByAction: true,
            blackboardAssignments: {
              CD: { kind: 'blackboard', key: 'CD' },
              reduce: { kind: 'blackboard', key: 'reduce' },
            },
          }),
        ),
      },
    },
    buff_chr_0022_bounda_potential_5_cd: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { CD: 0, dmg_up: 0, reduce: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeTakeInfliction',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'potential' },
              },
              sequence(
                branch(
                  { kind: 'eventInflictionElementIn', elements: ['cryo', 'nature'] },
                  sequence(
                    step('adjustSkillCooldown', {
                      target: 'caster',
                      skill: { kind: 'id', skillId: 'chr_0022_bounda_combo_skill' },
                      operation: 'reduce',
                      basis: 'absoluteSeconds',
                      value: { kind: 'blackboard', key: 'reduce' },
                    }),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'potential',
                      durationSeconds: { kind: 'blackboard', key: 'CD' },
                      autoFinishByAction: false,
                    }),
                  ),
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0022_bounda_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { dmg_up: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'entityTagMatch',
            target: 'enemy',
            tagQueryType: 'hasAny',
            tags: ['Skill/Character/Common/Affixes/Slow'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'attacker',
              zone: 'normal',
              addition: { blackboardKey: 'dmg_up' },
            },
          ],
        },
      ],
    },
    buff_chr_0022_bounda_talent_2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0.1, duration: 10, probability: 0.2 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'entityTagMatch',
                target: 'buffOwner',
                tagQueryType: 'exceptAny',
                tags: ['Status/DashImmune', 'Status/DashSucceedImmune'],
              },
              sequence(
                branch(
                  { kind: 'eventDamageTypeIn', damageTypes: ['heat'] },
                  sequence(
                    branch(
                      {
                        kind: 'probability',
                        probability: { kind: 'blackboard', key: 'probability' },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_damage_immune_talent',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: { duration: { kind: 'constant', value: 0.01 } },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0022_bounda_talent_2_atkup',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'entityTagMatch',
                target: 'buffOwner',
                tagQueryType: 'exceptAny',
                tags: ['Status/DashImmune', 'Status/DashSucceedImmune'],
              },
              sequence(
                branch(
                  { kind: 'eventDamageTypeIn', damageTypes: ['electric'] },
                  sequence(
                    branch(
                      {
                        kind: 'probability',
                        probability: { kind: 'blackboard', key: 'probability' },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_damage_immune_talent',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: { duration: { kind: 'constant', value: 0.01 } },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0022_bounda_talent_2_atkup',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'entityTagMatch',
                target: 'buffOwner',
                tagQueryType: 'exceptAny',
                tags: ['Status/DashImmune', 'Status/DashSucceedImmune'],
              },
              sequence(
                branch(
                  { kind: 'eventDamageTypeIn', damageTypes: ['cryo'] },
                  sequence(
                    branch(
                      {
                        kind: 'probability',
                        probability: { kind: 'blackboard', key: 'probability' },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_damage_immune_talent',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: { duration: { kind: 'constant', value: 0.01 } },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0022_bounda_talent_2_atkup',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'entityTagMatch',
                target: 'buffOwner',
                tagQueryType: 'exceptAny',
                tags: ['Status/DashImmune', 'Status/DashSucceedImmune'],
              },
              sequence(
                branch(
                  { kind: 'eventDamageTypeIn', damageTypes: ['nature'] },
                  sequence(
                    branch(
                      {
                        kind: 'probability',
                        probability: { kind: 'blackboard', key: 'probability' },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_damage_immune_talent',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: { duration: { kind: 'constant', value: 0.01 } },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0022_bounda_talent_2_atkup',
                          target: 'buffSource',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0022_bounda_talent_2_atkup: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0.1, duration: 10 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
      ],
    },
    buff_chr_0022_bounda_ultimate_skill: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.2,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0022_bounda_normal_skill: {
      lifetime: { kind: 'limited', durationSeconds: 5 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0022_bounda_normal_skill_abilityrange',
        blackboard: {
          atk_scale: 1,
          boom_up: 0,
          duration: 0,
          duration_potential: 0,
          move_speed_scalar: 0,
          poise: 20,
          potential_lv: 0,
          usp: 5,
        },
        scheduledSequences: [
          scheduled(
            89,
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0022_bounda_normal_skill_onlymark',
                  'buff_chr_0022_bounda_ultimate_skill',
                ],
                reason: 'other',
              }),
              step('applyElementalInfliction', { element: 'nature', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'abilityentity_chr_0022_bounda_normal_skill:chr_0022_bounda_normal_skill_abilityrange:/childSkill/scheduledSequences/0/sequence/steps/2',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_lv' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 3 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_common_affixes_slow',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration_potential' },
                      rate: { kind: 'blackboard', key: 'move_speed_scalar' },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
            90,
          ),
          scheduled(90, sequence(step('finishActionOwnerAbilityEntity', {})), 90),
          scheduled(
            149,
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0022_bounda_normal_skill_onlymark',
                  'buff_chr_0022_bounda_ultimate_skill',
                ],
                reason: 'other',
              }),
              step('applyElementalInfliction', { element: 'nature', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  instantDamageScaleModifiers: [
                    {
                      side: 'attacker',
                      zone: 'product',
                      addition: { kind: 'constant', value: 0.3 },
                    },
                  ],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'abilityentity_chr_0022_bounda_normal_skill:chr_0022_bounda_normal_skill_abilityrange:/childSkill/scheduledSequences/2/sequence/steps/2',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_lv' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 3 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_common_affixes_slow',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration_potential' },
                      rate: { kind: 'blackboard', key: 'move_speed_scalar' },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
            150,
          ),
          scheduled(150, sequence(step('finishActionOwnerAbilityEntity', {})), 150),
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 89,
                condition: {
                  kind: 'healthCompare',
                  target: 'enemy',
                  valueType: 'ratio',
                  operator: 'lessOrEqual',
                  value: { kind: 'constant', value: 0 },
                },
              }),
            ),
            89,
          ),
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 149,
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0022_bounda_ultimate_skill'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              }),
            ),
            89,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
