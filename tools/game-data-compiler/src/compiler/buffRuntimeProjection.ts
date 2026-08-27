import {
  compileResolvedAttributeModifierSource,
  projectCombatRuntimeAttributeKey,
} from './attributeModifier.ts';
import {
  collectNativeActionNodes,
  type NativeActionNodeSource,
  type NativeSequenceSource,
} from '../source/controlFlow.ts';
import type {
  BuffPresentationSource,
  BuffRuntimeSource,
  BuffStackingTypeSource,
} from '../source/buffRuntime.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { BuffStackingType } from '../../../../packages/game-data-contract/src/buffs.ts';
import type {
  CompiledBuffPresentationSource,
  CompiledBuffDamageModifierSource,
  CompiledBuffHealModifierSource,
  CompiledBuffPoiseModifierSource,
  CompiledBuffDefinitionSource,
} from './buffProjectionTypes.ts';
import type {
  CompiledBuffConditionSource,
  CompiledBuffSequenceSource,
  CompiledBuffStepSource,
} from './combatActionProjectionTypes.ts';
import { projectTimelineJump } from './timelineControlProjection.ts';
import { compileAbilityEventPrograms } from './abilityEventProgram.ts';
import {
  compileActionSequenceProgram,
  type CompileActionSequenceProgramOptions,
} from './actionSequenceProgram.ts';
import {
  type ProjectedTargetGroup,
  type CombatActionProjectionContextSource,
  type CombatActionProjectionExtensionsSource,
  BUFF_ACTION_CONTEXT,
  isStaticSingleEnemyTargetGroup,
  isPartyExceptOwnerInstantSearch,
  scalarOperand,
  DAMAGE_TYPES,
  COMPARISON_OPERATORS,
} from './combatProjectionCommon.ts';
import { compileBuffLeafNode } from './combatEntityAndTimeProjection.ts';
import { compileEventCondition, conditionWritesBlackboard } from './combatConditionProjection.ts';

export { collectBuffRuntimeClosure } from './buffReferenceClosure.ts';
// 兼容已有公共入口；类型的唯一声明不再夹在投影实现中。
export type {
  CompiledBuffNumberSource,
  CompiledBuffPresentationSource,
  CompiledBuffAttributeModifierSource,
  CompiledBuffDamageModifierSource,
  CompiledBuffHealModifierSource,
  CompiledBuffPoiseModifierSource,
  CompiledBuffDefinitionSource,
} from './buffProjectionTypes.ts';
export type {
  CompiledBuffConditionSource,
  CompiledBuffSequenceSource,
  CompiledBuffStepSource,
} from './combatActionProjectionTypes.ts';
export type {
  CombatActionProjectionContextSource,
  CombatActionProjectionExtensionsSource,
} from './combatProjectionCommon.ts';
// buff-lifecycle.md：Start/Enable 没有外部能力事件，Source 是创建者，Target/InputTarget 是持有者。
// 生命周期执行器以 Buff 来源绑定 caster；不能从不存在的 event 中读取来源或目标。
const BUFF_LIFECYCLE_CONTEXT: CombatActionProjectionContextSource = {
  actionOwnerTarget: 'buffOwner',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'buffOwner',
};

// before-output-buff.md / Buff.BindAbilityEventEnvironment：205 的输入是新 Buff 施加者，
// 但监听 Buff 的 ActionSource 始终是该监听器的创建者，不能用物理事件 sourceId 替代。
const BUFF_BEFORE_ADDED_CONTEXT: CombatActionProjectionContextSource = {
  actionOwnerTarget: 'buffOwner',
  actionSourceTarget: 'buffSource',
  actionTargetTarget: 'eventSource',
};

type CompiledBuffAbilityEvent = NonNullable<
  CompiledBuffDefinitionSource['abilityEventResponses']
>[number]['event'];

const BUFF_ABILITY_EVENTS: Readonly<Record<string, CompiledBuffAbilityEvent>> = {
  OnBeforeCastSkill: 'beforeCastSkill',
  OnBeforeCalculateDamage: 'beforeCalculateDamage',
  OnEnterFight: 'enterFight',
  OnOutputBuff: 'outputBuff',
  OnBeforeOutputBuff: 'beforeOutputBuff',
  OnBeforeAddedBuff: 'beforeAddedBuff',
  OnBeforeOutputPhysicalInfliction: 'beforeOutputPhysicalInfliction',
  OnAfterOutputPhysicalInfliction: 'afterOutputPhysicalInfliction',
  OnOutputDamage: 'outputDamage',
  OnCharBeforeOutputSpellInfliction: 'beforeOutputInfliction',
  OnCharBeforeOutputSpellBurst: 'beforeOutputSpellBurst',
  OnOutputCriticalDamage: 'outputCriticalDamage',
  OnOutputHeal: 'outputHeal',
  OnObtainAtb: 'skillSpGained',
  OnConsumeBuff: 'buffConsumed',
};

function projectBuffAbilityEvent(
  event: string | number,
  sourcePath: string,
): CompiledBuffAbilityEvent {
  if (typeof event !== 'string' || BUFF_ABILITY_EVENTS[event] === undefined) {
    throw new Error(`${sourcePath}: unsupported ability event ${JSON.stringify(event)}`);
  }
  return BUFF_ABILITY_EVENTS[event]!;
}

export function buffRuntimeReadsBlackboardKey(source: BuffRuntimeSource, key: string): boolean {
  const readFieldNames = new Set(['blackboardKey', 'inputValueKey', 'buffIdKey']);
  const visit = (value: unknown): boolean => {
    if (Array.isArray(value)) return value.some(visit);
    if (value === null || typeof value !== 'object') return false;
    for (const [field, child] of Object.entries(value)) {
      if (readFieldNames.has(field) && child === key) return true;
      if (visit(child)) return true;
    }
    return false;
  };
  return visit(source);
}

