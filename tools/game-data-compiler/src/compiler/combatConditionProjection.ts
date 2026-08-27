import type { NativeActionNodeSource } from '../source/controlFlow.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import { parseObjectTypeMask } from '../source/objectType.ts';
import type { CompiledBuffConditionSource } from './combatActionProjectionTypes.ts';
import {
  type ProjectedTargetGroup,
  type CombatActionProjectionContextSource,
  requireActionOwnerProjection,
  actionValueOperand,
  DAMAGE_TYPES,
  COMPARISON_OPERATORS,
} from './combatProjectionCommon.ts';

/** 原生条件到公共条件子集的投影，并明确条件写黑板的副作用。
 * 不编排分支或执行动作；未知宿主和条件仍在原来的边界阻断。 */

export function compileEventCondition(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  context: CombatActionProjectionContextSource,
  targetGroups: ReadonlyMap<string, ProjectedTargetGroup>,
): CompiledBuffConditionSource | null {
  if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') return null;
  return compileConditionLeaf(node.body.value.action, node.sourcePath, context, targetGroups);
}

/** 条件也可能写黑板；即便没有后继步骤，写入及其前置守卫也不能消去。 */
export function conditionWritesBlackboard(condition: CompiledBuffConditionSource): boolean {
  if (condition.kind === 'all' || condition.kind === 'any')
    return condition.conditions.some(conditionWritesBlackboard);
  if (condition.kind === 'not') return conditionWritesBlackboard(condition.condition);
  return (
    ('outputKey' in condition && condition.outputKey !== undefined) ||
    ('buffIdOutputKey' in condition && condition.buffIdOutputKey !== undefined) ||
    (condition.kind === 'eventOverheal' &&
      [condition.overHealKey, condition.finalHealKey, condition.realHealKey].some(
        key => key !== undefined,
      ))
  );
}

