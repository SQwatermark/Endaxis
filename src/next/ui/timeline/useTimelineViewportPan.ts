/**
 * 管理时间轴视口的中键拖拽平移。
 *
 * 本模块只修改滚动容器，不修改场景文档；调用方应仅从轨道空白区域启动它，避免与动作块
 * 的原生拖拽语义冲突。
 */
import { onScopeDispose, ref, type Ref } from 'vue';
import { resolveTimelineViewportPan, type TimelineViewportPanOrigin } from './timelineViewportPan';

export interface UseTimelineViewportPanOptions {
  readonly viewport: Ref<HTMLElement | null>;
}

export function useTimelineViewportPan(options: UseTimelineViewportPanOptions) {
  const isPanning = ref(false);
  let stopGesture: (() => void) | null = null;

  function stop(): void {
    stopGesture?.();
  }

  function begin(event: PointerEvent): boolean {
    const viewport = options.viewport.value;
    const target = event.target;
    if (
      viewport === null ||
      event.button !== 1 ||
      (target instanceof Element && target.closest('[data-timeline-action-id]') !== null)
    ) {
      return false;
    }
    event.preventDefault();
    stop();
    const pointerId = event.pointerId;
    const origin: TimelineViewportPanOrigin = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
    isPanning.value = true;
    const onMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      const position = resolveTimelineViewportPan(origin, moveEvent.clientX, moveEvent.clientY);
      viewport.scrollLeft = position.left;
      viewport.scrollTop = position.top;
    };
    const finish = (finishEvent: PointerEvent) => {
      if (finishEvent.pointerId === pointerId) stop();
    };
    stopGesture = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      isPanning.value = false;
      stopGesture = null;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    return true;
  }

  onScopeDispose(stop);

  return { isPanning, beginViewportPan: begin };
}
