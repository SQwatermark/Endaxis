import { describe, expect, it } from 'vitest';
import { createGameDataRepository } from '../../data/gameDataRepository';
import { perlica } from '../../data/operators/perlica';
import {
  sharedGearDefinitions,
  sharedGearSetDefinitions,
  sharedWeaponDefinitions,
} from '../../data/equipment';
import { createEmptyProject, createEmptyScenario } from './createProject';
import { validateProjectWithGameData } from './definitionValidation';
import { parseProjectDocument, serializeProjectDocument } from './serialization';
import {
  allocateProjectTemplateId,
  createProjectGameDataRepository,
  deriveProjectGearSetTemplateInLibrary,
  deriveProjectGearTemplateInLibrary,
  deriveProjectOperatorTemplate,
  deriveProjectWeaponTemplate,
  deriveProjectWeaponTemplateInLibrary,
  getProjectDefinitionLibrary,
  replaceProjectWeaponTemplateDefinition,
  switchTrackToCompatibleOperatorTemplate,
  switchTrackToCompatibleWeaponTemplate,
} from './projectDefinitionLibrary';

function operatorInstance(operatorSlug: string) {
  return {
    operatorSlug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 100,
    skillLevels: { basicAttack: 1, battleSkill: 1, comboSkill: 1, ultimate: 1 },
    talentStates: {},
  };
}

