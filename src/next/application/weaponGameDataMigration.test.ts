import { describe, expect, it } from 'vitest';
import { createEmptyProject, createEmptyScenario } from '../core/project/createProject';
import type { TrackDocument } from '../core/project/schema';
import { generatedWeaponDefinitions } from '../data/equipment/generated-weapons/index.generated';
import { registerGeneratedWeaponDefinitions } from '../data/equipment/generatedWeaponRegistration';
import { sharedWeaponDefinitions } from '../data/equipment/sharedEquipmentDefinitions';
import { createGameDataRepository, nextGameDataRepository } from '../data/gameDataRepository';
import { skillSettings } from '../data/combat/skillSettings';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';
import { openProject } from './openProject';
import { createWeaponGameDataMigrator } from './weaponGameDataMigration';

const registration = registerGeneratedWeaponDefinitions(
  generatedWeaponDefinitions,
  sharedWeaponDefinitions,
);
const source = createGameDataRepository({
  revision: 'weapons:legacy',
  operators: nextGameDataRepository.getOperators(),
  weapons: sharedWeaponDefinitions,
});
const target = createGameDataRepository({
  revision: 'weapons:generated',
  operators: nextGameDataRepository.getOperators(),
  weapons: registration.definitions,
  commonBuffDefinitions: nextGameDataRepository.getCommonBuffDefinitions?.(),
  commonAbilityEntityDefinitions: nextGameDataRepository.getCommonAbilityEntityDefinitions?.(),
});
// 仅用于验证显式选择的测试输入，不是产品默认，更不是原生规则。
const addedTraitLevels = {
  wpn_funnel_0012: { skill2: 4 },
  wpn_funnel_0013: { skill2: 4 },
  wpn_funnel_0016: { skill3: 4 },
  wpn_claym_0006: { skill3: 4 },
  wpn_lance_0016: { skill2: 4 },
};
// 旧三星定义把第二条攻击词条标成 skill3；新定义按真实技能列表保存为 skill2。
const traitKeyAliases: Record<string, Record<string, string>> = Object.fromEntries(
  ['jiminy-12', 'darhoff-7', 'peco-5', 'opero-77', 'tarr-11'].map(slug => [
    registration.aliases[slug]!,
    { skill3: 'skill2' },
  ]),
);
const options = {
  source,
  target,
  aliases: registration.aliases,
  addedTraitLevels,
  traitKeyAliases,
};

