/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachContextTarget,
  forEachTarget,
  repeatByActionValue,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const ardeliaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0025_ardelia_attack1',
    timelineBlockFrames: 11,
    naturalDurationFrames: 110,
    exclusiveFrame: 15,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0025_ardelia_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 11, endFrame: 30, sourceSkillIds: ['chr_0025_ardelia_attack2'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0025_ardelia_normal_attack1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0025_ardelia_attack1_projhit',
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
                    'chr_0025_ardelia_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
    atk_scale: [
      0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978,
      0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699,
      0.620000004768372, 0.680000007152557,
    ],
  },
);

export const ardeliaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0025_ardelia_attack2',
    timelineBlockFrames: 20,
    naturalDurationFrames: 118,
    exclusiveFrame: 26,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 36,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0025_ardelia_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 20, endFrame: 36, sourceSkillIds: ['chr_0025_ardelia_attack3'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack2.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0025_ardelia_normal_attack2_1',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack2.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0025_ardelia_attack1_projhit',
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
                    'chr_0025_ardelia_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        9,
      ),
      scheduled(
        10,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack2.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:projectile_chr_0025_ardelia_normal_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack2.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0025_ardelia_attack1_projhit',
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
                    'chr_0025_ardelia_attack2:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
  {
    atb: 0,
    atk_scale: [
      0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093,
      0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115, 0.389999985694885,
      0.419999986886978, 0.449999988079071,
    ],
    atk_scale_display: [
      0.400000005960464, 0.439999997615814, 0.479999989271164, 0.519999980926514, 0.560000002384186,
      0.600000023841858, 0.639999985694885, 0.680000007152557, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.899999976158142,
    ],
  },
);

export const ardeliaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0025_ardelia_attack3',
    timelineBlockFrames: 45,
    naturalDurationFrames: 164,
    exclusiveFrame: 47,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 58,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0025_ardelia_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 45, endFrame: 58, sourceSkillIds: ['chr_0025_ardelia_attack4'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/0/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        12,
      ),
      scheduled(
        13,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[5]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[5]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/1/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        14,
      ),
      scheduled(
        15,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[6]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[6]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/2/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        16,
      ),
      scheduled(
        17,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[7]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[7]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/3/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        18,
      ),
      scheduled(
        19,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[8]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[8]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/4/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        20,
      ),
      scheduled(
        21,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[9]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[9]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/5/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        22,
      ),
      scheduled(
        23,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[10]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[10]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/6/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        24,
      ),
      scheduled(
        25,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[11]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[11]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/7/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        26,
      ),
      scheduled(
        27,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[12]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[12]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/8/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        28,
      ),
      scheduled(
        29,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[13]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[13]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/9/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        31,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[14]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[14]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/10/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        32,
      ),
      scheduled(
        33,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[15]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[15]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/11/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        34,
      ),
      scheduled(
        35,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[16]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[16]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/12/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        36,
      ),
      scheduled(
        37,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[17]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[17]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/13/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        38,
      ),
      scheduled(
        39,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'firePoint',
            count: { kind: 'constant', value: 1 },
          }),
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[18]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_attack3.actionGroupData.timelineActions[18]._sequenceActionData.actionData[2]:chr_0025_ardelia_attack3_projhit',
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
                    'chr_0025_ardelia_attack3:/scheduledSequences/14/sequence/steps/1/body/steps/0/body/steps/0',
                  ),
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'constant', value: 0.300000011920929 },
                    },
                    sequence(),
                    undefined,
                    { alwaysNext: true },
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
        40,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.0399999991059303, 0.0399999991059303, 0.0399999991059303, 0.0500000007450581,
      0.0500000007450581, 0.0500000007450581, 0.0599999986588955, 0.0599999986588955,
      0.0599999986588955, 0.0700000002980232, 0.0700000002980232, 0.0799999982118607,
    ],
    atk_scale_display: [
      0.529999971389771, 0.579999983310699, 0.629999995231628, 0.680000007152557, 0.740000009536743,
      0.790000021457672, 0.839999973773956, 0.889999985694885, 0.949999988079071, 1.00999999046326,
      1.0900000333786, 1.17999994754791,
    ],
  },
);

export const ardeliaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0025_ardelia_attack4',
    timelineBlockFrames: 50,
    naturalDurationFrames: 198,
    exclusiveFrame: 50,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 58,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0025_ardelia_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 50, endFrame: 58, sourceSkillIds: ['chr_0025_ardelia_attack1'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0025_ardelia_attack4',
                    childSkillId: 'chr_0025_ardelia_attack4_sheep',
                    inheritActionBlackboard: true,
                    inheritSourceSkillCastInfo: true,
                    dieWhenSourceDies: false,
                    target: 'enemy',
                  }),
                ),
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0025_ardelia_attack4',
                    childSkillId: 'chr_0025_ardelia_attack4_sheep',
                    inheritActionBlackboard: true,
                    inheritSourceSkillCastInfo: true,
                    dieWhenSourceDies: false,
                    target: 'enemy',
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        1,
      ),
      scheduled(
        65,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0025_ardelia_attack4_end',
            childSkillId: 'chr_0025_ardelia_attack4_end_sheep',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            target: 'caster',
          }),
        ),
        66,
      ),
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(),
            sequence(
              branch(
                { kind: 'probability', probability: { kind: 'constant', value: 0.5 } },
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0025_ardelia_attack4_low',
                    childSkillId: 'chr_0025_ardelia_attack4_sheep',
                    inheritActionBlackboard: true,
                    inheritSourceSkillCastInfo: true,
                    dieWhenSourceDies: false,
                    target: 'enemy',
                  }),
                ),
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0025_ardelia_attack4_low',
                    childSkillId: 'chr_0025_ardelia_attack4_sheep',
                    inheritActionBlackboard: true,
                    inheritSourceSkillCastInfo: true,
                    dieWhenSourceDies: false,
                    target: 'enemy',
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        1,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0025_ardelia_attack4_kill_sheep',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        198,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 18,
    atk_scale: [
      0.550000011920929, 0.610000014305115, 0.660000026226044, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.879999995231628, 0.939999997615814, 0.990000009536743, 1.05999994277954,
      1.13999998569489, 1.24000000953674,
    ],
    poise: 18,
  },
);

