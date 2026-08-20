import type { GameDataBrowser, GameDataRepository } from '../game-data/gameDataRepository';
import type { OperatorDefinition } from '../game-data/operatorDefinition';
import type {
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../game-data/equipmentDefinition';
import type {
  EndaxisProjectDocument,
  ProjectDefinitionLibraryDocument,
  ProjectOperatorTemplateDocument,
  ScenarioDocument,
  TrackDocument,
  TrackIndex,
} from './schema';

export const EMPTY_PROJECT_DEFINITION_LIBRARY: ProjectDefinitionLibraryDocument = Object.freeze({
  operators: Object.freeze({}),
  weapons: Object.freeze({}),
  gears: Object.freeze({}),
  gearSets: Object.freeze({}),
});

export function getProjectDefinitionLibrary(
  project: EndaxisProjectDocument,
): ProjectDefinitionLibraryDocument {
  return project.definitionLibrary ?? EMPTY_PROJECT_DEFINITION_LIBRARY;
}

export type ProjectTemplateKind = 'operator' | 'weapon' | 'gear' | 'gearSet';

function projectTemplateRecords(
  library: ProjectDefinitionLibraryDocument,
  kind: ProjectTemplateKind,
): Readonly<Record<string, unknown>> {
  if (kind === 'operator') return library.operators;
  if (kind === 'weapon') return library.weapons;
  if (kind === 'gear') return library.gears;
  return library.gearSets;
}

/** 从持久化项目库的已有数字身份之后继续分配，不依赖页面生命周期计数器。 */
export function allocateProjectTemplateId(
  library: ProjectDefinitionLibraryDocument,
  kind: ProjectTemplateKind,
): string {
  const prefix = `project:${kind}:`;
  let maximum = 0;
  const records = projectTemplateRecords(library, kind);
  for (const id of Object.keys(records)) {
    if (!id.startsWith(prefix)) continue;
    const suffix = id.slice(prefix.length);
    if (!/^\d+$/.test(suffix)) continue;
    maximum = Math.max(maximum, Number(suffix));
  }
  return `${prefix}${maximum + 1}`;
}

function requireProjectTemplateId(id: string, kind: string): void {
  if (!id.startsWith(`project:${kind}:`) || id.length === `project:${kind}:`.length) {
    throw new Error(`project ${kind} template id '${id}' must use the project:${kind}: namespace`);
  }
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

export interface DeriveOperatorTemplateInput {
  id: string;
  name: string;
  baseTemplateId: string;
  definition: OperatorDefinition;
}

interface DeriveEquipmentTemplateInput<T> {
  id: string;
  name: string;
  baseTemplateId: string;
  definition: T;
}

function deriveEquipmentTemplate<T extends { readonly slug: string }>(
  values: Record<
    string,
    {
      id: string;
      name: string;
      origin?: { templateId: string; gameDataRevision: string };
      definition: T;
    }
  >,
  gameDataRevision: string,
  kind: 'weapon' | 'gear' | 'gearSet',
  input: DeriveEquipmentTemplateInput<T>,
): typeof values {
  requireProjectTemplateId(input.id, kind);
  if (input.name.trim().length === 0)
    throw new Error(`project ${kind} template name must not be empty`);
  if (values[input.id] !== undefined)
    throw new Error(`project ${kind} template '${input.id}' already exists`);
  const definition = clone({
    ...input.definition,
    slug: input.id,
    displayName: input.name.trim(),
    ...(kind === 'gearSet'
      ? {}
      : {
          assetSlug:
            (input.definition as { assetSlug?: string }).assetSlug ?? input.definition.slug,
        }),
  }) as T;
  return {
    ...values,
    [input.id]: {
      id: input.id,
      name: input.name.trim(),
      origin: { templateId: input.baseTemplateId, gameDataRevision },
      definition,
    },
  };
}

export function deriveProjectWeaponTemplateInLibrary(
  library: ProjectDefinitionLibraryDocument,
  gameDataRevision: string,
  input: DeriveEquipmentTemplateInput<WeaponDefinition>,
): ProjectDefinitionLibraryDocument {
  return {
    ...library,
    weapons: deriveEquipmentTemplate(library.weapons, gameDataRevision, 'weapon', input),
  };
}

export function deriveProjectGearTemplateInLibrary(
  library: ProjectDefinitionLibraryDocument,
  gameDataRevision: string,
  input: DeriveEquipmentTemplateInput<GearDefinition>,
): ProjectDefinitionLibraryDocument {
  return {
    ...library,
    gears: deriveEquipmentTemplate(library.gears, gameDataRevision, 'gear', input),
  };
}

export function deriveProjectGearSetTemplateInLibrary(
  library: ProjectDefinitionLibraryDocument,
  gameDataRevision: string,
  input: DeriveEquipmentTemplateInput<GearSetDefinition>,
): ProjectDefinitionLibraryDocument {
  return {
    ...library,
    gearSets: deriveEquipmentTemplate(library.gearSets, gameDataRevision, 'gearSet', input),
  };
}

export function deriveProjectOperatorTemplateInLibrary(
  library: ProjectDefinitionLibraryDocument,
  gameDataRevision: string,
  input: DeriveOperatorTemplateInput,
): ProjectDefinitionLibraryDocument {
  requireProjectTemplateId(input.id, 'operator');
  if (input.name.trim().length === 0)
    throw new Error('project operator template name must not be empty');
  if (library.operators[input.id] !== undefined) {
    throw new Error(`project operator template '${input.id}' already exists`);
  }
  const definition = clone({
    ...input.definition,
    slug: input.id,
    displayName: input.name.trim(),
    assetSlug: input.definition.assetSlug ?? input.definition.slug,
  });
  const template: ProjectOperatorTemplateDocument = {
    id: input.id,
    name: input.name.trim(),
    origin: {
      templateId: input.baseTemplateId,
      gameDataRevision,
    },
    definition,
  };
  return { ...library, operators: { ...library.operators, [input.id]: template } };
}

/** 物化一个完整项目模板；来源仅保留为审计信息，不参与运行时隐式合并。 */
export function deriveProjectOperatorTemplate(
  project: EndaxisProjectDocument,
  input: DeriveOperatorTemplateInput,
): EndaxisProjectDocument {
  return {
    ...project,
    definitionLibrary: deriveProjectOperatorTemplateInLibrary(
      getProjectDefinitionLibrary(project),
      project.gameDataRevision,
      input,
    ),
  };
}

export function deriveProjectWeaponTemplate(
  project: EndaxisProjectDocument,
  input: DeriveEquipmentTemplateInput<WeaponDefinition>,
): EndaxisProjectDocument {
  return {
    ...project,
    definitionLibrary: deriveProjectWeaponTemplateInLibrary(
      getProjectDefinitionLibrary(project),
      project.gameDataRevision,
      input,
    ),
  };
}

export function deriveProjectGearTemplate(
  project: EndaxisProjectDocument,
  input: DeriveEquipmentTemplateInput<GearDefinition>,
): EndaxisProjectDocument {
  return {
    ...project,
    definitionLibrary: deriveProjectGearTemplateInLibrary(
      getProjectDefinitionLibrary(project),
      project.gameDataRevision,
      input,
    ),
  };
}

function collectSkillIdentities(definition: OperatorDefinition): ReadonlySet<string> {
  const identities = new Set<string>();
  for (const group of definition.skillGroups) {
    for (const skill of Array.isArray(group.skills) ? group.skills : [group.skills]) {
      identities.add(`${group.key}\u0000${skill.key}`);
    }
  }
  return identities;
}

/** 派生模板与当前模板结构相同才允许原子切换并保留轴上技能块。 */
export function switchTrackToCompatibleOperatorTemplate(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  previousDefinition: OperatorDefinition,
  nextTemplateId: string,
  nextDefinition: OperatorDefinition,
): ScenarioDocument {
  const track = scenario.tracks[trackIndex];
  if (track?.operator === null || track === null)
    throw new Error(`track ${trackIndex} has no operator`);
  const previousSkills = collectSkillIdentities(previousDefinition);
  const nextSkills = collectSkillIdentities(nextDefinition);
  for (const cast of track.skillCasts) {
    if (cast.source.kind !== 'operatorSkill') continue;
    const identity = `${cast.source.skillGroupKey}\u0000${cast.source.skillKey}`;
    if (!previousSkills.has(identity) || !nextSkills.has(identity)) {
      throw new Error(
        `operator template '${nextTemplateId}' cannot preserve cast '${cast.id}' (${cast.source.skillGroupKey}/${cast.source.skillKey})`,
      );
    }
  }
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = {
    ...track,
    operator: { ...track.operator, operatorSlug: nextTemplateId },
  };
  return { ...scenario, tracks };
}

/** A derived weapon keeps the equipped build while changing only its template identity. */
export function switchTrackToCompatibleWeaponTemplate(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  nextTemplateId: string,
  nextDefinition: WeaponDefinition,
): ScenarioDocument {
  const track = scenario.tracks[trackIndex];
  if (track?.weapon === null || track === null)
    throw new Error(`track ${trackIndex} has no weapon`);
  if (track.weapon.traitLevels.length !== nextDefinition.traits.length) {
    throw new Error(
      `weapon template '${nextTemplateId}' cannot preserve ${track.weapon.traitLevels.length} trait levels with ${nextDefinition.traits.length} traits`,
    );
  }
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = {
    ...track,
    weapon: { ...track.weapon, weaponSlug: nextTemplateId },
  };
  return { ...scenario, tracks };
}

/** Replace one materialized weapon definition and keep every referencing build structurally valid. */
export function replaceProjectWeaponTemplateDefinition(
  project: EndaxisProjectDocument,
  templateId: string,
  definition: WeaponDefinition,
): EndaxisProjectDocument {
  const library = getProjectDefinitionLibrary(project);
  const template = library.weapons[templateId];
  if (template === undefined) throw new Error(`missing project weapon template '${templateId}'`);
  if (definition.slug !== templateId) {
    throw new Error(
      `project weapon definition slug '${definition.slug}' does not match template '${templateId}'`,
    );
  }

  const nextDefinition = clone(definition);
  return {
    ...project,
    definitionLibrary: {
      ...library,
      weapons: {
        ...library.weapons,
        [templateId]: {
          ...template,
          name: definition.displayName?.trim() || template.name,
          definition: nextDefinition,
        },
      },
    },
    scenarios: project.scenarios.map(scenario => ({
      ...scenario,
      tracks: scenario.tracks.map(track => {
        if (track?.weapon?.weaponSlug !== templateId) return track;
        return {
          ...track,
          weapon: {
            ...track.weapon,
            traitLevels: nextDefinition.traits.map((trait, index) =>
              Math.min(Math.max(track.weapon?.traitLevels[index] ?? 1, 1), trait.levelCount),
            ),
          },
        };
      }) as ScenarioDocument['tracks'],
    })),
  };
}

/** A derived gear template preserves the selected slot and its artificing state. */
export function switchTrackToCompatibleGearTemplate(
  scenario: ScenarioDocument,
  trackIndex: TrackIndex,
  slot: keyof TrackDocument['gears'],
  nextTemplateId: string,
  nextDefinition: GearDefinition,
): ScenarioDocument {
  const track = scenario.tracks[trackIndex];
  const gear = track?.gears[slot];
  if (track === null || gear == null)
    throw new Error(`track ${trackIndex} slot '${slot}' has no gear`);
  if (gear.artificingLevels.length !== nextDefinition.traits.length) {
    throw new Error(
      `gear template '${nextTemplateId}' cannot preserve ${gear.artificingLevels.length} artificing levels with ${nextDefinition.traits.length} traits`,
    );
  }
  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  tracks[trackIndex] = {
    ...track,
    gears: { ...track.gears, [slot]: { ...gear, gearSlug: nextTemplateId } },
  };
  return { ...scenario, tracks };
}

/** Replace one materialized gear definition and normalize every referencing slot. */
export function replaceProjectGearTemplateDefinition(
  project: EndaxisProjectDocument,
  templateId: string,
  definition: GearDefinition,
): EndaxisProjectDocument {
  const library = getProjectDefinitionLibrary(project);
  const template = library.gears[templateId];
  if (template === undefined) throw new Error(`missing project gear template '${templateId}'`);
  if (definition.slug !== templateId) {
    throw new Error(
      `project gear definition slug '${definition.slug}' does not match template '${templateId}'`,
    );
  }
  const nextDefinition = clone(definition);
  const slots = ['armor', 'gloves', 'accessory1', 'accessory2'] as const;
  return {
    ...project,
    definitionLibrary: {
      ...library,
      gears: {
        ...library.gears,
        [templateId]: {
          ...template,
          name: definition.displayName?.trim() || template.name,
          definition: nextDefinition,
        },
      },
    },
    scenarios: project.scenarios.map(scenario => ({
      ...scenario,
      tracks: scenario.tracks.map(track => {
        if (track === null) return track;
        let changed = false;
        const gears = { ...track.gears };
        for (const slot of slots) {
          const gear = track.gears[slot];
          if (gear?.gearSlug !== templateId) continue;
          changed = true;
          gears[slot] = {
            ...gear,
            artificingLevels: nextDefinition.traits.map((trait, index) =>
              Math.min(Math.max(gear.artificingLevels[index] ?? 0, 0), trait.levelCount - 1),
            ),
          };
        }
        return changed ? { ...track, gears } : track;
      }) as ScenarioDocument['tracks'],
    })),
  };
}

export type ProjectGameData = GameDataRepository & GameDataBrowser;

export function createProjectGameDataIndex(
  base: GameDataRepository,
  library: ProjectDefinitionLibraryDocument,
): GameDataRepository {
  const operators = new Map(
    Object.values(library.operators).map(value => [value.definition.slug, value.definition]),
  );
  const weapons = new Map(
    Object.values(library.weapons).map(value => [value.definition.slug, value.definition]),
  );
  const gears = new Map(
    Object.values(library.gears).map(value => [value.definition.slug, value.definition]),
  );
  const gearSets = new Map(
    Object.values(library.gearSets).map(value => [value.definition.slug, value.definition]),
  );
  for (const [id] of operators) {
    if (base.getOperator(id) !== null)
      throw new Error(`project operator template '${id}' conflicts with built-in data`);
  }
  for (const [id] of weapons) {
    if (base.getWeapon(id) !== null)
      throw new Error(`project weapon template '${id}' conflicts with built-in data`);
  }
  for (const [id] of gears) {
    if (base.getGear(id) !== null)
      throw new Error(`project gear template '${id}' conflicts with built-in data`);
  }
  for (const [id] of gearSets) {
    if (base.getGearSet(id) !== null)
      throw new Error(`project gear set template '${id}' conflicts with built-in data`);
  }
  return {
    ...base,
    getOperator: id => operators.get(id) ?? base.getOperator(id),
    getWeapon: id => weapons.get(id) ?? base.getWeapon(id),
    getGear: id => gears.get(id) ?? base.getGear(id),
    getGearSet: id => gearSets.get(id) ?? base.getGearSet(id),
  };
}

/** 把项目模板与只读版本化仓库合成为选择器、编译器和模拟共用的查询视图。 */
export function createProjectGameDataRepository(
  base: ProjectGameData,
  library: ProjectDefinitionLibraryDocument,
): ProjectGameData {
  const operators = Object.values(library.operators).map(value => value.definition);
  const weapons = Object.values(library.weapons).map(value => value.definition);
  const gears = Object.values(library.gears).map(value => value.definition);
  const gearSets = Object.values(library.gearSets).map(value => value.definition);

  const index = createProjectGameDataIndex(base, library);
  return {
    ...index,
    getOperators: () => [...base.getOperators(), ...operators],
    getWeapons: () => [...base.getWeapons(), ...weapons],
    getGears: () => [...base.getGears(), ...gears],
    getGearSets: () => [...base.getGearSets(), ...gearSets],
    getEnemies: () => base.getEnemies(),
  };
}

export type ProjectTemplateDefinition =
  OperatorDefinition | WeaponDefinition | GearDefinition | GearSetDefinition;
