import type { BuffTimelineSegment } from './buffTimelineViz';

/** 仅连接同一原生附着实例的相邻切段，不从同帧事件推断元素反应。 */
export function projectAttachmentContinuations<T extends BuffTimelineSegment>(
  segments: readonly T[],
  attachmentBuffIds: ReadonlySet<string>,
): ReadonlySet<T> {
  const previous = new Map<string, T>();
  const connected = new Set<T>();
  for (const segment of [...segments].sort((a, b) => a.startFrame - b.startFrame)) {
    if (!attachmentBuffIds.has(segment.buffId)) continue;
    const key = JSON.stringify([segment.targetId, segment.buffId, segment.instanceId]);
    const head = previous.get(key);
    if (
      head !== undefined &&
      head.endFrame === segment.startFrame &&
      head.endFrame > head.startFrame
    )
      connected.add(head);
    previous.set(key, segment);
  }
  return connected;
}
