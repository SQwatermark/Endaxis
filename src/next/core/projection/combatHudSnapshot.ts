/**
 * 把已经完成的战斗投影采样为某一帧的 HUD 快照。
 *
 * 本模块不读取运行时对象，也不重算战斗结果。曲线提供数值，回执提供离散状态；
 * 同帧事实严格按 sequence 顺序处理。
 */
import type { CombatReceiptEntry, CombatReceiptValue } from '../combat/receipt/combatReceipt';
import type { EnemyHealthCurve } from './enemyHealthCurves';
import type { PoiseCurve } from './poiseCurves';
import type { CombatResourceCurves, OperatorUltimateEnergyCurve } from './resourceCurves';
import { sampleStepCurve } from './curveSampling';
import {
  projectComboWindowTimelineViz,
  type ComboWindowTimelineSegment,
} from './comboWindowTimelineViz';
import {
  projectSkillCooldownTimelineViz,
  type SkillCooldownTimelineSegment,
} from './skillCooldownTimelineViz';

export interface CombatHudGaugeSnapshot {
  readonly current: number | null;
  readonly maximum: number;
  readonly ratio: number | null;
}

export type EnemyPoiseHudState = 'normal' | 'recovering' | 'brokenEndWindow';

export interface EnemyCombatHudSnapshot {
  readonly health: CombatHudGaugeSnapshot;
  readonly poise: (CombatHudGaugeSnapshot & { readonly state: EnemyPoiseHudState }) | null;
}

export interface OperatorCombatHudSnapshot {
  readonly operatorId: string;
  readonly ultimateEnergy: CombatHudGaugeSnapshot;
  readonly activeSkillId: string | null;
  readonly activeCastId: string | null;
  readonly skillSlots: readonly CombatHudSkillSlotSnapshot[];
  readonly cooldowns: readonly SkillCooldownTimelineSegment[];
  readonly comboWindows: readonly ComboWindowTimelineSegment[];
}

export interface CombatHudSkillSlotSnapshot {
  readonly skillSlotKey: string;
  readonly currentSkillKey: string;
}

export interface CombatHudOperatorSkillSlotsInitial {
  readonly operatorId: string;
  readonly slots: readonly CombatHudSkillSlotSnapshot[];
}

export interface CombatHudSnapshot {
  readonly frame: number;
  readonly sp: CombatHudGaugeSnapshot;
  readonly enemy: EnemyCombatHudSnapshot;
  readonly operators: readonly OperatorCombatHudSnapshot[];
}

export interface CombatHudSnapshotInput {
  readonly frame: number;
  readonly endFrame: number;
  readonly enemyHealthCurve: EnemyHealthCurve;
  readonly poiseCurve: PoiseCurve;
  readonly resourceCurves: CombatResourceCurves;
  readonly receiptEntries: readonly CombatReceiptEntry[];
  readonly operatorSkillSlots?: readonly CombatHudOperatorSkillSlotsInitial[];
}

function gauge(
  points: Parameters<typeof sampleStepCurve>[0],
  maximum: number,
  frame: number,
): CombatHudGaugeSnapshot {
  const current = sampleStepCurve(points, frame).value;
  return {
    current,
    maximum,
    ratio: current === null || maximum <= 0 ? null : Math.min(1, Math.max(0, current / maximum)),
  };
}

function booleanData(
  data: Readonly<Record<string, CombatReceiptValue>> | undefined,
  key: string,
): boolean | undefined {
  const value = data?.[key];
  return typeof value === 'boolean' ? value : undefined;
}

