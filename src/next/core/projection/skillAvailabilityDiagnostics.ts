/**
 * 从战斗事实回执投影技能开始时的可用性诊断。
 * 这里只归拢运行时已经记录的事实，不读取或重算资源、冷却与技能定义。
 */
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { reduceSkillDiagnostics } from './skillDiagnosticReducer';

export const SKILL_AVAILABILITY_DIAGNOSTIC_REASONS = [
  'resourceUnavailable',
  'cooldownUnavailable',
  'skillInputMismatch',
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
  /** 槽位不一致时保留原生实际解析到的具体技能，供感叹号解释而不是只给枚举。 */
  readonly actualSkillId?: string;
}

function readReason(event: string): SkillAvailabilityDiagnosticReason | undefined {
  if (event === 'SkillCostUnavailableAtStart') return 'resourceUnavailable';
  if (event === 'SkillCooldownUnavailableAtStart') return 'cooldownUnavailable';
  if (event === 'SkillInputResolvedToDifferentSkill') return 'skillInputMismatch';
  return undefined;
}

/** 识别开始时可用性事实后，交由内部归约器统一定位和合并。 */
export function projectSkillAvailabilityDiagnostics(
  entries: readonly CombatReceiptEntry[],
): readonly SkillAvailabilityDiagnostic[] {
  return reduceSkillDiagnostics(entries, readReason).map(diagnostic => {
    if (!diagnostic.reasons.includes('skillInputMismatch')) return diagnostic;
    const mismatch = entries.find(
      entry =>
        diagnostic.receiptSequences.includes(entry.sequence) &&
        entry.event === 'SkillInputResolvedToDifferentSkill',
    );
    const actualSkillId = mismatch?.data?.actualSkillId;
    return typeof actualSkillId === 'string' && actualSkillId.length > 0
      ? { ...diagnostic, actualSkillId }
      : diagnostic;
  });
}
