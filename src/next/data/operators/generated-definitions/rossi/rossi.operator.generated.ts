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

export const rossiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0028_wulfa_attack1',
    timelineBlockFrames: 9,
    exclusiveFrame: 15,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 3,
          endFrame: 34,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 9, endFrame: 34, sourceSkillIds: ['chr_0028_wulfa_attack2'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack1:/scheduledSequences/0/sequence/steps/0',
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
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.03 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        9,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  { atb: 0, atk_scale: [0.27, 0.3, 0.32, 0.35, 0.38, 0.41, 0.43, 0.46, 0.49, 0.52, 0.56, 0.61] },
);

export const rossiBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0028_wulfa_attack2',
    timelineBlockFrames: 12,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 4,
          endFrame: 35,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 12, endFrame: 34, sourceSkillIds: ['chr_0028_wulfa_attack3'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack2:/scheduledSequences/0/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.03 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
      scheduled(
        9,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack2:/scheduledSequences/1/sequence/steps/0',
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
            ),
            undefined,
            { alwaysNext: true },
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
    atk_scale: [0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.5, 0.54, 0.57, 0.61, 0.65, 0.71],
    poise: 0,
  },
);

export const rossiBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0028_wulfa_attack3',
    timelineBlockFrames: 15,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 5,
          endFrame: 35,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 15, endFrame: 36, sourceSkillIds: ['chr_0028_wulfa_attack4'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        4,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0028_wulfa_attack3:/scheduledSequences/0/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.03 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        5,
      ),
      scheduled(
        12,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0028_wulfa_attack3:/scheduledSequences/1/sequence/steps/0',
          ),
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
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.06 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
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
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [0.34, 0.37, 0.41, 0.44, 0.48, 0.51, 0.54, 0.58, 0.61, 0.65, 0.71, 0.77],
    poise: 0,
  },
);

export const rossiBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0028_wulfa_attack4',
    timelineBlockFrames: 225,
    exclusiveFrame: 239,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 18,
          endFrame: 65,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack5',
        },
        {
          startFrame: 207,
          endFrame: 246,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 36, endFrame: 67, sourceSkillIds: ['chr_0028_wulfa_attack5'] },
        { startFrame: 225, endFrame: 250, sourceSkillIds: ['chr_0028_wulfa_attack5'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(),
            sequence(step('jumpTimeline', { destinationFrame: 189 })),
            { alwaysNext: true },
          ),
        ),
        3,
      ),
      scheduled(
        6,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.2 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/1/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        8,
      ),
      scheduled(
        8,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        9,
      ),
      scheduled(
        13,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/3/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        15,
      ),
      scheduled(
        15,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/4/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        17,
      ),
      scheduled(
        23,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/5/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        25,
      ),
      scheduled(
        195,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/6/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        197,
      ),
      scheduled(
        198,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/7/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        199,
      ),
      scheduled(
        203,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/8/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        205,
      ),
      scheduled(
        205,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/9/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        207,
      ),
      scheduled(
        213,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/10/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        215,
      ),
      scheduled(188, sequence(step('finishTimeline', {})), 189),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [0.41, 0.45, 0.49, 0.53, 0.57, 0.61, 0.65, 0.69, 0.73, 0.78, 0.84, 0.91],
    poise: 0,
  },
);

export const rossiBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0028_wulfa_attack5',
    timelineBlockFrames: 31,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 27,
          endFrame: 60,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 45, endFrame: 60, sourceSkillIds: ['chr_0028_wulfa_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        15,
        sequence(
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
        17,
      ),
      scheduled(
        15,
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
            'chr_0028_wulfa_attack5:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'isHitbyMain',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        17,
      ),
      scheduled(
        16,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'isHitbyMain' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.25 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0.002923974,
                      value: 0.2,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.1241782,
                      value: 0.1,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.5,
                      value: 0.1,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.2,
                      inTangent: 0,
                      outTangent: 0,
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
            undefined,
            { alwaysNext: true },
          ),
        ),
        18,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 21,
    atk_scale: [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.13],
    isHitbyMain: 0,
    poise: 18,
  },
);

export const rossiFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0028_wulfa_power_attack',
    timelineBlockFrames: 66,
    exclusiveFrame: 65,
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.1,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0028_wulfa_power_attack:/scheduledSequences/0/sequence/steps/0/body/steps/0/whenTrue/steps/0',
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
                        targets: ['caster'],
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
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        8,
      ),
      scheduled(
        15,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.1,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0028_wulfa_power_attack:/scheduledSequences/1/sequence/steps/0/body/steps/0/whenTrue/steps/0',
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
                        targets: ['caster'],
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
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        17,
      ),
      scheduled(
        36,
        sequence(
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.8,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0028_wulfa_power_attack:/scheduledSequences/2/sequence/steps/1',
          ),
        ),
        39,
      ),
      scheduled(
        38,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.45 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.1,
                  value: 0.05,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.5935698,
                  value: 0.05,
                  inTangent: -0.02046953,
                  outTangent: -0.02046953,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 3.483965,
                  outTangent: 3.483965,
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
        41,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
              operator: 'greater',
              value: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_powerattack_resumecombo',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
              }),
            ),
          ),
        ),
        65,
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
        65,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
);

export const rossiPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0028_wulfa_plunging_attack_end',
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
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0028_wulfa_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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
    ],
    skillType: 'plungingAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  { atb: 0, atk_scale: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8] },
);

