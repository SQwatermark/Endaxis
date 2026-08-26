import { describe, expect, it, vi } from 'vitest';
import { createEmptyProject, createEmptyScenario } from '../core/project/createProject';
import type { EndaxisProjectDocument, TrackDocument } from '../core/project/schema';
import { generatedWeaponDefinitions } from '../data/equipment/generated-weapons/index.generated';
import { registerGeneratedWeaponDefinitions } from '../data/equipment/generatedWeaponRegistration';
import { weaponV1MigrationSource as source } from '../data/gameDataRepository';
import { openProject } from './openProject';
import type { WeaponInstanceTraitLevelSelection } from './weaponGameDataMigration';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';
import { skillSettings } from '../data/combat/skillSettings';
import { prepareWeaponMigrationReview, type WeaponMigrationBackup } from './weaponMigrationReview';

const registration = registerGeneratedWeaponDefinitions(
  generatedWeaponDefinitions,
  source.getWeapons(),
);
const definitions = new Map(
  registration.definitions.map(definition => [definition.slug, definition]),
);
const target = {
  ...source,
  revision: 'test:review-generated-weapons',
  getWeapon: (slug: string) => definitions.get(slug) ?? null,
};
const options = {
  source,
  target,
  aliases: registration.aliases,
  // 已有迁移证据中的显式改键；不是运行机制特判。
  traitKeyAliases: Object.fromEntries(
    ['jiminy-12', 'darhoff-7', 'peco-5', 'opero-77', 'tarr-11'].map(slug => [
      registration.aliases[slug]!,
      { skill3: 'skill2' },
    ]),
  ),
};

