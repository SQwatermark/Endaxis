import { isDeepStrictEqual } from 'node:util';
import {
  OPERATOR_ATTRIBUTES,
  UPGRADE_STATIC_DAMAGE_INCREASE_TARGETS,
  type CombatResource,
  type ActionSequenceDefinition,
  type OperatorUpgradeDefinition,
  type UpgradeModifierDefinition,
} from '../../../../../packages/game-data-contract/src/index.ts';
import { projectBuildAttributeModifier } from '../../compiler/buildAttributeProjection.ts';
import { projectSingleBuildConditionSource } from '../../compiler/buildCondition.ts';
import type { OperatorProgressionSource } from './progression.ts';
import type { CompiledOperatorProgressionEntrySource } from './progressionEffects.ts';
import type { OperatorSkillGroupSource, OperatorSkillIdentitySource } from './skillGroups.ts';

/** 来自已校验技能库及技能消耗元数据的绑定；不靠原生 ID 后缀选择技能组或消耗类型。 */
export interface OperatorProgressionDefinitionContext {
  readonly skills: readonly OperatorSkillIdentitySource[];
  readonly skillGroups: readonly OperatorSkillGroupSource[];
  readonly costResources: ReadonlyMap<string, CombatResource>;
}

type Progression = Pick<
  OperatorProgressionSource,
  'talentNodes' | 'potential' | 'compiledEffectBundles'
>;

/** 天赋每次只启用所选等级；按原生 index/level 聚合，禁止按节点名或数组出现顺序猜级别。 */
export function compileOperatorTalentDefinition(
  source: Progression,
  binding: { readonly index: number; readonly key: string },
  context: OperatorProgressionDefinitionContext,
): OperatorUpgradeDefinition {
  const nodes = source.talentNodes
    .filter(node => node.nodeType === 'passiveSkill' && node.passiveSkill.index === binding.index)
    .sort((left, right) => left.passiveSkill.level - right.passiveSkill.level);
  if (!nodes.length)
    throw new Error(`${binding.key}: missing passive talent index ${binding.index}`);
  nodes.forEach((node, index) => {
    if (node.passiveSkill.level !== index + 1)
      throw new Error(`${node.sourcePath}: talent levels must be unique and contiguous from 1`);
  });
  return assembleUpgrade(
    binding.key,
    nodes.map(node => node.talentEffectId),
    source,
    context,
    'talent',
  );
}

/** 每档潜能生成一个独立启用项；累计启用由正式构筑层处理，不能在这里重复累加前档。 */
export function compileOperatorPotentialDefinition(
  source: Progression,
  binding: { readonly level: number; readonly key: string },
  context: OperatorProgressionDefinitionContext,
): OperatorUpgradeDefinition {
  const unlocks = source.potential.unlocks.filter(unlock => unlock.level === binding.level);
  if (unlocks.length !== 1)
    throw new Error(`${binding.key}: expected one potential unlock at level ${binding.level}`);
  return assembleUpgrade(binding.key, [unlocks[0]!.effectId], source, context, 'potential');
}

function assembleUpgrade(
  key: string,
  effectIds: readonly string[],
  source: Progression,
  context: OperatorProgressionDefinitionContext,
  sourceKind: 'talent' | 'potential',
): OperatorUpgradeDefinition {
  if (!key.trim()) throw new Error('upgrade key must not be empty');
  const levels = effectIds.map(effectId => {
    const matches = source.compiledEffectBundles.filter(bundle => bundle.effectId === effectId);
    if (matches.length !== 1) throw new Error(`${key}: expected one effect bundle '${effectId}'`);
    return matches[0]!;
  });
  // 所有等级先完整编译。任何未支持条目都使整个养成项失败，绝不输出“缺一半”的天赋。
  const modifiersByLevel = levels.map(bundle =>
    bundle.entries.flatMap(entry => (entry.kind === 'buff' ? [] : compileModifier(entry, context))),
  );
  const initializations = levels.map(
    bundle =>
      ({
        steps: bundle.entries.flatMap(entry => {
          if (entry.kind !== 'buff') return [];
          if (sourceKind !== 'talent')
            throw new Error(
              `${entry.sourcePath}: potential AddBuff collection is not yet projected`,
            );
          if (entry.activeCondition !== null)
            throw new Error(
              `${entry.sourcePath}: attached Buff has an unrepresentable build condition`,
            );
          // combat-spec CharMiscFeature.Start → RefreshTalentBuff：角色直接给自身加 Buff，
          // 不是 AddPassiveSkill。初始黑板只来自 attachBuff，不继承某次技能的施放信息。
          return [
            {
              kind: 'applyBuff' as const,
              parameters: {
                buffId: entry.buffId,
                target: 'caster' as const,
                inheritSourceSkillCastInfo: false,
                ...(Object.keys(entry.inputBlackboard).length
                  ? {
                      blackboardAssignments: Object.fromEntries(
                        Object.entries(entry.inputBlackboard).map(([key, value]) => [
                          key,
                          { kind: 'constant' as const, value },
                        ]),
                      ),
                    }
                  : {}),
              },
            },
          ];
        }),
      }) satisfies ActionSequenceDefinition,
  );
  const initializationSequence = initializations[0]!;
  if (initializations.some(value => !isDeepStrictEqual(value, initializationSequence)))
    throw new Error(`${key}: level-dependent attached Buff initialization is not yet supported`);
  const first = modifiersByLevel[0]!;
  if (modifiersByLevel.some(modifiers => modifiers.length !== first.length))
    throw new Error(`${key}: level-dependent effect structure is not representable`);
  const modifiers = first.map((modifier, index) => {
    const variants = modifiersByLevel.map(items => items[index]!);
    if (modifier.kind === 'patchSkillBlackboard') {
      const { value: _value, ...shape } = modifier;
      const values = variants.map((variant, levelIndex) => {
        if (variant.kind !== 'patchSkillBlackboard')
          throw new Error(`${levels[levelIndex]!.sourcePath}: level-dependent modifier kind`);
        const { value, ...otherShape } = variant;
        if (typeof value !== 'number' || !isDeepStrictEqual(shape, otherShape))
          throw new Error(`${levels[levelIndex]!.sourcePath}: level-dependent modifier structure`);
        return value;
      });
      return { ...modifier, value: values.length === 1 ? values[0]! : values };
    }
    if (variants.some(variant => !isDeepStrictEqual(modifier, variant)))
      throw new Error(`${key}: ${modifier.kind} cannot represent level-dependent values`);
    return modifier;
  });
  return {
    key,
    levels: levels.length,
    ...(modifiers.length ? { modifiers } : {}),
    ...(initializationSequence.steps.length ? { initializationSequence } : {}),
  };
}

