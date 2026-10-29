/** 来源限定的干预目录。展示全量资源，独立施加只开放首版执行宿主已支持的部分。 */
import type {
  SkillBuffDefinition,
  SkillGlobalBuffDefinition,
} from '../../../packages/game-data-contract/src/buffs';
import { DAMAGE_SCALE_ATTRIBUTE_KEYS } from '../combat/damage/damageScaleAttributes';
import { ENEMY_RESISTANCE_ATTRIBUTES } from '../combat/damage/playerActiveDamageInput';
import { ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE } from '../combat/attributes/operatorAttackAttributes';
import { compileIndependentBuffResource } from '../compiler/compileSkill';
import type { ResolvedSkillBuffDefinition } from '../compiler/combatProgram';
import type { GameDataBrowser, GameDataRepository } from './gameDataRepository';
import type { OperatorBuffDefinitions } from './operatorDefinition';

export interface BuffInterventionReference {
  readonly kind: 'operator' | 'weapon' | 'gear' | 'gearSet' | 'common';
  readonly sourceId: string;
  readonly buffId: string;
  /** 普通 Buff 省略；全局父实例只展示，不伪装成普通 Buff。 */
  readonly resourceKind?: 'global';
}
export type BuffInterventionTargetKind = 'enemy' | 'operator';
export interface BuffInterventionParameter {
  readonly key: string;
  readonly label: string;
  readonly defaultValue?: number;
  readonly required: boolean;
  readonly minimum?: number;
  readonly integer?: boolean;
}
export interface BuffInterventionCatalogEntry {
  readonly key: string;
  readonly reference: BuffInterventionReference;
  readonly label: string;
  readonly sourceLabel: string;
  readonly definition?: SkillBuffDefinition;
  readonly globalDefinition?: SkillGlobalBuffDefinition;
  readonly support: {
    readonly apply: boolean;
    readonly finish: boolean;
    readonly suppress: boolean;
    readonly suppressionReasons: readonly string[];
    readonly targets: readonly BuffInterventionTargetKind[];
    readonly reasons: readonly string[];
    readonly targetReasons: Readonly<
      Partial<Record<BuffInterventionTargetKind, readonly string[]>>
    >;
    readonly parameters: readonly BuffInterventionParameter[];
    readonly unboundBlackboardKeys: readonly string[];
  };
}
export type BuffInterventionCatalogRepository = Pick<
  GameDataRepository,
  | 'actionPrograms'
  | 'getOperator'
  | 'getWeapon'
  | 'getGear'
  | 'getGearSet'
  | 'getCommonDefinitionSources'
> &
  Partial<GameDataBrowser>;

interface Source {
  readonly kind: BuffInterventionReference['kind'];
  readonly id: string;
  readonly label: string;
  readonly root: object;
  readonly buffs?: OperatorBuffDefinitions;
}

export function buffInterventionReferenceKey(reference: BuffInterventionReference): string {
  return JSON.stringify([
    reference.kind,
    reference.sourceId,
    reference.buffId,
    reference.resourceKind ?? 'buff',
  ]);
}

function source(kind: Source['kind'], id: string, root: object): Source {
  const owner = root as { displayName?: string; buffDefinitions?: OperatorBuffDefinitions };
  return { kind, id, root, label: owner.displayName ?? id, buffs: owner.buffDefinitions };
}

function walk(
  value: unknown,
  visit: (value: Record<string, unknown>) => void,
  seen = new Set<object>(),
): void {
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  if (!Array.isArray(value)) visit(value as Record<string, unknown>);
  for (const child of Object.values(value)) walk(child, visit, seen);
}

function globals(owner: Source): Map<string, SkillGlobalBuffDefinition> {
  const result = new Map<string, SkillGlobalBuffDefinition>();
  walk(owner.root, value => {
    if (value.kind !== 'createGlobalBuff') return;
    const parameters = value.parameters as
      { globalBuffId?: string; definition?: SkillGlobalBuffDefinition } | undefined;
    if (parameters?.globalBuffId && parameters.definition)
      result.set(parameters.globalBuffId, parameters.definition);
  });
  return result;
}

