<script setup lang="ts">
/**
 * 敌人效果面板（对齐旧版 ResourceMonitor 的敌人状态区样式）：
 * 可见 Buff = 原生图标框 + 层数角标 + 45 度条纹时长条；爆发/反应消费 = 图标标记。
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
import { resolveBuffDisplayName } from '../buffDisplayName';
import { commonBuffPresentationNameKeys } from '../../../data/buffs/generated/commonBuffPresentationNames.generated';
import { resolveSimpleBuffModifierDisplayName } from '../buffDisplayName';
import type { BuffDetailTarget } from '../buffDetail';

const { t, te } = useI18n();

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
  poiseKnotThresholds: readonly number[];
  hudLabels: {
    hp: string;
    poise: string;
    recovering: string;
    brokenEndWindow: string;
  };
  sourceName?: (source: {
    readonly sourceId?: string;
    readonly sourceActionId?: string;
  }) => string | undefined;
}>();
const emit = defineEmits<{
  'open-buff-detail': [target: BuffDetailTarget];
}>();

const ICON_SIZE = 20;
const ICON_TOP = 2;
const MARKER_TOP = 3;

const ELEMENT_COLORS = {
  heat: '#ff5a5f',
  electric: '#ffec3d',
  cryo: '#69c0ff',
  nature: '#52c41a',
} as const satisfies Readonly<Record<string, string>>;

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

const REACTION_COLORS = {
  electrification: '#ffec3d',
  corrosion: '#52c41a',
} as const satisfies Readonly<Record<string, string>>;

const REACTION_BUFF_IDS: Readonly<Record<string, keyof typeof commonBuffPresentationNameKeys>> = {
  electrification: 'buff_common_pulse_pulse_conduct_triggered_do',
  corrosion: 'buff_common_natural_natural_corrupt_do',
};

/** 原生可见 Buff 是持续状态的唯一 UI 身份；这里只补元素配色，不创造第二条状态段。 */
const SPECIAL_BUFF_COLORS: Readonly<Record<string, string>> = {
  buff_common_energy_shard_attached_fire: ELEMENT_COLORS.heat,
  buff_common_energy_shard_attached_pulse: ELEMENT_COLORS.electric,
  buff_common_energy_shard_attached_cryst: ELEMENT_COLORS.cryo,
  buff_common_energy_shard_attached_natural: ELEMENT_COLORS.nature,
  buff_common_pulse_pulse_conduct_triggered_do: REACTION_COLORS.electrification,
  buff_common_natural_natural_corrupt_do: REACTION_COLORS.corrosion,
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
  return props.trackHeaderWidth + (frame + props.prepFrames) * props.pxPerFrame - props.scrollLeft;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

const width = computed(() => Math.max(1, props.trackHeaderWidth + props.timelineWidth));

/** 爆发/反应标记：小图标框，hover 显示说明。 */
const markers = computed(() =>
  props.viz.markers.map(marker => {
    const icon =
      marker.kind === 'burst'
        ? (BURST_ICONS[marker.burstType ?? ''] ?? '/icons/default_icon.webp')
        : (REACTION_ICONS[marker.reaction ?? ''] ?? '/icons/default_icon.webp');
    const title =
      marker.kind === 'burst'
        ? `${props.labels.burst} ${marker.burstType ?? ''}`
        : `${props.labels.reactionConsumed} ${effectName(configuredNameKey(REACTION_BUFF_IDS[marker.reaction ?? '']), marker.reaction ?? '')}`;
    return {
      key: `${marker.kind}:${marker.frame}:${marker.reaction ?? marker.burstType ?? ''}`,
      icon,
      x: clamp(pointX(marker.frame) - ICON_SIZE / 2, 0, width.value - ICON_SIZE),
      title,
    };
  }),
);

const buffs = computed(() =>
  props.buffs.map(buff => {
    const left = pointX(buff.startFrame);
    const right = pointX(buff.endFrame);
    const sourceName = props.sourceName?.(buff);
    const modifierSummary = resolveSimpleBuffModifierDisplayName(
      {
        attribute: buff.simpleModifierAttribute,
        slot: buff.simpleModifierSlot,
        value: buff.simpleModifierValue,
      },
      { t, te },
    );
    const title = resolveBuffDisplayName(
      buff.buffId,
      { t, te },
      {
        attribute: buff.simpleModifierAttribute,
        slot: buff.simpleModifierSlot,
        value: buff.simpleModifierValue,
      },
      sourceName,
    );
    const icon = buff.iconPath ?? (buff.iconId ? `/icons/${buff.iconId}.webp` : null);
    return {
      ...buff,
      key: `${buff.buffId}:${buff.instanceId}:${buff.startFrame}`,
      icon,
      left,
      top: ICON_TOP + buff.lane * 22,
      barWidthPx: Math.max(0, right - left - ICON_SIZE - 2),
      color: SPECIAL_BUFF_COLORS[buff.buffId],
      title,
      detail: {
        title,
        buffId: buff.buffId,
        targetId: buff.targetId,
        ...(sourceName === undefined ? {} : { sourceName }),
        startFrame: buff.startFrame,
        endFrame: buff.endFrame,
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
const height = computed(() => Math.max(90, rowCount.value * 22 + 2));
</script>

<template>
  <div class="enemy-effects" :style="{ width: `${width}px`, height: `${height}px` }">
    <EnemyCombatHudSnapshot
      class="enemy-hud"
      :snapshot="hudSnapshot"
      :name="enemyName"
      :level="enemyLevel"
      :poise-knot-thresholds="poiseKnotThresholds"
      :labels="hudLabels"
    />
    <CombatStatusIconStrip
      class="enemy-status-strip"
      :indicators="statusIndicators"
      slot="headBarCommon"
      :frame="cursorFrame"
      :source-name="sourceName"
      @open-detail="emit('open-buff-detail', $event)"
    />
    <CombatStatusIconStrip
      class="enemy-status-strip enemy-status-strip--attached"
      :indicators="statusIndicators"
      slot="headBarAttached"
      :frame="cursorFrame"
      :source-name="sourceName"
      @open-detail="emit('open-buff-detail', $event)"
    />
    <div
      v-if="markers.length === 0 && buffs.length === 0 && statusIndicators.length === 0"
      class="enemy-effects__empty"
    >
      —
    </div>
    <template v-else>
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

.anomaly-icon-box.is-clickable {
  cursor: pointer;
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