export function compileBuffRuntimeDefinitionSource(
  source: BuffRuntimeSource,
  visualOnlyIds: ReadonlySet<string> = new Set(),
  omittedAbilityEvents: ReadonlySet<string | number> = new Set(),
  extensions: CombatActionProjectionExtensionsSource = {},
  abilityEntityQueries?: CombatActionProjectionContextSource['abilityEntityQueries'],
  contextOverrides: Pick<CombatActionProjectionContextSource, 'fixedBuffOwnerTarget'> = {},
): CompiledBuffDefinitionSource {
  if (source.unsupportedPayloads.length > 0) {
    throw new Error(
      `unsupported Buff payloads: ${source.unsupportedPayloads.map(item => item.field).join(', ')}`,
    );
  }
  if (source.graph.timelineActions.length > 0 || source.graph.igniteEvents.length > 0) {
    throw new Error(
      'Buff timelines and ignite events are not yet supported by the runtime projector',
    );
  }
  const startSequences: CompiledBuffSequenceSource[] = [];
  const enableSequences: CompiledBuffSequenceSource[] = [];
  const triggerSequences: CompiledBuffSequenceSource[] = [];
  const enhanceChangedSequences: CompiledBuffSequenceSource[] = [];
  const finishSequences: CompiledBuffSequenceSource[] = [];
  const allSequences = [
    ...source.graph.timelineActions.map(item => item.sequence),
    ...source.graph.buffEvents.flatMap(item => item.actions),
    ...source.graph.abilityEvents.flatMap(item => item.actions),
    ...source.graph.igniteEvents.flatMap(item => item.actions),
  ];
  const staticEnemyTargetGroupKeys = new Set(
    allSequences
      .flatMap(sequence => collectNativeActionNodes(sequence))
      .flatMap(node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'targetGroup' &&
        isStaticSingleEnemyTargetGroup(node.body.value.action) &&
        (contextOverrides.fixedBuffOwnerTarget === 'caster' ||
          contextOverrides.fixedBuffOwnerTarget === 'currentAbilityEntity')
          ? [node.body.value.action.targetGroupKey]
          : [],
      ),
  );
  const projectionContextOverrides = {
    ...contextOverrides,
    ...(staticEnemyTargetGroupKeys.size === 0 ? {} : { staticEnemyTargetGroupKeys }),
  };
  let finishesWithSourceSkill = false;
  for (const event of source.graph.buffEvents) {
    const target =
      event.event === 'OnBuffStart'
        ? startSequences
        : event.event === 'DuringBuffEnable'
          ? enableSequences
          : event.event === 'OnBuffTrigger'
            ? triggerSequences
            : event.event === 'OnBuffEnhanceChanged'
              ? enhanceChangedSequences
              : event.event === 'OnBuffFinish'
                ? finishSequences
                : null;
    if (target === null) throw new Error(`unsupported Buff event ${JSON.stringify(event.event)}`);
    for (const sequence of event.actions) {
      const skillAffixBody =
        event.event === 'DuringBuffEnable' ? splitDirectSkillAffixSequence(sequence) : null;
      if (skillAffixBody !== null) {
        finishesWithSourceSkill = true;
      }
      // Finish/EnhanceChanged 可由其它实体触发，来源绑定需另行恢复，不能沿用启动身份。
      const compiled = compileLinearSequence(
        skillAffixBody ?? sequence,
        visualOnlyIds,
        event.event === 'OnBuffStart' || event.event === 'DuringBuffEnable'
          ? { ...BUFF_LIFECYCLE_CONTEXT, abilityEntityQueries, ...projectionContextOverrides }
          : { ...BUFF_ACTION_CONTEXT, abilityEntityQueries, ...projectionContextOverrides },
        extensions,
      );
      if (compiled.steps.length > 0) target.push(compiled);
    }
  }
  const abilityEventResponses = compileAbilityEventPrograms(
    source.graph.abilityEvents.map(event => ({
      abilityEvent: event.event,
      actions: event.actions,
    })),
    {
      sourcePath: `BuffData.${source.graph.buffId}.abilityEventAction`,
      omitEvent: event => omittedAbilityEvents.has(event),
      mapEvent: projectBuffAbilityEvent,
      compileSequence: (sequence, _sequencePath, abilityEvent) =>
        abilityEvent === 'OnObtainAtb'
          ? compileSkillSpGainSequence(
              sequence,
              visualOnlyIds,
              { ...BUFF_ACTION_CONTEXT, ...projectionContextOverrides },
              extensions,
            )
          : compileLinearSequence(
              sequence,
              visualOnlyIds,
              abilityEvent === 'OnBeforeAddedBuff'
                ? {
                    ...BUFF_BEFORE_ADDED_CONTEXT,
                    abilityEntityQueries,
                    ...projectionContextOverrides,
                  }
                : {
                    ...BUFF_ACTION_CONTEXT,
                    abilityEntityQueries,
                    ...projectionContextOverrides,
                  },
              extensions,
            ),
      isEmptySequence: sequence => sequence.steps.length === 0,
    },
  ).map(({ event, priority, sequence }) => ({ event, priority, sequence }));
  if (finishesWithSourceSkill) {
    abilityEventResponses.push({
      event: 'skillEnd',
      priority: 0,
      sequence: {
        steps: [
          {
            kind: 'conditional',
            parameters: { condition: { kind: 'eventSkillCastMatchesBuffSource' } },
            whenTrue: {
              steps: [{ kind: 'finishCurrentBuff', parameters: { reason: 'other' } }],
            },
          },
        ],
      },
    });
  }
  const blackboard = Object.fromEntries(
    source.graph.declaredBlackboard.map(item => [item.key, item.value]),
  );
  return {
    stackingType: STACKING_TYPES[source.lifecycle.stackingType],
    ...(source.lifecycle.stackingIdentifierType === 'StackingKey'
      ? { stackingKey: source.lifecycle.stackingKey }
      : {}),
    priority:
      source.lifecycle.priority.blackboardKey === null
        ? signed(source.lifecycle.priority.value, source.lifecycle.negatePriority)
        : {
            blackboardKey: source.lifecycle.priority.blackboardKey,
            ...(source.lifecycle.negatePriority ? { negate: true as const } : {}),
          },
    maxStackCount: scalarOperand(source.lifecycle.maxStackCount),
    ...(source.lifecycle.lifeType === 'Limited'
      ? { durationSeconds: scalarOperand(source.lifecycle.duration) }
      : {}),
    ...(source.lifecycle.triggerInterval.value < 0 &&
    source.lifecycle.triggerInterval.blackboardKey === null
      ? {}
      : {
          triggerIntervalSeconds: scalarOperand(source.lifecycle.triggerInterval),
          waitFirstTriggerInterval: source.lifecycle.waitFirstTriggerInterval,
          maxTriggerCount: scalarOperand(source.lifecycle.maxTriggerCount),
        }),
    ...(source.graph.useTimeDilationDeltaTime
      ? {
          timeClock: source.graph.onlyUseSelfTimeDilation ? ('self' as const) : ('global' as const),
        }
      : {}),
    ...(source.presentation.hasIcon || source.presentation.spritePath !== ''
      ? { presentation: compilePresentation(source.presentation) }
      : {}),
    applyTagIds: source.applyTagIds,
    extendTagIds: source.extendTagIds,
    blackboard,
    attributeModifiers: source.attributeModifiers.modifiers.map((modifier, index) => {
      if (modifier.modifyAttributeType !== 'Specific') {
        throw new Error(
          `attributeModifiers[${index}]: unsupported target ${modifier.modifyAttributeType}`,
        );
      }
      const compiled = compileResolvedAttributeModifierSource({
        sourcePath: `BuffData.${source.graph.buffId}.attributeModifier.attributeModifiers[${index}]`,
        modifyAttributeType: modifier.modifyAttributeType,
        attributeType: modifier.attributeType,
        formulaItem: modifier.formulaItem,
        value: 0,
      });
      return {
        attribute: projectCombatRuntimeAttributeKey(modifier.attributeType),
        slot: compiled.slot,
        value: scalarOperand(modifier.parameter),
      };
    }),
    ...compileBuffDamageModifiers(source),
    ...compileBuffHealModifiers(source),
    ...compileBuffPoiseModifiers(source),
    ...compileBuffShields(source),
    ...(startSequences.length === 0 &&
    enableSequences.length === 0 &&
    triggerSequences.length === 0 &&
    enhanceChangedSequences.length === 0 &&
    finishSequences.length === 0
      ? {}
      : {
          lifecycleSequences: {
            ...(startSequences.length === 0 ? {} : { start: mergeSequences(startSequences) }),
            ...(enableSequences.length === 0 ? {} : { enable: mergeSequences(enableSequences) }),
            ...(triggerSequences.length === 0 ? {} : { trigger: mergeSequences(triggerSequences) }),
            ...(enhanceChangedSequences.length === 0
              ? {}
              : { enhanceChanged: mergeSequences(enhanceChangedSequences) }),
            ...(finishSequences.length === 0 ? {} : { finish: mergeSequences(finishSequences) }),
          },
        }),
    ...(abilityEventResponses.length === 0 ? {} : { abilityEventResponses }),
  };
}

function splitDirectSkillAffixSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
): NativeSequenceSource<KnownNativeActionLeafSource> | null {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    return null;
  }
  const nodes = source.actions.filter(node => node.metadata.enabled);
  const affixes = nodes.filter(
    node => node.body.kind === 'leaf' && node.body.value.family === 'skillAffix',
  );
  if (affixes.length !== 1 || affixes[0] !== nodes.at(-1)) return null;
  return { ...source, actions: source.actions.filter(node => node !== affixes[0]) };
}

function compileBuffDamageModifiers(source: BuffRuntimeSource): {
  readonly damageModifiers?: readonly CompiledBuffDamageModifierSource[];
} {
  const modifiers = source.damageModifiers.map((modifier, index) => {
    const condition = compileDamageModifierCondition(modifier.condition, index);
    const enabledSide = DAMAGE_MODIFIER_SIDES[modifier.enabledSide];
    if (enabledSide === undefined) {
      throw new Error(
        `damageModifier[${index}]: unsupported enabled side ${JSON.stringify(modifier.enabledSide)}`,
      );
    }
    const processors = modifier.processors.map((processor, processorIndex) => {
      const processorPath = `damageModifier[${index}].damageProcessors[${processorIndex}]`;
      if (processor.kind === 'damageScale') {
        const side = DAMAGE_MODIFIER_SIDES[processor.side];
        const zone = DAMAGE_SCALE_ZONES[processor.zoneName];
        if (side === undefined || zone === undefined) {
          throw new Error(`${processorPath}: unsupported side/zone`);
        }
        return {
          kind: 'damageScale' as const,
          side,
          zone,
          addition: scalarOperand(processor.addition),
        };
      }
      const targetSide = DAMAGE_MODIFIER_SIDES[processor.targetSide];
      if (targetSide === undefined || processor.modifyAttributeType !== 'Specific') {
        throw new Error(`${processorPath}: unsupported instant attribute target`);
      }
      const compiled = compileResolvedAttributeModifierSource({
        sourcePath: processorPath,
        modifyAttributeType: processor.modifyAttributeType,
        attributeType: processor.attributeType,
        formulaItem: processor.formulaItem,
        value: 0,
      });
      return {
        kind: 'instantAttribute' as const,
        targetSide,
        attribute: projectCombatRuntimeAttributeKey(processor.attributeType),
        values: { slot: compiled.slot, value: scalarOperand(processor.parameter) },
        attributeTiming: 'runtime' as const,
      };
    });
    if (processors.length === 0) {
      throw new Error(`damageModifier[${index}]: expected at least one processor`);
    }
    return { enabledSide, ...(condition === undefined ? {} : { condition }), processors };
  });
  return modifiers.length === 0 ? {} : { damageModifiers: modifiers };
}

function compileBuffHealModifiers(source: BuffRuntimeSource): {
  readonly healModifiers?: readonly CompiledBuffHealModifierSource[];
} {
  const modifiers = source.healModifiers.map((modifier, modifierIndex) => {
    const enabledSide =
      modifier.enabledSide === 'Healer'
        ? ('healer' as const)
        : modifier.enabledSide === 'HealReceiver'
          ? ('receiver' as const)
          : null;
    if (enabledSide === null) {
      throw new Error(
        `healModifier[${modifierIndex}]: unsupported enabled side ${JSON.stringify(modifier.enabledSide)}`,
      );
    }
    const nodes = modifier.condition.actions.filter(node => node.metadata.enabled);
    if (
      modifier.condition.onlyExecuteWhenSourceIsMainCharacter ||
      modifier.condition.onlyExecuteWhenSourceIsGuard ||
      nodes.length > 1
    ) {
      throw new Error(`healModifier[${modifierIndex}]: unsupported condition sequence`);
    }
    const condition = nodes.length === 0 ? undefined : compileHealModifierCondition(nodes[0]!);
    const processors = modifier.processors.map((processor, processorIndex) => {
      const targetSide =
        processor.modifyTargetSide === 'Attacker'
          ? ('healer' as const)
          : processor.modifyTargetSide === 'Defender'
            ? ('receiver' as const)
            : null;
      const expectedAttribute =
        targetSide === 'healer' ? 'HealOutputIncrease' : 'HealTakenIncrease';
      if (
        targetSide === null ||
        processor.modifier.modifyAttributeType !== 'Specific' ||
        processor.modifier.attributeType !== expectedAttribute ||
        processor.modifier.formulaItem !== 'BaseAddition'
      ) {
        throw new Error(
          `healModifier[${modifierIndex}].healProcessors[${processorIndex}]: unsupported instant healing attribute modifier`,
        );
      }
      return {
        kind: 'modifyHealingIncrease' as const,
        timing: 'beforeCalculation' as const,
        side: targetSide,
        addition: scalarOperand(processor.modifier.parameter),
      };
    });
    if (processors.length === 0) {
      throw new Error(`healModifier[${modifierIndex}]: expected at least one processor`);
    }
    return { enabledSide, ...(condition === undefined ? {} : { condition }), processors };
  });
  return modifiers.length === 0 ? {} : { healModifiers: modifiers };
}

