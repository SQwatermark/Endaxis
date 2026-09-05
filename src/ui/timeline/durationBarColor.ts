/** UI-only duration-bar preferences. No simulation or legacy store dependency. */
export const DURATION_COLOR_SOURCES = ['weapon', 'gearSet', 'operator', 'anomaly'] as const;
export const DURATION_COLOR_SURFACES = ['track', 'enemy'] as const;
export type DurationColorSource = (typeof DURATION_COLOR_SOURCES)[number];
export type DurationColorSurface = (typeof DURATION_COLOR_SURFACES)[number];
/** Existing visible-status identities; not used to invent status lifetimes. */
const ANOMALY_COLORS: Readonly<Record<string, string>> = {
  buff_common_energy_shard_attached_fire: '#ff5a5f',
  buff_common_energy_shard_attached_pulse: '#ffec3d',
  buff_common_energy_shard_attached_cryst: '#69c0ff',
  buff_common_energy_shard_attached_natural: '#52c41a',
  buff_common_pulse_pulse_conduct_triggered_do: '#ffec3d',
  buff_common_natural_natural_corrupt_do: '#52c41a',
};
export interface DurationBarColorPrefs {
  enabled: boolean;
  saturation: number;
  lightness: number;
  sources: Record<DurationColorSource, boolean>;
  surfaces: Record<DurationColorSurface, boolean>;
}
const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};
export function normalizeDurationBarColorPrefs(value: unknown): DurationBarColorPrefs {
  const input = record(value);
  const percent = (v: unknown, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v)
      ? Math.max(0, Math.min(100, Math.round(v)))
      : fallback;
  const sources = record(input.sources);
  const surfaces = record(input.surfaces);
  return {
    enabled: typeof input.enabled === 'boolean' ? input.enabled : true,
    saturation: percent(input.saturation, 50),
    lightness: percent(input.lightness, 90),
    sources: {
      weapon: sources.weapon === true,
      gearSet: sources.gearSet === true,
      operator: sources.operator === true,
      anomaly: sources.anomaly !== false,
    },
    surfaces: { track: surfaces.track !== false, enemy: surfaces.enemy !== false },
  };
}

/** Classify emitted provenance, never translated labels or guessed buff names. */
export function durationColorSource(
  sourceActionId: string | undefined,
): Exclude<DurationColorSource, 'anomaly'> {
  const kind = /^(?:equipment:|upgrade-initialization:)([^:]+):/.exec(sourceActionId ?? '')?.[1];
  if (kind === 'weaponTrait' || kind === 'weapon-trait') return 'weapon';
  if (kind === 'gearTrait' || kind === 'gear-trait' || kind === 'gearSet' || kind === 'gear-set')
    return 'gearSet';
  return 'operator';
}

function hsl(hex: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255) as [
    number,
    number,
    number,
  ];
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min,
    l = (max + min) / 2;
  if (d === 0) return [0, 0, l];
  const h =
    max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, d / (1 - Math.abs(2 * l - 1)), l];
}

export function resolveDurationBarColor(
  prefs: DurationBarColorPrefs,
  surface: DurationColorSurface,
  buff: { readonly buffId: string; readonly sourceActionId?: string },
  anomalyColor = ANOMALY_COLORS[buff.buffId],
): string {
  const neutral = '#8c8c8c';
  if (!prefs.enabled || !prefs.surfaces[surface]) return neutral;
  const source = durationColorSource(buff.sourceActionId);
  // Preserve upstream precedence: equipment dye does not fall through to operator dye.
  const anomaly = source === 'operator' && anomalyColor !== undefined;
  if (!prefs.sources[anomaly ? 'anomaly' : source])
    return anomaly ? neutral : (anomalyColor ?? neutral);
  const base = anomaly
    ? anomalyColor!
    : source === 'weapon'
      ? '#c5a3ff'
      : source === 'gearSet'
        ? '#2dd4bf'
        : '#5dade2';
  let [h, s, l] = hsl(base);
  if (!anomaly) {
    let hash = 2166136261;
    for (const char of `${source}|${buff.buffId}`)
      hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    hash >>>= 0;
    h += (hash % 37) - 18;
    l = Math.min(0.78, Math.max(0.38, l + (((hash >>> 16) % 9) - 4) / 100));
  }
  return `hsl(${((h % 360) + 360) % 360} ${s * prefs.saturation}% ${l * prefs.lightness}%)`;
}
