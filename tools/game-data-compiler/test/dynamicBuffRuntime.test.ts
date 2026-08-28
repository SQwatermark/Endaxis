import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { describe, expect, it } from 'vitest';
import carriers from './fixtures/avywenna-vulnerable-buffs.json';
import children from './fixtures/avywenna-vulnerable-children.json';
import { compileBuffRuntimeDefinitionSource } from '../src/compiler/buffRuntimeProjection.ts';
import { compileStandardStumpBuffClosure } from '../src/compiler/standardStumpBuffClosure.ts';
import { parseBuffRuntimeSource } from '../src/source/buffRuntime.ts';
import { compileOperatorBuffDefinitions } from '../../../src/next/core/compiler/compileSkill';
import { CombatAttributeSet } from '../../../src/next/core/combat/attributes/combatAttributes';
import { CombatBuffContainer } from '../../../src/next/core/combat/buffs/combatBuffs';
import { CompiledCombatBuffDefinitions } from '../../../src/next/core/combat/buffs/combatBuffDefinitions';
import { BuffDefinitionOperationTarget } from '../../../src/next/core/combat/runtime/buffDefinitionOperationTarget';
import { BuffOperationExecutor } from '../../../src/next/core/combat/runtime/buffOperationExecutor';

const carrierId = 'buff_common_affixes_vulnerable_pulse';
const childId = 'buff_common_affixes_vulnerable_pulse_default_child';

describe('原始易伤载体的动态子 Buff → 正式编译和运行端口', () => {
  it.each(['finish', 'disable', 'expiry'] as const)(
    '原始载体按黑板查表，保留来源/施放身份和 %s 清理',
    ending => {
      // 本回归显式装入待验证目录，不冒充已实现动态依赖的自动闭包推导。
      const childClosure = compileStandardStumpBuffClosure(
        [childId],
        children,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        fixtureGameplayTagRegistry,
      );
      expect(childClosure.diagnostics.every(item => item.status === 'scenario-omitted')).toBe(true);
      const carrier = compileBuffRuntimeDefinitionSource(
        parseBuffRuntimeSource(carriers[carrierId], carrierId),
        undefined,
        undefined,
        undefined,
        undefined,
        { gameplayTagRegistry: fixtureGameplayTagRegistry, ...{} },
      );
      expect(carrier.lifecycleSequences?.enable?.steps[0]).toMatchObject({
        kind: 'applyBuff',
        parameters: {
          buffId: { blackboardKey: 'child_buff_id' },
          target: 'buffOwner',
          source: 'buffOwner',
          inheritSourceSkillCastInfo: true,
          asChildBuff: true,
          finishByAction: true,
        },
      });
      const definitions = compileOperatorBuffDefinitions({
        ...childClosure.definitions,
        [carrierId]: carrier,
      });
      const attributes = new CombatAttributeSet<string>();
      attributes.define('electricVulnerabilityIncrease', 0, { minimum: -10, maximum: 10 });
      const container = new CombatBuffContainer('enemy', attributes);
      const target = new BuffDefinitionOperationTarget(container, {
        get: () => undefined,
        compile: entry =>
          new CompiledCombatBuffDefinitions<string>('raw-carrier', [entry], {
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
              expect(id).toBe('enemy');
              return target;
            },
            delegate: {
              execute: () => {
                throw new Error('unexpected delegate');
              },
              evaluate: () => false,
            },
          }),
      );
      const castInfo = {
        skillCastId: 7,
        originSkillId: 'ultimate',
        originSkillType: 'ultimate' as const,
        nonReturnedSpCost: 0,
      };
      const parent = target.applyScoped({
        buffId: carrierId,
        definition: definitions[carrierId],
        sourceId: 'operator',
        blackboardValues: { duration: 2, rate: 0.3 },
        skillCastInfo: castInfo,
      })!;
      expect(container.buffs.map(buff => buff.definition.id)).toEqual([childId, carrierId]);
      const child = container.buffs[0]!;
      expect(child.sourceId).toBe('enemy');
      expect(child.skillCastInfo).toEqual(castInfo);
      expect(child.blackboard.getNumber('rate')).toBeCloseTo(0.3);
      expect(attributes.get('electricVulnerabilityIncrease')).toBeCloseTo(0.3);
      if (ending === 'finish') parent.finish('other');
      else if (ending === 'disable') container.buffs[1]!.disable();
      else container.tick(2);
      expect(child.isFinished).toBe(true);
      expect(container.buffs[1]!.isFinished).toBe(ending !== 'disable');
      expect(attributes.get('electricVulnerabilityIncrease')).toBe(0);
    },
  );

  it('动态引用不因残留 ID 恰好属于表现 Buff 而被过滤', () => {
    const source = structuredClone(carriers[carrierId]);
    const action = source.buffEventAction[0]!.actions[0]!.actionData[0]!;
    action.buffs[0]!.buffId = 'stale-visual';
    const definition = compileBuffRuntimeDefinitionSource(
      parseBuffRuntimeSource(source, carrierId),
      new Set(['stale-visual']),
      undefined,
      undefined,
      undefined,
      { gameplayTagRegistry: fixtureGameplayTagRegistry, ...{} },
    );
    expect(definition.lifecycleSequences?.enable?.steps[0]).toMatchObject({
      kind: 'applyBuff',
      parameters: { buffId: { blackboardKey: 'child_buff_id' } },
    });
  });
});