function compileHealModifierCondition(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
): NonNullable<CompiledBuffHealModifierSource['condition']> {
  if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') {
    throw new Error(`${node.sourcePath}: expected a heal modifier condition`);
  }
  const condition = node.body.value.action;
  if (condition.kind !== 'healTag') {
    throw new Error(`${node.sourcePath}: unsupported heal modifier condition ${condition.kind}`);
  }
  const match =
    condition.queryType === 'hasAny'
      ? 'hasAny'
      : condition.queryType === 'hasAll'
        ? 'hasAll'
        : null;
  if (match === null) {
    throw new Error(`${node.sourcePath}: unsupported heal tag query ${condition.queryType}`);
  }
  return { kind: 'healTagsMatch', match, tagIds: condition.tagIds };
}

function compileBuffPoiseModifiers(source: BuffRuntimeSource): {
  readonly poiseModifiers?: readonly CompiledBuffPoiseModifierSource[];
} {
  const modifiers = source.poiseModifiers.map((modifier, modifierIndex) => {
    const enabledSide =
      modifier.enabledSide === 'Attacker'
        ? ('attacker' as const)
        : modifier.enabledSide === 'Defender'
          ? ('defender' as const)
          : null;
    if (enabledSide === null) {
      throw new Error(
        `poiseModifier[${modifierIndex}]: unsupported enabled side ${JSON.stringify(modifier.enabledSide)}`,
      );
    }
    const condition = compilePoiseModifierCondition(modifier.condition, modifierIndex);
    const processors = modifier.processors.map((processor, processorIndex) => {
      const side =
        processor.modifyTargetSide === 'Attacker'
          ? ('attacker' as const)
          : processor.modifyTargetSide === 'Defender'
            ? ('defender' as const)
            : null;
      const expectedAttribute =
        side === 'attacker' ? 'PoiseDamageOutputScalar' : 'PoiseDamageTakenScalar';
      if (
        side === null ||
        processor.modifier.modifyAttributeType !== 'Specific' ||
        processor.modifier.attributeType !== expectedAttribute ||
        processor.modifier.formulaItem !== 'BaseAddition'
      ) {
        throw new Error(
          `poiseModifier[${modifierIndex}].poiseProcessors[${processorIndex}]: unsupported instant poise attribute modifier`,
        );
      }
      return {
        kind: 'modifyPoiseScalar' as const,
        timing: 'beforeCalculation' as const,
        side,
        addition: scalarOperand(processor.modifier.parameter),
      };
    });
    if (processors.length === 0) {
      throw new Error(`poiseModifier[${modifierIndex}]: expected at least one processor`);
    }
    return { enabledSide, ...(condition === undefined ? {} : { condition }), processors };
  });
  return modifiers.length === 0 ? {} : { poiseModifiers: modifiers };
}

function compilePoiseModifierCondition(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  modifierIndex: number,
): CompiledBuffPoiseModifierSource['condition'] | undefined {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error(`poiseModifier[${modifierIndex}]: root condition filters are unsupported`);
  }
  const conditions = source.actions
    .filter(node => node.metadata.enabled)
    .map(node => {
      if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') {
        throw new Error(`${node.sourcePath}: expected a poise modifier condition`);
      }
      const condition = node.body.value.action;
      if (condition.kind === 'mainOperator') {
        if (condition.targetSource !== 'Source' || condition.targetGroupKey !== '') {
          throw new Error(`${node.sourcePath}: unsupported poise main-character target`);
        }
        return { kind: 'casterControlled' as const };
      }
      if (condition.kind === 'damageDecorateMask') {
        if (
          (condition.checkType !== 'HasAny' && condition.checkType !== 'HasAll') ||
          condition.mask !== 2097152
        ) {
          throw new Error(`${node.sourcePath}: unsupported poise decorate mask ${condition.mask}`);
        }
        return {
          kind: 'eventDamageTagsMatch' as const,
          match: condition.checkType === 'HasAny' ? ('hasAny' as const) : ('hasAll' as const),
          tags: ['normalAttackLastCombo'] as const,
        };
      }
      throw new Error(`${node.sourcePath}: unsupported poise modifier condition ${condition.kind}`);
    });
  if (conditions.length === 0) return undefined;
  return conditions.length === 1 ? conditions[0] : { kind: 'all', conditions };
}

function compileBuffShields(source: BuffRuntimeSource): {
  readonly shields?: NonNullable<CompiledBuffDefinitionSource['shields']>;
} {
  const shields = source.shields.map((shield, shieldIndex) => {
    if (shield.applyScale) {
      throw new Error(
        `shieldConfigs[${shieldIndex}]: scaled DefiniteValueCalculation is unsupported`,
      );
    }
    const priority =
      shield.priority === 'Normal'
        ? ('normal' as const)
        : shield.priority === 'PrioritizeConsume'
          ? ('prioritizeConsume' as const)
          : null;
    if (priority === null) {
      throw new Error(
        `shieldConfigs[${shieldIndex}]: unsupported priority ${JSON.stringify(shield.priority)}`,
      );
    }
    return {
      infinityValue: shield.infinityValue,
      value: scalarOperand(shield.value),
      damageAbsorptions: shield.damageAbsorptions.map((absorption, absorptionIndex) => {
        const damageType = DAMAGE_TYPES[absorption.damageType];
        if (damageType === undefined) {
          throw new Error(
            `shieldConfigs[${shieldIndex}].damageAbsorptions[${absorptionIndex}]: unsupported damage type ${JSON.stringify(absorption.damageType)}`,
          );
        }
        return {
          damageType,
          ratio: scalarOperand(absorption.ratio),
          scale: scalarOperand(absorption.scale),
        };
      }),
      absorbCount:
        shield.absorbCount.blackboardKey === null
          ? shield.absorbCount.value
          : { blackboardKey: shield.absorbCount.blackboardKey },
      absorbAllDamageWhenConsumed: shield.absorbAllDamageWhenConsumed,
      removeBuffWhenConsumed: shield.removeBuffWhenConsumed,
      priority,
      replaceHitEffect: shield.replaceHitEffect,
    };
  });
  return shields.length === 0 ? {} : { shields };
}

