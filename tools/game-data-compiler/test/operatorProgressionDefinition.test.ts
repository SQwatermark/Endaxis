import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { describe, expect, it } from 'vitest';
import fixture from './fixtures/avywenna-progression.json';
import buffFixture from './fixtures/avywenna-talent-buff.json';
import type { SkillBuffDefinition } from '../../../src/next/core/game-data/operatorDefinition';
import { validateActionSequenceDefinition } from '../../../src/next/core/game-data/validateSkillDefinition';
import { compileStandardStumpBuffClosure } from '../src/compiler/standardStumpBuffClosure.ts';
import { ScenarioSimulationService } from '../../../src/next/application/scenarioSimulationService';
import { createEmptyScenario } from '../../../src/next/core/project/createProject';
import { avywenna } from '../../../src/next/data/operators/avywenna';
import { skillSettings } from '../../../src/next/data/combat/skillSettings';
import { parseOperatorProgressionSource } from '../src/domains/operator/progression.ts';
import {
  compileOperatorInitializationPrograms,
  resolveActiveOperatorUpgrades,
} from '../../../src/next/core/compiler/compileOperatorUpgrades';
import {
  compileOperatorPotentialDefinition,
  compileOperatorTalentDefinition,
  type OperatorProgressionDefinitionContext,
} from '../src/domains/operator/progressionDefinition.ts';

const context: OperatorProgressionDefinitionContext = {
  skills: [
    { key: 'battleSkill', skillId: 'chr_0012_avywen_normal_skill', skillType: 'battleSkill' },
    { key: 'comboSkill', skillId: 'chr_0012_avywen_combo_skill', skillType: 'comboSkill' },
    { key: 'ultimate', skillId: 'chr_0012_avywen_ultimate_skill', skillType: 'ultimate' },
  ],
  skillGroups: (['battleSkill', 'comboSkill', 'ultimate'] as const).map((key, index) => ({
    key,
    skillType: key,
    levelSource: key,
    nativeGroupType: index + 1,
    skillKeys: [key],
    replacementPlacements: {},
    variants: [],
  })),
  costResources: new Map([['chr_0012_avywen_ultimate_skill', 'ultimateEnergy']]),
};

function progression() {
  return parseOperatorProgressionSource(
    { characterId: 'chr_0012_avywen', mainAttribute: 'will' },
    fixture.growth,
    fixture.potential,
    fixture.effects,
    fixture.conditions,
  );
}

