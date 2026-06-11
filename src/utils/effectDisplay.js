const CANONICAL_UI_KEY_ALIASES = Object.freeze({
  basicAttack: ['attack'],
  battleSkill: ['skill'],
  comboSkill: ['link'],
  finisher: ['execution'],
  dive: ['dodge'],
  ultimate: ['ultimate'],
  heat: ['blaze'],
  cryo: ['cold'],
  electric: ['emag'],
  nature: ['nature'],
  physical: ['physical'],
  heat_infliction: ['blaze_attach'],
  cryo_infliction: ['cold_attach'],
  electric_infliction: ['emag_attach'],
  nature_infliction: ['nature_attach'],
  heat_burst: ['blaze_burst'],
  cryo_burst: ['cold_burst'],
  electric_burst: ['emag_burst'],
  nature_burst: ['nature_burst'],
  combustion: ['burning'],
  electrification: ['conductive'],
  solidification: ['frozen'],
  shatter: ['ice_shatter'],
  corrosion: ['corrosion'],
  vulnerability: ['vulnerability', 'break'],
  breach: ['breach', 'armor_break'],
  crush: ['crush', 'stagger'],
  lift: ['lift', 'knockup'],
  knockdown: ['knockdown'],
  default: ['default'],
})

function normalizeUiKey(value) {
  if (value == null) return ''
  return String(value)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

const NORMALIZED_TO_CANONICAL = Object.freeze(
  Object.entries(CANONICAL_UI_KEY_ALIASES).reduce((acc, [canonicalKey, aliases]) => {
    acc[normalizeUiKey(canonicalKey)] = canonicalKey
    aliases.forEach((alias) => {
      acc[normalizeUiKey(alias)] = canonicalKey
    })
    return acc
  }, {}),
)

const CANONICAL_TO_LEGACY = Object.freeze(
  Object.fromEntries(
    Object.entries(CANONICAL_UI_KEY_ALIASES).map(([canonicalKey, aliases]) => [canonicalKey, aliases[0] || canonicalKey]),
  ),
)

function addCandidate(out, seen, value) {
  const key = String(value || '').trim()
  if (!key || seen.has(key)) return
  seen.add(key)
  out.push(key)
}

export function toCanonicalUiKey(value) {
  const normalized = normalizeUiKey(value)
  if (!normalized) return null
  return NORMALIZED_TO_CANONICAL[normalized] || String(value).trim() || null
}

export function toLegacyUiKey(value) {
  const canonical = toCanonicalUiKey(value)
  if (!canonical) return null
  return CANONICAL_TO_LEGACY[canonical] || canonical
}

export function resolveEffectDisplayKey(effectOrKey) {
  if (!effectOrKey) return 'default'
  if (typeof effectOrKey === 'string') {
    return toCanonicalUiKey(effectOrKey) || 'default'
  }

  const effect = effectOrKey
  if (effect.displayType) return toCanonicalUiKey(effect.displayType) || effect.displayType

  switch (effect.kind) {
    case 'physicalStatus':
      return toCanonicalUiKey(effect.physicalType) || effect.physicalType || 'default'
    case 'infliction':
      return toCanonicalUiKey(effect.element ? `${effect.element}_infliction` : null) || 'default'
    case 'burst':
      return toCanonicalUiKey(effect.element ? `${effect.element}_burst` : null) || 'default'
    case 'reaction':
      return toCanonicalUiKey(effect.reactionType) || effect.reactionType || 'default'
    case 'status':
      return toCanonicalUiKey(effect.id || effect.name || effect.type || effect.kind) || effect.id || effect.name || 'default'
    default:
      return toCanonicalUiKey(effect.type || effect.id || effect.name || effect.kind) || effect.type || effect.id || effect.kind || 'default'
  }
}

export function getDisplayKeyCandidates(effectOrKey) {
  const out = []
  const seen = new Set()
  const primary = resolveEffectDisplayKey(effectOrKey) || 'default'
  addCandidate(out, seen, primary)

  const variants = CANONICAL_UI_KEY_ALIASES[primary] || []
  variants.forEach((variant) => addCandidate(out, seen, variant))

  if (typeof effectOrKey === 'string') {
    addCandidate(out, seen, effectOrKey)
    const legacy = toLegacyUiKey(effectOrKey)
    if (legacy && legacy !== primary) addCandidate(out, seen, legacy)
    return out
  }

  const effect = effectOrKey || {}
  ;[
    effect.displayType,
    effect.physicalType,
    effect.reactionType,
    effect.type,
    effect.id,
    effect.name,
    effect.kind,
    effect.element ? `${effect.element}_infliction` : null,
    effect.element ? `${effect.element}_burst` : null,
  ].forEach((value) => addCandidate(out, seen, value))

  return out
}

export function expandDisplayAliases(record = {}) {
  const source = { ...(record || {}) }
  const out = { ...source }

  Object.entries(CANONICAL_UI_KEY_ALIASES).forEach(([canonicalKey, aliases]) => {
    const allKeys = [canonicalKey, ...aliases]
    const found = allKeys.find((key) => source[key] != null)
    if (found == null) return
    const value = source[found]
    allKeys.forEach((key) => {
      out[key] = value
    })
  })

  return out
}