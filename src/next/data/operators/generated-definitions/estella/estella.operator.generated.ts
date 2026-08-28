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

export const estellaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0021_whiten_attack1',
    timelineBlockFrames: 13,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0021_whiten_attack1:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.08 },
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
        7,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56] },
);

export const estellaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0021_whiten_attack2',
    timelineBlockFrames: 16,
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0021_whiten_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.16 },
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
        7,
      ),
    ],
  },
  { atb: 0, atk_scale: [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68] },
);

export const estellaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0021_whiten_attack3',
    timelineBlockFrames: 28,
    costFrame: 20,
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
            'chr_0021_whiten_attack3:/scheduledSequences/0/sequence/steps/0',
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
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['normalAttack'],
            },
            'chr_0021_whiten_attack3:/scheduledSequences/1/sequence/steps/0',
          ),
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
        19,
      ),
    ],
  },
  {
    atb: 0,
    atk_scale: [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    atk_scale2: [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
    display_atk_scale: [0.35, 0.39, 0.42, 0.46, 0.49, 0.53, 0.56, 0.6, 0.63, 0.67, 0.73, 0.79],
  },
);

export const estellaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0021_whiten_attack4',
    timelineBlockFrames: 46,
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        21,
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
            'chr_0021_whiten_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.38 },
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
        22,
      ),
    ],
  },
  {
    atb: 19,
    atk_scale: [0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.77, 0.83, 0.9],
    atk_scale_2: 0,
    poise: 17,
  },
);

export const estellaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0021_whiten_power_attack',
    timelineBlockFrames: 30,
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        30,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.4 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'white_power' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        33,
      ),
      scheduled(
        30,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0021_whiten_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        39,
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
        30,
      ),
    ],
  },
  { atk_scale: [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9] },
);

export const estellaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0021_whiten_plunging_attack_end',
    timelineBlockFrames: 16,
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
            'chr_0021_whiten_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const estellaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0021_whiten_normal_skill',
    timelineBlockFrames: 46,
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
        7,
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0021_whiten_normal_skill.actionGroupData.timelineActions[8]._sequenceActionData.actionData[1].succeedActions.actionData[1]:projectile_chr_0021_whiten_normal_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0021_whiten_normal_skill.actionGroupData.timelineActions[8]._sequenceActionData.actionData[1].succeedActions.actionData[1]:chr_0021_whiten_normal_skill_projhit',
                    { atk_scale: 0, dmg_up: 0, poise: 30, up_atk_scale: 0 },
                    true,
                    sequence(
                      step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'EntityBB_first_hit' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'EntityBB_first_hit',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                          step('modifyActionValue', {
                            key: 'up_atk_scale',
                            operation: 'assign',
                            value: { kind: 'blackboard', key: 'atk_scale' },
                          }),
                          step(
                            'dealDamage',
                            {
                              damageType: 'cryo',
                              attackScale: { kind: 'blackboard', key: 'up_atk_scale' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              instantDamageScaleModifiers: [
                                {
                                  side: 'attacker',
                                  zone: 'normal',
                                  addition: { kind: 'blackboard', key: 'dmg_up' },
                                },
                              ],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            },
                            'chr_0021_whiten_normal_skill:/scheduledSequences/2/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/1/whenTrue/steps/2',
                          ),
                          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.05 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
                            finishByAction: false,
                            targets: ['enemy', 'caster'],
                          }),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'cryo',
                              attackScale: { kind: 'blackboard', key: 'atk_scale' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            },
                            'chr_0021_whiten_normal_skill:/scheduledSequences/2/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/1/whenFalse/steps/0',
                          ),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                    undefined,
                    { lifetime: 'execution', alwaysNext: true },
                  ),
                ),
                { EntityBB_first_hit: 0 },
                { lifetime: 'execution' },
              ),
            ),
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0021_whiten_normal_skill.actionGroupData.timelineActions[8]._sequenceActionData.actionData[1].failActions.actionData[1]:projectile_chr_0021_whiten_normal_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0021_whiten_normal_skill.actionGroupData.timelineActions[8]._sequenceActionData.actionData[1].failActions.actionData[1]:chr_0021_whiten_normal_skill_projhit',
                    { atk_scale: 0, dmg_up: 0, poise: 30, up_atk_scale: 0 },
                    true,
                    sequence(
                      step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'EntityBB_first_hit' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'EntityBB_first_hit',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                          step('modifyActionValue', {
                            key: 'up_atk_scale',
                            operation: 'assign',
                            value: { kind: 'blackboard', key: 'atk_scale' },
                          }),
                          step(
                            'dealDamage',
                            {
                              damageType: 'cryo',
                              attackScale: { kind: 'blackboard', key: 'up_atk_scale' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              instantDamageScaleModifiers: [
                                {
                                  side: 'attacker',
                                  zone: 'normal',
                                  addition: { kind: 'blackboard', key: 'dmg_up' },
                                },
                              ],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            },
                            'chr_0021_whiten_normal_skill:/scheduledSequences/2/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/1/whenTrue/steps/2',
                          ),
                          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                          step('startTimeDilation', {
                            scope: 'entity',
                            durationSeconds: { kind: 'constant', value: 0.05 },
                            slot: 'TimeDilation/Layer/Entity/HitStop',
                            priority: 10,
                            curve: { kind: 'named', key: 'char_hard_stop' },
                            finishByAction: false,
                            targets: ['enemy', 'caster'],
                          }),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'cryo',
                              attackScale: { kind: 'blackboard', key: 'atk_scale' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            },
                            'chr_0021_whiten_normal_skill:/scheduledSequences/2/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/1/whenFalse/steps/0',
                          ),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                    undefined,
                    { lifetime: 'execution', alwaysNext: true },
                  ),
                ),
                { EntityBB_first_hit: 0 },
                { lifetime: 'execution' },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        24,
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0021_whiten_talent_0_active'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0021_whiten_talent_0_active'] },
                desiredKey: 'atb',
                outputKey: 'atb',
              }),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'refund',
                spGainSource: 'default',
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0021_whiten_talent_0_active'],
                reason: 'other',
              }),
            ),
          ),
        ),
        24,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
  },
  {
    atb: 0,
    atk_scale: [1.56, 1.71, 1.87, 2.02, 2.18, 2.34, 2.49, 2.65, 2.8, 3, 3.23, 3.5],
    blow_off_distance: 2,
    cam_angle: 0,
    cam_duration: 0,
    distance: 8,
    distance_random_range: 0.2,
    dmg_up: 0,
    input_angle: 0,
    poise: 10,
    select_radius: 7,
    trigger: 0,
  },
);