describe('干员养成正式定义组装', () => {
  it('原生表的五档潜能逐项等价于旧产物，不重复累计前档', () => {
    const source = progression();
    const snapshot = structuredClone(source);
    const potentials = [1, 2, 3, 4, 5].map(level =>
      compileOperatorPotentialDefinition(source, { key: `potential${level}`, level }, context),
    );
    expect(potentials).toEqual(avywenna.potentials);
    expect(source).toEqual(snapshot);
  });

  it('按元数据聚合天赋等级，保留逐等级值；节点乱序不改变结果', () => {
    const source = progression();
    const definition = compileOperatorTalentDefinition(
      { ...source, talentNodes: [...source.talentNodes].reverse() },
      { key: 'talent2', index: 1 },
      context,
    );
    expect(definition).toEqual(avywenna.talents[1]);
    expect(definition.modifiers?.[1]).toMatchObject({ value: [10, 10] });
    expect(source.talentNodes.find(node => node.nodeType === 'passiveSkill')!.passiveSkill).toEqual(
      { index: 0, level: 1, breakStage: 1 },
    );
  });

  it('第一天赋直接初始化 Buff，不伪造隐藏被动技能', () => {
    const definition = compileOperatorTalentDefinition(
      progression(),
      { key: 'talent1', index: 0 },
      context,
    );
    expect(definition).toEqual(avywenna.talents[0]);
    expect(definition.passiveSkills).toBeUndefined();
    expect(definition.initializationSequence).toBeDefined();
  });

  it('每档潜能的 AddBuff 生成自身初始化程序，由构筑层累计启用各档', () => {
    const source = progression();
    const effectId = source.potential.unlocks[0]!.effectId;
    const modified = {
      ...source,
      compiledEffectBundles: source.compiledEffectBundles.map(bundle =>
        bundle.effectId === effectId
          ? {
              ...bundle,
              entries: [
                {
                  kind: 'buff' as const,
                  modifyType: 'addBuff' as const,
                  sourcePath: `${bundle.sourcePath}.dataList[0]`,
                  activeCondition: null,
                  buffId: 'buff.potential',
                  inputBlackboard: { amount: 7 },
                },
              ],
            }
          : bundle,
      ),
    };
    const definition = compileOperatorPotentialDefinition(
      modified,
      { key: 'potential1', level: 1 },
      context,
    );
    expect(definition).toEqual({
      key: 'potential1',
      levels: 1,
      initializationSequence: {
        steps: [
          {
            kind: 'applyBuff',
            parameters: {
              buffId: 'buff.potential',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: { amount: { kind: 'constant', value: 7 } },
            },
          },
        ],
      },
    });
  });

  it('将原生治疗输出基础加算投影为构筑期治疗修正', () => {
    const source = progression();
    const effectId = source.potential.unlocks[0]!.effectId;
    const modified = {
      ...source,
      compiledEffectBundles: source.compiledEffectBundles.map(bundle =>
        bundle.effectId === effectId
          ? {
              ...bundle,
              entries: [
                {
                  kind: 'attributeModifier' as const,
                  sourcePath: `${bundle.sourcePath}.dataList[0]`,
                  activeCondition: null,
                  modifier: {
                    sourcePath: `${bundle.sourcePath}.dataList[0].attrModifier`,
                    target: 'specific' as const,
                    declaredAttributeType: 'HealOutputIncrease' as const,
                    slot: 'baseAddition' as const,
                    value: 0.1,
                  },
                },
              ],
            }
          : bundle,
      ),
    };

    expect(
      compileOperatorPotentialDefinition(modified, { key: 'potential1', level: 1 }, context),
    ).toEqual({
      key: 'potential1',
      levels: 1,
      modifiers: [{ kind: 'addStaticHealingIncrease', target: 'output', value: 0.1 }],
    });
  });

  it.each([0, 1, 2])('天赋等级 %s 经正式构筑只产生零个或一个初始化程序', level => {
    const definition = compileOperatorTalentDefinition(
      progression(),
      { key: 'talent1', index: 0 },
      context,
    );
    const operator = { ...avywenna, talents: [definition] };
    const step = definition.initializationSequence!.steps[0]!;
    if (step.kind !== 'applyBuff') throw new Error('expected direct Buff initialization');
    const active = resolveActiveOperatorUpgrades(
      {
        operatorSlug: operator.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { '0': level },
      },
      operator,
    );
    // 完整场景装配会按 ID 注入定义；这里只隔离验证养成初始化程序的选择和编译。
    const resolved = active.map(upgrade => ({
      ...upgrade,
      definition: {
        ...upgrade.definition,
        initializationSequence: {
          steps: [
            {
              kind: 'applyBuff' as const,
              parameters: {
                ...step.parameters,
                buffId: 'buff_chr_0012_avywen_talent_0',
                target: 'caster' as const,
                definition: operator.buffDefinitions!['buff_chr_0012_avywen_talent_0']!,
              },
            },
          ],
        },
      },
    }));
    expect(compileOperatorInitializationPrograms(resolved)).toHaveLength(level === 0 ? 0 : 1);
  });

  it('附加 Buff 输入按养成等级保留，未支持的条件仍不能静默丢失', () => {
    const source = progression();
    const modified = (withCondition: boolean) => ({
      ...source,
      compiledEffectBundles: source.compiledEffectBundles.map(bundle => ({
        ...bundle,
        entries: bundle.entries.map(entry =>
          entry.kind === 'buff' &&
          (bundle.effectId.endsWith('_1_1') || bundle.effectId.endsWith('_1_2'))
            ? {
                ...entry,
                inputBlackboard: { amount: bundle.effectId.endsWith('_1_1') ? 5 : 7 },
                activeCondition:
                  withCondition && bundle.effectId.endsWith('_1_2')
                    ? {
                        kind: 'all' as const,
                        conditions: [
                          {
                            kind: 'deckAttributeCompare' as const,
                            left: 'will' as const,
                            operator: 'greater' as const,
                            right: 'strength' as const,
                          },
                        ],
                      }
                    : null,
              }
            : entry,
        ),
      })),
    });
    expect(
      compileOperatorTalentDefinition(modified(false), { key: 'talent1', index: 0 }, context),
    ).toMatchObject({
      initializationSequence: {
        steps: [
          {
            kind: 'applyBuff',
            parameters: { blackboardAssignments: { amount: [5, 7] } },
          },
        ],
      },
    });
    expect(() =>
      compileOperatorTalentDefinition(modified(true), { key: 'talent1', index: 0 }, context),
    ).toThrow('unrepresentable build condition');
  });

  it.each([0, 1, 2])(
    '原始天赋和 Buff 经生产模拟：等级 %s 只在初始化时安装自身 Buff',
    async level => {
      const id = 'buff_chr_0012_avywen_talent_0';
      const closure = compileStandardStumpBuffClosure(
        [id],
        buffFixture,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        fixtureGameplayTagRegistry,
      );
      expect(closure.diagnostics.filter(item => item.status === 'blocked')).toEqual([]);
      // 公共 Buff 编译结果与当前正式本体相同，只多出显式空集合；不用旧 Python 生成天赋行为。
      expect(closure.definitions[id]).toEqual({
        ...avywenna.buffDefinitions![id],
        applyTags: [],
        extendTags: [],
        blackboard: {},
        attributeModifiers: [],
      });
      expect(
        validateActionSequenceDefinition({
          steps: [
            {
              kind: 'applyBuff',
              parameters: {
                target: 'caster',
                definition: closure.definitions[id],
                buffId: id,
              },
            },
          ],
        }),
      ).toEqual([]);
      const operator = {
        ...avywenna,
        buffDefinitions: {
          ...avywenna.buffDefinitions,
          [id]: closure.definitions[id] as SkillBuffDefinition,
        },
        talents: [0, 1].map(index =>
          compileOperatorTalentDefinition(
            progression(),
            { index, key: `talent${index + 1}` },
            context,
          ),
        ),
        potentials: [1, 2, 3, 4, 5].map(level =>
          compileOperatorPotentialDefinition(
            progression(),
            { level, key: `potential${level}` },
            context,
          ),
        ),
      };
      const scenario = createEmptyScenario('progression-test', '天赋初始化');
      scenario.battle.durationFrames = 60;
      scenario.tracks[0] = {
        id: 'track:talent',
        operator: {
          operatorSlug: operator.slug,
          level: 90,
          promoted: true,
          potential: 5,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: { '0': level, '1': 2 },
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      const result = await new ScenarioSimulationService({
        index: {
          getOperator: slug => (slug === operator.slug ? operator : null),
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
        repositoryRevision: `talent-${level}`,
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
        spellInflictionSettings: skillSettings,
      }).simulate(scenario, 60);
      const applications = result.receiptEntries.filter(
        entry => entry.event === 'BuffApplied' && entry.data?.buffId === id,
      );
      expect(applications).toHaveLength(level === 0 ? 0 : 1);
      if (level > 0)
        expect(applications[0]).toMatchObject({
          sourceId: 'track:talent',
          targetId: 'track:talent',
          frame: 0,
        });
    },
  );

  it('拒绝缺级、重级和缺失效果包', () => {
    const source = progression();
    const node = source.talentNodes.find(node => node.passiveSkill.index === 1)!;
    expect(() =>
      compileOperatorTalentDefinition(
        { ...source, talentNodes: [...source.talentNodes, node] },
        { key: 'talent2', index: 1 },
        context,
      ),
    ).toThrow('unique and contiguous');
    expect(() =>
      compileOperatorTalentDefinition(
        { ...source, talentNodes: source.talentNodes.filter(item => item !== node) },
        { key: 'talent2', index: 1 },
        context,
      ),
    ).toThrow('unique and contiguous');
    expect(() =>
      compileOperatorPotentialDefinition(
        { ...source, compiledEffectBundles: [] },
        { key: 'potential1', level: 1 },
        context,
      ),
    ).toThrow('expected one effect bundle');
  });

  it('多技能组的黑板修改保留 skillKey，不把单技能消耗修改扩大到整个组', () => {
    const multi: OperatorProgressionDefinitionContext = {
      ...context,
      skillGroups: context.skillGroups.map(group => ({
        ...group,
        skillKeys: [...group.skillKeys, 'another'],
      })),
    };
    const patch = compileOperatorPotentialDefinition(
      progression(),
      { key: 'potential5', level: 5 },
      multi,
    );
    expect(patch.modifiers?.[0]).toMatchObject({ skillKey: 'battleSkill' });
    expect(
      compileOperatorPotentialDefinition(progression(), { key: 'potential4', level: 4 }, multi)
        .modifiers?.[0],
    ).toMatchObject({
      kind: 'multiplySkillCost',
      skillGroupKey: 'ultimate',
      skillKey: 'ultimate',
    });
  });

  it('原生技能冷却秒数加算转换为精确帧差', () => {
    const source = progression();
    const potential5EffectId = source.potential.unlocks.find(node => node.level === 5)!.effectId;
    const modified = {
      ...source,
      compiledEffectBundles: source.compiledEffectBundles.map(bundle =>
        bundle.effectId === potential5EffectId
          ? {
              ...bundle,
              entries: [
                {
                  kind: 'skillParameterModifier' as const,
                  sourcePath: 'PotentialTalentEffectTable.cooldown',
                  activeCondition: null,
                  skillId: 'chr_0012_avywen_combo_skill',
                  parameter: 'cooldown' as const,
                  operation: 'add' as const,
                  value: -3,
                },
              ],
            }
          : bundle,
      ),
    };
    expect(
      compileOperatorPotentialDefinition(modified, { key: 'potential5', level: 5 }, context),
    ).toMatchObject({
      modifiers: [{ kind: 'addSkillCooldownFrames', skillGroupKey: 'comboSkill', frames: -90 }],
    });
  });

  it('保留黑板条件，正式协议不能承载的消耗条件则明确拒绝', () => {
    const source = progression();
    const condition = {
      kind: 'deckAttributeCompare',
      left: 'will',
      operator: 'greater',
      right: 'strength',
    } as const;
    const conditioned = {
      ...source,
      compiledEffectBundles: source.compiledEffectBundles.map(bundle => ({
        ...bundle,
        entries: bundle.entries.map(entry => ({
          ...entry,
          activeCondition: { kind: 'all' as const, conditions: [condition] },
        })),
      })),
    };
    const result = compileOperatorPotentialDefinition(
      conditioned,
      { key: 'potential5', level: 5 },
      context,
    );
    expect(result.modifiers?.[0]).toMatchObject({ condition });
    expect(() =>
      compileOperatorPotentialDefinition(conditioned, { key: 'potential4', level: 4 }, context),
    ).toThrow('unrepresentable build condition');
  });

  it('保留运行时冷却条件，且不把展示冷却重复计入模拟', () => {
    const source = progression();
    const condition = {
      kind: 'deckAttributeCompare',
      left: 'intellect',
      operator: 'greaterOrEqual',
      right: 'will',
    } as const;
    const effectIds = source.talentNodes
      .filter(node => node.nodeType === 'passiveSkill' && node.passiveSkill.index === 0)
      .map(node => node.talentEffectId);
    const modified = {
      ...source,
      compiledEffectBundles: source.compiledEffectBundles.map(bundle =>
        effectIds.includes(bundle.effectId)
          ? {
              ...bundle,
              entries: [
                {
                  kind: 'skillParameterModifier' as const,
                  sourcePath: 'PotentialTalentEffectTable.runtimeCooldown',
                  activeCondition: { kind: 'all' as const, conditions: [condition] },
                  skillId: 'chr_0012_avywen_combo_skill',
                  parameter: 'cooldown' as const,
                  operation: 'add' as const,
                  value: -6,
                },
                {
                  kind: 'skillParameterModifier' as const,
                  sourcePath: 'PotentialTalentEffectTable.displayCooldown',
                  activeCondition: { kind: 'all' as const, conditions: [condition] },
                  skillId: 'chr_0012_avywen_combo_skill',
                  parameter: 'cooldownDisplay' as const,
                  operation: 'add' as const,
                  value: -6,
                },
              ],
            }
          : bundle,
      ),
    };
    expect(
      compileOperatorTalentDefinition(modified, { key: 'talent1', index: 0 }, context),
    ).toMatchObject({
      modifiers: [
        {
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -180,
          condition,
        },
      ],
    });
  });

  it('不合并等级间形状不同的效果', () => {
    const source = progression();
    const changed = {
      ...source,
      compiledEffectBundles: source.compiledEffectBundles.map(bundle => ({
        ...bundle,
        entries:
          bundle.effectId === 'chr_0012_avywen_talent_2_2'
            ? [...bundle.entries].reverse()
            : bundle.entries,
      })),
    };
    expect(() =>
      compileOperatorTalentDefinition(changed, { key: 'talent2', index: 1 }, context),
    ).toThrow('level-dependent modifier structure');
  });
});