export const ardeliaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0025_ardelia_power_attack',
    timelineBlockFrames: 57,
    naturalDurationFrames: 215,
    exclusiveFrame: 65,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 57,
          endFrame: 65,
          sourceSkillIds: ['chr_0025_ardelia_normal_skill', 'chr_0025_ardelia_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.100000001490116,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0025_ardelia_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
        ),
        21,
      ),
      scheduled(
        21,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  calculation: 'breakingAttack',
                  calculationMultiplier: 0.0500000007450581,
                  tags: ['normalAttack', 'powerAttack'],
                },
                'chr_0025_ardelia_power_attack:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
            ),
            { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.109999999403954 } },
          ),
        ),
        53,
      ),
      scheduled(
        57,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.400000005960464,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0025_ardelia_power_attack:/scheduledSequences/2/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        60,
      ),
      scheduled(
        15,
        sequence(
          repeatEachTick(sequence(), {
            nativeChanneling: {
              executeEachFrame: false,
              triggerIntervalSeconds: 0.100000001490116,
              maxCountPerTarget: -1,
              targetTriggerIntervalSeconds: 0,
            },
          }),
        ),
        28,
      ),
      scheduled(
        28,
        sequence(
          repeatEachTick(sequence(), {
            nativeChanneling: {
              executeEachFrame: false,
              triggerIntervalSeconds: 0.100000001490116,
              maxCountPerTarget: -1,
              targetTriggerIntervalSeconds: 0,
            },
          }),
        ),
        41,
      ),
      scheduled(
        41,
        sequence(
          repeatEachTick(sequence(), {
            nativeChanneling: {
              executeEachFrame: false,
              triggerIntervalSeconds: 0.100000001490116,
              maxCountPerTarget: -1,
              targetTriggerIntervalSeconds: 0,
            },
          }),
        ),
        51,
      ),
      scheduled(
        59,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.600000023841858 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.400000005960464,
                  inTangent: -14.1076889038086,
                  outTangent: -14.1076889038086,
                  weightedMode: 0,
                  inWeight: 0.333333343267441,
                  outWeight: 0.283485949039459,
                },
                {
                  time: 0.0500000007450581,
                  value: 0.00999999977648258,
                  inTangent: 0.00631965976208448,
                  outTangent: 0.00631965976208448,
                  weightedMode: 2,
                  inWeight: 0.333333343267441,
                  outWeight: 0.777102410793304,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 8.26610946655273,
                  outTangent: 5.2331748008728,
                  weightedMode: 1,
                  inWeight: 0.0874526277184486,
                  outWeight: 0.333333343267441,
                },
              ],
            },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        62,
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
        65,
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
        57,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  {
    atk_scale: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
    atk_scale_loop: 0.1,
    atk_scale_start: 0.5,
  },
);

export const ardeliaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0025_ardelia_plunging_attack_end',
    timelineBlockFrames: 23,
    naturalDurationFrames: 156,
    exclusiveFrame: 22,
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
            'chr_0025_ardelia_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'Sheep',
            abilityEntityIds: ['abilityentity_chr_0025_ardelia_air_attack'],
          }),
        ),
        1,
      ),
      scheduled(
        5,
        sequence(forEachContextTarget('Sheep', sequence(step('finishCurrentAbilityEntity', {})))),
        8,
      ),
      scheduled(
        0,
        sequence(
          step('inheritBuffById', {
            target: 'caster',
            buffId: 'buff_chr_0025_ardelia_air_attack_interrupt_listener',
            inheritToNextSkillIds: [],
            finishByAction: true,
            finishWithNextSkillIfNotInherited: true,
          }),
        ),
        5,
      ),
    ],
    skillType: 'plungingAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
  },
);

