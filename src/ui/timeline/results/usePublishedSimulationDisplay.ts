import { computed, shallowRef, watch, type Ref } from 'vue';
import type { PublishedScenarioSimulation } from '../useScenarioSimulation';
import type { TimelineOperatorIndex } from '../timelineEditorViewModel';
import type { TimelineBattleLogSnapshot } from './timelineBattleLogProjection';
import { capturePublishedBattleLog, type PublishedBattleLogLabels } from './publishedBattleLog';
import {
  capturePublishedWeaponSources,
  type PublishedBuffSource,
  type PublishedWeaponIdentity,
} from './publishedBuffSource';
import {
  capturePublishedOperatorMetadata,
  type PublishedOperatorMetadata,
} from './publishedOperatorMetadata';

/** 只在模拟发布时捕获显示身份；后续编辑不会刷新旧结果的来源。 */
export function usePublishedSimulationDisplay(
  published: Readonly<Ref<PublishedScenarioSimulation | null>>,
  index: TimelineOperatorIndex,
  getWeapons: () => readonly PublishedWeaponIdentity[],
  labels: PublishedBattleLogLabels,
  getGears?: () => readonly { readonly slug: string; readonly iconPath?: string }[],
) {
  const battleLogSnapshot = shallowRef<TimelineBattleLogSnapshot | null>(null);
  const publishedOperators = shallowRef<ReadonlyMap<string, PublishedOperatorMetadata>>(new Map());
  const publishedWeaponSources = shallowRef<ReadonlyMap<string, PublishedBuffSource>>(new Map());
  const publishedGearIcons = shallowRef<ReadonlyMap<string, string>>(new Map());
  // 固定历史视图共用同一份缓存数组，不由每个旧投影重复物化。
  const publishedReceiptEntries = computed(
    () => published.value?.run.receiptHistory.toArray() ?? [],
  );
  watch(
    published,
    value => {
      if (value === null) {
        battleLogSnapshot.value = null;
        publishedOperators.value = new Map();
        publishedWeaponSources.value = new Map();
        publishedGearIcons.value = new Map();
        return;
      }
      publishedOperators.value = capturePublishedOperatorMetadata(value.scenario, index);
      publishedWeaponSources.value = capturePublishedWeaponSources(getWeapons());
      publishedGearIcons.value = new Map(
        (getGears?.() ?? []).flatMap(gear =>
          gear.iconPath ? [[gear.slug, gear.iconPath] as const] : [],
        ),
      );
      battleLogSnapshot.value = capturePublishedBattleLog(
        value,
        index,
        publishedOperators.value,
        labels,
      );
    },
    { flush: 'sync' },
  );
  return {
    battleLogSnapshot,
    publishedOperators,
    publishedWeaponSources,
    publishedGearIcons,
    publishedReceiptEntries,
  };
}
