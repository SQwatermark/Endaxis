/**
 * 把 Buff 生命周期回执投影成时间轴可画的持续段。
 * 这里只解释已发生的施加、叠层和结束事实；展示位置和样式属于 UI。
 */
import type { CombatReceiptEntry, CombatReceiptValue } from '../combat/receipt/combatReceipt';

export interface BuffTimelineSegment {
  readonly sourceId?: string;
  readonly sourceActionId?: string;
  readonly targetId: string;
  readonly buffId: string;
  readonly instanceId: number;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly layers: number;
  /** 原生 Buff 是否具有有限生命周期；用于 Default 图标样式的原生回退。 */
  readonly hasFiniteLifetime?: boolean;
  /** 旧版可视分区：干员来源位于技能块上方，配装来源位于下方。 */
  readonly placement: 'upper' | 'lower';
  /** 严格单属性修正的事实字段；本地化摘要由 UI 生成。 */
  readonly simpleModifierAttribute?: string;
  readonly simpleModifierSlot?: string;
  readonly simpleModifierValue?: number;
  readonly iconId?: string;
  readonly iconPath?: string;
  readonly showInHeadBarCommon?: boolean;
  readonly showInHeadBarAttached?: boolean;
  readonly showInSquadIcon?: boolean;
  readonly onlyShowForMainCharacter?: boolean;
  readonly showProgressInHpBar?: boolean;
  readonly showProgressInNormalSkillButton?: boolean;
  readonly useWeakProgressInNormalSkillButton?: boolean;
  readonly showProgressInUltimateSkillButton?: boolean;
  readonly showWarningBackground?: boolean;
  readonly iconStyleInSquad?: string;
  readonly abnormalColorType?: string;
  readonly orderUseDirectoryValue?: boolean;
  readonly orderPriorityValue?: number;
  readonly orderPriorityCategory?: string;
}

export interface PositionedBuffTimelineSegment extends BuffTimelineSegment {
  readonly lane: number;
}

function requireData(entry: CombatReceiptEntry): Readonly<Record<string, CombatReceiptValue>> {
  if (entry.data === undefined)
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no data`);
  return entry.data;
}

function requireString(
  entry: CombatReceiptEntry,
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): string {
  const value = data[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no ${key}`);
  }
  return value;
}

