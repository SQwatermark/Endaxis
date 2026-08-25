import { type NativeActionNodeSource, type NativeSequenceSource } from './controlFlow.ts';
import {
  nativeActionName,
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import { parseSkillBuffInstallSources } from './skillBuffInstall.ts';
import type { BlackboardLevelValues } from './scalar.ts';
import { parseSkillActionGraphSource, type SkillActionGraphSource } from './skillActionGraph.ts';
import {
  tryParseKnownNativeActionLeafSource,
  type KnownNativeActionLeafSource,
} from './actionLeaf.ts';

export type DefinitionReferenceKind = 'buff' | 'skill' | 'abilityEntity' | 'projectile';
export type DefinitionReferenceState = 'active' | 'inactive' | 'dynamic' | 'empty';

export interface DefinitionReferenceSource {
  readonly kind: DefinitionReferenceKind;
  readonly usage: string;
  readonly state: DefinitionReferenceState;
  readonly id: string | null;
  readonly blackboardKey: string | null;
  readonly sourcePath: string;
}

export interface SkillDefinitionReferenceSource {
  readonly actionGraph: SkillActionGraphSource<ReferenceAwareActionLeafSource>;
  readonly references: readonly DefinitionReferenceSource[];
}

export type ReferenceAwareActionLeafSource =
  KnownNativeActionLeafSource | { readonly family: 'untracked'; readonly nativeName: string };

/**
 * 引用闭包专用的 SkillData 切片。只严格展开会形成定义引用的动作；其余叶子保留类型身份，
 * 避免引用审计被尚未迁移的表现动作阻断。
 */
export function parseReferenceAwareSkillActionGraphSource(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): SkillActionGraphSource<ReferenceAwareActionLeafSource> {
  return parseSkillActionGraphSource(value, sourcePath, inheritedBlackboard, (leaf, leafPath) =>
    parseReferenceAwareActionLeafSource(leaf, leafPath, inheritedBlackboard),
  );
}

export function parseReferenceAwareActionLeafSource(
  leaf: unknown,
  leafPath: string,
  inheritedBlackboard: BlackboardLevelValues,
): ReferenceAwareActionLeafSource {
  const action = requireRecord(leaf, leafPath);
  const nativeName = nativeActionName(requireNonEmptyString(action.$type, `${leafPath}.$type`));
  return (
    tryParseKnownNativeActionLeafSource(
      leaf,
      leafPath,
      inheritedBlackboard,
      'referenceClosure',
    ) ?? {
      family: 'untracked',
      nativeName,
    }
  );
}

/** 读取技能根 Buff 与动作图引用；条件安装的 Buff 仍是定义闭包中的活动依赖。 */
export function parseSkillDefinitionReferenceSource(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): SkillDefinitionReferenceSource {
  const actionGraph = parseReferenceAwareSkillActionGraphSource(
    value,
    sourcePath,
    inheritedBlackboard,
  );
  return {
    actionGraph,
    references: [
      ...collectSkillRootBuffReferences(value, sourcePath),
      ...collectSkillActionReferences(actionGraph),
    ],
  };
}

export function collectSkillRootBuffReferences(
  value: unknown,
  sourcePath: string,
): DefinitionReferenceSource[] {
  const root = requireRecord(value, sourcePath);
  const output: DefinitionReferenceSource[] = [];
  collectRootBuffEntries(root.buffs, `${sourcePath}.buffs`, 'attached', output);
  const toggleBuffs = requireArray(root.toggleBuffs, `${sourcePath}.toggleBuffs`);
  // Skill.Create 只在 Passive + ToggleBuff 时创建会读取 toggleBuffs 的运行时子类。
  // 其他被动定义中的同名字段是无效序列化残留，不得形成假的 Buff 依赖。
  if (root.castType === 'Passive' && root.passiveSkillType === 'ToggleBuff') {
    toggleBuffs.forEach((rawGroup, groupIndex) => {
      const groupPath = `${sourcePath}.toggleBuffs[${groupIndex}]`;
      const group = requireRecord(rawGroup, groupPath);
      requireExactFields(group, new Set(['conditions', 'buffs']), groupPath);
      requireArray(group.conditions, `${groupPath}.conditions`);
      collectRootBuffEntries(group.buffs, `${groupPath}.buffs`, 'toggle', output);
    });
  }
  const switchConfig = requireRecord(root.switchToBuffConfig, `${sourcePath}.switchToBuffConfig`);
  requireExactFields(
    switchConfig,
    new Set(['condition', 'buffs', 'buffSource', 'targets', 'asSkillCast']),
    `${sourcePath}.switchToBuffConfig`,
  );
  requireRecord(switchConfig.condition, `${sourcePath}.switchToBuffConfig.condition`);
  requireRecord(switchConfig.buffSource, `${sourcePath}.switchToBuffConfig.buffSource`);
  requireRecord(switchConfig.targets, `${sourcePath}.switchToBuffConfig.targets`);
  requireBoolean(switchConfig.asSkillCast, `${sourcePath}.switchToBuffConfig.asSkillCast`);
  collectRootBuffEntries(
    switchConfig.buffs,
    `${sourcePath}.switchToBuffConfig.buffs`,
    'switch',
    output,
  );
  return output;
}

export function collectSkillActionReferences(
  graph: SkillActionGraphSource<ReferenceAwareActionLeafSource>,
): DefinitionReferenceSource[] {
  const references: DefinitionReferenceSource[] = [];
  for (const timeline of graph.actionGroup.timelineActions) {
    collectSequenceReferences(timeline.sequence, true, references);
  }
  for (const event of graph.actionGroup.passiveEvents) {
    for (const sequence of event.actions) collectSequenceReferences(sequence, true, references);
  }
  return references;
}

function collectSequenceReferences(
  sequence: NativeSequenceSource<ReferenceAwareActionLeafSource>,
  parentEnabled: boolean,
  output: DefinitionReferenceSource[],
): void {
  for (const node of sequence.actions) collectNodeReferences(node, parentEnabled, output);
}

function collectNodeReferences(
  node: NativeActionNodeSource<ReferenceAwareActionLeafSource>,
  parentEnabled: boolean,
  output: DefinitionReferenceSource[],
): void {
  const enabled = parentEnabled && node.metadata.enabled;
  const body = node.body;
  switch (body.kind) {
    case 'leaf':
      collectLeafReferences(body.value, node.sourcePath, enabled, output);
      return;
    case 'ifElse':
      collectSequenceReferences(body.condition, enabled, output);
      collectSequenceReferences(body.whenTrue, enabled, output);
      collectSequenceReferences(body.whenFalse, enabled, output);
      return;
    case 'switch':
      for (const option of body.options) collectSequenceReferences(option.action, enabled, output);
      return;
    case 'forEach':
      collectSequenceReferences(body.action, enabled, output);
      return;
    case 'channeling':
    case 'tickInterval':
    case 'tickIntervalV2':
      collectSequenceReferences(body.actionOnTick, enabled, output);
      return;
    case 'timelineJump':
      collectSequenceReferences(body.condition, enabled, output);
      return;
    case 'negateNextResult':
      return;
  }
}

function collectLeafReferences(
  leaf: ReferenceAwareActionLeafSource,
  sourcePath: string,
  enabled: boolean,
  output: DefinitionReferenceSource[],
): void {
  if (leaf.family === 'untracked') return;
  switch (leaf.family) {
    case 'aura': {
      for (let index = 0; index < leaf.action.buffs.length; index += 1) {
        output.push(
          referenceFromIdentity(
            'buff',
            'aura',
            enabled,
            leaf.action.buffs[index]!.buffId,
            null,
            `${sourcePath}.buffInput[${index}]`,
          ),
        );
      }
      return;
    }
    case 'buffApplication': {
      const action = leaf.action;
      for (let index = 0; index < action.buffs.length; index += 1) {
        const buff = action.buffs[index]!;
        output.push(
          referenceFromIdentity(
            'buff',
            'apply',
            enabled,
            buff.buffId,
            buff.readIdFromBlackboard ? buff.buffIdKey : null,
            `${sourcePath}.buffs[${index}]`,
          ),
        );
      }
      for (let index = 0; index < action.inheritSkillIds.length; index += 1) {
        output.push(
          referenceFromIdentity(
            'skill',
            'buffInheritance',
            enabled,
            action.inheritSkillIds[index]!,
            null,
            `${sourcePath}.inheritSkillIdList[${index}]`,
          ),
        );
      }
      return;
    }
    case 'buffFinish': {
      const action = leaf.action;
      if (action.kind === 'buffFinishById') {
        for (let index = 0; index < action.buffIds.length; index += 1) {
          output.push(
            referenceFromIdentity(
              'buff',
              'finish',
              enabled,
              action.buffIds[index]!,
              null,
              `${sourcePath}.buffIds[${index}]`,
            ),
          );
        }
      } else {
        for (let index = 0; index < action.settings.buffIds.length; index += 1) {
          output.push(
            referenceFromIdentity(
              'buff',
              'finishQuery',
              enabled,
              action.settings.buffIds[index]!,
              null,
              `${sourcePath}.buffSettings.buffIdList[${index}]`,
            ),
          );
        }
      }
      return;
    }
    case 'projectile': {
      const action = leaf.action;
      output.push(
        referenceFromIdentity(
          'projectile',
          'launch',
          enabled,
          action.projectileId,
          null,
          `${sourcePath}.projectileId`,
        ),
      );
      for (const callback of action.callbacks) {
        const idField = {
          block: 'skillIdOnBlock',
          finish: 'skillIdOnFinish',
          hit: 'projectileSkillId',
          reach: 'skillIdOnReach',
        }[callback.event];
        output.push(
          referenceFromIdentity(
            'skill',
            `projectile:${callback.event}`,
            enabled && callback.enabled,
            callback.skillId,
            null,
            `${sourcePath}.${idField}`,
          ),
        );
      }
      return;
    }
    case 'abilityEntity': {
      const action = leaf.action;
      output.push(
        referenceFromIdentity(
          'abilityEntity',
          'spawn',
          enabled,
          action.abilityEntityId,
          null,
          `${sourcePath}.abilityEntityId`,
        ),
      );
      output.push(
        referenceFromIdentity(
          'skill',
          'abilityEntitySkill',
          enabled,
          action.skillId,
          null,
          `${sourcePath}.abilityEntitySkillId`,
        ),
      );
      return;
    }
    case 'skillCast': {
      const action = leaf.action;
      output.push(
        referenceFromIdentity(
          'skill',
          'cast',
          enabled,
          action.skillId.value,
          action.skillId.blackboardKey,
          `${sourcePath}.skillId`,
        ),
      );
      return;
    }
    default:
      return;
  }
}

function collectRootBuffEntries(
  value: unknown,
  path: string,
  usage: string,
  output: DefinitionReferenceSource[],
): void {
  parseSkillBuffInstallSources(value, path).forEach((entry, index) => {
    const entryPath = `${path}[${index}]`;
    output.push(
      referenceFromIdentity('buff', usage, true, entry.buffId, null, `${entryPath}.buffId`),
    );
  });
}

function referenceFromIdentity(
  kind: DefinitionReferenceKind,
  usage: string,
  enabled: boolean,
  id: string,
  blackboardKey: string | null,
  sourcePath: string,
): DefinitionReferenceSource {
  const state: DefinitionReferenceState = !enabled
    ? 'inactive'
    : blackboardKey
      ? 'dynamic'
      : id
        ? 'active'
        : 'empty';
  return { kind, usage, state, id: id || null, blackboardKey, sourcePath };
}
