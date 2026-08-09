<script setup lang="ts">
/**
 * 将项目中的技能块连线投影到时间轴坐标系。
 *
 * 组件只消费持久化连接和当前拖拽预览，不修改项目；当前仅渲染技能块端点，待命中点
 * 拥有独立可见标记后再补 damageHit 端点，避免用技能块位置冒充命中位置。
 */
import { computed } from 'vue';
import type { ScenarioDocument } from '../../../core/project/schema';
import type { TimelineConnectionPort } from '../timelineConnections';
import { frameToTimelinePx } from '../timelineGeometry';

interface Point {
  readonly x: number;
  readonly y: number;
}

interface ConnectionPreview {
  readonly skillCastId: string;
  readonly port: TimelineConnectionPort;
  readonly pointer: Point;
}

const props = withDefaults(
  defineProps<{
    scenario: ScenarioDocument;
    pxPerFrame: number;
    trackHeaderWidth: number;
    rulerHeight?: number;
    trackHeight?: number;
    actionTop?: number;
    actionHeight?: number;
    preview?: ConnectionPreview | null;
  }>(),
  {
    rulerHeight: 76,
    trackHeight: 160,
    actionTop: 55,
    actionHeight: 50,
    preview: null,
  },
);

const emit = defineEmits<{ remove: [connectionId: string] }>();

const ports: Record<TimelineConnectionPort, { x: number; y: number }> = {
  top: { x: 0.5, y: 0 },
  right: { x: 1, y: 0.5 },
  bottom: { x: 0.5, y: 1 },
  left: { x: 0, y: 0.5 },
};

const directions: Record<TimelineConnectionPort, Point> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

function findSkillCast(skillCastId: string) {
  for (const [trackIndex, track] of props.scenario.tracks.entries()) {
    const skillCast = track?.skillCasts.find(candidate => candidate.id === skillCastId);
    if (skillCast !== undefined) return { skillCast, trackIndex };
  }
  return null;
}

function endpointPoint(skillCastId: string, port: TimelineConnectionPort): Point | null {
  const found = findSkillCast(skillCastId);
  if (found === null) return null;
  const left =
    props.trackHeaderWidth +
    frameToTimelinePx(
      found.skillCast.placement.startFrame,
      props.scenario.battle.prepFrames,
      props.pxPerFrame,
    );
  const width = Math.max(48, found.skillCast.editable.durationFrames * props.pxPerFrame);
  const top = props.rulerHeight + found.trackIndex * props.trackHeight + props.actionTop;
  const ratio = ports[port];
  return { x: left + width * ratio.x, y: top + props.actionHeight * ratio.y };
}

function pathData(
  start: Point,
  startPort: TimelineConnectionPort,
  end: Point,
  endPort: TimelineConnectionPort,
) {
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const tension = Math.min(150, Math.max(40, distance * 0.4));
  const startDirection = directions[startPort];
  const endDirection = directions[endPort];
  const c1 = {
    x: start.x + startDirection.x * tension,
    y: start.y + startDirection.y * tension,
  };
  const c2 = {
    x: end.x + endDirection.x * tension,
    y: end.y + endDirection.y * tension,
  };
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}

const projectedConnections = computed(() =>
  props.scenario.connections.flatMap(connection => {
    if (connection.from.kind !== 'skillCast' || connection.to.kind !== 'skillCast') return [];
    const fromPort = (connection.from.port ?? 'right') as TimelineConnectionPort;
    const toPort = (connection.to.port ?? 'left') as TimelineConnectionPort;
    const start = endpointPoint(connection.from.skillCastId, fromPort);
    const end = endpointPoint(connection.to.skillCastId, toPort);
    if (start === null || end === null) return [];
    return [{ ...connection, path: pathData(start, fromPort, end, toPort) }];
  }),
);

const previewPath = computed(() => {
  if (props.preview === null) return null;
  const start = endpointPoint(props.preview.skillCastId, props.preview.port);
  return start === null ? null : pathData(start, props.preview.port, props.preview.pointer, 'left');
});
</script>

<template>
  <svg class="timeline-connections" aria-hidden="true">
    <g v-for="connection in projectedConnections" :key="connection.id">
      <path
        class="connection-hit-area"
        :d="connection.path"
        @contextmenu.prevent.stop="emit('remove', connection.id)"
      />
      <path
        class="connection-path"
        :class="{ 'is-consumption': connection.consumption }"
        :d="connection.path"
      />
    </g>
    <path v-if="previewPath" class="connection-path is-preview" :d="previewPath" />
  </svg>
</template>

<style scoped>
.timeline-connections {
  position: absolute;
  inset: 0;
  z-index: 5;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.connection-path,
.connection-hit-area {
  fill: none;
  stroke-linecap: round;
}

.connection-path {
  stroke: var(--ea-gold);
  stroke-width: 2px;
  stroke-dasharray: 10 5;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.65));
  pointer-events: none;
}

.connection-path.is-consumption {
  opacity: 0.55;
  stroke-dasharray: 2 6;
}

.connection-path.is-preview {
  opacity: 0.55;
}

.connection-hit-area {
  stroke: transparent;
  stroke-width: 12px;
  pointer-events: stroke;
  cursor: context-menu;
}
</style>