function compileDamageModifierCondition(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  modifierIndex: number,
): CompiledBuffDamageModifierSource['condition'] | undefined {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error(`damageModifier[${modifierIndex}]: root condition filters are unsupported`);
  }
  const conditions = source.actions
    .filter(node => node.metadata.enabled)
    .map(node => {
      if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') {
        throw new Error(`${node.sourcePath}: expected a damage modifier condition`);
      }
      const condition = node.body.value.action;
      if (condition.kind === 'skillCastId') return { kind: 'sourceSkillCastMatch' as const };
      if (condition.kind === 'damageType') {
        return {
          kind: 'eventDamageTypesMatch' as const,
          damageTypes: [condition.damageType] as readonly (
            'physical' | 'true' | 'heat' | 'electric' | 'cryo' | 'lifeDrain' | 'nature' | 'ether'
          )[],
        };
      }
      if (condition.kind === 'damageTypeMask') {
        return {
          kind: 'eventDamageTypesMatch' as const,
          damageTypes: condition.damageTypes.map(damageType => {
            const mapped = DAMAGE_TYPES[damageType];
            if (mapped === undefined) {
              throw new Error(
                `${node.sourcePath}: unsupported native damage type ${JSON.stringify(damageType)}`,
              );
            }
            return mapped;
          }),
        };
      }
      if (condition.kind === 'entityTag') {
        if (condition.targetSource !== 'Target') {
          throw new Error(`${node.sourcePath}: unsupported damage modifier entity tag target`);
        }
        return {
          kind: 'entityTagMatch' as const,
          target: 'enemy' as const,
          tagQueryType: condition.tagQueryType,
          tagIds: condition.tagIds,
        };
      }
      if (condition.kind === 'buffStack') {
        const operator = COMPARISON_OPERATORS[condition.comparison];
        if (
          condition.targetSource !== 'Target' ||
          condition.targetGroupKey !== '' ||
          condition.buffCheckType !== 'Id' ||
          condition.buffIds.length === 0 ||
          condition.buffIds.some(id => id.length === 0) ||
          condition.buffTagIds.length !== 0 ||
          condition.countType !== 'BuffCount' ||
          condition.limitSkillCastId ||
          operator === undefined
        ) {
          throw new Error(`${node.sourcePath}: unsupported damage modifier Buff count condition`);
        }
        return {
          kind: 'buffIdCountCompare' as const,
          target: 'enemy' as const,
          buffIds: condition.buffIds,
          operator,
          value: scalarOperand(condition.value),
        };
      }
      if (condition.kind === 'poise') {
        const operator = COMPARISON_OPERATORS[condition.comparison];
        if (
          condition.target.targetSource !== 'Target' ||
          condition.target.targetGroupKey !== '' ||
          operator === undefined
        ) {
          throw new Error(`${node.sourcePath}: unsupported damage modifier poise condition`);
        }
        return {
          kind: 'targetPoiseCompare' as const,
          target: 'enemy' as const,
          returnValueIfMissing: condition.returnValueIfMissing,
          operator,
          value: scalarOperand(condition.value),
        };
      }
      if (
        condition.kind === 'damageDecorateMask' &&
        (condition.checkType === 'HasAny' || condition.checkType === 'HasAll')
      ) {
        const tags = [
          ...(condition.mask & 256 ? (['normalSkill'] as const) : []),
          ...(condition.mask & 512 ? (['ultimateSkill'] as const) : []),
          ...(condition.mask & 8192 ? (['comboSkill'] as const) : []),
        ];
        const knownMask = 256 | 512 | 8192;
        if (tags.length === 0 || (condition.mask & ~knownMask) !== 0) {
          throw new Error(`${node.sourcePath}: unsupported damage decorate mask ${condition.mask}`);
        }
        return {
          kind: 'eventDamageTagsMatch' as const,
          match: condition.checkType === 'HasAny' ? ('hasAny' as const) : ('hasAll' as const),
          tags,
        };
      }
      throw new Error(
        `${node.sourcePath}: unsupported damage modifier condition ${condition.kind}`,
      );
    });
  if (conditions.length === 0) return undefined;
  return conditions.length === 1 ? conditions[0] : { kind: 'all', conditions };
}

function compileSkillSpGainSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
  extensions: CombatActionProjectionExtensionsSource = {},
): CompiledBuffSequenceSource {
  if (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) {
    throw new Error('OnObtainAtb sequence owner/guard root filters are unsupported');
  }
  const nodes = source.actions.filter(node => node.metadata.enabled);
  const [filter] = nodes;
  if (
    filter?.body.kind !== 'leaf' ||
    filter.body.value.family !== 'condition' ||
    filter.body.value.action.kind !== 'obtainAtbType'
  ) {
    throw new Error('OnObtainAtb response must begin with CheckObtainAtbType');
  }
  const condition = filter.body.value.action;
  if (
    (condition.checkObtainType &&
      (condition.obtainTypes.length !== 1 || condition.obtainTypes[0] !== 'Skill')) ||
    (condition.checkObtainMethod &&
      (condition.obtainMethods.length !== 1 || condition.obtainMethods[0] !== 'Gain'))
  ) {
    throw new Error(`${filter.sourcePath}: unsupported CheckObtainAtbType filter`);
  }
  return compileLinearSequence(source, visualOnlyIds, context, extensions);
}

/** 主动命中切片、被动技能、Buff、武器与装备共享的 Action/Condition 序列投影入口。 */
export function compileCombatActionSequenceSource(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  context: CombatActionProjectionContextSource,
  visualOnlyIds: ReadonlySet<string> = new Set(),
  extensions: CombatActionProjectionExtensionsSource = {},
): CompiledBuffSequenceSource {
  return compileLinearSequence(source, visualOnlyIds, context, extensions);
}

/** 连携等调用方消费整个序列的布尔结果；即使尾条件不写黑板，也不能删除。 */
export function compileCombatConditionSequenceSource(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  context: CombatActionProjectionContextSource,
  visualOnlyIds: ReadonlySet<string> = new Set(),
): CompiledBuffSequenceSource {
  return compileActionSequenceProgram(source, {
    ...createBuffSequenceProjection(visualOnlyIds, context),
    canOmitTerminalCondition: () => false,
  });
}

/** OnObtainAtb 在公共事件映射前先严格融合 Skill + Gain 前缀条件。 */
export function compileSkillSpGainActionSequenceSource(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  context: CombatActionProjectionContextSource,
  visualOnlyIds: ReadonlySet<string> = new Set(),
): CompiledBuffSequenceSource {
  return compileSkillSpGainSequence(source, visualOnlyIds, context);
}

function compileLinearSequence(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
  visualOnlyIds: ReadonlySet<string>,
  context: CombatActionProjectionContextSource = BUFF_ACTION_CONTEXT,
  extensions: CombatActionProjectionExtensionsSource = {},
): CompiledBuffSequenceSource {
  assertPresentationCalculationIsolation(source);
  assertSpatialContextWriteIsolation(source);
  if (
    (source.onlyExecuteWhenSourceIsMainCharacter || source.onlyExecuteWhenSourceIsGuard) &&
    collectNativeActionNodes(source)
      .filter(node => node.metadata.enabled)
      .every(
        node =>
          node.body.kind !== 'leaf' ||
          ['presentation', 'presentationCalculation', 'spatial', 'selfDefense'].includes(
            node.body.value.family,
          ),
      )
  ) {
    return { steps: [] };
  }
  return compileActionSequenceProgram(
    source,
    createBuffSequenceProjection(visualOnlyIds, context, extensions),
  );
}

