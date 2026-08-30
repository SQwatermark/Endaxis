import type { SkillGlobalBuffDefinition } from '../../../../packages/game-data-contract/src/buffs.ts';
import type { GlobalBuffActionSource } from '../source/globalBuffActions.ts';
import type {
  GlobalBuffTemplateCatalogSource,
  GlobalBuffTemplateSource,
} from '../source/globalBuffTemplate.ts';
import type { TargetReferenceSource } from '../source/target.ts';
import { projectBuffAssignments } from './combatActionLeafProjection.ts';
import type { CompiledBuffStepSource } from './combatActionProjectionTypes.ts';
import {
  actionValueOperand,
  requireActionOwnerProjection,
  scalarOperand,
  type CombatActionProjectionContextSource,
  type CombatActionProjectionExtensionsSource,
} from './combatProjectionCommon.ts';

export function createGlobalBuffProjectionExtensions(
  catalog: GlobalBuffTemplateCatalogSource,
): CombatActionProjectionExtensionsSource {
  return {
    compileGlobalBuffAction: (action, sourcePath, context) =>
      compileGlobalBuffAction(action, sourcePath, context, catalog),
  };
}

function compileGlobalBuffAction(
  action: GlobalBuffActionSource,
  sourcePath: string,
  context: CombatActionProjectionContextSource,
  catalog: GlobalBuffTemplateCatalogSource,
): readonly CompiledBuffStepSource[] {
  if (action.kind === 'finishGlobalBuff') {
    if (
      !action.finishParent ||
      action.globalBuffIds.length !== 0 ||
      !action.finishAll ||
      action.finishCount.blackboardKey !== null ||
      action.finishCount.value !== 1
    ) {
      throw new Error(`${sourcePath}: unsupported non-parent GlobalBuff finish`);
    }
    return [
      {
        kind: 'finishParentGlobalBuff',
        parameters: { reason: action.isFinishedEarly ? 'early' : 'other' },
      },
    ];
  }
  const source = projectGlobalBuffSource(action.source, context, sourcePath);
  return action.globalBuffs.map((entry, index) => {
    const entryPath = `${sourcePath}.globalBuffs[${index}]`;
    const template = catalog.byId.get(entry.globalBuffId);
    if (template === undefined) {
      throw new Error(
        `${entryPath}: missing GlobalBuff template ${JSON.stringify(entry.globalBuffId)}`,
      );
    }
    const assignments = entry.assignBlackboard
      ? projectBuffAssignments(entry.assignments, entryPath)
      : {};
    if (!entry.assignBlackboard && entry.assignments.length > 0) {
      throw new Error(`${entryPath}: disabled GlobalBuff assignment is nonempty`);
    }
    return {
      kind: 'createGlobalBuff' as const,
      parameters: {
        globalBuffId: entry.globalBuffId,
        definition: compileGlobalBuffTemplate(template, entryPath),
        source,
        ...(action.count.blackboardKey === null && action.count.value === 1
          ? {}
          : { count: actionValueOperand(action.count) }),
        ...(action.autoFinishByAction ? { finishByAction: true } : {}),
        ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
      },
    };
  });
}

function compileGlobalBuffTemplate(
  template: GlobalBuffTemplateSource,
  sourcePath: string,
): SkillGlobalBuffDefinition {
  if (
    template.stackingIdentifierType !== 'Id' ||
    template.stackingKey !== '' ||
    template.usePriorityKey ||
    template.priorityKey !== '' ||
    template.negatePriority ||
    template.priority !== 0 ||
    template.globalModifierCount !== 0 ||
    template.globalEventCount !== 0 ||
    template.triggerInterval.blackboardKey !== null ||
    template.triggerInterval.value !== 0 ||
    !template.waitFirstTriggerInterval ||
    template.maxTriggerCount.blackboardKey !== null ||
    template.maxTriggerCount.value !== 1
  ) {
    throw new Error(`${sourcePath}: unsupported GlobalBuff template behavior`);
  }
  const stackingType =
    template.stackingType === 'Stack'
      ? ('stack' as const)
      : template.stackingType === 'Unlimited'
        ? ('unlimited' as const)
        : null;
  if (stackingType === null) {
    throw new Error(`${sourcePath}: unsupported GlobalBuff stacking ${template.stackingType}`);
  }
  if (template.lifeType !== 'Limited' && template.lifeType !== 'Infinity') {
    throw new Error(`${sourcePath}: unsupported GlobalBuff lifetime ${template.lifeType}`);
  }
  return {
    stackingType,
    ...(stackingType === 'stack' ? { maxStackCount: template.maxStackCount } : {}),
    ...(template.lifeType === 'Limited'
      ? { durationSeconds: scalarOperand(template.duration) }
      : {}),
    ...(template.applyIconDurationToBuffs ? { applyIconDurationToBuffs: true } : {}),
    blackboard: Object.fromEntries(template.blackboard.map(item => [item.key, item.value])),
    children: template.children.map((child, index) => ({
      buffId: child.buffId,
      blackboardAssignments: child.assignBlackboard
        ? projectBuffAssignments(child.assignments, `${sourcePath}.children[${index}]`)
        : {},
    })),
  };
}

function projectGlobalBuffSource(
  source: TargetReferenceSource,
  context: CombatActionProjectionContextSource,
  sourcePath: string,
): 'caster' | 'buffOwner' | 'buffSource' {
  if (
    source.targetGroupKey !== '' ||
    source.finderType !== null ||
    source.validatorTypes.length !== 0 ||
    source.postProcessorTypes.length !== 0
  ) {
    throw new Error(`${sourcePath}: unsupported GlobalBuff source selector`);
  }
  if (source.targetSource === 'Owner') {
    const owner = requireActionOwnerProjection(context, sourcePath);
    if (owner === 'currentAbilityEntity')
      throw new Error(`${sourcePath}: AbilityEntity GlobalBuff source is unsupported`);
    return owner;
  }
  if (source.targetSource === 'Source') return context.actionSourceTarget;
  throw new Error(`${sourcePath}: unsupported GlobalBuff source ${source.targetSource}`);
}
