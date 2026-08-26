/**
 * Next UI 对旧版富文本渲染器和共用弹窗样式的集中适配。
 *
 * 本模块只桥接视觉资源，不读取旧 Store 或业务数据。未来 Next 拥有原生主题与富文本组件时，
 * 可替换这里的导出及样式入口，使用方无需继续保留跨数据版本的旧版依赖。
 */
import GameRichTextRenderer from '@/components/GameRichTextRenderer.vue';
import OperatorSkillTooltip from '@/components/armory/OperatorSkillTooltip.vue';
import '@/components/armory/armoryDialogTheme.css';
import EquipmentSelectionTooltip from '@/components/selection/EquipmentSelectionTooltip.vue';
import WeaponSelectionTooltip from '@/components/selection/WeaponSelectionTooltip.vue';
import '@/components/selection/selectionDialog.css';
import { getGearPiece, getOperator, getWeapon } from '@/data';
import { getEffectIcon } from '@/data/effectPresets';
import type { Effect } from '@/data/types';
import {
  formatEquipmentEffectLabel,
  formatEquipmentEffectStatValue,
  getEquipmentEffectModifierIds,
  mergeEquipmentElementPairEffects,
} from '@/utils/equipmentEffectDisplay';

export {
  EquipmentSelectionTooltip,
  GameRichTextRenderer,
  OperatorSkillTooltip,
  WeaponSelectionTooltip,
};

/** 仅向复用的旧版 tooltip 提供展示数据；不得参与 Next 编译或模拟。 */
export function getLegacyOperatorSheet(assetSlug: string) {
  return getOperator(assetSlug);
}

/** 只判断是否具备旧版武器展示数据，不把旧定义传入 Next 领域层。 */
export function hasLegacyWeaponPresentation(assetSlug: string): boolean {
  return getWeapon(assetSlug) !== undefined;
}

export interface LegacyGearSelectionAffixRow {
  readonly key: string;
  readonly modifierId: string;
  readonly label: string;
  readonly valueText: string;
  readonly src: string;
  readonly marker: 'hollow-dot' | 'image';
  readonly title: string;
}

/** 只复用旧版装备 tooltip 的展示投影；返回值不进入 Next 定义或模拟。 */
export function getLegacyGearSelectionAffixRows(
  assetSlug: string,
  t: (key: string, named?: Record<string, unknown>) => string,
  locale: string,
): readonly LegacyGearSelectionAffixRow[] {
  const piece = getGearPiece(assetSlug);
  if (!piece) return [];
  return [piece.skill1, piece.skill2, piece.skill3].filter(Boolean).flatMap((skill, slotIndex) =>
    (mergeEquipmentElementPairEffects((skill!.effects ?? []) as never) as unknown as Effect[])
      .filter(effect => effect.kind === 'status')
      .flatMap((effect, effectIndex) => {
        const rawValues = Array.isArray(effect.value) ? effect.value : [effect.value];
        const valueText = rawValues
          .filter(value => value !== undefined && value !== null)
          .map(value => `+${formatEquipmentEffectStatValue(effect as never, value)}`)
          .join(' / ');
        return getEquipmentEffectModifierIds(effect.stat).map(modifierId => {
          const isPair =
            modifierId === 'heat_nature_dmg_bonus' || modifierId === 'cryo_electric_dmg_bonus';
          const label = formatEquipmentEffectLabel(effect as never, t, locale);
          return {
            key: `${assetSlug}-${slotIndex}-${effectIndex}-${modifierId}`,
            modifierId,
            label,
            valueText,
            src: isPair ? '' : getEffectIcon(effect),
            marker: isPair ? ('hollow-dot' as const) : ('image' as const),
            title: valueText ? `${label} ${valueText}` : label,
          };
        });
      }),
  );
}