/** 选点动作写出的 Context 只能进入空间动作；一旦被战斗动作读取就必须恢复真实几何。 */
function assertSpatialContextWriteIsolation(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
): void {
  const leaves = collectNativeActionNodes(source).filter(
    node => node.body.kind === 'leaf',
  ) as NativeActionNodeSource<KnownNativeActionLeafSource>[];
  for (const node of leaves) {
    if (
      node.body.kind !== 'leaf' ||
      node.body.value.family !== 'spatial' ||
      node.body.value.action.kind !== 'teleportPositionSelection'
    )
      continue;
    const key = node.body.value.action.outputContextKey;
    for (const consumer of leaves) {
      if (consumer === node || consumer.body.kind !== 'leaf') continue;
      if (!JSON.stringify(consumer.body.value.action).includes(JSON.stringify(key))) continue;
      if (
        consumer.body.value.family !== 'spatial' &&
        !(
          consumer.body.value.family === 'condition' &&
          consumer.body.value.action.kind === 'distance'
        )
      ) {
        throw new Error(
          `${node.sourcePath}: spatial output ${key} reaches combat action ${consumer.sourcePath}`,
        );
      }
    }
  }
}

/** 只有全部消费者仍属于无渲染支链时，角度/曲线中间值才可连同相机动作一起省略。 */
function assertPresentationCalculationIsolation(
  source: NativeSequenceSource<KnownNativeActionLeafSource>,
): void {
  const leaves = collectNativeActionNodes(source).filter(
    node => node.body.kind === 'leaf',
  ) as NativeActionNodeSource<KnownNativeActionLeafSource>[];
  for (const node of leaves) {
    if (node.body.kind !== 'leaf' || node.body.value.family !== 'presentationCalculation') continue;
    const key = node.body.value.action.outputKey;
    for (const consumer of leaves) {
      if (consumer === node || consumer.body.kind !== 'leaf') continue;
      if (!JSON.stringify(consumer.body.value.action).includes(JSON.stringify(key))) continue;
      if (
        consumer.body.value.family !== 'presentationCalculation' &&
        consumer.body.value.family !== 'presentation'
      ) {
        throw new Error(
          `${node.sourcePath}: presentation output ${key} reaches combat action ${consumer.sourcePath}`,
        );
      }
    }
  }
}

function createBuffSequenceProjection(
  visualOnlyIds: ReadonlySet<string>,
  context: CombatActionProjectionContextSource,
  extensions: CombatActionProjectionExtensionsSource = {},
): CompileActionSequenceProgramOptions<
  KnownNativeActionLeafSource,
  CompiledBuffConditionSource,
  CompiledBuffStepSource,
  ReadonlyMap<string, ProjectedTargetGroup>
> {
  return {
    initialState: () => new Map<string, ProjectedTargetGroup>(),
    compileCondition: (node, targetGroups) => compileEventCondition(node, context, targetGroups),
    canOmitTerminalCondition: condition => !conditionWritesBlackboard(condition),
    combineConditions: conditions =>
      conditions.length === 1 ? conditions[0]! : { kind: 'all', conditions },
    negateCondition: condition => ({ kind: 'not', condition }),
    compileLeaf: (node, partyTargetGroups) =>
      compileBuffLeafNode(node, visualOnlyIds, partyTargetGroups, context, extensions),
    compileNodePrefix: (nodes, partyTargetGroups) => {
      const jump = projectTimelineJump(nodes[0]!, context, node => {
        const condition = compileEventCondition(node, context, partyTargetGroups);
        return condition !== null && !conditionWritesBlackboard(condition) ? condition : null;
      });
      return jump === null
        ? compileDifferentCharacterTypePartyLoop(
            nodes,
            visualOnlyIds,
            partyTargetGroups,
            context,
            extensions,
          )
        : { steps: [jump], state: partyTargetGroups, consumedNodeCount: 1 };
    },
    compileForEach: (node, partyTargetGroups) => {
      if (
        node.body.target.targetSource === 'Context' &&
        (context.staticEnemyTargetGroupKeys?.has(node.body.target.targetGroupKey) === true ||
          partyTargetGroups.get(node.body.target.targetGroupKey) === 'enemy') &&
        node.body.target.finderType === null &&
        node.body.target.validatorTypes.length === 0 &&
        node.body.target.postProcessorTypes.length === 0 &&
        !node.body.action.onlyExecuteWhenSourceIsMainCharacter &&
        !node.body.action.onlyExecuteWhenSourceIsGuard
      ) {
        // 固定木桩模型中该静态集合恒为且仅为一个敌人，ForEach 因而精确执行一次。
        const loopContext: CombatActionProjectionContextSource = {
          ...context,
          actionTargetTarget: 'enemy',
        };
        return {
          steps: compileActionSequenceProgram(node.body.action, {
            ...createBuffSequenceProjection(visualOnlyIds, loopContext, extensions),
            initialState: () => partyTargetGroups,
          }).steps,
          state: partyTargetGroups,
        };
      }
      if (
        (context.actionTargetTarget === 'enemy' ||
          context.actionTargetTarget === 'currentAbilityEntity') &&
        node.body.target.targetSource === 'Context' &&
        partyTargetGroups.get(node.body.target.targetGroupKey) === 'abilityEntity'
      ) {
        const loopContext: CombatActionProjectionContextSource = {
          ...context,
          actionTargetTarget: 'currentAbilityEntity',
        };
        const body = compileActionSequenceProgram(node.body.action, {
          ...createBuffSequenceProjection(visualOnlyIds, loopContext, extensions),
          initialState: () => partyTargetGroups,
        });
        return {
          steps: [
            {
              kind: 'forEachContextTarget',
              parameters: { contextKey: node.body.target.targetGroupKey },
              body,
            },
          ],
          state: partyTargetGroups,
        };
      }
      if (context.actionTargetTarget === 'currentAbilityEntity') return null;
      if (context.actionTargetTarget === 'eventSource' || context.actionTargetTarget === 'enemy')
        return null;
      if (!isPartyExceptOwnerInstantSearch(node.body.target)) return null;
      if (
        node.body.action.onlyExecuteWhenSourceIsMainCharacter ||
        node.body.action.onlyExecuteWhenSourceIsGuard
      ) {
        return null;
      }
      const bodyNodes = node.body.action.actions.filter(child => child.metadata.enabled);
      if (
        bodyNodes.length === 0 ||
        bodyNodes.some(
          child =>
            child.body.kind !== 'leaf' ||
            child.body.value.family !== 'buffApplication' ||
            child.body.value.action.target.targetSource !== 'Target' ||
            child.body.value.action.target.targetGroupKey !== '',
        )
      ) {
        return null;
      }
      const loopContext: CombatActionProjectionContextSource = {
        ...context,
        actionTargetTarget: 'partyExceptCaster',
      };
      return {
        steps: bodyNodes.flatMap(
          child =>
            compileBuffLeafNode(child, visualOnlyIds, partyTargetGroups, loopContext, extensions)
              .steps,
        ),
        state: partyTargetGroups,
      };
    },
    compileChanneling: (node, partyTargetGroups) => {
      const target = node.body.target;
      const isSingleEnemy =
        context.actionTargetTarget === 'enemy' &&
        target.targetSource === 'Context' &&
        target.targetGroupKey !== '' &&
        (context.staticEnemyTargetGroupKeys?.has(target.targetGroupKey) === true ||
          partyTargetGroups.get(target.targetGroupKey) === 'enemy') &&
        target.finderType === null &&
        target.validatorTypes.length === 0 &&
        target.postProcessorTypes.length === 0;
      if (!isSingleEnemy) return null;
      if (!node.body.executeEachFrame && !(node.body.triggerIntervalSeconds > 0)) return null;
      const body = compileActionSequenceProgram(node.body.actionOnTick, {
        ...createBuffSequenceProjection(visualOnlyIds, context, extensions),
        initialState: () => partyTargetGroups,
      });
      return {
        steps: [
          {
            kind: 'repeatEachTick',
            parameters: {
              nativeChanneling: {
                executeEachFrame: node.body.executeEachFrame,
                triggerIntervalSeconds: node.body.triggerIntervalSeconds,
                maxCountPerTarget: node.body.maxCountPerTarget,
                targetTriggerIntervalSeconds: node.body.targetTriggerIntervalSeconds,
              },
            },
            body,
          },
        ],
        state: partyTargetGroups,
      };
    },
    canOmitIfElse: node => isCombatInvisibleIfElse(node),
    canOmitTogglable: node => isCombatInvisibleTogglable(node),
    createConditionalStep: ({ condition, whenTrue, whenFalse, alwaysNext }) => ({
      kind: 'conditional',
      parameters: { condition, ...(alwaysNext ? { alwaysNext: true } : {}) },
      whenTrue: { steps: [...whenTrue.steps] },
      ...(whenFalse === undefined ? {} : { whenFalse: { steps: [...whenFalse.steps] } }),
    }),
    rootFilterError: 'sequence owner/guard root filters are not yet supported',
    unsupportedNodeError: node => `${node.sourcePath}: unsupported Buff runtime action`,
  };
}

