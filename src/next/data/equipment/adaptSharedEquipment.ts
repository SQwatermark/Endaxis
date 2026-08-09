/**
 * 将旧只读装备目录适配为 Next 装备定义。
 *
 * 这里是共享数据与 Next 契约之间的防腐层：只转换已经完成语义审计的字段。严格模式
 * 用于审计；宽松模式允许保留可确认的目录骨架，但每个被省略的效果都必须形成结构化问题。
 */
import type {
  Effect,
  GearPieceSheet,
  GearSetSheet,
  Leveled,
  WeaponSheet,
  WeaponSkillSlot,
} from '../../../data/types';
import type {
  EquipmentModifierDefinition,
  EquipmentPanelStat,
  GearDefinition,
  GearSetDefinition,
  GearSlotType,
  WeaponDefinition,
  WeaponRarity,
  WeaponTraitDefinition,
} from '../../core/game-data/equipmentDefinition';
import type {
  DamageType,
  OperatorWeaponType,
  SkillType,
} from '../../core/game-data/operatorDefinition';

const WEAPON_TRAIT_LEVEL_COUNT = 9;
const GEAR_TRAIT_LEVEL_COUNT = 4;
const WEAPON_TYPES = new Set<OperatorWeaponType>([
  'sword',
  'greatsword',
  'polearm',
  'handcannon',
  'arts-unit',
]);
const WEAPON_RARITIES = new Set<WeaponRarity>([3, 4, 5, 6]);
const ALL_SCOPED_DAMAGE_TYPES: readonly DamageType[] = [
  'physical',
  'true',
  'heat',
  'electric',
  'cryo',
  'nature',
  'ether',
];
const DEFAULT_ALL_SKILL_TYPES: readonly SkillType[] = ['battleSkill', 'comboSkill', 'ultimate'];
const SKILL_TYPE_MAP: Readonly<Record<string, readonly SkillType[]>> = {
  basicAttack: ['basicAttack', 'finisher', 'plungingAttack'],
  battleSkill: ['battleSkill'],
  comboSkill: ['comboSkill'],
  ultimate: ['ultimate'],
  finalStrike: ['finisher'],
  dive: ['plungingAttack'],
};
const PANEL_STAT_MAP: Readonly<Record<string, readonly [EquipmentPanelStat, number]>> = {
  atkFlat: ['attackFlat', 1],
  atkPercent: ['attackPercent', 0.01],
  flatHp: ['healthFlat', 1],
  hpPercent: ['healthPercent', 0.01],
  flatDef: ['defenseFlat', 1],
  defPercent: ['defensePercent', 0.01],
  critRate: ['criticalRate', 0.01],
  critDmg: ['criticalDamage', 0.01],
  artsIntensity: ['artsIntensity', 1],
  ultimateGainEfficiency: ['ultimateEnergyGainEfficiency', 0.01],
};
const DYNAMIC_STATUS_FIELDS = [
  'duration',
  'durationExtension',
  'stacks',
  'maxStacks',
  'stackStrategy',
  'condition',
  'icd',
  'icdGroup',
  'scaling',
] as const;

export type SharedEquipmentKind = 'weapon' | 'gear' | 'gearSet';
export type SharedEquipmentAdaptationMode = 'strict' | 'permissive';

export interface SharedEquipmentAdaptationOptions {
  readonly mode?: SharedEquipmentAdaptationMode;
}

/** 无法无损进入 Next 定义的具体位置与原因。 */
export interface SharedEquipmentAdaptationIssue {
  readonly sourceKind: SharedEquipmentKind;
  readonly slug: string;
  readonly path: string;
  readonly code:
    | 'invalid-source'
    | 'unsupported-form'
    | 'unsupported-trigger'
    | 'unsupported-effect'
    | 'unsupported-modifier'
    | 'unsupported-scope'
    | 'unsupported-dynamic-status'
    | 'unsupported-stat-filter'
    | 'invalid-level-values';
  readonly message: string;
}

export type SharedEquipmentAdaptationResult<T> =
  | {
      readonly ok: true;
      readonly definition: T;
      readonly completeness: 'complete' | 'partial';
      readonly issues: readonly SharedEquipmentAdaptationIssue[];
    }
  | { readonly ok: false; readonly issues: readonly SharedEquipmentAdaptationIssue[] };

interface AdaptationContext {
  readonly sourceKind: SharedEquipmentKind;
  readonly slug: string;
  readonly issues: SharedEquipmentAdaptationIssue[];
}

