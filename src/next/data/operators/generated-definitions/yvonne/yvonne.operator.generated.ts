/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorBuffDefinitions,
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachContextTarget,
  forEachTarget,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const yvonneBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0017_yvonne_attack1',
    timelineBlockFrames: 16,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 27,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 16, endFrame: 27, sourceSkillIds: ['chr_0017_yvonne_attack2'] },
        { startFrame: 0, endFrame: 27, sourceSkillIds: ['chr_0017_yvonne_attack5'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_attack1.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_attack1.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0017_yvonne_attack1_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        11,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  { atb: 0, atk_scale: [0.24, 0.26, 0.28, 0.31, 0.33, 0.35, 0.38, 0.4, 0.42, 0.45, 0.49, 0.53] },
);

export const yvonneBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0017_yvonne_attack2',
    timelineBlockFrames: 14,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 28,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 14, endFrame: 28, sourceSkillIds: ['chr_0017_yvonne_attack3'] },
        { startFrame: 0, endFrame: 28, sourceSkillIds: ['chr_0017_yvonne_attack5'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_attack2.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_attack2.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0017_yvonne_attack2_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        14,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_attack2.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_attack2_robot',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_attack2.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0017_yvonne_attack2_robot_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_attack2:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [0.13, 0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.21, 0.23, 0.24, 0.26, 0.28],
    display_atk_scale: [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
  },
);

export const yvonneBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0017_yvonne_attack3',
    timelineBlockFrames: 20,
    exclusiveFrame: 21,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 34,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 20, endFrame: 34, sourceSkillIds: ['chr_0017_yvonne_attack4'] },
        { startFrame: 0, endFrame: 34, sourceSkillIds: ['chr_0017_yvonne_attack5'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0017_yvonne_attack3_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        6,
      ),
      scheduled(
        9,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_attack3_2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0017_yvonne_attack3_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_attack3:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
        9,
      ),
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_attack3.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_attack3_3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_attack3.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0017_yvonne_attack3_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_attack3:/scheduledSequences/2/sequence/steps/0/body/steps/0/body/steps/0',
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
        12,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.22, 0.24],
    display_atk_scale: [0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.5, 0.54, 0.57, 0.61, 0.65, 0.71],
  },
);

export const yvonneBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0017_yvonne_attack4',
    timelineBlockFrames: 24,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 38,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 24, endFrame: 38, sourceSkillIds: ['chr_0017_yvonne_attack5'] },
      ],
      hasConditionalActions: true,
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_attack4.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_attack4.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0017_yvonne_attack4_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        11,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  { atb: 0, atk_scale: [0.41, 0.45, 0.49, 0.53, 0.58, 0.62, 0.66, 0.7, 0.74, 0.79, 0.85, 0.92] },
);

export const yvonneBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0017_yvonne_attack5',
    timelineBlockFrames: 37,
    exclusiveFrame: 37,
    inputWindows: { hasConditionalActions: true },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        21,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'cryo',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                },
                'chr_0017_yvonne_attack5:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('dealStagger', { value: { kind: 'blackboard', key: 'poise' } }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'cnt' },
                      operator: 'less',
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
                      step('modifyActionValue', {
                        key: 'cnt',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                  ),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.1,
              },
            },
          ),
        ),
        23,
      ),
      scheduled(
        21,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_talent_1_valid'],
            reason: 'other',
          }),
        ),
        24,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 17,
    atk_scale: [0.56, 0.62, 0.67, 0.73, 0.79, 0.84, 0.9, 0.96, 1.01, 1.08, 1.17, 1.26],
    cnt: 0,
    dmg_up: 0,
    poise: 17,
    display_atk_scale: [0.56, 0.62, 0.67, 0.73, 0.79, 0.84, 0.9, 0.96, 1.01, 1.08, 1.17, 1.26],
  },
);

export const yvonneUltimateAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack1',
    sourceSkillId: 'chr_0017_yvonne_ult_attack1_1',
    timelineBlockFrames: 21,
    exclusiveFrame: 28,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 26,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_ult_attack2_1',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 21,
          endFrame: 26,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack2_1', 'chr_0017_yvonne_ult_attack_end'],
        },
        {
          startFrame: 0,
          endFrame: 26,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack2_1',
                  'chr_0017_yvonne_ult_attack_end',
                ],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        37,
      ),
      scheduled(
        37,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
        40,
      ),
      scheduled(
        9,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              crit_rate_up: { kind: 'blackboard', key: 'crit_rate_up' },
              normal_dmg_up: { kind: 'blackboard', key: 'normal_dmg_up' },
            },
          }),
        ),
        12,
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              crit_rate_up: { kind: 'blackboard', key: 'crit_rate_up' },
              normal_dmg_up: { kind: 'blackboard', key: 'normal_dmg_up' },
            },
          }),
        ),
        18,
      ),
      scheduled(
        21,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              crit_rate_up: { kind: 'blackboard', key: 'crit_rate_up' },
              normal_dmg_up: { kind: 'blackboard', key: 'normal_dmg_up' },
            },
          }),
        ),
        24,
      ),
      scheduled(
        9,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack1_1.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack1_1.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack1_1:/scheduledSequences/5/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        9,
      ),
      scheduled(
        15,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack1_1.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack1_1.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack1_1:/scheduledSequences/6/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        15,
      ),
      scheduled(
        21,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack1_1.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack1_1.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack1_1:/scheduledSequences/7/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        21,
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack2_1'],
          }),
        ),
        23,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  {
    atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
    crit_rate_up: 0.06,
    normal_dmg_up: 0.03,
    layer: 10,
  },
);

export const yvonneUltimateAttack2A: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack2A',
    sourceSkillId: 'chr_0017_yvonne_ult_attack2_1',
    timelineBlockFrames: 23,
    exclusiveFrame: 31,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_ult_attack2_2',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 23,
          endFrame: 30,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack2_2', 'chr_0017_yvonne_ult_attack_end'],
        },
        {
          startFrame: 0,
          endFrame: 30,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('inheritBuffById', {
                target: 'caster',
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack2_2',
                  'chr_0017_yvonne_ult_attack_end',
                ],
                finishByAction: true,
                finishWithNextSkillIfNotInherited: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack2_2',
                  'chr_0017_yvonne_ult_attack_end',
                ],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        32,
      ),
      scheduled(
        32,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
        35,
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        14,
      ),
      scheduled(
        14,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        17,
      ),
      scheduled(
        17,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        20,
      ),
      scheduled(
        5,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        8,
      ),
      scheduled(
        8,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        11,
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        14,
      ),
      scheduled(
        14,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        17,
      ),
      scheduled(
        17,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        20,
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.6 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.6 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        24,
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[27]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[27]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_1:/scheduledSequences/11/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[27]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:projectile_chr_0017_yvonne_ult_attack2',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[27]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:chr_0017_yvonne_ult_attack2_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_1:/scheduledSequences/11/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            { alwaysNext: true },
          ),
        ),
        11,
      ),
      scheduled(
        14,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[28]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[28]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_1:/scheduledSequences/12/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[28]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[28]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_1:/scheduledSequences/12/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            { alwaysNext: true },
          ),
        ),
        14,
      ),
      scheduled(
        17,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[29]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[29]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_1:/scheduledSequences/13/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[29]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:projectile_chr_0017_yvonne_ult_attack2',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[29]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:chr_0017_yvonne_ult_attack2_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_1:/scheduledSequences/13/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            { alwaysNext: true },
          ),
        ),
        17,
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[30]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[30]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_1:/scheduledSequences/14/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[30]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_1.actionGroupData.timelineActions[30]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_1:/scheduledSequences/14/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            { alwaysNext: true },
          ),
        ),
        21,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_start'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('inheritBuffById', {
                target: 'caster',
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start',
                inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack2_2'],
                finishByAction: true,
                finishWithNextSkillIfNotInherited: true,
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        24,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  { atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2] },
);

export const yvonneUltimateAttack2B: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack2B',
    sourceSkillId: 'chr_0017_yvonne_ult_attack2_2',
    timelineBlockFrames: 12,
    exclusiveFrame: 22,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 20,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_ult_attack3_1',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 12,
          endFrame: 20,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack3_1', 'chr_0017_yvonne_ult_attack_end'],
        },
        {
          startFrame: 0,
          endFrame: 20,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        4,
      ),
      scheduled(
        4,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        7,
      ),
      scheduled(
        7,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        10,
      ),
      scheduled(
        1,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        4,
      ),
      scheduled(
        4,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        7,
      ),
      scheduled(
        7,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        10,
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.6 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.6 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        14,
      ),
      scheduled(
        1,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[23]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[23]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_2:/scheduledSequences/7/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[23]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[23]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_2:/scheduledSequences/7/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            { alwaysNext: true },
          ),
        ),
        1,
      ),
      scheduled(
        4,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[24]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[24]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_2:/scheduledSequences/8/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[24]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[24]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_2:/scheduledSequences/8/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            { alwaysNext: true },
          ),
        ),
        4,
      ),
      scheduled(
        7,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[25]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[25]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_2:/scheduledSequences/9/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[25]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[25]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_2:/scheduledSequences/9/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            { alwaysNext: true },
          ),
        ),
        7,
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'ratio',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[26]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[26]._sequenceActionData.actionData[0].succeedActions.actionData[0].succeedActions.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_2:/scheduledSequences/10/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[26]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:projectile_chr_0017_yvonne_ult_attack1',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0017_yvonne_ult_attack2_2.actionGroupData.timelineActions[26]._sequenceActionData.actionData[0].succeedActions.actionData[0].failActions.actionData[1]:chr_0017_yvonne_ult_attack1_projhit',
                    { atk_scale: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack2_2:/scheduledSequences/10/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/0',
                      ),
                      branch(
                        { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                        sequence(),
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
            { alwaysNext: true },
          ),
        ),
        11,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('inheritBuffById', {
                target: 'caster',
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack3_1',
                  'chr_0017_yvonne_ult_attack_end',
                ],
                finishByAction: true,
                finishWithNextSkillIfNotInherited: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack3_1',
                  'chr_0017_yvonne_ult_attack_end',
                ],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        21,
      ),
      scheduled(
        21,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
        24,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_start'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('inheritBuffById', {
                target: 'caster',
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start',
                inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_1'],
                finishByAction: true,
                finishWithNextSkillIfNotInherited: true,
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        13,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  { atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2] },
);

