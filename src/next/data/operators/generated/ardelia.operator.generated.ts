/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, forEachContextTarget, percentages, scheduled, sequence, step, withActionBlackboardScope, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const ardeliaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0025_ardelia_attack1',
    timelineBlockFrames: 11,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([30, 33, 36, 39, 42, 45, 48, 51, 54, 58, 62, 68]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile24:chr_0025_ardelia_attack132:chr_0025_ardelia_attack1_projhit11:actionOrder1:31:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack1_projhit:3',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const ardeliaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0025_ardelia_attack2',
    timelineBlockFrames: 20,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile24:chr_0025_ardelia_attack232:chr_0025_ardelia_attack1_projhit11:actionOrder2:101:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack1_projhit:10',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile24:chr_0025_ardelia_attack232:chr_0025_ardelia_attack1_projhit11:actionOrder2:111:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack1_projhit:11',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
    'atk_scale_display': [0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.77, 0.83, 0.9],
  },
);

export const ardeliaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0025_ardelia_attack3',
    timelineBlockFrames: 45,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder1:61:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:6',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder1:91:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:9',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:121:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:12',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:151:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:15',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:181:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:18',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:211:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:21',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:241:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:24',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        25,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:271:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:27',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:301:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:30',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        29,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:331:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:33',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        31,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:361:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:36',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        33,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:391:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:39',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        35,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:421:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:42',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        37,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:451:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:45',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        39,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile24:chr_0025_ardelia_attack332:chr_0025_ardelia_attack3_projhit11:actionOrder2:481:0'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_attack3_projhit:48',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.04, 0.04, 0.04, 0.05, 0.05, 0.05, 0.06, 0.06, 0.06, 0.07, 0.07, 0.08],
    'atk_scale_display': [0.53, 0.58, 0.63, 0.68, 0.74, 0.79, 0.84, 0.89, 0.95, 1.01, 1.09, 1.18],
  },
);

export const ardeliaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0025_ardelia_attack4',
    timelineBlockFrames: 50,
    scheduledSequences: [
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
  },
  {
    'atb': 18,
    'atk_scale': [0.55, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.94, 0.99, 1.06, 1.14, 1.24],
    'poise': 18,
  },
);

export const ardeliaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0025_ardelia_power_attack',
    timelineBlockFrames: 57,
    scheduledSequences: [
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
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct29:chr_0025_ardelia_power_attack11:actionOrder1:7'),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:02:10'),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:12:10'),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:22:10'),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:32:10'),
        ),
      ),
      scheduled(
        34,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:42:10'),
        ),
      ),
      scheduled(
        37,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:52:10'),
        ),
      ),
      scheduled(
        40,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:62:10'),
        ),
      ),
      scheduled(
        44,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:72:10'),
        ),
      ),
      scheduled(
        47,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:82:10'),
        ),
      ),
      scheduled(
        50,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:91:92:10'),
        ),
      ),
      scheduled(
        53,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher12:rootInterval29:chr_0025_ardelia_power_attack11:actionOrder1:92:102:10'),
        ),
      ),
      scheduled(
        57,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.4,
          }, '8:finisher6:direct29:chr_0025_ardelia_power_attack11:actionOrder2:13'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const ardeliaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0025_ardelia_plunging_attack_end',
    timelineBlockFrames: 23,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'Sheep', abilityEntityIds: ['abilityentity_chr_0025_ardelia_air_attack'] }),
          forEachContextTarget(
            'Sheep',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0025_ardelia_air_attack_end',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct36:chr_0025_ardelia_plunging_attack_end11:actionOrder1:5'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const ardeliaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0025_ardelia_normal_skill',
    timelineBlockFrames: 47,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0025_ardelia_normal_skill',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
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
        32,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0025_ardelia_normal_skill_kill_sheep'],
            reason: 'other',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0025_ardelia_normal_skill_vulnerable',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration_vul' },
              'rate': { kind: 'blackboard', key: 'rate_vul_base' },
            },
          }),
          step('createTimedMarker', {
            target: 'caster',
            markerId: 'talent1_mark',
            durationSeconds: { kind: 'constant', value: 1 },
            autoFinishByAction: false,
          }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([142, 156, 171, 185, 199, 213, 228, 242, 256, 274, 295, 320]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill11:conditional19:timelineActions[21]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[2]11:actionOrder2:44'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        188,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
      scheduled(
        189,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0025_ardelia_normal_skill',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
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
      scheduled(
        221,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0025_ardelia_normal_skill_kill_sheep'],
            reason: 'other',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0025_ardelia_normal_skill_vulnerable',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration_vul' },
              'rate': { kind: 'blackboard', key: 'rate_vul_base' },
            },
          }),
          step('createTimedMarker', {
            target: 'caster',
            markerId: 'talent1_mark',
            durationSeconds: { kind: 'constant', value: 1 },
            autoFinishByAction: false,
          }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([142, 156, 171, 185, 199, 213, 228, 242, 256, 274, 295, 320]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill11:conditional19:timelineActions[22]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[2]11:actionOrder2:58'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [1.42, 1.56, 1.71, 1.85, 1.99, 2.13, 2.28, 2.42, 2.56, 2.74, 2.95, 3.2],
    'duration_vul': 30,
    'poise': 10,
    'rate_vul_base': [0.12, 0.12, 0.12, 0.13, 0.13, 0.13, 0.14, 0.14, 0.16, 0.17, 0.18, 0.2],
    'rate_vul_max': [0.36, 0.36, 0.36, 0.37, 0.37, 0.37, 0.38, 0.38, 0.4, 0.41, 0.42, 0.4],
  },
);

