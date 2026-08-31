/**
 * 旧版时间轴项目到 Next 项目文档的显式迁移器。
 *
 * 旧文件中的命中、Buff、面板和伤害结果都是旧模拟器的派生快照，迁移时一律丢弃；这里只
 * 搬运用户输入：养成、配装、场景参数、技能身份和放置帧。游戏数据仓库只负责解析稳定身份，
 * 不能为旧文件补当前编辑器默认值。
 */
import type { GameDataRepository } from '../../core/game-data/gameDataRepository';
import type {
  SkillDefinition,
  SkillGroupDefinition,
} from '../../core/game-data/operatorDefinition';
import type { LegacyProjectImporter, LegacyMigrationResult } from '../../core/project/migration';
import { compileOperatorDefinitionSkills } from '../../core/compiler/compileScenarioTimeline';
import {
  ENEMY_EDITABLE_FIELDS,
  PROJECT_FPS,
  PROJECT_KIND,
  PROJECT_SCHEMA_VERSION,
  type EndaxisProjectDocument,
  type GearInstanceDocument,
  type OperatorInstanceDocument,
  type ScenarioDocument,
  type SkillCastDocument,
  type TrackDocument,
  type TrackListDocument,
  type WeaponInstanceDocument,
} from '../../core/project/schema';

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function records(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.map(record).filter(value => value !== null) : [];
}

