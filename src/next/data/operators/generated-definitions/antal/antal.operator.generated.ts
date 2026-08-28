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

export const antalBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0023_antal_attack1',
    timelineBlockFrames: 15,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_attack1.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_normal_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_attack1.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0023_antal_attack1_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0023_antal_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
  },
  { atb: 0, atk_scale: [0.23, 0.25, 0.28, 0.3, 0.32, 0.35, 0.37, 0.39, 0.41, 0.44, 0.48, 0.52] },
);

export const antalBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0023_antal_attack2',
    timelineBlockFrames: 20,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_attack2.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_normal_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_attack2.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0023_antal_attack2_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0023_antal_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
    atk_scale: [0.28, 0.31, 0.34, 0.36, 0.39, 0.42, 0.45, 0.48, 0.5, 0.54, 0.58, 0.63],
    display_atk_scale: [0.28, 0.31, 0.34, 0.36, 0.39, 0.42, 0.45, 0.48, 0.5, 0.54, 0.58, 0.63],
  },
);

export const antalBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0023_antal_attack3',
    timelineBlockFrames: 22,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        14,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'constant', value: 0.5 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0023_antal_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0023_antal_attack3_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0023_antal_attack3:/scheduledSequences/0/sequence/steps/1/body/steps/0/body/steps/0',
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
      scheduled(
        18,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0023_antal_attack3_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0023_antal_attack3:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        18,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.34, 0.37, 0.41, 0.44, 0.48, 0.51, 0.54, 0.58, 0.61, 0.65, 0.71, 0.77] },
);

export const antalBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0023_antal_attack4',
    timelineBlockFrames: 38,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        27,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'constant', value: 0.5 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0023_antal_normal_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0023_antal_attack4_powerattack_projhit',
                { atb: 0, atk_scale: 0, poise: 0 },
                true,
                sequence(
                  branch(
                    {
                      kind: 'not',
                      condition: {
                        kind: 'timedMarkerPresent',
                        target: 'caster',
                        markerId: 'have_recovered',
                      },
                    },
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'electric',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack', 'normalAttackLastCombo'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                          staggerOnlyWhenCasterControlled: true,
                        },
                        'chr_0023_antal_attack4:/scheduledSequences/0/sequence/steps/1/body/steps/0/body/steps/0/whenTrue/steps/0',
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
                          step('createTimedMarker', {
                            target: 'caster',
                            markerId: 'have_recovered',
                            durationSeconds: { kind: 'constant', value: 0.5 },
                            autoFinishByAction: false,
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'electric',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0023_antal_attack4:/scheduledSequences/0/sequence/steps/1/body/steps/0/body/steps/0/whenFalse/steps/0',
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
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[2]:projectile_chr_0023_antal_normal_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[2]:chr_0023_antal_attack4_powerattack_projhit',
                { atb: 0, atk_scale: 0, poise: 0 },
                true,
                sequence(
                  branch(
                    {
                      kind: 'not',
                      condition: {
                        kind: 'timedMarkerPresent',
                        target: 'caster',
                        markerId: 'have_recovered',
                      },
                    },
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'electric',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack', 'normalAttackLastCombo'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                          staggerOnlyWhenCasterControlled: true,
                        },
                        'chr_0023_antal_attack4:/scheduledSequences/0/sequence/steps/2/body/steps/0/body/steps/0/whenTrue/steps/0',
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
                          step('createTimedMarker', {
                            target: 'caster',
                            markerId: 'have_recovered',
                            durationSeconds: { kind: 'constant', value: 0.5 },
                            autoFinishByAction: false,
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'electric',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalAttack'],
                        },
                        'chr_0023_antal_attack4:/scheduledSequences/0/sequence/steps/2/body/steps/0/body/steps/0/whenFalse/steps/0',
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
        27,
      ),
    ],
  },
  {
    atb: 15,
    atk_scale: [0.51, 0.56, 0.61, 0.66, 0.71, 0.77, 0.82, 0.87, 0.92, 0.98, 1.06, 1.15],
    poise: 15,
  },
);

export const antalFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0023_antal_power_attack',
    timelineBlockFrames: 32,
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_power_attack02',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:chr_0023_antal_power_attack02_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.06,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0023_antal_power_attack:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_power_attack02',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:chr_0023_antal_power_attack02_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.06,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0023_antal_power_attack:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
        14,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_power_attack02',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:chr_0023_antal_power_attack02_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.06,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0023_antal_power_attack:/scheduledSequences/2/sequence/steps/0/body/steps/0/body/steps/0',
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
      scheduled(
        15,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_power_attack02',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0]:chr_0023_antal_power_attack02_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.06,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0023_antal_power_attack:/scheduledSequences/3/sequence/steps/0/body/steps/0/body/steps/0',
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
        16,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[16]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_power_attack02',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[16]._sequenceActionData.actionData[0]:chr_0023_antal_power_attack02_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.06,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0023_antal_power_attack:/scheduledSequences/4/sequence/steps/0/body/steps/0/body/steps/0',
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
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        16,
      ),
      scheduled(
        25,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[18]._sequenceActionData.actionData[0]:projectile_chr_0023_antal_power_attack',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0023_antal_power_attack.actionGroupData.timelineActions[18]._sequenceActionData.actionData[0]:chr_0023_antal_power_attack_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'electric',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.7,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0023_antal_power_attack:/scheduledSequences/5/sequence/steps/0/body/steps/0/body/steps/0',
                  ),
                  step('gainFinisherSp', { factor: 1, recipient: 'team' }),
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
        26,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.3667 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        27,
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
        42,
      ),
    ],
  },
  {
    addition_vertical: 0,
    atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
    look_at_x: 0,
    vertical: 0,
  },
);

export const antalPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0023_antal_plunging_attack_end',
    timelineBlockFrames: 16,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0023_antal_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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
  },
  { atb: 0, atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8] },
);

