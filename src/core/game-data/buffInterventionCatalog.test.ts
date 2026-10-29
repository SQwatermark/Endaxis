import { CombatBuffContainer } from '../combat/buffs/combatBuffs';
import { CombatAttributeSet } from '../combat/attributes/combatAttributes';
import { describe, expect, it } from 'vitest';
import { createGameDataRepository } from '../../data/createGameDataRepository';
import perlica from '../../data/operators/perlica.generated';
import { gameDataRepository } from '../../data/gameDataRepository';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs';
import type { WeaponDefinition, GearDefinition } from './equipmentDefinition';
import {
  buffInterventionReferenceKey,
  compileBuffInterventionResource,
  indexBuffInterventionDefinitions,
  listBuffInterventionCatalog,
  resolveBuffInterventionEntry,
} from './buffInterventionCatalog';

const plain: SkillBuffDefinition = { stackingType: 'unlimited', applyTags: ['Status/UnLockable'] };
const weapon = (buffDefinitions: WeaponDefinition['buffDefinitions']): WeaponDefinition => ({
  slug: 'weapon',
  rarity: 6,
  weaponType: 'funnel',
  baseAttackAtLevelNodes: [1],
  traits: [],
  buffDefinitions,
});

it('keeps source-qualified identity and disables ambiguous native IDs instead of choosing an origin', () => {
  const gear: GearDefinition & { buffDefinitions: { fromGear: SkillBuffDefinition } } = {
    slug: 'gear',
    slotType: 'armor',
    levelRequirement: 1,
    baseDefense: 0,
    traits: [],
    buffDefinitions: { fromGear: plain },
  };
  const repository = createGameDataRepository({
    revision: 'catalog',
    operators: [{ ...perlica, buffDefinitions: { shared: plain } }],
    weapons: [weapon({ shared: plain })],
    gears: [gear],
    gearSets: [{ slug: 'set', buffDefinitions: { setBuff: plain } }],
    commonDefinitionSources: ['common-buffs', 'contingency-contracts', 'consumables'].map(id => ({
      id,
      buffDefinitions: { [id]: plain },
    })),
  });
  const catalog = listBuffInterventionCatalog(repository);
  expect(new Set(catalog.map(entry => entry.reference.kind))).toEqual(
    new Set(['operator', 'weapon', 'gear', 'gearSet', 'common']),
  );
  const duplicate = catalog.filter(entry => entry.reference.buffId === 'shared');
  expect(duplicate).toHaveLength(2);
  expect(duplicate[0]!.key).not.toBe(duplicate[1]!.key);
  expect(duplicate.every(entry => !entry.support.apply && !entry.support.suppress)).toBe(true);
  expect(indexBuffInterventionDefinitions(catalog).get(plain)).toHaveLength(catalog.length);
  for (const entry of duplicate) {
    expect(resolveBuffInterventionEntry(repository, entry.reference)?.support).toEqual(
      entry.support,
    );
    expect(() => compileBuffInterventionResource(repository, entry.reference)).toThrow('同 ID');
  }
  expect(
    resolveBuffInterventionEntry(repository, {
      kind: 'operator',
      sourceId: 'missing',
      buffId: 'shared',
    }),
  ).toBeNull();
});

it('only exposes supported numeric parameters declared by this Buff and preserves defaults', () => {
  const definition: SkillBuffDefinition = {
    stackingType: 'refresh',
    durationSeconds: { blackboardKey: 'duration' },
    blackboard: { duration: 3, power: 0.2, internalCounter: 0 },
    attributeModifiers: [
      { attribute: 'Atk', slot: 'multiplier', value: { blackboardKey: 'power' } },
    ],
  };
  const repository = createGameDataRepository({
    revision: 'parameters',
    commonDefinitionSources: [{ id: 'parameters', buffDefinitions: { buff: definition } }],
  });
  const reference = { kind: 'common', sourceId: 'parameters', buffId: 'buff' } as const;
  const entry = resolveBuffInterventionEntry(repository, reference)!;
  expect(entry.support.apply).toBe(true);
  expect(entry.support.targets).toEqual(['operator']);
  expect(entry.support.parameters.map(parameter => [parameter.key, parameter.required])).toEqual([
    ['duration', false],
    ['power', false],
  ]);
  expect(compileBuffInterventionResource(repository, reference).blackboard?.power).toBe(0.2);
  expect(
    compileBuffInterventionResource(repository, reference, { power: 0 }).blackboard?.power,
  ).toBe(0);
  expect(() => compileBuffInterventionResource(repository, reference, { unowned: 0 })).toThrow(
    '未声明',
  );
  expect(() =>
    compileBuffInterventionResource(repository, reference, { power: 0.2, internalCounter: 1 }),
  ).toThrow('未开放');
  expect(
    compileBuffInterventionResource(repository, reference, { power: 0.2, duration: -1 }).blackboard
      ?.duration,
  ).toBe(-1);
  expect(() => compileBuffInterventionResource(repository, reference, { power: Infinity })).toThrow(
    'power',
  );
  expect(() =>
    compileBuffInterventionResource({ ...repository, getOperators: undefined }, reference, {
      power: 0.2,
    }),
  ).toThrow('完整目录');
  const compiled = compileBuffInterventionResource(repository, reference, { power: 0.2 });
  expect(compiled.blackboard).toEqual({ duration: 3, internalCounter: 0, power: 0.2 });
  expect(definition.blackboard).toEqual({ duration: 3, power: 0.2, internalCounter: 0 });
});