function isCombatInvisibleTogglable(
  node: NativeActionNodeSource<KnownNativeActionLeafSource> & {
    readonly body: Extract<
      NativeActionNodeSource<KnownNativeActionLeafSource>['body'],
      { kind: 'togglable' }
    >;
  },
): boolean {
  const conditionNodes = collectNativeActionNodes(node.body.condition).filter(
    child => child.metadata.enabled,
  );
  const actionNodes = collectNativeActionNodes(node.body.action).filter(
    child => child.metadata.enabled,
  );
  return (
    conditionNodes.length > 0 &&
    conditionNodes.every(
      child => child.body.kind === 'leaf' && child.body.value.family === 'condition',
    ) &&
    actionNodes.every(
      child =>
        child.body.kind === 'leaf' &&
        (child.body.value.family === 'inputControl' || child.body.value.family === 'presentation'),
    )
  );
}

function isCombatInvisibleIfElse(
  node: NativeActionNodeSource<KnownNativeActionLeafSource> & {
    readonly body: Extract<
      NativeActionNodeSource<KnownNativeActionLeafSource>['body'],
      {
        kind: 'ifElse';
      }
    >;
  },
): boolean {
  const nodes = [
    ...collectNativeActionNodes(node.body.condition),
    ...collectNativeActionNodes(node.body.whenTrue),
    ...collectNativeActionNodes(node.body.whenFalse),
  ].filter(child => child.metadata.enabled);
  const invisibleFamilies = new Set([
    'presentation',
    'presentationCalculation',
    'spatial',
    'selfDefense',
    'inputControl',
    'targetGroup',
  ]);
  const safeConditions = new Set([
    'mainOperator',
    'twoDirectionAngle',
    'distance',
    'entityCount',
    'floatCompare',
    'comboCameraAlphaSetting',
  ]);
  return nodes.every(child => {
    if (child.body.kind !== 'leaf') return true;
    const leaf = child.body.value;
    if (invisibleFamilies.has(leaf.family)) return true;
    if (leaf.family === 'spatialMeasurement') {
      const key = leaf.action.outputKey;
      return nodes.every(consumer => {
        if (consumer === child || consumer.body.kind !== 'leaf') return true;
        if (!JSON.stringify(consumer.body.value.action).includes(JSON.stringify(key))) return true;
        return ['presentation', 'presentationCalculation'].includes(consumer.body.value.family);
      });
    }
    if (leaf.family !== 'condition' || !safeConditions.has(leaf.action.kind)) return false;
    if (leaf.action.kind === 'entityCount') return leaf.action.storeKey === '';
    return true;
  });
}

/**
 * SaveCharTypeId(owner) 后逐队员保存类型、取反 CompareString 的原生组合，等价于只选择不同
 * CharacterTable.charTypeId 的其他队员。Next 的 element 是该字段的一一投影，运行时仍以角色类型
 * 集合目标表达，不能把这条规则降成“任意其他队员”。
 */
function compileDifferentCharacterTypePartyLoop(
  nodes: readonly NativeActionNodeSource<KnownNativeActionLeafSource>[],
  visualOnlyIds: ReadonlySet<string>,
  partyTargetGroups: ReadonlyMap<string, ProjectedTargetGroup>,
  context: CombatActionProjectionContextSource,
  extensions: CombatActionProjectionExtensionsSource,
): {
  readonly consumedNodeCount: number;
  readonly steps: readonly CompiledBuffStepSource[];
  readonly state: ReadonlyMap<string, ProjectedTargetGroup>;
} | null {
  if (
    context.actionTargetTarget === 'enemy' ||
    context.actionTargetTarget === 'currentAbilityEntity'
  )
    return null;
  const ownerRead = nodes[0];
  const loop = nodes[1];
  if (
    context.actionOwnerTarget !== 'caster' ||
    ownerRead?.body.kind !== 'leaf' ||
    ownerRead.body.value.family !== 'characterIdentity' ||
    ownerRead.body.value.action.target.targetSource !== 'Owner' ||
    ownerRead.body.value.action.target.targetGroupKey !== '' ||
    loop?.body.kind !== 'forEach' ||
    !isPartyExceptOwnerInstantSearch(loop.body.target) ||
    loop.body.action.onlyExecuteWhenSourceIsMainCharacter ||
    loop.body.action.onlyExecuteWhenSourceIsGuard
  ) {
    return null;
  }

  const body = loop.body.action.actions.filter(child => child.metadata.enabled);
  const teamRead = body[0];
  const negate = body[1];
  const compare = body[2];
  const applications = body.slice(3);
  if (
    teamRead?.body.kind !== 'leaf' ||
    teamRead.body.value.family !== 'characterIdentity' ||
    teamRead.body.value.action.target.targetSource !== 'Target' ||
    teamRead.body.value.action.target.targetGroupKey !== '' ||
    negate?.body.kind !== 'negateNextResult' ||
    compare?.body.kind !== 'leaf' ||
    compare.body.value.family !== 'condition' ||
    compare.body.value.action.kind !== 'stringCompare' ||
    applications.length === 0 ||
    applications.some(
      child =>
        child.body.kind !== 'leaf' ||
        child.body.value.family !== 'buffApplication' ||
        child.body.value.action.target.targetSource !== 'Target' ||
        child.body.value.action.target.targetGroupKey !== '',
    )
  ) {
    return null;
  }

  const ownerKey = ownerRead.body.value.action.outputKey;
  const teamKey = teamRead.body.value.action.outputKey;
  const leftKey = compare.body.value.action.left.blackboardKey;
  const rightKey = compare.body.value.action.right.blackboardKey;
  if (!(
    (leftKey === ownerKey && rightKey === teamKey) ||
    (leftKey === teamKey && rightKey === ownerKey)
  )) {
    return null;
  }

  const loopContext: CombatActionProjectionContextSource = {
    ...context,
    actionTargetTarget: 'partyExceptCasterAndSameCharacterType',
  };
  return {
    consumedNodeCount: 2,
    steps: applications.flatMap(
      child =>
        compileBuffLeafNode(child, visualOnlyIds, partyTargetGroups, loopContext, extensions).steps,
    ),
    state: partyTargetGroups,
  };
}