export const antalBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0023_antal_normal_skill',
    timelineBlockFrames: 31,
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
        20,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0023_antal_normal_skill'],
            reason: 'other',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0023_antal_normal_skill',
            target: 'caster',
            source: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              rate: { kind: 'blackboard', key: 'rate' },
              duration: { kind: 'blackboard', key: 'duration' },
              potential_3: { kind: 'blackboard', key: 'potential_3' },
              potential_3_atb: { kind: 'blackboard', key: 'potential_3_atb' },
              potential_5: { kind: 'blackboard', key: 'potential_5' },
              delay_time: { kind: 'blackboard', key: 'delay_time' },
              potential_5_rate: { kind: 'blackboard', key: 'potential_5_rate' },
            },
          }),
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0023_antal_normal_skill:/scheduledSequences/1/sequence/steps/2',
          ),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
        20,
      ),
      scheduled(
        20,
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
                durationSeconds: { kind: 'constant', value: 0.1 },
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
        23,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
  },
  {
    atk_scale: [0.89, 0.98, 1.07, 1.16, 1.24, 1.33, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    atk_scale_2: 0,
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    delay_time: 0,
    duration: 60,
    gained_atb: 0,
    input_angle: 0,
    poise: 0,
    potential_3: 0,
    potential_3_atb: 0,
    potential_5: 0,
    potential_5_rate: 0,
    rate: [0.05, 0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1],
    select_radius: 10,
  },
);

