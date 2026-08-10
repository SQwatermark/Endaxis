<script setup lang="ts">
/**
 * 把已保存的连线画到时间轴上。
 *
 * 只负责画，不改数据；连到命中点的线，端点按命中点实际位置算，不用技能块位置顶替。
 */
import { computed } from 'vue';
import type {
  ConnectionDocument,
  ConnectionEndpoint,
  ScenarioDocument,
} from '../../../core/project/schema';
import type { TimelineConnectionPort } from '../timelineConnections';
import { findCastHitMarker } from '../timelineHitProjection';
import { frameToTimelinePx } from '../timelineGeometry';

interface Point {
  readonly x: number;
  readonly y: number;
}

interface ResolvedEndpoint {
  readonly point: Point;
  readonly port: TimelineConnectionPort;
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

function resolveEndpoint(endpoint: ConnectionEndpoint): ResolvedEndpoint | null {
  const found = findSkillCast(endpoint.skillCastId);
  if (found === null) return null;
  if (endpoint.kind === 'damageHit') {
    const hit = findCastHitMarker(found.skillCast, endpoint.hitId);
    if (hit === null) return null;
    return {
      point: {
        x:
          props.trackHeaderWidth +
          frameToTimelinePx(
            found.skillCast.placement.startFrame + hit.frameOffset,
            props.scenario.battle.prepFrames,
            props.pxPerFrame,
          ),
        // 命中标记渲染在技能块底部边缘，端点与标记中心对齐。
        y:
          props.rulerHeight +
          found.trackIndex * props.trackHeight +
          props.actionTop +
          props.actionHeight,
      },
      port: 'top',
    };
  }
  const port = (endpoint.port ?? 'right') as TimelineConnectionPort;
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
  return {
    point: { x: left + width * ratio.x, y: top + props.actionHeight * ratio.y },
    port,
  };
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
  props.scenario.connections.flatMap((connection: ConnectionDocument) => {
    const start = resolveEndpoint(connection.from);
    const end = resolveEndpoint(connection.to);
    if (start === null || end === null) return [];
    return [
      {
        ...connection,
        path: pathData(start.point, start.port, end.point, end.port),
      },
    ];
  }),
);

const previewPath = computed(() => {
  if (props.preview === null) return null;
  const start = resolveEndpoint({
    kind: 'skillCast',
    skillCastId: props.preview.skillCastId,
    port: props.preview.port,
  });
  return start === null ? null : pathData(start.point, start.port, props.preview.pointer, 'left');
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
