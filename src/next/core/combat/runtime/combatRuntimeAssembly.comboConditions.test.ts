import { describe, expect, it, vi } from 'vitest';
import type {
  CompiledComboSkillConditionProgram,
  CompiledSkillProgram,
  ResolvedCombatStep,
} from '../../compiler/combatProgram';
import { CombatRuntimeAssembly, type CombatRuntimeAssemblyOptions } from './combatRuntimeAssembly';
import {
  ComboSkillConditionRuntime,
  type PendingComboCondition,
} from './comboSkillConditionRuntime';

const condition: CompiledComboSkillConditionProgram = {
  key: 'saved-element',
  skillGroupKey: 'combo',
  event: 'beforeTakeInfliction',
  initialValues: { local: 0, label: 'condition' },
  sequence: {
    steps: [
      {
        kind: 'modifyActionValue',
        parameters: { key: 'local', operation: 'add', value: { kind: 'constant', value: 1 } },
      },
    ],
  },
};

function combo(skillId = 'combo'): CompiledSkillProgram {
  return {
    operatorId: 'owner',
    skillGroupKey: 'combo',
    skillId,
    skillType: 'comboSkill',
    skillLevel: 1,
    initialBlackboard: {},
    costs: [],
    cooldownFrames: 300,
    costFrame: 6,
    timelineBlockFrames: 60,
    timelineActions: [{ startFrame: 60, sequence: { steps: [] } }],
  };
}
function action(skillId: string, steps: readonly ResolvedCombatStep[]): CompiledSkillProgram {
  return {
    ...combo(skillId),
    skillGroupKey: skillId,
    skillType: 'battleSkill',
    cooldownFrames: undefined,
    costFrame: undefined,
    timelineActions: [{ startFrame: 0, sequence: { steps } }],
  };
}
function setup() {
  const hub = new ComboSkillConditionRuntime();
  const eligibility = { isAlive: vi.fn(() => true), isSilenced: vi.fn(() => false) };
  const pending: PendingComboCondition[] = [];
  const owner = {
    operatorId: 'owner',
    skills: [combo()],
    skillSlotGroups: [
      { skillGroupKey: 'combo', baseSkillKey: 'combo', replacementSkillKeys: [] as string[] },
    ],
    comboConditionPrograms: [condition],
  };
  const options: CombatRuntimeAssemblyOptions = {
    enemy: {
      source: { kind: 'custom', level: 1 },
      rank: 'mob',
      health: 100,
      superArmor: 0,
      defenderAttributes: {
        defense: 0,
        shelterDamageMultiplier: 0,
        breakingAttackDamageTakenMultiplier: 1,
        resistances: {
          physical: { percent: 0, damageTakenMultiplier: 1 },
          heat: { percent: 0, damageTakenMultiplier: 1 },
          electric: { percent: 0, damageTakenMultiplier: 1 },
          cryo: { percent: 0, damageTakenMultiplier: 1 },
          nature: { percent: 0, damageTakenMultiplier: 1 },
          ether: { percent: 0, damageTakenMultiplier: 1 },
        },
      },
      stagger: {
        maximum: 100,
        knotThresholds: [],
        knotBreakDurationFrames: 0,
        brokenDurationFrames: 0,
        finisherSpRecovery: 0,
      },
    },
    resources: {
      sp: 0,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: false,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [
        {
          operatorId: 'owner',
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          allowedUltimateEnergyRecoveryTagIds: null,
        },
      ],
    },
    enemyBuffRuntime: {
      ownerId: 'enemy',
      advanceFrame: () => {},
      getCountByIds: () => 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => {} }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    },
    operators: [owner],
    createOperationExecutor: () => ({
      execute: () => {
        throw new Error('unexpected operation');
      },
      evaluate: () => {
        throw new Error('unexpected condition');
      },
    }),
    registerComboSkillCondition: registration => hub.registerPendingCondition(registration),
    comboConditionEligibility: eligibility,
    onPendingComboCondition: (operatorId, program, value) => {
      expect(operatorId).toBe('owner');
      expect(program.key).toBe('saved-element');
      pending.push(value);
    },
  };
  const emit = (sourceId = 'owner', targetId = 'enemy') =>
    hub.onAbilityEvent({
      event: 'beforeTakeInfliction',
      payload: { sourceId, targetId, skillId: 'attachment', element: 'nature', isExtra: false },
    });
  return { hub, eligibility, pending, owner, options, emit };
}

