<script setup lang="ts">
/**
 * 敌人效果面板（对齐旧版 ResourceMonitor 的敌人状态区样式）：
 * 附着 = 元素图标框 + 层数角标 + 45 度条纹时长条；爆发/反应 = 图标标记。
 * 坐标与资源曲线同一体系（准备区偏移 + 每帧像素 + 轨道头宽度，跟随时间轴滚动）。
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { EnemyEffectViz } from '../../../core/projection/enemyEffectViz';
import type { PositionedBuffTimelineSegment } from '../../../core/projection/buffTimelineViz';
import type { CombatStatusIndicator } from '../../../core/projection/combatStatusIndicators';
import type { EnemyCombatHudSnapshot as EnemyCombatHudSnapshotModel } from '../../../core/projection/combatHudSnapshot';
import CombatStatusIconStrip from './CombatStatusIconStrip.vue';
import EnemyCombatHudSnapshot from './EnemyCombatHudSnapshot.vue';

const { t } = useI18n();

const props = defineProps<{
  viz: EnemyEffectViz;
  buffs: readonly PositionedBuffTimelineSegment[];
  timelineWidth: number;
  prepFrames: number;
  pxPerFrame: number;
  trackHeaderWidth: number;
  scrollLeft: number;
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
  hudLabels: {
    hp: string;
    poise: string;
    recovering: string;
    brokenEndWindow: string;
  };
}>();

const ICON_SIZE = 20;
const ICON_TOP = 2;
const MARKER_TOP = 3;

const ELEMENT_ICONS: Readonly<Record<string, string>> = {
  heat: '/icons/icon_element_heat.webp',
  electric: '/icons/icon_element_electric.webp',
  cryo: '/icons/icon_element_cryo.webp',
  nature: '/icons/icon_element_nature.webp',
};

const ELEMENT_COLORS: Readonly<Record<string, string>> = {
  heat: '#ff5a5f',
  electric: '#ffec3d',
  cryo: '#69c0ff',
  nature: '#52c41a',
};

const BURST_ICONS: Readonly<Record<string, string>> = {
  Fire: '/icons/icon_burst_fusion_fire.webp',
  Pulse: '/icons/icon_burst_fusion_pulse.webp',
  Natural: '/icons/icon_burst_fusion_nature.webp',
  Cryst: '/icons/icon_burst_fusion_cryst.webp',
};

const REACTION_ICONS: Readonly<Record<string, string>> = {
  electrification: '/icons/icon_battle_debuff_conduct.webp',
  corrosion: '/icons/icon_battle_debuff_corrupt.webp',
};

const REACTION_COLORS: Readonly<Record<string, string>> = {
  electrification: '#ffec3d',
  corrosion: '#52c41a',
};

function pointX(frame: number): number {
  return props.trackHeaderWidth + (frame + props.prepFrames) * props.pxPerFrame - props.scrollLeft;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

const width = computed(() => Math.max(1, props.trackHeaderWidth + props.timelineWidth));

/** 附着与反应段共用旧版紧凑分行；互不重叠的持续段复用同一行。 */
const segments = computed(() => {
  const laneEnds: number[] = [];
  return [...props.viz.segments]
    .sort((left, right) => left.startFrame - right.startFrame || left.endFrame - right.endFrame)
    .map(segment => {
      let lane = laneEnds.findIndex(endFrame => endFrame <= segment.startFrame);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = segment.endFrame;
      const left = pointX(segment.startFrame);
      const right = pointX(segment.endFrame);
      const isAttachment = segment.kind === 'attachment';
      const identity = isAttachment ? segment.element : segment.reaction;
      const stacks = isAttachment ? segment.layers : segment.level;
      return {
        key: `${segment.kind}:${identity}:${segment.startFrame}`,
        title: isAttachment
          ? `${identity} · ${t('nextTimeline.effect.layers', { stacks })}`
          : `${props.labels.reaction} ${identity} Lv${stacks}`,
        icon: isAttachment
          ? (ELEMENT_ICONS[identity] ?? '/icons/default_icon.webp')
          : (REACTION_ICONS[identity] ?? '/icons/default_icon.webp'),
        color: isAttachment
          ? (ELEMENT_COLORS[identity] ?? '#596a7a')
          : (REACTION_COLORS[identity] ?? '#596a7a'),
        left,
        top: ICON_TOP + lane * 22,
        barWidthPx: Math.max(0, right - left - ICON_SIZE - 2),
        stacks,
        lane,
      };
    });
});

const effectLaneCount = computed(() =>
  Math.max(0, ...segments.value.map(segment => segment.lane + 1)),
);