export const ardeliaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0025_ardelia_normal_skill',
    timelineBlockFrames: 47,
    naturalDurationFrames: 378,
    exclusiveFrame: 239,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 47, endFrame: 52, sourceSkillIds: ['chr_0025_ardelia_attack1'] },
        { startFrame: 236, endFrame: 241, sourceSkillIds: ['chr_0025_ardelia_attack1'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(188, sequence(step('finishTimeline', {})), 189),
      scheduled(
        25,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 32,
            condition: {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 0 },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 1 },
            },
          }),
        ),
        31,
      ),
      scheduled(
        214,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 221,
            condition: {
              kind: 'all',
              conditions: [
                {
                  kind: 'contextTargetCountCompare',
                  contextKey: 'other_cor_tar',
                  operator: 'greater',
                  value: 0,
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 0 },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 1.5 },
                },
              ],
            },
          }),
        ),
        220,
      ),
      scheduled(
        32,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('createSpatialPointTargets', {
                saveToContextKey: 'SheepPoint',
                count: { kind: 'blackboard', key: 'sheep_num' },
              }),
              repeatByActionValue(
                { kind: 'blackboard', key: 'sheep_num' },
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0025_ardelia_normal_skill.actionGroupData.timelineActions[19]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_skill',
                    {},
                    true,
                    sequence(
                      withActionBlackboardScope(
                        'SkillData.chr_0025_ardelia_normal_skill.actionGroupData.timelineActions[19]._sequenceActionData.actionData[2]:chr_0025_ardelia_normal_skill_gene_sheep',
                        { atb: 0, atk_scale: 0, heal_scale: 0, heal_value: 0, potential2: 0 },
                        true,
                        sequence(
                          step('spawnAbilityEntity', {
                            abilityEntityId: 'abilityentity_chr_0025_ardelia_remain_loop',
                            childSkillId: 'chr_0025_ardelia_remain_loop_sheep',
                            inheritActionBlackboard: true,
                            inheritSourceSkillCastInfo: true,
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
              ),
            ),
          ),
        ),
        35,
      ),
      scheduled(
        221,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('createSpatialPointTargets', {
                saveToContextKey: 'SheepPoint',
                count: { kind: 'blackboard', key: 'sheep_num' },
              }),
              repeatByActionValue(
                { kind: 'blackboard', key: 'sheep_num' },
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0025_ardelia_normal_skill.actionGroupData.timelineActions[20]._sequenceActionData.actionData[2]:projectile_chr_0025_ardelia_normal_skill',
                    {},
                    true,
                    sequence(
                      withActionBlackboardScope(
                        'SkillData.chr_0025_ardelia_normal_skill.actionGroupData.timelineActions[20]._sequenceActionData.actionData[2]:chr_0025_ardelia_normal_skill_gene_sheep',
                        { atb: 0, atk_scale: 0, heal_scale: 0, heal_value: 0, potential2: 0 },
                        true,
                        sequence(
                          step('spawnAbilityEntity', {
                            abilityEntityId: 'abilityentity_chr_0025_ardelia_remain_loop',
                            childSkillId: 'chr_0025_ardelia_remain_loop_sheep',
                            inheritActionBlackboard: true,
                            inheritSourceSkillCastInfo: true,
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
              ),
            ),
          ),
        ),
        224,
      ),
      scheduled(
        32,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0025_ardelia_normal_skill_kill_sheep'],
            reason: 'other',
          }),
          forEachTarget(
            'enemy',
            sequence(
              branch(
                {
                  kind: 'buffTagIdCountCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellStatus/Corrupt'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0025_ardelia_normal_skill_vulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration_vul' },
                      rate: { kind: 'blackboard', key: 'rate_vul_base' },
                    },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellStatus/Corrupt'],
                    reason: 'early',
                  }),
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'talent1_mark',
                    durationSeconds: { kind: 'constant', value: 1 },
                    autoFinishByAction: false,
                  }),
                ),
              ),
            ),
          ),
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0025_ardelia_normal_skill:/scheduledSequences/5/sequence/steps/2',
          ),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
        33,
      ),
      scheduled(
        221,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0025_ardelia_normal_skill_kill_sheep'],
            reason: 'other',
          }),
          forEachTarget(
            'enemy',
            sequence(
              branch(
                {
                  kind: 'buffTagIdCountCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellStatus/Corrupt'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0025_ardelia_normal_skill_vulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration_vul' },
                      rate: { kind: 'blackboard', key: 'rate_vul_base' },
                    },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellStatus/Corrupt'],
                    reason: 'early',
                  }),
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'talent1_mark',
                    durationSeconds: { kind: 'constant', value: 1 },
                    autoFinishByAction: false,
                  }),
                ),
              ),
            ),
          ),
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0025_ardelia_normal_skill:/scheduledSequences/6/sequence/steps/2',
          ),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
        222,
      ),
      scheduled(
        33,
        sequence(
          branch(
            { kind: 'timedMarkerPresent', target: 'caster', markerId: 'talent1_mark' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent1' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'entityTagMatch',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      tags: ['Skill/Character/Common/SpellStatus/Corrupt'],
                    },
                    sequence(
                      step('mergeContextTargets', {
                        saveToContextKey: 'other_cor_tar',
                        sources: [{ kind: 'target', target: 'enemy' }],
                      }),
                    ),
                    sequence(
                      step('mergeContextTargets', {
                        saveToContextKey: 'other_cor_tar',
                        sources: [],
                      }),
                    ),
                  ),
                  branch(
                    {
                      kind: 'contextTargetCountCompare',
                      contextKey: 'other_cor_tar',
                      operator: 'greaterOrEqual',
                      value: 1,
                    },
                    sequence(step('jumpTimeline', { destinationFrame: 189 })),
                  ),
                ),
              ),
            ),
          ),
        ),
        36,
      ),
      scheduled(
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0025_ardelia_normal_skill',
            childSkillId: 'chr_0025_ardelia_normal_skill_sheep',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
          }),
        ),
        3,
      ),
      scheduled(
        189,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0025_ardelia_normal_skill',
            childSkillId: 'chr_0025_ardelia_normal_skill_sheep',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
          }),
        ),
        192,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0025_ardelia_normal_skill_kill_sheep',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        189,
      ),
      scheduled(
        189,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0025_ardelia_normal_skill_kill_sheep',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        378,
      ),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    additional_def_decrease: 0,
    atk_scale: [
      1.41999995708466, 1.55999994277954, 1.71000003814697, 1.85000002384186, 1.99000000953674,
      2.13000011444092, 2.27999997138977, 2.42000007629395, 2.55999994277954, 2.74000000953674,
      2.95000004768372, 3.20000004768372,
    ],
    cam_angle: 0,
    def_decrease: 0,
    duration_vul: 30,
    heal_scale: 0,
    heal_value: 0,
    input_angle: 0,
    poise: 10,
    potential2: 0,
    rate_vul: 0,
    rate_vul_base: [
      0.119999997317791, 0.119999997317791, 0.119999997317791, 0.129999995231628, 0.129999995231628,
      0.129999995231628, 0.140000000596046, 0.140000000596046, 0.159999996423721, 0.170000001788139,
      0.180000007152557, 0.200000002980232,
    ],
    sheep_num: 0,
    talent1: 0,
    rate_vul_max: [
      0.360000014305115, 0.360000014305115, 0.360000014305115, 0.370000004768372, 0.370000004768372,
      0.370000004768372, 0.379999995231628, 0.379999995231628, 0.400000005960464, 0.409999996423721,
      0.419999986886978, 0.400000005960464,
    ],
  },
);

