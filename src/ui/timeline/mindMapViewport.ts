/** Center a node in the visible viewport; oversized nodes keep their leading edge visible. */
export function mindMapNodeScroll(
  node: { x: number; y: number; width: number; height: number },
  viewport: { width: number; height: number },
  zoom: number,
  stageOffset = { left: 0, top: 0 },
): { left: number; top: number } {
  return {
    left: Math.max(
      0,
      stageOffset.left + node.x * zoom - Math.max(0, (viewport.width - node.width * zoom) / 2),
    ),
    top: Math.max(
      0,
      stageOffset.top + node.y * zoom - Math.max(0, (viewport.height - node.height * zoom) / 2),
    ),
  };
}
