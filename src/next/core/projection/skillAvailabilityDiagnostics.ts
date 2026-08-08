/**
 * 从战斗事实回执投影技能开始时的可用性诊断。
 * 本层只归约运行时已经记录的事实，不读取或重算资源、冷却与技能定义。
 */
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { reduceSkillDiagnostics } from './skillDiagnosticReducer';

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

function readReason(event: string): SkillAvailabilityDiagnosticReason | undefined {
  if (event === 'SkillCostUnavailableAtStart') return 'resourceUnavailable';
  if (event === 'SkillCooldownUnavailableAtStart') return 'cooldownUnavailable';
  return undefined;
}

/** 识别开始时可用性事实后，交由内部归约器统一定位和合并。 */
export function projectSkillAvailabilityDiagnostics(
  entries: readonly CombatReceiptEntry[],
): readonly SkillAvailabilityDiagnostic[] {
  return reduceSkillDiagnostics(entries, readReason);
}
