import type { PublishedOperatorMetadata } from './publishedOperatorMetadata';
import type {
  OperatorPanelContributionReceipt,
  ResolvedOperatorPanel,
} from '../../core/compiler/resolveOperatorPanel';
import {
  getGearPieceGameName,
  getGearSetGameName,
  getOperatorPotentialName,
  getOperatorTalentName,
  getWeaponGameName,
} from '../gameText';

export interface OperatorPanelContributionPresentationContext {
  readonly operator: Pick<PublishedOperatorMetadata, 'slug' | 'talents' | 'potentials'> | null;
  readonly locale: string;
  readonly translate: (key: string, params?: Record<string, unknown>) => string;
}

/**
 * 面板和伤害详情共用同一静态构筑来源名称。它只解释 resolver 已经给出的来源身份，
 * 不根据数值或技能名称反推来源。
 */
export function resolveOperatorPanelContributionSourceLabel(
  entry: OperatorPanelContributionReceipt,
  context: OperatorPanelContributionPresentationContext,
): string {
  const source = entry.source;
  if (source.kind === 'operatorBase') return context.translate('statDetail.baseSource');
  if (source.kind === 'trust') {
    return context.translate('timeline.panel.trustNode', { node: source.node });
  }
  if (source.kind === 'weaponBase') return getWeaponGameName(source.weaponSlug, context.locale);
  if (source.kind === 'gearBase') return getGearPieceGameName(source.gearSlug, context.locale);
  if (source.kind === 'operatorUpgrade') {
    const operator = context.operator;
    if (operator !== null) {
      const talentIndex = operator.talents.findIndex(value => value.key === source.upgradeKey);
      if (talentIndex >= 0) {
        const flatIndex = operator.talents
          .slice(0, talentIndex)
          .reduce((sum, value) => sum + value.levels, 0);
        return getOperatorTalentName(operator.slug, flatIndex, 0, context.locale);
      }
      const potentialIndex = operator.potentials.findIndex(
        value => value.key === source.upgradeKey,
      );
      if (potentialIndex >= 0) {
        const flatIndex = operator.potentials
          .slice(0, potentialIndex)
          .reduce((sum, value) => sum + value.levels, 0);
        return getOperatorPotentialName(operator.slug, flatIndex, context.locale);
      }
    }
    return source.upgradeKey;
  }
  if (source.kind === 'globalConfig') {
    return context.translate('timeline.globalModifiers.title');
  }
  const contribution = source.contribution;
  if (contribution.kind === 'weaponTrait') {
    return getWeaponGameName(contribution.slug, context.locale);
  }
  if (contribution.kind === 'gearTrait') {
    return getGearPieceGameName(contribution.slug, context.locale);
  }
  return getGearSetGameName(contribution.slug, context.locale);
}

/** 旧版攻击折叠树只在“攻击百分比”节点下列出这一乘区的逐来源贡献。 */
export function projectAttackPercentContributionSources(
  panel: Pick<ResolvedOperatorPanel, 'receipt'> | null,
): readonly OperatorPanelContributionReceipt[] {
  return (
    panel?.receipt.filter(entry => entry.stat === 'attack' && entry.operation === 'percent') ?? []
  );
}
