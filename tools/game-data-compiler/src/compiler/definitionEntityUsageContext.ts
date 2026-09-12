/**
 * 汇总整批定义对能力实体黑板的外部读取，再解析一名干员的实体传值用途。
 * 技能可以把 direct 快照传给实体；Buff、其他子技能和队友查询随后都可能读取这些值。
 * 因此共享用途必须来自同批完整数据，不能把单个干员或某次模拟当成封闭世界。
 */
import type { ActionSequenceDefinition } from '../../../../packages/game-data-contract/src/actions.ts';
import type {
  OperatorBuffDefinitions,
  SkillBuffDefinition,
} from '../../../../packages/game-data-contract/src/buffs.ts';
import type { CombatCondition } from '../../../../packages/game-data-contract/src/conditions.ts';
import type {
  EquipmentContributionDefinition,
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../../../../packages/game-data-contract/src/equipment.ts';
import type {
  OperatorDefinition,
  OperatorPassiveSkillDefinition,
  OperatorUpgradeDefinition,
} from '../../../../packages/game-data-contract/src/operators.ts';
import type {
  AbilityEntityDefinition,
  OperatorAbilityEntityDefinitions,
  SkillDefinition,
} from '../../../../packages/game-data-contract/src/skills.ts';
import { analyzeBuffDefinitionUsage } from './buffValueUsage.ts';
import {
  actionValueUsage,
  analyzeConditionUsage,
  analyzeSequenceUsage,
  mergeDefinitionValueUsage,
  type DefinitionUsageContext,
  type DefinitionValueUsage,
} from './definitionUsageAnalysis.ts';

/** 所有实体都必须保留的外部用途。首版不缩小 Buff 目标，允许多保留键。 */
export interface SharedEntityValueUsage {
  readonly reads: ReadonlySet<string>;
  readonly unknownAccess: boolean;
  readonly commonAbilityEntityDefinitions: OperatorAbilityEntityDefinitions;
}

/**
 * 每个可能读取能力实体板的来源必须显式提供，空域也写为空集合。场景机制不走普通装备
 * 目录，但仍可能查询实体或创建带动作的 Buff。自定义定义也应并入对应域后重做分析。
 * 系统 elementalAttachments 由 createEnemyElementalBuffRuntime 安装到 enemy 的独立容器；
 * CombatBuffDefinitionAction 只读取该 Buff 板或对象属性，没有能力实体黑板查询出口，
 * 所以不加载这个运行时文档。敌人定义也只有面板和失衡配置，没有动作入口。
 */
export interface SharedEntityValueUsageInput {
  readonly operators: readonly OperatorDefinition[];
  readonly commonBuffDefinitions: OperatorBuffDefinitions;
  readonly commonAbilityEntityDefinitions: OperatorAbilityEntityDefinitions;
  readonly weapons: readonly WeaponDefinition[];
  readonly gears: readonly GearDefinition[];
  readonly gearSets: readonly GearSetDefinition[];
  readonly mechanicBuffDefinitions: OperatorBuffDefinitions;
  readonly mechanicSequences: readonly ActionSequenceDefinition[];
}

const empty = () => mergeDefinitionValueUsage([]);

/**
 * snapshot 只复制 direct 层，不枚举后备实体板。收集后备板读取时，不把这种传出误报为
 * “读取全部宿主键”；显式赋值操作数和回调的实际读取仍由公共用途分析器汇总。
 */
const fallbackContext: DefinitionUsageContext = { inheritedAbilityEntityUsage: empty };

export function collectSharedEntityValueUsage(
  input: SharedEntityValueUsageInput,
): SharedEntityValueUsage {
  const reads = new Set<string>();
  let unknownAccess = false;
  const observedSequences = new WeakSet<ActionSequenceDefinition>();
  const observedBuffs = new WeakSet<SkillBuffDefinition>();
  const observedEntities = new WeakSet<AbilityEntityDefinition>();
  const observe = (usage: DefinitionValueUsage, includeCurrent = false) => {
    if (includeCurrent) {
      usage.reads.forEach(key => reads.add(key));
      usage.writes.forEach(key => reads.add(key));
    }
    // Buff 查询当前返回 direct 快照。仍保守纳入这些键，避免缩小其宿主/来源关系。
    usage.externalReads.forEach(read => reads.add(read.key));
    unknownAccess ||= usage.unknownAccess;
  };
  const condition = (value: CombatCondition | undefined) => {
    if (value !== undefined) observe(analyzeConditionUsage(value));
  };
  const buff = (value: SkillBuffDefinition) => {
    if (observedBuffs.has(value)) return;
    observedBuffs.add(value);
    observe(analyzeBuffDefinitionUsage(value, fallbackContext), true);
    value.scheduledSequences?.forEach(item => sequence(item.sequence));
    Object.values(value.lifecycleSequences ?? {}).forEach(program => {
      if (program !== undefined) sequence(program);
    });
    value.abilityEventResponses?.forEach(response => sequence(response.sequence));
    value.igniteEventResponses?.forEach(response => sequence(response.sequence));
    value.damageModifiers?.forEach(modifier => {
      if (modifier.conditionProgram !== undefined) sequence(modifier.conditionProgram);
    });
  };
  const entity = (value: AbilityEntityDefinition) => {
    if (observedEntities.has(value)) return;
    observedEntities.add(value);
    value.childSkill?.scheduledSequences.forEach(item => sequence(item.sequence));
    Object.values(value.childSkills ?? {}).forEach(child =>
      child.scheduledSequences.forEach(item => sequence(item.sequence)),
    );
    value.passiveSkills?.forEach(passive);
  };
  const sequence = (value: ActionSequenceDefinition) => {
    if (observedSequences.has(value)) return;
    observedSequences.add(value);
    observe(analyzeSequenceUsage(value, fallbackContext));
    for (const step of value.steps) {
      switch (step.kind) {
        case 'spawnAbilityEntity':
          if (step.parameters.definition !== undefined) entity(step.parameters.definition);
          break;
        case 'applyBuff':
          if (step.parameters.definition !== undefined) buff(step.parameters.definition);
          break;
        case 'conditional':
          sequence(step.whenTrue);
          if (step.whenFalse !== undefined) sequence(step.whenFalse);
          break;
        case 'switch':
          step.options.forEach(option => sequence(option.sequence));
          break;
        case 'once':
        case 'repeatEachTick':
        case 'repeatByActionValue':
        case 'forEachContextTarget':
        case 'withActionBlackboardScope':
          sequence(step.body);
          break;
        case 'listenForCombatEvents':
          step.parameters.responses.forEach(response => sequence(response.sequence));
          break;
        case 'scheduleProjectileFinishCallback':
          step.callback.scheduledSequences.forEach(item => sequence(item.sequence));
          break;
      }
    }
  };
  const passive = (value: OperatorPassiveSkillDefinition) => {
    sequence(value.enableSequence);
    value.abilityEventResponses?.forEach(response => {
      sequence(response.sequence);
    });
  };
  const skill = (value: SkillDefinition) => {
    condition(value.availability);
    value.scheduledSequences.forEach(item => sequence(item.sequence));
    if (value.switchToBuffCast !== undefined) {
      condition(value.switchToBuffCast.condition);
      sequence(value.switchToBuffCast.sequence);
    }
    value.eventHandlers?.forEach(handler => {
      condition(handler.condition);
      handler.scheduledSequences.forEach(item => sequence(item.sequence));
    });
  };
  const skills = (values: SkillDefinition | readonly SkillDefinition[]) => {
    if ('key' in values) skill(values);
    else values.forEach(skill);
  };
  const upgrade = (value: OperatorUpgradeDefinition) => {
    if (value.initializationSequence !== undefined) sequence(value.initializationSequence);
    value.eventHandlers?.forEach(handler => {
      sequence(handler.sequence);
    });
    value.passiveSkills?.forEach(passive);
  };
  const contribution = (value: EquipmentContributionDefinition) => {
    if (value.enableSequence !== undefined) sequence(value.enableSequence);
    if (value.initializationSequence !== undefined) sequence(value.initializationSequence);
    value.eventHandlers?.forEach(handler => {
      condition(handler.condition);
      sequence(handler.sequence);
    });
    Object.values(value.buffDefinitions ?? {}).forEach(buff);
  };
  for (const operator of input.operators) {
    operator.skillGroups.forEach(group => {
      skills(group.skills);
      group.variants?.forEach(variant => skills(variant.skills));
      group.replacementSkills?.forEach(skill);
      group.routedReplacementSkills?.forEach(route => skill(route.skill));
    });
    operator.talents.forEach(upgrade);
    operator.potentials.forEach(upgrade);
    operator.passiveSkills?.forEach(passive);
    operator.eventHandlers?.forEach(handler => {
      sequence(handler.sequence);
    });
    operator.comboSkillConditions?.forEach(value => sequence(value.sequence));
    Object.values(operator.buffDefinitions ?? {}).forEach(buff);
    Object.values(operator.abilityEntityDefinitions ?? {}).forEach(entity);
  }
  Object.values(input.commonBuffDefinitions).forEach(buff);
  Object.values(input.commonAbilityEntityDefinitions).forEach(entity);
  input.weapons.forEach(weapon => weapon.traits.forEach(contribution));
  input.gears.forEach(gear => gear.traits.forEach(contribution));
  input.gearSets.forEach(contribution);
  Object.values(input.mechanicBuffDefinitions).forEach(buff);
  input.mechanicSequences.forEach(sequence);
  return {
    reads,
    unknownAccess,
    commonAbilityEntityDefinitions: input.commonAbilityEntityDefinitions,
  };
}

/** 未提供整批共享用途时不开启实体精确传值；循环或缺失接收方同样返回未知。 */
export function createEntityUsageContext(
  definitions: OperatorAbilityEntityDefinitions | undefined,
  shared: SharedEntityValueUsage | undefined,
): DefinitionUsageContext | undefined {
  if (shared === undefined) return undefined;
  const cache = new WeakMap<AbilityEntityDefinition, DefinitionValueUsage>();
  const visiting = new WeakSet<AbilityEntityDefinition>();
  const sharedUsage: DefinitionValueUsage = {
    ...empty(),
    reads: shared.reads,
    unknownAccess: shared.unknownAccess,
  };
  const unresolved = (): DefinitionValueUsage => ({ ...empty(), unknownAccess: true });
  const context: DefinitionUsageContext = {
    inheritedAbilityEntityUsage(step) {
      const id = step.parameters.abilityEntityId;
      const definition =
        step.parameters.definition ??
        definitions?.[id] ??
        shared.commonAbilityEntityDefinitions[id];
      if (definition === undefined || visiting.has(definition)) return unresolved();
      const previous = cache.get(definition);
      if (previous !== undefined) return previous;
      visiting.add(definition);
      const usages = [sharedUsage];
      const number = (value: AbilityEntityDefinition['maxStackingCount']) => {
        if (typeof value === 'object')
          usages.push(
            actionValueUsage({
              kind: 'blackboard',
              key: value.blackboardKey,
              fallback: value.fallback,
            }),
          );
      };
      if (definition.lifetime.kind === 'limited') number(definition.lifetime.durationSeconds);
      number(definition.maxStackingCount);
      const programs = [
        ...(definition.childSkill?.scheduledSequences ?? []),
        ...Object.values(definition.childSkills ?? {}).flatMap(child => child.scheduledSequences),
      ];
      programs.forEach(item => usages.push(analyzeSequenceUsage(item.sequence, context)));
      for (const passive of definition.passiveSkills ?? []) {
        usages.push(analyzeSequenceUsage(passive.enableSequence, context));
        for (const response of passive.abilityEventResponses ?? []) {
          usages.push(analyzeSequenceUsage(response.sequence, context));
        }
      }
      visiting.delete(definition);
      const result = mergeDefinitionValueUsage(usages);
      cache.set(definition, result);
      return result;
    },
  };
  return context;
}