function requireNumber(
  entry: CombatReceiptEntry,
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): number {
  const value = data[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no finite ${key}`);
  }
  return value;
}

function optionalString(
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): string | undefined {
  const value = data[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function optionalBoolean(
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): boolean | undefined {
  const value = data[key];
  return typeof value === 'boolean' ? value : undefined;
}

function instanceKey(targetId: string, buffId: string, instanceId: number): string {
  return `${targetId}\u0000${buffId}\u0000${instanceId}`;
}

interface SimpleModifierFact {
  readonly simpleModifierAttribute: string;
  readonly simpleModifierSlot: string;
  readonly simpleModifierValue: number;
}

function simpleModifierFact(
  data: Readonly<Record<string, CombatReceiptValue>>,
): SimpleModifierFact | undefined {
  const simpleModifierAttribute = optionalString(data, 'simpleModifierAttribute');
  const simpleModifierSlot = optionalString(data, 'simpleModifierSlot');
  const simpleModifierValue = optionalNumber(data, 'simpleModifierValue');
  return simpleModifierAttribute === undefined ||
    simpleModifierSlot === undefined ||
    simpleModifierValue === undefined
    ? undefined
    : { simpleModifierAttribute, simpleModifierSlot, simpleModifierValue };
}

function sourceFrameKey(entry: CombatReceiptEntry): string | undefined {
  if (entry.targetId === undefined || entry.data === undefined) return undefined;
  const sourceActionId = optionalString(entry.data, 'sourceActionId');
  return sourceActionId === undefined
    ? undefined
    : `${entry.targetId}\u0000${sourceActionId}\u0000${entry.frame}`;
}

/**
 * 原生“战斗修正父 Buff + 纯展示子 Buff”会在同帧使用同一 sourceActionId。
 * 仅当该来源帧只有一种严格单属性事实时才允许展示子项继承摘要；多项效果保持无摘要。
 */
function collectUnambiguousModifierFacts(
  entries: readonly CombatReceiptEntry[],
): ReadonlyMap<string, SimpleModifierFact> {
  const candidates = new Map<string, Map<string, SimpleModifierFact>>();
  for (const entry of entries) {
    if (entry.event !== 'BuffApplied' || entry.data === undefined) continue;
    const key = sourceFrameKey(entry);
    const fact = simpleModifierFact(entry.data);
    if (key === undefined || fact === undefined) continue;
    const identity = `${fact.simpleModifierAttribute}\u0000${fact.simpleModifierSlot}\u0000${fact.simpleModifierValue}`;
    const values = candidates.get(key) ?? new Map<string, SimpleModifierFact>();
    values.set(identity, fact);
    candidates.set(key, values);
  }
  return new Map(
    [...candidates].flatMap(([key, values]) =>
      values.size === 1 ? [[key, [...values.values()][0]!] as const] : [],
    ),
  );
}

function presentationPlacement(
  data: Readonly<Record<string, CombatReceiptValue>>,
): BuffTimelineSegment['placement'] {
  const sourceActionId = optionalString(data, 'sourceActionId');
  const equipmentInitialization =
    sourceActionId?.startsWith('upgrade-initialization:weapon-trait:') === true ||
    sourceActionId?.startsWith('upgrade-initialization:gear-trait:') === true ||
    sourceActionId?.startsWith('upgrade-initialization:gear-set:') === true;
  return sourceActionId?.startsWith('equipment:') === true || equipmentInitialization
    ? 'lower'
    : 'upper';
}

/**
 * 没有原生展示身份的内部机制 Buff 不进入 UI；显式 `visible: false` 同样隐藏。
 * 图标路径优先，iconId 仍保留给资源路径回退。
 */
function isVisibleBuff(data: Readonly<Record<string, CombatReceiptValue>>): boolean {
  return (
    data.visible !== false &&
    (data.visible === true ||
      optionalString(data, 'iconPath') !== undefined ||
      optionalString(data, 'iconId') !== undefined)
  );
}

export function projectBuffTimelineViz(
  entries: readonly CombatReceiptEntry[],
  endFrame: number,
): readonly BuffTimelineSegment[] {
  if (!Number.isInteger(endFrame) || endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  const open = new Map<string, BuffTimelineSegment>();
  const closed: BuffTimelineSegment[] = [];
  const inheritedModifierFacts = collectUnambiguousModifierFacts(entries);

  for (const entry of entries) {
    const isApplied = entry.event === 'BuffApplied' || entry.event === 'BuffPresentationStarted';
    const isFinished = entry.event === 'BuffFinished' || entry.event === 'BuffPresentationFinished';
    if (!isApplied && !isFinished) continue;
    if (entry.targetId === undefined) {
      throw new Error(`receipt ${entry.sequence} '${entry.event}' has no targetId`);
    }
    const data = requireData(entry);
    const buffId = requireString(entry, data, 'buffId');
    const instanceId = requireNumber(entry, data, 'instanceId');
    const key = instanceKey(entry.targetId, buffId, instanceId);

    if (isFinished) {
      const active = open.get(key);
      if (active !== undefined) {
        open.delete(key);
        closed.push({ ...active, endFrame: entry.frame });
      }
      continue;
    }
    if (!isVisibleBuff(data)) continue;
    const modifierFact =
      simpleModifierFact(data) ??
      (sourceFrameKey(entry) === undefined
        ? undefined
        : inheritedModifierFacts.get(sourceFrameKey(entry)!));
    const previous = open.get(key);
    if (previous !== undefined) closed.push({ ...previous, endFrame: entry.frame });
    open.set(key, {
      ...(entry.sourceId === undefined ? {} : { sourceId: entry.sourceId }),
      ...(optionalString(data, 'sourceActionId') === undefined
        ? {}
        : { sourceActionId: optionalString(data, 'sourceActionId') }),
      targetId: entry.targetId,
      buffId,
      instanceId,
      startFrame: entry.frame,
      endFrame,
      layers: requireNumber(entry, data, 'layers'),
      ...copyOptionalBoolean(data, 'hasFiniteLifetime'),
      placement: presentationPlacement(data),
      ...(modifierFact ?? {}),
      ...(optionalString(data, 'iconId') === undefined
        ? {}
        : { iconId: optionalString(data, 'iconId') }),
      ...(optionalString(data, 'iconPath') === undefined
        ? {}
        : { iconPath: optionalString(data, 'iconPath') }),
      ...copyOptionalBoolean(data, 'showInHeadBarCommon'),
      ...copyOptionalBoolean(data, 'showInHeadBarAttached'),
      ...copyOptionalBoolean(data, 'showInSquadIcon'),
      ...copyOptionalBoolean(data, 'onlyShowForMainCharacter'),
      ...copyOptionalBoolean(data, 'showProgressInHpBar'),
      ...copyOptionalBoolean(data, 'showProgressInNormalSkillButton'),
      ...copyOptionalBoolean(data, 'useWeakProgressInNormalSkillButton'),
      ...copyOptionalBoolean(data, 'showProgressInUltimateSkillButton'),
      ...copyOptionalBoolean(data, 'showWarningBackground'),
      ...(optionalString(data, 'iconStyleInSquad') === undefined
        ? {}
        : { iconStyleInSquad: optionalString(data, 'iconStyleInSquad') }),
      ...(optionalString(data, 'abnormalColorType') === undefined
        ? {}
        : { abnormalColorType: optionalString(data, 'abnormalColorType') }),
      ...copyOptionalBoolean(data, 'orderUseDirectoryValue'),
      ...(optionalNumber(data, 'orderPriorityValue') === undefined
        ? {}
        : { orderPriorityValue: optionalNumber(data, 'orderPriorityValue') }),
      ...(optionalString(data, 'orderPriorityCategory') === undefined
        ? {}
        : { orderPriorityCategory: optionalString(data, 'orderPriorityCategory') }),
    });
  }
  return [...closed, ...open.values()].sort(
    (left, right) => left.startFrame - right.startFrame || left.instanceId - right.instanceId,
  );
}

function optionalNumber(
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): number | undefined {
  const value = data[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function copyOptionalBoolean(
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): Readonly<Record<string, boolean>> {
  const value = optionalBoolean(data, key);
  return value === undefined ? {} : { [key]: value };
}

/** 复刻旧版的紧凑排布：同一行不重叠即可复用，避免无意义地撑高轨道。 */
export function layoutBuffTimelineSegments(
  segments: readonly BuffTimelineSegment[],
): readonly PositionedBuffTimelineSegment[] {
  const laneEnds: number[] = [];
  return segments.map(segment => {
    let lane = laneEnds.findIndex(endFrame => endFrame <= segment.startFrame);
    if (lane < 0) lane = laneEnds.length;
    laneEnds[lane] = segment.endFrame;
    return { ...segment, lane };
  });
}