function compileConditionLeaf(
  condition: Extract<KnownNativeActionLeafSource, { family: 'condition' }>['action'],
  sourcePath: string,
  context: CombatActionProjectionContextSource,
  targetGroups: ReadonlyMap<string, ProjectedTargetGroup> = new Map(),
): CompiledBuffConditionSource {
  // 主动动作/命中回调没有 Buff 事件环境；只有已验收的条件可使用显式木桩 Target。
  if (
    context.actionTargetTarget === 'enemy' &&
    ![
      'floatCompare',
      'buffStack',
      'mainOperator',
      'poise',
      'any',
      'entityCount',
      'squadInFight',
    ].includes(condition.kind)
  )
    throw new Error(`${sourcePath}: unaudited single-enemy action condition ${condition.kind}`);
  if (
    context.actionTargetTarget === 'currentAbilityEntity' &&
    !['floatCompare', 'buffStack', 'distance', 'entityCount', 'any'].includes(condition.kind)
  )
    throw new Error(`${sourcePath}: unaudited AbilityEntity condition ${condition.kind}`);
  if (condition.kind === 'distance') {
    if (
      context.actionTargetTarget !== 'currentAbilityEntity' ||
      context.actionOwnerTarget !== 'caster' ||
      condition.source.targetSource !== 'Owner' ||
      condition.target.targetSource !== 'Target' ||
      condition.includeTargetRadius ||
      condition.containsHittableObject
    )
      throw new Error(`${sourcePath}: unsupported zero-distance condition endpoints/options`);
    // ForEach guarantees a concrete entity; an absent target must not become distance zero.
    // Native lessThan=true is <=, not < (combat-spec foreach-target-and-distance.md).
    return {
      kind: 'actionValueCompare',
      left: { kind: 'constant', value: 0 },
      operator: condition.lessThan ? 'lessOrEqual' : 'greater',
      right: { kind: 'constant', value: condition.distance },
    };
  }
  if (condition.kind === 'squadInFight') {
    // 正式时间轴只在已绑定 Battle 的模拟中执行；未绑定环境会在运行入口先失败。
    return {
      kind: 'actionValueCompare',
      left: { kind: 'constant', value: 1 },
      operator: 'equal',
      right: { kind: 'constant', value: 1 },
    };
  }
  if (
    context.actionTargetTarget === 'eventSource' &&
    ![
      'contextBuff',
      'targetIdentity',
      'floatCompare',
      'originSkillType',
      'skillCastId',
      'timedMarker',
    ].includes(condition.kind)
  )
    throw new Error(`${sourcePath}: unaudited receiving Buff event condition ${condition.kind}`);
  if (condition.kind === 'mainOperator') {
    if (
      condition.targetSource === 'Target' &&
      condition.targetGroupKey === '' &&
      context.actionTargetTarget === 'enemy'
    ) {
      // 静态敌方木桩不可能是玩家主控；用显式假条件保留 alwaysNext/fail 分支结构。
      return {
        kind: 'actionValueCompare',
        left: { kind: 'constant', value: 0 },
        operator: 'equal',
        right: { kind: 'constant', value: 1 },
      };
    }
    const projectsCaster =
      (condition.targetSource === 'Owner' && context.actionOwnerTarget === 'caster') ||
      (condition.targetSource === 'Source' && context.actionSourceTarget === 'caster');
    // 固定 Owner/Source 不读取 targetGroupKey；部分原始技能保留了上一个 Context 目标组名。
    if (!projectsCaster) {
      throw new Error(`${sourcePath}: unsupported main-character condition target`);
    }
    return { kind: 'casterControlled' };
  }
  if (condition.kind === 'deckAttributeCompare') {
    const attributes = {
      Str: 'strength',
      Agi: 'agility',
      Wisd: 'intellect',
      Will: 'will',
    } as const;
    const left = attributes[condition.leftAttribute as keyof typeof attributes];
    const right = attributes[condition.rightAttribute as keyof typeof attributes];
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (
      condition.targetSource !== 'Owner' ||
      condition.targetGroupKey !== '' ||
      condition.leftValue.blackboardKey !== null ||
      condition.leftValue.value !== 0 ||
      condition.rightValue.blackboardKey !== null ||
      condition.rightValue.value !== 0 ||
      left === undefined ||
      right === undefined ||
      operator === undefined
    ) {
      throw new Error(`${sourcePath}: unsupported Deck attribute comparison`);
    }
    return { kind: 'deckAttributeCompare', left, operator, right };
  }
  if (condition.kind === 'floatCompare') {
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (operator === undefined) throw new Error(`${sourcePath}: unsupported float comparison`);
    return {
      kind: 'actionValueCompare',
      left: actionValueOperand(condition.left),
      operator,
      right: actionValueOperand(condition.right),
    };
  }
  if (condition.kind === 'health') {
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (
      condition.targetSource !== 'InstantSearch' ||
      condition.characterTeamSelectionRole !== 'controlledOperator' ||
      operator === undefined
    ) {
      throw new Error(`${sourcePath}: unsupported health condition target`);
    }
    return {
      kind: 'healthCompare',
      target: 'controlledOperator',
      valueType: condition.isRatio ? 'ratio' : 'current',
      operator,
      value: actionValueOperand(condition.value),
    };
  }
  if (condition.kind === 'obtainAtbType') {
    if (
      (condition.checkObtainType &&
        (condition.obtainTypes.length !== 1 || condition.obtainTypes[0] !== 'Skill')) ||
      (condition.checkObtainMethod &&
        (condition.obtainMethods.length !== 1 || condition.obtainMethods[0] !== 'Gain'))
    ) {
      throw new Error(`${sourcePath}: unsupported ObtainAtb event filter`);
    }
    return {
      kind: 'eventSpGainMatch',
      ...(condition.checkObtainType ? { sources: ['skill'] as const } : {}),
      ...(condition.checkObtainMethod ? { gainKinds: ['gain'] as const } : {}),
    };
  }
  if (condition.kind === 'skillType') {
    return {
      kind: 'eventSkillTypeIn',
      skillTypes: condition.skillTypes.map(skillType => {
        const mapped = SKILL_TYPES[skillType];
        if (mapped === undefined)
          throw new Error(`unsupported native skill type ${JSON.stringify(skillType)}`);
        return mapped;
      }),
    };
  }
  if (condition.kind === 'originSkillType') {
    if (condition.attackTypeMask !== 'All') {
      throw new Error(
        `${sourcePath}: unsupported origin skill attack type mask ${JSON.stringify(condition.attackTypeMask)}`,
      );
    }
    return {
      kind: 'originSkillTypeIn',
      skillTypes: condition.skillTypes.flatMap(skillType => {
        if (skillType === 'Attack') return ['basicAttack', 'plungingAttack'] as const;
        const mapped = SKILL_TYPES[skillType];
        if (mapped === undefined)
          throw new Error(`unsupported native origin skill type ${JSON.stringify(skillType)}`);
        return [mapped];
      }),
    };
  }
  if (condition.kind === 'skillCastId') {
    return { kind: 'eventSkillCastMatchesBuffSource' };
  }
  if (condition.kind === 'inflictionType') {
    return {
      kind: 'eventInflictionElementIn',
      elements: condition.elements as readonly ('heat' | 'electric' | 'cryo' | 'nature')[],
      ...(condition.savedKey === '' ? {} : { outputKey: condition.savedKey }),
    };
  }
  if (condition.kind === 'entityCount') {
    const operator = COMPARISON_OPERATORS[condition.comparison];
    const projectedGroup = targetGroups.get(condition.targetGroupKey);
    const knownStaticEnemy = context.staticEnemyTargetGroupKeys?.has(condition.targetGroupKey);
    if (
      condition.targetSource === 'Context' &&
      (projectedGroup === 'controlledOperator' || knownStaticEnemy) &&
      !condition.containsHittableTarget &&
      !condition.excludeDeadEntity &&
      condition.storeKey === '' &&
      operator !== undefined
    ) {
      return {
        kind: 'actionValueCompare',
        left: { kind: 'constant', value: 1 },
        operator,
        right: { kind: 'constant', value: condition.minimumCount },
      };
    }
    if (
      condition.targetSource === 'Target' &&
      condition.targetGroupKey === '' &&
      !condition.excludeDeadEntity &&
      condition.storeKey === '' &&
      (!condition.containsHittableTarget || context.fixedHittableTargetCount !== undefined) &&
      operator !== undefined &&
      ['enemy', 'currentAbilityEntity', 'eventTarget', 'eventSource'].includes(
        context.actionTargetTarget,
      )
    ) {
      // 已绑定单一 ActionTarget 的回调不会以空集合调用；保留为显式常量比较，
      // 不把一般 Context 集合查询错误简化为唯一木桩。
      return {
        kind: 'actionValueCompare',
        left: {
          kind: 'constant',
          value: 1 + (condition.containsHittableTarget ? context.fixedHittableTargetCount! : 0),
        },
        operator,
        right: { kind: 'constant', value: condition.minimumCount },
      };
    }
    if (
      condition.targetSource !== 'Context' ||
      condition.targetGroupKey === '' ||
      condition.containsHittableTarget ||
      condition.excludeDeadEntity ||
      operator === undefined
    ) {
      throw new Error(`${sourcePath}: unsupported Context target count condition`);
    }
    return {
      kind: 'contextTargetCountCompare',
      contextKey: condition.targetGroupKey,
      operator,
      value: condition.minimumCount,
      ...(condition.storeKey === '' ? {} : { outputKey: condition.storeKey }),
    };
  }
  if (condition.kind === 'targetContains') {
    if (
      condition.parent.targetSource !== 'Context' ||
      condition.parent.targetGroupKey === '' ||
      condition.child.targetSource !== 'Target' ||
      condition.child.targetGroupKey !== ''
    ) {
      throw new Error(`${sourcePath}: unsupported target containment sources`);
    }
    return {
      kind: 'contextTargetContains',
      parentContextKey: condition.parent.targetGroupKey,
      child: 'eventTarget',
    };
  }
  if (condition.kind === 'damageTypeMask') {
    return {
      kind: 'eventDamageTypeIn',
      damageTypes: condition.damageTypes.map(damageType => {
        const mapped = DAMAGE_TYPES[damageType];
        if (mapped === undefined) {
          throw new Error(
            `${sourcePath}: unsupported native damage type ${JSON.stringify(damageType)}`,
          );
        }
        return mapped;
      }),
    };
  }
  if (condition.kind === 'damageDecorateMask') {
    const match =
      condition.checkType === 'HasAny'
        ? ('hasAny' as const)
        : condition.checkType === 'HasAll'
          ? ('hasAll' as const)
          : null;
    const tags = [
      ...(condition.mask & 256 ? (['normalSkill'] as const) : []),
      ...(condition.mask & 512 ? (['ultimateSkill'] as const) : []),
      ...(condition.mask & 8192 ? (['comboSkill'] as const) : []),
      ...(condition.mask & 2097152 ? (['normalAttackLastCombo'] as const) : []),
    ];
    const knownMask = 256 | 512 | 8192 | 2097152;
    if (match === null || tags.length === 0 || (condition.mask & ~knownMask) !== 0) {
      throw new Error(`${sourcePath}: unsupported damage decorate mask ${condition.mask}`);
    }
    return { kind: 'eventDamageTagsMatch', match, tags };
  }
  if (condition.kind === 'healTag') {
    return {
      kind: 'eventHealTagsMatch',
      match: condition.queryType,
      tagIds: condition.tagIds,
    };
  }
  if (condition.kind === 'consumeBuffLayer') {
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (operator === undefined) {
      throw new Error(`${sourcePath}: unsupported consumed Buff layer comparison`);
    }
    return {
      kind: 'eventConsumedBuffLayerCompare',
      operator,
      value: actionValueOperand(condition.value),
      ...(condition.outputKey === '' ? {} : { outputKey: condition.outputKey }),
    };
  }
  if (condition.kind === 'physicalInflictionType') {
    if (condition.savedKey !== '')
      throw new Error(`${sourcePath}: physical infliction savedKey is unsupported`);
    return { kind: 'eventPhysicalInflictionTypeIn', types: condition.types };
  }
  if (condition.kind === 'overHeal') {
    return {
      kind: 'eventOverheal',
      ...(condition.overHealKey === '' ? {} : { overHealKey: condition.overHealKey }),
      ...(condition.finalHealKey === '' ? {} : { finalHealKey: condition.finalHealKey }),
      ...(condition.realHealKey === '' ? {} : { realHealKey: condition.realHealKey }),
    };
  }
  if (condition.kind === 'contextBuff') {
    if (condition.matcher.kind === 'id') {
      const buffIds = condition.matcher.buffIds.map(buffId => {
        if (buffId.kind !== 'constant') {
          throw new Error(`${sourcePath}: dynamic event Buff ID conditions are unsupported`);
        }
        return buffId.value;
      });
      return {
        kind: 'eventBuffIdMatch',
        buffIds,
        ...(condition.buffIdOutputKey === undefined
          ? {}
          : { buffIdOutputKey: condition.buffIdOutputKey }),
      };
    }
    const match = TAG_QUERY_TYPES[condition.matcher.queryType];
    if (match === undefined) {
      throw new Error(
        `${sourcePath}: unsupported event Buff tag query ${JSON.stringify(condition.matcher.queryType)}`,
      );
    }
    return {
      kind: 'eventBuffTagsMatch',
      match,
      buffTagIds: condition.matcher.buffTagIds,
      ...(condition.buffIdOutputKey === undefined
        ? {}
        : { buffIdOutputKey: condition.buffIdOutputKey }),
    };
  }
  if (condition.kind === 'objectTypeMatch') {
    if (condition.target.targetSource !== 'Context' || condition.target.targetGroupKey === '') {
      throw new Error(
        `${sourcePath}: unsupported object type target; expected named Context group`,
      );
    }
    return {
      kind: 'contextTargetObjectTypeMatch',
      contextKey: condition.target.targetGroupKey,
      objectTypeMask: parseObjectTypeMask(condition.objectTypeMask, `${sourcePath}.objectTypeMask`),
    };
  }
  if (condition.kind === 'targetIdentity') {
    const first = condition.first;
    const second = condition.second;
    const matchesEventSourceAndTarget =
      first.targetGroupKey === '' &&
      second.targetGroupKey === '' &&
      ((first.targetSource === 'Target' && second.targetSource === 'Source') ||
        (first.targetSource === 'Source' && second.targetSource === 'Target'));
    if (context.actionTargetTarget === 'eventSource') {
      if (matchesEventSourceAndTarget && context.actionSourceTarget === 'buffSource')
        return { kind: 'eventSourceMatchesBuffSource' };
      throw new Error(`${sourcePath}: unsupported receiving Buff event target identity sources`);
    }
    if (!matchesEventSourceAndTarget) {
      const matchesOwnerAndEventTarget =
        first.targetGroupKey === '' &&
        second.targetGroupKey === '' &&
        ((first.targetSource === 'Owner' && second.targetSource === 'Target') ||
          (first.targetSource === 'Target' && second.targetSource === 'Owner'));
      if (matchesOwnerAndEventTarget) {
        return { kind: 'eventActionOwnerTargetMatch', operator: 'equal' };
      }
      throw new Error(`${sourcePath}: unsupported target identity sources`);
    }
    return { kind: 'eventSourceTargetMatch', operator: 'equal' };
  }
  if (condition.kind === 'buffStack') {
    // ByTag 无目标返回 false；不能沿用 Advanced 的零层路径或实例计数。
    if (
      condition.targetSource === 'Context' &&
      condition.targetGroupKey !== '' &&
      condition.sourceType === 'CheckBuffStackNumByTag' &&
      condition.buffCheckType === 'Tag' &&
      condition.countType === 'BuffCount' &&
      !condition.limitSkillCastId
    ) {
      const operator = COMPARISON_OPERATORS[condition.comparison];
      if (operator === undefined)
        throw new Error(`${sourcePath}: unsupported Buff stack comparison`);
      return {
        kind: 'contextTargetBuffStackCompare',
        contextKey: condition.targetGroupKey,
        tagQueryType: condition.tagQueryType,
        buffTagIds: condition.buffTagIds,
        operator,
        value: actionValueOperand(condition.value),
      };
    }
    if (
      (condition.targetSource !== 'Target' &&
        condition.targetSource !== 'Owner' &&
        condition.targetSource !== 'Source') ||
      condition.targetGroupKey !== '' ||
      condition.countType !== 'BuffCount' ||
      condition.limitSkillCastId
    ) {
      throw new Error(`${sourcePath}: unsupported event target Buff count condition`);
    }
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (operator === undefined) {
      throw new Error(`${sourcePath}: unsupported event target Buff count comparison`);
    }
    if (condition.buffCheckType === 'Tag' && condition.buffIds.length === 0) {
      return {
        // 原生 BuffCount 累加增强层数；Source/Owner 不能冒充物理事件目标。
        kind: 'buffStackCompare',
        target:
          condition.targetSource === 'Owner'
            ? buffConditionOwner(context, sourcePath)
            : condition.targetSource === 'Source'
              ? context.actionSourceTarget
              : singleBuffConditionTarget(context, sourcePath),
        tagQueryType: condition.tagQueryType,
        buffTagIds: condition.buffTagIds,
        operator,
        value: actionValueOperand(condition.value),
      };
    }
    if (condition.buffCheckType === 'Id' && condition.buffIds.every(id => id.length > 0)) {
      return {
        kind: 'buffIdStackCompare',
        target:
          condition.targetSource === 'Owner'
            ? buffConditionOwner(context, sourcePath)
            : condition.targetSource === 'Source'
              ? context.actionSourceTarget
              : singleBuffConditionTarget(context, sourcePath),
        buffIds: condition.buffIds,
        operator,
        value: actionValueOperand(condition.value),
      };
    }
    throw new Error(`${sourcePath}: unsupported event target Buff identity condition`);
  }
  if (condition.kind === 'poise') {
    if (condition.target.targetSource !== 'Target' || condition.target.targetGroupKey !== '')
      throw new Error(`${sourcePath}: unsupported poise condition target`);
    const operator = COMPARISON_OPERATORS[condition.comparison];
    if (operator === undefined) throw new Error(`${sourcePath}: unsupported poise comparison`);
    return {
      kind: 'poiseCompare',
      target: 'enemy',
      returnValueIfMissing: condition.returnValueIfMissing,
      operator,
      value: actionValueOperand(condition.value),
    };
  }
  if (condition.kind === 'any') {
    const groups = condition.groups.map(group => {
      const conditions = group.conditions.map((child, index) => {
        const compiled = compileConditionLeaf(child, sourcePath, context);
        return group.negated[index] ? ({ kind: 'not', condition: compiled } as const) : compiled;
      });
      return conditions.length === 1 ? conditions[0]! : ({ kind: 'all', conditions } as const);
    });
    return groups.length === 1 ? groups[0]! : { kind: 'any', conditions: groups };
  }
  if (condition.kind === 'globalCooldown') {
    const target =
      condition.targetSource === 'Owner'
        ? ('caster' as const)
        : condition.targetSource === 'Source'
          ? context.actionSourceTarget
          : null;
    if (target !== 'caster' || condition.targetGroupKey !== '' || condition.buffId.length === 0) {
      throw new Error(`${sourcePath}: unsupported global cooldown condition target`);
    }
    return {
      kind: 'not',
      condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: condition.buffId },
    };
  }
  if (condition.kind === 'timedMarker') {
    if (context.actionTargetTarget === 'eventSource' && condition.targetSource === 'Target')
      throw new Error(`${sourcePath}: unaudited receiving Buff event marker target`);
    const target =
      condition.targetSource === 'Target'
        ? ('eventTarget' as const)
        : condition.targetSource === 'Owner'
          ? requireActionOwnerProjection(context, sourcePath)
          : condition.targetSource === 'Source'
            ? context.actionSourceTarget
            : null;
    if (
      (target !== 'caster' &&
        target !== 'eventTarget' &&
        target !== 'buffOwner' &&
        target !== 'buffSource') ||
      condition.targetGroupKey !== '' ||
      condition.useBlackboardKey ||
      condition.blackboardKey !== '' ||
      condition.markerId.length === 0
    ) {
      throw new Error(`${sourcePath}: unsupported timed marker condition`);
    }
    const present = {
      kind: 'timedMarkerPresent' as const,
      target,
      markerId: condition.markerId,
    };
    return condition.returnTrueIfNotExists ? { kind: 'not', condition: present } : present;
  }
  throw new Error(`${sourcePath}: unsupported Buff runtime condition ${condition.kind}`);
}