function addIssue(
  context: AdaptationContext,
  path: string,
  code: SharedEquipmentAdaptationIssue['code'],
  message: string,
): void {
  context.issues.push({
    sourceKind: context.sourceKind,
    slug: context.slug,
    path,
    code,
    message,
  });
}

function finishAdaptation<T>(
  context: AdaptationContext,
  definition: T,
  options: SharedEquipmentAdaptationOptions,
): SharedEquipmentAdaptationResult<T> {
  const issues = Object.freeze([...context.issues]);
  const hasInvalidSource = issues.some(issue => issue.code === 'invalid-source');
  if (hasInvalidSource || ((options.mode ?? 'strict') === 'strict' && issues.length > 0)) {
    return { ok: false, issues };
  }
  return {
    ok: true,
    definition,
    completeness: issues.length === 0 ? 'complete' : 'partial',
    issues,
  };
}

function isFiniteLevelValues(value: unknown, expectedCount: number): value is Leveled<number> {
  if (typeof value === 'number') return Number.isFinite(value);
  return (
    Array.isArray(value) &&
    value.length === expectedCount &&
    value.every(entry => typeof entry === 'number' && Number.isFinite(entry))
  );
}

function mapLevelValues(
  context: AdaptationContext,
  value: unknown,
  expectedCount: number,
  path: string,
  scale = 1,
): number | readonly number[] | null {
  if (!isFiniteLevelValues(value, expectedCount)) {
    addIssue(
      context,
      path,
      'invalid-level-values',
      `应为有限数值或长度为 ${expectedCount} 的有限数值数组`,
    );
    return null;
  }
  if (typeof value === 'number') return value * scale;
  return value.map(entry => entry * scale);
}

function mapAttribute(
  value: unknown,
): 'strength' | 'agility' | 'intellect' | 'will' | 'main' | 'secondary' | null {
  if (value === 'sub') return 'secondary';
  if (
    value === 'strength' ||
    value === 'agility' ||
    value === 'intellect' ||
    value === 'will' ||
    value === 'main'
  ) {
    return value;
  }
  return null;
}

function mapSkillTypes(value: unknown): SkillType | readonly SkillType[] | null {
  const source = Array.isArray(value) ? value : [value];
  if (source.length === 0) return null;
  const mapped: SkillType[] = [];
  for (const entry of source) {
    const targets = SKILL_TYPE_MAP[String(entry)];
    if (!targets) return null;
    for (const target of targets) {
      if (!mapped.includes(target)) mapped.push(target);
    }
  }
  return mapped.length === 1 ? mapped[0]! : mapped;
}

function mapDamageTypes(value: unknown): DamageType | readonly DamageType[] | null {
  const source = Array.isArray(value) ? value : [value];
  if (source.length === 0) return null;
  const mapped: DamageType[] = [];
  for (const entry of source) {
    if (
      entry !== 'physical' &&
      entry !== 'heat' &&
      entry !== 'cryo' &&
      entry !== 'electric' &&
      entry !== 'nature'
    ) {
      return null;
    }
    if (!mapped.includes(entry)) mapped.push(entry);
  }
  return mapped.length === 1 ? mapped[0]! : mapped;
}

function requireExactStatFields(
  context: AdaptationContext,
  stat: Record<string, unknown>,
  allowed: readonly string[],
  path: string,
): boolean {
  const unexpected = Object.keys(stat).filter(key => !allowed.includes(key));
  if (unexpected.length === 0) return true;
  addIssue(
    context,
    path,
    'unsupported-stat-filter',
    `当前修正类型无法表达字段：${unexpected.join(', ')}`,
  );
  return false;
}