describe('projectDefinitionLibrary', () => {
  it('allocates template ids from persisted library contents instead of page state', () => {
    const library = {
      operators: {
        'project:operator:2': {} as never,
        'project:operator:named': {} as never,
        'project:operator:7': {} as never,
      },
      weapons: {},
      gears: {},
      gearSets: {},
    };

    expect(allocateProjectTemplateId(library, 'operator')).toBe('project:operator:8');
    expect(allocateProjectTemplateId(library, 'weapon')).toBe('project:weapon:1');
  });

  it('materializes a project operator template with immutable project identity and provenance', () => {
    const project = createEmptyProject({
      createdWith: 'test',
      gameDataRevision: 'definitions:test',
    });
    const next = deriveProjectOperatorTemplate(project, {
      id: 'project:operator:perlica-copy',
      name: '自定义佩丽卡',
      baseTemplateId: perlica.slug,
      definition: perlica,
    });

    const template = getProjectDefinitionLibrary(next).operators['project:operator:perlica-copy']!;
    expect(template.definition.slug).toBe('project:operator:perlica-copy');
    expect(template.definition.assetSlug).toBe(perlica.slug);
    expect(template.definition.displayName).toBe('自定义佩丽卡');
    expect(template.origin).toEqual({
      templateId: perlica.slug,
      gameDataRevision: 'definitions:test',
    });
    expect(perlica.slug).toBe('perlica');
  });

  it('exposes project templates to the same repository used by selectors and compilers', () => {
    const base = createGameDataRepository({ revision: 'definitions:test', operators: [perlica] });
    const project = deriveProjectOperatorTemplate(
      createEmptyProject({ createdWith: 'test', gameDataRevision: base.revision }),
      {
        id: 'project:operator:perlica-copy',
        name: '自定义佩丽卡',
        baseTemplateId: perlica.slug,
        definition: perlica,
      },
    );
    const repository = createProjectGameDataRepository(base, getProjectDefinitionLibrary(project));

    expect(repository.getOperator('project:operator:perlica-copy')?.assetSlug).toBe('perlica');
    expect(repository.getOperators().map(value => value.slug)).toEqual([
      'perlica',
      'project:operator:perlica-copy',
    ]);
  });

  it('stores custom weapons, gear and gear sets in the same project catalog', () => {
    const weapon = sharedWeaponDefinitions[0]!;
    const gear = sharedGearDefinitions[0]!;
    const gearSet = sharedGearSetDefinitions[0]!;
    let library = getProjectDefinitionLibrary(
      createEmptyProject({ createdWith: 'test', gameDataRevision: 'definitions:test' }),
    );
    library = deriveProjectWeaponTemplateInLibrary(library, 'definitions:test', {
      id: 'project:weapon:copy',
      name: '自定义武器',
      baseTemplateId: weapon.slug,
      definition: weapon,
    });
    library = deriveProjectGearTemplateInLibrary(library, 'definitions:test', {
      id: 'project:gear:copy',
      name: '自定义装备',
      baseTemplateId: gear.slug,
      definition: gear,
    });
    library = deriveProjectGearSetTemplateInLibrary(library, 'definitions:test', {
      id: 'project:gearSet:copy',
      name: '自定义套装',
      baseTemplateId: gearSet.slug,
      definition: gearSet,
    });

    expect(library.weapons['project:weapon:copy']?.definition).toMatchObject({
      slug: 'project:weapon:copy',
      assetSlug: weapon.slug,
    });
    expect(library.gears['project:gear:copy']?.definition).toMatchObject({
      slug: 'project:gear:copy',
      assetSlug: gear.slug,
    });
    expect(library.gearSets['project:gearSet:copy']?.definition.slug).toBe('project:gearSet:copy');
  });

  it('derives and atomically switches an equipped weapon template', () => {
    const weapon = sharedWeaponDefinitions[0]!;
    const project = deriveProjectWeaponTemplate(
      createEmptyProject({ createdWith: 'test', gameDataRevision: 'definitions:test' }),
      {
        id: 'project:weapon:1',
        name: '自定义武器',
        baseTemplateId: weapon.slug,
        definition: weapon,
      },
    );
    const scenario = createEmptyScenario('scenario', 'Scenario');
    scenario.tracks[0] = {
      id: 'track:weapon',
      operator: operatorInstance(perlica.slug),
      weapon: {
        weaponSlug: weapon.slug,
        level: 90,
        tuned: true,
        potential: 2,
        traitLevels: weapon.traits.map(() => 9),
      },
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const custom = getProjectDefinitionLibrary(project).weapons['project:weapon:1']!.definition;

    const next = switchTrackToCompatibleWeaponTemplate(scenario, 0, custom.slug, custom);

    expect(next.tracks[0]!.weapon).toEqual({
      ...scenario.tracks[0]!.weapon,
      weaponSlug: 'project:weapon:1',
    });

    const projectWithScenario = { ...project, scenarios: [next] };
    const replacement = {
      ...custom,
      displayName: '调整后的武器',
      traits: custom.traits.map((trait, index) => ({
        ...trait,
        levelCount: index === 0 ? 2 : trait.levelCount,
      })),
    };
    const replaced = replaceProjectWeaponTemplateDefinition(
      projectWithScenario,
      custom.slug,
      replacement,
    );

    expect(getProjectDefinitionLibrary(replaced).weapons[custom.slug]?.name).toBe('调整后的武器');
    expect(replaced.scenarios[0]?.tracks[0]?.weapon?.traitLevels[0]).toBe(2);
  });

  it('switches a track to a freshly derived compatible template without changing casts', () => {
    const scenario = createEmptyScenario('scenario', 'Scenario');
    const battleGroup = perlica.skillGroups.find(group => group.key === 'battleSkill')!;
    const battleSkill = Array.isArray(battleGroup.skills)
      ? battleGroup.skills[0]!
      : battleGroup.skills;
    scenario.tracks[0] = {
      id: 'track:1',
      operator: operatorInstance(perlica.slug),
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [
        {
          id: 'cast:1',
          source: {
            kind: 'operatorSkill',
            skillGroupKey: battleGroup.key,
            skillKey: battleSkill.key,
          },
          placement: { startFrame: 30 },
        },
      ],
    };
    const custom = structuredClone({ ...perlica, slug: 'project:operator:perlica-copy' });

    const next = switchTrackToCompatibleOperatorTemplate(scenario, 0, perlica, custom.slug, custom);

    expect(next.tracks[0]!.operator?.operatorSlug).toBe(custom.slug);
    expect(next.tracks[0]!.skillCasts).toEqual(scenario.tracks[0]!.skillCasts);
    expect(next.tracks[0]!.skillCasts).toBe(scenario.tracks[0]!.skillCasts);
  });

  it('round-trips project templates and resolves their instances through base-data validation', () => {
    const base = createGameDataRepository({ revision: 'definitions:test', operators: [perlica] });
    let project = deriveProjectOperatorTemplate(
      createEmptyProject({ createdWith: 'test', gameDataRevision: base.revision }),
      {
        id: 'project:operator:persisted',
        name: '项目干员',
        baseTemplateId: perlica.slug,
        definition: perlica,
      },
    );
    const scenario = project.scenarios[0]!;
    scenario.tracks[0] = {
      id: 'track:project-template',
      operator: operatorInstance('project:operator:persisted'),
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    project = { ...project, scenarios: [scenario] };

    expect(validateProjectWithGameData(project, base).ok).toBe(true);
    const parsed = parseProjectDocument(serializeProjectDocument(project));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.value.definitionLibrary?.operators['project:operator:persisted']?.name).toBe(
      '项目干员',
    );
  });
});
