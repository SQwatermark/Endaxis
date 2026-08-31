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

export const xaihiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0011_seraph_attack1',
    timelineBlockFrames: 13,
    exclusiveFrame: 14,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 13, endFrame: 25, sourceSkillIds: ['chr_0011_seraph_attack2'] },
      ],
    },
    costFrame: 11,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack1.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack1.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0011_seraph_attack1_projhit',
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
                    'chr_0011_seraph_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        10,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    display_atk_scale: [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
  },
);

export const xaihiBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0011_seraph_attack2',
    timelineBlockFrames: 17,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 28,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 17, endFrame: 28, sourceSkillIds: ['chr_0011_seraph_attack3'] },
      ],
    },
    costFrame: 7,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack2.actionGroupData.timelineActions[2]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack2.actionGroupData.timelineActions[2]._sequenceActionData.actionData[0]:chr_0011_seraph_attack2_projhit',
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
                    'chr_0011_seraph_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        7,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
    display_atk_scale: [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
  },
);

export const xaihiBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0011_seraph_attack3',
    timelineBlockFrames: 14,
    exclusiveFrame: 14,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 14, endFrame: 25, sourceSkillIds: ['chr_0011_seraph_attack4'] },
      ],
    },
    costFrame: 11,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack3_true',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0011_seraph_attack3_projhit',
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
                    'chr_0011_seraph_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        8,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [0.21, 0.23, 0.25, 0.27, 0.29, 0.32, 0.34, 0.36, 0.38, 0.4, 0.44, 0.47],
    display_atk_scale: [0.21, 0.23, 0.25, 0.27, 0.29, 0.32, 0.34, 0.36, 0.38, 0.4, 0.44, 0.47],
  },
);

export const xaihiBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0011_seraph_attack4',
    timelineBlockFrames: 21,
    exclusiveFrame: 24,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 33,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 21, endFrame: 33, sourceSkillIds: ['chr_0011_seraph_attack5'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0011_seraph_attack4_projhit',
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
                    'chr_0011_seraph_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        12,
      ),
      scheduled(
        7,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack4.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack3_02',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack4.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0011_seraph_attack4_projhit',
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
                    'chr_0011_seraph_attack4:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
        7,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [0.17, 0.18, 0.2, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.37],
    display_atk_scale: [0.33, 0.36, 0.4, 0.43, 0.46, 0.5, 0.53, 0.56, 0.59, 0.64, 0.68, 0.74],
  },
);

export const xaihiBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0011_seraph_attack5',
    timelineBlockFrames: 33,
    exclusiveFrame: 33,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 33, endFrame: 40, sourceSkillIds: ['chr_0011_seraph_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'normalAttackLastCombo'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0011_seraph_attack5:/scheduledSequences/0/sequence/steps/0',
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
        19,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 15,
    atk_scale: [0.55, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.94, 0.99, 1.06, 1.14, 1.24],
    poise: 15,
    display_atk_scale: [0.55, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.94, 0.99, 1.06, 1.14, 1.24],
  },
);

export const xaihiFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0011_seraph_power_attack',
    timelineBlockFrames: 34,
    exclusiveFrame: 50,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 34,
          endFrame: 53,
          sourceSkillIds: ['chr_0011_seraph_normal_skill', 'chr_0011_seraph_combo_skill'],
        },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        34,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.2 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'common' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        35,
      ),
      scheduled(
        32,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0011_seraph_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        32,
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
        50,
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
        34,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  {
    atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
  },
);

export const xaihiPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0011_seraph_plunging_attack_end',
    timelineBlockFrames: 13,
    exclusiveFrame: 12,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0011_seraph_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
        6,
      ),
    ],
    skillType: 'plungingAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  { atb: 0, atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8] },
);