// 只列已由标准环境初始化的属性。未知属性不会因“可发现”而获得虚假目标兼容性。
const sharedAttributes = new Set<string>([
  ...DAMAGE_SCALE_ATTRIBUTE_KEYS,
  ...Object.values(ENEMY_RESISTANCE_ATTRIBUTES),
  'MaxHp',
  'Level',
  'healOutputIncrease',
  'healTakenIncrease',
  'shelterDamageMultiplier',
  'weaknessDamageMultiplier',
  'SlowActionSpeedScalar',
]);
const operatorAttributes = new Set<string>([
  ...sharedAttributes,
  ...Object.keys(ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE),
  ...Object.values(ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE),
  'Atk',
  'Def',
  'PhysicalAndSpellInflictionEnhance',
  'criticalRate',
  'criticalDamageIncrease',
  'AtbCostAddition',
  'ComboSkillAtbCostAddition',
  'KnockDownTimeAddition',
  'ComboSkillCooldownRecoveryScalar',
  'ComboSkillCooldownScalar',
  'ComboSkillCooldownFinalAddition',
  'NormalSkillCooldownAddition',
  'KeywordSpeedUpScalar',
  'TurnRateScalar',
  'MaxUltimateSp',
  'PhysicalDamageTakenScalar',
  'FireDamageTakenScalar',
  'PulseDamageTakenScalar',
  'CrystDamageTakenScalar',
  'NaturalDamageTakenScalar',
  'EtherDamageTakenScalar',
]);
const enemyAttributes = new Set([...sharedAttributes, 'MaxPoise']);