function adaptStaticStatus(
  context: AdaptationContext,
  effect: Effect,
  expectedLevelCount: number,
  path: string,
): EquipmentModifierDefinition | null {
  if (effect.kind !== 'status' || !effect.stat || !('modifier' in effect.stat)) {
    addIssue(
      context,
      path,
      'unsupported-effect',
      `当前只支持带 stat 的静态 status，收到 ${effect.kind}`,
    );
    return null;
  }
  if (effect.target !== undefined && effect.target !== 'self') {
    addIssue(context, `${path}.target`, 'unsupported-scope', '当前静态目录修正只支持 self');
    return null;
  }
  for (const field of DYNAMIC_STATUS_FIELDS) {
    if (field in effect) {
      addIssue(
        context,
        `${path}.${field}`,
        'unsupported-dynamic-status',
        `字段 ${field} 需要战斗期状态能力，不能静态化`,
      );
      return null;
    }
  }
  if (effect.external) {
    addIssue(context, `${path}.external`, 'unsupported-modifier', '独立乘区不能并入普通静态修正');
    return null;
  }

  const stat = effect.stat as unknown as Record<string, unknown>;
  const modifier = stat.modifier;
  const valuePath = `${path}.value`;

  if (modifier === 'attributeFlat' || modifier === 'attributePercent') {
    if (!requireExactStatFields(context, stat, ['modifier', 'attribute'], `${path}.stat`))
      return null;
    const attribute = mapAttribute(stat.attribute);
    if (!attribute) {
      addIssue(
        context,
        `${path}.stat.attribute`,
        'unsupported-stat-filter',
        '无法识别四维属性范围',
      );
      return null;
    }
    const value = mapLevelValues(
      context,
      effect.value,
      expectedLevelCount,
      valuePath,
      modifier === 'attributePercent' ? 0.01 : 1,
    );
    return value === null
      ? null
      : {
          kind: 'attribute',
          attribute,
          operation: modifier === 'attributeFlat' ? 'flat' : 'percent',
          value,
        };
  }

  if (typeof modifier === 'string' && modifier in PANEL_STAT_MAP) {
    if (!requireExactStatFields(context, stat, ['modifier'], `${path}.stat`)) return null;
    const [panelStat, scale] = PANEL_STAT_MAP[modifier]!;
    const value = mapLevelValues(context, effect.value, expectedLevelCount, valuePath, scale);
    return value === null ? null : { kind: 'panelStat', stat: panelStat, value };
  }

  if (modifier === 'staggerPercent') {
    if (!requireExactStatFields(context, stat, ['modifier'], `${path}.stat`)) return null;
    const value = mapLevelValues(context, effect.value, expectedLevelCount, valuePath, 0.01);
    return value === null ? null : { kind: 'panelStat', stat: 'staggerDamagePercent', value };
  }

  if (modifier === 'dmgBonus') {
    if (
      !requireExactStatFields(context, stat, ['modifier', 'elements', 'skillTypes'], `${path}.stat`)
    ) {
      return null;
    }
    const damageTypes =
      stat.elements === undefined ? ALL_SCOPED_DAMAGE_TYPES : mapDamageTypes(stat.elements);
    if (!damageTypes) {
      addIssue(context, `${path}.stat.elements`, 'unsupported-stat-filter', '无法识别伤害元素范围');
      return null;
    }
    const skillTypes =
      stat.skillTypes === undefined
        ? stat.elements === undefined
          ? DEFAULT_ALL_SKILL_TYPES
          : undefined
        : mapSkillTypes(stat.skillTypes);
    if (stat.skillTypes !== undefined && !skillTypes) {
      addIssue(context, `${path}.stat.skillTypes`, 'unsupported-stat-filter', '无法识别技能范围');
      return null;
    }
    const value = mapLevelValues(context, effect.value, expectedLevelCount, valuePath, 0.01);
    return value === null
      ? null
      : {
          kind: 'damageBonus',
          damageTypes,
          ...(skillTypes ? { skillTypes } : {}),
          value,
        };
  }

  addIssue(
    context,
    `${path}.stat.modifier`,
    'unsupported-modifier',
    `Next 装备 DSL 尚不能无损表达 ${String(modifier)}`,
  );
  return null;
}

function adaptEffects(
  context: AdaptationContext,
  effects: readonly Effect[] | undefined,
  expectedLevelCount: number,
  path: string,
): readonly EquipmentModifierDefinition[] {
  const modifiers: EquipmentModifierDefinition[] = [];
  for (const [index, effect] of (effects ?? []).entries()) {
    const modifier = adaptStaticStatus(context, effect, expectedLevelCount, `${path}[${index}]`);
    if (modifier) modifiers.push(modifier);
  }
  return modifiers;
}

function adaptWeaponTrait(
  context: AdaptationContext,
  key: 'skill1' | 'skill2' | 'skill3',
  slot: WeaponSkillSlot,
): WeaponTraitDefinition | null {
  if (!slot.effects?.length && !slot.triggers?.length) return null;
  if (slot.triggers?.length) {
    addIssue(
      context,
      `${key}.triggers`,
      'unsupported-trigger',
      '旧触发器尚未完成到 Next 事件序列的无损适配',
    );
  }
  const modifiers = adaptEffects(context, slot.effects, WEAPON_TRAIT_LEVEL_COUNT, `${key}.effects`);
  return {
    key,
    levelCount: WEAPON_TRAIT_LEVEL_COUNT,
    ...(modifiers.length ? { modifiers } : {}),
  };
}