export const xaihiBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0011_seraph_normal_skill',
    timelineBlockFrames: 31,
    exclusiveFrame: 30,
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
        6,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0011_seraph_talent_1_atb'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0011_seraph_talent_1_atb'],
                reason: 'other',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
      scheduled(
        7,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0011_seraph_spawnball',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_up: { kind: 'blackboard', key: 'atk_up' },
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
              heal_value: { kind: 'blackboard', key: 'heal_value' },
              buff_duration: { kind: 'blackboard', key: 'buff_duration' },
              will_up: { kind: 'blackboard', key: 'will_up' },
            },
          }),
        ),
        8,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb: 0,
    atk_scale: 0.1,
    atk_up: [0.09, 0.09, 0.09, 0.09, 0.09, 0.11, 0.11, 0.11, 0.13, 0.13, 0.13, 0.15],
    buff_duration: 25,
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    duration: 20,
    heal_value: [144, 172.8, 201.6, 230.4, 244.8, 259.2, 273.6, 288, 302.4, 309.6, 316.8, 324],
    input_angle: 0,
    potential_1: 0,
    select_radius: 10,
    usp: 0,
    will_up: [0.336, 0.4, 0.47, 0.54, 0.57, 0.6, 0.64, 0.67, 0.71, 0.72, 0.74, 0.76],
  },
);

export const xaihiComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0011_seraph_combo_skill',
    timelineBlockFrames: 25,
    exclusiveFrame: 42,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 25, endFrame: 60, sourceSkillIds: ['chr_0011_seraph_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchr',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        24,
      ),
      scheduled(
        24,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'ball',
            abilityEntityIds: [
              'abilityentity_chr_0011_seraph_normal_skill',
              'abilityentity_chr_0011_seraph_normal_skill_buff',
              'abilityentity_chr_0027_tangtang_normal_skill_02_02',
            ],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'ball',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              forEachContextTarget(
                'ball',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_finishball_02',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('finishBuffsById', {
                target: 'party',
                buffIds: ['buff_chr_0011_seraph_atk_buff_normal_skill'],
                reason: 'other',
              }),
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_combo_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1].succeedActions.actionData[0]:projectile_chr_0011_seraph_combo_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0011_seraph_combo_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1].succeedActions.actionData[0]:chr_0011_seraph_combo_skill_projhit',
                    {
                      atk_scale: 0,
                      cryst_up: 0,
                      duration: 0,
                      exist_talent_1: 0,
                      poise: 0,
                      potential_3: 0,
                      usp: 0,
                    },
                    true,
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'exist_talent_1' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'entityTagMatch',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              tags: [
                                'Skill/Character/Common/SpellInflict/CrystInflict',
                                'Skill/Character/Common/SpellStatus/Frozen',
                              ],
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0011_seraph_talent_1_crystup',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  cryst_up: { kind: 'blackboard', key: 'cryst_up' },
                                  duration: { kind: 'blackboard', key: 'duration' },
                                },
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['comboSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        },
                        'chr_0011_seraph_combo_skill:/scheduledSequences/1/sequence/steps/1/whenTrue/steps/2/body/steps/0/body/steps/2',
                      ),
                      step('startTimeDilation', {
                        scope: 'entity',
                        durationSeconds: { kind: 'constant', value: 0.2 },
                        slot: 'TimeDilation/Layer/Entity/HitStop',
                        priority: 10,
                        curve: { kind: 'named', key: 'char_hard_stop' },
                        finishByAction: false,
                        targets: ['enemy', 'caster'],
                      }),
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'caster',
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
            sequence(
              forEachContextTarget(
                'ball',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_finishball_02',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('finishBuffsById', {
                target: 'party',
                buffIds: ['buff_chr_0011_seraph_atk_buff_normal_skill'],
                reason: 'other',
              }),
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_combo_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1].failActions.actionData[0]:projectile_chr_0011_seraph_combo_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0011_seraph_combo_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1].failActions.actionData[0]:chr_0011_seraph_combo_skill_projhit',
                    {
                      atk_scale: 0,
                      cryst_up: 0,
                      duration: 0,
                      exist_talent_1: 0,
                      poise: 0,
                      potential_3: 0,
                      usp: 0,
                    },
                    true,
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'exist_talent_1' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'entityTagMatch',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              tags: [
                                'Skill/Character/Common/SpellInflict/CrystInflict',
                                'Skill/Character/Common/SpellStatus/Frozen',
                              ],
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0011_seraph_talent_1_crystup',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  cryst_up: { kind: 'blackboard', key: 'cryst_up' },
                                  duration: { kind: 'blackboard', key: 'duration' },
                                },
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['comboSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        },
                        'chr_0011_seraph_combo_skill:/scheduledSequences/1/sequence/steps/1/whenFalse/steps/2/body/steps/0/body/steps/2',
                      ),
                      step('startTimeDilation', {
                        scope: 'entity',
                        durationSeconds: { kind: 'constant', value: 0.2 },
                        slot: 'TimeDilation/Layer/Entity/HitStop',
                        priority: 10,
                        curve: { kind: 'named', key: 'char_hard_stop' },
                        finishByAction: false,
                        targets: ['enemy', 'caster'],
                      }),
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'caster',
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
            { alwaysNext: true },
          ),
        ),
        25,
      ),
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: [
              'buff_chr_0011_seraph_combo_skill_listener',
              'buff_chr_0011_seraph_normal_skill_heal',
            ],
            reason: 'other',
          }),
        ),
        1,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.900000036 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
            influenceSkillCooldownSeconds: { kind: 'constant', value: 0.4 },
          }),
        ),
        24,
      ),
    ],
    cooldownFrames: [240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 210],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.85, 4.15, 4.5],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    cryst_up: 0,
    duration: 0,
    exist_talent_1: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    potential_3: 0,
    select_radius: 4,
    usp: 10,
  },
);