function entry(
  owner: Source,
  buffId: string,
  definition: SkillBuffDefinition,
  globalChildren: ReadonlySet<string>,
): BuffInterventionCatalogEntry {
  const reference: BuffInterventionReference = { kind: owner.kind, sourceId: owner.id, buffId };
  const reasons: string[] = [];
  if (
    definition.actionGraph &&
    (Object.keys(definition.actionGraph.main.nodes).length > 0 ||
      Object.keys(definition.actionGraph.macros ?? {}).length > 0)
  )
    reasons.push('非空动作图可能依赖原技能资源，第一版暂不支持独立施加。');
  if (globalChildren.has(buffId))
    reasons.push('该 Buff 是 GlobalBuff 子镜像，必须由父实例统一管理共享效果与生命周期。');
  // 宿主按字段存在性安装动作绑定，空数组和 null 入口也不能假设无需技能来源。
  if (definition.lifecycleSequences !== undefined)
    reasons.push(
      '当前执行器会为生命周期字段安装技能动作绑定（包括空/null 入口），第一版暂未支持。',
    );
  if (definition.scheduledSequences !== undefined)
    reasons.push(
      '当前执行器的 Buff 内部时间线绑定（包括空列表）尚未接入独立宿主，第一版暂未支持。',
    );
  if (
    definition.abilityEventResponses !== undefined ||
    definition.igniteEventResponses !== undefined
  )
    reasons.push(
      '第一版独立宿主尚未接入事件响应订阅（包括空列表）；事件回调的数据由触发事件提供，无需伪造创建事件。',
    );
  if (definition.skillSlotReplacements !== undefined)
    reasons.push('技能槽替换字段依赖原技能宿主。');
  if (definition.affixSkillCastIdentity) reasons.push('该 Buff 要求真实技能施放身份。');
  if (definition.keywordEnhancements?.length)
    reasons.push('关键词强化依赖其他 Buff 的加入边沿，暂不支持独立施加。');
  if (definition.role || definition.spellBurst)
    reasons.push('元素附着或爆发语义必须经过原专用链路，暂不支持手动施加。');
  if (definition.shields?.length || definition.sustainedProtection)
    reasons.push('护盾或持续保护需要专用来源/属性绑定，暂不支持独立施加。');
  if (
    [
      ...(definition.damageModifiers ?? []),
      ...(definition.healModifiers ?? []),
      ...(definition.poiseModifiers ?? []),
    ].some(modifier => modifier.condition !== undefined)
  )
    reasons.push('第一版独立宿主尚未接入条件修正图求值，暂不支持独立施加。');
  if (
    definition.damageModifiers?.some(modifier =>
      modifier.processors.some(processor => processor.kind === 'instantAttribute'),
    )
  )
    reasons.push('即时伤害属性修正依赖伤害双方的属性集合，第一版暂不支持独立施加。');
  const targetReasons: Partial<Record<BuffInterventionTargetKind, string[]>> = {};
  for (const target of ['enemy', 'operator'] as const) {
    const available = target === 'enemy' ? enemyAttributes : operatorAttributes;
    for (const modifier of definition.attributeModifiers ?? []) {
      if (modifier.target === 'buffSource') {
        (targetReasons[target] ??= []).push('属性修正作用于 Buff 来源，暂不支持独立来源绑定。');
      } else if (typeof modifier.attribute !== 'string' || !available.has(modifier.attribute)) {
        (targetReasons[target] ??= []).push(
          `该目标未开放属性 ${typeof modifier.attribute === 'string' ? modifier.attribute : modifier.attribute.kind}。`,
        );
      }
    }
  }
  const parameterRules = new Map<string, { minimum?: number; integer?: boolean }>();
  const unboundBlackboardKeys: string[] = [];
  const readParameters = (value: unknown, rules: { minimum?: number; integer?: boolean } = {}) =>
    walk(value, record => {
      if (typeof record.blackboardKey !== 'string') return;
      const old = parameterRules.get(record.blackboardKey) ?? {};
      parameterRules.set(record.blackboardKey, {
        ...(old.minimum !== undefined || rules.minimum !== undefined
          ? { minimum: Math.max(old.minimum ?? -Infinity, rules.minimum ?? -Infinity) }
          : {}),
        ...(old.integer || rules.integer ? { integer: true } : {}),
      });
    });
  if (
    definition.stackingType === 'highPriority' ||
    definition.stackingType === 'highPriorityWithMaxStack'
  )
    readParameters(definition.priority);
  readParameters(definition.durationSeconds);
  readParameters(definition.addingCooldownSeconds);
  if (
    [
      'stack',
      'highPriorityWithMaxStack',
      'enhance',
      'enhanceAndRefresh',
      'enhanceAndOverwriteDuration',
      'timedGrowingEnhance',
    ].includes(definition.stackingType)
  )
    readParameters(definition.maxStackCount, { integer: true });
  readParameters(definition.triggerIntervalSeconds);
  readParameters(definition.maxTriggerCount, { integer: true });
  for (const value of [
    definition.attributeModifiers,
    definition.damageModifiers,
    definition.healModifiers,
    definition.poiseModifiers,
  ])
    readParameters(value);
  const parameters = [...parameterRules].flatMap(([key, rules]): BuffInterventionParameter[] => {
    // 读取键不等于声明。原生施加点可以合法动态赋值，用户编辑不能据此扩展声明。
    if (!Object.hasOwn(definition.blackboard ?? {}, key)) {
      unboundBlackboardKeys.push(key);
      reasons.push(
        `独立施加依赖本 Buff 未声明的黑板键 ${key}；需由原施加点绑定，不能作为用户覆盖参数。`,
      );
      return [];
    }
    const value = definition.blackboard![key];
    if (typeof value !== 'number' || !Number.isFinite(value))
      reasons.push(`参数 ${key} 的默认值不是已解析的有限数值。`);
    return [
      {
        key,
        label: key,
        required: false,
        ...(typeof value === 'number' ? { defaultValue: value } : {}),
        ...rules,
      },
    ];
  });
  const targets = (['enemy', 'operator'] as const).filter(target => !targetReasons[target]?.length);
  if (!targets.length) reasons.push('当前没有可独立承载该 Buff 属性的支持目标。');
  return {
    key: buffInterventionReferenceKey(reference),
    reference,
    label: definition.presentation?.nameKey ?? buffId,
    sourceLabel: `${owner.kind} / ${owner.label}`,
    definition,
    support: {
      apply: reasons.length === 0,
      suppress: false,
      suppressionReasons: ['尚未核对完整目录中的来源唯一性。'],
      finish: reasons.length === 0,
      targets,
      reasons,
      targetReasons,
      parameters,
      unboundBlackboardKeys,
    },
  };
}