export const yvonneUltimateAttack3A: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack3A',
    sourceSkillId: 'chr_0017_yvonne_ult_attack3_1',
    timelineBlockFrames: 28,
    exclusiveFrame: 45,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 36,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_ult_attack3_2',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 28,
          endFrame: 36,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack3_2', 'chr_0017_yvonne_ult_attack_end'],
        },
        {
          startFrame: 0,
          endFrame: 36,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack_end', 'chr_0017_yvonne_attack5'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        15,
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        17,
      ),
      scheduled(
        17,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        19,
      ),
      scheduled(
        19,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        21,
      ),
      scheduled(
        21,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        23,
      ),
      scheduled(
        23,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        25,
      ),
      scheduled(
        25,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        27,
      ),
      scheduled(
        27,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        29,
      ),
      scheduled(
        13,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        15,
      ),
      scheduled(
        15,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        17,
      ),
      scheduled(
        17,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        19,
      ),
      scheduled(
        19,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        21,
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        23,
      ),
      scheduled(
        23,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        25,
      ),
      scheduled(
        25,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        27,
      ),
      scheduled(
        27,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.5 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.5 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        29,
      ),
      scheduled(
        13,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[39]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[39]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_1:/scheduledSequences/16/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        13,
      ),
      scheduled(
        15,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[40]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[40]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_1:/scheduledSequences/17/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        15,
      ),
      scheduled(
        17,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[41]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[41]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_1:/scheduledSequences/18/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        17,
      ),
      scheduled(
        19,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[42]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[42]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_1:/scheduledSequences/19/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        19,
      ),
      scheduled(
        21,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[43]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[43]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_1:/scheduledSequences/20/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        21,
      ),
      scheduled(
        23,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[44]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[44]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_1:/scheduledSequences/21/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        23,
      ),
      scheduled(
        25,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[45]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[45]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_1:/scheduledSequences/22/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        25,
      ),
      scheduled(
        27,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[46]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_1.actionGroupData.timelineActions[46]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_1:/scheduledSequences/23/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('inheritBuffById', {
                target: 'caster',
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack3_2',
                  'chr_0017_yvonne_ult_attack_end',
                ],
                finishByAction: true,
                finishWithNextSkillIfNotInherited: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack3_2',
                  'chr_0017_yvonne_ult_attack_end',
                ],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        50,
      ),
      scheduled(
        50,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
        53,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_start'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('inheritBuffById', {
                target: 'caster',
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start',
                inheritToNextSkillIds: [],
                finishByAction: true,
                finishWithNextSkillIfNotInherited: true,
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        12,
      ),
      scheduled(
        12,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'chr_0017_yvonne_voice_cd',
                  },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('createTimedMarker', {
                target: 'caster',
                markerId: 'chr_0017_yvonne_voice_cd',
                durationSeconds: { kind: 'constant', value: 5 },
                autoFinishByAction: false,
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('inheritBuffById', {
                    target: 'caster',
                    buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice',
                    inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
                    finishByAction: true,
                    finishWithNextSkillIfNotInherited: true,
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                        inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
                      }),
                    ),
                    sequence(
                      step('inheritBuffById', {
                        target: 'caster',
                        buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short',
                        inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
                        finishByAction: true,
                        finishWithNextSkillIfNotInherited: true,
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        32,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  { atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2] },
);

export const yvonneUltimateAttack3B: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack3B',
    sourceSkillId: 'chr_0017_yvonne_ult_attack3_2',
    timelineBlockFrames: 16,
    exclusiveFrame: 28,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 24,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0017_yvonne_ult_attack3_2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 0, endFrame: 24, sourceSkillIds: ['chr_0017_yvonne_attack5'] },
        { startFrame: 0, endFrame: 28, sourceSkillIds: ['chr_0017_yvonne_ult_attack_end'] },
        {
          startFrame: 16,
          endFrame: 24,
          sourceSkillIds: ['chr_0017_yvonne_ult_attack3_2', 'chr_0017_yvonne_ult_attack_end'],
        },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        3,
      ),
      scheduled(
        3,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        5,
      ),
      scheduled(
        5,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        7,
      ),
      scheduled(
        7,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        9,
      ),
      scheduled(
        9,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        11,
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        13,
      ),
      scheduled(
        13,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        15,
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        17,
      ),
      scheduled(
        1,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[28]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[28]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_2:/scheduledSequences/8/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        1,
      ),
      scheduled(
        3,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[29]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[29]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_2:/scheduledSequences/9/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        3,
      ),
      scheduled(
        5,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[30]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[30]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_2:/scheduledSequences/10/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        5,
      ),
      scheduled(
        7,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[31]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[31]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_2:/scheduledSequences/11/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        7,
      ),
      scheduled(
        9,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[32]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[32]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_2:/scheduledSequences/12/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        9,
      ),
      scheduled(
        11,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[33]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[33]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_2:/scheduledSequences/13/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        11,
      ),
      scheduled(
        13,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[34]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[34]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack1_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_2:/scheduledSequences/14/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        13,
      ),
      scheduled(
        15,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[35]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_ult_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_ult_attack3_2.actionGroupData.timelineActions[35]._sequenceActionData.actionData[0]:chr_0017_yvonne_ult_attack2_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0017_yvonne_ult_attack3_2:/scheduledSequences/15/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  branch(
                    { kind: 'probability', probability: { kind: 'constant', value: 0.125 } },
                    sequence(),
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
        15,
      ),
      scheduled(
        1,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        3,
      ),
      scheduled(
        3,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        5,
      ),
      scheduled(
        5,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        7,
      ),
      scheduled(
        7,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        9,
      ),
      scheduled(
        9,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        11,
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        13,
      ),
      scheduled(
        13,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.2 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        15,
      ),
      scheduled(
        15,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.5 } },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: { effect_duration: { kind: 'constant', value: 0.5 } },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        17,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('inheritBuffById', {
                target: 'caster',
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack3_2',
                  'chr_0017_yvonne_ult_attack_end',
                ],
                finishByAction: true,
                finishWithNextSkillIfNotInherited: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                inheritToNextSkillIds: [
                  'chr_0017_yvonne_ult_attack3_2',
                  'chr_0017_yvonne_ult_attack_end',
                ],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        37,
      ),
      scheduled(
        37,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
        40,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'chr_0017_yvonne_voice_cd',
                  },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('createTimedMarker', {
                target: 'caster',
                markerId: 'chr_0017_yvonne_voice_cd',
                durationSeconds: { kind: 'constant', value: 5 },
                autoFinishByAction: false,
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('inheritBuffById', {
                    target: 'caster',
                    buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice',
                    inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
                    finishByAction: true,
                    finishWithNextSkillIfNotInherited: true,
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                        inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
                      }),
                    ),
                    sequence(
                      step('inheritBuffById', {
                        target: 'caster',
                        buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short',
                        inheritToNextSkillIds: ['chr_0017_yvonne_ult_attack3_2'],
                        finishByAction: true,
                        finishWithNextSkillIfNotInherited: true,
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        18,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  { atk_scale: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2] },
);

export const yvonneUltimateAttackEnd: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttackEnd',
    sourceSkillId: 'chr_0017_yvonne_ult_attack_end',
    timelineBlockFrames: 61,
    exclusiveFrame: 60,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        28,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_end'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'cryo',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0017_yvonne_ult_attack_end:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/0',
              ),
              forEachTarget(
                'enemy',
                sequence(
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale_extra' },
                          tags: ['normalAttack'],
                        },
                        'chr_0017_yvonne_ult_attack_end:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/1/body/steps/0/whenTrue/steps/0',
                      ),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
                        reason: 'early',
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'cryo',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  features: ['canBreakWeakness'],
                  instantAttributeModifiers: [
                    {
                      targetSide: 'attacker',
                      attribute: 'criticalRate',
                      slot: 'baseAddition',
                      value: { kind: 'blackboard', key: 'normal_dmg_up' },
                      attributeTiming: 'runtime',
                    },
                    {
                      targetSide: 'attacker',
                      attribute: 'criticalDamageIncrease',
                      slot: 'baseAddition',
                      value: { kind: 'blackboard', key: 'crit_rate_up' },
                      attributeTiming: 'runtime',
                    },
                    {
                      targetSide: 'attacker',
                      attribute: 'Atk',
                      slot: 'baseMultiplier',
                      value: { kind: 'blackboard', key: 'atk_up_true' },
                      attributeTiming: 'runtime',
                    },
                    {
                      targetSide: 'attacker',
                      attribute: 'criticalDamageIncrease',
                      slot: 'baseAddition',
                      value: { kind: 'blackboard', key: 'crit_dmg_up_true' },
                      attributeTiming: 'runtime',
                    },
                  ],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0017_yvonne_ult_attack_end:/scheduledSequences/0/sequence/steps/0/whenFalse/steps/0',
              ),
              forEachTarget(
                'enemy',
                sequence(
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale_extra' },
                          tags: ['normalAttack'],
                          instantAttributeModifiers: [
                            {
                              targetSide: 'attacker',
                              attribute: 'criticalRate',
                              slot: 'baseAddition',
                              value: { kind: 'blackboard', key: 'normal_dmg_up' },
                              attributeTiming: 'runtime',
                            },
                            {
                              targetSide: 'attacker',
                              attribute: 'criticalDamageIncrease',
                              slot: 'baseAddition',
                              value: { kind: 'blackboard', key: 'crit_rate_up' },
                              attributeTiming: 'runtime',
                            },
                            {
                              targetSide: 'attacker',
                              attribute: 'Atk',
                              slot: 'baseMultiplier',
                              value: { kind: 'blackboard', key: 'atk_up_true' },
                              attributeTiming: 'runtime',
                            },
                            {
                              targetSide: 'attacker',
                              attribute: 'criticalDamageIncrease',
                              slot: 'baseAddition',
                              value: { kind: 'blackboard', key: 'crit_dmg_up_true' },
                              attributeTiming: 'runtime',
                            },
                          ],
                        },
                        'chr_0017_yvonne_ult_attack_end:/scheduledSequences/0/sequence/steps/0/whenFalse/steps/1/body/steps/0/whenTrue/steps/0',
                      ),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
                        reason: 'early',
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        60,
      ),
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer_effect'],
            reason: 'other',
          }),
        ),
        3,
      ),
      scheduled(
        29,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.1 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
        32,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        3,
      ),
      scheduled(
        28,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: [
              'buff_chr_0017_yvonne_ultimate_skill_end',
              'buff_chr_0017_yvonne_ultimate_skill_layer',
            ],
            reason: 'other',
          }),
        ),
        31,
      ),
      scheduled(
        0,
        sequence(
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'] },
            desiredKey: 'normal_dmg_up',
            outputKey: 'normal_dmg_up',
          }),
          step('readBuffStackCount', {
            target: 'caster',
            outputKey: 'stack',
            query: { kind: 'id', buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'] },
          }),
          step('modifyActionValue', {
            key: 'normal_dmg_up',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'stack' },
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'] },
            desiredKey: 'crit_rate_up_dynamic',
            outputKey: 'crit_rate_up',
          }),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_potential_5_effect'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('calculateActionValue', {
                key: 'crit_dmg_up_true',
                operation: 'add',
                left: { kind: 'blackboard', key: 'crit_dmg_up' },
                right: { kind: 'constant', value: 0 },
              }),
              step('calculateActionValue', {
                key: 'atk_up_true',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atk_up' },
                right: { kind: 'constant', value: 0 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        3,
      ),
      scheduled(
        7,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'robots',
            abilityEntityIds: [
              'abilityentity_chr_0017_yvonne_ultimate_skill',
              'abilityentity_chr_0017_yvonne_ultimate_skill2',
              'abilityentity_chr_0017_yvonne_ultimate_skill3',
            ],
            maxTargets: 1,
          }),
          forEachContextTarget(
            'robots',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
        8,
      ),
      scheduled(
        12,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'robots',
            abilityEntityIds: [
              'abilityentity_chr_0017_yvonne_ultimate_skill',
              'abilityentity_chr_0017_yvonne_ultimate_skill2',
              'abilityentity_chr_0017_yvonne_ultimate_skill3',
            ],
            maxTargets: 1,
          }),
          forEachContextTarget(
            'robots',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
        13,
      ),
      scheduled(
        17,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'robots',
            abilityEntityIds: [
              'abilityentity_chr_0017_yvonne_ultimate_skill',
              'abilityentity_chr_0017_yvonne_ultimate_skill2',
              'abilityentity_chr_0017_yvonne_ultimate_skill3',
            ],
            maxTargets: 1,
          }),
          forEachContextTarget(
            'robots',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
        18,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('inheritBuffById', {
                target: 'caster',
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                inheritToNextSkillIds: [],
                finishByAction: true,
                finishWithNextSkillIfNotInherited: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        67,
      ),
      scheduled(
        67,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
        70,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'ultimate',
    nativeSkillType: 'attack',
  },
  {
    atk_scale: [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    atk_scale_extra: [2.67, 2.94, 3.2, 3.47, 3.74, 4, 4.27, 4.54, 4.8, 5.14, 5.54, 6],
    atk_up: 0.3,
    atk_up_true: 0,
    crit_dmg_up: 0.15,
    crit_dmg_up_true: 0,
    crit_rate_up: 0,
    normal_dmg_up: 0,
    poise: 20,
    stack: 0,
  },
);

export const yvonneFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0017_yvonne_power_attack',
    timelineBlockFrames: 29,
    exclusiveFrame: 45,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 29,
          endFrame: 47,
          sourceSkillIds: ['chr_0017_yvonne_normal_skill', 'chr_0017_yvonne_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0017_yvonne_power_attack.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0017_yvonne_power_attack',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0017_yvonne_power_attack.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0017_yvonne_power_attack_projhit',
                { atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.1,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0017_yvonne_power_attack:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_power_attack',
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
        11,
      ),
      scheduled(
        28,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.9,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0017_yvonne_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'enemy',
              buffIds: ['buff_chr_0017_yvonne_power_attack'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: ['buff_chr_0017_yvonne_power_attack'],
                reason: 'other',
              }),
            ),
          ),
        ),
        30,
      ),
      scheduled(
        29,
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
                    durationSeconds: { kind: 'constant', value: 0.5 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0.7,
                          inTangent: -8.311591,
                          outTangent: -8.311591,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.1,
                          value: 0.04752808,
                          inTangent: -0.01381588,
                          outTangent: -0.01381588,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 1,
                          inTangent: 2.675379,
                          outTangent: 5.233175,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                      ],
                    },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              ),
            ),
          ),
        ),
        30,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_medium',
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
        29,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
);