export const antalComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0023_antal_combo_skill',
    timelineBlockFrames: 24,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        21,
        sequence(
          {
            kind: 'switch',
            parameters: {
              choice: { kind: 'blackboard', key: 'EntityBB_combo_type' },
              alwaysNext: true,
            },
            options: [
              {
                value: { kind: 'constant', value: 1 },
                sequence: sequence({
                  kind: 'switch',
                  parameters: {
                    choice: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                    alwaysNext: true,
                  },
                  options: [
                    {
                      value: { kind: 'constant', value: 2 },
                      sequence: sequence(
                        step('applyPhysicalInfliction', {
                          type: 'fracture',
                          target: 'enemy',
                          isExtra: false,
                          noGuardBuffId: 'buff_physical_no_guard',
                          noGuardDefinition: {
                            stackingType: 'enhanceAndRefresh',
                            priority: 100,
                            maxStackCount: 4,
                            durationSeconds: { blackboardKey: 'duration' },
                            presentation: {
                              visible: true,
                              iconId: 'icon_shadow_attribute_penetrate',
                              iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                              showInHeadBarCommon: false,
                              showInHeadBarAttached: true,
                              showInSquadIcon: false,
                              onlyShowForMainCharacter: false,
                              iconStyleInSquad: 'Default',
                              abnormalColorType: 'Physical',
                              orderPriority: {
                                useDirectoryValue: false,
                                value: 0,
                                category: 'CommonCharBuff',
                              },
                            },
                            applyTags: ['Skill/Character/Common/NoGuard'],
                            extendTags: [],
                            blackboard: {
                              atk_scale: 0,
                              count: 0,
                              duration: 20,
                              skip_handle_cryst_break: 0,
                            },
                            attributeModifiers: [],
                            lifecycleSequences: {
                              start: sequence(
                                branch(
                                  {
                                    kind: 'actionValueCompare',
                                    left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                                    operator: 'equal',
                                    right: { kind: 'constant', value: 0 },
                                  },
                                  sequence(
                                    step('applyBuff', {
                                      buffId: 'buff_physical_handle_cryst_break',
                                      target: 'buffOwner',
                                      inheritSourceSkillCastInfo: true,
                                    }),
                                  ),
                                ),
                              ),
                              finish: sequence(
                                step('applyBuff', {
                                  buffId: 'buff_physical_no_guard_fake',
                                  target: 'buffOwner',
                                  source: 'eventSource',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                              afterEnhance: sequence(
                                step('igniteBuffs', {
                                  target: 'buffOwner',
                                  source: 'buffOwner',
                                  igniteType: 'NoGuard',
                                }),
                                branch(
                                  {
                                    kind: 'currentBuffStackCompare',
                                    operator: 'greaterOrEqual',
                                    value: { kind: 'constant', value: 2 },
                                  },
                                  sequence(
                                    branch(
                                      {
                                        kind: 'actionValueCompare',
                                        left: {
                                          kind: 'blackboard',
                                          key: 'skip_handle_cryst_break',
                                        },
                                        operator: 'equal',
                                        right: { kind: 'constant', value: 0 },
                                      },
                                      sequence(
                                        step('applyBuff', {
                                          buffId: 'buff_physical_handle_cryst_break',
                                          target: 'buffOwner',
                                          inheritSourceSkillCastInfo: true,
                                        }),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            },
                          },
                          fractureBuffId: 'buff_physical_fracture',
                          fractureDefinition: {
                            stackingType: 'unlimited',
                            priority: 0,
                            maxStackCount: 1,
                            durationSeconds: 3,
                            triggerIntervalSeconds: 0,
                            waitFirstTriggerInterval: false,
                            maxTriggerCount: 0,
                            applyTags: [],
                            extendTags: [],
                            blackboard: { count: 0, duration: 15 },
                            attributeModifiers: [],
                            lifecycleSequences: {
                              start: sequence(
                                step('readBuffStackCount', {
                                  target: 'buffOwner',
                                  outputKey: 'count',
                                  query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
                                }),
                                step('readSkillSettingData', {
                                  items: [
                                    {
                                      values: [12, 18, 24, 30],
                                      column: { kind: 'blackboard', key: 'count' },
                                      storeKey: 'duration',
                                    },
                                  ],
                                }),
                                step('applyBuff', {
                                  buffId: 'buff_physical_do_fracture',
                                  target: 'buffOwner',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    duration: { kind: 'blackboard', key: 'duration' },
                                  },
                                }),
                              ),
                            },
                          },
                        }),
                      ),
                    },
                    {
                      value: { kind: 'constant', value: 0 },
                      sequence: sequence(
                        step('applyPhysicalInfliction', {
                          type: 'airborne',
                          target: 'enemy',
                          isExtra: false,
                          noGuardBuffId: 'buff_physical_no_guard',
                          noGuardDefinition: {
                            stackingType: 'enhanceAndRefresh',
                            priority: 100,
                            maxStackCount: 4,
                            durationSeconds: { blackboardKey: 'duration' },
                            presentation: {
                              visible: true,
                              iconId: 'icon_shadow_attribute_penetrate',
                              iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                              showInHeadBarCommon: false,
                              showInHeadBarAttached: true,
                              showInSquadIcon: false,
                              onlyShowForMainCharacter: false,
                              iconStyleInSquad: 'Default',
                              abnormalColorType: 'Physical',
                              orderPriority: {
                                useDirectoryValue: false,
                                value: 0,
                                category: 'CommonCharBuff',
                              },
                            },
                            applyTags: ['Skill/Character/Common/NoGuard'],
                            extendTags: [],
                            blackboard: {
                              atk_scale: 0,
                              count: 0,
                              duration: 20,
                              skip_handle_cryst_break: 0,
                            },
                            attributeModifiers: [],
                            lifecycleSequences: {
                              start: sequence(
                                branch(
                                  {
                                    kind: 'actionValueCompare',
                                    left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                                    operator: 'equal',
                                    right: { kind: 'constant', value: 0 },
                                  },
                                  sequence(
                                    step('applyBuff', {
                                      buffId: 'buff_physical_handle_cryst_break',
                                      target: 'buffOwner',
                                      inheritSourceSkillCastInfo: true,
                                    }),
                                  ),
                                ),
                              ),
                              finish: sequence(
                                step('applyBuff', {
                                  buffId: 'buff_physical_no_guard_fake',
                                  target: 'buffOwner',
                                  source: 'eventSource',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                              afterEnhance: sequence(
                                step('igniteBuffs', {
                                  target: 'buffOwner',
                                  source: 'buffOwner',
                                  igniteType: 'NoGuard',
                                }),
                                branch(
                                  {
                                    kind: 'currentBuffStackCompare',
                                    operator: 'greaterOrEqual',
                                    value: { kind: 'constant', value: 2 },
                                  },
                                  sequence(
                                    branch(
                                      {
                                        kind: 'actionValueCompare',
                                        left: {
                                          kind: 'blackboard',
                                          key: 'skip_handle_cryst_break',
                                        },
                                        operator: 'equal',
                                        right: { kind: 'constant', value: 0 },
                                      },
                                      sequence(
                                        step('applyBuff', {
                                          buffId: 'buff_physical_handle_cryst_break',
                                          target: 'buffOwner',
                                          inheritSourceSkillCastInfo: true,
                                        }),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            },
                          },
                          airborneBuffId: 'buff_physical_airborne',
                          airborneDefinition: {
                            stackingType: 'stack',
                            stackingKey: 'physical',
                            priority: 0,
                            maxStackCount: 1,
                            durationSeconds: { blackboardKey: 'duration' },
                            triggerIntervalSeconds: 0.1,
                            waitFirstTriggerInterval: true,
                            maxTriggerCount: 1,
                            presentation: {
                              visible: true,
                              iconId: 'airborne',
                              iconPath: '/icons/airborne.webp',
                              showInHeadBarCommon: false,
                              showInHeadBarAttached: false,
                              showInSquadIcon: false,
                              onlyShowForMainCharacter: false,
                              iconStyleInSquad: 'Default',
                              abnormalColorType: 'Physical',
                              orderPriority: {
                                useDirectoryValue: false,
                                value: 0,
                                category: 'CommonCharBuff',
                              },
                            },
                            applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
                            extendTags: [],
                            blackboard: { atk_scale: 0, duration: 3, poise: 10 },
                            attributeModifiers: [],
                            lifecycleSequences: {
                              start: sequence(
                                step('applyBuff', {
                                  buffId: 'buff_physical_no_guard',
                                  target: 'buffOwner',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                  },
                                }),
                                step('readSkillSettingData', {
                                  items: [
                                    {
                                      values: [1.2, 1.2, 1.2, 1.2],
                                      column: { kind: 'constant', value: 1 },
                                      storeKey: 'atk_scale',
                                      enhance: {
                                        target: 'caster',
                                        formula: { kind: 'linear', paramA: 0.01 },
                                      },
                                    },
                                    {
                                      values: [10, 10, 10, 10],
                                      column: { kind: 'constant', value: 1 },
                                      storeKey: 'poise',
                                      enhance: {
                                        target: 'caster',
                                        formula: { kind: 'linear', paramA: 0.005 },
                                      },
                                    },
                                  ],
                                }),
                                step('dealDamage', {
                                  damageType: 'physical',
                                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                  tags: [],
                                  features: ['physicalInfliction'],
                                  stagger: { kind: 'blackboard', key: 'poise' },
                                }),
                                step('applyBuff', {
                                  buffId: 'buff_physical_handle_cryst_break',
                                  target: 'buffOwner',
                                  inheritSourceSkillCastInfo: true,
                                }),
                                step('igniteBuffs', {
                                  target: 'buffOwner',
                                  source: 'caster',
                                  igniteType: 'PhysicalStatus',
                                }),
                              ),
                            },
                          },
                          duration: { kind: 'constant', value: 1.5 },
                          height: { kind: 'constant', value: 2 },
                          speedFactorMultiplier: 3,
                          force: false,
                          targetFilter: 'aliveOnly',
                          returnWhen: 'always',
                        }),
                      ),
                    },
                    {
                      value: { kind: 'constant', value: 1 },
                      sequence: sequence(
                        step('applyKnockDown', {
                          target: 'enemy',
                          duration: { kind: 'constant', value: 2 },
                          force: false,
                          isExtra: false,
                          targetFilter: 'aliveOnly',
                          returnWhen: 'always',
                        }),
                      ),
                    },
                    {
                      value: { kind: 'constant', value: 3 },
                      sequence: sequence(
                        step('applyPhysicalInfliction', {
                          type: 'crush',
                          target: 'enemy',
                          isExtra: false,
                          noGuardBuffId: 'buff_physical_no_guard',
                          noGuardDefinition: {
                            stackingType: 'enhanceAndRefresh',
                            priority: 100,
                            maxStackCount: 4,
                            durationSeconds: { blackboardKey: 'duration' },
                            presentation: {
                              visible: true,
                              iconId: 'icon_shadow_attribute_penetrate',
                              iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
                              showInHeadBarCommon: false,
                              showInHeadBarAttached: true,
                              showInSquadIcon: false,
                              onlyShowForMainCharacter: false,
                              iconStyleInSquad: 'Default',
                              abnormalColorType: 'Physical',
                              orderPriority: {
                                useDirectoryValue: false,
                                value: 0,
                                category: 'CommonCharBuff',
                              },
                            },
                            applyTags: ['Skill/Character/Common/NoGuard'],
                            extendTags: [],
                            blackboard: {
                              atk_scale: 0,
                              count: 0,
                              duration: 20,
                              skip_handle_cryst_break: 0,
                            },
                            attributeModifiers: [],
                            lifecycleSequences: {
                              start: sequence(
                                branch(
                                  {
                                    kind: 'actionValueCompare',
                                    left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                                    operator: 'equal',
                                    right: { kind: 'constant', value: 0 },
                                  },
                                  sequence(
                                    step('applyBuff', {
                                      buffId: 'buff_physical_handle_cryst_break',
                                      target: 'buffOwner',
                                      inheritSourceSkillCastInfo: true,
                                    }),
                                  ),
                                ),
                              ),
                              finish: sequence(
                                step('applyBuff', {
                                  buffId: 'buff_physical_no_guard_fake',
                                  target: 'buffOwner',
                                  source: 'eventSource',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                              afterEnhance: sequence(
                                step('igniteBuffs', {
                                  target: 'buffOwner',
                                  source: 'buffOwner',
                                  igniteType: 'NoGuard',
                                }),
                                branch(
                                  {
                                    kind: 'currentBuffStackCompare',
                                    operator: 'greaterOrEqual',
                                    value: { kind: 'constant', value: 2 },
                                  },
                                  sequence(
                                    branch(
                                      {
                                        kind: 'actionValueCompare',
                                        left: {
                                          kind: 'blackboard',
                                          key: 'skip_handle_cryst_break',
                                        },
                                        operator: 'equal',
                                        right: { kind: 'constant', value: 0 },
                                      },
                                      sequence(
                                        step('applyBuff', {
                                          buffId: 'buff_physical_handle_cryst_break',
                                          target: 'buffOwner',
                                          inheritSourceSkillCastInfo: true,
                                        }),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            },
                          },
                          crushedBuffId: 'buff_physical_crushed',
                          crushedDefinition: {
                            stackingType: 'stack',
                            stackingKey: 'physical',
                            priority: 0,
                            maxStackCount: 1,
                            durationSeconds: { blackboardKey: 'duration' },
                            triggerIntervalSeconds: 0,
                            waitFirstTriggerInterval: true,
                            maxTriggerCount: 1,
                            presentation: {
                              visible: true,
                              iconId: 'knockback',
                              iconPath: '/icons/knockback.webp',
                              showInHeadBarCommon: false,
                              showInHeadBarAttached: false,
                              showInSquadIcon: false,
                              onlyShowForMainCharacter: false,
                              iconStyleInSquad: 'Default',
                              abnormalColorType: 'Physical',
                              orderPriority: {
                                useDirectoryValue: false,
                                value: 0,
                                category: 'CommonCharBuff',
                              },
                            },
                            applyTags: ['Skill/Character/Common/PhysicalStatus/CrushStatus'],
                            extendTags: [],
                            blackboard: {
                              atk_scale: 1,
                              count: 0,
                              dmg_multiplier: 1,
                              duration: 3,
                              ignore_hit_effect: 0,
                            },
                            attributeModifiers: [],
                            lifecycleSequences: {
                              start: sequence(
                                step('readBuffStackCount', {
                                  target: 'buffOwner',
                                  outputKey: 'count',
                                  query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
                                }),
                                step('readSkillSettingData', {
                                  items: [
                                    {
                                      values: [3, 4.5, 6, 7.5],
                                      column: { kind: 'blackboard', key: 'count' },
                                      storeKey: 'atk_scale',
                                      enhance: {
                                        target: 'caster',
                                        formula: { kind: 'linear', paramA: 0.01 },
                                      },
                                    },
                                  ],
                                }),
                                step('modifyActionValue', {
                                  key: 'atk_scale',
                                  operation: 'multiply',
                                  value: { kind: 'blackboard', key: 'dmg_multiplier' },
                                }),
                                step('finishBuffsById', {
                                  target: 'buffOwner',
                                  buffIds: ['buff_physical_no_guard'],
                                  reason: 'early',
                                }),
                                step('dealDamage', {
                                  damageType: 'physical',
                                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                  tags: [],
                                  features: ['physicalInfliction'],
                                }),
                                step('applyBuff', {
                                  buffId: 'buff_physical_handle_cryst_break',
                                  target: 'buffOwner',
                                  inheritSourceSkillCastInfo: true,
                                }),
                                step('igniteBuffs', {
                                  target: 'buffOwner',
                                  source: 'caster',
                                  igniteType: 'PhysicalStatus',
                                }),
                                branch(
                                  {
                                    kind: 'actionValueCompare',
                                    left: { kind: 'blackboard', key: 'ignore_hit_effect' },
                                    operator: 'less',
                                    right: { kind: 'constant', value: 0.5 },
                                  },
                                  sequence({
                                    kind: 'switch',
                                    parameters: {
                                      choice: { kind: 'blackboard', key: 'count' },
                                      alwaysNext: true,
                                    },
                                    options: [
                                      {
                                        value: { kind: 'constant', value: 0 },
                                        sequence: sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.1 },
                                            slot: 'TimeDilation/Layer/Entity/HitStop',
                                            priority: 15,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['enemy', 'caster'],
                                          }),
                                        ),
                                      },
                                      {
                                        value: { kind: 'constant', value: 1 },
                                        sequence: sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.1 },
                                            slot: 'TimeDilation/Layer/Entity/HitStop',
                                            priority: 10,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['enemy', 'caster'],
                                          }),
                                        ),
                                      },
                                      {
                                        value: { kind: 'constant', value: 2 },
                                        sequence: sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.25 },
                                            slot: 'TimeDilation/Layer/Entity/HitStop',
                                            priority: 20,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['enemy', 'caster'],
                                          }),
                                        ),
                                      },
                                      {
                                        value: { kind: 'constant', value: 3 },
                                        sequence: sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.5 },
                                            slot: 'TimeDilation/Layer/Entity/HitStop',
                                            priority: 20,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['enemy', 'caster'],
                                          }),
                                        ),
                                      },
                                      {
                                        value: { kind: 'constant', value: 4 },
                                        sequence: sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.65 },
                                            slot: 'TimeDilation/Layer/Entity/HitStop',
                                            priority: 20,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['enemy', 'caster'],
                                          }),
                                        ),
                                      },
                                    ],
                                  }),
                                ),
                              ),
                            },
                          },
                          damageMultiplier: { kind: 'constant', value: 1 },
                          ignoreHitEffect: false,
                        }),
                      ),
                    },
                  ],
                }),
              },
              {
                value: { kind: 'constant', value: 0 },
                sequence: sequence({
                  kind: 'switch',
                  parameters: {
                    choice: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                    alwaysNext: true,
                  },
                  options: [
                    {
                      value: { kind: 'constant', value: 0 },
                      sequence: sequence(
                        step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                      ),
                    },
                    {
                      value: { kind: 'constant', value: 2 },
                      sequence: sequence(
                        step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                      ),
                    },
                    {
                      value: { kind: 'constant', value: 1 },
                      sequence: sequence(
                        step('applyElementalInfliction', { element: 'electric', isExtra: false }),
                      ),
                    },
                    {
                      value: { kind: 'constant', value: 3 },
                      sequence: sequence(
                        step('applyElementalInfliction', { element: 'nature', isExtra: false }),
                      ),
                    },
                  ],
                }),
              },
              { value: { kind: 'constant', value: 2 }, sequence: sequence() },
            ],
          },
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0023_antal_combo_skill:/scheduledSequences/0/sequence/steps/1',
          ),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
          }),
        ),
        24,
      ),
      scheduled(
        23,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.2 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.2 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        26,
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
    ],
    smartTarget: 'trigger',
    cooldownFrames: [750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 720],
  },
  {
    atb: 0,
    atk_scale: [1.51, 1.66, 1.81, 1.96, 2.11, 2.27, 2.42, 2.57, 2.72, 2.91, 3.13, 3.4],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    duration: 5,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    select_radius: 4,
    usp: 10,
  },
);