function singleBuffConditionTarget(
  context: CombatActionProjectionContextSource,
  sourcePath: string,
): 'enemy' | 'buffOwner' | 'currentAbilityEntity' | 'eventTarget' {
  if (
    context.actionTargetTarget === 'enemy' ||
    context.actionTargetTarget === 'buffOwner' ||
    context.actionTargetTarget === 'eventTarget' ||
    context.actionTargetTarget === 'currentAbilityEntity'
  ) {
    return context.actionTargetTarget;
  }
  throw new Error(`${sourcePath}: unsupported single Buff condition target`);
}

function buffConditionOwner(context: CombatActionProjectionContextSource, sourcePath: string) {
  return context.actionOwnerTarget === 'currentAbilityEntity'
    ? ('currentAbilityEntity' as const)
    : requireActionOwnerProjection(context, sourcePath);
}

const SKILL_TYPES: Readonly<Record<string, 'battleSkill' | 'comboSkill' | 'ultimate'>> = {
  NormalSkill: 'battleSkill',
  ComboSkill: 'comboSkill',
  UltimateSkill: 'ultimate',
};

const TAG_QUERY_TYPES: Readonly<Record<string, 'hasAny' | 'hasAll' | 'exceptAny' | 'exceptAll'>> = {
  HasAny: 'hasAny',
  HasAll: 'hasAll',
  ExceptAny: 'exceptAny',
  ExceptAll: 'exceptAll',
  hasAny: 'hasAny',
  hasAll: 'hasAll',
  exceptAny: 'exceptAny',
  exceptAll: 'exceptAll',
};