export function adaptSharedWeapon(
  slug: string,
  source: WeaponSheet,
  options: SharedEquipmentAdaptationOptions = {},
): SharedEquipmentAdaptationResult<WeaponDefinition> {
  const context: AdaptationContext = { sourceKind: 'weapon', slug, issues: [] };
  if (source.forms) {
    addIssue(
      context,
      'forms',
      'unsupported-form',
      'Next WeaponDefinition 尚未建模属性驱动的武器形态',
    );
  }
  if (!WEAPON_RARITIES.has(source.rarity as WeaponRarity)) {
    addIssue(context, 'rarity', 'invalid-source', `未知武器星级 ${source.rarity}`);
  }
  if (!WEAPON_TYPES.has(source.type as OperatorWeaponType)) {
    addIssue(context, 'type', 'invalid-source', `未知武器类型 ${source.type}`);
  }
  if (source.baseAtk.length !== 6 || source.baseAtk.some(value => !Number.isFinite(value))) {
    addIssue(context, 'baseAtk', 'invalid-source', '武器基础攻击节点必须包含 6 个有限数值');
  }
  const traits = (['skill1', 'skill2', 'skill3'] as const)
    .map(key => adaptWeaponTrait(context, key, source[key]))
    .filter((trait): trait is WeaponTraitDefinition => trait !== null);
  if (traits.length === 0) {
    addIssue(context, 'traits', 'invalid-source', '武器至少需要一条可见词条');
  }
  return finishAdaptation(
    context,
    {
      slug,
      iconPath: source.icon,
      rarity: source.rarity as WeaponRarity,
      weaponType: source.type as OperatorWeaponType,
      baseAttackAtLevelNodes: [...source.baseAtk],
      traits,
    },
    options,
  );
}

function mapGearSlotType(value: string): GearSlotType | null {
  if (value === 'armor' || value === 'gloves') return value;
  if (value === 'kit') return 'accessory';
  return null;
}

export function adaptSharedGear(
  slug: string,
  source: GearPieceSheet,
  options: SharedEquipmentAdaptationOptions = {},
): SharedEquipmentAdaptationResult<GearDefinition> {
  const context: AdaptationContext = { sourceKind: 'gear', slug, issues: [] };
  const slotType = mapGearSlotType(source.slotType);
  if (!slotType) addIssue(context, 'slotType', 'invalid-source', `未知装备槽位 ${source.slotType}`);
  if (!Number.isFinite(source.levelRequirement) || !Number.isFinite(source.defense)) {
    addIssue(context, 'base', 'invalid-source', '装备等级要求和基础防御必须是有限数值');
  }
  const traits = (['skill1', 'skill2', 'skill3'] as const).flatMap(key => {
    const slot = source[key];
    if (!slot?.effects?.length) return [];
    const modifiers = adaptEffects(context, slot.effects, GEAR_TRAIT_LEVEL_COUNT, `${key}.effects`);
    return [
      { key, levelCount: GEAR_TRAIT_LEVEL_COUNT, ...(modifiers.length ? { modifiers } : {}) },
    ];
  });
  return finishAdaptation(
    context,
    {
      slug,
      iconPath: source.icon,
      slotType: slotType!,
      levelRequirement: source.levelRequirement,
      baseDefense: source.defense,
      traits,
      ...(source.setSlug && source.setSlug !== 'no-set-bonuses'
        ? { gearSetSlug: source.setSlug }
        : {}),
    },
    options,
  );
}

export function adaptSharedGearSet(
  slug: string,
  source: GearSetSheet,
  options: SharedEquipmentAdaptationOptions = {},
): SharedEquipmentAdaptationResult<GearSetDefinition> {
  const context: AdaptationContext = { sourceKind: 'gearSet', slug, issues: [] };
  if (source.triggers?.length) {
    addIssue(
      context,
      'triggers',
      'unsupported-trigger',
      '旧套装触发器尚未完成到 Next 事件序列的无损适配',
    );
  }
  const modifiers = adaptEffects(context, source.effects, 1, 'effects');
  return finishAdaptation(context, { slug, ...(modifiers.length ? { modifiers } : {}) }, options);
}