function stringData(
  data: Readonly<Record<string, CombatReceiptValue>> | undefined,
  key: string,
): string | undefined {
  const value = data?.[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function enemyPoiseState(
  entries: readonly CombatReceiptEntry[],
  frame: number,
): EnemyPoiseHudState {
  let recovering = false;
  let brokenTag = false;
  for (const entry of entries) {
    if (entry.frame > frame) break;
    if (entry.event === 'PoiseApplied') {
      if (booleanData(entry.data, 'brokePoise') === true) recovering = true;
      brokenTag = booleanData(entry.data, 'hasPoiseBrokenTag') ?? brokenTag;
      continue;
    }
    if (entry.event === 'PoiseRecovered') {
      recovering = false;
      brokenTag = booleanData(entry.data, 'hasPoiseBrokenTag') ?? brokenTag;
      continue;
    }
    if (entry.event === 'PoiseBrokenTagEnded') {
      brokenTag = booleanData(entry.data, 'hasPoiseBrokenTag') ?? false;
    }
  }
  return recovering ? 'recovering' : brokenTag ? 'brokenEndWindow' : 'normal';
}

function activeSkillsAtFrame(
  entries: readonly CombatReceiptEntry[],
  frame: number,
): ReadonlyMap<string, { readonly skillId: string; readonly castId: string | null }> {
  const active = new Map<string, { skillId: string; castId: string | null }>();
  for (const entry of entries) {
    if (entry.frame > frame) break;
    const operatorId = entry.sourceId;
    if (operatorId === undefined) continue;
    if (entry.event === 'SkillStarted') {
      const skillId = stringData(entry.data, 'skillId');
      if (skillId === undefined) continue;
      active.set(operatorId, {
        skillId,
        castId: stringData(entry.data, 'castId') ?? null,
      });
      continue;
    }
    if (entry.event !== 'SkillEnded' && entry.event !== 'SkillInterrupted') continue;
    const current = active.get(operatorId);
    if (current === undefined) continue;
    const skillId = stringData(entry.data, 'skillId');
    const castId = stringData(entry.data, 'castId');
    if (
      (skillId === undefined || skillId === current.skillId) &&
      (castId === undefined || current.castId === null || castId === current.castId)
    ) {
      active.delete(operatorId);
    }
  }
  return active;
}

function skillSlotsAtFrame(
  entries: readonly CombatReceiptEntry[],
  frame: number,
  initial: readonly CombatHudOperatorSkillSlotsInitial[],
): ReadonlyMap<string, readonly CombatHudSkillSlotSnapshot[]> {
  const slots = new Map<string, Map<string, string>>();
  for (const operator of initial) {
    if (slots.has(operator.operatorId)) {
      throw new Error(`duplicate HUD skill-slot operator '${operator.operatorId}'`);
    }
    slots.set(
      operator.operatorId,
      new Map(operator.slots.map(slot => [slot.skillSlotKey, slot.currentSkillKey])),
    );
  }
  for (const entry of entries) {
    if (entry.frame > frame) break;
    if (entry.event !== 'SkillSlotChanged' || entry.sourceId === undefined) continue;
    const operatorSlots = slots.get(entry.sourceId);
    if (operatorSlots === undefined) continue;
    const skillSlotKey = stringData(entry.data, 'skillGroupKey');
    const targetSkillKey = stringData(entry.data, 'targetSkillKey');
    if (skillSlotKey === undefined || targetSkillKey === undefined) continue;
    if (!operatorSlots.has(skillSlotKey)) {
      throw new Error(
        `HUD skill-slot receipt ${entry.sequence} references unknown slot '${skillSlotKey}' on '${entry.sourceId}'`,
      );
    }
    operatorSlots.set(skillSlotKey, targetSkillKey);
  }
  return new Map(
    [...slots].map(([operatorId, operatorSlots]) => [
      operatorId,
      [...operatorSlots].map(([skillSlotKey, currentSkillKey]) => ({
        skillSlotKey,
        currentSkillKey,
      })),
    ]),
  );
}

function intervalContainsFrame(
  startFrame: number,
  endFrame: number,
  completed: boolean,
  frame: number,
): boolean {
  return frame >= startFrame && (frame < endFrame || (!completed && frame === endFrame));
}

function operatorSnapshot(
  curve: OperatorUltimateEnergyCurve,
  frame: number,
  activeSkills: ReadonlyMap<string, { readonly skillId: string; readonly castId: string | null }>,
  skillSlots: ReadonlyMap<string, readonly CombatHudSkillSlotSnapshot[]>,
  cooldowns: readonly SkillCooldownTimelineSegment[],
  comboWindows: readonly ComboWindowTimelineSegment[],
): OperatorCombatHudSnapshot {
  const active = activeSkills.get(curve.operatorId);
  return {
    operatorId: curve.operatorId,
    ultimateEnergy: gauge(curve.points, curve.maxValue, frame),
    activeSkillId: active?.skillId ?? null,
    activeCastId: active?.castId ?? null,
    skillSlots: skillSlots.get(curve.operatorId) ?? [],
    cooldowns: cooldowns.filter(
      item =>
        item.operatorId === curve.operatorId &&
        intervalContainsFrame(item.startFrame, item.endFrame, item.completed, frame),
    ),
    comboWindows: comboWindows.filter(
      item =>
        item.operatorId === curve.operatorId &&
        frame >= item.startFrame &&
        (frame < item.endFrame || (item.outcome === 'pending' && frame === item.endFrame)),
    ),
  };
}

/** 在现实时间轴帧上采样一次只读 HUD 快照。 */
export function projectCombatHudSnapshot(input: CombatHudSnapshotInput): CombatHudSnapshot {
  if (!Number.isInteger(input.frame) || input.frame < 0) {
    throw new RangeError('HUD snapshot frame must be a non-negative integer');
  }
  if (!Number.isInteger(input.endFrame) || input.endFrame < input.frame) {
    throw new RangeError('HUD snapshot endFrame must be an integer not before frame');
  }
  const activeSkills = activeSkillsAtFrame(input.receiptEntries, input.frame);
  const skillSlots = skillSlotsAtFrame(
    input.receiptEntries,
    input.frame,
    input.operatorSkillSlots ?? [],
  );
  const cooldowns = projectSkillCooldownTimelineViz(input.receiptEntries, input.endFrame);
  const comboWindows = projectComboWindowTimelineViz(input.receiptEntries, input.endFrame);
  return {
    frame: input.frame,
    sp: gauge(input.resourceCurves.sp.points, input.resourceCurves.sp.maxValue, input.frame),
    enemy: {
      health: gauge(input.enemyHealthCurve.points, input.enemyHealthCurve.maxValue, input.frame),
      poise:
        input.poiseCurve.maxValue <= 0
          ? null
          : {
              ...gauge(input.poiseCurve.points, input.poiseCurve.maxValue, input.frame),
              state: enemyPoiseState(input.receiptEntries, input.frame),
            },
    },
    operators: input.resourceCurves.ultimateEnergy.map(curve =>
      operatorSnapshot(curve, input.frame, activeSkills, skillSlots, cooldowns, comboWindows),
    ),
  };
}