/** 爆发/反应标记：小图标框，hover 显示说明。 */
const markers = computed(() =>
  props.viz.markers
    .filter(marker => marker.kind !== 'reactionApplied')
    .map(marker => {
      const icon =
        marker.kind === 'burst'
          ? (BURST_ICONS[marker.burstType ?? ''] ?? '/icons/default_icon.webp')
          : (REACTION_ICONS[marker.reaction ?? ''] ?? '/icons/default_icon.webp');
      const title =
        marker.kind === 'burst'
          ? `${props.labels.burst} ${marker.burstType ?? ''}`
          : marker.kind === 'reactionApplied'
            ? `${props.labels.reaction} ${marker.reaction ?? ''} Lv${marker.level ?? 0}`
            : `${props.labels.reactionConsumed} ${marker.reaction ?? ''}`;
      return {
        key: `${marker.kind}:${marker.frame}:${marker.reaction ?? marker.burstType ?? ''}`,
        icon,
        x: clamp(pointX(marker.frame) - ICON_SIZE / 2, 0, width.value - ICON_SIZE),
        title,
      };
    }),
);

const buffLaneOffset = effectLaneCount;
const buffs = computed(() =>
  props.buffs.map(buff => {
    const left = pointX(buff.startFrame);
    const right = pointX(buff.endFrame);
    return {
      ...buff,
      key: `${buff.buffId}:${buff.instanceId}:${buff.startFrame}`,
      icon: buff.iconPath ?? (buff.iconId ? `/icons/${buff.iconId}.webp` : null),
      left,
      top: ICON_TOP + (buff.lane + buffLaneOffset.value) * 22,
      barWidthPx: Math.max(0, right - left - ICON_SIZE - 2),
    };
  }),
);

const rowCount = computed(() =>
  Math.max(
    effectLaneCount.value,
    props.viz.markers.length > 0 ? 1 : 0,
    ...buffs.value.map(buff => buff.lane + buffLaneOffset.value + 1),
  ),
);
const height = computed(() => Math.max(90, rowCount.value * 22 + 2));
</script>

<template>
  <div class="enemy-effects" :style="{ width: `${width}px`, height: `${height}px` }">
    <EnemyCombatHudSnapshot
      class="enemy-hud"
      :snapshot="hudSnapshot"
      :name="enemyName"
      :level="enemyLevel"
      :labels="hudLabels"
    />
    <CombatStatusIconStrip
      class="enemy-status-strip"
      :indicators="statusIndicators"
      slot="headBarCommon"
      :frame="cursorFrame"
    />
    <CombatStatusIconStrip
      class="enemy-status-strip enemy-status-strip--attached"
      :indicators="statusIndicators"
      slot="headBarAttached"
      :frame="cursorFrame"
    />
    <div
      v-if="
        segments.length === 0 &&
        markers.length === 0 &&
        buffs.length === 0 &&
        statusIndicators.length === 0
      "
      class="enemy-effects__empty"
    >
      —
    </div>
    <template v-else>
      <div
        v-for="segment in segments"
        :key="segment.key"
        class="attachment-item"
        :style="{ left: `${segment.left}px`, top: `${segment.top}px` }"
        :title="segment.title"
      >
        <span class="anomaly-icon-box">
          <img :src="segment.icon" class="anomaly-icon" alt="" />
          <span v-if="segment.stacks > 1" class="anomaly-stacks">{{ segment.stacks }}</span>
        </span>
        <span
          v-if="segment.barWidthPx > 0"
          class="anomaly-duration-bar"
          :style="{ width: `${segment.barWidthPx}px`, backgroundColor: segment.color }"
        >
          <span class="striped-bg"></span>
        </span>
      </div>
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
        :title="buff.buffId"
      >
        <span class="anomaly-icon-box">
          <img v-if="buff.icon" :src="buff.icon" class="anomaly-icon" alt="" />
          <span v-else class="buff-fallback">+</span>
          <span v-if="buff.layers > 1" class="anomaly-stacks">{{ buff.layers }}</span>
        </span>
        <span
          v-if="buff.barWidthPx > 0"
          class="anomaly-duration-bar generic-buff-bar"
          :style="{ width: `${buff.barWidthPx}px` }"
        >
          <span class="striped-bg"></span>
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.enemy-effects {
  position: relative;
  min-width: 1px;
  height: 24px;
  overflow: hidden;
  color: var(--ea-fg);
  background: var(--ea-surface, #17191c);
}

.enemy-hud {
  position: absolute;
  z-index: 10;
  inset: 0 auto auto 0;
}

.enemy-effects__empty {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--ea-text-muted, rgb(255 255 255 / 32%));
  font-size: 11px;
}

.enemy-status-strip {
  position: absolute;
  z-index: 20;
  top: 69px;
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

.anomaly-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
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