export const yvonnePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0017_yvonne_plunging_attack_end',
    timelineBlockFrames: 2,
    exclusiveFrame: 20,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 2,
          endFrame: 20,
          sourceSkillIds: [
            'chr_0017_yvonne_ult_attack3_1',
            'chr_0017_yvonne_ult_attack3_2',
            'chr_0017_yvonne_ult_attack_end',
            'chr_0017_yvonne_ult_attack2_1',
            'chr_0017_yvonne_ult_attack2_2',
            'chr_0017_yvonne_attack5',
            'chr_0017_yvonne_attack4',
            'chr_0017_yvonne_attack3',
            'chr_0017_yvonne_attack2',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_potential_5'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                { kind: 'probability', probability: { kind: 'blackboard', key: 'prob' } },
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0017_yvonne_potential_5_cd'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'atk_scale',
                        operation: 'multiply',
                        value: { kind: 'blackboard', key: 'dmg_scale' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0017_yvonne_potential_5_cd',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: { cd: { kind: 'blackboard', key: 'cd' } },
                      }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack', 'plungingAttack'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        },
                        'chr_0017_yvonne_plunging_attack_end:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/2',
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
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack', 'plungingAttack'],
                        },
                        'chr_0017_yvonne_plunging_attack_end:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0',
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
                    { alwaysNext: true },
                  ),
                ),
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack', 'plungingAttack'],
                    },
                    'chr_0017_yvonne_plunging_attack_end:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/0/whenFalse/steps/0',
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
                { alwaysNext: true },
              ),
            ),
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'cryo',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'plungingAttack'],
                },
                'chr_0017_yvonne_plunging_attack_end:/scheduledSequences/0/sequence/steps/0/whenFalse/steps/0',
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
            { alwaysNext: true },
          ),
        ),
        6,
      ),
    ],
    skillType: 'plungingAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
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

export const yvonneBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0017_yvonne_normal_skill',
    timelineBlockFrames: 34,
    exclusiveFrame: 34,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 34, endFrame: 56, sourceSkillIds: ['chr_0017_yvonne_normal_skill'] },
      ],
    },
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
        5,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_normal_skill_projectile',
            target: 'caster',
            source: 'enemy',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
              poise: { kind: 'blackboard', key: 'poise' },
              consume_cnt: { kind: 'blackboard', key: 'consume_cnt' },
              gained_atb: { kind: 'blackboard', key: 'gained_atb' },
              has_potential2: { kind: 'blackboard', key: 'has_potential2' },
              atb_return: { kind: 'blackboard', key: 'atb_return' },
              count: { kind: 'blackboard', key: 'count' },
              atk_scale_layer: { kind: 'blackboard', key: 'atk_scale_layer' },
              usp_base: { kind: 'blackboard', key: 'usp_base' },
              usp_layer: { kind: 'blackboard', key: 'usp_layer' },
              atk_scale2: { kind: 'blackboard', key: 'atk_scale2' },
            },
          }),
        ),
        17,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_normal_skill_listener',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              crit_up: { kind: 'blackboard', key: 'crit_up' },
              atk_scale2: { kind: 'blackboard', key: 'atk_scale2' },
            },
          }),
        ),
        2,
      ),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb_return: 10,
    atk_scale: [1.11, 1.22, 1.33, 1.44, 1.55, 1.67, 1.78, 1.89, 2, 2.14, 2.3, 2.5],
    atk_scale_layer: [0.89, 0.98, 1.07, 1.16, 1.24, 1.33, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    atk_scale2: [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    count: 0,
    crit_up: 0,
    gained_atb: 0,
    has_potential2: 0,
    input_angle: 0,
    poise: 10,
    select_radius: 10,
    usp_base: 10,
    usp_layer: 30,
  },
);

