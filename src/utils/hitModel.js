const LEGACY_TO_OPTIMIZER_TYPE = Object.freeze({
  attack: 'basicAttack',
  skill: 'battleSkill',
  link: 'comboSkill',
  ultimate: 'ultimate',
  execution: 'finisher',
  dodge: 'dive',
})

const OPTIMIZER_TO_LEGACY_TYPE = Object.freeze({
  basicAttack: 'attack',
  battleSkill: 'skill',
  comboSkill: 'link',
  ultimate: 'ultimate',
  finisher: 'execution',
  dive: 'dodge',
})

const PHYSICAL_STATUS_TYPES = new Set([
  'break',
  'armor_break',
  'stagger',
  'knockdown',
  'knockup',
  'ice_shatter',
])

function cloneJson(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

export function createHitModelId() {
  return Math.random().toString(36).substring(2, 9)
}

export function toOptimizerActionType(type) {
  if (!type) return 'battleSkill'
  return LEGACY_TO_OPTIMIZER_TYPE[type] || type
}

export function toLegacyDisplayType(type) {
  if (!type) return 'unknown'
  return OPTIMIZER_TO_LEGACY_TYPE[type] || type
}

function decorateHitCompat(hit) {
  if (!hit || typeof hit !== 'object') return hit
  if (!Object.prototype.hasOwnProperty.call(hit, 'sp')) {
    Object.defineProperty(hit, 'sp', {
      enumerable: false,
      configurable: true,
      get() {
        return (this.spKind === 'refund')
          ? (Number(this.spReturn) || 0)
          : (Number(this.spRecovery) || 0)
      },
      set(value) {
        const num = Number(value) || 0
        if (this.spKind === 'refund') {
          this.spReturn = num
          this.spRecovery = 0
        } else {
          this.spRecovery = num
          this.spReturn = 0
        }
      },
    })
  }
  if (!Object.prototype.hasOwnProperty.call(hit, 'spKind')) {
    Object.defineProperty(hit, 'spKind', {
      enumerable: false,
      configurable: true,
      get() {
        return (Number(this.spReturn) || 0) > 0 ? 'refund' : 'recover'
      },
      set(value) {
        const current = Number(this.sp) || 0
        if (value === 'refund') {
          this.spReturn = current
          this.spRecovery = 0
        } else {
          this.spRecovery = current
          this.spReturn = 0
        }
      },
    })
  }
  return hit
}

export function ensureEffectId(effect) {
  if (!effect || typeof effect !== 'object') return effect
  if (!effect._id) effect._id = createHitModelId()
  return effect
}

export function ensureEffectIds(rows) {
  if (!Array.isArray(rows)) return rows
  rows.forEach((row) => {
    if (!Array.isArray(row)) return
    row.forEach((effect) => ensureEffectId(effect))
  })
  return rows
}

function inferAllowedEffectTypesFromHits(hits = []) {
  const collected = new Set()
  hits.forEach((hit) => {
    const effects = Array.isArray(hit?.effects) ? hit.effects : []
    effects.forEach((effect) => {
      const type = effect?.displayType || effect?.type || effect?.id || effect?.kind
      if (type) collected.add(type)
    })
  })
  return [...collected]
}

export function getHitEffectRows(hits = []) {
  return (Array.isArray(hits) ? hits : []).map((hit) => {
    if (!Array.isArray(hit?.effects)) hit.effects = []
    hit.effects.forEach((effect) => ensureEffectId(effect))
    return hit.effects
  })
}

export function setHitEffectRows(existingHits = [], rows = []) {
  const nextHits = Array.isArray(existingHits) ? existingHits : []
  while (nextHits.length < rows.length) {
    nextHits.push(createEditorHit())
  }
  nextHits.length = rows.length
  nextHits.forEach((hit, index) => {
    const nextRow = Array.isArray(rows[index]) ? rows[index] : []
    hit.effects = nextRow.map((effect) => ensureEffectId(effect))
  })
  return nextHits
}

function convertLegacyRowToEffects(row = []) {
  return row
    .filter((effect) => effect && typeof effect === 'object')
    .map((effect) => {
      const next = cloneJson(effect) || {}
      ensureEffectId(next)
      if (next.displayType === undefined) next.displayType = next.type || next.id || next.kind || 'default'
      if (PHYSICAL_STATUS_TYPES.has(next.type)) {
        next.kind = next.kind || 'physicalStatus'
        next.physicalType = next.physicalType || next.type
      } else if (typeof next.type === 'string' && next.type.endsWith('_attach')) {
        next.kind = next.kind || 'infliction'
        next.element = next.element || next.type.replace(/_attach$/, '')
      } else if (typeof next.type === 'string' && next.type.endsWith('_burst')) {
        next.kind = next.kind || 'burst'
        next.element = next.element || next.type.replace(/_burst$/, '')
      } else {
        next.kind = next.kind || 'status'
        next.id = next.id || next.type || next.name || ensureEffectId(next)._id
        next.name = next.name || next.type || next.id
      }
      next.duration = Number(next.duration) || 0
      next.stacks = Math.max(1, Number(next.stacks) || 1)
      return next
    })
}

export function createEditorEffect(defaultType = 'default') {
  return {
    _id: createHitModelId(),
    type: defaultType,
    kind: PHYSICAL_STATUS_TYPES.has(defaultType) ? 'physicalStatus' : 'status',
    ...(PHYSICAL_STATUS_TYPES.has(defaultType) ? { physicalType: defaultType } : { id: defaultType, name: defaultType }),
    displayType: defaultType,
    stacks: 1,
    duration: 0,
  }
}

export function createEditorHit({ offset = 0, stagger = 0, spRecovery = 0, spReturn = 0, element = null, effects = [] } = {}) {
  const hit = {
    offset: Number(offset) || 0,
    stagger: Number(stagger) || 0,
    spRecovery: Number(spRecovery) || 0,
    spReturn: Number(spReturn) || 0,
    effects: Array.isArray(effects) ? effects.map((effect) => ensureEffectId(effect)) : [],
  }
  if (element) hit.element = element
  return decorateHitCompat(hit)
}

export function normalizeHits(rawHits = [], defaultElement = null) {
  if (!Array.isArray(rawHits)) return []
  return rawHits
    .filter((hit) => hit && typeof hit === 'object')
    .map((hit) => {
      const next = {
        ...hit,
        offset: Number(hit.offset) || 0,
        stagger: Number(hit.stagger) || 0,
        spRecovery: Number(hit.spRecovery) || 0,
        spReturn: Number(hit.spReturn) || 0,
        durationExtension: Number(hit.durationExtension) || 0,
      }
      if (!next.element && defaultElement) next.element = defaultElement
      next.effects = Array.isArray(hit.effects)
        ? hit.effects.map((effect) => ensureEffectId(effect))
        : []
      return decorateHitCompat(next)
    })
    .sort((a, b) => (Number(a.offset) || 0) - (Number(b.offset) || 0))
}

export function legacyActionToHits({
  hits,
  damageTicks,
  physicalAnomaly,
  allowedTypes,
  effectRows,
  element,
} = {}) {
  if (Array.isArray(hits) && hits.length > 0) {
    return normalizeHits(hits, element)
  }

  const normalizedHits = Array.isArray(damageTicks)
    ? damageTicks.map((tick) => createEditorHit({
        offset: tick?.offset,
        stagger: tick?.stagger,
        spRecovery: (tick?.spKind === 'refund') ? 0 : Number(tick?.sp) || 0,
        spReturn: tick?.spKind === 'refund' ? Number(tick?.sp) || 0 : 0,
        element,
      }))
    : []

  const rowsSource = effectRows ?? physicalAnomaly
  const rows = Array.isArray(rowsSource)
    ? (Array.isArray(rowsSource[0]) ? rowsSource : [rowsSource])
    : []

  rows.forEach((row, rowIndex) => {
    const effects = convertLegacyRowToEffects(row)
    if (effects.length === 0) return

    const firstOffset = Number(effects[0]?.offset) || 0
    const boundHitIndex = normalizedHits.findIndex((hit, hitIndex) => {
      if (hitIndex === rowIndex && rowIndex < normalizedHits.length) return true
      return Math.abs((Number(hit.offset) || 0) - firstOffset) < 0.0001
    })

    const targetIndex = boundHitIndex >= 0 ? boundHitIndex : normalizedHits.length
    if (!normalizedHits[targetIndex]) {
      normalizedHits[targetIndex] = createEditorHit({
        offset: firstOffset,
        element,
      })
    }
    normalizedHits[targetIndex].effects.push(...effects)
  })

  if (normalizedHits.length === 0 && Array.isArray(allowedTypes) && allowedTypes.length > 0) {
    normalizedHits.push(createEditorHit({ element }))
  }

  return normalizeHits(normalizedHits, element)
}

function defineAlias(entity, aliasKey, descriptor) {
  if (!entity || typeof entity !== 'object') return
  const current = Object.getOwnPropertyDescriptor(entity, aliasKey)
  if (current?.get || current?.set) return
  Object.defineProperty(entity, aliasKey, {
    enumerable: false,
    configurable: true,
    ...descriptor,
  })
}

export function ensureActionLikeModel(entity, { deleteLegacy = true, aliasStyle = null, defaultElement = null } = {}) {
  if (!entity || typeof entity !== 'object') return entity

  entity.type = toOptimizerActionType(entity.type)
  entity.hits = legacyActionToHits({
    hits: entity.hits,
    damageTicks: entity.damageTicks || entity.damage_ticks,
    physicalAnomaly: entity.physicalAnomaly || entity.anomalies,
    allowedTypes: entity.allowedTypes || entity.allowed_types,
    element: entity.element || defaultElement,
  })

  const allowedList = Array.isArray(entity.allowedEffectTypes)
    ? entity.allowedEffectTypes
    : (entity.allowedTypes || entity.allowed_types || inferAllowedEffectTypesFromHits(entity.hits))
  entity.allowedEffectTypes = Array.isArray(allowedList) ? [...allowedList] : []

  if (deleteLegacy) {
    delete entity.damageTicks
    delete entity.damage_ticks
    delete entity.physicalAnomaly
    delete entity.anomalies
    delete entity.allowedTypes
    delete entity.allowed_types
  }

  if (aliasStyle === 'camel' || aliasStyle === 'both') {
    defineAlias(entity, 'damageTicks', {
      get() { return this.hits },
      set(value) { this.hits = normalizeHits(value, this.element || defaultElement) },
    })
    defineAlias(entity, 'physicalAnomaly', {
      get() { return getHitEffectRows(this.hits) },
      set(value) { this.hits = setHitEffectRows(this.hits, value) },
    })
    defineAlias(entity, 'allowedTypes', {
      get() { return this.allowedEffectTypes },
      set(value) { this.allowedEffectTypes = Array.isArray(value) ? value : [] },
    })
  }

  if (aliasStyle === 'snake' || aliasStyle === 'both') {
    defineAlias(entity, 'damage_ticks', {
      get() { return this.hits },
      set(value) { this.hits = normalizeHits(value, this.element || defaultElement) },
    })
    defineAlias(entity, 'anomalies', {
      get() { return getHitEffectRows(this.hits) },
      set(value) { this.hits = setHitEffectRows(this.hits, value) },
    })
    defineAlias(entity, 'allowed_types', {
      get() { return this.allowedEffectTypes },
      set(value) { this.allowedEffectTypes = Array.isArray(value) ? value : [] },
    })
  }

  return entity
}