it('shows GlobalBuff parents separately and keeps their mirrors out of independent application', () => {
  const repository = createGameDataRepository({
    revision: 'global',
    commonDefinitionSources: [
      { id: 'mirrors', buffDefinitions: { mirror: plain } },
      {
        id: 'contracts',
        catalogGraphs: [
          {
            main: {
              nodes: {
                create: {
                  action: {
                    kind: 'createGlobalBuff',
                    parameters: {
                      globalBuffId: 'parent',
                      definition: {
                        stackingType: 'unlimited',
                        blackboard: {},
                        children: [{ buffId: 'mirror', blackboardAssignments: {} }],
                      },
                    },
                  },
                  next: null,
                },
              },
            },
            macros: {},
          },
        ],
      },
    ],
  });
  const catalog = listBuffInterventionCatalog(repository);
  const parent = catalog.find(entry => entry.reference.resourceKind === 'global')!;
  const mirror = catalog.find(entry => entry.reference.buffId === 'mirror')!;
  expect(parent.definition).toBeUndefined();
  expect(parent.globalDefinition?.children[0]?.buffId).toBe('mirror');
  expect(parent.support).toMatchObject({ apply: false, finish: false, suppress: false });
  expect(mirror.support).toMatchObject({ apply: false, suppress: false });
  expect(mirror.support.suppressionReasons.join(' ')).toContain('局部抑制');
  expect(mirror.support.reasons.join(' ')).toContain('子镜像');
  expect(buffInterventionReferenceKey(parent.reference)).not.toBe(
    buffInterventionReferenceKey({ ...parent.reference, resourceKind: undefined }),
  );
});

describe('real generated catalog', () => {
  it('offers a real static Perlica Buff and rejects her event-bound launcher', () => {
    const reference = {
      kind: 'operator',
      sourceId: 'perlica',
      buffId: 'buff_chr_0004_pelica_potential_3_atkup',
    } as const;
    const staticBuff = resolveBuffInterventionEntry(gameDataRepository, reference)!;
    expect(staticBuff.support.apply).toBe(true);
    expect(staticBuff.support.targets).toEqual(['operator']);
    const compiled = compileBuffInterventionResource(gameDataRepository, reference);
    expect(compiled.attributeModifiers?.[0]?.attribute).toBe('Atk');
    const launcher = resolveBuffInterventionEntry(gameDataRepository, {
      ...reference,
      buffId: 'buff_chr_0004_pelica_potential_3',
    })!;
    expect(launcher.support.apply).toBe(false);
    expect(launcher.support.suppress).toBe(true); // unique event-bound Buffs can still be suppressed
    expect(launcher.support.reasons.join(' ')).toContain('事件响应');
  });
  it('does not mistake a real null lifecycle entry for a standalone Buff', () => {
    const entry = resolveBuffInterventionEntry(gameDataRepository, {
      kind: 'operator',
      sourceId: 'typhoeus',
      buffId: 'buff_chr_0034_typhoea_normal_skill_arrow_energy',
    })!;
    expect(entry.definition?.lifecycleSequences?.start).toEqual([{ $sequence: null }]);
    expect(entry.support.apply).toBe(false);
    expect(entry.support.reasons.join(' ')).toContain('生命周期');
    expect(entry.support.suppress).toBe(true);
  });
});