export const antalUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0023_antal_ultimate_skill',
    timelineBlockFrames: 56,
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
        42,
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
        60,
      ),
      scheduled(
        49,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0023_antal_utimate_skill',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
          }),
        ),
        51,
      ),
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
  },
  {
    atk_scale: 1.5,
    atk_up: 0,
    cd: 0,
    duration: 12,
    heal_value: 0,
    healvalue: 500,
    multiplier: 3,
    radius: 1,
    rate: [0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.2],
    talent_1: 0,
  },
);

export const commonBuffDefinitions = {
  buff_common_affixes_enhance_fire: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ['Skill/Character/Common/Affixes/Enhance/EnhanceSpell/EnhanceFire'],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_enhance_fire_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'heatEnhancedDamageIncrease',
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
  buff_common_affixes_enhance_pulse: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ['Skill/Character/Common/Affixes/Enhance/EnhanceSpell/EnhancePulse'],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_enhance_pulse_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'electricEnhancedDamageIncrease',
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
  buff_common_affixes_vulnerable_fire: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Skill/Character/Common/Affixes/Vulnerable',
      'Skill/Character/Common/Affixes/Vulnerable/VulnerableSpell',
      'Skill/Character/Common/Affixes/Vulnerable/VulnerableFire',
    ],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_vulnerable_fire_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'heatVulnerabilityIncrease',
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
  buff_common_cryst_triggered_physical_break: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 5,
    applyTags: ['Skill/Character/Common/SpellStatusSpecial/Shatter'],
    extendTags: [],
    blackboard: { atk_scale: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('dealDamage', {
          damageType: 'physical',
          attackScale: { kind: 'blackboard', key: 'atk_scale' },
          tags: ['cryoAbnormal'],
          features: ['shatter'],
        }),
      ),
    },
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
  buff_physical_airborne: {
    stackingType: 'stack',
    stackingKey: 'physical',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0.1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    presentation: {
      visible: true,
      iconId: 'airborne',
      iconPath: '/icons/airborne.webp',
      showInHeadBarCommon: false,
      showInHeadBarAttached: false,
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
    },
    applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
    extendTags: [],
    blackboard: { atk_scale: 0, duration: 3, poise: 10 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('applyBuff', {
          buffId: 'buff_physical_no_guard',
          target: 'buffOwner',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: { skip_handle_cryst_break: { kind: 'constant', value: 1 } },
        }),
        step('readSkillSettingData', {
          items: [
            {
              values: [1.2, 1.2, 1.2, 1.2],
              column: { kind: 'constant', value: 1 },
              storeKey: 'atk_scale',
              enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
            },
            {
              values: [10, 10, 10, 10],
              column: { kind: 'constant', value: 1 },
              storeKey: 'poise',
              enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.005 } },
            },
          ],
        }),
        step('dealDamage', {
          damageType: 'physical',
          attackScale: { kind: 'blackboard', key: 'atk_scale' },
          tags: [],
          features: ['physicalInfliction'],
          stagger: { kind: 'blackboard', key: 'poise' },
        }),
        step('applyBuff', {
          buffId: 'buff_physical_handle_cryst_break',
          target: 'buffOwner',
          inheritSourceSkillCastInfo: true,
        }),
        step('igniteBuffs', {
          target: 'buffOwner',
          source: 'caster',
          igniteType: 'PhysicalStatus',
        }),
      ),
    },
  },
  buff_physical_crushed: {
    stackingType: 'stack',
    stackingKey: 'physical',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    presentation: {
      visible: true,
      iconId: 'knockback',
      iconPath: '/icons/knockback.webp',
      showInHeadBarCommon: false,
      showInHeadBarAttached: false,
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
    },
    applyTags: ['Skill/Character/Common/PhysicalStatus/CrushStatus'],
    extendTags: [],
    blackboard: { atk_scale: 1, count: 0, dmg_multiplier: 1, duration: 3, ignore_hit_effect: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('readBuffStackCount', {
          target: 'buffOwner',
          outputKey: 'count',
          query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
        }),
        step('readSkillSettingData', {
          items: [
            {
              values: [3, 4.5, 6, 7.5],
              column: { kind: 'blackboard', key: 'count' },
              storeKey: 'atk_scale',
              enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
            },
          ],
        }),
        step('modifyActionValue', {
          key: 'atk_scale',
          operation: 'multiply',
          value: { kind: 'blackboard', key: 'dmg_multiplier' },
        }),
        step('finishBuffsById', {
          target: 'buffOwner',
          buffIds: ['buff_physical_no_guard'],
          reason: 'early',
        }),
        step('dealDamage', {
          damageType: 'physical',
          attackScale: { kind: 'blackboard', key: 'atk_scale' },
          tags: [],
          features: ['physicalInfliction'],
        }),
        step('applyBuff', {
          buffId: 'buff_physical_handle_cryst_break',
          target: 'buffOwner',
          inheritSourceSkillCastInfo: true,
        }),
        step('igniteBuffs', {
          target: 'buffOwner',
          source: 'caster',
          igniteType: 'PhysicalStatus',
        }),
        branch(
          {
            kind: 'actionValueCompare',
            left: { kind: 'blackboard', key: 'ignore_hit_effect' },
            operator: 'less',
            right: { kind: 'constant', value: 0.5 },
          },
          sequence({
            kind: 'switch',
            parameters: { choice: { kind: 'blackboard', key: 'count' }, alwaysNext: true },
            options: [
              {
                value: { kind: 'constant', value: 0 },
                sequence: sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.1 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 15,
                    curve: { kind: 'named', key: 'interrupt_weakness' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              },
              {
                value: { kind: 'constant', value: 1 },
                sequence: sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.1 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'interrupt_weakness' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              },
              {
                value: { kind: 'constant', value: 2 },
                sequence: sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.25 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 20,
                    curve: { kind: 'named', key: 'interrupt_weakness' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              },
              {
                value: { kind: 'constant', value: 3 },
                sequence: sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.5 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 20,
                    curve: { kind: 'named', key: 'interrupt_weakness' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              },
              {
                value: { kind: 'constant', value: 4 },
                sequence: sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.65 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 20,
                    curve: { kind: 'named', key: 'interrupt_weakness' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              },
            ],
          }),
        ),
      ),
    },
  },
  buff_physical_do_fracture: {
    stackingType: 'stack',
    stackingKey: 'fracture',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: false,
    maxTriggerCount: 0,
    presentation: {
      visible: true,
      iconId: 'icon_battle_fracture',
      iconPath: '/icons/icon_battle_fracture.webp',
      showInHeadBarCommon: true,
      showInHeadBarAttached: false,
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'SpellAbnormal',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'AttachedAndAbnormal' },
    },
    applyTags: ['Skill/Character/Common/PhysicalStatus/FractureStatus'],
    extendTags: [],
    blackboard: { atk_scale: 0, count: 0, duration: 15, extra_scaling: 1, physical_res_down: 0 },
    attributeModifiers: [],
    damageModifiers: [
      {
        enabledSide: 'defender',
        condition: { kind: 'eventDamageTypesMatch', damageTypes: ['physical'] },
        processors: [
          {
            kind: 'damageScale',
            side: 'defender',
            zone: 'normal',
            addition: { blackboardKey: 'physical_res_down' },
          },
        ],
      },
    ],
    lifecycleSequences: {
      start: sequence(
        step('readBuffStackCount', {
          target: 'buffOwner',
          outputKey: 'count',
          query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
        }),
        step('readSkillSettingData', {
          items: [
            {
              values: [0.12, 0.16, 0.2, 0.24],
              column: { kind: 'blackboard', key: 'count' },
              storeKey: 'physical_res_down',
              enhance: {
                target: 'caster',
                formula: { kind: 'saturating', paramA: 2, paramB: 300 },
              },
            },
            {
              values: [1, 1.5, 2, 2.5],
              column: { kind: 'blackboard', key: 'count' },
              storeKey: 'atk_scale',
              enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
            },
          ],
        }),
        step('modifyActionValue', {
          key: 'physical_res_down',
          operation: 'multiply',
          value: { kind: 'blackboard', key: 'extra_scaling' },
        }),
        step('refreshCurrentBuffAttributeModifiers', {}),
        step('applyBuff', {
          buffId: 'buff_physical_handle_cryst_break',
          target: 'buffOwner',
          inheritSourceSkillCastInfo: true,
        }),
        step('igniteBuffs', {
          target: 'buffOwner',
          source: 'caster',
          igniteType: 'PhysicalStatus',
        }),
        step('finishBuffsById', {
          target: 'buffOwner',
          buffIds: ['buff_physical_no_guard'],
          reason: 'early',
        }),
        step('dealDamage', {
          damageType: 'physical',
          attackScale: { kind: 'blackboard', key: 'atk_scale' },
          tags: [],
          features: ['physicalInfliction'],
        }),
        {
          kind: 'switch',
          parameters: { choice: { kind: 'blackboard', key: 'count' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.1 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 15,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.1 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 10,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.25 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 20,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.5 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 20,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 4 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.65 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 20,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
          ],
        },
      ),
    },
  },
  buff_physical_fracture: {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 3,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: false,
    maxTriggerCount: 0,
    applyTags: [],
    extendTags: [],
    blackboard: { count: 0, duration: 15 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('readBuffStackCount', {
          target: 'buffOwner',
          outputKey: 'count',
          query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
        }),
        step('readSkillSettingData', {
          items: [
            {
              values: [12, 18, 24, 30],
              column: { kind: 'blackboard', key: 'count' },
              storeKey: 'duration',
            },
          ],
        }),
        step('applyBuff', {
          buffId: 'buff_physical_do_fracture',
          target: 'buffOwner',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: { duration: { kind: 'blackboard', key: 'duration' } },
        }),
      ),
    },
  },
  buff_physical_handle_cryst_break: {
    stackingType: 'stack',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 10,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    applyTags: [],
    extendTags: [],
    blackboard: { atk_scale: 0, count: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('readBuffBlackboard', {
          target: 'buffOwner',
          query: {
            kind: 'tag',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
          },
          desiredKey: 'count',
          outputKey: 'count',
        }),
        step('readSkillSettingData', {
          items: [
            {
              values: [2.4, 3.6, 4.8, 6],
              column: { kind: 'blackboard', key: 'count' },
              storeKey: 'atk_scale',
              enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
            },
          ],
        }),
        step('finishBuffsByTag', {
          target: 'buffOwner',
          tagQueryType: 'hasAny',
          buffTags: ['Skill/Character/Common/SpellStatus/Frozen'],
          reason: 'early',
        }),
        step('applyBuff', {
          buffId: 'buff_common_cryst_triggered_physical_break',
          target: 'buffOwner',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: { atk_scale: { kind: 'blackboard', key: 'atk_scale' } },
        }),
        {
          kind: 'switch',
          parameters: { choice: { kind: 'blackboard', key: 'count' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 0 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.1 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 15,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 1 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.1 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 10,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.25 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 20,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.5 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 20,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 4 },
              sequence: sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.65 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 20,
                  curve: { kind: 'named', key: 'interrupt_weakness' },
                  finishByAction: false,
                  targets: ['enemy', 'caster'],
                }),
              ),
            },
          ],
        },
      ),
    },
  },
  buff_physical_knockdown: {
    stackingType: 'stack',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    applyTags: ['Skill/Character/Common/PhysicalStatus/KnockdownStatus'],
    extendTags: [],
    blackboard: { atk_scale: 0, duration: 3, poise: 10 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        step('applyBuff', {
          buffId: 'buff_physical_no_guard',
          target: 'buffOwner',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: { skip_handle_cryst_break: { kind: 'constant', value: 1 } },
        }),
        step('readSkillSettingData', {
          items: [
            {
              values: [1.2, 1.2, 1.2, 1.2],
              column: { kind: 'constant', value: 1 },
              storeKey: 'atk_scale',
              enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.01 } },
            },
            {
              values: [10, 10, 10, 10],
              column: { kind: 'constant', value: 1 },
              storeKey: 'poise',
              enhance: { target: 'caster', formula: { kind: 'linear', paramA: 0.005 } },
            },
          ],
        }),
        step('dealDamage', {
          damageType: 'physical',
          attackScale: { kind: 'blackboard', key: 'atk_scale' },
          tags: [],
          features: ['knockDown', 'physicalInfliction'],
          stagger: { kind: 'blackboard', key: 'poise' },
        }),
        step('applyBuff', {
          buffId: 'buff_physical_handle_cryst_break',
          target: 'buffOwner',
          inheritSourceSkillCastInfo: true,
        }),
        step('igniteBuffs', {
          target: 'buffOwner',
          source: 'caster',
          igniteType: 'PhysicalStatus',
        }),
      ),
    },
  },
  buff_physical_no_guard: {
    stackingType: 'enhanceAndRefresh',
    priority: 100,
    maxStackCount: 4,
    durationSeconds: { blackboardKey: 'duration' },
    presentation: {
      visible: true,
      iconId: 'icon_shadow_attribute_penetrate',
      iconPath: '/icons/icon_shadow_attribute_penetrate.webp',
      showInHeadBarCommon: false,
      showInHeadBarAttached: true,
      showInSquadIcon: false,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
    },
    applyTags: ['Skill/Character/Common/NoGuard'],
    extendTags: [],
    blackboard: { atk_scale: 0, count: 0, duration: 20, skip_handle_cryst_break: 0 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        branch(
          {
            kind: 'actionValueCompare',
            left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
            operator: 'equal',
            right: { kind: 'constant', value: 0 },
          },
          sequence(
            step('applyBuff', {
              buffId: 'buff_physical_handle_cryst_break',
              target: 'buffOwner',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
      ),
      finish: sequence(
        step('applyBuff', {
          buffId: 'buff_physical_no_guard_fake',
          target: 'buffOwner',
          source: 'eventSource',
          inheritSourceSkillCastInfo: true,
        }),
      ),
      afterEnhance: sequence(
        step('igniteBuffs', { target: 'buffOwner', source: 'buffOwner', igniteType: 'NoGuard' }),
        branch(
          {
            kind: 'currentBuffStackCompare',
            operator: 'greaterOrEqual',
            value: { kind: 'constant', value: 2 },
          },
          sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                operator: 'equal',
                right: { kind: 'constant', value: 0 },
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_physical_handle_cryst_break',
                  target: 'buffOwner',
                  inheritSourceSkillCastInfo: true,
                }),
              ),
            ),
          ),
        ),
      ),
    },
  },
  buff_physical_no_guard_fake: {
    stackingType: 'refresh',
    priority: 100,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: ['Skill/Character/Common/NoGuardFake'],
    extendTags: [],
    blackboard: { duration: 1 },
    attributeModifiers: [],
  },
} as const satisfies OperatorBuffDefinitions;