function compileModifier(
  entry: Exclude<CompiledOperatorProgressionEntrySource, { kind: 'buff' }>,
  context: OperatorProgressionDefinitionContext,
): UpgradeModifierDefinition[] {
  if (entry.kind === 'none') return [];
  const fail = (reason: string): never => {
    throw new Error(`${entry.sourcePath}: ${reason}`);
  };
  if (entry.kind === 'skillBlackboardModifier') {
    if (entry.stringValue !== '') fail('string skill blackboard modifier is not supported');
    const target = resolveSkill(entry.skillId, context, entry.sourcePath);
    const condition = projectSingleBuildConditionSource(entry.activeCondition, entry.sourcePath);
    return [
      {
        kind: 'patchSkillBlackboard',
        skillGroupKey: target.group.key,
        ...(target.singleSkill ? {} : { skillKey: target.skill.key }),
        blackboardKey: entry.blackboardKey,
        operation: entry.operation === 'overwrite' ? 'assign' : entry.operation,
        value: entry.numberValue,
        ...(condition === null ? {} : { condition }),
      },
    ];
  }
  // 这些正式修正器还没有条件字段，不能把条件效果变成无条件效果。
  if (entry.activeCondition !== null) fail(`${entry.kind} has an unrepresentable build condition`);
  if (entry.kind === 'skillParameterModifier') {
    const target = resolveSkill(entry.skillId, context, entry.sourcePath);
    const resource = context.costResources.get(entry.skillId);
    if (entry.parameter !== 'costValue' || entry.operation !== 'multiply' || !resource)
      return fail('only an explicitly bound multiplicative skill cost is supported');
    if (!target.singleSkill)
      return fail('skill cost modifier cannot target an entire multi-skill group');
    return [
      {
        kind: 'multiplySkillCost',
        skillGroupKey: target.group.key,
        resource,
        multiplier: entry.value,
      },
    ];
  }
  if (entry.kind === 'attributeModifier') {
    // 共享的原生属性/公式槽解释只在公共投影层维护；领域层只选择正式养成协议。
    const projection = projectBuildAttributeModifier(entry.modifier);
    if (projection.status !== 'supported') return fail(projection.reason);
    const modifier = projection.modifier;
    if (modifier.kind === 'attribute' && modifier.operation === 'flat') {
      const attribute = OPERATOR_ATTRIBUTES.find(value => value === modifier.attribute);
      if (attribute)
        return [{ kind: 'addBuildAttribute', attributes: [attribute], value: modifier.value }];
    }
    if (modifier.kind === 'damageScale' && modifier.slot === 'baseAddition') {
      const target = UPGRADE_STATIC_DAMAGE_INCREASE_TARGETS.find(
        value => value === modifier.target,
      );
      if (target) return [{ kind: 'addStaticDamageIncrease', target, value: modifier.value }];
    }
    return fail(`projected ${modifier.kind} is not yet representable as an upgrade modifier`);
  }
  return fail(
    `AddPassiveSkill '${entry.skillId}' must be assembled through the shared passive compiler`,
  );
}

function resolveSkill(
  skillId: string,
  context: OperatorProgressionDefinitionContext,
  path: string,
) {
  const skills = context.skills.filter(skill => skill.skillId === skillId);
  if (skills.length !== 1) throw new Error(`${path}: expected one skill binding for '${skillId}'`);
  const skill = skills[0]!;
  const groups = context.skillGroups.filter(
    group =>
      group.skillKeys.includes(skill.key) ||
      group.variants.some(variant => variant.skillKeys.includes(skill.key)),
  );
  if (groups.length !== 1) throw new Error(`${path}: expected one group binding for '${skillId}'`);
  const group = groups[0]!;
  // 正式 patchSkillBlackboard 暂时不能指定组变体；显式拒绝，避免误改其他形态。
  if (group.variants.length)
    throw new Error(`${path}: variant group upgrade targeting is not supported`);
  return { skill, group, singleSkill: group.skillKeys.length === 1 };
}
