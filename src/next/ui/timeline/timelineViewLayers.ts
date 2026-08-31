/** Next 时间轴当前真实存在、可以独立隐藏的视觉层。 */
export const NEXT_TIMELINE_VIEW_LAYER_IDS = [
  'upperEffects',
  'lowerBuffs',
  'gauge',
  'skillDecorations',
  'hitMarkers',
  'comboWindows',
  'switchMarkers',
  'effectLinks',
] as const;

export type NextTimelineViewLayerId = (typeof NEXT_TIMELINE_VIEW_LAYER_IDS)[number];
export type NextTimelineViewLayers = Record<NextTimelineViewLayerId, boolean>;

export function createDefaultNextTimelineViewLayers(): NextTimelineViewLayers {
  return Object.fromEntries(
    NEXT_TIMELINE_VIEW_LAYER_IDS.map(id => [id, true]),
  ) as NextTimelineViewLayers;
}

/** 未知、缺字段和旧版本设置都按显示处理，避免升级后内容悄悄消失。 */
export function normalizeNextTimelineViewLayers(source: unknown): NextTimelineViewLayers {
  const result = createDefaultNextTimelineViewLayers();
  if (source === null || typeof source !== 'object' || Array.isArray(source)) return result;
  const input = source as Record<string, unknown>;
  for (const id of NEXT_TIMELINE_VIEW_LAYER_IDS) result[id] = input[id] !== false;
  return result;
}

export function toggleNextTimelineViewLayer(
  layers: NextTimelineViewLayers,
  id: NextTimelineViewLayerId,
): NextTimelineViewLayers {
  return { ...layers, [id]: !layers[id] };
}
