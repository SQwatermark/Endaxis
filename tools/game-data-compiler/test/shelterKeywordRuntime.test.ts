import { describe, expect, it } from 'vitest';
import fixture from './fixtures/ember-shelter-buffs.json';
import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { parseKnownNativeActionLeafSource } from '../src/source/actionLeaf.ts';
import { compileStandardStumpBuffClosure } from '../src/compiler/standardStumpBuffClosure.ts';
import { compileOperatorBuffDefinitions } from '../../../src/next/core/compiler/compileSkill';
import { CombatAttributeSet } from '../../../src/next/core/combat/attributes/combatAttributes';
import { CombatBuffContainer } from '../../../src/next/core/combat/buffs/combatBuffs';
import { CompiledCombatBuffDefinitions } from '../../../src/next/core/combat/buffs/combatBuffDefinitions';
import { BuffDefinitionOperationTarget } from '../../../src/next/core/combat/runtime/buffDefinitionOperationTarget';
import { BuffOperationExecutor } from '../../../src/next/core/combat/runtime/buffOperationExecutor';

const rootId = 'buff_chr_0009_azrila_normal_skill_shelter';
const carrierId = 'buff_common_affixes_shelter';
const childId = 'buff_common_affixes_shelter_default_child';
const tag = 'Skill/Character/Common/Affixes/Shelter';
const action = fixture[rootId].buffEventAction[0]!.actions[0]!.actionData[0]!;

function compile(owner?: 'caster' | 'enemy') {
  return compileStandardStumpBuffClosure(
    [rootId],
    fixture,
    undefined,
    undefined,
    undefined,
    undefined,
    owner === undefined ? new Map() : new Map([[rootId, owner]]),
    new Set(),
    fixtureGameplayTagRegistry,
  );
}

describe('庇护复用关键词载体，不把标签和子 Buff 当减伤一起删除', () => {
  it('原生无 subType；载体 ID 来自公共原生映射，严格拒绝多余字段', () => {
    expect(parseKnownNativeActionLeafSource(action, 'shelter', {})).toMatchObject({
      family: 'keywordBuff',
      action: {
        keyword: 'Shelter',
        subType: null,
        carrierBuffId: carrierId,
        source: { targetSource: 'Owner' },
        target: { targetSource: 'Owner' },
      },
    });
    expect(() =>
      parseKnownNativeActionLeafSource({ ...action, subType: 'All' }, 'shelter', {}),
    ).toThrow(/subType/);
  });

  it.each([undefined, 'enemy'] as const)('Owner=%s 未证明与施术者相同，不偷换关键词来源', owner => {
    expect(compile(owner).diagnostics).toContainEqual(
      expect.objectContaining({
        status: 'blocked',
        reason: expect.stringContaining('source/target environment'),
      }),
    );
  });

  it.each(['finish', 'expiry'] as const)('原始四链自动加载，优先级和标签随 %s 清理', ending => {
    const closure = compile('caster');
    expect(closure.diagnostics.filter(item => item.status === 'blocked')).toEqual([]);
    expect([...closure.sources.keys()].sort()).toEqual(Object.keys(fixture).sort());
    expect(closure.definitions[carrierId]).toMatchObject({
      stackingType: 'highPriority',
      priority: { blackboardKey: 'rate' },
      applyTags: [tag],
      attributeModifiers: [
        {
          attribute: 'shelterDamageMultiplier',
          slot: 'baseAddition',
          value: { blackboardKey: 'rate' },
        },
      ],
    });
    const definitions = compileOperatorBuffDefinitions(closure.definitions);
    const attributes = new CombatAttributeSet<string>();
    attributes.define('shelterDamageMultiplier', 0, {});
    const container = new CombatBuffContainer('operator', attributes);
    const target = new BuffDefinitionOperationTarget(container, {
      get: () => undefined,
      compile: entry =>
        new CompiledCombatBuffDefinitions<string>('shelter', [entry], {
          emitElementalInflictionStarted: () => {
            throw new Error('unexpected infliction');
          },
        }).get(entry.id)!,
    });
    target.configureLifecycleOperations(
      source =>
        new BuffOperationExecutor({
          sourceId: source.sourceId,
          sourceActionId: source.sourceActionId,
          resolveBuffDefinition: id => definitions[id],
          resolveTarget: () => target,
          resolveEventTarget: id => {
            expect(id).toBe('operator');
            return target;
          },
          delegate: {
            execute: () => {
              throw new Error('unexpected action');
            },
            evaluate: () => false,
          },
        }),
    );
    const apply = (rate: number) =>
      target.applyScoped({
        buffId: rootId,
        definition: definitions[rootId],
        sourceId: 'operator',
        blackboardValues: { duration: 2, rate },
      })!;
    const lower = apply(0.2);
    const higher = apply(0.4);
    expect(attributes.get('shelterDamageMultiplier')).toBeCloseTo(0.4);
    expect(container.buffs.some(buff => buff.definition.id === childId)).toBe(true);
    expect(container.getInstanceCountByTags([tag], 'hasAny', true)).toBe(2);
    higher.finish('other');
    expect(attributes.get('shelterDamageMultiplier')).toBeCloseTo(0.2);
    expect(container.getInstanceCountByTags([tag], 'hasAny', true)).toBe(1);
    if (ending === 'finish') lower.finish('other');
    else container.tick(2);
    expect(attributes.get('shelterDamageMultiplier')).toBe(0);
    expect(container.getInstanceCountByTags([tag], 'hasAny', true)).toBe(0);
    // applyTags 是 Buff 分类，不伪装成实体状态标签。
    expect(container.matchesEntityTags([tag], 'hasAny', true)).toBe(false);
  });
});
