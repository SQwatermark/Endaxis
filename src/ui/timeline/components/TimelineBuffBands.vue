<script setup lang="ts">
/** 旧版 TimelineBuffLayer 的 Next 只读版本：18px 图标、层数角标和条纹持续条。 */
import { computed } from 'vue';
import { useDurationBarColor } from '../durationBarColorContext';
import { resolveDurationBarColor } from '../durationBarColor';
import { useI18n } from 'vue-i18n';
import type { PositionedBuffTimelineSegment } from '../../../core/projection/buffTimelineViz';
import { resolveBuffDisplayName } from '../buffDisplayName';
import { resolveSimpleBuffModifierDisplayName } from '../buffDisplayName';
import type { BuffDetailTarget } from '../buffDetail';
import TimelineStatusSegment from './TimelineStatusSegment.vue';
import { getIconAssetPath } from '../../gameAssetPaths';
import { frameToTimelinePx } from '../timelineGeometry';
import { timelineLowerBuffTop } from '../timelineTrackEffectLayout';

const props = defineProps<{
  segments: readonly PositionedBuffTimelineSegment[];
  prepFrames: number;
  pxPerFrame: number;
  prepExpanded: boolean;
  placement?: 'upper' | 'lower';
  actionTop?: number;
  sourceName?: (source: {
    readonly sourceId?: string;
    readonly sourceActionId?: string;
  }) => string | undefined;
  displayName?: (source: {
    readonly sourceId?: string;
    readonly sourceActionId?: string;
  }) => string | undefined;
}>();
const { t, te } = useI18n({ useScope: 'global' });
const emit = defineEmits<{
  'open-detail': [target: BuffDetailTarget];
}>();

const ICON_SIZE = 18;
const durationBarColor = useDurationBarColor();
const BAR_GAP = 2;
const LANE_PITCH = 22;
const ACTION_TOP_FALLBACK = 55;
const UPPER_OFFSET_FROM_ACTION = 24;

const items = computed(() =>
  props.segments.map(segment => {
    const left = frameToTimelinePx(
      segment.startFrame,
      props.prepFrames,
      props.pxPerFrame,
      props.prepExpanded,
    );
    const right = frameToTimelinePx(
      segment.durationEndFrame ?? segment.endFrame,
      props.prepFrames,
      props.pxPerFrame,
      props.prepExpanded,
    );
    const sourceName = props.sourceName?.(segment);
    const modifierSummary = resolveSimpleBuffModifierDisplayName(
      {
        attribute: segment.simpleModifierAttribute,
        slot: segment.simpleModifierSlot,
        value: segment.simpleModifierValue,
      },
      { t, te },
    );
    const title =
      props.displayName?.(segment) ??
      resolveBuffDisplayName(
        segment.buffId,
        { t, te },
        {
          attribute: segment.simpleModifierAttribute,
          slot: segment.simpleModifierSlot,
          value: segment.simpleModifierValue,
        },
        sourceName,
      );
    const icon = segment.iconPath ?? getIconAssetPath(segment.iconId);
    return {
      ...segment,
      title,
      color: resolveDurationBarColor(durationBarColor.value, 'track', segment),
      key: `${segment.targetId}:${segment.buffId}:${segment.instanceId}:${segment.startFrame}`,
      left,
      top:
        props.placement === 'upper'
          ? (props.actionTop ?? ACTION_TOP_FALLBACK) -
            UPPER_OFFSET_FROM_ACTION -
            segment.lane * LANE_PITCH
          : timelineLowerBuffTop(props.actionTop ?? ACTION_TOP_FALLBACK, segment.lane),
      width: Math.max(0, right - left - ICON_SIZE - BAR_GAP * 2),
      icon,
      detail: {
        title,
        buffId: segment.buffId,
        targetId: segment.targetId,
        ...(sourceName === undefined ? {} : { sourceName }),
        startFrame: segment.startFrame,
        endFrame: segment.durationEndFrame ?? segment.endFrame,
        layers: segment.layers,
        icon,
        ...(modifierSummary === undefined ? {} : { modifierSummary }),
      } satisfies BuffDetailTarget,
    };
  }),
);
</script>

<template>
  <div v-if="items.length > 0" class="timeline-buff-bands" aria-label="Buff timeline">
    <TimelineStatusSegment
      v-for="item in items"
      :key="item.key"
      :left="item.left"
      :top="item.top"
      :width="item.width"
      :title="item.title"
      :duration-color="item.color"
      :count="item.layers > 1 ? item.layers : null"
      interactive
      @activate="emit('open-detail', item.detail)"
    >
      <template #content>
        <img v-if="item.icon" :src="item.icon" class="timeline-buff-icon" alt="" />
        <span v-else class="timeline-buff-fallback">+</span>
      </template>
    </TimelineStatusSegment>
  </div>
</template>

<style scoped>
.timeline-buff-bands {
  position: absolute;
  inset: 0;
  z-index: 8;
  overflow: hidden;
  pointer-events: none;
}

.timeline-buff-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline-buff-fallback {
  color: #eef6ff;
  font-size: 10px;
  font-weight: 700;
}
</style>