export const ardeliaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0025_ardelia_combo_skill',
    timelineBlockFrames: 23,
    naturalDurationFrames: 160,
    exclusiveFrame: 40,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 23, endFrame: 40, sourceSkillIds: ['chr_0025_ardelia_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0025_ardelia_combo_skill',
            childSkillId: 'chr_0025_ardelia_combo_skill_sheep',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
          }),
        ),
        3,
      ),
      scheduled(
        20,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0025_ardelia_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[1].succeedActions.actionData[0]:projectile_chr_0025_ardelia_combo_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0025_ardelia_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[1].succeedActions.actionData[0]:chr_0025_ardelia_combo_skill_projhit',
                {
                  atk_scale: 0,
                  atk_scale_boom: 0,
                  duration_corrupt: 0,
                  potential3: 0,
                  potential5_dmg_rate: 0,
                  potential5_duration: 0,
                  usp: 0,
                },
                true,
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'potential5_dmg_rate' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'atk_scale',
                        operation: 'multiply',
                        value: { kind: 'blackboard', key: 'potential5_dmg_rate' },
                      }),
                      step('modifyActionValue', {
                        key: 'atk_scale_boom',
                        operation: 'multiply',
                        value: { kind: 'blackboard', key: 'potential5_dmg_rate' },
                      }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'nature',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['comboSkill'],
                          features: ['canBreakWeakness'],
                        },
                        'chr_0025_ardelia_combo_skill:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0/whenTrue/steps/2',
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
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'nature',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['comboSkill'],
                          features: ['canBreakWeakness'],
                        },
                        'chr_0025_ardelia_combo_skill:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0/whenFalse/steps/0',
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
                    { alwaysNext: true },
                  ),
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0025_ardelia_combo_skill_bomb',
                    childSkillId: 'chr_0025_ardelia_combo_skill_bomb',
                    inheritActionBlackboard: true,
                    inheritSourceSkillCastInfo: true,
                    dieWhenSourceDies: false,
                    target: 'enemy',
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
        23,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.800000011920929 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        21,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0025_ardelia_combo_skill_kill_sheep',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        160,
      ),
    ],
    smartTarget: 'input',
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      0.449999988079071, 0.490000009536743, 0.540000021457672, 0.579999983310699, 0.620000004768372,
      0.670000016689301, 0.709999978542328, 0.759999990463257, 0.800000011920929, 0.860000014305115,
      0.930000007152557, 1,
    ],
    atk_scale_boom: [
      1.11000001430511, 1.22000002861023, 1.33000004291534, 1.44000005722046, 1.54999995231628,
      1.66999995708466, 1.77999997138977, 1.88999998569489, 2, 2.14000010490417, 2.29999995231628,
      2.5,
    ],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    duration_corrupt: 7,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    posie: 0,
    potential3: 0,
    potential5_dmg_rate: 0,
    potential5_duration: 0,
    usp: 10,
    poise: 10,
  },
);