export const estellaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0021_whiten_ultimate_skill',
    timelineBlockFrames: 60,
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
        54,
      ),
      scheduled(
        54,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/Common/Affixes/Vulnerable/VulnerablePhysic'],
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
                duration: { kind: 'constant', value: 0 },
                height: { kind: 'constant', value: 0 },
                speedFactorMultiplier: 1,
                force: true,
                targetFilter: 'aliveOnly',
                returnWhen: 'always',
              }),
            ),
          ),
          step('modifyActionValue', {
            key: 'atk_scale_total',
            operation: 'add',
            value: { kind: 'blackboard', key: 'atk_scale' },
          }),
          step('modifyActionValue', {
            key: 'atk_scale_total',
            operation: 'add',
            value: { kind: 'blackboard', key: 'dmg_up_total' },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_total' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0021_whiten_ultimate_skill:/scheduledSequences/2/sequence/steps/3',
          ),
        ),
        57,
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
        77,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 70 }],
  },
  {
    atk_scale: [4.89, 5.38, 5.86, 6.35, 6.84, 7.33, 7.82, 8.31, 8.8, 9.41, 10.14, 11],
    atk_scale_total: 0,
    dmg_up: 0.5,
    dmg_up_total: 0,
    poise: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
    radius: 5,
  },
);

export const estellaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0021_whiten_combo_skill',
    timelineBlockFrames: 20,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/Common/SpellStatus/Frozen'],
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'has_potential1' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'duration',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'rate_plus' },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0021_whiten_combo_skill_physical_vulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration' },
                      rate: { kind: 'blackboard', key: 'rate' },
                    },
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
                    duration: { kind: 'constant', value: 0 },
                    height: { kind: 'constant', value: 0 },
                    speedFactorMultiplier: 1,
                    force: true,
                    targetFilter: 'aliveOnly',
                    returnWhen: 'always',
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                      tags: ['comboSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0021_whiten_combo_skill:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/0/whenTrue/steps/3',
                  ),
                ),
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0021_whiten_combo_skill_physical_vulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      duration: { kind: 'blackboard', key: 'duration' },
                      rate: { kind: 'blackboard', key: 'rate' },
                    },
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
                    duration: { kind: 'constant', value: 0 },
                    height: { kind: 'constant', value: 0 },
                    speedFactorMultiplier: 1,
                    force: true,
                    targetFilter: 'aliveOnly',
                    returnWhen: 'always',
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                      tags: ['comboSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0021_whiten_combo_skill:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/0/whenFalse/steps/2',
                  ),
                ),
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
                duration: { kind: 'constant', value: 0 },
                height: { kind: 'constant', value: 0 },
                speedFactorMultiplier: 1,
                force: true,
                targetFilter: 'aliveOnly',
                returnWhen: 'always',
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0021_whiten_combo_skill:/scheduledSequences/0/sequence/steps/0/whenFalse/steps/1',
              ),
            ),
            { alwaysNext: true },
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
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
        34,
      ),
      scheduled(
        19,
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
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.4 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'whiten_combo' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.3 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'whiten_combo' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        22,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.6 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        15,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
  },
  {
    atk_scale: [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    atk_scale2: [2.8, 3.08, 3.36, 3.64, 3.92, 4.2, 4.48, 4.76, 5.04, 5.39, 5.81, 6.3],
    cam_angle: 0,
    cam_duration: 0,
    cd_reduction: 0,
    count: 0,
    duration: 6,
    has_potential1: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    rate: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.15, 0.15, 0.15],
    rate_plus: -0.1,
    usp: 10,
  },
);