export const yvonneUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0017_yvonne_ultimate_skill',
    timelineBlockFrames: 65,
    exclusiveFrame: 64,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: [
              'buff_chr_0017_yvonne_ultimate_skill',
              'buff_chr_0017_yvonne_ultimate_skill_end',
            ],
            reason: 'other',
          }),
        ),
        16,
      ),
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
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_dash_attack'],
            reason: 'other',
          }),
        ),
        3,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('findCharacterTeamTargets', {
                saveToContextKey: 'mainchar',
                selection: { kind: 'controlledOperator' },
              }),
            ),
          ),
        ),
        1,
      ),
      scheduled(
        61,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_potential_4'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  duration: { kind: 'blackboard', key: 'duration' },
                  has_potential4: { kind: 'blackboard', key: 'has_potential4' },
                  ex_usp_up: { kind: 'blackboard', key: 'ex_usp_up' },
                  has_potential5: { kind: 'blackboard', key: 'has_potential5' },
                  atk_up: { kind: 'blackboard', key: 'atk_up' },
                  crit_dmg_up: { kind: 'blackboard', key: 'crit_dmg_up' },
                },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  duration: { kind: 'blackboard', key: 'duration' },
                  has_potential4: { kind: 'blackboard', key: 'has_potential4' },
                  ex_usp_up: { kind: 'blackboard', key: 'ex_usp_up' },
                  has_potential5: { kind: 'blackboard', key: 'has_potential5' },
                  atk_up: { kind: 'blackboard', key: 'atk_up' },
                  crit_dmg_up: { kind: 'blackboard', key: 'crit_dmg_up' },
                },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        80,
      ),
      scheduled(
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill',
            childSkillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill2',
            childSkillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill3',
            childSkillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
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
        64,
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
        61,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 220 }],
    enhancementStateBuffId: 'buff_chr_0017_yvonne_ultimate_skill',
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale_extra: [2.67, 2.94, 3.2, 3.47, 3.74, 4, 4.27, 4.54, 4.8, 5.14, 5.54, 6],
    atk_scale1: [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
    atk_scale2: [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    atk_up: 0.3,
    crit_dmg_up: 0.15,
    duration: 7,
    ex_usp_up: 0.3,
    has_potential4: 0,
    has_potential5: 0,
    poise: 20,
  },
);

export const yvonneComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0017_yvonne_combo_skill',
    timelineBlockFrames: 19,
    exclusiveFrame: 24,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 19, endFrame: 56, sourceSkillIds: ['chr_0017_yvonne_normal_skill'] },
      ],
    },
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
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0017_yvonne_combo_skill',
            childSkillId: 'chr_0017_yvonne_combo_skill_abilityrange',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          }),
        ),
        3,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.667 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        17,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.15 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            targets: [],
            abilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        5,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale_boom: [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    atk_scale_tick: [0.45, 0.49, 0.54, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.93, 1],
    cam_angle: 0,
    cam_angle2: 0,
    cam_duration: 0,
    cam_duration2: 0,
    duration: 3,
    has_potential1: 0,
    input_angle: 0,
    input_angle2: 0,
    interval: 0.75,
    maxcnt: 4,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    radius: 4,
    select_radius: 7,
    usp: 10,
    usp_extra: 10,
  },
);