export const xaihiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0011_seraph_ultimate_skill',
    timelineBlockFrames: 67,
    exclusiveFrame: 80,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 67,
          endFrame: 100,
          sourceSkillIds: ['chr_0011_seraph_normal_skill', 'chr_0011_seraph_combo_skill'],
        },
      ],
    },
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
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        45,
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
        80,
      ),
      scheduled(
        58,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0011_seraph_atk_buff',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_up: { kind: 'blackboard', key: 'atk_up' },
              duration: { kind: 'blackboard', key: 'duration' },
              wisd_up: { kind: 'blackboard', key: 'wisd_up' },
              wisd_max: { kind: 'blackboard', key: 'wisd_max' },
            },
          }),
        ),
        61,
      ),
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: 1.5,
    atk_up: [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.22, 0.24],
    duration: 12,
    exist_talent_2: 0,
    heal_value: 0,
    radius: 1,
    wisd_max: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.36],
    wisd_up: [
      0.00014, 0.00015, 0.00016, 0.00018, 0.00019, 0.0002, 0.00022, 0.00023, 0.00024, 0.00026,
      0.00028, 0.0003,
    ],
  },
);

export const commonBuffDefinitions = {
  buff_common_affixes_enhance_crystal: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ['Skill/Character/Common/Affixes/Enhance/EnhanceSpell/EnhanceCryst'],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_enhance_crystal_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'cryoEnhancedDamageIncrease',
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
  buff_common_affixes_enhance_natural: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ['Skill/Character/Common/Affixes/Enhance/EnhanceSpell/EnhanceNatural'],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_enhance_natural_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'natureEnhancedDamageIncrease',
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
  buff_common_affixes_enhance_spell: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Skill/Character/Common/Affixes/Enhance',
      'Skill/Character/Common/Affixes/Enhance/EnhanceSpell',
      'Skill/Character/Common/Affixes/Enhance/EnhanceSpell/EnhanceFire',
      'Skill/Character/Common/Affixes/Enhance/EnhanceSpell/EnhanceCryst',
      'Skill/Character/Common/Affixes/Enhance/EnhanceSpell/EnhancePulse',
      'Skill/Character/Common/Affixes/Enhance/EnhanceSpell/EnhanceNatural',
    ],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_enhance_spell_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'heatEnhancedDamageIncrease',
        slot: 'baseAddition',
        value: { blackboardKey: 'rate' },
      },
      {
        attribute: 'electricEnhancedDamageIncrease',
        slot: 'baseAddition',
        value: { blackboardKey: 'rate' },
      },
      {
        attribute: 'cryoEnhancedDamageIncrease',
        slot: 'baseAddition',
        value: { blackboardKey: 'rate' },
      },
      {
        attribute: 'natureEnhancedDamageIncrease',
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
  buff_common_affixes_enhance_spell_default_child: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    presentation: {
      visible: true,
      iconId: 'icon_battle_affix_spell_enhance',
      iconPath: '/icons/icon_battle_affix_spell_enhance.webp',
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
      orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordBuff' },
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
  buff_common_full_immune: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Immune/Damage',
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
  buff_common_obtain_ultimate_sp: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 1,
    applyTags: [],
    extendTags: [],
    blackboard: { ratio: 1, usp_everyone: 6.5, usp_self: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })),
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
  slug: 'xaihi',
  gameId: 'XAIHI',
  rarity: 5,
  weaponType: 'arts-unit',
  element: 'cryo',
  role: 'supporter',
  mainAttribute: 'will',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [9, 26, 44, 62, 80, 89],
    agility: [9, 26, 45, 64, 82, 91],
    intellect: [15, 39, 64, 89, 114, 127],
    will: [15, 43, 74, 104, 134, 150],
    baseAttack: [30, 86, 144, 203, 262, 291],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        xaihiBasicAttack1,
        xaihiBasicAttack2,
        xaihiBasicAttack3,
        xaihiBasicAttack4,
        xaihiBasicAttack5,
      ],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: xaihiFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: xaihiPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: xaihiBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: xaihiComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: xaihiUltimate },
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
      ],
      defaultSkillKey: 'basicAttack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'exist_talent_1',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'cryst_up',
          operation: 'assign',
          value: [0.07, 0.1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'duration',
          operation: 'assign',
          value: [5, 5],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'exist_talent_2',
          operation: 'assign',
          value: 1,
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
          blackboardKey: 'atk_up',
          operation: 'add',
          value: 0.05,
        },
      ],
    },
    {
      key: 'potential2',
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
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 15 },
        { kind: 'addStaticHealingIncrease', target: 'output', value: 0.1 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_up',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'wisd_up',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'wisd_max',
          operation: 'multiply',
          value: 1.1,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0011_seraph_atk_buff: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_up: 0,
        duration: 0,
        final_atkup: 0,
        final_final_atkup: 0,
        wisd_max: 0,
        wisd_up: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'intellect' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'wisd_up' },
            base: { kind: 'constant', value: 0 },
            targetKey: 'final_atkup',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'final_atkup' },
              operator: 'greaterOrEqual',
              right: { kind: 'blackboard', key: 'wisd_max' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'final_final_atkup',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'wisd_max' },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'final_final_atkup',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'final_atkup' },
              }),
            ),
            { alwaysNext: true },
          ),
          step('calculateActionValue', {
            key: 'final_final_atkup',
            operation: 'add',
            left: { kind: 'blackboard', key: 'final_final_atkup' },
            right: { kind: 'blackboard', key: 'atk_up' },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_crystal',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'final_final_atkup' },
            },
            stringBlackboardAssignments: { child_buff_id: 'buff_chr_0011_seraph_ultimate_effect' },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_natural',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'final_final_atkup' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_chr_0011_seraph_ultimate_effect_2',
            },
          }),
        ),
      },
    },
    buff_chr_0011_seraph_combo_count: {
      stackingType: 'enhance',
      priority: 0,
      maxStackCount: 2,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        enhanceChanged: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'buffOwner',
              buffIds: ['buff_chr_0011_seraph_combo_count'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 2 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0011_seraph_finishball_04',
                target: 'buffOwner',
                source: 'buffOwner',
                inheritSourceSkillCastInfo: true,
              }),
              step('mergeContextTargets', {
                saveToContextKey: 'seraph',
                sources: [{ kind: 'target', target: 'buffSource' }],
              }),
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0011_seraph_combo_count'],
                reason: 'other',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0011_seraph_finishball_02: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: false,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: { start: sequence(step('finishCurrentAbilityEntity', {})) },
    },
    buff_chr_0011_seraph_finishball_04: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 6,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          step('mergeContextTargets', {
            saveToContextKey: 'seraph',
            sources: [{ kind: 'target', target: 'buffSource' }],
          }),
          step('finishBuffsById', {
            target: 'buffSource',
            buffIds: ['buff_chr_0011_seraph_combo_skill_listener'],
            reason: 'other',
          }),
          step('finishCurrentAbilityEntity', {}),
        ),
      },
    },
    buff_chr_0011_seraph_mainchr_heal: {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: 0.25,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0,
        atk_up: 0,
        buff_duration: 0,
        final_heal_value: 0,
        heal_value: 0,
        potential_1: 0,
        will_up: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          withActionBlackboardScope(
            'native-buff-callback:0',
            {},
            true,
            sequence(
              step('storeSourceAttributeValue', {
                attribute: { kind: 'specific', key: 'will' },
                stage: 'finalNonConverted',
                useFloor: false,
                divisor: { kind: 'constant', value: 1 },
                multiplier: { kind: 'blackboard', key: 'will_up' },
                base: { kind: 'blackboard', key: 'heal_value' },
                targetKey: 'final_heal_value',
              }),
              step('heal', {
                target: 'buffOwner',
                alwaysNext: true,
                tags: ['Skill/Character/Common/Heal/NormalSkillHeal'],
                amount: { kind: 'blackboard', key: 'final_heal_value' },
              }),
            ),
            undefined,
            { lifetime: 'execution', alwaysNext: true },
          ),
          withActionBlackboardScope(
            'native-buff-callback:1',
            {},
            true,
            sequence(
              branch(
                {
                  kind: 'healthCompare',
                  target: 'caster',
                  valueType: 'ratio',
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_potential_1_atkup',
                    target: 'buffOwner',
                    source: 'buffSource',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      buff_duration: { kind: 'blackboard', key: 'buff_duration' },
                      atk_up: { kind: 'blackboard', key: 'atk_up' },
                    },
                  }),
                ),
              ),
            ),
            undefined,
            { lifetime: 'execution', alwaysNext: true },
          ),
        ),
      },
    },
    buff_chr_0011_seraph_normal_skill_heal: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.1,
        atk_up: 0,
        buff_duration: 0,
        duration: 20,
        heal_value: 20,
        potential_1: 0,
        will_up: 0,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'outputDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: {
                  kind: 'timedMarkerPresent',
                  target: 'buffOwner',
                  markerId: 'buff_chr_0011_seraph_normal_skill_heal',
                },
              },
              sequence(
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0011_seraph_finishball_04'],
                    operator: 'lessOrEqual',
                    value: { kind: 'constant', value: 0 },
                  },
                  sequence(
                    branch(
                      { kind: 'casterControlled' },
                      sequence(
                        branch(
                          {
                            kind: 'eventDamageTagsMatch',
                            match: 'hasAny',
                            tags: ['normalAttackLastCombo'],
                          },
                          sequence(
                            step('mergeContextTargets', {
                              saveToContextKey: 'seraph',
                              sources: [{ kind: 'target', target: 'buffSource' }],
                            }),
                            step('findOwnerSpawnedAbilityEntities', {
                              saveToContextKey: 'ball',
                              abilityEntityIds: ['abilityentity_chr_0011_seraph_normal_skill'],
                              ownerContextKey: 'seraph',
                            }),
                            forEachContextTarget(
                              'ball',
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0011_seraph_combo_count',
                                  target: 'currentAbilityEntity',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                            ),
                            step('applyBuff', {
                              buffId: 'buff_chr_0011_seraph_mainchr_heal',
                              target: 'buffOwner',
                              source: 'buffSource',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                                heal_value: { kind: 'blackboard', key: 'heal_value' },
                                potential_1: { kind: 'blackboard', key: 'potential_1' },
                                buff_duration: { kind: 'blackboard', key: 'buff_duration' },
                                atk_up: { kind: 'blackboard', key: 'atk_up' },
                                will_up: { kind: 'blackboard', key: 'will_up' },
                              },
                            }),
                            step('createTimedMarker', {
                              target: 'buffOwner',
                              markerId: 'buff_chr_0011_seraph_normal_skill_heal',
                              durationSeconds: { kind: 'constant', value: 0.3 },
                              autoFinishByAction: false,
                            }),
                          ),
                        ),
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
    buff_chr_0011_seraph_potential_1_atkup: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'buff_duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0, buff_duration: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_spell',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'buff_duration' },
              rate: { kind: 'blackboard', key: 'atk_up' },
            },
          }),
        ),
      },
    },
    buff_chr_0011_seraph_spawnball: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.1,
        atk_up: 0,
        buff_duration: 0,
        heal_value: 30,
        potential_1: 0,
        will_up: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0011_seraph_normal_skill',
            childSkillId: 'chr_0011_seraph_normal_skill_abentity_onfield',
            inheritActionBlackboard: true,
            dieWhenSourceDies: false,
          }),
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
      },
    },
    buff_chr_0011_seraph_talent_1_crystup: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_cryst_taken_up',
        iconPath: '/icons/icon_battle_cryst_taken_up.webp',
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
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { cryst_up: 0, duration: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: { kind: 'eventDamageTypesMatch', damageTypes: ['cryo'] },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'cryst_up' },
            },
          ],
        },
      ],
    },
    buff_chr_0011_seraph_ultimate_effect: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_cryst_enhance',
        iconPath: '/icons/icon_battle_affix_cryst_enhance.webp',
        showInHeadBarCommon: true,
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
    buff_chr_0011_seraph_ultimate_effect_2: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_natural_enhance',
        iconPath: '/icons/icon_battle_affix_natural_enhance.webp',
        showInHeadBarCommon: true,
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0011_seraph_normal_skill: {
      lifetime: { kind: 'limited', durationSeconds: 30 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0011_seraph_normal_skill_abentity_onfield',
        blackboard: {
          atk_scale: 0.1,
          atk_up: 0,
          buff_duration: 0,
          heal_value: 20,
          poise: 0,
          potential_1: 0,
          usp: 0,
          will_up: 0,
        },
        scheduledSequences: [
          scheduled(
            1,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0011_seraph_normal_skill_heal',
                target: 'party',
                source: 'currentAbilityEntity',
                finishByAction: true,
                blackboardAssignments: {
                  atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                  heal_value: { kind: 'blackboard', key: 'heal_value' },
                  potential_1: { kind: 'blackboard', key: 'potential_1' },
                  buff_duration: { kind: 'blackboard', key: 'buff_duration' },
                  atk_up: { kind: 'blackboard', key: 'atk_up' },
                  will_up: { kind: 'blackboard', key: 'will_up' },
                },
              }),
            ),
            901,
          ),
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_full_immune',
                target: 'currentAbilityEntity',
                source: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            1,
          ),
          scheduled(
            600,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0011_seraph_finishball_04'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(),
                sequence(
                  step('finishBuffsById', {
                    target: 'caster',
                    buffIds: ['buff_chr_0011_seraph_combo_skill_listener'],
                    reason: 'other',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_finishball_02',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            603,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