export const rossiBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0028_wulfa_normal_skill',
    timelineBlockFrames: 38,
    exclusiveFrame: 272,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 38,
          endFrame: 56,
          sourceSkillIds: [
            'chr_0028_wulfa_normal_skill',
            'chr_0028_wulfa_combo_2_skill',
            'chr_0028_wulfa_combo_3_skill',
          ],
        },
        {
          startFrame: 258,
          endFrame: 277,
          sourceSkillIds: [
            'chr_0028_wulfa_normal_skill',
            'chr_0028_wulfa_combo_2_skill',
            'chr_0028_wulfa_combo_3_skill',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        16,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.3 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0028_wulfa_normal_skill:/scheduledSequences/0/sequence/steps/1/body/steps/0',
              ),
              step('modifyActionValue', {
                key: 'trigger',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        20,
      ),
      scheduled(
        22,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.3 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0028_wulfa_normal_skill:/scheduledSequences/1/sequence/steps/1/body/steps/0',
              ),
              step('modifyActionValue', {
                key: 'trigger',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        26,
      ),
      scheduled(
        35,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.4 },
          }),
          step('modifyActionValue', {
            key: 'trigger',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              branch(
                { kind: 'targetStaggered', target: 'enemy' },
                sequence(
                  step('modifyActionValue', {
                    key: 'FollowAttackTrigger',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  }),
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
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          ),
                        ),
                        finish: sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_no_guard_fake',
                            target: 'buffOwner',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                        afterEnhance: sequence(
                          withActionBlackboardScope(
                            'native-buff-callback:0',
                            {},
                            true,
                            sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'buffOwner',
                                igniteType: 'NoGuard',
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
                                        source: 'buffSource',
                                        inheritSourceSkillCastInfo: true,
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
                          withActionBlackboardScope(
                            'native-buff-callback:0',
                            {},
                            true,
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                },
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
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                          withActionBlackboardScope(
                            'native-buff-callback:2',
                            {},
                            true,
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_handle_cryst_break',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                          withActionBlackboardScope(
                            'native-buff-callback:3',
                            {},
                            true,
                            sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'caster',
                                igniteType: 'PhysicalStatus',
                              }),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                        ),
                      },
                    },
                    duration: { kind: 'constant', value: 1.2 },
                    height: { kind: 'constant', value: 1.5 },
                    speedFactorMultiplier: 1,
                    force: false,
                    targetFilter: 'aliveOnly',
                    returnWhen: 'always',
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise_1' },
                    },
                    'chr_0028_wulfa_normal_skill:/scheduledSequences/2/sequence/steps/2/body/steps/0/whenTrue/steps/2',
                  ),
                  step('modifyActionValue', {
                    key: 'trigger',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('startTimeDilation', {
                        scope: 'entity',
                        durationSeconds: { kind: 'constant', value: 0.15 },
                        slot: 'TimeDilation/Layer/Entity/HitStop',
                        priority: 10,
                        curve: {
                          kind: 'inline',
                          keys: [
                            {
                              time: 0,
                              value: 0.05,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.1,
                              value: 0.05,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.7389196,
                              value: 0.05473808,
                              inTangent: 0.02105814,
                              outTangent: 0.02105814,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 1,
                              value: 0.5,
                              inTangent: 0,
                              outTangent: 0,
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
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                sequence(
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
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          ),
                        ),
                        finish: sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_no_guard_fake',
                            target: 'buffOwner',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                        afterEnhance: sequence(
                          withActionBlackboardScope(
                            'native-buff-callback:0',
                            {},
                            true,
                            sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'buffOwner',
                                igniteType: 'NoGuard',
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
                                        source: 'buffSource',
                                        inheritSourceSkillCastInfo: true,
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
                          withActionBlackboardScope(
                            'native-buff-callback:0',
                            {},
                            true,
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                },
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
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                          withActionBlackboardScope(
                            'native-buff-callback:2',
                            {},
                            true,
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_handle_cryst_break',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                          withActionBlackboardScope(
                            'native-buff-callback:3',
                            {},
                            true,
                            sequence(
                              step('igniteBuffs', {
                                target: 'buffOwner',
                                source: 'caster',
                                igniteType: 'PhysicalStatus',
                              }),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                        ),
                      },
                    },
                    duration: { kind: 'constant', value: 1.2 },
                    height: { kind: 'constant', value: 1.5 },
                    speedFactorMultiplier: 1,
                    force: false,
                    targetFilter: 'aliveOnly',
                    returnWhen: 'always',
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise_1' },
                    },
                    'chr_0028_wulfa_normal_skill:/scheduledSequences/2/sequence/steps/2/body/steps/0/whenFalse/steps/1',
                  ),
                  step('modifyActionValue', {
                    key: 'trigger',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('startTimeDilation', {
                        scope: 'entity',
                        durationSeconds: { kind: 'constant', value: 0.15 },
                        slot: 'TimeDilation/Layer/Entity/HitStop',
                        priority: 10,
                        curve: {
                          kind: 'inline',
                          keys: [
                            {
                              time: 0,
                              value: 0.05,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.1,
                              value: 0.05,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.7389196,
                              value: 0.05473808,
                              inTangent: 0.02105814,
                              outTangent: 0.02105814,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 1,
                              value: 0.5,
                              inTangent: 0,
                              outTangent: 0,
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
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        37,
      ),
      scheduled(
        230,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_smarttarget',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_wolf_timer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          withActionBlackboardScope(
            'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[2]:projectile_chr_0028_wulfa_normalskill_2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[2]:chr_0028_wulfa_normal_skill_projhit2',
                {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                true,
                sequence(
                  repeatEachTick(
                    sequence(
                      step('calculateActionValue', {
                        key: 'atk_scale_once',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'atk_scale_3' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('calculateActionValue', {
                        key: 'poise_2',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'poise_2' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'buffIdStackCompare',
                              target: 'enemy',
                              buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                              operator: 'greater',
                              value: { kind: 'constant', value: 0.5 },
                            },
                            {
                              kind: 'buffIdStackCompare',
                              target: 'caster',
                              buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                              operator: 'equal',
                              value: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    blackboardAssignments: {
                                      duration: { kind: 'blackboard', key: 'duration_bleed' },
                                      atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      extra_atk_scale: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_scale',
                                      },
                                      damage_cd: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_interval',
                                      },
                                      talent_2: { kind: 'constant', value: 1 },
                                      damage_up: { kind: 'blackboard', key: 'damage_up' },
                                      heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                      talent2_burning_damage_scale: {
                                        kind: 'blackboard',
                                        key: 'talent2_burning_damage_scale',
                                      },
                                    },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                  ),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 0 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_1_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_1' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'talent_2_2' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0.5 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 1 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                          ),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 0 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                          ),
                                        ),
                                        { alwaysNext: true },
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'heat',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise_2' },
                            },
                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenFalse/steps/0',
                          ),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                    {
                      nativeChanneling: {
                        executeEachFrame: true,
                        triggerIntervalSeconds: 0.033,
                        maxCountPerTarget: 1,
                        targetTriggerIntervalSeconds: 0.033,
                      },
                    },
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
                        {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_2' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_upgrade' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_return' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'team',
                                spGainKind: 'refund',
                                spGainSource: 'skill',
                              }),
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            sequence(
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            { alwaysNext: true },
                          ),
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
          withActionBlackboardScope(
            'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[3]:projectile_chr_0028_wulfa_normalskill_3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[3]:chr_0028_wulfa_normal_skill_projhit3',
                {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                true,
                sequence(
                  repeatEachTick(
                    sequence(
                      step('calculateActionValue', {
                        key: 'atk_scale_once',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'atk_scale_3' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('calculateActionValue', {
                        key: 'poise_2',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'poise_2' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_tut_normalskill_success',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                      }),
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'buffIdStackCompare',
                              target: 'enemy',
                              buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                              operator: 'greater',
                              value: { kind: 'constant', value: 0.5 },
                            },
                            {
                              kind: 'buffIdStackCompare',
                              target: 'caster',
                              buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                              operator: 'equal',
                              value: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    blackboardAssignments: {
                                      duration: { kind: 'blackboard', key: 'duration_bleed' },
                                      atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      extra_atk_scale: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_scale',
                                      },
                                      damage_cd: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_interval',
                                      },
                                      talent_2: { kind: 'constant', value: 1 },
                                      damage_up: { kind: 'blackboard', key: 'damage_up' },
                                      heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                      talent2_burning_damage_scale: {
                                        kind: 'blackboard',
                                        key: 'talent2_burning_damage_scale',
                                      },
                                    },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                  ),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 0 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_1_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_1' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'talent_2_2' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0.5 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 1 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                          ),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 0 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                          ),
                                        ),
                                        { alwaysNext: true },
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'heat',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise_2' },
                            },
                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenFalse/steps/0',
                          ),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                    {
                      nativeChanneling: {
                        executeEachFrame: true,
                        triggerIntervalSeconds: 0.033,
                        maxCountPerTarget: 1,
                        targetTriggerIntervalSeconds: 0.033,
                      },
                    },
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
                        {
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0028_wulfa_normal_bleed'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('calculateActionValue', {
                            key: 'hit_bleed_num',
                            operation: 'add',
                            left: { kind: 'blackboard', key: 'hit_bleed_num' },
                            right: { kind: 'constant', value: 1 },
                          }),
                        ),
                      ),
                    ),
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
                        {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_2' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_upgrade' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_return' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'team',
                                spGainKind: 'refund',
                                spGainSource: 'skill',
                              }),
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            sequence(
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            { alwaysNext: true },
                          ),
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
          withActionBlackboardScope(
            'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[4]:projectile_chr_0028_wulfa_normalskill_4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[4]:chr_0028_wulfa_normal_skill_projhit4',
                {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                true,
                sequence(
                  repeatEachTick(
                    sequence(
                      step('calculateActionValue', {
                        key: 'atk_scale_once',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'atk_scale_3' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('calculateActionValue', {
                        key: 'poise_2',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'poise_2' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'buffIdStackCompare',
                              target: 'enemy',
                              buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                              operator: 'greater',
                              value: { kind: 'constant', value: 0.5 },
                            },
                            {
                              kind: 'buffIdStackCompare',
                              target: 'caster',
                              buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                              operator: 'equal',
                              value: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    blackboardAssignments: {
                                      duration: { kind: 'blackboard', key: 'duration_bleed' },
                                      atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      extra_atk_scale: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_scale',
                                      },
                                      damage_cd: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_interval',
                                      },
                                      talent_2: { kind: 'constant', value: 1 },
                                      damage_up: { kind: 'blackboard', key: 'damage_up' },
                                      heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                      talent2_burning_damage_scale: {
                                        kind: 'blackboard',
                                        key: 'talent2_burning_damage_scale',
                                      },
                                    },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                  ),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 0 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_1_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_1' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'talent_2_2' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0.5 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 1 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                          ),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 0 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                          ),
                                        ),
                                        { alwaysNext: true },
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'heat',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise_2' },
                            },
                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenFalse/steps/0',
                          ),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                    {
                      nativeChanneling: {
                        executeEachFrame: true,
                        triggerIntervalSeconds: 0.033,
                        maxCountPerTarget: 1,
                        targetTriggerIntervalSeconds: 0.033,
                      },
                    },
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
                        {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_2' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_upgrade' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_return' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'team',
                                spGainKind: 'refund',
                                spGainSource: 'skill',
                              }),
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            sequence(
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            { alwaysNext: true },
                          ),
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
          withActionBlackboardScope(
            'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[5]:projectile_chr_0028_wulfa_normalskill_5',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[5]:chr_0028_wulfa_normal_skill_projhit5',
                {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                true,
                sequence(
                  repeatEachTick(
                    sequence(
                      step('calculateActionValue', {
                        key: 'atk_scale_once',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'atk_scale_3' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('calculateActionValue', {
                        key: 'poise_2',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'poise_2' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'buffIdStackCompare',
                              target: 'enemy',
                              buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                              operator: 'greater',
                              value: { kind: 'constant', value: 0.5 },
                            },
                            {
                              kind: 'buffIdStackCompare',
                              target: 'caster',
                              buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                              operator: 'equal',
                              value: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    blackboardAssignments: {
                                      duration: { kind: 'blackboard', key: 'duration_bleed' },
                                      atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      extra_atk_scale: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_scale',
                                      },
                                      damage_cd: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_interval',
                                      },
                                      talent_2: { kind: 'constant', value: 1 },
                                      damage_up: { kind: 'blackboard', key: 'damage_up' },
                                      heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                      talent2_burning_damage_scale: {
                                        kind: 'blackboard',
                                        key: 'talent2_burning_damage_scale',
                                      },
                                    },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                  ),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 0 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_1_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_1' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'talent_2_2' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0.5 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 1 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                          ),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 0 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                          ),
                                        ),
                                        { alwaysNext: true },
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'heat',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise_2' },
                            },
                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenFalse/steps/0',
                          ),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                    {
                      nativeChanneling: {
                        executeEachFrame: true,
                        triggerIntervalSeconds: 0.033,
                        maxCountPerTarget: 1,
                        targetTriggerIntervalSeconds: 0.033,
                      },
                    },
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
                        {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_2' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_upgrade' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_return' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'team',
                                spGainKind: 'refund',
                                spGainSource: 'skill',
                              }),
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            sequence(
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            { alwaysNext: true },
                          ),
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
        233,
      ),
      scheduled(
        35,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'trigger' },
              operator: 'greater',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })),
          ),
        ),
        37,
      ),
      scheduled(
        215,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
            reason: 'early',
          }),
        ),
        218,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'caster',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/Common/Affixes/skillimbue'],
            },
            sequence(
              step('modifyActionValue', {
                key: 'skillimbue',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'skillimbue',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        3,
      ),
      scheduled(
        37,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 215,
            condition: {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 0.9 },
            },
          }),
        ),
        40,
      ),
      scheduled(214, sequence(step('finishTimeline', {})), 215),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_normalskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        72,
      ),
      scheduled(
        215,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        272,
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
    atk_scale_1: [0.85, 0.94, 1.02, 1.11, 1.19, 1.28, 1.37, 1.45, 1.54, 1.64, 1.77, 1.92],
    atk_scale_2: 0.6,
    atk_scale_3: [1.28, 1.41, 1.53, 1.66, 1.79, 1.92, 2.04, 2.17, 2.3, 2.46, 2.65, 2.88],
    atk_scale_bleed: [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
    atk_scale_once: 0,
    bleed_critical_damage_interval: 2,
    bleed_critical_damage_scale: 1,
    blow_off_distance: 2,
    cam_angle: 0,
    cam_duration: 0,
    cam_lookatoffset_X: 0,
    cam_shoulderoffset_X: 0,
    damage_up: 0,
    distance_random_range: 0.2,
    duration_bleed: 15,
    fire_duration: 8,
    FollowAttackTrigger: 0,
    heal_scale: 0.2,
    input_angle: 0,
    poise_1: 5,
    poise_2: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
    potential_upgrade: 0,
    select_radius: 7,
    skillimbue: 0,
    talent_1_1: 0,
    talent_1_2: 0,
    talent_2_1: 0,
    talent_2_2: 0,
    talent2_burning_damage_scale: 1.5,
    trigger: 0,
    ups_1: 15,
    usp_2: 10,
    display_atk_scale_1: [0.85, 0.94, 1.02, 1.11, 1.19, 1.28, 1.37, 1.45, 1.54, 1.64, 1.77, 1.92],
    usp_1: 15,
  },
);

export const rossiComboSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill2',
    sourceSkillId: 'chr_0028_wulfa_combo_2_skill',
    timelineBlockFrames: 37,
    exclusiveFrame: 65,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 37,
          endFrame: 65,
          sourceSkillIds: ['chr_0028_wulfa_normal_skill', 'chr_0028_wulfa_combo_3_skill'],
        },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          repeatEachTick(
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'constant', value: 0.35 },
              }),
              step('calculateActionValue', {
                key: 'poise_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'poise' },
                right: { kind: 'constant', value: 0.5 },
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_once' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0028_wulfa_combo_2_skill:/scheduledSequences/0/sequence/steps/0/body/steps/2',
              ),
              step('calculateActionValue', {
                key: 'count',
                operation: 'add',
                left: { kind: 'blackboard', key: 'count' },
                right: { kind: 'constant', value: 1 },
              }),
              step('calculateActionValue', {
                key: 'can_trigger_combo',
                operation: 'add',
                left: { kind: 'blackboard', key: 'can_trigger_combo' },
                right: { kind: 'constant', value: 1 },
              }),
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'count' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    { kind: 'casterControlled' },
                  ],
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.24 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0.05,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.7,
                          value: 0.05,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 0.075,
                          inTangent: 0,
                          outTangent: 0,
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        14,
      ),
      scheduled(
        24,
        sequence(
          repeatEachTick(
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'constant', value: 0.35 },
              }),
              step('calculateActionValue', {
                key: 'poise_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'poise' },
                right: { kind: 'constant', value: 0.5 },
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_once' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0028_wulfa_combo_2_skill:/scheduledSequences/1/sequence/steps/0/body/steps/2',
              ),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'constant', value: 0.1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_2_damagewait',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  atk_scale: { kind: 'blackboard', key: 'atk_scale_once' },
                  trigger_times: { kind: 'constant', value: 3 },
                  damage_interval: { kind: 'constant', value: 0.125 },
                  duration: { kind: 'constant', value: 0.3 },
                },
              }),
              step('calculateActionValue', {
                key: 'count',
                operation: 'add',
                left: { kind: 'blackboard', key: 'count' },
                right: { kind: 'constant', value: 1 },
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        25,
      ),
      scheduled(
        24,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
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
        25,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_Combo_qte_proto_use' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'timing_success',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
                reason: 'other',
              }),
            ),
          ),
        ),
        15,
      ),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'count' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'can_trigger_combo' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  time_succeed: { kind: 'blackboard', key: 'time_succeed' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        38,
      ),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'can_trigger_combo' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeSkillSlot', {
                skillGroupKey: 'comboSkill',
                targetSkillKey: 'comboSkill3',
                inheritOriginSkillCooldownProgress: false,
                lifetime: 'infinite',
                revertedSkillKey: 'comboSkill2',
              }),
            ),
          ),
        ),
        58,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_usecount',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 2 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_usetimer'],
                reason: 'other',
              }),
            ),
          ),
        ),
        37,
      ),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'can_trigger_combo' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
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
                  step('adjustSkillCooldown', {
                    target: 'caster',
                    skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                    operation: 'set',
                    basis: 'absoluteSeconds',
                    value: { kind: 'constant', value: 0 },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_usetimer',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                sequence(
                  step('adjustSkillCooldown', {
                    target: 'caster',
                    skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                    operation: 'set',
                    basis: 'absoluteSeconds',
                    value: { kind: 'constant', value: 0 },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_usetimer',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
                reason: 'other',
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        41,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        16,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        65,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 420],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    alpha: 0,
    atk_scale: [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    atk_scale_once: 0.01,
    cam_angle: 0,
    cam_duration: 0,
    cam_shoulderoffset_X: 0,
    can_trigger_combo: 0,
    count: 0,
    distance: 0,
    input_angle: 0,
    obsorb_no_guard: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 0,
    poise_once: 0.01,
    time_succeed: 0.4,
    timing_success: 0,
    usp: 10,
    display_atk_scale_2_f: [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    display_atk_scale_2_s: [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    display_crit_increase_duration: 15,
    display_crit_increase_rate: 0.25,
    display_poise_2_f: 5,
    display_poise_2_s: 10,
    display_usp_2_f: 0,
    display_usp_2_s: 10,
  },
);

export const rossiComboSkill3: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill3',
    sourceSkillId: 'chr_0028_wulfa_combo_3_skill',
    timelineBlockFrames: 52,
    exclusiveFrame: 259,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 52, endFrame: 72, sourceSkillIds: ['chr_0028_wulfa_normal_skill'] },
        { startFrame: 249, endFrame: 269, sourceSkillIds: ['chr_0028_wulfa_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        225,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'timing_success' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0.5 },
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.4 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 50,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0.5,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.2,
                          value: 0.03,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.75,
                          value: 0.03,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 1,
                          inTangent: 0.149662,
                          outTangent: 0.149662,
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        226,
      ),
      scheduled(
        227,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'buff_stack',
                    query: {
                      kind: 'tag',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    reason: 'early',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('modifyActionValue', {
                    key: 'can_trigger_combo',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffStackCount', {
                        target: 'enemy',
                        outputKey: 'buff_stack',
                        query: {
                          kind: 'tag',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                        },
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                        reason: 'early',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('modifyActionValue', {
                        key: 'can_trigger_combo',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('readBuffStackCount', {
                            target: 'enemy',
                            outputKey: 'buff_stack',
                            query: {
                              kind: 'tag',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            },
                          }),
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            reason: 'early',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                          step('modifyActionValue', {
                            key: 'can_trigger_combo',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'buffStackCompare',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                              operator: 'greaterOrEqual',
                              value: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('readBuffStackCount', {
                                target: 'enemy',
                                outputKey: 'buff_stack',
                                query: {
                                  kind: 'tag',
                                  tagQueryType: 'hasAny',
                                  buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                                },
                              }),
                              step('finishBuffsByTag', {
                                target: 'enemy',
                                tagQueryType: 'hasAny',
                                buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                                reason: 'early',
                              }),
                              step('applyBuff', {
                                buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                              }),
                              step('modifyActionValue', {
                                key: 'can_trigger_combo',
                                operation: 'add',
                                value: { kind: 'constant', value: 1 },
                              }),
                            ),
                            sequence(
                              step('modifyActionValue', {
                                key: 'can_trigger_combo',
                                operation: 'add',
                                value: { kind: 'constant', value: 0 },
                              }),
                              step('modifyActionValue', {
                                key: 'spellinflict_stack_max',
                                operation: 'assign',
                                value: { kind: 'constant', value: 0 },
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
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        227,
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
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
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                              ),
                            ),
                            finish: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard_fake',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                            afterEnhance: sequence(
                              withActionBlackboardScope(
                                'native-buff-callback:0',
                                {},
                                true,
                                sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'buffOwner',
                                    igniteType: 'NoGuard',
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
                                            source: 'buffSource',
                                            inheritSourceSkillCastInfo: true,
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
                              withActionBlackboardScope(
                                'native-buff-callback:0',
                                {},
                                true,
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_no_guard',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                    },
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
                                ),
                                undefined,
                                { lifetime: 'execution', alwaysNext: true },
                              ),
                              withActionBlackboardScope(
                                'native-buff-callback:2',
                                {},
                                true,
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_handle_cryst_break',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                                undefined,
                                { lifetime: 'execution', alwaysNext: true },
                              ),
                              withActionBlackboardScope(
                                'native-buff-callback:3',
                                {},
                                true,
                                sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'caster',
                                    igniteType: 'PhysicalStatus',
                                  }),
                                ),
                                undefined,
                                { lifetime: 'execution', alwaysNext: true },
                              ),
                            ),
                          },
                        },
                        duration: { kind: 'constant', value: 1 },
                        height: { kind: 'constant', value: 20 },
                        speedFactorMultiplier: 10,
                        force: false,
                        targetFilter: 'aliveOnly',
                        returnWhen: 'always',
                      }),
                      step('finishBuffsById', {
                        target: 'enemy',
                        buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                        reason: 'other',
                      }),
                    ),
                  ),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        228,
      ),
      scheduled(
        227,
        sequence(
          repeatEachTick(
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'spellinflict_stack_max',
                query: { kind: 'id', buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'] },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'spellinflict_stack_max' },
                right: { kind: 'blackboard', key: 'damage_add' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'blackboard', key: 'atk_scale_s' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'blackboard', key: 'potential_atk_multiply' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'constant', value: 1 },
              }),
              step('calculateActionValue', {
                key: 'poise_once',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'poise_f' },
                right: { kind: 'constant', value: 1 },
              }),
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'],
                reason: 'other',
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_once' },
                },
                'chr_0028_wulfa_combo_3_skill:/scheduledSequences/3/sequence/steps/0/body/steps/7',
              ),
              step('calculateActionValue', {
                key: 'count',
                operation: 'add',
                left: { kind: 'blackboard', key: 'count' },
                right: { kind: 'constant', value: 1 },
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        228,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_usecount',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
            operation: 'set',
            basis: 'baseDurationRatio',
            value: { kind: 'constant', value: 1 },
          }),
          step('changeSkillSlot', {
            skillGroupKey: 'comboSkill',
            targetSkillKey: 'comboSkill2',
            inheritOriginSkillCooldownProgress: false,
            lifetime: 'infinite',
          }),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
              operator: 'equal',
              value: { kind: 'constant', value: 2 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0028_wulfa_combo_usetimer',
                  'buff_chr_0028_wulfa_combo_usecount',
                ],
                reason: 'other',
              }),
            ),
          ),
        ),
        3,
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_s' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
          ),
        ),
        228,
      ),
      scheduled(
        29,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'buff_stack',
                    query: {
                      kind: 'tag',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    reason: 'early',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('modifyActionValue', {
                    key: 'can_trigger_combo',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffStackCount', {
                        target: 'enemy',
                        outputKey: 'buff_stack',
                        query: {
                          kind: 'tag',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                        },
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                        reason: 'early',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('modifyActionValue', {
                        key: 'can_trigger_combo',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('readBuffStackCount', {
                            target: 'enemy',
                            outputKey: 'buff_stack',
                            query: {
                              kind: 'tag',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            },
                          }),
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            reason: 'early',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                          step('modifyActionValue', {
                            key: 'can_trigger_combo',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'buffStackCompare',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                              operator: 'greaterOrEqual',
                              value: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('readBuffStackCount', {
                                target: 'enemy',
                                outputKey: 'buff_stack',
                                query: {
                                  kind: 'tag',
                                  tagQueryType: 'hasAny',
                                  buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                                },
                              }),
                              step('finishBuffsByTag', {
                                target: 'enemy',
                                tagQueryType: 'hasAny',
                                buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                                reason: 'early',
                              }),
                              step('applyBuff', {
                                buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                              }),
                              step('modifyActionValue', {
                                key: 'can_trigger_combo',
                                operation: 'add',
                                value: { kind: 'constant', value: 1 },
                              }),
                            ),
                            sequence(
                              step('modifyActionValue', {
                                key: 'can_trigger_combo',
                                operation: 'add',
                                value: { kind: 'constant', value: 0 },
                              }),
                              step('modifyActionValue', {
                                key: 'buff_stack',
                                operation: 'assign',
                                value: { kind: 'constant', value: 0 },
                              }),
                              step('modifyActionValue', {
                                key: 'spellinflict_stack_max',
                                operation: 'assign',
                                value: { kind: 'constant', value: 0 },
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
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        29,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
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
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                              ),
                            ),
                            finish: sequence(
                              step('applyBuff', {
                                buffId: 'buff_physical_no_guard_fake',
                                target: 'buffOwner',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                            afterEnhance: sequence(
                              withActionBlackboardScope(
                                'native-buff-callback:0',
                                {},
                                true,
                                sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'buffOwner',
                                    igniteType: 'NoGuard',
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
                                            source: 'buffSource',
                                            inheritSourceSkillCastInfo: true,
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
                              withActionBlackboardScope(
                                'native-buff-callback:0',
                                {},
                                true,
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_no_guard',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      skip_handle_cryst_break: { kind: 'constant', value: 1 },
                                    },
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
                                ),
                                undefined,
                                { lifetime: 'execution', alwaysNext: true },
                              ),
                              withActionBlackboardScope(
                                'native-buff-callback:2',
                                {},
                                true,
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_physical_handle_cryst_break',
                                    target: 'buffOwner',
                                    source: 'buffSource',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                ),
                                undefined,
                                { lifetime: 'execution', alwaysNext: true },
                              ),
                              withActionBlackboardScope(
                                'native-buff-callback:3',
                                {},
                                true,
                                sequence(
                                  step('igniteBuffs', {
                                    target: 'buffOwner',
                                    source: 'caster',
                                    igniteType: 'PhysicalStatus',
                                  }),
                                ),
                                undefined,
                                { lifetime: 'execution', alwaysNext: true },
                              ),
                            ),
                          },
                        },
                        duration: { kind: 'constant', value: 1 },
                        height: { kind: 'constant', value: 20 },
                        speedFactorMultiplier: 10,
                        force: false,
                        targetFilter: 'aliveOnly',
                        returnWhen: 'always',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_physical_no_guard',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('finishBuffsById', {
                        target: 'enemy',
                        buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                        reason: 'other',
                      }),
                    ),
                  ),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        30,
      ),
      scheduled(
        27,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'timing_success' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0.5 },
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.4 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 50,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0.5,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.2,
                          value: 0.03,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.75,
                          value: 0.03,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 1,
                          inTangent: 0.149662,
                          outTangent: 0.149662,
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        28,
      ),
      scheduled(
        29,
        sequence(
          repeatEachTick(
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'spellinflict_stack_max',
                query: { kind: 'id', buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'] },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'spellinflict_stack_max' },
                right: { kind: 'blackboard', key: 'damage_add' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'blackboard', key: 'atk_scale_s' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'blackboard', key: 'potential_atk_multiply' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'constant', value: 1 },
              }),
              step('calculateActionValue', {
                key: 'poise_once',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'poise_s' },
                right: { kind: 'constant', value: 1 },
              }),
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'],
                reason: 'other',
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_once' },
                },
                'chr_0028_wulfa_combo_3_skill:/scheduledSequences/9/sequence/steps/0/body/steps/7',
              ),
              step('calculateActionValue', {
                key: 'count',
                operation: 'add',
                left: { kind: 'blackboard', key: 'count' },
                right: { kind: 'constant', value: 1 },
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        30,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_Combo_QTE_Trigger' },
              operator: 'greater',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0028_wulfa_combo_2_qte_timer',
                  'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
                ],
                reason: 'early',
              }),
              step('modifyActionValue', {
                key: 'timing_success',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('findOwnerSpawnedAbilityEntities', {
                saveToContextKey:
                  '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].succeedActions.actionData[2]',
              }),
              forEachContextTarget(
                '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].succeedActions.actionData[2]',
                sequence(step('finishCurrentAbilityEntity', {})),
              ),
              step('startTimeDilation', {
                scope: 'global',
                durationSeconds: { kind: 'constant', value: 0.4 },
                slot: 'unassigned',
                priority: 50,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0.01,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.1,
                      value: 0.01,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.8,
                      value: 0.01,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.01,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                ignoredTargets: ['caster'],
              }),
              step('findOwnerSpawnedAbilityEntities', {
                saveToContextKey:
                  '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].succeedActions.actionData[13]',
              }),
              forEachContextTarget(
                '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].succeedActions.actionData[13]',
                sequence(step('finishCurrentAbilityEntity', {})),
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0.5 },
                },
                sequence(
                  step('calculateActionValue', {
                    key: 'atk_scale_s',
                    operation: 'multiply',
                    left: { kind: 'blackboard', key: 'atk_scale_s' },
                    right: { kind: 'blackboard', key: 'potential_atk_multiply' },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0028_wulfa_combo_2_qte_timer',
                  'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
                ],
                reason: 'early',
              }),
              step('findOwnerSpawnedAbilityEntities', {
                saveToContextKey:
                  '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].failActions.actionData[1]',
              }),
              forEachContextTarget(
                '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].failActions.actionData[1]',
                sequence(step('finishCurrentAbilityEntity', {})),
              ),
              step('modifyActionValue', {
                key: 'timing_success',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
              step('jumpTimeline', { destinationFrame: 212 }),
            ),
            { alwaysNext: true },
          ),
        ),
        28,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'timing_success' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'count' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
              ],
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_s' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
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
            buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'crit_increase_duration' },
              critical_rate: { kind: 'blackboard', key: 'crit_increase_rate' },
              critical_damage_inc: { kind: 'blackboard', key: 'crit_damage_increase_rate' },
            },
          }),
        ),
        3,
      ),
      scheduled(
        212,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'crit_increase_duration' },
              critical_rate: { kind: 'blackboard', key: 'crit_increase_rate' },
              critical_damage_inc: { kind: 'blackboard', key: 'crit_damage_increase_rate' },
            },
          }),
        ),
        215,
      ),
      scheduled(211, sequence(step('finishTimeline', {})), 212),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        16,
      ),
      scheduled(
        212,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        222,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_success',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        58,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        59,
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        257,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        60,
      ),
      scheduled(
        212,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        259,
      ),
    ],
    smartTarget: 'enemy',
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    alpha: 0,
    atk_scale_f: [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    atk_scale_once: 0,
    atk_scale_s: [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    buff_stack: 0,
    cam_angle: 0,
    cam_duration: 0,
    cam_shoulderoffset_X: 0,
    can_trigger_combo: 0,
    count: 0,
    crit_damage_increase_rate: [0.3, 0.3, 0.3, 0.34, 0.34, 0.34, 0.38, 0.38, 0.42, 0.42, 0.46, 0.5],
    crit_increase_duration: 15,
    crit_increase_rate: [0.15, 0.15, 0.15, 0.17, 0.17, 0.17, 0.19, 0.19, 0.21, 0.21, 0.23, 0.25],
    damage_add: [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    distance: 0,
    input_angle: 0,
    obsorb_no_guard: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise_f: 5,
    poise_once: 0,
    poise_s: 5,
    potential_1: 0,
    potential_atk_multiply: 1,
    spellinflict_stack_max: 0,
    timing_success: 0,
    usp_f: 10,
    usp_s: 10,
    zoom_scale: 0,
  },
);

export const rossiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0028_wulfa_ultimate_skill',
    timelineBlockFrames: 156,
    exclusiveFrame: 155,
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
        57,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Immune/Damage', 'SelectCategory/Unmarkable'],
                },
                sequence(),
                sequence(
                  branch(
                    { kind: 'enemyRankIn', ranks: ['elite'] },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_ult_stopenemy_elite',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                        blackboardAssignments: { duration: { kind: 'constant', value: 3.099969 } },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        150,
      ),
      scheduled(
        64,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Immune/Damage', 'SelectCategory/Unmarkable'],
                },
                sequence(),
                sequence(
                  branch(
                    { kind: 'enemyRankIn', ranks: ['mob'] },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_ult_stopenemy',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                        blackboardAssignments: { duration: { kind: 'constant', value: 2.866664 } },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        150,
      ),
      scheduled(
        64,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_ult_addtional_battleshape',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        111,
      ),
      scheduled(
        122,
        sequence(
          step('modifyActionValue', {
            key: 'hit_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0028_wulfa_ultimate_skill:/scheduledSequences/4/sequence/steps/1/body/steps/0',
              ),
              step('modifyActionValue', {
                key: 'hit_num',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        125,
      ),
      scheduled(
        131,
        sequence(
          step('modifyActionValue', {
            key: 'hit_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0028_wulfa_normal_bleed'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0028_wulfa_ultimate_skill:/scheduledSequences/5/sequence/steps/1/body/steps/0/whenTrue/steps/1',
                  ),
                  step('modifyActionValue', {
                    key: 'hit_num',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                sequence(
                  step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0028_wulfa_ultimate_skill:/scheduledSequences/5/sequence/steps/1/body/steps/0/whenFalse/steps/1',
                  ),
                  step('modifyActionValue', {
                    key: 'hit_num',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.033,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.033,
              },
            },
          ),
        ),
        134,
      ),
      scheduled(
        134,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_num' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.32 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 50,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0.05,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.6,
                      value: 0.05,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.6,
                      inTangent: 1.865142,
                      outTangent: 1.865142,
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
            undefined,
            { alwaysNext: true },
          ),
        ),
        135,
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
        155,
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
        57,
      ),
      scheduled(
        58,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'greater',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale_1',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_1' },
                right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_2',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_2' },
                right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_3',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_3' },
                right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
              }),
              step('calculateActionValue', {
                key: 'crit_damage_up_to_bleed',
                operation: 'add',
                left: { kind: 'blackboard', key: 'crit_damage_up_to_bleed' },
                right: { kind: 'blackboard', key: 'potential_5_critical_damage' },
              }),
            ),
          ),
        ),
        208,
      ),
      scheduled(
        58,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              critical_damage_up_to_bleed: { kind: 'blackboard', key: 'crit_damage_up_to_bleed' },
            },
          }),
        ),
        208,
      ),
      scheduled(
        63,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/11/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        64,
      ),
      scheduled(
        65,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/12/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        66,
      ),
      scheduled(
        66,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/13/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        67,
      ),
      scheduled(
        69,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/14/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        70,
      ),
      scheduled(
        71,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/15/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        72,
      ),
      scheduled(
        74,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/16/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        75,
      ),
      scheduled(
        75,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/17/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        76,
      ),
      scheduled(
        77,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/18/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        78,
      ),
      scheduled(
        78,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/19/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        79,
      ),
      scheduled(
        80,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/20/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        81,
      ),
      scheduled(
        83,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/21/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        84,
      ),
      scheduled(
        84,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/22/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        85,
      ),
      scheduled(
        87,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/23/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        88,
      ),
      scheduled(
        88,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/24/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        89,
      ),
      scheduled(
        90,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/25/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        91,
      ),
      scheduled(
        92,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/26/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        93,
      ),
      scheduled(
        94,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/27/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        95,
      ),
      scheduled(
        96,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/28/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        97,
      ),
      scheduled(
        97,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/29/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        98,
      ),
      scheduled(
        99,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/30/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        100,
      ),
      scheduled(
        102,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/31/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        103,
      ),
      scheduled(
        103,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/32/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        104,
      ),
      scheduled(
        106,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/33/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        107,
      ),
      scheduled(
        108,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/34/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        109,
      ),
      scheduled(
        111,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/35/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        112,
      ),
      scheduled(
        63,
        sequence(
          repeatEachTick(sequence(), {
            nativeChanneling: {
              executeEachFrame: true,
              triggerIntervalSeconds: 0.033,
              maxCountPerTarget: -1,
              targetTriggerIntervalSeconds: 0.03333,
            },
          }),
        ),
        131,
      ),
    ],
    smartTarget: 'enemy',
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 110 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    angle: 130,
    AngleToTarget: 0,
    AnimEventReciver: 0,
    AnimScale: 1,
    AnimScale_Gear_1: 0.7,
    AnimScale_Gear_2: 0.75,
    AnimScale_Gear_3: 0.8,
    AnimScale_Gear_4: 1,
    atk_scale_1: [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.22, 0.24],
    atk_scale_2: [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    atk_scale_3: [3.33, 3.67, 4, 4.33, 4.67, 5, 5.34, 5.67, 6, 6.42, 6.92, 7.5],
    atk_scale_crit_fire: [0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.22, 0.23, 0.24, 0.26, 0.28, 0.3],
    camera_blocked: 0,
    CapeBuffStack: 0,
    crit_damage_up_to_bleed: 0.6,
    float_temp: 1,
    gear: 4,
    height: 4,
    hit_num: 0,
    hit_times: 0,
    IsNotClick: 0,
    originum_ult_break_scale: 0,
    poise: 25,
    potential_5: 0,
    potential_5_critical_damage: 0,
    potential_5_damage_scale: 1.2,
    radius: 5,
    random_hurtanimation: 0,
    random_num: 0,
    display_atk_scale_1_max: [2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5.25, 5.5, 6],
    display_atk_scale_1_min: [
      1.28, 1.41, 1.54, 1.66, 1.79, 1.92, 2.05, 2.18, 2.3, 2.46, 2.66, 2.88,
    ],
  },
);