function string(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function number(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function integer(value: unknown): number | null {
  const parsed = number(value);
  return parsed !== null && Number.isInteger(parsed) ? parsed : null;
}

function boolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function numericRecord(value: unknown): Record<string, number> {
  const source = record(value);
  if (source === null) return {};
  return Object.fromEntries(
    Object.entries(source).filter((entry): entry is [string, number] => number(entry[1]) !== null),
  );
}

function indexById(values: unknown): Map<string, UnknownRecord> {
  return new Map(
    records(values).flatMap(value => {
      const id = string(value.id);
      return id === null ? [] : [[id, value] as const];
    }),
  );
}

function orderedGroupSkills(group: SkillGroupDefinition): readonly SkillDefinition[] {
  return Array.isArray(group.skills) ? group.skills : [group.skills as SkillDefinition];
}

/**
 * replacementSkills 是同一稳定输入在运行时换槽后的执行体，项目不能直接引用。
 * 旧版拆段动作仍各自代表一次玩家输入，所以每段都引用基础输入；只有基础技能链数组才按段号选键。
 */
function resolveLegacySkillSource(
  repository: GameDataRepository,
  operatorSlug: string,
  action: UnknownRecord,
): SkillCastDocument['source'] | null {
  const operator = repository.getOperator(operatorSlug);
  if (operator === null) return null;
  const groupKey = string(action.sourceSkillKey) ?? string(action.type) ?? string(action.skillId);
  if (groupKey === null) return null;
  const group = operator.skillGroups.find(candidate => candidate.key === groupKey);
  if (group === undefined) return null;
  const skills = orderedGroupSkills(group);
  const segmentIndex = integer(action.segmentIndex);
  const selected = segmentIndex !== null && skills.length > 1 ? skills[segmentIndex - 1] : skills[0];
  return selected === undefined
    ? null
    : { kind: 'operatorSkill', skillGroupKey: group.key, skillKey: selected.key };
}

function migrateOperator(source: UnknownRecord, operatorSlug: string): OperatorInstanceDocument {
  return {
    operatorSlug,
    level: integer(source.level) ?? 1,
    promoted: boolean(source.promoted) ?? false,
    potential: integer(source.potential) ?? 0,
    trustLevel: integer(source.trustLevel) ?? 0,
    skillLevels: numericRecord(source.skillLevels),
    talentStates: numericRecord(source.talentStates),
  };
}

function resolveFullUltimateEnergy(
  repository: GameDataRepository,
  operator: OperatorInstanceDocument,
): number | null {
  const definition = repository.getOperator(operator.operatorSlug);
  if (definition === null) return null;
  const costs = new Set(
    compileOperatorDefinitionSkills(
      `legacy-migration:${operator.operatorSlug}`,
      operator,
      definition,
      repository.getCommonAbilityEntityDefinitions?.(),
    ).flatMap(skill =>
      skill.skillType === 'ultimate'
        ? skill.costs.filter(cost => cost.resource === 'ultimateEnergy').map(cost => cost.value)
        : [],
    ),
  );
  return costs.size === 1 ? costs.values().next().value! : null;
}

function migrateWeapon(
  repository: GameDataRepository,
  source: UnknownRecord | undefined,
): WeaponInstanceDocument | null {
  if (source === undefined) return null;
  const weaponSlug = string(source.weaponSlug);
  if (weaponSlug === null) return null;
  const definition = repository.getWeapon(weaponSlug);
  if (definition === null) return null;
  const legacyLevels = [source.skill1Level, source.skill2Level, source.skill3Level]
    .map(integer)
    .filter((value): value is number => value !== null);
  if (legacyLevels.length < definition.traits.length) return null;
  return {
    weaponSlug,
    level: integer(source.level) ?? 1,
    tuned: boolean(source.tuned) ?? false,
    potential: integer(source.potential) ?? 0,
    traitLevels: legacyLevels.slice(0, definition.traits.length),
  };
}

function migrateGear(
  repository: GameDataRepository,
  source: UnknownRecord | undefined,
): GearInstanceDocument | null {
  if (source === undefined) return null;
  const gearSlug = string(source.gearPieceId);
  if (gearSlug === null) return null;
  const definition = repository.getGear(gearSlug);
  if (definition === null) return null;
  const levels = Array.isArray(source.artificingLevels)
    ? source.artificingLevels.map(integer).filter((value): value is number => value !== null)
    : [];
  // 旧版实例固定保存四格，但旧模拟只按 skill1..3 的实际槽位消费前三格；第四格从未对应
  // GearDefinition trait。不可精锻装备保存空数组，等价于每个现有 trait 使用基础档 0。
  if (levels.length > 0 && levels.length < definition.traits.length) return null;
  return {
    gearSlug,
    artificingLevels:
      levels.length === 0
        ? definition.traits.map(() => 0)
        : levels.slice(0, definition.traits.length),
  };
}

function migrateTrack(
  repository: GameDataRepository,
  scenarioId: string,
  trackIndex: number,
  source: UnknownRecord,
  operators: ReadonlyMap<string, UnknownRecord>,
  weapons: ReadonlyMap<string, UnknownRecord>,
  gears: ReadonlyMap<string, UnknownRecord>,
  initialGaugeMode: string | null,
  warnings: string[],
): TrackDocument | null {
  const operatorSlug = string(source.id);
  const operatorSource = operators.get(string(source.operatorInstanceId) ?? '');
  if (operatorSlug === null || operatorSource === undefined || repository.getOperator(operatorSlug) === null) {
    warnings.push(`${scenarioId}: track ${trackIndex + 1} has an unresolved operator and was left empty`);
    return null;
  }

  const skillCasts = records(source.actions).flatMap((action, actionIndex) => {
    const skillSource = resolveLegacySkillSource(repository, operatorSlug, action);
    const startFrame = integer(action.startTime) ?? integer(action.logicalStartTime);
    if (skillSource === null || startFrame === null) {
      warnings.push(
        `${scenarioId}: ${operatorSlug} action ${actionIndex + 1} has no stable Next skill identity and was omitted`,
      );
      return [];
    }
    return [{
      id: `legacy:${scenarioId}:track:${trackIndex}:cast:${actionIndex}`,
      source: skillSource,
      placement: { startFrame },
    } satisfies SkillCastDocument];
  });

  const weapon = migrateWeapon(repository, weapons.get(string(source.weaponInstanceId) ?? ''));
  if (source.weaponInstanceId !== null && source.weaponInstanceId !== undefined && weapon === null) {
    warnings.push(`${scenarioId}: ${operatorSlug} weapon could not be migrated`);
  }
  const migrateGearSlot = (field: string): GearInstanceDocument | null => {
    const id = string(source[field]);
    const migrated = migrateGear(repository, id === null ? undefined : gears.get(id));
    if (id !== null && migrated === null) warnings.push(`${scenarioId}: ${operatorSlug} ${field} could not be migrated`);
    return migrated;
  };

  const operator = migrateOperator(operatorSource, operatorSlug);
  const storedInitialEnergy = number(source.initialGauge) ?? 0;
  const initialUltimateEnergy =
    initialGaugeMode === 'full'
      ? (resolveFullUltimateEnergy(repository, operator) ?? storedInitialEnergy)
      : initialGaugeMode === 'empty'
        ? 0
        : storedInitialEnergy;

  return {
    id: `legacy:${scenarioId}:track:${trackIndex}:${operatorSlug}`,
    operator,
    weapon,
    gears: {
      armor: migrateGearSlot('equipArmorInstanceId'),
      gloves: migrateGearSlot('equipGlovesInstanceId'),
      accessory1: migrateGearSlot('equipAccessory1InstanceId'),
      accessory2: migrateGearSlot('equipAccessory2InstanceId'),
    },
    initialState: {
      ultimateEnergy: initialUltimateEnergy,
      ...(number(source.maxGaugeOverride) === null
        ? {}
        : { maxUltimateEnergyOverride: number(source.maxGaugeOverride)! }),
    },
    skillCasts,
  };
}

function migrateScenario(
  repository: GameDataRepository,
  wrapper: UnknownRecord,
  scenarioIndex: number,
  warnings: string[],
): ScenarioDocument | null {
  const source = record(wrapper.data);
  if (source === null) return null;
  const scenarioId = string(wrapper.id) ?? `legacy-scenario-${scenarioIndex + 1}`;
  const operators = indexById(source.operators);
  const weapons = indexById(source.weapons);
  const gears = indexById(source.gears);
  const initialMode = string(source.initialGaugeMode);
  const tracks = records(source.tracks).slice(0, 4).map((track, trackIndex) =>
    migrateTrack(
      repository,
      scenarioId,
      trackIndex,
      track,
      operators,
      weapons,
      gears,
      initialMode,
      warnings,
    ),
  );
  while (tracks.length < 4) tracks.push(null);

  const constants = record(source.systemConstants) ?? {};
  const enemyId = string(source.activeEnemyId);
  const enemyDefinition = enemyId === null ? null : repository.getEnemy(enemyId);
  const staggerNodeCount = Math.max(0, integer(constants.staggerNodeCount) ?? 0);
  const knotThresholds = Array.from(
    { length: staggerNodeCount },
    (_, index) => (index + 1) / (staggerNodeCount + 1),
  );
  const resistance = numericRecord(constants.resistance);
  const enemyLevel = integer(source.activeEnemyLevel) ?? 90;
  const customInitialGauges = numericRecord(source.customInitialGauges);

  if (records(source.connections).length > 0) {
    warnings.push(`${scenarioId}: legacy connections were omitted because their hit identities are derived snapshots`);
  }

  return {
    id: scenarioId,
    name: string(wrapper.name) ?? `Legacy scenario ${scenarioIndex + 1}`,
    tracks: tracks as TrackListDocument,
    connections: [],
    enemy: {
      source:
        enemyDefinition === null || enemyId === null
          ? { kind: 'custom', level: enemyLevel }
          : { kind: 'prefab', enemyId, level: enemyLevel },
      rank: enemyDefinition?.rank ?? 'mob',
      editable: {
        hp: number(constants.enemyHp) ?? 100000,
        defense: number(constants.def) ?? 100,
        superArmor: number(constants.superArmor) ?? 0,
        finisherMultiplier: number(constants.finisherMultiplier) ?? 1,
        resistances: resistance,
        stagger: {
          maximum: number(constants.maxStagger) ?? 300,
          knotThresholds,
          knotBreakDurationFrames: integer(constants.staggerNodeDuration) ?? 60,
          brokenDurationFrames: integer(constants.staggerBreakDuration) ?? 300,
          finisherSpRecovery: number(constants.executionRecovery) ?? 100,
        },
      },
      edited: [...ENEMY_EDITABLE_FIELDS],
    },
    battle: {
      prepFrames: integer(source.prepDuration) ?? 0,
      durationFrames: integer(source.battleDuration) ?? 3600,
      ...((integer(source.simulationStartline) ?? integer(source.simulationEndline)) === null
        ? {}
        : {
            simulationRange: {
              ...(integer(source.simulationStartline) === null
                ? {}
                : { startFrame: integer(source.simulationStartline)! }),
              ...(integer(source.simulationEndline) === null
                ? {}
                : { endFrame: integer(source.simulationEndline)! }),
            },
          }),
      resourceRules: {
        maxSp: number(constants.maxSp) ?? 300,
        initialSp: number(constants.initialSp) ?? 300,
        spRecoveryPerSecond: number(constants.spRegenRate) ?? 0,
        defaultSkillSpCost: number(constants.skillSpCostDefault) ?? 100,
      },
      cycleBoundaries: records(source.cycleBoundaries).flatMap((boundary, index) => {
        const frame = integer(boundary.time);
        return frame === null ? [] : [{ id: string(boundary.id) ?? `legacy-cycle-${index}`, frame }];
      }),
      controlSwitches: records(source.switchEvents).flatMap((event, index) => {
        const frame = integer(event.time);
        const trackIndex = integer(event.trackIndex);
        return frame === null || trackIndex === null || trackIndex < 0 || trackIndex > 3
          ? []
          : [{ id: string(event.id) ?? `legacy-switch-${index}`, frame, trackIndex: trackIndex as 0 | 1 | 2 | 3 }];
      }),
      externalEventMarkers: [],
    },
    mechanics: { selections: [] },
    globalConfig: { modifiers: [] },
    editor: {
      trackHeightWeights: (() => {
        const values = Array.isArray(source.trackRowHeightWeights)
          ? source.trackRowHeightWeights.map(number)
          : [];
        return values.length === 4 && values.every(value => value !== null && value > 0)
          ? (values as [number, number, number, number])
          : [1, 1, 1, 1];
      })(),
      prepExpanded: boolean(source.prepExpanded) ?? true,
      initialUltimateEnergyPreset: {
        mode: initialMode === 'full' || initialMode === 'custom' ? initialMode : 'empty',
        customByTrackId: Object.fromEntries(
          (tracks as TrackListDocument).flatMap(track =>
            track === null ? [] : [[track.id, customInitialGauges[track.operator!.operatorSlug] ?? track.initialState.ultimateEnergy]],
          ),
        ),
      },
    },
  };
}

/** 创建只依赖显式只读游戏数据端口的旧项目迁移器。 */
export function createLegacyProjectImporter(repository: GameDataRepository): LegacyProjectImporter {
  return {
    migrate(input: unknown): LegacyMigrationResult {
      const root = record(input);
      if (root === null) return { ok: false, errors: ['legacy project root must be an object'] };
      const warnings: string[] = [];
      const scenarios = records(root.scenarioList).flatMap((scenario, index) => {
        const migrated = migrateScenario(repository, scenario, index, warnings);
        return migrated === null ? [] : [migrated];
      });
      if (scenarios.length === 0) return { ok: false, errors: ['legacy project has no migratable scenarios'] };
      const project: EndaxisProjectDocument = {
        kind: PROJECT_KIND,
        schemaVersion: PROJECT_SCHEMA_VERSION,
        createdWith: 'Endaxis legacy importer',
        gameDataRevision: repository.revision,
        fps: PROJECT_FPS,
        activeScenarioId: scenarios[0]!.id,
        definitionLibrary: { operators: {}, weapons: {}, gears: {}, gearSets: {} },
        scenarios,
      };
      return { ok: true, value: project, warnings };
    },
  };
}
