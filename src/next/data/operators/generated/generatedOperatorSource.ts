/**
 * 解包数据到正式干员 DSL 之间的可审计中间层。
 * 这里保存原始时间窗口和行为类型；未完成语义转换的行为不得直接进入战斗模拟。
 */
import type { SkillType } from '../../../core/game-data/operatorDefinition';

export interface GeneratedTimelineActionSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionTypes: readonly string[];
}

export interface GeneratedSkillSource {
  readonly key: string;
  readonly skillType: SkillType;
  readonly sourceFile: string;
  readonly timelineBlockFrames: number;
  readonly blockBoundarySource: 'exclusiveFrame+1' | 'AllowNextSkillAction.startFrame';
  readonly cooldownSeconds: number;
  readonly costFrame: number;
  readonly costType: string;
  readonly costValue: number;
  readonly offsetRecordFrame: number;
  readonly allowNextWindows: readonly {
    readonly startFrame: number;
    readonly endFrame: number;
    readonly skillIds: readonly string[];
  }[];
  readonly inputCacheWindows: readonly {
    readonly startFrame: number;
    readonly endFrame: number;
    readonly mappings: readonly Readonly<Record<string, unknown>>[];
  }[];
  readonly timelineActions: readonly GeneratedTimelineActionSource[];
  /** 需要由 SkillPatch、Buff 或运行时上下文赋值后才能闭环的原生黑板键。 */
  readonly blackboardKeys: readonly string[];
  /** 尚未转换成 Next 语义步骤的战斗行为；非空时不能把该技能视为生成完成。 */
  readonly unresolvedCombatActions: readonly string[];
}

export interface GeneratedOperatorSource {
  readonly slug: string;
  readonly skills: readonly GeneratedSkillSource[];
}