export const ardeliaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0025_ardelia_ultimate_skill',
    timelineBlockFrames: 209,
    naturalDurationFrames: 261,
    exclusiveFrame: 223,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 209,
          endFrame: 226,
          sourceSkillIds: ['chr_0025_ardelia_normal_skill', 'chr_0025_ardelia_combo_skill'],
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
        1,
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
        171,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 201,
            condition: {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential3_duration' },
              operator: 'less',
              right: { kind: 'constant', value: 1 },
            },
          }),
        ),
        174,
      ),
      scheduled(
        81,
        sequence(
          repeatEachTick(
            sequence(
              step('createSpatialPointTargets', {
                saveToContextKey: 'ranPos',
                count: { kind: 'constant', value: 1 },
              }),
              repeatByActionValue(
                { kind: 'constant', value: 1 },
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0025_ardelia_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[0].actionOnTick.actionData[1]:projectile_chr_0025_ardelia_ultimate_skill',
                    {},
                    true,
                    sequence(
                      withActionBlackboardScope(
                        'SkillData.chr_0025_ardelia_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[0].actionOnTick.actionData[1]:chr_0025_ardelia_ultimate_skill_sheep_projhit',
                        {
                          atk_scale: 0,
                          effect_prob: 0,
                          heal_scale: 0,
                          heal_value: 0,
                          interval: 0,
                          poise: 0,
                          potential3_rate: 0,
                          random_phy: 0,
                          random_spe: 0,
                        },
                        true,
                        sequence(
                          branch(
                            {
                              kind: 'probability',
                              probability: { kind: 'blackboard', key: 'effect_prob' },
                            },
                            sequence(
                              step('spawnAbilityEntity', {
                                abilityEntityId: 'abilityentity_chr_0025_ardelia_remain_loop',
                                childSkillId: 'chr_0025_ardelia_remain_loop_sheep',
                                inheritActionBlackboard: true,
                                inheritSourceSkillCastInfo: true,
                                dieWhenSourceDies: false,
                              }),
                            ),
                          ),
                          forEachTarget(
                            'enemy',
                            sequence(
                              branch(
                                {
                                  kind: 'not',
                                  condition: {
                                    kind: 'timedMarkerPresent',
                                    target: 'enemy',
                                    markerId: 'ArdeliaUltMark',
                                  },
                                },
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'nature',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                      tags: ['ultimateSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise' },
                                    },
                                    'chr_0025_ardelia_ultimate_skill:/scheduledSequences/3/sequence/steps/0/body/steps/1/body/steps/0/body/steps/0/body/steps/1/body/steps/0/whenTrue/steps/0',
                                  ),
                                  step('createTimedMarker', {
                                    target: 'enemy',
                                    markerId: 'ArdeliaUltMark',
                                    durationSeconds: { kind: 'blackboard', key: 'interval' },
                                    autoFinishByAction: false,
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
                    undefined,
                    { lifetime: 'execution' },
                  ),
                ),
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: false,
                triggerIntervalSeconds: 0.100000001490116,
                maxCountPerTarget: -1,
                targetTriggerIntervalSeconds: 0.0299999993294477,
              },
            },
          ),
        ),
        201,
      ),
      scheduled(
        81,
        sequence(
          repeatEachTick(
            sequence(
              step('createSpatialPointTargets', {
                saveToContextKey: 'ranPos',
                count: { kind: 'constant', value: 1 },
              }),
              repeatByActionValue(
                { kind: 'constant', value: 1 },
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0025_ardelia_ultimate_skill.actionGroupData.timelineActions[8]._sequenceActionData.actionData[0].actionOnTick.actionData[1]:projectile_chr_0025_ardelia_ultimate_skill',
                    {},
                    true,
                    sequence(
                      withActionBlackboardScope(
                        'SkillData.chr_0025_ardelia_ultimate_skill.actionGroupData.timelineActions[8]._sequenceActionData.actionData[0].actionOnTick.actionData[1]:chr_0025_ardelia_ultimate_skill_sheep_projhit',
                        {
                          atk_scale: 0,
                          effect_prob: 0,
                          heal_scale: 0,
                          heal_value: 0,
                          interval: 0,
                          poise: 0,
                          potential3_rate: 0,
                          random_phy: 0,
                          random_spe: 0,
                        },
                        true,
                        sequence(
                          branch(
                            {
                              kind: 'probability',
                              probability: { kind: 'blackboard', key: 'effect_prob' },
                            },
                            sequence(
                              step('spawnAbilityEntity', {
                                abilityEntityId: 'abilityentity_chr_0025_ardelia_remain_loop',
                                childSkillId: 'chr_0025_ardelia_remain_loop_sheep',
                                inheritActionBlackboard: true,
                                inheritSourceSkillCastInfo: true,
                                dieWhenSourceDies: false,
                              }),
                            ),
                          ),
                          forEachTarget(
                            'enemy',
                            sequence(
                              branch(
                                {
                                  kind: 'not',
                                  condition: {
                                    kind: 'timedMarkerPresent',
                                    target: 'enemy',
                                    markerId: 'ArdeliaUltMark',
                                  },
                                },
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'nature',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                      tags: ['ultimateSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise' },
                                    },
                                    'chr_0025_ardelia_ultimate_skill:/scheduledSequences/4/sequence/steps/0/body/steps/1/body/steps/0/body/steps/0/body/steps/1/body/steps/0/whenTrue/steps/0',
                                  ),
                                  step('createTimedMarker', {
                                    target: 'enemy',
                                    markerId: 'ArdeliaUltMark',
                                    durationSeconds: { kind: 'blackboard', key: 'interval' },
                                    autoFinishByAction: false,
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
                    undefined,
                    { lifetime: 'execution' },
                  ),
                ),
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: false,
                triggerIntervalSeconds: 0.100000001490116,
                maxCountPerTarget: -1,
                targetTriggerIntervalSeconds: 0.0299999993294477,
              },
            },
          ),
        ),
        201,
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
        80,
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
        81,
      ),
    ],
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      0.730000019073486, 0.810000002384186, 0.879999995231628, 0.949999988079071, 1.02999997138977,
      1.10000002384186, 1.16999995708466, 1.25, 1.32000005245209, 1.4099999666214, 1.51999998092651,
      1.64999997615814,
    ],
    atk_scale_2: 0,
    effect_prob: 0.100000001490116,
    heal_scale: 0,
    heal_value: 0,
    interval: 0.300000011920929,
    poise: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
    potential2: 0,
    potential3_duration: 0,
    potential3_rate: 0,
    radius: 4,
    ranCount: 0,
    select_radius: 10,
    tarDisMax: 0,
    duration: 3,
  },
);

export default {
  slug: 'ardelia',
  gameId: 'ARDELIA',
  rarity: 6,
  weaponType: 'arts-unit',
  element: 'nature',
  role: 'supporter',
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
  attributes: {
    strength: [9, 31, 54, 77, 100, 112],
    agility: [9, 27, 46, 65, 84, 93],
    intellect: [20, 46, 75, 103, 131, 145],
    will: [15, 37, 60, 83, 106, 118],
    baseAttack: [30, 93, 159, 225, 291, 323],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [ardeliaBasicAttack1, ardeliaBasicAttack2, ardeliaBasicAttack3, ardeliaBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: ardeliaFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: ardeliaPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: ardeliaBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: ardeliaComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: ardeliaUltimate },
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
        'plungingAttack',
        'finisher',
      ],
      defaultSkillKey: 'basicAttack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  comboSkillConditions: [
    {
      key: 'native-combo:0',
      skillKey: 'comboSkill',
      event: 'outputDamage',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'contextTargetIdentityMatch',
            contextKey: 'trigger',
            other: 'controlledOperator',
            operator: 'equal',
          },
          sequence(
            branch(
              { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['normalAttackLastCombo'] },
              sequence(
                branch(
                  {
                    kind: 'buffStackCompare',
                    target: 'actionInputTarget',
                    tagQueryType: 'hasAny',
                    buffTags: [
                      'Skill/Character/Common/NoGuard',
                      'Skill/Character/Common/SpellInflict',
                    ],
                    operator: 'equal',
                    value: { kind: 'constant', value: 0 },
                  },
                  sequence(),
                ),
              ),
            ),
          ),
        ),
      ),
    },
  ],
  comboSkillPriority: 'default',
  talents: [
    {
      key: 'talent1',
      levels: 3,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_scale',
          operation: 'assign',
          value: [0.379999995231628, 0.529999971389771, 0.75],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_value',
          operation: 'assign',
          value: [45, 63, 90],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'heal_scale',
          operation: 'assign',
          value: [0.379999995231628, 0.529999971389771, 0.75],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'heal_value',
          operation: 'assign',
          value: [45, 63, 90],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'sheep_num',
          operation: 'assign',
          value: [3, 3, 3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'effect_prob',
          operation: 'assign',
          value: [0.100000001490116, 0.100000001490116, 0.100000001490116],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent1',
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
          blackboardKey: 'rate_vul_base',
          operation: 'add',
          value: 0.0799999982118607,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential2',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential2',
          operation: 'assign',
          value: 1,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential3_duration',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'effect_prob',
          operation: 'multiply',
          value: 1.20000004768372,
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
          multiplier: 0.850000023841858,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential5_duration',
          operation: 'assign',
          value: 4,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential5_dmg_rate',
          operation: 'add',
          value: 1.20000004768372,
        },
        { kind: 'addSkillCooldownFrames', skillGroupKey: 'comboSkill', frames: -60 },
      ],
    },
  ],
  entityBlackboard: { EntityBB_skill_bg_type: 99 },
  buffDefinitions: {
    buff_chr_0025_ardelia_affixes_vulnerable_physic_child: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0, rate: 0.2 },
      attributeModifiers: [],
    },
    buff_chr_0025_ardelia_affixes_vulnerable_spell_child: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_vulnerable',
        iconPath: '/icons/icon_battle_affix_vulnerable.webp',
        showInHeadBarCommon: true,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
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
      blackboard: { duration: 0, rate: 0.2 },
      attributeModifiers: [],
    },
    buff_chr_0025_ardelia_attack4_kill_sheep: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'attack4_sheep',
            abilityEntityIds: [
              'abilityentity_chr_0025_ardelia_attack4',
              'abilityentity_chr_0025_ardelia_attack4_end',
              'abilityentity_chr_0025_ardelia_attack4_low',
            ],
          }),
          forEachContextTarget('attack4_sheep', sequence(step('finishCurrentAbilityEntity', {}))),
        ),
      },
    },
    buff_chr_0025_ardelia_combo_skill_kill_sheep: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'combo_skill_sheep',
            abilityEntityIds: ['abilityentity_chr_0025_ardelia_combo_skill'],
          }),
          forEachContextTarget(
            'combo_skill_sheep',
            sequence(step('finishCurrentAbilityEntity', {})),
          ),
        ),
      },
    },
    buff_chr_0025_ardelia_normal_skill_kill_sheep: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'normal_skill_sheep',
            abilityEntityIds: ['abilityentity_chr_0025_ardelia_normal_skill'],
          }),
          forEachContextTarget(
            'normal_skill_sheep',
            sequence(step('finishCurrentAbilityEntity', {})),
          ),
        ),
      },
    },
    buff_chr_0025_ardelia_normal_skill_vulnerable: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 7, rate: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_spell',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_chr_0025_ardelia_affixes_vulnerable_spell_child',
            },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_physical',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_chr_0025_ardelia_affixes_vulnerable_physic_child',
            },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0025_ardelia_attack4: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0025_ardelia/Attack4Sheep',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      childSkill: {
        skillId: 'chr_0025_ardelia_attack4_sheep',
        blackboard: { atb: 0, atk_scale: 0, poise: 0 },
        scheduledSequences: [
          scheduled(
            24,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'abilityentity_chr_0025_ardelia_attack4:chr_0025_ardelia_attack4_sheep:/childSkill/scheduledSequences/0/sequence/steps/0',
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
            27,
          ),
          scheduled(27, sequence(step('finishActionOwnerAbilityEntity', {})), 30),
        ],
      },
    },
    abilityentity_chr_0025_ardelia_attack4_end: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0025_ardelia/Attack4Sheep',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      childSkill: {
        skillId: 'chr_0025_ardelia_attack4_end_sheep',
        blackboard: { atb: 0, atk_scale: 0 },
        scheduledSequences: [
          scheduled(109, sequence(step('finishActionOwnerAbilityEntity', {})), 112),
        ],
      },
    },
    abilityentity_chr_0025_ardelia_attack4_low: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0025_ardelia/Attack4Sheep',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      childSkill: {
        skillId: 'chr_0025_ardelia_attack4_sheep',
        blackboard: { atb: 0, atk_scale: 0, poise: 0 },
        scheduledSequences: [
          scheduled(
            24,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'abilityentity_chr_0025_ardelia_attack4_low:chr_0025_ardelia_attack4_sheep:/childSkill/scheduledSequences/0/sequence/steps/0',
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
            27,
          ),
          scheduled(27, sequence(step('finishActionOwnerAbilityEntity', {})), 30),
        ],
      },
    },
    abilityentity_chr_0025_ardelia_normal_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0025_ardelia/NormalSkillSheep',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      childSkill: {
        skillId: 'chr_0025_ardelia_normal_skill_sheep',
        blackboard: { atb: 0, atk_scale: 0 },
        scheduledSequences: [
          scheduled(31, sequence(step('finishActionOwnerAbilityEntity', {})), 34),
        ],
      },
    },
    abilityentity_chr_0025_ardelia_remain_loop: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 10 },
      maxStackingCount: 10,
      childSkill: {
        skillId: 'chr_0025_ardelia_remain_loop_sheep',
        blackboard: {
          atb: 0,
          heal_scale: 1,
          heal_scale_half: 0,
          heal_value: 0,
          heal_value_half: 0,
          potential2: 0,
          RandomSheep: 0,
        },
        scheduledSequences: [
          scheduled(
            9,
            sequence(
              step('findCharacterTeamTargets', {
                saveToContextKey:
                  '__auraParty:SkillData.chr_0025_ardelia_remain_loop_sheep.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]',
                selection: { kind: 'controlledOperator' },
              }),
              forEachContextTarget(
                '__auraParty:SkillData.chr_0025_ardelia_remain_loop_sheep.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]',
                sequence(
                  branch(
                    {
                      kind: 'healthCompare',
                      target: 'currentTarget',
                      valueType: 'ratio',
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 0.990000009536743 },
                    },
                    sequence(
                      step('findCharacterTeamTargets', {
                        saveToContextKey: 'healTar',
                        selection: {
                          kind: 'lowestHealthRatioOperator',
                          excludeCurrentTarget: true,
                        },
                      }),
                      branch(
                        {
                          kind: 'contextTargetCountCompare',
                          contextKey: 'healTar',
                          operator: 'greaterOrEqual',
                          value: 1,
                        },
                        sequence(
                          branch(
                            {
                              kind: 'healthCompare',
                              target: 'contextTarget',
                              contextKey: 'healTar',
                              valueType: 'ratio',
                              operator: 'greaterOrEqual',
                              value: { kind: 'constant', value: 0.990000009536743 },
                            },
                            sequence(
                              step('mergeContextTargets', {
                                saveToContextKey: 'healTar',
                                sources: [{ kind: 'target', target: 'currentTarget' }],
                              }),
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'potential2' },
                                  operator: 'greaterOrEqual',
                                  right: { kind: 'constant', value: 1 },
                                },
                                sequence(
                                  step('findCharacterTeamTargets', {
                                    saveToContextKey: 'otherMate',
                                    selection: {
                                      kind: 'lowestHealthRatioOperator',
                                      excludedContextKey: 'healTar',
                                    },
                                  }),
                                  step('calculateActionValue', {
                                    key: 'heal_scale_half',
                                    operation: 'multiply',
                                    left: { kind: 'blackboard', key: 'heal_scale' },
                                    right: { kind: 'constant', value: 0.5 },
                                  }),
                                  step('calculateActionValue', {
                                    key: 'heal_value_half',
                                    operation: 'multiply',
                                    left: { kind: 'blackboard', key: 'heal_value' },
                                    right: { kind: 'constant', value: 0.5 },
                                  }),
                                  step('heal', {
                                    target: 'contextTarget',
                                    contextKey: 'otherMate',
                                    alwaysNext: true,
                                    tags: [],
                                    attribute: 'will',
                                    multiplier: { kind: 'blackboard', key: 'heal_scale_half' },
                                    addition: { kind: 'blackboard', key: 'heal_value_half' },
                                  }),
                                ),
                                undefined,
                                { alwaysNext: true },
                              ),
                              step('heal', {
                                target: 'contextTarget',
                                contextKey: 'healTar',
                                alwaysNext: true,
                                tags: [],
                                attribute: 'will',
                                multiplier: { kind: 'blackboard', key: 'heal_scale' },
                                addition: { kind: 'blackboard', key: 'heal_value' },
                              }),
                              step('finishActionOwnerAbilityEntity', {}),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'potential2' },
                                  operator: 'greaterOrEqual',
                                  right: { kind: 'constant', value: 1 },
                                },
                                sequence(
                                  step('findCharacterTeamTargets', {
                                    saveToContextKey: 'otherMate',
                                    selection: {
                                      kind: 'lowestHealthRatioOperator',
                                      excludedContextKey: 'healTar',
                                    },
                                  }),
                                  step('calculateActionValue', {
                                    key: 'heal_scale_half',
                                    operation: 'multiply',
                                    left: { kind: 'blackboard', key: 'heal_scale' },
                                    right: { kind: 'constant', value: 0.5 },
                                  }),
                                  step('calculateActionValue', {
                                    key: 'heal_value_half',
                                    operation: 'multiply',
                                    left: { kind: 'blackboard', key: 'heal_value' },
                                    right: { kind: 'constant', value: 0.5 },
                                  }),
                                  step('heal', {
                                    target: 'contextTarget',
                                    contextKey: 'otherMate',
                                    alwaysNext: true,
                                    tags: [],
                                    attribute: 'will',
                                    multiplier: { kind: 'blackboard', key: 'heal_scale_half' },
                                    addition: { kind: 'blackboard', key: 'heal_value_half' },
                                  }),
                                ),
                                undefined,
                                { alwaysNext: true },
                              ),
                              step('heal', {
                                target: 'contextTarget',
                                contextKey: 'healTar',
                                alwaysNext: true,
                                tags: [],
                                attribute: 'will',
                                multiplier: { kind: 'blackboard', key: 'heal_scale' },
                                addition: { kind: 'blackboard', key: 'heal_value' },
                              }),
                              step('finishActionOwnerAbilityEntity', {}),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step('mergeContextTargets', {
                            saveToContextKey: 'healTar',
                            sources: [{ kind: 'target', target: 'currentTarget' }],
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential2' },
                              operator: 'greaterOrEqual',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('findCharacterTeamTargets', {
                                saveToContextKey: 'otherMate',
                                selection: {
                                  kind: 'lowestHealthRatioOperator',
                                  excludedContextKey: 'healTar',
                                },
                              }),
                              step('calculateActionValue', {
                                key: 'heal_scale_half',
                                operation: 'multiply',
                                left: { kind: 'blackboard', key: 'heal_scale' },
                                right: { kind: 'constant', value: 0.5 },
                              }),
                              step('calculateActionValue', {
                                key: 'heal_value_half',
                                operation: 'multiply',
                                left: { kind: 'blackboard', key: 'heal_value' },
                                right: { kind: 'constant', value: 0.5 },
                              }),
                              step('heal', {
                                target: 'contextTarget',
                                contextKey: 'otherMate',
                                alwaysNext: true,
                                tags: [],
                                attribute: 'will',
                                multiplier: { kind: 'blackboard', key: 'heal_scale_half' },
                                addition: { kind: 'blackboard', key: 'heal_value_half' },
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                          step('heal', {
                            target: 'contextTarget',
                            contextKey: 'healTar',
                            alwaysNext: true,
                            tags: [],
                            attribute: 'will',
                            multiplier: { kind: 'blackboard', key: 'heal_scale' },
                            addition: { kind: 'blackboard', key: 'heal_value' },
                          }),
                          step('finishActionOwnerAbilityEntity', {}),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                    sequence(
                      step('mergeContextTargets', {
                        saveToContextKey: 'healTar',
                        sources: [{ kind: 'target', target: 'currentTarget' }],
                      }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'potential2' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('findCharacterTeamTargets', {
                            saveToContextKey: 'otherMate',
                            selection: {
                              kind: 'lowestHealthRatioOperator',
                              excludedContextKey: 'healTar',
                            },
                          }),
                          step('calculateActionValue', {
                            key: 'heal_scale_half',
                            operation: 'multiply',
                            left: { kind: 'blackboard', key: 'heal_scale' },
                            right: { kind: 'constant', value: 0.5 },
                          }),
                          step('calculateActionValue', {
                            key: 'heal_value_half',
                            operation: 'multiply',
                            left: { kind: 'blackboard', key: 'heal_value' },
                            right: { kind: 'constant', value: 0.5 },
                          }),
                          step('heal', {
                            target: 'contextTarget',
                            contextKey: 'otherMate',
                            alwaysNext: true,
                            tags: [],
                            attribute: 'will',
                            multiplier: { kind: 'blackboard', key: 'heal_scale_half' },
                            addition: { kind: 'blackboard', key: 'heal_value_half' },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      step('heal', {
                        target: 'contextTarget',
                        contextKey: 'healTar',
                        alwaysNext: true,
                        tags: [],
                        attribute: 'will',
                        multiplier: { kind: 'blackboard', key: 'heal_scale' },
                        addition: { kind: 'blackboard', key: 'heal_value' },
                      }),
                      step('finishActionOwnerAbilityEntity', {}),
                    ),
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
            300,
          ),
          scheduled(299, sequence(step('finishActionOwnerAbilityEntity', {})), 300),
        ],
      },
    },
    abilityentity_chr_0025_ardelia_combo_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0025_ardelia/ComboSkillSheep',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      childSkill: {
        skillId: 'chr_0025_ardelia_combo_skill_sheep',
        blackboard: { atb: 0, atk_scale: 0 },
        scheduledSequences: [
          scheduled(66, sequence(step('finishActionOwnerAbilityEntity', {})), 69),
        ],
      },
    },
    abilityentity_chr_0025_ardelia_combo_skill_bomb: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 3 },
      childSkill: {
        skillId: 'chr_0025_ardelia_combo_skill_bomb',
        blackboard: {
          atb: 0,
          atk_scale_boom: 0,
          duration_corrupt: 0,
          duration_corrupt_final: 0,
          poise: 0,
          potential5_dmg_rate: 0,
          potential5_duration: 0,
        },
        scheduledSequences: [
          scheduled(
            52,
            sequence(
              step('calculateActionValue', {
                key: 'duration_corrupt_final',
                operation: 'add',
                left: { kind: 'blackboard', key: 'duration_corrupt' },
                right: { kind: 'blackboard', key: 'potential5_duration' },
              }),
              step('applyBuff', {
                buffId: 'buff_common_natural_natural_corrupt_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  duration: { kind: 'blackboard', key: 'duration_corrupt_final' },
                },
              }),
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_boom' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'abilityentity_chr_0025_ardelia_combo_skill_bomb:chr_0025_ardelia_combo_skill_bomb:/childSkill/scheduledSequences/0/sequence/steps/2',
              ),
              step('mergeContextTargets', { saveToContextKey: 'tar', sources: [] }),
              step('modifyActionValue', {
                key: 'atk_scale_boom',
                operation: 'multiply',
                value: { kind: 'constant', value: 0.5 },
              }),
            ),
            55,
          ),
          scheduled(119, sequence(step('finishActionOwnerAbilityEntity', {})), 120),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