describe('assembly 原生常驻连携条件', () => {
  it('未放置任何连携时安装静态账本和条件，不创建可施放的空技能', () => {
    const f = setup();
    f.owner.skills = [];
    const assembly = new CombatRuntimeAssembly({
      ...f.options,
      operators: [{ ...f.owner, skillCooldownPrograms: [combo()] }],
    });
    f.emit();
    expect(f.pending).toHaveLength(1);
    expect(() => assembly.tryStartSkill('owner', 'combo')).toThrow();
    assembly.simulation.advanceFrames(10);
    expect(assembly.receipt.entries.some(entry => entry.event === 'SkillStarted')).toBe(false);
  });

  it('未放置连携的开局冷却修改生效，逐帧恢复仍参与条件门禁', () => {
    const f = setup();
    f.owner.skills = [];
    const assembly = new CombatRuntimeAssembly({
      ...f.options,
      operators: [
        {
          ...f.owner,
          skillCooldownPrograms: [combo()],
          initializationPrograms: [
            {
              key: 'cooldown',
              sequence: {
                steps: [
                  {
                    kind: 'adjustSkillCooldown',
                    parameters: {
                      target: 'caster',
                      skill: { kind: 'type', skillType: 'comboSkill' },
                      operation: 'set',
                      basis: 'baseDurationRatio',
                      value: { kind: 'constant', value: 1 },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    f.emit();
    expect(f.pending).toHaveLength(1);
    assembly.simulation.advanceFrames(6);
    f.emit();
    expect(f.pending).toHaveLength(1);
    assembly.simulation.advanceFrames(294);
    f.emit();
    expect(f.pending).toHaveLength(2);
    const ready = assembly.receipt.entries.filter(entry => entry.event === 'SkillCooldownReady');
    expect(ready).toHaveLength(1);
    expect(ready[0]?.data).toEqual({ skillId: 'combo' });
  });

  it.each(['baseDurationRatio', 'absoluteSeconds'] as const)(
    '未放置技能按来源 ID 减冷却，支持 %s',
    basis => {
      const f = setup();
      f.owner.skills = [
        action('reduce', [
          {
            kind: 'adjustSkillCooldown',
            parameters: {
              target: 'caster',
              skill: { kind: 'id', skillId: 'native-combo' },
              operation: 'reduce',
              basis,
              value: { kind: 'constant', value: basis === 'baseDurationRatio' ? 0.5 : 5 },
            },
          },
        ]),
      ];
      const assembly = new CombatRuntimeAssembly({
        ...f.options,
        operators: [
          {
            ...f.owner,
            skillCooldownPrograms: [{ ...combo(), sourceSkillId: 'native-combo' }],
            initializationPrograms: [
              {
                key: 'set',
                sequence: {
                  steps: [
                    {
                      kind: 'adjustSkillCooldown',
                      parameters: {
                        target: 'caster',
                        skill: { kind: 'type', skillType: 'comboSkill' },
                        operation: 'set',
                        basis: 'absoluteSeconds',
                        value: { kind: 'constant', value: 5 },
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      });
      f.emit();
      expect(f.pending).toHaveLength(0);
      assembly.tryStartSkill('owner', 'reduce');
      f.emit();
      expect(f.pending).toHaveLength(1);
    },
  );

  it('基础连携和变体都未放置时仍可切换槽位并继承归一化冷却', () => {
    const f = setup();
    f.owner.skillSlotGroups[0]!.replacementSkillKeys.push('variant');
    f.owner.skills = [
      action('switch', [
        {
          kind: 'changeSkillSlot',
          parameters: {
            skillGroupKey: 'combo',
            targetSkillKey: 'variant',
            inheritOriginSkillCooldownProgress: true,
          },
        },
      ]),
    ];
    const assembly = new CombatRuntimeAssembly({
      ...f.options,
      operators: [
        {
          ...f.owner,
          skillCooldownPrograms: [combo(), { ...combo('variant'), cooldownFrames: 600 }],
          initializationPrograms: [
            {
              key: 'set',
              sequence: {
                steps: [
                  {
                    kind: 'adjustSkillCooldown',
                    parameters: {
                      target: 'caster',
                      skill: { kind: 'id', skillId: 'combo' },
                      operation: 'set',
                      basis: 'baseDurationRatio',
                      value: { kind: 'constant', value: 0.5 },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });
    assembly.tryStartSkill('owner', 'switch');
    f.emit();
    expect(f.pending).toHaveLength(0);
    assembly.simulation.advanceFrames(299);
    f.emit();
    expect(f.pending).toHaveLength(0);
    assembly.simulation.advanceFrame();
    f.emit();
    expect(f.pending).toHaveLength(1);
  });

  it('静态目录与重复放置共享一次推进，自定义块的实际冷却覆盖模板默认', () => {
    const f = setup();
    f.owner.skills = ['a', 'b'].map(castId => ({ ...combo(), castId, cooldownFrames: 600 }));
    const assembly = new CombatRuntimeAssembly({
      ...f.options,
      operators: [{ ...f.owner, skillCooldownPrograms: [combo()] }],
    });
    assembly.tryStartSkill('owner', 'combo', 'a');
    assembly.simulation.advanceFrames(5);
    f.emit();
    expect(f.pending).toHaveLength(1);
    assembly.simulation.advanceFrame();
    f.emit();
    expect(f.pending).toHaveLength(1);
    assembly.simulation.advanceFrames(593);
    f.emit();
    expect(f.pending).toHaveLength(1);
    assembly.simulation.advanceFrame();
    f.emit();
    expect(f.pending).toHaveLength(2);
    expect(
      assembly.receipt.entries.filter(entry => entry.event === 'SkillCooldownReady'),
    ).toHaveLength(1);
  });

  it('不同自定义来源 ID 指向同一共享账本，不会漏掉后一个块的冷却修改', () => {
    const f = setup();
    f.owner.skills = ['a', 'b'].map(castId => ({
      ...combo(),
      castId,
      sourceSkillId: `source-${castId}`,
    }));
    f.owner.skills.push(
      action('reset', [
        {
          kind: 'adjustSkillCooldown',
          parameters: {
            target: 'caster',
            skill: { kind: 'id', skillId: 'source-b' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 0 },
          },
        },
      ]),
    );
    const assembly = new CombatRuntimeAssembly(f.options);
    assembly.tryStartSkill('owner', 'combo', 'a');
    assembly.simulation.advanceFrames(6);
    f.emit();
    expect(f.pending).toHaveLength(0);
    assembly.tryStartSkill('owner', 'reset');
    f.emit();
    expect(f.pending).toHaveLength(1);
  });

  it('静态目录重复或属于别的角色时明确失败', () => {
    const f = setup();
    expect(
      () =>
        new CombatRuntimeAssembly({
          ...f.options,
          operators: [{ ...f.owner, skillCooldownPrograms: [combo(), combo()] }],
        }),
    ).toThrow('duplicate static cooldown');
    expect(
      () =>
        new CombatRuntimeAssembly({
          ...f.options,
          operators: [{ ...f.owner, skillCooldownPrograms: [{ ...combo(), operatorId: 'other' }] }],
        }),
    ).toThrow('belongs to another operator');
  });

  it('门禁沿用真实冷却时钟，不从时间轴现实帧另算一份', () => {
    const f = setup();
    const assembly = new CombatRuntimeAssembly({
      ...f.options,
      timeDilation: { config: {}, timeManagerDeltaMode: 2 },
    });
    assembly.timeDilation!.startGlobal({
      durationSeconds: 10,
      slot: 1,
      priority: 1,
      constantScale: 0.5,
      influenceSkillCooldownSeconds: 10,
    });
    assembly.tryStartSkill('owner', 'combo');
    assembly.simulation.advanceFrames(11);
    f.emit();
    expect(f.pending).toHaveLength(1);
    assembly.simulation.advanceFrame();
    f.emit();
    expect(f.pending).toHaveLength(1);
  });

  it('没有 Buff runtime 时也与技能共享唯一实体板，而非为每条条件新建实体初值', () => {
    const f = setup();
    f.owner.comboConditionPrograms[0] = {
      ...condition,
      sequence: {
        steps: [
          {
            kind: 'modifyActionValue',
            parameters: {
              key: 'local',
              operation: 'add',
              value: { kind: 'blackboard', key: 'EntityBB_value' },
            },
          },
        ],
      },
    };
    f.owner.skills.push(
      action('write', [
        {
          kind: 'modifyActionValue',
          parameters: {
            key: 'EntityBB_value',
            operation: 'add',
            value: { kind: 'constant', value: 7 },
          },
        },
      ]),
    );
    const assembly = new CombatRuntimeAssembly({
      ...f.options,
      operators: [{ ...f.owner, initialEntityBlackboard: { EntityBB_value: 3 } }],
    });
    f.emit();
    expect(f.pending.at(-1)?.assignPairs?.local).toBe(3);
    assembly.tryStartSkill('owner', 'write');
    f.emit();
    expect(f.pending.at(-1)?.assignPairs?.local).toBe(13);
  });

  it.each<CompiledComboSkillConditionProgram['initialValues']>([
    null,
    {},
    { label: 'local', empty: null },
  ])('条件初值 %j 原样进入 Pending，仅复制 direct 板', initialValues => {
    const f = setup();
    f.owner.comboConditionPrograms[0] = { ...condition, initialValues, sequence: { steps: [] } };
    new CombatRuntimeAssembly({
      ...f.options,
      operators: [{ ...f.owner, initialEntityBlackboard: { EntityBB_hidden: 7 } }],
    });
    f.emit();
    expect(f.pending[0]?.assignPairs).toEqual(initialValues);
  });

  it('活动能力实体保持自己的输入身份，到期后不把失效句柄当成来源干员', () => {
    const f = setup();
    const assembly = new CombatRuntimeAssembly(f.options);
    const target = assembly.abilityEntities.spawn({
      abilityEntityId: 'fixture',
      ownerId: 'owner',
      source: { kind: 'operator', operatorId: 'owner' },
      definition: { lifetime: { kind: 'infinite' } },
    });
    if (target.kind !== 'abilityEntity') throw new Error('invalid fixture');
    f.emit(`ability-entity:${target.instanceId}`);
    expect(f.pending[0]?.inputTarget).toEqual(target);
    assembly.abilityEntities.finish(target);
    expect(() => f.emit(`ability-entity:${target.instanceId}`)).toThrow(
      'unknown or inactive entity',
    );
  });

  it('真实单充能账本：startCdFrame 前放行，等于和之后拒绝，就绪再放行', () => {
    const f = setup();
    const assembly = new CombatRuntimeAssembly(f.options);
    f.emit();
    expect(assembly.tryStartSkill('owner', 'combo')).toBe(true);
    assembly.simulation.advanceFrames(5);
    f.emit();
    assembly.simulation.advanceFrame();
    f.emit();
    assembly.simulation.advanceFrame();
    f.emit();
    expect(f.pending.map(value => value.assignPairs?.local)).toEqual([1, 2]);
    assembly.simulation.advanceFrames(293);
    f.emit();
    expect(f.pending.at(-1)?.assignPairs).toEqual({ local: 3, label: 'condition' });
    expect(f.pending[0]?.assignPairs).toEqual({ local: 1, label: 'condition' });
  });

  it('槽位替换后立即读取新形态冷却，切回仍读取旧账本，不缓存初始技能', () => {
    const f = setup();
    f.owner.skillSlotGroups[0]!.replacementSkillKeys.push('variant');
    f.owner.skills.push(combo('variant'));
    const change = (targetSkillKey: string): ResolvedCombatStep => ({
      kind: 'changeSkillSlot',
      parameters: { skillGroupKey: 'combo', targetSkillKey },
    });
    f.owner.skills.push(
      action('to-variant', [change('variant')]),
      action('to-base', [change('combo')]),
    );
    const assembly = new CombatRuntimeAssembly(f.options);
    assembly.tryStartSkill('owner', 'combo');
    assembly.simulation.advanceFrames(6);
    f.emit();
    expect(f.pending).toHaveLength(0);
    assembly.tryStartSkill('owner', 'to-variant');
    f.emit();
    expect(f.pending).toHaveLength(1);
    assembly.tryStartSkill('owner', 'to-base');
    f.emit();
    expect(f.pending).toHaveLength(1);
  });

  it.each(['disabled', 'dead', 'silenced'] as const)(
    '%s 门禁按实时来源查询，不求值、不改变局部快照',
    gate => {
      const f = setup();
      new CombatRuntimeAssembly(f.options);
      f.hub.disableTriggerComboSkill = gate === 'disabled';
      f.eligibility.isAlive.mockReturnValue(gate !== 'dead');
      f.eligibility.isSilenced.mockReturnValue(gate === 'silenced');
      f.emit();
      expect(f.pending).toHaveLength(0);
      f.hub.disableTriggerComboSkill = false;
      f.eligibility.isAlive.mockReturnValue(true);
      f.eligibility.isSilenced.mockReturnValue(false);
      f.emit();
      expect(f.pending[0]?.assignPairs?.local).toBe(1);
      expect(f.eligibility.isAlive).toHaveBeenLastCalledWith('owner');
      expect(f.eligibility.isSilenced).toHaveBeenLastCalledWith('owner');
    },
  );

  it.each([
    'registerComboSkillCondition',
    'comboConditionEligibility',
    'onPendingComboCondition',
  ] as const)('缺 %s 明确失败，不丢弃条件或 Pending', port => {
    const f = setup();
    expect(() => new CombatRuntimeAssembly({ ...f.options, [port]: undefined })).toThrow(
      'require event registration, alive/InSilence eligibility and Pending sink',
    );
    f.emit();
    expect(f.pending).toEqual([]);
  });

  it.each([
    'no-skill',
    'no-cooldown',
    'no-start-frame',
    'wrong-type',
    'missing-variant',
    'duplicate-key',
    'no-slot',
  ] as const)('%s 严格拒绝不完整装配', failure => {
    const f = setup();
    if (failure === 'no-skill') f.owner.skills = [];
    if (failure === 'no-cooldown') f.owner.skills[0] = { ...combo(), cooldownFrames: undefined };
    if (failure === 'no-start-frame') f.owner.skills[0] = { ...combo(), costFrame: undefined };
    if (failure === 'wrong-type') f.owner.skills[0] = { ...combo(), skillType: 'battleSkill' };
    if (failure === 'missing-variant')
      f.owner.skillSlotGroups[0]!.replacementSkillKeys.push('unknown');
    if (failure === 'duplicate-key') f.owner.comboConditionPrograms.push(condition);
    if (failure === 'no-slot') f.owner.skillSlotGroups = [];
    expect(() => new CombatRuntimeAssembly(f.options)).toThrow(/combo condition/);
    f.emit();
    expect(f.pending).toEqual([]);
  });

  it('开局事件已能触发条件；入战或第零帧输入失败时撤销本次注册', () => {
    const f = setup();
    expect(
      () =>
        new CombatRuntimeAssembly({
          ...f.options,
          emitOperatorEnterFight: () => {
            f.emit();
            throw new Error('enter failed');
          },
        }),
    ).toThrow('enter failed');
    expect(f.pending).toHaveLength(1);
    f.emit();
    expect(f.pending).toHaveLength(1);
    expect(
      () =>
        new CombatRuntimeAssembly({
          ...f.options,
          inputs: [{ frame: 0, operatorId: 'owner', skillId: 'missing' }],
        }),
    ).toThrow();
    f.emit();
    expect(f.pending).toHaveLength(1);
  });

  it('中途注册失败会注销此前安装的条件', () => {
    const f = setup();
    f.owner.comboConditionPrograms.push({ ...condition, key: 'second' });
    let count = 0;
    expect(
      () =>
        new CombatRuntimeAssembly({
          ...f.options,
          registerComboSkillCondition: registration => {
            if (++count === 2) throw new Error('registration failed');
            return f.hub.registerPendingCondition(registration);
          },
        }),
    ).toThrow('registration failed');
    f.emit();
    expect(f.pending).toEqual([]);
  });

  it('只解析已装配角色、敌人和活动能力实体；未知 ID 不假装成角色', () => {
    const f = setup();
    new CombatRuntimeAssembly(f.options);
    expect(() => f.emit('missing')).toThrow("unknown or inactive entity 'missing'");
    expect(() => f.emit('ability-entity:42')).toThrow('unknown or inactive entity');
    f.emit();
    expect(f.pending[0]).toMatchObject({
      inputTarget: { kind: 'operator', operatorId: 'owner' },
      triggerTarget: { kind: 'enemy' },
    });
    expect(f.pending[0]?.assignPairs?.local).toBe(1);
  });

  it('相同事件中心中两场注册彼此独立，dispose 幂等且不清掉其他场的条件', () => {
    const f = setup();
    const first = new CombatRuntimeAssembly(f.options);
    const second = new CombatRuntimeAssembly(f.options);
    f.emit();
    expect(f.pending.map(value => value.assignPairs?.local)).toEqual([1, 1]);
    first.disposeComboSkillConditions();
    first.disposeComboSkillConditions();
    f.emit();
    expect(f.pending.at(-1)?.assignPairs?.local).toBe(2);
    expect(f.pending).toHaveLength(3);
    second.disposeComboSkillConditions();
    f.emit();
    expect(f.pending).toHaveLength(3);
  });
});