function entries(owner: Source): BuffInterventionCatalogEntry[] {
  const globalDefinitions = globals(owner);
  const children = new Set(
    [...globalDefinitions.values()].flatMap(global => global.children.map(child => child.buffId)),
  );
  const result = Object.entries(owner.buffs ?? {}).map(([id, definition]) =>
    entry(owner, id, definition, children),
  );
  for (const [buffId, definition] of globalDefinitions) {
    const reference: BuffInterventionReference = {
      kind: owner.kind,
      sourceId: owner.id,
      buffId,
      resourceKind: 'global',
    };
    result.push({
      key: buffInterventionReferenceKey(reference),
      reference,
      label: buffId,
      sourceLabel: `${owner.kind} / ${owner.label}`,
      globalDefinition: definition,
      support: {
        apply: false,
        suppress: false,
        suppressionReasons: [
          '第一版仅支持目标局部抑制，全局父 Buff 及其子镜像涉及全体共享效果，暂不开放抑制。',
        ],
        finish: false,
        targets: [],
        parameters: [],
        unboundBlackboardKeys: [],
        targetReasons: {},
        reasons: ['全局父 Buff 拥有共享效果和子镜像生命周期，第一版只展示，不支持手动施加或结束。'],
      },
    });
  }
  return result;
}

export function listBuffInterventionCatalog(
  repository: BuffInterventionCatalogRepository & GameDataBrowser,
): readonly BuffInterventionCatalogEntry[] {
  const sources: Source[] = [
    ...repository.getOperators().map(value => source('operator', value.slug, value)),
    ...repository.getWeapons().map(value => source('weapon', value.slug, value)),
    ...repository.getGears().map(value => source('gear', value.slug, value)),
    ...repository.getGearSets().map(value => source('gearSet', value.slug, value)),
    ...repository.getCommonDefinitionSources().map(value => source('common', value.id, value)),
  ];
  const catalog = sources.flatMap(entries).sort((a, b) => a.key.localeCompare(b.key));
  const globalChildren = new Set<string>();
  for (const owner of sources)
    walk(owner.root, value => {
      if (value.kind !== 'createGlobalBuff') return;
      const parameters = value.parameters as { definition?: SkillGlobalBuffDefinition } | undefined;
      for (const child of parameters?.definition?.children ?? []) globalChildren.add(child.buffId);
    });
  const counts = new Map<string, number>();
  for (const resource of catalog)
    counts.set(resource.reference.buffId, (counts.get(resource.reference.buffId) ?? 0) + 1);
  return catalog.map(resource =>
    resource.reference.resourceKind === 'global'
      ? resource
      : {
          ...resource,
          support: {
            ...resource.support,
            apply:
              resource.support.apply &&
              counts.get(resource.reference.buffId) === 1 &&
              !globalChildren.has(resource.reference.buffId),
            finish:
              resource.support.finish &&
              counts.get(resource.reference.buffId) === 1 &&
              !globalChildren.has(resource.reference.buffId),
            reasons:
              counts.get(resource.reference.buffId) === 1
                ? globalChildren.has(resource.reference.buffId) &&
                  !resource.support.reasons.some(reason => reason.includes('子镜像'))
                  ? [
                      ...resource.support.reasons,
                      '该 Buff 是 GlobalBuff 子镜像，必须由父实例统一管理共享效果与生命周期。',
                    ]
                  : resource.support.reasons
                : [
                    ...resource.support.reasons,
                    '同 ID 存在多个定义来源，原叠加组不能安全隔离，第一版暂不支持独立施加或结束。',
                  ],
            suppress:
              counts.get(resource.reference.buffId) === 1 &&
              !globalChildren.has(resource.reference.buffId),
            suppressionReasons: [
              ...(counts.get(resource.reference.buffId) === 1
                ? []
                : [
                    '同 ID 存在多个定义来源，第一版无法在所有自然施加链中可靠区分来源，暂不支持抑制。',
                  ]),
              ...(globalChildren.has(resource.reference.buffId)
                ? [
                    '第一版仅支持目标局部抑制，此 Buff 由全局父管理，局部抑制会影响全体共享效果，暂不开放。',
                  ]
                : []),
            ],
          },
        },
  );
}