export const commonBuffDefinitions = {
  buff_common_affixes_vulnerable_physical: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTags: [
      'Skill/Character/Common/Affixes/Vulnerable',
      'Skill/Character/Common/Affixes/Vulnerable/VulnerablePhysic',
    ],
    extendTags: [],
    blackboard: {
      child_buff_id: 'buff_common_affixes_vulnerable_physical_default_child',
      duration: 0.8,
      rate: 0.2,
    },
    attributeModifiers: [
      {
        attribute: 'physicalVulnerabilityIncrease',
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
  buff_common_affixes_vulnerable_physical_default_child: {
    stackingType: 'unlimited',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    presentation: {
      visible: true,
      iconId: 'icon_battle_affix_physical_vulnerable',
      iconPath: '/icons/icon_battle_affix_physical_vulnerable.webp',
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
  slug: 'estella',
  gameId: 'ESTELLA',
  rarity: 4,
  weaponType: 'polearm',
  element: 'cryo',
  role: 'guard',
  mainAttribute: 'will',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [13, 32, 53, 73, 94, 104],
    agility: [8, 27, 47, 67, 87, 97],
    intellect: [14, 34, 56, 78, 99, 110],
    will: [15, 44, 74, 105, 136, 151],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [estellaBasicAttack1, estellaBasicAttack2, estellaBasicAttack3, estellaBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: estellaFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: estellaPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: estellaBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: estellaUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: estellaComboSkill,
    },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0021_whiten_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { atb: [7.5, 15] },
        }),
      ),
    },
    {
      key: 'talent2',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0021_whiten_talent_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { dmg_down: [-0.1, -0.2] },
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
          skillGroupKey: 'comboSkill',
          blackboardKey: 'has_potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'rate_plus',
          operation: 'assign',
          value: 3,
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
          blackboardKey: 'distance',
          operation: 'assign',
          value: 12,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'dmg_up',
          operation: 'assign',
          value: 0.4,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['will'], value: 10 },
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 10 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0021_whiten_potential_5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { usp: { kind: 'constant', value: 5 } },
        }),
      ),
    },
  ],
  buffDefinitions: {
    buff_chr_0021_whiten_combo_skill_physical_vulnerable: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 3, rate: -0.3 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_physical',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
          }),
        ),
      },
    },
    buff_chr_0021_whiten_potential_5: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { cd: 1, usp: 5 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0021_whiten_potential_5_inaura',
            target: 'enemy',
            finishByAction: true,
            blackboardAssignments: {
              usp: { kind: 'blackboard', key: 'usp' },
              cd: { kind: 'blackboard', key: 'cd' },
            },
          }),
        ),
      },
    },
    buff_chr_0021_whiten_potential_5_inaura: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { cd: 1, usp: 5 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'addedBuff',
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
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'caster',
                      markerId: 'buff_chr_0021_whiten_potential_5_cd',
                    },
                  },
                  sequence(
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'buff_chr_0021_whiten_potential_5_cd',
                      durationSeconds: { kind: 'blackboard', key: 'cd' },
                      autoFinishByAction: false,
                    }),
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'usp' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'caster',
                    }),
                  ),
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0021_whiten_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atb: 5 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffTagsMatch',
                match: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellStatusSpecial/Shatter'],
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0021_whiten_talent_0_active',
                  target: 'caster',
                  source: 'eventSource',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: { atb: { kind: 'blackboard', key: 'atb' } },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0021_whiten_talent_0_active: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atb: 5 },
      attributeModifiers: [],
    },
    buff_chr_0021_whiten_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: ['Immune/SpellInflictOnChar/CrystInflictOnChar'],
      extendTags: [],
      blackboard: { dmg_down: -0.2 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: { kind: 'eventDamageTypesMatch', damageTypes: ['cryo'] },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'product',
              addition: { blackboardKey: 'dmg_down' },
            },
          ],
        },
      ],
    },
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