function projectFor(slug: string) {
  const project = createEmptyProject({ createdWith: 'test', gameDataRevision: source.revision });
  const definition = source.getWeapon(slug)!;
  const track: TrackDocument = {
    id: 'track:stable',
    operator: null,
    weapon: {
      weaponSlug: slug,
      level: 90,
      tuned: true,
      potential: 3,
      traitLevels: definition.traits.map((_, index) => [2, 7, 5][index]!),
    },
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  project.scenarios[0]!.tracks[0] = track;
  return project;
}

describe('explicit weapon game-data migration', () => {
  it.each(['jiminy-12', 'darhoff-7', 'peco-5', 'opero-77', 'tarr-11'])(
    '%s explicit rename keeps the same static modifier role, not a positional guess',
    slug => {
      const oldDefinition = source.getWeapon(slug)!;
      const newDefinition = target.getWeapon(registration.aliases[slug]!)!;
      const oldTrait = oldDefinition.traits.find(trait => trait.key === 'skill3')!;
      const newTrait = newDefinition.traits.find(trait => trait.key === 'skill2')!;
      const role = (modifiers: typeof oldTrait.modifiers) =>
        modifiers?.map(({ value: _value, ...identity }) => identity);
      expect(role(oldTrait.modifiers)).toEqual([{ kind: 'panelStat', stat: 'attackFlat' }]);
      expect(role(newTrait.modifiers)).toEqual(role(oldTrait.modifiers));
      // 新表保留未舍入逐级值；只迁移等级，不复制旧数值覆盖原生数据。
      expect(newTrait.levelCount).toBe(oldTrait.levelCount);
    },
  );

  it('keeps placed skill identities and real times while the migrated project still simulates', async () => {
    const project = projectFor('freedom-to-proselytize');
    const operator = source.getOperator('perlica')!;
    project.scenarios[0]!.tracks[0]!.operator = {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: Object.fromEntries(operator.skillGroups.map(group => [group.key, 12])),
      talentStates: Object.fromEntries(operator.talents.map((_, index) => [index, 0])),
    };
    let id = 0;
    project.scenarios[0] = placeSkillGroup({
      scenario: project.scenarios[0]!,
      trackIndex: 0,
      operator,
      skillGroupKey: 'battleSkill',
      startFrame: 123,
      ids: { allocate: kind => `${kind}:migration:${id++}` },
    }).scenario;
    const before = structuredClone(project);
    const result = createWeaponGameDataMigrator(options).migrate(project);
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.value.scenarios[0]!.tracks[0]!.skillCasts).toEqual(
      before.scenarios[0]!.tracks[0]!.skillCasts,
    );
    expect(result.value.scenarios[0]!.tracks[0]!.weapon!.traitLevels).toEqual([2, 4, 7]);
    const simulation = await new ScenarioSimulationService({
      index: target,
      repositoryRevision: target.revision,
      spellInflictionSettings: skillSettings,
      resources: {
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecoveryPauseDuration: 1.5,
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
      },
    }).simulate(result.value.scenarios[0]!, 600);
    expect(simulation.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
    expect(simulation.finalEnemyHealth).toBeLessThan(simulation.enemyVitals.initialHealth);
    expect(project).toEqual(before);
  });

  it('rejects source corruption and same-revision migrations', () => {
    expect(() => createWeaponGameDataMigrator({ ...options, target: source })).toThrow(
      'distinct revisions',
    );
    const project = projectFor('freedom-to-proselytize');
    project.scenarios[0]!.tracks[0]!.weapon!.traitLevels = [2];
    expect(createWeaponGameDataMigrator(options).migrate(project).ok).toBe(false);
  });

  it('snapshots explicit choices instead of reading mutable caller policy at migration time', () => {
    const mutableOptions = {
      ...options,
      aliases: { ...options.aliases },
      addedTraitLevels: structuredClone(addedTraitLevels),
    };
    const migrator = createWeaponGameDataMigrator(mutableOptions);
    mutableOptions.aliases['freedom-to-proselytize'] = 'missing';
    mutableOptions.addedTraitLevels.wpn_funnel_0012.skill2 = 9;
    const result = migrator.migrate(projectFor('freedom-to-proselytize'));
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.value.scenarios[0]!.tracks[0]!.weapon!.traitLevels).toEqual([2, 4, 7]);
  });

  it.each(sharedWeaponDefinitions)('migrates real $slug by stable trait identity', definition => {
    const original = projectFor(definition.slug);
    const before = structuredClone(original);
    const migrator = createWeaponGameDataMigrator(options);
    const opened = openProject(original, {
      gameDataRepository: target,
      gameDataMigrationResolver: { findMigration: () => migrator },
    });
    expect(opened.kind).toBe('game-data-migration-available');
    const result = migrator.migrate(original);
    if (!result.ok) throw new Error(result.errors.join('\n'));
    const oldInstance = original.scenarios[0]!.tracks[0]!.weapon!;
    const nextInstance = result.value.scenarios[0]!.tracks[0]!.weapon!;
    const nextDefinition = target.getWeapon(nextInstance.weaponSlug)!;
    definition.traits.forEach((trait, index) => {
      const nextKey = traitKeyAliases[nextInstance.weaponSlug]?.[trait.key] ?? trait.key;
      expect(
        nextInstance.traitLevels[nextDefinition.traits.findIndex(next => next.key === nextKey)],
      ).toBe(oldInstance.traitLevels[index]);
    });
    expect(result.warnings).toHaveLength(nextDefinition.traits.length - definition.traits.length);
    expect(openProject(result.value, { gameDataRepository: target }).kind).toBe('opened');
    expect(original).toEqual(before);
    expect(nextInstance).toMatchObject({ level: 90, tuned: true, potential: 3 });
    expect(result.value.scenarios[0]!.tracks[0]!.id).toBe('track:stable');
    expect(migrator.migrate(result.value).ok).toBe(false);
  });

  it('reports all missing choices and never returns a half-migrated project', () => {
    const project = projectFor('freedom-to-proselytize');
    const other = createEmptyScenario('other', 'other');
    other.tracks[0] = projectFor('former-finery').scenarios[0]!.tracks[0];
    project.scenarios.push(other);
    const before = structuredClone(project);
    const result = createWeaponGameDataMigrator({
      ...options,
      addedTraitLevels: undefined,
    }).migrate(project);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('expected explicit choices');
    expect(result.errors).toEqual([
      "$.scenarios[0].tracks[0].weapon.traitLevels[1]: added trait 'skill2' requires an explicit level",
      "$.scenarios[1].tracks[0].weapon.traitLevels[2]: added trait 'skill3' requires an explicit level",
    ]);
    expect(project).toEqual(before);
    expect(result).not.toHaveProperty('value');
  });

  it('keeps custom materialized templates and their historical origin intact', () => {
    const project = projectFor('freedom-to-proselytize');
    const customId = 'project:weapon:custom';
    project.definitionLibrary!.weapons[customId] = {
      id: customId,
      name: 'custom',
      origin: { templateId: 'freedom-to-proselytize', gameDataRevision: source.revision },
      definition: {
        ...structuredClone(source.getWeapon('freedom-to-proselytize')!),
        slug: customId,
      },
    };
    project.scenarios[0]!.tracks[0]!.weapon!.weaponSlug = customId;
    const result = createWeaponGameDataMigrator({
      ...options,
      addedTraitLevels: undefined,
    }).migrate(project);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.value.definitionLibrary).toEqual(project.definitionLibrary);
    expect(result.value.scenarios).toEqual(project.scenarios);
    expect(result.warnings).toEqual([]);
    expect(result.value).not.toBe(project);
  });

  it('rejects missing destination definitions and preserves the source document', () => {
    const project = projectFor('freedom-to-proselytize');
    const result = createWeaponGameDataMigrator({
      ...options,
      aliases: { ...options.aliases, 'freedom-to-proselytize': 'missing' },
    }).migrate(project);
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty('value');
    expect(project.gameDataRevision).toBe(source.revision);
  });
});
