<script setup lang="ts">
/**
 * 敌人效果面板（对齐旧版 ResourceMonitor 的敌人状态区样式）：
 * 可见 Buff = 原生图标框 + 层数角标 + 45 度条纹时长条；爆发/反应消费 = 图标标记。
 * 坐标与资源曲线同一体系（准备区偏移 + 每帧像素 + 轨道头宽度，跟随时间轴滚动）。
 */
import { computed } from 'vue';
import { useDurationBarColor } from '../durationBarColorContext';
import { resolveDurationBarColor } from '../durationBarColor';
import { useI18n } from 'vue-i18n';
import type { EnemyEffectViz } from '../../../core/projection/enemyEffectViz';
import type { PositionedBuffTimelineSegment } from '../../../core/projection/buffTimelineViz';
import type { CombatStatusIndicator } from '../../../core/projection/combatStatusIndicators';
import type { EnemyCombatHudSnapshot as EnemyCombatHudSnapshotModel } from '../../../core/projection/combatHudSnapshot';
import CombatStatusIconStrip from './CombatStatusIconStrip.vue';
import EnemyCombatHudSnapshot from './EnemyCombatHudSnapshot.vue';
import { resolveBuffDisplayName } from '../buffDisplayName';
import { commonBuffPresentationNameKeys } from '../../../data/buffs/generated/commonBuffPresentationNames.generated';
import { resolveSimpleBuffModifierDisplayName } from '../buffDisplayName';
import type { BuffDetailTarget } from '../buffDetail';
import {
  DEFAULT_GAME_ICON_PATH,
  getElementalReactionIconPath,
  getIconAssetPath,
  getSpellBurstIconPath,
} from '../../gameAssetPaths';
import { frameToTimelinePx } from '../timelineGeometry';

const { t, te } = useI18n();

const props = defineProps<{
  viz: EnemyEffectViz;
  buffs: readonly PositionedBuffTimelineSegment[];
  timelineWidth: number;
  prepFrames: number;
  pxPerFrame: number;
  trackHeaderWidth: number;
  scrollLeft: number;
  prepExpanded: boolean;
  labels: {
    burst: string;
    reaction: string;
    reactionConsumed: string;
  };
  statusIndicators: readonly CombatStatusIndicator[];
  cursorFrame: number;
  hudSnapshot: EnemyCombatHudSnapshotModel;
  enemyName: string;
  enemyLevel: number;
  poiseKnotThresholds: readonly number[];
  hudLabels: {
    status: string;
    hp: string;
    poise: string;
    recovering: string;
    brokenEndWindow: string;
  };
  sourceName?: (source: {
    readonly sourceId?: string;
    readonly sourceActionId?: string;
  }) => string | undefined;
  displayName?: (source: {
    readonly sourceId?: string;
    readonly sourceActionId?: string;
  }) => string | undefined;
}>();
const emit = defineEmits<{
  'open-buff-detail': [target: BuffDetailTarget];
}>();

const ICON_SIZE = 20;
const SECTION_TOPBAR_HEIGHT = 14;
const durationBarColor = useDurationBarColor();
const ICON_TOP = 2;
const MARKER_TOP = SECTION_TOPBAR_HEIGHT + 3;

const REACTION_BUFF_IDS: Readonly<Record<string, keyof typeof commonBuffPresentationNameKeys>> = {
  electrification: 'buff_common_pulse_pulse_conduct_triggered_do',
  corrosion: 'buff_common_natural_natural_corrupt_do',
};

function configuredNameKey(
  buffId: keyof typeof commonBuffPresentationNameKeys | undefined,
): string | undefined {
  return buffId === undefined ? undefined : commonBuffPresentationNameKeys[buffId];
}

function effectName(nameKey: string | undefined, fallback: string): string {
  const key = nameKey === undefined ? '' : `effects.name.${nameKey}`;
  return key !== '' && te(key) ? t(key) : fallback;
}

function pointX(frame: number): number {
  return (
    props.trackHeaderWidth +
    frameToTimelinePx(frame, props.prepFrames, props.pxPerFrame, props.prepExpanded) -
    props.scrollLeft
  );
}