export function resolveBuffInterventionEntry(
  repository: BuffInterventionCatalogRepository,
  reference: BuffInterventionReference,
): BuffInterventionCatalogEntry | null {
  const browser = repository;
  if (browser.getOperators && browser.getWeapons && browser.getGears && browser.getGearSets) {
    return (
      listBuffInterventionCatalog(
        browser as BuffInterventionCatalogRepository & GameDataBrowser,
      ).find(resource => resource.key === buffInterventionReferenceKey(reference)) ?? null
    );
  }
  const root =
    reference.kind === 'operator'
      ? repository.getOperator(reference.sourceId)
      : reference.kind === 'weapon'
        ? repository.getWeapon(reference.sourceId)
        : reference.kind === 'gear'
          ? repository.getGear(reference.sourceId)
          : reference.kind === 'gearSet'
            ? repository.getGearSet(reference.sourceId)
            : repository.getCommonDefinitionSources().find(item => item.id === reference.sourceId);
  if (!root) return null;
  const resource = entries(source(reference.kind, reference.sourceId, root)).find(
    item => item.key === buffInterventionReferenceKey(reference),
  );
  if (!resource) return null;
  const unavailable = '完整目录枚举不可用，无法证明原 ID 在所有来源中唯一，暂不支持干预。';
  return {
    ...resource,
    support: {
      ...resource.support,
      apply: false,
      finish: false,
      suppress: false,
      reasons: [...resource.support.reasons, unavailable],
      suppressionReasons: [unavailable],
    },
  };
}

/** 导入和运行共用同一用户覆盖边界；不约束游戏动作对黑板的正常动态写入。 */
export function assertBuffInterventionParameters(
  resource: BuffInterventionCatalogEntry,
  parameters: Readonly<Record<string, number>> = {},
): void {
  const allowed = new Map(resource.support.parameters.map(parameter => [parameter.key, parameter]));
  for (const key of Object.keys(parameters)) {
    if (!Object.hasOwn(resource.definition?.blackboard ?? {}, key))
      throw new Error(`本 Buff 未声明的黑板覆盖键：${key}`);
    if (!allowed.has(key)) throw new Error(`未开放的 Buff 参数：${key}`);
  }
  if (resource.support.unboundBlackboardKeys.length)
    throw new Error(
      `独立施加依赖本 Buff 未声明的黑板键 ${resource.support.unboundBlackboardKeys.join('、')}；需由原施加点绑定。`,
    );
  for (const parameter of allowed.values()) {
    const value = Object.hasOwn(parameters, parameter.key)
      ? parameters[parameter.key]
      : parameter.defaultValue;
    if (
      value === undefined ||
      !Number.isFinite(value) ||
      (parameter.minimum !== undefined && value < parameter.minimum) ||
      (parameter.integer && !Number.isSafeInteger(value))
    )
      throw new Error(`Buff 参数 ${parameter.key} 缺失或不符合数值范围。`);
  }
}

export function compileBuffInterventionResource(
  repository: BuffInterventionCatalogRepository,
  reference: BuffInterventionReference,
  parameters: Readonly<Record<string, number>> = {},
): ResolvedSkillBuffDefinition {
  const resource = resolveBuffInterventionEntry(repository, reference);
  if (!resource?.definition) throw new Error('Buff 干预来源或普通 Buff 定义不存在。');
  assertBuffInterventionParameters(resource, parameters);
  if (!resource.support.apply) throw new Error(resource.support.reasons.join(' '));
  if (resource.definition.stackingType === 'timedGrowingEnhance') {
    const duration = resource.definition.durationSeconds;
    const period =
      typeof duration === 'number'
        ? duration
        : duration === undefined
          ? undefined
          : (parameters[duration.blackboardKey] ??
            resource.definition.blackboard?.[duration.blackboardKey]);
    if (typeof period !== 'number' || !Number.isFinite(period) || period <= 0.00001)
      throw new Error('定时增长 Buff 的原生增长周期必须大于 0.00001 秒。');
  }
  const compiled = compileIndependentBuffResource(
    resource.definition,
    reference.buffId,
    repository.actionPrograms,
  );
  return { ...compiled, blackboard: { ...compiled.blackboard, ...parameters } };
}

/** 原定义对象到来源限定引用的多值索引；共享对象也不能被猜成唯一来源。 */
export function indexBuffInterventionDefinitions(
  catalog: readonly BuffInterventionCatalogEntry[],
): ReadonlyMap<SkillBuffDefinition, readonly BuffInterventionReference[]> {
  const result = new Map<SkillBuffDefinition, BuffInterventionReference[]>();
  for (const entry of catalog) {
    if (!entry.definition) continue;
    const references = result.get(entry.definition) ?? [];
    references.push(entry.reference);
    result.set(entry.definition, references);
  }
  return result;
}