export default {
  slug: 'antal',
  gameId: 'ANTAL',
  rarity: 4,
  weaponType: 'arts-unit',
  element: 'electric',
  role: 'supporter',
  mainAttribute: 'intellect',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [15, 40, 65, 91, 116, 129],
    agility: [9, 25, 43, 60, 78, 86],
    intellect: [15, 47, 81, 114, 148, 165],
    will: [9, 25, 41, 58, 74, 82],
    baseAttack: [30, 87, 147, 207, 267, 297],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [antalBasicAttack1, antalBasicAttack2, antalBasicAttack3, antalBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: antalFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: antalPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: antalBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: antalComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: antalUltimate },
  ],
  comboSkillRegistrations: [
    {
      skillKey: 'comboSkill',
      priority: 'default',
      invalidCastBlackboard: { EntityBB_combo_type: 2, EntityBB_combo_index: -1 },
      rules: [
        {
          trigger: { kind: 'elementalInflictionApplied', elements: 'heat', scope: 'team' },
          condition: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0023_antal_tageffect'],
            operator: 'greater',
            value: 0,
          },
          blackboard: { EntityBB_combo_type: 0, EntityBB_combo_index: 0 },
        },
        {
          trigger: { kind: 'elementalInflictionApplied', elements: 'electric', scope: 'team' },
          condition: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0023_antal_tageffect'],
            operator: 'greater',
            value: 0,
          },
          blackboard: { EntityBB_combo_type: 0, EntityBB_combo_index: 1 },
        },
        {
          trigger: { kind: 'elementalInflictionApplied', elements: 'cryo', scope: 'team' },
          condition: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0023_antal_tageffect'],
            operator: 'greater',
            value: 0,
          },
          blackboard: { EntityBB_combo_type: 0, EntityBB_combo_index: 2 },
        },
        {
          trigger: { kind: 'elementalInflictionApplied', elements: 'nature', scope: 'team' },
          condition: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0023_antal_tageffect'],
            operator: 'greater',
            value: 0,
          },
          blackboard: { EntityBB_combo_type: 0, EntityBB_combo_index: 3 },
        },
        {
          trigger: { kind: 'physicalInflictionApplied', types: 'airborne', scope: 'team' },
          condition: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0023_antal_tageffect'],
            operator: 'greater',
            value: 0,
          },
          blackboard: { EntityBB_combo_type: 1, EntityBB_combo_index: 0 },
        },
        {
          trigger: { kind: 'physicalInflictionApplied', types: 'knockDown', scope: 'team' },
          condition: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0023_antal_tageffect'],
            operator: 'greater',
            value: 0,
          },
          blackboard: { EntityBB_combo_type: 1, EntityBB_combo_index: 1 },
        },
        {
          trigger: { kind: 'physicalInflictionApplied', types: 'fracture', scope: 'team' },
          condition: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0023_antal_tageffect'],
            operator: 'greater',
            value: 0,
          },
          blackboard: { EntityBB_combo_type: 1, EntityBB_combo_index: 2 },
        },
        {
          trigger: { kind: 'physicalInflictionApplied', types: 'crush', scope: 'team' },
          condition: {
            kind: 'buffIdStackCompare',
            target: 'enemy',
            buffIds: ['buff_chr_0023_antal_tageffect'],
            operator: 'greater',
            value: 0,
          },
          blackboard: { EntityBB_combo_type: 1, EntityBB_combo_index: 3 },
        },
      ],
    },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0023_antal_talent_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            healvalue: [72, 108],
            cd: { kind: 'constant', value: 30 },
            multiplier: [0.6, 0.9],
          },
        }),
      ),
    },
    {
      key: 'talent2',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0023_antal_talent_2',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            healvalue: [27, 45],
            probability: { kind: 'constant', value: 0.3 },
            heal_scale: [0.23, 0.38],
          },
        }),
      ),
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'rate',
          operation: 'multiply',
          value: 1.1,
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_3_atb',
          operation: 'add',
          value: 15,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 10 },
        { kind: 'modifyBasePanelStat', stat: 'health', operation: 'percent', value: 0.1 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'delay_time',
          operation: 'add',
          value: 20,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5_rate',
          operation: 'add',
          value: 0.04,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0023_antal_normal_icon: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
    buff_chr_0023_antal_normal_icon_2: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
    buff_chr_0023_antal_normal_skill: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 2,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        delay_time: 0,
        duration: 60,
        potential_3: 0,
        potential_3_atb: 0,
        potential_5: 0,
        potential_5_rate: 0,
        rate: 0.2,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0023_antal_tageffect',
            target: 'enemy',
            source: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              rate: { kind: 'blackboard', key: 'rate' },
              duration: { kind: 'blackboard', key: 'duration' },
              potential_3: { kind: 'blackboard', key: 'potential_3' },
              potential_3_atb: { kind: 'blackboard', key: 'potential_3_atb' },
              potential_5_rate: { kind: 'blackboard', key: 'potential_5_rate' },
              potential_5: { kind: 'blackboard', key: 'potential_5' },
              delay_time: { kind: 'blackboard', key: 'delay_time' },
            },
          }),
        ),
      },
    },
    buff_chr_0023_antal_tageffect: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'delay_time' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      presentation: {
        visible: true,
        iconId: 'icon_battle_antal_buff',
        iconPath: '/icons/icon_battle_antal_buff.webp',
        showInHeadBarCommon: true,
        showInHeadBarAttached: false,
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: {
        delay_time: 0,
        duration: 0,
        potential_3: 0,
        potential_3_atb: 0,
        potential_5: 0,
        potential_5_rate: 0,
        rate: 0,
        rate_add: 0.05,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_pulse',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            keywordEnhancements: [
              {
                triggerBuffIds: ['buff_chr_0023_antal_talent_1_combotrigger'],
                operation: 'add',
                value: { kind: 'blackboard', key: 'potential_5_rate' },
              },
            ],
            stringBlackboardAssignments: { child_buff_id: 'buff_chr_0023_antal_normal_icon_2' },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_fire',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            keywordEnhancements: [
              {
                triggerBuffIds: ['buff_chr_0023_antal_talent_1_combotrigger'],
                operation: 'add',
                value: { kind: 'blackboard', key: 'potential_5_rate' },
              },
            ],
            stringBlackboardAssignments: { child_buff_id: 'buff_chr_0023_antal_normal_icon' },
          }),
        ),
        trigger: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0023_antal_talent_1_combotrigger',
                target: 'buffOwner',
                source: 'eventSource',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0023_antal_talent_1_combotrigger'],
            reason: 'other',
          }),
        ),
      },
    },
    buff_chr_0023_antal_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { cd: 30, healvalue: 300, multiplier: 3 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0023_antal_talent_1_heal_trigger',
            target: 'party',
            finishByAction: true,
            blackboardAssignments: {
              healvalue: { kind: 'blackboard', key: 'healvalue' },
              cd: { kind: 'blackboard', key: 'cd' },
              multiplier: { kind: 'blackboard', key: 'multiplier' },
            },
          }),
        ),
      },
    },
    buff_chr_0023_antal_talent_1_combotrigger: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0023_antal_talent_1_heal_trigger: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { cd: 0, healvalue: 0, multiplier: 0 },
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
                  target: 'caster',
                  markerId: 'buff_chr_0023_antal_talent_1_heal_trigger',
                },
              },
              sequence(
                branch(
                  {
                    kind: 'entityTagMatch',
                    target: 'buffOwner',
                    tagQueryType: 'hasAny',
                    tags: ['Skill/Character/Common/Affixes/Enhance'],
                  },
                  sequence(
                    branch(
                      {
                        kind: 'eventDamageTagsMatch',
                        match: 'hasAny',
                        tags: ['normalSkill', 'ultimateSkill', 'comboSkill'],
                      },
                      sequence(
                        step('heal', {
                          target: 'caster',
                          alwaysNext: true,
                          tags: [],
                          attribute: 'strength',
                          multiplier: { kind: 'blackboard', key: 'multiplier' },
                          addition: { kind: 'blackboard', key: 'healvalue' },
                        }),
                        step('createTimedMarker', {
                          target: 'caster',
                          markerId: 'buff_chr_0023_antal_talent_1_heal_trigger',
                          durationSeconds: { kind: 'blackboard', key: 'cd' },
                          autoFinishByAction: false,
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
    buff_chr_0023_antal_talent_2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { heal_scale: 0.1, healvalue: 300, probability: 0.3 },
      attributeModifiers: [],
    },
    buff_chr_0023_antal_ultimate_icon: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_fire_enhance',
        iconPath: '/icons/icon_battle_affix_fire_enhance.webp',
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
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
    buff_chr_0023_antal_ultimate_icon_2: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_pulse_enhance',
        iconPath: '/icons/icon_battle_affix_pulse_enhance.webp',
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
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
    buff_chr_0023_antal_utimate_skill: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 20, healvalue: 500, multiplier: 3, rate: 0.4 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_pulse',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: { child_buff_id: 'buff_chr_0023_antal_ultimate_icon_2' },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_fire',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: { child_buff_id: 'buff_chr_0023_antal_ultimate_icon' },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