export const commonBuffDefinitions = {
  buff_common_cryst_cryst_frozen_triggered: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 3,
    applyTags: [],
    extendTags: [],
    blackboard: { consumed_layer: 0, consumed_type: 2, count: 1, duration: 0, extra_duration: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('readSkillSettingData', {
          items: [
            {
              values: [6, 7, 8, 9],
              column: { kind: 'blackboard', key: 'count' },
              storeKey: 'duration',
            },
          ],
        }),
        step('modifyActionValue', {
          key: 'duration',
          operation: 'add',
          value: { kind: 'blackboard', key: 'extra_duration' },
        }),
        step('applyBuff', {
          buffId: 'buff_common_cryst_cryst_frozen_triggered_do',
          target: 'buffOwner',
          source: 'buffSource',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: {
            count: { kind: 'blackboard', key: 'count' },
            duration: { kind: 'blackboard', key: 'duration' },
            consumed_type: { kind: 'blackboard', key: 'consumed_type' },
            consumed_layer: { kind: 'blackboard', key: 'consumed_layer' },
          },
        }),
      ),
    },
  },
  buff_common_cryst_cryst_frozen_triggered_do: {
    stackingType: 'stack',
    stackingKey: 'cryst_triggered',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    presentation: {
      visible: true,
      iconId: 'icon_battle_frozen',
      iconPath: '/icons/icon_battle_frozen.webp',
      showInHeadBarCommon: true,
      showInHeadBarAttached: false,
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      blinkInMainCharHpBar: false,
      showProgressInHpBar: false,
      showProgressInNormalSkillButton: false,
      useWeakProgressInNormalSkillButton: false,
      showProgressInUltimateSkillButton: false,
      forceRaiseIconEvent: false,
      showWarningBackground: false,
      playStrongInAnimation: false,
      hasCharHpBarVfxType: false,
      charHpBarVfxType: 'Fire',
      iconStyleInSquad: 'SpellAbnormal',
      abnormalColorType: 'Cryst',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'AttachedAndAbnormal' },
    },
    applyTags: ['Skill/Character/Common/SpellStatus/Frozen'],
    extendTags: [],
    blackboard: { count: 1, duration: 5, final_phy_dmg_up: 0, phy_dmg_up: 0.2 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('storeSourceAttributeValue', {
          attribute: { kind: 'specific', key: 'cryoAbnormalDamageIncrease' },
          stage: 'finalNonConverted',
          useFloor: false,
          divisor: { kind: 'constant', value: 1 },
          multiplier: { kind: 'blackboard', key: 'phy_dmg_up' },
          base: { kind: 'blackboard', key: 'phy_dmg_up' },
          targetKey: 'final_phy_dmg_up',
        }),
        step('applyBuff', {
          buffId: 'buff_common_cryst_triggered_fx',
          target: 'buffOwner',
          source: 'buffSource',
          inheritSourceSkillCastInfo: true,
        }),
      ),
      enable: sequence(
        branch(
          {
            kind: 'enemySuperArmorCompare',
            operator: 'lessOrEqual',
            value: { kind: 'constant', value: 20 },
          },
          sequence(
            step('applyBuff', {
              buffId: 'buff_common_frozen',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              finishByAction: true,
              blackboardAssignments: { duration: { kind: 'blackboard', key: 'duration' } },
            }),
          ),
        ),
      ),
    },
  },
  buff_common_cryst_triggered_fx: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 5,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    applyTags: [],
    extendTags: [],
    blackboard: {},
    attributeModifiers: [],
  },
  buff_common_damage_immune_medium: {
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
  buff_common_do_frozen: {
    stackingType: 'stack',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ['Status/Immobilized/Frozen', 'Status/DisableFaceToAttacker'],
    extendTags: [],
    blackboard: { duration: 9999 },
    attributeModifiers: [],
    lifecycleSequences: {
      enable: sequence(
        step('startTimeDilation', {
          scope: 'entity',
          durationSeconds: { kind: 'blackboard', key: 'duration' },
          slot: 'TimeDilation/Layer/Entity/Frozen',
          priority: 50,
          curve: {
            kind: 'inline',
            keys: [
              {
                time: 0,
                value: 0,
                inTangent: 0,
                outTangent: 0,
                weightedMode: 0,
                inWeight: 0,
                outWeight: 0.333333343,
              },
              {
                time: 1,
                value: 0,
                inTangent: 0,
                outTangent: 0,
                weightedMode: 0,
                inWeight: 0.333333343,
                outWeight: 0,
              },
            ],
          },
          finishByAction: true,
          targets: ['enemy'],
        }),
      ),
    },
  },
  buff_common_frozen: {
    stackingType: 'stack',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [],
    extendTags: [],
    blackboard: { duration: 9999 },
    attributeModifiers: [],
    lifecycleSequences: {
      enable: sequence(
        step('applyBuff', {
          buffId: 'buff_common_do_frozen',
          target: 'buffOwner',
          source: 'buffSource',
          inheritSourceSkillCastInfo: true,
          finishByAction: true,
          blackboardAssignments: { duration: { kind: 'blackboard', key: 'duration' } },
        }),
      ),
    },
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
  slug: 'yvonne',
  gameId: 'YVONNE',
  rarity: 6,
  weaponType: 'handcannon',
  element: 'cryo',
  role: 'striker',
  mainAttribute: 'intellect',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [8, 24, 40, 57, 74, 82],
    agility: [14, 38, 64, 89, 115, 128],
    intellect: [24, 57, 91, 125, 159, 176],
    will: [10, 30, 52, 73, 94, 105],
    baseAttack: [30, 92, 157, 223, 288, 321],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        yvonneBasicAttack1,
        yvonneBasicAttack2,
        yvonneBasicAttack3,
        yvonneBasicAttack4,
        yvonneBasicAttack5,
      ],
      variants: [
        {
          key: 'enhancedBasicAttack',
          levelSource: 'ultimate',
          libraryPresentation: 'enhanced',
          skills: [
            yvonneUltimateAttack1,
            yvonneUltimateAttack2A,
            yvonneUltimateAttack2B,
            yvonneUltimateAttack3A,
            yvonneUltimateAttack3B,
            yvonneUltimateAttackEnd,
          ],
        },
      ],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: yvonneFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: yvonnePlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: yvonneBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: yvonneUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: yvonneComboSkill,
    },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'battleSkill', replacementSkillKeys: [] },
    { key: 'comboSkill', baseSkillKey: 'comboSkill', replacementSkillKeys: [] },
    { key: 'ultimate', baseSkillKey: 'ultimate', replacementSkillKeys: [] },
  ],
  playerActionRoutes: {
    basicAttack: {
      kind: 'basicAttack',
      skillKeys: [
        'basicAttack1',
        'basicAttack2',
        'basicAttack3',
        'basicAttack4',
        'basicAttack5',
        'plungingAttack',
        'finisher',
        'ultimateAttack1',
        'ultimateAttack2A',
        'ultimateAttack2B',
        'ultimateAttack3A',
        'ultimateAttack3B',
        'ultimateAttackEnd',
      ],
      defaultSkillKey: 'basicAttack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  playerActionModes: [
    {
      modeId: 'ult',
      modeLayer: 'default',
      defaultEnabled: false,
      normalAttackSkillKeys: [
        'ultimateAttack1',
        'ultimateAttack2A',
        'ultimateAttack2B',
        'ultimateAttack3A',
        'ultimateAttack3B',
      ],
      commandMappings: {
        basicAttack: {
          sourceSkillId: 'chr_0017_yvonne_ult_attack1_1',
          skillKey: 'ultimateAttack1',
        },
      },
    },
    {
      modeId: 'ult_end',
      modeLayer: 'default',
      defaultEnabled: false,
      commandMappings: {
        basicAttack: {
          sourceSkillId: 'chr_0017_yvonne_ult_attack3_2',
          skillKey: 'ultimateAttack3B',
        },
      },
    },
    {
      modeId: 'talent_1',
      modeLayer: 'default',
      defaultEnabled: false,
      commandMappings: {
        basicAttack: { sourceSkillId: 'chr_0017_yvonne_attack5', skillKey: 'basicAttack5' },
      },
    },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0017_yvonne_talent_1',
          blackboard: { dmg_up: [0, 0.5] },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0017_yvonne_talent_1',
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
          key: 'chr_0017_yvonne_talent_0',
          blackboard: { inflict_up: [0.1, 0.2], status_up: [0.2, 0.4] },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0017_yvonne_talent_0',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                inflict_up: { kind: 'blackboard', key: 'inflict_up' },
                status_up: { kind: 'blackboard', key: 'status_up' },
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
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'has_potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'radius',
          operation: 'assign',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'interval',
          operation: 'assign',
          value: 0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'maxcnt',
          operation: 'assign',
          value: 6,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'usp_extra',
          operation: 'assign',
          value: 25,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 20 },
        { kind: 'modifyBasePanelStat', stat: 'criticalRate', operation: 'flat', value: 0.07 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0017_yvonne_talent_0',
          blackboardKey: 'inflict_up',
          operation: 'add',
          value: 0.1,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0017_yvonne_talent_0',
          blackboardKey: 'status_up',
          operation: 'add',
          value: 0.2,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'has_potential2',
          operation: 'assign',
          value: 1,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'has_potential5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'crit_dmg_up',
          operation: 'assign',
          value: 0.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'basicAttack',
          skillKey: 'ultimateAttackEnd',
          blackboardKey: 'crit_dmg_up',
          operation: 'assign',
          value: 0.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'basicAttack',
          skillKey: 'ultimateAttackEnd',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.1,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0017_yvonne_combo_skill: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'interval' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: { blackboardKey: 'maxcnt' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_multiplier: 1.5,
        atk_scale_boom: 0,
        atk_scale_tick: 0,
        count: 2,
        duration: 0,
        has_added_usp: 0,
        has_potential1: 0,
        interval: 0.75,
        maxcnt: 4,
        poise: 0,
        radius: 0,
        usp: 10,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:0',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              forEachTarget(
                'enemy',
                sequence(
                  branch(
                    {
                      kind: 'entityTagMatch',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      tags: ['Skill/Character/Common/SpellStatus/Frozen'],
                    },
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale_tick' },
                          tags: ['comboSkill'],
                        },
                        'buff_chr_0017_yvonne_combo_skill:/lifecycleSequences/trigger/steps/0/body/steps/0/body/steps/0/whenTrue/steps/0',
                      ),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_common_energy_shard_attached_cryst'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'cryo',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_tick' },
                              tags: ['comboSkill'],
                            },
                            'buff_chr_0017_yvonne_combo_skill:/lifecycleSequences/trigger/steps/0/body/steps/0/body/steps/0/whenFalse/steps/0/whenTrue/steps/0',
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'cryo',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_tick' },
                              tags: ['comboSkill'],
                            },
                            'buff_chr_0017_yvonne_combo_skill:/lifecycleSequences/trigger/steps/0/body/steps/0/body/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                          ),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                    { alwaysNext: true },
                  ),
                ),
              ),
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 1 },
                      operator: 'greaterOrEqual',
                      right: { kind: 'constant', value: 1 },
                    },
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'has_added_usp' },
                      operator: 'less',
                      right: { kind: 'constant', value: 1 },
                    },
                  ],
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'has_added_usp',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  }),
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          },
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:1',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              step('modifyActionValue', {
                key: 'count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          },
        ),
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_combo_skill_finish',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_scale_boom: { kind: 'blackboard', key: 'atk_scale_boom' },
              radius: { kind: 'blackboard', key: 'radius' },
              has_potential1: { kind: 'blackboard', key: 'has_potential1' },
              poise: { kind: 'blackboard', key: 'poise' },
              had_added_usp: { kind: 'blackboard', key: 'has_added_usp' },
              usp: { kind: 'blackboard', key: 'usp' },
            },
          }),
        ),
      },
    },
    buff_chr_0017_yvonne_combo_skill_finish: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: 0.72,
      triggerIntervalSeconds: 0.5,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 999,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale_boom: 0,
        atk_scale_tick: 0,
        count: 0,
        duration: 0,
        had_added_usp: 0,
        has_potential1: 0,
        poise: 0,
        radius: 0,
        usp: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          step('applyBuff', {
            buffId: 'buff_common_cryst_cryst_frozen_triggered',
            target: 'enemy',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              count: { kind: 'constant', value: 1 },
              extra_duration: { kind: 'constant', value: 2 },
            },
          }),
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale_boom' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'buff_chr_0017_yvonne_combo_skill_finish:/lifecycleSequences/trigger/steps/1',
          ),
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'not',
                  condition: {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'had_added_usp' },
                    operator: 'equal',
                    right: { kind: 'constant', value: 1 },
                  },
                },
              ],
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        finish: sequence(step('finishCurrentAbilityEntity', {})),
      },
    },
    buff_chr_0017_yvonne_normal_skill_frozen: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      triggerIntervalSeconds: 0.5,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale2: 1, crit_up: 0.7 },
      attributeModifiers: [],
    },
    buff_chr_0017_yvonne_normal_skill_listener: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale2: 0, crit_up: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeOutputBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffTagsMatch',
                match: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
              },
              sequence(
                branch(
                  { kind: 'eventSkillCastMatchesBuffSource' },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0017_yvonne_normal_skill_frozen',
                      target: 'eventTarget',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        crit_up: { kind: 'blackboard', key: 'crit_up' },
                        atk_scale2: { kind: 'blackboard', key: 'atk_scale2' },
                      },
                    }),
                  ),
                ),
              ),
            ),
          ),
        },
        {
          event: 'skillEnd',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillCastMatchesBuffSource' },
              sequence(step('finishCurrentBuff', { reason: 'other' })),
            ),
          ),
        },
      ],
    },
    buff_chr_0017_yvonne_normal_skill_projectile: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atb_return: 0,
        atk_scale: 0,
        atk_scale_layer: 0,
        atk_scale2: 0,
        consume_cnt: 0,
        count: 0,
        gained_atb: 0,
        has_potential2: 0,
        poise: 0,
        usp_base: 0,
        usp_layer: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'buffOwner',
              tagQueryType: 'exceptAny',
              tags: [
                'Status/Immobilized',
                'Status/InCommonInteraction',
                'GameplayState/Interacting/BambooRaft/OnBoat',
                'Status/Ability/Skill/CantCastAnySkill',
                'GameplayState/Interacting/Bomb/Create',
                'Status/InCommonInteractionCanMove',
                'Status/Silence',
                'Status/DisableNormalSkill',
              ],
            },
            sequence(
              withActionBlackboardScope(
                'BuffData.buff_chr_0017_yvonne_normal_skill_projectile.buffEventAction[1].actions[0].actionData[1]:projectile_chr_0017_yvonne_normal_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'BuffData.buff_chr_0017_yvonne_normal_skill_projectile.buffEventAction[1].actions[0].actionData[1]:chr_0017_yvonne_normal_skill_projhit',
                    {
                      atb_return: 10,
                      atk_scale: 0,
                      atk_scale_final: 0,
                      atk_scale_layer: 0,
                      atk_scale2: 2,
                      count: 0,
                      crit_up: 0.7,
                      has_potential2: 0,
                      max_count: 0,
                      poise: 30,
                      usp_base: 20,
                      usp_final: 0,
                      usp_layer: 10,
                    },
                    true,
                    sequence(
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'has_potential2' },
                              operator: 'greaterOrEqual',
                              right: { kind: 'constant', value: 1 },
                            },
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'constant', value: 1 },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          forEachTarget(
                            'enemy',
                            sequence(
                              branch(
                                {
                                  kind: 'buffStackCompare',
                                  target: 'enemy',
                                  tagQueryType: 'hasAny',
                                  buffTags: [
                                    'Skill/Character/Common/SpellInflict/CrystInflict',
                                    'Skill/Character/Common/SpellInflict/NaturalInflict',
                                  ],
                                  operator: 'greaterOrEqual',
                                  value: { kind: 'constant', value: 1 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'buffStackCompare',
                                      target: 'enemy',
                                      tagQueryType: 'hasAny',
                                      buffTags: [
                                        'Skill/Character/Common/SpellInflict/CrystInflict',
                                      ],
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 1 },
                                    },
                                    sequence(
                                      step('readBuffStackCount', {
                                        target: 'enemy',
                                        outputKey: 'count',
                                        query: {
                                          kind: 'tag',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/SpellInflict/CrystInflict',
                                          ],
                                        },
                                      }),
                                      branch(
                                        {
                                          kind: 'buffStackCompare',
                                          target: 'enemy',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/SpellInflict/CrystInflict',
                                          ],
                                          operator: 'greaterOrEqual',
                                          value: { kind: 'blackboard', key: 'count' },
                                        },
                                        sequence(
                                          step('finishBuffsByTag', {
                                            target: 'enemy',
                                            tagQueryType: 'hasAny',
                                            buffTags: [
                                              'Skill/Character/Common/SpellInflict/CrystInflict',
                                            ],
                                            reason: 'early',
                                            count: { kind: 'blackboard', key: 'count' },
                                          }),
                                          step('applyBuff', {
                                            buffId: 'buff_common_cryst_cryst_frozen_triggered',
                                            target: 'enemy',
                                            inheritSourceSkillCastInfo: true,
                                            blackboardAssignments: {
                                              consumed_type: { kind: 'constant', value: 2 },
                                              consumed_layer: { kind: 'blackboard', key: 'count' },
                                              count: { kind: 'blackboard', key: 'count' },
                                            },
                                          }),
                                        ),
                                      ),
                                      step('calculateActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'multiply',
                                        left: { kind: 'blackboard', key: 'atk_scale_layer' },
                                        right: { kind: 'blackboard', key: 'count' },
                                      }),
                                      step('modifyActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'atk_scale' },
                                      }),
                                      step('modifyActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'atk_scale2' },
                                      }),
                                      step('changeResourceByActionValue', {
                                        resource: 'sp',
                                        amount: { kind: 'blackboard', key: 'atb_return' },
                                        coefficient: { kind: 'constant', value: 1 },
                                        recipient: 'team',
                                        spGainKind: 'refund',
                                        spGainSource: 'skill',
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'cryo',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_final',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise' },
                                        },
                                        'buff_chr_0017_yvonne_normal_skill_projectile:/lifecycleSequences/finish/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0/whenTrue/steps/0/body/steps/0/whenTrue/steps/0/whenTrue/steps/6',
                                      ),
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'count' },
                                          operator: 'greater',
                                          right: { kind: 'blackboard', key: 'max_count' },
                                        },
                                        sequence(
                                          step('modifyActionValue', {
                                            key: 'max_count',
                                            operation: 'assign',
                                            value: { kind: 'blackboard', key: 'count' },
                                          }),
                                        ),
                                      ),
                                    ),
                                    sequence(
                                      step('readBuffStackCount', {
                                        target: 'enemy',
                                        outputKey: 'count',
                                        query: {
                                          kind: 'tag',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/SpellInflict/NaturalInflict',
                                          ],
                                        },
                                      }),
                                      branch(
                                        {
                                          kind: 'buffStackCompare',
                                          target: 'enemy',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/SpellInflict/NaturalInflict',
                                          ],
                                          operator: 'greaterOrEqual',
                                          value: { kind: 'blackboard', key: 'count' },
                                        },
                                        sequence(
                                          step('finishBuffsByTag', {
                                            target: 'enemy',
                                            tagQueryType: 'hasAny',
                                            buffTags: [
                                              'Skill/Character/Common/SpellInflict/NaturalInflict',
                                            ],
                                            reason: 'early',
                                            count: { kind: 'blackboard', key: 'count' },
                                          }),
                                          step('applyBuff', {
                                            buffId: 'buff_common_cryst_cryst_frozen_triggered',
                                            target: 'enemy',
                                            inheritSourceSkillCastInfo: true,
                                            blackboardAssignments: {
                                              consumed_type: { kind: 'constant', value: 3 },
                                              consumed_layer: { kind: 'blackboard', key: 'count' },
                                              count: { kind: 'blackboard', key: 'count' },
                                            },
                                          }),
                                        ),
                                      ),
                                      step('calculateActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'multiply',
                                        left: { kind: 'blackboard', key: 'atk_scale_layer' },
                                        right: { kind: 'blackboard', key: 'count' },
                                      }),
                                      step('modifyActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'atk_scale' },
                                      }),
                                      step('modifyActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'atk_scale2' },
                                      }),
                                      step('changeResourceByActionValue', {
                                        resource: 'sp',
                                        amount: { kind: 'blackboard', key: 'atb_return' },
                                        coefficient: { kind: 'constant', value: 1 },
                                        recipient: 'team',
                                        spGainKind: 'refund',
                                        spGainSource: 'skill',
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'cryo',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_final',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise' },
                                        },
                                        'buff_chr_0017_yvonne_normal_skill_projectile:/lifecycleSequences/finish/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0/whenTrue/steps/0/body/steps/0/whenTrue/steps/0/whenFalse/steps/6',
                                      ),
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'count' },
                                          operator: 'greater',
                                          right: { kind: 'blackboard', key: 'max_count' },
                                        },
                                        sequence(
                                          step('modifyActionValue', {
                                            key: 'max_count',
                                            operation: 'assign',
                                            value: { kind: 'blackboard', key: 'count' },
                                          }),
                                        ),
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step('modifyActionValue', {
                                    key: 'atk_scale_final',
                                    operation: 'assign',
                                    value: { kind: 'blackboard', key: 'atk_scale' },
                                  }),
                                  step('changeResourceByActionValue', {
                                    resource: 'sp',
                                    amount: { kind: 'blackboard', key: 'atb_return' },
                                    coefficient: { kind: 'constant', value: 1 },
                                    recipient: 'team',
                                    spGainKind: 'refund',
                                    spGainSource: 'skill',
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'cryo',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise' },
                                    },
                                    'buff_chr_0017_yvonne_normal_skill_projectile:/lifecycleSequences/finish/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0/whenTrue/steps/0/body/steps/0/whenFalse/steps/2',
                                  ),
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'count' },
                                      operator: 'greater',
                                      right: { kind: 'blackboard', key: 'max_count' },
                                    },
                                    sequence(
                                      step('modifyActionValue', {
                                        key: 'max_count',
                                        operation: 'assign',
                                        value: { kind: 'blackboard', key: 'count' },
                                      }),
                                    ),
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                          ),
                          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'max_count' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0 },
                            },
                            sequence(
                              step('calculateActionValue', {
                                key: 'usp_final',
                                operation: 'multiply',
                                left: { kind: 'blackboard', key: 'usp_layer' },
                                right: { kind: 'blackboard', key: 'max_count' },
                              }),
                              step('modifyActionValue', {
                                key: 'usp_final',
                                operation: 'add',
                                value: { kind: 'blackboard', key: 'usp_base' },
                              }),
                              step('changeResourceByActionValue', {
                                resource: 'ultimateEnergy',
                                amount: { kind: 'blackboard', key: 'usp_final' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'caster',
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          forEachTarget(
                            'enemy',
                            sequence(
                              branch(
                                {
                                  kind: 'buffStackCompare',
                                  target: 'enemy',
                                  tagQueryType: 'hasAny',
                                  buffTags: [
                                    'Skill/Character/Common/SpellInflict/CrystInflict',
                                    'Skill/Character/Common/SpellInflict/NaturalInflict',
                                  ],
                                  operator: 'greaterOrEqual',
                                  value: { kind: 'constant', value: 1 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'buffStackCompare',
                                      target: 'enemy',
                                      tagQueryType: 'hasAny',
                                      buffTags: [
                                        'Skill/Character/Common/SpellInflict/CrystInflict',
                                      ],
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 1 },
                                    },
                                    sequence(
                                      step('readBuffStackCount', {
                                        target: 'enemy',
                                        outputKey: 'count',
                                        query: {
                                          kind: 'tag',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/SpellInflict/CrystInflict',
                                          ],
                                        },
                                      }),
                                      branch(
                                        {
                                          kind: 'buffStackCompare',
                                          target: 'enemy',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/SpellInflict/CrystInflict',
                                          ],
                                          operator: 'greaterOrEqual',
                                          value: { kind: 'blackboard', key: 'count' },
                                        },
                                        sequence(
                                          step('finishBuffsByTag', {
                                            target: 'enemy',
                                            tagQueryType: 'hasAny',
                                            buffTags: [
                                              'Skill/Character/Common/SpellInflict/CrystInflict',
                                            ],
                                            reason: 'early',
                                            count: { kind: 'blackboard', key: 'count' },
                                          }),
                                          step('applyBuff', {
                                            buffId: 'buff_common_cryst_cryst_frozen_triggered',
                                            target: 'enemy',
                                            inheritSourceSkillCastInfo: true,
                                            blackboardAssignments: {
                                              consumed_type: { kind: 'constant', value: 2 },
                                              consumed_layer: { kind: 'blackboard', key: 'count' },
                                              count: { kind: 'blackboard', key: 'count' },
                                            },
                                          }),
                                        ),
                                      ),
                                      step('calculateActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'multiply',
                                        left: { kind: 'blackboard', key: 'atk_scale_layer' },
                                        right: { kind: 'blackboard', key: 'count' },
                                      }),
                                      step('modifyActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'atk_scale' },
                                      }),
                                      step('modifyActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'atk_scale2' },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'cryo',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_final',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise' },
                                        },
                                        'buff_chr_0017_yvonne_normal_skill_projectile:/lifecycleSequences/finish/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0/whenFalse/steps/0/body/steps/0/whenTrue/steps/0/whenTrue/steps/5',
                                      ),
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'count' },
                                          operator: 'greater',
                                          right: { kind: 'blackboard', key: 'max_count' },
                                        },
                                        sequence(
                                          step('modifyActionValue', {
                                            key: 'max_count',
                                            operation: 'assign',
                                            value: { kind: 'blackboard', key: 'count' },
                                          }),
                                        ),
                                      ),
                                    ),
                                    sequence(
                                      step('readBuffStackCount', {
                                        target: 'enemy',
                                        outputKey: 'count',
                                        query: {
                                          kind: 'tag',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/SpellInflict/NaturalInflict',
                                          ],
                                        },
                                      }),
                                      branch(
                                        {
                                          kind: 'buffStackCompare',
                                          target: 'enemy',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/SpellInflict/NaturalInflict',
                                          ],
                                          operator: 'greaterOrEqual',
                                          value: { kind: 'blackboard', key: 'count' },
                                        },
                                        sequence(
                                          step('finishBuffsByTag', {
                                            target: 'enemy',
                                            tagQueryType: 'hasAny',
                                            buffTags: [
                                              'Skill/Character/Common/SpellInflict/NaturalInflict',
                                            ],
                                            reason: 'early',
                                            count: { kind: 'blackboard', key: 'count' },
                                          }),
                                          step('applyBuff', {
                                            buffId: 'buff_common_cryst_cryst_frozen_triggered',
                                            target: 'enemy',
                                            inheritSourceSkillCastInfo: true,
                                            blackboardAssignments: {
                                              consumed_type: { kind: 'constant', value: 3 },
                                              consumed_layer: { kind: 'blackboard', key: 'count' },
                                              count: { kind: 'blackboard', key: 'count' },
                                            },
                                          }),
                                        ),
                                      ),
                                      step('calculateActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'multiply',
                                        left: { kind: 'blackboard', key: 'atk_scale_layer' },
                                        right: { kind: 'blackboard', key: 'count' },
                                      }),
                                      step('modifyActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'atk_scale' },
                                      }),
                                      step('modifyActionValue', {
                                        key: 'atk_scale_final',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'atk_scale2' },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'cryo',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_final',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise' },
                                        },
                                        'buff_chr_0017_yvonne_normal_skill_projectile:/lifecycleSequences/finish/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0/whenFalse/steps/0/body/steps/0/whenTrue/steps/0/whenFalse/steps/5',
                                      ),
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'count' },
                                          operator: 'greater',
                                          right: { kind: 'blackboard', key: 'max_count' },
                                        },
                                        sequence(
                                          step('modifyActionValue', {
                                            key: 'max_count',
                                            operation: 'assign',
                                            value: { kind: 'blackboard', key: 'count' },
                                          }),
                                        ),
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step('modifyActionValue', {
                                    key: 'atk_scale_final',
                                    operation: 'assign',
                                    value: { kind: 'blackboard', key: 'atk_scale' },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'cryo',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise' },
                                    },
                                    'buff_chr_0017_yvonne_normal_skill_projectile:/lifecycleSequences/finish/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0/whenFalse/steps/0/body/steps/0/whenFalse/steps/1',
                                  ),
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'count' },
                                      operator: 'greater',
                                      right: { kind: 'blackboard', key: 'max_count' },
                                    },
                                    sequence(
                                      step('modifyActionValue', {
                                        key: 'max_count',
                                        operation: 'assign',
                                        value: { kind: 'blackboard', key: 'count' },
                                      }),
                                    ),
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                          ),
                          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'max_count' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0 },
                            },
                            sequence(
                              step('calculateActionValue', {
                                key: 'usp_final',
                                operation: 'multiply',
                                left: { kind: 'blackboard', key: 'usp_layer' },
                                right: { kind: 'blackboard', key: 'max_count' },
                              }),
                              step('modifyActionValue', {
                                key: 'usp_final',
                                operation: 'add',
                                value: { kind: 'blackboard', key: 'usp_base' },
                              }),
                              step('changeResourceByActionValue', {
                                resource: 'ultimateEnergy',
                                amount: { kind: 'blackboard', key: 'usp_final' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'caster',
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                        ),
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
          ),
        ),
      },
    },
    buff_chr_0017_yvonne_potential_5_cd: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'cd' },
      applyTags: [],
      extendTags: [],
      blackboard: { cd: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0017_yvonne_potential_5_effect'],
            reason: 'other',
          }),
        ),
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_potential_5_effect',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
    },
    buff_chr_0017_yvonne_potential_5_effect: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0017_yvonne_potential_5_new: {
      stackingType: 'highPriority',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0, crit_dmg_up: 0 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
        {
          attribute: 'criticalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'crit_dmg_up' },
        },
      ],
    },
    buff_chr_0017_yvonne_power_attack: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0017_yvonne_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { inflict_up: 0, status_up: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'all',
            conditions: [
              {
                kind: 'entityTagMatch',
                target: 'enemy',
                tagQueryType: 'hasAny',
                tags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
              },
              {
                kind: 'entityTagMatch',
                target: 'enemy',
                tagQueryType: 'exceptAny',
                tags: ['Skill/Character/Common/SpellStatus/Frozen'],
              },
            ],
          },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: { slot: 'baseAddition', value: { blackboardKey: 'inflict_up' } },
              attributeTiming: 'runtime',
            },
          ],
        },
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'all',
            conditions: [
              {
                kind: 'entityTagMatch',
                target: 'enemy',
                tagQueryType: 'hasAny',
                tags: ['Skill/Character/Common/SpellStatus/Frozen'],
              },
              {
                kind: 'entityTagMatch',
                target: 'enemy',
                tagQueryType: 'exceptAny',
                tags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
              },
            ],
          },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: { slot: 'baseAddition', value: { blackboardKey: 'status_up' } },
              attributeTiming: 'runtime',
            },
          ],
        },
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'entityTagMatch',
            target: 'enemy',
            tagQueryType: 'hasAll',
            tags: [
              'Skill/Character/Common/SpellInflict/CrystInflict',
              'Skill/Character/Common/SpellStatus/Frozen',
            ],
          },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: { slot: 'baseAddition', value: { blackboardKey: 'status_up' } },
              attributeTiming: 'runtime',
            },
          ],
        },
      ],
    },
    buff_chr_0017_yvonne_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { dmg_up: 0.5 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0017_yvonne_normal_skill_frozen'] },
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'buffOwner',
                      markerId: 'chr_0017_yvonne_talent_1',
                    },
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0017_yvonne_talent_1_valid',
                      target: 'buffSource',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: { dmg_up: { kind: 'blackboard', key: 'dmg_up' } },
                    }),
                    step('createTimedMarker', {
                      target: 'buffOwner',
                      markerId: 'chr_0017_yvonne_talent_1',
                      durationSeconds: { kind: 'constant', value: 0.1 },
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
    buff_chr_0017_yvonne_talent_1_valid: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 4,
      durationSeconds: 15,
      applyTags: [],
      extendTags: [],
      blackboard: { dmg_up: 0.5 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillIdIn', skillIds: ['chr_0017_yvonne_attack5'] },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0017_yvonne_talent_1_valid_up',
                  target: 'eventTarget',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                  asChildBuff: true,
                  lifetimeOwner: 'currentCastSkill',
                  blackboardAssignments: { dmg_up: { kind: 'blackboard', key: 'dmg_up' } },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0017_yvonne_talent_1_valid_up: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 4,
      applyTags: [],
      extendTags: [],
      blackboard: { dmg_up: 0.5 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
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
    buff_chr_0017_yvonne_ultimate_skill: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_yvonne_buff',
        iconPath: '/icons/icon_battle_yvonne_buff.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: true,
        showProgressInNormalSkillButton: false,
        useWeakProgressInNormalSkillButton: false,
        showProgressInUltimateSkillButton: false,
        forceRaiseIconEvent: false,
        showWarningBackground: false,
        playStrongInAnimation: false,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
      },
      applyTags: ['Status/DisableBreakingAttack'],
      extendTags: [],
      blackboard: {
        atk_up: 0,
        crit_dmg_up: 0,
        duration: 0,
        ex_usp_up: 0,
        has_potential4: 0,
        has_potential5: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:0',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'has_potential4' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_ultimate_skill_potential4_valid',
                    target: 'buffSource',
                    source: 'buffSource',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: { ex_usp_up: { kind: 'blackboard', key: 'ex_usp_up' } },
                  }),
                ),
              ),
            ),
          },
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:1',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'has_potential5' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_potential_5_new',
                    target: 'buffSource',
                    source: 'buffSource',
                    inheritSourceSkillCastInfo: true,
                    asChildBuff: true,
                    blackboardAssignments: {
                      atk_up: { kind: 'blackboard', key: 'atk_up' },
                      crit_dmg_up: { kind: 'blackboard', key: 'crit_dmg_up' },
                    },
                  }),
                ),
              ),
            ),
          },
        ),
        enable: sequence(
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:0',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              step('changePlayerActionMode', { modeId: 'ult', lifetime: 'finishByAction' }),
            ),
          },
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:1',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              step('restrictUltimateEnergyRecovery', {
                target: 'caster',
                allowedRecoveryTags: ['Skill/Character/chr_0017_yvonne/UltimateEndUsp'],
                clearUltimateEnergyOnEnd: false,
              }),
            ),
          },
        ),
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_end',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_up: { kind: 'blackboard', key: 'atk_up' },
              crit_dmg_up: { kind: 'blackboard', key: 'crit_dmg_up' },
              has_potential5: { kind: 'blackboard', key: 'has_potential5' },
            },
          }),
        ),
      },
    },
    buff_chr_0017_yvonne_ultimate_skill_camera: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0.033,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          branch(
            {
              kind: 'not',
              condition: {
                kind: 'actionValueCompare',
                left: { kind: 'constant', value: 1 },
                operator: 'equal',
                right: { kind: 'constant', value: 1 },
              },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera_child'],
                reason: 'other',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0017_yvonne_ultimate_skill_end: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration_end' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_yvonne_buff',
        iconPath: '/icons/icon_battle_yvonne_buff.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: false,
        showProgressInNormalSkillButton: false,
        useWeakProgressInNormalSkillButton: false,
        showProgressInUltimateSkillButton: false,
        forceRaiseIconEvent: false,
        showWarningBackground: false,
        playStrongInAnimation: false,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
      },
      applyTags: ['Status/DisableBreakingAttack'],
      extendTags: [],
      blackboard: { atk_up: 0, crit_dmg_up: 0, duration_end: 3, has_potential5: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:0',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'has_potential5' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_potential_5_new',
                    target: 'buffSource',
                    source: 'buffSource',
                    inheritSourceSkillCastInfo: true,
                    asChildBuff: true,
                    blackboardAssignments: {
                      atk_up: { kind: 'blackboard', key: 'atk_up' },
                      crit_dmg_up: { kind: 'blackboard', key: 'crit_dmg_up' },
                    },
                  }),
                ),
              ),
            ),
          },
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:1',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer_effect'],
                reason: 'other',
              }),
            ),
          },
        ),
        enable: sequence(
          step('restrictUltimateEnergyRecovery', {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0017_yvonne/UltimateEndUsp'],
            clearUltimateEnergyOnEnd: false,
          }),
        ),
        finish: sequence(
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:0',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              step('findOwnerSpawnedAbilityEntities', {
                saveToContextKey: 'robots',
                abilityEntityIds: [
                  'abilityentity_chr_0017_yvonne_ultimate_skill',
                  'abilityentity_chr_0017_yvonne_ultimate_skill2',
                  'abilityentity_chr_0017_yvonne_ultimate_skill3',
                ],
              }),
              forEachContextTarget(
                'robots',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                    target: 'currentAbilityEntity',
                    source: 'buffOwner',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
            ),
          },
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:1',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
                reason: 'other',
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_environment'],
                reason: 'other',
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_potential4_valid'],
                reason: 'other',
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_full_effect'],
                reason: 'other',
              }),
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'],
                reason: 'other',
              }),
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer_effect'],
                reason: 'other',
              }),
            ),
          },
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'native-buff-callback:2',
              lifetime: 'execution',
              alwaysNext: true,
              shareParentBlackboard: true,
              initialValues: {},
              inheritParent: true,
            },
            body: sequence(
              step('adjustSkillCooldown', {
                target: 'caster',
                skill: { kind: 'type', skillType: 'ultimate' },
                operation: 'set',
                basis: 'absoluteSeconds',
                value: { kind: 'constant', value: 10 },
              }),
            ),
          },
        ),
      },
    },
    buff_chr_0017_yvonne_ultimate_skill_layer: {
      stackingType: 'enhanceAndRefresh',
      priority: 0,
      maxStackCount: 10,
      durationSeconds: { blackboardKey: 'recycle_time' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_yvonne_buff',
        iconPath: '/icons/icon_battle_yvonne_buff.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: false,
        showProgressInNormalSkillButton: false,
        useWeakProgressInNormalSkillButton: false,
        showProgressInUltimateSkillButton: false,
        forceRaiseIconEvent: false,
        showWarningBackground: false,
        playStrongInAnimation: false,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: {
        crit_rate_up: 0.06,
        crit_rate_up_dynamic: 0,
        normal_dmg_up: 0.03,
        recycle_time: 4,
      },
      attributeModifiers: [
        {
          attribute: 'criticalRate',
          slot: 'baseAddition',
          value: { blackboardKey: 'normal_dmg_up' },
        },
        {
          attribute: 'criticalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'crit_rate_up_dynamic' },
        },
      ],
      lifecycleSequences: {
        enhanceChanged: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'buffOwner',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 10 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'crit_rate_up_dynamic',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'crit_rate_up' },
              }),
              step('refreshCurrentBuffAttributeModifiers', {}),
            ),
          ),
        ),
      },
    },
    buff_chr_0017_yvonne_ultimate_skill_potential4_valid: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { ex_usp_up: 0, is_recover: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'is_recover' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'ex_usp_up' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
                isPercentValue: true,
                ultimateRecoveryTag: 'Skill/Character/chr_0017_yvonne/UltimateEndUsp',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0017_yvonne_ultimate_skill_robot_end: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: { start: sequence(step('finishCurrentAbilityEntity', {})) },
    },
    buff_chr_0017_yvonne_ultimate_skill_shield: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'effect_duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { effect_duration: 0 },
      attributeModifiers: [],
    },
    buff_chr_0017_yvonne_ultimate_skill_voice: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 9 },
      attributeModifiers: [],
    },
    buff_chr_0017_yvonne_ultimate_skill_voice_short: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 3.5 },
      attributeModifiers: [],
    },
    buff_chr_0017_yvonne_ultimate_skill_voice_start: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 9 },
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0017_yvonne_combo_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      childSkill: {
        skillId: 'chr_0017_yvonne_combo_skill_abilityrange',
        blackboard: {
          atk_scale_boom: 0,
          atk_scale_tick: 0,
          duration: 0,
          has_potential1: 0,
          interval: 0.75,
          maxcnt: 6,
          poise: 10,
          radius: 0,
          usp: 0,
          usp_extra: 0,
        },
        scheduledSequences: [
          scheduled(
            19,
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_combo_skill',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  radius: { kind: 'blackboard', key: 'radius' },
                  atk_scale_tick: { kind: 'blackboard', key: 'atk_scale_tick' },
                  duration: { kind: 'blackboard', key: 'duration' },
                  atk_scale_boom: { kind: 'blackboard', key: 'atk_scale_boom' },
                  poise: { kind: 'blackboard', key: 'poise' },
                  has_potential1: { kind: 'blackboard', key: 'has_potential1' },
                  interval: { kind: 'blackboard', key: 'interval' },
                  maxcnt: { kind: 'blackboard', key: 'maxcnt' },
                  usp: { kind: 'blackboard', key: 'usp_extra' },
                },
              }),
            ),
            20,
          ),
        ],
      },
    },
    abilityentity_chr_0017_yvonne_ultimate_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0017_yvonne/UltimateAbilityEntity',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
        blackboard: { atk_scale_boom: 0, atk_scale_tick: 0, duration: 0, radius: 0 },
        scheduledSequences: [],
      },
    },
    abilityentity_chr_0017_yvonne_ultimate_skill2: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0017_yvonne/UltimateAbilityEntity',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
        blackboard: { atk_scale_boom: 0, atk_scale_tick: 0, duration: 0, radius: 0 },
        scheduledSequences: [],
      },
    },
    abilityentity_chr_0017_yvonne_ultimate_skill3: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0017_yvonne/UltimateAbilityEntity',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0017_yvonne_ultimate_skill_abilityentity',
        blackboard: { atk_scale_boom: 0, atk_scale_tick: 0, duration: 0, radius: 0 },
        scheduledSequences: [],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