function projectFor(slug = 'freedom-to-proselytize') {
  const project = createEmptyProject({ createdWith: 'test', gameDataRevision: source.revision });
  const track: TrackDocument = {
    id: 'track:stable',
    operator: null,
    weapon: {
      weaponSlug: slug,
      level: 90,
      tuned: true,
      potential: 3,
      traitLevels: source.getWeapon(slug)!.traits.map((_, index) => index + 2),
    },
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  project.scenarios[0]!.tracks[0] = track;
  return project;
}

function prepare(project = projectFor(), settings = options) {
  const prepared = prepareWeaponMigrationReview(project, settings);
  if (!prepared.ok) throw new Error(prepared.errors.join('\n'));
  return prepared.review;
}

function selection(project: EndaxisProjectDocument, level = 4) {
  return [
    { scenarioId: project.scenarios[0]!.id, trackId: 'track:stable', levels: { skill2: level } },
  ];
}

function input(project: EndaxisProjectDocument) {
  return {
    confirmed: true,
    choices: selection(project),
    getCurrentProject: () => project,
    persistBackup: vi.fn(async (_backup: WeaponMigrationBackup) => ({ ok: true as const })),
  };
}

describe('weapon migration review and backup boundary', () => {
  it('preserves actual timeline placements and produces damage after confirmed migration', async () => {
    const project = projectFor();
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
      skillGroupKey: 'battleSkill',
      startFrame: 60,
      operator,
      ids: { allocate: kind => `${kind}:review:${id++}` },
    }).scenario;
    const result = await prepare(project).confirm(input(project));
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.value.scenarios[0]!.tracks[0]!.skillCasts).toEqual(
      project.scenarios[0]!.tracks[0]!.skillCasts,
    );
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
  });
  it('previews saved, renamed and missing levels without choosing or writing anything', () => {
    const project = projectFor();
    const before = structuredClone(project);
    const review = prepare(project);
    expect(review.preview.instances[0]).toMatchObject({
      sourceSlug: 'freedom-to-proselytize',
      targetSlug: registration.aliases['freedom-to-proselytize'],
      traits: [
        { key: 'skill1', sourceKey: 'skill1', savedLevel: 2 },
        { key: 'skill2', levelCount: 9 },
        { key: 'skill3', sourceKey: 'skill3', savedLevel: 3 },
      ],
    });
    expect(review.preview.instances[0]!.traits[1]).not.toHaveProperty('savedLevel');
    const renamed = prepare(projectFor('jiminy-12')).preview.instances[0]!.traits;
    expect(renamed[1]).toMatchObject({ key: 'skill2', sourceKey: 'skill3', savedLevel: 3 });
    expect(project).toEqual(before);
  });

  it.each(source.getWeapons().map(weapon => weapon.slug))(
    '%s backs up and opens after explicit per-instance choices',
    async slug => {
      const project = projectFor(slug);
      const before = structuredClone(project);
      const review = prepare(project);
      const confirm = input(project);
      const instance = review.preview.instances[0]!;
      const choices = [
        {
          scenarioId: instance.scenarioId,
          trackId: instance.trackId,
          levels: Object.fromEntries(
            instance.traits
              .filter(trait => trait.sourceKey === undefined)
              .map(trait => [trait.key, trait.levelCount]),
          ),
        },
      ];
      const result = await review.confirm({ ...confirm, choices });
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(result.errors.join('\n'));
      expect(openProject(result.value, { gameDataRepository: target }).kind).toBe('opened');
      expect(confirm.persistBackup).toHaveBeenCalledTimes(1);
      const backup = confirm.persistBackup.mock.calls[0]![0];
      expect(JSON.parse(backup.projectJson)).toEqual(before);
      expect(backup.sourceRevision).toBe(source.revision);
      expect(backup.sourceWeaponDefinitions).toEqual([source.getWeapon(slug)]);
      expect(backup.sourceWeaponDefinitions[0]).not.toBe(source.getWeapon(slug));
      expect(result.value.scenarios[0]!.tracks[0]).toMatchObject({
        id: 'track:stable',
        skillCasts: [],
      });
      expect(project).toEqual(before);
      expect(result.warnings).toHaveLength(Object.keys(choices[0]!.levels).length);
    },
  );

  it('chooses different added levels for the same weapon on different scenario instances', async () => {
    const project = projectFor();
    const second = createEmptyScenario('second', 'second');
    second.tracks[0] = structuredClone(project.scenarios[0]!.tracks[0]!);
    project.scenarios.push(second);
    const result = await prepare(project).confirm({
      ...input(project),
      choices: [
        ...selection(project, 2),
        { scenarioId: second.id, trackId: 'track:stable', levels: { skill2: 8 } },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.value.scenarios.map(scenario => scenario.tracks[0]!.weapon!.traitLevels)).toEqual(
      [
        [2, 2, 3],
        [2, 8, 3],
      ],
    );
  });

  it.each(['missing', 'out-of-range', 'unknown-key', 'unknown-track', 'duplicate'] as const)(
    'rejects %s choices before backup',
    async kind => {
      const project = projectFor();
      const confirm = input(project);
      const choices: readonly WeaponInstanceTraitLevelSelection[] =
        kind === 'missing'
          ? []
          : kind === 'duplicate'
            ? [...selection(project), ...selection(project)]
            : [
                {
                  ...selection(project)[0]!,
                  ...(kind === 'unknown-track' ? { trackId: 'missing' } : {}),
                  levels:
                    kind === 'unknown-key'
                      ? { skill1: 2 }
                      : { skill2: kind === 'out-of-range' ? 100 : 4 },
                },
              ];
      const result = await prepare(project).confirm({ ...confirm, choices });
      expect(result).toMatchObject({ ok: false, kind: 'invalid-choices' });
      expect(result).not.toHaveProperty('value');
      expect(confirm.persistBackup).not.toHaveBeenCalled();
    },
  );

  it('requires confirmation and rejects a second completion', async () => {
    const project = projectFor();
    const review = prepare(project);
    const confirm = input(project);
    expect(await review.confirm({ ...confirm, confirmed: false })).toMatchObject({
      kind: 'not-confirmed',
    });
    expect(confirm.persistBackup).not.toHaveBeenCalled();
    expect((await review.confirm(confirm)).ok).toBe(true);
    expect(await review.confirm(confirm)).toMatchObject({ kind: 'already-completed' });
    expect(confirm.persistBackup).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])(
    'fails closed on backup failure (throws=%s) and allows a retry',
    async throws => {
      const project = projectFor();
      const review = prepare(project);
      const confirm = input(project);
      const result = await review.confirm({
        ...confirm,
        persistBackup: async () => {
          if (throws) throw new Error('disk failed');
          return { ok: false, error: 'disk failed' };
        },
      });
      expect(result).toMatchObject({ ok: false, kind: 'backup-failed', errors: ['disk failed'] });
      expect(result).not.toHaveProperty('value');
      expect(project.gameDataRevision).toBe(source.revision);
      expect((await review.confirm(confirm)).ok).toBe(true);
    },
  );

  it.each(['before', 'during'] as const)('rejects a project edited %s backup', async when => {
    const project = projectFor();
    const review = prepare(project);
    const confirm = input(project);
    const edit = () => {
      project.scenarios[0]!.tracks[0]!.weapon!.potential = 4;
    };
    if (when === 'before') edit();
    else
      confirm.persistBackup.mockImplementation(async () => {
        edit();
        return { ok: true };
      });
    expect(await review.confirm(confirm)).toMatchObject({ ok: false, kind: 'stale' });
    expect(confirm.persistBackup).toHaveBeenCalledTimes(when === 'before' ? 0 : 1);
    expect(project.gameDataRevision).toBe(source.revision);
  });

  it.each(['source', 'target'] as const)(
    'detects same-revision %s definition drift, including during backup',
    async side => {
      const project = projectFor();
      const slug =
        side === 'source'
          ? 'freedom-to-proselytize'
          : registration.aliases['freedom-to-proselytize']!;
      const repository = options[side];
      const changed = structuredClone(repository.getWeapon(slug)!);
      const settings = {
        ...options,
        [side]: {
          ...repository,
          getWeapon: (key: string) => (key === slug ? changed : repository.getWeapon(key)),
        },
      };
      const review = prepare(project, settings);
      const confirm = input(project);
      confirm.persistBackup.mockImplementation(async () => {
        // 武器定义是只读接口，此处模拟仓库更新；不改共享正式定义。
        Object.assign(changed, { assetSlug: 'changed-after-preview' });
        return { ok: true };
      });
      expect(await review.confirm(confirm)).toMatchObject({ kind: 'stale' });
      expect(
        confirm.persistBackup.mock.calls[0]![0].sourceWeaponDefinitions[0]?.assetSlug,
      ).not.toBe('changed-after-preview');
    },
  );

  it('locks concurrent confirms and snapshots submitted choices before awaiting backup', async () => {
    const project = projectFor();
    const review = prepare(project);
    const confirm = input(project);
    let finish!: () => void;
    const waiting = new Promise<void>(resolve => {
      finish = resolve;
    });
    confirm.persistBackup.mockImplementation(async () => {
      await waiting;
      return { ok: true };
    });
    const first = review.confirm(confirm);
    confirm.choices[0]!.levels.skill2 = 8;
    expect(await review.confirm(confirm)).toMatchObject({ kind: 'busy' });
    finish();
    const result = await first;
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.value.scenarios[0]!.tracks[0]!.weapon!.traitLevels).toEqual([2, 4, 3]);
    expect(confirm.persistBackup).toHaveBeenCalledTimes(1);
  });

  it('does not let callers mutate preview, policy or backup into the committed document', async () => {
    const project = projectFor();
    const policy = { ...options, aliases: { ...options.aliases } };
    const review = prepare(project, policy);
    Object.assign(review.preview.instances[0]!.traits[0]!, { savedLevel: 9 });
    policy.aliases['freedom-to-proselytize'] = 'missing';
    const confirm = input(project);
    confirm.persistBackup.mockImplementation(async backup => {
      Object.assign(backup, { projectJson: '{}' });
      return { ok: true };
    });
    const result = await review.confirm(confirm);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.value.scenarios[0]!.tracks[0]!.weapon!.traitLevels).toEqual([2, 4, 3]);
    expect(review.preview.instances[0]!.traits[0]!.savedLevel).toBe(2);
  });

  it('skips custom templates and refuses choices targeting them', async () => {
    const project = projectFor();
    const id = 'project:weapon:custom';
    project.definitionLibrary!.weapons[id] = {
      id,
      name: 'custom',
      origin: { templateId: 'freedom-to-proselytize', gameDataRevision: source.revision },
      definition: { ...structuredClone(source.getWeapon('freedom-to-proselytize')!), slug: id },
    };
    project.scenarios[0]!.tracks[0]!.weapon!.weaponSlug = id;
    const review = prepare(project);
    expect(review.preview).toMatchObject({ customInstanceCount: 1, instances: [] });
    const confirm = input(project);
    expect(await review.confirm(confirm)).toMatchObject({ kind: 'invalid-choices' });
    const result = await review.confirm({ ...confirm, choices: [] });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.errors.join('\n'));
    expect(result.value.definitionLibrary).toEqual(project.definitionLibrary);
    expect(result.value.scenarios).toEqual(project.scenarios);
    expect(confirm.persistBackup.mock.calls[0]![0].sourceWeaponDefinitions).toEqual([]);
  });

  it('rejects wrong revisions, absent definitions and invalid original projects before review', () => {
    const project = projectFor();
    expect(prepareWeaponMigrationReview(project, { ...options, target: source }).ok).toBe(false);
    expect(
      prepareWeaponMigrationReview({ ...project, gameDataRevision: 'unknown' }, options).ok,
    ).toBe(false);
    expect(
      prepareWeaponMigrationReview(project, {
        ...options,
        aliases: { 'freedom-to-proselytize': 'missing' },
      }).ok,
    ).toBe(false);
    project.scenarios[0]!.tracks[0]!.weapon!.traitLevels = [];
    expect(prepareWeaponMigrationReview(project, options).ok).toBe(false);
  });
});