const width = computed(() => Math.max(1, props.trackHeaderWidth + props.timelineWidth));

/** 爆发/反应标记：小图标框，hover 显示说明。 */
const markers = computed(() =>
  props.viz.markers.map(marker => {
    const icon =
      marker.kind === 'burst'
        ? (getSpellBurstIconPath(marker.burstType) ?? DEFAULT_GAME_ICON_PATH)
        : (getElementalReactionIconPath(marker.reaction) ?? DEFAULT_GAME_ICON_PATH);
    const title =
      marker.kind === 'burst'
        ? `${props.labels.burst} ${marker.burstType ?? ''}`
        : `${props.labels.reactionConsumed} ${effectName(configuredNameKey(REACTION_BUFF_IDS[marker.reaction ?? '']), marker.reaction ?? '')}`;
    return {
      key: `${marker.kind}:${marker.frame}:${marker.reaction ?? marker.burstType ?? ''}`,
      icon,
      x: pointX(marker.frame) - ICON_SIZE / 2,
      title,
    };
  }),
);

const buffs = computed(() =>
  props.buffs.map(buff => {
    const left = pointX(buff.startFrame);
    const right = pointX(buff.durationEndFrame ?? buff.endFrame);
    const sourceName = props.sourceName?.(buff);
    const modifierSummary = resolveSimpleBuffModifierDisplayName(
      {
        attribute: buff.simpleModifierAttribute,
        slot: buff.simpleModifierSlot,
        value: buff.simpleModifierValue,
      },
      { t, te },
    );
    const title =
      props.displayName?.(buff) ??
      resolveBuffDisplayName(
        buff.buffId,
        { t, te },
        {
          attribute: buff.simpleModifierAttribute,
          slot: buff.simpleModifierSlot,
          value: buff.simpleModifierValue,
        },
        sourceName,
      );
    const icon = buff.iconPath ?? getIconAssetPath(buff.iconId);
    return {
      ...buff,
      key: `${buff.buffId}:${buff.instanceId}:${buff.startFrame}`,
      icon,
      left,
      top: SECTION_TOPBAR_HEIGHT + ICON_TOP + buff.lane * 22,
      barWidthPx: Math.max(0, right - left - ICON_SIZE - 2),
      color: resolveDurationBarColor(durationBarColor.value, 'enemy', buff),
      title,
      detail: {
        title,
        buffId: buff.buffId,
        targetId: buff.targetId,
        ...(sourceName === undefined ? {} : { sourceName }),
        startFrame: buff.startFrame,
        endFrame: buff.durationEndFrame ?? buff.endFrame,
        layers: buff.layers,
        icon,
        ...(modifierSummary === undefined ? {} : { modifierSummary }),
      } satisfies BuffDetailTarget,
    };
  }),
);

const rowCount = computed(() =>
  Math.max(props.viz.markers.length > 0 ? 1 : 0, ...buffs.value.map(buff => buff.lane + 1)),
);
const minimumHeight = computed(() =>
  Math.max(SECTION_TOPBAR_HEIGHT + 46, SECTION_TOPBAR_HEIGHT + rowCount.value * 22 + 2),
);
</script>

