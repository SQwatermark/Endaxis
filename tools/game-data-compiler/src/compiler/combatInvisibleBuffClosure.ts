import { parseReferenceAwareBuffActionGraphSource } from '../source/buffActionGraph.ts';
import { collectNativeActionNodes } from '../source/controlFlow.ts';
import { collectBuffActionReferences } from '../source/buffActionGraph.ts';
import { requireArray, requireRecord, requireString } from '../source/primitives.ts';

const PRESENTATION_PLUMBING_ACTIONS = new Set([
  'FindTargetAction',
  'CheckMainCharacterCondition',
  'CheckEntityNum',
  'CheckTargetsEqual',
  'CheckTwoDirectionAngle',
  'ConvertToTargetContext',
  'LockCameraAimAction',
  'AddDynamicCcsAction',
  'OverrideCameraFollowAction',
  'VoiceTriggerAction',
  'VoiceInterruptAction',
]);

interface BuffPresentationClosureNode {
  readonly locallyInvisible: boolean;
  readonly references: readonly string[];
}

/**
 * 找出完整递归闭包都只服务于无渲染表现的 Buff。
 * 判定不依赖 ID：图标、战斗字段、动态引用、未知动作或非表现子 Buff 任一出现即失败关闭。
 */
export function collectCombatInvisibleBuffClosureIds(
  rootIds: readonly string[],
  loadBuff: (id: string) => unknown,
): ReadonlySet<string> {
  const nodes = new Map<string, BuffPresentationClosureNode>();
  const queue = [...new Set(rootIds)];
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (nodes.has(id)) continue;
    const node = inspectBuff(id, loadBuff);
    nodes.set(id, node);
    for (const reference of node.references) if (!nodes.has(reference)) queue.push(reference);
  }

  const invisible = new Set(
    [...nodes].filter(([, node]) => node.locallyInvisible).map(([id]) => id),
  );
  let changed: boolean;
  do {
    changed = false;
    for (const id of [...invisible]) {
      const node = nodes.get(id)!;
      if (node.references.some(reference => !invisible.has(reference))) {
        invisible.delete(id);
        changed = true;
      }
    }
  } while (changed);
  return invisible;
}

function inspectBuff(id: string, loadBuff: (id: string) => unknown): BuffPresentationClosureNode {
  try {
    const value = loadBuff(id);
    const root = requireRecord(value, `BuffData.${id}`);
    const graph = parseReferenceAwareBuffActionGraphSource(value, `BuffData.${id}`, {});
    if (graph.buffId !== id) return { locallyInvisible: false, references: [] };
    const references = collectBuffActionReferences(graph).filter(
      reference => reference.kind === 'buff' && reference.state !== 'inactive',
    );
    const staticReferences = references.flatMap(reference =>
      reference.state === 'active' && reference.id !== null ? [reference.id] : [],
    );
    const sequences = [
      ...graph.timelineActions.map(timeline => timeline.sequence),
      ...graph.buffEvents.flatMap(event => event.actions),
      ...graph.abilityEvents.flatMap(event => event.actions),
      ...graph.igniteEvents.flatMap(event => event.actions),
    ];
    const actionsArePresentationOnly = sequences
      .flatMap(sequence => collectNativeActionNodes(sequence))
      .filter(node => node.metadata.enabled)
      .every(node => {
        if (node.body.kind !== 'leaf') return true;
        const leaf = node.body.value;
        if (leaf.family === 'buffApplication' || leaf.family === 'buffFinish') return true;
        if (leaf.family === 'presentation' || leaf.family === 'presentationCalculation')
          return true;
        return leaf.family === 'untracked' && PRESENTATION_PLUMBING_ACTIONS.has(leaf.nativeName);
      });
    return {
      locallyInvisible:
        hasNoVisibleIcon(root, id) &&
        hasNoCombatPayload(root, id) &&
        references.every(reference => reference.state === 'active' && reference.id !== null) &&
        actionsArePresentationOnly,
      references: staticReferences,
    };
  } catch {
    return { locallyInvisible: false, references: [] };
  }
}

function hasNoVisibleIcon(root: Record<string, unknown>, id: string): boolean {
  const icon = requireRecord(root.iconConfig, `BuffData.${id}.iconConfig`);
  return (
    root.hasIcon === false &&
    requireString(icon._spritePath, `BuffData.${id}.iconConfig._spritePath`) === ''
  );
}

function hasNoCombatPayload(root: Record<string, unknown>, id: string): boolean {
  const empty = (field: string) =>
    requireArray(root[field], `BuffData.${id}.${field}`).length === 0;
  const attributes = requireRecord(root.attributeModifier, `BuffData.${id}.attributeModifier`);
  const stacking = requireRecord(root.stackingSettings, `BuffData.${id}.stackingSettings`);
  return (
    requireArray(
      attributes.attributeModifiers,
      `BuffData.${id}.attributeModifier.attributeModifiers`,
    ).length === 0 &&
    empty('damageModifier') &&
    empty('healModifier') &&
    empty('poiseModifier') &&
    empty('globalModifier') &&
    empty('shieldConfigs') &&
    empty('applyTags') &&
    empty('tagsAfterTriggerExtendBuffAction') &&
    // Blackboard 只有被战斗动作读取时才可见；actionsArePresentationOnly 已排除这种消费者。
    // stackEffects 只承载 EffectAction，来源图解析已严格验证其结构。
    Array.isArray(stacking.stackEffects)
  );
}