/** 已严格解析、但在无渲染后端中不产生战斗状态的表现动作路径。 */
export function collectBuffRuntimePresentationActionPaths(
  source: BuffRuntimeSource,
): readonly string[] {
  const sequences = [
    ...source.graph.timelineActions.map(item => item.sequence),
    ...source.graph.buffEvents.flatMap(item => item.actions),
    ...source.graph.abilityEvents.flatMap(item => item.actions),
    ...source.graph.igniteEvents.flatMap(item => item.actions),
  ];
  return sequences
    .flatMap(sequence => collectNativeActionNodes(sequence))
    .filter(
      node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'presentation',
    )
    .map(node => node.sourcePath);
}

/** 严格解析但只发布关卡事件/战斗记录、当前木桩运行时无生产消费者的动作路径。 */
export function collectBuffRuntimeLevelEventActionPaths(
  source: BuffRuntimeSource,
): readonly string[] {
  const sequences = [
    ...source.graph.timelineActions.map(item => item.sequence),
    ...source.graph.buffEvents.flatMap(item => item.actions),
    ...source.graph.abilityEvents.flatMap(item => item.actions),
    ...source.graph.igniteEvents.flatMap(item => item.actions),
  ];
  return sequences
    .flatMap(sequence => collectNativeActionNodes(sequence))
    .filter(
      node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'levelEvent',
    )
    .map(node => node.sourcePath);
}

export function isPresentationOnlyBuffStackEffect(source: BuffRuntimeSource): boolean {
  return (
    source.lifecycle.stackEffectCount > 0 &&
    source.lifecycle.stackEffectActionTypes.every(type => type === 'EffectAction') &&
    !source.presentation.hasIcon &&
    source.presentation.spritePath === '' &&
    source.attributeModifiers.modifiers.length === 0 &&
    source.damageModifiers.length === 0 &&
    source.healModifiers.length === 0 &&
    source.poiseModifiers.length === 0 &&
    source.shields.length === 0 &&
    source.applyTagIds.length === 0 &&
    source.extendTagIds.length === 0 &&
    source.unsupportedPayloads.length === 0 &&
    source.graph.timelineActions.length === 0 &&
    source.graph.buffEvents.length === 0 &&
    source.graph.abilityEvents.length === 0 &&
    source.graph.igniteEvents.length === 0
  );
}

export function isAfterEnemyDefeatedOnlyBuffRuntime(source: BuffRuntimeSource): boolean {
  return (
    source.unsupportedPayloads.length === 0 &&
    source.attributeModifiers.modifiers.length === 0 &&
    source.damageModifiers.length === 0 &&
    source.healModifiers.length === 0 &&
    source.poiseModifiers.length === 0 &&
    source.shields.length === 0 &&
    source.applyTagIds.length === 0 &&
    source.extendTagIds.length === 0 &&
    source.graph.timelineActions.length === 0 &&
    source.graph.buffEvents.length === 0 &&
    source.graph.igniteEvents.length === 0 &&
    source.graph.abilityEvents.length > 0 &&
    source.graph.abilityEvents.every(event => event.event === 'OnAfterKillEntity')
  );
}

function compilePresentation(source: BuffPresentationSource): CompiledBuffPresentationSource {
  return {
    visible: source.hasIcon,
    ...(source.spritePath === ''
      ? {}
      : { iconId: source.spritePath, iconPath: `/icons/${source.spritePath}.webp` }),
    showInHeadBarCommon: source.showInHeadBarCommon,
    showInHeadBarAttached: source.showInHeadBarAttached,
    showInSquadIcon: source.showInSquadIcon,
    onlyShowForMainCharacter: source.onlyShowForMainCharacter,
    iconStyleInSquad: source.iconStyleInSquad,
    abnormalColorType: source.abnormalColorType,
    orderPriority: {
      useDirectoryValue: source.orderUseDirectoryValue,
      value: source.orderPriorityValue,
      category: source.orderPriorityEnum,
    },
  };
}

function signed(value: number, negate: boolean): number {
  return negate ? -value : value;
}

function mergeSequences(
  sequences: readonly CompiledBuffSequenceSource[],
): CompiledBuffSequenceSource {
  return { steps: sequences.flatMap(item => item.steps) };
}

const STACKING_TYPES: Record<BuffStackingTypeSource, BuffStackingType> = {
  Unlimited: 'unlimited',
  HighPriority: 'highPriority',
  Stack: 'stack',
  Enhance: 'enhance',
  Refresh: 'refresh',
  Extend: 'extend',
  Modify: 'modify',
  Unique: 'unique',
  EnhanceAndRefresh: 'enhanceAndRefresh',
  OverwriteDuration: 'overwriteDuration',
  EnhanceAndOverwriteDuration: 'enhanceAndOverwriteDuration',
  HighPriorityWithMaxStack: 'highPriorityWithMaxStack',
};

const DAMAGE_MODIFIER_SIDES: Readonly<Record<string, 'attacker' | 'defender'>> = {
  Attacker: 'attacker',
  Defender: 'defender',
};

const DAMAGE_SCALE_ZONES: Readonly<
  Record<
    string,
    'product' | 'normal' | 'abnormalAndBurst' | 'enhanced' | 'combo' | 'vulnerable' | 'race'
  >
> = {
  ProdCalcZone: 'product',
  NormalCalcZone: 'normal',
  AbnormalAndBurstCalcZone: 'abnormalAndBurst',
  EnhanceCalcZone: 'enhanced',
  ComboCalcZone: 'combo',
  VulnerableCalcZone: 'vulnerable',
  RaceCalcZone: 'race',
};