export const ardeliaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0025_ardelia_combo_skill',
    timelineBlockFrames: 23,
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0025_ardelia_combo_skill',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.8 },
            slot: "unassigned",
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
      scheduled(
        20,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_combo_skill_projhit:18.0',
            { atk_scale: 0, atk_scale_boom: 0, duration_corrupt: 0, potential3: 0, potential5_dmg_rate: 0, potential5_duration: 0, usp: 0 },
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
                  step('dealDamage', {
                    damageType: 'nature',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                  }, '10:comboSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[2]11:actionOrder1:4'),
                  branch(
                    { kind: 'singleEnemyPresent' },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
                        recipient: 'caster',
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                sequence(
                  step('dealDamage', {
                    damageType: 'nature',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                  }, '10:comboSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:10'),
                  branch(
                    { kind: 'singleEnemyPresent' },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
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
          ),
        ),
      ),
      scheduled(
        72,
        sequence(
          step('calculateActionValue', {
            key: 'duration_corrupt_final',
            operation: 'add',
            left: { kind: 'blackboard', key: 'duration_corrupt' },
            right: { kind: 'blackboard', key: 'potential5_duration' },
          }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: { kind: 'blackboard', key: 'atk_scale_boom' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill13:abilityEntity28:chr_0025_ardelia_combo_skill36:chr_0025_ardelia_combo_skill_projhit33:chr_0025_ardelia_combo_skill_bomb11:actionOrder2:181:02:161:4'),
          step('modifyActionValue', {
            key: 'atk_scale_boom',
            operation: 'multiply',
            value: { kind: 'constant', value: 0.5 },
          }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: { kind: 'blackboard', key: 'atk_scale_boom' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill13:abilityEntity28:chr_0025_ardelia_combo_skill36:chr_0025_ardelia_combo_skill_projhit33:chr_0025_ardelia_combo_skill_bomb11:actionOrder2:181:02:161:7'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.45, 0.49, 0.54, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.93, 1],
    'atk_scale_boom': [1.11, 1.22, 1.33, 1.44, 1.55, 1.67, 1.78, 1.89, 2, 2.14, 2.3, 2.5],
    'duration_corrupt': 7,
    'poise': 10,
    'usp': 10,
    'potential5_dmg_rate': 0,
    'potential5_duration': 0,
  },
);

export const ardeliaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0025_ardelia_ultimate_skill',
    timelineBlockFrames: 209,
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: "TimeDilation/Layer/Entity/HitStop",
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
      scheduled(
        81,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        81,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        83,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        83,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        86,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        86,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        89,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        89,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        92,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        92,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        95,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        95,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        98,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        98,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        101,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        101,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        104,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        104,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        107,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        107,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        110,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        110,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        113,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        113,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        116,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        116,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        119,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        119,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        122,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        122,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        126,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        126,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        129,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        129,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        132,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        132,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        135,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        135,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        138,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        138,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        141,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        141,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        144,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        144,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        147,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        147,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        150,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        150,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        153,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        153,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        156,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        156,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        159,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        159,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        162,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        162,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        165,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        165,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        168,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        168,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
        171,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        171,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        174,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        174,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        177,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        177,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        180,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        180,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        183,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        183,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        186,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        186,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        189,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        189,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        192,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        192,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        195,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        195,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        198,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        198,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        201,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:161:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:16',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
      scheduled(
        201,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([73, 81, 88, 95, 103, 110, 117, 125, 132, 141, 152, 165]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
          }, '8:ultimate10:projectile31:chr_0025_ardelia_ultimate_skill45:chr_0025_ardelia_ultimate_skill_sheep_projhit11:actionOrder2:191:5'),
          withActionBlackboardScope(
            'projectile:chr_0025_ardelia_ultimate_skill_sheep_projhit:19',
            { atk_scale: 0, effect_prob: 0, heal_scale: 0, heal_value: 0, interval: 0, poise: 0, potential3_rate: 0, random_phy: 0, random_spe: 0 },
            true,
            sequence(
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
    ],
  },
  {
    'atk_scale': [0.73, 0.81, 0.88, 0.95, 1.03, 1.1, 1.17, 1.25, 1.32, 1.41, 1.52, 1.65],
    'duration': 3,
    'effect_prob': 0.1,
    'interval': 0.3,
    'poise': [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
    'potential3_duration': 0,
  },
);

export const ardeliaGeneratedOperator: OperatorDefinition = {
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
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [ardeliaBasicAttack1, ardeliaBasicAttack2, ardeliaBasicAttack3, ardeliaBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: ardeliaFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: ardeliaPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: ardeliaBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: ardeliaComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: ardeliaUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0025_ardelia_attack4_kill_sheep': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      lifecycleSequences: {
        finish: sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'attack4_sheep', abilityEntityIds: ['abilityentity_chr_0025_ardelia_attack4', 'abilityentity_chr_0025_ardelia_attack4_end', 'abilityentity_chr_0025_ardelia_attack4_low'] }),
        ),
      },
    },
    'buff_chr_0025_ardelia_air_attack_end': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.1,
    },
    'buff_chr_0025_ardelia_normal_skill_kill_sheep': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      lifecycleSequences: {
        finish: sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'normal_skill_sheep', abilityEntityIds: ['abilityentity_chr_0025_ardelia_normal_skill'] }),
        ),
      },
    },
    'buff_chr_0025_ardelia_normal_skill_vulnerable': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 7,
        'rate': 0,
      },
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['heat', 'electric', 'cryo', 'nature'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'vulnerable',
              addition: { blackboardKey: 'rate' },
            },
          ],
        },
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['physical'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'vulnerable',
              addition: { blackboardKey: 'rate' },
            },
          ],
        },
      ],
    },
    'buff_chr_0025_ardelia_combo_skill_kill_sheep': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      lifecycleSequences: {
        finish: sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'combo_skill_sheep', abilityEntityIds: ['abilityentity_chr_0025_ardelia_combo_skill'] }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0025_ardelia_normal_skill': { lifetime: { kind: 'limited', durationSeconds: 5 }, childSkill: {
        skillId: 'chr_0025_ardelia_normal_skill_sheep',
        blackboard: {
          'atb': 0,
          'atk_scale': 0,
        },
        scheduledSequences: [
          scheduled(
            31,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0025_ardelia_combo_skill': { lifetime: { kind: 'limited', durationSeconds: 5 }, childSkill: {
        skillId: 'chr_0025_ardelia_combo_skill_sheep',
        blackboard: {
          'atb': 0,
          'atk_scale': 0,
        },
        scheduledSequences: [
          scheduled(
            66,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
  },
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
          value: [0.38, 0.53, 0.75],
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
          value: [0.38, 0.53, 0.75],
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
          value: [0.1, 0.1, 0.1],
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
          value: [1],
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
          value: 0.08,
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
          value: 1.2,
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
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -60,
        },
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
          value: 1.2,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