<template>
  <div class="enemy-effects" :style="{ width: `${width}px`, minHeight: `${minimumHeight}px` }">
    <EnemyCombatHudSnapshot
      class="enemy-hud"
      :snapshot="hudSnapshot"
      :name="enemyName"
      :level="enemyLevel"
      :show-poise="false"
      :poise-knot-thresholds="poiseKnotThresholds"
      :labels="hudLabels"
    />
    <CombatStatusIconStrip
      class="enemy-status-strip"
      :indicators="statusIndicators"
      slot="headBarCommon"
      :frame="cursorFrame"
      :source-name="sourceName"
      :display-name="displayName"
      @open-detail="emit('open-buff-detail', $event)"
    />
    <CombatStatusIconStrip
      class="enemy-status-strip enemy-status-strip--attached"
      :indicators="statusIndicators"
      slot="headBarAttached"
      :frame="cursorFrame"
      :source-name="sourceName"
      :display-name="displayName"
      @open-detail="emit('open-buff-detail', $event)"
    />
    <span
      v-for="marker in markers"
      :key="marker.key"
      class="effect-marker"
      :style="{ left: `${marker.x}px`, top: `${MARKER_TOP}px` }"
      :title="marker.title"
    >
      <img :src="marker.icon" class="marker-icon" alt="" />
    </span>
    <div
      v-for="buff in buffs"
      :key="buff.key"
      class="attachment-item"
      :style="{ left: `${buff.left}px`, top: `${buff.top}px` }"
      :title="buff.title"
    >
      <span
        class="anomaly-icon-box is-clickable"
        role="button"
        tabindex="0"
        @click.stop="emit('open-buff-detail', buff.detail)"
        @keydown.enter.stop.prevent="emit('open-buff-detail', buff.detail)"
        @keydown.space.stop.prevent="emit('open-buff-detail', buff.detail)"
      >
        <img v-if="buff.icon" :src="buff.icon" class="anomaly-icon" alt="" />
        <span v-else class="buff-fallback">+</span>
        <span v-if="buff.layers > 1" class="anomaly-stacks">{{ buff.layers }}</span>
      </span>
      <span
        v-if="buff.barWidthPx > 0"
        class="anomaly-duration-bar generic-buff-bar"
        :style="{
          width: `${buff.barWidthPx}px`,
          ...(buff.color === undefined ? {} : { backgroundColor: buff.color }),
        }"
      >
        <span class="striped-bg"></span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.enemy-effects {
  position: relative;
  min-width: 1px;
  height: 100%;
  overflow: hidden;
  color: var(--ea-fg);
  background: var(--ea-workbench-main, #18181c);
}

.enemy-hud {
  position: absolute;
  z-index: 30;
  inset: 0 auto auto 0;
}

.enemy-status-strip {
  position: absolute;
  z-index: 35;
  top: 55px;
  left: 8px;
  max-width: 82px;
  overflow: visible;
}

.enemy-status-strip--attached {
  left: 96px;
}

.attachment-item {
  position: absolute;
  display: flex;
  align-items: center;
}

.anomaly-icon-box {
  position: relative;
  z-index: 10;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ea-keycap-skill-bg, #333);
  border: 1px solid var(--ea-keycap-skill-border, #999);
  cursor: default;
  transition:
    filter 0.12s ease,
    border-color 0.12s ease,
    box-shadow 0.12s ease;
}

.anomaly-icon-box:hover {
  filter: brightness(1.18);
  border-color: rgb(255 255 255 / 95%);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 22%),
    0 4px 12px rgb(0 0 0 / 46%);
}

.anomaly-icon-box.is-clickable {
  cursor: pointer;
}

.anomaly-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.12s ease;
}

.anomaly-icon-box:hover .anomaly-icon {
  filter: brightness(1.12) saturate(1.08);
}

.buff-fallback {
  color: #eef6ff;
  font-size: 10px;
  font-weight: 700;
}

.anomaly-stacks {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: rgb(0 0 0 / 80%);
  color: var(--ea-gold);
  font-size: 8px;
  line-height: 1;
  padding: 0 2px;
  border-radius: 2px;
}

.anomaly-duration-bar {
  position: relative;
  z-index: 1;
  height: 16px;
  margin-left: 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow: visible;
  border: none;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  pointer-events: auto;
  transition:
    filter 0.12s ease,
    box-shadow 0.12s ease;
}

.anomaly-duration-bar:hover {
  filter: brightness(1.16) saturate(1.08);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 18%),
    0 2px 8px rgb(0 0 0 / 50%);
}

.generic-buff-bar {
  background: var(--ea-mark-soft, #596a7a);
}

.striped-bg {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: repeating-linear-gradient(
    45deg,
    rgb(255 255 255 / 20%),
    rgb(255 255 255 / 20%) 2px,
    transparent 2px,
    transparent 6px
  );
}

.effect-marker {
  position: absolute;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ea-keycap-skill-bg, #333);
  border: 1px solid var(--ea-keycap-skill-border, #999);
  cursor: default;
  transition:
    filter 0.12s ease,
    border-color 0.12s ease;
}

.effect-marker:hover {
  filter: brightness(1.18);
  border-color: rgb(255 255 255 / 95%);
}

.marker-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
