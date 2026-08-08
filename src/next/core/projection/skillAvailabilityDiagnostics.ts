/**
 * 从战斗事实回执投影技能开始时的可用性诊断。
 * 本层只归约运行时已经记录的事实，不读取或重算资源、冷却与技能定义。
 */
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';

export const SKILL_AVAILABILITY_DIAGNOSTIC_REASONS = [
  'resourceUnavailable',
  'cooldownUnavailable',
] as const;

/** UI 可按稳定枚举映射本地化文本，核心投影不携带显示文案。 */
export type SkillAvailabilityDiagnosticReason =
  (typeof SKILL_AVAILABILITY_DIAGNOSTIC_REASONS)[number];

/** 一次技能开始位置上，由一个或多个回执事实归约出的诊断。 */
export interface SkillAvailabilityDiagnostic {
  readonly frame: number;
  readonly sourceId: string;
  readonly skillId: string;
  readonly reasons: readonly SkillAvailabilityDiagnosticReason[];
  readonly receiptSequences: readonly number[];
}

interface MutableSkillAvailabilityDiagnostic {
  readonly frame: number;
  readonly sourceId: string;
  readonly skillId: string;
  readonly reasons: SkillAvailabilityDiagnosticReason[];
  readonly receiptSequences: number[];
}

function readReason(event: string): SkillAvailabilityDiagnosticReason | undefined {
  if (event === 'SkillCostUnavailableAtStart') return 'resourceUnavailable';
  if (event === 'SkillCooldownUnavailableAtStart') return 'cooldownUnavailable';
  return undefined;
}

function readLocation(entry: CombatReceiptEntry): {
  sourceId: string;
  skillId: string;
} {
  if (entry.sourceId === undefined || entry.sourceId.length === 0) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no sourceId`);
  }
  const skillId = entry.data?.skillId;
  if (typeof skillId !== 'string' || skillId.length === 0) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no skillId`);
  }
  return { sourceId: entry.sourceId, skillId };
}

/**
 * 保持首个事实的顺序输出诊断。同一位置的重复原因只保留一次，
 * 但所有原始 sequence 都会留下，便于调试运行时重复记账。
 */
export function projectSkillAvailabilityDiagnostics(
  entries: readonly CombatReceiptEntry[],
): readonly SkillAvailabilityDiagnostic[] {
  const diagnostics: MutableSkillAvailabilityDiagnostic[] = [];
  const diagnosticsByLocation = new Map<string, MutableSkillAvailabilityDiagnostic>();

  for (const entry of entries) {
    const reason = readReason(entry.event);
    if (reason === undefined) continue;

    const { sourceId, skillId } = readLocation(entry);
    const locationKey = JSON.stringify([entry.frame, sourceId, skillId]);
    let diagnostic = diagnosticsByLocation.get(locationKey);
    if (diagnostic === undefined) {
      diagnostic = {
        frame: entry.frame,
        sourceId,
        skillId,
        reasons: [],
        receiptSequences: [],
      };
      diagnosticsByLocation.set(locationKey, diagnostic);
      diagnostics.push(diagnostic);
    }
    if (!diagnostic.reasons.includes(reason)) diagnostic.reasons.push(reason);
    diagnostic.receiptSequences.push(entry.sequence);
  }

  return diagnostics.map(diagnostic => ({
    ...diagnostic,
    reasons: [...diagnostic.reasons],
    receiptSequences: [...diagnostic.receiptSequences],
  }));
}