export const commonBuffDefinitions = {
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
        step(
          'dealDamage',
          {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['cryoAbnormal'],
            features: ['shatter'],
          },
          'buff_common_cryst_triggered_physical_break:/lifecycleSequences/start/steps/0',
        ),
      ),
    },
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
    applyTags: ['Skill/Character/Common/PhysicalStatus/AirborneStatus'],
    extendTags: [],
    blackboard: { atk_scale: 0, duration: 3, poise: 10 },
    attributeModifiers: [],
    lifecycleSequences: {
      start: sequence(
        withActionBlackboardScope(
          'native-buff-callback:0',
          {},
          true,
          sequence(
            step('applyBuff', {
              buffId: 'buff_physical_no_guard',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: { skip_handle_cryst_break: { kind: 'constant', value: 1 } },
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
            step(
              'dealDamage',
              {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: [],
                features: ['physicalInfliction'],
                stagger: { kind: 'blackboard', key: 'poise' },
              },
              'buff_physical_airborne:/lifecycleSequences/start/steps/1/body/steps/1',
            ),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:2',
          {},
          true,
          sequence(
            step('applyBuff', {
              buffId: 'buff_physical_handle_cryst_break',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
        withActionBlackboardScope(
          'native-buff-callback:3',
          {},
          true,
          sequence(
            step('igniteBuffs', {
              target: 'buffOwner',
              source: 'caster',
              igniteType: 'PhysicalStatus',
            }),
          ),
          undefined,
          { lifetime: 'execution', alwaysNext: true },
        ),
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
          source: 'buffSource',
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
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
      ),
      finish: sequence(
        step('applyBuff', {
          buffId: 'buff_physical_no_guard_fake',
          target: 'buffOwner',
          source: 'buffSource',
          inheritSourceSkillCastInfo: true,
        }),
      ),
      afterEnhance: sequence(
        withActionBlackboardScope(
          'native-buff-callback:0',
          {},
          true,
          sequence(
            step('igniteBuffs', {
              target: 'buffOwner',
              source: 'buffOwner',
              igniteType: 'NoGuard',
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
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
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
  slug: 'rossi',
  gameId: 'ROSSI',
  rarity: 6,
  weaponType: 'sword',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [9, 28, 48, 68, 88, 97],
    agility: [23, 55, 90, 124, 159, 176],
    intellect: [14, 36, 59, 83, 106, 118],
    will: [9, 26, 44, 62, 80, 89],
    baseAttack: [30, 93, 159, 225, 291, 323],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        rossiBasicAttack1,
        rossiBasicAttack2,
        rossiBasicAttack3,
        rossiBasicAttack4,
        rossiBasicAttack5,
      ],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: rossiFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: rossiPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: rossiBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: rossiComboSkill2,
      replacementSkills: [rossiComboSkill3],
      replacementSkillPlacements: { comboSkill3: 'standard' },
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: rossiUltimate },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'battleSkill', replacementSkillKeys: [] },
    { key: 'comboSkill', baseSkillKey: 'comboSkill2', replacementSkillKeys: ['comboSkill3'] },
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
        'finisher',
        'plungingAttack',
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_1_1',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 1,
          maximumUpgradeLevel: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_1_2',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 2,
          maximumUpgradeLevel: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_bleed',
          operation: 'assign',
          value: [0.25, 0.3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'duration_bleed',
          operation: 'assign',
          value: [15, 25],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'damage_up',
          operation: 'assign',
          value: [0.06, 0.12],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_2_1',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 1,
          maximumUpgradeLevel: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_2_2',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 2,
          maximumUpgradeLevel: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_scale',
          operation: 'assign',
          value: [0.12, 0.24],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_interval',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_scale',
          operation: 'assign',
          value: [0.04, 0.08],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent2_burning_damage_scale',
          operation: 'assign',
          value: [1.5, 1.5],
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
          blackboardKey: 'potential_upgrade',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_1',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
          blackboardKey: 'atk_scale_s',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
          blackboardKey: 'atk_scale_f',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
          blackboardKey: 'damage_add',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 20 },
        { kind: 'modifyBasePanelStat', stat: 'criticalRate', operation: 'flat', value: 0.07 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_scale',
          operation: 'add',
          value: 0.08,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_interval',
          operation: 'add',
          value: -0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_scale',
          operation: 'add',
          value: 0.04,
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
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_5_damage_scale',
          operation: 'assign',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_5_critical_damage',
          operation: 'assign',
          value: 0.3,
        },
      ],
    },
  ],
  entityBlackboard: {
    EntityBB_Combo_qte_proto_use: 1,
    EntityBB_Combo_QTE_Trigger: 0,
    EntityBB_ComboUseCount: 0,
    EntityBB_NormalSkill_wolf_gain_usp: 0,
  },
  buffDefinitions: {
    buff_chr_0028_wulfa_combo_2_damage: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'damage_interval' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: { blackboardKey: 'trigger_times' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_interval: 0.1,
        duration: 1,
        poise: 0,
        posie: 0,
        trigger_times: 3,
      },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_combo_2_damage:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
      lifecycleSequences: {
        trigger: sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'buff_chr_0028_wulfa_combo_2_damage:/lifecycleSequences/trigger/steps/0',
          ),
        ),
      },
    },
    buff_chr_0028_wulfa_combo_2_damagewait: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_interval: 0.1,
        duration: 3,
        poise: 0,
        posie: 0,
        trigger_times: 3,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_2_damage',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
              poise: { kind: 'blackboard', key: 'poise' },
              trigger_times: { kind: 'blackboard', key: 'trigger_times' },
              damage_interval: { kind: 'blackboard', key: 'damage_interval' },
            },
          }),
        ),
      },
    },
    buff_chr_0028_wulfa_combo_2_qte_timer: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0.5 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_combo_2_qte_timerlistening: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 6, time_succeed: 0.5, time_warning: 0.5 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('modifyActionValue', {
              key: 'EntityBB_Combo_QTE_Trigger',
              operation: 'assign',
              value: { kind: 'constant', value: 0 },
            }),
          ),
          3,
        ),
        scheduled(
          3,
          sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'EntityBB_Combo_qte_proto_use' },
                operator: 'equal',
                right: { kind: 'constant', value: 1 },
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0028_wulfa_combo_qte_timing',
                  childSkillId: 'chr_0028_wulfa_absorb_entity_effect_1',
                  inheritActionBlackboard: true,
                  dieWhenSourceDies: false,
                }),
              ),
            ),
          ),
          19,
        ),
        scheduled(
          15,
          sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'EntityBB_Combo_qte_proto_use' },
                operator: 'equal',
                right: { kind: 'constant', value: 1 },
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0028_wulfa_combo_2_qte_timer',
                  target: 'buffOwner',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: { duration: { kind: 'blackboard', key: 'time_succeed' } },
                }),
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0028_wulfa_combo_qte_timing',
                  childSkillId: 'chr_0028_wulfa_absorb_entity_effect_2',
                  inheritActionBlackboard: true,
                  dieWhenSourceDies: false,
                }),
              ),
            ),
          ),
          16,
        ),
        scheduled(
          35,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: { duration: { kind: 'constant', value: 0.2 } },
            }),
            step('finishBuffsById', {
              target: 'buffOwner',
              buffIds: ['buff_train_output_succbuff_or_failbuff_by_id'],
              reason: 'early',
            }),
          ),
          38,
        ),
        scheduled(
          15,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0028_wulfa_combo_2_qte_timer',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: { duration: { kind: 'blackboard', key: 'time_succeed' } },
            }),
          ),
          16,
        ),
      ],
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffIdMatch',
                buffIds: ['buff_chr_0028_wulfa_powerattack_resumecombo'],
              },
              sequence(step('setCurrentBuffTimePaused', { paused: false })),
            ),
          ),
        },
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillIdIn', skillIds: ['chr_0028_wulfa_power_attack'] },
              sequence(step('setCurrentBuffTimePaused', { paused: true })),
            ),
          ),
        },
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'all',
                conditions: [
                  { kind: 'eventSkillTypeIn', skillTypes: ['comboSkill'] },
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timer'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                  },
                ],
              },
              sequence(
                step('modifyActionValue', {
                  key: 'EntityBB_Combo_QTE_Trigger',
                  operation: 'assign',
                  value: { kind: 'constant', value: 1 },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0028_wulfa_combo_criticalrate: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_crit_up',
        iconPath: '/icons/icon_battle_crit_up.webp',
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
        playStrongInAnimation: true,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: {
        critical_damage_inc: 0.15,
        critical_rate: 0.1,
        duration: 10,
        usp_stage_1: 0.35,
        usp_stage_2: 0.7,
        usp_stage_3: 1,
      },
      attributeModifiers: [
        {
          attribute: 'criticalRate',
          slot: 'baseAddition',
          value: { blackboardKey: 'critical_rate' },
        },
        {
          attribute: 'criticalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'critical_damage_inc' },
        },
      ],
    },
    buff_chr_0028_wulfa_combo_hasinflict: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 10 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_combo_usecount: {
      stackingType: 'enhanceAndOverwriteDuration',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: 10,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_combo_usetimer: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 6, End_Early: 0, need_set_cd: 1 },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
            reason: 'other',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'need_set_cd' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('adjustSkillCooldown', {
                target: 'caster',
                skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                operation: 'set',
                basis: 'baseDurationRatio',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      },
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffIdMatch',
                buffIds: ['buff_chr_0028_wulfa_powerattack_resumecombo'],
              },
              sequence(step('setCurrentBuffTimePaused', { paused: false })),
            ),
          ),
        },
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillIdIn', skillIds: ['chr_0028_wulfa_power_attack'] },
              sequence(step('setCurrentBuffTimePaused', { paused: true })),
            ),
          ),
        },
      ],
    },
    buff_chr_0028_wulfa_normal_bleed: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'damage_interval' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      timeClock: 'global',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_wulfa_blood',
        iconPath: '/icons/icon_battle_buff_wulfa_blood.webp',
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
        playStrongInAnimation: true,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_cd: 1.5,
        damage_interval: 1,
        damage_up: 0.12,
        duration: 1,
        extra_atk_scale: 1.5,
        heal_scale: 0.2,
        poise: 0,
        posie: 0,
        talent_2: 0,
        talent2_burning_damage_scale: 1.5,
      },
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
              addition: { blackboardKey: 'damage_up' },
            },
          ],
        },
        {
          enabledSide: 'defender',
          condition: { kind: 'eventDamageTypesMatch', damageTypes: ['heat'] },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'damage_up' },
            },
          ],
        },
      ],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_normal_bleed:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
      lifecycleSequences: {
        trigger: sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              takeAttackSnapshot: true,
              tags: [],
              features: ['dot', 'talentDamage'],
            },
            'buff_chr_0028_wulfa_normal_bleed:/lifecycleSequences/trigger/steps/0',
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_bleed_effect',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'takeCriticalDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'talent_2' },
                operator: 'greater',
                right: { kind: 'constant', value: 0.5 },
              },
              sequence(
                branch(
                  { kind: 'eventSourceTargetMatch', operator: 'equal' },
                  sequence(
                    branch(
                      {
                        kind: 'eventDamageTagsMatch',
                        match: 'hasAny',
                        tags: ['normalSkill', 'ultimateSkill', 'comboSkill'],
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage',
                          target: 'buffOwner',
                          source: 'buffSource',
                          blackboardAssignments: {
                            atk_scale: { kind: 'blackboard', key: 'extra_atk_scale' },
                            damage_cd: { kind: 'blackboard', key: 'damage_cd' },
                            heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                            burning_damage_scale: {
                              kind: 'blackboard',
                              key: 'talent2_burning_damage_scale',
                            },
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
    buff_chr_0028_wulfa_normal_bleed_crit_extra_damage: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        burning_damage_scale: 1.5,
        damage_cd: 1.5,
        damage_interval: 1,
        duration: 1.2,
        heal_scale: 0.05,
        poise: 0,
        posie: 0,
      },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            branch(
              {
                kind: 'buffStackCompare',
                target: 'buffOwner',
                tagQueryType: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellStatus/Burning'],
                operator: 'greater',
                value: { kind: 'constant', value: 0.5 },
              },
              sequence(
                step('calculateActionValue', {
                  key: 'atk_scale',
                  operation: 'multiply',
                  left: { kind: 'blackboard', key: 'atk_scale' },
                  right: { kind: 'blackboard', key: 'burning_damage_scale' },
                }),
                step('calculateActionValue', {
                  key: 'heal_scale',
                  operation: 'multiply',
                  left: { kind: 'blackboard', key: 'heal_scale' },
                  right: { kind: 'blackboard', key: 'burning_damage_scale' },
                }),
                step(
                  'dealDamage',
                  {
                    damageType: 'heat',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: [],
                    features: ['talentDamage'],
                  },
                  'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/2',
                ),
                step('heal', {
                  target: 'caster',
                  tags: [],
                  attribute: 'intellect',
                  multiplier: { kind: 'blackboard', key: 'heal_scale' },
                  addition: { kind: 'constant', value: 0 },
                }),
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0028_wulfa_talent2_heal_effect'],
                        operator: 'equal',
                        value: { kind: 'constant', value: 0 },
                      },
                      {
                        kind: 'healthCompare',
                        target: 'caster',
                        valueType: 'ratio',
                        operator: 'less',
                        value: { kind: 'constant', value: 1 },
                      },
                    ],
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0028_wulfa_talent2_heal_effect',
                      target: 'buffSource',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
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
                    damageType: 'heat',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: [],
                    features: ['talentDamage'],
                  },
                  'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage:/scheduledSequences/0/sequence/steps/0/whenFalse/steps/0',
                ),
                step('heal', {
                  target: 'caster',
                  tags: [],
                  attribute: 'intellect',
                  multiplier: { kind: 'blackboard', key: 'heal_scale' },
                  addition: { kind: 'constant', value: 0 },
                }),
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0028_wulfa_talent2_heal_effect'],
                        operator: 'equal',
                        value: { kind: 'constant', value: 0 },
                      },
                      {
                        kind: 'healthCompare',
                        target: 'caster',
                        valueType: 'ratio',
                        operator: 'less',
                        value: { kind: 'constant', value: 1 },
                      },
                    ],
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0028_wulfa_talent2_heal_effect',
                      target: 'buffSource',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                    }),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
              ),
              { alwaysNext: true },
            ),
          ),
          19,
        ),
      ],
    },
    buff_chr_0028_wulfa_normal_bleed_effect: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      timeClock: 'global',
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_cd: 1.5,
        damage_interval: 1,
        duration: 0.9,
        extra_atk_scale: 1.5,
        poise: 0,
        posie: 0,
        talent_2: 0,
      },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_normal_bleed_effect:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_normal_defup: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      timeClock: 'global',
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_cd: 1.5,
        damage_interval: 1,
        damage_up: 0.12,
        defup: -0.5,
        duration: 5,
        extra_atk_scale: 1.5,
        heal_scale: 0.2,
        poise: 0,
        posie: 0,
        talent_2: 0,
        talent2_burning_damage_scale: 1.5,
      },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'defender',
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'product',
              addition: { blackboardKey: 'defup' },
            },
          ],
        },
      ],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_normal_defup:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_normal_smarttarget: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      timeClock: 'global',
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_cd: 1.5,
        damage_interval: 1,
        duration: 2,
        extra_atk_scale: 1.5,
        poise: 0,
        posie: 0,
        talent_2: 0,
      },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_normal_smarttarget:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_normal_wolf_timer: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 3 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_powerattack_resumecombo: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 10, End_Early: 0 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_talent2_heal_effect: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0.5, interval: 0.3 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_tut_comboskill_failure: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_comboskill_failure:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_tut_comboskill_finish: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_comboskill_finish:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_tut_comboskill_success: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_comboskill_success:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_tut_normalskill_failure: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_normalskill_failure:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_tut_normalskill_success: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            repeatEachTick(
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_normalskill_success:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.1 } },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_ult_addtional_battleshape: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 2 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { critical_damage_up_to_bleed: 0.2, duration: 5 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['ultimateSkill'] },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: {
                slot: 'baseAddition',
                value: { blackboardKey: 'critical_damage_up_to_bleed' },
              },
              attributeTiming: 'runtime',
            },
          ],
        },
      ],
    },
    buff_chr_0028_wulfa_ult_stopenemy: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 4,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Status/Immobilized'],
      extendTags: [],
      blackboard: { duration: 1.5, usp_stage_1: 0.35, usp_stage_2: 0.7, usp_stage_3: 1 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_ult_stopenemy_elite: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 4,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 1.5, usp_stage_1: 0.35, usp_stage_2: 0.7, usp_stage_3: 1 },
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0028_wulfa_combo_qte_timing: {
      lifetime: { kind: 'limited', durationSeconds: 10 },
      deathReleaseDelaySeconds: 0.100000001490116,
      childSkills: {
        chr_0028_wulfa_absorb_entity_effect_1: {
          skillId: 'chr_0028_wulfa_absorb_entity_effect_1',
          blackboard: { atk_scale: 0, duration: 0 },
          scheduledSequences: [],
        },
        chr_0028_wulfa_absorb_entity_effect_2: {
          skillId: 'chr_0028_wulfa_absorb_entity_effect_2',
          blackboard: { atk_scale: 0, duration: 0 },
          scheduledSequences: [
            scheduled(
              1,
              sequence(
                step('startTimeDilation', {
                  scope: 'global',
                  durationSeconds: { kind: 'constant', value: 0.4 },
                  slot: 'unassigned',
                  priority: 50,
                  curve: {
                    kind: 'inline',
                    keys: [
                      {
                        time: -0.01169591,
                        value: 1.01995,
                        inTangent: 0,
                        outTangent: 0,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 0.251462,
                        value: 0.4,
                        inTangent: 0,
                        outTangent: 0,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 0.4853801,
                        value: 0.4,
                        inTangent: 0,
                        outTangent: 0,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 1,
                        value: 1,
                        inTangent: 0,
                        outTangent: 0,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                    ],
                  },
                  finishByAction: true,
                  ignoredTargets: [],
                }),
              ),
              16,
            ),
          ],
        },
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