it('discovers the real contract GlobalBuff parent while refusing target-local control of its mirrors', () => {
  const catalog = listBuffInterventionCatalog(gameDataRepository);
  const parent = catalog.find(
    entry =>
      entry.reference.kind === 'common' &&
      entry.reference.sourceId === 'contingency-contracts' &&
      entry.reference.resourceKind === 'global' &&
      entry.reference.buffId === 'global_buff_cc_chr_combo_special_cc0',
  );
  expect(parent?.globalDefinition?.children.map(child => child.buffId)).toEqual([
    'buff_cc_chr_combo_special_cc0',
  ]);
  expect(parent?.support).toMatchObject({ apply: false, finish: false, suppress: false });
  const mirror = catalog.find(
    entry =>
      entry.reference.kind === 'common' &&
      entry.reference.sourceId === 'contingency-contracts' &&
      entry.reference.resourceKind === undefined &&
      entry.reference.buffId === 'buff_cc_chr_combo_special_cc0',
  );
  expect(mirror?.support).toMatchObject({ apply: false, finish: false, suppress: false });
  expect(mirror?.support.suppressionReasons.join(' ')).toContain('局部抑制');
});

it('preserves native zero/negative stack caps and negative lifetime parameters', () => {
  const definition = {
    stackingType: 'enhance',
    maxStackCount: { blackboardKey: 'cap' },
    durationSeconds: { blackboardKey: 'duration' },
    blackboard: { cap: 0, duration: -1 },
  } as const satisfies SkillBuffDefinition;
  const repository = createGameDataRepository({
    revision: 'native-parameters',
    commonDefinitionSources: [{ id: 'native', buffDefinitions: { buff: definition } }],
  });
  const reference = { kind: 'common', sourceId: 'native', buffId: 'buff' } as const;
  expect(compileBuffInterventionResource(repository, reference).blackboard).toEqual({
    cap: 0,
    duration: -1,
  });
  for (const cap of [0, -1]) {
    const compiled = compileBuffInterventionResource(repository, reference, { cap });
    const container = new CombatBuffContainer('enemy', new CombatAttributeSet<string>());
    const buff = container.add(
      { ...definition, id: 'buff', blackboard: compiled.blackboard },
      'source',
    )!;
    expect(buff.remainingDuration).toBeNull();
    expect(
      container.add({ ...definition, id: 'buff', blackboard: compiled.blackboard }, 'source'),
    ).toBe(buff);
    expect(buff.enhanceCount).toBe(2);
  }
  for (const cap of [0.5, Number.MAX_SAFE_INTEGER + 1])
    expect(() => compileBuffInterventionResource(repository, reference, { cap })).toThrow('cap');
});

it('accepts real generated zero cap defaults and keeps the native positive growth-period exception', () => {
  for (const reference of [
    { kind: 'operator', sourceId: 'da-pan', buffId: 'buff_chr_0018_dapan_talent_0_dmg_up' },
    { kind: 'weapon', sourceId: 'wpn_claym_0004', buffId: 'buff_wpn_claym_0004_phy_damage_up' },
  ] as const)
    expect(() => compileBuffInterventionResource(gameDataRepository, reference)).not.toThrow();
  const growing = {
    kind: 'operator',
    sourceId: 'typhoeus',
    buffId: 'buff_chr_0034_typhoea_passive_arrowrecover_exitfight',
  } as const;
  expect(() => compileBuffInterventionResource(gameDataRepository, growing)).not.toThrow();
  expect(() =>
    compileBuffInterventionResource(gameDataRepository, growing, { arrow_recover_time: 0 }),
  ).toThrow('增长周期');
});

it('diagnoses undeclared template inputs without exposing or accepting them as user parameters', () => {
  const catalog = listBuffInterventionCatalog(gameDataRepository);
  const templates = catalog.filter(
    entry => entry.reference.kind === 'common' && entry.reference.sourceId === 'consumables',
  );
  expect(templates).toHaveLength(14);
  for (const entry of templates) {
    expect(entry.definition?.blackboard).toEqual({});
    expect(entry.support.parameters).toEqual([]);
    expect(entry.support.apply).toBe(false);
    expect(entry.support.reasons.join(' ')).toContain('未声明的黑板键');
    expect(() =>
      compileBuffInterventionResource(gameDataRepository, entry.reference, {
        duration: 300,
        value: 0,
      }),
    ).toThrow('未声明');
    expect(() => compileBuffInterventionResource(gameDataRepository, entry.reference)).toThrow(
      /未声明的黑板键.*duration/,
    );
  }
});
